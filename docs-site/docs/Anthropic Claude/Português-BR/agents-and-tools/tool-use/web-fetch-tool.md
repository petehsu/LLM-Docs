# Ferramenta de busca na web

A ferramenta de busca na web permite que Claude recupere conteúdo completo de páginas da web e documentos PDF especificados.

---

A ferramenta de busca na web permite que Claude recupere conteúdo completo de páginas da web e documentos PDF especificados.

<Note>
A ferramenta de busca na web está atualmente em beta. Para habilitá-la, use o cabeçalho beta `web-fetch-2025-09-10` em suas solicitações de API.

Use [este formulário](https://forms.gle/NhWcgmkcvPCMmPE86) para fornecer feedback sobre a qualidade das respostas do modelo, a própria API ou a qualidade da documentação.
</Note>

<Warning>
Habilitar a ferramenta de busca na web em ambientes onde Claude processa entrada não confiável junto com dados sensíveis apresenta riscos de exfiltração de dados. Recomendamos usar esta ferramenta apenas em ambientes confiáveis ou ao lidar com dados não sensíveis.

Para minimizar riscos de exfiltração, Claude não tem permissão para construir URLs dinamicamente. Claude pode apenas buscar URLs que foram explicitamente fornecidas pelo usuário ou que vêm de resultados anteriores de busca na web ou busca na web. No entanto, ainda existe risco residual que deve ser cuidadosamente considerado ao usar esta ferramenta.

Se a exfiltração de dados for uma preocupação, considere:
- Desabilitar completamente a ferramenta de busca na web
- Usar o parâmetro `max_uses` para limitar o número de solicitações
- Usar o parâmetro `allowed_domains` para restringir a domínios conhecidos e seguros
</Warning>

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

1. Claude decide quando buscar conteúdo com base no prompt e URLs disponíveis.
2. A API recupera o conteúdo de texto completo da URL especificada.
3. Para PDFs, a extração automática de texto é realizada.
4. Claude analisa o conteúdo buscado e fornece uma resposta com citações opcionais.

<Note>
A ferramenta de busca na web atualmente não suporta sites renderizados dinamicamente via Javascript.
</Note>

## Como usar a busca na web

Forneça a ferramenta de busca na web em sua solicitação de API:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: web-fetch-2025-09-10" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": "Please analyze the content at https://example.com/article"
            }
        ],
        "tools": [{
            "type": "web_fetch_20250910",
            "name": "web_fetch",
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
            "content": "Please analyze the content at https://example.com/article"
        }
    ],
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch",
        "max_uses": 5
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
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
        content: "Please analyze the content at https://example.com/article"
      }
    ],
    tools: [{
      type: "web_fetch_20250910",
      name: "web_fetch",
      max_uses: 5
    }],
    headers: {
      "anthropic-beta": "web-fetch-2025-09-10"
    }
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
  "type": "web_fetch_20250910",
  "name": "web_fetch",

  // Opcional: Limitar o número de buscas por solicitação
  "max_uses": 10,

  // Opcional: Buscar apenas destes domínios
  "allowed_domains": ["example.com", "docs.example.com"],

  // Opcional: Nunca buscar destes domínios
  "blocked_domains": ["private.example.com"],

  // Opcional: Habilitar citações para conteúdo buscado
  "citations": {
    "enabled": true
  },

  // Opcional: Comprimento máximo de conteúdo em tokens
  "max_content_tokens": 100000
}
```

#### Max uses

O parâmetro `max_uses` limita o número de buscas na web realizadas. Se Claude tentar mais buscas do que permitido, o `web_fetch_tool_result` será um erro com o código de erro `max_uses_exceeded`. Atualmente não há limite padrão.

#### Filtragem de domínio

Ao usar filtros de domínio:

- Os domínios não devem incluir o esquema HTTP/HTTPS (use `example.com` em vez de `https://example.com`)
- Subdomínios são automaticamente incluídos (`example.com` cobre `docs.example.com`)
- Subcaminhos são suportados (`example.com/blog`)
- Você pode usar `allowed_domains` ou `blocked_domains`, mas não ambos na mesma solicitação.

<Warning>
Esteja ciente de que caracteres Unicode em nomes de domínio podem criar vulnerabilidades de segurança através de ataques de homógrafos, onde caracteres visualmente semelhantes de scripts diferentes podem contornar filtros de domínio. Por exemplo, `аmazon.com` (usando 'а' cirílico) pode parecer idêntico a `amazon.com` mas representa um domínio diferente.

Ao configurar listas de permissão/bloqueio de domínio:
- Use nomes de domínio apenas ASCII quando possível
- Considere que analisadores de URL podem lidar com normalização Unicode de forma diferente
- Teste seus filtros de domínio com possíveis variações de homógrafos
- Audite regularmente suas configurações de domínio para caracteres Unicode suspeitos
</Warning>

#### Limites de conteúdo

O parâmetro `max_content_tokens` limita a quantidade de conteúdo que será incluída no contexto. Se o conteúdo buscado exceder este limite, será truncado. Isso ajuda a controlar o uso de tokens ao buscar documentos grandes.

<Note>
O limite do parâmetro `max_content_tokens` é aproximado. O número real de tokens de entrada usados pode variar um pouco.
</Note>

#### Citações

Diferentemente da busca na web onde as citações estão sempre habilitadas, as citações são opcionais para busca na web. Defina `"citations": {"enabled": true}` para permitir que Claude cite passagens específicas de documentos buscados.

<Note>
Ao exibir saídas de API diretamente para usuários finais, as citações devem ser incluídas para a fonte original. Se você estiver fazendo modificações nas saídas de API, incluindo reprocessamento e/ou combinação com seu próprio material antes de exibir para usuários finais, exiba citações conforme apropriado com base em consulta com sua equipe jurídica.
</Note>

### Resposta

Aqui está um exemplo de estrutura de resposta:

```json
{
  "role": "assistant",
  "content": [
    // 1. Decisão de Claude de buscar
    {
      "type": "text",
      "text": "I'll fetch the content from the article to analyze it."
    },
    // 2. A solicitação de busca
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01234567890abcdef",
      "name": "web_fetch",
      "input": {
        "url": "https://example.com/article"
      }
    },
    // 3. Resultados da busca
    {
      "type": "web_fetch_tool_result",
      "tool_use_id": "srvtoolu_01234567890abcdef",
      "content": {
        "type": "web_fetch_result",
        "url": "https://example.com/article",
        "content": {
          "type": "document",
          "source": {
            "type": "text",
            "media_type": "text/plain",
            "data": "Full text content of the article..."
          },
          "title": "Article Title",
          "citations": {"enabled": true}
        },
        "retrieved_at": "2025-08-25T10:30:00Z"
      }
    },
    // 4. Análise de Claude com citações (se habilitado)
    {
      "text": "Based on the article, ",
      "type": "text"
    },
    {
      "text": "the main argument presented is that artificial intelligence will transform healthcare",
      "type": "text",
      "citations": [
        {
          "type": "char_location",
          "document_index": 0,
          "document_title": "Article Title",
          "start_char_index": 1234,
          "end_char_index": 1456,
          "cited_text": "Artificial intelligence is poised to revolutionize healthcare delivery..."
        }
      ]
    }
  ],
  "id": "msg_a930390d3a",
  "usage": {
    "input_tokens": 25039,
    "output_tokens": 931,
    "server_tool_use": {
      "web_fetch_requests": 1
    }
  },
  "stop_reason": "end_turn"
}
```

#### Resultados da busca

Os resultados da busca incluem:

- `url`: A URL que foi buscada
- `content`: Um bloco de documento contendo o conteúdo buscado
- `retrieved_at`: Timestamp de quando o conteúdo foi recuperado

<Note>
A ferramenta de busca na web armazena em cache os resultados para melhorar o desempenho e reduzir solicitações redundantes. Isso significa que o conteúdo retornado pode nem sempre ser a versão mais recente disponível na URL. O comportamento do cache é gerenciado automaticamente e pode mudar ao longo do tempo para otimizar diferentes tipos de conteúdo e padrões de uso.
</Note>

