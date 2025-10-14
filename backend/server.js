const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import des routes
const registrationRoutes = require('./routes/registration');
const adminRoutes = require('./routes/admin');
const acpeRoutes = require('./routes/acpe');

const app = express();

// Configuration de sécurité
app.use(helmet());
app.use(compression());

// Configuration CORS
const allowedOrigins = [
  'http://localhost:3000',  // Frontend principal
  'http://localhost:3002',  // Dashboard admin
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3002',
  'https://front-two-indol.vercel.app',  // Frontend Vercel (URL constante)
  'https://front-ak5owrg7r-kitutupros-projects.vercel.app',  // Frontend Vercel
  'https://front-emxqfbaxa-kitutupros-projects.vercel.app',  // Frontend Vercel (ancienne)
  'https://front-et42t0bcn-kitutupros-projects.vercel.app',  // Frontend Vercel (actuel)
  'https://dashboard-csp53tk8u-kitutupros-projects.vercel.app',  // Dashboard Vercel
  'https://dashboard-hpbypzu8m-kitutupros-projects.vercel.app'  // Dashboard Vercel (ancienne)
];

app.use(cors({
  origin: function (origin, callback) {
    // Permettre les requêtes sans origine (ex: Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS: Origine non autorisée: ${origin}`);
      // En production, accepter temporairement toutes les origines Vercel
      if (origin && origin.includes('.vercel.app')) {
        console.log(`⚠️ CORS: Autorisation temporaire pour ${origin}`);
        callback(null, true);
      } else {
        callback(new Error('Non autorisé par CORS'));
      }
    }
  },
  credentials: true
}));

// Middleware de logging
app.use(morgan('combined'));

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite chaque IP à 100 requêtes par windowMs
  message: {
    error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  }
});
app.use('/api/', limiter);

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

// Routes API
app.use('/api/registration', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/acpe', acpeRoutes);

// Route de santé améliorée
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    message: 'API Salon Emploi 2025 - Opérationnelle',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'disconnected'
  };

  // Vérifier la connexion MongoDB
  try {
    if (mongoose.connection.readyState === 1) {
      healthCheck.database = 'connected';
      healthCheck.mongodb = {
        status: 'connected',
        name: mongoose.connection.name,
        host: mongoose.connection.host
      };
    } else {
      healthCheck.database = 'disconnected';
      healthCheck.mongodb = {
        status: 'disconnected',
        readyState: mongoose.connection.readyState
      };
    }
  } catch (error) {
    healthCheck.database = 'error';
    healthCheck.mongodb = {
      status: 'error',
      error: error.message
    };
  }

  const statusCode = healthCheck.database === 'connected' ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'API Backend - Salon National de l\'Emploi Jeune 2025',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      registration: '/api/registration',
      admin: '/api/admin',
      acpe: '/api/acpe'
    }
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint non trouvé',
    message: 'La route demandée n\'existe pas'
  });
});

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);

  res.status(err.status || 500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Connexion à MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📱 API disponible sur: http://127.0.0.1:${PORT}`);
    console.log(`📱 API disponible sur: http://localhost:${PORT}`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

module.exports = app;
