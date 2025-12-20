# Microsoft Foundry での Claude

Azure ネイティブエンドポイントと認証を使用して Microsoft Foundry 経由で Claude モデルにアクセスします。

---

このガイドでは、Python、TypeScript、または直接 HTTP リクエストを使用して Foundry で Claude をセットアップし、API 呼び出しを行うプロセスについて説明します。Foundry で Claude にアクセスできるようになると、Claude の使用に対して Microsoft Marketplace で Azure サブスクリプションを通じて課金され、Azure サブスクリプションを通じてコストを管理しながら Claude の最新機能にアクセスできます。

地域の可用性: 起動時に、Claude は Foundry リソースで Global Standard デプロイメント タイプとして利用可能であり、US DataZone は近日中に利用可能になります。Microsoft Marketplace での Claude の価格は Anthropic の標準 API 価格を使用しています。詳細については、[価格ページ](https://claude.com/pricing#api)をご覧ください。

## プレビュー

このプレビュー プラットフォーム統合では、Claude モデルは Anthropic のインフラストラクチャ上で実行されます。これは Azure を通じた課金とアクセスのための商用統合です。Microsoft の独立したプロセッサとして、Microsoft Foundry 経由で Claude を使用する顧客は Anthropic のデータ使用条件に従います。Anthropic は、ゼロデータ保持の可用性を含む、業界をリードするセキュリティとデータコミットメントを引き続き提供しています。

## 前提条件

開始する前に、以下があることを確認してください:

- アクティブな Azure サブスクリプション
- [Foundry](https://ai.azure.com/) へのアクセス
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) がインストールされていること (オプション、リソース管理用)

## SDK をインストールする

Anthropic の [クライアント SDK](/docs/ja/api/client-sdks) は、プラットフォーム固有のパッケージを通じて Foundry をサポートしています。

```bash
# Python
pip install -U "anthropic"

# Typescript
npm install @anthropic-ai/foundry-sdk
```

## プロビジョニング

Foundry は 2 レベルの階層を使用します: **リソース** はセキュリティと課金設定を含み、**デプロイメント** は API 経由で呼び出すモデル インスタンスです。まず Foundry リソースを作成し、その中に 1 つ以上の Claude デプロイメントを作成します。

### Foundry リソースのプロビジョニング

Foundry リソースを作成します。これは Azure でサービスを使用および管理するために必要です。これらの手順に従って [Foundry リソース](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource?pivots=azportal#create-a-new-azure-ai-foundry-resource) を作成できます。または、[Foundry プロジェクト](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry) を作成することから始めることもできます。これには Foundry リソースの作成が含まれます。

リソースをプロビジョニングするには:

1. [Foundry ポータル](https://ai.azure.com/)に移動します
2. 新しい Foundry リソースを作成するか、既存のものを選択します
3. Azure が発行した API キーまたは Entra ID を使用してロールベースのアクセス制御のアクセス管理を構成します
4. オプションで、リソースをプライベート ネットワーク (Azure Virtual Network) の一部になるように構成して、セキュリティを強化します
5. リソース名をメモしておきます。これを API エンドポイントで `{resource}` として使用します (例: `https://{resource}.services.ai.azure.com/anthropic/v1/*`)

### Foundry デプロイメントの作成

リソースを作成した後、Claude モデルをデプロイして API 呼び出しで利用可能にします:

1. Foundry ポータルで、リソースに移動します
2. **Models + endpoints** に移動し、**+ Deploy model** > **Deploy base model** を選択します
3. Claude モデル (例: `claude-sonnet-4-5`) を検索して選択します
4. デプロイメント設定を構成します:
   - **Deployment name**: デフォルトではモデル ID ですが、カスタマイズできます (例: `my-claude-deployment`)。デプロイメント名は作成後に変更することはできません。
   - **Deployment type**: Global Standard を選択します (Claude に推奨)
5. **Deploy** を選択し、プロビジョニングが完了するまで待ちます
6. デプロイされたら、**Keys and Endpoint** でエンドポイント URL とキーを見つけることができます

<Note>
  選択したデプロイメント名は、API リクエストの `model` パラメータで渡す値になります。同じモデルの複数のデプロイメントを異なる名前で作成して、個別の構成またはレート制限を管理できます。
</Note>

## 認証

Foundry の Claude は 2 つの認証方法をサポートしています: API キーと Entra ID トークン。どちらの方法も `https://{resource}.services.ai.azure.com/anthropic/v1/*` 形式の Azure ホスト エンドポイントを使用します。

### API キー認証

Foundry Claude リソースをプロビジョニングした後、Foundry ポータルから API キーを取得できます:

1. Foundry ポータルでリソースに移動します
2. **Keys and Endpoint** セクションに移動します
3. 提供されている API キーの 1 つをコピーします
4. リクエストで `api-key` または `x-api-key` ヘッダーを使用するか、SDK に提供します

Python と TypeScript SDK には、API キーとリソース名またはベース URL が必要です。SDK は、定義されている場合、以下の環境変数から自動的にこれらを読み取ります:

- `ANTHROPIC_FOUNDRY_API_KEY` - API キー
- `ANTHROPIC_FOUNDRY_RESOURCE` - リソース名 (例: `example-resource`)
- `ANTHROPIC_FOUNDRY_BASE_URL` - リソース名の代わり。完全なベース URL (例: `https://example-resource.services.ai.azure.com/anthropic/`)

<Note>
`resource` と `base_url` パラメータは相互に排他的です。リソース名 (SDK が URL を `https://{resource}.services.ai.azure.com/anthropic/` として構築するために使用) または完全なベース URL のいずれかを提供します。
</Note>

**API キーを使用した例:**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry

client = AnthropicFoundry(
    api_key=os.environ.get("ANTHROPIC_FOUNDRY_API_KEY"),
    resource='example-resource', # your resource name
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";

const client = new AnthropicFoundry({
  apiKey: process.env.ANTHROPIC_FOUNDRY_API_KEY,
  resource: 'example-resource', // your resource name
});

const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "api-key: YOUR_AZURE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Warning>
API キーを安全に保管してください。バージョン管理にコミットしたり、公開で共有したりしないでください。API キーにアクセスできる人は誰でも、Foundry リソース経由で Claude にリクエストを行うことができます。
</Warning>

## Microsoft Entra 認証

セキュリティの強化と一元化されたアクセス管理のために、Entra ID (以前の Azure Active Directory) トークンを使用できます:

1. Foundry リソースの Entra 認証を有効にします
2. Entra ID からアクセス トークンを取得します
3. `Authorization: Bearer {TOKEN}` ヘッダーでトークンを使用します

**Entra ID を使用した例:**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Get Azure Entra ID token using token provider pattern
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)

# Create client with Entra ID authentication
client = AnthropicFoundry(
    resource='example-resource', # your resource name
    azure_ad_token_provider=token_provider  # Use token provider for Entra ID auth
)

# Make request
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";

// Get Entra ID token using token provider pattern
const credential = new DefaultAzureCredential();
const tokenProvider = getBearerTokenProvider(
  credential,
  "https://cognitiveservices.azure.com/.default"
);

// Create client with Entra ID authentication
const client = new AnthropicFoundry({
  resource: 'example-resource', // your resource name
  azureADTokenProvider: tokenProvider, // Use token provider for Entra ID auth
});

// Make request
const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
# Get Azure Entra ID token
ACCESS_TOKEN=$(az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv)

# Make request with token. Replace {resource} with your resource name
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Note>
Azure Entra ID 認証を使用すると、Azure RBAC を使用してアクセスを管理し、組織の ID 管理と統合し、API キーを手動で管理することを避けることができます。
</Note>

## 相関リクエスト ID

Foundry は、デバッグとトレースのために HTTP レスポンス ヘッダーにリクエスト識別子を含めます。サポートに連絡する場合は、`request-id` と `apim-request-id` の両方の値を提供して、チームが Anthropic と Azure の両方のシステム全体でリクエストをすばやく特定して調査できるようにします。

## サポートされている機能

Foundry の Claude は Claude の強力な機能のほとんどをサポートしています。現在サポートされているすべての機能は [ここ](/docs/ja/build-with-claude/overview) で見つけることができます。

### サポートされていない機能

- Admin API (`/v1/organizations/*` エンドポイント)
- Models API (`/v1/models`)
- Message Batch API (`/v1/messages/batches`)

## API レスポンス

Foundry からの Claude の API レスポンスは、標準的な [Anthropic API レスポンス形式](/docs/ja/api/messages) に従います。これには、リクエストの詳細なトークン消費情報を提供するレスポンス本体の `usage` オブジェクトが含まれます。`usage` オブジェクトは、すべてのプラットフォーム (ファーストパーティ API、Foundry、Amazon Bedrock、Google Vertex AI) 全体で一貫しています。

Foundry に固有のレスポンス ヘッダーの詳細については、[相関リクエスト ID セクション](#correlation-request-ids) を参照してください。

## API モデル ID とデプロイメント

以下の Claude モデルは Foundry を通じて利用可能です。最新世代モデル (Sonnet 4.5、Opus 4.1、Haiku 4.5) は最も高度な機能を提供します:

| Model             | Default Deployment Name     |
| :---------------- | :-------------------------- |
| Claude Opus 4.5   | `claude-opus-4-5`  |
| Claude Sonnet 4.5 | `claude-sonnet-4-5`         |
| Claude Opus 4.1   | `claude-opus-4-1`           |
| Claude Haiku 4.5  | `claude-haiku-4-5`          |

デフォルトでは、デプロイメント名は上記のモデル ID と一致します。ただし、Foundry ポータルで異なる名前のカスタム デプロイメントを作成して、異なる構成、バージョン、またはレート制限を管理できます。API リクエストでは、デプロイメント名 (必ずしもモデル ID ではない) を使用します。

## 監視とログ

Azure は、標準的な Azure パターンを通じて Claude の使用に対する包括的な監視とログ機能を提供します:

- **Azure Monitor**: API 使用状況、レイテンシ、エラー率を追跡します
- **Azure Log Analytics**: リクエスト/レスポンス ログをクエリして分析します
- **Cost Management**: Claude の使用に関連するコストを監視および予測します

Anthropic は、使用パターンを理解し、潜在的な問題を調査するために、少なくとも 30 日間のローリング ベースでアクティビティをログすることをお勧めします。

<Note>
Azure のログ サービスは Azure サブスクリプション内で構成されます。ログを有効にしても、課金とサービス運用に必要な範囲を超えて、Microsoft または Anthropic がコンテンツにアクセスすることはありません。
</Note>

## トラブルシューティング

### 認証エラー

**エラー**: `401 Unauthorized` または `Invalid API key`

- **解決策**: API キーが正しいことを確認してください。Azure ポータルの Claude リソースの **Keys and Endpoint** から新しい API キーを取得できます。
- **解決策**: Azure Entra ID を使用している場合は、アクセス トークンが有効で、期限切れになっていないことを確認してください。トークンは通常 1 時間後に期限切れになります。

**エラー**: `403 Forbidden`

- **解決策**: Azure アカウントに必要なアクセス許可がない可能性があります。適切な Azure RBAC ロール (例: "Cognitive Services OpenAI User") が割り当てられていることを確認してください。

### レート制限

**エラー**: `429 Too Many Requests`

- **解決策**: レート制限を超えています。アプリケーションに指数バックオフと再試行ロジックを実装します。
- **解決策**: Azure ポータルまたは Azure サポート経由でレート制限の増加をリクエストすることを検討してください。

#### レート制限ヘッダー

Foundry は、Anthropic の標準レート制限ヘッダー (`anthropic-ratelimit-tokens-limit`、`anthropic-ratelimit-tokens-remaining`、`anthropic-ratelimit-tokens-reset`、`anthropic-ratelimit-input-tokens-limit`、`anthropic-ratelimit-input-tokens-remaining`、`anthropic-ratelimit-input-tokens-reset`、`anthropic-ratelimit-output-tokens-limit`、`anthropic-ratelimit-output-tokens-remaining`、`anthropic-ratelimit-output-tokens-reset`) をレスポンスに含めません。代わりに Azure の監視ツールを使用してレート制限を管理します。

### モデルとデプロイメントのエラー

**エラー**: `Model not found` または `Deployment not found`

- **解決策**: 正しいデプロイメント名を使用していることを確認してください。カスタム デプロイメントを作成していない場合は、デフォルトのモデル ID (例: `claude-sonnet-4-5`) を使用します。
- **解決策**: モデル/デプロイメントが Azure リージョンで利用可能であることを確認してください。

**エラー**: `Invalid model parameter`

- **解決策**: model パラメータには、Foundry ポータルでカスタマイズできるデプロイメント名が含まれている必要があります。デプロイメントが存在し、適切に構成されていることを確認してください。

## 追加リソース

- **Foundry ドキュメント**: [ai.azure.com/catalog](https://ai.azure.com/catalog/publishers/anthropic)
- **Azure 価格**: [azure.microsoft.com/en-us/pricing](https://azure.microsoft.com/en-us/pricing/)
- **Anthropic 価格詳細**: [価格ドキュメント](/docs/ja/about-claude/pricing#third-party-platform-pricing)
- **認証ガイド**: 上記の [認証セクション](#authentication) を参照してください
- **Azure ポータル**: [portal.azure.com](https://portal.azure.com/)