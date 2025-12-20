# Uso de ferramentas com Claude

Claude é capaz de interagir com ferramentas e funções, permitindo que você estenda os recursos do Claude para realizar uma variedade maior de tarefas.

---

Claude é capaz de interagir com ferramentas e funções, permitindo que você estenda os recursos do Claude para realizar uma variedade maior de tarefas.

<Tip>
  Aprenda tudo o que você precisa para dominar o uso de ferramentas com Claude como parte de nossos novos [cursos](https://anthropic.skilljar.com/)! Por favor, continue compartilhando suas ideias e sugestões usando este [formulário](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

<Tip>
**Garanta conformidade de esquema com uso rigoroso de ferramentas**

[Structured Outputs](/docs/pt-BR/build-with-claude/structured-outputs) fornece validação de esquema garantida para entradas de ferramentas. Adicione `strict: true` às suas definições de ferramentas para garantir que as chamadas de ferramentas do Claude sempre correspondam exatamente ao seu esquema — sem mais incompatibilidades de tipo ou campos ausentes.

Perfeito para agentes de produção onde parâmetros de ferramentas inválidos causariam falhas. [Saiba quando usar uso rigoroso de ferramentas →](/docs/pt-BR/build-with-claude/structured-outputs#when-to-use-json-outputs-vs-strict-tool-use)
</Tip>

Aqui está um exemplo de como fornecer ferramentas ao Claude usando a API Messages:

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

## Como funciona o uso de ferramentas

Claude suporta dois tipos de ferramentas:

1. **Ferramentas do cliente**: Ferramentas que são executadas em seus sistemas, que incluem:
   - Ferramentas personalizadas definidas pelo usuário que você cria e implementa
   - Ferramentas definidas pela Anthropic como [uso de computador](/docs/pt-BR/agents-and-tools/tool-use/computer-use-tool) e [editor de texto](/docs/pt-BR/agents-and-tools/tool-use/text-editor-tool) que requerem implementação do cliente

2. **Ferramentas do servidor**: Ferramentas que são executadas nos servidores da Anthropic, como as ferramentas de [busca na web](/docs/pt-BR/agents-and-tools/tool-use/web-search-tool) e [busca na web](/docs/pt-BR/agents-and-tools/tool-use/web-fetch-tool). Essas ferramentas devem ser especificadas na solicitação da API, mas não requerem implementação da sua parte.

<Note>
As ferramentas definidas pela Anthropic usam tipos versionados (por exemplo, `web_search_20250305`, `text_editor_20250124`) para garantir compatibilidade entre versões de modelos.
</Note>

### Ferramentas do cliente
Integre ferramentas do cliente com Claude nestas etapas:

<Steps>
  <Step title="Forneça ao Claude ferramentas e um prompt do usuário">
    - Defina ferramentas do cliente com nomes, descrições e esquemas de entrada em sua solicitação de API.
    - Inclua um prompt do usuário que possa exigir essas ferramentas, por exemplo, "Qual é o tempo em San Francisco?"
  </Step>
  <Step title="Claude decide usar uma ferramenta">
    - Claude avalia se alguma ferramenta pode ajudar com a consulta do usuário.
    - Se sim, Claude constrói uma solicitação de uso de ferramenta adequadamente formatada.
    - Para ferramentas do cliente, a resposta da API tem um `stop_reason` de `tool_use`, sinalizando a intenção do Claude.
  </Step>
  <Step title="Execute a ferramenta e retorne os resultados">
    - Extraia o nome e a entrada da ferramenta da solicitação do Claude
    - Execute o código da ferramenta em seu sistema
    - Retorne os resultados em uma nova mensagem `user` contendo um bloco de conteúdo `tool_result`
  </Step>
  <Step title="Claude usa o resultado da ferramenta para formular uma resposta">
    - Claude analisa os resultados da ferramenta para elaborar sua resposta final ao prompt original do usuário.
  </Step>
</Steps>
Nota: As etapas 3 e 4 são opcionais. Para alguns fluxos de trabalho, a solicitação de uso de ferramenta do Claude (etapa 2) pode ser tudo o que você precisa, sem enviar resultados de volta ao Claude.

### Ferramentas do servidor

As ferramentas do servidor seguem um fluxo de trabalho diferente:

<Steps>
  <Step title="Forneça ao Claude ferramentas e um prompt do usuário">
    - Ferramentas do servidor, como [busca na web](/docs/pt-BR/agents-and-tools/tool-use/web-search-tool) e [busca na web](/docs/pt-BR/agents-and-tools/tool-use/web-fetch-tool), têm seus próprios parâmetros.
    - Inclua um prompt do usuário que possa exigir essas ferramentas, por exemplo, "Pesquise as últimas notícias sobre IA" ou "Analise o conteúdo nesta URL."
  </Step>
  <Step title="Claude executa a ferramenta do servidor">
    - Claude avalia se uma ferramenta do servidor pode ajudar com a consulta do usuário.
    - Se sim, Claude executa a ferramenta e os resultados são automaticamente incorporados à resposta do Claude.
  </Step>
  <Step title="Claude usa o resultado da ferramenta do servidor para formular uma resposta">
    - Claude analisa os resultados da ferramenta do servidor para elaborar sua resposta final ao prompt original do usuário.
    - Nenhuma interação adicional do usuário é necessária para a execução da ferramenta do servidor.
  </Step>
</Steps>

---

## Usando ferramentas MCP com Claude

Se você está construindo um aplicativo que usa o [Model Context Protocol (MCP)](https://modelcontextprotocol.io), você pode usar ferramentas de servidores MCP diretamente com a API Messages do Claude. As definições de ferramentas MCP usam um formato de esquema semelhante ao formato de ferramenta do Claude. Você apenas precisa renomear `inputSchema` para `input_schema`.

<Tip>
**Não quer construir seu próprio cliente MCP?** Use o [conector MCP](/docs/pt-BR/agents-and-tools/mcp-connector) para conectar diretamente a servidores MCP remotos a partir da API Messages sem implementar um cliente.
</Tip>

### Convertendo ferramentas MCP para o formato Claude

Quando você constrói um cliente MCP e chama `list_tools()` em um servidor MCP, você receberá definições de ferramentas com um campo `inputSchema`. Para usar essas ferramentas com Claude, converta-as para o formato do Claude:

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

Em seguida, passe essas ferramentas convertidas para Claude:

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

Quando Claude responde com um bloco `tool_use`, execute a ferramenta em seu servidor MCP usando `call_tool()` e retorne o resultado ao Claude em um bloco `tool_result`.

Para um guia completo sobre como construir clientes MCP, consulte [Construir um cliente MCP](https://modelcontextprotocol.io/docs/develop/build-client).

---

## Exemplos de uso de ferramentas

Aqui estão alguns exemplos de código demonstrando vários padrões e técnicas de uso de ferramentas. Por brevidade, as ferramentas são simples e as descrições das ferramentas são mais curtas do que seria ideal para garantir o melhor desempenho.

<section title="Exemplo de ferramenta única">

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

Claude retornará uma resposta similar a:

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

Você precisaria então executar a função `get_weather` com a entrada fornecida e retornar o resultado em uma nova mensagem `user`:

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

Isso imprimirá a resposta final do Claude, incorporando os dados meteorológicos:

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
<section title="Uso paralelo de ferramentas">

Claude pode chamar múltiplas ferramentas em paralelo dentro de uma única resposta, o que é útil para tarefas que requerem múltiplas operações independentes. Ao usar ferramentas em paralelo, todos os blocos `tool_use` são incluídos em uma única mensagem do assistente, e todos os blocos `tool_result` correspondentes devem ser fornecidos na mensagem do usuário subsequente.

<Note>
**Importante**: Os resultados das ferramentas devem ser formatados corretamente para evitar erros de API e garantir que Claude continue usando ferramentas em paralelo. Consulte nosso [guia de implementação](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) para requisitos de formatação detalhados e exemplos de código completos.
</Note>

Para exemplos abrangentes, scripts de teste e melhores práticas para implementar chamadas de ferramentas em paralelo, consulte a [seção de uso paralelo de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) em nosso guia de implementação.

</section>
<section title="Exemplo de múltiplas ferramentas">

Você pode fornecer ao Claude múltiplas ferramentas para escolher em uma única solicitação. Aqui está um exemplo com uma ferramenta `get_weather` e uma ferramenta `get_time`, junto com uma consulta do usuário que pede ambas.

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

Neste caso, Claude pode:
- Usar as ferramentas sequencialmente (uma de cada vez) — chamando `get_weather` primeiro, depois `get_time` após receber o resultado do tempo
- Usar chamadas de ferramentas em paralelo — produzindo múltiplos blocos `tool_use` em uma única resposta quando as operações são independentes

Quando Claude faz chamadas de ferramentas em paralelo, você deve retornar todos os resultados das ferramentas em uma única mensagem `user`, com cada resultado em seu próprio bloco `tool_result`.

</section>
<section title="Informações faltantes">

Se o prompt do usuário não incluir informações suficientes para preencher todos os parâmetros obrigatórios de uma ferramenta, Claude Opus é muito mais provável de reconhecer que um parâmetro está faltando e pedir por ele. Claude Sonnet pode pedir, especialmente quando solicitado a pensar antes de produzir uma solicitação de ferramenta. Mas também pode fazer o seu melhor para inferir um valor razoável.

Por exemplo, usando a ferramenta `get_weather` acima, se você perguntar ao Claude "What's the weather?" sem especificar uma localização, Claude, particularmente Claude Sonnet, pode fazer uma suposição sobre as entradas das ferramentas:

```json JSON
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": {"location": "New York, NY", "unit": "fahrenheit"}
}
```

Este comportamento não é garantido, especialmente para prompts mais ambíguos e para modelos menos inteligentes. Se Claude Opus não tiver contexto suficiente para preencher os parâmetros obrigatórios, é muito mais provável que responda com uma pergunta de esclarecimento em vez de fazer uma chamada de ferramenta.

</section>
<section title="Ferramentas sequenciais">

Algumas tarefas podem exigir chamar múltiplas ferramentas em sequência, usando a saída de uma ferramenta como entrada para outra. Nesse caso, Claude chamará uma ferramenta de cada vez. Se solicitado a chamar as ferramentas todas de uma vez, Claude provavelmente adivinará parâmetros para ferramentas mais adiante se forem dependentes dos resultados das ferramentas mais acima.

Aqui está um exemplo de usar uma ferramenta `get_location` para obter a localização do usuário e depois passar essa localização para a ferramenta `get_weather`:

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

Neste caso, Claude primeiro chamaria a ferramenta `get_location` para obter a localização do usuário. Depois que você retornar a localização em um `tool_result`, Claude então chamaria `get_weather` com essa localização para obter a resposta final.

A conversa completa pode parecer:

| Função    | Conteúdo                                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Usuário   | What's the weather like where I am?                                                                                                                                                                                                     |
| Assistente | I'll find your current location first, then check the weather there. \[Tool use for get_location\] |
| Usuário   | \[Tool result for get_location with matching id and result of San Francisco, CA\]                                                                                                                                                       |
| Assistente | \[Tool use for get_weather with the following input\]\{ "location": "San Francisco, CA", "unit": "fahrenheit" }                                                                                                                         |
| Usuário   | \[Tool result for get_weather with matching id and result of "59°F (15°C), mostly cloudy"\]                                                                                                                                             |
| Assistente | Based on your current location in San Francisco, CA, the weather right now is 59°F (15°C) and mostly cloudy. It's a fairly cool and overcast day in the city. You may want to bring a light jacket if you're heading outside.           |

Este exemplo demonstra como Claude pode encadear múltiplas chamadas de ferramentas para responder a uma pergunta que requer coletar dados de diferentes fontes. Os passos principais são:

1. Claude primeiro percebe que precisa da localização do usuário para responder à pergunta sobre o tempo, então chama a ferramenta `get_location`.
2. O usuário (ou seja, o código do cliente) executa a função `get_location` real e retorna o resultado "San Francisco, CA" em um bloco `tool_result`.
3. Com a localização agora conhecida, Claude procede a chamar a ferramenta `get_weather`, passando "San Francisco, CA" como o parâmetro `location` (bem como um parâmetro `unit` adivinhado, já que `unit` não é um parâmetro obrigatório).
4. O usuário novamente executa a função `get_weather` real com os argumentos fornecidos e retorna os dados meteorológicos em outro bloco `tool_result`.
5. Finalmente, Claude incorpora os dados meteorológicos em uma resposta em linguagem natural para a pergunta original.

</section>
<section title="Uso de ferramentas com cadeia de pensamento">

Por padrão, Claude Opus é solicitado a pensar antes de responder a uma consulta de uso de ferramenta para determinar melhor se uma ferramenta é necessária, qual ferramenta usar e os parâmetros apropriados. Claude Sonnet e Claude Haiku são solicitados a tentar usar ferramentas o máximo possível e são mais propensos a chamar uma ferramenta desnecessária ou inferir parâmetros faltantes. Para solicitar ao Sonnet ou Haiku que avaliem melhor a consulta do usuário antes de fazer chamadas de ferramentas, o seguinte prompt pode ser usado:

Prompt de cadeia de pensamento

`Answer the user's request using relevant tools (if they are available). Before calling a tool, do some analysis. First, think about which of the provided tools is the relevant tool to answer the user's request. Second, go through each of the required parameters of the relevant tool and determine if the user has directly provided or given enough information to infer a value. When deciding if the parameter can be inferred, carefully consider all the context to see if it supports a specific value. If all of the required parameters are present or can be reasonably inferred, proceed with the tool call. BUT, if one of the values for a required parameter is missing, DO NOT invoke the function (not even with fillers for the missing params) and instead, ask the user to provide the missing parameters. DO NOT ask for more information on optional parameters if it is not provided.
`

</section>

---

## Preços

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

Consulte nossa [tabela de visão geral de modelos](/docs/pt-BR/about-claude/models/overview#model-comparison-table) para os preços atuais por modelo.

Quando você envia um prompt de uso de ferramenta, assim como qualquer outra solicitação de API, a resposta produzirá contagens de tokens de entrada e saída como parte das métricas de `usage` relatadas.

---

## Próximas Etapas

Explore nosso repositório de exemplos de código de uso de ferramenta prontos para implementar em nossos cookbooks:

<CardGroup cols={3}>
  <Card
    title="Ferramenta Calculadora"
    icon="calculator"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/calculator_tool.ipynb"
  >
    Aprenda como integrar uma ferramenta calculadora simples com Claude para cálculos numéricos precisos.
  </Card>

{" "}
<Card
  title="Agente de Atendimento ao Cliente"
  icon="headset"
  href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/customer_service_agent.ipynb"
>
  Crie um bot de atendimento ao cliente responsivo que aproveita ferramentas do cliente para aprimorar o suporte.
</Card>

  <Card
    title="Extrator JSON"
    icon="code-brackets"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/extracting_structured_json.ipynb"
  >
    Veja como Claude e o uso de ferramentas podem extrair dados estruturados de texto não estruturado.
  </Card>
</CardGroup>