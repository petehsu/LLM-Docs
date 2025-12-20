# Sé claro, directo y detallado

Cómo escribir indicaciones claras y específicas para obtener mejores respuestas de Claude

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Cuando interactúas con Claude, piensa en él como un empleado brillante pero muy nuevo (con amnesia) que necesita instrucciones explícitas. Como cualquier empleado nuevo, Claude no tiene contexto sobre tus normas, estilos, directrices o formas preferidas de trabajar.
Cuanto más precisamente expliques lo que quieres, mejor será la respuesta de Claude.

<Tip>**La regla de oro de las indicaciones claras**<br/>Muestra tu indicación a un colega, idealmente alguien que tenga contexto mínimo sobre la tarea, y pídele que siga las instrucciones. Si están confundidos, Claude probablemente también lo estará.</Tip>

## Cómo ser claro, contextual y específico

- **Dale a Claude información contextual:** Así como podrías desempeñarte mejor en una tarea si supieras más contexto, Claude se desempeñará mejor si tiene más información contextual. Algunos ejemplos de información contextual:
    - Para qué se utilizarán los resultados de la tarea
    - Para qué audiencia está destinada la salida
    - De qué flujo de trabajo forma parte la tarea y dónde pertenece en ese flujo de trabajo
    - El objetivo final de la tarea, o cómo se ve una finalización exitosa de la tarea
- **Sé específico sobre lo que quieres que Claude haga:** Por ejemplo, si quieres que Claude genere solo código y nada más, dilo.
- **Proporciona instrucciones como pasos secuenciales:** Usa listas numeradas o puntos para asegurar mejor que Claude realice la tarea exactamente como la quieres.

### Ejemplos

    <section title="Ejemplo: Anonimizar comentarios de clientes">

    Observa que Claude aún comete errores en el ejemplo de indicación poco clara, como dejar el nombre de un cliente.

    | Rol | Indicación poco clara | Indicación clara |
    | --- | --- | --- |
    | Usuario | Por favor, elimina toda información de identificación personal de estos mensajes de comentarios de clientes: \{\{FEEDBACK_DATA\}\} | Tu tarea es anonimizar comentarios de clientes para nuestra revisión trimestral.<br/><br/>Instrucciones:<br/>1. Reemplaza todos los nombres de clientes con "CUSTOMER_[ID]" (por ejemplo, "Jane Doe" → "CUSTOMER_001").<br/>2. Reemplaza direcciones de correo electrónico con "EMAIL_[ID]@example.com".<br/>3. Redacta números de teléfono como "PHONE_[ID]".<br/>4. Si un mensaje menciona un producto específico (por ejemplo, "AcmeCloud"), déjalo intacto.<br/>5. Si no se encuentra información de identificación personal, copia el mensaje textualmente.<br/>6. Genera solo los mensajes procesados, separados por "---".<br/><br/>Datos a procesar: \{\{FEEDBACK_DATA\}\} |
    | Asistente (respuesta de Claude) | Aquí están los mensajes de comentarios de clientes anonimizados:<br/>1. He estado usando tu software durante años, y ha sido excelente. Pero últimamente, AcmeCloud ha estado fallando mucho. ¡Arréglalo!<br/>2. XXX, tu representante de atención al cliente, fue increíblemente útil. Me guió a través de todo el proceso. Mi correo electrónico es XXX si quieres enviar una encuesta.<br/>3. Soy John Smith, y no estoy feliz. He estado en espera durante 2 horas intentando comunicarme con alguien en XXX. ¡Esto es inaceptable! | CUSTOMER_001: He estado usando tu software durante años, y ha sido excelente. Pero últimamente, AcmeCloud ha estado fallando mucho. ¡Arréglalo!<br/>---<br/>CUSTOMER_002: CUSTOMER_SERVICE_001, tu representante de atención al cliente, fue increíblemente útil. Me guió a través de todo el proceso. Mi correo electrónico es EMAIL_002@example.com si quieres enviar una encuesta.<br/>---<br/>CUSTOMER_003: Soy CUSTOMER_003, y no estoy feliz. He estado en espera durante 2 horas intentando comunicarme con alguien en PHONE_001. ¡Esto es inaceptable! |
    
