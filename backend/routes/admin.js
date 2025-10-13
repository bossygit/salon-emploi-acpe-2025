const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateAdmin, authorizeAdmin } = require('../middleware/auth');
const {
  loginAdmin,
  getAdminProfile,
  getRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  getStatistics,
  createAdmin,
  exportData
} = require('../controllers/adminController');

const router = express.Router();

// Validation pour la connexion admin
const loginValidation = [
  body('email').isEmail().withMessage('Format d\'email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Le mot de passe est obligatoire')
];

// Validation pour la création d'admin
const createAdminValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est obligatoire'),
  body('email').isEmail().withMessage('Format d\'email invalide').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role').optional().isIn(['super-admin', 'admin', 'moderator']).withMessage('Rôle invalide')
];

// POST /api/admin/login - Connexion admin
router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  loginAdmin(req, res);
});

// GET /api/admin/profile - Profil de l'admin connecté
router.get('/profile', authenticateAdmin, getAdminProfile);

// GET /api/admin/registrations - Liste des inscriptions (avec pagination et filtres)
router.get('/registrations', authenticateAdmin, authorizeAdmin(['view-registrations']), getRegistrations);

// GET /api/admin/registrations/:id - Détails d'une inscription
router.get('/registrations/:id', authenticateAdmin, authorizeAdmin(['view-registrations']), getRegistrationById);

// PUT /api/admin/registrations/:id/status - Modifier le statut d'une inscription
router.put('/registrations/:id/status', authenticateAdmin, authorizeAdmin(['edit-registrations']), updateRegistrationStatus);

// GET /api/admin/statistics - Statistiques détaillées
router.get('/statistics', authenticateAdmin, authorizeAdmin(['view-statistics']), getStatistics);

// POST /api/admin/create - Créer un nouvel admin (super-admin seulement)
router.post('/create', authenticateAdmin, authorizeAdmin(['manage-admins']), createAdminValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: errors.array()
    });
  }
  createAdmin(req, res);
});

// GET /api/admin/export - Exporter les données (CSV/Excel)
router.get('/export', authenticateAdmin, authorizeAdmin(['export-data']), exportData);

module.exports = router;
