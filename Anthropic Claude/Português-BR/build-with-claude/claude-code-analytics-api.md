# API de Análise do Claude Code

Acesse programaticamente as métricas de análise de uso do Claude Code da sua organização e métricas de produtividade com a API de Administração de Análise do Claude Code.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

A API de Análise do Claude Code Admin fornece acesso programático a métricas de uso agregadas diariamente para usuários do Claude Code, permitindo que as organizações analisem a produtividade dos desenvolvedores e criem painéis personalizados. Esta API preenche a lacuna entre nosso [painel de Análise](/claude-code) básico e a integração complexa do OpenTelemetry.

Esta API permite que você monitore, analise e otimize melhor sua adoção do Claude Code:

* **Análise de Produtividade do Desenvolvedor:** Rastreie sessões, linhas de código adicionadas/removidas, commits e solicitações de pull criadas usando Claude Code
* **Métricas de Uso de Ferramentas:** Monitore as taxas de aceitação e rejeição para diferentes ferramentas do Claude Code (Edit, Write, NotebookEdit)
* **Análise de Custos:** Visualize custos estimados e uso de tokens divididos por modelo Claude
* **Relatórios Personalizados:** Exporte dados para criar painéis executivos e relatórios para equipes de gerenciamento
* **Justificativa de Uso:** Forneça métricas para justificar e expandir a adoção do Claude Code internamente

<Check>
  **Chave de API de Administração obrigatória**
  
  Esta API faz parte da [API de Administração](/docs/pt-BR/build-with-claude/administration-api). Estes endpoints requerem uma chave de API de Administração (começando com `sk-ant-admin...`) que difere das chaves de API padrão. Apenas membros da organização com a função de administrador podem provisionar chaves de API de Administração através do [Console Claude](/settings/admin-keys).
</Check>

## Início rápido

Obtenha a análise do Claude Code da sua organização para um dia específico:

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **Defina um cabeçalho User-Agent para integrações**
  
  Se você está construindo uma integração, defina seu cabeçalho User-Agent para nos ajudar a entender os padrões de uso:
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## API de Análise do Claude Code

Rastreie o uso do Claude Code, métricas de produtividade e atividade do desenvolvedor em toda a sua organização com o endpoint `/v1/organizations/usage_report/claude_code`.

### Conceitos-chave

- **Agregação diária**: Retorna métricas para um único dia especificado pelo parâmetro `starting_at`
- **Dados em nível de usuário**: Cada registro representa a atividade de um usuário para o dia especificado
- **Métricas de produtividade**: Rastreie sessões, linhas de código, commits, solicitações de pull e uso de ferramentas
- **Dados de token e custo**: Monitore o uso e custos estimados divididos por modelo Claude
- **Paginação baseada em cursor**: Manipule grandes conjuntos de dados com paginação estável usando cursores opacos
- **Atualização de dados**: As métricas estão disponíveis com até 1 hora de atraso para consistência

Para detalhes completos de parâmetros e esquemas de resposta, consulte a [referência da API de Análise do Claude Code](/docs/pt-BR/api/admin-api/claude-code/get-claude-code-usage-report).

### Exemplos básicos

#### Obtenha análise para um dia específico

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Obtenha análise com paginação

```bash
# Primeira solicitação
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# Solicitação subsequente usando cursor da resposta
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
page=page_MjAyNS0wNS0xNFQwMDowMDowMFo=" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

### Parâmetros de solicitação

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|-------------|
| `starting_at` | string | Sim | Data UTC no formato YYYY-MM-DD. Retorna métricas apenas para este único dia |
| `limit` | integer | Não | Número de registros por página (padrão: 20, máximo: 1000) |
| `page` | string | Não | Token de cursor opaco do campo `next_page` da resposta anterior |

### Métricas disponíveis

Cada registro de resposta contém as seguintes métricas para um único usuário em um único dia:

#### Dimensões
- **date**: Data no formato RFC 3339 (timestamp UTC)
- **actor**: O usuário ou chave de API que realizou as ações do Claude Code (ou `user_actor` com `email_address` ou `api_actor` com `api_key_name`)
- **organization_id**: UUID da organização
- **customer_type**: Tipo de conta do cliente (`api` para clientes de API, `subscription` para clientes Pro/Team)
- **terminal_type**: Tipo de terminal ou ambiente onde Claude Code foi usado (por exemplo, `vscode`, `iTerm.app`, `tmux`)

#### Métricas principais
- **num_sessions**: Número de sessões distintas do Claude Code iniciadas por este ator
- **lines_of_code.added**: Número total de linhas de código adicionadas em todos os arquivos pelo Claude Code
- **lines_of_code.removed**: Número total de linhas de código removidas em todos os arquivos pelo Claude Code
- **commits_by_claude_code**: Número de commits git criados através da funcionalidade de commit do Claude Code
- **pull_requests_by_claude_code**: Número de solicitações de pull criadas através da funcionalidade de PR do Claude Code

#### Métricas de ação de ferramenta
Detalhamento das taxas de aceitação e rejeição de ações de ferramenta por tipo de ferramenta:
- **edit_tool.accepted/rejected**: Número de propostas da ferramenta Edit que o usuário aceitou/rejeitou
- **write_tool.accepted/rejected**: Número de propostas da ferramenta Write que o usuário aceitou/rejeitou
- **notebook_edit_tool.accepted/rejected**: Número de propostas da ferramenta NotebookEdit que o usuário aceitou/rejeitou

#### Detalhamento de modelo
Para cada modelo Claude usado:
- **model**: Identificador do modelo Claude (por exemplo, `claude-sonnet-4-5-20250929`)
- **tokens.input/output**: Contagens de tokens de entrada e saída para este modelo
- **tokens.cache_read/cache_creation**: Uso de tokens relacionado a cache para este modelo
- **estimated_cost.amount**: Custo estimado em centavos USD para este modelo
- **estimated_cost.currency**: Código de moeda para o valor do custo (atualmente sempre `USD`)

### Estrutura de resposta

A API retorna dados no seguinte formato:

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

## Paginação

A API suporta paginação baseada em cursor para organizações com grandes números de usuários:

1. Faça sua solicitação inicial com parâmetro `limit` opcional
2. Se `has_more` for `true` na resposta, use o valor `next_page` em sua próxima solicitação
3. Continue até que `has_more` seja `false`

O cursor codifica a posição do último registro e garante paginação estável mesmo conforme novos dados chegam. Cada sessão de paginação mantém um limite de dados consistente para garantir que você não perca ou duplique registros.

## Casos de uso comuns

- **Painéis executivos**: Crie relatórios de alto nível mostrando o impacto do Claude Code na velocidade de desenvolvimento
- **Comparação de ferramentas de IA**: Exporte métricas para comparar Claude Code com outras ferramentas de codificação de IA como Copilot e Cursor
- **Análise de produtividade do desenvolvedor**: Rastreie métricas de produtividade individual e de equipe ao longo do tempo
- **Rastreamento e alocação de custos**: Monitore padrões de gastos e aloque custos por equipe ou projeto
- **Monitoramento de adoção**: Identifique quais equipes e usuários estão obtendo o maior valor do Claude Code
- **Justificativa de ROI**: Forneça métricas concretas para justificar e expandir a adoção do Claude Code internamente

## Perguntas frequentes

### Qual é a atualização dos dados de análise?
Os dados de análise do Claude Code normalmente aparecem dentro de 1 hora após a conclusão da atividade do usuário. Para garantir resultados de paginação consistentes, apenas dados com mais de 1 hora de idade são incluídos nas respostas.

### Posso obter métricas em tempo real?
Não, esta API fornece apenas métricas agregadas diariamente. Para monitoramento em tempo real, considere usar a [integração OpenTelemetry](https://code.claude.com/docs/en/monitoring-usage).

### Como os usuários são identificados nos dados?
Os usuários são identificados através do campo `actor` de duas maneiras:
- **`user_actor`**: Contém `email_address` para usuários que se autenticam via OAuth (mais comum)
- **`api_actor`**: Contém `api_key_name` para usuários que se autenticam via chave de API

O campo `customer_type` indica se o uso é de clientes `api` (API PAYG) ou clientes `subscription` (planos Pro/Team).

### Qual é o período de retenção de dados?
Os dados históricos de análise do Claude Code são retidos e acessíveis através da API. Não há período de exclusão especificado para estes dados.

### Quais implantações do Claude Code são suportadas?
Esta API rastreia apenas o uso do Claude Code na API Claude (1ª parte). O uso no Amazon Bedrock, Google Vertex AI ou outras plataformas de terceiros não está incluído.

### Qual é o custo de usar esta API?
A API de Análise do Claude Code é gratuita para todas as organizações com acesso à API de Administração.

### Como calculo as taxas de aceitação de ferramentas?
Taxa de aceitação de ferramenta = `accepted / (accepted + rejected)` para cada tipo de ferramenta. Por exemplo, se a ferramenta de edição mostra 45 aceitas e 5 rejeitadas, a taxa de aceitação é 90%.

### Qual fuso horário é usado para o parâmetro de data?
Todas as datas estão em UTC. O parâmetro `starting_at` deve estar no formato YYYY-MM-DD e representa a meia-noite UTC para esse dia.

## Veja também

A API de Análise do Claude Code ajuda você a entender e otimizar o fluxo de trabalho de desenvolvimento da sua equipe. Saiba mais sobre recursos relacionados:

- [Visão geral da API de Administração](/docs/pt-BR/build-with-claude/administration-api)
- [Referência da API de Administração](/docs/pt-BR/api/admin)
- [Painel de Análise do Claude Code](/claude-code)
- [API de Uso e Custo](/docs/pt-BR/build-with-claude/usage-cost-api) - Rastreie o uso da API em todos os serviços Anthropic
- [Gerenciamento de identidade e acesso](https://code.claude.com/docs/en/iam)
- [Monitoramento de uso com OpenTelemetry](https://code.claude.com/docs/en/monitoring-usage) para métricas personalizadas e alertas