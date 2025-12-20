# Claude в Microsoft Foundry

Получайте доступ к моделям Claude через Microsoft Foundry с помощью Azure-нативных конечных точек и аутентификации.

---

Это руководство проведет вас через процесс настройки и выполнения вызовов API к Claude в Foundry на Python, TypeScript или с использованием прямых HTTP-запросов. Когда вы получите доступ к Claude в Foundry, вам будут выставляться счета за использование Claude на Microsoft Marketplace с помощью вашей подписки Azure, что позволит вам получить доступ к последним возможностям Claude при управлении затратами через вашу подписку Azure.

Региональная доступность: при запуске Claude доступен как тип развертывания Global Standard в ресурсах Foundry с US DataZone, который скоро появится. Цены на Claude на Microsoft Marketplace используют стандартное ценообразование API Anthropic. Посетите нашу [страницу с ценами](https://claude.com/pricing#api) для получения подробной информации.

## Предпросмотр

В этой интеграции платформы предпросмотра модели Claude работают на инфраструктуре Anthropic. Это коммерческая интеграция для выставления счетов и доступа через Azure. Как независимый обработчик для Microsoft, клиенты, использующие Claude через Microsoft Foundry, подчиняются условиям использования данных Anthropic. Anthropic продолжает предоставлять свои ведущие в отрасли обязательства по безопасности и данным, включая доступность нулевого хранения данных.

## Предварительные требования

Перед началом убедитесь, что у вас есть:

- Активная подписка Azure
- Доступ к [Foundry](https://ai.azure.com/)
- Установленный [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (опционально, для управления ресурсами)

## Установка SDK

[Клиентские SDK](/docs/ru/api/client-sdks) Anthropic поддерживают Foundry через пакеты, специфичные для платформы.

```bash
# Python
pip install -U "anthropic"

# Typescript
npm install @anthropic-ai/foundry-sdk
```

## Подготовка

Foundry использует двухуровневую иерархию: **ресурсы** содержат вашу конфигурацию безопасности и выставления счетов, а **развертывания** — это экземпляры модели, которые вы вызываете через API. Сначала вы создадите ресурс Foundry, а затем создадите одно или несколько развертываний Claude в нем.

### Подготовка ресурсов Foundry

Создайте ресурс Foundry, который требуется для использования и управления услугами в Azure. Вы можете следовать этим инструкциям для создания [ресурса Foundry](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource?pivots=azportal#create-a-new-azure-ai-foundry-resource). Кроме того, вы можете начать с создания [проекта Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry), который включает создание ресурса Foundry.

Для подготовки вашего ресурса:

1. Перейдите на [портал Foundry](https://ai.azure.com/)
2. Создайте новый ресурс Foundry или выберите существующий
3. Настройте управление доступом, используя ключи API, выданные Azure, или Entra ID для управления доступом на основе ролей
4. При необходимости настройте ресурс так, чтобы он был частью частной сети (Azure Virtual Network) для повышенной безопасности
5. Запомните имя вашего ресурса — вы будете использовать его как `{resource}` в конечных точках API (например, `https://{resource}.services.ai.azure.com/anthropic/v1/*`)

### Создание развертываний Foundry

После создания вашего ресурса разверните модель Claude, чтобы сделать ее доступной для вызовов API:

1. На портале Foundry перейдите к вашему ресурсу
2. Перейдите в **Models + endpoints** и выберите **+ Deploy model** > **Deploy base model**
3. Найдите и выберите модель Claude (например, `claude-sonnet-4-5`)
4. Настройте параметры развертывания:
   - **Deployment name**: По умолчанию соответствует ID модели, но вы можете настроить его (например, `my-claude-deployment`). Имя развертывания не может быть изменено после его создания.
   - **Deployment type**: Выберите Global Standard (рекомендуется для Claude)
5. Выберите **Deploy** и дождитесь завершения подготовки
6. После развертывания вы можете найти URL вашей конечной точки и ключи в разделе **Keys and Endpoint**

<Note>
  Имя развертывания, которое вы выбираете, становится значением, которое вы передаете в параметр `model` ваших запросов API. Вы можете создать несколько развертываний одной и той же модели с разными именами для управления отдельными конфигурациями или ограничениями скорости.
</Note>

## Аутентификация

Claude на Foundry поддерживает два метода аутентификации: ключи API и токены Entra ID. Оба метода используют конечные точки, размещенные в Azure, в формате `https://{resource}.services.ai.azure.com/anthropic/v1/*`.

### Аутентификация с помощью ключа API

После подготовки вашего ресурса Claude на Foundry вы можете получить ключ API с портала Foundry:

1. Перейдите к вашему ресурсу на портале Foundry
2. Перейдите в раздел **Keys and Endpoint**
3. Скопируйте один из предоставленных ключей API
4. Используйте заголовок `api-key` или `x-api-key` в ваших запросах или предоставьте его SDK

SDK Python и TypeScript требуют ключ API и либо имя ресурса, либо базовый URL. SDK автоматически прочитают эти значения из следующих переменных окружения, если они определены:

- `ANTHROPIC_FOUNDRY_API_KEY` - Ваш ключ API
- `ANTHROPIC_FOUNDRY_RESOURCE` - Имя вашего ресурса (например, `example-resource`)
- `ANTHROPIC_FOUNDRY_BASE_URL` - Альтернатива имени ресурса; полный базовый URL (например, `https://example-resource.services.ai.azure.com/anthropic/`)

<Note>
Параметры `resource` и `base_url` являются взаимоисключающими. Предоставьте либо имя ресурса (которое SDK использует для построения URL как `https://{resource}.services.ai.azure.com/anthropic/`), либо полный базовый URL напрямую.
</Note>

**Пример использования ключа API:**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry

client = AnthropicFoundry(
    api_key=os.environ.get("ANTHROPIC_FOUNDRY_API_KEY"),
    resource='example-resource', # your resource name
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";

const client = new AnthropicFoundry({
  apiKey: process.env.ANTHROPIC_FOUNDRY_API_KEY,
  resource: 'example-resource', // your resource name
});

const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "api-key: YOUR_AZURE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Warning>
Храните ключи API в безопасности. Никогда не фиксируйте их в системе контроля версий и не делитесь ими публично. Любой, кто имеет доступ к вашему ключу API, может делать запросы к Claude через ваш ресурс Foundry.
</Warning>

## Аутентификация Microsoft Entra

Для повышенной безопасности и централизованного управления доступом вы можете использовать токены Entra ID (ранее Azure Active Directory):

1. Включите аутентификацию Entra для вашего ресурса Foundry
2. Получите токен доступа из Entra ID
3. Используйте токен в заголовке `Authorization: Bearer {TOKEN}`

**Пример использования Entra ID:**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Get Azure Entra ID token using token provider pattern
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)

# Create client with Entra ID authentication
client = AnthropicFoundry(
    resource='example-resource', # your resource name
    azure_ad_token_provider=token_provider  # Use token provider for Entra ID auth
)

# Make request
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";

// Get Entra ID token using token provider pattern
const credential = new DefaultAzureCredential();
const tokenProvider = getBearerTokenProvider(
  credential,
  "https://cognitiveservices.azure.com/.default"
);

// Create client with Entra ID authentication
const client = new AnthropicFoundry({
  resource: 'example-resource', // your resource name
  azureADTokenProvider: tokenProvider, // Use token provider for Entra ID auth
});

// Make request
const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
# Get Azure Entra ID token
ACCESS_TOKEN=$(az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv)

# Make request with token. Replace {resource} with your resource name
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Note>
Аутентификация Azure Entra ID позволяет вам управлять доступом с помощью Azure RBAC, интегрироваться с управлением идентификацией вашей организации и избежать ручного управления ключами API.
</Note>

## Идентификаторы корреляции запросов

Foundry включает идентификаторы запросов в заголовки HTTP-ответов для отладки и трассировки. При обращении в службу поддержки предоставьте значения `request-id` и `apim-request-id`, чтобы помочь командам быстро найти и исследовать ваш запрос в системах Anthropic и Azure.

## Поддерживаемые функции

Claude на Foundry поддерживает большинство мощных функций Claude. Все поддерживаемые в настоящее время функции вы можете найти [здесь](/docs/ru/build-with-claude/overview).

### Неподдерживаемые функции

- Admin API (конечные точки `/v1/organizations/*`)
- Models API (`/v1/models`)
- Message Batch API (`/v1/messages/batches`)

## Ответы API

Ответы API от Claude на Foundry следуют стандартному [формату ответа API Anthropic](/docs/ru/api/messages). Это включает объект `usage` в телах ответов, который предоставляет подробную информацию о потреблении токенов для ваших запросов. Объект `usage` согласован на всех платформах (первичный API, Foundry, Amazon Bedrock и Google Vertex AI).

Для получения подробной информации о заголовках ответов, специфичных для Foundry, см. [раздел идентификаторов корреляции запросов](#correlation-request-ids).

## ID моделей API и развертывания

Следующие модели Claude доступны через Foundry. Модели последнего поколения (Sonnet 4.5, Opus 4.1 и Haiku 4.5) предлагают наиболее продвинутые возможности:

| Модель             | Имя развертывания по умолчанию     |
| :---------------- | :-------------------------- |
| Claude Opus 4.5   | `claude-opus-4-5`  |
| Claude Sonnet 4.5 | `claude-sonnet-4-5`         |
| Claude Opus 4.1   | `claude-opus-4-1`           |
| Claude Haiku 4.5  | `claude-haiku-4-5`          |

По умолчанию имена развертываний соответствуют ID моделей, показанным выше. Однако вы можете создать пользовательские развертывания с разными именами на портале Foundry для управления различными конфигурациями, версиями или ограничениями скорости. Используйте имя развертывания (не обязательно ID модели) в ваших запросах API.

## Мониторинг и логирование

Azure предоставляет комплексные возможности мониторинга и логирования для использования Claude через стандартные шаблоны Azure:

- **Azure Monitor**: Отслеживайте использование API, задержку и частоту ошибок
- **Azure Log Analytics**: Запрашивайте и анализируйте журналы запросов/ответов
- **Cost Management**: Мониторьте и прогнозируйте затраты, связанные с использованием Claude

Anthropic рекомендует логировать вашу деятельность по крайней мере на основе 30-дневного скользящего окна, чтобы понять закономерности использования и исследовать любые потенциальные проблемы.

<Note>
Услуги логирования Azure настраиваются в вашей подписке Azure. Включение логирования не предоставляет Microsoft или Anthropic доступ к вашему содержимому сверх того, что необходимо для выставления счетов и работы сервиса.
</Note>

## Устранение неполадок

### Ошибки аутентификации

**Ошибка**: `401 Unauthorized` или `Invalid API key`

- **Решение**: Убедитесь, что ваш ключ API правильный. Вы можете получить новый ключ API на портале Azure в разделе **Keys and Endpoint** для вашего ресурса Claude.
- **Решение**: Если вы используете Azure Entra ID, убедитесь, что ваш токен доступа действителен и не истек. Токены обычно истекают через 1 час.

**Ошибка**: `403 Forbidden`

- **Решение**: Ваша учетная запись Azure может не иметь необходимых разрешений. Убедитесь, что вам назначена соответствующая роль Azure RBAC (например, "Cognitive Services OpenAI User").

### Ограничение скорости

**Ошибка**: `429 Too Many Requests`

- **Решение**: Вы превысили ограничение скорости. Реализуйте логику экспоненциального отката и повторных попыток в вашем приложении.
- **Решение**: Рассмотрите возможность запроса увеличения ограничений скорости через портал Azure или поддержку Azure.

#### Заголовки ограничения скорости

Foundry не включает стандартные заголовки ограничения скорости Anthropic (`anthropic-ratelimit-tokens-limit`, `anthropic-ratelimit-tokens-remaining`, `anthropic-ratelimit-tokens-reset`, `anthropic-ratelimit-input-tokens-limit`, `anthropic-ratelimit-input-tokens-remaining`, `anthropic-ratelimit-input-tokens-reset`, `anthropic-ratelimit-output-tokens-limit`, `anthropic-ratelimit-output-tokens-remaining` и `anthropic-ratelimit-output-tokens-reset`) в ответах. Управляйте ограничением скорости через инструменты мониторинга Azure.

### Ошибки модели и развертывания

**Ошибка**: `Model not found` или `Deployment not found`

- **Решение**: Убедитесь, что вы используете правильное имя развертывания. Если вы не создали пользовательское развертывание, используйте ID модели по умолчанию (например, `claude-sonnet-4-5`).
- **Решение**: Убедитесь, что модель/развертывание доступны в вашем регионе Azure.

**Ошибка**: `Invalid model parameter`

- **Решение**: Параметр model должен содержать имя вашего развертывания, которое можно настроить на портале Foundry. Убедитесь, что развертывание существует и правильно настроено.

## Дополнительные ресурсы

- **Документация Foundry**: [ai.azure.com/catalog](https://ai.azure.com/catalog/publishers/anthropic)
- **Цены Azure**: [azure.microsoft.com/en-us/pricing](https://azure.microsoft.com/en-us/pricing/)
- **Подробности ценообразования Anthropic**: [Документация по ценообразованию](/docs/ru/about-claude/pricing#third-party-platform-pricing)
- **Руководство по аутентификации**: См. [раздел аутентификации](#authentication) выше
- **Портал Azure**: [portal.azure.com](https://portal.azure.com/)