# Melhores práticas de prompting

Técnicas específicas de engenharia de prompts para modelos Claude 4.x, com orientação para Sonnet 4.5, Haiku 4.5 e Opus 4.5.

---

Este guia fornece técnicas específicas de engenharia de prompts para modelos Claude 4.x, com orientação específica para Sonnet 4.5, Haiku 4.5 e Opus 4.5. Esses modelos foram treinados para seguir instruções com mais precisão do que gerações anteriores de modelos Claude.
<Tip>
  Para uma visão geral das novas capacidades do Claude 4.5, consulte [O que há de novo no Claude 4.5](/docs/pt-BR/about-claude/models/whats-new-claude-4-5). Para orientação de migração de modelos anteriores, consulte [Migrando para Claude 4.5](/docs/pt-BR/about-claude/models/migrating-to-claude-4).
</Tip>

## Princípios gerais

### Seja explícito com suas instruções

Os modelos Claude 4.x respondem bem a instruções claras e explícitas. Ser específico sobre sua saída desejada pode ajudar a melhorar os resultados. Clientes que desejam o comportamento "acima e além" dos modelos Claude anteriores podem precisar solicitar esses comportamentos de forma mais explícita com os modelos mais novos.

<section title="Exemplo: Criando um painel de análise">

**Menos eficaz:**
```text
Crie um painel de análise
```

**Mais eficaz:**
```text
Crie um painel de análise. Inclua o máximo de recursos e interações relevantes possível. Vá além do básico para criar uma implementação totalmente funcional.
```

</section>

### Adicione contexto para melhorar o desempenho

Fornecer contexto ou motivação por trás de suas instruções, como explicar ao Claude por que tal comportamento é importante, pode ajudar os modelos Claude 4.x a entender melhor seus objetivos e entregar respostas mais direcionadas.

<section title="Exemplo: Preferências de formatação">

**Menos eficaz:**
```text
NUNCA use reticências
```

**Mais eficaz:**
```text
Sua resposta será lida em voz alta por um mecanismo de síntese de fala, portanto nunca use reticências, pois o mecanismo de síntese de fala não saberá como pronunciá-las.
```

</section>

Claude é inteligente o suficiente para generalizar a partir da explicação.

### Seja vigilante com exemplos e detalhes

Os modelos Claude 4.x prestam muita atenção aos detalhes e exemplos como parte de suas capacidades precisas de seguimento de instruções. Certifique-se de que seus exemplos se alinhem com os comportamentos que você deseja encorajar e minimize os comportamentos que deseja evitar.

### Raciocínio de longo horizonte e rastreamento de estado

Os modelos Claude 4.5 se destacam em tarefas de raciocínio de longo horizonte com capacidades excepcionais de rastreamento de estado. Mantém orientação em sessões estendidas focando no progresso incremental—fazendo avanços constantes em algumas coisas por vez em vez de tentar tudo de uma vez. Essa capacidade emerge especialmente em múltiplas janelas de contexto ou iterações de tarefas, onde Claude pode trabalhar em uma tarefa complexa, salvar o estado e continuar com uma janela de contexto nova.

#### Consciência de contexto e fluxos de trabalho de múltiplas janelas

Os modelos Claude 4.5 apresentam [consciência de contexto](/docs/pt-BR/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5), permitindo que o modelo rastreie sua janela de contexto restante (ou seja, "orçamento de tokens") durante uma conversa. Isso permite que Claude execute tarefas e gerencie contexto de forma mais eficaz, compreendendo quanto espaço tem para trabalhar.

**Gerenciando limites de contexto:**

Se você estiver usando Claude em um harness de agente que compacta contexto ou permite salvar contexto em arquivos externos (como em Claude Code), sugerimos adicionar essa informação ao seu prompt para que Claude possa se comportar de acordo. Caso contrário, Claude pode às vezes tentar naturalmente encerrar o trabalho conforme se aproxima do limite de contexto. Abaixo está um exemplo de prompt:

```text Prompt de exemplo
Sua janela de contexto será compactada automaticamente conforme se aproxima de seu limite, permitindo que você continue trabalhando indefinidamente de onde parou. Portanto, não interrompa tarefas cedo devido a preocupações com orçamento de tokens. Conforme você se aproxima de seu limite de orçamento de tokens, salve seu progresso e estado atuais na memória antes da janela de contexto ser atualizada. Sempre seja o mais persistente e autônomo possível e complete tarefas totalmente, mesmo que o final de seu orçamento esteja se aproximando. Nunca interrompa artificialmente nenhuma tarefa cedo independentemente do contexto restante.
```

A [ferramenta de memória](/docs/pt-BR/agents-and-tools/tool-use/memory-tool) se combina naturalmente com a consciência de contexto para transições de contexto perfeitas.

#### Fluxos de trabalho de múltiplas janelas de contexto

Para tarefas que abrangem múltiplas janelas de contexto:

1. **Use um prompt diferente para a primeira janela de contexto**: Use a primeira janela de contexto para configurar um framework (escrever testes, criar scripts de configuração), depois use futuras janelas de contexto para iterar em uma lista de tarefas.

2. **Faça o modelo escrever testes em um formato estruturado**: Peça ao Claude para criar testes antes de começar o trabalho e acompanhá-los em um formato estruturado (por exemplo, `tests.json`). Isso leva a uma melhor capacidade de longo prazo para iterar. Lembre Claude da importância dos testes: "É inaceitável remover ou editar testes porque isso pode levar a funcionalidade ausente ou bugada."

3. **Configure ferramentas de qualidade de vida**: Incentive Claude a criar scripts de configuração (por exemplo, `init.sh`) para iniciar graciosamente servidores, executar suites de testes e linters. Isso evita trabalho repetido ao continuar de uma janela de contexto nova.

4. **Começar do zero vs compactar**: Quando uma janela de contexto é limpa, considere começar com uma janela de contexto completamente nova em vez de usar compactação. Os modelos Claude 4.5 são extremamente eficazes em descobrir estado do sistema de arquivos local. Em alguns casos, você pode querer aproveitar isso em vez de compactação. Seja prescritivo sobre como deve começar:
   - "Chame pwd; você só pode ler e escrever arquivos neste diretório."
   - "Revise progress.txt, tests.json e os logs do git."
   - "Execute manualmente um teste de integração fundamental antes de passar para implementar novos recursos."

5. **Forneça ferramentas de verificação**: Conforme o comprimento das tarefas autônomas cresce, Claude precisa verificar a correção sem feedback humano contínuo. Ferramentas como servidor Playwright MCP ou capacidades de uso de computador para testes de UIs são úteis.

6. **Incentive o uso completo do contexto**: Solicite ao Claude que complete componentes de forma eficiente antes de passar para o próximo:

```text Prompt de exemplo
Esta é uma tarefa muito longa, portanto pode ser benéfico planejar seu trabalho claramente. É encorajado gastar todo seu contexto de saída trabalhando na tarefa - apenas certifique-se de que você não fica sem contexto com trabalho significativo não comprometido. Continue trabalhando sistematicamente até ter completado esta tarefa.
```

#### Melhores práticas de gerenciamento de estado

- **Use formatos estruturados para dados de estado**: Ao rastrear informações estruturadas (como resultados de testes ou status de tarefas), use JSON ou outros formatos estruturados para ajudar Claude a entender requisitos de schema
- **Use texto não estruturado para notas de progresso**: Notas de progresso em forma livre funcionam bem para rastrear progresso geral e contexto
- **Use git para rastreamento de estado**: Git fornece um log do que foi feito e checkpoints que podem ser restaurados. Os modelos Claude 4.5 funcionam especialmente bem usando git para rastrear estado em múltiplas sessões.
- **Enfatize progresso incremental**: Peça explicitamente ao Claude para acompanhar seu progresso e focar em trabalho incremental

<section title="Exemplo: Rastreamento de estado">

```json
// Arquivo de estado estruturado (tests.json)
{
  "tests": [
    {"id": 1, "name": "authentication_flow", "status": "passing"},
    {"id": 2, "name": "user_management", "status": "failing"},
    {"id": 3, "name": "api_endpoints", "status": "not_started"}
  ],
  "total": 200,
  "passing": 150,
  "failing": 25,
  "not_started": 25
}
```

```text
// Notas de progresso (progress.txt)
Progresso da Sessão 3:
- Corrigida validação de token de autenticação
- Atualizado modelo de usuário para lidar com casos extremos
- Próximo: investigar falhas de teste user_management (teste #2)
- Nota: Não remova testes pois isso pode levar a funcionalidade ausente
```

