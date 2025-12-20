# Encadenar indicaciones complejas para un mejor rendimiento

Aprende a dividir tareas complejas en subtareas manejables usando encadenamiento de indicaciones para mejorar la precisión y claridad.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Cuando trabajas con tareas complejas, Claude a veces puede fallar si intentas manejar todo en una sola indicación. El encadenamiento de pensamiento (CoT) es excelente, pero ¿qué pasa si tu tarea tiene múltiples pasos distintos que cada uno requiere un pensamiento profundo?

Entra el encadenamiento de indicaciones: dividir tareas complejas en subtareas más pequeñas y manejables.

## ¿Por qué encadenar indicaciones?

1. **Precisión**: Cada subtarea obtiene la atención completa de Claude, reduciendo errores.
2. **Claridad**: Las subtareas más simples significan instrucciones y salidas más claras.
3. **Trazabilidad**: Identifica y corrige fácilmente problemas en tu cadena de indicaciones.

***

## Cuándo encadenar indicaciones

Usa el encadenamiento de indicaciones para tareas de múltiples pasos como síntesis de investigación, análisis de documentos o creación de contenido iterativo. Cuando una tarea implica múltiples transformaciones, citas o instrucciones, el encadenamiento evita que Claude omita o maneje mal los pasos.

**Recuerda:** ¡Cada eslabón en la cadena obtiene la atención completa de Claude!

<Tip>**Consejo de depuración**: Si Claude se pierde un paso o tiene un desempeño deficiente, aísla ese paso en su propia indicación. Esto te permite ajustar los pasos problemáticos sin rehacer toda la tarea.</Tip>

***

## Cómo encadenar indicaciones

1. **Identifica subtareas**: Divide tu tarea en pasos distintos y secuenciales.
2. **Estructura con XML para transiciones claras**: Usa etiquetas XML para pasar salidas entre indicaciones.
3. **Ten un objetivo de tarea única**: Cada subtarea debe tener un objetivo único y claro.
4. **Itera**: Refina subtareas basándote en el desempeño de Claude.

### Flujos de trabajo encadenados de ejemplo:
- **Análisis de múltiples pasos**: Consulta los ejemplos legales y comerciales a continuación.
- **Canalizaciones de creación de contenido**: Investigación → Esquema → Borrador → Edición → Formato.
- **Procesamiento de datos**: Extracción → Transformación → Análisis → Visualización.
- **Toma de decisiones**: Recopilar información → Listar opciones → Analizar cada una → Recomendar.
- **Bucles de verificación**: Generar contenido → Revisar → Refinar → Revisar de nuevo.

<Tip>**Consejo de optimización**: Para tareas con subtareas independientes (como analizar múltiples documentos), crea indicaciones separadas y ejecútalas en paralelo para mayor velocidad.</Tip>

### Avanzado: Cadenas de autocorrección

¡Puedes encadenar indicaciones para que Claude revise su propio trabajo! Esto detecta errores y refina salidas, especialmente para tareas de alto riesgo.

  <section title="Ejemplo: Resumen de investigación autocorrector">

    #### Indicación 1
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Resume este artículo de investigación médica.<br/><br/>\\{\{RESEARCH_PAPER}}\</paper><br/><br/>Enfócate en metodología, hallazgos e implicaciones clínicas. |
    | Asistente<br/>\{\{SUMMARY}} | Metodología: Ensayo controlado aleatorizado doble ciego con 500 pacientes con diabetes tipo 2. El Grupo A (n=250) recibió un nuevo agonista dual GLP-1/GIP; el Grupo B (n=250) recibió un agonista GLP-1 estándar. Ensayo de 24 semanas, punto final primario: reducción de HbA1c.<br/><br/>Hallazgos:<br/>- Grupo A: reducción media de HbA1c del 1,8%<br/>- Grupo B: reducción media de HbA1c del 1,1%<br/>- 68% del Grupo A vs. 52% del Grupo B alcanzaron HbA1c \<7%<br/>- Grupo A: pérdida de peso media de 5,2 kg<br/>- Grupo B: pérdida de peso media de 3,1 kg<br/><br/>Seguridad: Perfiles de eventos adversos similares, sin eventos graves atribuidos al tratamiento.<br/><br/>Implicaciones clínicas: El agonista dual muestra un control glucémico superior y pérdida de peso en comparación con la terapia estándar. Podría ser un cambio de juego, especialmente para diabéticos obesos. |
    
    #### Indicación 2
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Tu tarea es proporcionar retroalimentación sobre un resumen de artículo de investigación. Aquí hay un resumen de un artículo de investigación médica:<br/>\<summary><br/>\{\{SUMMARY\}\}<br/>\</summary><br/><br/>Aquí está el artículo de investigación:<br/>\<br/>\{\{RESEARCH_PAPER\}\}<br/>\</paper><br/><br/>Revisa este resumen para precisión, claridad e integridad en una escala calificada de A-F. |
    | Asistente<br/>\{\{FEEDBACK}} | 1. Precisión: A<br/>   - Reportó correctamente estadísticas clave: reducciones de HbA1c, pérdida de peso.<br/>   - Anotó con precisión el perfil de seguridad y la ausencia de eventos adversos graves.<br/>   - La afirmación de "cambio de juego" está justificada por resultados significativamente mejores.<br/><br/>2. Claridad: A-<br/>   - Conciso y bien estructurado con secciones claras.<br/>   - Buen uso de lenguaje comparativo (p. ej., "hasta 3% desde Q1") para contexto.<br/>   - Problema menor: Acrónimos como "RCT," "GLP-1," y "GIP" no están definidos. Considera deletrear el primer uso.<br/><br/>3. Integridad: B+<br/>   - Cubre todas las áreas solicitadas: metodología, hallazgos, implicaciones clínicas.<br/>   - Falta: Características basales de los grupos (¿estaban bien emparejados?).<br/>   - Falta: Cualquier punto final secundario (p. ej., presión arterial, lípidos).<br/>   - Considera: Implicaciones a largo plazo o necesidad de investigación adicional.<br/><br/>En general, el resumen es preciso y claro, proporcionando información clave para una comprensión rápida del estudio. Para elevarse a A+, define acrónimos, menciona estadísticas basales del grupo, anota cualquier resultado secundario y toca brevemente la necesidad de estudios a largo plazo. |
    
     #### Indicación 3
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Tu tarea es mejorar un resumen de artículo dada la retroalimentación. Aquí está el primer borrador de un artículo de investigación médica:<br/>\<summary><br/>\{\{SUMMARY\}\}<br/>\</summary><br/><br/>Aquí está el artículo de investigación:<br/>\<br/>\{\{RESEARCH_PAPER\}\}<br/>\</paper><br/><br/>Aquí está la retroalimentación:<br/>\<feedback><br/>\{\{FEEDBACK\}\}<br/>\</feedback><br/><br/>Actualiza el resumen basándote en la retroalimentación. |
    | Asistente | Metodología: Ensayo controlado aleatorizado (RCT) doble ciego con 500 pacientes con diabetes tipo 2. El Grupo A (n=250) recibió un nuevo agonista dual glucagon-like peptide-1/glucose-dependent insulinotropic polypeptide (GLP-1/GIP); el Grupo B (n=250) recibió un agonista GLP-1 estándar. El punto final primario del ensayo de 24 semanas fue la reducción de HbA1c. Los grupos estaban bien emparejados para edad, IMC y HbA1c basal.<br/><br/>Hallazgos:<br/>- Grupo A: reducción media de HbA1c del 1,8%<br/>- Grupo B: reducción media de HbA1c del 1,1%<br/>- 68% del Grupo A vs. 52% del Grupo B alcanzaron HbA1c \<7%<br/>- Grupo A: pérdida de peso media de 5,2 kg<br/>- Grupo B: pérdida de peso media de 3,1 kg<br/><br/>Los puntos finales secundarios mostraron mejoras en la presión arterial y los perfiles de lípidos para ambos grupos, con el Grupo A mostrando resultados ligeramente mejores.<br/><br/>Seguridad: Perfiles de eventos adversos similares, sin eventos graves atribuidos a ninguno de los tratamientos.<br/><br/>Implicaciones clínicas: El agonista dual GLP-1/GIP demuestra un control glucémico superior y pérdida de peso en comparación con la terapia GLP-1 estándar. Estos resultados sugieren que podría ser un avance significativo, particularmente para diabéticos obesos. Sin embargo, se necesitan estudios a más largo plazo para confirmar la eficacia y seguridad sostenidas, así como para investigar beneficios potenciales en los resultados cardiovasculares. |
  
</section>

***

## Ejemplos

  <section title="Ejemplo: Analizar un contrato legal (sin encadenamiento)">

    Nota que Claude se pierde la instrucción de proporcionar cambios propuestos en su borrador de correo electrónico.

    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Eres nuestro Oficial Legal Principal. Revisa este contrato SaaS para riesgos, enfocándote en privacidad de datos, SLAs y límites de responsabilidad.<br/><br/>\<contract><br/>\{\{CONTRACT}}<br/>\</contract><br/><br/>Luego redacta un correo electrónico al proveedor con tus preocupaciones y cambios propuestos. |
    | Asistente | Después de revisar el contrato SaaS, he identificado varias preocupaciones:<br/><br/>1. Privacidad de datos (Sección 7):<br/>   - Problema: El proveedor tiene derechos amplios para usar datos del cliente para "mejora del servicio."<br/>   - Riesgo: Podría llevar a compartir datos no autorizado o monetización.<br/><br/>2. SLAs (Sección 5):<br/>   - Problema: La garantía de tiempo de actividad del 99,5% está por debajo del estándar de la industria.<br/>   - Riesgo: El tiempo de inactividad excesivo podría impactar nuestras operaciones.<br/><br/>3. Responsabilidad (Sección 9):<br/>   - Problema: El límite se establece en 3 meses de honorarios.<br/>   - Riesgo: Inadecuado para posibles brechas de datos o fallos de servicio.<br/><br/>Borrador de correo electrónico:<br/><br/>Estimado \{\{VENDOR}},<br/><br/>Después de revisar el acuerdo SaaS, tenemos preocupaciones:<br/><br/>1. Privacidad de datos: Requerimos que nuestros datos se usen solo para la provisión directa del servicio, no para "mejora del servicio" amplia. Por favor, enmienda la Sección 7.<br/><br/>2. SLAs: El tiempo de actividad del 99,5% es insuficiente. Necesitamos 99,99% con sanciones claramente definidas. Por favor, revisa la Sección 5.<br/><br/>3. Responsabilidad: El límite actual de 3 meses de honorarios es inadecuado. Proponemos un límite de 12 meses de honorarios, sin límite para brechas de datos o conducta intencional.<br/><br/>Valoramos nuestra posible asociación y creemos que estos cambios nos prepararán para el éxito. Por favor, envía un acuerdo revisado.<br/><br/>Saludos cordiales,<br/>\{\{CLO_NAME}} |
  
