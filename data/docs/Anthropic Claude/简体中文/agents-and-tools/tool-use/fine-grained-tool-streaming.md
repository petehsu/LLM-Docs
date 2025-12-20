# 细粒度工具流式传输

工具使用现在支持参数值的细粒度流式传输，允许开发者在不缓冲/JSON验证的情况下流式传输工具使用参数，减少接收大型参数的延迟。

---

工具使用现在支持参数值的细粒度[流式传输](/docs/zh-CN/build-with-claude/streaming)。这允许开发者在不缓冲/JSON验证的情况下流式传输工具使用参数，减少接收大型参数的延迟。

细粒度工具流式传输可通过Claude API、AWS Bedrock、Google Cloud的Vertex AI和Microsoft Foundry获得。

<Note>
细粒度工具流式传输是一项测试功能。请确保在生产环境中使用前评估您的响应。

请使用[此表单](https://forms.gle/D4Fjr7GvQRzfTZT96)提供关于模型响应质量、API本身或文档质量的反馈——我们迫不及待地想听到您的意见！
</Note>

<Warning>
使用细粒度工具流式传输时，您可能会收到无效或不完整的JSON输入。请确保在您的代码中考虑这些边界情况。
</Warning>

## 如何使用细粒度工具流式传输

要使用此测试功能，只需将测试版标头`fine-grained-tool-streaming-2025-05-14`添加到工具使用请求中并打开流式传输。

以下是如何使用API进行细粒度工具流式传输的示例：

<CodeGroup>

  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: fine-grained-tool-streaming-2025-05-14" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 65536,
      "tools": [
        {
          "name": "make_file",
          "description": "Write text to a file",
          "input_schema": {
            "type": "object",
            "properties": {
              "filename": {
                "type": "string",
                "description": "The filename to write text to"
              },
              "lines_of_text": {
                "type": "array",
                "description": "An array of lines of text to write to the file"
              }
            },
            "required": ["filename", "lines_of_text"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Can you write a long poem and make a file called poem.txt?"
        }
      ],
      "stream": true
    }' | jq '.usage'
  ```

  ```python Python
  import anthropic

  client = anthropic.Anthropic()

  response = client.beta.messages.stream(
      max_tokens=65536,
      model="claude-sonnet-4-5",
      tools=[{
        "name": "make_file",
        "description": "Write text to a file",
        "input_schema": {
          "type": "object",
          "properties": {
            "filename": {
              "type": "string",
              "description": "The filename to write text to"
            },
            "lines_of_text": {
              "type": "array",
              "description": "An array of lines of text to write to the file"
            }
          },
          "required": ["filename", "lines_of_text"]
        }
      }],
      messages=[{
        "role": "user",
        "content": "Can you write a long poem and make a file called poem.txt?"
      }],
      betas=["fine-grained-tool-streaming-2025-05-14"]
  )

  print(response.usage)
  ```

  ```typescript TypeScript
  import Anthropic from '@anthropic-ai/sdk';

  const anthropic = new Anthropic();

  const message = await anthropic.beta.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 65536,
    tools: [{
      "name": "make_file",
      "description": "Write text to a file",
      "input_schema": {
        "type": "object",
        "properties": {
          "filename": {
            "type": "string",
            "description": "The filename to write text to"
          },
          "lines_of_text": {
            "type": "array",
            "description": "An array of lines of text to write to the file"
          }
        },
        "required": ["filename", "lines_of_text"]
      }
    }],
    messages: [{ 
      role: "user", 
      content: "Can you write a long poem and make a file called poem.txt?" 
    }],
    betas: ["fine-grained-tool-streaming-2025-05-14"]
  });

  console.log(message.usage);
  ```
</CodeGroup>

在此示例中，细粒度工具流式传输使Claude能够将长诗的行流式传输到工具调用`make_file`中，而无需缓冲来验证`lines_of_text`参数是否为有效的JSON。这意味着您可以看到参数流在到达时的样子，而无需等待整个参数缓冲和验证。

<Note>
使用细粒度工具流式传输时，工具使用块开始流式传输的速度更快，通常更长，包含的换行符更少。这是由于分块行为的差异。

示例：

不使用细粒度流式传输（15秒延迟）：
```
块1：'{"'
块2：'query": "Ty'
块3：'peScri'
块4：'pt 5.0 5.1 '
块5：'5.2 5'
块6：'.3'
块8：' new f'
块9：'eatur'
...
```

使用细粒度流式传输（3秒延迟）：
```
块1：'{"query": "TypeScript 5.0 5.1 5.2 5.3'
块2：' new features comparison'
```
</Note>

<Warning>
因为细粒度流式传输在不缓冲或JSON验证的情况下发送参数，所以无法保证生成的流将以有效的JSON字符串完成。特别是，如果达到[停止原因](/docs/zh-CN/build-with-claude/handling-stop-reasons)`max_tokens`，流可能在参数中途结束，可能不完整。您通常需要编写特定的支持来处理何时达到`max_tokens`的情况。
</Warning>

## 处理工具响应中的无效JSON

使用细粒度工具流式传输时，您可能会从模型收到无效或不完整的JSON。如果您需要在错误响应块中将此无效JSON传回模型，您可以将其包装在JSON对象中以确保正确处理（使用合理的键）。例如：

```json
{
  "INVALID_JSON": "<your invalid json string>"
}
```

这种方法帮助模型理解内容是无效的JSON，同时保留原始格式错误的数据用于调试目的。

<Note>
包装无效JSON时，请确保正确转义无效JSON字符串中的任何引号或特殊字符，以在包装器对象中维护有效的JSON结构。
</Note>