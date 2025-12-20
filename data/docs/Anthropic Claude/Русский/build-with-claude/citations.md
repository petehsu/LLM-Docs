# Цитирование

Claude способен предоставлять подробные цитаты при ответах на вопросы о документах, помогая отслеживать и проверять источники информации в ответах.

---

Claude способен предоставлять подробные цитаты при ответах на вопросы о документах, помогая отслеживать и проверять источники информации в ответах.

Все [активные модели](/docs/ru/about-claude/models/overview) поддерживают цитирование, за исключением Haiku 3.

<Warning>
*Цитирование с Claude Sonnet 3.7*

Claude Sonnet 3.7 может быть менее склонен к созданию цитат по сравнению с другими моделями Claude без более явных инструкций от пользователя. При использовании цитирования с Claude Sonnet 3.7 мы рекомендуем включать дополнительные инструкции в ход `user`, например `"Используйте цитаты для подтверждения вашего ответа."`.

Мы также заметили, что когда модель просят структурировать свой ответ, она вряд ли будет использовать цитаты, если явно не сказать использовать цитаты в этом формате. Например, если модель просят использовать теги `<result>` в своем ответе, вы должны добавить что-то вроде `"Всегда используйте цитаты в своем ответе, даже внутри тегов <result>."`
</Warning>
<Tip>
  Пожалуйста, поделитесь своими отзывами и предложениями о функции цитирования, используя эту [форму](https://forms.gle/9n9hSrKnKe3rpowH9).
</Tip>

Вот пример того, как использовать цитирование с Messages API:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "text",
              "media_type": "text/plain",
              "data": "The grass is green. The sky is blue."
            },
            "title": "My Document",
            "context": "This is a trustworthy document.",
            "citations": {"enabled": true}
          },
          {
            "type": "text",
            "text": "What color is the grass and sky?"
          }
        ]
      }
    ]
  }'
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "The grass is green. The sky is blue."
                    },
                    "title": "My Document",
                    "context": "This is a trustworthy document.",
                    "citations": {"enabled": True}
                },
                {
                    "type": "text",
                    "text": "What color is the grass and sky?"
                }
            ]
        }
    ]
)
print(response)
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.*;

public class DocumentExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        PlainTextSource source = PlainTextSource.builder()
                .data("The grass is green. The sky is blue.")
                .build();

        DocumentBlockParam documentParam = DocumentBlockParam.builder()
                .source(source)
                .title("My Document")
                .context("This is a trustworthy document.")
                .citations(CitationsConfigParam.builder().enabled(true).build())
                .build();
        
        TextBlockParam textBlockParam = TextBlockParam.builder()
                .text("What color is the grass and sky?")
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_SONNET_4_20250514)
                .maxTokens(1024)
                .addUserMessageOfBlockParams(List.of(ContentBlockParam.ofDocument(documentParam), ContentBlockParam.ofText(textBlockParam)))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```

</CodeGroup>

<Tip>
**Сравнение с подходами на основе промптов**

По сравнению с решениями цитирования на основе промптов, функция цитирования имеет следующие преимущества:
- **Экономия затрат:** Если ваш подход на основе промптов просит Claude выводить прямые цитаты, вы можете увидеть экономию затрат из-за того, что `cited_text` не засчитывается в ваши выходные токены.
- **Лучшая надежность цитирования:** Поскольку мы разбираем цитаты в соответствующие форматы ответов, упомянутые выше, и извлекаем `cited_text`, цитаты гарантированно содержат действительные указатели на предоставленные документы.
- **Улучшенное качество цитирования:** В наших оценках мы обнаружили, что функция цитирования значительно чаще цитирует наиболее релевантные цитаты из документов по сравнению с чисто промптовыми подходами.
</Tip>

---

## Как работает цитирование

Интегрируйте цитирование с Claude в следующих шагах:

<Steps>
  <Step title="Предоставьте документ(ы) и включите цитирование">
    - Включите документы в любом из поддерживаемых форматов: [PDF](#pdf-documents), [обычный текст](#plain-text-documents) или документы [пользовательского содержимого](#custom-content-documents)
    - Установите `citations.enabled=true` для каждого из ваших документов. В настоящее время цитирование должно быть включено для всех или ни одного из документов в запросе.
    - Обратите внимание, что в настоящее время поддерживаются только текстовые цитаты, и цитирование изображений пока невозможно.
  </Step>
  <Step title="Документы обрабатываются">
    - Содержимое документов "разбивается на части" для определения минимальной детализации возможных цитат. Например, разбивка по предложениям позволит Claude цитировать одно предложение или объединить несколько последовательных предложений для цитирования абзаца (или длиннее)!
      - **Для PDF:** Текст извлекается, как описано в [Поддержке PDF](/docs/ru/build-with-claude/pdf-support), и содержимое разбивается на предложения. Цитирование изображений из PDF в настоящее время не поддерживается.
      - **Для документов с обычным текстом:** Содержимое разбивается на предложения, которые можно цитировать.
      - **Для документов с пользовательским содержимым:** Ваши предоставленные блоки содержимого используются как есть, и дальнейшее разбиение не производится.
  </Step>
  <Step title="Claude предоставляет ответ с цитатами">
    - Ответы теперь могут включать несколько текстовых блоков, где каждый текстовый блок может содержать утверждение, которое делает Claude, и список цитат, поддерживающих это утверждение.
    - Цитаты ссылаются на конкретные места в исходных документах. Формат этих цитат зависит от типа документа, из которого цитируется.
      - **Для PDF:** цитаты будут включать диапазон номеров страниц (с индексацией от 1).
      - **Для документов с обычным текстом:** Цитаты будут включать диапазон индексов символов (с индексацией от 0).
      - **Для документов с пользовательским содержимым:** Цитаты будут включать диапазон индексов блоков содержимого (с индексацией от 0), соответствующий исходному списку содержимого.
    - Индексы документов предоставляются для указания исходного источника и имеют индексацию от 0 согласно списку всех документов в вашем исходном запросе.
  </Step>
</Steps>

<Tip>
  **Автоматическое разбиение против пользовательского содержимого**

  По умолчанию документы с обычным текстом и PDF автоматически разбиваются на предложения. Если вам нужен больший контроль над детализацией цитирования (например, для маркированных списков или транскриптов), используйте вместо этого документы с пользовательским содержимым. См. [Типы документов](#document-types) для получения дополнительной информации.

  Например, если вы хотите, чтобы Claude мог цитировать конкретные предложения из ваших RAG-фрагментов, вы должны поместить каждый RAG-фрагмент в документ с обычным текстом. В противном случае, если вы не хотите, чтобы производилось дальнейшее разбиение, или если вы хотите настроить любое дополнительное разбиение, вы можете поместить RAG-фрагменты в документ(ы) с пользовательским содержимым.
</Tip>

### Цитируемое против нецитируемого содержимого

- Текст, найденный в содержимом `source` документа, может быть процитирован.
- `title` и `context` - это необязательные поля, которые будут переданы модели, но не будут использоваться для цитируемого содержимого.
- `title` ограничен по длине, поэтому вы можете найти поле `context` полезным для хранения любых метаданных документа в виде текста или строкового json.

### Индексы цитирования
- Индексы документов имеют индексацию от 0 из списка всех блоков содержимого документов в запросе (охватывающих все сообщения).
- Индексы символов имеют индексацию от 0 с исключающими конечными индексами.
- Номера страниц имеют индексацию от 1 с исключающими конечными номерами страниц.
- Индексы блоков содержимого имеют индексацию от 0 с исключающими конечными индексами из списка `content`, предоставленного в документе с пользовательским содержимым.

### Стоимость токенов
- Включение цитирования приводит к небольшому увеличению входных токенов из-за добавлений системного промпта и разбиения документов.
- Однако функция цитирования очень эффективна с выходными токенами. Под капотом модель выводит цитаты в стандартизированном формате, которые затем разбираются в цитируемый текст и индексы местоположения документа. Поле `cited_text` предоставляется для удобства и не засчитывается в выходные токены.
- При передаче обратно в последующих ходах разговора `cited_text` также не засчитывается во входные токены.

### Совместимость функций
Цитирование работает в сочетании с другими функциями API, включая [кэширование промптов](/docs/ru/build-with-claude/prompt-caching), [подсчет токенов](/docs/ru/build-with-claude/token-counting) и [пакетную обработку](/docs/ru/build-with-claude/batch-processing).

#### Использование кэширования промптов с цитированием

Цитирование и кэширование промптов могут эффективно использоваться вместе.

Блоки цитирования, генерируемые в ответах, не могут быть кэшированы напрямую, но исходные документы, на которые они ссылаются, могут быть кэшированы. Для оптимизации производительности примените `cache_control` к вашим блокам содержимого документов верхнего уровня.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Содержимое длинного документа (например, техническая документация)
long_document = "Это очень длинный документ с тысячами слов..." + " ... " * 1000  # Минимальная кэшируемая длина

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": long_document
                    },
                    "citations": {"enabled": True},
                    "cache_control": {"type": "ephemeral"}  # Кэшировать содержимое документа
                },
                {
                    "type": "text",
                    "text": "Что говорит этот документ о функциях API?"
                }
            ]
        }
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Содержимое длинного документа (например, техническая документация)
const longDocument = "Это очень длинный документ с тысячами слов..." + " ... ".repeat(1000);  // Минимальная кэшируемая длина

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [
    {
      role: "user",
      content: [
        {
          type: "document",
          source: {
            type: "text",
            media_type: "text/plain",
            data: longDocument
          },
          citations: { enabled: true },
          cache_control: { type: "ephemeral" }  // Кэшировать содержимое документа
        },
        {
          type: "text",
          text: "Что говорит этот документ о функциях API?"
        }
      ]
    }
  ]
});
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "text",
                        "media_type": "text/plain",
                        "data": "Это очень длинный документ с тысячами слов..."
                    },
                    "citations": {"enabled": true},
                    "cache_control": {"type": "ephemeral"}
                },
                {
                    "type": "text",
                    "text": "Что говорит этот документ о функциях API?"
                }
            ]
        }
    ]
}'
```
</CodeGroup>

