# Saídas estruturadas

Obtenha resultados JSON validados de fluxos de trabalho de agentes

---

Saídas estruturadas restringem as respostas do Claude a seguir um esquema específico, garantindo uma saída válida e analisável para processamento posterior. Dois recursos complementares estão disponíveis:

- **Saídas JSON** (`output_format`): Obtenha a resposta do Claude em um formato JSON específico
- **Uso rigoroso de ferramentas** (`strict: true`): Garanta validação de esquema em nomes de ferramentas e entradas

Esses recursos podem ser usados independentemente ou juntos na mesma solicitação.

<Note>
Saídas estruturadas estão atualmente disponíveis como um recurso de beta público na API Claude para Claude Sonnet 4.5, Claude Opus 4.1, Claude Opus 4.5 e Claude Haiku 4.5.

Para usar o recurso, defina o [cabeçalho beta](/docs/pt-BR/api/beta-headers) `structured-outputs-2025-11-13`.
</Note>

<Tip>
Compartilhe feedback usando este [formulário](https://forms.gle/BFnYc6iCkWoRzFgk7).
</Tip>

## Por que usar saídas estruturadas

Sem saídas estruturadas, Claude pode gerar respostas JSON malformadas ou entradas de ferramentas inválidas que quebram suas aplicações. Mesmo com prompts cuidadosos, você pode encontrar:
- Erros de análise de sintaxe JSON inválida
- Campos obrigatórios ausentes
- Tipos de dados inconsistentes
- Violações de esquema que exigem tratamento de erros e novas tentativas

Saídas estruturadas garantem respostas em conformidade com o esquema através de decodificação restrita:
- **Sempre válido**: Sem mais erros de `JSON.parse()`
- **Seguro em tipo**: Tipos de campo garantidos e campos obrigatórios
- **Confiável**: Sem necessidade de novas tentativas para violações de esquema

## Saídas JSON

Saídas JSON controlam o formato de resposta do Claude, garantindo que Claude retorne JSON válido correspondente ao seu esquema. Use saídas JSON quando você precisar:

- Controlar o formato de resposta do Claude
- Extrair dados de imagens ou texto
- Gerar relatórios estruturados
- Formatar respostas de API

### Início rápido

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

**Formato de resposta:** JSON válido correspondente ao seu esquema em `response.content[0].text`

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

### Como funciona

<Steps>
  <Step title="Defina seu esquema JSON">
    Crie um esquema JSON que descreva a estrutura que você deseja que Claude siga. O esquema usa o formato padrão JSON Schema com algumas limitações (veja [limitações de JSON Schema](#json-schema-limitations)).
  </Step>
  <Step title="Adicione o parâmetro output_format">
    Inclua o parâmetro `output_format` em sua solicitação de API com `type: "json_schema"` e sua definição de esquema.
  </Step>
  <Step title="Inclua o cabeçalho beta">
    Adicione o cabeçalho `anthropic-beta: structured-outputs-2025-11-13` à sua solicitação.
  </Step>
  <Step title="Analise a resposta">
    A resposta do Claude será JSON válido correspondente ao seu esquema, retornado em `response.content[0].text`.
  </Step>
</Steps>

### Trabalhando com saídas JSON em SDKs

Os SDKs Python e TypeScript fornecem auxiliares que facilitam o trabalho com saídas JSON, incluindo transformação de esquema, validação automática e integração com bibliotecas de esquema populares.

#### Usando Pydantic e Zod

Para desenvolvedores Python e TypeScript, você pode usar ferramentas familiares de definição de esquema como Pydantic e Zod em vez de escrever esquemas JSON brutos.

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

#### Métodos específicos do SDK

**Python: `client.beta.messages.parse()` (Recomendado)**

O método `parse()` transforma automaticamente seu modelo Pydantic, valida a resposta e retorna um atributo `parsed_output`.

<Note>
O método `parse()` está disponível em `client.beta.messages`, não em `client.messages`.
</Note>

<section title="Exemplo de uso">

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

**Python: auxiliar `transform_schema()`**

Para quando você precisa transformar manualmente esquemas antes de enviar, ou quando deseja modificar um esquema gerado por Pydantic. Diferentemente de `client.beta.messages.parse()`, que transforma esquemas fornecidos automaticamente, isso fornece o esquema transformado para que você possa personalizá-lo ainda mais.

<section title="Exemplo de uso">

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

#### Como funciona a transformação do SDK

Os SDKs Python e TypeScript transformam automaticamente esquemas com recursos não suportados:

1. **Remova restrições não suportadas** (por exemplo, `minimum`, `maximum`, `minLength`, `maxLength`)
2. **Atualize descrições** com informações de restrição (por exemplo, "Deve ser pelo menos 100"), quando a restrição não é diretamente suportada com saídas estruturadas
3. **Adicione `additionalProperties: false`** a todos os objetos
4. **Filtre formatos de string** para lista suportada apenas
5. **Valide respostas** contra seu esquema original (com todas as restrições)

Isso significa que Claude recebe um esquema simplificado, mas seu código ainda impõe todas as restrições através de validação.

**Exemplo:** Um campo Pydantic com `minimum: 100` se torna um inteiro simples no esquema enviado, mas a descrição é atualizada para "Deve ser pelo menos 100", e o SDK valida a resposta contra a restrição original.

### Casos de uso comuns

<section title="Extração de dados">

Extraia dados estruturados de texto não estruturado:

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

<section title="Classificação">

Classifique conteúdo com categorias estruturadas:

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

<section title="Formatação de resposta de API">

Gere respostas prontas para API:

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

## Uso rigoroso de ferramentas

Uso rigoroso de ferramentas valida parâmetros de ferramentas, garantindo que Claude chame suas funções com argumentos corretamente tipados. Use uso rigoroso de ferramentas quando você precisar:

- Validar parâmetros de ferramentas
- Construir fluxos de trabalho de agentes
- Garantir chamadas de função seguras em tipo
- Lidar com ferramentas complexas com propriedades aninhadas

### Por que o uso rigoroso de ferramentas é importante para agentes

Construir sistemas de agentes confiáveis requer conformidade de esquema garantida. Sem modo rigoroso, Claude pode retornar tipos incompatíveis (`"2"` em vez de `2`) ou campos obrigatórios ausentes, quebrando suas funções e causando erros em tempo de execução.

Uso rigoroso de ferramentas garante parâmetros seguros em tipo:
- Funções recebem argumentos corretamente tipados todas as vezes
- Sem necessidade de validar e tentar novamente chamadas de ferramentas
- Agentes prontos para produção que funcionam consistentemente em escala

Por exemplo, suponha que um sistema de reserva precise de `passengers: int`. Sem modo rigoroso, Claude pode fornecer `passengers: "two"` ou `passengers: "2"`. Com `strict: true`, a resposta sempre conterá `passengers: 2`.

### Início rápido

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

**Formato de resposta:** Blocos de uso de ferramentas com entradas validadas em `response.content[x].input`

```json
{
  "type": "tool_use",
  "name": "get_weather",
  "input": {
    "location": "San Francisco, CA"
  }
}
```

**Garantias:**
- A entrada da ferramenta segue rigorosamente o `input_schema`
- O nome da ferramenta é sempre válido (de ferramentas fornecidas ou ferramentas do servidor)

### Como funciona

<Steps>
  <Step title="Defina seu esquema de ferramenta">
    Crie um esquema JSON para o `input_schema` de sua ferramenta. O esquema usa o formato padrão JSON Schema com algumas limitações (veja [limitações de JSON Schema](#json-schema-limitations)).
  </Step>
  <Step title="Adicione strict: true">
    Defina `"strict": true` como uma propriedade de nível superior em sua definição de ferramenta, junto com `name`, `description` e `input_schema`.
  </Step>
  <Step title="Inclua o cabeçalho beta">
    Adicione o cabeçalho `anthropic-beta: structured-outputs-2025-11-13` à sua solicitação.
  </Step>
  <Step title="Manipule chamadas de ferramentas">
    Quando Claude usa a ferramenta, o campo `input` no bloco tool_use seguirá rigorosamente seu `input_schema`, e o `name` será sempre válido.
  </Step>
</Steps>

### Casos de uso comuns

<section title="Entradas de ferramentas validadas">

Garanta que os parâmetros da ferramenta correspondam exatamente ao seu esquema:

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

<section title="Fluxo de trabalho de agente com múltiplas ferramentas validadas">

Construa agentes confiáveis de múltiplas etapas com parâmetros de ferramentas garantidos:

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

## Usando ambos os recursos juntos

Saídas JSON e uso rigoroso de ferramentas resolvem problemas diferentes e podem ser usados juntos:

- **Saídas JSON** controlam o formato de resposta do Claude (o que Claude diz)
- **Uso rigoroso de ferramentas** valida parâmetros de ferramentas (como Claude chama suas funções)

Quando combinados, Claude pode chamar ferramentas com parâmetros garantidamente válidos E retornar respostas JSON estruturadas. Isso é útil para fluxos de trabalho de agentes onde você precisa de chamadas de ferramentas confiáveis e saídas finais estruturadas.

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

## Considerações importantes

### Compilação de gramática e cache

Saídas estruturadas usam amostragem restrita com artefatos de gramática compilados. Isso introduz algumas características de desempenho a serem observadas:

- **Latência da primeira solicitação**: A primeira vez que você usa um esquema específico, haverá latência adicional enquanto a gramática é compilada
- **Cache automático**: Gramáticas compiladas são armazenadas em cache por 24 horas desde o último uso, tornando solicitações subsequentes muito mais rápidas
- **Invalidação de cache**: O cache é invalidado se você alterar:
  - A estrutura do esquema JSON
  - O conjunto de ferramentas em sua solicitação (ao usar saídas estruturadas e uso de ferramentas)
  - Alterar apenas campos `name` ou `description` não invalida o cache

### Modificação de prompt e custos de token

Ao usar saídas estruturadas, Claude recebe automaticamente um prompt de sistema adicional explicando o formato de saída esperado. Isso significa:

- Sua contagem de token de entrada será ligeiramente maior
- O prompt injetado custa tokens como qualquer outro prompt de sistema
- Alterar o parâmetro `output_format` invalidará qualquer [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) para esse thread de conversa

### Limitações de JSON Schema

Saídas estruturadas suportam JSON Schema padrão com algumas limitações. Tanto saídas JSON quanto uso rigoroso de ferramentas compartilham essas limitações.

<section title="Recursos suportados">

- Todos os tipos básicos: object, array, string, integer, number, boolean, null
- `enum` (apenas strings, números, booleanos ou nulos - sem tipos complexos)
- `const`
- `anyOf` e `allOf` (com limitações - `allOf` com `$ref` não suportado)
- `$ref`, `$def` e `definitions` (`$ref` externo não suportado)
- propriedade `default` para todos os tipos suportados
- `required` e `additionalProperties` (deve ser definido como `false` para objetos)
- Formatos de string: `date-time`, `time`, `date`, `duration`, `email`, `hostname`, `uri`, `ipv4`, `ipv6`, `uuid`
- Array `minItems` (apenas valores 0 e 1 suportados)

</section>

<section title="Não suportado">

- Esquemas recursivos
- Tipos complexos dentro de enums
- `$ref` externo (por exemplo, `'$ref': 'http://...'`)
- Restrições numéricas (`minimum`, `maximum`, `multipleOf`, etc.)
- Restrições de string (`minLength`, `maxLength`)
- Restrições de array além de `minItems` de 0 ou 1
- `additionalProperties` definido como qualquer coisa diferente de `false`

Se você usar um recurso não suportado, receberá um erro 400 com detalhes.

</section>

<section title="Suporte a padrão (regex)">

**Recursos de regex suportados:**
- Correspondência completa (`^...$`) e correspondência parcial
- Quantificadores: `*`, `+`, `?`, casos simples `{n,m}`
- Classes de caracteres: `[]`, `.`, `\d`, `\w`, `\s`
- Grupos: `(...)`

**NÃO suportado:**
- Referências anteriores a grupos (por exemplo, `\1`, `\2`)
- Asserções lookahead/lookbehind (por exemplo, `(?=...)`, `(?!...)`)
- Limites de palavra: `\b`, `\B`
- Quantificadores `{n,m}` complexos com grandes intervalos

Padrões regex simples funcionam bem. Padrões complexos podem resultar em erros 400.

</section>

<Tip>
Os SDKs Python e TypeScript podem transformar automaticamente esquemas com recursos não suportados removendo-os e adicionando restrições às descrições de campo. Veja [métodos específicos do SDK](#sdk-specific-methods) para detalhes.
</Tip>

### Saídas inválidas

Embora saídas estruturadas garantam conformidade de esquema na maioria dos casos, existem cenários onde a saída pode não corresponder ao seu esquema:

**Recusas** (`stop_reason: "refusal"`)

Claude mantém suas propriedades de segurança e utilidade mesmo ao usar saídas estruturadas. Se Claude recusar uma solicitação por motivos de segurança:

- A resposta terá `stop_reason: "refusal"`
- Você receberá um código de status 200
- Você será cobrado pelos tokens gerados
- A saída pode não corresponder ao seu esquema porque a mensagem de recusa tem precedência sobre restrições de esquema

**Limite de token atingido** (`stop_reason: "max_tokens"`)

Se a resposta for cortada devido ao atingimento do limite `max_tokens`:

- A resposta terá `stop_reason: "max_tokens"`
- A saída pode estar incompleta e não corresponder ao seu esquema
- Tente novamente com um valor `max_tokens` mais alto para obter a saída estruturada completa

### Erros de validação de esquema

Se seu esquema usar recursos não suportados ou for muito complexo, você receberá um erro 400:

**"Too many recursive definitions in schema"**
- Causa: O esquema tem definições recursivas excessivas ou cíclicas
- Solução: Simplifique a estrutura do esquema, reduza a profundidade de aninhamento

**"Schema is too complex"**
- Causa: O esquema excede limites de complexidade
- Solução: Divida em esquemas menores, simplifique a estrutura ou reduza o número de ferramentas marcadas como `strict: true`

Para problemas persistentes com esquemas válidos, [entre em contato com o suporte](https://support.claude.com/en/articles/9015913-how-to-get-support) com sua definição de esquema.

## Compatibilidade de recursos

**Funciona com:**
- **[Processamento em lote](/docs/pt-BR/build-with-claude/batch-processing)**: Processe saídas estruturadas em escala com desconto de 50%
- **[Contagem de tokens](/docs/pt-BR/build-with-claude/token-counting)**: Conte tokens sem compilação
- **[Streaming](/docs/pt-BR/build-with-claude/streaming)**: Transmita saídas estruturadas como respostas normais
- **Uso combinado**: Use saídas JSON (`output_format`) e uso rigoroso de ferramentas (`strict: true`) juntos na mesma solicitação

**Incompatível com:**
- **[Citações](/docs/pt-BR/build-with-claude/citations)**: Citações exigem intercalação de blocos de citação com texto, o que entra em conflito com restrições de esquema JSON rigoroso. Retorna erro 400 se citações habilitadas com `output_format`.
- **[Preenchimento de mensagem](/docs/pt-BR/build-with-claude/prompt-engineering/prefill-claudes-response)**: Incompatível com saídas JSON

<Tip>
**Escopo de gramática**: Gramáticas se aplicam apenas à saída direta do Claude, não a chamadas de uso de ferramentas, resultados de ferramentas ou tags de pensamento (ao usar [Pensamento Estendido](/docs/pt-BR/build-with-claude/extended-thinking)). O estado da gramática é redefinido entre seções, permitindo que Claude pense livremente enquanto ainda produz saída estruturada na resposta final.
</Tip>