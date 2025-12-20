# Пакетная обработка

Пакетная обработка — это мощный подход для эффективной обработки больших объемов запросов

---

Пакетная обработка — это мощный подход для эффективной обработки больших объемов запросов. Вместо обработки запросов один за другим с немедленными ответами, пакетная обработка позволяет вам отправлять несколько запросов вместе для асинхронной обработки. Этот паттерн особенно полезен, когда:

- Вам нужно обработать большие объемы данных
- Немедленные ответы не требуются
- Вы хотите оптимизировать экономическую эффективность
- Вы выполняете крупномасштабные оценки или анализы

API Message Batches — это наша первая реализация этого паттерна.

---

# API Message Batches

API Message Batches — это мощный и экономичный способ асинхронной обработки больших объемов запросов [Messages](/docs/ru/api/messages). Этот подход хорошо подходит для задач, которые не требуют немедленных ответов, при этом большинство пакетов завершаются менее чем за 1 час, снижая затраты на 50% и увеличивая пропускную способность.

Вы можете [изучить справочник API напрямую](/docs/ru/api/creating-message-batches), а также прочитать это руководство.

## Как работает API Message Batches

Когда вы отправляете запрос в API Message Batches:

1. Система создает новый Message Batch с предоставленными запросами Messages.
2. Пакет затем обрабатывается асинхронно, каждый запрос обрабатывается независимо.
3. Вы можете опросить статус пакета и получить результаты после завершения обработки всех запросов.

Это особенно полезно для массовых операций, которые не требуют немедленных результатов, таких как:
- Крупномасштабные оценки: эффективно обрабатывайте тысячи тестовых случаев.
- Модерация контента: асинхронно анализируйте большие объемы пользовательского контента.
- Анализ данных: генерируйте аналитику или резюме для больших наборов данных.
- Массовое создание контента: создавайте большие объемы текста для различных целей (например, описания продуктов, резюме статей).

### Ограничения пакета
- Message Batch ограничен либо 100 000 запросами Messages, либо размером 256 МБ, в зависимости от того, что будет достигнуто первым.
- Мы обрабатываем каждый пакет как можно быстрее, при этом большинство пакетов завершаются в течение 1 часа. Вы сможете получить доступ к результатам пакета, когда все сообщения завершены или через 24 часа, в зависимости от того, что наступит раньше. Пакеты истекают, если обработка не завершится в течение 24 часов.
- Результаты пакета доступны в течение 29 дней после создания. После этого вы все еще можете просмотреть пакет, но его результаты больше не будут доступны для загрузки.
- Пакеты ограничены [Workspace](/settings/workspaces). Вы можете просмотреть все пакеты и их результаты, которые были созданы в Workspace, к которому принадлежит ваш ключ API.
- Ограничения скорости применяются как к HTTP-запросам API Batches, так и к количеству запросов в пакете, ожидающих обработки. См. [Ограничения скорости API Message Batches](/docs/ru/api/rate-limits#message-batches-api). Кроме того, мы можем замедлить обработку в зависимости от текущего спроса и объема ваших запросов. В этом случае вы можете увидеть больше запросов, истекающих через 24 часа.
- Из-за высокой пропускной способности и параллельной обработки пакеты могут немного превышать установленный [лимит расходов](/settings/limits) вашего Workspace.

### Поддерживаемые модели

Все [активные модели](/docs/ru/about-claude/models/overview) поддерживают API Message Batches.

### Что можно пакетировать
Любой запрос, который вы можете сделать к API Messages, может быть включен в пакет. Это включает:

- Vision
- Tool use
- System messages
- Многооборотные диалоги
- Любые бета-функции

Поскольку каждый запрос в пакете обрабатывается независимо, вы можете смешивать различные типы запросов в одном пакете.

<Tip>
Поскольку пакеты могут обрабатываться дольше 5 минут, рассмотрите возможность использования [кэширования на 1 час](/docs/ru/build-with-claude/prompt-caching#1-hour-cache-duration) с кэшированием подсказок для лучшей частоты попаданий в кэш при обработке пакетов с общим контекстом.
</Tip>

---
## Цены

API Batches предлагает значительную экономию затрат. Все использование взимается по 50% от стандартных цен API.

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

---
## Как использовать API Message Batches

### Подготовка и создание вашего пакета

Message Batch состоит из списка запросов на создание Message. Форма отдельного запроса состоит из:
- Уникального `custom_id` для идентификации запроса Messages
- Объекта `params` со стандартными параметрами [API Messages](/docs/ru/api/messages)

Вы можете [создать пакет](/docs/ru/api/creating-message-batches), передав этот список в параметр `requests`:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages/batches \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hello, world"}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": "Hi again, friend"}
                ]
            }
        }
    ]
}'
```

```python Python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="my-first-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": "Hello, world",
                }]
            )
        ),
        Request(
            custom_id="my-second-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                messages=[{
                    "role": "user",
                    "content": "Hi again, friend",
                }]
            )
        )
    ]
)

print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.create({
  requests: [{
    custom_id: "my-first-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {"role": "user", "content": "Hello, world"}
      ]
    }
  }, {
    custom_id: "my-second-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {"role": "user", "content": "Hi again, friend"}
      ]
    }
  }]
});

console.log(messageBatch)
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.batches.*;

public class BatchExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BatchCreateParams params = BatchCreateParams.builder()
            .addRequest(BatchCreateParams.Request.builder()
                .customId("my-first-request")
                .params(BatchCreateParams.Request.Params.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addUserMessage("Hello, world")
                    .build())
                .build())
            .addRequest(BatchCreateParams.Request.builder()
                .customId("my-second-request")
                .params(BatchCreateParams.Request.Params.builder()
                    .model(Model.CLAUDE_OPUS_4_0)
                    .maxTokens(1024)
                    .addUserMessage("Hi again, friend")
                    .build())
                .build())
            .build();

        MessageBatch messageBatch = client.messages().batches().create(params);

        System.out.println(messageBatch);
    }
}
```

</CodeGroup>

В этом примере два отдельных запроса объединены в пакет для асинхронной обработки. Каждый запрос имеет уникальный `custom_id` и содержит стандартные параметры, которые вы использовали бы для вызова API Messages.

<Tip>
  **Протестируйте ваши запросы пакета с помощью API Messages**

Валидация объекта `params` для каждого запроса сообщения выполняется асинхронно, и ошибки валидации возвращаются после завершения обработки всего пакета. Вы можете убедиться, что вы правильно строите свой ввод, предварительно проверив форму вашего запроса с помощью [API Messages](/docs/ru/api/messages).
</Tip>

Когда пакет впервые создается, ответ будет иметь статус обработки `in_progress`.

```json JSON
{
  "id": "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
  "type": "message_batch",
  "processing_status": "in_progress",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": null,
  "results_url": null
}
```

### Отслеживание вашего пакета

Поле `processing_status` Message Batch указывает на этап обработки пакета. Он начинается как `in_progress`, затем обновляется на `ended` после завершения обработки всех запросов в пакете и готовности результатов. Вы можете отслеживать состояние вашего пакета, посетив [Console](/settings/workspaces/default/batches) или используя [конечную точку получения](/docs/ru/api/retrieving-message-batches).

#### Опрос завершения Message Batch

Для опроса Message Batch вам понадобится его `id`, который предоставляется в ответе при создании пакета или при перечислении пакетов. Вы можете реализовать цикл опроса, который периодически проверяет статус пакета до завершения обработки:

<CodeGroup>
```python Python
import anthropic
import time

client = anthropic.Anthropic()

message_batch = None
while True:
    message_batch = client.messages.batches.retrieve(
        MESSAGE_BATCH_ID
    )
    if message_batch.processing_status == "ended":
        break

    print(f"Batch {MESSAGE_BATCH_ID} is still processing...")
    time.sleep(60)
print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

let messageBatch;
while (true) {
  messageBatch = await anthropic.messages.batches.retrieve(
    MESSAGE_BATCH_ID
  );
  if (messageBatch.processing_status === 'ended') {
    break;
  }

  console.log(`Batch ${messageBatch} is still processing... waiting`);
  await new Promise(resolve => setTimeout(resolve, 60_000));
}
console.log(messageBatch);
```

```bash Shell
#!/bin/sh

until [[ $(curl -s "https://api.anthropic.com/v1/messages/batches/$MESSAGE_BATCH_ID" \
          --header "x-api-key: $ANTHROPIC_API_KEY" \
          --header "anthropic-version: 2023-06-01" \
          | grep -o '"processing_status":[[:space:]]*"[^"]*"' \
          | cut -d'"' -f4) == "ended" ]]; do
    echo "Batch $MESSAGE_BATCH_ID is still processing..."
    sleep 60
done

echo "Batch $MESSAGE_BATCH_ID has finished processing"
```
</CodeGroup>

### Перечисление всех Message Batches

Вы можете перечислить все Message Batches в вашем Workspace, используя [конечную точку списка](/docs/ru/api/listing-message-batches). API поддерживает пагинацию, автоматически получая дополнительные страницы по мере необходимости:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

# Automatically fetches more pages as needed.
for message_batch in client.messages.batches.list(
    limit=20
):
    print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Automatically fetches more pages as needed.
for await (const messageBatch of anthropic.messages.batches.list({
  limit: 20
})) {
  console.log(messageBatch);
}
```

```bash Shell
#!/bin/sh

if ! command -v jq &> /dev/null; then
    echo "Error: This script requires jq. Please install it first."
    exit 1
fi

BASE_URL="https://api.anthropic.com/v1/messages/batches"

has_more=true
after_id=""

while [ "$has_more" = true ]; do
    # Construct URL with after_id if it exists
    if [ -n "$after_id" ]; then
        url="${BASE_URL}?limit=20&after_id=${after_id}"
    else
        url="$BASE_URL?limit=20"
    fi

    response=$(curl -s "$url" \
              --header "x-api-key: $ANTHROPIC_API_KEY" \
              --header "anthropic-version: 2023-06-01")

    # Extract values using jq
    has_more=$(echo "$response" | jq -r '.has_more')
    after_id=$(echo "$response" | jq -r '.last_id')

    # Process and print each entry in the data array
    echo "$response" | jq -c '.data[]' | while read -r entry; do
        echo "$entry" | jq '.'
    done
done
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.batches.*;

public class BatchListExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Automatically fetches more pages as needed
        for (MessageBatch messageBatch : client.messages().batches().list(
                BatchListParams.builder()
                        .limit(20)
                        .build()
        )) {
            System.out.println(messageBatch);
        }
    }
}
```
</CodeGroup>

### Получение результатов пакета

После завершения обработки пакета каждый запрос Messages в пакете будет иметь результат. Существует 4 типа результатов:

| Тип результата | Описание |
|-------------|-------------|
| `succeeded` | Запрос был успешным. Включает результат сообщения. |
| `errored`   | Запрос столкнулся с ошибкой и сообщение не было создано. Возможные ошибки включают недействительные запросы и внутренние ошибки сервера. Вам не будет выставлен счет за эти запросы. |
| `canceled`  | Пользователь отменил пакет до того, как этот запрос мог быть отправлен модели. Вам не будет выставлен счет за эти запросы. |
| `expired`   | Пакет достиг своего 24-часового истечения до того, как этот запрос мог быть отправлен модели. Вам не будет выставлен счет за эти запросы. |

Вы увидите обзор ваших результатов с помощью `request_counts` пакета, который показывает, сколько запросов достигло каждого из этих четырех состояний.

Результаты пакета доступны для загрузки в свойстве `results_url` на Message Batch и, если разрешение организации позволяет, в Console. Из-за потенциально большого размера результатов рекомендуется [потоковая передача результатов](/docs/ru/api/retrieving-message-batch-results) вместо загрузки их всех сразу.

<CodeGroup>

