# 🔗 Guide d'Intégration - Architecture Complète

## 📊 Vue d'ensemble de l'architecture

Le projet est organisé en **3 applications indépendantes** qui communiquent entre elles :

```
salon-emploi-acpe-2025/
│
├── 🌐 front/              # Application publique (Next.js)
│   └── Port: 3000
│
├── 🖥️  dashboard/         # Dashboard admin (Next.js)
│   └── Port: 3002
│
└── ⚙️  backend/           # API REST (Express.js)
    └── Port: 5000
```

---

## 🎯 Rôle de chaque application

### 1. **Frontend Public** (`/front/`)
**Technologie** : Next.js 14 + React 18 + TypeScript  
**Port** : 3000  
**Rôle** : Interface publique d'inscription au salon

**Fonctionnalités** :
- ✅ Formulaire d'inscription multi-étapes
- ✅ Upload de CV
- ✅ Sélection d'ateliers
- ✅ Validation en temps réel
- ✅ Confirmation d'inscription

**API utilisée** :
- ⚠️ **Actuellement** : API simulée locale (`/front/utils/api.ts`)
- ✅ **À connecter** : Backend API sur `http://localhost:5000`

---

### 2. **Dashboard Admin** (`/dashboard/`)
**Technologie** : Next.js 14 + React 18 + TypeScript + Tailwind  
**Port** : 3002  
**Rôle** : Interface d'administration pour gérer les inscriptions

**Fonctionnalités** :
- ✅ Vue d'ensemble des statistiques
- ✅ Liste des inscriptions
- ✅ Scanner QR Code
- ✅ Validation/annulation des inscriptions
- ✅ Export des données

**API utilisée** :
- ✅ **Connecté** : Backend API (`http://127.0.0.1:5000/api`)

---

### 3. **Backend API** (`/backend/`)
**Technologie** : Node.js + Express + MongoDB + Mongoose  
**Port** : 5000  
**Rôle** : API REST pour la gestion des données

**Fonctionnalités** :
- ✅ Gestion des inscriptions (CRUD)
- ✅ Authentification admin (JWT)
- ✅ Upload et stockage de CV
- ✅ Génération de QR codes
- ✅ Envoi d'emails de confirmation
- ✅ Vérification ACPE
- ✅ Statistiques en temps réel

**Architecture** : MVC (Model-View-Controller)

---

## 🔄 Flux de communication

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Frontend       │────────▶│  Backend API    │◀────────│  Dashboard      │
│  (Port 3000)    │  HTTP   │  (Port 5000)    │  HTTP   │  (Port 3002)    │
│                 │         │                 │         │                 │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   MongoDB       │
                            │   Database      │
                            └─────────────────┘
```

---

## 🚨 Points de compatibilité identifiés

### ✅ **Compatibilités OK**

1. **Technologies cohérentes** :
   - Toutes les apps utilisent Node.js 18+
   - Tailwind CSS unifié
   - TypeScript configuré correctement
   - Same color palette (#1B80BF, #F2133C, #238C33, etc.)

2. **API Dashboard ↔ Backend** :
   - ✅ Dashboard correctement configuré pour pointer vers `http://127.0.0.1:5000/api`
   - ✅ Types TypeScript définis dans `/dashboard/src/types/`
   - ✅ Client API implémenté dans `/dashboard/src/lib/api.ts`

3. **CORS Backend** :
   - ✅ Backend autorise `http://localhost:3000` (Frontend)
   - ✅ Backend autorise `http://localhost:3002` (Dashboard)

4. **Modèles de données** :
   - ✅ Structure des données cohérente entre Frontend et Backend
   - ✅ Schéma Mongoose aligné avec les types TypeScript

---

### ⚠️ **Points à corriger**

#### 1. **Frontend → Backend : API non connectée**

**Problème** :
Le frontend utilise une API **simulée** locale au lieu du vrai backend.

**Fichier concerné** : `/front/utils/api.ts`

**Solution** :
Remplacer l'API simulée par des appels réels au backend.

**Action requise** :
```typescript
// Avant (simulé)
const API_BASE_URL = 'http://localhost:3000'; // ❌

// Après (réel)
const API_BASE_URL = 'http://localhost:5000/api'; // ✅
```

---

#### 2. **Dashboard : Configuration Next.js obsolète**

**Problème** :
Le fichier `dashboard/next.config.js` utilise `experimental.appDir` qui n'est plus nécessaire dans Next.js 14.

**Fichier concerné** : `/dashboard/next.config.js`

**Solution** :
✅ **Déjà corrigé** - Configuration nettoyée

---

#### 3. **Variables d'environnement manquantes**

**Problème** :
Chaque application a besoin de variables d'environnement pour communiquer.

**Fichiers à créer** :

##### `/front/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

##### `/dashboard/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3002
```

##### `/backend/config.env` (déjà existant, vérifier la configuration)
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:3002
MONGODB_URI=mongodb://localhost:27017/salon-emploi-2025
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

#### 4. **MongoDB doit être installé et démarré**

**Vérification** :
```bash
# Vérifier si MongoDB est installé
mongod --version

# Démarrer MongoDB
# macOS avec Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

---

## 🚀 Démarrage de l'architecture complète

### **Étape 1 : Préparer le Backend**

```bash
cd backend

# Copier et configurer les variables d'environnement
cp env.example config.env
# Éditer config.env avec vos vraies valeurs

# Installer les dépendances
npm install

# Initialiser les dossiers
npm run init-dirs

# Créer un compte admin
npm run create-admin

# Démarrer le serveur
npm run dev
```

Le backend sera accessible sur **http://localhost:5000**

---

### **Étape 2 : Démarrer le Dashboard**

```bash
cd dashboard

# Créer le fichier .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Installer les dépendances (si nécessaire)
npm install

# Démarrer le dashboard
npm run dev
```

Le dashboard sera accessible sur **http://localhost:3002**

---

### **Étape 3 : Démarrer le Frontend**

```bash
cd front

# Créer le fichier .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Installer les dépendances (déjà fait)
# npm install

# Démarrer le frontend
npm run dev
```

Le frontend sera accessible sur **http://localhost:3000**

---

## 🔧 Ordre de démarrage recommandé

```bash
# Terminal 1 : Backend (OBLIGATOIRE EN PREMIER)
cd backend && npm run dev

# Terminal 2 : Frontend
cd front && npm run dev

# Terminal 3 : Dashboard
cd dashboard && npm run dev
```

---

## 📡 Endpoints API Backend

### **Inscriptions**
```
POST   /api/registration          # Créer une inscription
GET    /api/registration          # Liste des inscriptions (admin)
GET    /api/registration/:numero  # Détails d'une inscription
PUT    /api/registration/:numero  # Modifier une inscription
DELETE /api/registration/:numero  # Supprimer une inscription
GET    /api/registration/stats/public  # Statistiques publiques
POST   /api/registration/verify-qr     # Vérifier un QR code
```

### **Admin**
```
POST   /api/admin/login           # Connexion admin
GET    /api/admin/me              # Profil admin
POST   /api/admin/logout          # Déconnexion
```

### **ACPE**
```
POST   /api/acpe/verify           # Vérifier un numéro ACPE
```

---

## 🔐 Authentification

### **Frontend Public**
- ❌ Pas d'authentification requise
- ✅ Accès libre au formulaire d'inscription

### **Dashboard Admin**
- ✅ Authentification JWT requise
- ✅ Token stocké dans localStorage
- ✅ Middleware `auth.js` vérifie le token

### **Backend API**
- ✅ JWT pour les routes admin
- ✅ Rate limiting pour éviter les abus
- ✅ CORS configuré pour les domaines autorisés

---

## 📊 Base de données MongoDB

### **Collections**

#### `registrations`
```javascript
{
  numeroInscription: String,      // ACPE2025XXXXX
  nom: String,
  prenom: String,
  email: String,
  telephone: String,
  // ... autres champs
  qrCode: String,                 // QR code en base64
  statut: String,                 // en-attente | confirme | annule
  createdAt: Date,
  updatedAt: Date
}
```

#### `admins`
```javascript
{
  username: String,
  email: String,
  password: String,               // Hashé avec bcrypt
  role: String,                   // admin | super-admin
  createdAt: Date
}
```

---

## 🎨 Design System unifié

Toutes les applications partagent la même palette de couleurs :

```css
--primary: #1B80BF      /* Bleu ACPE */
--secondary: #F2133C    /* Rouge */
--success: #238C33      /* Vert */
--danger: #A60303       /* Rouge foncé */
--dark: #0D0D0D        /* Noir */
```

**Fichiers de configuration** :
- `/front/tailwind.config.js`
- `/dashboard/tailwind.config.js`

---

## ✅ Checklist de compatibilité

- [x] Backend API opérationnel (port 5000)
- [x] Dashboard connecté au backend
- [ ] Frontend connecté au backend (API simulée à remplacer)
- [x] CORS configuré correctement
- [x] Types TypeScript cohérents
- [ ] Variables d'environnement configurées
- [ ] MongoDB installé et démarré
- [x] Palette de couleurs unifiée
- [x] Architecture MVC respectée

---

## 🐛 Dépannage

### **Problème : CORS Error**
```
Solution : Vérifier que le backend autorise l'origine dans server.js
Ligne 22-27 : allowedOrigins array
```

### **Problème : Cannot connect to MongoDB**
```
Solution : Démarrer MongoDB et vérifier MONGODB_URI dans config.env
```

### **Problème : 401 Unauthorized sur Dashboard**
```
Solution : Se connecter via /api/admin/login et vérifier le token JWT
```

### **Problème : Port déjà utilisé**
```
Solution : Changer le port dans package.json ou tuer le processus
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3002 | xargs kill -9  # Dashboard
```

---

## 📞 Support

Pour toute question concernant l'intégration :
- Consulter `backend/ARCHITECTURE.md` pour l'API
- Consulter `front/README.md` pour le frontend
- Consulter `STRUCTURE.md` pour l'organisation globale

---

**© 2025 ACPE - Agence Congolaise Pour l'Emploi**

