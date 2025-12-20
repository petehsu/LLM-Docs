# 배치 처리

대량의 요청을 효율적으로 처리하기 위한 배치 처리 방식에 대해 알아봅니다.

---

배치 처리는 대량의 요청을 효율적으로 처리하기 위한 강력한 방식입니다. 요청을 한 번에 하나씩 처리하고 즉시 응답을 받는 대신, 배치 처리를 사용하면 여러 요청을 함께 제출하여 비동기적으로 처리할 수 있습니다. 이 패턴은 다음과 같은 경우에 특히 유용합니다:

- 대량의 데이터를 처리해야 하는 경우
- 즉시 응답이 필요하지 않은 경우
- 비용 효율성을 최적화하려는 경우
- 대규모 평가 또는 분석을 실행하는 경우

Message Batches API는 이 패턴의 첫 번째 구현입니다.

---

# Message Batches API

Message Batches API는 [Messages](/docs/ko/api/messages) 요청의 대량을 비동기적으로 처리하는 강력하고 비용 효율적인 방식입니다. 이 방식은 즉시 응답이 필요하지 않은 작업에 적합하며, 대부분의 배치는 1시간 이내에 완료되면서 비용을 50% 절감하고 처리량을 증가시킵니다.

이 가이드 외에도 [API 참조를 직접 살펴볼 수 있습니다](/docs/ko/api/creating-message-batches).

## Message Batches API의 작동 방식

Message Batches API에 요청을 보낼 때:

1. 시스템은 제공된 Messages 요청으로 새로운 Message Batch를 생성합니다.
2. 배치는 비동기적으로 처리되며, 각 요청은 독립적으로 처리됩니다.
3. 배치의 상태를 폴링하고 모든 요청의 처리가 끝났을 때 결과를 검색할 수 있습니다.

이는 다음과 같이 즉시 결과가 필요하지 않은 대량 작업에 특히 유용합니다:
- 대규모 평가: 수천 개의 테스트 케이스를 효율적으로 처리합니다.
- 콘텐츠 조정: 대량의 사용자 생성 콘텐츠를 비동기적으로 분석합니다.
- 데이터 분석: 대규모 데이터셋에 대한 인사이트 또는 요약을 생성합니다.
- 대량 콘텐츠 생성: 다양한 목적(예: 제품 설명, 기사 요약)을 위해 대량의 텍스트를 생성합니다.

