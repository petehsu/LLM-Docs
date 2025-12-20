# Agent SDK 概述

使用 Claude Code 作為程式庫構建生產級 AI 代理

---

<Note>
Claude Code SDK 已重新命名為 Claude Agent SDK。如果您正在從舊 SDK 遷移，請參閱[遷移指南](/docs/zh-TW/agent-sdk/migration-guide)。
</Note>

構建能夠自主讀取檔案、執行命令、搜尋網路、編輯程式碼等的 AI 代理。Agent SDK 提供了與 Claude Code 相同的工具、代理迴圈和上下文管理，可在 Python 和 TypeScript 中進行程式設計。

<CodeGroup>
```python Python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"])
    ):
        print(message)  # Claude reads the file, finds the bug, edits it

asyncio.run(main())
```

```typescript TypeScript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.py",
  options: { allowedTools: ["Read", "Edit", "Bash"] }
})) {
  console.log(message);  // Claude reads the file, finds the bug, edits it
}
```
</CodeGroup>

Agent SDK 包含用於讀取檔案、執行命令和編輯程式碼的內建工具，因此您的代理可以立即開始工作，無需您實現工具執行。深入了解快速入門或探索使用 SDK 構建的真實代理：

<CardGroup cols={2}>
  <Card title="快速入門" icon="play" href="/docs/zh-TW/agent-sdk/quickstart">
    在幾分鐘內構建一個除錯代理
  </Card>
  <Card title="範例代理" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    電子郵件助手、研究代理等
  </Card>
</CardGroup>

## 功能

Claude Code 的所有強大功能都可在 SDK 中使用：

<Tabs>
  <Tab title="內建工具">
    您的代理可以開箱即用地讀取檔案、執行命令和搜尋程式碼庫。主要工具包括：

    | 工具 | 功能 |
    |------|------|
    | **Read** | 讀取工作目錄中的任何檔案 |
    | **Write** | 建立新檔案 |
    | **Edit** | 對現有檔案進行精確編輯 |
    | **Bash** | 執行終端命令、指令碼、git 操作 |
    | **Glob** | 按模式查找檔案（`**/*.ts`、`src/**/*.py`） |
    | **Grep** | 使用正規表達式搜尋檔案內容 |
    | **WebSearch** | 搜尋網路以獲取最新資訊 |
    | **WebFetch** | 獲取並解析網頁內容 |

    此範例建立一個搜尋程式碼庫中 TODO 註解的代理：

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Find all TODO comments and create a summary",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Find all TODO comments and create a summary",
      options: { allowedTools: ["Read", "Glob", "Grep"] }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

  </Tab>
  <Tab title="鉤子">
    在代理生命週期的關鍵點執行自訂程式碼。鉤子可以執行 shell 命令或自訂指令碼來驗證、記錄、阻止或轉換代理行為。

    **可用鉤子：** `PreToolUse`、`PostToolUse`、`Stop`、`SessionStart`、`SessionEnd`、`UserPromptSubmit` 等。

    此範例將所有檔案變更記錄到稽核檔案：

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Suggest improvements to utils.py",
            options=ClaudeAgentOptions(
                permission_mode="acceptEdits",
                hooks={
                    "PostToolUse": [{
                        "matcher": "Edit|Write",
                        "hooks": [{"type": "command", "command": "echo \"$(date): file modified\" >> ./audit.log"}]
                    }]
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Suggest improvements to utils.py",
      options: {
        permissionMode: "acceptEdits",
        hooks: {
          PostToolUse: [{
            matcher: "Edit|Write",
            hooks: [{ type: "command", command: "echo \"$(date): file modified\" >> ./audit.log" }]
          }]
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [深入了解鉤子 →](/docs/zh-TW/agent-sdk/hooks)
  </Tab>
  <Tab title="子代理">
    生成專門的代理來處理專注的子任務。您的主代理委派工作，子代理報告結果。

    啟用 `Task` 工具以讓 Claude 在決定任務足夠複雜以受益於委派時生成子代理。Claude 根據任務複雜性自動確定何時使用子代理。

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Analyze this codebase for security vulnerabilities",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob", "Grep", "Task"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Analyze this codebase for security vulnerabilities",
      options: {
        allowedTools: ["Read", "Glob", "Grep", "Task"]
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    您也可以使用 `agents` 選項定義自訂代理類型，以實現更專門的委派模式。

    [深入了解子代理 →](/docs/zh-TW/agent-sdk/subagents)
  </Tab>
  <Tab title="MCP">
    透過模型上下文協議連接到外部系統：資料庫、瀏覽器、API 和[數百個更多](https://github.com/modelcontextprotocol/servers)。

    此範例連接 [Playwright MCP 伺服器](https://github.com/microsoft/playwright-mcp)以為您的代理提供瀏覽器自動化功能：

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Open example.com and describe what you see",
            options=ClaudeAgentOptions(
                mcp_servers={
                    "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]}
                }
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Open example.com and describe what you see",
      options: {
        mcpServers: {
          playwright: { command: "npx", args: ["@playwright/mcp@latest"] }
        }
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [深入了解 MCP →](/docs/zh-TW/agent-sdk/mcp)
  </Tab>
  <Tab title="權限">
    精確控制您的代理可以使用哪些工具。允許安全操作、阻止危險操作或要求對敏感操作進行批准。

    此範例建立一個只讀代理，可以分析但不能修改程式碼：

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="Review this code for best practices",
            options=ClaudeAgentOptions(
                allowed_tools=["Read", "Glob", "Grep"],
                permission_mode="bypassPermissions"
            )
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "Review this code for best practices",
      options: {
        allowedTools: ["Read", "Glob", "Grep"],
        permissionMode: "bypassPermissions"
      }
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>

    [深入了解權限 →](/docs/zh-TW/agent-sdk/permissions)
  </Tab>
  <Tab title="工作階段">
    在多次交換中保持上下文。Claude 記住讀取的檔案、完成的分析和對話歷史。稍後恢復工作階段，或分叉它們以探索不同的方法。

    此範例從第一個查詢中捕獲工作階段 ID，然後恢復以繼續進行完整上下文：

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        session_id = None

        # First query: capture the session ID
        async for message in query(
            prompt="Read the authentication module",
            options=ClaudeAgentOptions(allowed_tools=["Read", "Glob"])
        ):
            if hasattr(message, 'subtype') and message.subtype == 'init':
                session_id = message.data.get('session_id')

        # Resume with full context from the first query
        async for message in query(
            prompt="Now find all places that call it",  # "it" = auth module
            options=ClaudeAgentOptions(resume=session_id)
        ):
            pass

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    let sessionId: string | undefined;

    // First query: capture the session ID
    for await (const message of query({
      prompt: "Read the authentication module",
      options: { allowedTools: ["Read", "Glob"] }
    })) {
      if (message.type === "system" && message.subtype === "init") {
        sessionId = message.session_id;
      }
    }

    // Resume with full context from the first query
    for await (const message of query({
      prompt: "Now find all places that call it",  // "it" = auth module
      options: { resume: sessionId }
    })) {
      // Process messages...
    }
    ```
    </CodeGroup>

    [深入了解工作階段 →](/docs/zh-TW/agent-sdk/sessions)
  </Tab>
</Tabs>

### Claude Code 功能

SDK 也支援 Claude Code 的基於檔案系統的配置。要使用這些功能，請在您的選項中設定 `setting_sources=["project"]`（Python）或 `settingSources: ['project']`（TypeScript）。

| 功能 | 描述 | 位置 |
|------|------|------|
| [技能](/docs/zh-TW/agent-sdk/skills) | 在 Markdown 中定義的專門功能 | `.claude/skills/SKILL.md` |
| [斜線命令](/docs/zh-TW/agent-sdk/slash-commands) | 常見任務的自訂命令 | `.claude/commands/*.md` |
| [記憶](/docs/zh-TW/agent-sdk/modifying-system-prompts) | 專案上下文和說明 | `CLAUDE.md` 或 `.claude/CLAUDE.md` |
| [外掛](/docs/zh-TW/agent-sdk/plugins) | 使用自訂命令、代理和 MCP 伺服器進行擴展 | 透過 `plugins` 選項進行程式設計 |

## 開始使用

<Steps>
  <Step title="安裝 Claude Code">
    SDK 使用 Claude Code 作為其執行時：

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

    有關 Windows 和其他選項，請參閱 [Claude Code 設定](https://docs.anthropic.com/en/docs/claude-code/setup)。
  </Step>
  <Step title="安裝 SDK">
    <Tabs>
      <Tab title="TypeScript">
        ```bash
        npm install @anthropic-ai/claude-agent-sdk
        ```
      </Tab>
      <Tab title="Python">
        ```bash
        pip install claude-agent-sdk
        ```
      </Tab>
    </Tabs>
  </Step>
  <Step title="設定您的 API 金鑰">
    ```bash
    export ANTHROPIC_API_KEY=your-api-key
    ```
    從[主控台](https://console.anthropic.com/)取得您的金鑰。

    SDK 也支援透過第三方 API 提供者進行身份驗證：

    - **Amazon Bedrock**：設定 `CLAUDE_CODE_USE_BEDROCK=1` 環境變數並配置 AWS 認證
    - **Google Vertex AI**：設定 `CLAUDE_CODE_USE_VERTEX=1` 環境變數並配置 Google Cloud 認證
    - **Microsoft Foundry**：設定 `CLAUDE_CODE_USE_FOUNDRY=1` 環境變數並配置 Azure 認證

    <Note>
    除非事先獲得批准，否則我們不允許第三方開發人員為其產品（包括基於 Claude Agent SDK 構建的代理）提供 Claude.ai 登入或速率限制。請改用本文件中描述的 API 金鑰身份驗證方法。
    </Note>
  </Step>
  <Step title="執行您的第一個代理">
    此範例建立一個使用內建工具列出目前目錄中檔案的代理。

    <CodeGroup>
    ```python Python
    import asyncio
    from claude_agent_sdk import query, ClaudeAgentOptions

    async def main():
        async for message in query(
            prompt="What files are in this directory?",
            options=ClaudeAgentOptions(allowed_tools=["Bash", "Glob"])
        ):
            print(message)

    asyncio.run(main())
    ```

    ```typescript TypeScript
    import { query } from "@anthropic-ai/claude-agent-sdk";

    for await (const message of query({
      prompt: "What files are in this directory?",
      options: { allowedTools: ["Bash", "Glob"] },
    })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Step>
</Steps>

**準備好構建了嗎？** 按照[快速入門](/docs/zh-TW/agent-sdk/quickstart)在幾分鐘內建立一個尋找並修復錯誤的代理。

## 將 Agent SDK 與其他 Claude 工具進行比較

Claude 平台提供了多種方式來使用 Claude 進行構建。以下是 Agent SDK 的適用情況：

<Tabs>
  <Tab title="Agent SDK 與 Client SDK">
    [Anthropic Client SDK](/docs/zh-TW/api/client-sdks) 為您提供直接 API 存取：您發送提示並自己實現工具執行。**Agent SDK** 為您提供具有內建工具執行的 Claude。

    使用 Client SDK，您實現工具迴圈。使用 Agent SDK，Claude 處理它：

    <CodeGroup>
    ```python Python
    # Client SDK: You implement the tool loop
    response = client.messages.create(...)
    while response.stop_reason == "tool_use":
        result = your_tool_executor(response.tool_use)
        response = client.messages.create(tool_result=result, ...)

    # Agent SDK: Claude handles tools autonomously
    async for message in query(prompt="Fix the bug in auth.py"):
        print(message)
    ```

    ```typescript TypeScript
    // Client SDK: You implement the tool loop
    let response = await client.messages.create({...});
    while (response.stop_reason === "tool_use") {
      const result = yourToolExecutor(response.tool_use);
      response = await client.messages.create({ tool_result: result, ... });
    }

    // Agent SDK: Claude handles tools autonomously
    for await (const message of query({ prompt: "Fix the bug in auth.py" })) {
      console.log(message);
    }
    ```
    </CodeGroup>
  </Tab>
  <Tab title="Agent SDK 與 Claude Code CLI">
    相同的功能，不同的介面：

    | 使用案例 | 最佳選擇 |
    |---------|---------|
    | 互動式開發 | CLI |
    | CI/CD 管道 | SDK |
    | 自訂應用程式 | SDK |
    | 一次性任務 | CLI |
    | 生產自動化 | SDK |

    許多團隊同時使用兩者：CLI 用於日常開發，SDK 用於生產。工作流程可以直接在它們之間轉換。
  </Tab>
</Tabs>

## 變更日誌

查看完整的變更日誌以了解 SDK 更新、錯誤修復和新功能：

- **TypeScript SDK**：[查看 CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-typescript/blob/main/CHANGELOG.md)
- **Python SDK**：[查看 CHANGELOG.md](https://github.com/anthropics/claude-agent-sdk-python/blob/main/CHANGELOG.md)

## 報告錯誤

如果您在 Agent SDK 中遇到錯誤或問題：

- **TypeScript SDK**：[在 GitHub 上報告問題](https://github.com/anthropics/claude-agent-sdk-typescript/issues)
- **Python SDK**：[在 GitHub 上報告問題](https://github.com/anthropics/claude-agent-sdk-python/issues)

## 品牌指南

對於整合 Claude Agent SDK 的合作夥伴，Claude 品牌的使用是可選的。在您的產品中引用 Claude 時：

**允許：**
- "Claude Agent"（下拉選單的首選）
- "Claude"（當已在標記為"Agents"的選單中時）
- "{YourAgentName} Powered by Claude"（如果您有現有的代理名稱）

**不允許：**
- "Claude Code" 或 "Claude Code Agent"
- Claude Code 品牌的 ASCII 藝術或模仿 Claude Code 的視覺元素

您的產品應保持自己的品牌，不應顯示為 Claude Code 或任何 Anthropic 產品。如有關於品牌合規性的問題，請聯絡我們的[銷售團隊](https://www.anthropic.com/contact-sales)。

## 許可證和條款

Claude Agent SDK 的使用受 [Anthropic 商業服務條款](https://www.anthropic.com/legal/commercial-terms)管制，包括當您使用它為您自己的客戶和最終使用者提供的產品和服務提供動力時，除非特定元件或依賴項受到該元件 LICENSE 檔案中指示的不同許可證的約束。

## 後續步驟

<CardGroup cols={2}>
  <Card title="快速入門" icon="play" href="/docs/zh-TW/agent-sdk/quickstart">
    構建一個在幾分鐘內尋找並修復錯誤的代理
  </Card>
  <Card title="範例代理" icon="star" href="https://github.com/anthropics/claude-agent-sdk-demos">
    電子郵件助手、研究代理等
  </Card>
  <Card title="TypeScript SDK" icon="code" href="/docs/zh-TW/agent-sdk/typescript">
    完整的 TypeScript API 參考和範例
  </Card>
  <Card title="Python SDK" icon="code" href="/docs/zh-TW/agent-sdk/python">
    完整的 Python API 參考和範例
  </Card>
</CardGroup>