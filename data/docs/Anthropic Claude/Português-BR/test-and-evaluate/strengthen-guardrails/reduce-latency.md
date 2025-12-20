# Reduzindo latência

Aprenda como reduzir a latência ao usar Claude, incluindo escolha de modelo, otimização de prompt e streaming.

---

Latência refere-se ao tempo que leva para o modelo processar um prompt e gerar uma saída. A latência pode ser influenciada por vários fatores, como o tamanho do modelo, a complexidade do prompt e a infraestrutura subjacente que suporta o modelo e o ponto de interação.

<Note>
É sempre melhor primeiro projetar um prompt que funcione bem sem restrições de modelo ou prompt, e então tentar estratégias de redução de latência depois. Tentar reduzir a latência prematuramente pode impedir que você descubra como é o desempenho máximo.
</Note>

---

## Como medir latência

Ao discutir latência, você pode encontrar vários termos e medições:

- **Latência base**: Este é o tempo levado pelo modelo para processar o prompt e gerar a resposta, sem considerar os tokens de entrada e saída por segundo. Fornece uma ideia geral da velocidade do modelo.
- **Tempo até o primeiro token (TTFT)**: Esta métrica mede o tempo que leva para o modelo gerar o primeiro token da resposta, a partir de quando o prompt foi enviado. É particularmente relevante quando você está usando streaming (mais sobre isso depois) e quer fornecer uma experiência responsiva aos seus usuários.

Para um entendimento mais aprofundado desses termos, confira nosso [glossário](/docs/pt-BR/about-claude/glossary).

---

## Como reduzir latência

### 1. Escolha o modelo certo

Uma das maneiras mais diretas de reduzir latência é selecionar o modelo apropriado para seu caso de uso. A Anthropic oferece uma [gama de modelos](/docs/pt-BR/about-claude/models/overview) com diferentes capacidades e características de desempenho. Considere seus requisitos específicos e escolha o modelo que melhor se adequa às suas necessidades em termos de velocidade e qualidade de saída.

Para aplicações críticas em velocidade, **Claude Haiku 4.5** oferece os tempos de resposta mais rápidos mantendo alta inteligência:

```python
import anthropic

client = anthropic.Anthropic()

# Para aplicações sensíveis ao tempo, use Claude Haiku 4.5
message = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=100,
    messages=[{
        "role": "user",
        "content": "Summarize this customer feedback in 2 sentences: [feedback text]"
    }]
)
```

Para mais detalhes sobre métricas de modelo, veja nossa página de [visão geral dos modelos](/docs/pt-BR/about-claude/models/overview).

### 2. Otimize o comprimento do prompt e da saída

Minimize o número de tokens tanto no seu prompt de entrada quanto na saída esperada, mantendo ainda alto desempenho. Quanto menos tokens o modelo tiver que processar e gerar, mais rápida será a resposta.

Aqui estão algumas dicas para ajudá-lo a otimizar seus prompts e saídas:

- **Seja claro mas conciso**: Procure transmitir sua intenção de forma clara e concisa no prompt. Evite detalhes desnecessários ou informações redundantes, mantendo em mente que [Claude carece de contexto](/docs/pt-BR/build-with-claude/prompt-engineering/be-clear-and-direct) sobre seu caso de uso e pode não fazer os saltos lógicos pretendidos se as instruções não estiverem claras.
- **Peça respostas mais curtas**: Peça ao Claude diretamente para ser conciso. A família de modelos Claude 3 tem melhor dirigibilidade em relação às gerações anteriores. Se Claude está produzindo comprimento indesejado, peça ao Claude para [conter sua tagarelice](/docs/pt-BR/build-with-claude/prompt-engineering/be-clear-and-direct).
  <Tip> Devido a como LLMs contam [tokens](/docs/pt-BR/about-claude/glossary#tokens) em vez de palavras, pedir uma contagem exata de palavras ou um limite de contagem de palavras não é uma estratégia tão eficaz quanto pedir limites de contagem de parágrafos ou frases.</Tip>
- **Defina limites de saída apropriados**: Use o parâmetro `max_tokens` para definir um limite rígido no comprimento máximo da resposta gerada. Isso impede que Claude gere saídas excessivamente longas.
  > **Nota**: Quando a resposta atinge `max_tokens` tokens, a resposta será cortada, talvez no meio da frase ou no meio da palavra, então esta é uma técnica grosseira que pode exigir pós-processamento e geralmente é mais apropriada para respostas de múltipla escolha ou respostas curtas onde a resposta vem logo no início.
- **Experimente com temperatura**: O [parâmetro](/docs/pt-BR/api/messages) `temperature` controla a aleatoriedade da saída. Valores mais baixos (por exemplo, 0.2) às vezes podem levar a respostas mais focadas e mais curtas, enquanto valores mais altos (por exemplo, 0.8) podem resultar em saídas mais diversas mas potencialmente mais longas.

Encontrar o equilíbrio certo entre clareza do prompt, qualidade da saída e contagem de tokens pode exigir alguma experimentação.

### 3. Aproveite o streaming

Streaming é um recurso que permite ao modelo começar a enviar de volta sua resposta antes que a saída completa esteja pronta. Isso pode melhorar significativamente a responsividade percebida da sua aplicação, já que os usuários podem ver a saída do modelo em tempo real.

Com streaming habilitado, você pode processar a saída do modelo conforme ela chega, atualizando sua interface de usuário ou realizando outras tarefas em paralelo. Isso pode melhorar muito a experiência do usuário e fazer sua aplicação parecer mais interativa e responsiva.

Visite [streaming Messages](/docs/pt-BR/build-with-claude/streaming) para aprender sobre como você pode implementar streaming para seu caso de uso.