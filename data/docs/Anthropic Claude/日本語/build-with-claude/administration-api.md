# Admin API 概要

Admin API を使用して、組織のリソース、メンバー、ワークスペース、API キーをプログラムで管理します。

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

[Admin API](/docs/ja/api/admin) を使用すると、組織のリソース（組織メンバー、ワークスペース、API キーなど）をプログラムで管理できます。これにより、[Claude Console](/) で手動設定が必要な管理タスクをプログラムで制御できます。

<Check>
  **Admin API には特別なアクセスが必要です**

  Admin API には、標準 API キーとは異なる特別な Admin API キー（`sk-ant-admin...` で始まる）が必要です。Admin API キーをプロビジョニングできるのは、Claude Console を通じて管理者ロールを持つ組織メンバーのみです。
</Check>

## Admin API の仕組み

Admin API を使用する場合：

1. `x-api-key` ヘッダーで Admin API キーを使用してリクエストを行います
2. API を使用して以下を管理できます：
   - 組織メンバーとそのロール
   - 組織メンバーの招待
   - ワークスペースとそのメンバー
   - API キー

これは以下の場合に便利です：
- ユーザーのオンボーディング/オフボーディングの自動化
- ワークスペース アクセスのプログラムによる管理
- API キーの使用状況の監視と管理

## 組織ロールと権限

5 つの組織レベルのロールがあります。詳細は[こちら](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions)を参照してください。

| ロール | 権限 |
|------|-------------|
| user | Workbench を使用できます |
| claude_code_user | Workbench と [Claude Code](https://code.claude.com/docs/en/overview) を使用できます |
| developer | Workbench を使用し、API キーを管理できます |
| billing | Workbench を使用し、請求詳細を管理できます |
| admin | 上記すべてに加えて、ユーザーを管理できます |

## 主要な概念

### 組織メンバー

[組織メンバー](/docs/ja/api/admin-api/users/get-user)をリストアップし、メンバーロールを更新し、メンバーを削除できます。

<CodeGroup>
```bash Shell
# 組織メンバーをリストアップ
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# メンバーロールを更新
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# メンバーを削除
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### 組織招待

ユーザーを組織に招待し、それらの[招待](/docs/ja/api/admin-api/invites/get-invite)を管理できます。

<CodeGroup>

```bash Shell
# 招待を作成
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "newuser@domain.com",
    "role": "developer"
  }'

# 招待をリストアップ
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 招待を削除
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### ワークスペース

[ワークスペース](/docs/ja/api/admin-api/workspaces/get-workspace)（[コンソール](/settings/workspaces)）を作成および管理して、リソースを整理します：

<CodeGroup>

```bash Shell
# ワークスペースを作成
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# ワークスペースをリストアップ
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# ワークスペースをアーカイブ
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### ワークスペース メンバー

[特定のワークスペースへのユーザー アクセス](/docs/ja/api/admin-api/workspace_members/get-workspace-member)を管理します：

<CodeGroup>

```bash Shell
# ワークスペースにメンバーを追加
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# ワークスペース メンバーをリストアップ
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# メンバーロールを更新
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# ワークスペースからメンバーを削除
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### API キー

[API キー](/docs/ja/api/admin-api/apikeys/get-api-key)を監視および管理します：

<CodeGroup>

