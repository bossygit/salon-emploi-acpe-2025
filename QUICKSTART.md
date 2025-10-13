# ⚡ Guide de Démarrage Rapide

**Votre plateforme est déployée ! Voici comment la rendre pleinement fonctionnelle.**

---

## 🎯 État Actuel (13 octobre 2025)

✅ **Frontend déployé** : https://front-ak5owrg7r-kitutupros-projects.vercel.app  
✅ **Backend déployé** : https://backend-mauve-phi-53.vercel.app  
✅ **Dashboard déployé** : https://dashboard-44fjp7adv-kitutupros-projects.vercel.app  

⚠️ **Problème** : MongoDB n'est pas encore configuré  
🎯 **Solution** : Suivre les 3 étapes ci-dessous (15 minutes)

---

## 🚀 3 Étapes pour Finaliser (15 min)

### Étape 1️⃣ : Créer MongoDB Atlas (5 min)

1. **Allez sur** : https://www.mongodb.com/cloud/atlas/register
2. **Créez un compte gratuit**
3. **Créez un cluster** :
   - Choisissez **M0 (Free)**
   - Région : choisissez la plus proche (ex: Paris)
   - Cliquez sur **Create**
4. **Créez un utilisateur de base de données** :
   - Username : `euloge348_db_user`
   - Password : créez un mot de passe fort (notez-le !)
   - Cliquez sur **Create User**
5. **Autorisez l'accès depuis partout** :
   - IP Address : `0.0.0.0/0` (permet Vercel)
   - Cliquez sur **Add Entry**
6. **Obtenez l'URL de connexion** :
   - Cliquez sur **Connect** > **Connect your application**
   - Copiez l'URL : `mongodb+srv://euloge348_db_user:<password>@cluster0...`
   - Remplacez `<password>` par votre vrai mot de passe

---

### Étape 2️⃣ : Configurer Vercel (5 min)

1. **Allez sur Vercel** : https://vercel.com/kitutupros-projects/backend/settings/environment-variables

2. **Ajoutez ces variables** (cliquez sur "Add" pour chacune) :

```env
# 1. MongoDB (OBLIGATOIRE)
MONGODB_URI=mongodb+srv://euloge348_db_user:VOTRE_MOT_DE_PASSE@cluster0.vht9dh5.mongodb.net/salon-emploi-2025

# 2. JWT (OBLIGATOIRE)
JWT_SECRET=acpe-salon-emploi-2025-super-secret-key-change-this-in-production
JWT_EXPIRE=7d

# 3. Email Gmail (OPTIONNEL pour l'instant)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
EMAIL_FROM=ACPE <noreply@acpe.cg>

# 4. CORS
FRONTEND_URL=https://front-ak5owrg7r-kitutupros-projects.vercel.app

# 5. Environnement
NODE_ENV=production
```

**Important** : Pour chaque variable, sélectionnez **"Production"** comme environnement !

---

### Étape 3️⃣ : Redéployer (5 min)

#### Option A : Via Vercel Dashboard (Recommandé)

1. Allez sur : https://vercel.com/kitutupros-projects/backend
2. Cliquez sur les **3 points (...)** > **Redeploy**
3. Cochez **"Use existing Build Cache"**
4. Cliquez sur **Redeploy**
5. Attendez ~2 minutes

#### Option B : Via Terminal

```bash
cd /Volumes/Smart/work/acpe/enregistrement/backend
vercel --prod --yes
```

---

## ✅ Vérification (2 min)

### 1. Vérifiez MongoDB

```bash
curl https://backend-mauve-phi-53.vercel.app/api/health
```

**Résultat attendu** :
```json
{
  "status": "OK",
  "database": "connected",  // ✅ Doit être "connected"
  "mongodb": {
    "status": "connected",
    "name": "salon-emploi-2025"
  }
}
```

Si vous voyez `"database": "connected"` → **🎉 SUCCÈS !**

### 2. Vérifiez le Dashboard

