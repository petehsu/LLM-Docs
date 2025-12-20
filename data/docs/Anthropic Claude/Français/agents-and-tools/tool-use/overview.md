# Utilisation d'outils avec Claude

Claude est capable d'interagir avec des outils et des fonctions, ce qui vous permet d'étendre les capacités de Claude pour effectuer une plus grande variété de tâches.

---

Claude est capable d'interagir avec des outils et des fonctions, ce qui vous permet d'étendre les capacités de Claude pour effectuer une plus grande variété de tâches.

<Tip>
  Apprenez tout ce que vous devez maîtriser sur l'utilisation d'outils avec Claude dans le cadre de nos nouveaux [cours](https://anthropic.skilljar.com/) ! Veuillez continuer à partager vos idées et suggestions en utilisant ce [formulaire](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

<Tip>
**Garantir la conformité du schéma avec l'utilisation stricte d'outils**

[Structured Outputs](/docs/fr/build-with-claude/structured-outputs) fournit une validation de schéma garantie pour les entrées d'outils. Ajoutez `strict: true` à vos définitions d'outils pour vous assurer que les appels d'outils de Claude correspondent toujours exactement à votre schéma—plus de décalages de type ou de champs manquants.

Parfait pour les agents de production où des paramètres d'outils invalides causeraient des défaillances. [Découvrez quand utiliser l'utilisation stricte d'outils →](/docs/fr/build-with-claude/structured-outputs#when-to-use-json-outputs-vs-strict-tool-use)
</Tip>

Voici un exemple de la façon de fournir des outils à Claude en utilisant l'API Messages :

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
    "messages": [
      {
        "role": "user",
        "content": "What is the weather like in San Francisco?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA",
                    }
                },
                "required": ["location"],
            },
        }
    ],
    messages=[{"role": "user", "content": "What's the weather like in San Francisco?"}],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [{
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
    }],
    messages: [{ 
      role: "user", 
      content: "Tell me the weather in San Francisco." 
    }]
  });

  console.log(response);
}