Para documentos PDF, o conteúdo será retornado como dados codificados em base64:

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_02",
  "content": {
    "type": "web_fetch_result",
    "url": "https://example.com/paper.pdf",
    "content": {
      "type": "document",
      "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmo..."
      },
      "citations": {"enabled": true}
    },
    "retrieved_at": "2025-08-25T10:30:02Z"
  }
}
```

#### Erros

Quando a ferramenta de busca na web encontra um erro, a API Claude retorna uma resposta 200 (sucesso) com o erro representado no corpo da resposta:

```json
{
  "type": "web_fetch_tool_result",
  "tool_use_id": "srvtoolu_a93jad",
  "content": {
    "type": "web_fetch_tool_error",
    "error_code": "url_not_accessible"
  }
}
```

Estes são os possíveis códigos de erro:

- `invalid_input`: Formato de URL inválido
- `url_too_long`: URL excede o comprimento máximo (250 caracteres)
- `url_not_allowed`: URL bloqueada por regras de filtragem de domínio e restrições do modelo
- `url_not_accessible`: Falha ao buscar conteúdo (erro HTTP)
- `too_many_requests`: Limite de taxa excedido
- `unsupported_content_type`: Tipo de conteúdo não suportado (apenas texto e PDF)
- `max_uses_exceeded`: Número máximo de usos da ferramenta de busca na web excedido
- `unavailable`: Um erro interno ocorreu

## Validação de URL

Por razões de segurança, a ferramenta de busca na web pode apenas buscar URLs que apareceram anteriormente no contexto da conversa. Isso inclui:

- URLs em mensagens do usuário
- URLs em resultados de ferramentas do lado do cliente
- URLs de resultados anteriores de busca na web ou busca na web

A ferramenta não pode buscar URLs arbitrárias que Claude gera ou URLs de ferramentas de servidor baseadas em contêiner (Execução de Código, Bash, etc.).

## Busca e busca combinadas

A busca na web funciona perfeitamente com busca na web para coleta de informações abrangente:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Find recent articles about quantum computing and analyze the most relevant one in detail"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        },
        {
            "type": "web_fetch_20250910",
            "name": "web_fetch",
            "max_uses": 5,
            "citations": {"enabled": True}
        }
    ],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)
```

Neste fluxo de trabalho, Claude irá:
1. Usar busca na web para encontrar artigos relevantes
2. Selecionar os resultados mais promissores
3. Usar busca na web para recuperar conteúdo completo
4. Fornecer análise detalhada com citações

## Cache de prompt

A busca na web funciona com [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching). Para habilitar o cache de prompt, adicione pontos de interrupção `cache_control` em sua solicitação. Os resultados de busca em cache podem ser reutilizados em turnos de conversa.

```python
import anthropic

client = anthropic.Anthropic()

# Primeira solicitação com busca na web
messages = [
    {
        "role": "user",
        "content": "Analyze this research paper: https://arxiv.org/abs/2024.12345"
    }
]

response1 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# Adicionar resposta de Claude à conversa
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Segunda solicitação com ponto de interrupção de cache
messages.append({
    "role": "user",
    "content": "What methodology does the paper use?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=messages,
    tools=[{
        "type": "web_fetch_20250910",
        "name": "web_fetch"
    }],
    extra_headers={
        "anthropic-beta": "web-fetch-2025-09-10"
    }
)

# A segunda resposta se beneficia dos resultados de busca em cache
print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```

## Streaming

Com streaming habilitado, eventos de busca fazem parte do stream com uma pausa durante a recuperação de conteúdo:

```javascript
event: message_start
data: {"type": "message_start", "message": {"id": "msg_abc123", "type": "message"}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

// Decisão de Claude de buscar

event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "web_fetch"}}

// URL de busca transmitida
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"url\":\"https://example.com/article\"}"}}

// Pausa enquanto a busca é executada

// Resultados de busca transmitidos
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "web_fetch_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "web_fetch_result", "url": "https://example.com/article", "content": {"type": "document", "source": {"type": "text", "media_type": "text/plain", "data": "Article content..."}}}}}

// Resposta de Claude continua...
```

## Solicitações em lote

Você pode incluir a ferramenta de busca na web na [API de Lotes de Mensagens](/docs/pt-BR/build-with-claude/batch-processing). As chamadas de ferramenta de busca na web através da API de Lotes de Mensagens são precificadas da mesma forma que as solicitações da API de Mensagens regular.

## Uso e preços

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