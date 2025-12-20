# Herramienta bash

La herramienta bash permite a Claude ejecutar comandos de shell en una sesión bash persistente, permitiendo operaciones del sistema, ejecución de scripts y automatización de línea de comandos.

---

La herramienta bash permite a Claude ejecutar comandos de shell en una sesión bash persistente, permitiendo operaciones del sistema, ejecución de scripts y automatización de línea de comandos.

## Descripción general

La herramienta bash proporciona a Claude:
- Sesión bash persistente que mantiene el estado
- Capacidad de ejecutar cualquier comando de shell
- Acceso a variables de entorno y directorio de trabajo
- Capacidades de encadenamiento de comandos y scripting

## Compatibilidad de modelos

| Modelo | Versión de herramienta |
|-------|--------------|
| Modelos Claude 4 y Sonnet 3.7 ([deprecated](/docs/es/about-claude/model-deprecations)) | `bash_20250124` |

<Warning>
Las versiones anteriores de herramientas no están garantizadas para ser compatibles hacia atrás con modelos más nuevos. Siempre usa la versión de herramienta que corresponde a tu versión de modelo.
</Warning>

## Casos de uso

- **Flujos de trabajo de desarrollo**: Ejecutar comandos de compilación, pruebas y herramientas de desarrollo
- **Automatización del sistema**: Ejecutar scripts, gestionar archivos, automatizar tareas
- **Procesamiento de datos**: Procesar archivos, ejecutar scripts de análisis, gestionar conjuntos de datos
- **Configuración del entorno**: Instalar paquetes, configurar entornos

## Inicio rápido

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "bash_20250124",
            "name": "bash"
        }
    ],
    messages=[
        {"role": "user", "content": "List all Python files in the current directory."}
    ]
)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "List all Python files in the current directory."
      }
    ]
  }'
```
</CodeGroup>

## Cómo funciona

La herramienta bash mantiene una sesión persistente:

1. Claude determina qué comando ejecutar
2. Ejecutas el comando en un shell bash
3. Devuelves la salida (stdout y stderr) a Claude
4. El estado de la sesión persiste entre comandos (variables de entorno, directorio de trabajo)

## Parámetros

| Parámetro | Requerido | Descripción |
|-----------|----------|-------------|
| `command` | Sí* | El comando bash a ejecutar |
| `restart` | No | Establece en `true` para reiniciar la sesión bash |

*Requerido a menos que uses `restart`

<section title="Ejemplo de uso">

```json
// Ejecutar un comando
{
  "command": "ls -la *.py"
}

// Reiniciar la sesión
{
  "restart": true
}
```

</section>

## Ejemplo: Automatización de múltiples pasos

Claude puede encadenar comandos para completar tareas complejas:

```python
# Solicitud del usuario
"Install the requests library and create a simple Python script that fetches a joke from an API, then run it."

# La herramienta de Claude usa:
# 1. Instalar paquete
{"command": "pip install requests"}

# 2. Crear script
{"command": "cat > fetch_joke.py << 'EOF'\nimport requests\nresponse = requests.get('https://official-joke-api.appspot.com/random_joke')\njoke = response.json()\nprint(f\"Setup: {joke['setup']}\")\nprint(f\"Punchline: {joke['punchline']}\")\nEOF"}

# 3. Ejecutar script
{"command": "python fetch_joke.py"}
```

La sesión mantiene el estado entre comandos, por lo que los archivos creados en el paso 2 están disponibles en el paso 3.

***

## Implementar la herramienta bash

La herramienta bash se implementa como una herramienta sin esquema. Al usar esta herramienta, no necesitas proporcionar un esquema de entrada como con otras herramientas; el esquema está integrado en el modelo de Claude y no se puede modificar.

<Steps>
  <Step title="Configurar un entorno bash">
    Crea una sesión bash persistente con la que Claude pueda interactuar:
    ```python
    import subprocess
    import threading
    import queue
    
    class BashSession:
        def __init__(self):
            self.process = subprocess.Popen(
                ['/bin/bash'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0
            )
            self.output_queue = queue.Queue()
            self.error_queue = queue.Queue()
            self._start_readers()
    ```
  </Step>
  <Step title="Manejar la ejecución de comandos">
    Crea una función para ejecutar comandos y capturar la salida:
    ```python
    def execute_command(self, command):
        # Enviar comando a bash
        self.process.stdin.write(command + '\n')
        self.process.stdin.flush()
        
        # Capturar salida con tiempo de espera
        output = self._read_output(timeout=10)
        return output
    ```
  </Step>
  <Step title="Procesar las llamadas de herramientas de Claude">
    Extrae y ejecuta comandos de las respuestas de Claude:
    ```python
    for content in response.content:
        if content.type == "tool_use" and content.name == "bash":
            if content.input.get("restart"):
                bash_session.restart()
                result = "Bash session restarted"
            else:
                command = content.input.get("command")
                result = bash_session.execute_command(command)
            
            # Devolver resultado a Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Implementar medidas de seguridad">
    Añade validación y restricciones:
    ```python
    def validate_command(command):
        # Bloquear comandos peligrosos
        dangerous_patterns = ['rm -rf /', 'format', ':(){:|:&};:']
        for pattern in dangerous_patterns:
            if pattern in command:
                return False, f"Command contains dangerous pattern: {pattern}"
        
        # Añadir más validación según sea necesario
        return True, None
    ```
  </Step>
</Steps>

### Manejar errores

Al implementar la herramienta bash, maneja varios escenarios de error:

<section title="Tiempo de espera de ejecución de comando">

Si un comando tarda demasiado en ejecutarse:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Command timed out after 30 seconds",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Comando no encontrado">

Si un comando no existe:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: nonexistentcommand: command not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Permiso denegado">

Si hay problemas de permisos:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: /root/sensitive-file: Permission denied",
      "is_error": true
    }
  ]
}
```

</section>

### Seguir las mejores prácticas de implementación

<section title="Usar tiempos de espera de comando">

Implementa tiempos de espera para evitar comandos que se cuelguen:
```python
def execute_with_timeout(command, timeout=30):
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return f"Command timed out after {timeout} seconds"
```

</section>

<section title="Mantener el estado de la sesión">

Mantén la sesión bash persistente para mantener variables de entorno y directorio de trabajo:
```python
# Los comandos ejecutados en la misma sesión mantienen el estado
commands = [
    "cd /tmp",
    "echo 'Hello' > test.txt",
    "cat test.txt"  # Esto funciona porque seguimos en /tmp
]
```

</section>

<section title="Manejar salidas grandes">

Trunca salidas muy grandes para evitar problemas de límite de tokens:
```python
def truncate_output(output, max_lines=100):
    lines = output.split('\n')
    if len(lines) > max_lines:
        truncated = '\n'.join(lines[:max_lines])
        return f"{truncated}\n\n... Output truncated ({len(lines)} total lines) ..."
    return output
```

</section>

<section title="Registrar todos los comandos">

Mantén un registro de auditoría de comandos ejecutados:
```python
import logging

def log_command(command, output, user_id):
    logging.info(f"User {user_id} executed: {command}")
    logging.info(f"Output: {output[:200]}...")  # Registrar primeros 200 caracteres
```

</section>

<section title="Desinfectar salidas">

Elimina información sensible de las salidas de comandos:
```python
def sanitize_output(output):
    # Eliminar posibles secretos o credenciales
    import re
    # Ejemplo: Eliminar credenciales de AWS
    output = re.sub(r'aws_access_key_id\s*=\s*\S+', 'aws_access_key_id=***', output)
    output = re.sub(r'aws_secret_access_key\s*=\s*\S+', 'aws_secret_access_key=***', output)
    return output
```

</section>

## Seguridad

<Warning>
La herramienta bash proporciona acceso directo al sistema. Implementa estas medidas de seguridad esenciales:
- Ejecutar en entornos aislados (Docker/VM)
- Implementar filtrado de comandos y listas de permitidos
- Establecer límites de recursos (CPU, memoria, disco)
- Registrar todos los comandos ejecutados
</Warning>

### Recomendaciones clave
- Usa `ulimit` para establecer restricciones de recursos
- Filtra comandos peligrosos (`sudo`, `rm -rf`, etc.)
- Ejecuta con permisos de usuario mínimos
- Monitorea y registra toda la ejecución de comandos

## Precios

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Consulta [precios de uso de herramientas](/docs/es/agents-and-tools/tool-use/overview#pricing) para obtener detalles completos de precios.

## Patrones comunes

### Flujos de trabajo de desarrollo
- Ejecutar pruebas: `pytest && coverage report`
- Compilar proyectos: `npm install && npm run build`
- Operaciones de Git: `git status && git add . && git commit -m "message"`

### Operaciones de archivos
- Procesar datos: `wc -l *.csv && ls -lh *.csv`
- Buscar archivos: `find . -name "*.py" | xargs grep "pattern"`
- Crear copias de seguridad: `tar -czf backup.tar.gz ./data`

### Tareas del sistema
- Verificar recursos: `df -h && free -m`
- Gestión de procesos: `ps aux | grep python`
- Configuración del entorno: `export PATH=$PATH:/new/path && echo $PATH`

## Limitaciones

- **Sin comandos interactivos**: No puede manejar `vim`, `less` o solicitudes de contraseña
- **Sin aplicaciones GUI**: Solo línea de comandos
- **Alcance de sesión**: Persiste dentro de la conversación, se pierde entre llamadas a API
- **Límites de salida**: Las salidas grandes pueden truncarse
- **Sin streaming**: Resultados devueltos después de la finalización

## Combinar con otras herramientas

La herramienta bash es más poderosa cuando se combina con el [editor de texto](/docs/es/agents-and-tools/tool-use/text-editor-tool) y otras herramientas.

## Próximos pasos

<CardGroup cols={2}>
  <Card
    title="Descripción general del uso de herramientas"
    icon="tool"
    href="/docs/es/agents-and-tools/tool-use/overview"
  >
    Aprende sobre el uso de herramientas con Claude
  </Card>

  <Card
    title="Herramienta de editor de texto"
    icon="file"
    href="/docs/es/agents-and-tools/tool-use/text-editor-tool"
  >
    Ver y editar archivos de texto con Claude
  </Card>
</CardGroup>