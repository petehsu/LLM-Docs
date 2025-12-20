# ツール使用の実装方法

Claudeでツール使用を実装するためのガイド

---

## モデルの選択

複雑なツールと曖昧なクエリには、最新のClaude Sonnet (4.5)またはClaude Opus (4.1)モデルの使用をお勧めします。これらは複数のツールをより適切に処理し、必要に応じて明確化を求めます。

シンプルなツールにはClaude Haikuモデルを使用できますが、欠落しているパラメータを推測する可能性があることに注意してください。

<Tip>
Claudeでツール使用と拡張思考を使用する場合は、[こちら](/docs/ja/build-with-claude/extended-thinking)のガイドを参照してください。
</Tip>

## クライアントツールの指定

クライアントツール（Anthropic定義のものとユーザー定義のもの両方）は、APIリクエストの`tools`トップレベルパラメータで指定されます。各ツール定義には以下が含まれます：

| パラメータ      | 説明                                                                                         |
| :------------- | :-------------------------------------------------------------------------------------------------- |
| `name`         | ツールの名前。正規表現`^[a-zA-Z0-9_-]{1,64}$`と一致する必要があります。                                 |
| `description`  | ツールが何をするのか、いつ使用すべきか、どのように動作するかについての詳細なプレーンテキスト説明。 |
| `input_schema` | ツールの予期されるパラメータを定義する[JSON Schema](https://json-schema.org/)オブジェクト。     |
| `input_examples` | （オプション、ベータ版）Claudeがツールの使用方法を理解するのに役立つサンプル入力オブジェクトの配列。[ツール使用例の提供](#providing-tool-use-examples)を参照してください。 |

<section title="シンプルなツール定義の例">

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

このツール（`get_weather`という名前）は、必須の`location`文字列とオプションの`unit`文字列（「celsius」または「fahrenheit」のいずれか）を含む入力オブジェクトを期待しています。

</section>

### ツール使用システムプロンプト

`tools`パラメータを使用してClaude APIを呼び出すと、ツール定義、ツール設定、およびユーザー指定のシステムプロンプトから特別なシステムプロンプトを構築します。構築されたプロンプトは、モデルに指定されたツールを使用するよう指示し、ツールが適切に動作するために必要なコンテキストを提供するように設計されています：

```
In this environment you have access to a set of tools you can use to answer the user's question.
{{ FORMATTING INSTRUCTIONS }}
String and scalar parameters should be specified as is, while lists and objects should use JSON format. Note that spaces for string values are not stripped. The output is not expected to be valid XML and is parsed with regular expressions.
Here are the functions available in JSONSchema format:
{{ TOOL DEFINITIONS IN JSON SCHEMA }}
{{ USER SYSTEM PROMPT }}
{{ TOOL CONFIGURATION }}
```

### ツール定義のベストプラクティス

Claudeでツールを使用する際に最高のパフォーマンスを得るには、以下のガイドラインに従ってください：

- **非常に詳細な説明を提供してください。** これはツールパフォーマンスにおいて最も重要な要素です。説明には、ツールに関するすべての詳細を説明する必要があります。以下を含みます：
  - ツールが何をするのか
  - いつ使用すべきか（そしていつ使用すべきでないか）
  - 各パラメータが何を意味し、ツールの動作にどのように影響するか
  - ツール名が不明確な場合、ツールが返さない情報など、重要な注意事項または制限事項。Claudeにツールについてより多くのコンテキストを提供できるほど、いつどのようにツールを使用するかを決定するのに優れています。ツール説明ごとに少なくとも3～4文を目指し、ツールが複雑な場合はそれ以上を目指してください。
- **説明を優先しますが、複雑なツールには`input_examples`の使用を検討してください。** 明確な説明が最も重要ですが、複雑な入力、ネストされたオブジェクト、またはフォーマットに敏感なパラメータを持つツールの場合、`input_examples`フィールド（ベータ版）を使用してスキーマ検証済みの例を提供できます。詳細は[ツール使用例の提供](#providing-tool-use-examples)を参照してください。

<section title="優れたツール説明の例">

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

<section title="ツール説明の悪い例">

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

優れた説明は、ツールが何をするのか、いつ使用するのか、どのようなデータを返すのか、および`ticker`パラメータが何を意味するのかを明確に説明しています。悪い説明は短すぎて、ツールの動作と使用方法についてClaudeに多くの未解決の質問を残しています。

## ツール使用例の提供

有効なツール入力の具体的な例を提供して、Claudeがツールをより効果的に使用する方法を理解するのに役立てることができます。これは、ネストされたオブジェクト、オプションパラメータ、またはフォーマットに敏感な入力を持つ複雑なツールに特に役立ちます。

<Info>
ツール使用例はベータ機能です。プロバイダーに適切な[ベータヘッダー](/docs/ja/api/beta-headers)を含めてください：

| プロバイダー | ベータヘッダー | サポートされているモデル |
|----------|-------------|------------------|
| Claude API,<br/>Microsoft Foundry | `advanced-tool-use-2025-11-20` | すべてのモデル |
| Vertex AI,<br/>Amazon Bedrock | `tool-examples-2025-10-29` | Claude Opus 4.5のみ |
</Info>

### 基本的な使用方法

ツール定義にオプションの`input_examples`フィールドを追加し、サンプル入力オブジェクトの配列を指定します。各例はツールの`input_schema`に従って有効である必要があります：

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

例はツールスキーマと一緒にプロンプトに含まれ、Claudeに適切に形成されたツール呼び出しの具体的なパターンを示します。これにより、Claudeはオプションパラメータをいつ含めるか、どのフォーマットを使用するか、複雑な入力をどのように構造化するかを理解するのに役立ちます。

### 要件と制限事項

- **スキーマ検証** - 各例はツールの`input_schema`に従って有効である必要があります。無効な例は400エラーを返します
- **サーバー側ツールではサポートされていません** - ユーザー定義ツールのみが入力例を持つことができます
- **トークンコスト** - 例はプロンプトトークンに追加されます：シンプルな例の場合は約20～50トークン、複雑なネストされたオブジェクトの場合は約100～200トークン

## ツールランナー（ベータ版）

ツールランナーは、Claudeでツールを実行するためのすぐに使用できるソリューションを提供します。ツール呼び出し、ツール結果、会話管理を手動で処理する代わりに、ツールランナーは自動的に：

- Claudeがツールを呼び出すときにツールを実行します
- リクエスト/レスポンスサイクルを処理します
- 会話状態を管理します
- タイプセーフティと検証を提供します

ほとんどのツール使用実装にはツールランナーの使用をお勧めします。

<Note>
ツールランナーは現在ベータ版であり、[Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md)、[TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers)、および[Ruby](https://github.com/anthropics/anthropic-sdk-ruby/blob/main/helpers.md#3-auto-looping-tool-runner-beta) SDKで利用可能です。
</Note>

<Tip>
**圧縮による自動コンテキスト管理**

ツールランナーは自動[圧縮](/docs/ja/build-with-claude/context-editing#client-side-compaction-sdk)をサポートしており、トークン使用量がしきい値を超えたときに要約を生成します。これにより、長時間実行されるエージェントタスクがコンテキストウィンドウの制限を超えて続行できます。
</Tip>

<Tabs>
<Tab title="Python">

### 基本的な使用方法

`@beta_tool`デコレータを使用してツールを定義し、`client.beta.messages.tool_runner()`を使用してそれらを実行します。

<Note>
非同期クライアントを使用している場合は、`@beta_tool`を`@beta_async_tool`に置き換え、関数を`async def`で定義してください。
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

デコレータされた関数は、テキスト、画像、またはドキュメントブロックを含むコンテンツブロックまたはコンテンツブロック配列を返す必要があります。これにより、ツールはリッチなマルチモーダルレスポンスを返すことができます。返された文字列はテキストコンテンツブロックに変換されます。
構造化されたJSONオブジェクトをClaudeに返したい場合は、返す前にJSON文字列にエンコードしてください。数値、ブール値、またはその他の非文字列プリミティブも文字列に変換する必要があります。

`@beta_tool`デコレータは関数の引数とdocstringを検査して、与えられた関数のjsonスキーマ表現を抽出します。上記の例では、`calculate_sum`は以下に変換されます：

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

### ツールランナーの反復処理

`tool_runner()`によって返されるツールランナーは反復可能であり、`for`ループで反復処理できます。これはしばしば「ツール呼び出しループ」と呼ばれます。
各ループの反復は、Claudeによって返されたメッセージを生成します。

ループ内の現在のメッセージを処理する機会がコードに与えられた後、ツールランナーはメッセージをチェックして、Claudeがツール使用をリクエストしたかどうかを確認します。そうである場合、ツールを呼び出し、ツール結果をClaudeに自動的に送り返し、次のループの反復を開始するためにClaudeからの次のメッセージを生成します。

シンプルな`break`ステートメントで任意の反復でループを終了できます。ツールランナーは、Claudeがツール使用なしでメッセージを返すまでループします。

中間メッセージに関心がない場合は、ループを使用する代わりに、`until_done()`メソッドを呼び出すことができます。これはClaudeからの最終メッセージを返します：

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

### 高度な使用方法

ループ内では、ツールランナーの次のリクエストをMessages APIに完全にカスタマイズする機能があります。
メソッド`runner.generate_tool_call_response()`はツールを呼び出し（Claudeがツール使用をトリガーした場合）、Messages APIに送り返されるツール結果へのアクセスを提供します。
メソッド`runner.set_messages_params()`と`runner.append_messages()`を使用すると、次のMessages APIリクエストのパラメータを変更できます。

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

### ストリーミング

`stream=True`でストリーミングを有効にすると、ツールランナーが発行する各値は、`anthropic.messages.stream()`から返される`BetaMessageStream`です。`BetaMessageStream`自体は、Messages APIからのストリーミングイベントを生成する反復可能です。

`message_stream.get_final_message()`を使用して、SDKにストリーミングイベントの最終メッセージへの蓄積を行わせることができます。

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

### 基本的な使用方法

Zod検証を使用したタイプセーフなツール定義には`betaZodTool()`を使用します（Zod 3.25.0以上が必要）。

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

`run`関数は、テキスト、画像、またはドキュメントブロックを含むコンテンツブロックまたはコンテンツブロック配列を返す必要があります。これにより、ツールはリッチなマルチモーダルレスポンスを返すことができます。返された文字列はテキストコンテンツブロックに変換されます。
構造化されたJSONオブジェクトをClaudeに返したい場合は、返す前にJSON文字列にエンコードしてください。数値、ブール値、またはその他の非文字列プリミティブも文字列に変換する必要があります。

### ツールランナーの反復処理

`toolRunner()`によって返されるツールランナーは非同期反復可能であり、`for await ... of`ループで反復処理できます。これはしばしば「ツール呼び出しループ」と呼ばれます。
各ループの反復は、Claudeによって返されたメッセージを生成します。

ループ内の現在のメッセージを処理する機会がコードに与えられた後、ツールランナーはメッセージをチェックして、Claudeがツール使用をリクエストしたかどうかを確認します。そうである場合、ツールを呼び出し、ツール結果をClaudeに自動的に送り返し、次のループの反復を開始するためにClaudeからの次のメッセージを生成します。

シンプルな`break`ステートメントで任意の反復でループを終了できます。ツールランナーは、Claudeがツール使用なしでメッセージを返すまでループします。

中間メッセージに関心がない場合は、ループを使用する代わりに、ツールランナーを`await`することで、Claudeからの最終メッセージを返すことができます。

### 高度な使用方法

ループ内では、ツールランナーの次のリクエストをMessages APIに完全にカスタマイズする機能があります。
メソッド`runner.generateToolResponse()`はツールを呼び出し（Claudeがツール使用をトリガーした場合）、Messages APIに送り返されるツール結果へのアクセスを提供します。
メソッド`runner.setMessagesParams()`と`runner.pushMessages()`を使用すると、次のMessages APIリクエストのパラメータを変更できます。現在のパラメータは`runner.params`の下で利用可能です。

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

### ストリーミング

`stream: true`でストリーミングを有効にすると、ツールランナーが発行する各値は、`anthropic.messages.stream()`から返される`MessageStream`です。`MessageStream`自体は、Messages APIからのストリーミングイベントを生成する非同期反復可能です。

`messageStream.finalMessage()`を使用して、SDKにストリーミングイベントの最終メッセージへの蓄積を行わせることができます。

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

### 基本的な使用方法

JSONスキーマに基づくタイプセーフなツール定義には`betaTool()`を使用します。TypeScriptとエディタは、オートコンプリートのために`input`パラメータのタイプを認識します。

<Note>
Claudeによって生成された入力は実行時に検証されません。必要に応じて`run`関数内で検証を実行してください。
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

`run`関数は、テキスト、画像、またはドキュメントブロックを含むコンテンツブロックまたはコンテンツブロック配列を返す必要があります。これにより、ツールはリッチなマルチモーダルレスポンスを返すことができます。返された文字列はテキストコンテンツブロックに変換されます。
構造化されたJSONオブジェクトをClaudeに返したい場合は、返す前にJSON文字列にエンコードしてください。数値、ブール値、またはその他の非文字列プリミティブも文字列に変換する必要があります。

### ツールランナーの反復処理

`toolRunner()`によって返されるツールランナーは非同期反復可能であり、`for await ... of`ループで反復処理できます。これはしばしば「ツール呼び出しループ」と呼ばれます。
各ループの反復は、Claudeによって返されたメッセージを生成します。

ループ内の現在のメッセージを処理する機会がコードに与えられた後、ツールランナーはメッセージをチェックして、Claudeがツール使用をリクエストしたかどうかを確認します。そうである場合、ツールを呼び出し、ツール結果をClaudeに自動的に送り返し、次のループの反復を開始するためにClaudeからの次のメッセージを生成します。

シンプルな`break`ステートメントで任意の反復でループを終了できます。ツールランナーは、Claudeがツール使用なしでメッセージを返すまでループします。

中間メッセージに関心がない場合は、ループを使用する代わりに、ツールランナーを`await`することで、Claudeからの最終メッセージを返すことができます。

### 高度な使用方法

ループ内では、ツールランナーの次のリクエストをMessages APIに完全にカスタマイズする機能があります。
メソッド`runner.generateToolResponse()`はツールを呼び出し（Claudeがツール使用をトリガーした場合）、Messages APIに送り返されるツール結果へのアクセスを提供します。
メソッド`runner.setMessagesParams()`と`runner.pushMessages()`を使用すると、次のMessages APIリクエストのパラメータを変更できます。現在のパラメータは`runner.params`の下で利用可能です。

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

### ストリーミング

`stream: true`でストリーミングを有効にすると、ツールランナーが発行する各値は、`anthropic.messages.stream()`から返される`MessageStream`です。`MessageStream`自体は、Messages APIからのストリーミングイベントを生成する非同期反復可能です。

`messageStream.finalMessage()`を使用して、SDKにストリーミングイベントの最終メッセージへの蓄積を行わせることができます。

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

### 基本的な使用方法

`Anthropic::BaseTool`を使用してツールを定義し、入力スキーマを指定してから、`client.beta.messages.tool_runner`を使用してそれらを実行します。

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

`call`メソッドは文字列またはコンテンツブロック配列を返す必要があります。構造化されたJSONオブジェクトをClaudeに返したい場合は、返す前にJSON文字列にエンコードしてください。

`Anthropic::BaseTool`クラスは、ツール説明に`doc`メソッドを使用し、`input_schema`を使用して予期されるパラメータを定義します。SDKは自動的にこれを適切なJSONスキーマ形式に変換します。

### ツールランナーの反復処理

ツールランナーは、会話が進むにつれて各メッセージを生成する`each_message`メソッドを提供します。これはしばしば「ツール呼び出しループ」と呼ばれます。

コードが現在のメッセージを処理する機会を得た後、ツールランナーはClaudeがツール使用をリクエストしたかどうかをチェックします。そうである場合、ツールを呼び出し、ツール結果をClaudeに自動的に送り返し、次のメッセージを生成します。

中間メッセージに関心がない場合は、`run_until_finished`メソッドを使用してすべてのメッセージを一度に取得できます：

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

### 高度な使用方法

ツールランナーは動作をカスタマイズするためのいくつかのメソッドを提供します：

- `#next_message` - 会話を1回に1つのメッセージで手動でステップスルーします
- `#feed_messages` - 会話の途中に追加のメッセージを注入します
- `#params` - 現在のリクエストパラメータにアクセスまたは変更します

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

### ストリーミング

ストリーミングを使用する場合は、`each_streaming`で反復処理してリアルタイムイベントを受け取ります：

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
SDK ツールランナーはベータ版です。このドキュメントの残りの部分は、手動ツール実装をカバーしています。
</Note>

## Claudeの出力の制御

### ツール使用の強制

場合によっては、Claudeがツールなしで答えを提供できると考えていても、特定のツールを使用してユーザーの質問に答えるようにClaudeに強制したいことがあります。これは、`tool_choice`フィールドでツールを指定することで実行できます：

```
tool_choice = {"type": "tool", "name": "get_weather"}
```

`tool_choice`パラメータを使用する場合、4つの可能なオプションがあります：

- `auto`はClaudeが提供されたツールを呼び出すかどうかを決定することを許可します。これは`tools`が提供されるときのデフォルト値です。
- `any`はClaudeに提供されたツールの1つを使用する必要があることを伝えますが、特定のツールを強制しません。
- `tool`は特定のツールを常に使用するようにClaudeを強制することを許可します。
- `none`はClaudeがツールを使用することを防止します。これは`tools`が提供されないときのデフォルト値です。

<Note>
[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching#what-invalidates-the-cache)を使用する場合、`tool_choice`パラメータへの変更はキャッシュされたメッセージブロックを無効化します。ツール定義とシステムプロンプトはキャッシュされたままですが、メッセージコンテンツは再処理される必要があります。
</Note>

このダイアグラムは、各オプションがどのように機能するかを示しています：

<Frame>
  ![Image](/docs/images/tool_choice.png)
</Frame>

`tool_choice`が`any`または`tool`の場合、アシスタントメッセージをプリフィルして、ツールを使用するよう強制することに注意してください。これは、明示的に要求された場合でも、モデルが`tool_use`コンテンツブロックの前に自然言語応答または説明を発行しないことを意味します。

<Note>
[拡張思考](/docs/ja/build-with-claude/extended-thinking)でツール使用を使用する場合、`tool_choice: {"type": "any"}`と`tool_choice: {"type": "tool", "name": "..."}`はサポートされておらず、エラーが発生します。`tool_choice: {"type": "auto"}`（デフォルト）と`tool_choice: {"type": "none"}`のみが拡張思考と互換性があります。
</Note>

テストでは、これがパフォーマンスを低下させないことが示されています。モデルが特定のツールを使用するよう要求しながら、自然言語コンテキストまたは説明を提供するようにモデルに希望する場合は、`tool_choice`に`{"type": "auto"}`（デフォルト）を使用し、`user`メッセージに明示的な指示を追加できます。例えば：`What's the weather like in London? Use the get_weather tool in your response.`

<Tip>
**厳密なツールで保証されたツール呼び出し**

`tool_choice: {"type": "any"}`を[厳密なツール使用](/docs/ja/build-with-claude/structured-outputs)と組み合わせて、ツールの1つが呼び出されることを保証し、ツール入力がスキーマに厳密に従うことを保証します。ツール定義で`strict: true`を設定してスキーマ検証を有効にします。
</Tip>

### JSON出力

ツールは必ずしもクライアント関数である必要はありません。提供されたスキーマに従うJSON出力をモデルに返させたい場合はいつでも、ツールを使用できます。例えば、特定のスキーマを持つ`record_summary`ツールを使用する場合があります。完全に機能する例については、[Claudeでのツール使用](/docs/ja/agents-and-tools/tool-use/overview)を参照してください。

### ツールを使用したモデルの応答

ツールを使用する場合、Claudeはツールを呼び出す前に、自分が何をしているかについてコメントしたり、ユーザーに自然に応答したりすることがよくあります。

例えば、「サンフランシスコの現在の天気はどうですか、そこの時刻は何ですか？」というプロンプトが与えられた場合、Claudeは以下のように応答する可能性があります：

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

この自然な応答スタイルは、ユーザーがClaudeが何をしているかを理解するのに役立ち、より会話的なインタラクションを作成します。システムプロンプトと、プロンプトに`<examples>`を提供することで、これらの応答のスタイルと内容をガイドできます。

Claudeが自分のアクションを説明する際に、様々な言い回しとアプローチを使用する可能性があることに注意することが重要です。コードはこれらの応答を他のアシスタント生成テキストと同じように扱い、特定のフォーマット規約に依存しないようにする必要があります。

### 並列ツール使用

デフォルトでは、Claudeはユーザークエリに答えるために複数のツールを使用する可能性があります。この動作は以下の方法で無効にできます：

- tool_choiceタイプが`auto`の場合に`disable_parallel_tool_use=true`を設定すると、Claudeは**最大1つの**ツールを使用します
- tool_choiceタイプが`any`または`tool`の場合に`disable_parallel_tool_use=true`を設定すると、Claudeは**正確に1つの**ツールを使用します

<section title="並列ツール使用の完全な例">

<Note>
**ツールランナーの方がシンプル**：以下の例は手動の並列ツール処理を示しています。ほとんどのユースケースでは、[ツールランナー](#tool-runner-beta)が並列ツール実行を自動的に処理し、コードがはるかに少なくなります。
</Note>

メッセージ履歴で並列ツール呼び出しを正しくフォーマットする方法を示す完全な例を以下に示します：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# ツールを定義
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

# 初期リクエスト
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

# Claudeがツールを使用したいかどうかを確認
print("Claude wants to use tools:", response.stop_reason == "tool_use")
print("Number of tool calls:", len([c for c in response.content if c.type == "tool_use"]))

# ツール結果を含む会話を構築
messages = [
    {
        "role": "user",
        "content": "What's the weather in SF and NYC, and what time is it there?"
    },
    {
        "role": "assistant",
        "content": response.content  # 複数のtool_useブロックを含む
    },
    {
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": "toolu_01",  # tool_useのIDと一致する必要があります
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

# 最終応答を取得
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

// ツールを定義
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

// 初期リクエスト
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

// ツール結果を含む会話を構築
const messages = [
  {
    role: "user",
    content: "What's the weather in SF and NYC, and what time is it there?"
  },
  {
    role: "assistant",
    content: response.content  // 複数のtool_useブロックを含む
  },
  {
    role: "user",
    content: [
      {
        type: "tool_result",
        tool_use_id: "toolu_01",  // tool_useのIDと一致する必要があります
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

// 最終応答を取得
const finalResponse = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: tools,
  messages: messages
});

console.log(finalResponse.content[0].text);
```
</CodeGroup>

並列ツール呼び出しを含むアシスタントメッセージは以下のようになります：

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
<section title="並列ツール用の完全なテストスクリプト">

並列ツール呼び出しが正しく機能しているかテストして検証するための完全で実行可能なスクリプトを以下に示します：

<CodeGroup>
```python Python
#!/usr/bin/env python3
"""Claude APIで並列ツール呼び出しを検証するテストスクリプト"""

import os
from anthropic import Anthropic

# クライアントを初期化
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

# ツールを定義
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

# 並列ツール呼び出しを含むテスト会話
messages = [
    {
        "role": "user",
        "content": "What's the weather in SF and NYC, and what time is it there?"
    }
]

# 初期リクエストを作成
print("Requesting parallel tool calls...")
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

# 並列ツール呼び出しを確認
tool_uses = [block for block in response.content if block.type == "tool_use"]
print(f"\n✓ Claudeが{len(tool_uses)}個のツール呼び出しを実行しました")

if len(tool_uses) > 1:
    print("✓ 並列ツール呼び出しが検出されました！")
    for tool in tool_uses:
        print(f"  - {tool.name}: {tool.input}")
else:
    print("✗ 並列ツール呼び出しが検出されませんでした")

# ツール実行をシミュレートして結果を正しくフォーマット
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

# ツール結果を含む会話を続行
messages.extend([
    {"role": "assistant", "content": response.content},
    {"role": "user", "content": tool_results}  # すべての結果が1つのメッセージに！
])

# 最終応答を取得
print("\n最終応答を取得中...")
final_response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=tools
)

print(f"\nClaudeの応答:\n{final_response.content[0].text}")

# フォーマットを検証
print("\n--- 検証 ---")
print(f"✓ ツール結果が単一のユーザーメッセージで送信されました：{len(tool_results)}個の結果")
print("✓ コンテンツ配列のツール結果の前にテキストがありません")
print("✓ 将来の並列ツール使用のために会話が正しくフォーマットされています")
```

```typescript TypeScript
#!/usr/bin/env node
// Claude APIで並列ツール呼び出しを検証するテストスクリプト

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ツールを定義
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
  // 初期リクエストを作成
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

  // 並列ツール呼び出しを確認
  const toolUses = response.content.filter(block => block.type === "tool_use");
  console.log(`\n✓ Claudeが${toolUses.length}個のツール呼び出しを実行しました`);

  if (toolUses.length > 1) {
    console.log("✓ 並列ツール呼び出しが検出されました！");
    toolUses.forEach(tool => {
      console.log(`  - ${tool.name}: ${JSON.stringify(tool.input)}`);
    });
  } else {
    console.log("✗ 並列ツール呼び出しが検出されませんでした");
  }

  // ツール実行をシミュレートして結果を正しくフォーマット
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

  // 正しいフォーマットで最終応答を取得
  console.log("\n最終応答を取得中...");
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      { role: "user", content: "What's the weather in SF and NYC, and what time is it there?" },
      { role: "assistant", content: response.content },
      { role: "user", content: toolResults }  // すべての結果が1つのメッセージに！
    ],
    tools: tools
  });

  console.log(`\nClaudeの応答:\n${finalResponse.content[0].text}`);

  // フォーマットを検証
  console.log("\n--- 検証 ---");
  console.log(`✓ ツール結果が単一のユーザーメッセージで送信されました：${toolResults.length}個の結果`);
  console.log("✓ コンテンツ配列のツール結果の前にテキストがありません");
  console.log("✓ 将来の並列ツール使用のために会話が正しくフォーマットされています");
}

testParallelTools().catch(console.error);
```
</CodeGroup>

このスクリプトは以下を示しています：
- 並列ツール呼び出しと結果を正しくフォーマットする方法
- 並列呼び出しが行われていることを検証する方法
- 将来の並列ツール使用を促進する正しいメッセージ構造
- 回避すべき一般的な間違い（ツール結果の前のテキストなど）

このスクリプトを実行して実装をテストし、Claudeが並列ツール呼び出しを効果的に行っていることを確認してください。

</section>

#### 並列ツール使用を最大化する

Claude 4モデルはデフォルトで優れた並列ツール使用機能を備えていますが、ターゲットプロンプティングを使用してすべてのモデルで並列ツール実行の可能性を高めることができます：

<section title="並列ツール使用のためのシステムプロンプト">

Claude 4モデル（Opus 4およびSonnet 4）の場合、システムプロンプトに以下を追加します：
```text
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.
```

さらに強力な並列ツール使用の場合（デフォルトが十分でない場合は推奨）、以下を使用します：
```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Prioritize calling tools in parallel whenever possible. For example, when reading 3 files, run 3 tool calls in parallel to read all 3 files into context at the same time. When running multiple read-only commands like `ls` or `list_dir`, always run all of the commands in parallel. Err on the side of maximizing parallel tool calls rather than running too many tools sequentially.
</use_parallel_tool_calls>
```

</section>
<section title="ユーザーメッセージプロンプティング">

特定のユーザーメッセージ内で並列ツール使用を促すこともできます：

```python
# 代わりに：
"What's the weather in Paris? Also check London."

# 使用：
"Check the weather in Paris and London simultaneously."

# または明示的に：
"Please use parallel tool calls to get the weather for Paris, London, and Tokyo at the same time."
```

</section>

<Warning>
**Claude Sonnet 3.7での並列ツール使用**

Claude Sonnet 3.7は、`disable_parallel_tool_use`を設定していない場合でも、応答で並列ツール呼び出しを行う可能性が低い場合があります。[Claude 4モデルへのアップグレード](/docs/ja/about-claude/models/migrating-to-claude-4)をお勧めします。これらはトークン効率的なツール使用と改善された並列ツール呼び出しを備えています。

Claude Sonnet 3.7をまだ使用している場合は、`token-efficient-tools-2025-02-19` [ベータヘッダー](/docs/ja/api/beta-headers)を有効にすることができます。これはClaudeが並列ツールを使用するよう促すのに役立ちます。また、他のツールへの呼び出しを同時にラップできるメタツールとして機能できる「バッチツール」を導入することもできます。

このワークアラウンドの使用方法については、[このクックブックの例](https://github.com/anthropics/anthropic-cookbook/blob/main/tool_use/parallel_tools_claude_3_7_sonnet.ipynb)を参照してください。

</Warning>

## ツール使用とツール結果コンテンツブロックの処理

<Note>
**ツールランナーの方がシンプル**：このセクションで説明されている手動ツール処理は、[ツールランナー](#tool-runner-beta)によって自動的に管理されます。ツール実行をカスタム制御する必要がある場合は、このセクションを使用してください。
</Note>

Claudeの応答は、クライアントツールとサーバーツールのどちらを使用するかによって異なります。

### クライアントツールからの結果の処理

応答には`tool_use`の`stop_reason`と、以下を含む1つ以上の`tool_use`コンテンツブロックがあります：

- `id`：この特定のツール使用ブロックの一意の識別子。これは後でツール結果と照合するために使用されます。
- `name`：使用されているツールの名前。
- `input`：ツールの`input_schema`に準拠するツールに渡される入力を含むオブジェクト。

<section title="`tool_use`コンテンツブロックを含むAPI応答の例">

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

クライアントツールのツール使用応答を受け取った場合、以下を実行する必要があります：

1. `tool_use`ブロックから`name`、`id`、および`input`を抽出します。
2. ツール名に対応するコードベース内の実際のツールを実行し、ツール`input`を渡します。
3. `role`が`user`の新しいメッセージを送信して会話を続行し、`tool_result`タイプを含む`content`ブロックと以下の情報を含めます：
   - `tool_use_id`：これが結果である対象のツール使用リクエストの`id`。
   - `content`：ツールの結果。文字列（例：`"content": "15 degrees"`）、ネストされたコンテンツブロックのリスト（例：`"content": [{"type": "text", "text": "15 degrees"}]`）、またはドキュメントブロックのリスト（例：`"content": ["type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "15 degrees"}]`）。これらのコンテンツブロックは`text`、`image`、または`document`タイプを使用できます。
   - `is_error`（オプション）：ツール実行がエラーで終了した場合は`true`に設定します。

<Note>
**重要なフォーマット要件**：
- ツール結果ブロックは、メッセージ履歴内の対応するツール使用ブロックの直後に続く必要があります。アシスタントのツール使用メッセージとユーザーのツール結果メッセージの間にメッセージを含めることはできません。
- ツール結果を含むユーザーメッセージでは、tool_resultブロックはコンテンツ配列の**最初に**来る必要があります。すべてのテキストはツール結果の**後に**来る必要があります。

例えば、これは400エラーを引き起こします：
```json
{"role": "user", "content": [
  {"type": "text", "text": "Here are the results:"},  // ❌ tool_resultの前のテキスト
  {"type": "tool_result", "tool_use_id": "toolu_01", ...}
]}
```

これは正しいです：
```json
{"role": "user", "content": [
  {"type": "tool_result", "tool_use_id": "toolu_01", ...},
  {"type": "text", "text": "What should I do next?"}  // ✅ tool_resultの後のテキスト
]}
```

「tool_use idsが見つかりましたが、その直後にtool_resultブロックがありません」というエラーが表示される場合は、ツール結果が正しくフォーマットされていることを確認してください。
</Note>

<section title="成功したツール結果の例">

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

<section title="画像を含むツール結果の例">

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
<section title="空のツール結果の例">

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

<section title="ドキュメントを含むツール結果の例">

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

ツール結果を受け取った後、Claudeはその情報を使用して、元のユーザープロンプトへの応答の生成を続行します。

### サーバーツールからの結果の処理

Claudeはツールを内部で実行し、追加のユーザーインタラクションを必要とせずに結果を応答に直接組み込みます。

<Tip>
  **他のAPIとの違い**

ツール使用を分離したり、`tool`または`function`などの特別なロールを使用したりするAPIとは異なり、Claude APIはツールを`user`および`assistant`メッセージ構造に直接統合します。

メッセージには`text`、`image`、`tool_use`、および`tool_result`ブロックの配列が含まれます。`user`メッセージにはクライアントコンテンツと`tool_result`が含まれ、`assistant`メッセージにはAI生成コンテンツと`tool_use`が含まれます。

</Tip>

### `max_tokens`停止理由の処理

Claudeの[応答が`max_tokens`制限に達したため切り取られた](/docs/ja/build-with-claude/handling-stop-reasons#max-tokens)場合、切り取られた応答に不完全なツール使用ブロックが含まれている場合は、より高い`max_tokens`値でリクエストを再試行して、完全なツール使用を取得する必要があります。

<CodeGroup>
```python Python
# ツール使用中に応答が切り取られたかどうかを確認
if response.stop_reason == "max_tokens":
    # 最後のコンテンツブロックが不完全なtool_useであるかどうかを確認
    last_block = response.content[-1]
    if last_block.type == "tool_use":
        # より高いmax_tokensでリクエストを送信
        response = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=4096,  # 増加した制限
            messages=messages,
            tools=tools
        )
```

```typescript TypeScript
// ツール使用中に応答が切り取られたかどうかを確認
if (response.stop_reason === "max_tokens") {
  // 最後のコンテンツブロックが不完全なtool_useであるかどうかを確認
  const lastBlock = response.content[response.content.length - 1];
  if (lastBlock.type === "tool_use") {
    // より高いmax_tokensでリクエストを送信
    response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096, // 増加した制限
      messages: messages,
      tools: tools
    });
  }
}
```
</CodeGroup>

#### `pause_turn`停止理由の処理

Webサーチなどのサーバーツールを使用する場合、APIは`pause_turn`停止理由を返す可能性があり、APIが長時間実行されているターンを一時停止したことを示します。

`pause_turn`停止理由を処理する方法は以下の通りです：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Webサーチを使用した初期リクエスト
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

# 応答がpause_turn停止理由を持つかどうかを確認
if response.stop_reason == "pause_turn":
    # 一時停止されたコンテンツを含む会話を続行
    messages = [
        {"role": "user", "content": "Search for comprehensive information about quantum computing breakthroughs in 2025"},
        {"role": "assistant", "content": response.content}
    ]

    # 継続リクエストを送信
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

// Webサーチを使用した初期リクエスト
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

// 応答がpause_turn停止理由を持つかどうかを確認
if (response.stop_reason === "pause_turn") {
  // 一時停止されたコンテンツを含む会話を続行
  const messages = [
    { role: "user", content: "Search for comprehensive information about quantum computing breakthroughs in 2025" },
    { role: "assistant", content: response.content }
  ];

  // 継続リクエストを送信
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

`pause_turn`を処理する場合：
- **会話を続行する**：一時停止された応答をそのまま後続のリクエストに渡して、Claudeがターンを続行できるようにします
- **必要に応じて変更する**：会話を中断またはリダイレクトしたい場合は、オプションで続行前にコンテンツを変更できます
- **ツール状態を保持する**：機能を維持するために、継続リクエストに同じツールを含めます

## エラーのトラブルシューティング

<Note>
**組み込みエラー処理**：[ツールランナー](#tool-runner-beta)は、ほとんどの一般的なシナリオに対して自動エラー処理を提供します。このセクションでは、高度なユースケースの手動エラー処理について説明します。
</Note>

Claudeでツールを使用する場合、いくつかの異なるタイプのエラーが発生する可能性があります：

<section title="ツール実行エラー">

ツール自体が実行中にエラーをスローする場合（例：天気データを取得する際のネットワークエラー）、`content`に`"is_error": true`とともにエラーメッセージを返すことができます：

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

Claudeはこのエラーを応答に組み込みます。例えば、「申し訳ございませんが、天気サービスAPIが利用できないため、現在の天気を取得できませんでした。後でもう一度お試しください。」

</section>
<section title="無効なツール名">

Claudeがツールの使用を試みるのが無効な場合（例：必須パラメータが不足している）、通常はClaudeがツールを正しく使用するための十分な情報がなかったことを意味します。開発中の最善の方法は、ツール定義の`description`値をより詳細にしてリクエストを再度試行することです。

ただし、エラーを示す`tool_result`で会話を続行することもでき、Claudeは不足している情報を入力して再度ツールを使用しようとします：

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

ツールリクエストが無効または不足しているパラメータがある場合、Claudeは修正を加えて2～3回再試行してからユーザーに謝罪します。

<Tip>
無効なツール呼び出しを完全に排除するには、ツール定義で`strict: true`を使用して[厳密なツール使用](/docs/ja/build-with-claude/structured-outputs)を使用します。これにより、ツール入力が常にスキーマと正確に一致することが保証され、不足しているパラメータと型の不一致が防止されます。
</Tip>

</section>
<section title="\<search_quality_reflection\>タグ">

Claudeが\<search_quality_reflection\>タグで検索品質を反映するのを防ぐには、プロンプトに「返された検索結果の品質について応答で反映しないでください」を追加します。

</section>
<section title="サーバーツールエラー">

サーバーツールがエラーに遭遇した場合（例：Webサーチのネットワーク問題）、Claudeはこれらのエラーを透過的に処理し、ユーザーに代替応答または説明を提供しようとします。クライアントツールとは異なり、サーバーツールの`is_error`結果を処理する必要はありません。

Webサーチの場合、可能なエラーコードは以下の通りです：
- `too_many_requests`：レート制限を超過
- `invalid_input`：無効な検索クエリパラメータ
- `max_uses_exceeded`：最大Webサーチツール使用回数を超過
- `query_too_long`：クエリが最大長を超過
- `unavailable`：内部エラーが発生しました

</section>
<section title="並列ツール呼び出しが機能していない">

Claudeが予期したときに並列ツール呼び出しを行わない場合は、これらの一般的な問題を確認してください：

**1. 不正なツール結果フォーマット**

最も一般的な問題は、会話履歴でツール結果を不正にフォーマットすることです。これはClaudeに並列呼び出しを回避するよう「教えます」。

特に並列ツール使用の場合：
- ❌ **間違い**：各ツール結果に対して個別のユーザーメッセージを送信
- ✅ **正しい**：すべてのツール結果は単一のユーザーメッセージに含まれる必要があります

```json
// ❌ これは並列ツール使用を減らします
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1]},
  {"role": "user", "content": [tool_result_2]}  // 個別のメッセージ
]

// ✅ これは並列ツール使用を維持します
[
  {"role": "assistant", "content": [tool_use_1, tool_use_2]},
  {"role": "user", "content": [tool_result_1, tool_result_2]}  // 単一のメッセージ
]
```

上記の[一般的なフォーマット要件](#handling-tool-use-and-tool-result-content-blocks)を参照してください。

**2. 弱いプロンプティング**

デフォルトプロンプティングは十分でない場合があります。より強力な言語を使用します：

```text
<use_parallel_tool_calls>
For maximum efficiency, whenever you perform multiple independent operations,
invoke all relevant tools simultaneously rather than sequentially.
Prioritize calling tools in parallel whenever possible.
</use_parallel_tool_calls>
```

**3. 並列ツール使用の測定**

並列ツール呼び出しが機能していることを確認するには：

```python
# ツール呼び出しメッセージあたりの平均ツール数を計算
tool_call_messages = [msg for msg in messages if any(
    block.type == "tool_use" for block in msg.content
)]
total_tool_calls = sum(
    len([b for b in msg.content if b.type == "tool_use"])
    for msg in tool_call_messages
)
avg_tools_per_message = total_tool_calls / len(tool_call_messages)
print(f"Average tools per message: {avg_tools_per_message}")
# 並列呼び出しが機能している場合は> 1.0である必要があります
```

**4. モデル固有の動作**

- Claude Opus 4.5、Opus 4.1、およびSonnet 4：最小限のプロンプティングで並列ツール使用に優れています
- Claude Sonnet 3.7：より強力なプロンプティングまたは`token-efficient-tools-2025-02-19` [ベータヘッダー](/docs/ja/api/beta-headers)が必要な場合があります。[Claude 4へのアップグレード](/docs/ja/about-claude/models/migrating-to-claude-4)を検討してください。
- Claude Haiku：明示的なプロンプティングなしで並列ツールを使用する可能性は低い

</section>