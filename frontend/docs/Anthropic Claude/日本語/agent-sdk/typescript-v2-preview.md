# TypeScript SDK V2 インターフェース (プレビュー)

マルチターン会話のためのセッションベースの送受信パターンを備えた、簡略化されたV2 TypeScript Agent SDKのプレビュー。

---

<Warning>
V2インターフェースは**不安定なプレビュー**です。安定版になる前にフィードバックに基づいてAPIが変更される可能性があります。セッションフォーキングなどの一部の機能は[V1 SDK](/docs/ja/agent-sdk/typescript)でのみ利用可能です。
</Warning>

V2 Claude Agent TypeScript SDKは、非同期ジェネレータとyield調整の必要性を排除します。これにより、マルチターン会話がより簡単になります。ターン間でジェネレータの状態を管理する代わりに、各ターンは個別の`send()`/`receive()`サイクルです。APIサーフェスは3つの概念に削減されます:

- `createSession()` / `resumeSession()`: 会話を開始または継続する
- `session.send()`: メッセージを送信する
- `session.receive()`: レスポンスを取得する

## インストール

V2インターフェースは既存のSDKパッケージに含まれています:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## クイックスタート

### ワンショットプロンプト

セッションを維持する必要がない単純なシングルターンクエリの場合は、`unstable_v2_prompt()`を使用します。この例は数学の質問を送信し、答えをログに出力します:

```typescript
import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk'

const result = await unstable_v2_prompt('What is 2 + 2?', {
  model: 'claude-sonnet-4-5-20250929'
})
console.log(result.result)
```

<details>
<summary>V1での同じ操作を参照</summary>

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

### 基本的なセッション

単一のプロンプトを超えるインタラクションの場合は、セッションを作成します。V2は送受信を異なるステップに分離します:
- `send()`はメッセージをディスパッチします
- `receive()`はレスポンスをストリーミングで返します

この明示的な分離により、ターン間にロジックを追加しやすくなります(レスポンスを処理してからフォローアップを送信するなど)。

以下の例はセッションを作成し、「Hello!」をClaudeに送信し、テキストレスポンスを出力します。[`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management)(TypeScript 5.2+)を使用して、ブロックが終了するときにセッションを自動的に閉じます。`session.close()`を手動で呼び出すこともできます。

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
<summary>V1での同じ操作を参照</summary>

V1では、入出力は単一の非同期ジェネレータを通じてフローします。基本的なプロンプトの場合は同様に見えますが、マルチターンロジックを追加するには、入力ジェネレータを使用するように再構成する必要があります。

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

### マルチターン会話

セッションは複数の交換にわたってコンテキストを保持します。会話を続けるには、同じセッションで`send()`を再度呼び出します。Claudeは前のターンを覚えています。

この例は数学の質問を尋ね、その後、前の答えを参照するフォローアップを尋ねます:

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
<summary>V1での同じ操作を参照</summary>

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

### セッションの再開

前のインタラクションからセッションIDがある場合は、後でそれを再開できます。これは長時間実行されるワークフローや、アプリケーションの再起動全体で会話を永続化する必要がある場合に便利です。

この例はセッションを作成し、そのIDを保存し、閉じてから会話を再開します:

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
<summary>V1での同じ操作を参照</summary>

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

### クリーンアップ

セッションは手動で、または[`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management)を使用して自動的に閉じることができます。これはTypeScript 5.2+の自動リソースクリーンアップ機能です。古いTypeScriptバージョンを使用しているか、互換性の問題が発生した場合は、代わりに手動クリーンアップを使用してください。

**自動クリーンアップ(TypeScript 5.2+):**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// Session closes automatically when the block exits
```

**手動クリーンアップ:**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

const session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// ... use the session ...
session.close()
```

## APIリファレンス

### `unstable_v2_createSession()`

マルチターン会話用の新しいセッションを作成します。

```typescript
function unstable_v2_createSession(options: {
  model: string;
  // Additional options supported
}): Session
```

### `unstable_v2_resumeSession()`

IDで既存のセッションを再開します。

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

シングルターンクエリ用のワンショット便利関数。

```typescript
function unstable_v2_prompt(
  prompt: string,
  options: {
    model: string;
    // Additional options supported
  }
): Promise<Result>
```

### セッションインターフェース

```typescript
interface Session {
  send(message: string): Promise<void>;
  receive(): AsyncGenerator<SDKMessage>;
  close(): void;
}
```

## 機能の可用性

すべてのV1機能がV2でまだ利用可能なわけではありません。以下は[V1 SDK](/docs/ja/agent-sdk/typescript)を使用する必要があります:

- セッションフォーキング(`forkSession`オプション)
- 一部の高度なストリーミング入力パターン

## フィードバック

V2インターフェースが安定版になる前に、フィードバックを共有してください。[GitHub Issues](https://github.com/anthropics/claude-code/issues)を通じて問題と提案を報告してください。

## 関連項目

- [TypeScript SDKリファレンス(V1)](/docs/ja/agent-sdk/typescript) - 完全なV1 SDKドキュメント
- [SDKの概要](/docs/ja/agent-sdk/overview) - 一般的なSDKの概念
- [GitHub上のV2の例](https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world-v2) - 動作するコード例