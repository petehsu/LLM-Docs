# 引用

Claude 能夠在回答有關文件的問題時提供詳細引用，幫助您追蹤和驗證回應中的資訊來源。

---

Claude 能夠在回答有關文件的問題時提供詳細引用，幫助您追蹤和驗證回應中的資訊來源。

所有[活躍模型](/docs/zh-TW/about-claude/models/overview)都支援引用，除了 Haiku 3。

<Warning>
*Claude Sonnet 3.7 的引用*

與其他 Claude 模型相比，Claude Sonnet 3.7 在沒有用戶更明確指示的情況下，可能較不傾向於進行引用。在使用 Claude Sonnet 3.7 進行引用時，我們建議在 `user` 回合中包含額外的指示，例如 `"使用引用來支持您的答案。"`

我們也觀察到，當模型被要求結構化其回應時，除非明確告知在該格式內使用引用，否則不太可能使用引用。例如，如果模型被要求在其回應中使用 `<result>` 標籤，您應該添加類似 `"始終在您的答案中使用引用，即使在 <result> 標籤內也是如此。"` 的內容
</Warning>
<Tip>
  請使用此[表單](https://forms.gle/9n9hSrKnKe3rpowH9)分享您對引用功能的回饋和建議。
</Tip>

以下是如何在 Messages API 中使用引用的範例：

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
**與基於提示的方法比較**

與基於提示的引用解決方案相比，引用功能具有以下優勢：
- **成本節省：** 如果您基於提示的方法要求 Claude 輸出直接引用，您可能會看到成本節省，因為 `cited_text` 不計入您的輸出代幣。
- **更好的引用可靠性：** 因為我們將引用解析為上述相應的回應格式並提取 `cited_text`，引用保證包含對提供文件的有效指標。
- **改善的引用品質：** 在我們的評估中，我們發現與純粹基於提示的方法相比，引用功能更有可能引用文件中最相關的引用。
</Tip>

---

## 引用如何運作

透過以下步驟將引用與 Claude 整合：

<Steps>
  <Step title="提供文件並啟用引用">
    - 包含任何支援格式的文件：[PDF](#pdf-documents)、[純文字](#plain-text-documents)或[自訂內容](#custom-content-documents)文件
    - 在每個文件上設定 `citations.enabled=true`。目前，引用必須在請求中的所有文件上啟用或全部不啟用。
    - 請注意，目前僅支援文字引用，尚不支援圖像引用。
  </Step>
  <Step title="文件處理">
    - 文件內容被「分塊」以定義可能引用的最小粒度。例如，句子分塊將允許 Claude 引用單個句子或將多個連續句子串聯起來引用段落（或更長）！
      - **對於 PDF：** 文字按照 [PDF 支援](/docs/zh-TW/build-with-claude/pdf-support)中描述的方式提取，內容被分塊為句子。目前不支援從 PDF 引用圖像。
      - **對於純文字文件：** 內容被分塊為可以引用的句子。
      - **對於自訂內容文件：** 您提供的內容塊按原樣使用，不進行進一步分塊。
  </Step>
  <Step title="Claude 提供引用回應">
    - 回應現在可能包含多個文字塊，其中每個文字塊可以包含 Claude 正在做出的聲明和支持該聲明的引用列表。
    - 引用參考來源文件中的特定位置。這些引用的格式取決於被引用文件的類型。
      - **對於 PDF：** 引用將包含頁碼範圍（1 索引）。
      - **對於純文字文件：** 引用將包含字符索引範圍（0 索引）。
      - **對於自訂內容文件：** 引用將包含內容塊索引範圍（0 索引），對應於提供的原始內容列表。
    - 提供文件索引以指示參考來源，並根據原始請求中所有文件的列表進行 0 索引。
  </Step>
</Steps>

<Tip>
  **自動分塊 vs 自訂內容**

  預設情況下，純文字和 PDF 文件會自動分塊為句子。如果您需要更多對引用粒度的控制（例如，對於項目符號或轉錄），請改用自訂內容文件。有關更多詳細資訊，請參閱[文件類型](#document-types)。

  例如，如果您希望 Claude 能夠從您的 RAG 塊中引用特定句子，您應該將每個 RAG 塊放入純文字文件中。否則，如果您不希望進行任何進一步的分塊，或者如果您想要自訂任何額外的分塊，您可以將 RAG 塊放入自訂內容文件中。
</Tip>

### 可引用 vs 不可引用內容

- 文件 `source` 內容中找到的文字可以被引用。
- `title` 和 `context` 是可選欄位，將傳遞給模型但不用於引用內容。
- `title` 長度有限，因此您可能會發現 `context` 欄位在儲存任何文件元資料作為文字或字串化 json 時很有用。

### 引用索引
- 文件索引從請求中所有文件內容塊的列表（跨越所有訊息）進行 0 索引。
- 字符索引是 0 索引，具有排他性結束索引。
- 頁碼是 1 索引，具有排他性結束頁碼。
- 內容塊索引從自訂內容文件中提供的 `content` 列表進行 0 索引，具有排他性結束索引。

### 代幣成本
- 啟用引用會因系統提示添加和文件分塊而略微增加輸入代幣。
- 然而，引用功能在輸出代幣方面非常高效。在底層，模型以標準化格式輸出引用，然後解析為引用文字和文件位置索引。`cited_text` 欄位是為了方便而提供的，不計入輸出代幣。
- 當在後續對話回合中傳回時，`cited_text` 也不計入輸入代幣。

### 功能相容性
引用與其他 API 功能配合使用，包括[提示快取](/docs/zh-TW/build-with-claude/prompt-caching)、[代幣計數](/docs/zh-TW/build-with-claude/token-counting)和[批次處理](/docs/zh-TW/build-with-claude/batch-processing)。

#### 將提示快取與引用一起使用

引用和提示快取可以有效地一起使用。

在回應中生成的引用塊不能直接快取，但它們引用的來源文件可以被快取。為了優化效能，將 `cache_control` 應用於您的頂層文件內容塊。

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# 長文件內容（例如，技術文件）
long_document = "This is a very long document with thousands of words..." + " ... " * 1000  # 最小可快取長度

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
                    "cache_control": {"type": "ephemeral"}  # 快取文件內容
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

// 長文件內容（例如，技術文件）
const longDocument = "This is a very long document with thousands of words..." + " ... ".repeat(1000);  // 最小可快取長度

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
          cache_control: { type: "ephemeral" }  // 快取文件內容
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

在此範例中：
- 文件內容使用文件塊上的 `cache_control` 進行快取
- 在文件上啟用引用
- Claude 可以生成帶有引用的回應，同時受益於快取的文件內容
- 使用相同文件的後續請求將受益於快取的內容

## 文件類型

### 選擇文件類型

我們支援三種引用文件類型。文件可以直接在訊息中提供（base64、文字或 URL）或透過[檔案 API](/docs/zh-TW/build-with-claude/files)上傳並通過 `file_id` 引用：

| 類型 | 最適合 | 分塊 | 引用格式 |
| :--- | :--- | :--- | :--- |
| 純文字 | 簡單文字文件、散文 | 句子 | 字符索引（0 索引） |
| PDF | 包含文字內容的 PDF 檔案 | 句子 | 頁碼（1 索引） |
| 自訂內容 | 列表、轉錄、特殊格式、更細粒度的引用 | 無額外分塊 | 塊索引（0 索引） |

<Note>
不支援 .csv、.xlsx、.docx、.md 和 .txt 檔案作為文件塊。將這些轉換為純文字並直接包含在訊息內容中。請參閱[使用其他檔案格式](/docs/zh-TW/build-with-claude/files#working-with-other-file-formats)。
</Note>

### 純文字文件

純文字文件會自動分塊為句子。您可以內聯提供它們或通過其 `file_id` 引用：

<Tabs>
<Tab title="內聯文字">
```python
{
    "type": "document",
    "source": {
        "type": "text",
        "media_type": "text/plain",
        "data": "Plain text content..."
    },
    "title": "Document Title", # 可選
    "context": "Context about the document that will not be cited from", # 可選
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="檔案 API">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Document Title", # 可選
    "context": "Context about the document that will not be cited from", # 可選
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="純文字引用範例">

```python
{
    "type": "char_location",
    "cited_text": "The exact text being cited", # 不計入輸出代幣
    "document_index": 0,
    "document_title": "Document Title",
    "start_char_index": 0,    # 0 索引
    "end_char_index": 50      # 排他性
}
```

</section>

### PDF 文件

PDF 文件可以作為 base64 編碼資料或通過 `file_id` 提供。PDF 文字被提取並分塊為句子。由於尚不支援圖像引用，掃描文件且不包含可提取文字的 PDF 將無法引用。

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
    "title": "Document Title", # 可選
    "context": "Context about the document that will not be cited from", # 可選
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="檔案 API">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Document Title", # 可選
    "context": "Context about the document that will not be cited from", # 可選
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="PDF 引用範例">

```python
{
    "type": "page_location",
    "cited_text": "The exact text being cited", # 不計入輸出代幣
    "document_index": 0,     
    "document_title": "Document Title", 
    "start_page_number": 1,  # 1 索引
    "end_page_number": 2     # 排他性
}
```

</section>

### 自訂內容文件

自訂內容文件讓您控制引用粒度。不進行額外分塊，塊根據提供的內容塊提供給模型。

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
    "title": "Document Title", # 可選
    "context": "Context about the document that will not be cited from", # 可選
    "citations": {"enabled": True}
}
```

<section title="引用範例">

```python
{
    "type": "content_block_location",
    "cited_text": "The exact text being cited", # 不計入輸出代幣
    "document_index": 0,
    "document_title": "Document Title",
    "start_block_index": 0,   # 0 索引
    "end_block_index": 1      # 排他性
}
```

</section>

---

## 回應結構

當啟用引用時，回應包含多個帶有引用的文字塊：

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

### 串流支援

對於串流回應，我們添加了一個 `citations_delta` 類型，其中包含要添加到當前 `text` 內容塊上的 `citations` 列表的單個引用。

<section title="串流事件範例">

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