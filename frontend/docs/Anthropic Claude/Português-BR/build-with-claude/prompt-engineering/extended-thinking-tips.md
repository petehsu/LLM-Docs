# Dicas de pensamento estendido

---

Este guia fornece estratégias e técnicas avançadas para obter o máximo dos recursos de pensamento estendido do Claude. O pensamento estendido permite que o Claude trabalhe através de problemas complexos passo a passo, melhorando o desempenho em tarefas difíceis.

Veja [Modelos de pensamento estendido](/docs/pt-BR/about-claude/models/extended-thinking-models) para orientação sobre quando usar o pensamento estendido.

## Antes de mergulhar

Este guia pressupõe que você já decidiu usar o modo de pensamento estendido e revisou nossos passos básicos sobre [como começar com o pensamento estendido](/docs/pt-BR/about-claude/models/extended-thinking-models#getting-started-with-extended-thinking-models) bem como nosso [guia de implementação de pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking).

### Considerações técnicas para o pensamento estendido

- Os tokens de pensamento têm um orçamento mínimo de 1024 tokens. Recomendamos que você comece com o orçamento mínimo de pensamento e aumente incrementalmente para ajustar com base em suas necessidades e complexidade da tarefa.
- Para cargas de trabalho onde o orçamento ideal de pensamento está acima de 32K, recomendamos que você use [processamento em lote](/docs/pt-BR/build-with-claude/batch-processing) para evitar problemas de rede. Solicitações que empurram o modelo a pensar acima de 32K tokens causam solicitações de longa duração que podem esbarrar em timeouts do sistema e limites de conexão aberta.
- O pensamento estendido funciona melhor em inglês, embora as saídas finais possam estar em [qualquer idioma que o Claude suporte](/docs/pt-BR/build-with-claude/multilingual-support).
- Se você precisar de pensamento abaixo do orçamento mínimo, recomendamos usar o modo padrão, com o pensamento desligado, com prompting tradicional de cadeia de pensamento com tags XML (como `<thinking>`). Veja [prompting de cadeia de pensamento](/docs/pt-BR/build-with-claude/prompt-engineering/chain-of-thought).

## Técnicas de prompting para pensamento estendido

### Use instruções gerais primeiro, depois solucione problemas com instruções mais passo a passo

O Claude frequentemente tem melhor desempenho com instruções de alto nível para apenas pensar profundamente sobre uma tarefa em vez de orientação prescritiva passo a passo. A criatividade do modelo na abordagem de problemas pode exceder a capacidade humana de prescrever o processo de pensamento ideal.

Por exemplo, em vez de:

<CodeGroup>
```text User
Pense através deste problema de matemática passo a passo:
1. Primeiro, identifique as variáveis
2. Então, configure a equação
3. Em seguida, resolva para x
...
```
</CodeGroup>

Considere:

<CodeGroup>
```text User
Por favor, pense sobre este problema de matemática minuciosamente e em grande detalhe.
Considere múltiplas abordagens e mostre seu raciocínio completo.
Tente métodos diferentes se sua primeira abordagem não funcionar.
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Por favor, pense sobre este problema de matemática minuciosamente e em grande detalhe.
Considere múltiplas abordagens e mostre seu raciocínio completo.
Tente métodos diferentes se sua primeira abordagem não funcionar.`
  }
  thinkingBudgetTokens={16000}
>
  Experimente no Console
</TryInConsoleButton>

Dito isso, o Claude ainda pode seguir efetivamente passos de execução estruturados complexos quando necessário. O modelo pode lidar com listas ainda mais longas com instruções mais complexas do que versões anteriores. Recomendamos que você comece com instruções mais generalizadas, então leia a saída de pensamento do Claude e itere para fornecer instruções mais específicas para direcionar seu pensamento a partir daí.

### Prompting multishot com pensamento estendido

[Prompting multishot](/docs/pt-BR/build-with-claude/prompt-engineering/multishot-prompting) funciona bem com pensamento estendido. Quando você fornece ao Claude exemplos de como pensar através de problemas, ele seguirá padrões de raciocínio similares dentro de seus blocos de pensamento estendido.

Você pode incluir exemplos few-shot em seu prompt em cenários de pensamento estendido usando tags XML como `<thinking>` ou `<scratchpad>` para indicar padrões canônicos de pensamento estendido nesses exemplos.

O Claude generalizará o padrão para o processo formal de pensamento estendido. No entanto, é possível que você obtenha melhores resultados dando ao Claude rédea solta para pensar da maneira que ele julgar melhor.

Exemplo:

<CodeGroup>
```text User
Vou mostrar como resolver um problema de matemática, então quero que você resolva um similar.

Problema 1: Quanto é 15% de 80?

<thinking>
Para encontrar 15% de 80:
1. Converter 15% para decimal: 15% = 0,15
2. Multiplicar: 0,15 × 80 = 12
</thinking>

A resposta é 12.

Agora resolva este:
Problema 2: Quanto é 35% de 240?
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Vou mostrar como resolver um problema de matemática, então quero que você resolva um similar.

Problema 1: Quanto é 15% de 80?

<thinking>
Para encontrar 15% de 80:
1. Converter 15% para decimal: 15% = 0,15
2. Multiplicar: 0,15 × 80 = 12
</thinking>

A resposta é 12.

Agora resolva este:
Problema 2: Quanto é 35% de 240?`
  }
  thinkingBudgetTokens={16000} 
>
  Experimente no Console
</TryInConsoleButton>

### Maximizando o seguimento de instruções com pensamento estendido
O Claude mostra seguimento de instruções significativamente melhorado quando o pensamento estendido está habilitado. O modelo tipicamente:
1. Raciocina sobre instruções dentro do bloco de pensamento estendido
2. Executa essas instruções na resposta

Para maximizar o seguimento de instruções:
- Seja claro e específico sobre o que você quer
- Para instruções complexas, considere dividi-las em passos numerados que o Claude deve trabalhar metodicamente
- Permita ao Claude orçamento suficiente para processar as instruções completamente em seu pensamento estendido

### Usando pensamento estendido para debugar e direcionar o comportamento do Claude
Você pode usar a saída de pensamento do Claude para debugar a lógica do Claude, embora este método nem sempre seja perfeitamente confiável.

Para fazer o melhor uso desta metodologia, recomendamos as seguintes dicas:
- Não recomendamos passar o pensamento estendido do Claude de volta no bloco de texto do usuário, pois isso não melhora o desempenho e pode realmente degradar os resultados.
- Pré-preenchimento de pensamento estendido é explicitamente não permitido, e alterar manualmente o texto de saída do modelo que segue seu bloco de pensamento provavelmente vai degradar os resultados devido à confusão do modelo.

Quando o pensamento estendido está desligado, o [pré-preenchimento](/docs/pt-BR/build-with-claude/prompt-engineering/prefill-claudes-response) padrão do texto de resposta `assistant` ainda é permitido.

<Note>
Às vezes o Claude pode repetir seu pensamento estendido no texto de saída do assistente. Se você quiser uma resposta limpa, instrua o Claude a não repetir seu pensamento estendido e apenas produzir a resposta.
</Note>

### Aproveitando ao máximo saídas longas e pensamento de forma longa

Para casos de uso de geração de conjuntos de dados, tente prompts como "Por favor, crie uma tabela extremamente detalhada de..." para gerar conjuntos de dados abrangentes.

Para casos de uso como geração de conteúdo detalhado onde você pode querer gerar blocos de pensamento estendido mais longos e respostas mais detalhadas, tente estas dicas:
- Aumente tanto o comprimento máximo de pensamento estendido E explicitamente peça por saídas mais longas
- Para saídas muito longas (20.000+ palavras), solicite um esboço detalhado com contagens de palavras até o nível do parágrafo. Então peça ao Claude para indexar seus parágrafos ao esboço e manter as contagens de palavras especificadas

<Warning>
Não recomendamos que você empurre o Claude a produzir mais tokens pelo bem de produzir tokens. Em vez disso, encorajamos você a começar com um pequeno orçamento de pensamento e aumentar conforme necessário para encontrar as configurações ideais para seu caso de uso.
</Warning>

Aqui estão casos de uso de exemplo onde o Claude se destaca devido ao pensamento estendido mais longo:

  <section title="Problemas complexos de STEM">

    Problemas complexos de STEM requerem que o Claude construa modelos mentais, aplique conhecimento especializado e trabalhe através de passos lógicos sequenciais—processos que se beneficiam de tempo de raciocínio mais longo.
    
    <Tabs>
      <Tab title="Prompt padrão">
        <CodeGroup>
        ```text User
        Escreva um script python para uma bola amarela quicando dentro de um quadrado,
        certifique-se de lidar com detecção de colisão adequadamente.
        Faça o quadrado girar lentamente.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Escreva um script python para uma bola amarela quicando dentro de um quadrado,
certifique-se de lidar com detecção de colisão adequadamente.
Faça o quadrado girar lentamente.`
          }
          thinkingBudgetTokens={16000}
        >
          Experimente no Console
        </TryInConsoleButton>
        <Note>
        Esta tarefa mais simples tipicamente resulta em apenas alguns segundos de tempo de pensamento.
        </Note>
      </Tab>
      <Tab title="Prompt aprimorado">
        <CodeGroup>
        ```text User
        Escreva um script Python para uma bola amarela quicando dentro de um tesseract,
        certificando-se de lidar com detecção de colisão adequadamente.
        Faça o tesseract girar lentamente.
        Certifique-se de que a bola permaneça dentro do tesseract.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Escreva um script Python para uma bola amarela quicando dentro de um tesseract,
certificando-se de lidar com detecção de colisão adequadamente.
Faça o tesseract girar lentamente.
Certifique-se de que a bola permaneça dentro do tesseract.`
          }
          thinkingBudgetTokens={16000}
        >
          Experimente no Console
        </TryInConsoleButton>
        <Note>
        Este desafio complexo de visualização 4D faz o melhor uso do tempo longo de pensamento estendido enquanto o Claude trabalha através da complexidade matemática e de programação.
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="Problemas de otimização com restrições">

    Otimização com restrições desafia o Claude a satisfazer múltiplos requisitos competitivos simultaneamente, o que é melhor realizado quando se permite tempo longo de pensamento estendido para que o modelo possa abordar metodicamente cada restrição.
    
    <Tabs>
      <Tab title="Prompt padrão">
        <CodeGroup>
        ```text User
        Planeje férias de uma semana no Japão.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt="Planeje férias de uma semana no Japão."
          thinkingBudgetTokens={16000}
        >
          Experimente no Console
        </TryInConsoleButton>
        <Note>
        Esta solicitação aberta tipicamente resulta em apenas alguns segundos de tempo de pensamento.
        </Note>
      </Tab>
      <Tab title="Prompt aprimorado">
        <CodeGroup>
        ```text User
        Planeje uma viagem de 7 dias ao Japão com as seguintes restrições:
        - Orçamento de $2.500
        - Deve incluir Tóquio e Kyoto
        - Precisa acomodar uma dieta vegetariana
        - Preferência por experiências culturais sobre compras
        - Deve incluir um dia de caminhada
        - Não mais que 2 horas de viagem entre locais por dia
        - Precisa de tempo livre cada tarde para ligações de volta para casa
        - Deve evitar multidões quando possível
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Planeje uma viagem de 7 dias ao Japão com as seguintes restrições:
- Orçamento de $2.500
- Deve incluir Tóquio e Kyoto
- Precisa acomodar uma dieta vegetariana
- Preferência por experiências culturais sobre compras
- Deve incluir um dia de caminhada
- Não mais que 2 horas de viagem entre locais por dia
- Precisa de tempo livre cada tarde para ligações de volta para casa
- Deve evitar multidões quando possível`
          }
          thinkingBudgetTokens={16000}
        >
          Experimente no Console
        </TryInConsoleButton>
        <Note>
        Com múltiplas restrições para equilibrar, o Claude naturalmente terá melhor desempenho quando dado mais espaço para pensar sobre como satisfazer todos os requisitos de forma ideal.
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="Frameworks de pensamento">

    Frameworks de pensamento estruturados dão ao Claude uma metodologia explícita para seguir, o que pode funcionar melhor quando o Claude recebe espaço longo de pensamento estendido para seguir cada passo.
    
    <Tabs>
      <Tab title="Prompt padrão">
        <CodeGroup>
        ```text User
        Desenvolva uma estratégia abrangente para a Microsoft
        entrar no mercado de medicina personalizada até 2027.
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Desenvolva uma estratégia abrangente para a Microsoft
entrar no mercado de medicina personalizada até 2027.`
          }
          thinkingBudgetTokens={16000}
        >
          Experimente no Console
        </TryInConsoleButton>
        <Note>
        Esta questão estratégica ampla tipicamente resulta em apenas alguns segundos de tempo de pensamento.
        </Note>
      </Tab>
      <Tab title="Prompt aprimorado">
        <CodeGroup>
        ```text User
        Desenvolva uma estratégia abrangente para a Microsoft entrar
        no mercado de medicina personalizada até 2027.
        
        Comece com:
        1. Um canvas de Estratégia do Oceano Azul
        2. Aplique as Cinco Forças de Porter para identificar pressões competitivas
        
        Em seguida, conduza um exercício de planejamento de cenários com quatro
        futuros distintos baseados em variáveis regulatórias e tecnológicas.
        
        Para cada cenário:
        - Desenvolva respostas estratégicas usando a Matriz de Ansoff
        
        Finalmente, aplique o framework dos Três Horizontes para:
        - Mapear o caminho de transição
        - Identificar inovações disruptivas potenciais em cada estágio
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `Desenvolva uma estratégia abrangente para a Microsoft entrar
no mercado de medicina personalizada até 2027.

Comece com:
1. Um canvas de Estratégia do Oceano Azul
2. Aplique as Cinco Forças de Porter para identificar pressões competitivas

Em seguida, conduza um exercício de planejamento de cenários com quatro
futuros distintos baseados em variáveis regulatórias e tecnológicas.

Para cada cenário:
- Desenvolva respostas estratégicas usando a Matriz de Ansoff

Finalmente, aplique o framework dos Três Horizontes para:
- Mapear o caminho de transição
- Identificar inovações disruptivas potenciais em cada estágio`
          }
          thinkingBudgetTokens={16000}
        >
          Experimente no Console
        </TryInConsoleButton>
        <Note>
        Ao especificar múltiplos frameworks analíticos que devem ser aplicados sequencialmente, o tempo de pensamento naturalmente aumenta enquanto o Claude trabalha através de cada framework metodicamente.
        </Note>
      </Tab>
    </Tabs>
  
</section>

### Faça o Claude refletir e verificar seu trabalho para melhor consistência e tratamento de erros
Você pode usar prompting em linguagem natural simples para melhorar a consistência e reduzir erros:
1. Peça ao Claude para verificar seu trabalho com um teste simples antes de declarar uma tarefa completa
2. Instrua o modelo a analisar se seu passo anterior alcançou o resultado esperado
3. Para tarefas de codificação, peça ao Claude para executar casos de teste em seu pensamento estendido

Exemplo:

<CodeGroup>
```text User
Escreva uma função para calcular o fatorial de um número.
Antes de terminar, por favor verifique sua solução com casos de teste para:
- n=0
- n=1
- n=5
- n=10
E corrija quaisquer problemas que encontrar.
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `Escreva uma função para calcular o fatorial de um número.
Antes de terminar, por favor verifique sua solução com casos de teste para:
- n=0
- n=1
- n=5
- n=10
E corrija quaisquer problemas que encontrar.`
  }
  thinkingBudgetTokens={16000}
>
  Experimente no Console
</TryInConsoleButton>

## Próximos passos

<CardGroup>
  <Card title="Cookbook de pensamento estendido" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    Explore exemplos práticos de pensamento estendido em nosso cookbook.
  </Card>
  <Card title="Guia de pensamento estendido" icon="code" href="/docs/pt-BR/build-with-claude/extended-thinking">
    Veja documentação técnica completa para implementar pensamento estendido.
  </Card>
</CardGroup>