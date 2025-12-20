# Salidas estructuradas

Obtén resultados JSON validados de flujos de trabajo de agentes

---

Las salidas estructuradas restringen las respuestas de Claude para seguir un esquema específico, asegurando una salida válida y analizable para el procesamiento posterior. Hay dos características complementarias disponibles:

- **Salidas JSON** (`output_format`): Obtén la respuesta de Claude en un formato JSON específico
- **Uso estricto de herramientas** (`strict: true`): Garantiza validación de esquema en nombres de herramientas e inputs

Estas características se pueden usar de forma independiente o juntas en la misma solicitud.

<Note>
Las salidas estructuradas están actualmente disponibles como una característica de beta pública en la API de Claude para Claude Sonnet 4.5, Claude Opus 4.1, Claude Opus 4.5 y Claude Haiku 4.5.

Para usar la característica, establece el [encabezado beta](/docs/es/api/beta-headers) `structured-outputs-2025-11-13`.
</Note>

<Tip>
Comparte comentarios usando este [formulario](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

## Por qué usar salidas estructuradas

Sin salidas estructuradas, Claude puede generar respuestas JSON malformadas o inputs de herramientas inválidos que rompan tus aplicaciones. Incluso con un prompting cuidadoso, puedes encontrar:
- Errores de análisis de sintaxis JSON inválida
- Campos requeridos faltantes
- Tipos de datos inconsistentes
- Violaciones de esquema que requieren manejo de errores y reintentos

Las salidas estructuradas garantizan respuestas conformes al esquema mediante decodificación restringida:
- **Siempre válido**: No más errores de `JSON.parse()`
- **Type safe**: Tipos de campo garantizados y campos requeridos
- **Confiable**: No se necesitan reintentos para violaciones de esquema

## Salidas JSON

Las salidas JSON controlan el formato de respuesta de Claude, asegurando que Claude devuelva JSON válido que coincida con tu esquema. Usa salidas JSON cuando necesites:

- Controlar el formato de respuesta de Claude
- Extraer datos de imágenes o texto
- Generar reportes estructurados
- Formatear respuestas de API

### Inicio rápido

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

**Formato de respuesta:** JSON válido que coincide con tu esquema en `response.content[0].text`

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

### Cómo funciona

<Steps>
  <Step title="Define tu esquema JSON">
    Crea un esquema JSON que describa la estructura que deseas que Claude siga. El esquema utiliza el formato estándar de JSON Schema con algunas limitaciones (ver [limitaciones de JSON Schema](#json-schema-limitations)).
  </Step>
  <Step title="Añade el parámetro output_format">
    Incluye el parámetro `output_format` en tu solicitud de API con `type: "json_schema"` y tu definición de esquema.
  </Step>
  <Step title="Incluye el encabezado beta">
    Añade el encabezado `anthropic-beta: structured-outputs-2025-11-13` a tu solicitud.
  </Step>
  <Step title="Analiza la respuesta">
    La respuesta de Claude será JSON válido que coincida con tu esquema, devuelto en `response.content[0].text`.
  </Step>
</Steps>

### Trabajar con salidas JSON en SDKs

Los SDKs de Python y TypeScript proporcionan ayudantes que facilitan trabajar con salidas JSON, incluyendo transformación de esquema, validación automática e integración con bibliotecas de esquema populares.

#### Usando Pydantic y Zod

Para desarrolladores de Python y TypeScript, puedes usar herramientas de definición de esquema familiares como Pydantic y Zod en lugar de escribir esquemas JSON sin procesar.

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

#### Métodos específicos del SDK

**Python: `client.beta.messages.parse()` (Recomendado)**

El método `parse()` transforma automáticamente tu modelo Pydantic, valida la respuesta y devuelve un atributo `parsed_output`.

<Note>
El método `parse()` está disponible en `client.beta.messages`, no en `client.messages`.
</Note>

<section title="Ejemplo de uso">

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

**Python: ayudante `transform_schema()`**

Para cuando necesites transformar manualmente esquemas antes de enviar, o cuando quieras modificar un esquema generado por Pydantic. A diferencia de `client.beta.messages.parse()`, que transforma esquemas proporcionados automáticamente, esto te da el esquema transformado para que puedas personalizarlo aún más.

<section title="Ejemplo de uso">

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

#### Cómo funciona la transformación del SDK

Ambos SDKs de Python y TypeScript transforman automáticamente esquemas con características no soportadas:

1. **Elimina restricciones no soportadas** (por ejemplo, `minimum`, `maximum`, `minLength`, `maxLength`)
2. **Actualiza descripciones** con información de restricciones (por ejemplo, "Debe ser al menos 100"), cuando la restricción no es directamente soportada con salidas estructuradas
3. **Añade `additionalProperties: false`** a todos los objetos
4. **Filtra formatos de cadena** a lista soportada solo
5. **Valida respuestas** contra tu esquema original (con todas las restricciones)

Esto significa que Claude recibe un esquema simplificado, pero tu código aún refuerza todas las restricciones mediante validación.

**Ejemplo:** Un campo Pydantic con `minimum: 100` se convierte en un entero simple en el esquema enviado, pero la descripción se actualiza a "Debe ser al menos 100", y el SDK valida la respuesta contra la restricción original.

### Casos de uso comunes

<section title="Extracción de datos">

Extrae datos estructurados de texto no estructurado:

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

<section title="Clasificación">

Clasifica contenido con categorías estructuradas:

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

<section title="Formateo de respuesta de API">

Genera respuestas listas para API:

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

## Uso estricto de herramientas

El uso estricto de herramientas valida parámetros de herramientas, asegurando que Claude llame a tus funciones con argumentos correctamente tipados. Usa uso estricto de herramientas cuando necesites:

- Validar parámetros de herramientas
- Construir flujos de trabajo de agentes
- Asegurar llamadas de función type-safe
- Manejar herramientas complejas con propiedades anidadas

### Por qué el uso estricto de herramientas es importante para agentes

Construir sistemas de agentes confiables requiere conformidad de esquema garantizada. Sin modo estricto, Claude podría devolver tipos incompatibles (`"2"` en lugar de `2`) o campos requeridos faltantes, rompiendo tus funciones y causando errores en tiempo de ejecución.

El uso estricto de herramientas garantiza parámetros type-safe:
- Las funciones reciben argumentos correctamente tipados cada vez
- No hay necesidad de validar y reintentar llamadas de herramientas
- Agentes listos para producción que funcionan consistentemente a escala

Por ejemplo, supongamos que un sistema de reservas necesita `passengers: int`. Sin modo estricto, Claude podría proporcionar `passengers: "two"` o `passengers: "2"`. Con `strict: true`, la respuesta siempre contendrá `passengers: 2`.

### Inicio rápido

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

**Formato de respuesta:** Bloques de uso de herramientas con inputs validados en `response.content[x].input`

```json
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**Garantías:**
- El `input` de la herramienta sigue estrictamente el `input_schema`
- El `name` de la herramienta siempre es válido (de herramientas proporcionadas o herramientas del servidor)

### Cómo funciona

<Steps>
  <Step title="Define tu esquema de herramienta">
    Crea un esquema JSON para el `input_schema` de tu herramienta. El esquema utiliza el formato estándar de JSON Schema con algunas limitaciones (ver [limitaciones de JSON Schema](#json-schema-limitations)).
  </Step>
  <Step title="Añade strict: true">
    Establece `"strict": true` como una propiedad de nivel superior en tu definición de herramienta, junto a `name`, `description` e `input_schema`.
  </Step>
  <Step title="Incluye el encabezado beta">
    Añade el encabezado `anthropic-beta: structured-outputs-2025-11-13` a tu solicitud.
  </Step>
  <Step title="Maneja llamadas de herramientas">
    Cuando Claude usa la herramienta, el campo `input` en el bloque tool_use seguirá estrictamente tu `input_schema`, y el `name` siempre será válido.
  </Step>
</Steps>

### Casos de uso comunes

<section title="Inputs de herramientas validados">

Asegura que los parámetros de herramientas coincidan exactamente con tu esquema:

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

<section title="Flujo de trabajo de agente con múltiples herramientas validadas">

Construye agentes confiables de múltiples pasos con parámetros de herramientas garantizados:

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

## Usando ambas características juntas

Las salidas JSON y el uso estricto de herramientas resuelven diferentes problemas y se pueden usar juntas:

- **Salidas JSON** controlan el formato de respuesta de Claude (lo que Claude dice)
- **Uso estricto de herramientas** valida parámetros de herramientas (cómo Claude llama a tus funciones)

Cuando se combinan, Claude puede llamar a herramientas con parámetros garantizados válidos Y devolver respuestas JSON estructuradas. Esto es útil para flujos de trabajo de agentes donde necesitas tanto llamadas de herramientas confiables como salidas finales estructuradas.

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

## Consideraciones importantes

### Compilación de gramática y almacenamiento en caché

Las salidas estructuradas utilizan muestreo restringido con artefactos de gramática compilados. Esto introduce algunas características de rendimiento a tener en cuenta:

- **Latencia de primera solicitud**: La primera vez que uses un esquema específico, habrá latencia adicional mientras se compila la gramática
- **Almacenamiento en caché automático**: Las gramáticas compiladas se almacenan en caché durante 24 horas desde el último uso, haciendo que las solicitudes posteriores sean mucho más rápidas
- **Invalidación de caché**: El caché se invalida si cambias:
  - La estructura del esquema JSON
  - El conjunto de herramientas en tu solicitud (cuando se usan tanto salidas estructuradas como uso de herramientas)
  - Cambiar solo campos `name` o `description` no invalida el caché

### Modificación de prompt y costos de tokens

Cuando usas salidas estructuradas, Claude recibe automáticamente un prompt de sistema adicional explicando el formato de salida esperado. Esto significa:

- Tu recuento de tokens de entrada será ligeramente mayor
- El prompt inyectado te cuesta tokens como cualquier otro prompt de sistema
- Cambiar el parámetro `output_format` invalidará cualquier [caché de prompt](/docs/es/build-with-claude/prompt-caching) para ese hilo de conversación

### Limitaciones de JSON Schema

Las salidas estructuradas soportan JSON Schema estándar con algunas limitaciones. Tanto las salidas JSON como el uso estricto de herramientas comparten estas limitaciones.

<section title="Características soportadas">

- Todos los tipos básicos: object, array, string, integer, number, boolean, null
- `enum` (solo cadenas, números, booleanos o nulos - sin tipos complejos)
- `const`
- `anyOf` y `allOf` (con limitaciones - `allOf` con `$ref` no soportado)
- `$ref`, `$def` y `definitions` (`$ref` externo no soportado)
- Propiedad `default` para todos los tipos soportados
- `required` y `additionalProperties` (debe establecerse en `false` para objetos)
- Formatos de cadena: `date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid`
- Array `minItems` (solo valores 0 y 1 soportados)

</section>

<section title="No soportado">

- Esquemas recursivos
- Tipos complejos dentro de enums
- `$ref` externo (por ejemplo, `'$ref': 'http://...'`)
- Restricciones numéricas (`minimum`, `maximum`, `multipleOf`, etc.)
- Restricciones de cadena (`minLength`, `maxLength`)
- Restricciones de array más allá de `minItems` de 0 o 1
- `additionalProperties` establecido en algo distinto a `false`

Si usas una característica no soportada, recibirás un error 400 con detalles.

</section>

<section title="Soporte de patrón (regex)">

**Características de regex soportadas:**
- Coincidencia completa (`^...$`) y coincidencia parcial
- Cuantificadores: `*`, `+`, `?`, casos simples de `{n,m}`
- Clases de caracteres: `[]`, `.`, `\d`, `\w`, `\s`
- Grupos: `(...)`

**NO soportado:**
- Backreferences a grupos (por ejemplo, `\1`, `\2`)
- Aserciones de lookahead/lookbehind (por ejemplo, `(?=...)`, `(?!...)`)
- Límites de palabra: `\b`, `\B`
- Cuantificadores complejos de `{n,m}` con rangos grandes

Los patrones regex simples funcionan bien. Los patrones complejos pueden resultar en errores 400.

</section>

<Tip>
Los SDKs de Python y TypeScript pueden transformar automáticamente esquemas con características no soportadas eliminándolas y añadiendo restricciones a descripciones de campos. Ver [métodos específicos del SDK](#sdk-specific-methods) para detalles.
</Tip>

### Salidas inválidas

Aunque las salidas estructuradas garantizan conformidad de esquema en la mayoría de los casos, hay escenarios donde la salida puede no coincidir con tu esquema:

**Rechazos** (`stop_reason: "refusal"`)

Claude mantiene sus propiedades de seguridad y utilidad incluso cuando usa salidas estructuradas. Si Claude rechaza una solicitud por razones de seguridad:

- La respuesta tendrá `stop_reason: "refusal"`
- Recibirás un código de estado 200
- Se te facturarán los tokens generados
- La salida puede no coincidir con tu esquema porque el mensaje de rechazo tiene prioridad sobre las restricciones de esquema

**Límite de tokens alcanzado** (`stop_reason: "max_tokens"`)

Si la respuesta se corta debido a alcanzar el límite de `max_tokens`:

- La respuesta tendrá `stop_reason: "max_tokens"`
- La salida puede estar incompleta y no coincidir con tu esquema
- Reintenta con un valor de `max_tokens` más alto para obtener la salida estructurada completa

### Errores de validación de esquema

Si tu esquema usa características no soportadas o es demasiado complejo, recibirás un error 400:

**"Too many recursive definitions in schema"**
- Causa: El esquema tiene definiciones recursivas excesivas o cíclicas
- Solución: Simplifica la estructura del esquema, reduce la profundidad de anidamiento

**"Schema is too complex"**
- Causa: El esquema excede los límites de complejidad
- Solución: Divide en esquemas más pequeños, simplifica la estructura o reduce el número de herramientas marcadas como `strict: true`

Para problemas persistentes con esquemas válidos, [contacta con soporte](https://support.claude.com/en/articles/9015913-how-to-get-support) con tu definición de esquema.

## Compatibilidad de características

**Funciona con:**
- **[Procesamiento por lotes](/docs/es/build-with-claude/batch-processing)**: Procesa salidas estructuradas a escala con descuento del 50%
- **[Conteo de tokens](/docs/es/build-with-claude/token-counting)**: Cuenta tokens sin compilación
- **[Streaming](/docs/es/build-with-claude/streaming)**: Transmite salidas estructuradas como respuestas normales
- **Uso combinado**: Usa salidas JSON (`output_format`) y uso estricto de herramientas (`strict: true`) juntos en la misma solicitud

**Incompatible con:**
- **[Citas](/docs/es/build-with-claude/citations)**: Las citas requieren intercalar bloques de citas con texto, lo que entra en conflicto con restricciones de esquema JSON estricto. Devuelve error 400 si las citas están habilitadas con `output_format`.
- **[Prefilling de mensajes](/docs/es/build-with-claude/prompt-engineering/prefill-claudes-response)**: Incompatible con salidas JSON

<Tip>
**Alcance de gramática**: Las gramáticas se aplican solo a la salida directa de Claude, no a llamadas de uso de herramientas, resultados de herramientas o etiquetas de pensamiento (cuando se usa [Extended Thinking](/docs/es/build-with-claude/extended-thinking)). El estado de la gramática se reinicia entre secciones, permitiendo que Claude piense libremente mientras aún produce salida estructurada en la respuesta final.
</Tip>