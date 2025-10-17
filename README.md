# 🇨🇬 Plateforme d'Enregistrement - Salon National de l'Emploi Jeune 2025

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/salon-emploi-acpe-2025)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Plateforme web d'inscription pour le Salon National de l'Emploi Jeune organisé par l'ACPE (Agence Congolaise Pour l'Emploi).

## 🌐 URLs de Production

| Service | URL |
|---------|-----|
| **🎯 Frontend** | [https://front-ak5owrg7r-kitutupros-projects.vercel.app](https://front-ak5owrg7r-kitutupros-projects.vercel.app) |
| **⚙️ Backend** | [https://backend-mauve-phi-53.vercel.app](https://backend-mauve-phi-53.vercel.app) |
| **📊 Dashboard** | [https://dashboard-44fjp7adv-kitutupros-projects.vercel.app](https://dashboard-44fjp7adv-kitutupros-projects.vercel.app) |

**📚 Documentation complète** : Voir `URLS.md`

## 📋 Caractéristiques

- ✅ **Formulaire d'inscription complet** en 4 sections
- ✅ **Vérification inscription ACPE** avec assistance
- ✅ **Génération automatique de badge** avec QR code
- ✅ **Interface responsive** et moderne
- ✅ **Design aux couleurs nationales** du Congo
- ✅ **Validation en temps réel** des formulaires
- ✅ **Confirmation immédiate** avec badge numérique

## 🚀 Démarrage rapide

### ⚡ Guide Rapide (15 min)

**Pour mettre en production** :
1. Consultez **`QUICKSTART.md`** - Guide en 3 étapes
2. Configurez MongoDB Atlas (5 min)
3. Ajoutez les variables Vercel (5 min)
4. Redéployez (5 min)

### 💻 Développement Local

#### Prérequis
- Node.js 18+ 
- npm ou yarn
- MongoDB (local ou Atlas)

#### Installation

```bash
# Cloner le projet
git clone https://github.com/bossygit/salon-emploi-acpe-2025.git
cd salon-emploi-acpe-2025

# Frontend
cd front
npm install
npm run dev
# Ouvre sur http://localhost:3000

# Backend (nouveau terminal)
cd ../backend
npm install
npm run dev
# Écoute sur http://localhost:5000

# Dashboard (nouveau terminal)
cd ../dashboard
npm install
npm run dev
# Ouvre sur http://localhost:3002
```

### 📚 Documentation

| Fichier | Description |
|---------|-------------|
| **QUICKSTART.md** | 🚀 Démarrage rapide (15 min) |
| **STATUS.md** | 📊 État actuel du projet |
| **DEPLOYMENT.md** | 📖 Guide de déploiement détaillé |
| **URLS.md** | 🔗 Toutes les URLs de production |
| **INTEGRATION.md** | 🔌 Connecter Frontend-Backend-Dashboard |
| **MONGODB_SETUP.md** | 🗄️ Configuration MongoDB |
| **VERCEL_PROTECTION.md** | 🔐 Résoudre erreur 401 |

### Structure du projet

```
salon-emploi-acpe-2025/
├── front/                  # Application Next.js
│   ├── pages/             # Pages de l'application
│   ├── styles/            # Styles CSS
│   ├── public/            # Assets statiques
│   └── emploi-plateforme.tsx  # Composant principal
├── README.md              # Documentation principale
├── LICENSE                # Licence MIT
└── [scripts]              # Scripts d'installation et déploiement
```

### Scripts disponibles

```bash
cd front                 # Aller dans le dossier frontend
npm run dev              # Serveur de développement
npm run build            # Build de production
npm run start            # Serveur de production
npm run lint             # Vérification du code
```

## 🛠️ Technologies

- **[Next.js 14](https://nextjs.org/)** - Framework React avec SSR
- **[React 18](https://reactjs.org/)** - Bibliothèque UI
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS
- **[Lucide React](https://lucide.dev/)** - Icônes modernes
- **[Vercel](https://vercel.com/)** - Déploiement et hébergement

## 📝 Structure du formulaire

### Section 1 : Informations personnelles
- Nom, Prénom (obligatoires)
- Date de naissance, Sexe
- Téléphone, Email (obligatoires)
- Ville, Région

### Section 2 : Profil professionnel
- Niveau d'études
- Domaine d'études/formation
- Situation actuelle
- Expérience professionnelle
- Secteurs d'intérêt (choix multiples)

### Section 3 : Inscription ACPE ⭐
- **Question clé** : Êtes-vous inscrit(e) sur l'ACPE ?
  - Oui → Demande du numéro d'inscription
  - Non → Proposition d'inscription avec assistance
  - Je ne sais pas

### Section 4 : Préférences salon
- Jours de participation (28-30 octobre)
- Horaire préféré (Matin/Après-midi/Toute la journée)
- Objectif principal (Emploi/Auto-emploi/Formation/Les trois)
- Ateliers d'intérêt (choix multiples)

## 🎯 Fonctionnalités clés

### Génération de badge
- Numéro d'inscription unique (format: SALON2025-XXXXXXXXX)
- QR Code pour l'entrée au salon
- Badge imprimable
- Informations complètes du participant

### Validation intelligente
- Vérification des champs obligatoires
- Messages d'erreur contextuels
- Validation en temps réel

### Interface utilisateur
- Design responsive (mobile, tablette, desktop)
- Couleurs nationales du Congo (vert, jaune, rouge)
- Animations et transitions fluides
- Accessibilité optimisée

## 📅 Informations sur le salon

| Détail | Information |
|--------|-------------|
| **Dates** | 28, 29 et 30 octobre 2025 |
| **Horaires** | 8h00 - 18h00 chaque jour |
| **Lieu** | Palais des Congrès, Brazzaville |
| **Entrée** | Gratuite avec badge |
| **Organisateur** | ACPE - Agence Congolaise Pour l'Emploi |

## 🚀 Déploiement

### Vercel (Recommandé)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/salon-emploi-acpe-2025)

### Autres plateformes

Le projet peut être déployé sur :
- Netlify
- AWS Amplify
- Railway
- Heroku

## 📊 Statistiques

- **100+ entreprises** participantes
- **1000+ opportunités** d'emploi
- **3 jours** d'événement
- **Inscription gratuite** pour tous

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

- **ACPE** - Agence Congolaise Pour l'Emploi
- **Email** : contact@acpe.cg
- **Site web** : https://acpe.cg

## 🙏 Remerciements

- Équipe ACPE pour l'organisation du salon
- République du Congo pour le soutien
- Communauté des développeurs open source

---

**© 2025 ACPE - Agence Congolaise Pour l'Emploi. Tous droits réservés.**

