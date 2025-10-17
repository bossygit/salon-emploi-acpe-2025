const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const {
  createRegistration,
  getAllRegistrations,
  getRegistrationByNumber,
  checkEmail,
  checkPhone,
  getPublicStats,
  verifyQRCode,
  scanQRCode
} = require('../controllers/registrationController');

const router = express.Router();

// Configuration Multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/cv/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cv-' + uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword' ||
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF et Word sont autorisés'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Validation des données d'inscription
const registrationValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire').isLength({ max: 50 }).withMessage('Le nom ne peut pas dépasser 50 caractères'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est obligatoire').isLength({ max: 50 }).withMessage('Le prénom ne peut pas dépasser 50 caractères'),
  body('dateNaissance').optional({ checkFalsy: true }).isISO8601().withMessage('Date de naissance invalide'),
  body('sexe').optional({ checkFalsy: true }).isIn(['M', 'F']).withMessage('Le sexe doit être M ou F'),
  body('telephone').matches(/^(\+242|242)?[0-9]{9}$/).withMessage('Format de téléphone invalide'),
  body('email').isEmail().withMessage('Format d\'email invalide').normalizeEmail(),
  body('inscritACPE').isIn(['oui', 'non', 'je-ne-sais-pas']).withMessage('Valeur invalide pour l\'inscription ACPE'),
  body('numeroACPE').optional({ checkFalsy: true }).trim(),
  body('accepteConditions').equals('true').withMessage('Vous devez accepter les conditions'),
  body('accepteTraitementDonnees').equals('true').withMessage('Vous devez accepter le traitement des données')
];

// GET /api/registration - Récupérer toutes les inscriptions (admin)
router.get('/', getAllRegistrations);

// POST /api/registration - Créer une nouvelle inscription
router.post('/', upload.single('cvFile'), registrationValidation, async (req, res) => {
  // Convertir les strings en booléens
  if (req.body.accepteConditions === 'true') req.body.accepteConditions = true;
  if (req.body.accepteConditions === 'false') req.body.accepteConditions = false;
  if (req.body.accepteTraitementDonnees === 'true') req.body.accepteTraitementDonnees = true;
  if (req.body.accepteTraitementDonnees === 'false') req.body.accepteTraitementDonnees = false;
  if (req.body.accepteCommunications === 'true') req.body.accepteCommunications = true;
  if (req.body.accepteCommunications === 'false') req.body.accepteCommunications = false;

  // Parser les tableaux envoyés en JSON string
  const arrayFields = ['secteursInterets', 'joursParticipation', 'panelsInterets', 'ateliersInterets'];
  arrayFields.forEach(field => {
    if (req.body[field] && typeof req.body[field] === 'string') {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (e) {
        console.warn(`⚠️ Impossible de parser ${field}:`, req.body[field]);
      }
    }
  });

  // Convertir experienceAnnees en number si c'est une string
  if (req.body.experienceAnnees && typeof req.body.experienceAnnees === 'string') {
    req.body.experienceAnnees = parseInt(req.body.experienceAnnees, 10);
  }

  // Nettoyer les champs vides (convertir "" en null pour les champs enum optionnels)
  const optionalEnumFields = ['souhaitInscriptionACPE', 'horairePrefere', 'niveauEtudes',
    'situationActuelle', 'region', 'domaineEtudes', 'ville', 'ideeProjet'];
  optionalEnumFields.forEach(field => {
    if (req.body[field] === '' || req.body[field] === undefined) {
      delete req.body[field];  // Supprimer le champ plutôt que d'envoyer une chaîne vide
    }
  });

  console.log('📦 Données traitées avant validation:', {
    accepteConditions: req.body.accepteConditions,
    accepteTraitementDonnees: req.body.accepteTraitementDonnees,
    inscritACPE: req.body.inscritACPE,
    joursParticipation: req.body.joursParticipation,
    secteursInterets: req.body.secteursInterets,
    souhaitInscriptionACPE: req.body.souhaitInscriptionACPE
  });

  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Enrichir les erreurs avec les valeurs reçues
    const enrichedErrors = errors.array().map(err => ({
      ...err,
      receivedValue: req.body[err.param] || req.body[err.path]
    }));

    console.log('❌ Erreurs de validation détectées:');
    console.log('📋 Nombre d\'erreurs:', enrichedErrors.length);
    enrichedErrors.forEach((err, index) => {
      console.log(`\n${index + 1}. Champ: ${err.param || err.path}`);
      console.log(`   Message: ${err.msg}`);
      console.log(`   Valeur reçue: ${JSON.stringify(err.receivedValue)}`);
      console.log(`   Type: ${typeof err.receivedValue}`);
    });
    console.log('\n📦 Corps de la requête complet (req.body):');
    console.log(JSON.stringify(req.body, null, 2));

    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: enrichedErrors
    });
  }

  // Traitement du fichier CV
  if (req.file) {
    req.body.cvFile = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    };
  }

  createRegistration(req, res);
});

// GET /api/registration/:numero - Récupérer une inscription par numéro
router.get('/:numero', getRegistrationByNumber);

// GET /api/registration/check/:email - Vérifier si un email est déjà inscrit
router.get('/check/:email', checkEmail);

// GET /api/registration/check-phone/:phone - Vérifier si un téléphone est déjà inscrit
router.get('/check-phone/:phone', checkPhone);

// GET /api/registration/stats/public - Statistiques publiques
router.get('/stats/public', getPublicStats);

// POST /api/registration/verify-qr - Vérifier une inscription via QR code
router.post('/verify-qr', verifyQRCode);

// POST /api/registration/scan-qr - Scanner un QR code (interface admin)
router.post('/scan-qr', scanQRCode);

module.exports = router;
