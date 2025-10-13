const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const jwt = require('jsonwebtoken');
const { handleError } = require('../utils/helpers');

// @desc    Connexion admin
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'admin
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Mettre à jour la dernière connexion
    await admin.updateLastLogin();

    // Générer le token JWT
    const token = jwt.sign(
      { 
        adminId: admin._id, 
        email: admin.email, 
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        admin: admin.toPublicJSON()
      }
    });

  } catch (error) {
    console.error('Erreur connexion admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// @desc    Profil de l'admin connecté
// @route   GET /api/admin/profile
// @access  Private (Admin)
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin non trouvé'
      });
    }

    res.json({
      success: true,
      data: admin.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};

// @desc    Liste des inscriptions avec pagination et filtres
// @route   GET /api/admin/registrations
// @access  Private (Admin)
const getRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    // Filtres
    if (req.query.statut) filter.statut = req.query.statut;
    if (req.query.region) filter.region = req.query.region;
    if (req.query.inscritACPE) filter.inscritACPE = req.query.inscritACPE;
    if (req.query.search) {
      filter.$or = [
        { nom: { $regex: req.query.search, $options: 'i' } },
        { prenom: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { numeroInscription: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Tri
    const sort = {};
    if (req.query.sortBy) {
      sort[req.query.sortBy] = req.query.sortOrder === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const [registrations, total] = await Promise.all([
      Registration.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-qrCode.data -ipAddress -userAgent'),
      Registration.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        registrations,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
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

// @desc    Détails d'une inscription
// @route   GET /api/admin/registrations/:id
// @access  Private (Admin)
const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée'
      });
    }

    res.json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Erreur récupération inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'inscription'
    });
  }
};

// @desc    Modifier le statut d'une inscription
// @route   PUT /api/admin/registrations/:id/status
// @access  Private (Admin)
const updateRegistrationStatus = async (req, res) => {
  try {
    const { statut } = req.body;
    
    if (!['en-attente', 'confirme', 'annule'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Statut mis à jour avec succès',
      data: registration
    });

  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
};

// @desc    Statistiques détaillées
// @route   GET /api/admin/statistics
// @access  Private (Admin)
const getStatistics = async (req, res) => {
  try {
    const [
      totalStats,
      statsByRegion,
      statsByStatut,
      statsByACPE,
      statsByDay
    ] = await Promise.all([
      Registration.getStatistics(),
      Registration.aggregate([
        { $group: { _id: '$region', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Registration.aggregate([
        { $group: { _id: '$statut', count: { $sum: 1 } } }
      ]),
      Registration.aggregate([
        { $group: { _id: '$inscritACPE', count: { $sum: 1 } } }
      ]),
      Registration.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total: totalStats,
        byRegion: statsByRegion,
        byStatut: statsByStatut,
        byACPE: statsByACPE,
        byDay: statsByDay
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

// @desc    Créer un nouvel admin
// @route   POST /api/admin/create
// @access  Private (Super Admin)
const createAdmin = async (req, res) => {
  try {
    const { nom, prenom, email, password, role = 'admin', permissions = [] } = req.body;

    // Vérifier si l'email existe déjà
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: 'Un admin avec cet email existe déjà'
      });
    }

    const admin = new Admin({
      nom,
      prenom,
      email,
      password,
      role,
      permissions
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin créé avec succès',
      data: admin.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur création admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'admin'
    });
  }
};

// @desc    Exporter les données
// @route   GET /api/admin/export
// @access  Private (Admin)
const exportData = async (req, res) => {
  try {
    const format = req.query.format || 'csv';
    const registrations = await Registration.find({}).select('-qrCode.data -ipAddress -userAgent');

    if (format === 'csv') {
      // Générer CSV
      const csvHeader = 'Numéro,Prénom,Nom,Email,Téléphone,Région,Statut,Inscrit ACPE,Date Inscription\n';
      const csvData = registrations.map(reg => 
        `${reg.numeroInscription},${reg.prenom},${reg.nom},${reg.email},${reg.telephone},${reg.region || ''},${reg.statut},${reg.inscritACPE},${reg.createdAt.toISOString().split('T')[0]}`
      ).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=inscriptions-salon-2025.csv');
      res.send(csvHeader + csvData);
    } else {
      res.json({
        success: true,
        data: registrations
      });
    }

  } catch (error) {
    console.error('Erreur export données:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'export des données'
    });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  getRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  getStatistics,
  createAdmin,
  exportData
};
