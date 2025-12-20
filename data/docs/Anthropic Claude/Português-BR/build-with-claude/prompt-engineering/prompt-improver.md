# Use nosso melhorador de prompts para otimizar seus prompts

Use nosso melhorador de prompts para otimizar seus prompts

---

<Note>
Nosso melhorador de prompts é compatível com todos os modelos Claude, incluindo aqueles com capacidades de pensamento estendido. Para dicas de prompting específicas para modelos de pensamento estendido, veja [aqui](/docs/pt-BR/build-with-claude/extended-thinking).
</Note>

O melhorador de prompts ajuda você a iterar rapidamente e melhorar seus prompts através de análise e aprimoramento automatizados. Ele se destaca em tornar prompts mais robustos para tarefas complexas que requerem alta precisão.

<Frame>
  ![Image](/docs/images/prompt_improver.png)
</Frame>

## Antes de começar

Você precisará de:
- Um [template de prompt](/docs/pt-BR/build-with-claude/prompt-engineering/prompt-templates-and-variables) para melhorar
- Feedback sobre problemas atuais com as saídas do Claude (opcional, mas recomendado)
- Exemplos de entradas e saídas ideais (opcional, mas recomendado)

## Como funciona o melhorador de prompts

O melhorador de prompts aprimora seus prompts em 4 etapas:

1. **Identificação de exemplos**: Localiza e extrai exemplos do seu template de prompt
2. **Rascunho inicial**: Cria um template estruturado com seções claras e tags XML
3. **Refinamento da cadeia de pensamento**: Adiciona e refina instruções detalhadas de raciocínio
4. **Aprimoramento de exemplos**: Atualiza exemplos para demonstrar o novo processo de raciocínio

Você pode assistir essas etapas acontecerem em tempo real no modal de melhoria.

## O que você obtém

O melhorador de prompts gera templates com:
- Instruções detalhadas de cadeia de pensamento que guiam o processo de raciocínio do Claude e tipicamente melhoram seu desempenho
- Organização clara usando tags XML para separar diferentes componentes
- Formatação padronizada de exemplos que demonstra raciocínio passo a passo da entrada à saída
- Preenchimentos estratégicos que guiam as respostas iniciais do Claude

<Note>
Embora os exemplos apareçam separadamente na interface do Workbench, eles são incluídos no início da primeira mensagem do usuário na chamada real da API. Visualize o formato bruto clicando em "**\<\/\> Get Code**" ou insira exemplos como texto bruto através da caixa de Exemplos.
</Note>

## Como usar o melhorador de prompts

1. Envie seu template de prompt
2. Adicione qualquer feedback sobre problemas com as saídas atuais do Claude (por exemplo, "resumos são muito básicos para audiências especializadas")
3. Inclua exemplos de entradas e saídas ideais
4. Revise o prompt melhorado

## Gerar exemplos de teste

Ainda não tem exemplos? Use nosso [Gerador de Casos de Teste](/docs/pt-BR/test-and-evaluate/eval-tool#creating-test-cases) para:
1. Gerar entradas de amostra
2. Obter respostas do Claude
3. Editar as respostas para corresponder às suas saídas ideais
4. Adicionar os exemplos refinados ao seu prompt

## Quando usar o melhorador de prompts

O melhorador de prompts funciona melhor para:
- Tarefas complexas que requerem raciocínio detalhado
- Situações onde a precisão é mais importante que a velocidade
- Problemas onde as saídas atuais do Claude precisam de melhoria significativa

<Note>
Para aplicações sensíveis à latência ou custo, considere usar prompts mais simples. O melhorador de prompts cria templates que produzem respostas mais longas, mais completas, mas mais lentas.
</Note>

## Exemplo de melhoria

Aqui está como o melhorador de prompts aprimora um prompt básico de classificação:

<section title="Prompt original">

```
Da seguinte lista de títulos de artigos da Wikipedia, identifique de qual artigo esta frase veio.
Responda apenas com o título do artigo e nada mais.

Títulos dos artigos:
{{titles}}

Frase para classificar:
{{sentence}}
```

</section>

<section title="Prompt melhorado">

```
Você é um sistema inteligente de classificação de texto especializado em combinar frases com títulos de artigos da Wikipedia. Sua tarefa é identificar a qual artigo da Wikipedia uma determinada frase mais provavelmente pertence, baseado em uma lista fornecida de títulos de artigos.

Primeiro, revise a seguinte lista de títulos de artigos da Wikipedia:
<article_titles>
{{titles}}
</article_titles>

Agora, considere esta frase que precisa ser classificada:
<sentence_to_classify>
{{sentence}}
</sentence_to_classify>

Seu objetivo é determinar qual título de artigo da lista fornecida melhor combina com a frase dada. Siga estes passos:

1. Liste os conceitos-chave da frase
2. Compare cada conceito-chave com os títulos dos artigos
3. Classifique os 3 títulos mais relevantes e explique por que são relevantes
4. Selecione o título de artigo mais apropriado que melhor engloba ou se relaciona com o conteúdo da frase

Envolva sua análise em tags <analysis>. Inclua o seguinte:
- Lista de conceitos-chave da frase
- Comparação de cada conceito-chave com os títulos dos artigos
- Classificação dos 3 títulos mais relevantes com explicações
- Sua escolha final e raciocínio

Após sua análise, forneça sua resposta final: o único título de artigo da Wikipedia mais apropriado da lista.

Produza apenas o título do artigo escolhido, sem qualquer texto adicional ou explicação.
```

</section>

Observe como o prompt melhorado:
- Adiciona instruções claras de raciocínio passo a passo
- Usa tags XML para organizar o conteúdo
- Fornece requisitos explícitos de formatação de saída
- Guia o Claude através do processo de análise

## Solução de problemas

Problemas comuns e soluções:

- **Exemplos não aparecem na saída**: Verifique se os exemplos estão formatados adequadamente com tags XML e aparecem no início da primeira mensagem do usuário
- **Cadeia de pensamento muito verbosa**: Adicione instruções específicas sobre o comprimento desejado da saída e nível de detalhe
- **Passos de raciocínio não correspondem às suas necessidades**: Modifique a seção de passos para corresponder ao seu caso de uso específico

***

## Próximos passos

<CardGroup cols={3}>
  <Card title="Biblioteca de prompts" icon="link" href="/docs/pt-BR/resources/prompt-library/library">
    Inspire-se com exemplos de prompts para várias tarefas.
  </Card>
  <Card title="Tutorial de prompting no GitHub" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Aprenda as melhores práticas de prompting com nosso tutorial interativo.
  </Card>
  <Card title="Teste seus prompts" icon="link" href="/docs/pt-BR/test-and-evaluate/eval-tool">
    Use nossa ferramenta de avaliação para testar seus prompts melhorados.
  </Card>
</CardGroup>