# Mejores prácticas de prompting

Técnicas específicas de ingeniería de prompts para modelos Claude 4.x, con orientación para Sonnet 4.5, Haiku 4.5 y Opus 4.5.

---

Esta guía proporciona técnicas específicas de ingeniería de prompts para modelos Claude 4.x, con orientación específica para Sonnet 4.5, Haiku 4.5 y Opus 4.5. Estos modelos han sido entrenados para seguir instrucciones de manera más precisa que generaciones anteriores de modelos Claude.
<Tip>
  Para una descripción general de las nuevas capacidades de Claude 4.5, consulta [Novedades en Claude 4.5](/docs/es/about-claude/models/whats-new-claude-4-5). Para orientación sobre migración desde modelos anteriores, consulta [Migración a Claude 4.5](/docs/es/about-claude/models/migrating-to-claude-4).
</Tip>

## Principios generales

### Sé explícito con tus instrucciones

Los modelos Claude 4.x responden bien a instrucciones claras y explícitas. Ser específico sobre tu salida deseada puede ayudar a mejorar los resultados. Los clientes que desean el comportamiento "más allá de lo esperado" de modelos Claude anteriores podrían necesitar solicitar estos comportamientos de manera más explícita con modelos más nuevos.

<section title="Ejemplo: Crear un panel de análisis">

**Menos efectivo:**
```text
Crear un panel de análisis
```

**Más efectivo:**
```text
Crear un panel de análisis. Incluye tantas características e interacciones relevantes como sea posible. Ve más allá de lo básico para crear una implementación completamente funcional.
```

</section>

### Añade contexto para mejorar el rendimiento

Proporcionar contexto o motivación detrás de tus instrucciones, como explicar a Claude por qué tal comportamiento es importante, puede ayudar a los modelos Claude 4.x a entender mejor tus objetivos y entregar respuestas más dirigidas.

<section title="Ejemplo: Preferencias de formato">

**Menos efectivo:**
```text
NUNCA uses puntos suspensivos
```

**Más efectivo:**
```text
Tu respuesta será leída en voz alta por un motor de síntesis de voz, así que nunca uses puntos suspensivos ya que el motor de síntesis de voz no sabrá cómo pronunciarlos.
```

</section>

Claude es lo suficientemente inteligente para generalizar a partir de la explicación.

### Sé vigilante con ejemplos y detalles

Los modelos Claude 4.x prestan mucha atención a los detalles y ejemplos como parte de sus capacidades precisas de seguimiento de instrucciones. Asegúrate de que tus ejemplos se alineen con los comportamientos que deseas fomentar y minimiza los comportamientos que deseas evitar.

### Razonamiento de largo horizonte y seguimiento de estado

Los modelos Claude 4.5 sobresalen en tareas de razonamiento de largo horizonte con capacidades excepcionales de seguimiento de estado. Mantiene la orientación en sesiones extendidas enfocándose en el progreso incremental, realizando avances constantes en pocas cosas a la vez en lugar de intentar hacerlo todo de una vez. Esta capacidad emerge especialmente en múltiples ventanas de contexto o iteraciones de tareas, donde Claude puede trabajar en una tarea compleja, guardar el estado y continuar con una ventana de contexto nueva.

#### Conciencia de contexto y flujos de trabajo de múltiples ventanas

Los modelos Claude 4.5 cuentan con [conciencia de contexto](/docs/es/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5), permitiendo al modelo rastrear su ventana de contexto restante (es decir, "presupuesto de tokens") a lo largo de una conversación. Esto permite a Claude ejecutar tareas y gestionar el contexto de manera más efectiva al entender cuánto espacio tiene para trabajar.

**Gestión de límites de contexto:**

Si estás usando Claude en un arnés de agente que compacta contexto o permite guardar contexto en archivos externos (como en Claude Code), sugerimos añadir esta información a tu prompt para que Claude pueda comportarse en consecuencia. De lo contrario, Claude podría intentar naturalmente terminar el trabajo a medida que se acerca al límite de contexto. A continuación se muestra un ejemplo de prompt:

```text Prompt de ejemplo
Tu ventana de contexto será compactada automáticamente a medida que se acerca a su límite, permitiéndote continuar trabajando indefinidamente desde donde lo dejaste. Por lo tanto, no detengas tareas temprano debido a preocupaciones sobre el presupuesto de tokens. A medida que te acercas a tu límite de presupuesto de tokens, guarda tu progreso actual y estado en la memoria antes de que la ventana de contexto se actualice. Siempre sé tan persistente y autónomo como sea posible y completa tareas completamente, incluso si el final de tu presupuesto se está acercando. Nunca detengas artificialmente ninguna tarea temprano sin importar el contexto restante.
```

