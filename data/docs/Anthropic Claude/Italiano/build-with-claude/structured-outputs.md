# Output strutturati

Ottieni risultati JSON convalidati dai flussi di lavoro degli agenti

---

Gli output strutturati vincolano le risposte di Claude a seguire uno schema specifico, garantendo output valido e analizzabile per l'elaborazione a valle. Sono disponibili due funzionalità complementari:

- **Output JSON** (`output_format`): Ottieni la risposta di Claude in un formato JSON specifico
- **Uso rigoroso degli strumenti** (`strict: true`): Garantisci la convalidazione dello schema sui nomi e gli input degli strumenti

Queste funzionalità possono essere utilizzate indipendentemente o insieme nella stessa richiesta.

<Note>
Gli output strutturati sono attualmente disponibili come funzionalità beta pubblica nell'API Claude per Claude Sonnet 4.5, Claude Opus 4.1, Claude Opus 4.5 e Claude Haiku 4.5.

Per utilizzare la funzionalità, imposta l'[intestazione beta](/docs/it/api/beta-headers) `structured-outputs-2025-11-13`.
</Note>

<Tip>
Condividi il tuo feedback utilizzando questo [modulo](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

## Perché utilizzare gli output strutturati

Senza output strutturati, Claude può generare risposte JSON malformate o input di strumenti non validi che interrompono le tue applicazioni. Anche con un prompt attento, potresti incontrare:
- Errori di analisi da sintassi JSON non valida
- Campi obbligatori mancanti
- Tipi di dati incoerenti
- Violazioni dello schema che richiedono gestione degli errori e nuovi tentativi

Gli output strutturati garantiscono risposte conformi allo schema attraverso la decodifica vincolata:
- **Sempre valido**: Niente più errori `JSON.parse()`
- **Type safe**: Tipi di campo garantiti e campi obbligatori
- **Affidabile**: Nessun nuovo tentativo necessario per le violazioni dello schema

## Output JSON

Gli output JSON controllano il formato della risposta di Claude, assicurando che Claude restituisca JSON valido corrispondente al tuo schema. Utilizza gli output JSON quando hai bisogno di:

- Controllare il formato della risposta di Claude
- Estrarre dati da immagini o testo
- Generare report strutturati
- Formattare risposte API

### Avvio rapido

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: structured-outputs-2025-11-13" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
      }
    ],
    "output_format": {
      "type": "json_schema",
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "email": {"type": "string"},
          "plan_interest": {"type": "string"},
          "demo_requested": {"type": "boolean"}
        },
        "required": ["name", "email", "plan_interest", "demo_requested"],
        "additionalProperties": false
      }
    }
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format={
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"},
                "plan_interest": {"type": "string"},
                "demo_requested": {"type": "boolean"}
            },
            "required": ["name", "email", "plan_interest", "demo_requested"],
            "additionalProperties": False
        }
    }
)
print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
    }
  ],
  output_format: {
    type: "json_schema",
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        plan_interest: { type: "string" },
        demo_requested: { type: "boolean" }
      },
      required: ["name", "email", "plan_interest", "demo_requested"],
      additionalProperties: false
    }
  }
});
console.log(response.content[0].text);
```

</CodeGroup>

**Formato della risposta:** JSON valido corrispondente al tuo schema in `response.content[0].text`

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

### Come funziona

<Steps>
  <Step title="Definisci il tuo schema JSON">
    Crea uno schema JSON che descriva la struttura che desideri che Claude segua. Lo schema utilizza il formato JSON Schema standard con alcune limitazioni (vedi [Limitazioni JSON Schema](#json-schema-limitations)).
  </Step>
  <Step title="Aggiungi il parametro output_format">
    Includi il parametro `output_format` nella tua richiesta API con `type: "json_schema"` e la definizione del tuo schema.
  </Step>
  <Step title="Includi l'intestazione beta">
    Aggiungi l'intestazione `anthropic-beta: structured-outputs-2025-11-13` alla tua richiesta.
  </Step>
  <Step title="Analizza la risposta">
    La risposta di Claude sarà JSON valido corrispondente al tuo schema, restituito in `response.content[0].text`.
  </Step>
</Steps>

### Lavorare con gli output JSON negli SDK

Gli SDK Python e TypeScript forniscono helper che rendono più facile lavorare con gli output JSON, inclusa la trasformazione dello schema, la convalidazione automatica e l'integrazione con librerie di schema popolari.

#### Utilizzo di Pydantic e Zod

Per gli sviluppatori Python e TypeScript, puoi utilizzare strumenti familiari di definizione dello schema come Pydantic e Zod invece di scrivere schemi JSON grezzi.

<CodeGroup>

```python Python
from pydantic import BaseModel
from anthropic import Anthropic, transform_schema

