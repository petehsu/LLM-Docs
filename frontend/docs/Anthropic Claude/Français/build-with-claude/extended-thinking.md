# Construire avec la réflexion étendue

La réflexion étendue donne à Claude des capacités de raisonnement améliorées pour les tâches complexes, tout en fournissant différents niveaux de transparence dans son processus de réflexion étape par étape avant de livrer sa réponse finale.

---

La réflexion étendue donne à Claude des capacités de raisonnement améliorées pour les tâches complexes, tout en fournissant différents niveaux de transparence dans son processus de réflexion étape par étape avant de livrer sa réponse finale.

## Modèles pris en charge

La réflexion étendue est prise en charge dans les modèles suivants :

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([déprécié](/docs/fr/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
Le comportement de l'API diffère entre les modèles Claude Sonnet 3.7 et Claude 4, mais les formes d'API restent exactement les mêmes.

Pour plus d'informations, consultez [Différences de réflexion entre les versions de modèles](#differences-in-thinking-across-model-versions).
</Note>

## Comment fonctionne la réflexion étendue

Lorsque la réflexion étendue est activée, Claude crée des blocs de contenu `thinking` où il produit son raisonnement interne. Claude intègre les idées de ce raisonnement avant de formuler une réponse finale.

La réponse de l'API inclura des blocs de contenu `thinking`, suivis de blocs de contenu `text`.

Voici un exemple du format de réponse par défaut :

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

Pour plus d'informations sur le format de réponse de la réflexion étendue, consultez la [Référence de l'API Messages](/docs/fr/api/messages).

## Comment utiliser la réflexion étendue

Voici un exemple d'utilisation de la réflexion étendue dans l'API Messages :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
    },
    "messages": [
        {
            "role": "user",
            "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
        }
    ]
}'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "Are there an infinite number of prime numbers such that n mod 4 == 3?"
    }]
)

# The response will contain summarized thinking blocks and text blocks
for block in response.content:
    if block.type == "thinking":
        print(f"\nThinking summary: {block.thinking}")
    elif block.type == "text":
        print(f"\nResponse: {block.text}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "Are there an infinite number of prime numbers such that n mod 4 == 3?"
  }]
});

// The response will contain summarized thinking blocks and text blocks
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\nThinking summary: ${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\nResponse: ${block.text}`);
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.*;

public class SimpleThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("Are there an infinite number of prime numbers such that n mod 4 == 3?")
                        .build()
        );

        System.out.println(response);
    }
}
```

</CodeGroup>

Pour activer la réflexion étendue, ajoutez un objet `thinking`, avec le paramètre `type` défini sur `enabled` et `budget_tokens` défini sur un budget de jetons spécifié pour la réflexion étendue.

Le paramètre `budget_tokens` détermine le nombre maximal de jetons que Claude est autorisé à utiliser pour son processus de raisonnement interne. Dans les modèles Claude 4, cette limite s'applique aux jetons de réflexion complète, et non à [la sortie résumée](#summarized-thinking). Des budgets plus importants peuvent améliorer la qualité des réponses en permettant une analyse plus approfondie pour les problèmes complexes, bien que Claude n'utilise pas nécessairement l'intégralité du budget alloué, en particulier pour les plages supérieures à 32k.

`budget_tokens` doit être défini sur une valeur inférieure à `max_tokens`. Cependant, lors de l'utilisation de [la réflexion entrelacée avec des outils](#interleaved-thinking), vous pouvez dépasser cette limite car la limite de jetons devient votre fenêtre de contexte entière (200k jetons).

### Réflexion résumée

Avec la réflexion étendue activée, l'API Messages pour les modèles Claude 4 retourne un résumé du processus de réflexion complet de Claude. La réflexion résumée fournit tous les avantages en termes d'intelligence de la réflexion étendue, tout en prévenant les abus.

Voici quelques considérations importantes pour la réflexion résumée :

- Vous êtes facturé pour les jetons de réflexion complets générés par la demande originale, pas les jetons de résumé.
- Le nombre de jetons de sortie facturés **ne correspondra pas** au nombre de jetons que vous voyez dans la réponse.
- Les premières lignes de la sortie de réflexion sont plus détaillées, fournissant un raisonnement détaillé qui est particulièrement utile à des fins d'ingénierie des invites.
- Alors qu'Anthropic cherche à améliorer la fonctionnalité de réflexion étendue, le comportement de résumé est sujet à changement.
- La résumé préserve les idées clés du processus de réflexion de Claude avec une latence minimale ajoutée, permettant une expérience utilisateur en continu et une migration facile de Claude Sonnet 3.7 vers les modèles Claude 4.
- La résumé est traitée par un modèle différent de celui que vous ciblez dans vos demandes. Le modèle de réflexion ne voit pas la sortie résumée.

<Note>
Claude Sonnet 3.7 continue de retourner la sortie de réflexion complète.

Dans les rares cas où vous avez besoin d'accès à la sortie de réflexion complète pour les modèles Claude 4, [contactez notre équipe commerciale](mailto:sales@anthropic.com).
</Note>

### Réflexion en continu

Vous pouvez diffuser les réponses de réflexion étendue en utilisant [les événements envoyés par le serveur (SSE)](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents).

Lorsque la diffusion en continu est activée pour la réflexion étendue, vous recevez le contenu de réflexion via les événements `thinking_delta`.

Pour plus de documentation sur la diffusion en continu via l'API Messages, consultez [Messages en continu](/docs/fr/build-with-claude/streaming).

Voici comment gérer la diffusion en continu avec la réflexion :

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 16000,
    "stream": true,
    "thinking": {
        "type": "enabled",
        "budget_tokens": 10000
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
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 10000},
    messages=[{"role": "user", "content": "What is 27 * 453?"}],
) as stream:
    thinking_started = False
    response_started = False

    for event in stream:
        if event.type == "content_block_start":
            print(f"\nStarting {event.content_block.type} block...")
            # Reset flags for each new block
            thinking_started = False
            response_started = False
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                if not thinking_started:
                    print("Thinking: ", end="", flush=True)
                    thinking_started = True
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                if not response_started:
                    print("Response: ", end="", flush=True)
                    response_started = True
                print(event.delta.text, end="", flush=True)
        elif event.type == "content_block_stop":
            print("\nBlock complete.")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const stream = await client.messages.stream({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "What is 27 * 453?"
  }]
});

let thinkingStarted = false;
let responseStarted = false;

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    console.log(`\nStarting ${event.content_block.type} block...`);
    // Reset flags for each new block
    thinkingStarted = false;
    responseStarted = false;
  } else if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      if (!thinkingStarted) {
        process.stdout.write('Thinking: ');
        thinkingStarted = true;
      }
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === 'text_delta') {
      if (!responseStarted) {
        process.stdout.write('Response: ');
        responseStarted = true;
      }
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === 'content_block_stop') {
    console.log('\nBlock complete.');
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaRawMessageStreamEvent;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class SimpleThinkingStreamingExample {
    private static boolean thinkingStarted = false;
    private static boolean responseStarted = false;
    
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams createParams = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_0)
                .maxTokens(16000)
                .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                .addUserMessage("What is 27 * 453?")
                .build();

        try (StreamResponse<BetaRawMessageStreamEvent> streamResponse =
                     client.beta().messages().createStreaming(createParams)) {
            streamResponse.stream()
                    .forEach(event -> {
                        if (event.isContentBlockStart()) {
                            System.out.printf("\nStarting %s block...%n",
                                    event.asContentBlockStart()._type());
                            // Reset flags for each new block
                            thinkingStarted = false;
                            responseStarted = false;
                        } else if (event.isContentBlockDelta()) {
                            var delta = event.asContentBlockDelta().delta();
                            if (delta.isBetaThinking()) {
                                if (!thinkingStarted) {
                                    System.out.print("Thinking: ");
                                    thinkingStarted = true;
                                }
                                System.out.print(delta.asBetaThinking().thinking());
                                System.out.flush();
                            } else if (delta.isBetaText()) {
                                if (!responseStarted) {
                                    System.out.print("Response: ");
                                    responseStarted = true;
                                }
                                System.out.print(delta.asBetaText().text());
                                System.out.flush();
                            }
                        } else if (event.isContentBlockStop()) {
                            System.out.println("\nBlock complete.");
                        }
                    });
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton userPrompt="What is 27 * 453?" thinkingBudgetTokens={16000}>
  Essayer dans la console
</TryInConsoleButton>

Exemple de sortie en continu :
```json
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "Let me solve this step by step:\n\n1. First break down 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

// Additional thinking deltas...

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

// Additional text deltas...

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

<Note>
Lors de l'utilisation de la diffusion en continu avec la réflexion activée, vous remarquerez peut-être que le texte arrive parfois en blocs plus importants alternant avec une livraison plus petite, jeton par jeton. C'est un comportement attendu, en particulier pour le contenu de réflexion.

Le système de diffusion en continu doit traiter le contenu par lots pour des performances optimales, ce qui peut entraîner ce modèle de livraison « fragmentée », avec des délais possibles entre les événements de diffusion en continu. Nous travaillons continuellement à l'amélioration de cette expérience, les mises à jour futures se concentrant sur la diffusion en continu plus fluide du contenu de réflexion.
</Note>

## Réflexion étendue avec utilisation d'outils

La réflexion étendue peut être utilisée aux côtés de [l'utilisation d'outils](/docs/fr/agents-and-tools/tool-use/overview), permettant à Claude de raisonner sur la sélection des outils et le traitement des résultats.

Lors de l'utilisation de la réflexion étendue avec l'utilisation d'outils, soyez conscient des limitations suivantes :

1. **Limitation du choix d'outil** : L'utilisation d'outils avec réflexion ne prend en charge que `tool_choice: {"type": "auto"}` (par défaut) ou `tool_choice: {"type": "none"}`. L'utilisation de `tool_choice: {"type": "any"}` ou `tool_choice: {"type": "tool", "name": "..."}` entraînera une erreur car ces options forcent l'utilisation d'outils, ce qui est incompatible avec la réflexion étendue.

2. **Préservation des blocs de réflexion** : Lors de l'utilisation d'outils, vous devez repasser les blocs `thinking` à l'API pour le dernier message de l'assistant. Incluez le bloc complet non modifié à l'API pour maintenir la continuité du raisonnement.

### Basculer les modes de réflexion dans les conversations

Vous ne pouvez pas basculer la réflexion au milieu d'un tour d'assistant, y compris pendant les boucles d'utilisation d'outils. Le tour d'assistant entier doit fonctionner dans un seul mode de réflexion :

- **Si la réflexion est activée**, le tour d'assistant final doit commencer par un bloc de réflexion.
- **Si la réflexion est désactivée**, le tour d'assistant final ne doit contenir aucun bloc de réflexion

Du point de vue du modèle, **les boucles d'utilisation d'outils font partie du tour d'assistant**. Un tour d'assistant ne se termine pas jusqu'à ce que Claude termine sa réponse complète, qui peut inclure plusieurs appels d'outils et résultats.

Par exemple, cette séquence fait partie d'un **seul tour d'assistant** :
```
User: "What's the weather in Paris?"
Assistant: [thinking] + [tool_use: get_weather]
User: [tool_result: "20°C, sunny"]
Assistant: [text: "The weather in Paris is 20°C and sunny"]
```

Bien qu'il y ait plusieurs messages d'API, la boucle d'utilisation d'outils fait conceptuellement partie d'une réponse d'assistant continue.

#### Scénarios d'erreur courants

Vous pourriez rencontrer cette erreur :
```
Expected `thinking` or `redacted_thinking`, but found `tool_use`.
When `thinking` is enabled, a final `assistant` message must start
with a thinking block (preceding the lastmost set of `tool_use` and
`tool_result` blocks).
```

Cela se produit généralement lorsque :
1. Vous aviez la réflexion **désactivée** pendant une séquence d'utilisation d'outils
2. Vous voulez activer la réflexion à nouveau
3. Votre dernier message d'assistant contient des blocs d'utilisation d'outils mais pas de bloc de réflexion

#### Conseils pratiques

**✗ Invalide : Basculer la réflexion immédiatement après l'utilisation d'outils**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
// Cannot enable thinking here - still in the same assistant turn
```

**✓ Valide : Terminer le tour d'assistant en premier**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
Assistant: [text: "It's sunny"] 
User: "What about tomorrow?" (thinking disabled)
Assistant: [thinking] + [text: "..."] (thinking enabled - new turn)
```

**Meilleure pratique** : Planifiez votre stratégie de réflexion au début de chaque tour plutôt que d'essayer de basculer en milieu de tour.

<Note>
Le basculement des modes de réflexion invalide également la mise en cache des invites pour l'historique des messages. Pour plus de détails, consultez la section [Réflexion étendue avec mise en cache des invites](#extended-thinking-with-prompt-caching).
</Note>

<section title="Exemple : Passage des blocs de réflexion avec les résultats des outils">

Voici un exemple pratique montrant comment préserver les blocs de réflexion lors de la fourniture de résultats d'outils :

<CodeGroup>
```python Python
weather_tool = {
    "name": "get_weather",
    "description": "Get current weather for a location",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}

# First request - Claude responds with thinking and tool request
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"}
    ]
)
```

```typescript TypeScript
const weatherTool = {
  name: "get_weather",
  description: "Get current weather for a location",
  input_schema: {
    type: "object",
    properties: {
      location: { type: "string" }
    },
    required: ["location"]
  }
};

// First request - Claude responds with thinking and tool request
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "What's the weather in Paris?" }
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaTool;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingWithToolsExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Get current weather for a location")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("What's the weather in Paris?")
                        .build()
        );

        System.out.println(response);
    }
}
```
</CodeGroup>

La réponse de l'API inclura les blocs de réflexion, de texte et d'utilisation d'outils :

```json
{
    "content": [
        {
            "type": "thinking",
            "thinking": "The user wants to know the current weather in Paris. I have access to a function `get_weather`...",
            "signature": "BDaL4VrbR2Oj0hO4XpJxT28J5TILnCrrUXoKiiNBZW9P+nr8XSj1zuZzAl4egiCCpQNvfyUuFFJP5CncdYZEQPPmLxYsNrcs...."
        },
        {
            "type": "text",
            "text": "I can help you get the current weather information for Paris. Let me check that for you"
        },
        {
            "type": "tool_use",
            "id": "toolu_01CswdEQBMshySk6Y9DFKrfq",
            "name": "get_weather",
            "input": {
                "location": "Paris"
            }
        }
    ]
}
```

Continuons maintenant la conversation et utilisons l'outil

<CodeGroup>
```python Python
# Extract thinking block and tool use block
thinking_block = next((block for block in response.content
                      if block.type == 'thinking'), None)
