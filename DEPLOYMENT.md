# 🚀 Déploiement - Salon National de l'Emploi Jeune 2025

## 📍 URLs de Production

### 🌐 Frontend (Plateforme d'inscription)
- **Production** : https://front-emxqfbaxa-kitutupros-projects.vercel.app
- **Inspect** : https://vercel.com/kitutupros-projects/front/7wDWNW65mxXTMsvc3xKZvAvfSyjV

### 🔧 Backend (API)
- **Production** : https://backend-1vzhrzgny-kitutupros-projects.vercel.app
- **Inspect** : https://vercel.com/kitutupros-projects/backend/CoZPALD6KMeSYyGBkDnEqToS9MLk

### 📊 Dashboard (Admin)
- **Production** : https://dashboard-hpbypzu8m-kitutupros-projects.vercel.app
- **Inspect** : https://vercel.com/kitutupros-projects/dashboard/F8WegCes61iAJZEeUAyazWucK7bR

---

## ⚙️ Configuration Post-Déploiement

### 1. Variables d'Environnement Backend

Vous devez configurer les variables d'environnement sur Vercel pour le backend :

#### Via Dashboard Vercel :
1. Allez sur https://vercel.com/kitutupros-projects/backend/settings/environment-variables
2. Ajoutez les variables suivantes :

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/salon-emploi-2025

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=ACPE <noreply@acpe.cg>

# Configuration Upload
MAX_FILE_SIZE=5242880

# CORS
FRONTEND_URL=https://front-emxqfbaxa-kitutupros-projects.vercel.app

# ACPE API (si disponible)
ACPE_API_URL=https://api.acpe.cg
ACPE_API_KEY=your-acpe-api-key
```

### 2. Mettre à jour l'URL du Backend dans le Frontend

Dans `front/utils/api.ts`, mettez à jour l'URL du backend :

```typescript
const API_BASE_URL = 'https://backend-1vzhrzgny-kitutupros-projects.vercel.app/api';
```

### 3. Mettre à jour l'URL du Backend dans le Dashboard

Dans `dashboard/src/lib/api.ts`, mettez à jour l'URL du backend :

```typescript
const API_BASE_URL = 'https://backend-1vzhrzgny-kitutupros-projects.vercel.app/api';
```

### 4. Configurer CORS dans le Backend

Le backend doit autoriser les requêtes depuis :
- Frontend : `https://front-emxqfbaxa-kitutupros-projects.vercel.app`
- Dashboard : `https://dashboard-hpbypzu8m-kitutupros-projects.vercel.app`

Vérifiez `backend/server.js` :

```javascript
const allowedOrigins = [
  'https://front-emxqfbaxa-kitutupros-projects.vercel.app',
  'https://dashboard-hpbypzu8m-kitutupros-projects.vercel.app',
  'http://localhost:3000',
  'http://localhost:3002'
];
```

---

## 🔄 Redéploiement

### Frontend
```bash
cd front
vercel --prod
```

### Backend
```bash
cd backend
vercel --prod --yes
```

### Dashboard
```bash
cd dashboard
vercel --prod --yes
```

---

## 🗄️ Base de Données MongoDB

### Option 1 : MongoDB Atlas (Recommandé pour Production)

1. Créez un compte sur https://www.mongodb.com/cloud/atlas
2. Créez un cluster gratuit
3. Configurez l'accès réseau (IP Whitelist : `0.0.0.0/0` pour Vercel)
4. Créez un utilisateur de base de données
5. Récupérez la chaîne de connexion
6. Ajoutez-la dans les variables d'environnement Vercel

### Option 2 : MongoDB Local (Développement uniquement)

Pour le développement local, utilisez :
```bash
mongodb://localhost:27017/salon-emploi-2025
```

---

## 📧 Configuration Email

### Gmail avec App Password

1. Activez la validation en 2 étapes sur votre compte Gmail
2. Générez un mot de passe d'application :
   - Allez dans Paramètres Google > Sécurité
   - Mots de passe d'application
   - Créez un nouveau mot de passe pour "Autre application"
3. Utilisez ce mot de passe dans `EMAIL_PASS`

---

## 🔐 Sécurité

### Variables Sensibles
- ❌ Ne commitez JAMAIS les fichiers `.env` ou `config.env`
- ✅ Utilisez toujours les variables d'environnement Vercel
- ✅ Générez un `JWT_SECRET` fort : `openssl rand -base64 32`

### CORS
- Limitez les origines autorisées aux domaines de production
- Ne mettez pas `*` en production

---

## 🧪 Tests Post-Déploiement

### 1. Tester le Backend
```bash
curl https://backend-1vzhrzgny-kitutupros-projects.vercel.app/api/health
```

### 2. Tester le Frontend
Visitez https://front-emxqfbaxa-kitutupros-projects.vercel.app

### 3. Tester le Dashboard
Visitez https://dashboard-hpbypzu8m-kitutupros-projects.vercel.app

---

## 📝 Logs et Monitoring

### Consulter les Logs
1. Backend : https://vercel.com/kitutupros-projects/backend
2. Frontend : https://vercel.com/kitutupros-projects/front
3. Dashboard : https://vercel.com/kitutupros-projects/dashboard

### Monitoring
Vercel fournit automatiquement :
- Analytics
- Error tracking
- Performance metrics

---

## 🆘 Dépannage

### Erreur CORS
- Vérifiez que les URLs sont correctement configurées dans `allowedOrigins`
- Redéployez le backend après modification

### Erreur de connexion MongoDB
- Vérifiez la chaîne de connexion
- Vérifiez l'IP Whitelist sur MongoDB Atlas
- Vérifiez les identifiants utilisateur

### Variables d'environnement non définies
- Allez dans Settings > Environment Variables sur Vercel
- Redéployez après ajout des variables

---

## 📞 Support

Pour toute question :
- Documentation Vercel : https://vercel.com/docs
- Documentation MongoDB : https://docs.mongodb.com/
- GitHub Issues : https://github.com/bossygit/salon-emploi-acpe-2025/issues

---

**Dernière mise à jour** : 13 octobre 2025

