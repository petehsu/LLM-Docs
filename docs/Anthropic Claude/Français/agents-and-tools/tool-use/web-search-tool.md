# Outil de recherche web

L'outil de recherche web donne à Claude un accès direct au contenu web en temps réel, lui permettant de répondre aux questions avec des informations à jour au-delà de sa date limite de connaissances.

---

L'outil de recherche web donne à Claude un accès direct au contenu web en temps réel, lui permettant de répondre aux questions avec des informations à jour au-delà de sa date limite de connaissances. Claude cite automatiquement les sources des résultats de recherche dans sa réponse.

<Note>
Veuillez nous contacter via notre [formulaire de retours](https://forms.gle/sWjBtsrNEY2oKGuE8) pour partager votre expérience avec l'outil de recherche web.
</Note>

## Modèles pris en charge

La recherche web est disponible sur :

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([déprécié](/docs/fr/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Fonctionnement de la recherche web

Lorsque vous ajoutez l'outil de recherche web à votre requête API :

1. Claude décide quand effectuer une recherche en fonction de l'invite.
2. L'API exécute les recherches et fournit à Claude les résultats. Ce processus peut se répéter plusieurs fois au cours d'une seule requête.
3. À la fin de son tour, Claude fournit une réponse finale avec les sources citées.

## Comment utiliser la recherche web

<Note>
L'administrateur de votre organisation doit activer la recherche web dans la [Console](/settings/privacy).
</Note>

Fournissez l'outil de recherche web dans votre requête API :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in NYC?"
            }
        ],
        "tools": [{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "What's the weather in NYC?"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 5
    }]
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "What's the weather in NYC?"
      }
    ],
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 5
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### Définition de l'outil

L'outil de recherche web prend en charge les paramètres suivants :

```json JSON
{
  "type": "web_search_20250305",
  "name": "web_search",

  // Optionnel : Limiter le nombre de recherches par requête
  "max_uses": 5,

  // Optionnel : Inclure uniquement les résultats de ces domaines
  "allowed_domains": ["example.com", "trusteddomain.org"],

  // Optionnel : Ne jamais inclure les résultats de ces domaines
  "blocked_domains": ["untrustedsource.com"],

  // Optionnel : Localiser les résultats de recherche
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

#### Max uses

Le paramètre `max_uses` limite le nombre de recherches effectuées. Si Claude tente plus de recherches que autorisé, le `web_search_tool_result` sera une erreur avec le code d'erreur `max_uses_exceeded`.

#### Filtrage des domaines

Lors de l'utilisation des filtres de domaine :

- Les domaines ne doivent pas inclure le schéma HTTP/HTTPS (utilisez `example.com` au lieu de `https://example.com`)
- Les sous-domaines sont automatiquement inclus (`example.com` couvre `docs.example.com`)
- Les sous-domaines spécifiques limitent les résultats à ce sous-domaine uniquement (`docs.example.com` retourne uniquement les résultats de ce sous-domaine, pas de `example.com` ou `api.example.com`)
- Les sous-chemins sont pris en charge et correspondent à tout ce qui suit le chemin (`example.com/blog` correspond à `example.com/blog/post-1`)
- Vous pouvez utiliser soit `allowed_domains` soit `blocked_domains`, mais pas les deux dans la même requête.

**Support des caractères génériques :**

- Un seul caractère générique (`*`) est autorisé par entrée de domaine, et il doit apparaître après la partie domaine (dans le chemin)
- Valide : `example.com/*`, `example.com/*/articles`
- Invalide : `*.example.com`, `ex*.com`, `example.com/*/news/*`

Les formats de domaine invalides retourneront une erreur d'outil `invalid_tool_input`.

<Note>
Les restrictions de domaine au niveau de la requête doivent être compatibles avec les restrictions de domaine au niveau de l'organisation configurées dans la Console. Les domaines au niveau de la requête ne peuvent que restreindre davantage les domaines, pas contourner ou étendre au-delà de la liste au niveau de l'organisation. Si votre requête inclut des domaines qui entrent en conflit avec les paramètres de l'organisation, l'API retournera une erreur de validation.
</Note>

#### Localisation

Le paramètre `user_location` vous permet de localiser les résultats de recherche en fonction de la localisation d'un utilisateur.

- `type` : Le type de localisation (doit être `approximate`)
- `city` : Le nom de la ville
- `region` : La région ou l'état
- `country` : Le pays
- `timezone` : L'[ID de fuseau horaire IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

### Réponse

Voici un exemple de structure de réponse :

