# Kontextbearbeitung

Verwalten Sie automatisch den Gesprächskontext, während er wächst, mit Kontextbearbeitung.

---

## Übersicht

Die Kontextbearbeitung ermöglicht es Ihnen, den Gesprächskontext automatisch zu verwalten, während er wächst, und hilft Ihnen, Kosten zu optimieren und innerhalb der Kontextfenstergrenzen zu bleiben. Sie können Server-seitige API-Strategien, Client-seitige SDK-Funktionen oder beide zusammen verwenden.

| Ansatz | Wo es läuft | Strategien | Wie es funktioniert |
|----------|---------------|------------|--------------|
| **Server-seitig** | API | Tool-Ergebnis-Löschen (`clear_tool_uses_20250919`)<br/>Thinking-Block-Löschen (`clear_thinking_20251015`) | Wird angewendet, bevor der Prompt Claude erreicht. Löscht spezifische Inhalte aus der Gesprächshistorie. Jede Strategie kann unabhängig konfiguriert werden. |
| **Client-seitig** | SDK | Komprimierung | Verfügbar in [Python- und TypeScript-SDKs](/docs/de/api/client-sdks) bei Verwendung von [`tool_runner`](/docs/de/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Generiert eine Zusammenfassung und ersetzt die vollständige Gesprächshistorie. Siehe [Komprimierung](#client-side-compaction-sdk) unten. |

## Server-seitige Strategien

<Note>
Die Kontextbearbeitung befindet sich derzeit in der Beta-Phase mit Unterstützung für Tool-Ergebnis-Löschen und Thinking-Block-Löschen. Um dies zu aktivieren, verwenden Sie den Beta-Header `context-management-2025-06-27` in Ihren API-Anfragen.

Bitte kontaktieren Sie uns über unser [Feedback-Formular](https://forms.gle/YXC2EKGMhjN1c4L88), um Ihr Feedback zu dieser Funktion zu teilen.
</Note>

### Tool-Ergebnis-Löschen

Die Strategie `clear_tool_uses_20250919` löscht Tool-Ergebnisse, wenn der Gesprächskontext über Ihren konfigurierten Schwellenwert hinauswächst. Wenn aktiviert, löscht die API automatisch die ältesten Tool-Ergebnisse in chronologischer Reihenfolge und ersetzt sie durch Platzhaltertext, um Claude wissen zu lassen, dass das Tool-Ergebnis entfernt wurde. Standardmäßig werden nur Tool-Ergebnisse gelöscht. Sie können optional sowohl Tool-Ergebnisse als auch Tool-Aufrufe (die Tool-Use-Parameter) löschen, indem Sie `clear_tool_inputs` auf true setzen.

### Thinking-Block-Löschen

Die Strategie `clear_thinking_20251015` verwaltet `thinking`-Blöcke in Gesprächen, wenn erweitertes Denken aktiviert ist. Diese Strategie löscht automatisch ältere Thinking-Blöcke aus vorherigen Turns.

<Tip>
**Standardverhalten**: Wenn erweitertes Denken ohne Konfiguration der Strategie `clear_thinking_20251015` aktiviert ist, behält die API automatisch nur die Thinking-Blöcke aus dem letzten Assistant-Turn bei (entspricht `keep: {type: "thinking_turns", value: 1}`).

Um Cache-Treffer zu maximieren, bewahren Sie alle Thinking-Blöcke auf, indem Sie `keep: "all"` setzen.
</Tip>

<Note>
Ein Assistant-Gesprächsturn kann mehrere Inhaltsblöcke enthalten (z. B. bei Verwendung von Tools) und mehrere Thinking-Blöcke (z. B. mit [verschachteltem Denken](/docs/de/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**Kontextbearbeitung erfolgt server-seitig**

Die Kontextbearbeitung wird **server-seitig** angewendet, bevor der Prompt Claude erreicht. Ihre Client-Anwendung behält die vollständige, unveränderte Gesprächshistorie bei – Sie müssen Ihren Client-Status nicht mit der bearbeiteten Version synchronisieren. Verwalten Sie Ihre vollständige Gesprächshistorie weiterhin lokal wie gewohnt.
</Tip>

<Tip>
**Kontextbearbeitung und Prompt-Caching**

Die Interaktion der Kontextbearbeitung mit [Prompt-Caching](/docs/de/build-with-claude/prompt-caching) variiert je nach Strategie:

- **Tool-Ergebnis-Löschen**: Invalidiert zwischengespeicherte Prompt-Präfixe, wenn Inhalte gelöscht werden. Um dies zu berücksichtigen, empfehlen wir, genug Token zu löschen, um die Cache-Invalidierung lohnenswert zu machen. Verwenden Sie den Parameter `clear_at_least`, um sicherzustellen, dass jedes Mal eine Mindestanzahl von Token gelöscht wird. Sie entstehen Cache-Schreibkosten jedes Mal, wenn Inhalte gelöscht werden, aber nachfolgende Anfragen können das neu zwischengespeicherte Präfix wiederverwenden.

- **Thinking-Block-Löschen**: Wenn Thinking-Blöcke **behalten** werden im Kontext (nicht gelöscht), wird der Prompt-Cache beibehalten, was Cache-Treffer ermöglicht und Eingabe-Token-Kosten reduziert. Wenn Thinking-Blöcke **gelöscht** werden, wird der Cache an der Stelle invalidiert, an der das Löschen erfolgt. Konfigurieren Sie den Parameter `keep` basierend darauf, ob Sie Cache-Leistung oder Kontextfensterverfügbarkeit priorisieren möchten.
</Tip>

## Unterstützte Modelle

Die Kontextbearbeitung ist verfügbar auf:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Tool-Ergebnis-Löschen Verwendung

Die einfachste Möglichkeit, das Tool-Ergebnis-Löschen zu aktivieren, besteht darin, nur den Strategietyp anzugeben, da alle anderen [Konfigurationsoptionen](#configuration-options-for-tool-result-clearing) ihre Standardwerte verwenden:

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

### Erweiterte Konfiguration

Sie können das Verhalten des Tool-Ergebnis-Löschens mit zusätzlichen Parametern anpassen:

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

## Übersicht

Mit der Kontextbearbeitung können Sie den Gesprächskontext automatisch verwalten, während er wächst, um Kosten zu optimieren und innerhalb von Kontextfenstergrenzen zu bleiben. Sie können Server-seitige API-Strategien, Client-seitige SDK-Funktionen oder beide zusammen verwenden.

| Ansatz | Wo es ausgeführt wird | Strategien | Wie es funktioniert |
|----------|---------------|------------|--------------|
| **Server-seitig** | API | Tool-Ergebnis-Clearing (`clear_tool_uses_20250919`)<br/>Thinking-Block-Clearing (`clear_thinking_20251015`) | Wird angewendet, bevor der Prompt Claude erreicht. Löscht spezifische Inhalte aus dem Gesprächsverlauf. Jede Strategie kann unabhängig konfiguriert werden. |
| **Client-seitig** | SDK | Komprimierung | Verfügbar in [Python und TypeScript SDKs](/docs/de/api/client-sdks) bei Verwendung von [`tool_runner`](/docs/de/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta). Generiert eine Zusammenfassung und ersetzt den vollständigen Gesprächsverlauf. Siehe [Komprimierung](#client-side-compaction-sdk) unten. |

## Server-seitige Strategien

<Note>
Die Kontextbearbeitung befindet sich derzeit in der Beta-Phase mit Unterstützung für Tool-Ergebnis-Clearing und Thinking-Block-Clearing. Um sie zu aktivieren, verwenden Sie den Beta-Header `context-management-2025-06-27` in Ihren API-Anfragen.

Bitte teilen Sie Ihr Feedback zu dieser Funktion über unser [Feedback-Formular](https://forms.gle/YXC2EKGMhjN1c4L88) mit.
</Note>

### Tool-Ergebnis-Clearing

Die Strategie `clear_tool_uses_20250919` löscht Tool-Ergebnisse, wenn der Gesprächskontext über Ihren konfigurierten Schwellenwert hinauswächst. Wenn aktiviert, löscht die API automatisch die ältesten Tool-Ergebnisse in chronologischer Reihenfolge und ersetzt sie durch Platzhaltertext, um Claude mitzuteilen, dass das Tool-Ergebnis entfernt wurde. Standardmäßig werden nur Tool-Ergebnisse gelöscht. Sie können optional sowohl Tool-Ergebnisse als auch Tool-Aufrufe (die Tool-Use-Parameter) löschen, indem Sie `clear_tool_inputs` auf true setzen.

### Thinking-Block-Clearing

Die Strategie `clear_thinking_20251015` verwaltet `thinking`-Blöcke in Gesprächen, wenn erweitertes Denken aktiviert ist. Diese Strategie löscht automatisch ältere Thinking-Blöcke aus vorherigen Turns.

<Tip>
**Standardverhalten**: Wenn erweitertes Denken ohne Konfiguration der Strategie `clear_thinking_20251015` aktiviert ist, behält die API automatisch nur die Thinking-Blöcke aus dem letzten Assistant-Turn bei (entspricht `keep: {type: "thinking_turns", value: 1}`).

Um Cache-Treffer zu maximieren, bewahren Sie alle Thinking-Blöcke auf, indem Sie `keep: "all"` setzen.
</Tip>

<Note>
Ein Assistant-Gesprächsturn kann mehrere Content-Blöcke enthalten (z. B. bei Verwendung von Tools) und mehrere Thinking-Blöcke (z. B. mit [verschachteltem Denken](/docs/de/build-with-claude/extended-thinking#interleaved-thinking)).
</Note>

<Tip>
**Kontextbearbeitung erfolgt server-seitig**

Die Kontextbearbeitung wird **server-seitig** angewendet, bevor der Prompt Claude erreicht. Ihre Client-Anwendung behält den vollständigen, unveränderten Gesprächsverlauf bei – Sie müssen Ihren Client-Status nicht mit der bearbeiteten Version synchronisieren. Verwalten Sie Ihren vollständigen Gesprächsverlauf lokal weiterhin wie gewohnt.
</Tip>

<Tip>
**Kontextbearbeitung und Prompt-Caching**

Die Interaktion der Kontextbearbeitung mit [Prompt-Caching](/docs/de/build-with-claude/prompt-caching) variiert je nach Strategie:

- **Tool-Ergebnis-Clearing**: Invalidiert zwischengespeicherte Prompt-Präfixe, wenn Inhalte gelöscht werden. Um dies zu berücksichtigen, empfehlen wir, genug Token zu löschen, um die Cache-Invalidierung lohnenswert zu machen. Verwenden Sie den Parameter `clear_at_least`, um sicherzustellen, dass jedes Mal eine Mindestanzahl von Token gelöscht wird. Sie entstehen Cache-Schreibkosten jedes Mal, wenn Inhalte gelöscht werden, aber nachfolgende Anfragen können das neu zwischengespeicherte Präfix wiederverwenden.

- **Thinking-Block-Clearing**: Wenn Thinking-Blöcke **im Kontext behalten** werden (nicht gelöscht), wird der Prompt-Cache beibehalten, was Cache-Treffer ermöglicht und Input-Token-Kosten reduziert. Wenn Thinking-Blöcke **gelöscht** werden, wird der Cache an der Stelle invalidiert, an der das Löschen erfolgt. Konfigurieren Sie den Parameter `keep` basierend darauf, ob Sie die Cache-Leistung oder die Verfügbarkeit des Kontextfensters priorisieren möchten.
</Tip>

## Unterstützte Modelle

Die Kontextbearbeitung ist verfügbar auf:

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## Tool-Ergebnis-Clearing-Verwendung

Die einfachste Möglichkeit, Tool-Ergebnis-Clearing zu aktivieren, besteht darin, nur den Strategietyp anzugeben, da alle anderen [Konfigurationsoptionen](#configuration-options-for-tool-result-clearing) ihre Standardwerte verwenden:

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

### Erweiterte Konfiguration

Sie können das Verhalten des Tool-Ergebnis-Clearing mit zusätzlichen Parametern anpassen:

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

## Thinking-Block-Clearing-Verwendung

Aktivieren Sie Thinking-Block-Clearing, um den Kontext und das Prompt-Caching effektiv zu verwalten, wenn erweitertes Denken aktiviert ist:

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

### Konfigurationsoptionen für Thinking-Block-Clearing

Die Strategie `clear_thinking_20251015` unterstützt die folgende Konfiguration:

| Konfigurationsoption | Standard | Beschreibung |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Definiert, wie viele neueste Assistant-Turns mit Thinking-Blöcken beibehalten werden sollen. Verwenden Sie `{type: "thinking_turns", value: N}`, wobei N > 0 sein muss, um die letzten N Turns zu behalten, oder `"all"`, um alle Thinking-Blöcke zu behalten. |

**Beispielkonfigurationen:**

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

### Strategien kombinieren

Sie können Thinking-Block-Clearing und Tool-Ergebnis-Clearing zusammen verwenden:

<Note>
Bei Verwendung mehrerer Strategien muss die Strategie `clear_thinking_20251015` zuerst im Array `edits` aufgelistet werden.
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

## Konfigurationsoptionen für Tool-Ergebnis-Clearing

| Konfigurationsoption | Standard | Beschreibung |
|---------------------|---------|-------------|
| `trigger` | 100.000 Input-Token | Definiert, wann die Kontextbearbeitungsstrategie aktiviert wird. Sobald der Prompt diesen Schwellenwert überschreitet, beginnt das Löschen. Sie können diesen Wert entweder in `input_tokens` oder `tool_uses` angeben. |
| `keep` | 3 Tool-Uses | Definiert, wie viele neueste Tool-Use/Result-Paare nach dem Löschen beibehalten werden sollen. Die API entfernt zuerst die ältesten Tool-Interaktionen und bewahrt die neuesten. |
| `clear_at_least` | Keine | Stellt sicher, dass jedes Mal, wenn die Strategie aktiviert wird, eine Mindestanzahl von Token gelöscht wird. Wenn die API nicht mindestens die angegebene Menge löschen kann, wird die Strategie nicht angewendet. Dies hilft zu bestimmen, ob die Kontextbereinigung das Unterbrechen Ihres Prompt-Cache wert ist. |
| `exclude_tools` | Keine | Liste von Tool-Namen, deren Tool-Uses und Ergebnisse niemals gelöscht werden sollten. Nützlich zum Bewahren wichtiger Kontexte. |
| `clear_tool_inputs` | `false` | Steuert, ob die Tool-Call-Parameter zusammen mit den Tool-Ergebnissen gelöscht werden. Standardmäßig werden nur die Tool-Ergebnisse gelöscht, während Claudes ursprüngliche Tool-Aufrufe sichtbar bleiben. |

## Kontextbearbeitungsantwort

Sie können sehen, welche Kontextbearbeitungen auf Ihre Anfrage angewendet wurden, indem Sie das Antwortfeld `context_management` verwenden, zusammen mit hilfreichen Statistiken über den gelöschten Inhalt und die Input-Token.

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

Für Streaming-Antworten werden die Kontextbearbeitungen im finalen `message_delta`-Event enthalten:

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

### Konfigurationsoptionen zum Löschen von Thinking Blocks

Die `clear_thinking_20251015`-Strategie unterstützt die folgende Konfiguration:

| Konfigurationsoption | Standard | Beschreibung |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | Definiert, wie viele aktuelle Assistent-Turns mit Thinking Blocks beibehalten werden sollen. Verwenden Sie `{type: "thinking_turns", value: N}`, wobei N > 0 sein muss, um die letzten N Turns beizubehalten, oder `"all"`, um alle Thinking Blocks beizubehalten. |

**Beispielkonfigurationen:**

```json
// Thinking Blocks aus den letzten 3 Assistent-Turns beibehalten
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// Alle Thinking Blocks beibehalten (maximiert Cache-Treffer)
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### Strategien kombinieren

Sie können das Löschen von Thinking Blocks und das Löschen von Tool-Ergebnissen zusammen verwenden:

<Note>
Wenn Sie mehrere Strategien verwenden, muss die `clear_thinking_20251015`-Strategie zuerst im `edits`-Array aufgelistet werden.
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

## Konfigurationsoptionen zum Löschen von Tool-Ergebnissen

| Konfigurationsoption | Standard | Beschreibung |
|---------------------|---------|-------------|
| `trigger` | 100.000 Input-Token | Definiert, wann die Kontextbearbeitungsstrategie aktiviert wird. Sobald der Prompt diesen Schwellenwert überschreitet, beginnt das Löschen. Sie können diesen Wert entweder in `input_tokens` oder `tool_uses` angeben. |
| `keep` | 3 Tool-Verwendungen | Definiert, wie viele aktuelle Tool-Use/Result-Paare nach dem Löschen beibehalten werden sollen. Die API entfernt zuerst die ältesten Tool-Interaktionen und behält die neuesten bei. |
| `clear_at_least` | Keine | Stellt sicher, dass jedes Mal, wenn die Strategie aktiviert wird, mindestens eine bestimmte Anzahl von Token gelöscht wird. Wenn die API nicht mindestens die angegebene Menge löschen kann, wird die Strategie nicht angewendet. Dies hilft zu bestimmen, ob das Löschen von Kontext das Unterbrechen Ihres Prompt-Cache wert ist. |
| `exclude_tools` | Keine | Liste von Tool-Namen, deren Tool-Verwendungen und Ergebnisse niemals gelöscht werden sollten. Nützlich zum Beibehalten wichtiger Kontexte. |
| `clear_tool_inputs` | `false` | Steuert, ob die Tool-Call-Parameter zusammen mit den Tool-Ergebnissen gelöscht werden. Standardmäßig werden nur die Tool-Ergebnisse gelöscht, während Claudes ursprüngliche Tool-Aufrufe sichtbar bleiben. |

## Kontextbearbeitungsantwort

Sie können sehen, welche Kontextbearbeitungen auf Ihre Anfrage angewendet wurden, indem Sie das `context_management`-Antwortfeld verwenden, zusammen mit hilfreichen Statistiken über den gelöschten Inhalt und die gelöschten Input-Token.

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // Bei Verwendung von `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // Bei Verwendung von `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

Bei Streaming-Antworten werden die Kontextbearbeitungen im finalen `message_delta`-Event enthalten sein:

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

## Token-Zählung

Der [Token-Zählungs](/docs/de/build-with-claude/token-counting)-Endpunkt unterstützt Kontextverwaltung, sodass Sie eine Vorschau erhalten können, wie viele Token Ihr Prompt nach Anwendung der Kontextbearbeitung verwenden wird.

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

Die Antwort zeigt sowohl die endgültige Token-Anzahl nach Anwendung der Kontextverwaltung (`input_tokens`) als auch die ursprüngliche Token-Anzahl vor dem Löschen (`original_input_tokens`).

## Verwendung mit dem Memory Tool

Die Kontextbearbeitung kann mit dem [Memory Tool](/docs/de/agents-and-tools/tool-use/memory-tool) kombiniert werden. Wenn sich Ihr Gesprächskontext dem konfigurierten Lösch-Schwellenwert nähert, erhält Claude automatisch eine Warnung, um wichtige Informationen zu bewahren. Dies ermöglicht Claude, Tool-Ergebnisse oder Kontext in seinen Memory-Dateien zu speichern, bevor sie aus dem Gesprächsverlauf gelöscht werden.

Diese Kombination ermöglicht es Ihnen:

- **Wichtigen Kontext bewahren**: Claude kann wichtige Informationen aus Tool-Ergebnissen in Memory-Dateien schreiben, bevor diese Ergebnisse gelöscht werden
- **Langfristige Workflows beibehalten**: Ermöglichen Sie agentengesteuerte Workflows, die sonst die Kontextgrenzen überschreiten würden, indem Sie Informationen in persistenten Speicher auslagern
- **Informationen bei Bedarf abrufen**: Claude kann zuvor gelöschte Informationen aus Memory-Dateien abrufen, wenn nötig, anstatt alles im aktiven Kontextfenster zu behalten

Beispielsweise kann Claude in einem Datei-Bearbeitungs-Workflow, in dem Claude viele Operationen durchführt, abgeschlossene Änderungen in Memory-Dateien zusammenfassen, während der Kontext wächst. Wenn Tool-Ergebnisse gelöscht werden, behält Claude Zugriff auf diese Informationen durch sein Memory-System und kann effektiv weiterarbeiten.

Um beide Funktionen zusammen zu verwenden, aktivieren Sie sie in Ihrer API-Anfrage:

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

## Client-seitige Komprimierung (SDK)

<Note>
Die Komprimierung ist in den [Python- und TypeScript-SDKs](/docs/de/api/client-sdks) verfügbar, wenn die [`tool_runner`-Methode](/docs/de/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta) verwendet wird.
</Note>

Die Komprimierung ist eine SDK-Funktion, die den Gesprächskontext automatisch verwaltet, indem Zusammenfassungen generiert werden, wenn die Token-Nutzung zu groß wird. Im Gegensatz zu serverseitigen Kontextbearbeitungsstrategien, die Inhalte löschen, weist die Komprimierung Claude an, den Gesprächsverlauf zusammenzufassen, und ersetzt dann den vollständigen Verlauf durch diese Zusammenfassung. Dies ermöglicht Claude, an langfristigen Aufgaben zu arbeiten, die sonst das [Kontextfenster](/docs/de/build-with-claude/context-windows) überschreiten würden.

### Wie die Komprimierung funktioniert

Wenn die Komprimierung aktiviert ist, überwacht das SDK die Token-Nutzung nach jeder Modell-Antwort:

1. **Schwellenwert-Überprüfung**: Das SDK berechnet die Gesamttoken als `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Zusammenfassungsgenerierung**: Wenn der Schwellenwert überschritten wird, wird eine Zusammenfassungsaufforderung als Benutzer-Turn eingefügt, und Claude generiert eine strukturierte Zusammenfassung, die in `<summary></summary>`-Tags eingewickelt ist
3. **Kontextersetzung**: Das SDK extrahiert die Zusammenfassung und ersetzt den gesamten Nachrichtenverlauf damit
4. **Fortsetzung**: Das Gespräch wird von der Zusammenfassung aus fortgesetzt, wobei Claude dort weitermacht, wo es aufgehört hat

### Komprimierung verwenden

Fügen Sie `compaction_control` zu Ihrem `tool_runner`-Aufruf hinzu:

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

#### Was während der Komprimierung passiert

Während das Gespräch wächst, sammelt sich der Nachrichtenverlauf an:

**Vor der Komprimierung (nähert sich 100k Token):**
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

Wenn Token den Schwellenwert überschreiten, fügt das SDK eine Zusammenfassungsanfrage ein und Claude generiert eine Zusammenfassung. Der gesamte Verlauf wird dann ersetzt:

**Nach der Komprimierung (zurück zu ~2-3k Token):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude setzt die Arbeit von dieser Zusammenfassung aus fort, als wäre es der ursprüngliche Gesprächsverlauf.

### Konfigurationsoptionen

| Parameter | Typ | Erforderlich | Standard | Beschreibung |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Ja | - | Ob automatische Komprimierung aktiviert werden soll |
| `context_token_threshold` | number | Nein | 100.000 | Token-Anzahl, bei der die Komprimierung ausgelöst wird |
| `model` | string | Nein | Gleiches wie Hauptmodell | Modell zur Verwendung für die Zusammenfassungsgenerierung |
| `summary_prompt` | string | Nein | Siehe unten | Benutzerdefinierte Aufforderung für die Zusammenfassungsgenerierung |

#### Auswahl eines Token-Schwellenwerts

Der Schwellenwert bestimmt, wann die Komprimierung auftritt. Ein niedrigerer Schwellenwert bedeutet häufigere Komprimierungen mit kleineren Kontextfenstern. Ein höherer Schwellenwert ermöglicht mehr Kontext, riskiert aber, Grenzen zu erreichen.

<CodeGroup>

```python Python
# Häufigere Komprimierung für speicherbegrenzte Szenarien
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Weniger häufige Komprimierung, wenn Sie mehr Kontext benötigen
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// Häufigere Komprimierung für speicherbegrenzte Szenarien
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Weniger häufige Komprimierung, wenn Sie mehr Kontext benötigen
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### Verwendung eines anderen Modells für Zusammenfassungen

Sie können ein schnelleres oder günstigeres Modell zur Generierung von Zusammenfassungen verwenden:

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

#### Benutzerdefinierte Zusammenfassungsaufforderungen

Sie können eine benutzerdefinierte Aufforderung für domänenspezifische Anforderungen bereitstellen. Ihre Aufforderung sollte Claude anweisen, seine Zusammenfassung in `<summary></summary>`-Tags einzuwickeln.

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

## Verwendung mit dem Memory Tool

Die Kontextbearbeitung kann mit dem [Memory Tool](/docs/de/agents-and-tools/tool-use/memory-tool) kombiniert werden. Wenn sich Ihr Gesprächskontext dem konfigurierten Löschschwellenwert nähert, erhält Claude eine automatische Warnung, um wichtige Informationen zu bewahren. Dies ermöglicht es Claude, Tool-Ergebnisse oder Kontext in seinen Memory-Dateien zu speichern, bevor sie aus dem Gesprächsverlauf gelöscht werden.

Diese Kombination ermöglicht es Ihnen:

- **Wichtigen Kontext bewahren**: Claude kann wichtige Informationen aus Tool-Ergebnissen in Memory-Dateien schreiben, bevor diese Ergebnisse gelöscht werden
- **Langfristige Workflows beibehalten**: Ermöglichen Sie agentengesteuerte Workflows, die sonst die Kontextgrenzen überschreiten würden, indem Sie Informationen in persistenten Speicher auslagern
- **Informationen bei Bedarf abrufen**: Claude kann zuvor gelöschte Informationen aus Memory-Dateien abrufen, wenn nötig, anstatt alles im aktiven Kontextfenster zu behalten

Beispielsweise kann Claude in einem Dateibearbeitungs-Workflow, in dem Claude viele Operationen durchführt, abgeschlossene Änderungen in Memory-Dateien zusammenfassen, während der Kontext wächst. Wenn Tool-Ergebnisse gelöscht werden, behält Claude Zugriff auf diese Informationen durch sein Memory-System und kann effektiv weiterarbeiten.

Um beide Funktionen zusammen zu verwenden, aktivieren Sie sie in Ihrer API-Anfrage:

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

## Client-seitige Komprimierung (SDK)

<Note>
Die Komprimierung ist in den [Python und TypeScript SDKs](/docs/de/api/client-sdks) verfügbar, wenn die [`tool_runner` Methode](/docs/de/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta) verwendet wird.
</Note>

Die Komprimierung ist eine SDK-Funktion, die den Gesprächskontext automatisch verwaltet, indem Zusammenfassungen generiert werden, wenn die Token-Nutzung zu groß wird. Im Gegensatz zu serverseitigen Kontextbearbeitungsstrategien, die Inhalte löschen, weist die Komprimierung Claude an, den Gesprächsverlauf zusammenzufassen, und ersetzt dann den vollständigen Verlauf durch diese Zusammenfassung. Dies ermöglicht es Claude, an langfristigen Aufgaben zu arbeiten, die sonst das [Kontextfenster](/docs/de/build-with-claude/context-windows) überschreiten würden.

### Wie die Komprimierung funktioniert

Wenn die Komprimierung aktiviert ist, überwacht das SDK die Token-Nutzung nach jeder Modellantwort:

1. **Schwellenwertprüfung**: Das SDK berechnet die Gesamttoken als `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **Zusammenfassungsgenerierung**: Wenn der Schwellenwert überschritten wird, wird eine Zusammenfassungsaufforderung als Benutzer-Turn eingefügt, und Claude generiert eine strukturierte Zusammenfassung, die in `<summary></summary>` Tags eingewickelt ist
3. **Kontextersetzung**: Das SDK extrahiert die Zusammenfassung und ersetzt den gesamten Nachrichtenverlauf damit
4. **Fortsetzung**: Das Gespräch wird von der Zusammenfassung aus fortgesetzt, wobei Claude dort weitermacht, wo es aufgehört hat

### Verwendung der Komprimierung

Fügen Sie `compaction_control` zu Ihrem `tool_runner` Aufruf hinzu:

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

#### Was während der Komprimierung passiert

Während das Gespräch wächst, sammelt sich der Nachrichtenverlauf an:

**Vor der Komprimierung (nähert sich 100k Tokens):**
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

Wenn Tokens den Schwellenwert überschreiten, fügt das SDK eine Zusammenfassungsanfrage ein und Claude generiert eine Zusammenfassung. Der gesamte Verlauf wird dann ersetzt:

**Nach der Komprimierung (zurück zu ~2-3k Tokens):**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude setzt die Arbeit von dieser Zusammenfassung aus fort, als wäre es der ursprüngliche Gesprächsverlauf.

### Konfigurationsoptionen

| Parameter | Typ | Erforderlich | Standard | Beschreibung |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | Ja | - | Ob automatische Komprimierung aktiviert werden soll |
| `context_token_threshold` | number | Nein | 100,000 | Token-Anzahl, bei der die Komprimierung ausgelöst wird |
| `model` | string | Nein | Gleiches wie Hauptmodell | Modell zur Verwendung für die Zusammenfassungsgenerierung |
| `summary_prompt` | string | Nein | Siehe unten | Benutzerdefinierte Aufforderung für die Zusammenfassungsgenerierung |

#### Wahl eines Token-Schwellenwerts

Der Schwellenwert bestimmt, wann die Komprimierung auftritt. Ein niedrigerer Schwellenwert bedeutet häufigere Komprimierungen mit kleineren Kontextfenstern. Ein höherer Schwellenwert ermöglicht mehr Kontext, birgt aber das Risiko, Grenzen zu erreichen.

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

#### Verwendung eines anderen Modells für Zusammenfassungen

Sie können ein schnelleres oder günstigeres Modell zur Generierung von Zusammenfassungen verwenden:

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

#### Benutzerdefinierte Zusammenfassungsaufforderungen

Sie können eine benutzerdefinierte Aufforderung für domänenspezifische Anforderungen bereitstellen. Ihre Aufforderung sollte Claude anweisen, seine Zusammenfassung in `<summary></summary>` Tags einzuwickeln.

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

### Standard-Zusammenfassungsaufforderung

Die integrierte Zusammenfassungsaufforderung weist Claude an, eine strukturierte Fortsetzungszusammenfassung zu erstellen, die Folgendes enthält:

1. **Aufgabenübersicht**: Die Kernforderung des Benutzers, Erfolgskriterien und Einschränkungen
2. **Aktueller Status**: Was abgeschlossen wurde, welche Dateien geändert wurden und welche Artefakte produziert wurden
3. **Wichtige Erkenntnisse**: Technische Einschränkungen, getroffene Entscheidungen, behobene Fehler und fehlgeschlagene Ansätze
4. **Nächste Schritte**: Spezifische erforderliche Maßnahmen, Blockierungen und Prioritätsreihenfolge
5. **Zu bewahrende Kontext**: Benutzereinstellungen, domänenspezifische Details und eingegangene Verpflichtungen

Diese Struktur ermöglicht es Claude, die Arbeit effizient fortzusetzen, ohne wichtigen Kontext zu verlieren oder Fehler zu wiederholen.

<section title="Vollständige Standard-Aufforderung anzeigen">

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

### Einschränkungen

#### Serverseitige Tools

<Warning>
Die Komprimierung erfordert besondere Überlegung bei der Verwendung von serverseitigen Tools wie [Web Search](/docs/de/agents-and-tools/tool-use/web-search-tool) oder [Web Fetch](/docs/de/agents-and-tools/tool-use/web-fetch-tool).
</Warning>

Bei Verwendung von serverseitigen Tools kann das SDK die Token-Nutzung falsch berechnen, was dazu führt, dass die Komprimierung zum falschen Zeitpunkt ausgelöst wird.

Beispielsweise könnte die API-Antwort nach einer Web-Search-Operation wie folgt aussehen:

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

Das SDK berechnet die Gesamtnutzung als 63.000 + 270.000 = 333.000 Tokens. Der `cache_read_input_tokens` Wert umfasst jedoch akkumulierte Lesevorgänge aus mehreren internen API-Aufrufen, die vom serverseitigen Tool durchgeführt werden, nicht Ihren tatsächlichen Gesprächskontext. Ihre tatsächliche Kontextlänge könnte nur die 63.000 `input_tokens` sein, aber das SDK sieht 333k und löst die Komprimierung vorzeitig aus.

**Lösungsansätze:**

- Verwenden Sie den [Token-Zählungs](/docs/de/build-with-claude/token-counting) Endpunkt, um die genaue Kontextlänge zu erhalten
- Vermeiden Sie Komprimierung bei umfangreicher Verwendung von serverseitigen Tools

#### Tool-Use-Grenzfälle

Wenn die Komprimierung ausgelöst wird, während eine Tool-Use-Antwort ausstehend ist, entfernt das SDK den Tool-Use-Block aus dem Nachrichtenverlauf, bevor die Zusammenfassung generiert wird. Claude wird den Tool-Aufruf nach der Wiederaufnahme aus der Zusammenfassung bei Bedarf erneut ausstellen.

### Überwachung der Komprimierung

Aktivieren Sie die Protokollierung, um zu verfolgen, wann die Komprimierung auftritt:

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

### Wann sollte Komprimierung verwendet werden

**Gute Anwendungsfälle:**

- Langfristige Agent-Aufgaben, die viele Dateien oder Datenquellen verarbeiten
- Forschungs-Workflows, die große Mengen an Informationen sammeln
- Mehrstufige Aufgaben mit klarem, messbarem Fortschritt
- Aufgaben, die Artefakte (Dateien, Berichte) produzieren, die außerhalb des Gesprächs bestehen bleiben

**Weniger ideale Anwendungsfälle:**

- Aufgaben, die präzise Erinnerung an frühe Gesprächsdetails erfordern
- Workflows, die serverseitige Tools umfangreich nutzen
- Aufgaben, die einen genauen Status über viele Variablen hinweg beibehalten müssen