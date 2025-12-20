# Plataforma de Desarrolladores de Claude

Actualizaciones de la Plataforma de Desarrolladores de Claude, incluyendo la API de Claude, SDKs de cliente y la Consola de Claude.

---

<Tip>
Para notas de lanzamiento sobre Claude Apps, consulta las [Notas de lanzamiento para Claude Apps en el Centro de Ayuda de Claude](https://support.claude.com/en/articles/12138966-release-notes).

Para actualizaciones de Claude Code, consulta el [CHANGELOG.md completo](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) en el repositorio `claude-code`.
</Tip>

### 4 de diciembre de 2025
- [Salidas estructuradas](/docs/es/build-with-claude/structured-outputs) ahora es compatible con Claude Haiku 4.5.

### 24 de noviembre de 2025
- Hemos lanzado [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5), nuestro modelo más inteligente que combina la máxima capacidad con un rendimiento práctico. Ideal para tareas especializadas complejas, ingeniería de software profesional y agentes avanzados. Presenta mejoras de cambio de paso en visión, codificación y uso de computadora a un precio más accesible que los modelos Opus anteriores. Obtén más información en nuestra [documentación de Modelos y Precios](/docs/es/about-claude/models).
- Hemos lanzado [llamadas de herramientas programáticas](/docs/es/agents-and-tools/tool-use/programmatic-tool-calling) en beta pública, permitiendo que Claude llame herramientas desde dentro de la ejecución de código para reducir la latencia y el uso de tokens en flujos de trabajo de múltiples herramientas.
- Hemos lanzado la [herramienta de búsqueda de herramientas](/docs/es/agents-and-tools/tool-use/tool-search-tool) en beta pública, permitiendo que Claude descubra y cargue dinámicamente herramientas bajo demanda desde catálogos de herramientas grandes.
- Hemos lanzado el [parámetro de esfuerzo](/docs/es/build-with-claude/effort) en beta pública para Claude Opus 4.5, permitiéndote controlar el uso de tokens intercambiando entre la minuciosidad de la respuesta y la eficiencia.
- Hemos añadido [compactación del lado del cliente](/docs/es/build-with-claude/context-editing#client-side-compaction-sdk) a nuestros SDKs de Python y TypeScript, gestionando automáticamente el contexto de la conversación mediante resumen cuando se usa `tool_runner`.

### 21 de noviembre de 2025
- Los bloques de contenido de resultados de búsqueda ahora están generalmente disponibles en Amazon Bedrock. Obtén más información en nuestra [documentación de resultados de búsqueda](/docs/es/build-with-claude/search-results).

### 19 de noviembre de 2025
- Hemos lanzado una **nueva plataforma de documentación** en [platform.claude.com/docs](https://platform.claude.com/docs). Nuestra documentación ahora vive lado a lado con la Consola de Claude, proporcionando una experiencia de desarrollador unificada. El sitio de documentación anterior en docs.claude.com redirigirá a la nueva ubicación.

### 18 de noviembre de 2025
- Hemos lanzado **Claude en Microsoft Foundry**, llevando modelos de Claude a clientes de Azure con facturación de Azure y autenticación OAuth. Accede a la API de Mensajes completa incluyendo pensamiento extendido, almacenamiento en caché de indicaciones (5 minutos y 1 hora), soporte de PDF, API de Archivos, Habilidades de Agente y uso de herramientas. Obtén más información en nuestra [documentación de Microsoft Foundry](/docs/es/build-with-claude/claude-in-microsoft-foundry).

### 14 de noviembre de 2025
- Hemos lanzado [salidas estructuradas](/docs/es/build-with-claude/structured-outputs) en beta pública, proporcionando conformidad de esquema garantizada para las respuestas de Claude. Usa salidas JSON para respuestas de datos estructurados o uso de herramientas estricto para entradas de herramientas validadas. Disponible para Claude Sonnet 4.5 y Claude Opus 4.1. Para habilitar, usa el encabezado beta `structured-outputs-2025-11-13`.

### 28 de octubre de 2025
- Anunciamos la depreciación del modelo Claude Sonnet 3.7. Lee más en [nuestra documentación](/docs/es/about-claude/model-deprecations).
- Hemos retirado los modelos Claude Sonnet 3.5. Todas las solicitudes a estos modelos ahora devolverán un error.
- Hemos expandido la edición de contexto con limpieza de bloques de pensamiento (`clear_thinking_20251015`), permitiendo la gestión automática de bloques de pensamiento. Obtén más información en nuestra [documentación de edición de contexto](/docs/es/build-with-claude/context-editing).

### 16 de octubre de 2025
- Hemos lanzado [Habilidades de Agente](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (`skills-2025-10-02` beta), una nueva forma de extender las capacidades de Claude. Las Habilidades son carpetas organizadas de instrucciones, scripts y recursos que Claude carga dinámicamente para realizar tareas especializadas. El lanzamiento inicial incluye:
  - **Habilidades Gestionadas por Anthropic**: Habilidades precompiladas para trabajar con archivos PowerPoint (.pptx), Excel (.xlsx), Word (.docx) y PDF
  - **Habilidades Personalizadas**: Carga tus propias Habilidades a través de la API de Habilidades (puntos finales `/v1/skills`) para empaquetar experiencia de dominio y flujos de trabajo organizacionales
  - Las Habilidades requieren que la [herramienta de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool) esté habilitada
  - Obtén más información en nuestra [documentación de Habilidades de Agente](/docs/es/agents-and-tools/agent-skills/overview) y [referencia de API](/docs/es/api/skills/create-skill)

### 15 de octubre de 2025
- Hemos lanzado [Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5), nuestro modelo Haiku más rápido e inteligente con rendimiento casi de frontera. Ideal para aplicaciones en tiempo real, procesamiento de alto volumen e implementaciones sensibles a costos que requieren razonamiento fuerte. Obtén más información en nuestra [documentación de Modelos y Precios](/docs/es/about-claude/models).

### 29 de septiembre de 2025
- Hemos lanzado [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5), nuestro mejor modelo para agentes complejos y codificación, con la inteligencia más alta en la mayoría de tareas. Obtén más información en [Novedades en Claude 4.5](/docs/es/about-claude/models/whats-new-claude-4-5).
- Hemos introducido [precios de punto final global](/docs/es/about-claude/pricing#third-party-platform-pricing) para AWS Bedrock y Google Vertex AI. Los precios de la API de Claude (1P) no se ven afectados.
- Hemos introducido una nueva razón de parada `model_context_window_exceeded` que te permite solicitar el máximo de tokens posible sin calcular el tamaño de entrada. Obtén más información en nuestra [documentación de manejo de razones de parada](/docs/es/build-with-claude/handling-stop-reasons).
- Hemos lanzado la herramienta de memoria en beta, permitiendo que Claude almacene y consulte información en conversaciones. Obtén más información en nuestra [documentación de herramienta de memoria](/docs/es/agents-and-tools/tool-use/memory-tool).
- Hemos lanzado edición de contexto en beta, proporcionando estrategias para gestionar automáticamente el contexto de la conversación. El lanzamiento inicial admite la limpieza de resultados y llamadas de herramientas más antiguas cuando se acerca a los límites de tokens. Obtén más información en nuestra [documentación de edición de contexto](/docs/es/build-with-claude/context-editing).

### 17 de septiembre de 2025
- Hemos lanzado ayudantes de herramientas en beta para los SDKs de Python y TypeScript, simplificando la creación y ejecución de herramientas con validación de entrada segura de tipos y un ejecutor de herramientas para manejo automatizado de herramientas en conversaciones. Para obtener detalles, consulta la documentación para [el SDK de Python](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md) y [el SDK de TypeScript](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers).

### 16 de septiembre de 2025
- Hemos unificado nuestras ofertas de desarrolladores bajo la marca Claude. Deberías ver nombres y URLs actualizados en toda nuestra plataforma y documentación, pero **nuestras interfaces de desarrollador permanecerán igual**. Aquí hay algunos cambios notables:
  - Consola de Anthropic ([console.anthropic.com](https://console.anthropic.com)) → Consola de Claude ([platform.claude.com](https://platform.claude.com)). La consola estará disponible en ambas URLs hasta el 16 de diciembre de 2025. Después de esa fecha, [console.anthropic.com](https://console.anthropic.com) redirigirá automáticamente a [platform.claude.com](https://platform.claude.com).
  - Documentación de Anthropic ([docs.claude.com](https://docs.claude.com)) → Documentación de Claude ([docs.claude.com](https://docs.claude.com))
  - Centro de Ayuda de Anthropic ([support.claude.com](https://support.claude.com)) → Centro de Ayuda de Claude ([support.claude.com](https://support.claude.com))
  - Los puntos finales de API, encabezados, variables de entorno y SDKs permanecen igual. Tus integraciones existentes continuarán funcionando sin cambios.

### 10 de septiembre de 2025
- Hemos lanzado la herramienta de búsqueda web en beta, permitiendo que Claude recupere contenido completo de páginas web especificadas y documentos PDF. Obtén más información en nuestra [documentación de herramienta de búsqueda web](/docs/es/agents-and-tools/tool-use/web-fetch-tool).
- Hemos lanzado la [API de Análisis de Claude Code](/docs/es/build-with-claude/claude-code-analytics-api), permitiendo que las organizaciones accedan programáticamente a métricas de uso diarias agregadas para Claude Code, incluyendo métricas de productividad, estadísticas de uso de herramientas y datos de costos.

### 8 de septiembre de 2025
- Lanzamos una versión beta del [SDK de C#](https://github.com/anthropics/anthropic-sdk-csharp).

### 5 de septiembre de 2025
- Hemos lanzado [gráficos de límite de velocidad](/docs/es/api/rate-limits#monitoring-your-rate-limits-in-the-console) en la página [Uso](https://console.anthropic.com/settings/usage) de la Consola, permitiéndote monitorear tu uso de límite de velocidad de API y tasas de almacenamiento en caché a lo largo del tiempo.

### 3 de septiembre de 2025
- Hemos lanzado soporte para documentos citables en resultados de herramientas del lado del cliente. Obtén más información en nuestra [documentación de uso de herramientas](/docs/es/agents-and-tools/tool-use/implement-tool-use).

### 2 de septiembre de 2025
- Hemos lanzado v2 de la [Herramienta de Ejecución de Código](/docs/es/agents-and-tools/tool-use/code-execution-tool) en beta pública, reemplazando la herramienta original solo de Python con ejecución de comandos Bash y capacidades de manipulación directa de archivos, incluyendo escritura de código en otros lenguajes.

### 27 de agosto de 2025
- Lanzamos una versión beta del [SDK de PHP](https://github.com/anthropics/anthropic-sdk-php).

### 26 de agosto de 2025
- Hemos aumentado los límites de velocidad en la [ventana de contexto de 1M de tokens](/docs/es/build-with-claude/context-windows#1m-token-context-window) para Claude Sonnet 4 en la API de Claude. Para más información, consulta [Límites de velocidad de contexto largo](/docs/es/api/rate-limits#long-context-rate-limits).
- La ventana de contexto de 1m de tokens ahora está disponible en Vertex AI de Google Cloud. Para más información, consulta [Claude en Vertex AI](/docs/es/build-with-claude/claude-on-vertex-ai).

### 19 de agosto de 2025
- Los IDs de solicitud ahora se incluyen directamente en los cuerpos de respuesta de error junto con el encabezado `request-id` existente. Obtén más información en nuestra [documentación de errores](/docs/es/api/errors#error-shapes).

### 18 de agosto de 2025
- Hemos lanzado la [API de Uso y Costo](/docs/es/build-with-claude/usage-cost-api), permitiendo que los administradores monitoreen programáticamente los datos de uso y costo de su organización.
- Hemos añadido un nuevo punto final a la API de Administración para recuperar información de la organización. Para obtener detalles, consulta la [referencia de API de Administración de Información de Organización](/docs/es/api/admin-api/organization/get-me).

### 13 de agosto de 2025
- Anunciamos la depreciación de los modelos Claude Sonnet 3.5 (`claude-3-5-sonnet-20240620` y `claude-3-5-sonnet-20241022`). Estos modelos se retirarán el 28 de octubre de 2025. Recomendamos migrar a Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) para mejorar el rendimiento y las capacidades. Lee más en la [documentación de depreciaciones de modelos](/docs/es/about-claude/model-deprecations).
- La duración de caché de 1 hora para almacenamiento en caché de indicaciones ahora está generalmente disponible. Ahora puedes usar el TTL de caché extendido sin un encabezado beta. Obtén más información en nuestra [documentación de almacenamiento en caché de indicaciones](/docs/es/build-with-claude/prompt-caching#1-hour-cache-duration).

### 12 de agosto de 2025
- Hemos lanzado soporte beta para una [ventana de contexto de 1M de tokens](/docs/es/build-with-claude/context-windows#1m-token-context-window) en Claude Sonnet 4 en la API de Claude y Amazon Bedrock.

### 11 de agosto de 2025
- Algunos clientes podrían encontrar errores 429 (`rate_limit_error`) [errores](/docs/es/api/errors) después de un aumento agudo en el uso de la API debido a límites de aceleración en la API. Anteriormente, los errores 529 (`overloaded_error`) ocurrirían en escenarios similares.

### 8 de agosto de 2025
- Los bloques de contenido de resultados de búsqueda ahora están generalmente disponibles en la API de Claude y en Vertex AI de Google Cloud. Esta característica permite citas naturales para aplicaciones RAG con atribución de fuente adecuada. El encabezado beta `search-results-2025-06-09` ya no es necesario. Obtén más información en nuestra [documentación de resultados de búsqueda](/docs/es/build-with-claude/search-results).

### 5 de agosto de 2025
- Hemos lanzado [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1), una actualización incremental a Claude Opus 4 con capacidades mejoradas y mejoras de rendimiento.<sup>*</sup> Obtén más información en nuestra [documentación de Modelos y Precios](/docs/es/about-claude/models).

_<sup>* - Opus 4.1 no permite que se especifiquen ambos parámetros `temperature` y `top_p`. Por favor usa solo uno. </sup>_

### 28 de julio de 2025
- Hemos lanzado `text_editor_20250728`, una herramienta de editor de texto actualizada que corrige algunos problemas de las versiones anteriores y añade un parámetro `max_characters` opcional que te permite controlar la longitud de truncamiento al ver archivos grandes.

### 24 de julio de 2025
- Hemos aumentado los [límites de velocidad](/docs/es/api/rate-limits) para Claude Opus 4 en la API de Claude para darte más capacidad para construir y escalar con Claude. Para clientes con [límites de velocidad de nivel de uso 1-4](/docs/es/api/rate-limits#rate-limits), estos cambios se aplican inmediatamente a tu cuenta - no se requiere acción.

### 21 de julio de 2025
- Hemos retirado los modelos Claude 2.0, Claude 2.1 y Claude Sonnet 3. Todas las solicitudes a estos modelos ahora devolverán un error. Lee más en [nuestra documentación](/docs/es/about-claude/model-deprecations).

### 17 de julio de 2025
- Hemos aumentado los [límites de velocidad](/docs/es/api/rate-limits) para Claude Sonnet 4 en la API de Claude para darte más capacidad para construir y escalar con Claude. Para clientes con [límites de velocidad de nivel de uso 1-4](/docs/es/api/rate-limits#rate-limits), estos cambios se aplican inmediatamente a tu cuenta - no se requiere acción.

### 3 de julio de 2025
- Hemos lanzado bloques de contenido de resultados de búsqueda en beta, permitiendo citas naturales para aplicaciones RAG. Las herramientas ahora pueden devolver resultados de búsqueda con atribución de fuente adecuada, y Claude citará automáticamente estas fuentes en sus respuestas - igualando la calidad de cita de búsqueda web. Esto elimina la necesidad de soluciones alternativas de documentos en aplicaciones de base de conocimiento personalizada. Obtén más información en nuestra [documentación de resultados de búsqueda](/docs/es/build-with-claude/search-results). Para habilitar esta característica, usa el encabezado beta `search-results-2025-06-09`.

### 30 de junio de 2025
- Anunciamos la depreciación del modelo Claude Opus 3. Lee más en [nuestra documentación](/docs/es/about-claude/model-deprecations).

### 23 de junio de 2025
- Los usuarios de la Consola con el rol de Desarrollador ahora pueden acceder a la página [Costo](https://console.anthropic.com/settings/cost). Anteriormente, el rol de Desarrollador permitía acceso a la página [Uso](https://console.anthropic.com/settings/usage), pero no a la página de Costo.

### 11 de junio de 2025
- Hemos lanzado [transmisión de herramientas de grano fino](/docs/es/agents-and-tools/tool-use/fine-grained-tool-streaming) en beta pública, una característica que permite que Claude transmita parámetros de uso de herramientas sin almacenamiento en búfer / validación JSON. Para habilitar la transmisión de herramientas de grano fino, usa el [encabezado beta](/docs/es/api/beta-headers) `fine-grained-tool-streaming-2025-05-14`.

### 22 de mayo de 2025
- Hemos lanzado [Claude Opus 4 y Claude Sonnet 4](http://www.anthropic.com/news/claude-4), nuestros últimos modelos con capacidades de pensamiento extendido. Obtén más información en nuestra [documentación de Modelos y Precios](/docs/es/about-claude/models).
- El comportamiento predeterminado del [pensamiento extendido](/docs/es/build-with-claude/extended-thinking) en modelos Claude 4 devuelve un resumen del proceso de pensamiento completo de Claude, con el pensamiento completo encriptado y devuelto en el campo `signature` de la salida del bloque `thinking`.
- Hemos lanzado [pensamiento intercalado](/docs/es/build-with-claude/extended-thinking#interleaved-thinking) en beta pública, una característica que permite que Claude piense entre llamadas de herramientas. Para habilitar el pensamiento intercalado, usa el [encabezado beta](/docs/es/api/beta-headers) `interleaved-thinking-2025-05-14`.
- Hemos lanzado la [API de Archivos](/docs/es/build-with-claude/files) en beta pública, permitiéndote cargar archivos y referenciarlos en la API de Mensajes y la herramienta de ejecución de código.
- Hemos lanzado la [herramienta de ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool) en beta pública, una herramienta que permite que Claude ejecute código Python en un entorno seguro y aislado.
- Hemos lanzado el [conector MCP](/docs/es/agents-and-tools/mcp-connector) en beta pública, una característica que te permite conectarte a servidores MCP remotos directamente desde la API de Mensajes. 
- Para aumentar la calidad de respuesta y disminuir errores de herramientas, hemos cambiado el valor predeterminado del parámetro `top_p` [muestreo de núcleo](https://en.wikipedia.org/wiki/Top-p_sampling) en la API de Mensajes de 0.999 a 0.99 para todos los modelos. Para revertir este cambio, establece `top_p` a 0.999. 
    Además, cuando el pensamiento extendido está habilitado, ahora puedes establecer `top_p` a valores entre 0.95 y 1.
- Hemos movido nuestro [SDK de Go](https://github.com/anthropics/anthropic-sdk-go) de beta a GA.
- Hemos incluido granularidad a nivel de minuto y hora en la página [Uso](https://console.anthropic.com/settings/usage) de la Consola junto con tasas de error 429 en la página de Uso.

### 21 de mayo de 2025
- Hemos movido nuestro [SDK de Ruby](https://github.com/anthropics/anthropic-sdk-ruby) de beta a GA.

### 7 de mayo de 2025
- Hemos lanzado una herramienta de búsqueda web en la API, permitiendo que Claude acceda a información actualizada de la web. Obtén más información en nuestra [documentación de herramienta de búsqueda web](/docs/es/agents-and-tools/tool-use/web-search-tool).

### 1 de mayo de 2025
- El control de caché ahora debe especificarse directamente en el bloque `content` padre de `tool_result` y `document.source`. Para compatibilidad hacia atrás, si se detecta control de caché en el último bloque en `tool_result.content` o `document.source.content`, se aplicará automáticamente al bloque padre en su lugar. El control de caché en cualquier otro bloque dentro de `tool_result.content` y `document.source.content` resultará en un error de validación.

### 9 de abril de 2025
- Lanzamos una versión beta del [SDK de Ruby](https://github.com/anthropics/anthropic-sdk-ruby)

### 31 de marzo de 2025
- Hemos movido nuestro [SDK de Java](https://github.com/anthropics/anthropic-sdk-java) de beta a GA.
- Hemos movido nuestro [SDK de Go](https://github.com/anthropics/anthropic-sdk-go) de alfa a beta.

### 27 de febrero de 2025
- Hemos añadido bloques de fuente de URL para imágenes y PDFs en la API de Mensajes. Ahora puedes referenciar imágenes y PDFs directamente a través de URL en lugar de tener que codificarlos en base64. Obtén más información en nuestra [documentación de visión](/docs/es/build-with-claude/vision) y [documentación de soporte de PDF](/docs/es/build-with-claude/pdf-support).
- Hemos añadido soporte para una opción `none` al parámetro `tool_choice` en la API de Mensajes que previene que Claude llame a cualquier herramienta. Además, ya no se requiere que proporciones ninguna `tools` cuando incluyas bloques `tool_use` y `tool_result`.
- Hemos lanzado un punto final de API compatible con OpenAI, permitiéndote probar modelos de Claude cambiando solo tu clave de API, URL base y nombre de modelo en integraciones existentes de OpenAI. Esta capa de compatibilidad admite funcionalidad de completaciones de chat principal. Obtén más información en nuestra [documentación de compatibilidad del SDK de OpenAI](/docs/es/api/openai-sdk).

### 24 de febrero de 2025
- Hemos lanzado [Claude Sonnet 3.7](http://www.anthropic.com/news/claude-3-7-sonnet), nuestro modelo más inteligente hasta ahora. Claude Sonnet 3.7 puede producir respuestas casi instantáneas o mostrar su pensamiento extendido paso a paso. Un modelo, dos formas de pensar. Obtén más información sobre todos los modelos de Claude en nuestra [documentación de Modelos y Precios](/docs/es/about-claude/models).
- Hemos añadido soporte de visión a Claude Haiku 3.5, permitiendo que el modelo analice y entienda imágenes.
- Hemos lanzado una implementación de uso de herramientas eficiente en tokens, mejorando el rendimiento general cuando se usan herramientas con Claude. Obtén más información en nuestra [documentación de uso de herramientas](/docs/es/agents-and-tools/tool-use/overview).
- Hemos cambiado la temperatura predeterminada en la [Consola](https://console.anthropic.com/workbench) para nuevos indicadores de 0 a 1 para consistencia con la temperatura predeterminada en la API. Los indicadores guardados existentes no cambian.
- Hemos lanzado versiones actualizadas de nuestras herramientas que desacoplan las herramientas de edición de texto y bash del indicador del sistema de uso de computadora:
  - `bash_20250124`: Misma funcionalidad que la versión anterior pero es independiente del uso de computadora. No requiere un encabezado beta.
  - `text_editor_20250124`: Misma funcionalidad que la versión anterior pero es independiente del uso de computadora. No requiere un encabezado beta.
  - `computer_20250124`: Herramienta de uso de computadora actualizada con nuevas opciones de comando incluyendo "hold_key", "left_mouse_down", "left_mouse_up", "scroll", "triple_click" y "wait". Esta herramienta requiere el encabezado anthropic-beta "computer-use-2025-01-24".
  Obtén más información en nuestra [documentación de uso de herramientas](/docs/es/agents-and-tools/tool-use/overview).

### 10 de febrero de 2025
- Hemos añadido el encabezado de respuesta `anthropic-organization-id` a todas las respuestas de API. Este encabezado proporciona el ID de organización asociado con la clave de API utilizada en la solicitud.

### 31 de enero de 2025

- Hemos movido nuestro [SDK de Java](https://github.com/anthropics/anthropic-sdk-java) de alfa a beta.

### 23 de enero de 2025

- Hemos lanzado capacidad de citas en la API, permitiendo que Claude proporcione atribución de fuente para información. Obtén más información en nuestra [documentación de citas](/docs/es/build-with-claude/citations).
- Hemos añadido soporte para documentos de texto plano y documentos de contenido personalizado en la API de Mensajes.

### 21 de enero de 2025

- Anunciamos la depreciación de los modelos Claude 2, Claude 2.1 y Claude Sonnet 3. Lee más en [nuestra documentación](/docs/es/about-claude/model-deprecations).

### 15 de enero de 2025

- Hemos actualizado el [almacenamiento en caché de indicaciones](/docs/es/build-with-claude/prompt-caching) para ser más fácil de usar. Ahora, cuando estableces un punto de ruptura de caché, leeremos automáticamente desde tu prefijo previamente almacenado en caché más largo.
- Ahora puedes poner palabras en la boca de Claude cuando usas herramientas.

### 10 de enero de 2025

- Hemos optimizado el soporte para [almacenamiento en caché de indicaciones en la API de Lotes de Mensajes](/docs/es/build-with-claude/batch-processing#using-prompt-caching-with-message-batches) para mejorar la tasa de acierto de caché.

### 19 de diciembre de 2024

- Hemos añadido soporte para un [punto final de eliminación](/docs/es/api/deleting-message-batches) en la API de Lotes de Mensajes

### 17 de diciembre de 2024
Las siguientes características ahora están generalmente disponibles en la API de Claude:

- [API de Modelos](/docs/es/api/models-list): Consulta modelos disponibles, valida IDs de modelo y resuelve [alias de modelo](/docs/es/about-claude/models#model-names) a sus IDs de modelo canónicos.
- [API de Lotes de Mensajes](/docs/es/build-with-claude/batch-processing): Procesa lotes grandes de mensajes de forma asincrónica al 50% del costo estándar de la API.
- [API de Conteo de Tokens](/docs/es/build-with-claude/token-counting): Calcula conteos de tokens para Mensajes antes de enviarlos a Claude.
- [Almacenamiento en Caché de Indicaciones](/docs/es/build-with-claude/prompt-caching): Reduce costos hasta un 90% y latencia hasta un 80% almacenando en caché y reutilizando contenido de indicaciones.
- [Soporte de PDF](/docs/es/build-with-claude/pdf-support): Procesa PDFs para analizar contenido textual y visual dentro de documentos.

También lanzamos nuevos SDKs oficiales:
- [SDK de Java](https://github.com/anthropics/anthropic-sdk-java) (alfa)
- [SDK de Go](https://github.com/anthropics/anthropic-sdk-go) (alfa)

### 4 de diciembre de 2024

- Hemos añadido la capacidad de agrupar por clave de API a las páginas [Uso](https://console.anthropic.com/settings/usage) y [Costo](https://console.anthropic.com/settings/cost) de la [Consola de Desarrollador](https://console.anthropic.com)
- Hemos añadido dos nuevas columnas **Último uso** y **Costo** y la capacidad de ordenar por cualquier columna en la página [claves de API](https://console.anthropic.com/settings/keys) de la [Consola de Desarrollador](https://console.anthropic.com)

### 21 de noviembre de 2024

- Hemos lanzado la [API de Administración](/docs/es/build-with-claude/administration-api), permitiendo a los usuarios gestionar programáticamente los recursos de su organización.

### 20 de noviembre de 2024

- Hemos actualizado nuestros límites de velocidad para la API de Mensajes. Hemos reemplazado el límite de velocidad de tokens por minuto con nuevos límites de velocidad de tokens de entrada y salida por minuto. Lee más en nuestra [documentación](/docs/es/api/rate-limits).
- Hemos añadido soporte para [uso de herramientas](/docs/es/agents-and-tools/tool-use/overview) en el [Workbench](https://console.anthropic.com/workbench).

### 13 de noviembre de 2024

- Hemos añadido soporte de PDF para todos los modelos Claude Sonnet 3.5. Lee más en nuestra [documentación](/docs/es/build-with-claude/pdf-support).

### 6 de noviembre de 2024

- Hemos retirado los modelos Claude 1 e Instant. Lee más en [nuestra documentación](/docs/es/about-claude/model-deprecations).

### 4 de noviembre de 2024

- [Claude Haiku 3.5](https://www.anthropic.com/claude/haiku) ahora está disponible en la API de Claude como un modelo de solo texto.

### 1 de noviembre de 2024

- Hemos añadido soporte de PDF para usar con el nuevo Claude Sonnet 3.5. Lee más en nuestra [documentación](/docs/es/build-with-claude/pdf-support).
- También hemos añadido conteo de tokens, que te permite determinar el número total de tokens en un Mensaje, antes de enviarlo a Claude. Lee más en nuestra [documentación](/docs/es/build-with-claude/token-counting).

### 22 de octubre de 2024

- Hemos añadido herramientas de uso de computadora definidas por Anthropic a nuestra API para usar con el nuevo Claude Sonnet 3.5. Lee más en nuestra [documentación](/docs/es/agents-and-tools/tool-use/computer-use-tool).
- Claude Sonnet 3.5, nuestro modelo más inteligente hasta ahora, acaba de recibir una actualización y ahora está disponible en la API de Claude. Lee más [aquí](https://www.anthropic.com/claude/sonnet).

### 8 de octubre de 2024

- La API de Lotes de Mensajes ahora está disponible en beta. Procesa lotes grandes de consultas de forma asincrónica en la API de Claude al 50% menos de costo. Lee más en nuestra [documentación](/docs/es/build-with-claude/batch-processing).
- Hemos aflojado las restricciones en el orden de los turnos `user`/`assistant` en nuestra API de Mensajes. Los mensajes `user`/`assistant` consecutivos se combinarán en un solo mensaje en lugar de generar un error, y ya no requerimos que el primer mensaje de entrada sea un mensaje `user`.
- Hemos depreciado los planes Build y Scale a favor de un conjunto de características estándar (anteriormente denominado Build), junto con características adicionales que están disponibles a través de ventas. Lee más [aquí](https://claude.com/platform/api).

### 3 de octubre de 2024

- Hemos añadido la capacidad de deshabilitar el uso paralelo de herramientas en la API. Establece `disable_parallel_tool_use: true` en el campo `tool_choice` para asegurar que Claude usa como máximo una herramienta. Lee más en nuestra [documentación](/docs/es/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use).

### 10 de septiembre de 2024

- Hemos añadido Espacios de Trabajo a la [Consola de Desarrollador](https://console.anthropic.com). Los Espacios de Trabajo te permiten establecer límites de gasto o velocidad personalizados, agrupar claves de API, rastrear uso por proyecto y controlar el acceso con roles de usuario. Lee más en nuestro [publicación de blog](https://www.anthropic.com/news/workspaces).

### 4 de septiembre de 2024

- Anunciamos la depreciación de los modelos Claude 1. Lee más en [nuestra documentación](/docs/es/about-claude/model-deprecations).

### 22 de agosto de 2024

- Hemos añadido soporte para el uso del SDK en navegadores devolviendo encabezados CORS en las respuestas de API. Establece `dangerouslyAllowBrowser: true` en la instanciación del SDK para habilitar esta característica.

### 19 de agosto de 2024

- Hemos movido salidas de 8,192 tokens de beta a disponibilidad general para Claude Sonnet 3.5.

### 14 de agosto de 2024

- El [almacenamiento en caché de indicaciones](/docs/es/build-with-claude/prompt-caching) ahora está disponible como una característica beta en la API de Claude. Almacena en caché y reutiliza indicaciones para reducir la latencia hasta un 80% y costos hasta un 90%.

### 15 de julio de 2024

- Genera salidas de hasta 8,192 tokens de longitud desde Claude Sonnet 3.5 con el nuevo encabezado `anthropic-beta: max-tokens-3-5-sonnet-2024-07-15`.

### 9 de julio de 2024

- Genera automáticamente casos de prueba para tus indicadores usando Claude en la [Consola de Desarrollador](https://console.anthropic.com).
- Compara las salidas de diferentes indicadores lado a lado en el nuevo modo de comparación de salida en la [Consola de Desarrollador](https://console.anthropic.com).

### 27 de junio de 2024

- Ve el uso de API y facturación desglosados por cantidad en dólares, conteo de tokens y claves de API en las nuevas pestañas [Uso](https://console.anthropic.com/settings/usage) y [Costo](https://console.anthropic.com/settings/cost) en la [Consola de Desarrollador](https://console.anthropic.com).
- Ve tus límites de velocidad de API actuales en la nueva pestaña [Límites de Velocidad](https://console.anthropic.com/settings/limits) en la [Consola de Desarrollador](https://console.anthropic.com).

### 20 de junio de 2024

- [Claude Sonnet 3.5](http://anthropic.com/news/claude-3-5-sonnet), nuestro modelo más inteligente hasta ahora, ahora está generalmente disponible en la API de Claude, Amazon Bedrock y Google Vertex AI.

### 30 de mayo de 2024

- El [uso de herramientas](/docs/es/agents-and-tools/tool-use/overview) ahora está generalmente disponible en la API de Claude, Amazon Bedrock y Google Vertex AI.

### 10 de mayo de 2024

- Nuestra herramienta de generador de indicadores ahora está disponible en la [Consola de Desarrollador](https://console.anthropic.com). El Generador de Indicadores facilita guiar a Claude para generar indicadores de alta calidad adaptados a tus tareas específicas. Lee más en nuestra [publicación de blog](https://www.anthropic.com/news/prompt-generator).