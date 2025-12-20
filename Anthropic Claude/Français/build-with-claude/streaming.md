# Messages en streaming

Apprenez à diffuser des réponses de messages de manière incrémentielle en utilisant les événements envoyés par le serveur (SSE).

---

Lors de la création d'un Message, vous pouvez définir `"stream": true` pour diffuser de manière incrémentielle la réponse en utilisant les [événements envoyés par le serveur](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents) (SSE).

## Streaming avec les SDK

Nos SDK [Python](https://github.com/anthropics/anthropic-sdk-python) et [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript) offrent plusieurs façons de faire du streaming. Le SDK Python permet les flux synchrones et asynchrones. Consultez la documentation de chaque SDK pour plus de détails.

<CodeGroup>
    ```python Python
    import anthropic

    client = anthropic.Anthropic()

    with client.messages.stream(
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}],
        model="claude-sonnet-4-5",
    ) as stream:
      for text in stream.text_stream:
          print(text, end="", flush=True)
    ```

    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const client = new Anthropic();

    await client.messages.stream({
        messages: [{role: 'user', content: "Hello"}],
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
    }).on('text', (text) => {
        console.log(text);
    });
    ```
</CodeGroup>

## Types d'événements

Chaque événement envoyé par le serveur inclut un type d'événement nommé et des données JSON associées. Chaque événement utilisera un nom d'événement SSE (par exemple `event: message_stop`), et inclura le `type` d'événement correspondant dans ses données.

Chaque flux utilise le flux d'événements suivant :

1. `message_start` : contient un objet `Message` avec un `content` vide.
2. Une série de blocs de contenu, chacun ayant un `content_block_start`, un ou plusieurs événements `content_block_delta`, et un événement `content_block_stop`. Chaque bloc de contenu aura un `index` qui correspond à son index dans le tableau `content` du Message final.
3. Un ou plusieurs événements `message_delta`, indiquant les changements de niveau supérieur à l'objet `Message` final.
4. Un événement final `message_stop`.

  <Warning>
  Les comptes de jetons affichés dans le champ `usage` de l'événement `message_delta` sont *cumulatifs*.
  </Warning>

### Événements ping

Les flux d'événements peuvent également inclure n'importe quel nombre d'événements `ping`.

### Événements d'erreur

Nous pouvons occasionnellement envoyer des [erreurs](/docs/fr/api/errors) dans le flux d'événements. Par exemple, pendant les périodes d'utilisation intensive, vous pourriez recevoir une `overloaded_error`, qui correspondrait normalement à un HTTP 529 dans un contexte non-streaming :

```json Exemple d'erreur
event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
```

### Autres événements

Conformément à notre [politique de versioning](/docs/fr/api/versioning), nous pouvons ajouter de nouveaux types d'événements, et votre code devrait gérer les types d'événements inconnus avec élégance.

## Types de delta de bloc de contenu

Chaque événement `content_block_delta` contient un `delta` d'un type qui met à jour le bloc `content` à un `index` donné.

### Delta de texte

Un delta de bloc de contenu `text` ressemble à :
```json Delta de texte
event: content_block_delta
data: {"type": "content_block_delta","index": 0,"delta": {"type": "text_delta", "text": "ello frien"}}
```

### Delta JSON d'entrée

Les deltas pour les blocs de contenu `tool_use` correspondent aux mises à jour pour le champ `input` du bloc. Pour supporter une granularité maximale, les deltas sont des _chaînes JSON partielles_, alors que le `tool_use.input` final est toujours un _objet_.

Vous pouvez accumuler les deltas de chaîne et analyser le JSON une fois que vous recevez un événement `content_block_stop`, en utilisant une bibliothèque comme [Pydantic](https://docs.pydantic.dev/latest/concepts/json/#partial-json-parsing) pour faire l'analyse JSON partielle, ou en utilisant nos [SDK](/docs/fr/api/client-sdks), qui fournissent des assistants pour accéder aux valeurs incrémentales analysées.

Un delta de bloc de contenu `tool_use` ressemble à :
```json Delta JSON d'entrée
event: content_block_delta
data: {"type": "content_block_delta","index": 1,"delta": {"type": "input_json_delta","partial_json": "{\"location\": \"San Fra"}}}
```
Note : Nos modèles actuels ne supportent que l'émission d'une clé et valeur complètes de `input` à la fois. Ainsi, lors de l'utilisation d'outils, il peut y avoir des délais entre les événements de streaming pendant que le modèle travaille. Une fois qu'une clé et valeur `input` sont accumulées, nous les émettons comme plusieurs événements `content_block_delta` avec du json partiel fragmenté afin que le format puisse automatiquement supporter une granularité plus fine dans les modèles futurs.

### Delta de réflexion

Lors de l'utilisation de la [réflexion étendue](/docs/fr/build-with-claude/extended-thinking#streaming-thinking) avec le streaming activé, vous recevrez le contenu de réflexion via les événements `thinking_delta`. Ces deltas correspondent au champ `thinking` des blocs de contenu `thinking`.

Pour le contenu de réflexion, un événement spécial `signature_delta` est envoyé juste avant l'événement `content_block_stop`. Cette signature est utilisée pour vérifier l'intégrité du bloc de réflexion.

Un delta de réflexion typique ressemble à :
```json Delta de réflexion
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}
```

Le delta de signature ressemble à :
```json Delta de signature
event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}
```

## Réponse complète de flux HTTP

Nous recommandons fortement d'utiliser nos [SDK clients](/docs/fr/api/client-sdks) lors de l'utilisation du mode streaming. Cependant, si vous construisez une intégration API directe, vous devrez gérer ces événements vous-même.

Une réponse de flux est composée de :
1. Un événement `message_start`
2. Potentiellement plusieurs blocs de contenu, chacun contenant :
    - Un événement `content_block_start`
    - Potentiellement plusieurs événements `content_block_delta`
    - Un événement `content_block_stop`
3. Un événement `message_delta`
4. Un événement `message_stop`

Il peut y avoir des événements `ping` dispersés dans la réponse également. Voir [Types d'événements](#event-types) pour plus de détails sur le format.

### Requête de streaming de base

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --data \
'{
  "model": "claude-sonnet-4-5",
  "messages": [{"role": "user", "content": "Hello"}],
  "max_tokens": 256,
  "stream": true
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    messages=[{"role": "user", "content": "Hello"}],
    max_tokens=256,
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5-20250929", "stop_reason": null, "stop_sequence": null, "usage": {"input_tokens": 25, "output_tokens": 1}}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence":null}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}

```