### 배치 제한 사항
- Message Batch는 100,000개의 Message 요청 또는 256MB 크기 중 먼저 도달하는 것으로 제한됩니다.
- 각 배치는 최대한 빠르게 처리되며, 대부분의 배치는 1시간 이내에 완료됩니다. 모든 메시지가 완료되거나 24시간이 경과한 후 중 먼저 도달할 때 배치 결과에 액세스할 수 있습니다. 처리가 24시간 이내에 완료되지 않으면 배치는 만료됩니다.
- 배치 결과는 생성 후 29일 동안 사용 가능합니다. 그 이후에는 배치를 계속 볼 수 있지만 결과는 더 이상 다운로드할 수 없습니다.
- 배치는 [Workspace](/settings/workspaces)로 범위가 지정됩니다. API 키가 속한 Workspace 내에서 생성된 모든 배치와 해당 결과를 볼 수 있습니다.
- 속도 제한은 Batches API HTTP 요청과 처리 대기 중인 배치 내의 요청 수에 모두 적용됩니다. [Message Batches API 속도 제한](/docs/ko/api/rate-limits#message-batches-api)을 참조하세요. 또한 현재 수요와 요청 볼륨에 따라 처리 속도를 낮출 수 있습니다. 이 경우 24시간 후 만료되는 요청이 더 많이 표시될 수 있습니다.
- 높은 처리량과 동시 처리로 인해 배치는 Workspace의 구성된 [지출 한도](/settings/limits)를 약간 초과할 수 있습니다.

### 지원되는 모델

모든 [활성 모델](/docs/ko/about-claude/models/overview)은 Message Batches API를 지원합니다.

### 배치 처리 가능한 항목
Messages API에 대해 수행할 수 있는 모든 요청을 배치에 포함할 수 있습니다. 여기에는 다음이 포함됩니다:

- Vision
- Tool use
- System messages
- Multi-turn conversations
- 모든 베타 기능

배치의 각 요청은 독립적으로 처리되므로 단일 배치 내에서 다양한 유형의 요청을 혼합할 수 있습니다.

<Tip>
배치는 5분 이상 처리될 수 있으므로, 배치 처리 시 공유 컨텍스트를 사용할 때 더 나은 캐시 히트율을 위해 프롬프트 캐싱과 함께 [1시간 캐시 지속 시간](/docs/ko/build-with-claude/prompt-caching#1-hour-cache-duration)을 사용하는 것을 고려하세요.
</Tip>

---
## 가격 책정

Batches API는 상당한 비용 절감을 제공합니다. 모든 사용량은 표준 API 가격의 50%로 청구됩니다.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

---
## Message Batches API 사용 방법

### 배치 준비 및 생성

Message Batch는 Message를 생성하기 위한 요청 목록으로 구성됩니다. 개별 요청의 형태는 다음으로 구성됩니다:
- Messages 요청을 식별하기 위한 고유한 `custom_id`
- 표준 [Messages API](/docs/ko/api/messages) 매개변수가 포함된 `params` 객체

`requests` 매개변수에 이 목록을 전달하여 [배치를 생성](/docs/ko/api/creating-message-batches)할 수 있습니다:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages/batches \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hello, world"}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hi again, friend"}
                ]
            }
        }
    ]
}'
```

```python Python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="my-first-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": "Hello, world",
                }]
            )
        ),
        Request(
            custom_id="my-second-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": "Hi again, friend",
                }]
            )
        )
    ]
)

print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.create({
  requests: [{
    custom_id: "my-first-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {"role": "user", "content": "Hello, world"}
      ]
    }
  }, {
    custom_id: "my-second-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {"role": "user", "content": "Hi again, friend"}
      ]
    }
  }]
});

console.log(messageBatch)
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.batches.*;

public class BatchExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BatchCreateParams params = BatchCreateParams.builder()
            .addRequest(BatchCreateParams.Request.builder()
                .customId("my-first-request")
                .params(BatchCreateParams.Request.Params.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addUserMessage("Hello, world")
                    .build())
                .build())
            .addRequest(BatchCreateParams.Request.builder()
                .customId("my-second-request")
                .params(BatchCreateParams.Request.Params.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addUserMessage("Hi again, friend")
                    .build())
                .build())
            .build();

        MessageBatch messageBatch = client.messages().batches().create(params);

        System.out.println(messageBatch);
    }
}
```

</CodeGroup>

이 예제에서는 두 개의 별도 요청이 비동기 처리를 위해 함께 배치됩니다. 각 요청에는 고유한 `custom_id`가 있고 Messages API 호출에 사용할 표준 매개변수를 포함합니다.

<Tip>
  **Messages API로 배치 요청 테스트**

각 메시지 요청의 `params` 객체 검증은 비동기적으로 수행되며, 검증 오류는 전체 배치의 처리가 끝났을 때 반환됩니다. [Messages API](/docs/ko/api/messages)로 요청 형태를 먼저 확인하여 입력을 올바르게 구성하고 있는지 확인할 수 있습니다.
</Tip>

배치가 처음 생성될 때 응답은 `in_progress`의 처리 상태를 갖습니다.

```json JSON
{
  "id": "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  "type": "message_batch",
  "processing_status": "in_progress",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": null,
  "results_url": null
}
```

### 배치 추적

Message Batch의 `processing_status` 필드는 배치가 처리 중인 단계를 나타냅니다. `in_progress`로 시작하여 배치의 모든 요청이 처리를 완료하고 결과가 준비되면 `ended`로 업데이트됩니다. [Console](/settings/workspaces/default/batches)을 방문하거나 [검색 엔드포인트](/docs/ko/api/retrieving-message-batches)를 사용하여 배치의 상태를 모니터링할 수 있습니다.

#### Message Batch 완료 폴링

Message Batch를 폴링하려면 배치 생성 시 응답에 제공되거나 배치를 나열하여 얻을 수 있는 `id`가 필요합니다. 처리가 끝날 때까지 주기적으로 배치 상태를 확인하는 폴링 루프를 구현할 수 있습니다:

<CodeGroup>
```python Python
import anthropic
import time

