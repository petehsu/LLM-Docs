# Создание надежных эмпирических оценок

Узнайте, как разработать тестовые случаи для измерения производительности LLM в соответствии с вашими критериями успеха.

---

После определения критериев успеха следующим шагом является разработка оценок для измерения производительности LLM в соответствии с этими критериями. Это жизненно важная часть цикла инженерии промптов.

![](/docs/images/how-to-prompt-eng.png)

Это руководство сосредоточено на том, как разработать ваши тестовые случаи.

## Создание оценок и тестовых случаев

### Принципы дизайна оценок

1. **Будьте специфичными к задаче**: Разрабатывайте оценки, которые отражают распределение ваших реальных задач. Не забывайте учитывать крайние случаи!
    <section title="Примеры крайних случаев">

       - Нерелевантные или несуществующие входные данные
       - Слишком длинные входные данные или пользовательский ввод
       - [Случаи использования чата] Плохой, вредный или нерелевантный пользовательский ввод
       - Неоднозначные тестовые случаи, где даже людям было бы трудно достичь консенсуса в оценке
    
</section>
2. **Автоматизируйте, когда это возможно**: Структурируйте вопросы для автоматизированной оценки (например, множественный выбор, соответствие строк, оценка кодом, оценка LLM).
3. **Приоритет объему над качеством**: Больше вопросов с немного более низким сигналом автоматизированной оценки лучше, чем меньше вопросов с высококачественными оценками, выставленными людьми вручную.

### Примеры оценок

  <section title="Точность задачи (анализ настроений) - оценка точного соответствия">

    **Что измеряет**: Оценки точного соответствия измеряют, точно ли выходные данные модели соответствуют предопределенному правильному ответу. Это простая, однозначная метрика, которая идеально подходит для задач с четкими, категориальными ответами, такими как анализ настроений (положительный, отрицательный, нейтральный).

    **Примеры тестовых случаев оценки**: 1000 твитов с размеченными людьми настроениями.
    ```python
    import anthropic
    
    tweets = [
        {"text": "This movie was a total waste of time. 👎", "sentiment": "negative"},
        {"text": "The new album is 🔥! Been on repeat all day.", "sentiment": "positive"},
        {"text": "I just love it when my flight gets delayed for 5 hours. #bestdayever", "sentiment": "negative"},  # Edge case: Sarcasm
        {"text": "The movie's plot was terrible, but the acting was phenomenal.", "sentiment": "mixed"},  # Edge case: Mixed sentiment
        # ... 996 more tweets
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

    outputs = [get_completion(f"Classify this as 'positive', 'negative', 'neutral', or 'mixed': {tweet['text']}") for tweet in tweets]
    accuracy = sum(evaluate_exact_match(output, tweet['sentiment']) for output, tweet in zip(outputs, tweets)) / len(tweets)
    print(f"Sentiment Analysis Accuracy: {accuracy * 100}%")
    ```
  
</section>

  <section title="Согласованность (FAQ бот) - оценка косинусного сходства">

    **Что измеряет**: Косинусное сходство измеряет сходство между двумя векторами (в данном случае, эмбеддингами предложений выходных данных модели с использованием SBERT) путем вычисления косинуса угла между ними. Значения ближе к 1 указывают на более высокое сходство. Это идеально для оценки согласованности, поскольку похожие вопросы должны давать семантически похожие ответы, даже если формулировка различается.

    **Примеры тестовых случаев оценки**: 50 групп с несколькими перефразированными версиями каждая.
    ```python
    from sentence_transformers import SentenceTransformer
    import numpy as np
    import anthropic
    
    faq_variations = [
        {"questions": ["What's your return policy?", "How can I return an item?", "Wut's yur retrn polcy?"], "answer": "Our return policy allows..."},  # Edge case: Typos
        {"questions": ["I bought something last week, and it's not really what I expected, so I was wondering if maybe I could possibly return it?", "I read online that your policy is 30 days but that seems like it might be out of date because the website was updated six months ago, so I'm wondering what exactly is your current policy?"], "answer": "Our return policy allows..."},  # Edge case: Long, rambling question
        {"questions": ["I'm Jane's cousin, and she said you guys have great customer service. Can I return this?", "Reddit told me that contacting customer service this way was the fastest way to get an answer. I hope they're right! What is the return window for a jacket?"], "answer": "Our return policy allows..."},  # Edge case: Irrelevant info
        # ... 47 more FAQs
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
        print(f"FAQ Consistency Score: {similarity_score * 100}%")
    ```
  
</section>

  <section title="Релевантность и связность (суммаризация) - оценка ROUGE-L">

    **Что измеряет**: ROUGE-L (Recall-Oriented Understudy for Gisting Evaluation - Longest Common Subsequence) оценивает качество сгенерированных резюме. Он измеряет длину самой длинной общей подпоследовательности между кандидатом и эталонными резюме. Высокие баллы ROUGE-L указывают на то, что сгенерированное резюме захватывает ключевую информацию в связном порядке.

    **Примеры тестовых случаев оценки**: 200 статей с эталонными резюме.
    ```python
    from rouge import Rouge
    import anthropic
    
    articles = [
        {"text": "In a groundbreaking study, researchers at MIT...", "summary": "MIT scientists discover a new antibiotic..."},
        {"text": "Jane Doe, a local hero, made headlines last week for saving... In city hall news, the budget... Meteorologists predict...", "summary": "Community celebrates local hero Jane Doe while city grapples with budget issues."},  # Edge case: Multi-topic
        {"text": "You won't believe what this celebrity did! ... extensive charity work ...", "summary": "Celebrity's extensive charity work surprises fans"},  # Edge case: Misleading title
        # ... 197 more articles
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
        return scores[0]['rouge-l']['f']  # ROUGE-L F1 score

    outputs = [get_completion(f"Summarize this article in 1-2 sentences:\n\n{article['text']}") for article in articles]
    relevance_scores = [evaluate_rouge_l(output, article['summary']) for output, article in zip(outputs, articles)]
    print(f"Average ROUGE-L F1 Score: {sum(relevance_scores) / len(relevance_scores)}")
    ```
  
</section>

  <section title="Тон и стиль (обслуживание клиентов) - шкала Лайкерта на основе LLM">

    **Что измеряет**: Шкала Лайкерта на основе LLM - это психометрическая шкала, которая использует LLM для оценки субъективных отношений или восприятий. Здесь она используется для оценки тона ответов по шкале от 1 до 5. Она идеально подходит для оценки нюансированных аспектов, таких как эмпатия, профессионализм или терпение, которые трудно количественно оценить традиционными метриками.

    **Примеры тестовых случаев оценки**: 100 запросов клиентов с целевым тоном (эмпатичный, профессиональный, краткий).
    ```python
    import anthropic

    inquiries = [
        {"text": "This is the third time you've messed up my order. I want a refund NOW!", "tone": "empathetic"},  # Edge case: Angry customer
        {"text": "I tried resetting my password but then my account got locked...", "tone": "patient"},  # Edge case: Complex issue
        {"text": "I can't believe how good your product is. It's ruined all others for me!", "tone": "professional"},  # Edge case: Compliment as complaint
        # ... 97 more inquiries
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
        tone_prompt = f"""Rate this customer service response on a scale of 1-5 for being {target_tone}:
        <response>{model_output}</response>
        1: Not at all {target_tone}
        5: Perfectly {target_tone}
        Output only the number."""

        # Generally best practice to use a different model to evaluate than the model used to generate the evaluated output 
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": tone_prompt}])
        return int(response.content[0].text.strip())

    outputs = [get_completion(f"Respond to this customer inquiry: {inquiry['text']}") for inquiry in inquiries]
    tone_scores = [evaluate_likert(output, inquiry['tone']) for output, inquiry in zip(outputs, inquiries)]
    print(f"Average Tone Score: {sum(tone_scores) / len(tone_scores)}")
    ```
  
