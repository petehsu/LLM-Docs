# Interface TypeScript SDK V2 (preview)

Visualização da interface simplificada do V2 TypeScript Agent SDK, com padrões de envio/recebimento baseados em sessão para conversas multi-turno.

---

<Warning>
A interface V2 é uma **visualização instável**. As APIs podem mudar com base em feedback antes de se tornarem estáveis. Alguns recursos como bifurcação de sessão estão disponíveis apenas no [SDK V1](/docs/pt-BR/agent-sdk/typescript).
</Warning>

O SDK TypeScript Claude Agent V2 remove a necessidade de geradores assíncronos e coordenação de yield. Isso torna as conversas multi-turno mais simples—em vez de gerenciar o estado do gerador entre turnos, cada turno é um ciclo separado de `send()`/`receive()`. A superfície da API se reduz a três conceitos:

- `createSession()` / `resumeSession()`: Iniciar ou continuar uma conversa
- `session.send()`: Enviar uma mensagem
- `session.receive()`: Obter a resposta

## Instalação

A interface V2 está incluída no pacote SDK existente:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Início rápido

### Prompt único

Para consultas simples de um único turno onde você não precisa manter uma sessão, use `unstable_v2_prompt()`. Este exemplo envia uma pergunta de matemática e registra a resposta:

```typescript
import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk'

const result = await unstable_v2_prompt('What is 2 + 2?', {
  model: 'claude-sonnet-4-5-20250929'
})
console.log(result.result)
```

<details>
<summary>Veja a mesma operação em V1</summary>

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'

const q = query({
  prompt: 'What is 2 + 2?',
  options: { model: 'claude-sonnet-4-5-20250929' }
})

for await (const msg of q) {
  if (msg.type === 'result') {
    console.log(msg.result)
  }
}
```

</details>

### Sessão básica

Para interações além de um único prompt, crie uma sessão. V2 separa envio e recebimento em etapas distintas:
- `send()` envia sua mensagem
- `receive()` transmite a resposta

Esta separação explícita facilita a adição de lógica entre turnos (como processar respostas antes de enviar acompanhamentos).

O exemplo abaixo cria uma sessão, envia "Hello!" para Claude e imprime a resposta de texto. Usa [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management) (TypeScript 5.2+) para fechar automaticamente a sessão quando o bloco sai. Você também pode chamar `session.close()` manualmente.

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})

await session.send('Hello!')
for await (const msg of session.receive()) {
  // Filter for assistant messages to get human-readable output
  if (msg.type === 'assistant') {
    const text = msg.message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
    console.log(text)
  }
}
```

<details>
<summary>Veja a mesma operação em V1</summary>

Em V1, tanto entrada quanto saída fluem através de um único gerador assíncrono. Para um prompt básico isso parece semelhante, mas adicionar lógica multi-turno requer reestruturação para usar um gerador de entrada.

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'

const q = query({
  prompt: 'Hello!',
  options: { model: 'claude-sonnet-4-5-20250929' }
})

for await (const msg of q) {
  if (msg.type === 'assistant') {
    const text = msg.message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
    console.log(text)
  }
}
```

</details>

### Conversa multi-turno

Sessões persistem contexto através de múltiplas trocas. Para continuar uma conversa, chame `send()` novamente na mesma sessão. Claude se lembra dos turnos anteriores.

Este exemplo faz uma pergunta de matemática e depois faz um acompanhamento que referencia a resposta anterior:

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})

// Turn 1
await session.send('What is 5 + 3?')
for await (const msg of session.receive()) {
  // Filter for assistant messages to get human-readable output
  if (msg.type === 'assistant') {
    const text = msg.message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
    console.log(text)
  }
}

// Turn 2
await session.send('Multiply that by 2')
for await (const msg of session.receive()) {
  if (msg.type === 'assistant') {
    const text = msg.message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
    console.log(text)
  }
}
```

<details>
<summary>Veja a mesma operação em V1</summary>

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'

// Must create an async iterable to feed messages
async function* createInputStream() {
  yield {
    type: 'user',
    session_id: '',
    message: { role: 'user', content: [{ type: 'text', text: 'What is 5 + 3?' }] },
    parent_tool_use_id: null
  }
  // Must coordinate when to yield next message
  yield {
    type: 'user',
    session_id: '',
    message: { role: 'user', content: [{ type: 'text', text: 'Multiply by 2' }] },
    parent_tool_use_id: null
  }
}

const q = query({
  prompt: createInputStream(),
  options: { model: 'claude-sonnet-4-5-20250929' }
})

for await (const msg of q) {
  if (msg.type === 'assistant') {
    const text = msg.message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
    console.log(text)
  }
}
```

</details>

### Retomada de sessão

Se você tiver um ID de sessão de uma interação anterior, você pode retomá-lo mais tarde. Isso é útil para fluxos de trabalho de longa duração ou quando você precisa persistir conversas entre reinicializações de aplicativo.

Este exemplo cria uma sessão, armazena seu ID, a fecha e depois retoma a conversa:

```typescript
import {
  unstable_v2_createSession,
  unstable_v2_resumeSession,
  type SDKMessage
} from '@anthropic-ai/claude-agent-sdk'

// Helper to extract text from assistant messages
function getAssistantText(msg: SDKMessage): string | null {
  if (msg.type !== 'assistant') return null
  return msg.message.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('')
}

// Create initial session and have a conversation
const session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})

await session.send('Remember this number: 42')

// Get the session ID from any received message
let sessionId: string | undefined
for await (const msg of session.receive()) {
  sessionId = msg.session_id
  const text = getAssistantText(msg)
  if (text) console.log('Initial response:', text)
}

console.log('Session ID:', sessionId)
session.close()

// Later: resume the session using the stored ID
await using resumedSession = unstable_v2_resumeSession(sessionId!, {
  model: 'claude-sonnet-4-5-20250929'
})

await resumedSession.send('What number did I ask you to remember?')
for await (const msg of resumedSession.receive()) {
  const text = getAssistantText(msg)
  if (text) console.log('Resumed response:', text)
}
```

<details>
<summary>Veja a mesma operação em V1</summary>

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk'

// Create initial session
const initialQuery = query({
  prompt: 'Remember this number: 42',
  options: { model: 'claude-sonnet-4-5-20250929' }
})

// Get session ID from any message
let sessionId: string | undefined
for await (const msg of initialQuery) {
  sessionId = msg.session_id
  if (msg.type === 'assistant') {
    const text = msg.message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
    console.log('Initial response:', text)
  }
}

console.log('Session ID:', sessionId)

// Later: resume the session
const resumedQuery = query({
  prompt: 'What number did I ask you to remember?',
  options: {
    model: 'claude-sonnet-4-5-20250929',
    resume: sessionId
  }
})

for await (const msg of resumedQuery) {
  if (msg.type === 'assistant') {
    const text = msg.message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('')
    console.log('Resumed response:', text)
  }
}
```

</details>

### Limpeza

Sessões podem ser fechadas manualmente ou automaticamente usando [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management), um recurso do TypeScript 5.2+ para limpeza automática de recursos. Se você estiver usando uma versão mais antiga do TypeScript ou encontrar problemas de compatibilidade, use limpeza manual em vez disso.

**Limpeza automática (TypeScript 5.2+):**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// Session closes automatically when the block exits
```

**Limpeza manual:**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

const session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// ... use the session ...
session.close()
```

## Referência da API

### `unstable_v2_createSession()`

Cria uma nova sessão para conversas multi-turno.

```typescript
function unstable_v2_createSession(options: {
  model: string;
  // Additional options supported
}): Session
```

### `unstable_v2_resumeSession()`

Retoma uma sessão existente por ID.

```typescript
function unstable_v2_resumeSession(
  sessionId: string,
  options: {
    model: string;
    // Additional options supported
  }
): Session
```

### `unstable_v2_prompt()`

Função de conveniência única para consultas de um único turno.

```typescript
function unstable_v2_prompt(
  prompt: string,
  options: {
    model: string;
    // Additional options supported
  }
): Promise<Result>
```

### Interface de sessão

```typescript
interface Session {
  send(message: string): Promise<void>;
  receive(): AsyncGenerator<SDKMessage>;
  close(): void;
}
```

## Disponibilidade de recursos

Nem todos os recursos V1 estão disponíveis em V2 ainda. Os seguintes requerem o uso do [SDK V1](/docs/pt-BR/agent-sdk/typescript):

- Bifurcação de sessão (opção `forkSession`)
- Alguns padrões avançados de entrada de streaming

## Feedback

Compartilhe seu feedback sobre a interface V2 antes que ela se torne estável. Relate problemas e sugestões através de [GitHub Issues](https://github.com/anthropics/claude-code/issues).

## Veja também

- [Referência do SDK TypeScript (V1)](/docs/pt-BR/agent-sdk/typescript) - Documentação completa do SDK V1
- [Visão geral do SDK](/docs/pt-BR/agent-sdk/overview) - Conceitos gerais do SDK
- [Exemplos V2 no GitHub](https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world-v2) - Exemplos de código funcionando