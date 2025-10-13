const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

// Script pour créer un admin initial
const createInitialAdmin = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier si un super-admin existe déjà
    const existingSuperAdmin = await Admin.findOne({ role: 'super-admin' });
    
    if (existingSuperAdmin) {
      console.log('⚠️  Un super-admin existe déjà:', existingSuperAdmin.email);
      return;
    }

    // Créer le super-admin initial
    const superAdmin = new Admin({
      nom: 'Admin',
      prenom: 'Super',
      email: 'admin@acpe.cg',
      password: 'AdminSalon2025!', // À changer en production
      role: 'super-admin',
      permissions: [
        'view-registrations',
        'edit-registrations',
        'delete-registrations',
        'view-statistics',
        'export-data',
        'manage-admins'
      ]
    });

    await superAdmin.save();
    
    console.log('✅ Super-admin créé avec succès !');
    console.log('📧 Email:', superAdmin.email);
    console.log('🔑 Mot de passe: AdminSalon2025!');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe en production !');

  } catch (error) {
    console.error('❌ Erreur lors de la création du super-admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
};

// Exécuter le script
if (require.main === module) {
  createInitialAdmin();
}

module.exports = createInitialAdmin;
