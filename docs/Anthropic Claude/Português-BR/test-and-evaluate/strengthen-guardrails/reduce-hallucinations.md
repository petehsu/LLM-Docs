# Reduzir alucinações

---

Mesmo os modelos de linguagem mais avançados, como o Claude, podem às vezes gerar texto que é factualmente incorreto ou inconsistente com o contexto fornecido. Este fenômeno, conhecido como "alucinação", pode comprometer a confiabilidade das suas soluções baseadas em IA.
Este guia explorará técnicas para minimizar alucinações e garantir que as saídas do Claude sejam precisas e confiáveis.

## Estratégias básicas de minimização de alucinações

- **Permita que o Claude diga "Eu não sei":** Dê explicitamente ao Claude permissão para admitir incerteza. Esta técnica simples pode reduzir drasticamente informações falsas.

<section title="Exemplo: Analisando um relatório de fusão e aquisição">

| Função | Conteúdo |
| ---- | --- |
| Usuário | Como nosso consultor de F&A, analise este relatório sobre a potencial aquisição da AcmeCo pela ExampleCorp.<br/><br/>\<report><br/>\{\{REPORT}}<br/>\</report><br/><br/>Concentre-se nas projeções financeiras, riscos de integração e obstáculos regulatórios. Se você estiver inseguro sobre qualquer aspecto ou se o relatório não tiver as informações necessárias, diga "Não tenho informações suficientes para avaliar isso com confiança." |

</section>

- **Use citações diretas para fundamentação factual:** Para tarefas envolvendo documentos longos (>20K tokens), peça ao Claude para extrair citações palavra por palavra primeiro antes de realizar sua tarefa. Isso fundamenta suas respostas no texto real, reduzindo alucinações.

<section title="Exemplo: Auditando uma política de privacidade de dados">

| Função | Conteúdo |
| ---- | --- |
| Usuário | Como nosso Diretor de Proteção de Dados, revise esta política de privacidade atualizada para conformidade com GDPR e CCPA.<br/>\<br/>\{\{POLICY}}<br/>\</policy><br/><br/>1. Extraia citações exatas da política que são mais relevantes para a conformidade com GDPR e CCPA. Se você não encontrar citações relevantes, declare "Nenhuma citação relevante encontrada."<br/><br/>2. Use as citações para analisar a conformidade dessas seções da política, referenciando as citações por número. Baseie sua análise apenas nas citações extraídas. |

</section>

- **Verificar com citações**: Torne a resposta do Claude auditável fazendo-o citar trechos e fontes para cada uma de suas afirmações. Você também pode fazer o Claude verificar cada afirmação encontrando uma citação de suporte depois de gerar uma resposta. Se não conseguir encontrar uma citação, deve retratar a afirmação.

<section title="Exemplo: Redigindo um comunicado de imprensa sobre o lançamento de um produto">

| Função | Conteúdo |
| ---- | --- |
| Usuário | Redija um comunicado de imprensa para nosso novo produto de cibersegurança, AcmeSecurity Pro, usando apenas informações destes briefings de produto e relatórios de mercado.<br/>\<documents><br/>\{\{DOCUMENTS}}<br/>\</documents><br/><br/>Após a redação, revise cada afirmação em seu comunicado de imprensa. Para cada afirmação, encontre uma citação direta dos documentos que a suporte. Se você não conseguir encontrar uma citação de suporte para uma afirmação, remova essa afirmação do comunicado de imprensa e marque onde ela foi removida com colchetes vazios []. |

</section>

***

## Técnicas avançadas

- **Verificação da cadeia de pensamento**: Peça ao Claude para explicar seu raciocínio passo a passo antes de dar uma resposta final. Isso pode revelar lógica ou suposições defeituosas.

- **Verificação Best-of-N**: Execute o Claude através do mesmo prompt várias vezes e compare as saídas. Inconsistências entre as saídas podem indicar alucinações.

- **Refinamento iterativo**: Use as saídas do Claude como entradas para prompts de acompanhamento, pedindo-lhe para verificar ou expandir declarações anteriores. Isso pode detectar e corrigir inconsistências.

- **Restrição de conhecimento externo**: Instrua explicitamente o Claude a usar apenas informações de documentos fornecidos e não seu conhecimento geral.

<Note>Lembre-se, embora essas técnicas reduzam significativamente as alucinações, elas não as eliminam completamente. Sempre valide informações críticas, especialmente para decisões de alto risco.</Note>