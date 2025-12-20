# Dando um papel ao Claude com um prompt de sistema

Aprenda como usar role prompting para melhorar dramaticamente o desempenho do Claude

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Ao usar Claude, você pode melhorar dramaticamente seu desempenho usando o parâmetro `system` para dar a ele um papel. Esta técnica, conhecida como role prompting, é a forma mais poderosa de usar prompts de sistema com Claude.

O papel certo pode transformar Claude de um assistente geral em seu especialista de domínio virtual!

<Tip>**Dicas de prompt de sistema**: Use o parâmetro `system` para definir o papel do Claude. Coloque tudo mais, como instruções específicas da tarefa, na vez do `user` em vez disso.</Tip>

## Por que usar role prompting?

- **Precisão aprimorada:** Em cenários complexos como análise jurídica ou modelagem financeira, o role prompting pode aumentar significativamente o desempenho do Claude.
- **Tom personalizado:** Quer você precise da brevidade de um CFO ou do talento de um redator publicitário, o role prompting ajusta o estilo de comunicação do Claude.
- **Foco melhorado:** Ao definir o contexto do papel, Claude permanece mais dentro dos limites dos requisitos específicos de sua tarefa.

***

## Como dar um papel ao Claude

Use o parâmetro `system` na [API de Mensagens](/docs/pt-BR/api/messages) para definir o papel do Claude:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=2048,
    system="You are a seasoned data scientist at a Fortune 500 company.", # <-- role prompt
    messages=[
        {"role": "user", "content": "Analyze this dataset for anomalies: <dataset>{{DATASET}}</dataset>"}
    ]
)

print(response.content)
```

<Tip>**Dica de role prompting**: Experimente com papéis! Um `data scientist` pode ver insights diferentes de um `marketing strategist` para os mesmos dados. Um `data scientist specializing in customer insight analysis for Fortune 500 companies` pode gerar resultados ainda diferentes!</Tip>

***

## Exemplos

### Exemplo 1: Análise de contrato jurídico
Sem um papel, Claude pode perder problemas críticos:

<section title="Análise de contrato jurídico sem role prompting">

| Papel | Conteúdo |
| ---- | ------- |
| Usuário | Analise este acordo de licença de software para riscos potenciais:<br/>\<contract><br/>\{\{CONTRACT\}\}<br/>\</contract><br/><br/>Concentre-se em indenização, responsabilidade e propriedade intelectual. |
| Assistente | Aqui está um resumo dos pontos-chave no acordo de licença de software:<br/><br/>1. Indenização (Seção 8):<br/>   - Indenizamos o fornecedor contra reclamações decorrentes de nosso uso.<br/><br/>2. Limitação de Responsabilidade (Seção 9):<br/>   - Danos limitados a \$500.<br/><br/>3. Propriedade Intelectual (Seção 12):<br/>   - Retemos a propriedade de nossas modificações.<br/><br/>Em geral, o acordo parece padrão. As cláusulas de indenização e responsabilidade são típicas, e mantemos nossos direitos de propriedade intelectual. |

</section>

Com um papel, Claude detecta problemas críticos que poderiam custar milhões:

<section title="Análise de contrato jurídico com role prompting">

| Papel | Conteúdo |
| ---- | ------- |
| Usuário | Você é o Conselheiro Geral de uma empresa de tecnologia Fortune 500. Estamos considerando este acordo de licença de software para nossa infraestrutura de dados principal:<br/>\<contract><br/>\{\{CONTRACT\}\}<br/>\</contract><br/><br/>Analise-o para riscos potenciais, concentrando-se em indenização, responsabilidade e propriedade intelectual. Dê sua opinião profissional. |
| Assistente | Revisei o acordo de licença de software e tenho preocupações sérias que poderiam expor nossa empresa a riscos significativos:<br/><br/>1. Indenização (Seção 8):<br/>   - Problema Crítico: Indenizamos o fornecedor contra "qualquer e todas as reclamações" decorrentes de nosso uso.<br/>   - Risco: Isso pode nos responsabilizar até mesmo pela negligência do fornecedor ou defeitos do produto.<br/>   - Recomendação: Rejeitar. Limitar nossa indenidade a reclamações decorrentes de nossa violação do acordo.<br/><br/>2. Limitação de Responsabilidade (Seção 9):<br/>   - Problema Crítico: Danos limitados a \$500, incluindo danos diretos.<br/>   - Risco: Grosseiramente inadequado. Uma falha crítica em nossa infraestrutura de dados pode nos custar milhões em receita perdida e danos à reputação.<br/>   - Recomendação: Rejeitar. Negociar para um limite de 12 meses de taxas para danos diretos e exclusões para violações de dados.<br/><br/>3. Propriedade Intelectual (Seção 12):<br/>   - Problema Crítico: O fornecedor ganha propriedade conjunta de nossas modificações e integrações.<br/>   - Risco: Eles poderiam usar ou vender nossos algoritmos proprietários ou insights de dados para concorrentes.<br/>   - Recomendação: Rejeitar. Devemos reter a propriedade total de nosso trabalho.<br/><br/>Opinião Profissional: Não assine este acordo. É grosseiramente desfavorável e nos expõe a níveis inaceitáveis de risco. Se o fornecedor se recusar a renegociar esses termos, recomendo fortemente explorar fornecedores alternativos ou acelerar nossa solução interna. Os custos potenciais de prosseguir com este acordo superam em muito quaisquer ganhos de curto prazo. |

</section>

### Exemplo 2: Análise financeira
Sem um papel, a análise do Claude carece de profundidade:

<section title="Análise financeira sem role prompting">

| Papel | Conteúdo |
| ---- | ------- |
| Usuário | Analise este conjunto de dados de nossas finanças do Q2:<br/>\<data><br/>\{\{FINANCIALS\}\}<br/>\</data><br/><br/>Destaque as principais tendências e recomende ações. |
| Assistente | Aqui está um resumo de suas finanças do Q2:<br/><br/>1. Receita: \$15.2M, acima de 22% YoY. A base de clientes empresariais cresceu 30%.<br/>2. Margem Bruta: 72%, acima de 3% em relação ao Q1.<br/>3. Margem EBITDA: 18%, abaixo de 2% devido a investimentos em P&D.<br/>4. Fluxo de Caixa: \$4.1M operacional, \$28M em reservas.<br/><br/>Em geral, as finanças parecem fortes com crescimento de receita e margens saudáveis. O aumento dos gastos em P&D está impactando a lucratividade, mas pode compensar a longo prazo. Mantenha o curso atual. |

</section>

Com um papel, Claude fornece insights acionáveis:

<section title="Análise financeira com role prompting">

| Papel | Conteúdo |
| ---- | ------- |
| Usuário | Você é o CFO de uma empresa B2B SaaS de alto crescimento. Estamos em uma reunião do conselho discutindo nossas finanças do Q2:<br/>\<data><br/>\{\{FINANCIALS\}\}<br/>\</data><br/><br/>Analise as principais tendências, sinalize preocupações e recomende ações estratégicas. Nossos investidores querem crescimento agressivo, mas estão preocupados com nossa taxa de queima. |
| Assistente | Membros do conselho, aqui está minha análise de nossas finanças do Q2:<br/><br/>1. Receita (\$15.2M, +22% YoY):<br/>   - Insight: O crescimento empresarial (+30%) está superando o crescimento geral.<br/>   - Alerta: O segmento de PME declinou 5%.<br/>   - Ação: Realoque 20% do orçamento de marketing de PME para vendas empresariais. Tarefa do produto para simplificar a integração de PME.<br/><br/>2. Margens (Bruta: 72%, +3% QoQ; EBITDA: 18%, -2% QoQ):<br/>   - Insight: Otimizações de infraestrutura aumentaram as margens brutas.<br/>   - Alerta: O gasto em P&D em recursos de IA prejudicou o EBITDA.<br/>   - Ação: Sem mudança. Nosso roteiro de IA é crítico para a permanência empresarial.<br/><br/>3. Caixa (\$4.1M OCF, \$28M em reservas):<br/>   - Insight: Runway de 15 meses na taxa de queima atual.<br/>   - Alerta: CAC acima de 20%, erodindo LTV/CAC.<br/>   - Ação: Congele contratações não essenciais. Implemente análise de funil de vendas para reduzir CAC em 15% no Q3.<br/><br/>Postura Estratégica: Estamos equilibrando crescimento e queima. O foco empresarial é nosso motor de crescimento—invista lá. Mas observe a rotatividade de PME; ela pode sangrar para empresas. Nossa aposta em IA é sólida, mas devemos convertê-la em ARR até Q4, ou cortamos P&D em 30%.<br/><br/>Em resumo: Dobre a aposta em empresas, simplifique PME, otimize vendas e monetize IA. Perguntas? |

</section>

---

<CardGroup cols={3}>
  <Card title="Biblioteca de prompts" icon="link" href="/docs/pt-BR/resources/prompt-library/library">
    Inspire-se com uma seleção curada de prompts para várias tarefas e casos de uso.
  </Card>
  <Card title="Tutorial de prompting do GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Um tutorial repleto de exemplos que cobre os conceitos de engenharia de prompts encontrados em nossa documentação.
  </Card>
  <Card title="Tutorial de prompting do Google Sheets" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Uma versão mais leve de nosso tutorial de engenharia de prompts por meio de uma planilha interativa.
  </Card>
</CardGroup>