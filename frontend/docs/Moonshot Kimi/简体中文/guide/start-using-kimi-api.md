文档

入门指南

开始使用 Kimi API

# 开始使用 Kimi API

Kimi API 提供了与 Kimi 大模型交互的能力，以下是一个简单示例代码：

```python
from openai import OpenAI

client =OpenAI(
    api_key="MOONSHOT_API_KEY", # 在这里将 MOONSHOT_API_KEY 替换为你从 Kimi 开放平台申请的 API Key
    base_url="https://api.moonshot.cn/v1",
)

completion = client.chat.completions.create(
    model ="kimi-k2-turbo-preview",
    messages = [
        {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
        {"role": "user", "content": "你好，我叫李雷，1+1等于多少？"}
    ],
    temperature =0.6,
)

# 通过 API 我们获得了 Kimi 大模型给予我们的回复消息（role=assistant）
print(completion.choices[0].message.content)
```

为了成功运行上述代码，你可能需要准备：

1. Python 环境 或 Node.js 环境，我们推荐使用 Python 3.8 及以上版本的 Python 解释器；
2. OpenAI SDK，我们的 API 完全兼容 OpenAI 的 API 格式，因此你可以直接使用 Python 或 Node.js OpenAI SDK 进行调用，你可以通过如下方式来安装 OpenAI SDK：

   ```text
   pip install --upgrade 'openai>=1.0' #Python
   npm install openai@latest #Node.js
   ```
3. API Key，你需要从 Kimi 开放平台中[创建一个 API Key](/console/api-keys)，将其传入 `OpenAi Client` 以便于我们能正确识别你的身份；

如果您成功运行上述代码，且没有任何报错，那么您将看到类似如下的内容输出：

```text
你好，李雷！1+1 等于 2。这是一个基本的数学加法问题。如果你有其他问题或需要帮助，请随时告诉我。
```

*注：由于 Kimi 大模型的不确定性，实际的回复内容可能并不与上述内容完全一致。*

Last updated on 2025年11月9日

[Kimi K2 Thinking 快速开始](/docs/guide/use-kimi-k2-thinking-model "Kimi K2 Thinking 快速开始")[从 OpenAI 迁移到 Kimi API](/docs/guide/migrating-from-openai-to-kimi "从 OpenAI 迁移到 Kimi API")