La [herramienta de memoria](/docs/es/agents-and-tools/tool-use/memory-tool) se empareja naturalmente con la conciencia de contexto para transiciones de contexto sin problemas.

#### Flujos de trabajo de múltiples ventanas de contexto

Para tareas que abarcan múltiples ventanas de contexto:

1. **Usa un prompt diferente para la primera ventana de contexto**: Usa la primera ventana de contexto para configurar un marco (escribir pruebas, crear scripts de configuración), luego usa futuras ventanas de contexto para iterar en una lista de tareas.

2. **Haz que el modelo escriba pruebas en un formato estructurado**: Pide a Claude que cree pruebas antes de comenzar el trabajo y mantenlas en un formato estructurado (por ejemplo, `tests.json`). Esto conduce a una mejor capacidad a largo plazo para iterar. Recuerda a Claude la importancia de las pruebas: "Es inaceptable eliminar o editar pruebas porque esto podría llevar a funcionalidad faltante o defectuosa."

3. **Configura herramientas de calidad de vida**: Anima a Claude a crear scripts de configuración (por ejemplo, `init.sh`) para iniciar servidores de manera elegante, ejecutar suites de pruebas y linters. Esto previene trabajo repetido cuando se continúa desde una ventana de contexto nueva.

4. **Comenzar de nuevo vs compactar**: Cuando se borra una ventana de contexto, considera comenzar con una ventana de contexto completamente nueva en lugar de usar compactación. Los modelos Claude 4.5 son extremadamente efectivos descubriendo estado desde el sistema de archivos local. En algunos casos, podrías querer aprovechar esto sobre la compactación. Sé prescriptivo sobre cómo debería comenzar:
   - "Llama pwd; solo puedes leer y escribir archivos en este directorio."
   - "Revisa progress.txt, tests.json y los registros de git."
   - "Ejecuta manualmente una prueba de integración fundamental antes de pasar a implementar nuevas características."

5. **Proporciona herramientas de verificación**: A medida que crece la duración de las tareas autónomas, Claude necesita verificar la corrección sin retroalimentación humana continua. Herramientas como el servidor Playwright MCP o capacidades de uso de computadora para pruebas de interfaces de usuario son útiles.

6. **Anima el uso completo del contexto**: Solicita a Claude que complete componentes de manera eficiente antes de pasar al siguiente:

```text Prompt de ejemplo
Esta es una tarea muy larga, así que podría ser beneficioso planificar tu trabajo claramente. Se recomienda pasar todo tu contexto de salida trabajando en la tarea - solo asegúrate de no quedarte sin contexto con trabajo significativo sin confirmar. Continúa trabajando sistemáticamente hasta que hayas completado esta tarea.
```

#### Mejores prácticas de gestión de estado

- **Usa formatos estructurados para datos de estado**: Cuando rastrées información estructurada (como resultados de pruebas o estado de tareas), usa JSON u otros formatos estructurados para ayudar a Claude a entender requisitos de esquema
- **Usa texto no estructurado para notas de progreso**: Las notas de progreso de forma libre funcionan bien para rastrear el progreso general y el contexto
- **Usa git para rastreo de estado**: Git proporciona un registro de lo que se ha hecho y puntos de control que pueden ser restaurados. Los modelos Claude 4.5 funcionan especialmente bien usando git para rastrear estado en múltiples sesiones.
- **Enfatiza el progreso incremental**: Pide explícitamente a Claude que mantenga un registro de su progreso y se enfoque en trabajo incremental

<section title="Ejemplo: Rastreo de estado">

```json
// Archivo de estado estructurado (tests.json)
{
  "tests": [
    {"id": 1, "name": "authentication_flow", "status": "passing"},
    {"id": 2, "name": "user_management", "status": "failing"},
    {"id": 3, "name": "api_endpoints", "status": "not_started"}
  ],
  "total": 200,
  "passing": 150,
  "failing": 25,
  "not_started": 25
}
```

```text
// Notas de progreso (progress.txt)
Progreso de la sesión 3:
- Se corrigió la validación de token de autenticación
- Se actualizó el modelo de usuario para manejar casos extremos
- Siguiente: investigar fallos de prueba de user_management (prueba #2)
- Nota: No elimines pruebas ya que esto podría llevar a funcionalidad faltante
```

</section>

### Estilo de comunicación

Los modelos Claude 4.5 tienen un estilo de comunicación más conciso y natural en comparación con modelos anteriores:

- **Más directo y fundamentado**: Proporciona reportes de progreso basados en hechos en lugar de actualizaciones autoelogiosas
- **Más conversacional**: Ligeramente más fluido y coloquial, menos parecido a una máquina
- **Menos verboso**: Podría omitir resúmenes detallados por eficiencia a menos que se le solicite lo contrario

Este estilo de comunicación refleja con precisión lo que se ha logrado sin elaboración innecesaria.

## Orientación para situaciones específicas

### Equilibra la verbosidad

Los modelos Claude 4.5 tienden hacia la eficiencia y podrían omitir resúmenes verbales después de llamadas a herramientas, saltando directamente a la siguiente acción. Aunque esto crea un flujo de trabajo simplificado, podrías preferir más visibilidad en su proceso de razonamiento.

Si deseas que Claude proporcione actualizaciones mientras trabaja:

```text Prompt de ejemplo
Después de completar una tarea que implique el uso de herramientas, proporciona un resumen rápido del trabajo que has realizado.
```

### Patrones de uso de herramientas

Los modelos Claude 4.5 están entrenados para seguimiento preciso de instrucciones y se benefician de dirección explícita para usar herramientas específicas. Si dices "¿puedes sugerir algunos cambios?", a veces proporcionará sugerencias en lugar de implementarlas, incluso si hacer cambios podría ser lo que pretendías.

Para que Claude tome acción, sé más explícito:

<section title="Ejemplo: Instrucciones explícitas">

**Menos efectivo (Claude solo sugerirá):**
```text
¿Puedes sugerir algunos cambios para mejorar esta función?
```

**Más efectivo (Claude hará los cambios):**
```text
Cambia esta función para mejorar su rendimiento.
```

O:
```text
Realiza estas ediciones en el flujo de autenticación.
```

</section>

Para hacer que Claude sea más proactivo en tomar acción por defecto, puedes añadir esto a tu prompt del sistema:

```text Prompt de ejemplo para acción proactiva
<default_to_action>
Por defecto, implementa cambios en lugar de solo sugerirlos. Si la intención del usuario es poco clara, infiere la acción más útil probable y procede, usando herramientas para descubrir cualquier detalle faltante en lugar de adivinar. Intenta inferir la intención del usuario sobre si una llamada a herramienta (por ejemplo, edición o lectura de archivo) es intencional o no, y actúa en consecuencia.
</default_to_action>
```

Por otro lado, si deseas que el modelo sea más cauteloso por defecto, menos propenso a saltar directamente a implementaciones, y solo tome acción si se le solicita, puedes dirigir este comportamiento con un prompt como el siguiente:

```text Prompt de ejemplo para acción conservadora
<do_not_act_before_instructions>
No saltes a la implementación o cambios de archivos a menos que se te instruya claramente a hacer cambios. Cuando la intención del usuario es ambigua, por defecto proporciona información, realiza investigación y proporciona recomendaciones en lugar de tomar acción. Solo procede con ediciones, modificaciones o implementaciones cuando el usuario las solicita explícitamente.
</do_not_act_before_instructions>
```

### Uso de herramientas y activación

Claude Opus 4.5 es más receptivo al prompt del sistema que modelos anteriores. Si tus prompts fueron diseñados para reducir la infraactivación en herramientas o habilidades, Claude Opus 4.5 podría ahora sobreactivarse. La solución es reducir cualquier lenguaje agresivo. Donde podrías haber dicho "CRÍTICO: DEBES usar esta herramienta cuando...", puedes usar prompting más normal como "Usa esta herramienta cuando...".

### Controla el formato de respuestas

Hemos encontrado que hay algunas formas que son particularmente efectivas para dirigir el formato de salida en modelos Claude 4.x:

1. **Dile a Claude qué hacer en lugar de qué no hacer**

   - En lugar de: "No uses markdown en tu respuesta"
   - Intenta: "Tu respuesta debe estar compuesta de párrafos de prosa que fluyan suavemente."

2. **Usa indicadores de formato XML**

   - Intenta: "Escribe las secciones de prosa de tu respuesta en etiquetas \<smoothly_flowing_prose_paragraphs\>."

