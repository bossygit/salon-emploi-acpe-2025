# 🌐 URLs du Projet - Salon National de l'Emploi Jeune 2025

## 📱 Applications Déployées

### 1. Frontend (Plateforme d'inscription publique)
**URL de Production** : https://front-ak5owrg7r-kitutupros-projects.vercel.app

**Description** : Interface publique où les jeunes s'inscrivent au salon
- Formulaire d'inscription complet
- Upload de CV
- Vérification numéro ACPE
- Confirmation d'inscription

---

### 2. Backend (API)
**URL de Production** : https://backend-1vzhrzgny-kitutupros-projects.vercel.app

**Description** : API REST pour gérer les inscriptions
- Endpoints : `/api/registration`, `/api/acpe/verify`, `/api/admin`
- Base de données : MongoDB Atlas
- Upload de fichiers (CV)
- Génération de numéros d'inscription

**Points d'accès API** :
- POST `/api/registration` - Créer une inscription
- GET `/api/registration/:numero` - Récupérer une inscription
- POST `/api/acpe/verify` - Vérifier un numéro ACPE
- GET `/api/registration/stats/public` - Statistiques publiques

---

### 3. Dashboard (Administration)
**URL de Production** : https://dashboard-csp53tk8u-kitutupros-projects.vercel.app

**Description** : Interface d'administration pour gérer les inscriptions
- Liste des inscriptions
- Statistiques en temps réel
- Gestion des statuts
- Recherche et filtres

---

## 🔑 Accès Admin (À configurer)

Pour accéder au dashboard, vous devez créer un compte admin :

```bash
cd backend
npm run create-admin
```

Suivez les instructions pour créer votre compte administrateur.

---

## 📊 GitHub Repository

**URL** : https://github.com/bossygit/salon-emploi-acpe-2025

---

## ⚙️ Configuration Requise

### Variables d'Environnement Backend (Vercel)

Allez sur : https://vercel.com/kitutupros-projects/backend/settings/environment-variables

Ajoutez :
- `MONGODB_URI` : Votre chaîne de connexion MongoDB Atlas
- `JWT_SECRET` : Clé secrète JWT (générer avec `openssl rand -base64 32`)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` : Configuration email
- `FRONTEND_URL` : https://front-ak5owrg7r-kitutupros-projects.vercel.app

### MongoDB Atlas

1. Créez un cluster sur https://www.mongodb.com/cloud/atlas
2. Whitelist IP : `0.0.0.0/0` (pour Vercel)
3. Créez un utilisateur
4. Récupérez la chaîne de connexion
5. Ajoutez-la dans les variables Vercel

---

## 🧪 Tests

### Tester le Backend
```bash
curl https://backend-1vzhrzgny-kitutupros-projects.vercel.app/api/health
```

### Tester le Frontend
Visitez : https://front-ak5owrg7r-kitutupros-projects.vercel.app

### Tester le Dashboard
Visitez : https://dashboard-csp53tk8u-kitutupros-projects.vercel.app

---

## 📞 Support

- **Documentation complète** : Voir `DEPLOYMENT.md`
- **Architecture** : Voir `ARCHITECTURE_COMPLETE.md`
- **Issues GitHub** : https://github.com/bossygit/salon-emploi-acpe-2025/issues

---

**Dernière mise à jour** : 13 octobre 2025
**Statut** : ✅ Tous les services déployés et opérationnels

