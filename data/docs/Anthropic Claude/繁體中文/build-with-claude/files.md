# Files API

---

Files API 讓您上傳和管理檔案以與 Claude API 搭配使用，無需在每次請求時重新上傳內容。這在使用[程式碼執行工具](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool)提供輸入（例如資料集和文件）然後下載輸出（例如圖表）時特別有用。您也可以使用 Files API 來避免在多個 API 呼叫中持續重新上傳常用的文件和影像。您可以[直接探索 API 參考](/docs/zh-TW/api/files-create)，以及本指南。

<Note>
Files API 目前處於測試版。請透過我們的[意見回饋表單](https://forms.gle/tisHyierGwgN4DUE9)分享您對 Files API 的體驗。
</Note>

## 支援的模型

在 Messages 請求中參考 `file_id` 在所有支援給定檔案類型的模型中都受支援。例如，[影像](/docs/zh-TW/build-with-claude/vision)在所有 Claude 3+ 模型中受支援，[PDF](/docs/zh-TW/build-with-claude/pdf-support) 在所有 Claude 3.5+ 模型中受支援，以及[各種其他檔案類型](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool#supported-file-types)用於 Claude 3.5 Haiku 及所有 Claude 3.7+ 模型中的程式碼執行工具。

Files API 目前在 Amazon Bedrock 或 Google Vertex AI 上不受支援。

## Files API 的運作方式

Files API 提供了一個簡單的一次上傳、多次使用的方法來處理檔案：

- **上傳檔案**到我們的安全儲存空間並接收唯一的 `file_id`
- **下載**由技能或程式碼執行工具建立的檔案
- **在 [Messages](/docs/zh-TW/api/messages) 請求中參考檔案**，使用 `file_id` 而不是重新上傳內容
- **管理您的檔案**，進行列表、檢索和刪除操作

## 如何使用 Files API

<Note>
要使用 Files API，您需要包含測試版功能標頭：`anthropic-beta: files-api-2025-04-14`。
</Note>

### 上傳檔案

上傳檔案以在未來的 API 呼叫中參考：

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@/path/to/document.pdf"
```

```python Python
import anthropic

client = anthropic.Anthropic()
client.beta.files.upload(
  file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
)
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from "fs";

const anthropic = new Anthropic();

await anthropic.beta.files.upload({
  file: await toFile(fs.createReadStream('/path/to/document.pdf'), undefined, { type: 'application/pdf' })
}, {
  betas: ['files-api-2025-04-14']
});
```
</CodeGroup>

上傳檔案的回應將包括：

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-01-01T00:00:00Z",
  "downloadable": false
}
```

### 在訊息中使用檔案

上傳後，使用其 `file_id` 參考檔案：

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Please summarize this document for me."          
          },
          {
            "type": "document",
            "source": {
              "type": "file",
              "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
            }
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please summarize this document for me."
                },
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                    }
                }
            ]
        }
    ],
    betas=["files-api-2025-04-14"],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please summarize this document for me."
        },
        {
          type: "document",
          source: {
            type: "file",
            file_id: "file_011CNha8iCJcU1wXNR6q4V8w"
          }
        }
      ]
    }
  ],
  betas: ["files-api-2025-04-14"],
});

console.log(response);
```
</CodeGroup>

### 檔案類型和內容區塊

Files API 支援對應於不同內容區塊類型的不同檔案類型：

| 檔案類型 | MIME 類型 | 內容區塊類型 | 使用案例 |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | 文字分析、文件處理 |
| 純文字 | `text/plain` | `document` | 文字分析、處理 |
| 影像 | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | 影像分析、視覺任務 |
| [資料集、其他](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | 變動 | `container_upload` | 分析資料、建立視覺化  |

### 使用其他檔案格式

對於不支援作為 `document` 區塊的檔案類型（.csv、.txt、.md、.docx、.xlsx），將檔案轉換為純文字，並將內容直接包含在您的訊息中：

<CodeGroup>
```bash Shell
# 範例：讀取文字檔案並將其作為純文字發送
# 注意：對於包含特殊字元的檔案，請考慮 base64 編碼
TEXT_CONTENT=$(cat document.txt | jq -Rs .)

curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @- <<EOF
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Here's the document content:\n\n${TEXT_CONTENT}\n\nPlease summarize this document."
        }
      ]
    }
  ]
}
EOF
```

```python Python
import pandas as pd
import anthropic

client = anthropic.Anthropic()

