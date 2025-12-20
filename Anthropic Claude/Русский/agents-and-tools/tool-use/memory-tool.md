# Инструмент памяти

Инструмент памяти позволяет Claude сохранять и извлекать информацию между разговорами через директорию файлов памяти.

---

Инструмент памяти позволяет Claude сохранять и извлекать информацию между разговорами через директорию файлов памяти. Claude может создавать, читать, обновлять и удалять файлы, которые сохраняются между сеансами, позволяя ему накапливать знания с течением времени без необходимости хранить всё в окне контекста.

Инструмент памяти работает на стороне клиента — вы контролируете, где и как хранятся данные через вашу собственную инфраструктуру.

<Note>
Инструмент памяти в настоящее время находится в бета-версии. Чтобы включить его, используйте заголовок бета-версии `context-management-2025-06-27` в ваших запросах API.

Пожалуйста, свяжитесь с нами через нашу [форму обратной связи](https://forms.gle/YXC2EKGMhjN1c4L88), чтобы поделиться своим мнением об этой функции.
</Note>

## Варианты использования

- Сохранение контекста проекта между несколькими выполнениями агента
- Обучение на основе прошлых взаимодействий, решений и обратной связи
- Построение баз знаний с течением времени
- Включение кросс-разговорного обучения, при котором Claude улучшается в повторяющихся рабочих процессах

## Как это работает

Когда включено, Claude автоматически проверяет директорию памяти перед началом задач. Claude может создавать, читать, обновлять и удалять файлы в директории `/memories` для сохранения того, что он узнаёт во время работы, а затем ссылаться на эти воспоминания в будущих разговорах для более эффективного решения похожих задач или продолжения с того момента, где он остановился.

Поскольку это инструмент на стороне клиента, Claude делает вызовы инструментов для выполнения операций с памятью, а ваше приложение выполняет эти операции локально. Это даёт вам полный контроль над тем, где и как хранится память. В целях безопасности вы должны ограничить все операции с памятью директорией `/memories`.

### Пример: Как работают вызовы инструмента памяти

Когда вы просите Claude помочь с задачей, Claude автоматически сначала проверяет директорию памяти. Вот как выглядит типичное взаимодействие:

**1. Запрос пользователя:**
```
"Помогите мне ответить на этот билет в службу поддержки."
```

**2. Claude проверяет директорию памяти:**
```
"Я помогу вам ответить на билет в службу поддержки. Позвольте мне проверить мою память на предмет любого предыдущего контекста."
```

Claude вызывает инструмент памяти:
```json
{
  "type": "tool_use",
  "id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories"
  }
}
```

**3. Ваше приложение возвращает содержимое директории:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": "Вот файлы и директории до 2 уровней глубины в /memories, исключая скрытые элементы и node_modules:\n4.0K\t/memories\n1.5K\t/memories/customer_service_guidelines.xml\n2.0K\t/memories/refund_policies.xml"
}
```

**4. Claude читает релевантные файлы:**
```json
{
  "type": "tool_use",
  "id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "memory",
  "input": {
    "command": "view",
    "path": "/memories/customer_service_guidelines.xml"
  }
}
```

**5. Ваше приложение возвращает содержимое файла:**
```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": "Вот содержимое /memories/customer_service_guidelines.xml с номерами строк:\n     1\t<guidelines>\n     2\t<addressing_customers>\n     3\t- Всегда обращайтесь к клиентам по их имени\n     4\t- Используйте сочувственный язык\n..."
}
```

**6. Claude использует память для помощи:**
```
"На основе ваших рекомендаций по обслуживанию клиентов я могу помочь вам составить ответ. Пожалуйста, поделитесь деталями билета..."
```

## Поддерживаемые модели

Инструмент памяти доступен на:

- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)

## Начало работы

Чтобы использовать инструмент памяти:

1. Включите заголовок бета-версии `context-management-2025-06-27` в ваши запросы API
2. Добавьте инструмент памяти в ваш запрос
3. Реализуйте обработчики на стороне клиента для операций с памятью

<Note>
Чтобы обрабатывать операции инструмента памяти в вашем приложении, вам нужно реализовать обработчики для каждой команды памяти. Наши SDK предоставляют помощники инструмента памяти, которые обрабатывают интерфейс инструмента — вы можете создать подкласс `BetaAbstractMemoryTool` (Python) или использовать `betaMemoryTool` (TypeScript) для реализации вашего собственного бэкенда памяти (на основе файлов, базы данных, облачного хранилища, зашифрованных файлов и т. д.).

Для рабочих примеров см.:
- Python: [examples/memory/basic.py](https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/memory/basic.py)
- TypeScript: [examples/tools-helpers-memory.ts](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/examples/tools-helpers-memory.ts)
</Note>

## Базовое использование

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": "I'\''m working on a Python web scraper that keeps crashing with a timeout error. Here'\''s the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
            }
        ],
        "tools": [{
            "type": "memory_20250818",
            "name": "memory"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=2048,
    messages=[
        {
            "role": "user",
            "content": "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
        }
    ],
    tools=[{
        "type": "memory_20250818",
        "name": "memory"
    }],
    betas=["context-management-2025-06-27"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  messages: [
    {
      role: "user",
      content: "I'm working on a Python web scraper that keeps crashing with a timeout error. Here's the problematic function:\n\n```python\ndef fetch_page(url, retries=3):\n    for i in range(retries):\n        try:\n            response = requests.get(url, timeout=5)\n            return response.text\n        except requests.exceptions.Timeout:\n            if i == retries - 1:\n                raise\n            time.sleep(1)\n```\n\nPlease help me debug this."
    }
  ],
  tools: [{
    type: "memory_20250818",
    name: "memory"
  }],
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

## Команды инструмента

Ваша реализация на стороне клиента должна обрабатывать эти команды инструмента памяти. Хотя эти спецификации описывают рекомендуемые поведения, с которыми Claude наиболее знаком, вы можете изменить вашу реализацию и возвращать строки по мере необходимости для вашего варианта использования.

### view
Показывает содержимое директории или содержимое файла с необязательными диапазонами строк:

```json
{
  "command": "view",
  "path": "/memories",
  "view_range": [1, 10]  // Необязательно: просмотр определённых строк
}
```

#### Возвращаемые значения

**Для директорий:** Возвращает список, который показывает файлы и директории с их размерами:
```
Вот файлы и директории до 2 уровней глубины в {path}, исключая скрытые элементы и node_modules:
{size}    {path}
{size}    {path}/{filename1}
{size}    {path}/{filename2}
```

- Список файлов до 2 уровней глубины
- Показывает размеры в удобочитаемом формате (например, `5.5K`, `1.2M`)
- Исключает скрытые элементы (файлы, начинающиеся с `.`) и `node_modules`
- Использует символ табуляции между размером и путём

**Для файлов:** Возвращает содержимое файла с заголовком и номерами строк:
```
Вот содержимое {path} с номерами строк:
{line_numbers}{tab}{content}
```

Форматирование номеров строк:
- **Ширина**: 6 символов, выравнено по правому краю с заполнением пробелами
- **Разделитель**: Символ табуляции между номером строки и содержимым
- **Индексирование**: 1-индексирование (первая строка — это строка 1)
- **Лимит строк**: Файлы с более чем 999 999 строками должны возвращать ошибку: `"File {path} exceeds maximum line limit of 999,999 lines."`

**Пример вывода:**
```
Вот содержимое /memories/notes.txt с номерами строк:
     1	Hello World
     2	This is line two
    10	Line ten
   100	Line one hundred
```

#### Обработка ошибок

- **Файл/директория не существует**: `"The path {path} does not exist. Please provide a valid path."`

### create
Создание нового файла:

```json
{
  "command": "create",
  "path": "/memories/notes.txt",
  "file_text": "Meeting notes:\n- Discussed project timeline\n- Next steps defined\n"
}
```

#### Возвращаемые значения

- **Успех**: `"File created successfully at: {path}"`

#### Обработка ошибок

- **Файл уже существует**: `"Error: File {path} already exists"`

### str_replace
Замена текста в файле:

```json
{
  "command": "str_replace",
  "path": "/memories/preferences.txt",
  "old_str": "Favorite color: blue",
  "new_str": "Favorite color: green"
}
```

#### Возвращаемые значения

- **Успех**: `"The memory file has been edited."` с последующим фрагментом отредактированного файла с номерами строк

#### Обработка ошибок

- **Файл не существует**: `"Error: The path {path} does not exist. Please provide a valid path."`
- **Текст не найден**: ``"No replacement was performed, old_str `{old_str}` did not appear verbatim in {path}."``
- **Дублирующийся текст**: Когда `old_str` появляется несколько раз, возвращайте: ``"No replacement was performed. Multiple occurrences of old_str `{old_str}` in lines: {line_numbers}. Please ensure it is unique"``

#### Обработка директорий

Если путь является директорией, возвращайте ошибку "файл не существует".

### insert
Вставка текста в определённую строку:

```json
{
  "command": "insert",
  "path": "/memories/todo.txt",
  "insert_line": 2,
  "insert_text": "- Review memory tool documentation\n"
}
```

#### Возвращаемые значения

- **Успех**: `"The file {path} has been edited."`

#### Обработка ошибок

- **Файл не существует**: `"Error: The path {path} does not exist"`
- **Неверный номер строки**: ``"Error: Invalid `insert_line` parameter: {insert_line}. It should be within the range of lines of the file: [0, {n_lines}]"``

#### Обработка директорий

Если путь является директорией, возвращайте ошибку "файл не существует".

### delete
Удаление файла или директории:

```json
{
  "command": "delete",
  "path": "/memories/old_file.txt"
}
```

#### Возвращаемые значения

- **Успех**: `"Successfully deleted {path}"`

#### Обработка ошибок

- **Файл/директория не существует**: `"Error: The path {path} does not exist"`

#### Обработка директорий

Удаляет директорию и всё её содержимое рекурсивно.

### rename
Переименование или перемещение файла/директории:

```json
{
  "command": "rename",
  "old_path": "/memories/draft.txt",
  "new_path": "/memories/final.txt"
}
```

#### Возвращаемые значения

- **Успех**: `"Successfully renamed {old_path} to {new_path}"`

#### Обработка ошибок

- **Источник не существует**: `"Error: The path {old_path} does not exist"`
- **Пункт назначения уже существует**: Возвращайте ошибку (не перезаписывайте): `"Error: The destination {new_path} already exists"`

#### Обработка директорий

Переименовывает директорию.

## Рекомендации по подсказкам

Мы автоматически включаем эту инструкцию в системную подсказку при включении инструмента памяти:

```
IMPORTANT: ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE.
MEMORY PROTOCOL:
1. Use the `view` command of your `memory` tool to check for earlier progress.
2. ... (work on the task) ...
     - As you make progress, record status / progress / thoughts etc in your memory.
ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory.
```

Если вы заметите, что Claude создаёт загромождённые файлы памяти, вы можете включить эту инструкцию:

> Примечание: при редактировании папки памяти всегда старайтесь поддерживать её содержимое в актуальном, согласованном и организованном виде. Вы можете переименовывать или удалять файлы, которые больше не актуальны. Не создавайте новые файлы, если это не необходимо.

Вы также можете направить то, что Claude записывает в память, например: "Записывайте в вашу систему памяти только информацию, релевантную \<topic\>."

## Соображения безопасности

Вот важные проблемы безопасности при реализации вашего хранилища памяти:

### Конфиденциальная информация
Claude обычно отказывается записывать конфиденциальную информацию в файлы памяти. Однако вы можете захотеть реализовать более строгую валидацию, которая удаляет потенциально конфиденциальную информацию.

### Размер хранилища файлов памяти
Рассмотрите отслеживание размеров файлов памяти и предотвращение чрезмерного роста файлов. Рассмотрите добавление максимального количества символов, которые может возвращать команда чтения памяти, и позвольте Claude разбивать содержимое на страницы.

### Истечение памяти
Рассмотрите периодическое очищение файлов памяти, которые не были доступны в течение длительного времени.

### Защита от обхода пути

<Warning>
Вредоносные входные пути могут попытаться получить доступ к файлам вне директории `/memories`. Ваша реализация **ДОЛЖНА** валидировать все пути для предотвращения атак обхода директорий.
</Warning>

Рассмотрите эти меры защиты:

- Валидируйте, что все пути начинаются с `/memories`
- Разрешайте пути в их каноническую форму и проверяйте, что они остаются в директории памяти
- Отклоняйте пути, содержащие последовательности вроде `../`, `..\\` или другие паттерны обхода
- Следите за URL-кодированными последовательностями обхода (`%2e%2e%2f`)
- Используйте встроенные утилиты безопасности пути вашего языка (например, `pathlib.Path.resolve()` и `relative_to()` Python)

## Обработка ошибок

Инструмент памяти использует похожие паттерны обработки ошибок на [инструмент текстового редактора](/docs/ru/agents-and-tools/tool-use/text-editor-tool#handle-errors). См. отдельные разделы команд инструмента выше для подробных сообщений об ошибках и поведения. Распространённые ошибки включают файл не найден, ошибки разрешений, неверные пути и дублирующиеся совпадения текста.

## Использование с редактированием контекста

Инструмент памяти можно комбинировать с [редактированием контекста](/docs/ru/build-with-claude/context-editing), которое автоматически очищает старые результаты инструментов, когда контекст разговора превышает настроенный порог. Эта комбинация позволяет долгоживущие агентские рабочие процессы, которые в противном случае превысили бы лимиты контекста.

### Как они работают вместе

Когда редактирование контекста включено и ваш разговор приближается к порогу очистки, Claude автоматически получает уведомление предупреждения. Это побуждает Claude сохранить любую важную информацию из результатов инструментов в файлы памяти перед тем, как эти результаты будут очищены из окна контекста.

После очистки результатов инструментов Claude может извлекать сохранённую информацию из файлов памяти всякий раз, когда это необходимо, эффективно рассматривая память как расширение своего рабочего контекста. Это позволяет Claude:

- Продолжать сложные многошаговые рабочие процессы без потери критической информации
- Ссылаться на прошлую работу и решения даже после удаления результатов инструментов
- Поддерживать согласованный контекст между разговорами, которые превысили бы типичные лимиты контекста
- Накапливать базу знаний с течением времени, сохраняя активное окно контекста управляемым

### Пример рабочего процесса

Рассмотрим проект рефакторинга кода со множеством операций с файлами:

1. Claude делает многочисленные правки в файлы, генерируя много результатов инструментов
2. По мере роста контекста и приближения к вашему порогу, Claude получает предупреждение
3. Claude суммирует сделанные до сих пор изменения в файл памяти (например, `/memories/refactoring_progress.xml`)
4. Редактирование контекста автоматически очищает более старые результаты инструментов
5. Claude продолжает работу, ссылаясь на файл памяти, когда ему нужно вспомнить, какие изменения уже были завершены
6. Рабочий процесс может продолжаться бесконечно, с Claude управляющим как активным контекстом, так и постоянной памятью

### Конфигурация

Чтобы использовать обе функции вместе:

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 100000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 100000
        },
        keep: {
          type: "tool_uses",
          value: 3
        }
      }
    ]
  }
});
```

</CodeGroup>

Вы также можете исключить вызовы инструмента памяти из очистки, чтобы убедиться, что Claude всегда имеет доступ к недавним операциям памяти:

<CodeGroup>

```python Python
context_management={
    "edits": [
        {
            "type": "clear_tool_uses_20250919",
            "exclude_tools": ["memory"]
        }
    ]
}
```

```typescript TypeScript
context_management: {
  edits: [
    {
      type: "clear_tool_uses_20250919",
      exclude_tools: ["memory"]
    }
  ]
}
```

</CodeGroup>