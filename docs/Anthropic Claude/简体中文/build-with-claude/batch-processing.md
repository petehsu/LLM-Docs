# 批量处理

了解如何使用 Message Batches API 高效处理大量请求

---

批量处理是一种强大的方法，可以高效处理大量请求。与其一次处理一个请求并立即获得响应，批量处理允许您将多个请求一起提交进行异步处理。这种模式在以下情况下特别有用：

- 您需要处理大量数据
- 不需要立即响应
- 您想优化成本效率
- 您正在运行大规模评估或分析

Message Batches API 是我们对这种模式的首次实现。

---

# Message Batches API

Message Batches API 是一种强大且经济高效的方式，可以异步处理大量 [Messages](/docs/zh-CN/api/messages) 请求。这种方法非常适合不需要立即响应的任务，大多数批次在 1 小时内完成，同时将成本降低 50% 并提高吞吐量。

您可以 [直接探索 API 参考](/docs/zh-CN/api/creating-message-batches)，以及阅读本指南。

## Message Batches API 如何工作

当您向 Message Batches API 发送请求时：

1. 系统使用提供的 Messages 请求创建一个新的 Message Batch。
2. 然后异步处理该批次，每个请求独立处理。
3. 您可以轮询批次的状态，并在所有请求处理完成后检索结果。

这对于不需要立即结果的批量操作特别有用，例如：
- 大规模评估：高效处理数千个测试用例。
- 内容审核：异步分析大量用户生成的内容。
- 数据分析：为大型数据集生成见解或摘要。
- 批量内容生成：为各种目的创建大量文本（例如，产品描述、文章摘要）。

### 批次限制
- Message Batch 限制为 100,000 个 Message 请求或 256 MB 大小，以先达到的为准。
- 我们尽快处理每个批次，大多数批次在 1 小时内完成。当所有消息完成或 24 小时后（以先发生者为准），您将能够访问批次结果。如果处理在 24 小时内未完成，批次将过期。
- 批次结果在创建后 29 天内可用。之后，您仍然可以查看批次，但其结果将不再可供下载。
- 批次的范围限定为 [Workspace](/settings/workspaces)。您可以查看在您的 API 密钥所属的 Workspace 中创建的所有批次及其结果。
- 速率限制适用于 Batches API HTTP 请求和批次中等待处理的请求数。请参阅 [Message Batches API 速率限制](/docs/zh-CN/api/rate-limits#message-batches-api)。此外，我们可能会根据当前需求和您的请求量减慢处理速度。在这种情况下，您可能会看到更多请求在 24 小时后过期。
- 由于高吞吐量和并发处理，批次可能会略微超过您的 Workspace 配置的 [支出限制](/settings/limits)。

### 支持的模型

所有 [活跃模型](/docs/zh-CN/about-claude/models/overview) 都支持 Message Batches API。

### 可以批处理的内容
任何您可以对 Messages API 进行的请求都可以包含在批次中。这包括：

- 视觉
- 工具使用
- 系统消息
- 多轮对话
- 任何测试版功能

由于批次中的每个请求都是独立处理的，您可以在单个批次中混合不同类型的请求。

<Tip>
由于批次处理可能需要超过 5 分钟，请考虑在处理具有共享上下文的批次时使用 [1 小时缓存持续时间](/docs/zh-CN/build-with-claude/prompt-caching#1-hour-cache-duration) 和提示缓存以获得更好的缓存命中率。
</Tip>

---
## 定价

Batches API 提供显著的成本节省。所有使用费用按标准 API 价格的 50% 收费。

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

### 准备并创建您的批次

Message Batch 由创建 Message 的请求列表组成。单个请求的形状包括：
- 用于标识 Messages 请求的唯一 `custom_id`
- 包含标准 [Messages API](/docs/zh-CN/api/messages) 参数的 `params` 对象

您可以通过将此列表传递到 `requests` 参数来 [创建批次](/docs/zh-CN/api/creating-message-batches)：

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

在此示例中，两个单独的请求被批处理在一起进行异步处理。每个请求都有一个唯一的 `custom_id` 并包含您用于 Messages API 调用的标准参数。

<Tip>
  **使用 Messages API 测试您的批次请求**

每个消息请求的 `params` 对象的验证是异步执行的，验证错误在整个批次处理结束时返回。您可以通过首先使用 [Messages API](/docs/zh-CN/api/messages) 验证您的请求形状来确保您正确构建输入。
</Tip>

首次创建批次时，响应的处理状态将为 `in_progress`。

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

### 跟踪您的批次

Message Batch 的 `processing_status` 字段指示批次处理所处的阶段。它首先为 `in_progress`，然后在批次中的所有请求完成处理且结果准备好后更新为 `ended`。您可以通过访问 [Console](/settings/workspaces/default/batches) 或使用 [检索端点](/docs/zh-CN/api/retrieving-message-batches) 来监控批次的状态。

#### 轮询 Message Batch 完成

要轮询 Message Batch，您需要其 `id`，这在创建批次时的响应中提供，或通过列出批次获得。您可以实现一个轮询循环，定期检查批次状态，直到处理结束：

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

您可以使用 [列表端点](/docs/zh-CN/api/listing-message-batches) 列出 Workspace 中的所有 Message Batches。API 支持分页，根据需要自动获取其他页面：

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

### 检索批次结果

批次处理结束后，批次中的每个 Messages 请求都将有一个结果。有 4 种结果类型：

| 结果类型 | 描述 |
|-------------|-------------|
| `succeeded` | 请求成功。包括消息结果。 |
| `errored`   | 请求遇到错误，未创建消息。可能的错误包括无效请求和内部服务器错误。您不会为这些请求付费。 |
| `canceled`  | 用户在此请求发送到模型之前取消了批次。您不会为这些请求付费。 |
| `expired`   | 批次在此请求发送到模型之前达到了 24 小时过期时间。您不会为这些请求付费。 |

您将看到批次 `request_counts` 的概览，其中显示有多少请求达到了这四种状态中的每一种。

批次的结果可在 Message Batch 上的 `results_url` 属性处下载，如果组织权限允许，也可在 Console 中下载。由于结果的潜在大小，建议 [流式传输结果](/docs/zh-CN/api/retrieving-message-batch-results) 而不是一次性下载所有结果。

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

结果将采用 `.jsonl` 格式，其中每一行都是一个有效的 JSON 对象，代表 Message Batch 中单个请求的结果。对于每个流式传输的结果，您可以根据其 `custom_id` 和结果类型执行不同的操作。以下是一组示例结果：

```json .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

如果您的结果有错误，其 `result.error` 将设置为我们的标准 [错误形状](/docs/zh-CN/api/errors#error-shapes)。

<Tip>
  **批次结果可能与输入顺序不匹配**

批次结果可以按任何顺序返回，可能与创建批次时请求的顺序不匹配。在上面的示例中，第二个批次请求的结果在第一个之前返回。要正确匹配结果与其对应的请求，始终使用 `custom_id` 字段。
</Tip>

### 取消 Message Batch

您可以使用 [取消端点](/docs/zh-CN/api/canceling-message-batches) 取消当前正在处理的 Message Batch。取消后立即，批次的 `processing_status` 将为 `canceling`。您可以使用上面描述的相同轮询技术等待取消完成。已取消的批次最终状态为 `ended`，可能包含取消前处理的请求的部分结果。

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

响应将显示处于 `canceling` 状态的批次：

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

### 在 Message Batches 中使用提示词缓存

Message Batches API 支持提示词缓存，允许您为批处理请求潜在地降低成本和处理时间。提示词缓存和 Message Batches 的定价折扣可以叠加，当同时使用这两个功能时可以提供更大的成本节省。但是，由于批处理请求是异步并发处理的，缓存命中是尽力而为的基础上提供的。用户通常会根据其流量模式体验 30% 到 98% 的缓存命中率。

为了最大化批处理请求中缓存命中的可能性：

1. 在批处理中的每个 Message 请求中包含相同的 `cache_control` 块
2. 保持稳定的请求流以防止缓存条目在其 5 分钟的生命周期后过期
3. 构造您的请求以共享尽可能多的缓存内容

在批处理中实现提示词缓存的示例：

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

在此示例中，批处理中的两个请求都包含相同的系统消息和标记有 `cache_control` 的完整《傲慢与偏见》文本，以增加缓存命中的可能性。

### 有效批处理的最佳实践

为了充分利用 Batches API：

- 定期监控批处理状态并为失败的请求实现适当的重试逻辑。
- 使用有意义的 `custom_id` 值来轻松匹配结果与请求，因为顺序不能保证。
- 考虑将非常大的数据集分解为多个批处理以获得更好的可管理性。
- 使用 Messages API 对单个请求形状进行干运行以避免验证错误。

### 常见问题故障排除

如果遇到意外行为：

- 验证总批处理请求大小不超过 256 MB。如果请求大小过大，您可能会收到 413 `request_too_large` 错误。
- 检查您是否为批处理中的所有请求使用[支持的模型](#supported-models)。
- 确保批处理中的每个请求都有唯一的 `custom_id`。
- 确保自批处理 `created_at`（不是处理 `ended_at`）时间以来已不足 29 天。如果已超过 29 天，结果将不再可查看。
- 确认批处理未被取消。

请注意，批处理中一个请求的失败不会影响其他请求的处理。

---
## 批处理存储和隐私

- **工作区隔离**：批处理在创建它们的工作区内是隔离的。它们只能由与该工作区关联的 API 密钥或有权限在控制台中查看工作区批处理的用户访问。

- **结果可用性**：批处理结果在创建批处理后的 29 天内可用，为检索和处理提供充足的时间。

---
## 常见问题

  <section title="批处理需要多长时间才能处理？">

    批处理可能需要长达 24 小时才能处理，但许多将更快完成。实际处理时间取决于批处理的大小、当前需求和您的请求量。批处理可能会过期并在 24 小时内无法完成。
  
</section>

  <section title="Batches API 是否适用于所有模型？">

    有关支持的模型列表，请参见[上文](#supported-models)。
  
</section>

  <section title="我可以将 Message Batches API 与其他 API 功能一起使用吗？">

    是的，Message Batches API 支持 Messages API 中可用的所有功能，包括测试版功能。但是，批处理请求不支持流式传输。
  
</section>

  <section title="Message Batches API 如何影响定价？">

    Message Batches API 与标准 API 价格相比提供 50% 的折扣。这适用于输入令牌、输出令牌和任何特殊令牌。有关定价的更多信息，请访问我们的[定价页面](https://claude.com/pricing#anthropic-api)。
  
</section>

  <section title="我可以在提交批处理后更新它吗？">

    不可以，一旦提交了批处理，就无法修改它。如果您需要进行更改，应该取消当前批处理并提交新的批处理。请注意，取消可能不会立即生效。
  
</section>

  <section title="是否存在 Message Batches API 速率限制，它们是否与 Messages API 速率限制相互作用？">

    Message Batches API 除了对需要处理的请求数量的限制外，还有基于 HTTP 请求的速率限制。请参见 [Message Batches API 速率限制](/docs/zh-CN/api/rate-limits#message-batches-api)。Batches API 的使用不会影响 Messages API 中的速率限制。
  
</section>

  <section title="我如何处理批处理请求中的错误？">

    当您检索结果时，每个请求都会有一个 `result` 字段，指示它是否 `succeeded`、`errored`、被 `canceled` 或 `expired`。对于 `errored` 结果，将提供额外的错误信息。在 [API 参考](/docs/zh-CN/api/creating-message-batches)中查看错误响应对象。
  
</section>

  <section title="Message Batches API 如何处理隐私和数据分离？">

    Message Batches API 采用强大的隐私和数据分离措施设计：

    1. 批处理及其结果在创建它们的工作区内是隔离的。这意味着它们只能由来自同一工作区的 API 密钥访问。
    2. 批处理中的每个请求都是独立处理的，请求之间没有数据泄露。
    3. 结果仅在有限的时间内可用（29 天），并遵循我们的[数据保留政策](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data)。
    4. 可以在组织级别或按工作区基础禁用在控制台中下载批处理结果。
  
</section>

  <section title="我可以在 Message Batches API 中使用提示词缓存吗？">

    是的，可以在 Message Batches API 中使用提示词缓存。但是，由于异步批处理请求可以并发处理且顺序任意，缓存命中是尽力而为的基础上提供的。
  
</section>