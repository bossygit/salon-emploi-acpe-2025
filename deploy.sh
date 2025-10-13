#!/bin/bash

echo "🚀 Déploiement sur Vercel - Plateforme d'Enregistrement Salon de l'Emploi"
echo "=========================================================================="
echo ""

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
    echo "📦 Initialisation de Git..."
    git init
    git add .
    git commit -m "Initial commit - Plateforme d'enregistrement Salon de l'Emploi 2025"
    echo "✅ Git initialisé"
    echo ""
    echo "⚠️  N'oubliez pas de créer un dépôt sur GitHub et d'exécuter :"
    echo "   git remote add origin https://github.com/votre-username/votre-repo.git"
    echo "   git push -u origin main"
    echo ""
fi

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "📥 Installation de Vercel CLI..."
    npm install -g vercel
fi

echo "🔐 Connexion à Vercel..."
vercel login

echo ""
echo "Choisissez le type de déploiement :"
echo "1) Déploiement de test (Preview)"
echo "2) Déploiement en production"
read -p "Votre choix (1 ou 2) : " choice

# Aller dans le dossier front pour le déploiement
cd front || { echo "❌ Erreur : dossier 'front' non trouvé"; exit 1; }

case $choice in
    1)
        echo "🧪 Déploiement de test en cours..."
        vercel
        ;;
    2)
        echo "🚀 Déploiement en production en cours..."
        vercel --prod
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac

echo ""
echo "=========================================================================="
echo "✅ Déploiement terminé !"
echo ""
echo "Votre site est maintenant en ligne ! 🎉"
echo "Consultez le dashboard Vercel pour voir l'URL de votre site."
echo "=========================================================================="

