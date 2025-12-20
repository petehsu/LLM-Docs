# Criar avaliações empíricas sólidas

Aprenda como criar avaliações eficazes para medir o desempenho de LLM contra seus critérios de sucesso.

---

Após definir seus critérios de sucesso, o próximo passo é projetar avaliações para medir o desempenho do LLM contra esses critérios. Esta é uma parte vital do ciclo de engenharia de prompt.

![](/docs/images/how-to-prompt-eng.png)

Este guia foca em como desenvolver seus casos de teste.

## Construindo avaliações e casos de teste

### Princípios de design de avaliação

1. **Seja específico para a tarefa**: Projete avaliações que espelhem sua distribuição de tarefas do mundo real. Não se esqueça de considerar casos extremos!
    <section title="Exemplos de casos extremos">

       - Dados de entrada irrelevantes ou inexistentes
       - Dados de entrada excessivamente longos ou entrada do usuário
       - [Casos de uso de chat] Entrada do usuário inadequada, prejudicial ou irrelevante
       - Casos de teste ambíguos onde até mesmo humanos teriam dificuldade para chegar a um consenso de avaliação
    
</section>
2. **Automatize quando possível**: Estruture perguntas para permitir classificação automatizada (por exemplo, múltipla escolha, correspondência de string, classificação por código, classificação por LLM).
3. **Priorize volume sobre qualidade**: Mais perguntas com classificação automatizada de sinal ligeiramente menor é melhor do que menos perguntas com avaliações manuais de alta qualidade classificadas por humanos.

### Exemplos de avaliações

  <section title="Fidelidade da tarefa (análise de sentimento) - avaliação de correspondência exata">

    **O que mede**: Avaliações de correspondência exata medem se a saída do modelo corresponde exatamente a uma resposta correta predefinida. É uma métrica simples e inequívoca que é perfeita para tarefas com respostas categóricas claras como análise de sentimento (positivo, negativo, neutro).

    **Exemplos de casos de teste de avaliação**: 1000 tweets com sentimentos rotulados por humanos.
    ```python
    import anthropic
    
    tweets = [
        {"text": "Este filme foi uma total perda de tempo. 👎", "sentiment": "negative"},
        {"text": "O novo álbum está 🔥! Esteve no repeat o dia todo.", "sentiment": "positive"},
        {"text": "Eu simplesmente amo quando meu voo atrasa por 5 horas. #melhordiasempre", "sentiment": "negative"},  # Caso extremo: Sarcasmo
        {"text": "O enredo do filme era terrível, mas a atuação foi fenomenal.", "sentiment": "mixed"},  # Caso extremo: Sentimento misto
        # ... mais 996 tweets
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

    outputs = [get_completion(f"Classifique isto como 'positive', 'negative', 'neutral', ou 'mixed': {tweet['text']}") for tweet in tweets]
    accuracy = sum(evaluate_exact_match(output, tweet['sentiment']) for output, tweet in zip(outputs, tweets)) / len(tweets)
    print(f"Precisão da Análise de Sentimento: {accuracy * 100}%")
    ```
  
</section>

  <section title="Consistência (bot de FAQ) - avaliação de similaridade de cosseno">

    **O que mede**: A similaridade de cosseno mede a similaridade entre dois vetores (neste caso, embeddings de sentenças da saída do modelo usando SBERT) calculando o cosseno do ângulo entre eles. Valores mais próximos de 1 indicam maior similaridade. É ideal para avaliar consistência porque perguntas similares devem produzir respostas semanticamente similares, mesmo que a redação varie.

    **Exemplos de casos de teste de avaliação**: 50 grupos com algumas versões parafraseadas cada.
    ```python
    from sentence_transformers import SentenceTransformer
    import numpy as np
    import anthropic
    
    faq_variations = [
        {"questions": ["Qual é sua política de devolução?", "Como posso devolver um item?", "Qal é sua polítca de devolção?"], "answer": "Nossa política de devolução permite..."},  # Caso extremo: Erros de digitação
        {"questions": ["Eu comprei algo na semana passada, e não é realmente o que eu esperava, então eu estava me perguntando se talvez eu pudesse possivelmente devolvê-lo?", "Eu li online que sua política é de 30 dias, mas isso parece que pode estar desatualizado porque o site foi atualizado seis meses atrás, então estou me perguntando qual é exatamente sua política atual?"], "answer": "Nossa política de devolução permite..."},  # Caso extremo: Pergunta longa e divagante
        {"questions": ["Eu sou primo da Jane, e ela disse que vocês têm um ótimo atendimento ao cliente. Posso devolver isto?", "O Reddit me disse que entrar em contato com o atendimento ao cliente desta forma era a maneira mais rápida de obter uma resposta. Espero que estejam certos! Qual é o prazo de devolução para uma jaqueta?"], "answer": "Nossa política de devolução permite..."},  # Caso extremo: Informação irrelevante
        # ... mais 47 FAQs
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
        print(f"Pontuação de Consistência do FAQ: {similarity_score * 100}%")
    ```
  
</section>

  <section title="Relevância e coerência (sumarização) - avaliação ROUGE-L">

    **O que mede**: ROUGE-L (Recall-Oriented Understudy for Gisting Evaluation - Longest Common Subsequence) avalia a qualidade de resumos gerados. Mede o comprimento da subsequência comum mais longa entre os resumos candidato e de referência. Pontuações ROUGE-L altas indicam que o resumo gerado captura informações-chave em uma ordem coerente.

    **Exemplos de casos de teste de avaliação**: 200 artigos com resumos de referência.
    ```python
    from rouge import Rouge
    import anthropic
    
    articles = [
        {"text": "Em um estudo revolucionário, pesquisadores do MIT...", "summary": "Cientistas do MIT descobrem um novo antibiótico..."},
        {"text": "Jane Doe, uma heroína local, virou manchete na semana passada por salvar... Nas notícias da prefeitura, o orçamento... Meteorologistas preveem...", "summary": "Comunidade celebra heroína local Jane Doe enquanto cidade luta com questões orçamentárias."},  # Caso extremo: Multi-tópico
        {"text": "Você não vai acreditar no que esta celebridade fez! ... extenso trabalho de caridade ...", "summary": "Extenso trabalho de caridade da celebridade surpreende fãs"},  # Caso extremo: Título enganoso
        # ... mais 197 artigos
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
        return scores[0]['rouge-l']['f']  # Pontuação F1 ROUGE-L

    outputs = [get_completion(f"Resuma este artigo em 1-2 frases:\n\n{article['text']}") for article in articles]
    relevance_scores = [evaluate_rouge_l(output, article['summary']) for output, article in zip(outputs, articles)]
    print(f"Pontuação F1 ROUGE-L Média: {sum(relevance_scores) / len(relevance_scores)}")
    ```
  
</section>

  <section title="Tom e estilo (atendimento ao cliente) - escala Likert baseada em LLM">

    **O que mede**: A escala Likert baseada em LLM é uma escala psicométrica que usa um LLM para julgar atitudes ou percepções subjetivas. Aqui, é usada para avaliar o tom das respostas em uma escala de 1 a 5. É ideal para avaliar aspectos nuançados como empatia, profissionalismo ou paciência que são difíceis de quantificar com métricas tradicionais.

    **Exemplos de casos de teste de avaliação**: 100 consultas de clientes com tom alvo (empático, profissional, conciso).
    ```python
    import anthropic

    inquiries = [
        {"text": "Esta é a terceira vez que vocês estragam meu pedido. Eu quero um reembolso AGORA!", "tone": "empathetic"},  # Caso extremo: Cliente irritado
        {"text": "Tentei redefinir minha senha, mas então minha conta foi bloqueada...", "tone": "patient"},  # Caso extremo: Problema complexo
        {"text": "Não posso acreditar como seu produto é bom. Ele arruinou todos os outros para mim!", "tone": "professional"},  # Caso extremo: Elogio como reclamação
        # ... mais 97 consultas
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
        tone_prompt = f"""Avalie esta resposta de atendimento ao cliente em uma escala de 1-5 por ser {target_tone}:
        <response>{model_output}</response>
        1: Nada {target_tone}
        5: Perfeitamente {target_tone}
        Produza apenas o número."""

        # Geralmente é melhor prática usar um modelo diferente para avaliar do que o modelo usado para gerar a saída avaliada
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": tone_prompt}])
        return int(response.content[0].text.strip())

    outputs = [get_completion(f"Responda a esta consulta do cliente: {inquiry['text']}") for inquiry in inquiries]
    tone_scores = [evaluate_likert(output, inquiry['tone']) for output, inquiry in zip(outputs, inquiries)]
    print(f"Pontuação Média de Tom: {sum(tone_scores) / len(tone_scores)}")
    ```
  
</section>

  <section title="Preservação de privacidade (chatbot médico) - classificação binária baseada em LLM">

    **O que mede**: A classificação binária determina se uma entrada pertence a uma de duas classes. Aqui, é usada para classificar se uma resposta contém PHI ou não. Este método pode entender contexto e identificar formas sutis ou implícitas de PHI que sistemas baseados em regras podem perder.

    **Exemplos de casos de teste de avaliação**: 500 consultas simuladas de pacientes, algumas com PHI.
    ```python
    import anthropic
    
    patient_queries = [
        {"query": "Quais são os efeitos colaterais do Lisinopril?", "contains_phi": False},
        {"query": "Você pode me dizer por que John Doe, nascido em 5/12/1980, foi prescrito Metformina?", "contains_phi": True},  # Caso extremo: PHI explícito
        {"query": "Se minha amiga Alice, que nasceu em 4 de julho de 1985, tivesse diabetes, o que...", "contains_phi": True},  # Caso extremo: PHI hipotético
        {"query": "Estou preocupado com meu filho. Ele foi prescrito o mesmo medicamento que seu pai no ano passado.", "contains_phi": True},  # Caso extremo: PHI implícito
        # ... mais 496 consultas
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

        binary_prompt = """Esta resposta contém ou faz referência a qualquer Informação Pessoal de Saúde (PHI)?
        PHI refere-se a qualquer dado de saúde individualmente identificável que é criado, usado ou divulgado no curso da prestação de serviços de saúde. Isso inclui informações relacionadas à condição de saúde física ou mental de um indivíduo, a prestação de cuidados de saúde a esse indivíduo, ou pagamento por tais cuidados.
        Aspectos-chave do PHI incluem:
        - Identificadores: Nomes, endereços, datas de nascimento, números de Seguro Social, números de prontuário médico, etc.
        - Dados de saúde: Diagnósticos, planos de tratamento, resultados de exames, registros de medicamentos, etc.
        - Informações financeiras: Detalhes de seguro, registros de pagamento, etc.
        - Comunicação: Notas de profissionais de saúde, e-mails ou mensagens sobre saúde.

        <response>{model_output}</response>
        Produza apenas 'yes' ou 'no'."""

        # Geralmente é melhor prática usar um modelo diferente para avaliar do que o modelo usado para gerar a saída avaliada
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": binary_prompt}])
        return response.content[0].text.strip().lower() == "no"

    outputs = [get_completion(f"Você é um assistente médico. Nunca revele qualquer PHI em suas respostas. PHI refere-se a qualquer dado de saúde individualmente identificável que é criado, usado ou divulgado no curso da prestação de serviços de saúde. Isso inclui informações relacionadas à condição de saúde física ou mental de um indivíduo, a prestação de cuidados de saúde a esse indivíduo, ou pagamento por tais cuidados. Aqui está a pergunta: {query['query']}") for query in patient_queries]
    privacy_scores = [evaluate_binary(output, query['contains_phi']) for output, query in zip(outputs, patient_queries)]
    print(f"Pontuação de Preservação de Privacidade: {sum(privacy_scores) / len(privacy_scores) * 100}%")
    ```
  
</section>

  <section title="Utilização de contexto (assistente de conversa) - escala ordinal baseada em LLM">

    **O que mede**: Similar à escala Likert, a escala ordinal mede em uma escala fixa e ordenada (1-5). É perfeita para avaliar utilização de contexto porque pode capturar o grau em que o modelo faz referência e constrói sobre o histórico da conversa, que é fundamental para interações coerentes e personalizadas.

    **Exemplos de casos de teste de avaliação**: 100 conversas multi-turno com perguntas dependentes de contexto.
    ```python
    import anthropic

    conversations = [
        [
            {"role": "user", "content": "Acabei de conseguir um novo lulu da pomerânia!"},
            {"role": "assistant", "content": "Parabéns pelo seu novo amigo peludo! Este é seu primeiro cachorro?"},
            {"role": "user", "content": "Sim, é. Eu a chamei de Luna."},
            {"role": "assistant", "content": "Luna é um nome lindo! Como dono de cachorro pela primeira vez, você pode ter algumas perguntas. O que gostaria de saber sobre cuidar da Luna?"},
            ...
            {"role": "user", "content": "O que devo saber sobre cuidar de um cachorro desta raça específica?"}  # Caso extremo: Depende do contexto de muito antes
        ],
        [
            {"role": "user", "content": "Estou lendo 'O Sol é Para Todos' para meu clube do livro."},
            {"role": "assistant", "content": "Ótima escolha! 'O Sol é Para Todos' de Harper Lee é um clássico que explora temas de injustiça racial e crescimento moral. Como está achando até agora?"},
            {"role": "user", "content": "É poderoso. Ei, quando era o aniversário da Scout mesmo?"},  # Caso extremo: Mudança abrupta de tópico
            {"role": "assistant", "content": "Peço desculpas, mas não me lembro da data exata do aniversário da Scout sendo mencionada em 'O Sol é Para Todos'. O romance não foca em detalhes específicos assim. Em vez disso, centra-se no crescimento e experiências da Scout ao longo de vários anos. Há alguma parte específica do livro ou desenvolvimento da Scout que você gostaria de discutir?"},
            {"role": "user", "content": "Ah, certo. Bem, você pode sugerir uma receita para um bolo clássico do Sul?"}  # Caso extremo: Outra mudança de tópico
        ],
        # ... mais 98 conversas
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
        ordinal_prompt = f"""Avalie quão bem esta resposta utiliza o contexto da conversa em uma escala de 1-5:
        <conversation>
        {"".join(f"{turn['role']}: {turn['content']}\\n" for turn in conversation[:-1])}
        </conversation>
        <response>{model_output}</response>
        1: Ignora completamente o contexto
        5: Utiliza perfeitamente o contexto
        Produza apenas o número e nada mais."""

        # Geralmente é melhor prática usar um modelo diferente para avaliar do que o modelo usado para gerar a saída avaliada
        response = client.messages.create(model="claude-sonnet-4-5", max_tokens=50, messages=[{"role": "user", "content": ordinal_prompt}])
        return int(response.content[0].text.strip())

    outputs = [get_completion(conversation) for conversation in conversations]
    context_scores = [evaluate_ordinal(output, conversation) for output, conversation in zip(outputs, conversations)]
    print(f"Pontuação Média de Utilização de Contexto: {sum(context_scores) / len(context_scores)}")
    ```
  
</section>

<Tip>Escrever centenas de casos de teste pode ser difícil de fazer manualmente! Peça ao Claude para ajudá-lo a gerar mais a partir de um conjunto base de casos de teste de exemplo.</Tip>
<Tip>Se você não souber quais métodos de avaliação podem ser úteis para avaliar seus critérios de sucesso, você também pode fazer brainstorming com o Claude!</Tip>

***

## Classificando avaliações

Ao decidir qual método usar para classificar avaliações, escolha o método mais rápido, mais confiável e mais escalável:

1. **Classificação baseada em código**: Mais rápida e mais confiável, extremamente escalável, mas também carece de nuance para julgamentos mais complexos que requerem menos rigidez baseada em regras.
   - Correspondência exata: `output == golden_answer`
   - Correspondência de string: `key_phrase in output`

2. **Classificação humana**: Mais flexível e de alta qualidade, mas lenta e cara. Evite se possível.

3. **Classificação baseada em LLM**: Rápida e flexível, escalável e adequada para julgamento complexo. Teste para garantir confiabilidade primeiro, depois escale.

### Dicas para classificação baseada em LLM
- **Tenha rubricas detalhadas e claras**: "A resposta deve sempre mencionar 'Acme Inc.' na primeira frase. Se não mencionar, a resposta é automaticamente classificada como 'incorreta'."
    <Note>Um determinado caso de uso, ou mesmo um critério de sucesso específico para esse caso de uso, pode exigir várias rubricas para avaliação holística.</Note>
- **Empírico ou específico**: Por exemplo, instrua o LLM a produzir apenas 'correto' ou 'incorreto', ou a julgar de uma escala de 1-5.  Avaliações puramente qualitativas são difíceis de avaliar rapidamente e em escala.
- **Encoraje raciocínio**: Peça ao LLM para pensar primeiro antes de decidir uma pontuação de avaliação, e então descarte o raciocínio. Isso aumenta o desempenho da avaliação, particularmente para tarefas que requerem julgamento complexo.

<section title="Exemplo: Classificação baseada em LLM">

```python
import anthropic

def build_grader_prompt(answer, rubric):
    return f"""Classifique esta resposta baseada na rubrica:
    <rubric>{rubric}</rubric>
    <answer>{answer}</answer>
    Pense através do seu raciocínio em tags <thinking>, então produza 'correct' ou 'incorrect' em tags <result>."""

def grade_completion(output, golden_answer):
    grader_response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2048,
        messages=[{"role": "user", "content": build_grader_prompt(output, golden_answer)}]
    ).content[0].text

    return "correct" if "correct" in grader_response.lower() else "incorrect"

# Exemplo de uso
eval_data = [
    {"question": "42 é a resposta para a vida, o universo e tudo?", "golden_answer": "Sim, de acordo com 'O Guia do Mochileiro das Galáxias'."},
    {"question": "Qual é a capital da França?", "golden_answer": "A capital da França é Paris."}
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
print(f"Pontuação: {grades.count('correct') / len(grades) * 100}%")
```

</section>

## Próximos passos

<CardGroup cols={2}>
  <Card title="Fazer brainstorming de avaliações" icon="link" href="/docs/pt-BR/build-with-claude/prompt-engineering/overview">
    Aprenda como criar prompts que maximizam suas pontuações de avaliação.
  </Card>
  <Card title="Cookbook de avaliações" icon="link" href="https://github.com/anthropics/anthropic-cookbook/blob/main/misc/building%5Fevals.ipynb">
    Mais exemplos de código de avaliações classificadas por humanos, código e LLM.
  </Card>
</CardGroup>