# Amazon Bedrock 上的 Claude

Anthropic 的 Claude 模型现已通过 Amazon Bedrock 正式推出。

---

通过 Bedrock 调用 Claude 与使用 Anthropic 客户端 SDK 调用 Claude 的方式略有不同。本指南将引导您完成通过 Python 或 TypeScript 向 Bedrock 上的 Claude 发起 API 调用的过程。

请注意，本指南假设您已经注册了 [AWS 账户](https://portal.aws.amazon.com/billing/signup)并配置了编程访问。

## 安装和配置 AWS CLI

1. [安装 AWS CLI 版本](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)至少为 `2.13.23` 或更新版本
2. 使用 AWS configure 命令配置您的 AWS 凭证（请参阅[配置 AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)），或通过在 AWS 仪表板中导航到"命令行或编程访问"并按照弹出模态框中的说明来查找您的凭证。
3. 验证您的凭证是否正常工作：

```bash Shell
aws sts get-caller-identity
```

## 安装用于访问 Bedrock 的 SDK

Anthropic 的[客户端 SDK](/docs/zh-CN/api/client-sdks)支持 Bedrock。您也可以直接使用 AWS SDK，如 `boto3`。

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

## 访问 Bedrock

### 订阅 Anthropic 模型

转到 [AWS 控制台 > Bedrock > 模型访问](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess)并请求访问 Anthropic 模型。请注意，Anthropic 模型的可用性因地区而异。有关最新信息，请参阅 [AWS 文档](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html)。

#### API 模型 ID

| 模型 | Bedrock 基础模型 ID | `global` | `us` | `eu` | `jp` | `apac` |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Claude Sonnet 4.5 | anthropic.claude-sonnet-4-5-20250929-v1:0 | 是 | 是 | 是 | 是 | 否 |
| Claude Sonnet 4 | anthropic.claude-sonnet-4-20250514-v1:0 | 是 | 是 | 是 | 否 | 是 |
| Claude Sonnet 3.7 <Tooltip tooltipContent="自 2025 年 10 月 28 日起已弃用。">⚠️</Tooltip> | anthropic.claude-3-7-sonnet-20250219-v1:0 | 否 | 是 | 是 | 否 | 是 |
| Claude Opus 4.5 | anthropic.claude-opus-4-5-20251101-v1:0 | 是 | 是 | 是 | 否 | 否 |
| Claude Opus 4.1 | anthropic.claude-opus-4-1-20250805-v1:0 | 否 | 是 | 否 | 否 | 否 |
| Claude Opus 4 | anthropic.claude-opus-4-20250514-v1:0 | 否 | 是 | 否 | 否 | 否 |
| Claude Opus 3 <Tooltip tooltipContent="自 2025 年 6 月 30 日起已弃用。">⚠️</Tooltip> | anthropic.claude-3-opus-20240229-v1:0 | 否 | 是 | 否 | 否 | 否 |
| Claude Haiku 4.5 | anthropic.claude-haiku-4-5-20251001-v1:0 | 是 | 是 | 是 | 否 | 否 |
| Claude Haiku 3.5 | anthropic.claude-3-5-haiku-20241022-v1:0 | 否 | 是 | 否 | 否 | 否 |
| Claude Haiku 3 | anthropic.claude-3-haiku-20240307-v1:0 | 否 | 是 | 是 | 否 | 是 |

有关区域与全局模型 ID 的更多信息，请参阅下面的[全局与区域端点](#global-vs-regional-endpoints)部分。

### 列出可用模型

以下示例展示了如何打印通过 Bedrock 提供的所有 Claude 模型的列表：

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

### 发起请求

以下示例展示了如何从 Bedrock 上的 Claude 生成文本：

<CodeGroup>
  ```python Python
  from anthropic import AnthropicBedrock

  client = AnthropicBedrock(
      # 通过提供以下密钥进行身份验证，或使用默认的 AWS 凭证提供程序，例如
      # 使用 ~/.aws/credentials 或 "AWS_SECRET_ACCESS_KEY" 和 "AWS_ACCESS_KEY_ID" 环境变量。
      aws_access_key="<access key>",
      aws_secret_key="<secret key>",
      # 临时凭证可以与 aws_session_token 一起使用。
      # 详细信息请参阅 https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html。
      aws_session_token="<session_token>",
      # aws_region 更改发起请求的 AWS 区域。默认情况下，我们读取 AWS_REGION，
      # 如果不存在，我们默认为 us-east-1。请注意，我们不读取 ~/.aws/config 中的区域。
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
    // 通过提供以下密钥进行身份验证，或使用默认的 AWS 凭证提供程序，例如
    // 使用 ~/.aws/credentials 或 "AWS_SECRET_ACCESS_KEY" 和 "AWS_ACCESS_KEY_ID" 环境变量。
    awsAccessKey: '<access key>',
    awsSecretKey: '<secret key>',

    // 临时凭证可以与 awsSessionToken 一起使用。
    // 详细信息请参阅 https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html。
    awsSessionToken: '<session_token>',

    // awsRegion 更改发起请求的 AWS 区域。默认情况下，我们读取 AWS_REGION，
    // 如果不存在，我们默认为 us-east-1。请注意，我们不读取 ~/.aws/config 中的区域。
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

有关更多详情，请参阅我们的[客户端 SDK](/docs/zh-CN/api/client-sdks)，以及官方 Bedrock 文档[此处](https://docs.aws.amazon.com/bedrock/)。

## 活动日志

Bedrock 提供了一项[调用日志服务](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html)，允许客户记录与您的使用相关的提示和完成。

Anthropic 建议您至少在 30 天滚动基础上记录您的活动，以便了解您的活动并调查任何潜在的滥用。

<Note>
启用此服务不会给 AWS 或 Anthropic 任何访问您内容的权限。
</Note>

## 功能支持

您可以在[此处](/docs/zh-CN/api/overview)找到 Bedrock 上当前支持的所有功能。

### Bedrock 上的 PDF 支持

PDF 支持可通过 Converse API 和 InvokeModel API 在 Amazon Bedrock 上获得。有关 PDF 处理功能和限制的详细信息，请参阅 [PDF 支持文档](/docs/zh-CN/build-with-claude/pdf-support#amazon-bedrock-pdf-support)。

**Converse API 用户的重要注意事项：**
- 视觉 PDF 分析（图表、图像、布局）需要启用引用
- 没有引用的情况下，仅提供基本文本提取
- 为了获得完全控制而不强制引用，请使用 InvokeModel API

有关两种文档处理模式及其限制的更多详情，请参阅 [PDF 支持指南](/docs/zh-CN/build-with-claude/pdf-support#amazon-bedrock-pdf-support)。

### 100 万令牌上下文窗口

Claude Sonnet 4 和 4.5 在 Amazon Bedrock 上支持 [100 万令牌上下文窗口](/docs/zh-CN/build-with-claude/context-windows#1m-token-context-window)。

<Note>
100 万令牌上下文窗口目前处于测试阶段。要使用扩展上下文窗口，请在您的 [Bedrock API 请求](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-request-response.html)中包含 `context-1m-2025-08-07` 测试版标头。
</Note>

## 全局与区域端点

从 **Claude Sonnet 4.5 和所有未来模型**开始，Amazon Bedrock 提供两种端点类型：

- **全局端点**：动态路由以获得最大可用性
- **区域端点**：通过特定地理区域保证数据路由

区域端点的价格比全局端点高 10%。

<Note>
这仅适用于 Claude Sonnet 4.5 和未来模型。较旧的模型（Claude Sonnet 4、Opus 4 及更早版本）保持其现有的定价结构。
</Note>

### 何时使用每个选项

**全局端点（推荐）：**
- 提供最大可用性和正常运行时间
- 动态将请求路由到具有可用容量的区域
- 无价格溢价
- 最适合数据驻留灵活的应用程序

**区域端点 (CRIS)：**
- 通过特定地理区域路由流量
- 数据驻留和合规要求所需
- 适用于美国、欧盟、日本和澳大利亚
- 10% 的价格溢价反映了专用区域容量的基础设施成本

### 实现

**使用全局端点（Sonnet 4.5 和 4 的默认值）：**

Claude Sonnet 4.5 和 4 的模型 ID 已包含 `global.` 前缀：

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

**使用区域端点 (CRIS)：**

要使用区域端点，请从模型 ID 中删除 `global.` 前缀：

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

# 使用美国区域端点 (CRIS)
message = client.messages.create(
    model="anthropic.claude-sonnet-4-5-20250929-v1:0",  # 无 global. 前缀
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

// 使用美国区域端点 (CRIS)
const message = await client.messages.create({
  model: 'anthropic.claude-sonnet-4-5-20250929-v1:0',  // 无 global. 前缀
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

### 其他资源

- **AWS Bedrock 定价：** [aws.amazon.com/bedrock/pricing](https://aws.amazon.com/bedrock/pricing/)
- **AWS 定价文档：** [Bedrock 定价指南](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
- **AWS 博客文章：** [在 Amazon Bedrock 中推出 Claude Sonnet 4.5](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
- **Anthropic 定价详情：** [定价文档](/docs/zh-CN/about-claude/pricing#third-party-platform-pricing)