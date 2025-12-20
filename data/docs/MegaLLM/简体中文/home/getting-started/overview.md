# 开始使用

> 只需几分钟即可开始使用 MegaLLM。通过一个统一的 API 访问 70+ 个 AI 模型。

## 快速导航

<CardGroup cols={2}>
  <Card title="快速开始" icon="bolt-lightning" href="/cn/home/getting-started/quick-start">
    在 2 分钟内完成您的第一次 API 调用
  </Card>

  <Card title="设置指南" icon="screwdriver-wrench" href="/cn/home/getting-started/setup">
    完整的设置和配置
  </Card>

  <Card title="第一个请求" icon="brackets-curly" href="/cn/home/getting-started/first-request">
    逐步指导您的第一个 AI 请求
  </Card>

  <Card title="下一步" icon="arrow-right-long" href="/cn/home/getting-started/next-steps">
    入门后要做什么
  </Card>
</CardGroup>

## 什么是 MegaLLM?

MegaLLM 是一个通用 AI 平台,通过单一 API 提供 70+ 大语言模型的访问。无需管理多个 API 密钥和集成,您将获得:

* 所有模型使用**一个 API**
* 所有使用量使用**一个账单**
* 维护**一个集成**

### 支持的模型

* **OpenAI**: GPT-4, GPT-5, GPT-3.5 Turbo
* **Anthropic**: Claude Opus 4, Claude Sonnet, Claude Haiku
* **Google**: Gemini 2.5 Pro, Gemini Flash
* **Meta**: Llama 3 70B, Llama 3 8B
* **还有 60+ 个模型!**

## 为什么选择 MegaLLM?

<AccordionGroup>
  <Accordion title="通用访问">
    通过一个 API 访问所有主要的 AI 模型。无需分别与多个提供商集成。
  </Accordion>

  <Accordion title="简单集成">
    OpenAI 和 Anthropic SDK 的即插即用替代品。只需更改基础 URL,即可开始使用。
  </Accordion>

  <Accordion title="自动故障转移">
    内置故障转移确保即使在模型停机时,您的应用程序也能继续运行。
  </Accordion>

  <Accordion title="成本优化">
    轻松在模型之间切换以优化成本、速度或质量,无需更改代码。
  </Accordion>

  <Accordion title="一个账单">
    跨所有提供商的统一计费。在一个仪表板中跟踪使用情况和成本。
  </Accordion>
</AccordionGroup>

## 3 步设置

<Steps>
  <Step title="获取 API 密钥">
    在 [megallm.io](https://megallm.io) 注册并生成您的 API 密钥
  </Step>

  <Step title="安装 SDK">
    使用您已经熟悉的 OpenAI 或 Anthropic SDK

    ```bash  theme={null}
    pip install openai
    # 或
    pip install anthropic
    ```
  </Step>

  <Step title="发起请求">
    指向 MegaLLM 并开始使用任何模型

    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-megallm-api-key"
    )
    ```
  </Step>
</Steps>

## 选择您的路径

<Tabs>
  <Tab title="我是 AI 新手">
    太好了!从这里开始:

    1. [快速入门指南](/cn/home/getting-started/quick-start) - 获取您的 API 密钥并发起第一个请求
    2. [第一个请求教程](/cn/home/getting-started/first-request) - 逐步演练
    3. [浏览模型](/cn/home/models) - 探索可用的模型
    4. [常见问题](/cn/home/faq) - 常见问题
  </Tab>

  <Tab title="我使用 OpenAI">
    太好了!切换很容易:

    1. 获取您的 MegaLLM API 密钥
    2. 将您的基础 URL 更改为 `https://ai.megallm.io/v1`
    3. 就是这样!您所有的代码都保持不变

    查看:[OpenAI 迁移指南](/cn/dev-docs/openai/overview)
  </Tab>

  <Tab title="我使用 Anthropic">
    太棒了!迁移很简单:

    1. 获取您的 MegaLLM API 密钥
    2. 将您的基础 URL 更改为 `https://ai.megallm.io`
    3. 完成!使用 Claude 和 70+ 其他模型

    查看:[Anthropic 迁移指南](/cn/dev-docs/anthropic/overview)
  </Tab>

  <Tab title="我是开发者">
    让我们深入了解:

    1. [API 参考](/cn/api-reference/introduction) - 完整的 API 文档
    2. [OpenAI API](/cn/dev-docs/openai/overview) - OpenAI 兼容端点
    3. [Anthropic API](/cn/dev-docs/anthropic/overview) - Anthropic 兼容端点
    4. [流式传输](/cn/api-reference/endpoint/streaming) - 实时响应
    5. [函数调用](/cn/api-reference/endpoint/function-calling) - 工具使用
  </Tab>
</Tabs>

## 下一步

<CardGroup cols={2}>
  <Card title="快速开始" icon="bolt-lightning" href="/cn/home/getting-started/quick-start">
    在 2 分钟内完成您的第一个请求
  </Card>

  <Card title="查看所有模型" icon="grid-2-plus" href="/cn/home/models">
    浏览 70+ 个可用的 AI 模型
  </Card>

  <Card title="开发者文档" icon="file-lines" href="/cn/dev-docs/overview">
    全面的 API 文档
  </Card>

  <Card title="CLI 工具" icon="square-terminal" href="/cn/cli/overview">
    设置 AI 编程助手
  </Card>
</CardGroup>

## 需要帮助?

* **文档**: 完整的指南和教程
* **常见问题**: [常见问题](/cn/home/faq)
* **支持**: [support@megallm.io](mailto:support@megallm.io)
* **Discord**: [加入我们的社区](https://discord.gg/devsindia)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt