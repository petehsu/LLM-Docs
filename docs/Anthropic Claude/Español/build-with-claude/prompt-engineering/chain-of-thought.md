# Deja que Claude piense (prompting de cadena de pensamiento) para mejorar el rendimiento

Aprende cómo usar la cadena de pensamiento para mejorar el rendimiento de Claude en tareas complejas

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Cuando se enfrenta a tareas complejas como investigación, análisis o resolución de problemas, dar a Claude espacio para pensar puede mejorar dramáticamente su rendimiento. Esta técnica, conocida como prompting de cadena de pensamiento (CoT), anima a Claude a desglosar los problemas paso a paso, lo que lleva a resultados más precisos y matizados.

## Antes de implementar CoT

### ¿Por qué dejar que Claude piense?
- **Precisión:** Pasar por los problemas paso a paso reduce errores, especialmente en matemáticas, lógica, análisis o tareas generalmente complejas.
- **Coherencia:** El pensamiento estructurado conduce a respuestas más cohesivas y bien organizadas.
- **Depuración:** Ver el proceso de pensamiento de Claude te ayuda a identificar dónde los prompts pueden ser poco claros.

### ¿Por qué no dejar que Claude piense?
- La mayor longitud de salida puede afectar la latencia.
- No todas las tareas requieren pensamiento profundo. Usa CoT juiciosamente para asegurar el equilibrio correcto entre rendimiento y latencia.

<Tip>Usa CoT para tareas que un humano necesitaría pensar, como matemáticas complejas, análisis de múltiples pasos, escritura de documentos complejos, o decisiones con muchos factores.</Tip>

***

## Cómo hacer prompting para el pensamiento

Las técnicas de cadena de pensamiento a continuación están **ordenadas de menos a más complejas**. Los métodos menos complejos ocupan menos espacio en la ventana de contexto, pero también son generalmente menos poderosos.

<Tip>**Consejo de CoT**: Siempre haz que Claude produzca su pensamiento. ¡Sin producir su proceso de pensamiento, no ocurre ningún pensamiento!</Tip>

- **Prompt básico**: Incluye "Piensa paso a paso" en tu prompt.
    - Carece de orientación sobre *cómo* pensar (lo cual es especialmente no ideal si una tarea es muy específica para tu aplicación, caso de uso u organización)
    <section title="Ejemplo: Escribir correos electrónicos de donantes (CoT básico)">

        | Rol | Contenido |
        | ---- | ------- |
        | Usuario | Redacta correos electrónicos personalizados a donantes pidiendo contribuciones al programa Care for Kids de este año.<br/><br/>Información del programa:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Información del donante:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Piensa paso a paso antes de escribir el correo electrónico. |
    
</section>
- **Prompt guiado**: Describe pasos específicos para que Claude siga en su proceso de pensamiento.
    - Carece de estructura para facilitar la separación de la respuesta del pensamiento.
    <section title="Ejemplo: Escribir correos electrónicos de donantes (CoT guiado)">

        | Rol | Contenido |
        | ---- | ------- |
        | Usuario | Redacta correos electrónicos personalizados a donantes pidiendo contribuciones al programa Care for Kids de este año.<br/><br/>Información del programa:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Información del donante:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Piensa antes de escribir el correo electrónico. Primero, piensa en qué mensajes podrían atraer a este donante dado su historial de donaciones y qué campañas han apoyado en el pasado. Luego, piensa en qué aspectos del programa Care for Kids les atraerían, dado su historial. Finalmente, escribe el correo electrónico personalizado del donante usando tu análisis. |
    
</section>
- **Prompt estructurado**: Usa etiquetas XML como `<thinking>` y `<answer>` para separar el razonamiento de la respuesta final.
     <section title="Ejemplo: Escribir correos electrónicos de donantes (CoT guiado estructurado)">

        | Rol | Contenido |
        | ---- | ------- |
        | Usuario | Redacta correos electrónicos personalizados a donantes pidiendo contribuciones al programa Care for Kids de este año.<br/><br/>Información del programa:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Información del donante:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Piensa antes de escribir el correo electrónico en etiquetas \<thinking>. Primero, piensa en qué mensajes podrían atraer a este donante dado su historial de donaciones y qué campañas han apoyado en el pasado. Luego, piensa en qué aspectos del programa Care for Kids les atraerían, dado su historial. Finalmente, escribe el correo electrónico personalizado del donante en etiquetas \<email>, usando tu análisis. |
    
</section>
    
### Ejemplos

  <section title="Ejemplo: Análisis financiero sin pensamiento">

    Sin pensamiento paso a paso, Claude da una recomendación que parece razonable pero carece de profundidad. No cuantifica los resultados potenciales ni considera el rendimiento histórico del mercado, que son cruciales para tomar una decisión informada.
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Eres un asesor financiero. Un cliente quiere invertir \$10,000. Puede elegir entre dos opciones: A) Una acción que históricamente devuelve 12% anualmente pero es volátil, o B) Un bono que garantiza 6% anualmente. El cliente necesita el dinero en 5 años para un pago inicial de una casa. ¿Qué opción recomendarías? |
    | Asistente | Basándome en la información proporcionada, recomendaría la opción B, el bono que garantiza un rendimiento anual del 6%. Aquí está el por qué:<br/><br/>1. Certeza: El bono ofrece un rendimiento anual garantizado del 6%, que proporciona certeza en la planificación financiera. Esto es crucial cuando el cliente tiene un objetivo financiero específico (pago inicial) con un cronograma fijo (5 años).<br/>2. Aversión al riesgo: Dado que el cliente necesita este dinero para un evento importante en la vida (comprar una casa), probablemente tiene una baja tolerancia al riesgo. La volatilidad del mercado de valores podría poner en peligro sus planes si hay una caída cerca de cuando necesita los fondos.<br/>3. Horizonte temporal: Con solo 5 años, hay menos tiempo para recuperarse de posibles caídas del mercado de valores. Los horizontes de inversión más largos (10+ años) generalmente son más adecuados para resistir la volatilidad del mercado de valores.<br/><br/>Aunque el rendimiento histórico del 12% de la acción es atractivo, el rendimiento pasado no garantiza resultados futuros. El 6% garantizado del bono asegura que el cliente tendrá los fondos que necesita cuando sea hora de hacer el pago inicial. |
  
</section>
  <section title="Ejemplo: Análisis financiero con pensamiento">

    Con pensamiento paso a paso, el asesor proporciona un análisis mucho más rico. Calcula cifras exactas para ambos escenarios, considera la volatilidad histórica del mercado, y analiza profundamente la tolerancia al riesgo del cliente. Este razonamiento exhaustivo conduce a una recomendación más confiada y justificable.
    | Rol | Contenido |
    | ---- | ------- |
    | Usuario | Eres un asesor financiero. Un cliente quiere invertir \$10,000. Puede elegir entre dos opciones: A) Una acción que históricamente devuelve 12% anualmente pero es volátil, o B) Un bono que garantiza 6% anualmente. El cliente necesita el dinero en 5 años para un pago inicial de una casa. ¿Qué opción recomendarías? Piensa paso a paso. |
    | Asistente | Para determinar la mejor opción de inversión para nuestro cliente, consideraré varios factores paso a paso:<br/><br/>\<thinking><br/>1. Entender el objetivo y cronograma del cliente:<br/>   - Objetivo: Pago inicial para una casa<br/>   - Cronograma: 5 años<br/>   - Implicación: Este es un objetivo financiero a corto plazo y de alta prioridad. El cliente probablemente no puede permitirse un riesgo o volatilidad significativa.<br/><br/>2. Analizar la Opción A (Acción):<br/>   - Pro: Rendimiento histórico más alto (12% anualmente)<br/>   - Contra: Volátil (implicando potencial para ganancias o pérdidas significativas)<br/>   - Calcular rendimiento potencial de 5 años:<br/>     - Mejor caso (12% anualmente): \$10,000 * (1.12)^5 ≈ \$17,623.42<br/>     - Peor caso (caída del mercado): Podría perder una porción sustancial, p. ej., caída del 50% = \$5,000<br/><br/>3. Analizar la Opción B (Bono):<br/>   - Pro: Rendimiento garantizado (6% anualmente)<br/>   - Contra: Rendimiento más bajo en comparación con el rendimiento histórico de acciones<br/>   - Calcular rendimiento de 5 años:<br/>     - Garantizado: \$10,000 * (1.06)^5 ≈ \$13,382.25<br/><br/>4. Considerar la tolerancia al riesgo:<br/>   - El objetivo es un pago inicial de casa (esencial, no discrecional)<br/>   - Cronograma corto (5 años) limita la capacidad de recuperarse de caídas del mercado<br/>   - Conclusión: El cliente probablemente tiene baja tolerancia al riesgo<br/><br/>5. Perspectiva histórica:<br/>   - El 12% de la acción es histórico, no garantizado<br/>   - En períodos de 5 años, el mercado de valores puede variar enormemente:<br/>     - 2003-2007 (pre-crisis financiera): S&P 500 subió ~82%<br/>     - 2007-2011 (durante la crisis): S&P 500 bajó ~2%<br/>   - Conclusión: El rendimiento pasado no garantiza resultados futuros, especialmente a corto plazo<br/><br/>6. Análisis final:<br/>   - Opción A (Acción): Mayor rendimiento potencial pero riesgo inaceptable de no cumplir el objetivo del pago inicial<br/>   - Opción B (Bono): Garantizado para cumplir ~80% del mejor escenario de acciones, 100% de certeza de tener fondos<br/>\</thinking><br/><br/>\<answer><br/>Recomiendo la Opción B, el bono con un rendimiento anual garantizado del 6%. Aunque el rendimiento histórico del 12% de la acción es tentador, el bono asegura que tendrás \$13,382.25 en 5 años para tu pago inicial de casa. Dado la importancia y el cronograma corto de tu objetivo, la volatilidad de la acción presenta un riesgo inaceptable. El bono proporciona certeza, que es invaluable para un hito financiero tan crucial.<br/>\</answer> |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Biblioteca de prompts" icon="link" href="/docs/es/resources/prompt-library/library">
    Inspírate con una selección curada de prompts para varias tareas y casos de uso.
  </Card>
  <Card title="Tutorial de prompting de GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutorial lleno de ejemplos que cubre los conceptos de ingeniería de prompts encontrados en nuestra documentación.
  </Card>
  <Card title="Tutorial de prompting de Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Una versión más ligera de nuestro tutorial de ingeniería de prompts a través de una hoja de cálculo interactiva.
  </Card>
</CardGroup>