</section>

  <section title="Ejemplo: Analizar un contrato legal (con encadenamiento)">

    #### Indicación 1    
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Eres nuestro Oficial Legal Principal. Revisa este contrato SaaS para riesgos, enfocándote en privacidad de datos, SLAs y límites de responsabilidad.<br/><br/>\<contract><br/>\{\{CONTRACT}}<br/>\</contract><br/><br/>Emite tus hallazgos en etiquetas \<risks>. |
    | Asistente<br/>\{\{CONCERNS}} | 1. Privacidad de datos (Sección 7):<br/>   - Problema: El proveedor tiene derechos amplios para usar datos del cliente para "mejora del servicio."<br/>   - Riesgo: Podría llevar a compartir datos no autorizado o monetización de datos del cliente.<br/>   - Impacto: Posible violación de confianza del cliente, multas regulatorias (GDPR, CCPA).<br/><br/>2. SLAs (Sección 5):<br/>   - Problema: La garantía de tiempo de actividad del 99,5% está por debajo del estándar de la industria (típicamente 99,99%).<br/>   - Riesgo: Hasta 43,8 horas de tiempo de inactividad por año vs. 52,6 minutos en 99,99%.<br/>   - Impacto: Interrupciones operacionales, pérdida de ingresos, insatisfacción del cliente.<br/><br/>3. Responsabilidad (Sección 9):<br/>   - Problema: El límite de responsabilidad se establece en 3 meses de honorarios.<br/>   - Riesgo: Inadecuado para posibles brechas de datos, robo de PI o fallos de servicio prolongados.<br/>   - Impacto: Compensación insuficiente por daños que podrían exceder ampliamente el límite, como demandas colectivas o multas regulatorias. |
    
    #### Indicación 2    
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Redacta un correo electrónico a un proveedor de producto SaaS describiendo las siguientes preocupaciones y proponiendo cambios. Aquí están las preocupaciones:<br/>\<concerns><br/>\{\{CONCERNS\}\}<br/>\</concerns><br/><br/>|
    | Asistente<br/>\{\{EMAIL}} | Estimado \{\{VENDOR}},<br/><br/>Después de una revisión exhaustiva del acuerdo SaaS propuesto, nuestro equipo legal ha identificado varias preocupaciones de alta prioridad que deben abordarse antes de que podamos proceder:<br/><br/>1. Privacidad de datos (Sección 7):<br/>   - Actual: Derechos amplios para usar datos del cliente para "mejora del servicio."<br/>   - Preocupación: Posible compartir datos no autorizado o monetización.<br/>   - Cambio propuesto: Limita el uso de datos a la provisión directa del servicio. Cualquier uso para mejora, análisis o marketing debe ser opcional, revocable y anonimizado.<br/><br/>2. SLAs (Sección 5):<br/>   - Actual: Garantía de tiempo de actividad del 99,5%.<br/>   - Preocupación: Hasta 43,8 horas de tiempo de inactividad por año, arriesgando interrupciones operacionales.<br/>   - Cambio propuesto: Tiempo de actividad del 99,99% con créditos de servicio escalonados. P. ej., crédito del 10% para \<99,99%, 25% para \<99,9%, 50% para \<99,5%.<br/><br/>3. Responsabilidad (Sección 9):<br/>   - Actual: Límite en 3 meses de honorarios.<br/>   - Preocupación: Groseramente inadecuado para brechas de datos, robo de PI o interrupciones prolongadas.<br/>   - Cambio propuesto: 12 meses de honorarios para responsabilidad general. Sin límite para brechas de datos, conducta intencional, infracción de PI.<br/><br/>Estos cambios son innegociables para nosotros. Se alinean con los estándares de la industria y nuestro compromiso con la seguridad de datos, la excelencia operacional y la responsabilidad fiduciaria. Valoramos el potencial de nuestra asociación, y abordar estos establecerá una base sólida.<br/><br/>Por favor, haz que tu equipo legal revise e incorpore estos cambios. Estamos felices de discutir más para asegurar comprensión y acuerdo mutuos.<br/><br/>Saludos cordiales,<br/>\{\{CLO_NAME}} |
    
    #### Indicación 3    
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Tu tarea es revisar un correo electrónico y proporcionar retroalimentación. Aquí está el correo electrónico:<br/>\<email><br/>\{\{EMAIL\}\}<br/>\</email><br/><br/>Proporciona retroalimentación sobre tono, claridad y profesionalismo. |
    | Asistente | 1. Tono:<br/>   - Profesional y asertivo sin ser confrontacional.<br/>   - El uso de "innegociable" es fuerte pero justificado dada la criticidad de los problemas.<br/>   - El lenguaje colaborativo ("valoramos," "felices de discutir") equilibra la firmeza, manteniendo un tono constructivo.<br/><br/>2. Claridad:<br/>   - Excelente estructuración: estado actual, preocupación y cambio propuesto para cada problema.<br/>   - Los términos técnicos (p. ej., "EBITDA," "créditos de servicio escalonados") son apropiados para un contexto B2B SaaS.<br/>   - Los elementos de acción son claros: el equipo legal del proveedor debe revisar e incorporar cambios.<br/><br/>3. Profesionalismo:<br/>   - Se enfoca en beneficio mutuo y estándares de la industria, no solo nuestras demandas.<br/>   - Menciona responsabilidades más amplias (seguridad de datos, excelencia operacional, deber fiduciario), elevando la discusión.<br/>   - Ofrece discusión adicional, mostrando compromiso con la comprensión y resolución de problemas.<br/><br/>En general, el correo electrónico logra el equilibrio correcto de asertividad y colaboración. Articula claramente nuestras preocupaciones, propone soluciones específicas y mantiene un tono profesional orientado a la asociación. No se necesitan revisiones; procede con el envío. |
  
