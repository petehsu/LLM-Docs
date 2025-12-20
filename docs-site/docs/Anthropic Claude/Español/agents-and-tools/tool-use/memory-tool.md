# Herramienta de memoria

La herramienta de memoria permite a Claude almacenar y recuperar información entre conversaciones a través de un directorio de archivos de memoria.

---

La herramienta de memoria permite a Claude almacenar y recuperar información entre conversaciones a través de un directorio de archivos de memoria. Claude puede crear, leer, actualizar y eliminar archivos que persisten entre sesiones, permitiéndole construir conocimiento a lo largo del tiempo sin mantener todo en la ventana de contexto.

La herramienta de memoria funciona del lado del cliente: controlas dónde y cómo se almacenan los datos a través de tu propia infraestructura.

<Note>
La herramienta de memoria está actualmente en beta. Para habilitarla, usa el encabezado beta `context-management-2025-06-27` en tus solicitudes de API.

Por favor, comunícate a través de nuestro [formulario de comentarios](https://forms.gle/YXC2EKGMhjN1c4L88) para compartir tus comentarios sobre esta función.
</Note>

## Casos de uso

- Mantener el contexto del proyecto en múltiples ejecuciones de agentes
- Aprender de interacciones, decisiones y comentarios pasados
- Construir bases de conocimiento a lo largo del tiempo
- Habilitar el aprendizaje entre conversaciones donde Claude mejora en flujos de trabajo recurrentes

## Cómo funciona

Cuando está habilitada, Claude verifica automáticamente su directorio de memoria antes de comenzar tareas. Claude puede crear, leer, actualizar y eliminar archivos en el directorio `/memories` para almacenar lo que aprende mientras trabaja, y luego hacer referencia a esos recuerdos en conversaciones futuras para manejar tareas similares de manera más efectiva o continuar desde donde se quedó.

Como esta es una herramienta del lado del cliente, Claude realiza llamadas de herramienta para realizar operaciones de memoria, y tu aplicación ejecuta esas operaciones localmente. Esto te da control total sobre dónde y cómo se almacena la memoria. Por seguridad, debes restringir todas las operaciones de memoria al directorio `/memories`.

### Ejemplo: Cómo funcionan las llamadas de herramienta de memoria

Cuando le pides a Claude que ayude con una tarea, Claude verifica automáticamente su directorio de memoria primero. Aquí está lo que se ve una interacción típica:

**1. Solicitud del usuario:**
```
"Ayúdame a responder este ticket de servicio al cliente."
```

**2. Claude verifica el directorio de memoria:**
```
"Te ayudaré a responder el ticket de servicio al cliente. Déjame verificar mi memoria para cualquier contexto anterior."
```

Claude llama a la herramienta de memoria:
```json
{
  "type": "tool_use",
  "id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories"
  }
}
```

**3. Tu aplicación devuelve el contenido del directorio:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Aquí están los archivos y directorios hasta 2 niveles de profundidad en /memories, excluyendo elementos ocultos y node_modules:\n4.0K\t/memories\n1.5K\t/memories/customer_service_guidelines.xml\n2.0K\t/memories/refund_policies.xml"
}
```

**4. Claude lee archivos relevantes:**
```json
{
  "type": "tool_use",
  "id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories/customer_service_guidelines.xml"
  }
}
```

**5. Tu aplicación devuelve el contenido del archivo:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": "Aquí está el contenido de /memories/customer_service_guidelines.xml con números de línea:\n     1\t<guidelines>\n     2\t<addressing_customers>\n     3\t- Siempre dirige a los clientes por su nombre\n     4\t- Usa lenguaje empático\n..."
}
```

**6. Claude usa la memoria para ayudar:**
```
"Basándome en tus directrices de servicio al cliente, puedo ayudarte a redactar una respuesta. Por favor, comparte los detalles del ticket..."
```

## Modelos soportados

La herramienta de memoria está disponible en:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Comenzando

Para usar la herramienta de memoria:

1. Incluye el encabezado beta `context-management-2025-06-27` en tus solicitudes de API
2. Añade la herramienta de memoria a tu solicitud
3. Implementa manejadores del lado del cliente para operaciones de memoria

<Note>
Para manejar operaciones de herramienta de memoria en tu aplicación, necesitas implementar manejadores para cada comando de memoria. Nuestros SDKs proporcionan ayudantes de herramienta de memoria que manejan la interfaz de herramienta: puedes subclasificar `BetaAbstractMemoryTool` (Python) o usar `betaMemoryTool` (TypeScript) para implementar tu propio backend de memoria (basado en archivos, base de datos, almacenamiento en la nube, archivos encriptados, etc.).

Para ejemplos funcionales, consulta:
- Python: [examples/memory/basic.py](https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/memory/basic.py)
- TypeScript: [examples/tools-helpers-memory.ts](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/examples/tools-helpers-memory.ts)
</Note>

## Uso básico

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "I'\''m working on a Python web scraper that keeps crashing with a timeout error. Here'\''s the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
            }
        ],
        "tools": [{
            "type": "memory_20250818",
            "name": "memory"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
        }
    ],
    tools=[{
        "type": "memory_20250818",
        "name": "memory"
    }],
    betas=["context-management-2025-06-27"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  messages: [
    {
      role: "user",
      content: "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
    }
  ],
  tools: [{
    type: "memory_20250818",
    name: "memory"
  }],
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## Comandos de herramienta

Tu implementación del lado del cliente necesita manejar estos comandos de herramienta de memoria. Aunque estas especificaciones describen los comportamientos recomendados con los que Claude está más familiarizado, puedes modificar tu implementación y devolver cadenas según sea necesario para tu caso de uso.

### view
Muestra el contenido del directorio o el contenido del archivo con rangos de línea opcionales:

```json
{
  "command": "view",
  "path": "/memories",
  "view_range": [1, 10]  // Opcional: ver líneas específicas
}
```

#### Valores de retorno

**Para directorios:** Devuelve un listado que muestra archivos y directorios con sus tamaños:
```
Aquí están los archivos y directorios hasta 2 niveles de profundidad en {path}, excluyendo elementos ocultos y node_modules:
{size}    {path}
{size}    {path}/{filename1}
{size}    {path}/{filename2}
```

- Lista archivos hasta 2 niveles de profundidad
- Muestra tamaños legibles por humanos (p. ej., `5.5K`, `1.2M`)
- Excluye elementos ocultos (archivos que comienzan con `.`) y `node_modules`
- Usa carácter de tabulación entre tamaño y ruta

**Para archivos:** Devuelve el contenido del archivo con un encabezado y números de línea:
```
Aquí está el contenido de {path} con números de línea:
{line_numbers}{tab}{content}
```

Formato de número de línea:
- **Ancho**: 6 caracteres, alineado a la derecha con relleno de espacio
- **Separador**: Carácter de tabulación entre número de línea y contenido
- **Indexación**: Indexada en 1 (la primera línea es la línea 1)
- **Límite de línea**: Los archivos con más de 999,999 líneas deben devolver un error: `"File {path} exceeds maximum line limit of 999,999 lines."`

**Ejemplo de salida:**
```
Aquí está el contenido de /memories/notes.txt con números de línea:
     1	Hello World
     2	This is line two
    10	Line ten
   100	Line one hundred
```

#### Manejo de errores

- **El archivo/directorio no existe**: `"The path {path} does not exist. Please provide a valid path."`

### create
Crear un nuevo archivo:

```json
{
  "command": "create",
  "path": "/memories/notes.txt",
  "file_text": "Meeting notes:\n- Discussed project timeline\n- Next steps defined\n"
}
```

#### Valores de retorno

- **Éxito**: `"File created successfully at: {path}"`

#### Manejo de errores

- **El archivo ya existe**: `"Error: File {path} already exists"`

### str_replace
Reemplazar texto en un archivo:

```json
{
  "command": "str_replace",
  "path": "/memories/preferences.txt",
  "old_str": "Favorite color: blue",
  "new_str": "Favorite color: green"
}
```

#### Valores de retorno

- **Éxito**: `"The memory file has been edited."` seguido de un fragmento del archivo editado con números de línea

#### Manejo de errores

- **El archivo no existe**: `"Error: The path {path} does not exist. Please provide a valid path."`
- **Texto no encontrado**: ``"No replacement was performed, old_str `{old_str}` did not appear verbatim in {path}."``
- **Texto duplicado**: Cuando `old_str` aparece múltiples veces, devuelve: ``"No replacement was performed. Multiple occurrences of old_str `{old_str}` in lines: {line_numbers}. Please ensure it is unique"``

#### Manejo de directorios

Si la ruta es un directorio, devuelve un error de "archivo no existe".

### insert
Insertar texto en una línea específica:

```json
{
  "command": "insert",
  "path": "/memories/todo.txt",
  "insert_line": 2,
  "insert_text": "- Review memory tool documentation\n"
}
```

#### Valores de retorno

- **Éxito**: `"The file {path} has been edited."`

#### Manejo de errores

- **El archivo no existe**: `"Error: The path {path} does not exist"`
- **Número de línea inválido**: ``"Error: Invalid `insert_line` parameter: {insert_line}. It should be within the range of lines of the file: [0, {n_lines}]"``

#### Manejo de directorios

Si la ruta es un directorio, devuelve un error de "archivo no existe".

### delete
Eliminar un archivo o directorio:

```json
{
  "command": "delete",
  "path": "/memories/old_file.txt"
}
```

#### Valores de retorno

- **Éxito**: `"Successfully deleted {path}"`

#### Manejo de errores

- **El archivo/directorio no existe**: `"Error: The path {path} does not exist"`

#### Manejo de directorios

Elimina el directorio y todo su contenido de forma recursiva.

### rename
Renombrar o mover un archivo/directorio:

```json
{
  "command": "rename",
  "old_path": "/memories/draft.txt",
  "new_path": "/memories/final.txt"
}
```

#### Valores de retorno

- **Éxito**: `"Successfully renamed {old_path} to {new_path}"`

#### Manejo de errores

- **La fuente no existe**: `"Error: The path {old_path} does not exist"`
- **El destino ya existe**: Devuelve un error (no sobrescribas): `"Error: The destination {new_path} already exists"`

#### Manejo de directorios

Renombra el directorio.

## Orientación de indicaciones

Incluimos automáticamente esta instrucción en el indicador del sistema cuando se incluye la herramienta de memoria:

```
IMPORTANT: ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE.
MEMORY PROTOCOL:
1. Use the `view` command of your `memory` tool to check for earlier progress.
2. ... (work on the task) ...
     - As you make progress, record status / progress / thoughts etc in your memory.
ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory.
```

Si observas que Claude crea archivos de memoria desordenados, puedes incluir esta instrucción:

> Nota: al editar tu carpeta de memoria, siempre intenta mantener su contenido actualizado, coherente y organizado. Puedes renombrar o eliminar archivos que ya no sean relevantes. No crees nuevos archivos a menos que sea necesario.

También puedes guiar lo que Claude escribe en la memoria, p. ej., "Solo escribe información relevante para \<topic\> en tu sistema de memoria."

## Consideraciones de seguridad

Aquí hay preocupaciones de seguridad importantes al implementar tu almacén de memoria:

### Información sensible
Claude generalmente se negará a escribir información sensible en archivos de memoria. Sin embargo, es posible que desees implementar una validación más estricta que elimine información potencialmente sensible.

### Tamaño de almacenamiento de archivos
Considera rastrear los tamaños de archivos de memoria y evitar que los archivos crezcan demasiado. Considera agregar un número máximo de caracteres que el comando de lectura de memoria puede devolver, y permite que Claude pagine a través del contenido.

### Expiración de memoria
Considera limpiar periódicamente archivos de memoria que no hayan sido accedidos durante un tiempo extendido.

### Protección contra traversal de rutas

<Warning>
Las entradas de ruta maliciosas podrían intentar acceder a archivos fuera del directorio `/memories`. Tu implementación **DEBE** validar todas las rutas para prevenir ataques de traversal de directorios.
</Warning>

Considera estas salvaguardas:

- Valida que todas las rutas comiencen con `/memories`
- Resuelve rutas a su forma canónica y verifica que permanezcan dentro del directorio de memoria
- Rechaza rutas que contengan secuencias como `../`, `..\\`, u otros patrones de traversal
- Vigila secuencias de traversal codificadas en URL (`%2e%2e%2f`)
- Usa las utilidades de seguridad de rutas integradas de tu lenguaje (p. ej., `pathlib.Path.resolve()` y `relative_to()` de Python)

## Manejo de errores

La herramienta de memoria utiliza patrones de manejo de errores similares a la [herramienta de editor de texto](/docs/es/agents-and-tools/tool-use/text-editor-tool#handle-errors). Consulta las secciones de comandos de herramienta individuales anteriores para mensajes de error detallados y comportamientos. Los errores comunes incluyen archivo no encontrado, errores de permiso, rutas inválidas y coincidencias de texto duplicadas.

## Usar con Context Editing

La herramienta de memoria se puede combinar con [context editing](/docs/es/build-with-claude/context-editing), que automáticamente limpia resultados de herramienta antiguos cuando el contexto de conversación crece más allá de un umbral configurado. Esta combinación permite flujos de trabajo agentes de larga duración que de otro modo excederían los límites de contexto.

### Cómo funcionan juntos

Cuando context editing está habilitado y tu conversación se acerca al umbral de limpieza, Claude recibe automáticamente una notificación de advertencia. Esto le pide a Claude que preserve cualquier información importante de los resultados de herramienta en archivos de memoria antes de que esos resultados se limpien de la ventana de contexto.

Después de que los resultados de herramienta se limpian, Claude puede recuperar la información almacenada de archivos de memoria siempre que sea necesario, tratando efectivamente la memoria como una extensión de su contexto de trabajo. Esto permite a Claude:

- Continuar flujos de trabajo complejos de múltiples pasos sin perder información crítica
- Hacer referencia a trabajo y decisiones pasadas incluso después de que los resultados de herramienta se eliminen
- Mantener contexto coherente en conversaciones que excederían los límites de contexto típicos
- Construir una base de conocimiento a lo largo del tiempo mientras se mantiene la ventana de contexto activa manejable

### Ejemplo de flujo de trabajo

Considera un proyecto de refactorización de código con muchas operaciones de archivo:

1. Claude realiza numerosas ediciones a archivos, generando muchos resultados de herramienta
2. Conforme el contexto crece y se acerca a tu umbral, Claude recibe una advertencia
3. Claude resume los cambios realizados hasta ahora a un archivo de memoria (p. ej., `/memories/refactoring_progress.xml`)
4. Context editing limpia automáticamente los resultados de herramienta más antiguos
5. Claude continúa trabajando, haciendo referencia al archivo de memoria cuando necesita recordar qué cambios ya se completaron
6. El flujo de trabajo puede continuar indefinidamente, con Claude manejando tanto el contexto activo como la memoria persistente

### Configuración

Para usar ambas funciones juntas:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 100000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 100000
        },
        keep: {
          type: "tool_uses",
          value: 3
        }
      }
    ]
  }
});
```

</CodeGroup>

También puedes excluir llamadas de herramienta de memoria de ser limpiadas para asegurar que Claude siempre tenga acceso a operaciones de memoria recientes:

<CodeGroup>

```python Python
context_management={
    "edits": [
        {
            "type": "clear_tool_uses_20250919",
            "exclude_tools": ["memory"]
        }
    ]
}
```

```typescript TypeScript
context_management: {
  edits: [
    {
      type: "clear_tool_uses_20250919",
      exclude_tools: ["memory"]
    }
  ]
}
```

</CodeGroup>