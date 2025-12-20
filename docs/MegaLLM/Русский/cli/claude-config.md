# Конфигурация Claude Code

> Настройка Claude Code для использования MegaLLM

Claude Code использует JSON файлы конфигурации для настроек и одобрения API ключей. Конфигурация может быть на системном уровне (глобальной) или на уровне проекта (локальной).

## Файлы конфигурации

### Конфигурация системного уровня

**Файл настроек**: `~/.claude/settings.json`

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
  }
}
```

**Одобрение API ключей**: `~/.claude.json`

```json  theme={null}
{
  "customApiKeyResponses": {
    "approved": ["last-20-chars-of-key"],
    "rejected": []
  }
}
```

<Info>
  Файл одобрения API ключа хранит последние 20 символов вашего API ключа, чтобы запомнить ваше решение об одобрении, когда Claude Code запрашивает его.
</Info>

### Конфигурация уровня проекта

**Файл настроек**: `./.claude/settings.json`

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
  }
}
```

**Локальные настройки (Gitignored)**: `./.claude/settings.local.json`

```json  theme={null}
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-your-personal-key"
  }
}
```

<Tip>
  Используйте `settings.local.json`, чтобы хранить ваш личный API ключ вне системы контроля версий, одновременно делясь базовой конфигурацией с вашей командой.
</Tip>

## Переменные окружения

CLI устанавливает эти переменные окружения в конфигурации вашей оболочки:

```bash  theme={null}
export ANTHROPIC_BASE_URL="https://ai.megallm.io"
export ANTHROPIC_API_KEY="sk-mega-your-api-key-here"
```

Они добавляются в:

* `~/.bashrc` (bash)
* `~/.zshrc` (zsh)
* `~/.config/fish/config.fish` (fish)
* Профиль PowerShell (Windows)

### Проверка переменных окружения

```bash  theme={null}
echo $ANTHROPIC_BASE_URL
# Вывод: https://ai.megallm.io

echo $ANTHROPIC_API_KEY
# Вывод: sk-mega-your-api-key-here
```

## Приоритет конфигурации

Claude Code загружает конфигурацию в следующем порядке (от наивысшего к низшему приоритету):

<Steps>
  <Step title="Переменные окружения">
    `ANTHROPIC_BASE_URL` и `ANTHROPIC_API_KEY` из вашей оболочки
  </Step>

  <Step title="Локальные настройки уровня проекта">
    `./.claude/settings.local.json` в текущем каталоге
  </Step>

  <Step title="Настройки уровня проекта">
    `./.claude/settings.json` в текущем каталоге
  </Step>

  <Step title="Настройки системного уровня">
    `~/.claude/settings.json` в домашнем каталоге
  </Step>
</Steps>

## Конфигурация строки состояния (Опционально)

Claude Code поддерживает улучшенную строку состояния для лучшего интерфейса терминала:

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
  },
  "statusline": {
    "enabled": true,
    "components": {
      "directory": true,
      "gitBranch": true,
      "model": true,
      "contextUsage": true,
      "cost": true,
      "sessionTimer": true,
      "tokenAnalytics": true
    }
  }
}
```

CLI предложит вам настроить это во время конфигурации.

## Ручная настройка

Если вы предпочитаете не использовать CLI:

### Ручная настройка системного уровня

```bash  theme={null}
# 1. Создать каталог
mkdir -p ~/.claude

# 2. Создать файл настроек
cat > ~/.claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "your-api-key"
  }
}
EOF

# 3. Создать файл одобрения API ключа
cat > ~/.claude.json << 'EOF'
{
  "customApiKeyResponses": {
    "approved": ["last-20-chars-of-your-key"],
    "rejected": []
  }
}
EOF

# 4. Добавить переменные окружения в конфигурацию оболочки
echo 'export ANTHROPIC_BASE_URL="https://ai.megallm.io"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="your-api-key"' >> ~/.bashrc

# 5. Перезагрузить оболочку
source ~/.bashrc
```

### Ручная настройка уровня проекта

```bash  theme={null}
# 1. Перейти к вашему проекту
cd ~/projects/my-project

