# Usando a Ferramenta de Avaliação

O [Console Claude](/dashboard) apresenta uma **ferramenta de Avaliação** que permite testar seus prompts sob vários cenários.

---

## Acessando o Recurso de Avaliação

Para começar com a ferramenta de Avaliação:

1. Abra o Console Claude e navegue até o editor de prompts.
2. Após compor seu prompt, procure pela aba 'Evaluate' no topo da tela.

![Acessando o Recurso de Avaliação](/docs/images/access_evaluate.png)

<Tip>
Certifique-se de que seu prompt inclua pelo menos 1-2 variáveis dinâmicas usando a sintaxe de chaves duplas: \{\{variável\}\}. Isso é necessário para criar conjuntos de teste de avaliação.
</Tip>

## Gerando Prompts

O Console oferece um [gerador de prompts](/docs/pt-BR/build-with-claude/prompt-engineering/prompt-generator) integrado alimentado pelo Claude Opus 4.1:

<Steps>
  <Step title="Clique em 'Generate Prompt'">
    Clicar na ferramenta auxiliar 'Generate Prompt' abrirá um modal que permite inserir as informações da sua tarefa.
  </Step>
  <Step title="Descreva sua tarefa">
    Descreva sua tarefa desejada (por exemplo, "Fazer triagem de solicitações de suporte ao cliente recebidas") com tanto ou tão pouco detalhe quanto desejar. Quanto mais contexto você incluir, mais o Claude pode adaptar seu prompt gerado às suas necessidades específicas.
  </Step>
  <Step title="Gere seu prompt">
    Clicar no botão laranja 'Generate Prompt' na parte inferior fará com que o Claude gere um prompt de alta qualidade para você. Você pode então melhorar ainda mais esses prompts usando a tela de Avaliação no Console.
  </Step>
</Steps>

Este recurso facilita a criação de prompts com a sintaxe de variável apropriada para avaliação.

![Gerador de Prompts](/docs/images/promptgenerator.png)

## Criando Casos de Teste

Quando você acessa a tela de Avaliação, tem várias opções para criar casos de teste:

1. Clique no botão '+ Add Row' no canto inferior esquerdo para adicionar manualmente um caso.
2. Use o recurso 'Generate Test Case' para fazer com que o Claude gere automaticamente casos de teste para você.
3. Importe casos de teste de um arquivo CSV.

Para usar o recurso 'Generate Test Case':

<Steps>
  <Step title="Clique em 'Generate Test Case'">
    O Claude gerará casos de teste para você, uma linha por vez para cada vez que você clicar no botão.
  </Step>
  <Step title="Edite a lógica de geração (opcional)">
    Você também pode editar a lógica de geração de casos de teste clicando na seta suspensa à direita do botão 'Generate Test Case', depois em 'Show generation logic' no topo da janela de Variáveis que aparece. Você pode ter que clicar em `Generate' no canto superior direito desta janela para popular a lógica de geração inicial.
    
    Editar isso permite personalizar e ajustar finamente os casos de teste que o Claude gera com maior precisão e especificidade.
  </Step>
</Steps>

Aqui está um exemplo de uma tela de Avaliação populada com vários casos de teste:

![Tela de Avaliação Populada](/docs/images/eval_populated.png)

<Note>
Se você atualizar o texto do seu prompt original, pode executar novamente todo o conjunto de avaliação contra o novo prompt para ver como as mudanças afetam o desempenho em todos os casos de teste.
</Note>

## Dicas para Avaliação Eficaz

<section title="Estrutura de Prompt para Avaliação">

Para aproveitar ao máximo a ferramenta de Avaliação, estruture seus prompts com formatos claros de entrada e saída. Por exemplo:

```
Nesta tarefa, você gerará uma história fofa de uma frase que incorpora dois elementos: uma cor e um som.
A cor a incluir na história é:
<color>
{{COLOR}}
</color>
O som a incluir na história é:
<sound>
{{SOUND}}
</sound>
Aqui estão os passos para gerar a história:
1. Pense em um objeto, animal ou cena que seja comumente associado com a cor fornecida. Por exemplo, se a cor é "azul", você pode pensar no céu, no oceano ou em um pássaro azul.
2. Imagine uma ação simples, evento ou cena envolvendo o objeto/animal/cena colorido que você identificou e o som fornecido. Por exemplo, se a cor é "azul" e o som é "assobio", você pode imaginar um pássaro azul assobiando uma melodia.
3. Descreva a ação, evento ou cena que você imaginou em uma única frase concisa. Foque em tornar a frase fofa, evocativa e imaginativa. Por exemplo: "Um pássaro azul alegre assobiou uma melodia alegre enquanto voava pelo céu azul."
Por favor, mantenha sua história em apenas uma frase. Procure tornar essa frase o mais encantadora e envolvente possível enquanto incorpora naturalmente a cor e o som dados.
Escreva sua história completa de uma frase dentro de tags <story>.

```

Esta estrutura facilita variar entradas (\{\{COLOR\}\} e \{\{SOUND\}\}) e avaliar saídas consistentemente.

</section>

<Tip>
Use a ferramenta auxiliar 'Generate a prompt' no Console para criar rapidamente prompts com a sintaxe de variável apropriada para avaliação.
</Tip>

## Entendendo e comparando resultados

A ferramenta de Avaliação oferece vários recursos para ajudá-lo a refinar seus prompts:

1. **Comparação lado a lado**: Compare as saídas de dois ou mais prompts para ver rapidamente o impacto de suas mudanças.
2. **Classificação de qualidade**: Classifique a qualidade da resposta em uma escala de 5 pontos para acompanhar melhorias na qualidade da resposta por prompt.
3. **Versionamento de prompt**: Crie novas versões do seu prompt e execute novamente o conjunto de testes para iterar rapidamente e melhorar os resultados.

Ao revisar resultados em casos de teste e comparar diferentes versões de prompt, você pode identificar padrões e fazer ajustes informados ao seu prompt de forma mais eficiente.

Comece a avaliar seus prompts hoje para construir aplicações de IA mais robustas com o Claude!