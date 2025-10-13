const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Middleware d'authentification pour les admins
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide ou admin inactif'
      });
    }

    req.adminId = admin._id;
    req.admin = admin;
    next();

  } catch (error) {
    console.error('Erreur authentification:', error);
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

// Middleware d'autorisation basé sur les permissions
const authorizeAdmin = (permissions) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin non authentifié'
      });
    }

    // Super-admin a tous les droits
    if (req.admin.role === 'super-admin') {
      return next();
    }

    // Vérifier les permissions
    const hasPermission = permissions.some(permission => 
      req.admin.hasPermission(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes'
      });
    }

    next();
  };
};

// Middleware pour vérifier le rôle
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin non authentifié'
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Rôle insuffisant'
      });
    }

    next();
  };
};

module.exports = {
  authenticateAdmin,
  authorizeAdmin,
  requireRole
};