# 2. Создать каталог
mkdir -p .claude

# 3. Создать файл настроек (без API ключа для контроля версий)
cat > .claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
  }
}
EOF

# 4. Создать файл локальных настроек (с API ключом, не коммитится)
cat > .claude/settings.local.json << 'EOF'
{
  "env": {
    "ANTHROPIC_API_KEY": "your-api-key"
  }
}
EOF

# 5. Добавить в .gitignore
echo ".claude/settings.local.json" >> .gitignore
echo ".claude.json" >> .gitignore

# 6. Закоммитить общую конфигурацию
git add .claude/settings.json .gitignore
git commit -m "Add MegaLLM configuration for Claude Code"
```

## Конфигурация для команды

Для командных проектов отделите общую конфигурацию от личных API ключей:

**Общая конфигурация** (`.claude/settings.json` - коммитится в git):

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
  },
  "model": "gpt-5",
  "temperature": 0.7,
  "maxTokens": 4096
}
```

**Личная конфигурация** (`.claude/settings.local.json` - не коммитится):

```json  theme={null}
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-personal-key-here"
  }
}
```

**Инструкции по настройке для команды** (`.claude/README.md`):

````markdown  theme={null}
# Настройка MegaLLM Claude Code

## Предварительные требования
1. Получите ваш API ключ MegaLLM на https://megallm.io/dashboard
2. Установите Claude Code: `npm install -g @anthropic-ai/claude-code`

## Настройка
1. Создайте `.claude/settings.local.json`:
   ```json
   {
     "env": {
       "ANTHROPIC_API_KEY": "your-key-here"
     }
   }
````

2. Или установите переменную окружения:
   ```bash  theme={null}
   export ANTHROPIC_API_KEY="your-key-here"
   ```

````

## Опции конфигурации

### Доступные настройки

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "sk-mega-...",
    "ANTHROPIC_MODEL": "gpt-5"
  },
  "model": "gpt-5",
  "temperature": 0.7,
  "maxTokens": 4096,
  "streaming": true,
  "contextWindow": 8192,
  "autoSave": true,
  "fileWatcher": true,
  "gitIntegration": true
}
````

### Выбор модели

Измените модель по умолчанию:

```json  theme={null}
{
  "env": {
    "ANTHROPIC_MODEL": "claude-opus-4-1-20250805"
  }
}
```

Или укажите в переменной окружения:

```bash  theme={null}
export ANTHROPIC_MODEL="gpt-5"
```

Смотрите [Каталог моделей](/ru/home/models) для доступных моделей.

## Проверка

### Проверка файлов конфигурации

```bash  theme={null}
# Просмотр настроек
cat ~/.claude/settings.json | jq .

# Просмотр одобрения API ключа
cat ~/.claude.json | jq .

# Проверка конфигурации проекта
cat .claude/settings.json | jq .
cat .claude/settings.local.json | jq .
```

### Проверка API подключения

```bash  theme={null}
# Проверить API с вашими учетными данными
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     $ANTHROPIC_BASE_URL/v1/models

# Должен вернуть список доступных моделей
```

### Проверка Claude Code

```bash  theme={null}
# Запустить Claude Code
claude-code

# Или протестировать с простым запросом
echo "What is 2+2?" | claude-code
```

## Устранение неполадок

<AccordionGroup>
  <Accordion title="Конфигурация не загружается">
    **Проверьте расположение файлов:**

    ```bash  theme={null}
    ls -la ~/.claude/
    ls -la .claude/
    ```

    **Проверьте синтаксис JSON:**

    ```bash  theme={null}
    jq . ~/.claude/settings.json
    # Должен показать форматированный JSON или ошибку, если невалидный
    ```

    **Проверьте разрешения:**

    ```bash  theme={null}
    ls -la ~/.claude/settings.json
    # Должен быть читаемым: -rw-r--r--
    ```
  </Accordion>

  <Accordion title="API ключ не распознается">
    **Проверьте переменную окружения:**

    ```bash  theme={null}
    echo $ANTHROPIC_API_KEY
    ```

    Если пусто, перезагрузите оболочку:

    ```bash  theme={null}
    source ~/.bashrc  # или ~/.zshrc
    ```

    **Проверьте API ключ в конфигурации:**

    ```bash  theme={null}
    jq .env.ANTHROPIC_API_KEY ~/.claude/settings.json
    ```

    **Проверьте формат API ключа:**

    * Должен начинаться с `sk-mega-`
    * Не менее 20 символов
    * Без лишних пробелов или кавычек
  </Accordion>

  <Accordion title="Используется неправильный базовый URL">
    **Проверьте переменную окружения:**

    ```bash  theme={null}
    echo $ANTHROPIC_BASE_URL
    # Должно быть: https://ai.megallm.io
    ```

    **Проверьте в конфигурации:**

    ```bash  theme={null}
    jq .env.ANTHROPIC_BASE_URL ~/.claude/settings.json
    ```

    **Частая ошибка - завершающая косая черта:**

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io"  // ✅ Правильно
        // "ANTHROPIC_BASE_URL": "https://ai.megallm.io/"  // ❌ Неправильно
      }
    }
    ```
  </Accordion>

  <Accordion title="Конфигурация проекта не переопределяет системную конфигурацию">
    **Проверьте, что вы в правильном каталоге:**

    ```bash  theme={null}
    pwd
    ls -la .claude/
    ```

    **Проверьте приоритет конфигурации:**

    ```bash  theme={null}
    # Конфигурация проекта должна переопределять системную
    cat .claude/settings.json
    cat ~/.claude/settings.json
    ```

    **Проверьте наличие settings.local.json:**

    ```bash  theme={null}
    cat .claude/settings.local.json
    # Это имеет наивысший приоритет
    ```
  </Accordion>
</AccordionGroup>

## Расширенная конфигурация

### Множественные профили

Используйте разные конфигурации для разных случаев использования:

```bash  theme={null}
# Профиль разработки
cat > ~/.claude/settings.dev.json << 'EOF'
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-dev-key"
  },
  "model": "gpt-4o-mini",
  "temperature": 0.9
}
EOF

# Производственный профиль
cat > ~/.claude/settings.prod.json << 'EOF'
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-prod-key"
  },
  "model": "gpt-5",
  "temperature": 0.5
}
EOF

# Переключить профили
cp ~/.claude/settings.dev.json ~/.claude/settings.json
```

### Конфигурация специфичная для окружения

```bash  theme={null}
# Установить разные конфигурации в зависимости от окружения
if [ "$NODE_ENV" = "production" ]; then
  export ANTHROPIC_API_KEY="$PROD_API_KEY"
else
  export ANTHROPIC_API_KEY="$DEV_API_KEY"
fi
```

## Лучшие практики

<CardGroup cols={2}>
  <Card title="Разделяйте API ключи" icon="key">
    Используйте `.gitignore` для `settings.local.json`, чтобы хранить API ключи в секрете
  </Card>

  <Card title="Уровень проекта для команд" icon="users">
    Используйте конфигурацию уровня проекта для командных проектов с общими настройками
  </Card>

  <Card title="Переменные окружения" icon="terminal">
    Предпочитайте переменные окружения в CI/CD окружениях
  </Card>

  <Card title="Регулярные обновления" icon="rotate">
    Поддерживайте Claude Code обновленным для последних функций и исправлений
  </Card>
</CardGroup>

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Конфигурация Codex" icon="code" href="/ru/cli/codex-config">
    Настроить Codex/Windsurf
  </Card>

  <Card title="Конфигурация OpenCode" icon="brackets-curly" href="/ru/cli/opencode-config">
    Настроить OpenCode
  </Card>

  <Card title="Примеры" icon="code-branch" href="/ru/cli/examples">
    Просмотр практических примеров
  </Card>

  <Card title="Конфигурация всех агентов" icon="window" href="/ru/agents/overview">
    Настройка всех CLI и GUI агентов
  </Card>

  <Card title="Устранение неполадок" icon="circle-exclamation" href="/ru/cli/troubleshooting">
    Распространенные проблемы и решения
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt