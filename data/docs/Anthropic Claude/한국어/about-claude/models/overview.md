# 모델 개요

Claude는 Anthropic에서 개발한 최첨단 대규모 언어 모델 제품군입니다. 이 가이드는 당사의 모델을 소개하고 성능을 비교합니다.

---

## 모델 선택하기

어떤 모델을 사용할지 확실하지 않다면 **Claude Sonnet 4.5**부터 시작하는 것을 권장합니다. 대부분의 사용 사례에서 지능, 속도, 비용의 최적 균형을 제공하며, 코딩 및 에이전트 작업에서 뛰어난 성능을 발휘합니다.

현재의 모든 Claude 모델은 텍스트 및 이미지 입력, 텍스트 출력, 다국어 기능 및 비전을 지원합니다. 모델은 Anthropic API, AWS Bedrock 및 Google Vertex AI를 통해 사용할 수 있습니다.

모델을 선택한 후 [첫 번째 API 호출을 만드는 방법을 알아보세요](/docs/ko/get-started).

### 최신 모델 비교

| 기능 | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Opus 4.5 |
|:--------|:------------------|:-----------------|:----------------|
| **설명** | 복잡한 에이전트 및 코딩을 위한 당사의 스마트 모델 | 최첨단에 가까운 지능을 갖춘 당사의 가장 빠른 모델 | 최대 지능과 실용적 성능을 결합한 프리미엄 모델 |
| **Claude API ID** | claude-sonnet-4-5-20250929 | claude-haiku-4-5-20251001 | claude-opus-4-5-20251101 |
| **Claude API 별칭**<sup>1</sup> | claude-sonnet-4-5 | claude-haiku-4-5 | claude-opus-4-5 |
| **AWS Bedrock ID** | anthropic.claude-sonnet-4-5-20250929-v1:0 | anthropic.claude-haiku-4-5-20251001-v1:0 | anthropic.claude-opus-4-5-20251101-v1:0 |
| **GCP Vertex AI ID** | claude-sonnet-4-5@20250929 | claude-haiku-4-5@20251001 | claude-opus-4-5@20251101 |
| **가격**<sup>2</sup> | \$3 / 입력 MTok<br/>\$15 / 출력 MTok | \$1 / 입력 MTok<br/>\$5 / 출력 MTok | \$5 / 입력 MTok<br/>\$25 / 출력 MTok |
| **[확장 사고](/docs/ko/build-with-claude/extended-thinking)** | 예 | 예 | 예 |
| **[우선순위 계층](/docs/ko/api/service-tiers)** | 예 | 예 | 예 |
| **상대적 지연 시간** | 빠름 | 가장 빠름 | 중간 |
| **컨텍스트 윈도우** | <Tooltip tooltipContent="~150K 단어 \ ~680K 유니코드 문자">200K 토큰</Tooltip> / <br/> <Tooltip tooltipContent="~750K 단어 \ ~3.4M 유니코드 문자">1M 토큰</Tooltip> (베타)<sup>3</sup> | <Tooltip tooltipContent="~150K 단어 \ ~680K 유니코드 문자">200K 토큰</Tooltip> | <Tooltip tooltipContent="~150K 단어 \ ~680K 유니코드 문자">200K 토큰</Tooltip> |
| **최대 출력** | 64K 토큰 | 64K 토큰 | 64K 토큰 |
| **신뢰할 수 있는 지식 기준일** | 2025년 1월<sup>4</sup> | 2025년 2월 | 2025년 5월<sup>4</sup> |
| **학습 데이터 기준일** | 2025년 7월 | 2025년 7월 | 2025년 8월 |

_<sup>1 - 별칭은 자동으로 가장 최근의 모델 스냅샷을 가리킵니다. 새로운 모델 스냅샷을 출시할 때 별칭을 새 버전의 모델을 가리키도록 마이그레이션하며, 일반적으로 새 출시 후 1주일 이내에 진행됩니다. 별칭은 실험에 유용하지만 프로덕션 애플리케이션에서는 일관된 동작을 보장하기 위해 특정 모델 버전(예: `claude-sonnet-4-5-20250929`)을 사용하는 것을 권장합니다.</sup>_

_<sup>2 - 배치 API 할인, 프롬프트 캐싱 요금, 확장 사고 비용 및 비전 처리 수수료를 포함한 완전한 가격 정보는 당사의 [가격 페이지](/docs/ko/about-claude/pricing)를 참조하세요.</sup>_

_<sup>3 - Claude Sonnet 4.5는 `context-1m-2025-08-07` 베타 헤더를 사용할 때 [1M 토큰 컨텍스트 윈도우](/docs/ko/build-with-claude/context-windows#1m-token-context-window)를 지원합니다. [장문 컨텍스트 가격](/docs/ko/about-claude/pricing#long-context-pricing)은 200K 토큰을 초과하는 요청에 적용됩니다.</sup>_

_<sup>4 - **신뢰할 수 있는 지식 기준일**은 모델의 지식이 가장 광범위하고 신뢰할 수 있는 날짜를 나타냅니다. **학습 데이터 기준일**은 사용된 학습 데이터의 더 넓은 날짜 범위입니다. 예를 들어 Claude Sonnet 4.5는 2025년 7월까지 공개적으로 이용 가능한 정보로 학습되었지만 그 지식은 2025년 1월까지 가장 광범위하고 신뢰할 수 있습니다. 자세한 내용은 [Anthropic의 투명성 허브](https://www.anthropic.com/transparency)를 참조하세요.</sup>_

<Note>동일한 스냅샷 날짜(예: 20240620)를 가진 모델은 모든 플랫폼에서 동일하며 변경되지 않습니다. 모델 이름의 스냅샷 날짜는 일관성을 보장하고 개발자가 다양한 환경에서 안정적인 성능에 의존할 수 있도록 합니다.</Note>

<Note>**Claude Sonnet 4.5 및 모든 향후 모델**부터 AWS Bedrock 및 Google Vertex AI는 두 가지 엔드포인트 유형을 제공합니다: **글로벌 엔드포인트**(최대 가용성을 위한 동적 라우팅) 및 **지역 엔드포인트**(특정 지리적 영역을 통한 보장된 데이터 라우팅). 자세한 내용은 [타사 플랫폼 가격 섹션](/docs/ko/about-claude/pricing#third-party-platform-pricing)을 참조하세요.</Note>

<section title="레거시 모델">

다음 모델은 여전히 사용 가능하지만 향상된 성능을 위해 현재 모델로 마이그레이션하는 것을 권장합니다:

| 기능 | Claude Opus 4.1 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4 | Claude Haiku 3.5 | Claude Haiku 3 |
|:--------|:----------------|:----------------|:------------------|:--------------|:-----------------|:---------------|
| **Claude API ID** | claude-opus-4-1-20250805 | claude-sonnet-4-20250514 | claude-3-7-sonnet-20250219 | claude-opus-4-20250514 | claude-3-5-haiku-20241022 | claude-3-haiku-20240307 |
| **Claude API 별칭** | claude-opus-4-1 | claude-sonnet-4-0 | claude-3-7-sonnet-latest | claude-opus-4-0 | claude-3-5-haiku-latest | — |
| **AWS Bedrock ID** | anthropic.claude-opus-4-1-20250805-v1:0 | anthropic.claude-sonnet-4-20250514-v1:0 | anthropic.claude-3-7-sonnet-20250219-v1:0 | anthropic.claude-opus-4-20250514-v1:0 | anthropic.claude-3-5-haiku-20241022-v1:0 | anthropic.claude-3-haiku-20240307-v1:0 |
| **GCP Vertex AI ID** | claude-opus-4-1@20250805 | claude-sonnet-4@20250514 | claude-3-7-sonnet@20250219 | claude-opus-4@20250514 | claude-3-5-haiku@20241022 | claude-3-haiku@20240307 |
| **가격** | \$15 / 입력 MTok<br/>\$75 / 출력 MTok | \$3 / 입력 MTok<br/>\$15 / 출력 MTok | \$3 / 입력 MTok<br/>\$15 / 출력 MTok | \$15 / 입력 MTok<br/>\$75 / 출력 MTok | \$0.80 / 입력 MTok<br/>\$4 / 출력 MTok | \$0.25 / 입력 MTok<br/>\$1.25 / 출력 MTok |
| **[확장 사고](/docs/ko/build-with-claude/extended-thinking)** | 예 | 예 | 예 | 예 | 아니오 | 아니오 |
| **[우선순위 계층](/docs/ko/api/service-tiers)** | 예 | 예 | 예 | 예 | 예 | 아니오 |
| **상대적 지연 시간** | 중간 | 빠름 | 빠름 | 중간 | 가장 빠름 | 빠름 |
| **컨텍스트 윈도우** | <Tooltip tooltipContent="~150K 단어 \ ~680K 유니코드 문자">200K 토큰</Tooltip> | <Tooltip tooltipContent="~150K 단어 \ ~680K 유니코드 문자">200K 토큰</Tooltip> / <br/> <Tooltip tooltipContent="~750K 단어 \ ~3.4M 유니코드 문자">1M 토큰</Tooltip> (베타)<sup>1</sup> | <Tooltip tooltipContent="~150K 단어 \ ~680K 유니코드 문자">200K 토큰</Tooltip> | <Tooltip tooltipContent="~150K 단어 \ ~680K 유니코드 문자">200K 토큰</Tooltip> | <Tooltip tooltipContent="~150K 단어 \ ~215K 유니코드 문자">200K 토큰</Tooltip> | <Tooltip tooltipContent="~150K 단어 \ ~680K 유니코드 문자">200K 토큰</Tooltip> |
| **최대 출력** | 32K 토큰 | 64K 토큰 | 64K 토큰 / 128K 토큰 (베타)<sup>4</sup> | 32K 토큰 | 8K 토큰 | 4K 토큰 |
| **신뢰할 수 있는 지식 기준일** | 2025년 1월<sup>2</sup> | 2025년 1월<sup>2</sup> | 2024년 10월<sup>2</sup> | 2025년 1월<sup>2</sup> | <sup>3</sup> | <sup>3</sup> |
| **학습 데이터 기준일** | 2025년 3월 | 2025년 3월 | 2024년 11월 | 2025년 3월 | 2024년 7월 | 2023년 8월 |

_<sup>1 - Claude Sonnet 4는 `context-1m-2025-08-07` 베타 헤더를 사용할 때 [1M 토큰 컨텍스트 윈도우](/docs/ko/build-with-claude/context-windows#1m-token-context-window)를 지원합니다. [장문 컨텍스트 가격](/docs/ko/about-claude/pricing#long-context-pricing)은 200K 토큰을 초과하는 요청에 적용됩니다.</sup>_

_<sup>2 - **신뢰할 수 있는 지식 기준일**은 모델의 지식이 가장 광범위하고 신뢰할 수 있는 날짜를 나타냅니다. **학습 데이터 기준일**은 사용된 학습 데이터의 더 넓은 날짜 범위입니다.</sup>_

_<sup>3 - 일부 Haiku 모델은 단일 학습 데이터 기준일을 가집니다.</sup>_

_<sup>4 - API 요청에 베타 헤더 `output-128k-2025-02-19`를 포함하여 Claude Sonnet 3.7의 최대 출력 토큰 길이를 128K 토큰으로 증가시킵니다. 더 긴 출력을 생성할 때 타임아웃을 피하기 위해 당사의 [스트리밍 Messages API](/docs/ko/build-with-claude/streaming)를 사용하는 것을 강력히 권장합니다. 자세한 내용은 [장문 요청](/docs/ko/api/errors#long-requests)에 대한 당사의 지침을 참조하세요.</sup>_

</section>

## 프롬프트 및 출력 성능

Claude 4 모델은 다음 분야에서 탁월합니다:
- **성능**: 추론, 코딩, 다국어 작업, 장문 컨텍스트 처리, 정직성 및 이미지 처리에서 최고 수준의 결과를 제공합니다. 자세한 내용은 [Claude 4 블로그 게시물](http://www.anthropic.com/news/claude-4)을 참조하세요.
- **매력적인 응답**: Claude 모델은 풍부하고 인간다운 상호작용이 필요한 애플리케이션에 이상적입니다.

    - 더 간결한 응답을 선호하는 경우 프롬프트를 조정하여 모델을 원하는 출력 길이로 안내할 수 있습니다. 자세한 내용은 당사의 [프롬프트 엔지니어링 가이드](/docs/ko/build-with-claude/prompt-engineering)를 참조하세요.
    - Claude 4 프롬프팅 모범 사례는 당사의 [Claude 4 모범 사례 가이드](/docs/ko/build-with-claude/prompt-engineering/claude-4-best-practices)를 참조하세요.
- **출력 품질**: 이전 모델 세대에서 Claude 4로 마이그레이션할 때 전반적인 성능에서 더 큰 개선을 알 수 있습니다.

## Claude 4.5로 마이그레이션

현재 Claude 3 모델을 사용 중이라면 향상된 지능과 강화된 기능을 활용하기 위해 Claude 4.5로 마이그레이션하는 것을 권장합니다. 자세한 마이그레이션 지침은 [Claude 4.5로 마이그레이션](/docs/ko/about-claude/models/migrating-to-claude-4)을 참조하세요.

## Claude 시작하기

Claude가 당신을 위해 할 수 있는 일을 탐색할 준비가 되었다면 시작해봅시다! Claude를 애플리케이션에 통합하려는 개발자이든 AI의 강력함을 직접 경험하고 싶은 사용자이든 당신을 위해 준비되어 있습니다.

<Note>Claude와 채팅하고 싶으신가요? [claude.ai](http://www.claude.ai)를 방문하세요!</Note>

<CardGroup cols={3}>
  <Card title="Claude 소개" icon="check" href="/docs/ko/intro">
    Claude의 기능과 개발 흐름을 탐색하세요.
  </Card>
  <Card title="빠른 시작" icon="lightning" href="/docs/ko/get-started">
    몇 분 안에 첫 번째 API 호출을 만드는 방법을 알아보세요.
  </Card>
  <Card title="Claude 콘솔" icon="code" href="/">
    브라우저에서 직접 강력한 프롬프트를 작성하고 테스트하세요.
  </Card>
</CardGroup>

질문이 있거나 도움이 필요하면 당사의 [지원 팀](https://support.claude.com/)에 연락하거나 [Discord 커뮤니티](https://www.anthropic.com/discord)를 참조하세요.