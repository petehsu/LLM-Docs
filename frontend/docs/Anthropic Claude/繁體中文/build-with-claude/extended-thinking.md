# 使用延伸思考進行構建

了解如何使用 Claude 的延伸思考功能來增強推理能力，包括流式傳輸、工具使用和提示快取。

---

延伸思考為 Claude 提供了增強的推理能力，用於處理複雜任務，同時在提供最終答案之前提供不同程度的透明度，讓您了解其逐步思考過程。

## 支援的模型

延伸思考在以下模型中受支援：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([已棄用](/docs/zh-TW/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
API 行為在 Claude Sonnet 3.7 和 Claude 4 模型之間有所不同，但 API 形狀保持完全相同。

如需更多資訊，請參閱[不同模型版本之間的思考差異](#differences-in-thinking-across-model-versions)。
</Note>

## 延伸思考的工作原理

啟用延伸思考後，Claude 會建立 `thinking` 內容區塊，其中輸出其內部推理。Claude 在製作最終回應之前會納入此推理中的見解。

API 回應將包括 `thinking` 內容區塊，後面跟著 `text` 內容區塊。

以下是預設回應格式的範例：

```json
{
  "content": [
    {
      "type": "thinking",
      "thinking": "讓我逐步分析這個...",
      "signature": "WaUjzkypQ2mUEVM36O2TxuC06KN8xyfbJwyem2dw3URve/op91XWHOEBLLqIOMfFG/UvLEczmEsUjavL...."
    },
    {
      "type": "text",
      "text": "根據我的分析..."
    }
  ]
}
```

如需更多關於延伸思考回應格式的資訊，請參閱[訊息 API 參考](/docs/zh-TW/api/messages)。

## 如何使用延伸思考

以下是在訊息 API 中使用延伸思考的範例：

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
            "content": "是否存在無限多個質數使得 n mod 4 == 3？"
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
        "content": "是否存在無限多個質數使得 n mod 4 == 3？"
    }]
)

# 回應將包含摘要思考區塊和文字區塊
for block in response.content:
    if block.type == "thinking":
        print(f"\n思考摘要：{block.thinking}")
    elif block.type == "text":
        print(f"\n回應：{block.text}")
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
    content: "是否存在無限多個質數使得 n mod 4 == 3？"
  }]
});

