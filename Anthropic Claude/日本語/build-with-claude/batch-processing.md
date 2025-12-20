# バッチ処理

大量のリクエストを効率的に処理するためのバッチ処理APIについて学びます

---

バッチ処理は、大量のリクエストを効率的に処理するための強力なアプローチです。リクエストを1つずつ処理して即座に応答する代わりに、バッチ処理では複数のリクエストをまとめて送信して非同期処理することができます。このパターンは特に以下の場合に有用です：

- 大量のデータを処理する必要がある
- 即座の応答が不要である
- コスト効率を最適化したい
- 大規模な評価または分析を実行している

Message Batches APIは、このパターンの最初の実装です。

---

# Message Batches API

Message Batches APIは、大量の[Messages](/docs/ja/api/messages)リクエストを非同期で処理するための強力でコスト効率的な方法です。このアプローチは即座の応答を必要としないタスクに適しており、ほとんどのバッチは1時間以内に完了し、コストを50%削減しながらスループットを増加させます。

このガイドに加えて、[APIリファレンスを直接確認](/docs/ja/api/creating-message-batches)することができます。

## Message Batches APIの仕組み

Message Batches APIにリクエストを送信すると：

1. システムは提供されたMessagesリクエストで新しいMessage Batchを作成します。
2. バッチは非同期で処理され、各リクエストは独立して処理されます。
3. バッチのステータスをポーリングして、すべてのリクエストの処理が終了したときに結果を取得できます。

これは特に即座の結果を必要としないバルク操作に有用です：
- 大規模な評価：数千のテストケースを効率的に処理します。
- コンテンツモデレーション：大量のユーザー生成コンテンツを非同期で分析します。
- データ分析：大規模なデータセットに対する洞察またはサマリーを生成します。
- バルクコンテンツ生成：様々な目的（例：商品説明、記事のサマリー）のために大量のテキストを作成します。

### バッチの制限
- Message Batchは、100,000のMessageリクエストまたは256 MBのサイズのいずれかに制限されます。
- 各バッチはできるだけ早く処理され、ほとんどのバッチは1時間以内に完了します。すべてのメッセージが完了したか、24時間経過したかのいずれか早い方で、バッチ結果にアクセスできます。処理が24時間以内に完了しない場合、バッチは期限切れになります。
- バッチ結果は作成後29日間利用可能です。その後、バッチを表示することはできますが、結果はダウンロードできなくなります。
- バッチは[Workspace](/settings/workspaces)にスコープされます。APIキーが属するWorkspace内で作成されたすべてのバッチとその結果を表示できます。
- レート制限は、Batches API HTTPリクエストと、処理待ちのバッチ内のリクエスト数の両方に適用されます。[Message Batches APIレート制限](/docs/ja/api/rate-limits#message-batches-api)を参照してください。さらに、現在の需要とリクエストボリュームに基づいて処理を遅くする場合があります。その場合、24時間後に期限切れになるリクエストが増える可能性があります。
- 高スループットと並行処理のため、バッチはWorkspaceの設定された[支出制限](/settings/limits)をわずかに超える可能性があります。

### サポートされているモデル

すべての[アクティブなモデル](/docs/ja/about-claude/models/overview)がMessage Batches APIをサポートしています。

### バッチ処理できるもの
Messages APIに対して実行できるリクエストはすべてバッチに含めることができます。これには以下が含まれます：

- Vision
- Tool use
- システムメッセージ
- マルチターン会話
- すべてのベータ機能

バッチ内の各リクエストは独立して処理されるため、単一のバッチ内で異なるタイプのリクエストを混在させることができます。

<Tip>
バッチは処理に5分以上かかる可能性があるため、バッチ処理時に共有コンテキストを使用する場合は、キャッシュヒット率を向上させるために[1時間のキャッシュ期間](/docs/ja/build-with-claude/prompt-caching#1-hour-cache-duration)とプロンプトキャッシングの使用を検討してください。
</Tip>

---
## 価格設定

Batches APIは大幅なコスト削減を提供します。すべての使用は標準APIの50%の価格で課金されます。

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
## Message Batches APIの使用方法

### バッチの準備と作成

Message Batchは、Messageを作成するためのリクエストのリストで構成されます。個別のリクエストの形状は以下で構成されます：
- Messagesリクエストを識別するための一意の`custom_id`
- 標準的な[Messages API](/docs/ja/api/messages)パラメータを含む`params`オブジェクト

このリストを`requests`パラメータに渡すことで、[バッチを作成](/docs/ja/api/creating-message-batches)できます：

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

この例では、2つの個別のリクエストが非同期処理のためにまとめてバッチ処理されます。各リクエストは一意の`custom_id`を持ち、Messages APIコールに使用する標準パラメータを含みます。

<Tip>
  **Messages APIでバッチリクエストをテストする**

各メッセージリクエストの`params`オブジェクトの検証は非同期で実行され、バッチ全体の処理が終了したときに検証エラーが返されます。[Messages API](/docs/ja/api/messages)でリクエスト形状を検証することで、入力を正しく構築していることを確認できます。
</Tip>

バッチが最初に作成されると、応答の処理ステータスは`in_progress`になります。

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

### バッチの追跡

Message Batchの`processing_status`フィールドは、バッチが処理されている段階を示します。`in_progress`として開始され、バッチ内のすべてのリクエストの処理が完了して結果が準備できたら`ended`に更新されます。[Console](/settings/workspaces/default/batches)にアクセスするか、[取得エンドポイント](/docs/ja/api/retrieving-message-batches)を使用してバッチの状態を監視できます。

#### Message Batchの完了をポーリングする

Message Batchをポーリングするには、その`id`が必要です。これはバッチを作成するときの応答で提供されるか、バッチをリストすることで取得できます。処理が終了するまで定期的にバッチステータスをチェックするポーリングループを実装できます：

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

### すべてのMessage Batchをリストする

[リストエンドポイント](/docs/ja/api/listing-message-batches)を使用して、Workspace内のすべてのMessage Batchをリストできます。APIはページネーションをサポートし、必要に応じて自動的に追加ページを取得します：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# 必要に応じて自動的により多くのページを取得します。
for message_batch in client.messages.batches.list(
    limit=20
):
    print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// 必要に応じて自動的により多くのページを取得します。
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
    # after_idが存在する場合はURLを構築します
    if [ -n "$after_id" ]; then
        url="${BASE_URL}?limit=20&after_id=${after_id}"
    else
        url="$BASE_URL?limit=20"
    fi

    response=$(curl -s "$url" \
              --header "x-api-key: $ANTHROPIC_API_KEY" \
              --header "anthropic-version: 2023-06-01")

    # jqを使用して値を抽出します
    has_more=$(echo "$response" | jq -r '.has_more')
    after_id=$(echo "$response" | jq -r '.last_id')

    # dataアレイ内の各エントリを処理して出力します
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

        // 必要に応じて自動的により多くのページを取得します
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

### バッチ結果の取得

バッチ処理が終了すると、バッチ内の各Messagesリクエストに結果があります。4つの結果タイプがあります：

| 結果タイプ | 説明 |
|-------------|-------------|
| `succeeded` | リクエストが成功しました。メッセージ結果を含みます。 |
| `errored`   | リクエストがエラーに遭遇し、メッセージが作成されませんでした。可能なエラーには無効なリクエストと内部サーバーエラーが含まれます。これらのリクエストについては課金されません。 |
| `canceled`  | ユーザーがこのリクエストをモデルに送信する前にバッチをキャンセルしました。これらのリクエストについては課金されません。 |
| `expired`   | バッチがこのリクエストをモデルに送信する前に24時間の有効期限に達しました。これらのリクエストについては課金されません。 |

バッチの`request_counts`で結果の概要が表示され、これらの4つの状態のそれぞれに到達したリクエスト数が示されます。

バッチの結果は、Message Batchの`results_url`プロパティでダウンロード可能であり、組織の権限が許可する場合はConsoleでも利用可能です。結果の潜在的に大きなサイズのため、すべてを一度にダウンロードするのではなく、[結果をストリーミング](/docs/ja/api/retrieving-message-batch-results)することをお勧めします。

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
            # リクエスト本体は再送信前に修正する必要があります
            echo "Validation error: $custom_id"
          else
            # リクエストは直接再試行できます
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

# メモリ効率的なチャンクで結果ファイルをストリーミングし、一度に1つ処理します
for result in client.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
):
    match result.result.type:
        case "succeeded":
            print(f"Success! {result.custom_id}")
        case "errored":
            if result.result.error.type == "invalid_request":
                # リクエスト本体は再送信前に修正する必要があります
                print(f"Validation error {result.custom_id}")
            else:
                # リクエストは直接再試行できます
                print(f"Server error {result.custom_id}")
        case "expired":
            print(f"Request expired {result.custom_id}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// メモリ効率的なチャンクで結果ファイルをストリーミングし、一度に1つ処理します
for await (const result of await anthropic.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d"
)) {
  switch (result.result.type) {
    case 'succeeded':
      console.log(`Success! ${result.custom_id}`);
      break;
    case 'errored':
      if (result.result.error.type == "invalid_request") {
        // リクエスト本体は再送信前に修正する必要があります
        console.log(`Validation error: ${result.custom_id}`);
      } else {
        // リクエストは直接再試行できます
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

        // メモリ効率的なチャンクで結果ファイルをストリーミングし、一度に1つ処理します
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
                        // リクエスト本体は再送信前に修正する必要があります
                        System.out.println("Validation error: " + result.customId());
                    } else {
                        // リクエストは直接再試行できます
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

結果は`.jsonl`形式になり、各行はMessage Batch内の単一のリクエストの結果を表す有効なJSONオブジェクトです。ストリーミングされた各結果について、その`custom_id`と結果タイプに応じて異なることを実行できます。以下は結果の例です：

```json .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

結果にエラーがある場合、その`result.error`は標準的な[エラー形状](/docs/ja/api/errors#error-shapes)に設定されます。

<Tip>
  **バッチ結果は入力順序と一致しない可能性があります**

バッチ結果は任意の順序で返される可能性があり、バッチが作成されたときのリクエストの順序と一致しない場合があります。上記の例では、2番目のバッチリクエストの結果が最初の結果の前に返されます。結果を対応するリクエストと正しく照合するには、常に`custom_id`フィールドを使用してください。
</Tip>

### Message Batchのキャンセル

[キャンセルエンドポイント](/docs/ja/api/canceling-message-batches)を使用して、現在処理中のMessage Batchをキャンセルできます。キャンセル直後、バッチの`processing_status`は`canceling`になります。上記で説明したのと同じポーリング技術を使用して、キャンセルが完了するまで待つことができます。キャンセルされたバッチは`ended`のステータスで終了し、キャンセル前に処理されたリクエストの部分的な結果を含む可能性があります。

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

応答はバッチを`canceling`状態で表示します：

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

### Message Batches でプロンプトキャッシングを使用する

Message Batches API はプロンプトキャッシングをサポートしており、バッチリクエストのコストと処理時間を削減できる可能性があります。プロンプトキャッシングと Message Batches の価格割引は重ねることができるため、両方の機能を一緒に使用すると、さらに大きなコスト削減が実現します。ただし、バッチリクエストは非同期で同時に処理されるため、キャッシュヒットはベストエフォート方式で提供されます。ユーザーは通常、トラフィックパターンに応じて 30% から 98% のキャッシュヒット率を経験します。

バッチリクエストでキャッシュヒットの可能性を最大化するには:

1. バッチ内のすべての Message リクエストに同一の `cache_control` ブロックを含める
2. キャッシュエントリが 5 分のライフタイム後に期限切れになるのを防ぐため、リクエストの安定したストリームを維持する
3. できるだけ多くのキャッシュされたコンテンツを共有するようにリクエストを構造化する

バッチでプロンプトキャッシングを実装する例:

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

この例では、バッチ内の両方のリクエストに同一のシステムメッセージと、キャッシュヒットの可能性を高めるために `cache_control` でマークされた Pride and Prejudice の完全なテキストが含まれています。

### 効果的なバッチ処理のベストプラクティス

Batches API を最大限に活用するには:

- バッチ処理ステータスを定期的に監視し、失敗したリクエストに対して適切なリトライロジックを実装する。
- 順序が保証されないため、結果をリクエストと簡単にマッチングできるように意味のある `custom_id` 値を使用する。
- 非常に大きなデータセットを複数のバッチに分割して、より良い管理性を実現することを検討する。
- Messages API で単一のリクエスト形状をドライラン実行して、検証エラーを回避する。

### 一般的な問題のトラブルシューティング

予期しない動作が発生している場合:

- バッチリクエストの合計サイズが 256 MB を超えていないことを確認する。リクエストサイズが大きすぎる場合、413 `request_too_large` エラーが発生する可能性があります。
- バッチ内のすべてのリクエストで[サポートされているモデル](#supported-models)を使用していることを確認する。
- バッチ内の各リクエストが一意の `custom_id` を持っていることを確認する。
- バッチの `created_at` (処理 `ended_at` ではなく) 時刻から 29 日未満であることを確認する。29 日以上経過している場合、結果は表示されなくなります。
- バッチがキャンセルされていないことを確認する。

バッチ内の 1 つのリクエストの失敗は、他のリクエストの処理に影響しないことに注意してください。

---
## バッチストレージとプライバシー

- **ワークスペース分離**: バッチは、それが作成されたワークスペース内で分離されます。それらは、そのワークスペースに関連付けられた API キー、またはコンソールでワークスペースバッチを表示する権限を持つユーザーのみがアクセスできます。

- **結果の可用性**: バッチ結果は、バッチが作成されてから 29 日間利用可能であり、取得と処理に十分な時間を提供します。

---
## FAQ

  <section title="バッチの処理にはどのくらいの時間がかかりますか?">

    バッチは処理に最大 24 時間かかる場合がありますが、多くはより早く完了します。実際の処理時間は、バッチのサイズ、現在の需要、およびリクエストボリュームによって異なります。バッチが期限切れになり、24 時間以内に完了しない可能性があります。
  
</section>

  <section title="Batches API はすべてのモデルで利用可能ですか?">

    サポートされているモデルのリストについては、[上記](#supported-models)を参照してください。
  
</section>

  <section title="Message Batches API を他の API 機能と一緒に使用できますか?">

    はい、Message Batches API は、ベータ機能を含む Messages API で利用可能なすべての機能をサポートしています。ただし、バッチリクエストではストリーミングはサポートされていません。
  
</section>

  <section title="Message Batches API は価格にどのように影響しますか?">

    Message Batches API は、標準 API 価格と比較して、すべての使用量に対して 50% の割引を提供します。これは入力トークン、出力トークン、および特別なトークンに適用されます。価格の詳細については、[価格ページ](https://claude.com/pricing#anthropic-api)をご覧ください。
  
</section>

  <section title="バッチを送信した後で更新できますか?">

    いいえ、バッチが送信されると、変更することはできません。変更が必要な場合は、現在のバッチをキャンセルして新しいバッチを送信する必要があります。キャンセルは即座に有効にならない場合があることに注意してください。
  
</section>

  <section title="Message Batches API のレート制限はありますか? また、Messages API のレート制限と相互作用しますか?">

    Message Batches API には、処理が必要なリクエスト数の制限に加えて、HTTP リクエストベースのレート制限があります。[Message Batches API レート制限](/docs/ja/api/rate-limits#message-batches-api)を参照してください。Batches API の使用は、Messages API のレート制限に影響しません。
  
</section>

  <section title="バッチリクエストのエラーをどのように処理しますか?">

    結果を取得するとき、各リクエストには、それが `succeeded`、`errored`、`canceled`、または `expired` であるかを示す `result` フィールドがあります。`errored` の結果の場合、追加のエラー情報が提供されます。[API リファレンス](/docs/ja/api/creating-message-batches)でエラーレスポンスオブジェクトを表示してください。
  
</section>

  <section title="Message Batches API はプライバシーとデータ分離をどのように処理しますか?">

    Message Batches API は、強力なプライバシーとデータ分離対策で設計されています:

    1. バッチとその結果は、それが作成されたワークスペース内で分離されます。これは、同じワークスペースからの API キーのみがアクセスできることを意味します。
    2. バッチ内の各リクエストは独立して処理され、リクエスト間のデータ漏洩はありません。
    3. 結果は限定された時間 (29 日) のみ利用可能であり、[データ保持ポリシー](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data)に従います。
    4. コンソールでバッチ結果をダウンロードすることは、組織レベルまたはワークスペースごとに無効にできます。
  
</section>

  <section title="Message Batches API でプロンプトキャッシングを使用できますか?">

    はい、Message Batches API でプロンプトキャッシングを使用することは可能です。ただし、非同期バッチリクエストは同時に任意の順序で処理される可能性があるため、キャッシュヒットはベストエフォート方式で提供されます。
  
</section>