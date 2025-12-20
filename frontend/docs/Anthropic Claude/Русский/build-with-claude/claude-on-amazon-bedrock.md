# Claude на Amazon Bedrock

Модели Claude от Anthropic теперь доступны в Amazon Bedrock.

---

Вызов Claude через Bedrock немного отличается от того, как вы вызывали бы Claude при использовании SDK клиента Anthropic. Это руководство проведет вас через процесс выполнения вызова API к Claude на Bedrock на Python или TypeScript.

Обратите внимание, что это руководство предполагает, что вы уже зарегистрировались в [учетной записи AWS](https://portal.aws.amazon.com/billing/signup) и настроили программный доступ.

## Установка и настройка AWS CLI

1. [Установите версию AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) версии `2.13.23` или новее
2. Настройте учетные данные AWS, используя команду AWS configure (см. [Настройка AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)) или найдите свои учетные данные, перейдя к "Command line or programmatic access" на панели управления AWS и следуя инструкциям во всплывающем модальном окне.
3. Проверьте, что ваши учетные данные работают:

```bash Shell
aws sts get-caller-identity
```

## Установка SDK для доступа к Bedrock

SDK клиента Anthropic [](/docs/ru/api/client-sdks) поддерживает Bedrock. Вы также можете использовать AWS SDK, такой как `boto3`, напрямую.

<CodeGroup>
  ```python Python
  pip install -U "anthropic[bedrock]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/bedrock-sdk
  ```

  ```python Boto3 (Python)
  pip install boto3>=1.28.59
  ```
</CodeGroup>

## Доступ к Bedrock

### Подписка на модели Anthropic

Перейдите в [AWS Console > Bedrock > Model Access](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess) и запросите доступ к моделям Anthropic. Обратите внимание, что доступность моделей Anthropic варьируется в зависимости от региона. См. [документацию AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html) для получения последней информации.

#### Идентификаторы моделей API

| Модель | Базовый идентификатор модели Bedrock | `global` | `us` | `eu` | `jp` | `apac` |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Claude Sonnet 4.5 | anthropic.claude-sonnet-4-5-20250929-v1:0 | Yes | Yes | Yes | Yes | No |
| Claude Sonnet 4 | anthropic.claude-sonnet-4-20250514-v1:0 | Yes | Yes | Yes | No | Yes |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Deprecated as of October 28, 2025.">⚠️</Tooltip> | anthropic.claude-3-7-sonnet-20250219-v1:0 | No | Yes | Yes | No | Yes |
| Claude Opus 4.5 | anthropic.claude-opus-4-5-20251101-v1:0 | Yes | Yes | Yes | No | No |
| Claude Opus 4.1 | anthropic.claude-opus-4-1-20250805-v1:0 | No | Yes | No | No | No |
| Claude Opus 4 | anthropic.claude-opus-4-20250514-v1:0 | No | Yes | No | No | No |
| Claude Opus 3 <Tooltip tooltipContent="Deprecated as of June 30, 2025.">⚠️</Tooltip> | anthropic.claude-3-opus-20240229-v1:0 | No | Yes | No | No | No |
| Claude Haiku 4.5 | anthropic.claude-haiku-4-5-20251001-v1:0 | Yes | Yes | Yes | No | No |
| Claude Haiku 3.5 | anthropic.claude-3-5-haiku-20241022-v1:0 | No | Yes | No | No | No |
| Claude Haiku 3 | anthropic.claude-3-haiku-20240307-v1:0 | No | Yes | Yes | No | Yes |

Для получения дополнительной информации о региональных и глобальных идентификаторах моделей см. раздел [Глобальные и региональные конечные точки](#global-vs-regional-endpoints) ниже.

### Список доступных моделей

Следующие примеры показывают, как вывести список всех моделей Claude, доступных через Bedrock:

<CodeGroup>
  ```bash AWS CLI
  aws bedrock list-foundation-models --region=us-west-2 --by-provider anthropic --query "modelSummaries[*].modelId"
  ```

  ```python Boto3 (Python)
  import boto3

  bedrock = boto3.client(service_name="bedrock")
  response = bedrock.list_foundation_models(byProvider="anthropic")

  for summary in response["modelSummaries"]:
      print(summary["modelId"])
  ```
</CodeGroup>

### Выполнение запросов

Следующие примеры показывают, как генерировать текст из Claude на Bedrock:

<CodeGroup>
  ```python Python
  from anthropic import AnthropicBedrock

  client = AnthropicBedrock(
      # Аутентификация путем предоставления ключей ниже или использования поставщиков учетных данных AWS по умолчанию, таких как
      # использование ~/.aws/credentials или переменных окружения "AWS_SECRET_ACCESS_KEY" и "AWS_ACCESS_KEY_ID".
      aws_access_key="<access key>",
      aws_secret_key="<secret key>",
      # Временные учетные данные можно использовать с aws_session_token.
      # Подробнее на https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
      aws_session_token="<session_token>",
      # aws_region изменяет регион aws, на который выполняется запрос. По умолчанию мы читаем AWS_REGION,
      # и если это не присутствует, мы по умолчанию используем us-east-1. Обратите внимание, что мы не читаем ~/.aws/config для региона.
      aws_region="us-west-2",
  )

  message = client.messages.create(
      model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
      max_tokens=256,
      messages=[{"role": "user", "content": "Hello, world"}]
  )
  print(message.content)
  ```

  ```typescript TypeScript
  import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

  const client = new AnthropicBedrock({
    // Аутентификация путем предоставления ключей ниже или использования поставщиков учетных данных AWS по умолчанию, таких как
    // использование ~/.aws/credentials или переменных окружения "AWS_SECRET_ACCESS_KEY" и "AWS_ACCESS_KEY_ID".
    awsAccessKey: '<access key>',
    awsSecretKey: '<secret key>',

    // Временные учетные данные можно использовать с awsSessionToken.
    // Подробнее на https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
    awsSessionToken: '<session_token>',

    // awsRegion изменяет регион aws, на который выполняется запрос. По умолчанию мы читаем AWS_REGION,
    // и если это не присутствует, мы по умолчанию используем us-east-1. Обратите внимание, что мы не читаем ~/.aws/config для региона.
    awsRegion: 'us-west-2',
  });

  async function main() {
    const message = await client.messages.create({
      model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
      max_tokens: 256,
      messages: [{"role": "user", "content": "Hello, world"}]
    });
    console.log(message);
  }
  main().catch(console.error);
  ```

  ```python Boto3 (Python)
  import boto3
  import json

  bedrock = boto3.client(service_name="bedrock-runtime")
  body = json.dumps({
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "Hello, world"}],
    "anthropic_version": "bedrock-2023-05-31"
  })

  response = bedrock.invoke_model(body=body, modelId="global.anthropic.claude-sonnet-4-5-20250929-v1:0")

  response_body = json.loads(response.get("body").read())
  print(response_body.get("content"))
  ```
</CodeGroup>

Дополнительные сведения см. в [SDK клиента](/docs/ru/api/client-sdks), а официальную документацию Bedrock см. [здесь](https://docs.aws.amazon.com/bedrock/).

## Логирование активности

Bedrock предоставляет [сервис логирования вызовов](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html), который позволяет клиентам регистрировать подсказки и завершения, связанные с вашим использованием.

Anthropic рекомендует регистрировать вашу активность по крайней мере на основе 30-дневного скользящего окна, чтобы понять вашу активность и исследовать любое потенциальное неправомерное использование.

<Note>
Включение этого сервиса не дает AWS или Anthropic никакого доступа к вашему контенту.
</Note>

## Поддержка функций
Все функции, которые в настоящее время поддерживаются на Bedrock, вы можете найти [здесь](/docs/ru/api/overview).

### Поддержка PDF на Bedrock

Поддержка PDF доступна на Amazon Bedrock через API Converse и API InvokeModel. Для получения подробной информации о возможностях и ограничениях обработки PDF см. [документацию по поддержке PDF](/docs/ru/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

**Важные соображения для пользователей API Converse:**
- Визуальный анализ PDF (диаграммы, изображения, макеты) требует включения цитирования
- Без цитирования доступна только базовая извлечение текста
- Для полного контроля без принудительного цитирования используйте API InvokeModel

Для получения дополнительной информации о двух режимах обработки документов и их ограничениях см. [руководство по поддержке PDF](/docs/ru/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

### Контекстное окно на 1 млн токенов

Claude Sonnet 4 и 4.5 поддерживают [контекстное окно на 1 млн токенов](/docs/ru/build-with-claude/context-windows#1m-token-context-window) на Amazon Bedrock.

<Note>
Контекстное окно на 1 млн токенов в настоящее время находится в бета-версии. Чтобы использовать расширенное контекстное окно, включите заголовок бета-версии `context-1m-2025-08-07` в ваши [запросы API Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-request-response.html).
</Note>

## Глобальные и региональные конечные точки

Начиная с **Claude Sonnet 4.5 и всех будущих моделей**, Amazon Bedrock предлагает два типа конечных точек:

- **Глобальные конечные точки**: Динамическая маршрутизация для максимальной доступности
- **Региональные конечные точки**: Гарантированная маршрутизация данных через определенные географические регионы

Региональные конечные точки включают надбавку в размере 10% к цене глобальных конечных точек.

<Note>
Это применяется только к Claude Sonnet 4.5 и будущим моделям. Старые модели (Claude Sonnet 4, Opus 4 и более ранние) сохраняют свои существующие структуры ценообразования.
</Note>

### Когда использовать каждый вариант

**Глобальные конечные точки (рекомендуется):**
- Обеспечивают максимальную доступность и время безотказной работы
- Динамически маршрутизируют запросы в регионы с доступной емкостью
- Без надбавки к цене
- Лучше всего для приложений, где гибкость размещения данных

**Региональные конечные точки (CRIS):**
- Маршрутизируют трафик через определенные географические регионы
- Требуются для требований к размещению данных и соответствию нормативным требованиям
- Доступны для США, ЕС, Японии и Австралии
- Надбавка в размере 10% отражает затраты на инфраструктуру для выделенной региональной емкости

### Реализация

**Использование глобальных конечных точек (по умолчанию для Sonnet 4.5 и 4):**

Идентификаторы моделей для Claude Sonnet 4.5 и 4 уже включают префикс `global.`:

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

message = client.messages.create(
    model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

const message = await client.messages.create({
  model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

**Использование региональных конечных точек (CRIS):**

Чтобы использовать региональные конечные точки, удалите префикс `global.` из идентификатора модели:

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

# Использование региональной конечной точки США (CRIS)
message = client.messages.create(
    model="anthropic.claude-sonnet-4-5-20250929-v1:0",  # Без префикса global.
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

// Использование региональной конечной точки США (CRIS)
const message = await client.messages.create({
  model: 'anthropic.claude-sonnet-4-5-20250929-v1:0',  // Без префикса global.
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

### Дополнительные ресурсы

- **Ценообразование AWS Bedrock:** [aws.amazon.com/bedrock/pricing](https://aws.amazon.com/bedrock/pricing/)
- **Документация по ценообразованию AWS:** [Руководство по ценообразованию Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
- **Блог AWS:** [Introducing Claude Sonnet 4.5 in Amazon Bedrock](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
- **Детали ценообразования Anthropic:** [Документация по ценообразованию](/docs/ru/about-claude/pricing#third-party-platform-pricing)