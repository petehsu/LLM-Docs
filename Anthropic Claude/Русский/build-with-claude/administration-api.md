# Обзор Admin API

Управляйте ресурсами вашей организации программным способом с помощью Admin API, включая членов организации, рабочие пространства и ключи API.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

[Admin API](/docs/ru/api/admin) позволяет вам программным способом управлять ресурсами вашей организации, включая членов организации, рабочие пространства и ключи API. Это обеспечивает программный контроль над административными задачами, которые в противном случае потребовали бы ручной настройки в [Claude Console](/).

<Check>
  **Admin API требует специального доступа**

  Admin API требует специального ключа Admin API (начинающегося с `sk-ant-admin...`), который отличается от стандартных ключей API. Только члены организации с ролью администратора могут создавать ключи Admin API через Claude Console.
</Check>

## Как работает Admin API

Когда вы используете Admin API:

1. Вы делаете запросы, используя ваш ключ Admin API в заголовке `x-api-key`
2. API позволяет вам управлять:
   - Членами организации и их ролями
   - Приглашениями членов организации
   - Рабочими пространствами и их членами
   - Ключами API

Это полезно для:
- Автоматизации подключения/отключения пользователей
- Программного управления доступом к рабочему пространству
- Мониторинга и управления использованием ключей API

## Роли и разрешения организации

Существует пять ролей на уровне организации. Дополнительные сведения см. [здесь](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions).

| Роль | Разрешения |
|------|-------------|
| user | Может использовать Workbench |
| claude_code_user | Может использовать Workbench и [Claude Code](https://code.claude.com/docs/en/overview) |
| developer | Может использовать Workbench и управлять ключами API |
| billing | Может использовать Workbench и управлять деталями выставления счетов |
| admin | Может делать все вышеперечисленное, плюс управлять пользователями |

## Ключевые концепции

### Члены организации

Вы можете [перечислить членов организации](/docs/ru/api/admin-api/users/get-user), обновить роли членов и удалить членов.

<CodeGroup>
```bash Shell
# Перечислить членов организации
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Обновить роль члена
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# Удалить члена
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Приглашения организации

Вы можете приглашать пользователей в организации и управлять этими [приглашениями](/docs/ru/api/admin-api/invites/get-invite).

<CodeGroup>

```bash Shell
# Создать приглашение
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "newuser@domain.com",
    "role": "developer"
  }'

# Перечислить приглашения
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Удалить приглашение
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Рабочие пространства

Создавайте и управляйте [рабочими пространствами](/docs/ru/api/admin-api/workspaces/get-workspace) ([консоль](/settings/workspaces)) для организации ваших ресурсов:

<CodeGroup>

```bash Shell
# Создать рабочее пространство
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# Перечислить рабочие пространства
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Архивировать рабочее пространство
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Члены рабочего пространства

Управляйте [доступом пользователей к определенным рабочим пространствам](/docs/ru/api/admin-api/workspace_members/get-workspace-member):

<CodeGroup>

```bash Shell
# Добавить члена в рабочее пространство
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# Перечислить членов рабочего пространства
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Обновить роль члена
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# Удалить члена из рабочего пространства
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Ключи API

Мониторьте и управляйте [ключами API](/docs/ru/api/admin-api/apikeys/get-api-key):

<CodeGroup>

```bash Shell
# Перечислить ключи API
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Обновить ключ API
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

</CodeGroup>

## Доступ к информации об организации

Получайте информацию об организации программным способом с помощью конечной точки `/v1/organizations/me`.

Например:

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

Эта конечная точка полезна для программного определения того, какой организации принадлежит ключ Admin API.

Для полных сведений о параметрах и схемах ответов см. [справочник API информации об организации](/docs/ru/api/admin-api/organization/get-me).

## Доступ к отчетам об использовании и затратах

Для доступа к отчетам об использовании и затратах вашей организации используйте конечные точки API использования и затрат:

- [**Конечная точка использования**](/docs/ru/build-with-claude/usage-cost-api#usage-api) (`/v1/organizations/usage_report/messages`) предоставляет подробные данные об использовании, включая количество токенов и метрики запросов, сгруппированные по различным измерениям, таким как рабочее пространство, пользователь и модель.
- [**Конечная точка затрат**](/docs/ru/build-with-claude/usage-cost-api#cost-api) (`/v1/organizations/cost_report`) предоставляет данные о затратах, связанные с использованием вашей организацией, позволяя вам отслеживать расходы и распределять затраты по рабочему пространству или описанию.

Эти конечные точки предоставляют подробные сведения об использовании вашей организацией и связанных затратах.

## Доступ к аналитике Claude Code

Для организаций, использующих Claude Code, [**API аналитики Claude Code**](/docs/ru/build-with-claude/claude-code-analytics-api) предоставляет подробные метрики производительности и сведения об использовании:

- [**Конечная точка аналитики Claude Code**](/docs/ru/build-with-claude/claude-code-analytics-api) (`/v1/organizations/usage_report/claude_code`) предоставляет ежедневные агрегированные метрики для использования Claude Code, включая сеансы, строки кода, коммиты, запросы на вытягивание, статистику использования инструментов и данные о затратах, разбитые по пользователям и моделям.

Этот API позволяет вам отслеживать производительность разработчиков, анализировать внедрение Claude Code и создавать пользовательские панели мониторинга для вашей организации.

## Лучшие практики

Для эффективного использования Admin API:

- Используйте значимые имена и описания для рабочих пространств и ключей API
- Реализуйте надлежащую обработку ошибок для неудачных операций
- Регулярно проверяйте роли и разрешения членов
- Очищайте неиспользуемые рабочие пространства и истекшие приглашения
- Мониторьте использование ключей API и периодически ротируйте ключи

## Часто задаваемые вопросы

<section title="Какие разрешения необходимы для использования Admin API?">

Только члены организации с ролью администратора могут использовать Admin API. Они также должны иметь специальный ключ Admin API (начинающийся с `sk-ant-admin`).

</section>

<section title="Могу ли я создавать новые ключи API через Admin API?">

Нет, новые ключи API можно создавать только через Claude Console по соображениям безопасности. Admin API может только управлять существующими ключами API.

</section>

<section title="Что происходит с ключами API при удалении пользователя?">

Ключи API сохраняются в своем текущем состоянии, так как они привязаны к организации, а не к отдельным пользователям.

</section>

<section title="Можно ли удалить администраторов организации через API?">

Нет, члены организации с ролью администратора не могут быть удалены через API по соображениям безопасности.

</section>

<section title="Как долго действуют приглашения организации?">

Приглашения организации истекают через 21 день. В настоящее время нет способа изменить этот период истечения.

</section>

<section title="Есть ли ограничения на рабочие пространства?">

Да, вы можете иметь максимум 100 рабочих пространств на организацию. Архивированные рабочие пространства не учитываются в этом ограничении.

</section>

<section title="Что такое рабочее пространство по умолчанию?">

Каждая организация имеет "рабочее пространство по умолчанию", которое не может быть отредактировано или удалено и не имеет ID. Это рабочее пространство не отображается в конечных точках списка рабочих пространств.

</section>

<section title="Как роли организации влияют на доступ к рабочему пространству?">

Администраторы организации автоматически получают роль `workspace_admin` для всех рабочих пространств. Члены организации, отвечающие за выставление счетов, автоматически получают роль `workspace_billing`. Пользователи и разработчики организации должны быть вручную добавлены в каждое рабочее пространство.

</section>

<section title="Какие роли можно назначать в рабочих пространствах?">

Пользователям и разработчикам организации можно назначать роли `workspace_admin`, `workspace_developer` или `workspace_user`. Роль `workspace_billing` не может быть назначена вручную - она наследуется от наличия роли организации `billing`.

</section>

<section title="Можно ли изменить роли рабочего пространства администраторов или членов организации, отвечающих за выставление счетов?">

Только члены организации, отвечающие за выставление счетов, могут иметь свою роль рабочего пространства повышена до роли администратора. В противном случае роли рабочего пространства администраторов и членов организации, отвечающих за выставление счетов, не могут быть изменены или они не могут быть удалены из рабочих пространств, пока они занимают эти роли организации. Их доступ к рабочему пространству должен быть изменен путем изменения их роли организации в первую очередь.

</section>

<section title="Что происходит с доступом к рабочему пространству при изменении ролей организации?">

Если администратор организации или член, отвечающий за выставление счетов, понижен до пользователя или разработчика, они теряют доступ ко всем рабочим пространствам, кроме тех, где им были вручную назначены роли. Когда пользователи повышаются до ролей администратора или выставления счетов, они получают автоматический доступ ко всем рабочим пространствам.

</section>