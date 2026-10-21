# Plan d'intégration des sources

## Objectif
Comparer des offres achetables et des prix de revente réellement disponibles, puis retenir les opportunités dont le bénéfice net estimé est d'au moins 3 €.

## Sources envisagées
- G2G
- Eldorado.gg
- Z2U

## Avant d'activer une source
1. Vérifier la documentation officielle de l'API, les permissions et les conditions d'utilisation.
2. Confirmer qu'une API permet bien de lire les prix et la disponibilité nécessaires.
3. Ne jamais contourner une connexion, un CAPTCHA, une limite de débit ou une mesure anti-bot.
4. Stocker les secrets côté serveur dans des variables d'environnement; ne jamais les placer dans le code du navigateur ou dans Git.
5. Normaliser la devise, les commissions d'achat/vente, les coûts de livraison et les éventuels coûts de paiement.
6. Enregistrer l'heure d'observation et refuser les alertes fondées sur des prix périmés.
7. Tester sur des données connues avant d'utiliser le résultat pour prendre une décision d'achat.

## Règle de rentabilité
Bénéfice net estimé = prix de revente − frais de vente − livraison sortante − prix d'achat − frais d'achat − livraison entrante − autres coûts.

Une alerte ne peut être éligible que si les prix sont vérifiés, horodatés, exprimés en EUR et si le bénéfice net estimé atteint au moins 3 €. Le calcul n'est pas une garantie de vente ni de profit.

## État actuel
Le moteur de calcul est local et ne collecte pas lui-même d'annonces. Les intégrations API restent à développer après validation des sources et de leurs conditions d'accès.
