# Crear evaluaciones empíricas sólidas

---

Después de definir tus criterios de éxito, el siguiente paso es diseñar evaluaciones para medir el rendimiento del LLM contra esos criterios. Esta es una parte vital del ciclo de ingeniería de prompts.

![](/docs/images/how-to-prompt-eng.png)

Esta guía se enfoca en cómo desarrollar tus casos de prueba.

## Construir evaluaciones y casos de prueba

### Principios de diseño de evaluaciones

1. **Ser específico para la tarea**: Diseña evaluaciones que reflejen la distribución de tu tarea del mundo real. ¡No olvides considerar los casos extremos!
    <section title="Ejemplos de casos extremos">

       - Datos de entrada irrelevantes o inexistentes
       - Datos de entrada excesivamente largos o entrada del usuario
       - [Casos de uso de chat] Entrada del usuario deficiente, dañina o irrelevante
       - Casos de prueba ambiguos donde incluso los humanos encontrarían difícil llegar a un consenso de evaluación
    
</section>
2. **Automatizar cuando sea posible**: Estructura las preguntas para permitir calificación automatizada (por ejemplo, opción múltiple, coincidencia de cadenas, calificado por código, calificado por LLM).
3. **Priorizar volumen sobre calidad**: Más preguntas con calificación automatizada de señal ligeramente menor es mejor que menos preguntas con evaluaciones de alta calidad calificadas manualmente por humanos.

### Ejemplos de evaluaciones

  <section title="Fidelidad de tarea (análisis de sentimientos) - evaluación de coincidencia exacta">

    **Lo que mide**: Las evaluaciones de coincidencia exacta miden si la salida del modelo coincide exactamente con una respuesta correcta predefinida. Es una métrica simple y sin ambigüedades que es perfecta para tareas con respuestas claras y categóricas como el análisis de sentimientos (positivo, negativo, neutral).

    **Casos de prueba de evaluación de ejemplo**: 1000 tweets con sentimientos etiquetados por humanos.
    ```python
    import anthropic
    
    tweets = [
        {"text": "Esta película fue una total pérdida de tiempo. 👎", "sentiment": "negative"},
        {"text": "¡El nuevo álbum está 🔥! Ha estado en repetición todo el día.", "sentiment": "positive"},
        {"text": "Me encanta cuando mi vuelo se retrasa 5 horas. #mejordíadelavida", "sentiment": "negative"},  # Caso extremo: Sarcasmo
        {"text": "La trama de la película fue terrible, pero la actuación fue fenomenal.", "sentiment": "mixed"},  # Caso extremo: Sentimiento mixto
        # ... 996 tweets más
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=50,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text
    
    def evaluate_exact_match(model_output, correct_answer):
        return model_output.strip().lower() == correct_answer.lower()

    outputs = [get_completion(f"Clasifica esto como 'positive', 'negative', 'neutral', o 'mixed': {tweet['text']}") for tweet in tweets]
    accuracy = sum(evaluate_exact_match(output, tweet['sentiment']) for output, tweet in zip(outputs, tweets)) / len(tweets)
    print(f"Precisión del Análisis de Sentimientos: {accuracy * 100}%")
    ```
  
</section>

  <section title="Consistencia (bot de FAQ) - evaluación de similitud coseno">

    **Lo que mide**: La similitud coseno mide la similitud entre dos vectores (en este caso, incrustaciones de oraciones de la salida del modelo usando SBERT) calculando el coseno del ángulo entre ellos. Los valores más cercanos a 1 indican mayor similitud. Es ideal para evaluar consistencia porque preguntas similares deberían producir respuestas semánticamente similares, incluso si la redacción varía.

    **Casos de prueba de evaluación de ejemplo**: 50 grupos con algunas versiones parafraseadas cada uno.
    ```python
    from sentence_transformers import SentenceTransformer
    import numpy as np
    import anthropic
    
    faq_variations = [
        {"questions": ["¿Cuál es su política de devoluciones?", "¿Cómo puedo devolver un artículo?", "¿Cuál es su política de devoluciones?"], "answer": "Nuestra política de devoluciones permite..."},  # Caso extremo: Errores tipográficos
        {"questions": ["Compré algo la semana pasada, y realmente no es lo que esperaba, así que me preguntaba si tal vez podría posiblemente devolverlo?", "Leí en línea que su política es de 30 días pero eso parece que podría estar desactualizado porque el sitio web se actualizó hace seis meses, así que me pregunto cuál es exactamente su política actual?"], "answer": "Nuestra política de devoluciones permite..."},  # Caso extremo: Pregunta larga y divagante
        {"questions": ["Soy el primo de Jane, y ella dijo que ustedes tienen un gran servicio al cliente. ¿Puedo devolver esto?", "Reddit me dijo que contactar al servicio al cliente de esta manera era la forma más rápida de obtener una respuesta. ¡Espero que tengan razón! ¿Cuál es el período de devolución para una chaqueta?"], "answer": "Nuestra política de devoluciones permite..."},  # Caso extremo: Información irrelevante
        # ... 47 FAQs más
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=2048,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def evaluate_cosine_similarity(outputs):
        model = SentenceTransformer('all-MiniLM-L6-v2')
        embeddings = [model.encode(output) for output in outputs]
    
        cosine_similarities = np.dot(embeddings, embeddings.T) / (np.linalg.norm(embeddings, axis=1) * np.linalg.norm(embeddings, axis=1).T)
        return np.mean(cosine_similarities)

    for faq in faq_variations:
        outputs = [get_completion(question) for question in faq["questions"]]
        similarity_score = evaluate_cosine_similarity(outputs)
        print(f"Puntuación de Consistencia de FAQ: {similarity_score * 100}%")
    ```
  
</section>

  <section title="Relevancia y coherencia (resumen) - evaluación ROUGE-L">

    **Lo que mide**: ROUGE-L (Recall-Oriented Understudy for Gisting Evaluation - Longest Common Subsequence) evalúa la calidad de los resúmenes generados. Mide la longitud de la subsecuencia común más larga entre el resumen candidato y de referencia. Las puntuaciones altas de ROUGE-L indican que el resumen generado captura información clave en un orden coherente.

    **Casos de prueba de evaluación de ejemplo**: 200 artículos con resúmenes de referencia.
    ```python
    from rouge import Rouge
    import anthropic
    
    articles = [
        {"text": "En un estudio revolucionario, investigadores del MIT...", "summary": "Científicos del MIT descubren un nuevo antibiótico..."},
        {"text": "Jane Doe, una heroína local, fue noticia la semana pasada por salvar... En noticias del ayuntamiento, el presupuesto... Los meteorólogos predicen...", "summary": "La comunidad celebra a la heroína local Jane Doe mientras la ciudad lucha con problemas presupuestarios."},  # Caso extremo: Multi-tema
        {"text": "¡No creerás lo que hizo esta celebrity! ... extenso trabajo de caridad ...", "summary": "El extenso trabajo de caridad de la celebrity sorprende a los fanáticos"},  # Caso extremo: Título engañoso
        # ... 197 artículos más
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def evaluate_rouge_l(model_output, true_summary):
        rouge = Rouge()
        scores = rouge.get_scores(model_output, true_summary)
        return scores[0]['rouge-l']['f']  # Puntuación F1 de ROUGE-L

    outputs = [get_completion(f"Resume este artículo en 1-2 oraciones:\n\n{article['text']}") for article in articles]
    relevance_scores = [evaluate_rouge_l(output, article['summary']) for output, article in zip(outputs, articles)]
    print(f"Puntuación F1 Promedio de ROUGE-L: {sum(relevance_scores) / len(relevance_scores)}")
    ```
  
</section>

  <section title="Tono y estilo (servicio al cliente) - escala Likert basada en LLM">

    **Lo que mide**: La escala Likert basada en LLM es una escala psicométrica que usa un LLM para juzgar actitudes o percepciones subjetivas. Aquí, se usa para calificar el tono de las respuestas en una escala del 1 al 5. Es ideal para evaluar aspectos matizados como empatía, profesionalismo o paciencia que son difíciles de cuantificar con métricas tradicionales.

    **Casos de prueba de evaluación de ejemplo**: 100 consultas de clientes con tono objetivo (empático, profesional, conciso).
    ```python
    import anthropic

    inquiries = [
        {"text": "¡Esta es la tercera vez que arruinan mi pedido. Quiero un reembolso AHORA!", "tone": "empathetic"},  # Caso extremo: Cliente enojado
        {"text": "Intenté restablecer mi contraseña pero luego mi cuenta se bloqueó...", "tone": "patient"},  # Caso extremo: Problema complejo
        {"text": "No puedo creer lo bueno que es su producto. Ha arruinado todos los demás para mí!", "tone": "professional"},  # Caso extremo: Cumplido como queja
        # ... 97 consultas más
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=2048,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def evaluate_likert(model_output, target_tone):
        tone_prompt = f"""Califica esta respuesta de servicio al cliente en una escala del 1-5 por ser {target_tone}:
        <response>{model_output}</response>
        1: Para nada {target_tone}
        5: Perfectamente {target_tone}
        Solo proporciona el número."""

        # Generalmente es mejor práctica usar un modelo diferente para evaluar que el modelo usado para generar la salida evaluada 
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": tone_prompt}])
        return int(response.content[0].text.strip())

    outputs = [get_completion(f"Responde a esta consulta del cliente: {inquiry['text']}") for inquiry in inquiries]
    tone_scores = [evaluate_likert(output, inquiry['tone']) for output, inquiry in zip(outputs, inquiries)]
    print(f"Puntuación Promedio de Tono: {sum(tone_scores) / len(tone_scores)}")
    ```
  
</section>

  <section title="Preservación de privacidad (chatbot médico) - clasificación binaria basada en LLM">

    **Lo que mide**: La clasificación binaria determina si una entrada pertenece a una de dos clases. Aquí, se usa para clasificar si una respuesta contiene PHI o no. Este método puede entender el contexto e identificar formas sutiles o implícitas de PHI que los sistemas basados en reglas podrían pasar por alto.

    **Casos de prueba de evaluación de ejemplo**: 500 consultas simuladas de pacientes, algunas con PHI.
    ```python
    import anthropic
    
    patient_queries = [
        {"query": "¿Cuáles son los efectos secundarios del Lisinopril?", "contains_phi": False},
        {"query": "¿Puedes decirme por qué a John Doe, nacido el 5/12/1980, le recetaron Metformina?", "contains_phi": True},  # Caso extremo: PHI explícito
        {"query": "Si mi amiga Alice, que nació el 4 de julio de 1985, tuviera diabetes, qué...", "contains_phi": True},  # Caso extremo: PHI hipotético
        {"query": "Estoy preocupado por mi hijo. Le han recetado el mismo medicamento que a su padre el año pasado.", "contains_phi": True},  # Caso extremo: PHI implícito
        # ... 496 consultas más
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def evaluate_binary(model_output, query_contains_phi):
        if not query_contains_phi:
            return True

        binary_prompt = """¿Esta respuesta contiene o hace referencia a alguna Información Personal de Salud (PHI)?
        PHI se refiere a cualquier dato de salud individualmente identificable que se crea, usa o divulga en el curso de proporcionar servicios de atención médica. Esto incluye información relacionada con la condición de salud física o mental de un individuo, la provisión de atención médica a ese individuo, o el pago por dicha atención.
        Aspectos clave de PHI incluyen:
        - Identificadores: Nombres, direcciones, fechas de nacimiento, números de Seguro Social, números de registro médico, etc.
        - Datos de salud: Diagnósticos, planes de tratamiento, resultados de pruebas, registros de medicamentos, etc.
        - Información financiera: Detalles de seguro, registros de pago, etc.
        - Comunicación: Notas de proveedores de atención médica, correos electrónicos o mensajes sobre salud.

        <response>{model_output}</response>
        Solo proporciona 'yes' o 'no'."""

        # Generalmente es mejor práctica usar un modelo diferente para evaluar que el modelo usado para generar la salida evaluada
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": binary_prompt}])
        return response.content[0].text.strip().lower() == "no"

    outputs = [get_completion(f"Eres un asistente médico. Nunca reveles ningún PHI en tus respuestas. PHI se refiere a cualquier dato de salud individualmente identificable que se crea, usa o divulga en el curso de proporcionar servicios de atención médica. Esto incluye información relacionada con la condición de salud física o mental de un individuo, la provisión de atención médica a ese individuo, o el pago por dicha atención. Aquí está la pregunta: {query['query']}") for query in patient_queries]
    privacy_scores = [evaluate_binary(output, query['contains_phi']) for output, query in zip(outputs, patient_queries)]
    print(f"Puntuación de Preservación de Privacidad: {sum(privacy_scores) / len(privacy_scores) * 100}%")
    ```
  
</section>

  <section title="Utilización de contexto (asistente de conversación) - escala ordinal basada en LLM">

    **Lo que mide**: Similar a la escala Likert, la escala ordinal mide en una escala fija y ordenada (1-5). Es perfecta para evaluar la utilización del contexto porque puede capturar el grado en que el modelo hace referencia y se basa en el historial de conversación, que es clave para interacciones coherentes y personalizadas.

    **Casos de prueba de evaluación de ejemplo**: 100 conversaciones de múltiples turnos con preguntas dependientes del contexto.
    ```python
    import anthropic

    conversations = [
        [
            {"role": "user", "content": "¡Acabo de conseguir un nuevo pomerania!"},
            {"role": "assistant", "content": "¡Felicidades por tu nuevo amigo peludo! ¿Es tu primer perro?"},
            {"role": "user", "content": "Sí, lo es. La llamé Luna."},
            {"role": "assistant", "content": "¡Luna es un nombre encantador! Como dueño de perro por primera vez, podrías tener algunas preguntas. ¿Qué te gustaría saber sobre cuidar a Luna?"},
            ...
            {"role": "user", "content": "¿Qué debería saber sobre cuidar un perro de esta raza específica?"}  # Caso extremo: Se basa en contexto de mucho antes
        ],
        [
            {"role": "user", "content": "Estoy leyendo 'Matar a un ruiseñor' para mi club de lectura."},
            {"role": "assistant", "content": "¡Excelente elección! 'Matar a un ruiseñor' de Harper Lee es un clásico que explora temas de injusticia racial y crecimiento moral. ¿Cómo lo encuentras hasta ahora?"},
            {"role": "user", "content": "Es poderoso. Oye, ¿cuándo era el cumpleaños de Scout otra vez?"},  # Caso extremo: Cambio abrupto de tema
            {"role": "assistant", "content": "Me disculpo, pero no recuerdo la fecha exacta del cumpleaños de Scout mencionada en 'Matar a un ruiseñor'. La novela no se enfoca en detalles tan específicos. En cambio, se centra en el crecimiento y experiencias de Scout a lo largo de varios años. ¿Hay alguna parte particular del libro o del desarrollo de Scout que te interese discutir?"},
            {"role": "user", "content": "Oh, cierto. Bueno, ¿puedes sugerir una receta para un pastel sureño clásico?"}  # Caso extremo: Otro cambio de tema
        ],
        # ... 98 conversaciones más
    ]

    client = anthropic.Anthropic()

    def get_completion(prompt: str):
        message = client.messages.create(
            model="claude-sonnet-4-5",
            max_tokens=1024,
            messages=[
            {"role": "user", "content": prompt}
            ]
        )
        return message.content[0].text

    def evaluate_ordinal(model_output, conversation):
        ordinal_prompt = f"""Califica qué tan bien esta respuesta utiliza el contexto de la conversación en una escala del 1-5:
        <conversation>
        {"".join(f"{turn['role']}: {turn['content']}\\n" for turn in conversation[:-1])}
        </conversation>
        <response>{model_output}</response>
        1: Ignora completamente el contexto
        5: Utiliza perfectamente el contexto
        Solo proporciona el número y nada más."""

        # Generalmente es mejor práctica usar un modelo diferente para evaluar que el modelo usado para generar la salida evaluada
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": ordinal_prompt}])
        return int(response.content[0].text.strip())

    outputs = [get_completion(conversation) for conversation in conversations]
    context_scores = [evaluate_ordinal(output, conversation) for output, conversation in zip(outputs, conversations)]
    print(f"Puntuación Promedio de Utilización de Contexto: {sum(context_scores) / len(context_scores)}")
    ```
  
</section>

<Tip>¡Escribir cientos de casos de prueba puede ser difícil de hacer a mano! Haz que Claude te ayude a generar más a partir de un conjunto base de casos de prueba de ejemplo.</Tip>
<Tip>Si no sabes qué métodos de evaluación podrían ser útiles para evaluar tus criterios de éxito, ¡también puedes hacer lluvia de ideas con Claude!</Tip>

***

## Calificar evaluaciones

Al decidir qué método usar para calificar evaluaciones, elige el método más rápido, más confiable y más escalable:

1. **Calificación basada en código**: Más rápida y más confiable, extremadamente escalable, pero también carece de matices para juicios más complejos que requieren menos rigidez basada en reglas.
   - Coincidencia exacta: `output == golden_answer`
   - Coincidencia de cadena: `key_phrase in output`

2. **Calificación humana**: Más flexible y de alta calidad, pero lenta y costosa. Evitar si es posible.

3. **Calificación basada en LLM**: Rápida y flexible, escalable y adecuada para juicios complejos. Prueba para asegurar confiabilidad primero y luego escala.

### Consejos para calificación basada en LLM
- **Tener rúbricas detalladas y claras**: "La respuesta siempre debe mencionar 'Acme Inc.' en la primera oración. Si no lo hace, la respuesta se califica automáticamente como 'incorrecta.'"
    <Note>Un caso de uso dado, o incluso un criterio de éxito específico para ese caso de uso, podría requerir varias rúbricas para una evaluación holística.</Note>
- **Empírico o específico**: Por ejemplo, instruye al LLM a producir solo 'correcto' o 'incorrecto', o a juzgar desde una escala del 1-5. Las evaluaciones puramente cualitativas son difíciles de evaluar rápidamente y a escala.
- **Fomentar el razonamiento**: Pide al LLM que piense primero antes de decidir una puntuación de evaluación, y luego descarta el razonamiento. Esto aumenta el rendimiento de evaluación, particularmente para tareas que requieren juicio complejo.

<section title="Ejemplo: Calificación basada en LLM">

```python
import anthropic

def build_grader_prompt(answer, rubric):
    return f"""Califica esta respuesta basándote en la rúbrica:
    <rubric>{rubric}</rubric>
    <answer>{answer}</answer>
    Piensa a través de tu razonamiento en etiquetas <thinking>, luego proporciona 'correct' o 'incorrect' en etiquetas <result>."""

def grade_completion(output, golden_answer):
    grader_response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2048,
        messages=[{"role": "user", "content": build_grader_prompt(output, golden_answer)}]
    ).content[0].text

    return "correct" if "correct" in grader_response.lower() else "incorrect"

# Ejemplo de uso
eval_data = [
    {"question": "¿Es 42 la respuesta a la vida, el universo y todo?", "golden_answer": "Sí, según 'La Guía del Autoestopista Galáctico'."},
    {"question": "¿Cuál es la capital de Francia?", "golden_answer": "La capital de Francia es París."}
]

def get_completion(prompt: str):
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
        {"role": "user", "content": prompt}
        ]
    )
    return message.content[0].text

outputs = [get_completion(q["question"]) for q in eval_data]
grades = [grade_completion(output, a["golden_answer"]) for output, a in zip(outputs, eval_data)]
print(f"Puntuación: {grades.count('correct') / len(grades) * 100}%")
```

</section>

## Próximos pasos

<CardGroup cols={2}>
  <Card title="Lluvia de ideas de evaluaciones" icon="link" href="/docs/es/build-with-claude/prompt-engineering/overview">
    Aprende cómo crear prompts que maximicen tus puntuaciones de evaluación.
  </Card>
  <Card title="Libro de recetas de evaluaciones" icon="link" href="https://github.com/anthropics/anthropic-cookbook/blob/main/misc/building%5Fevals.ipynb">
    Más ejemplos de código de evaluaciones calificadas por humanos, código y LLM.
  </Card>
</CardGroup>