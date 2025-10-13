#!/usr/bin/env node

/**
 * Script de test de la connexion MongoDB
 * Usage: node test-mongodb.js
 */

require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

console.log('\n🔍 Test de connexion MongoDB\n' + '='.repeat(50) + '\n');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = MONGODB_URI.split('/').pop().split('?')[0];

console.log('📋 Configuration:');
console.log(`   Base de données: ${DB_NAME}`);
console.log(`   URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}\n`);

// Test de connexion
async function testConnection() {
  try {
    console.log('🔌 Tentative de connexion...');
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ Connexion réussie!\n');

    // Informations sur la base de données
    const db = mongoose.connection.db;
    const admin = db.admin();
    
    // Version MongoDB
    const buildInfo = await admin.command({ buildInfo: 1 });
    console.log('📊 Informations MongoDB:');
    console.log(`   Version: ${buildInfo.version}`);
    
    // Collections
    const collections = await db.listCollections().toArray();
    console.log(`   Collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('\n📁 Collections disponibles:');
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`   - ${collection.name}: ${count} documents`);
      }
    } else {
      console.log('\n⚠️  Aucune collection trouvée (base de données vide)');
    }

    // Test d'écriture
    console.log('\n🧪 Test d\'écriture...');
    const testCollection = db.collection('_test');
    const testDoc = { test: true, timestamp: new Date() };
    const insertResult = await testCollection.insertOne(testDoc);
    console.log(`   ✅ Document inséré: ${insertResult.insertedId}`);
    
    // Test de lecture
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log(`   ✅ Document lu: ${foundDoc ? 'OK' : 'ERREUR'}`);
    
    // Nettoyage
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log(`   ✅ Document supprimé: OK`);
    
    // Test terminé
    console.log('\n' + '='.repeat(50));
    console.log('✅ Tous les tests sont passés!');
    console.log('='.repeat(50) + '\n');

    // Statistiques
    const stats = await db.stats();
    console.log('📈 Statistiques:');
    console.log(`   Taille des données: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Nombre de collections: ${stats.collections}`);
    console.log(`   Nombre d'index: ${stats.indexes}`);
    
  } catch (error) {
    console.error('\n❌ Erreur de connexion:');
    console.error(`   ${error.message}\n`);
    
    if (error.name === 'MongooseServerSelectionError') {
      console.log('💡 Suggestions:');
      console.log('   1. Vérifiez que MongoDB est démarré');
      console.log('   2. Vérifiez l\'URL de connexion dans config.env');
      console.log('   3. Vérifiez votre connexion internet (si MongoDB Atlas)');
      console.log('   4. Vérifiez les accès réseau sur MongoDB Atlas\n');
    }
    
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée\n');
  }
}

// Exécution
testConnection();

