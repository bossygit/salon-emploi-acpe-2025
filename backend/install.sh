#!/bin/bash

# Script d'installation pour le backend du Salon Emploi 2025
echo "🚀 Installation du Backend - Salon National de l'Emploi Jeune 2025"
echo "=================================================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ d'abord."
    echo "   Téléchargez depuis: https://nodejs.org/"
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

echo "✅ npm $(npm -v) détecté"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées avec succès"

# Créer les dossiers nécessaires
echo "📁 Création des dossiers nécessaires..."
node scripts/initDirs.js

# Copier le fichier de configuration
if [ ! -f .env ]; then
    if [ -f config.env ]; then
        cp config.env .env
        echo "✅ Fichier .env créé à partir de config.env"
    else
        echo "⚠️  Fichier .env non trouvé. Veuillez le créer manuellement."
        echo "   Copiez env.example vers .env et configurez vos variables."
    fi
fi

# Créer le super-admin initial
echo "👤 Création du super-admin initial..."
node scripts/createAdmin.js

if [ $? -ne 0 ]; then
    echo "⚠️  Erreur lors de la création du super-admin. Vous pouvez le faire manuellement plus tard."
fi

echo ""
echo "🎉 Installation terminée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez votre fichier .env avec vos paramètres"
echo "2. Démarrez le serveur avec: npm run dev"
echo "3. L'API sera disponible sur: http://localhost:5000"
echo "4. Testez l'API avec: curl http://localhost:5000/api/health"
echo ""
echo "🔐 Connexion admin par défaut :"
echo "   Email: admin@acpe.cg"
echo "   Mot de passe: AdminSalon2025!"
echo "   ⚠️  Changez ce mot de passe en production !"
echo ""
echo "📚 Documentation: README.md"
echo "🆘 Support: contact@acpe.cg"
