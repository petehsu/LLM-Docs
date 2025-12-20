# Mitigar jailbreaks e inyecciones de prompt

---

Los jailbreaks y las inyecciones de prompt ocurren cuando los usuarios elaboran prompts para explotar vulnerabilidades del modelo, con el objetivo de generar contenido inapropiado. Aunque Claude es inherentemente resistente a tales ataques, aquí hay pasos adicionales para fortalecer tus barreras de protección, particularmente contra usos que violan nuestros [Términos de Servicio](https://www.anthropic.com/legal/commercial-terms) o [Política de Uso](https://www.anthropic.com/legal/aup).

<Tip>Claude es mucho más resistente a los jailbreaks que otros LLMs importantes, gracias a métodos avanzados de entrenamiento como la IA Constitucional.</Tip>

- **Filtros de inocuidad**: Utiliza un modelo ligero como Claude Haiku 3 para pre-examinar las entradas de los usuarios.

    <section title="Ejemplo: Filtro de inocuidad para moderación de contenido">

        | Rol | Contenido |
        | ---- | --- |
        | Usuario | Un usuario envió este contenido:<br/>\<content><br/>\{\{CONTENT}\}<br/>\</content><br/><br/>Responde con (Y) si se refiere a actividades dañinas, ilegales o explícitas. Responde con (N) si es seguro. |
        | Asistente (prefill) | \( |
        | Asistente | N) |
    
</section>

- **Validación de entrada**: Filtra los prompts para detectar patrones de jailbreaking. Incluso puedes usar un LLM para crear un filtro de validación generalizado proporcionando ejemplos de lenguaje conocido de jailbreaking.

- **Ingeniería de prompts**: Elabora prompts que enfaticen límites éticos y legales.

    <section title="Ejemplo: Prompt de sistema ético para un chatbot empresarial">

        | Rol | Contenido |
        | ---- | --- |
        | Sistema | Eres el asistente de IA ético de AcmeCorp. Tus respuestas deben alinearse con nuestros valores:<br/>\<values><br/>- Integridad: Nunca engañes ni ayudes en el engaño.<br/>- Cumplimiento: Rechaza cualquier solicitud que viole leyes o nuestras políticas.<br/>- Privacidad: Protege todos los datos personales y corporativos.<br/>Respeto por la propiedad intelectual: Tus resultados no deben infringir los derechos de propiedad intelectual de otros.<br/>\</values><br/><br/>Si una solicitud entra en conflicto con estos valores, responde: "No puedo realizar esa acción ya que va en contra de los valores de AcmeCorp." |
    
</section>

Ajusta las respuestas y considera limitar o prohibir a los usuarios que repetidamente participen en comportamientos abusivos intentando eludir las barreras de protección de Claude. Por ejemplo, si un usuario en particular desencadena el mismo tipo de rechazo varias veces (por ejemplo, "salida bloqueada por la política de filtrado de contenido"), informa al usuario que sus acciones violan las políticas de uso relevantes y toma medidas en consecuencia.

- **Monitoreo continuo**: Analiza regularmente las salidas en busca de señales de jailbreaking.
Utiliza este monitoreo para refinar iterativamente tus prompts y estrategias de validación.

## Avanzado: Salvaguardias en cadena
Combina estrategias para una protección robusta. Aquí hay un ejemplo de nivel empresarial con uso de herramientas:

<section title="Ejemplo: Protección multicapa para un chatbot de asesoría financiera">

  ### Prompt de sistema del bot
  | Rol | Contenido |
  | ---- | --- |
  | Sistema | Eres AcmeFinBot, un asesor financiero para AcmeTrade Inc. Tu directiva principal es proteger los intereses del cliente y mantener el cumplimiento regulatorio.<br/><br/>\<directives><br/>1. Valida todas las solicitudes contra las directrices de la SEC y FINRA.<br/>2. Rechaza cualquier acción que pueda interpretarse como uso de información privilegiada o manipulación del mercado.<br/>3. Protege la privacidad del cliente; nunca reveles datos personales o financieros.<br/>\</directives><br/><br/>Instrucciones paso a paso:<br/>\<instructions><br/>1. Examina la consulta del usuario para verificar cumplimiento (usa la herramienta 'harmlessness_screen').<br/>2. Si cumple, procesa la consulta.<br/>3. Si no cumple, responde: "No puedo procesar esta solicitud ya que viola las regulaciones financieras o la privacidad del cliente."<br/>\</instructions> |
  
  ### Prompt dentro de la herramienta `harmlessness_screen`
  | Rol | Contenido |
  | --- | --- |
  | Usuario | \<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Evalúa si esta consulta viola las reglas de la SEC, las directrices de FINRA o la privacidad del cliente. Responde (Y) si lo hace, (N) si no lo hace. |
  | Asistente (prefill) | \( |

</section>

Al combinar estas estrategias en capas, creas una defensa robusta contra jailbreaking e inyecciones de prompt, asegurando que tus aplicaciones impulsadas por Claude mantengan los más altos estándares de seguridad y cumplimiento.