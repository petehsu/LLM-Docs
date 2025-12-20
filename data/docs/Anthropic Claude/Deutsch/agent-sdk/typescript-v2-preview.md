# TypeScript SDK V2 Schnittstelle (Vorschau)

Vorschau des vereinfachten V2 TypeScript Agent SDK mit sitzungsbasierten Send/Receive-Mustern für mehrteilige Gespräche.

---

<Warning>
Die V2-Schnittstelle ist eine **instabile Vorschau**. APIs können sich basierend auf Feedback ändern, bevor sie stabil werden. Einige Funktionen wie Session-Forking sind nur im [V1 SDK](/docs/de/agent-sdk/typescript) verfügbar.
</Warning>

Das V2 Claude Agent TypeScript SDK beseitigt die Notwendigkeit für asynchrone Generatoren und Yield-Koordination. Dies macht mehrteilige Gespräche einfacher – anstatt den Generatorzustand über Turns hinweg zu verwalten, ist jeder Turn ein separater `send()`/`receive()`-Zyklus. Die API-Oberfläche reduziert sich auf drei Konzepte:

- `createSession()` / `resumeSession()`: Starten oder fortsetzen eines Gesprächs
- `session.send()`: Eine Nachricht senden
- `session.receive()`: Die Antwort abrufen

## Installation

Die V2-Schnittstelle ist im vorhandenen SDK-Paket enthalten:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Schnellstart

### Einmalige Eingabeaufforderung

Für einfache Einzelturn-Abfragen, bei denen Sie keine Sitzung beibehalten müssen, verwenden Sie `unstable_v2_prompt()`. Dieses Beispiel sendet eine Mathefrage und protokolliert die Antwort:

```typescript
import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk'

const result = await unstable_v2_prompt('What is 2 + 2?', {
  model: 'claude-sonnet-4-5-20250929'
})
console.log(result.result)
```

<details>
<summary>Siehe denselben Vorgang in V1</summary>

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

### Grundlegende Sitzung

Für Interaktionen über eine einzelne Eingabeaufforderung hinaus erstellen Sie eine Sitzung. V2 trennt das Senden und Empfangen in unterschiedliche Schritte:
- `send()` sendet Ihre Nachricht
- `receive()` streamt die Antwort zurück

Diese explizite Trennung macht es einfacher, Logik zwischen Turns hinzuzufügen (wie das Verarbeiten von Antworten vor dem Senden von Folgefragen).

Das folgende Beispiel erstellt eine Sitzung, sendet „Hello!" an Claude und gibt die Textantwort aus. Es verwendet [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management) (TypeScript 5.2+), um die Sitzung automatisch zu schließen, wenn der Block beendet wird. Sie können auch `session.close()` manuell aufrufen.

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
<summary>Siehe denselben Vorgang in V1</summary>

In V1 fließen sowohl Eingabe als auch Ausgabe durch einen einzelnen asynchronen Generator. Für eine grundlegende Eingabeaufforderung sieht dies ähnlich aus, aber das Hinzufügen von mehrteiliger Logik erfordert eine Umstrukturierung, um einen Eingabegenerator zu verwenden.

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

### Mehrteiliges Gespräch

Sitzungen behalten den Kontext über mehrere Austausche hinweg bei. Um ein Gespräch fortzusetzen, rufen Sie `send()` erneut in derselben Sitzung auf. Claude merkt sich die vorherigen Turns.

Dieses Beispiel stellt eine Mathefrage und stellt dann eine Folgefrage, die sich auf die vorherige Antwort bezieht:

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
<summary>Siehe denselben Vorgang in V1</summary>

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

### Sitzung fortsetzen

Wenn Sie eine Sitzungs-ID aus einer vorherigen Interaktion haben, können Sie diese später fortsetzen. Dies ist nützlich für langfristige Workflows oder wenn Sie Gespräche über Anwendungsneustarts hinweg beibehalten müssen.

Dieses Beispiel erstellt eine Sitzung, speichert ihre ID, schließt sie und setzt dann das Gespräch fort:

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
<summary>Siehe denselben Vorgang in V1</summary>

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

### Bereinigung

Sitzungen können manuell oder automatisch mit [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management) geschlossen werden, einer TypeScript 5.2+-Funktion für automatische Ressourcenbereinigung. Wenn Sie eine ältere TypeScript-Version verwenden oder auf Kompatibilitätsprobleme stoßen, verwenden Sie stattdessen manuelle Bereinigung.

**Automatische Bereinigung (TypeScript 5.2+):**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// Session closes automatically when the block exits
```

**Manuelle Bereinigung:**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

const session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// ... use the session ...
session.close()
```

## API-Referenz

### `unstable_v2_createSession()`

Erstellt eine neue Sitzung für mehrteilige Gespräche.

```typescript
function unstable_v2_createSession(options: {
  model: string;
  // Additional options supported
}): Session
```

### `unstable_v2_resumeSession()`

Setzt eine vorhandene Sitzung nach ID fort.

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

Einmalige Komfortfunktion für Einzelturn-Abfragen.

```typescript
function unstable_v2_prompt(
  prompt: string,
  options: {
    model: string;
    // Additional options supported
  }
): Promise<Result>
```

### Sitzungsschnittstelle

```typescript
interface Session {
  send(message: string): Promise<void>;
  receive(): AsyncGenerator<SDKMessage>;
  close(): void;
}
```

## Funktionsverfügbarkeit

Nicht alle V1-Funktionen sind in V2 noch verfügbar. Die folgenden erfordern die Verwendung des [V1 SDK](/docs/de/agent-sdk/typescript):

- Sitzungs-Forking (`forkSession`-Option)
- Einige erweiterte Streaming-Eingabemuster

## Feedback

Teilen Sie Ihr Feedback zur V2-Schnittstelle mit, bevor sie stabil wird. Melden Sie Probleme und Vorschläge über [GitHub Issues](https://github.com/anthropics/claude-code/issues).

## Siehe auch

- [TypeScript SDK-Referenz (V1)](/docs/de/agent-sdk/typescript) – Vollständige V1 SDK-Dokumentation
- [SDK-Übersicht](/docs/de/agent-sdk/overview) – Allgemeine SDK-Konzepte
- [V2-Beispiele auf GitHub](https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world-v2) – Funktionierende Codebeispiele