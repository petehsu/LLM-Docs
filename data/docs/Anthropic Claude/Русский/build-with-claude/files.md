# Files API

---

Files API позволяет загружать и управлять файлами для использования с Claude API без повторной загрузки содержимого при каждом запросе. Это особенно полезно при использовании [инструмента выполнения кода](/docs/ru/agents-and-tools/tool-use/code-execution-tool) для предоставления входных данных (например, наборов данных и документов) и последующей загрузки выходных данных (например, диаграмм). Вы также можете использовать Files API, чтобы избежать необходимости постоянно повторно загружать часто используемые документы и изображения при нескольких вызовах API. Вы можете [изучить справочник API напрямую](/docs/ru/api/files-create), а также прочитать это руководство.

<Note>
Files API в настоящее время находится в бета-версии. Пожалуйста, свяжитесь с нами через нашу [форму обратной связи](https://forms.gle/tisHyierGwgN4DUE9), чтобы поделиться своим опытом использования Files API.
</Note>

## Поддерживаемые модели

Ссылка на `file_id` в запросе Messages поддерживается во всех моделях, которые поддерживают данный тип файла. Например, [изображения](/docs/ru/build-with-claude/vision) поддерживаются во всех моделях Claude 3+, [PDF](/docs/ru/build-with-claude/pdf-support) во всех моделях Claude 3.5+, и [различные другие типы файлов](/docs/ru/agents-and-tools/tool-use/code-execution-tool#supported-file-types) для инструмента выполнения кода в Claude 3.5 Haiku и всех моделях Claude 3.7+.

Files API в настоящее время не поддерживается на Amazon Bedrock или Google Vertex AI.

## Как работает Files API

Files API предоставляет простой подход "загрузить один раз, использовать много раз" для работы с файлами:

- **Загружайте файлы** в наше защищённое хранилище и получайте уникальный `file_id`
- **Загружайте файлы**, созданные навыками или инструментом выполнения кода
- **Ссылайтесь на файлы** в запросах [Messages](/docs/ru/api/messages), используя `file_id` вместо повторной загрузки содержимого
- **Управляйте своими файлами** с помощью операций списания, получения и удаления

## Как использовать Files API

<Note>
Для использования Files API вам необходимо включить заголовок бета-функции: `anthropic-beta: files-api-2025-04-14`.
</Note>

### Загрузка файла

Загрузите файл для использования в будущих вызовах API:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@/path/to/document.pdf"
```

```python Python
import anthropic

client = anthropic.Anthropic()
client.beta.files.upload(
  file=("document.pdf", open("/path/to/document.pdf", "rb"), "application/pdf"),
)
```

```typescript TypeScript
import Anthropic, { toFile } from '@anthropic-ai/sdk';
import fs from "fs";

const anthropic = new Anthropic();

await anthropic.beta.files.upload({
  file: await toFile(fs.createReadStream('/path/to/document.pdf'), undefined, { type: 'application/pdf' })
}, {
  betas: ['files-api-2025-04-14']
});
```
</CodeGroup>

Ответ от загрузки файла будет включать:

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "document.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-01-01T00:00:00Z",
  "downloadable": false
}
```

### Использование файла в сообщениях

После загрузки ссылайтесь на файл, используя его `file_id`:

<CodeGroup>
```bash Shell
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Please summarize this document for me."          
          },
          {
            "type": "document",
            "source": {
              "type": "file",
              "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
            }
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please summarize this document for me."
                },
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                    }
                }
            ]
        }
    ],
    betas=["files-api-2025-04-14"],
)
print(response)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Please summarize this document for me."
        },
        {
          type: "document",
          source: {
            type: "file",
            file_id: "file_011CNha8iCJcU1wXNR6q4V8w"
          }
        }
      ]
    }
  ],
  betas: ["files-api-2025-04-14"],
});

console.log(response);
```
</CodeGroup>

### Типы файлов и блоки содержимого

Files API поддерживает различные типы файлов, которые соответствуют различным типам блоков содержимого:

| Тип файла | MIME тип | Тип блока содержимого | Вариант использования |
| :--- | :--- | :--- | :--- |
| PDF | `application/pdf` | `document` | Анализ текста, обработка документов |
| Простой текст | `text/plain` | `document` | Анализ текста, обработка |
| Изображения | `image/jpeg`, `image/png`, `image/gif`, `image/webp` | `image` | Анализ изображений, визуальные задачи |
| [Наборы данных, другое](/docs/ru/agents-and-tools/tool-use/code-execution-tool#supported-file-types) | Различные | `container_upload` | Анализ данных, создание визуализаций  |

### Работа с другими форматами файлов

Для типов файлов, которые не поддерживаются как блоки `document` (.csv, .txt, .md, .docx, .xlsx), преобразуйте файлы в простой текст и включите содержимое непосредственно в ваше сообщение:

<CodeGroup>
```bash Shell
# Пример: чтение текстового файла и отправка его как простого текста
# Примечание: для файлов со специальными символами рассмотрите использование кодирования base64
TEXT_CONTENT=$(cat document.txt | jq -Rs .)

curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @- <<EOF
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Here's the document content:\n\n${TEXT_CONTENT}\n\nPlease summarize this document."
        }
      ]
    }
  ]
}
EOF
```

```python Python
import pandas as pd
import anthropic

client = anthropic.Anthropic()

# Пример: чтение CSV файла
df = pd.read_csv('data.csv')
csv_content = df.to_string()

# Отправить как простой текст в сообщении
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Here's the CSV data:\n\n{csv_content}\n\nPlease analyze this data."
                }
            ]
        }
    ]
)

print(response.content[0].text)
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function analyzeDocument() {
  // Пример: чтение текстового файла
  const textContent = fs.readFileSync('document.txt', 'utf-8');

  // Отправить как простой текст в сообщении
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Here's the document content:\n\n${textContent}\n\nPlease summarize this document.`
          }
        ]
      }
    ]
  });

  console.log(response.content[0].text);
}

