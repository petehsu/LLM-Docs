# Claudeでのツール使用

Claudeがツールや関数と相互作用する方法、ツール使用の仕組み、MCPツールの統合について学びます。

---

Claudeはツールや関数と相互作用することができ、Claudeの機能を拡張してより多くの種類のタスクを実行できます。

<Tip>
  Claudeでのツール使用をマスターするために必要なすべてを、新しい[コース](https://anthropic.skilljar.com/)の一部として学びましょう！このフォームを使用して、アイデアや提案を共有し続けてください。
  [フォーム](https://forms.gle/BFnYc6iCkWoRzFgk7)
</Tip>

<Tip>
**厳密なツール使用でスキーマ準拠を保証**

[構造化出力](/docs/ja/build-with-claude/structured-outputs)は、ツール入力に対する保証されたスキーマ検証を提供します。ツール定義に`strict: true`を追加して、Claudeのツール呼び出しが常にスキーマと完全に一致することを確認します。型の不一致や欠落フィールドはもうありません。

無効なツールパラメータが失敗を引き起こす本番エージェントに最適です。[厳密なツール使用をいつ使用するかについて学ぶ →](/docs/ja/build-with-claude/structured-outputs#when-to-use-json-outputs-vs-strict-tool-use)
</Tip>

Messages APIを使用してClaudeにツールを提供する方法の例を次に示します：

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

## ツール使用の仕組み

Claudeは2種類のツールをサポートしています：

1. **クライアントツール**：あなたのシステムで実行されるツール。以下を含みます：
   - あなたが作成して実装するユーザー定義のカスタムツール
   - [コンピュータ使用](/docs/ja/agents-and-tools/tool-use/computer-use-tool)や[テキストエディタ](/docs/ja/agents-and-tools/tool-use/text-editor-tool)などのAnthropicで定義されたツール。クライアント実装が必要です

2. **サーバーツール**：Anthropicのサーバーで実行されるツール。[ウェブ検索](/docs/ja/agents-and-tools/tool-use/web-search-tool)や[ウェブフェッチ](/docs/ja/agents-and-tools/tool-use/web-fetch-tool)ツールなどです。これらのツールはAPIリクエストで指定する必要がありますが、あなた側での実装は不要です。

<Note>
Anthropicで定義されたツールはバージョン付きの型（例：`web_search_20250305`、`text_editor_20250124`）を使用して、モデルバージョン間での互換性を確保します。
</Note>

### クライアントツール
クライアントツールをClaudeと統合するには、以下の手順に従います：

<Steps>
  <Step title="Claudeにツールとユーザープロンプトを提供する">
    - APIリクエストで、名前、説明、入力スキーマを持つクライアントツールを定義します。
    - これらのツールが必要になる可能性があるユーザープロンプトを含めます。例えば、「サンフランシスコの天気は？」
  </Step>
  <Step title="Claudeがツール使用を決定する">
    - Claudeはユーザーのクエリに役立つツールがあるかどうかを評価します。
    - はいの場合、Claudeは適切にフォーマットされたツール使用リクエストを構築します。
    - クライアントツールの場合、APIレスポンスは`tool_use`の`stop_reason`を持ち、Claudeの意図を示します。
  </Step>
  <Step title="ツールを実行して結果を返す">
    - Claudeのリクエストからツール名と入力を抽出します
    - あなたのシステムでツールコードを実行します
    - `tool_result`コンテンツブロックを含む新しい`user`メッセージで結果を返します
  </Step>
  <Step title="Claudeがツール結果を使用して応答を作成する">
    - Claudeはツール結果を分析して、元のユーザープロンプトへの最終応答を作成します。
  </Step>
</Steps>
注：ステップ3と4はオプションです。一部のワークフローでは、Claudeのツール使用リクエスト（ステップ2）だけで十分で、結果をClaudeに送り返す必要がない場合があります。

### サーバーツール

サーバーツールは異なるワークフローに従います：

<Steps>
  <Step title="Claudeにツールとユーザープロンプトを提供する">
    - [ウェブ検索](/docs/ja/agents-and-tools/tool-use/web-search-tool)や[ウェブフェッチ](/docs/ja/agents-and-tools/tool-use/web-fetch-tool)などのサーバーツールは、独自のパラメータを持っています。
    - これらのツールが必要になる可能性があるユーザープロンプトを含めます。例えば、「AIに関する最新ニュースを検索してください」または「このURLのコンテンツを分析してください」
  </Step>
  <Step title="Claudeがサーバーツールを実行する">
    - Claudeはユーザーのクエリに役立つサーバーツールがあるかどうかを評価します。
    - はいの場合、Claudeはツールを実行し、結果は自動的にClaudeの応答に組み込まれます。
  </Step>
  <Step title="Claudeがサーバーツール結果を使用して応答を作成する">
    - Claudeはサーバーツール結果を分析して、元のユーザープロンプトへの最終応答を作成します。
    - サーバーツール実行に追加のユーザー操作は不要です。
  </Step>
</Steps>

---

## Claudeでのmcpツールの使用

[Model Context Protocol（MCP）](https://modelcontextprotocol.io)を使用するアプリケーションを構築している場合、MCPサーバーからのツールをClaudeのMessages APIで直接使用できます。MCPツール定義はClaudeのツール形式に似たスキーマ形式を使用します。`inputSchema`を`input_schema`に名前変更するだけです。

<Tip>
**独自のMCPクライアントを構築したくない場合は？** [MCPコネクタ](/docs/ja/agents-and-tools/mcp-connector)を使用して、クライアントを実装せずにMessages APIから直接リモートMCPサーバーに接続します。
</Tip>

### MCPツールをClaudeフォーマットに変換する

MCPクライアントを構築してMCPサーバーで`list_tools()`を呼び出すと、`inputSchema`フィールドを持つツール定義を受け取ります。これらのツールをClaudeで使用するには、Claudeのフォーマットに変換します：

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

次に、これらの変換されたツールをClaudeに渡します：

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

Claudeが`tool_use`ブロックで応答するとき、MCPサーバーで`call_tool()`を使用してツールを実行し、結果を`tool_result`ブロックでClaudeに返します。

MCPクライアント構築の完全なガイドについては、[MCPクライアントを構築する](https://modelcontextprotocol.io/docs/develop/build-client)を参照してください。

---

## ツール使用の例

ここでは、様々なツール使用パターンとテクニックを示すコード例をいくつか紹介します。簡潔にするため、ツールはシンプルなツールであり、ツールの説明は最適なパフォーマンスを確保するために理想的なものより短くなっています。

<section title="単一ツールの例">

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

Claudeは以下のような応答を返します：

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

その後、提供された入力で`get_weather`関数を実行し、結果を新しい`user`メッセージで返す必要があります：

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

これにより、天気データを組み込んだClaudeの最終応答が出力されます：

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
<section title="並列ツール使用">

Claudeは単一の応答内で複数のツールを並列で呼び出すことができます。これは複数の独立した操作を必要とするタスクに役立ちます。並列ツールを使用する場合、すべての`tool_use`ブロックは単一のアシスタントメッセージに含まれ、対応するすべての`tool_result`ブロックは後続のユーザーメッセージで提供される必要があります。

<Note>
**重要**: ツール結果は、APIエラーを回避し、Claudeが並列ツールを使い続けることを確認するために正しくフォーマットされる必要があります。詳細なフォーマット要件と完全なコード例については、[実装ガイド](/docs/ja/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use)を参照してください。
</Note>

包括的な例、テストスクリプト、および並列ツール呼び出しを実装するためのベストプラクティスについては、実装ガイドの[並列ツール使用セクション](/docs/ja/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use)を参照してください。

</section>
<section title="複数ツールの例">

Claudeに複数のツールを提供して、単一のリクエストで選択させることができます。以下は`get_weather`と`get_time`ツールの両方を含む例で、両方を要求するユーザークエリが付いています。

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

この場合、Claudeは以下のいずれかを行う可能性があります：
- ツールを順序立てて使用する（一度に1つ）— 最初に`get_weather`を呼び出し、その後天気の結果を受け取った後に`get_time`を呼び出す
- 並列ツール呼び出しを使用する — 操作が独立している場合、単一の応答で複数の`tool_use`ブロックを出力する

Claudeが並列ツール呼び出しを行う場合、すべてのツール結果を単一の`user`メッセージで返す必要があり、各結果は独自の`tool_result`ブロック内にあります。

</section>
<section title="情報不足">

ユーザーのプロンプトにツールのすべての必須パラメータを埋めるのに十分な情報が含まれていない場合、Claude Opusはパラメータが不足していることを認識して、それを要求する可能性がはるかに高くなります。Claude Sonnetは、特に出力前に考えるよう促された場合、要求する可能性があります。ただし、合理的な値を推測しようとする可能性もあります。

たとえば、上記の`get_weather`ツールを使用して、場所を指定せずにClaudeに「天気はどう？」と尋ねた場合、特にClaude Sonnetは、ツール入力について推測を行う可能性があります：

```json JSON
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": {"location": "New York, NY", "unit": "fahrenheit"}
}
```

この動作は保証されていません。特に、より曖昧なプロンプトと、より知能の低いモデルの場合です。Claude Opusが必須パラメータを埋めるのに十分なコンテキストを持っていない場合、ツール呼び出しを行う代わりに、明確な質問で応答する可能性がはるかに高くなります。

</section>
<section title="順序立てたツール">

一部のタスクでは、複数のツールを順序立てて呼び出す必要があり、1つのツールの出力を別のツールへの入力として使用します。このような場合、Claudeは一度に1つのツールを呼び出します。すべてのツールを一度に呼び出すよう促された場合、Claudeは上流のツール結果に依存する下流のツールのパラメータを推測する可能性があります。

以下は、`get_location`ツールを使用してユーザーの場所を取得し、その場所を`get_weather`ツールに渡す例です：

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

この場合、Claudeはまず`get_location`ツールを呼び出してユーザーの場所を取得します。`tool_result`で場所を返した後、Claudeは`get_weather`をその場所で呼び出して最終的な答えを取得します。

完全な会話は以下のようになります：

| ロール | コンテンツ |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ユーザー | 私がいる場所の天気はどう？ |
| アシスタント | まず現在の場所を見つけて、そこの天気を確認します。\[get_locationのツール使用\] |
| ユーザー | \[一致するIDとサンフランシスコ、CAの結果を含むget_locationのツール結果\] |
| アシスタント | \[以下の入力でget_weatherのツール使用\]\{ "location": "San Francisco, CA", "unit": "fahrenheit" } |
| ユーザー | \[一致するIDと「59°F (15°C)、ほぼ曇り」の結果を含むget_weatherのツール結果\] |
| アシスタント | 現在の場所がサンフランシスコ、CAに基づいて、今の天気は59°F (15°C)でほぼ曇っています。かなり涼しく曇った日です。外に出かける場合は、軽いジャケットを持ってきたいかもしれません。 |

この例は、Claudeが複数のツール呼び出しをチェーンして、異なるソースからデータを収集する必要があるクエリに答える方法を示しています。主な手順は以下の通りです：

1. Claudeは天気の質問に答えるためにユーザーの場所が必要であることに気づき、`get_location`ツールを呼び出します。
2. ユーザー（つまり、クライアントコード）は実際の`get_location`関数を実行し、結果「サンフランシスコ、CA」を`tool_result`ブロックで返します。
3. 場所がわかったので、Claudeは`get_weather`ツールを呼び出し、`location`パラメータとして「サンフランシスコ、CA」を渡します（また、`unit`は必須パラメータではないため、推測された`unit`パラメータも渡します）。
4. ユーザーは再び提供された引数で実際の`get_weather`関数を実行し、別の`tool_result`ブロックで天気データを返します。
5. 最後に、Claudeは天気データを元の質問への自然言語応答に組み込みます。

</section>
<section title="思考の連鎖ツール使用">

デフォルトでは、Claude Opusはツール使用クエリに答える前に考えるよう促され、ツールが必要かどうか、どのツールを使用するか、および適切なパラメータを最適に決定します。Claude SonnetとClaude Haikuはツールをできるだけ多く使用するよう促され、不要なツールを呼び出したり、不足しているパラメータを推測したりする可能性が高くなります。SonnetまたはHaikuにツール呼び出しを行う前にユーザークエリをより適切に評価するよう促すために、以下のプロンプトを使用できます：

思考の連鎖プロンプト

`利用可能な関連ツールを使用してユーザーのリクエストに答えてください。ツールを呼び出す前に、いくつかの分析を行ってください。まず、提供されたツールのうち、ユーザーのリクエストに答えるのに関連するツールはどれかを考えてください。次に、関連するツールの各必須パラメータを確認し、ユーザーが直接提供したか、値を推測するのに十分な情報を与えたかを判断してください。パラメータを推測できるかどうかを決定するときは、特定の値をサポートするかどうかを確認するために、すべてのコンテキストを注意深く検討してください。すべての必須パラメータが存在するか、合理的に推測できる場合は、ツール呼び出しを続行してください。ただし、必須パラメータの値の1つが不足している場合は、関数を呼び出さないでください（不足しているパラメータのフィラーを使用してでも）。代わりに、ユーザーに不足しているパラメータを提供するよう要求してください。提供されていない場合は、オプションパラメータについてさらに情報を要求しないでください。
`

</section>

---

## 価格

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

現在のモデルごとの価格については、[モデル概要表](/docs/ja/about-claude/models/overview#model-comparison-table)を参照してください。

ツール使用プロンプトを送信する場合、他のAPIリクエストと同様に、レスポンスは報告された`usage`メトリクスの一部として入力トークン数と出力トークン数の両方を出力します。

---

## 次のステップ

クックブックで実装可能なツール使用コード例のリポジトリを探索してください：

<CardGroup cols={3}>
  <Card
    title="計算機ツール"
    icon="calculator"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/calculator_tool.ipynb"
  >
    Claudeと統合する単純な計算機ツールを使用して、正確な数値計算を実行する方法を学びます。
  </Card>

{" "}
<Card
  title="カスタマーサービスエージェント"
  icon="headset"
  href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/customer_service_agent.ipynb"
>
  クライアントツールを活用してサポートを強化する応答性の高いカスタマーサービスボットを構築します。
</Card>

  <Card
    title="JSON抽出ツール"
    icon="code-brackets"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/extracting_structured_json.ipynb"
  >
    Claudeとツール使用が非構造化テキストから構造化データを抽出する方法を確認します。
  </Card>
</CardGroup>