tool_use_block = next((block for block in response.content
                      if block.type == 'tool_use'), None)

# Call your actual weather API, here is where your actual API call would go
# let's pretend this is what we get back
weather_data = {"temperature": 88}

# Second request - Include thinking block and tool result
# No new thinking blocks will be generated in the response
continuation = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "What's the weather in Paris?"},
        # notice that the thinking_block is passed in as well as the tool_use_block
        # if this is not passed in, an error is raised
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {"role": "user", "content": [{
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,
            "content": f"Current temperature: {weather_data['temperature']}°F"
        }]}
    ]
)
```

```typescript TypeScript
// Extract thinking block and tool use block
const thinkingBlock = response.content.find(block =>
  block.type === 'thinking');
const toolUseBlock = response.content.find(block =>
  block.type === 'tool_use');

// Call your actual weather API, here is where your actual API call would go
// let's pretend this is what we get back
const weatherData = { temperature: 88 };

// Second request - Include thinking block and tool result
// No new thinking blocks will be generated in the response
const continuation = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "What's the weather in Paris?" },
    // notice that the thinkingBlock is passed in as well as the toolUseBlock
    // if this is not passed in, an error is raised
    { role: "assistant", content: [thinkingBlock, toolUseBlock] },
    { role: "user", content: [{
      type: "tool_result",
      tool_use_id: toolUseBlock.id,
      content: `Current temperature: ${weatherData.temperature}°F`
    }]}
  ]
});
```

```java Java
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.BetaTool.InputSchema;
import com.anthropic.models.messages.Model;

public class ThinkingToolsResultExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of("type", "string")
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        BetaTool weatherTool = BetaTool.builder()
                .name("get_weather")
                .description("Get current weather for a location")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("What's the weather in Paris?")
                        .build()
        );

        // Extract thinking block and tool use block
        Optional<BetaThinkingBlock> thinkingBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isThinking)
                .map(BetaContentBlock::asThinking)
                .findFirst();

        Optional<BetaToolUseBlock> toolUseBlockOpt = response.content().stream()
                .filter(BetaContentBlock::isToolUse)
                .map(BetaContentBlock::asToolUse)
                .findFirst();

        if (thinkingBlockOpt.isPresent() && toolUseBlockOpt.isPresent()) {
            BetaThinkingBlock thinkingBlock = thinkingBlockOpt.get();
            BetaToolUseBlock toolUseBlock = toolUseBlockOpt.get();

            // Call your actual weather API, here is where your actual API call would go
            // let's pretend this is what we get back
            Map<String, Object> weatherData = Map.of("temperature", 88);

            // Second request - Include thinking block and tool result
            // No new thinking blocks will be generated in the response
            BetaMessage continuation = client.beta().messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_OPUS_4_0)
                            .maxTokens(16000)
                            .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                            .addTool(weatherTool)
                            .addUserMessage("What's the weather in Paris?")
                            .addAssistantMessageOfBetaContentBlockParams(
                                    // notice that the thinkingBlock is passed in as well as the toolUseBlock
                                    // if this is not passed in, an error is raised
                                    List.of(
                                            BetaContentBlockParam.ofThinking(thinkingBlock.toParam()),
                                            BetaContentBlockParam.ofToolUse(toolUseBlock.toParam())
                                    )
                            )
                            .addUserMessageOfBetaContentBlockParams(List.of(
                                    BetaContentBlockParam.ofToolResult(
                                            BetaToolResultBlockParam.builder()
                                                    .toolUseId(toolUseBlock.id())
                                                    .content(String.format("Current temperature: %d°F", (Integer)weatherData.get("temperature")))
                                                    .build()
                                    )
                            ))
                            .build()
            );

            System.out.println(continuation);
        }
    }
}
```
</CodeGroup>

La réponse de l'API inclura maintenant **uniquement** du texte

```json
{
    "content": [
        {
            "type": "text",
            "text": "Currently in Paris, the temperature is 88°F (31°C)"
        }
    ]
}
```

</section>

### Préservation des blocs de réflexion

Lors de l'utilisation d'outils, vous devez repasser les blocs `thinking` à l'API, et vous devez inclure le bloc complet non modifié à l'API. Ceci est critique pour maintenir le flux de raisonnement du modèle et l'intégrité de la conversation.

<Tip>
Bien que vous puissiez omettre les blocs `thinking` des tours d'`assistant` précédents, nous suggérons de toujours repasser tous les blocs de réflexion à l'API pour toute conversation multi-tours. L'API va :
- Filtrer automatiquement les blocs de réflexion fournis
- Utiliser les blocs de réflexion pertinents nécessaires pour préserver le raisonnement du modèle
- Facturer uniquement les jetons d'entrée pour les blocs affichés à Claude
</Tip>

<Note>
Lors du basculement des modes de réflexion pendant une conversation, rappelez-vous que le tour d'assistant entier (y compris les boucles d'utilisation d'outils) doit fonctionner dans un seul mode de réflexion. Pour plus de détails, consultez [Basculer les modes de réflexion dans les conversations](#toggling-thinking-modes-in-conversations).
</Note>

Lorsque Claude invoque des outils, il met en pause la construction d'une réponse pour attendre des informations externes. Lorsque les résultats des outils sont retournés, Claude continuera à construire cette réponse existante. Cela nécessite de préserver les blocs de réflexion lors de l'utilisation d'outils, pour quelques raisons :

1. **Continuité du raisonnement** : Les blocs de réflexion capturent le raisonnement étape par étape de Claude qui a conduit aux demandes d'outils. Lorsque vous publiez les résultats des outils, inclure la réflexion originale garantit que Claude peut continuer son raisonnement à partir de là où il s'était arrêté.

2. **Maintenance du contexte** : Bien que les résultats des outils apparaissent comme des messages utilisateur dans la structure de l'API, ils font partie d'un flux de raisonnement continu. Préserver les blocs de réflexion maintient ce flux conceptuel à travers plusieurs appels d'API. Pour plus d'informations sur la gestion du contexte, consultez notre [guide sur les fenêtres de contexte](/docs/fr/build-with-claude/context-windows).

**Important** : Lors de la fourniture de blocs `thinking`, la séquence entière de blocs `thinking` consécutifs doit correspondre aux résultats générés par le modèle lors de la demande originale ; vous ne pouvez pas réorganiser ou modifier la séquence de ces blocs.

### Pensée entrelacée

La pensée étendue avec utilisation d'outils dans les modèles Claude 4 prend en charge la pensée entrelacée, qui permet à Claude de réfléchir entre les appels d'outils et de faire un raisonnement plus sophistiqué après avoir reçu les résultats des outils.

Avec la pensée entrelacée, Claude peut :
- Raisonner sur les résultats d'un appel d'outil avant de décider de la prochaine étape
- Enchaîner plusieurs appels d'outils avec des étapes de raisonnement entre les deux
- Prendre des décisions plus nuancées basées sur les résultats intermédiaires

Pour activer la pensée entrelacée, ajoutez [l'en-tête bêta](/docs/fr/api/beta-headers) `interleaved-thinking-2025-05-14` à votre demande d'API.

Voici quelques considérations importantes pour la pensée entrelacée :
- Avec la pensée entrelacée, le `budget_tokens` peut dépasser le paramètre `max_tokens`, car il représente le budget total sur tous les blocs de pensée au cours d'un seul tour d'assistant.
- La pensée entrelacée n'est prise en charge que pour les [outils utilisés via l'API Messages](/docs/fr/agents-and-tools/tool-use/overview).
- La pensée entrelacée est prise en charge uniquement pour les modèles Claude 4, avec l'en-tête bêta `interleaved-thinking-2025-05-14`.
- Les appels directs à l'API Claude vous permettent de passer `interleaved-thinking-2025-05-14` dans les demandes à n'importe quel modèle, sans effet.
- Sur les plates-formes tierces (par exemple, [Amazon Bedrock](/docs/fr/build-with-claude/claude-on-amazon-bedrock) et [Vertex AI](/docs/fr/build-with-claude/claude-on-vertex-ai)), si vous passez `interleaved-thinking-2025-05-14` à n'importe quel modèle autre que Claude Opus 4.5, Claude Opus 4.1, Opus 4 ou Sonnet 4, votre demande échouera.

<section title="Utilisation d'outils sans pensée entrelacée">

Sans pensée entrelacée, Claude réfléchit une fois au début du tour d'assistant. Les réponses suivantes après les résultats des outils continuent sans nouveaux blocs de pensée.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50, then check the database..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ no thinking block
  ↓ tool result: "5200"

Turn 3: [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ no thinking block
```

