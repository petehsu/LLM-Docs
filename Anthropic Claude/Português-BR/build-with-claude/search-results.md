# Resultados de busca

Ative citações naturais para aplicações RAG fornecendo resultados de busca com atribuição de fonte

---

Os blocos de conteúdo de resultados de busca permitem citações naturais com atribuição adequada de fonte, trazendo citações de qualidade de busca na web para suas aplicações personalizadas. Este recurso é particularmente poderoso para aplicações RAG (Retrieval-Augmented Generation) onde você precisa que Claude cite fontes com precisão.

O recurso de resultados de busca está disponível nos seguintes modelos:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([descontinuado](/docs/pt-BR/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)

## Principais benefícios

- **Citações naturais** - Alcance a mesma qualidade de citação que a busca na web para qualquer conteúdo
- **Integração flexível** - Use em retornos de ferramentas para RAG dinâmico ou como conteúdo de nível superior para dados pré-buscados
- **Atribuição adequada de fonte** - Cada resultado inclui informações de fonte e título para atribuição clara
- **Sem necessidade de soluções alternativas de documentos** - Elimina a necessidade de soluções alternativas baseadas em documentos
- **Formato de citação consistente** - Corresponde à qualidade e formato de citação da funcionalidade de busca na web do Claude

## Como funciona

Os resultados de busca podem ser fornecidos de duas maneiras:

1. **De chamadas de ferramentas** - Suas ferramentas personalizadas retornam resultados de busca, permitindo aplicações RAG dinâmicas
2. **Como conteúdo de nível superior** - Você fornece resultados de busca diretamente em mensagens do usuário para conteúdo pré-buscado ou em cache

Em ambos os casos, Claude pode citar automaticamente informações dos resultados de busca com atribuição adequada de fonte.

### Esquema de resultado de busca

Os resultados de busca usam a seguinte estrutura:

```json
{
  "type": "search_result",
  "source": "https://example.com/article",  // Obrigatório: URL de fonte ou identificador
  "title": "Article Title",                  // Obrigatório: Título do resultado
  "content": [                               // Obrigatório: Array de blocos de texto
    {
      "type": "text",
      "text": "The actual content of the search result..."
    }
  ],
  "citations": {                             // Opcional: Configuração de citação
    "enabled": true                          // Ativar/desativar citações para este resultado
  }
}
```

### Campos obrigatórios

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `type` | string | Deve ser `"search_result"` |
| `source` | string | A URL de fonte ou identificador do conteúdo |
| `title` | string | Um título descritivo para o resultado de busca |
| `content` | array | Um array de blocos de texto contendo o conteúdo real |

### Campos opcionais

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `citations` | object | Configuração de citação com campo booleano `enabled` |
| `cache_control` | object | Configurações de controle de cache (por exemplo, `{"type": "ephemeral"}`) |

Cada item no array `content` deve ser um bloco de texto com:
- `type`: Deve ser `"text"`
- `text`: O conteúdo de texto real (string não vazia)

## Método 1: Resultados de busca de chamadas de ferramentas

O caso de uso mais poderoso é retornar resultados de busca de suas ferramentas personalizadas. Isso permite aplicações RAG dinâmicas onde ferramentas buscam e retornam conteúdo relevante com citações automáticas.

### Exemplo: Ferramenta de base de conhecimento

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam,
    ToolResultBlockParam
)

client = Anthropic()

# Define a knowledge base search tool
knowledge_base_tool = {
    "name": "search_knowledge_base",
    "description": "Search the company knowledge base for information",
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query"
            }
        },
        "required": ["query"]
    }
}

# Function to handle the tool call
def search_knowledge_base(query):
    # Your search logic here
    # Returns search results in the correct format
    return [
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/product-guide",
            title="Product Configuration Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
                )
            ],
            citations={"enabled": True}
        ),
        SearchResultBlockParam(
            type="search_result",
            source="https://docs.company.com/troubleshooting",
            title="Troubleshooting Guide",
            content=[
                TextBlockParam(
                    type="text",
                    text="If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
                )
            ],
            citations={"enabled": True}
        )
    ]

