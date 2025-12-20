# Edição de contexto

Gerencie automaticamente o contexto da conversa conforme ele cresce com edição de contexto.

---

## Visão geral

A edição de contexto permite que você gerencie automaticamente o contexto da conversa conforme ele cresce, ajudando você a otimizar custos e permanecer dentro dos limites da janela de contexto. Você pode usar estratégias de API do lado do servidor, recursos de SDK do lado do cliente ou ambos juntos.

| Abordagem | Onde é executado | Estratégias | Como funciona |
|----------|---------------|------------|--------------|
| **Lado do servidor** | API | Limpeza de resultados de ferramentas (`clear_tool_uses_20250919`)<br/>Limpeza de blocos de pensamento (`clear_thinking_20251015`) | Aplicado antes do prompt chegar ao Claude. Limpa conteúdo específico do histórico de conversa. Cada estratégia pode ser configurada independentemente. |
| **Lado do cliente** | SDK | Compactação | Disponível em [SDKs Python e TypeScript](/docs/pt-BR/api/client-sdks) ao usar [`tool_runner`](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Gera um resumo e substitui o histórico completo de conversa. Veja [Compactação](#client-side-compaction-sdk) abaixo. |

## Visão geral

A edição de contexto permite que você gerencie automaticamente o contexto da conversa conforme ele cresce, ajudando você a otimizar custos e permanecer dentro dos limites da janela de contexto. Você pode usar estratégias de API do lado do servidor, recursos de SDK do lado do cliente ou ambos juntos.

| Abordagem | Onde é executado | Estratégias | Como funciona |
|----------|---------------|------------|--------------|
| **Lado do servidor** | API | Limpeza de resultados de ferramentas (`clear_tool_uses_20250919`)<br/>Limpeza de blocos de pensamento (`clear_thinking_20251015`) | Aplicado antes do prompt chegar ao Claude. Limpa conteúdo específico do histórico de conversa. Cada estratégia pode ser configurada independentemente. |
| **Lado do cliente** | SDK | Compactação | Disponível em [SDKs Python e TypeScript](/docs/pt-BR/api/client-sdks) ao usar [`tool_runner`](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Gera um resumo e substitui o histórico completo de conversa. Veja [Compactação](#client-side-compaction-sdk) abaixo. |

## Estratégias do lado do servidor

<Note>
A edição de contexto está atualmente em beta com suporte para limpeza de resultados de ferramentas e limpeza de blocos de pensamento. Para ativá-la, use o cabeçalho beta `context-management-2025-06-27` em suas solicitações de API.

Entre em contato através do nosso [formulário de feedback](https://forms.gle/YXC2EKGMhjN1c4L88) para compartilhar seu feedback sobre este recurso.
</Note>

## Visão geral

A edição de contexto permite que você gerencie automaticamente o contexto da conversa conforme ele cresce, ajudando você a otimizar custos e permanecer dentro dos limites da janela de contexto. Você pode usar estratégias de API do lado do servidor, recursos de SDK do lado do cliente ou ambos juntos.

| Abordagem | Onde é executado | Estratégias | Como funciona |
|----------|---------------|------------|--------------|
| **Lado do servidor** | API | Limpeza de resultados de ferramentas (`clear_tool_uses_20250919`)<br/>Limpeza de blocos de pensamento (`clear_thinking_20251015`) | Aplicado antes do prompt chegar ao Claude. Limpa conteúdo específico do histórico de conversa. Cada estratégia pode ser configurada independentemente. |
| **Lado do cliente** | SDK | Compactação | Disponível em [SDKs Python e TypeScript](/docs/pt-BR/api/client-sdks) ao usar [`tool_runner`](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Gera um resumo e substitui o histórico completo de conversa. Veja [Compactação](#client-side-compaction-sdk) abaixo. |

## Estratégias do lado do servidor

<Note>
A edição de contexto está atualmente em beta com suporte para limpeza de resultados de ferramentas e limpeza de blocos de pensamento. Para ativá-la, use o cabeçalho beta `context-management-2025-06-27` em suas solicitações de API.

Entre em contato através do nosso [formulário de feedback](https://forms.gle/YXC2EKGMhjN1c4L88) para compartilhar seu feedback sobre este recurso.
</Note>

### Limpeza de resultados de ferramentas

A estratégia `clear_tool_uses_20250919` limpa resultados de ferramentas quando o contexto da conversa cresce além do seu limite configurado. Quando ativada, a API limpa automaticamente os resultados de ferramentas mais antigos em ordem cronológica, substituindo-os por texto de espaço reservado para informar ao Claude que o resultado da ferramenta foi removido. Por padrão, apenas os resultados de ferramentas são limpos. Você pode opcionalmente limpar tanto os resultados de ferramentas quanto as chamadas de ferramentas (os parâmetros de uso de ferramentas) definindo `clear_tool_inputs` como true.

## Visão geral

A edição de contexto permite que você gerencie automaticamente o contexto da conversa conforme ele cresce, ajudando você a otimizar custos e permanecer dentro dos limites da janela de contexto. Você pode usar estratégias de API do lado do servidor, recursos de SDK do lado do cliente ou ambos juntos.

| Abordagem | Onde é executado | Estratégias | Como funciona |
|----------|---------------|------------|--------------|
| **Lado do servidor** | API | Limpeza de resultados de ferramentas (`clear_tool_uses_20250919`)<br/>Limpeza de blocos de pensamento (`clear_thinking_20251015`) | Aplicado antes do prompt chegar ao Claude. Limpa conteúdo específico do histórico de conversa. Cada estratégia pode ser configurada independentemente. |
| **Lado do cliente** | SDK | Compactação | Disponível em [SDKs Python e TypeScript](/docs/pt-BR/api/client-sdks) ao usar [`tool_runner`](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Gera um resumo e substitui o histórico completo de conversa. Veja [Compactação](#client-side-compaction-sdk) abaixo. |

## Estratégias do lado do servidor

<Note>
A edição de contexto está atualmente em beta com suporte para limpeza de resultados de ferramentas e limpeza de blocos de pensamento. Para ativá-la, use o cabeçalho beta `context-management-2025-06-27` em suas solicitações de API.

Entre em contato através do nosso [formulário de feedback](https://forms.gle/YXC2EKGMhjN1c4L88) para compartilhar seu feedback sobre este recurso.
</Note>

### Limpeza de resultados de ferramentas

A estratégia `clear_tool_uses_20250919` limpa resultados de ferramentas quando o contexto da conversa cresce além do seu limite configurado. Quando ativada, a API limpa automaticamente os resultados de ferramentas mais antigos em ordem cronológica, substituindo-os por texto de espaço reservado para informar ao Claude que o resultado da ferramenta foi removido. Por padrão, apenas os resultados de ferramentas são limpos. Você pode opcionalmente limpar tanto os resultados de ferramentas quanto as chamadas de ferramentas (os parâmetros de uso de ferramentas) definindo `clear_tool_inputs` como true.

### Limpeza de blocos de pensamento

A estratégia `clear_thinking_20251015` gerencia blocos `thinking` em conversas quando o pensamento estendido está ativado. Esta estratégia limpa automaticamente blocos de pensamento mais antigos de turnos anteriores.

<Tip>
**Comportamento padrão**: Quando o pensamento estendido está ativado sem configurar a estratégia `clear_thinking_20251015`, a API mantém automaticamente apenas os blocos de pensamento do último turno do assistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Para maximizar acertos de cache, preserve todos os blocos de pensamento definindo `keep: "all"`.
</Tip>

<Note>
Um turno de conversa do assistente pode incluir múltiplos blocos de conteúdo (por exemplo, ao usar ferramentas) e múltiplos blocos de pensamento (por exemplo, com [pensamento intercalado](/docs/pt-BR/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**A edição de contexto acontece do lado do servidor**

A edição de contexto é aplicada **do lado do servidor** antes do prompt chegar ao Claude. Sua aplicação cliente mantém o histórico completo e não modificado da conversa—você não precisa sincronizar o estado do seu cliente com a versão editada. Continue gerenciando seu histórico completo de conversa localmente como você normalmente faria.
</Tip>

<Tip>
**Edição de contexto e cache de prompt**

A interação da edição de contexto com [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) varia por estratégia:

- **Limpeza de resultados de ferramentas**: Invalida prefixos de prompt em cache quando o conteúdo é limpo. Para levar isso em conta, recomendamos limpar tokens suficientes para tornar a invalidação de cache válida. Use o parâmetro `clear_at_least` para garantir que um número mínimo de tokens seja limpo a cada vez. Você incorrerá em custos de escrita de cache cada vez que o conteúdo for limpo, mas solicitações subsequentes podem reutilizar o prefixo recém-armazenado em cache.

- **Limpeza de blocos de pensamento**: Quando blocos de pensamento são **mantidos** em contexto (não limpos), o cache de prompt é preservado, permitindo acertos de cache e reduzindo custos de token de entrada. Quando blocos de pensamento são **limpos**, o cache é invalidado no ponto onde a limpeza ocorre. Configure o parâmetro `keep` com base em se você deseja priorizar o desempenho do cache ou a disponibilidade da janela de contexto.
</Tip>

## Visão geral

A edição de contexto permite que você gerencie automaticamente o contexto da conversa conforme ele cresce, ajudando você a otimizar custos e permanecer dentro dos limites da janela de contexto. Você pode usar estratégias de API do lado do servidor, recursos de SDK do lado do cliente ou ambos juntos.

| Abordagem | Onde é executado | Estratégias | Como funciona |
|----------|---------------|------------|--------------|
| **Lado do servidor** | API | Limpeza de resultados de ferramentas (`clear_tool_uses_20250919`)<br/>Limpeza de blocos de pensamento (`clear_thinking_20251015`) | Aplicado antes do prompt chegar ao Claude. Limpa conteúdo específico do histórico de conversa. Cada estratégia pode ser configurada independentemente. |
| **Lado do cliente** | SDK | Compactação | Disponível em [SDKs Python e TypeScript](/docs/pt-BR/api/client-sdks) ao usar [`tool_runner`](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Gera um resumo e substitui o histórico completo de conversa. Veja [Compactação](#client-side-compaction-sdk) abaixo. |

## Estratégias do lado do servidor

<Note>
A edição de contexto está atualmente em beta com suporte para limpeza de resultados de ferramentas e limpeza de blocos de pensamento. Para ativá-la, use o cabeçalho beta `context-management-2025-06-27` em suas solicitações de API.

Entre em contato através do nosso [formulário de feedback](https://forms.gle/YXC2EKGMhjN1c4L88) para compartilhar seu feedback sobre este recurso.
</Note>

### Limpeza de resultados de ferramentas

A estratégia `clear_tool_uses_20250919` limpa resultados de ferramentas quando o contexto da conversa cresce além do seu limite configurado. Quando ativada, a API limpa automaticamente os resultados de ferramentas mais antigos em ordem cronológica, substituindo-os por texto de espaço reservado para informar ao Claude que o resultado da ferramenta foi removido. Por padrão, apenas os resultados de ferramentas são limpos. Você pode opcionalmente limpar tanto os resultados de ferramentas quanto as chamadas de ferramentas (os parâmetros de uso de ferramentas) definindo `clear_tool_inputs` como true.

### Limpeza de blocos de pensamento

A estratégia `clear_thinking_20251015` gerencia blocos `thinking` em conversas quando o pensamento estendido está ativado. Esta estratégia limpa automaticamente blocos de pensamento mais antigos de turnos anteriores.

<Tip>
**Comportamento padrão**: Quando o pensamento estendido está ativado sem configurar a estratégia `clear_thinking_20251015`, a API mantém automaticamente apenas os blocos de pensamento do último turno do assistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Para maximizar acertos de cache, preserve todos os blocos de pensamento definindo `keep: "all"`.
</Tip>

<Note>
Um turno de conversa do assistente pode incluir múltiplos blocos de conteúdo (por exemplo, ao usar ferramentas) e múltiplos blocos de pensamento (por exemplo, com [pensamento intercalado](/docs/pt-BR/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**A edição de contexto acontece do lado do servidor**

A edição de contexto é aplicada **do lado do servidor** antes do prompt chegar ao Claude. Sua aplicação cliente mantém o histórico completo e não modificado da conversa—você não precisa sincronizar o estado do seu cliente com a versão editada. Continue gerenciando seu histórico completo de conversa localmente como você normalmente faria.
</Tip>

<Tip>
**Edição de contexto e cache de prompt**

A interação da edição de contexto com [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) varia por estratégia:

- **Limpeza de resultados de ferramentas**: Invalida prefixos de prompt em cache quando o conteúdo é limpo. Para levar isso em conta, recomendamos limpar tokens suficientes para tornar a invalidação de cache válida. Use o parâmetro `clear_at_least` para garantir que um número mínimo de tokens seja limpo a cada vez. Você incorrerá em custos de escrita de cache cada vez que o conteúdo for limpo, mas solicitações subsequentes podem reutilizar o prefixo recém-armazenado em cache.

- **Limpeza de blocos de pensamento**: Quando blocos de pensamento são **mantidos** em contexto (não limpos), o cache de prompt é preservado, permitindo acertos de cache e reduzindo custos de token de entrada. Quando blocos de pensamento são **limpos**, o cache é invalidado no ponto onde a limpeza ocorre. Configure o parâmetro `keep` com base em se você deseja priorizar o desempenho do cache ou a disponibilidade da janela de contexto.
</Tip>

## Modelos suportados

A edição de contexto está disponível em:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Visão geral

A edição de contexto permite que você gerencie automaticamente o contexto da conversa conforme ele cresce, ajudando você a otimizar custos e permanecer dentro dos limites da janela de contexto. Você pode usar estratégias de API do lado do servidor, recursos de SDK do lado do cliente ou ambos juntos.

| Abordagem | Onde é executado | Estratégias | Como funciona |
|----------|---------------|------------|--------------|
| **Lado do servidor** | API | Limpeza de resultados de ferramentas (`clear_tool_uses_20250919`)<br/>Limpeza de blocos de pensamento (`clear_thinking_20251015`) | Aplicado antes do prompt chegar ao Claude. Limpa conteúdo específico do histórico de conversa. Cada estratégia pode ser configurada independentemente. |
| **Lado do cliente** | SDK | Compactação | Disponível em [SDKs Python e TypeScript](/docs/pt-BR/api/client-sdks) ao usar [`tool_runner`](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Gera um resumo e substitui o histórico completo de conversa. Veja [Compactação](#client-side-compaction-sdk) abaixo. |

## Estratégias do lado do servidor

<Note>
A edição de contexto está atualmente em beta com suporte para limpeza de resultados de ferramentas e limpeza de blocos de pensamento. Para ativá-la, use o cabeçalho beta `context-management-2025-06-27` em suas solicitações de API.

Entre em contato através do nosso [formulário de feedback](https://forms.gle/YXC2EKGMhjN1c4L88) para compartilhar seu feedback sobre este recurso.
</Note>

### Limpeza de resultados de ferramentas

A estratégia `clear_tool_uses_20250919` limpa resultados de ferramentas quando o contexto da conversa cresce além do seu limite configurado. Quando ativada, a API limpa automaticamente os resultados de ferramentas mais antigos em ordem cronológica, substituindo-os por texto de espaço reservado para informar ao Claude que o resultado da ferramenta foi removido. Por padrão, apenas os resultados de ferramentas são limpos. Você pode opcionalmente limpar tanto os resultados de ferramentas quanto as chamadas de ferramentas (os parâmetros de uso de ferramentas) definindo `clear_tool_inputs` como true.

### Limpeza de blocos de pensamento

A estratégia `clear_thinking_20251015` gerencia blocos `thinking` em conversas quando o pensamento estendido está ativado. Esta estratégia limpa automaticamente blocos de pensamento mais antigos de turnos anteriores.

<Tip>
**Comportamento padrão**: Quando o pensamento estendido está ativado sem configurar a estratégia `clear_thinking_20251015`, a API mantém automaticamente apenas os blocos de pensamento do último turno do assistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Para maximizar acertos de cache, preserve todos os blocos de pensamento definindo `keep: "all"`.
</Tip>

<Note>
Um turno de conversa do assistente pode incluir múltiplos blocos de conteúdo (por exemplo, ao usar ferramentas) e múltiplos blocos de pensamento (por exemplo, com [pensamento intercalado](/docs/pt-BR/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**A edição de contexto acontece do lado do servidor**

A edição de contexto é aplicada **do lado do servidor** antes do prompt chegar ao Claude. Sua aplicação cliente mantém o histórico completo e não modificado da conversa—você não precisa sincronizar o estado do seu cliente com a versão editada. Continue gerenciando seu histórico completo de conversa localmente como você normalmente faria.
</Tip>

<Tip>
**Edição de contexto e cache de prompt**

A interação da edição de contexto com [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) varia por estratégia:

- **Limpeza de resultados de ferramentas**: Invalida prefixos de prompt em cache quando o conteúdo é limpo. Para levar isso em conta, recomendamos limpar tokens suficientes para tornar a invalidação de cache válida. Use o parâmetro `clear_at_least` para garantir que um número mínimo de tokens seja limpo a cada vez. Você incorrerá em custos de escrita de cache cada vez que o conteúdo for limpo, mas solicitações subsequentes podem reutilizar o prefixo recém-armazenado em cache.

- **Limpeza de blocos de pensamento**: Quando blocos de pensamento são **mantidos** em contexto (não limpos), o cache de prompt é preservado, permitindo acertos de cache e reduzindo custos de token de entrada. Quando blocos de pensamento são **limpos**, o cache é invalidado no ponto onde a limpeza ocorre. Configure o parâmetro `keep` com base em se você deseja priorizar o desempenho do cache ou a disponibilidade da janela de contexto.
</Tip>

## Modelos suportados

A edição de contexto está disponível em:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Uso de limpeza de resultados de ferramentas

A forma mais simples de ativar a limpeza de resultados de ferramentas é especificar apenas o tipo de estratégia, pois todas as outras [opções de configuração](#configuration-options-for-tool-result-clearing) usarão seus valores padrão:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## Visão geral

A edição de contexto permite que você gerencie automaticamente o contexto da conversa conforme ele cresce, ajudando você a otimizar custos e permanecer dentro dos limites da janela de contexto. Você pode usar estratégias de API do lado do servidor, recursos de SDK do lado do cliente ou ambos juntos.

| Abordagem | Onde é executado | Estratégias | Como funciona |
|----------|---------------|------------|--------------|
| **Lado do servidor** | API | Limpeza de resultados de ferramentas (`clear_tool_uses_20250919`)<br/>Limpeza de blocos de pensamento (`clear_thinking_20251015`) | Aplicado antes do prompt chegar ao Claude. Limpa conteúdo específico do histórico de conversa. Cada estratégia pode ser configurada independentemente. |
| **Lado do cliente** | SDK | Compactação | Disponível em [SDKs Python e TypeScript](/docs/pt-BR/api/client-sdks) ao usar [`tool_runner`](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Gera um resumo e substitui o histórico completo de conversa. Veja [Compactação](#client-side-compaction-sdk) abaixo. |

## Estratégias do lado do servidor

<Note>
A edição de contexto está atualmente em beta com suporte para limpeza de resultados de ferramentas e limpeza de blocos de pensamento. Para ativá-la, use o cabeçalho beta `context-management-2025-06-27` em suas solicitações de API.

Entre em contato através do nosso [formulário de feedback](https://forms.gle/YXC2EKGMhjN1c4L88) para compartilhar seu feedback sobre este recurso.
</Note>

### Limpeza de resultados de ferramentas

A estratégia `clear_tool_uses_20250919` limpa resultados de ferramentas quando o contexto da conversa cresce além do seu limite configurado. Quando ativada, a API limpa automaticamente os resultados de ferramentas mais antigos em ordem cronológica, substituindo-os por texto de espaço reservado para informar ao Claude que o resultado da ferramenta foi removido. Por padrão, apenas os resultados de ferramentas são limpos. Você pode opcionalmente limpar tanto os resultados de ferramentas quanto as chamadas de ferramentas (os parâmetros de uso de ferramentas) definindo `clear_tool_inputs` como true.

### Limpeza de blocos de pensamento

A estratégia `clear_thinking_20251015` gerencia blocos `thinking` em conversas quando o pensamento estendido está ativado. Esta estratégia limpa automaticamente blocos de pensamento mais antigos de turnos anteriores.

<Tip>
**Comportamento padrão**: Quando o pensamento estendido está ativado sem configurar a estratégia `clear_thinking_20251015`, a API mantém automaticamente apenas os blocos de pensamento do último turno do assistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Para maximizar acertos de cache, preserve todos os blocos de pensamento definindo `keep: "all"`.
</Tip>

<Note>
Um turno de conversa do assistente pode incluir múltiplos blocos de conteúdo (por exemplo, ao usar ferramentas) e múltiplos blocos de pensamento (por exemplo, com [pensamento intercalado](/docs/pt-BR/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**A edição de contexto acontece do lado do servidor**

A edição de contexto é aplicada **do lado do servidor** antes do prompt chegar ao Claude. Sua aplicação cliente mantém o histórico completo e não modificado da conversa—você não precisa sincronizar o estado do seu cliente com a versão editada. Continue gerenciando seu histórico completo de conversa localmente como você normalmente faria.
</Tip>

<Tip>
**Edição de contexto e cache de prompt**

A interação da edição de contexto com [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) varia por estratégia:

- **Limpeza de resultados de ferramentas**: Invalida prefixos de prompt em cache quando o conteúdo é limpo. Para levar isso em conta, recomendamos limpar tokens suficientes para tornar a invalidação de cache válida. Use o parâmetro `clear_at_least` para garantir que um número mínimo de tokens seja limpo a cada vez. Você incorrerá em custos de escrita de cache cada vez que o conteúdo for limpo, mas solicitações subsequentes podem reutilizar o prefixo recém-armazenado em cache.

- **Limpeza de blocos de pensamento**: Quando blocos de pensamento são **mantidos** em contexto (não limpos), o cache de prompt é preservado, permitindo acertos de cache e reduzindo custos de token de entrada. Quando blocos de pensamento são **limpos**, o cache é invalidado no ponto onde a limpeza ocorre. Configure o parâmetro `keep` com base em se você deseja priorizar o desempenho do cache ou a disponibilidade da janela de contexto.
</Tip>

## Modelos suportados

A edição de contexto está disponível em:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Uso de limpeza de resultados de ferramentas

A forma mais simples de ativar a limpeza de resultados de ferramentas é especificar apenas o tipo de estratégia, pois todas as outras [opções de configuração](#configuration-options-for-tool-result-clearing) usarão seus valores padrão:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Configuração avançada

Você pode personalizar o comportamento de limpeza de resultados de ferramentas com parâmetros adicionais:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Visão geral

A edição de contexto permite que você gerencie automaticamente o contexto da conversa conforme ele cresce, ajudando você a otimizar custos e permanecer dentro dos limites da janela de contexto. Você pode usar estratégias de API do lado do servidor, recursos de SDK do lado do cliente ou ambos juntos.

| Abordagem | Onde é executado | Estratégias | Como funciona |
|----------|---------------|------------|--------------|
| **Lado do servidor** | API | Limpeza de resultados de ferramentas (`clear_tool_uses_20250919`)<br/>Limpeza de blocos de pensamento (`clear_thinking_20251015`) | Aplicado antes do prompt chegar ao Claude. Limpa conteúdo específico do histórico de conversa. Cada estratégia pode ser configurada independentemente. |
| **Lado do cliente** | SDK | Compactação | Disponível em [SDKs Python e TypeScript](/docs/pt-BR/api/client-sdks) ao usar [`tool_runner`](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Gera um resumo e substitui o histórico completo de conversa. Veja [Compactação](#client-side-compaction-sdk) abaixo. |

## Estratégias do lado do servidor

<Note>
A edição de contexto está atualmente em beta com suporte para limpeza de resultados de ferramentas e limpeza de blocos de pensamento. Para habilitá-la, use o cabeçalho beta `context-management-2025-06-27` em suas solicitações de API.

Entre em contato através do nosso [formulário de feedback](https://forms.gle/YXC2EKGMhjN1c4L88) para compartilhar seus comentários sobre este recurso.
</Note>

### Limpeza de resultados de ferramentas

A estratégia `clear_tool_uses_20250919` limpa resultados de ferramentas quando o contexto da conversa cresce além do seu limite configurado. Quando ativada, a API limpa automaticamente os resultados de ferramentas mais antigos em ordem cronológica, substituindo-os por texto de espaço reservado para informar ao Claude que o resultado da ferramenta foi removido. Por padrão, apenas os resultados de ferramentas são limpos. Você pode opcionalmente limpar tanto os resultados de ferramentas quanto as chamadas de ferramentas (os parâmetros de uso de ferramentas) definindo `clear_tool_inputs` como true.

### Limpeza de blocos de pensamento

A estratégia `clear_thinking_20251015` gerencia blocos `thinking` em conversas quando o pensamento estendido está habilitado. Esta estratégia limpa automaticamente blocos de pensamento mais antigos de turnos anteriores.

<Tip>
**Comportamento padrão**: Quando o pensamento estendido está habilitado sem configurar a estratégia `clear_thinking_20251015`, a API mantém automaticamente apenas os blocos de pensamento do último turno do assistente (equivalente a `keep: {type: "thinking_turns", value: 1}`).

Para maximizar acertos de cache, preserve todos os blocos de pensamento definindo `keep: "all"`.
</Tip>

<Note>
Um turno de conversa do assistente pode incluir múltiplos blocos de conteúdo (por exemplo, ao usar ferramentas) e múltiplos blocos de pensamento (por exemplo, com [pensamento intercalado](/docs/pt-BR/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**A edição de contexto acontece do lado do servidor**

A edição de contexto é aplicada **do lado do servidor** antes do prompt chegar ao Claude. Sua aplicação cliente mantém o histórico completo e não modificado da conversa—você não precisa sincronizar o estado do seu cliente com a versão editada. Continue gerenciando seu histórico completo de conversa localmente como você normalmente faria.
</Tip>

<Tip>
**Edição de contexto e cache de prompt**

A interação da edição de contexto com [cache de prompt](/docs/pt-BR/build-with-claude/prompt-caching) varia por estratégia:

- **Limpeza de resultados de ferramentas**: Invalida prefixos de prompt em cache quando o conteúdo é limpo. Para levar isso em conta, recomendamos limpar tokens suficientes para tornar a invalidação de cache valiosa. Use o parâmetro `clear_at_least` para garantir que um número mínimo de tokens seja limpo a cada vez. Você incorrerá em custos de escrita de cache cada vez que o conteúdo for limpo, mas solicitações subsequentes podem reutilizar o prefixo recém-armazenado em cache.

- **Limpeza de blocos de pensamento**: Quando blocos de pensamento são **mantidos** no contexto (não limpos), o cache de prompt é preservado, permitindo acertos de cache e reduzindo custos de token de entrada. Quando blocos de pensamento são **limpos**, o cache é invalidado no ponto onde a limpeza ocorre. Configure o parâmetro `keep` com base em se você deseja priorizar o desempenho do cache ou a disponibilidade da janela de contexto.
</Tip>

## Modelos suportados

A edição de contexto está disponível em:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Uso de limpeza de resultados de ferramentas

A forma mais simples de habilitar a limpeza de resultados de ferramentas é especificar apenas o tipo de estratégia, pois todas as outras [opções de configuração](#configuration-options-for-tool-result-clearing) usarão seus valores padrão:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### Configuração avançada

Você pode personalizar o comportamento de limpeza de resultados de ferramentas com parâmetros adicionais:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## Uso de limpeza de blocos de pensamento

Habilite a limpeza de blocos de pensamento para gerenciar contexto e cache de prompt efetivamente quando o pensamento estendido está habilitado:

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [...],
        "thinking": {
            "type": "enabled",
            "budget_tokens": 10000
        },
        "context_management": {
            "edits": [
                {
                    "type": "clear_thinking_20251015",
                    "keep": {
                        "type": "thinking_turns",
                        "value": 2
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      }
    ]
  }
});
```

</CodeGroup>

### Opções de configuração para limpeza de blocos de pensamento

A estratégia `clear_thinking_20251015` suporta a seguinte configuração:

| Opção de configuração | Padrão | Descrição |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Define quantos turnos recentes do assistente com blocos de pensamento preservar. Use `{type: "thinking_turns", value: N}` onde N deve ser > 0 para manter os últimos N turnos, ou `"all"` para manter todos os blocos de pensamento. |

**Exemplos de configuração:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Opções de configuração para limpeza de blocos de pensamento

A estratégia `clear_thinking_20251015` suporta a seguinte configuração:

| Opção de configuração | Padrão | Descrição |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Define quantos turnos recentes do assistente com blocos de pensamento preservar. Use `{type: "thinking_turns", value: N}` onde N deve ser > 0 para manter os últimos N turnos, ou `"all"` para manter todos os blocos de pensamento. |

**Exemplos de configuração:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinando estratégias

Você pode usar limpeza de blocos de pensamento e limpeza de resultados de ferramentas juntas:

<Note>
Ao usar múltiplas estratégias, a estratégia `clear_thinking_20251015` deve ser listada primeiro no array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

### Opções de configuração para limpeza de blocos de pensamento

A estratégia `clear_thinking_20251015` suporta a seguinte configuração:

| Opção de configuração | Padrão | Descrição |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Define quantos turnos recentes do assistente com blocos de pensamento preservar. Use `{type: "thinking_turns", value: N}` onde N deve ser > 0 para manter os últimos N turnos, ou `"all"` para manter todos os blocos de pensamento. |

**Exemplos de configuração:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinando estratégias

Você pode usar limpeza de blocos de pensamento e limpeza de resultados de ferramentas juntas:

<Note>
Ao usar múltiplas estratégias, a estratégia `clear_thinking_20251015` deve ser listada primeiro no array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opções de configuração para limpeza de resultados de ferramentas

| Opção de configuração | Padrão | Descrição |
|---------------------|---------|-------------|
| `trigger` | 100.000 tokens de entrada | Define quando a estratégia de edição de contexto é ativada. Uma vez que o prompt exceda este limite, a limpeza começará. Você pode especificar este valor em `input_tokens` ou `tool_uses`. |
| `keep` | 3 usos de ferramentas | Define quantos pares recentes de uso/resultado de ferramentas manter após a limpeza ocorrer. A API remove as interações de ferramentas mais antigas primeiro, preservando as mais recentes. |
| `clear_at_least` | Nenhum | Garante que um número mínimo de tokens seja limpo cada vez que a estratégia é ativada. Se a API não conseguir limpar pelo menos a quantidade especificada, a estratégia não será aplicada. Isso ajuda a determinar se a limpeza de contexto vale a pena quebrar seu cache de prompt. |
| `exclude_tools` | Nenhum | Lista de nomes de ferramentas cujos usos e resultados de ferramentas nunca devem ser limpos. Útil para preservar contexto importante. |
| `clear_tool_inputs` | `false` | Controla se os parâmetros de chamada de ferramenta são limpos junto com os resultados de ferramentas. Por padrão, apenas os resultados de ferramentas são limpos enquanto as chamadas de ferramentas originais do Claude permanecem visíveis. |

### Opções de configuração para limpeza de blocos de pensamento

A estratégia `clear_thinking_20251015` suporta a seguinte configuração:

| Opção de configuração | Padrão | Descrição |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Define quantos turnos recentes do assistente com blocos de pensamento preservar. Use `{type: "thinking_turns", value: N}` onde N deve ser > 0 para manter os últimos N turnos, ou `"all"` para manter todos os blocos de pensamento. |

**Exemplos de configuração:**

```json
// Keep thinking blocks from the last 3 assistant turns
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Keep all thinking blocks (maximizes cache hits)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinando estratégias

Você pode usar limpeza de blocos de pensamento e limpeza de resultados de ferramentas juntas:

<Note>
Ao usar múltiplas estratégias, a estratégia `clear_thinking_20251015` deve ser listada primeiro no array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Resposta de edição de contexto

Você pode ver quais edições de contexto foram aplicadas à sua solicitação usando o campo de resposta `context_management`, junto com estatísticas úteis sobre o conteúdo e tokens de entrada limpos.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // When using `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // When using `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Para respostas de streaming, as edições de contexto serão incluídas no evento final `message_delta`:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

### Opções de configuração para limpeza de bloco de pensamento

A estratégia `clear_thinking_20251015` suporta a seguinte configuração:

| Opção de configuração | Padrão | Descrição |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Define quantas voltas recentes do assistente com blocos de pensamento devem ser preservadas. Use `{type: "thinking_turns", value: N}` onde N deve ser > 0 para manter as últimas N voltas, ou `"all"` para manter todos os blocos de pensamento. |

**Exemplos de configuração:**

```json
// Manter blocos de pensamento das últimas 3 voltas do assistente
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Manter todos os blocos de pensamento (maximiza acertos de cache)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Combinando estratégias

Você pode usar limpeza de bloco de pensamento e limpeza de resultado de ferramenta juntas:

<Note>
Ao usar múltiplas estratégias, a estratégia `clear_thinking_20251015` deve ser listada primeiro no array `edits`.
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## Opções de configuração para limpeza de resultado de ferramenta

| Opção de configuração | Padrão | Descrição |
|---------------------|---------|-------------|
| `trigger` | 100.000 tokens de entrada | Define quando a estratégia de edição de contexto é ativada. Uma vez que o prompt exceda este limite, a limpeza começará. Você pode especificar este valor em `input_tokens` ou `tool_uses`. |
| `keep` | 3 usos de ferramenta | Define quantos pares recentes de uso/resultado de ferramenta devem ser mantidos após a limpeza ocorrer. A API remove as interações de ferramenta mais antigas primeiro, preservando as mais recentes. |
| `clear_at_least` | Nenhum | Garante um número mínimo de tokens limpos cada vez que a estratégia é ativada. Se a API não conseguir limpar pelo menos a quantidade especificada, a estratégia não será aplicada. Isso ajuda a determinar se a limpeza de contexto vale a pena quebrar seu cache de prompt. |
| `exclude_tools` | Nenhum | Lista de nomes de ferramentas cujos usos e resultados de ferramentas nunca devem ser limpos. Útil para preservar contexto importante. |
| `clear_tool_inputs` | `false` | Controla se os parâmetros de chamada de ferramenta são limpos junto com os resultados da ferramenta. Por padrão, apenas os resultados da ferramenta são limpos enquanto as chamadas de ferramenta originais do Claude permanecem visíveis. |

## Resposta de edição de contexto

Você pode ver quais edições de contexto foram aplicadas à sua solicitação usando o campo de resposta `context_management`, juntamente com estatísticas úteis sobre o conteúdo e tokens de entrada limpos.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // Ao usar `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // Ao usar `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Para respostas de streaming, as edições de contexto serão incluídas no evento final `message_delta`:

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

## Contagem de tokens

O endpoint de [contagem de tokens](/docs/pt-BR/build-with-claude/token-counting) suporta gerenciamento de contexto, permitindo que você visualize quantos tokens seu prompt usará após a edição de contexto ser aplicada.

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "messages": [
            {
                "role": "user",
                "content": "Continue our conversation..."
            }
        ],
        "tools": [...],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 5
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "user",
            "content": "Continue our conversation..."
        }
    ],
    tools=[...],  # Your tool definitions
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)

print(f"Original tokens: {response.context_management['original_input_tokens']}")
print(f"After clearing: {response.input_tokens}")
print(f"Savings: {response.context_management['original_input_tokens'] - response.input_tokens} tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.countTokens({
  model: "claude-sonnet-4-5",
  messages: [
    {
      role: "user",
      content: "Continue our conversation..."
    }
  ],
  tools: [...],  // Your tool definitions
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});

console.log(`Original tokens: ${response.context_management?.original_input_tokens}`);
console.log(`After clearing: ${response.input_tokens}`);
console.log(`Savings: ${(response.context_management?.original_input_tokens || 0) - response.input_tokens} tokens`);
```
</CodeGroup>

```json Response
{
    "input_tokens": 25000,
    "context_management": {
        "original_input_tokens": 70000
    }
}
```

A resposta mostra tanto a contagem final de tokens após o gerenciamento de contexto ser aplicado (`input_tokens`) quanto a contagem original de tokens antes de qualquer limpeza ocorrer (`original_input_tokens`).

## Usando com a Ferramenta de Memória

A edição de contexto pode ser combinada com a [ferramenta de memória](/docs/pt-BR/agents-and-tools/tool-use/memory-tool). Quando o contexto da sua conversa se aproxima do limite de limpeza configurado, Claude recebe um aviso automático para preservar informações importantes. Isso permite que Claude salve resultados de ferramentas ou contexto em seus arquivos de memória antes de serem limpos do histórico de conversa.

Esta combinação permite que você:

- **Preserve contexto importante**: Claude pode escrever informações essenciais dos resultados de ferramentas em arquivos de memória antes que esses resultados sejam limpos
- **Mantenha fluxos de trabalho de longa duração**: Habilite fluxos de trabalho agênticos que de outra forma excederiam limites de contexto ao descarregar informações para armazenamento persistente
- **Acesse informações sob demanda**: Claude pode procurar informações previamente limpas em arquivos de memória quando necessário, em vez de manter tudo na janela de contexto ativa

Por exemplo, em um fluxo de trabalho de edição de arquivo onde Claude realiza muitas operações, Claude pode resumir alterações concluídas em arquivos de memória conforme o contexto cresce. Quando os resultados de ferramentas são limpos, Claude retém acesso a essas informações através de seu sistema de memória e pode continuar trabalhando efetivamente.

Para usar ambos os recursos juntos, habilite-os em sua solicitação de API:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Compactação do lado do cliente (SDK)

<Note>
A compactação está disponível nos [SDKs Python e TypeScript](/docs/pt-BR/api/client-sdks) ao usar o método [`tool_runner`](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

Compactação é um recurso do SDK que gerencia automaticamente o contexto da conversa gerando resumos quando o uso de tokens fica muito grande. Diferentemente das estratégias de edição de contexto do lado do servidor que limpam conteúdo, a compactação instrui Claude a resumir o histórico de conversa, depois substitui o histórico completo por esse resumo. Isso permite que Claude continue trabalhando em tarefas de longa duração que de outra forma excederiam a [janela de contexto](/docs/pt-BR/build-with-claude/context-windows).

### Como a compactação funciona

Quando a compactação está habilitada, o SDK monitora o uso de tokens após cada resposta do modelo:

1. **Verificação de limite**: O SDK calcula tokens totais como `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Geração de resumo**: Quando o limite é excedido, um prompt de resumo é injetado como uma volta do usuário, e Claude gera um resumo estruturado envolvido em tags `<summary></summary>`
3. **Substituição de contexto**: O SDK extrai o resumo e substitui todo o histórico de mensagens por ele
4. **Continuação**: A conversa retoma a partir do resumo, com Claude continuando de onde parou

### Usando compactação

Adicione `compaction_control` à sua chamada `tool_runner`:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### O que acontece durante a compactação

Conforme a conversa cresce, o histórico de mensagens se acumula:

**Antes da compactação (aproximando-se de 100k tokens):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Quando os tokens excedem o limite, o SDK injeta uma solicitação de resumo e Claude gera um resumo. Todo o histórico é então substituído:

**Após compactação (voltando a ~2-3k tokens):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude continua trabalhando a partir deste resumo como se fosse o histórico de conversa original.

### Opções de configuração

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Sim | - | Se deve habilitar compactação automática |
| `context_token_threshold` | number | Não | 100.000 | Contagem de tokens em que a compactação é acionada |
| `model` | string | Não | Mesmo modelo principal | Modelo a usar para gerar resumos |
| `summary_prompt` | string | Não | Veja abaixo | Prompt customizado para geração de resumo |

#### Escolhendo um limite de tokens

O limite determina quando a compactação ocorre. Um limite mais baixo significa compactações mais frequentes com janelas de contexto menores. Um limite mais alto permite mais contexto, mas corre o risco de atingir limites.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Usando um modelo diferente para resumos

Você pode usar um modelo mais rápido ou mais barato para gerar resumos:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Prompts de resumo customizados

Você pode fornecer um prompt customizado para necessidades específicas de domínio. Seu prompt deve instruir Claude a envolver seu resumo em tags `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

## Usando com a Ferramenta de Memória

A edição de contexto pode ser combinada com a [ferramenta de memória](/docs/pt-BR/agents-and-tools/tool-use/memory-tool). Quando o contexto da sua conversa se aproxima do limite de limpeza configurado, Claude recebe um aviso automático para preservar informações importantes. Isso permite que Claude salve resultados de ferramentas ou contexto em seus arquivos de memória antes de serem limpos do histórico de conversa.

Essa combinação permite que você:

- **Preserve contexto importante**: Claude pode escrever informações essenciais dos resultados de ferramentas em arquivos de memória antes que esses resultados sejam limpos
- **Mantenha fluxos de trabalho de longa duração**: Ative fluxos de trabalho de agentes que de outra forma excederiam os limites de contexto ao descarregar informações para armazenamento persistente
- **Acesse informações sob demanda**: Claude pode procurar informações previamente limpas em arquivos de memória quando necessário, em vez de manter tudo na janela de contexto ativa

Por exemplo, em um fluxo de trabalho de edição de arquivo onde Claude realiza muitas operações, Claude pode resumir alterações concluídas em arquivos de memória conforme o contexto cresce. Quando os resultados das ferramentas são limpos, Claude mantém acesso a essas informações através de seu sistema de memória e pode continuar trabalhando efetivamente.

Para usar ambos os recursos juntos, ative-os em sua solicitação de API:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## Compactação do lado do cliente (SDK)

<Note>
A compactação está disponível nos [SDKs Python e TypeScript](/docs/pt-BR/api/client-sdks) ao usar o [método `tool_runner`](/docs/pt-BR/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta).
</Note>

A compactação é um recurso do SDK que gerencia automaticamente o contexto da conversa gerando resumos quando o uso de tokens fica muito grande. Ao contrário das estratégias de edição de contexto do lado do servidor que limpam conteúdo, a compactação instrui Claude a resumir o histórico de conversa, depois substitui o histórico completo por esse resumo. Isso permite que Claude continue trabalhando em tarefas de longa duração que de outra forma excederiam a [janela de contexto](/docs/pt-BR/build-with-claude/context-windows).

### Como a compactação funciona

Quando a compactação está ativada, o SDK monitora o uso de tokens após cada resposta do modelo:

1. **Verificação de limite**: O SDK calcula o total de tokens como `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Geração de resumo**: Quando o limite é excedido, um prompt de resumo é injetado como um turno do usuário, e Claude gera um resumo estruturado envolvido em tags `<summary></summary>`
3. **Substituição de contexto**: O SDK extrai o resumo e substitui todo o histórico de mensagens por ele
4. **Continuação**: A conversa retoma a partir do resumo, com Claude continuando de onde parou

### Usando compactação

Adicione `compaction_control` à sua chamada `tool_runner`:

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### O que acontece durante a compactação

Conforme a conversa cresce, o histórico de mensagens se acumula:

**Antes da compactação (aproximando-se de 100k tokens):**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

Quando os tokens excedem o limite, o SDK injeta uma solicitação de resumo e Claude gera um resumo. Todo o histórico é então substituído:

**Após compactação (voltando para ~2-3k tokens):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude continua trabalhando a partir deste resumo como se fosse o histórico de conversa original.

### Opções de configuração

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Sim | - | Se deve ativar a compactação automática |
| `context_token_threshold` | number | Não | 100,000 | Contagem de tokens em que a compactação é acionada |
| `model` | string | Não | Mesmo modelo principal | Modelo a usar para gerar resumos |
| `summary_prompt` | string | Não | Veja abaixo | Prompt personalizado para geração de resumo |

#### Escolhendo um limite de tokens

O limite determina quando a compactação ocorre. Um limite mais baixo significa compactações mais frequentes com janelas de contexto menores. Um limite mais alto permite mais contexto, mas corre o risco de atingir limites.

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Usando um modelo diferente para resumos

Você pode usar um modelo mais rápido ou mais barato para gerar resumos:

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### Prompts de resumo personalizados

Você pode fornecer um prompt personalizado para necessidades específicas de domínio. Seu prompt deve instruir Claude a envolver seu resumo em tags `<summary></summary>`.

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

### Prompt de resumo padrão

O prompt de resumo integrado instrui Claude a criar um resumo de continuação estruturado incluindo:

1. **Visão Geral da Tarefa**: A solicitação principal do usuário, critérios de sucesso e restrições
2. **Estado Atual**: O que foi concluído, arquivos modificados e artefatos produzidos
3. **Descobertas Importantes**: Restrições técnicas, decisões tomadas, erros resolvidos e abordagens que falharam
4. **Próximas Etapas**: Ações específicas necessárias, bloqueadores e ordem de prioridade
5. **Contexto a Preservar**: Preferências do usuário, detalhes específicos do domínio e compromissos feitos

Essa estrutura permite que Claude retome o trabalho de forma eficiente sem perder contexto importante ou repetir erros.

<section title="View full default prompt">

```
You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:

1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified

2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced

3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)

4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain

5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user

Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.

Wrap your summary in <summary></summary> tags.
```

</section>

### Limitações

#### Ferramentas do lado do servidor

<Warning>
A compactação requer consideração especial ao usar ferramentas do lado do servidor, como [busca na web](/docs/pt-BR/agents-and-tools/tool-use/web-search-tool) ou [busca na web](/docs/pt-BR/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Ao usar ferramentas do lado do servidor, o SDK pode calcular incorretamente o uso de tokens, causando a compactação ser acionada no momento errado.

Por exemplo, após uma operação de busca na web, a resposta da API pode mostrar:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

O SDK calcula o uso total como 63.000 + 270.000 = 333.000 tokens. No entanto, o valor `cache_read_input_tokens` inclui leituras acumuladas de múltiplas chamadas internas de API feitas pela ferramenta do lado do servidor, não seu contexto de conversa real. Seu comprimento de contexto real pode ser apenas os 63.000 `input_tokens`, mas o SDK vê 333k e aciona a compactação prematuramente.

**Soluções alternativas:**

- Use o endpoint de [contagem de tokens](/docs/pt-BR/build-with-claude/token-counting) para obter o comprimento de contexto preciso
- Evite compactação ao usar ferramentas do lado do servidor extensivamente

#### Casos extremos de uso de ferramentas

Quando a compactação é acionada enquanto uma resposta de uso de ferramenta está pendente, o SDK remove o bloco de uso de ferramenta do histórico de mensagens antes de gerar o resumo. Claude reabrirá a chamada de ferramenta após retomar do resumo se ainda for necessário.

### Monitorando compactação

Ative o registro para rastrear quando a compactação ocorre:

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### Quando usar compactação

**Bons casos de uso:**

- Tarefas de agente de longa duração que processam muitos arquivos ou fontes de dados
- Fluxos de trabalho de pesquisa que acumulam grandes quantidades de informações
- Tarefas de múltiplas etapas com progresso claro e mensurável
- Tarefas que produzem artefatos (arquivos, relatórios) que persistem fora da conversa

**Casos de uso menos ideais:**

- Tarefas que requerem recall preciso de detalhes de conversa anterior
- Fluxos de trabalho usando ferramentas do lado do servidor extensivamente
- Tarefas que precisam manter estado exato em muitas variáveis