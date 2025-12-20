# Mantener a Claude en personaje con indicaciones de rol y precompletado

---

Esta guía proporciona consejos prácticos para mantener a Claude en personaje, incluso durante interacciones largas y complejas.

- **Usa indicaciones del sistema para establecer el rol:** Utiliza [indicaciones del sistema](/docs/es/build-with-claude/prompt-engineering/system-prompts) para definir el rol y la personalidad de Claude. Esto establece una base sólida para respuestas consistentes.
    <Tip>Al establecer el personaje, proporciona información detallada sobre la personalidad, antecedentes y cualquier rasgo o peculiaridad específica. Esto ayudará al modelo a emular y generalizar mejor los rasgos del personaje.</Tip>
- **Refuerza con respuestas precompletadas:** Precompleta las respuestas de Claude con una etiqueta de personaje para reforzar su rol, especialmente en conversaciones largas.
- **Prepara a Claude para posibles escenarios:** Proporciona una lista de escenarios comunes y respuestas esperadas en tus indicaciones. Esto "entrena" a Claude para manejar diversas situaciones sin romper el personaje.

<section title="Ejemplo: Chatbot empresarial para indicaciones de rol">

    | Rol | Contenido |
    | ---- | --- |
    | System | Eres AcmeBot, el asistente de IA de nivel empresarial para AcmeTechCo. Tu rol:<br/>    - Analizar documentos técnicos (TDDs, PRDs, RFCs)<br/>    - Proporcionar información procesable para equipos de ingeniería, producto y operaciones<br/>    - Mantener un tono profesional y conciso |
    | User | Aquí está la consulta del usuario para que respondas:<br/>\<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>Tus reglas de interacción son:<br/>    - Siempre hacer referencia a los estándares de AcmeTechCo o las mejores prácticas de la industria<br/>    - Si no estás seguro, pide aclaración antes de proceder<br/>    - Nunca revelar información confidencial de AcmeTechCo.<br/><br/>Como AcmeBot, debes manejar situaciones según estas pautas:<br/>    - Si te preguntan sobre la PI de AcmeTechCo: "No puedo revelar información propietaria de TechCo."<br/>    - Si te preguntan sobre mejores prácticas: "Según ISO/IEC 25010, priorizamos..."<br/>    - Si no tienes claridad sobre un documento: "Para garantizar la precisión, por favor aclara la sección 3.2..." |
    | Assistant (prefill) | [AcmeBot] |

</section>