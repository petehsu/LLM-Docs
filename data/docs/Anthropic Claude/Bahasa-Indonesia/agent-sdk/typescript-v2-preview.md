# Antarmuka TypeScript SDK V2 (pratinjau)

Pratinjau SDK Agent TypeScript V2 yang disederhanakan, dengan pola send/receive berbasis sesi untuk percakapan multi-turn.

---

<Warning>
Antarmuka V2 adalah **pratinjau yang tidak stabil**. API mungkin berubah berdasarkan umpan balik sebelum menjadi stabil. Beberapa fitur seperti session forking hanya tersedia di [SDK V1](/docs/id/agent-sdk/typescript).
</Warning>

SDK Agent TypeScript Claude V2 menghilangkan kebutuhan untuk async generators dan koordinasi yield. Ini membuat percakapan multi-turn lebih sederhana—alih-alih mengelola status generator di seluruh turn, setiap turn adalah siklus `send()`/`receive()` yang terpisah. Permukaan API berkurang menjadi tiga konsep:

- `createSession()` / `resumeSession()`: Mulai atau lanjutkan percakapan
- `session.send()`: Kirim pesan
- `session.receive()`: Dapatkan respons

## Instalasi

Antarmuka V2 disertakan dalam paket SDK yang ada:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Mulai cepat

### Prompt sekali jalan

Untuk kueri single-turn sederhana di mana Anda tidak perlu mempertahankan sesi, gunakan `unstable_v2_prompt()`. Contoh ini mengirim pertanyaan matematika dan mencatat jawabannya:

```typescript
import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk'

const result = await unstable_v2_prompt('What is 2 + 2?', {
  model: 'claude-sonnet-4-5-20250929'
})
console.log(result.result)
```

<details>
<summary>Lihat operasi yang sama di V1</summary>

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

### Sesi dasar

Untuk interaksi di luar prompt tunggal, buat sesi. V2 memisahkan pengiriman dan penerimaan menjadi langkah-langkah yang berbeda:
- `send()` mengirimkan pesan Anda
- `receive()` mengalirkan respons kembali

Pemisahan eksplisit ini memudahkan untuk menambahkan logika antar turn (seperti memproses respons sebelum mengirim tindak lanjut).

Contoh di bawah membuat sesi, mengirim "Hello!" ke Claude, dan mencetak respons teks. Ini menggunakan [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management) (TypeScript 5.2+) untuk secara otomatis menutup sesi ketika blok keluar. Anda juga dapat memanggil `session.close()` secara manual.

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
<summary>Lihat operasi yang sama di V1</summary>

Di V1, aliran input dan output melalui async generator tunggal. Untuk prompt dasar ini terlihat serupa, tetapi menambahkan logika multi-turn memerlukan restrukturisasi untuk menggunakan input generator.

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

### Percakapan multi-turn

Sesi mempertahankan konteks di seluruh pertukaran ganda. Untuk melanjutkan percakapan, panggil `send()` lagi pada sesi yang sama. Claude mengingat turn sebelumnya.

Contoh ini menanyakan pertanyaan matematika, kemudian menanyakan tindak lanjut yang mereferensikan jawaban sebelumnya:

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
<summary>Lihat operasi yang sama di V1</summary>

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

### Lanjutkan sesi

Jika Anda memiliki ID sesi dari interaksi sebelumnya, Anda dapat melanjutkannya nanti. Ini berguna untuk alur kerja yang berjalan lama atau ketika Anda perlu mempertahankan percakapan di seluruh restart aplikasi.

Contoh ini membuat sesi, menyimpan ID-nya, menutupnya, kemudian melanjutkan percakapan:

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
<summary>Lihat operasi yang sama di V1</summary>

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

### Pembersihan

Sesi dapat ditutup secara manual atau otomatis menggunakan [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management), fitur TypeScript 5.2+ untuk pembersihan sumber daya otomatis. Jika Anda menggunakan versi TypeScript yang lebih lama atau mengalami masalah kompatibilitas, gunakan pembersihan manual sebagai gantinya.

**Pembersihan otomatis (TypeScript 5.2+):**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// Session closes automatically when the block exits
```

**Pembersihan manual:**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

const session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// ... use the session ...
session.close()
```

## Referensi API

### `unstable_v2_createSession()`

Membuat sesi baru untuk percakapan multi-turn.

```typescript
function unstable_v2_createSession(options: {
  model: string;
  // Additional options supported
}): Session
```

### `unstable_v2_resumeSession()`

Melanjutkan sesi yang ada berdasarkan ID.

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

Fungsi kenyamanan sekali jalan untuk kueri single-turn.

```typescript
function unstable_v2_prompt(
  prompt: string,
  options: {
    model: string;
    // Additional options supported
  }
): Promise<Result>
```

### Antarmuka Sesi

```typescript
interface Session {
  send(message: string): Promise<void>;
  receive(): AsyncGenerator<SDKMessage>;
  close(): void;
}
```

## Ketersediaan fitur

Tidak semua fitur V1 tersedia di V2 namun. Berikut ini memerlukan penggunaan [SDK V1](/docs/id/agent-sdk/typescript):

- Session forking (opsi `forkSession`)
- Beberapa pola input streaming lanjutan

## Umpan balik

Bagikan umpan balik Anda tentang antarmuka V2 sebelum menjadi stabil. Laporkan masalah dan saran melalui [GitHub Issues](https://github.com/anthropics/claude-code/issues).

## Lihat juga

- [Referensi TypeScript SDK (V1)](/docs/id/agent-sdk/typescript) - Dokumentasi SDK V1 lengkap
- [Gambaran umum SDK](/docs/id/agent-sdk/overview) - Konsep SDK umum
- [Contoh V2 di GitHub](https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world-v2) - Contoh kode yang berfungsi