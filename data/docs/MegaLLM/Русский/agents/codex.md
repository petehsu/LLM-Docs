# Конфигурация Codex/Windsurf

> Настройте Codex и Windsurf для использования MegaLLM

Codex и Windsurf используют формат конфигурации TOML и поддерживают только системную (глобальную) конфигурацию. CLI автоматически определяет, какой вариант у вас установлен.

<Note>
  Windsurf — это вариант Codex с расширенными функциями. Конфигурация идентична для обоих.
</Note>

## Файл конфигурации

**Расположение**: `~/.codex/config.toml`

```toml  theme={null}
model_provider = "megallm"
model = "gpt-5"

[model_providers.megallm]
name = "OpenAI using Chat Completions"
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY"
query_params = {}

[tools]
web_search = true
file_browser = true
```

<Warning>
  **Codex/Windsurf поддерживает только системную конфигурацию.** Конфигурация на уровне проекта недоступна.
</Warning>

## Переменная окружения

Конфигурация ссылается на переменную окружения для API-ключа:

```bash  theme={null}
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
```

Она добавляется в файл конфигурации вашей оболочки:

* `~/.bashrc` (bash)
* `~/.zshrc` (zsh)
* `~/.config/fish/config.fish` (fish)
* Профиль PowerShell (Windows)

### Проверка переменной окружения

```bash  theme={null}
echo $MEGALLM_API_KEY
# Вывод: sk-mega-your-api-key-here
```

## Ручная настройка

Если вы предпочитаете не использовать CLI:

```bash  theme={null}
# 1. Создайте каталог
mkdir -p ~/.codex

# 2. Создайте файл конфигурации
cat > ~/.codex/config.toml << 'EOF'
model_provider = "megallm"
model = "gpt-5"

[model_providers.megallm]
name = "OpenAI using Chat Completions"
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY"
query_params = {}

[tools]
web_search = true
file_browser = true
EOF

# 3. Добавьте переменную окружения в конфигурацию оболочки
echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc

# 4. Перезагрузите оболочку
source ~/.bashrc
```

## Параметры конфигурации

### Выбор модели

Измените модель по умолчанию в конфигурации:

```toml  theme={null}
model = "claude-opus-4-1-20250805"  # или любая поддерживаемая модель
```

**Доступные модели:**

* `gpt-5` - Последняя модель GPT
* `gpt-4` - GPT-4
* `gpt-4o` - GPT-4 оптимизированная
* `claude-opus-4-1-20250805` - Claude Opus
* `claude-sonnet-4` - Claude Sonnet
* `gemini-2.5-pro` - Gemini Pro
* Смотрите [Каталог моделей](/ru/home/models) для полного списка

### Настройки инструментов

Включите или отключите встроенные инструменты:

```toml  theme={null}
[tools]
web_search = true      # Включить возможность веб-поиска
file_browser = true    # Включить файловый браузер
terminal = true        # Включить доступ к терминалу
code_execution = true  # Включить выполнение кода
```

### Расширенная конфигурация

```toml  theme={null}
model_provider = "megallm"
model = "gpt-5"
temperature = 0.7
max_tokens = 4096
top_p = 0.9

[model_providers.megallm]
name = "OpenAI using Chat Completions"
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY"
query_params = {}

[tools]
web_search = true
file_browser = true
terminal = true

[ui]
theme = "dark"
font_size = 14
show_line_numbers = true
```

## Несколько API-ключей

Если вам нужны разные API-ключи для разных целей:

### Использование переменных окружения

```bash  theme={null}
# Ключ разработки
export MEGALLM_API_KEY="sk-mega-dev-key"

# Производственный ключ
export MEGALLM_API_KEY_PROD="sk-mega-prod-key"
```

### Переключение конфигураций

```bash  theme={null}
# Создайте резервную копию текущей конфигурации
cp ~/.codex/config.toml ~/.codex/config.toml.backup

# Конфигурация разработки
cat > ~/.codex/config.toml.dev << 'EOF'
model_provider = "megallm"
model = "gpt-4o-mini"

[model_providers.megallm]
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY_DEV"
EOF

# Производственная конфигурация
cat > ~/.codex/config.toml.prod << 'EOF'
model_provider = "megallm"
model = "gpt-5"

[model_providers.megallm]
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY_PROD"
EOF

# Переключиться на dev
cp ~/.codex/config.toml.dev ~/.codex/config.toml

# Переключиться на prod
cp ~/.codex/config.toml.prod ~/.codex/config.toml
```

## Специфичные функции Windsurf

Windsurf включает дополнительные параметры конфигурации:

```toml  theme={null}
model_provider = "megallm"
model = "gpt-5"

[model_providers.megallm]
name = "OpenAI using Chat Completions"
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY"
query_params = {}

[windsurf]
cascade_mode = true           # Включить функцию Cascade AI
multi_file_edit = true        # Разрешить редактирование нескольких файлов
context_awareness = "enhanced" # enhanced, standard, minimal

[tools]
web_search = true
file_browser = true
terminal = true
supercomplete = true          # Функция автодополнения Windsurf
```

## Проверка

### Проверка файла конфигурации

```bash  theme={null}
# Просмотр конфигурации
cat ~/.codex/config.toml

# Проверка синтаксиса TOML (если установлен toml-cli)
toml-check ~/.codex/config.toml

# Проверка прав доступа к файлу
ls -la ~/.codex/config.toml
```

### Тест подключения к API

```bash  theme={null}
# Тест API с вашими учетными данными
curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
     -H "Content-Type: application/json" \
     https://ai.megallm.io/v1/models

# Должен вернуть список доступных моделей
```

### Тест Codex/Windsurf

```bash  theme={null}
# Запуск Codex/Windsurf
codex  # или 'windsurf'

# Проверка версии
codex --version  # или 'windsurf --version'
```

## Устранение неполадок

<AccordionGroup>
  <Accordion title="Файл конфигурации не найден">
    **Проверьте, существует ли каталог:**

    ```bash  theme={null}
    ls -la ~/.codex/
    ```

    **Создайте, если отсутствует:**

    ```bash  theme={null}
    mkdir -p ~/.codex
    # Затем создайте config.toml
    ```

    **Проверьте путь к файлу:**

    ```bash  theme={null}
    # Должен быть точно:
    ~/.codex/config.toml
    # Не:
    ~/.config/codex/config.toml  # <Icon icon="xmark" /> Неправильное расположение
    ```
  </Accordion>

  <Accordion title="API-ключ не работает">
    **Проверьте, что переменная окружения установлена:**

    ```bash  theme={null}
    echo $MEGALLM_API_KEY
    ```

    Если пусто:

    ```bash  theme={null}
    # Добавьте в конфигурацию оболочки
    echo 'export MEGALLM_API_KEY="your-key"' >> ~/.bashrc
    source ~/.bashrc
    ```

    **Проверьте формат ключа:**

    * Должен начинаться с `sk-mega-`
    * Как минимум 20 символов
    * Без лишних пробелов или кавычек

    **Протестируйте ключ:**

    ```bash  theme={null}
    curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="Используется неправильный провайдер модели">
    **Проверьте файл конфигурации:**

    ```bash  theme={null}
    cat ~/.codex/config.toml | grep model_provider
    # Должно показать: model_provider = "megallm"
    ```

    **Проверьте base\_url:**

    ```bash  theme={null}
    cat ~/.codex/config.toml | grep base_url
    # Должно показать: base_url = "https://ai.megallm.io/v1"
    ```

    **Убедитесь в отсутствии опечаток:**

    ```toml  theme={null}
    model_provider = "megallm"  # <Icon icon="check" /> Правильно
    # model_provider = "megalm"  # <Icon icon="xmark" /> Неправильно (опечатка)
    # model_provider = "openai"  # <Icon icon="xmark" /> Неправильно (другой провайдер)
    ```
  </Accordion>

  <Accordion title="Ошибки синтаксиса TOML">
    **Проверьте синтаксис:**

    ```bash  theme={null}
    # Если у вас установлен toml-cli
    toml-check ~/.codex/config.toml

    # Или используйте Python
    python3 -c "import tomli; tomli.load(open('~/.codex/config.toml', 'rb'))"
    ```

    **Распространенные ошибки TOML:**

    ```toml  theme={null}
    # <Icon icon="xmark" /> Неправильно - отсутствуют кавычки
    model_provider = megallm

    # <Icon icon="check" /> Правильно
    model_provider = "megallm"

    # <Icon icon="xmark" /> Неправильно - неправильный синтаксис секции
    model_providers.megallm
    base_url = "..."

    # <Icon icon="check" /> Правильно
    [model_providers.megallm]
    base_url = "..."
    ```
  </Accordion>

  <Accordion title="Codex/Windsurf не обнаруживает конфигурацию">
    **Перезапустите Codex/Windsurf:**

    ```bash  theme={null}
    # Закройте все экземпляры
    pkill codex  # или 'pkill windsurf'

    # Запустите заново
    codex  # или 'windsurf'
    ```

    **Проверьте наличие нескольких файлов конфигурации:**

    ```bash  theme={null}
    find ~ -name "config.toml" -path "*/.codex/*"
    # Должен показать только один файл
    ```

    **Проверьте права доступа:**

    ```bash  theme={null}
    chmod 644 ~/.codex/config.toml
    ```
  </Accordion>
</AccordionGroup>

## Почему только системный уровень?

Codex и Windsurf не поддерживают конфигурацию на уровне проекта, потому что:

1. **Единственный экземпляр** - Codex/Windsurf работает как единственный экземпляр для всех проектов
2. **Глобальные настройки** - Настройки инструментов применяются в масштабах всей системы
3. **Упрощенное управление** - Одна конфигурация для управления

**Обходной путь для ключей, специфичных для проекта:**

Используйте переменные окружения в вашем проекте:

```bash  theme={null}
# В каталоге проекта
cat > .env << 'EOF'
MEGALLM_API_KEY=project-specific-key
EOF

