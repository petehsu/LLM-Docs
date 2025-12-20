# Comment implémenter l'utilisation d'outils

Guide complet pour implémenter l'utilisation d'outils avec Claude, y compris la définition des outils, les meilleures pratiques et les exemples de code.

---

## Choisir un modèle

Nous recommandons d'utiliser le dernier Claude Sonnet (4.5) ou Claude Opus (4.1) pour les outils complexes et les requêtes ambiguës ; ils gèrent mieux plusieurs outils et demandent des clarifications si nécessaire.

Utilisez les modèles Claude Haiku pour les outils simples, mais notez qu'ils peuvent déduire les paramètres manquants.

<Tip>
Si vous utilisez Claude avec l'utilisation d'outils et la réflexion étendue, consultez notre guide [ici](/docs/fr/build-with-claude/extended-thinking) pour plus d'informations.
</Tip>

## Spécifier les outils clients

Les outils clients (à la fois définis par Anthropic et définis par l'utilisateur) sont spécifiés dans le paramètre `tools` de niveau supérieur de la requête API. Chaque définition d'outil inclut :

| Paramètre      | Description                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | Le nom de l'outil. Doit correspondre à l'expression régulière `^[a-zA-Z0-9_-]{1,64}$`.                                 |
| `description`  | Une description détaillée en texte brut de ce que fait l'outil, quand il doit être utilisé et comment il se comporte. |
| `input_schema` | Un objet [JSON Schema](https://json-schema.org/) définissant les paramètres attendus pour l'outil.     |
| `input_examples` | (Optionnel, bêta) Un tableau d'objets d'entrée d'exemple pour aider Claude à comprendre comment utiliser l'outil. Voir [Fournir des exemples d'utilisation d'outils](#providing-tool-use-examples). |

<section title="Exemple de définition d'outil simple">

```json JSON
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "The city and state, e.g. San Francisco, CA"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
      }
    },
    "required": ["location"]
  }
}
```

Cet outil, nommé `get_weather`, s'attend à recevoir un objet d'entrée avec une chaîne `location` obligatoire et une chaîne `unit` optionnelle qui doit être soit "celsius" soit "fahrenheit".

</section>

### Invite système d'utilisation d'outils

Lorsque vous appelez l'API Claude avec le paramètre `tools`, nous construisons une invite système spéciale à partir des définitions d'outils, de la configuration des outils et de toute invite système spécifiée par l'utilisateur. L'invite construite est conçue pour instruire le modèle d'utiliser les outils spécifiés et de fournir le contexte nécessaire pour que l'outil fonctionne correctement :

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### Meilleures pratiques pour les définitions d'outils

Pour obtenir les meilleures performances de Claude lors de l'utilisation d'outils, suivez ces directives :

- **Fournir des descriptions extrêmement détaillées.** C'est de loin le facteur le plus important pour les performances des outils. Vos descriptions doivent expliquer chaque détail de l'outil, y compris :
  - Ce que fait l'outil
  - Quand il doit être utilisé (et quand il ne doit pas l'être)
  - Ce que signifie chaque paramètre et comment il affecte le comportement de l'outil
  - Toutes les mises en garde ou limitations importantes, comme les informations que l'outil ne retourne pas si le nom de l'outil n'est pas clair. Plus vous pouvez donner de contexte à Claude sur vos outils, mieux il sera capable de décider quand et comment les utiliser. Visez au moins 3-4 phrases par description d'outil, plus si l'outil est complexe.
- **Prioriser les descriptions, mais envisager d'utiliser `input_examples` pour les outils complexes.** Les descriptions claires sont les plus importantes, mais pour les outils avec des entrées complexes, des objets imbriqués ou des paramètres sensibles au format, vous pouvez utiliser le champ `input_examples` (bêta) pour fournir des exemples validés par le schéma. Voir [Fournir des exemples d'utilisation d'outils](#providing-tool-use-examples) pour plus de détails.

<section title="Exemple d'une bonne description d'outil">

```json JSON
{
  "name": "get_stock_price",
  "description": "Retrieves the current stock price for a given ticker symbol. The ticker symbol must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ. The tool will return the latest trade price in USD. It should be used when the user asks about the current or most recent price of a specific stock. It will not provide any other information about the stock or company.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string",
        "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

<section title="Exemple de mauvaise description d'outil">

```json JSON
{
  "name": "get_stock_price",
  "description": "Gets the stock price for a ticker.",
  "input_schema": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string"
      }
    },
    "required": ["ticker"]
  }
}
```

</section>

La bonne description explique clairement ce que fait l'outil, quand l'utiliser, quelles données il retourne et ce que signifie le paramètre `ticker`. La mauvaise description est trop brève et laisse Claude avec de nombreuses questions ouvertes sur le comportement et l'utilisation de l'outil.

## Fournir des exemples d'utilisation d'outils

Vous pouvez fournir des exemples concrets d'entrées d'outils valides pour aider Claude à comprendre comment utiliser vos outils plus efficacement. Ceci est particulièrement utile pour les outils complexes avec des objets imbriqués, des paramètres optionnels ou des entrées sensibles au format.

<Info>
Les exemples d'utilisation d'outils sont une fonctionnalité bêta. Incluez l'[en-tête bêta](/docs/fr/api/beta-headers) approprié pour votre fournisseur :

| Fournisseur | En-tête bêta | Modèles supportés |
|----------|-------------|------------------|
| Claude API,<br/>Microsoft Foundry | `advanced-tool-use-2025-11-20` | Tous les modèles |
| Vertex AI,<br/>Amazon Bedrock | `tool-examples-2025-10-29` | Claude Opus 4.5 uniquement |
</Info>

### Utilisation de base

Ajoutez un champ optionnel `input_examples` à votre définition d'outil avec un tableau d'objets d'entrée d'exemple. Chaque exemple doit être valide selon le `input_schema` de l'outil :

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    betas=["advanced-tool-use-2025-11-20"],
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature"
                    }
                },
                "required": ["location"]
            },
            "input_examples": [
                {
                    "location": "San Francisco, CA",
                    "unit": "fahrenheit"
                },
                {
                    "location": "Tokyo, Japan",
                    "unit": "celsius"
                },
                {
                    "location": "New York, NY"  # 'unit' is optional
                }
            ]
        }
    ],
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ]
)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  betas: ["advanced-tool-use-2025-11-20"],
  tools: [
    {
      name: "get_weather",
      description: "Get the current weather in a given location",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
            description: "The unit of temperature",
          },
        },
        required: ["location"],
      },
      input_examples: [
        {
          location: "San Francisco, CA",
          unit: "fahrenheit",
        },
        {
          location: "Tokyo, Japan",
          unit: "celsius",
        },
        {
          location: "New York, NY",
          // Demonstrates that 'unit' is optional
        },
      ],
    },
  ],
  messages: [{ role: "user", content: "What's the weather like in San Francisco?" }],
});
```
</CodeGroup>

Les exemples sont inclus dans l'invite aux côtés de votre schéma d'outil, montrant à Claude des modèles concrets pour des appels d'outils bien formés. Cela aide Claude à comprendre quand inclure les paramètres optionnels, quels formats utiliser et comment structurer les entrées complexes.

### Exigences et limitations

- **Validation du schéma** - Chaque exemple doit être valide selon le `input_schema` de l'outil. Les exemples invalides retournent une erreur 400
- **Non supporté pour les outils côté serveur** - Seuls les outils définis par l'utilisateur peuvent avoir des exemples d'entrée
- **Coût en tokens** - Les exemples s'ajoutent aux tokens d'invite : ~20-50 tokens pour les exemples simples, ~100-200 tokens pour les objets imbriqués complexes

## Exécuteur d'outils (bêta)

L'exécuteur d'outils fournit une solution prête à l'emploi pour exécuter des outils avec Claude. Au lieu de gérer manuellement les appels d'outils, les résultats d'outils et la gestion des conversations, l'exécuteur d'outils exécute automatiquement :

- Exécute les outils quand Claude les appelle
- Gère le cycle de requête/réponse
- Gère l'état de la conversation
- Fournit la sécurité des types et la validation

Nous recommandons d'utiliser l'exécuteur d'outils pour la plupart des implémentations d'utilisation d'outils.

<Note>
L'exécuteur d'outils est actuellement en bêta et disponible dans les SDK [Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md), [TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers) et [Ruby](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#3-auto-looping-tool-runner-beta).
</Note>

<Tip>
**Gestion automatique du contexte avec compaction**

L'exécuteur d'outils supporte la [compaction](/docs/fr/build-with-claude/context-editing#client-side-compaction-sdk) automatique, qui génère des résumés quand l'utilisation de tokens dépasse un seuil. Cela permet aux tâches agentiques longues de continuer au-delà des limites de la fenêtre de contexte.
</Tip>

<Tabs>
<Tab title="Python">

### Utilisation de base

Utilisez le décorateur `@beta_tool` pour définir les outils et `client.beta.messages.tool_runner()` pour les exécuter.

<Note>
Si vous utilisez le client asynchrone, remplacez `@beta_tool` par `@beta_async_tool` et définissez la fonction avec `async def`.
</Note>

```python
import anthropic
import json
from anthropic import beta_tool

# Initialize client
client = anthropic.Anthropic()

# Define tools using the decorator
@beta_tool
def get_weather(location: str, unit: str = "fahrenheit") -> str:
    """Get the current weather in a given location.

    Args:
        location: The city and state, e.g. San Francisco, CA
        unit: Temperature unit, either 'celsius' or 'fahrenheit'
    """
    # In a full implementation, you'd call a weather API here
    return json.dumps({"temperature": "20°C", "condition": "Sunny"})

@beta_tool
def calculate_sum(a: int, b: int) -> str:
    """Add two numbers together.

    Args:
        a: First number
        b: Second number
    """
    return str(a + b)

# Use the tool runner
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
for message in runner:
    print(message.content[0].text)
```

La fonction décorée doit retourner un bloc de contenu ou un tableau de blocs de contenu, y compris du texte, des images ou des blocs de documents. Cela permet aux outils de retourner des réponses riches et multimodales. Les chaînes retournées seront converties en bloc de contenu texte.
Si vous voulez retourner un objet JSON structuré à Claude, encodez-le en chaîne JSON avant de le retourner. Les nombres, booléens ou autres primitives non-chaîne doivent également être convertis en chaînes.

Le décorateur `@beta_tool` inspectera les arguments de la fonction et la docstring pour extraire une représentation de schéma json de la fonction donnée, dans l'exemple ci-dessus `calculate_sum` sera transformé en :

```json
{
  "name": "calculate_sum",
  "description": "Adds two integers together.",
  "input_schema": {
    "additionalProperties": false,
    "properties": {
      "left": {
        "description": "The first integer to add.",
        "title": "Left",
        "type": "integer"
      },
      "right": {
        "description": "The second integer to add.",
        "title": "Right",
        "type": "integer"
      }
    },
    "required": ["left", "right"],
    "type": "object"
  }
}
```

### Itération sur l'exécuteur d'outils

L'exécuteur d'outils retourné par `tool_runner()` est un itérable, que vous pouvez itérer avec une boucle `for`. Ceci est souvent appelé une "boucle d'appel d'outil".
Chaque itération de boucle produit un message qui a été retourné par Claude.

Après que votre code ait eu la chance de traiter le message actuel à l'intérieur de la boucle, l'exécuteur d'outils vérifiera le message pour voir si Claude a demandé une utilisation d'outil. Si c'est le cas, il appellera l'outil et enverra automatiquement le résultat de l'outil à Claude, puis produira le message suivant de Claude pour commencer l'itération suivante de votre boucle.

Vous pouvez terminer la boucle à n'importe quelle itération avec une simple déclaration `break`. L'exécuteur d'outils bouclera jusqu'à ce que Claude retourne un message sans utilisation d'outil.

Si vous ne vous souciez pas des messages intermédiaires, au lieu d'utiliser une boucle, vous pouvez appeler la méthode `until_done()`, qui retournera le message final de Claude :

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather, calculate_sum],
    messages=[
        {"role": "user", "content": "What's the weather like in Paris? Also, what's 15 + 27?"}
    ]
)
final_message = runner.until_done()
print(final_message.content[0].text)
```

### Utilisation avancée

Dans la boucle, vous avez la possibilité de personnaliser complètement la prochaine requête de l'exécuteur d'outils à l'API Messages.
La méthode `runner.generate_tool_call_response()` appellera l'outil (si Claude a déclenché une utilisation d'outil) et vous donnera accès au résultat de l'outil qui sera envoyé à l'API Messages.
Les méthodes `runner.set_messages_params()` et `runner.append_messages()` vous permettent de modifier les paramètres pour la prochaine requête API Messages.

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[get_weather],
    messages=[{"role": "user", "content": "What's the weather in San Francisco?"}]
)
for message in runner:
    # Get the tool response that will be sent
    tool_response = runner.generate_tool_call_response()

    # Customize the next request
    runner.set_messages_params(lambda params: {
        **params,
        "max_tokens": 2048  # Increase tokens for next request
    })

    # Or add additional messages
    runner.append_messages(
        {"role": "user", "content": "Please be concise in your response."}
    )
```

### Streaming

Lors de l'activation du streaming avec `stream=True`, chaque valeur émise par l'exécuteur d'outils est un `BetaMessageStream` tel que retourné par `anthropic.messages.stream()`. Le `BetaMessageStream` est lui-même un itérable qui produit des événements de streaming de l'API Messages.

Vous pouvez utiliser `message_stream.get_final_message()` pour laisser le SDK faire l'accumulation des événements de streaming dans le message final pour vous.

```python
runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[calculate_sum],
    messages=[{"role": "user", "content": "What is 15 + 27?"}],
    stream=True
)

# When streaming, the runner returns BetaMessageStream
for message_stream in runner:
    for event in message_stream:
        print('event:', event)
    print('message:', message_stream.get_final_message())

print(runner.until_done())
```

</Tab>
<Tab title="TypeScript (Zod)">

### Utilisation de base

Utilisez `betaZodTool()` pour les définitions d'outils type-safe avec validation Zod (nécessite Zod 3.25.0 ou supérieur).

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaZodTool (requires Zod 3.25.0+)
const getWeatherTool = betaZodTool({
  name: 'get_weather',
  description: 'Get the current weather in a given location',
  inputSchema: z.object({
    location: z.string().describe('The city and state, e.g. San Francisco, CA'),
    unit: z.enum(['celsius', 'fahrenheit']).default('fahrenheit')
      .describe('Temperature unit')
  }),
  run: async (input) => {
    // In a full implementation, you'd call a weather API here
    return JSON.stringify({temperature: '20°C', condition: 'Sunny'});
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    {
      role: 'user',
      content: "What's the weather like in Paris?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

La fonction `run` doit retourner un bloc de contenu ou un tableau de blocs de contenu, y compris du texte, des images ou des blocs de documents. Cela permet aux outils de retourner des réponses riches et multimodales. Les chaînes retournées seront converties en bloc de contenu texte.
Si vous voulez retourner un objet JSON structuré à Claude, stringifiez-le en chaîne JSON avant de le retourner. Les nombres, booléens ou autres primitives non-chaîne doivent également être convertis en chaînes.

### Itération sur l'exécuteur d'outils

L'exécuteur d'outils retourné par `toolRunner()` est un itérable asynchrone, que vous pouvez itérer avec une boucle `for await ... of`. Ceci est souvent appelé une "boucle d'appel d'outil".
Chaque itération de boucle produit un message qui a été retourné par Claude.

Après que votre code ait eu la chance de traiter le message actuel à l'intérieur de la boucle, l'exécuteur d'outils vérifiera le message pour voir si Claude a demandé une utilisation d'outil. Si c'est le cas, il appellera l'outil et enverra automatiquement le résultat de l'outil à Claude, puis produira le message suivant de Claude pour commencer l'itération suivante de votre boucle.

Vous pouvez terminer la boucle à n'importe quelle itération avec une simple déclaration `break`. L'exécuteur d'outils bouclera jusqu'à ce que Claude retourne un message sans utilisation d'outil.

Si vous ne vous souciez pas des messages intermédiaires, au lieu d'utiliser une boucle, vous pouvez simplement `await` l'exécuteur d'outils, qui retournera le message final de Claude.

### Utilisation avancée

Dans la boucle, vous avez la possibilité de personnaliser complètement la prochaine requête de l'exécuteur d'outils à l'API Messages.
La méthode `runner.generateToolResponse()` appellera l'outil (si Claude a déclenché une utilisation d'outil) et vous donnera accès au résultat de l'outil qui sera envoyé à l'API Messages.
Les méthodes `runner.setMessagesParams()` et `runner.pushMessages()` vous permettent de modifier les paramètres pour la prochaine requête API Messages. Les paramètres actuels sont disponibles sous `runner.params`.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### Streaming

Lors de l'activation du streaming avec `stream: true`, chaque valeur émise par l'exécuteur d'outils est un `MessageStream` tel que retourné par `anthropic.messages.stream()`. Le `MessageStream` est lui-même un itérable asynchrone qui produit des événements de streaming de l'API Messages.

Vous pouvez utiliser `messageStream.finalMessage()` pour laisser le SDK faire l'accumulation des événements de streaming dans le message final pour vous.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="TypeScript (JSON Schema)">

### Utilisation de base

Utilisez `betaTool()` pour les définitions d'outils type-safe basées sur les schémas JSON. TypeScript et votre éditeur seront conscients du type du paramètre `input` pour l'autocomplétion.

<Note>
L'entrée générée par Claude ne sera pas validée à l'exécution. Effectuez la validation à l'intérieur de la fonction `run` si nécessaire.
</Note>

```typescript
import { Anthropic } from '@anthropic-ai/sdk';
import { betaZodTool, betaTool } from '@anthropic-ai/sdk/helpers/beta/json-schema';
import { z } from 'zod';

const anthropic = new Anthropic();

// Using betaTool with JSON schema (no Zod required)
const calculateSumTool = betaTool({
  name: 'calculate_sum',
  description: 'Add two numbers together',
  inputSchema: {
    type: 'object',
    properties: {
      a: { type: 'number', description: 'First number' },
      b: { type: 'number', description: 'Second number' }
    },
    required: ['a', 'b']
  },
  run: async (input) => {
    return String(input.a + input.b);
  }
});

// Use the tool runner
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool, calculateSumTool],
  messages: [
    {
      role: 'user',
      content: "What's 15 + 27?"
    }
  ]
});

// Process messages as they come in
for await (const message of runner) {
  console.log(message.content[0].text);
}
```

La fonction `run` doit retourner n'importe quel bloc de contenu ou tableau de blocs de contenu, y compris du texte, des images ou des blocs de documents. Cela permet aux outils de retourner des réponses riches et multimodales. Les chaînes retournées seront converties en bloc de contenu texte.
Si vous voulez retourner un objet JSON structuré à Claude, encodez-le en chaîne JSON avant de le retourner. Les nombres, booléens ou autres primitives non-chaîne doivent également être convertis en chaînes.

### Itération sur l'exécuteur d'outils

L'exécuteur d'outils retourné par `toolRunner()` est un itérable asynchrone, que vous pouvez itérer avec une boucle `for await ... of`. Ceci est souvent appelé une "boucle d'appel d'outil".
Chaque itération de boucle produit un message qui a été retourné par Claude.

Après que votre code ait eu la chance de traiter le message actuel à l'intérieur de la boucle, l'exécuteur d'outils vérifiera le message pour voir si Claude a demandé une utilisation d'outil. Si c'est le cas, il appellera l'outil et enverra automatiquement le résultat de l'outil à Claude, puis produira le message suivant de Claude pour commencer l'itération suivante de votre boucle.

Vous pouvez terminer la boucle à n'importe quelle itération avec une simple déclaration `break`. L'exécuteur d'outils bouclera jusqu'à ce que Claude retourne un message sans utilisation d'outil.

Si vous ne vous souciez pas des messages intermédiaires, au lieu d'utiliser une boucle, vous pouvez simplement `await` l'exécuteur d'outils, qui retournera le message final de Claude.

### Utilisation avancée

Dans la boucle, vous avez la possibilité de personnaliser complètement la prochaine requête de l'exécuteur d'outils à l'API Messages.
La méthode `runner.generateToolResponse()` appellera l'outil (si Claude a déclenché une utilisation d'outil) et vous donnera accès au résultat de l'outil qui sera envoyé à l'API Messages.
Les méthodes `runner.setMessagesParams()` et `runner.pushMessages()` vous permettent de modifier les paramètres pour la prochaine requête API Messages. Les paramètres actuels sont disponibles sous `runner.params`.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  tools: [getWeatherTool],
  messages: [
    { role: 'user', content: "What's the weather in San Francisco?" }
  ]
});

for await (const message of runner) {
  // Get the tool response that will be sent
  const toolResponse = await runner.generateToolResponse();

  // Customize the next request
  runner.setMessagesParams(params => ({
    ...params,
    max_tokens: 2048  // Increase tokens for next request
  }));

  // Or add additional messages
  runner.pushMessages(
    { role: 'user', content: 'Please be concise in your response.' }
  );
}
```

### Streaming

Lors de l'activation du streaming avec `stream: true`, chaque valeur émise par l'exécuteur d'outils est un `MessageStream` tel que retourné par `anthropic.messages.stream()`. Le `MessageStream` est lui-même un itérable asynchrone qui produit des événements de streaming de l'API Messages.

Vous pouvez utiliser `messageStream.finalMessage()` pour laisser le SDK faire l'accumulation des événements de streaming dans le message final pour vous.

```typescript
const runner = anthropic.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'What is the weather in San Francisco?' }],
  tools: [calculatorTool],
  stream: true,
});