### Requête de streaming avec utilisation d'outil

<Tip>
L'utilisation d'outils supporte maintenant le streaming à granularité fine pour les valeurs de paramètres comme fonctionnalité bêta. Pour plus de détails, voir [Streaming d'outils à granularité fine](/docs/fr/agents-and-tools/tool-use/fine-grained-tool-streaming).
</Tip>

Dans cette requête, nous demandons à Claude d'utiliser un outil pour nous dire la météo.

<CodeGroup>
```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 1024,
      "tools": [
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "tool_choice": {"type": "any"},
      "messages": [
        {
          "role": "user",
          "content": "What is the weather like in San Francisco?"
        }
      ],
      "stream": true
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

tools = [
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, CA"
                }
            },
            "required": ["location"]
        }
    }
]

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    tool_choice={"type": "any"},
    messages=[
        {
            "role": "user",
            "content": "What is the weather like in San Francisco?"
        }
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_014p7gG3wDgGV9EUtLvnow3U","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","stop_sequence":null,"usage":{"input_tokens":472,"output_tokens":2},"content":[],"stop_reason":null}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Okay"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" let"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"'s"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" for"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" Francisco"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" CA"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":":"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_01T1x1fJ34qAmk2tNTrN7Up6","name":"get_weather","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"location\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" Francisc"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"o,"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" CA\""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":", "}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\"unit\": \"fah"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"renheit\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"tool_use","stop_sequence":null},"usage":{"output_tokens":89}}

event: message_stop
data: {"type":"message_stop"}
```

### Requête de streaming avec réflexion étendue

Dans cette requête, nous activons la réflexion étendue avec le streaming pour voir le raisonnement étape par étape de Claude.

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 20000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 16000
    },
    "messages": [
        {
            "role": "user",
            "content": "What is 27 * 453?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 16000
    },
    messages=[
        {
            "role": "user",
            "content": "What is 27 * 453?"
        }
    ],
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5-20250929", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n3. 27 * 400 = 10,800"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n4. 27 * 50 = 1,350"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n5. 27 * 3 = 81"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n6. 10,800 + 1,350 + 81 = 12,231"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

### Requête de streaming avec utilisation d'outil de recherche web

Dans cette requête, nous demandons à Claude de rechercher sur le web des informations météorologiques actuelles.

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "stream": true,
    "tools": [
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather like in New York City today?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What is the weather like in New York City today?"
        }
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```
</CodeGroup>

```json Response
event: message_start
data: {"type":"message_start","message":{"id":"msg_01G...","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":2679,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":3}}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"I'll check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the current weather in New York City for you"}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"."}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"server_tool_use","id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","name":"web_search","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"query"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" NY"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"C to"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"day\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1 }

event: content_block_start
data: {"type":"content_block_start","index":2,"content_block":{"type":"web_search_tool_result","tool_use_id":"srvtoolu_014hJH82Qum7Td6UV8gDXThB","content":[{"type":"web_search_result","title":"Weather in New York City in May 2025 (New York) - detailed Weather Forecast for a month","url":"https://world-weather.info/forecast/usa/new_york/may-2025/","encrypted_content":"Ev0DCioIAxgCIiQ3NmU4ZmI4OC1k...","page_age":null},...]}}

event: content_block_stop
data: {"type":"content_block_stop","index":2}

event: content_block_start
data: {"type":"content_block_start","index":3,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"Here's the current weather information for New York"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" City:\n\n# Weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":" in New York City"}}

event: content_block_delta
data: {"type":"content_block_delta","index":3,"delta":{"type":"text_delta","text":"\n\n"}}

...

event: content_block_stop
data: {"type":"content_block_stop","index":17}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"input_tokens":10682,"cache_creation_input_tokens":0,"cache_read_input_tokens":0,"output_tokens":510,"server_tool_use":{"web_search_requests":1}}}

