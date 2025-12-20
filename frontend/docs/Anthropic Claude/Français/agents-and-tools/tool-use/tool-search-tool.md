# Outil de recherche d'outils

Permettez à Claude de travailler avec des centaines ou des milliers d'outils en découvrant et chargeant dynamiquement les outils à la demande.

---

L'outil de recherche d'outils permet à Claude de travailler avec des centaines ou des milliers d'outils en découvrant et chargeant dynamiquement les outils à la demande. Au lieu de charger toutes les définitions d'outils dans la fenêtre de contexte dès le départ, Claude recherche votre catalogue d'outils—y compris les noms d'outils, les descriptions, les noms d'arguments et les descriptions d'arguments—et charge uniquement les outils dont il a besoin.

Cette approche résout deux défis critiques à mesure que les bibliothèques d'outils se développent :

- **Efficacité du contexte** : Les définitions d'outils peuvent consommer des portions massives de votre fenêtre de contexte (50 outils ≈ 10-20K jetons), laissant moins de place pour le travail réel
- **Précision de la sélection d'outils** : La capacité de Claude à sélectionner correctement les outils se dégrade considérablement avec plus de 30-50 outils conventionnellement disponibles

Bien que cela soit fourni en tant qu'outil côté serveur, vous pouvez également implémenter votre propre fonctionnalité de recherche d'outils côté client. Voir [Implémentation personnalisée de la recherche d'outils](#custom-tool-search-implementation) pour plus de détails.

<Note>
L'outil de recherche d'outils est actuellement en bêta publique. Incluez l'en-tête [bêta](/docs/fr/api/beta-headers) approprié pour votre fournisseur :

| Fournisseur                 | En-tête bêta                  | Modèles supportés                       |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Claude API<br/>Microsoft Foundry  | `advanced-tool-use-2025-11-20` | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Google Cloud's Vertex AI | `tool-search-tool-2025-10-19`  | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Amazon Bedrock           | `tool-search-tool-2025-10-19`  | Claude Opus 4.5                        |
</Note>

<Warning>
  Sur Amazon Bedrock, la recherche d'outils côté serveur est disponible uniquement via l'[API invoke](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_AnthropicClaude_section.html),
  pas l'API converse.
</Warning>

Vous pouvez également implémenter une [recherche d'outils côté client](#custom-tool-search-implementation) en retournant des blocs `tool_reference` de votre propre implémentation de recherche.

## Comment fonctionne la recherche d'outils

Il existe deux variantes de recherche d'outils :

- **Regex** (`tool_search_tool_regex_20251119`) : Claude construit des motifs regex pour rechercher des outils
- **BM25** (`tool_search_tool_bm25_20251119`) : Claude utilise des requêtes en langage naturel pour rechercher des outils

Lorsque vous activez l'outil de recherche d'outils :

1. Vous incluez un outil de recherche d'outils (par exemple, `tool_search_tool_regex_20251119` ou `tool_search_tool_bm25_20251119`) dans votre liste d'outils
2. Vous fournissez toutes les définitions d'outils avec `defer_loading: true` pour les outils qui ne doivent pas être chargés immédiatement
3. Claude voit uniquement l'outil de recherche d'outils et tous les outils non différés initialement
4. Lorsque Claude a besoin d'outils supplémentaires, il effectue une recherche en utilisant un outil de recherche d'outils
5. L'API retourne 3-5 blocs `tool_reference` les plus pertinents
6. Ces références sont automatiquement développées en définitions d'outils complètes
7. Claude sélectionne parmi les outils découverts et les invoque

Cela maintient votre fenêtre de contexte efficace tout en maintenant une haute précision de sélection d'outils.

## Démarrage rapide

Voici un exemple simple avec des outils différés :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in San Francisco?"
            }
        ],
        "tools": [
            {
                "type": "tool_search_tool_regex_20251119",
                "name": "tool_search_tool_regex"
            },
            {
                "name": "get_weather",
                "description": "Get the weather at a specific location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"},
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                },
                "defer_loading": true
            },
            {
                "name": "search_files",
                "description": "Search through files in the workspace",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "file_types": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["query"]
                },
                "defer_loading": true
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "What is the weather in San Francisco?"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get the weather at a specific location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            },
            "defer_loading": True
        },
        {
            "name": "search_files",
            "description": "Search through files in the workspace",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "file_types": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["query"]
            },
            "defer_loading": True
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: "What is the weather in San Francisco?",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        name: "get_weather",
        description: "Get the weather at a specific location",
        input_schema: {
          type: "object",
          properties: {
            location: { type: "string" },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
        defer_loading: true,
      },
      {
        name: "search_files",
        description: "Search through files in the workspace",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            file_types: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["query"],
        },
        defer_loading: true,
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

## Définition d'outil

L'outil de recherche d'outils a deux variantes :

```json JSON
{
  "type": "tool_search_tool_regex_20251119",
  "name": "tool_search_tool_regex"
}
```

```json JSON
{
  "type": "tool_search_tool_bm25_20251119",
  "name": "tool_search_tool_bm25"
}
```

<Warning>
**Format de requête de variante Regex : Expression régulière Python, PAS langage naturel**

Lors de l'utilisation de `tool_search_tool_regex_20251119`, Claude construit des motifs regex en utilisant la syntaxe `re.search()` de Python, pas des requêtes en langage naturel. Motifs courants :

- `"weather"` - correspond aux noms/descriptions d'outils contenant "weather"
- `"get_.*_data"` - correspond aux outils comme `get_user_data`, `get_weather_data`
- `"database.*query|query.*database"` - motifs OU pour la flexibilité
- `"(?i)slack"` - recherche insensible à la casse

Longueur maximale de requête : 200 caractères

</Warning>

<Note>
**Format de requête de variante BM25 : Langage naturel**

Lors de l'utilisation de `tool_search_tool_bm25_20251119`, Claude utilise des requêtes en langage naturel pour rechercher des outils.

</Note>

### Chargement d'outils différé

Marquez les outils pour un chargement à la demande en ajoutant `defer_loading: true` :

```json JSON
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["location"]
  },
  "defer_loading": true
}
```

**Points clés :**

- Les outils sans `defer_loading` sont chargés dans le contexte immédiatement
- Les outils avec `defer_loading: true` ne sont chargés que lorsque Claude les découvre via la recherche
- L'outil de recherche d'outils lui-même ne devrait **jamais** avoir `defer_loading: true`
- Gardez vos 3-5 outils les plus fréquemment utilisés comme non différés pour des performances optimales

Les deux variantes de recherche d'outils (`regex` et `bm25`) recherchent les noms d'outils, les descriptions, les noms d'arguments et les descriptions d'arguments.

## Format de réponse

Lorsque Claude utilise l'outil de recherche d'outils, la réponse inclut de nouveaux types de blocs :

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll search for tools to help with the weather information."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01ABC123",
      "name": "tool_search_tool_regex",
      "input": {
        "query": "weather"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_01ABC123",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [{ "type": "tool_reference", "tool_name": "get_weather" }]
      }
    },
    {
      "type": "text",
      "text": "I found a weather tool. Let me get the weather for San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01XYZ789",
      "name": "get_weather",
      "input": { "location": "San Francisco", "unit": "fahrenheit" }
    }
  ],
  "stop_reason": "tool_use"
}
```

### Comprendre la réponse

- **`server_tool_use`** : Indique que Claude invoque l'outil de recherche d'outils
- **`tool_search_tool_result`** : Contient les résultats de recherche avec un objet `tool_search_tool_search_result` imbriqué
- **`tool_references`** : Tableau d'objets `tool_reference` pointant vers les outils découverts
- **`tool_use`** : Claude invoquant l'outil découvert

Les blocs `tool_reference` sont automatiquement développés en définitions d'outils complètes avant d'être affichés à Claude. Vous n'avez pas besoin de gérer cette expansion vous-même. Cela se fait automatiquement dans l'API tant que vous fournissez toutes les définitions d'outils correspondantes dans le paramètre `tools`.

## Intégration MCP

L'outil de recherche d'outils fonctionne avec les [serveurs MCP](/docs/fr/agents-and-tools/mcp-connector). Ajoutez l'en-tête [bêta](/docs/fr/api/beta-headers) `"mcp-client-2025-11-20"` à votre requête API, puis utilisez `mcp_toolset` avec `default_config` pour différer le chargement des outils MCP :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "anthropic-beta: advanced-tool-use-2025-11-20,mcp-client-2025-11-20" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "mcp_servers": [
      {
        "type": "url",
        "name": "database-server",
        "url": "https://mcp-db.example.com"
      }
    ],
    "tools": [
      {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
      },
      {
        "type": "mcp_toolset",
        "mcp_server_name": "database-server",
        "default_config": {
          "defer_loading": true
        },
        "configs": {
          "search_events": {
            "defer_loading": false
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What events are in my database?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens=2048,
    mcp_servers=[
        {
            "type": "url",
            "name": "database-server",
            "url": "https://mcp-db.example.com"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "type": "mcp_toolset",
            "mcp_server_name": "database-server",
            "default_config": {
                "defer_loading": True
            },
            "configs": {
                "search_events": {
                    "defer_loading": False
                }
            }
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What events are in my database?"
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens: 2048,
    mcp_servers: [
      {
        type: "url",
        name: "database-server",
        url: "https://mcp-db.example.com",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        type: "mcp_toolset",
        mcp_server_name: "database-server",
        default_config: {
          defer_loading: true,
        },
        configs: {
          search_events: {
            defer_loading: false,
          },
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: "What events are in my database?",
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

**Options de configuration MCP :**

- `default_config.defer_loading` : Définir la valeur par défaut pour tous les outils du serveur MCP
- `configs` : Remplacer les valeurs par défaut pour des outils spécifiques par nom
- Combinez plusieurs serveurs MCP avec la recherche d'outils pour des bibliothèques d'outils massives

## Implémentation personnalisée de la recherche d'outils

Vous pouvez implémenter votre propre logique de recherche d'outils (par exemple, en utilisant des embeddings ou une recherche sémantique) en retournant des blocs `tool_reference` à partir d'un outil personnalisé :

```json JSON
{
  "type": "tool_search_tool_result",
  "tool_use_id": "toolu_custom_search",
  "content": {
    "type": "tool_search_tool_search_result",
    "tool_references": [{ "type": "tool_reference", "tool_name": "discovered_tool_name" }]
  }
}
```

Chaque outil référencé doit avoir une définition d'outil correspondante dans le paramètre `tools` de niveau supérieur avec `defer_loading: true`. Cette approche vous permet d'utiliser des algorithmes de recherche plus sophistiqués tout en maintenant la compatibilité avec le système de recherche d'outils.

Pour un exemple complet utilisant des embeddings, consultez notre [cookbook de recherche d'outils avec embeddings](https://github.com/anthropics/anthropic-cookbook).

## Gestion des erreurs

<Note>
  L'outil de recherche d'outils n'est pas compatible avec les [exemples d'utilisation d'outils](/docs/fr/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples).
  Si vous avez besoin de fournir des exemples d'utilisation d'outils, utilisez l'appel d'outils standard
  sans recherche d'outils.
</Note>

### Erreurs HTTP (statut 400)

Ces erreurs empêchent la requête d'être traitée :

**Tous les outils différés :**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "All tools have defer_loading set. At least one tool must be non-deferred."
  }
}
```

