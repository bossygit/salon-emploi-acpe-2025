#!/bin/bash

echo "🐙 Publication sur GitHub - Plateforme d'Enregistrement Salon de l'Emploi"
echo "======================================================================="
echo ""

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur : package.json non trouvé"
    echo "Veuillez exécuter ce script depuis le répertoire du projet"
    exit 1
fi

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
    echo "📦 Initialisation de Git..."
    git init
    git add .
    git commit -m "Initial commit - Plateforme d'enregistrement Salon de l'Emploi ACPE 2025"
    echo "✅ Git initialisé"
fi

echo "📋 État actuel du dépôt :"
git status

echo ""
echo "🔍 Vérification des fichiers à commiter..."
if git diff --cached --quiet; then
    echo "ℹ️  Aucun changement à commiter"
else
    echo "📝 Changements détectés, création du commit..."
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo ""
echo "🌐 Configuration du dépôt GitHub..."
echo ""
echo "Pour publier sur GitHub, vous devez :"
echo ""
echo "1️⃣  Créer un nouveau dépôt sur GitHub :"
echo "   - Aller sur https://github.com/new"
echo "   - Nom suggéré : salon-emploi-acpe-2025"
echo "   - Description : Plateforme d'enregistrement pour le Salon National de l'Emploi Jeune 2025 - ACPE"
echo "   - Cocher 'Public' ou 'Private' selon vos préférences"
echo "   - NE PAS cocher 'Initialize with README'"
echo ""
echo "2️⃣  Copier l'URL du dépôt créé"
echo ""
echo "3️⃣  Exécuter les commandes suivantes :"
echo ""
echo "   git remote add origin https://github.com/VOTRE-USERNAME/VOTRE-REPO.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

# Vérifier si un remote existe déjà
if git remote -v | grep -q origin; then
    echo "✅ Remote 'origin' déjà configuré :"
    git remote -v
    echo ""
    echo "🚀 Pour pousser les changements :"
    echo "   git push origin main"
else
    echo "⚠️  Aucun remote 'origin' configuré"
    echo "Suivez les étapes ci-dessus pour configurer GitHub"
fi

echo ""
echo "======================================================================="
echo "📚 Ressources utiles :"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo "🔗 GitHub: https://github.com"
echo "🔗 Site en ligne: https://emploi-1qkys5wkn-kitutupros-projects.vercel.app"
echo ""
echo "💡 Conseils :"
echo "   - Utilisez des commits descriptifs"
echo "   - Créez des branches pour les nouvelles fonctionnalités"
echo "   - Vercel se met à jour automatiquement à chaque push"
echo "======================================================================="

