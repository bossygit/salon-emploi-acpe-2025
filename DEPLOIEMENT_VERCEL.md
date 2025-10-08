# 🚀 Guide de déploiement sur Vercel

## Méthode 1 : Déploiement via GitHub (Recommandé)

### Étape 1 : Créer un dépôt GitHub

```bash
# Initialiser Git dans votre projet
cd /Volumes/Smart/work/acpe/enregistrement
git init

# Ajouter tous les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit - Plateforme d'enregistrement Salon de l'Emploi 2025"

# Créer un dépôt sur GitHub (via l'interface web)
# Puis lier votre projet au dépôt
git remote add origin https://github.com/votre-username/salon-emploi-acpe.git

# Pousser le code
git branch -M main
git push -u origin main
```

### Étape 2 : Déployer sur Vercel

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Se connecter avec GitHub**
3. **Cliquer sur "Add New Project"**
4. **Importer votre dépôt GitHub**
5. **Configurer le projet :**
   - Framework Preset: **Next.js** (détecté automatiquement)
   - Build Command: `npm run build` (par défaut)
   - Output Directory: `.next` (par défaut)
   - Install Command: `npm install` (par défaut)

6. **Cliquer sur "Deploy"**

🎉 Votre site sera en ligne en quelques minutes !

---

## Méthode 2 : Déploiement via Vercel CLI

### Étape 1 : Installer Vercel CLI

```bash
npm install -g vercel
```

### Étape 2 : Se connecter à Vercel

```bash
vercel login
```

### Étape 3 : Déployer

```bash
cd /Volumes/Smart/work/acpe/enregistrement

# Premier déploiement (mode test)
vercel

# Déploiement en production
vercel --prod
```

---

## Méthode 3 : Import direct (Sans Git)

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Cliquer sur "Add New Project"**
3. **Sélectionner "Import Third-Party Git Repository"** ou **"Deploy from a template"**
4. **Glisser-déposer le dossier du projet** (ou utiliser le CLI)

---

## 📋 Checklist avant déploiement

- ✅ Tous les fichiers de configuration sont créés :
  - `package.json`
  - `next.config.js`
  - `tsconfig.json`
  - `tailwind.config.js`
  - `postcss.config.js`
  - `vercel.json`

- ✅ Les dépendances sont listées dans `package.json`

- ✅ Le fichier `.gitignore` est configuré

- ✅ Le fichier `.vercelignore` est créé

---

## 🔧 Configuration de l'environnement

Si vous avez besoin de variables d'environnement :

1. Dans le dashboard Vercel, aller dans **Settings → Environment Variables**
2. Ajouter vos variables (ex: API keys, URLs, etc.)

Exemple de fichier `.env.local` (ne sera pas déployé) :

```env
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
NEXT_PUBLIC_SITE_NAME=Salon de l'Emploi ACPE 2025
```

---

## 🌐 Domaine personnalisé

### Après le déploiement :

1. **Aller dans Settings → Domains**
2. **Ajouter votre domaine personnalisé**
3. **Configurer les DNS selon les instructions de Vercel**

Exemples de domaines possibles :
- `inscription-salon-emploi.cg`
- `salon.acpe.cg`
- `emploi-acpe.vercel.app` (sous-domaine Vercel gratuit)

---

## 📊 Performance et Analytics

Vercel propose automatiquement :
- ✅ HTTPS/SSL gratuit
- ✅ CDN global
- ✅ Analytics (optionnel)
- ✅ Redéploiement automatique à chaque push Git

---

## 🔄 Mises à jour futures

Avec GitHub connecté :

```bash
# Faire vos modifications
git add .
git commit -m "Description des modifications"
git push

# Vercel redéploie automatiquement ! 🎉
```

---

## 🆘 Dépannage

### Erreur de build ?

1. **Vérifier les logs dans le dashboard Vercel**
2. **Tester le build localement :**
   ```bash
   npm run build
   ```

### Problème d'installation des dépendances ?

Dans le dashboard Vercel, Settings → General :
- Changer "Node.js Version" vers la version 18.x ou 20.x

---

## 📱 URL de votre site

Après déploiement, vous recevrez une URL :

**Production :** `https://votre-projet.vercel.app`

Vous pouvez la partager immédiatement ! 🎊

---

## 💡 Conseils

1. **Utilisez des branches Git** pour tester avant de déployer en production
2. **Activez les Preview Deployments** pour voir les changements avant la production
3. **Configurez les notifications** pour être alerté des déploiements
4. **Utilisez Vercel Analytics** pour suivre le trafic

---

## 🇨🇬 Pour l'ACPE

**URL recommandée :** `inscription.salon-emploi-acpe.cg`

**Capacité :** Le plan gratuit Vercel supporte :
- Trafic illimité
- 100 GB de bande passante/mois
- Parfait pour un événement de 3 jours

Pour un événement majeur, considérez le plan Pro pour :
- Analytics avancés
- Support prioritaire
- Meilleure performance

