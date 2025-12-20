# Descripción general de la ingeniería de prompts

Aprende técnicas de ingeniería de prompts para mejorar el rendimiento de Claude

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

## Antes de la ingeniería de prompts

Esta guía asume que tienes:
1. Una definición clara de los criterios de éxito para tu caso de uso
2. Algunas formas de probar empíricamente contra esos criterios
3. Un primer borrador de prompt que deseas mejorar

Si no es así, te sugerimos que dediques tiempo a establecer eso primero. Consulta [Define tus criterios de éxito](/docs/es/test-and-evaluate/define-success) y [Crea evaluaciones empíricas sólidas](/docs/es/test-and-evaluate/develop-tests) para obtener consejos y orientación.

<Card title="Generador de prompts" icon="link" href="/dashboard">
  ¿No tienes un primer borrador de prompt? ¡Prueba el generador de prompts en la Consola de Claude!
</Card>

***

## Cuándo hacer ingeniería de prompts

  Esta guía se enfoca en criterios de éxito que se pueden controlar a través de la ingeniería de prompts.
  No todos los criterios de éxito o evaluaciones fallidas se resuelven mejor con ingeniería de prompts. Por ejemplo, la latencia y el costo a veces se pueden mejorar más fácilmente seleccionando un modelo diferente.

<section title="Prompting vs. fine-tuning">

  La ingeniería de prompts es mucho más rápida que otros métodos de control del comportamiento del modelo, como el fine-tuning, y a menudo puede producir saltos de rendimiento en mucho menos tiempo. Aquí hay algunas razones para considerar la ingeniería de prompts sobre el fine-tuning:<br/>
  - **Eficiencia de recursos**: El fine-tuning requiere GPUs de alta gama y mucha memoria, mientras que la ingeniería de prompts solo necesita entrada de texto, lo que la hace mucho más amigable con los recursos.
  - **Rentabilidad**: Para servicios de IA basados en la nube, el fine-tuning incurre en costos significativos. La ingeniería de prompts utiliza el modelo base, que es típicamente más barato.
  - **Mantenimiento de actualizaciones de modelos**: Cuando los proveedores actualizan modelos, las versiones fine-tuned podrían necesitar reentrenamiento. Los prompts generalmente funcionan en todas las versiones sin cambios.
  - **Ahorro de tiempo**: El fine-tuning puede tomar horas o incluso días. En contraste, la ingeniería de prompts proporciona resultados casi instantáneos, permitiendo la resolución rápida de problemas.
  - **Necesidades mínimas de datos**: El fine-tuning necesita datos sustanciales específicos de tareas y etiquetados, que pueden ser escasos o costosos. La ingeniería de prompts funciona con aprendizaje de pocos ejemplos o incluso de cero ejemplos.
  - **Flexibilidad e iteración rápida**: Prueba rápidamente varios enfoques, ajusta prompts y ve resultados inmediatos. Esta experimentación rápida es difícil con el fine-tuning.
  - **Adaptación de dominio**: Adapta fácilmente modelos a nuevos dominios proporcionando contexto específico del dominio en prompts, sin reentrenamiento.
  - **Mejoras de comprensión**: La ingeniería de prompts es mucho más efectiva que el fine-tuning para ayudar a los modelos a comprender mejor y utilizar contenido externo como documentos recuperados
  - **Preserva el conocimiento general**: El fine-tuning corre el riesgo de olvido catastrófico, donde el modelo pierde conocimiento general. La ingeniería de prompts mantiene las amplias capacidades del modelo.
  - **Transparencia**: Los prompts son legibles por humanos, mostrando exactamente qué información recibe el modelo. Esta transparencia ayuda a entender y depurar.

</section>

***

## Cómo hacer ingeniería de prompts

Las páginas de ingeniería de prompts en esta sección se han organizado desde técnicas más ampliamente efectivas hasta técnicas más especializadas. Al solucionar problemas de rendimiento, te sugerimos que pruebes estas técnicas en orden, aunque el impacto real de cada técnica dependerá de tu caso de uso.
1. [Generador de prompts](/docs/es/build-with-claude/prompt-engineering/prompt-generator)
2. [Sé claro y directo](/docs/es/build-with-claude/prompt-engineering/be-clear-and-direct)
3. [Usa ejemplos (multishot)](/docs/es/build-with-claude/prompt-engineering/multishot-prompting)
4. [Deja que Claude piense (cadena de pensamiento)](/docs/es/build-with-claude/prompt-engineering/chain-of-thought)
5. [Usa etiquetas XML](/docs/es/build-with-claude/prompt-engineering/use-xml-tags)
6. [Dale a Claude un rol (prompts del sistema)](/docs/es/build-with-claude/prompt-engineering/system-prompts)
7. [Rellena previamente la respuesta de Claude](/docs/es/build-with-claude/prompt-engineering/prefill-claudes-response)
8. [Encadena prompts complejos](/docs/es/build-with-claude/prompt-engineering/chain-prompts)
9. [Consejos de contexto largo](/docs/es/build-with-claude/prompt-engineering/long-context-tips)

***

## Tutorial de ingeniería de prompts

¡Si eres un aprendiz interactivo, puedes sumergirte en nuestros tutoriales interactivos en su lugar!

<CardGroup cols={2}>
  <Card title="Tutorial de prompting de GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Un tutorial lleno de ejemplos que cubre los conceptos de ingeniería de prompts que se encuentran en nuestra documentación.
  </Card>
  <Card title="Tutorial de prompting de Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Una versión más ligera de nuestro tutorial de ingeniería de prompts a través de una hoja de cálculo interactiva.
  </Card>
</CardGroup>