class ContactInfo(BaseModel):
    name: str
    email: str
    plan_interest: str
    demo_requested: bool

client = Anthropic()

# With .create() - requires transform_schema()
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format={
        "type": "json_schema",
        "schema": transform_schema(ContactInfo),
    }
)

print(response.content[0].text)

# With .parse() - can pass Pydantic model directly
response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {
            "role": "user",
            "content": "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
        }
    ],
    output_format=ContactInfo,
)

print(response.parsed_output)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';

const ContactInfoSchema = z.object({
  name: z.string(),
  email: z.string(),
  plan_interest: z.string(),
  demo_requested: z.boolean(),
});

const client = new Anthropic();

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "Extract the key information from this email: John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm."
    }
  ],
  output_format: betaZodOutputFormat(ContactInfoSchema),
});

// Automatically parsed and validated
console.log(response.parsed_output);
```

</CodeGroup>

#### Metodi specifici dell'SDK

**Python: `client.beta.messages.parse()` (Consigliato)**

Il metodo `parse()` trasforma automaticamente il tuo modello Pydantic, convalida la risposta e restituisce un attributo `parsed_output`.

<Note>
Il metodo `parse()` è disponibile su `client.beta.messages`, non su `client.messages`.
</Note>

<section title="Esempio di utilizzo">

```python
from pydantic import BaseModel
import anthropic

class ContactInfo(BaseModel):
    name: str
    email: str
    plan_interest: str

client = anthropic.Anthropic()

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    messages=[{"role": "user", "content": "..."}],
    output_format=ContactInfo,
)

# Access the parsed output directly
contact = response.parsed_output
print(contact.name, contact.email)
```

</section>

**Python: helper `transform_schema()`**

Per quando hai bisogno di trasformare manualmente gli schemi prima di inviarli, o quando desideri modificare uno schema generato da Pydantic. A differenza di `client.beta.messages.parse()`, che trasforma automaticamente gli schemi forniti, questo ti fornisce lo schema trasformato in modo da poterlo personalizzare ulteriormente.

<section title="Esempio di utilizzo">

```python
from anthropic import transform_schema
from pydantic import TypeAdapter

# First convert Pydantic model to JSON schema, then transform
schema = TypeAdapter(ContactInfo).json_schema()
schema = transform_schema(schema)
# Modify schema if needed
schema["properties"]["custom_field"] = {"type": "string"}

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    output_format=schema,
    messages=[{"role": "user", "content": "..."}],
)
```

</section>

#### Come funziona la trasformazione dell'SDK

Sia gli SDK Python che TypeScript trasformano automaticamente gli schemi con funzionalità non supportate:

1. **Rimuovi i vincoli non supportati** (ad es. `minimum`, `maximum`, `minLength`, `maxLength`)
2. **Aggiorna le descrizioni** con informazioni sui vincoli (ad es. "Deve essere almeno 100"), quando il vincolo non è direttamente supportato con output strutturati
3. **Aggiungi `additionalProperties: false`** a tutti gli oggetti
4. **Filtra i formati di stringa** solo all'elenco supportato
5. **Convalida le risposte** rispetto al tuo schema originale (con tutti i vincoli)

Ciò significa che Claude riceve uno schema semplificato, ma il tuo codice applica comunque tutti i vincoli attraverso la convalidazione.

**Esempio:** Un campo Pydantic con `minimum: 100` diventa un semplice numero intero nello schema inviato, ma la descrizione viene aggiornata a "Deve essere almeno 100", e l'SDK convalida la risposta rispetto al vincolo originale.

### Casi d'uso comuni

<section title="Estrazione dei dati">

Estrai dati strutturati da testo non strutturato:

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List

class Invoice(BaseModel):
    invoice_number: str
    date: str
    total_amount: float
    line_items: List[dict]
    customer_name: str

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=Invoice,
    messages=[{"role": "user", "content": f"Extract invoice data from: {invoice_text}"}]
)
```

```typescript TypeScript
import { z } from 'zod';

const InvoiceSchema = z.object({
  invoice_number: z.string(),
  date: z.string(),
  total_amount: z.number(),
  line_items: z.array(z.record(z.any())),
  customer_name: z.string(),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: InvoiceSchema,
  messages: [{"role": "user", "content": `Extract invoice data from: ${invoiceText}`}]
});
```

</CodeGroup>

</section>

<section title="Classificazione">

Classifica il contenuto con categorie strutturate:

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List

class Classification(BaseModel):
    category: str
    confidence: float
    tags: List[str]
    sentiment: str

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=Classification,
    messages=[{"role": "user", "content": f"Classify this feedback: {feedback_text}"}]
)
```

```typescript TypeScript
import { z } from 'zod';

const ClassificationSchema = z.object({
  category: z.string(),
  confidence: z.number(),
  tags: z.array(z.string()),
  sentiment: z.string(),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: ClassificationSchema,
  messages: [{"role": "user", "content": `Classify this feedback: ${feedbackText}`}]
});
```

</CodeGroup>

</section>

<section title="Formattazione della risposta API">

Genera risposte pronte per l'API:

<CodeGroup>

```python Python
from pydantic import BaseModel
from typing import List, Optional

class APIResponse(BaseModel):
    status: str
    data: dict
    errors: Optional[List[dict]]
    metadata: dict

response = client.beta.messages.parse(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    output_format=APIResponse,
    messages=[{"role": "user", "content": "Process this request: ..."}]
)
```

```typescript TypeScript
import { z } from 'zod';

const APIResponseSchema = z.object({
  status: z.string(),
  data: z.record(z.any()),
  errors: z.array(z.record(z.any())).optional(),
  metadata: z.record(z.any()),
});

const response = await client.beta.messages.parse({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  output_format: APIResponseSchema,
  messages: [{"role": "user", "content": "Process this request: ..."}]
});
```

</CodeGroup>

</section>

## Uso rigoroso degli strumenti

L'uso rigoroso degli strumenti convalida i parametri dello strumento, assicurando che Claude chiami le tue funzioni con argomenti correttamente tipizzati. Utilizza l'uso rigoroso degli strumenti quando hai bisogno di:

- Convalidare i parametri dello strumento
- Costruire flussi di lavoro agentici
- Garantire chiamate di funzione type-safe
- Gestire strumenti complessi con proprietà annidate

### Perché l'uso rigoroso degli strumenti è importante per gli agenti

La costruzione di sistemi agentici affidabili richiede la conformità garantita dello schema. Senza la modalità rigorosa, Claude potrebbe restituire tipi incompatibili (`"2"` invece di `2`) o campi obbligatori mancanti, interrompendo le tue funzioni e causando errori di runtime.

L'uso rigoroso degli strumenti garantisce parametri type-safe:
- Le funzioni ricevono argomenti correttamente tipizzati ogni volta
- Nessuna necessità di convalidare e riprovare le chiamate dello strumento
- Agenti pronti per la produzione che funzionano in modo coerente su larga scala

Ad esempio, supponiamo che un sistema di prenotazione abbia bisogno di `passengers: int`. Senza la modalità rigorosa, Claude potrebbe fornire `passengers: "two"` o `passengers: "2"`. Con `strict: true`, la risposta conterrà sempre `passengers: 2`.

### Avvio rapido

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: structured-outputs-2025-11-13" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "What is the weather in San Francisco?"}
    ],
    "tools": [{
      "name": "get_weather",
      "description": "Get the current weather in a given location",
      "strict": true,
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"]
          }
        },
        "required": ["location"],
        "additionalProperties": false
      }
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["structured-outputs-2025-11-13"],
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ],
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "strict": True,  # Enable strict mode
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"],
                "additionalProperties": False
            }
        }
    ]
)
print(response.content)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  betas: ["structured-outputs-2025-11-13"],
  messages: [
    {
      role: "user",
      content: "What's the weather like in San Francisco?"
    }
  ],
  tools: [{
    name: "get_weather",
    description: "Get the current weather in a given location",
    strict: true,  // Enable strict mode
    input_schema: {
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA"
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"]
        }
      },
      required: ["location"],
      additionalProperties: false
    }
  }]
});
console.log(response.content);
```

</CodeGroup>

**Formato della risposta:** Blocchi di utilizzo dello strumento con input convalidati in `response.content[x].input`

