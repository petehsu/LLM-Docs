# TypeScript SDK V2 인터페이스 (미리보기)

다중 턴 대화를 위한 세션 기반 송수신 패턴이 포함된 간소화된 V2 TypeScript Agent SDK의 미리보기.

---

<Warning>
V2 인터페이스는 **불안정한 미리보기**입니다. API는 안정화되기 전에 피드백에 따라 변경될 수 있습니다. 세션 포킹과 같은 일부 기능은 [V1 SDK](/docs/ko/agent-sdk/typescript)에서만 사용 가능합니다.
</Warning>

V2 Claude Agent TypeScript SDK는 비동기 생성기와 yield 조정의 필요성을 제거합니다. 이를 통해 다중 턴 대화가 더 간단해집니다. 생성기 상태를 여러 턴에 걸쳐 관리하는 대신, 각 턴은 별도의 `send()`/`receive()` 사이클입니다. API 표면은 세 가지 개념으로 축소됩니다:

- `createSession()` / `resumeSession()`: 대화 시작 또는 계속
- `session.send()`: 메시지 전송
- `session.receive()`: 응답 받기

## 설치

V2 인터페이스는 기존 SDK 패키지에 포함되어 있습니다:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## 빠른 시작

### 일회성 프롬프트

세션을 유지할 필요가 없는 간단한 단일 턴 쿼리의 경우 `unstable_v2_prompt()`를 사용합니다. 이 예제는 수학 질문을 보내고 답변을 기록합니다:

```typescript
import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk'

const result = await unstable_v2_prompt('What is 2 + 2?', {
  model: 'claude-sonnet-4-5-20250929'
})
console.log(result.result)
```

<details>
<summary>V1에서 동일한 작업 보기</summary>

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

### 기본 세션

단일 프롬프트를 넘어서는 상호작용의 경우 세션을 만듭니다. V2는 송수신을 별개의 단계로 분리합니다:
- `send()`는 메시지를 전송합니다
- `receive()`는 응답을 스트리밍합니다

이러한 명시적 분리는 턴 사이에 로직을 추가하기 쉽게 만듭니다(예: 후속 메시지를 보내기 전에 응답 처리).

아래 예제는 세션을 만들고, Claude에 "Hello!"를 보내고, 텍스트 응답을 출력합니다. 블록이 종료될 때 세션을 자동으로 닫기 위해 [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management)(TypeScript 5.2+)을 사용합니다. `session.close()`를 수동으로 호출할 수도 있습니다.

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
<summary>V1에서 동일한 작업 보기</summary>

V1에서는 입력과 출력이 모두 단일 비동기 생성기를 통해 흐릅니다. 기본 프롬프트의 경우 유사해 보이지만, 다중 턴 로직을 추가하려면 입력 생성기를 사용하도록 재구성해야 합니다.

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

### 다중 턴 대화

세션은 여러 교환에 걸쳐 컨텍스트를 유지합니다. 대화를 계속하려면 동일한 세션에서 `send()`를 다시 호출합니다. Claude는 이전 턴을 기억합니다.

이 예제는 수학 질문을 한 다음 이전 답변을 참조하는 후속 질문을 합니다:

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
<summary>V1에서 동일한 작업 보기</summary>

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

### 세션 재개

이전 상호작용에서 세션 ID가 있으면 나중에 재개할 수 있습니다. 이는 장기 실행 워크플로우나 애플리케이션 재시작 시 대화를 유지해야 할 때 유용합니다.

이 예제는 세션을 만들고, ID를 저장하고, 닫은 다음 대화를 재개합니다:

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
<summary>V1에서 동일한 작업 보기</summary>

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

### 정리

세션은 수동으로 닫거나 [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management)을 사용하여 자동으로 닫을 수 있습니다. 이는 자동 리소스 정리를 위한 TypeScript 5.2+ 기능입니다. 이전 TypeScript 버전을 사용 중이거나 호환성 문제가 발생하면 대신 수동 정리를 사용하세요.

**자동 정리 (TypeScript 5.2+):**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// Session closes automatically when the block exits
```

**수동 정리:**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

const session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// ... use the session ...
session.close()
```

## API 참조

### `unstable_v2_createSession()`

다중 턴 대화를 위한 새 세션을 만듭니다.

```typescript
function unstable_v2_createSession(options: {
  model: string;
  // Additional options supported
}): Session
```

### `unstable_v2_resumeSession()`

ID로 기존 세션을 재개합니다.

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

단일 턴 쿼리를 위한 일회성 편의 함수입니다.

```typescript
function unstable_v2_prompt(
  prompt: string,
  options: {
    model: string;
    // Additional options supported
  }
): Promise<Result>
```

### 세션 인터페이스

```typescript
interface Session {
  send(message: string): Promise<void>;
  receive(): AsyncGenerator<SDKMessage>;
  close(): void;
}
```

## 기능 가용성

모든 V1 기능이 V2에서 아직 사용 가능한 것은 아닙니다. 다음은 [V1 SDK](/docs/ko/agent-sdk/typescript)를 사용해야 합니다:

- 세션 포킹 (`forkSession` 옵션)
- 일부 고급 스트리밍 입력 패턴

## 피드백

V2 인터페이스가 안정화되기 전에 피드백을 공유하세요. [GitHub Issues](https://github.com/anthropics/claude-code/issues)를 통해 문제와 제안을 보고하세요.

## 참고 항목

- [TypeScript SDK 참조 (V1)](/docs/ko/agent-sdk/typescript) - 전체 V1 SDK 문서
- [SDK 개요](/docs/ko/agent-sdk/overview) - 일반 SDK 개념
- [GitHub의 V2 예제](https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world-v2) - 작동하는 코드 예제