# Create a message with the tool
response = client.messages.create(
    model="claude-sonnet-4-5",  # Works with all supported models
    max_tokens=1024,
    tools=[knowledge_base_tool],
    messages=[
        MessageParam(
            role="user",
            content="How do I configure the timeout settings?"
        )
    ]
)

# When Claude calls the tool, provide the search results
if response.content[0].type == "tool_use":
    tool_result = search_knowledge_base(response.content[0].input["query"])
    
    # Send the tool result back
    final_response = client.messages.create(
        model="claude-sonnet-4-5",  # Works with all supported models
        max_tokens=1024,
        messages=[
            MessageParam(role="user", content="How do I configure the timeout settings?"),
            MessageParam(role="assistant", content=response.content),
            MessageParam(
                role="user",
                content=[
                    ToolResultBlockParam(
                        type="tool_result",
                        tool_use_id=response.content[0].id,
                        content=tool_result  # Search results go here
                    )
                ]
            )
        ]
    )
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Define a knowledge base search tool
const knowledgeBaseTool = {
  name: "search_knowledge_base",
  description: "Search the company knowledge base for information",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query"
      }
    },
    required: ["query"]
  }
};

// Function to handle the tool call
function searchKnowledgeBase(query: string) {
  // Your search logic here
  // Returns search results in the correct format
  return [
    {
      type: "search_result" as const,
      source: "https://docs.company.com/product-guide",
      title: "Product Configuration Guide",
      content: [
        {
          type: "text" as const,
          text: "To configure the product, navigate to Settings > Configuration. The default timeout is 30 seconds, but can be adjusted between 10-120 seconds based on your needs."
        }
      ],
      citations: { enabled: true }
    },
    {
      type: "search_result" as const,
      source: "https://docs.company.com/troubleshooting",
      title: "Troubleshooting Guide",
      content: [
        {
          type: "text" as const,
          text: "If you encounter timeout errors, first check the configuration settings. Common causes include network latency and incorrect timeout values."
        }
      ],
      citations: { enabled: true }
    }
  ];
}

// Create a message with the tool
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5", // Works with all supported models
  max_tokens: 1024,
  tools: [knowledgeBaseTool],
  messages: [
    {
      role: "user",
      content: "How do I configure the timeout settings?"
    }
  ]
});

// Handle tool use and provide results
if (response.content[0].type === "tool_use") {
  const toolResult = searchKnowledgeBase(response.content[0].input.query);
  
  const finalResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-5", // Works with all supported models
    max_tokens: 1024,
      messages: [
      { role: "user", content: "How do I configure the timeout settings?" },
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: [
          {
            type: "tool_result" as const,
            tool_use_id: response.content[0].id,
            content: toolResult  // Search results go here
          }
        ]
      }
    ]
  });
}
```
</CodeGroup>

## Método 2: Resultados de busca como conteúdo de nível superior

Você também pode fornecer resultados de busca diretamente em mensagens do usuário. Isso é útil para:
- Conteúdo pré-buscado de sua infraestrutura de busca
- Resultados de busca em cache de consultas anteriores
- Conteúdo de serviços de busca externos
- Testes e desenvolvimento

### Exemplo: Resultados de busca diretos

<CodeGroup>
```python Python
from anthropic import Anthropic
from anthropic.types import (
    MessageParam,
    TextBlockParam,
    SearchResultBlockParam
)

client = Anthropic()

# Provide search results directly in the user message
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        MessageParam(
            role="user",
            content=[
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/api-reference",
                    title="API Reference - Authentication",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        )
                    ],
                    citations={"enabled": True}
                ),
                SearchResultBlockParam(
                    type="search_result",
                    source="https://docs.company.com/quickstart",
                    title="Getting Started Guide",
                    content=[
                        TextBlockParam(
                            type="text",
                            text="To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        )
                    ],
                    citations={"enabled": True}
                ),
                TextBlockParam(
                    type="text",
                    text="Based on these search results, how do I authenticate API requests and what are the rate limits?"
                )
            ]
        )
    ]
)

print(response.model_dump_json(indent=2))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Provide search results directly in the user message
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "search_result" as const,
          source: "https://docs.company.com/api-reference",
          title: "API Reference - Authentication",
          content: [
            {
              type: "text" as const,
              text: "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "search_result" as const,
          source: "https://docs.company.com/quickstart",
          title: "Getting Started Guide",
          content: [
            {
              type: "text" as const,
              text: "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
            }
          ],
          citations: { enabled: true }
        },
        {
          type: "text" as const,
          text: "Based on these search results, how do I authenticate API requests and what are the rate limits?"
        }
      ]
    }
  ]
});

console.log(response);
```

```bash Shell
#!/bin/sh
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/api-reference",
                    "title": "API Reference - Authentication",
                    "content": [
                        {
                            "type": "text",
                            "text": "All API requests must include an API key in the Authorization header. Keys can be generated from the dashboard. Rate limits: 1000 requests per hour for standard tier, 10000 for premium."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "search_result",
                    "source": "https://docs.company.com/quickstart",
                    "title": "Getting Started Guide",
                    "content": [
                        {
                            "type": "text",
                            "text": "To get started: 1) Sign up for an account, 2) Generate an API key from the dashboard, 3) Install our SDK using pip install company-sdk, 4) Initialize the client with your API key."
                        }
                    ],
                    "citations": {
                        "enabled": true
                    }
                },
                {
                    "type": "text",
                    "text": "Based on these search results, how do I authenticate API requests and what are the rate limits?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

## Resposta do Claude com citações

Independentemente de como os resultados de busca são fornecidos, Claude inclui automaticamente citações ao usar informações deles:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "To authenticate API requests, you need to include an API key in the Authorization header",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "All API requests must include an API key in the Authorization header",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". You can generate API keys from your dashboard",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Keys can be generated from the dashboard",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    },
    {
      "type": "text",
      "text": ". The rate limits are 1,000 requests per hour for the standard tier and 10,000 requests per hour for the premium tier.",
      "citations": [
        {
          "type": "search_result_location",
          "source": "https://docs.company.com/api-reference",
          "title": "API Reference - Authentication",
          "cited_text": "Rate limits: 1000 requests per hour for standard tier, 10000 for premium",
          "search_result_index": 0,
          "start_block_index": 0,
          "end_block_index": 0
        }
      ]
    }
  ]
}
```

### Campos de citação

Cada citação inclui:

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `type` | string | Sempre `"search_result_location"` para citações de resultados de busca |
| `source` | string | A fonte do resultado de busca original |
| `title` | string ou null | O título do resultado de busca original |
| `cited_text` | string | O texto exato sendo citado |
| `search_result_index` | integer | Índice do resultado de busca (baseado em 0) |
| `start_block_index` | integer | Posição inicial no array de conteúdo |
| `end_block_index` | integer | Posição final no array de conteúdo |

Nota: O `search_result_index` refere-se ao índice do bloco de conteúdo do resultado de busca (baseado em 0), independentemente de como os resultados de busca foram fornecidos (chamada de ferramenta ou conteúdo de nível superior).

## Múltiplos blocos de conteúdo

Os resultados de busca podem conter múltiplos blocos de texto no array `content`:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/api-guide",
  "title": "API Documentation",
  "content": [
    {
      "type": "text",
      "text": "Authentication: All API requests require an API key."
    },
    {
      "type": "text",
      "text": "Rate Limits: The API allows 1000 requests per hour per key."
    },
    {
      "type": "text",
      "text": "Error Handling: The API returns standard HTTP status codes."
    }
  ]
}
```

Claude pode citar blocos específicos usando os campos `start_block_index` e `end_block_index`.

## Uso avançado

### Combinando ambos os métodos

Você pode usar resultados de busca baseados em ferramentas e de nível superior na mesma conversa:

```python
# First message with top-level search results
messages = [
    MessageParam(
        role="user",
        content=[
            SearchResultBlockParam(
                type="search_result",
                source="https://docs.company.com/overview",
                title="Product Overview",
                content=[
                    TextBlockParam(type="text", text="Our product helps teams collaborate...")
                ],
                citations={"enabled": True}
            ),
            TextBlockParam(
                type="text",
                text="Tell me about this product and search for pricing information"
            )
        ]
    )
]

# Claude might respond and call a tool to search for pricing
# Then you provide tool results with more search results
```

