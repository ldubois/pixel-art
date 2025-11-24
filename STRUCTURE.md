# 📁 Structure du Projet

Ce document décrit l'organisation des fichiers et dossiers du projet Pixel Art Editor.

## Vue d'ensemble

```
pixel-art/
├── assets/                    # Assets frontend
├── config/                    # Configuration Symfony et modèles
├── public/                    # Point d'entrée public
├── src/                       # Code source PHP
├── templates/                 # Templates Twig
├── tests/                     # Tests PHPUnit
├── translations/              # Fichiers de traduction
└── vendor/                    # Dépendances Composer (généré)
```

## Détails des dossiers

### `/assets`

Contient tous les assets frontend (CSS, JavaScript, images).

```
assets/
├── styles/
│   ├── app.css              # CSS compilé (généré par Tailwind)
│   ├── app.css.source       # Source Tailwind CSS
│   └── pixel-art.css        # Ancien CSS (déprécié)
├── app.js                   # Point d'entrée JavaScript principal
├── pixel-art.js             # Logique de l'éditeur pixel art
├── stimulus_bootstrap.js     # Bootstrap Stimulus
└── controllers/             # Contrôleurs Stimulus
    ├── csrf_protection_controller.js
    └── hello_controller.js
```

### `/config`

Configuration Symfony et fichiers de données.

```
config/
├── packages/                 # Configuration des bundles Symfony
│   ├── asset_mapper.yaml
│   ├── framework.yaml
│   ├── security.yaml
│   ├── translation.yaml
│   └── ...
├── routes/                   # Configuration des routes
├── pixel_art/               # Modèles de pixel art (JSON)
│   ├── mario.json
│   ├── mushroom.json
│   ├── heart.json
│   ├── frog.json
│   └── ... (26 fichiers JSON)
└── routes.yaml              # Routes principales
```

### `/src`

Code source PHP de l'application.

```
src/
├── Controller/
│   ├── PixelArtController.php    # Contrôleur principal (page d'accueil)
│   └── Api/
│       └── ArtController.php     # API REST pour les arts
├── Model/
│   ├── AbstractPixelArtModel.php # Classe abstraite pour les modèles
│   └── PixelArtModel.php         # Modèle concret
├── Service/
│   └── ArtLibraryService.php     # Service de bibliothèque d'art
├── EventSubscriber/
│   └── LocaleSubscriber.php      # Gestion de la locale
└── Kernel.php                    # Kernel Symfony
```

**Description des composants :**

- **PixelArtController** : Gère l'affichage de la page principale
- **ArtController** : Expose l'API REST (`/api/art`)
- **AbstractPixelArtModel** : Classe abstraite pour charger et manipuler les modèles
- **ArtLibraryService** : Charge et met en cache tous les modèles JSON
- **LocaleSubscriber** : Gère le changement de langue

### `/templates`

Templates Twig pour le rendu des pages.

```
templates/
├── base.html.twig          # Template de base (layout principal)
└── pixel_art/
    └── index.html.twig    # Template de la page principale
```

### `/tests`

Tests PHPUnit pour l'application.

```
tests/
├── Controller/
│   ├── PixelArtControllerTest.php    # Tests du contrôleur principal
│   └── Api/
│       └── ArtControllerTest.php     # Tests de l'API REST
└── Service/
    └── ArtLibraryServiceTest.php     # Tests du service
```

### `/translations`

Fichiers de traduction XLF pour l'internationalisation.

```
translations/
├── messages.fr.xlf        # Traductions françaises
├── messages.en.xlf        # Traductions anglaises
└── messages.es.xlf        # Traductions espagnoles
```

### `/public`

Point d'entrée public de l'application (document root).

```
public/
└── index.php              # Point d'entrée Symfony
```

## Fichiers de configuration racine

### Fichiers PHP/Composer

- **`composer.json`** : Dépendances PHP et configuration Composer
- **`composer.lock`** : Versions verrouillées des dépendances
- **`symfony.lock`** : Configuration Symfony Flex

### Fichiers Node.js/npm

- **`package.json`** : Dépendances Node.js et scripts npm
- **`package-lock.json`** : Versions verrouillées des dépendances npm
- **`tailwind.config.js`** : Configuration Tailwind CSS
- **`postcss.config.js`** : Configuration PostCSS

### Fichiers Symfony

- **`importmap.php`** : Configuration Asset Mapper (importmap)
- **`phpunit.dist.xml`** : Configuration PHPUnit

### Documentation

- **`README.md`** : Documentation principale
- **`API.md`** : Documentation de l'API REST
- **`CONTRIBUTING.md`** : Guide de contribution
- **`CODE_OF_CONDUCT.md`** : Code de conduite
- **`LICENSE`** : Licence MIT

## Organisation des modèles de pixel art

Les modèles sont stockés dans `config/pixel_art/` au format JSON :

```json
{
  "name": "mario",
  "width": 16,
  "height": 16,
  "pixels": [
    {
      "row": 0,
      "col": 5,
      "color": "#FF0000"
    }
  ]
}
```

Chaque modèle contient :
- **name** : Identifiant unique du modèle
- **width/height** : Dimensions (toujours 16x16)
- **pixels** : Tableau des pixels colorés (seulement les pixels non-blancs)

Pour plus de détails sur le format, consultez [API.md](API.md).

## Architecture MVC

Le projet suit le pattern MVC de Symfony :

- **Modèle** : `AbstractPixelArtModel`, `PixelArtModel`, fichiers JSON
- **Vue** : Templates Twig dans `templates/`
- **Contrôleur** : `PixelArtController`, `ArtController`

Le service `ArtLibraryService` agit comme une couche d'abstraction entre les contrôleurs et les modèles.

