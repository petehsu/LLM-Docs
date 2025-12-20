# Claude на Vertex AI

Модели Claude от Anthropic теперь доступны в общем доступе через [Vertex AI](https://cloud.google.com/vertex-ai).

---

API Vertex для доступа к Claude почти идентичен [Messages API](/docs/ru/api/messages) и поддерживает все те же опции с двумя ключевыми отличиями:

* В Vertex `model` не передается в теле запроса. Вместо этого он указывается в URL-адресе конечной точки Google Cloud.
* В Vertex `anthropic_version` передается в теле запроса (а не в качестве заголовка) и должен быть установлен на значение `vertex-2023-10-16`.

Vertex также поддерживается официальными [SDK клиентов](/docs/ru/api/client-sdks) Anthropic. Это руководство проведет вас через процесс создания запроса к Claude на Vertex AI на Python или TypeScript.

Обратите внимание, что это руководство предполагает, что у вас уже есть проект GCP, который может использовать Vertex AI. Дополнительную информацию о требуемой настройке и полное пошаговое руководство см. в разделе [использование моделей Claude 3 от Anthropic](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude).

## Установите SDK для доступа к Vertex AI

Сначала установите [SDK клиента](/docs/ru/api/client-sdks) Anthropic для выбранного вами языка.

<CodeGroup>
  ```python Python
  pip install -U google-cloud-aiplatform "anthropic[vertex]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/vertex-sdk
  ```
</CodeGroup>

## Доступ к Vertex AI

### Доступность моделей

Обратите внимание, что доступность моделей Anthropic варьируется в зависимости от региона. Найдите "Claude" в [Vertex AI Model Garden](https://cloud.google.com/model-garden) или перейдите на страницу [Использование Claude 3](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) для получения последней информации.

#### Идентификаторы моделей API

| Модель                          | Идентификатор модели Vertex AI API |
| ------------------------------ | ------------------------ |
| Claude Sonnet 4.5              | claude-sonnet-4-5@20250929 |
| Claude Sonnet 4                | claude-sonnet-4@20250514 |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Устарело с 28 октября 2025 г.">⚠️</Tooltip> | claude-3-7-sonnet@20250219 |
| Claude Opus 4.5                | claude-opus-4-5@20251101 |
| Claude Opus 4.1                | claude-opus-4-1@20250805 |
| Claude Opus 4                  | claude-opus-4@20250514   |
| Claude Opus 3 <Tooltip tooltipContent="Устарело с 30 июня 2025 г.">⚠️</Tooltip> | claude-3-opus@20240229   |
| Claude Haiku 4.5               | claude-haiku-4-5@20251001 |
| Claude Haiku 3.5               | claude-3-5-haiku@20241022 |
| Claude Haiku 3                 | claude-3-haiku@20240307  |

### Создание запросов

Перед выполнением запросов вам может потребоваться запустить `gcloud auth application-default login` для аутентификации с помощью GCP.

Следующие примеры показывают, как генерировать текст из Claude на Vertex AI:
<CodeGroup>

  ```python Python
  from anthropic import AnthropicVertex

  project_id = "MY_PROJECT_ID"
  region = "global"

  client = AnthropicVertex(project_id=project_id, region=region)

  message = client.messages.create(
      model="claude-sonnet-4-5@20250929",
      max_tokens=100,
      messages=[
          {
              "role": "user",
              "content": "Hey Claude!",
          }
      ],
  )
  print(message)
  ```

  ```typescript TypeScript
  import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

  const projectId = 'MY_PROJECT_ID';
  const region = 'global';

  // Goes through the standard `google-auth-library` flow.
  const client = new AnthropicVertex({
    projectId,
    region,
  });

  async function main() {
    const result = await client.messages.create({
      model: 'claude-sonnet-4-5@20250929',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Hey Claude!',
        },
      ],
    });
    console.log(JSON.stringify(result, null, 2));
  }

  main();
  ```

  ```bash Shell
  MODEL_ID=claude-sonnet-4-5@20250929
  LOCATION=global
  PROJECT_ID=MY_PROJECT_ID

  curl \
  -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  https://$LOCATION-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/anthropic/models/${MODEL_ID}:streamRawPredict -d \
  '{
    "anthropic_version": "vertex-2023-10-16",
    "messages": [{
      "role": "user",
      "content": "Hey Claude!"
    }],
    "max_tokens": 100,
  }'
  ```
</CodeGroup>

Дополнительную информацию см. в разделе [SDK клиентов](/docs/ru/api/client-sdks) и официальной [документации Vertex AI](https://cloud.google.com/vertex-ai/docs).

## Логирование активности

Vertex предоставляет [сервис логирования запросов и ответов](https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/request-response-logging), который позволяет клиентам регистрировать подсказки и завершения, связанные с вашим использованием.

Anthropic рекомендует регистрировать вашу активность как минимум на скользящей основе за 30 дней, чтобы понять вашу активность и исследовать любое потенциальное неправомерное использование.

<Note>
Включение этого сервиса не дает Google или Anthropic никакого доступа к вашему контенту.
</Note>

## Поддержка функций
Все функции, которые в настоящее время поддерживаются на Vertex, вы можете найти [здесь](/docs/ru/api/overview).

## Глобальные и региональные конечные точки

Начиная с **Claude Sonnet 4.5 и всех будущих моделей**, Google Vertex AI предлагает два типа конечных точек:

- **Глобальные конечные точки**: Динамическая маршрутизация для максимальной доступности
- **Региональные конечные точки**: Гарантированная маршрутизация данных через определенные географические регионы

Региональные конечные точки включают 10% надбавку к цене по сравнению с глобальными конечными точками.

<Note>
Это применяется только к Claude Sonnet 4.5 и будущим моделям. Старые модели (Claude Sonnet 4, Opus 4 и более ранние) сохраняют свои существующие структуры ценообразования.
</Note>

### Когда использовать каждый вариант

**Глобальные конечные точки (рекомендуется):**
- Обеспечивают максимальную доступность и время безотказной работы
- Динамически маршрутизируют запросы в регионы с доступной емкостью
- Без надбавки к цене
- Лучше всего для приложений, где местоположение данных гибко
- Поддерживает только трафик с оплатой по мере использования (подготовленная пропускная способность требует региональных конечных точек)

**Региональные конечные точки:**
- Маршрутизируют трафик через определенные географические регионы
- Требуются для требований к местоположению данных и соответствию нормативным требованиям
- Поддерживают как оплату по мере использования, так и подготовленную пропускную способность
- 10% надбавка к цене отражает затраты на инфраструктуру для выделенной региональной емкости

### Реализация

**Использование глобальных конечных точек (рекомендуется):**

Установите параметр `region` на `"global"` при инициализации клиента:

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "global"

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'global';

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

**Использование региональных конечных точек:**

Укажите конкретный регион, например `"us-east1"` или `"europe-west1"`:

<CodeGroup>
```python Python
from anthropic import AnthropicVertex

project_id = "MY_PROJECT_ID"
region = "us-east1"  # Specify a specific region

client = AnthropicVertex(project_id=project_id, region=region)

message = client.messages.create(
    model="claude-sonnet-4-5@20250929",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hey Claude!",
        }
    ],
)
print(message)
```

```typescript TypeScript
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const projectId = 'MY_PROJECT_ID';
const region = 'us-east1';  // Specify a specific region

const client = new AnthropicVertex({
  projectId,
  region,
});

const result = await client.messages.create({
  model: 'claude-sonnet-4-5@20250929',
  max_tokens: 100,
  messages: [
    {
      role: 'user',
      content: 'Hey Claude!',
    },
  ],
});
```
</CodeGroup>

### Дополнительные ресурсы

- **Ценообразование Google Vertex AI:** [cloud.google.com/vertex-ai/generative-ai/pricing](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- **Документация моделей Claude:** [Claude на Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/claude)
- **Пост в блоге Google:** [Глобальная конечная точка для моделей Claude](https://cloud.google.com/blog/products/ai-machine-learning/global-endpoint-for-claude-models-generally-available-on-vertex-ai)
- **Детали ценообразования Anthropic:** [Документация по ценообразованию](/docs/ru/about-claude/pricing#third-party-platform-pricing)