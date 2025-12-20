# Инструмент выполнения кода

Claude может анализировать данные, создавать визуализации, выполнять сложные вычисления, запускать системные команды, создавать и редактировать файлы, а также обрабатывать загруженные файлы непосредственно в разговоре API.

---

Claude может анализировать данные, создавать визуализации, выполнять сложные вычисления, запускать системные команды, создавать и редактировать файлы, а также обрабатывать загруженные файлы непосредственно в разговоре API.
Инструмент выполнения кода позволяет Claude запускать команды Bash и манипулировать файлами, включая написание кода, в безопасной изолированной среде.

<Note>
Инструмент выполнения кода в настоящее время находится в открытой бета-версии.

Чтобы использовать эту функцию, добавьте [бета-заголовок](/docs/ru/api/beta-headers) `"code-execution-2025-08-25"` к вашим запросам API.
</Note>

## Совместимость моделей

Инструмент выполнения кода доступен на следующих моделях:

| Модель | Версия инструмента |
|-------|--------------|
| Claude Opus 4.5 (`claude-opus-4-5-20251101`) | `code_execution_20250825` |
| Claude Opus 4.1 (`claude-opus-4-1-20250805`) | `code_execution_20250825` |
| Claude Opus 4 (`claude-opus-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`) | `code_execution_20250825` |
| Claude Sonnet 4 (`claude-sonnet-4-20250514`) | `code_execution_20250825` |
| Claude Sonnet 3.7 (`claude-3-7-sonnet-20250219`) ([устарело](/docs/ru/about-claude/model-deprecations)) | `code_execution_20250825` |
| Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) | `code_execution_20250825` |
| Claude Haiku 3.5 (`claude-3-5-haiku-latest`) | `code_execution_20250825` |

<Note>
Текущая версия `code_execution_20250825` поддерживает команды Bash и операции с файлами. Также доступна устаревшая версия `code_execution_20250522` (только Python). Подробности миграции см. в разделе [Обновление до последней версии инструмента](#upgrade-to-latest-tool-version).
</Note>

<Warning>
Более старые версии инструмента не гарантируют обратную совместимость с более новыми моделями. Всегда используйте версию инструмента, соответствующую версии вашей модели.
</Warning>

## Быстрый старт

Вот простой пример, который просит Claude выполнить вычисление:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
            }
        ],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: "Calculate the mean and standard deviation of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      }
    ],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

## Как работает выполнение кода

Когда вы добавляете инструмент выполнения кода к вашему запросу API:

1. Claude оценивает, поможет ли выполнение кода ответить на ваш вопрос
2. Инструмент автоматически предоставляет Claude следующие возможности:
   - **Команды Bash**: Выполнение команд оболочки для системных операций и управления пакетами
   - **Операции с файлами**: Создание, просмотр и редактирование файлов непосредственно, включая написание кода
3. Claude может использовать любую комбинацию этих возможностей в одном запросе
4. Все операции выполняются в безопасной изолированной среде
5. Claude предоставляет результаты с любыми созданными диаграммами, вычислениями или анализом

## Как использовать инструмент

### Выполнение команд Bash

Попросите Claude проверить информацию о системе и установить пакеты:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Check the Python version and list installed packages"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Check the Python version and list installed packages"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Check the Python version and list installed packages"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### Создание и редактирование файлов напрямую

Claude может создавать, просматривать и редактировать файлы непосредственно в изолированной среде, используя возможности манипуляции файлами:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Create a config.yaml file with database settings, then update the port from 5432 to 3306"
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});
```
</CodeGroup>

### Загрузка и анализ собственных файлов

Чтобы анализировать собственные файлы данных (CSV, Excel, изображения и т. д.), загрузите их через Files API и ссылайтесь на них в вашем запросе:

<Note>
Использование Files API с Code Execution требует два бета-заголовка: `"anthropic-beta": "code-execution-2025-08-25,files-api-2025-04-14"`
</Note>

Окружение Python может обрабатывать различные типы файлов, загруженные через Files API, включая:

- CSV
- Excel (.xlsx, .xls)
- JSON
- XML
- Изображения (JPEG, PNG, GIF, WebP)
- Текстовые файлы (.txt, .md, .py и т. д)

#### Загрузка и анализ файлов

1. **Загрузите ваш файл** используя [Files API](/docs/ru/build-with-claude/files)
2. **Ссылайтесь на файл** в вашем сообщении, используя блок содержимого `container_upload`
3. **Включите инструмент выполнения кода** в ваш запрос API

<CodeGroup>
```bash Shell
# Сначала загрузите файл
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \

# Затем используйте file_id с выполнением кода
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this CSV data"},
                {"type": "container_upload", "file_id": "file_abc123"}
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Загрузите файл
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# Используйте file_id с выполнением кода
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { createReadStream } from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Загрузите файл
  const fileObject = await anthropic.beta.files.create({
    file: createReadStream("data.csv"),
  });

  // Используйте file_id с выполнением кода
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Analyze this CSV data" },
        { type: "container_upload", file_id: fileObject.id }
      ]
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response);
}

main().catch(console.error);
```
</CodeGroup>

#### Получение созданных файлов

Когда Claude создает файлы во время выполнения кода, вы можете получить эти файлы, используя Files API:

<CodeGroup>
```python Python
from anthropic import Anthropic

# Инициализируйте клиент
client = Anthropic()

# Запросите выполнение кода, которое создает файлы
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Create a matplotlib visualization and save it as output.png"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Извлеките ID файлов из ответа
def extract_file_ids(response):
    file_ids = []
    for item in response.content:
        if item.type == 'bash_code_execution_tool_result':
            content_item = item.content
            if content_item.type == 'bash_code_execution_result':
                for file in content_item.content:
                    if hasattr(file, 'file_id'):
                        file_ids.append(file.file_id)
    return file_ids

# Загрузите созданные файлы
for file_id in extract_file_ids(response):
    file_metadata = client.beta.files.retrieve_metadata(file_id)
    file_content = client.beta.files.download(file_id)
    file_content.write_to_file(file_metadata.filename)
    print(f"Downloaded: {file_metadata.filename}")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import { writeFileSync } from 'fs';

// Инициализируйте клиент
const anthropic = new Anthropic();

async function main() {
  // Запросите выполнение кода, которое создает файлы
  const response = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Create a matplotlib visualization and save it as output.png"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // Извлеките ID файлов из ответа
  function extractFileIds(response: any): string[] {
    const fileIds: string[] = [];
    for (const item of response.content) {
      if (item.type === 'bash_code_execution_tool_result') {
        const contentItem = item.content;
        if (contentItem.type === 'bash_code_execution_result' && contentItem.content) {
          for (const file of contentItem.content) {
            fileIds.push(file.file_id);
          }
        }
      }
    }
    return fileIds;
  }

  // Загрузите созданные файлы
  const fileIds = extractFileIds(response);
  for (const fileId of fileIds) {
    const fileMetadata = await anthropic.beta.files.retrieveMetadata(fileId);
    const fileContent = await anthropic.beta.files.download(fileId);

    // Преобразуйте ReadableStream в Buffer и сохраните
    const chunks: Uint8Array[] = [];
    for await (const chunk of fileContent) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    writeFileSync(fileMetadata.filename, buffer);
    console.log(`Downloaded: ${fileMetadata.filename}`);
  }
}

main().catch(console.error);
```
</CodeGroup>

### Комбинирование операций

Сложный рабочий процесс, использующий все возможности:

<CodeGroup>
```bash Shell
# Сначала загрузите файл
curl https://api.anthropic.com/v1/files \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: files-api-2025-04-14" \
    --form 'file=@"data.csv"' \
    > file_response.json

# Извлеките file_id (используя jq)
FILE_ID=$(jq -r '.id' file_response.json)

# Затем используйте его с выполнением кода
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25,files-api-2025-04-14" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": [
                {
                    "type": "text", 
                    "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"
                },
                {
                    "type": "container_upload", 
                    "file_id": "'$FILE_ID'"
                }
            ]
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```

```python Python
# Загрузите файл
file_object = client.beta.files.upload(
    file=open("data.csv", "rb"),
)

# Используйте его с выполнением кода
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25", "files-api-2025-04-14"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
            {"type": "container_upload", "file_id": file_object.id}
        ]
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Claude может:
# 1. Использовать bash для проверки размера файла и предварительного просмотра данных
# 2. Использовать text_editor для написания кода Python для анализа CSV и создания визуализаций
# 3. Использовать bash для запуска кода Python
# 4. Использовать text_editor для создания README.md с результатами
# 5. Использовать bash для организации файлов в каталог отчета
```

```typescript TypeScript
// Загрузите файл
const fileObject = await anthropic.beta.files.create({
  file: createReadStream("data.csv"),
});

// Используйте его с выполнением кода
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["code-execution-2025-08-25", "files-api-2025-04-14"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: [
      {type: "text", text: "Analyze this CSV data: create a summary report, save visualizations, and create a README with the findings"},
      {type: "container_upload", file_id: fileObject.id}
    ]
  }],
  tools: [{
    type: "code_execution_20250825",
    name: "code_execution"
  }]
});

// Claude может:
// 1. Использовать bash для проверки размера файла и предварительного просмотра данных
// 2. Использовать text_editor для написания кода Python для анализа CSV и создания визуализаций
// 3. Использовать bash для запуска кода Python
// 4. Использовать text_editor для создания README.md с результатами
// 5. Использовать bash для организации файлов в каталог отчета
```
</CodeGroup>

## Определение инструмента

Инструмент выполнения кода не требует дополнительных параметров:

```json JSON
{
  "type": "code_execution_20250825",
  "name": "code_execution"
}
```

Когда этот инструмент предоставляется, Claude автоматически получает доступ к двум вспомогательным инструментам:
- `bash_code_execution`: Запуск команд оболочки
- `text_editor_code_execution`: Просмотр, создание и редактирование файлов, включая написание кода

## Формат ответа

Инструмент выполнения кода может возвращать два типа результатов в зависимости от операции:

### Ответ команды Bash

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "name": "bash_code_execution",
  "input": {
    "command": "ls -la | head -5"
  }
},
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01B3C4D5E6F7G8H9I0J1K2L3",
  "content": {
    "type": "bash_code_execution_result",
    "stdout": "total 24\ndrwxr-xr-x 2 user user 4096 Jan 1 12:00 .\ndrwxr-xr-x 3 user user 4096 Jan 1 11:00 ..\n-rw-r--r-- 1 user user  220 Jan 1 12:00 data.csv\n-rw-r--r-- 1 user user  180 Jan 1 12:00 config.json",
    "stderr": "",
    "return_code": 0
  }
}
```

### Ответы операций с файлами

**Просмотр файла:**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "name": "text_editor_code_execution",
  "input": {
    "command": "view",
    "path": "config.json"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01C4D5E6F7G8H9I0J1K2L3M4",
  "content": {
    "type": "text_editor_code_execution_result",
    "file_type": "text",
    "content": "{\n  \"setting\": \"value\",\n  \"debug\": true\n}",
    "numLines": 4,
    "startLine": 1,
    "totalLines": 4
  }
}
```

**Создание файла:**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "name": "text_editor_code_execution",
  "input": {
    "command": "create",
    "path": "new_file.txt",
    "file_text": "Hello, World!"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01D5E6F7G8H9I0J1K2L3M4N5",
  "content": {
    "type": "text_editor_code_execution_result",
    "is_file_update": false
  }
}
```

**Редактирование файла (str_replace):**
```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "name": "text_editor_code_execution",
  "input": {
    "command": "str_replace",
    "path": "config.json",
    "old_str": "\"debug\": true",
    "new_str": "\"debug\": false"
  }
},
{
  "type": "text_editor_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01E6F7G8H9I0J1K2L3M4N5O6",
  "content": {
    "type": "text_editor_code_execution_result",
    "oldStart": 3,
    "oldLines": 1,
    "newStart": 3,
    "newLines": 1,
    "lines": ["-  \"debug\": true", "+  \"debug\": false"]
  }
}
```

### Результаты

Все результаты выполнения включают:
- `stdout`: Вывод успешного выполнения
- `stderr`: Сообщения об ошибках при сбое выполнения
- `return_code`: 0 для успеха, ненулевое значение для сбоя

Дополнительные поля для операций с файлами:
- **Просмотр**: `file_type`, `content`, `numLines`, `startLine`, `totalLines`
- **Создание**: `is_file_update` (существовал ли файл ранее)
- **Редактирование**: `oldStart`, `oldLines`, `newStart`, `newLines`, `lines` (формат diff)

### Ошибки

Каждый тип инструмента может возвращать специфические ошибки:

**Общие ошибки (все инструменты):**
```json
{
  "type": "bash_code_execution_tool_result",
  "tool_use_id": "srvtoolu_01VfmxgZ46TiHbmXgy928hQR",
  "content": {
    "type": "bash_code_execution_tool_result_error",
    "error_code": "unavailable"
  }
}
```

**Коды ошибок по типам инструментов:**

| Инструмент | Код ошибки | Описание |
|------|-----------|-------------|
| Все инструменты | `unavailable` | Инструмент временно недоступен |
| Все инструменты | `execution_time_exceeded` | Выполнение превысило максимальный лимит времени |
| Все инструменты | `container_expired` | Контейнер истек и больше недоступен |
| Все инструменты | `invalid_tool_input` | Неверные параметры, предоставленные инструменту |
| Все инструменты | `too_many_requests` | Превышен лимит частоты запросов для использования инструмента |
| text_editor | `file_not_found` | Файл не существует (для операций просмотра/редактирования) |
| text_editor | `string_not_found` | `old_str` не найден в файле (для str_replace) |

#### Причина остановки `pause_turn`

Ответ может включать причину остановки `pause_turn`, которая указывает, что API приостановил долгий ход. Вы можете предоставить ответ как есть в последующем запросе, чтобы позволить Claude продолжить свой ход, или изменить содержимое, если вы хотите прервать разговор.

## Контейнеры

Инструмент выполнения кода работает в безопасной контейнеризованной среде, разработанной специально для выполнения кода, с повышенным акцентом на Python.

### Среда выполнения
- **Версия Python**: 3.11.12
- **Операционная система**: Контейнер на основе Linux
- **Архитектура**: x86_64 (AMD64)

### Ограничения ресурсов
- **Память**: 5GiB RAM
- **Дисковое пространство**: 5GiB рабочего хранилища
- **CPU**: 1 CPU

### Сетевые соединения и безопасность
- **Доступ в Интернет**: Полностью отключен в целях безопасности
- **Внешние соединения**: Исходящие сетевые запросы не разрешены
- **Изоляция песочницы**: Полная изоляция от хост-системы и других контейнеров
- **Доступ к файлам**: Ограничен только каталогом рабочего пространства
- **Область действия рабочего пространства**: Как и [Files](/docs/ru/build-with-claude/files), контейнеры ограничены рабочей областью ключа API
- **Истечение**: Контейнеры истекают через 30 дней после создания

### Предустановленные библиотеки
Изолированная среда Python включает эти часто используемые библиотеки:
- **Наука о данных**: pandas, numpy, scipy, scikit-learn, statsmodels
- **Визуализация**: matplotlib, seaborn
- **Обработка файлов**: pyarrow, openpyxl, xlsxwriter, xlrd, pillow, python-pptx, python-docx, pypdf, pdfplumber, pypdfium2, pdf2image, pdfkit, tabula-py, reportlab[pycairo], Img2pdf
- **Математика и вычисления**: sympy, mpmath
- **Утилиты**: tqdm, python-dateutil, pytz, joblib, unzip, unrar, 7zip, bc, rg (ripgrep), fd, sqlite

## Повторное использование контейнера

Вы можете повторно использовать существующий контейнер в нескольких запросах API, предоставив ID контейнера из предыдущего ответа.
Это позволяет вам сохранять созданные файлы между запросами.

### Пример

<CodeGroup>
```python Python
import os
from anthropic import Anthropic

# Инициализируйте клиент
client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)

# Первый запрос: Создайте файл со случайным числом
response1 = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)

# Извлеките ID контейнера из первого ответа
container_id = response1.container.id

# Второй запрос: Повторно используйте контейнер для чтения файла
response2 = client.beta.messages.create(
    container=container_id,  # Повторно используйте тот же контейнер
    model="claude-sonnet-4-5",
    betas=["code-execution-2025-08-25"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools=[{
        "type": "code_execution_20250825",
        "name": "code_execution"
    }]
)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

async function main() {
  // Первый запрос: Создайте файл со случайным числом
  const response1 = await anthropic.beta.messages.create({
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Write a file with a random number and save it to '/tmp/number.txt'"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  // Извлеките ID контейнера из первого ответа
  const containerId = response1.container.id;

  // Второй запрос: Повторно используйте контейнер для чтения файла
  const response2 = await anthropic.beta.messages.create({
    container: containerId,  // Повторно используйте тот же контейнер
    model: "claude-sonnet-4-5",
    betas: ["code-execution-2025-08-25"],
    max_tokens: 4096,
    messages: [{
      role: "user",
      content: "Read the number from '/tmp/number.txt' and calculate its square"
    }],
    tools: [{
      type: "code_execution_20250825",
      name: "code_execution"
    }]
  });

  console.log(response2.content);
}

main().catch(console.error);
```

```bash Shell
# Первый запрос: Создайте файл со случайным числом
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Write a file with a random number and save it to \"/tmp/number.txt\""
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }' > response1.json

# Извлеките ID контейнера из ответа (используя jq)
CONTAINER_ID=$(jq -r '.container.id' response1.json)

# Второй запрос: Повторно используйте контейнер для чтения файла
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: code-execution-2025-08-25" \
    --header "content-type: application/json" \
    --data '{
        "container": "'$CONTAINER_ID'",
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Read the number from \"/tmp/number.txt\" and calculate its square"
        }],
        "tools": [{
            "type": "code_execution_20250825",
            "name": "code_execution"
        }]
    }'
```
</CodeGroup>

## Потоковая передача

С включенной потоковой передачей вы будете получать события выполнения кода по мере их возникновения:

```javascript
event: content_block_start
data: {"type": "content_block_start", "index": 1, "content_block": {"type": "server_tool_use", "id": "srvtoolu_xyz789", "name": "code_execution"}}

// Выполнение кода передается потоком
event: content_block_delta
data: {"type": "content_block_delta", "index": 1, "delta": {"type": "input_json_delta", "partial_json": "{\"code\":\"import pandas as pd\\ndf = pd.read_csv('data.csv')\\nprint(df.head())\"}"}}

// Пауза во время выполнения кода

// Результаты выполнения передаются потоком
event: content_block_start
data: {"type": "content_block_start", "index": 2, "content_block": {"type": "code_execution_tool_result", "tool_use_id": "srvtoolu_xyz789", "content": {"stdout": "   A  B  C\n0  1  2  3\n1  4  5  6", "stderr": ""}}}
```

## Пакетные запросы

Вы можете включить инструмент выполнения кода в [Messages Batches API](/docs/ru/build-with-claude/batch-processing). Вызовы инструмента выполнения кода через Messages Batches API оцениваются так же, как и в обычных запросах Messages API.

## Использование и цены

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

## Обновление до последней версии инструмента

Обновляясь до `code-execution-2025-08-25`, вы получаете доступ к манипуляции файлами и возможностям Bash, включая код на нескольких языках. Разницы в цене нет.

### Что изменилось

| Компонент | Устаревший | Текущий |
|-----------|------------------|----------------------------|
| Бета-заголовок | `code-execution-2025-05-22` | `code-execution-2025-08-25` |
| Тип инструмента | `code_execution_20250522` | `code_execution_20250825` |
| Возможности | Только Python | Команды Bash, операции с файлами |
| Типы ответов | `code_execution_result` | `bash_code_execution_result`, `text_editor_code_execution_result` |

### Обратная совместимость

- Все существующие выполнения кода Python продолжают работать точно так же, как раньше
- Никаких изменений не требуется для существующих рабочих процессов, использующих только Python

### Шаги обновления

Чтобы обновить, вам нужно внести следующие изменения в ваши запросы API:

1. **Обновите бета-заголовок**:
   ```diff
   - "anthropic-beta": "code-execution-2025-05-22"
   + "anthropic-beta": "code-execution-2025-08-25"
   ```

2. **Обновите тип инструмента**:
   ```diff
   - "type": "code_execution_20250522"
   + "type": "code_execution_20250825"
   ```

3. **Проверьте обработку ответов** (если программно анализируете ответы):
   - Блоки для ответов выполнения Python больше не будут отправляться
   - Вместо этого будут отправляться новые типы ответов для Bash и операций с файлами (см. раздел Формат ответа)

## Программный вызов инструментов

Инструмент выполнения кода обеспечивает [программный вызов инструментов](/docs/ru/agents-and-tools/tool-use/programmatic-tool-calling), который позволяет Claude писать код, который вызывает ваши пользовательские инструменты программно в контейнере выполнения. Это обеспечивает эффективные многоинструментальные рабочие процессы, фильтрацию данных перед достижением контекста Claude и сложную условную логику.

<CodeGroup>
```python Python
# Включите программный вызов для ваших инструментов
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["advanced-tool-use-2025-11-20"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Get weather for 5 cities and find the warmest"
    }],
    tools=[
        {
            "type": "code_execution_20250825",
            "name": "code_execution"
        },
        {
            "name": "get_weather",
            "description": "Get weather for a city",
            "input_schema": {...},
            "allowed_callers": ["code_execution_20250825"]  # Включите программный вызов
        }
    ]
)
```
</CodeGroup>

Узнайте больше в [документации программного вызова инструментов](/docs/ru/agents-and-tools/tool-use/programmatic-tool-calling).

## Использование выполнения кода с Agent Skills

Инструмент выполнения кода позволяет Claude использовать [Agent Skills](/docs/ru/agents-and-tools/agent-skills/overview). Skills — это модульные возможности, состоящие из инструкций, скриптов и ресурсов, которые расширяют функциональность Claude.

Узнайте больше в [документации Agent Skills](/docs/ru/agents-and-tools/agent-skills/overview) и [руководстве API Agent Skills](/docs/ru/build-with-claude/skills-guide).