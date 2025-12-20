# OpenAI API 兼容

> 通过 OpenAI SDK 调用 MiniMax 模型

为了满足开发者对 OpenAI API 生态的使用需求，我们的 API 新增了对 OpenAI API 格式的支持。通过简单的配置，即可将 MiniMax 的能力接入到 OpenAI API 生态中。

## 快速开始

### 1. 安装 OpenAI SDK

<CodeGroup>
  ```bash Python theme={null}
  pip install openai
  ```

  ```bash Node.js theme={null}
  npm install openai
  ```
</CodeGroup>

### 2. 配置环境变量

国内用户使用 `https://api.minimaxi.com/v1`，国际用户使用 `https://api.minimax.io/v1`

```bash  theme={null}
export OPENAI_BASE_URL=https://api.minimaxi.com/v1
export OPENAI_API_KEY=${YOUR_API_KEY}
```

### 3. 调用 API

```python Python theme={null}
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="MiniMax-M2",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hi, how are you?"},
    ],
    # 设置 reasoning_split=True 将思考内容分离到 reasoning_details 字段
    extra_body={"reasoning_split": True},
)

print(f"Thinking:\n{response.choices[0].message.reasoning_details[0]['text']}\n")
print(f"Text:\n{response.choices[0].message.content}\n")
```

### 4. 特别注意

在多轮 Function Call 对话中，必须将完整的模型返回（即 assistant 消息）添加到对话历史，以保持思维链的连续性：

* 将完整的 `response_message` 对象（包含 `tool_calls` 字段）添加到消息历史
  * 原生的OpenAI API 的 MiniMax-M2，MiniMax-M2-Stable 模型 `content` 字段会包含 `<think>` 标签内容，需要完整保留
  * 在 Interleaved Thinking 友好格式中，通过启用额外的参数(`reasoning_split=True`)，模型思考内容通过 `reasoning_details` 字段单独提供，同样需要完整保留

## 支持的模型

使用 OpenAI SDK 时，支持以下 MiniMax 模型：

| 模型名称              | 说明                  |
| :---------------- | :------------------ |
| MiniMax-M2        | 专为高效编码与 Agent 工作流而生 |
| MiniMax-M2-Stable | 更高并发，商业使用           |

<Note>更多模型信息请参考标准的 MiniMax API 接口文档。</Note>

## 示例代码

### 流式响应

```python Python theme={null}
from openai import OpenAI

client = OpenAI()

print("Starting stream response...\n")
print("=" * 60)
print("Thinking Process:")
print("=" * 60)

stream = client.chat.completions.create(
    model="MiniMax-M2",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hi, how are you?"},
    ],
    # 设置 reasoning_split=True 将思考内容分离到 reasoning_details 字段
    extra_body={"reasoning_split": True},
    stream=True,
)

reasoning_buffer = ""
text_buffer = ""

for chunk in stream:
    if (
        hasattr(chunk.choices[0].delta, "reasoning_details")
        and chunk.choices[0].delta.reasoning_details
    ):
        for detail in chunk.choices[0].delta.reasoning_details:
            if "text" in detail:
                reasoning_text = detail["text"]
                new_reasoning = reasoning_text[len(reasoning_buffer) :]
                if new_reasoning:
                    print(new_reasoning, end="", flush=True)
                    reasoning_buffer = reasoning_text

    if chunk.choices[0].delta.content:
        content_text = chunk.choices[0].delta.content
        new_text = content_text[len(text_buffer) :] if text_buffer else content_text
        if new_text:
            print(new_text, end="", flush=True)
            text_buffer = content_text

print("\n" + "=" * 60)
print("Response Content:")
print("=" * 60)
print(f"{text_buffer}\n")

```

### 工具调用（Tool Use）和 Interleaved Thinking

了解如何在OpenAI SDK中使用M2的Tool Use和Interleaved Thinking能力，请参考以下文档。

<Columns cols={1}>
  <Card title="M2 工具使用 & Interleaved Thinking" icon="book-open" href="/guides/text-m2-function-call#openai-sdk" arrow="true" cta="点击查看">
    了解如何使用 MiniMax-M2 的工具调用和交错思考能力，提升模型在复杂任务中的表现。
  </Card>
</Columns>

## 注意事项

如果在使用MiniMax模型过程中遇到任何问题：

* 通过邮箱 [Model@minimaxi.com](mailto:Model@minimaxi.com) 等官方渠道联系我们的技术支持团队
* 在我们的 [Github](https://github.com/MiniMax-AI/MiniMax-M2/issues) 仓库提交Issue

<Warning>
  1. `temperature` 参数取值范围为(0.0, 1.0]，推荐使用 1.0，超出范围会返回错误

  2. 部分 OpenAI 参数（如`presence_penalty`、`frequency_penalty`、`logit_bias` 等）会被忽略

  3. 当前不支持图像和音频类型的输入

  4. `n` 参数仅支持值为 1

  5. 旧版的`function_call` 已废弃，请使用 `tools` 参数
</Warning>

## 相关链接

* [OpenAI SDK 文档](https://platform.openai.com/docs/libraries)
* [MiniMax 文本生成 API](/api-reference/text-intro)
* [M2 工具使用 & Interleaved Thinking](/guides/text-m2-function-call)

## 推荐阅读

<Columns cols={2}>
  <Card title="文本生成指南" icon="book-open" href="/guides/text-generation" cta="点击查看">
    支持通过 Anthropic 和 OpenAI 兼容接口进行文本生成调用
  </Card>

  <Card title="在 AI 编程工具里使用 MiniMax-M2" icon="book-open" href="/guides/text-ai-coding-tools" arrow="true" cta="点击查看">
    具备代码理解能力，适用于代码助手等场景。
  </Card>

  <Card title="Anthropic API 兼容（推荐）" icon="book-open" href="/api-reference/text-anthropic-api" arrow="true" cta="点击查看">
    通过 Anthropic SDK 调用 MiniMax 模型
  </Card>

  <Card title="M2 工具使用 & Interleaved Thinking" icon="book-open" href="/guides/text-m2-function-call" arrow="true" cta="点击查看">
    工具使用让 AI 模型调用外部 API。
  </Card>
</Columns>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt