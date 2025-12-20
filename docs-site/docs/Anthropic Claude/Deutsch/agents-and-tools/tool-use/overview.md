# Werkzeugnutzung mit Claude

Claude kann mit Werkzeugen und Funktionen interagieren, um seine Fähigkeiten zu erweitern und eine größere Vielfalt an Aufgaben auszuführen.

---

Claude kann mit Werkzeugen und Funktionen interagieren, um seine Fähigkeiten zu erweitern und eine größere Vielfalt an Aufgaben auszuführen.

<Tip>
  Erfahren Sie alles, was Sie brauchen, um die Werkzeugnutzung mit Claude zu beherrschen, als Teil unserer neuen [Kurse](https://anthropic.skilljar.com/)! Bitte teilen Sie weiterhin Ihre Ideen und Vorschläge über dieses [Formular](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

<Tip>
**Garantierte Schemakonformität mit strikter Werkzeugnutzung**

[Strukturierte Ausgaben](/docs/de/build-with-claude/structured-outputs) bietet garantierte Schemavalidierung für Werkzeugeingaben. Fügen Sie `strict: true` zu Ihren Werkzeugdefinitionen hinzu, um sicherzustellen, dass Claude's Werkzeugaufrufe immer genau Ihrem Schema entsprechen – keine Typfehler oder fehlenden Felder mehr.

Perfekt für Produktionsagenten, bei denen ungültige Werkzeugparameter zu Fehlern führen würden. [Erfahren Sie, wann Sie strikte Werkzeugnutzung verwenden sollten →](/docs/de/build-with-claude/structured-outputs#when-to-use-json-outputs-vs-strict-tool-use)
</Tip>

Hier ist ein Beispiel, wie Sie Claude Werkzeuge über die Messages API bereitstellen:

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

## Wie Werkzeugnutzung funktioniert

Claude unterstützt zwei Arten von Werkzeugen:

1. **Client-Werkzeuge**: Werkzeuge, die auf Ihren Systemen ausgeführt werden, einschließlich:
   - Benutzerdefinierte Werkzeuge, die Sie erstellen und implementieren
   - Von Anthropic definierte Werkzeuge wie [Computernutzung](/docs/de/agents-and-tools/tool-use/computer-use-tool) und [Text-Editor](/docs/de/agents-and-tools/tool-use/text-editor-tool), die eine Client-Implementierung erfordern

2. **Server-Werkzeuge**: Werkzeuge, die auf Anthropic's Servern ausgeführt werden, wie die [Web-Suche](/docs/de/agents-and-tools/tool-use/web-search-tool) und [Web-Abruf](/docs/de/agents-and-tools/tool-use/web-fetch-tool) Werkzeuge. Diese Werkzeuge müssen in der API-Anfrage angegeben werden, erfordern aber keine Implementierung auf Ihrer Seite.

<Note>
Von Anthropic definierte Werkzeuge verwenden versionierte Typen (z. B. `web_search_20250305`, `text_editor_20250124`), um die Kompatibilität über Modellversionen hinweg zu gewährleisten.
</Note>

### Client-Werkzeuge
Integrieren Sie Client-Werkzeuge mit Claude in diesen Schritten:

<Steps>
  <Step title="Stellen Sie Claude Werkzeuge und eine Benutzereingabe bereit">
    - Definieren Sie Client-Werkzeuge mit Namen, Beschreibungen und Eingabeschemas in Ihrer API-Anfrage.
    - Fügen Sie eine Benutzereingabe ein, die diese Werkzeuge möglicherweise erfordert, z. B. „Wie ist das Wetter in San Francisco?"
  </Step>
  <Step title="Claude entscheidet sich für die Verwendung eines Werkzeugs">
    - Claude bewertet, ob eines der Werkzeuge bei der Abfrage des Benutzers helfen kann.
    - Falls ja, erstellt Claude eine ordnungsgemäß formatierte Werkzeugnutzungsanfrage.
    - Bei Client-Werkzeugen hat die API-Antwort einen `stop_reason` von `tool_use`, was Claude's Absicht signalisiert.
  </Step>
  <Step title="Führen Sie das Werkzeug aus und geben Sie Ergebnisse zurück">
    - Extrahieren Sie den Werkzeugnamen und die Eingabe aus Claude's Anfrage
    - Führen Sie den Werkzeugcode auf Ihrem System aus
    - Geben Sie die Ergebnisse in einer neuen `user` Nachricht mit einem `tool_result` Inhaltsblock zurück
  </Step>
  <Step title="Claude verwendet das Werkzeugergebnis, um eine Antwort zu formulieren">
    - Claude analysiert die Werkzeugergebnisse, um seine endgültige Antwort auf die ursprüngliche Benutzereingabe zu formulieren.
  </Step>
</Steps>
Hinweis: Die Schritte 3 und 4 sind optional. Bei einigen Workflows könnte Claude's Werkzeugnutzungsanfrage (Schritt 2) alles sein, was Sie benötigen, ohne die Ergebnisse an Claude zurückzusenden.

### Server-Werkzeuge

Server-Werkzeuge folgen einem anderen Workflow:

<Steps>
  <Step title="Stellen Sie Claude Werkzeuge und eine Benutzereingabe bereit">
    - Server-Werkzeuge wie [Web-Suche](/docs/de/agents-and-tools/tool-use/web-search-tool) und [Web-Abruf](/docs/de/agents-and-tools/tool-use/web-fetch-tool) haben ihre eigenen Parameter.
    - Fügen Sie eine Benutzereingabe ein, die diese Werkzeuge möglicherweise erfordert, z. B. „Suchen Sie nach den neuesten Nachrichten über KI" oder „Analysieren Sie den Inhalt unter dieser URL."
  </Step>
  <Step title="Claude führt das Server-Werkzeug aus">
    - Claude bewertet, ob ein Server-Werkzeug bei der Abfrage des Benutzers helfen kann.
    - Falls ja, führt Claude das Werkzeug aus, und die Ergebnisse werden automatisch in Claude's Antwort eingebunden.
  </Step>
  <Step title="Claude verwendet das Server-Werkzeugergebnis, um eine Antwort zu formulieren">
    - Claude analysiert die Server-Werkzeugergebnisse, um seine endgültige Antwort auf die ursprüngliche Benutzereingabe zu formulieren.
    - Für die Ausführung von Server-Werkzeugen ist keine zusätzliche Benutzerinteraktion erforderlich.
  </Step>
</Steps>

---

## Verwendung von MCP-Werkzeugen mit Claude

Wenn Sie eine Anwendung erstellen, die das [Model Context Protocol (MCP)](https://modelcontextprotocol.io) verwendet, können Sie Werkzeuge von MCP-Servern direkt mit Claude's Messages API verwenden. MCP-Werkzeugdefinitionen verwenden ein Schemaformat, das Claude's Werkzeugformat ähnelt. Sie müssen nur `inputSchema` in `input_schema` umbenennen.

<Tip>
**Möchten Sie keinen eigenen MCP-Client erstellen?** Verwenden Sie den [MCP-Connector](/docs/de/agents-and-tools/mcp-connector), um sich direkt von der Messages API aus mit Remote-MCP-Servern zu verbinden, ohne einen Client zu implementieren.
</Tip>

### Konvertierung von MCP-Werkzeugen in Claude-Format

Wenn Sie einen MCP-Client erstellen und `list_tools()` auf einem MCP-Server aufrufen, erhalten Sie Werkzeugdefinitionen mit einem `inputSchema` Feld. Um diese Werkzeuge mit Claude zu verwenden, konvertieren Sie sie in Claude's Format:

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

Übergeben Sie diese konvertierten Werkzeuge dann an Claude:

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

Wenn Claude mit einem `tool_use` Block antwortet, führen Sie das Werkzeug auf Ihrem MCP-Server mit `call_tool()` aus und geben Sie das Ergebnis an Claude in einem `tool_result` Block zurück.

Eine vollständige Anleitung zum Erstellen von MCP-Clients finden Sie unter [Erstellen Sie einen MCP-Client](https://modelcontextprotocol.io/docs/develop/build-client).

---

## Beispiele für die Werkzeugnutzung

Hier sind einige Codebeispiele, die verschiedene Muster und Techniken der Werkzeugnutzung demonstrieren. Der Kürze halber sind die Werkzeuge einfache Werkzeuge, und die Werkzeugbeschreibungen sind kürzer als ideal, um optimale Leistung zu gewährleisten.

<section title="Beispiel mit einem einzelnen Werkzeug">

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

Claude wird eine ähnliche Antwort zurückgeben:

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

Sie müssen dann die `get_weather`-Funktion mit der bereitgestellten Eingabe ausführen und das Ergebnis in einer neuen `user`-Nachricht zurückgeben:

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

Dies gibt Claudes endgültige Antwort aus, die die Wetterdaten einbezieht:

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
<section title="Parallele Werkzeugnutzung">

Claude kann mehrere Werkzeuge parallel in einer einzigen Antwort aufrufen, was für Aufgaben nützlich ist, die mehrere unabhängige Operationen erfordern. Bei der Verwendung paralleler Werkzeuge sind alle `tool_use`-Blöcke in einer einzigen Assistentenachricht enthalten, und alle entsprechenden `tool_result`-Blöcke müssen in der nachfolgenden Benutzernachricht bereitgestellt werden.

<Note>
**Wichtig**: Werkzeugergebnisse müssen korrekt formatiert sein, um API-Fehler zu vermeiden und sicherzustellen, dass Claude weiterhin parallele Werkzeuge verwendet. Siehe unseren [Implementierungsleitfaden](/docs/de/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) für detaillierte Formatierungsanforderungen und vollständige Codebeispiele.
</Note>

Umfassende Beispiele, Testskripte und Best Practices für die Implementierung paralleler Werkzeugaufrufe finden Sie im [Abschnitt zur parallelen Werkzeugnutzung](/docs/de/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) in unserem Implementierungsleitfaden.

</section>
<section title="Beispiel mit mehreren Werkzeugen">

Sie können Claude mehrere Werkzeuge zur Auswahl in einer einzigen Anfrage bereitstellen. Hier ist ein Beispiel mit sowohl einem `get_weather`- als auch einem `get_time`-Werkzeug, zusammen mit einer Benutzerabfrage, die beide anfordert.

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

In diesem Fall kann Claude entweder:
- Die Werkzeuge sequenziell verwenden (eines nach dem anderen) — zuerst `get_weather` aufrufen, dann `get_time` nach Erhalt des Wetterergebnisses
- Parallele Werkzeugaufrufe verwenden — mehrere `tool_use`-Blöcke in einer einzigen Antwort ausgeben, wenn die Operationen unabhängig sind

Wenn Claude parallele Werkzeugaufrufe macht, müssen Sie alle Werkzeugergebnisse in einer einzigen `user`-Nachricht zurückgeben, mit jedem Ergebnis in seinem eigenen `tool_result`-Block.

</section>
<section title="Fehlende Informationen">

Wenn die Eingabeaufforderung des Benutzers nicht genug Informationen enthält, um alle erforderlichen Parameter für ein Werkzeug auszufüllen, ist Claude Opus viel wahrscheinlicher zu erkennen, dass ein Parameter fehlt und danach zu fragen. Claude Sonnet kann fragen, besonders wenn er aufgefordert wird, vor der Ausgabe einer Werkzeuganfrage zu denken. Es kann aber auch sein bestes tun, um einen angemessenen Wert abzuleiten.

Wenn Sie beispielsweise das obige `get_weather`-Werkzeug verwenden und Claude fragen „Wie ist das Wetter?" ohne einen Ort anzugeben, kann Claude, besonders Claude Sonnet, eine Vermutung über Werkzeugeingaben anstellen:

```json JSON
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": {"location": "New York, NY", "unit": "fahrenheit"}
}
```

Dieses Verhalten ist nicht garantiert, besonders für mehrdeutigere Eingabeaufforderungen und für weniger intelligente Modelle. Wenn Claude Opus nicht genug Kontext hat, um die erforderlichen Parameter auszufüllen, ist es viel wahrscheinlicher, mit einer Klarstellungsfrage zu antworten, anstatt einen Werkzeugaufruf zu machen.

</section>
<section title="Sequenzielle Werkzeuge">

Einige Aufgaben erfordern möglicherweise das Aufrufen mehrerer Werkzeuge in Folge, wobei die Ausgabe eines Werkzeugs als Eingabe für ein anderes verwendet wird. In diesem Fall wird Claude ein Werkzeug nach dem anderen aufrufen. Wenn Claude aufgefordert wird, alle Werkzeuge auf einmal aufzurufen, wird Claude wahrscheinlich Parameter für Werkzeuge weiter downstream erraten, wenn diese von Werkzeugergebnissen für Werkzeuge weiter upstream abhängig sind.

Hier ist ein Beispiel für die Verwendung eines `get_location`-Werkzeugs, um den Standort des Benutzers zu ermitteln, und dann diesen Standort an das `get_weather`-Werkzeug zu übergeben:

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

In diesem Fall würde Claude zuerst das `get_location`-Werkzeug aufrufen, um den Standort des Benutzers zu ermitteln. Nachdem Sie den Standort in einem `tool_result` zurückgegeben haben, würde Claude dann `get_weather` mit diesem Standort aufrufen, um die endgültige Antwort zu erhalten.

Das vollständige Gespräch könnte wie folgt aussehen:

| Rolle      | Inhalt                                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Benutzer      | Wie ist das Wetter dort, wo ich bin?                                                                                                                                                                                                     |
| Assistent | Ich werde zunächst Ihren aktuellen Standort ermitteln und dann das Wetter dort überprüfen. \[Werkzeugnutzung für get_location\] |
| Benutzer      | \[Werkzeugergebnis für get_location mit übereinstimmender ID und Ergebnis von San Francisco, CA\]                                                                                                                                                       |
| Assistent | \[Werkzeugnutzung für get_weather mit der folgenden Eingabe\]\{ "location": "San Francisco, CA", "unit": "fahrenheit" }                                                                                                                         |
| Benutzer      | \[Werkzeugergebnis für get_weather mit übereinstimmender ID und Ergebnis von "59°F (15°C), meist bewölkt"\]                                                                                                                                             |
| Assistent | Basierend auf Ihrem aktuellen Standort in San Francisco, CA, ist das Wetter gerade 59°F (15°C) und meist bewölkt. Es ist ein ziemlich kühler und bewölkter Tag in der Stadt. Sie möchten vielleicht eine leichte Jacke mitnehmen, wenn Sie nach draußen gehen.           |

Dieses Beispiel zeigt, wie Claude mehrere Werkzeugaufrufe miteinander verknüpfen kann, um eine Frage zu beantworten, die das Sammeln von Daten aus verschiedenen Quellen erfordert. Die wichtigsten Schritte sind:

1. Claude erkennt zunächst, dass es den Standort des Benutzers benötigt, um die Wetterfrage zu beantworten, also ruft es das `get_location`-Werkzeug auf.
2. Der Benutzer (d. h. der Client-Code) führt die tatsächliche `get_location`-Funktion aus und gibt das Ergebnis „San Francisco, CA" in einem `tool_result`-Block zurück.
3. Mit dem jetzt bekannten Standort fährt Claude fort und ruft das `get_weather`-Werkzeug auf, wobei „San Francisco, CA" als `location`-Parameter übergeben wird (sowie ein erratener `unit`-Parameter, da `unit` kein erforderlicher Parameter ist).
4. Der Benutzer führt erneut die tatsächliche `get_weather`-Funktion mit den bereitgestellten Argumenten aus und gibt die Wetterdaten in einem weiteren `tool_result`-Block zurück.
5. Schließlich integriert Claude die Wetterdaten in eine natürlichsprachige Antwort auf die ursprüngliche Frage.

</section>
<section title="Gedankenkette-Werkzeugnutzung">

Standardmäßig wird Claude Opus aufgefordert, vor der Beantwortung einer Werkzeugnutzungsabfrage zu denken, um am besten zu bestimmen, ob ein Werkzeug notwendig ist, welches Werkzeug zu verwenden ist und die angemessenen Parameter. Claude Sonnet und Claude Haiku werden aufgefordert, Werkzeuge so viel wie möglich zu verwenden und sind wahrscheinlicher, ein unnötiges Werkzeug aufzurufen oder fehlende Parameter abzuleiten. Um Sonnet oder Haiku aufzufordern, die Benutzerabfrage besser zu bewerten, bevor Werkzeugaufrufe gemacht werden, kann die folgende Eingabeaufforderung verwendet werden:

Gedankenkette-Eingabeaufforderung

`Beantworten Sie die Anfrage des Benutzers mit relevanten Werkzeugen (falls verfügbar). Führen Sie vor dem Aufrufen eines Werkzeugs eine Analyse durch. Überlegen Sie zunächst, welches der bereitgestellten Werkzeuge das relevante Werkzeug ist, um die Anfrage des Benutzers zu beantworten. Gehen Sie zweitens durch jeden erforderlichen Parameter des relevanten Werkzeugs und bestimmen Sie, ob der Benutzer einen Wert direkt bereitgestellt hat oder genug Informationen gegeben hat, um einen Wert abzuleiten. Wenn Sie entscheiden, ob der Parameter abgeleitet werden kann, berücksichtigen Sie sorgfältig den gesamten Kontext, um zu sehen, ob er einen bestimmten Wert unterstützt. Wenn alle erforderlichen Parameter vorhanden sind oder angemessen abgeleitet werden können, fahren Sie mit dem Werkzeugaufruf fort. ABER, wenn einer der Werte für einen erforderlichen Parameter fehlt, rufen Sie die Funktion NICHT auf (nicht einmal mit Platzhaltern für die fehlenden Parameter) und fragen Sie stattdessen den Benutzer, die fehlenden Parameter bereitzustellen. Fragen Sie NICHT nach weiteren Informationen zu optionalen Parametern, wenn diese nicht bereitgestellt werden.
`

</section>

---

## Preisgestaltung

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

Weitere Informationen finden Sie in unserer [Modellübersichtstabelle](/docs/de/about-claude/models/overview#model-comparison-table) für aktuelle Preise pro Modell.

Wenn Sie eine Tool-Use-Anfrage senden, wird die Antwort wie bei jeder anderen API-Anfrage sowohl die Eingabe- als auch die Ausgabe-Token-Anzahl als Teil der gemeldeten `usage`-Metriken ausgeben.

---

## Nächste Schritte

Erkunden Sie unser Repository mit einsatzbereiten Tool-Use-Code-Beispielen in unseren Cookbooks:

<CardGroup cols={3}>
  <Card
    title="Calculator Tool"
    icon="calculator"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/calculator_tool.ipynb"
  >
    Erfahren Sie, wie Sie ein einfaches Rechner-Tool mit Claude für präzise numerische Berechnungen integrieren.
  </Card>

{" "}
<Card
  title="Customer Service Agent"
  icon="headset"
  href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/customer_service_agent.ipynb"
>
  Erstellen Sie einen reaktionsschnellen Kundenservice-Bot, der Client-Tools nutzt, um den Support zu verbessern.
</Card>

  <Card
    title="JSON Extractor"
    icon="code-brackets"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/extracting_structured_json.ipynb"
  >
    Sehen Sie, wie Claude und Tool-Use strukturierte Daten aus unstrukturiertem Text extrahieren können.
  </Card>
</CardGroup>