</section>

  <section title="Сохранение конфиденциальности (медицинский чатбот) - бинарная классификация на основе LLM">

    **Что измеряет**: Бинарная классификация определяет, принадлежит ли входной сигнал к одному из двух классов. Здесь она используется для классификации того, содержит ли ответ PHI или нет. Этот метод может понимать контекст и идентифицировать тонкие или неявные формы PHI, которые системы на основе правил могут пропустить.

    **Примеры тестовых случаев оценки**: 500 смоделированных запросов пациентов, некоторые с PHI.
    ```python
    import anthropic
    
    patient_queries = [
        {"query": "What are the side effects of Lisinopril?", "contains_phi": False},
        {"query": "Can you tell me why John Doe, DOB 5/12/1980, was prescribed Metformin?", "contains_phi": True},  # Edge case: Explicit PHI
        {"query": "If my friend Alice, who was born on July 4, 1985, had diabetes, what...", "contains_phi": True},  # Edge case: Hypothetical PHI
        {"query": "I'm worried about my son. He's been prescribed the same medication as his father last year.", "contains_phi": True},  # Edge case: Implicit PHI
        # ... 496 more queries
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

        binary_prompt = """Does this response contain or reference any Personal Health Information (PHI)?
        PHI refers to any individually identifiable health data that is created, used, or disclosed in the course of providing healthcare services. This includes information related to an individual's physical or mental health condition, the provision of healthcare to that individual, or payment for such care.
        Key aspects of PHI include:
        - Identifiers: Names, addresses, birthdates, Social Security numbers, medical record numbers, etc.
        - Health data: Diagnoses, treatment plans, test results, medication records, etc.
        - Financial information: Insurance details, payment records, etc.
        - Communication: Notes from healthcare providers, emails or messages about health.

        <response>{model_output}</response>
        Output only 'yes' or 'no'."""

        # Generally best practice to use a different model to evaluate than the model used to generate the evaluated output
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": binary_prompt}])
        return response.content[0].text.strip().lower() == "no"

    outputs = [get_completion(f"You are a medical assistant. Never reveal any PHI in your responses. PHI refers to any individually identifiable health data that is created, used, or disclosed in the course of providing healthcare services. This includes information related to an individual's physical or mental health condition, the provision of healthcare to that individual, or payment for such care. Here is the question: {query['query']}") for query in patient_queries]
    privacy_scores = [evaluate_binary(output, query['contains_phi']) for output, query in zip(outputs, patient_queries)]
    print(f"Privacy Preservation Score: {sum(privacy_scores) / len(privacy_scores) * 100}%")
    ```
  
</section>

  <section title="Использование контекста (помощник в разговоре) - порядковая шкала на основе LLM">

    **Что измеряет**: Подобно шкале Лайкерта, порядковая шкала измеряет по фиксированной, упорядоченной шкале (1-5). Она идеально подходит для оценки использования контекста, поскольку может захватить степень, в которой модель ссылается на историю разговора и строит на ней, что является ключевым для связных, персонализированных взаимодействий.

    **Примеры тестовых случаев оценки**: 100 многоходовых разговоров с вопросами, зависящими от контекста.
    ```python
    import anthropic

    conversations = [
        [
            {"role": "user", "content": "I just got a new pomeranian!"},
            {"role": "assistant", "content": "Congratulations on your new furry friend! Is this your first dog?"},
            {"role": "user", "content": "Yes, it is. I named her Luna."},
            {"role": "assistant", "content": "Luna is a lovely name! As a first-time dog owner, you might have some questions. What would you like to know about caring for Luna?"},
            ...
            {"role": "user", "content": "What should I know about caring for a dog of this specific breed?"}  # Edge case: Relies on context from much earlier
        ],
        [
            {"role": "user", "content": "I'm reading 'To Kill a Mockingbird' for my book club."},
            {"role": "assistant", "content": "Great choice! 'To Kill a Mockingbird' by Harper Lee is a classic that explores themes of racial injustice and moral growth. How are you finding it so far?"},
            {"role": "user", "content": "It's powerful. Hey, when was Scout's birthday again?"},  # Edge case: Abrupt topic shift
            {"role": "assistant", "content": "I apologize, but I don't recall the exact date of Scout's birthday being mentioned in 'To Kill a Mockingbird'. The novel doesn't focus on such specific details. Instead, it centers on Scout's growth and experiences over several years. Is there a particular part of the book or Scout's development that you're interested in discussing?"},
            {"role": "user", "content": "Oh, right. Well, can you suggest a recipe for a classic Southern cake?"}  # Edge case: Another topic shift
        ],
        # ... 98 more conversations
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
        ordinal_prompt = f"""Rate how well this response utilizes the conversation context on a scale of 1-5:
        <conversation>
        {"".join(f"{turn['role']}: {turn['content']}\\n" for turn in conversation[:-1])}
        </conversation>
        <response>{model_output}</response>
        1: Completely ignores context
        5: Perfectly utilizes context
        Output only the number and nothing else."""

        # Generally best practice to use a different model to evaluate than the model used to generate the evaluated output
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": ordinal_prompt}])
        return int(response.content[0].text.strip())

    outputs = [get_completion(conversation) for conversation in conversations]
    context_scores = [evaluate_ordinal(output, conversation) for output, conversation in zip(outputs, conversations)]
    print(f"Average Context Utilization Score: {sum(context_scores) / len(context_scores)}")
    ```
  
</section>

<Tip>Написание сотен тестовых случаев может быть трудным делом вручную! Попросите Claude помочь вам сгенерировать больше из базового набора примеров тестовых случаев.</Tip>
<Tip>Если вы не знаете, какие методы оценки могут быть полезны для оценки ваших критериев успеха, вы также можете провести мозговой штурм с Claude!</Tip>

***

## Оценка оценок

При принятии решения о том, какой метод использовать для оценки оценок, выберите самый быстрый, самый надежный, самый масштабируемый метод:

1. **Оценка на основе кода**: Самая быстрая и надежная, чрезвычайно масштабируемая, но также лишена нюансов для более сложных суждений, которые требуют менее жесткой основанности на правилах.
   - Точное соответствие: `output == golden_answer`
   - Соответствие строки: `key_phrase in output`

2. **Человеческая оценка**: Самая гибкая и высококачественная, но медленная и дорогая. Избегайте, если возможно.

3. **Оценка на основе LLM**: Быстрая и гибкая, масштабируемая и подходящая для сложных суждений. Сначала протестируйте для обеспечения надежности, затем масштабируйте.

### Советы для оценки на основе LLM
- **Имейте подробные, четкие рубрики**: "Ответ всегда должен упоминать 'Acme Inc.' в первом предложении. Если этого нет, ответ автоматически оценивается как 'неправильный'."
    <Note>Данный случай использования, или даже конкретный критерий успеха для этого случая использования, может потребовать несколько рубрик для целостной оценки.</Note>
- **Эмпирический или конкретный**: Например, проинструктируйте LLM выводить только 'правильно' или 'неправильно', или судить по шкале от 1 до 5. Чисто качественные оценки трудно оценить быстро и в масштабе.
- **Поощряйте рассуждения**: Попросите LLM сначала подумать перед принятием решения об оценочном балле, а затем отбросьте рассуждения. Это повышает производительность оценки, особенно для задач, требующих сложного суждения.

<section title="Пример: Оценка на основе LLM">

```python
import anthropic

def build_grader_prompt(answer, rubric):
    return f"""Grade this answer based on the rubric:
    <rubric>{rubric}</rubric>
    <answer>{answer}</answer>
    Think through your reasoning in <thinking> tags, then output 'correct' or 'incorrect' in <result> tags.""

def grade_completion(output, golden_answer):
    grader_response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2048,
        messages=[{"role": "user", "content": build_grader_prompt(output, golden_answer)}]
    ).content[0].text

    return "correct" if "correct" in grader_response.lower() else "incorrect"

# Example usage
eval_data = [
    {"question": "Is 42 the answer to life, the universe, and everything?", "golden_answer": "Yes, according to 'The Hitchhiker's Guide to the Galaxy'."},
    {"question": "What is the capital of France?", "golden_answer": "The capital of France is Paris."}
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
print(f"Score: {grades.count('correct') / len(grades) * 100}%")
```

</section>

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Мозговой штурм оценок" icon="link" href="/docs/ru/build-with-claude/prompt-engineering/overview">
    Узнайте, как создавать промпты, которые максимизируют ваши баллы оценки.
  </Card>
  <Card title="Поваренная книга оценок" icon="link" href="https://github.com/anthropics/anthropic-cookbook/blob/main/misc/building%5Fevals.ipynb">
    Больше примеров кода оценок, оцениваемых людьми, кодом и LLM.
  </Card>
</CardGroup>