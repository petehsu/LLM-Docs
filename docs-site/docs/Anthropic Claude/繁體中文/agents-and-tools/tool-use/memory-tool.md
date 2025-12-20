# 記憶工具

記憶工具使 Claude 能夠通過記憶文件目錄在對話之間存儲和檢索信息。

---

記憶工具使 Claude 能夠通過記憶文件目錄在對話之間存儲和檢索信息。Claude 可以創建、讀取、更新和刪除在會話之間持久保存的文件，允許它隨著時間推移建立知識，而無需將所有內容保留在上下文窗口中。

記憶工具在客戶端運行——您可以通過自己的基礎設施控制數據的存儲位置和方式。

<Note>
記憶工具目前處於測試版。要啟用它，請在您的 API 請求中使用測試版標頭 `context-management-2025-06-27`。

請通過我們的[反饋表單](https://forms.gle/YXC2EKGMhjN1c4L88)分享您對此功能的反饋。
</Note>

## 用例

- 在多個代理執行之間維護項目上下文
- 從過去的交互、決策和反饋中學習
- 隨著時間推移構建知識庫
- 啟用跨對話學習，其中 Claude 在重複工作流中改進

## 工作原理

啟用後，Claude 在開始任務前會自動檢查其記憶目錄。Claude 可以在 `/memories` 目錄中創建、讀取、更新和刪除文件，以存儲在工作時學到的內容，然後在未來的對話中引用這些記憶，以更有效地處理類似任務或從中斷的地方繼續。

由於這是一個客戶端工具，Claude 進行工具調用來執行記憶操作，您的應用程序在本地執行這些操作。這使您能夠完全控制記憶的存儲位置和方式。出於安全考慮，您應該將所有記憶操作限制在 `/memories` 目錄中。

### 示例：記憶工具調用如何工作

當您要求 Claude 幫助完成任務時，Claude 會自動首先檢查其記憶目錄。以下是典型交互的樣子：

**1. 用戶請求：**
```
"幫我回應這個客戶服務工單。"
```

**2. Claude 檢查記憶目錄：**
```
"我會幫您回應客戶服務工單。讓我檢查我的記憶中是否有任何先前的上下文。"
```

Claude 調用記憶工具：
```json
{
  "type": "tool_use",
  "id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories"
  }
}
```

**3. 您的應用程序返回目錄內容：**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Here're the files and directories up to 2 levels deep in /memories, excluding hidden items and node_modules:\n4.0K\t/memories\n1.5K\t/memories/customer_service_guidelines.xml\n2.0K\t/memories/refund_policies.xml"
}
```

**4. Claude 讀取相關文件：**
```json
{
  "type": "tool_use",
  "id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories/customer_service_guidelines.xml"
  }
}
```

**5. 您的應用程序返回文件內容：**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": "Here's the content of /memories/customer_service_guidelines.xml with line numbers:\n     1\t<guidelines>\n     2\t<addressing_customers>\n     3\t- Always address customers by their first name\n     4\t- Use empathetic language\n..."
}
```

**6. Claude 使用記憶來幫助：**
```
"根據您的客戶服務指南，我可以幫您起草回應。請分享工單詳情..."
```

## 支持的模型

記憶工具可用於：

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## 入門

要使用記憶工具：

1. 在您的 API 請求中包含測試版標頭 `context-management-2025-06-27`
2. 將記憶工具添加到您的請求中
3. 為記憶操作實現客戶端處理程序

<Note>
要在您的應用程序中處理記憶工具操作，您需要為每個記憶命令實現處理程序。我們的 SDK 提供記憶工具幫助程序，可以處理工具界面——您可以子類化 `BetaAbstractMemoryTool`（Python）或使用 `betaMemoryTool`（TypeScript）來實現您自己的記憶後端（基於文件、數據庫、雲存儲、加密文件等）。

有關工作示例，請參閱：
- Python：[examples/memory/basic.py](https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/memory/basic.py)
- TypeScript：[examples/tools-helpers-memory.ts](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/examples/tools-helpers-memory.ts)
</Note>

## 基本用法

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "I'\''m working on a Python web scraper that keeps crashing with a timeout error. Here'\''s the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
            }
        ],
        "tools": [{
            "type": "memory_20250818",
            "name": "memory"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
        }
    ],
    tools=[{
        "type": "memory_20250818",
        "name": "memory"
    }],
    betas=["context-management-2025-06-27"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  messages: [
    {
      role: "user",
      content: "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
    }
  ],
  tools: [{
    type: "memory_20250818",
    name: "memory"
  }],
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## 工具命令

您的客戶端實現需要處理這些記憶工具命令。雖然這些規範描述了 Claude 最熟悉的推薦行為，但您可以根據您的用例修改您的實現並根據需要返回字符串。

### view
顯示目錄內容或文件內容，帶有可選的行範圍：

```json
{
  "command": "view",
  "path": "/memories",
  "view_range": [1, 10]  // 可選：查看特定行
}
```

#### 返回值

**對於目錄：** 返回一個列表，顯示文件和目錄及其大小：
```
Here're the files and directories up to 2 levels deep in {path}, excluding hidden items and node_modules:
{size}    {path}
{size}    {path}/{filename1}
{size}    {path}/{filename2}
```

- 列出最多 2 級深度的文件
- 顯示人類可讀的大小（例如 `5.5K`、`1.2M`）
- 排除隱藏項目（以 `.` 開頭的文件）和 `node_modules`
- 在大小和路徑之間使用製表符

**對於文件：** 返回帶有標頭和行號的文件內容：
```
Here's the content of {path} with line numbers:
{line_numbers}{tab}{content}
```

行號格式：
- **寬度**：6 個字符，右對齐，用空格填充
- **分隔符**：行號和內容之間的製表符
- **索引**：1 索引（第一行是第 1 行）
- **行限制**：超過 999,999 行的文件應返回錯誤：`"File {path} exceeds maximum line limit of 999,999 lines."`

**示例輸出：**
```
Here's the content of /memories/notes.txt with line numbers:
     1	Hello World
     2	This is line two
    10	Line ten
   100	Line one hundred
```

#### 錯誤處理

- **文件/目錄不存在**：`"The path {path} does not exist. Please provide a valid path."`

### create
創建新文件：

```json
{
  "command": "create",
  "path": "/memories/notes.txt",
  "file_text": "Meeting notes:\n- Discussed project timeline\n- Next steps defined\n"
}
```

#### 返回值

- **成功**：`"File created successfully at: {path}"`

#### 錯誤處理

- **文件已存在**：`"Error: File {path} already exists"`

### str_replace
替換文件中的文本：

```json
{
  "command": "str_replace",
  "path": "/memories/preferences.txt",
  "old_str": "Favorite color: blue",
  "new_str": "Favorite color: green"
}
```

#### 返回值

- **成功**：`"The memory file has been edited."` 後跟編輯文件的片段和行號

#### 錯誤處理

- **文件不存在**：`"Error: The path {path} does not exist. Please provide a valid path."`
- **未找到文本**：``"No replacement was performed, old_str `{old_str}` did not appear verbatim in {path}."``
- **重複文本**：當 `old_str` 出現多次時，返回：``"No replacement was performed. Multiple occurrences of old_str `{old_str}` in lines: {line_numbers}. Please ensure it is unique"``

#### 目錄處理

如果路徑是目錄，返回"文件不存在"錯誤。

### insert
在特定行插入文本：

```json
{
  "command": "insert",
  "path": "/memories/todo.txt",
  "insert_line": 2,
  "insert_text": "- Review memory tool documentation\n"
}
```

#### 返回值

- **成功**：`"The file {path} has been edited."`

#### 錯誤處理

- **文件不存在**：`"Error: The path {path} does not exist"`
- **無效的行號**：``"Error: Invalid `insert_line` parameter: {insert_line}. It should be within the range of lines of the file: [0, {n_lines}]"``

#### 目錄處理

如果路徑是目錄，返回"文件不存在"錯誤。

### delete
刪除文件或目錄：

```json
{
  "command": "delete",
  "path": "/memories/old_file.txt"
}
```

#### 返回值

- **成功**：`"Successfully deleted {path}"`

#### 錯誤處理

- **文件/目錄不存在**：`"Error: The path {path} does not exist"`

#### 目錄處理

遞歸刪除目錄及其所有內容。

### rename
重命名或移動文件/目錄：

```json
{
  "command": "rename",
  "old_path": "/memories/draft.txt",
  "new_path": "/memories/final.txt"
}
```

#### 返回值

- **成功**：`"Successfully renamed {old_path} to {new_path}"`

#### 錯誤處理

- **源不存在**：`"Error: The path {old_path} does not exist"`
- **目標已存在**：返回錯誤（不覆蓋）：`"Error: The destination {new_path} already exists"`

#### 目錄處理

重命名目錄。

## 提示指導

當包含記憶工具時，我們會自動將此指令包含到系統提示中：

```
IMPORTANT: ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE.
MEMORY PROTOCOL:
1. Use the `view` command of your `memory` tool to check for earlier progress.
2. ... (work on the task) ...
     - As you make progress, record status / progress / thoughts etc in your memory.
ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory.
```

如果您觀察到 Claude 創建混亂的記憶文件，您可以包含此指令：

> 注意：編輯記憶文件夾時，始終嘗試保持其內容最新、連貫和有組織。您可以重命名或刪除不再相關的文件。除非必要，否則不要創建新文件。

您也可以指導 Claude 寫入記憶的內容，例如，"只在您的記憶系統中寫下與 \<topic\> 相關的信息。"

## 安全考慮

以下是實現記憶存儲時的重要安全問題：

### 敏感信息
Claude 通常會拒絕在記憶文件中寫下敏感信息。但是，您可能希望實現更嚴格的驗證，以去除可能的敏感信息。

### 文件存儲大小
考慮跟蹤記憶文件大小並防止文件增長過大。考慮為記憶讀取命令添加最大字符數，並讓 Claude 分頁瀏覽內容。

### 記憶過期
考慮定期清除在較長時間內未被訪問的記憶文件。

### 路徑遍歷保護

<Warning>
惡意路徑輸入可能會嘗試訪問 `/memories` 目錄外的文件。您的實現**必須**驗證所有路徑以防止目錄遍歷攻擊。
</Warning>

考慮這些保障措施：

- 驗證所有路徑都以 `/memories` 開頭
- 將路徑解析為其規範形式，並驗證它們保持在記憶目錄內
- 拒絕包含 `../`、`..\\` 或其他遍歷模式的路徑
- 監視 URL 編碼的遍歷序列（`%2e%2e%2f`）
- 使用您的語言的內置路徑安全實用程序（例如 Python 的 `pathlib.Path.resolve()` 和 `relative_to()`）

## 錯誤處理

記憶工具使用與[文本編輯器工具](/docs/zh-TW/agents-and-tools/tool-use/text-editor-tool#handle-errors)類似的錯誤處理模式。有關詳細的錯誤消息和行為，請參閱上面的各個工具命令部分。常見錯誤包括文件未找到、權限錯誤、無效路徑和重複文本匹配。

## 與上下文編輯結合使用

記憶工具可以與[上下文編輯](/docs/zh-TW/build-with-claude/context-editing)結合使用，當對話上下文增長超過配置的閾值時，它會自動清除舊的工具結果。這種組合支持長時間運行的代理工作流，否則會超過上下文限制。

### 它們如何協同工作

啟用上下文編輯且您的對話接近清除閾值時，Claude 會自動收到警告通知。這會提示 Claude 在這些結果從上下文窗口中清除之前，將工具結果中的任何重要信息保存到記憶文件中。

清除工具結果後，Claude 可以在需要時從記憶文件中檢索存儲的信息，有效地將記憶視為其工作上下文的擴展。這允許 Claude：

- 繼續複雜的多步工作流，而不會丟失關鍵信息
- 即使在工具結果被移除後，也可以引用過去的工作和決策
- 在超過典型上下文限制的對話中保持連貫的上下文
- 隨著時間推移構建知識庫，同時保持活動上下文窗口可管理

### 示例工作流

考慮一個有許多文件操作的代碼重構項目：

1. Claude 對文件進行許多編輯，生成許多工具結果
2. 隨著上下文增長並接近您的閾值，Claude 收到警告
3. Claude 將迄今為止所做的更改總結到記憶文件（例如 `/memories/refactoring_progress.xml`）
4. 上下文編輯自動清除較舊的工具結果
5. Claude 繼續工作，在需要回憶已完成的更改時引用記憶文件
6. 工作流可以無限期地繼續，Claude 管理活動上下文和持久記憶

### 配置

要同時使用兩個功能：

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # 您的其他工具
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 100000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // 您的其他工具
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 100000
        },
        keep: {
          type: "tool_uses",
          value: 3
        }
      }
    ]
  }
});
```

</CodeGroup>

您也可以排除記憶工具調用被清除，以確保 Claude 始終可以訪問最近的記憶操作：

<CodeGroup>

```python Python
context_management={
    "edits": [
        {
            "type": "clear_tool_uses_20250919",
            "exclude_tools": ["memory"]
        }
    ]
}
```

```typescript TypeScript
context_management: {
  edits: [
    {
      type: "clear_tool_uses_20250919",
      exclude_tools: ["memory"]
    }
  ]
}
```

</CodeGroup>