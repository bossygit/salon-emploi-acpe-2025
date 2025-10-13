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
  body('dateNaissance').isISO8601().withMessage('Date de naissance invalide'),
  body('sexe').isIn(['M', 'F']).withMessage('Le sexe doit être M ou F'),
  body('telephone').matches(/^(\+242|242)?[0-9]{9}$/).withMessage('Format de téléphone invalide'),
  body('email').isEmail().withMessage('Format d\'email invalide').normalizeEmail(),
  body('inscritACPE').isIn(['oui', 'non', 'je-ne-sais-pas']).withMessage('Valeur invalide pour l\'inscription ACPE'),
  body('numeroACPE').optional().trim(),
  body('accepteConditions').equals('true').withMessage('Vous devez accepter les conditions'),
  body('accepteTraitementDonnees').equals('true').withMessage('Vous devez accepter le traitement des données')
];

// GET /api/registration - Récupérer toutes les inscriptions (admin)
router.get('/', getAllRegistrations);

// POST /api/registration - Créer une nouvelle inscription
router.post('/', upload.single('cvFile'), registrationValidation, async (req, res) => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
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
