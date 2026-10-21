# Resaler Radar V3

Assistant de recherche de bonnes affaires : cherche le même produit sur plusieurs marketplaces, compare les offres disponibles, puis calcule la marge nette potentielle. Le seuil cible est de 3 € nets minimum.

## État actuel — à lire

- La recherche multi-sites ouvre des résultats de recherche pour le produit saisi.
- Les prix et annonces ne sont **pas encore collectés automatiquement** depuis les marketplaces.
- Le tableau de bord conserve les entrées manuelles dans le stockage local du navigateur.
- Le moteur de calcul net et ses tests sont présents.
- Les endpoints de notification Telegram sont prêts, mais **Telegram n'est pas connecté tant que les variables serveur ne sont pas configurées et qu'un test n'a pas été envoyé avec succès**.

Ne prends pas les lignes d'exemple fictives pour des offres réelles.

## Lancer localement

Prérequis : Node.js 20 ou supérieur.

Terminal 1 — serveur API et fichiers de production :
```bash
npm install
npm run build
npm start
``

Ouvre ensuite http://localhost:3001.

Pour développer l'interface avec Vite, lance `npm run dev` dans un autre terminal et `npm run api` dans le premier. Vite utilise le proxy API vers le port 3001.

## Configurer Telegram

1. Dans Telegram, ouvre **@BotFather**, crée un bot avec `/newbot` et copie son token.
2. Ouvre la conversation avec ton nouveau bot et appuie sur **Démarrer**.
3. Récupère le chat ID auprès d'un outil fiable ou de l'API Telegram `getUpdates` après avoir envoyé un message au bot. Ne partage pas ton token.
4. Sur l'hébergeur du serveur, configure ces variables d'environnement :
   - `TELEGRAM_BOT_TOKEN` : token du bot
   - `TELEGRAM_CHAT_ID` : ton chat ID
5. Redémarre le serveur, ouvre le tableau de bord et clique sur **Tester Telegram**. Considère Telegram connecté uniquement si le message de test arrive bien dans Telegram.

Ne place jamais le token dans React, dans `.env.example`, dans GitHub ou dans un message public. En local, crée un fichier `.env` ignoré par Git et charge les variables dans ton environnement avant de lancer Node. Le serveur ne charge pas automatiquement les fichiers `.env`.

## Déploiement Render

Le dépôt comprend un `render.yaml` avec la commande de build et de démarrage. Crée un Web Service Render depuis ce dépôt, puis ajoute `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID) dans Environment. Après le déploiement, teste le message Telegram depuis le tableau de bord.

## API disponibles

- `GET /api/status` — indique si les variables Telegram sont configurées et rappelle l'état du scanner.
- `POST /api/telegram/test` — envoie un message de test.
- `POST /api/telegram/notify` — envoie une opportunité fournie au serveur uniquement si le bénéfice net transmis atteint au moins 3 €.

Ces endpoints n'inventent pas de prix. L'endpoint de notification ne doit être appelé qu'avec des prix réellement vérifiés et un lien d'annonce valable.

## Sources de prix : prochaine étape technique

Avant d'activer le scan automatique, il faut obtenir un accès autorisé aux données de chaque marketplace. Les API disponibles peuvent être limitées aux vendeurs et à leurs propres offres. Le projet ne contourne pas les connexions, CAPTCHA, limites de débit ou protections anti-bot.

Le moteur devra ensuite normaliser le produit (édition/version, région, quantité, durée, état), vérifier que les annonces sont comparables, convertir les devises, déduire frais et livraison, dater chaque observation et rejeter les prix périmés.

**Formule** : bénéfice net estimé = prix de revente − frais de vente − frais de paiement − expédition sortante − prix d'achat − frais d'achat − livraison entrante − autres coûts.

Une marge estimée n'est ni une garantie de vente ni une garantie de profit.
