# 遷移至 Claude Agent SDK

將 Claude Code TypeScript 和 Python SDK 遷移至 Claude Agent SDK 的指南

---

## 概述

Claude Code SDK 已重新命名為 **Claude Agent SDK**，其文檔已重新組織。此變更反映了 SDK 在構建超越編碼任務的 AI 代理方面的更廣泛功能。

## 變更內容

| 方面                   | 舊版                         | 新版                              |
| :----------------------- | :-------------------------- | :------------------------------- |
| **套件名稱 (TS/JS)** | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| **Python 套件**       | `claude-code-sdk`           | `claude-agent-sdk`               |
| **文檔位置** | Claude Code 文檔 | API 指南 → Agent SDK 部分 |

<Note>
**文檔變更：** Agent SDK 文檔已從 Claude Code 文檔移至 API 指南下的專用 [Agent SDK](/docs/zh-TW/agent-sdk/overview) 部分。Claude Code 文檔現在專注於 CLI 工具和自動化功能。
</Note>

## 遷移步驟

### 針對 TypeScript/JavaScript 專案

**1. 卸載舊套件：**

```bash
npm uninstall @anthropic-ai/claude-code
```

**2. 安裝新套件：**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

**3. 更新您的匯入：**

將所有匯入從 `@anthropic-ai/claude-code` 變更為 `@anthropic-ai/claude-agent-sdk`：

```typescript
// 之前
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-code";

// 之後
import {
  query,
  tool,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";
```

**4. 更新 package.json 依賴項：**

如果您在 `package.json` 中列出了該套件，請更新它：

```json
// 之前
{
  "dependencies": {
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}

// 之後
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0"
  }
}
```

就這樣！不需要其他程式碼變更。

### 針對 Python 專案

**1. 卸載舊套件：**

```bash
pip uninstall claude-code-sdk
```

**2. 安裝新套件：**

```bash
pip install claude-agent-sdk
```

**3. 更新您的匯入：**

將所有匯入從 `claude_code_sdk` 變更為 `claude_agent_sdk`：

```python
# 之前
from claude_code_sdk import query, ClaudeCodeOptions

# 之後
from claude_agent_sdk import query, ClaudeAgentOptions
```

**4. 更新類型名稱：**

將 `ClaudeCodeOptions` 變更為 `ClaudeAgentOptions`：

```python
# 之前
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5"
)

# 之後
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5"
)
```

**5. 檢閱 [重大變更](#breaking-changes)**

進行完成遷移所需的任何程式碼變更。

## 重大變更

<Warning>
為了改進隔離和明確配置，Claude Agent SDK v0.1.0 為從 Claude Code SDK 遷移的使用者引入了重大變更。在遷移前請仔細檢閱本部分。
</Warning>

### Python：ClaudeCodeOptions 重新命名為 ClaudeAgentOptions

**變更內容：** Python SDK 類型 `ClaudeCodeOptions` 已重新命名為 `ClaudeAgentOptions`。

**遷移：**

```python
# 之前 (v0.0.x)
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)

# 之後 (v0.1.0)
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)
```

**為什麼變更：** 類型名稱現在與「Claude Agent SDK」品牌相符，並在 SDK 的命名慣例中提供一致性。

### 系統提示不再是預設值

**變更內容：** SDK 不再預設使用 Claude Code 的系統提示。

**遷移：**

<CodeGroup>

```typescript TypeScript
// 之前 (v0.0.x) - 預設使用 Claude Code 的系統提示
const result = query({ prompt: "Hello" });

// 之後 (v0.1.0) - 預設使用空系統提示
// 要獲得舊行為，明確要求 Claude Code 的預設值：
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: { type: "preset", preset: "claude_code" }
  }
});

// 或使用自訂系統提示：
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: "You are a helpful coding assistant"
  }
});
```

```python Python
# 之前 (v0.0.x) - 預設使用 Claude Code 的系統提示
async for message in query(prompt="Hello"):
    print(message)

# 之後 (v0.1.0) - 預設使用空系統提示
# 要獲得舊行為，明確要求 Claude Code 的預設值：
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt={"type": "preset", "preset": "claude_code"}  # 使用預設值
    )
):
    print(message)

# 或使用自訂系統提示：
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt="You are a helpful coding assistant"
    )
):
    print(message)
```

</CodeGroup>

**為什麼變更：** 為 SDK 應用程式提供更好的控制和隔離。您現在可以構建具有自訂行為的代理，而無需繼承 Claude Code 的 CLI 導向指令。

### 設定來源不再預設載入

**變更內容：** SDK 不再預設從檔案系統設定（CLAUDE.md、settings.json、斜杠命令等）讀取。

**遷移：**

<CodeGroup>

```typescript TypeScript
// 之前 (v0.0.x) - 自動載入所有設定
const result = query({ prompt: "Hello" });
// 會讀取：
// - ~/.claude/settings.json (使用者)
// - .claude/settings.json (專案)
// - .claude/settings.local.json (本機)
// - CLAUDE.md 檔案
// - 自訂斜杠命令

// 之後 (v0.1.0) - 預設不載入任何設定
// 要獲得舊行為：
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["user", "project", "local"]
  }
});

// 或僅載入特定來源：
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["project"]  // 僅專案設定
  }
});
```

```python Python
# 之前 (v0.0.x) - 自動載入所有設定
async for message in query(prompt="Hello"):
    print(message)
# 會讀取：
# - ~/.claude/settings.json (使用者)
# - .claude/settings.json (專案)
# - .claude/settings.local.json (本機)
# - CLAUDE.md 檔案
# - 自訂斜杠命令

# 之後 (v0.1.0) - 預設不載入任何設定
# 要獲得舊行為：
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]
    )
):
    print(message)

# 或僅載入特定來源：
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # 僅專案設定
    )
):
    print(message)
```

</CodeGroup>

**為什麼變更：** 確保 SDK 應用程式具有獨立於本機檔案系統配置的可預測行為。這對以下情況特別重要：
- **CI/CD 環境** - 無本機自訂的一致行為
- **已部署的應用程式** - 不依賴檔案系統設定
- **測試** - 隔離的測試環境
- **多租戶系統** - 防止使用者之間的設定洩漏

<Note>
**向後相容性：** 如果您的應用程式依賴檔案系統設定（自訂斜杠命令、CLAUDE.md 指令等），請將 `settingSources: ['user', 'project', 'local']` 新增至您的選項。
</Note>

## 為什麼重新命名？

Claude Code SDK 最初是為編碼任務設計的，但它已發展成為構建所有類型 AI 代理的強大框架。新名稱「Claude Agent SDK」更好地反映了其功能：

- 構建業務代理（法律助理、財務顧問、客戶支援）
- 建立專門的編碼代理（SRE 機器人、安全審查員、程式碼審查代理）
- 為任何領域開發自訂代理，具有工具使用、MCP 整合等功能

## 獲取幫助

如果您在遷移過程中遇到任何問題：

**針對 TypeScript/JavaScript：**

1. 檢查所有匯入是否已更新為使用 `@anthropic-ai/claude-agent-sdk`
2. 驗證您的 package.json 具有新的套件名稱
3. 執行 `npm install` 以確保依賴項已更新

**針對 Python：**

1. 檢查所有匯入是否已更新為使用 `claude_agent_sdk`
2. 驗證您的 requirements.txt 或 pyproject.toml 具有新的套件名稱
3. 執行 `pip install claude-agent-sdk` 以確保套件已安裝

## 後續步驟

- 探索 [Agent SDK 概述](/docs/zh-TW/agent-sdk/overview) 以了解可用功能
- 查看 [TypeScript SDK 參考](/docs/zh-TW/agent-sdk/typescript) 以取得詳細的 API 文檔
- 檢閱 [Python SDK 參考](/docs/zh-TW/agent-sdk/python) 以取得 Python 特定文檔
- 了解 [自訂工具](/docs/zh-TW/agent-sdk/custom-tools) 和 [MCP 整合](/docs/zh-TW/agent-sdk/mcp)