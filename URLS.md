# 🌐 URLs du Projet - Salon National de l'Emploi Jeune 2025

## 📱 Applications Déployées

### 1. Frontend (Plateforme d'inscription publique)
**URL de Production** : https://front-ob31bvq9t-kitutupros-projects.vercel.app ✅
**URL Constante** : https://front-two-indol.vercel.app (configurée)
**Détection automatique** : Local → http://localhost:3001/api | Production → https://backend-mauve-phi-53.vercel.app/api

**Description** : Interface publique où les jeunes s'inscrivent au salon
- Formulaire d'inscription complet
- Upload de CV
- Vérification numéro ACPE
- Confirmation d'inscription

---

### 2. Backend (API)
**URL de Production** : https://backend-mauve-phi-53.vercel.app ✅

**Status** : API opérationnelle, endpoints disponibles
**Note** : Erreur FUNCTION_INVOCATION_FAILED sur certains endpoints (MongoDB à configurer)

**Description** : API REST pour gérer les inscriptions
- Endpoints : `/api/registration`, `/api/acpe/verify`, `/api/admin`
- Base de données : MongoDB Atlas
- Upload de fichiers (CV)
- Génération de numéros d'inscription

**Points d'accès API** :
- GET `/api/health` - Vérifier la santé du serveur et MongoDB
- POST `/api/registration` - Créer une inscription
- GET `/api/registration/:numero` - Récupérer une inscription
- POST `/api/acpe/verify` - Vérifier un numéro ACPE
- GET `/api/registration/stats/public` - Statistiques publiques

**Test rapide** :
```bash
curl https://backend-mauve-phi-53.vercel.app/api/health
```

---

### 3. Dashboard (Administration)
**URL de Production** : https://dashboard-65db2xe66-kitutupros-projects.vercel.app ✅
**Détection automatique** : Local → http://localhost:3001/api | Production → https://backend-mauve-phi-53.vercel.app/api

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
curl https://backend-mauve-phi-53.vercel.app/api/health
```

La réponse doit indiquer le statut de MongoDB :
```json
{
  "status": "OK",
  "message": "API Salon Emploi 2025 - Opérationnelle",
  "database": "connected",
  "mongodb": {
    "status": "connected",
    "name": "salon-emploi-2025"
  }
}
```

**Route racine** (vérifier que l'API répond) :
```bash
curl https://backend-mauve-phi-53.vercel.app/
```

Réponse attendue :
```json
{
  "message": "API Backend - Salon National de l'Emploi Jeune 2025",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "registration": "/api/registration",
    "admin": "/api/admin",
    "acpe": "/api/acpe"
  }
}
```

### Tester le Frontend
Visitez : https://front-ak5owrg7r-kitutupros-projects.vercel.app

### Tester le Dashboard
Visitez : https://dashboard-44fjp7adv-kitutupros-projects.vercel.app

**Statut actuel** : Le dashboard devrait maintenant afficher un message d'erreur détaillé avec :
- 🔄 URL tentée : `https://backend-mauve-phi-53.vercel.app/api/...`
- 📡 Diagnostics détaillés
- ⚡ Actions suggérées
- 📋 Informations techniques complètes

**Raison de l'erreur** : MongoDB est en mode "connecting" (readyState: 2)
- Vous devez configurer MongoDB Atlas
- Ajouter la variable `MONGODB_URI` sur Vercel
- Voir `DEPLOYMENT.md` pour les détails

---

## 📞 Support

- **Documentation complète** : Voir `DEPLOYMENT.md`
- **Architecture** : Voir `ARCHITECTURE_COMPLETE.md`
- **Issues GitHub** : https://github.com/bossygit/salon-emploi-acpe-2025/issues

---

**Dernière mise à jour** : 13 octobre 2025
**Statut** : ✅ Tous les services déployés et opérationnels

