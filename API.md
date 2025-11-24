# 📡 Documentation API

Cette API REST permet d'accéder à la bibliothèque de modèles de pixel art prédéfinis.

## Base URL

```
http://localhost:8000/api/art
```

## Endpoints

### 1. Liste des arts disponibles

Récupère la liste de tous les modèles de pixel art disponibles.

**Endpoint:** `GET /api/art`

**Réponse:** `200 OK`

**Exemple de requête:**

```bash
curl http://localhost:8000/api/art
```

**Exemple de réponse:**

```json
[
  "mario",
  "mushroom",
  "heart",
  "frog",
  "star",
  "smiley",
  "cat",
  "house",
  "tree",
  "flower",
  "rocket",
  "diamond",
  "butterfly",
  "car",
  "fish",
  "sun",
  "moon",
  "cloud",
  "cup",
  "apple",
  "pacman",
  "ghost",
  "bomb",
  "lightning",
  "snowflake",
  "castle"
]
```

---

### 2. Récupérer un art spécifique

Récupère les données d'un modèle de pixel art spécifique.

**Endpoint:** `GET /api/art/{name}`

**Paramètres:**

| Paramètre | Type   | Description                    | Validation                    |
|-----------|--------|--------------------------------|-------------------------------|
| `name`    | string | Nom du modèle (ex: "mario")   | Alphanumeric, underscore, tiret uniquement |

**Réponse:** `200 OK`

**Exemple de requête:**

```bash
curl http://localhost:8000/api/art/mario
```

**Exemple de réponse:**

```json
[
  "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF",
  "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF",
  "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000",
  ...
]
```

**Format de la réponse:**

- Tableau de 256 éléments (16x16 = 256 pixels)
- Chaque élément est une couleur au format hexadécimal (`#RRGGBB`)
- Les pixels sont organisés en format linéaire (row-major order)
- Index 0 = pixel (0,0), Index 1 = pixel (0,1), ..., Index 255 = pixel (15,15)

**Calcul de la position:**

Pour convertir un index en position (row, col) :
```javascript
const row = Math.floor(index / 16);
const col = index % 16;
```

---

## Codes d'erreur

### 400 Bad Request

Le nom de l'art est invalide (contient des caractères non autorisés).

**Exemple de réponse:**

```json
{
  "error": "Invalid art name"
}
```

**Exemple de requête invalide:**

```bash
curl http://localhost:8000/api/art/../etc/passwd
```

### 404 Not Found

L'art demandé n'existe pas dans la bibliothèque.

**Exemple de réponse:**

```json
{
  "error": "Art not found"
}
```

**Exemple de requête:**

```bash
curl http://localhost:8000/api/art/nonexistent
```

---

## Exemples d'utilisation

### JavaScript (Fetch API)

```javascript
// Récupérer la liste des arts
fetch('/api/art')
  .then(response => response.json())
  .then(arts => {
    console.log('Arts disponibles:', arts);
  });

// Récupérer un art spécifique
fetch('/api/art/mario')
  .then(response => response.json())
  .then(pixels => {
    console.log('Pixels Mario:', pixels);
    // pixels est un tableau de 256 couleurs
  });
```

### PHP (Guzzle HTTP)

```php
use GuzzleHttp\Client;

$client = new Client(['base_uri' => 'http://localhost:8000']);

// Liste des arts
$response = $client->get('/api/art');
$arts = json_decode($response->getBody(), true);

// Art spécifique
$response = $client->get('/api/art/mario');
$pixels = json_decode($response->getBody(), true);
```

### Python (Requests)

```python
import requests

# Liste des arts
response = requests.get('http://localhost:8000/api/art')
arts = response.json()

# Art spécifique
response = requests.get('http://localhost:8000/api/art/mario')
pixels = response.json()
```

---

## Format des données

### Structure d'un pixel art

Chaque modèle de pixel art est stocké dans un fichier JSON avec la structure suivante :

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
    },
    {
      "row": 0,
      "col": 6,
      "color": "#FF0000"
    }
  ]
}
```

L'API retourne uniquement le tableau de 256 couleurs en format linéaire pour faciliter l'utilisation côté client.

---

## Sécurité

- **Validation des paramètres** : Les noms d'art sont validés pour prévenir les attaques de type path traversal
- **Format strict** : Seuls les caractères alphanumériques, underscore et tiret sont acceptés
- **Pas d'authentification requise** : L'API est publique et en lecture seule

---

## Limites

- **Taille** : Chaque art fait exactement 16x16 pixels (256 pixels)
- **Format** : Couleurs au format hexadécimal uniquement
- **Lecture seule** : L'API ne permet que la lecture, pas la modification

---

## Support

Pour toute question ou problème avec l'API, veuillez ouvrir une [issue](https://github.com/votre-repo/issues) sur GitHub.

