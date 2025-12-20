# Résultats de recherche

Activez les citations naturelles pour les applications RAG en fournissant des résultats de recherche avec attribution de source

---

Les blocs de contenu de résultats de recherche permettent des citations naturelles avec une attribution de source appropriée, apportant des citations de qualité web à vos applications personnalisées. Cette fonctionnalité est particulièrement puissante pour les applications RAG (Retrieval-Augmented Generation) où vous avez besoin que Claude cite les sources avec précision.

La fonctionnalité de résultats de recherche est disponible sur les modèles suivants :

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([déprécié](/docs/fr/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)

## Avantages clés

- **Citations naturelles** - Obtenez la même qualité de citation que la recherche web pour n'importe quel contenu
- **Intégration flexible** - Utilisez dans les retours d'outils pour RAG dynamique ou comme contenu de haut niveau pour les données pré-récupérées
- **Attribution de source appropriée** - Chaque résultat inclut les informations de source et de titre pour une attribution claire
- **Aucune solution de contournement de document nécessaire** - Élimine le besoin de solutions de contournement basées sur les documents
- **Format de citation cohérent** - Correspond à la qualité et au format de citation de la fonctionnalité de recherche web de Claude

## Comment cela fonctionne

Les résultats de recherche peuvent être fournis de deux façons :

1. **À partir d'appels d'outils** - Vos outils personnalisés retournent des résultats de recherche, permettant des applications RAG dynamiques
2. **Comme contenu de haut niveau** - Vous fournissez les résultats de recherche directement dans les messages utilisateur pour le contenu pré-récupéré ou mis en cache

Dans les deux cas, Claude peut automatiquement citer les informations des résultats de recherche avec une attribution de source appropriée.

### Schéma de résultat de recherche

Les résultats de recherche utilisent la structure suivante :

```json
{
  "type": "search_result",
  "source": "https://example.com/article",  // Requis : URL source ou identifiant
  "title": "Article Title",                  // Requis : Titre du résultat
  "content": [                               // Requis : Tableau de blocs de texte
    {
      "type": "text",
      "text": "The actual content of the search result..."
    }
  ],
  "citations": {                             // Optionnel : Configuration des citations
    "enabled": true                          // Activer/désactiver les citations pour ce résultat
  }
}
```

### Champs obligatoires

| Champ | Type | Description |
|-------|------|-------------|
| `type` | string | Doit être `"search_result"` |
| `source` | string | L'URL source ou l'identifiant du contenu |
| `title` | string | Un titre descriptif pour le résultat de recherche |
| `content` | array | Un tableau de blocs de texte contenant le contenu réel |

### Champs optionnels

| Champ | Type | Description |
|-------|------|-------------|
| `citations` | object | Configuration des citations avec le champ booléen `enabled` |
| `cache_control` | object | Paramètres de contrôle du cache (par exemple, `{"type": "ephemeral"}`) |

Chaque élément du tableau `content` doit être un bloc de texte avec :
- `type` : Doit être `"text"`
- `text` : Le contenu textuel réel (chaîne non vide)

## Méthode 1 : Résultats de recherche à partir d'appels d'outils

Le cas d'utilisation le plus puissant est de retourner des résultats de recherche à partir de vos outils personnalisés. Cela permet des applications RAG dynamiques où les outils récupèrent et retournent le contenu pertinent avec des citations automatiques.

### Exemple : Outil de base de connaissances

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam,
    ToolResultBlockParam
)

client = Anthropic()

# Define a knowledge base search tool
knowledge_base_tool = {
    "name": "search_knowledge_base",
    "description": "Search the company knowledge base for information",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query"
            }
        },
        "required": ["query"]
    }
}

# Function to handle the tool call
def search_knowledge_base(query):
    # Your search logic here
    # Returns search results in the correct format
    return [
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/product-guide",
            title="Product Configuration Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
                )
            ],
            citations={"enabled": True}
        ),
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/troubleshooting",
            title="Troubleshooting Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
                )
            ],
            citations={"enabled": True}
        )
    ]

# Create a message with the tool
response = client.messages.create(
    model="claude-sonnet-4-5",  # Works with all supported models
    max_tokens=1024,
    tools=[knowledge_base_tool],
    messages=[
        MessageParam(
            role="user",
            content="How do I configure the timeout settings?"
        )
    ]
)

# When Claude calls the tool, provide the search results
if response.content[0].type == "tool_use":
    tool_result = search_knowledge_base(response.content[0].input["query"])
    
    # Send the tool result back
    final_response = client.messages.create(
        model="claude-sonnet-4-5",  # Works with all supported models
        max_tokens=1024,
        messages=[
            MessageParam(role="user", content="How do I configure the timeout settings?"),
            MessageParam(role="assistant", content=response.content),
            MessageParam(
                role="user",
                content=[
                    ToolResultBlockParam(
                        type="tool_result",
                        tool_use_id=response.content[0].id,
                        content=tool_result  # Search results go here
                    )
                ]
            )
        ]
    )
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Define a knowledge base search tool
const knowledgeBaseTool = {
  name: "search_knowledge_base",
  description: "Search the company knowledge base for information",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query"
      }
    },
    required: ["query"]
  }
};

// Function to handle the tool call
function searchKnowledgeBase(query: string) {
  // Your search logic here
  // Returns search results in the correct format
  return [
    {
      type: "search_result" as const,
      source: "https://docs.company.com/product-guide",
      title: "Product Configuration Guide",
      content: [
        {
          type: "text" as const,
          text: "To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
        }
      ],
      citations: { enabled: true }
    },
    {
      type: "search_result" as const,
      source: "https://docs.company.com/troubleshooting",
      title: "Troubleshooting Guide",
      content: [
        {
          type: "text" as const,
          text: "If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
        }
      ],
      citations: { enabled: true }
    }
  ];
}

// Create a message with the tool
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5", // Works with all supported models
  max_tokens: 1024,
  tools: [knowledgeBaseTool],
  messages: [
    {
      role: "user",
      content: "How do I configure the timeout settings?"
    }
  ]
});

// Handle tool use and provide results
if (response.content[0].type === "tool_use") {
  const toolResult = searchKnowledgeBase(response.content[0].input.query);
  
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5", // Works with all supported models
    max_tokens: 1024,
      messages: [
      { role: "user", content: "How do I configure the timeout settings?" },
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result" as const,
            tool_use_id: response.content[0].id,
            content: toolResult  // Search results go here
          }
        ]
      }
    ]
  });
}
```
</CodeGroup>

## Méthode 2 : Résultats de recherche comme contenu de haut niveau

Vous pouvez également fournir les résultats de recherche directement dans les messages utilisateur. Ceci est utile pour :
- Le contenu pré-récupéré de votre infrastructure de recherche
- Les résultats de recherche mis en cache à partir de requêtes précédentes
- Le contenu provenant de services de recherche externes
- Les tests et le développement

### Exemple : Résultats de recherche directs

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam
)

client = Anthropic()

# Provide search results directly in the user message
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        MessageParam(
            role="user",
            content=[
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/api-reference",
                    title="API Reference - Authentication",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        )
                    ],
                    citations={"enabled": True}
                ),
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/quickstart",
                    title="Getting Started Guide",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        )
                    ],
                    citations={"enabled": True}
                ),
                TextBlockParam(
                    type="text",
                    text="Based on these search results, how do I authenticate API requests and what are the rate limits?"
                )
            ]
        )
    ]
)

print(response.model_dump_json(indent=2))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Provide search results directly in the user message
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "search_result" as const,
          source: "https://docs.company.com/api-reference",
          title: "API Reference - Authentication",
          content: [
            {
              type: "text" as const,
              text: "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "search_result" as const,
          source: "https://docs.company.com/quickstart",
          title: "Getting Started Guide",
          content: [
            {
              type: "text" as const,
              text: "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "text" as const,
          text: "Based on these search results, how do I authenticate API requests and what are the rate limits?"
        }
      ]
    }
  ]
});

console.log(response);
```

```bash Shell
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/api-reference",
                    "title": "API Reference - Authentication",
                    "content": [
                        {
                            "type": "text",
                            "text": "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/quickstart",
                    "title": "Getting Started Guide",
                    "content": [
                        {
                            "type": "text",
                            "text": "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "text",
                    "text": "Based on these search results, how do I authenticate API requests and what are the rate limits?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

## Réponse de Claude avec citations

Indépendamment de la façon dont les résultats de recherche sont fournis, Claude inclut automatiquement les citations lors de l'utilisation d'informations provenant de ceux-ci :

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "To authenticate API requests, you need to include an API key in the Authorization header",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "All API requests must include an API key in the Authorization header",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". You can generate API keys from your dashboard",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Keys can be generated from the dashboard",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". The rate limits are 1,000 requests per hour for the standard tier and 10,000 requests per hour for the premium tier.",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Rate limits: 1000 requests per hour for standard tier, 10000 for premium",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    }
  ]
}
```

### Champs de citation

Chaque citation inclut :

| Champ | Type | Description |
|-------|------|-------------|
| `type` | string | Toujours `"search_result_location"` pour les citations de résultats de recherche |
| `source` | string | La source du résultat de recherche original |
| `title` | string ou null | Le titre du résultat de recherche original |
| `cited_text` | string | Le texte exact en cours de citation |
| `search_result_index` | integer | Index du résultat de recherche (basé sur 0) |
| `start_block_index` | integer | Position de départ dans le tableau de contenu |
| `end_block_index` | integer | Position de fin dans le tableau de contenu |

Remarque : Le `search_result_index` fait référence à l'index du bloc de contenu du résultat de recherche (basé sur 0), indépendamment de la façon dont les résultats de recherche ont été fournis (appel d'outil ou contenu de haut niveau).

## Blocs de contenu multiples

