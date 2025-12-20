# PDF 支援

使用 Claude 處理 PDF。從您的文件中提取文字、分析圖表，並理解視覺內容。

---

您現在可以向 Claude 詢問您提供的 PDF 中的任何文字、圖片、圖表和表格。一些範例使用案例：
- 分析財務報告並理解圖表/表格
- 從法律文件中提取關鍵資訊
- 文件翻譯協助
- 將文件資訊轉換為結構化格式

## 開始之前

### 檢查 PDF 要求
Claude 可以處理任何標準 PDF。但是，在使用 PDF 支援時，您應該確保您的請求大小符合這些要求：

| 要求 | 限制 |
|---|---|
| 最大請求大小 | 32MB |
| 每個請求的最大頁數 | 100 |
| 格式 | 標準 PDF（無密碼/加密） |

請注意，這兩個限制都適用於整個請求負載，包括與 PDF 一起發送的任何其他內容。

由於 PDF 支援依賴於 Claude 的視覺能力，它受到與其他視覺任務相同的[限制和注意事項](/docs/zh-TW/build-with-claude/vision#limitations)。

### 支援的平台和模型

PDF 支援目前透過直接 API 存取和 Google Vertex AI 支援。所有[活躍模型](/docs/zh-TW/about-claude/models/overview)都支援 PDF 處理。

PDF 支援現在在 Amazon Bedrock 上可用，但有以下注意事項：

### Amazon Bedrock PDF 支援

透過 Amazon Bedrock 的 Converse API 使用 PDF 支援時，有兩種不同的文件處理模式：

<Note>
**重要**：要在 Converse API 中存取 Claude 的完整視覺 PDF 理解能力，您必須啟用引用。如果沒有啟用引用，API 會退回到僅基本文字提取。了解更多關於[使用引用](/docs/zh-TW/build-with-claude/citations)。
</Note>

#### 文件處理模式

1. **Converse Document Chat**（原始模式 - 僅文字提取）
   - 提供 PDF 的基本文字提取
   - 無法分析 PDF 中的圖像、圖表或視覺佈局
   - 3 頁 PDF 使用約 1,000 個 token
   - 當未啟用引用時自動使用

2. **Claude PDF Chat**（新模式 - 完整視覺理解）
   - 提供 PDF 的完整視覺分析
   - 可以理解和分析圖表、圖形、圖像和視覺佈局
   - 將每頁處理為文字和圖像以進行全面理解
   - 3 頁 PDF 使用約 7,000 個 token
   - **需要在 Converse API 中啟用引用**

#### 主要限制

- **Converse API**：視覺 PDF 分析需要啟用引用。目前沒有選項可以在不使用引用的情況下使用視覺分析（與 InvokeModel API 不同）。
- **InvokeModel API**：提供對 PDF 處理的完全控制，無需強制引用。

#### 常見問題

如果客戶報告在使用 Converse API 時 Claude 看不到他們 PDF 中的圖像或圖表，他們可能需要啟用引用標誌。沒有它，Converse 會退回到僅基本文字提取。

<Note>
這是 Converse API 的已知限制，我們正在努力解決。對於需要無引用視覺 PDF 分析的應用程式，請考慮使用 InvokeModel API。
</Note>

<Note>
對於非 PDF 檔案，如 .csv、.xlsx、.docx、.md 或 .txt 檔案，請參閱[使用其他檔案格式](/docs/zh-TW/build-with-claude/files#working-with-other-file-formats)。
</Note>

***

## 使用 Claude 處理 PDF

### 發送您的第一個 PDF 請求
讓我們從使用 Messages API 的簡單範例開始。您可以透過三種方式向 Claude 提供 PDF：

1. 作為線上託管 PDF 的 URL 參考
2. 作為 `document` 內容區塊中的 base64 編碼 PDF
3. 透過[Files API](/docs/zh-TW/build-with-claude/files)的 `file_id`

#### 選項 1：基於 URL 的 PDF 文件

最簡單的方法是直接從 URL 參考 PDF：

<CodeGroup>
   ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "url",
                    "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                }
            },
            {
                "type": "text",
                "text": "這份文件中的主要發現是什麼？"
            }]
        }]
    }'
    ```
    ```python Python
    import anthropic

    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "url",
                            "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                        }
                    },
                    {
                        "type": "text",
                        "text": "這份文件中的主要發現是什麼？"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic();
    
    async function main() {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'url',
                  url: 'https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf',
                },
              },
              {
                type: 'text',
                text: '這份文件中的主要發現是什麼？',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```
    ```java Java
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.*;

    public class PdfExample {
        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Create document block with URL
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .urlPdfSource("https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf")
                    .build();

            // Create a message with document and text content blocks
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("這份文件中的主要發現是什麼？")
 .build()
 )
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message.content());
        }
    }
    ```
</CodeGroup>

#### 選項 2：Base64 編碼的 PDF 文件

如果您需要從本地系統發送 PDF 或當 URL 不可用時：

<CodeGroup>
    ```bash Shell
    # 方法 1：獲取並編碼遠端 PDF
    curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

    # 方法 2：編碼本地 PDF 檔案
    # base64 document.pdf | tr -d '\n' > pdf_base64.txt

    # 使用 pdf_base64.txt 內容建立 JSON 請求檔案
    jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": $PDF_BASE64
                }
            },
            {
                "type": "text",
                "text": "這份文件中的主要發現是什麼？"
            }]
        }]
    }' > request.json

    # 使用 JSON 檔案發送 API 請求
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d @request.json
    ```
    ```python Python
    import anthropic
    import base64
    import httpx

    # 首先，載入並編碼 PDF
    pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
    pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

    # 替代方案：從本地檔案載入
    # with open("document.pdf", "rb") as f:
    #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

    # 使用 base64 編碼發送到 Claude
    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_data
                        }
                    },
                    {
                        "type": "text",
                        "text": "這份文件中的主要發現是什麼？"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';
    import fetch from 'node-fetch';
    import fs from 'fs';

    async function main() {
      // 方法 1：獲取並編碼遠端 PDF
      const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
      const pdfResponse = await fetch(pdfURL);
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
      
      // 方法 2：從本地檔案載入
      // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
      
      // 使用 base64 編碼的 PDF 發送 API 請求
      const anthropic = new Anthropic();
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: '這份文件中的主要發現是什麼？',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```

    ```java Java
    import java.io.IOException;
    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.util.Base64;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.ContentBlockParam;
    import com.anthropic.models.messages.DocumentBlockParam;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.TextBlockParam;

    public class PdfExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // 方法 1：下載並編碼遠端 PDF
            String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pdfUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

            // 方法 2：從本地檔案載入
            // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
            // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

            // 使用 base64 資料建立文件區塊
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .base64PdfSource(pdfBase64)
                    .build();

            // 建立包含文件和文字內容區塊的訊息
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(TextBlockParam.builder().text("這份文件中的主要發現是什麼？").build())
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            message.content().stream()
                    .flatMap(contentBlock -> contentBlock.text().stream())
                    .forEach(textBlock -> System.out.println(textBlock.text()));
        }
    }
    ```

</CodeGroup>

#### 選項 3：Files API

對於您將重複使用的 PDF，或當您想避免編碼開銷時，請使用[Files API](/docs/zh-TW/build-with-claude/files)：

<CodeGroup>
```bash Shell
# 首先，將您的 PDF 上傳到 Files API
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@document.pdf"

