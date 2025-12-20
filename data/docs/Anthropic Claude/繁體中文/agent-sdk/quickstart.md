# 快速開始

使用 Python 或 TypeScript Agent SDK 開始建立能自主運作的 AI 代理

---

使用 Agent SDK 建立一個 AI 代理，它可以讀取你的程式碼、找出錯誤並修復它們，完全無需手動干預。

**你將進行的操作：**
1. 使用 Agent SDK 設定專案
2. 建立一個包含有缺陷程式碼的檔案
3. 執行一個代理，自動找出並修復錯誤

## 前置條件

- **Node.js 18+** 或 **Python 3.10+**
- 一個 **Anthropic 帳戶**（[在此註冊](https://console.anthropic.com/)）

## 設定

<Steps>
  <Step title="安裝 Claude Code">
    Agent SDK 使用 Claude Code 作為其執行時環境。為你的平台安裝它：

    <Tabs>
      <Tab title="macOS/Linux/WSL">
        ```bash
        curl -fsSL https://claude.ai/install.sh | bash
        ```
      </Tab>
      <Tab title="Homebrew">
        ```bash
        brew install --cask claude-code
        ```
      </Tab>
      <Tab title="npm">
        ```bash
        npm install -g @anthropic-ai/claude-code
        ```
      </Tab>
    </Tabs>

    在你的機器上安裝 Claude Code 後，在終端中執行 `claude` 並按照提示進行身份驗證。SDK 將自動使用此身份驗證。

    <Tip>
    有關 Claude Code 安裝的更多資訊，請參閱 [Claude Code 設定](https://docs.anthropic.com/zh-TW/docs/claude-code/setup)。
    </Tip>
  </Step>

  <Step title="建立專案資料夾">
    為此快速開始建立一個新目錄：

    ```bash
    mkdir my-agent && cd my-agent
    ```

    對於你自己的專案，你可以從任何資料夾執行 SDK；預設情況下，它將能夠存取該目錄及其子目錄中的檔案。
  </Step>

  <Step title="安裝 SDK">
    為你的語言安裝 Agent SDK 套件：

    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (uv)">
        [uv](https://docs.astral.sh/uv/) 是一個快速的 Python 套件管理器，可自動處理虛擬環境：
        ```bash
        uv init && uv add claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python (pip)">
        先建立虛擬環境，然後安裝：
        ```bash
        python3 -m venv .venv && source .venv/bin/activate
        pip3 install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="設定你的 API 金鑰">
    如果你已經驗證了 Claude Code（通過在終端中執行 `claude`），SDK 將自動使用該身份驗證。

    否則，你需要一個 API 金鑰，你可以從 [Anthropic 控制台](https://console.anthropic.com/) 取得。

    在你的專案目錄中建立一個 `.env` 檔案並將 API 金鑰儲存在那裡：

    ```bash
    ANTHROPIC_API_KEY=your-api-key
    ```

    <Note>
    **使用 Amazon Bedrock、Google Vertex AI 或 Microsoft Azure？** 請參閱 [Bedrock](https://code.claude.com/docs/zh-TW/amazon-bedrock)、[Vertex AI](https://code.claude.com/docs/zh-TW/google-vertex-ai) 或 [Azure AI Foundry](https://code.claude.com/docs/zh-TW/azure-ai-foundry) 的設定指南。

    除非事先獲得批准，否則我們不允許第三方開發人員為其產品（包括基於 Claude Agent SDK 建立的代理）提供 Claude.ai 登入或速率限制。請改用本文件中描述的 API 金鑰身份驗證方法。
    </Note>
  </Step>
</Steps>

## 建立有缺陷的檔案

此快速開始將引導你建立一個能夠找出並修復程式碼中錯誤的代理。首先，你需要一個包含一些有意錯誤的檔案供代理修復。在 `my-agent` 目錄中建立 `utils.py` 並貼上以下程式碼：

```python
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)

def get_user_name(user):
    return user["name"].upper()
```

此程式碼有兩個錯誤：
1. `calculate_average([])` 會因除以零而崩潰
2. `get_user_name(None)` 會因 TypeError 而崩潰

## 建立一個找出並修復錯誤的代理

如果你使用 Python SDK，請建立 `agent.py`，或如果使用 TypeScript，請建立 `agent.ts`：

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

async def main():
    # Agentic loop: streams messages as Claude works
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # Tools Claude can use
            permission_mode="acceptEdits"            # Auto-approve file edits
        )
    ):
        # Print human-readable output
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)              # Claude's reasoning
                elif hasattr(block, "name"):
                    print(f"Tool: {block.name}")   # Tool being called
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")      # Final result

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

// Agentic loop: streams messages as Claude works
for await (const message of query({
  prompt: "Review utils.py for bugs that would cause crashes. Fix any issues you find.",
  options: {
    allowedTools: ["Read", "Edit", "Glob"],  // Tools Claude can use
    permissionMode: "acceptEdits"            // Auto-approve file edits
  }
})) {
  // Print human-readable output
  if (message.type === "assistant" && message.message?.content) {
    for (const block of message.message.content) {
      if ("text" in block) {
        console.log(block.text);             // Claude's reasoning
      } else if ("name" in block) {
        console.log(`Tool: ${block.name}`);  // Tool being called
      }
    }
  } else if (message.type === "result") {
    console.log(`Done: ${message.subtype}`); // Final result
  }
}
```
</CodeGroup>

此程式碼有三個主要部分：

1. **`query`**：建立代理迴圈的主要入口點。它返回一個非同步迭代器，所以你使用 `async for` 來串流 Claude 工作時的訊息。請參閱 [Python](/docs/zh-TW/agent-sdk/python#query) 或 [TypeScript](/docs/zh-TW/agent-sdk/typescript#query) SDK 參考中的完整 API。

2. **`prompt`**：你想讓 Claude 做什麼。Claude 根據任務確定要使用哪些工具。

3. **`options`**：代理的配置。此範例使用 `allowedTools` 將 Claude 限制為 `Read`、`Edit` 和 `Glob`，並使用 `permissionMode: "acceptEdits"` 自動批准檔案變更。其他選項包括 `systemPrompt`、`mcpServers` 等。請參閱 [Python](/docs/zh-TW/agent-sdk/python#claudeagentoptions) 或 [TypeScript](/docs/zh-TW/agent-sdk/typescript#claudeagentoptions) 的所有選項。

`async for` 迴圈在 Claude 思考、呼叫工具、觀察結果並決定下一步操作時持續執行。每次迭代都會產生一條訊息：Claude 的推理、工具呼叫、工具結果或最終結果。SDK 處理編排（工具執行、上下文管理、重試），所以你只需消費串流。當 Claude 完成任務或遇到錯誤時，迴圈結束。

迴圈內的訊息處理會篩選出人類可讀的輸出。如果不進行篩選，你會看到原始訊息物件，包括系統初始化和內部狀態，這對除錯很有用，但通常會很冗長。

<Note>
此範例使用串流來即時顯示進度。如果你不需要即時輸出（例如，對於後台工作或 CI 管道），你可以一次性收集所有訊息。有關詳細資訊，請參閱 [串流與單回合模式](/docs/zh-TW/agent-sdk/streaming-vs-single-mode)。
</Note>

### 執行你的代理

你的代理已準備好。使用以下命令執行它：

<CodeGroup>
```bash Python
python3 agent.py
```

```bash TypeScript
npx tsx agent.ts
```
</CodeGroup>

執行後，檢查 `utils.py`。你會看到防禦性程式碼處理空列表和空使用者。你的代理自主地：

1. **讀取** `utils.py` 以理解程式碼
2. **分析** 邏輯並識別會導致崩潰的邊界情況
3. **編輯** 檔案以新增適當的錯誤處理

這就是 Agent SDK 與眾不同之處：Claude 直接執行工具，而不是要求你實現它們。

<Note>
如果你看到「Claude Code not found」，請 [安裝 Claude Code](#安裝-claude-code) 並重新啟動終端。對於「API key not found」，請 [設定你的 API 金鑰](#設定你的-api-金鑰)。有關更多幫助，請參閱 [完整故障排除指南](https://docs.anthropic.com/zh-TW/docs/claude-code/troubleshooting)。
</Note>

### 嘗試其他提示

現在你的代理已設定好，嘗試一些不同的提示：

- `"Add docstrings to all functions in utils.py"`
- `"Add type hints to all functions in utils.py"`
- `"Create a README.md documenting the functions in utils.py"`

### 自訂你的代理

你可以通過變更選項來修改代理的行為。以下是一些範例：

**新增網路搜尋功能：**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "WebSearch"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "WebSearch"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

**給 Claude 一個自訂系統提示：**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob"],
    permission_mode="acceptEdits",
    system_prompt="You are a senior Python developer. Always follow PEP 8 style guidelines."
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob"],
  permissionMode: "acceptEdits",
  systemPrompt: "You are a senior Python developer. Always follow PEP 8 style guidelines."
}
```
</CodeGroup>

**在終端中執行命令：**

<CodeGroup>
```python Python
options=ClaudeAgentOptions(
    allowed_tools=["Read", "Edit", "Glob", "Bash"],
    permission_mode="acceptEdits"
)
```

```typescript TypeScript
options: {
  allowedTools: ["Read", "Edit", "Glob", "Bash"],
  permissionMode: "acceptEdits"
}
```
</CodeGroup>

啟用 `Bash` 後，嘗試：`"Write unit tests for utils.py, run them, and fix any failures"`

## 關鍵概念

**工具** 控制你的代理可以做什麼：

| 工具 | 代理可以做什麼 |
|-------|----------------------|
| `Read`、`Glob`、`Grep` | 唯讀分析 |
| `Read`、`Edit`、`Glob` | 分析和修改程式碼 |
| `Read`、`Edit`、`Bash`、`Glob`、`Grep` | 完全自動化 |

**權限模式** 控制你想要多少人工監督：

| 模式 | 行為 | 使用案例 |
|------|----------|----------|
| `acceptEdits` | 自動批准檔案編輯，詢問其他操作 | 受信任的開發工作流程 |
| `bypassPermissions` | 無提示執行 | CI/CD 管道、自動化 |
| `default` | 需要 `canUseTool` 回呼來處理批准 | 自訂批准流程 |

上面的範例使用 `acceptEdits` 模式，它自動批准檔案操作，以便代理可以無需互動提示而執行。如果你想提示使用者進行批准，請使用 `default` 模式並提供一個 [`canUseTool` 回呼](/docs/zh-TW/agent-sdk/permissions#canusetool) 來收集使用者輸入。如需更多控制，請參閱 [權限](/docs/zh-TW/agent-sdk/permissions)。

## 後續步驟

現在你已建立了第一個代理，學習如何擴展其功能並根據你的使用案例進行定制：

- **[權限](/docs/zh-TW/agent-sdk/permissions)**：控制你的代理可以做什麼以及何時需要批准
- **[掛鉤](/docs/zh-TW/agent-sdk/hooks)**：在工具呼叫之前或之後執行自訂程式碼
- **[工作階段](/docs/zh-TW/agent-sdk/sessions)**：建立維持上下文的多回合代理
- **[MCP 伺服器](/docs/zh-TW/agent-sdk/mcp)**：連接到資料庫、瀏覽器、API 和其他外部系統
- **[託管](/docs/zh-TW/agent-sdk/hosting)**：將代理部署到 Docker、雲端和 CI/CD
- **[範例代理](https://github.com/anthropics/claude-agent-sdk-demos)**：查看完整範例：電子郵件助手、研究代理等