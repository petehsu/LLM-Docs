# Amazon Bedrock上のClaude

AnthropicのClaudeモデルは、Amazon Bedrockを通じて一般提供されています。

---

Bedrockを通じてClaudeを呼び出すことは、Anthropicのクライアント SDK を使用してClaudeを呼び出す方法とは若干異なります。このガイドでは、PythonまたはTypeScriptのいずれかでBedrock上のClaudeへのAPI呼び出しを完了するプロセスについて説明します。

このガイドでは、すでに[AWSアカウント](https://portal.aws.amazon.com/billing/signup)にサインアップし、プログラムによるアクセスを設定していることを前提としています。

## AWS CLIのインストールと設定

1. [AWS CLIのバージョン](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)をバージョン`2.13.23`以上でインストールします
2. AWS configureコマンドを使用してAWSの認証情報を設定します（[AWS CLIの設定](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)を参照）。または、AWSダッシュボード内の「コマンドラインまたはプログラムによるアクセス」に移動して、ポップアップモーダルの指示に従い、認証情報を見つけます。
3. 認証情報が機能していることを確認します：

```bash Shell
aws sts get-caller-identity
```

## BedrockにアクセスするためのSDKをインストール

Anthropicの[クライアント SDK](/docs/ja/api/client-sdks)はBedrockをサポートしています。また、`boto3`のようなAWS SDKを直接使用することもできます。

<CodeGroup>
  ```python Python
  pip install -U "anthropic[bedrock]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/bedrock-sdk
  ```

  ```python Boto3 (Python)
  pip install boto3>=1.28.59
  ```
</CodeGroup>

## Bedrockへのアクセス

### Anthropicモデルをサブスクライブ

[AWS Console > Bedrock > Model Access](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess)に移動して、Anthropicモデルへのアクセスをリクエストします。Anthropicモデルの可用性はリージョンによって異なることに注意してください。最新情報については、[AWSドキュメント](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html)を参照してください。

#### APIモデルID

| モデル | ベースBedrockモデルID | `global` | `us` | `eu` | `jp` | `apac` |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Claude Sonnet 4.5 | anthropic.claude-sonnet-4-5-20250929-v1:0 | Yes | Yes | Yes | Yes | No |
| Claude Sonnet 4 | anthropic.claude-sonnet-4-20250514-v1:0 | Yes | Yes | Yes | No | Yes |
| Claude Sonnet 3.7 <Tooltip tooltipContent="2025年10月28日時点で廃止予定。">⚠️</Tooltip> | anthropic.claude-3-7-sonnet-20250219-v1:0 | No | Yes | Yes | No | Yes |
| Claude Opus 4.5 | anthropic.claude-opus-4-5-20251101-v1:0 | Yes | Yes | Yes | No | No |
| Claude Opus 4.1 | anthropic.claude-opus-4-1-20250805-v1:0 | No | Yes | No | No | No |
| Claude Opus 4 | anthropic.claude-opus-4-20250514-v1:0 | No | Yes | No | No | No |
| Claude Opus 3 <Tooltip tooltipContent="2025年6月30日時点で廃止予定。">⚠️</Tooltip> | anthropic.claude-3-opus-20240229-v1:0 | No | Yes | No | No | No |
| Claude Haiku 4.5 | anthropic.claude-haiku-4-5-20251001-v1:0 | Yes | Yes | Yes | No | No |
| Claude Haiku 3.5 | anthropic.claude-3-5-haiku-20241022-v1:0 | No | Yes | No | No | No |
| Claude Haiku 3 | anthropic.claude-3-haiku-20240307-v1:0 | No | Yes | Yes | No | Yes |

リージョナルとグローバルモデルIDの詳細については、以下の[グローバルエンドポイント対リージョナルエンドポイント](#global-vs-regional-endpoints)セクションを参照してください。

### 利用可能なモデルをリスト表示

以下の例は、Bedrockを通じて利用可能なすべてのClaudeモデルのリストを出力する方法を示しています：

<CodeGroup>
  ```bash AWS CLI
  aws bedrock list-foundation-models --region=us-west-2 --by-provider anthropic --query "modelSummaries[*].modelId"
  ```

  ```python Boto3 (Python)
  import boto3

  bedrock = boto3.client(service_name="bedrock")
  response = bedrock.list_foundation_models(byProvider="anthropic")

  for summary in response["modelSummaries"]:
      print(summary["modelId"])
  ```
</CodeGroup>

### リクエストの作成

以下の例は、Bedrock上のClaudeからテキストを生成する方法を示しています：

<CodeGroup>
  ```python Python
  from anthropic import AnthropicBedrock

  client = AnthropicBedrock(
      # 以下のキーを提供するか、デフォルトのAWS認証情報プロバイダー（例：
      # ~/.aws/credentialsまたは「AWS_SECRET_ACCESS_KEY」および「AWS_ACCESS_KEY_ID」環境変数）を使用して認証します。
      aws_access_key="<access key>",
      aws_secret_key="<secret key>",
      # 一時的な認証情報はaws_session_tokenで使用できます。
      # 詳細については、https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.htmlを参照してください。
      aws_session_token="<session_token>",
      # aws_regionはリクエストが行われるAWSリージョンを変更します。デフォルトでは、AWS_REGIONを読み込み、
      # それが存在しない場合はus-east-1にデフォルト設定されます。~/.aws/configのリージョンは読み込まれないことに注意してください。
      aws_region="us-west-2",
  )

  message = client.messages.create(
      model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
      max_tokens=256,
      messages=[{"role": "user", "content": "Hello, world"}]
  )
  print(message.content)
  ```

  ```typescript TypeScript
  import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

  const client = new AnthropicBedrock({
    // 以下のキーを提供するか、デフォルトのAWS認証情報プロバイダー（例：
    // ~/.aws/credentialsまたは「AWS_SECRET_ACCESS_KEY」および「AWS_ACCESS_KEY_ID」環境変数）を使用して認証します。
    awsAccessKey: '<access key>',
    awsSecretKey: '<secret key>',

    // 一時的な認証情報はawsSessionTokenで使用できます。
    // 詳細については、https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.htmlを参照してください。
    awsSessionToken: '<session_token>',

    // awsRegionはリクエストが行われるAWSリージョンを変更します。デフォルトでは、AWS_REGIONを読み込み、
    // それが存在しない場合はus-east-1にデフォルト設定されます。~/.aws/configのリージョンは読み込まれないことに注意してください。
    awsRegion: 'us-west-2',
  });

  async function main() {
    const message = await client.messages.create({
      model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
      max_tokens: 256,
      messages: [{"role": "user", "content": "Hello, world"}]
    });
    console.log(message);
  }
  main().catch(console.error);
  ```

  ```python Boto3 (Python)
  import boto3
  import json

  bedrock = boto3.client(service_name="bedrock-runtime")
  body = json.dumps({
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "Hello, world"}],
    "anthropic_version": "bedrock-2023-05-31"
  })

  response = bedrock.invoke_model(body=body, modelId="global.anthropic.claude-sonnet-4-5-20250929-v1:0")

  response_body = json.loads(response.get("body").read())
  print(response_body.get("content"))
  ```
</CodeGroup>

詳細については、[クライアント SDK](/docs/ja/api/client-sdks)を参照してください。また、公式のBedrockドキュメントは[こちら](https://docs.aws.amazon.com/bedrock/)です。

## アクティビティログ

Bedrockは[呼び出しログサービス](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html)を提供しており、顧客はプロンプトと使用に関連する完了をログに記録できます。

Anthropicは、アクティビティを理解し、潜在的な悪用を調査するために、少なくとも30日間のローリングベースでアクティビティをログに記録することをお勧めします。

<Note>
このサービスをオンにしても、AWSまたはAnthropicはコンテンツへのアクセス権を得られません。
</Note>

## 機能サポート
Bedrockで現在サポートされているすべての機能は[こちら](/docs/ja/api/overview)で確認できます。

### Bedrock上のPDFサポート

PDFサポートはAmazon Bedrock上でConverse APIとInvokeModel APIの両方を通じて利用可能です。PDF処理機能と制限の詳細については、[PDFサポートドキュメント](/docs/ja/build-with-claude/pdf-support#amazon-bedrock-pdf-support)を参照してください。

**Converse APIユーザーの重要な考慮事項：**
- ビジュアルPDF分析（グラフ、画像、レイアウト）には引用を有効にする必要があります
- 引用がない場合、基本的なテキスト抽出のみが利用可能です
- 強制的な引用なしで完全に制御するには、InvokeModel APIを使用します

2つのドキュメント処理モードとその制限の詳細については、[PDFサポートガイド](/docs/ja/build-with-claude/pdf-support#amazon-bedrock-pdf-support)を参照してください。

### 100万トークンコンテキストウィンドウ

Claude Sonnet 4および4.5は、Amazon Bedrock上で[100万トークンコンテキストウィンドウ](/docs/ja/build-with-claude/context-windows#1m-token-context-window)をサポートしています。

<Note>
100万トークンコンテキストウィンドウは現在ベータ版です。拡張コンテキストウィンドウを使用するには、[Bedrock APIリクエスト](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-request-response.html)に`context-1m-2025-08-07`ベータヘッダーを含めます。
</Note>

## グローバルエンドポイント対リージョナルエンドポイント

**Claude Sonnet 4.5およびすべての将来のモデル**から始まり、Amazon Bedrockは2つのエンドポイントタイプを提供します：

- **グローバルエンドポイント**：最大可用性のための動的ルーティング
- **リージョナルエンドポイント**：特定の地理的リージョンを通じた保証されたデータルーティング

リージョナルエンドポイントには、グローバルエンドポイントよりも10%の価格プレミアムが含まれます。

<Note>
これはClaude Sonnet 4.5および将来のモデルにのみ適用されます。古いモデル（Claude Sonnet 4、Opus 4、およびそれ以前）は既存の価格構造を維持します。
</Note>

### 各オプションを使用する場合

**グローバルエンドポイント（推奨）：**
- 最大可用性とアップタイムを提供します
- リクエストを利用可能な容量のあるリージョンに動的にルーティングします
- 価格プレミアムなし
- データレジデンシーが柔軟なアプリケーションに最適です

**リージョナルエンドポイント（CRIS）：**
- トラフィックを特定の地理的リージョンを通じてルーティングします
- データレジデンシーとコンプライアンス要件に必要です
- 米国、EU、日本、オーストラリアで利用可能です
- 10%の価格プレミアムは、専用リージョナル容量のインフラストラクチャコストを反映しています

### 実装

**グローバルエンドポイントを使用（Sonnet 4.5および4のデフォルト）：**

Claude Sonnet 4.5および4のモデルIDには、すでに`global.`プレフィックスが含まれています：

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

message = client.messages.create(
    model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

const message = await client.messages.create({
  model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

**リージョナルエンドポイントを使用（CRIS）：**

リージョナルエンドポイントを使用するには、モデルIDから`global.`プレフィックスを削除します：

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

# US リージョナルエンドポイント（CRIS）を使用
message = client.messages.create(
    model="anthropic.claude-sonnet-4-5-20250929-v1:0",  # global. プレフィックスなし
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

// US リージョナルエンドポイント（CRIS）を使用
const message = await client.messages.create({
  model: 'anthropic.claude-sonnet-4-5-20250929-v1:0',  // global. プレフィックスなし
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

### 追加リソース

- **AWS Bedrockの価格設定：** [aws.amazon.com/bedrock/pricing](https://aws.amazon.com/bedrock/pricing/)
- **AWS価格ドキュメント：** [Bedrockの価格設定ガイド](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
- **AWSブログ投稿：** [Amazon BedrockでのClaude Sonnet 4.5の紹介](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
- **Anthropicの価格設定詳細：** [価格設定ドキュメント](/docs/ja/about-claude/pricing#third-party-platform-pricing)