# Обзор конфигурации

> CLI MegaLLM настраивает ассистентов кодирования ИИ, создавая файлы конфигурации и устанавливая переменные окружения. Каждый инструмент имеет свой собственный формат конфигурации и место хранения.

## Расположения конфигурации

<CardGroup cols={3}>
  <Card title="Claude Code" icon="robot" href="/ru/cli/claude-config">
    JSON файлы в `~/.claude/` или `./.claude/`
  </Card>

  <Card title="Codex/Windsurf" icon="code" href="/ru/cli/codex-config">
    TOML файл в `~/.codex/`
  </Card>

  <Card title="OpenCode" icon="brackets-curly" href="/ru/cli/opencode-config">
    JSON файл в `~/.config/opencode/` или `./`
  </Card>
</CardGroup>

## Уровни конфигурации

### Системный уровень (Глобальный)

Применяется ко всем проектам на вашей машине.

| Инструмент     | Расположение                                    |
| -------------- | ----------------------------------------------- |
| Claude Code    | `~/.claude/settings.json`<br />`~/.claude.json` |
| Codex/Windsurf | `~/.codex/config.toml`                          |
| OpenCode       | `~/.config/opencode/opencode.json`              |

### Уровень проекта (Локальный)

Применяется только к текущему каталогу проекта.

| Инструмент     | Расположение                                                   |
| -------------- | -------------------------------------------------------------- |
| Claude Code    | `./.claude/settings.json`<br />`./.claude/settings.local.json` |
| Codex/Windsurf | <Icon icon="xmark" /> Не поддерживается                        |
| OpenCode       | `./opencode.json`                                              |

<Warning>
  **Codex/Windsurf поддерживает только конфигурацию системного уровня**
</Warning>

## Переменные окружения

CLI автоматически устанавливает эти переменные окружения в файле конфигурации вашей оболочки.

### Claude Code

```bash  theme={null}
export ANTHROPIC_BASE_URL="https://ai.megallm.io"
export ANTHROPIC_API_KEY="sk-mega-your-api-key-here"
```

### Codex/Windsurf

```bash  theme={null}
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
```

### OpenCode

```bash  theme={null}
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
```

<Info>
  **Примечание**: Codex/Windsurf и OpenCode используют одну и ту же переменную окружения `MEGALLM_API_KEY`.
</Info>

### Проверка переменных окружения

```bash  theme={null}
# Claude Code
echo $ANTHROPIC_BASE_URL
# Вывод: https://ai.megallm.io

echo $ANTHROPIC_API_KEY
# Вывод: sk-mega-your-api-key-here

# Codex/Windsurf & OpenCode
echo $MEGALLM_API_KEY
# Вывод: sk-mega-your-api-key-here
```

## Приоритет конфигурации

Когда существует несколько конфигураций, они применяются в следующем порядке (от высшего к низшему):

<Steps>
  <Step title="Переменные окружения">
    Наивысший приоритет - переопределяет все конфигурации на основе файлов
  </Step>

  <Step title="Конфигурация уровня проекта">
    Второй приоритет - применяется только к текущему проекту
  </Step>

  <Step title="Конфигурация системного уровня">
    По умолчанию - применяется глобально ко всем проектам
  </Step>
</Steps>

## Резервные файлы

CLI автоматически создает резервные копии файлов перед изменением конфигураций:

```
~/.claude/settings.json.backup
~/.codex/config.toml.backup
~/.config/opencode/opencode.json.backup
```

Для восстановления из резервной копии:

```bash  theme={null}
mv ~/.claude/settings.json.backup ~/.claude/settings.json
```

## Конфигурация конкретных инструментов

Выберите ваш инструмент ИИ для получения детальной информации о конфигурации:

<CardGroup cols={2}>
  <Card title="Конфигурация Claude Code" icon="robot" href="/ru/cli/claude-config">
    JSON конфигурация, переменные окружения и настройка строки состояния
  </Card>

  <Card title="Конфигурация Codex/Windsurf" icon="code" href="/ru/cli/codex-config">
    TOML конфигурация и настройка провайдера модели
  </Card>

  <Card title="Конфигурация OpenCode" icon="brackets-curly" href="/ru/cli/opencode-config">
    JSON конфигурация и настройки API
  </Card>
