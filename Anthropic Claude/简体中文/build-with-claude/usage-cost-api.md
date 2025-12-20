# 使用情况和成本 API

通过使用情况和成本管理员 API 以编程方式访问您组织的 API 使用情况和成本数据。

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

使用情况和成本管理员 API 为您的组织提供对历史 API 使用情况和成本数据的编程和细粒度访问。此数据类似于 Claude 控制台的[使用情况](/usage)和[成本](/cost)页面中提供的信息。

此 API 使您能够更好地监控、分析和优化您的 Claude 实现：

* **准确的使用情况跟踪：** 获取精确的令牌计数和使用情况模式，而不仅仅依赖响应令牌计数
* **成本对账：** 将内部记录与 Anthropic 账单相匹配，用于财务和会计团队
* **产品性能和改进：** 监控产品性能，同时衡量对系统的更改是否改进了它，或设置警报
* **[速率限制](/docs/zh-CN/api/rate-limits)和[优先级层](/docs/zh-CN/api/service-tiers#get-started-with-priority-tier)优化：** 优化[提示缓存](/docs/zh-CN/build-with-claude/prompt-caching)或特定提示等功能，以充分利用分配的容量，或购买专用容量。
* **高级分析：** 执行比控制台中可用的更深入的数据分析

<Check>
  **需要管理员 API 密钥**
  
  此 API 是[管理员 API](/docs/zh-CN/build-with-claude/administration-api)的一部分。这些端点需要管理员 API 密钥（以 `sk-ant-admin...` 开头），与标准 API 密钥不同。只有具有管理员角色的组织成员才能通过 [Claude 控制台](/settings/admin-keys)配置管理员 API 密钥。
</Check>

## 合作伙伴解决方案

领先的可观测性平台为监控您的 Claude API 使用情况和成本提供现成的集成，无需编写自定义代码。这些集成提供仪表板、警报和分析，帮助您有效管理 API 使用情况。

<CardGroup cols={3}>
  <Card title="CloudZero" icon="chart" href="https://docs.cloudzero.com/docs/connections-anthropic">
    用于跟踪和预测成本的云智能平台
  </Card>
  <Card title="Datadog" icon="chart" href="https://docs.datadoghq.com/integrations/anthropic/">
    具有自动跟踪和监控的 LLM 可观测性
  </Card>
  <Card title="Grafana Cloud" icon="chart" href="https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/">
    无代理集成，可轻松实现 LLM 可观测性，具有开箱即用的仪表板和警报
  </Card>
  <Card title="Honeycomb" icon="polygon" href="https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/">
    通过 OpenTelemetry 进行高级查询和可视化
  </Card>
  <Card title="Vantage" icon="chart" href="https://docs.vantage.sh/connecting_anthropic">
    用于 LLM 成本和使用情况可观测性的 FinOps 平台
  </Card>
</CardGroup>

## 快速开始

获取您组织过去 7 天的每日使用情况：

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **为集成设置 User-Agent 标头**
  
  如果您正在构建集成，请设置 User-Agent 标头以帮助我们了解使用情况模式：
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## 使用情况 API

使用 `/v1/organizations/usage_report/messages` 端点跟踪整个组织的令牌消耗，并按模型、工作区和服务层进行详细分解。

### 关键概念

- **时间桶：** 以固定间隔（`1m`、`1h` 或 `1d`）聚合使用情况数据
- **令牌跟踪：** 测量未缓存输入、缓存输入、缓存创建和输出令牌
- **筛选和分组：** 按 API 密钥、工作区、模型、服务层或上下文窗口进行筛选，并按这些维度对结果进行分组
- **服务器工具使用情况：** 跟踪服务器端工具（如网络搜索）的使用情况

有关完整的参数详情和响应架构，请参阅[使用情况 API 参考](/docs/zh-CN/api/admin-api/usage-cost/get-messages-usage-report)。

### 基本示例

#### 按模型的每日使用情况

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### 带筛选的每小时使用情况

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-15T00:00:00Z&\
ending_at=2025-01-15T23:59:59Z&\
models[]=claude-sonnet-4-5-20250929&\
service_tiers[]=batch&\
context_window[]=0-200k&\
bucket_width=1h" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### 按 API 密钥和工作区筛选使用情况

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
api_key_ids[]=apikey_01Rj2N8SVvo6BePZj99NhmiT&\
api_key_ids[]=apikey_01ABC123DEF456GHI789JKL&\
workspace_ids[]=wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ&\
workspace_ids[]=wrkspc_01XYZ789ABC123DEF456MNO&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
要检索您组织的 API 密钥 ID，请使用[列出 API 密钥](/docs/zh-CN/api/admin-api/apikeys/list-api-keys)端点。

要检索您组织的工作区 ID，请使用[列出工作区](/docs/zh-CN/api/admin-api/workspaces/list-workspaces)端点，或在 Anthropic 控制台中查找您组织的工作区 ID。
</Tip>

### 时间粒度限制

| 粒度 | 默认限制 | 最大限制 | 用例 |
|-------------|---------------|---------------|----------|
| `1m` | 60 个桶 | 1440 个桶 | 实时监控 |
| `1h` | 24 个桶 | 168 个桶 | 每日模式 |
| `1d` | 7 个桶 | 31 个桶 | 每周/每月报告 |

## 成本 API

使用 `/v1/organizations/cost_report` 端点检索以美元为单位的服务级成本分解。

### 关键概念

- **货币：** 所有成本以美元计，报告为最低单位（美分）的十进制字符串
- **成本类型：** 跟踪令牌使用、网络搜索和代码执行成本
- **分组：** 按工作区或描述对成本进行分组，以获得详细的分解
- **时间桶：** 仅限每日粒度（`1d`）

有关完整的参数详情和响应架构，请参阅[成本 API 参考](/docs/zh-CN/api/admin-api/usage-cost/get-cost-report)。

<Warning>
  优先级层成本使用不同的计费模式，不包括在成本端点中。通过使用端点改为跟踪优先级层使用情况。
</Warning>

### 基本示例

```bash
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## 分页

两个端点都支持大型数据集的分页：

1. 发出初始请求
2. 如果 `has_more` 为 `true`，在下一个请求中使用 `next_page` 值
3. 继续直到 `has_more` 为 `false`

```bash
# 第一个请求
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# 响应包括："has_more": true, "next_page": "page_xyz..."

# 带分页的下一个请求
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## 常见用例

在 [anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) 中探索详细的实现：

- **每日使用情况报告：** 跟踪令牌消耗趋势
- **成本归属：** 按工作区分配费用以进行成本分摊
- **缓存效率：** 测量和优化提示缓存
- **预算监控：** 为支出阈值设置警报
- **CSV 导出：** 为财务团队生成报告

## 常见问题

### 数据有多新鲜？
使用情况和成本数据通常在 API 请求完成后 5 分钟内出现，尽管延迟有时可能更长。

### 推荐的轮询频率是多少？
该 API 支持持续使用时每分钟轮询一次。对于短突发（例如，下载分页数据），更频繁的轮询是可以接受的。为需要频繁更新的仪表板缓存结果。

### 我如何跟踪代码执行使用情况？
代码执行成本出现在成本端点中，在描述字段中分组为 `Code Execution Usage`。代码执行不包括在使用端点中。

### 我如何跟踪优先级层使用情况？
在使用端点中按 `service_tier` 筛选或分组，并查找 `priority` 值。优先级层成本在成本端点中不可用。

### Workbench 使用情况会发生什么？
来自 Workbench 的 API 使用情况不与 API 密钥关联，因此即使按该维度分组，`api_key_id` 也将为 `null`。

### 默认工作区如何表示？
归属于默认工作区的使用情况和成本对 `workspace_id` 具有 `null` 值。

### 我如何获得 Claude Code 的按用户成本分解？

使用 [Claude Code 分析 API](/docs/zh-CN/build-with-claude/claude-code-analytics-api)，它提供按用户的估计成本和生产力指标，而不会出现按许多 API 密钥分解成本的性能限制。对于具有许多密钥的一般 API 使用，使用[使用情况 API](#usage-api) 跟踪令牌消耗作为成本代理。

## 另请参阅
使用情况和成本 API 可用于帮助您为用户提供更好的体验，帮助您管理成本，并保护您的速率限制。了解有关这些其他功能的更多信息：

- [管理员 API 概述](/docs/zh-CN/build-with-claude/administration-api)
- [管理员 API 参考](/docs/zh-CN/api/admin)
- [定价](/docs/zh-CN/about-claude/pricing)
- [提示缓存](/docs/zh-CN/build-with-claude/prompt-caching) - 使用缓存优化成本
- [批处理](/docs/zh-CN/build-with-claude/batch-processing) - 批量请求享受 50% 折扣
- [速率限制](/docs/zh-CN/api/rate-limits) - 了解使用层级