# 🚨 Guide de Dépannage Rapide

## ❌ Erreur: "NetworkError when attempting to fetch resource"

### 📋 Checklist Rapide (5 minutes)

Suivez ces étapes **dans l'ordre** :

---

### ✅ **Étape 1: Le backend est-il démarré ?**

Ouvrez un terminal et exécutez :
```bash
lsof -i :5000
```

**Résultat attendu :**
```
COMMAND   PID   USER   FD   TYPE     DEVICE SIZE/OFF NODE NAME
node      12345 user   23u  IPv4    0x...      0t0  TCP *:5000 (LISTEN)
```

- ✅ **Si vous voyez une ligne** → Le backend écoute sur le port 5000 → Passez à l'Étape 2
- ❌ **Si vous ne voyez RIEN** → Le backend n'est pas démarré → **ACTION :**

```bash
cd /Volumes/Smart/work/acpe/enregistrement/backend
npm run dev
```

Attendez de voir :
```
🚀 Serveur démarré sur le port 5000
📱 API disponible sur: http://localhost:5000
```

Puis **retestez votre inscription**.

---

### ✅ **Étape 2: Le backend répond-il ?**

Exécutez dans le terminal :
```bash
curl http://localhost:5000/api/health
```

**Résultat attendu :**
```json
{"status":"OK","database":"connected","mongodb":{"status":"connected","name":"salon-emploi-2025"}}
```

- ✅ **Si vous voyez ce JSON** → Le backend fonctionne ! → Passez à l'Étape 3
- ❌ **Si erreur "Connection refused"** → Le backend a planté → **ACTION :**

```bash
# Tuer le processus qui bloque
lsof -i :5000  # Noter le PID
kill -9 PID    # Remplacer PID

# Redémarrer
cd /Volumes/Smart/work/acpe/enregistrement/backend
npm run dev
```

- ⚠️ **Si "database":"disconnected"** → MongoDB n'est pas démarré → **ACTION :**

```bash
# Démarrer MongoDB
brew services start mongodb-community

# Attendre 5 secondes, puis redémarrer le backend
cd /Volumes/Smart/work/acpe/enregistrement/backend
npm run dev
```

---

### ✅ **Étape 3: Le frontend est-il sur le bon port ?**

Vérifiez l'URL dans votre navigateur :

- ✅ **Si vous êtes sur `http://localhost:3000`** → Correct !
- ❌ **Si vous êtes sur un autre port** → **ACTION :**

```bash
cd /Volumes/Smart/work/acpe/enregistrement/front
npm run dev
```

Puis allez sur `http://localhost:3000`

---

### ✅ **Étape 4: Test de diagnostic automatique**

Exécutez le script de diagnostic :
```bash
cd /Volumes/Smart/work/acpe/enregistrement/backend
node test-connection.js
```

Ce script testera automatiquement :
- ✅ Connectivité sur localhost:5000
- ✅ Connectivité sur 127.0.0.1:5000
- ✅ Réponse de l'API de santé

**Lisez attentivement le rapport** et suivez les recommandations.

---

## 🔧 Commandes Utiles

### Vérifier les ports utilisés
```bash
# Port 5000 (backend)
lsof -i :5000

# Port 3000 (frontend)
lsof -i :3000

# Port 3002 (dashboard)
lsof -i :3002
```

### Tuer un processus bloqué
```bash
# Trouver le PID
lsof -i :5000

# Tuer le processus
kill -9 PID  # Remplacer PID par le numéro
```

### Vérifier MongoDB
```bash
# Statut de MongoDB
brew services list | grep mongodb

# Démarrer MongoDB
brew services start mongodb-community

# Arrêter MongoDB
brew services stop mongodb-community

# Redémarrer MongoDB
brew services restart mongodb-community
```

### Redémarrer tout proprement
```bash
# Terminal 1: Backend
cd /Volumes/Smart/work/acpe/enregistrement/backend
npm run dev

# Terminal 2: Frontend (dans un nouveau terminal)
cd /Volumes/Smart/work/acpe/enregistrement/front
npm run dev

# Terminal 3: Dashboard (optionnel, dans un nouveau terminal)
cd /Volumes/Smart/work/acpe/enregistrement/dashboard
npm run dev
```

---

## 📊 Matrice de Dépannage

| Symptôme | Cause Probable | Solution |
|----------|----------------|----------|
| "NetworkError when attempting to fetch" | Backend non démarré | `cd backend && npm run dev` |
| "Connection refused" | Port 5000 non ouvert | Vérifier avec `lsof -i :5000` |
| "database: disconnected" | MongoDB arrêté | `brew services start mongodb-community` |
| Panneau rouge avec erreurs de validation | Champs obligatoires manquants | Remplir tous les champs marqués * |
| Page remonte sans message | (Corrigé) Voir panneau rouge | Déjà résolu dans cette version |
| "CORS error" | Origine non autorisée | Vérifier que frontend est sur :3000 |
| Timeout | Backend bloqué | Redémarrer le backend |

---

## 🎯 Scénario Typique: "Ça ne marche pas !"

Suivez **EXACTEMENT** ces commandes :

```bash
# 1. ARRÊTER TOUT
# Ctrl+C dans tous les terminaux ouverts

# 2. VÉRIFIER MongoDB
brew services start mongodb-community

# 3. ATTENDRE 5 secondes
sleep 5

# 4. OUVRIR Terminal 1 - BACKEND
cd /Volumes/Smart/work/acpe/enregistrement/backend
npm run dev
# Attendre de voir: "🚀 Serveur démarré sur le port 5000"

# 5. OUVRIR Terminal 2 - FRONTEND
cd /Volumes/Smart/work/acpe/enregistrement/front
npm run dev
# Attendre de voir: "ready - started server on 0.0.0.0:3000"

# 6. OUVRIR LE NAVIGATEUR
# Aller sur: http://localhost:3000

# 7. TESTER
# - Cliquer sur "Commencer mon inscription"
# - Remplir le formulaire
# - Cliquer sur "Valider mon inscription"
```

**Si vous suivez ces étapes et que ça ne marche toujours pas**, alors :

```bash
# Test ultime de diagnostic
cd /Volumes/Smart/work/acpe/enregistrement/backend
node test-connection.js
```

Envoyez-moi la sortie complète de ce script.

---

## 📞 Besoin d'Aide Supplémentaire ?

Si après avoir suivi TOUTES ces étapes le problème persiste, collectez ces informations :

```bash
# 1. Version de Node
node --version

# 2. Processus sur les ports
lsof -i :5000
lsof -i :3000

# 3. Statut MongoDB
brew services list | grep mongodb

# 4. Test backend
curl http://localhost:5000/api/health

# 5. Logs du backend
# Copiez les 20 dernières lignes affichées dans le terminal du backend

# 6. Console du navigateur
# Ouvrir F12, onglet Console, copier tous les messages en rouge
```

Avec ces informations, je pourrai vous aider plus précisément !

---

**💡 Astuce :** Gardez ce fichier ouvert dans un onglet pendant que vous développez, c'est un guide de survie ! 🚀