# Загрузите перед запуском Codex
source .env && codex
```

Или создайте псевдонимы оболочки:

```bash  theme={null}
# В ~/.bashrc или ~/.zshrc
alias codex-project-a='MEGALLM_API_KEY="key-for-project-a" codex'
alias codex-project-b='MEGALLM_API_KEY="key-for-project-b" codex'
```

## Лучшие практики

<CardGroup cols={2}>
  <Card title="Резервная копия конфигурации" icon="floppy-disk">
    Храните резервную копию `config.toml` перед внесением изменений
  </Card>

  <Card title="Используйте переменные окружения" icon="key">
    Храните API-ключи в переменных окружения, а не в файле конфигурации
  </Card>

  <Card title="Контроль версий" icon="code-branch">
    Вы можете закоммитить `config.toml`, если используется env\_key (без жестко закодированных ключей)
  </Card>

  <Card title="Регулярные обновления" icon="rotate">
    Поддерживайте Codex/Windsurf в актуальном состоянии для последних функций
  </Card>
</CardGroup>

## Сравнение: Codex против Windsurf

| Функция                          | Codex                 | Windsurf              |
| -------------------------------- | --------------------- | --------------------- |
| Базовая конфигурация             | <Icon icon="check" /> | <Icon icon="check" /> |
| Поддержка MegaLLM                | <Icon icon="check" /> | <Icon icon="check" /> |
| Расположение конфигурации        | `~/.codex/`           | `~/.codex/`           |
| Cascade AI                       | <Icon icon="xmark" /> | <Icon icon="check" /> |
| Supercomplete                    | <Icon icon="xmark" /> | <Icon icon="check" /> |
| Редактирование нескольких файлов | Базовое               | Расширенное           |

<Info>
  И Codex, и Windsurf используют одно и то же расположение и формат файла конфигурации.
</Info>

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Конфигурация Claude Code" icon="robot" href="/ru/cli/claude-config">
    Настройте Claude Code
  </Card>

  <Card title="Конфигурация OpenCode" icon="brackets-curly" href="/ru/cli/opencode-config">
    Настройте OpenCode
  </Card>

  <Card title="Примеры" icon="code-branch" href="/ru/cli/examples">
    Смотрите практические примеры
  </Card>

  <Card title="Другие агенты" icon="window" href="/ru/agents/overview">
    Настройте другие CLI и GUI агенты
  </Card>

  <Card title="Каталог моделей" icon="layer-group" href="/ru/home/models">
    Просмотрите доступные модели
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt