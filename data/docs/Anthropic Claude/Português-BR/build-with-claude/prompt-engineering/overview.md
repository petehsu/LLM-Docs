# Visão geral da engenharia de prompts

Aprenda técnicas de engenharia de prompts para melhorar o desempenho do Claude

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

## Antes da engenharia de prompts

Este guia assume que você tem:
1. Uma definição clara dos critérios de sucesso para seu caso de uso
2. Algumas maneiras de testar empiricamente contra esses critérios
3. Um primeiro rascunho de prompt que você deseja melhorar

Se não, sugerimos fortemente que você dedique tempo para estabelecer isso primeiro. Confira [Defina seus critérios de sucesso](/docs/pt-BR/test-and-evaluate/define-success) e [Crie avaliações empíricas fortes](/docs/pt-BR/test-and-evaluate/develop-tests) para dicas e orientações.

<Card title="Gerador de prompts" icon="link" href="/dashboard">
  Não tem um primeiro rascunho de prompt? Tente o gerador de prompts no Claude Console!
</Card>

***

## Quando fazer engenharia de prompts

  Este guia se concentra em critérios de sucesso que são controláveis através da engenharia de prompts.
  Nem todo critério de sucesso ou avaliação com falha é melhor resolvido pela engenharia de prompts. Por exemplo, latência e custo às vezes podem ser melhorados mais facilmente selecionando um modelo diferente.

<section title="Prompting vs. fine-tuning">

  A engenharia de prompts é muito mais rápida do que outros métodos de controle de comportamento do modelo, como fine-tuning, e muitas vezes pode gerar saltos de desempenho em muito menos tempo. Aqui estão algumas razões para considerar a engenharia de prompts em vez de fine-tuning:<br/>
  - **Eficiência de recursos**: Fine-tuning requer GPUs de alta qualidade e muita memória, enquanto a engenharia de prompts requer apenas entrada de texto, tornando-a muito mais amigável aos recursos.
  - **Custo-efetividade**: Para serviços de IA baseados em nuvem, fine-tuning incorre em custos significativos. A engenharia de prompts usa o modelo base, que é tipicamente mais barato.
  - **Mantendo atualizações de modelo**: Quando os provedores atualizam modelos, versões fine-tuned podem precisar de retreinamento. Os prompts geralmente funcionam entre versões sem mudanças.
  - **Economia de tempo**: Fine-tuning pode levar horas ou até dias. Em contraste, a engenharia de prompts fornece resultados quase instantâneos, permitindo resolução rápida de problemas.
  - **Necessidades mínimas de dados**: Fine-tuning precisa de dados substanciais específicos da tarefa e rotulados, que podem ser escassos ou caros. A engenharia de prompts funciona com aprendizado few-shot ou até zero-shot.
  - **Flexibilidade e iteração rápida**: Tente rapidamente várias abordagens, ajuste prompts e veja resultados imediatos. Essa experimentação rápida é difícil com fine-tuning.
  - **Adaptação de domínio**: Adapte facilmente modelos a novos domínios fornecendo contexto específico do domínio em prompts, sem retreinamento.
  - **Melhorias de compreensão**: A engenharia de prompts é muito mais eficaz do que fine-tuning em ajudar modelos a entender melhor e utilizar conteúdo externo, como documentos recuperados
  - **Preserva conhecimento geral**: Fine-tuning corre o risco de esquecimento catastrófico, onde o modelo perde conhecimento geral. A engenharia de prompts mantém as amplas capacidades do modelo.
  - **Transparência**: Os prompts são legíveis por humanos, mostrando exatamente quais informações o modelo recebe. Essa transparência ajuda na compreensão e depuração.

</section>

***

## Como fazer engenharia de prompts

As páginas de engenharia de prompts nesta seção foram organizadas das técnicas mais amplamente eficazes para técnicas mais especializadas. Ao solucionar problemas de desempenho, sugerimos que você tente essas técnicas em ordem, embora o impacto real de cada técnica dependa do seu caso de uso.
1. [Gerador de prompts](/docs/pt-BR/build-with-claude/prompt-engineering/prompt-generator)
2. [Seja claro e direto](/docs/pt-BR/build-with-claude/prompt-engineering/be-clear-and-direct)
3. [Use exemplos (multishot)](/docs/pt-BR/build-with-claude/prompt-engineering/multishot-prompting)
4. [Deixe Claude pensar (chain of thought)](/docs/pt-BR/build-with-claude/prompt-engineering/chain-of-thought)
5. [Use tags XML](/docs/pt-BR/build-with-claude/prompt-engineering/use-xml-tags)
6. [Dê um papel ao Claude (system prompts)](/docs/pt-BR/build-with-claude/prompt-engineering/system-prompts)
7. [Preencha previamente a resposta do Claude](/docs/pt-BR/build-with-claude/prompt-engineering/prefill-claudes-response)
8. [Encadeie prompts complexos](/docs/pt-BR/build-with-claude/prompt-engineering/chain-prompts)
9. [Dicas de contexto longo](/docs/pt-BR/build-with-claude/prompt-engineering/long-context-tips)

***

## Tutorial de engenharia de prompts

Se você é um aprendiz interativo, você pode mergulhar em nossos tutoriais interativos!

<CardGroup cols={2}>
  <Card title="Tutorial de prompting do GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Um tutorial repleto de exemplos que cobre os conceitos de engenharia de prompts encontrados em nossa documentação.
  </Card>
  <Card title="Tutorial de prompting do Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Uma versão mais leve do nosso tutorial de engenharia de prompts via uma planilha interativa.
  </Card>
</CardGroup>