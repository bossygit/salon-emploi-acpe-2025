# 🚀 Backend API - Salon National de l'Emploi Jeune 2025

Backend API pour la plateforme d'inscription du Salon National de l'Emploi Jeune 2025 organisé par l'ACPE.

## 📋 Caractéristiques

- ✅ **API REST complète** avec Express.js
- ✅ **Base de données MongoDB** avec Mongoose
- ✅ **Authentification JWT** pour les admins
- ✅ **Validation robuste** des données
- ✅ **Upload de fichiers** (CV)
- ✅ **Génération de QR codes** automatique
- ✅ **Envoi d'emails** de confirmation
- ✅ **Système de permissions** granulaire
- ✅ **Statistiques détaillées**
- ✅ **Export de données** (CSV/JSON)
- ✅ **Sécurité renforcée** (Helmet, CORS, Rate Limiting)

## 🛠️ Technologies

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **Multer** - Upload de fichiers
- **QRCode** - Génération de QR codes
- **Nodemailer** - Envoi d'emails
- **Express-validator** - Validation des données

## 🚀 Installation

### Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)
- npm ou yarn

### Étapes d'installation

1. **Installer les dépendances**
```bash
cd backend
npm install
```

2. **Configuration de l'environnement**
```bash
cp env.example .env
```

3. **Modifier le fichier .env**
```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/salon-emploi-2025

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Configuration Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Configuration CORS
FRONTEND_URL=http://localhost:3000
```

4. **Créer le dossier uploads**
```bash
mkdir -p uploads/cv
```

5. **Créer le super-admin initial**
```bash
npm run create-admin
```

6. **Démarrer le serveur**
```bash
# Développement
npm run dev

# Production
npm start
```

## 📚 API Endpoints

### 🔐 Authentification Admin

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/admin/login` | Connexion admin |
| GET | `/api/admin/profile` | Profil admin connecté |

### 📝 Inscriptions

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/registration` | Créer une inscription |
| GET | `/api/registration/:numero` | Récupérer une inscription |
| GET | `/api/registration/check/:email` | Vérifier un email |
| GET | `/api/registration/check-phone/:phone` | Vérifier un téléphone |
| GET | `/api/registration/stats/public` | Statistiques publiques |

### 👨‍💼 Administration

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/registrations` | Liste des inscriptions |
| GET | `/api/admin/registrations/:id` | Détails d'une inscription |
| PUT | `/api/admin/registrations/:id/status` | Modifier le statut |
| GET | `/api/admin/statistics` | Statistiques détaillées |
| GET | `/api/admin/export` | Exporter les données |
| POST | `/api/admin/create` | Créer un admin |

### 🏛️ ACPE

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/acpe/verify` | Vérifier un numéro ACPE |
| GET | `/api/acpe/assistance` | Informations d'assistance |
| GET | `/api/acpe/statistics` | Statistiques ACPE |
| POST | `/api/acpe/request-assistance` | Demander assistance |

### 🏥 Santé

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Statut de l'API |

## 📊 Modèles de Données

### Registration
```javascript
{
  // Informations personnelles
  nom: String,
  prenom: String,
  dateNaissance: Date,
  sexe: String,
  telephone: String,
  email: String,
  ville: String,
  region: String,
  
  // Profil professionnel
  niveauEtudes: String,
  domaineEtudes: String,
  situationActuelle: String,
  experienceAnnees: Number,
  secteursInterets: [String],
  cvFile: Object,
  ideeProjet: String,
  
  // ACPE
  inscritACPE: String,
  numeroACPE: String,
  souhaitInscriptionACPE: String,
  
  // Préférences salon
  joursParticipation: [String],
  horairePrefere: String,
  objectifPrincipal: String,
  ateliersInterets: [String],
  
  // Système
  numeroInscription: String,
  qrCode: Object,
  statut: String,
  accepteConditions: Boolean,
  accepteTraitementDonnees: Boolean,
  accepteCommunications: Boolean,
  
  // Métadonnées
  ipAddress: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Admin
```javascript
{
  nom: String,
  prenom: String,
  email: String,
  password: String,
  role: String,
  permissions: [String],
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Sécurité

### Authentification
- JWT tokens avec expiration
- Hachage des mots de passe avec bcrypt
- Middleware d'authentification sur les routes protégées

### Autorisation
- Système de rôles (super-admin, admin, moderator)
- Permissions granulaires
- Middleware d'autorisation

### Protection
- Helmet pour les headers de sécurité
- CORS configuré
- Rate limiting
- Validation des données d'entrée
- Sanitisation des données

## 📧 Configuration Email

### Gmail
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Autres fournisseurs
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-password
```

## 🗄️ Base de Données

### MongoDB Local
```bash
# Installer MongoDB
brew install mongodb-community

# Démarrer MongoDB
brew services start mongodb-community

# Connexion
mongodb://localhost:27017/salon-emploi-2025
```

### MongoDB Atlas
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/salon-emploi-2025
```

## 📁 Structure du Projet

```
backend/
├── models/           # Modèles Mongoose
│   ├── Registration.js
│   └── Admin.js
├── routes/           # Routes API
│   ├── registration.js
│   ├── admin.js
│   └── acpe.js
├── middleware/       # Middlewares
│   └── auth.js
├── utils/            # Utilitaires
│   ├── emailService.js
│   └── helpers.js
├── scripts/          # Scripts utilitaires
│   └── createAdmin.js
├── uploads/          # Fichiers uploadés
│   └── cv/
├── server.js         # Point d'entrée
├── package.json
└── README.md
```

## 🚀 Déploiement

### Variables d'environnement de production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
EMAIL_HOST=smtp.your-provider.com
EMAIL_USER=production@your-domain.com
EMAIL_PASS=your-production-password
FRONTEND_URL=https://your-frontend-domain.com
```

### Déploiement sur Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --prod
```

### Déploiement sur Heroku
```bash
# Installer Heroku CLI
# Créer une app
heroku create your-app-name

# Ajouter les variables d'environnement
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri

# Déployer
git push heroku main
```

## 🧪 Tests

```bash
# Lancer les tests
npm test

# Tests avec couverture
npm run test:coverage
```

## 📊 Monitoring

### Logs
- Logs structurés avec timestamps
- Niveaux de log (INFO, WARN, ERROR)
- Rotation des logs

### Santé de l'API
- Endpoint `/api/health`
- Vérification de la connexion DB
- Statistiques de performance

## 🔧 Scripts Disponibles

```bash
npm start          # Démarrer en production
npm run dev        # Démarrer en développement
npm run create-admin # Créer un admin initial
npm test           # Lancer les tests
npm run lint       # Vérifier le code
```

## 📞 Support

- **Email** : contact@acpe.cg
- **Téléphone** : +242 05 123 45 67
- **Site web** : https://acpe.cg

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](../LICENSE) pour plus de détails.

---

**© 2025 ACPE - Agence Congolaise Pour l'Emploi. Tous droits réservés.**
