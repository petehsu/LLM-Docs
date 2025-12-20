# Descontinuações de modelos

Informações sobre descontinuações de modelos Anthropic, cronogramas de aposentadoria e modelos de substituição recomendados.

---

À medida que lançamos modelos mais seguros e capazes, regularmente descontinuamos modelos mais antigos. Aplicações que dependem de modelos Anthropic podem precisar de atualizações ocasionais para continuar funcionando. Clientes afetados sempre serão notificados por email e em nossa documentação.

Esta página lista todas as descontinuações de API, juntamente com substituições recomendadas.

## Visão geral

Anthropic usa os seguintes termos para descrever o ciclo de vida de nossos modelos:
- **Ativo**: O modelo é totalmente suportado e recomendado para uso.
- **Legado**: O modelo não receberá mais atualizações e pode ser descontinuado no futuro.
- **Descontinuado**: O modelo não está mais disponível para novos clientes, mas continua disponível para usuários existentes até a aposentadoria. Atribuímos uma data de aposentadoria neste ponto.
- **Aposentado**: O modelo não está mais disponível para uso. Solicitações para modelos aposentados falharão.

<Warning>
Observe que modelos descontinuados provavelmente serão menos confiáveis do que modelos ativos. Recomendamos que você mude suas cargas de trabalho para modelos ativos para manter o mais alto nível de suporte e confiabilidade.
</Warning>

## Migrando para substituições

Depois que um modelo é descontinuado, migre todo o uso para uma substituição adequada antes da data de aposentadoria. Solicitações para modelos após a data de aposentadoria falharão.

Para ajudar a medir o desempenho dos modelos de substituição em suas tarefas, recomendamos testes completos de suas aplicações com os novos modelos bem antes da data de aposentadoria.

Para instruções específicas sobre migração de Claude 3.7 para modelos Claude 4.5, consulte [Migrando para Claude 4.5](/docs/pt-BR/about-claude/models/migrating-to-claude-4).

## Notificações

Anthropic notifica clientes com implantações ativas para modelos com aposentadorias futuras. Fornecemos pelo menos 60 dias de aviso antes da aposentadoria do modelo para modelos lançados publicamente.

## Auditando uso de modelos

Para ajudar a identificar o uso de modelos descontinuados, os clientes podem acessar uma auditoria de seu uso de API. Siga estas etapas:

1. Vá para a página [Uso](/settings/usage) no Console
2. Clique no botão "Exportar"
3. Revise o CSV baixado para ver o uso dividido por chave de API e modelo

Esta auditoria ajudará você a localizar qualquer instância em que sua aplicação ainda esteja usando modelos descontinuados, permitindo que você priorize atualizações para modelos mais novos antes da data de aposentadoria.

## Melhores práticas

1. Verifique regularmente nossa documentação para atualizações sobre descontinuações de modelos.
2. Teste suas aplicações com modelos mais novos bem antes da data de aposentadoria de seu modelo atual.
3. Atualize seu código para usar o modelo de substituição recomendado assim que possível.
4. Entre em contato com nossa equipe de suporte se precisar de assistência com migração ou tiver dúvidas.

## Desvantagens de descontinuação e mitigações

Atualmente descontinuamos e aposentamos modelos para garantir capacidade para novos lançamentos de modelos. Reconhecemos que isso traz desvantagens:
- Usuários que valorizam modelos específicos devem migrar para novas versões
- Pesquisadores perdem acesso a modelos para estudos contínuos e comparativos
- A aposentadoria de modelos introduz riscos relacionados à segurança e bem-estar do modelo

Em algum momento, esperamos disponibilizar modelos anteriores novamente publicamente. Enquanto isso, nos comprometemos com a preservação de longo prazo dos pesos dos modelos e outras medidas para ajudar a mitigar esses impactos. Para mais detalhes, consulte [Compromissos sobre Descontinuação e Preservação de Modelos](https://www.anthropic.com/research/deprecation-commitments).

## Status do modelo

Todos os modelos lançados publicamente estão listados abaixo com seu status:

| Nome do Modelo de API       | Estado Atual        | Descontinuado     | Data de Aposentadoria Tentativa |
|:----------------------------|:--------------------|:------------------|:-------------------------|
| `claude-3-opus-20240229`    | Descontinuado       | 30 de junho de 2025     | 5 de janeiro de 2026          |
| `claude-3-haiku-20240307`   | Ativo               | N/A               | Não antes de 7 de março de 2025 |
| `claude-3-5-haiku-20241022` | Ativo               | N/A               | Não antes de 22 de outubro de 2025 |
| `claude-3-7-sonnet-20250219`| Descontinuado       | 28 de outubro de 2025  | 19 de fevereiro de 2026          |
| `claude-sonnet-4-20250514`  | Ativo               | N/A               | Não antes de 14 de maio de 2026 |
| `claude-opus-4-20250514`    | Ativo               | N/A               | Não antes de 14 de maio de 2026 |
| `claude-opus-4-1-20250805`  | Ativo               | N/A               | Não antes de 5 de agosto de 2026 |
| `claude-sonnet-4-5-20250929`| Ativo               | N/A               | Não antes de 29 de setembro de 2026 |
| `claude-haiku-4-5-20251001` | Ativo               | N/A               | Não antes de 15 de outubro de 2026 |
| `claude-opus-4-5-20251101`  | Ativo               | N/A               | Não antes de 24 de novembro de 2026 |

## Histórico de descontinuação

Todas as descontinuações estão listadas abaixo, com os anúncios mais recentes no topo.

### 2025-10-28: Modelo Claude Sonnet 3.7

Em 28 de outubro de 2025, notificamos desenvolvedores usando o modelo Claude Sonnet 3.7 sobre sua próxima aposentadoria na Claude API.

| Data de Aposentadoria       | Modelo Descontinuado        | Substituição Recomendada     |
|:----------------------------|:----------------------------|:--------------------------------|
| 19 de fevereiro de 2026     | `claude-3-7-sonnet-20250219`| `claude-sonnet-4-5-20250929`     |

### 2025-08-13: Modelos Claude Sonnet 3.5

<Note>
Estes modelos foram aposentados em 28 de outubro de 2025.
</Note>

Em 13 de agosto de 2025, notificamos desenvolvedores usando modelos Claude Sonnet 3.5 sobre sua próxima aposentadoria.

| Data de Aposentadoria       | Modelo Descontinuado        | Substituição Recomendada     |
|:----------------------------|:----------------------------|:--------------------------------|
| 28 de outubro de 2025       | `claude-3-5-sonnet-20240620`| `claude-sonnet-4-5-20250929`     |
| 28 de outubro de 2025       | `claude-3-5-sonnet-20241022`| `claude-sonnet-4-5-20250929`     |

### 2025-06-30: Modelo Claude Opus 3

Em 30 de junho de 2025, notificamos desenvolvedores usando o modelo Claude Opus 3 sobre sua próxima aposentadoria.

| Data de Aposentadoria       | Modelo Descontinuado        | Substituição Recomendada     |
|:----------------------------|:----------------------------|:--------------------------------|
| 5 de janeiro de 2026        | `claude-3-opus-20240229`    | `claude-opus-4-1-20250805`      |

### 2025-01-21: Modelos Claude 2, Claude 2.1 e Claude Sonnet 3

<Note>
Estes modelos foram aposentados em 21 de julho de 2025.
</Note>

Em 21 de janeiro de 2025, notificamos desenvolvedores usando modelos Claude 2, Claude 2.1 e Claude Sonnet 3 sobre suas próximas aposentadorias.

| Data de Aposentadoria       | Modelo Descontinuado        | Substituição Recomendada     |
|:----------------------------|:----------------------------|:--------------------------------|
| 21 de julho de 2025         | `claude-2.0`                | `claude-sonnet-4-5-20250929`      |
| 21 de julho de 2025         | `claude-2.1`                | `claude-sonnet-4-5-20250929`      |
| 21 de julho de 2025         | `claude-3-sonnet-20240229`  | `claude-sonnet-4-5-20250929`      |

### 2024-09-04: Modelos Claude 1 e Instant

<Note>
Estes modelos foram aposentados em 6 de novembro de 2024.
</Note>

Em 4 de setembro de 2024, notificamos desenvolvedores usando modelos Claude 1 e Instant sobre suas próximas aposentadorias.

| Data de Aposentadoria       | Modelo Descontinuado      | Substituição Recomendada    |
|:----------------------------|:--------------------------|:---------------------------|
| 6 de novembro de 2024       | `claude-1.0`              | `claude-3-5-haiku-20241022`|
| 6 de novembro de 2024       | `claude-1.1`              | `claude-3-5-haiku-20241022`|
| 6 de novembro de 2024       | `claude-1.2`              | `claude-3-5-haiku-20241022`|
| 6 de novembro de 2024       | `claude-1.3`              | `claude-3-5-haiku-20241022`|
| 6 de novembro de 2024       | `claude-instant-1.0`      | `claude-3-5-haiku-20241022`|
| 6 de novembro de 2024       | `claude-instant-1.1`      | `claude-3-5-haiku-20241022`|
| 6 de novembro de 2024       | `claude-instant-1.2`      | `claude-3-5-haiku-20241022`|