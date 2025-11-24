# 🎨 Stack Technique

Ce document détaille toutes les technologies, frameworks et outils utilisés dans le projet Pixel Art Editor.

## Backend

### Framework PHP

- **Symfony 7.3** : Framework PHP moderne et performant
  - Routing avec attributs PHP 8
  - Dependency Injection
  - Event Dispatcher
  - Service Container

### Moteur de template

- **Twig 3.x** : Moteur de template puissant et sécurisé
  - Héritage de templates
  - Filtres et fonctions personnalisées
  - Internationalisation intégrée

### ORM (prêt pour futures fonctionnalités)

- **Doctrine ORM 3.5** : ORM pour la gestion de base de données
  - Actuellement non utilisé (pas de BDD)
  - Prêt pour ajout de fonctionnalités nécessitant une persistance

### Autres composants Symfony

- **Symfony Asset Mapper** : Gestion moderne des assets
- **Symfony Translation** : Système d'internationalisation
- **Symfony UX Turbo** : Amélioration de la navigation
- **Symfony Stimulus Bundle** : Intégration Stimulus

## Frontend

### CSS Framework

- **Tailwind CSS 3.4** : Framework CSS utilitaire
  - Configuration personnalisée avec couleurs de marque
  - Compilation via PostCSS
  - Mode watch pour le développement

**Couleurs de marque définies :**
- `brand-purple`: #7C3AED
- `brand-pink`: #EC4899
- `brand-surface`: #1E1C2E
- `brand-dark`: #0B0A16

### JavaScript

- **JavaScript Vanilla (ES6+)** : Pas de framework lourd
  - Code moderne et performant
  - Compatibilité navigateurs modernes
  - Gestion des événements native

- **Stimulus 3.2** : Contrôleurs JavaScript légers
  - Architecture déclarative
  - Intégration avec Symfony

- **Turbo Drive** : Navigation rapide sans rechargement complet
  - Intégration transparente
  - Gestion des événements de cycle de vie

### Icônes

- **Font Awesome 6.4** : Bibliothèque d'icônes
  - CDN pour chargement rapide
  - Icônes solides utilisées

## Outils de développement

### Tests

- **PHPUnit 12.4** : Framework de tests PHP
  - Tests unitaires
  - Tests fonctionnels (WebTestCase)
  - Configuration dans `phpunit.dist.xml`

### Build Tools

- **PostCSS** : Traitement CSS
  - Compilation Tailwind
  - Minification en production

- **npm scripts** : Automatisation des tâches
  - `npm run build:css` : Compilation unique
  - `npm run watch:css` : Mode watch (développement)

### Debugging

- **Symfony Web Profiler** : Outils de débogage
  - Profiler de requêtes
  - Analyseur de performances
  - Inspecteur de templates

- **Symfony Debug Bundle** : Outils de débogage avancés
  - Stack traces détaillées
  - Variables d'environnement

## Gestion des dépendances

### PHP

- **Composer 2.x** : Gestionnaire de dépendances PHP
  - Installation : `composer install`
  - Mise à jour : `composer update`
  - Autoloading PSR-4

### Node.js

- **npm** : Gestionnaire de paquets Node.js
  - Installation : `npm install`
  - Scripts définis dans `package.json`

## Configuration et environnement

### Configuration Symfony

- **YAML** : Format de configuration principal
  - Fichiers dans `config/packages/`
  - Configuration par environnement (dev, prod, test)

### Variables d'environnement

- **`.env`** : Variables d'environnement (non versionné)
- **`.env.local`** : Variables locales (non versionné)
- **`APP_ENV`** : Environnement (dev, prod, test)
- **`APP_SECRET`** : Clé secrète Symfony

## Sécurité

- **CSRF Protection** : Protection contre les attaques CSRF
- **Security Bundle** : Configuration de sécurité Symfony
- **Validation** : Validation des entrées utilisateur

## Internationalisation

- **Symfony Translation** : Système de traduction
- **Format XLF** : Fichiers de traduction
- **3 langues supportées** : Français, Anglais, Espagnol

## Performance

- **Asset Mapper** : Chargement optimisé des assets
- **Turbo Drive** : Navigation rapide
- **Cache Symfony** : Mise en cache des configurations

## Versions minimales requises

- **PHP** : 8.2 ou supérieur
- **Composer** : 2.x
- **Node.js** : 18+ 
- **npm** : Version incluse avec Node.js

## Compatibilité navigateurs

Le projet cible les navigateurs modernes :
- Chrome/Edge (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)

Les fonctionnalités utilisent des APIs modernes (ES6+, Fetch API, localStorage).

## Outils recommandés

Pour le développement, il est recommandé d'utiliser :
- **Symfony CLI** : Pour le serveur de développement
- **VS Code** ou **PhpStorm** : IDE avec support Symfony
- **Git** : Contrôle de version

