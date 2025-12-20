# Vertex AI上のClaude

AnthropicのClaudeモデルは現在、[Vertex AI](https://cloud.google.com/vertex-ai)を通じて一般提供されています。

---

Claudeにアクセスするための Vertex API は[Messages API](/docs/ja/api/messages)とほぼ同一で、同じすべてのオプションをサポートしていますが、2つの主な違いがあります：

* Vertex では、`model` はリクエストボディで渡されません。代わりに、Google Cloud エンドポイント URL で指定されます。
* Vertex では、`anthropic_version` はリクエストボディで渡され（ヘッダーではなく）、値 `vertex-2023-10-16` に設定する必要があります。

Vertex は Anthropic の公式[クライアント SDK](/docs/ja/api/client-sdks)でもサポートされています。このガイドでは、Python または TypeScript のいずれかで Vertex AI 上の Claude にリクエストを行うプロセスについて説明します。

このガイドでは、Vertex AI を使用できる GCP プロジェクトがすでにあることを前提としています。セットアップに必要な情報と完全なウォークスルーについては、[Anthropic の Claude 3 モデルを使用する](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude)を参照してください。

## Vertex AI にアクセスするための SDK をインストールする

まず、選択した言語用の Anthropic の[クライアント SDK](/docs/ja/api/client-sdks)をインストールします。

<CodeGroup>
  ```python Python
  pip install -U google-cloud-aiplatform "anthropic[vertex]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/vertex-sdk
  ```
</CodeGroup>

## Vertex AI へのアクセス

### モデルの可用性

Anthropic モデルの可用性はリージョンによって異なることに注意してください。[Vertex AI Model Garden](https://cloud.google.com/model-garden)で「Claude」を検索するか、最新情報については[Claude 3 を使用する](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude)にアクセスしてください。

#### API モデル ID

| モデル                          | Vertex AI API モデル ID |
| ------------------------------ | ------------------------ |
| Claude Sonnet 4.5              | claude-sonnet-4-5@20250929 |
| Claude Sonnet 4                | claude-sonnet-4@20250514 |
| Claude Sonnet 3.7 <Tooltip tooltipContent="2025年10月28日時点で廃止予定。">⚠️</Tooltip> | claude-3-7-sonnet@20250219 |
| Claude Opus 4.5                | claude-opus-4-5@20251101 |
| Claude Opus 4.1                | claude-opus-4-1@20250805 |
| Claude Opus 4                  | claude-opus-4@20250514   |
| Claude Opus 3 <Tooltip tooltipContent="2025年6月30日時点で廃止予定。">⚠️</Tooltip> | claude-3-opus@20240229   |
| Claude Haiku 4.5               | claude-haiku-4-5@20251001 |
| Claude Haiku 3.5               | claude-3-5-haiku@20241022 |
| Claude Haiku 3                 | claude-3-haiku@20240307  |

### リクエストを行う

リクエストを実行する前に、`gcloud auth application-default login` を実行して GCP で認証する必要がある場合があります。

以下の例は、Vertex AI 上の Claude からテキストを生成する方法を示しています：
<CodeGroup>

  ```python Python
  from anthropic import AnthropicVertex

  project_id = "MY_PROJECT_ID"
  region = "global"

  client = AnthropicVertex(project_id=project_id, region=region)

  message = client.messages.create(
      model="claude-sonnet-4-5@20250929",
      max_tokens=100,
      messages=[
          {
              "role": "user",
              "content": "Hey Claude!",
          }
      ],
  )
  print(message)
  ```

  ```typescript TypeScript
  import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

  const projectId = 'MY_PROJECT_ID';
  const region = 'global';

  // Goes through the standard `google-auth-library` flow.
  const client = new AnthropicVertex({
    projectId,
    region,
  });

  async function main() {
    const result = await client.messages.create({
      model: 'claude-sonnet-4-5@20250929',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hey Claude!',
        },
      ],
    });
    console.log(JSON.stringify(result, null, 2));
  }

  main();
  ```

  ```bash Shell
  MODEL_ID=claude-sonnet-4-5@20250929
  LOCATION=global
  PROJECT_ID=MY_PROJECT_ID

  curl \
  -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://$LOCATION-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/anthropic/models/${MODEL_ID}:streamRawPredict -d \
  '{
    "anthropic_version": "vertex-2023-10-16",
    "messages": [{
      "role": "user",
      "content": "Hey Claude!"
    }],
    "max_tokens": 100,
  }'
  ```
</CodeGroup>

詳細については、[クライアント SDK](/docs/ja/api/client-sdks) と公式の [Vertex AI ドキュメント](https://cloud.google.com/vertex-ai/docs)を参照してください。

## アクティビティログ

Vertex は[リクエスト-レスポンスログサービス](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging)を提供しており、使用に関連するプロンプトと完了をログに記録できます。

Anthropic は、アクティビティを理解し、潜在的な悪用を調査するために、少なくとも 30 日間のローリングベースでアクティビティをログに記録することをお勧めします。

<Note>
このサービスを有効にしても、Google または Anthropic はコンテンツへのアクセス権を得られません。
</Note>

## 機能サポート
Vertex で現在サポートされているすべての機能は[ここ](/docs/ja/api/overview)で確認できます。

## グローバルエンドポイント対地域別エンドポイント

**Claude Sonnet 4.5 以降のすべてのモデル**から、Google Vertex AI は 2 つのエンドポイントタイプを提供しています：

- **グローバルエンドポイント**：最大可用性のための動的ルーティング
- **地域別エンドポイント**：特定の地理的リージョンを通じた保証されたデータルーティング

地域別エンドポイントには、グローバルエンドポイントよりも 10% の価格プレミアムが含まれます。

<Note>
これは Claude Sonnet 4.5 以降のモデルにのみ適用されます。古いモデル（Claude Sonnet 4、Opus 4、およびそれ以前）は既存の価格構造を維持しています。
</Note>

### 各オプションを使用する場合

**グローバルエンドポイント（推奨）：**
- 最大可用性とアップタイムを提供
- リクエストを利用可能な容量があるリージョンに動的にルーティング
- 価格プレミアムなし
- データレジデンシーが柔軟なアプリケーションに最適
- 従量課金トラフィックのみをサポート（プロビジョニングされたスループットには地域別エンドポイントが必要）

**地域別エンドポイント：**
- トラフィックを特定の地理的リージョンを通じてルーティング
- データレジデンシーとコンプライアンス要件に必須
- 従量課金とプロビジョニングされたスループットの両方をサポート
- 10% の価格プレミアムは、専用地域容量のインフラストラクチャコストを反映

### 実装

**グローバルエンドポイントを使用する（推奨）：**

クライアントを初期化するときに `region` パラメータを `"global"` に設定します：

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "global"

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'global';

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

**地域別エンドポイントを使用する：**

`"us-east1"` または `"europe-west1"` のような特定のリージョンを指定します：

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "us-east1"  # Specify a specific region

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'us-east1';  // Specify a specific region

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

### 追加リソース

- **Google Vertex AI 価格：** [cloud.google.com/vertex-ai/generative-ai/pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- **Claude モデルドキュメント：** [Vertex AI 上の Claude](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude)
- **Google ブログ投稿：** [Claude モデルのグローバルエンドポイント](https://cloud.google.com/blog/products/ai-machine-learning/global-endpoint-for-claude-models-generally-available-on-vertex-ai)
- **Anthropic 価格詳細：** [価格ドキュメント](/docs/ja/about-claude/pricing#third-party-platform-pricing)