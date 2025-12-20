# Usa ejemplos (multishot prompting) para guiar el comportamiento de Claude

Aprende cómo usar ejemplos en tus prompts para mejorar la precisión, consistencia y calidad de las respuestas de Claude

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Los ejemplos son tu arma secreta para lograr que Claude genere exactamente lo que necesitas. Al proporcionar algunos ejemplos bien elaborados en tu prompt, puedes mejorar dramáticamente la precisión, consistencia y calidad de las salidas de Claude.
Esta técnica, conocida como few-shot o multishot prompting, es particularmente efectiva para tareas que requieren salidas estructuradas o adherencia a formatos específicos.

<Tip>**Potencia tus prompts**: Incluye 3-5 ejemplos diversos y relevantes para mostrar a Claude exactamente lo que quieres. Más ejemplos = mejor rendimiento, especialmente para tareas complejas.</Tip>

## ¿Por qué usar ejemplos?

- **Precisión**: Los ejemplos reducen la mala interpretación de las instrucciones.
- **Consistencia**: Los ejemplos refuerzan la estructura y el estilo uniforme.
- **Rendimiento**: Los ejemplos bien elegidos mejoran la capacidad de Claude para manejar tareas complejas.

## Elaboración de ejemplos efectivos

Para máxima efectividad, asegúrate de que tus ejemplos sean:
- **Relevantes**: Tus ejemplos reflejan tu caso de uso real.
- **Diversos**: Tus ejemplos cubren casos extremos y desafíos potenciales, y varían lo suficiente para que Claude no capte inadvertidamente patrones no intencionados.
- **Claros**: Tus ejemplos están envueltos en etiquetas `<example>` (si hay múltiples, anidadas dentro de etiquetas `<examples>`) para estructura.

<Tip>Pídele a Claude que evalúe tus ejemplos por relevancia, diversidad o claridad. O haz que Claude genere más ejemplos basados en tu conjunto inicial.</Tip>
<section title="Ejemplo: Análisis de comentarios de clientes">

    Observa que en la versión "sin ejemplos", Claude no enumera múltiples opciones para cada categoría, a pesar de que su análisis escrito indica que hay múltiples categorías para ciertos comentarios. También incluye una explicación larga cuando es posible que no la queramos.

    | Rol | Sin ejemplos | Con ejemplos |
    | --- | --- | --- |
    | Usuario | Analiza este comentario de cliente y categoriza los problemas. Usa estas categorías: UI/UX, Performance, Feature Request, Integration, Pricing, y Other. También califica el sentimiento (Positive/Neutral/Negative) y la prioridad (High/Medium/Low).<br/><br/>Aquí está el comentario: \{\{FEEDBACK\}\} | Nuestro equipo de CS está abrumado con comentarios no estructurados. Tu tarea es analizar comentarios y categorizar problemas para nuestros equipos de producto e ingeniería. Usa estas categorías: UI/UX, Performance, Feature Request, Integration, Pricing, y Other. También califica el sentimiento (Positive/Neutral/Negative) y la prioridad (High/Medium/Low). Aquí hay un ejemplo:<br/><br/>\<example><br/>Input: The new dashboard is a mess! It takes forever to load, and I can't find the export button. Fix this ASAP!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High\</example><br/><br/>Ahora, analiza este comentario: \{\{FEEDBACK\}\} |
    | Asistente (respuesta de Claude) | Aquí está el análisis del comentario del cliente:<br/><br/>Issue: UI/UX<br/>Sentiment: Negative<br/>Priority: High<br/>El cliente está frustrado con el nuevo diseño del dashboard, que encuentra desordenado y lento de cargar. Específicamente señalan el botón "export" faltante, que probablemente es una característica crítica. Este problema necesita ser abordado como una prioridad alta.<br/><br/>Issue: Integration<br/>Sentiment: Positive<br/>Priority: Medium<br/>El cliente está satisfecho con la integración existente de Salesforce pero le gustaría ver soporte para Hubspot también. Esta es una solicitud de característica que podría considerarse para una actualización futura del producto.<br/><br/>Issue: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/>El cliente encuentra que el precio es irrazonable, especialmente para las características básicas. Están amenazando con cambiar a un competidor, por lo que este es un problema de alta prioridad que necesita ser revisado.<br/><br/>Issue: Performance<br/>Sentiment Negative<br/>Priority: High<br/>El cliente está experimentando problemas críticos con la aplicación móvil, donde las cargas de archivos grandes resultan consistentemente en bloqueos. Este es un problema significativo que impacta la capacidad del cliente de usar el producto efectivamente y debe ser abordado como una prioridad alta.<br/><br/>Issue: UI/UX<br/>Sentiment: Positive<br/>Priority: Low<br/>El cliente está generalmente satisfecho con el producto, específicamente señalando la UI intuitiva y el excelente soporte al cliente. Este es un comentario positivo que no requiere ninguna acción inmediata. | Aquí está el análisis del comentario del cliente:<br/><br/>1. The new dashboard is a mess! It takes forever to load, and I can't find the export button. Fix this ASAP!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>2. Love the Salesforce integration! But it'd be great if you could add Hubspot too.<br/>Category: Integration, Feature Request<br/>Sentiment: Positive<br/>Priority: Medium<br/><br/>3. Your pricing is ridiculous! $99/mo for basic features? I'm switching to Competitor X.<br/>Category: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/><br/>4. The mobile app keeps crashing when I try to upload large files (>50MB). This is critical for our field agents.<br/>Category: Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>5. Overall, I'm happy with the product. The UI is intuitive, and the customer support is top-notch. Keep it up!<br/>Category: UI/UX, Other (Customer Support)<br/>Sentiment: Positive<br/>Priority: Low |

</section>

***

<CardGroup cols={3}>
  <Card title="Librería de prompts" icon="link" href="/docs/es/resources/prompt-library/library">
    Inspírate con una selección curada de prompts para varias tareas y casos de uso.
  </Card>
  <Card title="Tutorial de prompting de GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutorial lleno de ejemplos que cubre los conceptos de ingeniería de prompts encontrados en nuestra documentación.
  </Card>
  <Card title="Tutorial de prompting de Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Una versión más ligera de nuestro tutorial de ingeniería de prompts a través de una hoja de cálculo interactiva.
  </Card>
</CardGroup>