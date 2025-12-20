# TypeScript SDK V2 介面（預覽）

簡化的 V2 TypeScript Agent SDK 預覽，具有基於會話的發送/接收模式，用於多輪對話。

---

<Warning>
V2 介面是一個**不穩定的預覽版本**。API 可能會根據反饋進行更改，然後才能變成穩定版本。某些功能（如會話分叉）僅在 [V1 SDK](/docs/zh-TW/agent-sdk/typescript) 中可用。
</Warning>

V2 Claude Agent TypeScript SDK 消除了對非同步生成器和 yield 協調的需求。這使多輪對話變得更簡單——不是在各輪之間管理生成器狀態，而是每一輪都是一個單獨的 `send()`/`receive()` 週期。API 表面縮減為三個概念：

- `createSession()` / `resumeSession()`：開始或繼續對話
- `session.send()`：發送訊息
- `session.receive()`：取得回應

## 安裝

V2 介面包含在現有的 SDK 套件中：

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## 快速開始

### 單次提示

對於不需要維護會話的簡單單輪查詢，使用 `unstable_v2_prompt()`。此範例發送數學問題並記錄答案：

```typescript
import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk'

const result = await unstable_v2_prompt('What is 2 + 2?', {
  model: 'claude-sonnet-4-5-20250929'
})
console.log(result.result)
```

<details>
<summary>查看 V1 中的相同操作</summary>

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

### 基本會話

對於超過單個提示的互動，建立一個會話。V2 將發送和接收分為不同的步驟：
- `send()` 分派您的訊息
- `receive()` 流回回應

這種明確的分離使得在輪次之間添加邏輯變得更容易（例如在發送後續訊息之前處理回應）。

下面的範例建立一個會話，向 Claude 發送「Hello!」，並列印文字回應。它使用 [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management)（TypeScript 5.2+）在區塊退出時自動關閉會話。您也可以手動呼叫 `session.close()`。

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
<summary>查看 V1 中的相同操作</summary>

在 V1 中，輸入和輸出都通過單個非同步生成器流動。對於基本提示，這看起來類似，但添加多輪邏輯需要重新結構化以使用輸入生成器。

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

### 多輪對話

會話在多個交換中保持上下文。要繼續對話，請在同一會話上再次呼叫 `send()`。Claude 會記住之前的輪次。

此範例提出數學問題，然後提出引用先前答案的後續問題：

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
<summary>查看 V1 中的相同操作</summary>

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

### 會話恢復

如果您有來自先前互動的會話 ID，您可以稍後恢復它。這對於長時間執行的工作流程或當您需要在應用程式重新啟動時保持對話時很有用。

此範例建立一個會話，儲存其 ID，關閉它，然後恢復對話：

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
<summary>查看 V1 中的相同操作</summary>

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

### 清理

會話可以手動關閉或使用 [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management)（TypeScript 5.2+ 功能用於自動資源清理）自動關閉。如果您使用的是較舊的 TypeScript 版本或遇到相容性問題，請改用手動清理。

**自動清理（TypeScript 5.2+）：**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// Session closes automatically when the block exits
```

**手動清理：**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

const session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// ... use the session ...
session.close()
```

## API 參考

### `unstable_v2_createSession()`

為多輪對話建立新會話。

```typescript
function unstable_v2_createSession(options: {
  model: string;
  // Additional options supported
}): Session
```

### `unstable_v2_resumeSession()`

按 ID 恢復現有會話。

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

用於單輪查詢的單次便利函數。

```typescript
function unstable_v2_prompt(
  prompt: string,
  options: {
    model: string;
    // Additional options supported
  }
): Promise<Result>
```

### 會話介面

```typescript
interface Session {
  send(message: string): Promise<void>;
  receive(): AsyncGenerator<SDKMessage>;
  close(): void;
}
```

## 功能可用性

並非所有 V1 功能在 V2 中都可用。以下功能需要使用 [V1 SDK](/docs/zh-TW/agent-sdk/typescript)：

- 會話分叉（`forkSession` 選項）
- 某些進階串流輸入模式

## 反饋

在 V2 介面變成穩定版本之前分享您的反饋。通過 [GitHub Issues](https://github.com/anthropics/claude-code/issues) 報告問題和建議。

## 另請參閱

- [TypeScript SDK 參考（V1）](/docs/zh-TW/agent-sdk/typescript) - 完整 V1 SDK 文件
- [SDK 概述](/docs/zh-TW/agent-sdk/overview) - 一般 SDK 概念
- [GitHub 上的 V2 範例](https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world-v2) - 工作程式碼範例