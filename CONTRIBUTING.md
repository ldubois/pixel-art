# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à ce projet ! Ce document fournit des directives pour contribuer efficacement.

## 📋 Comment Contribuer

### Signaler un Bug

Si vous trouvez un bug, veuillez :

1. Vérifier que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/votre-repo/issues)
2. Créer une nouvelle issue avec :
   - Un titre clair et descriptif
   - Une description détaillée du problème
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs le comportement actuel
   - Votre environnement (OS, navigateur, version PHP, etc.)

### Proposer une Nouvelle Fonctionnalité

Pour proposer une nouvelle fonctionnalité :

1. Vérifier qu'elle n'a pas déjà été proposée
2. Créer une issue avec le label "enhancement"
3. Décrire clairement :
   - Le problème que cette fonctionnalité résout
   - Comment elle devrait fonctionner
   - Les avantages qu'elle apporte

### Soumettre une Pull Request

1. **Fork** le projet
2. **Créer une branche** pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. **Suivre les conventions de code** :
   - Respecter les standards PSR-12 pour PHP
   - Utiliser ESLint/Prettier pour JavaScript
   - Ajouter des commentaires pour le code complexe
   - Écrire des tests si applicable
4. **Commit** vos changements avec des messages clairs (`git commit -m 'Ajout: description de la fonctionnalité'`)
5. **Push** vers votre branche (`git push origin feature/ma-fonctionnalite`)
6. **Ouvrir une Pull Request** avec :
   - Une description claire de ce qui a été modifié
   - Les raisons de ces modifications
   - Les tests effectués
   - Les captures d'écran si applicable

## 📝 Standards de Code

### PHP

- Respecter PSR-12
- Utiliser des noms de variables et fonctions descriptifs
- Ajouter des PHPDoc pour les méthodes publiques
- Gérer les erreurs de manière appropriée

### JavaScript

- Utiliser des noms de variables clairs
- Commenter le code complexe
- Éviter les `console.log` en production
- Suivre les conventions ES6+

### CSS

- Utiliser Tailwind CSS pour le styling
- Respecter la structure existante
- Maintenir la cohérence visuelle

## 🧪 Tests

- Ajouter des tests pour les nouvelles fonctionnalités
- S'assurer que tous les tests passent avant de soumettre une PR
- Maintenir ou améliorer la couverture de tests

## 📚 Documentation

- Mettre à jour la documentation si nécessaire
- Ajouter des commentaires pour le code complexe
- Mettre à jour le README si vous ajoutez une fonctionnalité majeure

## ✅ Checklist avant de soumettre une PR

- [ ] Le code suit les standards du projet
- [ ] Les tests passent tous
- [ ] La documentation a été mise à jour
- [ ] Les commits sont clairs et descriptifs
- [ ] La PR a une description détaillée
- [ ] Aucun conflit avec la branche principale

## 🙏 Remerciements

Merci de prendre le temps de contribuer à ce projet ! Votre aide est grandement appréciée.

