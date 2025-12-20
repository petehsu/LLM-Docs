# 使用 Claude 進行工具使用

Claude 能夠與工具和函數互動，讓您擴展 Claude 的功能以執行更多樣的任務。

---

Claude 能夠與工具和函數互動，讓您擴展 Claude 的功能以執行更多樣的任務。

<Tip>
  透過我們新的[課程](https://anthropic.skilljar.com/)學習掌握 Claude 工具使用所需的一切！請繼續使用此[表單](https://forms.gle/BFnYc6iCkWoRzFgk7)分享您的想法和建議。
</Tip>

<Tip>
**使用嚴格工具使用保證模式符合性**

[結構化輸出](/docs/zh-TW/build-with-claude/structured-outputs)為工具輸入提供有保證的模式驗證。在您的工具定義中添加 `strict: true` 以確保 Claude 的工具呼叫始終完全符合您的模式——不再有類型不匹配或缺少欄位的問題。

非常適合生產代理，其中無效的工具參數會導致失敗。[了解何時使用嚴格工具使用 →](/docs/zh-TW/build-with-claude/structured-outputs#when-to-use-json-outputs-vs-strict-tool-use)
</Tip>

以下是如何使用 Messages API 向 Claude 提供工具的示例：

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

## 工具使用的工作原理

Claude 支援兩種類型的工具：

1. **客戶端工具**：在您的系統上執行的工具，包括：
   - 您建立和實現的使用者定義自訂工具
   - Anthropic 定義的工具，如[電腦使用](/docs/zh-TW/agents-and-tools/tool-use/computer-use-tool)和[文字編輯器](/docs/zh-TW/agents-and-tools/tool-use/text-editor-tool)，需要客戶端實現

2. **伺服器工具**：在 Anthropic 伺服器上執行的工具，如[網路搜尋](/docs/zh-TW/agents-and-tools/tool-use/web-search-tool)和[網路擷取](/docs/zh-TW/agents-and-tools/tool-use/web-fetch-tool)工具。這些工具必須在 API 請求中指定，但不需要您進行實現。

<Note>
Anthropic 定義的工具使用版本化類型（例如 `web_search_20250305`、`text_editor_20250124`）以確保跨模型版本的相容性。
</Note>

### 客戶端工具
透過以下步驟將客戶端工具與 Claude 整合：

<Steps>
  <Step title="向 Claude 提供工具和使用者提示">
    - 在您的 API 請求中定義具有名稱、描述和輸入模式的客戶端工具。
    - 包含可能需要這些工具的使用者提示，例如「舊金山的天氣如何？」
  </Step>
  <Step title="Claude 決定使用工具">
    - Claude 評估任何工具是否可以幫助回答使用者的查詢。
    - 如果是，Claude 會構造一個格式正確的工具使用請求。
    - 對於客戶端工具，API 回應的 `stop_reason` 為 `tool_use`，表示 Claude 的意圖。
  </Step>
  <Step title="執行工具並返回結果">
    - 從 Claude 的請求中提取工具名稱和輸入
    - 在您的系統上執行工具程式碼
    - 在包含 `tool_result` 內容區塊的新 `user` 訊息中返回結果
  </Step>
  <Step title="Claude 使用工具結果來制定回應">
    - Claude 分析工具結果以製作對原始使用者提示的最終回應。
  </Step>
</Steps>
注意：步驟 3 和 4 是可選的。對於某些工作流程，Claude 的工具使用請求（步驟 2）可能就是您所需的全部，無需將結果發送回 Claude。

### 伺服器工具

伺服器工具遵循不同的工作流程：

<Steps>
  <Step title="向 Claude 提供工具和使用者提示">
    - 伺服器工具，如[網路搜尋](/docs/zh-TW/agents-and-tools/tool-use/web-search-tool)和[網路擷取](/docs/zh-TW/agents-and-tools/tool-use/web-fetch-tool)，有其自己的參數。
    - 包含可能需要這些工具的使用者提示，例如「搜尋有關 AI 的最新新聞」或「分析此 URL 的內容」。
  </Step>
  <Step title="Claude 執行伺服器工具">
    - Claude 評估伺服器工具是否可以幫助回答使用者的查詢。
    - 如果是，Claude 執行工具，結果會自動納入 Claude 的回應中。
  </Step>
  <Step title="Claude 使用伺服器工具結果來制定回應">
    - Claude 分析伺服器工具結果以製作對原始使用者提示的最終回應。
    - 伺服器工具執行不需要額外的使用者互動。
  </Step>
</Steps>

---

## 使用 MCP 工具與 Claude

如果您正在構建使用[模型上下文協議 (MCP)](https://modelcontextprotocol.io) 的應用程式，您可以直接使用 MCP 伺服器中的工具與 Claude 的 Messages API。MCP 工具定義使用的模式格式類似於 Claude 的工具格式。您只需將 `inputSchema` 重新命名為 `input_schema`。

<Tip>
**不想構建自己的 MCP 客戶端？** 使用 [MCP 連接器](/docs/zh-TW/agents-and-tools/mcp-connector)直接從 Messages API 連接到遠端 MCP 伺服器，無需實現客戶端。
</Tip>

### 將 MCP 工具轉換為 Claude 格式

當您構建 MCP 客戶端並在 MCP 伺服器上呼叫 `list_tools()` 時，您將收到具有 `inputSchema` 欄位的工具定義。要將這些工具與 Claude 一起使用，請將它們轉換為 Claude 的格式：

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

然後將這些轉換後的工具傳遞給 Claude：

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

當 Claude 使用 `tool_use` 區塊回應時，使用 `call_tool()` 在您的 MCP 伺服器上執行工具，並在 `tool_result` 區塊中將結果返回給 Claude。

如需構建 MCP 客戶端的完整指南，請參閱[構建 MCP 客戶端](https://modelcontextprotocol.io/docs/develop/build-client)。

---

## 工具使用示例

以下是一些代碼示例，展示了各種工具使用模式和技術。為了簡潔起見，工具是簡單的工具，工具描述比理想情況下要短，以確保最佳性能。

<section title="單一工具示例">

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

Claude 將返回類似以下的響應：

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

然後，您需要使用提供的輸入執行 `get_weather` 函數，並在新的 `user` 消息中返回結果：

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

這將打印 Claude 的最終響應，包含天氣數據：

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
<section title="並行工具使用">

Claude 可以在單個響應中並行調用多個工具，這對於需要多個獨立操作的任務很有用。使用並行工具時，所有 `tool_use` 塊都包含在單個助手消息中，所有相應的 `tool_result` 塊必須在後續用戶消息中提供。

<Note>
**重要**：工具結果必須格式正確，以避免 API 錯誤並確保 Claude 繼續使用並行工具。請參閱我們的[實現指南](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use)，了解詳細的格式要求和完整的代碼示例。
</Note>

有關實現並行工具調用的全面示例、測試腳本和最佳實踐，請參閱我們實現指南中的[並行工具使用部分](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use)。

</section>
<section title="多工具示例">

您可以在單個請求中為 Claude 提供多個工具供其選擇。以下是一個同時包含 `get_weather` 和 `get_time` 工具的示例，以及要求兩者的用戶查詢。

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

在這種情況下，Claude 可能會：
- 按順序使用工具（一次一個）— 先調用 `get_weather`，然後在收到天氣結果後調用 `get_time`
- 使用並行工具調用 — 在單個響應中輸出多個 `tool_use` 塊，當操作是獨立的時

當 Claude 進行並行工具調用時，您必須在單個 `user` 消息中返回所有工具結果，每個結果都在自己的 `tool_result` 塊中。

</section>
<section title="缺少信息">

如果用戶的提示不包含足夠的信息來填充工具的所有必需參數，Claude Opus 更有可能識別出參數缺失並要求提供。Claude Sonnet 可能會要求，特別是在提示其在輸出工具請求之前進行思考時。但它也可能盡力推斷合理的值。

例如，使用上面的 `get_weather` 工具，如果您問 Claude "天氣怎樣？"而不指定位置，Claude，特別是 Claude Sonnet，可能會對工具輸入進行猜測：

```json JSON
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": {"location": "New York, NY", "unit": "fahrenheit"}
}
```

這種行為不是保證的，特別是對於更模糊的提示和不太智能的模型。如果 Claude Opus 沒有足夠的上下文來填充必需的參數，它更有可能用澄清問題來回應，而不是進行工具調用。

</section>
<section title="順序工具">

某些任務可能需要按順序調用多個工具，使用一個工具的輸出作為另一個工具的輸入。在這種情況下，Claude 將一次調用一個工具。如果被提示一次調用所有工具，Claude 可能會為依賴於上游工具結果的下游工具的參數進行猜測。

以下是使用 `get_location` 工具獲取用戶位置，然後將該位置傳遞給 `get_weather` 工具的示例：

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

在這種情況下，Claude 首先會調用 `get_location` 工具來獲取用戶的位置。在您在 `tool_result` 中返回位置後，Claude 將使用該位置調用 `get_weather` 來獲得最終答案。

完整的對話可能如下所示：

| 角色      | 內容                                                                                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 用戶      | 我所在位置的天氣怎樣？                                                                                                                                                                                                                     |
| 助手 | 我先找到您當前的位置，然後檢查那裡的天氣。\[get_location 的工具使用\] |
| 用戶      | \[get_location 的工具結果，具有匹配的 id 和 San Francisco, CA 的結果\]                                                                                                                                                       |
| 助手 | \[get_weather 的工具使用，具有以下輸入\]\{ "location": "San Francisco, CA", "unit": "fahrenheit" }                                                                                                                         |
| 用戶      | \[get_weather 的工具結果，具有匹配的 id 和 "59°F (15°C), mostly cloudy" 的結果\]                                                                                                                             |
| 助手 | 根據您在舊金山加州的當前位置，現在的天氣是 59°F (15°C) 和大部分多雲。這是這座城市相當涼爽和陰沉的一天。如果您要出門，您可能想帶一件輕夾克。           |

此示例演示了 Claude 如何將多個工具調用鏈接在一起以回答需要從不同來源收集數據的問題。關鍵步驟是：

1. Claude 首先意識到它需要用戶的位置來回答天氣問題，所以它調用 `get_location` 工具。
2. 用戶（即客戶端代碼）執行實際的 `get_location` 函數並在 `tool_result` 塊中返回結果 "San Francisco, CA"。
3. 現在位置已知，Claude 繼續調用 `get_weather` 工具，將 "San Francisco, CA" 作為 `location` 參數傳遞（以及猜測的 `unit` 參數，因為 `unit` 不是必需參數）。
4. 用戶再次使用提供的參數執行實際的 `get_weather` 函數，並在另一個 `tool_result` 塊中返回天氣數據。
5. 最後，Claude 將天氣數據納入對原始問題的自然語言響應中。

</section>
<section title="思維鏈工具使用">

默認情況下，Claude Opus 被提示在回答工具使用查詢之前進行思考，以最好地確定是否需要工具、使用哪個工具以及適當的參數。Claude Sonnet 和 Claude Haiku 被提示盡可能多地嘗試使用工具，更有可能調用不必要的工具或推斷缺失的參數。為了提示 Sonnet 或 Haiku 在進行工具調用之前更好地評估用戶查詢，可以使用以下提示：

思維鏈提示

`使用相關工具（如果可用）回答用戶的請求。在調用工具之前，進行一些分析。首先，考慮提供的哪個工具是回答用戶請求的相關工具。其次，遍歷相關工具的每個必需參數，並確定用戶是否直接提供或提供了足夠的信息來推斷值。在決定參數是否可以推斷時，仔細考慮所有上下文，看看它是否支持特定值。如果所有必需參數都存在或可以合理推斷，請繼續進行工具調用。但是，如果必需參數的值之一缺失，請勿調用函數（即使使用缺失參數的填充程序），而是要求用戶提供缺失的參數。如果未提供可選參數，請勿要求提供更多信息。
`

</section>

---

## 定價

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

請參考我們的[模型概覽表](/docs/zh-TW/about-claude/models/overview#model-comparison-table)以了解目前的每個模型價格。

當您發送工具使用提示時，就像任何其他 API 請求一樣，回應將輸出輸入和輸出令牌計數，作為報告的 `usage` 指標的一部分。

---

## 後續步驟

在我們的食譜中探索我們現成可實施的工具使用程式碼範例存儲庫：

<CardGroup cols={3}>
  <Card
    title="計算機工具"
    icon="calculator"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/calculator_tool.ipynb"
  >
    了解如何將簡單的計算機工具與 Claude 整合以進行精確的數值計算。
  </Card>

{" "}
<Card
  title="客戶服務代理"
  icon="headset"
  href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/customer_service_agent.ipynb"
>
  構建一個響應式客戶服務機器人，利用客戶端工具來增強支援。
</Card>

  <Card
    title="JSON 提取器"
    icon="code-brackets"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/extracting_structured_json.ipynb"
  >
    查看 Claude 和工具使用如何從非結構化文本中提取結構化數據。
  </Card>
</CardGroup>