В этом примере:
- Содержимое документа кэшируется с использованием `cache_control` в блоке документа
- Цитирование включено для документа
- Claude может генерировать ответы с цитатами, получая преимущества от кэшированного содержимого документа
- Последующие запросы, использующие тот же документ, получат преимущества от кэшированного содержимого

## Типы документов

### Выбор типа документа

Мы поддерживаем три типа документов для цитирования. Документы могут быть предоставлены непосредственно в сообщении (base64, текст или URL) или загружены через [Files API](/docs/ru/build-with-claude/files) и ссылаться по `file_id`:

| Тип | Лучше всего для | Разбиение | Формат цитирования |
| :--- | :--- | :--- | :--- |
| Обычный текст | Простые текстовые документы, проза | Предложение | Индексы символов (с индексацией от 0) |
| PDF | PDF-файлы с текстовым содержимым | Предложение | Номера страниц (с индексацией от 1) |
| Пользовательское содержимое | Списки, транскрипты, специальное форматирование, более детальные цитаты | Без дополнительного разбиения | Индексы блоков (с индексацией от 0) |

<Note>
Файлы .csv, .xlsx, .docx, .md и .txt не поддерживаются как блоки документов. Конвертируйте их в обычный текст и включите непосредственно в содержимое сообщения. См. [Работа с другими форматами файлов](/docs/ru/build-with-claude/files#working-with-other-file-formats).
</Note>

### Документы с обычным текстом

Документы с обычным текстом автоматически разбиваются на предложения. Вы можете предоставить их встроенными или по ссылке с их `file_id`:

<Tabs>
<Tab title="Встроенный текст">
```python
{
    "type": "document",
    "source": {
        "type": "text",
        "media_type": "text/plain",
        "data": "Содержимое обычного текста..."
    },
    "title": "Заголовок документа", # необязательно
    "context": "Контекст о документе, который не будет цитироваться", # необязательно
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="Files API">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Заголовок документа", # необязательно
    "context": "Контекст о документе, который не будет цитироваться", # необязательно
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Пример цитирования обычного текста">

```python
{
    "type": "char_location",
    "cited_text": "Точный текст, который цитируется", # не засчитывается в выходные токены
    "document_index": 0,
    "document_title": "Заголовок документа",
    "start_char_index": 0,    # с индексацией от 0
    "end_char_index": 50      # исключающий
}
```

</section>

### PDF-документы

PDF-документы могут быть предоставлены как данные в кодировке base64 или по `file_id`. Текст PDF извлекается и разбивается на предложения. Поскольку цитирование изображений пока не поддерживается, PDF-файлы, которые являются сканами документов и не содержат извлекаемого текста, не будут цитируемыми.

<Tabs>
<Tab title="Base64">
```python
{
    "type": "document",
    "source": {
        "type": "base64",
        "media_type": "application/pdf",
        "data": base64_encoded_pdf_data
    },
    "title": "Заголовок документа", # необязательно
    "context": "Контекст о документе, который не будет цитироваться", # необязательно
    "citations": {"enabled": True}
}
```
</Tab>
<Tab title="Files API">
```python
{
    "type": "document",
    "source": {
        "type": "file",
        "file_id": "file_011CNvxoj286tYUAZFiZMf1U"
    },
    "title": "Заголовок документа", # необязательно
    "context": "Контекст о документе, который не будет цитироваться", # необязательно
    "citations": {"enabled": True}
}
```
</Tab>
</Tabs>

<section title="Пример цитирования PDF">

```python
{
    "type": "page_location",
    "cited_text": "Точный текст, который цитируется", # не засчитывается в выходные токены
    "document_index": 0,     
    "document_title": "Заголовок документа", 
    "start_page_number": 1,  # с индексацией от 1
    "end_page_number": 2     # исключающий
}
```

</section>

### Документы с пользовательским содержимым

Документы с пользовательским содержимым дают вам контроль над детализацией цитирования. Дополнительное разбиение не производится, и фрагменты предоставляются модели согласно предоставленным блокам содержимого.

```python
{
    "type": "document",
    "source": {
        "type": "content",
        "content": [
            {"type": "text", "text": "Первый фрагмент"},
            {"type": "text", "text": "Второй фрагмент"}
        ]
    },
    "title": "Заголовок документа", # необязательно
    "context": "Контекст о документе, который не будет цитироваться", # необязательно
    "citations": {"enabled": True}
}
```

<section title="Пример цитирования">

```python
{
    "type": "content_block_location",
    "cited_text": "Точный текст, который цитируется", # не засчитывается в выходные токены
    "document_index": 0,
    "document_title": "Заголовок документа",
    "start_block_index": 0,   # с индексацией от 0
    "end_block_index": 1      # исключающий
}
```

</section>

---

## Структура ответа

Когда цитирование включено, ответы включают несколько текстовых блоков с цитатами:

```python
{
    "content": [
        {
            "type": "text",
            "text": "Согласно документу, "
        },
        {
            "type": "text",
            "text": "трава зеленая",
            "citations": [{
                "type": "char_location",
                "cited_text": "Трава зеленая.",
                "document_index": 0,
                "document_title": "Пример документа",
                "start_char_index": 0,
                "end_char_index": 20
            }]
        },
        {
            "type": "text",
            "text": " и "
        },
        {
            "type": "text",
            "text": "небо голубое",
            "citations": [{
                "type": "char_location",
                "cited_text": "Небо голубое.",
                "document_index": 0,
                "document_title": "Пример документа",
                "start_char_index": 20,
                "end_char_index": 36
            }]
        },
        {
            "type": "text",
            "text": ". Информация со страницы 5 утверждает, что ",
        },
        {
            "type": "text",
            "text": "вода необходима",
            "citations": [{
                "type": "page_location",
                "cited_text": "Вода необходима для жизни.",
                "document_index": 1,
                "document_title": "PDF-документ",
                "start_page_number": 5,
                "end_page_number": 6
            }]
        },
        {
            "type": "text",
            "text": ". Пользовательский документ упоминает ",
        },
        {
            "type": "text",
            "text": "важные находки",
            "citations": [{
                "type": "content_block_location",
                "cited_text": "Это важные находки.",
                "document_index": 2,
                "document_title": "Документ с пользовательским содержимым",
                "start_block_index": 0,
                "end_block_index": 1
            }]
        }
    ]
}
```

### Поддержка потоковой передачи

Для потоковых ответов мы добавили тип `citations_delta`, который содержит одну цитату для добавления в список `citations` текущего блока содержимого `text`.

<section title="Пример потоковых событий">

```python
event: message_start
data: {"type": "message_start", ...}

event: content_block_start
data: {"type": "content_block_start", "index": 0, ...}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, 
       "delta": {"type": "text_delta", "text": "Согласно..."}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0,
       "delta": {"type": "citations_delta", 
                 "citation": {
                     "type": "char_location",
                     "cited_text": "...",
                     "document_index": 0,
                     ...
                 }}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_stop
data: {"type": "message_stop"}
```

</section>