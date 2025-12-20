# Установка

> Узнайте, как установить и запустить CLI MegaLLM в вашей системе.

## Быстрая установка

Самый быстрый способ начать работу - установка не требуется:

```bash  theme={null}
npx megallm@latest
```

Это запускает последнюю версию напрямую без постоянной установки.

## Методы установки

### Метод 1: NPX (Рекомендуется)

Запуск напрямую без установки:

```bash  theme={null}
npx megallm@latest
```

**Преимущества:**

* Установка не требуется
* Всегда использует последнюю версию
* Не занимает дисковое пространство
* Идеально для разового или периодического использования

**Использование:**

```bash  theme={null}
# Запустить последнюю версию
npx megallm@latest

# Запустить конкретную версию
npx megallm@2.5.9

# С переменными окружения
NO_BANNER=1 npx megallm@latest
```

### Метод 2: Глобальная установка

Установите один раз, используйте в любое время:

```bash  theme={null}
npm install -g megallm
```

Затем запустите с помощью:

```bash  theme={null}
megallm
```

**Преимущества:**

* Быстрый запуск (уже установлено)
* Работает офлайн (после первоначальной установки)
* Более короткая команда
* Хорошо для частого использования

**Обновление:**

```bash  theme={null}
npm update -g megallm
```

**Удаление:**

```bash  theme={null}
npm uninstall -g megallm
```

### Метод 3: Локальная установка проекта

Установка в качестве зависимости проекта:

```bash  theme={null}
npm install --save-dev megallm
```

Добавьте в скрипты `package.json`:

```json  theme={null}
{
  "scripts": {
    "setup-megallm": "megallm"
  }
}
```

Запустите с помощью:

```bash  theme={null}
npm run setup-megallm
```

**Лучше всего для:**

* Командных проектов со стандартизированной настройкой
* Установок с фиксированной версией
* CI/CD конвейеров

## Системные требования

### Требуется

<Info>
  **Node.js 18.0.0 или выше** требуется для запуска MegaLLM CLI
</Info>

Проверьте версию Node.js:

```bash  theme={null}
node --version
```

Если вам нужно установить или обновить Node.js:

