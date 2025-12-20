# Interfaz TypeScript SDK V2 (vista previa)

Vista previa del SDK de Agente TypeScript V2 simplificado, con patrones de envío/recepción basados en sesiones para conversaciones de múltiples turnos.

---

<Warning>
La interfaz V2 es una **vista previa inestable**. Las APIs pueden cambiar según los comentarios antes de volverse estables. Algunas características como la bifurcación de sesiones solo están disponibles en el [SDK V1](/docs/es/agent-sdk/typescript).
</Warning>

El SDK de Agente Claude TypeScript V2 elimina la necesidad de generadores asincronos y coordinación de rendimiento. Esto hace que las conversaciones de múltiples turnos sean más simples—en lugar de gestionar el estado del generador entre turnos, cada turno es un ciclo separado de `send()`/`receive()`. La superficie de la API se reduce a tres conceptos:

- `createSession()` / `resumeSession()`: Iniciar o continuar una conversación
- `session.send()`: Enviar un mensaje
- `session.receive()`: Obtener la respuesta

## Instalación

La interfaz V2 está incluida en el paquete SDK existente:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Inicio rápido

### Solicitud de un solo turno

Para consultas simples de un solo turno donde no necesitas mantener una sesión, usa `unstable_v2_prompt()`. Este ejemplo envía una pregunta matemática e imprime la respuesta:

```typescript
import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk'

const result = await unstable_v2_prompt('What is 2 + 2?', {
  model: 'claude-sonnet-4-5-20250929'
})
console.log(result.result)
```

<details>
<summary>Ver la misma operación en V1</summary>

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

### Sesión básica

Para interacciones más allá de una solicitud única, crea una sesión. V2 separa el envío y la recepción en pasos distintos:
- `send()` envía tu mensaje
- `receive()` transmite la respuesta

Esta separación explícita facilita agregar lógica entre turnos (como procesar respuestas antes de enviar seguimientos).

El ejemplo a continuación crea una sesión, envía "¡Hola!" a Claude e imprime la respuesta de texto. Utiliza [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management) (TypeScript 5.2+) para cerrar automáticamente la sesión cuando el bloque sale. También puedes llamar a `session.close()` manualmente.

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
<summary>Ver la misma operación en V1</summary>

En V1, tanto la entrada como la salida fluyen a través de un único generador asincrónico. Para una solicitud básica esto se ve similar, pero agregar lógica de múltiples turnos requiere reestructurar para usar un generador de entrada.

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

### Conversación de múltiples turnos

Las sesiones persisten el contexto a través de múltiples intercambios. Para continuar una conversación, llama a `send()` nuevamente en la misma sesión. Claude recuerda los turnos anteriores.

Este ejemplo hace una pregunta matemática, luego hace un seguimiento que hace referencia a la respuesta anterior:

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
<summary>Ver la misma operación en V1</summary>

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

### Reanudación de sesión

Si tienes un ID de sesión de una interacción anterior, puedes reanudarlo más tarde. Esto es útil para flujos de trabajo de larga duración o cuando necesitas persistir conversaciones entre reinicios de aplicaciones.

Este ejemplo crea una sesión, almacena su ID, la cierra y luego reanuda la conversación:

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
<summary>Ver la misma operación en V1</summary>

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

### Limpieza

Las sesiones se pueden cerrar manualmente o automáticamente usando [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management), una característica de TypeScript 5.2+ para la limpieza automática de recursos. Si estás usando una versión anterior de TypeScript o encuentras problemas de compatibilidad, usa la limpieza manual en su lugar.

**Limpieza automática (TypeScript 5.2+):**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// Session closes automatically when the block exits
```

**Limpieza manual:**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

const session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// ... use the session ...
session.close()
```

## Referencia de API

### `unstable_v2_createSession()`

Crea una nueva sesión para conversaciones de múltiples turnos.

```typescript
function unstable_v2_createSession(options: {
  model: string;
  // Additional options supported
}): Session
```

### `unstable_v2_resumeSession()`

Reanuda una sesión existente por ID.

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

Función de conveniencia de un solo turno para consultas de un solo turno.

```typescript
function unstable_v2_prompt(
  prompt: string,
  options: {
    model: string;
    // Additional options supported
  }
): Promise<Result>
```

### Interfaz de sesión

```typescript
interface Session {
  send(message: string): Promise<void>;
  receive(): AsyncGenerator<SDKMessage>;
  close(): void;
}
```

## Disponibilidad de características

No todas las características de V1 están disponibles en V2 aún. Las siguientes requieren usar el [SDK V1](/docs/es/agent-sdk/typescript):

- Bifurcación de sesiones (opción `forkSession`)
- Algunos patrones avanzados de entrada de transmisión

## Comentarios

Comparte tus comentarios sobre la interfaz V2 antes de que se vuelva estable. Reporta problemas y sugerencias a través de [GitHub Issues](https://github.com/anthropics/claude-code/issues).

## Ver también

- [Referencia del SDK TypeScript (V1)](/docs/es/agent-sdk/typescript) - Documentación completa del SDK V1
- [Descripción general del SDK](/docs/es/agent-sdk/overview) - Conceptos generales del SDK
- [Ejemplos de V2 en GitHub](https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world-v2) - Ejemplos de código funcionales