</section>
  <section title="Ejemplo: Revisión de estrategia de multitenencia">

    #### Indicación 1    
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Como arquitecto de soluciones senior, revisa y analiza esta estrategia de multitenencia para nuestro nuevo producto SaaS empresarial.<br/><br/>\<strategy><br/>\{\{STRATEGY}}<br/>\</strategy><br/><br/>Enfócate en escalabilidad, seguridad y rentabilidad. |
    | Asistente<br/>\{\{ANALYSIS}} | 1. Escalabilidad:<br/>   + El fragmentado de base de datos por inquilino reduce la contención, soporta alto crecimiento.<br/>   + Los microservicios permiten el escalado independiente de componentes.<br/>   - Los servidores de aplicaciones compartidos podrían ser un cuello de botella bajo carga extrema.<br/>   - Sin mención de auto-escalado o equilibrio de carga para la capa de aplicación.<br/><br/>2. Seguridad:<br/>   + El aislamiento de datos de inquilino mediante fragmentado mitiga fugas de datos.<br/>   + JWT con corta caducidad y tokens de actualización es la mejor práctica de la industria.<br/>   - Sin mención de cifrado (en reposo, en tránsito) o gestión de claves.<br/>   - La estrategia de IAM carece de detalle sobre roles, permisos o RBAC.<br/><br/>3. Rentabilidad:<br/>   + Los servidores de aplicaciones compartidos reducen costos de recursos inactivos.<br/>   + Las funciones sin servidor para tareas infrecuentes optimizan costos.<br/>   - La base de datos por inquilino podría aumentar costos a escala vs. base de datos multi-inquilino optimizada.<br/>   - Sin discusión de instancias reservadas o instancias spot para ahorro de costos. |
    
    #### Indicación 2    
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Redacta un documento de revisión de estrategia para el liderazgo de ingeniería basado en este análisis de una estrategia de multitenencia.<br/><br/>\<strategy><br/>\{\{STRATEGY}}<br/>\</strategy><br/><br/>\<analysis><br/>\{\{ANALYSIS}}<br/>\</analysis><br/><br/>Incluye un resumen ejecutivo, análisis detallado y recomendaciones. |
    | Asistente<br/>\{\{STRATEGY_DOC}} | # Revisión de estrategia de multitenencia: Producto SaaS empresarial<br/><br/>## Resumen ejecutivo<br/>La estrategia propuesta demuestra una base sólida en principios de escalabilidad y seguridad pero tiene brechas en detalles de implementación. Destaca en aislamiento de datos y escalado a nivel de componente pero carece de escalado robusto de capa de aplicación y medidas de seguridad avanzadas. Las optimizaciones de costos están presentes pero pueden fallar a alta escala. Con mejoras dirigidas, esta estrategia puede soportar efectivamente nuestras ambiciones SaaS empresariales.<br/><br/>## Análisis detallado<br/><br/>### 1. Escalabilidad: B+<br/><br/>Fortalezas:<br/>- El fragmentado de base de datos por inquilino es excelente. Minimiza la latencia de consulta, soporta alto crecimiento de datos y facilita escalado sin problemas por inquilino.<br/>- La arquitectura de microservicios permite el escalado de componentes individuales basado en demanda, crucial para manejar cargas de trabajo empresariales diversas.<br/><br/>Debilidades:<br/>- Los servidores de aplicaciones compartidos arriesgan convertirse en un cuello de botella. A medida que crece el número de inquilinos y el tráfico, estos podrían degradar el rendimiento en todos los inquilinos.<br/>- La ausencia de auto-escalado y equilibrio de carga para la capa de aplicación es una omisión crítica. Estos son esenciales para manejar picos de tráfico sin sobre-provisionar.<br/><br/>### 2. Seguridad: B-<br/><br/>Fortalezas:<br/>- Las bases de datos fragmentadas proporcionan un fuerte aislamiento de datos de inquilino, mitigando riesgos de fugas de datos o acceso no autorizado entre inquilinos.<br/>- JWT con corta caducidad y tokens de actualización se alinean con las mejores prácticas de OWASP, reduciendo ventanas de vulnerabilidad de tokens.<br/><br/>Debilidades:<br/>- Sin mención de cifrado de datos en reposo o en tránsito (TLS 1.3). Esto es innegociable para datos empresariales.<br/>- La estrategia de gestión de claves falta. ¿Cómo se gestionan y rotan las claves de cifrado, secretos JWT y credenciales de BD?<br/>- IAM carece de profundidad. Necesitamos RBAC con roles bien definidos, control de acceso basado en atributos (ABAC) para permisos granulares e integración con proveedores de identidad empresariales (SAML, OIDC).<br/><br/>### 3. Rentabilidad: B<br/><br/>Fortalezas:<br/>- Los servidores de aplicaciones compartidos reducen costos de capacidad inactiva, bueno para tráfico en estado estable.<br/>- Sin servidor para tareas infrecuentes (p. ej., reportes) es inteligente; paga solo cuando se usan estos recursos.<br/><br/>Debilidades:<br/>- Las bases de datos por inquilino pueden no ser rentables a escala en comparación con una base de datos multi-inquilino bien diseñada con particionamiento robusto de datos.<br/>- Sin mención de medidas de ahorro de costos como instancias reservadas para cargas de trabajo predecibles o instancias spot para tareas tolerantes a fallos.<br/>- La falta de auto-escalado de capa de aplicación podría llevar a sobre-provisionar, aumentando costos.<br/><br/>## Recomendaciones<br/><br/>1. **Resiliencia de capa de aplicación**: Implementa auto-escalado con Kubernetes o servicios nativos de nube (EKS, GKE). Despliega en zonas de disponibilidad con un CDN para activos estáticos.<br/><br/>2. **Endurecimiento de seguridad**:<br/>   a. Cifra datos en reposo (AES-256) y en tránsito (TLS 1.3).<br/>   b. Usa un KMS gestionado (AWS KMS, GCP KMS) para gestión de claves.<br/>   c. Mejora IAM con RBAC, ABAC e integración SAML/OIDC para SSO empresarial.<br/><br/>3. **Optimización de costos**:<br/>   a. Evalúa base de datos multi-inquilino columnar (p. ej., Snowflake) vs. fragmentado a escala.<br/>   b. Usa instancias reservadas para servidores de aplicaciones, instancias spot para cargas de trabajo no críticas.<br/>   c. Implementa monitoreo proactivo y ajuste de tamaño para evitar sobre-provisionar.<br/><br/>4. **Prueba de concepto (PoC)**: Antes de la implementación completa, realiza una PoC con simulación de alta escala:<br/>   a. Prueba base de datos fragmentada vs. base de datos multi-inquilino optimizada para costo y rendimiento.<br/>   b. Prueba de estrés de capa de aplicación con tráfico empresarial simulado de picos.<br/>   c. Auditoría de seguridad de terceros, enfocándose en aislamiento de datos y controles de acceso.<br/><br/>Con estas mejoras, nuestra estrategia de multi-tenencia será de grado empresarial: escalable, segura y rentable. La PoC validará nuestras opciones de diseño e infundirá confianza en nuestros clientes empresariales. |
    
    #### Indicación 3    
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Califica este documento de revisión de estrategia para claridad, capacidad de acción y alineación con prioridades empresariales. <br/><br/>\<br/>\{\{PRIORITIES}}<br/>\</priorities><br/><br/>\<strategy_doc><br/>\{\{STRATEGY_DOC}}<br/>\</strategy_doc> |
    | Asistente | 1. Claridad: A<br/>   + Estructura clara con Resumen ejecutivo, Análisis detallado y Recomendaciones.<br/>   + El análisis usa un sistema de calificación (B+, B-) para comprensión rápida de fortalezas/debilidades.<br/>   + Los términos técnicos (RBAC, ABAC, TLS) se explican o contextualizan, ayudando al liderazgo no técnico.<br/>   + Las ayudas visuales (puntos de viñeta, indentación) mejoran la legibilidad.<br/><br/>2. Capacidad de acción: A-<br/>   + Las recomendaciones son específicas y técnicas (p. ej., "Implementa auto-escalado con Kubernetes").<br/>   + El plan de PoC con objetivos claros proporciona una hoja de ruta.<br/>   + Falta: Cronogramas, requisitos de recursos o asignaciones de equipo para cada recomendación.<br/>   + Considera: Agrega una sección "Próximos pasos" con acciones inmediatas, roles y cronograma de alto nivel.<br/><br/>3. Alineación empresarial: A+<br/>   + Aborda directamente las prioridades empresariales:<br/>     - Escalabilidad: Discute el manejo de picos de tráfico a nivel empresarial.<br/>     - Seguridad: Se enfoca en aislamiento de datos, cifrado e IAM empresarial.<br/>     - Costo: Las estrategias se alinean con FinOps empresarial (instancias reservadas, ajuste de tamaño).<br/>   + PoC con "simulación de alta escala" y auditoría de seguridad muestra compromiso con calidad de grado empresarial.<br/>   + El lenguaje resuena con preocupaciones empresariales: "riesgo inaceptable," "grado empresarial," "infundir confianza."<br/><br/>En general, el documento destaca en claridad y alineación empresarial. La capacidad de acción es fuerte pero podría elevarse a A+ con una sección "Próximos pasos." La profundidad técnica, acoplada con explicaciones claras, hace esto altamente efectivo para liderazgo técnico y no técnico. ¡Excelente trabajo! |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Biblioteca de indicaciones" icon="link" href="/docs/es/resources/prompt-library/library">
    Inspírate con una selección curada de indicaciones para varias tareas y casos de uso.
  </Card>
  <Card title="Tutorial de indicaciones de GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutorial lleno de ejemplos que cubre los conceptos de ingeniería de indicaciones encontrados en nuestros documentos.
  </Card>
  <Card title="Tutorial de indicaciones de Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Una versión más ligera de nuestro tutorial de ingeniería de indicaciones a través de una hoja de cálculo interactiva.
  </Card>
</CardGroup>