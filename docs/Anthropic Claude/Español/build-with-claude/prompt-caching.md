# Almacenamiento en caché de indicaciones

Optimiza el uso de tu API permitiendo reanudar desde prefijos específicos en tus indicaciones. Este enfoque reduce significativamente el tiempo de procesamiento y los costos para tareas repetitivas.

---

El almacenamiento en caché de indicaciones es una característica poderosa que optimiza el uso de tu API permitiendo reanudar desde prefijos específicos en tus indicaciones. Este enfoque reduce significativamente el tiempo de procesamiento y los costos para tareas repetitivas o indicaciones con elementos consistentes.

Aquí hay un ejemplo de cómo implementar el almacenamiento en caché de indicaciones con la API de Mensajes usando un bloque `cache_control`:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
      },
      {
        "type": "text",
        "text": "<the entire contents of Pride and Prejudice>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'

# Call the model again with the same inputs up to the cache checkpoint
curl https://api.anthropic.com/v1/messages # rest of input
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        "type": "text",
        "text": "<the entire contents of 'Pride and Prejudice'>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
)
print(response.usage.model_dump_json())

# Call the model again with the same inputs up to the cache checkpoint
response = client.messages.create(.....)
print(response.usage.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
    },
    {
      type: "text",
      text: "<the entire contents of 'Pride and Prejudice'>",
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Analyze the major themes in 'Pride and Prejudice'."
    }
  ]
});
console.log(response.usage);

// Call the model again with the same inputs up to the cache checkpoint
const new_response = await client.messages.create(...)
console.log(new_response.usage);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class PromptCachingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                .build(),
                        TextBlockParam.builder()
                                .text("<the entire contents of 'Pride and Prejudice'>")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.usage());
    }
}
```
</CodeGroup>

```json JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

En este ejemplo, el texto completo de "Pride and Prejudice" se almacena en caché usando el parámetro `cache_control`. Esto permite reutilizar este texto grande en múltiples llamadas a la API sin reprocesarlo cada vez. Cambiar solo el mensaje del usuario te permite hacer varias preguntas sobre el libro mientras utilizas el contenido almacenado en caché, lo que resulta en respuestas más rápidas y una eficiencia mejorada.

---

## Cómo funciona el almacenamiento en caché de indicaciones

Cuando envías una solicitud con el almacenamiento en caché de indicaciones habilitado:

1. El sistema verifica si un prefijo de indicación, hasta un punto de ruptura de caché especificado, ya está almacenado en caché de una consulta reciente.
2. Si se encuentra, utiliza la versión almacenada en caché, reduciendo el tiempo de procesamiento y los costos.
3. De lo contrario, procesa la indicación completa y almacena en caché el prefijo una vez que comienza la respuesta.

Esto es especialmente útil para:
- Indicaciones con muchos ejemplos
- Grandes cantidades de contexto o información de antecedentes
- Tareas repetitivas con instrucciones consistentes
- Conversaciones largas de múltiples turnos

Por defecto, el caché tiene una vida útil de 5 minutos. El caché se actualiza sin costo adicional cada vez que se utiliza el contenido almacenado en caché.

<Note>
Si encuentras que 5 minutos es demasiado corto, Anthropic también ofrece una duración de caché de 1 hora [con costo adicional](#pricing).

Para más información, consulta [duración de caché de 1 hora](#1-hour-cache-duration).
</Note>

<Tip>
  **El almacenamiento en caché de indicaciones almacena el prefijo completo**

El almacenamiento en caché de indicaciones hace referencia a la indicación completa - `tools`, `system`, y `messages` (en ese orden) hasta e incluyendo el bloque designado con `cache_control`.

</Tip>

---
## Precios

El almacenamiento en caché de indicaciones introduce una nueva estructura de precios. La tabla a continuación muestra el precio por millón de tokens para cada modelo compatible:

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
La tabla anterior refleja los siguientes multiplicadores de precios para el almacenamiento en caché de indicaciones:
- Los tokens de escritura de caché de 5 minutos son 1,25 veces el precio de tokens de entrada base
- Los tokens de escritura de caché de 1 hora son 2 veces el precio de tokens de entrada base
- Los tokens de lectura de caché son 0,1 veces el precio de tokens de entrada base
</Note>

---
## Cómo implementar el almacenamiento en caché de indicaciones

### Modelos compatibles

El almacenamiento en caché de indicaciones es actualmente compatible con:
- Claude Opus 4.5
- Claude Opus 4.1
- Claude Opus 4
- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Sonnet 3.7 ([obsoleto](/docs/es/about-claude/model-deprecations))
- Claude Haiku 4.5
- Claude Haiku 3.5
- Claude Haiku 3
- Claude Opus 3 ([obsoleto](/docs/es/about-claude/model-deprecations))

### Estructurando tu indicación

Coloca contenido estático (definiciones de herramientas, instrucciones del sistema, contexto, ejemplos) al principio de tu indicación. Marca el final del contenido reutilizable para almacenamiento en caché usando el parámetro `cache_control`.

Los prefijos de caché se crean en el siguiente orden: `tools`, `system`, luego `messages`. Este orden forma una jerarquía donde cada nivel se basa en los anteriores.

#### Cómo funciona la verificación automática de prefijos

Puedes usar solo un punto de ruptura de caché al final de tu contenido estático, y el sistema encontrará automáticamente la secuencia más larga de bloques almacenados en caché coincidentes. Entender cómo funciona esto te ayuda a optimizar tu estrategia de almacenamiento en caché.

**Tres principios centrales:**

1. **Las claves de caché son acumulativas**: Cuando almacenas explícitamente un bloque con `cache_control`, la clave hash de caché se genera hasheando todos los bloques anteriores en la conversación secuencialmente. Esto significa que el caché para cada bloque depende de todo el contenido que vino antes.

2. **Verificación secuencial hacia atrás**: El sistema verifica los aciertos de caché trabajando hacia atrás desde tu punto de ruptura explícito, verificando cada bloque anterior en orden inverso. Esto asegura que obtengas el acierto de caché más largo posible.

3. **Ventana de búsqueda hacia atrás de 20 bloques**: El sistema solo verifica hasta 20 bloques antes de cada punto de ruptura `cache_control` explícito. Después de verificar 20 bloques sin encontrar una coincidencia, deja de verificar y se mueve al siguiente punto de ruptura explícito (si existe).

**Ejemplo: Entendiendo la ventana de búsqueda hacia atrás**

Considera una conversación con 30 bloques de contenido donde estableces `cache_control` solo en el bloque 30:

- **Si envías el bloque 31 sin cambios en bloques anteriores**: El sistema verifica el bloque 30 (¡coincidencia!). Obtienes un acierto de caché en el bloque 30, y solo el bloque 31 necesita procesamiento.

- **Si modificas el bloque 25 y envías el bloque 31**: El sistema verifica hacia atrás desde el bloque 30 → 29 → 28... → 25 (sin coincidencia) → 24 (¡coincidencia!). Dado que el bloque 24 no ha cambiado, obtienes un acierto de caché en el bloque 24, y solo los bloques 25-30 necesitan reprocesamiento.

- **Si modificas el bloque 5 y envías el bloque 31**: El sistema verifica hacia atrás desde el bloque 30 → 29 → 28... → 11 (verificación #20). Después de 20 verificaciones sin encontrar una coincidencia, deja de buscar. Dado que el bloque 5 está más allá de la ventana de 20 bloques, no ocurre un acierto de caché y todos los bloques necesitan reprocesamiento. Sin embargo, si hubieras establecido un punto de ruptura `cache_control` explícito en el bloque 5, el sistema continuaría verificando desde ese punto de ruptura: bloque 5 (sin coincidencia) → bloque 4 (¡coincidencia!). Esto permite un acierto de caché en el bloque 4, demostrando por qué deberías colocar puntos de ruptura antes del contenido editable.

**Conclusión clave**: Siempre establece un punto de ruptura de caché explícito al final de tu conversación para maximizar tus posibilidades de aciertos de caché. Además, establece puntos de ruptura justo antes de bloques de contenido que podrían ser editables para asegurar que esas secciones se puedan almacenar en caché de forma independiente.

#### Cuándo usar múltiples puntos de ruptura

Puedes definir hasta 4 puntos de ruptura de caché si deseas:
- Almacenar en caché diferentes secciones que cambian a diferentes frecuencias (por ejemplo, las herramientas rara vez cambian, pero el contexto se actualiza diariamente)
- Tener más control sobre exactamente qué se almacena en caché
- Asegurar el almacenamiento en caché para contenido más de 20 bloques antes de tu punto de ruptura final
- Colocar puntos de ruptura antes del contenido editable para garantizar aciertos de caché incluso cuando ocurren cambios más allá de la ventana de 20 bloques

<Note>
**Limitación importante**: Si tu indicación tiene más de 20 bloques de contenido antes de tu punto de ruptura de caché, y modificas contenido anterior a esos 20 bloques, no obtendrás un acierto de caché a menos que agregues puntos de ruptura explícitos adicionales más cerca de ese contenido.
</Note>

### Limitaciones de caché
La longitud mínima de indicación almacenable en caché es:
- 4096 tokens para Claude Opus 4.5
- 1024 tokens para Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([obsoleto](/docs/es/about-claude/model-deprecations)), y Claude Opus 3 ([obsoleto](/docs/es/about-claude/model-deprecations))
- 4096 tokens para Claude Haiku 4.5
- 2048 tokens para Claude Haiku 3.5 y Claude Haiku 3

Las indicaciones más cortas no se pueden almacenar en caché, incluso si se marcan con `cache_control`. Cualquier solicitud para almacenar en caché menos de este número de tokens se procesará sin almacenamiento en caché. Para ver si una indicación se almacenó en caché, consulta los [campos](/docs/es/build-with-claude/prompt-caching#tracking-cache-performance) de uso de respuesta.

Para solicitudes concurrentes, ten en cuenta que una entrada de caché solo se vuelve disponible después de que comienza la primera respuesta. Si necesitas aciertos de caché para solicitudes paralelas, espera a que la primera respuesta se complete antes de enviar solicitudes posteriores.

Actualmente, "ephemeral" es el único tipo de caché compatible, que por defecto tiene una vida útil de 5 minutos.

### Entendiendo los costos de los puntos de ruptura de caché

**Los puntos de ruptura de caché en sí no agregan ningún costo.** Solo se te cobra por:
- **Escrituras de caché**: Cuando se escribe contenido nuevo en el caché (25% más que los tokens de entrada base para TTL de 5 minutos)
- **Lecturas de caché**: Cuando se utiliza contenido almacenado en caché (10% del precio de token de entrada base)
- **Tokens de entrada regulares**: Para cualquier contenido no almacenado en caché

Agregar más puntos de ruptura `cache_control` no aumenta tus costos - aún pagas la misma cantidad basada en qué contenido se almacena en caché y se lee realmente. Los puntos de ruptura simplemente te dan control sobre qué secciones se pueden almacenar en caché de forma independiente.

### Qué se puede almacenar en caché
La mayoría de los bloques en la solicitud se pueden designar para almacenamiento en caché con `cache_control`. Esto incluye:

- Herramientas: Definiciones de herramientas en el array `tools`
- Mensajes del sistema: Bloques de contenido en el array `system`
- Mensajes de texto: Bloques de contenido en el array `messages.content`, para turnos de usuario y asistente
- Imágenes y documentos: Bloques de contenido en el array `messages.content`, en turnos de usuario
- Uso de herramientas y resultados de herramientas: Bloques de contenido en el array `messages.content`, en turnos de usuario y asistente

Cada uno de estos elementos se puede marcar con `cache_control` para habilitar el almacenamiento en caché para esa porción de la solicitud.

### Qué no se puede almacenar en caché
Aunque la mayoría de los bloques de solicitud se pueden almacenar en caché, hay algunas excepciones:

- Los bloques de pensamiento no se pueden almacenar en caché directamente con `cache_control`. Sin embargo, los bloques de pensamiento SÍ se pueden almacenar en caché junto con otro contenido cuando aparecen en turnos de asistente anteriores. Cuando se almacenan en caché de esta manera, SÍ cuentan como tokens de entrada cuando se leen del caché.
- Los bloques de subcontenido (como [citas](/docs/es/build-with-claude/citations)) en sí no se pueden almacenar en caché directamente. En su lugar, almacena en caché el bloque de nivel superior.

    En el caso de citas, los bloques de contenido de documento de nivel superior que sirven como material de origen para citas se pueden almacenar en caché. Esto te permite usar el almacenamiento en caché de indicaciones con citas de manera efectiva almacenando en caché los documentos que las citas referenciarán.
- Los bloques de texto vacío no se pueden almacenar en caché.

### Qué invalida el caché

Las modificaciones al contenido almacenado en caché pueden invalidar parte o todo el caché.

Como se describe en [Estructurando tu indicación](#structuring-your-prompt), el caché sigue la jerarquía: `tools` → `system` → `messages`. Los cambios en cada nivel invalidan ese nivel y todos los niveles posteriores.

La siguiente tabla muestra qué partes del caché se invalidan por diferentes tipos de cambios. ✘ indica que el caché se invalida, mientras que ✓ indica que el caché permanece válido.

| Qué cambia | Caché de herramientas | Caché del sistema | Caché de mensajes | Impacto |
|------------|------------------|---------------|----------------|-------------|
| **Definiciones de herramientas** | ✘ | ✘ | ✘ | Modificar definiciones de herramientas (nombres, descripciones, parámetros) invalida todo el caché |
| **Alternar búsqueda web** | ✓ | ✘ | ✘ | Habilitar/deshabilitar búsqueda web modifica el mensaje del sistema |
| **Alternar citas** | ✓ | ✘ | ✘ | Habilitar/deshabilitar citas modifica el mensaje del sistema |
| **Opción de herramienta** | ✓ | ✓ | ✘ | Los cambios al parámetro `tool_choice` solo afectan bloques de mensajes |
| **Imágenes** | ✓ | ✓ | ✘ | Agregar/eliminar imágenes en cualquier lugar de la indicación afecta bloques de mensajes |
| **Parámetros de pensamiento** | ✓ | ✓ | ✘ | Los cambios en la configuración de pensamiento extendido (habilitar/deshabilitar, presupuesto) afectan bloques de mensajes |
| **Resultados no relacionados con herramientas pasados a solicitudes de pensamiento extendido** | ✓ | ✓ | ✘ | Cuando se pasan resultados no relacionados con herramientas en solicitudes mientras el pensamiento extendido está habilitado, todos los bloques de pensamiento previamente almacenados en caché se eliminan del contexto, y cualquier mensaje en contexto que siga a esos bloques de pensamiento se elimina del caché. Para más detalles, consulta [Almacenamiento en caché con bloques de pensamiento](#caching-with-thinking-blocks). |

### Rastreando el rendimiento del caché

Monitorea el rendimiento del caché usando estos campos de respuesta de API, dentro de `usage` en la respuesta (o evento `message_start` si [streaming](/docs/es/build-with-claude/streaming)):

- `cache_creation_input_tokens`: Número de tokens escritos en el caché al crear una nueva entrada.
- `cache_read_input_tokens`: Número de tokens recuperados del caché para esta solicitud.
- `input_tokens`: Número de tokens de entrada que no se leyeron del caché ni se utilizaron para crear un caché (es decir, tokens después del último punto de ruptura de caché).

<Note>
**Entendiendo el desglose de tokens**

El campo `input_tokens` representa solo los tokens que vienen **después del último punto de ruptura de caché** en tu solicitud - no todos los tokens de entrada que enviaste.

Para calcular los tokens de entrada totales:
```
total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
```

**Explicación espacial:**
- `cache_read_input_tokens` = tokens antes del punto de ruptura ya almacenados en caché (lecturas)
- `cache_creation_input_tokens` = tokens antes del punto de ruptura siendo almacenados en caché ahora (escrituras)
- `input_tokens` = tokens después de tu último punto de ruptura (no elegibles para caché)

**Ejemplo:** Si tienes una solicitud con 100,000 tokens de contenido almacenado en caché (lectura del caché), 0 tokens de contenido nuevo siendo almacenado en caché, y 50 tokens en tu mensaje de usuario (después del punto de ruptura de caché):
- `cache_read_input_tokens`: 100,000
- `cache_creation_input_tokens`: 0
- `input_tokens`: 50
- **Tokens de entrada totales procesados**: 100,050 tokens

Esto es importante para entender tanto los costos como los límites de velocidad, ya que `input_tokens` será típicamente mucho más pequeño que tu entrada total cuando uses almacenamiento en caché de manera efectiva.
</Note>

### Mejores prácticas para almacenamiento en caché efectivo

Para optimizar el rendimiento del almacenamiento en caché de indicaciones:

- Almacena en caché contenido estable y reutilizable como instrucciones del sistema, información de antecedentes, contextos grandes, o definiciones de herramientas frecuentes.
- Coloca contenido almacenado en caché al principio de la indicación para mejor rendimiento.
- Usa puntos de ruptura de caché estratégicamente para separar diferentes secciones de prefijo almacenable en caché.
- Establece puntos de ruptura de caché al final de conversaciones y justo antes del contenido editable para maximizar las tasas de acierto de caché, especialmente cuando se trabaja con indicaciones que tienen más de 20 bloques de contenido.
- Analiza regularmente las tasas de acierto de caché y ajusta tu estrategia según sea necesario.

### Optimizando para diferentes casos de uso

Adapta tu estrategia de almacenamiento en caché de indicaciones a tu escenario:

- Agentes conversacionales: Reduce costo y latencia para conversaciones extendidas, especialmente aquellas con instrucciones largas o documentos cargados.
- Asistentes de codificación: Mejora el autocompletado y las preguntas y respuestas de base de código manteniendo secciones relevantes o una versión resumida de la base de código en la indicación.
- Procesamiento de documentos grandes: Incorpora material completo de forma larga incluyendo imágenes en tu indicación sin aumentar la latencia de respuesta.
- Conjuntos de instrucciones detalladas: Comparte listas extensas de instrucciones, procedimientos y ejemplos para ajustar las respuestas de Claude. Los desarrolladores a menudo incluyen uno o dos ejemplos en la indicación, pero con almacenamiento en caché de indicaciones puedes obtener un rendimiento aún mejor incluyendo 20+ ejemplos diversos de respuestas de alta calidad.
- Uso de herramientas agénticas: Mejora el rendimiento para escenarios que involucran múltiples llamadas de herramientas y cambios de código iterativos, donde cada paso típicamente requiere una nueva llamada a la API.
- Habla con libros, artículos, documentación, transcripciones de podcasts y otro contenido de forma larga: Trae cualquier base de conocimiento a la vida incrustando el documento(s) completo en la indicación, y dejando que los usuarios le hagan preguntas.

### Solución de problemas comunes

Si experimentas comportamiento inesperado:

- Asegúrate de que las secciones almacenadas en caché sean idénticas y marcadas con cache_control en las mismas ubicaciones en todas las llamadas
- Verifica que las llamadas se realicen dentro de la vida útil del caché (5 minutos por defecto)
- Verifica que `tool_choice` y el uso de imágenes permanezcan consistentes entre llamadas
- Valida que estés almacenando en caché al menos el número mínimo de tokens
- El sistema verifica automáticamente los aciertos de caché en límites de bloques de contenido anteriores (hasta ~20 bloques antes de tu punto de ruptura). Para indicaciones con más de 20 bloques de contenido, es posible que necesites parámetros `cache_control` adicionales anteriormente en la indicación para asegurar que todo el contenido se pueda almacenar en caché
- Verifica que las claves en tus bloques de contenido `tool_use` tengan un orden estable ya que algunos lenguajes (por ejemplo, Swift, Go) aleatorizan el orden de claves durante la conversión JSON, rompiendo cachés

<Note>
Los cambios a `tool_choice` o la presencia/ausencia de imágenes en cualquier lugar de la indicación invalidarán el caché, requiriendo que se cree una nueva entrada de caché. Para más detalles sobre la invalidación de caché, consulta [Qué invalida el caché](#what-invalidates-the-cache).
</Note>

### Almacenamiento en caché con bloques de pensamiento

Cuando usas [pensamiento extendido](/docs/es/build-with-claude/extended-thinking) con almacenamiento en caché de indicaciones, los bloques de pensamiento tienen comportamiento especial:

**Almacenamiento automático en caché junto con otro contenido**: Aunque los bloques de pensamiento no se pueden marcar explícitamente con `cache_control`, se almacenan en caché como parte del contenido de la solicitud cuando realizas llamadas a la API posteriores con resultados de herramientas. Esto ocurre comúnmente durante el uso de herramientas cuando pasas bloques de pensamiento de vuelta para continuar la conversación.

**Conteo de tokens de entrada**: Cuando los bloques de pensamiento se leen del caché, cuentan como tokens de entrada en tus métricas de uso. Esto es importante para el cálculo de costos y presupuesto de tokens.

**Patrones de invalidación de caché**:
- El caché permanece válido cuando solo se proporcionan resultados de herramientas como mensajes de usuario
- El caché se invalida cuando se agrega contenido de usuario no relacionado con resultados de herramientas, causando que todos los bloques de pensamiento anteriores se eliminen
- Este comportamiento de almacenamiento en caché ocurre incluso sin marcadores `cache_control` explícitos

Para más detalles sobre la invalidación de caché, consulta [Qué invalida el caché](#what-invalidates-the-cache).

**Ejemplo con uso de herramientas**:
```
Request 1: User: "What's the weather in Paris?"
Response: [thinking_block_1] + [tool_use block 1]

Request 2:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True]
Response: [thinking_block_2] + [text block 2]
# Request 2 caches its request content (not the response)
# The cache includes: user message, thinking_block_1, tool_use block 1, and tool_result_1

Request 3:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
# Non-tool-result user block causes all thinking blocks to be ignored
# This request is processed as if thinking blocks were never present
```

Cuando se incluye un bloque de usuario no relacionado con resultados de herramientas, designa un nuevo bucle de asistente y todos los bloques de pensamiento anteriores se eliminan del contexto.

Para información más detallada, consulta la [documentación de pensamiento extendido](/docs/es/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior).

---
## Almacenamiento y compartición de caché

- **Aislamiento de organización**: Los cachés se aíslan entre organizaciones. Diferentes organizaciones nunca comparten cachés, incluso si utilizan indicaciones idénticas.

- **Coincidencia exacta**: Los aciertos de caché requieren segmentos de indicación 100% idénticos, incluyendo todo el texto e imágenes hasta e incluyendo el bloque marcado con control de caché.

- **Generación de tokens de salida**: El almacenamiento en caché de indicaciones no tiene efecto en la generación de tokens de salida. La respuesta que recibas será idéntica a la que obtendrías si el almacenamiento en caché de indicaciones no se utilizara.

---
## Duración de caché de 1 hora

Si encuentras que 5 minutos es demasiado corto, Anthropic también ofrece una duración de caché de 1 hora [con costo adicional](#pricing).

Para usar el caché extendido, incluye `ttl` en la definición de `cache_control` así:
```json
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

La respuesta incluirá información detallada del caché como la siguiente:
```json
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,

        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

Ten en cuenta que el campo `cache_creation_input_tokens` actual es igual a la suma de los valores en el objeto `cache_creation`.

### Cuándo usar el caché de 1 hora

Si tienes indicaciones que se usan a una cadencia regular (es decir, indicaciones del sistema que se usan más frecuentemente que cada 5 minutos), continúa usando el caché de 5 minutos, ya que esto continuará siendo actualizado sin costo adicional.

El caché de 1 hora se usa mejor en los siguientes escenarios:
- Cuando tienes indicaciones que probablemente se usan con menos frecuencia que cada 5 minutos, pero más frecuentemente que cada hora. Por ejemplo, cuando un agente secundario agéntico tardará más de 5 minutos, o cuando almacenas una conversación de chat larga con un usuario y generalmente esperas que ese usuario no responda en los próximos 5 minutos.
- Cuando la latencia es importante y tus indicaciones de seguimiento pueden enviarse más allá de 5 minutos.
- Cuando deseas mejorar tu utilización de límite de velocidad, ya que los aciertos de caché no se deducen de tu límite de velocidad.

<Note>
El caché de 5 minutos y 1 hora se comportan igual con respecto a la latencia. Generalmente verás un tiempo mejorado al primer token para documentos largos.
</Note>

### Mezclando diferentes TTLs

Puedes usar controles de caché de 1 hora y 5 minutos en la misma solicitud, pero con una restricción importante: Las entradas de caché con TTL más largo deben aparecer antes de TTLs más cortos (es decir, una entrada de caché de 1 hora debe aparecer antes de cualquier entrada de caché de 5 minutos).

Cuando mezclas TTLs, determinamos tres ubicaciones de facturación en tu indicación:
1. Posición `A`: El conteo de tokens en el acierto de caché más alto (o 0 si no hay aciertos).
2. Posición `B`: El conteo de tokens en el bloque `cache_control` de 1 hora más alto después de `A` (o es igual a `A` si ninguno existe).
3. Posición `C`: El conteo de tokens en el último bloque `cache_control`.

<Note>
Si `B` y/o `C` son mayores que `A`, necesariamente serán fallos de caché, porque `A` es el acierto de caché más alto.
</Note>

Se te cobrará por:
1. Tokens de lectura de caché para `A`.
2. Tokens de escritura de caché de 1 hora para `(B - A)`.
3. Tokens de escritura de caché de 5 minutos para `(C - B)`.

Aquí hay 3 ejemplos. Esto representa los tokens de entrada de 3 solicitudes, cada una de las cuales tiene diferentes aciertos de caché y fallos de caché. Cada una tiene una facturación calculada diferente, mostrada en los cuadros de color, como resultado.
![Diagrama de mezcla de TTLs](/docs/images/prompt-cache-mixed-ttl.svg)

---

## Ejemplos de almacenamiento en caché de prompts

Para ayudarte a comenzar con el almacenamiento en caché de prompts, hemos preparado un [libro de recetas de almacenamiento en caché de prompts](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb) con ejemplos detallados y mejores prácticas.

A continuación, hemos incluido varios fragmentos de código que muestran varios patrones de almacenamiento en caché de prompts. Estos ejemplos demuestran cómo implementar el almacenamiento en caché en diferentes escenarios, ayudándote a entender las aplicaciones prácticas de esta característica:

<section title="Ejemplo de almacenamiento en caché de contexto grande">

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing legal documents."
    },
    {
        "type": "text",
        "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
        "cache_control": {"type": "ephemeral"}
    }
  ],
  messages: [
    {
        "role": "user",
        "content": "What are the key terms and conditions in this agreement?"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class LegalDocumentAnalysisExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing legal documents.")
                                .build(),
                        TextBlockParam.builder()
                                .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("What are the key terms and conditions in this agreement?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>
Este ejemplo demuestra el uso básico del almacenamiento en caché de prompts, almacenando en caché el texto completo del acuerdo legal como prefijo mientras se mantiene la instrucción del usuario sin almacenar en caché.

Para la primera solicitud:
- `input_tokens`: Número de tokens en el mensaje del usuario solamente
- `cache_creation_input_tokens`: Número de tokens en todo el mensaje del sistema, incluido el documento legal
- `cache_read_input_tokens`: 0 (sin acierto de caché en la primera solicitud)

Para solicitudes posteriores dentro de la vida útil del caché:
- `input_tokens`: Número de tokens en el mensaje del usuario solamente
- `cache_creation_input_tokens`: 0 (sin nueva creación de caché)
- `cache_read_input_tokens`: Número de tokens en todo el mensaje del sistema almacenado en caché

</section>
<section title="Almacenamiento en caché de definiciones de herramientas">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
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
                        "description": "The unit of temperature, either celsius or fahrenheit"
                    }
                },
                "required": ["location"]
            }
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather and time in New York?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
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
                "required": ["location"]
            },
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
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
                "required": ["location"]
            },
        },
        // many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages: [
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class ToolsWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Weather tool schema
        InputSchema weatherSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"
                        ),
                        "unit", Map.of(
                                "type", "string",
                                "enum", List.of("celsius", "fahrenheit"),
                                "description", "The unit of temperature, either celsius or fahrenheit"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        // Time tool schema
        InputSchema timeSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "timezone", Map.of(
                                "type", "string",
                                "description", "The IANA time zone name, e.g. America/Los_Angeles"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(weatherSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_time")
                        .description("Get the current time in a given time zone")
                        .inputSchema(timeSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                .addUserMessage("What is the weather and time in New York?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

En este ejemplo, demostramos el almacenamiento en caché de definiciones de herramientas.

El parámetro `cache_control` se coloca en la herramienta final (`get_time`) para designar todas las herramientas como parte del prefijo estático.

Esto significa que todas las definiciones de herramientas, incluidas `get_weather` y cualquier otra herramienta definida antes de `get_time`, se almacenarán en caché como un único prefijo.

Este enfoque es útil cuando tienes un conjunto consistente de herramientas que deseas reutilizar en múltiples solicitudes sin reprocesarlas cada vez.

Para la primera solicitud:
- `input_tokens`: Número de tokens en el mensaje del usuario
- `cache_creation_input_tokens`: Número de tokens en todas las definiciones de herramientas y el prompt del sistema
- `cache_read_input_tokens`: 0 (sin acierto de caché en la primera solicitud)

Para solicitudes posteriores dentro de la vida útil del caché:
- `input_tokens`: Número de tokens en el mensaje del usuario
- `cache_creation_input_tokens`: 0 (sin nueva creación de caché)
- `cache_read_input_tokens`: Número de tokens en todas las definiciones de herramientas y el prompt del sistema almacenados en caché

</section>

<section title="Continuación de una conversación de múltiples turnos">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        # ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        // ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class ConversationWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Create ephemeral system prompt
        TextBlockParam systemPrompt = TextBlockParam.builder()
                .text("...long system prompt")
                .cacheControl(CacheControlEphemeral.builder().build())
                .build();

        // Create message params
        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(systemPrompt))
                // First user message (without cache control)
                .addUserMessage("Hello, can you tell me more about the solar system?")
                // Assistant response
                .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                // Second user message (with cache control)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Good to know.")
                                .build()),
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Tell me more about Mars.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

En este ejemplo, demostramos cómo usar el almacenamiento en caché de prompts en una conversación de múltiples turnos.

Durante cada turno, marcamos el bloque final del mensaje final con `cache_control` para que la conversación pueda almacenarse en caché de forma incremental. El sistema buscará automáticamente y utilizará la secuencia más larga de bloques previamente almacenados en caché para mensajes de seguimiento. Es decir, los bloques que fueron marcados previamente con un bloque `cache_control` posteriormente no se marcan con esto, pero aún se considerarán un acierto de caché (¡y también una actualización de caché!) si se alcanzan dentro de 5 minutos.

Además, ten en cuenta que el parámetro `cache_control` se coloca en el mensaje del sistema. Esto es para asegurar que si se desaloja del caché (después de no usarse durante más de 5 minutos), se agregará nuevamente al caché en la siguiente solicitud.

Este enfoque es útil para mantener el contexto en conversaciones en curso sin reprocesar repetidamente la misma información.

Cuando esto se configura correctamente, deberías ver lo siguiente en la respuesta de uso de cada solicitud:
- `input_tokens`: Número de tokens en el nuevo mensaje del usuario (será mínimo)
- `cache_creation_input_tokens`: Número de tokens en los nuevos turnos del asistente y del usuario
- `cache_read_input_tokens`: Número de tokens en la conversación hasta el turno anterior

</section>

<section title="Juntándolo todo: Múltiples puntos de ruptura de caché">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "system": [
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    system=[
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [
        {
            name: "search_documents",
            description: "Search through the knowledge base",
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query"
                    }
                },
                required: ["query"]
            }
        },
        {
            name: "get_document",
            description: "Retrieve a specific document by ID",
            input_schema: {
                type: "object",
                properties: {
                    doc_id: {
                        type: "string",
                        description: "Document ID"
                    }
                },
                required: ["doc_id"]
            },
            cache_control: { type: "ephemeral" }
        }
    ],
    system: [
        {
            type: "text",
            text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            cache_control: { type: "ephemeral" }
        }
    ],
    messages: [
        {
            role: "user",
            content: "Can you search for information about Mars rovers?"
        },
        {
            role: "assistant",
            content: [
                {
                    type: "tool_use",
                    id: "tool_1",
                    name: "search_documents",
                    input: { query: "Mars rovers" }
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "tool_1",
                    content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Yes, please tell me about the Perseverance rover specifically.",
                    cache_control: { type: "ephemeral" }
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlockParam;

public class MultipleCacheBreakpointsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Search tool schema
        InputSchema searchSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "query", Map.of(
                                "type", "string",
                                "description", "Search query"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                .build();

        // Get document tool schema
        InputSchema getDocSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "doc_id", Map.of(
                                "type", "string",
                                "description", "Document ID"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                // Tools with cache control on the last one
                .addTool(Tool.builder()
                        .name("search_documents")
                        .description("Search through the knowledge base")
                        .inputSchema(searchSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_document")
                        .description("Retrieve a specific document by ID")
                        .inputSchema(getDocSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                // System prompts with cache control on instructions and context separately
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build(),
                        TextBlockParam.builder()
                                .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                // Conversation history
                .addUserMessage("Can you search for information about Mars rovers?")
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                .id("tool_1")
                                .name("search_documents")
                                .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("tool_1")
                                .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                .build())
                ))
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Yes, please tell me about the Perseverance rover specifically.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Este ejemplo completo demuestra cómo usar los 4 puntos de ruptura de caché disponibles para optimizar diferentes partes de tu prompt:

1. **Caché de herramientas** (punto de ruptura de caché 1): El parámetro `cache_control` en la última definición de herramienta almacena en caché todas las definiciones de herramientas.

2. **Caché de instrucciones reutilizables** (punto de ruptura de caché 2): Las instrucciones estáticas en el prompt del sistema se almacenan en caché por separado. Estas instrucciones rara vez cambian entre solicitudes.

3. **Caché de contexto RAG** (punto de ruptura de caché 3): Los documentos de la base de conocimientos se almacenan en caché de forma independiente, permitiéndote actualizar los documentos RAG sin invalidar el caché de herramientas o instrucciones.

4. **Caché del historial de conversación** (punto de ruptura de caché 4): La respuesta del asistente se marca con `cache_control` para habilitar el almacenamiento en caché incremental de la conversación a medida que progresa.

Este enfoque proporciona máxima flexibilidad:
- Si solo actualizas el mensaje final del usuario, se reutilizan los cuatro segmentos de caché
- Si actualizas los documentos RAG pero mantienes las mismas herramientas e instrucciones, se reutilizan los dos primeros segmentos de caché
- Si cambias la conversación pero mantienes las mismas herramientas, instrucciones y documentos, se reutilizan los tres primeros segmentos
- Cada punto de ruptura de caché puede invalidarse de forma independiente según lo que cambie en tu aplicación

Para la primera solicitud:
- `input_tokens`: Tokens en el mensaje final del usuario
- `cache_creation_input_tokens`: Tokens en todos los segmentos almacenados en caché (herramientas + instrucciones + documentos RAG + historial de conversación)
- `cache_read_input_tokens`: 0 (sin aciertos de caché)

Para solicitudes posteriores con solo un nuevo mensaje del usuario:
- `input_tokens`: Tokens en el nuevo mensaje del usuario solamente
- `cache_creation_input_tokens`: Cualquier token nuevo agregado al historial de conversación
- `cache_read_input_tokens`: Todos los tokens previamente almacenados en caché (herramientas + instrucciones + documentos RAG + conversación anterior)

Este patrón es especialmente poderoso para:
- Aplicaciones RAG con contextos de documentos grandes
- Sistemas de agentes que utilizan múltiples herramientas
- Conversaciones de larga duración que necesitan mantener contexto
- Aplicaciones que necesitan optimizar diferentes partes del prompt de forma independiente

</section>

---
## Preguntas frecuentes

  <section title="¿Necesito múltiples puntos de ruptura de caché o es suficiente uno al final?">

    **En la mayoría de los casos, un único punto de ruptura de caché al final de tu contenido estático es suficiente.** El sistema verifica automáticamente los aciertos de caché en todos los límites de bloques de contenido anteriores (hasta 20 bloques antes de tu punto de ruptura) y utiliza la secuencia más larga de bloques almacenados en caché.

    Solo necesitas múltiples puntos de ruptura si:
    - Tienes más de 20 bloques de contenido antes de tu punto de caché deseado
    - Deseas almacenar en caché secciones que se actualizan con diferentes frecuencias de forma independiente
    - Necesitas control explícito sobre lo que se almacena en caché para optimizar costos

    Ejemplo: Si tienes instrucciones del sistema (rara vez cambian) y contexto RAG (cambia diariamente), podrías usar dos puntos de ruptura para almacenarlos en caché por separado.
  
</section>

  <section title="¿Los puntos de ruptura de caché agregan costo extra?">

    No, los puntos de ruptura de caché en sí son gratuitos. Solo pagas por:
    - Escribir contenido en caché (25% más que los tokens de entrada base para TTL de 5 minutos)
    - Leer desde caché (10% del precio del token de entrada base)
    - Tokens de entrada regulares para contenido no almacenado en caché

    El número de puntos de ruptura no afecta los precios - solo importa la cantidad de contenido almacenado en caché y leído.
  
</section>

  <section title="¿Cómo calculo los tokens de entrada totales a partir de los campos de uso?">

    La respuesta de uso incluye tres campos de tokens de entrada separados que juntos representan tu entrada total:

    ```
    total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
    ```

    - `cache_read_input_tokens`: Tokens recuperados del caché (todo antes de los puntos de ruptura de caché que fue almacenado en caché)
    - `cache_creation_input_tokens`: Nuevos tokens siendo escritos en caché (en puntos de ruptura de caché)
    - `input_tokens`: Tokens **después del último punto de ruptura de caché** que no están almacenados en caché

    **Importante:** `input_tokens` NO representa todos los tokens de entrada - solo la porción después de tu último punto de ruptura de caché. Si tienes contenido almacenado en caché, `input_tokens` será típicamente mucho más pequeño que tu entrada total.

    **Ejemplo:** Con un documento de 200K tokens almacenado en caché y una pregunta del usuario de 50 tokens:
    - `cache_read_input_tokens`: 200,000
    - `cache_creation_input_tokens`: 0
    - `input_tokens`: 50
    - **Total**: 200,050 tokens

    Este desglose es crítico para entender tanto tus costos como el uso de límite de velocidad. Consulta [Seguimiento del rendimiento del caché](#tracking-cache-performance) para más detalles.
  
</section>

  <section title="¿Cuál es la vida útil del caché?">

    La vida útil predeterminada mínima del caché (TTL) es de 5 minutos. Esta vida útil se actualiza cada vez que se utiliza el contenido almacenado en caché.

    Si encuentras que 5 minutos es demasiado corto, Anthropic también ofrece un [TTL de caché de 1 hora](#1-hour-cache-duration).
  
</section>

  <section title="¿Cuántos puntos de ruptura de caché puedo usar?">

    Puedes definir hasta 4 puntos de ruptura de caché (usando parámetros `cache_control`) en tu prompt.
  
</section>

  <section title="¿El almacenamiento en caché de prompts está disponible para todos los modelos?">

    No, el almacenamiento en caché de prompts actualmente solo está disponible para Claude Opus 4.5, Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([deprecado](/docs/es/about-claude/model-deprecations)), Claude Haiku 4.5, Claude Haiku 3.5, Claude Haiku 3, y Claude Opus 3 ([deprecado](/docs/es/about-claude/model-deprecations)).
  
</section>

  <section title="¿Cómo funciona el almacenamiento en caché de prompts con el pensamiento extendido?">

    Los prompts del sistema almacenados en caché y las herramientas se reutilizarán cuando cambien los parámetros de pensamiento. Sin embargo, los cambios de pensamiento (habilitar/deshabilitar o cambios de presupuesto) invalidarán los prefijos de prompt previamente almacenados en caché con contenido de mensajes.

    Para más detalles sobre la invalidación del caché, consulta [Qué invalida el caché](#what-invalidates-the-cache).

    Para más información sobre el pensamiento extendido, incluida su interacción con el uso de herramientas y el almacenamiento en caché de prompts, consulta la [documentación de pensamiento extendido](/docs/es/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching).
  
</section>

  <section title="¿Cómo habilito el almacenamiento en caché de prompts?">

    Para habilitar el almacenamiento en caché de prompts, incluye al menos un punto de ruptura `cache_control` en tu solicitud de API.
  
</section>

  <section title="¿Puedo usar el almacenamiento en caché de prompts con otras características de API?">

    Sí, el almacenamiento en caché de prompts se puede usar junto con otras características de API como el uso de herramientas y capacidades de visión. Sin embargo, cambiar si hay imágenes en un prompt o modificar la configuración de uso de herramientas romperá el caché.

    Para más detalles sobre la invalidación del caché, consulta [Qué invalida el caché](#what-invalidates-the-cache).
  
</section>

  <section title="¿Cómo afecta el almacenamiento en caché de prompts a los precios?">

    El almacenamiento en caché de prompts introduce una nueva estructura de precios donde las escrituras de caché cuestan 25% más que los tokens de entrada base, mientras que los aciertos de caché cuestan solo el 10% del precio del token de entrada base.
  
</section>

  <section title="¿Puedo borrar manualmente el caché?">

    Actualmente, no hay forma de borrar manualmente el caché. Los prefijos almacenados en caché expiran automáticamente después de un mínimo de 5 minutos de inactividad.
  
</section>

  <section title="¿Cómo puedo rastrear la efectividad de mi estrategia de almacenamiento en caché?">

    Puedes monitorear el rendimiento del caché usando los campos `cache_creation_input_tokens` y `cache_read_input_tokens` en la respuesta de la API.
  
</section>

  <section title="¿Qué puede romper el caché?">

    Consulta [Qué invalida el caché](#what-invalidates-the-cache) para más detalles sobre la invalidación del caché, incluida una lista de cambios que requieren crear una nueva entrada de caché.
  
</section>

  <section title="¿Cómo maneja el almacenamiento en caché de prompts la privacidad y la separación de datos?">

El almacenamiento en caché de prompts está diseñado con medidas sólidas de privacidad y separación de datos:

1. Las claves de caché se generan usando un hash criptográfico de los prompts hasta el punto de control de caché. Esto significa que solo las solicitudes con prompts idénticos pueden acceder a un caché específico.

2. Los cachés son específicos de la organización. Los usuarios dentro de la misma organización pueden acceder al mismo caché si utilizan prompts idénticos, pero los cachés no se comparten entre diferentes organizaciones, incluso para prompts idénticos.

3. El mecanismo de almacenamiento en caché está diseñado para mantener la integridad y privacidad de cada conversación o contexto único.

4. Es seguro usar `cache_control` en cualquier lugar de tus prompts. Para eficiencia de costos, es mejor excluir partes altamente variables (por ejemplo, entrada arbitraria del usuario) del almacenamiento en caché.

Estas medidas aseguran que el almacenamiento en caché de prompts mantenga la privacidad y seguridad de los datos mientras ofrece beneficios de rendimiento.
  
</section>
  <section title="¿Puedo usar el almacenamiento en caché de prompts con la API de Lotes?">

    Sí, es posible usar el almacenamiento en caché de prompts con tus solicitudes de [API de Lotes](/docs/es/build-with-claude/batch-processing). Sin embargo, debido a que las solicitudes de lotes asincrónicas pueden procesarse concurrentemente y en cualquier orden, los aciertos de caché se proporcionan en base de mejor esfuerzo.

    El [caché de 1 hora](#1-hour-cache-duration) puede ayudar a mejorar tus aciertos de caché. La forma más rentable de usarlo es la siguiente:
    - Reúne un conjunto de solicitudes de mensajes que tienen un prefijo compartido.
    - Envía una solicitud de lote con solo una solicitud que tenga este prefijo compartido y un bloque de caché de 1 hora. Esto se escribirá en el caché de 1 hora.
    - Tan pronto como se complete, envía el resto de las solicitudes. Tendrás que monitorear el trabajo para saber cuándo se completa.

    Esto es típicamente mejor que usar el caché de 5 minutos simplemente porque es común que las solicitudes de lote tarden entre 5 minutos y 1 hora en completarse. Estamos considerando formas de mejorar estas tasas de acierto de caché y hacer este proceso más directo.
  
</section>
  <section title="¿Por qué estoy viendo el error `AttributeError: 'Beta' object has no attribute 'prompt_caching'` en Python?">

  Este error típicamente aparece cuando has actualizado tu SDK o estás usando ejemplos de código desactualizado. El almacenamiento en caché de prompts ahora está disponible en general, por lo que ya no necesitas el prefijo beta. En lugar de:
    <CodeGroup>
      ```python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>
    Simplemente usa:
    <CodeGroup>
      ```python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  
</section>
  <section title="¿Por qué estoy viendo 'TypeError: Cannot read properties of undefined (reading 'messages')'?">

  Este error típicamente aparece cuando has actualizado tu SDK o estás usando ejemplos de código desactualizado. El almacenamiento en caché de prompts ahora está disponible en general, por lo que ya no necesitas el prefijo beta. En lugar de:

      ```typescript TypeScript
      client.beta.promptCaching.messages.create(...)
      ```

      Simplemente usa:

      ```typescript
      client.messages.create(...)
      ```
  
</section>