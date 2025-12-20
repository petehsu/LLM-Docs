# Admin API 개요

Admin API를 사용하여 조직의 리소스를 프로그래밍 방식으로 관리하는 방법을 알아봅니다.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

[Admin API](/docs/ko/api/admin)를 사용하면 조직의 리소스(조직 구성원, 워크스페이스, API 키 등)를 프로그래밍 방식으로 관리할 수 있습니다. 이를 통해 [Claude Console](/)에서 수동으로 구성해야 하는 관리 작업을 프로그래밍 방식으로 제어할 수 있습니다.

<Check>
  **Admin API는 특별한 액세스가 필요합니다**

  Admin API는 표준 API 키와 다른 특별한 Admin API 키(`sk-ant-admin...`로 시작)가 필요합니다. 관리자 역할을 가진 조직 구성원만 Claude Console을 통해 Admin API 키를 프로비저닝할 수 있습니다.
</Check>

## Admin API의 작동 방식

Admin API를 사용할 때:

1. `x-api-key` 헤더에 Admin API 키를 사용하여 요청을 합니다
2. API를 통해 다음을 관리할 수 있습니다:
   - 조직 구성원 및 역할
   - 조직 구성원 초대
   - 워크스페이스 및 구성원
   - API 키

이는 다음과 같은 경우에 유용합니다:
- 사용자 온보딩/오프보딩 자동화
- 워크스페이스 액세스 프로그래밍 방식 관리
- API 키 사용량 모니터링 및 관리

## 조직 역할 및 권한

5가지 조직 수준 역할이 있습니다. 자세한 내용은 [여기](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions)를 참조하세요.

| 역할 | 권한 |
|------|-------------|
| user | Workbench 사용 가능 |
| claude_code_user | Workbench 및 [Claude Code](https://code.claude.com/docs/en/overview) 사용 가능 |
| developer | Workbench 사용 및 API 키 관리 가능 |
| billing | Workbench 사용 및 청구 세부 정보 관리 가능 |
| admin | 위의 모든 작업 수행 가능, 추가로 사용자 관리 가능 |

## 주요 개념

### 조직 구성원

[조직 구성원](/docs/ko/api/admin-api/users/get-user)을 나열하고, 구성원 역할을 업데이트하고, 구성원을 제거할 수 있습니다.

<CodeGroup>
```bash Shell
# 조직 구성원 나열
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 구성원 역할 업데이트
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# 구성원 제거
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### 조직 초대

사용자를 조직에 초대하고 해당 [초대](/docs/ko/api/admin-api/invites/get-invite)를 관리할 수 있습니다.

<CodeGroup>

```bash Shell
# 초대 생성
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "newuser@domain.com",
    "role": "developer"
  }'

# 초대 나열
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 초대 삭제
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### 워크스페이스

[워크스페이스](/docs/ko/api/admin-api/workspaces/get-workspace) ([콘솔](/settings/workspaces))를 생성하고 관리하여 리소스를 구성합니다:

<CodeGroup>

```bash Shell
# 워크스페이스 생성
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# 워크스페이스 나열
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 워크스페이스 보관
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### 워크스페이스 구성원

[특정 워크스페이스에 대한 사용자 액세스](/docs/ko/api/admin-api/workspace_members/get-workspace-member)를 관리합니다:

<CodeGroup>

```bash Shell
# 워크스페이스에 구성원 추가
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# 워크스페이스 구성원 나열
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# 구성원 역할 업데이트
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# 워크스페이스에서 구성원 제거
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### API 키

[API 키](/docs/ko/api/admin-api/apikeys/get-api-key)를 모니터링하고 관리합니다:

<CodeGroup>