# 然後在您的訊息中使用返回的 file_id
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -d '{
    "model": "claude-sonnet-4-5", 
    "max_tokens": 1024,
    "messages": [{
      "role": "user",
      "content": [{
        "type": "document",
        "source": {
          "type": "file",
          "file_id": "file_abc123"
        }
      },
      {
        "type": "text",
        "text": "這份文件中的主要發現是什麼？"
      }]
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# 上傳 PDF 檔案
with open("document.pdf", "rb") as f:
    file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

# 在訊息中使用上傳的檔案
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": file_upload.id
                    }
                },
                {
                    "type": "text",
                    "text": "這份文件中的主要發現是什麼？"
                }
            ]
        }
    ],
)

print(message.content)
```

```typescript TypeScript
import { Anthropic, toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function main() {
  // 上傳 PDF 檔案
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // 在訊息中使用上傳的檔案
  const response = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    betas: ['files-api-2025-04-14'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'file',
              file_id: fileUpload.id
            }
          },
          {
            type: 'text',
            text: '這份文件中的主要發現是什麼？'
          }
        ]
      }
    ]
  });

  console.log(response);
}

main();
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.File;
import com.anthropic.models.files.FileUploadParams;
import com.anthropic.models.messages.*;

public class PdfFilesExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // 上傳 PDF 檔案
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("document.pdf")))
                .build());

        // 在訊息中使用上傳的檔案
        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .fileSource(file.id())
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(
                        List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("這份文件中的主要發現是什麼？")
 .build()
 )
                        )
                )
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.content());
    }
}
```
</CodeGroup>

### PDF 支援的運作方式
當您向 Claude 發送 PDF 時，會發生以下步驟：
<Steps>
  <Step title="系統提取文件的內容。">
    - 系統將文件的每一頁轉換為圖像。
    - 從每一頁提取文字，並與每頁的圖像一起提供。
  </Step>
  <Step title="Claude 分析文字和圖像以更好地理解文件。">
    - 文件以文字和圖像的組合形式提供進行分析。
    - 這允許使用者詢問 PDF 視覺元素的見解，如圖表、圖解和其他非文字內容。
  </Step>
  <Step title="Claude 回應，如果相關的話會參考 PDF 的內容。">
    Claude 在回應時可以參考文字和視覺內容。您可以透過將 PDF 支援與以下功能整合來進一步提高效能：
    - **提示快取**：提高重複分析的效能。
    - **批次處理**：用於大量文件處理。
    - **工具使用**：從文件中提取特定資訊用作工具輸入。
  </Step>
</Steps>

### 估算您的成本
PDF 檔案的 token 計數取決於從文件中提取的總文字以及頁數：
- 文字 token 成本：每頁通常使用 1,500-3,000 個 token，取決於內容密度。適用標準 API 定價，無額外 PDF 費用。
- 圖像 token 成本：由於每頁都轉換為圖像，因此適用相同的[基於圖像的成本計算](/docs/zh-TW/build-with-claude/vision#evaluate-image-size)。

您可以使用[token 計數](/docs/zh-TW/build-with-claude/token-counting)來估算特定 PDF 的成本。

***

## 優化 PDF 處理

### 提高效能
遵循這些最佳實踐以獲得最佳結果：
- 在請求中將 PDF 放在文字之前
- 使用標準字體
- 確保文字清晰易讀
- 將頁面旋轉到正確的直立方向
- 在提示中使用邏輯頁碼（來自 PDF 檢視器）
- 需要時將大型 PDF 分割成塊
- 為重複分析啟用提示快取

### 擴展您的實作
對於大量處理，請考慮這些方法：

#### 使用提示快取
快取 PDF 以提高重複查詢的效能：
<CodeGroup>
```bash Shell
# 使用 pdf_base64.txt 內容建立 JSON 請求檔案
jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [{
        "role": "user",
        "content": [{
            "type": "document",
            "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": $PDF_BASE64
            },
            "cache_control": {
              "type": "ephemeral"
            }
        },
        {
            "type": "text",
            "text": "哪個模型在每個使用案例中具有最高的人類偏好勝率？"
        }]
    }]
}' > request.json

# 然後使用 JSON 檔案進行 API 呼叫
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data
                    },
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "分析這份文件。"
                }
            ]
        }
    ],
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    {
      content: [
        {
          type: 'document',
          source: {
            media_type: 'application/pdf',
            type: 'base64',
            data: pdfBase64,
          },
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: '哪個模型在每個使用案例中具有最高的人類偏好勝率？',
        },
      ],
      role: 'user',
    },
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Base64PdfSource;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.DocumentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class MessagesDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // 讀取 PDF 檔案為 base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .cacheControl(CacheControlEphemeral.builder().build())
 .build()),
                        ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("哪個模型在每個使用案例中具有最高的人類偏好勝率？")
 .build())
                ))
                .build();


        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

#### 處理文件批次
使用 Message Batches API 進行大量工作流程：
<CodeGroup>
```bash Shell
# 使用 pdf_base64.txt 內容建立 JSON 請求檔案
jq -n --rawfile PDF_BASE64 pdf_base64.txt '
{
  "requests": [
      {
          "custom_id": "my-first-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "哪個模型在每個使用案例中具有最高的人類偏好勝率？"
                        }
                    ]
                }
              ]
          }
      },
      {
          "custom_id": "my-second-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "從這份文件中提取 5 個關鍵見解。"
                        }
                    ]
                }
              ]
          }
      }
  ]
}
' > request.json

# 然後使用 JSON 檔案進行 API 呼叫
curl https://api.anthropic.com/v1/messages/batches \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message_batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "doc1",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
 "type": "document",
 "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": pdf_data
 }
                            },
                            {
 "type": "text",
 "text": "總結這份文件。"
                            }
                        ]
                    }
                ]
            }
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.batches.create({
  requests: [
    {
      custom_id: 'my-first-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: '哪個模型在每個使用案例中具有最高的人類偏好勝率？',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    },
    {
      custom_id: 'my-second-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: '從這份文件中提取 5 個關鍵見解。',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    }
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;
import com.anthropic.models.messages.batches.*;

public class MessagesBatchDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // 讀取 PDF 檔案為 base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        BatchCreateParams params = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("哪個模型在每個使用案例中具有最高的人類偏好勝率？")
 .build()
 )
 ))
 .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("從這份文件中提取 5 個關鍵見解。")
 .build()
 )
 ))
 .build())
                        .build())
                .build();

        MessageBatch batch = client.messages().batches().create(params);
        System.out.println(batch);
    }
}
```
</CodeGroup>

## 下一步

<CardGroup cols={2}>
  <Card
    title="嘗試 PDF 範例"
    icon="file"
    href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal"
  >
    在我們的 cookbook 食譜中探索 PDF 處理的實用範例。
  </Card>

  <Card
    title="查看 API 參考"
    icon="code"
    href="/docs/zh-TW/api/messages"
  >
    查看 PDF 支援的完整 API 文件。
  </Card>
</CardGroup>