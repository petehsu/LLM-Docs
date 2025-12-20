# Microsoft Foundry의 Claude

Azure 네이티브 엔드포인트 및 인증을 통해 Microsoft Foundry에서 Claude 모델에 액세스합니다.

---

이 가이드는 Python, TypeScript 또는 직접 HTTP 요청을 사용하여 Foundry에서 Claude를 설정하고 API 호출을 하는 과정을 안내합니다. Foundry에서 Claude에 액세스할 수 있을 때, Claude 사용에 대한 요금이 Azure 구독을 통해 Microsoft Marketplace에서 청구되므로, Azure 구독을 통해 비용을 관리하면서 Claude의 최신 기능에 액세스할 수 있습니다.

지역별 가용성: 출시 시점에 Claude는 Foundry 리소스에서 Global Standard 배포 유형으로 사용 가능하며, US DataZone은 곧 출시될 예정입니다. Microsoft Marketplace의 Claude 가격은 Anthropic의 표준 API 가격을 사용합니다. 자세한 내용은 [가격 페이지](https://claude.com/pricing#api)를 방문하세요.

## 미리보기

이 미리보기 플랫폼 통합에서 Claude 모델은 Anthropic의 인프라에서 실행됩니다. 이는 Azure를 통한 청구 및 액세스를 위한 상용 통합입니다. Microsoft의 독립적인 프로세서로서, Microsoft Foundry를 통해 Claude를 사용하는 고객은 Anthropic의 데이터 사용 약관의 적용을 받습니다. Anthropic은 데이터 보유 제로 가용성을 포함한 업계 최고 수준의 보안 및 데이터 약속을 계속 제공합니다.

## 전제 조건

시작하기 전에 다음을 확인하세요:

- 활성 Azure 구독
- [Foundry](https://ai.azure.com/)에 대한 액세스
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) 설치 (선택 사항, 리소스 관리용)

## SDK 설치

Anthropic의 [클라이언트 SDK](/docs/ko/api/client-sdks)는 플랫폼별 패키지를 통해 Foundry를 지원합니다.

```bash
# Python
pip install -U "anthropic"

# Typescript
npm install @anthropic-ai/foundry-sdk
```

## 프로비저닝

Foundry는 두 가지 수준의 계층 구조를 사용합니다: **리소스**는 보안 및 청구 구성을 포함하고, **배포**는 API를 통해 호출하는 모델 인스턴스입니다. 먼저 Foundry 리소스를 생성한 다음, 그 내에 하나 이상의 Claude 배포를 생성합니다.

### Foundry 리소스 프로비저닝

Azure에서 서비스를 사용하고 관리하는 데 필요한 Foundry 리소스를 생성합니다. 이 지침을 따라 [Foundry 리소스](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource?pivots=azportal#create-a-new-azure-ai-foundry-resource)를 생성할 수 있습니다. 또는 [Foundry 프로젝트](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry)를 생성하여 시작할 수 있으며, 이는 Foundry 리소스를 생성하는 것을 포함합니다.

리소스를 프로비저닝하려면:

1. [Foundry 포털](https://ai.azure.com/)로 이동합니다
2. 새 Foundry 리소스를 생성하거나 기존 리소스를 선택합니다
3. Azure에서 발급한 API 키 또는 역할 기반 액세스 제어를 위한 Entra ID를 사용하여 액세스 관리를 구성합니다
4. 선택적으로 향상된 보안을 위해 리소스를 프라이빗 네트워크(Azure Virtual Network)의 일부가 되도록 구성합니다
5. 리소스 이름을 기록합니다. API 엔드포인트에서 `{resource}`로 사용합니다 (예: `https://{resource}.services.ai.azure.com/anthropic/v1/*`)

### Foundry 배포 생성

리소스를 생성한 후, Claude 모델을 배포하여 API 호출에 사용 가능하게 만듭니다:

1. Foundry 포털에서 리소스로 이동합니다
2. **Models + endpoints**로 이동하고 **+ Deploy model** > **Deploy base model**을 선택합니다
3. Claude 모델을 검색하고 선택합니다 (예: `claude-sonnet-4-5`)
4. 배포 설정을 구성합니다:
   - **Deployment name**: 기본값은 모델 ID이지만 사용자 정의할 수 있습니다 (예: `my-claude-deployment`). 배포 이름은 생성된 후 변경할 수 없습니다.
   - **Deployment type**: Global Standard를 선택합니다 (Claude에 권장됨)
5. **Deploy**를 선택하고 프로비저닝이 완료될 때까지 기다립니다
6. 배포되면 **Keys and Endpoint** 아래에서 엔드포인트 URL 및 키를 찾을 수 있습니다

<Note>
  선택한 배포 이름은 API 요청의 `model` 매개변수에 전달하는 값이 됩니다. 동일한 모델의 여러 배포를 다른 이름으로 생성하여 별도의 구성 또는 속도 제한을 관리할 수 있습니다.
</Note>

## 인증

Foundry의 Claude는 두 가지 인증 방법을 지원합니다: API 키 및 Entra ID 토큰. 두 방법 모두 `https://{resource}.services.ai.azure.com/anthropic/v1/*` 형식의 Azure 호스팅 엔드포인트를 사용합니다.

### API 키 인증

Foundry Claude 리소스를 프로비저닝한 후, Foundry 포털에서 API 키를 얻을 수 있습니다:

1. Foundry 포털에서 리소스로 이동합니다
2. **Keys and Endpoint** 섹션으로 이동합니다
3. 제공된 API 키 중 하나를 복사합니다
4. 요청에서 `api-key` 또는 `x-api-key` 헤더를 사용하거나 SDK에 제공합니다

Python 및 TypeScript SDK는 API 키와 리소스 이름 또는 기본 URL이 필요합니다. SDK는 정의된 경우 다음 환경 변수에서 자동으로 이를 읽습니다:

- `ANTHROPIC_FOUNDRY_API_KEY` - API 키
- `ANTHROPIC_FOUNDRY_RESOURCE` - 리소스 이름 (예: `example-resource`)
- `ANTHROPIC_FOUNDRY_BASE_URL` - 리소스 이름의 대안; 전체 기본 URL (예: `https://example-resource.services.ai.azure.com/anthropic/`)

<Note>
`resource` 및 `base_url` 매개변수는 상호 배타적입니다. 리소스 이름 (SDK가 URL을 `https://{resource}.services.ai.azure.com/anthropic/`로 구성하는 데 사용) 또는 전체 기본 URL을 직접 제공합니다.
</Note>

**API 키를 사용한 예제:**

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
API 키를 안전하게 보관하세요. 버전 제어에 커밋하거나 공개적으로 공유하지 마세요. API 키에 액세스할 수 있는 모든 사람이 Foundry 리소스를 통해 Claude에 요청을 할 수 있습니다.
</Warning>

## Microsoft Entra 인증

향상된 보안 및 중앙 집중식 액세스 관리를 위해 Entra ID (이전의 Azure Active Directory) 토큰을 사용할 수 있습니다:

1. Foundry 리소스에 대해 Entra 인증을 활성화합니다
2. Entra ID에서 액세스 토큰을 얻습니다
3. `Authorization: Bearer {TOKEN}` 헤더에서 토큰을 사용합니다

**Entra ID를 사용한 예제:**

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
Azure Entra ID 인증을 사용하면 Azure RBAC를 사용하여 액세스를 관리하고, 조직의 ID 관리와 통합하며, API 키를 수동으로 관리할 필요가 없습니다.
</Note>

## 상관 요청 ID

Foundry는 디버깅 및 추적을 위해 HTTP 응답 헤더에 요청 식별자를 포함합니다. 지원팀에 문의할 때 `request-id` 및 `apim-request-id` 값을 모두 제공하여 팀이 Anthropic 및 Azure 시스템 모두에서 요청을 빠르게 찾고 조사할 수 있도록 도와주세요.

## 지원되는 기능

Foundry의 Claude는 Claude의 대부분의 강력한 기능을 지원합니다. 현재 지원되는 모든 기능은 [여기](/docs/ko/build-with-claude/overview)에서 찾을 수 있습니다.

### 지원되지 않는 기능

- Admin API (`/v1/organizations/*` 엔드포인트)
- Models API (`/v1/models`)
- Message Batch API (`/v1/messages/batches`)

## API 응답

Foundry의 Claude에서 나온 API 응답은 표준 [Anthropic API 응답 형식](/docs/ko/api/messages)을 따릅니다. 여기에는 응답 본문의 `usage` 객체가 포함되며, 이는 요청에 대한 자세한 토큰 소비 정보를 제공합니다. `usage` 객체는 모든 플랫폼 (1차 API, Foundry, Amazon Bedrock 및 Google Vertex AI)에서 일관됩니다.

Foundry 관련 응답 헤더에 대한 자세한 내용은 [상관 요청 ID 섹션](#correlation-request-ids)을 참조하세요.

## API 모델 ID 및 배포

다음 Claude 모델은 Foundry를 통해 사용 가능합니다. 최신 세대 모델 (Sonnet 4.5, Opus 4.1 및 Haiku 4.5)은 가장 고급 기능을 제공합니다:

| Model             | Default Deployment Name     |
| :---------------- | :-------------------------- |
| Claude Opus 4.5   | `claude-opus-4-5`  |
| Claude Sonnet 4.5 | `claude-sonnet-4-5`         |
| Claude Opus 4.1   | `claude-opus-4-1`           |
| Claude Haiku 4.5  | `claude-haiku-4-5`          |

기본적으로 배포 이름은 위에 표시된 모델 ID와 일치합니다. 그러나 Foundry 포털에서 다른 이름의 사용자 정의 배포를 생성하여 다양한 구성, 버전 또는 속도 제한을 관리할 수 있습니다. API 요청에서 배포 이름 (반드시 모델 ID일 필요는 없음)을 사용합니다.

## 모니터링 및 로깅

Azure는 표준 Azure 패턴을 통해 Claude 사용에 대한 포괄적인 모니터링 및 로깅 기능을 제공합니다:

- **Azure Monitor**: API 사용, 지연 시간 및 오류율 추적
- **Azure Log Analytics**: 요청/응답 로그 쿼리 및 분석
- **Cost Management**: Claude 사용과 관련된 비용 모니터링 및 예측

Anthropic은 사용 패턴을 이해하고 잠재적 문제를 조사하기 위해 최소 30일 롤링 기준으로 활동을 로깅할 것을 권장합니다.

<Note>
Azure의 로깅 서비스는 Azure 구독 내에서 구성됩니다. 로깅을 활성화해도 청구 및 서비스 운영에 필요한 것 이상으로 Microsoft 또는 Anthropic이 콘텐츠에 액세스할 수 없습니다.
</Note>

## 문제 해결

### 인증 오류

**오류**: `401 Unauthorized` 또는 `Invalid API key`

- **해결책**: API 키가 올바른지 확인합니다. Azure 포털의 Claude 리소스에 대한 **Keys and Endpoint** 아래에서 새 API 키를 얻을 수 있습니다.
- **해결책**: Azure Entra ID를 사용하는 경우 액세스 토큰이 유효하고 만료되지 않았는지 확인합니다. 토큰은 일반적으로 1시간 후에 만료됩니다.

**오류**: `403 Forbidden`

- **해결책**: Azure 계정에 필요한 권한이 없을 수 있습니다. 적절한 Azure RBAC 역할이 할당되었는지 확인합니다 (예: "Cognitive Services OpenAI User").

### 속도 제한

**오류**: `429 Too Many Requests`

- **해결책**: 속도 제한을 초과했습니다. 애플리케이션에 지수 백오프 및 재시도 로직을 구현합니다.
- **해결책**: Azure 포털 또는 Azure 지원을 통해 속도 제한 증가를 요청하는 것을 고려합니다.

#### 속도 제한 헤더

Foundry는 응답에 Anthropic의 표준 속도 제한 헤더 (`anthropic-ratelimit-tokens-limit`, `anthropic-ratelimit-tokens-remaining`, `anthropic-ratelimit-tokens-reset`, `anthropic-ratelimit-input-tokens-limit`, `anthropic-ratelimit-input-tokens-remaining`, `anthropic-ratelimit-input-tokens-reset`, `anthropic-ratelimit-output-tokens-limit`, `anthropic-ratelimit-output-tokens-remaining` 및 `anthropic-ratelimit-output-tokens-reset`)을 포함하지 않습니다. 대신 Azure의 모니터링 도구를 통해 속도 제한을 관리합니다.

### 모델 및 배포 오류

**오류**: `Model not found` 또는 `Deployment not found`

- **해결책**: 올바른 배포 이름을 사용하고 있는지 확인합니다. 사용자 정의 배포를 생성하지 않은 경우 기본 모델 ID를 사용합니다 (예: `claude-sonnet-4-5`).
- **해결책**: 모델/배포가 Azure 지역에서 사용 가능한지 확인합니다.

**오류**: `Invalid model parameter`

- **해결책**: model 매개변수는 Foundry 포털에서 사용자 정의할 수 있는 배포 이름을 포함해야 합니다. 배포가 존재하고 올바르게 구성되었는지 확인합니다.

## 추가 리소스

- **Foundry 문서**: [ai.azure.com/catalog](https://ai.azure.com/catalog/publishers/anthropic)
- **Azure 가격**: [azure.microsoft.com/en-us/pricing](https://azure.microsoft.com/en-us/pricing/)
- **Anthropic 가격 세부 정보**: [가격 문서](/docs/ko/about-claude/pricing#third-party-platform-pricing)
- **인증 가이드**: 위의 [인증 섹션](#authentication)을 참조하세요
- **Azure 포털**: [portal.azure.com](https://portal.azure.com/)