**Définition d'outil manquante :**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Tool reference 'unknown_tool' has no corresponding tool definition"
  }
}
```

### Erreurs de résultat d'outil (statut 200)

Les erreurs lors de l'exécution d'outils retournent une réponse 200 avec les informations d'erreur dans le corps :

```json JSON
{
  "type": "tool_result",
  "tool_use_id": "srvtoolu_01ABC123",
  "content": {
    "type": "tool_search_tool_result_error",
    "error_code": "invalid_pattern"
  }
}
```

**Codes d'erreur :**

- `too_many_requests` : Limite de débit dépassée pour les opérations de recherche d'outils
- `invalid_pattern` : Motif regex mal formé
- `pattern_too_long` : Le motif dépasse la limite de 200 caractères
- `unavailable` : Service de recherche d'outils temporairement indisponible

### Erreurs courantes

<section title="Erreur 400 : Tous les outils sont différés">

**Cause** : Vous avez défini `defer_loading: true` sur TOUS les outils, y compris l'outil de recherche

**Correction** : Supprimez `defer_loading` de l'outil de recherche d'outils :

```json
{
  "type": "tool_search_tool_regex_20251119", // Pas de defer_loading ici
  "name": "tool_search_tool_regex"
}
```

</section>

<section title="Erreur 400 : Définition d'outil manquante">

**Cause** : Une `tool_reference` pointe vers un outil qui n'est pas dans votre tableau `tools`

**Correction** : Assurez-vous que chaque outil qui pourrait être découvert a une définition complète :

```json
{
  "name": "my_tool",
  "description": "Full description here",
  "input_schema": {
    /* complete schema */
  },
  "defer_loading": true
}
```

</section>

<section title="Claude ne trouve pas les outils attendus">

**Cause** : Les noms ou descriptions d'outils ne correspondent pas au motif regex

**Étapes de débogage :**

1. Vérifiez le nom et la description de l'outil—Claude recherche les DEUX champs
2. Testez votre motif : `import re; re.search(r"your_pattern", "tool_name")`
3. N'oubliez pas que les recherches sont sensibles à la casse par défaut (utilisez `(?i)` pour insensible à la casse)
4. Claude utilise des motifs larges comme `".*weather.*"` et non des correspondances exactes

**Conseil** : Ajoutez des mots-clés courants aux descriptions d'outils pour améliorer la découvrabilité

</section>

## Mise en cache des invites

La recherche d'outils fonctionne avec la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching). Ajoutez des points de rupture `cache_control` pour optimiser les conversations multi-tours :

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# First request with tool search
messages = [
    {
        "role": "user",
        "content": "What's the weather in Seattle?"
    }
]

response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

# Add Claude's response to conversation
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Second request with cache breakpoint
messages.append({
    "role": "user",
    "content": "What about New York?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```
