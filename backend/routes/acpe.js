const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  verifyACPE,
  getAssistanceInfo,
  getACPEStatistics,
  requestAssistance
} = require('../controllers/acpeController');

const router = express.Router();

// Validation pour la vérification ACPE
const acpeValidation = [
  body('numeroACPE').trim().notEmpty().withMessage('Le numéro ACPE est obligatoire'),
  body('email').optional().isEmail().withMessage('Format d\'email invalide').normalizeEmail()
];

// POST /api/acpe/verify - Vérifier un numéro ACPE
router.post('/verify', acpeValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  verifyACPE(req, res);
});

// GET /api/acpe/assistance - Informations d'assistance pour l'inscription ACPE
router.get('/assistance', getAssistanceInfo);

// GET /api/acpe/statistics - Statistiques sur les inscriptions ACPE
router.get('/statistics', getACPEStatistics);

// POST /api/acpe/request-assistance - Demander une assistance personnalisée
router.post('/request-assistance', [
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est obligatoire'),
  body('telephone').matches(/^(\+242|242)?[0-9]{9}$/).withMessage('Format de téléphone invalide'),
  body('email').isEmail().withMessage('Format d\'email invalide').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Le message est obligatoire')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  requestAssistance(req, res);
});

module.exports = router;
