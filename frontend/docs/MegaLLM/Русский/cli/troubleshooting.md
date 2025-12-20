# Устранение неполадок

> Решения распространённых проблем при использовании MegaLLM CLI.

## Проблемы с установкой

<AccordionGroup>
  <Accordion title="npm: команда не найдена">
    Node.js и npm не установлены.

    **Решение:**

    <Tabs>
      <Tab title="macOS">
        ```bash  theme={null}
        # Использование Homebrew
        brew install node

        # Или скачайте с nodejs.org
        ```
      </Tab>

      <Tab title="Linux">
        ```bash  theme={null}
        # Ubuntu/Debian
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs

        # Fedora
        sudo dnf install nodejs
        ```
      </Tab>

      <Tab title="Windows">
        Скачайте и установите с [nodejs.org](https://nodejs.org/)
      </Tab>
    </Tabs>

    Проверьте установку:

    ```bash  theme={null}
    node --version
    npm --version
    ```
  </Accordion>

  <Accordion title="Ошибки EACCES permission denied">
    У вас нет прав для установки глобальных пакетов.

    **Решение 1: Настроить npm для использования другой директории (Рекомендуется)**

    ```bash  theme={null}
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'

    # Добавьте в ~/.bashrc или ~/.zshrc
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

    **Решение 2: Исправить права npm**

    ```bash  theme={null}
    sudo chown -R $USER /usr/local/lib/node_modules
    sudo chown -R $USER /usr/local/bin
    ```

    **Решение 3: Использовать npx (установка не требуется)**

    ```bash  theme={null}
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="Используется старая версия">
    Кэш npm содержит устаревшую версию.

    **Решение:**

    ```bash  theme={null}
    # Очистить кэш npm
    npm cache clean --force

    # Запустить последнюю версию
    npx megallm@latest

    # Или обновить глобальную установку
    npm update -g megallm

    # Проверить версию
    npx megallm@latest --version
    ```
  </Accordion>
</AccordionGroup>

## Проблемы с конфигурацией

<AccordionGroup>
  <Accordion title="Конфигурация не загружается">
    Конфигурационные файлы не читаются.

    **Диагностика:**

    ```bash  theme={null}
    # Проверьте, существуют ли файлы
    ls -la ~/.claude/settings.json
    ls -la ~/.codex/config.toml
    ls -la ~/.config/opencode/opencode.json

    # Проверьте конфигурации на уровне проекта
    ls -la .claude/settings.json
    ls -la opencode.json
    ```

    **Решения:**

    **1. Проверьте расположение файлов:**

    ```bash  theme={null}
    # Claude Code
    ~/.claude/settings.json          # Системный
    ./.claude/settings.json          # Проектный

    # Codex
    ~/.codex/config.toml             # Только системный

    # OpenCode
    ~/.config/opencode/opencode.json # Системный
    ./opencode.json                  # Проектный
    ```

    **2. Проверьте права доступа к файлам:**

    ```bash  theme={null}
    chmod 644 ~/.claude/settings.json
    chmod 644 ~/.codex/config.toml
    chmod 644 ~/.config/opencode/opencode.json
    ```

    **3. Проверьте синтаксис:**

    ```bash  theme={null}
    # JSON файлы
    jq . ~/.claude/settings.json

    # TOML файлы
    cat ~/.codex/config.toml
    # (установите toml-cli для валидации)
    ```

    **4. Проверьте рабочую директорию:**

    ```bash  theme={null}
    pwd
    # Для конфигураций на уровне проекта вы должны находиться в директории проекта
    ```
  </Accordion>

  <Accordion title="API ключ не распознаётся">
    API ключ не читается из конфигурации или переменных окружения.

    **Диагностика:**

    ```bash  theme={null}
    # Проверьте переменные окружения
    echo $ANTHROPIC_API_KEY
    echo $MEGALLM_API_KEY

    # Проверьте конфигурационные файлы
    jq '.env.ANTHROPIC_API_KEY' ~/.claude/settings.json
    cat ~/.codex/config.toml | grep MEGALLM_API_KEY
    jq '.provider.anthropic.options.apiKey' ~/.config/opencode/opencode.json
    ```

    **Решения:**

    **1. Перезагрузите конфигурацию оболочки:**

    ```bash  theme={null}
    source ~/.bashrc  # или ~/.zshrc
    # Или перезапустите терминал
    ```

    **2. Проверьте формат API ключа:**

    * Должен начинаться с `sk-mega-`
    * Минимум 20 символов
    * Без пробелов или кавычек вокруг ключа

    **3. Установите переменную окружения вручную:**

    ```bash  theme={null}
    # Claude Code
    export ANTHROPIC_API_KEY="sk-mega-your-key"

    # Codex/Windsurf и OpenCode
    export MEGALLM_API_KEY="sk-mega-your-key"
    ```

    **4. Проверьте API ключ напрямую:**

    ```bash  theme={null}
    curl -H "Authorization: Bearer sk-mega-your-key" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="Используется неправильный базовый URL">
    Инструмент подключается к неправильной конечной точке API.

    **Диагностика:**

    ```bash  theme={null}
    # Проверьте переменные окружения
    echo $ANTHROPIC_BASE_URL

    # Проверьте конфигурационные файлы
    jq '.env.ANTHROPIC_BASE_URL' ~/.claude/settings.json
    cat ~/.codex/config.toml | grep base_url
    jq '.provider.anthropic.options.baseURL' ~/.config/opencode/opencode.json
    ```

    **Решение:**

    Убедитесь, что базовый URL точно:

    ```
    https://ai.megallm.io
    ```

    **Распространённые ошибки:**

    ```bash  theme={null}
    # <Icon icon="xmark" /> Неправильно
    https://ai.megallm.io/      # Завершающий слэш
    https://ai.megallm.io/v1/   # Лишнее /v1/ (только для Codex/OpenCode)
    http://ai.megallm.io        # HTTP вместо HTTPS

    # <Icon icon="check" /> Правильно для Claude Code
    https://ai.megallm.io

    # <Icon icon="check" /> Правильно для Codex/OpenCode
    https://ai.megallm.io/v1
    ```

    **Исправление:**

    ```bash  theme={null}
    # Claude Code
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"

    # Обновите конфигурационные файлы правильным URL
    ```
  </Accordion>

  <Accordion title="Проблемы с приоритетом конфигурации">
    Используется неправильная конфигурация.

    **Понимание приоритета:**

    <Steps>
      <Step title="Переменные окружения (Высший)">
        Переменные, установленные в оболочке, всегда имеют приоритет
      </Step>

      <Step title="Конфигурация на уровне проекта">
        Конфигурация в текущей директории (`.claude/`, `opencode.json`)
      </Step>

      <Step title="Системная конфигурация (Низший)">
        Глобальная конфигурация в домашней директории (`~/.claude/`, `~/.codex/`, `~/.config/opencode/`)
      </Step>
    </Steps>

    **Диагностика:**

    ```bash  theme={null}
    # Проверьте, что и где установлено
    echo "ENV VAR: $ANTHROPIC_API_KEY"
    echo "PROJECT: $(jq -r '.env.ANTHROPIC_API_KEY' .claude/settings.json 2>/dev/null)"
    echo "SYSTEM: $(jq -r '.env.ANTHROPIC_API_KEY' ~/.claude/settings.json 2>/dev/null)"
    ```

    **Решение:**

    Удалите конфликтующие конфигурации или используйте правильный уровень приоритета:

    ```bash  theme={null}
    # Чтобы принудительно использовать проектную конфигурацию, отключите переменную окружения
    unset ANTHROPIC_API_KEY

    # Чтобы принудительно использовать переменную окружения, установите её
    export ANTHROPIC_API_KEY="sk-mega-your-key"
    ```
  </Accordion>
</AccordionGroup>

## Проблемы выполнения CLI

<AccordionGroup>
  <Accordion title="CLI зависает или замирает">
    CLI застревает во время выполнения.

    **Решения:**

    **1. Отмените и повторите попытку:**

    ```bash  theme={null}
    # Нажмите Ctrl+C для отмены
    # Затем запустите снова
    npx megallm@latest
    ```

    **2. Проверьте наличие запросов:**
    CLI может ожидать ввода. Ищите вопросы типа:

    * "Enter your API key:"
    * "Continue? (y/n)"

    **3. Запустите в режиме отладки:**

    ```bash  theme={null}
    DEBUG=* npx megallm@latest
    # Показывает подробные логи происходящего
    ```

    **4. Проверьте фоновые процессы:**

    ```bash  theme={null}
    # Проверьте, запущен ли другой экземпляр
    ps aux | grep megallm
    ```
  </Accordion>

  <Accordion title="Инструмент не обнаружен">
    CLI сообщает, что инструмент не установлен, хотя он установлен.

    **Диагностика:**

    ```bash  theme={null}
    # Проверьте, установлен ли инструмент глобально
    npm list -g --depth=0 | grep claude
    npm list -g --depth=0 | grep codex
    npm list -g --depth=0 | grep opencode

    # Проверьте, доступна ли команда
    which claude-code
    which codex
    which windsurf
    which opencode
    ```

    **Решения:**

    **1. Убедитесь в глобальной установке:**

    ```bash  theme={null}
    npm install -g @anthropic-ai/claude-code
    npm install -g @codeium/windsurf
    npm install -g opencode
    ```

    **2. Перезапустите терминал:**

    ```bash  theme={null}
    # Закройте и откройте терминал заново
    # Или перезагрузите конфигурацию оболочки
    source ~/.bashrc
    ```

    **3. Проверьте PATH:**

    ```bash  theme={null}
    echo $PATH
    # Должна включать директорию глобальных пакетов npm
    ```

    **4. Ручная конфигурация:**
    Если обнаружение не работает, настройте вручную без CLI.
  </Accordion>

  <Accordion title="Отказ в доступе при создании конфигурационных файлов">
    CLI не может записывать в конфигурационные директории.

    **Решение:**

    **macOS/Linux:**

    ```bash  theme={null}
    # Исправить владельца
    sudo chown -R $USER ~/.claude ~/.codex ~/.config/opencode

    # Исправить права
    chmod -R 755 ~/.claude ~/.codex ~/.config/opencode

    # Для проектных конфигураций
    chmod -R 755 .claude
    ```

    **Windows:**
    Запустите терминал от имени администратора или исправьте права папки в Проводнике.
  </Accordion>
</AccordionGroup>

## Проблемы подключения к API

<AccordionGroup>
  <Accordion title="Сбой подключения к API">
    Не удаётся подключиться к MegaLLM API.

    **Диагностика:**

    ```bash  theme={null}
    # Проверьте подключение к API
    curl -v https://ai.megallm.io/v1/models \
      -H "Authorization: Bearer sk-mega-your-key"
    ```

    **Решения:**

    **1. Проверьте интернет-соединение:**

    ```bash  theme={null}
    ping -c 3 ai.megallm.io
    ```

    **2. Проверьте брандмауэр/прокси:**

    ```bash  theme={null}
    # Если за прокси, установите прокси npm
    npm config set proxy http://proxy.company.com:8080
    npm config set https-proxy http://proxy.company.com:8080
    ```

    **3. Проверьте API ключ:**

    * Перейдите на [megallm.io/dashboard](https://megallm.io/dashboard)
    * Создайте новый API ключ
    * Обновите вашу конфигурацию

    **4. Проверьте статус API:**
    Посетите [megallm.io/status](https://megallm.io/status) для проверки статуса сервиса
  </Accordion>

  <Accordion title="Ошибка 401 Unauthorized">
    API ключ недействителен или истёк.

    **Решение:**

    **1. Создайте новый API ключ:**

    * Перейдите на [megallm.io/dashboard](https://megallm.io/dashboard)
    * Создайте новый API ключ
    * Обновите конфигурацию

    **2. Обновите конфигурацию:**

    ```bash  theme={null}
    # Запустите CLI снова для переконфигурирования
    npx megallm@latest

    # Или обновите вручную
    jq '.env.ANTHROPIC_API_KEY = "new-key"' ~/.claude/settings.json > tmp.json && mv tmp.json ~/.claude/settings.json
    ```

    **3. Очистите и сбросьте:**

    ```bash  theme={null}
    # Удалите старую конфигурацию
    rm ~/.claude/settings.json ~/.claude.json
    rm ~/.codex/config.toml
    rm ~/.config/opencode/opencode.json

    # Запустите CLI заново
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="Превышен лимит запросов">
    Слишком много API запросов за короткое время.

    **Решение:**

    **1. Подождите и повторите попытку:**
    Лимиты запросов сбрасываются через определённый период (обычно 1 минута).

    **2. Проверьте использование:**

    * Перейдите на [megallm.io/dashboard](https://megallm.io/dashboard)
    * Просмотрите статистику использования API

    **3. Обновите план:**
    Если вы постоянно достигаете лимитов, рассмотрите обновление тарифного плана.

    **4. Реализуйте логику повторных попыток:**

    ```python  theme={null}
    # В коде вашего приложения
    import time
    import openai

    for i in range(3):
        try:
            response = client.chat.completions.create(...)
            break
        except openai.RateLimitError:
            if i < 2:
                time.sleep(2 ** i)  # Экспоненциальная задержка
            else:
                raise
    ```
  </Accordion>
</AccordionGroup>

## Проблемы с оболочкой и окружением

<AccordionGroup>
  <Accordion title="Переменные окружения не сохраняются">
    Переменные теряются после закрытия терминала.

    **Решение:**

    Переменные окружения должны быть добавлены в конфигурационные файлы оболочки:

    ```bash  theme={null}
    # Определите вашу оболочку
    echo $SHELL

    # bash: ~/.bashrc или ~/.bash_profile
    echo 'export ANTHROPIC_API_KEY="sk-mega-..."' >> ~/.bashrc
    source ~/.bashrc

    # zsh: ~/.zshrc
    echo 'export ANTHROPIC_API_KEY="sk-mega-..."' >> ~/.zshrc
    source ~/.zshrc

    # fish: ~/.config/fish/config.fish
    echo 'set -x ANTHROPIC_API_KEY "sk-mega-..."' >> ~/.config/fish/config.fish
    source ~/.config/fish/config.fish
    ```

    **Проверка:**

    ```bash  theme={null}
    # Закройте терминал
    # Откройте новый терминал
    echo $ANTHROPIC_API_KEY
    # Должен показать ваш ключ
    ```
  </Accordion>

  <Accordion title="Конфигурация оболочки не перезагружается">
    Изменения в конфигурации оболочки не применяются.

    **Решения:**

    **1. Перезагрузите конфигурацию оболочки:**

    ```bash  theme={null}
    # bash
    source ~/.bashrc

    # zsh
    source ~/.zshrc

    # fish
    source ~/.config/fish/config.fish
    ```

    **2. Перезапустите терминал:**
    Закройте и откройте приложение терминала заново.

    **3. Проверьте синтаксические ошибки:**

    ```bash  theme={null}
    # bash/zsh
    bash -n ~/.bashrc  # Проверка синтаксиса
    bash -n ~/.zshrc

    # fish
    fish -n ~/.config/fish/config.fish
    ```

    **4. Проверьте, что файл действительно изменён:**

    ```bash  theme={null}
    tail -20 ~/.bashrc
    # Должен показать ваши последние добавления
    ```
  </Accordion>
</AccordionGroup>

## Платформо-специфичные проблемы

<AccordionGroup>
  <Accordion title="macOS: Команда не найдена после установки">
    PATH не обновлён для глобальных пакетов npm.

    **Решение:**

    ```bash  theme={null}
    # Добавьте глобальную директорию npm в PATH
    echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.zshrc
    source ~/.zshrc

    # Или для bash
    echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Accordion>

  <Accordion title="Windows: Политика выполнения PowerShell">
    Скрипты блокируются политикой выполнения PowerShell.

    **Решение:**

    ```powershell  theme={null}
    # Запустите PowerShell от имени администратора
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

    # Затем запустите CLI
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="Linux: Проблемы с правами /usr/local/lib">
    Невозможно установить глобальные пакеты из-за прав доступа.

    **Решение:**

    ```bash  theme={null}
    # Вариант 1: Использовать nvm (рекомендуется)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install 18
    nvm use 18

    # Вариант 2: Изменить префикс npm
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Accordion>
</AccordionGroup>

## Расширенное устранение неполадок

### Включить режим отладки

Получите подробные логи для диагностики проблем:

```bash  theme={null}
# Запустите с выводом отладки
DEBUG=* npx megallm@latest

# Или установите переменную окружения
export DEBUG=*
npx megallm@latest
```

### Полный сброс

Если всё остальное не помогло, полностью сбросьте конфигурацию:

```bash  theme={null}
# 1. Создайте резервную копию существующих конфигураций
mkdir ~/megallm-backup
cp -r ~/.claude ~/megallm-backup/
cp -r ~/.codex ~/megallm-backup/
cp -r ~/.config/opencode ~/megallm-backup/

# 2. Удалите все конфигурации
rm -rf ~/.claude
rm -rf ~/.codex
rm -rf ~/.config/opencode
rm -rf .claude
rm -f opencode.json

# 3. Удалите переменные окружения
# Отредактируйте ~/.bashrc или ~/.zshrc и удалите строки с:
# - ANTHROPIC_BASE_URL
# - ANTHROPIC_API_KEY
# - MEGALLM_API_KEY

# 4. Перезагрузите оболочку
source ~/.bashrc

# 5. Запустите CLI заново
npx megallm@latest
```

### Сбор диагностической информации

Для запросов поддержки соберите эту информацию:

```bash  theme={null}
# Информация о системе
uname -a
node --version
npm --version

# Проверьте конфигурации
ls -la ~/.claude/ ~/.codex/ ~/.config/opencode/
cat ~/.claude/settings.json
cat ~/.codex/config.toml
cat ~/.config/opencode/opencode.json

# Проверьте окружение
env | grep -E "ANTHROPIC|MEGALLM"

# Запустите с отладкой
DEBUG=* npx megallm@latest 2>&1 | tee megallm-debug.log
```

## Всё ещё нужна помощь?

Если вы всё ещё испытываете проблемы:

<CardGroup cols={2}>
  <Card title="Проверьте FAQ" icon="circle-question" href="/ru/cli/faq">
    Часто задаваемые вопросы и ответы
  </Card>

  <Card title="Поддержка по Email" icon="envelope" href="mailto:support@megallm.io">
    Получите помощь от нашей команды
  </Card>

  <Card title="GitHub Issues" icon="github" href="https://github.com/Megallm/megallm-npm/issues">
    Сообщите об ошибках или найдите существующие проблемы
  </Card>

  <Card title="Сообщество Discord" icon="discord" href="https://discord.gg/devsindia">
    Задайте вопрос сообществу
  </Card>
</CardGroup>

## Советы по предотвращению

<CardGroup cols={2}>
  <Card title="Обновляйте инструменты" icon="rotate">
    Регулярно обновляйте Node.js, npm и AI инструменты
  </Card>

  <Card title="Резервные копии конфигураций" icon="floppy-disk">
    Храните резервные копии рабочих конфигураций
  </Card>

  <Card title="Тестируйте после изменений" icon="flask">
    Проверяйте конфигурацию после ручных правок
  </Card>

  <Card title="Используйте контроль версий" icon="code-branch">
    Коммитьте рабочие конфигурации (без API ключей)
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt