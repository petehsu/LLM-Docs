# Soporte para PDF

Procesa PDFs con Claude. Extrae texto, analiza gráficos y comprende contenido visual de tus documentos.

---

Ahora puedes preguntarle a Claude sobre cualquier texto, imágenes, gráficos y tablas en los PDFs que proporciones. Algunos casos de uso de ejemplo:
- Analizar informes financieros y comprender gráficos/tablas
- Extraer información clave de documentos legales
- Asistencia de traducción para documentos
- Convertir información de documentos en formatos estructurados

## Antes de comenzar

### Verificar requisitos de PDF
Claude funciona con cualquier PDF estándar. Sin embargo, debes asegurarte de que el tamaño de tu solicitud cumpla con estos requisitos al usar el soporte para PDF:

| Requisito | Límite |
|---|---|
| Tamaño máximo de solicitud | 32MB |
| Páginas máximas por solicitud | 100 |
| Formato | PDF estándar (sin contraseñas/encriptación) |

Ten en cuenta que ambos límites se aplican a toda la carga útil de la solicitud, incluyendo cualquier otro contenido enviado junto con los PDFs.

Dado que el soporte para PDF depende de las capacidades de visión de Claude, está sujeto a las mismas [limitaciones y consideraciones](/docs/es/build-with-claude/vision#limitations) que otras tareas de visión.

### Plataformas y modelos compatibles

El soporte para PDF está actualmente disponible a través del acceso directo a la API y Google Vertex AI. Todos los [modelos activos](/docs/es/about-claude/models/overview) admiten el procesamiento de PDF.

El soporte para PDF ahora está disponible en Amazon Bedrock con las siguientes consideraciones:

### Soporte para PDF en Amazon Bedrock

Al usar el soporte para PDF a través de la API Converse de Amazon Bedrock, hay dos modos distintos de procesamiento de documentos:

<Note>
**Importante**: Para acceder a las capacidades completas de comprensión visual de PDF de Claude en la API Converse, debes habilitar las citas. Sin las citas habilitadas, la API recurre únicamente a la extracción básica de texto. Aprende más sobre [trabajar con citas](/docs/es/build-with-claude/citations).
</Note>

#### Modos de Procesamiento de Documentos

1. **Chat de Documentos Converse** (Modo original - Solo extracción de texto)
   - Proporciona extracción básica de texto de PDFs
   - No puede analizar imágenes, gráficos o diseños visuales dentro de PDFs
   - Usa aproximadamente 1,000 tokens para un PDF de 3 páginas
   - Se usa automáticamente cuando las citas no están habilitadas

2. **Chat de PDF Claude** (Modo nuevo - Comprensión visual completa)
   - Proporciona análisis visual completo de PDFs
   - Puede entender y analizar gráficos, diagramas, imágenes y diseños visuales
   - Procesa cada página como texto e imagen para una comprensión integral
   - Usa aproximadamente 7,000 tokens para un PDF de 3 páginas
   - **Requiere que las citas estén habilitadas** en la API Converse

#### Limitaciones Clave

- **API Converse**: El análisis visual de PDF requiere que las citas estén habilitadas. Actualmente no hay opción para usar análisis visual sin citas (a diferencia de la API InvokeModel).
- **API InvokeModel**: Proporciona control completo sobre el procesamiento de PDF sin citas forzadas.

#### Problemas Comunes

Si los clientes reportan que Claude no está viendo imágenes o gráficos en sus PDFs al usar la API Converse, probablemente necesiten habilitar la bandera de citas. Sin ella, Converse recurre únicamente a la extracción básica de texto.

<Note>
Esta es una restricción conocida con la API Converse que estamos trabajando para abordar. Para aplicaciones que requieren análisis visual de PDF sin citas, considera usar la API InvokeModel en su lugar.
</Note>

<Note>
Para archivos que no son PDF como .csv, .xlsx, .docx, .md, o .txt, consulta [Trabajar con otros formatos de archivo](/docs/es/build-with-claude/files#working-with-other-file-formats).
</Note>

***

## Procesar PDFs con Claude

### Envía tu primera solicitud de PDF
Comencemos con un ejemplo simple usando la API Messages. Puedes proporcionar PDFs a Claude de tres maneras:

1. Como una referencia URL a un PDF alojado en línea
2. Como un PDF codificado en base64 en bloques de contenido `document`  
3. Por un `file_id` de la [API Files](/docs/es/build-with-claude/files)

#### Opción 1: Documento PDF basado en URL

El enfoque más simple es referenciar un PDF directamente desde una URL:

<CodeGroup>
   ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "url",
                    "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                }
            },
            {
                "type": "text",
                "text": "¿Cuáles son los hallazgos clave en este documento?"
            }]
        }]
    }'
    ```
    ```python Python
    import anthropic

    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "url",
                            "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                        }
                    },
                    {
                        "type": "text",
                        "text": "¿Cuáles son los hallazgos clave en este documento?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic();
    
    async function main() {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'url',
                  url: 'https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf',
                },
              },
              {
                type: 'text',
                text: '¿Cuáles son los hallazgos clave en este documento?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```
    ```java Java
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.*;

    public class PdfExample {
        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Create document block with URL
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .urlPdfSource("https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf")
                    .build();

            // Create a message with document and text content blocks
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("¿Cuáles son los hallazgos clave en este documento?")
 .build()
 )
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message.content());
        }
    }
    ```
</CodeGroup>

#### Opción 2: Documento PDF codificado en base64

Si necesitas enviar PDFs desde tu sistema local o cuando una URL no está disponible:

<CodeGroup>
    ```bash Shell
    # Método 1: Obtener y codificar un PDF remoto
    curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

    # Método 2: Codificar un archivo PDF local
    # base64 document.pdf | tr -d '\n' > pdf_base64.txt

    # Crear un archivo de solicitud JSON usando el contenido de pdf_base64.txt
    jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": $PDF_BASE64
                }
            },
            {
                "type": "text",
                "text": "¿Cuáles son los hallazgos clave en este documento?"
            }]
        }]
    }' > request.json

    # Enviar la solicitud de API usando el archivo JSON
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d @request.json
    ```
    ```python Python
    import anthropic
    import base64
    import httpx

    # Primero, cargar y codificar el PDF 
    pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
    pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

    # Alternativa: Cargar desde un archivo local
    # with open("document.pdf", "rb") as f:
    #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

    # Enviar a Claude usando codificación base64
    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_data
                        }
                    },
                    {
                        "type": "text",
                        "text": "¿Cuáles son los hallazgos clave en este documento?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';
    import fetch from 'node-fetch';
    import fs from 'fs';

    async function main() {
      // Método 1: Obtener y codificar un PDF remoto
      const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
      const pdfResponse = await fetch(pdfURL);
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
      
      // Método 2: Cargar desde un archivo local
      // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
      
      // Enviar la solicitud de API con PDF codificado en base64
      const anthropic = new Anthropic();
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: '¿Cuáles son los hallazgos clave en este documento?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```

    ```java Java
    import java.io.IOException;
    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.util.Base64;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.ContentBlockParam;
    import com.anthropic.models.messages.DocumentBlockParam;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.TextBlockParam;

    public class PdfExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Método 1: Descargar y codificar un PDF remoto
            String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pdfUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

            // Método 2: Cargar desde un archivo local
            // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
            // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

            // Crear bloque de documento con datos base64
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .base64PdfSource(pdfBase64)
                    .build();

            // Crear un mensaje con bloques de contenido de documento y texto
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(TextBlockParam.builder().text("¿Cuáles son los hallazgos clave en este documento?").build())
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            message.content().stream()
                    .flatMap(contentBlock -> contentBlock.text().stream())
                    .forEach(textBlock -> System.out.println(textBlock.text()));
        }
    }
    ```

</CodeGroup>

#### Opción 3: API Files

Para PDFs que usarás repetidamente, o cuando quieras evitar la sobrecarga de codificación, usa la [API Files](/docs/es/build-with-claude/files): 

<CodeGroup>
```bash Shell
# Primero, sube tu PDF a la API Files
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@document.pdf"

# Luego usa el file_id devuelto en tu mensaje
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -d '{
    "model": "claude-sonnet-4-5", 
    "max_tokens": 1024,
    "messages": [{
      "role": "user",
      "content": [{
        "type": "document",
        "source": {
          "type": "file",
          "file_id": "file_abc123"
        }
      },
      {
        "type": "text",
        "text": "¿Cuáles son los hallazgos clave en este documento?"
      }]
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Subir el archivo PDF
with open("document.pdf", "rb") as f:
    file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

# Usar el archivo subido en un mensaje
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": file_upload.id
                    }
                },
                {
                    "type": "text",
                    "text": "¿Cuáles son los hallazgos clave en este documento?"
                }
            ]
        }
    ],
)

print(message.content)
```

```typescript TypeScript
import { Anthropic, toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Subir el archivo PDF
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Usar el archivo subido en un mensaje
  const response = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    betas: ['files-api-2025-04-14'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'file',
              file_id: fileUpload.id
            }
          },
          {
            type: 'text',
            text: '¿Cuáles son los hallazgos clave en este documento?'
          }
        ]
      }
    ]
  });

  console.log(response);
}

main();
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.File;
import com.anthropic.models.files.FileUploadParams;
import com.anthropic.models.messages.*;

public class PdfFilesExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Subir el archivo PDF
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("document.pdf")))
                .build());

        // Usar el archivo subido en un mensaje
        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .fileSource(file.id())
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(
                        List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("¿Cuáles son los hallazgos clave en este documento?")
 .build()
 )
                        )
                )
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.content());
    }
}
```
</CodeGroup>

### Cómo funciona el soporte para PDF
Cuando envías un PDF a Claude, ocurren los siguientes pasos:
<Steps>
  <Step title="El sistema extrae el contenido del documento.">
    - El sistema convierte cada página del documento en una imagen.
    - El texto de cada página se extrae y se proporciona junto con la imagen de cada página.
  </Step>
  <Step title="Claude analiza tanto el texto como las imágenes para comprender mejor el documento.">
    - Los documentos se proporcionan como una combinación de texto e imágenes para análisis.
    - Esto permite a los usuarios pedir información sobre elementos visuales de un PDF, como gráficos, diagramas y otro contenido no textual.
  </Step>
  <Step title="Claude responde, haciendo referencia al contenido del PDF si es relevante.">
    Claude puede referenciar tanto contenido textual como visual cuando responde. Puedes mejorar aún más el rendimiento integrando el soporte para PDF con:
    - **Caché de prompts**: Para mejorar el rendimiento en análisis repetidos.
    - **Procesamiento por lotes**: Para procesamiento de documentos de alto volumen.
    - **Uso de herramientas**: Para extraer información específica de documentos para usar como entradas de herramientas.
  </Step>
</Steps>

### Estima tus costos
El recuento de tokens de un archivo PDF depende del texto total extraído del documento así como del número de páginas:
- Costos de tokens de texto: Cada página típicamente usa 1,500-3,000 tokens por página dependiendo de la densidad del contenido. Se aplican precios estándar de API sin tarifas adicionales por PDF.
- Costos de tokens de imagen: Dado que cada página se convierte en una imagen, se aplican los mismos [cálculos de costo basados en imagen](/docs/es/build-with-claude/vision#evaluate-image-size).

Puedes usar [conteo de tokens](/docs/es/build-with-claude/token-counting) para estimar costos para tus PDFs específicos.

***

## Optimizar el procesamiento de PDF

### Mejorar el rendimiento
Sigue estas mejores prácticas para obtener resultados óptimos:
- Coloca los PDFs antes del texto en tus solicitudes
- Usa fuentes estándar
- Asegúrate de que el texto sea claro y legible
- Rota las páginas a la orientación vertical correcta
- Usa números de página lógicos (del visor de PDF) en los prompts
- Divide PDFs grandes en fragmentos cuando sea necesario
- Habilita el caché de prompts para análisis repetidos

### Escala tu implementación
Para procesamiento de alto volumen, considera estos enfoques:

#### Usar caché de prompts
Almacena en caché los PDFs para mejorar el rendimiento en consultas repetidas:
<CodeGroup>
```bash Shell
# Crear un archivo de solicitud JSON usando el contenido de pdf_base64.txt
jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [{
        "role": "user",
        "content": [{
            "type": "document",
            "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": $PDF_BASE64
            },
            "cache_control": {
              "type": "ephemeral"
            }
        },
        {
            "type": "text",
            "text": "¿Qué modelo tiene las tasas de preferencia humana más altas en cada caso de uso?"
        }]
    }]
}' > request.json

# Luego hacer la llamada a la API usando el archivo JSON
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data
                    },
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "Analiza este documento."
                }
            ]
        }
    ],
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    {
      content: [
        {
          type: 'document',
          source: {
            media_type: 'application/pdf',
            type: 'base64',
            data: pdfBase64,
          },
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: '¿Qué modelo tiene las tasas de preferencia humana más altas en cada caso de uso?',
        },
      ],
      role: 'user',
    },
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Base64PdfSource;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.DocumentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class MessagesDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Leer archivo PDF como base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .cacheControl(CacheControlEphemeral.builder().build())
 .build()),
                        ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("¿Qué modelo tiene las tasas de preferencia humana más altas en cada caso de uso?")
 .build())
                ))
                .build();


        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

#### Procesar lotes de documentos
Usa la API Message Batches para flujos de trabajo de alto volumen:
<CodeGroup>
```bash Shell
# Crear un archivo de solicitud JSON usando el contenido de pdf_base64.txt
jq -n --rawfile PDF_BASE64 pdf_base64.txt '
{
  "requests": [
      {
          "custom_id": "my-first-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "¿Qué modelo tiene las tasas de preferencia humana más altas en cada caso de uso?"
                        }
                    ]
                }
              ]
          }
      },
      {
          "custom_id": "my-second-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Extrae 5 ideas clave de este documento."
                        }
                    ]
                }
              ]
          }
      }
  ]
}
' > request.json

# Luego hacer la llamada a la API usando el archivo JSON
curl https://api.anthropic.com/v1/messages/batches \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message_batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "doc1",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
 "type": "document",
 "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": pdf_data
 }
                            },
                            {
 "type": "text",
 "text": "Resume este documento."
                            }
                        ]
                    }
                ]
            }
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.batches.create({
  requests: [
    {
      custom_id: 'my-first-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: '¿Qué modelo tiene las tasas de preferencia humana más altas en cada caso de uso?',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    },
    {
      custom_id: 'my-second-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Extrae 5 ideas clave de este documento.',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    }
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;
import com.anthropic.models.messages.batches.*;

public class MessagesBatchDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Leer archivo PDF como base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        BatchCreateParams params = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("¿Qué modelo tiene las tasas de preferencia humana más altas en cada caso de uso?")
 .build()
 )
 ))
 .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Extrae 5 ideas clave de este documento.")
 .build()
 )
 ))
 .build())
                        .build())
                .build();

        MessageBatch batch = client.messages().batches().create(params);
        System.out.println(batch);
    }
}
```
</CodeGroup>

## Próximos pasos

<CardGroup cols={2}>
  <Card
    title="Prueba ejemplos de PDF"
    icon="file"
    href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal"
  >
    Explora ejemplos prácticos de procesamiento de PDF en nuestra receta de cookbook.
  </Card>

  <Card
    title="Ver referencia de API"
    icon="code"
    href="/docs/es/api/messages"
  >
    Consulta la documentación completa de la API para el soporte de PDF.
  </Card>
</CardGroup>