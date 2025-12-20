# 프롬프트 캐싱

프롬프트 캐싱을 사용하여 API 사용을 최적화하고 반복적인 작업의 처리 시간과 비용을 줄이는 방법을 알아봅니다.

---

프롬프트 캐싱은 프롬프트의 특정 접두사에서 재개할 수 있도록 하여 API 사용을 최적화하는 강력한 기능입니다. 이 접근 방식은 반복적인 작업이나 일관된 요소가 있는 프롬프트의 처리 시간과 비용을 크게 줄입니다.

다음은 `cache_control` 블록을 사용하여 Messages API로 프롬프트 캐싱을 구현하는 방법의 예입니다:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
      },
      {
        "type": "text",
        "text": "<the entire contents of Pride and Prejudice>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'

# 캐시 체크포인트까지 동일한 입력으로 모델을 다시 호출합니다
curl https://api.anthropic.com/v1/messages # rest of input
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        "type": "text",
        "text": "<the entire contents of 'Pride and Prejudice'>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
)
print(response.usage.model_dump_json())

# 캐시 체크포인트까지 동일한 입력으로 모델을 다시 호출합니다
response = client.messages.create(.....)
print(response.usage.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
    },
    {
      type: "text",
      text: "<the entire contents of 'Pride and Prejudice'>",
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Analyze the major themes in 'Pride and Prejudice'."
    }
  ]
});
console.log(response.usage);

// 캐시 체크포인트까지 동일한 입력으로 모델을 다시 호출합니다
const new_response = await client.messages.create(...)
console.log(new_response.usage);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class PromptCachingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                .build(),
                        TextBlockParam.builder()
                                .text("<the entire contents of 'Pride and Prejudice'>")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.usage());
    }
}
```
</CodeGroup>

```json JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

이 예제에서 "Pride and Prejudice"의 전체 텍스트는 `cache_control` 매개변수를 사용하여 캐시됩니다. 이를 통해 이 큰 텍스트를 여러 API 호출에서 재사용할 수 있으며 매번 다시 처리할 필요가 없습니다. 사용자 메시지만 변경하면 캐시된 콘텐츠를 활용하면서 책에 대한 다양한 질문을 할 수 있으므로 더 빠른 응답과 향상된 효율성을 얻을 수 있습니다.

---

## 프롬프트 캐싱의 작동 원리

캐싱이 활성화된 요청을 보낼 때:

1. 시스템은 지정된 캐시 중단점까지의 프롬프트 접두사가 최근 쿼리에서 이미 캐시되어 있는지 확인합니다.
2. 발견되면 캐시된 버전을 사용하여 처리 시간과 비용을 줄입니다.
3. 그렇지 않으면 전체 프롬프트를 처리하고 응답이 시작되면 접두사를 캐시합니다.

이는 다음과 같은 경우에 특히 유용합니다:
- 많은 예제가 있는 프롬프트
- 대량의 컨텍스트 또는 배경 정보
- 일관된 지침이 있는 반복적인 작업
- 긴 다중 턴 대화

기본적으로 캐시의 수명은 5분입니다. 캐시된 콘텐츠를 사용할 때마다 추가 비용 없이 캐시가 새로고침됩니다.

<Note>
5분이 너무 짧다면 Anthropic은 [추가 비용으로](#pricing) 1시간 캐시 기간도 제공합니다.

자세한 내용은 [1시간 캐시 기간](#1시간-캐시-기간)을 참조하세요.
</Note>

<Tip>
  **프롬프트 캐싱은 전체 접두사를 캐시합니다**

프롬프트 캐싱은 전체 프롬프트 - `tools`, `system`, `messages`(이 순서대로)를 `cache_control`로 지정된 블록까지 참조합니다.

</Tip>

---
## 가격 책정

프롬프트 캐싱은 새로운 가격 책정 구조를 도입합니다. 아래 표는 지원되는 각 모델의 백만 토큰당 가격을 보여줍니다:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
위의 표는 프롬프트 캐싱에 대한 다음 가격 책정 배수를 반영합니다:
- 5분 캐시 쓰기 토큰은 기본 입력 토큰 가격의 1.25배입니다
- 1시간 캐시 쓰기 토큰은 기본 입력 토큰 가격의 2배입니다
- 캐시 읽기 토큰은 기본 입력 토큰 가격의 0.1배입니다
</Note>

---
## 프롬프트 캐싱을 구현하는 방법

### 지원되는 모델

프롬프트 캐싱은 현재 다음에서 지원됩니다:
- Claude Opus 4.5
- Claude Opus 4.1
- Claude Opus 4
- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Sonnet 3.7 ([deprecated](/docs/ko/about-claude/model-deprecations))
- Claude Haiku 4.5
- Claude Haiku 3.5
- Claude Haiku 3
- Claude Opus 3 ([deprecated](/docs/ko/about-claude/model-deprecations))

### 프롬프트 구조화

정적 콘텐츠(도구 정의, 시스템 지침, 컨텍스트, 예제)를 프롬프트의 시작 부분에 배치합니다. `cache_control` 매개변수를 사용하여 캐싱을 위한 재사용 가능한 콘텐츠의 끝을 표시합니다.

캐시 접두사는 다음 순서로 생성됩니다: `tools`, `system`, `messages`. 이 순서는 각 수준이 이전 수준을 기반으로 하는 계층 구조를 형성합니다.

#### 자동 접두사 확인이 작동하는 방식

정적 콘텐츠의 끝에 하나의 캐시 중단점만 사용할 수 있으며, 시스템은 자동으로 캐시된 블록의 가장 긴 일치 시퀀스를 찾습니다. 이것이 어떻게 작동하는지 이해하면 캐싱 전략을 최적화하는 데 도움이 됩니다.

**세 가지 핵심 원칙:**

1. **캐시 키는 누적됩니다**: `cache_control`로 블록을 명시적으로 캐시할 때, 캐시 해시 키는 대화에서 이전의 모든 블록을 순차적으로 해싱하여 생성됩니다. 이는 각 블록의 캐시가 그 앞의 모든 콘텐츠에 따라 달라진다는 의미입니다.

2. **역순 순차 확인**: 시스템은 명시적 중단점에서 역방향으로 작업하여 이전의 각 블록을 역순으로 확인하여 캐시 히트를 확인합니다. 이는 가능한 가장 긴 캐시 히트를 얻을 수 있도록 합니다.

3. **20블록 룩백 윈도우**: 시스템은 각 명시적 `cache_control` 중단점 전에 최대 20개의 블록만 확인합니다. 일치하는 항목을 찾지 못한 채 20개의 블록을 확인한 후 확인을 중지하고 다음 명시적 중단점(있는 경우)으로 이동합니다.

**예제: 룩백 윈도우 이해하기**

30개의 콘텐츠 블록이 있는 대화를 고려하고 블록 30에만 `cache_control`을 설정합니다:

- **이전 블록에 변경 사항 없이 블록 31을 보낼 때**: 시스템은 블록 30을 확인합니다(일치!). 블록 30에서 캐시 히트를 얻으며 블록 31만 처리하면 됩니다.

- **블록 25를 수정하고 블록 31을 보낼 때**: 시스템은 블록 30 → 29 → 28... → 25(일치 없음) → 24(일치!)에서 역방향으로 확인합니다. 블록 24가 변경되지 않았으므로 블록 24에서 캐시 히트를 얻으며 블록 25-30만 재처리하면 됩니다.

- **블록 5를 수정하고 블록 31을 보낼 때**: 시스템은 블록 30 → 29 → 28... → 11(확인 #20)에서 역방향으로 확인합니다. 일치하는 항목을 찾지 못한 채 20개의 확인 후 확인을 중지합니다. 블록 5가 20블록 윈도우를 벗어났으므로 캐시 히트가 발생하지 않으며 모든 블록을 재처리해야 합니다. 그러나 블록 5에 명시적 `cache_control` 중단점을 설정했다면 시스템은 해당 중단점에서 계속 확인합니다: 블록 5(일치 없음) → 블록 4(일치!). 이를 통해 블록 4에서 캐시 히트를 얻을 수 있으며, 이는 편집 가능한 콘텐츠 전에 중단점을 배치해야 하는 이유를 보여줍니다.

**핵심 요점**: 캐시 히트 가능성을 최대화하려면 항상 대화의 끝에 명시적 캐시 중단점을 설정하세요. 또한 편집 가능할 수 있는 콘텐츠 블록 바로 앞에 중단점을 설정하여 변경이 발생할 때도 해당 섹션을 캐시할 수 있도록 하세요.

#### 여러 중단점을 사용할 때

다음을 원하는 경우 최대 4개의 캐시 중단점을 정의할 수 있습니다:
- 다양한 빈도로 변경되는 다양한 섹션을 캐시합니다(예: 도구는 거의 변경되지 않지만 컨텍스트는 매일 업데이트됨).
- 정확히 무엇이 캐시되는지에 대해 더 많은 제어를 합니다.
- 최종 중단점 전에 20개 이상의 콘텐츠 블록이 있는 콘텐츠에 대한 캐싱을 보장합니다.
- 편집 가능한 콘텐츠 전에 중단점을 배치하여 20블록 윈도우를 벗어난 변경이 발생해도 캐시 히트를 보장합니다.

<Note>
**중요한 제한사항**: 캐시 중단점 전에 20개 이상의 콘텐츠 블록이 있고 그 이전의 콘텐츠를 수정하면 더 가까운 위치에 추가 명시적 중단점을 추가하지 않는 한 캐시 히트를 얻지 못합니다.
</Note>

### 캐시 제한사항
최소 캐시 가능 프롬프트 길이는:
- Claude Opus 4.5의 경우 4096토큰
- Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([deprecated](/docs/ko/about-claude/model-deprecations)), Claude Opus 3 ([deprecated](/docs/ko/about-claude/model-deprecations))의 경우 1024토큰
- Claude Haiku 4.5의 경우 4096토큰
- Claude Haiku 3.5 및 Claude Haiku 3의 경우 2048토큰

더 짧은 프롬프트는 `cache_control`로 표시되어 있어도 캐시할 수 없습니다. 이 토큰 수보다 적은 토큰을 캐시하려는 요청은 캐싱 없이 처리됩니다. 프롬프트가 캐시되었는지 확인하려면 응답 사용 [필드](/docs/ko/build-with-claude/prompt-caching#캐시-성능-추적)를 참조하세요.

동시 요청의 경우 캐시 항목은 첫 번째 응답이 시작된 후에만 사용 가능합니다. 병렬 요청에 대한 캐시 히트가 필요한 경우 첫 번째 응답을 기다린 후 후속 요청을 보내세요.

현재 "ephemeral"이 유일하게 지원되는 캐시 유형이며, 기본적으로 5분의 수명을 가집니다.

### 캐시 중단점 비용 이해

**캐시 중단점 자체는 비용을 추가하지 않습니다.** 다음에 대해서만 청구됩니다:
- **캐시 쓰기**: 새 콘텐츠가 캐시에 기록될 때(5분 TTL의 경우 기본 입력 토큰보다 25% 더 많음)
- **캐시 읽기**: 캐시된 콘텐츠를 사용할 때(기본 입력 토큰 가격의 10%)
- **일반 입력 토큰**: 캐시되지 않은 콘텐츠의 경우

더 많은 `cache_control` 중단점을 추가해도 비용이 증가하지 않습니다 - 실제로 캐시되고 읽은 콘텐츠에 따라 동일한 금액을 지불합니다. 중단점은 단순히 어떤 섹션을 독립적으로 캐시할 수 있는지에 대한 제어를 제공합니다.

### 캐시할 수 있는 것
요청의 대부분의 블록은 `cache_control`로 캐싱을 위해 지정할 수 있습니다. 여기에는 다음이 포함됩니다:

- 도구: `tools` 배열의 도구 정의
- 시스템 메시지: `system` 배열의 콘텐츠 블록
- 텍스트 메시지: `messages.content` 배열의 콘텐츠 블록(사용자 및 어시스턴트 턴 모두)
- 이미지 및 문서: 사용자 턴의 `messages.content` 배열의 콘텐츠 블록
- 도구 사용 및 도구 결과: `messages.content` 배열의 콘텐츠 블록(사용자 및 어시스턴트 턴 모두)

이러한 각 요소는 `cache_control`로 표시하여 요청의 해당 부분에 대한 캐싱을 활성화할 수 있습니다.

### 캐시할 수 없는 것
대부분의 요청 블록을 캐시할 수 있지만 몇 가지 예외가 있습니다:

- 사고 블록은 `cache_control`로 직접 캐시할 수 없습니다. 그러나 사고 블록은 이전 어시스턴트 턴에 나타날 때 다른 콘텐츠와 함께 캐시될 수 있습니다. 이런 방식으로 캐시될 때 캐시에서 읽을 때 입력 토큰으로 계산됩니다.
- 하위 콘텐츠 블록(예: [인용](/docs/ko/build-with-claude/citations))은 직접 `cache_control`로 캐시할 수 없습니다. 대신 최상위 블록을 캐시하세요.

    인용의 경우 인용의 소스 자료로 사용되는 최상위 문서 콘텐츠 블록을 캐시할 수 있습니다. 이를 통해 인용이 참조할 문서를 캐시하여 인용과 함께 프롬프트 캐싱을 효과적으로 사용할 수 있습니다.
- 빈 텍스트 블록은 캐시할 수 없습니다.

### 캐시를 무효화하는 것

캐시된 콘텐츠에 대한 수정은 일부 또는 전체 캐시를 무효화할 수 있습니다.

[프롬프트 구조화](#프롬프트-구조화)에서 설명한 대로 캐시는 계층 구조를 따릅니다: `tools` → `system` → `messages`. 각 수준의 변경은 해당 수준과 모든 후속 수준을 무효화합니다.

다음 표는 다양한 유형의 변경으로 인해 캐시의 어느 부분이 무효화되는지 보여줍니다. ✘는 캐시가 무효화됨을 나타내고 ✓는 캐시가 유효함을 나타냅니다.

| 변경 사항 | 도구 캐시 | 시스템 캐시 | 메시지 캐시 | 영향 |
|------------|------------------|---------------|----------------|-------------|
| **도구 정의** | ✘ | ✘ | ✘ | 도구 정의(이름, 설명, 매개변수) 수정은 전체 캐시를 무효화합니다 |
| **웹 검색 토글** | ✓ | ✘ | ✘ | 웹 검색 활성화/비활성화는 시스템 프롬프트를 수정합니다 |
| **인용 토글** | ✓ | ✘ | ✘ | 인용 활성화/비활성화는 시스템 프롬프트를 수정합니다 |
| **도구 선택** | ✓ | ✓ | ✘ | `tool_choice` 매개변수 변경은 메시지 블록에만 영향을 미칩니다 |
| **이미지** | ✓ | ✓ | ✘ | 프롬프트의 어디든 이미지 추가/제거는 메시지 블록에 영향을 미칩니다 |
| **사고 매개변수** | ✓ | ✓ | ✘ | 확장 사고 설정(활성화/비활성화, 예산) 변경은 메시지 블록에 영향을 미칩니다 |
| **확장 사고 요청에 전달된 비도구 결과** | ✓ | ✓ | ✘ | 확장 사고가 활성화된 상태에서 요청에 비도구 결과가 전달되면 이전에 캐시된 모든 사고 블록이 컨텍스트에서 제거되고 해당 사고 블록을 따르는 컨텍스트의 모든 메시지가 캐시에서 제거됩니다. 자세한 내용은 [사고 블록을 사용한 캐싱](#사고-블록을-사용한-캐싱)을 참조하세요. |

### 캐시 성능 추적

이 API 응답 필드를 사용하여 캐시 성능을 모니터링하세요. 응답의 `usage` 내에 있거나 [스트리밍](/docs/ko/build-with-claude/streaming)인 경우 `message_start` 이벤트:

- `cache_creation_input_tokens`: 새 항목을 생성할 때 캐시에 기록된 토큰 수입니다.
- `cache_read_input_tokens`: 이 요청에 대해 캐시에서 검색된 토큰 수입니다.
- `input_tokens`: 캐시에서 읽거나 캐시를 생성하는 데 사용되지 않은 입력 토큰 수입니다(즉, 마지막 캐시 중단점 이후의 토큰).

<Note>
**토큰 분석 이해하기**

`input_tokens` 필드는 요청에서 **마지막 캐시 중단점 이후**에 오는 토큰만 나타냅니다 - 보낸 모든 입력 토큰이 아닙니다.

총 입력 토큰을 계산하려면:
```
total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
```

**공간 설명:**
- `cache_read_input_tokens` = 중단점 전의 이미 캐시된 토큰(읽기)
- `cache_creation_input_tokens` = 중단점 전의 지금 캐시되는 토큰(쓰기)
- `input_tokens` = 마지막 중단점 이후의 토큰(캐시 대상이 아님)

**예제:** 캐시된 콘텐츠 100,000토큰(캐시에서 읽음), 캐시되는 새 콘텐츠 0토큰, 사용자 메시지 50토큰(캐시 중단점 이후)이 있는 요청이 있는 경우:
- `cache_read_input_tokens`: 100,000
- `cache_creation_input_tokens`: 0
- `input_tokens`: 50
- **처리된 총 입력 토큰**: 100,050토큰

이는 캐싱을 효과적으로 사용할 때 `input_tokens`가 일반적으로 총 입력보다 훨씬 작으므로 비용과 속도 제한을 이해하는 데 중요합니다.
</Note>

### 효과적인 캐싱을 위한 모범 사례

프롬프트 캐싱 성능을 최적화하려면:

- 시스템 지침, 배경 정보, 큰 컨텍스트 또는 빈번한 도구 정의와 같은 안정적이고 재사용 가능한 콘텐츠를 캐시합니다.
- 캐시된 콘텐츠를 최상의 성능을 위해 프롬프트의 시작 부분에 배치합니다.
- 캐시 중단점을 전략적으로 사용하여 다양한 캐시 가능 접두사 섹션을 분리합니다.
- 캐시 히트율을 최대화하기 위해 대화의 끝과 편집 가능한 콘텐츠 바로 앞에 캐시 중단점을 설정합니다. 특히 20개 이상의 콘텐츠 블록이 있는 프롬프트로 작업할 때 중요합니다.
- 캐시 히트율을 정기적으로 분석하고 필요에 따라 전략을 조정합니다.

### 다양한 사용 사례에 맞게 최적화

시나리오에 맞게 프롬프트 캐싱 전략을 조정합니다:

- 대화형 에이전트: 특히 긴 지침이나 업로드된 문서가 있는 확장된 대화의 비용과 지연 시간을 줄입니다.
- 코딩 어시스턴트: 관련 섹션이나 코드베이스의 요약 버전을 프롬프트에 유지하여 자동 완성 및 코드베이스 Q&A를 개선합니다.
- 대규모 문서 처리: 이미지를 포함한 완전한 장문 자료를 프롬프트에 통합하여 응답 지연 시간을 증가시키지 않습니다.
- 상세한 지침 세트: 광범위한 지침, 절차 및 예제 목록을 공유하여 Claude의 응답을 미세 조정합니다. 개발자는 종종 프롬프트에 한두 개의 예제를 포함하지만 프롬프트 캐싱을 사용하면 20개 이상의 다양한 고품질 답변 예제를 포함하여 훨씬 더 나은 성능을 얻을 수 있습니다.
- 에이전트 도구 사용: 여러 도구 호출과 반복적인 코드 변경이 포함된 시나리오의 성능을 향상시킵니다. 각 단계는 일반적으로 새로운 API 호출이 필요합니다.
- 책, 논문, 문서, 팟캐스트 필사본 및 기타 장문 콘텐츠와 대화: 전체 문서를 프롬프트에 포함하고 사용자가 질문하도록 하여 모든 지식 기반을 활성화합니다.

### 일반적인 문제 해결

예상치 못한 동작이 발생하는 경우:

- 캐시된 섹션이 동일하고 호출 전체에서 동일한 위치에 cache_control로 표시되어 있는지 확인합니다
- 호출이 캐시 수명(기본적으로 5분) 내에 이루어지는지 확인합니다
- `tool_choice` 및 이미지 사용이 호출 간에 일관성 있게 유지되는지 확인합니다
- 최소 토큰 수를 캐시하고 있는지 확인합니다
- 시스템은 이전 콘텐츠 블록 경계에서 자동으로 캐시 히트를 확인합니다(중단점 전 약 20개 블록). 20개 이상의 콘텐츠 블록이 있는 프롬프트의 경우 모든 콘텐츠를 캐시할 수 있도록 프롬프트의 앞부분에 추가 `cache_control` 매개변수가 필요할 수 있습니다
- `tool_use` 콘텐츠 블록의 키가 일부 언어(예: Swift, Go)에서 JSON 변환 중에 키 순서를 무작위화하여 캐시를 깨뜨리므로 안정적인 순서를 유지하는지 확인합니다

<Note>
`tool_choice` 또는 프롬프트의 어디든 이미지의 존재/부재에 대한 변경은 캐시를 무효화하여 새로운 캐시 항목을 생성해야 합니다. 캐시 무효화에 대한 자세한 내용은 [캐시를 무효화하는 것](#캐시를-무효화하는-것)을 참조하세요.
</Note>

### 사고 블록을 사용한 캐싱

[확장 사고](/docs/ko/build-with-claude/extended-thinking)와 함께 프롬프트 캐싱을 사용할 때 사고 블록은 특별한 동작을 합니다:

**다른 콘텐츠와 함께 자동 캐싱**: 사고 블록은 `cache_control`로 명시적으로 표시할 수 없지만 도구 결과를 사용하여 후속 API 호출을 할 때 요청 콘텐츠의 일부로 캐시됩니다. 이는 도구 사용 중에 사고 블록을 다시 전달하여 대화를 계속할 때 일반적으로 발생합니다.

**입력 토큰 계산**: 사고 블록이 캐시에서 읽을 때 사용 메트릭에서 입력 토큰으로 계산됩니다. 이는 비용 계산 및 토큰 예산 책정에 중요합니다.

**캐시 무효화 패턴**:
- 도구 결과만 사용자 메시지로 제공될 때 캐시가 유효합니다
- 비도구 결과 사용자 콘텐츠가 추가될 때 캐시가 무효화되어 모든 이전 사고 블록이 제거됩니다
- 이 캐싱 동작은 명시적 `cache_control` 마커 없이도 발생합니다

캐시 무효화에 대한 자세한 내용은 [캐시를 무효화하는 것](#캐시를-무효화하는-것)을 참조하세요.

**도구 사용 예제**:
```
요청 1: 사용자: "파리의 날씨는?"
응답: [thinking_block_1] + [tool_use block 1]

요청 2:
사용자: ["파리의 날씨는?"],
어시스턴트: [thinking_block_1] + [tool_use block 1],
사용자: [tool_result_1, cache=True]
응답: [thinking_block_2] + [text block 2]
# 요청 2는 요청 콘텐츠를 캐시합니다(응답이 아님)
# 캐시에는 다음이 포함됩니다: 사용자 메시지, thinking_block_1, tool_use block 1, tool_result_1

요청 3:
사용자: ["파리의 날씨는?"],
어시스턴트: [thinking_block_1] + [tool_use block 1],
사용자: [tool_result_1, cache=True],
어시스턴트: [thinking_block_2] + [text block 2],
사용자: [텍스트 응답, cache=True]
# 비도구 결과 사용자 블록은 모든 사고 블록을 무시하게 합니다
# 이 요청은 사고 블록이 없었던 것처럼 처리됩니다
```

비도구 결과 사용자 블록이 포함되면 새로운 어시스턴트 루프를 지정하고 이전의 모든 사고 블록이 컨텍스트에서 제거됩니다.

자세한 내용은 [확장 사고 문서](/docs/ko/build-with-claude/extended-thinking#사고-블록-캐싱-동작-이해)를 참조하세요.

---
## 캐시 저장소 및 공유

- **조직 격리**: 캐시는 조직 간에 격리됩니다. 동일한 프롬프트를 사용하더라도 다양한 조직은 캐시를 공유하지 않습니다.

- **정확한 일치**: 캐시 히트는 캐시 제어로 표시된 블록까지 포함하여 모든 텍스트와 이미지를 포함한 100% 동일한 프롬프트 세그먼트가 필요합니다.

- **출력 토큰 생성**: 프롬프트 캐싱은 출력 토큰 생성에 영향을 주지 않습니다. 받는 응답은 프롬프트 캐싱을 사용하지 않은 경우와 동일합니다.

---
## 1시간 캐시 기간

5분이 너무 짧다면 Anthropic은 [추가 비용으로](#가격-책정) 1시간 캐시 기간도 제공합니다.

확장 캐시를 사용하려면 다음과 같이 `cache_control` 정의에 `ttl`을 포함합니다:
```json
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

응답에는 다음과 같은 상세한 캐시 정보가 포함됩니다:
```json
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,

        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

현재 `cache_creation_input_tokens` 필드는 `cache_creation` 객체의 값의 합과 같습니다.

### 1시간 캐시를 사용할 때

5분마다 사용되는 프롬프트(즉, 시스템 프롬프트가 5분마다 더 자주 사용됨)가 있는 경우 5분 캐시를 계속 사용하세요. 추가 비용 없이 계속 새로고침됩니다.

1시간 캐시는 다음 시나리오에서 가장 잘 사용됩니다:
- 5분보다 자주 사용되지 않지만 1시간보다 더 자주 사용될 가능성이 있는 프롬프트가 있는 경우. 예를 들어 에이전트 측 에이전트가 5분 이상 걸리거나 사용자와의 긴 채팅 대화를 저장하고 일반적으로 사용자가 다음 5분 내에 응답하지 않을 것으로 예상하는 경우.
- 지연 시간이 중요하고 후속 프롬프트가 5분 이후에 전송될 수 있는 경우.
- 속도 제한 활용을 개선하려는 경우. 캐시 히트는 속도 제한에 대해 공제되지 않습니다.

<Note>
5분 및 1시간 캐시는 지연 시간과 관련하여 동일하게 동작합니다. 일반적으로 긴 문서에 대해 개선된 첫 토큰까지의 시간을 볼 수 있습니다.
</Note>

### 다양한 TTL 혼합

동일한 요청에서 1시간 및 5분 캐시 제어를 모두 사용할 수 있지만 중요한 제약이 있습니다: 더 긴 TTL을 가진 캐시 항목은 더 짧은 TTL보다 먼저 나타나야 합니다(즉, 1시간 캐시 항목은 모든 5분 캐시 항목 전에 나타나야 함).

TTL을 혼합할 때 프롬프트에서 세 가지 청구 위치를 결정합니다:
1. 위치 `A`: 가장 높은 캐시 히트의 토큰 수(히트가 없으면 0).
2. 위치 `B`: `A` 이후의 가장 높은 1시간 `cache_control` 블록의 토큰 수(없으면 `A`와 같음).
3. 위치 `C`: 마지막 `cache_control` 블록의 토큰 수.

<Note>
`B` 및/또는 `C`가 `A`보다 크면 `A`가 가장 높은 캐시 히트이므로 반드시 캐시 미스입니다.
</Note>

다음에 대해 청구됩니다:
1. `A`에 대한 캐시 읽기 토큰.
2. `(B - A)`에 대한 1시간 캐시 쓰기 토큰.
3. `(C - B)`에 대한 5분 캐시 쓰기 토큰.

다음은 3가지 예제입니다. 이는 3개의 요청의 입력 토큰을 나타내며, 각각은 다양한 캐시 히트와 캐시 미스를 가집니다. 각각은 색상 상자에 표시된 결과로 다양한 가격 책정을 계산합니다.
![TTL 혼합 다이어그램](/docs/images/prompt-cache-mixed-ttl.svg)

---

## 프롬프트 캐싱 예제

프롬프트 캐싱을 시작하는 데 도움이 되도록 상세한 예제와 모범 사례가 포함된 [프롬프트 캐싱 쿡북](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb)을 준비했습니다.

아래에는 다양한 프롬프트 캐싱 패턴을 보여주는 여러 코드 스니펫이 포함되어 있습니다. 이 예제들은 다양한 시나리오에서 캐싱을 구현하는 방법을 보여주며, 이 기능의 실제 적용을 이해하는 데 도움이 됩니다:

<section title="대규모 컨텍스트 캐싱 예제">

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
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
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
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing legal documents."
    },
    {
        "type": "text",
        "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
        "cache_control": {"type": "ephemeral"}
    }
  ],
  messages: [
    {
        "role": "user",
        "content": "What are the key terms and conditions in this agreement?"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class LegalDocumentAnalysisExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing legal documents.")
                                .build(),
                        TextBlockParam.builder()
                                .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("What are the key terms and conditions in this agreement?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>
이 예제는 기본 프롬프트 캐싱 사용법을 보여주며, 법적 계약서의 전체 텍스트를 접두사로 캐싱하면서 사용자 지시사항은 캐싱하지 않습니다.

첫 번째 요청의 경우:
- `input_tokens`: 사용자 메시지만의 토큰 수
- `cache_creation_input_tokens`: 법적 문서를 포함한 전체 시스템 메시지의 토큰 수
- `cache_read_input_tokens`: 0 (첫 요청에서 캐시 히트 없음)

캐시 수명 내의 후속 요청의 경우:
- `input_tokens`: 사용자 메시지만의 토큰 수
- `cache_creation_input_tokens`: 0 (새로운 캐시 생성 없음)
- `cache_read_input_tokens`: 전체 캐시된 시스템 메시지의 토큰 수

</section>
<section title="도구 정의 캐싱">

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
                        "description": "The unit of temperature, either celsius or fahrenheit"
                    }
                },
                "required": ["location"]
            }
        },
        # many more tools
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
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather and time in New York?"
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
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        # many more tools
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
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
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
            },
        },
        // many more tools
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
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages: [
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class ToolsWithCacheControlExample {

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
                                "description", "The unit of temperature, either celsius or fahrenheit"
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
                .model(Model.CLAUDE_OPUS_4_20250514)
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
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                .addUserMessage("What is the weather and time in New York?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

이 예제에서는 도구 정의 캐싱을 보여줍니다.

`cache_control` 매개변수는 최종 도구(`get_time`)에 배치되어 모든 도구를 정적 접두사의 일부로 지정합니다.

이는 `get_weather`를 포함한 `get_time` 이전에 정의된 다른 도구들을 포함한 모든 도구 정의가 단일 접두사로 캐시된다는 의미입니다.

이 접근 방식은 여러 요청에서 재사용하고 싶은 일관된 도구 세트가 있을 때 유용하며, 매번 다시 처리할 필요가 없습니다.

첫 번째 요청의 경우:
- `input_tokens`: 사용자 메시지의 토큰 수
- `cache_creation_input_tokens`: 모든 도구 정의 및 시스템 프롬프트의 토큰 수
- `cache_read_input_tokens`: 0 (첫 요청에서 캐시 히트 없음)

캐시 수명 내의 후속 요청의 경우:
- `input_tokens`: 사용자 메시지의 토큰 수
- `cache_creation_input_tokens`: 0 (새로운 캐시 생성 없음)
- `cache_read_input_tokens`: 모든 캐시된 도구 정의 및 시스템 프롬프트의 토큰 수

</section>

<section title="다중 턴 대화 계속하기">

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
    "system": [
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
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
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        # ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        // ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class ConversationWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Create ephemeral system prompt
        TextBlockParam systemPrompt = TextBlockParam.builder()
                .text("...long system prompt")
                .cacheControl(CacheControlEphemeral.builder().build())
                .build();

        // Create message params
        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(systemPrompt))
                // First user message (without cache control)
                .addUserMessage("Hello, can you tell me more about the solar system?")
                // Assistant response
                .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                // Second user message (with cache control)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Good to know.")
                                .build()),
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Tell me more about Mars.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

이 예제에서는 다중 턴 대화에서 프롬프트 캐싱을 사용하는 방법을 보여줍니다.

각 턴 동안 최종 메시지의 최종 블록을 `cache_control`로 표시하여 대화를 증분식으로 캐시할 수 있습니다. 시스템은 자동으로 후속 메시지에 대해 가장 긴 이전 캐시된 블록 시퀀스를 조회하고 사용합니다. 즉, 이전에 `cache_control` 블록으로 표시된 블록은 나중에 이 표시가 없어도 5분 이내에 히트되면 여전히 캐시 히트(및 캐시 새로고침!)로 간주됩니다.

또한 `cache_control` 매개변수가 시스템 메시지에 배치되어 있음을 주목하세요. 이는 캐시에서 제거되더라도(5분 이상 사용되지 않은 후) 다음 요청에서 다시 캐시에 추가되도록 하기 위함입니다.

이 접근 방식은 동일한 정보를 반복적으로 처리하지 않고 진행 중인 대화에서 컨텍스트를 유지하는 데 유용합니다.

이것이 올바르게 설정되면 각 요청의 사용 응답에서 다음을 볼 수 있습니다:
- `input_tokens`: 새로운 사용자 메시지의 토큰 수 (최소화됨)
- `cache_creation_input_tokens`: 새로운 어시스턴트 및 사용자 턴의 토큰 수
- `cache_read_input_tokens`: 이전 턴까지의 대화의 토큰 수

</section>

<section title="모두 함께: 여러 캐시 분기점">

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
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "system": [
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
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
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    system=[
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [
        {
            name: "search_documents",
            description: "Search through the knowledge base",
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query"
                    }
                },
                required: ["query"]
            }
        },
        {
            name: "get_document",
            description: "Retrieve a specific document by ID",
            input_schema: {
                type: "object",
                properties: {
                    doc_id: {
                        type: "string",
                        description: "Document ID"
                    }
                },
                required: ["doc_id"]
            },
            cache_control: { type: "ephemeral" }
        }
    ],
    system: [
        {
            type: "text",
            text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            cache_control: { type: "ephemeral" }
        }
    ],
    messages: [
        {
            role: "user",
            content: "Can you search for information about Mars rovers?"
        },
        {
            role: "assistant",
            content: [
                {
                    type: "tool_use",
                    id: "tool_1",
                    name: "search_documents",
                    input: { query: "Mars rovers" }
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "tool_1",
                    content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Yes, please tell me about the Perseverance rover specifically.",
                    cache_control: { type: "ephemeral" }
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlockParam;

public class MultipleCacheBreakpointsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Search tool schema
        InputSchema searchSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "query", Map.of(
                                "type", "string",
                                "description", "Search query"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                .build();

        // Get document tool schema
        InputSchema getDocSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "doc_id", Map.of(
                                "type", "string",
                                "description", "Document ID"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                // Tools with cache control on the last one
                .addTool(Tool.builder()
                        .name("search_documents")
                        .description("Search through the knowledge base")
                        .inputSchema(searchSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_document")
                        .description("Retrieve a specific document by ID")
                        .inputSchema(getDocSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                // System prompts with cache control on instructions and context separately
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build(),
                        TextBlockParam.builder()
                                .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                // Conversation history
                .addUserMessage("Can you search for information about Mars rovers?")
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                .id("tool_1")
                                .name("search_documents")
                                .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("tool_1")
                                .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                .build())
                ))
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Yes, please tell me about the Perseverance rover specifically.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

이 포괄적인 예제는 프롬프트의 다양한 부분을 최적화하기 위해 4가지 사용 가능한 캐시 분기점을 모두 사용하는 방법을 보여줍니다:

1. **도구 캐시** (캐시 분기점 1): 마지막 도구 정의의 `cache_control` 매개변수는 모든 도구 정의를 캐시합니다.

2. **재사용 가능한 지시사항 캐시** (캐시 분기점 2): 시스템 프롬프트의 정적 지시사항은 별도로 캐시됩니다. 이러한 지시사항은 요청 간에 거의 변경되지 않습니다.

3. **RAG 컨텍스트 캐시** (캐시 분기점 3): 지식 기반 문서는 독립적으로 캐시되어 도구 또는 지시사항 캐시를 무효화하지 않고 RAG 문서를 업데이트할 수 있습니다.

4. **대화 기록 캐시** (캐시 분기점 4): 어시스턴트의 응답은 `cache_control`로 표시되어 대화가 진행됨에 따라 증분식 캐싱을 활성화합니다.

이 접근 방식은 최대 유연성을 제공합니다:
- 최종 사용자 메시지만 업데이트하면 4개의 캐시 세그먼트가 모두 재사용됩니다
- RAG 문서를 업데이트하지만 동일한 도구와 지시사항을 유지하면 처음 두 캐시 세그먼트가 재사용됩니다
- 대화를 변경하지만 동일한 도구, 지시사항 및 문서를 유지하면 처음 세 세그먼트가 재사용됩니다
- 각 캐시 분기점은 애플리케이션에서 변경되는 내용에 따라 독립적으로 무효화될 수 있습니다

첫 번째 요청의 경우:
- `input_tokens`: 최종 사용자 메시지의 토큰 수
- `cache_creation_input_tokens`: 모든 캐시된 세그먼트의 토큰 수 (도구 + 지시사항 + RAG 문서 + 대화 기록)
- `cache_read_input_tokens`: 0 (캐시 히트 없음)

새로운 사용자 메시지만 있는 후속 요청의 경우:
- `input_tokens`: 새로운 사용자 메시지만의 토큰 수
- `cache_creation_input_tokens`: 대화 기록에 추가된 새로운 토큰
- `cache_read_input_tokens`: 모든 이전 캐시된 토큰 (도구 + 지시사항 + RAG 문서 + 이전 대화)

이 패턴은 특히 다음에 강력합니다:
- 대규모 문서 컨텍스트가 있는 RAG 애플리케이션
- 여러 도구를 사용하는 에이전트 시스템
- 컨텍스트를 유지해야 하는 장기 실행 대화
- 프롬프트의 다양한 부분을 독립적으로 최적화해야 하는 애플리케이션

</section>

---
## FAQ

  <section title="여러 캐시 분기점이 필요한가요, 아니면 끝에 하나만 있으면 충분한가요?">

    **대부분의 경우 정적 콘텐츠 끝에 단일 캐시 분기점이 충분합니다.** 시스템은 자동으로 모든 이전 콘텐츠 블록 경계(분기점 이전의 최대 20개 블록)에서 캐시 히트를 확인하고 가장 긴 일치하는 캐시된 블록 시퀀스를 사용합니다.

    다음의 경우에만 여러 분기점이 필요합니다:
    - 원하는 캐시 지점 이전에 20개 이상의 콘텐츠 블록이 있는 경우
    - 다양한 빈도로 업데이트되는 섹션을 독립적으로 캐시하려는 경우
    - 비용 최적화를 위해 캐시되는 내용을 명시적으로 제어해야 하는 경우

    예: 시스템 지시사항(거의 변경되지 않음)과 RAG 컨텍스트(매일 변경)가 있는 경우 두 개의 분기점을 사용하여 별도로 캐시할 수 있습니다.
  
</section>

  <section title="캐시 분기점이 추가 비용을 발생시키나요?">

    아니요, 캐시 분기점 자체는 무료입니다. 다음에 대해서만 비용을 지불합니다:
    - 캐시에 콘텐츠 쓰기 (5분 TTL의 기본 입력 토큰보다 25% 더 많음)
    - 캐시에서 읽기 (기본 입력 토큰 가격의 10%)
    - 캐시되지 않은 콘텐츠의 일반 입력 토큰

    분기점의 수는 가격 책정에 영향을 주지 않습니다. 캐시된 콘텐츠의 양과 읽은 양만 중요합니다.
  
</section>

  <section title="사용 필드에서 총 입력 토큰을 계산하려면 어떻게 해야 하나요?">

    사용 응답에는 총 입력을 나타내는 3개의 별도 입력 토큰 필드가 포함됩니다:

    ```
    total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
    ```

    - `cache_read_input_tokens`: 캐시에서 검색된 토큰 (캐시 분기점 이전의 캐시된 모든 것)
    - `cache_creation_input_tokens`: 캐시 분기점에 쓰여지는 새로운 토큰
    - `input_tokens`: 마지막 캐시 분기점 이후의 토큰으로 캐시되지 않음

    **중요:** `input_tokens`는 모든 입력 토큰을 나타내지 않습니다. 마지막 캐시 분기점 이후의 부분만 나타냅니다. 캐시된 콘텐츠가 있으면 `input_tokens`는 일반적으로 총 입력보다 훨씬 작습니다.

    **예:** 200K 토큰 문서가 캐시되고 50 토큰 사용자 질문이 있는 경우:
    - `cache_read_input_tokens`: 200,000
    - `cache_creation_input_tokens`: 0
    - `input_tokens`: 50
    - **총합**: 200,050 토큰

    이 분석은 비용과 속도 제한 사용을 모두 이해하는 데 중요합니다. 자세한 내용은 [캐시 성능 추적](#캐시-성능-추적)을 참조하세요.
  
</section>

  <section title="캐시 수명은 얼마나 되나요?">

    캐시의 기본 최소 수명(TTL)은 5분입니다. 이 수명은 캐시된 콘텐츠가 사용될 때마다 새로고침됩니다.

    5분이 너무 짧다면 Anthropic은 [1시간 캐시 TTL](#1시간-캐시-지속-시간)도 제공합니다.
  
</section>

  <section title="몇 개의 캐시 분기점을 사용할 수 있나요?">

    프롬프트에서 최대 4개의 캐시 분기점(`cache_control` 매개변수 사용)을 정의할 수 있습니다.
  
</section>

  <section title="프롬프트 캐싱이 모든 모델에서 사용 가능한가요?">

    아니요, 프롬프트 캐싱은 현재 Claude Opus 4.5, Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([지원 중단](/docs/ko/about-claude/model-deprecations)), Claude Haiku 4.5, Claude Haiku 3.5, Claude Haiku 3 및 Claude Opus 3 ([지원 중단](/docs/ko/about-claude/model-deprecations))에서만 사용 가능합니다.
  
</section>

  <section title="프롬프트 캐싱이 확장 사고와 어떻게 작동하나요?">

    캐시된 시스템 프롬프트 및 도구는 사고 매개변수가 변경될 때 재사용됩니다. 그러나 사고 변경(활성화/비활성화 또는 예산 변경)은 메시지 콘텐츠가 있는 이전 캐시된 프롬프트 접두사를 무효화합니다.

    캐시 무효화에 대한 자세한 내용은 [캐시를 무효화하는 것](#캐시를-무효화하는-것)을 참조하세요.

    확장 사고에 대한 자세한 내용(도구 사용 및 프롬프트 캐싱과의 상호 작용 포함)은 [확장 사고 설명서](/docs/ko/build-with-claude/extended-thinking#확장-사고-및-프롬프트-캐싱)를 참조하세요.
  
</section>

  <section title="프롬프트 캐싱을 어떻게 활성화하나요?">

    프롬프트 캐싱을 활성화하려면 API 요청에 최소 하나의 `cache_control` 분기점을 포함하세요.
  
</section>

  <section title="프롬프트 캐싱을 다른 API 기능과 함께 사용할 수 있나요?">

    예, 프롬프트 캐싱은 도구 사용 및 비전 기능과 같은 다른 API 기능과 함께 사용할 수 있습니다. 그러나 프롬프트에서 이미지의 존재 여부를 변경하거나 도구 사용 설정을 수정하면 캐시가 손상됩니다.

    캐시 무효화에 대한 자세한 내용은 [캐시를 무효화하는 것](#캐시를-무효화하는-것)을 참조하세요.
  
</section>

  <section title="프롬프트 캐싱이 가격 책정에 어떻게 영향을 미치나요?">

    프롬프트 캐싱은 캐시 쓰기가 기본 입력 토큰보다 25% 더 비싸고 캐시 히트가 기본 입력 토큰 가격의 10%만 비용이 드는 새로운 가격 책정 구조를 도입합니다.
  
</section>

  <section title="캐시를 수동으로 지울 수 있나요?">

    현재 캐시를 수동으로 지울 수 있는 방법이 없습니다. 캐시된 접두사는 최소 5분의 비활성 후 자동으로 만료됩니다.
  
</section>

  <section title="캐싱 전략의 효과를 어떻게 추적할 수 있나요?">

    API 응답의 `cache_creation_input_tokens` 및 `cache_read_input_tokens` 필드를 사용하여 캐시 성능을 모니터링할 수 있습니다.
  
</section>

  <section title="캐시를 무효화하는 것은 무엇인가요?">

    캐시 무효화에 대한 자세한 내용은 [캐시를 무효화하는 것](#캐시를-무효화하는-것)을 참조하세요. 새 캐시 항목을 만들어야 하는 변경 사항 목록이 포함되어 있습니다.
  
</section>

  <section title="프롬프트 캐싱이 개인정보 보호 및 데이터 분리를 어떻게 처리하나요?">

프롬프트 캐싱은 강력한 개인정보 보호 및 데이터 분리 조치로 설계되었습니다:

1. 캐시 키는 캐시 제어 지점까지의 프롬프트의 암호화 해시를 사용하여 생성됩니다. 이는 동일한 프롬프트가 있는 요청만 특정 캐시에 액세스할 수 있음을 의미합니다.

2. 캐시는 조직별로 구분됩니다. 동일한 조직 내의 사용자는 동일한 프롬프트를 사용하면 동일한 캐시에 액세스할 수 있지만, 캐시는 동일한 프롬프트인 경우에도 다른 조직 간에 공유되지 않습니다.

3. 캐싱 메커니즘은 각 고유한 대화 또는 컨텍스트의 무결성과 개인정보 보호를 유지하도록 설계되었습니다.

4. 프롬프트의 어디에나 `cache_control`을 사용하는 것이 안전합니다. 비용 효율성을 위해 매우 변수적인 부분(예: 사용자의 임의 입력)을 캐싱에서 제외하는 것이 좋습니다.

이러한 조치는 프롬프트 캐싱이 성능 이점을 제공하면서 데이터 개인정보 보호 및 보안을 유지하도록 합니다.
  
</section>
  <section title="배치 API와 함께 프롬프트 캐싱을 사용할 수 있나요?">

    예, [배치 API](/docs/ko/build-with-claude/batch-processing) 요청과 함께 프롬프트 캐싱을 사용할 수 있습니다. 그러나 비동기 배치 요청은 동시에 임의의 순서로 처리될 수 있으므로 캐시 히트는 최선의 노력 기준으로 제공됩니다.

    [1시간 캐시](#1시간-캐시-지속-시간)는 캐시 히트를 개선하는 데 도움이 될 수 있습니다. 가장 비용 효율적인 사용 방법은 다음과 같습니다:
    - 공유 접두사가 있는 메시지 요청 세트를 수집합니다.
    - 이 공유 접두사와 1시간 캐시 블록이 있는 단일 요청만 포함하는 배치 요청을 제출합니다. 이것은 1시간 캐시에 기록됩니다.
    - 완료되는 즉시 나머지 요청을 제출합니다. 완료 시기를 알기 위해 작업을 모니터링해야 합니다.

    이는 일반적으로 배치 요청이 5분에서 1시간 사이에 완료되는 것이 일반적이기 때문에 5분 캐시를 사용하는 것보다 낫습니다. 이러한 캐시 히트율을 개선하고 이 프로세스를 더 간단하게 만드는 방법을 고려 중입니다.
  
</section>
  <section title="Python에서 `AttributeError: 'Beta' object has no attribute 'prompt_caching'` 오류가 표시되는 이유는 무엇인가요?">

  이 오류는 일반적으로 SDK를 업그레이드했거나 오래된 코드 예제를 사용하고 있을 때 나타납니다. 프롬프트 캐싱은 이제 일반적으로 사용 가능하므로 더 이상 베타 접두사가 필요하지 않습니다. 다음 대신:
    <CodeGroup>
      ```python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>
    다음을 사용하세요:
    <CodeGroup>
      ```python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  
</section>
  <section title="TypeScript에서 'TypeError: Cannot read properties of undefined (reading 'messages')'가 표시되는 이유는 무엇인가요?">

  이 오류는 일반적으로 SDK를 업그레이드했거나 오래된 코드 예제를 사용하고 있을 때 나타납니다. 프롬프트 캐싱은 이제 일반적으로 사용 가능하므로 더 이상 베타 접두사가 필요하지 않습니다. 다음 대신:

      ```typescript TypeScript
      client.beta.promptCaching.messages.create(...)
      ```

      다음을 사용하세요:

      ```typescript
      client.messages.create(...)
      ```
  
</section>