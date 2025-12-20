# Миграция на Claude Agent SDK

Руководство по миграции Claude Code TypeScript и Python SDK на Claude Agent SDK

---

## Обзор

Claude Code SDK был переименован в **Claude Agent SDK**, и его документация была переорганизована. Это изменение отражает более широкие возможности SDK для создания AI-агентов, выходящих за рамки только задач кодирования.

## Что изменилось

| Аспект                   | Старое                      | Новое                            |
| :----------------------- | :-------------------------- | :------------------------------- |
| **Имя пакета (TS/JS)** | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
| **Python пакет**       | `claude-code-sdk`           | `claude-agent-sdk`               |
| **Местоположение документации** | Claude Code документация | API Guide → Agent SDK раздел |

<Note>
**Изменения в документации:** Документация Agent SDK переместилась из Claude Code документации в API Guide в отдельный раздел [Agent SDK](/docs/ru/agent-sdk/overview). Документация Claude Code теперь сосредоточена на инструменте CLI и функциях автоматизации.
</Note>

## Шаги миграции

### Для проектов TypeScript/JavaScript

**1. Удалите старый пакет:**

```bash
npm uninstall @anthropic-ai/claude-code
```

**2. Установите новый пакет:**

```bash
npm install @anthropic-ai/claude-agent-sdk
```

**3. Обновите ваши импорты:**

Измените все импорты с `@anthropic-ai/claude-code` на `@anthropic-ai/claude-agent-sdk`:

```typescript
// Before
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-code";

// After
import {
  query,
  tool,
  createSdkMcpServer,
} from "@anthropic-ai/claude-agent-sdk";
```

**4. Обновите зависимости package.json:**

Если у вас есть пакет, указанный в вашем `package.json`, обновите его:

```json
// Before
{
  "dependencies": {
    "@anthropic-ai/claude-code": "^1.0.0"
  }
}

// After
{
  "dependencies": {
    "@anthropic-ai/claude-agent-sdk": "^0.1.0"
  }
}
```

Вот и всё! Никаких других изменений кода не требуется.

### Для проектов Python

**1. Удалите старый пакет:**

```bash
pip uninstall claude-code-sdk
```

**2. Установите новый пакет:**

```bash
pip install claude-agent-sdk
```

**3. Обновите ваши импорты:**

Измените все импорты с `claude_code_sdk` на `claude_agent_sdk`:

```python
# Before
from claude_code_sdk import query, ClaudeCodeOptions

# After
from claude_agent_sdk import query, ClaudeAgentOptions
```

**4. Обновите имена типов:**

Измените `ClaudeCodeOptions` на `ClaudeAgentOptions`:

```python
# Before
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5"
)

# After
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5"
)
```

**5. Просмотрите [критические изменения](#breaking-changes)**

Внесите необходимые изменения в код для завершения миграции.

## Критические изменения

<Warning>
Для улучшения изоляции и явной конфигурации Claude Agent SDK v0.1.0 вводит критические изменения для пользователей, мигрирующих с Claude Code SDK. Внимательно просмотрите этот раздел перед миграцией.
</Warning>

### Python: ClaudeCodeOptions переименован в ClaudeAgentOptions

**Что изменилось:** Тип Python SDK `ClaudeCodeOptions` был переименован в `ClaudeAgentOptions`.

**Миграция:**

```python
# BEFORE (v0.0.x)
from claude_agent_sdk import query, ClaudeCodeOptions

options = ClaudeCodeOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)

# AFTER (v0.1.0)
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    model="claude-sonnet-4-5",
    permission_mode="acceptEdits"
)
```

**Почему это изменилось:** Имя типа теперь соответствует брендингу "Claude Agent SDK" и обеспечивает согласованность в соглашениях об именовании SDK.

### Системный промпт больше не используется по умолчанию

**Что изменилось:** SDK больше не использует системный промпт Claude Code по умолчанию.

**Миграция:**

<CodeGroup>

```typescript TypeScript
// BEFORE (v0.0.x) - Использовал системный промпт Claude Code по умолчанию
const result = query({ prompt: "Hello" });

// AFTER (v0.1.0) - Использует пустой системный промпт по умолчанию
// Чтобы получить старое поведение, явно запросите предустановку Claude Code:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: { type: "preset", preset: "claude_code" }
  }
});

// Или используйте пользовательский системный промпт:
const result = query({
  prompt: "Hello",
  options: {
    systemPrompt: "You are a helpful coding assistant"
  }
});
```

```python Python
# BEFORE (v0.0.x) - Использовал системный промпт Claude Code по умолчанию
async for message in query(prompt="Hello"):
    print(message)

# AFTER (v0.1.0) - Использует пустой системный промпт по умолчанию
# Чтобы получить старое поведение, явно запросите предустановку Claude Code:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt={"type": "preset", "preset": "claude_code"}  # Используйте предустановку
    )
):
    print(message)

# Или используйте пользовательский системный промпт:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        system_prompt="You are a helpful coding assistant"
    )
):
    print(message)
```

</CodeGroup>

**Почему это изменилось:** Обеспечивает лучший контроль и изоляцию для приложений SDK. Теперь вы можете создавать агентов с пользовательским поведением без наследования инструкций CLI, ориентированных на Claude Code.

### Источники настроек больше не загружаются по умолчанию

**Что изменилось:** SDK больше не читает настройки файловой системы (CLAUDE.md, settings.json, слэш-команды и т. д.) по умолчанию.

**Миграция:**

<CodeGroup>

```typescript TypeScript
// BEFORE (v0.0.x) - Загружал все настройки автоматически
const result = query({ prompt: "Hello" });
// Читал бы из:
// - ~/.claude/settings.json (пользователь)
// - .claude/settings.json (проект)
// - .claude/settings.local.json (локально)
// - CLAUDE.md файлы
// - Пользовательские слэш-команды

// AFTER (v0.1.0) - Настройки не загружаются по умолчанию
// Чтобы получить старое поведение:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["user", "project", "local"]
  }
});

// Или загрузите только определённые источники:
const result = query({
  prompt: "Hello",
  options: {
    settingSources: ["project"]  // Только настройки проекта
  }
});
```

```python Python
# BEFORE (v0.0.x) - Загружал все настройки автоматически
async for message in query(prompt="Hello"):
    print(message)
# Читал бы из:
# - ~/.claude/settings.json (пользователь)
# - .claude/settings.json (проект)
# - .claude/settings.local.json (локально)
# - CLAUDE.md файлы
# - Пользовательские слэш-команды

# AFTER (v0.1.0) - Настройки не загружаются по умолчанию
# Чтобы получить старое поведение:
from claude_agent_sdk import query, ClaudeAgentOptions

async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["user", "project", "local"]
    )
):
    print(message)

# Или загрузите только определённые источники:
async for message in query(
    prompt="Hello",
    options=ClaudeAgentOptions(
        setting_sources=["project"]  # Только настройки проекта
    )
):
    print(message)
```

</CodeGroup>

**Почему это изменилось:** Обеспечивает предсказуемое поведение приложений SDK независимо от локальных конфигураций файловой системы. Это особенно важно для:
- **CI/CD окружений** - Согласованное поведение без локальных настроек
- **Развёрнутых приложений** - Отсутствие зависимости от настроек файловой системы
- **Тестирования** - Изолированные тестовые окружения
- **Многопользовательских систем** - Предотвращение утечки настроек между пользователями

<Note>
**Обратная совместимость:** Если ваше приложение полагалось на настройки файловой системы (пользовательские слэш-команды, инструкции CLAUDE.md и т. д.), добавьте `settingSources: ['user', 'project', 'local']` в ваши параметры.
</Note>

## Почему переименование?

Claude Code SDK был первоначально разработан для задач кодирования, но он превратился в мощную платформу для создания всех типов AI-агентов. Новое имя "Claude Agent SDK" лучше отражает его возможности:

- Создание бизнес-агентов (помощники по правовым вопросам, финансовые советники, поддержка клиентов)
- Создание специализированных агентов кодирования (SRE боты, рецензенты безопасности, агенты проверки кода)
- Разработка пользовательских агентов для любой области с использованием инструментов, интеграции MCP и многого другого

## Получение помощи

Если вы столкнулись с какими-либо проблемами во время миграции:

**Для TypeScript/JavaScript:**

1. Проверьте, что все импорты обновлены для использования `@anthropic-ai/claude-agent-sdk`
2. Убедитесь, что ваш package.json содержит новое имя пакета
3. Запустите `npm install`, чтобы убедиться, что зависимости обновлены

**Для Python:**

1. Проверьте, что все импорты обновлены для использования `claude_agent_sdk`
2. Убедитесь, что ваш requirements.txt или pyproject.toml содержит новое имя пакета
3. Запустите `pip install claude-agent-sdk`, чтобы убедиться, что пакет установлен

## Следующие шаги

- Изучите [Обзор Agent SDK](/docs/ru/agent-sdk/overview), чтобы узнать о доступных функциях
- Посмотрите [Справочник TypeScript SDK](/docs/ru/agent-sdk/typescript) для подробной документации API
- Просмотрите [Справочник Python SDK](/docs/ru/agent-sdk/python) для документации, специфичной для Python
- Узнайте о [Пользовательских инструментах](/docs/ru/agent-sdk/custom-tools) и [Интеграции MCP](/docs/ru/agent-sdk/mcp)