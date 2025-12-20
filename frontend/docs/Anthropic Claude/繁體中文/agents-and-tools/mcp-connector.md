# MCP 連接器

使用 Claude 的 Model Context Protocol (MCP) 連接器功能直接從 Messages API 連接到遠端 MCP 伺服器

---

Claude 的 Model Context Protocol (MCP) 連接器功能使您能夠直接從 Messages API 連接到遠端 MCP 伺服器，無需單獨的 MCP 用戶端。

<Note>
  **目前版本**：此功能需要測試版標頭：`"anthropic-beta": "mcp-client-2025-11-20"`

  先前的版本 (`mcp-client-2025-04-04`) 已棄用。請參閱下方的[棄用版本文件](#deprecated-version-mcp-client-2025-04-04)。
</Note>

## 主要功能

- **直接 API 整合**：無需實現 MCP 用戶端即可連接到 MCP 伺服器
- **工具呼叫支援**：透過 Messages API 存取 MCP 工具
- **靈活的工具配置**：啟用所有工具、允許清單特定工具或拒絕清單不需要的工具
- **每個工具的配置**：使用自訂設定配置個別工具
- **OAuth 驗證**：支援 OAuth Bearer 令牌以進行已驗證的伺服器
- **多個伺服器**：在單一請求中連接到多個 MCP 伺服器

## 限制

- 在 [MCP 規範](https://modelcontextprotocol.io/introduction#explore-mcp) 的功能集中，目前僅支援[工具呼叫](https://modelcontextprotocol.io/docs/concepts/tools)。
- 伺服器必須透過 HTTP 公開公開（支援 Streamable HTTP 和 SSE 傳輸）。本機 STDIO 伺服器無法直接連接。
- MCP 連接器目前在 Amazon Bedrock 和 Google Vertex 上不受支援。

## 在 Messages API 中使用 MCP 連接器

MCP 連接器使用兩個元件：

1. **MCP 伺服器定義** (`mcp_servers` 陣列)：定義伺服器連接詳細資訊（URL、驗證）
2. **MCP 工具集** (`tools` 陣列)：配置要啟用的工具及其配置方式

### 基本範例

此範例使用預設配置啟用 MCP 伺服器中的所有工具：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: mcp-client-2025-11-20" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1000,
    "messages": [{"role": "user", "content": "What tools do you have available?"}],
    "mcp_servers": [
      {
        "type": "url",
        "url": "https://example-server.modelcontextprotocol.io/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
      }
    ],
    "tools": [
      {
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
      }
    ]
  }'
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "What tools do you have available?",
    },
  ],
  mcp_servers: [
    {
      type: "url",
      url: "https://example-server.modelcontextprotocol.io/sse",
      name: "example-mcp",
      authorization_token: "YOUR_TOKEN",
    },
  ],
  tools: [
    {
      type: "mcp_toolset",
      mcp_server_name: "example-mcp",
    },
  ],
  betas: ["mcp-client-2025-11-20"],
});
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1000,
    messages=[{
        "role": "user",
        "content": "What tools do you have available?"
    }],
    mcp_servers=[{
        "type": "url",
        "url": "https://mcp.example.com/sse",
        "name": "example-mcp",
        "authorization_token": "YOUR_TOKEN"
    }],
    tools=[{
        "type": "mcp_toolset",
        "mcp_server_name": "example-mcp"
    }],
    betas=["mcp-client-2025-11-20"]
)
```
</CodeGroup>

## MCP 伺服器配置

`mcp_servers` 陣列中的每個 MCP 伺服器定義連接詳細資訊：

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "authorization_token": "YOUR_TOKEN"
}
```

### 欄位說明

| 屬性 | 類型 | 必需 | 說明 |
|----------|------|----------|-------------|
| `type` | 字串 | 是 | 目前僅支援 "url" |
| `url` | 字串 | 是 | MCP 伺服器的 URL。必須以 https:// 開頭 |
| `name` | 字串 | 是 | 此 MCP 伺服器的唯一識別碼。必須由 `tools` 陣列中的恰好一個 MCPToolset 參考。 |
| `authorization_token` | 字串 | 否 | 如果 MCP 伺服器需要，則為 OAuth 授權令牌。請參閱 [MCP 規範](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization)。 |

## MCP 工具集配置

MCPToolset 位於 `tools` 陣列中，並配置啟用 MCP 伺服器中的哪些工具以及應如何配置它們。

### 基本結構

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "example-mcp",
  "default_config": {
    "enabled": true,
    "defer_loading": false
  },
  "configs": {
    "specific_tool_name": {
      "enabled": true,
      "defer_loading": true
    }
  }
}
```

### 欄位說明

| 屬性 | 類型 | 必需 | 說明 |
|----------|------|----------|-------------|
| `type` | 字串 | 是 | 必須為 "mcp_toolset" |
| `mcp_server_name` | 字串 | 是 | 必須與 `mcp_servers` 陣列中定義的伺服器名稱相符 |
| `default_config` | 物件 | 否 | 應用於此集合中所有工具的預設配置。`configs` 中的個別工具配置將覆蓋這些預設值。 |
| `configs` | 物件 | 否 | 每個工具的配置覆蓋。鍵是工具名稱，值是配置物件。 |
| `cache_control` | 物件 | 否 | 此工具集的快取中斷點配置 |

### 工具配置選項

每個工具（無論是在 `default_config` 中配置還是在 `configs` 中配置）都支援以下欄位：

| 屬性 | 類型 | 預設 | 說明 |
|----------|------|---------|-------------|
| `enabled` | 布林值 | `true` | 此工具是否啟用 |
| `defer_loading` | 布林值 | `false` | 如果為 true，工具說明最初不會傳送給模型。與[工具搜尋工具](/agents-and-tools/tool-search-tool)搭配使用。 |

### 配置合併

配置值按此優先順序合併（從高到低）：

1. `configs` 中的工具特定設定
2. 集合級別的 `default_config`
3. 系統預設值

範例：

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": false
    }
  }
}
```

結果為：
- `search_events`：`enabled: false`（來自 configs）、`defer_loading: true`（來自 default_config）
- 所有其他工具：`enabled: true`（系統預設）、`defer_loading: true`（來自 default_config）

## 常見配置模式

### 使用預設配置啟用所有工具

最簡單的模式 - 啟用伺服器中的所有工具：

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
}
```

### 允許清單 - 僅啟用特定工具

將 `enabled: false` 設定為預設值，然後明確啟用特定工具：

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false
  },
  "configs": {
    "search_events": {
      "enabled": true
    },
    "create_event": {
      "enabled": true
    }
  }
}
```

### 拒絕清單 - 停用特定工具

預設啟用所有工具，然後明確停用不需要的工具：

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "configs": {
    "delete_all_events": {
      "enabled": false
    },
    "share_calendar_publicly": {
      "enabled": false
    }
  }
}
```

### 混合 - 允許清單搭配每個工具的配置

結合允許清單與每個工具的自訂配置：

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
  "default_config": {
    "enabled": false,
    "defer_loading": true
  },
  "configs": {
    "search_events": {
      "enabled": true,
      "defer_loading": false
    },
    "list_events": {
      "enabled": true
    }
  }
}
```

在此範例中：
- `search_events` 啟用且 `defer_loading: false`
- `list_events` 啟用且 `defer_loading: true`（繼承自 default_config）
- 所有其他工具已停用

## 驗證規則

API 強制執行這些驗證規則：

- **伺服器必須存在**：MCPToolset 中的 `mcp_server_name` 必須與 `mcp_servers` 陣列中定義的伺服器相符
- **伺服器必須被使用**：`mcp_servers` 中定義的每個 MCP 伺服器必須由恰好一個 MCPToolset 參考
- **每個伺服器的唯一工具集**：每個 MCP 伺服器只能由一個 MCPToolset 參考
- **未知的工具名稱**：如果 `configs` 中的工具名稱在 MCP 伺服器上不存在，後端會記錄警告但不會傳回錯誤（MCP 伺服器可能具有動態工具可用性）

## 回應內容類型

當 Claude 使用 MCP 工具時，回應將包含兩種新的內容區塊類型：

### MCP 工具使用區塊

```json
{
  "type": "mcp_tool_use",
  "id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "name": "echo",
  "server_name": "example-mcp",
  "input": { "param1": "value1", "param2": "value2" }
}
```

### MCP 工具結果區塊

```json
{
  "type": "mcp_tool_result",
  "tool_use_id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "is_error": false,
  "content": [
    {
      "type": "text",
      "text": "Hello"
    }
  ]
}
```

## 多個 MCP 伺服器

您可以透過在 `mcp_servers` 中包含多個伺服器定義，並在 `tools` 陣列中為每個伺服器提供相應的 MCPToolset 來連接到多個 MCP 伺服器：

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [
    {
      "role": "user",
      "content": "Use tools from both mcp-server-1 and mcp-server-2 to complete this task"
    }
  ],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example1.com/sse",
      "name": "mcp-server-1",
      "authorization_token": "TOKEN1"
    },
    {
      "type": "url",
      "url": "https://mcp.example2.com/sse",
      "name": "mcp-server-2",
      "authorization_token": "TOKEN2"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-1"
    },
    {
      "type": "mcp_toolset",
      "mcp_server_name": "mcp-server-2",
      "default_config": {
        "defer_loading": true
      }
    }
  ]
}
```

## 驗證

對於需要 OAuth 驗證的 MCP 伺服器，您需要取得存取令牌。MCP 連接器測試版支援在 MCP 伺服器定義中傳遞 `authorization_token` 參數。
API 使用者應在進行 API 呼叫之前處理 OAuth 流程並取得存取令牌，以及根據需要重新整理令牌。

### 取得用於測試的存取令牌

MCP 檢查器可以引導您完成為測試目的取得存取令牌的過程。

1. 使用以下命令執行檢查器。您需要在機器上安裝 Node.js。

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. 在左側邊欄中，針對「傳輸類型」，選擇「SSE」或「Streamable HTTP」。
3. 輸入 MCP 伺服器的 URL。
4. 在右側區域中，在「需要配置驗證？」後按一下「開啟驗證設定」按鈕。
5. 按一下「快速 OAuth 流程」並在 OAuth 畫面上授權。
6. 按照檢查器的「OAuth 流程進度」部分中的步驟操作，並按一下「繼續」直到達到「驗證完成」。
7. 複製 `access_token` 值。
8. 將其貼到 MCP 伺服器配置中的 `authorization_token` 欄位。

### 使用存取令牌

取得使用上述任一 OAuth 流程的存取令牌後，您可以在 MCP 伺服器配置中使用它：

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "authenticated-server",
      "authorization_token": "YOUR_ACCESS_TOKEN_HERE"
    }
  ]
}
```

如需 OAuth 流程的詳細說明，請參閱 MCP 規範中的[授權部分](https://modelcontextprotocol.io/docs/concepts/authentication)。

## 遷移指南

如果您使用已棄用的 `mcp-client-2025-04-04` 測試版標頭，請按照本指南遷移到新版本。

### 主要變更

1. **新測試版標頭**：從 `mcp-client-2025-04-04` 變更為 `mcp-client-2025-11-20`
2. **工具配置已移動**：工具配置現在位於 `tools` 陣列中作為 MCPToolset 物件，而不是在 MCP 伺服器定義中
3. **更靈活的配置**：新模式支援允許清單、拒絕清單和每個工具的配置

### 遷移步驟

**之前（已棄用）：**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["tool1", "tool2"]
      }
    }
  ]
}
```

**之後（目前）：**

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1000,
  "messages": [...],
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://mcp.example.com/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN"
    }
  ],
  "tools": [
    {
      "type": "mcp_toolset",
      "mcp_server_name": "example-mcp",
      "default_config": {
        "enabled": false
      },
      "configs": {
        "tool1": {
          "enabled": true
        },
        "tool2": {
          "enabled": true
        }
      }
    }
  ]
}
```

### 常見遷移模式

| 舊模式 | 新模式 |
|-------------|-------------|
| 無 `tool_configuration`（所有工具啟用） | MCPToolset，無 `default_config` 或 `configs` |
| `tool_configuration.enabled: false` | MCPToolset，具有 `default_config.enabled: false` |
| `tool_configuration.allowed_tools: [...]` | MCPToolset，具有 `default_config.enabled: false` 和在 `configs` 中啟用的特定工具 |

## 棄用版本：mcp-client-2025-04-04

<Note type="warning">
  此版本已棄用。請使用上方的[遷移指南](#migration-guide)遷移到 `mcp-client-2025-11-20`。
</Note>

MCP 連接器的先前版本在 MCP 伺服器定義中直接包含工具配置：

```json
{
  "mcp_servers": [
    {
      "type": "url",
      "url": "https://example-server.modelcontextprotocol.io/sse",
      "name": "example-mcp",
      "authorization_token": "YOUR_TOKEN",
      "tool_configuration": {
        "enabled": true,
        "allowed_tools": ["example_tool_1", "example_tool_2"]
      }
    }
  ]
}
```

### 棄用欄位說明

| 屬性 | 類型 | 說明 |
|----------|------|-------------|
| `tool_configuration` | 物件 | **已棄用**：改用 `tools` 陣列中的 MCPToolset |
| `tool_configuration.enabled` | 布林值 | **已棄用**：在 MCPToolset 中使用 `default_config.enabled` |
| `tool_configuration.allowed_tools` | 陣列 | **已棄用**：在 MCPToolset 中使用允許清單模式搭配 `configs` |