event: message_stop
data: {"type":"message_stop"}
```

## Récupération d'erreur

Lorsqu'une requête de streaming est interrompue en raison de problèmes de réseau, de timeouts, ou d'autres erreurs, vous pouvez récupérer en reprenant là où le flux a été interrompu. Cette approche vous évite de retraiter toute la réponse.

La stratégie de récupération de base implique :

1. **Capturer la réponse partielle** : Sauvegarder tout le contenu qui a été reçu avec succès avant que l'erreur ne se produise
2. **Construire une requête de continuation** : Créer une nouvelle requête API qui inclut la réponse partielle de l'assistant comme début d'un nouveau message d'assistant
3. **Reprendre le streaming** : Continuer à recevoir le reste de la réponse là où elle a été interrompue

### Meilleures pratiques de récupération d'erreur

1. **Utiliser les fonctionnalités du SDK** : Tirer parti des capacités d'accumulation de messages et de gestion d'erreurs intégrées du SDK
2. **Gérer les types de contenu** : Être conscient que les messages peuvent contenir plusieurs blocs de contenu (`text`, `tool_use`, `thinking`). Les blocs d'utilisation d'outils et de réflexion étendue ne peuvent pas être partiellement récupérés. Vous pouvez reprendre le streaming à partir du bloc de texte le plus récent.