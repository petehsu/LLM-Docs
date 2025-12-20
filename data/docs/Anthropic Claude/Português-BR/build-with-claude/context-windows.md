# Janelas de contexto

Entenda como as janelas de contexto funcionam em modelos de linguagem e como gerenciá-las efetivamente com Claude.

---

## Entendendo a janela de contexto

A "janela de contexto" refere-se à totalidade da quantidade de texto que um modelo de linguagem pode consultar e referenciar ao gerar novo texto, mais o novo texto que gera. Isso é diferente do grande corpus de dados em que o modelo de linguagem foi treinado e, em vez disso, representa uma "memória de trabalho" para o modelo. Uma janela de contexto maior permite que o modelo compreenda e responda a prompts mais complexos e longos, enquanto uma janela de contexto menor pode limitar a capacidade do modelo de lidar com prompts mais longos ou manter coerência em conversas estendidas.

O diagrama abaixo ilustra o comportamento padrão da janela de contexto para solicitações de API<sup>1</sup>:

![Diagrama da janela de contexto](/docs/images/context-window.svg)

_<sup>1</sup>Para interfaces de chat, como para [claude.ai](https://claude.ai/), as janelas de contexto também podem ser configuradas em um sistema "primeiro a entrar, primeiro a sair" contínuo._

* **Acúmulo progressivo de tokens:** Conforme a conversa avança através dos turnos, cada mensagem do usuário e resposta do assistente se acumulam dentro da janela de contexto. Os turnos anteriores são preservados completamente.
* **Padrão de crescimento linear:** O uso de contexto cresce linearmente com cada turno, com os turnos anteriores preservados completamente.
* **Capacidade de 200K tokens:** A janela de contexto total disponível (200.000 tokens) representa a capacidade máxima para armazenar histórico de conversa e gerar nova saída do Claude.
* **Fluxo de entrada-saída:** Cada turno consiste em:
  - **Fase de entrada:** Contém todo o histórico de conversa anterior mais a mensagem atual do usuário
  - **Fase de saída:** Gera uma resposta de texto que se torna parte de uma entrada futura

## A janela de contexto com pensamento estendido

Ao usar [pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking), todos os tokens de entrada e saída, incluindo os tokens usados para pensar, contam para o limite da janela de contexto, com algumas nuances em situações multi-turno.

Os tokens do orçamento de pensamento são um subconjunto do seu parâmetro `max_tokens`, são faturados como tokens de saída e contam para os limites de taxa.

No entanto, os blocos de pensamento anteriores são automaticamente removidos do cálculo da janela de contexto pela API Claude e não fazem parte do histórico de conversa que o modelo "vê" para turnos subsequentes, preservando a capacidade de tokens para conteúdo de conversa real.

O diagrama abaixo demonstra o gerenciamento especializado de tokens quando o pensamento estendido está ativado:

![Diagrama da janela de contexto com pensamento estendido](/docs/images/context-window-thinking.svg)

* **Remoção de pensamento estendido:** Blocos de pensamento estendido (mostrados em cinza escuro) são gerados durante a fase de saída de cada turno, **mas não são levados adiante como tokens de entrada para turnos subsequentes**. Você não precisa remover os blocos de pensamento você mesmo. A API Claude faz isso automaticamente para você se você os passar de volta.
* **Detalhes de implementação técnica:**
  - A API automaticamente exclui blocos de pensamento de turnos anteriores quando você os passa de volta como parte do histórico de conversa.
  - Tokens de pensamento estendido são faturados como tokens de saída apenas uma vez, durante sua geração.
  - O cálculo efetivo da janela de contexto se torna: `context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`.
  - Tokens de pensamento incluem blocos `thinking` e blocos `redacted_thinking`.

Esta arquitetura é eficiente em tokens e permite raciocínio extensivo sem desperdício de tokens, pois blocos de pensamento podem ser substanciais em comprimento.

<Note>
Você pode ler mais sobre a janela de contexto e pensamento estendido em nosso [guia de pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking).
</Note>

## A janela de contexto com pensamento estendido e uso de ferramentas

O diagrama abaixo ilustra o gerenciamento de tokens da janela de contexto ao combinar pensamento estendido com uso de ferramentas:

![Diagrama da janela de contexto com pensamento estendido e uso de ferramentas](/docs/images/context-window-thinking-tools.svg)

<Steps>
  <Step title="Arquitetura do primeiro turno">
    - **Componentes de entrada:** Configuração de ferramentas e mensagem do usuário
    - **Componentes de saída:** Pensamento estendido + resposta de texto + solicitação de uso de ferramenta
    - **Cálculo de tokens:** Todos os componentes de entrada e saída contam para a janela de contexto, e todos os componentes de saída são faturados como tokens de saída.
  </Step>
  <Step title="Manipulação de resultado de ferramenta (turno 2)">
    - **Componentes de entrada:** Cada bloco do primeiro turno bem como o `tool_result`. O bloco de pensamento estendido **deve** ser retornado com os resultados de ferramenta correspondentes. Este é o único caso em que você **tem que** retornar blocos de pensamento.
    - **Componentes de saída:** Depois que os resultados de ferramenta foram passados de volta para Claude, Claude responderá apenas com texto (sem pensamento estendido adicional até a próxima mensagem `user`).
    - **Cálculo de tokens:** Todos os componentes de entrada e saída contam para a janela de contexto, e todos os componentes de saída são faturados como tokens de saída.
  </Step>
  <Step title="Terceiro Passo">
    - **Componentes de entrada:** Todas as entradas e a saída do turno anterior são levadas adiante com a exceção do bloco de pensamento, que pode ser descartado agora que Claude completou todo o ciclo de uso de ferramenta. A API removerá automaticamente o bloco de pensamento para você se você o passar de volta, ou você pode se sentir livre para removê-lo você mesmo neste estágio. Este é também onde você adicionaria o próximo turno `User`.
    - **Componentes de saída:** Como há um novo turno `User` fora do ciclo de uso de ferramenta, Claude gerará um novo bloco de pensamento estendido e continuará a partir daí.
    - **Cálculo de tokens:** Tokens de pensamento anteriores são automaticamente removidos dos cálculos da janela de contexto. Todos os outros blocos anteriores ainda contam como parte da janela de tokens, e o bloco de pensamento no turno `Assistant` atual conta como parte da janela de contexto.
  </Step>
</Steps>

* **Considerações para uso de ferramentas com pensamento estendido:**
  - Ao postar resultados de ferramenta, o bloco de pensamento inteiro e não modificado que acompanha essa solicitação de ferramenta específica (incluindo porções de assinatura/redação) deve ser incluído.
  - O cálculo efetivo da janela de contexto para pensamento estendido com uso de ferramentas se torna: `context_window = input_tokens + current_turn_tokens`.
  - O sistema usa assinaturas criptográficas para verificar a autenticidade do bloco de pensamento. Falhar em preservar blocos de pensamento durante o uso de ferramentas pode quebrar a continuidade de raciocínio de Claude. Assim, se você modificar blocos de pensamento, a API retornará um erro.

<Note>
Modelos Claude 4 suportam [pensamento intercalado](/docs/pt-BR/build-with-claude/extended-thinking#interleaved-thinking), que permite que Claude pense entre chamadas de ferramenta e faça raciocínio mais sofisticado após receber resultados de ferramenta.

Claude Sonnet 3.7 não suporta pensamento intercalado, portanto não há intercalação de pensamento estendido e chamadas de ferramenta sem um turno de usuário não-`tool_result` no meio.

Para mais informações sobre como usar ferramentas com pensamento estendido, consulte nosso [guia de pensamento estendido](/docs/pt-BR/build-with-claude/extended-thinking#extended-thinking-with-tool-use).
</Note>

## Janela de contexto de 1M tokens

Claude Sonnet 4 e 4.5 suportam uma janela de contexto de 1 milhão de tokens. Esta janela de contexto estendida permite que você processe documentos muito maiores, mantenha conversas mais longas e trabalhe com bases de código mais extensas.

<Note>
A janela de contexto de 1M tokens está atualmente em beta para organizações no [nível de uso](/docs/pt-BR/api/rate-limits) 4 e organizações com limites de taxa personalizados. A janela de contexto de 1M tokens está disponível apenas para Claude Sonnet 4 e Sonnet 4.5.
</Note>

Para usar a janela de contexto de 1M tokens, inclua o [cabeçalho beta](/docs/pt-BR/api/beta-headers) `context-1m-2025-08-07` em suas solicitações de API:

<CodeGroup>

```python Python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Process this large document..."}
    ],
    betas=["context-1m-2025-08-07"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const msg = await anthropic.beta.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Process this large document...' }
  ],
  betas: ['context-1m-2025-08-07']
});
```

```bash cURL
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Process this large document..."}
    ]
  }'
```

</CodeGroup>

**Considerações importantes:**
- **Status beta**: Este é um recurso beta sujeito a alterações. Recursos e preços podem ser modificados ou removidos em versões futuras.
- **Requisito de nível de uso**: A janela de contexto de 1M tokens está disponível para organizações no [nível de uso](/docs/pt-BR/api/rate-limits) 4 e organizações com limites de taxa personalizados. Organizações de nível inferior devem avançar para o nível de uso 4 para acessar este recurso.
- **Disponibilidade**: A janela de contexto de 1M tokens está atualmente disponível na API Claude, [Microsoft Foundry](/docs/pt-BR/build-with-claude/claude-in-microsoft-foundry), [Amazon Bedrock](/docs/pt-BR/build-with-claude/claude-on-amazon-bedrock) e [Google Cloud's Vertex AI](/docs/pt-BR/build-with-claude/claude-on-vertex-ai).
- **Preços**: Solicitações que excedem 200K tokens são automaticamente cobradas com taxas premium (2x entrada, 1,5x preços de saída). Consulte a [documentação de preços](/docs/pt-BR/about-claude/pricing#long-context-pricing) para detalhes.
- **Limites de taxa**: Solicitações de contexto longo têm limites de taxa dedicados. Consulte a [documentação de limites de taxa](/docs/pt-BR/api/rate-limits#long-context-rate-limits) para detalhes.
- **Considerações multimodais**: Ao processar um grande número de imagens ou pdfs, esteja ciente de que os arquivos podem variar no uso de tokens. Ao emparelhar um prompt grande com um grande número de imagens, você pode atingir [limites de tamanho de solicitação](/docs/pt-BR/api/overview#request-size-limits).

## Consciência de contexto em Claude Sonnet 4.5 e Haiku 4.5

Claude Sonnet 4.5 e Claude Haiku 4.5 apresentam **consciência de contexto**, permitindo que esses modelos rastreiem sua janela de contexto restante (ou seja, "orçamento de tokens") ao longo de uma conversa. Isso permite que Claude execute tarefas e gerencie contexto de forma mais eficaz, compreendendo quanto espaço tem para trabalhar. Claude é treinado nativamente para usar este contexto precisamente para persistir na tarefa até o final, em vez de ter que adivinhar quantos tokens restam. Para um modelo, a falta de consciência de contexto é como competir em um programa de culinária sem um relógio. Modelos Claude 4.5 mudam isso informando explicitamente ao modelo sobre seu contexto restante, para que possa aproveitar ao máximo os tokens disponíveis.

**Como funciona:**

No início de uma conversa, Claude recebe informações sobre sua janela de contexto total:

```
<budget:token_budget>200000</budget:token_budget>
```

O orçamento é definido como 200K tokens (padrão), 500K tokens (Claude.ai Enterprise) ou 1M tokens (beta, para organizações elegíveis).

Após cada chamada de ferramenta, Claude recebe uma atualização sobre a capacidade restante:

```
<system_warning>Token usage: 35000/200000; 165000 remaining</system_warning>
```

Esta consciência ajuda Claude a determinar quanto capacidade resta para trabalho e permite execução mais eficaz em tarefas de longa duração. Tokens de imagem estão incluídos nestes orçamentos.

**Benefícios:**

A consciência de contexto é particularmente valiosa para:
- Sessões de agente de longa duração que requerem foco sustentado
- Fluxos de trabalho de múltiplas janelas de contexto onde transições de estado importam
- Tarefas complexas que requerem gerenciamento cuidadoso de tokens

Para orientação de prompt sobre como aproveitar a consciência de contexto, consulte nosso [guia de melhores práticas Claude 4](/docs/pt-BR/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows).

## Gerenciamento de janela de contexto com modelos Claude mais novos

Em modelos Claude mais novos (começando com Claude Sonnet 3.7), se a soma de tokens de prompt e tokens de saída exceder a janela de contexto do modelo, o sistema retornará um erro de validação em vez de truncar silenciosamente o contexto. Esta mudança fornece comportamento mais previsível, mas requer gerenciamento de tokens mais cuidadoso.

Para planejar seu uso de tokens e garantir que você permaneça dentro dos limites da janela de contexto, você pode usar a [API de contagem de tokens](/docs/pt-BR/build-with-claude/token-counting) para estimar quantos tokens suas mensagens usarão antes de enviá-las para Claude.

Consulte nossa tabela de [comparação de modelos](/docs/pt-BR/about-claude/models/overview#model-comparison-table) para uma lista de tamanhos de janela de contexto por modelo.

# Próximas etapas
<CardGroup cols={2}>
  <Card title="Tabela de comparação de modelos" icon="scales" href="/docs/pt-BR/about-claude/models/overview#model-comparison-table">
    Consulte nossa tabela de comparação de modelos para uma lista de tamanhos de janela de contexto e preços de tokens de entrada/saída por modelo.
  </Card>
  <Card title="Visão geral de pensamento estendido" icon="settings" href="/docs/pt-BR/build-with-claude/extended-thinking">
    Saiba mais sobre como o pensamento estendido funciona e como implementá-lo junto com outros recursos, como uso de ferramentas e cache de prompt.
  </Card>
</CardGroup>