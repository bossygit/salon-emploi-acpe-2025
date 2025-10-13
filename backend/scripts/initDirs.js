const fs = require('fs');
const path = require('path');

// Script pour initialiser les dossiers nécessaires
const initDirectories = () => {
  const directories = [
    'uploads',
    'uploads/cv',
    'logs'
  ];

  console.log('📁 Initialisation des dossiers...');

  directories.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Dossier créé: ${dir}`);
    } else {
      console.log(`📁 Dossier existe déjà: ${dir}`);
    }
  });

  // Créer un fichier .gitkeep dans uploads/cv
  const gitkeepPath = path.join(__dirname, '..', 'uploads', 'cv', '.gitkeep');
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, '# Ce fichier permet de conserver le dossier uploads/cv dans Git\n');
    console.log('✅ Fichier .gitkeep créé dans uploads/cv');
  }

  console.log('🎉 Initialisation terminée !');
};

// Exécuter le script
if (require.main === module) {
  initDirectories();
}

module.exports = initDirectories;
