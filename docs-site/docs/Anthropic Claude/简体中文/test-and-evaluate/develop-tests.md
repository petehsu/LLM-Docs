# 创建强有力的实证评估

学习如何开发测试用例来衡量LLM性能，包括评估设计原则、示例评估和评分方法。

---

在定义成功标准后，下一步是设计评估来衡量LLM相对于这些标准的性能。这是提示工程周期的重要组成部分。

![](/docs/images/how-to-prompt-eng.png)

本指南重点介绍如何开发测试用例。

## 构建评估和测试用例

### 评估设计原则

1. **针对特定任务**：设计反映真实世界任务分布的评估。不要忘记考虑边缘情况！
    <section title="边缘情况示例">

       - 不相关或不存在的输入数据
       - 过长的输入数据或用户输入
       - [聊天用例] 糟糕、有害或不相关的用户输入
       - 模糊的测试用例，即使是人类也很难达成评估共识
    
</section>
2. **尽可能自动化**：构建允许自动评分的问题（例如，多选题、字符串匹配、代码评分、LLM评分）。
3. **优先考虑数量而非质量**：更多问题配合稍低信号的自动评分比更少问题配合高质量人工评分更好。

### 评估示例

  <section title="任务保真度（情感分析）- 精确匹配评估">

    **衡量内容**：精确匹配评估衡量模型输出是否完全匹配预定义的正确答案。这是一个简单、明确的指标，非常适合具有明确分类答案的任务，如情感分析（积极、消极、中性）。

    **评估测试用例示例**：1000条带有人工标注情感的推文。
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

  <section title="一致性（FAQ机器人）- 余弦相似度评估">

    **衡量内容**：余弦相似度通过计算两个向量（在这种情况下，使用SBERT的模型输出的句子嵌入）之间角度的余弦来衡量它们的相似性。接近1的值表示更高的相似性。它非常适合评估一致性，因为相似的问题应该产生语义相似的答案，即使措辞有所不同。

    **评估测试用例示例**：50组，每组有几个改写版本。
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

  <section title="相关性和连贯性（摘要）- ROUGE-L评估">

    **衡量内容**：ROUGE-L（面向召回的摘要评估替代品 - 最长公共子序列）评估生成摘要的质量。它衡量候选摘要和参考摘要之间最长公共子序列的长度。高ROUGE-L分数表明生成的摘要以连贯的顺序捕获了关键信息。

    **评估测试用例示例**：200篇带有参考摘要的文章。
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

  <section title="语调和风格（客户服务）- 基于LLM的李克特量表">

    **衡量内容**：基于LLM的李克特量表是一种心理测量量表，使用LLM来判断主观态度或感知。在这里，它用于在1到5的量表上评估回应的语调。它非常适合评估难以用传统指标量化的细致方面，如同理心、专业性或耐心。

    **评估测试用例示例**：100个客户询问，带有目标语调（同理心、专业、简洁）。
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

  <section title="隐私保护（医疗聊天机器人）- 基于LLM的二元分类">

    **衡量内容**：二元分类确定输入是否属于两个类别之一。在这里，它用于分类回应是否包含PHI。这种方法可以理解上下文并识别基于规则的系统可能遗漏的微妙或隐含的PHI形式。

    **评估测试用例示例**：500个模拟患者查询，其中一些包含PHI。
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

  <section title="上下文利用（对话助手）- 基于LLM的序数量表">

    **衡量内容**：与李克特量表类似，序数量表在固定的有序量表（1-5）上进行衡量。它非常适合评估上下文利用，因为它可以捕获模型引用和构建对话历史的程度，这是连贯、个性化交互的关键。

    **评估测试用例示例**：100个多轮对话，带有依赖上下文的问题。
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

<Tip>手动编写数百个测试用例可能很困难！让Claude帮助您从基线示例测试用例集生成更多测试用例。</Tip>
<Tip>如果您不知道哪些评估方法可能对评估您的成功标准有用，您也可以与Claude进行头脑风暴！</Tip>

***

## 评估评分

在决定使用哪种方法对评估进行评分时，选择最快、最可靠、最可扩展的方法：

1. **基于代码的评分**：最快且最可靠，极其可扩展，但对于需要较少基于规则的严格性的更复杂判断缺乏细致入微。
   - 精确匹配：`output == golden_answer`
   - 字符串匹配：`key_phrase in output`

2. **人工评分**：最灵活且高质量，但缓慢且昂贵。如果可能请避免。

3. **基于LLM的评分**：快速且灵活，可扩展且适合复杂判断。首先测试以确保可靠性，然后扩展。

### 基于LLM评分的技巧
- **有详细、清晰的评分标准**："答案应该总是在第一句话中提到'Acme Inc.'。如果没有，答案自动被评为'不正确'。"
    <Note>给定的用例，甚至该用例的特定成功标准，可能需要多个评分标准进行全面评估。</Note>
- **实证或具体**：例如，指示LLM仅输出'正确'或'不正确'，或从1-5的量表进行判断。纯定性评估很难快速大规模评估。
- **鼓励推理**：要求LLM在决定评估分数之前先思考，然后丢弃推理。这提高了评估性能，特别是对于需要复杂判断的任务。

<section title="示例：基于LLM的评分">

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

## 下一步

<CardGroup cols={2}>
  <Card title="头脑风暴评估" icon="link" href="/docs/zh-CN/build-with-claude/prompt-engineering/overview">
    学习如何制作最大化评估分数的提示。
  </Card>
  <Card title="评估手册" icon="link" href="https://github.com/anthropics/anthropic-cookbook/blob/main/misc/building%5Fevals.ipynb">
    更多人工、代码和LLM评分评估的代码示例。
  </Card>
</CardGroup>