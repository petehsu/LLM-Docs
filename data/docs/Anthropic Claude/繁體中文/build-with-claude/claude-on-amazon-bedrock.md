# Amazon Bedrock 上的 Claude

Anthropic 的 Claude 模型現已通過 Amazon Bedrock 正式推出。

---

通過 Bedrock 呼叫 Claude 與使用 Anthropic 的客戶端 SDK 呼叫 Claude 的方式略有不同。本指南將引導您完成在 Python 或 TypeScript 中向 Bedrock 上的 Claude 進行 API 呼叫的過程。

請注意，本指南假設您已經註冊了 [AWS 帳戶](https://portal.aws.amazon.com/billing/signup)並配置了程式化存取。

## 安裝並配置 AWS CLI

1. [安裝 AWS CLI 版本](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)至少為 `2.13.23` 或更新版本
2. 使用 AWS configure 命令配置您的 AWS 認證（請參閱[配置 AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)），或透過在 AWS 儀表板中導航至「命令列或程式化存取」並按照彈出視窗中的指示來尋找您的認證。
3. 驗證您的認證是否正常運作：

```bash Shell
aws sts get-caller-identity
```

## 安裝用於存取 Bedrock 的 SDK

Anthropic 的[客戶端 SDK](/docs/zh-TW/api/client-sdks) 支援 Bedrock。您也可以直接使用 AWS SDK，例如 `boto3`。

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

## 存取 Bedrock

### 訂閱 Anthropic 模型

前往 [AWS 控制台 > Bedrock > 模型存取](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess)並請求存取 Anthropic 模型。請注意，Anthropic 模型的可用性因地區而異。有關最新資訊，請參閱 [AWS 文件](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html)。

#### API 模型 ID

| 模型 | 基礎 Bedrock 模型 ID | `global` | `us` | `eu` | `jp` | `apac` |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Claude Sonnet 4.5 | anthropic.claude-sonnet-4-5-20250929-v1:0 | 是 | 是 | 是 | 是 | 否 |
| Claude Sonnet 4 | anthropic.claude-sonnet-4-20250514-v1:0 | 是 | 是 | 是 | 否 | 是 |
| Claude Sonnet 3.7 <Tooltip tooltipContent="已於 2025 年 10 月 28 日棄用。">⚠️</Tooltip> | anthropic.claude-3-7-sonnet-20250219-v1:0 | 否 | 是 | 是 | 否 | 是 |
| Claude Opus 4.5 | anthropic.claude-opus-4-5-20251101-v1:0 | 是 | 是 | 是 | 否 | 否 |
| Claude Opus 4.1 | anthropic.claude-opus-4-1-20250805-v1:0 | 否 | 是 | 否 | 否 | 否 |
| Claude Opus 4 | anthropic.claude-opus-4-20250514-v1:0 | 否 | 是 | 否 | 否 | 否 |
| Claude Opus 3 <Tooltip tooltipContent="已於 2025 年 6 月 30 日棄用。">⚠️</Tooltip> | anthropic.claude-3-opus-20240229-v1:0 | 否 | 是 | 否 | 否 | 否 |
| Claude Haiku 4.5 | anthropic.claude-haiku-4-5-20251001-v1:0 | 是 | 是 | 是 | 否 | 否 |
| Claude Haiku 3.5 | anthropic.claude-3-5-haiku-20241022-v1:0 | 否 | 是 | 否 | 否 | 否 |
| Claude Haiku 3 | anthropic.claude-3-haiku-20240307-v1:0 | 否 | 是 | 是 | 否 | 是 |

有關區域與全域模型 ID 的詳細資訊，請參閱下方的[全域與區域端點](#global-vs-regional-endpoints)部分。

### 列出可用模型

以下範例顯示如何列印透過 Bedrock 提供的所有 Claude 模型：

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

### 進行請求

以下範例顯示如何從 Bedrock 上的 Claude 生成文字：

<CodeGroup>
  ```python Python
  from anthropic import AnthropicBedrock

  client = AnthropicBedrock(
      # 透過提供以下金鑰進行驗證，或使用預設 AWS 認證提供者，例如
      # 使用 ~/.aws/credentials 或 "AWS_SECRET_ACCESS_KEY" 和 "AWS_ACCESS_KEY_ID" 環境變數。
      aws_access_key="<access key>",
      aws_secret_key="<secret key>",
      # 臨時認證可與 aws_session_token 一起使用。
      # 在 https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html 閱讀更多資訊。
      aws_session_token="<session_token>",
      # aws_region 變更進行請求的 aws 區域。預設情況下，我們讀取 AWS_REGION，
      # 如果不存在，我們預設為 us-east-1。請注意，我們不讀取 ~/.aws/config 中的區域。
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
    // 透過提供以下金鑰進行驗證，或使用預設 AWS 認證提供者，例如
    // 使用 ~/.aws/credentials 或 "AWS_SECRET_ACCESS_KEY" 和 "AWS_ACCESS_KEY_ID" 環境變數。
    awsAccessKey: '<access key>',
    awsSecretKey: '<secret key>',

    // 臨時認證可與 awsSessionToken 一起使用。
    // 在 https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html 閱讀更多資訊。
    awsSessionToken: '<session_token>',

    // awsRegion 變更進行請求的 aws 區域。預設情況下，我們讀取 AWS_REGION，
    // 如果不存在，我們預設為 us-east-1。請注意，我們不讀取 ~/.aws/config 中的區域。
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

有關詳細資訊，請參閱我們的[客戶端 SDK](/docs/zh-TW/api/client-sdks)，以及官方 Bedrock 文件[此處](https://docs.aws.amazon.com/bedrock/)。

## 活動記錄

Bedrock 提供[呼叫記錄服務](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html)，允許客戶記錄與您的使用相關的提示和完成。

Anthropic 建議您至少在 30 天滾動基礎上記錄您的活動，以便了解您的活動並調查任何潛在的濫用。

<Note>
啟用此服務不會給 AWS 或 Anthropic 任何存取您內容的權限。
</Note>

## 功能支援
您可以在[此處](/docs/zh-TW/api/overview)找到 Bedrock 上目前支援的所有功能。

### Bedrock 上的 PDF 支援

PDF 支援可透過 Converse API 和 InvokeModel API 在 Amazon Bedrock 上使用。有關 PDF 處理功能和限制的詳細資訊，請參閱 [PDF 支援文件](/docs/zh-TW/build-with-claude/pdf-support#amazon-bedrock-pdf-support)。

**Converse API 使用者的重要考慮事項：**
- 視覺 PDF 分析（圖表、影像、版面配置）需要啟用引用
- 沒有引用，只有基本文字提取可用
- 為了完全控制而不強制引用，請使用 InvokeModel API

有關兩種文件處理模式及其限制的詳細資訊，請參閱 [PDF 支援指南](/docs/zh-TW/build-with-claude/pdf-support#amazon-bedrock-pdf-support)。

### 100 萬個 Token 上下文視窗

Claude Sonnet 4 和 4.5 在 Amazon Bedrock 上支援[100 萬個 Token 上下文視窗](/docs/zh-TW/build-with-claude/context-windows#1m-token-context-window)。

<Note>
100 萬個 Token 上下文視窗目前處於測試版。若要使用擴展上下文視窗，請在您的 [Bedrock API 請求](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-request-response.html)中包含 `context-1m-2025-08-07` 測試版標頭。
</Note>

## 全域與區域端點

從 **Claude Sonnet 4.5 和所有未來模型**開始，Amazon Bedrock 提供兩種端點類型：

- **全域端點**：動態路由以獲得最大可用性
- **區域端點**：通過特定地理區域保證資料路由

區域端點包括相對於全域端點的 10% 定價溢價。

<Note>
這僅適用於 Claude Sonnet 4.5 和未來模型。較舊的模型（Claude Sonnet 4、Opus 4 及更早版本）保持其現有的定價結構。
</Note>

### 何時使用各選項

**全域端點（推薦）：**
- 提供最大可用性和正常運行時間
- 動態將請求路由到具有可用容量的區域
- 無定價溢價
- 最適合資料駐留靈活的應用程式

**區域端點 (CRIS)：**
- 透過特定地理區域路由流量
- 資料駐留和合規性要求所需
- 適用於美國、歐盟、日本和澳洲
- 10% 定價溢價反映了專用區域容量的基礎設施成本

### 實施

**使用全域端點（Sonnet 4.5 和 4 的預設值）：**

Claude Sonnet 4.5 和 4 的模型 ID 已包含 `global.` 前綴：

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

**使用區域端點 (CRIS)：**

若要使用區域端點，請從模型 ID 中移除 `global.` 前綴：

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

# 使用美國區域端點 (CRIS)
message = client.messages.create(
    model="anthropic.claude-sonnet-4-5-20250929-v1:0",  # 無 global. 前綴
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

// 使用美國區域端點 (CRIS)
const message = await client.messages.create({
  model: 'anthropic.claude-sonnet-4-5-20250929-v1:0',  // 無 global. 前綴
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

### 其他資源

- **AWS Bedrock 定價：** [aws.amazon.com/bedrock/pricing](https://aws.amazon.com/bedrock/pricing/)
- **AWS 定價文件：** [Bedrock 定價指南](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
- **AWS 部落格文章：** [在 Amazon Bedrock 中推介 Claude Sonnet 4.5](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
- **Anthropic 定價詳情：** [定價文件](/docs/zh-TW/about-claude/pricing#third-party-platform-pricing)