# Anthropic API 兼容

> 通过 Anthropic SDK 调用 MiniMax 模型

为了满足开发者对 Anthropic API 生态的使用需求，我们的 API 新增了对 Anthropic API 格式的支持。通过简单的配置，即可将 MiniMax 的能力接入到 Anthropic API 生态中。

## 快速开始

### 1. 安装 Anthropic SDK

<CodeGroup>
  ```bash Python theme={null}
  pip install anthropic
  ```

  ```bash Node.js theme={null}
  npm install @anthropic-ai/sdk
  ```
</CodeGroup>

### 2. 配置环境变量

国内用户使用 `https://api.minimaxi.com/anthropic`，国际用户使用 `https://api.minimax.io/anthropic`

```bash  theme={null}
export ANTHROPIC_BASE_URL=https://api.minimaxi.com/anthropic
export ANTHROPIC_API_KEY=${YOUR_API_KEY}
```

### 3. 调用 API

```python Python theme={null}
import anthropic

client = anthropic.Anthropic()

message = client.messages.create(
    model="MiniMax-M2",
    max_tokens=1000,
    system="You are a helpful assistant.",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hi, how are you?"
                }
            ]
        }
    ]
)

for block in message.content:
    if block.type == "thinking":
        print(f"Thinking:\n{block.thinking}\n")
    elif block.type == "text":
        print(f"Text:\n{block.text}\n")
```

### 4. 特别注意

在多轮 Function Call 对话中，必须将完整的模型返回（即 assistant 消息）添加到对话历史，以保持思维链的连续性：

* 将完整的 `response.content`（包含 thinking/text/tool\_use 等所有块）添加到消息历史
* `response.content` 是一个列表，包含多种类型的内容块，必须完整回传

## 支持的模型

使用 Anthropic SDK 时，支持 `MiniMax-M2` `MiniMax-M2-Stable` 模型：

| 模型名称              | 说明                |
| :---------------- | :---------------- |
| MiniMax-M2        | 专为高效编码与Agent工作流而生 |
| MiniMax-M2-Stable | 更高并发，商业使用         |

<Note>
  Anthropic API 兼容接口支持 `MiniMax-M2` `MiniMax-M2-Stable`
  模型。如需使用其他模型，请使用标准的 MiniMax API 接口。
</Note>

## 兼容性说明

### 支持的参数

在使用 Anthropic SDK 接入时，我们支持以下输入参数：

| 参数                   | 支持状态 | 说明                                    |
| :------------------- | :--- | :------------------------------------ |
| `model`              | 完全支持 | 支持 `MiniMax-M2` `MiniMax-M2-Stable`模型 |
| `messages`           | 部分支持 | 支持文本和工具调用，不支持图像和文档输入                  |
| `max_tokens`         | 完全支持 | 最大生成 token 数                          |
| `stream`             | 完全支持 | 流式响应                                  |
| `system`             | 完全支持 | 系统提示词                                 |
| `temperature`        | 完全支持 | 取值范围 (0.0, 1.0]，控制输出随机性，建议取值 1        |
| `tool_choice`        | 完全支持 | 工具选择策略                                |
| `tools`              | 完全支持 | 工具定义                                  |
| `top_p`              | 完全支持 | 核采样参数                                 |
| `thinking`           | 完全支持 | 推理内容                                  |
| `metadata`           | 完全支持 | 元信息                                   |
| `top_k`              | 忽略   | 该参数会被忽略                               |
| `stop_sequences`     | 忽略   | 该参数会被忽略                               |
| `service_tier`       | 忽略   | 该参数会被忽略                               |
| `mcp_servers`        | 忽略   | 该参数会被忽略                               |
| `context_management` | 忽略   | 该参数会被忽略                               |
| `container`          | 忽略   | 该参数会被忽略                               |

### Messages 字段支持

| 字段类型                 | 支持状态 | 说明       |
| :------------------- | :--- | :------- |
| `type="text"`        | 完全支持 | 文本消息     |
| `type="tool_use"`    | 完全支持 | 工具调用     |
| `type="tool_result"` | 完全支持 | 工具调用结果   |
| `type="thinking"`    | 完全支持 | 推理的内容    |
| `type="image"`       | 不支持  | 暂不支持图像输入 |
| `type="document"`    | 不支持  | 暂不支持文档输入 |

## 示例代码

### 流式响应

```python Python theme={null}
import anthropic

client = anthropic.Anthropic()

print("Starting stream response...\n")
print("=" * 60)
print("Thinking Process:")
print("=" * 60)

stream = client.messages.create(
    model="MiniMax-M2",
    max_tokens=1000,
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": [{"type": "text", "text": "Hi, how are you?"}]}
    ],
    stream=True,
)

reasoning_buffer = ""
text_buffer = ""

for chunk in stream:
    if chunk.type == "content_block_start":
        if hasattr(chunk, "content_block") and chunk.content_block:
            if chunk.content_block.type == "text":
                print("\n" + "=" * 60)
                print("Response Content:")
                print("=" * 60)

    elif chunk.type == "content_block_delta":
        if hasattr(chunk, "delta") and chunk.delta:
            if chunk.delta.type == "thinking_delta":
                # 流式输出 thinking 过程
                new_thinking = chunk.delta.thinking
                if new_thinking:
                    print(new_thinking, end="", flush=True)
                    reasoning_buffer += new_thinking
            elif chunk.delta.type == "text_delta":
                # 流式输出文本内容
                new_text = chunk.delta.text
                if new_text:
                    print(new_text, end="", flush=True)
                    text_buffer += new_text

print("\n")
```

### 工具调用（Tool Use）和 Interleaved Thinking

了解如何在Anthropic SDK中使用M2的Tool Use和Interleaved Thinking能力，请参考以下文档。

<Columns cols={1}>
  <Card title="M2 工具使用 & Interleaved Thinking" icon="book-open" href="/guides/text-m2-function-call#anthropic-sdk" arrow="true" cta="点击查看">
    了解如何使用 MiniMax-M2 的工具调用和交错思考能力，提升模型在复杂任务中的表现。
  </Card>
</Columns>

## 注意事项

如果在使用MiniMax模型过程中遇到任何问题：

* 通过邮箱 [Model@minimaxi.com](mailto:Model@minimaxi.com) 等官方渠道联系我们的技术支持团队
* 在我们的 [Github](https://github.com/MiniMax-AI/MiniMax-M2/issues) 仓库提交Issue

<Warning>
  1. Anthropic API 兼容接口目前支持 `MiniMax-M2` `MiniMax-M2-Stable` 模型

  2. `temperature` 参数取值范围为 (0.0, 1.0]，推荐使用1.0，超出范围会返回错误

  3. 部分 Anthropic 参数（如 `thinking`、`top_k`、`stop_sequences`、`service_tier`、`mcp_servers`、`context_management`、`container`）会被忽略

  4. 当前不支持图像和文档类型的输入
</Warning>

## 相关链接

* [Anthropic SDK 文档](https://docs.anthropic.com/en/api/client-sdks)
* [MiniMax 文本生成 API](/api-reference/text-intro)
* [M2 工具使用 & Interleaved Thinking](/guides/text-m2-function-call)

## 推荐阅读

<Columns cols={2}>
  <Card title="文本生成指南" icon="book-open" href="/guides/text-generation" arrow="true" cta="点击查看">
    支持通过 Anthropic 和 OpenAI 兼容接口进行文本生成调用
  </Card>

  <Card title="OpenAI API 兼容" icon="book-open" href="/api-reference/text-openai-api" arrow="true" cta="点击查看">
    通过 OpenAI SDK 调用 MiniMax 模型
  </Card>

  <Card title="M2 工具使用 & Interleaved Thinking" icon="book-open" href="/guides/text-m2-function-call" arrow="true" cta="点击查看">
    工具使用让 AI 模型调用外部 API。
  </Card>

  <Card title="在 AI 编程工具里使用 MiniMax-M2" icon="book-open" href="/guides/text-ai-coding-tools" arrow="true" cta="点击查看">
    具备代码理解能力，适用于代码助手等场景。
  </Card>
</Columns>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt