# Precios

Aprende sobre la estructura de precios de Anthropic para modelos y características

---

Esta página proporciona información detallada de precios para los modelos y características de Anthropic. Todos los precios están en USD.

Para obtener la información de precios más actual, visita [claude.com/pricing](https://claude.com/pricing).

## Precios de modelos

La siguiente tabla muestra los precios para todos los modelos Claude en diferentes niveles de uso:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
MTok = Millones de tokens. La columna "Base Input Tokens" muestra los precios de entrada estándar, "Cache Writes" y "Cache Hits" son específicos del [almacenamiento en caché de prompts](/docs/es/build-with-claude/prompt-caching), y "Output Tokens" muestra los precios de salida. El almacenamiento en caché de prompts ofrece duraciones de caché de 5 minutos (predeterminado) y 1 hora para optimizar costos para diferentes casos de uso.

La tabla anterior refleja los siguientes multiplicadores de precios para el almacenamiento en caché de prompts:
- Los tokens de escritura de caché de 5 minutos son 1.25 veces el precio de los tokens de entrada base
- Los tokens de escritura de caché de 1 hora son 2 veces el precio de los tokens de entrada base
- Los tokens de lectura de caché son 0.1 veces el precio de los tokens de entrada base
</Note>

## Precios de plataformas de terceros

Los modelos Claude están disponibles en [AWS Bedrock](/docs/es/build-with-claude/claude-on-amazon-bedrock), [Google Vertex AI](/docs/es/build-with-claude/claude-on-vertex-ai) y [Microsoft Foundry](/docs/es/build-with-claude/claude-in-microsoft-foundry). Para obtener precios oficiales, visita:
- [Precios de AWS Bedrock](https://aws.amazon.com/bedrock/pricing/)
- [Precios de Google Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Precios de Microsoft Foundry](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Precios de puntos finales regionales para modelos Claude 4.5 y posteriores**

A partir de Claude Sonnet 4.5 y Haiku 4.5, AWS Bedrock y Google Vertex AI ofrecen dos tipos de puntos finales:
- **Puntos finales globales**: Enrutamiento dinámico entre regiones para máxima disponibilidad
- **Puntos finales regionales**: Enrutamiento de datos garantizado dentro de regiones geográficas específicas

Los puntos finales regionales incluyen una prima del 10% sobre los puntos finales globales. **La API de Claude (1P) es global por defecto y no se ve afectada por este cambio.** La API de Claude es solo global (equivalente a la oferta de puntos finales globales y precios de otros proveedores).

**Alcance**: Esta estructura de precios se aplica a Claude Sonnet 4.5, Haiku 4.5 y todos los modelos futuros. Los modelos anteriores (Claude Sonnet 4, Opus 4 y versiones anteriores) mantienen sus precios existentes.

Para detalles de implementación y ejemplos de código:
- [Puntos finales globales vs regionales de AWS Bedrock](/docs/es/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Puntos finales globales vs regionales de Google Vertex AI](/docs/es/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## Precios específicos de características

### Procesamiento por lotes

La API de Batch permite el procesamiento asincrónico de grandes volúmenes de solicitudes con un descuento del 50% en tokens de entrada y salida.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

Para obtener más información sobre el procesamiento por lotes, consulta nuestra [documentación de procesamiento por lotes](/docs/es/build-with-claude/batch-processing).

### Precios de contexto largo

Cuando se utiliza Claude Sonnet 4 o Sonnet 4.5 con la [ventana de contexto de 1M tokens habilitada](/docs/es/build-with-claude/context-windows#1m-token-context-window), las solicitudes que excedan 200K tokens de entrada se cobran automáticamente a tasas de contexto largo premium:

<Note>
La ventana de contexto de 1M tokens está actualmente en beta para organizaciones en [nivel de uso](/docs/es/api/rate-limits) 4 y organizaciones con límites de velocidad personalizados. La ventana de contexto de 1M tokens solo está disponible para Claude Sonnet 4 y Sonnet 4.5.
</Note>

| ≤ 200K tokens de entrada | > 200K tokens de entrada |
|-----------------------------------|-------------------------------------|
| Entrada: $3 / MTok | Entrada: $6 / MTok |
| Salida: $15 / MTok | Salida: $22.50 / MTok |

Los precios de contexto largo se apilan con otros modificadores de precios:
- El [descuento del 50% de la API de Batch](#batch-processing) se aplica a los precios de contexto largo
- Los [multiplicadores de almacenamiento en caché de prompts](#model-pricing) se aplican además de los precios de contexto largo

<Note>
Incluso con la bandera beta habilitada, las solicitudes con menos de 200K tokens de entrada se cobran a tasas estándar. Si tu solicitud excede 200K tokens de entrada, todos los tokens incurren en precios premium.

El umbral de 200K se basa únicamente en tokens de entrada (incluidas lecturas/escrituras de caché). El recuento de tokens de salida no afecta la selección del nivel de precios, aunque los tokens de salida se cobran a la tasa más alta cuando se excede el umbral de entrada.
</Note>

Para verificar si tu solicitud de API se cobró a las tasas de la ventana de contexto de 1M, examina el objeto `usage` en la respuesta de la API:

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

Calcula el total de tokens de entrada sumando:
- `input_tokens`
- `cache_creation_input_tokens` (si se utiliza almacenamiento en caché de prompts)
- `cache_read_input_tokens` (si se utiliza almacenamiento en caché de prompts)

Si el total excede 200,000 tokens, toda la solicitud se facturó a tasas de contexto de 1M.

Para obtener más información sobre el objeto `usage`, consulta la [documentación de respuesta de API](/docs/es/api/messages#response-usage).

### Precios de uso de herramientas

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

Para los precios actuales por modelo, consulta nuestra sección [precios de modelos](#model-pricing) anterior.

Para obtener más información sobre la implementación de uso de herramientas y mejores prácticas, consulta nuestra [documentación de uso de herramientas](/docs/es/agents-and-tools/tool-use/overview).

### Precios de herramientas específicas

#### Herramienta Bash

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Consulta [precios de uso de herramientas](#tool-use-pricing) para obtener detalles completos de precios.

#### Herramienta de ejecución de código

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### Herramienta de editor de texto

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

Consulta [precios de uso de herramientas](#tool-use-pricing) para obtener detalles completos de precios.

#### Herramienta de búsqueda web

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

#### Herramienta de obtención web

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

#### Herramienta de uso de computadora

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## Ejemplos de precios de casos de uso de agentes

Comprender los precios de las aplicaciones de agentes es crucial al construir con Claude. Estos ejemplos del mundo real pueden ayudarte a estimar costos para diferentes patrones de agentes.

### Ejemplo de agente de soporte al cliente

Al construir un agente de soporte al cliente, aquí se muestra cómo podrían desglosarse los costos:

<Note>
  Cálculo de ejemplo para procesar 10,000 tickets de soporte:
  - Aproximadamente ~3,700 tokens por conversación
  - Usando Claude Sonnet 4.5 a $3/MTok entrada, $15/MTok salida
  - Costo total: ~$22.20 por 10,000 tickets
</Note>

Para un recorrido detallado de este cálculo, consulta nuestra [guía de agente de soporte al cliente](/docs/es/about-claude/use-case-guides/customer-support-chat).

### Precios generales de flujo de trabajo de agentes

Para arquitecturas de agentes más complejas con múltiples pasos:

1. **Procesamiento de solicitud inicial**
   - Entrada típica: 500-1,000 tokens
   - Costo de procesamiento: ~$0.003 por solicitud

2. **Recuperación de memoria y contexto**
   - Contexto recuperado: 2,000-5,000 tokens
   - Costo por recuperación: ~$0.015 por operación

3. **Planificación y ejecución de acciones**
   - Tokens de planificación: 1,000-2,000
   - Retroalimentación de ejecución: 500-1,000
   - Costo combinado: ~$0.045 por acción

Para una guía completa sobre patrones de precios de agentes, consulta nuestra [guía de casos de uso de agentes](/docs/es/about-claude/use-case-guides).

### Estrategias de optimización de costos

Al construir agentes con Claude:

1. **Usa modelos apropiados**: Elige Haiku para tareas simples, Sonnet para razonamiento complejo
2. **Implementa almacenamiento en caché de prompts**: Reduce costos para contexto repetido
3. **Operaciones por lotes**: Usa la API de Batch para tareas no sensibles al tiempo
4. **Monitorea patrones de uso**: Realiza un seguimiento del consumo de tokens para identificar oportunidades de optimización

<Tip>
  Para aplicaciones de agentes de alto volumen, considera contactar a nuestro [equipo de ventas empresariales](https://claude.com/contact-sales) para arreglos de precios personalizados.
</Tip>

## Consideraciones adicionales de precios

### Límites de velocidad

Los límites de velocidad varían según el nivel de uso y afectan cuántas solicitudes puedes hacer:

- **Nivel 1**: Uso de nivel de entrada con límites básicos
- **Nivel 2**: Límites aumentados para aplicaciones en crecimiento
- **Nivel 3**: Límites más altos para aplicaciones establecidas
- **Nivel 4**: Límites estándar máximos
- **Empresarial**: Límites personalizados disponibles

Para obtener información detallada sobre límites de velocidad, consulta nuestra [documentación de límites de velocidad](/docs/es/api/rate-limits).

Para límites de velocidad más altos o arreglos de precios personalizados, [contacta a nuestro equipo de ventas](https://claude.com/contact-sales).

### Descuentos por volumen

Los descuentos por volumen pueden estar disponibles para usuarios de alto volumen. Estos se negocian caso por caso.

- Los niveles estándar utilizan los precios mostrados anteriormente
- Los clientes empresariales pueden [contactar a ventas](mailto:sales@anthropic.com) para precios personalizados
- Los descuentos académicos y de investigación pueden estar disponibles

### Precios empresariales

Para clientes empresariales con necesidades específicas:

- Límites de velocidad personalizados
- Descuentos por volumen
- Soporte dedicado
- Términos personalizados

Contacta a nuestro equipo de ventas en [sales@anthropic.com](mailto:sales@anthropic.com) o a través de la [Consola Claude](/settings/limits) para discutir opciones de precios empresariales.

## Facturación y pago

- La facturación se calcula mensualmente según el uso real
- Los pagos se procesan en USD
- Opciones de tarjeta de crédito y facturación disponibles
- Seguimiento de uso disponible en la [Consola Claude](/)

## Preguntas frecuentes

**¿Cómo se calcula el uso de tokens?**

Los tokens son piezas de texto que los modelos procesan. Como estimación aproximada, 1 token es aproximadamente 4 caracteres o 0.75 palabras en inglés. El recuento exacto varía según el idioma y el tipo de contenido.

**¿Hay niveles gratuitos o pruebas?**

Los nuevos usuarios reciben una pequeña cantidad de créditos gratuitos para probar la API. [Contacta a ventas](mailto:sales@anthropic.com) para obtener información sobre pruebas extendidas para evaluación empresarial.

**¿Cómo se apilan los descuentos?**

Los descuentos de la API de Batch y el almacenamiento en caché de prompts se pueden combinar. Por ejemplo, usar ambas características juntas proporciona ahorros de costos significativos en comparación con las llamadas de API estándar.

**¿Qué métodos de pago se aceptan?**

Aceptamos tarjetas de crédito principales para cuentas estándar. Los clientes empresariales pueden organizar facturación y otros métodos de pago.

Para preguntas adicionales sobre precios, contacta a [support@anthropic.com](mailto:support@anthropic.com).