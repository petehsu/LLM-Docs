# Herramienta de uso de computadora

Claude puede interactar con entornos de computadora a través de la herramienta de uso de computadora, que proporciona capacidades de captura de pantalla y control de ratón/teclado para interacción autónoma de escritorio.

---

Claude puede interactuar con entornos de computadora a través de la herramienta de uso de computadora, que proporciona capacidades de captura de pantalla y control de ratón/teclado para interacción autónoma de escritorio.

<Note>
El uso de computadora está actualmente en beta y requiere un [encabezado beta](/docs/es/api/beta-headers):
- `"computer-use-2025-11-24"` para Claude Opus 4.5
- `"computer-use-2025-01-24"` para Claude Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4, Opus 4, y Sonnet 3.7 ([obsoleto](/docs/es/about-claude/model-deprecations))
</Note>

## Descripción general

El uso de computadora es una característica beta que permite a Claude interactuar con entornos de escritorio. Esta herramienta proporciona:

- **Captura de pantalla**: Ver lo que se muestra actualmente en la pantalla
- **Control del ratón**: Hacer clic, arrastrar y mover el cursor
- **Entrada de teclado**: Escribir texto y usar atajos de teclado
- **Automatización de escritorio**: Interactuar con cualquier aplicación o interfaz

Aunque el uso de computadora puede aumentarse con otras herramientas como bash y editor de texto para flujos de trabajo de automatización más completos, el uso de computadora se refiere específicamente a la capacidad de la herramienta de uso de computadora para ver y controlar entornos de escritorio.

## Compatibilidad de modelos

El uso de computadora está disponible para los siguientes modelos de Claude:

| Modelo | Versión de herramienta | Bandera Beta |
|--------|------------------------|--------------|
| Claude Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| Todos los demás modelos compatibles | `computer_20250124` | `computer-use-2025-01-24` |

<Note>
Claude Opus 4.5 introduce la versión de herramienta `computer_20251124` con nuevas capacidades incluyendo la acción de zoom para inspección detallada de regiones de pantalla. Todos los demás modelos (Sonnet 4.5, Haiku 4.5, Sonnet 4, Opus 4, Opus 4.1, y Sonnet 3.7) utilizan la versión de herramienta `computer_20250124`.
</Note>

<Warning>
Las versiones de herramienta más antiguas no se garantiza que sean compatibles hacia atrás con modelos más nuevos. Siempre use la versión de herramienta que corresponda a su versión de modelo.
</Warning>

## Consideraciones de seguridad

<Warning>
El uso de computadora es una característica beta con riesgos únicos distintos de las características estándar de API. Estos riesgos se intensifican cuando se interactúa con internet. Para minimizar riesgos, considere tomar precauciones tales como:

1. Utilice una máquina virtual dedicada o contenedor con privilegios mínimos para prevenir ataques directos del sistema o accidentes.
2. Evite dar al modelo acceso a datos sensibles, como información de inicio de sesión de cuenta, para prevenir robo de información.
3. Limite el acceso a internet a una lista blanca de dominios para reducir la exposición a contenido malicioso.
4. Pida a un humano que confirme decisiones que puedan resultar en consecuencias significativas en el mundo real, así como cualquier tarea que requiera consentimiento afirmativo, como aceptar cookies, ejecutar transacciones financieras, o aceptar términos de servicio.

En algunas circunstancias, Claude seguirá comandos encontrados en contenido incluso si entra en conflicto con las instrucciones del usuario. Por ejemplo, las instrucciones de Claude en páginas web o contenidas en imágenes pueden anular instrucciones o causar que Claude cometa errores. Sugerimos tomar precauciones para aislar a Claude de datos sensibles y acciones para evitar riesgos relacionados con inyección de indicaciones.

Hemos entrenado el modelo para resistir estas inyecciones de indicaciones y hemos añadido una capa adicional de defensa. Si utiliza nuestras herramientas de uso de computadora, ejecutaremos automáticamente clasificadores en sus indicaciones para marcar posibles instancias de inyecciones de indicaciones. Cuando estos clasificadores identifiquen posibles inyecciones de indicaciones en capturas de pantalla, automáticamente dirigirán el modelo a pedir confirmación del usuario antes de proceder con la siguiente acción. Reconocemos que esta protección adicional no será ideal para todos los casos de uso (por ejemplo, casos de uso sin un humano en el bucle), así que si desea optar por no participar y desactivarlo, por favor [contáctenos](https://support.claude.com/en/).

Aún sugerimos tomar precauciones para aislar a Claude de datos sensibles y acciones para evitar riesgos relacionados con inyección de indicaciones.

Finalmente, por favor informe a los usuarios finales de los riesgos relevantes y obtenga su consentimiento antes de habilitar el uso de computadora en sus propios productos.

</Warning>

<Card
  title="Implementación de referencia de uso de computadora"
  icon="computer"
  href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
>

Comience rápidamente con nuestra implementación de referencia de uso de computadora que incluye una interfaz web, contenedor Docker, implementaciones de herramientas de ejemplo, y un bucle de agente.

**Nota:** La implementación ha sido actualizada para incluir nuevas herramientas para ambos modelos Claude 4 y Claude Sonnet 3.7. Asegúrese de extraer la última versión del repositorio para acceder a estas nuevas características.

</Card>

<Tip>
  Por favor use [este formulario](https://forms.gle/BT1hpBrqDPDUrCqo7) para proporcionar
  retroalimentación sobre la calidad de las respuestas del modelo, la API en sí, o la calidad
  de la documentación - ¡no podemos esperar a escuchar de usted!
</Tip>

## Inicio rápido

Aquí se explica cómo comenzar con el uso de computadora:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",  # o otro modelo compatible
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        }
    ],
    messages=[{"role": "user", "content": "Guarda una foto de un gato en mi escritorio."}],
    betas=["computer-use-2025-01-24"]
)
print(response)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: computer-use-2025-01-24" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": 1024,
        "display_height_px": 768,
        "display_number": 1
      },
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      },
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Guarda una foto de un gato en mi escritorio."
      }
    ]
  }'