</section>

<section title="Utilisation d'outils avec pensée entrelacée">

Avec la pensée entrelacée activée, Claude peut réfléchir après avoir reçu chaque résultat d'outil, ce qui lui permet de raisonner sur les résultats intermédiaires avant de continuer.

```
User: "What's the total revenue if we sold 150 units at $50 each,
       and how does this compare to our average monthly revenue?"

Turn 1: [thinking] "I need to calculate 150 * $50 first..."
        [tool_use: calculator] { "expression": "150 * 50" }
  ↓ tool result: "7500"

Turn 2: [thinking] "Got $7,500. Now I should query the database to compare..."
        [tool_use: database_query] { "query": "SELECT AVG(revenue)..." }
        ↑ thinking after receiving calculator result
  ↓ tool result: "5200"

Turn 3: [thinking] "$7,500 vs $5,200 average - that's a 44% increase..."
        [text] "The total revenue is $7,500, which is 44% above your
        average monthly revenue of $5,200."
        ↑ thinking before final answer
```

</section>

## Pensée étendue avec mise en cache des invites

[La mise en cache des invites](/docs/fr/build-with-claude/prompt-caching) avec la pensée a plusieurs considérations importantes :

<Tip>
Les tâches de pensée étendue prennent souvent plus de 5 minutes pour se terminer. Envisagez d'utiliser la [durée de cache d'une heure](/docs/fr/build-with-claude/prompt-caching#1-hour-cache-duration) pour maintenir les accès au cache sur les sessions de pensée plus longues et les flux de travail multi-étapes.
</Tip>

**Suppression du contexte des blocs de pensée**
- Les blocs de pensée des tours précédents sont supprimés du contexte, ce qui peut affecter les points d'arrêt du cache
- Lors de la continuation des conversations avec utilisation d'outils, les blocs de pensée sont mis en cache et comptent comme des jetons d'entrée lors de la lecture à partir du cache
- Cela crée un compromis : bien que les blocs de pensée ne consomment pas d'espace de fenêtre de contexte visuellement, ils comptent toujours vers votre utilisation de jetons d'entrée lorsqu'ils sont mis en cache
- Si la pensée est désactivée, les demandes échoueront si vous transmettez du contenu de pensée dans le tour d'utilisation d'outils actuel. Dans d'autres contextes, le contenu de pensée transmis à l'API est simplement ignoré

**Modèles d'invalidation du cache**
- Les modifications des paramètres de pensée (activé/désactivé ou allocation de budget) invalident les points d'arrêt du cache de messages
- [La pensée entrelacée](#interleaved-thinking) amplifie l'invalidation du cache, car les blocs de pensée peuvent se produire entre plusieurs [appels d'outils](#extended-thinking-with-tool-use)
- Les invites système et les outils restent mis en cache malgré les modifications des paramètres de pensée ou la suppression de blocs

<Note>
Bien que les blocs de pensée soient supprimés pour la mise en cache et les calculs de contexte, ils doivent être préservés lors de la continuation des conversations avec [utilisation d'outils](#extended-thinking-with-tool-use), en particulier avec [pensée entrelacée](#interleaved-thinking).
</Note>

### Comprendre le comportement de mise en cache des blocs de pensée

Lors de l'utilisation de la pensée étendue avec utilisation d'outils, les blocs de pensée présentent un comportement de mise en cache spécifique qui affecte le comptage des jetons :

**Comment cela fonctionne :**

1. La mise en cache ne se produit que lorsque vous effectuez une demande ultérieure qui inclut les résultats des outils
2. Lorsque la demande ultérieure est effectuée, l'historique de conversation précédent (y compris les blocs de pensée) peut être mis en cache
3. Ces blocs de pensée mis en cache comptent comme des jetons d'entrée dans vos métriques d'utilisation lorsqu'ils sont lus à partir du cache
4. Lorsqu'un bloc utilisateur sans résultat d'outil est inclus, tous les blocs de pensée précédents sont ignorés et supprimés du contexte

**Flux d'exemple détaillé :**

**Demande 1 :**
```
User: "What's the weather in Paris?"
```
**Réponse 1 :**
```
[thinking_block_1] + [tool_use block 1]
```

**Demande 2 :**
```
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
```
**Réponse 2 :**
```
[thinking_block_2] + [text block 2]
```
La demande 2 écrit un cache du contenu de la demande (pas de la réponse). Le cache inclut le message utilisateur d'origine, le premier bloc de pensée, le bloc d'utilisation d'outil et le résultat de l'outil.

**Demande 3 :**
```
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
```
Pour Claude Opus 4.5 et versions ultérieures, tous les blocs de pensée précédents sont conservés par défaut. Pour les modèles plus anciens, parce qu'un bloc utilisateur sans résultat d'outil a été inclus, tous les blocs de pensée précédents sont ignorés. Cette demande sera traitée de la même manière que :
```
User: ["What's the weather in Paris?"],
Assistant: [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```

**Points clés :**
- Ce comportement de mise en cache se produit automatiquement, même sans marqueurs `cache_control` explicites
- Ce comportement est cohérent, que vous utilisiez la pensée régulière ou la pensée entrelacée

<section title="Mise en cache de l'invite système (préservée lors des modifications de pensée)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

SYSTEM_PROMPT=[
    {
        "type": "text",
        "text": "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
    },
    {
        "type": "text",
        "text": LARGE_TEXT,
        "cache_control": {"type": "ephemeral"}
    }
]

MESSAGES = [
    {
        "role": "user",
        "content": "Analyze the tone of this passage."
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    system=SYSTEM_PROMPT,
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

# Third request - different thinking parameters (cache miss for messages)
print("\nThird request - different thinking parameters (cache miss for messages)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Changed thinking budget
    },
    system=SYSTEM_PROMPT,  # System prompt remains cached
    messages=MESSAGES  # Messages cache is invalidated
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  
  // Remove script and style elements
  $('script, style').remove();
  
  // Get text
  let text = $.text();
  
  // Break into lines and remove leading and trailing space on each
  const lines = text.split('\n').map(line => line.trim());
  // Drop blank lines
  text = lines.filter(line => line.length > 0).join('\n');
  
  return text;
}

// Fetch the content of the article
const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
const bookContent = await fetchArticleContent(bookUrl);
// Use just enough text for caching (first few chapters)
const LARGE_TEXT = bookContent.slice(0, 5000);

const SYSTEM_PROMPT = [
  {
    type: "text",
    text: "You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.",
  },
  {
    type: "text",
    text: LARGE_TEXT,
    cache_control: { type: "ephemeral" }
  }
];

const MESSAGES = [
  {
    role: "user",
    content: "Analyze the tone of this passage."
  }
];

// First request - establish cache
console.log("First request - establishing cache");
const response1 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`First response usage: ${response1.usage}`);

MESSAGES.push({
  role: "assistant",
  content: response1.content
});
MESSAGES.push({
  role: "user",
  content: "Analyze the characters in this passage."
});

// Second request - same thinking parameters (cache hit expected)
console.log("\nSecond request - same thinking parameters (cache hit expected)");
const response2 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 4000
  },
  system: SYSTEM_PROMPT,
  messages: MESSAGES
});

