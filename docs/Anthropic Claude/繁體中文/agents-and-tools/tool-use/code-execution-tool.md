# 程式碼執行工具

Claude 可以在 API 對話中直接分析資料、建立視覺化、執行複雜計算、執行系統命令、建立和編輯檔案，以及處理上傳的檔案。

---

Claude 可以分析資料、建立視覺化、執行複雜計算、執行系統命令、建立和編輯檔案，以及直接在 API 對話中處理上傳的檔案。
程式碼執行工具允許 Claude 在安全的沙箱環境中執行 Bash 命令和操作檔案，包括編寫程式碼。

<Note>
程式碼執行工具目前處於公開測試版。

若要使用此功能，請將 `"code-execution-2025-08-25"` [測試版標頭](/docs/zh-TW/api/beta-headers) 新增至您的 API 請求。
</Note>

## 模型相容性

程式碼執行工具可在下列模型上使用：

| 模型 | 工具版本 |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Opus 4.1 (`claude-opus-4-1-20250805`) | `code_execution_20250825` |
| Claude Opus 4 (`claude-opus-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |
| Claude Sonnet 4 (`claude-sonnet-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([已棄用](/docs/zh-TW/about-claude/model-deprecations)) | `code_execution_20250825` |
| Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | `code_execution_20250825` |
| Claude Haiku 3.5 (`claude-3-5-haiku-latest`) | `code_execution_20250825` |

<Note>
目前版本 `code_execution_20250825` 支援 Bash 命令和檔案操作。舊版本 `code_execution_20250522`（僅限 Python）也可用。請參閱[升級至最新工具版本](#upgrade-to-latest-tool-version)以取得遷移詳細資訊。
</Note>

<Warning>
舊版工具版本不保證與較新的模型向後相容。請始終使用與您的模型版本相對應的工具版本。
</Warning>

## 快速開始

以下是一個簡單的範例，要求 Claude 執行計算：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            }
        ],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      }
    ],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## 程式碼執行的運作方式

當您將程式碼執行工具新增至 API 請求時：

1. Claude 評估程式碼執行是否有助於回答您的問題
2. 該工具自動為 Claude 提供以下功能：
   - **Bash 命令**：執行 shell 命令以進行系統操作和套件管理
   - **檔案操作**：直接建立、檢視和編輯檔案，包括編寫程式碼
3. Claude 可以在單一請求中使用這些功能的任何組合
4. 所有操作都在安全的沙箱環境中執行
5. Claude 提供結果，包括任何生成的圖表、計算或分析

## 如何使用工具

### 執行 Bash 命令

要求 Claude 檢查系統資訊並安裝套件：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Check the Python version and list installed packages"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Check the Python version and list installed packages"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Check the Python version and list installed packages"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### 直接建立和編輯檔案

Claude 可以使用檔案操作功能直接在沙箱中建立、檢視和編輯檔案：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### 上傳和分析您自己的檔案

若要分析您自己的資料檔案（CSV、Excel、影像等），請透過檔案 API 上傳它們，並在您的請求中參考它們：

<Note>
使用檔案 API 與程式碼執行需要兩個測試版標頭：`"anthropic-beta": "code-execution-2025-08-25,files-api-2025-04-14"`
</Note>

Python 環境可以處理透過檔案 API 上傳的各種檔案類型，包括：

- CSV
- Excel (.xlsx, .xls)
- JSON
- XML
- 影像 (JPEG, PNG, GIF, WebP)
- 文字檔案 (.txt, .md, .py 等)

#### 上傳和分析檔案

1. **使用[檔案 API](/docs/zh-TW/build-with-claude/files) 上傳您的檔案**
2. **在您的訊息中使用 `container_upload` 內容區塊參考該檔案**
3. **在您的 API 請求中包含程式碼執行工具**

<CodeGroup>
```bash Shell
# 首先，上傳一個檔案
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \

# 然後使用檔案 ID 與程式碼執行
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this CSV data"},
                {"type": "container_upload", "file_id": "file_abc123"}
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# 上傳一個檔案
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# 使用檔案 ID 與程式碼執行
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { createReadStream } from 'fs';

const anthropic = new Anthropic();

async function main() {
  // 上傳一個檔案
  const fileObject = await anthropic.beta.files.create({
    file: createReadStream("data.csv"),
  });

  // 使用檔案 ID 與程式碼執行
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Analyze this CSV data" },
        { type: "container_upload", file_id: fileObject.id }
      ]
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

#### 擷取生成的檔案

當 Claude 在程式碼執行期間建立檔案時，您可以使用檔案 API 擷取這些檔案：

<CodeGroup>
```python Python
from anthropic import Anthropic

# 初始化用戶端
client = Anthropic()

# 要求建立檔案的程式碼執行
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a matplotlib visualization and save it as output.png"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# 從回應中提取檔案 ID
def extract_file_ids(response):
    file_ids = []
    for item in response.content:
        if item.type == 'bash_code_execution_tool_result':
            content_item = item.content
            if content_item.type == 'bash_code_execution_result':
                for file in content_item.content:
                    if hasattr(file, 'file_id'):
                        file_ids.append(file.file_id)
    return file_ids

# 下載建立的檔案
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(file_id)
    file_content = client.beta.files.download(file_id)
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

// 初始化用戶端
const anthropic = new Anthropic();

async function main() {
  // 要求建立檔案的程式碼執行
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Create a matplotlib visualization and save it as output.png"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // 從回應中提取檔案 ID
  function extractFileIds(response: any): string[] {
    const fileIds: string[] = [];
    for (const item of response.content) {
      if (item.type === 'bash_code_execution_tool_result') {
        const contentItem = item.content;
        if (contentItem.type === 'bash_code_execution_result' && contentItem.content) {
          for (const file of contentItem.content) {
            fileIds.push(file.file_id);
          }
        }
      }
    }
    return fileIds;
  }

  // 下載建立的檔案
  const fileIds = extractFileIds(response);
  for (const fileId of fileIds) {
    const fileMetadata = await anthropic.beta.files.retrieveMetadata(fileId);
    const fileContent = await anthropic.beta.files.download(fileId);

    // 將 ReadableStream 轉換為 Buffer 並儲存
    const chunks: Uint8Array[] = [];
    for await (const chunk of fileContent) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    writeFileSync(fileMetadata.filename, buffer);
    console.log(`Downloaded: ${fileMetadata.filename}`);
  }
}

main().catch(console.error);
```
</CodeGroup>

### 結合操作

使用所有功能的複雜工作流程：

<CodeGroup>
```bash Shell
# 首先，上傳一個檔案
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \
    > file_response.json

# 提取 file_id（使用 jq）
FILE_ID=$(jq -r '.id' file_response.json)

# 然後使用它與程式碼執行
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {
                    "type": "text", 
                    "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"
                },
                {
                    "type": "container_upload", 
                    "file_id": "'$FILE_ID'"
                }
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
# 上傳一個檔案
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# 使用它與程式碼執行
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Claude 可能會：
# 1. 使用 bash 檢查檔案大小和預覽資料
# 2. 使用 text_editor 編寫 Python 程式碼來分析 CSV 並建立視覺化
# 3. 使用 bash 執行 Python 程式碼
# 4. 使用 text_editor 建立包含發現的 README.md
# 5. 使用 bash 將檔案組織到報告目錄中
```

```typescript TypeScript
// 上傳一個檔案
const fileObject = await anthropic.beta.files.create({
  file: createReadStream("data.csv"),
});

// 使用它與程式碼執行
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: [
      {type: "text", text: "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
      {type: "container_upload", file_id: fileObject.id}
    ]
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});

// Claude 可能會：
// 1. 使用 bash 檢查檔案大小和預覽資料
// 2. 使用 text_editor 編寫 Python 程式碼來分析 CSV 並建立視覺化
// 3. 使用 bash 執行 Python 程式碼
// 4. 使用 text_editor 建立包含發現的 README.md
// 5. 使用 bash 將檔案組織到報告目錄中
```
</CodeGroup>

## 工具定義

程式碼執行工具不需要額外參數：

```json JSON
{
  "type": "code_execution_20250825",
  "name": "code_execution"
}
```

提供此工具時，Claude 會自動獲得對兩個子工具的存取權：
- `bash_code_execution`：執行 shell 命令
- `text_editor_code_execution`：檢視、建立和編輯檔案，包括編寫程式碼

## 回應格式

程式碼執行工具可以根據操作傳回兩種類型的結果：

### Bash 命令回應

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "name": "bash_code_execution",
  "input": {
    "command": "ls -la | head -5"
  }
},
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "content": {
    "type": "bash_code_execution_result",
    "stdout": "total 24\ndrwxr-xr-x 2 user user 4096 Jan 1 12:00 .\ndrwxr-xr-x 3 user user 4096 Jan 1 11:00 ..\n-rw-r--r-- 1 user user  220 Jan 1 12:00 data.csv\n-rw-r--r-- 1 user user  180 Jan 1 12:00 config.json",
    "stderr": "",
    "return_code": 0
  }
}
```

### 檔案操作回應

**檢視檔案：**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "text_editor_code_execution",
  "input": {
    "command": "view",
    "path": "config.json"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": {
    "type": "text_editor_code_execution_result",
    "file_type": "text",
    "content": "{\n  \"setting\": \"value\",\n  \"debug\": true\n}",
    "numLines": 4,
    "startLine": 1,
    "totalLines": 4
  }
}
```

**建立檔案：**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "text_editor_code_execution",
  "input": {
    "command": "create",
    "path": "new_file.txt",
    "file_text": "Hello, World!"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": {
    "type": "text_editor_code_execution_result",
    "is_file_update": false
  }
}
```

**編輯檔案 (str_replace)：**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "name": "text_editor_code_execution",
  "input": {
    "command": "str_replace",
    "path": "config.json",
    "old_str": "\"debug\": true",
    "new_str": "\"debug\": false"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "content": {
    "type": "text_editor_code_execution_result",
    "oldStart": 3,
    "oldLines": 1,
    "newStart": 3,
    "newLines": 1,
    "lines": ["-  \"debug\": true", "+  \"debug\": false"]
  }
}
```

### 結果

所有執行結果都包括：
- `stdout`：成功執行的輸出
- `stderr`：執行失敗時的錯誤訊息
- `return_code`：成功時為 0，失敗時為非零值

檔案操作的其他欄位：
- **檢視**：`file_type`、`content`、`numLines`、`startLine`、`totalLines`
- **建立**：`is_file_update`（檔案是否已存在）
- **編輯**：`oldStart`、`oldLines`、`newStart`、`newLines`、`lines`（差異格式）

### 錯誤

每種工具類型都可以傳回特定的錯誤：

**常見錯誤（所有工具）：**
```json
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01VfmxgZ46TiHbmXgy928hQR",
  "content": {
    "type": "bash_code_execution_tool_result_error",
    "error_code": "unavailable"
  }
}
```

**按工具類型的錯誤代碼：**

| 工具 | 錯誤代碼 | 說明 |
|------|-----------|-------------|
| 所有工具 | `unavailable` | 工具暫時不可用 |
| 所有工具 | `execution_time_exceeded` | 執行超過最大時間限制 |
| 所有工具 | `container_expired` | 容器已過期且不再可用 |
| 所有工具 | `invalid_tool_input` | 提供給工具的參數無效 |
| 所有工具 | `too_many_requests` | 超過工具使用的速率限制 |
| text_editor | `file_not_found` | 檔案不存在（用於檢視/編輯操作） |
| text_editor | `string_not_found` | 在檔案中找不到 `old_str`（用於 str_replace） |

#### `pause_turn` 停止原因

回應可能包括 `pause_turn` 停止原因，這表示 API 暫停了長時間執行的回合。您可以在後續請求中按原樣提供回應以讓 Claude 繼續其回合，或修改內容以中斷對話。

## 容器

程式碼執行工具在專為程式碼執行設計的安全容器化環境中執行，特別強調 Python。

### 執行時環境
- **Python 版本**：3.11.12
- **作業系統**：基於 Linux 的容器
- **架構**：x86_64 (AMD64)

### 資源限制
- **記憶體**：5GiB RAM
- **磁碟空間**：5GiB 工作區儲存
- **CPU**：1 個 CPU

### 網路和安全
- **網際網路存取**：出於安全考慮完全禁用
- **外部連線**：不允許出站網路請求
- **沙箱隔離**：與主機系統和其他容器完全隔離
- **檔案存取**：僅限於工作區目錄
- **工作區範圍**：與[檔案](/docs/zh-TW/build-with-claude/files)一樣，容器的範圍限於 API 金鑰的工作區
- **過期**：容器在建立後 30 天過期

### 預先安裝的程式庫
沙箱化 Python 環境包括這些常用程式庫：
- **資料科學**：pandas、numpy、scipy、scikit-learn、statsmodels
- **視覺化**：matplotlib、seaborn
- **檔案處理**：pyarrow、openpyxl、xlsxwriter、xlrd、pillow、python-pptx、python-docx、pypdf、pdfplumber、pypdfium2、pdf2image、pdfkit、tabula-py、reportlab[pycairo]、Img2pdf
- **數學與計算**：sympy、mpmath
- **公用程式**：tqdm、python-dateutil、pytz、joblib、unzip、unrar、7zip、bc、rg (ripgrep)、fd、sqlite

## 容器重複使用

您可以透過提供先前回應中的容器 ID 在多個 API 請求中重複使用現有容器。
這允許您在請求之間維護建立的檔案。

### 範例

<CodeGroup>
```python Python
import os
from anthropic import Anthropic