client = anthropic.Anthropic()

message_batch = None
while True:
    message_batch = client.messages.batches.retrieve(
        MESSAGE_BATCH_ID
    )
    if message_batch.processing_status == "ended":
        break

    print(f"Batch {MESSAGE_BATCH_ID} is still processing...")
    time.sleep(60)
print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

let messageBatch;
while (true) {
  messageBatch = await anthropic.messages.batches.retrieve(
    MESSAGE_BATCH_ID
  );
  if (messageBatch.processing_status === 'ended') {
    break;
  }

  console.log(`Batch ${messageBatch} is still processing... waiting`);
  await new Promise(resolve => setTimeout(resolve, 60_000));
}
console.log(messageBatch);
```

```bash Shell
#!/bin/sh

until [[ $(curl -s "https://api.anthropic.com/v1/messages/batches/$MESSAGE_BATCH_ID" \
          --header "x-api-key: $ANTHROPIC_API_KEY" \
          --header "anthropic-version: 2023-06-01" \
          | grep -o '"processing_status":[[:space:]]*"[^"]*"' \
          | cut -d'"' -f4) == "ended" ]]; do
    echo "Batch $MESSAGE_BATCH_ID is still processing..."
    sleep 60
done

echo "Batch $MESSAGE_BATCH_ID has finished processing"
```
</CodeGroup>

### 모든 Message Batches 나열

[list 엔드포인트](/docs/ko/api/listing-message-batches)를 사용하여 Workspace의 모든 Message Batches를 나열할 수 있습니다. API는 페이지 매김을 지원하며 필요에 따라 자동으로 추가 페이지를 가져옵니다:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Automatically fetches more pages as needed.
for message_batch in client.messages.batches.list(
    limit=20
):
    print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Automatically fetches more pages as needed.
for await (const messageBatch of anthropic.messages.batches.list({
  limit: 20
})) {
  console.log(messageBatch);
}
```

```bash Shell
#!/bin/sh

if ! command -v jq &> /dev/null; then
    echo "Error: This script requires jq. Please install it first."
    exit 1
fi

BASE_URL="https://api.anthropic.com/v1/messages/batches"

has_more=true
after_id=""

while [ "$has_more" = true ]; do
    # Construct URL with after_id if it exists
    if [ -n "$after_id" ]; then
        url="${BASE_URL}?limit=20&after_id=${after_id}"
    else
        url="$BASE_URL?limit=20"
    fi

    response=$(curl -s "$url" \
              --header "x-api-key: $ANTHROPIC_API_KEY" \
              --header "anthropic-version: 2023-06-01")

    # Extract values using jq
    has_more=$(echo "$response" | jq -r '.has_more')
    after_id=$(echo "$response" | jq -r '.last_id')

    # Process and print each entry in the data array
    echo "$response" | jq -c '.data[]' | while read -r entry; do
        echo "$entry" | jq '.'
    done
done
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.batches.*;

public class BatchListExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Automatically fetches more pages as needed
        for (MessageBatch messageBatch : client.messages().batches().list(
                BatchListParams.builder()
                        .limit(20)
                        .build()
        )) {
            System.out.println(messageBatch);
        }
    }
}
```
</CodeGroup>

### 배치 결과 검색

배치 처리가 끝나면 배치의 각 Messages 요청에는 결과가 있습니다. 4가지 결과 유형이 있습니다:

