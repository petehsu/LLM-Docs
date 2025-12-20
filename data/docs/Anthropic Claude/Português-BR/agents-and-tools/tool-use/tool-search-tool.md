# Ferramenta de busca de ferramentas

Ative Claude para trabalhar com centenas ou milhares de ferramentas descobrindo e carregando-as dinamicamente sob demanda.

---

A ferramenta de busca de ferramentas permite que Claude trabalhe com centenas ou milhares de ferramentas descobrindo e carregando-as dinamicamente sob demanda. Em vez de carregar todas as definições de ferramentas na janela de contexto antecipadamente, Claude pesquisa seu catálogo de ferramentas—incluindo nomes de ferramentas, descrições, nomes de argumentos e descrições de argumentos—e carrega apenas as ferramentas que precisa.

Esta abordagem resolve dois desafios críticos conforme as bibliotecas de ferramentas aumentam:

- **Eficiência de contexto**: As definições de ferramentas podem consumir porções massivas de sua janela de contexto (50 ferramentas ≈ 10-20K tokens), deixando menos espaço para o trabalho real
- **Precisão na seleção de ferramentas**: A capacidade do Claude de selecionar corretamente ferramentas degrada significativamente com mais de 30-50 ferramentas convencionalmente disponíveis

Embora isso seja fornecido como uma ferramenta do lado do servidor, você também pode implementar sua própria funcionalidade de busca de ferramentas do lado do cliente. Veja [Implementação de busca de ferramentas personalizada](#custom-tool-search-implementation) para detalhes.

<Note>
A ferramenta de busca de ferramentas está atualmente em beta público. Inclua o [cabeçalho beta](/docs/pt-BR/api/beta-headers) apropriado para seu provedor:

| Provedor                 | Cabeçalho beta                 | Modelos suportados                     |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Claude API<br/>Microsoft Foundry  | `advanced-tool-use-2025-11-20` | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Google Cloud's Vertex AI | `tool-search-tool-2025-10-19`  | Claude Opus 4.5<br />Claude Sonnet 4.5 |
| Amazon Bedrock           | `tool-search-tool-2025-10-19`  | Claude Opus 4.5                        |
</Note>

<Warning>
  No Amazon Bedrock, a busca de ferramentas do lado do servidor está disponível apenas através da [API invoke](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-runtime_example_bedrock-runtime_InvokeModel_AnthropicClaude_section.html),
  não da API converse.
</Warning>

Você também pode implementar [busca de ferramentas do lado do cliente](#custom-tool-search-implementation) retornando blocos `tool_reference` de sua própria implementação de busca.

## Como funciona a busca de ferramentas

Existem duas variantes de busca de ferramentas:

- **Regex** (`tool_search_tool_regex_20251119`): Claude constrói padrões regex para pesquisar ferramentas
- **BM25** (`tool_search_tool_bm25_20251119`): Claude usa consultas em linguagem natural para pesquisar ferramentas

Quando você ativa a ferramenta de busca de ferramentas:

1. Você inclui uma ferramenta de busca de ferramentas (por exemplo, `tool_search_tool_regex_20251119` ou `tool_search_tool_bm25_20251119`) em sua lista de ferramentas
2. Você fornece todas as definições de ferramentas com `defer_loading: true` para ferramentas que não devem ser carregadas imediatamente
3. Claude vê apenas a ferramenta de busca de ferramentas e quaisquer ferramentas não adiadas inicialmente
4. Quando Claude precisa de ferramentas adicionais, ele pesquisa usando uma ferramenta de busca de ferramentas
5. A API retorna 3-5 blocos `tool_reference` mais relevantes
6. Essas referências são automaticamente expandidas em definições de ferramentas completas
7. Claude seleciona entre as ferramentas descobertas e as invoca

Isso mantém sua janela de contexto eficiente enquanto mantém alta precisão na seleção de ferramentas.

## Início rápido

Aqui está um exemplo simples com ferramentas adiadas:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "What is the weather in San Francisco?"
            }
        ],
        "tools": [
            {
                "type": "tool_search_tool_regex_20251119",
                "name": "tool_search_tool_regex"
            },
            {
                "name": "get_weather",
                "description": "Get the weather at a specific location",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string"},
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                },
                "defer_loading": true
            },
            {
                "name": "search_files",
                "description": "Search through files in the workspace",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string"},
                        "file_types": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["query"]
                },
                "defer_loading": true
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "What is the weather in San Francisco?"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get the weather at a specific location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            },
            "defer_loading": True
        },
        {
            "name": "search_files",
            "description": "Search through files in the workspace",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "file_types": {
                        "type": "array",
                        "items": {"type": "string"}
                    }
                },
                "required": ["query"]
            },
            "defer_loading": True
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: "What is the weather in San Francisco?",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        name: "get_weather",
        description: "Get the weather at a specific location",
        input_schema: {
          type: "object",
          properties: {
            location: { type: "string" },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
            },
          },
          required: ["location"],
        },
        defer_loading: true,
      },
      {
        name: "search_files",
        description: "Search through files in the workspace",
        input_schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            file_types: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: ["query"],
        },
        defer_loading: true,
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

## Definição de ferramenta

A ferramenta de busca de ferramentas tem duas variantes:

```json JSON
{
  "type": "tool_search_tool_regex_20251119",
  "name": "tool_search_tool_regex"
}
```

```json JSON
{
  "type": "tool_search_tool_bm25_20251119",
  "name": "tool_search_tool_bm25"
}
```

<Warning>
**Formato de consulta da variante Regex: Regex Python, NÃO linguagem natural**

Ao usar `tool_search_tool_regex_20251119`, Claude constrói padrões regex usando a sintaxe `re.search()` do Python, não consultas em linguagem natural. Padrões comuns:

- `"weather"` - corresponde a nomes/descrições de ferramentas contendo "weather"
- `"get_.*_data"` - corresponde a ferramentas como `get_user_data`, `get_weather_data`
- `"database.*query|query.*database"` - padrões OR para flexibilidade
- `"(?i)slack"` - busca insensível a maiúsculas/minúsculas

Comprimento máximo de consulta: 200 caracteres

</Warning>

<Note>
**Formato de consulta da variante BM25: Linguagem natural**

Ao usar `tool_search_tool_bm25_20251119`, Claude usa consultas em linguagem natural para pesquisar ferramentas.

</Note>

### Carregamento de ferramentas adiado

Marque ferramentas para carregamento sob demanda adicionando `defer_loading: true`:

```json JSON
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string" },
      "unit": { "type": "string", "enum": ["celsius", "fahrenheit"] }
    },
    "required": ["location"]
  },
  "defer_loading": true
}
```

**Pontos-chave:**

- Ferramentas sem `defer_loading` são carregadas no contexto imediatamente
- Ferramentas com `defer_loading: true` são carregadas apenas quando Claude as descobre via busca
- A ferramenta de busca de ferramentas em si **nunca** deve ter `defer_loading: true`
- Mantenha suas 3-5 ferramentas mais usadas como não adiadas para desempenho ideal

Ambas as variantes de busca de ferramentas (`regex` e `bm25`) pesquisam nomes de ferramentas, descrições, nomes de argumentos e descrições de argumentos.

## Formato de resposta

Quando Claude usa a ferramenta de busca de ferramentas, a resposta inclui novos tipos de bloco:

```json JSON
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll search for tools to help with the weather information."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_01ABC123",
      "name": "tool_search_tool_regex",
      "input": {
        "query": "weather"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_01ABC123",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [{ "type": "tool_reference", "tool_name": "get_weather" }]
      }
    },
    {
      "type": "text",
      "text": "I found a weather tool. Let me get the weather for San Francisco."
    },
    {
      "type": "tool_use",
      "id": "toolu_01XYZ789",
      "name": "get_weather",
      "input": { "location": "San Francisco", "unit": "fahrenheit" }
    }
  ],
  "stop_reason": "tool_use"
}
```

### Entendendo a resposta

- **`server_tool_use`**: Indica que Claude está invocando a ferramenta de busca de ferramentas
- **`tool_search_tool_result`**: Contém os resultados da busca com um objeto `tool_search_tool_search_result` aninhado
- **`tool_references`**: Array de objetos `tool_reference` apontando para ferramentas descobertas
- **`tool_use`**: Claude invocando a ferramenta descoberta

Os blocos `tool_reference` são automaticamente expandidos em definições de ferramentas completas antes de serem mostrados ao Claude. Você não precisa lidar com essa expansão você mesmo. Isso acontece automaticamente na API desde que você forneça todas as definições de ferramentas correspondentes no parâmetro `tools`.

## Integração MCP

A ferramenta de busca de ferramentas funciona com [servidores MCP](/docs/pt-BR/agents-and-tools/mcp-connector). Adicione o [cabeçalho beta](/docs/pt-BR/api/beta-headers) `"mcp-client-2025-11-20"` à sua solicitação de API e, em seguida, use `mcp_toolset` com `default_config` para adiar o carregamento de ferramentas MCP:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "anthropic-beta: advanced-tool-use-2025-11-20,mcp-client-2025-11-20" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 2048,
    "mcp_servers": [
      {
        "type": "url",
        "name": "database-server",
        "url": "https://mcp-db.example.com"
      }
    ],
    "tools": [
      {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
      },
      {
        "type": "mcp_toolset",
        "mcp_server_name": "database-server",
        "default_config": {
          "defer_loading": true
        },
        "configs": {
          "search_events": {
            "defer_loading": false
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What events are in my database?"
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens=2048,
    mcp_servers=[
        {
            "type": "url",
            "name": "database-server",
            "url": "https://mcp-db.example.com"
        }
    ],
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "type": "mcp_toolset",
            "mcp_server_name": "database-server",
            "default_config": {
                "defer_loading": True
            },
            "configs": {
                "search_events": {
                    "defer_loading": False
                }
            }
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What events are in my database?"
        }
    ]
)

print(response)
```

```typescript TypeScript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.beta.messages.create({
    model: "claude-sonnet-4-5-20250929",
    betas: ["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
    max_tokens: 2048,
    mcp_servers: [
      {
        type: "url",
        name: "database-server",
        url: "https://mcp-db.example.com",
      },
    ],
    tools: [
      {
        type: "tool_search_tool_regex_20251119",
        name: "tool_search_tool_regex",
      },
      {
        type: "mcp_toolset",
        mcp_server_name: "database-server",
        default_config: {
          defer_loading: true,
        },
        configs: {
          search_events: {
            defer_loading: false,
          },
        },
      },
    ],
    messages: [
      {
        role: "user",
        content: "What events are in my database?",
      },
    ],
  });

  console.log(JSON.stringify(response, null, 2));
}

main();
```

</CodeGroup>

**Opções de configuração MCP:**

- `default_config.defer_loading`: Define padrão para todas as ferramentas do servidor MCP
- `configs`: Substitui padrões para ferramentas específicas por nome
- Combine múltiplos servidores MCP com busca de ferramentas para bibliotecas de ferramentas massivas

## Implementação de busca de ferramentas personalizada

Você pode implementar sua própria lógica de busca de ferramentas (por exemplo, usando embeddings ou busca semântica) retornando blocos `tool_reference` de uma ferramenta personalizada:

```json JSON
{
  "type": "tool_search_tool_result",
  "tool_use_id": "toolu_custom_search",
  "content": {
    "type": "tool_search_tool_search_result",
    "tool_references": [{ "type": "tool_reference", "tool_name": "discovered_tool_name" }]
  }
}
```

Toda ferramenta referenciada deve ter uma definição de ferramenta correspondente no parâmetro `tools` de nível superior com `defer_loading: true`. Esta abordagem permite que você use algoritmos de busca mais sofisticados enquanto mantém compatibilidade com o sistema de busca de ferramentas.

Para um exemplo completo usando embeddings, veja nosso [cookbook de busca de ferramentas com embeddings](https://github.com/anthropics/anthropic-cookbook).

## Tratamento de erros

<Note>
  A ferramenta de busca de ferramentas não é compatível com [exemplos de uso de ferramentas](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples).
  Se você precisar fornecer exemplos de uso de ferramentas, use chamada de ferramentas padrão
  sem busca de ferramentas.
</Note>

### Erros HTTP (status 400)

Esses erros impedem que a solicitação seja processada:

**Todas as ferramentas adiadas:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "All tools have defer_loading set. At least one tool must be non-deferred."
  }
}
```

**Definição de ferramenta ausente:**

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "Tool reference 'unknown_tool' has no corresponding tool definition"
  }
}
```

### Erros de resultado de ferramenta (status 200)

Erros durante a execução de ferramentas retornam uma resposta 200 com informações de erro no corpo:

```json JSON
{
  "type": "tool_result",
  "tool_use_id": "srvtoolu_01ABC123",
  "content": {
    "type": "tool_search_tool_result_error",
    "error_code": "invalid_pattern"
  }
}
```

**Códigos de erro:**

- `too_many_requests`: Limite de taxa excedido para operações de busca de ferramentas
- `invalid_pattern`: Padrão regex malformado
- `pattern_too_long`: Padrão excede limite de 200 caracteres
- `unavailable`: Serviço de busca de ferramentas temporariamente indisponível

### Erros comuns

<section title="Erro 400: Todas as ferramentas são adiadas">

**Causa**: Você definiu `defer_loading: true` em TODAS as ferramentas incluindo a ferramenta de busca

**Solução**: Remova `defer_loading` da ferramenta de busca de ferramentas:

```json
{
  "type": "tool_search_tool_regex_20251119", // Sem defer_loading aqui
  "name": "tool_search_tool_regex"
}
```

</section>

<section title="Erro 400: Definição de ferramenta ausente">

**Causa**: Uma `tool_reference` aponta para uma ferramenta não em seu array `tools`

**Solução**: Certifique-se de que toda ferramenta que pode ser descoberta tem uma definição completa:

```json
{
  "name": "my_tool",
  "description": "Full description here",
  "input_schema": {
    /* complete schema */
  },
  "defer_loading": true
}
```

</section>

<section title="Claude não encontra ferramentas esperadas">

**Causa**: Nomes ou descrições de ferramentas não correspondem ao padrão regex

**Etapas de depuração:**

1. Verifique nome e descrição da ferramenta—Claude pesquisa AMBOS os campos
2. Teste seu padrão: `import re; re.search(r"your_pattern", "tool_name")`
3. Lembre-se de que as buscas são sensíveis a maiúsculas/minúsculas por padrão (use `(?i)` para insensível a maiúsculas/minúsculas)
4. Claude usa padrões amplos como `".*weather.*"` não correspondências exatas

**Dica**: Adicione palavras-chave comuns às descrições de ferramentas para melhorar a descoberta

</section>

## Cache de prompt

A busca de ferramentas funciona com [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching). Adicione pontos de interrupção `cache_control` para otimizar conversas multi-turno:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Primeira solicitação com busca de ferramentas
messages = [
    {
        "role": "user",
        "content": "What's the weather in Seattle?"
    }
]

response1 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

# Adicione a resposta do Claude à conversa
messages.append({
    "role": "assistant",
    "content": response1.content
})

# Segunda solicitação com ponto de interrupção de cache
messages.append({
    "role": "user",
    "content": "What about New York?",
    "cache_control": {"type": "ephemeral"}
})

response2 = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=2048,
    messages=messages,
    tools=[
        {
            "type": "tool_search_tool_regex_20251119",
            "name": "tool_search_tool_regex"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                },
                "required": ["location"]
            },
            "defer_loading": True
        }
    ]
)

print(f"Cache read tokens: {response2.usage.get('cache_read_input_tokens', 0)}")
```
</CodeGroup>

