# Outil de récupération web

L'outil de récupération web permet à Claude de récupérer le contenu complet de pages web et de documents PDF spécifiés.

---

L'outil de récupération web permet à Claude de récupérer le contenu complet de pages web et de documents PDF spécifiés.

<Note>
L'outil de récupération web est actuellement en version bêta. Pour l'activer, utilisez l'en-tête bêta `web-fetch-2025-09-10` dans vos demandes d'API.

Veuillez utiliser [ce formulaire](https://forms.gle/NhWcgmkcvPCMmPE86) pour fournir des commentaires sur la qualité des réponses du modèle, l'API elle-même ou la qualité de la documentation.
</Note>

<Warning>
L'activation de l'outil de récupération web dans des environnements où Claude traite des entrées non fiables aux côtés de données sensibles pose des risques d'exfiltration de données. Nous recommandons d'utiliser cet outil uniquement dans des environnements de confiance ou lors du traitement de données non sensibles.

Pour minimiser les risques d'exfiltration, Claude n'est pas autorisé à construire dynamiquement des URL. Claude ne peut récupérer que les URL qui ont été explicitement fournies par l'utilisateur ou qui proviennent de résultats de recherche web ou de récupération web précédents. Cependant, il existe toujours un risque résiduel qui doit être soigneusement considéré lors de l'utilisation de cet outil.

Si l'exfiltration de données est une préoccupation, envisagez :
- Désactiver complètement l'outil de récupération web
- Utiliser le paramètre `max_uses` pour limiter le nombre de demandes
- Utiliser le paramètre `allowed_domains` pour restreindre à des domaines connus et sûrs
</Warning>

## Modèles supportés

La récupération web est disponible sur :

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([déprécié](/docs/fr/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Fonctionnement de la récupération web

Lorsque vous ajoutez l'outil de récupération web à votre demande d'API :

1. Claude décide quand récupérer le contenu en fonction de l'invite et des URL disponibles.
2. L'API récupère le contenu texte complet de l'URL spécifiée.
3. Pour les PDF, l'extraction de texte automatique est effectuée.
4. Claude analyse le contenu récupéré et fournit une réponse avec des citations optionnelles.

<Note>
L'outil de récupération web ne supporte actuellement pas les sites web rendus dynamiquement via Javascript.
</Note>

## Comment utiliser la récupération web

Fournissez l'outil de récupération web dans votre demande d'API :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: web-fetch-2025-09-10" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "Please analyze the content at https://example.com/article"
            }
        ],
        "tools": [{
            "type": "web_fetch_20250910",
            "name": "web_fetch",
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
            "content": "Please analyze the content at https://example.com/article"
        }
    ],
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch",
        "max_uses": 5
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
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
        content: "Please analyze the content at https://example.com/article"
      }
    ],
    tools: [{
      type: "web_fetch_20250910",
      name: "web_fetch",
      max_uses: 5
    }],
    headers: {
      "anthropic-beta": "web-fetch-2025-09-10"
    }
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### Définition de l'outil

L'outil de récupération web supporte les paramètres suivants :

```json JSON
{
  "type": "web_fetch_20250910",
  "name": "web_fetch",

  // Optionnel : Limiter le nombre de récupérations par demande
  "max_uses": 10,

  // Optionnel : Récupérer uniquement à partir de ces domaines
  "allowed_domains": ["example.com", "docs.example.com"],

  // Optionnel : Ne jamais récupérer à partir de ces domaines
  "blocked_domains": ["private.example.com"],

  // Optionnel : Activer les citations pour le contenu récupéré
  "citations": {
    "enabled": true
  },

  // Optionnel : Longueur maximale du contenu en jetons
  "max_content_tokens": 100000
}
```

#### Utilisations maximales

Le paramètre `max_uses` limite le nombre de récupérations web effectuées. Si Claude tente plus de récupérations que permis, le `web_fetch_tool_result` sera une erreur avec le code d'erreur `max_uses_exceeded`. Il n'y a actuellement pas de limite par défaut.

#### Filtrage des domaines

Lors de l'utilisation de filtres de domaine :

- Les domaines ne doivent pas inclure le schéma HTTP/HTTPS (utilisez `example.com` au lieu de `https://example.com`)
- Les sous-domaines sont automatiquement inclus (`example.com` couvre `docs.example.com`)
- Les sous-chemins sont supportés (`example.com/blog`)
- Vous pouvez utiliser soit `allowed_domains` soit `blocked_domains`, mais pas les deux dans la même demande.

<Warning>
Soyez conscient que les caractères Unicode dans les noms de domaine peuvent créer des vulnérabilités de sécurité par le biais d'attaques par homographie, où des caractères visuellement similaires provenant de différents scripts peuvent contourner les filtres de domaine. Par exemple, `аmazon.com` (utilisant le caractère cyrillique 'а') peut sembler identique à `amazon.com` mais représente un domaine différent.

Lors de la configuration des listes d'autorisation/blocage de domaines :
- Utilisez des noms de domaine ASCII uniquement si possible
- Considérez que les analyseurs d'URL peuvent gérer la normalisation Unicode différemment
- Testez vos filtres de domaine avec des variations d'homographie potentielles
- Auditez régulièrement vos configurations de domaine pour les caractères Unicode suspects
</Warning>

#### Limites de contenu

Le paramètre `max_content_tokens` limite la quantité de contenu qui sera incluse dans le contexte. Si le contenu récupéré dépasse cette limite, il sera tronqué. Cela aide à contrôler l'utilisation des jetons lors de la récupération de documents volumineux.

<Note>
La limite du paramètre `max_content_tokens` est approximative. Le nombre réel de jetons d'entrée utilisés peut varier légèrement.
</Note>

#### Citations

Contrairement à la recherche web où les citations sont toujours activées, les citations sont optionnelles pour la récupération web. Définissez `"citations": {"enabled": true}` pour permettre à Claude de citer des passages spécifiques des documents récupérés.

<Note>
Lors de l'affichage des sorties d'API directement aux utilisateurs finaux, les citations doivent être incluses à la source originale. Si vous apportez des modifications aux sorties d'API, y compris par retraitement et/ou combinaison avec votre propre matériel avant de les afficher aux utilisateurs finaux, affichez les citations selon le cas en consultation avec votre équipe juridique.
</Note>

### Réponse

Voici un exemple de structure de réponse :

```json
{
  "role": "assistant",
  "content": [
    // 1. Décision de Claude de récupérer
    {
      "type": "text",
      "text": "I'll fetch the content from the article to analyze it."
    },
    // 2. La demande de récupération
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01234567890abcdef",
      "name": "web_fetch",
      "input": {
        "url": "https://example.com/article"
      }
    },
    // 3. Résultats de la récupération
    {
      "type": "web_fetch_tool_result",
      "tool_use_id": "srvtoolu_01234567890abcdef",
      "content": {
        "type": "web_fetch_result",
        "url": "https://example.com/article",
        "content": {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "Full text content of the article..."
          },
          "title": "Article Title",
          "citations": {"enabled": true}
        },
        "retrieved_at": "2025-08-25T10:30:00Z"
      }
    },
    // 4. Analyse de Claude avec citations (si activées)
    {
      "text": "Based on the article, ",
      "type": "text"
    },
    {
      "text": "the main argument presented is that artificial intelligence will transform healthcare",
      "type": "text",
      "citations": [
        {
          "type": "char_location",
          "document_index": 0,
          "document_title": "Article Title",
          "start_char_index": 1234,
          "end_char_index": 1456,
          "cited_text": "Artificial intelligence is poised to revolutionize healthcare delivery..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 25039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_fetch_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Résultats de la récupération

Les résultats de la récupération incluent :

- `url` : L'URL qui a été récupérée
- `content` : Un bloc de document contenant le contenu récupéré
- `retrieved_at` : Horodatage du moment où le contenu a été récupéré

<Note>
L'outil de récupération web met en cache les résultats pour améliorer les performances et réduire les demandes redondantes. Cela signifie que le contenu retourné peut ne pas toujours être la version la plus récente disponible à l'URL. Le comportement du cache est géré automatiquement et peut changer au fil du temps pour optimiser différents types de contenu et modèles d'utilisation.
</Note>

Pour les documents PDF, le contenu sera retourné en tant que données codées en base64 :

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_02",
  "content": {
    "type": "web_fetch_result",
    "url": "https://example.com/paper.pdf",
    "content": {
      "type": "document",
      "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmo..."
      },
      "citations": {"enabled": true}
    },
    "retrieved_at": "2025-08-25T10:30:02Z"
  }
}
```

#### Erreurs

Lorsque l'outil de récupération web rencontre une erreur, l'API Claude retourne une réponse 200 (succès) avec l'erreur représentée dans le corps de la réponse :

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_a93jad",
  "content": {
    "type": "web_fetch_tool_error",
    "error_code": "url_not_accessible"
  }
}
```

Voici les codes d'erreur possibles :

- `invalid_input` : Format d'URL invalide
- `url_too_long` : L'URL dépasse la longueur maximale (250 caractères)
- `url_not_allowed` : URL bloquée par les règles de filtrage des domaines et les restrictions du modèle
- `url_not_accessible` : Échec de la récupération du contenu (erreur HTTP)
- `too_many_requests` : Limite de débit dépassée
- `unsupported_content_type` : Type de contenu non supporté (texte et PDF uniquement)
- `max_uses_exceeded` : Utilisations maximales de l'outil de récupération web dépassées
- `unavailable` : Une erreur interne s'est produite

## Validation des URL

Pour des raisons de sécurité, l'outil de récupération web ne peut récupérer que les URL qui ont précédemment apparu dans le contexte de la conversation. Cela inclut :

- Les URL dans les messages utilisateur
- Les URL dans les résultats d'outils côté client
- Les URL provenant de résultats de recherche web ou de récupération web précédents

L'outil ne peut pas récupérer les URL arbitraires que Claude génère ou les URL provenant d'outils serveur basés sur des conteneurs (Exécution de code, Bash, etc.).

## Recherche et récupération combinées

La récupération web fonctionne de manière transparente avec la recherche web pour une collecte d'informations complète :

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Find recent articles about quantum computing and analyze the most relevant one in detail"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        },
        {
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5,
            "citations": {"enabled": True}
        }
    ],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
```

Dans ce flux de travail, Claude va :
1. Utiliser la recherche web pour trouver des articles pertinents
2. Sélectionner les résultats les plus prometteurs
3. Utiliser la récupération web pour récupérer le contenu complet
4. Fournir une analyse détaillée avec des citations

## Mise en cache des invites

La récupération web fonctionne avec la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching). Pour activer la mise en cache des invites, ajoutez des points d'arrêt `cache_control` dans votre demande. Les résultats de récupération mis en cache peuvent être réutilisés entre les tours de conversation.

```python
import anthropic

client = anthropic.Anthropic()

# Première demande avec récupération web
messages = [
    {
        "role": "user",
        "content": "Analyze this research paper: https://arxiv.org/abs/2024.12345"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# Ajouter la réponse de Claude à la conversation
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Deuxième demande avec point d'arrêt du cache
messages.append({
    "role": "user",
    "content": "What methodology does the paper use?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# La deuxième réponse bénéficie des résultats de récupération mis en cache
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

## Diffusion en continu

Avec la diffusion en continu activée, les événements de récupération font partie du flux avec une pause lors de la récupération du contenu :

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Décision de Claude de récupérer

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_fetch"}}

// URL de récupération diffusée en continu
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"url\":\"https://example.com/article\"}"}}

// Pause pendant l'exécution de la récupération

// Résultats de la récupération diffusés en continu
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_fetch_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "web_fetch_result", "url": "https://example.com/article", "content": {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "Article content..."}}}}}

// La réponse de Claude continue...
```

## Demandes par lot

Vous pouvez inclure l'outil de récupération web dans l'[API Messages Batches](/docs/fr/build-with-claude/batch-processing). Les appels d'outil de récupération web via l'API Messages Batches sont facturés de la même manière que ceux dans les demandes d'API Messages régulières.

## Utilisation et tarification

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens