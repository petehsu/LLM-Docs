# Deixe Claude pensar (prompting de cadeia de pensamento) para aumentar o desempenho

Aprenda como usar prompting de cadeia de pensamento para melhorar a qualidade das respostas do Claude em tarefas complexas.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Quando enfrentado com tarefas complexas como pesquisa, análise ou resolução de problemas, dar espaço para Claude pensar pode melhorar dramaticamente seu desempenho. Esta técnica, conhecida como prompting de cadeia de pensamento (CoT), encoraja Claude a decompor problemas passo a passo, levando a saídas mais precisas e nuançadas.

## Antes de implementar CoT

### Por que deixar Claude pensar?
- **Precisão:** Passar por problemas passo a passo reduz erros, especialmente em matemática, lógica, análise ou tarefas geralmente complexas.
- **Coerência:** O pensamento estruturado leva a respostas mais coesas e bem organizadas.
- **Depuração:** Ver o processo de pensamento do Claude ajuda você a identificar onde os prompts podem estar pouco claros.

### Por que não deixar Claude pensar?
- O aumento do comprimento da saída pode impactar a latência.
- Nem todas as tarefas exigem pensamento aprofundado. Use CoT com critério para garantir o equilíbrio certo entre desempenho e latência.

<Tip>Use CoT para tarefas que um humano precisaria pensar, como matemática complexa, análise multi-etapas, escrita de documentos complexos ou decisões com muitos fatores.</Tip>

***

## Como fazer prompting para pensamento

As técnicas de cadeia de pensamento abaixo estão **ordenadas da menos para a mais complexa**. Métodos menos complexos ocupam menos espaço na janela de contexto, mas também são geralmente menos poderosos.

<Tip>**Dica de CoT**: Sempre tenha Claude saída seu pensamento. Sem saída seu processo de pensamento, nenhum pensamento ocorre!</Tip>

- **Prompt básico**: Inclua "Pense passo a passo" em seu prompt.
    - Falta orientação sobre *como* pensar (o que é especialmente não ideal se uma tarefa é muito específica para seu aplicativo, caso de uso ou organização)
    <section title="Exemplo: Escrevendo emails de doadores (CoT básico)">

        | Função | Conteúdo |
        | ---- | ------- |
        | Usuário | Rascunhe emails personalizados para doadores pedindo contribuições para o programa Care for Kids deste ano.<br/><br/>Informações do programa:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Informações do doador:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Pense passo a passo antes de escrever o email. |
    
</section>
- **Prompt orientado**: Descreva etapas específicas para Claude seguir em seu processo de pensamento.
    - Falta estruturação para facilitar a remoção e separação da resposta do pensamento.
    <section title="Exemplo: Escrevendo emails de doadores (CoT orientado)">

        | Função | Conteúdo |
        | ---- | ------- |
        | Usuário | Rascunhe emails personalizados para doadores pedindo contribuições para o programa Care for Kids deste ano.<br/><br/>Informações do programa:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Informações do doador:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Pense antes de escrever o email. Primeiro, pense sobre qual mensagem pode atrair este doador dado seu histórico de doações e quais campanhas eles apoiaram no passado. Depois, pense sobre quais aspectos do programa Care for Kids os atrairiam, dado seu histórico. Finalmente, escreva o email personalizado do doador usando sua análise. |
    
</section>
- **Prompt estruturado**: Use tags XML como `<thinking>` e `<answer>` para separar o raciocínio da resposta final.
     <section title="Exemplo: Escrevendo emails de doadores (CoT orientado estruturado)">

        | Função | Conteúdo |
        | ---- | ------- |
        | Usuário | Rascunhe emails personalizados para doadores pedindo contribuições para o programa Care for Kids deste ano.<br/><br/>Informações do programa:<br/>\\{\{PROGRAM_DETAILS}}<br/>\</program><br/><br/>Informações do doador:<br/>\<donor>\{\{DONOR_DETAILS}}<br/>\</donor><br/><br/>Pense antes de escrever o email em tags \<thinking>. Primeiro, pense sobre qual mensagem pode atrair este doador dado seu histórico de doações e quais campanhas eles apoiaram no passado. Depois, pense sobre quais aspectos do programa Care for Kids os atrairiam, dado seu histórico. Finalmente, escreva o email personalizado do doador em tags \<email>, usando sua análise. |
    
</section>
    
### Exemplos

  <section title="Exemplo: Análise financeira sem pensamento">

    Sem pensamento passo a passo, Claude fornece uma recomendação que parece razoável, mas carece de profundidade. Não quantifica os resultados potenciais ou considera o desempenho histórico do mercado, que são cruciais para tomar uma decisão informada.
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Você é um consultor financeiro. Um cliente quer investir \$10.000. Ele pode escolher entre duas opções: A) Uma ação que historicamente retorna 12% anualmente, mas é volátil, ou B) Um título que garante 6% anualmente. O cliente precisa do dinheiro em 5 anos para uma entrada em uma casa. Qual opção você recomenda? |
    | Assistente | Com base nas informações fornecidas, eu recomendaria a opção B, o título que garante um retorno anual de 6%. Aqui está o porquê:<br/><br/>1. Certeza: O título oferece um retorno anual garantido de 6%, que fornece certeza no planejamento financeiro. Isso é crucial quando o cliente tem um objetivo financeiro específico (entrada) com um cronograma fixo (5 anos).<br/>2. Aversão ao risco: Como o cliente precisa deste dinheiro para um evento importante da vida (comprar uma casa), ele provavelmente tem uma baixa tolerância ao risco. A volatilidade do mercado de ações pode prejudicar seus planos se houver uma queda próxima ao momento em que precisar dos fundos.<br/>3. Horizonte de tempo: Com apenas 5 anos, há menos tempo para se recuperar de possíveis quedas do mercado de ações. Horizontes de investimento mais longos (10+ anos) são geralmente mais adequados para lidar com a volatilidade do mercado de ações.<br/><br/>Embora o retorno histórico de 12% da ação seja atraente, o desempenho passado não garante resultados futuros. Os 6% garantidos do título garantem que o cliente terá os fundos de que precisa quando chegar a hora de fazer a entrada. |
  
</section>
  <section title="Exemplo: Análise financeira com pensamento">

    Com pensamento passo a passo, o consultor fornece uma análise muito mais rica. Calcula números exatos para ambos os cenários, considera a volatilidade histórica do mercado e analisa profundamente a tolerância ao risco do cliente. Este raciocínio minucioso leva a uma recomendação mais confiante e justificável.
    | Função | Conteúdo |
    | ---- | ------- |
    | Usuário | Você é um consultor financeiro. Um cliente quer investir \$10.000. Ele pode escolher entre duas opções: A) Uma ação que historicamente retorna 12% anualmente, mas é volátil, ou B) Um título que garante 6% anualmente. O cliente precisa do dinheiro em 5 anos para uma entrada em uma casa. Qual opção você recomenda? Pense passo a passo. |
    | Assistente | Para determinar a melhor opção de investimento para nosso cliente, vou considerar vários fatores passo a passo:<br/><br/>\<thinking><br/>1. Entenda o objetivo e cronograma do cliente:<br/>   - Objetivo: Entrada para uma casa<br/>   - Cronograma: 5 anos<br/>   - Implicação: Este é um objetivo financeiro de curto prazo e alta prioridade. O cliente provavelmente não pode arcar com risco significativo ou volatilidade.<br/><br/>2. Analise a Opção A (Ação):<br/>   - Pró: Retorno histórico mais alto (12% anualmente)<br/>   - Contra: Volátil (implicando potencial para ganhos ou perdas significativas)<br/>   - Calcule o retorno potencial de 5 anos:<br/>     - Melhor caso (12% anualmente): \$10.000 * (1.12)^5 ≈ \$17.623,42<br/>     - Pior caso (queda do mercado): Pode perder uma porção substancial, por exemplo, queda de 50% = \$5.000<br/><br/>3. Analise a Opção B (Título):<br/>   - Pró: Retorno garantido (6% anualmente)<br/>   - Contra: Retorno mais baixo em comparação com o desempenho histórico das ações<br/>   - Calcule o retorno de 5 anos:<br/>     - Garantido: \$10.000 * (1.06)^5 ≈ \$13.382,25<br/><br/>4. Considere a tolerância ao risco:<br/>   - Objetivo é uma entrada de casa (essencial, não discricionário)<br/>   - Cronograma curto (5 anos) limita a capacidade de se recuperar de quedas do mercado<br/>   - Conclusão: O cliente provavelmente tem baixa tolerância ao risco<br/><br/>5. Perspectiva histórica:<br/>   - Os 12% da ação são históricos, não garantidos<br/>   - Em períodos de 5 anos, o mercado de ações pode variar muito:<br/>     - 2003-2007 (pré-crise financeira): S&P 500 acima de ~82%<br/>     - 2007-2011 (durante a crise): S&P 500 abaixo de ~2%<br/>   - Conclusão: O desempenho passado não garante resultados futuros, especialmente de curto prazo<br/><br/>6. Análise final:<br/>   - Opção A (Ação): Retorno potencial mais alto, mas risco inaceitável de não atingir o objetivo de entrada<br/>   - Opção B (Título): Garantido de atingir ~80% do melhor cenário de ação, 100% de certeza de ter fundos<br/>\</thinking><br/><br/>\<answer><br/>Recomendo a Opção B, o título com um retorno anual garantido de 6%. Embora o retorno histórico de 12% da ação seja tentador, o título garante que você terá \$13.382,25 em 5 anos para sua entrada de casa. Dado a importância e o cronograma curto de seu objetivo, a volatilidade da ação representa um risco inaceitável. O título fornece certeza, que é inestimável para um marco financeiro tão crucial.<br/>\</answer> |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Biblioteca de prompts" icon="link" href="/docs/pt-BR/resources/prompt-library/library">
    Obtenha inspiração de uma seleção curada de prompts para várias tarefas e casos de uso.
  </Card>
  <Card title="Tutorial de prompting do GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Um tutorial repleto de exemplos que cobre os conceitos de engenharia de prompts encontrados em nossa documentação.
  </Card>
  <Card title="Tutorial de prompting do Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Uma versão mais leve de nosso tutorial de engenharia de prompts através de uma planilha interativa.
  </Card>
</CardGroup>