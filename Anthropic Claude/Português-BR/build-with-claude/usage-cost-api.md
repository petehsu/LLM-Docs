# API de Uso e Custo

Acesse programaticamente os dados de uso e custo da API da sua organização com a API de Administração de Uso e Custo.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

A API de Administração de Uso e Custo fornece acesso programático e granular aos dados históricos de uso e custo da API para sua organização. Esses dados são semelhantes às informações disponíveis nas páginas [Uso](/usage) e [Custo](/cost) do Console Claude.

Esta API permite que você monitore, analise e otimize melhor suas implementações Claude:

* **Rastreamento Preciso de Uso:** Obtenha contagens exatas de tokens e padrões de uso em vez de depender apenas da contagem de tokens de resposta
* **Reconciliação de Custos:** Combine registros internos com faturamento da Anthropic para equipes de finanças e contabilidade
* **Desempenho e melhoria do produto:** Monitore o desempenho do produto enquanto mede se as alterações no sistema o melhoraram, ou configure alertas
* **Otimização de [limite de taxa](/docs/pt-BR/api/rate-limits) e [Camada de Prioridade](/docs/pt-BR/api/service-tiers#get-started-with-priority-tier):** Otimize recursos como [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) ou prompts específicos para aproveitar ao máximo sua capacidade alocada, ou compre capacidade dedicada.
* **Análise Avançada:** Realize análises de dados mais profundas do que as disponíveis no Console

<Check>
  **Chave de API de Administração obrigatória**
  
  Esta API faz parte da [API de Administração](/docs/pt-BR/build-with-claude/administration-api). Estes endpoints requerem uma chave de API de Administração (começando com `sk-ant-admin...`) que difere das chaves de API padrão. Apenas membros da organização com a função de administrador podem provisionar chaves de API de Administração através do [Console Claude](/settings/admin-keys).
</Check>

## Soluções de parceiros

Plataformas de observabilidade líderes oferecem integrações prontas para uso para monitorar seu uso e custo da API Claude, sem escrever código personalizado. Essas integrações fornecem painéis, alertas e análises para ajudá-lo a gerenciar seu uso de API de forma eficaz.

<CardGroup cols={3}>
  <Card title="CloudZero" icon="chart" href="https://docs.cloudzero.com/docs/connections-anthropic">
    Plataforma de inteligência em nuvem para rastreamento e previsão de custos
  </Card>
  <Card title="Datadog" icon="chart" href="https://docs.datadoghq.com/integrations/anthropic/">
    Observabilidade de LLM com rastreamento e monitoramento automáticos
  </Card>
  <Card title="Grafana Cloud" icon="chart" href="https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/">
    Integração sem agente para observabilidade fácil de LLM com painéis e alertas prontos para uso
  </Card>
  <Card title="Honeycomb" icon="polygon" href="https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/">
    Consulta avançada e visualização através de OpenTelemetry
  </Card>
  <Card title="Vantage" icon="chart" href="https://docs.vantage.sh/connecting_anthropic">
    Plataforma FinOps para observabilidade de custo e uso de LLM
  </Card>
</CardGroup>

## Início rápido

Obtenha o uso diário de sua organização dos últimos 7 dias:

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **Defina um cabeçalho User-Agent para integrações**
  
  Se você está construindo uma integração, defina seu cabeçalho User-Agent para nos ajudar a entender padrões de uso:
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## API de Uso

Rastreie o consumo de tokens em sua organização com detalhamentos detalhados por modelo, espaço de trabalho e camada de serviço com o endpoint `/v1/organizations/usage_report/messages`.

### Conceitos-chave

- **Buckets de tempo**: Agregue dados de uso em intervalos fixos (`1m`, `1h` ou `1d`)
- **Rastreamento de tokens**: Meça tokens de entrada não armazenados em cache, entrada armazenada em cache, criação de cache e tokens de saída
- **Filtragem e agrupamento**: Filtre por chave de API, espaço de trabalho, modelo, camada de serviço ou janela de contexto, e agrupe resultados por essas dimensões
- **Uso de ferramentas do servidor**: Rastreie o uso de ferramentas do lado do servidor, como pesquisa na web

Para detalhes completos de parâmetros e esquemas de resposta, consulte a [referência da API de Uso](/docs/pt-BR/api/admin-api/usage-cost/get-messages-usage-report).

### Exemplos básicos

#### Uso diário por modelo

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### Uso por hora com filtragem

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

#### Filtrar uso por chaves de API e espaços de trabalho

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
Para recuperar os IDs de chave de API de sua organização, use o endpoint [Listar Chaves de API](/docs/pt-BR/api/admin-api/apikeys/list-api-keys).

Para recuperar os IDs de espaço de trabalho de sua organização, use o endpoint [Listar Espaços de Trabalho](/docs/pt-BR/api/admin-api/workspaces/list-workspaces), ou encontre os IDs de espaço de trabalho de sua organização no Console Anthropic.
</Tip>

### Limites de granularidade de tempo

| Granularidade | Limite Padrão | Limite Máximo | Caso de Uso |
|-------------|---------------|---------------|----------|
| `1m` | 60 buckets | 1440 buckets | Monitoramento em tempo real |
| `1h` | 24 buckets | 168 buckets | Padrões diários |
| `1d` | 7 buckets | 31 buckets | Relatórios semanais/mensais |

## API de Custo

Recupere detalhamentos de custo em nível de serviço em USD com o endpoint `/v1/organizations/cost_report`.

### Conceitos-chave

- **Moeda**: Todos os custos em USD, relatados como strings decimais em unidades mais baixas (centavos)
- **Tipos de custo**: Rastreie custos de uso de tokens, pesquisa na web e execução de código
- **Agrupamento**: Agrupe custos por espaço de trabalho ou descrição para detalhamentos detalhados
- **Buckets de tempo**: Granularidade diária apenas (`1d`)

Para detalhes completos de parâmetros e esquemas de resposta, consulte a [referência da API de Custo](/docs/pt-BR/api/admin-api/usage-cost/get-cost-report).

<Warning>
  Os custos da Camada de Prioridade usam um modelo de faturamento diferente e não estão incluídos no endpoint de custo. Rastreie o uso da Camada de Prioridade através do endpoint de uso.
</Warning>

### Exemplo básico

```bash
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Paginação

Ambos os endpoints suportam paginação para grandes conjuntos de dados:

1. Faça sua solicitação inicial
2. Se `has_more` for `true`, use o valor `next_page` em sua próxima solicitação
3. Continue até que `has_more` seja `false`

```bash
# Primeira solicitação
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# A resposta inclui: "has_more": true, "next_page": "page_xyz..."

# Próxima solicitação com paginação
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## Casos de uso comuns

Explore implementações detalhadas em [anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook):

- **Relatórios de uso diário**: Rastreie tendências de consumo de tokens
- **Atribuição de custo**: Aloque despesas por espaço de trabalho para cobranças
- **Eficiência de cache**: Meça e otimize o cache de prompt
- **Monitoramento de orçamento**: Configure alertas para limites de gastos
- **Exportação CSV**: Gere relatórios para equipes de finanças

## Perguntas frequentes

### Quão frescos são os dados?
Os dados de uso e custo normalmente aparecem dentro de 5 minutos após a conclusão da solicitação da API, embora atrasos possam ocasionalmente ser mais longos.

### Qual é a frequência de polling recomendada?
A API suporta polling uma vez por minuto para uso sustentado. Para rajadas curtas (por exemplo, download de dados paginados), polling mais frequente é aceitável. Armazene em cache os resultados para painéis que precisam de atualizações frequentes.

### Como rastreio o uso de execução de código?
Os custos de execução de código aparecem no endpoint de custo agrupados sob `Code Execution Usage` no campo de descrição. A execução de código não está incluída no endpoint de uso.

### Como rastreio o uso da Camada de Prioridade?
Filtre ou agrupe por `service_tier` no endpoint de uso e procure pelo valor `priority`. Os custos da Camada de Prioridade não estão disponíveis no endpoint de custo.

### O que acontece com o uso do Workbench?
O uso de API do Workbench não está associado a uma chave de API, portanto `api_key_id` será `null` mesmo ao agrupar por essa dimensão.

### Como o espaço de trabalho padrão é representado?
O uso e os custos atribuídos ao espaço de trabalho padrão têm um valor `null` para `workspace_id`.

### Como obtenho detalhamentos de custo por usuário para Claude Code?

Use a [API de Análise do Claude Code](/docs/pt-BR/build-with-claude/claude-code-analytics-api), que fornece custos estimados por usuário e métricas de produtividade sem as limitações de desempenho de dividir custos por muitas chaves de API. Para uso geral de API com muitas chaves, use a [API de Uso](#usage-api) para rastrear o consumo de tokens como proxy de custo.

## Veja também
As APIs de Uso e Custo podem ser usadas para ajudá-lo a oferecer uma experiência melhor para seus usuários, ajudá-lo a gerenciar custos e preservar seu limite de taxa. Saiba mais sobre alguns desses outros recursos:

- [Visão geral da API de Administração](/docs/pt-BR/build-with-claude/administration-api)
- [Referência da API de Administração](/docs/pt-BR/api/admin)
- [Preços](/docs/pt-BR/about-claude/pricing)
- [Cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) - Otimize custos com cache
- [Processamento em lote](/docs/pt-BR/build-with-claude/batch-processing) - 50% de desconto em solicitações em lote
- [Limites de taxa](/docs/pt-BR/api/rate-limits) - Entenda os níveis de uso