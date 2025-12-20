# Visão geral da Admin API

Gerencie programaticamente os recursos da sua organização, incluindo membros, espaços de trabalho e chaves de API

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

A [Admin API](/docs/pt-BR/api/admin) permite que você gerencie programaticamente os recursos da sua organização, incluindo membros da organização, espaços de trabalho e chaves de API. Isso fornece controle programático sobre tarefas administrativas que de outra forma exigiriam configuração manual no [Claude Console](/).

<Check>
  **A Admin API requer acesso especial**

  A Admin API requer uma chave Admin API especial (começando com `sk-ant-admin...`) que difere das chaves de API padrão. Apenas membros da organização com a função de administrador podem provisionar chaves Admin API através do Claude Console.
</Check>

## Como a Admin API funciona

Quando você usa a Admin API:

1. Você faz solicitações usando sua chave Admin API no cabeçalho `x-api-key`
2. A API permite que você gerencie:
   - Membros da organização e suas funções
   - Convites de membros da organização
   - Espaços de trabalho e seus membros
   - Chaves de API

Isso é útil para:
- Automatizar integração/desintegração de usuários
- Gerenciar programaticamente o acesso ao espaço de trabalho
- Monitorar e gerenciar o uso de chaves de API

## Funções e permissões da organização

Existem cinco funções no nível da organização. Veja mais detalhes [aqui](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions).

| Função | Permissões |
|------|-------------|
| user | Pode usar Workbench |
| claude_code_user | Pode usar Workbench e [Claude Code](https://code.claude.com/docs/en/overview) |
| developer | Pode usar Workbench e gerenciar chaves de API |
| billing | Pode usar Workbench e gerenciar detalhes de faturamento |
| admin | Pode fazer tudo acima, além de gerenciar usuários |

## Conceitos-chave

### Membros da Organização

Você pode listar [membros da organização](/docs/pt-BR/api/admin-api/users/get-user), atualizar funções de membros e remover membros.

<CodeGroup>
```bash Shell
# List organization members
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update member role
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# Remove member
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Convites da Organização

Você pode convidar usuários para organizações e gerenciar esses [convites](/docs/pt-BR/api/admin-api/invites/get-invite).

<CodeGroup>

```bash Shell
# Create invite
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "newuser@domain.com",
    "role": "developer"
  }'

# List invites
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Delete invite
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Espaços de Trabalho

Crie e gerencie [espaços de trabalho](/docs/pt-BR/api/admin-api/workspaces/get-workspace) ([console](/settings/workspaces)) para organizar seus recursos:

<CodeGroup>

```bash Shell
# Create workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# List workspaces
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Archive workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Membros do Espaço de Trabalho

Gerencie [acesso do usuário a espaços de trabalho específicos](/docs/pt-BR/api/admin-api/workspace_members/get-workspace-member):

<CodeGroup>

```bash Shell
# Add member to workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# List workspace members
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update member role
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# Remove member from workspace
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Chaves de API

Monitore e gerencie [chaves de API](/docs/pt-BR/api/admin-api/apikeys/get-api-key):

<CodeGroup>

```bash Shell
# List API keys
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update API key
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

</CodeGroup>

## Acessando informações da organização

Obtenha informações sobre sua organização programaticamente com o endpoint `/v1/organizations/me`.

Por exemplo:

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

Este endpoint é útil para determinar programaticamente qual organização uma chave Admin API pertence.

Para detalhes completos de parâmetros e esquemas de resposta, consulte a [referência da API de Informações da Organização](/docs/pt-BR/api/admin-api/organization/get-me).

## Acessando relatórios de uso e custo

Para acessar relatórios de uso e custo da sua organização, use os endpoints da API de Uso e Custo:

- O [**endpoint de Uso**](/docs/pt-BR/build-with-claude/usage-cost-api#usage-api) (`/v1/organizations/usage_report/messages`) fornece dados de uso detalhados, incluindo contagens de tokens e métricas de solicitação, agrupados por várias dimensões, como espaço de trabalho, usuário e modelo.
- O [**endpoint de Custo**](/docs/pt-BR/build-with-claude/usage-cost-api#cost-api) (`/v1/organizations/cost_report`) fornece dados de custo associados ao uso da sua organização, permitindo que você rastreie despesas e aloque custos por espaço de trabalho ou descrição.

Esses endpoints fornecem insights detalhados sobre o uso da sua organização e custos associados.

## Acessando análises do Claude Code

Para organizações que usam Claude Code, a [**API de Análises do Claude Code**](/docs/pt-BR/build-with-claude/claude-code-analytics-api) fornece métricas de produtividade detalhadas e insights de uso:

- O [**endpoint de Análises do Claude Code**](/docs/pt-BR/build-with-claude/claude-code-analytics-api) (`/v1/organizations/usage_report/claude_code`) fornece métricas agregadas diariamente para uso do Claude Code, incluindo sessões, linhas de código, commits, solicitações de pull, estatísticas de uso de ferramentas e dados de custo divididos por usuário e modelo.

Esta API permite que você rastreie a produtividade do desenvolvedor, analise a adoção do Claude Code e crie painéis personalizados para sua organização.

## Melhores práticas

Para usar efetivamente a Admin API:

- Use nomes e descrições significativos para espaços de trabalho e chaves de API
- Implemente tratamento de erros adequado para operações com falha
- Audite regularmente funções e permissões de membros
- Limpe espaços de trabalho não utilizados e convites expirados
- Monitore o uso de chaves de API e rotacione as chaves periodicamente

## Perguntas frequentes

<section title="Quais permissões são necessárias para usar a Admin API?">

Apenas membros da organização com a função de administrador podem usar a Admin API. Eles também devem ter uma chave Admin API especial (começando com `sk-ant-admin`).

</section>

<section title="Posso criar novas chaves de API através da Admin API?">

Não, novas chaves de API só podem ser criadas através do Claude Console por razões de segurança. A Admin API pode apenas gerenciar chaves de API existentes.

</section>

<section title="O que acontece com as chaves de API ao remover um usuário?">

As chaves de API persistem em seu estado atual, pois são escopo da Organização, não de usuários individuais.

</section>

<section title="Os administradores da organização podem ser removidos via API?">

Não, membros da organização com a função de administrador não podem ser removidos via API por razões de segurança.

</section>

<section title="Quanto tempo os convites da organização duram?">

Os convites da organização expiram após 21 dias. Atualmente, não há como modificar este período de expiração.

</section>

<section title="Existem limites em espaços de trabalho?">

Sim, você pode ter um máximo de 100 espaços de trabalho por Organização. Espaços de trabalho arquivados não contam para este limite.

</section>

<section title="O que é o Espaço de Trabalho Padrão?">

Toda Organização tem um "Espaço de Trabalho Padrão" que não pode ser editado ou removido, e não tem ID. Este Espaço de Trabalho não aparece nos endpoints de lista de espaços de trabalho.

</section>

<section title="Como as funções da organização afetam o acesso ao Espaço de Trabalho?">

Os administradores da organização obtêm automaticamente a função `workspace_admin` para todos os espaços de trabalho. Os membros de faturamento da organização obtêm automaticamente a função `workspace_billing`. Os usuários e desenvolvedores da organização devem ser adicionados manualmente a cada espaço de trabalho.

</section>

<section title="Quais funções podem ser atribuídas em espaços de trabalho?">

Usuários e desenvolvedores da organização podem ser atribuídos às funções `workspace_admin`, `workspace_developer` ou `workspace_user`. A função `workspace_billing` não pode ser atribuída manualmente - ela é herdada por ter a função de organização `billing`.

</section>

<section title="As funções de espaço de trabalho dos membros de administrador ou faturamento da organização podem ser alteradas?">

Apenas membros de faturamento da organização podem ter sua função de espaço de trabalho promovida para uma função de administrador. Caso contrário, administradores e membros de faturamento da organização não podem ter suas funções de espaço de trabalho alteradas ou ser removidos de espaços de trabalho enquanto mantêm essas funções de organização. O acesso ao espaço de trabalho deve ser modificado alterando sua função de organização primeiro.

</section>

<section title="O que acontece com o acesso ao espaço de trabalho quando as funções da organização mudam?">

Se um administrador da organização ou membro de faturamento for rebaixado para usuário ou desenvolvedor, ele perde acesso a todos os espaços de trabalho, exceto aqueles em que foram atribuídos manualmente funções. Quando os usuários são promovidos para funções de administrador ou faturamento, eles ganham acesso automático a todos os espaços de trabalho.

</section>