Les résultats de recherche peuvent contenir plusieurs blocs de texte dans le tableau `content` :

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/api-guide",
  "title": "API Documentation",
  "content": [
    {
      "type": "text",
      "text": "Authentication: All API requests require an API key."
    },
    {
      "type": "text",
      "text": "Rate Limits: The API allows 1000 requests per hour per key."
    },
    {
      "type": "text",
      "text": "Error Handling: The API returns standard HTTP status codes."
    }
  ]
}
```

Claude peut citer des blocs spécifiques en utilisant les champs `start_block_index` et `end_block_index`.

## Utilisation avancée

### Combinaison des deux méthodes

Vous pouvez utiliser à la fois les résultats de recherche basés sur les outils et les résultats de recherche de haut niveau dans la même conversation :

```python
# First message with top-level search results
messages = [
    MessageParam(
        role="user",
        content=[
            SearchResultBlockParam(
                type="search_result",
                source="https://docs.company.com/overview",
                title="Product Overview",
                content=[
                    TextBlockParam(type="text", text="Our product helps teams collaborate...")
                ],
                citations={"enabled": True}
            ),
            TextBlockParam(
                type="text",
                text="Tell me about this product and search for pricing information"
            )
        ]
    )
]

# Claude might respond and call a tool to search for pricing
# Then you provide tool results with more search results
```

### Combinaison avec d'autres types de contenu

Les deux méthodes supportent le mélange des résultats de recherche avec d'autres contenus :

```python
# In tool results
tool_result = [
    SearchResultBlockParam(
        type="search_result",
        source="https://docs.company.com/guide",
        title="User Guide",
        content=[TextBlockParam(type="text", text="Configuration details...")],
        citations={"enabled": True}
    ),
    TextBlockParam(
        type="text",
        text="Additional context: This applies to version 2.0 and later."
    )
]

# In top-level content
user_content = [
    SearchResultBlockParam(
        type="search_result",
        source="https://research.com/paper",
        title="Research Paper",
        content=[TextBlockParam(type="text", text="Key findings...")],
        citations={"enabled": True}
    ),
    {
        "type": "image",
        "source": {"type": "url", "url": "https://example.com/chart.png"}
    },
    TextBlockParam(
        type="text",
        text="How does the chart relate to the research findings?"
    )
]
```

### Contrôle du cache

Ajoutez le contrôle du cache pour une meilleure performance :

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "..."}],
  "cache_control": {
    "type": "ephemeral"
  }
}
```

### Contrôle des citations

Par défaut, les citations sont désactivées pour les résultats de recherche. Vous pouvez activer les citations en définissant explicitement la configuration `citations` :

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "Important documentation..."}],
  "citations": {
    "enabled": true  // Enable citations for this result
  }
}
```

Lorsque `citations.enabled` est défini sur `true`, Claude inclura des références de citation lors de l'utilisation d'informations provenant du résultat de recherche. Cela permet :
- Les citations naturelles pour vos applications RAG personnalisées
- L'attribution de source lors de l'interfaçage avec des bases de connaissances propriétaires
- Les citations de qualité web pour tout outil personnalisé qui retourne des résultats de recherche

Si le champ `citations` est omis, les citations sont désactivées par défaut.

<Warning>
Les citations sont tout ou rien : soit tous les résultats de recherche dans une requête doivent avoir les citations activées, soit tous doivent les avoir désactivées. Le mélange de résultats de recherche avec des paramètres de citation différents entraînera une erreur. Si vous avez besoin de désactiver les citations pour certaines sources, vous devez les désactiver pour tous les résultats de recherche dans cette requête.
</Warning>

## Meilleures pratiques

### Pour la recherche basée sur les outils (Méthode 1)

- **Contenu dynamique** : Utilisez pour les recherches en temps réel et les applications RAG dynamiques
- **Gestion des erreurs** : Retournez les messages appropriés lorsque les recherches échouent
- **Limites des résultats** : Retournez uniquement les résultats les plus pertinents pour éviter le débordement de contexte

### Pour la recherche de haut niveau (Méthode 2)

- **Contenu pré-récupéré** : Utilisez lorsque vous avez déjà des résultats de recherche
- **Traitement par lots** : Idéal pour traiter plusieurs résultats de recherche à la fois
- **Tests** : Excellent pour tester le comportement des citations avec du contenu connu

### Meilleures pratiques générales

1. **Structurez les résultats efficacement**
   - Utilisez des URL source claires et permanentes
   - Fournissez des titres descriptifs
   - Divisez le contenu long en blocs de texte logiques

2. **Maintenez la cohérence**
   - Utilisez des formats de source cohérents dans votre application
   - Assurez-vous que les titres reflètent avec précision le contenu
   - Gardez le formatage cohérent

3. **Gérez les erreurs avec élégance**
   ```python
   def search_with_fallback(query):
       try:
           results = perform_search(query)
           if not results:
               return {"type": "text", "text": "No results found."}
           return format_as_search_results(results)
       except Exception as e:
           return {"type": "text", "text": f"Search error: {str(e)}"}
   ```

## Limitations

- Les blocs de contenu de résultats de recherche sont disponibles sur Claude API, Amazon Bedrock et Google Cloud's Vertex AI
- Seul le contenu textuel est supporté dans les résultats de recherche (pas d'images ou d'autres médias)
- Le tableau `content` doit contenir au moins un bloc de texte