```json
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**Garanzie:**
- L'`input` dello strumento segue rigorosamente l'`input_schema`
- Il `name` dello strumento è sempre valido (dagli strumenti forniti o dagli strumenti del server)

### Come funziona

<Steps>
  <Step title="Definisci lo schema del tuo strumento">
    Crea uno schema JSON per l'`input_schema` del tuo strumento. Lo schema utilizza il formato JSON Schema standard con alcune limitazioni (vedi [Limitazioni JSON Schema](#json-schema-limitations)).
  </Step>
  <Step title="Aggiungi strict: true">
    Imposta `"strict": true` come proprietà di primo livello nella definizione del tuo strumento, insieme a `name`, `description` e `input_schema`.
  </Step>
  <Step title="Includi l'intestazione beta">
    Aggiungi l'intestazione `anthropic-beta: structured-outputs-2025-11-13` alla tua richiesta.
  </Step>
  <Step title="Gestisci le chiamate dello strumento">
    Quando Claude utilizza lo strumento, il campo `input` nel blocco tool_use seguirà rigorosamente il tuo `input_schema`, e il `name` sarà sempre valido.
  </Step>
</Steps>

### Casi d'uso comuni

<section title="Input dello strumento convalidati">

Assicurati che i parametri dello strumento corrispondano esattamente al tuo schema:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    messages=[{"role": "user", "content": "Search for flights to Tokyo"}],
    tools=[{
        "name": "search_flights",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "departure_date": {"type": "string", "format": "date"},
                "passengers": {"type": "integer", "enum": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            },
            "required": ["destination", "departure_date"],
            "additionalProperties": False
        }
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  messages: [{"role": "user", "content": "Search for flights to Tokyo"}],
  tools: [{
    name: "search_flights",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        destination: {type: "string"},
        departure_date: {type: "string", format: "date"},
        passengers: {type: "integer", enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      },
      required: ["destination", "departure_date"],
      additionalProperties: false
    }
  }]
});
```

</CodeGroup>

</section>

<section title="Flusso di lavoro agentitico con più strumenti convalidati">

Costruisci agenti multi-step affidabili con parametri dello strumento garantiti:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    messages=[{"role": "user", "content": "Help me plan a trip to Paris for 2 people"}],
    tools=[
        {
            "name": "search_flights",
            "strict": True,
            "input_schema": {
                "type": "object",
                "properties": {
                    "origin": {"type": "string"},
                    "destination": {"type": "string"},
                    "departure_date": {"type": "string", "format": "date"},
                    "travelers": {"type": "integer", "enum": [1, 2, 3, 4, 5, 6]}
                },
                "required": ["origin", "destination", "departure_date"],
                "additionalProperties": False
            }
        },
        {
            "name": "search_hotels",
            "strict": True,
            "input_schema": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"},
                    "check_in": {"type": "string", "format": "date"},
                    "guests": {"type": "integer", "enum": [1, 2, 3, 4]}
                },
                "required": ["city", "check_in"],
                "additionalProperties": False
            }
        }
    ]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  messages: [{"role": "user", "content": "Help me plan a trip to Paris for 2 people"}],
  tools: [
    {
      name: "search_flights",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          origin: {type: "string"},
          destination: {type: "string"},
          departure_date: {type: "string", format: "date"},
          travelers: {type: "integer", enum: [1, 2, 3, 4, 5, 6]}
        },
        required: ["origin", "destination", "departure_date"],
        additionalProperties: false
      }
    },
    {
      name: "search_hotels",
      strict: true,
      input_schema: {
        type: "object",
        properties: {
          city: {type: "string"},
          check_in: {type: "string", format: "date"},
          guests: {type: "integer", enum: [1, 2, 3, 4]}
        },
        required: ["city", "check_in"],
        additionalProperties: false
      }
    }
  ]
});
```

</CodeGroup>

</section>

## Utilizzo di entrambe le funzionalità insieme

Gli output JSON e l'uso rigoroso degli strumenti risolvono problemi diversi e possono essere utilizzati insieme:

- **Output JSON** controllano il formato della risposta di Claude (cosa dice Claude)
- **Uso rigoroso degli strumenti** convalida i parametri dello strumento (come Claude chiama le tue funzioni)

Quando combinati, Claude può chiamare strumenti con parametri garantiti validi E restituire risposte JSON strutturate. Questo è utile per i flussi di lavoro agentici in cui hai bisogno sia di chiamate di strumenti affidabili che di output finali strutturati.

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["structured-outputs-2025-11-13"],
    max_tokens=1024,
    messages=[{"role": "user", "content": "Help me plan a trip to Paris for next month"}],
    # JSON outputs: structured response format
    output_format={
        "type": "json_schema",
        "schema": {
            "type": "object",
            "properties": {
                "summary": {"type": "string"},
                "next_steps": {"type": "array", "items": {"type": "string"}}
            },
            "required": ["summary", "next_steps"],
            "additionalProperties": False
        }
    },
    # Strict tool use: guaranteed tool parameters
    tools=[{
        "name": "search_flights",
        "strict": True,
        "input_schema": {
            "type": "object",
            "properties": {
                "destination": {"type": "string"},
                "date": {"type": "string", "format": "date"}
            },
            "required": ["destination", "date"],
            "additionalProperties": False
        }
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["structured-outputs-2025-11-13"],
  max_tokens: 1024,
  messages: [{ role: "user", content: "Help me plan a trip to Paris for next month" }],
  // JSON outputs: structured response format
  output_format: {
    type: "json_schema",
    schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        next_steps: { type: "array", items: { type: "string" } }
      },
      required: ["summary", "next_steps"],
      additionalProperties: false
    }
  },
  // Strict tool use: guaranteed tool parameters
  tools: [{
    name: "search_flights",
    strict: true,
    input_schema: {
      type: "object",
      properties: {
        destination: { type: "string" },
        date: { type: "string", format: "date" }
      },
      required: ["destination", "date"],
      additionalProperties: false
    }
  }]
});
```

</CodeGroup>

## Considerazioni importanti

### Compilazione della grammatica e caching

Gli output strutturati utilizzano il campionamento vincolato con artefatti di grammatica compilati. Questo introduce alcune caratteristiche di prestazione di cui essere consapevoli:

- **Latenza della prima richiesta**: La prima volta che utilizzi uno schema specifico, ci sarà una latenza aggiuntiva mentre la grammatica viene compilata
- **Caching automatico**: Le grammatiche compilate vengono memorizzate nella cache per 24 ore dall'ultimo utilizzo, rendendo le richieste successive molto più veloci
- **Invalidazione della cache**: La cache viene invalidata se modifichi:
  - La struttura dello schema JSON
  - L'insieme di strumenti nella tua richiesta (quando utilizzi sia output strutturati che uso dello strumento)
  - La modifica solo dei campi `name` o `description` non invalida la cache

### Modifica del prompt e costi dei token

Quando utilizzi gli output strutturati, Claude riceve automaticamente un prompt di sistema aggiuntivo che spiega il formato di output previsto. Ciò significa:

- Il tuo conteggio dei token di input sarà leggermente superiore
- Il prompt iniettato ti costa token come qualsiasi altro prompt di sistema
- La modifica del parametro `output_format` invaliderà qualsiasi [cache del prompt](/docs/it/build-with-claude/prompt-caching) per quel thread di conversazione

### Limitazioni JSON Schema

Gli output strutturati supportano JSON Schema standard con alcune limitazioni. Sia gli output JSON che l'uso rigoroso degli strumenti condividono queste limitazioni.

<section title="Funzionalità supportate">

- Tutti i tipi di base: object, array, string, integer, number, boolean, null
- `enum` (solo stringhe, numeri, booleani o null - nessun tipo complesso)
- `const`
- `anyOf` e `allOf` (con limitazioni - `allOf` con `$ref` non supportato)
- `$ref`, `$def` e `definitions` (esterno `$ref` non supportato)
- Proprietà `default` per tutti i tipi supportati
- `required` e `additionalProperties` (deve essere impostato su `false` per gli oggetti)
- Formati di stringa: `date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid`
- Array `minItems` (solo valori 0 e 1 supportati)

</section>

<section title="Non supportato">

- Schemi ricorsivi
- Tipi complessi all'interno di enum
- `$ref` esterno (ad es. `'$ref': 'http://...'`)
- Vincoli numerici (`minimum`, `maximum`, `multipleOf`, ecc.)
- Vincoli di stringa (`minLength`, `maxLength`)
- Vincoli di array oltre `minItems` di 0 o 1
- `additionalProperties` impostato su qualsiasi cosa diversa da `false`

Se utilizzi una funzionalità non supportata, riceverai un errore 400 con i dettagli.

</section>

<section title="Supporto del pattern (regex)">

**Funzionalità regex supportate:**
- Corrispondenza completa (`^...$`) e corrispondenza parziale
- Quantificatori: `*`, `+`, `?`, semplici casi `{n,m}`
- Classi di caratteri: `[]`, `.`, `\d`, `\w`, `\s`
- Gruppi: `(...)`

**NON supportato:**
- Backreference ai gruppi (ad es. `\1`, `\2`)
- Asserzioni lookahead/lookbehind (ad es. `(?=...)`, `(?!...)`)
- Confini di parola: `\b`, `\B`
- Quantificatori `{n,m}` complessi con intervalli grandi

I pattern regex semplici funzionano bene. I pattern complessi possono causare errori 400.

</section>

<Tip>
Gli SDK Python e TypeScript possono trasformare automaticamente gli schemi con funzionalità non supportate rimuovendole e aggiungendo vincoli alle descrizioni dei campi. Vedi [Metodi specifici dell'SDK](#sdk-specific-methods) per i dettagli.
</Tip>

### Output non validi

Sebbene gli output strutturati garantiscano la conformità dello schema nella maggior parte dei casi, ci sono scenari in cui l'output potrebbe non corrispondere al tuo schema:

**Rifiuti** (`stop_reason: "refusal"`)

Claude mantiene le sue proprietà di sicurezza e utilità anche quando utilizza gli output strutturati. Se Claude rifiuta una richiesta per motivi di sicurezza:

- La risposta avrà `stop_reason: "refusal"`
- Riceverai un codice di stato 200
- Ti verrà addebitato per i token generati
- L'output potrebbe non corrispondere al tuo schema perché il messaggio di rifiuto ha la precedenza sui vincoli dello schema

**Limite di token raggiunto** (`stop_reason: "max_tokens"`)

Se la risposta viene interrotta a causa del raggiungimento del limite `max_tokens`:

- La risposta avrà `stop_reason: "max_tokens"`
- L'output potrebbe essere incompleto e non corrispondere al tuo schema
- Riprova con un valore `max_tokens` più alto per ottenere l'output strutturato completo

### Errori di convalidazione dello schema

Se il tuo schema utilizza funzionalità non supportate o è troppo complesso, riceverai un errore 400:

**"Too many recursive definitions in schema"**
- Causa: Lo schema ha definizioni ricorsive eccessive o cicliche
- Soluzione: Semplifica la struttura dello schema, riduci la profondità di annidamento

**"Schema is too complex"**
- Causa: Lo schema supera i limiti di complessità
- Soluzione: Dividi in schemi più piccoli, semplifica la struttura o riduci il numero di strumenti contrassegnati come `strict: true`

Per problemi persistenti con schemi validi, [contatta il supporto](https://support.claude.com/en/articles/9015913-how-to-get-support) con la definizione del tuo schema.

## Compatibilità delle funzionalità

**Funziona con:**
- **[Elaborazione batch](/docs/it/build-with-claude/batch-processing)**: Elabora gli output strutturati su larga scala con sconto del 50%
- **[Conteggio dei token](/docs/it/build-with-claude/token-counting)**: Conta i token senza compilazione
- **[Streaming](/docs/it/build-with-claude/streaming)**: Trasmetti gli output strutturati come risposte normali
- **Utilizzo combinato**: Utilizza gli output JSON (`output_format`) e l'uso rigoroso degli strumenti (`strict: true`) insieme nella stessa richiesta

**Incompatibile con:**
- **[Citazioni](/docs/it/build-with-claude/citations)**: Le citazioni richiedono l'interleaving di blocchi di citazioni con testo, il che entra in conflitto con i vincoli rigorosi dello schema JSON. Restituisce errore 400 se le citazioni sono abilitate con `output_format`.
- **[Prefill dei messaggi](/docs/it/build-with-claude/prompt-engineering/prefill-claudes-response)**: Incompatibile con gli output JSON

<Tip>
**Ambito della grammatica**: Le grammatiche si applicano solo all'output diretto di Claude, non alle chiamate dello strumento, ai risultati dello strumento o ai tag di pensiero (quando si utilizza [Extended Thinking](/docs/it/build-with-claude/extended-thinking)). Lo stato della grammatica si ripristina tra le sezioni, consentendo a Claude di pensare liberamente mentre produce comunque output strutturato nella risposta finale.
</Tip>