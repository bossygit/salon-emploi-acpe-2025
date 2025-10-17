const Registration = require('../models/Registration');
const { sendAssistanceEmail } = require('../utils/emailService');
const { handleError } = require('../utils/helpers');

// @desc    Vérifier un numéro ACPE
// @route   POST /api/acpe/verify
// @access  Public
const verifyACPE = async (req, res) => {
  try {
    const { numeroACPE, email } = req.body;

    // Vérifier si le numéro ACPE est déjà utilisé
    const existingRegistration = await Registration.findOne({ numeroACPE });

    if (existingRegistration) {
      return res.json({
        success: true,
        valid: true,
        alreadyUsed: true,
        message: 'Ce numéro ACPE est déjà utilisé',
        data: {
          numeroACPE,
          usedBy: {
            nom: existingRegistration.nom,
            prenom: existingRegistration.prenom,
            email: existingRegistration.email,
            dateInscription: existingRegistration.createdAt
          }
        }
      });
    }

    // Vérifier la validité du numéro ACPE
    const isValidACPE = await simulateACPEVerification(numeroACPE);

    if (isValidACPE) {
      res.json({
        success: true,
        valid: true,
        alreadyUsed: false,
        message: 'Numéro ACPE valide',
        data: {
          numeroACPE,
          status: 'valid'
        }
      });
    } else {
      res.json({
        success: true,
        valid: false,
        message: 'Numéro ACPE invalide ou non trouvé',
        data: {
          numeroACPE,
          status: 'invalid'
        }
      });
    }

  } catch (error) {
    console.error('Erreur vérification ACPE:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification ACPE'
    });
  }
};

// @desc    Informations d'assistance pour l'inscription ACPE
// @route   GET /api/acpe/assistance
// @access  Public
const getAssistanceInfo = async (req, res) => {
  try {
    const assistanceInfo = {
      title: 'Assistance pour l\'inscription ACPE',
      description: 'L\'Agence Congolaise Pour l\'Emploi (ACPE) vous accompagne dans votre inscription.',
      steps: [
        {
          step: 1,
          title: 'Rendez-vous sur le site ACPE',
          description: 'Visitez le site officiel de l\'ACPE',
          link: 'https://acpe.cg',
          action: 'Accéder au site'
        },
        {
          step: 2,
          title: 'Créez votre compte',
          description: 'Inscrivez-vous avec vos informations personnelles',
          action: 'S\'inscrire'
        },
        {
          step: 3,
          title: 'Complétez votre profil',
          description: 'Ajoutez vos informations professionnelles et votre CV',
          action: 'Compléter le profil'
        },
        {
          step: 4,
          title: 'Validez votre inscription',
          description: 'Confirmez votre inscription et recevez votre numéro ACPE',
          action: 'Valider'
        }
      ],
      contact: {
        email: 'contact@acpe.cg',
        telephone: '+242 05 123 45 67',
        adresse: 'Boulevard Denis Sassou Nguesso, Brazzaville',
        horaires: 'Lundi - Vendredi: 8h00 - 17h00'
      },
      benefits: [
        'Accès aux offres d\'emploi exclusives',
        'Formations professionnelles gratuites',
        'Orientation dans la recherche d\'emploi',
        'Informations sur les programmes d\'auto-emploi',
        'Réseau professionnel étendu'
      ]
    };

    res.json({
      success: true,
      data: assistanceInfo
    });

  } catch (error) {
    console.error('Erreur récupération assistance:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des informations d\'assistance'
    });
  }
};

// @desc    Statistiques sur les inscriptions ACPE
// @route   GET /api/acpe/statistics
// @access  Public
const getACPEStatistics = async (req, res) => {
  try {
    const stats = await Registration.aggregate([
      {
        $group: {
          _id: '$inscritACPE',
          count: { $sum: 1 },
          regions: { $addToSet: '$region' },
          secteurs: { $push: '$secteursInterets' }
        }
      }
    ]);

    const detailedStats = await Registration.aggregate([
      {
        $group: {
          _id: null,
          totalInscrits: { $sum: { $cond: [{ $eq: ['$inscritACPE', 'oui'] }, 1, 0] } },
          totalNonInscrits: { $sum: { $cond: [{ $eq: ['$inscritACPE', 'non'] }, 1, 0] } },
          totalIncertains: { $sum: { $cond: [{ $eq: ['$inscritACPE', 'je-ne-sais-pas'] }, 1, 0] } },
          souhaitentInscription: { $sum: { $cond: [{ $eq: ['$souhaitInscriptionACPE', 'oui'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats,
        details: detailedStats[0] || {
          totalInscrits: 0,
          totalNonInscrits: 0,
          totalIncertains: 0,
          souhaitentInscription: 0
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération statistiques ACPE:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques ACPE'
    });
  }
};

// @desc    Demander une assistance personnalisée
// @route   POST /api/acpe/request-assistance
// @access  Public
const requestAssistance = async (req, res) => {
  try {
    const { nom, prenom, telephone, email, message } = req.body;

    // Générer une référence
    const reference = `ASSIST-${Date.now()}`;

    // Ici, vous pourriez sauvegarder la demande dans une base de données
    // ou envoyer un email à l'équipe ACPE
    console.log('Demande d\'assistance ACPE:', {
      reference,
      nom, prenom, telephone, email, message,
      timestamp: new Date()
    });

    // Envoyer un email de confirmation
    try {
      await sendAssistanceEmail({
        reference,
        nom, prenom, telephone, email, message
      });
    } catch (emailError) {
      console.error('Erreur envoi email assistance:', emailError);
      // Ne pas faire échouer la demande si l'email échoue
    }

    res.json({
      success: true,
      message: 'Votre demande d\'assistance a été envoyée avec succès. L\'équipe ACPE vous contactera dans les plus brefs délais.',
      data: {
        reference,
        contact: {
          email: 'contact@acpe.cg',
          telephone: '+242 05 123 45 67'
        }
      }
    });

  } catch (error) {
    console.error('Erreur demande assistance:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la demande d\'assistance'
    });
  }
};

// Fonction de simulation de vérification ACPE
async function simulateACPEVerification(numeroACPE) {
  // Simulation d'une vérification ACPE
  // En production, ceci devrait appeler l'API ACPE réelle

  // Format simulé: ACPE-YYYY-NNNNNN
  const acpePattern = /^ACPE-\d{4}-\d{6}$/;

  if (!acpePattern.test(numeroACPE)) {
    return false;
  }

  // Simulation d'une vérification en base de données ACPE
  // Pour l'instant, on considère que tous les numéros au bon format sont valides
  return true;
}

module.exports = {
  verifyACPE,
  getAssistanceInfo,
  getACPEStatistics,
  requestAssistance
};