// 回應將包含摘要思考區塊和文字區塊
for (const block of response.content) {
  if (block.type === "thinking") {
    console.log(`\n思考摘要：${block.thinking}`);
  } else if (block.type === "text") {
    console.log(`\n回應：${block.text}`);
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
                        .addUserMessage("是否存在無限多個質數使得 n mod 4 == 3？")
                        .build()
        );

        System.out.println(response);
    }
}
```

</CodeGroup>

若要啟用延伸思考，請新增 `thinking` 物件，將 `type` 參數設定為 `enabled`，並將 `budget_tokens` 設定為延伸思考的指定代幣預算。

`budget_tokens` 參數決定了 Claude 被允許用於其內部推理過程的最大代幣數。在 Claude 4 模型中，此限制適用於完整思考代幣，而不適用於[摘要輸出](#summarized-thinking)。較大的預算可以透過為複雜問題啟用更徹底的分析來改善回應品質，儘管 Claude 可能不會使用整個分配的預算，特別是在 32k 以上的範圍內。

`budget_tokens` 必須設定為小於 `max_tokens` 的值。但是，當使用[與工具交錯的思考](#interleaved-thinking)時，您可以超過此限制，因為代幣限制變成您的整個上下文視窗（200k 代幣）。

### 摘要思考

啟用延伸思考後，Claude 4 模型的訊息 API 會傳回 Claude 完整思考過程的摘要。摘要思考提供了延伸思考的完整智能優勢，同時防止濫用。

以下是摘要思考的一些重要考慮事項：

- 您需要為原始請求產生的完整思考代幣付費，而不是摘要代幣。
- 計費的輸出代幣計數將**不符合**您在回應中看到的代幣計數。
- 思考輸出的前幾行更詳細，提供了詳細的推理，特別有助於提示工程目的。
- 隨著 Anthropic 尋求改進延伸思考功能，摘要行為可能會改變。
- 摘要化保留了 Claude 思考過程的關鍵思想，同時增加了最少的延遲，實現了可流式傳輸的使用者體驗和從 Claude Sonnet 3.7 到 Claude 4 模型的輕鬆遷移。
- 摘要化由與您在請求中指定的模型不同的模型處理。思考模型看不到摘要輸出。

<Note>
Claude Sonnet 3.7 繼續傳回完整思考輸出。

在罕見情況下，如果您需要存取 Claude 4 模型的完整思考輸出，請[聯絡我們的銷售團隊](mailto:sales@anthropic.com)。
</Note>

### 流式傳輸思考

您可以使用[伺服器發送事件 (SSE)](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents) 流式傳輸延伸思考回應。

啟用延伸思考的流式傳輸後，您會透過 `thinking_delta` 事件接收思考內容。

如需更多關於透過訊息 API 進行流式傳輸的文件，請參閱[流式傳輸訊息](/docs/zh-TW/build-with-claude/streaming)。

以下是如何處理思考流式傳輸的方法：

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
            "content": "27 * 453 是多少？"
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
    messages=[{"role": "user", "content": "27 * 453 是多少？"}],
) as stream:
    thinking_started = False
    response_started = False

    for event in stream:
        if event.type == "content_block_start":
            print(f"\n開始 {event.content_block.type} 區塊...")
            # 為每個新區塊重設旗標
            thinking_started = False
            response_started = False
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                if not thinking_started:
                    print("思考：", end="", flush=True)
                    thinking_started = True
                print(event.delta.thinking, end="", flush=True)
            elif event.delta.type == "text_delta":
                if not response_started:
                    print("回應：", end="", flush=True)
                    response_started = True
                print(event.delta.text, end="", flush=True)
        elif event.type == "content_block_stop":
            print("\n區塊完成。")
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
    content: "27 * 453 是多少？"
  }]
});

let thinkingStarted = false;
let responseStarted = false;

for await (const event of stream) {
  if (event.type === 'content_block_start') {
    console.log(`\n開始 ${event.content_block.type} 區塊...`);
    // 為每個新區塊重設旗標
    thinkingStarted = false;
    responseStarted = false;
  } else if (event.type === 'content_block_delta') {
    if (event.delta.type === 'thinking_delta') {
      if (!thinkingStarted) {
        process.stdout.write('思考：');
        thinkingStarted = true;
      }
      process.stdout.write(event.delta.thinking);
    } else if (event.delta.type === 'text_delta') {
      if (!responseStarted) {
        process.stdout.write('回應：');
        responseStarted = true;
      }
      process.stdout.write(event.delta.text);
    }
  } else if (event.type === 'content_block_stop') {
    console.log('\n區塊完成。');
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
                .addUserMessage("27 * 453 是多少？")
                .build();

        try (StreamResponse<BetaRawMessageStreamEvent> streamResponse =
                     client.beta().messages().createStreaming(createParams)) {
            streamResponse.stream()
                    .forEach(event -> {
                        if (event.isContentBlockStart()) {
                            System.out.printf("\n開始 %s 區塊...%n",
                                    event.asContentBlockStart()._type());
                            // 為每個新區塊重設旗標
                            thinkingStarted = false;
                            responseStarted = false;
                        } else if (event.isContentBlockDelta()) {
                            var delta = event.asContentBlockDelta().delta();
                            if (delta.isBetaThinking()) {
                                if (!thinkingStarted) {
                                    System.out.print("思考：");
                                    thinkingStarted = true;
                                }
                                System.out.print(delta.asBetaThinking().thinking());
                                System.out.flush();
                            } else if (delta.isBetaText()) {
                                if (!responseStarted) {
                                    System.out.print("回應：");
                                    responseStarted = true;
                                }
                                System.out.print(delta.asBetaText().text());
                                System.out.flush();
                            }
                        } else if (event.isContentBlockStop()) {
                            System.out.println("\n區塊完成。");
                        }
                    });
        }
    }
}
```

</CodeGroup>

<TryInConsoleButton userPrompt="27 * 453 是多少？" thinkingBudgetTokens={16000}>
  在主控台中試試
</TryInConsoleButton>

範例流式傳輸輸出：
```json
event: message_start
data: {"type": "message_start", "message": {"id": "msg_01...", "type": "message", "role": "assistant", "content": [], "model": "claude-sonnet-4-5", "stop_reason": null, "stop_sequence": null}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "thinking", "thinking": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "讓我逐步解決這個問題：\n\n1. 首先分解 27 * 453"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "thinking_delta", "thinking": "\n2. 453 = 400 + 50 + 3"}}

// 其他思考 delta...

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "signature_delta", "signature": "EqQBCgIYAhIM1gbcDa9GJwZA2b3hGgxBdjrkzLoky3dl1pkiMOYds..."}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "text", "text": ""}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "text_delta", "text": "27 * 453 = 12,231"}}

// 其他文字 delta...

event: content_block_stop
data: {"type": "content_block_stop", "index": 1}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence": null}}

event: message_stop
data: {"type": "message_stop"}
```

<Note>
使用啟用思考的流式傳輸時，您可能會注意到文字有時以較大的區塊到達，交替使用較小的逐代幣傳遞。這是預期的行為，特別是對於思考內容。

流式傳輸系統需要分批處理內容以獲得最佳效能，這可能導致這種「分塊」傳遞模式，流式傳輸事件之間可能會有延遲。我們正在持續努力改進此體驗，未來的更新將專注於使思考內容流式傳輸更順暢。
</Note>

## 延伸思考與工具使用

延伸思考可以與[工具使用](/docs/zh-TW/agents-and-tools/tool-use/overview)一起使用，允許 Claude 透過工具選擇和結果處理進行推理。

使用延伸思考與工具使用時，請注意以下限制：

1. **工具選擇限制**：具有思考的工具使用僅支援 `tool_choice: {"type": "auto"}` (預設) 或 `tool_choice: {"type": "none"}`。使用 `tool_choice: {"type": "any"}` 或 `tool_choice: {"type": "tool", "name": "..."}` 將導致錯誤，因為這些選項強制工具使用，與延伸思考不相容。

2. **保留思考區塊**：在工具使用期間，您必須將 `thinking` 區塊傳回 API 以供最後的助手訊息。將完整的未修改區塊傳回 API 以維持推理連續性。

### 在對話中切換思考模式

您無法在助手回合中途切換思考，包括在工具使用迴圈期間。整個助手回合必須在單一思考模式中運作：

- **如果啟用思考**，最終助手回合必須以思考區塊開始。
- **如果停用思考**，最終助手回合不得包含任何思考區塊

從模型的角度來看，**工具使用迴圈是助手回合的一部分**。助手回合在 Claude 完成其完整回應之前不會完成，這可能包括多個工具呼叫和結果。

例如，此序列全部是**單一助手回合**的一部分：
```
使用者："巴黎的天氣如何？"
助手：[思考] + [tool_use: get_weather]
使用者：[tool_result: "20°C，晴天"]
助手：[文字："巴黎的天氣是 20°C 和晴天"]
```

儘管有多個 API 訊息，工具使用迴圈在概念上是一個連續助手回應的一部分。

#### 常見錯誤情景

您可能會遇到此錯誤：
```
預期 `thinking` 或 `redacted_thinking`，但找到 `tool_use`。
啟用 `thinking` 時，最終 `assistant` 訊息必須以思考區塊開始
（在最後一組 `tool_use` 和 `tool_result` 區塊之前）。
```

這通常發生在以下情況：
1. 您在工具使用序列期間**停用**思考
2. 您想再次啟用思考
3. 您的最後助手訊息包含工具使用區塊但沒有思考區塊

#### 實用指南

**✗ 無效：在工具使用後立即切換思考**
```
使用者："天氣如何？"
助手：[tool_use] (思考已停用)
使用者：[tool_result]
// 無法在此啟用思考 - 仍在同一助手回合中
```

**✓ 有效：先完成助手回合**
```
使用者："天氣如何？"
助手：[tool_use] (思考已停用)
使用者：[tool_result]
助手：[文字："天氣晴朗"]
使用者："明天呢？" (思考已停用)
助手：[思考] + [文字："..."] (思考已啟用 - 新回合)
```

**最佳實踐**：在每個回合開始時規劃您的思考策略，而不是嘗試在中途切換。

