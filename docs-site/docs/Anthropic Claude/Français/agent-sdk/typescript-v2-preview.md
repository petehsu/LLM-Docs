# Interface TypeScript SDK V2 (aperçu)

Aperçu du SDK Agent TypeScript V2 simplifié, avec des modèles d'envoi/réception basés sur les sessions pour les conversations multi-tours.

---

<Warning>
L'interface V2 est un **aperçu instable**. Les API peuvent changer en fonction des commentaires avant de devenir stables. Certaines fonctionnalités comme le forking de session ne sont disponibles que dans le [SDK V1](/docs/fr/agent-sdk/typescript).
</Warning>

Le SDK Agent TypeScript Claude V2 supprime le besoin de générateurs asynchrones et de coordination yield. Cela rend les conversations multi-tours plus simples—au lieu de gérer l'état du générateur entre les tours, chaque tour est un cycle `send()`/`receive()` séparé. La surface de l'API se réduit à trois concepts :

- `createSession()` / `resumeSession()` : Démarrer ou continuer une conversation
- `session.send()` : Envoyer un message
- `session.receive()` : Obtenir la réponse

## Installation

L'interface V2 est incluse dans le package SDK existant :

```bash
npm install @anthropic-ai/claude-agent-sdk
```

## Démarrage rapide

### Invite unique

Pour les requêtes simples à un seul tour où vous n'avez pas besoin de maintenir une session, utilisez `unstable_v2_prompt()`. Cet exemple envoie une question mathématique et enregistre la réponse :

```typescript
import { unstable_v2_prompt } from '@anthropic-ai/claude-agent-sdk'

const result = await unstable_v2_prompt('What is 2 + 2?', {
  model: 'claude-sonnet-4-5-20250929'
})
console.log(result.result)
```

<details>
<summary>Voir la même opération en V1</summary>

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

### Session de base

Pour les interactions au-delà d'une invite unique, créez une session. V2 sépare l'envoi et la réception en étapes distinctes :
- `send()` envoie votre message
- `receive()` diffuse la réponse

Cette séparation explicite facilite l'ajout de logique entre les tours (comme le traitement des réponses avant d'envoyer des suites).

L'exemple ci-dessous crée une session, envoie « Hello! » à Claude et imprime la réponse textuelle. Il utilise [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management) (TypeScript 5.2+) pour fermer automatiquement la session lorsque le bloc se termine. Vous pouvez également appeler `session.close()` manuellement.

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
<summary>Voir la même opération en V1</summary>

En V1, l'entrée et la sortie circulent toutes les deux via un seul générateur asynchrone. Pour une invite de base, cela ressemble à quelque chose de similaire, mais l'ajout de logique multi-tours nécessite une restructuration pour utiliser un générateur d'entrée.

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

### Conversation multi-tours

Les sessions persistent le contexte à travers plusieurs échanges. Pour continuer une conversation, appelez `send()` à nouveau sur la même session. Claude se souvient des tours précédents.

Cet exemple pose une question mathématique, puis pose une suite qui référence la réponse précédente :

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
<summary>Voir la même opération en V1</summary>

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

### Reprise de session

Si vous avez un ID de session d'une interaction précédente, vous pouvez la reprendre plus tard. Ceci est utile pour les flux de travail de longue durée ou lorsque vous devez persister les conversations à travers les redémarrages d'application.

Cet exemple crée une session, stocke son ID, la ferme, puis reprend la conversation :

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
<summary>Voir la même opération en V1</summary>

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

### Nettoyage

Les sessions peuvent être fermées manuellement ou automatiquement en utilisant [`await using`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management), une fonctionnalité de TypeScript 5.2+ pour le nettoyage automatique des ressources. Si vous utilisez une version plus ancienne de TypeScript ou rencontrez des problèmes de compatibilité, utilisez plutôt le nettoyage manuel.

**Nettoyage automatique (TypeScript 5.2+) :**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

await using session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// Session closes automatically when the block exits
```

**Nettoyage manuel :**

```typescript
import { unstable_v2_createSession } from '@anthropic-ai/claude-agent-sdk'

const session = unstable_v2_createSession({
  model: 'claude-sonnet-4-5-20250929'
})
// ... use the session ...
session.close()
```

## Référence API

### `unstable_v2_createSession()`

Crée une nouvelle session pour les conversations multi-tours.

```typescript
function unstable_v2_createSession(options: {
  model: string;
  // Additional options supported
}): Session
```

### `unstable_v2_resumeSession()`

Reprend une session existante par ID.

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

Fonction de commodité unique pour les requêtes à un seul tour.

```typescript
function unstable_v2_prompt(
  prompt: string,
  options: {
    model: string;
    // Additional options supported
  }
): Promise<Result>
```

### Interface Session

```typescript
interface Session {
  send(message: string): Promise<void>;
  receive(): AsyncGenerator<SDKMessage>;
  close(): void;
}
```

## Disponibilité des fonctionnalités

Toutes les fonctionnalités V1 ne sont pas encore disponibles en V2. Les éléments suivants nécessitent l'utilisation du [SDK V1](/docs/fr/agent-sdk/typescript) :

- Forking de session (option `forkSession`)
- Certains modèles de flux d'entrée avancés

## Commentaires

Partagez vos commentaires sur l'interface V2 avant qu'elle ne devienne stable. Signalez les problèmes et les suggestions via [GitHub Issues](https://github.com/anthropics/claude-code/issues).

## Voir aussi

- [Référence SDK TypeScript (V1)](/docs/fr/agent-sdk/typescript) - Documentation complète du SDK V1
- [Aperçu SDK](/docs/fr/agent-sdk/overview) - Concepts généraux du SDK
- [Exemples V2 sur GitHub](https://github.com/anthropics/claude-agent-sdk-demos/tree/main/hello-world-v2) - Exemples de code fonctionnels