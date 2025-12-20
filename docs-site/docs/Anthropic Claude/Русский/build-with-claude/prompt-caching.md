# Кэширование промптов

Кэширование промптов — это мощная функция, которая оптимизирует использование API, позволяя возобновлять работу с определённых префиксов в ваших промптах.

---

Кэширование промптов — это мощная функция, которая оптимизирует использование API, позволяя возобновлять работу с определённых префиксов в ваших промптах. Этот подход значительно сокращает время обработки и затраты на повторяющиеся задачи или промпты с постоянными элементами.

Вот пример того, как реализовать кэширование промптов с помощью Messages API, используя блок `cache_control`:

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
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
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'

# Call the model again with the same inputs up to the cache checkpoint
curl https://api.anthropic.com/v1/messages # rest of input
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        "type": "text",
        "text": "<the entire contents of 'Pride and Prejudice'>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
)
print(response.usage.model_dump_json())

# Call the model again with the same inputs up to the cache checkpoint
response = client.messages.create(.....)
print(response.usage.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
    },
    {
      type: "text",
      text: "<the entire contents of 'Pride and Prejudice'>",
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Analyze the major themes in 'Pride and Prejudice'."
    }
  ]
});
console.log(response.usage);

// Call the model again with the same inputs up to the cache checkpoint
const new_response = await client.messages.create(...)
console.log(new_response.usage);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class PromptCachingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                .build(),
                        TextBlockParam.builder()
                                .text("<the entire contents of 'Pride and Prejudice'>")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.usage());
    }
}
```
</CodeGroup>

```json JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

В этом примере весь текст «Pride and Prejudice» кэшируется с помощью параметра `cache_control`. Это позволяет повторно использовать этот большой текст в нескольких вызовах API без его переобработки каждый раз. Изменение только пользовательского сообщения позволяет вам задавать различные вопросы о книге, используя кэшированное содержимое, что приводит к более быстрым ответам и повышенной эффективности.

---

## Как работает кэширование промптов

Когда вы отправляете запрос с включённым кэшированием промптов:

1. Система проверяет, кэширован ли уже префикс промпта до указанной точки разрыва кэша из недавнего запроса.
2. Если найден, она использует кэшированную версию, сокращая время обработки и затраты.
3. В противном случае она обрабатывает полный промпт и кэширует префикс после начала ответа.

Это особенно полезно для:
- Промптов с множеством примеров
- Больших объёмов контекста или справочной информации
- Повторяющихся задач с постоянными инструкциями
- Длинных многооборотных разговоров

По умолчанию кэш имеет время жизни 5 минут. Кэш обновляется без дополнительных затрат каждый раз при использовании кэшированного содержимого.

<Note>
Если вы считаете, что 5 минут — это слишком мало, Anthropic также предлагает длительность кэша в 1 час [за дополнительную плату](#pricing).

Для получения дополнительной информации см. [Длительность кэша в 1 час](#1-hour-cache-duration).
</Note>

<Tip>
  **Кэширование промптов кэширует полный префикс**

Кэширование промптов ссылается на весь промпт — `tools`, `system` и `messages` (в этом порядке) вплоть до и включая блок, обозначенный с помощью `cache_control`.

</Tip>

---
## Ценообразование

Кэширование промптов вводит новую структуру ценообразования. В таблице ниже показана цена за миллион токенов для каждой поддерживаемой модели:

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
Таблица выше отражает следующие множители ценообразования для кэширования промптов:
- Токены записи в кэш на 5 минут стоят в 1,25 раза больше, чем базовая цена входных токенов
- Токены записи в кэш на 1 час стоят в 2 раза больше, чем базовая цена входных токенов
- Токены чтения из кэша стоят в 0,1 раза от базовой цены входных токенов
</Note>

---
## Как реализовать кэширование промптов

### Поддерживаемые модели

Кэширование промптов в настоящее время поддерживается на:
- Claude Opus 4.5
- Claude Opus 4.1
- Claude Opus 4
- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Sonnet 3.7 ([устарела](/docs/ru/about-claude/model-deprecations))
- Claude Haiku 4.5
- Claude Haiku 3.5
- Claude Haiku 3
- Claude Opus 3 ([устарела](/docs/ru/about-claude/model-deprecations))

### Структурирование вашего промпта

Поместите статическое содержимое (определения инструментов, системные инструкции, контекст, примеры) в начало вашего промпта. Отметьте конец переиспользуемого содержимого для кэширования с помощью параметра `cache_control`.

Префиксы кэша создаются в следующем порядке: `tools`, `system`, затем `messages`. Этот порядок образует иерархию, где каждый уровень строится на предыдущих.

#### Как работает автоматическая проверка префикса

Вы можете использовать только одну точку разрыва кэша в конце вашего статического содержимого, и система автоматически найдёт самую длинную совпадающую последовательность кэшированных блоков. Понимание того, как это работает, помогает оптимизировать вашу стратегию кэширования.

**Три основных принципа:**

1. **Ключи кэша являются кумулятивными**: Когда вы явно кэшируете блок с помощью `cache_control`, ключ хэша кэша генерируется путём хэширования всех предыдущих блоков в разговоре последовательно. Это означает, что кэш для каждого блока зависит от всего содержимого, которое ему предшествует.

2. **Обратная последовательная проверка**: Система проверяет попадания в кэш, работая в обратном направлении от вашей явной точки разрыва, проверяя каждый предыдущий блок в обратном порядке. Это гарантирует, что вы получите самое длинное возможное попадание в кэш.

3. **Окно обратного просмотра из 20 блоков**: Система проверяет только до 20 блоков перед каждой явной точкой разрыва `cache_control`. После проверки 20 блоков без совпадения она прекращает проверку и переходит к следующей явной точке разрыва (если она есть).

**Пример: Понимание окна обратного просмотра**

Рассмотрим разговор с 30 блоками содержимого, где вы устанавливаете `cache_control` только на блоке 30:

- **Если вы отправляете блок 31 без изменений предыдущих блоков**: Система проверяет блок 30 (совпадение!). Вы получаете попадание в кэш на блоке 30, и только блок 31 требует обработки.

- **Если вы изменяете блок 25 и отправляете блок 31**: Система проверяет в обратном направлении от блока 30 → 29 → 28... → 25 (нет совпадения) → 24 (совпадение!). Поскольку блок 24 не изменился, вы получаете попадание в кэш на блоке 24, и только блоки 25-30 требуют переобработки.

- **Если вы изменяете блок 5 и отправляете блок 31**: Система проверяет в обратном направлении от блока 30 → 29 → 28... → 11 (проверка #20). После 20 проверок без нахождения совпадения она прекращает поиск. Поскольку блок 5 находится за пределами окна из 20 блоков, попадания в кэш не происходит и все блоки требуют переобработки. Однако, если бы вы установили явную точку разрыва `cache_control` на блоке 5, система продолжила бы проверку с этой точки разрыва: блок 5 (нет совпадения) → блок 4 (совпадение!). Это позволяет получить попадание в кэш на блоке 4, демонстрируя, почему вы должны размещать точки разрыва перед редактируемым содержимым.

**Ключевой вывод**: Всегда устанавливайте явную точку разрыва кэша в конце вашего разговора, чтобы максимизировать ваши шансы на попадания в кэш. Кроме того, устанавливайте точки разрыва непосредственно перед блоками содержимого, которые могут быть редактируемыми, чтобы гарантировать, что эти разделы могут быть кэшированы независимо.

#### Когда использовать несколько точек разрыва

Вы можете определить до 4 точек разрыва кэша, если хотите:
- Кэшировать различные разделы, которые изменяются с разной частотой (например, инструменты редко изменяются, но контекст обновляется ежедневно)
- Иметь больше контроля над тем, что именно кэшируется
- Обеспечить кэширование содержимого более чем на 20 блоков перед вашей точкой разрыва кэша
- Размещать точки разрыва перед редактируемым содержимым, чтобы гарантировать попадания в кэш даже при изменениях за пределами окна из 20 блоков

<Note>
**Важное ограничение**: Если ваш промпт содержит более 20 блоков содержимого перед вашей точкой разрыва кэша, и вы изменяете содержимое ранее, чем эти 20 блоков, вы не получите попадание в кэш, если не добавите дополнительные явные точки разрыва ближе к этому содержимому.
</Note>

### Ограничения кэша
Минимальная длина кэшируемого промпта составляет:
- 4096 токенов для Claude Opus 4.5
- 1024 токена для Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([устарела](/docs/ru/about-claude/model-deprecations)) и Claude Opus 3 ([устарела](/docs/ru/about-claude/model-deprecations))
- 4096 токенов для Claude Haiku 4.5
- 2048 токенов для Claude Haiku 3.5 и Claude Haiku 3

Более короткие промпты не могут быть кэшированы, даже если отмечены с помощью `cache_control`. Любые запросы на кэширование меньшего количества токенов будут обработаны без кэширования. Чтобы узнать, был ли промпт кэширован, см. поля использования ответа [fields](/docs/ru/build-with-claude/prompt-caching#tracking-cache-performance).

Для одновременных запросов обратите внимание, что запись в кэш становится доступной только после начала первого ответа. Если вам нужны попадания в кэш для параллельных запросов, дождитесь первого ответа перед отправкой последующих запросов.

В настоящее время «ephemeral» — это единственный поддерживаемый тип кэша, который по умолчанию имеет время жизни 5 минут.

### Понимание затрат на точки разрыва кэша

**Сами точки разрыва кэша не добавляют никаких затрат.** Вы платите только за:
- **Записи в кэш**: Когда новое содержимое записывается в кэш (на 25% больше, чем базовые входные токены для TTL 5 минут)
- **Чтения из кэша**: Когда используется кэшированное содержимое (10% от базовой цены входных токенов)
- **Обычные входные токены**: Для любого некэшированного содержимого

Добавление большего количества точек разрыва `cache_control` не увеличивает ваши затраты — вы по-прежнему платите одинаковую сумму в зависимости от того, какое содержимое фактически кэшируется и читается. Точки разрыва просто дают вам контроль над тем, какие разделы могут быть кэшированы независимо.

### Что может быть кэшировано
Большинство блоков в запросе могут быть обозначены для кэширования с помощью `cache_control`. Это включает:

- Инструменты: Определения инструментов в массиве `tools`
- Системные сообщения: Блоки содержимого в массиве `system`
- Текстовые сообщения: Блоки содержимого в массиве `messages.content`, для ходов пользователя и ассистента
- Изображения и документы: Блоки содержимого в массиве `messages.content`, в ходах пользователя
- Использование инструментов и результаты инструментов: Блоки содержимого в массиве `messages.content`, в ходах пользователя и ассистента

Каждый из этих элементов может быть отмечен с помощью `cache_control` для включения кэширования для этой части запроса.

### Что не может быть кэшировано
Хотя большинство блоков запроса могут быть кэшированы, есть некоторые исключения:

- Блоки мышления не могут быть кэшированы напрямую с помощью `cache_control`. Однако блоки мышления МОГУТ быть кэшированы вместе с другим содержимым, когда они появляются в предыдущих ходах ассистента. При кэшировании таким образом они СЧИТАЮТСЯ входными токенами при чтении из кэша.
- Подблоки содержимого (такие как [citations](/docs/ru/build-with-claude/citations)) сами по себе не могут быть кэшированы напрямую. Вместо этого кэшируйте блок верхнего уровня.

    В случае цитирований блоки содержимого документов верхнего уровня, которые служат исходным материалом для цитирований, могут быть кэшированы. Это позволяет вам эффективно использовать кэширование промптов с цитированиями путём кэширования документов, на которые будут ссылаться цитирования.
- Пустые текстовые блоки не могут быть кэшированы.

### Что делает кэш недействительным

Изменения кэшированного содержимого могут сделать недействительным часть или весь кэш.

Как описано в [Структурирование вашего промпта](#structuring-your-prompt), кэш следует иерархии: `tools` → `system` → `messages`. Изменения на каждом уровне делают недействительным этот уровень и все последующие уровни.

В таблице ниже показано, какие части кэша делаются недействительными различными типами изменений. ✘ указывает, что кэш делается недействительным, а ✓ указывает, что кэш остаётся действительным.

| Что изменяется | Кэш инструментов | Кэш системы | Кэш сообщений | Влияние |
|------------|------------------|---------------|----------------|-------------|
| **Определения инструментов** | ✘ | ✘ | ✘ | Изменение определений инструментов (имена, описания, параметры) делает недействительным весь кэш |
| **Переключение веб-поиска** | ✓ | ✘ | ✘ | Включение/отключение веб-поиска изменяет системный промпт |
| **Переключение цитирований** | ✓ | ✘ | ✘ | Включение/отключение цитирований изменяет системный промпт |
| **Выбор инструмента** | ✓ | ✓ | ✘ | Изменения параметра `tool_choice` влияют только на блоки сообщений |
| **Изображения** | ✓ | ✓ | ✘ | Добавление/удаление изображений в любом месте промпта влияет на блоки сообщений |
| **Параметры мышления** | ✓ | ✓ | ✘ | Изменения параметров расширенного мышления (включение/отключение, бюджет) влияют на блоки сообщений |
| **Результаты, не являющиеся результатами инструментов, переданные в запросы расширенного мышления** | ✓ | ✓ | ✘ | Когда результаты, не являющиеся результатами инструментов, передаются в запросы при включённом расширенном мышлении, все ранее кэшированные блоки мышления удаляются из контекста, и любые сообщения в контексте, которые следуют за этими блоками мышления, удаляются из кэша. Для получения дополнительной информации см. [Кэширование с блоками мышления](#caching-with-thinking-blocks). |

### Отслеживание производительности кэша

Отслеживайте производительность кэша, используя эти поля ответа API, в `usage` в ответе (или событие `message_start` при [потоковой передаче](/docs/ru/build-with-claude/streaming)):

- `cache_creation_input_tokens`: Количество токенов, записанных в кэш при создании новой записи.
- `cache_read_input_tokens`: Количество токенов, полученных из кэша для этого запроса.
- `input_tokens`: Количество входных токенов, которые не были прочитаны из кэша или использованы для создания кэша (т. е. токены после последней точки разрыва кэша).

<Note>
**Понимание разбивки токенов**

Поле `input_tokens` представляет только токены, которые идут **после последней точки разрыва кэша** в вашем запросе — не все входные токены, которые вы отправили.

Для расчёта общего количества входных токенов:
```
total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
```

**Пространственное объяснение:**
- `cache_read_input_tokens` = токены перед точкой разрыва, уже кэшированные (чтения)
- `cache_creation_input_tokens` = токены перед точкой разрыва, кэшируемые сейчас (записи)
- `input_tokens` = токены после вашей последней точки разрыва (не подходят для кэша)

**Пример:** Если у вас есть запрос с 100 000 токенов кэшированного содержимого (прочитано из кэша), 0 токенов нового содержимого, кэшируемого, и 50 токенов в вашем пользовательском сообщении (после точки разрыва кэша):
- `cache_read_input_tokens`: 100 000
- `cache_creation_input_tokens`: 0
- `input_tokens`: 50
- **Всего обработано входных токенов**: 100 050 токенов

Это важно для понимания как затрат, так и ограничений скорости, поскольку `input_tokens` обычно будет намного меньше, чем ваш общий ввод при эффективном использовании кэширования.
</Note>

### Лучшие практики для эффективного кэширования

Для оптимизации производительности кэширования промптов:

- Кэшируйте стабильное, переиспользуемое содержимое, такое как системные инструкции, справочная информация, большие контексты или частые определения инструментов.
- Поместите кэшированное содержимое в начало промпта для лучшей производительности.
- Используйте точки разрыва кэша стратегически, чтобы разделить различные кэшируемые разделы префикса.
- Устанавливайте точки разрыва кэша в конце разговоров и непосредственно перед редактируемым содержимым, чтобы максимизировать частоту попаданий в кэш, особенно при работе с промптами, содержащими более 20 блоков содержимого.
- Регулярно анализируйте частоту попаданий в кэш и при необходимости корректируйте вашу стратегию.

### Оптимизация для различных вариантов использования

Адаптируйте вашу стратегию кэширования промптов к вашему сценарию:

- Агенты разговора: Сокращайте затраты и задержку для расширенных разговоров, особенно тех, которые содержат длинные инструкции или загруженные документы.
- Помощники по кодированию: Улучшайте автодополнение и вопросы-ответы по кодовой базе, сохраняя соответствующие разделы или сводную версию кодовой базы в промпте.
- Обработка больших документов: Включайте полный долгоформатный материал, включая изображения, в ваш промпт без увеличения задержки ответа.
- Подробные наборы инструкций: Делитесь обширными списками инструкций, процедур и примеров для точной настройки ответов Claude. Разработчики часто включают один или два примера в промпт, но с кэшированием промптов вы можете получить ещё лучшую производительность, включив 20+ разнообразных примеров высококачественных ответов.
- Использование инструментов агентом: Улучшайте производительность для сценариев, включающих несколько вызовов инструментов и итеративные изменения кода, где каждый шаг обычно требует нового вызова API.
- Разговоры с книгами, статьями, документацией, транскриптами подкастов и другим долгоформатным содержимым: Оживите любую базу знаний, встроив весь документ(ы) в промпт и позволив пользователям задавать ему вопросы.

### Устранение неполадок распространённых проблем

Если вы испытываете неожиданное поведение:

- Убедитесь, что кэшированные разделы идентичны и отмечены с помощью cache_control в одних и тех же местах в разных вызовах
- Проверьте, что вызовы выполняются в течение времени жизни кэша (5 минут по умолчанию)
- Убедитесь, что `tool_choice` и использование изображений остаются постоянными между вызовами
- Проверьте, что вы кэшируете по крайней мере минимальное количество токенов
- Система автоматически проверяет попадания в кэш на границах предыдущих блоков содержимого (до ~20 блоков перед вашей точкой разрыва). Для промптов с более чем 20 блоками содержимого вам может потребоваться дополнительные параметры `cache_control` ранее в промпте, чтобы гарантировать, что всё содержимое может быть кэшировано
- Убедитесь, что ключи в ваших блоках содержимого `tool_use` имеют стабильный порядок, так как некоторые языки (например Swift, Go) рандомизируют порядок ключей при преобразовании JSON, нарушая кэши

<Note>
Изменения в `tool_choice` или наличие/отсутствие изображений в любом месте промпта сделают кэш недействительным, требуя создания новой записи в кэше. Для получения дополнительной информации об инвалидации кэша см. [Что делает кэш недействительным](#what-invalidates-the-cache).
</Note>

### Кэширование с блоками мышления

При использовании [расширенного мышления](/docs/ru/build-with-claude/extended-thinking) с кэшированием промптов блоки мышления имеют специальное поведение:

**Автоматическое кэширование вместе с другим содержимым**: Хотя блоки мышления не могут быть явно отмечены с помощью `cache_control`, они кэшируются как часть содержимого запроса при выполнении последующих вызовов API с результатами инструментов. Это обычно происходит при использовании инструментов, когда вы передаёте блоки мышления обратно, чтобы продолжить разговор.

**Подсчёт входных токенов**: Когда блоки мышления читаются из кэша, они считаются входными токенами в ваших метриках использования. Это важно для расчёта затрат и планирования бюджета токенов.

**Паттерны инвалидации кэша**:
- Кэш остаётся действительным, когда в качестве пользовательских сообщений предоставляются только результаты инструментов
- Кэш становится недействительным при добавлении пользовательского содержимого, не являющегося результатом инструмента, что приводит к удалению всех предыдущих блоков мышления
- Это поведение кэширования происходит даже без явных маркеров `cache_control`

Для получения дополнительной информации об инвалидации кэша см. [Что делает кэш недействительным](#what-invalidates-the-cache).

**Пример с использованием инструментов**:
```
Request 1: User: "What's the weather in Paris?"
Response: [thinking_block_1] + [tool_use block 1]

Request 2:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True]
Response: [thinking_block_2] + [text block 2]
# Request 2 caches its request content (not the response)
# The cache includes: user message, thinking_block_1, tool_use block 1, and tool_result_1

Request 3:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
# Non-tool-result user block causes all thinking blocks to be ignored
# This request is processed as if thinking blocks were never present
```

Когда включён блок пользователя, не являющийся результатом инструмента, он обозначает новый цикл ассистента и все предыдущие блоки мышления удаляются из контекста.

Для получения более подробной информации см. [документацию расширенного мышления](/docs/ru/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior).

---
## Хранилище кэша и совместное использование

- **Изоляция организации**: Кэши изолированы между организациями. Различные организации никогда не делят кэши, даже если они используют идентичные промпты.

- **Точное совпадение**: Попадания в кэш требуют 100% идентичных сегментов промпта, включая весь текст и изображения вплоть до и включая блок, отмеченный с помощью управления кэшем.

- **Генерация выходных токенов**: Кэширование промптов не влияет на генерацию выходных токенов. Ответ, который вы получите, будет идентичен тому, что вы получили бы, если бы кэширование промптов не использовалось.

---
## Длительность кэша в 1 час

Если вы считаете, что 5 минут — это слишком мало, Anthropic также предлагает длительность кэша в 1 час [за дополнительную плату](#pricing).

Чтобы использовать расширенный кэш, включите `ttl` в определение `cache_control` следующим образом:
```json
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

Ответ будет включать подробную информацию о кэше, подобную следующей:
```json
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,

        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

Обратите внимание, что текущее поле `cache_creation_input_tokens` равно сумме значений в объекте `cache_creation`.

### Когда использовать кэш на 1 час

Если у вас есть промпты, которые используются с регулярной периодичностью (т. е. системные промпты, которые используются чаще, чем каждые 5 минут), продолжайте использовать кэш на 5 минут, так как он будет продолжать обновляться без дополнительных затрат.

Кэш на 1 час лучше всего использовать в следующих сценариях:
- Когда у вас есть промпты, которые, вероятно, используются реже, чем каждые 5 минут, но чаще, чем каждый час. Например, когда побочный агент агента будет работать дольше 5 минут, или когда вы сохраняете длинный разговор с пользователем и обычно ожидаете, что пользователь может не ответить в течение следующих 5 минут.
- Когда задержка важна и ваши последующие промпты могут быть отправлены за пределами 5 минут.
- Когда вы хотите улучшить использование вашего ограничения скорости, так как попадания в кэш не вычитаются из вашего ограничения скорости.

<Note>
Кэш на 5 минут и кэш на 1 час ведут себя одинаково в отношении задержки. Вы обычно увидите улучшенное время до первого токена для длинных документов.
</Note>

### Смешивание различных TTL

Вы можете использовать управление кэшем на 1 час и 5 минут в одном запросе, но с важным ограничением: Записи в кэш с более длительным TTL должны появляться перед более короткими TTL (т. е. запись в кэш на 1 час должна появляться перед любыми записями в кэш на 5 минут).

При смешивании TTL мы определяем три места выставления счётов в вашем промпте:
1. Позиция `A`: Количество токенов на самом высоком попадании в кэш (или 0, если нет попаданий).
2. Позиция `B`: Количество токенов на самом высоком блоке `cache_control` на 1 час после `A` (или равно `A`, если ничего не существует).
3. Позиция `C`: Количество токенов на последнем блоке `cache_control`.

<Note>
Если `B` и/или `C` больше, чем `A`, они обязательно будут промахами в кэше, потому что `A` — это самое высокое попадание в кэш.
</Note>

Вам будет выставлен счёт за:
1. Токены чтения из кэша для `A`.
2. Токены записи в кэш на 1 час для `(B - A)`.
3. Токены записи в кэш на 5 минут для `(C - B)`.

Вот 3 примера. Это изображает входные токены 3 запросов, каждый из которых имеет различные попадания в кэш и промахи в кэше. Каждый имеет различный рассчитанный ценообразование, показанный в цветных полях, в результате.
![Mixing TTLs Diagram](/docs/images/prompt-cache-mixed-ttl.svg)

---

## Примеры кэширования подсказок

Чтобы помочь вам начать работу с кэшированием подсказок, мы подготовили [кулинарную книгу по кэшированию подсказок](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb) с подробными примерами и лучшими практиками.

Ниже мы включили несколько фрагментов кода, которые демонстрируют различные паттерны кэширования подсказок. Эти примеры показывают, как реализовать кэширование в различных сценариях, помогая вам понять практическое применение этой функции:

<section title="Пример кэширования большого контекста">

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
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
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing legal documents."
    },
    {
        "type": "text",
        "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
        "cache_control": {"type": "ephemeral"}
    }
  ],
  messages: [
    {
        "role": "user",
        "content": "What are the key terms and conditions in this agreement?"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class LegalDocumentAnalysisExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing legal documents.")
                                .build(),
                        TextBlockParam.builder()
                                .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("What are the key terms and conditions in this agreement?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>
Этот пример демонстрирует базовое использование кэширования подсказок, кэшируя полный текст юридического соглашения как префикс, сохраняя инструкцию пользователя без кэширования.

Для первого запроса:
- `input_tokens`: Количество токенов только в сообщении пользователя
- `cache_creation_input_tokens`: Количество токенов во всем системном сообщении, включая юридический документ
- `cache_read_input_tokens`: 0 (нет попадания в кэш при первом запросе)

Для последующих запросов в течение времени жизни кэша:
- `input_tokens`: Количество токенов только в сообщении пользователя
- `cache_creation_input_tokens`: 0 (нет нового создания кэша)
- `cache_read_input_tokens`: Количество токенов во всем кэшированном системном сообщении

</section>
<section title="Кэширование определений инструментов">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either celsius or fahrenheit"
                    }
                },
                "required": ["location"]
            }
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather and time in New York?"
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
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather in a given location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, CA"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
                    }
                },
                "required": ["location"]
            },
        },
        // many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages: [
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class ToolsWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Weather tool schema
        InputSchema weatherSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"
                        ),
                        "unit", Map.of(
                                "type", "string",
                                "enum", List.of("celsius", "fahrenheit"),
                                "description", "The unit of temperature, either celsius or fahrenheit"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        // Time tool schema
        InputSchema timeSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "timezone", Map.of(
                                "type", "string",
                                "description", "The IANA time zone name, e.g. America/Los_Angeles"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(weatherSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_time")
                        .description("Get the current time in a given time zone")
                        .inputSchema(timeSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                .addUserMessage("What is the weather and time in New York?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

В этом примере мы демонстрируем кэширование определений инструментов.

Параметр `cache_control` размещается на последнем инструменте (`get_time`), чтобы обозначить все инструменты как часть статического префикса.

Это означает, что все определения инструментов, включая `get_weather` и любые другие инструменты, определенные перед `get_time`, будут кэшированы как один префикс.

Этот подход полезен, когда у вас есть согласованный набор инструментов, которые вы хотите повторно использовать в нескольких запросах без их повторной обработки каждый раз.

Для первого запроса:
- `input_tokens`: Количество токенов в сообщении пользователя
- `cache_creation_input_tokens`: Количество токенов во всех определениях инструментов и системной подсказке
- `cache_read_input_tokens`: 0 (нет попадания в кэш при первом запросе)

Для последующих запросов в течение времени жизни кэша:
- `input_tokens`: Количество токенов в сообщении пользователя
- `cache_creation_input_tokens`: 0 (нет нового создания кэша)
- `cache_read_input_tokens`: Количество токенов во всех кэшированных определениях инструментов и системной подсказке

</section>

<section title="Продолжение многооборотного разговора">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
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
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        # ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        // ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class ConversationWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Create ephemeral system prompt
        TextBlockParam systemPrompt = TextBlockParam.builder()
                .text("...long system prompt")
                .cacheControl(CacheControlEphemeral.builder().build())
                .build();

        // Create message params
        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(systemPrompt))
                // First user message (without cache control)
                .addUserMessage("Hello, can you tell me more about the solar system?")
                // Assistant response
                .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                // Second user message (with cache control)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Good to know.")
                                .build()),
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Tell me more about Mars.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

В этом примере мы демонстрируем, как использовать кэширование подсказок в многооборотном разговоре.

На каждом ходу мы отмечаем последний блок последнего сообщения с помощью `cache_control`, чтобы разговор мог быть постепенно кэширован. Система автоматически ищет и использует самую длинную ранее кэшированную последовательность блоков для последующих сообщений. То есть блоки, которые ранее были отмечены блоком `cache_control`, позже не отмечаются этим, но они все равно будут считаться попаданием в кэш (и также обновлением кэша!), если они попадают в течение 5 минут.

Кроме того, обратите внимание, что параметр `cache_control` размещается в системном сообщении. Это необходимо для того, чтобы если он будет вытеснен из кэша (после неиспользования более 5 минут), он будет добавлен обратно в кэш при следующем запросе.

Этот подход полезен для поддержания контекста в текущих разговорах без повторной обработки одной и той же информации.

Когда это правильно настроено, вы должны увидеть следующее в ответе использования каждого запроса:
- `input_tokens`: Количество токенов в новом сообщении пользователя (будет минимальным)
- `cache_creation_input_tokens`: Количество токенов в новых ходах ассистента и пользователя
- `cache_read_input_tokens`: Количество токенов в разговоре до предыдущего хода

</section>

<section title="Все вместе: несколько точек разрыва кэша">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "system": [
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
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
    tools=[
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    system=[
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [
        {
            name: "search_documents",
            description: "Search through the knowledge base",
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query"
                    }
                },
                required: ["query"]
            }
        },
        {
            name: "get_document",
            description: "Retrieve a specific document by ID",
            input_schema: {
                type: "object",
                properties: {
                    doc_id: {
                        type: "string",
                        description: "Document ID"
                    }
                },
                required: ["doc_id"]
            },
            cache_control: { type: "ephemeral" }
        }
    ],
    system: [
        {
            type: "text",
            text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            cache_control: { type: "ephemeral" }
        }
    ],
    messages: [
        {
            role: "user",
            content: "Can you search for information about Mars rovers?"
        },
        {
            role: "assistant",
            content: [
                {
                    type: "tool_use",
                    id: "tool_1",
                    name: "search_documents",
                    input: { query: "Mars rovers" }
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "tool_1",
                    content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Yes, please tell me about the Perseverance rover specifically.",
                    cache_control: { type: "ephemeral" }
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlockParam;

public class MultipleCacheBreakpointsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Search tool schema
        InputSchema searchSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "query", Map.of(
                                "type", "string",
                                "description", "Search query"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                .build();

        // Get document tool schema
        InputSchema getDocSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "doc_id", Map.of(
                                "type", "string",
                                "description", "Document ID"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                // Tools with cache control on the last one
                .addTool(Tool.builder()
                        .name("search_documents")
                        .description("Search through the knowledge base")
                        .inputSchema(searchSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_document")
                        .description("Retrieve a specific document by ID")
                        .inputSchema(getDocSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                // System prompts with cache control on instructions and context separately
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build(),
                        TextBlockParam.builder()
                                .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                // Conversation history
                .addUserMessage("Can you search for information about Mars rovers?")
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                .id("tool_1")
                                .name("search_documents")
                                .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("tool_1")
                                .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                .build())
                ))
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Yes, please tell me about the Perseverance rover specifically.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

Этот комплексный пример демонстрирует, как использовать все 4 доступные точки разрыва кэша для оптимизации различных частей вашей подсказки:

1. **Кэш инструментов** (точка разрыва кэша 1): Параметр `cache_control` на последнем определении инструмента кэширует все определения инструментов.

2. **Кэш переиспользуемых инструкций** (точка разрыва кэша 2): Статические инструкции в системной подсказке кэшируются отдельно. Эти инструкции редко меняются между запросами.

3. **Кэш контекста RAG** (точка разрыва кэша 3): Документы базы знаний кэшируются независимо, позволяя вам обновлять документы RAG без инвалидации кэша инструментов или инструкций.

4. **Кэш истории разговора** (точка разрыва кэша 4): Ответ ассистента отмечается с помощью `cache_control` для включения постепенного кэширования разговора по мере его развития.

Этот подход обеспечивает максимальную гибкость:
- Если вы обновляете только последнее сообщение пользователя, все четыре сегмента кэша переиспользуются
- Если вы обновляете документы RAG, но сохраняете те же инструменты и инструкции, первые два сегмента кэша переиспользуются
- Если вы меняете разговор, но сохраняете те же инструменты, инструкции и документы, первые три сегмента переиспользуются
- Каждая точка разрыва кэша может быть инвалидирована независимо в зависимости от того, что меняется в вашем приложении

Для первого запроса:
- `input_tokens`: Токены в последнем сообщении пользователя
- `cache_creation_input_tokens`: Токены во всех кэшированных сегментах (инструменты + инструкции + документы RAG + история разговора)
- `cache_read_input_tokens`: 0 (нет попаданий в кэш)

Для последующих запросов только с новым сообщением пользователя:
- `input_tokens`: Токены только в новом сообщении пользователя
- `cache_creation_input_tokens`: Любые новые токены, добавленные в историю разговора
- `cache_read_input_tokens`: Все ранее кэшированные токены (инструменты + инструкции + документы RAG + предыдущий разговор)

Этот паттерн особенно мощен для:
- RAG приложений с большими контекстами документов
- Систем агентов, которые используют несколько инструментов
- Долгоживущих разговоров, которые должны поддерживать контекст
- Приложений, которые должны оптимизировать различные части подсказки независимо

</section>

---
## Часто задаваемые вопросы

  <section title="Нужны ли мне несколько точек разрыва кэша или одной в конце достаточно?">

    **В большинстве случаев одной точки разрыва кэша в конце вашего статического контента достаточно.** Система автоматически проверяет попадания в кэш на всех предыдущих границах блоков контента (до 20 блоков перед вашей точкой разрыва) и использует самую длинную совпадающую последовательность кэшированных блоков.

    Несколько точек разрыва нужны только если:
    - У вас более 20 блоков контента перед желаемой точкой кэша
    - Вы хотите кэшировать разделы, которые обновляются с разной частотой, независимо
    - Вам нужен явный контроль над тем, что кэшируется для оптимизации затрат

    Пример: Если у вас есть системные инструкции (редко меняются) и контекст RAG (меняется ежедневно), вы можете использовать две точки разрыва для их независимого кэширования.
  
</section>

  <section title="Добавляют ли точки разрыва кэша дополнительные затраты?">

    Нет, сами точки разрыва кэша бесплатны. Вы платите только за:
    - Запись контента в кэш (на 25% больше, чем базовые входные токены для TTL 5 минут)
    - Чтение из кэша (10% от цены базовых входных токенов)
    - Обычные входные токены для некэшированного контента

    Количество точек разрыва не влияет на цену - имеет значение только количество кэшированного и прочитанного контента.
  
</section>

  <section title="Как я рассчитываю общее количество входных токенов из полей использования?">

    Ответ использования включает три отдельных поля входных токенов, которые вместе представляют ваш общий ввод:

    ```
    total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
    ```

    - `cache_read_input_tokens`: Токены, полученные из кэша (все перед точками разрыва кэша, которые были кэшированы)
    - `cache_creation_input_tokens`: Новые токены, записываемые в кэш (в точках разрыва кэша)
    - `input_tokens`: Токены **после последней точки разрыва кэша**, которые не кэшируются

    **Важно:** `input_tokens` НЕ представляет все входные токены - только часть после вашей последней точки разрыва кэша. Если у вас есть кэшированный контент, `input_tokens` обычно будет намного меньше, чем ваш общий ввод.

    **Пример:** С кэшированным документом из 200K токенов и вопросом пользователя из 50 токенов:
    - `cache_read_input_tokens`: 200 000
    - `cache_creation_input_tokens`: 0
    - `input_tokens`: 50
    - **Итого**: 200 050 токенов

    Эта разбивка критична для понимания как ваших затрат, так и использования лимита скорости. Дополнительную информацию см. в разделе [Отслеживание производительности кэша](#tracking-cache-performance).
  
</section>

  <section title="Каково время жизни кэша?">

    Время жизни кэша (TTL) по умолчанию составляет минимум 5 минут. Это время жизни обновляется каждый раз, когда используется кэшированный контент.

    Если вы считаете, что 5 минут слишком мало, Anthropic также предлагает [кэш TTL на 1 час](#1-hour-cache-duration).
  
</section>

  <section title="Сколько точек разрыва кэша я могу использовать?">

    Вы можете определить до 4 точек разрыва кэша (используя параметры `cache_control`) в вашей подсказке.
  
</section>

  <section title="Доступно ли кэширование подсказок для всех моделей?">

    Нет, кэширование подсказок в настоящее время доступно только для Claude Opus 4.5, Claude Opus 4.1, Claude Opus 4, Claude Sonnet 4.5, Claude Sonnet 4, Claude Sonnet 3.7 ([устарело](/docs/ru/about-claude/model-deprecations)), Claude Haiku 4.5, Claude Haiku 3.5, Claude Haiku 3 и Claude Opus 3 ([устарело](/docs/ru/about-claude/model-deprecations)).
  
</section>

  <section title="Как кэширование подсказок работает с расширенным мышлением?">

    Кэшированные системные подсказки и инструменты будут переиспользованы при изменении параметров мышления. Однако изменения мышления (включение/отключение или изменения бюджета) будут инвалидировать ранее кэшированные префиксы подсказок с контентом сообщений.

    Дополнительную информацию об инвалидации кэша см. в разделе [Что инвалидирует кэш](#what-invalidates-the-cache).

    Дополнительную информацию о расширенном мышлении, включая его взаимодействие с использованием инструментов и кэшированием подсказок, см. в [документации по расширенному мышлению](/docs/ru/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching).
  
</section>

  <section title="Как я включаю кэширование подсказок?">

    Чтобы включить кэширование подсказок, включите по крайней мере одну точку разрыва `cache_control` в ваш запрос API.
  
</section>

  <section title="Могу ли я использовать кэширование подсказок с другими функциями API?">

    Да, кэширование подсказок можно использовать вместе с другими функциями API, такими как использование инструментов и возможности зрения. Однако изменение наличия изображений в подсказке или изменение параметров использования инструментов разрушит кэш.

    Дополнительную информацию об инвалидации кэша см. в разделе [Что инвалидирует кэш](#what-invalidates-the-cache).
  
</section>

  <section title="Как кэширование подсказок влияет на цены?">

    Кэширование подсказок вводит новую структуру цен, где запись в кэш стоит на 25% больше, чем базовые входные токены, а попадания в кэш стоят только 10% от цены базовых входных токенов.
  
</section>

  <section title="Могу ли я вручную очистить кэш?">

    В настоящее время нет способа вручную очистить кэш. Кэшированные префиксы автоматически истекают после минимум 5 минут неактивности.
  
</section>

  <section title="Как я могу отследить эффективность моей стратегии кэширования?">

    Вы можете отслеживать производительность кэша, используя поля `cache_creation_input_tokens` и `cache_read_input_tokens` в ответе API.
  
</section>

  <section title="Что может разрушить кэш?">

    Дополнительную информацию об инвалидации кэша см. в разделе [Что инвалидирует кэш](#what-invalidates-the-cache), включая список изменений, которые требуют создания новой записи кэша.
  
</section>

  <section title="Как кэширование подсказок обрабатывает конфиденциальность и разделение данных?">

Кэширование подсказок разработано с сильными мерами конфиденциальности и разделения данных:

1. Ключи кэша генерируются с использованием криптографического хеша подсказок до точки управления кэшем. Это означает, что только запросы с идентичными подсказками могут получить доступ к определенному кэшу.

2. Кэши зависят от организации. Пользователи в одной организации могут получить доступ к одному и тому же кэшу, если они используют идентичные подсказки, но кэши не совместно используются между разными организациями, даже для идентичных подсказок.

3. Механизм кэширования разработан для поддержания целостности и конфиденциальности каждого уникального разговора или контекста.

4. Безопасно использовать `cache_control` в любом месте ваших подсказок. Для экономии затрат лучше исключить из кэширования высоко переменные части (например, произвольный ввод пользователя).

Эти меры гарантируют, что кэширование подсказок поддерживает конфиденциальность и безопасность данных, обеспечивая при этом преимущества производительности.
  
</section>
  <section title="Могу ли я использовать кэширование подсказок с API Batches?">

    Да, можно использовать кэширование подсказок с вашими запросами [API Batches](/docs/ru/build-with-claude/batch-processing). Однако, поскольку асинхронные пакетные запросы могут обрабатываться одновременно и в любом порядке, попадания в кэш предоставляются на основе наилучших усилий.

    [Кэш на 1 час](#1-hour-cache-duration) может помочь улучшить ваши попадания в кэш. Наиболее экономичный способ его использования следующий:
    - Соберите набор запросов сообщений, которые имеют общий префикс.
    - Отправьте пакетный запрос с одним запросом, который имеет этот общий префикс и блок кэша на 1 час. Это будет записано в кэш на 1 час.
    - Как только это будет завершено, отправьте остальные запросы. Вам нужно будет отслеживать задание, чтобы узнать, когда оно завершится.

    Это обычно лучше, чем использование кэша на 5 минут, просто потому, что обычно пакетные запросы обрабатываются от 5 минут до 1 часа. Мы рассматриваем способы улучшения этих показателей попаданий в кэш и упрощения этого процесса.
  
</section>
  <section title="Почему я вижу ошибку `AttributeError: 'Beta' object has no attribute 'prompt_caching'` в Python?">

  Эта ошибка обычно появляется, когда вы обновили свой SDK или используете устаревшие примеры кода. Кэширование подсказок теперь общедоступно, поэтому вам больше не нужен префикс beta. Вместо:
    <CodeGroup>
      ```python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>
    Просто используйте:
    <CodeGroup>
      ```python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  
</section>
  <section title="Почему я вижу 'TypeError: Cannot read properties of undefined (reading 'messages')'?">

  Эта ошибка обычно появляется, когда вы обновили свой SDK или используете устаревшие примеры кода. Кэширование подсказок теперь общедоступно, поэтому вам больше не нужен префикс beta. Вместо:

      ```typescript TypeScript
      client.beta.promptCaching.messages.create(...)
      ```

      Просто используйте:

      ```typescript
      client.messages.create(...)
      ```
  
</section>