# Herramienta de ejecución de código

Claude puede analizar datos, crear visualizaciones, realizar cálculos complejos, ejecutar comandos del sistema, crear y editar archivos, y procesar archivos cargados directamente dentro de la conversación de la API.

---

Claude puede analizar datos, crear visualizaciones, realizar cálculos complejos, ejecutar comandos del sistema, crear y editar archivos, y procesar archivos cargados directamente dentro de la conversación de la API.
La herramienta de ejecución de código permite que Claude ejecute comandos Bash y manipule archivos, incluida la escritura de código, en un entorno seguro y aislado.

<Note>
La herramienta de ejecución de código está actualmente en beta pública.

Para usar esta función, agregue el encabezado beta `"code-execution-2025-08-25"` [beta header](/docs/es/api/beta-headers) a sus solicitudes de API.
</Note>

## Compatibilidad de modelos

La herramienta de ejecución de código está disponible en los siguientes modelos:

| Modelo | Versión de herramienta |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Opus 4.1 (`claude-opus-4-1-20250805`) | `code_execution_20250825` |
| Claude Opus 4 (`claude-opus-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |
| Claude Sonnet 4 (`claude-sonnet-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([deprecated](/docs/es/about-claude/model-deprecations)) | `code_execution_20250825` |
| Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | `code_execution_20250825` |
| Claude Haiku 3.5 (`claude-3-5-haiku-latest`) | `code_execution_20250825` |

<Note>
La versión actual `code_execution_20250825` admite comandos Bash y operaciones de archivos. También está disponible una versión heredada `code_execution_20250522` (solo Python). Consulte [Upgrade to latest tool version](#upgrade-to-latest-tool-version) para obtener detalles de migración.
</Note>

<Warning>
Las versiones de herramienta más antiguas no tienen garantía de ser compatibles hacia atrás con modelos más nuevos. Siempre use la versión de herramienta que corresponda a su versión de modelo.
</Warning>

## Inicio rápido

Aquí hay un ejemplo simple que le pide a Claude que realice un cálculo:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            }
        ],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      }
    ],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Cómo funciona la ejecución de código

Cuando agrega la herramienta de ejecución de código a su solicitud de API:

1. Claude evalúa si la ejecución de código ayudaría a responder su pregunta
2. La herramienta proporciona automáticamente a Claude las siguientes capacidades:
   - **Comandos Bash**: Ejecutar comandos de shell para operaciones del sistema y gestión de paquetes
   - **Operaciones de archivos**: Crear, ver y editar archivos directamente, incluida la escritura de código
3. Claude puede usar cualquier combinación de estas capacidades en una única solicitud
4. Todas las operaciones se ejecutan en un entorno sandbox seguro
5. Claude proporciona resultados con cualquier gráfico generado, cálculos o análisis

## Cómo usar la herramienta

### Ejecutar comandos Bash

Pida a Claude que verifique la información del sistema e instale paquetes:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Check the Python version and list installed packages"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Check the Python version and list installed packages"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Check the Python version and list installed packages"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### Crear y editar archivos directamente

Claude puede crear, ver y editar archivos directamente en el sandbox usando las capacidades de manipulación de archivos:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### Cargar y analizar sus propios archivos

Para analizar sus propios archivos de datos (CSV, Excel, imágenes, etc.), cárguelos a través de la API de archivos y haga referencia a ellos en su solicitud:

<Note>
Usar la API de archivos con Code Execution requiere dos encabezados beta: `"anthropic-beta": "code-execution-2025-08-25,files-api-2025-04-14"`
</Note>

El entorno de Python puede procesar varios tipos de archivos cargados a través de la API de archivos, incluidos:

- CSV
- Excel (.xlsx, .xls)
- JSON
- XML
- Imágenes (JPEG, PNG, GIF, WebP)
- Archivos de texto (.txt, .md, .py, etc)

#### Cargar y analizar archivos

1. **Cargue su archivo** usando la [Files API](/docs/es/build-with-claude/files)
2. **Haga referencia al archivo** en su mensaje usando un bloque de contenido `container_upload`
3. **Incluya la herramienta de ejecución de código** en su solicitud de API

<CodeGroup>
```bash Shell
# First, upload a file
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \

# Then use the file_id with code execution
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this CSV data"},
                {"type": "container_upload", "file_id": "file_abc123"}
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Upload a file
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# Use the file_id with code execution
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { createReadStream } from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Upload a file
  const fileObject = await anthropic.beta.files.create({
    file: createReadStream("data.csv"),
  });

  // Use the file_id with code execution
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Analyze this CSV data" },
        { type: "container_upload", file_id: fileObject.id }
      ]
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

#### Recuperar archivos generados

Cuando Claude crea archivos durante la ejecución de código, puede recuperar estos archivos usando la API de archivos:

<CodeGroup>
```python Python
from anthropic import Anthropic

# Initialize the client
client = Anthropic()

# Request code execution that creates files
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a matplotlib visualization and save it as output.png"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Extract file IDs from the response
def extract_file_ids(response):
    file_ids = []
    for item in response.content:
        if item.type == 'bash_code_execution_tool_result':
            content_item = item.content
            if content_item.type == 'bash_code_execution_result':
                for file in content_item.content:
                    if hasattr(file, 'file_id'):
                        file_ids.append(file.file_id)
    return file_ids

# Download the created files
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(file_id)
    file_content = client.beta.files.download(file_id)
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

// Initialize the client
const anthropic = new Anthropic();

async function main() {
  // Request code execution that creates files
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Create a matplotlib visualization and save it as output.png"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // Extract file IDs from the response
  function extractFileIds(response: any): string[] {
    const fileIds: string[] = [];
    for (const item of response.content) {
      if (item.type === 'bash_code_execution_tool_result') {
        const contentItem = item.content;
        if (contentItem.type === 'bash_code_execution_result' && contentItem.content) {
          for (const file of contentItem.content) {
            fileIds.push(file.file_id);
          }
        }
      }
    }
    return fileIds;
  }

  // Download the created files
  const fileIds = extractFileIds(response);
  for (const fileId of fileIds) {
    const fileMetadata = await anthropic.beta.files.retrieveMetadata(fileId);
    const fileContent = await anthropic.beta.files.download(fileId);

    // Convert ReadableStream to Buffer and save
    const chunks: Uint8Array[] = [];
    for await (const chunk of fileContent) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    writeFileSync(fileMetadata.filename, buffer);
    console.log(`Downloaded: ${fileMetadata.filename}`);
  }
}

main().catch(console.error);
```
</CodeGroup>

### Combinar operaciones

Un flujo de trabajo complejo usando todas las capacidades:

<CodeGroup>
```bash Shell
# First, upload a file
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \
    > file_response.json

# Extract file_id (using jq)
FILE_ID=$(jq -r '.id' file_response.json)

# Then use it with code execution
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {
                    "type": "text", 
                    "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"
                },
                {
                    "type": "container_upload", 
                    "file_id": "'$FILE_ID'"
                }
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
# Upload a file
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# Use it with code execution
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Claude might:
# 1. Use bash to check file size and preview data
# 2. Use text_editor to write Python code to analyze the CSV and create visualizations
# 3. Use bash to run the Python code
# 4. Use text_editor to create a README.md with findings
# 5. Use bash to organize files into a report directory
```

```typescript TypeScript
// Upload a file
const fileObject = await anthropic.beta.files.create({
  file: createReadStream("data.csv"),
});

// Use it with code execution
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: [
      {type: "text", text: "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
      {type: "container_upload", file_id: fileObject.id}
    ]
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});

// Claude might:
// 1. Use bash to check file size and preview data
// 2. Use text_editor to write Python code to analyze the CSV and create visualizations
// 3. Use bash to run the Python code
// 4. Use text_editor to create a README.md with findings
// 5. Use bash to organize files into a report directory
```
</CodeGroup>

## Definición de herramienta

La herramienta de ejecución de código no requiere parámetros adicionales:

```json JSON
{
  "type": "code_execution_20250825",
  "name": "code_execution"
}
```

Cuando se proporciona esta herramienta, Claude obtiene automáticamente acceso a dos subherramientas:
- `bash_code_execution`: Ejecutar comandos de shell
- `text_editor_code_execution`: Ver, crear y editar archivos, incluida la escritura de código

## Formato de respuesta

La herramienta de ejecución de código puede devolver dos tipos de resultados según la operación:

### Respuesta de comando Bash

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "name": "bash_code_execution",
  "input": {
    "command": "ls -la | head -5"
  }
},
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "content": {
    "type": "bash_code_execution_result",
    "stdout": "total 24\ndrwxr-xr-x 2 user user 4096 Jan 1 12:00 .\ndrwxr-xr-x 3 user user 4096 Jan 1 11:00 ..\n-rw-r--r-- 1 user user  220 Jan 1 12:00 data.csv\n-rw-r--r-- 1 user user  180 Jan 1 12:00 config.json",
    "stderr": "",
    "return_code": 0
  }
}
```

### Respuestas de operación de archivos

**Ver archivo:**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "text_editor_code_execution",
  "input": {
    "command": "view",
    "path": "config.json"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": {
    "type": "text_editor_code_execution_result",
    "file_type": "text",
    "content": "{\n  \"setting\": \"value\",\n  \"debug\": true\n}",
    "numLines": 4,
    "startLine": 1,
    "totalLines": 4
  }
}
```

**Crear archivo:**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "text_editor_code_execution",
  "input": {
    "command": "create",
    "path": "new_file.txt",
    "file_text": "Hello, World!"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": {
    "type": "text_editor_code_execution_result",
    "is_file_update": false
  }
}
```

**Editar archivo (str_replace):**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "name": "text_editor_code_execution",
  "input": {
    "command": "str_replace",
    "path": "config.json",
    "old_str": "\"debug\": true",
    "new_str": "\"debug\": false"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "content": {
    "type": "text_editor_code_execution_result",
    "oldStart": 3,
    "oldLines": 1,
    "newStart": 3,
    "newLines": 1,
    "lines": ["-  \"debug\": true", "+  \"debug\": false"]
  }
}
```

### Resultados

Todos los resultados de ejecución incluyen:
- `stdout`: Salida de ejecución exitosa
- `stderr`: Mensajes de error si la ejecución falla
- `return_code`: 0 para éxito, distinto de cero para fallo

Campos adicionales para operaciones de archivos:
- **Ver**: `file_type`, `content`, `numLines`, `startLine`, `totalLines`
- **Crear**: `is_file_update` (si el archivo ya existía)
- **Editar**: `oldStart`, `oldLines`, `newStart`, `newLines`, `lines` (formato diff)

### Errores

Cada tipo de herramienta puede devolver errores específicos:

**Errores comunes (todas las herramientas):**
```json
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01VfmxgZ46TiHbmXgy928hQR",
  "content": {
    "type": "bash_code_execution_tool_result_error",
    "error_code": "unavailable"
  }
}
```

**Códigos de error por tipo de herramienta:**

| Herramienta | Código de error | Descripción |
|------|-----------|-------------|
| Todas las herramientas | `unavailable` | La herramienta no está disponible temporalmente |
| Todas las herramientas | `execution_time_exceeded` | La ejecución excedió el límite de tiempo máximo |
| Todas las herramientas | `container_expired` | El contenedor expiró y ya no está disponible |
| Todas las herramientas | `invalid_tool_input` | Parámetros inválidos proporcionados a la herramienta |
| Todas las herramientas | `too_many_requests` | Límite de velocidad excedido para el uso de la herramienta |
| text_editor | `file_not_found` | El archivo no existe (para operaciones de vista/edición) |
| text_editor | `string_not_found` | El `old_str` no se encontró en el archivo (para str_replace) |

#### Razón de parada `pause_turn`

La respuesta puede incluir una razón de parada `pause_turn`, que indica que la API pausó un turno de larga duración. Puede proporcionar la respuesta tal como está en una solicitud posterior para permitir que Claude continúe su turno, o modificar el contenido si desea interrumpir la conversación.

## Contenedores

La herramienta de ejecución de código se ejecuta en un entorno containerizado seguro diseñado específicamente para la ejecución de código, con un enfoque más alto en Python.

### Entorno de ejecución
- **Versión de Python**: 3.11.12
- **Sistema operativo**: Contenedor basado en Linux
- **Arquitectura**: x86_64 (AMD64)

### Límites de recursos
- **Memoria**: 5GiB RAM
- **Espacio en disco**: 5GiB de almacenamiento de espacio de trabajo
- **CPU**: 1 CPU

### Redes y seguridad
- **Acceso a Internet**: Completamente deshabilitado por seguridad
- **Conexiones externas**: No se permiten solicitudes de red salientes
- **Aislamiento de sandbox**: Aislamiento completo del sistema host y otros contenedores
- **Acceso a archivos**: Limitado solo al directorio de espacio de trabajo
- **Alcance del espacio de trabajo**: Como [Files](/docs/es/build-with-claude/files), los contenedores se limitan al espacio de trabajo de la clave de API
- **Expiración**: Los contenedores expiran 30 días después de su creación

### Bibliotecas preinstaladas
El entorno de Python aislado incluye estas bibliotecas comúnmente utilizadas:
- **Ciencia de datos**: pandas, numpy, scipy, scikit-learn, statsmodels
- **Visualización**: matplotlib, seaborn
- **Procesamiento de archivos**: pyarrow, openpyxl, xlsxwriter, xlrd, pillow, python-pptx, python-docx, pypdf, pdfplumber, pypdfium2, pdf2image, pdfkit, tabula-py, reportlab[pycairo], Img2pdf
- **Matemáticas y computación**: sympy, mpmath
- **Utilidades**: tqdm, python-dateutil, pytz, joblib, unzip, unrar, 7zip, bc, rg (ripgrep), fd, sqlite

## Reutilización de contenedores

Puede reutilizar un contenedor existente en múltiples solicitudes de API proporcionando el ID del contenedor de una respuesta anterior.
Esto le permite mantener archivos creados entre solicitudes.

### Ejemplo

<CodeGroup>
```python Python
import os
from anthropic import Anthropic

# Initialize the client
client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# First request: Create a file with a random number
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Extract the container ID from the first response
container_id = response1.container.id

# Second request: Reuse the container to read the file
response2 = client.beta.messages.create(
    container=container_id,  # Reuse the same container
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  // First request: Create a file with a random number
  const response1 = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // Extract the container ID from the first response
  const containerId = response1.container.id;

  // Second request: Reuse the container to read the file
  const response2 = await anthropic.beta.messages.create({
    container: containerId,  // Reuse the same container
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response2.content);
}

main().catch(console.error);
```

```bash Shell
# First request: Create a file with a random number
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Write a file with a random number and save it to \"/tmp/number.txt\""
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }' > response1.json

# Extract container ID from the response (using jq)
CONTAINER_ID=$(jq -r '.container.id' response1.json)

# Second request: Reuse the container to read the file
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "container": "'$CONTAINER_ID'",
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Read the number from \"/tmp/number.txt\" and calculate its square"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```
</CodeGroup>

## Streaming

Con el streaming habilitado, recibirá eventos de ejecución de código a medida que ocurran:

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "code_execution"}}

// Code execution streamed
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"code\":\"import pandas as pd\\ndf = pd.read_csv('data.csv')\\nprint(df.head())\"}"}}

// Pause while code executes

// Execution results streamed
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "code_execution_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"stdout": "   A  B  C\n0  1  2  3\n1  4  5  6", "stderr": ""}}}
```

## Solicitudes por lotes

Puede incluir la herramienta de ejecución de código en la [Messages Batches API](/docs/es/build-with-claude/batch-processing). Las llamadas de herramienta de ejecución de código a través de la API de Batches de Mensajes se cotizan igual que las de solicitudes regulares de la API de Mensajes.

## Uso y precios

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

## Actualizar a la versión más reciente de la herramienta

Al actualizar a `code-execution-2025-08-25`, obtiene acceso a manipulación de archivos y capacidades de Bash, incluido código en múltiples idiomas. No hay diferencia de precio.

### Qué ha cambiado

| Componente | Heredado | Actual |
|-----------|------------------|----------------------------|
| Encabezado beta | `code-execution-2025-05-22` | `code-execution-2025-08-25` |
| Tipo de herramienta | `code_execution_20250522` | `code_execution_20250825` |
| Capacidades | Solo Python | Comandos Bash, operaciones de archivos |
| Tipos de respuesta | `code_execution_result` | `bash_code_execution_result`, `text_editor_code_execution_result` |

### Compatibilidad hacia atrás

- Toda la ejecución de código Python existente continúa funcionando exactamente como antes
- No se requieren cambios en los flujos de trabajo existentes solo para Python

### Pasos de actualización

Para actualizar, debe realizar los siguientes cambios en sus solicitudes de API:

1. **Actualice el encabezado beta**:
   ```diff
   - "anthropic-beta": "code-execution-2025-05-22"
   + "anthropic-beta": "code-execution-2025-08-25"
   ```

2. **Actualice el tipo de herramienta**:
   ```diff
   - "type": "code_execution_20250522"
   + "type": "code_execution_20250825"
   ```

3. **Revise el manejo de respuestas** (si analiza respuestas mediante programación):
   - Los bloques anteriores para respuestas de ejecución de Python ya no se enviarán
   - En su lugar, se enviarán nuevos tipos de respuesta para operaciones de Bash y archivos (consulte la sección Formato de respuesta)

## Llamada de herramienta programática

La herramienta de ejecución de código potencia la [llamada de herramienta programática](/docs/es/agents-and-tools/tool-use/programmatic-tool-calling), que permite a Claude escribir código que llama a sus herramientas personalizadas mediante programación dentro del contenedor de ejecución. Esto permite flujos de trabajo eficientes de múltiples herramientas, filtrado de datos antes de llegar al contexto de Claude y lógica condicional compleja.

<CodeGroup>
```python Python
# Enable programmatic calling for your tools
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Get weather for 5 cities and find the warmest"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a city",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
        }
    ]
)
```
</CodeGroup>

Obtenga más información en la [documentación de llamada de herramienta programática](/docs/es/agents-and-tools/tool-use/programmatic-tool-calling).

## Usar ejecución de código con Agent Skills

La herramienta de ejecución de código permite a Claude usar [Agent Skills](/docs/es/agents-and-tools/agent-skills/overview). Las habilidades son capacidades modulares que consisten en instrucciones, scripts y recursos que amplían la funcionalidad de Claude.

Obtenga más información en la [documentación de Agent Skills](/docs/es/agents-and-tools/agent-skills/overview) y la [guía de API de Agent Skills](/docs/es/build-with-claude/skills-guide).