### Combinando com outros tipos de conteúdo

Ambos os métodos suportam misturar resultados de busca com outro conteúdo:

```python
# In tool results
tool_result = [
    SearchResultBlockParam(
        type="search_result",
        source="https://docs.company.com/guide",
        title="User Guide",
        content=[TextBlockParam(type="text", text="Configuration details...")],
        citations={"enabled": True}
    ),
    TextBlockParam(
        type="text",
        text="Additional context: This applies to version 2.0 and later."
    )
]

# In top-level content
user_content = [
    SearchResultBlockParam(
        type="search_result",
        source="https://research.com/paper",
        title="Research Paper",
        content=[TextBlockParam(type="text", text="Key findings...")],
        citations={"enabled": True}
    ),
    {
        "type": "image",
        "source": {"type": "url", "url": "https://example.com/chart.png"}
    },
    TextBlockParam(
        type="text",
        text="How does the chart relate to the research findings?"
    )
]
```

### Controle de cache

Adicione controle de cache para melhor desempenho:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "..."}],
  "cache_control": {
    "type": "ephemeral"
  }
}
```

### Controle de citação

Por padrão, as citações são desativadas para resultados de busca. Você pode ativar citações definindo explicitamente a configuração `citations`:

```json
{
  "type": "search_result",
  "source": "https://docs.company.com/guide",
  "title": "User Guide",
  "content": [{"type": "text", "text": "Important documentation..."}],
  "citations": {
    "enabled": true  // Enable citations for this result
  }
}
```

Quando `citations.enabled` é definido como `true`, Claude incluirá referências de citação ao usar informações do resultado de busca. Isso permite:
- Citações naturais para suas aplicações RAG personalizadas
- Atribuição de fonte ao interfacear com bases de conhecimento proprietárias
- Citações de qualidade de busca na web para qualquer ferramenta personalizada que retorna resultados de busca

Se o campo `citations` for omitido, as citações serão desativadas por padrão.

<Warning>
As citações são tudo ou nada: ou todos os resultados de busca em uma solicitação devem ter citações ativadas, ou todos devem ter desativadas. Misturar resultados de busca com diferentes configurações de citação resultará em um erro. Se você precisar desativar citações para algumas fontes, você deve desativá-las para todos os resultados de busca nessa solicitação.
</Warning>

## Melhores práticas

### Para busca baseada em ferramentas (Método 1)

- **Conteúdo dinâmico**: Use para buscas em tempo real e aplicações RAG dinâmicas
- **Tratamento de erros**: Retorne mensagens apropriadas quando as buscas falharem
- **Limites de resultado**: Retorne apenas os resultados mais relevantes para evitar estouro de contexto

### Para busca de nível superior (Método 2)

- **Conteúdo pré-buscado**: Use quando você já tem resultados de busca
- **Processamento em lote**: Ideal para processar múltiplos resultados de busca de uma vez
- **Testes**: Ótimo para testar comportamento de citação com conteúdo conhecido

### Melhores práticas gerais

1. **Estruture resultados efetivamente**
   - Use URLs de fonte claras e permanentes
   - Forneça títulos descritivos
   - Divida conteúdo longo em blocos de texto lógicos

2. **Mantenha consistência**
   - Use formatos de fonte consistentes em sua aplicação
   - Garanta que títulos reflitam com precisão o conteúdo
   - Mantenha formatação consistente

3. **Trate erros graciosamente**
   ```python
   def search_with_fallback(query):
       try:
           results = perform_search(query)
           if not results:
               return {"type": "text", "text": "No results found."}
           return format_as_search_results(results)
       except Exception as e:
           return {"type": "text", "text": f"Search error: {str(e)}"}
   ```

## Limitações

- Os blocos de conteúdo de resultado de busca estão disponíveis na Claude API, Amazon Bedrock e Google Cloud's Vertex AI
- Apenas conteúdo de texto é suportado dentro de resultados de busca (sem imagens ou outras mídias)
- O array `content` deve conter pelo menos um bloco de texto