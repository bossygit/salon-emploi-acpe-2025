# 🚀 Guide de Démarrage en Local

## 📋 Problème Résolu

**Problème initial :** Lorsque vous cliquiez sur "Valider mon inscription", la page remontait en haut sans afficher de message d'erreur ou d'avertissement.

**Solution apportée :**
- ✅ Ajout d'un panneau d'erreurs bien visible en haut du formulaire
- ✅ Liste détaillée de toutes les erreurs de validation
- ✅ Animation pour attirer l'attention (effet shake)
- ✅ Message d'aide pour guider l'utilisateur vers les champs à corriger
- ✅ Correction du port de l'API locale (3001 → 5000)

---

## 🔧 Lancement du Backend

### 1. Ouvrir un terminal et naviguer vers le dossier backend
```bash
cd /Volumes/Smart/work/acpe/enregistrement/backend
```

### 2. Installer les dépendances (si première fois)
```bash
npm install
```

### 3. Vérifier la configuration
Assurez-vous que le fichier `.env` ou `config.env` existe avec au minimum :
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/salon-emploi-2025
JWT_SECRET=votre-secret-jwt-local
FRONTEND_URL=http://localhost:3000
```

### 4. Démarrer MongoDB (si local)
```bash
# Sur macOS avec Homebrew
brew services start mongodb-community

# Ou manuellement
mongod --config /usr/local/etc/mongod.conf
```

### 5. Lancer le backend en mode développement
```bash
npm run dev
```

**✅ Le backend sera accessible sur : http://localhost:5000**

---

## 🎨 Lancement du Frontend

### 1. Ouvrir un NOUVEAU terminal et naviguer vers le dossier front
```bash
cd /Volumes/Smart/work/acpe/enregistrement/front
```

### 2. Installer les dépendances (si première fois)
```bash
npm install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```

**✅ Le frontend sera accessible sur : http://localhost:3000**

---

## 📊 Lancement du Dashboard

### 1. Ouvrir un NOUVEAU terminal et naviguer vers le dossier dashboard
```bash
cd /Volumes/Smart/work/acpe/enregistrement/dashboard
```

### 2. Installer les dépendances (si première fois)
```bash
npm install
```

### 3. Lancer le serveur de développement
```bash
npm run dev
```

**✅ Le dashboard sera accessible sur : http://localhost:3002**

---

## ✅ Vérification que tout fonctionne

### 1. Tester le Backend
Ouvrez votre navigateur et allez sur :
```
http://localhost:5000/api/health
```

Vous devriez voir quelque chose comme :
```json
{
  "status": "OK",
  "database": "connected",
  "mongodb": {
    "status": "connected",
    "name": "salon-emploi-2025"
  }
}
```

### 2. Tester le Frontend
Allez sur `http://localhost:3000` et essayez de remplir le formulaire d'inscription.

**Maintenant, si vous cliquez sur "Valider mon inscription" sans remplir tous les champs obligatoires :**
- 🎯 Un panneau rouge apparaîtra en haut du formulaire
- 📋 Vous verrez la liste de toutes les erreurs
- ⚡ Le panneau s'animera pour attirer votre attention
- 💡 Un message vous guidera vers les champs à corriger

### 3. Tester le Dashboard
Allez sur `http://localhost:3002` pour voir les statistiques et la liste des inscriptions.

---

## 🎯 Champs Obligatoires

Pour que l'inscription soit valide, vous devez remplir :
- ✅ **Nom** et **Prénom**
- ✅ **Téléphone** et **Email**
- ✅ **Statut d'inscription ACPE** (Oui/Non/Je ne sais pas)
- ✅ **Situation actuelle** (Étudiant, Chômeur, etc.)
- ✅ **Objectif principal** (Emploi, Auto-emploi, Formation, Les trois)
- ✅ **Au moins un jour de participation**
- ✅ **Accepter les conditions d'utilisation**
- ✅ **Accepter le traitement des données personnelles**

---

## 🐛 Dépannage

### ❌ Erreur: "NetworkError when attempting to fetch resource"

Cette erreur signifie que le frontend ne peut pas communiquer avec le backend. Voici comment la résoudre :

#### **Étape 1: Vérifier que le backend est démarré**

Dans le terminal où vous avez lancé `npm run dev` dans le dossier backend, vous devriez voir :
```
🚀 Serveur démarré sur le port 5000
📱 API disponible sur: http://127.0.0.1:5000
📱 API disponible sur: http://localhost:5000
🌍 Environnement: development
🔒 CORS activé pour: http://localhost:3000, http://localhost:3002
```

**Si vous ne voyez PAS ces messages** → Le backend n'est pas démarré !

#### **Étape 2: Tester la connexion au backend**

Exécutez le script de diagnostic :
```bash
cd /Volumes/Smart/work/acpe/enregistrement/backend
node test-connection.js
```

Ce script vous dira exactement quel est le problème.

#### **Étape 3: Solutions selon le problème**

**Problème A: "ECONNREFUSED" (connexion refusée)**
```bash
# Le backend n'est pas démarré ou a planté
cd /Volumes/Smart/work/acpe/enregistrement/backend

# Vérifier si un processus écoute sur le port 5000
lsof -i :5000

# Si rien → Démarrer le backend
npm run dev

# Si un processus existe mais ne répond pas → Le tuer et redémarrer
kill -9 PID  # Remplacer PID par le numéro affiché
npm run dev
```

**Problème B: MongoDB non connecté**
```bash
# Vérifier que MongoDB est en cours d'exécution
brew services list | grep mongodb

# Si "stopped" → Démarrer MongoDB
brew services start mongodb-community

# Attendre 5 secondes puis redémarrer le backend
npm run dev
```

**Problème C: Port 5000 occupé par un autre processus**
```bash
# Trouver quel processus utilise le port 5000
lsof -i :5000

# Tuer le processus
kill -9 PID  # Remplacer PID par le numéro affiché

# Redémarrer le backend
npm run dev
```

#### **Étape 4: Test manuel avec curl**

```bash
# Tester l'endpoint de santé
curl http://localhost:5000/api/health

# Réponse attendue :
# {"status":"OK","database":"connected",...}
```

### Le backend ne démarre pas

**Problème :** Erreur lors du démarrage
```bash
# Vérifier les logs d'erreur
cd /Volumes/Smart/work/acpe/enregistrement/backend
npm run dev

# Lire attentivement les messages d'erreur
# Les erreurs courantes sont :
# - MongoDB non accessible
# - Variables d'environnement manquantes
# - Dépendances non installées
```

**Solution :** Réinstaller les dépendances
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Le frontend ne se connecte pas au backend

**Diagnostic rapide :**
1. ✅ Vérifiez que le backend est bien en cours d'exécution sur le port 5000
2. ✅ Ouvrez la console du navigateur (F12) et regardez l'onglet "Network"
3. ✅ Cherchez la requête vers `/api/registration`
4. ✅ Si elle est en rouge → Cliquez dessus pour voir les détails
5. ✅ Si "CORS error" → Le backend n'autorise pas le frontend
6. ✅ Si "Failed to fetch" → Le backend n'est pas accessible

### Pas de message d'erreur après avoir cliqué sur "Valider"
Cela ne devrait plus arriver ! Si c'est le cas :
1. Vérifiez que vous avez bien les dernières modifications
2. Rechargez la page avec Ctrl+Shift+R (cache forcé)
3. Ouvrez la console du navigateur (F12) et regardez les erreurs

---

## 📝 Résumé des Modifications

### Fichiers modifiés :
1. **`front/emploi-plateforme.tsx`**
   - Ajout d'un état `validationErrors` pour stocker les messages d'erreur
   - Modification de `validateForm()` pour collecter tous les messages d'erreur
   - Ajout d'un panneau d'erreurs visible en haut du formulaire
   - Réinitialisation des erreurs lors de la soumission réussie

2. **`front/utils/api.ts`**
   - Correction du port de l'API locale : 3001 → 5000

3. **`front/styles/globals.css`**
   - Ajout de l'animation `shake` pour attirer l'attention sur les erreurs

---

## 🎉 Prochaines Étapes

Une fois que tout fonctionne en local, vous pouvez :
1. Tester différents scénarios d'inscription
2. Vérifier que les données s'enregistrent bien dans MongoDB
3. Consulter le dashboard pour voir les statistiques
4. Préparer le déploiement en production si nécessaire

---

**Besoin d'aide ?** N'hésitez pas à demander !