3. **Haz coincidir el estilo de tu prompt con la salida deseada**

   El estilo de formato usado en tu prompt puede influir en el estilo de respuesta de Claude. Si aún experimentas problemas de dirigibilidad con el formato de salida, recomendamos que hagas coincidir tu estilo de prompt con tu estilo de salida deseado tanto como sea posible. Por ejemplo, eliminar markdown de tu prompt puede reducir el volumen de markdown en la salida.

4. **Usa prompts detallados para preferencias de formato específicas**

   Para más control sobre el uso de markdown y formato, proporciona orientación explícita:

```text Prompt de ejemplo para minimizar markdown
<avoid_excessive_markdown_and_bullet_points>
Al escribir reportes, documentos, explicaciones técnicas, análisis o cualquier contenido de forma larga, escribe en prosa clara y fluida usando párrafos y oraciones completas. Usa saltos de párrafo estándar para organización y reserva markdown principalmente para `código en línea`, bloques de código (```...```), y encabezados simples (###, y ###). Evita usar **negrita** e *itálicas*.

NO uses listas ordenadas (1. ...) o listas sin ordenar (*) a menos que: a) estés presentando elementos verdaderamente discretos donde un formato de lista es la mejor opción, o b) el usuario solicita explícitamente una lista o clasificación

En lugar de listar elementos con viñetas o números, incorpóralos naturalmente en oraciones. Esta orientación se aplica especialmente a la escritura técnica. Usar prosa en lugar de formato excesivo mejorará la satisfacción del usuario. NUNCA generes una serie de puntos de viñeta excesivamente cortos.

Tu objetivo es texto legible y fluido que guíe al lector naturalmente a través de ideas en lugar de fragmentar información en puntos aislados.
</avoid_excessive_markdown_and_bullet_points>
```

### Investigación y recopilación de información

Los modelos Claude 4.5 demuestran capacidades excepcionales de búsqueda agente y pueden encontrar y sintetizar información de múltiples fuentes de manera efectiva. Para resultados de investigación óptimos:

1. **Proporciona criterios de éxito claros**: Define qué constituye una respuesta exitosa a tu pregunta de investigación

2. **Anima la verificación de fuentes**: Pide a Claude que verifique información en múltiples fuentes

3. **Para tareas de investigación complejas, usa un enfoque estructurado**:

```text Prompt de ejemplo para investigación compleja
Busca esta información de manera estructurada. A medida que recopiles datos, desarrolla varias hipótesis competidoras. Rastrea tus niveles de confianza en tus notas de progreso para mejorar la calibración. Autocrítica regularmente tu enfoque y plan. Actualiza un archivo de árbol de hipótesis o notas de investigación para persistir información y proporcionar transparencia. Desglosa esta tarea de investigación compleja sistemáticamente.
```

Este enfoque estructurado permite a Claude encontrar y sintetizar prácticamente cualquier pieza de información e iterar críticamente sus hallazgos, sin importar el tamaño del corpus.

### Orquestación de subagentes

Los modelos Claude 4.5 demuestran capacidades significativamente mejoradas de orquestación nativa de subagentes. Estos modelos pueden reconocer cuándo las tareas se beneficiarían de delegar trabajo a subagentes especializados y hacerlo de manera proactiva sin requerir instrucción explícita.

Para aprovechar este comportamiento:

1. **Asegura herramientas de subagente bien definidas**: Ten herramientas de subagente disponibles y descritas en definiciones de herramientas
2. **Deja que Claude orqueste naturalmente**: Claude delegará apropiadamente sin instrucción explícita
3. **Ajusta la conservadurismo si es necesario**:

```text Prompt de ejemplo para uso conservador de subagentes
Solo delega a subagentes cuando la tarea claramente se beneficia de un agente separado con una ventana de contexto nueva.
```

### Autoconocimiento del modelo

Si deseas que Claude se identifique correctamente en tu aplicación o use cadenas de API específicas:

```text Prompt de ejemplo para identidad del modelo
El asistente es Claude, creado por Anthropic. El modelo actual es Claude Sonnet 4.5.
```

Para aplicaciones impulsadas por LLM que necesitan especificar cadenas de modelo:

```text Prompt de ejemplo para cadena de modelo
Cuando se necesita un LLM, por favor por defecto usa Claude Sonnet 4.5 a menos que el usuario solicite lo contrario. La cadena de modelo exacta para Claude Sonnet 4.5 es claude-sonnet-4-5-20250929.
```

### Sensibilidad del pensamiento

Cuando el pensamiento extendido está deshabilitado, Claude Opus 4.5 es particularmente sensible a la palabra "think" y sus variantes. Recomendamos reemplazar "think" con palabras alternativas que transmitan significado similar, como "consider," "believe," y "evaluate."

### Aprovecha las capacidades de pensamiento e interleaved thinking

Los modelos Claude 4.x ofrecen capacidades de pensamiento que pueden ser especialmente útiles para tareas que implican reflexión después del uso de herramientas o razonamiento complejo de múltiples pasos. Puedes guiar su pensamiento inicial o intercalado para mejores resultados.

```text Prompt de ejemplo
Después de recibir resultados de herramientas, reflexiona cuidadosamente sobre su calidad y determina los pasos óptimos siguientes antes de proceder. Usa tu pensamiento para planificar e iterar basándote en esta nueva información, y luego toma la mejor acción siguiente.
```

<Info>
  Para más información sobre capacidades de pensamiento, consulta [Pensamiento extendido](/docs/es/build-with-claude/extended-thinking).
</Info>

### Creación de documentos

Los modelos Claude 4.5 sobresalen en la creación de presentaciones, animaciones y documentos visuales. Estos modelos igualan o superan a Claude Opus 4.1 en este dominio, con estilo creativo impresionante y seguimiento de instrucciones más fuerte. Los modelos producen salida pulida y utilizable en la mayoría de los casos en el primer intento.

Para mejores resultados con creación de documentos:

```text Prompt de ejemplo
Crea una presentación profesional sobre [tema]. Incluye elementos de diseño reflexivos, jerarquía visual y animaciones atractivas donde sea apropiado.
```

### Capacidades de visión mejoradas

Claude Opus 4.5 tiene capacidades de visión mejoradas en comparación con modelos Claude anteriores. Funciona mejor en tareas de procesamiento de imágenes y extracción de datos, particularmente cuando hay múltiples imágenes presentes en el contexto. Estas mejoras se trasladan al uso de computadora, donde el modelo puede interpretar de manera más confiable capturas de pantalla y elementos de interfaz de usuario. También puedes usar Claude Opus 4.5 para analizar videos dividiéndolos en fotogramas.

Una técnica que hemos encontrado efectiva para impulsar aún más el rendimiento es dar a Claude Opus 4.5 una herramienta de recorte o [habilidad](/docs/es/agents-and-tools/agent-skills/overview). Hemos visto mejora consistente en evaluaciones de imágenes cuando Claude es capaz de "ampliar" regiones relevantes de una imagen. Hemos preparado un libro de recetas para la herramienta de recorte [aquí](https://github.com/anthropics/claude-cookbooks/blob/main/multimodal/crop_tool.ipynb).

### Optimiza llamadas de herramientas paralelas

Los modelos Claude 4.x sobresalen en ejecución de herramientas paralelas, siendo Sonnet 4.5 particularmente agresivo en disparar múltiples operaciones simultáneamente. Los modelos Claude 4.x:

- Ejecutan múltiples búsquedas especulativas durante investigación
- Leen varios archivos a la vez para construir contexto más rápido
- Ejecutan comandos bash en paralelo (que incluso pueden saturar el rendimiento del sistema)

Este comportamiento es fácilmente dirigible. Aunque el modelo tiene una alta tasa de éxito en llamadas de herramientas paralelas sin prompting, puedes impulsar esto a ~100% o ajustar el nivel de agresión:

```text Prompt de ejemplo para máxima eficiencia paralela
<use_parallel_tool_calls>
Si tienes la intención de llamar múltiples herramientas y no hay dependencias entre las llamadas a herramientas, haz todas las llamadas a herramientas independientes en paralelo. Prioriza llamar a herramientas simultáneamente siempre que las acciones puedan hacerse en paralelo en lugar de secuencialmente. Por ejemplo, cuando lees 3 archivos, ejecuta 3 llamadas a herramientas en paralelo para leer los 3 archivos en contexto al mismo tiempo. Maximiza el uso de llamadas a herramientas paralelas donde sea posible para aumentar velocidad y eficiencia. Sin embargo, si algunas llamadas a herramientas dependen de llamadas anteriores para informar valores dependientes como los parámetros, NO llames a estas herramientas en paralelo y en su lugar llámalas secuencialmente. Nunca uses marcadores de posición o adivines parámetros faltantes en llamadas a herramientas.
</use_parallel_tool_calls>
```

```text Prompt de ejemplo para reducir ejecución paralela
Ejecuta operaciones secuencialmente con pausas breves entre cada paso para asegurar estabilidad.
```

### Reduce la creación de archivos en codificación agente

Los modelos Claude 4.x podrían a veces crear nuevos archivos para propósitos de prueba e iteración, particularmente cuando trabajan con código. Este enfoque permite a Claude usar archivos, especialmente scripts de python, como un 'bloc de notas temporal' antes de guardar su salida final. Usar archivos temporales puede mejorar resultados particularmente para casos de uso de codificación agente.

Si prefieres minimizar la creación neta de nuevos archivos, puedes instruir a Claude a limpiar después de sí mismo:

```text Prompt de ejemplo
Si creas cualquier archivo temporal nuevo, scripts o archivos auxiliares para iteración, limpia estos archivos eliminándolos al final de la tarea.
```

### Sobreeagerness y creación de archivos

Claude Opus 4.5 tiene una tendencia a sobreingeniería creando archivos extra, añadiendo abstracciones innecesarias, o construyendo flexibilidad que no fue solicitada. Si estás viendo este comportamiento no deseado, añade prompting explícito para mantener soluciones mínimas.

Por ejemplo:

```text Prompt de ejemplo para minimizar sobreingeniería
Evita la sobreingeniería. Solo haz cambios que sean directamente solicitados o claramente necesarios. Mantén soluciones simples y enfocadas.

No añadas características, refactorices código, o hagas "mejoras" más allá de lo que fue solicitado. Una corrección de bug no necesita código circundante limpiado. Una característica simple no necesita configurabilidad extra.

No añadas manejo de errores, alternativas o validación para escenarios que no pueden suceder. Confía en garantías de código interno y marco. Solo valida en límites del sistema (entrada del usuario, APIs externas). No uses shims de compatibilidad hacia atrás cuando puedes simplemente cambiar el código.

No crees ayudantes, utilidades o abstracciones para operaciones de una sola vez. No diseñes para requisitos futuros hipotéticos. La cantidad correcta de complejidad es el mínimo necesario para la tarea actual. Reutiliza abstracciones existentes donde sea posible y sigue el principio DRY.
```

### Diseño frontend

Los modelos Claude 4.x, particularmente Opus 4.5, sobresalen en construir aplicaciones web complejas y del mundo real con fuerte diseño frontend. Sin embargo, sin orientación, los modelos pueden por defecto converger a patrones genéricos que crean lo que los usuarios llaman la estética "AI slop". Para crear frontends distintivos y creativos que sorprendan y deleiten:

<Tip>
Para una guía detallada sobre mejora del diseño frontend, consulta nuestro artículo de blog sobre [mejora del diseño frontend a través de habilidades](https://www.claude.com/blog/improving-frontend-design-through-skills).
</Tip>

Aquí hay un fragmento de prompt del sistema que puedes usar para alentar mejor diseño frontend:

```text Prompt de ejemplo para estética frontend
<frontend_aesthetics>
Tiendes a converger hacia salidas genéricas, "en distribución". En diseño frontend, esto crea lo que los usuarios llaman la estética "AI slop". Evita esto: haz frontends creativos y distintivos que sorprendan y deleiten.

Enfócate en:
- Tipografía: Elige fuentes que sean hermosas, únicas e interesantes. Evita fuentes genéricas como Arial e Inter; opta en su lugar por opciones distintivas que eleven la estética del frontend.
- Color y Tema: Comprométete con una estética coherente. Usa variables CSS para consistencia. Colores dominantes con acentos agudos superan paletas tímidas y distribuidas uniformemente. Extrae inspiración de temas IDE y estéticas culturales.
- Movimiento: Usa animaciones para efectos e interacciones micro. Prioriza soluciones solo CSS para HTML. Usa la librería Motion para React cuando esté disponible. Enfócate en momentos de alto impacto: una carga de página bien orquestada con revelaciones escalonadas (animation-delay) crea más deleite que microinteracciones dispersas.
- Fondos: Crea atmósfera y profundidad en lugar de por defecto a colores sólidos. Superpone gradientes CSS, usa patrones geométricos, o añade efectos contextuales que coincidan con la estética general.

Evita estéticas genéricas generadas por IA:
- Familias de fuentes sobreutilizadas (Inter, Roboto, Arial, fuentes del sistema)
- Esquemas de color clichés (particularmente gradientes púrpura sobre fondos blancos)
- Diseños y patrones de componentes predecibles
- Diseño genérico que carece de carácter específico del contexto

Interpreta creativamente y haz opciones inesperadas que se sientan genuinamente diseñadas para el contexto. Varía entre temas claros y oscuros, diferentes fuentes, diferentes estéticas. Aún tiendes a converger en opciones comunes (Space Grotesk, por ejemplo) en generaciones. Evita esto: ¡es crítico que pienses fuera de la caja!
</frontend_aesthetics>
```

También puedes referirte a la habilidad completa [aquí](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md).

### Evita enfocarse en pasar pruebas y hardcoding

Los modelos Claude 4.x a veces pueden enfocarse demasiado en hacer pasar pruebas a expensas de soluciones más generales, o pueden usar workarounds como scripts auxiliares para refactorización compleja en lugar de usar herramientas estándar directamente. Para prevenir este comportamiento y asegurar soluciones robustas y generalizables:

```text Prompt de ejemplo
Por favor escribe una solución de alta calidad y propósito general usando las herramientas estándar disponibles. No crees scripts auxiliares o workarounds para realizar la tarea de manera más eficiente. Implementa una solución que funcione correctamente para todas las entradas válidas, no solo los casos de prueba. No hardcodees valores o crees soluciones que solo funcionen para entradas de prueba específicas. En su lugar, implementa la lógica actual que resuelve el problema de manera general.

Enfócate en entender los requisitos del problema e implementar el algoritmo correcto. Las pruebas están ahí para verificar corrección, no para definir la solución. Proporciona una implementación principiada que siga mejores prácticas y principios de diseño de software.

Si la tarea es irrazonable o infactible, o si alguna de las pruebas es incorrecta, por favor infórmame en lugar de trabajar alrededor de ellas. La solución debe ser robusta, mantenible y extensible.
```

### Anima la exploración de código

Claude Opus 4.5 es altamente capaz pero puede ser demasiado conservador cuando explora código. Si notas que el modelo propone soluciones sin mirar el código o hace suposiciones sobre código que no ha leído, la mejor solución es añadir instrucciones explícitas al prompt. Claude Opus 4.5 es nuestro modelo más dirigible hasta la fecha y responde confiablemente a orientación directa.

Por ejemplo:

```text Prompt de ejemplo para exploración de código
SIEMPRE lee y entiende archivos relevantes antes de proponer ediciones de código. No especules sobre código que no has inspeccionado. Si el usuario referencia un archivo/ruta específica, DEBES abrirlo e inspeccionarlo antes de explicar o proponer correcciones. Sé riguroso y persistente en buscar código para hechos clave. Revisa completamente el estilo, convenciones y abstracciones del código base antes de implementar nuevas características o abstracciones.
```

### Minimiza alucinaciones en codificación agente

Los modelos Claude 4.x son menos propensos a alucinaciones y dan respuestas más precisas, fundamentadas e inteligentes basadas en el código. Para alentar este comportamiento aún más y minimizar alucinaciones:

```text Prompt de ejemplo
<investigate_before_answering>
Nunca especules sobre código que no has abierto. Si el usuario referencia un archivo específico, DEBES leer el archivo antes de responder. Asegúrate de investigar y leer archivos relevantes ANTES de responder preguntas sobre el código base. Nunca hagas ninguna afirmación sobre código antes de investigar a menos que estés seguro de la respuesta correcta - da respuestas fundamentadas y libres de alucinaciones.
</investigate_before_answering>
```

## Consideraciones de migración

Cuando migres a modelos Claude 4.5:

1. **Sé específico sobre el comportamiento deseado**: Considera describir exactamente qué te gustaría ver en la salida.

2. **Enmarca tus instrucciones con modificadores**: Añadir modificadores que alienten a Claude a aumentar la calidad y detalle de su salida puede ayudar a moldear mejor el rendimiento de Claude. Por ejemplo, en lugar de "Crear un panel de análisis", usa "Crear un panel de análisis. Incluye tantas características e interacciones relevantes como sea posible. Ve más allá de lo básico para crear una implementación completamente funcional."

3. **Solicita características específicas explícitamente**: Las animaciones y elementos interactivos deben ser solicitados explícitamente cuando se deseen.