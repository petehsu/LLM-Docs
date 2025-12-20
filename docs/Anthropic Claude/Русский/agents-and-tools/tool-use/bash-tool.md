# Bash инструмент

Bash инструмент позволяет Claude выполнять команды оболочки в постоянной сессии bash, обеспечивая системные операции, выполнение скриптов и автоматизацию командной строки.

---

Bash инструмент позволяет Claude выполнять команды оболочки в постоянной сессии bash, обеспечивая системные операции, выполнение скриптов и автоматизацию командной строки.

## Обзор

Bash инструмент предоставляет Claude:
- Постоянную сессию bash, которая сохраняет состояние
- Возможность запускать любую команду оболочки
- Доступ к переменным окружения и рабочему каталогу
- Возможности цепочки команд и создания скриптов

## Совместимость моделей

| Модель | Версия инструмента |
|-------|--------------|
| Claude 4 модели и Sonnet 3.7 ([устарело](/docs/ru/about-claude/model-deprecations)) | `bash_20250124` |

<Warning>
Старые версии инструмента не гарантируют обратную совместимость с новыми моделями. Всегда используйте версию инструмента, соответствующую версии вашей модели.
</Warning>

## Варианты использования

- **Рабочие процессы разработки**: Запуск команд сборки, тестов и инструментов разработки
- **Автоматизация системы**: Выполнение скриптов, управление файлами, автоматизация задач
- **Обработка данных**: Обработка файлов, запуск скриптов анализа, управление наборами данных
- **Настройка окружения**: Установка пакетов, настройка окружений

## Быстрый старт

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "bash_20250124",
            "name": "bash"
        }
    ],
    messages=[
        {"role": "user", "content": "List all Python files in the current directory."}
    ]
)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "List all Python files in the current directory."
      }
    ]
  }'
```
</CodeGroup>

## Как это работает

Bash инструмент поддерживает постоянную сессию:

1. Claude определяет, какую команду запустить
2. Вы выполняете команду в оболочке bash
3. Возвращаете вывод (stdout и stderr) в Claude
4. Состояние сессии сохраняется между командами (переменные окружения, рабочий каталог)

## Параметры

| Параметр | Обязательный | Описание |
|-----------|----------|-------------|
| `command` | Да* | Команда bash для выполнения |
| `restart` | Нет | Установите значение `true` для перезагрузки сессии bash |

*Обязательно, если не используется `restart`

<section title="Пример использования">

```json
// Запуск команды
{
  "command": "ls -la *.py"
}

// Перезагрузка сессии
{
  "restart": true
}
```

</section>

## Пример: Многошаговая автоматизация

Claude может объединять команды для выполнения сложных задач:

```python
# Запрос пользователя
"Install the requests library and create a simple Python script that fetches a joke from an API, then run it."

# Claude's tool uses:
# 1. Install package
{"command": "pip install requests"}

# 2. Create script
{"command": "cat > fetch_joke.py << 'EOF'\nimport requests\nresponse = requests.get('https://official-joke-api.appspot.com/random_joke')\njoke = response.json()\nprint(f\"Setup: {joke['setup']}\")\nprint(f\"Punchline: {joke['punchline']}\")\nEOF"}

# 3. Run script
{"command": "python fetch_joke.py"}
```

Сессия сохраняет состояние между командами, поэтому файлы, созданные на шаге 2, доступны на шаге 3.

***

## Реализация bash инструмента

Bash инструмент реализован как инструмент без схемы. При использовании этого инструмента вам не нужно предоставлять входную схему, как с другими инструментами; схема встроена в модель Claude и не может быть изменена.

<Steps>
  <Step title="Установка окружения bash">
    Создайте постоянную сессию bash, с которой Claude может взаимодействовать:
    ```python
    import subprocess
    import threading
    import queue
    
    class BashSession:
        def __init__(self):
            self.process = subprocess.Popen(
                ['/bin/bash'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0
            )
            self.output_queue = queue.Queue()
            self.error_queue = queue.Queue()
            self._start_readers()
    ```
  </Step>
  <Step title="Обработка выполнения команд">
    Создайте функцию для выполнения команд и захвата вывода:
    ```python
    def execute_command(self, command):
        # Send command to bash
        self.process.stdin.write(command + '\n')
        self.process.stdin.flush()
        
        # Capture output with timeout
        output = self._read_output(timeout=10)
        return output
    ```
  </Step>
  <Step title="Обработка вызовов инструментов Claude">
    Извлекайте и выполняйте команды из ответов Claude:
    ```python
    for content in response.content:
        if content.type == "tool_use" and content.name == "bash":
            if content.input.get("restart"):
                bash_session.restart()
                result = "Bash session restarted"
            else:
                command = content.input.get("command")
                result = bash_session.execute_command(command)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="Реализация мер безопасности">
    Добавьте валидацию и ограничения:
    ```python
    def validate_command(command):
        # Block dangerous commands
        dangerous_patterns = ['rm -rf /', 'format', ':(){:|:&};:']
        for pattern in dangerous_patterns:
            if pattern in command:
                return False, f"Command contains dangerous pattern: {pattern}"
        
        # Add more validation as needed
        return True, None
    ```
  </Step>
</Steps>

### Обработка ошибок

При реализации bash инструмента обрабатывайте различные сценарии ошибок:

<section title="Истечение времени выполнения команды">

Если выполнение команды занимает слишком много времени:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Command timed out after 30 seconds",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Команда не найдена">

Если команда не существует:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: nonexistentcommand: command not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="Доступ запрещен">

Если есть проблемы с разрешениями:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: /root/sensitive-file: Permission denied",
      "is_error": true
    }
  ]
}
```

</section>

### Следуйте лучшим практикам реализации

<section title="Используйте тайм-ауты команд">

Реализуйте тайм-ауты, чтобы предотвратить зависание команд:
```python
def execute_with_timeout(command, timeout=30):
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return f"Command timed out after {timeout} seconds"
```

</section>

<section title="Сохраняйте состояние сессии">

Сохраняйте сессию bash постоянной, чтобы сохранить переменные окружения и рабочий каталог:
```python
# Commands run in the same session maintain state
commands = [
    "cd /tmp",
    "echo 'Hello' > test.txt",
    "cat test.txt"  # This works because we're still in /tmp
]
```

</section>

<section title="Обработка больших выводов">

Обрезайте очень большие выводы, чтобы предотвратить проблемы с лимитом токенов:
```python
def truncate_output(output, max_lines=100):
    lines = output.split('\n')
    if len(lines) > max_lines:
        truncated = '\n'.join(lines[:max_lines])
        return f"{truncated}\n\n... Output truncated ({len(lines)} total lines) ..."
    return output
```

</section>

<section title="Логирование всех команд">

Ведите журнал аудита выполненных команд:
```python
import logging

def log_command(command, output, user_id):
    logging.info(f"User {user_id} executed: {command}")
    logging.info(f"Output: {output[:200]}...")  # Log first 200 chars
```

</section>

<section title="Санитизация выводов">

Удаляйте конфиденциальную информацию из выводов команд:
```python
def sanitize_output(output):
    # Remove potential secrets or credentials
    import re
    # Example: Remove AWS credentials
    output = re.sub(r'aws_access_key_id\s*=\s*\S+', 'aws_access_key_id=***', output)
    output = re.sub(r'aws_secret_access_key\s*=\s*\S+', 'aws_secret_access_key=***', output)
    return output
```

</section>

## Безопасность

<Warning>
Bash инструмент предоставляет прямой доступ к системе. Реализуйте эти необходимые меры безопасности:
- Запуск в изолированных окружениях (Docker/VM)
- Реализация фильтрации команд и списков разрешений
- Установка ограничений ресурсов (CPU, память, диск)
- Логирование всех выполненных команд
</Warning>

### Ключевые рекомендации
- Используйте `ulimit` для установки ограничений ресурсов
- Фильтруйте опасные команды (`sudo`, `rm -rf` и т.д.)
- Запускайте с минимальными разрешениями пользователя
- Отслеживайте и логируйте все выполнения команд

## Цены

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

Полные сведения о ценах см. в разделе [цены на использование инструментов](/docs/ru/agents-and-tools/tool-use/overview#pricing).

## Распространенные шаблоны

### Рабочие процессы разработки
- Запуск тестов: `pytest && coverage report`
- Сборка проектов: `npm install && npm run build`
- Операции Git: `git status && git add . && git commit -m "message"`

### Операции с файлами
- Обработка данных: `wc -l *.csv && ls -lh *.csv`
- Поиск в файлах: `find . -name "*.py" | xargs grep "pattern"`
- Создание резервных копий: `tar -czf backup.tar.gz ./data`

### Системные задачи
- Проверка ресурсов: `df -h && free -m`
- Управление процессами: `ps aux | grep python`
- Настройка окружения: `export PATH=$PATH:/new/path && echo $PATH`

## Ограничения

- **Нет интерактивных команд**: Не может обрабатывать `vim`, `less` или запросы пароля
- **Нет приложений GUI**: Только командная строка
- **Область сессии**: Сохраняется в пределах разговора, теряется между вызовами API
- **Ограничения вывода**: Большие выводы могут быть обрезаны
- **Нет потоковой передачи**: Результаты возвращаются после завершения

## Комбинирование с другими инструментами

Bash инструмент наиболее мощен при комбинировании с [текстовым редактором](/docs/ru/agents-and-tools/tool-use/text-editor-tool) и другими инструментами.

## Следующие шаги

<CardGroup cols={2}>
  <Card
    title="Обзор использования инструментов"
    icon="tool"
    href="/docs/ru/agents-and-tools/tool-use/overview"
  >
    Узнайте об использовании инструментов с Claude
  </Card>

  <Card
    title="Инструмент текстового редактора"
    icon="file"
    href="/docs/ru/agents-and-tools/tool-use/text-editor-tool"
  >
    Просмотр и редактирование текстовых файлов с Claude
  </Card>
</CardGroup>