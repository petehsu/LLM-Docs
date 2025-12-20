# Use exemplos (multishot prompting) para guiar o comportamento do Claude

Aprenda como usar exemplos para melhorar a precisão e consistência das respostas do Claude através de técnicas de few-shot e multishot prompting.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Exemplos são sua arma secreta para conseguir que Claude gere exatamente o que você precisa. Ao fornecer alguns exemplos bem elaborados em seu prompt, você pode melhorar dramaticamente a precisão, consistência e qualidade das saídas do Claude.
Esta técnica, conhecida como few-shot ou multishot prompting, é particularmente eficaz para tarefas que exigem saídas estruturadas ou conformidade com formatos específicos.

<Tip>**Potencialize seus prompts**: Inclua 3-5 exemplos diversos e relevantes para mostrar ao Claude exatamente o que você quer. Mais exemplos = melhor desempenho, especialmente para tarefas complexas.</Tip>

## Por que usar exemplos?

- **Precisão**: Exemplos reduzem a má interpretação de instruções.
- **Consistência**: Exemplos garantem estrutura e estilo uniformes.
- **Desempenho**: Exemplos bem escolhidos aumentam a capacidade do Claude de lidar com tarefas complexas.

## Elaborando exemplos eficazes

Para máxima eficácia, certifique-se de que seus exemplos sejam:
- **Relevantes**: Seus exemplos espelham seu caso de uso real.
- **Diversos**: Seus exemplos cobrem casos extremos e desafios potenciais, e variam o suficiente para que Claude não capture inadvertidamente padrões não intencionais.
- **Claros**: Seus exemplos são envolvidos em tags `<example>` (se múltiplos, aninhados em tags `<examples>`) para estrutura.

<Tip>Peça ao Claude para avaliar seus exemplos quanto à relevância, diversidade ou clareza. Ou peça ao Claude para gerar mais exemplos com base em seu conjunto inicial.</Tip>
<section title="Exemplo: Analisando feedback de clientes">

    Observe que na versão "sem exemplos", Claude não lista múltiplas opções para cada categoria, apesar de sua análise escrita indicar que há múltiplas categorias para certos feedbacks. Também inclui uma explicação longa quando podemos não querer isso.

    | Função | Sem Exemplos | Com Exemplos |
    | --- | --- | --- |
    | Usuário | Analise este feedback de cliente e categorize os problemas. Use estas categorias: UI/UX, Performance, Feature Request, Integration, Pricing, e Other. Também avalie o sentimento (Positive/Neutral/Negative) e prioridade (High/Medium/Low).<br/><br/>Aqui está o feedback: \{\{FEEDBACK\}\} | Nossa equipe de CS está sobrecarregada com feedback não estruturado. Sua tarefa é analisar feedback e categorizar problemas para nossas equipes de produto e engenharia. Use estas categorias: UI/UX, Performance, Feature Request, Integration, Pricing, e Other. Também avalie o sentimento (Positive/Neutral/Negative) e prioridade (High/Medium/Low). Aqui está um exemplo:<br/><br/>\<example><br/>Input: O novo dashboard é uma bagunça! Leva uma eternidade para carregar, e não consigo encontrar o botão de exportação. Corrija isso ASAP!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High\</example><br/><br/>Agora, analise este feedback: \{\{FEEDBACK\}\} |
    | Assistente (resposta do Claude) | Aqui está a análise do feedback do cliente:<br/><br/>Issue: UI/UX<br/>Sentiment: Negative<br/>Priority: High<br/>O cliente está frustrado com o novo design do dashboard, que acha desorganizado e lento para carregar. Especificamente, menciona o botão "export" ausente, que é provavelmente um recurso crítico. Este problema precisa ser resolvido como alta prioridade.<br/><br/>Issue: Integration<br/>Sentiment: Positive<br/>Priority: Medium<br/>O cliente está satisfeito com a integração existente do Salesforce, mas gostaria de ver suporte para Hubspot também. Este é um feature request que pode ser considerado para uma atualização futura do produto.<br/><br/>Issue: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/>O cliente acha o preço irrazoável, especialmente para os recursos básicos. Está ameaçando mudar para um concorrente, então este é um problema de alta prioridade que precisa ser revisado.<br/><br/>Issue: Performance<br/>Sentiment Negative<br/>Priority: High<br/>O cliente está experimentando problemas críticos com o aplicativo móvel, onde uploads de arquivos grandes resultam consistentemente em travamentos. Este é um problema significativo que impacta a capacidade do cliente de usar o produto efetivamente e deve ser resolvido como alta prioridade.<br/><br/>Issue: UI/UX<br/>Sentiment: Positive<br/>Priority: Low<br/>O cliente está geralmente satisfeito com o produto, especificamente mencionando a UI intuitiva e excelente suporte ao cliente. Este é um feedback positivo que não requer ação imediata. | Aqui está a análise do feedback do cliente:<br/><br/>1. O novo dashboard é uma bagunça! Leva uma eternidade para carregar, e não consigo encontrar o botão de exportação. Corrija isso ASAP!<br/>Category: UI/UX, Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>2. Adorei a integração do Salesforce! Mas seria ótimo se você pudesse adicionar Hubspot também.<br/>Category: Integration, Feature Request<br/>Sentiment: Positive<br/>Priority: Medium<br/><br/>3. Seu preço é ridículo! $99/mo para recursos básicos? Estou mudando para Competitor X.<br/>Category: Pricing<br/>Sentiment: Negative<br/>Priority: High<br/><br/>4. O aplicativo móvel continua travando quando tento fazer upload de arquivos grandes (>50MB). Isto é crítico para nossos agentes de campo.<br/>Category: Performance<br/>Sentiment: Negative<br/>Priority: High<br/><br/>5. No geral, estou satisfeito com o produto. A UI é intuitiva, e o suporte ao cliente é de primeira qualidade. Continue assim!<br/>Category: UI/UX, Other (Customer Support)<br/>Sentiment: Positive<br/>Priority: Low |

</section>

***

<CardGroup cols={3}>
  <Card title="Biblioteca de prompts" icon="link" href="/docs/pt-BR/resources/prompt-library/library">
    Inspire-se com uma seleção curada de prompts para várias tarefas e casos de uso.
  </Card>
  <Card title="Tutorial de prompting do GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Um tutorial repleto de exemplos que cobre os conceitos de engenharia de prompts encontrados em nossa documentação.
  </Card>
  <Card title="Tutorial de prompting do Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Uma versão mais leve do nosso tutorial de engenharia de prompts através de uma planilha interativa.
  </Card>
</CardGroup>