```bash Shell
#!/bin/sh
curl "https://api.anthropic.com/v1/messages/batches/msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  | grep -o '"results_url":[[:space:]]*"[^"]*"' \
  | cut -d'"' -f4 \
  | while read -r url; do
    curl -s "$url" \
      --header "anthropic-version: 2023-06-01" \
      --header "x-api-key: $ANTHROPIC_API_KEY" \
      | sed 's/}{/}\n{/g' \
      | while IFS= read -r line
    do
      result_type=$(echo "$line" | sed -n 's/.*"result":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')
      custom_id=$(echo "$line" | sed -n 's/.*"custom_id":[[:space:]]*"\([^"]*\)".*/\1/p')
      error_type=$(echo "$line" | sed -n 's/.*"error":[[:space:]]*{[[:space:]]*"type":[[:space:]]*"\([^"]*\)".*/\1/p')

      case "$result_type" in
        "succeeded")
          echo "Success! $custom_id"
          ;;
        "errored")
          if [ "$error_type" = "invalid_request" ]; then
            # Request body must be fixed before re-sending request
            echo "Validation error: $custom_id"
          else
            # Request can be retried directly
            echo "Server error: $custom_id"
          fi
          ;;
        "expired")
          echo "Expired: $line"
          ;;
      esac
    done
  done

```
```python Python
import anthropic

client = anthropic.Anthropic()

# Stream results file in memory-efficient chunks, processing one at a time
for result in client.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
):
    match result.result.type:
        case "succeeded":
            print(f"Success! {result.custom_id}")
        case "errored":
            if result.result.error.type == "invalid_request":
                # Request body must be fixed before re-sending request
                print(f"Validation error {result.custom_id}")
            else:
                # Request can be retried directly
                print(f"Server error {result.custom_id}")
        case "expired":
            print(f"Request expired {result.custom_id}")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Stream results file in memory-efficient chunks, processing one at a time
for await (const result of await anthropic.messages.batches.results(
    "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d"
)) {
  switch (result.result.type) {
    case 'succeeded':
      console.log(`Success! ${result.custom_id}`);
      break;
    case 'errored':
      if (result.result.error.type == "invalid_request") {
        // Request body must be fixed before re-sending request
        console.log(`Validation error: ${result.custom_id}`);
      } else {
        // Request can be retried directly
        console.log(`Server error: ${result.custom_id}`);
      }
      break;
    case 'expired':
      console.log(`Request expired: ${result.custom_id}`);
      break;
  }
}
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.http.StreamResponse;
import com.anthropic.models.messages.batches.MessageBatchIndividualResponse;
import com.anthropic.models.messages.batches.BatchResultsParams;

public class BatchResultsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Stream results file in memory-efficient chunks, processing one at a time
        try (StreamResponse<MessageBatchIndividualResponse> streamResponse = client.messages()
                .batches()
                .resultsStreaming(
                        BatchResultsParams.builder()
                                .messageBatchId("msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d")
                                .build())) {

            streamResponse.stream().forEach(result -> {
                if (result.result().isSucceeded()) {
                    System.out.println("Success! " + result.customId());
                } else if (result.result().isErrored()) {
                    if (result.result().asErrored().error().error().isInvalidRequestError()) {
                        // Request body must be fixed before re-sending request
                        System.out.println("Validation error: " + result.customId());
                    } else {
                        // Request can be retried directly
                        System.out.println("Server error: " + result.customId());
                    }
                } else if (result.result().isExpired()) {
                    System.out.println("Request expired: " + result.customId());
                }
            });
        }
    }
}
```

</CodeGroup>

Результаты будут в формате `.jsonl`, где каждая строка — это действительный объект JSON, представляющий результат одного запроса в Message Batch. Для каждого потокового результата вы можете сделать что-то другое в зависимости от его `custom_id` и типа результата. Вот пример набора результатов:

```json .jsonl file
{"custom_id":"my-second-request","result":{"type":"succeeded","message":{"id":"msg_014VwiXbi91y3JMjcpyGBHX5","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello again! It's nice to see you. How can I assist you today? Is there anything specific you'd like to chat about or any questions you have?"}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":11,"output_tokens":36}}}}
{"custom_id":"my-first-request","result":{"type":"succeeded","message":{"id":"msg_01FqfsLoHwgeFbguDgpz48m7","type":"message","role":"assistant","model":"claude-sonnet-4-5-20250929","content":[{"type":"text","text":"Hello! How can I assist you today? Feel free to ask me any questions or let me know if there's anything you'd like to chat about."}],"stop_reason":"end_turn","stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":34}}}}
```

Если ваш результат содержит ошибку, его `result.error` будет установлен на нашу стандартную [форму ошибки](/docs/ru/api/errors#error-shapes).

<Tip>
  **Результаты пакета могут не совпадать с порядком ввода**

Результаты пакета могут быть возвращены в любом порядке и могут не совпадать с порядком запросов при создании пакета. В приведенном выше примере результат для второго запроса пакета возвращается перед первым. Чтобы правильно сопоставить результаты с соответствующими запросами, всегда используйте поле `custom_id`.
</Tip>

### Отмена Message Batch

Вы можете отменить Message Batch, который в настоящее время обрабатывается, используя [конечную точку отмены](/docs/ru/api/canceling-message-batches). Сразу после отмены `processing_status` пакета будет `canceling`. Вы можете использовать ту же технику опроса, описанную выше, чтобы дождаться завершения отмены. Отмененные пакеты заканчиваются со статусом `ended` и могут содержать частичные результаты для запросов, которые были обработаны до отмены.

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

message_batch = client.messages.batches.cancel(
    MESSAGE_BATCH_ID,
)
print(message_batch)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.cancel(
    MESSAGE_BATCH_ID
);
console.log(messageBatch);
```

```bash Shell
#!/bin/sh
curl --request POST https://api.anthropic.com/v1/messages/batches/$MESSAGE_BATCH_ID/cancel \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01"
```

```java Java
import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.batches.*;

public class BatchCancelExample {
    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageBatch messageBatch = client.messages().batches().cancel(
                BatchCancelParams.builder()
                        .messageBatchId(MESSAGE_BATCH_ID)
                        .build()
        );
        System.out.println(messageBatch);
    }
}
```
</CodeGroup>

Ответ покажет пакет в состоянии `canceling`:

```json JSON
{
  "id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
  "type": "message_batch",
  "processing_status": "canceling",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "ended_at": null,
  "created_at": "2024-09-24T18:37:24.100435Z",
  "expires_at": "2024-09-25T18:37:24.100435Z",
  "cancel_initiated_at": "2024-09-24T18:39:03.114875Z",
  "results_url": null
}
```

### Использование кэширования подсказок с Message Batches

API Message Batches поддерживает кэширование подсказок, что позволяет потенциально снизить затраты и время обработки для пакетных запросов. Скидки на цены от кэширования подсказок и Message Batches могут складываться, обеспечивая еще большую экономию затрат при использовании обеих функций вместе. Однако, поскольку пакетные запросы обрабатываются асинхронно и параллельно, попадания в кэш предоставляются на основе наилучших усилий. Пользователи обычно испытывают коэффициент попадания в кэш в диапазоне от 30% до 98%, в зависимости от их моделей трафика.

Чтобы максимизировать вероятность попадания в кэш в ваших пакетных запросах:

1. Включайте идентичные блоки `cache_control` в каждый запрос Message в вашем пакете
2. Поддерживайте постоянный поток запросов, чтобы предотвратить истечение записей кэша после их 5-минутного времени жизни
3. Структурируйте ваши запросы так, чтобы они делили как можно больше кэшированного контента

Пример реализации кэширования подсказок в пакете:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages/batches \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "requests": [
        {
            "custom_id": "my-first-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "system": [
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                "messages": [
                    {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
                ]
            }
        },
        {
            "custom_id": "my-second-request",
            "params": {
                "model": "claude-sonnet-4-5",
                "max_tokens": 1024,
                "system": [
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                "messages": [
                    {"role": "user", "content": "Write a summary of Pride and Prejudice."}
                ]
            }
        }
    ]
}'
```

