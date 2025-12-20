# Defina seus critérios de sucesso

---

Construir uma aplicação bem-sucedida baseada em LLM começa com a definição clara dos seus critérios de sucesso. Como você saberá quando sua aplicação estiver boa o suficiente para publicar?

Ter critérios de sucesso claros garante que seus esforços de engenharia e otimização de prompts estejam focados em alcançar objetivos específicos e mensuráveis.

***

## Construindo critérios fortes

Bons critérios de sucesso são:
- **Específicos**: Defina claramente o que você quer alcançar. Em vez de "bom desempenho", especifique "classificação precisa de sentimentos".
- **Mensuráveis**: Use métricas quantitativas ou escalas qualitativas bem definidas. Números proporcionam clareza e escalabilidade, mas medidas qualitativas podem ser valiosas se aplicadas consistentemente *junto* com medidas quantitativas.
    - Mesmo tópicos "nebulosos" como ética e segurança podem ser quantificados:
        |      | Critérios de segurança                |
        | ---- | --- |
        | Ruim  | Saídas seguras                   |
        | Bom | Menos de 0,1% das saídas em 10.000 testes sinalizados por toxicidade pelo nosso filtro de conteúdo. | 
    <section title="Exemplos de métricas e métodos de medição">

        **Métricas quantitativas**:
            - Específicas da tarefa: pontuação F1, pontuação BLEU, perplexidade
            - Genéricas: Precisão, acurácia, recall
            - Operacionais: Tempo de resposta (ms), tempo de atividade (%)

        **Métodos quantitativos**:
            - Testes A/B: Compare o desempenho com um modelo de referência ou versão anterior.
            - Feedback do usuário: Medidas implícitas como taxas de conclusão de tarefas.
            - Análise de casos extremos: Porcentagem de casos extremos tratados sem erros.

        **Escalas qualitativas**:
            - Escalas Likert: "Avalie a coerência de 1 (sem sentido) a 5 (perfeitamente lógico)"
            - Rubricas de especialistas: Linguistas avaliando a qualidade da tradução com base em critérios definidos        
    
</section>
- **Alcançáveis**: Baseie seus objetivos em benchmarks do setor, experimentos anteriores, pesquisas de IA ou conhecimento especializado. Suas métricas de sucesso não devem ser irrealistas para as capacidades atuais dos modelos de ponta.
- **Relevantes**: Alinhe seus critérios com o propósito da sua aplicação e as necessidades do usuário. Precisão forte de citações pode ser crítica para aplicativos médicos, mas menos importante para chatbots casuais.

<section title="Exemplo de critérios de fidelidade de tarefa para análise de sentimento">

    |      | Critérios |
    | ---- | --- |
    | Ruim  | O modelo deve classificar bem os sentimentos                    |
    | Bom | Nosso modelo de análise de sentimento deve alcançar uma pontuação F1 de pelo menos 0,85 (Mensurável, Específico) em um conjunto de teste separado* de 10.000 posts diversos do Twitter (Relevante), o que representa uma melhoria de 5% em relação à nossa linha de base atual (Alcançável). |

    **Mais sobre conjuntos de teste separados na próxima seção*

</section>

***

## Critérios de sucesso comuns a considerar

Aqui estão alguns critérios que podem ser importantes para o seu caso de uso. Esta lista não é exaustiva.

  <section title="Fidelidade da tarefa">

    Quão bem o modelo precisa desempenhar na tarefa? Você também pode precisar considerar o tratamento de casos extremos, como quão bem o modelo precisa se desempenhar em entradas raras ou desafiadoras.
  
</section>
  <section title="Consistência">

    Quão semelhantes precisam ser as respostas do modelo para tipos similares de entrada? Se um usuário fizer a mesma pergunta duas vezes, quão importante é que ele receba respostas semanticamente semelhantes?
  
</section>
  <section title="Relevância e coerência">

    Quão bem o modelo aborda diretamente as perguntas ou instruções do usuário? Quão importante é que a informação seja apresentada de maneira lógica e fácil de seguir?
  
</section>
  <section title="Tom e estilo">

    Quão bem o estilo de saída do modelo corresponde às expectativas? Quão apropriada é sua linguagem para o público-alvo?
  
</section>
  <section title="Preservação da privacidade">

    Qual é uma métrica de sucesso para como o modelo lida com informações pessoais ou sensíveis? Ele pode seguir instruções para não usar ou compartilhar certos detalhes?
  
</section>
  <section title="Utilização de contexto">

    Com que eficácia o modelo usa o contexto fornecido? Quão bem ele referencia e se baseia em informações fornecidas em seu histórico?
  
</section>
  <section title="Latência">

    Qual é o tempo de resposta aceitável para o modelo? Isso dependerá dos requisitos em tempo real da sua aplicação e das expectativas do usuário.
  
</section>
  <section title="Preço">

    Qual é o seu orçamento para executar o modelo? Considere fatores como o custo por chamada de API, o tamanho do modelo e a frequência de uso.
  
</section>

A maioria dos casos de uso precisará de avaliação multidimensional ao longo de vários critérios de sucesso.

<section title="Exemplo de critérios multidimensionais para análise de sentimento">

    |      | Critérios |
    | ---- | --- |
    | Ruim  | O modelo deve classificar bem os sentimentos                    |
    | Bom | Em um conjunto de teste separado de 10.000 posts diversos do Twitter, nosso modelo de análise de sentimento deve alcançar:<br/>- uma pontuação F1 de pelo menos 0,85<br/>- 99,5% das saídas são não tóxicas<br/>- 90% dos erros causariam inconveniência, não erro grave*<br/>- 95% do tempo de resposta < 200ms |

    **Na realidade, também definiríamos o que significa "inconveniência" e "grave".*

</section>

***

## Próximos passos

<CardGroup cols={2}>
  <Card title="Faça brainstorm de critérios" icon="link" href="https://claude.ai/">
    Faça brainstorm de critérios de sucesso para seu caso de uso com Claude em claude.ai.<br/><br/>**Dica**: Coloque esta página no chat como orientação para o Claude!
  </Card>
  <Card title="Projete avaliações" icon="link" href="/docs/pt-BR/be-clear-direct">
    Aprenda a construir conjuntos de teste fortes para medir o desempenho do Claude em relação aos seus critérios.
  </Card>
</CardGroup>