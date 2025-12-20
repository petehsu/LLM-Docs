# Aperçu de l'API

La Claude API est une API RESTful qui fournit un accès programmatique aux modèles Claude.

---

La Claude API est une API RESTful à `https://api.anthropic.com` qui fournit un accès programmatique aux modèles Claude. L'API principale est l'API Messages (`POST /v1/messages`) pour les interactions conversationnelles.

<Note>
**Nouveau sur Claude ?** Commencez par [Démarrer](/docs/fr/get-started) pour les prérequis et votre premier appel API, ou consultez [Travailler avec les Messages](/docs/fr/build-with-claude/working-with-messages) pour les modèles de requête/réponse et les exemples.
</Note>

## Prérequis

Pour utiliser la Claude API, vous aurez besoin de :

- Un [compte Anthropic Console](https://console.anthropic.com)
- Une [clé API](/settings/keys)

Pour des instructions de configuration étape par étape, consultez [Démarrer](/docs/fr/get-started).

## API disponibles

La Claude API inclut les API suivantes :

**Disponibilité générale :**
- **[API Messages](/docs/fr/api/messages)** : Envoyez des messages à Claude pour les interactions conversationnelles (`POST /v1/messages`)
- **[API Message Batches](/docs/fr/api/creating-message-batches)** : Traitez de grands volumes de requêtes Messages de manière asynchrone avec une réduction de coût de 50 % (`POST /v1/messages/batches`)
- **[API Token Counting](/docs/fr/api/messages-count-tokens)** : Comptez les jetons dans un message avant d'envoyer pour gérer les coûts et les limites de débit (`POST /v1/messages/count_tokens`)
- **[API Models](/docs/fr/api/models-list)** : Listez les modèles Claude disponibles et leurs détails (`GET /v1/models`)

**Bêta :**
- **[API Files](/docs/fr/api/files-create)** : Téléchargez et gérez les fichiers pour une utilisation dans plusieurs appels API (`POST /v1/files`, `GET /v1/files`)
- **[API Skills](/docs/fr/api/skills/create-skill)** : Créez et gérez les compétences d'agent personnalisées (`POST /v1/skills`, `GET /v1/skills`)

Pour la référence API complète avec tous les points de terminaison, paramètres et schémas de réponse, explorez les pages de référence API listées dans la navigation. Pour accéder aux fonctionnalités bêta, consultez [En-têtes bêta](/docs/fr/api/beta-headers).

## Authentification

Toutes les requêtes à la Claude API doivent inclure ces en-têtes :

| En-tête | Valeur | Requis |
|--------|--------|--------|
| `x-api-key` | Votre clé API de Console | Oui |
| `anthropic-version` | Version de l'API (par exemple, `2023-06-01`) | Oui |
| `content-type` | `application/json` | Oui |

Si vous utilisez les [SDK Client](#client-sdks), le SDK enverra ces en-têtes automatiquement. Pour les détails du versioning de l'API, consultez [Versions de l'API](/docs/fr/api/versioning).

### Obtenir les clés API

L'API est mise à disposition via la [Console](https://console.anthropic.com/) web. Vous pouvez utiliser le [Workbench](https://console.anthropic.com/workbench) pour essayer l'API dans le navigateur, puis générer des clés API dans [Paramètres du compte](https://console.anthropic.com/settings/keys). Utilisez les [espaces de travail](https://console.anthropic.com/settings/workspaces) pour segmenter vos clés API et [contrôler les dépenses](/docs/fr/api/rate-limits) par cas d'utilisation.

## SDK Client

Anthropic fournit des SDK officiels qui simplifient l'intégration de l'API en gérant l'authentification, le formatage des requêtes, la gestion des erreurs, et plus encore.

**Avantages** :
- Gestion automatique des en-têtes (x-api-key, anthropic-version, content-type)
- Gestion des requêtes et réponses de type sûr
- Logique de nouvelle tentative intégrée et gestion des erreurs
- Support du streaming
- Délais d'expiration des requêtes et gestion des connexions

**Exemple** (Python) :
```python
from anthropic import Anthropic

client = Anthropic()  # Lit ANTHROPIC_API_KEY à partir de l'environnement
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

Pour une liste des SDK Client et leurs instructions d'installation respectives, consultez [SDK Client](/docs/fr/api/client-sdks).

## Claude API vs Plateformes tierces

Claude est disponible via l'API directe d'Anthropic et via les plateformes partenaires. Choisissez en fonction de votre infrastructure, de vos exigences de conformité et de vos préférences tarifaires.

### Claude API

- **Accès direct** aux derniers modèles et fonctionnalités en premier
- **Facturation et support Anthropic**
- **Idéal pour** : Nouvelles intégrations, accès complet aux fonctionnalités, relation directe avec Anthropic

### API de plateformes tierces

Accédez à Claude via AWS, Google Cloud ou Microsoft Azure :
- **Intégré** à la facturation et à l'IAM du fournisseur cloud
- **Peut avoir des retards de fonctionnalités** ou des différences par rapport à l'API directe
- **Idéal pour** : Engagements cloud existants, exigences de conformité spécifiques, facturation cloud consolidée

| Plateforme | Fournisseur | Documentation |
|-----------|-----------|---------------|
| Amazon Bedrock | AWS | [Claude sur Amazon Bedrock](/docs/fr/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Claude sur Vertex AI](/docs/fr/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Claude sur Azure AI](/docs/fr/build-with-claude/claude-in-microsoft-foundry) |

<Note>
Pour la disponibilité des fonctionnalités sur les plateformes, consultez l'[Aperçu des fonctionnalités](/docs/fr/build-with-claude/overview).
</Note>

## Format de requête et de réponse

### Limites de taille des requêtes

L'API a différentes tailles de requête maximales selon le point de terminaison :

| Point de terminaison | Taille maximale |
|-----------|-----------|
| Points de terminaison standard (Messages, Token Counting) | 32 MB |
| [API Batch](/docs/fr/build-with-claude/batch-processing) | 256 MB |
| [API Files](/docs/fr/build-with-claude/files) | 500 MB |

Si vous dépassez ces limites, vous recevrez une erreur 413 `request_too_large`.

### En-têtes de réponse

La Claude API inclut les en-têtes suivants dans chaque réponse :

- `request-id` : Un identifiant unique global pour la requête
- `anthropic-organization-id` : L'ID d'organisation associé à la clé API utilisée dans la requête

## Limites de débit et disponibilité

### Limites de débit

L'API applique des limites de débit et des limites de dépenses pour prévenir les abus et gérer la capacité. Les limites sont organisées en niveaux d'utilisation qui augmentent automatiquement à mesure que vous utilisez l'API. Chaque niveau a :

- **Limites de dépenses** : Coût mensuel maximum pour l'utilisation de l'API
- **Limites de débit** : Nombre maximum de requêtes par minute (RPM) et de jetons par minute (TPM)

Vous pouvez afficher les limites actuelles de votre organisation dans la [Console](/settings/limits). Pour des limites plus élevées ou Priority Tier (niveaux de service améliorés avec dépenses engagées), contactez les ventes via la Console.

Pour des informations détaillées sur les limites, les niveaux et l'algorithme de seau de jetons utilisé pour la limitation de débit, consultez [Limites de débit](/docs/fr/api/rate-limits).

### Disponibilité

La Claude API est disponible dans [de nombreux pays et régions](/docs/fr/api/supported-regions) dans le monde. Consultez la page des régions prises en charge pour confirmer la disponibilité dans votre emplacement.

## Exemple basique

Voici une requête minimale utilisant l'API Messages :

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**Réponse :**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8
  }
}
```

Pour des exemples complets et des tutoriels, consultez [Démarrer](/docs/fr/get-started) et [Travailler avec les Messages](/docs/fr/build-with-claude/working-with-messages).

## Étapes suivantes

<CardGroup cols={3}>
  <Card title="Démarrer" icon="rocket" href="/docs/fr/get-started">
    Prérequis, tutoriel étape par étape et exemples dans plusieurs langues
  </Card>
  <Card title="Travailler avec les Messages" icon="message" href="/docs/fr/build-with-claude/working-with-messages">
    Modèles de requête/réponse, conversations multi-tours et meilleures pratiques
  </Card>
  <Card title="Référence de l'API Messages" icon="book" href="/docs/fr/api/messages">
    Spécification API complète : paramètres, réponses et codes d'erreur
  </Card>
  <Card title="SDK Client" icon="code" href="/docs/fr/api/client-sdks">
    Guides d'installation pour Python, TypeScript, Java, Go, C#, Ruby et PHP
  </Card>
  <Card title="Aperçu des fonctionnalités" icon="grid" href="/docs/fr/build-with-claude/overview">
    Explorez les capacités : mise en cache, vision, utilisation d'outils, streaming et plus
  </Card>
  <Card title="Limites de débit" icon="gauge" href="/docs/fr/api/rate-limits">
    Niveaux d'utilisation, limites de dépenses et limitation de débit avec algorithme de seau de jetons
  </Card>
</CardGroup>