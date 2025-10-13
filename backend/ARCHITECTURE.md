# 🏗️ Architecture Backend - Salon Emploi 2025

## 📁 Structure MVC Complète

```
backend/
├── 📁 controllers/          # Couche contrôleur (logique métier)
│   ├── registrationController.js
│   ├── adminController.js
│   └── acpeController.js
├── 📁 models/              # Couche modèle (données)
│   ├── Registration.js
│   └── Admin.js
├── 📁 routes/              # Couche route (endpoints)
│   ├── registration.js
│   ├── admin.js
│   └── acpe.js
├── 📁 middleware/          # Middlewares personnalisés
│   └── auth.js
├── 📁 utils/               # Utilitaires et services
│   ├── emailService.js
│   └── helpers.js
├── 📁 scripts/             # Scripts utilitaires
│   └── createAdmin.js
├── 📁 uploads/             # Fichiers uploadés
│   └── cv/
├── server.js               # Point d'entrée principal
├── package.json
└── README.md
```

## 🔄 Flux de Données MVC

### 1. **Route** → **Controller** → **Model** → **Database**

```
Client Request
     ↓
Routes (routes/*.js)
     ↓
Middleware (auth, validation)
     ↓
Controller (controllers/*.js)
     ↓
Model (models/*.js)
     ↓
MongoDB Database
```

### 2. **Exemple Concret : Création d'inscription**

```javascript
// 1. Route (routes/registration.js)
router.post('/', upload.single('cvFile'), registrationValidation, createRegistration);

// 2. Controller (controllers/registrationController.js)
const createRegistration = async (req, res) => {
  // Logique métier
  const registration = new Registration(data);
  await registration.save();
  // ...
};

// 3. Model (models/Registration.js)
const registrationSchema = new mongoose.Schema({...});
module.exports = mongoose.model('Registration', registrationSchema);
```

## 🎯 Responsabilités par Couche

### **Routes** (`/routes/`)
- ✅ Définition des endpoints
- ✅ Validation des données d'entrée
- ✅ Gestion des middlewares
- ✅ Routage des requêtes

```javascript
// Exemple
router.post('/registration', validation, middleware, controller);
```

### **Controllers** (`/controllers/`)
- ✅ Logique métier
- ✅ Traitement des requêtes
- ✅ Gestion des erreurs
- ✅ Formatage des réponses
- ✅ Appels aux services externes

```javascript
// Exemple
const createRegistration = async (req, res) => {
  try {
    // Logique métier
    const result = await service.create(data);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### **Models** (`/models/`)
- ✅ Définition des schémas
- ✅ Validation des données
- ✅ Méthodes d'instance
- ✅ Méthodes statiques
- ✅ Hooks et middleware

```javascript
// Exemple
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

userSchema.methods.toPublicJSON = function() {
  // Logique de sérialisation
};
```

## 🔧 Contrôleurs Disponibles

### **RegistrationController**
```javascript
- createRegistration()      // Créer une inscription
- getRegistrationByNumber() // Récupérer par numéro
- checkEmail()             // Vérifier email
- checkPhone()             // Vérifier téléphone
- getPublicStats()         // Statistiques publiques
```

### **AdminController**
```javascript
- loginAdmin()             // Connexion admin
- getAdminProfile()        // Profil admin
- getRegistrations()       // Liste inscriptions
- getRegistrationById()    // Détails inscription
- updateRegistrationStatus() // Modifier statut
- getStatistics()          // Statistiques détaillées
- createAdmin()            // Créer admin
- exportData()             // Exporter données
```

### **ACPEController**
```javascript
- verifyACPE()             // Vérifier numéro ACPE
- getAssistanceInfo()      // Infos assistance
- getACPEStatistics()      // Stats ACPE
- requestAssistance()      // Demander assistance
```

## 🛡️ Middlewares

### **Auth Middleware** (`/middleware/auth.js`)
```javascript
- authenticateAdmin()      // Vérifier token JWT
- authorizeAdmin()         // Vérifier permissions
- requireRole()            // Vérifier rôle
```

## 🛠️ Services et Utilitaires

### **Email Service** (`/utils/emailService.js`)
```javascript
- sendConfirmationEmail()  // Email confirmation
- sendReminderEmail()      // Email rappel
- sendAssistanceEmail()    // Email assistance
```

### **Helpers** (`/utils/helpers.js`)
```javascript
- validateRegistrationData() // Validation données
- sanitizeRegistrationData() // Nettoyage données
- generateRegistrationNumber() // Génération numéro
- formatPhoneNumber()      // Formatage téléphone
```

## 📊 Avantages de cette Architecture

### ✅ **Séparation des Responsabilités**
- Chaque couche a un rôle précis
- Code plus maintenable et testable
- Réutilisabilité des composants

### ✅ **Scalabilité**
- Facile d'ajouter de nouvelles fonctionnalités
- Structure claire pour l'équipe
- Évolution progressive possible

### ✅ **Testabilité**
- Contrôleurs isolés et testables
- Mocking des dépendances facile
- Tests unitaires et d'intégration

### ✅ **Sécurité**
- Middlewares centralisés
- Validation à plusieurs niveaux
- Gestion d'erreurs cohérente

## 🚀 Utilisation

### **Ajouter une nouvelle fonctionnalité**

1. **Créer le modèle** (si nécessaire)
```javascript
// models/NewModel.js
const schema = new mongoose.Schema({...});
module.exports = mongoose.model('NewModel', schema);
```

2. **Créer le contrôleur**
```javascript
// controllers/newController.js
const newFunction = async (req, res) => {
  // Logique métier
};
module.exports = { newFunction };
```

3. **Créer la route**
```javascript
// routes/new.js
const { newFunction } = require('../controllers/newController');
router.post('/endpoint', middleware, newFunction);
```

4. **Enregistrer la route**
```javascript
// server.js
app.use('/api/new', require('./routes/new'));
```

## 📝 Bonnes Pratiques

### **Controllers**
- ✅ Une fonction par endpoint
- ✅ Gestion d'erreurs cohérente
- ✅ Validation des données
- ✅ Réponses standardisées

### **Models**
- ✅ Validation stricte
- ✅ Méthodes utilitaires
- ✅ Hooks appropriés
- ✅ Index pour les performances

### **Routes**
- ✅ Validation des entrées
- ✅ Middlewares appropriés
- ✅ Documentation claire
- ✅ Gestion des erreurs

---

**Cette architecture MVC garantit un code propre, maintenable et évolutif pour votre plateforme d'inscription au Salon Emploi 2025 !** 🎉
