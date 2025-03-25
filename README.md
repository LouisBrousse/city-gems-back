# city-gems-back

# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

#### Start with docker(recommnended)

- Make sure docker desktop is started
- run docker compose up -d
--> this will start both the api and the database

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

___________________________________________________________________

## Problème de déploiement avec Docker :

la commande dans le dockerfile "RUN yarn prisma generate --schema=src/models" ne fonctionne pas.
-> il faut forcer le déploiement du schema (#créer les tables) une fois les containers lancé.

1. On fait un git clone du projet
2. On lance docker desktop
3. dans un terminal depuis la racine du projet :
```
docker compose up -d
```
Les 2 container apparaissent dans Docker Desktop

4. Dans DockerDesktop il faut accéder au terminal du docker de l'API. click sur "node_api_secu_design" puis aller sur l'onglet Exec.

5. Un terminal devrait apparaitre et de là faire la commande :
```
yarn prisma db push --schema=src/models/ 
```
## Vérification de la DB
On peut vérifier ce qu'il a dans la DB depuis un terminal VSCode :
1. Ouvrir un terminal se mettre la racine du projet
2. Accéder au terminal du container de la DB :
```
docker exec -it mysqldb_secu_design mysql -u root -p
```
ID: root
MDP : root

3. Entrer dans la DB city_gems_db:
```
mysql> USE city_gems_db;
```
4. Voir les tables : 
```
mysql> SHOW TABLES;
```

Résultat attendu :
```
+------------------------+
| Tables_in_city_gems_db |
+------------------------+
| attraction_categories  |
| attractions            |
| favourites             |
| images                 |
| revoked_tokens         |
| users                  |
+------------------------+
6 rows in set (0.00 sec)

```