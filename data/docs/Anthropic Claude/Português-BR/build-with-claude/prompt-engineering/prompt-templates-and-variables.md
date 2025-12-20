# Use modelos de prompt e variáveis

Aprenda a usar modelos de prompt e variáveis para criar aplicações mais eficientes e escaláveis com Claude.

---

Ao implantar uma aplicação baseada em LLM com Claude, suas chamadas de API normalmente consistirão em dois tipos de conteúdo:
- **Conteúdo fixo:** Instruções estáticas ou contexto que permanecem constantes em múltiplas interações
- **Conteúdo variável:** Elementos dinâmicos que mudam a cada solicitação ou conversa, tais como:
    - Entradas do usuário
    - Conteúdo recuperado para Geração Aumentada por Recuperação (RAG)
    - Contexto da conversa como histórico da conta do usuário
    - Dados gerados pelo sistema como resultados de uso de ferramentas alimentados de outras chamadas independentes para Claude

Um **modelo de prompt** combina essas partes fixas e variáveis, usando marcadores de posição para o conteúdo dinâmico. No [Claude Console](/), esses marcadores de posição são denotados com **\{\{chaves duplas\}\}**, tornando-os facilmente identificáveis e permitindo testes rápidos de diferentes valores.

---

# Quando usar modelos de prompt e variáveis
Você deve sempre usar modelos de prompt e variáveis quando esperar que qualquer parte do seu prompt seja repetida em outra chamada para Claude (apenas via API ou o [Claude Console](/). [claude.ai](https://claude.ai/) atualmente não suporta modelos de prompt ou variáveis).

Modelos de prompt oferecem vários benefícios:
- **Consistência:** Garantem uma estrutura consistente para seus prompts em múltiplas interações
- **Eficiência:** Facilmente trocam conteúdo variável sem reescrever todo o prompt
- **Testabilidade:** Testam rapidamente diferentes entradas e casos extremos mudando apenas a porção variável
- **Escalabilidade:** Simplificam o gerenciamento de prompts conforme sua aplicação cresce em complexidade
- **Controle de versão:** Facilmente rastreiam mudanças na estrutura do seu prompt ao longo do tempo mantendo abas apenas na parte central do seu prompt, separada das entradas dinâmicas

O [Claude Console](/) usa intensivamente modelos de prompt e variáveis para suportar recursos e ferramentas para todos os itens acima, como com o:
- **[Gerador de prompt](/docs/pt-BR/build-with-claude/prompt-engineering/prompt-generator):** Decide quais variáveis seu prompt precisa e as inclui no modelo que produz
- **[Melhorador de prompt](/docs/pt-BR/build-with-claude/prompt-engineering/prompt-improver):** Pega seu modelo existente, incluindo todas as variáveis, e as mantém no modelo melhorado que produz
- **[Ferramenta de avaliação](/docs/pt-BR/test-and-evaluate/eval-tool):** Permite que você facilmente teste, escale e rastreie versões dos seus prompts separando as porções variáveis e fixas do seu modelo de prompt

---

# Exemplo de modelo de prompt

Vamos considerar uma aplicação simples que traduz texto em inglês para espanhol. O texto traduzido seria variável já que você esperaria que esse texto mudasse entre usuários ou chamadas para Claude. Esse texto traduzido poderia ser dinamicamente recuperado de bancos de dados ou da entrada do usuário.

Assim, para sua aplicação de tradução, você poderia usar este modelo de prompt simples:
```
Traduza este texto do inglês para o espanhol: {{text}}
```

---

## Próximos passos

<CardGroup cols={2}>
  <Card title="Gere um prompt" icon="link" href="/docs/pt-BR/build-with-claude/prompt-engineering/prompt-generator">
    Aprenda sobre o gerador de prompt no Claude Console e tente fazer com que Claude gere um prompt para você.
  </Card>
  <Card title="Aplique tags XML" icon="link" href="/docs/pt-BR/build-with-claude/prompt-engineering/use-xml-tags">
    Se você quiser elevar o nível do seu jogo de variáveis de prompt, envolva-as em tags XML.
  </Card>
  <Card title="Claude Console" icon="link" href="/">
    Confira a miríade de ferramentas de desenvolvimento de prompt disponíveis no Claude Console.
  </Card>
</CardGroup>