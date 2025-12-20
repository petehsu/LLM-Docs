# Amazon Bedrock의 Claude

Anthropic의 Claude 모델은 이제 Amazon Bedrock을 통해 일반적으로 사용 가능합니다.

---

Bedrock을 통해 Claude를 호출하는 것은 Anthropic의 클라이언트 SDK를 사용할 때 Claude를 호출하는 방식과 약간 다릅니다. 이 가이드는 Python 또는 TypeScript에서 Bedrock의 Claude에 대한 API 호출을 완료하는 과정을 안내합니다.

이 가이드는 이미 [AWS 계정](https://portal.aws.amazon.com/billing/signup)에 가입했으며 프로그래밍 방식의 액세스를 구성했다고 가정합니다.

## AWS CLI 설치 및 구성

1. [AWS CLI 버전 `2.13.23` 이상을 설치합니다](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html)
2. AWS configure 명령을 사용하여 AWS 자격 증명을 구성합니다([AWS CLI 구성](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) 참조) 또는 AWS 대시보드 내에서 "Command line or programmatic access"로 이동하여 팝업 모달의 지시를 따라 자격 증명을 찾습니다.
3. 자격 증명이 작동하는지 확인합니다:

```bash Shell
aws sts get-caller-identity
```

## Bedrock에 액세스하기 위한 SDK 설치

Anthropic의 [클라이언트 SDK](/docs/ko/api/client-sdks)는 Bedrock을 지원합니다. `boto3`와 같은 AWS SDK를 직접 사용할 수도 있습니다.

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

## Bedrock 액세스

### Anthropic 모델 구독

[AWS 콘솔 > Bedrock > Model Access](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess)로 이동하여 Anthropic 모델에 대한 액세스를 요청합니다. Anthropic 모델 가용성은 지역에 따라 다릅니다. 최신 정보는 [AWS 설명서](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html)를 참조하세요.

#### API 모델 ID

| 모델 | 기본 Bedrock 모델 ID | `global` | `us` | `eu` | `jp` | `apac` |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Claude Sonnet 4.5 | anthropic.claude-sonnet-4-5-20250929-v1:0 | Yes | Yes | Yes | Yes | No |
| Claude Sonnet 4 | anthropic.claude-sonnet-4-20250514-v1:0 | Yes | Yes | Yes | No | Yes |
| Claude Sonnet 3.7 <Tooltip tooltipContent="2025년 10월 28일부터 더 이상 사용되지 않습니다.">⚠️</Tooltip> | anthropic.claude-3-7-sonnet-20250219-v1:0 | No | Yes | Yes | No | Yes |
| Claude Opus 4.5 | anthropic.claude-opus-4-5-20251101-v1:0 | Yes | Yes | Yes | No | No |
| Claude Opus 4.1 | anthropic.claude-opus-4-1-20250805-v1:0 | No | Yes | No | No | No |
| Claude Opus 4 | anthropic.claude-opus-4-20250514-v1:0 | No | Yes | No | No | No |
| Claude Opus 3 <Tooltip tooltipContent="2025년 6월 30일부터 더 이상 사용되지 않습니다.">⚠️</Tooltip> | anthropic.claude-3-opus-20240229-v1:0 | No | Yes | No | No | No |
| Claude Haiku 4.5 | anthropic.claude-haiku-4-5-20251001-v1:0 | Yes | Yes | Yes | No | No |
| Claude Haiku 3.5 | anthropic.claude-3-5-haiku-20241022-v1:0 | No | Yes | No | No | No |
| Claude Haiku 3 | anthropic.claude-3-haiku-20240307-v1:0 | No | Yes | Yes | No | Yes |

지역별 및 글로벌 모델 ID에 대한 자세한 정보는 아래의 [글로벌 vs 지역 엔드포인트](#global-vs-regional-endpoints) 섹션을 참조하세요.

### 사용 가능한 모델 나열

다음 예제는 Bedrock을 통해 사용 가능한 모든 Claude 모델의 목록을 인쇄하는 방법을 보여줍니다:

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

### 요청 만들기

다음 예제는 Bedrock의 Claude에서 텍스트를 생성하는 방법을 보여줍니다:

<CodeGroup>
  ```python Python
  from anthropic import AnthropicBedrock

  client = AnthropicBedrock(
      # 아래 키를 제공하거나 ~/.aws/credentials 또는 "AWS_SECRET_ACCESS_KEY"와 "AWS_ACCESS_KEY_ID" 환경 변수를 사용하는 것과 같은
      # 기본 AWS 자격 증명 제공자를 사용하여 인증합니다.
      aws_access_key="<access key>",
      aws_secret_key="<secret key>",
      # 임시 자격 증명은 aws_session_token과 함께 사용할 수 있습니다.
      # https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html에서 자세히 읽어보세요.
      aws_session_token="<session_token>",
      # aws_region은 요청이 이루어지는 AWS 지역을 변경합니다. 기본적으로 AWS_REGION을 읽고,
      # 해당 값이 없으면 us-east-1로 기본 설정됩니다. ~/.aws/config에서 지역을 읽지 않습니다.
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
    // 아래 키를 제공하거나 ~/.aws/credentials 또는 "AWS_SECRET_ACCESS_KEY"와 "AWS_ACCESS_KEY_ID" 환경 변수를 사용하는 것과 같은
    // 기본 AWS 자격 증명 제공자를 사용하여 인증합니다.
    awsAccessKey: '<access key>',
    awsSecretKey: '<secret key>',

    // 임시 자격 증명은 awsSessionToken과 함께 사용할 수 있습니다.
    // https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html에서 자세히 읽어보세요.
    awsSessionToken: '<session_token>',

    // awsRegion은 요청이 이루어지는 AWS 지역을 변경합니다. 기본적으로 AWS_REGION을 읽고,
    // 해당 값이 없으면 us-east-1로 기본 설정됩니다. ~/.aws/config에서 지역을 읽지 않습니다.
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

자세한 내용은 [클라이언트 SDK](/docs/ko/api/client-sdks)를 참조하고, 공식 Bedrock 문서는 [여기](https://docs.aws.amazon.com/bedrock/)를 참조하세요.

## 활동 로깅

Bedrock은 [호출 로깅 서비스](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html)를 제공하여 고객이 사용과 관련된 프롬프트 및 완료를 기록할 수 있습니다.

Anthropic은 활동을 이해하고 잠재적인 오용을 조사하기 위해 최소 30일 롤링 기준으로 활동을 기록할 것을 권장합니다.

<Note>
이 서비스를 켜면 AWS 또는 Anthropic이 콘텐츠에 액세스할 수 없습니다.
</Note>

## 기능 지원
Bedrock에서 현재 지원되는 모든 기능은 [여기](/docs/ko/api/overview)에서 찾을 수 있습니다.

### Bedrock의 PDF 지원

PDF 지원은 Converse API 및 InvokeModel API를 통해 Amazon Bedrock에서 사용 가능합니다. PDF 처리 기능 및 제한 사항에 대한 자세한 정보는 [PDF 지원 설명서](/docs/ko/build-with-claude/pdf-support#amazon-bedrock-pdf-support)를 참조하세요.

**Converse API 사용자를 위한 중요한 고려 사항:**
- 시각적 PDF 분석(차트, 이미지, 레이아웃)에는 인용이 활성화되어야 합니다
- 인용이 없으면 기본 텍스트 추출만 사용 가능합니다
- 강제 인용 없이 완전한 제어를 위해 InvokeModel API를 사용하세요

두 가지 문서 처리 모드 및 해당 제한 사항에 대한 자세한 내용은 [PDF 지원 가이드](/docs/ko/build-with-claude/pdf-support#amazon-bedrock-pdf-support)를 참조하세요.

### 1M 토큰 컨텍스트 윈도우

Claude Sonnet 4 및 4.5는 Amazon Bedrock에서 [1M 토큰 컨텍스트 윈도우](/docs/ko/build-with-claude/context-windows#1m-token-context-window)를 지원합니다.

<Note>
1M 토큰 컨텍스트 윈도우는 현재 베타 버전입니다. 확장된 컨텍스트 윈도우를 사용하려면 [Bedrock API 요청](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-request-response.html)에 `context-1m-2025-08-07` 베타 헤더를 포함하세요.
</Note>

## 글로벌 vs 지역 엔드포인트

**Claude Sonnet 4.5 및 모든 향후 모델**부터 Amazon Bedrock은 두 가지 엔드포인트 유형을 제공합니다:

- **글로벌 엔드포인트**: 최대 가용성을 위한 동적 라우팅
- **지역 엔드포인트**: 특정 지리적 지역을 통한 보장된 데이터 라우팅

지역 엔드포인트는 글로벌 엔드포인트보다 10% 가격 프리미엄을 포함합니다.

<Note>
이는 Claude Sonnet 4.5 및 향후 모델에만 적용됩니다. 이전 모델(Claude Sonnet 4, Opus 4 및 이전 버전)은 기존 가격 구조를 유지합니다.
</Note>

### 각 옵션을 사용할 시기

**글로벌 엔드포인트(권장):**
- 최대 가용성 및 가동 시간 제공
- 사용 가능한 용량이 있는 지역으로 요청을 동적으로 라우팅
- 가격 프리미엄 없음
- 데이터 거주지가 유연한 애플리케이션에 최적

**지역 엔드포인트(CRIS):**
- 특정 지리적 지역을 통해 트래픽 라우팅
- 데이터 거주지 및 규정 준수 요구 사항에 필요
- 미국, EU, 일본 및 호주에서 사용 가능
- 10% 가격 프리미엄은 전용 지역 용량의 인프라 비용을 반영합니다

### 구현

**글로벌 엔드포인트 사용(Sonnet 4.5 및 4의 기본값):**

Claude Sonnet 4.5 및 4의 모델 ID에는 이미 `global.` 접두사가 포함되어 있습니다:

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

**지역 엔드포인트 사용(CRIS):**

지역 엔드포인트를 사용하려면 모델 ID에서 `global.` 접두사를 제거합니다:

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

# US 지역 엔드포인트(CRIS) 사용
message = client.messages.create(
    model="anthropic.claude-sonnet-4-5-20250929-v1:0",  # global. 접두사 없음
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

// US 지역 엔드포인트(CRIS) 사용
const message = await client.messages.create({
  model: 'anthropic.claude-sonnet-4-5-20250929-v1:0',  // global. 접두사 없음
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

### 추가 리소스

- **AWS Bedrock 가격 책정:** [aws.amazon.com/bedrock/pricing](https://aws.amazon.com/bedrock/pricing/)
- **AWS 가격 책정 설명서:** [Bedrock 가격 책정 가이드](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
- **AWS 블로그 게시물:** [Amazon Bedrock에서 Claude Sonnet 4.5 소개](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
- **Anthropic 가격 책정 세부 정보:** [가격 책정 설명서](/docs/ko/about-claude/pricing#third-party-platform-pricing)