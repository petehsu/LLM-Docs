# Admin API 概覽

Admin API 允許您以程式方式管理組織的資源，包括組織成員、工作區和 API 金鑰。

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

[Admin API](/docs/zh-TW/api/admin) 允許您以程式方式管理組織的資源，包括組織成員、工作區和 API 金鑰。這提供了對管理任務的程式控制，否則需要在 [Claude Console](/) 中進行手動配置。

<Check>
  **Admin API 需要特殊存取權限**

  Admin API 需要特殊的 Admin API 金鑰（以 `sk-ant-admin...` 開頭），與標準 API 金鑰不同。只有具有管理員角色的組織成員才能透過 Claude Console 配置 Admin API 金鑰。
</Check>

## Admin API 如何運作

當您使用 Admin API 時：

1. 您在 `x-api-key` 標頭中使用您的 Admin API 金鑰發出請求
2. API 允許您管理：
   - 組織成員及其角色
   - 組織成員邀請
   - 工作區及其成員
   - API 金鑰

這對以下情況很有用：
- 自動化使用者上線/離線
- 以程式方式管理工作區存取
- 監控和管理 API 金鑰使用情況

## 組織角色和權限

有五個組織級別的角色。查看更多詳情 [此處](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions)。

| 角色 | 權限 |
|------|-------------|
| user | 可以使用 Workbench |
| claude_code_user | 可以使用 Workbench 和 [Claude Code](https://code.claude.com/docs/en/overview) |
| developer | 可以使用 Workbench 和管理 API 金鑰 |
| billing | 可以使用 Workbench 和管理帳單詳情 |
| admin | 可以執行上述所有操作，加上管理使用者 |

## 關鍵概念

### 組織成員

您可以列出 [組織成員](/docs/zh-TW/api/admin-api/users/get-user)、更新成員角色和移除成員。

<CodeGroup>
```bash Shell
# 列出組織成員
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 更新成員角色
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# 移除成員
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### 組織邀請

您可以邀請使用者加入組織並管理這些 [邀請](/docs/zh-TW/api/admin-api/invites/get-invite)。

<CodeGroup>

```bash Shell
# 建立邀請
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "newuser@domain.com",
    "role": "developer"
  }'

# 列出邀請
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 刪除邀請
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### 工作區

建立和管理 [工作區](/docs/zh-TW/api/admin-api/workspaces/get-workspace)（[主控台](/settings/workspaces)）以組織您的資源：

<CodeGroup>

```bash Shell
# 建立工作區
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# 列出工作區
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 封存工作區
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### 工作區成員

管理 [使用者對特定工作區的存取](/docs/zh-TW/api/admin-api/workspace_members/get-workspace-member)：

<CodeGroup>

```bash Shell
# 將成員新增到工作區
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# 列出工作區成員
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 更新成員角色
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# 從工作區移除成員
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### API 金鑰

監控和管理 [API 金鑰](/docs/zh-TW/api/admin-api/apikeys/get-api-key)：

<CodeGroup>

```bash Shell
# 列出 API 金鑰
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 更新 API 金鑰
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

</CodeGroup>

## 存取組織資訊

使用 `/v1/organizations/me` 端點以程式方式取得有關您的組織的資訊。

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

此端點對於以程式方式確定 Admin API 金鑰所屬的組織很有用。

如需完整的參數詳情和回應架構，請參閱 [組織資訊 API 參考](/docs/zh-TW/api/admin-api/organization/get-me)。

## 存取使用情況和成本報告

若要存取組織的使用情況和成本報告，請使用使用情況和成本 API 端點：

- [**使用情況端點**](/docs/zh-TW/build-with-claude/usage-cost-api#usage-api)（`/v1/organizations/usage_report/messages`）提供詳細的使用情況資料，包括權杖計數和請求指標，按工作區、使用者和模型等各種維度分組。
- [**成本端點**](/docs/zh-TW/build-with-claude/usage-cost-api#cost-api)（`/v1/organizations/cost_report`）提供與組織使用情況相關的成本資料，允許您追蹤支出並按工作區或描述分配成本。

這些端點提供了對組織使用情況和相關成本的詳細見解。

## 存取 Claude Code 分析

對於使用 Claude Code 的組織，[**Claude Code 分析 API**](/docs/zh-TW/build-with-claude/claude-code-analytics-api) 提供詳細的生產力指標和使用見解：

- [**Claude Code 分析端點**](/docs/zh-TW/build-with-claude/claude-code-analytics-api)（`/v1/organizations/usage_report/claude_code`）提供 Claude Code 使用情況的每日彙總指標，包括工作階段、程式碼行數、提交、拉取請求、工具使用統計資料，以及按使用者和模型細分的成本資料。

此 API 使您能夠追蹤開發人員生產力、分析 Claude Code 採用情況，以及為組織建立自訂儀表板。

## 最佳實踐

若要有效使用 Admin API：

- 為工作區和 API 金鑰使用有意義的名稱和描述
- 為失敗的操作實施適當的錯誤處理
- 定期審計成員角色和權限
- 清理未使用的工作區和過期的邀請
- 監控 API 金鑰使用情況並定期輪換金鑰

## 常見問題

<section title="使用 Admin API 需要什麼權限？">

只有具有管理員角色的組織成員才能使用 Admin API。他們還必須擁有特殊的 Admin API 金鑰（以 `sk-ant-admin` 開頭）。

</section>

<section title="我可以透過 Admin API 建立新的 API 金鑰嗎？">

不可以，出於安全原因，新的 API 金鑰只能透過 Claude Console 建立。Admin API 只能管理現有的 API 金鑰。

</section>

<section title="移除使用者時，API 金鑰會發生什麼？">

API 金鑰會以其目前狀態保留，因為它們的範圍是組織，而不是個別使用者。

</section>

<section title="可以透過 API 移除組織管理員嗎？">

不可以，出於安全原因，具有管理員角色的組織成員無法透過 API 移除。

</section>

<section title="組織邀請的有效期有多長？">

組織邀請在 21 天後過期。目前沒有辦法修改此過期期限。

</section>

<section title="工作區有限制嗎？">

是的，每個組織最多可以有 100 個工作區。封存的工作區不計入此限制。

</section>

<section title="什麼是預設工作區？">

每個組織都有一個「預設工作區」，無法編輯或移除，也沒有 ID。此工作區不會出現在工作區列表端點中。

</section>

<section title="組織角色如何影響工作區存取？">

組織管理員自動獲得所有工作區的 `workspace_admin` 角色。組織帳單成員自動獲得 `workspace_billing` 角色。組織使用者和開發人員必須手動新增到每個工作區。

</section>

<section title="哪些角色可以在工作區中指派？">

組織使用者和開發人員可以被指派 `workspace_admin`、`workspace_developer` 或 `workspace_user` 角色。`workspace_billing` 角色無法手動指派 - 它是從具有組織 `billing` 角色繼承的。

</section>

<section title="可以更改組織管理員或帳單成員的工作區角色嗎？">

只有組織帳單成員可以將其工作區角色升級為管理員角色。否則，組織管理員和帳單成員在持有這些組織角色時無法更改其工作區角色或從工作區中移除。他們的工作區存取必須透過先更改其組織角色來修改。

</section>

<section title="組織角色變更時，工作區存取會發生什麼？">

如果組織管理員或帳單成員被降級為使用者或開發人員，他們將失去對所有工作區的存取權，除了他們被手動指派角色的工作區。當使用者被提升為管理員或帳單角色時，他們會自動獲得對所有工作區的存取權。

</section>