O sistema automaticamente expande blocos tool_reference em todo o histórico de conversa, então Claude pode reutilizar ferramentas descobertas em turnos subsequentes sem pesquisar novamente.

## Streaming

Com streaming ativado, você receberá eventos de busca de ferramentas como parte do stream:

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "tool_search_tool_regex"}}

// Consulta de busca transmitida
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"query\":\"weather\"}"}}

// Pausa enquanto a busca é executada

// Resultados de busca transmitidos
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "tool_search_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"type": "tool_search_tool_search_result", "tool_references": [{"type": "tool_reference", "tool_name": "get_weather"}]}}}

// Claude continua com ferramentas descobertas
```

## Solicitações em lote

Você pode incluir a ferramenta de busca de ferramentas na [API de Lotes de Mensagens](/docs/pt-BR/build-with-claude/batch-processing). Operações de busca de ferramentas através da API de Lotes de Mensagens são precificadas da mesma forma que aquelas em solicitações regulares da API de Mensagens.

## Limites e melhores práticas

### Limites

- **Máximo de ferramentas**: 10.000 ferramentas em seu catálogo
- **Resultados de busca**: Retorna 3-5 ferramentas mais relevantes por busca
- **Comprimento de padrão**: Máximo de 200 caracteres para padrões regex
- **Suporte de modelo**: Sonnet 4.0+, Opus 4.0+ apenas (sem Haiku)

### Quando usar busca de ferramentas

**Bons casos de uso:**

- 10+ ferramentas disponíveis em seu sistema
- Definições de ferramentas consumindo >10K tokens
- Experimentando problemas de precisão na seleção de ferramentas com grandes conjuntos de ferramentas
- Construindo sistemas alimentados por MCP com múltiplos servidores (200+ ferramentas)
- Biblioteca de ferramentas crescendo ao longo do tempo

**Quando chamada de ferramentas tradicional pode ser melhor:**

- Menos de 10 ferramentas no total
- Todas as ferramentas são frequentemente usadas em cada solicitação
- Definições de ferramentas muito pequenas (\<100 tokens no total)

### Dicas de otimização

- Mantenha 3-5 ferramentas mais usadas como não adiadas
- Escreva nomes e descrições de ferramentas claros e descritivos
- Use palavras-chave semânticas em descrições que correspondam a como os usuários descrevem tarefas
- Adicione uma seção de prompt do sistema descrevendo categorias de ferramentas disponíveis: "Você pode pesquisar ferramentas para interagir com Slack, GitHub e Jira"
- Monitore quais ferramentas Claude descobre para refinar descrições

## Uso

O uso da ferramenta de busca de ferramentas é rastreado no objeto de uso de resposta:

```json JSON
{
  "usage": {
    "input_tokens": 1024,
    "output_tokens": 256,
    "server_tool_use": {
      "tool_search_requests": 2
    }
  }
}
```