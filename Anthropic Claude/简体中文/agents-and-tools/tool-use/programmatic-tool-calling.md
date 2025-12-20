# 程序化工具调用

使用程序化工具调用让 Claude 在代码执行容器中以编程方式调用您的工具，而无需为每次工具调用进行往返。

---

程序化工具调用允许 Claude 在[代码执行](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool)容器中编写代码以编程方式调用您的工具，而不是需要为每次工具调用进行往返。这减少了多工具工作流的延迟，并通过允许 Claude 在数据到达模型的上下文窗口之前过滤或处理数据来降低令牌消耗。

<Note>
程序化工具调用目前处于公开测试版。

要使用此功能，请将 `"advanced-tool-use-2025-11-20"` [测试版标头](/docs/zh-CN/api/beta-headers)添加到您的 API 请求中。

此功能需要启用代码执行工具。
</Note>

## 模型兼容性

程序化工具调用在以下模型上可用：

| 模型 | 工具版本 |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |

<Warning>
程序化工具调用可通过 Claude API 和 Microsoft Foundry 获得。
</Warning>

## 快速开始

这是一个简单的示例，其中 Claude 以编程方式多次查询数据库并聚合结果：

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
            }
        ],
        "tools": [
            {
                "type": "code_execution_20250825",
                "name": "code_execution"
            },
            {
                "name": "query_database",
                "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "sql": {
                            "type": "string",
                            "description": "SQL query to execute"
                        }
                    },
                    "required": ["sql"]
                },
                "allowed_callers": ["code_execution_20250825"]
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL query to execute"
                    }
                },
                "required": ["sql"]
            },
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
      }
    ],
    tools: [
      {
        type: "code_execution_20250825",
        name: "code_execution"
      },
      {
        name: "query_database",
        description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        input_schema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "SQL query to execute"
            }
          },
          required: ["sql"]
        },
        allowed_callers: ["code_execution_20250825"]
      }
    ]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## 程序化工具调用如何工作

当您配置一个工具可从代码执行调用，并且 Claude 决定使用该工具时：

1. Claude 编写 Python 代码来调用该工具作为函数，可能包括多个工具调用和前/后处理逻辑
2. Claude 通过代码执行在沙箱容器中运行此代码
3. 当调用工具函数时，代码执行暂停，API 返回一个 `tool_use` 块
4. 您提供工具结果，代码执行继续（中间结果不会加载到 Claude 的上下文窗口中）
5. 一旦所有代码执行完成，Claude 接收最终输出并继续处理任务

这种方法特别适用于：
- **大数据处理**：在工具结果到达 Claude 的上下文之前过滤或聚合工具结果
- **多步工作流**：通过在不对 Claude 进行采样的情况下连续或循环调用工具来节省令牌和延迟
- **条件逻辑**：根据中间工具结果做出决策

<Note>
自定义工具被转换为异步 Python 函数以支持并行工具调用。当 Claude 编写调用您的工具的代码时，它使用 `await`（例如，`result = await query_database("<sql>")`）并自动包含适当的异步包装函数。

为了清晰起见，本文档中的代码示例中省略了异步包装。
</Note>

## 核心概念

### `allowed_callers` 字段

