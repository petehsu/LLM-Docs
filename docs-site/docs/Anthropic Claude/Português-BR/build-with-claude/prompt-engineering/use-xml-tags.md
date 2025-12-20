# Use XML tags to structure your prompts

Aprenda como usar tags XML para estruturar seus prompts de forma clara e eficaz, melhorando a qualidade das respostas do Claude.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Quando seus prompts envolvem múltiplos componentes como contexto, instruções e exemplos, tags XML podem ser um divisor de águas. Elas ajudam Claude a analisar seus prompts com mais precisão, levando a saídas de maior qualidade.

<Tip>**Dica XML**: Use tags como `<instructions>`, `<example>` e `<formatting>` para separar claramente diferentes partes do seu prompt. Isso evita que Claude confunda instruções com exemplos ou contexto.</Tip>

## Por que usar tags XML?

- **Clareza:** Separe claramente diferentes partes do seu prompt e garanta que seu prompt esteja bem estruturado.
- **Precisão:** Reduza erros causados por Claude interpretar mal partes do seu prompt.
- **Flexibilidade:** Encontre, adicione, remova ou modifique facilmente partes do seu prompt sem reescrever tudo.
- **Parseabilidade:** Ter Claude usar tags XML em sua saída torna mais fácil extrair partes específicas de sua resposta por pós-processamento.

<Note>Não há tags XML canônicas "melhores" com as quais Claude foi treinado em particular, embora recomendemos que seus nomes de tags façam sentido com as informações que os cercam.</Note>

***

## Melhores práticas de marcação

1. **Seja consistente**: Use os mesmos nomes de tags em todos os seus prompts e refira-se a esses nomes de tags ao falar sobre o conteúdo (por exemplo, `Usando o contrato nas tags <contract>...`).
2. **Aninhe tags**: Você deve aninhar tags `<outer><inner></inner></outer>` para conteúdo hierárquico.

<Tip>**Dica de usuário avançado**: Combine tags XML com outras técnicas como prompting multishot (`<examples>`) ou cadeia de pensamento (`<thinking>`, `<answer>`). Isso cria prompts super estruturados e de alto desempenho.</Tip>

### Exemplos

  <section title="Exemplo: Gerando relatórios financeiros">

    Sem tags XML, Claude entende mal a tarefa e gera um relatório que não corresponde à estrutura ou tom necessários. Após substituição, também há uma chance de Claude entender mal onde uma seção (como o exemplo do relatório Q1) termina e outra começa.

    | Papel | Sem Tags XML | Com Tags XML |
    | ---- | ----------- | ------------- |
    | Usuário | Você é um analista financeiro na AcmeCorp. Gere um relatório financeiro Q2 para nossos investidores. Inclua seções sobre Crescimento de Receita, Margens de Lucro e Fluxo de Caixa, como neste exemplo do ano passado: \{\{Q1_REPORT\}\}. Use pontos de dados desta planilha: \{\{SPREADSHEET_DATA\}\}. O relatório deve ser extremamente conciso, direto ao ponto, profissional e em formato de lista. Deve destacar tanto os pontos fortes quanto as áreas para melhoria. | Você é um analista financeiro na AcmeCorp. Gere um relatório financeiro Q2 para nossos investidores.<br/><br/>AcmeCorp é uma empresa B2B SaaS. Nossos investidores valorizam transparência e insights acionáveis.<br/><br/>Use estes dados para seu relatório:\<data>\{\{SPREADSHEET_DATA\}\}\</data><br/><br/>\<instructions><br/>1. Inclua seções: Crescimento de Receita, Margens de Lucro, Fluxo de Caixa.<br/>2. Destaque pontos fortes e áreas para melhoria.<br/>\</instructions><br/><br/>Faça seu tom conciso e profissional. Siga esta estrutura:<br/>\<formatting_example>\{\{Q1_REPORT\}\}\</formatting_example> |
    | Assistente | Relatório Financeiro Q2 para Investidores da AcmeCorp<br/><br/>Prezados Investidores,<br/><br/>Tenho o prazer de apresentar nosso relatório financeiro Q2, mostrando o crescimento contínuo e a resiliência da AcmeCorp no mercado B2B SaaS.<br/><br/>1. Crescimento de Receita:<br/>Nossa receita Q2 atingiu \$15,2M, um aumento de 22% YoY. Este crescimento é impulsionado principalmente por uma expansão de 30% em nossa base de clientes empresariais. No entanto, nosso segmento PME viu um leve declínio de 5%, que pretendemos abordar através de iniciativas de marketing direcionadas em Q3.<br/><br/>2. Margens de Lucro:<br/>A margem bruta melhorou para 72% (acima de 3% em relação a Q1) devido a otimizações de infraestrutura. A margem EBITDA, no entanto, caiu para 18% (abaixo de 2%) conforme investimos pesadamente em P&D para nossos próximos recursos impulsionados por IA.<br/><br/>3. Fluxo de Caixa:<br/>O fluxo de caixa operacional permanece forte em \$4,1M. Nossas reservas de caixa estão em \$28M, fornecendo uma pista de 15 meses à taxa de queima atual. Vimos um aumento de 20% nos custos de aquisição de clientes, que estamos abordando através de estratégias de vendas mais eficientes.<br/><br/>Em resumo, as finanças principais da AcmeCorp permanecem robustas. Estamos equilibrando investimentos em crescimento com gestão prudente de caixa. Nosso foco para Q3 será revitalizar o crescimento de PME e otimizar a eficiência de vendas.<br/><br/>Obrigado por sua confiança contínua.<br/><br/>Atenciosamente,<br/>CFO, AcmeCorp | Relatório Financeiro Q2 para Investidores da AcmeCorp\</output><br/><br/>Crescimento de Receita:<br/>- Receita Q2: \$15,2M (22% YoY ↑)<br/>- Clientes empresariais: 30% ↑<br/>- Segmento PME: 5% ↓<br/>  Ação: Marketing direcionado Q3<br/><br/>Margens de Lucro:<br/>- Margem bruta: 72% (3% ↑ em relação a Q1)<br/>  Motivo: Otimizações de infraestrutura<br/>- Margem EBITDA: 18% (2% ↓)<br/>  Motivo: Investimento em P&D em recursos de IA<br/><br/>Fluxo de Caixa:<br/>- Fluxo de caixa operacional: \$4,1M (forte)<br/>- Reservas de caixa: \$28M (pista de 15 meses)<br/>- Custo de aquisição de cliente: 20% ↑<br/>  Ação: Otimizar estratégias de vendas<br/><br/>Perspectiva:<br/>- Finanças principais: Robustas<br/>- Foco Q3: Revitalizar PME, otimizar vendas<br/><br/>A administração permanece comprometida em equilibrar investimentos em crescimento com disciplina financeira. |
  