console.log(`Second response usage: ${response2.usage}`);

// Third request - different thinking parameters (cache miss for messages)
console.log("\nThird request - different thinking parameters (cache miss for messages)");
const response3 = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 20000,
  thinking: {
    type: "enabled",
    budget_tokens: 8000  // Changed thinking budget
  },
  system: SYSTEM_PROMPT,  // System prompt remains cached
  messages: MESSAGES  // Messages cache is invalidated
});

console.log(`Third response usage: ${response3.usage}`);
```
</CodeGroup>

</section>
<section title="Mise en cache des messages (invalidée lors des modifications de pensée)">

<CodeGroup>
```python Python
from anthropic import Anthropic
import requests
from bs4 import BeautifulSoup

client = Anthropic()

def fetch_article_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Remove script and style elements
    for script in soup(["script", "style"]):
        script.decompose()

    # Get text
    text = soup.get_text()

    # Break into lines and remove leading and trailing space on each
    lines = (line.strip() for line in text.splitlines())
    # Break multi-headlines into a line each
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    # Drop blank lines
    text = '\n'.join(chunk for chunk in chunks if chunk)

    return text

# Fetch the content of the article
book_url = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt"
book_content = fetch_article_content(book_url)
# Use just enough text for caching (first few chapters)
LARGE_TEXT = book_content[:5000]

# No system prompt - caching in messages instead
MESSAGES = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": LARGE_TEXT,
                "cache_control": {"type": "ephemeral"},
            },
            {
                "type": "text",
                "text": "Analyze the tone of this passage."
            }
        ]
    }
]

# First request - establish cache
print("First request - establishing cache")
response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000
    },
    messages=MESSAGES
)

print(f"First response usage: {response1.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response1.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the characters in this passage."
})
# Second request - same thinking parameters (cache hit expected)
print("\nSecond request - same thinking parameters (cache hit expected)")
response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 4000  # Same thinking budget
    },
    messages=MESSAGES
)

print(f"Second response usage: {response2.usage}")

MESSAGES.append({
    "role": "assistant",
    "content": response2.content
})
MESSAGES.append({
    "role": "user",
    "content": "Analyze the setting in this passage."
})

# Third request - different thinking budget (cache miss expected)
print("\nThird request - different thinking budget (cache miss expected)")
response3 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=20000,
    thinking={
        "type": "enabled",
        "budget_tokens": 8000  # Different thinking budget breaks cache
    },
    messages=MESSAGES
)

print(f"Third response usage: {response3.usage}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new Anthropic();

async function fetchArticleContent(url: string): Promise<string> {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Remove script and style elements
  $('script, style').remove();

  // Get text
  let text = $.text();

  // Clean up text (break into lines, remove whitespace)
  const lines = text.split('\n').map(line => line.trim());
  const chunks = lines.flatMap(line => line.split('  ').map(phrase => phrase.trim()));
  text = chunks.filter(chunk => chunk).join('\n');

  return text;
}

async function main() {
  // Fetch the content of the article
  const bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
  const bookContent = await fetchArticleContent(bookUrl);
  // Use just enough text for caching (first few chapters)
  const LARGE_TEXT = bookContent.substring(0, 5000);

  // No system prompt - caching in messages instead
  let MESSAGES = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: LARGE_TEXT,
          cache_control: {type: "ephemeral"},
        },
        {
          type: "text",
          text: "Analyze the tone of this passage."
        }
      ]
    }
  ];

  // First request - establish cache
  console.log("First request - establishing cache");
  const response1 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000
    },
    messages: MESSAGES
  });

  console.log(`First response usage: `, response1.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response1.content
    },
    {
      role: "user",
      content: "Analyze the characters in this passage."
    }
  ];

  // Second request - same thinking parameters (cache hit expected)
  console.log("\nSecond request - same thinking parameters (cache hit expected)");
  const response2 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 4000  // Same thinking budget
    },
    messages: MESSAGES
  });

  console.log(`Second response usage: `, response2.usage);

  MESSAGES = [
    ...MESSAGES,
    {
      role: "assistant",
      content: response2.content
    },
    {
      role: "user",
      content: "Analyze the setting in this passage."
    }
  ];

  // Third request - different thinking budget (cache miss expected)
  console.log("\nThird request - different thinking budget (cache miss expected)");
  const response3 = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 20000,
    thinking: {
      type: "enabled",
      budget_tokens: 8000  // Different thinking budget breaks cache
    },
    messages: MESSAGES
  });

  console.log(`Third response usage: `, response3.usage);
}

main().catch(console.error);
```

```java Java
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.regex.Pattern;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.*;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

