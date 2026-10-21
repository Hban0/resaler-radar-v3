# Resaler Radar V3

Tableau de bord pour suivre des opportunités de revente, comparer les prix d'achat/revente et estimer le bénéfice net.

## Fonctionnalités actuelles

- Ajout manuel d'opportunités avec source, destination, prix d'achat, prix de revente, frais et livraison.
- Calcul du bénéfice net estimé et du ROI.
- Mise en évidence des opportunités qui atteignent le seuil cible de 3 € net.
- Filtres de recherche et de statut.
- Suivi de statut et suppression d'opportunités.
- Sauvegarde locale dans le navigateur.

## Lancer en local

Prérequis : Node.js installé.

```bash
npm install
npm run dev
```

## Important

Les lignes de démonstration sont fictives et servent uniquement à illustrer l'interface. Le scanner automatique n'est pas encore connecté : aucune annonce ni aucun prix n'est récupéré automatiquement depuis G2G, Eldorado.gg, Z2U ou d'autres plateformes. Vérifier les conditions d'utilisation, les autorisations d'API et les frais réels avant tout achat.

## Prochaines étapes

1. Définir les sources de données autorisées.
2. Connecter les API disponibles ou des flux de données permis.
3. Normaliser les prix, frais, devises et coûts de livraison.
4. Filtrer les opportunités avec bénéfice net estimé d'au moins 3 €.
5. Tester la précision sur des annonces réelles avant d'utiliser les résultats pour acheter.