```bash Shell
# API キーをリストアップ
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# API キーを更新
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

</CodeGroup>

## 組織情報へのアクセス

`/v1/organizations/me` エンドポイントを使用して、組織に関する情報をプログラムで取得します。

例：

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

このエンドポイントは、Admin API キーがどの組織に属しているかをプログラムで判定するのに便利です。

完全なパラメータの詳細とレスポンス スキーマについては、[Organization Info API リファレンス](/docs/ja/api/admin-api/organization/get-me)を参照してください。

## 使用状況とコスト レポートへのアクセス

組織の使用状況とコスト レポートにアクセスするには、Usage and Cost API エンドポイントを使用します：

- [**Usage エンドポイント**](/docs/ja/build-with-claude/usage-cost-api#usage-api)（`/v1/organizations/usage_report/messages`）は、トークン数とリクエスト メトリクスを含む詳細な使用状況データを提供し、ワークスペース、ユーザー、モデルなどのさまざまなディメンションでグループ化されています。
- [**Cost エンドポイント**](/docs/ja/build-with-claude/usage-cost-api#cost-api)（`/v1/organizations/cost_report`）は、組織の使用状況に関連するコスト データを提供し、ワークスペースまたは説明別にコストを追跡および配分できます。

これらのエンドポイントは、組織の使用状況と関連するコストに関する詳細な洞察を提供します。

## Claude Code 分析へのアクセス

Claude Code を使用している組織の場合、[**Claude Code Analytics API**](/docs/ja/build-with-claude/claude-code-analytics-api) は詳細な生産性メトリクスと使用状況の洞察を提供します：

- [**Claude Code Analytics エンドポイント**](/docs/ja/build-with-claude/claude-code-analytics-api)（`/v1/organizations/usage_report/claude_code`）は、Claude Code の使用状況に関する日次集計メトリクスを提供します。これには、セッション、コード行数、コミット、プル リクエスト、ツール使用統計、およびユーザーとモデル別に分類されたコスト データが含まれます。

この API により、開発者の生産性を追跡し、Claude Code の採用を分析し、組織向けのカスタム ダッシュボードを構築できます。

## ベスト プラクティス

Admin API を効果的に使用するには：

- ワークスペースと API キーに意味のある名前と説明を使用する
- 失敗した操作に対して適切なエラー処理を実装する
- メンバーロールと権限を定期的に監査する
- 未使用のワークスペースと期限切れの招待をクリーンアップする
- API キーの使用状況を監視し、定期的にキーをローテーションする

## FAQ

<section title="Admin API を使用するにはどのような権限が必要ですか？">

Admin API を使用できるのは、管理者ロールを持つ組織メンバーのみです。また、特別な Admin API キー（`sk-ant-admin` で始まる）も必要です。

</section>

<section title="Admin API を通じて新しい API キーを作成できますか？">

いいえ、新しい API キーはセキュリティ上の理由から Claude Console を通じてのみ作成できます。Admin API は既存の API キーのみを管理できます。

</section>

<section title="ユーザーを削除するとどうなりますか？">

API キーは、組織にスコープされているため（個々のユーザーではなく）、現在の状態で保持されます。

</section>

<section title="組織管理者を API 経由で削除できますか？">

いいえ、セキュリティ上の理由から、管理者ロールを持つ組織メンバーは API 経由で削除できません。

</section>

<section title="組織招待はどのくらい有効ですか？">

組織招待は 21 日後に期限切れになります。現在、この有効期限を変更する方法はありません。

</section>

<section title="ワークスペースに制限はありますか？">

はい、組織あたり最大 100 個のワークスペースを持つことができます。アーカイブされたワークスペースはこの制限にカウントされません。

</section>

<section title="デフォルト ワークスペースとは何ですか？">

すべての組織には「デフォルト ワークスペース」があり、編集または削除できず、ID がありません。このワークスペースはワークスペース リスト エンドポイントに表示されません。

</section>

<section title="組織ロールはワークスペース アクセスにどのように影響しますか？">

組織管理者は自動的にすべてのワークスペースに `workspace_admin` ロールを取得します。組織請求メンバーは自動的に `workspace_billing` ロールを取得します。組織ユーザーと開発者は各ワークスペースに手動で追加する必要があります。

</section>

<section title="ワークスペースで割り当てることができるロールはどれですか？">

組織ユーザーと開発者には、`workspace_admin`、`workspace_developer`、または `workspace_user` ロールを割り当てることができます。`workspace_billing` ロールは手動で割り当てることはできません。これは組織の `billing` ロールを持つことから継承されます。

</section>

<section title="組織管理者または請求メンバーのワークスペース ロールを変更できますか？">

組織請求メンバーのみが、ワークスペース ロールを管理者ロールにアップグレードできます。それ以外の場合、組織管理者と請求メンバーは、それらの組織ロールを保持している間、ワークスペース ロールを変更したり、ワークスペースから削除したりすることはできません。ワークスペース アクセスは、最初に組織ロールを変更することで変更する必要があります。

</section>

<section title="組織ロールが変更されるとワークスペース アクセスはどうなりますか？">

組織管理者または請求メンバーがユーザーまたは開発者に降格された場合、手動でロールが割り当てられたワークスペースを除くすべてのワークスペースへのアクセスが失われます。ユーザーが管理者または請求ロールに昇格された場合、すべてのワークスペースへの自動アクセスが得られます。

</section>