Visitez : https://dashboard-44fjp7adv-kitutupros-projects.vercel.app

**Résultat attendu** :
- ✅ Affichage des statistiques (même si à zéro)
- ✅ Pas de message d'erreur
- ✅ Interface complète visible

### 3. Testez une inscription

Visitez : https://front-ak5owrg7r-kitutupros-projects.vercel.app

**Important** : Le frontend utilise actuellement une **API simulée**. Pour le connecter au vrai backend :

1. Modifier `front/utils/api.ts`
2. Remplacer les fonctions par de vrais appels API
3. Voir `INTEGRATION.md` pour les détails

---

## 🆘 En cas de problème

### ❌ MongoDB toujours "disconnected"

**Causes possibles** :
1. Mot de passe incorrect dans `MONGODB_URI`
2. IP non autorisée (`0.0.0.0/0` doit être ajouté)
3. Nom d'utilisateur incorrect
4. Cluster pas encore prêt (attendez 2-3 minutes)

**Solution** :
```bash
# 1. Vérifiez les logs Vercel
https://vercel.com/kitutupros-projects/backend

# 2. Revérifiez MONGODB_URI (pas de <> autour du mot de passe)
mongodb+srv://user:MOT_DE_PASSE@cluster... 
# PAS : mongodb+srv://user:<MOT_DE_PASSE>@cluster...

# 3. Testez la connexion localement
cd backend
node test-mongodb.js
```

### ❌ Dashboard affiche "Failed to fetch"

**Causes** :
1. Backend pas redéployé après config MongoDB
2. CORS mal configuré
3. Protection Vercel active

**Solution** :
1. Redéployez le backend (Étape 3)
2. Vérifiez `backend/server.js` - CORS doit autoriser `.vercel.app`
3. Voir `VERCEL_PROTECTION.md`

### ❌ Erreur lors de l'inscription

**Cause** : Frontend utilise API simulée

**Solution** :
- Voir `INTEGRATION.md` section "Connecter Frontend au Backend"
- Ou attendez que nous le fassions ensemble

---

## 📚 Documentation Complète

| Fichier | Quand l'utiliser |
|---------|------------------|
| **QUICKSTART.md** (ce fichier) | Premier démarrage |
| **STATUS.md** | Voir l'état actuel |
| **DEPLOYMENT.md** | Configuration détaillée |
| **URLS.md** | Toutes les URLs |
| **INTEGRATION.md** | Connecter Frontend-Backend |
| **MONGODB_SETUP.md** | Problèmes MongoDB |
| **VERCEL_PROTECTION.md** | Erreur 401 |

---

## 🎯 Checklist Complète

- [ ] MongoDB Atlas créé
- [ ] Utilisateur de base de données créé
- [ ] IP `0.0.0.0/0` autorisée
- [ ] URL de connexion MongoDB copiée
- [ ] Variables Vercel ajoutées (au moins `MONGODB_URI` et `JWT_SECRET`)
- [ ] Backend redéployé
- [ ] Test `/api/health` réussi (`"database": "connected"`)
- [ ] Dashboard accessible sans erreur
- [ ] Frontend connecté au backend réel (optionnel)

---

## ⏱️ Temps Total Estimé

- ✅ Étape 1 (MongoDB Atlas) : **5 minutes**
- ✅ Étape 2 (Variables Vercel) : **5 minutes**
- ✅ Étape 3 (Redéploiement) : **5 minutes**
- ✅ Vérification : **2 minutes**

**TOTAL : ~17 minutes** pour avoir une plateforme **100% fonctionnelle** ! 🚀

---

## 💬 Besoin d'aide ?

1. **Consultez les messages d'erreur** du dashboard (très détaillés)
2. **Ouvrez la console du navigateur** (F12)
3. **Vérifiez les logs Vercel** : https://vercel.com/kitutupros-projects/backend
4. **Consultez la documentation** listée ci-dessus

---

**🎉 Bonne chance ! Votre plateforme sera opérationnelle dans quelques minutes !**