</section>

### Estilo de comunicação

Os modelos Claude 4.5 têm um estilo de comunicação mais conciso e natural em comparação com modelos anteriores:

- **Mais direto e fundamentado**: Fornece relatórios de progresso baseados em fatos em vez de atualizações auto-celebratórias
- **Mais conversacional**: Ligeiramente mais fluente e coloquial, menos parecido com máquina
- **Menos verboso**: Pode pular resumos detalhados por eficiência, a menos que solicitado de outra forma

Este estilo de comunicação reflete com precisão o que foi realizado sem elaboração desnecessária.

## Orientação para situações específicas

### Equilibre verbosidade

Os modelos Claude 4.5 tendem à eficiência e podem pular resumos verbais após chamadas de ferramentas, pulando diretamente para a próxima ação. Embora isso crie um fluxo de trabalho simplificado, você pode preferir mais visibilidade em seu processo de raciocínio.

Se você quer que Claude forneça atualizações conforme trabalha:

```text Prompt de exemplo
Após completar uma tarefa que envolve uso de ferramentas, forneça um resumo rápido do trabalho que você fez.
```

### Padrões de uso de ferramentas

Os modelos Claude 4.5 são treinados para seguimento preciso de instruções e se beneficiam de direção explícita para usar ferramentas específicas. Se você disser "pode sugerir algumas mudanças", às vezes fornecerá sugestões em vez de implementá-las—mesmo que fazer mudanças possa ser o que você pretendia.

Para que Claude tome ação, seja mais explícito:

<section title="Exemplo: Instruções explícitas">

**Menos eficaz (Claude apenas sugerirá):**
```text
Pode sugerir algumas mudanças para melhorar esta função?
```

**Mais eficaz (Claude fará as mudanças):**
```text
Mude esta função para melhorar seu desempenho.
```

Ou:
```text
Faça essas edições no fluxo de autenticação.
```

</section>

Para tornar Claude mais proativo em tomar ação por padrão, você pode adicionar isto ao seu prompt do sistema:

```text Prompt de exemplo para ação proativa
<default_to_action>
Por padrão, implemente mudanças em vez de apenas sugerir. Se a intenção do usuário for ambígua, infira a ação mais útil provável e prossiga, usando ferramentas para descobrir detalhes ausentes em vez de adivinhar. Tente inferir a intenção do usuário sobre se uma chamada de ferramenta (por exemplo, edição ou leitura de arquivo) é pretendida ou não, e aja de acordo.
</default_to_action>
```

Por outro lado, se você quer que o modelo seja mais hesitante por padrão, menos propenso a pular direto para implementações, e apenas tomar ação se solicitado, você pode orientar esse comportamento com um prompt como o abaixo:

```text Prompt de exemplo para ação conservadora
<do_not_act_before_instructions>
Não pule para implementação ou mudança de arquivos a menos que claramente instruído a fazer mudanças. Quando a intenção do usuário for ambígua, padrão para fornecer informações, fazer pesquisa e fornecer recomendações em vez de tomar ação. Apenas prossiga com edições, modificações ou implementações quando o usuário explicitamente as solicitar.
</do_not_act_before_instructions>
```

### Uso de ferramentas e acionamento

Claude Opus 4.5 é mais responsivo ao prompt do sistema do que modelos anteriores. Se seus prompts foram projetados para reduzir subutilização em ferramentas ou habilidades, Claude Opus 4.5 pode agora sobreutilizar. A solução é reduzir qualquer linguagem agressiva. Onde você pode ter dito "CRÍTICO: Você DEVE usar esta ferramenta quando...", você pode usar prompting mais normal como "Use esta ferramenta quando...".

### Controle o formato das respostas

Encontramos algumas formas que são particularmente eficazes em orientar a formatação de saída em modelos Claude 4.x:

1. **Diga ao Claude o que fazer em vez do que não fazer**

   - Em vez de: "Não use markdown em sua resposta"
   - Tente: "Sua resposta deve ser composta de parágrafos de prosa fluindo suavemente."

2. **Use indicadores de formato XML**

   - Tente: "Escreva as seções de prosa de sua resposta em tags \<smoothly_flowing_prose_paragraphs\>."

3. **Combine seu estilo de prompt com a saída desejada**

   O estilo de formatação usado em seu prompt pode influenciar o estilo de resposta do Claude. Se você ainda estiver experimentando problemas de direcionabilidade com formatação de saída, recomendamos, o máximo possível, combinar seu estilo de prompt com seu estilo de saída desejado. Por exemplo, remover markdown de seu prompt pode reduzir o volume de markdown na saída.

4. **Use prompts detalhados para preferências de formatação específicas**

   Para mais controle sobre uso de markdown e formatação, forneça orientação explícita:

```text Prompt de exemplo para minimizar markdown
<avoid_excessive_markdown_and_bullet_points>
Ao escrever relatórios, documentos, explicações técnicas, análises ou qualquer conteúdo de forma longa, escreva em prosa clara e fluente usando parágrafos e frases completas. Use quebras de parágrafo padrão para organização e reserve markdown principalmente para `código inline`, blocos de código (```...```), e títulos simples (###, e ###). Evite usar **negrito** e *itálicos*.

NÃO use listas ordenadas (1. ...) ou listas não ordenadas (*) a menos que: a) você esteja apresentando itens verdadeiramente discretos onde um formato de lista é a melhor opção, ou b) o usuário explicitamente solicite uma lista ou ranking

Em vez de listar itens com bullets ou números, incorpore-os naturalmente em frases. Esta orientação se aplica especialmente à escrita técnica. Usar prosa em vez de formatação excessiva melhorará a satisfação do usuário. NUNCA produza uma série de pontos de bullet excessivamente curtos.

Seu objetivo é texto legível e fluente que guia o leitor naturalmente através de ideias em vez de fragmentar informações em pontos isolados.
</avoid_excessive_markdown_and_bullet_points>
```

### Pesquisa e coleta de informações

Os modelos Claude 4.5 demonstram capacidades excepcionais de busca agêntica e podem encontrar e sintetizar informações de múltiplas fontes de forma eficaz. Para resultados de pesquisa ideais:

1. **Forneça critérios de sucesso claros**: Defina o que constitui uma resposta bem-sucedida para sua pergunta de pesquisa

2. **Incentive verificação de fonte**: Peça ao Claude para verificar informações em múltiplas fontes

3. **Para tarefas de pesquisa complexas, use uma abordagem estruturada**:

```text Prompt de exemplo para pesquisa complexa
Pesquise esta informação de forma estruturada. Conforme você coleta dados, desenvolva várias hipóteses concorrentes. Acompanhe seus níveis de confiança em suas notas de progresso para melhorar a calibração. Regularmente auto-critique sua abordagem e plano. Atualize um arquivo de árvore de hipóteses ou notas de pesquisa para persistir informações e fornecer transparência. Divida esta tarefa de pesquisa complexa sistematicamente.
```

Esta abordagem estruturada permite que Claude encontre e sintetize praticamente qualquer informação e iterativamente critique seus achados, não importa o tamanho do corpus.

### Orquestração de subagentos

Os modelos Claude 4.5 demonstram capacidades significativamente melhoradas de orquestração nativa de subagentos. Esses modelos podem reconhecer quando tarefas se beneficiariam de delegar trabalho para subagentos especializados e fazem isso proativamente sem exigir instrução explícita.

Para aproveitar esse comportamento:

1. **Garanta ferramentas de subagentos bem definidas**: Tenha ferramentas de subagentos disponíveis e descritas em definições de ferramentas
2. **Deixe Claude orquestrar naturalmente**: Claude delegará apropriadamente sem instrução explícita
3. **Ajuste conservadorismo se necessário**:

```text Prompt de exemplo para uso conservador de subagentos
Apenas delegue para subagentos quando a tarefa claramente se beneficia de um agente separado com uma janela de contexto nova.
```

### Autoconhecimento do modelo

Se você gostaria que Claude se identificasse corretamente em sua aplicação ou use strings de API específicas:

```text Prompt de exemplo para identidade do modelo
O assistente é Claude, criado pela Anthropic. O modelo atual é Claude Sonnet 4.5.
```

Para aplicativos alimentados por LLM que precisam especificar strings de modelo:

```text Prompt de exemplo para string de modelo
Quando um LLM é necessário, por favor padrão para Claude Sonnet 4.5 a menos que o usuário solicite de outra forma. A string de modelo exata para Claude Sonnet 4.5 é claude-sonnet-4-5-20250929.
```

### Sensibilidade de pensamento

Quando o pensamento estendido está desabilitado, Claude Opus 4.5 é particularmente sensível à palavra "think" e suas variantes. Recomendamos substituir "think" por palavras alternativas que transmitam significado similar, como "consider," "believe," e "evaluate."

### Aproveite as capacidades de pensamento e pensamento intercalado

Os modelos Claude 4.x oferecem capacidades de pensamento que podem ser especialmente úteis para tarefas envolvendo reflexão após uso de ferramentas ou raciocínio complexo de múltiplas etapas. Você pode guiar seu pensamento inicial ou intercalado para melhores resultados.

```text Prompt de exemplo
Após receber resultados de ferramentas, reflita cuidadosamente sobre sua qualidade e determine os próximos passos ideais antes de prosseguir. Use seu pensamento para planejar e iterar com base nessa nova informação, e então tome a melhor próxima ação.
```

<Info>
  Para mais informações sobre capacidades de pensamento, consulte [Pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking).
</Info>

### Criação de documentos

Os modelos Claude 4.5 se destacam em criar apresentações, animações e documentos visuais. Esses modelos igualam ou excedem Claude Opus 4.1 neste domínio, com criatividade impressionante e seguimento de instruções mais forte. Os modelos produzem saída polida e utilizável na primeira tentativa na maioria dos casos.

Para melhores resultados com criação de documentos:

```text Prompt de exemplo
Crie uma apresentação profissional sobre [topic]. Inclua elementos de design reflexivos, hierarquia visual e animações envolventes onde apropriado.
```

### Capacidades de visão melhoradas

Claude Opus 4.5 tem capacidades de visão melhoradas em comparação com modelos Claude anteriores. Funciona melhor em tarefas de processamento de imagem e extração de dados, particularmente quando há múltiplas imagens presentes no contexto. Essas melhorias se transferem para uso de computador, onde o modelo pode interpretar mais confiável screenshots e elementos de UI. Você também pode usar Claude Opus 4.5 para analisar vídeos dividindo-os em frames.

Uma técnica que encontramos eficaz para aumentar ainda mais o desempenho é dar ao Claude Opus 4.5 uma ferramenta de corte ou [habilidade](/docs/pt-BR/agents-and-tools/agent-skills/overview). Vimos melhoria consistente em avaliações de imagem quando Claude é capaz de "ampliar" regiões relevantes de uma imagem. Preparamos um cookbook para a ferramenta de corte [aqui](https://github.com/anthropics/claude-cookbooks/blob/main/multimodal/crop_tool.ipynb).

### Otimize chamadas de ferramentas paralelas

Os modelos Claude 4.x se destacam em execução paralela de ferramentas, com Sonnet 4.5 sendo particularmente agressivo em disparar múltiplas operações simultaneamente. Os modelos Claude 4.x irão:

- Executar múltiplas buscas especulativas durante pesquisa
- Ler vários arquivos de uma vez para construir contexto mais rápido
- Executar comandos bash em paralelo (que podem até criar gargalo no desempenho do sistema)

Este comportamento é facilmente direcionável. Embora o modelo tenha uma alta taxa de sucesso em chamadas de ferramentas paralelas sem prompting, você pode aumentar isso para ~100% ou ajustar o nível de agressão:

```text Prompt de exemplo para eficiência paralela máxima
<use_parallel_tool_calls>
Se você pretende chamar múltiplas ferramentas e não há dependências entre as chamadas de ferramentas, faça todas as chamadas de ferramentas independentes em paralelo. Priorize chamar ferramentas simultaneamente sempre que as ações puderem ser feitas em paralelo em vez de sequencialmente. Por exemplo, ao ler 3 arquivos, execute 3 chamadas de ferramentas em paralelo para ler todos os 3 arquivos no contexto ao mesmo tempo. Maximize o uso de chamadas de ferramentas paralelas onde possível para aumentar velocidade e eficiência. No entanto, se algumas chamadas de ferramentas dependem de chamadas anteriores para informar valores dependentes como os parâmetros, NÃO chame essas ferramentas em paralelo e em vez disso chame-as sequencialmente. Nunca use placeholders ou adivinhe parâmetros ausentes em chamadas de ferramentas.
</use_parallel_tool_calls>
```

```text Prompt de exemplo para reduzir execução paralela
Execute operações sequencialmente com breves pausas entre cada etapa para garantir estabilidade.
```

### Reduza criação de arquivos em codificação agêntica

Os modelos Claude 4.x podem às vezes criar novos arquivos para fins de teste e iteração, particularmente ao trabalhar com código. Esta abordagem permite que Claude use arquivos, especialmente scripts python, como um 'bloco de rascunho temporário' antes de salvar sua saída final. Usar arquivos temporários pode melhorar resultados particularmente para casos de uso de codificação agêntica.

Se você prefere minimizar criação de novos arquivos líquidos, você pode instruir Claude a limpar depois de si:

```text Prompt de exemplo
Se você criar quaisquer arquivos temporários novos, scripts ou arquivos auxiliares para iteração, limpe esses arquivos removendo-os ao final da tarefa.
```

### Excesso de entusiasmo e criação de arquivos

Claude Opus 4.5 tem uma tendência de sobreengenharia criando arquivos extras, adicionando abstrações desnecessárias ou construindo flexibilidade que não foi solicitada. Se você está vendo este comportamento indesejado, adicione prompting explícito para manter soluções mínimas.

Por exemplo:

```text Prompt de exemplo para minimizar sobreengenharia
Evite sobreengenharia. Apenas faça mudanças que são diretamente solicitadas ou claramente necessárias. Mantenha soluções simples e focadas.

Não adicione recursos, refatore código ou faça "melhorias" além do que foi pedido. Uma correção de bug não precisa de código circundante limpo. Um recurso simples não precisa de configurabilidade extra.

Não adicione tratamento de erro, fallbacks ou validação para cenários que não podem acontecer. Confie em garantias de código interno e framework. Apenas valide em limites de sistema (entrada de usuário, APIs externas). Não use shims de compatibilidade retroativa quando você pode apenas mudar o código.

Não crie helpers, utilitários ou abstrações para operações únicas. Não projete para requisitos futuros hipotéticos. A quantidade certa de complexidade é o mínimo necessário para a tarefa atual. Reutilize abstrações existentes onde possível e siga o princípio DRY.
```

### Design de frontend

Os modelos Claude 4.x, particularmente Opus 4.5, se destacam em construir aplicações web complexas e do mundo real com design de frontend forte. No entanto, sem orientação, modelos podem padrão para padrões genéricos que criam o que usuários chamam de estética "AI slop". Para criar frontends distintivos e criativos que surpreendem e deliciam:

<Tip>
Para um guia detalhado sobre melhorar design de frontend, consulte nosso post de blog sobre [melhorando design de frontend através de habilidades](https://www.claude.com/blog/improving-frontend-design-through-skills).
</Tip>

Aqui está um trecho de prompt do sistema que você pode usar para encorajar melhor design de frontend:

```text Prompt de exemplo para estética de frontend
<frontend_aesthetics>
Você tende a convergir para saídas genéricas, "on distribution". Em design de frontend, isso cria o que usuários chamam de estética "AI slop". Evite isso: faça frontends criativos e distintivos que surpreendem e deliciam.

Foque em:
- Tipografia: Escolha fontes que são bonitas, únicas e interessantes. Evite fontes genéricas como Arial e Inter; opte em vez disso por escolhas distintivas que elevam a estética do frontend.
- Cor & Tema: Comprometa-se com uma estética coerente. Use variáveis CSS para consistência. Cores dominantes com acentos agudos superam paletas tímidas e uniformemente distribuídas. Tire inspiração de temas de IDE e estéticas culturais.
- Movimento: Use animações para efeitos e micro-interações. Priorize soluções apenas CSS para HTML. Use biblioteca Motion para React quando disponível. Foque em momentos de alto impacto: um carregamento de página bem orquestrado com reveals escalonados (animation-delay) cria mais deleite do que micro-interações espalhadas.
- Fundos: Crie atmosfera e profundidade em vez de padrão para cores sólidas. Camada gradientes CSS, use padrões geométricos ou adicione efeitos contextuais que correspondem à estética geral.

Evite estéticas genéricas geradas por IA:
- Famílias de fontes sobreutilizadas (Inter, Roboto, Arial, fontes do sistema)
- Esquemas de cores clichê (particularmente gradientes roxos em fundos brancos)
- Layouts previsíveis e padrões de componentes
- Design cookie-cutter que carece de caráter específico do contexto

Interprete criativamente e faça escolhas inesperadas que se sentem genuinamente projetadas para o contexto. Varie entre temas claros e escuros, diferentes fontes, diferentes estéticas. Você ainda tende a convergir em escolhas comuns (Space Grotesk, por exemplo) entre gerações. Evite isso: é crítico que você pense fora da caixa!
</frontend_aesthetics>
```

Você também pode consultar a habilidade completa [aqui](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md).

### Evite focar em passar testes e hard-coding

Os modelos Claude 4.x podem às vezes focar muito pesadamente em fazer testes passarem à custa de soluções mais gerais, ou podem usar workarounds como scripts auxiliares para refatoração complexa em vez de usar ferramentas padrão diretamente. Para prevenir este comportamento e garantir soluções robustas e generalizáveis:

```text Prompt de exemplo
Por favor escreva uma solução de alta qualidade e propósito geral usando as ferramentas padrão disponíveis. Não crie scripts auxiliares ou workarounds para realizar a tarefa de forma mais eficiente. Implemente uma solução que funcione corretamente para todas as entradas válidas, não apenas os casos de teste. Não hard-code valores ou crie soluções que funcionem apenas para entradas de teste específicas. Em vez disso, implemente a lógica real que resolve o problema generalmente.

Foque em entender os requisitos do problema e implementar o algoritmo correto. Testes estão lá para verificar correção, não para definir a solução. Forneça uma implementação com princípios que segue melhores práticas e princípios de design de software.

Se a tarefa for irrazoável ou inviável, ou se qualquer um dos testes for incorreto, por favor me informe em vez de trabalhar em torno deles. A solução deve ser robusta, mantível e extensível.
```

### Encorajando exploração de código

Claude Opus 4.5 é altamente capaz mas pode ser excessivamente conservador ao explorar código. Se você notar o modelo propondo soluções sem olhar para o código ou fazendo suposições sobre código que não leu, a melhor solução é adicionar instruções explícitas ao prompt. Claude Opus 4.5 é nosso modelo mais direcionável até agora e responde confiável a orientação direta.

Por exemplo:

```text Prompt de exemplo para exploração de código
SEMPRE leia e entenda arquivos relevantes antes de propor edições de código. Não especule sobre código que você não inspecionou. Se o usuário referencia um arquivo/caminho específico, você DEVE abrir e inspecionar antes de explicar ou propor correções. Seja rigoroso e persistente em buscar código para fatos-chave. Revise completamente o estilo, convenções e abstrações da base de código antes de implementar novos recursos ou abstrações.
```

### Minimizando alucinações em codificação agêntica

Os modelos Claude 4.x são menos propensos a alucinações e dão respostas mais precisas, fundamentadas e inteligentes baseadas no código. Para encorajar este comportamento ainda mais e minimizar alucinações:

```text Prompt de exemplo
<investigate_before_answering>
Nunca especule sobre código que você não abriu. Se o usuário referencia um arquivo específico, você DEVE ler o arquivo antes de responder. Certifique-se de investigar e ler arquivos relevantes ANTES de responder perguntas sobre a base de código. Nunca faça nenhuma afirmação sobre código antes de investigar a menos que você tenha certeza da resposta correta - dê respostas fundamentadas e livres de alucinação.
</investigate_before_answering>
```

## Considerações de migração

Ao migrar para modelos Claude 4.5:

1. **Seja específico sobre comportamento desejado**: Considere descrever exatamente o que você gostaria de ver na saída.

2. **Enquadre suas instruções com modificadores**: Adicionar modificadores que encorajam Claude a aumentar a qualidade e detalhe de sua saída pode ajudar a moldar melhor o desempenho do Claude. Por exemplo, em vez de "Crie um painel de análise", use "Crie um painel de análise. Inclua o máximo de recursos e interações relevantes possível. Vá além do básico para criar uma implementação totalmente funcional."

3. **Solicite recursos específicos explicitamente**: Animações e elementos interativos devem ser solicitados explicitamente quando desejados.