# 範例：讀取 CSV 檔案
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# 在訊息中作為純文字發送
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Here's the CSV data:\n\n{csv_content}\n\nPlease analyze this data."
                }
            ]
        }
    ]
)

print(response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function analyzeDocument() {
  // 範例：讀取文字檔案
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // 在訊息中作為純文字發送
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Here's the document content:\n\n${textContent}\n\nPlease summarize this document.`
          }
        ]
      }
    ]
  });

  console.log(response.content[0].text);
}

analyzeDocument();
```
</CodeGroup>

<Note>
對於包含影像的 .docx 檔案，請先將其轉換為 PDF 格式，然後使用[PDF 支援](/docs/zh-TW/build-with-claude/pdf-support)以利用內建的影像解析。這允許使用 PDF 文件中的引用。
</Note>

#### 文件區塊

對於 PDF 和文字檔案，使用 `document` 內容區塊：

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // 選用
  "context": "Context about the document", // 選用  
  "citations": {"enabled": true} // 選用，啟用引用
}
```

#### 影像區塊

對於影像，使用 `image` 內容區塊：

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### 管理檔案

#### 列表檔案

檢索您上傳的檔案清單：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
files = client.beta.files.list()
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const files = await anthropic.beta.files.list({
  betas: ['files-api-2025-04-14'],
});
```
</CodeGroup>

#### 取得檔案中繼資料

檢索特定檔案的資訊：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
file = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const file = await anthropic.beta.files.retrieveMetadata(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

#### 刪除檔案

從您的工作區移除檔案：

<CodeGroup>
```bash Shell
curl -X DELETE https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const result = await anthropic.beta.files.delete(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

### 下載檔案

下載由技能或程式碼執行工具建立的檔案：

<CodeGroup>
```bash Shell
curl -X GET "https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output downloaded_file.txt
```

```python Python
import anthropic

client = anthropic.Anthropic()
file_content = client.beta.files.download("file_011CNha8iCJcU1wXNR6q4V8w")

# 儲存到檔案
with open("downloaded_file.txt", "w") as f:
    f.write(file_content.decode('utf-8'))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

const fileContent = await anthropic.beta.files.download(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);

// 儲存到檔案
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
您只能下載由[技能](/docs/zh-TW/build-with-claude/skills-guide)或[程式碼執行工具](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool)建立的檔案。您上傳的檔案無法下載。
</Note>

---

## 檔案儲存和限制

### 儲存限制

- **最大檔案大小：** 每個檔案 500 MB
- **總儲存空間：** 每個組織 100 GB

### 檔案生命週期

- 檔案的範圍限於 API 金鑰的工作區。其他 API 金鑰可以使用由與同一工作區相關聯的任何其他 API 金鑰建立的檔案
- 檔案會持續存在，直到您刪除它們
- 已刪除的檔案無法恢復
- 檔案在刪除後不久將無法透過 API 存取，但它們可能會在活躍的 `Messages` API 呼叫和相關工具使用中持續存在
- 使用者刪除的檔案將根據我們的[資料保留政策](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data)進行刪除。

---

## 錯誤處理

使用 Files API 時的常見錯誤包括：

- **找不到檔案 (404)：** 指定的 `file_id` 不存在或您無法存取它
- **無效的檔案類型 (400)：** 檔案類型與內容區塊類型不符（例如在文件區塊中使用影像檔案）
- **超過內容視窗大小 (400)：** 檔案大於內容視窗大小（例如在 `/v1/messages` 請求中使用 500 MB 純文字檔案）
- **無效的檔案名稱 (400)：** 檔案名稱不符合長度要求（1-255 個字元）或包含禁止的字元（`<`、`>`、`:`、`"`、`|`、`?`、`*`、`\`、`/` 或 unicode 字元 0-31）
- **檔案過大 (413)：** 檔案超過 500 MB 限制
- **超過儲存限制 (403)：** 您的組織已達到 100 GB 儲存限制

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## 使用和計費

Files API 操作**免費**：
- 上傳檔案
- 下載檔案
- 列表檔案
- 取得檔案中繼資料  
- 刪除檔案

在 `Messages` 請求中使用的檔案內容按輸入令牌計費。您只能下載由[技能](/docs/zh-TW/build-with-claude/skills-guide)或[程式碼執行工具](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool)建立的檔案。

### 速率限制

在測試版期間：
- 檔案相關的 API 呼叫限制為每分鐘約 100 個請求
- 如果您的使用案例需要更高的限制，請[聯絡我們](mailto:sales@anthropic.com)