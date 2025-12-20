# API de Archivos

---

La API de Archivos te permite cargar y gestionar archivos para usar con la API de Claude sin necesidad de volver a cargar contenido con cada solicitud. Esto es particularmente útil cuando se utiliza la [herramienta de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool) para proporcionar entradas (por ejemplo, conjuntos de datos y documentos) y luego descargar salidas (por ejemplo, gráficos). También puedes usar la API de Archivos para evitar tener que volver a cargar continuamente documentos e imágenes de uso frecuente en múltiples llamadas a la API. Puedes [explorar la referencia de la API directamente](/docs/es/api/files-create), además de esta guía.

<Note>
La API de Archivos está actualmente en beta. Por favor, ponte en contacto a través de nuestro [formulario de comentarios](https://forms.gle/tisHyierGwgN4DUE9) para compartir tu experiencia con la API de Archivos.
</Note>

## Modelos compatibles

Se admite hacer referencia a un `file_id` en una solicitud de Mensajes en todos los modelos que admiten el tipo de archivo dado. Por ejemplo, las [imágenes](/docs/es/build-with-claude/vision) se admiten en todos los modelos Claude 3+, los [PDF](/docs/es/build-with-claude/pdf-support) en todos los modelos Claude 3.5+, y [varios otros tipos de archivo](/docs/es/agents-and-tools/tool-use/code-execution-tool#supported-file-types) para la herramienta de ejecución de código en Claude 3.5 Haiku más todos los modelos Claude 3.7+.

La API de Archivos actualmente no es compatible con Amazon Bedrock ni Google Vertex AI.

## Cómo funciona la API de Archivos

La API de Archivos proporciona un enfoque simple de crear una vez, usar muchas veces para trabajar con archivos:

- **Cargar archivos** a nuestro almacenamiento seguro y recibir un `file_id` único
- **Descargar archivos** que se crean a partir de habilidades o la herramienta de ejecución de código
- **Hacer referencia a archivos** en solicitudes de [Mensajes](/docs/es/api/messages) usando el `file_id` en lugar de volver a cargar contenido
- **Gestionar tus archivos** con operaciones de lista, recuperación y eliminación

## Cómo usar la API de Archivos

<Note>
Para usar la API de Archivos, necesitarás incluir el encabezado de característica beta: `anthropic-beta: files-api-2025-04-14`.
</Note>

### Cargar un archivo

Carga un archivo para ser referenciado en futuras llamadas a la API:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@/path/to/document.pdf"
```

```python Python
import anthropic

client = anthropic.Anthropic()
client.beta.files.upload(
  file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
)
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from "fs";

const anthropic = new Anthropic();

await anthropic.beta.files.upload({
  file: await toFile(fs.createReadStream('/path/to/document.pdf'), undefined, { type: 'application/pdf' })
}, {
  betas: ['files-api-2025-04-14']
});
```
</CodeGroup>

La respuesta de cargar un archivo incluirá:

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-01-01T00:00:00Z",
  "downloadable": false
}
```

### Usar un archivo en mensajes

Una vez cargado, haz referencia al archivo usando su `file_id`:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Please summarize this document for me."          
          },
          {
            "type": "document",
            "source": {
              "type": "file",
              "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
            }
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please summarize this document for me."
                },
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                    }
                }
            ]
        }
    ],
    betas=["files-api-2025-04-14"],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please summarize this document for me."
        },
        {
          type: "document",
          source: {
            type: "file",
            file_id: "file_011CNha8iCJcU1wXNR6q4V8w"
          }
        }
      ]
    }
  ],
  betas: ["files-api-2025-04-14"],
});

console.log(response);
```
</CodeGroup>

### Tipos de archivo y bloques de contenido

La API de Archivos admite diferentes tipos de archivo que corresponden a diferentes tipos de bloques de contenido:

| Tipo de Archivo | Tipo MIME | Tipo de Bloque de Contenido | Caso de Uso |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | Análisis de texto, procesamiento de documentos |
| Texto plano | `text/plain` | `document` | Análisis de texto, procesamiento |
| Imágenes | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | Análisis de imágenes, tareas visuales |
| [Conjuntos de datos, otros](/docs/es/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | Varía | `container_upload` | Analizar datos, crear visualizaciones  |

### Trabajar con otros formatos de archivo

Para tipos de archivo que no se admiten como bloques `document` (.csv, .txt, .md, .docx, .xlsx), convierte los archivos a texto plano e incluye el contenido directamente en tu mensaje:

<CodeGroup>
```bash Shell
# Ejemplo: Leer un archivo de texto y enviarlo como texto plano
# Nota: Para archivos con caracteres especiales, considera codificación base64
TEXT_CONTENT=$(cat document.txt | jq -Rs .)

curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @- <<EOF
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Here's the document content:\n\n${TEXT_CONTENT}\n\nPlease summarize this document."
        }
      ]
    }
  ]
}
EOF
```

```python Python
import pandas as pd
import anthropic

client = anthropic.Anthropic()

