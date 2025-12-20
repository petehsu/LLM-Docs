# 快速开始

> 欢迎访问 MiniMax 开放平台，可参考快速开始指南，体验模型能力。

简单几步，快速体验模型能力

<Steps>
  <Step title="账户注册/登录">
    使用API调用前，需在 MiniMax 开放平台进行[账户注册](https://platform.minimaxi.com/login)
  </Step>

  <Step title="获取 API key">
    通过 [账户管理 > 接口密钥](https://platform.minimaxi.com/user-center/basic-information/interface-key)，获取 **API Key**
  </Step>

  <Step title="账户充值">
    通过 [账户管理 > 余额](https://platform.minimaxi.com/user-center/payment/balance)，按需充值
  </Step>
</Steps>

## 账户注册

使用API调用前，需在 MiniMax 开放平台进行账户注册。

如您企业团队注册时，建议采用**主账号+子账号**的形式创建和管理。

* **个人注册**：若您是个人使用，直接在 [MiniMax 开放平台](https://platform.minimaxi.com/user-center/basic-information) 进行注册即可。

* **企业团队注册**：若您是多人业务团队进行使用，建议采用**主账号+子账号**的形式进行管理：

1. 在 [MiniMax 开放平台](https://platform.minimaxi.com/user-center/basic-information) 注册一个账号，（此账号即为主账号，注册时填写的姓名与手机号会成为本企业账号的管理员信息）
2. 登录该主账号，在 [账户管理 > 子账号](https://platform.minimaxi.com/user-center/basic-information/child-account)，创建您所需要数量的子账户（子账号的创建数量暂时没有限制）
3. 为您企业的人员，分配不同的子账户，进行登陆使用

子账户权限说明：

1. 子账号和主账号享用相同的使用权益与速率限制，子账号和主账号的 api 消耗共享，统一结算
2. 子账号无查看和管理“支付”权限

## 获取 API key

您可通过 [账户管理 > 接口密钥](https://platform.minimaxi.com/user-center/basic-information/interface-key)，获取 **API Key**。 点击“创建新的密钥”，在弹窗中输入密钥的名称，创建成功后，系统将展示 API Key。**请务必复制并妥善保存**，该密钥**只会显示一次**，无法再次查看。

![获取 API Key](https://filecdn.minimax.chat/public/44528a3e-7815-4ddb-80d2-a662519b0df2.png)

## 账户充值

您可通过 [账户管理 > 账户信息 > 余额](https://platform.minimaxi.com/user-center/payment/balance)，进行充值。充值用户将获得更高的资源保障。

![立即充值](https://filecdn.minimax.chat/public/c5f2d7ae-ed0c-48a6-b9fc-b53aca763a9c.png)

请注意，首次充值时，需要完成账户的个人或企业认证。
您可通过在充值流程中，参考提示完成认证流程。

## 使用方式

### 1. 通过 API 调用 MiniMax-M2 模型

支持通过 Anthropic 或 OpenAI 兼容的 API 接口调用模型

<Columns cols={2}>
  <Card title="Anthropic API 兼容（推荐）" icon="book-open" href="/api-reference/text-anthropic-api" cta="点击查看">
    通过 Anthropic SDK 调用 MiniMax 模型
  </Card>

  <Card title="OpenAI API 兼容" icon="book-open" href="/api-reference/text-openai-api" cta="点击查看">
    通过 OpenAI SDK 调用 MiniMax 模型
  </Card>
</Columns>

### 2. 在 AI 编程工具中使用 MiniMax-M2 模型

<Columns cols={2}>
  <Card title="在 AI 编程工具里使用 MiniMax-M2" icon="book-open" href="/guides/text-ai-coding-tools" cta="点击查看">
    具备代码理解能力，适用于代码助手等场景。
  </Card>
</Columns>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt