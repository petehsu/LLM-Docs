# Конфигурация Cline

> Настройка расширения Cline для VSCode для использования MegaLLM

Cline — это мощное расширение для VSCode, которое сочетает в себе помощь ИИ с интеграцией терминала, автономным выполнением задач и расширенной осведомленностью о контексте. Настройте его для использования MegaLLM для доступа к нескольким моделям ИИ.

## Быстрая конфигурация

<Tabs>
  <Tab title="Формат Anthropic (Claude)">
    ### Настройка для моделей Claude

    <Steps>
      <Step title="Открыть настройки Cline">
        * Нажмите `Ctrl+Shift+P` / `Cmd+Shift+P`
        * Введите: `Cline: Open Settings`
        * Или: `Settings → Extensions → Cline`
      </Step>

      <Step title="Выбрать API-провайдера">
        * **API Provider**: Выберите `Anthropic`
        * **Base URL**: `https://ai.megallm.io`
        * **API Key**: `sk-mega-your-api-key-here`
      </Step>

      <Step title="Выбрать модель Claude">
        * **Default Model**: `claude-sonnet-4`
        * **Context Window**: `200000` токенов
        * **Temperature**: `0.5`
      </Step>

      <Step title="Включить функции">
        * <Icon icon="check" /> **Auto Context Detection**
        * <Icon icon="check" /> **File Watcher**
        * <Icon icon="check" /> **Terminal Integration**
        * <Icon icon="check" /> **Git Integration**
      </Step>
    </Steps>

    **Конфигурация в settings.json:**

    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "sk-mega-your-api-key-here",
        "baseURL": "https://ai.megallm.io"
      },
      "cline.defaultModel": "claude-sonnet-4",
      "cline.contextWindow": 200000,
      "cline.features": {
        "autoContext": true,
        "fileWatcher": true,
        "terminalIntegration": true,
        "gitIntegration": true
      }
    }
    ```

    <Info>
      **Примечание:** Для формата Anthropic baseURL должен быть `https://ai.megallm.io` (без `/v1`)
    </Info>
  </Tab>

  <Tab title="Формат OpenAI (GPT)">
    ### Настройка для моделей GPT

    <Steps>
      <Step title="Открыть настройки Cline">
        * Нажмите `Ctrl+Shift+P` / `Cmd+Shift+P`
        * Введите: `Cline: Open Settings`
      </Step>

      <Step title="Выбрать провайдера OpenAI">
        * **API Provider**: Выберите `OpenAI`
        * **Base URL**: `https://ai.megallm.io/v1`
        * **API Key**: `sk-mega-your-api-key-here`
      </Step>

      <Step title="Выбрать модель GPT">
        * **Default Model**: `gpt-5`
        * **Context Window**: `128000` токенов
        * **Temperature**: `0.7`
      </Step>

      <Step title="Включить функции">
        * <Icon icon="check" /> **Auto Context Detection**
        * <Icon icon="check" /> **File Watcher**
        * <Icon icon="check" /> **Terminal Integration**
      </Step>
    </Steps>

    **Конфигурация в settings.json:**

    ```json  theme={null}
    {
      "cline.apiProvider": "openai",
      "cline.openai": {
        "apiKey": "sk-mega-your-api-key-here",
        "baseURL": "https://ai.megallm.io/v1"
      },
      "cline.defaultModel": "gpt-5",
      "cline.contextWindow": 128000,
      "cline.features": {
        "autoContext": true,
        "fileWatcher": true,
        "terminalIntegration": true
      }
    }
    ```

    <Info>
      **Примечание:** Для формата OpenAI baseURL должен включать `/v1`: `https://ai.megallm.io/v1`
    </Info>
  </Tab>

  <Tab title="Переменные окружения">
    ### Безопасная конфигурация

    **Шаг 1**: Установите переменные окружения

    ```bash  theme={null}
    # Добавьте в ~/.bashrc, ~/.zshrc или ~/.config/fish/config.fish
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"

    # Для моделей Claude
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"

    # Для моделей GPT
    export OPENAI_BASE_URL="https://ai.megallm.io/v1"
    ```

    **Шаг 2**: Перезагрузите оболочку

    ```bash  theme={null}
    source ~/.bashrc  # или ~/.zshrc
    ```

    **Шаг 3**: Используйте ссылки в settings.json

    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "${env:MEGALLM_API_KEY}",
        "baseURL": "${env:ANTHROPIC_BASE_URL}"
      },
      "cline.defaultModel": "claude-sonnet-4"
    }
    ```

    <Icon icon="check" /> API-ключ остается защищенным и вне системы контроля версий
  </Tab>
</Tabs>

## Примеры сценариев

### Сценарий 1: Установка с нуля

Полная настройка с самого начала:

<Steps>
  <Step title="Установить расширение Cline">
    1. Откройте VSCode
    2. Перейдите в Extensions: `Ctrl+Shift+X` / `Cmd+Shift+X`
    3. Найдите: `Cline`
    4. Нажмите **Install**
    5. Перезагрузите VSCode при необходимости
  </Step>

  <Step title="Получить API-ключ MegaLLM">
    1. Посетите [Панель MegaLLM](https://megallm.io/dashboard)
    2. Перейдите в раздел **API Keys**
    3. Нажмите **Create New Key**
    4. Скопируйте ключ (начинается с `sk-mega-`)
  </Step>

  <Step title="Настроить Cline">
    Откройте Command Palette и выполните: `Cline: Open Settings`

    Выберите предпочитаемый формат:

    **Для моделей Claude:**

    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "sk-mega-your-actual-key",
        "baseURL": "https://ai.megallm.io"
      },
      "cline.defaultModel": "claude-sonnet-4"
    }
    ```

    **Для моделей GPT:**

    ```json  theme={null}
    {
      "cline.apiProvider": "openai",
      "cline.openai": {
        "apiKey": "sk-mega-your-actual-key",
        "baseURL": "https://ai.megallm.io/v1"
      },
      "cline.defaultModel": "gpt-5"
    }
    ```
  </Step>

  <Step title="Открыть панель Cline">
    1. Нажмите на значок Cline на левой боковой панели
    2. Или: `Ctrl+Shift+P` → `Cline: Open`
    3. Должен отображаться статус подключения: ✓ Connected
  </Step>

  <Step title="Протестировать конфигурацию">
    В чате Cline введите:

    ```
    Какую модель вы используете? Напишите функцию hello world на Python.
    ```

    **Ожидаемый ответ:**

    ```
    Я использую claude-sonnet-4 через MegaLLM.

    def hello_world():
        print("Hello, World!")

    if __name__ == "__main__":
        hello_world()
    ```
  </Step>
</Steps>

***

### Сценарий 2: Автономное выполнение задач

Используйте Cline для сложных многошаговых задач:

**Сценарий:** "Рефакторинг модуля аутентификации для использования JWT-токенов"

<Steps>
  <Step title="Настроить автономный режим">
    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "${env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io"
      },
      "cline.defaultModel": "claude-opus-4-1-20250805",
      "cline.autonomousMode": {
        "enabled": true,
        "requireApproval": "perFile",
        "maxIterations": 10
      },
      "cline.features": {
        "terminalIntegration": true,
        "gitIntegration": true,
        "fileWatcher": true
      }
    }
    ```
  </Step>

  <Step title="Дать задачу Cline">
    Откройте панель Cline и предоставьте подробные инструкции:

    ```
    Задача: Рефакторинг аутентификации для использования JWT

    Требования:
    1. Установить пакет jsonwebtoken
    2. Обновить конечную точку входа для генерации JWT
    3. Создать middleware для проверки JWT
    4. Обновить защищенные маршруты
    5. Написать тесты для нового потока аутентификации
    6. Обновить документацию

    Текущая аутентификация находится в: src/auth/
    ```
  </Step>

  <Step title="Cline выполняет автономно">
    Cline будет:

    1. Анализировать текущий код аутентификации
    2. Выполнить: `npm install jsonwebtoken`
    3. Создать новые утилиты JWT
    4. Обновить контроллер входа
    5. Создать middleware
    6. Обновить маршруты
    7. Сгенерировать тесты
    8. Обновить документацию

    **Вы одобряете каждое изменение файла перед его записью**
  </Step>

  <Step title="Проверить и зафиксировать">
    ```bash  theme={null}
    # Cline может выполнять git-команды
    git add .
    git commit -m "Refactor: Implement JWT authentication"
    ```
  </Step>
</Steps>

**Результат:** Полный рефакторинг аутентификации с минимальной ручной работой!

***

### Сценарий 3: Конфигурация Cline для конкретного проекта

Разные проекты требуют разных настроек Cline:

**Проект анализа данных на Python:**

`.vscode/settings.json`:

```json  theme={null}
{
  "cline.apiProvider": "anthropic",
  "cline.anthropic": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io"
  },
  "cline.defaultModel": "claude-opus-4-1-20250805",
  "cline.context": {
    "language": "python",
    "frameworks": ["pandas", "numpy", "matplotlib"],
    "codeStyle": "pep8"
  },
  "cline.customPrompts": {
    "analyze": "Проанализировать этот код обработки данных на эффективность",
    "visualize": "Предложить визуализацию matplotlib",
    "optimize": "Оптимизировать операции pandas для больших наборов данных"
  }
}
```

**Веб-приложение React/TypeScript:**

`.vscode/settings.json`:

```json  theme={null}
{
  "cline.apiProvider": "openai",
  "cline.openai": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io/v1"
  },
  "cline.defaultModel": "gpt-5",
  "cline.context": {
    "language": "typescript",
    "frameworks": ["react", "next.js", "tailwind"],
    "codeStyle": "airbnb"
  },
  "cline.customPrompts": {
    "component": "Создать React-компонент с TypeScript",
    "api": "Сгенерировать API-маршрут с обработкой ошибок",
    "test": "Написать тесты React Testing Library"
  }
}
```

**Системный проект на Rust:**

`.vscode/settings.json`:

```json  theme={null}
{
  "cline.apiProvider": "openai",
  "cline.openai": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io/v1"
  },
  "cline.defaultModel": "gemini-2.5-pro",
  "cline.context": {
    "language": "rust",
    "codeStyle": "rustfmt"
  },
  "cline.customPrompts": {
    "review": "Проверить на безопасность памяти и производительность",
    "unsafe": "Проанализировать unsafe-блок на корректность",
    "optimize": "Предложить оптимизации производительности"
  }
}
```

***

### Сценарий 4: Рабочий процесс интеграции с терминалом

Используйте возможности терминала Cline для DevOps-задач:

**Конфигурация:**

```json  theme={null}
{
  "cline.apiProvider": "anthropic",
  "cline.anthropic": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io"
  },
  "cline.defaultModel": "claude-sonnet-4",
  "cline.features": {
    "terminalIntegration": true,
    "gitIntegration": true,
    "fileWatcher": true
  },
  "cline.terminal": {
    "autoExecute": false,
    "requireApproval": true,
    "allowedCommands": ["npm", "git", "docker", "kubectl"]
  }
}
```

**Пример рабочего процесса:**

```plaintext  theme={null}
Вы: "Настроить среду разработки Docker для этого Node.js приложения"

Cline: "Я помогу настроить Docker. Мне нужно будет:
1. Создать Dockerfile
2. Создать docker-compose.yml
3. Добавить .dockerignore
4. Протестировать сборку

Продолжить?"

Вы: "Да"

Cline выполняет:
1. Создает Dockerfile с Node.js 18
2. Создает docker-compose.yml с приложением + postgres
3. Добавляет .dockerignore
4. Выполняет: docker-compose build
5. Выполняет: docker-compose up -d
6. Выполняет: docker-compose ps (для проверки)

Результат: <Icon icon="check" /> Среда Docker запущена
```

***

### Сценарий 5: Миграция с GitHub Copilot Chat

Переход с Copilot Chat на Cline с MegaLLM:

**Почему мигрировать:**

* <Icon icon="check" /> Доступ к Claude (лучшее рассуждение) И GPT
* <Icon icon="check" /> Интеграция с терминалом (Copilot Chat не имеет)
* <Icon icon="check" /> Автономные многошаговые задачи
* <Icon icon="check" /> Лучшие цены (оплата по факту использования vs. за место)
* <Icon icon="check" /> Больше осведомленности о контексте

**Шаги миграции:**

<Steps>
  <Step title="Документировать текущее использование">
    Отметьте ваши любимые функции Copilot Chat:

    * Объяснение кода
    * Генерация функций
    * Написание тестов
    * Помощь в отладке
  </Step>

  <Step title="Отключить Copilot Chat">
    ```json  theme={null}
    {
      "github.copilot.enable": false
    }
    ```
  </Step>

  <Step title="Установить Cline">
    VSCode Extensions → Поиск "Cline" → Install
  </Step>

  <Step title="Настроить с MegaLLM">
    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "${env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io"
      },
      "cline.defaultModel": "claude-sonnet-4"
    }
    ```
  </Step>

  <Step title="Изучить команды Cline">
    * `/explain` - Объяснить выбранный код
    * `/test` - Сгенерировать тесты
    * `/fix` - Отладить и исправить проблемы
    * `/refactor` - Рефакторинг кода
    * `/task` - Выполнить многошаговую задачу
  </Step>

  <Step title="Сравнить опыт">
    **Преимущества перед Copilot Chat:**

    * Может выполнять команды терминала
    * Лучше справляется с многофайловыми изменениями
    * Claude Opus для сложных рассуждений
    * Может запускать тесты и проверять изменения
    * Встроенная интеграция с Git
  </Step>
</Steps>

**Сравнение функций:**

| Функция                              | Copilot Chat                                    | Cline + MegaLLM                      |
| ------------------------------------ | ----------------------------------------------- | ------------------------------------ |
| **Интерфейс чата**                   | <Icon icon="check" />                           | <Icon icon="check" />                |
| **Объяснение кода**                  | <Icon icon="check" />                           | <Icon icon="check" /> Лучше с Claude |
| **Генерация кода**                   | <Icon icon="check" />                           | <Icon icon="check" />                |
| **Выполнение терминала**             | <Icon icon="xmark" />                           | <Icon icon="check" />                |
| **Редактирование нескольких файлов** | <Icon icon="triangle-exclamation" /> Ограничено | <Icon icon="check" /> Расширенное    |
| **Выбор модели**                     | Только GPT-4                                    | GPT, Claude, Gemini                  |
| **Автономные задачи**                | <Icon icon="xmark" />                           | <Icon icon="check" />                |
| **Интеграция Git**                   | <Icon icon="triangle-exclamation" /> Базовая    | <Icon icon="check" /> Расширенная    |
| **Цены**                             | \$10-20/месяц                                   | Оплата по факту                      |

***

### Сценарий 6: Стратегия использования нескольких моделей

Переключайте модели в зависимости от сложности задачи:

**Конфигурация:**

```json  theme={null}
{
  "cline.apiProvider": "anthropic",
  "cline.anthropic": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io"
  },
  "cline.defaultModel": "claude-sonnet-4",
  "cline.modelProfiles": {
    "fast": {
      "provider": "openai",
      "model": "gpt-4o-mini",
      "description": "Быстрые задачи, простые завершения"
    },
    "balanced": {
      "provider": "anthropic",
      "model": "claude-sonnet-4",
      "description": "Большинство задач, хороший баланс"
    },
    "powerful": {
      "provider": "anthropic",
      "model": "claude-opus-4-1-20250805",
      "description": "Сложные рассуждения, рефакторинг"
    },
    "creative": {
      "provider": "openai",
      "model": "gpt-5",
      "description": "Документация, именование"
    }
  }
}
```

