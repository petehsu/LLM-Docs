# Конфигурация OpenCode

> Настройка OpenCode для использования MegaLLM

OpenCode использует формат конфигурации JSON и поддерживает как системный (глобальный), так и проектный (локальный) уровни конфигурации.

## Файлы конфигурации

### Системная конфигурация

**Расположение**: `~/.config/opencode/opencode.json`

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  },
  "autoupdate": true,
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
```

<Info>
  CLI автоматически получает доступные модели из MegaLLM и добавляет их в раздел `provider.anthropic.models`.
</Info>

### Конфигурация на уровне проекта

**Расположение**: `./opencode.json` (в корне проекта)

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  },
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
```

<Tip>
  Используйте конфигурацию на уровне проекта для настройки параметров для каждого проекта, сохраняя глобальные значения по умолчанию. Синтаксис `{env:MEGALLM_API_KEY}` ссылается на переменную окружения.
</Tip>

## Ручная настройка

### Ручная настройка на системном уровне

```bash  theme={null}
# 1. Создайте каталог
mkdir -p ~/.config/opencode

# 2. Создайте файл конфигурации
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
  },
  "autoupdate": true,
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
EOF

# 3. Установите переменную окружения
echo 'export MEGALLM_API_KEY="ваш-api-ключ"' >> ~/.bashrc
source ~/.bashrc

# 4. Проверьте
cat ~/.config/opencode/opencode.json | jq .
```

### Ручная настройка на уровне проекта

```bash  theme={null}
# 1. Перейдите в проект
cd ~/projects/my-project

# 2. Создайте файл конфигурации
cat > opencode.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  },
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
EOF

# 3. Установите переменную окружения (если еще не установлена)
echo 'export MEGALLM_API_KEY="ваш-api-ключ"' >> ~/.bashrc
source ~/.bashrc

# 4. Добавьте в .gitignore
echo "opencode.json" >> .gitignore
```

## Приоритет конфигурации

OpenCode загружает конфигурацию в следующем порядке (от высшего к низшему приоритету):

<Steps>
  <Step title="Переменные окружения">
    Переменная окружения `MEGALLM_API_KEY` (ссылка через `{env:MEGALLM_API_KEY}` в конфигурации)
  </Step>

  <Step title="Конфигурация на уровне проекта">
    `./opencode.json` в текущем каталоге
  </Step>

  <Step title="Системная конфигурация">
    `~/.config/opencode/opencode.json` в домашнем каталоге
  </Step>
</Steps>

## Параметры конфигурации

### Настройки провайдера

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "models": {
        "gpt-5": {
          "id": "gpt-5",
          "name": "GPT-5 (Via MegaLLM)"
        },
        "claude-sonnet-4": {
          "id": "claude-sonnet-4",
          "name": "Claude Sonnet 4 (Via MegaLLM)"
        }
      },
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  }
}
```

<Info>
  CLI автоматически получает и заполняет объект `models` из MegaLLM API. Вы также можете вручную добавлять или переопределять конкретные модели.
</Info>

### Настройки инструментов

```json  theme={null}
{
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  },
  "autoupdate": true
}
```

**Доступные модели:**

* `gpt-5` - Последняя модель GPT
* `gpt-4` - GPT-4
* `claude-opus-4-1-20250805` - Claude Opus
* `claude-sonnet-4` - Claude Sonnet
* `gemini-2.5-pro` - Gemini Pro
* См. [Каталог моделей](/ru/home/models) для полного списка

### Полный пример

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "models": {
        "gpt-5": {
          "id": "gpt-5",
          "name": "GPT-5 (Via MegaLLM)"
        },
        "gpt-4": {
          "id": "gpt-4",
          "name": "GPT-4 (Via MegaLLM)"
        },
        "claude-sonnet-4": {
          "id": "claude-sonnet-4",
          "name": "Claude Sonnet 4 (Via MegaLLM)"
        }
      },
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  },
  "autoupdate": true,
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
```

## Конфигурация для команды

Для командных проектов используйте переменные окружения, чтобы API-ключи не попадали в систему контроля версий:

**Общая конфигурация** (`opencode.json` - сохраняется в git):

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  },
  "autoupdate": true,
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
```

**Добавьте в `.gitignore`**:

```
opencode.json
```

**Инструкции по настройке для команды** (`README.md`):

````markdown  theme={null}
# Настройка OpenCode

## Требования
1. Получите API-ключ MegaLLM на https://megallm.io/dashboard
2. Установите OpenCode: `npm install -g opencode-ai`

## Настройка
Установите переменную окружения MEGALLM_API_KEY:
```bash
export MEGALLM_API_KEY="ваш-api-ключ-здесь"
````

Добавьте в конфигурацию вашей оболочки (\~/.bashrc или \~/.zshrc), чтобы сделать постоянной.

````

## Переменные окружения

MegaLLM CLI устанавливает переменную окружения `MEGALLM_API_KEY` для OpenCode:

```bash
# Устанавливается автоматически CLI
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
````

На эту переменную окружения ссылаются в конфигурации OpenCode с помощью `{env:MEGALLM_API_KEY}`.

Добавьте в конфигурацию вашей оболочки:

```bash  theme={null}
# ~/.bashrc или ~/.zshrc
export MEGALLM_API_KEY="sk-mega-ваш-api-ключ-здесь"
```

### Проверка переменных окружения

```bash  theme={null}
echo $MEGALLM_API_KEY
# Вывод: sk-mega-ваш-api-ключ-здесь
```

## Проверка

### Проверка файлов конфигурации

```bash  theme={null}
# Системная конфигурация
cat ~/.config/opencode/opencode.json | jq .

# Проектная конфигурация
cat opencode.json | jq .
cat opencode.local.json | jq .

# Проверьте права доступа к файлам
ls -la ~/.config/opencode/opencode.json
ls -la opencode.json
```

### Проверка синтаксиса JSON

```bash  theme={null}
# Проверка JSON
jq . ~/.config/opencode/opencode.json

# Должен показать отформатированный JSON или ошибку, если недействителен
```

### Тестирование соединения с API

```bash  theme={null}
# Тестирование с MEGALLM_API_KEY
curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
     -H "Content-Type: application/json" \
     https://ai.megallm.io/v1/models

# Должен вернуть список доступных моделей
```

### Тестирование OpenCode

```bash  theme={null}
# Запуск OpenCode
opencode

# Проверка версии
opencode --version

# Тестирование с файлом
echo "console.log('test')" > test.js
opencode test.js
```

## Устранение неполадок

<AccordionGroup>
  <Accordion title="Конфигурация не загружается">
    **Проверьте расположение файлов:**

    ```bash  theme={null}
    # Системная конфигурация
    ls -la ~/.config/opencode/opencode.json

    # Проектная конфигурация
    ls -la opencode.json
    ```

    **Проверьте синтаксис JSON:**

    ```bash  theme={null}
    jq . ~/.config/opencode/opencode.json
    # Должен показать отформатированный JSON
    ```

    **Убедитесь, что вы находитесь в правильном каталоге:**

    ```bash  theme={null}
    pwd
    # Должен быть каталог вашего проекта для конфигурации на уровне проекта
    ```
  </Accordion>

  <Accordion title="API-ключ не распознается">
    **Проверьте переменную окружения:**

    ```bash  theme={null}
    echo $MEGALLM_API_KEY
    ```

    Если пусто, установите её:

    ```bash  theme={null}
    export MEGALLM_API_KEY="ваш-api-ключ"
    echo 'export MEGALLM_API_KEY="ваш-api-ключ"' >> ~/.bashrc
    source ~/.bashrc
    ```

    **Проверьте формат ключа:**

    * Должен начинаться с `sk-mega-`
    * Не менее 20 символов
    * Без лишних пробелов или кавычек

    **Протестируйте ключ:**

    ```bash  theme={null}
    curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="Неправильный базовый URL">
    **Проверьте конфигурацию:**

    ```bash  theme={null}
    jq '.provider.anthropic.options.baseURL' ~/.config/opencode/opencode.json
    # Должен показать: "https://ai.megallm.io/v1"
    ```

    **Распространенные ошибки:**

    ```json  theme={null}
    {
      "provider": {
        "anthropic": {
          "options": {
            "baseURL": "https://ai.megallm.io/v1"  // <Icon icon="check" /> Правильно
            // "baseURL": "https://ai.megallm.io/v1/"  // <Icon icon="xmark" /> Неправильно (завершающий слэш)
            // "baseURL": "https://ai.megallm.io"  // <Icon icon="xmark" /> Неправильно (отсутствует /v1)
          }
        }
      }
    }
    ```
  </Accordion>

  <Accordion title="Проектная конфигурация не переопределяет системную">
    **Проверьте наличие проектной конфигурации:**

    ```bash  theme={null}
    ls -la opencode.json
    ```

    **Убедитесь в правильной структуре JSON:**
    Проектная конфигурация должна использовать ту же структуру, что и системная, с `provider.anthropic.options`.
  </Accordion>

  <Accordion title="Ошибки синтаксиса JSON">
    **Распространенные ошибки JSON:**

    ```json  theme={null}
    // <Icon icon="xmark" /> Неправильно - завершающая запятая
    {
      "provider": {
        "anthropic": {
          "options": {
            "apiKey": "{env:MEGALLM_API_KEY}",
          }
        }
      }
    }

    // <Icon icon="check" /> Правильно
    {
      "provider": {
        "anthropic": {
          "options": {
            "apiKey": "{env:MEGALLM_API_KEY}"
          }
        }
      }
    }

    // <Icon icon="xmark" /> Неправильно - одинарные кавычки
    {
      'provider': {
        'anthropic': {
          'options': {
            'apiKey': '{env:MEGALLM_API_KEY}'
          }
        }
      }
    }

    // <Icon icon="check" /> Правильно - двойные кавычки
    {
      "provider": {
        "anthropic": {
          "options": {
            "apiKey": "{env:MEGALLM_API_KEY}"
          }
        }
      }
    }
    ```

    **Валидация:**

    ```bash  theme={null}
    jq . ~/.config/opencode/opencode.json
    # Покажет ошибку, если невалидный
    ```
  </Accordion>
</AccordionGroup>

## Лучшие практики

<CardGroup cols={2}>
  <Card title="Используйте локальную конфигурацию для API-ключей" icon="key">
    Храните API-ключи в `opencode.local.json` и добавьте в `.gitignore`
  </Card>

  <Card title="Делитесь базовой конфигурацией" icon="users">
    Коммитьте `opencode.json` без API-ключей для согласованности команды
  </Card>

  <Card title="Настройки для конкретного проекта" icon="folder">
    Используйте проектную конфигурацию для контекста и настроек конкретного проекта
  </Card>

  <Card title="Валидируйте JSON" icon="check">
    Всегда валидируйте синтаксис JSON после ручного редактирования
  </Card>
</CardGroup>

## Продвинутое использование

### Несколько профилей

```bash  theme={null}
# Создайте разные профили
cat > ~/.config/opencode/opencode.dev.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY_DEV}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  }
}
EOF

cat > ~/.config/opencode/opencode.prod.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY_PROD}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  }
}
EOF

# Установите переменные окружения
export MEGALLM_API_KEY_DEV="sk-mega-dev-key"
export MEGALLM_API_KEY_PROD="sk-mega-prod-key"

# Переключайте профили
alias opencode-dev='cp ~/.config/opencode/opencode.dev.json ~/.config/opencode/opencode.json && opencode'
alias opencode-prod='cp ~/.config/opencode/opencode.prod.json ~/.config/opencode/opencode.json && opencode'
```

### Конфигурация CI/CD

```yaml  theme={null}
# Пример GitHub Actions
- name: Настройка OpenCode
  env:
    MEGALLM_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
  run: |
    mkdir -p ~/.config/opencode
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
```

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Конфигурация Claude Code" icon="robot" href="/ru/cli/claude-config">
    Настройте Claude Code
  </Card>

  <Card title="Конфигурация Codex" icon="code" href="/ru/cli/codex-config">
    Настройте Codex/Windsurf
  </Card>

  <Card title="Примеры" icon="code-branch" href="/ru/cli/examples">
    Посмотрите практические примеры
  </Card>

  <Card title="Конфигурация всех агентов" icon="window" href="/ru/agents/overview">
    Настройте все CLI и GUI агенты
  </Card>

  <Card title="Каталог моделей" icon="layer-group" href="/ru/home/models">
    Просмотрите доступные модели
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt