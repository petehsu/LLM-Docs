# API 参考

> 欢迎查看 MegaLLM API 参考文档。MegaLLM 通过兼容 OpenAI 和 Anthropic 的 REST API 提供对 70 多个 AI 模型的统一访问。

## 基础 URL

MegaLLM 支持两种 API 格式：

<CardGroup cols={2}>
  <Card title="OpenAI 格式" icon="robot">
    ```
    https://ai.megallm.io/v1
    ```

    兼容 OpenAI SDK 和工具
  </Card>

  <Card title="Anthropic 格式" icon="message-bot">
    ```
    https://ai.megallm.io
    ```

    兼容 Anthropic Claude SDK
  </Card>
</CardGroup>

## 身份验证

所有 API 端点都需要使用以下方法之一进行身份验证：

### Bearer Token（推荐）

```http  theme={null}
Authorization: Bearer YOUR_API_KEY
```

### API Key Header（Anthropic 格式）

```http  theme={null}
x-api-key: YOUR_API_KEY
anthropic-version: 2023-06-01
```

<Info>
  从 [MegaLLM Dashboard](https://megallm.io/dashboard/overview) 获取您的 API 密钥。
</Info>

## 核心端点

<CardGroup cols={2}>
  <Card title="Chat Completions" icon="comments" href="/cn/api-reference/post-chat-completions">
    兼容 OpenAI 的聊天 API，支持流式传输、函数调用和视觉功能
  </Card>

  <Card title="Messages" icon="message" href="/cn/api-reference/post-v1-messages">
    兼容 Anthropic 的 API，支持扩展思考、工具和提示缓存
  </Card>

  <Card title="Models" icon="list" href="/cn/api-reference/get-models">
    列出所有 70 多个 AI 模型及其功能、定价和上下文窗口
  </Card>
</CardGroup>

## 高级功能

<CardGroup cols={2}>
  <Card title="流式传输" icon="stream" href="/cn/api-reference/endpoint/streaming">
    使用服务器发送事件进行实时流式响应
  </Card>

  <Card title="函数调用" icon="function" href="/cn/api-reference/endpoint/function-calling">
    使 AI 能够与外部工具和 API 交互
  </Card>

  <Card title="身份验证指南" icon="shield" href="/cn/dev-docs/getting-started/authentication">
    全面的身份验证方法和安全最佳实践
  </Card>
</CardGroup>

## 快速开始

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const openai = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hello!' }]
    });
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Hello!"}]
      }'
    ```
  </Tab>
</Tabs>

## 速率限制

速率限制因套餐等级而异：

| 等级         | 请求/分钟 | Token/分钟 | 并发数 |
| ---------- | ----- | -------- | --- |
| Basic      | 60    | 90K      | 10  |
| Pro        | 300   | 450K     | 40  |
| Enterprise | 自定义   | 自定义      | 自定义 |

## SDK 支持

MegaLLM 兼容流行的 AI SDK：

* **Python**: `openai`, `anthropic`, `langchain`
* **JavaScript/TypeScript**: `openai`, `@anthropic-ai/sdk`
* **Go**: `go-openai`
* **Ruby**: `anthropic-rb`
* **Rust**: `async-openai`
* **Java**: `openai-java`
* **C#**: `OpenAI-DotNet`

## 需要帮助？

<CardGroup cols={2}>
  <Card title="开发者文档" icon="file-lines" href="/cn/dev-docs/overview">
    全面的指南和教程
  </Card>

  <Card title="模型目录" icon="robot" href="/cn/home/models">
    浏览所有 70 多个可用模型
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt