# Descripción general de características

Explora las características y capacidades avanzadas de Claude.

---

## Capacidades principales

Estas características mejoran las habilidades fundamentales de Claude para procesar, analizar y generar contenido en varios formatos y casos de uso.

| Característica | Descripción | Disponibilidad |
|---------|-------------|--------------|
| [Ventana de contexto de 1M de tokens](/docs/es/build-with-claude/context-windows#1m-token-context-window) | Una ventana de contexto extendida que te permite procesar documentos mucho más grandes, mantener conversaciones más largas y trabajar con bases de código más extensas. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Agent Skills](/docs/es/agents-and-tools/agent-skills/overview) | Amplía las capacidades de Claude con Skills. Utiliza Skills precompiladas (PowerPoint, Excel, Word, PDF) o crea Skills personalizadas con instrucciones y scripts. Los Skills utilizan divulgación progresiva para gestionar eficientemente el contexto. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Procesamiento por lotes](/docs/es/build-with-claude/batch-processing) | Procesa grandes volúmenes de solicitudes de forma asincrónica para ahorrar costos. Envía lotes con un gran número de consultas por lote. Las llamadas a la API de lotes cuestan un 50% menos que las llamadas a la API estándar. | <PlatformAvailability claudeApi bedrock vertexAi /> |
| [Citas](/docs/es/build-with-claude/citations) | Fundamenta las respuestas de Claude en documentos fuente. Con Citas, Claude puede proporcionar referencias detalladas a las oraciones y pasajes exactos que utiliza para generar respuestas, lo que lleva a resultados más verificables y confiables. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Edición de contexto](/docs/es/build-with-claude/context-editing) | Gestiona automáticamente el contexto de la conversación con estrategias configurables. Admite la limpieza de resultados de herramientas cuando se acerca a los límites de tokens y la gestión de bloques de pensamiento en conversaciones de pensamiento extendido. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Esfuerzo](/docs/es/build-with-claude/effort) | Controla cuántos tokens utiliza Claude al responder con el parámetro de esfuerzo, equilibrando entre la exhaustividad de la respuesta y la eficiencia de tokens. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Pensamiento extendido](/docs/es/build-with-claude/extended-thinking) | Capacidades de razonamiento mejoradas para tareas complejas, proporcionando transparencia en el proceso de pensamiento paso a paso de Claude antes de entregar su respuesta final. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [API de archivos](/docs/es/build-with-claude/files) | Carga y gestiona archivos para usar con Claude sin necesidad de volver a cargar contenido con cada solicitud. Admite archivos PDF, imágenes y archivos de texto. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Soporte de PDF](/docs/es/build-with-claude/pdf-support) | Procesa y analiza contenido de texto y visual de documentos PDF. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Almacenamiento en caché de prompts (5m)](/docs/es/build-with-claude/prompt-caching) | Proporciona a Claude más conocimiento de fondo y ejemplos de salida para reducir costos y latencia. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Almacenamiento en caché de prompts (1hr)](/docs/es/build-with-claude/prompt-caching#1-hour-cache-duration) | Duración de caché extendida de 1 hora para contexto menos frecuentemente accedido pero importante, complementando el caché estándar de 5 minutos. | <PlatformAvailability claudeApi azureAi /> |
| [Resultados de búsqueda](/docs/es/build-with-claude/search-results) | Habilita citas naturales para aplicaciones RAG proporcionando resultados de búsqueda con atribución de fuente adecuada. Logra citas de calidad de búsqueda web para bases de conocimiento personalizadas y herramientas. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Salidas estructuradas](/docs/es/build-with-claude/structured-outputs) | Garantiza conformidad de esquema con dos enfoques: salidas JSON para respuestas de datos estructurados y uso estricto de herramientas para entradas de herramientas validadas. Disponible en Sonnet 4.5, Opus 4.1, Opus 4.5 y Haiku 4.5. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Conteo de tokens](/docs/es/api/messages-count-tokens) | El conteo de tokens te permite determinar el número de tokens en un mensaje antes de enviarlo a Claude, ayudándote a tomar decisiones informadas sobre tus prompts y uso. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Uso de herramientas](/docs/es/agents-and-tools/tool-use/overview) | Habilita a Claude para interactuar con herramientas y APIs externas para realizar una variedad más amplia de tareas. Para una lista de herramientas compatibles, consulta [la tabla de Herramientas](#tools). | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |

## Herramientas

Estas características permiten que Claude interactúe con sistemas externos, ejecute código y realice tareas automatizadas a través de varias interfaces de herramientas.

| Característica | Descripción | Disponibilidad |
|---------|-------------|--------------|
| [Bash](/docs/es/agents-and-tools/tool-use/bash-tool) | Ejecuta comandos y scripts bash para interactuar con el shell del sistema y realizar operaciones de línea de comandos. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Ejecución de código](/docs/es/agents-and-tools/tool-use/code-execution-tool) | Ejecuta código Python en un entorno aislado para análisis de datos avanzado. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Llamada de herramientas programática](/docs/es/agents-and-tools/tool-use/programmatic-tool-calling) | Habilita a Claude para llamar a tus herramientas programáticamente desde dentro de contenedores de ejecución de código, reduciendo la latencia y el consumo de tokens para flujos de trabajo de múltiples herramientas. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Uso de computadora](/docs/es/agents-and-tools/tool-use/computer-use-tool) | Controla interfaces de computadora tomando capturas de pantalla e emitiendo comandos de mouse y teclado. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Transmisión de herramientas de grano fino](/docs/es/agents-and-tools/tool-use/fine-grained-tool-streaming) | Transmite parámetros de uso de herramientas sin almacenamiento en búfer/validación JSON, reduciendo la latencia para recibir parámetros grandes. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Conector MCP](/docs/es/agents-and-tools/mcp-connector) | Conéctate a servidores [MCP](/docs/es/mcp) remotos directamente desde la API de Mensajes sin un cliente MCP separado. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Memoria](/docs/es/agents-and-tools/tool-use/memory-tool) | Habilita a Claude para almacenar y recuperar información entre conversaciones. Construye bases de conocimiento a lo largo del tiempo, mantén el contexto del proyecto y aprende de interacciones pasadas. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Editor de texto](/docs/es/agents-and-tools/tool-use/text-editor-tool) | Crea y edita archivos de texto con una interfaz de editor de texto integrada para tareas de manipulación de archivos. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Búsqueda de herramientas](/docs/es/agents-and-tools/tool-use/tool-search-tool) | Escala a miles de herramientas descubriendo y cargando dinámicamente herramientas bajo demanda usando búsqueda basada en expresiones regulares, optimizando el uso del contexto y mejorando la precisión de la selección de herramientas. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Búsqueda web](/docs/es/agents-and-tools/tool-use/web-fetch-tool) | Recupera contenido completo de páginas web y documentos PDF especificados para análisis en profundidad. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Búsqueda en la web](/docs/es/agents-and-tools/tool-use/web-search-tool) | Aumenta el conocimiento integral de Claude con datos actuales y del mundo real de toda la web. | <PlatformAvailability claudeApi vertexAi azureAi /> |