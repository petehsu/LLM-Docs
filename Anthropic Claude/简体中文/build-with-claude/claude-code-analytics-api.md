# Claude Code 分析 API

通过 Claude Code 分析管理员 API 以编程方式访问您组织的 Claude Code 使用分析和生产力指标。

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

Claude Code 分析管理员 API 提供对 Claude Code 用户的每日汇总使用指标的编程访问，使组织能够分析开发人员生产力并构建自定义仪表板。此 API 弥补了我们基础 [分析仪表板](/claude-code) 和复杂 OpenTelemetry 集成之间的差距。

此 API 使您能够更好地监控、分析和优化 Claude Code 的采用：

* **开发人员生产力分析：** 跟踪使用 Claude Code 创建的会话、添加/删除的代码行、提交和拉取请求
* **工具使用指标：** 监控不同 Claude Code 工具（编辑、写入、NotebookEdit）的接受和拒绝率
* **成本分析：** 查看按 Claude 模型细分的估计成本和令牌使用情况
* **自定义报告：** 导出数据以为管理团队构建执行仪表板和报告
* **使用情况证明：** 提供指标以证明和扩展 Claude Code 在内部的采用

<Check>
  **需要管理员 API 密钥**
  
  此 API 是 [管理员 API](/docs/zh-CN/build-with-claude/administration-api) 的一部分。这些端点需要管理员 API 密钥（以 `sk-ant-admin...` 开头），与标准 API 密钥不同。只有具有管理员角色的组织成员才能通过 [Claude 控制台](/settings/admin-keys) 配置管理员 API 密钥。
</Check>

## 快速开始

获取您组织在特定日期的 Claude Code 分析：

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **为集成设置 User-Agent 标头**
  
  如果您正在构建集成，请设置 User-Agent 标头以帮助我们了解使用模式：
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## Claude Code 分析 API

使用 `/v1/organizations/usage_report/claude_code` 端点跟踪整个组织的 Claude Code 使用情况、生产力指标和开发人员活动。

### 关键概念

- **每日汇总**：返回由 `starting_at` 参数指定的单一日期的指标
- **用户级数据**：每条记录代表一个用户在指定日期的活动
- **生产力指标**：跟踪会话、代码行、提交、拉取请求和工具使用情况
- **令牌和成本数据**：监控按 Claude 模型细分的使用情况和估计成本
- **基于游标的分页**：使用不透明游标处理大型数据集的稳定分页
- **数据新鲜度**：指标可在完成后最多延迟 1 小时可用以确保一致性

有关完整的参数详情和响应架构，请参阅 [Claude Code 分析 API 参考](/docs/zh-CN/api/admin-api/claude-code/get-claude-code-usage-report)。

### 基本示例

#### 获取特定日期的分析

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### 获取带分页的分析

```bash
# 第一个请求
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# 使用响应中的游标的后续请求
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
page=page_MjAyNS0wNS0xNFQwMDowMDowMFo=" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

### 请求参数

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `starting_at` | 字符串 | 是 | YYYY-MM-DD 格式的 UTC 日期。仅返回此单一日期的指标 |
| `limit` | 整数 | 否 | 每页记录数（默认值：20，最大值：1000） |
| `page` | 字符串 | 否 | 来自前一个响应的 `next_page` 字段的不透明游标令牌 |

### 可用指标

每个响应记录包含单个用户在单一日期的以下指标：

#### 维度
- **date**：RFC 3339 格式的日期（UTC 时间戳）
- **actor**：执行 Claude Code 操作的用户或 API 密钥（`user_actor` 带有 `email_address` 或 `api_actor` 带有 `api_key_name`）
- **organization_id**：组织 UUID
- **customer_type**：客户账户类型（`api` 用于 API 客户，`subscription` 用于 Pro/Team 客户）
- **terminal_type**：使用 Claude Code 的终端或环境类型（例如 `vscode`、`iTerm.app`、`tmux`）

#### 核心指标
- **num_sessions**：此参与者启动的不同 Claude Code 会话数
- **lines_of_code.added**：Claude Code 在所有文件中添加的代码行总数
- **lines_of_code.removed**：Claude Code 在所有文件中删除的代码行总数
- **commits_by_claude_code**：通过 Claude Code 的提交功能创建的 git 提交数
- **pull_requests_by_claude_code**：通过 Claude Code 的 PR 功能创建的拉取请求数

#### 工具操作指标
按工具类型细分的工具操作接受和拒绝率：
- **edit_tool.accepted/rejected**：用户接受/拒绝的编辑工具建议数
- **write_tool.accepted/rejected**：用户接受/拒绝的写入工具建议数
- **notebook_edit_tool.accepted/rejected**：用户接受/拒绝的 NotebookEdit 工具建议数

#### 模型细分
对于使用的每个 Claude 模型：
- **model**：Claude 模型标识符（例如 `claude-sonnet-4-5-20250929`）
- **tokens.input/output**：此模型的输入和输出令牌计数
- **tokens.cache_read/cache_creation**：此模型的缓存相关令牌使用情况
- **estimated_cost.amount**：此模型的估计成本（以美分 USD 计）
- **estimated_cost.currency**：成本金额的货币代码（目前始终为 `USD`）

### 响应结构

API 以以下格式返回数据：

```json
{
  "data": [
    {
      "date": "2025-09-01T00:00:00Z",
      "actor": {
        "type": "user_actor",
        "email_address": "developer@company.com"
      },
      "organization_id": "dc9f6c26-b22c-4831-8d01-0446bada88f1",
      "customer_type": "api",
      "terminal_type": "vscode",
      "core_metrics": {
        "num_sessions": 5,
        "lines_of_code": {
          "added": 1543,
          "removed": 892
        },
        "commits_by_claude_code": 12,
        "pull_requests_by_claude_code": 2
      },
      "tool_actions": {
        "edit_tool": {
          "accepted": 45,
          "rejected": 5
        },
        "multi_edit_tool": {
          "accepted": 12,
          "rejected": 2
        },
        "write_tool": {
          "accepted": 8,
          "rejected": 1
        },
        "notebook_edit_tool": {
          "accepted": 3,
          "rejected": 0
        }
      },
      "model_breakdown": [
        {
          "model": "claude-sonnet-4-5-20250929",
          "tokens": {
            "input": 100000,
            "output": 35000,
            "cache_read": 10000,
            "cache_creation": 5000
          },
          "estimated_cost": {
            "currency": "USD",
            "amount": 1025
          }
        }
      ]
    }
  ],
  "has_more": false,
  "next_page": null
}
```

## 分页

API 支持对拥有大量用户的组织进行基于游标的分页：

1. 使用可选的 `limit` 参数进行初始请求
2. 如果响应中的 `has_more` 为 `true`，请在下一个请求中使用 `next_page` 值
3. 继续直到 `has_more` 为 `false`

游标编码最后一条记录的位置，并确保即使新数据到达也能进行稳定的分页。每个分页会话都维护一致的数据边界，以确保您不会遗漏或重复记录。

## 常见用例

- **执行仪表板**：创建显示 Claude Code 对开发速度影响的高级报告
- **AI 工具比较**：导出指标以将 Claude Code 与 Copilot 和 Cursor 等其他 AI 编码工具进行比较
- **开发人员生产力分析**：随时间跟踪个人和团队生产力指标
- **成本跟踪和分配**：监控支出模式并按团队或项目分配成本
- **采用监控**：确定哪些团队和用户从 Claude Code 获得最多价值
- **ROI 证明**：提供具体指标以证明和扩展 Claude Code 在内部的采用

## 常见问题

### 分析数据有多新鲜？
Claude Code 分析数据通常在用户活动完成后 1 小时内出现。为了确保一致的分页结果，响应中仅包含超过 1 小时的数据。

### 我可以获得实时指标吗？
不，此 API 仅提供每日汇总指标。对于实时监控，请考虑使用 [OpenTelemetry 集成](https://code.claude.com/docs/en/monitoring-usage)。

### 数据中如何识别用户？
用户通过 `actor` 字段以两种方式识别：
- **`user_actor`**：包含通过 OAuth 进行身份验证的用户的 `email_address`（最常见）
- **`api_actor`**：包含通过 API 密钥进行身份验证的用户的 `api_key_name`

`customer_type` 字段指示使用情况是来自 `api` 客户（API PAYG）还是 `subscription` 客户（Pro/Team 计划）。

### 数据保留期是多少？
历史 Claude Code 分析数据被保留并可通过 API 访问。此数据没有指定的删除期。

### 支持哪些 Claude Code 部署？
此 API 仅跟踪 Claude API（第一方）上的 Claude Code 使用情况。Amazon Bedrock、Google Vertex AI 或其他第三方平台上的使用情况不包括在内。

### 使用此 API 需要多少成本？
Claude Code 分析 API 对所有有权访问管理员 API 的组织免费使用。

### 我如何计算工具接受率？
工具接受率 = `accepted / (accepted + rejected)`（对于每种工具类型）。例如，如果编辑工具显示 45 个接受和 5 个拒绝，接受率为 90%。

### 日期参数使用什么时区？
所有日期均为 UTC。`starting_at` 参数应为 YYYY-MM-DD 格式，代表该日期的 UTC 午夜。

## 另请参阅

Claude Code 分析 API 帮助您了解和优化团队的开发工作流程。了解有关相关功能的更多信息：

- [管理员 API 概述](/docs/zh-CN/build-with-claude/administration-api)
- [管理员 API 参考](/docs/zh-CN/api/admin)
- [Claude Code 分析仪表板](/claude-code)
- [使用和成本 API](/docs/zh-CN/build-with-claude/usage-cost-api) - 跟踪所有 Anthropic 服务的 API 使用情况
- [身份和访问管理](https://code.claude.com/docs/en/iam)
- [使用 OpenTelemetry 监控使用情况](https://code.claude.com/docs/en/monitoring-usage) 用于自定义指标和警报