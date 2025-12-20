# Strukturierte Ausgaben

Erhalten Sie validierte JSON-Ergebnisse aus Agent-Workflows

---

Strukturierte Ausgaben beschränken Claudes Antworten auf ein bestimmtes Schema und stellen sicher, dass die Ausgabe gültig und analysierbar ist. Zwei komplementäre Funktionen sind verfügbar:

- **JSON-Ausgaben** (`output_format`): Erhalten Sie Claudes Antwort in einem bestimmten JSON-Format
- **Striktes Tool-Verwenden** (`strict: true`): Garantieren Sie Schema-Validierung bei Tool-Namen und Eingaben

Diese Funktionen können unabhängig voneinander oder zusammen in derselben Anfrage verwendet werden.

<Note>
Strukturierte Ausgaben sind derzeit als öffentliche Beta-Funktion in der Claude API für Claude Sonnet 4.5, Claude Opus 4.1, Claude Opus 4.5 und Claude Haiku 4.5 verfügbar.

Um die Funktion zu verwenden, setzen Sie den [Beta-Header](/docs/de/api/beta-headers) `structured-outputs-2025-11-13`.
</Note>

<Tip>
Teilen Sie Feedback über dieses [Formular](https://forms.gle/BFnYc6iCkWoRzFgk7) mit.
</Tip>

## Warum strukturierte Ausgaben verwenden

Ohne strukturierte Ausgaben kann Claude fehlerhafte JSON-Antworten oder ungültige Tool-Eingaben generieren, die Ihre Anwendungen unterbrechen. Selbst mit sorgfältiger Eingabeaufforderung können Sie auf folgende Probleme stoßen:
- Parsing-Fehler durch ungültige JSON-Syntax
- Fehlende erforderliche Felder
- Inkonsistente Datentypen
- Schema-Verletzungen, die Fehlerbehandlung und Wiederholungen erfordern

Strukturierte Ausgaben garantieren Schema-konforme Antworten durch eingeschränkte Dekodierung:
- **Immer gültig**: Keine `JSON.parse()`-Fehler mehr
- **Typsicher**: Garantierte Feldtypen und erforderliche Felder
- **Zuverlässig**: Keine Wiederholungen erforderlich für Schema-Verletzungen

## JSON-Ausgaben

JSON-Ausgaben steuern Claudes Antwortformat und stellen sicher, dass Claude gültiges JSON zurückgibt, das Ihrem Schema entspricht. Verwenden Sie JSON-Ausgaben, wenn Sie:

- Claudes Antwortformat steuern möchten
- Daten aus Bildern oder Text extrahieren möchten
- Strukturierte Berichte generieren möchten
- API-Antworten formatieren möchten

### Schnellstart

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

**Antwortformat:** Gültiges JSON, das Ihrem Schema in `response.content[0].text` entspricht

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

### Funktionsweise

<Steps>
  <Step title="Definieren Sie Ihr JSON-Schema">
    Erstellen Sie ein JSON-Schema, das die Struktur beschreibt, der Claude folgen soll. Das Schema verwendet das Standard-JSON-Schema-Format mit einigen Einschränkungen (siehe [JSON-Schema-Einschränkungen](#json-schema-limitations)).
  </Step>
  <Step title="Fügen Sie den output_format-Parameter hinzu">
    Fügen Sie den `output_format`-Parameter in Ihre API-Anfrage mit `type: "json_schema"` und Ihrer Schema-Definition ein.
  </Step>
  <Step title="Fügen Sie den Beta-Header ein">
    Fügen Sie den `anthropic-beta: structured-outputs-2025-11-13`-Header zu Ihrer Anfrage hinzu.
  </Step>
  <Step title="Analysieren Sie die Antwort">
    Claudes Antwort wird gültiges JSON sein, das Ihrem Schema entspricht und in `response.content[0].text` zurückgegeben wird.
  </Step>
</Steps>

### Arbeiten mit JSON-Ausgaben in SDKs

Die Python- und TypeScript-SDKs bieten Hilfsfunktionen, die die Arbeit mit JSON-Ausgaben erleichtern, einschließlich Schema-Transformation, automatischer Validierung und Integration mit beliebten Schema-Bibliotheken.

#### Verwendung von Pydantic und Zod

Für Python- und TypeScript-Entwickler können Sie vertraute Schema-Definitionswerkzeuge wie Pydantic und Zod verwenden, anstatt rohe JSON-Schemas zu schreiben.

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

#### SDK-spezifische Methoden

**Python: `client.beta.messages.parse()` (Empfohlen)**

Die `parse()`-Methode transformiert automatisch Ihr Pydantic-Modell, validiert die Antwort und gibt ein `parsed_output`-Attribut zurück.

<Note>
Die `parse()`-Methode ist auf `client.beta.messages` verfügbar, nicht auf `client.messages`.
</Note>

<section title="Beispielverwendung">

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

**Python: `transform_schema()`-Hilfsfunktion**

Für den Fall, dass Sie Schemas manuell transformieren müssen, bevor Sie sie senden, oder wenn Sie ein von Pydantic generiertes Schema ändern möchten. Im Gegensatz zu `client.beta.messages.parse()`, das bereitgestellte Schemas automatisch transformiert, erhalten Sie hier das transformierte Schema, damit Sie es weiter anpassen können.

<section title="Beispielverwendung">

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

#### Funktionsweise der SDK-Transformation

Beide Python- und TypeScript-SDKs transformieren Schemas automatisch mit nicht unterstützten Funktionen:

1. **Entfernen Sie nicht unterstützte Einschränkungen** (z. B. `minimum`, `maximum`, `minLength`, `maxLength`)
2. **Aktualisieren Sie Beschreibungen** mit Einschränkungsinformationen (z. B. „Muss mindestens 100 sein"), wenn die Einschränkung nicht direkt mit strukturierten Ausgaben unterstützt wird
3. **Fügen Sie `additionalProperties: false`** zu allen Objekten hinzu
4. **Filtern Sie String-Formate** auf unterstützte Liste nur
5. **Validieren Sie Antworten** gegen Ihr ursprüngliches Schema (mit allen Einschränkungen)

Dies bedeutet, dass Claude ein vereinfachtes Schema erhält, aber Ihr Code erzwingt immer noch alle Einschränkungen durch Validierung.

**Beispiel:** Ein Pydantic-Feld mit `minimum: 100` wird zu einer einfachen Ganzzahl im gesendeten Schema, aber die Beschreibung wird auf „Muss mindestens 100 sein" aktualisiert, und das SDK validiert die Antwort gegen die ursprüngliche Einschränkung.

### Häufige Anwendungsfälle

<section title="Datenextraktion">

Extrahieren Sie strukturierte Daten aus unstrukturiertem Text:

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

<section title="Klassifizierung">

Klassifizieren Sie Inhalte mit strukturierten Kategorien:

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

<section title="API-Antwortformatierung">

Generieren Sie API-bereite Antworten:

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

## Striktes Tool-Verwenden

Striktes Tool-Verwenden validiert Tool-Parameter und stellt sicher, dass Claude Ihre Funktionen mit korrekt typisierten Argumenten aufruft. Verwenden Sie striktes Tool-Verwenden, wenn Sie:

- Tool-Parameter validieren möchten
- Agentic-Workflows erstellen möchten
- Typsichere Funktionsaufrufe sicherstellen möchten
- Komplexe Tools mit verschachtelten Eigenschaften handhaben möchten

### Warum striktes Tool-Verwenden für Agenten wichtig ist

Der Aufbau zuverlässiger Agentensysteme erfordert garantierte Schema-Konformität. Ohne strikten Modus könnte Claude inkompatible Typen (`"2"` statt `2`) oder fehlende erforderliche Felder zurückgeben, was Ihre Funktionen unterbricht und Laufzeitfehler verursacht.

Striktes Tool-Verwenden garantiert typsichere Parameter:
- Funktionen erhalten jedes Mal korrekt typisierte Argumente
- Keine Notwendigkeit, Tool-Aufrufe zu validieren und zu wiederholen
- Produktionsreife Agenten, die konsistent im großen Maßstab funktionieren

Angenommen, ein Buchungssystem benötigt `passengers: int`. Ohne strikten Modus könnte Claude `passengers: "two"` oder `passengers: "2"` bereitstellen. Mit `strict: true` enthält die Antwort immer `passengers: 2`.

### Schnellstart

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

**Antwortformat:** Tool-Use-Blöcke mit validierten Eingaben in `response.content[x].input`

```json
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**Garantien:**
- Tool `input` folgt streng dem `input_schema`
- Tool `name` ist immer gültig (von bereitgestellten Tools oder Server-Tools)

### Funktionsweise

<Steps>
  <Step title="Definieren Sie Ihr Tool-Schema">
    Erstellen Sie ein JSON-Schema für das `input_schema` Ihres Tools. Das Schema verwendet das Standard-JSON-Schema-Format mit einigen Einschränkungen (siehe [JSON-Schema-Einschränkungen](#json-schema-limitations)).
  </Step>
  <Step title="Fügen Sie strict: true hinzu">
    Setzen Sie `"strict": true` als Top-Level-Eigenschaft in Ihrer Tool-Definition, neben `name`, `description` und `input_schema`.
  </Step>
  <Step title="Fügen Sie den Beta-Header ein">
    Fügen Sie den `anthropic-beta: structured-outputs-2025-11-13`-Header zu Ihrer Anfrage hinzu.
  </Step>
  <Step title="Behandeln Sie Tool-Aufrufe">
    Wenn Claude das Tool verwendet, folgt das `input`-Feld im tool_use-Block streng Ihrem `input_schema`, und der `name` ist immer gültig.
  </Step>
</Steps>

### Häufige Anwendungsfälle

<section title="Validierte Tool-Eingaben">

Stellen Sie sicher, dass Tool-Parameter genau Ihrem Schema entsprechen:

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

<section title="Agentic-Workflow mit mehreren validierten Tools">

Erstellen Sie zuverlässige mehrstufige Agenten mit garantierten Tool-Parametern:

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

## Verwendung beider Funktionen zusammen

JSON-Ausgaben und striktes Tool-Verwenden lösen verschiedene Probleme und können zusammen verwendet werden:

- **JSON-Ausgaben** steuern Claudes Antwortformat (was Claude sagt)
- **Striktes Tool-Verwenden** validiert Tool-Parameter (wie Claude Ihre Funktionen aufruft)

In Kombination kann Claude Tools mit garantiert gültigen Parametern aufrufen UND strukturierte JSON-Antworten zurückgeben. Dies ist nützlich für Agentic-Workflows, bei denen Sie sowohl zuverlässige Tool-Aufrufe als auch strukturierte endgültige Ausgaben benötigen.

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

## Wichtige Überlegungen

### Grammatik-Kompilierung und Caching

Strukturierte Ausgaben verwenden eingeschränkte Sampling mit kompilierten Grammatik-Artefakten. Dies führt zu einigen Leistungsmerkmalen, die Sie beachten sollten:

- **Erste Anfrage-Latenz**: Das erste Mal, wenn Sie ein bestimmtes Schema verwenden, gibt es zusätzliche Latenz während die Grammatik kompiliert wird
- **Automatisches Caching**: Kompilierte Grammatiken werden 24 Stunden lang ab der letzten Verwendung zwischengespeichert, was nachfolgende Anfragen viel schneller macht
- **Cache-Invalidierung**: Der Cache wird invalidiert, wenn Sie ändern:
  - Die JSON-Schema-Struktur
  - Die Menge der Tools in Ihrer Anfrage (bei Verwendung von strukturierten Ausgaben und Tool-Verwenden zusammen)
  - Das Ändern nur von `name`- oder `description`-Feldern invalidiert den Cache nicht

### Prompt-Änderung und Token-Kosten

Bei Verwendung von strukturierten Ausgaben erhält Claude automatisch einen zusätzlichen System-Prompt, der das erwartete Ausgabeformat erklärt. Dies bedeutet:

- Ihre Input-Token-Anzahl wird leicht höher sein
- Der injizierte Prompt kostet Sie Token wie jeder andere System-Prompt
- Das Ändern des `output_format`-Parameters invalidiert jedes [Prompt-Cache](/docs/de/build-with-claude/prompt-caching) für diesen Gesprächsfaden

### JSON-Schema-Einschränkungen

Strukturierte Ausgaben unterstützen Standard-JSON-Schema mit einigen Einschränkungen. Sowohl JSON-Ausgaben als auch striktes Tool-Verwenden teilen diese Einschränkungen.

<section title="Unterstützte Funktionen">

- Alle grundlegenden Typen: object, array, string, integer, number, boolean, null
- `enum` (nur Strings, Zahlen, Bools oder Nulls - keine komplexen Typen)
- `const`
- `anyOf` und `allOf` (mit Einschränkungen - `allOf` mit `$ref` nicht unterstützt)
- `$ref`, `$def` und `definitions` (externe `$ref` nicht unterstützt)
- `default`-Eigenschaft für alle unterstützten Typen
- `required` und `additionalProperties` (muss auf `false` für Objekte gesetzt sein)
- String-Formate: `date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid`
- Array `minItems` (nur Werte 0 und 1 unterstützt)

</section>

<section title="Nicht unterstützt">

- Rekursive Schemas
- Komplexe Typen innerhalb von Enums
- Externe `$ref` (z. B. `'$ref': 'http://...'`)
- Numerische Einschränkungen (`minimum`, `maximum`, `multipleOf`, etc.)
- String-Einschränkungen (`minLength`, `maxLength`)
- Array-Einschränkungen über `minItems` von 0 oder 1 hinaus
- `additionalProperties` auf etwas anderes als `false` gesetzt

Wenn Sie eine nicht unterstützte Funktion verwenden, erhalten Sie einen 400-Fehler mit Details.

</section>

<section title="Pattern-Unterstützung (Regex)">

**Unterstützte Regex-Funktionen:**
- Vollständiges Matching (`^...$`) und teilweises Matching
- Quantoren: `*`, `+`, `?`, einfache `{n,m}`-Fälle
- Zeichenklassen: `[]`, `.`, `\d`, `\w`, `\s`
- Gruppen: `(...)`

**NICHT unterstützt:**
- Rückreferenzen zu Gruppen (z. B. `\1`, `\2`)
- Lookahead/Lookbehind-Assertions (z. B. `(?=...)`, `(?!...)`)
- Wortgrenzen: `\b`, `\B`
- Komplexe `{n,m}`-Quantoren mit großen Bereichen

Einfache Regex-Muster funktionieren gut. Komplexe Muster können zu 400-Fehlern führen.

</section>

<Tip>
Die Python- und TypeScript-SDKs können Schemas mit nicht unterstützten Funktionen automatisch transformieren, indem sie diese entfernen und Einschränkungen zu Feldbeschreibungen hinzufügen. Siehe [SDK-spezifische Methoden](#sdk-specific-methods) für Details.
</Tip>

### Ungültige Ausgaben

Während strukturierte Ausgaben in den meisten Fällen Schema-Konformität garantieren, gibt es Szenarien, in denen die Ausgabe möglicherweise nicht Ihrem Schema entspricht:

**Ablehnungen** (`stop_reason: "refusal"`)

Claude behält seine Sicherheits- und Hilfreichkeitseigenschaften auch bei Verwendung von strukturierten Ausgaben. Wenn Claude eine Anfrage aus Sicherheitsgründen ablehnt:

- Die Antwort hat `stop_reason: "refusal"`
- Sie erhalten einen 200-Statuscode
- Sie werden für die generierten Token abgerechnet
- Die Ausgabe entspricht möglicherweise nicht Ihrem Schema, da die Ablehnungsmeldung Vorrang vor Schema-Einschränkungen hat

**Token-Limit erreicht** (`stop_reason: "max_tokens"`)

Wenn die Antwort aufgrund des Erreichens des `max_tokens`-Limits abgeschnitten wird:

- Die Antwort hat `stop_reason: "max_tokens"`
- Die Ausgabe kann unvollständig sein und nicht Ihrem Schema entsprechen
- Wiederholen Sie mit einem höheren `max_tokens`-Wert, um die vollständige strukturierte Ausgabe zu erhalten

### Schema-Validierungsfehler

Wenn Ihr Schema nicht unterstützte Funktionen verwendet oder zu komplex ist, erhalten Sie einen 400-Fehler:

**"Zu viele rekursive Definitionen im Schema"**
- Ursache: Schema hat übermäßige oder zyklische rekursive Definitionen
- Lösung: Vereinfachen Sie die Schema-Struktur, reduzieren Sie die Verschachtelungstiefe

**"Schema ist zu komplex"**
- Ursache: Schema überschreitet Komplexitätsgrenzen
- Lösung: Teilen Sie in kleinere Schemas auf, vereinfachen Sie die Struktur oder reduzieren Sie die Anzahl der Tools, die als `strict: true` markiert sind

Bei anhaltenden Problemen mit gültigen Schemas [kontaktieren Sie den Support](https://support.claude.com/en/articles/9015913-how-to-get-support) mit Ihrer Schema-Definition.

## Funktionskompatibilität

**Funktioniert mit:**
- **[Batch-Verarbeitung](/docs/de/build-with-claude/batch-processing)**: Verarbeiten Sie strukturierte Ausgaben im großen Maßstab mit 50% Rabatt
- **[Token-Zählung](/docs/de/build-with-claude/token-counting)**: Zählen Sie Token ohne Kompilierung
- **[Streaming](/docs/de/build-with-claude/streaming)**: Streamen Sie strukturierte Ausgaben wie normale Antworten
- **Kombinierte Verwendung**: Verwenden Sie JSON-Ausgaben (`output_format`) und striktes Tool-Verwenden (`strict: true`) zusammen in derselben Anfrage

**Nicht kompatibel mit:**
- **[Zitationen](/docs/de/build-with-claude/citations)**: Zitationen erfordern das Verflechten von Zitationsblöcken mit Text, was mit strikten JSON-Schema-Einschränkungen in Konflikt steht. Gibt 400-Fehler zurück, wenn Zitationen mit `output_format` aktiviert sind.
- **[Message Prefilling](/docs/de/build-with-claude/prompt-engineering/prefill-claudes-response)**: Nicht kompatibel mit JSON-Ausgaben

<Tip>
**Grammatik-Bereich**: Grammatiken gelten nur für Claudes direkte Ausgabe, nicht für Tool-Use-Aufrufe, Tool-Ergebnisse oder Thinking-Tags (bei Verwendung von [Extended Thinking](/docs/de/build-with-claude/extended-thinking)). Der Grammatik-Status wird zwischen Abschnitten zurückgesetzt, sodass Claude frei denken kann, während es immer noch strukturierte Ausgabe in der endgültigen Antwort erzeugt.
</Tip>