main().catch(console.error);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class GetWeatherExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        InputSchema schema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location",
                        Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"))))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_0)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(schema)
                        .build())
                .addUserMessage("What's the weather like in San Francisco?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```

</CodeGroup>

---

## Fonctionnement de l'utilisation d'outils

Claude prend en charge deux types d'outils :

1. **Outils clients** : Outils qui s'exécutent sur vos systèmes, qui incluent :
   - Les outils personnalisés définis par l'utilisateur que vous créez et implémentez
   - Les outils définis par Anthropic comme [l'utilisation d'ordinateur](/docs/fr/agents-and-tools/tool-use/computer-use-tool) et [l'éditeur de texte](/docs/fr/agents-and-tools/tool-use/text-editor-tool) qui nécessitent une implémentation client

2. **Outils serveur** : Outils qui s'exécutent sur les serveurs d'Anthropic, comme les outils [recherche web](/docs/fr/agents-and-tools/tool-use/web-search-tool) et [récupération web](/docs/fr/agents-and-tools/tool-use/web-fetch-tool). Ces outils doivent être spécifiés dans la demande API mais ne nécessitent pas d'implémentation de votre part.

<Note>
Les outils définis par Anthropic utilisent des types versionnés (par exemple, `web_search_20250305`, `text_editor_20250124`) pour assurer la compatibilité entre les versions de modèles.
</Note>

### Outils clients
Intégrez les outils clients avec Claude en suivant ces étapes :

<Steps>
  <Step title="Fournir à Claude les outils et une invite utilisateur">
    - Définissez les outils clients avec des noms, des descriptions et des schémas d'entrée dans votre demande API.
    - Incluez une invite utilisateur qui pourrait nécessiter ces outils, par exemple, « Quel est le temps à San Francisco ? »
  </Step>
  <Step title="Claude décide d'utiliser un outil">
    - Claude évalue si des outils peuvent aider à répondre à la requête de l'utilisateur.
    - Si oui, Claude construit une demande d'utilisation d'outil correctement formatée.
    - Pour les outils clients, la réponse API a un `stop_reason` de `tool_use`, signalant l'intention de Claude.
  </Step>
  <Step title="Exécuter l'outil et retourner les résultats">
    - Extrayez le nom et l'entrée de l'outil de la demande de Claude
    - Exécutez le code de l'outil sur votre système
    - Retournez les résultats dans un nouveau message `user` contenant un bloc de contenu `tool_result`
  </Step>
  <Step title="Claude utilise le résultat de l'outil pour formuler une réponse">
    - Claude analyse les résultats de l'outil pour formuler sa réponse finale à l'invite utilisateur d'origine.
  </Step>
</Steps>
Remarque : Les étapes 3 et 4 sont facultatives. Pour certains flux de travail, la demande d'utilisation d'outil de Claude (étape 2) pourrait être tout ce dont vous avez besoin, sans renvoyer les résultats à Claude.

### Outils serveur

Les outils serveur suivent un flux de travail différent :

<Steps>
  <Step title="Fournir à Claude les outils et une invite utilisateur">
    - Les outils serveur, comme [recherche web](/docs/fr/agents-and-tools/tool-use/web-search-tool) et [récupération web](/docs/fr/agents-and-tools/tool-use/web-fetch-tool), ont leurs propres paramètres.
    - Incluez une invite utilisateur qui pourrait nécessiter ces outils, par exemple, « Recherchez les dernières nouvelles sur l'IA » ou « Analysez le contenu à cette URL ».
  </Step>
  <Step title="Claude exécute l'outil serveur">
    - Claude évalue si un outil serveur peut aider à répondre à la requête de l'utilisateur.
    - Si oui, Claude exécute l'outil, et les résultats sont automatiquement incorporés dans la réponse de Claude.
  </Step>
  <Step title="Claude utilise le résultat de l'outil serveur pour formuler une réponse">
    - Claude analyse les résultats de l'outil serveur pour formuler sa réponse finale à l'invite utilisateur d'origine.
    - Aucune interaction utilisateur supplémentaire n'est nécessaire pour l'exécution de l'outil serveur.
  </Step>
</Steps>

---

## Utilisation des outils MCP avec Claude

Si vous construisez une application qui utilise le [Model Context Protocol (MCP)](https://modelcontextprotocol.io), vous pouvez utiliser les outils des serveurs MCP directement avec l'API Messages de Claude. Les définitions d'outils MCP utilisent un format de schéma similaire au format d'outil de Claude. Vous devez simplement renommer `inputSchema` en `input_schema`.

<Tip>
**Vous ne voulez pas construire votre propre client MCP ?** Utilisez le [connecteur MCP](/docs/fr/agents-and-tools/mcp-connector) pour vous connecter directement aux serveurs MCP distants à partir de l'API Messages sans implémenter un client.
</Tip>

### Conversion des outils MCP au format Claude

Lorsque vous construisez un client MCP et appelez `list_tools()` sur un serveur MCP, vous recevrez des définitions d'outils avec un champ `inputSchema`. Pour utiliser ces outils avec Claude, convertissez-les au format de Claude :

<CodeGroup>
```python Python
from mcp import ClientSession

async def get_claude_tools(mcp_session: ClientSession):
    """Convert MCP tools to Claude's tool format."""
    mcp_tools = await mcp_session.list_tools()

    claude_tools = []
    for tool in mcp_tools.tools:
        claude_tools.append({
            "name": tool.name,
            "description": tool.description or "",
            "input_schema": tool.inputSchema  # Rename inputSchema to input_schema
        })

    return claude_tools
```

```typescript TypeScript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

async function getClaudeTools(mcpClient: Client) {
  // Convert MCP tools to Claude's tool format
  const mcpTools = await mcpClient.listTools();

  return mcpTools.tools.map((tool) => ({
    name: tool.name,
    description: tool.description ?? "",
    input_schema: tool.inputSchema, // Rename inputSchema to input_schema
  }));
}
```
</CodeGroup>

Ensuite, transmettez ces outils convertis à Claude :

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()
claude_tools = await get_claude_tools(mcp_session)

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=claude_tools,
    messages=[{"role": "user", "content": "What tools do you have available?"}]
)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();
const claudeTools = await getClaudeTools(mcpClient);

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: claudeTools,
  messages: [{ role: "user", content: "What tools do you have available?" }],
});
```
</CodeGroup>

Lorsque Claude répond avec un bloc `tool_use`, exécutez l'outil sur votre serveur MCP en utilisant `call_tool()` et retournez le résultat à Claude dans un bloc `tool_result`.

Pour un guide complet sur la construction de clients MCP, consultez [Construire un client MCP](https://modelcontextprotocol.io/docs/develop/build-client).

---

## Exemples d'utilisation d'outils

Voici quelques exemples de code démontrant divers modèles et techniques d'utilisation d'outils. Par souci de concision, les outils sont simples et les descriptions d'outils sont plus courtes que l'idéal pour assurer les meilleures performances.

<section title="Exemple d'outil unique">

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
        "tools": [{
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
                        "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                    }
                },
                "required": ["location"]
            }
        }],
        "messages": [{"role": "user", "content": "What is the weather like in San Francisco?"}]
    }'
    ```

    ```python Python
    import anthropic
    client = anthropic.Anthropic()

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
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
                            "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                        }
                    },
                    "required": ["location"]
                }
            }
        ],
        messages=[{"role": "user", "content": "What is the weather like in San Francisco?"}]
    )

    print(response)
    ```
    
    ```java Java
    import java.util.List;
    import java.util.Map;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.core.JsonValue;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.Tool;
    import com.anthropic.models.messages.Tool.InputSchema;

    public class WeatherToolExample {

        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            InputSchema schema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of(
                            "location", Map.of(
                                    "type", "string",
                                    "description", "The city and state, e.g. San Francisco, CA"
                            ),
                            "unit", Map.of(
                                    "type", "string",
                                    "enum", List.of("celsius", "fahrenheit"),
                                    "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                            )
                    )))
                    .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                    .build();

            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addTool(Tool.builder()
                            .name("get_weather")
                            .description("Get the current weather in a given location")
                            .inputSchema(schema)
                            .build())
                    .addUserMessage("What is the weather like in San Francisco?")
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message);
        }
    }
    ```

</CodeGroup>

Claude retournera une réponse similaire à :

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

Vous devriez ensuite exécuter la fonction `get_weather` avec l'entrée fournie et retourner le résultat dans un nouveau message `user` :

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
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                        }
                    },
                    "required": ["location"]
                }
            }
        ],
        "messages": [
            {
                "role": "user",
                "content": "What is the weather like in San Francisco?"
            },
            {
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
                        "input": {
                            "location": "San Francisco, CA",
                            "unit": "celsius"
                        }
                    }
                ]
            },
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
        ]
    }'
    ```

    ```python Python
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
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
                            "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                        }
                    },
                    "required": ["location"]
                }
            }
        ],
        messages=[
            {
                "role": "user",
                "content": "What's the weather like in San Francisco?"
            },
            {
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
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": "toolu_01A09q90qw90lq917835lq9", # from the API response
                        "content": "65 degrees" # from running your tool
                    }
                ]
            }
        ]
    )

    print(response)
    ```
    
   ```java Java
    import java.util.List;
    import java.util.Map;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.core.JsonValue;
    import com.anthropic.models.messages.*;
    import com.anthropic.models.messages.Tool.InputSchema;

    public class ToolConversationExample {

        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            InputSchema schema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of(
                            "location", Map.of(
                                    "type", "string",
                                    "description", "The city and state, e.g. San Francisco, CA"
                            ),
                            "unit", Map.of(
                                    "type", "string",
                                    "enum", List.of("celsius", "fahrenheit"),
                                    "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                            )
                    )))
                    .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                    .build();

            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addTool(Tool.builder()
                            .name("get_weather")
                            .description("Get the current weather in a given location")
                            .inputSchema(schema)
                            .build())
                    .addUserMessage("What is the weather like in San Francisco?")
                    .addAssistantMessageOfBlockParams(
                            List.of(
                                    ContentBlockParam.ofText(
                                            TextBlockParam.builder()
                                                    .text("I'll check the current weather in San Francisco for you.")
                                                    .build()
                                    ),
                                    ContentBlockParam.ofToolUse(
                                            ToolUseBlockParam.builder()
                                                    .id("toolu_01A09q90qw90lq917835lq9")
                                                    .name("get_weather")
                                                    .input(JsonValue.from(Map.of(
                                                            "location", "San Francisco, CA",
                                                            "unit", "celsius"
                                                    )))
                                                    .build()
                                    )
                            )
                    )
                    .addUserMessageOfBlockParams(List.of(
                            ContentBlockParam.ofToolResult(
                                    ToolResultBlockParam.builder()
                                            .toolUseId("toolu_01A09q90qw90lq917835lq9")
                                            .content("15 degrees")
                                            .build()
                            )
                    ))
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message);
        }
    }
   ```

</CodeGroup>

Cela affichera la réponse finale de Claude, incorporant les données météorologiques :

```json JSON
{
  "id": "msg_01Aq9w938a90dw8q",
  "model": "claude-sonnet-4-5",
  "stop_reason": "stop_sequence",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The current weather in San Francisco is 15 degrees Celsius (59 degrees Fahrenheit). It's a cool day in the city by the bay!"
    }
  ]
}
```

</section>
<section title="Utilisation parallèle d'outils">

Claude peut appeler plusieurs outils en parallèle dans une seule réponse, ce qui est utile pour les tâches nécessitant plusieurs opérations indépendantes. Lors de l'utilisation d'outils parallèles, tous les blocs `tool_use` sont inclus dans un seul message assistant, et tous les blocs `tool_result` correspondants doivent être fournis dans le message utilisateur suivant.

<Note>
**Important** : Les résultats des outils doivent être formatés correctement pour éviter les erreurs d'API et assurer que Claude continue à utiliser les outils en parallèle. Consultez notre [guide de mise en œuvre](/docs/fr/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) pour les exigences de formatage détaillées et les exemples de code complets.
</Note>

Pour des exemples complets, des scripts de test et les meilleures pratiques pour implémenter les appels d'outils parallèles, consultez la [section utilisation parallèle d'outils](/docs/fr/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) dans notre guide de mise en œuvre.

</section>
<section title="Exemple avec plusieurs outils">

Vous pouvez fournir à Claude plusieurs outils parmi lesquels choisir dans une seule requête. Voici un exemple avec à la fois un outil `get_weather` et un outil `get_time`, ainsi qu'une requête utilisateur qui demande les deux.

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
        "tools": [{
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
        },
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            }
        }],
        "messages": [{
            "role": "user",
            "content": "What is the weather like right now in New York? Also what time is it there?"
        }]
    }'
    ```

    ```python Python
    import anthropic
    client = anthropic.Anthropic()

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
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
                            "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                        }
                    },
                    "required": ["location"]
                }
            },
            {
                "name": "get_time",
                "description": "Get the current time in a given time zone",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "timezone": {
                            "type": "string",
                            "description": "The IANA time zone name, e.g. America/Los_Angeles"
                        }
                    },
                    "required": ["timezone"]
                }
            }
        ],
        messages=[
            {
                "role": "user",
                "content": "What is the weather like right now in New York? Also what time is it there?"
            }
        ]
    )
    print(response)
    ```
    
    ```java Java
    import java.util.List;
    import java.util.Map;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.core.JsonValue;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.Tool;
    import com.anthropic.models.messages.Tool.InputSchema;

    public class MultipleToolsExample {

        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Weather tool schema
            InputSchema weatherSchema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of(
                            "location", Map.of(
                                    "type", "string",
                                    "description", "The city and state, e.g. San Francisco, CA"
                            ),
                            "unit", Map.of(
                                    "type", "string",
                                    "enum", List.of("celsius", "fahrenheit"),
                                    "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                            )
                    )))
                    .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                    .build();

            // Time tool schema
            InputSchema timeSchema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of(
                            "timezone", Map.of(
                                    "type", "string",
                                    "description", "The IANA time zone name, e.g. America/Los_Angeles"
                            )
                    )))
                    .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                    .build();

            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addTool(Tool.builder()
                            .name("get_weather")
                            .description("Get the current weather in a given location")
                            .inputSchema(weatherSchema)
                            .build())
                    .addTool(Tool.builder()
                            .name("get_time")
                            .description("Get the current time in a given time zone")
                            .inputSchema(timeSchema)
                            .build())
                    .addUserMessage("What is the weather like right now in New York? Also what time is it there?")
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message);
        }
    }
    ```

</CodeGroup>

Dans ce cas, Claude peut soit :
- Utiliser les outils séquentiellement (un à la fois) — en appelant d'abord `get_weather`, puis `get_time` après avoir reçu le résultat météorologique
- Utiliser les appels d'outils parallèles — en produisant plusieurs blocs `tool_use` dans une seule réponse lorsque les opérations sont indépendantes

Lorsque Claude effectue des appels d'outils parallèles, vous devez retourner tous les résultats des outils dans un seul message `user`, avec chaque résultat dans son propre bloc `tool_result`.

</section>
<section title="Informations manquantes">

Si l'invite de l'utilisateur n'inclut pas suffisamment d'informations pour remplir tous les paramètres requis d'un outil, Claude Opus est beaucoup plus susceptible de reconnaître qu'un paramètre est manquant et de le demander. Claude Sonnet peut le demander, surtout s'il est invité à réfléchir avant de produire une requête d'outil. Mais il peut aussi faire de son mieux pour déduire une valeur raisonnable.

Par exemple, en utilisant l'outil `get_weather` ci-dessus, si vous demandez à Claude « Quel est le temps ? » sans spécifier un lieu, Claude, en particulier Claude Sonnet, peut faire une supposition sur les entrées des outils :

```json JSON
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": {"location": "New York, NY", "unit": "fahrenheit"}
}
```

Ce comportement n'est pas garanti, en particulier pour les invites plus ambiguës et pour les modèles moins intelligents. Si Claude Opus n'a pas assez de contexte pour remplir les paramètres requis, il est beaucoup plus susceptible de répondre par une question de clarification au lieu de faire un appel d'outil.

</section>
<section title="Outils séquentiels">

Certaines tâches peuvent nécessiter d'appeler plusieurs outils en séquence, en utilisant la sortie d'un outil comme entrée pour un autre. Dans ce cas, Claude appellera un outil à la fois. Si on lui demande d'appeler tous les outils à la fois, Claude est susceptible de deviner les paramètres des outils en aval s'ils dépendent des résultats des outils en amont.

Voici un exemple d'utilisation d'un outil `get_location` pour obtenir l'emplacement de l'utilisateur, puis de passer cet emplacement à l'outil `get_weather` :

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
        "tools": [
            {
                "name": "get_location",
                "description": "Get the current user location based on their IP address. This tool has no parameters or arguments.",
                "input_schema": {
                    "type": "object",
                    "properties": {}
                }
            },
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
        ],
        "messages": [{
            "role": "user",
            "content": "What is the weather like where I am?"
        }]
    }'
    ```

    ```python Python
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        tools=[
            {
                "name": "get_location",
                "description": "Get the current user location based on their IP address. This tool has no parameters or arguments.",
                "input_schema": {
                    "type": "object",
                    "properties": {}
                }
            },
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
        ],
        messages=[{
       		  "role": "user",
        	  "content": "What's the weather like where I am?"
        }]
    )
    ```
    
    ```java Java
    import java.util.List;
    import java.util.Map;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.core.JsonValue;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.Tool;
    import com.anthropic.models.messages.Tool.InputSchema;

    public class EmptySchemaToolExample {

        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Empty schema for location tool
            InputSchema locationSchema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of()))
                    .build();

            // Weather tool schema
            InputSchema weatherSchema = InputSchema.builder()
                    .properties(JsonValue.from(Map.of(
                            "location", Map.of(
                                    "type", "string",
                                    "description", "The city and state, e.g. San Francisco, CA"
                            ),
                            "unit", Map.of(
                                    "type", "string",
                                    "enum", List.of("celsius", "fahrenheit"),
                                    "description", "The unit of temperature, either \"celsius\" or \"fahrenheit\""
                            )
                    )))
                    .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                    .build();

            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addTool(Tool.builder()
                            .name("get_location")
                            .description("Get the current user location based on their IP address. This tool has no parameters or arguments.")
                            .inputSchema(locationSchema)
                            .build())
                    .addTool(Tool.builder()
                            .name("get_weather")
                            .description("Get the current weather in a given location")
                            .inputSchema(weatherSchema)
                            .build())
                    .addUserMessage("What is the weather like where I am?")
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message);
        }
    }
    ```

</CodeGroup>

Dans ce cas, Claude appellerait d'abord l'outil `get_location` pour obtenir l'emplacement de l'utilisateur. Après que vous ayez retourné l'emplacement dans un `tool_result`, Claude appellerait ensuite `get_weather` avec cet emplacement pour obtenir la réponse finale.

La conversation complète pourrait ressembler à :

| Rôle      | Contenu                                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Utilisateur      | Quel est le temps où je suis ?                                                                                                                                                                                                                     |
| Assistant | Je vais d'abord trouver votre emplacement actuel, puis vérifier le temps là-bas. \[Utilisation d'outil pour get_location\] |
| Utilisateur      | \[Résultat d'outil pour get_location avec id correspondant et résultat de San Francisco, CA\]                                                                                                                                                       |
| Assistant | \[Utilisation d'outil pour get_weather avec l'entrée suivante\]\{ "location": "San Francisco, CA", "unit": "fahrenheit" }                                                                                                                         |
| Utilisateur      | \[Résultat d'outil pour get_weather avec id correspondant et résultat de "59°F (15°C), mostly cloudy"\]                                                                                                                             |
| Assistant | En fonction de votre emplacement actuel à San Francisco, CA, le temps en ce moment est 59°F (15°C) et partiellement nuageux. C'est une journée assez fraîche et nuageuse dans la ville. Vous voudrez peut-être apporter une veste légère si vous sortez.           |

Cet exemple démontre comment Claude peut enchaîner plusieurs appels d'outils pour répondre à une question qui nécessite de rassembler des données de différentes sources. Les étapes clés sont :

1. Claude réalise d'abord qu'il a besoin de l'emplacement de l'utilisateur pour répondre à la question météorologique, il appelle donc l'outil `get_location`.
2. L'utilisateur (c'est-à-dire le code client) exécute la fonction `get_location` réelle et retourne le résultat « San Francisco, CA » dans un bloc `tool_result`.
3. Avec l'emplacement maintenant connu, Claude procède à l'appel de l'outil `get_weather`, en passant « San Francisco, CA » comme paramètre `location` (ainsi qu'un paramètre `unit` deviné, car `unit` n'est pas un paramètre requis).
4. L'utilisateur exécute à nouveau la fonction `get_weather` réelle avec les arguments fournis et retourne les données météorologiques dans un autre bloc `tool_result`.
5. Enfin, Claude incorpore les données météorologiques dans une réponse en langage naturel à la question originale.

</section>
<section title="Utilisation d'outils avec chaîne de pensée">

Par défaut, Claude Opus est invité à réfléchir avant de répondre à une requête d'utilisation d'outil pour mieux déterminer si un outil est nécessaire, quel outil utiliser et les paramètres appropriés. Claude Sonnet et Claude Haiku sont invités à essayer d'utiliser les outils autant que possible et sont plus susceptibles d'appeler un outil inutile ou de déduire des paramètres manquants. Pour inviter Sonnet ou Haiku à mieux évaluer la requête de l'utilisateur avant de faire des appels d'outils, l'invite suivante peut être utilisée :

Invite de chaîne de pensée

`Répondez à la demande de l'utilisateur en utilisant les outils pertinents (s'ils sont disponibles). Avant d'appeler un outil, faites une analyse. Premièrement, réfléchissez à quel outil fourni est l'outil pertinent pour répondre à la demande de l'utilisateur. Deuxièmement, parcourez chacun des paramètres requis de l'outil pertinent et déterminez si l'utilisateur a directement fourni ou donné suffisamment d'informations pour déduire une valeur. Lorsque vous décidez si le paramètre peut être déduit, considérez attentivement tout le contexte pour voir s'il soutient une valeur spécifique. Si tous les paramètres requis sont présents ou peuvent être raisonnablement déduits, procédez à l'appel d'outil. MAIS, si l'une des valeurs pour un paramètre requis est manquante, N'INVOQUEZ PAS la fonction (pas même avec des remplisseurs pour les paramètres manquants) et demandez plutôt à l'utilisateur de fournir les paramètres manquants. NE DEMANDEZ PAS plus d'informations sur les paramètres optionnels s'ils ne sont pas fournis.
`

</section>

---

## Tarification

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

Consultez notre [tableau de comparaison des modèles](/docs/fr/about-claude/models/overview#model-comparison-table) pour les prix actuels par modèle.

Lorsque vous envoyez une invite d'utilisation d'outils, tout comme toute autre demande d'API, la réponse affichera à la fois les décomptes de jetons d'entrée et de sortie dans le cadre des métriques `usage` signalées.

---

## Étapes suivantes

Explorez notre référentiel d'exemples de code d'utilisation d'outils prêts à mettre en œuvre dans nos livres de recettes :

<CardGroup cols={3}>
  <Card
    title="Outil Calculatrice"
    icon="calculator"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/calculator_tool.ipynb"
  >
    Découvrez comment intégrer un outil calculatrice simple avec Claude pour des calculs numériques précis.
  </Card>

{" "}
<Card
  title="Agent de Service Client"
  icon="headset"
  href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/customer_service_agent.ipynb"
>
  Créez un bot de service client réactif qui exploite les outils clients pour améliorer le support.
</Card>

  <Card
    title="Extracteur JSON"
    icon="code-brackets"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/extracting_structured_json.ipynb"
  >
    Découvrez comment Claude et l'utilisation d'outils peuvent extraire des données structurées à partir de texte non structuré.
  </Card>
</CardGroup>