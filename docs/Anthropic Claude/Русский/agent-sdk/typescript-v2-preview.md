# TypeScript SDK V2 interface (preview)

Предпросмотр упрощённого V2 TypeScript Agent SDK с сеансовыми паттернами отправки/получения для многооборотных диалогов.

---

<Warning>
Интерфейс V2 является **нестабильным предпросмотром**. API могут измениться на основе обратной связи перед стабилизацией. Некоторые функции, такие как разветвление сеансов, доступны только в [V1 SDK](/docs/ru/agent-sdk/typescript).
</Warning>

V2 Claude Agent TypeScript SDK устраняет необходимость в асинхронных генераторах и координации yield. Это делает многооборотные диалоги проще — вместо управления состоянием генератора между оборотами, каждый оборот представляет собой отдельный цикл `send()`/`receive()`. Поверхность API сводится к трём концепциям:

- `createSession()` / `resumeSession()`: Начать или продолжить диалог
- `session.send()`: Отправить сообщение
- `session.receive()`: Получить ответ

## Установка

Интерфейс V2 включён в существующий пакет SDK:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Быстрый старт

### Однооборотный запрос

Для простых однооборотных запросов, когда вам не нужно сохранять сеанс, используйте `unstable_v2_prompt()`. Этот пример отправляет математический вопрос и выводит ответ:

```typescript
import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk'

const result = await unstable_v2_prompt('What is 2 + 2?', {
  model: 'claude-sonnet-4-5-20250929'
})
console.log(result.result)
```

<details>
<summary>Смотрите ту же операцию в V1</summary>

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

### Базовый сеанс

Для взаимодействий, выходящих за рамки одного запроса, создайте сеанс. V2 разделяет отправку и получение на отдельные шаги:
- `send()` отправляет ваше сообщение
- `receive()` потоком возвращает ответ

Это явное разделение облегчает добавление логики между оборотами (например, обработка ответов перед отправкой последующих сообщений).

Пример ниже создаёт сеанс, отправляет "Hello!" в Claude и выводит текстовый ответ. Он использует [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management) (TypeScript 5.2+) для автоматического закрытия сеанса при выходе из блока. Вы также можете вызвать `session.close()` вручную.

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
<summary>Смотрите ту же операцию в V1</summary>

В V1 как входные, так и выходные данные проходят через один асинхронный генератор. Для базового запроса это выглядит похоже, но добавление многооборотной логики требует переструктурирования для использования входного генератора.

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

### Многооборотный диалог

Сеансы сохраняют контекст между несколькими обменами. Чтобы продолжить диалог, вызовите `send()` снова на том же сеансе. Claude помнит предыдущие обороты.

Этот пример задаёт математический вопрос, а затем задаёт последующий вопрос, который ссылается на предыдущий ответ:

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
<summary>Смотрите ту же операцию в V1</summary>

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

### Возобновление сеанса

Если у вас есть ID сеанса из предыдущего взаимодействия, вы можете возобновить его позже. Это полезно для долгосрочных рабочих процессов или когда вам нужно сохранить диалоги между перезагрузками приложения.

Этот пример создаёт сеанс, сохраняет его ID, закрывает его, а затем возобновляет диалог:

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
<summary>Смотрите ту же операцию в V1</summary>

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

### Очистка

Сеансы можно закрывать вручную или автоматически с помощью [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management), функции TypeScript 5.2+ для автоматической очистки ресурсов. Если вы используете более старую версию TypeScript или столкнулись с проблемами совместимости, используйте вместо этого ручную очистку.

**Автоматическая очистка (TypeScript 5.2+):**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// Session closes automatically when the block exits
```

**Ручная очистка:**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

const session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// ... use the session ...
session.close()
```

## Справочник API

### `unstable_v2_createSession()`

Создаёт новый сеанс для многооборотных диалогов.

```typescript
function unstable_v2_createSession(options: {
  model: string;
  // Additional options supported
}): Session
```

### `unstable_v2_resumeSession()`

Возобновляет существующий сеанс по ID.

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

Однооборотная удобная функция для однооборотных запросов.

```typescript
function unstable_v2_prompt(
  prompt: string,
  options: {
    model: string;
    // Additional options supported
  }
): Promise<Result>
```

### Интерфейс Session

```typescript
interface Session {
  send(message: string): Promise<void>;
  receive(): AsyncGenerator<SDKMessage>;
  close(): void;
}
```

## Доступность функций

Не все функции V1 доступны в V2 пока. Следующие требуют использования [V1 SDK](/docs/ru/agent-sdk/typescript):

- Разветвление сеансов (опция `forkSession`)
- Некоторые продвинутые паттерны потокового входа

## Обратная связь

Поделитесь своей обратной связью по интерфейсу V2 перед его стабилизацией. Сообщайте о проблемах и предложениях через [GitHub Issues](https://github.com/anthropics/claude-code/issues).

## Смотрите также

- [Справочник TypeScript SDK (V1)](/docs/ru/agent-sdk/typescript) - Полная документация V1 SDK
- [Обзор SDK](/docs/ru/agent-sdk/overview) - Общие концепции SDK
- [Примеры V2 на GitHub](https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world-v2) - Рабочие примеры кода