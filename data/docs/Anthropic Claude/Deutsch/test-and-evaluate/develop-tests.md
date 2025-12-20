# Starke empirische Evaluierungen erstellen

Entwickeln Sie Testfälle zur Messung der LLM-Leistung gegen Ihre Erfolgskriterien.

---

Nach der Definition Ihrer Erfolgskriterien ist der nächste Schritt die Gestaltung von Evaluierungen zur Messung der LLM-Leistung gegen diese Kriterien. Dies ist ein wichtiger Teil des Prompt-Engineering-Zyklus.

![](/docs/images/how-to-prompt-eng.png)

Dieser Leitfaden konzentriert sich darauf, wie Sie Ihre Testfälle entwickeln.

## Evals und Testfälle erstellen

### Eval-Designprinzipien

1. **Aufgabenspezifisch sein**: Entwerfen Sie Evals, die Ihre reale Aufgabenverteilung widerspiegeln. Vergessen Sie nicht, Grenzfälle zu berücksichtigen!
    <section title="Beispiel-Grenzfälle">

       - Irrelevante oder nicht existierende Eingabedaten
       - Übermäßig lange Eingabedaten oder Benutzereingaben
       - [Chat-Anwendungsfälle] Schlechte, schädliche oder irrelevante Benutzereingaben
       - Mehrdeutige Testfälle, bei denen selbst Menschen schwer einen Bewertungskonsens erreichen würden
    
</section>
2. **Automatisieren wenn möglich**: Strukturieren Sie Fragen so, dass automatisierte Bewertung möglich ist (z.B. Multiple-Choice, String-Match, Code-bewertet, LLM-bewertet).
3. **Volumen über Qualität priorisieren**: Mehr Fragen mit etwas niedrigerem Signal bei automatisierter Bewertung ist besser als weniger Fragen mit hochwertigen manuell bewerteten Evals.

### Beispiel-Evals

  <section title="Aufgabentreue (Sentimentanalyse) - Exakte Übereinstimmungsevaluierung">

    **Was es misst**: Exakte Übereinstimmungs-Evals messen, ob die Ausgabe des Modells genau mit einer vordefinierten korrekten Antwort übereinstimmt. Es ist eine einfache, eindeutige Metrik, die perfekt für Aufgaben mit klaren, kategorischen Antworten wie Sentimentanalyse (positiv, negativ, neutral) ist.

    **Beispiel-Eval-Testfälle**: 1000 Tweets mit menschlich markierten Sentiments.
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

  <section title="Konsistenz (FAQ-Bot) - Kosinus-Ähnlichkeitsevaluierung">

    **Was es misst**: Kosinus-Ähnlichkeit misst die Ähnlichkeit zwischen zwei Vektoren (in diesem Fall Satz-Embeddings der Modellausgabe mit SBERT) durch Berechnung des Kosinus des Winkels zwischen ihnen. Werte näher zu 1 zeigen höhere Ähnlichkeit an. Es ist ideal zur Bewertung von Konsistenz, da ähnliche Fragen semantisch ähnliche Antworten liefern sollten, auch wenn die Formulierung variiert.

    **Beispiel-Eval-Testfälle**: 50 Gruppen mit jeweils einigen paraphrasierten Versionen.
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

  <section title="Relevanz und Kohärenz (Zusammenfassung) - ROUGE-L-Evaluierung">

    **Was es misst**: ROUGE-L (Recall-Oriented Understudy for Gisting Evaluation - Longest Common Subsequence) bewertet die Qualität generierter Zusammenfassungen. Es misst die Länge der längsten gemeinsamen Teilsequenz zwischen der Kandidaten- und Referenzzusammenfassung. Hohe ROUGE-L-Werte zeigen an, dass die generierte Zusammenfassung wichtige Informationen in kohärenter Reihenfolge erfasst.

    **Beispiel-Eval-Testfälle**: 200 Artikel mit Referenzzusammenfassungen.
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

  <section title="Ton und Stil (Kundenservice) - LLM-basierte Likert-Skala">

    **Was es misst**: Die LLM-basierte Likert-Skala ist eine psychometrische Skala, die ein LLM verwendet, um subjektive Einstellungen oder Wahrnehmungen zu beurteilen. Hier wird sie verwendet, um den Ton von Antworten auf einer Skala von 1 bis 5 zu bewerten. Sie ist ideal zur Bewertung nuancierter Aspekte wie Empathie, Professionalität oder Geduld, die mit traditionellen Metriken schwer zu quantifizieren sind.

    **Beispiel-Eval-Testfälle**: 100 Kundenanfragen mit Zielton (empathisch, professionell, prägnant).
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

  <section title="Datenschutzwahrung (Medizinischer Chatbot) - LLM-basierte binäre Klassifikation">

    **Was es misst**: Binäre Klassifikation bestimmt, ob eine Eingabe zu einer von zwei Klassen gehört. Hier wird sie verwendet, um zu klassifizieren, ob eine Antwort PHI enthält oder nicht. Diese Methode kann Kontext verstehen und subtile oder implizite Formen von PHI identifizieren, die regelbasierte Systeme möglicherweise übersehen.

    **Beispiel-Eval-Testfälle**: 500 simulierte Patientenanfragen, einige mit PHI.
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

  <section title="Kontextnutzung (Gesprächsassistent) - LLM-basierte Ordinalskala">

    **Was es misst**: Ähnlich der Likert-Skala misst die Ordinalskala auf einer festen, geordneten Skala (1-5). Sie ist perfekt zur Bewertung der Kontextnutzung, da sie den Grad erfassen kann, in dem das Modell auf die Gesprächshistorie verweist und darauf aufbaut, was für kohärente, personalisierte Interaktionen entscheidend ist.

    **Beispiel-Eval-Testfälle**: 100 mehrteilige Gespräche mit kontextabhängigen Fragen.
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

<Tip>Hunderte von Testfällen von Hand zu schreiben kann schwierig sein! Lassen Sie Claude Ihnen dabei helfen, mehr aus einem Basissatz von Beispiel-Testfällen zu generieren.</Tip>
<Tip>Wenn Sie nicht wissen, welche Eval-Methoden nützlich sein könnten, um Ihre Erfolgskriterien zu bewerten, können Sie auch mit Claude brainstormen!</Tip>

***

## Evals bewerten

Bei der Entscheidung, welche Methode zur Bewertung von Evals verwendet werden soll, wählen Sie die schnellste, zuverlässigste, skalierbarste Methode:

1. **Code-basierte Bewertung**: Am schnellsten und zuverlässigsten, extrem skalierbar, aber fehlt auch Nuancierung für komplexere Beurteilungen, die weniger regelbasierte Starrheit erfordern.
   - Exakte Übereinstimmung: `output == golden_answer`
   - String-Übereinstimmung: `key_phrase in output`

2. **Menschliche Bewertung**: Am flexibelsten und hochwertigsten, aber langsam und teuer. Vermeiden Sie es wenn möglich.

3. **LLM-basierte Bewertung**: Schnell und flexibel, skalierbar und geeignet für komplexe Beurteilungen. Testen Sie zuerst die Zuverlässigkeit, dann skalieren Sie.

### Tipps für LLM-basierte Bewertung
- **Detaillierte, klare Rubriken haben**: "Die Antwort sollte immer 'Acme Inc.' im ersten Satz erwähnen. Wenn sie das nicht tut, wird die Antwort automatisch als 'falsch' bewertet."
    <Note>Ein gegebener Anwendungsfall oder sogar ein spezifisches Erfolgskriterium für diesen Anwendungsfall könnte mehrere Rubriken für eine ganzheitliche Bewertung erfordern.</Note>
- **Empirisch oder spezifisch**: Weisen Sie das LLM beispielsweise an, nur 'korrekt' oder 'falsch' auszugeben oder auf einer Skala von 1-5 zu beurteilen. Rein qualitative Bewertungen sind schwer schnell und im großen Maßstab zu bewerten.
- **Begründung fördern**: Bitten Sie das LLM, zuerst zu denken, bevor es eine Bewertungspunktzahl entscheidet, und verwerfen Sie dann die Begründung. Dies erhöht die Bewertungsleistung, insbesondere für Aufgaben, die komplexe Beurteilungen erfordern.

<section title="Beispiel: LLM-basierte Bewertung">

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

## Nächste Schritte

<CardGroup cols={2}>
  <Card title="Evaluierungen brainstormen" icon="link" href="/docs/de/build-with-claude/prompt-engineering/overview">
    Lernen Sie, wie Sie Prompts erstellen, die Ihre Eval-Werte maximieren.
  </Card>
  <Card title="Evals-Kochbuch" icon="link" href="https://github.com/anthropics/anthropic-cookbook/blob/main/misc/building%5Fevals.ipynb">
    Mehr Code-Beispiele für menschlich-, code- und LLM-bewertete Evals.
  </Card>
</CardGroup>