// When streaming, the runner returns BetaMessageStream
for await (const messageStream of runner) {
  for await (const event of messageStream) {
    console.log('event:', event);
  }
  console.log('message:', await messageStream.finalMessage());
}

console.log(await runner);
```

</Tab>
<Tab title="Ruby">

### Utilisation de base

Définissez les outils en utilisant `Anthropic::BaseTool` avec un schéma d'entrée, puis utilisez `client.beta.messages.tool_runner` pour les exécuter.

```ruby
require "anthropic"

# Initialize client
client = Anthropic::Client.new

# Define input schema
class GetWeatherInput < Anthropic::BaseModel
  required :location, String, doc: "The city and state, e.g. San Francisco, CA"
  optional :unit, Anthropic::InputSchema::EnumOf["celsius", "fahrenheit"],
           doc: "Temperature unit"
end

# Define tool
class GetWeather < Anthropic::BaseTool
  doc "Get the current weather in a given location"
  input_schema GetWeatherInput

  def call(input)
    # In a full implementation, you'd call a weather API here
    JSON.generate({temperature: "20°C", condition: "Sunny"})
  end
end

class CalculateSumInput < Anthropic::BaseModel
  required :a, Integer, doc: "First number"
  required :b, Integer, doc: "Second number"
end

class CalculateSum < Anthropic::BaseTool
  doc "Add two numbers together"
  input_schema CalculateSumInput

  def call(input)
    (input.a + input.b).to_s
  end
