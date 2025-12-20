# Risultati di ricerca

Abilita citazioni naturali per applicazioni RAG fornendo risultati di ricerca con attribuzione della fonte

---

I blocchi di contenuto dei risultati di ricerca abilitano citazioni naturali con corretta attribuzione della fonte, portando citazioni di qualità web search alle tue applicazioni personalizzate. Questa funzione è particolarmente potente per le applicazioni RAG (Retrieval-Augmented Generation) dove hai bisogno che Claude citi le fonti in modo accurato.

La funzione dei risultati di ricerca è disponibile sui seguenti modelli:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Sonnet 3.7 ([deprecato](/docs/it/about-claude/model-deprecations)) (`claude-3-7-sonnet-20250219`)
- Claude 3.5 Haiku (`claude-3-5-haiku-20241022`)

## Vantaggi principali

- **Citazioni naturali** - Raggiungi la stessa qualità di citazione della ricerca web per qualsiasi contenuto
- **Integrazione flessibile** - Usa nei ritorni degli strumenti per RAG dinamico o come contenuto di primo livello per dati pre-recuperati
- **Corretta attribuzione della fonte** - Ogni risultato include informazioni sulla fonte e il titolo per una chiara attribuzione
- **Nessun workaround basato su documenti necessario** - Elimina la necessità di workaround basati su documenti
- **Formato di citazione coerente** - Corrisponde alla qualità e al formato di citazione della funzionalità di ricerca web di Claude

## Come funziona

I risultati di ricerca possono essere forniti in due modi:

1. **Da chiamate di strumenti** - I tuoi strumenti personalizzati restituiscono risultati di ricerca, abilitando applicazioni RAG dinamiche
2. **Come contenuto di primo livello** - Fornisci i risultati di ricerca direttamente nei messaggi dell'utente per contenuto pre-recuperato o memorizzato nella cache

In entrambi i casi, Claude può citare automaticamente le informazioni dai risultati di ricerca con corretta attribuzione della fonte.

### Schema dei risultati di ricerca

I risultati di ricerca utilizzano la seguente struttura:

```json
{
  "type": "search_result",
  "source": "https://example.com/article",  // Obbligatorio: URL della fonte o identificatore
  "title": "Article Title",                  // Obbligatorio: Titolo del risultato
  "content": [                               // Obbligatorio: Array di blocchi di testo
    {
      "type": "text",
      "text": "The actual content of the search result..."
    }
  ],
  "citations": {                             // Facoltativo: Configurazione delle citazioni
    "enabled": true                          // Abilita/disabilita le citazioni per questo risultato
  }
}
```

### Campi obbligatori

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `type` | string | Deve essere `"search_result"` |
| `source` | string | L'URL della fonte o l'identificatore per il contenuto |
| `title` | string | Un titolo descrittivo per il risultato di ricerca |
| `content` | array | Un array di blocchi di testo contenenti il contenuto effettivo |

### Campi facoltativi

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `citations` | object | Configurazione delle citazioni con campo booleano `enabled` |
| `cache_control` | object | Impostazioni di controllo della cache (ad es. `{"type": "ephemeral"}`) |

Ogni elemento nell'array `content` deve essere un blocco di testo con:
- `type`: Deve essere `"text"`
- `text`: Il contenuto di testo effettivo (stringa non vuota)

## Metodo 1: Risultati di ricerca da chiamate di strumenti

Il caso d'uso più potente è restituire risultati di ricerca dai tuoi strumenti personalizzati. Questo abilita applicazioni RAG dinamiche dove gli strumenti recuperano e restituiscono contenuto rilevante con citazioni automatiche.

### Esempio: Strumento di base di conoscenza

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

## Metodo 2: Risultati di ricerca come contenuto di primo livello

Puoi anche fornire risultati di ricerca direttamente nei messaggi dell'utente. Questo è utile per:
- Contenuto pre-recuperato dalla tua infrastruttura di ricerca
- Risultati di ricerca memorizzati nella cache da query precedenti
- Contenuto da servizi di ricerca esterni
- Test e sviluppo

### Esempio: Risultati di ricerca diretti

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

## Risposta di Claude con citazioni

Indipendentemente da come vengono forniti i risultati di ricerca, Claude include automaticamente le citazioni quando utilizza informazioni da essi:

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

### Campi di citazione

Ogni citazione include:

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `type` | string | Sempre `"search_result_location"` per le citazioni dei risultati di ricerca |
| `source` | string | La fonte dal risultato di ricerca originale |
| `title` | string o null | Il titolo dal risultato di ricerca originale |
| `cited_text` | string | Il testo esatto citato |
| `search_result_index` | integer | Indice del risultato di ricerca (basato su 0) |
| `start_block_index` | integer | Posizione iniziale nell'array di contenuto |
| `end_block_index` | integer | Posizione finale nell'array di contenuto |

Nota: `search_result_index` si riferisce all'indice del blocco di contenuto del risultato di ricerca (basato su 0), indipendentemente da come sono stati forniti i risultati di ricerca (chiamata di strumento o contenuto di primo livello).

## Blocchi di contenuto multipli

I risultati di ricerca possono contenere più blocchi di testo nell'array `content`:

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

Claude può citare blocchi specifici utilizzando i campi `start_block_index` e `end_block_index`.

## Utilizzo avanzato

### Combinazione di entrambi i metodi

Puoi usare sia risultati di ricerca basati su strumenti che di primo livello nella stessa conversazione:

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

### Combinazione con altri tipi di contenuto

Entrambi i metodi supportano la miscelazione di risultati di ricerca con altri contenuti:

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

### Controllo della cache

Aggiungi il controllo della cache per migliori prestazioni:

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

### Controllo delle citazioni

Per impostazione predefinita, le citazioni sono disabilitate per i risultati di ricerca. Puoi abilitare le citazioni impostando esplicitamente la configurazione `citations`:

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

Quando `citations.enabled` è impostato su `true`, Claude includerà riferimenti di citazione quando utilizza informazioni dal risultato di ricerca. Questo abilita:
- Citazioni naturali per le tue applicazioni RAG personalizzate
- Attribuzione della fonte quando si interfaccia con basi di conoscenza proprietarie
- Citazioni di qualità web search per qualsiasi strumento personalizzato che restituisce risultati di ricerca

Se il campo `citations` viene omesso, le citazioni sono disabilitate per impostazione predefinita.

<Warning>
Le citazioni sono tutto o niente: o tutti i risultati di ricerca in una richiesta devono avere le citazioni abilitate, oppure tutti devono averle disabilitate. La miscelazione di risultati di ricerca con diverse impostazioni di citazione comporterà un errore. Se hai bisogno di disabilitare le citazioni per alcune fonti, devi disabilitarle per tutti i risultati di ricerca in quella richiesta.
</Warning>

## Migliori pratiche

### Per la ricerca basata su strumenti (Metodo 1)

- **Contenuto dinamico**: Usa per ricerche in tempo reale e applicazioni RAG dinamiche
- **Gestione degli errori**: Restituisci messaggi appropriati quando le ricerche falliscono
- **Limiti dei risultati**: Restituisci solo i risultati più rilevanti per evitare overflow del contesto

### Per la ricerca di primo livello (Metodo 2)

- **Contenuto pre-recuperato**: Usa quando hai già risultati di ricerca
- **Elaborazione batch**: Ideale per l'elaborazione di più risultati di ricerca contemporaneamente
- **Test**: Ottimo per testare il comportamento delle citazioni con contenuto noto

### Migliori pratiche generali

1. **Struttura i risultati in modo efficace**
   - Usa URL di fonte chiari e permanenti
   - Fornisci titoli descrittivi
   - Dividi il contenuto lungo in blocchi di testo logici

2. **Mantieni la coerenza**
   - Usa formati di fonte coerenti in tutta la tua applicazione
   - Assicurati che i titoli riflettano accuratamente il contenuto
   - Mantieni la formattazione coerente

3. **Gestisci gli errori con eleganza**
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

## Limitazioni

- I blocchi di contenuto dei risultati di ricerca sono disponibili su Claude API, Amazon Bedrock e Google Cloud's Vertex AI
- Solo il contenuto di testo è supportato all'interno dei risultati di ricerca (nessuna immagine o altro media)
- L'array `content` deve contenere almeno un blocco di testo