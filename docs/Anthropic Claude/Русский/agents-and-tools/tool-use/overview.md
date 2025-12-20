# Использование инструментов с Claude

Claude может взаимодействовать с инструментами и функциями, расширяя его возможности для выполнения более широкого спектра задач.

---

Claude способен взаимодействовать с инструментами и функциями, позволяя вам расширить возможности Claude для выполнения более широкого спектра задач.

<Tip>
  Изучите всё, что вам нужно для овладения использованием инструментов с Claude, в рамках нашего нового [курса](https://anthropic.skilljar.com/)! Пожалуйста, продолжайте делиться своими идеями и предложениями, используя этот [форму](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

<Tip>
**Гарантированное соответствие схеме при строгом использовании инструментов**

[Структурированные выходные данные](/docs/ru/build-with-claude/structured-outputs) обеспечивают гарантированную валидацию схемы для входных данных инструментов. Добавьте `strict: true` в определения ваших инструментов, чтобы гарантировать, что вызовы инструментов Claude всегда точно соответствуют вашей схеме — больше никаких несоответствий типов или отсутствующих полей.

Идеально подходит для производственных агентов, где неправильные параметры инструментов могут привести к сбоям. [Узнайте, когда использовать строгое использование инструментов →](/docs/ru/build-with-claude/structured-outputs#when-to-use-json-outputs-vs-strict-tool-use)
</Tip>

Вот пример того, как предоставить инструменты Claude, используя Messages API:

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

## Как работает использование инструментов

Claude поддерживает два типа инструментов:

1. **Клиентские инструменты**: Инструменты, которые выполняются в ваших системах, включая:
   - Пользовательские инструменты, которые вы создаёте и реализуете
   - Инструменты, определённые Anthropic, такие как [компьютерное использование](/docs/ru/agents-and-tools/tool-use/computer-use-tool) и [текстовый редактор](/docs/ru/agents-and-tools/tool-use/text-editor-tool), которые требуют реализации на клиенте

2. **Серверные инструменты**: Инструменты, которые выполняются на серверах Anthropic, такие как инструменты [веб-поиска](/docs/ru/agents-and-tools/tool-use/web-search-tool) и [веб-выборки](/docs/ru/agents-and-tools/tool-use/web-fetch-tool). Эти инструменты должны быть указаны в запросе API, но не требуют реализации с вашей стороны.

<Note>
Инструменты, определённые Anthropic, используют версионированные типы (например, `web_search_20250305`, `text_editor_20250124`) для обеспечения совместимости между версиями моделей.
</Note>

### Клиентские инструменты
Интегрируйте клиентские инструменты с Claude в следующие этапы:

<Steps>
  <Step title="Предоставьте Claude инструменты и запрос пользователя">
    - Определите клиентские инструменты с именами, описаниями и схемами входных данных в вашем запросе API.
    - Включите запрос пользователя, который может потребовать эти инструменты, например, "Какая погода в Сан-Франциско?"
  </Step>
  <Step title="Claude решает использовать инструмент">
    - Claude оценивает, могут ли какие-либо инструменты помочь с запросом пользователя.
    - Если да, Claude создаёт правильно отформатированный запрос на использование инструмента.
    - Для клиентских инструментов ответ API имеет `stop_reason` равный `tool_use`, сигнализируя о намерении Claude.
  </Step>
  <Step title="Выполните инструмент и верните результаты">
    - Извлеките имя инструмента и входные данные из запроса Claude
    - Выполните код инструмента в вашей системе
    - Верните результаты в новом сообщении `user`, содержащем блок содержимого `tool_result`
  </Step>
  <Step title="Claude использует результат инструмента для формулирования ответа">
    - Claude анализирует результаты инструмента, чтобы создать свой окончательный ответ на исходный запрос пользователя.
  </Step>
</Steps>
Примечание: Этапы 3 и 4 являются необязательными. Для некоторых рабочих процессов запрос Claude на использование инструмента (этап 2) может быть всем, что вам нужно, без отправки результатов обратно в Claude.

### Серверные инструменты

Серверные инструменты следуют другому рабочему процессу:

<Steps>
  <Step title="Предоставьте Claude инструменты и запрос пользователя">
    - Серверные инструменты, такие как [веб-поиск](/docs/ru/agents-and-tools/tool-use/web-search-tool) и [веб-выборка](/docs/ru/agents-and-tools/tool-use/web-fetch-tool), имеют свои собственные параметры.
    - Включите запрос пользователя, который может потребовать эти инструменты, например, "Поищите последние новости об искусственном интеллекте" или "Проанализируйте содержимое по этому URL."
  </Step>
  <Step title="Claude выполняет серверный инструмент">
    - Claude оценивает, может ли серверный инструмент помочь с запросом пользователя.
    - Если да, Claude выполняет инструмент, и результаты автоматически включаются в ответ Claude.
  </Step>
  <Step title="Claude использует результат серверного инструмента для формулирования ответа">
    - Claude анализирует результаты серверного инструмента, чтобы создать свой окончательный ответ на исходный запрос пользователя.
    - Для выполнения серверного инструмента не требуется дополнительное взаимодействие с пользователем.
  </Step>
</Steps>

---

## Использование инструментов MCP с Claude

Если вы создаёте приложение, которое использует [Model Context Protocol (MCP)](https://modelcontextprotocol.io), вы можете использовать инструменты с серверов MCP непосредственно с Messages API Claude. Определения инструментов MCP используют формат схемы, который похож на формат инструментов Claude. Вам просто нужно переименовать `inputSchema` на `input_schema`.

<Tip>
**Не хотите создавать свой собственный клиент MCP?** Используйте [MCP коннектор](/docs/ru/agents-and-tools/mcp-connector) для прямого подключения к удалённым серверам MCP из Messages API без реализации клиента.
</Tip>

### Преобразование инструментов MCP в формат Claude

Когда вы создаёте клиент MCP и вызываете `list_tools()` на сервере MCP, вы получите определения инструментов с полем `inputSchema`. Чтобы использовать эти инструменты с Claude, преобразуйте их в формат Claude:

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

Затем передайте эти преобразованные инструменты в Claude:

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

Когда Claude ответит с блоком `tool_use`, выполните инструмент на вашем сервере MCP, используя `call_tool()`, и верните результат в Claude в блоке `tool_result`.

Полное руководство по созданию клиентов MCP см. в разделе [Создание клиента MCP](https://modelcontextprotocol.io/docs/develop/build-client).

---

## Примеры использования инструментов

Вот несколько примеров кода, демонстрирующих различные паттерны и методы использования инструментов. Для краткости инструменты простые, а описания инструментов короче, чем было бы идеально для обеспечения лучшей производительности.

<section title="Пример с одним инструментом">

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

Claude вернёт ответ, похожий на:

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

Затем вам нужно будет выполнить функцию `get_weather` с предоставленными входными данными и вернуть результат в новом сообщении `user`:

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

Это выведет финальный ответ Claude с учётом данных о погоде:

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
<section title="Параллельное использование инструментов">

Claude может вызывать несколько инструментов параллельно в одном ответе, что полезно для задач, требующих нескольких независимых операций. При использовании параллельных инструментов все блоки `tool_use` включены в одно сообщение ассистента, и все соответствующие блоки `tool_result` должны быть предоставлены в последующем сообщении пользователя.

<Note>
**Важно**: Результаты инструментов должны быть отформатированы правильно, чтобы избежать ошибок API и обеспечить продолжение использования Claude параллельных инструментов. Смотрите наше [руководство по реализации](/docs/ru/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) для получения подробных требований к форматированию и полных примеров кода.
</Note>

Для полных примеров, тестовых скриптов и лучших практик реализации параллельных вызовов инструментов смотрите [раздел параллельного использования инструментов](/docs/ru/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use) в нашем руководстве по реализации.

</section>
<section title="Пример с несколькими инструментами">

Вы можете предоставить Claude несколько инструментов на выбор в одном запросе. Вот пример с инструментами `get_weather` и `get_time`, а также с запросом пользователя, который просит оба.

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

В этом случае Claude может либо:
- Использовать инструменты последовательно (по одному за раз) — вызвав `get_weather` первым, затем `get_time` после получения результата погоды
- Использовать параллельные вызовы инструментов — выводя несколько блоков `tool_use` в одном ответе, когда операции независимы

Когда Claude делает параллельные вызовы инструментов, вы должны вернуть все результаты инструментов в одном сообщении `user`, с каждым результатом в своём собственном блоке `tool_result`.

</section>
<section title="Отсутствующая информация">

Если запрос пользователя не содержит достаточно информации для заполнения всех требуемых параметров инструмента, Claude Opus гораздо более вероятно распознает, что параметр отсутствует, и попросит его. Claude Sonnet может попросить, особенно когда его просят подумать перед выводом запроса инструмента. Но он также может попытаться вывести разумное значение.

Например, используя инструмент `get_weather` выше, если вы спросите Claude "Какая погода?" без указания местоположения, Claude, особенно Claude Sonnet, может угадать входные данные инструмента:

```json JSON
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": {"location": "New York, NY", "unit": "fahrenheit"}
}
```

Это поведение не гарантировано, особенно для более неоднозначных запросов и для менее интеллектуальных моделей. Если Claude Opus не имеет достаточного контекста для заполнения требуемых параметров, он гораздо более вероятно ответит уточняющим вопросом вместо выполнения вызова инструмента.

</section>
<section title="Последовательные инструменты">

Некоторые задачи могут требовать вызова нескольких инструментов последовательно, используя выход одного инструмента в качестве входа для другого. В таком случае Claude будет вызывать один инструмент за раз. Если его попросить вызвать все инструменты сразу, Claude, вероятно, будет угадывать параметры для инструментов дальше по цепочке, если они зависят от результатов инструментов дальше по цепочке.

Вот пример использования инструмента `get_location` для получения местоположения пользователя, а затем передачи этого местоположения инструменту `get_weather`:

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

В этом случае Claude сначала вызовет инструмент `get_location` для получения местоположения пользователя. После того как вы вернёте местоположение в `tool_result`, Claude затем вызовет `get_weather` с этим местоположением, чтобы получить финальный ответ.

Полный разговор может выглядеть так:

| Роль      | Содержание                                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Пользователь      | Какая погода там, где я нахожусь?                                                                                                                                                                                                                     |
| Ассистент | Сначала найду ваше текущее местоположение, затем проверю погоду там. \[Использование инструмента для get_location\] |
| Пользователь      | \[Результат инструмента для get_location с совпадающим id и результатом San Francisco, CA\]                                                                                                                                                       |
| Ассистент | \[Использование инструмента для get_weather со следующим входом\]\{ "location": "San Francisco, CA", "unit": "fahrenheit" }                                                                                                                         |
| Пользователь      | \[Результат инструмента для get_weather с совпадающим id и результатом "59°F (15°C), mostly cloudy"\]                                                                                                                                             |
| Ассистент | На основе вашего текущего местоположения в San Francisco, CA, погода прямо сейчас составляет 59°F (15°C) и в основном облачно. Это довольно прохладный и пасмурный день в городе. Вы можете захотеть взять лёгкую куртку, если собираетесь выходить на улицу.           |

Этот пример демонстрирует, как Claude может связывать вместе несколько вызовов инструментов для ответа на вопрос, который требует сбора данных из разных источников. Ключевые шаги:

1. Claude сначала понимает, что ему нужно местоположение пользователя, чтобы ответить на вопрос о погоде, поэтому он вызывает инструмент `get_location`.
2. Пользователь (т.е. код клиента) выполняет фактическую функцию `get_location` и возвращает результат "San Francisco, CA" в блоке `tool_result`.
3. Теперь, когда местоположение известно, Claude переходит к вызову инструмента `get_weather`, передавая "San Francisco, CA" в качестве параметра `location` (а также угадывая параметр `unit`, так как `unit` не является требуемым параметром).
4. Пользователь снова выполняет фактическую функцию `get_weather` с предоставленными аргументами и возвращает данные о погоде в другом блоке `tool_result`.
5. Наконец, Claude включает данные о погоде в естественный языковой ответ на исходный вопрос.

</section>
<section title="Использование инструментов с цепочкой мыслей">

По умолчанию Claude Opus получает подсказку думать перед ответом на запрос использования инструмента, чтобы лучше определить, необходим ли инструмент, какой инструмент использовать и соответствующие параметры. Claude Sonnet и Claude Haiku получают подсказку пытаться использовать инструменты как можно больше и более вероятно вызовут ненужный инструмент или выведут отсутствующие параметры. Чтобы подсказать Sonnet или Haiku лучше оценить запрос пользователя перед выполнением вызовов инструментов, можно использовать следующую подсказку:

Подсказка цепочки мыслей

`Ответьте на запрос пользователя, используя соответствующие инструменты (если они доступны). Перед вызовом инструмента проведите некоторый анализ. Во-первых, подумайте, какой из предоставленных инструментов является соответствующим инструментом для ответа на запрос пользователя. Во-вторых, пройдите через каждый из требуемых параметров соответствующего инструмента и определите, предоставил ли пользователь напрямую или дал достаточно информации для вывода значения. При решении, может ли параметр быть выведен, тщательно рассмотрите весь контекст, чтобы увидеть, поддерживает ли он конкретное значение. Если все требуемые параметры присутствуют или могут быть разумно выведены, продолжайте с вызовом инструмента. НО, если одно из значений для требуемого параметра отсутствует, НЕ вызывайте функцию (даже с заполнителями для отсутствующих параметров) и вместо этого попросите пользователя предоставить отсутствующие параметры. НЕ просите больше информации по необязательным параметрам, если она не предоставлена.
`

</section>

---

## Цены

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

Обратитесь к нашей [таблице сравнения моделей](/docs/ru/about-claude/models/overview#model-comparison-table) для получения текущих цен за модель.

Когда вы отправляете запрос с использованием инструментов, как и любой другой запрос API, ответ будет выводить как входные, так и выходные количества токенов как часть сообщаемых метрик `usage`.

---

## Следующие шаги

Изучите наш репозиторий готовых к внедрению примеров кода использования инструментов в наших кулинарных книгах:

<CardGroup cols={3}>
  <Card
    title="Инструмент калькулятора"
    icon="calculator"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/calculator_tool.ipynb"
  >
    Узнайте, как интегрировать простой инструмент калькулятора с Claude для точных численных вычислений.
  </Card>

{" "}
<Card
  title="Агент обслуживания клиентов"
  icon="headset"
  href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/customer_service_agent.ipynb"
>
  Создайте отзывчивого бота обслуживания клиентов, который использует инструменты клиента для улучшения поддержки.
</Card>

  <Card
    title="Средство извлечения JSON"
    icon="code-brackets"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/extracting_structured_json.ipynb"
  >
    Посмотрите, как Claude и использование инструментов могут извлекать структурированные данные из неструктурированного текста.
  </Card>
</CardGroup>