</section>
    <section title="Ejemplo: Crear una campaña de correo electrónico de marketing">

    Observa que Claude inventa detalles para llenar los vacíos donde carece de contexto con la indicación vaga.

    | Rol | Indicación vaga | Indicación específica |
    | --- | --- | --- |
    | Usuario | Escribe un correo electrónico de marketing para nuestras nuevas características de AcmeCloud. | Tu tarea es crear un correo electrónico de marketing dirigido para nuestro lanzamiento de características de AcmeCloud en Q3.<br/><br/>Instrucciones:<br/>1. Escribe para esta audiencia objetivo: Empresas tecnológicas de tamaño medio (100-500 empleados) que se actualizan de on-prem a la nube.<br/>2. Destaca 3 características clave nuevas: cifrado de datos avanzado, sincronización multiplataforma y colaboración en tiempo real.<br/>3. Tono: Profesional pero accesible. Enfatiza seguridad, eficiencia y trabajo en equipo.<br/>4. Incluye un CTA claro: Prueba gratuita de 30 días con incorporación prioritaria.<br/>5. Línea de asunto: Menos de 50 caracteres, menciona "seguridad" y "colaboración".<br/>6. Personalización: Usa variables \{\{COMPANY_NAME\}\} y \{\{CONTACT_NAME\}\}.<br/><br/>Estructura:<br/>1. Línea de asunto<br/>2. Cuerpo del correo electrónico (150-200 palabras)<br/>3. Texto del botón CTA |
    | Asistente (respuesta de Claude) | Aquí hay un borrador de correo electrónico de marketing para nuestras nuevas características:<br/><br/>Asunto: Impulsa tu negocio con las últimas características de AcmeCloud<br/><br/>Estimado cliente valorado,<br/><br/>Nos complace presentar tres características poderosas para AcmeCloud que revolucionarán tu flujo de trabajo:<br/><br/>1. Colaboración en tiempo real: Trabaja en documentos simultáneamente con tu equipo. ¡Sin más problemas de control de versiones!<br/>2. Información impulsada por IA: Toma decisiones basadas en datos con IA que analiza tendencias y automatiza tareas.<br/>3. Suite de seguridad avanzada: Cifrado de extremo a extremo, autenticación multifactor y detección de amenazas mantienen tus datos seguros.<br/><br/>Oferta limitada: Actualiza ahora para obtener un descuento del 20% en el primer año. Además, ¡refiere a un amigo para obtener un 10% adicional!<br/><br/>Saludos,<br/>El equipo de AcmeCloud | Línea de asunto: AcmeCloud: La seguridad empresarial se encuentra con el trabajo en equipo en tiempo real<br/><br/>Cuerpo del correo electrónico:<br/>Estimado \{\{CONTACT_NAME\}\},<br/><br/>En \{\{COMPANY_NAME\}\}, estás creciendo rápidamente y mirando hacia la nube. Pero con el crecimiento viene el desafío de mantener los datos seguros mientras se fomenta la colaboración. Aquí es donde entra el lanzamiento de Q3 de AcmeCloud, hecho a medida para innovadores tecnológicos como tú.<br/><br/>1. Fort Knox para tus archivos: El cifrado de grado militar ahora salvaguarda tus datos, tanto en movimiento como en reposo. Tu propiedad intelectual sigue siendo tuya, punto.<br/>2. Sincronización sin fronteras: Windows, Mac o Linux—AcmeCloud habla todos los idiomas. El control de versiones unificado significa que no hay más "final_v2_REALLY_FINAL.doc".<br/>3. Colabora a la velocidad de la luz: Olvida el ping-pong de archivos adjuntos. Ahora tus desarrolladores, diseñadores y científicos de datos co-crean en tiempo real, reduciendo el tiempo de comercialización.<br/><br/>No solo tomes nuestra palabra. Experimenta la diferencia de AcmeCloud con nuestra prueba de 30 días. Y porque sabemos que el tiempo es tu activo más precioso, estamos incluyendo incorporación prioritaria.<br/><br/>Eleva tu equipo ahora - Prueba gratuita de 30 días |
    
</section>
    <section title="Ejemplo: Respuesta a incidentes">

    Observa que Claude genera texto superfluo y formato diferente con la indicación vaga.
    | Rol | Indicación vaga | Indicación detallada |
    | --- | --- | --- |
    | Usuario | Analiza este informe de interrupción de AcmeCloud y resume los puntos clave.<br/><br/>\{\{REPORT\}\} | Analiza este informe de interrupción de AcmeCloud. Salta el preámbulo. Mantén tu respuesta concisa y escribe solo la información absolutamente necesaria. Lista solo:<br/>1) Causa<br/>2) Duración<br/>3) Servicios afectados<br/>4) Número de usuarios afectados<br/>5) Pérdida de ingresos estimada. <br/><br/>Aquí está el informe: \{\{REPORT\}\}|
    | Asistente (respuesta de Claude) | Aquí hay un resumen de los puntos clave del informe de interrupción de AcmeCloud:<br/><br/>El 15 de mayo, una actualización de equilibrador de carga mal configurada causó problemas significativos de enrutamiento de tráfico, resultando en una interrupción del servicio de 09:15 a 13:52 UTC. La interrupción de 4 horas y 37 minutos afectó nuestro servicio principal de sincronización de archivos y panel de administración, haciéndolos inaccesibles. Además, la aplicación móvil experimentó pérdida parcial de funcionalidad. Aproximadamente el 68% de nuestra base de usuarios, totalizando 1.3 millones de usuarios, fueron afectados. Basado en nuestros Acuerdos de Nivel de Servicio (SLA) e ingresos promedio por usuario, estimamos un impacto financiero de $420,000 en créditos de servicio y posible pérdida de clientes. | 1) Causa: Actualización de equilibrador de carga mal configurada<br/>2) Duración: 4h 37m (09:15-13:52 UTC, 15 de mayo)<br/>3) Afectados: Sincronización principal, panel de administración (inactivos); aplicación móvil (parcial)<br/>4) Usuarios afectados: 1.3M (68% de la base)<br/>5) Pérdida de ingresos estimada: $420,000 |
    
</section>

***

<CardGroup cols={3}>
  <Card title="Biblioteca de indicaciones" icon="link" href="/docs/es/resources/prompt-library/library">
    Inspírate con una selección curada de indicaciones para varias tareas y casos de uso.
  </Card>
  <Card title="Tutorial de indicaciones de GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutorial lleno de ejemplos que cubre los conceptos de ingeniería de indicaciones que se encuentran en nuestra documentación.
  </Card>
  <Card title="Tutorial de indicaciones de Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Una versión más ligera de nuestro tutorial de ingeniería de indicaciones a través de una hoja de cálculo interactiva.
  </Card>
</CardGroup>