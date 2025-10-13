# 📁 Structure du projet - Salon de l'Emploi ACPE

## 🎯 Architecture du projet

```
salon-emploi-acpe-2025/
│
├── front/                          # 🌐 Application Frontend (Next.js)
│   ├── pages/                     # Pages Next.js
│   │   ├── _app.tsx              # Configuration de l'app
│   │   └── index.tsx             # Page d'accueil
│   │
│   ├── styles/                    # Styles
│   │   └── globals.css           # CSS Tailwind global
│   │
│   ├── public/                    # Assets statiques
│   │   ├── logo.png              # Logo ACPE
│   │   └── favicon.ico           # Favicon
│   │
│   ├── emploi-plateforme.tsx     # Composant principal
│   │
│   ├── Configuration
│   │   ├── package.json          # Dépendances npm
│   │   ├── next.config.js        # Config Next.js
│   │   ├── tsconfig.json         # Config TypeScript
│   │   ├── tailwind.config.js    # Config Tailwind
│   │   ├── postcss.config.js     # Config PostCSS
│   │   ├── vercel.json           # Config Vercel
│   │   ├── .eslintrc.json        # Config ESLint
│   │   ├── .gitignore            # Fichiers ignorés par Git
│   │   └── .vercelignore         # Fichiers ignorés par Vercel
│   │
│   ├── node_modules/             # Dépendances installées
│   └── README.md                 # Documentation frontend
│
├── Documentation
│   ├── README.md                 # Documentation principale
│   ├── STRUCTURE.md              # Ce fichier
│   ├── DEPLOIEMENT_VERCEL.md     # Guide Vercel
│   ├── INSTALLATION.md           # Guide d'installation
│   └── LICENSE                   # Licence MIT
│
└── Scripts
    ├── install.sh                # Installation automatique
    ├── deploy.sh                 # Déploiement Vercel
    └── publish-github.sh         # Publication GitHub
```

## 🚀 Commandes principales

### Installation
```bash
# Depuis la racine du projet
./install.sh

# Ou manuellement
cd front
npm install
```

### Développement
```bash
cd front
npm run dev
# Ouvrir http://localhost:3000
```

### Build
```bash
cd front
npm run build
npm start
```

### Déploiement
```bash
# Depuis la racine
./deploy.sh

# Ou manuellement depuis front/
cd front
vercel --prod
```

## 📦 Technologies utilisées

### Frontend
- **Next.js 14** - Framework React
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Lucide React** - Bibliothèque d'icônes

### Outils
- **ESLint** - Linter JavaScript/TypeScript
- **PostCSS** - Traitement CSS
- **Vercel** - Hébergement et déploiement

## 🎨 Couleurs du projet

```css
/* Palette principale ACPE */
--primary: #1B80BF;      /* Bleu principal */
--secondary: #F2133C;    /* Rouge */
--success: #238C33;      /* Vert */
--danger: #A60303;       /* Rouge foncé */
--dark: #0D0D0D;        /* Noir */
```

## 📝 Workflow de développement

1. **Développer** dans le dossier `front/`
2. **Tester** avec `npm run dev`
3. **Commiter** depuis la racine
4. **Déployer** avec `./deploy.sh` ou via Vercel CLI

## 🔄 Git Workflow

```bash
# Depuis la racine du projet
git add .
git commit -m "Description des changements"
git push origin main
# Vercel redéploie automatiquement !
```

## 🌐 URLs

- **Production** : https://emploi-7dujxqx7e-kitutupros-projects.vercel.app
- **Dashboard Vercel** : https://vercel.com/dashboard
- **GitHub** : À configurer

## 📞 Support

Pour toute question concernant la structure du projet :
- Consultez la documentation dans `/front/README.md`
- Voir les guides dans `DEPLOIEMENT_VERCEL.md` et `INSTALLATION.md`

---

**© 2025 ACPE - Agence Congolaise Pour l'Emploi**