```
</CodeGroup>

<Note>
Un encabezado beta solo es requerido para la herramienta de uso de computadora.

El ejemplo anterior muestra las tres herramientas siendo utilizadas juntas, lo que requiere el encabezado beta porque incluye la herramienta de uso de computadora.
</Note>

---

## Cómo funciona el uso de computadora

<Steps>
  <Step
    title="1. Proporcione a Claude la herramienta de uso de computadora y una indicación del usuario"
    icon="tool"
  >
    - Agregue la herramienta de uso de computadora (y opcionalmente otras herramientas) a su solicitud de API.
    - Incluya una indicación del usuario que requiera interacción de escritorio, por ejemplo, "Guarda una foto de un gato en mi escritorio."
  </Step>
  <Step title="2. Claude decide usar la herramienta de uso de computadora" icon="wrench">
    - Claude evalúa si la herramienta de uso de computadora puede ayudar con la consulta del usuario.
    - Si es así, Claude construye una solicitud de uso de herramienta correctamente formateada.
    - La respuesta de API tiene un `stop_reason` de `tool_use`, señalando la intención de Claude.
  </Step>
  <Step
    title="3. Extraiga la entrada de la herramienta, evalúe la herramienta en una computadora, y devuelva resultados"
    icon="computer"
  >
    - De su parte, extraiga el nombre de la herramienta y la entrada de la solicitud de Claude.
    - Utilice la herramienta en un contenedor o Máquina Virtual.
    - Continúe la conversación con un nuevo mensaje `user` que contenga un bloque de contenido `tool_result`.
  </Step>
  <Step
    title="4. Claude continúa llamando herramientas de uso de computadora hasta que complete la tarea"
    icon="arrows-clockwise"
  >
    - Claude analiza los resultados de la herramienta para determinar si se necesita más uso de herramienta o la tarea se ha completado.
    - Si Claude decide que necesita otra herramienta, responde con otro `stop_reason` de `tool_use` y debe volver al paso 3.
    - De lo contrario, elabora una respuesta de texto al usuario.
  </Step>
</Steps>

Nos referimos a la repetición de los pasos 3 y 4 sin entrada del usuario como el "bucle de agente" - es decir, Claude respondiendo con una solicitud de uso de herramienta y su aplicación respondiendo a Claude con los resultados de evaluar esa solicitud.

### El entorno informático

El uso de computadora requiere un entorno informático aislado donde Claude pueda interactuar de forma segura con aplicaciones e internet. Este entorno incluye:

1. **Pantalla virtual**: Un servidor de pantalla X11 virtual (usando Xvfb) que renderiza la interfaz de escritorio que Claude verá a través de capturas de pantalla y controlará con acciones de ratón/teclado.

2. **Entorno de escritorio**: Una interfaz de usuario ligera con gestor de ventanas (Mutter) y panel (Tint2) ejecutándose en Linux, que proporciona una interfaz gráfica consistente para que Claude interactúe.

3. **Aplicaciones**: Aplicaciones Linux preinstaladas como Firefox, LibreOffice, editores de texto, y gestores de archivos que Claude puede usar para completar tareas.

4. **Implementaciones de herramientas**: Código de integración que traduce las solicitudes de herramientas abstractas de Claude (como "mover ratón" o "tomar captura de pantalla") en operaciones reales en el entorno virtual.

5. **Bucle de agente**: Un programa que maneja la comunicación entre Claude y el entorno, enviando las acciones de Claude al entorno y devolviendo los resultados (capturas de pantalla, salidas de comandos) de vuelta a Claude.

Cuando utiliza el uso de computadora, Claude no se conecta directamente a este entorno. En su lugar, su aplicación:

1. Recibe las solicitudes de uso de herramienta de Claude
2. Las traduce en acciones en su entorno informático
3. Captura los resultados (capturas de pantalla, salidas de comandos, etc.)
4. Devuelve estos resultados a Claude

Para seguridad y aislamiento, la implementación de referencia ejecuta todo esto dentro de un contenedor Docker con asignaciones de puerto apropiadas para ver e interactuar con el entorno.

---

## Cómo implementar el uso de computadora

### Comience con nuestra implementación de referencia

Hemos construido una [implementación de referencia](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) que incluye todo lo que necesita para comenzar rápidamente con el uso de computadora:

- Un [entorno containerizado](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile) adecuado para el uso de computadora con Claude
- Implementaciones de [las herramientas de uso de computadora](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
- Un [bucle de agente](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py) que interactúa con la API de Claude y ejecuta las herramientas de uso de computadora
- Una interfaz web para interactuar con el contenedor, bucle de agente, y herramientas.

### Entender el bucle de múltiples agentes

El núcleo del uso de computadora es el "bucle de agente" - un ciclo donde Claude solicita acciones de herramientas, su aplicación las ejecuta, y devuelve resultados a Claude. Aquí hay un ejemplo simplificado:

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # Agregue límite de iteración para prevenir bucles infinitos
):
    """
    Un bucle de agente simple para interacciones de uso de computadora de Claude.

    Esta función maneja el ir y venir entre:
    1. Enviar mensajes del usuario a Claude
    2. Claude solicitando usar herramientas
    3. Su aplicación ejecutando esas herramientas
    4. Enviar resultados de herramientas de vuelta a Claude
    """
    # Configurar herramientas y parámetros de API
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # Configurar herramientas - ya debería tenerlas inicializadas en otro lugar
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # Bucle de agente principal (con límite de iteración para prevenir costos de API descontrolados)
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # Configurar parámetro de pensamiento opcional (para Claude Sonnet 3.7)
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # Llamar a la API de Claude
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # Agregar la respuesta de Claude al historial de conversación
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # Verificar si Claude utilizó alguna herramienta
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # En una aplicación real, ejecutaría la herramienta aquí
                # Por ejemplo: result = run_tool(block.name, block.input)
                result = {"result": "Tool executed successfully"}

                # Formatear el resultado para Claude
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # Si no se utilizaron herramientas, Claude ha terminado - devolver los mensajes finales
        if not tool_results:
            return messages

        # Agregar resultados de herramientas a mensajes para la siguiente iteración con Claude
        messages.append({"role": "user", "content": tool_results})
```

El bucle continúa hasta que Claude responda sin solicitar ninguna herramienta (finalización de tarea) o se alcance el límite máximo de iteración. Esta salvaguarda previene posibles bucles infinitos que podrían resultar en costos de API inesperados.

Recomendamos probar la implementación de referencia antes de leer el resto de esta documentación.

### Optimizar el rendimiento del modelo con indicaciones

Aquí hay algunos consejos sobre cómo obtener los mejores resultados de calidad:

1. Especifique tareas simples y bien definidas y proporcione instrucciones explícitas para cada paso.
2. Claude a veces asume resultados de sus acciones sin verificar explícitamente sus resultados. Para prevenir esto, puede indicar a Claude con `Después de cada paso, tome una captura de pantalla y evalúe cuidadosamente si ha logrado el resultado correcto. Muestre explícitamente su pensamiento: "He evaluado el paso X..." Si no es correcto, intente de nuevo. Solo cuando confirme que un paso se ejecutó correctamente debe pasar al siguiente.`
3. Algunos elementos de interfaz de usuario (como menús desplegables y barras de desplazamiento) podrían ser complicados para que Claude los manipule usando movimientos del ratón. Si experimenta esto, intente indicar al modelo que use atajos de teclado.
4. Para tareas repetibles o interacciones de interfaz de usuario, incluya capturas de pantalla de ejemplo y llamadas de herramientas de resultados exitosos en su indicación.
5. Si necesita que el modelo inicie sesión, proporciónele el nombre de usuario y contraseña en su indicación dentro de etiquetas xml como `<robot_credentials>`. Usar el uso de computadora dentro de aplicaciones que requieren inicio de sesión aumenta el riesgo de malos resultados como resultado de inyección de indicaciones. Por favor revise nuestra [guía sobre mitigación de inyecciones de indicaciones](/docs/es/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks) antes de proporcionar al modelo credenciales de inicio de sesión.

<Tip>
  Si encuentra repetidamente un conjunto claro de problemas o sabe de antemano las tareas
  que Claude necesitará completar, use la indicación del sistema para proporcionar a Claude
  consejos explícitos o instrucciones sobre cómo hacer las tareas exitosamente.
</Tip>

### Indicaciones del sistema

Cuando una de las herramientas definidas por Anthropic se solicita a través de la API de Claude, se genera una indicación del sistema específica de uso de computadora. Es similar a la [indicación del sistema de uso de herramientas](/docs/es/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt) pero comienza con:

> Tiene acceso a un conjunto de funciones que puede usar para responder la pregunta del usuario. Esto incluye acceso a un entorno informático aislado. Actualmente NO tiene la capacidad de inspeccionar archivos o interactuar con recursos externos, excepto invocando las siguientes funciones.

Como con el uso de herramientas regular, el campo `system_prompt` proporcionado por el usuario aún se respeta y se utiliza en la construcción de la indicación del sistema combinada.

### Acciones disponibles

La herramienta de uso de computadora admite estas acciones:

**Acciones básicas (todas las versiones)**
- **screenshot** - Capturar la pantalla actual
- **left_click** - Hacer clic en las coordenadas `[x, y]`
- **type** - Escribir cadena de texto
- **key** - Presionar tecla o combinación de teclas (por ejemplo, "ctrl+s")
- **mouse_move** - Mover cursor a coordenadas

**Acciones mejoradas (`computer_20250124`)**
Disponibles en modelos Claude 4 y Claude Sonnet 3.7:
- **scroll** - Desplazarse en cualquier dirección con control de cantidad
- **left_click_drag** - Hacer clic y arrastrar entre coordenadas
- **right_click**, **middle_click** - Botones de ratón adicionales
- **double_click**, **triple_click** - Múltiples clics
- **left_mouse_down**, **left_mouse_up** - Control de clic de grano fino
- **hold_key** - Mantener una tecla mientras se realizan otras acciones
- **wait** - Pausar entre acciones

**Acciones mejoradas (`computer_20251124`)**
Disponibles en Claude Opus 4.5:
- Todas las acciones de `computer_20250124`
- **zoom** - Ver una región específica de la pantalla a resolución completa. Requiere `enable_zoom: true` en la definición de herramienta. Toma un parámetro `region` con coordenadas `[x1, y1, x2, y2]` definiendo las esquinas superior-izquierda e inferior-derecha del área a inspeccionar.

<section title="Acciones de ejemplo">

```json
// Tomar una captura de pantalla
{
  "action": "screenshot"
}

// Hacer clic en posición
{
  "action": "left_click",
  "coordinate": [500, 300]
}

// Escribir texto
{
  "action": "type",
  "text": "¡Hola, mundo!"
}

// Desplazarse hacia abajo (Claude 4/3.7)
{
  "action": "scroll",
  "coordinate": [500, 400],
  "scroll_direction": "down",
  "scroll_amount": 3
}

// Zoom para ver región en detalle (Opus 4.5)
{
  "action": "zoom",
  "region": [100, 200, 400, 350]
}
```

</section>

### Parámetros de herramienta

| Parámetro | Requerido | Descripción |
|-----------|-----------|-------------|
| `type` | Sí | Versión de herramienta (`computer_20251124`, `computer_20250124`, o `computer_20241022`) |
| `name` | Sí | Debe ser "computer" |
| `display_width_px` | Sí | Ancho de pantalla en píxeles |
| `display_height_px` | Sí | Alto de pantalla en píxeles |
| `display_number` | No | Número de pantalla para entornos X11 |
| `enable_zoom` | No | Habilitar acción de zoom (`computer_20251124` solo). Establezca en `true` para permitir que Claude haga zoom en regiones de pantalla específicas. Predeterminado: `false` |

<Note>
**Importante**: La herramienta de uso de computadora debe ser ejecutada explícitamente por su aplicación - Claude no puede ejecutarla directamente. Usted es responsable de implementar la captura de pantalla, movimientos del ratón, entradas de teclado, y otras acciones basadas en las solicitudes de Claude.
</Note>

### Habilitar capacidad de pensamiento en modelos Claude 4 y Claude Sonnet 3.7

Claude Sonnet 3.7 introdujo una nueva capacidad de "pensamiento" que le permite ver el proceso de razonamiento del modelo mientras trabaja en tareas complejas. Esta característica lo ayuda a entender cómo Claude está abordando un problema y puede ser particularmente valiosa para depuración o propósitos educativos.

Para habilitar el pensamiento, agregue un parámetro `thinking` a su solicitud de API:

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

El parámetro `budget_tokens` especifica cuántos tokens Claude puede usar para pensar. Esto se resta de su presupuesto general de `max_tokens`.

Cuando el pensamiento está habilitado, Claude devolverá su proceso de razonamiento como parte de la respuesta, lo que puede ayudarle a:

1. Entender el proceso de toma de decisiones del modelo
2. Identificar posibles problemas o conceptos erróneos
3. Aprender del enfoque de Claude para la resolución de problemas
4. Obtener más visibilidad en operaciones complejas de múltiples pasos

Aquí hay un ejemplo de cómo podría verse la salida de pensamiento:

```
[Pensamiento]
Necesito guardar una foto de un gato en el escritorio. Déjame desglosar esto en pasos:

1. Primero, tomaré una captura de pantalla para ver qué hay en el escritorio
2. Luego buscaré un navegador web para buscar imágenes de gatos
3. Después de encontrar una imagen adecuada, necesitaré guardarla en el escritorio

Déjame comenzar tomando una captura de pantalla para ver qué está disponible...
```

### Aumentar el uso de computadora con otras herramientas

La herramienta de uso de computadora se puede combinar con otras herramientas para crear flujos de trabajo de automatización más poderosos. Esto es particularmente útil cuando necesita:
- Ejecutar comandos del sistema ([herramienta bash](/docs/es/agents-and-tools/tool-use/bash-tool))
- Editar archivos de configuración o scripts ([herramienta de editor de texto](/docs/es/agents-and-tools/tool-use/text-editor-tool))
- Integrar con APIs personalizadas o servicios (herramientas personalizadas)

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: computer-use-2025-01-24" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 2000,
      "tools": [
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Obtener el clima actual en una ubicación determinada",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "La ciudad y estado, por ejemplo San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "La unidad de temperatura, ya sea 'celsius' o 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Encuentra vuelos desde San Francisco a un lugar con clima más cálido."
        }
      ],
      "thinking": {
        "type": "enabled",
        "budget_tokens": 1024
      }
    }'
  ```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Obtener el clima actual en una ubicación determinada",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "La ciudad y estado, por ejemplo San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "La unidad de temperatura, ya sea 'celsius' o 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        },
    ],
    messages=[{"role": "user", "content": "Encuentra vuelos desde San Francisco a un lugar con clima más cálido."}],
    betas=["computer-use-2025-01-24"],
    thinking={"type": "enabled", "budget_tokens": 1024},
)
print(response)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
      {
        type: "computer_20250124",
        name: "computer",
        display_width_px: 1024,
        display_height_px: 768,
        display_number: 1,
      },
      {
        type: "text_editor_20250728",
        name: "str_replace_based_edit_tool"
      },
      {
        type: "bash_20250124",
        name: "bash"
      },
      {
        name: "get_weather",
        description: "Obtener el clima actual en una ubicación determinada",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "La ciudad y estado, por ejemplo San Francisco, CA"
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "La unidad de temperatura, ya sea 'celsius' o 'fahrenheit'"
            }
          },
          required: ["location"]
        }
      },
  ],
  messages: [{ role: "user", content: "Encuentra vuelos desde San Francisco a un lugar con clima más cálido." }],
  betas: ["computer-use-2025-01-24"],
  thinking: { type: "enabled", budget_tokens: 1024 },
});
console.log(message);
```
```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaToolBash20250124;
import com.anthropic.models.beta.messages.BetaToolComputerUse20250124;
import com.anthropic.models.beta.messages.BetaToolTextEditor20250124;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaThinkingConfigParam;
import com.anthropic.models.beta.messages.BetaTool;

public class MultipleToolsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model("claude-sonnet-4-5")
                .maxTokens(1024)
                .addTool(BetaToolComputerUse20250124.builder()
                        .displayWidthPx(1024)
                        .displayHeightPx(768)
                        .displayNumber(1)
                        .build())
                .addTool(BetaToolTextEditor20250124.builder()
                        .build())
                .addTool(BetaToolBash20250124.builder()
                        .build())
                .addTool(BetaTool.builder()
                        .name("get_weather")
                        .description("Obtener el clima actual en una ubicación determinada")
                        .inputSchema(BetaTool.InputSchema.builder()
                                .properties(
                                        JsonValue.from(
                                                Map.of(
                                                        "location", Map.of(
                                                                "type", "string",
                                                                "description", "La ciudad y estado, por ejemplo San Francisco, CA"
                                                        ),
                                                        "unit", Map.of(
                                                                "type", "string",
                                                                "enum", List.of("celsius", "fahrenheit"),
                                                                "description", "La unidad de temperatura, ya sea 'celsius' o 'fahrenheit'"
                                                        )
                                                )
                                        ))
                                .build()
                        )
                        .build())
                .thinking(BetaThinkingConfigParam.ofEnabled(
                        BetaThinkingConfigEnabled.builder()
                                .budgetTokens(1024)
                                .build()
                ))
                .addUserMessage("Encuentra vuelos desde San Francisco a un lugar con clima más cálido.")
                .addBeta("computer-use-2025-01-24")
                .build();

        BetaMessage message = client.beta().messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

### Construir un entorno personalizado de uso de computadora

La [implementación de referencia](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo) está diseñada para ayudarte a comenzar con el uso de computadora. Incluye todos los componentes necesarios para que Claude use una computadora. Sin embargo, puedes construir tu propio entorno para el uso de computadora según tus necesidades. Necesitarás:

- Un entorno virtualizado o containerizado adecuado para el uso de computadora con Claude
- Una implementación de al menos una de las herramientas de uso de computadora definidas por Anthropic
- Un bucle de agente que interactúe con la API de Claude y ejecute los resultados de `tool_use` usando tus implementaciones de herramientas
- Una API o interfaz de usuario que permita la entrada del usuario para iniciar el bucle del agente

#### Implementar la herramienta de uso de computadora

La herramienta de uso de computadora se implementa como una herramienta sin esquema. Al usar esta herramienta, no necesitas proporcionar un esquema de entrada como con otras herramientas; el esquema está integrado en el modelo de Claude y no se puede modificar.

<Steps>
  <Step title="Configurar tu entorno informático">
    Crea una pantalla virtual o conéctate a una pantalla existente con la que Claude interactuará. Esto típicamente implica configurar Xvfb (X Virtual Framebuffer) o tecnología similar.
  </Step>
  <Step title="Implementar manejadores de acciones">
    Crea funciones para manejar cada tipo de acción que Claude podría solicitar:
    ```python
    def handle_computer_action(action_type, params):
        if action_type == "screenshot":
            return capture_screenshot()
        elif action_type == "left_click":
            x, y = params["coordinate"]
            return click_at(x, y)
        elif action_type == "type":
            return type_text(params["text"])
        # ... manejar otras acciones
    ```
  </Step>
  <Step title="Procesar las llamadas de herramientas de Claude">
    Extrae y ejecuta llamadas de herramientas de las respuestas de Claude:
    ```python
    for content in response.content:
        if content.type == "tool_use":
            action = content.input["action"]
            result = handle_computer_action(action, content.input)
            
            # Devolver resultado a Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Implementar el bucle del agente">
    Crea un bucle que continúe hasta que Claude complete la tarea:
    ```python
    while True:
        response = client.beta.messages.create(...)
        
        # Verificar si Claude usó alguna herramienta
        tool_results = process_tool_calls(response)
        
        if not tool_results:
            # Sin más uso de herramientas, tarea completada
            break
            
        # Continuar conversación con resultados de herramientas
        messages.append({"role": "user", "content": tool_results})
    ```
  </Step>
</Steps>

#### Manejar errores

Al implementar la herramienta de uso de computadora, pueden ocurrir varios errores. Así es cómo manejarlos:

<section title="Fallo en la captura de pantalla">

Si la captura de pantalla falla, devuelve un mensaje de error apropiado:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to capture screenshot. Display may be locked or unavailable.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Coordenadas inválidas">

Si Claude proporciona coordenadas fuera de los límites de la pantalla:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Coordinates (1200, 900) are outside display bounds (1024x768).",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Fallo en la ejecución de acciones">

Si una acción falla al ejecutarse:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to perform click action. The application may be unresponsive.",
      "is_error": true
    }
  ]
}
```

</section>

#### Manejar el escalado de coordenadas para resoluciones más altas

La API limita las imágenes a un máximo de 1568 píxeles en el borde más largo y aproximadamente 1,15 megapíxeles en total (consulta [cambio de tamaño de imagen](/docs/es/build-with-claude/vision#evaluate-image-size) para obtener más detalles). Por ejemplo, una pantalla de 1512x982 se reduce a aproximadamente 1330x864. Claude analiza esta imagen más pequeña y devuelve coordenadas en ese espacio, pero tu herramienta ejecuta clics en el espacio de pantalla original.

Esto puede causar que las coordenadas de clic de Claude pierdan sus objetivos a menos que manejes la transformación de coordenadas.

Para solucionar esto, cambia el tamaño de las capturas de pantalla tú mismo y escala las coordenadas de Claude hacia arriba:

<CodeGroup>
```python Python
import math

def get_scale_factor(width, height):
    """Calculate scale factor to meet API constraints."""
    long_edge = max(width, height)
    total_pixels = width * height

    long_edge_scale = 1568 / long_edge
    total_pixels_scale = math.sqrt(1_150_000 / total_pixels)

    return min(1.0, long_edge_scale, total_pixels_scale)

# When capturing screenshot
scale = get_scale_factor(screen_width, screen_height)
scaled_width = int(screen_width * scale)
scaled_height = int(screen_height * scale)

# Resize image to scaled dimensions before sending to Claude
screenshot = capture_and_resize(scaled_width, scaled_height)

# When handling Claude's coordinates, scale them back up
def execute_click(x, y):
    screen_x = x / scale
    screen_y = y / scale
    perform_click(screen_x, screen_y)
```

```typescript TypeScript
const MAX_LONG_EDGE = 1568;
const MAX_PIXELS = 1_150_000;

function getScaleFactor(width: number, height: number): number {
  const longEdge = Math.max(width, height);
  const totalPixels = width * height;

  const longEdgeScale = MAX_LONG_EDGE / longEdge;
  const totalPixelsScale = Math.sqrt(MAX_PIXELS / totalPixels);

  return Math.min(1.0, longEdgeScale, totalPixelsScale);
}

// When capturing screenshot
const scale = getScaleFactor(screenWidth, screenHeight);
const scaledWidth = Math.floor(screenWidth * scale);
const scaledHeight = Math.floor(screenHeight * scale);

// Resize image to scaled dimensions before sending to Claude
const screenshot = captureAndResize(scaledWidth, scaledHeight);

// When handling Claude's coordinates, scale them back up
function executeClick(x: number, y: number): void {
  const screenX = x / scale;
  const screenY = y / scale;
  performClick(screenX, screenY);
}
```
</CodeGroup>

#### Seguir las mejores prácticas de implementación

<section title="Usar resolución de pantalla apropiada">

Establece dimensiones de pantalla que coincidan con tu caso de uso mientras te mantienes dentro de los límites recomendados:
- Para tareas generales de escritorio: 1024x768 o 1280x720
- Para aplicaciones web: 1280x800 o 1366x768
- Evita resoluciones superiores a 1920x1080 para prevenir problemas de rendimiento

</section>

<section title="Implementar manejo adecuado de capturas de pantalla">

Al devolver capturas de pantalla a Claude:
- Codifica capturas de pantalla como PNG o JPEG en base64
- Considera comprimir capturas de pantalla grandes para mejorar el rendimiento
- Incluye metadatos relevantes como marca de tiempo o estado de la pantalla
- Si usas resoluciones más altas, asegúrate de que las coordenadas se escalen con precisión

</section>

<section title="Agregar retrasos de acción">

Algunas aplicaciones necesitan tiempo para responder a acciones:
```python
def click_and_wait(x, y, wait_time=0.5):
    click_at(x, y)
    time.sleep(wait_time)  # Allow UI to update
```

</section>

<section title="Validar acciones antes de la ejecución">

Verifica que las acciones solicitadas sean seguras y válidas:
```python
def validate_action(action_type, params):
    if action_type == "left_click":
        x, y = params.get("coordinate", (0, 0))
        if not (0 <= x < display_width and 0 <= y < display_height):
            return False, "Coordinates out of bounds"
    return True, None
```

</section>

<section title="Registrar acciones para depuración">

Mantén un registro de todas las acciones para solucionar problemas:
```python
import logging

def log_action(action_type, params, result):
    logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
```

</section>

---

## Comprender las limitaciones del uso de computadora

La funcionalidad de uso de computadora está en beta. Si bien las capacidades de Claude son de vanguardia, los desarrolladores deben ser conscientes de sus limitaciones:

1. **Latencia**: la latencia actual del uso de computadora para interacciones humano-IA puede ser demasiado lenta en comparación con las acciones de computadora dirigidas regularmente por humanos. Recomendamos enfocarse en casos de uso donde la velocidad no es crítica (por ejemplo, recopilación de información de fondo, pruebas automatizadas de software) en entornos de confianza.
2. **Precisión y confiabilidad de la visión por computadora**: Claude puede cometer errores o alucinar al generar coordenadas específicas mientras genera acciones. Claude Sonnet 3.7 introduce la capacidad de pensamiento que puede ayudarte a comprender el razonamiento del modelo e identificar posibles problemas.
3. **Precisión y confiabilidad de la selección de herramientas**: Claude puede cometer errores o alucinar al seleccionar herramientas mientras genera acciones o tomar acciones inesperadas para resolver problemas. Además, la confiabilidad puede ser menor al interactuar con aplicaciones de nicho o múltiples aplicaciones a la vez. Recomendamos que los usuarios soliciten al modelo cuidadosamente cuando soliciten tareas complejas.
4. **Confiabilidad del desplazamiento**: Claude Sonnet 3.7 introdujo acciones de desplazamiento dedicadas con control de dirección que mejora la confiabilidad. El modelo ahora puede desplazarse explícitamente en cualquier dirección (arriba/abajo/izquierda/derecha) por una cantidad especificada.
5. **Interacción con hojas de cálculo**: Los clics del ratón para la interacción con hojas de cálculo han mejorado en Claude Sonnet 3.7 con la adición de acciones de control del ratón más precisas como `left_mouse_down`, `left_mouse_up` y nuevo soporte de teclas modificadoras. La selección de celdas puede ser más confiable usando estos controles de grano fino y combinando teclas modificadoras con clics.
6. **Creación de cuentas y generación de contenido en plataformas sociales y de comunicaciones**: Si bien Claude visitará sitios web, estamos limitando su capacidad para crear cuentas o generar y compartir contenido o de otra manera participar en suplantación de identidad humana en sitios web y plataformas de redes sociales. Podemos actualizar esta capacidad en el futuro.
7. **Vulnerabilidades**: Las vulnerabilidades como jailbreaking o inyección de solicitudes pueden persistir en sistemas de IA fronterizos, incluida la API beta de uso de computadora. En algunas circunstancias, Claude seguirá comandos encontrados en contenido, a veces incluso en conflicto con las instrucciones del usuario. Por ejemplo, las instrucciones de Claude en páginas web o contenidas en imágenes pueden anular instrucciones o causar que Claude cometa errores. Recomendamos:
   a. Limitar el uso de computadora a entornos de confianza como máquinas virtuales o contenedores con privilegios mínimos
   b. Evitar dar acceso de uso de computadora a cuentas o datos sensibles sin supervisión estricta
   c. Informar a los usuarios finales de los riesgos relevantes y obtener su consentimiento antes de habilitar o solicitar permisos necesarios para características de uso de computadora en tus aplicaciones
8. **Acciones inapropiadas o ilegales**: Según los términos de servicio de Anthropic, no debes usar el uso de computadora para violar ninguna ley o nuestra Política de Uso Aceptable.

Siempre revisa y verifica cuidadosamente las acciones y registros de uso de computadora de Claude. No uses Claude para tareas que requieran precisión perfecta o información de usuario sensible sin supervisión humana.

---

## Precios

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

## Próximos pasos

<CardGroup cols={2}>
  <Card
    title="Implementación de referencia"
    icon="github-logo"
    href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
  >
    Comienza rápidamente con nuestra implementación completa basada en Docker
  </Card>
  <Card
    title="Documentación de herramientas"
    icon="tool"
    href="/docs/es/agents-and-tools/tool-use/overview"
  >
    Obtén más información sobre el uso de herramientas y la creación de herramientas personalizadas
  </Card>
</CardGroup>