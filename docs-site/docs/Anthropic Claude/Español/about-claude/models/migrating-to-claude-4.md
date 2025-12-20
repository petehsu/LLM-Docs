# Migración a Claude 4.5

Guía completa para migrar a Claude 4.5, incluyendo rutas de migración de Claude Sonnet 3.7 y Claude Haiku 3.5 con cambios importantes y pasos detallados.

---

Esta guía cubre dos rutas de migración clave a los modelos Claude 4.5:

- **Claude Sonnet 3.7 → Claude Sonnet 4.5**: Nuestro modelo más inteligente con razonamiento de clase mundial, capacidades de codificación y agentes de larga duración
- **Claude Haiku 3.5 → Claude Haiku 4.5**: Nuestro modelo Haiku más rápido e inteligente con rendimiento cercano a la frontera para aplicaciones en tiempo real y procesamiento inteligente de alto volumen

Ambas migraciones implican cambios importantes que requieren actualizaciones en tu implementación. Esta guía te guiará a través de cada ruta de migración con instrucciones paso a paso y cambios importantes claramente marcados.

Antes de comenzar tu migración, te recomendamos revisar [Novedades en Claude 4.5](/docs/es/about-claude/models/whats-new-claude-4-5) para entender las nuevas características y capacidades disponibles en estos modelos, incluyendo pensamiento extendido, conciencia de contexto y mejoras de comportamiento.

## Migración de Claude Sonnet 3.7 a Claude Sonnet 4.5

Claude Sonnet 4.5 es nuestro modelo más inteligente, ofreciendo rendimiento de clase mundial para razonamiento, codificación y agentes autónomos de larga duración. Esta migración incluye varios cambios importantes que requieren actualizaciones en tu implementación.

### Pasos de migración

1. **Actualiza el nombre de tu modelo:**
   ```python
   # Antes (Claude Sonnet 3.7)
   model="claude-3-7-sonnet-20250219"

   # Después (Claude Sonnet 4.5)
   model="claude-sonnet-4-5-20250929"
   ```

2. **Actualiza los parámetros de muestreo**

   <Warning>
   Este es un cambio importante respecto a Claude Sonnet 3.7.
   </Warning>

   Usa solo `temperature` O `top_p`, no ambos:

   ```python
   # Antes (Claude Sonnet 3.7) - Esto causará error en Sonnet 4.5
   response = client.messages.create(
       model="claude-3-7-sonnet-20250219",
       temperature=0.7,
       top_p=0.9,  # No puedes usar ambos
       ...
   )

   # Después (Claude Sonnet 4.5)
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       temperature=0.7,  # Usa temperature O top_p, no ambos
       ...
   )
   ```

3. **Maneja la nueva razón de parada `refusal`**

   Actualiza tu aplicación para [manejar razones de parada `refusal`](/docs/es/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals):

   ```python
   response = client.messages.create(...)

   if response.stop_reason == "refusal":
       # Maneja el rechazo apropiadamente
       pass
   ```

4. **Actualiza la herramienta de editor de texto (si aplica)**

   <Warning>
   Este es un cambio importante respecto a Claude Sonnet 3.7.
   </Warning>

   Actualiza a `text_editor_20250728` (tipo) y `str_replace_based_edit_tool` (nombre). Elimina cualquier código que use el comando `undo_edit`.
   
   ```python
   # Antes (Claude Sonnet 3.7)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # Después (Claude Sonnet 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   Consulta la [documentación de la herramienta de editor de texto](/docs/es/agents-and-tools/tool-use/text-editor-tool) para más detalles.

5. **Actualiza la herramienta de ejecución de código (si aplica)**

   Actualiza a `code_execution_20250825`. La versión heredada `code_execution_20250522` aún funciona pero no se recomienda. Consulta la [documentación de la herramienta de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version) para instrucciones de migración.

6. **Elimina el encabezado beta de uso de herramientas eficiente en tokens**

   El uso de herramientas eficiente en tokens es una característica beta que solo funciona con Claude 3.7 Sonnet. Todos los modelos Claude 4 tienen uso de herramientas eficiente en tokens integrado, por lo que ya no debes incluir el encabezado beta.

   Elimina el [encabezado beta](/docs/es/api/beta-headers) `token-efficient-tools-2025-02-19` de tus solicitudes:

   ```python
   # Antes (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["token-efficient-tools-2025-02-19"],  # Elimina esto
       ...
   )

   # Después (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Sin encabezado beta de herramientas eficientes en tokens
       ...
   )
   ```

7. **Elimina el encabezado beta de salida extendida**

   El [encabezado beta](/docs/es/api/beta-headers) `output-128k-2025-02-19` para salida extendida solo está disponible en Claude Sonnet 3.7.

   Elimina este encabezado de tus solicitudes:

   ```python
   # Antes (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["output-128k-2025-02-19"],  # Elimina esto
       ...
   )

   # Después (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # Sin encabezado beta de salida-128k
       ...
   )
   ```

8. **Actualiza tus indicaciones para cambios de comportamiento**

   Claude Sonnet 4.5 tiene un estilo de comunicación más conciso y directo y requiere dirección explícita. Revisa las [mejores prácticas de ingeniería de indicaciones de Claude 4](/docs/es/build-with-claude/prompt-engineering/claude-4-best-practices) para orientación de optimización.

9. **Considera habilitar el pensamiento extendido para tareas complejas**

   Habilita el [pensamiento extendido](/docs/es/build-with-claude/extended-thinking) para mejoras significativas de rendimiento en tareas de codificación y razonamiento (deshabilitado por defecto):

   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 10000},
       messages=[...]
   )
   ```

   <Note>
   El pensamiento extendido impacta la eficiencia del [almacenamiento en caché de indicaciones](/docs/es/build-with-claude/prompt-caching#caching-with-thinking-blocks).
   </Note>

10. **Prueba tu implementación**

   Prueba en un entorno de desarrollo antes de desplegar en producción para asegurar que todos los cambios importantes se manejan correctamente.

### Lista de verificación de migración de Sonnet 3.7 → 4.5

- [ ] Actualiza el ID del modelo a `claude-sonnet-4-5-20250929`
- [ ] **IMPORTANTE**: Actualiza los parámetros de muestreo para usar solo `temperature` O `top_p`, no ambos
- [ ] Maneja la nueva razón de parada `refusal` en tu aplicación
- [ ] **IMPORTANTE**: Actualiza la herramienta de editor de texto a `text_editor_20250728` y `str_replace_based_edit_tool` (si aplica)
- [ ] **IMPORTANTE**: Elimina cualquier código que use el comando `undo_edit` (si aplica)
- [ ] Actualiza la herramienta de ejecución de código a `code_execution_20250825` (si aplica)
- [ ] Elimina el encabezado beta `token-efficient-tools-2025-02-19` (si aplica)
- [ ] Elimina el encabezado beta `output-128k-2025-02-19` (si aplica)
- [ ] Revisa y actualiza las indicaciones siguiendo las [mejores prácticas de Claude 4](/docs/es/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Considera habilitar el pensamiento extendido para tareas complejas de razonamiento
- [ ] Maneja la razón de parada `model_context_window_exceeded` (específica de Sonnet 4.5)
- [ ] Considera habilitar la herramienta de memoria para agentes de larga duración (beta)
- [ ] Considera usar la limpieza automática de llamadas de herramientas para edición de contexto (beta)
- [ ] Prueba en entorno de desarrollo antes del despliegue en producción

### Características eliminadas de Claude Sonnet 3.7

- **Uso de herramientas eficiente en tokens**: El encabezado beta `token-efficient-tools-2025-02-19` solo funciona con Claude 3.7 Sonnet y no es compatible con modelos Claude 4 (ver paso 6)
- **Salida extendida**: El encabezado beta `output-128k-2025-02-19` no es compatible (ver paso 7)

Ambos encabezados pueden incluirse en solicitudes de Claude 4 pero no tendrán efecto.

## Migración de Claude Haiku 3.5 a Claude Haiku 4.5

Claude Haiku 4.5 es nuestro modelo Haiku más rápido e inteligente con rendimiento cercano a la frontera, ofreciendo calidad de modelo premium con rendimiento en tiempo real para aplicaciones interactivas y procesamiento inteligente de alto volumen. Esta migración incluye varios cambios importantes que requieren actualizaciones en tu implementación.

Para una descripción general completa de las nuevas capacidades, consulta [Novedades en Claude 4.5](/docs/es/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5).

<Note>
Precios de Haiku 4.5: $1 por millón de tokens de entrada, $5 por millón de tokens de salida. Consulta [Precios de Claude](/docs/es/about-claude/pricing) para más detalles.
</Note>

### Pasos de migración

1. **Actualiza el nombre de tu modelo:**
   ```python
   # Antes (Haiku 3.5)
   model="claude-3-5-haiku-20241022"

   # Después (Haiku 4.5)
   model="claude-haiku-4-5-20251001"
   ```

2. **Actualiza las versiones de herramientas (si aplica)**

   <Warning>
   Este es un cambio importante respecto a Claude Haiku 3.5.
   </Warning>

   Haiku 4.5 solo soporta las versiones más recientes de herramientas:

   ```python
   # Antes (Haiku 3.5)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # Después (Haiku 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   - **Editor de texto**: Usa `text_editor_20250728` y `str_replace_based_edit_tool`
   - **Ejecución de código**: Usa `code_execution_20250825`
   - Elimina cualquier código que use el comando `undo_edit`

3. **Actualiza los parámetros de muestreo**

   <Warning>
   Este es un cambio importante respecto a Claude Haiku 3.5.
   </Warning>

   Usa solo `temperature` O `top_p`, no ambos:

   ```python
   # Antes (Haiku 3.5) - Esto causará error en Haiku 4.5
   response = client.messages.create(
       model="claude-3-5-haiku-20241022",
       temperature=0.7,
       top_p=0.9,  # No puedes usar ambos
       ...
   )

   # Después (Haiku 4.5)
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       temperature=0.7,  # Usa temperature O top_p, no ambos
       ...
   )
   ```

4. **Revisa los nuevos límites de velocidad**

   Haiku 4.5 tiene límites de velocidad separados de Haiku 3.5. Consulta la [documentación de límites de velocidad](/docs/es/api/rate-limits) para más detalles.

5. **Maneja la nueva razón de parada `refusal`**

   Actualiza tu aplicación para [manejar razones de parada de rechazo](/docs/es/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals).

6. **Considera habilitar el pensamiento extendido para tareas complejas**

   Habilita el [pensamiento extendido](/docs/es/build-with-claude/extended-thinking) para mejoras significativas de rendimiento en tareas de codificación y razonamiento (deshabilitado por defecto):

   ```python
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 5000},
       messages=[...]
   )
   ```
   <Note>
   El pensamiento extendido impacta la eficiencia del [almacenamiento en caché de indicaciones](/docs/es/build-with-claude/prompt-caching#caching-with-thinking-blocks).
   </Note>

7. **Explora nuevas capacidades**

   Consulta [Novedades en Claude 4.5](/docs/es/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5) para detalles sobre conciencia de contexto, capacidad de salida aumentada (64K tokens), mayor inteligencia y velocidad mejorada.

8. **Prueba tu implementación**

   Prueba en un entorno de desarrollo antes de desplegar en producción para asegurar que todos los cambios importantes se manejan correctamente.

### Lista de verificación de migración de Haiku 3.5 → 4.5

- [ ] Actualiza el ID del modelo a `claude-haiku-4-5-20251001`
- [ ] **IMPORTANTE**: Actualiza las versiones de herramientas a las más recientes (p. ej., `text_editor_20250728`, `code_execution_20250825`) - versiones heredadas no soportadas
- [ ] **IMPORTANTE**: Elimina cualquier código que use el comando `undo_edit` (si aplica)
- [ ] **IMPORTANTE**: Actualiza los parámetros de muestreo para usar solo `temperature` O `top_p`, no ambos
- [ ] Revisa y ajusta para nuevos límites de velocidad (separados de Haiku 3.5)
- [ ] Maneja la nueva razón de parada `refusal` en tu aplicación
- [ ] Considera habilitar el pensamiento extendido para tareas complejas de razonamiento (nueva capacidad)
- [ ] Aprovecha la conciencia de contexto para mejor gestión de tokens en sesiones largas
- [ ] Prepárate para respuestas más grandes (salida máxima aumentada de 8K a 64K tokens)
- [ ] Revisa y actualiza las indicaciones siguiendo las [mejores prácticas de Claude 4](/docs/es/build-with-claude/prompt-engineering/claude-4-best-practices)
- [ ] Prueba en entorno de desarrollo antes del despliegue en producción

## Elegir entre Sonnet 4.5 y Haiku 4.5

Tanto Claude Sonnet 4.5 como Claude Haiku 4.5 son modelos Claude 4 poderosos con diferentes fortalezas:

### Elige Claude Sonnet 4.5 (más inteligente) para:

- **Razonamiento y análisis complejos**: Inteligencia de clase mundial para tareas sofisticadas
- **Agentes autónomos de larga duración**: Rendimiento superior para agentes que trabajan independientemente durante períodos extendidos
- **Tareas avanzadas de codificación**: Nuestro modelo de codificación más fuerte con planificación avanzada e ingeniería de seguridad
- **Flujos de trabajo de contexto grande**: Gestión de contexto mejorada con herramienta de memoria y capacidades de edición de contexto
- **Tareas que requieren capacidad máxima**: Cuando la inteligencia y la precisión son las prioridades principales

### Elige Claude Haiku 4.5 (más rápido e inteligente de Haiku) para:

- **Aplicaciones en tiempo real**: Tiempos de respuesta rápidos para experiencias de usuario interactivas con rendimiento cercano a la frontera
- **Procesamiento inteligente de alto volumen**: Inteligencia rentable a escala con velocidad mejorada
- **Despliegues sensibles al costo**: Rendimiento cercano a la frontera a precios más bajos
- **Arquitecturas de subagenetes**: Agentes rápidos e inteligentes para sistemas multiagente
- **Uso de computadora a escala**: Automatización rentable de escritorio y navegador autónoma
- **Tareas que requieren velocidad**: Cuando la baja latencia es crítica mientras se mantiene inteligencia cercana a la frontera

### Recomendaciones de pensamiento extendido

Los modelos Claude 4, particularmente Sonnet y Haiku 4.5, muestran mejoras significativas de rendimiento cuando se usa el [pensamiento extendido](/docs/es/build-with-claude/extended-thinking) para tareas de codificación y razonamiento complejo. El pensamiento extendido está **deshabilitado por defecto** pero recomendamos habilitarlo para trabajo exigente.

**Importante**: El pensamiento extendido impacta la eficiencia del [almacenamiento en caché de indicaciones](/docs/es/build-with-claude/prompt-caching#caching-with-thinking-blocks). Cuando se agrega contenido que no es resultado de herramienta a una conversación, los bloques de pensamiento se eliminan del caché, lo que puede aumentar costos en conversaciones de múltiples turnos. Recomendamos habilitar el pensamiento cuando los beneficios de rendimiento superan el compromiso de almacenamiento en caché.

## Otros escenarios de migración

Las rutas de migración primarias cubiertas arriba (Sonnet 3.7 → 4.5 y Haiku 3.5 → 4.5) representan las actualizaciones más comunes. Sin embargo, es posible que estés migrando desde otros modelos Claude a Claude 4.5. Esta sección cubre esos escenarios.

### Migración de Claude Sonnet 4 → Sonnet 4.5

**Cambio importante**: No puedes especificar tanto `temperature` como `top_p` en la misma solicitud.

Todas las otras llamadas a la API funcionarán sin modificación. Actualiza tu ID de modelo y ajusta los parámetros de muestreo si es necesario:

```python
# Antes (Claude Sonnet 4)
model="claude-sonnet-4-20250514"

# Después (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

### Migración de Claude Opus 4.1 → Sonnet 4.5

**Sin cambios importantes.** Todas las llamadas a la API funcionarán sin modificación.

Simplemente actualiza tu ID de modelo:

```python
# Antes (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# Después (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

Claude Sonnet 4.5 es nuestro modelo más inteligente con razonamiento de clase mundial, capacidades de codificación y agentes de larga duración. Ofrece rendimiento superior en comparación con Opus 4.1 para la mayoría de casos de uso.

### Migración de Claude Opus 4.1 → Opus 4.5

**Sin cambios importantes.** Todas las llamadas a la API funcionarán sin modificación.

Simplemente actualiza tu ID de modelo:

```python
# Antes (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# Después (Claude Opus 4.5)
model="claude-opus-4-5-20251101"
```

Claude Opus 4.5 es nuestro modelo más inteligente, combinando capacidad máxima con rendimiento práctico. Presenta mejoras de cambio de paso en visión, codificación y uso de computadora a un precio más accesible que Opus 4.1. Ideal para tareas especializadas complejas e ingeniería de software profesional.

<Note>
Para bases de código con muchas referencias de modelo, hay disponible un [complemento de código Claude](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration) para automatizar la migración a Opus 4.5.
</Note>

### Migración entre modelos Claude 4.5

**Sin cambios importantes.** Todas las llamadas a la API funcionarán sin modificación.

Simplemente actualiza tu ID de modelo.

## ¿Necesitas ayuda?

- Consulta nuestra [documentación de API](/docs/es/api/overview) para especificaciones detalladas
- Revisa las [capacidades del modelo](/docs/es/about-claude/models/overview) para comparaciones de rendimiento
- Revisa las [notas de lanzamiento de API](/docs/es/release-notes/api) para actualizaciones de API
- Contacta con soporte si encuentras algún problema durante la migración