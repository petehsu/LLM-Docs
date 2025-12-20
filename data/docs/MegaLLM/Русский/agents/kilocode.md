# Конфигурация Kilocode

> Настройка расширения VSCode Kilocode для использования MegaLLM

Kilocode — мощное расширение для VSCode, предоставляющее автодополнение кода на основе AI, встроенный чат и действия с кодом. Настройте его для использования MegaLLM и получите доступ к множеству AI-моделей.

## Быстрая настройка

<Tabs>
  <Tab title="Через интерфейс настроек">
    ### Пошаговая настройка

    <Steps>
      <Step title="Откройте настройки VSCode">
        * Нажмите `Ctrl+Shift+P` (Windows/Linux) или `Cmd+Shift+P` (Mac)
        * Введите: `Preferences: Open Settings (UI)`
        * Найдите: `Kilocode`
      </Step>

      <Step title="Настройте API-провайдера">
        * **API Provider**: Выберите `Custom`
        * **Provider Name**: `MegaLLM`
        * **Base URL**: `https://ai.megallm.io/v1`
        * **API Key**: `sk-mega-your-api-key-here`
      </Step>

      <Step title="Выберите модель по умолчанию">
        * **Default Model**: `gpt-5` (или любая [поддерживаемая модель](/ru/home/models))
        * **Temperature**: `0.3` (ниже = более детерминированно)
        * **Max Tokens**: `500` (для автодополнений)
      </Step>

      <Step title="Включите функции">
        * <Icon icon="check" /> **Enable AutoComplete**
        * <Icon icon="check" /> **Enable Inline Chat**
        * <Icon icon="check" /> **Enable Code Actions**
        * <Icon icon="check" /> **Enable Suggestions**
      </Step>
    </Steps>
  </Tab>

  <Tab title="Через settings.json">
    ### Файл конфигурации

    **Расположение**: `.vscode/settings.json` или `~/.config/Code/User/settings.json`

    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-api-key-here"
      },
      "kilocode.defaultModel": "gpt-5",
      "kilocode.enableAutoComplete": true,
      "kilocode.enableInlineChat": true,
      "kilocode.enableCodeActions": true,
      "kilocode.modelSettings": {
        "temperature": 0.3,
        "maxTokens": 500,
        "topP": 0.9
      }
    }
    ```

    <Tip>
      Вы можете использовать переменные окружения: `"apiKey": "${env:MEGALLM_API_KEY}"`
    </Tip>
  </Tab>

  <Tab title="Используя переменные окружения">
    ### Безопасная конфигурация

    **Шаг 1**: Установите переменные окружения

    ```bash  theme={null}
    # Добавьте в ~/.bashrc, ~/.zshrc, или ~/.config/fish/config.fish
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"
    export MEGALLM_BASE_URL="https://ai.megallm.io/v1"
    ```

    **Шаг 2**: Перезагрузите оболочку

    ```bash  theme={null}
    source ~/.bashrc  # или ~/.zshrc
    ```

    **Шаг 3**: Укажите ссылки в settings.json

    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "${env:MEGALLM_BASE_URL}",
        "apiKey": "${env:MEGALLM_API_KEY}"
      },
      "kilocode.defaultModel": "gpt-5"
    }
    ```

    <Icon icon="check" /> API-ключ остается в безопасности и вне системы контроля версий
  </Tab>
</Tabs>

## Примеры сценариев

### Сценарий 1: Первая установка

Полная настройка с нуля:

<Steps>
  <Step title="Установите расширение Kilocode">
    1. Откройте VSCode
    2. Перейдите в Расширения: `Ctrl+Shift+X` / `Cmd+Shift+X`
    3. Найдите: `Kilocode`
    4. Нажмите **Install**
    5. Перезагрузите окно VSCode
  </Step>

  <Step title="Получите API-ключ MegaLLM">
    1. Посетите [Панель управления MegaLLM](https://megallm.io/dashboard)
    2. Перейдите в раздел **API Keys**
    3. Нажмите **Create New Key**
    4. Скопируйте ключ (начинается с `sk-mega-`)
    5. Сохраните его в безопасном месте
  </Step>

  <Step title="Настройте расширение">
    Откройте настройки (`Ctrl+,` / `Cmd+,`) и добавьте:

    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-actual-key-here"
      },
      "kilocode.defaultModel": "gpt-5"
    }
    ```
  </Step>

  <Step title="Проверьте конфигурацию">
    1. Создайте новый файл: `test.js`
    2. Введите комментарий: `// function to calculate fibonacci`
    3. Нажмите `Tab` для запуска автодополнения
    4. Должен появиться код, сгенерированный AI

    **Ожидаемый результат:**

    ```javascript  theme={null}
    // function to calculate fibonacci
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
    ```
  </Step>
</Steps>

***

### Сценарий 2: Конфигурация командного проекта

Настройка Kilocode для всей команды разработки:

**Структура проекта:**

```
my-project/
├── .vscode/
│   ├── settings.json          # Общая конфигурация (коммитится)
│   └── settings.local.json    # Личные ключи (в gitignore)
├── .gitignore
└── README.md
```

**Шаг 1: Создайте общую конфигурацию**

`.vscode/settings.json` (коммитится в git):

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gpt-5",
  "kilocode.modelSettings": {
    "temperature": 0.7,
    "maxTokens": 1000
  },
  "kilocode.enableAutoComplete": true,
  "kilocode.enableInlineChat": true
}
```

**Шаг 2: Настройте .gitignore**

```bash  theme={null}
# .gitignore
.vscode/settings.local.json
.env
```

**Шаг 3: Создайте инструкции по установке**

`README.md`:

````markdown  theme={null}
## Настройка Kilocode

### Предварительные требования
1. VSCode с установленным расширением Kilocode
2. API-ключ MegaLLM ([Получить](https://megallm.io/dashboard))

### Конфигурация

1. **Установите переменную окружения:**
   ```bash
   export MEGALLM_API_KEY="your-key-here"
````

Добавьте в конфигурацию вашей оболочки (\~/.bashrc или \~/.zshrc) для сохранения.

2. **Или создайте локальные настройки** (не коммитится):

   `.vscode/settings.local.json`:

   ```json  theme={null}
   {
     "kilocode.customProvider": {
       "apiKey": "your-key-here"
     }
   }
   ```

3. **Перезагрузите VSCode** и начинайте кодить!

### Проверка

Введите `// hello world function` и нажмите Tab.
Должен появиться код, сгенерированный AI.

````

**Шаг 4: Члены команды клонируют и настраивают**

```bash
# Рабочий процесс члена команды
git clone https://github.com/company/my-project.git
cd my-project

# Добавьте личный API-ключ
export MEGALLM_API_KEY="their-personal-key"

# Или создайте .vscode/settings.local.json с их ключом

# Откройте в VSCode
code .
````

***

### Сценарий 3: Выбор модели для конкретного проекта

Используйте разные модели для разных проектов:

**Проект по Data Science на Python:**

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "claude-opus-4-1-20250805",
  "kilocode.customPrompts": {
    "analyze": "Проанализируйте этот код обработки данных на эффективность",
    "doc": "Сгенерируйте docstring в стиле numpy для этой функции"
  }
}
```

**Проект на JavaScript/React:**

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gpt-5",
  "kilocode.customPrompts": {
    "component": "Сгенерируйте функциональный компонент React",
    "test": "Напишите тесты Jest для этого компонента"
  }
}
```

**Системное программирование (Rust/Go):**

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gemini-2.5-pro",
  "kilocode.modelSettings": {
    "temperature": 0.2  // Ниже для более точного системного кода
  }
}
```

***

### Сценарий 4: Работа с несколькими моделями

Динамическое переключение моделей в зависимости от задачи:

**Конфигурация:**

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gpt-5",
  "kilocode.modelProfiles": {
    "fast": {
      "model": "gpt-4o-mini",
      "temperature": 0.5,
      "maxTokens": 300
    },
    "quality": {
      "model": "claude-opus-4-1-20250805",
      "temperature": 0.3,
      "maxTokens": 1000
    },
    "creative": {
      "model": "gpt-5",
      "temperature": 0.9,
      "maxTokens": 800
    }
  }
}
```

**Использование:**

* **Утро (быстрое прототипирование)**: Используйте профиль `fast` с GPT-4o-mini
* **День (качественный код)**: Используйте профиль `quality` с Claude Opus
* **Документация**: Используйте профиль `creative` с более высокой температурой

**Переключение профилей через командную палитру:**

1. `Ctrl+Shift+P` / `Cmd+Shift+P`
2. `Kilocode: Switch Model Profile`
3. Выберите: `fast`, `quality` или `creative`

***

### Сценарий 5: Миграция с GitHub Copilot

Переход с Copilot на Kilocode с MegaLLM:

**Текущая настройка (Copilot):**

```json  theme={null}
{
  "github.copilot.enable": true
}
```

**Новая настройка (Kilocode + MegaLLM):**

<Steps>
  <Step title="Отключите Copilot">
    ```json  theme={null}
    {
      "github.copilot.enable": false
    }
    ```
  </Step>

  <Step title="Установите Kilocode">
    VSCode Расширения → Поиск "Kilocode" → Установить
  </Step>

  <Step title="Настройте MegaLLM">
    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "${env:MEGALLM_API_KEY}"
      },
      "kilocode.defaultModel": "gpt-5"
    }
    ```
  </Step>

  <Step title="Сравните опыт">
    **Преимущества перед Copilot:**

    * <Icon icon="check" /> Доступ к нескольким моделям (GPT, Claude, Gemini)
    * <Icon icon="check" /> Лучшие цены и без ограничений на места
    * <Icon icon="check" /> Встроенный чат для объяснений
    * <Icon icon="check" /> Индивидуальный выбор модели для каждого проекта
    * <Icon icon="check" /> Действия с кодом помимо автодополнения
  </Step>
</Steps>

## Параметры конфигурации

### Полный справочник

```json  theme={null}
{
  // Конфигурация провайдера
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },

  // Настройки модели
  "kilocode.defaultModel": "gpt-5",
  "kilocode.modelSettings": {
    "temperature": 0.3,        // 0.0-2.0: Ниже = более сфокусированно
    "maxTokens": 500,          // Макс. длина автодополнения
    "topP": 0.9,               // Nucleus sampling
    "frequencyPenalty": 0.0,   // Уменьшение повторений
    "presencePenalty": 0.0     // Поощрение разнообразия
  },

  // Переключатели функций
  "kilocode.enableAutoComplete": true,
  "kilocode.enableInlineChat": true,
  "kilocode.enableCodeActions": true,
  "kilocode.enableSuggestions": true,
  "kilocode.enableHover": true,

  // Поведение
  "kilocode.autoTrigger": true,
  "kilocode.debounceDelay": 300,     // мс перед запуском
  "kilocode.maxSuggestions": 3,
  "kilocode.showInlineHints": true,

  // Пользовательские промпты
  "kilocode.customPrompts": {
    "doc": "Сгенерируйте подробную документацию",
    "test": "Напишите юнит-тесты с высоким покрытием",
    "refactor": "Рефакторинг для лучшей поддерживаемости",
    "optimize": "Оптимизируйте производительность",
    "secure": "Проверьте на уязвимости безопасности"
  },

  // Сочетания клавиш
  "kilocode.shortcuts": {
    "acceptSuggestion": "Tab",
    "nextSuggestion": "Alt+]",
    "prevSuggestion": "Alt+[",
    "dismissSuggestion": "Esc",
    "triggerInlineChat": "Ctrl+K"
  },

  // Настройки интерфейса
  "kilocode.ui": {
    "showStatusBar": true,
    "showInlineButtons": true,
    "theme": "auto",               // auto, light, dark
    "position": "right"            // left, right
  }
}
```

### Руководство по выбору модели

| Задача                  | Рекомендуемая модель       | Причина                  |
| ----------------------- | -------------------------- | ------------------------ |
| **Автодополнение кода** | `gpt-4o-mini`              | Быстрая, экономичная     |
| **Сложная логика**      | `claude-opus-4-1-20250805` | Превосходное рассуждение |
| **Веб-разработка**      | `gpt-5`                    | Отличный JS/TS/React     |
| **Data Science**        | `claude-sonnet-4`          | Сильный анализ           |
| **Документация**        | `gpt-5`                    | Четкие объяснения        |
| **Алгоритмы**           | `gemini-2.5-pro`           | Математическая точность  |

См. [полный каталог моделей](/ru/home/models) для всех доступных вариантов.

## Проверка

### Тест 1: Базовое автодополнение

```javascript  theme={null}
// Введите этот комментарий и нажмите Tab:
// function to check if string is palindrome

// Ожидаемый результат:
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}
```

### Тест 2: Встроенный чат

1. Выделите функцию
2. Нажмите `Ctrl+K` (или `Cmd+K` на Mac)
3. Введите: `Explain this function`
4. Должно появиться объяснение в панели чата

### Тест 3: Действия с кодом

1. Щелкните правой кнопкой мыши на коде
2. Должны увидеть "Kilocode Actions" в контекстном меню
3. Опции: Объяснить, Улучшить, Сгенерировать тесты и т.д.

### Тест 4: Строка состояния

Проверьте правый нижний угол VSCode:

* Должно показывать: `Kilocode: Connected`
* Название модели: `gpt-5` (или ваша выбранная модель)
* Кликните, чтобы увидеть детали подключения

## Устранение неполадок

<AccordionGroup>
  <Accordion title="Автодополнения не появляются">
    **Симптомы:**

    * Нет предложений при вводе
    * Строка состояния показывает "Disconnected"

    **Решения:**

    1. **Проверьте API-ключ:**
       ```bash  theme={null}
       echo $MEGALLM_API_KEY
       # Должен вывести: sk-mega-...
       ```

    2. **Проверьте конфигурацию:**
       ```json  theme={null}
       {
         "kilocode.apiProvider": "custom",  // Должно быть "custom"
         "kilocode.customProvider": {
           "baseURL": "https://ai.megallm.io/v1"  // Без слэша в конце
         }
       }
       ```

    3. **Перезагрузите VSCode:**
       * `Ctrl+Shift+P` / `Cmd+Shift+P`
       * Запустите: `Developer: Reload Window`

    4. **Проверьте, что расширение включено:**
       * Панель расширений
       * Поиск: Kilocode
       * Должно показывать "Enabled"

    5. **Протестируйте API вручную:**
       ```bash  theme={null}
       curl -X POST https://ai.megallm.io/v1/chat/completions \
         -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'
       ```
  </Accordion>

  <Accordion title="Неправильные или низкокачественные автодополнения">
    **Симптомы:**

    * Автодополнения некорректны
    * Предложения не соответствуют стилю кода
    * Нерелевантные ответы

    **Решения:**

    1. **Настройте температуру:**
       ```json  theme={null}
       {
         "kilocode.modelSettings": {
           "temperature": 0.2  // Ниже = более сфокусированно (0.0-1.0)
         }
       }
       ```

    2. **Попробуйте другую модель:**
       ```json  theme={null}
       {
         "kilocode.defaultModel": "claude-sonnet-4"  // Лучше для анализа
       }
       ```

    3. **Увеличьте контекст:**
       ```json  theme={null}
       {
         "kilocode.modelSettings": {
           "maxTokens": 1000  // Более детальные автодополнения
         }
       }
       ```

    4. **Добавьте промпт для конкретного проекта:**
       ```json  theme={null}
       {
         "kilocode.systemPrompt": "Вы эксперт по TypeScript и React. Следуйте руководству по стилю Airbnb."
       }
       ```
  </Accordion>

  <Accordion title="Высокая задержка / медленные автодополнения">
    **Симптомы:**

    * Долгое ожидание предложений
    * Ошибки тайм-аута

    **Решения:**

    1. **Используйте более быструю модель:**
       ```json  theme={null}
       {
         "kilocode.defaultModel": "gpt-4o-mini"  // Самая быстрая
       }
       ```

    2. **Уменьшите максимум токенов:**
       ```json  theme={null}
       {
         "kilocode.modelSettings": {
           "maxTokens": 300  // Более быстрые автодополнения
         }
       }
       ```

    3. **Увеличьте задержку debounce:**
       ```json  theme={null}
       {
         "kilocode.debounceDelay": 500  // Ждите дольше перед запуском
       }
       ```

    4. **Проверьте сеть:**
       ```bash  theme={null}
       ping ai.megallm.io
       curl -w "@-" -o /dev/null -s https://ai.megallm.io/v1/models <<'EOF'
       time_total: %{time_total}s
       EOF
       ```
  </Accordion>

  <Accordion title="API-ключ не распознается">
    **Симптомы:**

    * Ошибка "Invalid API key"
    * 401 Unauthorized

    **Решения:**

    1. **Проверьте формат ключа:**
       * Должен начинаться с `sk-mega-`
       * Минимум 60 символов
       * Без пробелов или кавычек

    2. **Проверьте, что ключ активен:**
       * Войдите в [Панель управления](https://megallm.io/dashboard)
       * Перейдите в API Keys
       * Убедитесь, что ключ не отозван/истек

    3. **Протестируйте ключ напрямую:**
       ```bash  theme={null}
       curl -H "Authorization: Bearer sk-mega-your-key" \
            https://ai.megallm.io/v1/models
       ```

    4. **Перегенерируйте при необходимости:**
       * Панель управления → API Keys → Создать новый
       * Обновите конфигурацию новым ключом
  </Accordion>

  <Accordion title="Конфликты с другими расширениями">
    **Симптомы:**

    * Автодополнения Kilocode конфликтуют с другими AI-инструментами
    * Появляется несколько предложений

    **Решения:**

    1. **Отключите конфликтующие расширения:**
       ```json  theme={null}
       {
         "github.copilot.enable": false,
         "tabnine.disable": true,
         "aws.codeWhisperer.enabled": false
       }
       ```

    2. **Настройте клавиши запуска:**
       ```json  theme={null}
       {
         "kilocode.shortcuts": {
           "acceptSuggestion": "Alt+Enter"  // Отличается от Tab
         }
       }
       ```

    3. **Установите приоритет:**
       ```json  theme={null}
       {
         "editor.suggest.snippetsPreventQuickSuggestions": false,
         "editor.quickSuggestions": {
           "other": "on",
           "comments": "off",
           "strings": "on"
         }
       }
       ```
  </Accordion>
</AccordionGroup>

## Лучшие практики

<CardGroup cols={2}>
  <Card title="Используйте переменные окружения" icon="key">
    Храните API-ключи в переменных окружения, ссылайтесь с помощью `${env:MEGALLM_API_KEY}`
  </Card>

  <Card title="Модели для конкретных проектов" icon="folder">
    Настраивайте разные модели в `.vscode/settings.json` для каждого проекта
  </Card>

  <Card title="Низкая температура для кода" icon="temperature-low">
    Используйте 0.2-0.4 для генерации кода, 0.7-0.9 для документации
  </Card>

  <Card title="Мониторинг использования токенов" icon="chart-line">
    Проверяйте [Панель управления](https://megallm.io/dashboard) для оптимизации затрат
  </Card>
</CardGroup>

## Продвинутые советы

### Пользовательские сочетания клавиш

Добавьте в `keybindings.json`:

```json  theme={null}
[
  {
    "key": "ctrl+alt+k",
    "command": "kilocode.triggerSuggestion",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+alt+e",
    "command": "kilocode.explainCode",
    "when": "editorHasSelection"
  },
  {
    "key": "ctrl+alt+t",
    "command": "kilocode.generateTests",
    "when": "editorTextFocus"
  }
]
```

### Промпты для конкретного рабочего пространства

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.customPrompts": {
    "api": "Сгенерируйте RESTful API эндпоинт следуя нашим соглашениям",
    "schema": "Создайте модель схемы Prisma",
    "hook": "Сгенерируйте пользовательский хук React",
    "component": "Создайте styled-component с TypeScript"
  }
}
```

### Контекстно-зависимые автодополнения

```json  theme={null}
{
  "kilocode.contextSettings": {
    "includeOpenFiles": true,
    "includeImports": true,
    "includeTypes": true,
    "maxContextFiles": 5
  }
}
```

## Следующие шаги

<CardGroup cols={3}>
  <Card title="Настройка RooCode" icon="robot" href="/ru/agents/roocode">
    Настройте приложение RooCode
  </Card>

  <Card title="Настройка Cline" icon="terminal" href="/ru/agents/cline">
    Настройте расширение VSCode Cline
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