# Ejemplo: Leer un archivo CSV
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# Enviar como texto plano en el mensaje
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Here's the CSV data:\n\n{csv_content}\n\nPlease analyze this data."
                }
            ]
        }
    ]
)

print(response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function analyzeDocument() {
  // Ejemplo: Leer un archivo de texto
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // Enviar como texto plano en el mensaje
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Here's the document content:\n\n${textContent}\n\nPlease summarize this document.`
          }
        ]
      }
    ]
  });

  console.log(response.content[0].text);
}

analyzeDocument();
```
</CodeGroup>

<Note>
Para archivos .docx que contienen imágenes, conviértelos a formato PDF primero, luego usa [compatibilidad con PDF](/docs/es/build-with-claude/pdf-support) para aprovechar el análisis de imágenes integrado. Esto permite usar citas del documento PDF.
</Note>

#### Bloques de documento

Para PDF y archivos de texto, usa el bloque de contenido `document`:

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // Opcional
  "context": "Context about the document", // Opcional  
  "citations": {"enabled": true} // Opcional, habilita citas
}
```

#### Bloques de imagen

Para imágenes, usa el bloque de contenido `image`:

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### Gestionar archivos

#### Listar archivos

Recupera una lista de tus archivos cargados:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
files = client.beta.files.list()
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const files = await anthropic.beta.files.list({
  betas: ['files-api-2025-04-14'],
});
```
</CodeGroup>

#### Obtener metadatos del archivo

Recupera información sobre un archivo específico:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
file = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const file = await anthropic.beta.files.retrieveMetadata(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

#### Eliminar un archivo

Elimina un archivo de tu espacio de trabajo:

<CodeGroup>
```bash Shell
curl -X DELETE https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const result = await anthropic.beta.files.delete(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

### Descargar un archivo

Descarga archivos que han sido creados por habilidades o la herramienta de ejecución de código:

<CodeGroup>
```bash Shell
curl -X GET "https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output downloaded_file.txt
```

```python Python
import anthropic

client = anthropic.Anthropic()
file_content = client.beta.files.download("file_011CNha8iCJcU1wXNR6q4V8w")

# Guardar en archivo
with open("downloaded_file.txt", "w") as f:
    f.write(file_content.decode('utf-8'))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

const fileContent = await anthropic.beta.files.download(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);

// Guardar en archivo
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
Solo puedes descargar archivos que fueron creados por [habilidades](/docs/es/build-with-claude/skills-guide) o la [herramienta de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool). Los archivos que cargaste no pueden ser descargados.
</Note>

---

## Almacenamiento de archivos y límites

### Límites de almacenamiento

- **Tamaño máximo de archivo:** 500 MB por archivo
- **Almacenamiento total:** 100 GB por organización

### Ciclo de vida del archivo

- Los archivos están limitados al espacio de trabajo de la clave de API. Otras claves de API pueden usar archivos creados por cualquier otra clave de API asociada con el mismo espacio de trabajo
- Los archivos persisten hasta que los elimines
- Los archivos eliminados no se pueden recuperar
- Los archivos son inaccesibles a través de la API poco después de su eliminación, pero pueden persistir en llamadas activas de la API de Mensajes y usos de herramientas asociados
- Los archivos que los usuarios eliminen serán eliminados de acuerdo con nuestra [política de retención de datos](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data).

---

## Manejo de errores

Los errores comunes al usar la API de Archivos incluyen:

- **Archivo no encontrado (404):** El `file_id` especificado no existe o no tienes acceso a él
- **Tipo de archivo inválido (400):** El tipo de archivo no coincide con el tipo de bloque de contenido (por ejemplo, usar un archivo de imagen en un bloque de documento)
- **Excede el tamaño de la ventana de contexto (400):** El archivo es más grande que el tamaño de la ventana de contexto (por ejemplo, usar un archivo de texto plano de 500 MB en una solicitud `/v1/messages`)
- **Nombre de archivo inválido (400):** El nombre de archivo no cumple con los requisitos de longitud (1-255 caracteres) o contiene caracteres prohibidos (`<`, `>`, `:`, `"`, `|`, `?`, `*`, `\`, `/`, o caracteres unicode 0-31)
- **Archivo demasiado grande (413):** El archivo excede el límite de 500 MB
- **Límite de almacenamiento excedido (403):** Tu organización ha alcanzado el límite de almacenamiento de 100 GB

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## Uso y facturación

Las operaciones de la API de Archivos son **gratuitas**:
- Cargar archivos
- Descargar archivos
- Listar archivos
- Obtener metadatos del archivo  
- Eliminar archivos

El contenido del archivo utilizado en solicitudes de `Messages` se factura como tokens de entrada. Solo puedes descargar archivos creados por [habilidades](/docs/es/build-with-claude/skills-guide) o la [herramienta de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool).

### Límites de velocidad

Durante el período beta:
- Las llamadas de API relacionadas con archivos están limitadas a aproximadamente 100 solicitudes por minuto
- [Contáctanos](mailto:sales@anthropic.com) si necesitas límites más altos para tu caso de uso