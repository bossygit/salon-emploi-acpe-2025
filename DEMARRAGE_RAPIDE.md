# 🚀 Guide de Démarrage Rapide - RÉSOLU !

## ✅ Problème Identifié et Résolu

**Problème :** Le port 5000 était occupé par un processus macOS système (ControlCenter)

**Solution :** Le backend utilise maintenant le port **3001**

---

## 📋 Instructions de Démarrage

### **Étape 1 : Démarrer MongoDB**
```bash
brew services start mongodb-community
```

### **Étape 2 : Démarrer le Backend** (Terminal 1)
```bash
cd /Volumes/Smart/work/acpe/enregistrement/backend
npm run dev
```

**✅ Vous devriez voir :**
```
🚀 Serveur démarré sur le port 3001
📱 API disponible sur: http://127.0.0.1:3001/api
📱 API disponible sur: http://localhost:3001/api
🌍 Environnement: development
🔒 CORS activé pour: http://localhost:3000, http://localhost:3002
📊 Test API: http://localhost:3001/api/health
```

### **Étape 3 : Vérifier que le Backend Fonctionne**

Ouvrez dans votre navigateur :
```
http://localhost:3001/api/health
```

**✅ Vous devriez voir :**
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

### **Étape 4 : Démarrer le Frontend** (Terminal 2)
```bash
cd /Volumes/Smart/work/acpe/enregistrement/front
npm run dev
```

**✅ Vous devriez voir :**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### **Étape 5 : Tester l'Application**

1. Ouvrez votre navigateur sur : **http://localhost:3000**
2. Cliquez sur "Commencer mon inscription"
3. Remplissez le formulaire
4. Cliquez sur "Valider mon inscription"

**Maintenant ça devrait fonctionner ! 🎉**

---

## 🎯 Ports Utilisés

| Service | Port | URL |
|---------|------|-----|
| **Backend API** | **3001** | http://localhost:3001/api |
| Frontend | 3000 | http://localhost:3000 |
| Dashboard | 3002 | http://localhost:3002 |

---

## 🔍 Test de Diagnostic

Si vous avez encore des problèmes, lancez le script de diagnostic :

```bash
cd /Volumes/Smart/work/acpe/enregistrement/backend
node test-connection.js
```

---

## ✅ Checklist Avant de Démarrer

- [ ] MongoDB est démarré (`brew services start mongodb-community`)
- [ ] Le port 3001 est libre (`lsof -i :3001` ne retourne rien)
- [ ] Le port 3000 est libre (`lsof -i :3000` ne retourne rien)
- [ ] Les dépendances sont installées (`npm install` dans backend/ et front/)

---

## 🐛 Dépannage

### Port 3001 déjà occupé ?
```bash
# Vérifier ce qui utilise le port
lsof -i :3001

# Si un processus bloque, le tuer
kill -9 PID  # Remplacer PID par le numéro affiché
```

### MongoDB ne se connecte pas ?
```bash
# Vérifier le statut
brew services list | grep mongodb

# Si "stopped", le démarrer
brew services start mongodb-community

# Attendre 5 secondes puis redémarrer le backend
```

### Le frontend ne se connecte toujours pas ?
```bash
# Vérifier que l'API répond
curl http://localhost:3001/api/health

# Si erreur "Connection refused"
# → Le backend n'est pas démarré ou a planté
# → Redémarrez-le avec: npm run dev
```

---

## 📁 Fichiers Modifiés

| Fichier | Changement |
|---------|------------|
| `backend/config.env` | PORT: 5000 → 3001 |
| `front/utils/api.ts` | API URL: :5000 → :3001 |
| `backend/server.js` | Logs améliorés |
| `backend/test-connection.js` | Tests sur port 3001 |

---

## 🎉 Tout Devrait Fonctionner Maintenant !

Si vous avez suivi toutes les étapes et que vous voyez :
- ✅ Backend démarré sur le port 3001
- ✅ Frontend démarré sur le port 3000
- ✅ `http://localhost:3001/api/health` retourne `{"status":"OK"}`

**Alors tout est prêt ! Testez votre formulaire d'inscription !** 🚀

---

**Besoin d'aide ?** Relancez le script de diagnostic :
```bash
cd backend && node test-connection.js
```