public class ThinkingCacheExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Fetch the content of the article
        String bookUrl = "https://www.gutenberg.org/cache/epub/1342/pg1342.txt";
        String bookContent = fetchArticleContent(bookUrl);
        // Use just enough text for caching (first few chapters)
        String largeText = bookContent.substring(0, 5000);

        List<BetaTextBlockParam> systemPrompt = List.of(
                BetaTextBlockParam.builder()
                        .text("You are an AI assistant that is tasked with literary analysis. Analyze the following text carefully.")
                        .build(),
                BetaTextBlockParam.builder()
                        .text(largeText)
                        .cacheControl(BetaCacheControlEphemeral.builder().build())
                        .build()
        );

        List<BetaMessageParam> messages = new ArrayList<>();
        messages.add(BetaMessageParam.builder()
                .role(BetaMessageParam.Role.USER)
                .content("Analyze the tone of this passage.")
                .build());

        // First request - establish cache
        System.out.println("First request - establishing cache");
        BetaMessage response1 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .messages(messages)
                        .build()
        );

        System.out.println("First response usage: " + response1.usage());

        // Second request - same thinking parameters (cache hit expected)
        System.out.println("\nSecond request - same thinking parameters (cache hit expected)");
        BetaMessage response2 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(4000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .messages(messages)
                        .build()
        );

        System.out.println("Second response usage: " + response2.usage());

        // Third request - different thinking budget (cache hit expected because system prompt caching)
        System.out.println("\nThird request - different thinking budget (cache hit expected)");
        BetaMessage response3 = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(20000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(8000).build())
                        .systemOfBetaTextBlockParams(systemPrompt)
                        .addMessage(response1)
                        .addUserMessage("Analyze the characters in this passage.")
                        .addMessage(response2)
                        .addUserMessage("Analyze the setting in this passage.")
                        .build()
        );

        System.out.println("Third response usage: " + response3.usage());
    }

    private static String fetchArticleContent(String url) throws IOException {
        // Fetch HTML content
        String htmlContent = fetchHtml(url);

        // Remove script and style elements
        String noScriptStyle = removeElements(htmlContent, "script", "style");

        // Extract text (simple approach - remove HTML tags)
        String text = removeHtmlTags(noScriptStyle);

        // Clean up text (break into lines, remove whitespace)
        List<String> lines = Arrays.asList(text.split("\n"));
        List<String> trimmedLines = lines.stream()
                .map(String::trim)
                .collect(toList());

        // Split on double spaces and flatten
        List<String> chunks = trimmedLines.stream()
                .flatMap(line -> Arrays.stream(line.split("  "))
                        .map(String::trim))
                .collect(toList());

        // Filter empty chunks and join with newlines
        return chunks.stream()
                .filter(chunk -> !chunk.isEmpty())
                .collect(joining("\n"));
    }

    /**
     * Fetches HTML content from a URL
     */
    private static String fetchHtml(String urlString) throws IOException {
        try (InputStream inputStream = new URL(urlString).openStream()) {
            StringBuilder content = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
            }
            return content.toString();
        }
    }

    /**
     * Removes specified HTML elements and their content
     */
    private static String removeElements(String html, String... elementNames) {
        String result = html;
        for (String element : elementNames) {
            // Pattern to match <element>...</element> and self-closing tags
            String pattern = "<" + element + "\\s*[^>]*>.*?</" + element + ">|<" + element + "\\s*[^>]*/?>";
            result = Pattern.compile(pattern, Pattern.DOTALL).matcher(result).replaceAll("");
        }
        return result;
    }

    /**
     * Removes all HTML tags from content
     */
    private static String removeHtmlTags(String html) {
        // Replace <br> and <p> tags with newlines for better text formatting
        String withLineBreaks = html.replaceAll("<br\\s*/?\\s*>|</?p\\s*[^>]*>", "\n");

        // Remove remaining HTML tags
        String noTags = withLineBreaks.replaceAll("<[^>]*>", "");

        // Decode HTML entities (simplified for common entities)
        return decodeHtmlEntities(noTags);
    }

    /**
     * Simple HTML entity decoder for common entities
     */
    private static String decodeHtmlEntities(String text) {
        return text
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("&quot;", "\"")
                .replaceAll("&#39;", "'")
                .replaceAll("&hellip;", "...")
                .replaceAll("&mdash;", "—");
    }

}
```
</CodeGroup>

Voici la sortie du script (vous pouvez voir des chiffres légèrement différents)

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

Cet exemple démontre que lorsque la mise en cache est configurée dans le tableau de messages, la modification des paramètres de pensée (budget_tokens augmenté de 4000 à 8000) **invalide le cache**. La troisième demande ne montre aucun accès au cache avec `cache_creation_input_tokens=1370` et `cache_read_input_tokens=0`, ce qui prouve que la mise en cache basée sur les messages est invalidée lorsque les paramètres de pensée changent.

</section>

## Jetons max et taille de la fenêtre de contexte avec pensée étendue

Dans les modèles Claude plus anciens (antérieurs à Claude Sonnet 3.7), si la somme des jetons d'invite et de `max_tokens` dépassait la fenêtre de contexte du modèle, le système ajustait automatiquement `max_tokens` pour s'adapter à la limite de contexte. Cela signifiait que vous pouviez définir une grande valeur `max_tokens` et le système la réduirait silencieusement selon les besoins.

Avec les modèles Claude 3.7 et 4, `max_tokens` (qui inclut votre budget de pensée lorsque la pensée est activée) est appliqué comme une limite stricte. Le système retournera maintenant une erreur de validation si les jetons d'invite + `max_tokens` dépassent la taille de la fenêtre de contexte.

<Note>
Vous pouvez consulter notre [guide sur les fenêtres de contexte](/docs/fr/build-with-claude/context-windows) pour une plongée plus approfondie.
</Note>

### La fenêtre de contexte avec pensée étendue

Lors du calcul de l'utilisation de la fenêtre de contexte avec la pensée activée, il y a quelques considérations à prendre en compte :

- Les blocs de pensée des tours précédents sont supprimés et ne comptent pas vers votre fenêtre de contexte
- La pensée du tour actuel compte vers votre limite `max_tokens` pour ce tour

Le diagramme ci-dessous illustre la gestion spécialisée des jetons lorsque la pensée étendue est activée :

![Diagramme de la fenêtre de contexte avec pensée étendue](/docs/images/context-window-thinking.svg)

La fenêtre de contexte effective est calculée comme :

```
context window =
  (current input tokens - previous thinking tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Nous recommandons d'utiliser l'[API de comptage des jetons](/docs/fr/build-with-claude/token-counting) pour obtenir des comptages de jetons précis pour votre cas d'usage spécifique, en particulier lorsque vous travaillez avec des conversations multi-tours qui incluent la pensée.

### La fenêtre de contexte avec pensée étendue et utilisation d'outils

Lors de l'utilisation de la pensée étendue avec utilisation d'outils, les blocs de pensée doivent être explicitement préservés et retournés avec les résultats des outils.

Le calcul de la fenêtre de contexte effective pour la pensée étendue avec utilisation d'outils devient :

```
context window =
  (current input tokens + previous thinking tokens + tool use tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

Le diagramme ci-dessous illustre la gestion des jetons pour la pensée étendue avec utilisation d'outils :

![Diagramme de la fenêtre de contexte avec pensée étendue et utilisation d'outils](/docs/images/context-window-thinking-tools.svg)

### Gestion des jetons avec pensée étendue

Compte tenu du comportement de la fenêtre de contexte et de `max_tokens` avec les modèles Claude 3.7 et 4 de pensée étendue, vous devrez peut-être :

- Surveiller et gérer plus activement votre utilisation de jetons
- Ajuster les valeurs `max_tokens` à mesure que la longueur de votre invite change
- Potentiellement utiliser les [points de terminaison de comptage des jetons](/docs/fr/build-with-claude/token-counting) plus fréquemment
- Être conscient que les blocs de pensée précédents ne s'accumulent pas dans votre fenêtre de contexte

Ce changement a été apporté pour fournir un comportement plus prévisible et transparent, en particulier à mesure que les limites de jetons maximaux ont augmenté considérablement.

## Chiffrement de la pensée

Le contenu complet de la pensée est chiffré et retourné dans le champ `signature`. Ce champ est utilisé pour vérifier que les blocs de pensée ont été générés par Claude lorsqu'ils sont renvoyés à l'API.

<Note>
Il n'est strictement nécessaire de renvoyer les blocs de pensée que lors de l'utilisation d'[outils avec pensée étendue](#extended-thinking-with-tool-use). Sinon, vous pouvez omettre les blocs de pensée des tours précédents, ou laisser l'API les supprimer pour vous si vous les renvoyez.

Si vous renvoyez des blocs de pensée, nous recommandons de renvoyer tout tel que vous l'avez reçu pour la cohérence et pour éviter les problèmes potentiels.
</Note>

Voici quelques considérations importantes sur le chiffrement de la pensée :
- Lors du [streaming des réponses](#streaming-thinking), la signature est ajoutée via un `signature_delta` à l'intérieur d'un événement `content_block_delta` juste avant l'événement `content_block_stop`.
- Les valeurs `signature` sont considérablement plus longues dans les modèles Claude 4 que dans les modèles précédents.
- Le champ `signature` est un champ opaque et ne doit pas être interprété ou analysé - il existe uniquement à des fins de vérification.
- Les valeurs `signature` sont compatibles entre les plates-formes (API Claude, [Amazon Bedrock](/docs/fr/build-with-claude/claude-on-amazon-bedrock) et [Vertex AI](/docs/fr/build-with-claude/claude-on-vertex-ai)). Les valeurs générées sur une plate-forme seront compatibles avec une autre.

### Rédaction de la réflexion

Occasionnellement, le raisonnement interne de Claude sera signalé par nos systèmes de sécurité. Lorsque cela se produit, nous chiffrons une partie ou la totalité du bloc `thinking` et le retournons sous la forme d'un bloc `redacted_thinking`. Les blocs `redacted_thinking` sont déchiffrés lorsqu'ils sont renvoyés à l'API, permettant à Claude de continuer sa réponse sans perdre le contexte.

Lors de la création d'applications orientées client utilisant la réflexion étendue :

- Soyez conscient que les blocs de réflexion réduits contiennent du contenu chiffré qui n'est pas lisible par l'homme
- Envisagez de fournir une explication simple comme : « Certains des raisonnements internes de Claude ont été automatiquement chiffrés pour des raisons de sécurité. Cela n'affecte pas la qualité des réponses. »
- Si vous montrez les blocs de réflexion aux utilisateurs, vous pouvez filtrer les blocs réduits tout en préservant les blocs de réflexion normaux
- Soyez transparent sur le fait que l'utilisation des fonctionnalités de réflexion étendue peut occasionnellement entraîner le chiffrement de certains raisonnements
- Implémentez une gestion des erreurs appropriée pour gérer gracieusement la réflexion réduite sans casser votre interface utilisateur

Voici un exemple montrant à la fois les blocs de réflexion normaux et réduits :

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "Let me analyze this step by step...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "redacted_thinking",
      "data": "EmwKAhgBEgy3va3pzix/LafPsn4aDFIT2Xlxh0L5L8rLVyIwxtE3rAFBa8cr3qpPkNRj2YfWXGmKDxH4mPnZ5sQ7vB9URj2pLmN3kF8/dW5hR7xJ0aP1oLs9yTcMnKVf2wRpEGjH9XZaBt4UvDcPrQ..."
    },
    {
      "type": "text",
      "text": "Based on my analysis..."
    }
  ]
}
```

<Note>
Voir des blocs de réflexion réduits dans votre sortie est un comportement attendu. Le modèle peut toujours utiliser ce raisonnement réduit pour éclairer ses réponses tout en maintenant les garde-fous de sécurité.

Si vous avez besoin de tester la gestion de la réflexion réduite dans votre application, vous pouvez utiliser cette chaîne de test spéciale comme invite : `ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

Lors du passage des blocs `thinking` et `redacted_thinking` à l'API dans une conversation multi-tours, vous devez inclure le bloc complet et non modifié à l'API pour le dernier tour d'assistant. Ceci est critique pour maintenir le flux de raisonnement du modèle. Nous suggérons de toujours renvoyer tous les blocs de réflexion à l'API. Pour plus de détails, consultez la section [Préservation des blocs de réflexion](#preserving-thinking-blocks) ci-dessus.

<section title="Exemple : Travailler avec les blocs de réflexion réduits">

Cet exemple montre comment gérer les blocs `redacted_thinking` qui peuvent apparaître dans les réponses lorsque le raisonnement interne de Claude contient du contenu signalé par les systèmes de sécurité :

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Using a special prompt that triggers redacted thinking (for demonstration purposes only)
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    messages=[{
        "role": "user",
        "content": "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
    }]
)

# Identify redacted thinking blocks
has_redacted_thinking = any(
    block.type == "redacted_thinking" for block in response.content
)

if has_redacted_thinking:
    print("Response contains redacted thinking blocks")
    # These blocks are still usable in subsequent requests

    # Extract all blocks (both redacted and non-redacted)
    all_thinking_blocks = [
        block for block in response.content
        if block.type in ["thinking", "redacted_thinking"]
    ]

    # When passing to subsequent requests, include all blocks without modification
    # This preserves the integrity of Claude's reasoning

    print(f"Found {len(all_thinking_blocks)} thinking blocks total")
    print(f"These blocks are still billable as output tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Using a special prompt that triggers redacted thinking (for demonstration purposes only)
const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  messages: [{
    role: "user",
    content: "ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  }]
});

// Identify redacted thinking blocks
const hasRedactedThinking = response.content.some(
  block => block.type === "redacted_thinking"
);

if (hasRedactedThinking) {
  console.log("Response contains redacted thinking blocks");
  // These blocks are still usable in subsequent requests

  // Extract all blocks (both redacted and non-redacted)
  const allThinkingBlocks = response.content.filter(
    block => block.type === "thinking" || block.type === "redacted_thinking"
  );

  // When passing to subsequent requests, include all blocks without modification
  // This preserves the integrity of Claude's reasoning

  console.log(`Found ${allThinkingBlocks.length} thinking blocks total`);
  console.log(`These blocks are still billable as output tokens`);
}
```

```java Java
import java.util.List;

import static java.util.stream.Collectors.toList;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.beta.messages.BetaContentBlock;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.messages.Model;

public class RedactedThinkingExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Using a special prompt that triggers redacted thinking (for demonstration purposes only)
        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_SONNET_4_5)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB")
                        .build()
        );

        // Identify redacted thinking blocks
        boolean hasRedactedThinking = response.content().stream()
                .anyMatch(BetaContentBlock::isRedactedThinking);

        if (hasRedactedThinking) {
            System.out.println("Response contains redacted thinking blocks");
            // These blocks are still usable in subsequent requests
            // Extract all blocks (both redacted and non-redacted)
            List<BetaContentBlock> allThinkingBlocks = response.content().stream()
                    .filter(block -> block.isThinking() ||
                            block.isRedactedThinking())
                    .collect(toList());

            // When passing to subsequent requests, include all blocks without modification
            // This preserves the integrity of Claude's reasoning
            System.out.println("Found " + allThinkingBlocks.size() + " thinking blocks total");
            System.out.println("These blocks are still billable as output tokens");
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton
  userPrompt="ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB"
  thinkingBudgetTokens={16000}
>
  Essayer dans la console
</TryInConsoleButton>

</section>

## Différences de réflexion entre les versions de modèle

L'API Messages gère la réflexion différemment selon les modèles Claude Sonnet 3.7 et Claude 4, principalement dans le comportement de rédaction et de résumé.

Consultez le tableau ci-dessous pour une comparaison condensée :

| Fonctionnalité | Claude Sonnet 3.7 | Modèles Claude 4 (pré-Opus 4.5) | Claude Opus 4.5 et versions ultérieures |
|---------|------------------|-------------------------------|--------------------------|
| **Sortie de réflexion** | Retourne la sortie de réflexion complète | Retourne la réflexion résumée | Retourne la réflexion résumée |
| **Réflexion entrelacée** | Non supportée | Supportée avec l'en-tête bêta `interleaved-thinking-2025-05-14` | Supportée avec l'en-tête bêta `interleaved-thinking-2025-05-14` |
| **Préservation du bloc de réflexion** | Non préservée entre les tours | Non préservée entre les tours | **Préservée par défaut** (active l'optimisation du cache, économies de jetons) |

### Préservation du bloc de réflexion dans Claude Opus 4.5

Claude Opus 4.5 introduit un nouveau comportement par défaut : **les blocs de réflexion des tours d'assistant précédents sont préservés dans le contexte du modèle par défaut**. Cela diffère des modèles antérieurs, qui suppriment les blocs de réflexion des tours précédents.

**Avantages de la préservation des blocs de réflexion :**

- **Optimisation du cache** : Lors de l'utilisation de l'utilisation d'outils, les blocs de réflexion préservés permettent les accès au cache car ils sont renvoyés avec les résultats des outils et mis en cache de manière incrémentale dans le tour d'assistant, ce qui entraîne des économies de jetons dans les flux de travail multi-étapes
- **Aucun impact sur l'intelligence** : La préservation des blocs de réflexion n'a aucun effet négatif sur les performances du modèle

**Considérations importantes :**

- **Utilisation du contexte** : Les conversations longues consommeront plus d'espace de contexte puisque les blocs de réflexion sont conservés dans le contexte
- **Comportement automatique** : C'est le comportement par défaut pour Claude Opus 4.5 — aucune modification de code ou en-tête bêta requis
- **Compatibilité rétroactive** : Pour exploiter cette fonctionnalité, continuez à renvoyer les blocs de réflexion complets et non modifiés à l'API comme vous le feriez pour l'utilisation d'outils

<Note>
Pour les modèles antérieurs (Claude Sonnet 4.5, Opus 4.1, etc.), les blocs de réflexion des tours précédents continuent à être supprimés du contexte. Le comportement existant décrit dans la section [Réflexion étendue avec mise en cache des invites](#extended-thinking-with-prompt-caching) s'applique à ces modèles.
</Note>

## Tarification

Pour les informations de tarification complètes, y compris les tarifs de base, les écritures en cache, les accès au cache et les jetons de sortie, consultez la [page de tarification](/docs/fr/about-claude/pricing).

Le processus de réflexion entraîne des frais pour :
- Les jetons utilisés pendant la réflexion (jetons de sortie)
- Les blocs de réflexion du dernier tour d'assistant inclus dans les demandes ultérieures (jetons d'entrée)
- Les jetons de sortie de texte standard

<Note>
Lorsque la réflexion étendue est activée, une invite système spécialisée est automatiquement incluse pour supporter cette fonctionnalité.
</Note>

Lors de l'utilisation de la réflexion résumée :
- **Jetons d'entrée** : Jetons dans votre demande originale (exclut les jetons de réflexion des tours précédents)
- **Jetons de sortie (facturés)** : Les jetons de réflexion originaux que Claude a générés en interne
- **Jetons de sortie (visibles)** : Les jetons de réflexion résumés que vous voyez dans la réponse
- **Aucun frais** : Jetons utilisés pour générer le résumé

<Warning>
Le nombre de jetons de sortie facturés **ne correspondra pas** au nombre de jetons visibles dans la réponse. Vous êtes facturé pour le processus de réflexion complet, pas le résumé que vous voyez.
</Warning>

## Meilleures pratiques et considérations pour la réflexion étendue

### Travailler avec les budgets de réflexion

- **Optimisation du budget :** Le budget minimum est de 1 024 jetons. Nous suggérons de commencer par le minimum et d'augmenter le budget de réflexion de manière incrémentale pour trouver la plage optimale pour votre cas d'utilisation. Des nombres de jetons plus élevés permettent un raisonnement plus complet mais avec des rendements décroissants selon la tâche. L'augmentation du budget peut améliorer la qualité des réponses au détriment d'une latence accrue. Pour les tâches critiques, testez différents paramètres pour trouver l'équilibre optimal. Notez que le budget de réflexion est une cible plutôt qu'une limite stricte — l'utilisation réelle des jetons peut varier selon la tâche.
- **Points de départ :** Commencez avec des budgets de réflexion plus importants (16k+ jetons) pour les tâches complexes et ajustez selon vos besoins.
- **Budgets importants :** Pour les budgets de réflexion supérieurs à 32k, nous recommandons d'utiliser le [traitement par lots](/docs/fr/build-with-claude/batch-processing) pour éviter les problèmes de réseau. Les demandes poussant le modèle à réfléchir au-dessus de 32k jetons causent des demandes longues qui pourraient se heurter aux délais d'expiration du système et aux limites de connexion ouverte.
- **Suivi de l'utilisation des jetons :** Surveillez l'utilisation des jetons de réflexion pour optimiser les coûts et les performances.

### Considérations de performance

- **Temps de réponse :** Soyez préparé à des temps de réponse potentiellement plus longs en raison du traitement supplémentaire requis pour le processus de raisonnement. Tenez compte du fait que la génération de blocs de réflexion peut augmenter le temps de réponse global.
- **Exigences de streaming :** Le streaming est requis lorsque `max_tokens` est supérieur à 21 333. Lors du streaming, soyez préparé à gérer à la fois les blocs de contenu de réflexion et de texte à mesure qu'ils arrivent.

### Compatibilité des fonctionnalités

- La réflexion n'est pas compatible avec les modifications `temperature` ou `top_k` ainsi qu'avec l'[utilisation forcée d'outils](/docs/fr/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use).
- Lorsque la réflexion est activée, vous pouvez définir `top_p` sur des valeurs entre 1 et 0,95.
- Vous ne pouvez pas pré-remplir les réponses lorsque la réflexion est activée.
- Les modifications du budget de réflexion invalident les préfixes d'invite en cache qui incluent des messages. Cependant, les invites système en cache et les définitions d'outils continueront à fonctionner lorsque les paramètres de réflexion changent.

### Directives d'utilisation

- **Sélection des tâches :** Utilisez la réflexion étendue pour les tâches particulièrement complexes qui bénéficient d'un raisonnement étape par étape comme les mathématiques, le codage et l'analyse.
- **Gestion du contexte :** Vous n'avez pas besoin de supprimer vous-même les blocs de réflexion précédents. L'API Claude ignore automatiquement les blocs de réflexion des tours précédents et ils ne sont pas inclus lors du calcul de l'utilisation du contexte.
- **Ingénierie des invites :** Consultez nos [conseils d'ingénierie des invites pour la réflexion étendue](/docs/fr/build-with-claude/prompt-engineering/extended-thinking-tips) si vous souhaitez maximiser les capacités de réflexion de Claude.

## Étapes suivantes

<CardGroup>
  <Card title="Essayez le livre de recettes de réflexion étendue" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Explorez des exemples pratiques de réflexion dans notre livre de recettes.
  </Card>
  <Card title="Conseils d'ingénierie des invites pour la réflexion étendue" icon="code" href="/docs/fr/build-with-claude/prompt-engineering/extended-thinking-tips">
    Apprenez les meilleures pratiques d'ingénierie des invites pour la réflexion étendue.
  </Card>
</CardGroup>