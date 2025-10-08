# 📦 Instructions d'installation

## Problème détecté

Il y a un problème de permissions avec le cache npm sur votre système.

## Solutions

### Option 1 : Corriger les permissions (Recommandé)

Exécutez cette commande dans votre terminal :

```bash
sudo chown -R $(whoami) ~/.npm
```

Ensuite, installez les dépendances :

```bash
cd /Volumes/Smart/work/acpe/enregistrement
npm install
```

### Option 2 : Installation avec force

Si l'option 1 ne fonctionne pas :

```bash
cd /Volumes/Smart/work/acpe/enregistrement
npm install --force
```

### Option 3 : Utiliser yarn (Alternative)

Si vous avez yarn installé :

```bash
cd /Volumes/Smart/work/acpe/enregistrement
yarn install
```

Pour installer yarn si nécessaire :

```bash
npm install -g yarn
```

### Option 4 : Utiliser pnpm (Alternative)

```bash
npm install -g pnpm
cd /Volumes/Smart/work/acpe/enregistrement
pnpm install
```

## Vérification de l'installation

Une fois l'installation réussie, vous devriez voir un dossier `node_modules` créé.

Vérifiez avec :

```bash
ls -la /Volumes/Smart/work/acpe/enregistrement/node_modules
```

## Démarrage du projet

Après l'installation réussie :

```bash
cd /Volumes/Smart/work/acpe/enregistrement
npm run dev
```

Puis ouvrez votre navigateur sur http://localhost:3000

## Dépendances installées

- ✅ React 18.3.1
- ✅ Next.js 14.2.0
- ✅ TypeScript 5.4.0
- ✅ Tailwind CSS 3.4.0
- ✅ Lucide React 0.344.0

## Besoin d'aide ?

Si vous rencontrez toujours des problèmes, essayez de supprimer le cache npm complètement :

```bash
rm -rf ~/.npm
npm install
```