| 결과 유형 | 설명 |
|-------------|-------------|
| `succeeded` | 요청이 성공했습니다. 메시지 결과를 포함합니다. |
| `errored`   | 요청에 오류가 발생했고 메시지가 생성되지 않았습니다. 가능한 오류에는 잘못된 요청과 내부 서버 오류가 포함됩니다. 이러한 요청에 대해서는 청구되지 않습니다. |
| `canceled`  | 사용자가 이 요청을 모델로 보낼 수 있기 전에 배치를 취소했습니다. 이러한 요청에 대해서는 청구되지 않습니다. |
| `expired`   | 배치가 이 요청을 모델로 보낼 수 있기 전에 24시간 만료에 도달했습니다. 이러한 요청에 대해서는 청구되지 않습니다. |

배치의 `request_counts`로 결과의 개요를 볼 수 있으며, 이는 각 4가지 상태에 도달한 요청의 수를 보여줍니다.

배치의 결과는 Message Batch의 `results_url` 속성에서 다운로드할 수 있으며, 조직 권한이 허용하면 Console에서도 사용 가능합니다. 결과의 잠재적으로 큰 크기로 인해 모든 결과를 한 번에 다운로드하는 대신 [결과를 스트리밍](/docs/ko/api/retrieving-message-batch-results)하는 것이 좋습니다.

<CodeGroup>

```bash Shell
#!/bin/sh
curl "https://api.anthropic.com/v1/messages/batches/msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  | grep -o '"results_url":[[:space:]]*"[^"]*"' \
  | cut -d'"' -f4 \
  | while read -r url; do
    curl -s "$url" \
      --header "anthropic-version: 2023-06-01" \
      --header "x-api-key: $ANTHROPIC_API_KEY" \
      | sed 's/}{/}\n{/g' \
      | while IFS= read -r line
    do
      result_type=$(echo "$line" | sed -n 's/.*"result":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')
      custom_id=$(echo "$line" | sed -n 's/.*"custom_id":[[:space:]]*"\([^"]*\)".*/\1/p')
      error_type=$(echo "$line" | sed -n 's/.*"error":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')

      case "$result_type" in
        "succeeded")
          echo "Success! $custom_id"
          ;;
        "errored")
          if [ "$error_type" = "invalid_request" ]; then
            # Request body must be fixed before re-sending request
            echo "Validation error: $custom_id"
          else
            # Request can be retried directly
            echo "Server error: $custom_id"
          fi
          ;;
        "expired")
          echo "Expired: $line"
          ;;
      esac
    done
  done

```
```python Python
import anthropic

client = anthropic.Anthropic()

# Stream results file in memory-efficient chunks, processing one at a time
for result in client.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
):
    match result.result.type:
        case "succeeded":
            print(f"Success! {result.custom_id}")
        case "errored":
            if result.result.error.type == "invalid_request":
                # Request body must be fixed before re-sending request
                print(f"Validation error {result.custom_id}")
            else:
                # Request can be retried directly
                print(f"Server error {result.custom_id}")
        case "expired":
            print(f"Request expired {result.custom_id}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Stream results file in memory-efficient chunks, processing one at a time
for await (const result of await anthropic.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d"
)) {
  switch (result.result.type) {
    case 'succeeded':
      console.log(`Success! ${result.custom_id}`);
      break;
    case 'errored':
      if (result.result.error.type == "invalid_request") {
        // Request body must be fixed before re-sending request
        console.log(`Validation error: ${result.custom_id}`);
      } else {
        // Request can be retried directly
        console.log(`Server error: ${result.custom_id}`);
      }
      break;
    case 'expired':
      console.log(`Request expired: ${result.custom_id}`);
      break;
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.messages.batches.MessageBatchIndividualResponse;
import com.anthropic.models.messages.batches.BatchResultsParams;

public class BatchResultsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Stream results file in memory-efficient chunks, processing one at a time
        try (StreamResponse<MessageBatchIndividualResponse> streamResponse = client.messages()
                .batches()
                .resultsStreaming(
                        BatchResultsParams.builder()
                                .messageBatchId("msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d")
                                .build())) {

            streamResponse.stream().forEach(result -> {
                if (result.result().isSucceeded()) {
                    System.out.println("Success! " + result.customId());
                } else if (result.result().isErrored()) {
                    if (result.result().asErrored().error().error().isInvalidRequestError()) {
                        // Request body must be fixed before re-sending request
                        System.out.println("Validation error: " + result.customId());
                    } else {
                        // Request can be retried directly
                        System.out.println("Server error: " + result.customId());
                    }
                } else if (result.result().isExpired()) {
                    System.out.println("Request expired: " + result.customId());
                }
            });
        }
    }
}
```

</CodeGroup>

결과는 `.jsonl` 형식으로 제공되며, 각 줄은 Message Batch의 단일 요청 결과를 나타내는 유효한 JSON 객체입니다. 스트리밍된 각 결과에 대해 `custom_id`와 결과 유형에 따라 다른 작업을 수행할 수 있습니다. 다음은 결과 집합의 예입니다:

```json .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

결과에 오류가 있으면 `result.error`가 표준 [오류 형태](/docs/ko/api/errors#error-shapes)로 설정됩니다.

<Tip>
  **배치 결과는 입력 순서와 일치하지 않을 수 있습니다**

배치 결과는 어떤 순서로든 반환될 수 있으며, 배치가 생성될 때 요청의 순서와 일치하지 않을 수 있습니다. 위의 예에서 두 번째 배치 요청의 결과가 첫 번째보다 먼저 반환됩니다. 결과를 해당 요청과 올바르게 일치시키려면 항상 `custom_id` 필드를 사용하세요.
</Tip>

### Message Batch 취소

[취소 엔드포인트](/docs/ko/api/canceling-message-batches)를 사용하여 현재 처리 중인 Message Batch를 취소할 수 있습니다. 취소 직후 배치의 `processing_status`는 `canceling`이 됩니다. 위에서 설명한 동일한 폴링 기법을 사용하여 취소가 완료될 때까지 기다릴 수 있습니다. 취소된 배치는 `ended` 상태로 끝나며 취소 전에 처리된 요청에 대한 부분 결과를 포함할 수 있습니다.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

message_batch = client.messages.batches.cancel(
    MESSAGE_BATCH_ID,
)
print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.cancel(
    MESSAGE_BATCH_ID
);
console.log(messageBatch);
```

```bash Shell
#!/bin/sh
curl --request POST https://api.anthropic.com/v1/messages/batches/$MESSAGE_BATCH_ID/cancel \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01"
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.batches.*;

public class BatchCancelExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageBatch messageBatch = client.messages().batches().cancel(
                BatchCancelParams.builder()
                        .messageBatchId(MESSAGE_BATCH_ID)
                        .build()
        );
        System.out.println(messageBatch);
    }
}
```
</CodeGroup>

응답은 배치가 `canceling` 상태임을 보여줍니다:

```json JSON
{
  "id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
  "type": "message_batch",
  "processing_status": "canceling",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": "2024-09-24T18:39:03.114875Z",
  "results_url": null
}
```

### Message Batches에서 프롬프트 캐싱 사용

Message Batches API는 프롬프트 캐싱을 지원하므로 배치 요청의 비용과 처리 시간을 잠재적으로 줄일 수 있습니다. 프롬프트 캐싱과 Message Batches의 가격 할인은 누적되므로 두 기능을 함께 사용할 때 훨씬 더 큰 비용 절감을 제공합니다. 그러나 배치 요청은 비동기적으로 동시에 처리되므로 캐시 히트는 최선의 노력 기준으로 제공됩니다. 사용자는 일반적으로 트래픽 패턴에 따라 30%에서 98% 사이의 캐시 히트율을 경험합니다.

배치 요청에서 캐시 히트의 가능성을 최대화하려면:

1. 배치 내의 모든 Message 요청에 동일한 `cache_control` 블록을 포함합니다
2. 캐시 항목이 5분의 수명 후 만료되는 것을 방지하기 위해 안정적인 요청 스트림을 유지합니다
3. 가능한 한 많은 캐시된 콘텐츠를 공유하도록 요청을 구조화합니다