```json
{
  "role": "assistant",
  "content": [
    // 1. Décision de Claude de faire une recherche
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    // 2. La requête de recherche utilisée
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    // 3. Résultats de recherche
    {
      "type": "web_search_tool_result",
      "tool_use_id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "content": [
        {
          "type": "web_search_result",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_content": "EqgfCioIARgBIiQ3YTAwMjY1Mi1mZjM5LTQ1NGUtODgxNC1kNjNjNTk1ZWI3Y...",
          "page_age": "April 30, 2025"
        }
      ]
    },
    {
      "text": "Based on the search results, ",
      "type": "text"
    },
    // 4. Réponse de Claude avec citations
    {
      "text": "Claude Shannon was born on April 30, 1916, in Petoskey, Michigan",
      "type": "text",
      "citations": [
        {
          "type": "web_search_result_location",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_index": "Eo8BCioIAhgBIiQyYjQ0OWJmZi1lNm..",
          "cited_text": "Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, computer scientist, cryptographer and i..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 6039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_search_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Résultats de recherche

Les résultats de recherche incluent :

- `url` : L'URL de la page source
- `title` : Le titre de la page source
- `page_age` : Quand le site a été mis à jour pour la dernière fois
- `encrypted_content` : Contenu chiffré qui doit être renvoyé dans les conversations multi-tours pour les citations

#### Citations

Les citations sont toujours activées pour la recherche web, et chaque `web_search_result_location` inclut :

- `url` : L'URL de la source citée
- `title` : Le titre de la source citée
- `encrypted_index` : Une référence qui doit être renvoyée pour les conversations multi-tours.
- `cited_text` : Jusqu'à 150 caractères du contenu cité

Les champs de citation de recherche web `cited_text`, `title` et `url` ne comptent pas vers l'utilisation des jetons d'entrée ou de sortie.

<Note>
  Lors de l'affichage des résultats de l'API directement aux utilisateurs finaux, les citations doivent être incluses à la source originale. Si vous apportez des modifications aux résultats de l'API, notamment en les retraitant et/ou en les combinant avec votre propre matériel avant de les afficher aux utilisateurs finaux, affichez les citations de manière appropriée en consultation avec votre équipe juridique.
</Note>

#### Erreurs

Lorsque l'outil de recherche web rencontre une erreur (comme atteindre les limites de débit), l'API Claude retourne toujours une réponse 200 (succès). L'erreur est représentée dans le corps de la réponse en utilisant la structure suivante :

```json
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

Voici les codes d'erreur possibles :

- `too_many_requests` : Limite de débit dépassée
- `invalid_input` : Paramètre de requête de recherche invalide
- `max_uses_exceeded` : Nombre maximum d'utilisations de l'outil de recherche web dépassé
- `query_too_long` : La requête dépasse la longueur maximale
- `unavailable` : Une erreur interne s'est produite

#### Raison d'arrêt `pause_turn`

La réponse peut inclure une raison d'arrêt `pause_turn`, qui indique que l'API a mis en pause un tour de longue durée. Vous pouvez fournir la réponse telle quelle dans une requête ultérieure pour laisser Claude continuer son tour, ou modifier le contenu si vous souhaitez interrompre la conversation.

## Mise en cache des invites

La recherche web fonctionne avec la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching). Pour activer la mise en cache des invites, ajoutez au moins un point d'arrêt `cache_control` dans votre requête. Le système mettra automatiquement en cache jusqu'au dernier bloc `web_search_tool_result` lors de l'exécution de l'outil.

Pour les conversations multi-tours, définissez un point d'arrêt `cache_control` sur ou après le dernier bloc `web_search_tool_result` pour réutiliser le contenu mis en cache.

Par exemple, pour utiliser la mise en cache des invites avec la recherche web pour une conversation multi-tours :

<CodeGroup>
```python
import anthropic

client = anthropic.Anthropic()

# Première requête avec recherche web et point d'arrêt de cache
messages = [
    {
        "role": "user",
        "content": "What's the current weather in San Francisco today?"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)

# Ajouter la réponse de Claude à la conversation
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Deuxième requête avec point d'arrêt de cache après les résultats de recherche
messages.append({
    "role": "user",
    "content": "Should I expect rain later this week?",
    "cache_control": {"type": "ephemeral"}  # Mettre en cache jusqu'à ce point
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)
# La deuxième réponse bénéficiera des résultats de recherche mis en cache
# tout en étant capable d'effectuer de nouvelles recherches si nécessaire
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

</CodeGroup>

## Streaming

Avec le streaming activé, vous recevrez les événements de recherche dans le flux. Il y aura une pause pendant l'exécution de la recherche :

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Décision de Claude de faire une recherche

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_search"}}

// Requête de recherche en streaming
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"latest quantum computing breakthroughs 2025\"}"}}

// Pause pendant l'exécution de la recherche

// Résultats de recherche en streaming
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": [{"type": "web_search_result", "title": "Quantum Computing Breakthroughs in 2025", "url": "https://example.com"}]}}

// Réponse de Claude avec citations (omise dans cet exemple)
```

## Requêtes par lot

Vous pouvez inclure l'outil de recherche web dans l'[API Messages Batches](/docs/fr/build-with-claude/batch-processing). Les appels d'outil de recherche web via l'API Messages Batches sont facturés de la même manière que ceux dans les requêtes régulières de l'API Messages.

## Utilisation et tarification

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.