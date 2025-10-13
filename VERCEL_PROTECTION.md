# 🔐 Désactivation de la Protection Vercel

## Problème Actuel

Le backend renvoie une page "Authentication Required" car la **Deployment Protection** est activée par défaut sur Vercel.

```
HTTP/2 401 
Authentication Required
```

## ⚡ Solution Rapide

### 1. Désactiver la Protection de Déploiement

Pour chaque projet (backend, frontend, dashboard) :

1. **Allez sur Vercel** :
   - Backend : https://vercel.com/kitutupros-projects/backend/settings/deployment-protection
   - Frontend : https://vercel.com/kitutupros-projects/front/settings/deployment-protection
   - Dashboard : https://vercel.com/kitutupros-projects/dashboard/settings/deployment-protection

2. **Changez le paramètre** :
   - Sélectionnez **"Disable Protection"** ou **"Public"**
   - Cliquez sur **"Save"**

3. **Redéployez** (si nécessaire) :
   ```bash
   cd backend
   vercel --prod --yes
   ```

### 2. Alternative : Configuration via fichier

Créez/modifiez `vercel.json` pour chaque projet :

```json
{
  "build": {
    "env": {
      "DEPLOYMENT_PROTECTION": "0"
    }
  }
}
```

**Note** : Cette option peut ne pas fonctionner sur tous les plans Vercel.

---

## 🎯 Actions Immédiates

### Backend
```bash
# 1. Aller sur le dashboard Vercel
open https://vercel.com/kitutupros-projects/backend/settings/deployment-protection

# 2. Désactiver la protection
# 3. Tester
curl https://backend-nbawuzqq9-kitutupros-projects.vercel.app/api/health
```

Réponse attendue :
```json
{
  "status": "OK",
  "message": "API Salon Emploi 2025 - Opérationnelle",
  "database": "disconnected" ou "connected",
  "mongodb": { ... }
}
```

### Dashboard
```bash
# 1. Aller sur le dashboard Vercel
open https://vercel.com/kitutupros-projects/dashboard/settings/deployment-protection

# 2. Désactiver la protection
# 3. Tester en visitant
https://dashboard-7wvqgc1ha-kitutupros-projects.vercel.app
```

### Frontend
```bash
# 1. Aller sur le dashboard Vercel
open https://vercel.com/kitutupros-projects/front/settings/deployment-protection

# 2. Désactiver la protection
# 3. Tester en visitant
https://front-ak5owrg7r-kitutupros-projects.vercel.app
```

---

## 📝 Configuration MongoDB

Une fois la protection désactivée, le backend devrait renvoyer :

```json
{
  "database": "disconnected",
  "mongodb": {
    "status": "disconnected",
    "readyState": 0
  }
}
```

Cela signifie qu'il faut **configurer MongoDB Atlas** :

1. **Créer un cluster sur MongoDB Atlas**
   - https://www.mongodb.com/cloud/atlas

2. **Ajouter la variable d'environnement sur Vercel**
   - Allez sur : https://vercel.com/kitutupros-projects/backend/settings/environment-variables
   - Ajoutez : `MONGODB_URI` = `mongodb+srv://euloge348_db_user:<db_password>@cluster0.vht9dh5.mongodb.net/salon-emploi-2025`
   - Remplacez `<db_password>` par votre vrai mot de passe

3. **Redéployer le backend**
   ```bash
   cd backend
   vercel --prod --yes
   ```

4. **Vérifier à nouveau**
   ```bash
   curl https://backend-nbawuzqq9-kitutupros-projects.vercel.app/api/health
   ```

Réponse attendue :
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

---

## 🔍 Diagnostic

Si vous voyez toujours "Authentication Required" :

1. **Vérifiez les paramètres du projet**
   - Project Settings > Deployment Protection
   - Doit être sur "Disable" ou "Public"

2. **Plan Vercel**
   - Sur le plan gratuit (Hobby), la protection peut être limitée
   - Essayez de passer en plan Pro si nécessaire

3. **Redéploiement**
   - Parfois un redéploiement est nécessaire après changement
   ```bash
   vercel --prod --yes
   ```

---

## ✅ Vérification Finale

Une fois tout configuré :

```bash
# Backend
curl https://backend-nbawuzqq9-kitutupros-projects.vercel.app/api/health

# Doit retourner du JSON, pas du HTML
```

Si vous obtenez du JSON → ✅ Protection désactivée
Si vous obtenez du HTML → ❌ Protection toujours active

---

**Dernière mise à jour** : 13 octobre 2025

