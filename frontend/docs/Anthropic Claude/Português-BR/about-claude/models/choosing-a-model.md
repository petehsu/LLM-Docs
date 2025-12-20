# Escolhendo o modelo certo

Selecionar o modelo Claude ideal para sua aplicação envolve equilibrar três considerações principais: capacidades, velocidade e custo. Este guia ajuda você a tomar uma decisão informada com base em seus requisitos específicos.

---

## Estabeleça critérios principais

Ao escolher um modelo Claude, recomendamos primeiro avaliar estes fatores:
- **Capacidades:** Quais recursos ou capacidades específicas o modelo precisará ter para atender às suas necessidades?
- **Velocidade:** Com que rapidez o modelo precisa responder em sua aplicação?
- **Custo:** Qual é seu orçamento para uso em desenvolvimento e produção?

Conhecer essas respostas com antecedência tornará muito mais fácil estreitar as opções e decidir qual modelo usar.

***

## Escolha o melhor modelo para começar

Existem duas abordagens gerais que você pode usar para começar a testar qual modelo Claude funciona melhor para suas necessidades.

### Opção 1: Comece com um modelo rápido e econômico

Para muitas aplicações, começar com um modelo mais rápido e econômico como Claude Haiku 4.5 pode ser a abordagem ideal:

1. Comece a implementação com Claude Haiku 4.5
2. Teste seu caso de uso completamente
3. Avalie se o desempenho atende aos seus requisitos
4. Atualize apenas se necessário para lacunas de capacidade específicas

Esta abordagem permite iteração rápida, custos de desenvolvimento mais baixos e geralmente é suficiente para muitas aplicações comuns. Esta abordagem é melhor para:
- Prototipagem e desenvolvimento inicial
- Aplicações com requisitos rigorosos de latência
- Implementações sensíveis ao custo
- Tarefas de alto volume e diretas

### Opção 2: Comece com o modelo mais capaz

Para tarefas complexas onde inteligência e capacidades avançadas são primordiais, você pode querer começar com o modelo mais capaz e depois considerar otimizar para modelos mais eficientes posteriormente:

1. Implemente com Claude Sonnet 4.5
2. Otimize seus prompts para esses modelos
3. Avalie se o desempenho atende aos seus requisitos
4. Considere aumentar a eficiência reduzindo a inteligência ao longo do tempo com maior otimização de fluxo de trabalho

Esta abordagem é melhor para:
- Tarefas de raciocínio complexo
- Aplicações científicas ou matemáticas
- Tarefas que exigem compreensão nuançada
- Aplicações onde a precisão supera considerações de custo
- Codificação avançada

## Matriz de seleção de modelo

| Quando você precisa... | Recomendamos começar com... | Exemplos de casos de uso |
|------------------|-------------------|-------------------|
| Melhor modelo para agentes complexos e codificação, inteligência mais alta na maioria das tarefas, orquestração superior de ferramentas para tarefas autônomas de longa duração | Claude Sonnet 4.5 | Agentes de codificação autônoma, automação de cibersegurança, análise financeira complexa, tarefas de pesquisa de múltiplas horas, estruturas multi-agente |
| Inteligência máxima com desempenho prático para tarefas especializadas complexas | Claude Opus 4.5 | Engenharia de software profissional, agentes avançados para tarefas de escritório, uso de computador e navegador em escala, aplicações de visão com mudança de patamar |
| Inteligência e raciocínio excepcionais para tarefas especializadas complexas | Claude Opus 4.1 | Refatoração de base de código altamente complexa, escrita criativa nuançada, análise científica especializada |
| Desempenho próximo à fronteira com velocidade relâmpago e pensamento estendido - nosso modelo Haiku mais rápido e inteligente ao preço mais econômico | Claude Haiku 4.5 | Aplicações em tempo real, processamento inteligente de alto volume, implantações sensíveis ao custo que precisam de raciocínio forte, tarefas de subagentos |

***

## Decida se deve atualizar ou mudar de modelos

Para determinar se você precisa atualizar ou mudar de modelos, você deve:
1. [Criar testes de benchmark](/docs/pt-BR/test-and-evaluate/develop-tests) específicos para seu caso de uso - ter um bom conjunto de avaliação é o passo mais importante do processo
2. Testar com seus prompts e dados reais
3. Comparar desempenho entre modelos para:
   - Precisão das respostas
   - Qualidade da resposta
   - Tratamento de casos extremos
4. Pesar compensações de desempenho e custo

## Próximos passos

<CardGroup cols={3}>
  <Card title="Gráfico de comparação de modelos" icon="settings" href="/docs/pt-BR/about-claude/models/overview">
    Veja especificações detalhadas e preços para os últimos modelos Claude
  </Card>
  <Card title="Novidades no Claude 4.5" icon="sparkle" href="/docs/pt-BR/about-claude/models/whats-new-claude-4-5">
    Explore as últimas melhorias nos modelos Claude 4.5
  </Card>
  <Card title="Comece a construir" icon="code" href="/docs/pt-BR/get-started">
    Comece com sua primeira chamada de API
  </Card>
</CardGroup>