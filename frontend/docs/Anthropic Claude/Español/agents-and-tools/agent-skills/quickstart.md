# Comenzar con Agent Skills en la API

Aprende cómo usar Agent Skills para crear documentos con la API de Claude en menos de 10 minutos.

---

Este tutorial te muestra cómo usar Agent Skills para crear una presentación de PowerPoint. Aprenderás cómo habilitar Skills, hacer una solicitud simple y acceder al archivo generado.

## Requisitos previos

- [Clave de API de Anthropic](/settings/keys)
- Python 3.7+ o curl instalado
- Familiaridad básica con la realización de solicitudes de API

## ¿Qué son Agent Skills?

Los Agent Skills precompilados extienden las capacidades de Claude con experiencia especializada para tareas como crear documentos, analizar datos y procesar archivos. Anthropic proporciona los siguientes Agent Skills precompilados en la API:

- **PowerPoint (pptx)**: Crear y editar presentaciones
- **Excel (xlsx)**: Crear y analizar hojas de cálculo
- **Word (docx)**: Crear y editar documentos
- **PDF (pdf)**: Generar documentos PDF

<Note>
**¿Quieres crear Skills personalizados?** Consulta el [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills) para ver ejemplos de cómo crear tus propios Skills con experiencia específica del dominio.
</Note>

## Paso 1: Listar Skills disponibles

Primero, veamos qué Skills están disponibles. Usaremos la API de Skills para listar todos los Skills administrados por Anthropic:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Listar Skills administrados por Anthropic
skills = client.beta.skills.list(
    source="anthropic",
    betas=["skills-2025-10-02"]
)

for skill in skills.data:
    print(f"{skill.id}: {skill.display_title}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Listar Skills administrados por Anthropic
const skills = await client.beta.skills.list({
  source: 'anthropic',
  betas: ['skills-2025-10-02']
});

for (const skill of skills.data) {
  console.log(`${skill.id}: ${skill.display_title}`);
}
```

```bash Shell
curl "https://api.anthropic.com/v1/skills?source=anthropic" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```
</CodeGroup>

Ves los siguientes Skills: `pptx`, `xlsx`, `docx` y `pdf`.

Esta API devuelve los metadatos de cada Skill: su nombre y descripción. Claude carga estos metadatos al iniciar para saber qué Skills están disponibles. Este es el primer nivel de **divulgación progresiva**, donde Claude descubre Skills sin cargar aún sus instrucciones completas.

## Paso 2: Crear una presentación

Ahora usaremos el Skill de PowerPoint para crear una presentación sobre energías renovables. Especificamos Skills usando el parámetro `container` en la API de Mensajes:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Crear un mensaje con el Skill de PowerPoint
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pptx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a presentation about renewable energy with 5 slides"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response.content)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Crear un mensaje con el Skill de PowerPoint
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'pptx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create a presentation about renewable energy with 5 slides'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});

console.log(response.content);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "pptx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create a presentation about renewable energy with 5 slides"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

Desglosemos lo que hace cada parte:

- **`container.skills`**: Especifica qué Skills puede usar Claude
- **`type: "anthropic"`**: Indica que este es un Skill administrado por Anthropic
- **`skill_id: "pptx"`**: El identificador del Skill de PowerPoint
- **`version: "latest"`**: La versión del Skill establecida en la más recientemente publicada
- **`tools`**: Habilita la ejecución de código (requerido para Skills)
- **Encabezados Beta**: `code-execution-2025-08-25` y `skills-2025-10-02`

Cuando realizas esta solicitud, Claude automáticamente hace coincidir tu tarea con el Skill relevante. Como pediste una presentación, Claude determina que el Skill de PowerPoint es relevante y carga sus instrucciones completas: el segundo nivel de divulgación progresiva. Luego Claude ejecuta el código del Skill para crear tu presentación.

## Paso 3: Descargar el archivo creado

La presentación fue creada en el contenedor de ejecución de código y guardada como un archivo. La respuesta incluye una referencia de archivo con un ID de archivo. Extrae el ID de archivo y descárgalo usando la API de Archivos:

<CodeGroup>
```python Python
# Extraer ID de archivo de la respuesta
file_id = None
for block in response.content:
    if block.type == 'tool_use' and block.name == 'code_execution':
        # El ID de archivo está en el resultado de la herramienta
        for result_block in block.content:
            if hasattr(result_block, 'file_id'):
                file_id = result_block.file_id
                break

if file_id:
    # Descargar el archivo
    file_content = client.beta.files.download(
        file_id=file_id,
        betas=["files-api-2025-04-14"]
    )

    # Guardar en disco
    with open("renewable_energy.pptx", "wb") as f:
        file_content.write_to_file(f.name)

    print(f"Presentation saved to renewable_energy.pptx")
```

```typescript TypeScript
// Extraer ID de archivo de la respuesta
let fileId: string | null = null;
for (const block of response.content) {
  if (block.type === 'tool_use' && block.name === 'code_execution') {
    // El ID de archivo está en el resultado de la herramienta
    for (const resultBlock of block.content) {
      if ('file_id' in resultBlock) {
        fileId = resultBlock.file_id;
        break;
      }
    }
  }
}

if (fileId) {
  // Descargar el archivo
  const fileContent = await client.beta.files.download(fileId, {
    betas: ['files-api-2025-04-14']
  });

  // Guardar en disco
  const fs = require('fs');
  fs.writeFileSync('renewable_energy.pptx', Buffer.from(await fileContent.arrayBuffer()));

  console.log('Presentation saved to renewable_energy.pptx');
}
```

```bash Shell
# Extraer file_id de la respuesta (usando jq)
FILE_ID=$(echo "$RESPONSE" | jq -r '.content[] | select(.type=="tool_use" and .name=="code_execution") | .content[] | select(.file_id) | .file_id')

# Descargar el archivo
curl "https://api.anthropic.com/v1/files/$FILE_ID/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output renewable_energy.pptx

echo "Presentation saved to renewable_energy.pptx"
```
</CodeGroup>

<Note>
Para obtener detalles completos sobre cómo trabajar con archivos generados, consulta la [documentación de la herramienta de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool#retrieve-generated-files).
</Note>

## Prueba más ejemplos

Ahora que has creado tu primer documento con Skills, prueba estas variaciones:

### Crear una hoja de cálculo

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "xlsx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Create a quarterly sales tracking spreadsheet with sample data"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'xlsx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Create a quarterly sales tracking spreadsheet with sample data'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "xlsx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Create a quarterly sales tracking spreadsheet with sample data"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### Crear un documento de Word

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "docx",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Write a 2-page report on the benefits of renewable energy"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'docx',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Write a 2-page report on the benefits of renewable energy'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "docx",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Write a 2-page report on the benefits of renewable energy"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

### Generar un PDF

<CodeGroup>
```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=4096,
    betas=["code-execution-2025-08-25", "skills-2025-10-02"],
    container={
        "skills": [
            {
                "type": "anthropic",
                "skill_id": "pdf",
                "version": "latest"
            }
        ]
    },
    messages=[{
        "role": "user",
        "content": "Generate a PDF invoice template"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await client.beta.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 4096,
  betas: ['code-execution-2025-08-25', 'skills-2025-10-02'],
  container: {
    skills: [
      {
        type: 'anthropic',
        skill_id: 'pdf',
        version: 'latest'
      }
    ]
  },
  messages: [{
    role: 'user',
    content: 'Generate a PDF invoice template'
  }],
  tools: [{
    type: 'code_execution_20250825',
    name: 'code_execution'
  }]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: code-execution-2025-08-25,skills-2025-10-02" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250929",
    "max_tokens": 4096,
    "container": {
      "skills": [
        {
          "type": "anthropic",
          "skill_id": "pdf",
          "version": "latest"
        }
      ]
    },
    "messages": [{
      "role": "user",
      "content": "Generate a PDF invoice template"
    }],
    "tools": [{
      "type": "code_execution_20250825",
      "name": "code_execution"
    }]
  }'
```
</CodeGroup>

## Próximos pasos

Ahora que has usado Agent Skills precompilados, puedes:

<CardGroup cols={2}>
  <Card
    title="Guía de API"
    icon="book"
    href="/docs/es/build-with-claude/skills-guide"
  >
    Usar Skills con la API de Claude
  </Card>
  <Card
    title="Crear Skills personalizados"
    icon="code"
    href="/docs/es/api/skills/create-skill"
  >
    Carga tus propios Skills para tareas especializadas
  </Card>
  <Card
    title="Guía de autoría"
    icon="edit"
    href="/docs/es/agents-and-tools/agent-skills/best-practices"
  >
    Aprende las mejores prácticas para escribir Skills efectivos
  </Card>
  <Card
    title="Usar Skills en Claude Code"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Aprende sobre Skills en Claude Code
  </Card>
  <Card
    title="Usar Skills en el Agent SDK"
    icon="cube"
    href="/docs/es/agent-sdk/skills"
  >
    Usa Skills programáticamente en TypeScript y Python
  </Card>
  <Card
    title="Agent Skills Cookbook"
    icon="book"
    href="https://github.com/anthropics/anthropic-cookbook/blob/main/skills/README.md"
  >
    Explora Skills de ejemplo y patrones de implementación
  </Card>
</CardGroup>