<Note>
切換思考模式也會使提示快取對訊息歷史記錄無效。如需更多詳細資訊，請參閱[延伸思考與提示快取](#extended-thinking-with-prompt-caching)部分。
</Note>

<section title="範例：使用工具結果傳遞思考區塊">

以下是一個實用範例，展示如何在提供工具結果時保留思考區塊：

<CodeGroup>
```python Python
weather_tool = {
    "name": "get_weather",
    "description": "取得位置的目前天氣",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}

# 第一個請求 - Claude 以思考和工具請求回應
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "巴黎的天氣如何？"}
    ]
)
```

```typescript TypeScript
const weatherTool = {
  name: "get_weather",
  description: "取得位置的目前天氣",
  input_schema: {
    type: "object",
    properties: {
      location: { type: "string" }
    },
    required: ["location"]
  }
};

// 第一個請求 - Claude 以思考和工具請求回應
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "巴黎的天氣如何？" }
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
                .description("取得位置的目前天氣")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("巴黎的天氣如何？")
                        .build()
        );

        System.out.println(response);
    }
}
```
</CodeGroup>

API 回應將包括思考、文字和 tool_use 區塊：

```json
{
    "content": [
        {
            "type": "thinking",
            "thinking": "使用者想知道巴黎目前的天氣。我可以存取函式 `get_weather`...",
            "signature": "BDaL4VrbR2Oj0hO4XpJxT28J5TILnCrrUXoKiiNBZW9P+nr8XSj1zuZzAl4egiCCpQNvfyUuFFJP5CncdYZEQPPmLxYsNrcs...."
        },
        {
            "type": "text",
            "text": "我可以幫您取得巴黎的目前天氣資訊。讓我為您檢查一下"
        },
        {
            "type": "tool_use",
            "id": "toolu_01CswdEQBMshySk6Y9DFKrfq",
            "name": "get_weather",
            "input": {
                "location": "巴黎"
            }
        }
    ]
}
```

現在讓我們繼續對話並使用工具

<CodeGroup>
```python Python
# 提取思考區塊和工具使用區塊
thinking_block = next((block for block in response.content
                      if block.type == 'thinking'), None)
tool_use_block = next((block for block in response.content
                      if block.type == 'tool_use'), None)

# 呼叫您的實際天氣 API，這是您的實際 API 呼叫的位置
# 讓我們假設這是我們得到的回傳
weather_data = {"temperature": 88}

# 第二個請求 - 包括思考區塊和工具結果
# 回應中不會產生新的思考區塊
continuation = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[weather_tool],
    messages=[
        {"role": "user", "content": "巴黎的天氣如何？"},
        # 注意 thinking_block 和 tool_use_block 都被傳入
        # 如果未傳入，將引發錯誤
        {"role": "assistant", "content": [thinking_block, tool_use_block]},
        {"role": "user", "content": [{
            "type": "tool_result",
            "tool_use_id": tool_use_block.id,
            "content": f"目前溫度：{weather_data['temperature']}°F"
        }]}
    ]
)
```

```typescript TypeScript
// 提取思考區塊和工具使用區塊
const thinkingBlock = response.content.find(block =>
  block.type === 'thinking');
const toolUseBlock = response.content.find(block =>
  block.type === 'tool_use');

// 呼叫您的實際天氣 API，這是您的實際 API 呼叫的位置
// 讓我們假設這是我們得到的回傳
const weatherData = { temperature: 88 };

// 第二個請求 - 包括思考區塊和工具結果
// 回應中不會產生新的思考區塊
const continuation = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [weatherTool],
  messages: [
    { role: "user", content: "巴黎的天氣如何？" },
    // 注意 thinkingBlock 和 toolUseBlock 都被傳入
    // 如果未傳入，將引發錯誤
    { role: "assistant", content: [thinkingBlock, toolUseBlock] },
    { role: "user", content: [{
      type: "tool_result",
      tool_use_id: toolUseBlock.id,
      content: `目前溫度：${weatherData.temperature}°F`
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
                .description("取得位置的目前天氣")
                .inputSchema(schema)
                .build();

        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_OPUS_4_0)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addTool(weatherTool)
                        .addUserMessage("巴黎的天氣如何？")
                        .build()
        );

        // 提取思考區塊和工具使用區塊
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

            // 呼叫您的實際天氣 API，這是您的實際 API 呼叫的位置
            // 讓我們假設這是我們得到的回傳
            Map<String, Object> weatherData = Map.of("temperature", 88);

            // 第二個請求 - 包括思考區塊和工具結果
            // 回應中不會產生新的思考區塊
            BetaMessage continuation = client.beta().messages().create(
                    MessageCreateParams.builder()
                            .model(Model.CLAUDE_OPUS_4_0)
                            .maxTokens(16000)
                            .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                            .addTool(weatherTool)
                            .addUserMessage("巴黎的天氣如何？")
                            .addAssistantMessageOfBetaContentBlockParams(
                                    // 注意 thinkingBlock 和 toolUseBlock 都被傳入
                                    // 如果未傳入，將引發錯誤
                                    List.of(
                                            BetaContentBlockParam.ofThinking(thinkingBlock.toParam()),
                                            BetaContentBlockParam.ofToolUse(toolUseBlock.toParam())
                                    )
                            )
                            .addUserMessageOfBetaContentBlockParams(List.of(
                                    BetaContentBlockParam.ofToolResult(
                                            BetaToolResultBlockParam.builder()
                                                    .toolUseId(toolUseBlock.id())
                                                    .content(String.format("目前溫度：%d°F", (Integer)weatherData.get("temperature")))
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

API 回應現在將**僅**包括文字

```json
{
    "content": [
        {
            "type": "text",
            "text": "巴黎目前的溫度是 88°F (31°C)"
        }
    ]
}
```

</section>

### 保留思考區塊

在工具使用期間，您必須將 `thinking` 區塊傳回 API，並且必須將完整的未修改區塊傳回 API。這對於維持模型的推理流程和對話完整性至關重要。

<Tip>
雖然您可以從先前的 `assistant` 角色回合中省略 `thinking` 區塊，但我們建議始終將所有思考區塊傳回 API 以進行任何多回合對話。API 將：
- 自動篩選提供的思考區塊
- 使用必要的相關思考區塊來保留模型的推理
- 僅對顯示給 Claude 的區塊的輸入代幣進行計費
</Tip>

<Note>
在對話期間切換思考模式時，請記住整個助手回合（包括工具使用迴圈）必須在單一思考模式中運作。如需更多詳細資訊，請參閱[在對話中切換思考模式](#toggling-thinking-modes-in-conversations)。
</Note>

當 Claude 呼叫工具時，它會暫停其回應的構建以等待外部資訊。當工具結果返回時，Claude 將繼續構建該現有回應。這需要在工具使用期間保留思考區塊，原因有幾個：

1. **推理連續性**：思考區塊捕捉了導致工具請求的 Claude 逐步推理。當您發佈工具結果時，包括原始思考可確保 Claude 能夠從中斷的地方繼續其推理。

2. **上下文維護**：雖然工具結果在 API 結構中顯示為使用者訊息，但它們是連續推理流程的一部分。保留思考區塊可在多個 API 呼叫中維持此概念流程。如需更多關於上下文管理的資訊，請參閱我們的[上下文視窗指南](/docs/zh-TW/build-with-claude/context-windows)。

**重要**：提供 `thinking` 區塊時，連續 `thinking` 區塊的整個序列必須符合模型在原始請求期間產生的輸出；您無法重新排列或修改這些區塊的序列。

### 交錯思考

Claude 4 模型中的擴展思考與工具使用支持交錯思考，這使 Claude 能夠在工具調用之間進行思考，並在接收工具結果後進行更複雜的推理。

通過交錯思考，Claude 可以：
- 在決定下一步操作之前，對工具調用的結果進行推理
- 在推理步驟之間鏈接多個工具調用
- 根據中間結果做出更細緻的決策

要啟用交錯思考，請將[測試版標頭](/docs/zh-TW/api/beta-headers) `interleaved-thinking-2025-05-14` 添加到您的 API 請求中。

以下是交錯思考的一些重要考慮事項：
- 使用交錯思考時，`budget_tokens` 可以超過 `max_tokens` 參數，因為它代表一個助手轉向內所有思考塊的總預算。
- 交錯思考僅支持[通過 Messages API 使用的工具](/docs/zh-TW/agents-and-tools/tool-use/overview)。
- 交錯思考僅支持 Claude 4 模型，使用測試版標頭 `interleaved-thinking-2025-05-14`。
- 直接調用 Claude API 允許您在對任何模型的請求中傳遞 `interleaved-thinking-2025-05-14`，無任何效果。
- 在第三方平台上（例如，[Amazon Bedrock](/docs/zh-TW/build-with-claude/claude-on-amazon-bedrock) 和 [Vertex AI](/docs/zh-TW/build-with-claude/claude-on-vertex-ai)），如果您將 `interleaved-thinking-2025-05-14` 傳遞給除 Claude Opus 4.5、Claude Opus 4.1、Opus 4 或 Sonnet 4 之外的任何模型，您的請求將失敗。

<section title="不使用交錯思考的工具使用">

不使用交錯思考時，Claude 在助手轉向開始時思考一次。工具結果後的後續回應繼續進行，不會有新的思考塊。

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

<section title="使用交錯思考的工具使用">

啟用交錯思考後，Claude 可以在接收每個工具結果後進行思考，允許它在繼續之前對中間結果進行推理。

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

## 使用提示詞快取的擴展思考

[提示詞快取](/docs/zh-TW/build-with-claude/prompt-caching)與思考有幾個重要的考慮事項：

<Tip>
擴展思考任務通常需要超過 5 分鐘才能完成。考慮使用[1 小時快取持續時間](/docs/zh-TW/build-with-claude/prompt-caching#1-hour-cache-duration)來在較長的思考會話和多步工作流中維持快取命中。
</Tip>

**思考塊上下文移除**
- 來自先前轉向的思考塊從上下文中移除，這可能會影響快取斷點
- 在使用工具繼續對話時，思考塊被快取並在從快取讀取時計為輸入令牌
- 這造成了一個權衡：雖然思考塊在視覺上不消耗上下文窗口空間，但在快取時仍然計入您的輸入令牌使用量
- 如果思考被禁用，如果您在當前工具使用轉向中傳遞思考內容，請求將失敗。在其他上下文中，傳遞給 API 的思考內容只是被忽略

**快取失效模式**
- 對思考參數的更改（啟用/禁用或預算分配）會使消息快取斷點失效
- [交錯思考](#interleaved-thinking)放大了快取失效，因為思考塊可以在多個[工具調用](#extended-thinking-with-tool-use)之間發生
- 系統提示詞和工具儘管思考參數更改或塊移除仍保持快取

<Note>
雖然思考塊被移除以進行快取和上下文計算，但在使用[工具使用](#extended-thinking-with-tool-use)繼續對話時必須保留它們，特別是使用[交錯思考](#interleaved-thinking)時。
</Note>

### 理解思考塊快取行為

使用擴展思考與工具使用時，思考塊表現出特定的快取行為，影響令牌計數：

**工作原理：**

1. 只有當您發出包含工具結果的後續請求時，才會進行快取
2. 發出後續請求時，先前的對話歷史記錄（包括思考塊）可以被快取
3. 這些快取的思考塊在從快取讀取時計為您的使用指標中的輸入令牌
4. 當包含非工具結果用戶塊時，所有先前的思考塊都被忽略並從上下文中移除

**詳細示例流程：**

**請求 1：**
```
User: "What's the weather in Paris?"
```
**回應 1：**
```
[thinking_block_1] + [tool_use block 1]
```

**請求 2：**
```
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
```
**回應 2：**
```
[thinking_block_2] + [text block 2]
```
請求 2 寫入請求內容的快取（不是回應）。快取包括原始用戶消息、第一個思考塊、工具使用塊和工具結果。

**請求 3：**
```
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
```
對於 Claude Opus 4.5 及更高版本，默認情況下保留所有先前的思考塊。對於較舊的模型，因為包含了非工具結果用戶塊，所有先前的思考塊都被忽略。此請求將按以下方式處理：
```
User: ["What's the weather in Paris?"],
Assistant: [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```

**關鍵要點：**
- 此快取行為自動發生，即使沒有顯式的 `cache_control` 標記
- 無論使用常規思考還是交錯思考，此行為都是一致的

<section title="系統提示詞快取（在思考更改時保留）">

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
<section title="消息快取（在思考更改時失效）">

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

以下是腳本的輸出（您可能會看到略有不同的數字）

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

此示例演示了當快取設置在消息陣列中時，更改思考參數（budget_tokens 從 4000 增加到 8000）**使快取失效**。第三個請求顯示沒有快取命中，`cache_creation_input_tokens=1370` 和 `cache_read_input_tokens=0`，證明當思考參數更改時，基於消息的快取被失效。

</section>

## 使用擴展思考的最大令牌和上下文窗口大小

在較舊的 Claude 模型中（Claude Sonnet 3.7 之前），如果提示令牌和 `max_tokens` 的總和超過模型的上下文窗口，系統會自動調整 `max_tokens` 以適應上下文限制。這意味著您可以設置一個大的 `max_tokens` 值，系統會根據需要自動減少它。

使用 Claude 3.7 和 4 模型，`max_tokens`（啟用思考時包括您的思考預算）被強制執行為嚴格限制。如果提示令牌 + `max_tokens` 超過上下文窗口大小，系統現在將返回驗證錯誤。

<Note>
您可以閱讀我們的[上下文窗口指南](/docs/zh-TW/build-with-claude/context-windows)以進行更深入的探討。
</Note>

### 使用擴展思考的上下文窗口

使用啟用思考的上下文窗口計算時，有一些需要注意的考慮事項：

- 來自先前轉向的思考塊被剝離，不計入您的上下文窗口
- 當前轉向思考計入該轉向的 `max_tokens` 限制

下圖演示了啟用擴展思考時的專門令牌管理：

![使用擴展思考的上下文窗口圖](/docs/images/context-window-thinking.svg)

有效的上下文窗口計算為：

```
context window =
  (current input tokens - previous thinking tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

我們建議使用[令牌計數 API](/docs/zh-TW/build-with-claude/token-counting)為您的特定用例獲得準確的令牌計數，特別是在使用包含思考的多轉對話時。

### 使用擴展思考和工具使用的上下文窗口

使用擴展思考與工具使用時，思考塊必須明確保留並與工具結果一起返回。

使用擴展思考和工具使用的有效上下文窗口計算變為：

```
context window =
  (current input tokens + previous thinking tokens + tool use tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

下圖說明了使用擴展思考和工具使用的令牌管理：

![使用擴展思考和工具使用的上下文窗口圖](/docs/images/context-window-thinking-tools.svg)

### 使用擴展思考管理令牌

鑑於 Claude 3.7 和 4 模型的上下文窗口和 `max_tokens` 行為使用擴展思考，您可能需要：

- 更積極地監控和管理您的令牌使用
- 隨著提示詞長度的變化調整 `max_tokens` 值
- 可能更頻繁地使用[令牌計數端點](/docs/zh-TW/build-with-claude/token-counting)
- 意識到先前的思考塊不會在您的上下文窗口中累積

進行此更改是為了提供更可預測和透明的行為，特別是隨著最大令牌限制的顯著增加。

## 思考加密

完整的思考內容被加密並在 `signature` 字段中返回。此字段用於驗證思考塊是由 Claude 生成的，當傳遞回 API 時。

<Note>
只有在使用[帶有擴展思考的工具](#extended-thinking-with-tool-use)時，才嚴格需要發送回思考塊。否則，您可以省略先前轉向的思考塊，或讓 API 在您傳遞它們時為您移除它們。

如果發送回思考塊，我們建議按照您接收的方式傳遞所有內容以保持一致性並避免潛在問題。
</Note>

以下是關於思考加密的一些重要考慮事項：
- 當[流式傳輸回應](#streaming-thinking)時，簽名通過 `content_block_delta` 事件內的 `signature_delta` 添加，就在 `content_block_stop` 事件之前。
- `signature` 值在 Claude 4 模型中的長度明顯長於先前的模型。
- `signature` 字段是一個不透明字段，不應被解釋或解析 - 它僅用於驗證目的。
- `signature` 值在平台之間兼容（Claude API、[Amazon Bedrock](/docs/zh-TW/build-with-claude/claude-on-amazon-bedrock) 和 [Vertex AI](/docs/zh-TW/build-with-claude/claude-on-vertex-ai)）。在一個平台上生成的值將與另一個平台兼容。

### 思考內容編輯

偶爾 Claude 的內部推理會被我們的安全系統標記。當這種情況發生時，我們會加密 `thinking` 區塊的部分或全部內容，並將其作為 `redacted_thinking` 區塊返回給您。`redacted_thinking` 區塊在傳回 API 時會被解密，允許 Claude 繼續其回應而不會失去上下文。

在構建使用擴展思考的面向客戶的應用程式時：

- 請注意 redacted thinking 區塊包含不可人類閱讀的加密內容
- 考慮提供簡單的解釋，例如：「Claude 的某些內部推理已因安全原因自動加密。這不會影響回應的品質。」
- 如果向用戶顯示思考區塊，您可以過濾掉 redacted 區塊，同時保留正常的思考區塊
- 透明地說明使用擴展思考功能可能偶爾會導致某些推理被加密
- 實施適當的錯誤處理，以優雅地管理 redacted thinking，而不會破壞您的 UI

以下是顯示正常和 redacted thinking 區塊的範例：

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
在您的輸出中看到 redacted thinking 區塊是預期的行為。該模型仍然可以使用此 redacted 推理來通知其回應，同時維持安全護欄。

如果您需要在應用程式中測試 redacted thinking 處理，可以使用此特殊測試字串作為您的提示：`ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

在多輪對話中將 `thinking` 和 `redacted_thinking` 區塊傳回 API 時，您必須將最後一個助手回合的完整未修改區塊傳回 API。這對於維持模型的推理流程至關重要。我們建議始終將所有思考區塊傳回 API。如需更多詳細資訊，請參閱上面的[保留思考區塊](#preserving-thinking-blocks)部分。

<section title="範例：使用 redacted thinking 區塊">

此範例演示如何處理當 Claude 的內部推理包含被安全系統標記的內容時可能出現的 `redacted_thinking` 區塊：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Using a special prompt that triggers redacted thinking (for demonstration purposes only)
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

# Identify redacted thinking blocks
has_redacted_thinking = any(
    block.type == "redacted_thinking" for block in response.content
)

if has_redacted_thinking:
    print("Response contains redacted thinking blocks")
    # These blocks are still usable in subsequent requests

    # Extract all blocks (both redacted and non-redacted)
    all_thinking_blocks = [
        block for block in response.content
        if block.type in ["thinking", "redacted_thinking"]
    ]

    # When passing to subsequent requests, include all blocks without modification
    # This preserves the integrity of Claude's reasoning

    print(f"Found {len(all_thinking_blocks)} thinking blocks total")
    print(f"These blocks are still billable as output tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Using a special prompt that triggers redacted thinking (for demonstration purposes only)
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

// Identify redacted thinking blocks
const hasRedactedThinking = response.content.some(
  block => block.type === "redacted_thinking"
);

if (hasRedactedThinking) {
  console.log("Response contains redacted thinking blocks");
  // These blocks are still usable in subsequent requests

  // Extract all blocks (both redacted and non-redacted)
  const allThinkingBlocks = response.content.filter(
    block => block.type === "thinking" || block.type === "redacted_thinking"
  );

  // When passing to subsequent requests, include all blocks without modification
  // This preserves the integrity of Claude's reasoning

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

        // Using a special prompt that triggers redacted thinking (for demonstration purposes only)
        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_SONNET_4_5)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB")
                        .build()
        );

        // Identify redacted thinking blocks
        boolean hasRedactedThinking = response.content().stream()
                .anyMatch(BetaContentBlock::isRedactedThinking);

        if (hasRedactedThinking) {
            System.out.println("Response contains redacted thinking blocks");
            // These blocks are still usable in subsequent requests
            // Extract all blocks (both redacted and non-redacted)
            List<BetaContentBlock> allThinkingBlocks = response.content().stream()
                    .filter(block -> block.isThinking() ||
                            block.isRedactedThinking())
                    .collect(toList());

            // When passing to subsequent requests, include all blocks without modification
            // This preserves the integrity of Claude's reasoning
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
  在控制台中試用
</TryInConsoleButton>

</section>

## 不同模型版本間的思考差異

Messages API 在 Claude Sonnet 3.7 和 Claude 4 模型之間以不同方式處理思考，主要在編輯和摘要行為方面。

請參閱下表以了解簡明比較：

| 功能 | Claude Sonnet 3.7 | Claude 4 模型（Opus 4.5 之前） | Claude Opus 4.5 及更新版本 |
|---------|------------------|-------------------------------|--------------------------|
| **思考輸出** | 返回完整思考輸出 | 返回摘要思考 | 返回摘要思考 |
| **交錯思考** | 不支援 | 支援 `interleaved-thinking-2025-05-14` beta 標頭 | 支援 `interleaved-thinking-2025-05-14` beta 標頭 |
| **思考區塊保留** | 不在回合間保留 | 不在回合間保留 | **預設保留**（啟用快取最佳化、節省代幣） |

### Claude Opus 4.5 中的思考區塊保留

Claude Opus 4.5 引入了新的預設行為：**來自先前助手回合的思考區塊預設在模型上下文中保留**。這與早期模型不同，早期模型會移除先前回合的思考區塊。

**思考區塊保留的優點：**

- **快取最佳化**：使用工具時，保留的思考區塊可啟用快取命中，因為它們會與工具結果一起傳回，並在助手回合中逐步快取，導致多步驟工作流程中的代幣節省
- **無智能影響**：保留思考區塊對模型效能沒有負面影響

**重要考慮事項：**

- **上下文使用**：長對話將消耗更多上下文空間，因為思考區塊保留在上下文中
- **自動行為**：這是 Claude Opus 4.5 的預設行為——不需要程式碼變更或 beta 標頭
- **向後相容性**：若要利用此功能，請繼續將完整、未修改的思考區塊傳回 API，就像您對工具使用所做的那樣

<Note>
對於早期模型（Claude Sonnet 4.5、Opus 4.1 等），來自先前回合的思考區塊繼續從上下文中移除。[使用提示快取的擴展思考](#extended-thinking-with-prompt-caching)部分中描述的現有行為適用於這些模型。
</Note>

## 定價

如需完整的定價資訊，包括基本費率、快取寫入、快取命中和輸出代幣，請參閱[定價頁面](/docs/zh-TW/about-claude/pricing)。

思考過程產生的費用包括：
- 思考期間使用的代幣（輸出代幣）
- 後續請求中包含的最後一個助手回合的思考區塊（輸入代幣）
- 標準文字輸出代幣

<Note>
啟用擴展思考時，會自動包含專門的系統提示以支援此功能。
</Note>

使用摘要思考時：
- **輸入代幣**：您原始請求中的代幣（不包括先前回合的思考代幣）
- **輸出代幣（計費）**：Claude 內部生成的原始思考代幣
- **輸出代幣（可見）**：您在回應中看到的摘要思考代幣
- **無費用**：用於生成摘要的代幣

<Warning>
計費的輸出代幣計數將**不**與回應中的可見代幣計數相符。您需要為完整的思考過程付費，而不是您看到的摘要。
</Warning>

## 擴展思考的最佳實踐和考慮事項

### 使用思考預算

- **預算最佳化：**最小預算為 1,024 個代幣。我們建議從最小值開始，逐步增加思考預算以找到您用例的最佳範圍。更高的代幣計數可啟用更全面的推理，但根據任務會有遞減的回報。增加預算可以改善回應品質，但代價是增加延遲。對於關鍵任務，測試不同的設定以找到最佳平衡。請注意，思考預算是目標而非嚴格限制——實際代幣使用可能因任務而異。
- **起點：**對於複雜任務，從較大的思考預算（16k+ 代幣）開始，並根據您的需求進行調整。
- **大型預算：**對於超過 32k 的思考預算，我們建議使用[批次處理](/docs/zh-TW/build-with-claude/batch-processing)以避免網路問題。推動模型思考超過 32k 代幣的請求會導致長時間執行的請求，可能會遇到系統逾時和開放連線限制。
- **代幣使用追蹤：**監控思考代幣使用情況以最佳化成本和效能。

### 效能考慮事項

- **回應時間：**為推理過程所需的額外處理可能導致的更長回應時間做好準備。考慮到生成思考區塊可能會增加整體回應時間。
- **串流要求：**當 `max_tokens` 大於 21,333 時，需要串流。串流時，請準備好在思考和文字內容區塊到達時處理它們。

### 功能相容性

- 思考與 `temperature` 或 `top_k` 修改以及[強制工具使用](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use)不相容。
- 啟用思考時，您可以將 `top_p` 設定為 1 到 0.95 之間的值。
- 啟用思考時，您無法預先填充回應。
- 思考預算的變更會使包含訊息的快取提示前綴失效。但是，當思考參數變更時，快取的系統提示和工具定義將繼續工作。

### 使用指南

- **任務選擇：**對於受益於逐步推理的特別複雜任務（如數學、編碼和分析），使用擴展思考。
- **上下文處理：**您不需要自己移除先前的思考區塊。Claude API 會自動忽略先前回合的思考區塊，它們在計算上下文使用時不包括在內。
- **提示工程：**如果您想最大化 Claude 的思考能力，請查看我們的[擴展思考提示提示](/docs/zh-TW/build-with-claude/prompt-engineering/extended-thinking-tips)。

## 後續步驟

<CardGroup>
  <Card title="試用擴展思考食譜" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    在我們的食譜中探索思考的實際範例。
  </Card>
  <Card title="擴展思考提示提示" icon="code" href="/docs/zh-TW/build-with-claude/prompt-engineering/extended-thinking-tips">
    了解擴展思考的提示工程最佳實踐。
  </Card>
</CardGroup>