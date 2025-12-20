# API概要

Claude APIはRESTful APIで、Claudeモデルへのプログラマティックアクセスを提供します。Messages APIを使用して会話型インタラクションを実現します。

---

Claude APIは`https://api.anthropic.com`のRESTful APIで、Claudeモデルへのプログラマティックアクセスを提供します。プライマリAPIはMessages API（`POST /v1/messages`）で、会話型インタラクションに使用されます。

<Note>
**Claudeは初めてですか？** [Get started](/docs/ja/get-started)で前提条件と最初のAPI呼び出しを確認するか、[Working with Messages](/docs/ja/build-with-claude/working-with-messages)でリクエスト/レスポンスパターンと例を参照してください。
</Note>

## 前提条件

Claude APIを使用するには、以下が必要です：

- [Anthropic Consoleアカウント](https://console.anthropic.com)
- [APIキー](/settings/keys)

ステップバイステップのセットアップ手順については、[Get started](/docs/ja/get-started)を参照してください。

## 利用可能なAPI

Claude APIには以下のAPIが含まれています：

**一般提供：**
- **[Messages API](/docs/ja/api/messages)**: Claudeにメッセージを送信して会話型インタラクションを実現します（`POST /v1/messages`）
- **[Message Batches API](/docs/ja/api/creating-message-batches)**: 大量のMessagesリクエストを非同期で処理し、50%のコスト削減を実現します（`POST /v1/messages/batches`）
- **[Token Counting API](/docs/ja/api/messages-count-tokens)**: メッセージ内のトークンをカウントしてコストとレート制限を管理します（`POST /v1/messages/count_tokens`）
- **[Models API](/docs/ja/api/models-list)**: 利用可能なClaudeモデルとその詳細をリストアップします（`GET /v1/models`）

**ベータ：**
- **[Files API](/docs/ja/api/files-create)**: 複数のAPI呼び出しで使用するファイルをアップロードして管理します（`POST /v1/files`、`GET /v1/files`）
- **[Skills API](/docs/ja/api/skills/create-skill)**: カスタムエージェントスキルを作成して管理します（`POST /v1/skills`、`GET /v1/skills`）

すべてのエンドポイント、パラメータ、レスポンススキーマを含む完全なAPIリファレンスについては、ナビゲーションに記載されているAPIリファレンスページを参照してください。ベータ機能にアクセスするには、[Beta headers](/docs/ja/api/beta-headers)を参照してください。

## 認証

Claude APIへのすべてのリクエストには、以下のヘッダーを含める必要があります：

| ヘッダー | 値 | 必須 |
|--------|-------|----------|
| `x-api-key` | Consoleから取得したAPIキー | はい |
| `anthropic-version` | APIバージョン（例：`2023-06-01`） | はい |
| `content-type` | `application/json` | はい |

[Client SDKs](#client-sdks)を使用している場合、SDKはこれらのヘッダーを自動的に送信します。APIバージョニングの詳細については、[API versions](/docs/ja/api/versioning)を参照してください。

### APIキーの取得

APIはウェブ[Console](https://console.anthropic.com/)を通じて利用可能です。[Workbench](https://console.anthropic.com/workbench)を使用してブラウザでAPIを試すことができ、その後[Account Settings](https://console.anthropic.com/settings/keys)でAPIキーを生成できます。[workspaces](https://console.anthropic.com/settings/workspaces)を使用してAPIキーを分割し、ユースケースごとに[支出を管理](/docs/ja/api/rate-limits)できます。

## Client SDKs

Anthropicは、認証、リクエストフォーマット、エラーハンドリングなどを処理することでAPI統合を簡素化する公式SDKを提供しています。

**メリット**：
- 自動ヘッダー管理（x-api-key、anthropic-version、content-type）
- タイプセーフなリクエストとレスポンスハンドリング
- 組み込みリトライロジックとエラーハンドリング
- ストリーミングサポート
- リクエストタイムアウトと接続管理

**例**（Python）：
```python
from anthropic import Anthropic

client = Anthropic()  # 環境からANTHROPIC_API_KEYを読み込みます
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello, Claude"}]
)
```

Client SDKsのリストとそれぞれのインストール手順については、[Client SDKs](/docs/ja/api/client-sdks)を参照してください。

## Claude API対サードパーティプラットフォーム

ClaudeはAnthropicの直接APIとパートナープラットフォームを通じて利用可能です。インフラストラクチャ、コンプライアンス要件、価格設定の好みに基づいて選択してください。

### Claude API

- 最新のモデルと機能への**直接アクセス**（最初に利用可能）
- **Anthropicの請求とサポート**
- **最適な用途**: 新しい統合、完全な機能アクセス、Anthropicとの直接的な関係

### サードパーティプラットフォームAPI

AWS、Google Cloud、またはMicrosoft Azureを通じてClaudeにアクセスします：
- クラウドプロバイダーの請求とIAMに**統合**
- 直接APIからの**機能遅延または相違がある場合があります**
- **最適な用途**: 既存のクラウドコミットメント、特定のコンプライアンス要件、統合されたクラウド請求

| プラットフォーム | プロバイダー | ドキュメント |
|----------|----------|---------------|
| Amazon Bedrock | AWS | [Claude on Amazon Bedrock](/docs/ja/build-with-claude/claude-on-amazon-bedrock) |
| Vertex AI | Google Cloud | [Claude on Vertex AI](/docs/ja/build-with-claude/claude-on-vertex-ai) |
| Azure AI | Microsoft Azure | [Claude on Azure AI](/docs/ja/build-with-claude/claude-in-microsoft-foundry) |

<Note>
プラットフォーム間の機能の可用性については、[Features overview](/docs/ja/build-with-claude/overview)を参照してください。
</Note>

## リクエストとレスポンスの形式

### リクエストサイズ制限

APIはエンドポイントに応じて異なる最大リクエストサイズを持っています：

| エンドポイント | 最大サイズ |
|----------|--------------|
| 標準エンドポイント（Messages、Token Counting） | 32 MB |
| [Batch API](/docs/ja/build-with-claude/batch-processing) | 256 MB |
| [Files API](/docs/ja/build-with-claude/files) | 500 MB |

これらの制限を超えると、413 `request_too_large`エラーが返されます。

### レスポンスヘッダー

Claude APIはすべてのレスポンスに以下のヘッダーを含めます：

- `request-id`: リクエストのグローバルに一意な識別子
- `anthropic-organization-id`: リクエストで使用されたAPIキーに関連付けられた組織ID

## レート制限と可用性

### レート制限

APIは悪用を防ぎ、容量を管理するためにレート制限と支出制限を実施します。制限は、APIを使用するにつれて自動的に増加する使用層に編成されています。各層には以下があります：

- **支出制限**: API使用の最大月額コスト
- **レート制限**: 1分あたりの最大リクエスト数（RPM）とトークン数（TPM）

[Console](/settings/limits)で組織の現在の制限を確認できます。より高い制限またはPriority Tier（コミットされた支出を伴う強化されたサービスレベル）については、Consoleを通じて営業に連絡してください。

制限、層、レート制限に使用されるトークンバケットアルゴリズムの詳細については、[Rate limits](/docs/ja/api/rate-limits)を参照してください。

### 可用性

Claude APIは世界中の[多くの国と地域](/docs/ja/api/supported-regions)で利用可能です。サポートされている地域ページを確認して、お客様の場所での可用性を確認してください。

## 基本的な例

Messages APIを使用した最小限のリクエストは以下の通りです：

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**レスポンス：**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8
  }
}
```

完全な例とチュートリアルについては、[Get started](/docs/ja/get-started)と[Working with Messages](/docs/ja/build-with-claude/working-with-messages)を参照してください。

## 次のステップ

<CardGroup cols={3}>
  <Card title="Get started" icon="rocket" href="/docs/ja/get-started">
    前提条件、ステップバイステップチュートリアル、複数言語の例
  </Card>
  <Card title="Working with Messages" icon="message" href="/docs/ja/build-with-claude/working-with-messages">
    リクエスト/レスポンスパターン、マルチターン会話、ベストプラクティス
  </Card>
  <Card title="Messages API Reference" icon="book" href="/docs/ja/api/messages">
    完全なAPI仕様：パラメータ、レスポンス、エラーコード
  </Card>
  <Card title="Client SDKs" icon="code" href="/docs/ja/api/client-sdks">
    Python、TypeScript、Java、Go、C#、Ruby、PHPのインストールガイド
  </Card>
  <Card title="Features overview" icon="grid" href="/docs/ja/build-with-claude/overview">
    機能を探索：キャッシング、ビジョン、ツール使用、ストリーミングなど
  </Card>
  <Card title="Rate limits" icon="gauge" href="/docs/ja/api/rate-limits">
    使用層、支出制限、トークンバケットアルゴリズムを使用したレート制限
  </Card>
</CardGroup>