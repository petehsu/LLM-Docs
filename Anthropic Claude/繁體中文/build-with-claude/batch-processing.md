# 批次處理

使用 Message Batches API 高效處理大量請求的非同步批次處理

---

批次處理是一種強大的方法，可以有效地處理大量請求。與其一次處理一個請求並立即獲得回應，批次處理允許您將多個請求一起提交進行非同步處理。這種模式特別適用於以下情況：

- 您需要處理大量數據
- 不需要立即回應
- 您想優化成本效率
- 您正在運行大規模評估或分析

Message Batches API 是我們對這種模式的首次實現。

---

# Message Batches API

Message Batches API 是一種強大且具有成本效益的方式，可以非同步處理大量 [Messages](/docs/zh-TW/api/messages) 請求。這種方法非常適合不需要立即回應的任務，大多數批次在 1 小時內完成，同時將成本降低 50% 並提高吞吐量。

您可以 [直接探索 API 參考](/docs/zh-TW/api/creating-message-batches)，以及閱讀本指南。

## Message Batches API 的工作原理

當您向 Message Batches API 發送請求時：

1. 系統使用提供的 Messages 請求建立新的 Message Batch。
2. 批次隨後被非同步處理，每個請求獨立處理。
3. 您可以輪詢批次的狀態，並在所有請求處理完成後檢索結果。

這對於不需要立即結果的批量操作特別有用，例如：
- 大規模評估：有效地處理數千個測試案例。
- 內容審核：非同步分析大量使用者生成的內容。
- 數據分析：為大型數據集生成見解或摘要。
- 批量內容生成：為各種目的創建大量文本（例如產品描述、文章摘要）。

