# Define tus criterios de éxito

---

Construir una aplicación exitosa basada en LLM comienza con definir claramente tus criterios de éxito. ¿Cómo sabrás cuándo tu aplicación es lo suficientemente buena para publicarla?

Tener criterios de éxito claros asegura que tus esfuerzos de ingeniería y optimización de prompts estén enfocados en lograr objetivos específicos y medibles.

***

## Construyendo criterios sólidos

Los buenos criterios de éxito son:
- **Específicos**: Define claramente lo que quieres lograr. En lugar de "buen rendimiento", especifica "clasificación precisa de sentimientos".
- **Medibles**: Utiliza métricas cuantitativas o escalas cualitativas bien definidas. Los números proporcionan claridad y escalabilidad, pero las medidas cualitativas pueden ser valiosas si se aplican consistentemente *junto* con medidas cuantitativas.
    - Incluso temas "difusos" como la ética y la seguridad pueden cuantificarse:
        |      | Criterios de seguridad                |
        | ---- | --- |
        | Malo  | Resultados seguros                   |
        | Bueno | Menos del 0.1% de los resultados de 10,000 pruebas marcados por toxicidad por nuestro filtro de contenido. | 
    <section title="Ejemplos de métricas y métodos de medición">

        **Métricas cuantitativas**:
            - Específicas de la tarea: Puntuación F1, puntuación BLEU, perplejidad
            - Genéricas: Precisión, exactitud, exhaustividad
            - Operacionales: Tiempo de respuesta (ms), tiempo de actividad (%)

        **Métodos cuantitativos**:
            - Pruebas A/B: Comparar el rendimiento contra un modelo de referencia o una versión anterior.
            - Retroalimentación del usuario: Medidas implícitas como tasas de finalización de tareas.
            - Análisis de casos extremos: Porcentaje de casos extremos manejados sin errores.

        **Escalas cualitativas**:
            - Escalas Likert: "Califica la coherencia de 1 (sin sentido) a 5 (perfectamente lógico)"
            - Rúbricas de expertos: Lingüistas evaluando la calidad de traducción según criterios definidos        
    
</section>
- **Alcanzables**: Basa tus objetivos en puntos de referencia de la industria, experimentos previos, investigación de IA o conocimiento experto. Tus métricas de éxito no deben ser irrealistas para las capacidades actuales de los modelos de vanguardia.
- **Relevantes**: Alinea tus criterios con el propósito de tu aplicación y las necesidades del usuario. La precisión de las citas podría ser crítica para aplicaciones médicas pero menos importante para chatbots casuales.

<section title="Ejemplo de criterios de fidelidad de tarea para análisis de sentimiento">

    |      | Criterios |
    | ---- | --- |
    | Malo  | El modelo debe clasificar bien los sentimientos                    |
    | Bueno | Nuestro modelo de análisis de sentimiento debe lograr una puntuación F1 de al menos 0.85 (Medible, Específico) en un conjunto de prueba reservado* de 10,000 publicaciones diversas de Twitter (Relevante), lo que representa una mejora del 5% sobre nuestra línea base actual (Alcanzable). |

    **Más sobre conjuntos de prueba reservados en la siguiente sección*

</section>

***

## Criterios de éxito comunes a considerar

Aquí hay algunos criterios que podrían ser importantes para tu caso de uso. Esta lista no es exhaustiva.

  <section title="Fidelidad de la tarea">

    ¿Qué tan bien necesita desempeñarse el modelo en la tarea? También puede que necesites considerar el manejo de casos extremos, como qué tan bien debe desempeñarse el modelo en entradas raras o desafiantes.
  
</section>
  <section title="Consistencia">

    ¿Qué tan similares deben ser las respuestas del modelo para tipos similares de entrada? Si un usuario hace la misma pregunta dos veces, ¿qué tan importante es que obtenga respuestas semánticamente similares?
  
</section>
  <section title="Relevancia y coherencia">

    ¿Qué tan bien aborda el modelo directamente las preguntas o instrucciones del usuario? ¿Qué tan importante es que la información se presente de manera lógica y fácil de seguir?
  
</section>
  <section title="Tono y estilo">

    ¿Qué tan bien coincide el estilo de salida del modelo con las expectativas? ¿Qué tan apropiado es su lenguaje para la audiencia objetivo?
  
</section>
  <section title="Preservación de la privacidad">

    ¿Cuál es una métrica exitosa para cómo el modelo maneja información personal o sensible? ¿Puede seguir instrucciones para no usar o compartir ciertos detalles?
  
</section>
  <section title="Utilización del contexto">

    ¿Qué tan efectivamente utiliza el modelo el contexto proporcionado? ¿Qué tan bien hace referencia y se basa en la información dada en su historial?
  
</section>
  <section title="Latencia">

    ¿Cuál es el tiempo de respuesta aceptable para el modelo? Esto dependerá de los requisitos en tiempo real de tu aplicación y las expectativas del usuario.
  
</section>
  <section title="Precio">

    ¿Cuál es tu presupuesto para ejecutar el modelo? Considera factores como el costo por llamada a la API, el tamaño del modelo y la frecuencia de uso.
  
</section>

La mayoría de los casos de uso necesitarán una evaluación multidimensional a lo largo de varios criterios de éxito.

<section title="Ejemplo de criterios multidimensionales para análisis de sentimiento">

    |      | Criterios |
    | ---- | --- |
    | Malo  | El modelo debe clasificar bien los sentimientos                    |
    | Bueno | En un conjunto de prueba reservado de 10,000 publicaciones diversas de Twitter, nuestro modelo de análisis de sentimiento debe lograr:<br/>- una puntuación F1 de al menos 0.85<br/>- 99.5% de los resultados no son tóxicos<br/>- 90% de los errores causarían inconvenientes, no errores graves*<br/>- 95% tiempo de respuesta < 200ms |

    **En realidad, también definiríamos qué significa "inconveniente" y "grave".*

</section>

***

## Próximos pasos

<CardGroup cols={2}>
  <Card title="Haz una lluvia de ideas de criterios" icon="link" href="https://claude.ai/">
    Haz una lluvia de ideas de criterios de éxito para tu caso de uso con Claude en claude.ai.<br/><br/>**Consejo**: ¡Incluye esta página en el chat como guía para Claude!
  </Card>
  <Card title="Diseña evaluaciones" icon="link" href="/docs/es/be-clear-direct">
    Aprende a construir conjuntos de prueba sólidos para medir el rendimiento de Claude según tus criterios.
  </Card>
</CardGroup>