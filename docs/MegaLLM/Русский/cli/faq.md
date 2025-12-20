# Часто задаваемые вопросы

> Общие вопросы и ответы о NPM пакете MegaLLM и инструменте CLI.

## Общие вопросы

<AccordionGroup>
  <Accordion title="Что такое MegaLLM CLI?">
    MegaLLM CLI - это интерактивный инструмент настройки, который конфигурирует AI-помощники для программирования (Claude Code, Codex/Windsurf и OpenCode) для использования сервиса MegaLLM AI. Он автоматизирует процесс конфигурации, безопасно управляет API-ключами и обеспечивает удобную настройку на разных платформах.
  </Accordion>

  <Accordion title="Какие AI-инструменты поддерживаются?">
    CLI в настоящее время поддерживает:

    * **Claude Code** - Системная и проектная конфигурация
    * **Codex/Windsurf** - Только системная конфигурация
    * **OpenCode** - Системная и проектная конфигурация

    В будущих релизах могут быть добавлены другие инструменты.
  </Accordion>

  <Accordion title="Нужно ли устанавливать CLI?">
    Нет! Вы можете запустить его напрямую используя npx:

    ```bash  theme={null}
    npx megallm@latest
    ```

    Однако вы также можете установить его глобально, если предпочитаете:

    ```bash  theme={null}
    npm install -g megallm
    ```
  </Accordion>

  <Accordion title="Каковы системные требования?">
    * **Node.js**: Версия 18.0.0 или выше
    * **Операционная система**: macOS, Linux или Windows
    * **Оболочка**: bash, zsh, fish или PowerShell

    Проверьте версию Node.js командой: `node --version`
  </Accordion>
</AccordionGroup>

## Установка и настройка

<AccordionGroup>
  <Accordion title="Как получить API-ключ MegaLLM?">
    1. Посетите [megallm.io/dashboard](https://megallm.io/dashboard)
    2. Зарегистрируйтесь или войдите в свой аккаунт
    3. Перейдите в раздел API-ключей
    4. Нажмите "Создать новый API-ключ"
    5. Скопируйте свой API-ключ (начинается с `sk-mega-`)
    6. Сохраните его безопасно - вы не сможете увидеть его снова

    CLI может автоматически открыть эту страницу во время настройки.
  </Accordion>

  <Accordion title="В чём разница между системной и проектной конфигурацией?">
    **Системный уровень (глобальный)**:

    * Применяется ко всем проектам на вашем компьютере
    * Хранится в домашней директории (`~/.claude/`, `~/.codex/` и т.д.)
    * Лучше всего для личных сред разработки
    * Проще управлять для отдельных разработчиков

    **Проектный уровень (локальный)**:

    * Применяется только к текущей директории проекта
    * Хранится в папке проекта (`./.claude/`, `./opencode.json` и т.д.)
    * Лучше всего для командных проектов с общими конфигурациями
    * Позволяет использовать разные API-ключи для разных проектов
    * Может контролироваться версиями (без раскрытия API-ключей)

    <Note>
      **Важно**: Codex/Windsurf поддерживает только системную конфигурацию.
    </Note>
  </Accordion>

  <Accordion title="Как настроить несколько инструментов?">
    При запуске CLI вас спросят, какой инструмент настроить:

    ```
    ? Какой инструмент вы хотите настроить?
      Claude Code
      Codex/Windsurf
      OpenCode
      Настроить все  ← Выберите эту опцию
    ```

    Выбор "Настроить все" настроит все обнаруженные инструменты по очереди.

    Alternatively, запустите CLI несколько раз и выбирайте по одному инструменту каждый раз.
  </Accordion>

  <Accordion title="Будет ли CLI устанавливать AI-инструменты, если они отсутствуют?">
    Да! Если CLI обнаружит, что инструмент не установлен, он предложит его установить:

    ```
    ? Claude Code не установлен. Хотите установить его? (Y/n)
    ```

    CLI устанавливает инструменты через NPM как глобальные пакеты.
  </Accordion>
</AccordionGroup>

## Конфигурация

<AccordionGroup>
  <Accordion title="Где хранятся файлы конфигурации?">
    **Claude Code**:

    * Системный: `~/.claude/settings.json`, `~/.claude.json`
    * Проектный: `./.claude/settings.json` или `./.claude/settings.local.json`

    **Codex/Windsurf**:

    * Системный: `~/.codex/config.toml`

    **OpenCode**:

    * Системный: `~/.config/opencode/opencode.json`
    * Проектный: `./opencode.json`

    **Переменные окружения**:

    * bash: `~/.bashrc`
    * zsh: `~/.zshrc`
    * fish: `~/.config/fish/config.fish`
    * PowerShell: профиль PowerShell
  </Accordion>

  <Accordion title="Что если у меня уже настроен MegaLLM?">
    CLI обнаружит существующие конфигурации и спросит, что вы хотите сделать:

    ```
    Найдена существующая конфигурация MegaLLM:
    - ~/.claude/settings.json
    - ~/.codex/config.toml

    ? Что вы хотите сделать?
      Переопределить (удалить старую, применить новую)
      Пропустить (оставить существующую)
      Отменить
    ```

    Выбор "Переопределить":

    1. Создаст резервные копии файлов (суффикс `.backup`)
    2. Удалит старую конфигурацию
    3. Применит новую конфигурацию

    Выбор "Пропустить" сохранит вашу существующую настройку и выйдет.
  </Accordion>

  <Accordion title="Как обновить мой API-ключ?">
    Просто запустите CLI снова и выберите "Переопределить" при запросе о существующей конфигурации:

    ```bash  theme={null}
    npx megallm@latest

    # Выберите: Переопределить (удалить старую, применить новую)
    # Введите ваш новый API-ключ
    ```

    CLI создаст резервную копию вашей старой конфигурации перед применением новой.
  </Accordion>

  <Accordion title="Могу ли я использовать разные API-ключи для разных проектов?">
    Да! Используйте проектную конфигурацию:

    ```bash  theme={null}
    # Проект A
    cd ~/projects/project-a
    npx megallm@latest
    # Выберите: Проектный уровень
    # Введите API-ключ для Проекта A

    # Проект B
    cd ~/projects/project-b
    npx megallm@latest
    # Выберите: Проектный уровень
    # Введите API-ключ для Проекта B
    ```

    Каждый проект будет иметь свой собственный `.claude/settings.json` со своим API-ключом.
  </Accordion>
</AccordionGroup>

## Устранение неполадок

<AccordionGroup>
  <Accordion title="CLI говорит, что инструмент установлен, но я не могу его найти">
    CLI проверяет наличие инструментов следующими методами:

    1. Список глобальных пакетов NPM
    2. Доступность команды в PATH
    3. Известные директории установки

    Если обнаружение не удалось:

    1. Убедитесь, что инструмент установлен глобально: `npm list -g --depth=0`
    2. Проверьте, доступна ли команда: `which claude-code` или `which codex`
    3. Перезапустите терминал
    4. Попробуйте установить вручную: `npm install -g @anthropic-ai/claude-code`
  </Accordion>

  <Accordion title="Я получаю ошибки 'permission denied'">
    Это обычно означает, что у вас нет прав на запись в директории конфигурации.

    **Исправление для macOS/Linux**:

    ```bash  theme={null}
    # Исправить владение директориями конфигурации
    sudo chown -R $USER ~/.claude ~/.codex ~/.config/opencode

    # Исправить права доступа
    chmod -R 755 ~/.claude ~/.codex ~/.config/opencode
    ```

    **Исправление для Windows**:

    * Запустите терминал от имени администратора
    * Или: Исправьте права доступа в Проводнике → Свойства → Безопасность
  </Accordion>

  <Accordion title="Моя конфигурация не используется">
    **Проверка 1: Переменные окружения**

    ```bash  theme={null}
    # Claude Code
    echo $ANTHROPIC_BASE_URL
    echo $ANTHROPIC_API_KEY

    # Codex
    echo $MEGALLM_API_KEY
    ```

    Если пусто, перезагрузите оболочку:

    ```bash  theme={null}
    source ~/.bashrc  # или ~/.zshrc
    # Или перезапустите терминал
    ```

    **Проверка 2: Файлы конфигурации**

    ```bash  theme={null}
    # Claude Code
    cat ~/.claude/settings.json

    # Codex
    cat ~/.codex/config.toml
    ```

    Убедитесь, что файлы существуют и содержат ваш API-ключ.

    **Проверка 3: Права доступа к файлам**

    ```bash  theme={null}
    ls -la ~/.claude/settings.json
    ls -la ~/.codex/config.toml
    ```

    Файлы должны быть доступны для чтения вашим пользователем.
  </Accordion>

  <Accordion title="Я получаю ошибки 'Invalid API key'">
    1. **Проверьте формат ключа**: Должен начинаться с `sk-mega-`
    2. **Проверьте на опечатки**: Скопируйте ключ прямо из панели управления
    3. **Удалите пробелы**: Удалите любые пробелы до/после ключа
    4. **Длина ключа**: Должна быть не менее 20 символов
    5. **Перегенерируйте**: Создайте новый API-ключ на [megallm.io/dashboard](https://megallm.io/dashboard)

    Протестируйте ваш API-ключ:

    ```bash  theme={null}
    curl -H "Authorization: Bearer YOUR_API_KEY" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="Как полностью удалить конфигурацию MegaLLM?">
    **Удалите файлы конфигурации**:

    ```bash  theme={null}
    # Claude Code
    rm -rf ~/.claude/settings.json ~/.claude.json

    # Codex
    rm -rf ~/.codex/config.toml

    # OpenCode
    rm -rf ~/.config/opencode/opencode.json

    # Проектный уровень
    rm -rf ./.claude ./opencode.json
    ```

    **Удалите переменные окружения**:
    Отредактируйте файл конфигурации оболочки (`~/.bashrc`, `~/.zshrc` и т.д.) и удалите эти строки:

    ```bash  theme={null}
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"
    export ANTHROPIC_API_KEY="sk-mega-..."
    export MEGALLM_API_KEY="sk-mega-..."
    ```

    Затем перезагрузите: `source ~/.bashrc` или перезапустите терминал.
  </Accordion>

  <Accordion title="Могу ли я видеть, что CLI делает подробно?">
    Да! Запустите в режиме отладки:

    ```bash  theme={null}
    DEBUG=* npx megallm@latest
    ```

    Это покажет подробные логи:

    * Обнаружение системы
    * Обнаружение инструментов
    * Файловые операции
    * Изменения конфигурации
    * Трассировки ошибок
  </Accordion>
</AccordionGroup>

## Продвинутое использование

<AccordionGroup>
  <Accordion title="Могу ли я использовать CLI в CI/CD конвейерах?">
    Да, но лучше настроить вручную в CI/CD средах:

    ```yaml  theme={null}
    # Пример GitHub Actions
    - name: Configure MegaLLM
      env:
        ANTHROPIC_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
      run: |
        mkdir -p .claude
        echo '{"env":{"ANTHROPIC_BASE_URL":"https://ai.megallm.io","ANTHROPIC_API_KEY":"'$ANTHROPIC_API_KEY'"}}' > .claude/settings.json
    ```

    Это избегает интерактивных запросов и более надежно в автоматизированных средах.
  </Accordion>

  <Accordion title="Как настроить MegaLLM в Docker-контейнере?">
    Добавьте конфигурацию во время сборки Docker:

    ```dockerfile  theme={null}
    FROM node:18

    # Установите переменные окружения
    ENV ANTHROPIC_BASE_URL=https://ai.megallm.io
    ENV ANTHROPIC_API_KEY=your-key-here

    # Или скопируйте файлы конфигурации
    COPY .claude/settings.json /root/.claude/settings.json

    WORKDIR /app
    COPY . .
    RUN npm install
    CMD ["npm", "start"]
    ```

    Или передайте API-ключ во время выполнения:

    ```bash  theme={null}
    docker run -e ANTHROPIC_API_KEY=sk-mega-... myimage
    ```
  </Accordion>

  <Accordion title="Могу ли я контролировать версии моей конфигурации?">
    **Да, но осторожно**:

    **СЛЕДУЕТ коммитить**:

    * Проектная конфигурация БЕЗ API-ключей
    * `.claude/settings.json` только с `ANTHROPIC_BASE_URL`
    * Документацию для членов команды

    **НЕ СЛЕДУЕТ коммитить**:

    * API-ключи
    * `.claude/settings.local.json`
    * Личные переменные окружения

    **Пример `.claude/settings.json` для контроля версий**:

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
      }
    }
    ```

    **Добавьте в `.gitignore`**:

    ```
    .claude/settings.local.json
    .claude.json
    ```

    **Члены команды добавляют свои собственные API-ключи**:

    ```json  theme={null}
    # .claude/settings.local.json (не коммитится)
    {
      "env": {
        "ANTHROPIC_API_KEY": "sk-mega-personal-key"
      }
    }
    ```
  </Accordion>

  <Accordion title="Могу ли я использовать разные модели с каждым инструментом?">
    Да! Файл конфигурации каждого инструмента позволяет указать модель.

    **Claude Code** (`~/.claude/settings.json`):

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
        "ANTHROPIC_API_KEY": "sk-mega-...",
        "ANTHROPIC_MODEL": "claude-opus-4-1-20250805"
      }
    }
    ```

    **Codex** (`~/.codex/config.toml`):

    ```toml  theme={null}
    model = "gpt-5"  # Измените на любую поддерживаемую модель
    ```

    **OpenCode** (`~/.config/opencode/opencode.json`):

    ```json  theme={null}
    {
      "model": "gemini-2.5-pro"
    }
    ```

    См. [Каталог моделей](/ru/home/models) для доступных моделей.
  </Accordion>

  <Accordion title="Что происходит с моими резервными копиями?">
    CLI создает резервные копии файлов перед изменением конфигураций:

    ```
    ~/.claude/settings.json.backup
    ~/.codex/config.toml.backup
    ~/.config/opencode/opencode.json.backup
    ```

    Резервные копии создаются с суффиксом `.backup` и содержат вашу предыдущую конфигурацию.

    Чтобы восстановить из резервной копии:

    ```bash  theme={null}
    mv ~/.claude/settings.json.backup ~/.claude/settings.json
    ```

    Вы можете удалить резервные копии вручную, если они вам не нужны:

    ```bash  theme={null}
    rm ~/.claude/*.backup ~/.codex/*.backup
    ```
  </Accordion>
</AccordionGroup>

## Получение помощи

<AccordionGroup>
  <Accordion title="Где я могу получить поддержку?">
    **Документация**:

    * Основная документация: [docs.megallm.io](https://docs.megallm.io)
    * API справочник: [docs.megallm.io/api](https://docs.megallm.io/api)

    **Каналы поддержки**:

    * Email: [support@megallm.io](mailto:support@megallm.io)
    * GitHub Issues: [github.com/Megallm/megallm-npm/issues](https://github.com/Megallm/megallm-npm/issues)
    * Discord: [discord.gg/devsindia](https://discord.gg/devsindia)

    **Сообщество**:

    * Twitter/X: [@megallmio](https://x.com/megallmio)
    * YouTube: [youtube.com/@Megallmio](https://youtube.com/@Megallmio)
  </Accordion>

  <Accordion title="Как сообщить об ошибке?">
    1. Проверьте существующие проблемы: [github.com/Megallm/megallm-npm/issues](https://github.com/Megallm/megallm-npm/issues)
    2. Если не найдено, создайте новую проблему с:
       * Версией CLI: `npx megallm@latest --version`
       * Версией Node.js: `node --version`
       * Операционной системой
       * Типом оболочки
       * Сообщением об ошибке/логами (запустите с `DEBUG=*`)
       * Шагами воспроизведения
  </Accordion>

  <Accordion title="Как запросить функцию?">
    Откройте запрос функции на GitHub:
    [github.com/Megallm/megallm-npm/issues/new](https://github.com/Megallm/megallm-npm/issues/new)

    Включите:

    * Описание функции
    * Случай использования / почему это нужно
    * Любые соответствующие примеры или макеты
  </Accordion>
</AccordionGroup>

## Остались вопросы?

Не можете найти ответ? Мы здесь, чтобы помочь!

<CardGroup cols={2}>
  <Card title="Поддержка по Email" icon="envelope" href="mailto:support@megallm.io">
    Получите помощь от нашей команды поддержки
  </Card>

  <Card title="GitHub Issues" icon="github" href="https://github.com/Megallm/megallm-npm/issues">
    Сообщите об ошибках или запросите функции
  </Card>

  <Card title="Сообщество Discord" icon="discord" href="https://discord.gg/devsindia">
    Общайтесь с сообществом
  </Card>

  <Card title="Документация" icon="book-open" href="/ru/home/introduction">
    Просмотрите полную документацию
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt