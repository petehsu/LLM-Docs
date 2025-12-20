# Ferramenta de busca na web

A ferramenta de busca na web oferece ao Claude acesso direto a conteúdo web em tempo real, permitindo que ele responda perguntas com informações atualizadas além de seu conhecimento de corte.

---

A ferramenta de busca na web oferece ao Claude acesso direto a conteúdo web em tempo real, permitindo que ele responda perguntas com informações atualizadas além de seu conhecimento de corte. Claude cita automaticamente as fontes dos resultados de busca como parte de sua resposta.

<Note>
Por favor, entre em contato através do nosso [formulário de feedback](https://forms.gle/sWjBtsrNEY2oKGuE8) para compartilhar sua experiência com a ferramenta de busca na web.
</Note>

## Modelos suportados

A busca na web está disponível em:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Haiku 3.5 (`claude-3-5-haiku-latest`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Como a busca na web funciona

Quando você adiciona a ferramenta de busca na web à sua solicitação de API:

1. Claude decide quando fazer a busca com base no prompt.
2. A API executa as buscas e fornece os resultados ao Claude. Este processo pode se repetir várias vezes durante uma única solicitação.
3. No final de sua vez, Claude fornece uma resposta final com fontes citadas.

## Como usar a busca na web

<Note>
O administrador da sua organização deve ativar a busca na web no [Console](/settings/privacy).
</Note>

Forneça a ferramenta de busca na web em sua solicitação de API:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in NYC?"
            }
        ],
        "tools": [{
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 5
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "What's the weather in NYC?"
        }
    ],
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "max_uses": 5
    }]
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: "What's the weather in NYC?"
      }
    ],
    tools: [{
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 5
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

### Definição da ferramenta

A ferramenta de busca na web suporta os seguintes parâmetros:

```json JSON
{
  "type": "web_search_20250305",
  "name": "web_search",

  // Opcional: Limitar o número de buscas por solicitação
  "max_uses": 5,

  // Opcional: Incluir apenas resultados desses domínios
  "allowed_domains": ["example.com", "trusteddomain.org"],

  // Opcional: Nunca incluir resultados desses domínios
  "blocked_domains": ["untrustedsource.com"],

  // Opcional: Localizar resultados de busca
  "user_location": {
    "type": "approximate",
    "city": "San Francisco",
    "region": "California",
    "country": "US",
    "timezone": "America/Los_Angeles"
  }
}
```

#### Max uses

O parâmetro `max_uses` limita o número de buscas realizadas. Se Claude tentar fazer mais buscas do que permitido, o `web_search_tool_result` será um erro com o código de erro `max_uses_exceeded`.

#### Filtragem de domínio

Ao usar filtros de domínio:

- Os domínios não devem incluir o esquema HTTP/HTTPS (use `example.com` em vez de `https://example.com`)
- Subdomínios são incluídos automaticamente (`example.com` cobre `docs.example.com`)
- Subdomínios específicos restringem os resultados apenas a esse subdomínio (`docs.example.com` retorna apenas resultados desse subdomínio, não de `example.com` ou `api.example.com`)
- Subcaminhos são suportados e correspondem a qualquer coisa após o caminho (`example.com/blog` corresponde a `example.com/blog/post-1`)
- Você pode usar `allowed_domains` ou `blocked_domains`, mas não ambos na mesma solicitação.

**Suporte a caracteres curinga:**

- Apenas um caractere curinga (`*`) é permitido por entrada de domínio, e deve aparecer após a parte do domínio (no caminho)
- Válido: `example.com/*`, `example.com/*/articles`
- Inválido: `*.example.com`, `ex*.com`, `example.com/*/news/*`

Formatos de domínio inválidos retornarão um erro de ferramenta `invalid_tool_input`.

<Note>
As restrições de domínio no nível da solicitação devem ser compatíveis com as restrições de domínio no nível da organização configuradas no Console. Os domínios no nível da solicitação podem apenas restringir ainda mais os domínios, não substituir ou expandir além da lista no nível da organização. Se sua solicitação incluir domínios que entrem em conflito com as configurações da organização, a API retornará um erro de validação.
</Note>

#### Localização

O parâmetro `user_location` permite que você localize os resultados de busca com base na localização de um usuário.

- `type`: O tipo de localização (deve ser `approximate`)
- `city`: O nome da cidade
- `region`: A região ou estado
- `country`: O país
- `timezone`: O [ID de fuso horário IANA](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

### Resposta

Aqui está um exemplo de estrutura de resposta:

```json
{
  "role": "assistant",
  "content": [
    // 1. Decisão do Claude de fazer a busca
    {
      "type": "text",
      "text": "I'll search for when Claude Shannon was born."
    },
    // 2. A consulta de busca usada
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "name": "web_search",
      "input": {
        "query": "claude shannon birth date"
      }
    },
    // 3. Resultados de busca
    {
      "type": "web_search_tool_result",
      "tool_use_id": "srvtoolu_01WYG3ziw53XMcoyKL4XcZmE",
      "content": [
        {
          "type": "web_search_result",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_content": "EqgfCioIARgBIiQ3YTAwMjY1Mi1mZjM5LTQ1NGUtODgxNC1kNjNjNTk1ZWI3Y...",
          "page_age": "April 30, 2025"
        }
      ]
    },
    {
      "text": "Based on the search results, ",
      "type": "text"
    },
    // 4. Resposta do Claude com citações
    {
      "text": "Claude Shannon was born on April 30, 1916, in Petoskey, Michigan",
      "type": "text",
      "citations": [
        {
          "type": "web_search_result_location",
          "url": "https://en.wikipedia.org/wiki/Claude_Shannon",
          "title": "Claude Shannon - Wikipedia",
          "encrypted_index": "Eo8BCioIAhgBIiQyYjQ0OWJmZi1lNm..",
          "cited_text": "Claude Elwood Shannon (April 30, 1916 – February 24, 2001) was an American mathematician, electrical engineer, computer scientist, cryptographer and i..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 6039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_search_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Resultados de busca

Os resultados de busca incluem:

- `url`: A URL da página de origem
- `title`: O título da página de origem
- `page_age`: Quando o site foi atualizado pela última vez
- `encrypted_content`: Conteúdo criptografado que deve ser passado novamente em conversas multi-turno para citações

#### Citações

As citações estão sempre ativadas para busca na web, e cada `web_search_result_location` inclui:

- `url`: A URL da fonte citada
- `title`: O título da fonte citada
- `encrypted_index`: Uma referência que deve ser passada novamente para conversas multi-turno.
- `cited_text`: Até 150 caracteres do conteúdo citado

Os campos de citação de busca na web `cited_text`, `title` e `url` não contam para o uso de tokens de entrada ou saída.

<Note>
  Ao exibir saídas de API diretamente para usuários finais, as citações devem ser incluídas para a fonte original. Se você estiver fazendo modificações nas saídas de API, incluindo reprocessamento e/ou combinação com seu próprio material antes de exibir para usuários finais, exiba citações conforme apropriado com base em consulta com sua equipe jurídica.
</Note>

#### Erros

Quando a ferramenta de busca na web encontra um erro (como atingir limites de taxa), a API Claude ainda retorna uma resposta 200 (sucesso). O erro é representado no corpo da resposta usando a seguinte estrutura:

```json
{
  "type": "web_search_tool_result",
  "tool_use_id": "servertoolu_a93jad",
  "content": {
    "type": "web_search_tool_result_error",
    "error_code": "max_uses_exceeded"
  }
}
```

Estes são os possíveis códigos de erro:

- `too_many_requests`: Limite de taxa excedido
- `invalid_input`: Parâmetro de consulta de busca inválido
- `max_uses_exceeded`: Máximo de usos da ferramenta de busca na web excedido
- `query_too_long`: Consulta excede o comprimento máximo
- `unavailable`: Ocorreu um erro interno

#### Motivo de parada `pause_turn`

A resposta pode incluir um motivo de parada `pause_turn`, que indica que a API pausou uma volta de longa duração. Você pode fornecer a resposta como está em uma solicitação subsequente para deixar Claude continuar sua vez, ou modificar o conteúdo se desejar interromper a conversa.

## Cache de prompt

A busca na web funciona com [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching). Para ativar o cache de prompt, adicione pelo menos um ponto de interrupção `cache_control` em sua solicitação. O sistema armazenará automaticamente em cache até o último bloco `web_search_tool_result` ao executar a ferramenta.

Para conversas multi-turno, defina um ponto de interrupção `cache_control` em ou após o último bloco `web_search_tool_result` para reutilizar o conteúdo em cache.

Por exemplo, para usar cache de prompt com busca na web para uma conversa multi-turno:

<CodeGroup>
```python
import anthropic

client = anthropic.Anthropic()

# Primeira solicitação com busca na web e ponto de interrupção de cache
messages = [
    {
        "role": "user",
        "content": "What's the current weather in San Francisco today?"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)

# Adicionar resposta do Claude à conversa
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Segunda solicitação com ponto de interrupção de cache após os resultados de busca
messages.append({
    "role": "user",
    "content": "Should I expect rain later this week?",
    "cache_control": {"type": "ephemeral"}  # Cache até este ponto
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_search_20250305",
        "name": "web_search",
        "user_location": {
            "type": "approximate",
            "city": "San Francisco",
            "region": "California",
            "country": "US",
            "timezone": "America/Los_Angeles"
        }
    }]
)
# A segunda resposta se beneficiará dos resultados de busca em cache
# enquanto ainda pode realizar novas buscas se necessário
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

</CodeGroup>

## Streaming

Com streaming ativado, você receberá eventos de busca como parte do stream. Haverá uma pausa enquanto a busca é executada:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Decisão do Claude de fazer a busca

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_search"}}

// Consulta de busca transmitida
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"latest quantum computing breakthroughs 2025\"}"}}

// Pausa enquanto a busca é executada

// Resultados de busca transmitidos
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": [{"type": "web_search_result", "title": "Quantum Computing Breakthroughs in 2025", "url": "https://example.com"}]}}

// Resposta do Claude com citações (omitida neste exemplo)
```

## Solicitações em lote

Você pode incluir a ferramenta de busca na web na [API de Lotes de Mensagens](/docs/pt-BR/build-with-claude/batch-processing). As chamadas de ferramenta de busca na web através da API de Lotes de Mensagens têm o mesmo preço que as solicitações da API de Mensagens regular.

## Uso e preços

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