</section>
  <section title="Exemplo: Análise de contrato legal">

    Sem tags XML, a análise de Claude é desorganizada e perde pontos-chave. Com tags, ela fornece uma análise estruturada e completa que uma equipe jurídica pode agir.

    | Papel | Sem Tags XML | Com Tags XML |
    | ---- | ----------- | ------------- |
    | Usuário | Analise este acordo de licença de software para riscos e responsabilidades potenciais: \{\{CONTRACT\}\}. Concentre-se em indenização, limitação de responsabilidade e cláusulas de propriedade intelectual. Além disso, observe quaisquer termos incomuns ou preocupantes. Aqui está nosso contrato padrão para referência: \{\{STANDARD_CONTRACT\}\}. Dê um resumo das descobertas e recomendações para nossa equipe jurídica. | Analise este acordo de licença de software para riscos e responsabilidades legais.<br/><br/>Somos uma empresa multinacional considerando este acordo para nossa infraestrutura de dados principais.<br/><br/>\<agreement><br/>\{\{CONTRACT\}\}\</agreement><br/><br/>Este é nosso contrato padrão para referência:<br/>\<standard_contract>\{\{STANDARD_CONTRACT\}\}\</standard_contract><br/><br/>\<instructions><br/>1. Analise estas cláusulas:<br/>   - Indenização<br/>   - Limitação de responsabilidade<br/>   - Propriedade intelectual<br/><br/>2. Observe termos incomuns ou preocupantes.<br/><br/>3. Compare com nosso contrato padrão.<br/><br/>4. Resuma as descobertas em tags \<findings>.<br/><br/>5. Liste recomendações acionáveis em tags \<recommendations>.\</instructions> |
    | Assistente | O acordo de licença de software fornecido apresenta vários aspectos preocupantes. A cláusula de indenização é excessivamente ampla, potencialmente nos expondo a responsabilidades significativas. A seção de limitação de responsabilidade limita os danos a apenas \$500, o que é inadequado para nosso uso em nível empresarial. Quanto à PI, o acordo concede ao fornecedor propriedade conjunta de quaisquer modificações ou integrações que criemos.<br/><br/>Em resumo, este acordo não é do nosso interesse. Nos expõe a riscos indevidos, limita nosso recurso em caso de falhas e compromete nossos direitos de propriedade intelectual. Recomendo renegociar estes termos ou procurar fornecedores alternativos. | \<findings><br/>1. Indenização (Cláusula 8):<br/>   - Problema: Excessivamente ampla. Indenizamos o fornecedor contra "quaisquer e todas as reclamações" decorrentes de nosso uso.<br/>   - Risco: Poderia nos responsabilizar até mesmo pela negligência do fornecedor ou defeitos do produto.<br/>   - Desvio: Nosso padrão limita a indenidade a reclamações decorrentes de nossa violação do acordo.<br/><br/>2. Limitação de Responsabilidade (Cláusula 9):<br/>   - Problema: Limita todos os danos a \$500, incluindo danos diretos.<br/>   - Risco: Grosseiramente inadequado para uso empresarial. Uma falha crítica poderia custar milhões.<br/>   - Desvio: Nosso padrão permite danos diretos até 12 meses de taxas pagas.<br/><br/>3. Propriedade Intelectual (Cláusula 12):<br/>   - Problema: Concede ao fornecedor propriedade conjunta de nossas modificações/integrações.<br/>   - Risco: O fornecedor poderia usar ou vender nossos algoritmos proprietários ou insights de dados.<br/>   - Desvio: Nosso padrão retém propriedade total de nosso trabalho.<br/><br/>4. Termos Incomuns:<br/>   - Cláusula 5.3: O fornecedor pode usar nossos dados de uso para "qualquer propósito".<br/>   - Cláusula 7.2: O fornecedor pode rescindir por "conveniência" com apenas 7 dias de aviso.<br/>   - Cláusula 11: Sem garantias de qualquer tipo, nem mesmo para comercialização básica.<br/>\</findings><br/><br/>\<recommendations><br/>1. Rejeite este acordo. Os riscos superam em muito os benefícios para uma empresa.<br/>2. Contra-proponha:<br/>   - Indenização: Limite a reclamações decorrentes de nossa violação do acordo.<br/>   - Responsabilidade: Limite a 12 meses de taxas para danos diretos; negocie para indiretos.<br/>   - PI: Propriedade total de nossas modificações/integrações.<br/>   - Uso de Dados: Restrinja apenas a melhoria de serviço.<br/>   - Rescisão: Mínimo de 90 dias de aviso; apenas por causa.<br/>   - Garantias: Exija comercialização básica e adequação para fins.<br/>3. Se o fornecedor recusar, explore fornecedores alternativos ou soluções internas.<br/>4. Envolva assessoria jurídica para negociação de contrato dadas as altas apostas.<br/>\</recommendations> |
  
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
    Uma versão mais leve de nosso tutorial de engenharia de prompts através de uma planilha interativa.
  </Card>
</CardGroup>