배치에서 프롬프트 캐싱을 구현하는 예:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages/batches \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
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
                    {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
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
                    {"role": "user", "content": "Write a summary of Pride and Prejudice."}
                ]
            }
        }
    ]
}'
```

```python Python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="my-first-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=[
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
                messages=[{
                    "role": "user",
                    "content": "Analyze the major themes in Pride and Prejudice."
                }]
            )
        ),
        Request(
            custom_id="my-second-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=[
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
                messages=[{
                    "role": "user",
                    "content": "Write a summary of Pride and Prejudice."
                }]
            )
        )
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.create({
  requests: [{
    custom_id: "my-first-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          type: "text",
          text: "<the entire contents of Pride and Prejudice>",
          cache_control: {type: "ephemeral"}
        }
      ],
      messages: [
        {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
      ]
    }
  }, {
    custom_id: "my-second-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          type: "text",
          text: "<the entire contents of Pride and Prejudice>",
          cache_control: {type: "ephemeral"}
        }
      ],
      messages: [
        {"role": "user", "content": "Write a summary of Pride and Prejudice."}
      ]
    }
  }]
});
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.batches.*;

public class BatchExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BatchCreateParams createParams = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
                                .model(Model.CLAUDE_OPUS_4_0)
                                .maxTokens(1024)
                                .systemOfTextBlockParams(List.of(
                                        TextBlockParam.builder()
                                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                .build(),
                                        TextBlockParam.builder()
                                                .text("<the entire contents of Pride and Prejudice>")
                                                .cacheControl(CacheControlEphemeral.builder().build())
                                                .build()
                                ))
                                .addUserMessage("Analyze the major themes in Pride and Prejudice.")
                                .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
                                .model(Model.CLAUDE_OPUS_4_0)
                                .maxTokens(1024)
                                .systemOfTextBlockParams(List.of(
                                        TextBlockParam.builder()
                                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                .build(),
                                        TextBlockParam.builder()
                                                .text("<the entire contents of Pride and Prejudice>")
                                                .cacheControl(CacheControlEphemeral.builder().build())
                                                .build()
                                ))
                                .addUserMessage("Write a summary of Pride and Prejudice.")
                                .build())
                        .build())
                .build();

        MessageBatch messageBatch = client.messages().batches().create(createParams);
    }
}
```

</CodeGroup>

이 예제에서 배치의 두 요청 모두 동일한 시스템 메시지와 캐시 히트의 가능성을 높이기 위해 `cache_control`로 표시된 Pride and Prejudice의 전체 텍스트를 포함합니다.

### 효과적인 배치 처리를 위한 모범 사례

Batches API를 최대한 활용하려면:

- 배치 처리 상태를 정기적으로 모니터링하고 실패한 요청에 대해 적절한 재시도 로직을 구현합니다.
- 순서가 보장되지 않으므로 의미 있는 `custom_id` 값을 사용하여 결과를 요청과 쉽게 일치시킵니다.
- 더 나은 관리 가능성을 위해 매우 큰 데이터 세트를 여러 배치로 나누는 것을 고려합니다.
- 유효성 검사 오류를 피하기 위해 Messages API를 사용하여 단일 요청 형태를 드라이 런합니다.

### 일반적인 문제 해결

예상치 못한 동작이 발생하는 경우:

- 전체 배치 요청 크기가 256 MB를 초과하지 않는지 확인합니다. 요청 크기가 너무 크면 413 `request_too_large` 오류가 발생할 수 있습니다.
- 배치의 모든 요청에 [지원되는 모델](#supported-models)을 사용하고 있는지 확인합니다.
- 배치의 각 요청이 고유한 `custom_id`를 가지고 있는지 확인합니다.
- 배치 `created_at` (처리 `ended_at` 아님) 시간 이후 29일 미만이 경과했는지 확인합니다. 29일 이상 경과한 경우 결과를 더 이상 볼 수 없습니다.
- 배치가 취소되지 않았는지 확인합니다.

배치의 한 요청이 실패해도 다른 요청의 처리에는 영향을 주지 않습니다.

---
## 배치 저장소 및 개인정보 보호

- **Workspace 격리**: 배치는 생성된 Workspace 내에서 격리됩니다. 해당 Workspace와 연결된 API 키 또는 Console에서 Workspace 배치를 볼 수 있는 권한이 있는 사용자만 액세스할 수 있습니다.

- **결과 가용성**: 배치 결과는 배치 생성 후 29일 동안 사용 가능하므로 검색 및 처리를 위한 충분한 시간을 제공합니다.

---
## FAQ

  <section title="배치 처리에 얼마나 오래 걸리나요?">

    배치는 처리에 최대 24시간이 걸릴 수 있지만 많은 배치가 더 빨리 완료됩니다. 실제 처리 시간은 배치의 크기, 현재 수요 및 요청 볼륨에 따라 달라집니다. 배치가 만료되어 24시간 내에 완료되지 않을 수 있습니다.
  
</section>

  <section title="Batches API는 모든 모델에서 사용 가능한가요?">

    지원되는 모델 목록은 [위](#supported-models)를 참조하세요.
  
</section>

  <section title="Message Batches API를 다른 API 기능과 함께 사용할 수 있나요?">

    예, Message Batches API는 베타 기능을 포함하여 Messages API에서 사용 가능한 모든 기능을 지원합니다. 그러나 배치 요청에는 스트리밍이 지원되지 않습니다.
  
</section>

  <section title="Message Batches API는 가격에 어떤 영향을 미치나요?">

    Message Batches API는 표준 API 가격에 비해 모든 사용에 대해 50% 할인을 제공합니다. 이는 입력 토큰, 출력 토큰 및 모든 특수 토큰에 적용됩니다. 가격에 대한 자세한 내용은 [가격 페이지](https://claude.com/pricing#anthropic-api)를 방문하세요.
  
</section>

  <section title="배치를 제출한 후 업데이트할 수 있나요?">

    아니요, 배치가 제출되면 수정할 수 없습니다. 변경이 필요한 경우 현재 배치를 취소하고 새 배치를 제출해야 합니다. 취소가 즉시 적용되지 않을 수 있습니다.
  
</section>

  <section title="Message Batches API 속도 제한이 있으며 Messages API 속도 제한과 상호 작용하나요?">

    Message Batches API는 처리가 필요한 요청 수에 대한 제한 외에도 HTTP 요청 기반 속도 제한이 있습니다. [Message Batches API 속도 제한](/docs/ko/api/rate-limits#message-batches-api)을 참조하세요. Batches API의 사용은 Messages API의 속도 제한에 영향을 주지 않습니다.
  
</section>

  <section title="배치 요청에서 오류를 어떻게 처리하나요?">

    결과를 검색할 때 각 요청에는 `succeeded`, `errored`, `canceled` 또는 `expired`인지 나타내는 `result` 필드가 있습니다. `errored` 결과의 경우 추가 오류 정보가 제공됩니다. [API 참조](/docs/ko/api/creating-message-batches)에서 오류 응답 객체를 확인하세요.
  
</section>

  <section title="Message Batches API는 개인정보 보호 및 데이터 분리를 어떻게 처리하나요?">

    Message Batches API는 강력한 개인정보 보호 및 데이터 분리 조치로 설계되었습니다:

    1. 배치 및 해당 결과는 생성된 Workspace 내에서 격리됩니다. 이는 동일한 Workspace의 API 키로만 액세스할 수 있음을 의미합니다.
    2. 배치 내의 각 요청은 독립적으로 처리되며 요청 간 데이터 누수가 없습니다.
    3. 결과는 제한된 시간(29일) 동안만 사용 가능하며 [데이터 보존 정책](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data)을 따릅니다.
    4. Console에서 배치 결과 다운로드는 조직 수준 또는 Workspace별로 비활성화할 수 있습니다.
  
</section>

  <section title="Message Batches API에서 프롬프트 캐싱을 사용할 수 있나요?">

    예, Message Batches API에서 프롬프트 캐싱을 사용할 수 있습니다. 그러나 비동기 배치 요청은 동시에 임의의 순서로 처리될 수 있으므로 캐시 히트는 최선의 노력 기준으로 제공됩니다.
  
</section>