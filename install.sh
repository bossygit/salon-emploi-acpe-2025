#!/bin/bash

echo "🚀 Installation de la Plateforme d'Enregistrement - Salon de l'Emploi"
echo "================================================================="
echo ""

# Aller dans le dossier front
cd front || { echo "❌ Erreur : dossier 'front' non trouvé"; exit 1; }

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur : package.json non trouvé"
    echo "Veuillez exécuter ce script depuis le répertoire du projet"
    exit 1
fi

echo "📦 Étape 1/3 : Correction des permissions npm..."
sudo chown -R $(whoami) ~/.npm 2>/dev/null || echo "⚠️  Impossible de corriger les permissions (peut nécessiter sudo)"

echo ""
echo "📥 Étape 2/3 : Installation des dépendances..."

# Essayer différentes méthodes d'installation
if npm install --no-audit --no-fund; then
    echo "✅ Installation réussie avec npm"
elif yarn install 2>/dev/null; then
    echo "✅ Installation réussie avec yarn"
elif pnpm install 2>/dev/null; then
    echo "✅ Installation réussie avec pnpm"
else
    echo "❌ Échec de l'installation automatique"
    echo ""
    echo "Veuillez essayer manuellement :"
    echo "  1. cd front"
    echo "  2. sudo chown -R \$(whoami) ~/.npm"
    echo "  3. npm install"
    echo ""
    echo "Ou utilisez yarn/pnpm :"
    echo "  npm install -g yarn && yarn install"
    exit 1
fi

echo ""
echo "✨ Étape 3/3 : Vérification de l'installation..."

if [ -d "node_modules" ]; then
    echo "✅ Dossier node_modules créé"
    
    # Compter les packages installés
    package_count=$(ls -1 node_modules | wc -l | xargs)
    echo "📊 $package_count packages installés"
else
    echo "❌ Le dossier node_modules n'a pas été créé"
    exit 1
fi

echo ""
echo "================================================================="
echo "✅ Installation terminée avec succès !"
echo ""
echo "Pour démarrer le serveur de développement :"
echo "  cd front"
echo "  npm run dev"
echo ""
echo "Puis ouvrez votre navigateur sur : http://localhost:3000"
echo "================================================================="

