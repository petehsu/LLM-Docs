# 引用

Claude能够在回答有关文档的问题时提供详细的引用，帮助您跟踪和验证响应中的信息来源。

---

Claude能够在回答有关文档的问题时提供详细的引用，帮助您跟踪和验证响应中的信息来源。

所有[活跃模型](/docs/zh-CN/about-claude/models/overview)都支持引用，除了Haiku 3。

<Warning>
*Claude Sonnet 3.7的引用*

与其他Claude模型相比，Claude Sonnet 3.7在没有用户更明确指示的情况下，可能不太容易进行引用。在使用Claude Sonnet 3.7进行引用时，我们建议在`user`轮次中包含额外的指示，例如`"使用引用来支持您的答案。"`

我们还观察到，当要求模型结构化其响应时，除非明确告知在该格式内使用引用，否则它不太可能使用引用。例如，如果要求模型在其响应中使用`<result>`标签，您应该添加类似`"始终在您的答案中使用引用，即使在<result>标签内也是如此。"`的内容
</Warning>
<Tip>
  请使用此[表单](https://forms.gle/9n9hSrKnKe3rpowH9)分享您对引用功能的反馈和建议。
</Tip>

以下是如何在Messages API中使用引用的示例：

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "text",
              "media_type": "text/plain",
              "data": "The grass is green. The sky is blue."
            },
            "title": "My Document",
            "context": "This is a trustworthy document.",
            "citations": {"enabled": true}
          },
          {
            "type": "text",
            "text": "What color is the grass and sky?"
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "The grass is green. The sky is blue."
                    },
                    "title": "My Document",
                    "context": "This is a trustworthy document.",
                    "citations": {"enabled": True}
                },
                {
                    "type": "text",
                    "text": "What color is the grass and sky?"
                }
            ]
        }
    ]
)
print(response)
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;

public class DocumentExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        PlainTextSource source = PlainTextSource.builder()
                .data("The grass is green. The sky is blue.")
                .build();

        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .source(source)
                .title("My Document")
                .context("This is a trustworthy document.")
                .citations(CitationsConfigParam.builder().enabled(true).build())
                .build();
        
        TextBlockParam textBlockParam = TextBlockParam.builder()
                .text("What color is the grass and sky?")
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(ContentBlockParam.ofDocument(documentParam), ContentBlockParam.ofText(textBlockParam)))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```

</CodeGroup>

<Tip>
**与基于提示的方法的比较**

与基于提示的引用解决方案相比，引用功能具有以下优势：
- **成本节省：** 如果您基于提示的方法要求Claude输出直接引用，您可能会看到成本节省，因为`cited_text`不计入您的输出令牌。
- **更好的引用可靠性：** 因为我们将引用解析为上述相应的响应格式并提取`cited_text`，引用保证包含指向提供文档的有效指针。
- **改进的引用质量：** 在我们的评估中，我们发现与纯粹基于提示的方法相比，引用功能更有可能引用文档中最相关的引用。
</Tip>

---

## 引用的工作原理

通过以下步骤将引用与Claude集成：

<Steps>
  <Step title="提供文档并启用引用">
    - 包含任何支持格式的文档：[PDF](#pdf-documents)、[纯文本](#plain-text-documents)或[自定义内容](#custom-content-documents)文档
    - 在每个文档上设置`citations.enabled=true`。目前，必须在请求中的所有文档或没有文档上启用引用。
    - 请注意，目前仅支持文本引用，图像引用尚不可能。
  </Step>
  <Step title="文档被处理">
    - 文档内容被"分块"以定义可能引用的最小粒度。例如，句子分块将允许Claude引用单个句子或将多个连续句子链接在一起以引用段落（或更长）！
      - **对于PDF：** 文本按[PDF支持](/docs/zh-CN/build-with-claude/pdf-support)中描述的方式提取，内容被分块为句子。目前不支持从PDF引用图像。
      - **对于纯文本文档：** 内容被分块为可以引用的句子。
      - **对于自定义内容文档：** 您提供的内容块按原样使用，不进行进一步分块。
  </Step>
  <Step title="Claude提供引用响应">
    - 响应现在可能包含多个文本块，其中每个文本块可以包含Claude正在做出的声明和支持该声明的引用列表。
    - 引用引用源文档中的特定位置。这些引用的格式取决于被引用文档的类型。
      - **对于PDF：** 引用将包括页码范围（从1开始索引）。
      - **对于纯文本文档：** 引用将包括字符索引范围（从0开始索引）。
      - **对于自定义内容文档：** 引用将包括内容块索引范围（从0开始索引），对应于提供的原始内容列表。
    - 提供文档索引以指示参考源，并根据原始请求中所有文档的列表从0开始索引。
  </Step>
</Steps>

<Tip>
  **自动分块与自定义内容**

  默认情况下，纯文本和PDF文档会自动分块为句子。如果您需要更多地控制引用粒度（例如，对于项目符号或转录），请改用自定义内容文档。有关更多详细信息，请参阅[文档类型](#document-types)。

  例如，如果您希望Claude能够从您的RAG块中引用特定句子，您应该将每个RAG块放入纯文本文档中。否则，如果您不希望进行任何进一步的分块，或者如果您想自定义任何额外的分块，您可以将RAG块放入自定义内容文档中。
</Tip>

### 可引用与不可引用的内容

- 文档的`source`内容中找到的文本可以被引用。
- `title`和`context`是可选字段，将传递给模型但不用于引用内容。
- `title`长度有限，因此您可能会发现`context`字段在存储任何文档元数据作为文本或字符串化json时很有用。

### 引用索引
- 文档索引从请求中所有文档内容块的列表（跨所有消息）从0开始索引。
- 字符索引从0开始索引，具有排他性结束索引。
- 页码从1开始索引，具有排他性结束页码。
- 内容块索引从自定义内容文档中提供的`content`列表从0开始索引，具有排他性结束索引。

### 令牌成本
- 启用引用会由于系统提示添加和文档分块而导致输入令牌略有增加。
- 但是，引用功能在输出令牌方面非常高效。在底层，模型以标准化格式输出引用，然后解析为引用文本和文档位置索引。`cited_text`字段是为了方便而提供的，不计入输出令牌。
- 当在后续对话轮次中传回时，`cited_text`也不计入输入令牌。

### 功能兼容性
引用与其他API功能结合使用，包括[提示缓存](/docs/zh-CN/build-with-claude/prompt-caching)、[令牌计数](/docs/zh-CN/build-with-claude/token-counting)和[批处理](/docs/zh-CN/build-with-claude/batch-processing)。

#### 将提示缓存与引用一起使用

引用和提示缓存可以有效地一起使用。

在响应中生成的引用块不能直接缓存，但它们引用的源文档可以被缓存。为了优化性能，将`cache_control`应用于您的顶级文档内容块。

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# 长文档内容（例如，技术文档）
long_document = "This is a very long document with thousands of words..." + " ... " * 1000  # 最小可缓存长度

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": long_document
                    },
                    "citations": {"enabled": True},
                    "cache_control": {"type": "ephemeral"}  # 缓存文档内容
                },
                {
                    "type": "text",
                    "text": "What does this document say about API features?"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// 长文档内容（例如，技术文档）
const longDocument = "This is a very long document with thousands of words..." + " ... ".repeat(1000);  // 最小可缓存长度

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "text",
            media_type: "text/plain",
            data: longDocument
          },
          citations: { enabled: true },
          cache_control: { type: "ephemeral" }  // 缓存文档内容
        },
        {
          type: "text",
          text: "What does this document say about API features?"
        }
      ]
    }
  ]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "This is a very long document with thousands of words..."
                    },
                    "citations": {"enabled": true},
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "What does this document say about API features?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

在此示例中：
- 文档内容使用文档块上的`cache_control`进行缓存
- 在文档上启用引用
- Claude可以生成带有引用的响应，同时受益于缓存的文档内容
- 使用相同文档的后续请求将受益于缓存的内容

## 文档类型

### 选择文档类型

我们支持三种文档类型用于引用。文档可以直接在消息中提供（base64、文本或URL）或通过[Files API](/docs/zh-CN/build-with-claude/files)上传并通过`file_id`引用：

| 类型 | 最适合 | 分块 | 引用格式 |
| :--- | :--- | :--- | :--- |
| 纯文本 | 简单文本文档、散文 | 句子 | 字符索引（从0开始索引） |
| PDF | 带有文本内容的PDF文件 | 句子 | 页码（从1开始索引） |
| 自定义内容 | 列表、转录、特殊格式、更细粒度的引用 | 无额外分块 | 块索引（从0开始索引） |

<Note>
不支持.csv、.xlsx、.docx、.md和.txt文件作为文档块。将这些转换为纯文本并直接包含在消息内容中。请参阅[使用其他文件格式](/docs/zh-CN/build-with-claude/files#working-with-other-file-formats)。
</Note>

### 纯文本文档

纯文本文档会自动分块为句子。您可以内联提供它们或通过其`file_id`引用：

<Tabs>
<Tab title="内联文本">
```python
{
    "type": "document",
    "source": {
        "type": "text",
        "media_type": "text/plain",
        "data": "Plain text content..."
    },
    "title": "Document Title", # 可选
    "context": "Context about the document that will not be cited from", # 可选
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="Files API">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Document Title", # 可选
    "context": "Context about the document that will not be cited from", # 可选
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="纯文本引用示例">

```python
{
    "type": "char_location",
    "cited_text": "The exact text being cited", # 不计入输出令牌
    "document_index": 0,
    "document_title": "Document Title",
    "start_char_index": 0,    # 从0开始索引
    "end_char_index": 50      # 排他性
}
```

</section>

### PDF文档

PDF文档可以作为base64编码数据或通过`file_id`提供。PDF文本被提取并分块为句子。由于尚不支持图像引用，扫描文档且不包含可提取文本的PDF将无法引用。

<Tabs>
<Tab title="Base64">
```python
{
    "type": "document",
    "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": base64_encoded_pdf_data
    },
    "title": "Document Title", # 可选
    "context": "Context about the document that will not be cited from", # 可选
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="Files API">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Document Title", # 可选
    "context": "Context about the document that will not be cited from", # 可选
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="PDF引用示例">

```python
{
    "type": "page_location",
    "cited_text": "The exact text being cited", # 不计入输出令牌
    "document_index": 0,     
    "document_title": "Document Title", 
    "start_page_number": 1,  # 从1开始索引
    "end_page_number": 2     # 排他性
}
```

</section>

### 自定义内容文档

自定义内容文档让您控制引用粒度。不进行额外分块，块根据提供的内容块提供给模型。

```python
{
    "type": "document",
    "source": {
        "type": "content",
        "content": [
            {"type": "text", "text": "First chunk"},
            {"type": "text", "text": "Second chunk"}
        ]
    },
    "title": "Document Title", # 可选
    "context": "Context about the document that will not be cited from", # 可选
    "citations": {"enabled": True}
}
```

<section title="引用示例">

```python
{
    "type": "content_block_location",
    "cited_text": "The exact text being cited", # 不计入输出令牌
    "document_index": 0,
    "document_title": "Document Title",
    "start_block_index": 0,   # 从0开始索引
    "end_block_index": 1      # 排他性
}
```

</section>

---

## 响应结构

启用引用时，响应包括带有引用的多个文本块：

```python
{
    "content": [
        {
            "type": "text",
            "text": "According to the document, "
        },
        {
            "type": "text",
            "text": "the grass is green",
            "citations": [{
                "type": "char_location",
                "cited_text": "The grass is green.",
                "document_index": 0,
                "document_title": "Example Document",
                "start_char_index": 0,
                "end_char_index": 20
            }]
        },
        {
            "type": "text",
            "text": " and "
        },
        {
            "type": "text",
            "text": "the sky is blue",
            "citations": [{
                "type": "char_location",
                "cited_text": "The sky is blue.",
                "document_index": 0,
                "document_title": "Example Document",
                "start_char_index": 20,
                "end_char_index": 36
            }]
        },
        {
            "type": "text",
            "text": ". Information from page 5 states that ",
        },
        {
            "type": "text",
            "text": "water is essential",
            "citations": [{
                "type": "page_location",
                "cited_text": "Water is essential for life.",
                "document_index": 1,
                "document_title": "PDF Document",
                "start_page_number": 5,
                "end_page_number": 6
            }]
        },
        {
            "type": "text",
            "text": ". The custom document mentions ",
        },
        {
            "type": "text",
            "text": "important findings",
            "citations": [{
                "type": "content_block_location",
                "cited_text": "These are important findings.",
                "document_index": 2,
                "document_title": "Custom Content Document",
                "start_block_index": 0,
                "end_block_index": 1
            }]
        }
    ]
}
```

### 流式支持

对于流式响应，我们添加了一个`citations_delta`类型，其中包含要添加到当前`text`内容块上的`citations`列表中的单个引用。

<section title="流式事件示例">

```python
event: message_start
data: {"type": "message_start", ...}

event: content_block_start
data: {"type": "content_block_start", "index": 0, ...}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, 
       "delta": {"type": "text_delta", "text": "According to..."}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0,
       "delta": {"type": "citations_delta", 
                 "citation": {
                     "type": "char_location",
                     "cited_text": "...",
                     "document_index": 0,
                     ...
                 }}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_stop
data: {"type": "message_stop"}
```

</section>