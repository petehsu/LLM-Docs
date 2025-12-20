# Поддержка PDF

Обрабатывайте PDF с помощью Claude. Извлекайте текст, анализируйте диаграммы и понимайте визуальное содержимое ваших документов.

---

Теперь вы можете спросить Claude о любом тексте, изображениях, диаграммах и таблицах в предоставляемых вами PDF. Некоторые примеры использования:
- Анализ финансовых отчетов и понимание диаграмм/таблиц
- Извлечение ключевой информации из юридических документов
- Помощь в переводе документов
- Преобразование информации документов в структурированные форматы

## Перед началом работы

### Проверьте требования к PDF
Claude работает с любым стандартным PDF. Однако вы должны убедиться, что размер вашего запроса соответствует этим требованиям при использовании поддержки PDF:

| Требование | Ограничение |
|---|---|
| Максимальный размер запроса | 32МБ |
| Максимальное количество страниц на запрос | 100 |
| Формат | Стандартный PDF (без паролей/шифрования) |

Обратите внимание, что оба ограничения относятся ко всей полезной нагрузке запроса, включая любое другое содержимое, отправляемое вместе с PDF.

Поскольку поддержка PDF основана на возможностях зрения Claude, она подвержена тем же [ограничениям и соображениям](/docs/ru/build-with-claude/vision#limitations), что и другие задачи зрения.

### Поддерживаемые платформы и модели

Поддержка PDF в настоящее время поддерживается через прямой доступ к API и Google Vertex AI. Все [активные модели](/docs/ru/about-claude/models/overview) поддерживают обработку PDF.

Поддержка PDF теперь доступна на Amazon Bedrock со следующими соображениями:

### Поддержка PDF в Amazon Bedrock

При использовании поддержки PDF через Converse API Amazon Bedrock существует два различных режима обработки документов:

<Note>
**Важно**: Для доступа к полным возможностям визуального понимания PDF Claude в Converse API вы должны включить цитирование. Без включенного цитирования API возвращается только к базовому извлечению текста. Узнайте больше о [работе с цитированием](/docs/ru/build-with-claude/citations).
</Note>

#### Режимы обработки документов

1. **Converse Document Chat** (Исходный режим - только извлечение текста)
   - Обеспечивает базовое извлечение текста из PDF
   - Не может анализировать изображения, диаграммы или визуальные макеты в PDF
   - Использует приблизительно 1,000 токенов для 3-страничного PDF
   - Автоматически используется, когда цитирование не включено

2. **Claude PDF Chat** (Новый режим - полное визуальное понимание)
   - Обеспечивает полный визуальный анализ PDF
   - Может понимать и анализировать диаграммы, графики, изображения и визуальные макеты
   - Обрабатывает каждую страницу как текст и изображение для всестороннего понимания
   - Использует приблизительно 7,000 токенов для 3-страничного PDF
   - **Требует включения цитирования** в Converse API

#### Ключевые ограничения

- **Converse API**: Визуальный анализ PDF требует включения цитирования. В настоящее время нет возможности использовать визуальный анализ без цитирования (в отличие от InvokeModel API).
- **InvokeModel API**: Обеспечивает полный контроль над обработкой PDF без принудительного цитирования.

#### Распространенные проблемы

Если клиенты сообщают, что Claude не видит изображения или диаграммы в их PDF при использовании Converse API, им, вероятно, нужно включить флаг цитирования. Без него Converse возвращается только к базовому извлечению текста.

<Note>
Это известное ограничение Converse API, над устранением которого мы работаем. Для приложений, требующих визуального анализа PDF без цитирования, рассмотрите возможность использования InvokeModel API вместо этого.
</Note>

<Note>
Для файлов, не являющихся PDF, таких как .csv, .xlsx, .docx, .md или .txt файлы, см. [Работа с другими форматами файлов](/docs/ru/build-with-claude/files#working-with-other-file-formats).
</Note>

***

## Обработка PDF с помощью Claude

### Отправьте свой первый PDF-запрос
Давайте начнем с простого примера, используя Messages API. Вы можете предоставить PDF Claude тремя способами:

1. Как ссылку URL на PDF, размещенный онлайн
2. Как PDF, закодированный в base64, в блоках содержимого `document`
3. По `file_id` из [Files API](/docs/ru/build-with-claude/files)

#### Вариант 1: PDF-документ на основе URL

Самый простой подход - ссылаться на PDF напрямую из URL:

<CodeGroup>
   ```bash Shell
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "url",
                    "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                }
            },
            {
                "type": "text",
                "text": "Каковы ключевые выводы в этом документе?"
            }]
        }]
    }'
    ```
    ```python Python
    import anthropic

    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "url",
                            "url": "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
                        }
                    },
                    {
                        "type": "text",
                        "text": "Каковы ключевые выводы в этом документе?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';

    const anthropic = new Anthropic();
    
    async function main() {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'url',
                  url: 'https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf',
                },
              },
              {
                type: 'text',
                text: 'Каковы ключевые выводы в этом документе?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```
    ```java Java
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.*;

    public class PdfExample {
        public static void main(String[] args) {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Create document block with URL
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .urlPdfSource("https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf")
                    .build();

            // Create a message with document and text content blocks
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Каковы ключевые выводы в этом документе?")
 .build()
 )
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            System.out.println(message.content());
        }
    }
    ```
</CodeGroup>

#### Вариант 2: PDF-документ, закодированный в Base64

Если вам нужно отправить PDF из вашей локальной системы или когда URL недоступен:

<CodeGroup>
    ```bash Shell
    # Метод 1: Получить и закодировать удаленный PDF
    curl -s "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf" | base64 | tr -d '\n' > pdf_base64.txt

    # Метод 2: Закодировать локальный PDF файл
    # base64 document.pdf | tr -d '\n' > pdf_base64.txt

    # Создать файл JSON-запроса, используя содержимое pdf_base64.txt
    jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 1024,
        "messages": [{
            "role": "user",
            "content": [{
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": $PDF_BASE64
                }
            },
            {
                "type": "text",
                "text": "Каковы ключевые выводы в этом документе?"
            }]
        }]
    }' > request.json

    # Отправить API-запрос, используя JSON файл
    curl https://api.anthropic.com/v1/messages \
      -H "content-type: application/json" \
      -H "x-api-key: $ANTHROPIC_API_KEY" \
      -H "anthropic-version: 2023-06-01" \
      -d @request.json
    ```
    ```python Python
    import anthropic
    import base64
    import httpx

    # Сначала загрузить и закодировать PDF 
    pdf_url = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf"
    pdf_data = base64.standard_b64encode(httpx.get(pdf_url).content).decode("utf-8")

    # Альтернатива: Загрузить из локального файла
    # with open("document.pdf", "rb") as f:
    #     pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

    # Отправить Claude, используя кодирование base64
    client = anthropic.Anthropic()
    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "document",
                        "source": {
                            "type": "base64",
                            "media_type": "application/pdf",
                            "data": pdf_data
                        }
                    },
                    {
                        "type": "text",
                        "text": "Каковы ключевые выводы в этом документе?"
                    }
                ]
            }
        ],
    )

    print(message.content)
    ```
    ```typescript TypeScript
    import Anthropic from '@anthropic-ai/sdk';
    import fetch from 'node-fetch';
    import fs from 'fs';

    async function main() {
      // Метод 1: Получить и закодировать удаленный PDF
      const pdfURL = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
      const pdfResponse = await fetch(pdfURL);
      const arrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(arrayBuffer).toString('base64');
      
      // Метод 2: Загрузить из локального файла
      // const pdfBase64 = fs.readFileSync('document.pdf').toString('base64');
      
      // Отправить API-запрос с PDF, закодированным в base64
      const anthropic = new Anthropic();
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'document',
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Каковы ключевые выводы в этом документе?',
              },
            ],
          },
        ],
      });
      
      console.log(response);
    }
    
    main();
    ```

    ```java Java
    import java.io.IOException;
    import java.net.URI;
    import java.net.http.HttpClient;
    import java.net.http.HttpRequest;
    import java.net.http.HttpResponse;
    import java.util.Base64;
    import java.util.List;

    import com.anthropic.client.AnthropicClient;
    import com.anthropic.client.okhttp.AnthropicOkHttpClient;
    import com.anthropic.models.messages.ContentBlockParam;
    import com.anthropic.models.messages.DocumentBlockParam;
    import com.anthropic.models.messages.Message;
    import com.anthropic.models.messages.MessageCreateParams;
    import com.anthropic.models.messages.Model;
    import com.anthropic.models.messages.TextBlockParam;

    public class PdfExample {
        public static void main(String[] args) throws IOException, InterruptedException {
            AnthropicClient client = AnthropicOkHttpClient.fromEnv();

            // Метод 1: Скачать и закодировать удаленный PDF
            String pdfUrl = "https://assets.anthropic.com/m/1cd9d098ac3e6467/original/Claude-3-Model-Card-October-Addendum.pdf";
            HttpClient httpClient = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pdfUrl))
                    .GET()
                    .build();

            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            String pdfBase64 = Base64.getEncoder().encodeToString(response.body());

            // Метод 2: Загрузить из локального файла
            // byte[] fileBytes = Files.readAllBytes(Path.of("document.pdf"));
            // String pdfBase64 = Base64.getEncoder().encodeToString(fileBytes);

            // Создать блок документа с данными base64
            DocumentBlockParam documentParam = DocumentBlockParam.builder()
                    .base64PdfSource(pdfBase64)
                    .build();

            // Создать сообщение с блоками содержимого документа и текста
            MessageCreateParams params = MessageCreateParams.builder()
                    .model(Model.CLAUDE_OPUS_4_20250514)
                    .maxTokens(1024)
                    .addUserMessageOfBlockParams(
                            List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(TextBlockParam.builder().text("Каковы ключевые выводы в этом документе?").build())
                            )
                    )
                    .build();

            Message message = client.messages().create(params);
            message.content().stream()
                    .flatMap(contentBlock -> contentBlock.text().stream())
                    .forEach(textBlock -> System.out.println(textBlock.text()));
        }
    }
    ```

</CodeGroup>

#### Вариант 3: Files API

Для PDF, которые вы будете использовать повторно, или когда хотите избежать накладных расходов на кодирование, используйте [Files API](/docs/ru/build-with-claude/files): 

<CodeGroup>
```bash Shell
# Сначала загрузите ваш PDF в Files API
curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@document.pdf"

# Затем используйте возвращенный file_id в вашем сообщении
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -d '{
    "model": "claude-sonnet-4-5", 
    "max_tokens": 1024,
    "messages": [{
      "role": "user",
      "content": [{
        "type": "document",
        "source": {
          "type": "file",
          "file_id": "file_abc123"
        }
      },
      {
        "type": "text",
        "text": "Каковы ключевые выводы в этом документе?"
      }]
    }]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

# Загрузить PDF файл
with open("document.pdf", "rb") as f:
    file_upload = client.beta.files.upload(file=("document.pdf", f, "application/pdf"))

# Использовать загруженный файл в сообщении
message = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    betas=["files-api-2025-04-14"],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": file_upload.id
                    }
                },
                {
                    "type": "text",
                    "text": "Каковы ключевые выводы в этом документе?"
                }
            ]
        }
    ],
)

print(message.content)
```

```typescript TypeScript
import { Anthropic, toFile } from '@anthropic-ai/sdk';
import fs from 'fs';

const anthropic = new Anthropic();

async function main() {
  // Загрузить PDF файл
  const fileUpload = await anthropic.beta.files.upload({
    file: toFile(fs.createReadStream('document.pdf'), undefined, { type: 'application/pdf' })
  }, {
    betas: ['files-api-2025-04-14']
  });

  // Использовать загруженный файл в сообщении
  const response = await anthropic.beta.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    betas: ['files-api-2025-04-14'],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'file',
              file_id: fileUpload.id
            }
          },
          {
            type: 'text',
            text: 'Каковы ключевые выводы в этом документе?'
          }
        ]
      }
    ]
  });

  console.log(response);
}

main();
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.File;
import com.anthropic.models.files.FileUploadParams;
import com.anthropic.models.messages.*;

public class PdfFilesExample {
    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Загрузить PDF файл
        File file = client.beta().files().upload(FileUploadParams.builder()
                .file(Files.newInputStream(Path.of("document.pdf")))
                .build());

        // Использовать загруженный файл в сообщении
        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .fileSource(file.id())
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(
                        List.of(
 ContentBlockParam.ofDocument(documentParam),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Каковы ключевые выводы в этом документе?")
 .build()
 )
                        )
                )
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.content());
    }
}
```
</CodeGroup>

### Как работает поддержка PDF
Когда вы отправляете PDF Claude, происходят следующие шаги:
<Steps>
  <Step title="Система извлекает содержимое документа.">
    - Система преобразует каждую страницу документа в изображение.
    - Текст с каждой страницы извлекается и предоставляется вместе с изображением каждой страницы.
  </Step>
  <Step title="Claude анализирует как текст, так и изображения для лучшего понимания документа.">
    - Документы предоставляются как комбинация текста и изображений для анализа.
    - Это позволяет пользователям запрашивать понимание визуальных элементов PDF, таких как диаграммы, схемы и другое нетекстовое содержимое.
  </Step>
  <Step title="Claude отвечает, ссылаясь на содержимое PDF, если это уместно.">
    Claude может ссылаться как на текстовое, так и на визуальное содержимое при ответе. Вы можете дополнительно улучшить производительность, интегрируя поддержку PDF с:
    - **Кэширование промптов**: Для улучшения производительности при повторном анализе.
    - **Пакетная обработка**: Для высокообъемной обработки документов.
    - **Использование инструментов**: Для извлечения конкретной информации из документов для использования в качестве входных данных инструментов.
  </Step>
</Steps>

### Оцените свои расходы
Количество токенов PDF-файла зависит от общего текста, извлеченного из документа, а также от количества страниц:
- Стоимость текстовых токенов: Каждая страница обычно использует 1,500-3,000 токенов на страницу в зависимости от плотности содержимого. Применяется стандартное ценообразование API без дополнительных сборов за PDF.
- Стоимость токенов изображений: Поскольку каждая страница преобразуется в изображение, применяются те же [расчеты стоимости на основе изображений](/docs/ru/build-with-claude/vision#evaluate-image-size).

Вы можете использовать [подсчет токенов](/docs/ru/build-with-claude/token-counting) для оценки расходов на ваши конкретные PDF.

***

## Оптимизация обработки PDF

### Улучшение производительности
Следуйте этим лучшим практикам для оптимальных результатов:
- Размещайте PDF перед текстом в ваших запросах
- Используйте стандартные шрифты
- Убедитесь, что текст четкий и разборчивый
- Поворачивайте страницы в правильную вертикальную ориентацию
- Используйте логические номера страниц (из PDF-просмотрщика) в промптах
- Разделяйте большие PDF на части при необходимости
- Включите кэширование промптов для повторного анализа

### Масштабирование вашей реализации
Для высокообъемной обработки рассмотрите эти подходы:

#### Используйте кэширование промптов
Кэшируйте PDF для улучшения производительности при повторных запросах:
<CodeGroup>
```bash Shell
# Создать файл JSON-запроса, используя содержимое pdf_base64.txt
jq -n --rawfile PDF_BASE64 pdf_base64.txt '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [{
        "role": "user",
        "content": [{
            "type": "document",
            "source": {
                "type": "base64",
                "media_type": "application/pdf",
                "data": $PDF_BASE64
            },
            "cache_control": {
              "type": "ephemeral"
            }
        },
        {
            "type": "text",
            "text": "Какая модель имеет самые высокие показатели предпочтений человека в каждом случае использования?"
        }]
    }]
}' > request.json

# Затем сделать API-вызов, используя JSON файл
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data
                    },
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "Проанализируйте этот документ."
                }
            ]
        }
    ],
)
```

```typescript TypeScript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    {
      content: [
        {
          type: 'document',
          source: {
            media_type: 'application/pdf',
            type: 'base64',
            data: pdfBase64,
          },
          cache_control: { type: 'ephemeral' },
        },
        {
          type: 'text',
          text: 'Какая модель имеет самые высокие показатели предпочтений человека в каждом случае использования?',
        },
      ],
      role: 'user',
    },
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Base64PdfSource;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.DocumentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class MessagesDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Прочитать PDF файл как base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .cacheControl(CacheControlEphemeral.builder().build())
 .build()),
                        ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Какая модель имеет самые высокие показатели предпочтений человека в каждом случае использования?")
 .build())
                ))
                .build();


        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

#### Обработка пакетов документов
Используйте Message Batches API для высокообъемных рабочих процессов:
<CodeGroup>
```bash Shell
# Создать файл JSON-запроса, используя содержимое pdf_base64.txt
jq -n --rawfile PDF_BASE64 pdf_base64.txt '
{
  "requests": [
      {
          "custom_id": "my-first-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Какая модель имеет самые высокие показатели предпочтений человека в каждом случае использования?"
                        }
                    ]
                }
              ]
          }
      },
      {
          "custom_id": "my-second-request",
          "params": {
              "model": "claude-sonnet-4-5",
              "max_tokens": 1024,
              "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": $PDF_BASE64
                            }
                        },
                        {
                            "type": "text",
                            "text": "Извлеките 5 ключевых выводов из этого документа."
                        }
                    ]
                }
              ]
          }
      }
  ]
}
' > request.json

# Затем сделать API-вызов, используя JSON файл
curl https://api.anthropic.com/v1/messages/batches \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d @request.json
```
```python Python
message_batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "doc1",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
 "type": "document",
 "source": {
 "type": "base64",
 "media_type": "application/pdf",
 "data": pdf_data
 }
                            },
                            {
 "type": "text",
 "text": "Резюмируйте этот документ."
                            }
                        ]
                    }
                ]
            }
        }
    ]
)
```

```typescript TypeScript
const response = await anthropic.messages.batches.create({
  requests: [
    {
      custom_id: 'my-first-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Какая модель имеет самые высокие показатели предпочтений человека в каждом случае использования?',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    },
    {
      custom_id: 'my-second-request',
      params: {
        max_tokens: 1024,
        messages: [
          {
            content: [
              {
                type: 'document',
                source: {
                  media_type: 'application/pdf',
                  type: 'base64',
                  data: pdfBase64,
                },
              },
              {
                type: 'text',
                text: 'Извлеките 5 ключевых выводов из этого документа.',
              },
            ],
            role: 'user',
          },
        ],
        model: 'claude-sonnet-4-5',
      },
    }
  ],
});
console.log(response);
```

```java Java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;
import com.anthropic.models.messages.batches.*;

public class MessagesBatchDocumentExample {

    public static void main(String[] args) throws IOException {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Прочитать PDF файл как base64
        byte[] pdfBytes = Files.readAllBytes(Paths.get("pdf_base64.txt"));
        String pdfBase64 = new String(pdfBytes);

        BatchCreateParams params = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Какая модель имеет самые высокие показатели предпочтений человека в каждом случае использования?")
 .build()
 )
 ))
 .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
 .model(Model.CLAUDE_OPUS_4_20250514)
 .maxTokens(1024)
 .addUserMessageOfBlockParams(List.of(
 ContentBlockParam.ofDocument(
 DocumentBlockParam.builder()
 .source(Base64PdfSource.builder()
 .data(pdfBase64)
 .build())
 .build()
 ),
 ContentBlockParam.ofText(
 TextBlockParam.builder()
 .text("Извлеките 5 ключевых выводов из этого документа.")
 .build()
 )
 ))
 .build())
                        .build())
                .build();

        MessageBatch batch = client.messages().batches().create(params);
        System.out.println(batch);
    }
}
```
</CodeGroup>

## Следующие шаги

<CardGroup cols={2}>
  <Card
    title="Попробуйте примеры PDF"
    icon="file"
    href="https://github.com/anthropics/anthropic-cookbook/tree/main/multimodal"
  >
    Изучите практические примеры обработки PDF в нашем рецепте поваренной книги.
  </Card>

  <Card
    title="Посмотрите справочник API"
    icon="code"
    href="/docs/ru/api/messages"
  >
    Посмотрите полную документацию API для поддержки PDF.
  </Card>
</CardGroup>