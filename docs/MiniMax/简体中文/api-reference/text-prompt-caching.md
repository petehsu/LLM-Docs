# Prompt 缓存

> Prompt 缓存是一项强大的功能，它通过允许您复用 prompt 中的特定前缀来优化 API 使用。这种方法可以显著减少重复任务或具有一致元素的 prompt 的处理时间和成本。

# Anthropic API 兼容的 Cache 说明

## 快速开始

以下是使用 `cache_control` 块在 Anthropic 兼容API 中实现 prompt 缓存的快速示例：

<CodeGroup>
  ```python Python theme={null} theme={null}
  import anthropic

  client = anthropic.Anthropic(
    base_url="https://api.minimaxi.com/anthropic",
    api_key="<your api key>"  # 替换为您的 MiniMax API Key
  )

  response = client.messages.create(
      model="MiniMax-M2",
      max_tokens=1024,
      system=[
        {
          "type": "text",
          "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
        },
        {
          "type": "text",
          "text": "<the entire contents of 'Pride and Prejudice'>",
          "cache_control": {"type": "ephemeral"}
        }
      ],
      messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
  )
  print(response.usage.model_dump_json())

  # 使用相同的缓存内容再次调用
  # 只需要更改用户消息
  response = client.messages.create(.....)
  print(response.usage.model_dump_json())
  ```
</CodeGroup>

```JSON JSON theme={null} theme={null}
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

在此示例中，《傲慢与偏见》的完整文本使用 `cache_control` 参数进行缓存。这使得大文本可以在多次 API 调用中复用而无需每次都重新处理。通过仅更改用户消息，您可以提出关于该书的各种问题，同时利用缓存的内容，从而获得更快的响应并降低成本。

***

## Prompt 缓存的工作原理

当您发送启用了 prompt 缓存的请求时：

1. 系统检查指定缓存断点 (cache\_control) 之前的 prompt 前缀是否已被此前的请求缓存；
2. 如果找到，它将使用缓存版本，显著减少处理时间和成本；
3. 如果未找到，它将处理完整的 prompt 并在生成响应时对其进行缓存。

这在以下场景的使用中特别有用：

* 包含许多示例的 prompt
* 大量上下文或背景信息
* 具有一致指令的重复任务
* 长时间的多轮对话

缓存内容的**生命周期为 5 分钟**。每次命中缓存内容时，缓存生命周期都会自动刷新，无需额外费用。

***

## 支持的模型和定价

Prompt 缓存引入了差异化的定价结构。下表显示了每个支持模型的百万 token 价格：

| **模型**                                | **输入价格**<br /> 元/百万 tokens | **输出价格** <br /> 元/百万 tokens | **缓存读取**<br /> 元/百万 tokens | **缓存写入**<br /> 元/百万 tokens |
| :------------------------------------ | :------------------------: | :-------------------------: | :------------------------: | :------------------------: |
| **MiniMax-M2**                        |             2.1            |             8.4             |            0.21            |            2.625           |
| **MiniMax-M2-Stable** <br />更高并发，商业使用 |             2.1            |             8.4             |            0.21            |            2.625           |

<Note>
  上表反映了以下 prompt 缓存的定价倍数：

  * 缓存写入 token 是基础输入 token 价格的 1.25 倍
  * 缓存读取 token 是基础输入 token 价格的 0.1 倍
</Note>

***

## 如何实现 Prompt 缓存

### 构建 prompt

将静态可复用的内容（工具定义、系统指令、示例等）放在 prompt 的开头。使用 `cache_control` 参数标记可缓存内容的结束位置。

缓存前缀按以下顺序创建：`tools` → `system` → `messages`。此顺序形成一个层次结构，其中每个级别都建立在前一个级别之上。

### 自动前缀检查

您可以在静态内容的末尾只使用一个缓存断点，系统将自动找到最长的匹配前缀。

**三个核心原则：**

1. **缓存内容是累积的**：当您使用 `cache_control` 标记一个块时，缓存内容是从所有先前的块按顺序生成的。这意味着每个缓存都依赖于它之前的所有内容。

2. **向前顺序检查**：系统通过从显式 Cache 断点向前来检查缓存命中，这确保了尽量命中最长的缓存。

3. **20 块回溯窗口**：系统在每个显式 Cache 断点之前最多检查 20 个块。如果检查 20 个块后未找到匹配项，将停止检查并移至上一个显式断点（如果有）。

**举例：**

如果在第30个块设置了 `cache_control`, 重复进行请求:

1. 若无任何块的内容被修改，则系统能命中 1\~30 块所有内容的缓存;
2. 若第 25 个块内容被修改，则系统从第 30 块往前找，直到第 24 块可以匹配缓存，那么 1\~24 块内容将会命中缓存;
3. 若第 5 个块内容被修改，则系统从第 30 块往前找，找到第 11 块仍未匹配缓存，本次缓存失效;

### 可被缓存的内容

请求中的大多数块都可以使用 `cache_control` 指定进行缓存，包括：

* **工具**：`tools` 数组中的工具定义
* **系统消息**：`system` 数组中的内容块
* **文本消息**：`messages.content` 数组中的内容块，适用 user 和 assistant 的轮次
* **工具使用和工具结果**：`messages.content` 数组中的内容块中的 tool\_use 和 tool\_result 类型，适用 user 和 assistant 的轮次

使用 `cache_control` 标记任何这些元素以启用该部分请求的缓存。

### 缓存失效

对缓存内容的修改可能会使部分或全部缓存失效。

如 [构建 prompt](#构建-prompt) 中所述，缓存遵循层次结构：`tools` → `system` → `messages`。每个级别的更改都会使该级别及所有后续级别失效。

### 缓存性能

使用 `usage` 对象中的以下 API 响应字段监控缓存性能（或在流式传输)时的 `message_start` 事件中）：

* `cache_creation_input_tokens`：创建新缓存条目时写入缓存的 token 数量。
* `cache_read_input_tokens`：此请求从缓存中检索的 token 数量。
* `input_tokens`：未从缓存读取或用于创建缓存的输入 token 数量（即最后一个缓存断点之后的 token）。

<Note>
  **了解 token 构成**

  计算总输入 token：

  ```
  total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
  ```

  **按位置分解：**

  * `cache_read_input_tokens`：断点之前的 token，已缓存（读取）
  * `cache_creation_input_tokens`：断点之前的 token，正在缓存（写入）
  * `input_tokens`：最后一个断点之后的 token（不符合缓存条件）

  **示例：** 一个包含 100,000 个已缓存内容 token（从缓存读取）、0 个正在缓存的新内容 token 和 50 个用户消息 token（缓存断点之后）的请求：

  * `cache_read_input_tokens`：100,000
  * `cache_creation_input_tokens`：0
  * `input_tokens`：50
  * **总输入 token**：100,050 个 token

  这对于理解成本和速率限制都很重要。有效使用缓存时，`input_tokens` 通常会比您的总输入小得多。
</Note>

### 常见问题

如果您遇到不符合预期的缓存行为：

* **内容一致性**：验证缓存部分在多次调用中是相同的，并且在相同位置使用 `cache_control` 标记
* **缓存过期时间**：确认调用在缓存生命周期内进行（5 分钟）
* **块数量的限制**：若一次调用有超过 20 个内容块的 prompt，可添加额外的 `cache_control` 参数以确保所有内容都可以被缓存（系统自动检查每个断点之前的约 20 个块）
* **未生效的缓存断点**：一次调用最多支持 4 个 `cache_control` 参数，若超过 4 个，只取从后向前最近的 4 个

***

## 更多示例

以下代码示例展示了各种 prompt 缓存模式，并演示了如何在不同场景中实现缓存：

<AccordionGroup>
  <Accordion title="大型上下文缓存示例">
    <CodeGroup>
      ```Python Python theme={null} theme={null}
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="MiniMax-M2",
          max_tokens=1024,
          system=[
              {
                  "type": "text",
                  "text": "You are an AI assistant tasked with analyzing legal documents."
              },
              {
                  "type": "text",
                  "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "What are the key terms and conditions in this agreement?"
              }
          ]
      )
      print(response.model_dump_json())
      ```
    </CodeGroup>

    此示例演示了基本的 prompt 缓存，通过缓存法律协议的完整文本，同时保持用户指令不缓存。

    **首次请求：**

    * `input_tokens`：仅用户消息中的 token
    * `cache_creation_input_tokens`：整个系统消息中的 token，包括法律文档
    * `cache_read_input_tokens`：0（首次请求无缓存命中）

    **缓存生命周期内的后续请求：**

    * `input_tokens`：仅用户消息中的 token
    * `cache_creation_input_tokens`：0（无新缓存创建）
    * `cache_read_input_tokens`：整个缓存系统消息中的 token
  </Accordion>

  <Accordion title="缓存工具定义">
    <CodeGroup>
      ```Python Python theme={null} theme={null}
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="MiniMax-M2",
          max_tokens=1024,
          tools=[
              {
                  "name": "get_weather",
                  "description": "Get the current weather in a given location",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "location": {
                              "type": "string",
                              "description": "The city and state, e.g. San Francisco, CA"
                          },
                          "unit": {
                              "type": "string",
                              "enum": ["celsius", "fahrenheit"],
                              "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                          }
                      },
                      "required": ["location"]
                  },
              },
              # 更多工具
              {
                  "name": "get_time",
                  "description": "Get the current time in a given time zone",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "timezone": {
                              "type": "string",
                              "description": "The IANA time zone name, e.g. America/Los_Angeles"
                          }
                      },
                      "required": ["timezone"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "What's the weather and time in New York?"
              }
          ]
      )
      print(response.model_dump_json())
      ```
    </CodeGroup>

    此示例演示了缓存工具定义。

    `cache_control` 参数放置在最后一个工具（`get_time`）上，以将所有工具指定为静态前缀的一部分。

    所有工具定义，包括 `get_weather` 和 `get_time` 之前定义的任何其他工具，都将作为单个前缀缓存。

    当您有一组一致的工具要在多个请求中复用而无需每次都重新处理时，此方法非常理想。

    **首次请求：**

    * `input_tokens`：用户消息中的 token
    * `cache_creation_input_tokens`：所有工具定义和系统提示中的 token
    * `cache_read_input_tokens`：0（首次请求无缓存命中）

    **缓存生命周期内的后续请求：**

    * `input_tokens`：用户消息中的 token
    * `cache_creation_input_tokens`：0（无新缓存创建）
    * `cache_read_input_tokens`：所有缓存工具定义和系统提示中的 token
  </Accordion>

  <Accordion title="持续的多轮对话">
    <CodeGroup>
      ```Python Python theme={null} theme={null}
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="MiniMax-M2",
          max_tokens=1024,
          system=[
              {
                  "type": "text",
                  "text": "...长系统提示",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              # ...到目前为止的长对话
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Hello, can you tell me more about the solar system?",
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Good to know."
                      },
                      {
                          "type": "text",
                          "text": "Tell me more about Mars.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      )
      print(response.model_dump_json())
      ```
    </CodeGroup>

    此示例演示了在多轮对话中的 prompt 缓存。

    在每一轮中，我们使用 `cache_control` 标记最终消息的最后一个块，以启用对话的增量缓存。系统会自动查找并使用最长的先前缓存前缀进行后续消息。之前使用 `cache_control` 标记的块不需要再次标记——如果在 5 分钟内访问，它们仍然会导致缓存命中（和缓存刷新）。

    请注意，`cache_control` 也放置在系统消息上。这确保了如果它从缓存中被驱逐（超过 5 分钟未使用后），它将在下一个请求时重新缓存。

    这种方法非常适合在持续对话中保持上下文，而无需重复处理相同的信息。

    正确设置后，您应该在每个请求的使用响应中看到以下内容：

    * `input_tokens`：新用户消息中的 token（通常很少）
    * `cache_creation_input_tokens`：新助手和用户轮次中的 token
    * `cache_read_input_tokens`：对话中直到前一轮的 token
  </Accordion>

  <Accordion title="综合运用：多个缓存断点">
    <CodeGroup>
      ```Python Python theme={null} theme={null}
      import anthropic
      client = anthropic.Anthropic()

      response = client.messages.create(
          model="MiniMax-M2",
          max_tokens=1024,
          tools=[
              {
                  "name": "search_documents",
                  "description": "Search through the knowledge base",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "query": {
                              "type": "string",
                              "description": "Search query"
                          }
                      },
                      "required": ["query"]
                  }
              },
              {
                  "name": "get_document",
                  "description": "Retrieve a specific document by ID",
                  "input_schema": {
                      "type": "object",
                      "properties": {
                          "doc_id": {
                              "type": "string",
                              "description": "Document ID"
                          }
                      },
                      "required": ["doc_id"]
                  },
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          system=[
              {
                  "type": "text",
                  "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
                  "cache_control": {"type": "ephemeral"}
              },
              {
                  "type": "text",
                  "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
                  "cache_control": {"type": "ephemeral"}
              }
          ],
          messages=[
              {
                  "role": "user",
                  "content": "Can you search for information about Mars rovers?"
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "tool_use",
                          "id": "tool_1",
                          "name": "search_documents",
                          "input": {"query": "Mars rovers"}
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "tool_result",
                          "tool_use_id": "tool_1",
                          "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                      }
                  ]
              },
              {
                  "role": "assistant",
                  "content": [
                      {
                          "type": "text",
                          "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                      }
                  ]
              },
              {
                  "role": "user",
                  "content": [
                      {
                          "type": "text",
                          "text": "Yes, please tell me about the Perseverance rover specifically.",
                          "cache_control": {"type": "ephemeral"}
                      }
                  ]
              }
          ]
      )
      print(response.model_dump_json())
      ```
    </CodeGroup>

    这个综合示例演示了如何使用所有 4 个可用的缓存断点来优化 prompt 的不同部分：

    此模式特别适用于：

    * 具有大型文档上下文的 RAG 应用程序
    * 使用多个工具的 Agent 系统
    * 保持上下文的长时间对话
    * 需要独立优化 prompt 不同部分的应用程序
  </Accordion>
</AccordionGroup>

***

# OpenAI API 兼容的 Cache 说明

<Note>
  即将到来，敬请期待
</Note>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt