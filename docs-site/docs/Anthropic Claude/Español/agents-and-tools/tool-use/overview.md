# Uso de herramientas con Claude

Claude es capaz de interactuar con herramientas y funciones, permitiéndote extender las capacidades de Claude para realizar una variedad más amplia de tareas.

---

Claude es capaz de interactuar con herramientas y funciones, permitiéndote extender las capacidades de Claude para realizar una variedad más amplia de tareas.

<Tip>
  ¡Aprende todo lo que necesitas para dominar el uso de herramientas con Claude como parte de nuestros nuevos [cursos](https://anthropic.skilljar.com/)! Por favor, continúa compartiendo tus ideas y sugerencias usando este
  [formulario](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

<Tip>
**Garantiza la conformidad del esquema con el uso estricto de herramientas**

[Structured Outputs](/docs/es/build-with-claude/structured-outputs) proporciona validación de esquema garantizada para entradas de herramientas. Añade `strict: true` a tus definiciones de herramientas para asegurar que las llamadas de herramientas de Claude siempre coincidan exactamente con tu esquema—sin más desajustes de tipos o campos faltantes.

Perfecto para agentes en producción donde parámetros de herramientas inválidos causarían fallos. [Aprende cuándo usar el uso estricto de herramientas →](/docs/es/build-with-claude/structured-outputs#when-to-use-json-outputs-vs-strict-tool-use)
</Tip>

Aquí hay un ejemplo de cómo proporcionar herramientas a Claude usando la API de Mensajes:

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

## Cómo funciona el uso de herramientas

Claude admite dos tipos de herramientas:

1. **Herramientas de cliente**: Herramientas que se ejecutan en tus sistemas, que incluyen:
   - Herramientas personalizadas definidas por el usuario que creas e implementas
   - Herramientas definidas por Anthropic como [uso de computadora](/docs/es/agents-and-tools/tool-use/computer-use-tool) y [editor de texto](/docs/es/agents-and-tools/tool-use/text-editor-tool) que requieren implementación en el cliente

2. **Herramientas de servidor**: Herramientas que se ejecutan en los servidores de Anthropic, como las herramientas de [búsqueda web](/docs/es/agents-and-tools/tool-use/web-search-tool) y [obtención web](/docs/es/agents-and-tools/tool-use/web-fetch-tool). Estas herramientas deben especificarse en la solicitud de API pero no requieren implementación de tu parte.

<Note>
Las herramientas definidas por Anthropic utilizan tipos versionados (por ejemplo, `web_search_20250305`, `text_editor_20250124`) para garantizar compatibilidad entre versiones de modelos.
</Note>

### Herramientas de cliente
Integra herramientas de cliente con Claude en estos pasos:

<Steps>
  <Step title="Proporciona a Claude herramientas y un mensaje del usuario">
    - Define herramientas de cliente con nombres, descripciones y esquemas de entrada en tu solicitud de API.
    - Incluye un mensaje del usuario que podría requerir estas herramientas, por ejemplo, "¿Cuál es el clima en San Francisco?"
  </Step>
  <Step title="Claude decide usar una herramienta">
    - Claude evalúa si alguna herramienta puede ayudar con la consulta del usuario.
    - Si es así, Claude construye una solicitud de uso de herramienta correctamente formateada.
    - Para herramientas de cliente, la respuesta de API tiene un `stop_reason` de `tool_use`, señalando la intención de Claude.
  </Step>
  <Step title="Ejecuta la herramienta y devuelve resultados">
    - Extrae el nombre y la entrada de la herramienta de la solicitud de Claude
    - Ejecuta el código de la herramienta en tu sistema
    - Devuelve los resultados en un nuevo mensaje de `user` que contiene un bloque de contenido `tool_result`
  </Step>
  <Step title="Claude usa el resultado de la herramienta para formular una respuesta">
    - Claude analiza los resultados de la herramienta para elaborar su respuesta final al mensaje original del usuario.
  </Step>
</Steps>
Nota: Los pasos 3 y 4 son opcionales. Para algunos flujos de trabajo, la solicitud de uso de herramienta de Claude (paso 2) podría ser todo lo que necesites, sin enviar resultados de vuelta a Claude.

### Herramientas de servidor

Las herramientas de servidor siguen un flujo de trabajo diferente:

<Steps>
  <Step title="Proporciona a Claude herramientas y un mensaje del usuario">
    - Las herramientas de servidor, como [búsqueda web](/docs/es/agents-and-tools/tool-use/web-search-tool) y [obtención web](/docs/es/agents-and-tools/tool-use/web-fetch-tool), tienen sus propios parámetros.
    - Incluye un mensaje del usuario que podría requerir estas herramientas, por ejemplo, "Busca las últimas noticias sobre IA" o "Analiza el contenido en esta URL."
  </Step>
  <Step title="Claude ejecuta la herramienta de servidor">
    - Claude evalúa si una herramienta de servidor puede ayudar con la consulta del usuario.
    - Si es así, Claude ejecuta la herramienta, y los resultados se incorporan automáticamente en la respuesta de Claude.
  </Step>
  <Step title="Claude usa el resultado de la herramienta de servidor para formular una respuesta">
    - Claude analiza los resultados de la herramienta de servidor para elaborar su respuesta final al mensaje original del usuario.
    - No se necesita interacción adicional del usuario para la ejecución de herramientas de servidor.
  </Step>
</Steps>

---

## Uso de herramientas MCP con Claude

Si estás construyendo una aplicación que utiliza el [Protocolo de Contexto de Modelo (MCP)](https://modelcontextprotocol.io), puedes usar herramientas de servidores MCP directamente con la API de Mensajes de Claude. Las definiciones de herramientas MCP utilizan un formato de esquema que es similar al formato de herramientas de Claude. Solo necesitas renombrar `inputSchema` a `input_schema`.

<Tip>
**¿No quieres construir tu propio cliente MCP?** Usa el [conector MCP](/docs/es/agents-and-tools/mcp-connector) para conectarte directamente a servidores MCP remotos desde la API de Mensajes sin implementar un cliente.
</Tip>

### Conversión de herramientas MCP al formato de Claude

Cuando construyes un cliente MCP y llamas a `list_tools()` en un servidor MCP, recibirás definiciones de herramientas con un campo `inputSchema`. Para usar estas herramientas con Claude, conviértelas al formato de Claude:

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

Luego pasa estas herramientas convertidas a Claude:

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

Cuando Claude responde con un bloque `tool_use`, ejecuta la herramienta en tu servidor MCP usando `call_tool()` y devuelve el resultado a Claude en un bloque `tool_result`.

Para una guía completa sobre cómo construir clientes MCP, consulta [Construir un cliente MCP](https://modelcontextprotocol.io/docs/develop/build-client).

---

## Ejemplos de uso de herramientas

Aquí hay algunos ejemplos de código que demuestran varios patrones y técnicas de uso de herramientas. Por brevedad, las herramientas son simples y las descripciones de herramientas son más cortas de lo ideal para garantizar el mejor rendimiento.

<section title="Ejemplo de herramienta única">

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

Claude devolverá una respuesta similar a:

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

Luego necesitarías ejecutar la función `get_weather` con la entrada proporcionada y devolver el resultado en un nuevo mensaje de `user`:

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

Esto imprimirá la respuesta final de Claude, incorporando los datos meteorológicos:

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
<section title="Uso paralelo de herramientas">

Claude puede llamar a múltiples herramientas en paralelo dentro de una única respuesta, lo cual es útil para tareas que requieren múltiples operaciones independientes. Cuando se usan herramientas en paralelo, todos los bloques `tool_use` se incluyen en un único mensaje del asistente, y todos los bloques `tool_result` correspondientes deben proporcionarse en el siguiente mensaje del usuario.

<Note>
**Importante**: Los resultados de las herramientas deben formatearse correctamente para evitar errores de API y garantizar que Claude continúe usando herramientas en paralelo. Consulta nuestra [guía de implementación](/docs/es/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) para obtener requisitos de formato detallados y ejemplos de código completos.
</Note>

Para ejemplos completos, scripts de prueba y mejores prácticas para implementar llamadas de herramientas en paralelo, consulta la [sección de uso paralelo de herramientas](/docs/es/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) en nuestra guía de implementación.

</section>
<section title="Ejemplo de múltiples herramientas">

Puedes proporcionar a Claude múltiples herramientas para elegir en una única solicitud. Aquí hay un ejemplo con una herramienta `get_weather` y una herramienta `get_time`, junto con una consulta del usuario que pide ambas.

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

En este caso, Claude puede:
- Usar las herramientas secuencialmente (una a la vez) — llamando a `get_weather` primero, luego a `get_time` después de recibir el resultado del clima
- Usar llamadas de herramientas en paralelo — generando múltiples bloques `tool_use` en una única respuesta cuando las operaciones son independientes

Cuando Claude realiza llamadas de herramientas en paralelo, debes devolver todos los resultados de las herramientas en un único mensaje de `user`, con cada resultado en su propio bloque `tool_result`.

</section>
<section title="Información faltante">

Si la solicitud del usuario no incluye suficiente información para completar todos los parámetros requeridos de una herramienta, Claude Opus es mucho más probable que reconozca que falta un parámetro y lo solicite. Claude Sonnet puede hacerlo, especialmente cuando se le solicita que piense antes de generar una solicitud de herramienta. Pero también puede hacer su mejor esfuerzo para inferir un valor razonable.

Por ejemplo, usando la herramienta `get_weather` anterior, si le preguntas a Claude "¿Cuál es el clima?" sin especificar una ubicación, Claude, particularmente Claude Sonnet, puede hacer una suposición sobre las entradas de herramientas:

```json JSON
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": {"location": "New York, NY", "unit": "fahrenheit"}
}
```

Este comportamiento no está garantizado, especialmente para solicitudes más ambiguas y para modelos menos inteligentes. Si Claude Opus no tiene suficiente contexto para completar los parámetros requeridos, es mucho más probable que responda con una pregunta aclaratoria en lugar de hacer una llamada de herramienta.

</section>
<section title="Herramientas secuenciales">

Algunas tareas pueden requerir llamar a múltiples herramientas en secuencia, usando la salida de una herramienta como entrada para otra. En tal caso, Claude llamará a una herramienta a la vez. Si se le solicita que llame a todas las herramientas a la vez, Claude probablemente adivinará parámetros para herramientas más adelante si dependen de resultados de herramientas más arriba.

Aquí hay un ejemplo de usar una herramienta `get_location` para obtener la ubicación del usuario, luego pasar esa ubicación a la herramienta `get_weather`:

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

En este caso, Claude primero llamaría a la herramienta `get_location` para obtener la ubicación del usuario. Después de que devuelvas la ubicación en un `tool_result`, Claude entonces llamaría a `get_weather` con esa ubicación para obtener la respuesta final.

La conversación completa podría verse así:

| Rol       | Contenido                                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Usuario   | ¿Cuál es el clima donde estoy?                                                                                                                                                                                                          |
| Asistente | Primero encontraré tu ubicación actual, luego verificaré el clima allí. \[Uso de herramienta para get_location\] |
| Usuario   | \[Resultado de herramienta para get_location con id coincidente y resultado de San Francisco, CA\]                                                                                                                                       |
| Asistente | \[Uso de herramienta para get_weather con la siguiente entrada\]\{ "location": "San Francisco, CA", "unit": "fahrenheit" }                                                                                                               |
| Usuario   | \[Resultado de herramienta para get_weather con id coincidente y resultado de "59°F (15°C), mayormente nublado"\]                                                                                                                       |
| Asistente | Según tu ubicación actual en San Francisco, CA, el clima en este momento es 59°F (15°C) y mayormente nublado. Es un día bastante frío y nublado en la ciudad. Es posible que desees traer una chaqueta ligera si vas a salir.            |

Este ejemplo demuestra cómo Claude puede encadenar múltiples llamadas de herramientas para responder una pregunta que requiere recopilar datos de diferentes fuentes. Los pasos clave son:

1. Claude primero se da cuenta de que necesita la ubicación del usuario para responder la pregunta del clima, por lo que llama a la herramienta `get_location`.
2. El usuario (es decir, el código del cliente) ejecuta la función `get_location` real y devuelve el resultado "San Francisco, CA" en un bloque `tool_result`.
3. Con la ubicación ahora conocida, Claude procede a llamar a la herramienta `get_weather`, pasando "San Francisco, CA" como parámetro `location` (así como un parámetro `unit` adivinado, ya que `unit` no es un parámetro requerido).
4. El usuario nuevamente ejecuta la función `get_weather` real con los argumentos proporcionados y devuelve los datos meteorológicos en otro bloque `tool_result`.
5. Finalmente, Claude incorpora los datos meteorológicos en una respuesta en lenguaje natural a la pregunta original.

</section>
<section title="Uso de herramientas con cadena de pensamiento">

Por defecto, Claude Opus recibe instrucciones para pensar antes de responder una consulta de uso de herramientas para determinar mejor si una herramienta es necesaria, qué herramienta usar y los parámetros apropiados. Claude Sonnet y Claude Haiku reciben instrucciones para intentar usar herramientas tanto como sea posible y es más probable que llamen a una herramienta innecesaria o infieran parámetros faltantes. Para solicitar a Sonnet o Haiku que evalúen mejor la consulta del usuario antes de hacer llamadas de herramientas, se puede usar el siguiente mensaje:

Mensaje de cadena de pensamiento

`Responde la solicitud del usuario usando herramientas relevantes (si están disponibles). Antes de llamar a una herramienta, haz un análisis. Primero, piensa en cuál de las herramientas proporcionadas es la herramienta relevante para responder la solicitud del usuario. Segundo, revisa cada uno de los parámetros requeridos de la herramienta relevante y determina si el usuario ha proporcionado directamente o ha dado suficiente información para inferir un valor. Al decidir si el parámetro puede ser inferido, considera cuidadosamente todo el contexto para ver si respalda un valor específico. Si todos los parámetros requeridos están presentes o pueden ser razonablemente inferidos, procede con la llamada de herramienta. PERO, si falta uno de los valores para un parámetro requerido, NO invoques la función (ni siquiera con rellenos para los parámetros faltantes) y en su lugar, pide al usuario que proporcione los parámetros faltantes. NO pidas más información sobre parámetros opcionales si no se proporciona.
`

</section>

---

## Precios

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

Consulte nuestra [tabla de descripción general de modelos](/docs/es/about-claude/models/overview#model-comparison-table) para los precios actuales por modelo.

Cuando envía un mensaje con uso de herramientas, al igual que cualquier otra solicitud de API, la respuesta mostrará tanto los recuentos de tokens de entrada como de salida como parte de las métricas de `usage` reportadas.

---

## Próximos Pasos

Explore nuestro repositorio de ejemplos de código de uso de herramientas listos para implementar en nuestros libros de recetas:

<CardGroup cols={3}>
  <Card
    title="Herramienta Calculadora"
    icon="calculator"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/calculator_tool.ipynb"
  >
    Aprenda cómo integrar una herramienta calculadora simple con Claude para cálculos numéricos precisos.
  </Card>

{" "}
<Card
  title="Agente de Servicio al Cliente"
  icon="headset"
  href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/customer_service_agent.ipynb"
>
  Construya un bot de servicio al cliente receptivo que aproveche las herramientas del cliente para mejorar el soporte.
</Card>

  <Card
    title="Extractor JSON"
    icon="code-brackets"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/extracting_structured_json.ipynb"
  >
    Vea cómo Claude y el uso de herramientas pueden extraer datos estructurados de texto no estructurado.
  </Card>
</CardGroup>