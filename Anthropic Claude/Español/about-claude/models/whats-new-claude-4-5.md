# Novedades en Claude 4.5

Descubre las nuevas características y mejoras en Claude 4.5, incluyendo tres modelos diseñados para diferentes casos de uso, parámetro de esfuerzo, capacidades mejoradas de uso de computadora y nuevas características de API.

---

Claude 4.5 introduce tres modelos diseñados para diferentes casos de uso:

- **Claude Opus 4.5**: Nuestro modelo más inteligente que combina la máxima capacidad con un rendimiento práctico. Presenta un punto de precio más accesible que los modelos Opus anteriores. Disponible con una ventana de contexto de 200k tokens.
- **Claude Sonnet 4.5**: Nuestro mejor modelo para agentes complejos y codificación, con la inteligencia más alta en la mayoría de las tareas. Disponible con una ventana de contexto de 200k y 1M (beta) tokens.
- **Claude Haiku 4.5**: Nuestro modelo Haiku más rápido e inteligente con rendimiento casi de frontera. Disponible con una ventana de contexto de 200k tokens.

## Mejoras clave en Opus 4.5 sobre Opus 4.1

### Inteligencia máxima

Claude Opus 4.5 representa nuestro modelo más inteligente, combinando la máxima capacidad con un rendimiento práctico. Ofrece mejoras de cambio de paso en razonamiento, codificación y tareas complejas de resolución de problemas mientras mantiene los resultados de alta calidad esperados de la familia Opus.

### Parámetro de esfuerzo

Claude Opus 4.5 es el único modelo que admite el [parámetro de esfuerzo](/docs/es/build-with-claude/effort), permitiéndote controlar cuántos tokens usa Claude al responder. Esto te da la capacidad de hacer compensaciones entre la exhaustividad de la respuesta y la eficiencia de tokens con un único modelo.

El parámetro de esfuerzo afecta todos los tokens en la respuesta, incluyendo respuestas de texto, llamadas de herramientas y pensamiento extendido. Puedes elegir entre:
- **Esfuerzo alto**: Máxima exhaustividad para análisis complejos y explicaciones detalladas
- **Esfuerzo medio**: Enfoque equilibrado para la mayoría de casos de uso en producción
- **Esfuerzo bajo**: Respuestas más eficientes en tokens para automatización de alto volumen

### Excelencia en uso de computadora

Claude Opus 4.5 introduce [capacidades mejoradas de uso de computadora](/docs/es/agents-and-tools/tool-use/computer-use-tool) con una nueva acción de zoom que permite la inspección detallada de regiones específicas de la pantalla a resolución completa. Esto permite a Claude examinar elementos de interfaz de usuario de grano fino, texto pequeño e información visual detallada que podría ser poco clara en capturas de pantalla estándar.

La capacidad de zoom es particularmente valiosa para:
- Inspeccionar elementos pequeños de la interfaz de usuario y controles
- Leer letra pequeña o texto detallado
- Analizar interfaces complejas con información densa
- Verificar detalles visuales precisos antes de tomar acciones

### Rendimiento práctico

Claude Opus 4.5 ofrece inteligencia de clase mundial a un [punto de precio más accesible](/docs/es/about-claude/pricing) que los modelos Opus anteriores, haciendo que las capacidades avanzadas de IA estén disponibles para una gama más amplia de aplicaciones y casos de uso.

### Preservación de bloques de pensamiento

Claude Opus 4.5 [preserva automáticamente todos los bloques de pensamiento anteriores](/docs/es/build-with-claude/extended-thinking#thinking-block-preservation-in-claude-opus-4-5) a lo largo de las conversaciones, manteniendo la continuidad del razonamiento en interacciones multi-turno extendidas y sesiones de uso de herramientas. Esto asegura que Claude pueda aprovechar efectivamente su historial de razonamiento completo cuando trabaja en tareas complejas y de larga duración.

## Mejoras clave en Sonnet 4.5 sobre Sonnet 4

### Excelencia en codificación

Claude Sonnet 4.5 es nuestro mejor modelo de codificación hasta la fecha, con mejoras significativas en todo el ciclo de vida del desarrollo:

- **Rendimiento verificado de SWE-bench**: Avance avanzado de última generación en puntos de referencia de codificación
- **Planificación mejorada y diseño de sistemas**: Mejores decisiones arquitectónicas y organización del código
- **Ingeniería de seguridad mejorada**: Prácticas de seguridad más robustas y detección de vulnerabilidades
- **Mejor seguimiento de instrucciones**: Adherencia más precisa a especificaciones y requisitos de codificación

<Note>
Claude Sonnet 4.5 funciona significativamente mejor en tareas de codificación cuando [el pensamiento extendido](/docs/es/build-with-claude/extended-thinking) está habilitado. El pensamiento extendido está deshabilitado por defecto, pero recomendamos habilitarlo para trabajo de codificación complejo. Ten en cuenta que el pensamiento extendido impacta la [eficiencia del almacenamiento en caché de prompts](/docs/es/build-with-claude/prompt-caching#caching-with-thinking-blocks). Consulta la [guía de migración](/docs/es/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) para detalles de configuración.
</Note>

### Capacidades de agente

Claude Sonnet 4.5 introduce avances importantes en capacidades de agente:

- **Operación autónoma extendida**: Sonnet 4.5 puede trabajar de forma independiente durante horas mientras mantiene claridad y enfoque en el progreso incremental. El modelo hace avances constantes en algunas tareas a la vez en lugar de intentar hacerlo todo de una vez. Proporciona actualizaciones de progreso basadas en hechos que reflejan con precisión lo que se ha logrado.
- **Conciencia de contexto**: Claude ahora rastrea su uso de tokens a lo largo de las conversaciones, recibiendo actualizaciones después de cada llamada de herramienta. Esta conciencia ayuda a prevenir el abandono prematuro de tareas y permite una ejecución más efectiva en tareas de larga duración. Consulta [Conciencia de contexto](/docs/es/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5) para detalles técnicos y [orientación de prompting](/docs/es/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).
- **Uso mejorado de herramientas**: El modelo usa más efectivamente llamadas de herramientas paralelas, disparando múltiples búsquedas especulativas simultáneamente durante la investigación y leyendo varios archivos a la vez para construir contexto más rápido. La coordinación mejorada entre múltiples herramientas y fuentes de información permite al modelo aprovechar efectivamente una amplia gama de capacidades en búsqueda agéntica y flujos de trabajo de codificación.
- **Gestión avanzada de contexto**: Sonnet 4.5 mantiene un seguimiento de estado excepcional en archivos externos, preservando la orientación hacia objetivos en sesiones. Combinado con un uso más efectivo de la ventana de contexto y nuestras nuevas características de API de gestión de contexto, el modelo maneja óptimamente la información en sesiones extendidas para mantener coherencia a lo largo del tiempo.

<Note>La conciencia de contexto está disponible en Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 y Opus 4.5.</Note>

### Estilo de comunicación e interacción

Claude Sonnet 4.5 tiene un enfoque de comunicación refinado que es conciso, directo y natural. Proporciona actualizaciones de progreso basadas en hechos y puede omitir resúmenes detallados después de llamadas de herramientas para mantener el impulso del flujo de trabajo (aunque esto puede ajustarse con prompting).

Para orientación detallada sobre cómo trabajar con este estilo de comunicación, consulta [Mejores prácticas de Claude 4](/docs/es/build-with-claude/prompt-engineering/claude-4-best-practices).

### Generación de contenido creativo

Claude Sonnet 4.5 destaca en tareas de contenido creativo:

- **Presentaciones y animaciones**: Iguala o supera a Claude Opus 4.1 y Opus 4.5 para crear diapositivas y contenido visual
- **Toque creativo**: Produce resultados pulidos y profesionales con fuerte seguimiento de instrucciones
- **Calidad de primer intento**: Genera contenido utilizable y bien diseñado en intentos iniciales

## Mejoras clave en Haiku 4.5 sobre Haiku 3.5

Claude Haiku 4.5 representa un salto transformador para la familia de modelos Haiku, trayendo capacidades de frontera a nuestra clase de modelo más rápida:

### Inteligencia casi de frontera con velocidad vertiginosa

Claude Haiku 4.5 ofrece rendimiento casi de frontera que iguala a Sonnet 4 a un costo significativamente menor y velocidad más rápida:

- **Inteligencia casi de frontera**: Iguala el rendimiento de Sonnet 4 en razonamiento, codificación y tareas complejas
- **Velocidad mejorada**: Más del doble de la velocidad de Sonnet 4, con optimizaciones para tokens de salida por segundo (OTPS)
- **Relación costo-rendimiento óptima**: Inteligencia casi de frontera a un tercio del costo, ideal para implementaciones de alto volumen

### Capacidades de pensamiento extendido

Claude Haiku 4.5 es el **primer modelo Haiku** que admite pensamiento extendido, trayendo capacidades de razonamiento avanzado a la familia Haiku:

- **Razonamiento a velocidad**: Acceso al proceso de razonamiento interno de Claude para resolución de problemas complejos
- **Resumen de pensamiento**: Salida de pensamiento resumida para implementaciones listas para producción
- **Pensamiento intercalado**: Pensar entre llamadas de herramientas para flujos de trabajo multi-paso más sofisticados
- **Control de presupuesto**: Configura presupuestos de tokens de pensamiento para equilibrar la profundidad del razonamiento con la velocidad

El pensamiento extendido debe habilitarse explícitamente agregando un parámetro `thinking` a tus solicitudes de API. Consulta la [documentación de pensamiento extendido](/docs/es/build-with-claude/extended-thinking) para detalles de implementación.

<Note>
Claude Haiku 4.5 funciona significativamente mejor en tareas de codificación y razonamiento cuando [el pensamiento extendido](/docs/es/build-with-claude/extended-thinking) está habilitado. El pensamiento extendido está deshabilitado por defecto, pero recomendamos habilitarlo para resolución de problemas complejos, trabajo de codificación y razonamiento multi-paso. Ten en cuenta que el pensamiento extendido impacta la [eficiencia del almacenamiento en caché de prompts](/docs/es/build-with-claude/prompt-caching#caching-with-thinking-blocks). Consulta la [guía de migración](/docs/es/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations) para detalles de configuración.
</Note>

<Note>Disponible en Claude Sonnet 3.7, Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 y Opus 4.5.</Note>

### Conciencia de contexto

Claude Haiku 4.5 presenta **conciencia de contexto**, permitiendo al modelo rastrear su ventana de contexto restante a lo largo de una conversación:

- **Seguimiento de presupuesto de tokens**: Claude recibe actualizaciones en tiempo real sobre la capacidad de contexto restante después de cada llamada de herramienta
- **Mejor persistencia de tareas**: El modelo puede ejecutar tareas más efectivamente al entender el espacio de trabajo disponible
- **Flujos de trabajo de ventana de contexto múltiple**: Manejo mejorado de transiciones de estado en sesiones extendidas

Este es el primer modelo Haiku con capacidades nativas de conciencia de contexto. Para orientación de prompting, consulta [Mejores prácticas de Claude 4](/docs/es/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

<Note>Disponible en Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 y Opus 4.5.</Note>

### Codificación fuerte y uso de herramientas

Claude Haiku 4.5 ofrece capacidades de codificación robustas esperadas de los modelos Claude modernos:

- **Competencia en codificación**: Rendimiento fuerte en generación de código, depuración y tareas de refactorización
- **Soporte completo de herramientas**: Compatible con todas las herramientas de Claude 4 incluyendo bash, ejecución de código, editor de texto, búsqueda web y uso de computadora
- **Uso mejorado de computadora**: Optimizado para interacción autónoma de escritorio y flujos de trabajo de automatización de navegador
- **Ejecución de herramientas paralelas**: Coordinación eficiente entre múltiples herramientas para flujos de trabajo complejos

Haiku 4.5 está diseñado para casos de uso que demandan tanto inteligencia como eficiencia:

- **Aplicaciones en tiempo real**: Tiempos de respuesta rápidos para experiencias de usuario interactivas
- **Procesamiento de alto volumen**: Inteligencia rentable para implementaciones a gran escala
- **Implementaciones de nivel gratuito**: Calidad de modelo premium a precios accesibles
- **Arquitecturas de sub-agente**: Agentes rápidos e inteligentes para sistemas multi-agente
- **Uso de computadora a escala**: Automatización de escritorio y navegador autónoma rentable

## Nuevas características de API

### Llamada de herramientas programática (Beta)

[La llamada de herramientas programática](/docs/es/agents-and-tools/tool-use/programmatic-tool-calling) permite a Claude escribir código que llama tus herramientas programáticamente dentro de un contenedor de ejecución de código, en lugar de requerir viajes de ida y vuelta a través del modelo para cada invocación de herramienta. Esto reduce significativamente la latencia para flujos de trabajo multi-herramienta y disminuye el consumo de tokens al permitir a Claude filtrar o procesar datos antes de que lleguen a la ventana de contexto del modelo.

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

Beneficios clave:
- **Latencia reducida**: Elimina viajes de ida y vuelta del modelo entre llamadas de herramientas
- **Eficiencia de tokens**: Procesa y filtra resultados de herramientas programáticamente antes de devolver a Claude
- **Flujos de trabajo complejos**: Admite bucles, lógica condicional y procesamiento por lotes

<Note>Disponible en Claude Opus 4.5 y Claude Sonnet 4.5. Requiere [encabezado beta](/docs/es/api/beta-headers): `advanced-tool-use-2025-11-20`</Note>

### Herramienta de búsqueda de herramientas (Beta)

La [herramienta de búsqueda de herramientas](/docs/es/agents-and-tools/tool-use/tool-search-tool) permite a Claude trabajar con cientos o miles de herramientas descubriendo y cargándolas dinámicamente bajo demanda. En lugar de cargar todas las definiciones de herramientas en la ventana de contexto de antemano, Claude busca tu catálogo de herramientas y carga solo las herramientas que necesita.

Hay dos variantes de búsqueda disponibles:
- **Regex** (`tool_search_tool_regex_20251119`): Claude construye patrones regex para buscar nombres de herramientas, descripciones y argumentos
- **BM25** (`tool_search_tool_bm25_20251119`): Claude usa consultas en lenguaje natural para buscar herramientas

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get the weather at a specific location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

Este enfoque resuelve dos desafíos críticos:
- **Eficiencia de contexto**: Ahorra 10-20K tokens al no cargar todas las definiciones de herramientas de antemano
- **Precisión de selección de herramientas**: Mantiene alta precisión incluso con 100+ herramientas disponibles

<Note>Disponible en Claude Opus 4.5 y Claude Sonnet 4.5. Requiere [encabezado beta](/docs/es/api/beta-headers): `advanced-tool-use-2025-11-20`</Note>

### Parámetro de esfuerzo (Beta)

El [parámetro de esfuerzo](/docs/es/build-with-claude/effort) te permite controlar cuántos tokens usa Claude al responder, haciendo compensaciones entre la exhaustividad de la respuesta y la eficiencia de tokens:

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

El parámetro de esfuerzo afecta todos los tokens en la respuesta, incluyendo respuestas de texto, llamadas de herramientas y pensamiento extendido. Los niveles de esfuerzo más bajos producen respuestas más concisas con explicaciones mínimas, mientras que el esfuerzo más alto proporciona razonamiento detallado y respuestas exhaustivas.

<Note>Disponible exclusivamente en Claude Opus 4.5. Requiere [encabezado beta](/docs/es/api/beta-headers): `effort-2025-11-24`</Note>

### Ejemplos de uso de herramientas (Beta)

[Los ejemplos de uso de herramientas](/docs/es/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples) te permiten proporcionar ejemplos concretos de entradas de herramientas válidas para ayudar a Claude a entender cómo usar tus herramientas más efectivamente. Esto es particularmente útil para herramientas complejas con objetos anidados, parámetros opcionales o entradas sensibles al formato.

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {...},
        "input_examples": [
            {
                "location": "San Francisco, CA",
                "unit": "fahrenheit"
            },
            {
                "location": "Tokyo, Japan",
                "unit": "celsius"
            },
            {
                "location": "New York, NY"  # Demonstrates optional 'unit' parameter
            }
        ]
    }
]
```

Los ejemplos se incluyen en el prompt junto a tu esquema de herramienta, mostrando a Claude patrones concretos para llamadas de herramientas bien formadas. Cada ejemplo debe ser válido según el `input_schema` de la herramienta.

<Note>Disponible en Claude Sonnet 4.5, Haiku 4.5, Opus 4.5, Opus 4.1 y Opus 4. Requiere [encabezado beta](/docs/es/api/beta-headers): `advanced-tool-use-2025-11-20`.</Note>

### Herramienta de memoria (Beta)

La nueva [herramienta de memoria](/docs/es/agents-and-tools/tool-use/memory-tool) permite a Claude almacenar y recuperar información fuera de la ventana de contexto:

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

Esto permite:
- Construir bases de conocimiento a lo largo del tiempo
- Mantener estado del proyecto en sesiones
- Preservar contexto efectivamente ilimitado a través de almacenamiento basado en archivos

<Note>Disponible en Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 y Opus 4.5. Requiere [encabezado beta](/docs/es/api/beta-headers): `context-management-2025-06-27`</Note>

### Edición de contexto

Usa [edición de contexto](/docs/es/build-with-claude/context-editing) para gestión inteligente de contexto a través de limpieza automática de llamadas de herramientas:

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",  # or claude-haiku-4-5
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

Esta característica elimina automáticamente llamadas de herramientas más antiguas y resultados cuando se acerca a los límites de tokens, ayudando a gestionar el contexto en sesiones de agente de larga duración.

<Note>Disponible en Claude Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1 y Opus 4.5. Requiere [encabezado beta](/docs/es/api/beta-headers): `context-management-2025-06-27`</Note>

### Razones de parada mejoradas

Los modelos Claude 4.5 introducen una nueva razón de parada `model_context_window_exceeded` que indica explícitamente cuándo la generación se detuvo debido a alcanzar el límite de la ventana de contexto, en lugar del límite de `max_tokens` solicitado. Esto facilita el manejo de límites de ventana de contexto en tu lógica de aplicación.

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

### Manejo mejorado de parámetros de herramientas

Los modelos Claude 4.5 incluyen una corrección de error que preserva el formato intencional en parámetros de cadena de llamadas de herramientas. Anteriormente, los saltos de línea finales en parámetros de cadena a veces se eliminaban incorrectamente. Esta corrección asegura que las herramientas que requieren formato preciso (como editores de texto) reciban parámetros exactamente como se pretendía.

<Note>
Esta es una mejora detrás de escenas sin cambios de API requeridos. Sin embargo, las herramientas con parámetros de cadena ahora pueden recibir valores con saltos de línea finales que fueron eliminados previamente.
</Note>

**Ejemplo:**

```json
// Antes: Salto de línea final eliminado accidentalmente
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit"
  }
}

// Después: Salto de línea final preservado como se pretendía
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit\n"
  }
}
```

### Optimizaciones de conteo de tokens

Los modelos Claude 4.5 incluyen optimizaciones automáticas para mejorar el rendimiento del modelo. Estas optimizaciones pueden agregar pequeñas cantidades de tokens a las solicitudes, pero **no se te cobra por estos tokens agregados por el sistema**.

## Características introducidas en Claude 4

Las siguientes características fueron introducidas en Claude 4 y están disponibles en todos los modelos Claude 4, incluyendo Claude Sonnet 4.5 y Claude Haiku 4.5.

### Nueva razón de parada de rechazo

Los modelos Claude 4 introducen una nueva razón de parada `refusal` para contenido que el modelo rechaza generar por razones de seguridad:

```json
{
  "id": "msg_014XEDjypDjFzgKVWdFUXxZP",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5",
  "content": [{"type": "text", "text": "I would be happy to assist you. You can "}],
  "stop_reason": "refusal",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 564,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 22
  }
}
```

Al usar modelos Claude 4, debes actualizar tu aplicación para [manejar razones de parada `refusal`](/docs/es/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

### Pensamiento resumido

Con el pensamiento extendido habilitado, la API de Mensajes para modelos Claude 4 devuelve un resumen del proceso de pensamiento completo de Claude. El pensamiento resumido proporciona los beneficios de inteligencia completa del pensamiento extendido, mientras previene el mal uso.

Aunque la API es consistente en los modelos Claude 3.7 y 4, las respuestas de streaming para pensamiento extendido podrían devolver en un patrón de entrega "fragmentada", con posibles retrasos entre eventos de streaming.

<Note>
La sumarización es procesada por un modelo diferente al que apuntas en tus solicitudes. El modelo de pensamiento no ve la salida resumida.
</Note>

Para más información, consulta la [documentación de pensamiento extendido](/docs/es/build-with-claude/extended-thinking#summarized-thinking).

### Pensamiento intercalado

Los modelos Claude 4 admiten intercalar el uso de herramientas con pensamiento extendido, permitiendo conversaciones más naturales donde los usos de herramientas y respuestas pueden mezclarse con mensajes regulares.

<Note>
El pensamiento intercalado está en beta. Para habilitar el pensamiento intercalado, agrega el [encabezado beta](/docs/es/api/beta-headers) `interleaved-thinking-2025-05-14` a tu solicitud de API.
</Note>

Para más información, consulta la [documentación de pensamiento extendido](/docs/es/build-with-claude/extended-thinking#interleaved-thinking).

### Diferencias de comportamiento

Los modelos Claude 4 tienen cambios de comportamiento notables que pueden afectar cómo estructuras prompts:

#### Cambios en el estilo de comunicación

- **Más conciso y directo**: Los modelos Claude 4 se comunican más eficientemente, con explicaciones menos detalladas
- **Tono más natural**: Las respuestas son ligeramente más conversacionales y menos mecánicas
- **Enfocado en eficiencia**: Puede omitir resúmenes detallados después de completar acciones para mantener el impulso del flujo de trabajo (puedes solicitar más detalle si es necesario)

#### Seguimiento de instrucciones

Los modelos Claude 4 están entrenados para seguimiento preciso de instrucciones y requieren dirección más explícita:

- **Sé explícito sobre acciones**: Usa lenguaje directo como "Haz estos cambios" o "Implementa esta característica" en lugar de "¿Puedes sugerir cambios" si quieres que Claude tome acción
- **Establece comportamientos deseados claramente**: Claude seguirá instrucciones precisamente, así que ser específico sobre lo que quieres ayuda a lograr mejores resultados

Para orientación exhaustiva sobre cómo trabajar con estos modelos, consulta [Mejores prácticas de ingeniería de prompts de Claude 4](/docs/es/build-with-claude/prompt-engineering/claude-4-best-practices).

### Herramienta de editor de texto actualizada

La herramienta de editor de texto ha sido actualizada para modelos Claude 4 con los siguientes cambios:

- **Tipo de herramienta**: `text_editor_20250728`
- **Nombre de herramienta**: `str_replace_based_edit_tool`
- El comando `undo_edit` ya no es compatible

<Note>
La herramienta de editor de texto `str_replace_editor` permanece igual para Claude Sonnet 3.7.
</Note>

Si estás migrando desde Claude Sonnet 3.7 y usando la herramienta de editor de texto:

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Modelos Claude 4
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

Para más información, consulta la [documentación de herramienta de editor de texto](/docs/es/agents-and-tools/tool-use/text-editor-tool).

### Herramienta de ejecución de código actualizada

Si estás usando la herramienta de ejecución de código, asegúrate de estar usando la última versión `code_execution_20250825`, que agrega comandos Bash y capacidades de manipulación de archivos.

La versión heredada `code_execution_20250522` (solo Python) sigue disponible pero no se recomienda para nuevas implementaciones.

Para instrucciones de migración, consulta la [documentación de herramienta de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version).

## Precios y disponibilidad

### Precios

Los modelos Claude 4.5 mantienen precios competitivos:

| Modelo | Entrada | Salida |
|--------|---------|--------|
| Claude Opus 4.5 | $5 por millón de tokens | $25 por millón de tokens |
| Claude Sonnet 4.5 | $3 por millón de tokens | $15 por millón de tokens |
| Claude Haiku 4.5 | $1 por millón de tokens | $5 por millón de tokens |

Para más detalles, consulta la [documentación de precios](/docs/es/about-claude/pricing).

### Precios de plataforma de terceros

A partir de los modelos Claude 4.5 (Opus 4.5, Sonnet 4.5 y Haiku 4.5), AWS Bedrock y Google Vertex AI ofrecen dos tipos de puntos finales:

- **Puntos finales globales**: Enrutamiento dinámico para máxima disponibilidad
- **Puntos finales regionales**: Enrutamiento de datos garantizado a través de regiones geográficas específicas con una **prima de precios del 10%**

**Este precio regional se aplica a todos los modelos Claude 4.5: Opus 4.5, Sonnet 4.5 y Haiku 4.5.**

**La API de Claude (1P) es global por defecto y no se ve afectada por este cambio.** La API de Claude es solo global (equivalente a la oferta de punto final global y precios de otros proveedores).

Para detalles de implementación y orientación de migración:
- [Puntos finales globales vs regionales de AWS Bedrock](/docs/es/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Puntos finales globales vs regionales de Google Vertex AI](/docs/es/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)

### Disponibilidad

Los modelos Claude 4.5 están disponibles en:

| Modelo | Claude API | Amazon Bedrock | Google Cloud Vertex AI |
|--------|-----------|----------------|------------------------|
| Claude Opus 4.5 | `claude-opus-4-5-20251101` | `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5@20251101` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | `anthropic.claude-haiku-4-5-20251001-v1:0` | `claude-haiku-4-5@20251001` |

También disponible a través de plataformas Claude.ai y Claude Code.

## Guía de migración

Los cambios importantes y requisitos de migración varían dependiendo de qué modelo estés actualizando. Para instrucciones de migración detalladas, incluyendo guías paso a paso, cambios importantes y listas de verificación de migración, consulta [Migrando a Claude 4.5](/docs/es/about-claude/models/migrating-to-claude-4).

La guía de migración cubre los siguientes escenarios:
- **Claude Sonnet 3.7 → Sonnet 4.5**: Ruta de migración completa con cambios importantes
- **Claude Haiku 3.5 → Haiku 4.5**: Ruta de migración completa con cambios importantes
- **Claude Sonnet 4 → Sonnet 4.5**: Actualización rápida con cambios mínimos
- **Claude Opus 4.1 → Sonnet 4.5**: Actualización sin problemas sin cambios importantes
- **Claude Opus 4.1 → Opus 4.5**: Actualización sin problemas sin cambios importantes
- **Claude Opus 4.5 → Sonnet 4.5**: Degradación sin problemas sin cambios importantes

## Próximos pasos

<CardGroup cols={3}>
  <Card title="Mejores prácticas" icon="lightbulb" href="/docs/es/build-with-claude/prompt-engineering/claude-4-best-practices">
    Aprende técnicas de ingeniería de prompts para modelos Claude 4.5
  </Card>
  <Card title="Descripción general del modelo" icon="table" href="/docs/es/about-claude/models/overview">
    Compara modelos Claude 4.5 con otros modelos Claude
  </Card>
  <Card title="Guía de migración" icon="arrow-right-arrow-left" href="/docs/es/about-claude/models/migrating-to-claude-4">
    Actualiza desde modelos anteriores
  </Card>
</CardGroup>