end

# Use the tool runner
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

runner.each_message do |message|
  message.content.each do |block|
    puts block.text if block.respond_to?(:text)
  end
end
```

La méthode `call` doit retourner une chaîne ou un tableau de blocs de contenu. Si vous voulez retourner un objet JSON structuré à Claude, encodez-le en chaîne JSON avant de le retourner.

La classe `Anthropic::BaseTool` utilise la méthode `doc` pour la description de l'outil et `input_schema` pour définir les paramètres attendus. Le SDK convertira automatiquement cela au format de schéma JSON approprié.

### Itération sur l'exécuteur d'outils

L'exécuteur d'outils fournit une méthode `each_message` qui produit chaque message au fur et à mesure que la conversation progresse. Ceci est souvent appelé une "boucle d'appel d'outil".

Après que votre code ait eu la chance de traiter le message actuel, l'exécuteur d'outils vérifiera si Claude a demandé une utilisation d'outil. Si c'est le cas, il appellera l'outil et enverra automatiquement le résultat de l'outil à Claude, puis produira le message suivant.

Si vous ne vous souciez pas des messages intermédiaires, vous pouvez utiliser la méthode `run_until_finished` pour obtenir tous les messages à la fois :

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new, CalculateSum.new],
  messages: [
    {role: "user", content: "What's the weather like in Paris? Also, what's 15 + 27?"}
  ]
)

all_messages = runner.run_until_finished
all_messages.each { |msg| puts msg.content }
```

