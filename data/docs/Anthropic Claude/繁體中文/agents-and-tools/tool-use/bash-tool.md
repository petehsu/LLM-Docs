# Bash 工具

Bash 工具使 Claude 能夠在持久的 bash 會話中執行 shell 命令，允許系統操作、腳本執行和命令行自動化。

---

Bash 工具使 Claude 能夠在持久的 bash 會話中執行 shell 命令，允許系統操作、腳本執行和命令行自動化。

## 概述

Bash 工具為 Claude 提供：
- 維持狀態的持久 bash 會話
- 運行任何 shell 命令的能力
- 訪問環境變數和工作目錄
- 命令鏈接和腳本編寫功能

## 模型兼容性

| 模型 | 工具版本 |
|-------|--------------|
| Claude 4 模型和 Sonnet 3.7 ([已棄用](/docs/zh-TW/about-claude/model-deprecations)) | `bash_20250124` |

<Warning>
舊工具版本不保證與較新模型向後兼容。始終使用與您的模型版本相對應的工具版本。
</Warning>

## 使用案例

- **開發工作流程**：運行構建命令、測試和開發工具
- **系統自動化**：執行腳本、管理文件、自動化任務
- **數據處理**：處理文件、運行分析腳本、管理數據集
- **環境設置**：安裝軟件包、配置環境

## 快速開始

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "bash_20250124",
            "name": "bash"
        }
    ],
    messages=[
        {"role": "user", "content": "List all Python files in the current directory."}
    ]
)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "List all Python files in the current directory."
      }
    ]
  }'
```
</CodeGroup>

## 工作原理

Bash 工具維持一個持久會話：

1. Claude 確定要運行的命令
2. 您在 bash shell 中執行命令
3. 將輸出（stdout 和 stderr）返回給 Claude
4. 會話狀態在命令之間保持（環境變數、工作目錄）

## 參數

| 參數 | 必需 | 描述 |
|-----------|----------|-------------|
| `command` | 是* | 要運行的 bash 命令 |
| `restart` | 否 | 設置為 `true` 以重新啟動 bash 會話 |

*除非使用 `restart`，否則為必需

<section title="使用示例">

```json
// 運行命令
{
  "command": "ls -la *.py"
}

// 重新啟動會話
{
  "restart": true
}
```

</section>

## 示例：多步驟自動化

Claude 可以鏈接命令以完成複雜任務：

```python
# 用戶請求
"Install the requests library and create a simple Python script that fetches a joke from an API, then run it."

# Claude 的工具使用：
# 1. 安裝軟件包
{"command": "pip install requests"}

# 2. 創建腳本
{"command": "cat > fetch_joke.py << 'EOF'\nimport requests\nresponse = requests.get('https://official-joke-api.appspot.com/random_joke')\njoke = response.json()\nprint(f\"Setup: {joke['setup']}\")\nprint(f\"Punchline: {joke['punchline']}\")\nEOF"}

# 3. 運行腳本
{"command": "python fetch_joke.py"}
```

會話在命令之間維持狀態，因此在步驟 2 中創建的文件在步驟 3 中可用。

***

## 實現 bash 工具

Bash 工具實現為無模式工具。使用此工具時，您不需要像其他工具那樣提供輸入模式；模式內置於 Claude 的模型中，無法修改。

<Steps>
  <Step title="設置 bash 環境">
    創建一個 Claude 可以交互的持久 bash 會話：
    ```python
    import subprocess
    import threading
    import queue
    
    class BashSession:
        def __init__(self):
            self.process = subprocess.Popen(
                ['/bin/bash'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0
            )
            self.output_queue = queue.Queue()
            self.error_queue = queue.Queue()
            self._start_readers()
    ```
  </Step>
  <Step title="處理命令執行">
    創建一個函數來執行命令並捕獲輸出：
    ```python
    def execute_command(self, command):
        # 將命令發送到 bash
        self.process.stdin.write(command + '\n')
        self.process.stdin.flush()
        
        # 使用超時捕獲輸出
        output = self._read_output(timeout=10)
        return output
    ```
  </Step>
  <Step title="處理 Claude 的工具調用">
    從 Claude 的響應中提取並執行命令：
    ```python
    for content in response.content:
        if content.type == "tool_use" and content.name == "bash":
            if content.input.get("restart"):
                bash_session.restart()
                result = "Bash session restarted"
            else:
                command = content.input.get("command")
                result = bash_session.execute_command(command)
            
            # 將結果返回給 Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="實現安全措施">
    添加驗證和限制：
    ```python
    def validate_command(command):
        # 阻止危險命令
        dangerous_patterns = ['rm -rf /', 'format', ':(){:|:&};:']
        for pattern in dangerous_patterns:
            if pattern in command:
                return False, f"Command contains dangerous pattern: {pattern}"
        
        # 根據需要添加更多驗證
        return True, None
    ```
  </Step>
</Steps>

### 處理錯誤

實現 bash 工具時，處理各種錯誤場景：

<section title="命令執行超時">

如果命令執行時間過長：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Command timed out after 30 seconds",
      "is_error": true
    }
  ]
}
```

</section>

<section title="命令未找到">

如果命令不存在：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: nonexistentcommand: command not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="權限被拒絕">

如果存在權限問題：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: /root/sensitive-file: Permission denied",
      "is_error": true
    }
  ]
}
```

</section>

### 遵循實現最佳實踐

<section title="使用命令超時">

實現超時以防止命令掛起：
```python
def execute_with_timeout(command, timeout=30):
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return f"Command timed out after {timeout} seconds"
```

</section>

<section title="維持會話狀態">

保持 bash 會話持久以維持環境變數和工作目錄：
```python
# 在同一會話中運行的命令維持狀態
commands = [
    "cd /tmp",
    "echo 'Hello' > test.txt",
    "cat test.txt"  # 這有效，因為我們仍在 /tmp 中
]
```

</section>

<section title="處理大型輸出">

截斷非常大的輸出以防止令牌限制問題：
```python
def truncate_output(output, max_lines=100):
    lines = output.split('\n')
    if len(lines) > max_lines:
        truncated = '\n'.join(lines[:max_lines])
        return f"{truncated}\n\n... Output truncated ({len(lines)} total lines) ..."
    return output
```

</section>

<section title="記錄所有命令">

保持執行命令的審計跟蹤：
```python
import logging

def log_command(command, output, user_id):
    logging.info(f"User {user_id} executed: {command}")
    logging.info(f"Output: {output[:200]}...")  # 記錄前 200 個字符
```

</section>

<section title="清理輸出">

從命令輸出中刪除敏感信息：
```python
def sanitize_output(output):
    # 刪除潛在的秘密或憑據
    import re
    # 示例：刪除 AWS 憑據
    output = re.sub(r'aws_access_key_id\s*=\s*\S+', 'aws_access_key_id=***', output)
    output = re.sub(r'aws_secret_access_key\s*=\s*\S+', 'aws_secret_access_key=***', output)
    return output
```

</section>

## 安全性

<Warning>
Bash 工具提供直接系統訪問。實現這些必要的安全措施：
- 在隔離環境中運行（Docker/VM）
- 實現命令過濾和允許列表
- 設置資源限制（CPU、內存、磁盤）
- 記錄所有執行的命令
</Warning>

### 關鍵建議
- 使用 `ulimit` 設置資源約束
- 過濾危險命令（`sudo`、`rm -rf` 等）
- 以最小用戶權限運行
- 監控和記錄所有命令執行

## 定價

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

有關完整定價詳情，請參閱[工具使用定價](/docs/zh-TW/agents-and-tools/tool-use/overview#pricing)。

## 常見模式

### 開發工作流程
- 運行測試：`pytest && coverage report`
- 構建項目：`npm install && npm run build`
- Git 操作：`git status && git add . && git commit -m "message"`

### 文件操作
- 處理數據：`wc -l *.csv && ls -lh *.csv`
- 搜索文件：`find . -name "*.py" | xargs grep "pattern"`
- 創建備份：`tar -czf backup.tar.gz ./data`

### 系統任務
- 檢查資源：`df -h && free -m`
- 進程管理：`ps aux | grep python`
- 環境設置：`export PATH=$PATH:/new/path && echo $PATH`

## 限制

- **無交互式命令**：無法處理 `vim`、`less` 或密碼提示
- **無 GUI 應用程序**：僅命令行
- **會話範圍**：在對話中持久化，在 API 調用之間丟失
- **輸出限制**：大型輸出可能被截斷
- **無流式傳輸**：完成後返回結果

## 與其他工具結合

Bash 工具與[文本編輯器](/docs/zh-TW/agents-and-tools/tool-use/text-editor-tool)和其他工具結合時最強大。

## 後續步驟

<CardGroup cols={2}>
  <Card
    title="工具使用概述"
    icon="tool"
    href="/docs/zh-TW/agents-and-tools/tool-use/overview"
  >
    了解 Claude 的工具使用
  </Card>

  <Card
    title="文本編輯器工具"
    icon="file"
    href="/docs/zh-TW/agents-and-tools/tool-use/text-editor-tool"
  >
    使用 Claude 查看和編輯文本文件
  </Card>
</CardGroup>