**Паттерн использования:**

```plaintext  theme={null}
Утро: Быстрые исправления багов
→ Используйте профиль "fast" (gpt-4o-mini)
→ Быстрые ответы для простых проблем

Полдень: Разработка функций
→ Используйте профиль "balanced" (claude-sonnet-4)
→ Хорошее качество, разумная скорость

День: Сложный рефакторинг
→ Используйте профиль "powerful" (claude-opus-4)
→ Лучшее рассуждение для архитектуры

Вечер: Документация
→ Используйте профиль "creative" (gpt-5)
→ Привлекательная документация и комментарии
```

**Переключение профилей:**

1. В панели Cline нажмите на имя модели
2. Выберите профиль из выпадающего списка
3. Или используйте команду: `/model powerful`

***

### Сценарий 7: Интеграция CI/CD

Используйте Cline в автоматизированных рабочих процессах:

**Пример GitHub Actions:**

`.github/workflows/cline-review.yml`:

```yaml  theme={null}
name: Cline AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Cline CLI
        run: npm install -g @cline/cli

      - name: Configure Cline
        env:
          MEGALLM_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
        run: |
          mkdir -p ~/.vscode
          cat > ~/.vscode/settings.json << EOF
          {
            "cline.apiProvider": "anthropic",
            "cline.anthropic": {
              "apiKey": "$MEGALLM_API_KEY",
              "baseURL": "https://ai.megallm.io"
            },
            "cline.defaultModel": "claude-sonnet-4"
          }
          EOF

      - name: Run AI Review
        run: |
          cline review \
            --files "$(git diff --name-only origin/main...HEAD)" \
            --output review.md \
            --model claude-sonnet-4

      - name: Run Security Check
        run: |
          cline security-scan \
            --files "$(git diff --name-only origin/main...HEAD)" \
            --output security.md

      - name: Post Review Comments
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            const security = fs.readFileSync('security.md', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Cline AI Review\n\n${review}\n\n## Security Analysis\n\n${security}`
            });
```

## Параметры конфигурации

### Полный справочник

```json  theme={null}
{
  // Конфигурация API-провайдера
  "cline.apiProvider": "anthropic",  // или "openai"

  // Конфигурация Anthropic (Claude)
  "cline.anthropic": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io"  // Без /v1 для Anthropic
  },

  // Конфигурация OpenAI (GPT)
  "cline.openai": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io/v1"  // Включить /v1 для OpenAI
  },

  // Настройки модели
  "cline.defaultModel": "claude-sonnet-4",
  "cline.contextWindow": 200000,
  "cline.temperature": 0.5,
  "cline.maxTokens": 4096,

  // Функции
  "cline.features": {
    "autoContext": true,
    "fileWatcher": true,
    "terminalIntegration": true,
    "gitIntegration": true,
    "multiFileEdit": true
  },

  // Автономный режим
  "cline.autonomousMode": {
    "enabled": true,
    "requireApproval": "perFile",  // "perFile", "perAction", "never"
    "maxIterations": 10
  },

  // Настройки терминала
  "cline.terminal": {
    "autoExecute": false,
    "requireApproval": true,
    "allowedCommands": ["npm", "git", "docker"],
    "blockedCommands": ["rm -rf", "sudo"]
  },

  // Настройки контекста
  "cline.context": {
    "language": "typescript",
    "frameworks": ["react", "next.js"],
    "codeStyle": "airbnb",
    "maxContextFiles": 20,
    "includeGitInfo": true
  },

  // Пользовательские промпты
  "cline.customPrompts": {
    "explain": "Объяснить этот код подробно",
    "test": "Сгенерировать комплексные тесты",
    "review": "Проверить на баги и улучшения",
    "refactor": "Рефакторинг для лучшей поддерживаемости",
    "doc": "Сгенерировать подробную документацию"
  },

  // Настройки UI
  "cline.ui": {
    "theme": "auto",
    "position": "sidebar",  // "sidebar", "panel", "editor"
    "showStatusBar": true,
    "showInlineHints": true
  }
}
```

### Руководство по выбору модели

| Задача                | Рекомендуемая модель       | API-провайдер | Почему               |
| --------------------- | -------------------------- | ------------- | -------------------- |
| **Проверка кода**     | `claude-sonnet-4`          | Anthropic     | Отличный анализ      |
| **Рефакторинг**       | `claude-opus-4-1-20250805` | Anthropic     | Лучшее рассуждение   |
| **Быстрые задачи**    | `gpt-4o-mini`              | OpenAI        | Самый быстрый        |
| **Веб-разработка**    | `gpt-5`                    | OpenAI        | Отлично для JS/React |
| **Документация**      | `gpt-5`                    | OpenAI        | Четкое написание     |
| **Системный код**     | `gemini-2.5-pro`           | OpenAI        | Точная логика        |
| **Автономные задачи** | `claude-opus-4-1-20250805` | Anthropic     | Сложное рассуждение  |

## Проверка

### Тест 1: Базовый чат

1. Откройте панель Cline в VSCode
2. Начните новый сеанс
3. Введите: `Какую модель вы используете?`
4. Должен ответить с именем модели и подтверждением MegaLLM

### Тест 2: Объяснение кода

1. Выберите функцию в вашем коде
2. В Cline: `/explain`
3. Должен предоставить подробное объяснение

### Тест 3: Интеграция с терминалом

1. В Cline: `Перечислить все файлы в текущем каталоге`
2. Cline должен предложить: `ls -la`
3. Одобрить выполнение
4. Должен показать список файлов

### Тест 4: Многофайловая задача

1. Запрос: `Добавить обработку ошибок ко всем API-маршрутам`
2. Cline анализирует несколько файлов
3. Показывает предлагаемые изменения для каждого
4. Одобрить и применить

### Тест 5: Проверка статуса

Выполните команду: `/status`

Должен показать:

```
✓ Подключено к MegaLLM
✓ Модель: claude-sonnet-4
✓ Контекст: 200k токенов доступно
✓ Терминал: Включен
✓ Git: Включен
```

## Устранение неполадок

<AccordionGroup>
  <Accordion title="Модель не отвечает">
    **Симптомы:**

    * Сообщения отправлены, но нет ответа
    * Ошибка "Model initialization failed"
    * Тайм-аут подключения

    **Решения:**

    1. **Проверьте конфигурацию API-провайдера:**
       ```json  theme={null}
       // Для моделей Claude
       {
         "cline.apiProvider": "anthropic",
         "cline.anthropic": {
           "baseURL": "https://ai.megallm.io"  // Без /v1
         }
       }

       // Для моделей GPT
       {
         "cline.apiProvider": "openai",
         "cline.openai": {
           "baseURL": "https://ai.megallm.io/v1"  // Включить /v1
         }
       }
       ```

    2. **Проверьте доступность модели:**
       ```bash  theme={null}
       curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
            https://ai.megallm.io/v1/models | jq '.data[].id'
       ```

    3. **Проверьте правильность имени модели:**
       * `claude-sonnet-4` <Icon icon="check" />
       * `claude-sonnet-3` <Icon icon="xmark" /> (старая версия)
       * `gpt-5` <Icon icon="check" />
       * `gpt-5.0` <Icon icon="xmark" /> (неверный формат)

    4. **Сбросьте Cline:**
       * Command Palette: `Cline: Reset Configuration`
       * Перезапустите VSCode
       * Настройте заново с нуля
  </Accordion>

  <Accordion title="Команды терминала не выполняются">
    **Симптомы:**

    * Cline предлагает команды, но не выполняет
    * Сообщение "Terminal integration disabled"

    **Решения:**

    1. **Включите интеграцию с терминалом:**
       ```json  theme={null}
       {
         "cline.features": {
           "terminalIntegration": true
         }
       }
       ```

    2. **Проверьте разрешения терминала:**
       * VSCode Settings → поиск "terminal allow"
       * Включите: `Terminal > Integrated: Allow Workspace Configuration`

    3. **Проверьте разрешенные команды:**
       ```json  theme={null}
       {
         "cline.terminal": {
           "autoExecute": false,
           "requireApproval": true,
           "allowedCommands": ["npm", "git", "docker"]
         }
       }
       ```

    4. **Протестируйте вручную:**
       * Откройте терминал VSCode
       * Попробуйте выполнить команды напрямую
       * Убедитесь, что терминал работает, прежде чем использовать Cline
  </Accordion>

  <Accordion title="Превышено окно контекста">
    **Симптомы:**

    * Ошибка "Context too large"
    * Cline не может включить все файлы

    **Решения:**

    1. **Уменьшите окно контекста:**
       ```json  theme={null}
       {
         "cline.contextWindow": 100000  // Уменьшить с 200000
       }
       ```

    2. **Ограничьте включенные файлы:**
       ```json  theme={null}
       {
         "cline.context": {
           "maxContextFiles": 10  // Уменьшить с 20
         }
       }
       ```

    3. **Будьте более конкретными:**
       Вместо: "Проверить весь проект"
       Скажите: "Проверить только модуль аутентификации"

    4. **Используйте меньшую модель:**
       ```json  theme={null}
       {
         "cline.defaultModel": "gpt-4o-mini"  // Меньший контекст
       }
       ```
  </Accordion>

  <Accordion title="Автономный режим завис">
    **Симптомы:**

    * Cline продолжает итерации без прогресса
    * Задача никогда не завершается
    * Повторяются те же ошибки

    **Решения:**

    1. **Ограничьте максимальное количество итераций:**
       ```json  theme={null}
       {
         "cline.autonomousMode": {
           "maxIterations": 5  // Уменьшить с 10
         }
       }
       ```

    2. **Требуйте больше одобрений:**
       ```json  theme={null}
       {
         "cline.autonomousMode": {
           "requireApproval": "perAction"  // Вместо "perFile"
         }
       }
       ```

    3. **Остановите и перезапустите:**
       * Нажмите кнопку "Stop" в панели Cline
       * Проверьте, что пытался сделать Cline
       * Предоставьте более конкретные инструкции

    4. **Разбейте задачу:**
       Вместо: "Рефакторинг всей системы аутентификации"
       Попробуйте: "Сначала просто обновите конечную точку входа для использования JWT"
  </Accordion>

  <Accordion title="API-ключ не распознается">
    **Симптомы:**

    * Ошибка "Invalid API key"
    * 401 Unauthorized
    * Отказ в подключении

    **Решения:**

    1. **Проверьте ключ в окружении:**
       ```bash  theme={null}
       echo $MEGALLM_API_KEY
       # Должно вывести: sk-mega-...
       ```

    2. **Перезагрузите VSCode:**
       * Закройте все окна VSCode
       * Перезагрузите оболочку: `source ~/.bashrc`
       * Откройте VSCode снова

    3. **Установите ключ напрямую (для тестирования):**
       ```json  theme={null}
       {
         "cline.anthropic": {
           "apiKey": "sk-mega-your-actual-key"  // Временно для тестирования
         }
       }
       ```

    4. **Протестируйте ключ вручную:**
       ```bash  theme={null}
       curl -X POST https://ai.megallm.io/v1/chat/completions \
         -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"hi"}]}'
       ```

    5. **Проверьте, что ключ активен:**
       * Войдите в [Dashboard](https://megallm.io/dashboard)
       * Проверьте, что ключ не отозван/не истек
  </Accordion>

  <Accordion title="Конфликты с другими расширениями">
    **Симптомы:**

    * Появляются множественные предложения ИИ
    * Сочетания клавиш не работают
    * Проблемы с производительностью

    **Решения:**

    1. **Отключите конфликтующие расширения:**
       ```json  theme={null}
       {
         "github.copilot.enable": false,
         "tabnine.disable": true,
         "aws.codeWhisperer.enabled": false,
         "kilocode.enable": false
       }
       ```

    2. **Проверьте конфликты сочетаний клавиш:**
       * File → Preferences → Keyboard Shortcuts
       * Найдите команды Cline
       * Разрешите все конфликты

    3. **Попробуйте по одному расширению:**
       * Отключите все расширения ИИ
       * Включите только Cline
       * Протестируйте функциональность
       * Включайте другие по одному
  </Accordion>
</AccordionGroup>

## Лучшие практики

<CardGroup cols={2}>
  <Card title="Используйте переменные окружения" icon="key">
    Храните API-ключи в переменных окружения: `${env:MEGALLM_API_KEY}`
  </Card>

  <Card title="Конфигурация для конкретного проекта" icon="folder">
    Разные модели для каждого проекта в `.vscode/settings.json`
  </Card>

  <Card title="Одобрение для терминала" icon="shield">
    Всегда требуйте одобрения для команд терминала
  </Card>

  <Card title="Начинайте с малого" icon="seedling">
    Сначала протестируйте автономный режим на небольших задачах
  </Card>

  <Card title="Следите за контекстом" icon="chart-line">
    Следите за использованием контекста, чтобы избежать превышения лимитов
  </Card>

  <Card title="Интеграция Git" icon="code-branch">
    Позвольте Cline управлять git-операциями за вас
  </Card>
</CardGroup>

## Продвинутые советы

### Пользовательские slash-команды

Создайте ярлыки для общих задач:

```json  theme={null}
{
  "cline.customCommands": {
    "/deploy": "Собрать приложение, запустить тесты и развернуть на staging",
    "/review-pr": "Проверить все измененные файлы в этом PR на баги и улучшения",
    "/setup-test": "Настроить структуру тестовых файлов и написать начальные тесты",
    "/doc-api": "Сгенерировать документацию API из комментариев кода"
  }
}
```

Использование: Введите `/deploy` в чате Cline

### Осведомленность о контексте

Улучшите понимание Cline:

```json  theme={null}
{
  "cline.context": {
    "projectType": "microservices",
    "architecture": "event-driven",
    "databases": ["postgresql", "redis"],
    "testingFramework": "jest",
    "cicd": "github-actions"
  }
}
```

### Интеграция с Git

Позвольте Cline управлять рабочими процессами git:

```json  theme={null}
{
  "cline.git": {
    "autoCommit": false,
    "commitMessageStyle": "conventional",
    "autoCreateBranches": true,
    "branchPrefix": "cline/"
  }
}
```

## Следующие шаги

<CardGroup cols={3}>
  <Card title="Настройка Kilocode" icon="code" href="/ru/agents/kilocode">
    Настройте Kilocode для автодополнения кода
  </Card>

  <Card title="Настройка RooCode" icon="robot" href="/ru/agents/roocode">
    Настройте автономное приложение RooCode
  </Card>

  <Card title="Каталог моделей" icon="layer-group" href="/ru/home/models">
    Просмотрите все доступные модели
  </Card>

  <Card title="Другие агенты" icon="window" href="/ru/agents/overview">
    Просмотрите все CLI и GUI агенты
  </Card>

  <Card title="Справочник API" icon="book" href="/ru/api-reference/introduction">
    Изучите документацию API
  </Card>

  <Card title="Сообщество Discord" icon="discord" href="https://discord.gg/devsindia">
    Присоединяйтесь для поддержки
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt