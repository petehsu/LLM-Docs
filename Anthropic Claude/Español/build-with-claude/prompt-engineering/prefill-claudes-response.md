# Prefill de la respuesta de Claude para mayor control de salida

Aprende cómo prefill la respuesta de Claude para guiar sus acciones, omitir preámbulos, aplicar formatos específicos y mantener la coherencia de personajes.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

<Note>
El prefill solo está disponible para modos sin pensamiento extendido. Actualmente no es compatible con pensamiento extendido.
</Note>

Cuando usas Claude, tienes la capacidad única de guiar sus respuestas prefillando el mensaje `Assistant`. Esta técnica poderosa te permite dirigir las acciones de Claude, omitir preámbulos, aplicar formatos específicos como JSON o XML, e incluso ayudar a Claude a mantener la coherencia de personajes en escenarios de juego de rol.

En algunos casos donde Claude no está funcionando como se espera, algunas oraciones prefilladas pueden mejorar enormemente el desempeño de Claude. ¡Un poco de prefill va muy lejos!

## Cómo prefill la respuesta de Claude

Para prefill, incluye el texto inicial deseado en el mensaje `Assistant` (la respuesta de Claude continuará desde donde termina el mensaje `Assistant`):

```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is your favorite color?"},
        {"role": "assistant", "content": "As an AI assistant, I don't have a favorite color, But if I had to pick, it would be green because"}  # Prefill here
    ]
)
```

<Warning>
  El contenido del prefill no puede terminar con espacios en blanco. Un prefill como `"As an AI assistant, I "` (con un espacio al final) resultará en un error.
</Warning>

### Ejemplos

#### Ejemplo 1: Controlando el formato de salida y omitiendo el preámbulo

<Tip>**Consejo para usuarios avanzados**: Prefilling `{` obliga a Claude a omitir el preámbulo y generar directamente el objeto JSON. Esto es más limpio, más conciso y más fácil de analizar para los programas sin procesamiento adicional.
Para una salida JSON garantizada que se ajuste a un esquema específico, considera usar [Structured Outputs](/docs/es/build-with-claude/structured-outputs) en lugar de prefill. Los structured outputs garantizan que la respuesta de Claude siempre coincida con tu esquema JSON definido, lo que es ideal para aplicaciones de producción que requieren cumplimiento estricto del formato.</Tip>

    <section title="Ejemplo: Extracción de datos estructurados sin prefilling">

    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Extrae el nombre, tamaño, precio y color de esta descripción de producto como un objeto JSON:<br/><br/>\<description><br/>El SmartHome Mini es un asistente inteligente compacto disponible en negro o blanco por solo \$49.99. Con solo 5 pulgadas de ancho, te permite controlar luces, termostatos y otros dispositivos conectados por voz o aplicación, sin importar dónde lo coloques en tu hogar. Este pequeño concentrador asequible brinda control práctico conveniente a tus dispositivos inteligentes.<br/>\</description> |
    | Asistente | Aquí está la información extraída en formato JSON:<br/><br/>\`\`\`json<br/>\{<br/>  "name": "SmartHome Mini",<br/>  "size": "5 inches wide",<br/>  "price": "\$49.99",<br/>  "colors": ["black", "white"]<br/>\}<br/>\`\`\`<br/><br/>He extraído los siguientes detalles de la descripción del producto:<br/>- **Nombre**: SmartHome Mini<br/>- **Tamaño**: 5 pulgadas de ancho<br/>- **Precio**: \$49.99<br/>- **Colores**: Disponible en negro y blanco<br/><br/>El objeto JSON proporciona un formato estructurado que es fácil de analizar y usar para los programas. ¡Avísame si necesitas alguna modificación o tienes otras preguntas! |
    
</section>

    <section title="Ejemplo: Extracción de datos estructurados con prefilling">

    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Extrae el nombre, tamaño, precio y color de esta descripción de producto como un objeto JSON:<br/><br/>\<description><br/>El SmartHome Mini es un asistente inteligente compacto disponible en negro o blanco por solo \$49.99. Con solo 5 pulgadas de ancho, te permite controlar luces, termostatos y otros dispositivos conectados por voz o aplicación, sin importar dónde lo coloques en tu hogar. Este pequeño concentrador asequible brinda control práctico conveniente a tus dispositivos inteligentes.<br/>\</description> |
    | Asistente (prefill) | \{ |
    | Asistente (respuesta de Claude) | "name": "SmartHome Mini",<br/>"size": "5 inches wide",<br/>"price": "\$49.99",<br/>"colors": [<br/>  "black",<br/>  "white"<br/>]<br/>\} |
    
</section>

#### Ejemplo 2: Manteniendo el personaje en escenarios de juego de rol

<Tip>**Consejo de juego de rol**: Prefilling un `[ROLE_NAME]` entre corchetes puede recordarle a Claude que se mantenga en personaje, incluso para conversaciones más largas y complejas. Esto es especialmente poderoso cuando se combina con role prompting en el parámetro `system`.</Tip>

    <section title="Ejemplo: Manteniendo el personaje sin role prompting">

    | Rol | Contenido |
    | ---- | ------- |
    | Usuario (50 turnos de conversación con Claude como "Sherlock Holmes") | ¿Qué deduces sobre el dueño de este zapato? \<image>muddy_shoe.jpg\</image> |
    | Asistente | Como asistente de IA, estaría feliz de analizar la imagen de un zapato embarrado como si la hubieras proporcionado. Aquí está mi deducción... |
    
</section>

    <section title="Ejemplo: Manteniendo el personaje con role prompting">

    | Rol | Contenido |
    | ---- | ------- |
    | Usuario (50 turnos de conversación con Claude como "Sherlock Holmes") | ¿Qué deduces sobre el dueño de este zapato? <br/>\<image>muddy_shoe.jpg\</image> |
    | Asistente (prefill) | [Sherlock Holmes] |
    | Asistente (respuesta de Claude) | ¡Ah, qué tenemos aquí! Un espécimen más que curioso, ¡Watson! Examinemos este zapato con ojo perspicaz. El barro, ves, no es la arcilla común de Londres, sino más bien el matiz rojizo distintivo del suelo rico en hierro que se encuentra solo en los alrededores de Hampstead Heath. Y sin embargo, el desgaste en la suela sugiere un andar más adecuado para los adoquines de Whitechapel que para las suaves pendientes de Heath.<br/><br/>¡Ahora, observa los cordones! Están atados con un nudo particular favorecido por aquellos en la profesión médica, sin duda un hábito adquirido durante años de atar batas quirúrgicas. Pero las marcas de rozadura en la caja de los dedos cuentan una historia diferente: son consistentes con el movimiento de patada que uno podría emplear en las artes marciales, específicamente Baritsu.<br/><br/>Podemos concluir, entonces, que nuestro dueño del zapato ausente es un médico, posiblemente un cirujano, que reside en Whitechapel pero frecuenta Hampstead Heath, quizás para una práctica secreta de Baritsu, lejos de miradas indiscretas. ¡Un caso más que intrigante, Watson! Debemos apresurarnos; ¡el juego está en marcha! |
    
</section>

---

<CardGroup cols={3}>
  <Card title="Trabajando con Mensajes" icon="messages" href="/docs/es/build-with-claude/working-with-messages">
    Ve más ejemplos de prefill y otros patrones de la API de Mensajes.
  </Card>
  <Card title="Biblioteca de prompts" icon="link" href="/docs/es/resources/prompt-library/library">
    Inspírate con una selección curada de prompts para varias tareas y casos de uso.
  </Card>
  <Card title="Tutorial de prompting en GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutorial lleno de ejemplos que cubre los conceptos de ingeniería de prompts encontrados en nuestra documentación.
  </Card>
  <Card title="Tutorial de prompting en Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Una versión más ligera de nuestro tutorial de ingeniería de prompts a través de una hoja de cálculo interactiva.
  </Card>
</CardGroup>