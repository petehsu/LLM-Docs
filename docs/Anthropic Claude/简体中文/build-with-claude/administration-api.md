# Admin API 概览

Admin API 允许您以编程方式管理组织的资源，包括组织成员、工作区和 API 密钥。

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

[Admin API](/docs/zh-CN/api/admin) 允许您以编程方式管理组织的资源，包括组织成员、工作区和 API 密钥。这提供了对管理任务的编程控制，否则需要在 [Claude 控制台](/) 中进行手动配置。

<Check>
  **Admin API 需要特殊访问权限**

  Admin API 需要特殊的 Admin API 密钥（以 `sk-ant-admin...` 开头），与标准 API 密钥不同。只有具有管理员角色的组织成员才能通过 Claude 控制台配置 Admin API 密钥。
</Check>

## Admin API 如何工作

使用 Admin API 时：

1. 您使用 Admin API 密钥在 `x-api-key` 标头中发出请求
2. API 允许您管理：
   - 组织成员及其角色
   - 组织成员邀请
   - 工作区及其成员
   - API 密钥

这对以下情况很有用：
- 自动化用户入职/离职
- 以编程方式管理工作区访问权限
- 监控和管理 API 密钥使用情况

## 组织角色和权限

有五个组织级角色。查看更多详情 [此处](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions)。

| 角色 | 权限 |
|------|-------------|
| user | 可以使用 Workbench |
| claude_code_user | 可以使用 Workbench 和 [Claude Code](https://code.claude.com/docs/en/overview) |
| developer | 可以使用 Workbench 和管理 API 密钥 |
| billing | 可以使用 Workbench 和管理账单详情 |
| admin | 可以执行上述所有操作，加上管理用户 |

## 关键概念

### 组织成员

您可以列出 [组织成员](/docs/zh-CN/api/admin-api/users/get-user)、更新成员角色和删除成员。

<CodeGroup>
```bash Shell
# 列出组织成员
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 更新成员角色
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# 删除成员
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### 组织邀请

您可以邀请用户加入组织并管理这些 [邀请](/docs/zh-CN/api/admin-api/invites/get-invite)。

<CodeGroup>

```bash Shell
# 创建邀请
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "newuser@domain.com",
    "role": "developer"
  }'

# 列出邀请
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 删除邀请
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### 工作区

创建和管理 [工作区](/docs/zh-CN/api/admin-api/workspaces/get-workspace)（[控制台](/settings/workspaces)）来组织您的资源：

<CodeGroup>

```bash Shell
# 创建工作区
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# 列出工作区
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 归档工作区
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### 工作区成员

管理 [用户对特定工作区的访问权限](/docs/zh-CN/api/admin-api/workspace_members/get-workspace-member)：

<CodeGroup>

```bash Shell
# 将成员添加到工作区
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# 列出工作区成员
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 更新成员角色
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# 从工作区删除成员
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### API 密钥

监控和管理 [API 密钥](/docs/zh-CN/api/admin-api/apikeys/get-api-key)：

<CodeGroup>

```bash Shell
# 列出 API 密钥
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 更新 API 密钥
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

</CodeGroup>

## 访问组织信息

使用 `/v1/organizations/me` 端点以编程方式获取有关您的组织的信息。

例如：

```bash
curl "https://api.anthropic.com/v1/organizations/me" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

```json
{
  "id": "12345678-1234-5678-1234-567812345678",
  "type": "organization",
  "name": "Organization Name"
}
```

此端点对于以编程方式确定 Admin API 密钥属于哪个组织很有用。

有关完整的参数详情和响应架构，请参阅 [组织信息 API 参考](/docs/zh-CN/api/admin-api/organization/get-me)。

## 访问使用情况和成本报告

要访问您的组织的使用情况和成本报告，请使用使用情况和成本 API 端点：

- [**使用情况端点**](/docs/zh-CN/build-with-claude/usage-cost-api#usage-api)（`/v1/organizations/usage_report/messages`）提供详细的使用数据，包括令牌计数和请求指标，按各种维度（如工作区、用户和模型）分组。
- [**成本端点**](/docs/zh-CN/build-with-claude/usage-cost-api#cost-api)（`/v1/organizations/cost_report`）提供与您的组织使用情况相关的成本数据，允许您跟踪支出并按工作区或描述分配成本。

这些端点提供了对您的组织使用情况和相关成本的详细见解。

## 访问 Claude Code 分析

对于使用 Claude Code 的组织，[**Claude Code 分析 API**](/docs/zh-CN/build-with-claude/claude-code-analytics-api) 提供详细的生产力指标和使用见解：

- [**Claude Code 分析端点**](/docs/zh-CN/build-with-claude/claude-code-analytics-api)（`/v1/organizations/usage_report/claude_code`）提供 Claude Code 使用情况的每日聚合指标，包括会话、代码行数、提交、拉取请求、工具使用统计和按用户和模型分解的成本数据。

此 API 使您能够跟踪开发人员生产力、分析 Claude Code 采用情况，并为您的组织构建自定义仪表板。

## 最佳实践

要有效使用 Admin API：

- 为工作区和 API 密钥使用有意义的名称和描述
- 为失败的操作实施适当的错误处理
- 定期审计成员角色和权限
- 清理未使用的工作区和过期的邀请
- 监控 API 密钥使用情况并定期轮换密钥

## 常见问题

<section title="使用 Admin API 需要什么权限？">

只有具有管理员角色的组织成员才能使用 Admin API。他们还必须拥有特殊的 Admin API 密钥（以 `sk-ant-admin` 开头）。

</section>

<section title="我可以通过 Admin API 创建新的 API 密钥吗？">

不可以，出于安全原因，新的 API 密钥只能通过 Claude 控制台创建。Admin API 只能管理现有的 API 密钥。

</section>

<section title="删除用户时 API 密钥会发生什么？">

API 密钥保持其当前状态，因为它们的范围是组织级别，而不是针对个人用户。

</section>

<section title="可以通过 API 删除组织管理员吗？">

不可以，出于安全原因，具有管理员角色的组织成员无法通过 API 删除。

</section>

<section title="组织邀请持续多长时间？">

组织邀请在 21 天后过期。目前没有办法修改此过期期限。

</section>

<section title="工作区有限制吗？">

是的，每个组织最多可以有 100 个工作区。已归档的工作区不计入此限制。

</section>

<section title="什么是默认工作区？">

每个组织都有一个"默认工作区"，无法编辑或删除，也没有 ID。此工作区不会出现在工作区列表端点中。

</section>

<section title="组织角色如何影响工作区访问？">

组织管理员自动获得所有工作区的 `workspace_admin` 角色。组织账单成员自动获得 `workspace_billing` 角色。组织用户和开发人员必须手动添加到每个工作区。

</section>

<section title="哪些角色可以在工作区中分配？">

组织用户和开发人员可以被分配 `workspace_admin`、`workspace_developer` 或 `workspace_user` 角色。`workspace_billing` 角色无法手动分配 - 它是从具有组织 `billing` 角色继承的。

</section>

<section title="可以更改组织管理员或账单成员的工作区角色吗？">

只有组织账单成员可以将其工作区角色升级为管理员角色。否则，组织管理员和账单成员在持有这些组织角色时无法更改其工作区角色或从工作区中删除。他们的工作区访问权限必须通过首先更改其组织角色来修改。

</section>

<section title="组织角色更改时工作区访问权限会发生什么？">

如果组织管理员或账单成员被降级为用户或开发人员，他们将失去对所有工作区的访问权限，除了他们被手动分配角色的工作区。当用户被提升为管理员或账单角色时，他们会自动获得对所有工作区的访问权限。

</section>