```python Python
import anthropic
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id="my-first-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=[
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                messages=[{
                    "role": "user",
                    "content": "Analyze the major themes in Pride and Prejudice."
                }]
            )
        ),
        Request(
            custom_id="my-second-request",
            params=MessageCreateParamsNonStreaming(
                model="claude-sonnet-4-5",
                max_tokens=1024,
                system=[
                    {
                        "type": "text",
                        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
                    },
                    {
                        "type": "text",
                        "text": "<the entire contents of Pride and Prejudice>",
                        "cache_control": {"type": "ephemeral"}
                    }
                ],
                messages=[{
                    "role": "user",
                    "content": "Write a summary of Pride and Prejudice."
                }]
            )
        )
    ]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const messageBatch = await anthropic.messages.batches.create({
  requests: [{
    custom_id: "my-first-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          type: "text",
          text: "<the entire contents of Pride and Prejudice>",
          cache_control: {type: "ephemeral"}
        }
      ],
      messages: [
        {"role": "user", "content": "Analyze the major themes in Pride and Prejudice."}
      ]
    }
  }, {
    custom_id: "my-second-request",
    params: {
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
        },
        {
          type: "text",
          text: "<the entire contents of Pride and Prejudice>",
          cache_control: {type: "ephemeral"}
        }
      ],
      messages: [
        {"role": "user", "content": "Write a summary of Pride and Prejudice."}
      ]
    }
  }]
});
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.batches.*;

public class BatchExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        BatchCreateParams createParams = BatchCreateParams.builder()
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-first-request")
                        .params(BatchCreateParams.Request.Params.builder()
                                .model(Model.CLAUDE_OPUS_4_0)
                                .maxTokens(1024)
                                .systemOfTextBlockParams(List.of(
                                        TextBlockParam.builder()
                                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                .build(),
                                        TextBlockParam.builder()
                                                .text("<the entire contents of Pride and Prejudice>")
                                                .cacheControl(CacheControlEphemeral.builder().build())
                                                .build()
                                ))
                                .addUserMessage("Analyze the major themes in Pride and Prejudice.")
                                .build())
                        .build())
                .addRequest(BatchCreateParams.Request.builder()
                        .customId("my-second-request")
                        .params(BatchCreateParams.Request.Params.builder()
                                .model(Model.CLAUDE_OPUS_4_0)
                                .maxTokens(1024)
                                .systemOfTextBlockParams(List.of(
                                        TextBlockParam.builder()
                                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                                .build(),
                                        TextBlockParam.builder()
                                                .text("<the entire contents of Pride and Prejudice>")
                                                .cacheControl(CacheControlEphemeral.builder().build())
                                                .build()
                                ))
                                .addUserMessage("Write a summary of Pride and Prejudice.")
                                .build())
                        .build())
                .build();

        MessageBatch messageBatch = client.messages().batches().create(createParams);
    }
}
```

</CodeGroup>

В этом примере оба запроса в пакете включают идентичные системные сообщения и полный текст Pride and Prejudice, отмеченный с помощью `cache_control` для увеличения вероятности попадания в кэш.

### Лучшие практики для эффективной пакетной обработки

Чтобы максимально использовать API Batches:

- Регулярно отслеживайте статус обработки пакета и реализуйте соответствующую логику повторных попыток для неудачных запросов.
- Используйте значимые значения `custom_id` для легкого сопоставления результатов с запросами, поскольку порядок не гарантирован.
- Рассмотрите возможность разделения очень больших наборов данных на несколько пакетов для лучшей управляемости.
- Выполните пробный запуск одной формы запроса с помощью API Messages, чтобы избежать ошибок валидации.

### Устранение неполадок при распространенных проблемах

Если вы испытываете неожиданное поведение:

- Убедитесь, что общий размер пакетного запроса не превышает 256 МБ. Если размер запроса слишком большой, вы можете получить ошибку 413 `request_too_large`.
- Проверьте, что вы используете [поддерживаемые модели](#supported-models) для всех запросов в пакете.
- Убедитесь, что каждый запрос в пакете имеет уникальный `custom_id`.
- Убедитесь, что прошло менее 29 дней с момента времени `created_at` пакета (не времени обработки `ended_at`). Если прошло более 29 дней, результаты больше не будут доступны для просмотра.
- Подтвердите, что пакет не был отменен.

Обратите внимание, что отказ одного запроса в пакете не влияет на обработку других запросов.

---
## Хранение пакетов и конфиденциальность

- **Изоляция рабочей области**: Пакеты изолированы в рабочей области, в которой они были созданы. Доступ к ним могут получить только ключи API, связанные с этой рабочей областью, или пользователи с разрешением на просмотр пакетов рабочей области в консоли.

- **Доступность результатов**: Результаты пакета доступны в течение 29 дней после создания пакета, что позволяет достаточно времени для получения и обработки.

---
## Часто задаваемые вопросы

  <section title="Сколько времени требуется для обработки пакета?">

    Пакеты могут обрабатываться до 24 часов, но многие завершатся раньше. Фактическое время обработки зависит от размера пакета, текущего спроса и объема ваших запросов. Возможно, что пакет истечет и не завершится в течение 24 часов.
  
</section>

  <section title="Доступен ли API Batches для всех моделей?">

    Смотрите [выше](#supported-models) список поддерживаемых моделей.
  
</section>

  <section title="Могу ли я использовать API Message Batches с другими функциями API?">

    Да, API Message Batches поддерживает все функции, доступные в API Messages, включая бета-функции. Однако потоковая передача не поддерживается для пакетных запросов.
  
</section>

  <section title="Как API Message Batches влияет на цены?">

    API Message Batches предлагает 50% скидку на все использование по сравнению со стандартными ценами API. Это применяется к входным токенам, выходным токенам и любым специальным токенам. Для получения дополнительной информации о ценах посетите нашу [страницу цен](https://claude.com/pricing#anthropic-api).
  
</section>

  <section title="Могу ли я обновить пакет после его отправки?">

    Нет, после отправки пакета его нельзя изменить. Если вам нужно внести изменения, вы должны отменить текущий пакет и отправить новый. Обратите внимание, что отмена может не вступить в силу немедленно.
  
</section>

  <section title="Существуют ли ограничения скорости API Message Batches и взаимодействуют ли они с ограничениями скорости API Messages?">

    API Message Batches имеет ограничения скорости на основе HTTP-запросов в дополнение к ограничениям на количество запросов, требующих обработки. Смотрите [ограничения скорости API Message Batches](/docs/ru/api/rate-limits#message-batches-api). Использование API Batches не влияет на ограничения скорости в API Messages.
  
</section>

  <section title="Как я обрабатываю ошибки в своих пакетных запросах?">

    Когда вы получаете результаты, каждый запрос будет иметь поле `result`, указывающее, был ли он `succeeded`, `errored`, был `canceled` или `expired`. Для результатов `errored` будет предоставлена дополнительная информация об ошибке. Просмотрите объект ответа об ошибке в [справочнике API](/docs/ru/api/creating-message-batches).
  
</section>

  <section title="Как API Message Batches обрабатывает конфиденциальность и разделение данных?">

    API Message Batches разработан с сильными мерами конфиденциальности и разделения данных:

    1. Пакеты и их результаты изолированы в рабочей области, в которой они были созданы. Это означает, что доступ к ним могут получить только ключи API из той же рабочей области.
    2. Каждый запрос в пакете обрабатывается независимо, без утечки данных между запросами.
    3. Результаты доступны только в течение ограниченного времени (29 дней) и соответствуют нашей [политике хранения данных](https://support.claude.com/en/articles/7996866-how-long-do-you-store-personal-data).
    4. Загрузка результатов пакета в консоли может быть отключена на уровне организации или на основе отдельной рабочей области.
  
</section>

  <section title="Могу ли я использовать кэширование подсказок в API Message Batches?">

    Да, можно использовать кэширование подсказок с API Message Batches. Однако, поскольку асинхронные пакетные запросы могут обрабатываться параллельно и в любом порядке, попадания в кэш предоставляются на основе наилучших усилий.
  
</section>