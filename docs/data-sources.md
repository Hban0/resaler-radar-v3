# Plan d'intégration des sources

## Objectif
Comparer des offres réellement accessibles et retenir les opportunités dont le bénéfice net estimé atteint au moins 3 €.

## État des sources (à confirmer avant développement)

### G2G
- Documentation officielle : https://docs.g2g.com/
- L'OpenAPI documentée concerne notamment la gestion des offres et de l'inventaire.
- L'accès exige une approbation. La page d'aide officielle indique des restrictions d'éligibilité pour les vendeurs professionnels situés en Malaisie et en Indonésie.
- Conclusion : ne pas supposer que cette API est accessible à un utilisateur en Belgique ni qu'elle expose toutes les offres publiques.

### Eldorado.gg
- Centre d'aide officiel : https://support.eldorado.gg/
- L'API Seller est destinée aux vendeurs vérifiés et sert à gérer leurs propres offres et commandes.
- Conclusion : elle ne doit pas être considérée comme une API publique de comparaison de toutes les annonces.

### Z2U
- L'accès à une API permettant de lire les offres publiques et les prix de façon autorisée n'est pas encore confirmé.
- Prochaine étape : vérifier auprès de la documentation ou du support officiel avant d'implémenter un connecteur.

## Conditions d'activation d'une source
1. Vérifier la documentation officielle, les autorisations et les conditions d'utilisation.
2. Confirmer que les données nécessaires (prix, devise, disponibilité, frais) sont légalement et techniquement accessibles.
3. Ne pas contourner les connexions, CAPTCHA, limites de débit ou protections anti-bot.
4. Stocker les secrets uniquement côté serveur dans des variables d'environnement; jamais dans le code navigateur ou dans Git.
5. Normaliser la devise, les commissions, les coûts de paiement et les frais de livraison.
6. Enregistrer l'heure d'observation et refuser les alertes basées sur des prix périmés.
7. Tester les résultats avec des données connues avant de déclencher des alertes.

## Formule
Bénéfice net estimé = prix de revente − frais de vente − livraison sortante − prix d'achat − frais d'achat − livraison entrante − autres coûts.

Une alerte n'est éligible que si les prix sont vérifiés, horodatés, exprimés en EUR et si le bénéfice net estimé atteint au moins 3 €. Le calcul ne garantit ni une vente ni un profit.

## État du projet
Le moteur de calcul est local et ne collecte pas lui-même d'annonces. Les intégrations API restent à développer après validation des accès et des conditions d'utilisation.