</CardGroup>

## Быстрые проверки конфигурации

### Проверить все конфигурации

```bash  theme={null}
# Проверить Claude Code
ls -la ~/.claude/
cat ~/.claude/settings.json

# Проверить Codex
ls -la ~/.codex/
cat ~/.codex/config.toml

# Проверить OpenCode
ls -la ~/.config/opencode/
cat ~/.config/opencode/opencode.json

# Проверить переменные окружения
env | grep -E "ANTHROPIC|MEGALLM"
```

### Проверить API подключение

```bash  theme={null}
# Проверить с учетными данными Claude Code
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     $ANTHROPIC_BASE_URL/v1/models

# Проверить с учетными данными Codex/OpenCode
curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
     -H "Content-Type: application/json" \
     https://ai.megallm.io/v1/models
```

## Ручная конфигурация

Если вы предпочитаете не использовать CLI, вы можете настроить вручную:

<Tabs>
  <Tab title="Claude Code">
    ```bash  theme={null}
    # Создать каталог
    mkdir -p ~/.claude

    # Создать файл настроек
    cat > ~/.claude/settings.json << 'EOF'
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
        "ANTHROPIC_API_KEY": "your-api-key"
      }
    }
    EOF

    # Добавить в конфигурацию оболочки
    echo 'export ANTHROPIC_BASE_URL="https://ai.megallm.io"' >> ~/.bashrc
    echo 'export ANTHROPIC_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Tab>

  <Tab title="Codex/Windsurf">
    ```bash  theme={null}
    # Создать каталог
    mkdir -p ~/.codex

    # Создать файл конфигурации
    cat > ~/.codex/config.toml << 'EOF'
    model_provider = "megallm"
    model = "gpt-5"

    [model_providers.megallm]
    name = "OpenAI using Chat Completions"
    base_url = "https://ai.megallm.io/v1"
    env_key = "MEGALLM_API_KEY"
    query_params = {}
    EOF

    # Добавить в конфигурацию оболочки
    echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Tab>

  <Tab title="OpenCode">
    ```bash  theme={null}
    # Создать каталог
    mkdir -p ~/.config/opencode

    # Создать файл конфигурации
    cat > ~/.config/opencode/opencode.json << 'EOF'
    {
      "$schema": "https://opencode.ai/config.json",
      "provider": {
        "anthropic": {
          "options": {
            "apiKey": "{env:MEGALLM_API_KEY}",
            "baseURL": "https://ai.megallm.io/v1"
          }
        }
      }
    }
    EOF

    # Добавить в конфигурацию оболочки
    echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Tab>
</Tabs>

## Лучшие практики конфигурации

<CardGroup cols={2}>
  <Card title="Используйте уровень проекта для команд" icon="users">
    Храните конфигурации конкретных проектов в системе контроля версий (без API ключей)
  </Card>

  <Card title="Защищайте API ключи" icon="lock">
    Никогда не коммитьте API ключи. Используйте `.gitignore` и переменные окружения
  </Card>

  <Card title="Регулярные резервные копии" icon="floppy-disk">
    CLI создает автоматические резервные копии, но храните свои собственные копии важных конфигураций
  </Card>

  <Card title="Тестируйте после изменений" icon="flask">
    Всегда проверяйте работу конфигурации после ручных изменений
  </Card>
</CardGroup>

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Конфигурация Claude Code" icon="robot" href="/ru/cli/claude-config">
    Детальная конфигурация Claude Code
  </Card>

  <Card title="Конфигурация Codex" icon="code" href="/ru/cli/codex-config">
    Детальная конфигурация Codex/Windsurf
  </Card>

  <Card title="Конфигурация OpenCode" icon="brackets-curly" href="/ru/cli/opencode-config">
    Детальная конфигурация OpenCode
  </Card>

  <Card title="Примеры" icon="code-branch" href="/ru/cli/examples">
    Практические примеры конфигурации
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt