# 🗄️ Configuration MongoDB - Salon de l'Emploi ACPE

## ✅ État actuel de votre configuration

### MongoDB installé et configuré !

- **MongoDB Version** : 8.0.10
- **Statut** : ✅ En cours d'exécution
- **Type** : MongoDB Atlas (Cloud) + MongoDB Local
- **Base de données** : `salon-emploi-2025`
- **Connexion** : ✅ Testée et fonctionnelle

---

## 🎯 Configuration actuelle

### **Backend (`config.env`)**

```env
# MongoDB Atlas (Production/Cloud)
MONGODB_URI=mongodb+srv://euloge348_db_user:IwzPKSq5eM6rakvb@cluster0.vht9dh5.mongodb.net/salon-emploi-2025

# Port du serveur
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=salon-emploi-2025-super-secret-jwt-key-acpe-congo
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=eulogetabala51@gmail.com
EMAIL_PASS=wrma tgov wsho adxx
EMAIL_FROM=ACPE <noreply@acpe.cg>
```

---

## 🚀 Démarrage du Backend

### Option 1 : Démarrage rapide

```bash
cd backend
npm run dev
```

Le backend démarre sur **http://localhost:5000**

### Option 2 : Démarrage avec vérification

```bash
cd backend

# 1. Installer les dépendances (si nécessaire)
npm install

# 2. Initialiser les dossiers
npm run init-dirs

# 3. Créer un compte admin
npm run create-admin

# 4. Démarrer le serveur
npm run dev
```

---

## 👤 Créer un compte admin

Pour accéder au dashboard, vous devez créer un compte administrateur :

```bash
cd backend
npm run create-admin
```

Vous serez invité à entrer :
- **Username** : Votre nom d'utilisateur (ex: `admin`)
- **Email** : Votre email (ex: `admin@acpe.cg`)
- **Password** : Votre mot de passe (sécurisé)

**Exemple de sortie :**
```
🔐 Création d'un compte administrateur
=======================================

? Nom d'utilisateur : admin
? Email : admin@acpe.cg
? Mot de passe : ********

✅ Administrateur créé avec succès !
📧 Email: admin@acpe.cg
👤 Username: admin
```

---

## 🔍 Vérifier la base de données

### Avec MongoDB Shell (mongosh)

```bash
# Se connecter à la base de données locale
mongosh

# Utiliser la base de données
use salon-emploi-2025

# Lister les collections
show collections

# Compter les inscriptions
db.registrations.countDocuments()

# Afficher les 5 dernières inscriptions
db.registrations.find().sort({createdAt: -1}).limit(5)

# Compter les admins
db.admins.countDocuments()

# Quitter
exit
```

### Avec MongoDB Atlas (Cloud)

1. Allez sur https://cloud.mongodb.com
2. Connectez-vous avec vos identifiants
3. Sélectionnez **Cluster0**
4. Cliquez sur **Browse Collections**
5. Sélectionnez la base `salon-emploi-2025`

---

## 📊 Collections MongoDB

Votre application utilise les collections suivantes :

### **1. `registrations`** - Inscriptions au salon

```javascript
{
  _id: ObjectId,
  numeroInscription: "ACPE2025XXXXX",
  nom: String,
  prenom: String,
  email: String,
  telephone: String,
  dateNaissance: Date,
  sexe: String,
  ville: String,
  region: String,
  niveauEtudes: String,
  domaineEtudes: String,
  situationActuelle: String,
  experienceAnnees: String,
  secteursInterets: [String],
  cvFile: String,              // Chemin du CV
  ideeProjet: String,
  inscritACPE: String,
  numeroACPE: String,
  souhaitInscriptionACPE: String,
  joursParticipation: [String],
  horairePrefere: String,
  objectifPrincipal: String,
  ateliersInterets: [String],
  qrCode: String,              // QR code en base64
  statut: String,              // "en-attente" | "confirme" | "annule"
  createdAt: Date,
  updatedAt: Date
}
```

### **2. `admins`** - Comptes administrateurs

```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String,            // Hash bcrypt
  role: String,                // "admin" | "super-admin"
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛠️ Maintenance de la base de données

### Sauvegarder la base de données

#### MongoDB Local
```bash
# Sauvegarde complète
mongodump --db salon-emploi-2025 --out ./backup/$(date +%Y%m%d)

# Sauvegarde compressée
mongodump --db salon-emploi-2025 --archive=backup-$(date +%Y%m%d).gz --gzip
```

#### MongoDB Atlas
```bash
# Télécharger mongodump Atlas
mongodump --uri="mongodb+srv://euloge348_db_user:PASSWORD@cluster0.vht9dh5.mongodb.net/salon-emploi-2025" --out ./backup
```

### Restaurer la base de données

```bash
# Restaurer depuis une sauvegarde
mongorestore --db salon-emploi-2025 ./backup/salon-emploi-2025

# Restaurer depuis une archive compressée
mongorestore --db salon-emploi-2025 --archive=backup-20250113.gz --gzip
```

### Nettoyer les anciennes inscriptions

```bash
mongosh

use salon-emploi-2025

# Supprimer les inscriptions en attente de plus de 30 jours
db.registrations.deleteMany({
  statut: "en-attente",
  createdAt: { $lt: new Date(Date.now() - 30*24*60*60*1000) }
})
```

---

## 🔒 Sécurité

### Bonnes pratiques

1. **Ne JAMAIS commiter `config.env` dans Git** ✅ (déjà dans `.gitignore`)

2. **Changer les mots de passe en production** :
   ```env
   # Générer un JWT secret fort
   JWT_SECRET=$(openssl rand -base64 64)
   
   # Créer un mot de passe email app-specific
   # https://myaccount.google.com/apppasswords
   ```

3. **Limiter les accès MongoDB Atlas** :
   - Allez dans **Network Access**
   - Ajoutez seulement les IPs autorisées
   - Évitez `0.0.0.0/0` (tout le monde) en production

4. **Activer l'authentification** :
   - MongoDB Atlas : déjà activé ✅
   - MongoDB Local : à configurer

---

## 🐛 Dépannage

### Problème : "Cannot connect to MongoDB"

**Solution 1 : Vérifier que MongoDB est démarré**
```bash
# macOS (Homebrew)
brew services list | grep mongodb
brew services start mongodb-community

# Linux
sudo systemctl status mongod
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Solution 2 : Vérifier l'URL de connexion**
```bash
# Dans backend/config.env
# Local
MONGODB_URI=mongodb://localhost:27017/salon-emploi-2025

# Atlas (vérifier le mot de passe)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

**Solution 3 : Vérifier les pare-feu**
```bash
# MongoDB écoute sur le port 27017
lsof -i :27017
```

---

### Problème : "Authentication failed"

**Solution : Vérifier les identifiants MongoDB Atlas**
1. Allez sur https://cloud.mongodb.com
2. **Database Access** → Vérifier l'utilisateur
3. Si nécessaire, réinitialiser le mot de passe
4. Mettre à jour `MONGODB_URI` dans `config.env`

---

### Problème : "Database not found"

**Solution : Créer la base de données**
```bash
mongosh
use salon-emploi-2025
db.createCollection("registrations")
exit
```

---

## 📈 Monitoring

### Vérifier les performances

```javascript
// Dans mongosh
use salon-emploi-2025

// Statistiques de la base
db.stats()

// Statistiques d'une collection
db.registrations.stats()

// Index utilisés
db.registrations.getIndexes()

// Requêtes lentes
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().sort({ts: -1}).limit(5)
```

### Créer des index pour les performances

```javascript
// Index sur le numéro d'inscription (recherche rapide)
db.registrations.createIndex({ numeroInscription: 1 }, { unique: true })

// Index sur l'email (recherche rapide)
db.registrations.createIndex({ email: 1 })

// Index sur la date de création (tri)
db.registrations.createIndex({ createdAt: -1 })

// Index sur le statut (filtrage)
db.registrations.createIndex({ statut: 1 })

// Index composé (recherche + filtrage)
db.registrations.createIndex({ statut: 1, createdAt: -1 })
```

---

## 🌐 Passer de Local à Atlas (ou vice-versa)

### Migrer de Local → Atlas

```bash
# 1. Exporter depuis local
mongodump --db salon-emploi-2025 --out ./export

# 2. Importer vers Atlas
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/salon-emploi-2025" ./export/salon-emploi-2025

# 3. Mettre à jour config.env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/salon-emploi-2025
```

### Migrer de Atlas → Local

```bash
# 1. Exporter depuis Atlas
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/salon-emploi-2025" --out ./export

# 2. Importer vers local
mongorestore --db salon-emploi-2025 ./export/salon-emploi-2025

# 3. Mettre à jour config.env
MONGODB_URI=mongodb://localhost:27017/salon-emploi-2025
```

---

## ✅ Checklist de configuration

- [x] MongoDB installé et démarré
- [x] Base de données `salon-emploi-2025` créée
- [x] Connexion testée et fonctionnelle
- [x] `backend/config.env` configuré
- [ ] Compte admin créé (`npm run create-admin`)
- [ ] Backend démarré (`npm run dev`)
- [ ] Test d'inscription réalisé

---

## 📞 Support

### Ressources utiles

- **MongoDB Documentation** : https://docs.mongodb.com
- **MongoDB Atlas** : https://cloud.mongodb.com
- **Mongoose Documentation** : https://mongoosejs.com
- **Backend README** : `backend/README.md`
- **Architecture** : `backend/ARCHITECTURE.md`

### Commandes rapides

```bash
# Vérifier MongoDB
brew services list | grep mongodb

# Démarrer MongoDB
brew services start mongodb-community

# Stopper MongoDB
brew services stop mongodb-community

# Redémarrer MongoDB
brew services restart mongodb-community

# Logs MongoDB
tail -f /usr/local/var/log/mongodb/mongo.log
```

---

**© 2025 ACPE - Agence Congolaise Pour l'Emploi**