`allowed_callers` 字段指定哪些上下文可以调用工具：

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the database",
  "input_schema": {...},
  "allowed_callers": ["code_execution_20250825"]
}
```

**可能的值：**
- `["direct"]` - 仅 Claude 可以直接调用此工具（如果省略则为默认值）
- `["code_execution_20250825"]` - 仅可从代码执行中调用
- `["direct", "code_execution_20250825"]` - 可直接调用和从代码执行中调用

<Tip>
我们建议为每个工具选择 `["direct"]` 或 `["code_execution_20250825"]`，而不是同时启用两者，因为这为 Claude 提供了更清晰的指导，说明如何最好地使用该工具。
</Tip>

### 响应中的 `caller` 字段

每个工具使用块都包含一个 `caller` 字段，指示它是如何被调用的：

**直接调用（传统工具使用）：**
```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {"type": "direct"}
}
```

**程序化调用：**
```json
{
  "type": "tool_use",
  "id": "toolu_xyz789",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc123"
  }
}
```

`tool_id` 引用进行程序化调用的代码执行工具。

### 容器生命周期

程序化工具调用使用与代码执行相同的容器：

- **容器创建**：为每个会话创建一个新容器，除非您重用现有容器
- **过期**：容器在大约 4.5 分钟的不活动后过期（可能会更改）
- **容器 ID**：通过 `container` 字段在响应中返回
- **重用**：传递容器 ID 以在请求之间维护状态

<Warning>
当工具以编程方式调用并且容器正在等待您的工具结果时，您必须在容器过期之前响应。监视 `expires_at` 字段。如果容器过期，Claude 可能会将工具调用视为超时并重试它。
</Warning>

## 示例工作流

以下是完整的程序化工具调用流程的工作方式：

### 步骤 1：初始请求

发送包含代码执行和允许程序化调用的工具的请求。要启用程序化调用，请将 `allowed_callers` 字段添加到您的工具定义中。

<Note>
在工具描述中提供工具输出格式的详细描述。如果您指定工具返回 JSON，Claude 将尝试在代码中反序列化和处理结果。您提供的关于输出架构的细节越多，Claude 就能更好地以编程方式处理响应。
</Note>

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
  }],
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution"
    },
    {
      name: "query_database",
      description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
      input_schema: {...},
      allowed_callers: ["code_execution_20250825"]
    }
  ]
});
```
</CodeGroup>

### 步骤 2：API 响应与工具调用

Claude 编写调用您的工具的代码。API 暂停并返回：

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll query the purchase history and analyze the results."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_abc123",
      "name": "code_execution",
      "input": {
        "code": "results = await query_database('<sql>')\ntop_customers = sorted(results, key=lambda x: x['revenue'], reverse=True)[:5]\nprint(f'Top 5 customers: {top_customers}')"
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_def456",
      "name": "query_database",
      "input": {"sql": "<sql>"},
      "caller": {
        "type": "code_execution_20250825",
        "tool_id": "srvtoolu_abc123"
      }
    }
  ],
  "container": {
    "id": "container_xyz789",
    "expires_at": "2025-01-15T14:30:00Z"
  },
  "stop_reason": "tool_use"
}
```

### 步骤 3：提供工具结果

包括完整的对话历史加上您的工具结果：

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    container="container_xyz789",  # Reuse the container
    messages=[
        {"role": "user", "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"},
        {
            "role": "assistant",
            "content": [
                {"type": "text", "text": "I'll query the purchase history and analyze the results."},
                {
                    "type": "server_tool_use",
                    "id": "srvtoolu_abc123",
                    "name": "code_execution",
                    "input": {"code": "..."}
                },
                {
                    "type": "tool_use",
                    "id": "toolu_def456",
                    "name": "query_database",
                    "input": {"sql": "<sql>"},
                    "caller": {
                        "type": "code_execution_20250825",
                        "tool_id": "srvtoolu_abc123"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_def456",
                    "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
                }
            ]
        }
    ],
    tools=[...]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  container: "container_xyz789",  // Reuse the container
  messages: [
    { role: "user", content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "I'll query the purchase history and analyze the results." },
        {
          type: "server_tool_use",
          id: "srvtoolu_abc123",
          name: "code_execution",
          input: { code: "..." }
        },
        {
          type: "tool_use",
          id: "toolu_def456",
          name: "query_database",
          input: { sql: "<sql>" },
          caller: {
            type: "code_execution_20250825",
            tool_id: "srvtoolu_abc123"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_def456",
          content: "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
        }
      ]
    }
  ],
  tools: [...]
});
```
</CodeGroup>

### 步骤 4：下一个工具调用或完成

代码执行继续并处理结果。如果需要额外的工具调用，重复步骤 3，直到所有工具调用都得到满足。

### 步骤 5：最终响应

一旦代码执行完成，Claude 提供最终响应：

```json
{
  "content": [
    {
      "type": "code_execution_tool_result",
      "tool_use_id": "srvtoolu_abc123",
      "content": {
        "type": "code_execution_result",
        "stdout": "Top 5 customers by revenue:\n1. Customer C1: $45,000\n2. Customer C2: $38,000\n3. Customer C5: $32,000\n4. Customer C8: $28,500\n5. Customer C3: $24,000",
        "stderr": "",
        "return_code": 0,
        "content": []
      }
    },
    {
      "type": "text",
      "text": "I've analyzed the purchase history from last quarter. Your top 5 customers generated $167,500 in total revenue, with Customer C1 leading at $45,000."
    }
  ],
  "stop_reason": "end_turn"
}
```

## 高级模式

### 使用循环进行批处理

Claude 可以编写代码来高效处理多个项目：

```python
# async wrapper omitted for clarity
regions = ["West", "East", "Central", "North", "South"]
results = {}
for region in regions:
    data = await query_database(f"<sql for {region}>")
    results[region] = sum(row["revenue"] for row in data)

# Process results programmatically
top_region = max(results.items(), key=lambda x: x[1])
print(f"Top region: {top_region[0]} with ${top_region[1]:,} in revenue")
```

这种模式：
- 将模型往返次数从 N（每个区域一次）减少到 1
- 在返回 Claude 之前以编程方式处理大型结果集
- 通过仅返回聚合结论而不是原始数据来节省令牌

### 早期终止

Claude 可以在满足成功标准后立即停止处理：

```python
# async wrapper omitted for clarity
endpoints = ["us-east", "eu-west", "apac"]
for endpoint in endpoints:
    status = await check_health(endpoint)
    if status == "healthy":
        print(f"Found healthy endpoint: {endpoint}")
        break  # Stop early, don't check remaining
```

### 条件工具选择

```python
# async wrapper omitted for clarity
file_info = await get_file_info(path)
if file_info["size"] < 10000:
    content = await read_full_file(path)
else:
    content = await read_file_summary(path)
print(content)
```

### 数据过滤

```python
# async wrapper omitted for clarity
logs = await fetch_logs(server_id)
errors = [log for log in logs if "ERROR" in log]
print(f"Found {len(errors)} errors")
for error in errors[-10:]:  # Only return last 10 errors
    print(error)
```

## 响应格式

### 程序化工具调用

当代码执行调用工具时：

```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "<sql>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xyz789"
  }
}
```

### 工具结果处理

您的工具结果被传递回运行的代码：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_abc123",
      "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000, \"orders\": 23}, {\"customer_id\": \"C2\", \"revenue\": 38000, \"orders\": 18}, ...]"
    }
  ]
}
```

### 代码执行完成

当所有工具调用都得到满足且代码完成时：

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_xyz789",
  "content": {
    "type": "code_execution_result",
    "stdout": "Analysis complete. Top 5 customers identified from 847 total records.",
    "stderr": "",
    "return_code": 0,
    "content": []
  }
}
```

## 错误处理

### 常见错误

| 错误 | 描述 | 解决方案 |
|-------|-------------|----------|
| `invalid_tool_input` | 工具输入与架构不匹配 | 验证您的工具的 input_schema |
| `tool_not_allowed` | 工具不允许请求的调用者类型 | 检查 `allowed_callers` 是否包含正确的上下文 |
| `missing_beta_header` | 未提供 PTC 测试版标头 | 将两个测试版标头添加到您的请求中 |

### 工具调用期间的容器过期

如果您的工具响应时间过长，代码执行将收到 `TimeoutError`。Claude 在 stderr 中看到这一点，通常会重试：

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc123",
  "content": {
    "type": "code_execution_result",
    "stdout": "",
    "stderr": "TimeoutError: Calling tool ['query_database'] timed out.",
    "return_code": 0,
    "content": []
  }
}
```

为了防止超时：
- 监视响应中的 `expires_at` 字段
- 为您的工具执行实现超时
- 考虑将长操作分解为较小的块

### 工具执行错误

如果您的工具返回错误：

```python
# Provide error information in the tool result
{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "Error: Query timeout - table lock exceeded 30 seconds"
}
```

Claude 的代码将收到此错误并可以适当地处理它。

## 约束和限制

### 功能不兼容性

- **结构化输出**：具有 `strict: true` 的工具不支持程序化调用
- **工具选择**：您不能通过 `tool_choice` 强制程序化调用特定工具
- **并行工具使用**：`disable_parallel_tool_use: true` 不支持程序化调用

### 工具限制

以下工具目前无法以编程方式调用，但可能在未来版本中添加支持：

- 网络搜索
- 网络获取
- 由 [MCP 连接器](/docs/zh-CN/agents-and-tools/mcp-connector)提供的工具

### 消息格式限制

在响应程序化工具调用时，有严格的格式要求：

**仅工具结果响应**：如果有待处理的程序化工具调用等待结果，您的响应消息必须仅包含 `tool_result` 块。您不能包含任何文本内容，即使在工具结果之后也不行。

```json
// ❌ 无效 - 在响应程序化工具调用时不能包含文本
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"},
    {"type": "text", "text": "What should I do next?"}  // This will cause an error
  ]
}

// ✅ 有效 - 仅在响应程序化工具调用时使用工具结果
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"}
  ]
}
```

此限制仅在响应程序化（代码执行）工具调用时适用。对于常规客户端工具调用，您可以在工具结果后包含文本内容。

### 速率限制

程序化工具调用受与常规工具调用相同的速率限制。来自代码执行的每个工具调用都计为单独的调用。

### 在使用前验证工具结果

在实现将以编程方式调用的自定义工具时：

- **工具结果作为字符串返回**：它们可以包含任何内容，包括代码片段或可执行命令，这些可能会被执行环境处理。
- **验证外部工具结果**：如果您的工具返回来自外部源的数据或接受用户输入，请注意如果输出将被解释或执行为代码，则存在代码注入风险。

## 令牌效率

程序化工具调用可以显著降低令牌消耗：

- **来自程序化调用的工具结果不会添加到 Claude 的上下文中** - 仅最终代码输出会添加
- **中间处理在代码中进行** - 过滤、聚合等不消耗模型令牌
- **一个代码执行中的多个工具调用** - 与单独的模型轮次相比减少开销

例如，直接调用 10 个工具使用的令牌数约为以编程方式调用它们并返回摘要的 10 倍。

## 使用和定价

程序化工具调用使用与代码执行相同的定价。有关详细信息，请参阅[代码执行定价](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing)。

<Note>
程序化工具调用的令牌计数：来自程序化调用的工具结果不计入您的输入/输出令牌使用。仅最终代码执行结果和 Claude 的响应计数。
</Note>

## 最佳实践

### 工具设计

- **提供详细的输出描述**：由于 Claude 在代码中反序列化工具结果，请清楚地记录格式（JSON 结构、字段类型等）
- **返回结构化数据**：JSON 或其他易于解析的格式最适合程序化处理
- **保持响应简洁**：仅返回必要的数据以最小化处理开销

### 何时使用程序化调用

**良好的用例：**
- 处理大型数据集，其中您只需要聚合或摘要
- 具有 3 个或更多依赖工具调用的多步工作流
- 需要过滤、排序或转换工具结果的操作
- 中间数据不应影响 Claude 推理的任务
- 跨许多项目的并行操作（例如，检查 50 个端点）

**不太理想的用例：**
- 具有简单响应的单个工具调用
- 需要立即用户反馈的工具
- 代码执行开销会超过好处的非常快速的操作

### 性能优化

- **重用容器**，在进行多个相关请求时维护状态
- **在单个代码执行中批处理类似操作**（如果可能）

## 故障排除

### 常见问题

**"工具不允许"错误**
- 验证您的工具定义包含 `"allowed_callers": ["code_execution_20250825"]`
- 检查您是否使用了正确的测试版标头

**容器过期**
- 确保您在容器的生命周期内响应工具调用（约 4.5 分钟）
- 监视响应中的 `expires_at` 字段
- 考虑实现更快的工具执行

**测试版标头问题**
- 您需要标头：`"advanced-tool-use-2025-11-20"`

**工具结果解析不正确**
- 确保您的工具返回 Claude 可以反序列化的字符串数据
- 在您的工具描述中提供清晰的输出格式文档

### 调试提示

1. **记录所有工具调用和结果**以跟踪流程
2. **检查 `caller` 字段**以确认程序化调用
3. **监视容器 ID** 以确保正确重用
4. **独立测试工具**，然后启用程序化调用

## 为什么程序化工具调用有效

Claude 的训练包括对代码的广泛接触，使其能够有效地推理和链接函数调用。当工具在代码执行环境中作为可调用函数呈现时，Claude 可以利用这一优势来：

- **自然地推理工具组合**：链接操作并处理依赖关系，就像编写任何 Python 代码一样自然
- **高效处理大型结果**：过滤大型工具输出、仅提取相关数据或在返回摘要到上下文窗口之前将中间结果写入文件
- **显著降低延迟**：消除在多步工作流中每个工具调用之间重新采样 Claude 的开销

这种方法支持使用传统工具使用会不切实际的工作流——例如处理超过 1M 令牌的文件——通过允许 Claude 以编程方式处理数据，而不是将所有内容加载到对话上下文中。

## 替代实现

程序化工具调用是一个可以在 Anthropic 的托管代码执行之外实现的可泛化模式。以下是方法概述：

### 客户端直接执行

为 Claude 提供代码执行工具，并描述该环境中可用的函数。当 Claude 使用代码调用工具时，您的应用程序在定义这些函数的本地执行它。

**优点：**
- 实现简单，需要最少的重新架构
- 完全控制环境和说明

**缺点：**
- 在沙箱外执行不受信任的代码
- 工具调用可能是代码注入的向量

**使用时机**：您的应用程序可以安全地执行任意代码，您想要一个简单的解决方案，并且 Anthropic 的托管产品不适合您的需求。

### 自管理沙箱执行

从 Claude 的角度来看相同的方法，但代码在具有安全限制的沙箱容器中运行（例如，无网络出口）。如果您的工具需要外部资源，您需要一个协议来在沙箱外执行工具调用。

**优点：**
- 在您自己的基础设施上进行安全的程序化工具调用
- 完全控制执行环境

**缺点：**
- 构建和维护复杂
- 需要管理基础设施和进程间通信

**使用时机**：安全至关重要，Anthropic 的托管解决方案不适合您的要求。

### Anthropic 托管执行

Anthropic 的程序化工具调用是沙箱执行的托管版本，具有为 Claude 调整的固定 Python 环境。Anthropic 处理容器管理、代码执行和安全工具调用通信。

**优点：**
- 默认安全和安全
- 最小配置易于启用
- 针对 Claude 优化的环境和说明

如果您使用 Claude API，我们建议使用 Anthropic 的托管解决方案。

## 相关功能

<CardGroup cols={2}>
  <Card title="代码执行工具" icon="code" href="/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool">
    了解支持程序化工具调用的底层代码执行功能。
  </Card>
  <Card title="工具使用概述" icon="wrench" href="/docs/zh-CN/agents-and-tools/tool-use/overview">
    了解使用 Claude 进行工具使用的基础知识。
  </Card>
  <Card title="实现工具使用" icon="hammer" href="/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use">
    实现工具的分步指南。
  </Card>
</CardGroup>