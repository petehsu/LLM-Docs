# Citas

Claude es capaz de proporcionar citas detalladas al responder preguntas sobre documentos, ayudándote a rastrear y verificar las fuentes de información en las respuestas.

---

Claude es capaz de proporcionar citas detalladas al responder preguntas sobre documentos, ayudándote a rastrear y verificar las fuentes de información en las respuestas.

Todos los [modelos activos](/docs/es/about-claude/models/overview) admiten citas, con la excepción de Haiku 3.

<Warning>
*Citas con Claude Sonnet 3.7*

Claude Sonnet 3.7 puede ser menos propenso a hacer citas en comparación con otros modelos de Claude sin instrucciones más explícitas del usuario. Al usar citas con Claude Sonnet 3.7, recomendamos incluir instrucciones adicionales en el turno del `user`, como `"Usa citas para respaldar tu respuesta."` por ejemplo.

También hemos observado que cuando se le pide al modelo que estructure su respuesta, es poco probable que use citas a menos que se le diga explícitamente que use citas dentro de ese formato. Por ejemplo, si se le pide al modelo que use etiquetas `<result>` en su respuesta, deberías agregar algo como `"Siempre usa citas en tu respuesta, incluso dentro de las etiquetas <result>."`
</Warning>
<Tip>
  Por favor comparte tus comentarios y sugerencias sobre la función de citas usando este [formulario](https://forms.gle/9n9hSrKnKe3rpowH9).
</Tip>

Aquí tienes un ejemplo de cómo usar citas con la API de Messages:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "text",
              "media_type": "text/plain",
              "data": "The grass is green. The sky is blue."
            },
            "title": "My Document",
            "context": "This is a trustworthy document.",
            "citations": {"enabled": true}
          },
          {
            "type": "text",
            "text": "What color is the grass and sky?"
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
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "The grass is green. The sky is blue."
                    },
                    "title": "My Document",
                    "context": "This is a trustworthy document.",
                    "citations": {"enabled": True}
                },
                {
                    "type": "text",
                    "text": "What color is the grass and sky?"
                }
            ]
        }
    ]
)
print(response)
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;

public class DocumentExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        PlainTextSource source = PlainTextSource.builder()
                .data("The grass is green. The sky is blue.")
                .build();

        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .source(source)
                .title("My Document")
                .context("This is a trustworthy document.")
                .citations(CitationsConfigParam.builder().enabled(true).build())
                .build();
        
        TextBlockParam textBlockParam = TextBlockParam.builder()
                .text("What color is the grass and sky?")
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(ContentBlockParam.ofDocument(documentParam), ContentBlockParam.ofText(textBlockParam)))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```

</CodeGroup>

<Tip>
**Comparación con enfoques basados en prompts**

En comparación con las soluciones de citas basadas en prompts, la función de citas tiene las siguientes ventajas:
- **Ahorro de costos:** Si tu enfoque basado en prompts le pide a Claude que produzca citas directas, puedes ver ahorros de costos debido al hecho de que `cited_text` no cuenta hacia tus tokens de salida.
- **Mejor confiabilidad de citas:** Debido a que analizamos las citas en los formatos de respuesta respectivos mencionados anteriormente y extraemos `cited_text`, las citas están garantizadas de contener punteros válidos a los documentos proporcionados.
- **Calidad mejorada de citas:** En nuestras evaluaciones, encontramos que la función de citas es significativamente más propensa a citar las citas más relevantes de los documentos en comparación con enfoques puramente basados en prompts.
</Tip>

---

## Cómo funcionan las citas

Integra las citas con Claude en estos pasos:

<Steps>
  <Step title="Proporcionar documento(s) y habilitar citas">
    - Incluye documentos en cualquiera de los formatos compatibles: [PDFs](#pdf-documents), [texto plano](#plain-text-documents), o documentos de [contenido personalizado](#custom-content-documents)
    - Establece `citations.enabled=true` en cada uno de tus documentos. Actualmente, las citas deben estar habilitadas en todos o ninguno de los documentos dentro de una solicitud.
    - Ten en cuenta que actualmente solo se admiten citas de texto y las citas de imágenes aún no son posibles.
  </Step>
  <Step title="Los documentos se procesan">
    - El contenido de los documentos se "fragmenta" para definir la granularidad mínima de las posibles citas. Por ejemplo, la fragmentación de oraciones permitiría a Claude citar una sola oración o encadenar múltiples oraciones consecutivas para citar un párrafo (¡o más largo)!
      - **Para PDFs:** El texto se extrae como se describe en [Soporte de PDF](/docs/es/build-with-claude/pdf-support) y el contenido se fragmenta en oraciones. Citar imágenes de PDFs no está actualmente soportado.
      - **Para documentos de texto plano:** El contenido se fragmenta en oraciones que pueden ser citadas.
      - **Para documentos de contenido personalizado:** Tus bloques de contenido proporcionados se usan tal como están y no se hace fragmentación adicional.
  </Step>
  <Step title="Claude proporciona respuesta citada">
    - Las respuestas ahora pueden incluir múltiples bloques de texto donde cada bloque de texto puede contener una afirmación que Claude está haciendo y una lista de citas que respaldan la afirmación.
    - Las citas hacen referencia a ubicaciones específicas en los documentos fuente. El formato de estas citas depende del tipo de documento del que se está citando.
      - **Para PDFs:** las citas incluirán el rango de números de página (indexado desde 1).
      - **Para documentos de texto plano:** Las citas incluirán el rango de índices de caracteres (indexado desde 0).
      - **Para documentos de contenido personalizado:** Las citas incluirán el rango de índices de bloques de contenido (indexado desde 0) correspondiente a la lista de contenido original proporcionada.
    - Se proporcionan índices de documentos para indicar la fuente de referencia y están indexados desde 0 según la lista de todos los documentos en tu solicitud original.
  </Step>
</Steps>

<Tip>
  **Fragmentación automática vs contenido personalizado**

  Por defecto, los documentos de texto plano y PDF se fragmentan automáticamente en oraciones. Si necesitas más control sobre la granularidad de las citas (por ejemplo, para viñetas o transcripciones), usa documentos de contenido personalizado en su lugar. Consulta [Tipos de Documentos](#document-types) para más detalles.

  Por ejemplo, si quieres que Claude pueda citar oraciones específicas de tus fragmentos RAG, deberías poner cada fragmento RAG en un documento de texto plano. De lo contrario, si no quieres que se haga ninguna fragmentación adicional, o si quieres personalizar cualquier fragmentación adicional, puedes poner fragmentos RAG en documento(s) de contenido personalizado.
</Tip>

### Contenido citable vs no citable

- El texto encontrado dentro del contenido `source` de un documento puede ser citado.
- `title` y `context` son campos opcionales que se pasarán al modelo pero no se usarán hacia el contenido citado.
- `title` tiene una longitud limitada, por lo que puedes encontrar útil el campo `context` para almacenar cualquier metadato del documento como texto o json stringificado.

### Índices de citas
- Los índices de documentos están indexados desde 0 de la lista de todos los bloques de contenido de documentos en la solicitud (abarcando todos los mensajes).
- Los índices de caracteres están indexados desde 0 con índices finales exclusivos.
- Los números de página están indexados desde 1 con números de página finales exclusivos.
- Los índices de bloques de contenido están indexados desde 0 con índices finales exclusivos de la lista `content` proporcionada en el documento de contenido personalizado.

### Costos de tokens
- Habilitar citas incurre en un ligero aumento en los tokens de entrada debido a las adiciones del prompt del sistema y la fragmentación de documentos.
- Sin embargo, la función de citas es muy eficiente con los tokens de salida. Internamente, el modelo está produciendo citas en un formato estandarizado que luego se analizan en texto citado e índices de ubicación de documentos. El campo `cited_text` se proporciona por conveniencia y no cuenta hacia los tokens de salida.
- Cuando se pasa de vuelta en turnos de conversación posteriores, `cited_text` tampoco se cuenta hacia los tokens de entrada.

### Compatibilidad de funciones
Las citas funcionan en conjunto con otras funciones de la API incluyendo [caché de prompts](/docs/es/build-with-claude/prompt-caching), [conteo de tokens](/docs/es/build-with-claude/token-counting) y [procesamiento por lotes](/docs/es/build-with-claude/batch-processing).

#### Usar Caché de Prompts con Citas

Las citas y el caché de prompts se pueden usar juntos de manera efectiva.

Los bloques de citas generados en las respuestas no se pueden cachear directamente, pero los documentos fuente que referencian sí se pueden cachear. Para optimizar el rendimiento, aplica `cache_control` a tus bloques de contenido de documentos de nivel superior.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Contenido de documento largo (por ejemplo, documentación técnica)
long_document = "Este es un documento muy largo con miles de palabras..." + " ... " * 1000  # Longitud mínima cacheable

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": long_document
                    },
                    "citations": {"enabled": True},
                    "cache_control": {"type": "ephemeral"}  # Cachear el contenido del documento
                },
                {
                    "type": "text",
                    "text": "¿Qué dice este documento sobre las funciones de la API?"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Contenido de documento largo (por ejemplo, documentación técnica)
const longDocument = "Este es un documento muy largo con miles de palabras..." + " ... ".repeat(1000);  // Longitud mínima cacheable

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "text",
            media_type: "text/plain",
            data: longDocument
          },
          citations: { enabled: true },
          cache_control: { type: "ephemeral" }  // Cachear el contenido del documento
        },
        {
          type: "text",
          text: "¿Qué dice este documento sobre las funciones de la API?"
        }
      ]
    }
  ]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "Este es un documento muy largo con miles de palabras..."
                    },
                    "citations": {"enabled": true},
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "¿Qué dice este documento sobre las funciones de la API?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

En este ejemplo:
- El contenido del documento se cachea usando `cache_control` en el bloque del documento
- Las citas están habilitadas en el documento
- Claude puede generar respuestas con citas mientras se beneficia del contenido del documento cacheado
- Las solicitudes posteriores usando el mismo documento se beneficiarán del contenido cacheado

## Tipos de Documentos

### Elegir un tipo de documento

Admitimos tres tipos de documentos para citas. Los documentos se pueden proporcionar directamente en el mensaje (base64, texto o URL) o subir a través de la [API de Files](/docs/es/build-with-claude/files) y referenciar por `file_id`:

| Tipo | Mejor para | Fragmentación | Formato de cita |
| :--- | :--- | :--- | :--- |
| Texto plano | Documentos de texto simples, prosa | Oración | Índices de caracteres (indexado desde 0) |
| PDF | Archivos PDF con contenido de texto | Oración | Números de página (indexado desde 1) |
| Contenido personalizado | Listas, transcripciones, formato especial, citas más granulares | Sin fragmentación adicional | Índices de bloques (indexado desde 0) |

<Note>
Los archivos .csv, .xlsx, .docx, .md y .txt no están soportados como bloques de documentos. Convierte estos a texto plano e incluye directamente en el contenido del mensaje. Consulta [Trabajar con otros formatos de archivo](/docs/es/build-with-claude/files#working-with-other-file-formats).
</Note>

### Documentos de texto plano

Los documentos de texto plano se fragmentan automáticamente en oraciones. Puedes proporcionarlos en línea o por referencia con su `file_id`:

<Tabs>
<Tab title="Texto en línea">
```python
{
    "type": "document",
    "source": {
        "type": "text",
        "media_type": "text/plain",
        "data": "Contenido de texto plano..."
    },
    "title": "Título del Documento", # opcional
    "context": "Contexto sobre el documento del que no se citará", # opcional
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="API de Files">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Título del Documento", # opcional
    "context": "Contexto sobre el documento del que no se citará", # opcional
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Ejemplo de cita de texto plano">

```python
{
    "type": "char_location",
    "cited_text": "El texto exacto que se está citando", # no cuenta hacia los tokens de salida
    "document_index": 0,
    "document_title": "Título del Documento",
    "start_char_index": 0,    # indexado desde 0
    "end_char_index": 50      # exclusivo
}
```

</section>

### Documentos PDF

Los documentos PDF se pueden proporcionar como datos codificados en base64 o por `file_id`. El texto del PDF se extrae y se fragmenta en oraciones. Como las citas de imágenes aún no están soportadas, los PDFs que son escaneos de documentos y no contienen texto extraíble no serán citables.

<Tabs>
<Tab title="Base64">
```python
{
    "type": "document",
    "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": base64_encoded_pdf_data
    },
    "title": "Título del Documento", # opcional
    "context": "Contexto sobre el documento del que no se citará", # opcional
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="API de Files">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Título del Documento", # opcional
    "context": "Contexto sobre el documento del que no se citará", # opcional
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Ejemplo de cita de PDF">

```python
{
    "type": "page_location",
    "cited_text": "El texto exacto que se está citando", # no cuenta hacia los tokens de salida
    "document_index": 0,     
    "document_title": "Título del Documento", 
    "start_page_number": 1,  # indexado desde 1
    "end_page_number": 2     # exclusivo
}
```

</section>

### Documentos de contenido personalizado

Los documentos de contenido personalizado te dan control sobre la granularidad de las citas. No se hace fragmentación adicional y los fragmentos se proporcionan al modelo según los bloques de contenido proporcionados.

```python
{
    "type": "document",
    "source": {
        "type": "content",
        "content": [
            {"type": "text", "text": "Primer fragmento"},
            {"type": "text", "text": "Segundo fragmento"}
        ]
    },
    "title": "Título del Documento", # opcional
    "context": "Contexto sobre el documento del que no se citará", # opcional
    "citations": {"enabled": True}
}
```

<section title="Ejemplo de cita">

```python
{
    "type": "content_block_location",
    "cited_text": "El texto exacto que se está citando", # no cuenta hacia los tokens de salida
    "document_index": 0,
    "document_title": "Título del Documento",
    "start_block_index": 0,   # indexado desde 0
    "end_block_index": 1      # exclusivo
}
```

</section>

---

## Estructura de Respuesta

Cuando las citas están habilitadas, las respuestas incluyen múltiples bloques de texto con citas:

```python
{
    "content": [
        {
            "type": "text",
            "text": "Según el documento, "
        },
        {
            "type": "text",
            "text": "la hierba es verde",
            "citations": [{
                "type": "char_location",
                "cited_text": "La hierba es verde.",
                "document_index": 0,
                "document_title": "Documento de Ejemplo",
                "start_char_index": 0,
                "end_char_index": 20
            }]
        },
        {
            "type": "text",
            "text": " y "
        },
        {
            "type": "text",
            "text": "el cielo es azul",
            "citations": [{
                "type": "char_location",
                "cited_text": "El cielo es azul.",
                "document_index": 0,
                "document_title": "Documento de Ejemplo",
                "start_char_index": 20,
                "end_char_index": 36
            }]
        },
        {
            "type": "text",
            "text": ". La información de la página 5 establece que ",
        },
        {
            "type": "text",
            "text": "el agua es esencial",
            "citations": [{
                "type": "page_location",
                "cited_text": "El agua es esencial para la vida.",
                "document_index": 1,
                "document_title": "Documento PDF",
                "start_page_number": 5,
                "end_page_number": 6
            }]
        },
        {
            "type": "text",
            "text": ". El documento personalizado menciona ",
        },
        {
            "type": "text",
            "text": "hallazgos importantes",
            "citations": [{
                "type": "content_block_location",
                "cited_text": "Estos son hallazgos importantes.",
                "document_index": 2,
                "document_title": "Documento de Contenido Personalizado",
                "start_block_index": 0,
                "end_block_index": 1
            }]
        }
    ]
}
```

### Soporte de Streaming

Para respuestas de streaming, hemos agregado un tipo `citations_delta` que contiene una sola cita para ser agregada a la lista `citations` en el bloque de contenido `text` actual.

<section title="Ejemplo de eventos de streaming">

```python
event: message_start
data: {"type": "message_start", ...}

event: content_block_start
data: {"type": "content_block_start", "index": 0, ...}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, 
       "delta": {"type": "text_delta", "text": "Según..."}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0,
       "delta": {"type": "citations_delta", 
                 "citation": {
                     "type": "char_location",
                     "cited_text": "...",
                     "document_index": 0,
                     ...
                 }}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_stop
data: {"type": "message_stop"}
```

</section>