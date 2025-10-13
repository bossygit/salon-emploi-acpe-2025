const Registration = require('../models/Registration');
const { sendConfirmationEmail } = require('../utils/emailService');
const { sanitizeRegistrationData, validateRegistrationData, handleError } = require('../utils/helpers');
const fs = require('fs');
const path = require('path');

// @desc    Créer une nouvelle inscription
// @route   POST /api/registration
// @access  Public
const createRegistration = async (req, res) => {
  try {
    // S'assurer que le dossier uploads/cv existe
    const uploadDir = path.join(__dirname, '../uploads/cv');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Nettoyer et valider les données
    const sanitizedData = sanitizeRegistrationData(req.body);
    const validationErrors = validateRegistrationData(sanitizedData);

    // Log pour debug (à supprimer en production)
    if (process.env.NODE_ENV === 'development' && validationErrors.length > 0) {
      console.log('🔍 Erreurs de validation:', validationErrors);
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: validationErrors
      });
    }

    // Vérifier si l'email ou le téléphone existe déjà
    const existingRegistration = await Registration.findOne({
      $or: [
        { email: sanitizedData.email },
        { telephone: sanitizedData.telephone }
      ]
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'Une inscription avec cet email ou ce téléphone existe déjà',
        field: existingRegistration.email === sanitizedData.email ? 'email' : 'telephone'
      });
    }

    // Ajouter les métadonnées
    sanitizedData.ipAddress = req.ip || req.connection.remoteAddress;
    sanitizedData.userAgent = req.get('User-Agent');

    // Générer le numéro d'inscription
    // Générer un numéro d'inscription unique
    let numeroInscription;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const count = await Registration.countDocuments();
      numeroInscription = `SALON2025-${String(count + 1 + attempts).padStart(6, '0')}`;
      
      // Vérifier si ce numéro existe déjà
      const existing = await Registration.findOne({ numeroInscription });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }
    
    if (!isUnique) {
      // Fallback avec timestamp si on n'arrive pas à générer un numéro unique
      numeroInscription = `SALON2025-${Date.now().toString().slice(-6)}`;
    }
    
    sanitizedData.numeroInscription = numeroInscription;

    // Créer l'inscription
    const registration = new Registration(sanitizedData);
    await registration.save();

    // Générer le QR code
    const qrData = registration.generateQRCode();
    const QRCode = require('qrcode');
    const qrCodeImage = await QRCode.toDataURL(qrData, {
      width: parseInt(process.env.QR_CODE_SIZE) || 200,
      margin: parseInt(process.env.QR_CODE_MARGIN) || 4,
      color: {
        dark: '#1B80BF',
        light: '#FFFFFF'
      }
    });

    // Mettre à jour avec le QR code
    registration.qrCode = {
      data: qrData,
      image: qrCodeImage
    };
    await registration.save();

    // Envoyer l'email de confirmation
    try {
      await sendConfirmationEmail(registration);
      console.log('✅ Email de confirmation envoyé à:', registration.email);
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError);
      // Ne pas faire échouer l'inscription si l'email échoue
    }

    res.status(201).json({
      success: true,
      message: 'Inscription créée avec succès',
      data: {
        numeroInscription: registration.numeroInscription,
        nom: registration.nom,
        prenom: registration.prenom,
        email: registration.email,
        qrCode: qrCodeImage,
        statut: registration.statut
      }
    });

  } catch (error) {
    console.error('Erreur création inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'inscription',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
    });
  }
};

// @desc    Récupérer une inscription par numéro
// @route   GET /api/registration/:numero
// @access  Public
const getRegistrationByNumber = async (req, res) => {
  try {
    const registration = await Registration.findByRegistrationNumber(req.params.numero);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée'
      });
    }

    res.json({
      success: true,
      data: registration.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur récupération inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'inscription'
    });
  }
};

// @desc    Vérifier si un email est déjà inscrit
// @route   GET /api/registration/check/:email
// @access  Public
const checkEmail = async (req, res) => {
  try {
    const registration = await Registration.findByEmail(req.params.email);
    
    res.json({
      success: true,
      exists: !!registration,
      data: registration ? {
        numeroInscription: registration.numeroInscription,
        nom: registration.nom,
        prenom: registration.prenom,
        statut: registration.statut
      } : null
    });

  } catch (error) {
    console.error('Erreur vérification email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification'
    });
  }
};

// @desc    Vérifier si un téléphone est déjà inscrit
// @route   GET /api/registration/check-phone/:phone
// @access  Public
const checkPhone = async (req, res) => {
  try {
    const registration = await Registration.findByPhone(req.params.phone);
    
    res.json({
      success: true,
      exists: !!registration,
      data: registration ? {
        numeroInscription: registration.numeroInscription,
        nom: registration.nom,
        prenom: registration.prenom,
        statut: registration.statut
      } : null
    });

  } catch (error) {
    console.error('Erreur vérification téléphone:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification'
    });
  }
};

// @desc    Obtenir les statistiques publiques
// @route   GET /api/registration/stats/public
// @access  Public
const getPublicStats = async (req, res) => {
  try {
    const stats = await Registration.getStatistics();
    
    res.json({
      success: true,
      data: {
        totalInscriptions: stats.total,
        inscriptionsConfirmees: stats.confirmes,
        inscriptionsAnnulees: stats.annules
      }
    });

  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

// @desc    Vérifier une inscription via QR code
// @route   POST /api/registration/verify-qr
// @access  Public
const verifyQRCode = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'Données QR code manquantes'
      });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Format QR code invalide'
      });
    }

    // Vérifier que les données essentielles sont présentes
    if (!parsedData.numeroInscription) {
      return res.status(400).json({
        success: false,
        message: 'Numéro d\'inscription manquant dans le QR code'
      });
    }

    // Rechercher l'inscription dans la base de données
    const registration = await Registration.findByRegistrationNumber(parsedData.numeroInscription);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée',
        data: {
          numeroInscription: parsedData.numeroInscription,
          status: 'not_found'
        }
      });
    }

    // Vérifier la cohérence des données
    const isDataConsistent = 
      registration.nom === parsedData.nom &&
      registration.prenom === parsedData.prenom &&
      registration.email === parsedData.email &&
      registration.telephone === parsedData.telephone;

    if (!isDataConsistent) {
      return res.status(400).json({
        success: false,
        message: 'Données QR code incohérentes avec la base de données',
        data: {
          numeroInscription: parsedData.numeroInscription,
          status: 'data_mismatch'
        }
      });
    }

    // Vérifier le statut de l'inscription
    if (registration.statut === 'annule') {
      return res.status(400).json({
        success: false,
        message: 'Cette inscription a été annulée',
        data: {
          numeroInscription: registration.numeroInscription,
          statut: registration.statut,
          status: 'cancelled'
        }
      });
    }

    // Marquer l'entrée si c'est la première fois
    let entryMarked = false;
    if (!registration.entryMarked) {
      registration.entryMarked = true;
      registration.entryTime = new Date();
      await registration.save();
      entryMarked = true;
    }

    // Retourner les informations de vérification
    res.json({
      success: true,
      message: 'Vérification QR code réussie',
      data: {
        numeroInscription: registration.numeroInscription,
        nom: registration.nom,
        prenom: registration.prenom,
        email: registration.email,
        telephone: registration.telephone,
        statut: registration.statut,
        entryMarked: entryMarked,
        entryTime: registration.entryTime,
        createdAt: registration.createdAt,
        status: 'verified'
      }
    });

  } catch (error) {
    console.error('Erreur vérification QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification QR code'
    });
  }
};

// @desc    Scanner et vérifier un QR code (pour interface admin)
// @route   POST /api/registration/scan-qr
// @access  Public (devrait être protégé en production)
const scanQRCode = async (req, res) => {
  try {
    const { qrCodeImage } = req.body;

    if (!qrCodeImage) {
      return res.status(400).json({
        success: false,
        message: 'Image QR code manquante'
      });
    }

    // Pour l'instant, on simule la lecture du QR code
    // En production, vous devriez utiliser une librairie comme 'qr-scanner' ou 'jsqr'
    // Ici on assume que le frontend a déjà décodé le QR code
    
    res.json({
      success: false,
      message: 'Fonctionnalité de scan QR code à implémenter',
      data: {
        status: 'not_implemented'
      }
    });

  } catch (error) {
    console.error('Erreur scan QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du scan QR code'
    });
  }
};

// @desc    Récupérer toutes les inscriptions (admin)
// @route   GET /api/registration
// @access  Public (devrait être protégé en production)
const getAllRegistrations = async (req, res) => {
  try {
    const { page = 1, limit = 50, statut, search } = req.query;
    
    // Construire le filtre
    let filter = {};
    
    if (statut && statut !== 'all') {
      filter.statut = statut;
    }
    
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { numeroInscription: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculer la pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Récupérer les inscriptions
    const registrations = await Registration.find(filter)
      .select('-ipAddress -userAgent -qrCode.data') // Exclure les données sensibles
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Compter le total
    const total = await Registration.countDocuments(filter);

    res.json({
      success: true,
      data: registrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Erreur récupération inscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des inscriptions'
    });
  }
};

module.exports = {
  createRegistration,
  getAllRegistrations,
  getRegistrationByNumber,
  checkEmail,
  checkPhone,
  getPublicStats,
  verifyQRCode,
  scanQRCode
};
