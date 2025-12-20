# Preços

Saiba mais sobre a estrutura de preços da Anthropic para modelos e recursos

---

Esta página fornece informações detalhadas de preços para os modelos e recursos da Anthropic. Todos os preços estão em USD.

Para as informações de preços mais atualizadas, visite [claude.com/pricing](https://claude.com/pricing).

## Preços dos modelos

A tabela a seguir mostra os preços para todos os modelos Claude em diferentes níveis de uso:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
MTok = Milhões de tokens. A coluna "Base Input Tokens" mostra o preço de entrada padrão, "Cache Writes" e "Cache Hits" são específicos para [prompt caching](/docs/pt-BR/build-with-claude/prompt-caching), e "Output Tokens" mostra o preço de saída. O prompt caching oferece durações de cache de 5 minutos (padrão) e 1 hora para otimizar custos para diferentes casos de uso.

A tabela acima reflete os seguintes multiplicadores de preço para prompt caching:
- Tokens de escrita de cache de 5 minutos são 1,25 vezes o preço dos tokens de entrada base
- Tokens de escrita de cache de 1 hora são 2 vezes o preço dos tokens de entrada base
- Tokens de leitura de cache são 0,1 vezes o preço dos tokens de entrada base
</Note>

## Preços de plataformas de terceiros

Os modelos Claude estão disponíveis em [AWS Bedrock](/docs/pt-BR/build-with-claude/claude-on-amazon-bedrock), [Google Vertex AI](/docs/pt-BR/build-with-claude/claude-on-vertex-ai) e [Microsoft Foundry](/docs/pt-BR/build-with-claude/claude-in-microsoft-foundry). Para preços oficiais, visite:
- [Preços do AWS Bedrock](https://aws.amazon.com/bedrock/pricing/)
- [Preços do Google Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Preços do Microsoft Foundry](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Preços de endpoint regional para modelos Claude 4.5 e posteriores**

A partir do Claude Sonnet 4.5 e Haiku 4.5, AWS Bedrock e Google Vertex AI oferecem dois tipos de endpoint:
- **Endpoints globais**: Roteamento dinâmico entre regiões para máxima disponibilidade
- **Endpoints regionais**: Roteamento de dados garantido dentro de regiões geográficas específicas

Os endpoints regionais incluem um prêmio de 10% sobre os endpoints globais. **A Claude API (1P) é global por padrão e não é afetada por esta mudança.** A Claude API é apenas global (equivalente à oferta de endpoint global e preços de outros provedores).

**Escopo**: Esta estrutura de preços se aplica ao Claude Sonnet 4.5, Haiku 4.5 e todos os modelos futuros. Modelos anteriores (Claude Sonnet 4, Opus 4 e versões anteriores) mantêm seus preços existentes.

Para detalhes de implementação e exemplos de código:
- [Endpoints globais vs regionais do AWS Bedrock](/docs/pt-BR/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Endpoints globais vs regionais do Google Vertex AI](/docs/pt-BR/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## Preços específicos de recursos

### Processamento em lote

A Batch API permite o processamento assíncrono de grandes volumes de solicitações com um desconto de 50% em tokens de entrada e saída.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

Para mais informações sobre processamento em lote, consulte nossa [documentação de processamento em lote](/docs/pt-BR/build-with-claude/batch-processing).

### Preços de contexto longo

Ao usar Claude Sonnet 4 ou Sonnet 4.5 com a [janela de contexto de 1M tokens habilitada](/docs/pt-BR/build-with-claude/context-windows#1m-token-context-window), solicitações que excedem 200K tokens de entrada são automaticamente cobradas com taxas de contexto longo premium:

<Note>
A janela de contexto de 1M tokens está atualmente em beta para organizações no [nível de uso](/docs/pt-BR/api/rate-limits) 4 e organizações com limites de taxa personalizados. A janela de contexto de 1M tokens está disponível apenas para Claude Sonnet 4 e Sonnet 4.5.
</Note>

| ≤ 200K tokens de entrada | > 200K tokens de entrada |
|-----------------------------------|-------------------------------------|
| Entrada: $3 / MTok | Entrada: $6 / MTok |
| Saída: $15 / MTok | Saída: $22,50 / MTok |

Os preços de contexto longo se acumulam com outros modificadores de preço:
- O [desconto de 50% da Batch API](#batch-processing) se aplica aos preços de contexto longo
- [Multiplicadores de prompt caching](#model-pricing) se aplicam além dos preços de contexto longo

<Note>
Mesmo com a flag beta habilitada, solicitações com menos de 200K tokens de entrada são cobradas com taxas padrão. Se sua solicitação exceder 200K tokens de entrada, todos os tokens incorrem em preços premium.

O limite de 200K é baseado apenas em tokens de entrada (incluindo leituras/escritas de cache). A contagem de tokens de saída não afeta a seleção do nível de preço, embora os tokens de saída sejam cobrados com a taxa mais alta quando o limite de entrada é excedido.
</Note>

Para verificar se sua solicitação de API foi cobrada com as taxas da janela de contexto de 1M, examine o objeto `usage` na resposta da API:

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

Calcule o total de tokens de entrada somando:
- `input_tokens`
- `cache_creation_input_tokens` (se usar prompt caching)
- `cache_read_input_tokens` (se usar prompt caching)

Se o total exceder 200.000 tokens, toda a solicitação foi faturada com taxas de contexto de 1M.

Para mais informações sobre o objeto `usage`, consulte a [documentação de resposta da API](/docs/pt-BR/api/messages#response-usage).

### Preços de uso de ferramentas

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

Para preços atuais por modelo, consulte nossa seção [preços dos modelos](#model-pricing) acima.

Para mais informações sobre implementação de uso de ferramentas e melhores práticas, consulte nossa [documentação de uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/overview).

### Preços de ferramentas específicas

#### Ferramenta Bash

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Consulte [preços de uso de ferramentas](#tool-use-pricing) para detalhes completos de preços.

#### Ferramenta de execução de código

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### Ferramenta de editor de texto

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Consulte [preços de uso de ferramentas](#tool-use-pricing) para detalhes completos de preços.

#### Ferramenta de busca na web

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.

#### Ferramenta de busca na web

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens

#### Ferramenta de uso de computador

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Exemplos de preços de casos de uso de agentes

Compreender os preços para aplicações de agentes é crucial ao construir com Claude. Estes exemplos do mundo real podem ajudá-lo a estimar custos para diferentes padrões de agentes.

### Exemplo de agente de suporte ao cliente

Ao construir um agente de suporte ao cliente, aqui está como os custos podem se dividir:

<Note>
  Cálculo de exemplo para processar 10.000 tickets de suporte:
  - Aproximadamente ~3.700 tokens por conversa
  - Usando Claude Sonnet 4.5 em $3/MTok entrada, $15/MTok saída
  - Custo total: ~$22,20 por 10.000 tickets
</Note>

Para um passo a passo detalhado deste cálculo, consulte nosso [guia de agente de suporte ao cliente](/docs/pt-BR/about-claude/use-case-guides/customer-support-chat).

### Preços gerais de fluxo de trabalho de agente

Para arquiteturas de agente mais complexas com múltiplas etapas:

1. **Processamento de solicitação inicial**
   - Entrada típica: 500-1.000 tokens
   - Custo de processamento: ~$0,003 por solicitação

2. **Recuperação de memória e contexto**
   - Contexto recuperado: 2.000-5.000 tokens
   - Custo por recuperação: ~$0,015 por operação

3. **Planejamento e execução de ações**
   - Tokens de planejamento: 1.000-2.000
   - Feedback de execução: 500-1.000
   - Custo combinado: ~$0,045 por ação

Para um guia abrangente sobre padrões de preços de agentes, consulte nosso [guia de casos de uso de agentes](/docs/pt-BR/about-claude/use-case-guides).

### Estratégias de otimização de custos

Ao construir agentes com Claude:

1. **Use modelos apropriados**: Escolha Haiku para tarefas simples, Sonnet para raciocínio complexo
2. **Implemente prompt caching**: Reduza custos para contexto repetido
3. **Operações em lote**: Use a Batch API para tarefas não sensíveis ao tempo
4. **Monitore padrões de uso**: Acompanhe o consumo de tokens para identificar oportunidades de otimização

<Tip>
  Para aplicações de agentes de alto volume, considere entrar em contato com nosso [time de vendas empresariais](https://claude.com/contact-sales) para arranjos de preços personalizados.
</Tip>

## Considerações adicionais de preços

### Limites de taxa

Os limites de taxa variam por nível de uso e afetam quantas solicitações você pode fazer:

- **Nível 1**: Uso de nível de entrada com limites básicos
- **Nível 2**: Limites aumentados para aplicações em crescimento
- **Nível 3**: Limites mais altos para aplicações estabelecidas
- **Nível 4**: Limites padrão máximos
- **Empresarial**: Limites personalizados disponíveis

Para informações detalhadas sobre limites de taxa, consulte nossa [documentação de limites de taxa](/docs/pt-BR/api/rate-limits).

Para limites de taxa mais altos ou arranjos de preços personalizados, [entre em contato com nosso time de vendas](https://claude.com/contact-sales).

### Descontos por volume

Descontos por volume podem estar disponíveis para usuários de alto volume. Estes são negociados caso a caso.

- Níveis padrão usam os preços mostrados acima
- Clientes empresariais podem [entrar em contato com vendas](mailto:sales@anthropic.com) para preços personalizados
- Descontos acadêmicos e de pesquisa podem estar disponíveis

### Preços empresariais

Para clientes empresariais com necessidades específicas:

- Limites de taxa personalizados
- Descontos por volume
- Suporte dedicado
- Termos personalizados

Entre em contato com nosso time de vendas em [sales@anthropic.com](mailto:sales@anthropic.com) ou através do [Claude Console](/settings/limits) para discutir opções de preços empresariais.

## Faturamento e pagamento

- O faturamento é calculado mensalmente com base no uso real
- Os pagamentos são processados em USD
- Opções de cartão de crédito e faturamento disponíveis
- Rastreamento de uso disponível no [Claude Console](/)

## Perguntas frequentes

**Como o uso de tokens é calculado?**

Tokens são pedaços de texto que os modelos processam. Como uma estimativa aproximada, 1 token é aproximadamente 4 caracteres ou 0,75 palavras em inglês. A contagem exata varia por idioma e tipo de conteúdo.

**Existem níveis gratuitos ou testes?**

Novos usuários recebem uma pequena quantidade de créditos gratuitos para testar a API. [Entre em contato com vendas](mailto:sales@anthropic.com) para informações sobre testes estendidos para avaliação empresarial.

**Como os descontos se acumulam?**

Os descontos da Batch API e prompt caching podem ser combinados. Por exemplo, usar ambos os recursos juntos fornece economias de custo significativas em comparação com chamadas de API padrão.

**Quais métodos de pagamento são aceitos?**

Aceitamos cartões de crédito principais para contas padrão. Clientes empresariais podem arranjar faturamento e outros métodos de pagamento.

Para perguntas adicionais sobre preços, entre em contato com [support@anthropic.com](mailto:support@anthropic.com).