```bash Shell
# API 키 나열
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# API 키 업데이트
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

</CodeGroup>

## 조직 정보 액세스

`/v1/organizations/me` 엔드포인트를 사용하여 조직 정보를 프로그래밍 방식으로 가져옵니다.

예를 들어:

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

이 엔드포인트는 Admin API 키가 속한 조직을 프로그래밍 방식으로 확인하는 데 유용합니다.

전체 매개변수 세부 정보 및 응답 스키마는 [조직 정보 API 참조](/docs/ko/api/admin-api/organization/get-me)를 참조하세요.

## 사용량 및 비용 보고서 액세스

조직의 사용량 및 비용 보고서에 액세스하려면 사용량 및 비용 API 엔드포인트를 사용합니다:

- [**사용량 엔드포인트**](/docs/ko/build-with-claude/usage-cost-api#usage-api) (`/v1/organizations/usage_report/messages`)는 토큰 수 및 요청 메트릭을 포함한 상세 사용량 데이터를 제공하며, 워크스페이스, 사용자, 모델 등 다양한 차원으로 그룹화됩니다.
- [**비용 엔드포인트**](/docs/ko/build-with-claude/usage-cost-api#cost-api) (`/v1/organizations/cost_report`)는 조직의 사용량과 관련된 비용 데이터를 제공하여 비용을 추적하고 워크스페이스 또는 설명별로 비용을 할당할 수 있습니다.

이러한 엔드포인트는 조직의 사용량 및 관련 비용에 대한 상세한 통찰력을 제공합니다.

## Claude Code 분석 액세스

Claude Code를 사용하는 조직의 경우, [**Claude Code 분석 API**](/docs/ko/build-with-claude/claude-code-analytics-api)는 상세한 생산성 메트릭 및 사용량 통찰력을 제공합니다:

- [**Claude Code 분석 엔드포인트**](/docs/ko/build-with-claude/claude-code-analytics-api) (`/v1/organizations/usage_report/claude_code`)는 Claude Code 사용량에 대한 일일 집계 메트릭을 제공하며, 세션, 코드 라인, 커밋, 풀 요청, 도구 사용 통계, 사용자 및 모델별로 분류된 비용 데이터를 포함합니다.

이 API를 통해 개발자 생산성을 추적하고, Claude Code 채택을 분석하고, 조직을 위한 사용자 정의 대시보드를 구축할 수 있습니다.

## 모범 사례

Admin API를 효과적으로 사용하려면:

- 워크스페이스 및 API 키에 의미 있는 이름과 설명을 사용합니다
- 실패한 작업에 대한 적절한 오류 처리를 구현합니다
- 정기적으로 구성원 역할 및 권한을 감사합니다
- 사용하지 않는 워크스페이스 및 만료된 초대를 정리합니다
- API 키 사용량을 모니터링하고 주기적으로 키를 회전합니다

## FAQ

<section title="Admin API를 사용하려면 어떤 권한이 필요합니까?">

관리자 역할을 가진 조직 구성원만 Admin API를 사용할 수 있습니다. 또한 특별한 Admin API 키(`sk-ant-admin`로 시작)가 있어야 합니다.

</section>

<section title="Admin API를 통해 새 API 키를 생성할 수 있습니까?">

아니요, 새 API 키는 보안상의 이유로 Claude Console을 통해서만 생성할 수 있습니다. Admin API는 기존 API 키만 관리할 수 있습니다.

</section>

<section title="사용자를 제거할 때 API 키는 어떻게 됩니까?">

API 키는 조직에 범위가 지정되어 있고 개별 사용자에게 범위가 지정되지 않으므로 현재 상태로 유지됩니다.

</section>

<section title="조직 관리자를 API를 통해 제거할 수 있습니까?">

아니요, 보안상의 이유로 관리자 역할을 가진 조직 구성원은 API를 통해 제거할 수 없습니다.

</section>

<section title="조직 초대는 얼마나 오래 지속됩니까?">

조직 초대는 21일 후에 만료됩니다. 현재 이 만료 기간을 수정할 방법이 없습니다.

</section>

<section title="워크스페이스에 제한이 있습니까?">

예, 조직당 최대 100개의 워크스페이스를 가질 수 있습니다. 보관된 워크스페이스는 이 제한에 포함되지 않습니다.

</section>

<section title="기본 워크스페이스란 무엇입니까?">

모든 조직에는 편집하거나 제거할 수 없으며 ID가 없는 "기본 워크스페이스"가 있습니다. 이 워크스페이스는 워크스페이스 목록 엔드포인트에 나타나지 않습니다.

</section>

<section title="조직 역할이 워크스페이스 액세스에 어떻게 영향을 미칩니까?">

조직 관리자는 모든 워크스페이스에 자동으로 `workspace_admin` 역할을 얻습니다. 조직 청구 구성원은 자동으로 `workspace_billing` 역할을 얻습니다. 조직 사용자 및 개발자는 각 워크스페이스에 수동으로 추가되어야 합니다.

</section>

<section title="워크스페이스에서 할당할 수 있는 역할은 무엇입니까?">

조직 사용자 및 개발자는 `workspace_admin`, `workspace_developer` 또는 `workspace_user` 역할을 할당받을 수 있습니다. `workspace_billing` 역할은 수동으로 할당할 수 없으며, 조직 `billing` 역할을 가지면 자동으로 상속됩니다.

</section>

<section title="조직 관리자 또는 청구 구성원의 워크스페이스 역할을 변경할 수 있습니까?">

조직 청구 구성원만 워크스페이스 역할을 관리자 역할로 업그레이드할 수 있습니다. 그 외에는 조직 관리자 및 청구 구성원이 해당 조직 역할을 유지하는 동안 워크스페이스 역할을 변경하거나 워크스페이스에서 제거될 수 없습니다. 워크스페이스 액세스는 먼저 조직 역할을 변경하여 수정해야 합니다.

</section>

<section title="조직 역할이 변경될 때 워크스페이스 액세스는 어떻게 됩니까?">

조직 관리자 또는 청구 구성원이 사용자 또는 개발자로 강등되면, 수동으로 역할이 할당된 워크스페이스를 제외한 모든 워크스페이스에 대한 액세스 권한을 잃습니다. 사용자가 관리자 또는 청구 역할로 승격되면, 모든 워크스페이스에 자동으로 액세스할 수 있습니다.

</section>