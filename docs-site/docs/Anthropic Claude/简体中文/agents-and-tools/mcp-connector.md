# MCP 连接器

使用 Claude 的 Model Context Protocol (MCP) 连接器功能直接从 Messages API 连接到远程 MCP 服务器，无需单独的 MCP 客户端。

---

Claude 的 Model Context Protocol (MCP) 连接器功能使您能够直接从 Messages API 连接到远程 MCP 服务器，无需单独的 MCP 客户端。

<Note>
  **当前版本**：此功能需要 beta 标头：`"anthropic-beta": "mcp-client-2025-11-20"`

  之前的版本（`mcp-client-2025-04-04`）已弃用。请参阅下面的[弃用版本文档](#deprecated-version-mcp-client-2025-04-04)。
</Note>

## 主要功能

- **直接 API 集成**：无需实现 MCP 客户端即可连接到 MCP 服务器
- **工具调用支持**：通过 Messages API 访问 MCP 工具
- **灵活的工具配置**：启用所有工具、允许列表特定工具或拒绝列表不需要的工具
- **按工具配置**：使用自定义设置配置单个工具
- **OAuth 身份验证**：支持用于已认证服务器的 OAuth Bearer 令牌
- **多个服务器**：在单个请求中连接到多个 MCP 服务器

## 限制

- 在 [MCP 规范](https://modelcontextprotocol.io/introduction#explore-mcp) 的功能集中，目前仅支持[工具调用](https://modelcontextprotocol.io/docs/concepts/tools)。
- 服务器必须通过 HTTP 公开暴露（支持 Streamable HTTP 和 SSE 传输）。本地 STDIO 服务器无法直接连接。
- MCP 连接器目前在 Amazon Bedrock 和 Google Vertex 上不受支持。

## 在 Messages API 中使用 MCP 连接器

MCP 连接器使用两个组件：

1. **MCP 服务器定义**（`mcp_servers` 数组）：定义服务器连接详情（URL、身份验证）
2. **MCP 工具集**（`tools` 数组）：配置要启用的工具以及如何配置它们

### 基本示例

此示例使用默认配置启用 MCP 服务器中的所有工具：

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

## MCP 服务器配置

`mcp_servers` 数组中的每个 MCP 服务器定义连接详情：

```json
{
  "type": "url",
  "url": "https://example-server.modelcontextprotocol.io/sse",
  "name": "example-mcp",
  "authorization_token": "YOUR_TOKEN"
}
```

### 字段描述

| 属性 | 类型 | 必需 | 描述 |
|----------|------|----------|-------------|
| `type` | string | 是 | 目前仅支持 "url" |
| `url` | string | 是 | MCP 服务器的 URL。必须以 https:// 开头 |
| `name` | string | 是 | 此 MCP 服务器的唯一标识符。必须由 `tools` 数组中的恰好一个 MCPToolset 引用。 |
| `authorization_token` | string | 否 | 如果 MCP 服务器需要，则为 OAuth 授权令牌。请参阅 [MCP 规范](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization)。 |

## MCP 工具集配置

MCPToolset 位于 `tools` 数组中，配置启用 MCP 服务器中的哪些工具以及应如何配置它们。

### 基本结构

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

### 字段描述

| 属性 | 类型 | 必需 | 描述 |
|----------|------|----------|-------------|
| `type` | string | 是 | 必须为 "mcp_toolset" |
| `mcp_server_name` | string | 是 | 必须与 `mcp_servers` 数组中定义的服务器名称匹配 |
| `default_config` | object | 否 | 应用于此集合中所有工具的默认配置。`configs` 中的单个工具配置将覆盖这些默认值。 |
| `configs` | object | 否 | 按工具配置覆盖。键是工具名称，值是配置对象。 |
| `cache_control` | object | 否 | 此工具集的缓存断点配置 |

### 工具配置选项

每个工具（无论是在 `default_config` 还是在 `configs` 中配置）都支持以下字段：

| 属性 | 类型 | 默认值 | 描述 |
|----------|------|---------|-------------|
| `enabled` | boolean | `true` | 此工具是否启用 |
| `defer_loading` | boolean | `false` | 如果为 true，工具描述最初不会发送给模型。与[工具搜索工具](/agents-and-tools/tool-search-tool)一起使用。 |

### 配置合并

配置值按以下优先级合并（从高到低）：

1. `configs` 中的工具特定设置
2. 集合级 `default_config`
3. 系统默认值

示例：

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

结果为：
- `search_events`：`enabled: false`（来自 configs），`defer_loading: true`（来自 default_config）
- 所有其他工具：`enabled: true`（系统默认值），`defer_loading: true`（来自 default_config）

## 常见配置模式

### 使用默认配置启用所有工具

最简单的模式 - 启用服务器中的所有工具：

```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "google-calendar-mcp",
}
```

### 允许列表 - 仅启用特定工具

将 `enabled: false` 设置为默认值，然后显式启用特定工具：

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

### 拒绝列表 - 禁用特定工具

默认启用所有工具，然后显式禁用不需要的工具：

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

### 混合 - 允许列表与按工具配置

将允许列表与每个工具的自定义配置结合：

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

在此示例中：
- `search_events` 启用且 `defer_loading: false`
- `list_events` 启用且 `defer_loading: true`（继承自 default_config）
- 所有其他工具被禁用

## 验证规则

API 强制执行这些验证规则：

- **服务器必须存在**：MCPToolset 中的 `mcp_server_name` 必须与 `mcp_servers` 数组中定义的服务器匹配
- **服务器必须被使用**：`mcp_servers` 中定义的每个 MCP 服务器必须由恰好一个 MCPToolset 引用
- **每个服务器唯一工具集**：每个 MCP 服务器只能由一个 MCPToolset 引用
- **未知工具名称**：如果 `configs` 中的工具名称在 MCP 服务器上不存在，将记录后端警告但不返回错误（MCP 服务器可能具有动态工具可用性）

## 响应内容类型

当 Claude 使用 MCP 工具时，响应将包括两种新的内容块类型：

### MCP 工具使用块

```json
{
  "type": "mcp_tool_use",
  "id": "mcptoolu_014Q35RayjACSWkSj4X2yov1",
  "name": "echo",
  "server_name": "example-mcp",
  "input": { "param1": "value1", "param2": "value2" }
}
```

### MCP 工具结果块

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

## 多个 MCP 服务器

您可以通过在 `mcp_servers` 中包含多个服务器定义，并在 `tools` 数组中为每个服务器对应一个 MCPToolset 来连接到多个 MCP 服务器：

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

## 身份验证

对于需要 OAuth 身份验证的 MCP 服务器，您需要获取访问令牌。MCP 连接器 beta 支持在 MCP 服务器定义中传递 `authorization_token` 参数。
API 使用者应在进行 API 调用之前处理 OAuth 流并获取访问令牌，以及根据需要刷新令牌。

### 获取用于测试的访问令牌

MCP 检查器可以指导您完成获取用于测试目的的访问令牌的过程。

1. 使用以下命令运行检查器。您需要在计算机上安装 Node.js。

   ```bash
   npx @modelcontextprotocol/inspector
   ```

2. 在左侧边栏中，对于"传输类型"，选择"SSE"或"Streamable HTTP"。
3. 输入 MCP 服务器的 URL。
4. 在右侧区域，在"需要配置身份验证？"之后单击"打开身份验证设置"按钮。
5. 单击"快速 OAuth 流"并在 OAuth 屏幕上授权。
6. 按照检查器的"OAuth 流进度"部分中的步骤操作，单击"继续"直到达到"身份验证完成"。
7. 复制 `access_token` 值。
8. 将其粘贴到 MCP 服务器配置中的 `authorization_token` 字段。

### 使用访问令牌

获得访问令牌后，您可以在 MCP 服务器配置中使用它：

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

有关 OAuth 流的详细说明，请参阅 MCP 规范中的[授权部分](https://modelcontextprotocol.io/docs/concepts/authentication)。

## 迁移指南

如果您正在使用已弃用的 `mcp-client-2025-04-04` beta 标头，请按照本指南迁移到新版本。

### 关键变化

1. **新 beta 标头**：从 `mcp-client-2025-04-04` 更改为 `mcp-client-2025-11-20`
2. **工具配置已移动**：工具配置现在位于 `tools` 数组中作为 MCPToolset 对象，而不是在 MCP 服务器定义中
3. **更灵活的配置**：新模式支持允许列表、拒绝列表和按工具配置

### 迁移步骤

**之前（已弃用）：**

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

**之后（当前）：**

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

### 常见迁移模式

| 旧模式 | 新模式 |
|-------------|-------------|
| 无 `tool_configuration`（所有工具启用） | 无 `default_config` 或 `configs` 的 MCPToolset |
| `tool_configuration.enabled: false` | 具有 `default_config.enabled: false` 的 MCPToolset |
| `tool_configuration.allowed_tools: [...]` | 具有 `default_config.enabled: false` 和在 `configs` 中启用的特定工具的 MCPToolset |

## 弃用版本：mcp-client-2025-04-04

<Note type="warning">
  此版本已弃用。请使用上面的[迁移指南](#migration-guide)迁移到 `mcp-client-2025-11-20`。
</Note>

MCP 连接器的先前版本在 MCP 服务器定义中直接包含工具配置：

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

### 弃用字段描述

| 属性 | 类型 | 描述 |
|----------|------|-------------|
| `tool_configuration` | object | **已弃用**：改用 `tools` 数组中的 MCPToolset |
| `tool_configuration.enabled` | boolean | **已弃用**：改用 MCPToolset 中的 `default_config.enabled` |
| `tool_configuration.allowed_tools` | array | **已弃用**：改用 MCPToolset 中具有 `configs` 的允许列表模式 |