# 확장 사고로 구축하기

Claude의 확장 사고 기능을 사용하여 복잡한 작업에 대한 향상된 추론 기능을 활용하고 단계별 사고 과정에 대한 투명성을 확보하는 방법을 알아봅니다.

---

확장 사고는 Claude에게 복잡한 작업을 위한 향상된 추론 기능을 제공하면서 최종 답변을 제공하기 전에 단계별 사고 과정에 대한 다양한 수준의 투명성을 제공합니다.

## 지원되는 모델

확장 사고는 다음 모델에서 지원됩니다:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([deprecated](/docs/ko/about-claude/model-deprecations))
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

<Note>
API 동작은 Claude Sonnet 3.7과 Claude 4 모델 간에 다르지만, API 형태는 정확히 동일합니다.

자세한 내용은 [모델 버전 간 사고의 차이](#differences-in-thinking-across-model-versions)를 참조하세요.
</Note>

## 확장 사고의 작동 원리

확장 사고가 켜져 있으면 Claude는 내부 추론을 출력하는 `thinking` 콘텐츠 블록을 생성합니다. Claude는 이 추론의 통찰력을 최종 응답을 작성하기 전에 통합합니다.

API 응답에는 `thinking` 콘텐츠 블록이 포함되고, 그 뒤에 `text` 콘텐츠 블록이 포함됩니다.

기본 응답 형식의 예는 다음과 같습니다:

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

확장 사고의 응답 형식에 대한 자세한 내용은 [Messages API 참조](/docs/ko/api/messages)를 참조하세요.

## 확장 사고를 사용하는 방법

다음은 Messages API에서 확장 사고를 사용하는 예입니다:

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

확장 사고를 켜려면 `thinking` 객체를 추가하고, `type` 매개변수를 `enabled`로 설정하고, `budget_tokens`를 확장 사고를 위한 지정된 토큰 예산으로 설정합니다.

`budget_tokens` 매개변수는 Claude가 내부 추론 프로세스에 사용할 수 있는 최대 토큰 수를 결정합니다. Claude 4 모델에서 이 제한은 전체 사고 토큰에 적용되며, [요약된 출력](#summarized-thinking)에는 적용되지 않습니다. 더 큰 예산은 복잡한 문제에 대해 더 철저한 분석을 가능하게 하여 응답 품질을 향상시킬 수 있지만, Claude는 특히 32k 이상의 범위에서 할당된 전체 예산을 사용하지 않을 수 있습니다.

`budget_tokens`는 `max_tokens`보다 작은 값으로 설정해야 합니다. 그러나 [도구와 함께 인터리브된 사고](#interleaved-thinking)를 사용할 때는 토큰 제한이 전체 컨텍스트 윈도우(200k 토큰)가 되므로 이 제한을 초과할 수 있습니다.

### 요약된 사고

확장 사고가 활성화되면 Claude 4 모델의 Messages API는 Claude의 전체 사고 프로세스의 요약을 반환합니다. 요약된 사고는 확장 사고의 전체 지능 이점을 제공하면서 오용을 방지합니다.

요약된 사고에 대한 몇 가지 중요한 고려 사항은 다음과 같습니다:

- 요약 토큰이 아닌 원래 요청에서 생성된 전체 사고 토큰에 대해 청구됩니다.
- 청구된 출력 토큰 수는 응답에서 보이는 토큰 수와 **일치하지 않습니다**.
- 사고 출력의 처음 몇 줄은 더 자세하며, 프롬프트 엔지니어링 목적에 특히 유용한 상세한 추론을 제공합니다.
- Anthropic이 확장 사고 기능을 개선하려고 노력함에 따라 요약 동작은 변경될 수 있습니다.
- 요약은 최소한의 추가 지연으로 Claude의 사고 프로세스의 핵심 아이디어를 보존하여 스트리밍 가능한 사용자 경험과 Claude Sonnet 3.7에서 Claude 4 모델로의 쉬운 마이그레이션을 가능하게 합니다.
- 요약은 요청에서 대상으로 지정한 모델과 다른 모델에 의해 처리됩니다. 사고 모델은 요약된 출력을 보지 않습니다.

<Note>
Claude Sonnet 3.7은 계속해서 전체 사고 출력을 반환합니다.

Claude 4 모델에 대한 전체 사고 출력에 액세스해야 하는 드문 경우에는 [영업팀에 문의하세요](mailto:sales@anthropic.com).
</Note>

### 스트리밍 사고

[서버 전송 이벤트(SSE)](https://developer.mozilla.org/en-US/Web/API/Server-sent%5Fevents/Using%5Fserver-sent%5Fevents)를 사용하여 확장 사고 응답을 스트리밍할 수 있습니다.

확장 사고에 대해 스트리밍이 활성화되면 `thinking_delta` 이벤트를 통해 사고 콘텐츠를 받습니다.

Messages API를 통한 스트리밍에 대한 자세한 문서는 [스트리밍 메시지](/docs/ko/build-with-claude/streaming)를 참조하세요.

사고로 스트리밍을 처리하는 방법은 다음과 같습니다:

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
  콘솔에서 시도해보기
</TryInConsoleButton>

예제 스트리밍 출력:
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
사고가 활성화된 상태에서 스트리밍을 사용할 때 텍스트가 때때로 더 큰 청크로 도착한 후 더 작은 토큰 단위로 전달되는 것을 볼 수 있습니다. 이는 예상된 동작이며, 특히 사고 콘텐츠의 경우 그렇습니다.

스트리밍 시스템은 최적의 성능을 위해 배치로 콘텐츠를 처리해야 하므로 이러한 "청크" 전달 패턴이 발생할 수 있으며, 스트리밍 이벤트 간에 지연이 발생할 수 있습니다. 우리는 지속적으로 이 경험을 개선하기 위해 노력하고 있으며, 향후 업데이트는 사고 콘텐츠를 더 부드럽게 스트리밍하는 데 중점을 두고 있습니다.
</Note>

## 도구 사용과 함께 확장 사고

확장 사고는 [도구 사용](/docs/ko/agents-and-tools/tool-use/overview)과 함께 사용될 수 있으며, Claude가 도구 선택 및 결과 처리를 통해 추론할 수 있습니다.

도구 사용과 함께 확장 사고를 사용할 때 다음 제한 사항을 주의하세요:

1. **도구 선택 제한**: 사고와 함께 도구 사용은 `tool_choice: {"type": "auto"}` (기본값) 또는 `tool_choice: {"type": "none"}`만 지원합니다. `tool_choice: {"type": "any"}` 또는 `tool_choice: {"type": "tool", "name": "..."}`를 사용하면 이러한 옵션이 도구 사용을 강제하기 때문에 오류가 발생하며, 이는 확장 사고와 호환되지 않습니다.

2. **사고 블록 보존**: 도구 사용 중에 마지막 어시스턴트 메시지에 대해 `thinking` 블록을 API로 다시 전달해야 합니다. 추론 연속성을 유지하기 위해 완전하고 수정되지 않은 블록을 API로 다시 전달하세요.

### 대화에서 사고 모드 전환

어시스턴트 턴 중간에 사고를 전환할 수 없으며, 도구 사용 루프 중에도 마찬가지입니다. 전체 어시스턴트 턴은 단일 사고 모드에서 작동해야 합니다:

- **사고가 활성화된 경우**, 최종 어시스턴트 턴은 사고 블록으로 시작해야 합니다.
- **사고가 비활성화된 경우**, 최종 어시스턴트 턴은 사고 블록을 포함하지 않아야 합니다.

모델의 관점에서 **도구 사용 루프는 어시스턴트 턴의 일부입니다**. 어시스턴트 턴은 Claude가 여러 도구 호출 및 결과를 포함할 수 있는 전체 응답을 완료할 때까지 완료되지 않습니다.

예를 들어, 이 시퀀스는 모두 **단일 어시스턴트 턴**의 일부입니다:
```
User: "What's the weather in Paris?"
Assistant: [thinking] + [tool_use: get_weather]
User: [tool_result: "20°C, sunny"]
Assistant: [text: "The weather in Paris is 20°C and sunny"]
```

여러 API 메시지가 있지만, 도구 사용 루프는 개념적으로 하나의 연속적인 어시스턴트 응답의 일부입니다.

#### 일반적인 오류 시나리오

이 오류가 발생할 수 있습니다:
```
Expected `thinking` or `redacted_thinking`, but found `tool_use`.
When `thinking` is enabled, a final `assistant` message must start
with a thinking block (preceding the lastmost set of `tool_use` and
`tool_result` blocks).
```

이는 일반적으로 다음과 같은 경우에 발생합니다:
1. 도구 사용 시퀀스 중에 사고가 **비활성화**되었습니다.
2. 사고를 다시 활성화하려고 합니다.
3. 마지막 어시스턴트 메시지에 도구 사용 블록이 포함되어 있지만 사고 블록이 없습니다.

#### 실용적인 지침

**✗ 잘못됨: 도구 사용 직후 사고 전환**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
// 여전히 동일한 어시스턴트 턴에 있으므로 사고를 활성화할 수 없습니다.
```

**✓ 올바름: 먼저 어시스턴트 턴 완료**
```
User: "What's the weather?"
Assistant: [tool_use] (thinking disabled)
User: [tool_result]
Assistant: [text: "It's sunny"] 
User: "What about tomorrow?" (thinking disabled)
Assistant: [thinking] + [text: "..."] (thinking enabled - new turn)
```

**모범 사례**: 턴 중간에 전환하려고 하기보다는 각 턴의 시작 부분에서 사고 전략을 계획하세요.

<Note>
대화 중에 사고 모드를 전환하면 메시지 기록에 대한 프롬프트 캐싱도 무효화됩니다. 자세한 내용은 [프롬프트 캐싱과 함께 확장 사고](#extended-thinking-with-prompt-caching) 섹션을 참조하세요.
</Note>

<section title="예제: 도구 결과와 함께 사고 블록 전달">

도구 결과를 제공할 때 사고 블록을 보존하는 방법을 보여주는 실용적인 예제입니다:

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

API 응답에는 사고, 텍스트 및 tool_use 블록이 포함됩니다:

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

이제 대화를 계속하고 도구를 사용해봅시다.

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

API 응답은 이제 **텍스트만** 포함합니다.

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

### 사고 블록 보존

도구 사용 중에 `thinking` 블록을 API로 다시 전달해야 하며, 완전하고 수정되지 않은 블록을 API로 다시 전달해야 합니다. 이는 모델의 추론 흐름과 대화 무결성을 유지하는 데 중요합니다.

<Tip>
이전 `assistant` 역할 턴에서 `thinking` 블록을 생략할 수 있지만, 다중 턴 대화의 경우 항상 모든 사고 블록을 API로 다시 전달하는 것을 권장합니다. API는 다음을 수행합니다:
- 제공된 사고 블록을 자동으로 필터링합니다.
- 모델의 추론을 보존하는 데 필요한 관련 사고 블록을 사용합니다.
- Claude에게 표시되는 블록에 대한 입력 토큰만 청구합니다.
</Tip>

<Note>
대화 중에 사고 모드를 전환할 때 전체 어시스턴트 턴(도구 사용 루프 포함)이 단일 사고 모드에서 작동해야 한다는 점을 기억하세요. 자세한 내용은 [대화에서 사고 모드 전환](#toggling-thinking-modes-in-conversations)을 참조하세요.
</Note>

Claude가 도구를 호출할 때 외부 정보를 기다리기 위해 응답 구성을 일시 중지합니다. 도구 결과가 반환되면 Claude는 기존 응답 구성을 계속합니다. 이는 도구 사용 중에 사고 블록을 보존해야 하는 몇 가지 이유가 있습니다:

1. **추론 연속성**: 사고 블록은 도구 요청으로 이어진 Claude의 단계별 추론을 캡처합니다. 도구 결과를 게시할 때 원래 사고를 포함하면 Claude가 중단된 지점에서 추론을 계속할 수 있습니다.

2. **컨텍스트 유지**: 도구 결과는 API 구조에서 사용자 메시지로 나타나지만, 연속적인 추론 흐름의 일부입니다. 사고 블록을 보존하면 여러 API 호출에 걸쳐 이 개념적 흐름을 유지합니다. 컨텍스트 관리에 대한 자세한 내용은 [컨텍스트 윈도우 가이드](/docs/ko/build-with-claude/context-windows)를 참조하세요.

**중요**: `thinking` 블록을 제공할 때 연속적인 `thinking` 블록의 전체 시퀀스는 원래 요청 중에 모델에서 생성된 출력과 일치해야 합니다. 이러한 블록의 시퀀스를 재배열하거나 수정할 수 없습니다.

### 인터리빙 사고

Claude 4 모델의 도구 사용과 함께하는 확장 사고는 인터리빙 사고를 지원하며, 이를 통해 Claude는 도구 호출 사이에 생각하고 도구 결과를 받은 후 더 정교한 추론을 할 수 있습니다.

인터리빙 사고를 사용하면 Claude는 다음을 수행할 수 있습니다:
- 도구 호출의 결과에 대해 생각한 후 다음에 할 일을 결정
- 여러 도구 호출을 중간에 추론 단계를 포함하여 연결
- 중간 결과에 기반하여 더 미묘한 결정 내리기

인터리빙 사고를 활성화하려면 [베타 헤더](/docs/ko/api/beta-headers) `interleaved-thinking-2025-05-14`를 API 요청에 추가하세요.

인터리빙 사고에 대한 몇 가지 중요한 고려사항은 다음과 같습니다:
- 인터리빙 사고를 사용하면 `budget_tokens`이 `max_tokens` 매개변수를 초과할 수 있으며, 이는 한 번의 어시스턴트 턴 내의 모든 사고 블록에 걸친 총 예산을 나타냅니다.
- 인터리빙 사고는 [Messages API를 통해 사용되는 도구](/docs/ko/agents-and-tools/tool-use/overview)에만 지원됩니다.
- 인터리빙 사고는 Claude 4 모델에만 지원되며, 베타 헤더 `interleaved-thinking-2025-05-14`를 사용합니다.
- Claude API에 대한 직접 호출을 통해 `interleaved-thinking-2025-05-14`를 모든 모델에 대한 요청에 전달할 수 있으며, 효과가 없습니다.
- 제3자 플랫폼(예: [Amazon Bedrock](/docs/ko/build-with-claude/claude-on-amazon-bedrock) 및 [Vertex AI](/docs/ko/build-with-claude/claude-on-vertex-ai))에서 Claude Opus 4.5, Claude Opus 4.1, Opus 4 또는 Sonnet 4 이외의 모델에 `interleaved-thinking-2025-05-14`를 전달하면 요청이 실패합니다.

<section title="인터리빙 사고 없는 도구 사용">

인터리빙 사고 없이 Claude는 어시스턴트 턴의 시작에 한 번 생각합니다. 도구 결과 이후의 후속 응답은 새로운 사고 블록 없이 계속됩니다.

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

<section title="인터리빙 사고를 사용한 도구 사용">

인터리빙 사고가 활성화되면 Claude는 각 도구 결과를 받은 후 생각할 수 있으므로 계속하기 전에 중간 결과에 대해 추론할 수 있습니다.

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

## 프롬프트 캐싱을 사용한 확장 사고

[프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)과 사고에는 몇 가지 중요한 고려사항이 있습니다:

<Tip>
확장 사고 작업은 종종 완료하는 데 5분 이상 걸립니다. 더 긴 사고 세션 및 다단계 워크플로우에서 캐시 히트를 유지하기 위해 [1시간 캐시 지속 시간](/docs/ko/build-with-claude/prompt-caching#1-hour-cache-duration)을 사용하는 것을 고려하세요.
</Tip>

**사고 블록 컨텍스트 제거**
- 이전 턴의 사고 블록은 컨텍스트에서 제거되며, 이는 캐시 중단점에 영향을 미칠 수 있습니다.
- 도구 사용으로 대화를 계속할 때 사고 블록은 캐시되고 캐시에서 읽을 때 입력 토큰으로 계산됩니다.
- 이는 트레이드오프를 만듭니다: 사고 블록이 시각적으로 컨텍스트 윈도우 공간을 소비하지 않지만, 캐시될 때 입력 토큰 사용량에 여전히 계산됩니다.
- 사고가 비활성화되면, 현재 도구 사용 턴에서 사고 콘텐츠를 전달하면 요청이 실패합니다. 다른 컨텍스트에서는 API에 전달된 사고 콘텐츠가 단순히 무시됩니다.

**캐시 무효화 패턴**
- 사고 매개변수 변경(활성화/비활성화 또는 예산 할당)은 메시지 캐시 중단점을 무효화합니다.
- [인터리빙 사고](#인터리빙-사고)는 캐시 무효화를 증폭시키며, 사고 블록이 여러 [도구 호출](#도구-사용을-사용한-확장-사고) 사이에서 발생할 수 있습니다.
- 시스템 프롬프트 및 도구는 사고 매개변수 변경 또는 블록 제거에도 불구하고 캐시된 상태로 유지됩니다.

<Note>
사고 블록이 캐싱 및 컨텍스트 계산을 위해 제거되지만, [도구 사용](#도구-사용을-사용한-확장-사고)으로 대화를 계속할 때, 특히 [인터리빙 사고](#인터리빙-사고)를 사용할 때는 보존되어야 합니다.
</Note>

### 사고 블록 캐싱 동작 이해

도구 사용과 함께 확장 사고를 사용할 때 사고 블록은 토큰 계산에 영향을 미치는 특정 캐싱 동작을 나타냅니다:

**작동 방식:**

1. 캐싱은 도구 결과를 포함하는 후속 요청을 할 때만 발생합니다.
2. 후속 요청이 이루어질 때 이전 대화 기록(사고 블록 포함)을 캐시할 수 있습니다.
3. 이러한 캐시된 사고 블록은 캐시에서 읽을 때 사용 메트릭에서 입력 토큰으로 계산됩니다.
4. 비도구 결과 사용자 블록이 포함되면 모든 이전 사고 블록이 무시되고 컨텍스트에서 제거됩니다.

**상세 예제 흐름:**

**요청 1:**
```
User: "What's the weather in Paris?"
```
**응답 1:**
```
[thinking_block_1] + [tool_use block 1]
```

**요청 2:**
```
User: ["What's the weather in Paris?"], 
Assistant: [thinking_block_1] + [tool_use block 1], 
User: [tool_result_1, cache=True]
```
**응답 2:**
```
[thinking_block_2] + [text block 2]
```
요청 2는 요청 콘텐츠(응답이 아님)의 캐시를 작성합니다. 캐시에는 원본 사용자 메시지, 첫 번째 사고 블록, 도구 사용 블록 및 도구 결과가 포함됩니다.

**요청 3:**
```
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
```
Claude Opus 4.5 이상의 경우 모든 이전 사고 블록이 기본적으로 유지됩니다. 이전 모델의 경우 비도구 결과 사용자 블록이 포함되었으므로 모든 이전 사고 블록이 무시됩니다. 이 요청은 다음과 같이 처리됩니다:
```
User: ["What's the weather in Paris?"],
Assistant: [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [text block 2],
User: [Text response, cache=True]
```

**핵심 포인트:**
- 이 캐싱 동작은 명시적인 `cache_control` 마커 없이도 자동으로 발생합니다.
- 이 동작은 일반 사고 또는 인터리빙 사고를 사용하는지 여부와 관계없이 일관성이 있습니다.

<section title="시스템 프롬프트 캐싱(사고 변경 시 보존됨)">

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
<section title="메시지 캐싱(사고 변경 시 무효화됨)">

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

스크립트의 출력은 다음과 같습니다(약간 다른 숫자가 표시될 수 있습니다).

```
First request - establishing cache
First response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 17, output_tokens: 700 }

Second request - same thinking parameters (cache hit expected)

Second response usage: { cache_creation_input_tokens: 0, cache_read_input_tokens: 1370, input_tokens: 303, output_tokens: 874 }

Third request - different thinking budget (cache miss expected)
Third response usage: { cache_creation_input_tokens: 1370, cache_read_input_tokens: 0, input_tokens: 747, output_tokens: 619 }
```

이 예제는 메시지 배열에 캐싱이 설정되면 사고 매개변수 변경(budget_tokens이 4000에서 8000으로 증가) **캐시를 무효화**함을 보여줍니다. 세 번째 요청은 `cache_creation_input_tokens=1370` 및 `cache_read_input_tokens=0`으로 캐시 히트가 없음을 보여주며, 이는 사고 매개변수 변경 시 메시지 기반 캐싱이 무효화됨을 증명합니다.

</section>

## 확장 사고를 사용한 최대 토큰 및 컨텍스트 윈도우 크기

이전 Claude 모델(Claude Sonnet 3.7 이전)에서 프롬프트 토큰과 `max_tokens`의 합이 모델의 컨텍스트 윈도우를 초과하면 시스템은 자동으로 `max_tokens`를 조정하여 컨텍스트 제한 내에 맞춥니다. 이는 큰 `max_tokens` 값을 설정할 수 있고 시스템이 필요에 따라 자동으로 줄인다는 의미입니다.

Claude 3.7 및 4 모델에서 `max_tokens`(사고가 활성화되면 사고 예산 포함)은 엄격한 제한으로 적용됩니다. 이제 프롬프트 토큰 + `max_tokens`이 컨텍스트 윈도우 크기를 초과하면 시스템이 유효성 검사 오류를 반환합니다.

<Note>
컨텍스트 윈도우에 대한 더 철저한 심화 학습을 위해 [컨텍스트 윈도우 가이드](/docs/ko/build-with-claude/context-windows)를 읽을 수 있습니다.
</Note>

### 확장 사고를 사용한 컨텍스트 윈도우

사고가 활성화된 상태에서 컨텍스트 윈도우 사용을 계산할 때 주의해야 할 몇 가지 고려사항이 있습니다:

- 이전 턴의 사고 블록은 제거되고 컨텍스트 윈도우에 계산되지 않습니다.
- 현재 턴 사고는 해당 턴의 `max_tokens` 제한에 계산됩니다.

아래 다이어그램은 확장 사고가 활성화되었을 때의 특수한 토큰 관리를 보여줍니다:

![확장 사고를 사용한 컨텍스트 윈도우 다이어그램](/docs/images/context-window-thinking.svg)

유효 컨텍스트 윈도우는 다음과 같이 계산됩니다:

```
context window =
  (current input tokens - previous thinking tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

특히 사고를 포함하는 다중 턴 대화로 작업할 때 정확한 토큰 계산을 위해 [토큰 계산 API](/docs/ko/build-with-claude/token-counting)를 사용하는 것을 권장합니다.

### 도구 사용을 사용한 확장 사고의 컨텍스트 윈도우

도구 사용과 함께 확장 사고를 사용할 때 사고 블록은 명시적으로 보존되고 도구 결과와 함께 반환되어야 합니다.

도구 사용을 사용한 확장 사고의 유효 컨텍스트 윈도우 계산은 다음과 같습니다:

```
context window =
  (current input tokens + previous thinking tokens + tool use tokens) +
  (thinking tokens + encrypted thinking tokens + text output tokens)
```

아래 다이어그램은 도구 사용을 사용한 확장 사고의 토큰 관리를 보여줍니다:

![도구 사용을 사용한 확장 사고의 컨텍스트 윈도우 다이어그램](/docs/images/context-window-thinking-tools.svg)

### 확장 사고를 사용한 토큰 관리

Claude 3.7 및 4 모델의 확장 사고 컨텍스트 윈도우 및 `max_tokens` 동작을 고려하면 다음을 수행해야 할 수 있습니다:

- 토큰 사용을 더 적극적으로 모니터링하고 관리
- 프롬프트 길이 변경에 따라 `max_tokens` 값 조정
- 잠재적으로 [토큰 계산 엔드포인트](/docs/ko/build-with-claude/token-counting)를 더 자주 사용
- 이전 사고 블록이 컨텍스트 윈도우에 누적되지 않음을 인식

이 변경은 특히 최대 토큰 제한이 크게 증가했으므로 더 예측 가능하고 투명한 동작을 제공하기 위해 이루어졌습니다.

## 사고 암호화

전체 사고 콘텐츠는 암호화되고 `signature` 필드에 반환됩니다. 이 필드는 사고 블록이 API에 다시 전달될 때 Claude에 의해 생성되었음을 확인하는 데 사용됩니다.

<Note>
[도구를 사용한 확장 사고](#도구-사용을-사용한-확장-사고)를 사용할 때만 사고 블록을 다시 보내는 것이 엄격히 필요합니다. 그렇지 않으면 이전 턴의 사고 블록을 생략하거나 API가 다시 전달하면 제거하도록 할 수 있습니다.

사고 블록을 다시 보낼 때 일관성을 위해 그리고 잠재적인 문제를 피하기 위해 받은 그대로 모든 것을 다시 보내는 것을 권장합니다.
</Note>

사고 암호화에 대한 몇 가지 중요한 고려사항은 다음과 같습니다:
- [응답을 스트리밍할 때](#스트리밍-사고) 서명은 `content_block_stop` 이벤트 직전에 `content_block_delta` 내의 `signature_delta`를 통해 추가됩니다.
- `signature` 값은 Claude 4 모델에서 이전 모델보다 훨씬 깁니다.
- `signature` 필드는 불투명 필드이며 해석하거나 구문 분석해서는 안 됩니다. 검증 목적으로만 존재합니다.
- `signature` 값은 플랫폼 간에 호환됩니다(Claude API, [Amazon Bedrock](/docs/ko/build-with-claude/claude-on-amazon-bedrock) 및 [Vertex AI](/docs/ko/build-with-claude/claude-on-vertex-ai)). 한 플랫폼에서 생성된 값은 다른 플랫폼과 호환됩니다.

### 사고 과정 편집

때때로 Claude의 내부 추론이 우리의 안전 시스템에 의해 플래그됩니다. 이런 경우가 발생하면, 우리는 `thinking` 블록의 일부 또는 전부를 암호화하고 `redacted_thinking` 블록으로 반환합니다. `redacted_thinking` 블록은 API로 다시 전달될 때 복호화되어 Claude가 컨텍스트를 잃지 않고 응답을 계속할 수 있습니다.

확장 사고를 사용하는 고객 대면 애플리케이션을 구축할 때:

- redacted thinking 블록에는 사람이 읽을 수 없는 암호화된 콘텐츠가 포함되어 있음을 인식하세요
- "Claude의 일부 내부 추론이 안전상의 이유로 자동으로 암호화되었습니다. 이는 응답의 품질에 영향을 주지 않습니다."와 같은 간단한 설명을 제공하는 것을 고려하세요
- 사용자에게 thinking 블록을 표시하는 경우, redacted 블록을 필터링하면서 일반 thinking 블록은 유지할 수 있습니다
- 확장 사고 기능을 사용하면 때때로 일부 추론이 암호화될 수 있다는 점을 투명하게 전달하세요
- redacted thinking을 우아하게 처리하여 UI가 깨지지 않도록 적절한 오류 처리를 구현하세요

다음은 일반 thinking 블록과 redacted thinking 블록을 모두 보여주는 예입니다:

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
출력에서 redacted thinking 블록을 보는 것은 예상된 동작입니다. 모델은 여전히 이 redacted 추론을 사용하여 응답에 정보를 제공하면서 안전 가드레일을 유지할 수 있습니다.

애플리케이션에서 redacted thinking 처리를 테스트해야 하는 경우, 프롬프트로 이 특수 테스트 문자열을 사용할 수 있습니다: `ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB`
</Note>

다중 턴 대화에서 `thinking` 및 `redacted_thinking` 블록을 API로 다시 전달할 때, 마지막 어시스턴트 턴에 대해 완전하고 수정되지 않은 블록을 API로 다시 전달해야 합니다. 이는 모델의 추론 흐름을 유지하는 데 중요합니다. 우리는 항상 모든 thinking 블록을 API로 다시 전달할 것을 제안합니다. 자세한 내용은 위의 [Preserving thinking blocks](#preserving-thinking-blocks) 섹션을 참조하세요.

<section title="예: redacted thinking 블록 작업하기">

이 예제는 Claude의 내부 추론이 안전 시스템에 의해 플래그된 콘텐츠를 포함할 때 응답에 나타날 수 있는 `redacted_thinking` 블록을 처리하는 방법을 보여줍니다:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# redacted thinking을 트리거하는 특수 프롬프트 사용 (데모 목적으로만)
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

# redacted thinking 블록 식별
has_redacted_thinking = any(
    block.type == "redacted_thinking" for block in response.content
)

if has_redacted_thinking:
    print("Response contains redacted thinking blocks")
    # 이 블록들은 여전히 후속 요청에서 사용 가능합니다

    # 모든 블록 추출 (redacted 및 non-redacted 모두)
    all_thinking_blocks = [
        block for block in response.content
        if block.type in ["thinking", "redacted_thinking"]
    ]

    # 후속 요청으로 전달할 때, 모든 블록을 수정 없이 포함하세요
    # 이는 Claude의 추론 무결성을 보존합니다

    print(f"Found {len(all_thinking_blocks)} thinking blocks total")
    print(f"These blocks are still billable as output tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// redacted thinking을 트리거하는 특수 프롬프트 사용 (데모 목적으로만)
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

// redacted thinking 블록 식별
const hasRedactedThinking = response.content.some(
  block => block.type === "redacted_thinking"
);

if (hasRedactedThinking) {
  console.log("Response contains redacted thinking blocks");
  // 이 블록들은 여전히 후속 요청에서 사용 가능합니다

  // 모든 블록 추출 (redacted 및 non-redacted 모두)
  const allThinkingBlocks = response.content.filter(
    block => block.type === "thinking" || block.type === "redacted_thinking"
  );

  // 후속 요청으로 전달할 때, 모든 블록을 수정 없이 포함하세요
  // 이는 Claude의 추론 무결성을 보존합니다

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

        // redacted thinking을 트리거하는 특수 프롬프트 사용 (데모 목적으로만)
        BetaMessage response = client.beta().messages().create(
                MessageCreateParams.builder()
                        .model(Model.CLAUDE_SONNET_4_5)
                        .maxTokens(16000)
                        .thinking(BetaThinkingConfigEnabled.builder().budgetTokens(10000).build())
                        .addUserMessage("ANTHROPIC_MAGIC_STRING_TRIGGER_REDACTED_THINKING_46C9A13E193C177646C7398A98432ECCCE4C1253D5E2D82641AC0E52CC2876CB")
                        .build()
        );

        // redacted thinking 블록 식별
        boolean hasRedactedThinking = response.content().stream()
                .anyMatch(BetaContentBlock::isRedactedThinking);

        if (hasRedactedThinking) {
            System.out.println("Response contains redacted thinking blocks");
            // 이 블록들은 여전히 후속 요청에서 사용 가능합니다
            // 모든 블록 추출 (redacted 및 non-redacted 모두)
            List<BetaContentBlock> allThinkingBlocks = response.content().stream()
                    .filter(block -> block.isThinking() ||
                            block.isRedactedThinking())
                    .collect(toList());

            // 후속 요청으로 전달할 때, 모든 블록을 수정 없이 포함하세요
            // 이는 Claude의 추론 무결성을 보존합니다
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
  콘솔에서 시도해보기
</TryInConsoleButton>

</section>

## 모델 버전 간 사고 과정의 차이점

Messages API는 주로 redaction 및 요약 동작에서 Claude Sonnet 3.7과 Claude 4 모델 간에 사고 과정을 다르게 처리합니다.

축약된 비교를 위해 아래 표를 참조하세요:

| 기능 | Claude Sonnet 3.7 | Claude 4 모델 (Opus 4.5 이전) | Claude Opus 4.5 이상 |
|---------|------------------|-------------------------------|--------------------------|
| **Thinking 출력** | 전체 thinking 출력 반환 | 요약된 thinking 반환 | 요약된 thinking 반환 |
| **인터리브된 Thinking** | 지원되지 않음 | `interleaved-thinking-2025-05-14` 베타 헤더로 지원 | `interleaved-thinking-2025-05-14` 베타 헤더로 지원 |
| **Thinking 블록 보존** | 턴 간에 보존되지 않음 | 턴 간에 보존되지 않음 | **기본적으로 보존됨** (캐시 최적화, 토큰 절감 활성화) |

### Claude Opus 4.5의 thinking 블록 보존

Claude Opus 4.5는 새로운 기본 동작을 도입합니다: **이전 어시스턴트 턴의 thinking 블록이 기본적으로 모델 컨텍스트에 보존됩니다**. 이는 이전 턴의 thinking 블록을 제거하는 이전 모델과 다릅니다.

**thinking 블록 보존의 이점:**

- **캐시 최적화**: 도구 사용 시, 보존된 thinking 블록은 도구 결과와 함께 다시 전달되고 어시스턴트 턴 전체에 걸쳐 증분적으로 캐시되므로 다중 단계 워크플로우에서 토큰 절감이 가능합니다
- **지능 영향 없음**: thinking 블록 보존은 모델 성능에 부정적인 영향을 주지 않습니다

**중요한 고려사항:**

- **컨텍스트 사용**: thinking 블록이 컨텍스트에 유지되므로 긴 대화는 더 많은 컨텍스트 공간을 소비합니다
- **자동 동작**: 이는 Claude Opus 4.5의 기본 동작입니다—코드 변경이나 베타 헤더가 필요하지 않습니다
- **역호환성**: 이 기능을 활용하려면, 도구 사용과 마찬가지로 완전하고 수정되지 않은 thinking 블록을 API로 다시 전달하세요

<Note>
이전 모델 (Claude Sonnet 4.5, Opus 4.1 등)의 경우, 이전 턴의 thinking 블록은 계속해서 컨텍스트에서 제거됩니다. [Extended thinking with prompt caching](#extended-thinking-with-prompt-caching) 섹션에 설명된 기존 동작이 해당 모델에 적용됩니다.
</Note>

## 가격 책정

기본 요금, 캐시 쓰기, 캐시 히트 및 출력 토큰을 포함한 완전한 가격 책정 정보는 [가격 책정 페이지](/docs/ko/about-claude/pricing)를 참조하세요.

사고 과정은 다음에 대해 요금이 부과됩니다:
- thinking 중에 사용된 토큰 (출력 토큰)
- 후속 요청에 포함된 마지막 어시스턴트 턴의 thinking 블록 (입력 토큰)
- 표준 텍스트 출력 토큰

<Note>
확장 사고가 활성화되면, 이 기능을 지원하기 위해 특수 시스템 프롬프트가 자동으로 포함됩니다.
</Note>

요약된 thinking을 사용할 때:
- **입력 토큰**: 원래 요청의 토큰 (이전 턴의 thinking 토큰 제외)
- **출력 토큰 (청구됨)**: Claude가 내부적으로 생성한 원래 thinking 토큰
- **출력 토큰 (표시됨)**: 응답에서 보이는 요약된 thinking 토큰
- **청구 없음**: 요약을 생성하는 데 사용된 토큰

<Warning>
청구된 출력 토큰 수는 응답의 표시된 토큰 수와 **일치하지 않습니다**. 요약이 아닌 전체 사고 과정에 대해 청구됩니다.
</Warning>

## 확장 사고를 위한 모범 사례 및 고려사항

### thinking 예산 작업

- **예산 최적화:** 최소 예산은 1,024 토큰입니다. 최소값부터 시작하여 thinking 예산을 증분적으로 증가시켜 사용 사례에 최적의 범위를 찾을 것을 제안합니다. 더 높은 토큰 수는 더 포괄적인 추론을 가능하게 하지만 작업에 따라 수익이 감소합니다. 예산을 증가시키면 응답 품질이 향상될 수 있지만 지연 시간이 증가합니다. 중요한 작업의 경우, 다양한 설정을 테스트하여 최적의 균형을 찾으세요. thinking 예산은 엄격한 제한이 아닌 목표입니다—실제 토큰 사용량은 작업에 따라 달라질 수 있습니다.
- **시작점:** 복잡한 작업의 경우 더 큰 thinking 예산 (16k+ 토큰)부터 시작하고 필요에 따라 조정하세요.
- **큰 예산:** 32k 이상의 thinking 예산의 경우, 네트워킹 문제를 피하기 위해 [배치 처리](/docs/ko/build-with-claude/batch-processing)를 사용할 것을 권장합니다. 모델을 32k 토큰 이상으로 생각하도록 하는 요청은 시스템 타임아웃 및 열린 연결 제한에 부딪힐 수 있는 장시간 실행 요청을 발생시킵니다.
- **토큰 사용량 추적:** thinking 토큰 사용량을 모니터링하여 비용과 성능을 최적화하세요.

### 성능 고려사항

- **응답 시간:** 추론 과정에 필요한 추가 처리로 인해 잠재적으로 더 긴 응답 시간에 대비하세요. thinking 블록 생성이 전체 응답 시간을 증가시킬 수 있다는 점을 고려하세요.
- **스트리밍 요구사항:** `max_tokens`가 21,333보다 클 때 스트리밍이 필요합니다. 스트리밍할 때, thinking 및 텍스트 콘텐츠 블록이 도착할 때 모두 처리할 준비를 하세요.

### 기능 호환성

- Thinking은 `temperature` 또는 `top_k` 수정 및 [강제 도구 사용](/docs/ko/agents-and-tools/tool-use/implement-tool-use#forcing-tool-use)과 호환되지 않습니다.
- thinking이 활성화되면, `top_p`를 1과 0.95 사이의 값으로 설정할 수 있습니다.
- thinking이 활성화되면 응답을 미리 채울 수 없습니다.
- thinking 예산의 변경은 메시지를 포함하는 캐시된 프롬프트 접두사를 무효화합니다. 그러나 캐시된 시스템 프롬프트 및 도구 정의는 thinking 매개변수가 변경될 때 계속 작동합니다.

### 사용 지침

- **작업 선택:** 수학, 코딩 및 분석과 같이 단계별 추론의 이점을 얻는 특히 복잡한 작업에 확장 사고를 사용하세요.
- **컨텍스트 처리:** 이전 thinking 블록을 직접 제거할 필요가 없습니다. Claude API는 자동으로 이전 턴의 thinking 블록을 무시하며 컨텍스트 사용량을 계산할 때 포함되지 않습니다.
- **프롬프트 엔지니어링:** Claude의 thinking 기능을 최대화하려면 [확장 사고 프롬프팅 팁](/docs/ko/build-with-claude/prompt-engineering/extended-thinking-tips)을 검토하세요.

## 다음 단계

<CardGroup>
  <Card title="확장 사고 쿡북 시도해보기" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    우리의 쿡북에서 사고의 실용적인 예제를 탐색하세요.
  </Card>
  <Card title="확장 사고 프롬프팅 팁" icon="code" href="/docs/ko/build-with-claude/prompt-engineering/extended-thinking-tips">
    확장 사고를 위한 프롬프트 엔지니어링 모범 사례를 배우세요.
  </Card>
</CardGroup>