### 批次限制
- Message Batch 限制為 100,000 個 Message 請求或 256 MB 大小，以先達到的為準。
- 我們盡快處理每個批次，大多數批次在 1 小時內完成。當所有消息完成或 24 小時後（以先發生者為準），您將能夠訪問批次結果。如果處理未在 24 小時內完成，批次將過期。
- 批次結果在建立後 29 天內可用。之後，您仍然可以查看批次，但其結果將不再可供下載。
- 批次的範圍限於 [Workspace](/settings/workspaces)。您可以查看在您的 API 金鑰所屬的 Workspace 中建立的所有批次及其結果。
- 速率限制適用於 Batches API HTTP 請求和批次內等待處理的請求數。請參閱 [Message Batches API 速率限制](/docs/zh-TW/api/rate-limits#message-batches-api)。此外，我們可能會根據當前需求和您的請求量減慢處理速度。在這種情況下，您可能會看到更多請求在 24 小時後過期。
- 由於高吞吐量和並發處理，批次可能會略微超過您的 Workspace 配置的 [支出限制](/settings/limits)。

### 支援的模型

所有 [活躍模型](/docs/zh-TW/about-claude/models/overview) 都支援 Message Batches API。

### 可以批次處理的內容
任何您可以向 Messages API 發出的請求都可以包含在批次中。這包括：

- 視覺
- 工具使用
- 系統消息
- 多輪對話
- 任何測試版功能

由於批次中的每個請求都是獨立處理的，您可以在單個批次中混合不同類型的請求。

<Tip>
由於批次可能需要超過 5 分鐘才能處理，請考慮在批次處理時使用 [1 小時快取持續時間](/docs/zh-TW/build-with-claude/prompt-caching#1-hour-cache-duration) 與提示快取，以便在處理具有共享上下文的批次時獲得更好的快取命中率。
</Tip>

---
## 定價

Batches API 提供顯著的成本節省。所有使用費用按標準 API 價格的 50% 計費。

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
## 如何使用 Message Batches API

### 準備並建立您的批次

Message Batch 由建立 Message 的請求列表組成。單個請求的形狀包括：
- 用於識別 Messages 請求的唯一 `custom_id`
- 包含標準 [Messages API](/docs/zh-TW/api/messages) 參數的 `params` 物件

您可以通過將此列表傳遞到 `requests` 參數來 [建立批次](/docs/zh-TW/api/creating-message-batches)：

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

在此範例中，兩個單獨的請求被批次處理在一起進行非同步處理。每個請求都有唯一的 `custom_id` 並包含您用於 Messages API 呼叫的標準參數。

<Tip>
  **使用 Messages API 測試您的批次請求**

對每個消息請求的 `params` 物件的驗證是非同步執行的，驗證錯誤在整個批次處理結束時返回。您可以通過首先使用 [Messages API](/docs/zh-TW/api/messages) 驗證您的請求形狀來確保您正確構建輸入。
</Tip>

首次建立批次時，回應將具有 `in_progress` 的處理狀態。

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

### 追蹤您的批次

Message Batch 的 `processing_status` 欄位指示批次處理所處的階段。它開始為 `in_progress`，然後在批次中的所有請求完成處理且結果準備就緒後更新為 `ended`。您可以通過訪問 [Console](/settings/workspaces/default/batches) 或使用 [檢索端點](/docs/zh-TW/api/retrieving-message-batches) 來監控批次的狀態。

#### 輪詢 Message Batch 完成

要輪詢 Message Batch，您需要其 `id`，該 ID 在建立批次時的回應中提供，或通過列出批次獲得。您可以實現一個輪詢迴圈，定期檢查批次狀態，直到處理結束：

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

### 列出所有 Message Batches

您可以使用 [列表端點](/docs/zh-TW/api/listing-message-batches) 列出 Workspace 中的所有 Message Batches。API 支援分頁，根據需要自動獲取其他頁面：

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

### 檢索批次結果

批次處理結束後，批次中的每個 Messages 請求都將有一個結果。有 4 種結果類型：

| 結果類型 | 描述 |
|-------------|-------------|
| `succeeded` | 請求成功。包括消息結果。 |
| `errored`   | 請求遇到錯誤，未建立消息。可能的錯誤包括無效請求和內部伺服器錯誤。您不會為這些請求計費。 |
| `canceled`  | 使用者在此請求可以發送到模型之前取消了批次。您不會為這些請求計費。 |
| `expired`   | 批次在此請求可以發送到模型之前達到其 24 小時過期時間。您不會為這些請求計費。 |

您將看到批次 `request_counts` 的概述，其中顯示有多少請求達到了這四種狀態中的每一種。

批次的結果可在 Message Batch 上的 `results_url` 屬性處下載，如果組織權限允許，也可在 Console 中下載。由於結果的潛在大小，建議 [流式傳輸結果](/docs/zh-TW/api/retrieving-message-batch-results) 而不是一次性下載所有結果。

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

結果將採用 `.jsonl` 格式，其中每一行都是代表 Message Batch 中單個請求結果的有效 JSON 物件。對於每個流式傳輸的結果，您可以根據其 `custom_id` 和結果類型執行不同的操作。以下是一組範例結果：

```json .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

如果您的結果有錯誤，其 `result.error` 將設置為我們的標準 [錯誤形狀](/docs/zh-TW/api/errors#error-shapes)。

<Tip>
  **批次結果可能與輸入順序不匹配**

批次結果可以按任何順序返回，可能與建立批次時請求的順序不匹配。在上面的範例中，第二個批次請求的結果在第一個之前返回。要正確匹配結果與其對應的請求，請始終使用 `custom_id` 欄位。
</Tip>

### 取消 Message Batch

您可以使用 [取消端點](/docs/zh-TW/api/canceling-message-batches) 取消當前正在處理的 Message Batch。取消後立即，批次的 `processing_status` 將為 `canceling`。您可以使用上述相同的輪詢技術等待取消完成。已取消的批次最終狀態為 `ended`，可能包含取消前處理的請求的部分結果。

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

回應將顯示處於 `canceling` 狀態的批次：

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

### 在 Message Batches 中使用提示詞快取

Message Batches API 支援提示詞快取，允許您可能降低批次請求的成本和處理時間。提示詞快取和 Message Batches 的定價折扣可以疊加，當同時使用這兩項功能時可提供更大的成本節省。但是，由於批次請求是非同步且並行處理的，快取命中是以盡力而為的基礎提供的。使用者通常會根據其流量模式體驗 30% 到 98% 的快取命中率。

為了最大化批次請求中快取命中的可能性：

1. 在批次中的每個 Message 請求中包含相同的 `cache_control` 區塊
2. 維持穩定的請求流，以防止快取項目在其 5 分鐘的生命週期後過期
3. 結構化您的請求以共享盡可能多的快取內容

在批次中實現提示詞快取的範例：

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

在此範例中，批次中的兩個請求都包含相同的系統訊息和標記有 `cache_control` 的完整 Pride and Prejudice 文本，以增加快取命中的可能性。

### 有效批次處理的最佳實踐

為了充分利用 Batches API：

- 定期監控批次處理狀態，並為失敗的請求實現適當的重試邏輯。
- 使用有意義的 `custom_id` 值來輕鬆匹配結果與請求，因為順序不保證。
- 考慮將非常大的資料集分解為多個批次，以便更好地管理。
- 使用 Messages API 進行單個請求形狀的試運行，以避免驗證錯誤。

### 常見問題的故障排除

如果遇到意外行為：

- 驗證總批次請求大小不超過 256 MB。如果請求大小過大，您可能會收到 413 `request_too_large` 錯誤。
- 檢查您是否在批次中的所有請求中使用[支援的模型](#supported-models)。
- 確保批次中的每個請求都有唯一的 `custom_id`。
- 確保自批次 `created_at`（不是處理 `ended_at`）時間以來已不超過 29 天。如果已超過 29 天，結果將不再可檢視。
- 確認批次尚未被取消。

請注意，批次中一個請求的失敗不會影響其他請求的處理。

---
## 批次儲存和隱私

- **工作區隔離**：批次在建立它們的工作區內隔離。它們只能由與該工作區相關聯的 API 金鑰或有權限在主控台中檢視工作區批次的使用者存取。

- **結果可用性**：批次結果在建立批次後可用 29 天，允許充足的時間進行檢索和處理。

---
## 常見問題

  <section title="批次處理需要多長時間？">

    批次可能需要長達 24 小時進行處理，但許多批次會更快完成。實際處理時間取決於批次的大小、目前需求和您的請求量。批次可能會過期且無法在 24 小時內完成。
  
</section>

  <section title="Batches API 是否適用於所有模型？">

    請參閱[上方](#supported-models)以了解支援的模型清單。
  
</section>

  <section title="我可以將 Message Batches API 與其他 API 功能一起使用嗎？">

    是的，Message Batches API 支援 Messages API 中可用的所有功能，包括測試版功能。但是，批次請求不支援串流。
  
</section>

  <section title="Message Batches API 如何影響定價？">

    Message Batches API 與標準 API 價格相比提供 50% 的折扣。這適用於輸入令牌、輸出令牌和任何特殊令牌。有關定價的更多資訊，請訪問我們的[定價頁面](https://claude.com/pricing#anthropic-api)。
  
</section>

  <section title="提交批次後我可以更新它嗎？">

    不可以，一旦提交批次，就無法修改它。如果您需要進行更改，應該取消目前的批次並提交新的批次。請注意，取消可能不會立即生效。
  
</section>

  <section title="Message Batches API 是否有速率限制，它們是否與 Messages API 速率限制互動？">

    Message Batches API 除了對需要處理的請求數量的限制外，還有基於 HTTP 請求的速率限制。請參閱 [Message Batches API 速率限制](/docs/zh-TW/api/rate-limits#message-batches-api)。Batches API 的使用不會影響 Messages API 中的速率限制。
  
</section>

  <section title="我如何處理批次請求中的錯誤？">

    當您檢索結果時，每個請求都會有一個 `result` 欄位，指示它是否 `succeeded`、`errored`、被 `canceled` 或 `expired`。對於 `errored` 結果，將提供額外的錯誤資訊。在 [API 參考](/docs/zh-TW/api/creating-message-batches)中檢視錯誤回應物件。
  
</section>

  <section title="Message Batches API 如何處理隱私和資料分離？">

    Message Batches API 設計有強大的隱私和資料分離措施：

    1. 批次及其結果在建立它們的工作區內隔離。這意味著它們只能由來自同一工作區的 API 金鑰存取。
    2. 批次中的每個請求都是獨立處理的，請求之間沒有資料洩漏。
    3. 結果僅在有限的時間內可用（29 天），並遵循我們的[資料保留政策](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data)。
    4. 在主控台中下載批次結果可以在組織級別或按工作區基礎禁用。
  
</section>

  <section title="我可以在 Message Batches API 中使用提示詞快取嗎？">

    是的，可以在 Message Batches API 中使用提示詞快取。但是，由於非同步批次請求可以並行處理且以任何順序處理，快取命中是以盡力而為的基礎提供的。
  
</section>