### Utilisation avancée

L'exécuteur d'outils fournit plusieurs méthodes pour personnaliser le comportement :

- `#next_message` - Parcourez manuellement la conversation un message à la fois
- `#feed_messages` - Injectez des messages supplémentaires au milieu de la conversation
- `#params` - Accédez ou modifiez les paramètres de requête actuels

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [GetWeather.new],
  messages: [{role: "user", content: "What's the weather in San Francisco?"}]
)

# Manual step-by-step control
message = runner.next_message
puts message.content

# Inject follow-up messages
runner.feed_messages([
  {role: "user", content: "Also check Boston"}
])

# Access current parameters
puts runner.params
```

### Streaming

Lors de l'utilisation du streaming, itérez avec `each_streaming` pour recevoir les événements en temps réel :

```ruby
runner = client.beta.messages.tool_runner(
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [CalculateSum.new],
  messages: [{role: "user", content: "What is 15 + 27?"}]
)

runner.each_streaming do |event|
  case event
  when Anthropic::Streaming::TextEvent
    print event.text
  when Anthropic::Streaming::ToolUseEvent
    puts "\nTool called: #{event.tool_name}"
  end
end
```

</Tab>
</Tabs>

<Note>
L'exécuteur d'outils du SDK est en bêta. Le reste de ce document couvre l'implémentation manuelle des outils.
</Note>

## Contrôler la sortie de Claude

### Forcer l'utilisation d'outils

Dans certains cas, vous pouvez vouloir que Claude utilise un outil spécifique pour répondre à la question de l'utilisateur, même si Claude pense pouvoir fournir une réponse sans utiliser un outil. Vous pouvez le faire en spécifiant l'outil dans le champ `tool_choice` comme suit :

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

Lorsque vous travaillez avec le paramètre tool_choice, nous avons quatre options possibles :

- `auto` permet à Claude de décider s'il doit appeler l'un des outils fournis ou non. C'est la valeur par défaut quand des `tools` sont fournis.
- `any` indique à Claude qu'il doit utiliser l'un des outils fournis, mais ne force pas un outil particulier.
- `tool` nous permet de forcer Claude à toujours utiliser un outil particulier.
- `none` empêche Claude d'utiliser n'importe quel outil. C'est la valeur par défaut quand aucun `tools` n'est fourni.

<Note>
Lors de l'utilisation de la [mise en cache des invites](/docs/fr/build-with-claude/prompt-caching#what-invalidates-the-cache), les modifications du paramètre `tool_choice` invalideront les blocs de messages en cache. Les définitions d'outils et les invites système restent en cache, mais le contenu des messages doit être retraité.
</Note>

Ce diagramme illustre comment chaque option fonctionne :

<Frame>
  ![Image](/docs/images/tool_choice.png)
</Frame>

Notez que lorsque vous avez `tool_choice` comme `any` ou `tool`, nous préremplirons le message de l'assistant pour forcer l'utilisation d'un outil. Cela signifie que les modèles n'émettront pas de réponse en langage naturel ou d'explication avant les blocs de contenu `tool_use`, même s'ils sont explicitement demandés.

<Note>
Lors de l'utilisation de la [réflexion étendue](/docs/fr/build-with-claude/extended-thinking) avec l'utilisation d'outils, `tool_choice: {"type": "any"}` et `tool_choice: {"type": "tool", "name": "..."}` ne sont pas supportés et entraîneront une erreur. Seuls `tool_choice: {"type": "auto"}` (par défaut) et `tool_choice: {"type": "none"}` sont compatibles avec la réflexion étendue.
</Note>

Nos tests ont montré que cela ne devrait pas réduire les performances. Si vous souhaitez que le modèle fournisse un contexte en langage naturel ou des explications tout en demandant au modèle d'utiliser un outil spécifique, vous pouvez utiliser `{"type": "auto"}` pour `tool_choice` (par défaut) et ajouter des instructions explicites dans un message `user`. Par exemple : `What's the weather like in London? Use the get_weather tool in your response.`

<Tip>
**Appels d'outils garantis avec des outils stricts**

Combinez `tool_choice: {"type": "any"}` avec l'[utilisation d'outils stricts](/docs/fr/build-with-claude/structured-outputs) pour garantir à la fois qu'un de vos outils sera appelé ET que les entrées d'outils suivront strictement votre schéma. Définissez `strict: true` sur vos définitions d'outils pour activer la validation du schéma.
</Tip>

### Sortie JSON

Les outils ne doivent pas nécessairement être des fonctions clients — vous pouvez utiliser des outils chaque fois que vous voulez que le modèle retourne une sortie JSON qui suit un schéma fourni. Par exemple, vous pourriez utiliser un outil `record_summary` avec un schéma particulier. Voir [Utilisation d'outils avec Claude](/docs/fr/agents-and-tools/tool-use/overview) pour un exemple complet fonctionnant.

### Réponses du modèle avec des outils

Lors de l'utilisation d'outils, Claude commentera souvent ce qu'il fait ou répondra naturellement à l'utilisateur avant d'invoquer les outils.

Par exemple, étant donné l'invite « Quel temps fait-il à San Francisco en ce moment, et quelle heure est-il là-bas ? », Claude pourrait répondre avec :

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll help you check the current weather and time in San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    }
  ]
}
```

Ce style de réponse naturelle aide les utilisateurs à comprendre ce que Claude fait et crée une interaction plus conversationnelle. Vous pouvez guider le style et le contenu de ces réponses par le biais de vos invites système et en fournissant des `<examples>` dans vos invites.

Il est important de noter que Claude peut utiliser diverses formulations et approches pour expliquer ses actions. Votre code doit traiter ces réponses comme n'importe quel autre texte généré par l'assistant, et ne pas s'appuyer sur des conventions de formatage spécifiques.

### Utilisation parallèle d'outils

Par défaut, Claude peut utiliser plusieurs outils pour répondre à une requête utilisateur. Vous pouvez désactiver ce comportement en :

- Définissant `disable_parallel_tool_use=true` lorsque le type tool_choice est `auto`, ce qui garantit que Claude utilise **au maximum un** outil
- Définissant `disable_parallel_tool_use=true` lorsque le type tool_choice est `any` ou `tool`, ce qui garantit que Claude utilise **exactement un** outil

<section title="Exemple complet d'utilisation parallèle d'outils">

<Note>
**Plus simple avec Tool runner** : L'exemple ci-dessous montre la gestion manuelle des outils parallèles. Pour la plupart des cas d'usage, [tool runner](#tool-runner-beta) gère automatiquement l'exécution parallèle des outils avec beaucoup moins de code.
</Note>

Voici un exemple complet montrant comment formater correctement les appels d'outils parallèles dans l'historique des messages :

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Define tools
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
    },
    {
        "name": "get_time",
        "description": "Get the current time in a given timezone",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "The timezone, e.g. America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Initial request
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=[
        {
            "role": "user",
            "content": "What's the weather in SF and NYC, and what time is it there?"
        }
    ]
)

# Claude's response with parallel tool calls
print("Claude wants to use tools:", response.stop_reason == "tool_use")
print("Number of tool calls:", len([c for c in response.content if c.type == "tool_use"]))

# Build the conversation with tool results
messages = [
    {
        "role": "user",
        "content": "What's the weather in SF and NYC, and what time is it there?"
    },
    {
        "role": "assistant",
        "content": response.content  # Contains multiple tool_use blocks
    },
    {
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": "toolu_01",  # Must match the ID from tool_use
                "content": "San Francisco: 68°F, partly cloudy"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_02",
                "content": "New York: 45°F, clear skies"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_03",
                "content": "San Francisco time: 2:30 PM PST"
            },
            {
                "type": "tool_result",
                "tool_use_id": "toolu_04",
                "content": "New York time: 5:30 PM EST"
            }
        ]
    }
]

# Get final response
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

print(final_response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Define tools
const tools = [
  {
    name: "get_weather",
    description: "Get the current weather in a given location",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Get the current time in a given timezone",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "The timezone, e.g. America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

// Initial request
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: [
    {
      role: "user",
      content: "What's the weather in SF and NYC, and what time is it there?"
    }
  ]
});

// Build conversation with tool results
const messages = [
  {
    role: "user",
    content: "What's the weather in SF and NYC, and what time is it there?"
  },
  {
    role: "assistant",
    content: response.content  // Contains multiple tool_use blocks
  },
  {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "toolu_01",  // Must match the ID from tool_use
        content: "San Francisco: 68°F, partly cloudy"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_02",
        content: "New York: 45°F, clear skies"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_03",
        content: "San Francisco time: 2:30 PM PST"
      },
      {
        type: "tool_result",
        tool_use_id: "toolu_04",
        content: "New York time: 5:30 PM EST"
      }
    ]
  }
];

// Get final response
const finalResponse = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: messages
});

console.log(finalResponse.content[0].text);
```
</CodeGroup>

Le message assistant avec appels d'outils parallèles ressemblerait à ceci :

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the weather and time for both San Francisco and New York City."
    },
    {
      "type": "tool_use",
      "id": "toolu_01",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA"}
    },
    {
      "type": "tool_use",
      "id": "toolu_02",
      "name": "get_weather",
      "input": {"location": "New York, NY"}
    },
    {
      "type": "tool_use",
      "id": "toolu_03",
      "name": "get_time",
      "input": {"timezone": "America/Los_Angeles"}
    },
    {
      "type": "tool_use",
      "id": "toolu_04",
      "name": "get_time",
      "input": {"timezone": "America/New_York"}
    }
  ]
}
```

</section>
<section title="Script de test complet pour les outils parallèles">

Voici un script complet et exécutable pour tester et vérifier que les appels d'outils parallèles fonctionnent correctement :

<CodeGroup>
```python Python
#!/usr/bin/env python3
"""Test script to verify parallel tool calls with the Claude API"""

import os
from anthropic import Anthropic

# Initialize client
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# Define tools
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
    },
    {
        "name": "get_time",
        "description": "Get the current time in a given timezone",
        "input_schema": {
            "type": "object",
            "properties": {
                "timezone": {
                    "type": "string",
                    "description": "The timezone, e.g. America/New_York"
                }
            },
            "required": ["timezone"]
        }
    }
]

# Test conversation with parallel tool calls
messages = [
    {
        "role": "user",
        "content": "What's the weather in SF and NYC, and what time is it there?"
    }
]

# Make initial request
print("Requesting parallel tool calls...")
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

# Check for parallel tool calls
tool_uses = [block for block in response.content if block.type == "tool_use"]
print(f"\n✓ Claude made {len(tool_uses)} tool calls")

if len(tool_uses) > 1:
    print("✓ Parallel tool calls detected!")
    for tool in tool_uses:
        print(f"  - {tool.name}: {tool.input}")
else:
    print("✗ No parallel tool calls detected")

# Simulate tool execution and format results correctly
tool_results = []
for tool_use in tool_uses:
    if tool_use.name == "get_weather":
        if "San Francisco" in str(tool_use.input):
            result = "San Francisco: 68°F, partly cloudy"
        else:
            result = "New York: 45°F, clear skies"
    else:  # get_time
        if "Los_Angeles" in str(tool_use.input):
            result = "2:30 PM PST"
        else:
            result = "5:30 PM EST"

    tool_results.append({
        "type": "tool_result",
        "tool_use_id": tool_use.id,
        "content": result
    })

# Continue conversation with tool results
messages.extend([
    {"role": "assistant", "content": response.content},
    {"role": "user", "content": tool_results}  # All results in one message!
])

# Get final response
print("\nGetting final response...")
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

print(f"\nClaude's response:\n{final_response.content[0].text}")

# Verify formatting
print("\n--- Verification ---")
print(f"✓ Tool results sent in single user message: {len(tool_results)} results")
print("✓ No text before tool results in content array")
print("✓ Conversation formatted correctly for future parallel tool use")
```

```typescript TypeScript
#!/usr/bin/env node
// Test script to verify parallel tool calls with the Claude API

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Define tools
const tools = [
  {
    name: "get_weather",
    description: "Get the current weather in a given location",
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        }
      },
      required: ["location"]
    }
  },
  {
    name: "get_time",
    description: "Get the current time in a given timezone",
    input_schema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description: "The timezone, e.g. America/New_York"
        }
      },
      required: ["timezone"]
    }
  }
];

async function testParallelTools() {
  // Make initial request
  console.log("Requesting parallel tool calls...");
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: "What's the weather in SF and NYC, and what time is it there?"
    }],
    tools: tools
  });

  // Check for parallel tool calls
  const toolUses = response.content.filter(block => block.type === "tool_use");
  console.log(`\n✓ Claude made ${toolUses.length} tool calls`);

  if (toolUses.length > 1) {
    console.log("✓ Parallel tool calls detected!");
    toolUses.forEach(tool => {
      console.log(`  - ${tool.name}: ${JSON.stringify(tool.input)}`);
    });
  } else {
    console.log("✗ No parallel tool calls detected");
  }

  // Simulate tool execution and format results correctly
  const toolResults = toolUses.map(toolUse => {
    let result;
    if (toolUse.name === "get_weather") {
      result = toolUse.input.location.includes("San Francisco")
        ? "San Francisco: 68°F, partly cloudy"
        : "New York: 45°F, clear skies";
    } else {
      result = toolUse.input.timezone.includes("Los_Angeles")
        ? "2:30 PM PST"
        : "5:30 PM EST";
    }

    return {
      type: "tool_result",
      tool_use_id: toolUse.id,
      content: result
    };
  });

  // Get final response with correct formatting
  console.log("\nGetting final response...");
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      { role: "user", content: "What's the weather in SF and NYC, and what time is it there?" },
      { role: "assistant", content: response.content },
      { role: "user", content: toolResults }  // All results in one message!
    ],
    tools: tools
  });

  console.log(`\nClaude's response:\n${finalResponse.content[0].text}`);

  // Verify formatting
  console.log("\n--- Verification ---");
  console.log(`✓ Tool results sent in single user message: ${toolResults.length} results`);
  console.log("✓ No text before tool results in content array");
  console.log("✓ Conversation formatted correctly for future parallel tool use");
}

testParallelTools().catch(console.error);
```
</CodeGroup>

Ce script démontre :
- Comment formater correctement les appels d'outils parallèles et les résultats
- Comment vérifier que les appels parallèles sont en cours
- La structure de message correcte qui encourage l'utilisation future d'outils parallèles
- Les erreurs courantes à éviter (comme le texte avant les résultats des outils)

Exécutez ce script pour tester votre implémentation et vous assurer que Claude effectue des appels d'outils parallèles efficacement.

</section>

#### Maximiser l'utilisation parallèle d'outils

Bien que les modèles Claude 4 aient d'excellentes capacités d'utilisation parallèle d'outils par défaut, vous pouvez augmenter la probabilité d'exécution parallèle d'outils sur tous les modèles avec un invite ciblée :

<section title="Invites système pour l'utilisation parallèle d'outils">

Pour les modèles Claude 4 (Opus 4 et Sonnet 4), ajoutez ceci à votre invite système :
```text
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```

Pour une utilisation parallèle d'outils encore plus forte (recommandée si la valeur par défaut n'est pas suffisante), utilisez :
```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
</use_parallel_tool_calls>
```

</section>
<section title="Invite de message utilisateur">

Vous pouvez également encourager l'utilisation parallèle d'outils dans des messages utilisateur spécifiques :

```python
# Instead of:
"What's the weather in Paris? Also check London."

# Use:
"Check the weather in Paris and London simultaneously."

# Or be explicit:
"Please use parallel tool calls to get the weather for Paris, London, and Tokyo at the same time."
```

</section>

<Warning>
**Utilisation parallèle d'outils avec Claude Sonnet 3.7**

Claude Sonnet 3.7 peut être moins susceptible de faire des appels d'outils parallèles dans une réponse, même si vous n'avez pas défini `disable_parallel_tool_use`. Nous recommandons de [passer aux modèles Claude 4](/docs/fr/about-claude/models/migrating-to-claude-4), qui ont une utilisation d'outils efficace en termes de jetons et un appel d'outils parallèles amélioré.

Si vous utilisez toujours Claude Sonnet 3.7, vous pouvez activer l'en-tête bêta `token-efficient-tools-2025-02-19` [beta header](/docs/fr/api/beta-headers), qui aide à encourager Claude à utiliser des outils parallèles. Vous pouvez également introduire un « outil batch » qui peut agir comme un méta-outil pour envelopper les invocations d'autres outils simultanément.

Consultez [cet exemple](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb) dans notre cookbook pour savoir comment utiliser cette solution de contournement.

</Warning>

## Gestion des blocs de contenu d'utilisation d'outils et de résultats d'outils

<Note>
**Plus simple avec Tool runner** : La gestion manuelle des outils décrite dans cette section est gérée automatiquement par [tool runner](#tool-runner-beta). Utilisez cette section lorsque vous avez besoin d'un contrôle personnalisé sur l'exécution des outils.
</Note>

La réponse de Claude diffère selon qu'il utilise un outil client ou serveur.

### Gestion des résultats des outils clients

La réponse aura une `stop_reason` de `tool_use` et un ou plusieurs blocs de contenu `tool_use` qui incluent :

- `id` : Un identifiant unique pour ce bloc d'utilisation d'outil particulier. Ceci sera utilisé pour faire correspondre les résultats des outils plus tard.
- `name` : Le nom de l'outil utilisé.
- `input` : Un objet contenant l'entrée transmise à l'outil, conforme à l'`input_schema` de l'outil.

<section title="Exemple de réponse API avec un bloc de contenu `tool_use`">

```json JSON
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-sonnet-4-5",
  "stop_reason": "tool_use",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll check the current weather in San Francisco for you."
    },
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {"location": "San Francisco, CA", "unit": "celsius"}
    }
  ]
}
```

</section>

Lorsque vous recevez une réponse d'utilisation d'outil pour un outil client, vous devez :

1. Extraire le `name`, l'`id` et l'`input` du bloc `tool_use`.
2. Exécuter l'outil réel dans votre base de code correspondant à ce nom d'outil, en transmettant l'`input` de l'outil.
3. Continuer la conversation en envoyant un nouveau message avec le `role` de `user`, et un bloc `content` contenant le type `tool_result` et les informations suivantes :
   - `tool_use_id` : L'`id` de la demande d'utilisation d'outil pour laquelle ceci est un résultat.
   - `content` : Le résultat de l'outil, sous forme de chaîne (par exemple `"content": "15 degrees"`), une liste de blocs de contenu imbriqués (par exemple `"content": [{"type": "text", "text": "15 degrees"}]`), ou une liste de blocs de documents (par exemple `"content": ["type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 degrees"}]`). Ces blocs de contenu peuvent utiliser les types `text`, `image` ou `document`.
   - `is_error` (optionnel) : Définissez à `true` si l'exécution de l'outil a entraîné une erreur.

<Note>
**Exigences de formatage importantes** :
- Les blocs de résultats d'outils doivent immédiatement suivre leurs blocs d'utilisation d'outils correspondants dans l'historique des messages. Vous ne pouvez pas inclure de messages entre le message d'utilisation d'outil de l'assistant et le message de résultat d'outil de l'utilisateur.
- Dans le message utilisateur contenant les résultats des outils, les blocs tool_result doivent venir EN PREMIER dans le tableau de contenu. Tout texte doit venir APRÈS tous les résultats des outils.

Par exemple, ceci causera une erreur 400 :
```json
{"role": "user", "content": [
  {"type": "text", "text": "Here are the results:"},  // ❌ Text before tool_result
  {"type": "tool_result", "tool_use_id": "toolu_01", ...}
]}
```

Ceci est correct :
```json
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", ...},
  {"type": "text", "text": "What should I do next?"}  // ✅ Text after tool_result
]}
```

Si vous recevez une erreur comme « tool_use ids were found without tool_result blocks immediately after », vérifiez que vos résultats d'outils sont formatés correctement.
</Note>

<section title="Exemple de résultat d'outil réussi">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "15 degrees"
    }
  ]
}
```

</section>

<section title="Exemple de résultat d'outil avec des images">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "15 degrees"},
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRg...",
          }
        }
      ]
    }
  ]
}
```

</section>
<section title="Exemple de résultat d'outil vide">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
    }
  ]
}
```

</section>

<section title="Exemple de résultat d'outil avec des documents">

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": [
        {"type": "text", "text": "The weather is"},
        {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "15 degrees"
          }
        }
      ]
    }
  ]
}
```

</section>

Après avoir reçu le résultat de l'outil, Claude utilisera ces informations pour continuer à générer une réponse à l'invite utilisateur d'origine.

### Gestion des résultats des outils serveur

Claude exécute l'outil en interne et incorpore les résultats directement dans sa réponse sans nécessiter d'interaction utilisateur supplémentaire.

<Tip>
  **Différences par rapport aux autres API**

Contrairement aux API qui séparent l'utilisation d'outils ou utilisent des rôles spéciaux comme `tool` ou `function`, l'API Claude intègre les outils directement dans la structure des messages `user` et `assistant`.

Les messages contiennent des tableaux de blocs `text`, `image`, `tool_use` et `tool_result`. Les messages `user` incluent le contenu client et `tool_result`, tandis que les messages `assistant` contiennent le contenu généré par l'IA et `tool_use`.

</Tip>

### Gestion de la raison d'arrêt `max_tokens`

Si la [réponse de Claude est coupée en raison du dépassement de la limite `max_tokens`](/docs/fr/build-with-claude/handling-stop-reasons#max-tokens), et que la réponse tronquée contient un bloc tool_use incomplet, vous devrez relancer la demande avec une valeur `max_tokens` plus élevée pour obtenir l'utilisation d'outil complète.

<CodeGroup>
```python Python
# Check if response was truncated during tool use
if response.stop_reason == "max_tokens":
    # Check if the last content block is an incomplete tool_use
    last_block = response.content[-1]
    if last_block.type == "tool_use":
        # Send the request with higher max_tokens
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,  # Increased limit
            messages=messages,
            tools=tools
        )
```

```typescript TypeScript
// Check if response was truncated during tool use
if (response.stop_reason === "max_tokens") {
  // Check if the last content block is an incomplete tool_use
  const lastBlock = response.content[response.content.length - 1];
  if (lastBlock.type === "tool_use") {
    // Send the request with higher max_tokens
    response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096, // Increased limit
      messages: messages,
      tools: tools
    });
  }
}
```
</CodeGroup>

#### Gestion de la raison d'arrêt `pause_turn`

Lors de l'utilisation d'outils serveur comme la recherche Web, l'API peut retourner une raison d'arrêt `pause_turn`, indiquant que l'API a mis en pause un tour de longue durée.

Voici comment gérer la raison d'arrêt `pause_turn` :

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Initial request with web search
response = client.messages.create(
    model="claude-3-7-sonnet-latest",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Search for comprehensive information about quantum computing breakthroughs in 2025"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 10
    }]
)

# Check if the response has pause_turn stop reason
if response.stop_reason == "pause_turn":
    # Continue the conversation with the paused content
    messages = [
        {"role": "user", "content": "Search for comprehensive information about quantum computing breakthroughs in 2025"},
        {"role": "assistant", "content": response.content}
    ]

    # Send the continuation request
    continuation = client.messages.create(
        model="claude-3-7-sonnet-latest",
        max_tokens=1024,
        messages=messages,
        tools=[{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 10
        }]
    )

    print(continuation)
else:
    print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Initial request with web search
const response = await anthropic.messages.create({
  model: "claude-3-7-sonnet-latest",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: "Search for comprehensive information about quantum computing breakthroughs in 2025"
    }
  ],
  tools: [{
    type: "web_search_20250305",
    name: "web_search",
    max_uses: 10
  }]
});

// Check if the response has pause_turn stop reason
if (response.stop_reason === "pause_turn") {
  // Continue the conversation with the paused content
  const messages = [
    { role: "user", content: "Search for comprehensive information about quantum computing breakthroughs in 2025" },
    { role: "assistant", content: response.content }
  ];

  // Send the continuation request
  const continuation = await anthropic.messages.create({
    model: "claude-3-7-sonnet-latest",
    max_tokens: 1024,
    messages: messages,
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 10
    }]
  });

  console.log(continuation);
} else {
  console.log(response);
}
```
</CodeGroup>

Lors de la gestion de `pause_turn` :
- **Continuer la conversation** : Transmettez la réponse mise en pause telle quelle dans une demande ultérieure pour permettre à Claude de continuer son tour
- **Modifier si nécessaire** : Vous pouvez éventuellement modifier le contenu avant de continuer si vous souhaitez interrompre ou rediriger la conversation
- **Préserver l'état des outils** : Incluez les mêmes outils dans la demande de continuation pour maintenir la fonctionnalité

## Dépannage des erreurs

<Note>
**Gestion d'erreur intégrée** : [Tool runner](#tool-runner-beta) fournit une gestion d'erreur automatique pour la plupart des scénarios courants. Cette section couvre la gestion d'erreur manuelle pour les cas d'usage avancés.
</Note>

Il existe plusieurs types d'erreurs qui peuvent survenir lors de l'utilisation d'outils avec Claude :

<section title="Erreur d'exécution d'outil">

Si l'outil lui-même génère une erreur lors de l'exécution (par exemple, une erreur réseau lors de la récupération des données météorologiques), vous pouvez retourner le message d'erreur dans le `content` avec `"is_error": true` :

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "ConnectionError: the weather service API is not available (HTTP 500)",
      "is_error": true
    }
  ]
}
```

Claude incorporera alors cette erreur dans sa réponse à l'utilisateur, par exemple « Je suis désolé, je n'ai pas pu récupérer la météo actuelle car l'API du service météorologique n'est pas disponible. Veuillez réessayer plus tard. »

</section>
<section title="Nom d'outil invalide">

Si la tentative d'utilisation d'un outil par Claude est invalide (par exemple, paramètres requis manquants), cela signifie généralement qu'il n'y avait pas assez d'informations pour que Claude utilise l'outil correctement. Votre meilleur pari pendant le développement est de relancer la demande avec des valeurs `description` plus détaillées dans vos définitions d'outils.

Cependant, vous pouvez également continuer la conversation avec un `tool_result` qui indique l'erreur, et Claude essaiera d'utiliser l'outil à nouveau avec les informations manquantes remplies :

```json JSON
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Missing required 'location' parameter",
      "is_error": true
    }
  ]
}
```

Si une demande d'outil est invalide ou manque de paramètres, Claude réessaiera 2-3 fois avec des corrections avant de s'excuser auprès de l'utilisateur.

<Tip>
Pour éliminer entièrement les appels d'outils invalides, utilisez [strict tool use](/docs/fr/build-with-claude/structured-outputs) avec `strict: true` sur vos définitions d'outils. Cela garantit que les entrées d'outils correspondront toujours exactement à votre schéma, évitant les paramètres manquants et les incompatibilités de type.
</Tip>

</section>
<section title="Balises \<search_quality_reflection>">

Pour empêcher Claude de réfléchir à la qualité de la recherche avec les balises \<search_quality_reflection>, ajoutez « Do not reflect on the quality of the returned search results in your response » à votre invite.

</section>
<section title="Erreurs d'outils serveur">

Lorsque les outils serveur rencontrent des erreurs (par exemple, des problèmes réseau avec la recherche Web), Claude gère ces erreurs de manière transparente et tente de fournir une réponse alternative ou une explication à l'utilisateur. Contrairement aux outils clients, vous n'avez pas besoin de gérer les résultats `is_error` pour les outils serveur.

Pour la recherche Web spécifiquement, les codes d'erreur possibles incluent :
- `too_many_requests` : Limite de débit dépassée
- `invalid_input` : Paramètre de requête de recherche invalide
- `max_uses_exceeded` : Nombre maximum d'utilisations de l'outil de recherche Web dépassé
- `query_too_long` : La requête dépasse la longueur maximale
- `unavailable` : Une erreur interne s'est produite

</section>
<section title="Les appels d'outils parallèles ne fonctionnent pas">

Si Claude ne fait pas d'appels d'outils parallèles comme prévu, vérifiez ces problèmes courants :

**1. Formatage incorrect des résultats d'outils**

Le problème le plus courant est de formater incorrectement les résultats des outils dans l'historique de la conversation. Cela « enseigne » à Claude d'éviter les appels parallèles.

Spécifiquement pour l'utilisation parallèle d'outils :
- ❌ **Incorrect** : Envoyer des messages utilisateur séparés pour chaque résultat d'outil
- ✅ **Correct** : Tous les résultats d'outils doivent être dans un seul message utilisateur

```json
// ❌ Ceci réduit l'utilisation parallèle d'outils
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}  // Separate message
]

// ✅ Ceci maintient l'utilisation parallèle d'outils
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}  // Single message
]
```

Consultez les [exigences de formatage général ci-dessus](#handling-tool-use-and-tool-result-content-blocks) pour les autres règles de formatage.

**2. Invite faible**

L'invite par défaut peut ne pas être suffisante. Utilisez un langage plus fort :

```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations,
invoke all relevant tools simultaneously rather than sequentially.
Prioritize calling tools in parallel whenever possible.
</use_parallel_tool_calls>
```

**3. Mesurer l'utilisation parallèle d'outils**

Pour vérifier que les appels d'outils parallèles fonctionnent :

```python
# Calculate average tools per tool-calling message
tool_call_messages = [msg for msg in messages if any(
    block.type == "tool_use" for block in msg.content
)]
total_tool_calls = sum(
    len([b for b in msg.content if b.type == "tool_use"])
    for msg in tool_call_messages
)
avg_tools_per_message = total_tool_calls / len(tool_call_messages)
print(f"Average tools per message: {avg_tools_per_message}")
# Should be > 1.0 if parallel calls are working
```

**4. Comportement spécifique au modèle**

- Claude Opus 4.5, Opus 4.1 et Sonnet 4 : Excellent pour l'utilisation parallèle d'outils avec un invite minimal
- Claude Sonnet 3.7 : Peut nécessiter une invite plus forte ou l'en-tête bêta `token-efficient-tools-2025-02-19` [beta header](/docs/fr/api/beta-headers). Envisagez de [passer à Claude 4](/docs/fr/about-claude/models/migrating-to-claude-4).
- Claude Haiku : Moins susceptible d'utiliser des outils parallèles sans invite explicite

</section>