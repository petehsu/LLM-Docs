# 強力な実証的評価を作成する

LLMのパフォーマンスを測定するための効果的なテストケースの開発方法を学びます。

---

成功基準を定義した後、次のステップはそれらの基準に対してLLMのパフォーマンスを測定するための評価を設計することです。これはプロンプトエンジニアリングサイクルの重要な部分です。

![](/docs/images/how-to-prompt-eng.png)

このガイドでは、テストケースの開発方法に焦点を当てます。

## 評価とテストケースの構築

### 評価設計の原則

1. **タスク固有にする**: 実際のタスク分布を反映した評価を設計します。エッジケースを考慮することを忘れないでください！
    <section title="エッジケースの例">

       - 無関係または存在しない入力データ
       - 過度に長い入力データまたはユーザー入力
       - [チャットユースケース] 不適切、有害、または無関係なユーザー入力
       - 人間でも評価の合意に達するのが困難な曖昧なテストケース
    
</section>
2. **可能な限り自動化する**: 自動採点を可能にする質問を構造化します（例：多肢選択、文字列マッチ、コード採点、LLM採点）。
3. **品質よりも量を優先する**: わずかに低いシグナルの自動採点でより多くの質問を持つ方が、高品質な人間による手動採点の評価で少ない質問を持つよりも良いです。

### 評価の例

  <section title="タスクの忠実性（感情分析） - 完全一致評価">

    **測定内容**: 完全一致評価は、モデルの出力が事前定義された正解と完全に一致するかどうかを測定します。これは、感情分析（ポジティブ、ネガティブ、ニュートラル）のような明確で分類的な答えがあるタスクに最適な、シンプルで曖昧さのない指標です。

    **評価テストケースの例**: 人間がラベル付けした感情を持つ1000のツイート。
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

  <section title="一貫性（FAQボット） - コサイン類似度評価">

    **測定内容**: コサイン類似度は、2つのベクトル（この場合、SBERTを使用したモデル出力の文埋め込み）間の角度のコサインを計算することで類似性を測定します。1に近い値はより高い類似性を示します。類似した質問は、表現が異なっても意味的に類似した答えを生成すべきであるため、一貫性の評価に理想的です。

    **評価テストケースの例**: それぞれいくつかの言い換えバージョンを持つ50のグループ。
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

  <section title="関連性と一貫性（要約） - ROUGE-L評価">

    **測定内容**: ROUGE-L（Recall-Oriented Understudy for Gisting Evaluation - Longest Common Subsequence）は生成された要約の品質を評価します。候補要約と参照要約間の最長共通部分列の長さを測定します。高いROUGE-Lスコアは、生成された要約が一貫した順序で重要な情報を捉えていることを示します。

    **評価テストケースの例**: 参照要約を持つ200の記事。
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

  <section title="トーンとスタイル（カスタマーサービス） - LLMベースのリッカート尺度">

    **測定内容**: LLMベースのリッカート尺度は、LLMを使用して主観的な態度や認識を判断する心理測定尺度です。ここでは、1から5のスケールで応答のトーンを評価するために使用されます。従来の指標では定量化が困難な共感、プロフェッショナリズム、忍耐などの微妙な側面を評価するのに理想的です。

    **評価テストケースの例**: 目標トーン（共感的、プロフェッショナル、簡潔）を持つ100の顧客問い合わせ。
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

  <section title="プライバシー保護（医療チャットボット） - LLMベースの二項分類">

    **測定内容**: 二項分類は、入力が2つのクラスのうちどちらに属するかを決定します。ここでは、応答にPHIが含まれているかどうかを分類するために使用されます。この方法は文脈を理解し、ルールベースのシステムが見逃す可能性のある微妙または暗黙的なPHIの形式を識別できます。

    **評価テストケースの例**: 一部にPHIを含む500のシミュレートされた患者クエリ。
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

  <section title="文脈利用（会話アシスタント） - LLMベースの順序尺度">

    **測定内容**: リッカート尺度と同様に、順序尺度は固定された順序付きスケール（1-5）で測定します。モデルが会話履歴を参照し、それに基づいて構築する程度を捉えることができるため、一貫性のある個人化されたインタラクションの鍵となる文脈利用の評価に最適です。

    **評価テストケースの例**: 文脈依存の質問を含む100のマルチターン会話。
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

<Tip>何百ものテストケースを手動で書くのは困難です！ベースラインとなる例のテストケースセットからより多くを生成するためにClaudeに支援してもらいましょう。</Tip>
<Tip>成功基準を評価するのに有用な評価方法がわからない場合は、Claudeとブレインストーミングすることもできます！</Tip>

***

## 評価の採点

評価を採点するためにどの方法を使用するかを決定する際は、最も高速で、最も信頼性が高く、最もスケーラブルな方法を選択してください：

1. **コードベースの採点**: 最も高速で信頼性が高く、非常にスケーラブルですが、ルールベースの厳格さを必要としない複雑な判断には微妙さが欠けます。
   - 完全一致: `output == golden_answer`
   - 文字列マッチ: `key_phrase in output`

2. **人間による採点**: 最も柔軟で高品質ですが、遅くて高価です。可能であれば避けてください。

3. **LLMベースの採点**: 高速で柔軟、スケーラブルで複雑な判断に適しています。まず信頼性をテストしてからスケールしてください。

### LLMベースの採点のヒント
- **詳細で明確なルーブリックを持つ**: 「答えは常に最初の文で'Acme Inc.'に言及すべきです。そうでない場合、答えは自動的に'不正解'として採点されます。」
    <Note>特定のユースケース、またはそのユースケースの特定の成功基準でさえ、包括的な評価のために複数のルーブリックが必要な場合があります。</Note>
- **実証的または具体的**: 例えば、LLMに'正解'または'不正解'のみを出力するよう指示するか、1-5のスケールで判断するよう指示します。純粋に定性的な評価は迅速かつ大規模に評価するのが困難です。
- **推論を促す**: 評価スコアを決定する前にまず考えるようLLMに求め、その後推論を破棄します。これは、複雑な判断を必要とするタスクの評価パフォーマンスを向上させます。

<section title="例: LLMベースの採点">

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

## 次のステップ

<CardGroup cols={2}>
  <Card title="評価をブレインストーミングする" icon="link" href="/docs/ja/build-with-claude/prompt-engineering/overview">
    評価スコアを最大化するプロンプトの作成方法を学びます。
  </Card>
  <Card title="評価クックブック" icon="link" href="https://github.com/anthropics/anthropic-cookbook/blob/main/misc/building%5Fevals.ipynb">
    人間、コード、LLM採点評価のより多くのコード例。
  </Card>
</CardGroup>