</CodeGroup>

Le système développe automatiquement les blocs tool_reference dans tout l'historique de conversation, de sorte que Claude peut réutiliser les outils découverts dans les tours suivants sans effectuer une nouvelle recherche.

## Streaming

Avec le streaming activé, vous recevrez les événements de recherche d'outils dans le flux :

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "tool_search_tool_regex"}}

// Search query streamed
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"weather\"}"}}

// Pause while search executes

// Search results streamed
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "tool_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "tool_search_tool_search_result", "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]}}}

// Claude continues with discovered tools
```

## Requêtes par lot

Vous pouvez inclure l'outil de recherche d'outils dans l'[API Messages Batches](/docs/fr/build-with-claude/batch-processing). Les opérations de recherche d'outils via l'API Messages Batches sont facturées de la même manière que celles des requêtes de l'API Messages régulière.

## Limites et meilleures pratiques

### Limites

- **Outils maximum** : 10 000 outils dans votre catalogue
- **Résultats de recherche** : Retourne 3-5 outils les plus pertinents par recherche
- **Longueur du motif** : Maximum 200 caractères pour les motifs regex
- **Support des modèles** : Sonnet 4.0+, Opus 4.0+ uniquement (pas Haiku)

### Quand utiliser la recherche d'outils

**Bons cas d'usage :**

- 10+ outils disponibles dans votre système
- Les définitions d'outils consomment >10K jetons
- Vous rencontrez des problèmes de précision de sélection d'outils avec de grands ensembles d'outils
- Création de systèmes alimentés par MCP avec plusieurs serveurs (200+ outils)
- La bibliothèque d'outils se développe au fil du temps

**Quand l'appel d'outils traditionnel pourrait être meilleur :**

- Moins de 10 outils au total
- Tous les outils sont fréquemment utilisés dans chaque requête
- Très petites définitions d'outils (\<100 jetons au total)

### Conseils d'optimisation

- Gardez 3-5 outils les plus fréquemment utilisés comme non différés
- Écrivez des noms et descriptions d'outils clairs et descriptifs
- Utilisez des mots-clés sémantiques dans les descriptions qui correspondent à la façon dont les utilisateurs décrivent les tâches
- Ajoutez une section d'invite système décrivant les catégories d'outils disponibles : « Vous pouvez rechercher des outils pour interagir avec Slack, GitHub et Jira »
- Surveillez les outils que Claude découvre pour affiner les descriptions

## Utilisation

L'utilisation de l'outil de recherche d'outils est suivie dans l'objet d'utilisation de la réponse :

```json JSON
{
  "usage": {
    "input_tokens": 1024,
    "output_tokens": 256,
    "server_tool_use": {
      "tool_search_requests": 2
    }
  }
}
```