# 初始化用戶端
client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# 第一個請求：建立包含隨機數字的檔案
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# 從第一個回應中提取容器 ID
container_id = response1.container.id

# 第二個請求：重複使用容器來讀取檔案
response2 = client.beta.messages.create(
    container=container_id,  # 重複使用相同的容器
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  // 第一個請求：建立包含隨機數字的檔案
  const response1 = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // 從第一個回應中提取容器 ID
  const containerId = response1.container.id;

  // 第二個請求：重複使用容器來讀取檔案
  const response2 = await anthropic.beta.messages.create({
    container: containerId,  // 重複使用相同的容器
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response2.content);
}

main().catch(console.error);
```

```bash Shell
# 第一個請求：建立包含隨機數字的檔案
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Write a file with a random number and save it to \"/tmp/number.txt\""
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }' > response1.json

# 從回應中提取容器 ID（使用 jq）
CONTAINER_ID=$(jq -r '.container.id' response1.json)

# 第二個請求：重複使用容器來讀取檔案
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "container": "'$CONTAINER_ID'",
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Read the number from \"/tmp/number.txt\" and calculate its square"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```
</CodeGroup>

## 串流

啟用串流後，您將在程式碼執行事件發生時接收它們：

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "code_execution"}}

// 程式碼執行串流
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"code\":\"import pandas as pd\\ndf = pd.read_csv('data.csv')\\nprint(df.head())\"}"}}

// 暫停以執行程式碼

// 執行結果串流
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "code_execution_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"stdout": "   A  B  C\n0  1  2  3\n1  4  5  6", "stderr": ""}}}
```

## 批次請求

您可以在[訊息批次 API](/docs/zh-TW/build-with-claude/batch-processing) 中包含程式碼執行工具。透過訊息批次 API 的程式碼執行工具呼叫的定價與常規訊息 API 請求中的相同。

## 使用和定價

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

## 升級至最新工具版本

透過升級至 `code-execution-2025-08-25`，您可以存取檔案操作和 Bash 功能，包括多種語言的程式碼。沒有價格差異。

### 變更內容

| 元件 | 舊版 | 目前 |
|-----------|------------------|----------------------------|
| 測試版標頭 | `code-execution-2025-05-22` | `code-execution-2025-08-25` |
| 工具類型 | `code_execution_20250522` | `code_execution_20250825` |
| 功能 | 僅限 Python | Bash 命令、檔案操作 |
| 回應類型 | `code_execution_result` | `bash_code_execution_result`、`text_editor_code_execution_result` |

### 向後相容性

- 所有現有的 Python 程式碼執行繼續完全按照之前的方式工作
- 現有的僅限 Python 的工作流程無需變更

### 升級步驟

若要升級，您需要在 API 請求中進行以下變更：

1. **更新測試版標頭**：
   ```diff
   - "anthropic-beta": "code-execution-2025-05-22"
   + "anthropic-beta": "code-execution-2025-08-25"
   ```

2. **更新工具類型**：
   ```diff
   - "type": "code_execution_20250522"
   + "type": "code_execution_20250825"
   ```

3. **檢查回應處理**（如果以程式設計方式解析回應）：
   - 不再發送 Python 執行回應的先前區塊
   - 改為發送 Bash 和檔案操作的新回應類型（請參閱回應格式部分）

## 程式化工具呼叫

程式碼執行工具支援[程式化工具呼叫](/docs/zh-TW/agents-and-tools/tool-use/programmatic-tool-calling)，它允許 Claude 編寫在執行容器內以程式設計方式呼叫您的自訂工具的程式碼。這可以實現高效的多工具工作流程、在到達 Claude 的上下文之前進行資料篩選，以及複雜的條件邏輯。

<CodeGroup>
```python Python
# 為您的工具啟用程式化呼叫
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Get weather for 5 cities and find the warmest"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a city",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]  # 啟用程式化呼叫
        }
    ]
)
```
</CodeGroup>

在[程式化工具呼叫文件](/docs/zh-TW/agents-and-tools/tool-use/programmatic-tool-calling)中深入了解。

## 使用程式碼執行與代理技能

程式碼執行工具使 Claude 能夠使用[代理技能](/docs/zh-TW/agents-and-tools/agent-skills/overview)。技能是由指示、指令碼和資源組成的模組化功能，可擴展 Claude 的功能。

在[代理技能文件](/docs/zh-TW/agents-and-tools/agent-skills/overview)和[代理技能 API 指南](/docs/zh-TW/build-with-claude/skills-guide)中深入了解。