analyzeDocument();
```
</CodeGroup>

<Note>
Для файлов .docx, содержащих изображения, сначала преобразуйте их в формат PDF, а затем используйте [поддержку PDF](/docs/ru/build-with-claude/pdf-support) для использования встроенного анализа изображений. Это позволяет использовать цитаты из документа PDF.
</Note>

#### Блоки документов

Для PDF и текстовых файлов используйте блок содержимого `document`:

```json
{
  "type": "document",
  "source": {
    "type": "file",
    "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
  },
  "title": "Document Title", // Опционально
  "context": "Context about the document", // Опционально  
  "citations": {"enabled": true} // Опционально, включает цитаты
}
```

#### Блоки изображений

Для изображений используйте блок содержимого `image`:

```json
{
  "type": "image",
  "source": {
    "type": "file",
    "file_id": "file_011CPMxVD3fHLUhvTqtsQA5w"
  }
}
```

### Управление файлами

#### Список файлов

Получите список загруженных файлов:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
files = client.beta.files.list()
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const files = await anthropic.beta.files.list({
  betas: ['files-api-2025-04-14'],
});
```
</CodeGroup>

#### Получение метаданных файла

Получите информацию о конкретном файле:

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
file = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const file = await anthropic.beta.files.retrieveMetadata(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

#### Удаление файла

Удалите файл из вашего рабочего пространства:

<CodeGroup>
```bash Shell
curl -X DELETE https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14"
```

```python Python
import anthropic

client = anthropic.Anthropic()
result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const result = await anthropic.beta.files.delete(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);
```
</CodeGroup>

### Загрузка файла

Загружайте файлы, которые были созданы навыками или инструментом выполнения кода:

<CodeGroup>
```bash Shell
curl -X GET "https://api.anthropic.com/v1/files/file_011CNha8iCJcU1wXNR6q4V8w/content" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  --output downloaded_file.txt
```

```python Python
import anthropic

client = anthropic.Anthropic()
file_content = client.beta.files.download("file_011CNha8iCJcU1wXNR6q4V8w")

# Сохранить в файл
with open("downloaded_file.txt", "w") as f:
    f.write(file_content.decode('utf-8'))
```

```typescript TypeScript
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

const fileContent = await anthropic.beta.files.download(
  "file_011CNha8iCJcU1wXNR6q4V8w",
  { betas: ['files-api-2025-04-14'] },
);

// Сохранить в файл
fs.writeFileSync("downloaded_file.txt", fileContent);
```
</CodeGroup>

<Note>
Вы можете загружать только файлы, которые были созданы [навыками](/docs/ru/build-with-claude/skills-guide) или [инструментом выполнения кода](/docs/ru/agents-and-tools/tool-use/code-execution-tool). Загруженные вами файлы не могут быть загружены.
</Note>

---

## Хранилище файлов и ограничения

### Ограничения хранилища

- **Максимальный размер файла:** 500 МБ на файл
- **Общее хранилище:** 100 ГБ на организацию

### Жизненный цикл файла

- Файлы относятся к рабочему пространству ключа API. Другие ключи API могут использовать файлы, созданные любым другим ключом API, связанным с тем же рабочим пространством
- Файлы сохраняются до их удаления
- Удалённые файлы не могут быть восстановлены
- Файлы становятся недоступными через API вскоре после удаления, но они могут сохраняться в активных вызовах `Messages` API и связанных использованиях инструментов
- Файлы, которые удаляют пользователи, будут удалены в соответствии с нашей [политикой хранения данных](https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data).

---

## Обработка ошибок

Распространённые ошибки при использовании Files API включают:

- **Файл не найден (404):** Указанный `file_id` не существует или у вас нет доступа к нему
- **Недопустимый тип файла (400):** Тип файла не соответствует типу блока содержимого (например, использование файла изображения в блоке документа)
- **Превышает размер контекстного окна (400):** Файл больше, чем размер контекстного окна (например, использование файла простого текста размером 500 МБ в запросе `/v1/messages`)
- **Недопустимое имя файла (400):** Имя файла не соответствует требованиям по длине (1-255 символов) или содержит запрещённые символы (`<`, `>`, `:`, `"`, `|`, `?`, `*`, `\`, `/`, или символы unicode 0-31)
- **Файл слишком большой (413):** Файл превышает лимит 500 МБ
- **Превышен лимит хранилища (403):** Ваша организация достигла лимита хранилища 100 ГБ

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "File not found: file_011CNha8iCJcU1wXNR6q4V8w"
  }
}
```

## Использование и выставление счётов

Операции File API **бесплатны**:
- Загрузка файлов
- Загрузка файлов
- Список файлов
- Получение метаданных файла  
- Удаление файлов

Содержимое файла, используемое в запросах `Messages`, оценивается как входные токены. Вы можете загружать только файлы, созданные [навыками](/docs/ru/build-with-claude/skills-guide) или [инструментом выполнения кода](/docs/ru/agents-and-tools/tool-use/code-execution-tool).

### Ограничения скорости

Во время бета-периода:
- Вызовы API, связанные с файлами, ограничены примерно 100 запросами в минуту
- [Свяжитесь с нами](mailto:sales@anthropic.com), если вам нужны более высокие лимиты для вашего варианта использования