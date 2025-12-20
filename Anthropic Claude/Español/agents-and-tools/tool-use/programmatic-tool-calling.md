# Llamada de herramientas programática

Permite que Claude escriba código que llama tus herramientas programáticamente dentro de un contenedor de ejecución de código, reduciendo la latencia y el consumo de tokens.

---

La llamada de herramientas programática permite que Claude escriba código que llama tus herramientas programáticamente dentro de un [contenedor de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool), en lugar de requerir viajes de ida y vuelta a través del modelo para cada invocación de herramienta. Esto reduce la latencia para flujos de trabajo de múltiples herramientas y disminuye el consumo de tokens al permitir que Claude filtre o procese datos antes de que lleguen a la ventana de contexto del modelo.

<Note>
La llamada de herramientas programática está actualmente en beta pública.

Para usar esta función, añade el encabezado beta `"advanced-tool-use-2025-11-20"` [beta header](/docs/es/api/beta-headers) a tus solicitudes de API.

Esta función requiere que la herramienta de ejecución de código esté habilitada.
</Note>

## Compatibilidad de modelos

La llamada de herramientas programática está disponible en los siguientes modelos:

| Modelo | Versión de herramienta |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |

<Warning>
La llamada de herramientas programática está disponible a través de la API de Claude y Microsoft Foundry.
</Warning>

## Inicio rápido

Aquí hay un ejemplo simple donde Claude consulta programáticamente una base de datos varias veces y agrega resultados:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advanced-tool-use-2025-11-20" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
            }
        ],
        "tools": [
            {
                "type": "code_execution_20250825",
                "name": "code_execution"
            },
            {
                "name": "query_database",
                "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "sql": {
                            "type": "string",
                            "description": "SQL query to execute"
                        }
                    },
                    "required": ["sql"]
                },
                "allowed_callers": ["code_execution_20250825"]
            }
        ]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "sql": {
                        "type": "string",
                        "description": "SQL query to execute"
                    }
                },
                "required": ["sql"]
            },
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["advanced-tool-use-2025-11-20"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Query sales data for the West, East, and Central regions, then tell me which region had the highest revenue"
      }
    ],
    tools: [
      {
        type: "code_execution_20250825",
        name: "code_execution"
      },
      {
        name: "query_database",
        description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        input_schema: {
          type: "object",
          properties: {
            sql: {
              type: "string",
              description: "SQL query to execute"
            }
          },
          required: ["sql"]
        },
        allowed_callers: ["code_execution_20250825"]
      }
    ]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Cómo funciona la llamada de herramientas programática

Cuando configuras una herramienta para que sea invocable desde la ejecución de código y Claude decide usar esa herramienta:

1. Claude escribe código Python que invoca la herramienta como una función, potencialmente incluyendo múltiples llamadas de herramienta y lógica de pre/post-procesamiento
2. Claude ejecuta este código en un contenedor aislado a través de la ejecución de código
3. Cuando se llama a una función de herramienta, la ejecución de código se pausa y la API devuelve un bloque `tool_use`
4. Proporcionas el resultado de la herramienta, y la ejecución de código continúa (los resultados intermedios no se cargan en la ventana de contexto de Claude)
5. Una vez que se completa toda la ejecución de código, Claude recibe la salida final y continúa trabajando en la tarea

Este enfoque es particularmente útil para:
- **Procesamiento de datos grandes**: Filtra o agrega resultados de herramientas antes de que lleguen al contexto de Claude
- **Flujos de trabajo de múltiples pasos**: Ahorra tokens y latencia llamando herramientas en serie o en un bucle sin muestrear Claude entre llamadas de herramientas
- **Lógica condicional**: Toma decisiones basadas en resultados de herramientas intermedias

<Note>
Las herramientas personalizadas se convierten en funciones Python asincrónicas para soportar llamadas de herramientas paralelas. Cuando Claude escribe código que llama tus herramientas, usa `await` (por ejemplo, `result = await query_database("<sql>")`) e incluye automáticamente la función de envoltura asincrónica apropiada.

La envoltura asincrónica se omite de los ejemplos de código en esta documentación por claridad.
</Note>

## Conceptos principales

### El campo `allowed_callers`

El campo `allowed_callers` especifica qué contextos pueden invocar una herramienta:

```json
{
  "name": "query_database",
  "description": "Execute a SQL query against the database",
  "input_schema": {...},
  "allowed_callers": ["code_execution_20250825"]
}
```

**Valores posibles:**
- `["direct"]` - Solo Claude puede llamar esta herramienta directamente (predeterminado si se omite)
- `["code_execution_20250825"]` - Solo invocable desde dentro de la ejecución de código
- `["direct", "code_execution_20250825"]` - Invocable tanto directamente como desde la ejecución de código

<Tip>
Recomendamos elegir `["direct"]` o `["code_execution_20250825"]` para cada herramienta en lugar de habilitar ambas, ya que esto proporciona una orientación más clara a Claude sobre cómo usar mejor la herramienta.
</Tip>

### El campo `caller` en respuestas

Cada bloque de uso de herramienta incluye un campo `caller` que indica cómo fue invocado:

**Invocación directa (uso de herramienta tradicional):**
```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {"type": "direct"}
}
```

**Invocación programática:**
```json
{
  "type": "tool_use",
  "id": "toolu_xyz789",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_abc123"
  }
}
```

El `tool_id` hace referencia a la herramienta de ejecución de código que realizó la llamada programática.

### Ciclo de vida del contenedor

La llamada de herramientas programática utiliza los mismos contenedores que la ejecución de código:

- **Creación de contenedor**: Se crea un nuevo contenedor para cada sesión a menos que reutilices uno existente
- **Expiración**: Los contenedores expiran después de aproximadamente 4.5 minutos de inactividad (sujeto a cambios)
- **ID de contenedor**: Se devuelve en respuestas a través del campo `container`
- **Reutilización**: Pasa el ID del contenedor para mantener el estado entre solicitudes

<Warning>
Cuando una herramienta se llama programáticamente y el contenedor está esperando tu resultado de herramienta, debes responder antes de que el contenedor expire. Monitorea el campo `expires_at`. Si el contenedor expira, Claude puede tratar la llamada de herramienta como agotada por tiempo y reintentar.
</Warning>

## Flujo de trabajo de ejemplo

Aquí se muestra cómo funciona un flujo completo de llamada de herramientas programática:

### Paso 1: Solicitud inicial

Envía una solicitud con ejecución de código y una herramienta que permite llamadas programáticas. Para habilitar llamadas programáticas, añade el campo `allowed_callers` a tu definición de herramienta.

<Note>
Proporciona descripciones detalladas del formato de salida de tu herramienta en la descripción de la herramienta. Si especificas que la herramienta devuelve JSON, Claude intentará deserializar y procesar el resultado en código. Cuanto más detalle proporciones sobre el esquema de salida, mejor podrá Claude manejar la respuesta programáticamente.
</Note>

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "query_database",
            "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"
  }],
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution"
    },
    {
      name: "query_database",
      description: "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
      input_schema: {...},
      allowed_callers: ["code_execution_20250825"]
    }
  ]
});
```
</CodeGroup>

### Paso 2: Respuesta de API con llamada de herramienta

Claude escribe código que llama tu herramienta. La API se pausa y devuelve:

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'll query the purchase history and analyze the results."
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_abc123",
      "name": "code_execution",
      "input": {
        "code": "results = await query_database('<sql>')\ntop_customers = sorted(results, key=lambda x: x['revenue'], reverse=True)[:5]\nprint(f'Top 5 customers: {top_customers}')"
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_def456",
      "name": "query_database",
      "input": {"sql": "\<sql\>"},
      "caller": {
        "type": "code_execution_20250825",
        "tool_id": "srvtoolu_abc123"
      }
    }
  ],
  "container": {
    "id": "container_xyz789",
    "expires_at": "2025-01-15T14:30:00Z"
  },
  "stop_reason": "tool_use"
}
```

### Paso 3: Proporcionar resultado de herramienta

Incluye el historial completo de conversación más tu resultado de herramienta:

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    container="container_xyz789",  # Reuse the container
    messages=[
        {"role": "user", "content": "Query customer purchase history from the last quarter and identify our top 5 customers by revenue"},
        {
            "role": "assistant",
            "content": [
                {"type": "text", "text": "I'll query the purchase history and analyze the results."},
                {
                    "type": "server_tool_use",
                    "id": "srvtoolu_abc123",
                    "name": "code_execution",
                    "input": {"code": "..."}
                },
                {
                    "type": "tool_use",
                    "id": "toolu_def456",
                    "name": "query_database",
                    "input": {"sql": "\<sql\>"},
                    "caller": {
                        "type": "code_execution_20250825",
                        "tool_id": "srvtoolu_abc123"
                    }
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "toolu_def456",
                    "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
                }
            ]
        }
    ],
    tools=[...]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  max_tokens: 4096,
  container: "container_xyz789",  // Reuse the container
  messages: [
    { role: "user", content: "Query customer purchase history from the last quarter and identify our top 5 customers by revenue" },
    {
      role: "assistant",
      content: [
        { type: "text", text: "I'll query the purchase history and analyze the results." },
        {
          type: "server_tool_use",
          id: "srvtoolu_abc123",
          name: "code_execution",
          input: { code: "..." }
        },
        {
          type: "tool_use",
          id: "toolu_def456",
          name: "query_database",
          input: { sql: "\<sql\>" },
          caller: {
            type: "code_execution_20250825",
            tool_id: "srvtoolu_abc123"
          }
        }
      ]
    },
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: "toolu_def456",
          content: "[{\"customer_id\": \"C1\", \"revenue\": 45000}, {\"customer_id\": \"C2\", \"revenue\": 38000}, ...]"
        }
      ]
    }
  ],
  tools: [...]
});
```
</CodeGroup>

### Paso 4: Siguiente llamada de herramienta o finalización

La ejecución de código continúa y procesa los resultados. Si se necesitan llamadas de herramienta adicionales, repite el Paso 3 hasta que se satisfagan todas las llamadas de herramienta.

### Paso 5: Respuesta final

Una vez que se completa la ejecución de código, Claude proporciona la respuesta final:

```json
{
  "content": [
    {
      "type": "code_execution_tool_result",
      "tool_use_id": "srvtoolu_abc123",
      "content": {
        "type": "code_execution_result",
        "stdout": "Top 5 customers by revenue:\n1. Customer C1: $45,000\n2. Customer C2: $38,000\n3. Customer C5: $32,000\n4. Customer C8: $28,500\n5. Customer C3: $24,000",
        "stderr": "",
        "return_code": 0,
        "content": []
      }
    },
    {
      "type": "text",
      "text": "I've analyzed the purchase history from last quarter. Your top 5 customers generated $167,500 in total revenue, with Customer C1 leading at $45,000."
    }
  ],
  "stop_reason": "end_turn"
}
```

## Patrones avanzados

### Procesamiento por lotes con bucles

Claude puede escribir código que procesa múltiples elementos de manera eficiente:

```python
# async wrapper omitted for clarity
regions = ["West", "East", "Central", "North", "South"]
results = {}
for region in regions:
    data = await query_database(f"<sql for {region}>")
    results[region] = sum(row["revenue"] for row in data)

# Process results programmatically
top_region = max(results.items(), key=lambda x: x[1])
print(f"Top region: {top_region[0]} with ${top_region[1]:,} in revenue")
```

Este patrón:
- Reduce viajes de modelo de N (uno por región) a 1
- Procesa conjuntos de resultados grandes programáticamente antes de volver a Claude
- Ahorra tokens devolviendo solo conclusiones agregadas en lugar de datos sin procesar

### Terminación temprana

Claude puede dejar de procesar tan pronto como se cumplan los criterios de éxito:

```python
# async wrapper omitted for clarity
endpoints = ["us-east", "eu-west", "apac"]
for endpoint in endpoints:
    status = await check_health(endpoint)
    if status == "healthy":
        print(f"Found healthy endpoint: {endpoint}")
        break  # Stop early, don't check remaining
```

### Selección condicional de herramientas

```python
# async wrapper omitted for clarity
file_info = await get_file_info(path)
if file_info["size"] < 10000:
    content = await read_full_file(path)
else:
    content = await read_file_summary(path)
print(content)
```

### Filtrado de datos

```python
# async wrapper omitted for clarity
logs = await fetch_logs(server_id)
errors = [log for log in logs if "ERROR" in log]
print(f"Found {len(errors)} errors")
for error in errors[-10:]:  # Only return last 10 errors
    print(error)
```

## Formato de respuesta

### Llamada de herramienta programática

Cuando la ejecución de código llama una herramienta:

```json
{
  "type": "tool_use",
  "id": "toolu_abc123",
  "name": "query_database",
  "input": {"sql": "\<sql\>"},
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xyz789"
  }
}
```

### Manejo de resultados de herramientas

Tu resultado de herramienta se pasa de vuelta al código en ejecución:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_abc123",
      "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000, \"orders\": 23}, {\"customer_id\": \"C2\", \"revenue\": 38000, \"orders\": 18}, ...]"
    }
  ]
}
```

### Finalización de ejecución de código

Cuando se satisfacen todas las llamadas de herramienta y el código se completa:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_xyz789",
  "content": {
    "type": "code_execution_result",
    "stdout": "Analysis complete. Top 5 customers identified from 847 total records.",
    "stderr": "",
    "return_code": 0,
    "content": []
  }
}
```

## Manejo de errores

### Errores comunes

| Error | Descripción | Solución |
|-------|-------------|----------|
| `invalid_tool_input` | La entrada de herramienta no coincide con el esquema | Valida el input_schema de tu herramienta |
| `tool_not_allowed` | La herramienta no permite el tipo de llamador solicitado | Verifica que `allowed_callers` incluya los contextos correctos |
| `missing_beta_header` | Encabezado beta de PTC no proporcionado | Añade ambos encabezados beta a tu solicitud |

### Expiración de contenedor durante llamada de herramienta

Si tu herramienta tarda demasiado en responder, la ejecución de código recibirá un `TimeoutError`. Claude lo ve en stderr e intentará típicamente reintentar:

```json
{
  "type": "code_execution_tool_result",
  "tool_use_id": "srvtoolu_abc123",
  "content": {
    "type": "code_execution_result",
    "stdout": "",
    "stderr": "TimeoutError: Calling tool ['query_database'] timed out.",
    "return_code": 0,
    "content": []
  }
}
```

Para prevenir tiempos de espera:
- Monitorea el campo `expires_at` en respuestas
- Implementa tiempos de espera para tu ejecución de herramienta
- Considera dividir operaciones largas en fragmentos más pequeños

### Errores de ejecución de herramientas

Si tu herramienta devuelve un error:

```python
# Provide error information in the tool result
{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "Error: Query timeout - table lock exceeded 30 seconds"
}
```

El código de Claude recibirá este error y puede manejarlo apropiadamente.

## Restricciones y limitaciones

### Incompatibilidades de características

- **Salidas estructuradas**: Las herramientas con `strict: true` no son compatibles con llamadas programáticas
- **Elección de herramienta**: No puedes forzar la llamada programática de una herramienta específica a través de `tool_choice`
- **Uso de herramientas paralelas**: `disable_parallel_tool_use: true` no es compatible con llamadas programáticas

### Restricciones de herramientas

Las siguientes herramientas actualmente no pueden ser llamadas programáticamente, pero el soporte puede añadirse en futuras versiones:

- Búsqueda web
- Obtención web
- Herramientas proporcionadas por un [conector MCP](/docs/es/agents-and-tools/mcp-connector)

### Restricciones de formato de mensajes

Al responder a llamadas de herramientas programáticas, hay requisitos de formato estrictos:

**Respuestas solo de resultado de herramienta**: Si hay llamadas de herramientas programáticas pendientes esperando resultados, tu mensaje de respuesta debe contener **solo** bloques `tool_result`. No puedes incluir ningún contenido de texto, ni siquiera después de los resultados de herramientas.

```json
// ❌ INVÁLIDO - No puedes incluir texto al responder a llamadas de herramientas programáticas
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"},
    {"type": "text", "text": "What should I do next?"}  // This will cause an error
  ]
}

// ✅ VÁLIDO - Solo resultados de herramientas al responder a llamadas de herramientas programáticas
{
  "role": "user",
  "content": [
    {"type": "tool_result", "tool_use_id": "toolu_01", "content": "[{\"customer_id\": \"C1\", \"revenue\": 45000}]"}
  ]
}
```

Esta restricción solo se aplica al responder a llamadas de herramientas programáticas (ejecución de código). Para llamadas de herramientas regulares del lado del cliente, puedes incluir contenido de texto después de resultados de herramientas.

### Límites de velocidad

Las llamadas de herramientas programáticas están sujetas a los mismos límites de velocidad que las llamadas de herramientas regulares. Cada llamada de herramienta desde la ejecución de código cuenta como una invocación separada.

### Valida resultados de herramientas antes de usar

Al implementar herramientas personalizadas que serán llamadas programáticamente:

- **Los resultados de herramientas se devuelven como cadenas**: Pueden contener cualquier contenido, incluyendo fragmentos de código o comandos ejecutables que pueden ser procesados por el entorno de ejecución.
- **Valida resultados de herramientas externas**: Si tu herramienta devuelve datos de fuentes externas o acepta entrada del usuario, ten cuidado con riesgos de inyección de código si la salida será interpretada o ejecutada como código.

## Eficiencia de tokens

La llamada de herramientas programática puede reducir significativamente el consumo de tokens:

- **Los resultados de herramientas de llamadas programáticas no se añaden al contexto de Claude** - solo la salida final del código
- **El procesamiento intermedio ocurre en código** - filtrado, agregación, etc. no consumen tokens del modelo
- **Múltiples llamadas de herramientas en una ejecución de código** - reduce la sobrecarga en comparación con turnos de modelo separados

Por ejemplo, llamar 10 herramientas directamente usa ~10x los tokens de llamarlas programáticamente y devolver un resumen.

## Uso y precios

La llamada de herramientas programática utiliza los mismos precios que la ejecución de código. Consulta los [precios de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool#usage-and-pricing) para más detalles.

<Note>
Conteo de tokens para llamadas de herramientas programáticas: Los resultados de herramientas de invocaciones programáticas no cuentan hacia tu uso de tokens de entrada/salida. Solo el resultado final de ejecución de código y la respuesta de Claude cuentan.
</Note>

## Mejores prácticas

### Diseño de herramientas

- **Proporciona descripciones detalladas de salida**: Dado que Claude deserializa resultados de herramientas en código, documenta claramente el formato (estructura JSON, tipos de campos, etc.)
- **Devuelve datos estructurados**: Formatos JSON u otros fácilmente analizables funcionan mejor para procesamiento programático
- **Mantén respuestas concisas**: Devuelve solo datos necesarios para minimizar la sobrecarga de procesamiento

### Cuándo usar llamadas programáticas

**Casos de uso buenos:**
- Procesamiento de conjuntos de datos grandes donde solo necesitas agregados o resúmenes
- Flujos de trabajo de múltiples pasos con 3+ llamadas de herramientas dependientes
- Operaciones que requieren filtrado, ordenamiento o transformación de resultados de herramientas
- Tareas donde datos intermedios no deberían influir en el razonamiento de Claude
- Operaciones paralelas en muchos elementos (por ejemplo, verificar 50 puntos finales)

**Casos de uso menos ideales:**
- Llamadas de herramientas únicas con respuestas simples
- Herramientas que necesitan retroalimentación inmediata del usuario
- Operaciones muy rápidas donde la sobrecarga de ejecución de código superaría el beneficio

### Optimización de rendimiento

- **Reutiliza contenedores** cuando hagas múltiples solicitudes relacionadas para mantener el estado
- **Agrupa operaciones similares** en una única ejecución de código cuando sea posible

## Solución de problemas

### Problemas comunes

**Error "Tool not allowed"**
- Verifica que tu definición de herramienta incluya `"allowed_callers": ["code_execution_20250825"]`
- Comprueba que estés usando los encabezados beta correctos

**Expiración de contenedor**
- Asegúrate de responder a llamadas de herramientas dentro de la vida útil del contenedor (~4.5 minutos)
- Monitorea el campo `expires_at` en respuestas
- Considera implementar ejecución de herramientas más rápida

**Problemas de encabezado beta**
- Necesitas el encabezado: `"advanced-tool-use-2025-11-20"`

**Resultado de herramienta no analizado correctamente**
- Asegúrate de que tu herramienta devuelva datos de cadena que Claude pueda deserializar
- Proporciona documentación clara del formato de salida en tu descripción de herramienta

### Consejos de depuración

1. **Registra todas las llamadas de herramientas y resultados** para rastrear el flujo
2. **Verifica el campo `caller`** para confirmar invocación programática
3. **Monitorea IDs de contenedor** para asegurar reutilización adecuada
4. **Prueba herramientas independientemente** antes de habilitar llamadas programáticas

## Por qué funciona la llamada de herramientas programática

El entrenamiento de Claude incluye exposición extensiva a código, lo que lo hace efectivo en razonamiento y encadenamiento de llamadas de funciones. Cuando las herramientas se presentan como funciones invocables dentro de un entorno de ejecución de código, Claude puede aprovechar esta fortaleza para:

- **Razonar naturalmente sobre composición de herramientas**: Encadenar operaciones y manejar dependencias tan naturalmente como escribir cualquier código Python
- **Procesar resultados grandes de manera eficiente**: Filtra resultados grandes de herramientas, extrae solo datos relevantes, o escribe resultados intermedios en archivos antes de devolver resúmenes a la ventana de contexto
- **Reducir latencia significativamente**: Elimina la sobrecarga de re-muestrear Claude entre cada llamada de herramienta en flujos de trabajo de múltiples pasos

Este enfoque habilita flujos de trabajo que serían impracticables con uso de herramientas tradicional—como procesar archivos sobre 1M tokens—al permitir que Claude trabaje con datos programáticamente en lugar de cargar todo en el contexto de conversación.

## Implementaciones alternativas

La llamada de herramientas programática es un patrón generalizable que puede ser implementado fuera de la ejecución de código gestionada de Anthropic. Aquí hay una descripción general de los enfoques:

### Ejecución directa del lado del cliente

Proporciona a Claude una herramienta de ejecución de código y describe qué funciones están disponibles en ese entorno. Cuando Claude invoca la herramienta con código, tu aplicación la ejecuta localmente donde esas funciones están definidas.

**Ventajas:**
- Simple de implementar con re-arquitectura mínima
- Control total sobre el entorno e instrucciones

**Desventajas:**
- Ejecuta código no confiable fuera de un sandbox
- Las invocaciones de herramientas pueden ser vectores para inyección de código

**Usar cuando:** Tu aplicación puede ejecutar de forma segura código arbitrario, quieres una solución simple, y la oferta gestionada de Anthropic no se ajusta a tus necesidades.

### Ejecución aislada auto-gestionada

El mismo enfoque desde la perspectiva de Claude, pero el código se ejecuta en un contenedor aislado con restricciones de seguridad (por ejemplo, sin salida de red). Si tus herramientas requieren recursos externos, necesitarás un protocolo para ejecutar llamadas de herramientas fuera del sandbox.

**Ventajas:**
- Llamada de herramientas programática segura en tu propia infraestructura
- Control total sobre el entorno de ejecución

**Desventajas:**
- Complejo de construir y mantener
- Requiere gestionar tanto infraestructura como comunicación entre procesos

**Usar cuando:** La seguridad es crítica y la solución gestionada de Anthropic no se ajusta a tus requisitos.

### Ejecución gestionada por Anthropic

La llamada de herramientas programática de Anthropic es una versión gestionada de ejecución aislada con un entorno Python opinado sintonizado para Claude. Anthropic maneja la gestión de contenedores, ejecución de código, e invocación de herramientas segura.

**Ventajas:**
- Seguro por defecto
- Fácil de habilitar con configuración mínima
- Entorno e instrucciones optimizados para Claude

Recomendamos usar la solución gestionada de Anthropic si estás usando la API de Claude.

## Características relacionadas

<CardGroup cols={2}>
  <Card title="Herramienta de ejecución de código" icon="code" href="/docs/es/agents-and-tools/tool-use/code-execution-tool">
    Aprende sobre la capacidad de ejecución de código subyacente que potencia la llamada de herramientas programática.
  </Card>
  <Card title="Descripción general de uso de herramientas" icon="wrench" href="/docs/es/agents-and-tools/tool-use/overview">
    Comprende los fundamentos del uso de herramientas con Claude.
  </Card>
  <Card title="Implementar uso de herramientas" icon="hammer" href="/docs/es/agents-and-tools/tool-use/implement-tool-use">
    Guía paso a paso para implementar herramientas.
  </Card>
</CardGroup>