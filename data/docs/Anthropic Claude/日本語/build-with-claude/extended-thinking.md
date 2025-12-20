# 拡張思考を使用した構築

拡張思考を使用してClaudeの推論能力を強化し、複雑なタスクに対応する方法を学びます。

---

拡張思考により、Claudeは複雑なタスクに対して強化された推論能力を備え、最終的な回答を提供する前に段階的な思考プロセスへのさまざまなレベルの透明性を提供します。

## サポートされているモデル

拡張思考は以下のモデルでサポートされています：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([非推奨](/docs/ja/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
APIの動作はClaude Sonnet 3.7とClaude 4モデル間で異なりますが、APIの形状は完全に同じです。

詳細については、[モデルバージョン間の思考の違い](#differences-in-thinking-across-model-versions)を参照してください。
</Note>

## 拡張思考の仕組み

拡張思考が有効になると、Claudeは内部推論を出力する`thinking`コンテンツブロックを作成します。Claudeはこの推論からの洞察を組み込んでから、最終的な応答を作成します。

APIレスポンスには`thinking`コンテンツブロックが含まれ、その後に`text`コンテンツブロックが続きます。

デフォルトのレスポンス形式の例を以下に示します：

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

拡張思考のレスポンス形式の詳細については、[Messages APIリファレンス](/docs/ja/api/messages)を参照してください。

## 拡張思考の使用方法

Messages APIで拡張思考を使用する例を以下に示します：

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

拡張思考を有効にするには、`thinking`オブジェクトを追加し、`type`パラメータを`enabled`に設定し、`budget_tokens`を拡張思考の指定されたトークン予算に設定します。

`budget_tokens`パラメータは、Claudeが内部推論プロセスに使用できる最大トークン数を決定します。Claude 4モデルでは、この制限は完全な思考トークンに適用され、[要約された出力](#summarized-thinking)には適用されません。より大きな予算は、複雑な問題に対してより徹底的な分析を可能にすることで応答品質を向上させることができますが、Claudeは割り当てられた予算全体を使用しない場合があります。特に32k以上の範囲では使用しない場合があります。

`budget_tokens`は`max_tokens`より小さい値に設定する必要があります。ただし、[ツールを使用したインターリーブ思考](#interleaved-thinking)を使用する場合、トークン制限がコンテキストウィンドウ全体（200kトークン）になるため、この制限を超えることができます。

### 要約された思考

拡張思考が有効になると、Claude 4モデルのMessages APIはClaudeの完全な思考プロセスの要約を返します。要約された思考は、拡張思考の完全な知能上の利点を提供しながら、悪用を防ぎます。

要約された思考に関する重要な考慮事項を以下に示します：

- 要約トークンではなく、元のリクエストによって生成された完全な思考トークンに対して課金されます。
- 請求される出力トークン数は、レスポンスに表示されるトークン数と**一致しません**。
- 思考出力の最初の数行はより詳細で、プロンプトエンジニアリングの目的に特に役立つ詳細な推論を提供します。
- Anthropicが拡張思考機能を改善しようとしているため、要約動作は変更される可能性があります。
- 要約は、Claudeの思考プロセスの重要なアイデアを最小限の追加レイテンシで保持し、ストリーム可能なユーザーエクスペリエンスとClaude Sonnet 3.7からClaude 4モデルへの簡単な移行を可能にします。
- 要約は、リクエストで対象とするモデルとは異なるモデルによって処理されます。思考モデルは要約された出力を見ません。

<Note>
Claude Sonnet 3.7は引き続き完全な思考出力を返します。

Claude 4モデルの完全な思考出力へのアクセスが必要な稀なケースでは、[営業チームにお問い合わせください](mailto:sales@anthropic.com)。
</Note>

### ストリーミング思考

[サーバー送信イベント（SSE）](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents)を使用して拡張思考レスポンスをストリーミングできます。

拡張思考でストリーミングが有効になると、`thinking_delta`イベントを介して思考コンテンツを受け取ります。

Messages APIを介したストリーミングの詳細については、[ストリーミングメッセージ](/docs/ja/build-with-claude/streaming)を参照してください。

思考を使用したストリーミングの処理方法を以下に示します：

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
  コンソールで試す
</TryInConsoleButton>

ストリーミング出力の例：
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
思考を有効にしてストリーミングを使用する場合、テキストが時々大きなチャンクで到着し、小さなトークンごとの配信と交互になることに気付くかもしれません。これは予想される動作です。特に思考コンテンツの場合です。

ストリーミングシステムは最適なパフォーマンスのためにコンテンツをバッチで処理する必要があり、この「チャンキー」な配信パターンが生じる可能性があり、ストリーミングイベント間に遅延が生じる可能性があります。私たちは継続的にこのエクスペリエンスを改善するために取り組んでおり、将来の更新は思考コンテンツをより滑らかにストリーミングすることに焦点を当てています。
</Note>

## ツール使用を伴う拡張思考

拡張思考は[ツール使用](/docs/ja/agents-and-tools/tool-use/overview)と一緒に使用でき、Claudeがツール選択と結果処理を通じて推論することができます。

ツール使用を伴う拡張思考を使用する場合、以下の制限に注意してください：

1. **ツール選択の制限**：思考を伴うツール使用は`tool_choice: {"type": "auto"}`（デフォルト）または`tool_choice: {"type": "none"}`のみをサポートします。`tool_choice: {"type": "any"}`または`tool_choice: {"type": "tool", "name": "..."}`を使用するとエラーが発生します。これらのオプションはツール使用を強制するため、拡張思考と互換性がありません。

2. **思考ブロックの保持**：ツール使用中に、最後のアシスタントメッセージの`thinking`ブロックをAPIに戻す必要があります。推論の連続性を維持するために、完全な未修正ブロックをAPIに戻してください。

### 会話での思考モードの切り替え

アシスタントターンの途中（ツール使用ループ中を含む）で思考を切り替えることはできません。アシスタントターン全体は単一の思考モードで動作する必要があります：

- **思考が有効な場合**、最終的なアシスタントターンは思考ブロックで始まる必要があります。
- **思考が無効な場合**、最終的なアシスタントターンは思考ブロックを含まない必要があります

モデルの観点から、**ツール使用ループはアシスタントターンの一部です**。アシスタントターンは、Claudeが完全な応答を完了するまで完了しません。これには複数のツール呼び出しと結果が含まれる場合があります。

例えば、このシーケンスはすべて**単一のアシスタントターン**の一部です：
```
User: "What's the weather in Paris?"
Assistant: [thinking] + [tool_use: get_weather]
User: [tool_result: "20°C, sunny"]
Assistant: [text: "The weather in Paris is 20°C and sunny"]
```

複数のAPIメッセージがありますが、ツール使用ループは概念的には1つの継続的なアシスタント応答の一部です。

#### 一般的なエラーシナリオ

このエラーが発生する場合があります：
```
Expected `thinking` or `redacted_thinking`, but found `tool_use`.
When `thinking` is enabled, a final `assistant` message must start
with a thinking block (preceding the lastmost set of `tool_use` and
`tool_result` blocks).
```

これは通常、以下の場合に発生します：
1. ツール使用シーケンス中に思考が**無効**だった
2. 思考を再度有効にしたい
3. 最後のアシスタントメッセージに思考ブロックなしのツール使用ブロックが含まれている

#### 実用的なガイダンス

**✗ 無効：ツール使用直後に思考を切り替える**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
// Cannot enable thinking here - still in the same assistant turn
```

**✓ 有効：最初にアシスタントターンを完了する**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
Assistant: [text: "It's sunny"] 
User: "What about tomorrow?" (thinking disabled)
Assistant: [thinking] + [text: "..."] (thinking enabled - new turn)
```

**ベストプラクティス**：ターン中に切り替えようとするのではなく、各ターンの開始時に思考戦略を計画してください。

<Note>
会話中に思考モードを切り替えると、メッセージ履歴のプロンプトキャッシングも無効になります。詳細については、[プロンプトキャッシングを伴う拡張思考](#extended-thinking-with-prompt-caching)セクションを参照してください。
</Note>

<section title="例：ツール結果を伴う思考ブロックの渡し方">

ツール結果を提供する際に思考ブロックを保持する方法を示す実用的な例を以下に示します：

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

APIレスポンスには思考、テキスト、およびtool_useブロックが含まれます：

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

それでは会話を続けてツールを使用しましょう

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

APIレスポンスは**テキストのみ**を含みます

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

### 思考ブロックの保持

ツール使用中に、`thinking`ブロックをAPIに戻す必要があり、完全な未修正ブロックをAPIに戻す必要があります。これはモデルの推論フローと会話の整合性を維持するために重要です。

<Tip>
以前の`assistant`ロールターンから`thinking`ブロックを省略できますが、マルチターン会話ではすべての思考ブロックをAPIに戻すことをお勧めします。APIは以下を行います：
- 提供された思考ブロックを自動的にフィルタリングする
- モデルの推論を保持するために必要な関連する思考ブロックを使用する
- Claudeに表示されるブロックの入力トークンのみに対して課金する
</Tip>

<Note>
会話中に思考モードを切り替える場合、アシスタントターン全体（ツール使用ループを含む）は単一の思考モードで動作する必要があることに注意してください。詳細については、[会話での思考モードの切り替え](#toggling-thinking-modes-in-conversations)を参照してください。
</Note>

Claudeがツールを呼び出すとき、それは外部情報を待つために応答の構築を一時停止しています。ツール結果が返されると、Claudeはその既存の応答の構築を続けます。これにより、ツール使用中に思考ブロックを保持する必要があります。理由は2つあります：

1. **推論の連続性**：思考ブロックはツール要求につながったClaudeのステップバイステップの推論をキャプチャします。ツール結果を投稿するとき、元の思考を含めることで、Claudeは中断したところから推論を続けることができます。

2. **コンテキストの維持**：ツール結果はAPI構造ではユーザーメッセージとして表示されますが、継続的な推論フローの一部です。思考ブロックを保持することで、複数のAPI呼び出しにわたってこの概念的なフローを維持します。コンテキスト管理の詳細については、[コンテキストウィンドウに関するガイド](/docs/ja/build-with-claude/context-windows)を参照してください。

**重要**：`thinking`ブロックを提供する場合、連続した`thinking`ブロックのシーケンス全体は、元のリクエスト中にモデルによって生成された出力と一致する必要があります。ブロックのシーケンスを再配置または変更することはできません。

### インターリーブ思考

Claude 4モデルでのツール使用を伴う拡張思考は、インターリーブ思考をサポートしており、これによってClaudeはツール呼び出し間で思考し、ツール結果を受け取った後、より高度な推論を行うことができます。

インターリーブ思考により、Claudeは以下のことができます：
- ツール呼び出しの結果について推論し、次に何をするかを決定する
- 複数のツール呼び出しを推論ステップでチェーンする
- 中間結果に基づいてより微妙な決定を下す

インターリーブ思考を有効にするには、[ベータヘッダー](/docs/ja/api/beta-headers) `interleaved-thinking-2025-05-14` をAPIリクエストに追加してください。

インターリーブ思考に関する重要な考慮事項は以下の通りです：
- インターリーブ思考では、`budget_tokens` が `max_tokens` パラメータを超える可能性があります。これは1つのアシスタントターン内のすべての思考ブロック全体の予算を表しているためです。
- インターリーブ思考は [Messages APIを介して使用されるツール](/docs/ja/agents-and-tools/tool-use/overview) に対してのみサポートされています。
- インターリーブ思考はClaude 4モデルのみでサポートされており、ベータヘッダー `interleaved-thinking-2025-05-14` が必要です。
- Claude APIへの直接呼び出しでは、`interleaved-thinking-2025-05-14` をリクエストに渡すことができ、どのモデルでも効果はありません。
- サードパーティプラットフォーム（例：[Amazon Bedrock](/docs/ja/build-with-claude/claude-on-amazon-bedrock) および [Vertex AI](/docs/ja/build-with-claude/claude-on-vertex-ai)）では、Claude Opus 4.5、Claude Opus 4.1、Opus 4、またはSonnet 4以外のモデルに `interleaved-thinking-2025-05-14` を渡すと、リクエストは失敗します。

<section title="インターリーブ思考なしのツール使用">

インターリーブ思考なしでは、Claudeはアシスタントターンの開始時に1回だけ思考します。ツール結果後の後続の応答は、新しい思考ブロックなしで続きます。

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

<section title="インターリーブ思考ありのツール使用">

インターリーブ思考が有効な場合、Claudeは各ツール結果を受け取った後に思考でき、続行する前に中間結果について推論することができます。

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

## プロンプトキャッシングを伴う拡張思考

[プロンプトキャッシング](/docs/ja/build-with-claude/prompt-caching) と思考にはいくつかの重要な考慮事項があります：

<Tip>
拡張思考タスクは完了するのに5分以上かかることがよくあります。[1時間のキャッシュ期間](/docs/ja/build-with-claude/prompt-caching#1-hour-cache-duration) を使用して、より長い思考セッションとマルチステップワークフロー全体でキャッシュヒットを維持することを検討してください。
</Tip>

**思考ブロックコンテキスト削除**
- 前のターンからの思考ブロックはコンテキストから削除されます。これはキャッシュブレークポイントに影響を与える可能性があります
- ツール使用で会話を続ける場合、思考ブロックはキャッシュされ、キャッシュから読み取られるときに入力トークンとしてカウントされます
- これはトレードオフを生み出します：思考ブロックは視覚的にはコンテキストウィンドウスペースを消費しませんが、キャッシュされるときは入力トークン使用量にカウントされます
- 思考が無効になった場合、現在のツール使用ターンで思考コンテンツを渡すとリクエストは失敗します。他のコンテキストでは、APIに渡された思考コンテンツは単に無視されます

**キャッシュ無効化パターン**
- 思考パラメータの変更（有効/無効または予算配分）はメッセージキャッシュブレークポイントを無効化します
- [インターリーブ思考](#インターリーブ思考) はキャッシュ無効化を増幅します。思考ブロックは複数の [ツール呼び出し](#ツール使用を伴う拡張思考) 間で発生する可能性があるためです
- システムプロンプトとツールは思考パラメータの変更またはブロック削除にもかかわらずキャッシュされたままです

<Note>
思考ブロックはキャッシングとコンテキスト計算のために削除されますが、[ツール使用](#ツール使用を伴う拡張思考) で会話を続ける場合、特に [インターリーブ思考](#インターリーブ思考) では保持する必要があります。
</Note>

### 思考ブロックキャッシング動作の理解

ツール使用を伴う拡張思考を使用する場合、思考ブロックはトークンカウントに影響を与える特定のキャッシング動作を示します：

**動作方法：**

1. キャッシングは、ツール結果を含む後続のリクエストを行う場合にのみ発生します
2. 後続のリクエストが行われると、前の会話履歴（思考ブロックを含む）がキャッシュされる可能性があります
3. これらのキャッシュされた思考ブロックは、キャッシュから読み取られるときの使用メトリクスで入力トークンとしてカウントされます
4. 非ツール結果ユーザーブロックが含まれる場合、すべての前の思考ブロックは無視され、コンテキストから削除されます

**詳細な例フロー：**

**リクエスト1：**
```
User: "What's the weather in Paris?"
```
**応答1：**
```
[thinking_block_1] + [tool_use block 1]
```

**リクエスト2：**
```
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
```
**応答2：**
```
[thinking_block_2] + [text block 2]
```
リクエスト2はリクエストコンテンツのキャッシュを書き込みます（応答ではなく）。キャッシュには、元のユーザーメッセージ、最初の思考ブロック、ツール使用ブロック、およびツール結果が含まれます。

**リクエスト3：**
```
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
```
Claude Opus 4.5以降の場合、すべての前の思考ブロックはデフォルトで保持されます。古いモデルの場合、非ツール結果ユーザーブロックが含まれたため、すべての前の思考ブロックは無視されます。このリクエストは以下と同じように処理されます：
```
User: ["What's the weather in Paris?"],
Assistant: [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```

**重要なポイント：**
- このキャッシング動作は自動的に発生します。明示的な `cache_control` マーカーがなくても発生します
- この動作は通常の思考またはインターリーブ思考を使用しているかどうかに関係なく一貫しています

<section title="システムプロンプトキャッシング（思考変更時に保持）">

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
<section title="メッセージキャッシング（思考変更時に無効化）">

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

スクリプトの出力は以下の通りです（数字は若干異なる場合があります）

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

この例は、メッセージ配列でキャッシングが設定されている場合、思考パラメータを変更する（budget_tokensを4000から8000に増加）と **キャッシュが無効化される** ことを示しています。3番目のリクエストは `cache_creation_input_tokens=1370` と `cache_read_input_tokens=0` でキャッシュヒットがないことを示しており、メッセージベースのキャッシングが思考パラメータ変更時に無効化されることを証明しています。

</section>

## 拡張思考を伴う最大トークンとコンテキストウィンドウサイズ

古いClaudeモデル（Claude Sonnet 3.7より前）では、プロンプトトークンと `max_tokens` の合計がモデルのコンテキストウィンドウを超えた場合、システムは自動的に `max_tokens` を調整してコンテキスト制限内に収まるようにしていました。これは大きな `max_tokens` 値を設定でき、システムが必要に応じて自動的に削減することを意味していました。

Claude 3.7および4モデルでは、`max_tokens`（思考が有効な場合は思考予算を含む）は厳密な制限として適用されます。システムは、プロンプトトークン + `max_tokens` がコンテキストウィンドウサイズを超える場合、検証エラーを返すようになりました。

<Note>
[コンテキストウィンドウに関するガイド](/docs/ja/build-with-claude/context-windows) をご覧いただくと、より詳細な説明があります。
</Note>

### 拡張思考を伴うコンテキストウィンドウ

思考が有効な場合のコンテキストウィンドウ使用量を計算する場合、注意すべき考慮事項があります：

- 前のターンからの思考ブロックは削除され、コンテキストウィンドウにカウントされません
- 現在のターンの思考はそのターンの `max_tokens` 制限にカウントされます

以下の図は、拡張思考が有効な場合の特殊なトークン管理を示しています：

![拡張思考を伴うコンテキストウィンドウ図](/docs/images/context-window-thinking.svg)

有効なコンテキストウィンドウは以下のように計算されます：

```
context window =
  (current input tokens - previous thinking tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

特に思考を含むマルチターン会話を扱う場合、[トークンカウントAPI](/docs/ja/build-with-claude/token-counting) を使用して、特定のユースケースの正確なトークンカウントを取得することをお勧めします。

### 拡張思考とツール使用を伴うコンテキストウィンドウ

ツール使用を伴う拡張思考を使用する場合、思考ブロックは明示的に保持され、ツール結果と共に返される必要があります。

ツール使用を伴う拡張思考の有効なコンテキストウィンドウ計算は以下のようになります：

```
context window =
  (current input tokens + previous thinking tokens + tool use tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

以下の図は、ツール使用を伴う拡張思考のトークン管理を示しています：

![拡張思考とツール使用を伴うコンテキストウィンドウ図](/docs/images/context-window-thinking-tools.svg)

### 拡張思考を伴うトークン管理

拡張思考Claude 3.7および4モデルのコンテキストウィンドウと `max_tokens` 動作を考慮すると、以下が必要になる場合があります：

- トークン使用量をより積極的に監視および管理する
- プロンプト長が変わるにつれて `max_tokens` 値を調整する
- [トークンカウントエンドポイント](/docs/ja/build-with-claude/token-counting) をより頻繁に使用する可能性がある
- 前の思考ブロックがコンテキストウィンドウに蓄積しないことに注意する

この変更は、特に最大トークン制限が大幅に増加したため、より予測可能で透明性のある動作を提供するために行われました。

## 思考暗号化

完全な思考コンテンツは暗号化され、`signature` フィールドで返されます。このフィールドは、思考ブロックがClaudeによって生成されたことを確認するために、APIに渡される場合に使用されます。

<Note>
思考ブロックを送り返すことが厳密に必要なのは、[ツール使用を伴う拡張思考](#ツール使用を伴う拡張思考) を使用する場合のみです。それ以外の場合は、前のターンから思考ブロックを省略するか、それらを渡す場合はAPIに削除させることができます。

思考ブロックを送り返す場合は、一貫性を保ち、潜在的な問題を回避するために、受け取ったとおりにすべてを渡すことをお勧めします。
</Note>

思考暗号化に関する重要な考慮事項は以下の通りです：
- [ストリーミング応答](#ストリーミング思考) 時、署名は `content_block_stop` イベントの直前に `content_block_delta` イベント内の `signature_delta` を介して追加されます。
- `signature` 値はClaude 4モデルでは前のモデルよりも大幅に長くなります。
- `signature` フィールドは不透明なフィールドであり、解釈または解析されるべきではありません。検証目的のためにのみ存在します。
- `signature` 値はプラットフォーム間で互換性があります（Claude API、[Amazon Bedrock](/docs/ja/build-with-claude/claude-on-amazon-bedrock)、および [Vertex AI](/docs/ja/build-with-claude/claude-on-vertex-ai)）。1つのプラットフォームで生成された値は別のプラットフォームと互換性があります。

### 思考の編集

時々、Claudeの内部推論が当社のセーフティシステムによってフラグが立てられることがあります。これが発生した場合、`thinking`ブロックの一部またはすべてを暗号化し、`redacted_thinking`ブロックとして返します。`redacted_thinking`ブロックはAPIに渡されるときに復号化され、Claudeがコンテキストを失わずに応答を続けることができます。

拡張思考を使用する顧客向けアプリケーションを構築する場合：

- redacted_thinkingブロックには、人間が読める形式ではない暗号化されたコンテンツが含まれていることに注意してください
- 「Claudeの内部推論の一部は安全上の理由から自動的に暗号化されています。これは応答の品質に影響しません。」のような簡単な説明を提供することを検討してください
- 思考ブロックをユーザーに表示する場合、通常の思考ブロックを保持しながら、編集されたブロックをフィルタリングできます
- 拡張思考機能を使用すると、推論の一部が暗号化される可能性があることを透過的に伝えてください
- redacted_thinkingを適切に処理し、UIを破壊しないようにするための適切なエラーハンドリングを実装してください

以下は、通常の思考ブロックと編集された思考ブロックの両方を示す例です：

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
出力にredacted_thinkingブロックが表示されるのは予想される動作です。モデルはこの編集された推論を使用して応答に情報を提供しながら、セーフティガードレールを維持できます。

アプリケーションでredacted_thinkingハンドリングをテストする必要がある場合、プロンプトとしてこの特別なテスト文字列を使用できます：`ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

マルチターン会話でAPIに`thinking`および`redacted_thinking`ブロックを渡す場合、最後のアシスタントターンの完全な未修正ブロックをAPIに含める必要があります。これはモデルの推論フローを維持するために重要です。すべての思考ブロックをAPIに渡すことをお勧めします。詳細については、上記の[思考ブロックの保持](#preserving-thinking-blocks)セクションを参照してください。

<section title="例：編集された思考ブロックの操作">

この例は、Claudeの内部推論がセーフティシステムによってフラグが立てられたコンテンツを含む場合に応答に表示される可能性のある`redacted_thinking`ブロックを処理する方法を示しています：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# redacted_thinkingをトリガーする特別なプロンプトを使用（デモンストレーション目的のみ）
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

# redacted_thinkingブロックを識別
has_redacted_thinking = any(
    block.type == "redacted_thinking" for block in response.content
)

if has_redacted_thinking:
    print("Response contains redacted thinking blocks")
    # これらのブロックは後続のリクエストでも使用可能です

    # すべてのブロック（編集されたものと編集されていないもの）を抽出
    all_thinking_blocks = [
        block for block in response.content
        if block.type in ["thinking", "redacted_thinking"]
    ]

    # 後続のリクエストに渡す場合、すべてのブロックを変更せずに含めます
    # これはClaudeの推論の整合性を保持します

    print(f"Found {len(all_thinking_blocks)} thinking blocks total")
    print(f"These blocks are still billable as output tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// redacted_thinkingをトリガーする特別なプロンプトを使用（デモンストレーション目的のみ）
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

// redacted_thinkingブロックを識別
const hasRedactedThinking = response.content.some(
  block => block.type === "redacted_thinking"
);

if (hasRedactedThinking) {
  console.log("Response contains redacted thinking blocks");
  // これらのブロックは後続のリクエストでも使用可能です

  // すべてのブロック（編集されたものと編集されていないもの）を抽出
  const allThinkingBlocks = response.content.filter(
    block => block.type === "thinking" || block.type === "redacted_thinking"
  );

  // 後続のリクエストに渡す場合、すべてのブロックを変更せずに含めます
  // これはClaudeの推論の整合性を保持します

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

        // redacted_thinkingをトリガーする特別なプロンプトを使用（デモンストレーション目的のみ）
        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_SONNET_4_5)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB")
                        .build()
        );

        // redacted_thinkingブロックを識別
        boolean hasRedactedThinking = response.content().stream()
                .anyMatch(BetaContentBlock::isRedactedThinking);

        if (hasRedactedThinking) {
            System.out.println("Response contains redacted thinking blocks");
            // これらのブロックは後続のリクエストでも使用可能です
            // すべてのブロック（編集されたものと編集されていないもの）を抽出
            List<BetaContentBlock> allThinkingBlocks = response.content().stream()
                    .filter(block -> block.isThinking() ||
                            block.isRedactedThinking())
                    .collect(toList());

            // 後続のリクエストに渡す場合、すべてのブロックを変更せずに含めます
            // これはClaudeの推論の整合性を保持します
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
  コンソールで試す
</TryInConsoleButton>

</section>

## モデルバージョン間での思考の違い

Messages APIは、Claude Sonnet 3.7とClaude 4モデル間で思考を異なる方法で処理し、主に編集と要約の動作が異なります。

以下の表で簡潔な比較を参照してください：

| 機能 | Claude Sonnet 3.7 | Claude 4モデル（Opus 4.5以前） | Claude Opus 4.5以降 |
|---------|------------------|-------------------------------|--------------------------|
| **思考出力** | 完全な思考出力を返す | 要約された思考を返す | 要約された思考を返す |
| **インターリーブされた思考** | サポートされていない | `interleaved-thinking-2025-05-14`ベータヘッダーでサポート | `interleaved-thinking-2025-05-14`ベータヘッダーでサポート |
| **思考ブロック保持** | ターン間で保持されない | ターン間で保持されない | **デフォルトで保持**（キャッシュ最適化、トークン節約を有効化） |

### Claude Opus 4.5での思考ブロック保持

Claude Opus 4.5は新しいデフォルト動作を導入します：**前のアシスタントターンからの思考ブロックはデフォルトでモデルコンテキストに保持されます**。これは、前のターンから思考ブロックを削除する以前のモデルとは異なります。

**思考ブロック保持の利点：**

- **キャッシュ最適化**：ツール使用を使用する場合、保持された思考ブロックはツール結果とともに渡され、アシスタントターン全体でインクリメンタルにキャッシュされるため、キャッシュヒットが可能になり、マルチステップワークフローでトークンが節約されます
- **インテリジェンスへの影響なし**：思考ブロックの保持はモデルのパフォーマンスに悪影響を与えません

**重要な考慮事項：**

- **コンテキスト使用量**：思考ブロックがコンテキストに保持されるため、長い会話はより多くのコンテキストスペースを消費します
- **自動動作**：これはClaude Opus 4.5のデフォルト動作です。コード変更またはベータヘッダーは必要ありません
- **後方互換性**：この機能を活用するには、ツール使用の場合と同じように、完全な未修正思考ブロックをAPIに渡し続けてください

<Note>
以前のモデル（Claude Sonnet 4.5、Opus 4.1など）の場合、前のターンからの思考ブロックはコンテキストから削除され続けます。[プロンプトキャッシング付き拡張思考](#extended-thinking-with-prompt-caching)セクションで説明されている既存の動作がこれらのモデルに適用されます。
</Note>

## 価格設定

基本料金、キャッシュ書き込み、キャッシュヒット、出力トークンを含む完全な価格情報については、[価格ページ](/docs/ja/about-claude/pricing)を参照してください。

思考プロセスは以下に対して料金が発生します：
- 思考中に使用されるトークン（出力トークン）
- 後続のリクエストに含まれる最後のアシスタントターンからの思考ブロック（入力トークン）
- 標準テキスト出力トークン

<Note>
拡張思考が有効になると、この機能をサポートするために特殊なシステムプロンプトが自動的に含まれます。
</Note>

要約された思考を使用する場合：
- **入力トークン**：元のリクエスト内のトークン（前のターンからの思考トークンを除外）
- **出力トークン（請求対象）**：Claudeが内部的に生成した元の思考トークン
- **出力トークン（表示）**：応答に表示される要約された思考トークン
- **請求なし**：要約を生成するために使用されるトークン

<Warning>
請求される出力トークン数は、応答に表示される可視トークン数と**一致しません**。要約ではなく、完全な思考プロセスに対して請求されます。
</Warning>

## 拡張思考のベストプラクティスと考慮事項

### 思考予算の操作

- **予算最適化：**最小予算は1,024トークンです。最小値から始めて、思考予算を段階的に増やして、ユースケースに最適な範囲を見つけることをお勧めします。トークン数が多いほど、より包括的な推論が可能になりますが、タスクに応じて収益が減少します。予算を増やすと応答品質が向上する可能性がありますが、レイテンシが増加するというトレードオフがあります。重要なタスクの場合、異なる設定をテストして最適なバランスを見つけてください。思考予算はターゲットであり、厳密な制限ではないことに注意してください。実際のトークン使用量はタスクに基づいて異なる場合があります。
- **開始点：**複雑なタスクの場合は大きな思考予算（16k以上のトークン）から始めて、必要に応じて調整してください。
- **大きな予算：**思考予算が32kを超える場合、ネットワークの問題を回避するために[バッチ処理](/docs/ja/build-with-claude/batch-processing)を使用することをお勧めします。モデルを32kトークン以上で思考させるリクエストは、システムタイムアウトとオープン接続制限に対して実行される可能性のある長時間実行リクエストを引き起こします。
- **トークン使用量追跡：**思考トークン使用量を監視して、コストとパフォーマンスを最適化してください。

### パフォーマンスに関する考慮事項

- **応答時間：**推論プロセスに必要な追加処理により、応答時間が長くなる可能性があることに備えてください。思考ブロックの生成により、全体的な応答時間が増加する可能性があることを考慮してください。
- **ストリーミング要件：**`max_tokens`が21,333より大きい場合、ストリーミングが必要です。ストリーミング時は、思考とテキストコンテンツブロックの両方が到着するときに処理する準備をしてください。

### 機能の互換性

- 思考は`temperature`または`top_k`の変更、および[強制ツール使用](/docs/ja/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use)と互換性がありません。
- 思考が有効になっている場合、`top_p`を1から0.95の間の値に設定できます。
- 思考が有効になっている場合、応答を事前入力することはできません。
- 思考予算への変更は、メッセージを含むキャッシュされたプロンプトプレフィックスを無効にします。ただし、キャッシュされたシステムプロンプトとツール定義は、思考パラメータが変更されても機能し続けます。

### 使用ガイドライン

- **タスク選択：**数学、コーディング、分析など、ステップバイステップの推論から利益を得る特に複雑なタスクに拡張思考を使用してください。
- **コンテキスト処理：**前の思考ブロックを自分で削除する必要はありません。Claude APIは自動的に前のターンからの思考ブロックを無視し、コンテキスト使用量を計算するときに含まれません。
- **プロンプトエンジニアリング：**Claudeの思考機能を最大化したい場合は、[拡張思考プロンプティングのヒント](/docs/ja/build-with-claude/prompt-engineering/extended-thinking-tips)を確認してください。

## 次のステップ

<CardGroup>
  <Card title="拡張思考クックブックを試す" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    クックブックで思考の実践的な例を探索してください。
  </Card>
  <Card title="拡張思考プロンプティングのヒント" icon="code" href="/docs/ja/build-with-claude/prompt-engineering/extended-thinking-tips">
    拡張思考のプロンプトエンジニアリングのベストプラクティスを学んでください。
  </Card>
</CardGroup>