<Tabs>
  <Tab title="macOS">
    **Используя Homebrew:**

    ```bash  theme={null}
    brew install node
    ```

    **Используя nvm (рекомендуется):**

    ```bash  theme={null}
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install 18
    nvm use 18
    ```

    **Официальный установщик:**
    Скачайте с [nodejs.org](https://nodejs.org/)
  </Tab>

  <Tab title="Linux">
    **Ubuntu/Debian:**

    ```bash  theme={null}
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

    **Fedora:**

    ```bash  theme={null}
    sudo dnf install nodejs
    ```

    **Используя nvm (рекомендуется):**

    ```bash  theme={null}
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install 18
    nvm use 18
    ```
  </Tab>

  <Tab title="Windows">
    **Официальный установщик:**
    Скачайте с [nodejs.org](https://nodejs.org/)

    **Используя Chocolatey:**

    ```powershell  theme={null}
    choco install nodejs
    ```

    **Используя nvm-windows:**

    ```powershell  theme={null}
    nvm install 18
    nvm use 18
    ```
  </Tab>
</Tabs>

### Поддерживаемые платформы

| Платформа   | Статус                                 | Примечания                |
| ----------- | -------------------------------------- | ------------------------- |
| **macOS**   | <Icon icon="check" /> Полная поддержка | Intel и Apple Silicon     |
| **Linux**   | <Icon icon="check" /> Полная поддержка | Все основные дистрибутивы |
| **Windows** | <Icon icon="check" /> Полная поддержка | Native и WSL              |

### Поддерживаемые оболочки

| Оболочка       | Статус                                 | Платформа     |
| -------------- | -------------------------------------- | ------------- |
| **bash**       | <Icon icon="check" /> Полная поддержка | Все платформы |
| **zsh**        | <Icon icon="check" /> Полная поддержка | macOS, Linux  |
| **fish**       | <Icon icon="check" /> Полная поддержка | macOS, Linux  |
| **PowerShell** | <Icon icon="check" /> Полная поддержка | Windows       |

## Проверка

После установки проверьте, что все работает:

```bash  theme={null}
# Проверить версию Node.js
node --version
# Должно показать: v18.0.0 или выше

# Проверить версию npm
npm --version
# Должно показать: 9.0.0 или выше

# Запустить CLI
npx megallm@latest --version
# или если установлено глобально:
megallm --version
```

## Разрешения

### macOS/Linux

CLI требуется доступ на запись к:

* `~/.claude/` - конфигурация Claude Code
* `~/.codex/` - конфигурация Codex
* `~/.config/opencode/` - конфигурация OpenCode
* `~/.bashrc`, `~/.zshrc`, и т.д. - файлы конфигурации оболочки

Если вы сталкиваетесь с ошибками разрешений:

```bash  theme={null}
# Исправить владение
sudo chown -R $USER ~/.claude ~/.codex ~/.config/opencode

# Исправить разрешения
chmod -R 755 ~/.claude ~/.codex ~/.config/opencode
```

### Windows

Запустите терминал от имени администратора, если возникают проблемы с разрешениями.

## Установка инструментов ИИ

CLI может автоматически установить инструменты кодирования ИИ, если они отсутствуют. Требуемые разрешения:

```bash  theme={null}
# Разрешение на глобальную установку NPM
npm install -g @anthropic-ai/claude-code
npm install -g @codeium/windsurf
npm install -g opencode
```

Если у вас нет разрешения на глобальные установки:

**Вариант 1: Используйте npx**

```bash  theme={null}
# Вместо глобальной установки используйте npx
npx @anthropic-ai/claude-code
```

**Вариант 2: Исправьте разрешения npm**

```bash  theme={null}
# macOS/Linux
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Устранение неполадок при установке

<AccordionGroup>
  <Accordion title="npm: команда не найдена">
    Node.js не установлен или не в вашем PATH.

    **Исправление:**

    1. Установите Node.js с [nodejs.org](https://nodejs.org/)
    2. Перезапустите терминал
    3. Проверьте: `node --version`
  </Accordion>

  <Accordion title="npx: команда не найдена">
    npm не установлен или это старая версия.

    **Исправление:**

    ```bash  theme={null}
    # Обновить npm
    npm install -g npm@latest

    # Или переустановить Node.js
    ```
  </Accordion>

  <Accordion title="Ошибки разрешений EACCES">
    У вас нет разрешения на установку глобальных пакетов.

    **Исправление:**

    ```bash  theme={null}
    # macOS/Linux - Настроить npm для использования другого каталога
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
    source ~/.profile
    ```

    Или используйте `sudo` (не рекомендуется):

    ```bash  theme={null}
    sudo npm install -g megallm
    ```
  </Accordion>

  <Accordion title="Ошибки несоответствия версий">
    Вы используете старую версию.

    **Исправление:**

    ```bash  theme={null}
    # Очистить кэш npm
    npm cache clean --force

    # Обновить до последней версии
    npm update -g megallm

    # Или запустить последнюю с npx
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="Сетевые ошибки или ошибки прокси">
    npm не может подключиться к реестру.

    **Исправление:**

    ```bash  theme={null}
    # Проверить реестр npm
    npm config get registry

    # Установить реестр
    npm config set registry https://registry.npmjs.org/

    # Если за прокси
    npm config set proxy http://proxy.company.com:8080
    npm config set https-proxy http://proxy.company.com:8080
    ```
  </Accordion>
</AccordionGroup>

## Расширенная установка

### Оффлайн установка

Для сред без доступа в интернет:

1. **Скачать на машине с интернетом:**
   ```bash  theme={null}
   npm pack megallm
   # Создает: megallm-2.5.9.tgz
   ```

2. **Перенести файл на оффлайн машину**

3. **Установить из tarball:**
   ```bash  theme={null}
   npm install -g ./megallm-2.5.9.tgz
   ```

### Установка CI/CD

Для автоматизированных сред:

<CodeGroup>
  ```yaml GitHub Actions theme={null}
  - name: Setup Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '18'

  - name: Run MegaLLM CLI
    run: npx megallm@latest
    env:
      NO_BANNER: '1'
  ```

  ```yaml GitLab CI theme={null}
  setup_cli:
    image: node:18
    script:
      - npm install -g megallm@latest
      - megallm --version
  ```

  ```groovy Jenkins theme={null}
  pipeline {
    agent {
      docker {
        image 'node:18'
      }
    }
    stages {
      stage('Setup') {
        steps {
          sh 'npx megallm@latest'
        }
      }
    }
  }
  ```
</CodeGroup>

### Установка Docker

Включите в ваш Dockerfile:

```dockerfile  theme={null}
FROM node:18

# Установить megallm глобально
RUN npm install -g megallm

# Или использовать npx
RUN npx megallm@latest --version

# Настроить во время выполнения
CMD ["megallm"]
```

## Управление версиями

### Проверить текущую версию

```bash  theme={null}
# Если установлено глобально
megallm --version

# Используя npx
npx megallm@latest --version
```

### Установить конкретную версию

```bash  theme={null}
# Установить конкретную версию глобально
npm install -g megallm@2.5.9

# Запустить конкретную версию с npx
npx megallm@2.5.9
```

### История версий

Просмотреть все доступные версии:

```bash  theme={null}
npm view megallm versions
```

Просмотреть последнюю версию:

```bash  theme={null}
npm view megallm version
```

## Удаление

### Удалить глобальную установку

```bash  theme={null}
npm uninstall -g megallm
```

### Удалить файлы конфигурации

CLI создает файлы конфигурации, которые сохраняются после удаления:

```bash  theme={null}
# Удалить все конфигурации MegaLLM
rm -rf ~/.claude/settings.json ~/.claude.json
rm -rf ~/.codex/config.toml
rm -rf ~/.config/opencode/opencode.json

# Удалить переменные окружения
# Отредактируйте конфигурацию оболочки (~/.bashrc, ~/.zshrc, и т.д.)
# и удалите строки, содержащие:
# ANTHROPIC_BASE_URL
# ANTHROPIC_API_KEY
# MEGALLM_API_KEY
```

### Полная очистка

Чтобы полностью удалить все следы:

```bash  theme={null}
# Удалить CLI
npm uninstall -g megallm

# Удалить файлы конфигурации
rm -rf ~/.claude ~/.codex ~/.config/opencode

# Удалить конфигурации уровня проекта
rm -rf ./.claude ./opencode.json

# Очистить кэш npm
npm cache clean --force
```

## Следующие шаги

<CardGroup cols={2}>
  <Card title="Конфигурация" icon="gear" href="/ru/cli/configuration">
    Полный процесс настройки
  </Card>

  <Card title="Конфигурация" icon="gear" href="/ru/cli/configuration">
    Детали конфигурации
  </Card>

  <Card title="Примеры" icon="code" href="/ru/cli/examples">
    Примеры использования
  </Card>

  <Card title="Устранение неполадок" icon="circle-exclamation" href="/ru/cli/troubleshooting">
    Распространенные проблемы
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt