# Claude 개발자 플랫폼

Claude API, 클라이언트 SDK 및 Claude 콘솔을 포함한 Claude 개발자 플랫폼의 업데이트입니다.

---

<Tip>
Claude Apps의 릴리스 노트는 [Claude 도움말 센터의 Claude Apps 릴리스 노트](https://support.claude.com/en/articles/12138966-release-notes)를 참조하세요.

Claude Code의 업데이트는 `claude-code` 저장소의 [전체 CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)를 참조하세요.
</Tip>

### 2025년 12월 4일
- [구조화된 출력](/docs/ko/build-with-claude/structured-outputs)이 이제 Claude Haiku 4.5를 지원합니다.

### 2025년 11월 24일
- [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5)를 출시했습니다. 최대 기능과 실용적인 성능을 결합한 가장 지능형 모델입니다. 복잡한 전문 작업, 전문 소프트웨어 엔지니어링 및 고급 에이전트에 이상적입니다. 이전 Opus 모델보다 더 저렴한 가격대에서 비전, 코딩 및 컴퓨터 사용 분야에서 획기적인 개선을 제공합니다. [모델 및 가격 책정 문서](/docs/ko/about-claude/models)에서 자세히 알아보세요.
- [프로그래밍 방식의 도구 호출](/docs/ko/agents-and-tools/tool-use/programmatic-tool-calling)을 공개 베타로 출시했습니다. Claude가 코드 실행 내에서 도구를 호출하여 다중 도구 워크플로우에서 지연 시간과 토큰 사용량을 줄일 수 있습니다.
- [도구 검색 도구](/docs/ko/agents-and-tools/tool-use/tool-search-tool)를 공개 베타로 출시했습니다. Claude가 대규모 도구 카탈로그에서 필요에 따라 동적으로 도구를 발견하고 로드할 수 있습니다.
- [노력 매개변수](/docs/ko/build-with-claude/effort)를 Claude Opus 4.5에 대해 공개 베타로 출시했습니다. 응답의 철저함과 효율성 간의 균형을 조정하여 토큰 사용량을 제어할 수 있습니다.
- Python 및 TypeScript SDK에 [클라이언트 측 압축](/docs/ko/build-with-claude/context-editing#client-side-compaction-sdk)을 추가했습니다. `tool_runner`를 사용할 때 요약을 통해 대화 컨텍스트를 자동으로 관리합니다.

### 2025년 11월 21일
- 검색 결과 콘텐츠 블록이 이제 Amazon Bedrock에서 일반적으로 사용 가능합니다. [검색 결과 문서](/docs/ko/build-with-claude/search-results)에서 자세히 알아보세요.

### 2025년 11월 19일
- [platform.claude.com/docs](https://platform.claude.com/docs)에서 **새로운 문서 플랫폼**을 출시했습니다. 이제 문서가 Claude 콘솔과 함께 제공되어 통합된 개발자 경험을 제공합니다. docs.claude.com의 이전 문서 사이트는 새 위치로 리디렉션됩니다.

### 2025년 11월 18일
- **Microsoft Foundry의 Claude**를 출시했습니다. Azure 청구 및 OAuth 인증을 통해 Claude 모델을 Azure 고객에게 제공합니다. 확장된 사고, 프롬프트 캐싱(5분 및 1시간), PDF 지원, Files API, Agent Skills 및 도구 사용을 포함한 전체 Messages API에 액세스할 수 있습니다. [Microsoft Foundry 문서](/docs/ko/build-with-claude/claude-in-microsoft-foundry)에서 자세히 알아보세요.

### 2025년 11월 14일
- [구조화된 출력](/docs/ko/build-with-claude/structured-outputs)을 공개 베타로 출시했습니다. Claude의 응답에 대해 보장된 스키마 준수를 제공합니다. 구조화된 데이터 응답을 위해 JSON 출력을 사용하거나 검증된 도구 입력을 위해 엄격한 도구 사용을 사용하세요. Claude Sonnet 4.5 및 Claude Opus 4.1에서 사용 가능합니다. 활성화하려면 베타 헤더 `structured-outputs-2025-11-13`을 사용하세요.

### 2025년 10월 28일
- Claude Sonnet 3.7 모델의 지원 중단을 발표했습니다. [문서](/docs/ko/about-claude/model-deprecations)에서 자세히 알아보세요.
- Claude Sonnet 3.5 모델을 중단했습니다. 이러한 모델에 대한 모든 요청은 이제 오류를 반환합니다.
- 사고 블록 지우기(`clear_thinking_20251015`)로 컨텍스트 편집을 확장했습니다. 사고 블록의 자동 관리를 활성화합니다. [컨텍스트 편집 문서](/docs/ko/build-with-claude/context-editing)에서 자세히 알아보세요.

### 2025년 10월 16일
- [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)(`skills-2025-10-02` 베타)를 출시했습니다. Claude의 기능을 확장하는 새로운 방법입니다. Skills는 Claude가 동적으로 로드하여 전문화된 작업을 수행하는 지침, 스크립트 및 리소스의 구성된 폴더입니다. 초기 릴리스에는 다음이 포함됩니다:
  - **Anthropic 관리 Skills**: PowerPoint(.pptx), Excel(.xlsx), Word(.docx) 및 PDF 파일 작업을 위한 사전 구축된 Skills
  - **사용자 정의 Skills**: Skills API(`/v1/skills` 엔드포인트)를 통해 자신의 Skills를 업로드하여 도메인 전문 지식 및 조직 워크플로우를 패키징합니다
  - Skills는 [코드 실행 도구](/docs/ko/agents-and-tools/tool-use/code-execution-tool)가 활성화되어야 합니다
  - [Agent Skills 문서](/docs/ko/agents-and-tools/agent-skills/overview) 및 [API 참조](/docs/ko/api/skills/create-skill)에서 자세히 알아보세요

### 2025년 10월 15일
- [Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5)를 출시했습니다. 최고 수준의 성능에 가까운 가장 빠르고 가장 지능형 Haiku 모델입니다. 실시간 애플리케이션, 대량 처리 및 강력한 추론이 필요한 비용 민감한 배포에 이상적입니다. [모델 및 가격 책정 문서](/docs/ko/about-claude/models)에서 자세히 알아보세요.

### 2025년 9월 29일
- [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5)를 출시했습니다. 복잡한 에이전트 및 코딩을 위한 최고의 모델이며, 대부분의 작업에서 가장 높은 지능을 제공합니다. [Claude 4.5의 새로운 기능](/docs/ko/about-claude/models/whats-new-claude-4-5)에서 자세히 알아보세요.
- AWS Bedrock 및 Google Vertex AI에 대한 [글로벌 엔드포인트 가격 책정](/docs/ko/about-claude/pricing#third-party-platform-pricing)을 도입했습니다. Claude API(1P) 가격 책정은 영향을 받지 않습니다.
- 입력 크기를 계산하지 않고 최대 가능한 토큰을 요청할 수 있는 새로운 중지 이유 `model_context_window_exceeded`를 도입했습니다. [중지 이유 처리 문서](/docs/ko/build-with-claude/handling-stop-reasons)에서 자세히 알아보세요.
- 베타 버전의 메모리 도구를 출시했습니다. Claude가 대화 전체에서 정보를 저장하고 참조할 수 있습니다. [메모리 도구 문서](/docs/ko/agents-and-tools/tool-use/memory-tool)에서 자세히 알아보세요.
- 베타 버전의 컨텍스트 편집을 출시했습니다. 대화 컨텍스트를 자동으로 관리하는 전략을 제공합니다. 초기 릴리스는 토큰 제한에 접근할 때 이전 도구 결과 및 호출을 지우는 것을 지원합니다. [컨텍스트 편집 문서](/docs/ko/build-with-claude/context-editing)에서 자세히 알아보세요.

### 2025년 9월 17일
- Python 및 TypeScript SDK에 대해 베타 버전의 도구 헬퍼를 출시했습니다. 타입 안전 입력 검증 및 대화에서 자동화된 도구 처리를 위한 도구 러너로 도구 생성 및 실행을 단순화합니다. 자세한 내용은 [Python SDK 문서](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md) 및 [TypeScript SDK 문서](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers)를 참조하세요.

### 2025년 9월 16일
- Claude 브랜드 아래에 개발자 제공 사항을 통합했습니다. 플랫폼 및 문서 전체에서 업데이트된 이름 및 URL을 볼 수 있지만, **개발자 인터페이스는 동일하게 유지됩니다**. 다음은 주목할 만한 변경 사항입니다:
  - Anthropic 콘솔([console.anthropic.com](https://console.anthropic.com)) → Claude 콘솔([platform.claude.com](https://platform.claude.com)). 콘솔은 2025년 12월 16일까지 두 URL 모두에서 사용 가능합니다. 그 이후로 [console.anthropic.com](https://console.anthropic.com)은 자동으로 [platform.claude.com](https://platform.claude.com)으로 리디렉션됩니다.
  - Anthropic 문서([docs.claude.com](https://docs.claude.com)) → Claude 문서([docs.claude.com](https://docs.claude.com))
  - Anthropic 도움말 센터([support.claude.com](https://support.claude.com)) → Claude 도움말 센터([support.claude.com](https://support.claude.com))
  - API 엔드포인트, 헤더, 환경 변수 및 SDK는 동일하게 유지됩니다. 기존 통합은 변경 없이 계속 작동합니다.

### 2025년 9월 10일
- 베타 버전의 웹 가져오기 도구를 출시했습니다. Claude가 지정된 웹 페이지 및 PDF 문서에서 전체 콘텐츠를 검색할 수 있습니다. [웹 가져오기 도구 문서](/docs/ko/agents-and-tools/tool-use/web-fetch-tool)에서 자세히 알아보세요.
- [Claude Code Analytics API](/docs/ko/build-with-claude/claude-code-analytics-api)를 출시했습니다. 조직이 생산성 지표, 도구 사용 통계 및 비용 데이터를 포함한 Claude Code의 일일 집계 사용 지표에 프로그래밍 방식으로 액세스할 수 있습니다.

### 2025년 9월 8일
- [C# SDK](https://github.com/anthropics/anthropic-sdk-csharp)의 베타 버전을 출시했습니다.

### 2025년 9월 5일
- 콘솔 [사용량](https://console.anthropic.com/settings/usage) 페이지에 [속도 제한 차트](/docs/ko/api/rate-limits#monitoring-your-rate-limits-in-the-console)를 출시했습니다. 시간 경과에 따른 API 속도 제한 사용량 및 캐싱 속도를 모니터링할 수 있습니다.

### 2025년 9월 3일
- 클라이언트 측 도구 결과에서 인용 가능한 문서에 대한 지원을 출시했습니다. [도구 사용 문서](/docs/ko/agents-and-tools/tool-use/implement-tool-use)에서 자세히 알아보세요.

### 2025년 9월 2일
- [코드 실행 도구](/docs/ko/agents-and-tools/tool-use/code-execution-tool)의 v2를 공개 베타로 출시했습니다. Python 전용 도구를 Bash 명령 실행 및 직접 파일 조작 기능으로 대체하며, 다른 언어로 코드를 작성할 수 있습니다.

### 2025년 8월 27일
- [PHP SDK](https://github.com/anthropics/anthropic-sdk-php)의 베타 버전을 출시했습니다.

### 2025년 8월 26일
- Claude API의 Claude Sonnet 4에 대해 [1M 토큰 컨텍스트 윈도우](/docs/ko/build-with-claude/context-windows#1m-token-context-window)의 속도 제한을 증가시켰습니다. 자세한 내용은 [장문 컨텍스트 속도 제한](/docs/ko/api/rate-limits#long-context-rate-limits)을 참조하세요.
- 1m 토큰 컨텍스트 윈도우는 이제 Google Cloud의 Vertex AI에서 사용 가능합니다. 자세한 내용은 [Vertex AI의 Claude](/docs/ko/build-with-claude/claude-on-vertex-ai)를 참조하세요.

### 2025년 8월 19일
- 요청 ID가 이제 기존 `request-id` 헤더와 함께 오류 응답 본문에 직접 포함됩니다. [오류 문서](/docs/ko/api/errors#error-shapes)에서 자세히 알아보세요.

### 2025년 8월 18일
- [사용량 및 비용 API](/docs/ko/build-with-claude/usage-cost-api)를 출시했습니다. 관리자가 조직의 사용량 및 비용 데이터를 프로그래밍 방식으로 모니터링할 수 있습니다.
- 조직 정보를 검색하기 위한 새로운 엔드포인트를 Admin API에 추가했습니다. 자세한 내용은 [조직 정보 Admin API 참조](/docs/ko/api/admin-api/organization/get-me)를 참조하세요.

### 2025년 8월 13일
- Claude Sonnet 3.5 모델(`claude-3-5-sonnet-20240620` 및 `claude-3-5-sonnet-20241022`)의 지원 중단을 발표했습니다. 이러한 모델은 2025년 10월 28일에 중단됩니다. 향상된 성능 및 기능을 위해 Claude Sonnet 4.5(`claude-sonnet-4-5-20250929`)로 마이그레이션하는 것을 권장합니다. [모델 지원 중단 문서](/docs/ko/about-claude/model-deprecations)에서 자세히 알아보세요.
- 프롬프트 캐싱을 위한 1시간 캐시 지속 시간이 이제 일반적으로 사용 가능합니다. 베타 헤더 없이 확장된 캐시 TTL을 사용할 수 있습니다. [프롬프트 캐싱 문서](/docs/ko/build-with-claude/prompt-caching#1-hour-cache-duration)에서 자세히 알아보세요.

### 2025년 8월 12일
- Claude API 및 Amazon Bedrock의 Claude Sonnet 4에서 [1M 토큰 컨텍스트 윈도우](/docs/ko/build-with-claude/context-windows#1m-token-context-window)에 대한 베타 지원을 출시했습니다.

### 2025년 8월 11일
- API 사용량의 급격한 증가로 인해 일부 고객이 가속화 제한으로 인해 429(`rate_limit_error`) [오류](/docs/ko/api/errors)를 만날 수 있습니다. 이전에는 유사한 시나리오에서 529(`overloaded_error`) 오류가 발생했습니다.

### 2025년 8월 8일
- 검색 결과 콘텐츠 블록이 이제 Claude API 및 Google Cloud의 Vertex AI에서 일반적으로 사용 가능합니다. 이 기능은 적절한 출처 속성을 사용하여 RAG 애플리케이션에 대한 자연스러운 인용을 활성화합니다. 베타 헤더 `search-results-2025-06-09`는 더 이상 필요하지 않습니다. [검색 결과 문서](/docs/ko/build-with-claude/search-results)에서 자세히 알아보세요.

### 2025년 8월 5일
- [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1)을 출시했습니다. Claude Opus 4에 대한 증분 업데이트로 향상된 기능 및 성능 개선을 제공합니다.<sup>*</sup> [모델 및 가격 책정 문서](/docs/ko/about-claude/models)에서 자세히 알아보세요.

_<sup>* - Opus 4.1은 `temperature` 및 `top_p` 매개변수를 모두 지정하는 것을 허용하지 않습니다. 하나만 사용하세요. </sup>_

### 2025년 7월 28일
- `text_editor_20250728`을 출시했습니다. 이전 버전의 일부 문제를 수정하고 큰 파일을 볼 때 잘림 길이를 제어할 수 있는 선택적 `max_characters` 매개변수를 추가하는 업데이트된 텍스트 편집기 도구입니다.

### 2025년 7월 24일
- Claude API의 Claude Opus 4에 대해 [속도 제한](/docs/ko/api/rate-limits)을 증가시켰습니다. Claude로 더 많은 용량을 구축하고 확장할 수 있습니다. [사용량 계층 1-4 속도 제한](/docs/ko/api/rate-limits#rate-limits)이 있는 고객의 경우, 이러한 변경 사항이 즉시 계정에 적용됩니다 - 조치가 필요하지 않습니다.

### 2025년 7월 21일
- Claude 2.0, Claude 2.1 및 Claude Sonnet 3 모델을 중단했습니다. 이러한 모델에 대한 모든 요청은 이제 오류를 반환합니다. [문서](/docs/ko/about-claude/model-deprecations)에서 자세히 알아보세요.

### 2025년 7월 17일
- Claude API의 Claude Sonnet 4에 대해 [속도 제한](/docs/ko/api/rate-limits)을 증가시켰습니다. Claude로 더 많은 용량을 구축하고 확장할 수 있습니다. [사용량 계층 1-4 속도 제한](/docs/ko/api/rate-limits#rate-limits)이 있는 고객의 경우, 이러한 변경 사항이 즉시 계정에 적용됩니다 - 조치가 필요하지 않습니다.

### 2025년 7월 3일
- 베타 버전의 검색 결과 콘텐츠 블록을 출시했습니다. RAG 애플리케이션에 대한 자연스러운 인용을 활성화합니다. 도구는 이제 적절한 출처 속성을 사용하여 검색 결과를 반환할 수 있으며, Claude는 자동으로 응답에서 이러한 출처를 인용합니다 - 웹 검색의 인용 품질과 일치합니다. 이는 사용자 정의 지식 기반 애플리케이션에서 문서 해결 방법의 필요성을 제거합니다. [검색 결과 문서](/docs/ko/build-with-claude/search-results)에서 자세히 알아보세요. 이 기능을 활성화하려면 베타 헤더 `search-results-2025-06-09`를 사용하세요.

### 2025년 6월 30일
- Claude Opus 3 모델의 지원 중단을 발표했습니다. [문서](/docs/ko/about-claude/model-deprecations)에서 자세히 알아보세요.

### 2025년 6월 23일
- 개발자 역할을 가진 콘솔 사용자는 이제 [비용](https://console.anthropic.com/settings/cost) 페이지에 액세스할 수 있습니다. 이전에는 개발자 역할이 [사용량](https://console.anthropic.com/settings/usage) 페이지에 대한 액세스를 허용했지만 비용 페이지는 허용하지 않았습니다.

### 2025년 6월 11일
- [세분화된 도구 스트리밍](/docs/ko/agents-and-tools/tool-use/fine-grained-tool-streaming)을 공개 베타로 출시했습니다. Claude가 버퍼링/JSON 검증 없이 도구 사용 매개변수를 스트리밍할 수 있는 기능입니다. 세분화된 도구 스트리밍을 활성화하려면 [베타 헤더](/docs/ko/api/beta-headers) `fine-grained-tool-streaming-2025-05-14`를 사용하세요.

### 2025년 5월 22일
- [Claude Opus 4 및 Claude Sonnet 4](http://www.anthropic.com/news/claude-4)를 출시했습니다. 확장된 사고 기능을 갖춘 최신 모델입니다. [모델 및 가격 책정 문서](/docs/ko/about-claude/models)에서 자세히 알아보세요.
- Claude 4 모델의 [확장된 사고](/docs/ko/build-with-claude/extended-thinking)의 기본 동작은 Claude의 전체 사고 프로세스의 요약을 반환하며, 전체 사고는 암호화되어 `thinking` 블록 출력의 `signature` 필드에 반환됩니다.
- [인터리브된 사고](/docs/ko/build-with-claude/extended-thinking#interleaved-thinking)를 공개 베타로 출시했습니다. Claude가 도구 호출 사이에 생각할 수 있는 기능입니다. 인터리브된 사고를 활성화하려면 [베타 헤더](/docs/ko/api/beta-headers) `interleaved-thinking-2025-05-14`를 사용하세요.
- [Files API](/docs/ko/build-with-claude/files)를 공개 베타로 출시했습니다. 파일을 업로드하고 Messages API 및 코드 실행 도구에서 참조할 수 있습니다.
- [코드 실행 도구](/docs/ko/agents-and-tools/tool-use/code-execution-tool)를 공개 베타로 출시했습니다. Claude가 안전한 샌드박스 환경에서 Python 코드를 실행할 수 있는 도구입니다.
- [MCP 커넥터](/docs/ko/agents-and-tools/mcp-connector)를 공개 베타로 출시했습니다. Messages API에서 직접 원격 MCP 서버에 연결할 수 있는 기능입니다.
- 답변 품질을 높이고 도구 오류를 줄이기 위해 Messages API의 `top_p` [핵 샘플링](https://en.wikipedia.org/wiki/Top-p_sampling) 매개변수의 기본값을 모든 모델에 대해 0.999에서 0.99로 변경했습니다. 이 변경을 되돌리려면 `top_p`를 0.999로 설정하세요.
    또한 확장된 사고가 활성화되면 이제 `top_p`를 0.95에서 1 사이의 값으로 설정할 수 있습니다.
- [Go SDK](https://github.com/anthropics/anthropic-sdk-go)를 베타에서 GA로 이동했습니다.
- 429 오류 속도와 함께 [사용량](https://console.anthropic.com/settings/usage) 페이지에 분 및 시간 수준 세분화를 포함했습니다.

### 2025년 5월 21일
- [Ruby SDK](https://github.com/anthropics/anthropic-sdk-ruby)를 베타에서 GA로 이동했습니다.

### 2025년 5월 7일
- API에서 웹 검색 도구를 출시했습니다. Claude가 웹에서 최신 정보에 액세스할 수 있습니다. [웹 검색 도구 문서](/docs/ko/agents-and-tools/tool-use/web-search-tool)에서 자세히 알아보세요.

### 2025년 5월 1일
- 캐시 제어는 이제 `tool_result` 및 `document.source`의 부모 `content` 블록에서 직접 지정해야 합니다. 하위 호환성을 위해 캐시 제어가 `tool_result.content` 또는 `document.source.content`의 마지막 블록에서 감지되면 자동으로 부모 블록에 적용됩니다. `tool_result.content` 및 `document.source.content` 내의 다른 블록에 대한 캐시 제어는 검증 오류를 초래합니다.

### 2025년 4월 9일
- [Ruby SDK](https://github.com/anthropics/anthropic-sdk-ruby)의 베타 버전을 출시했습니다.

### 2025년 3월 31일
- [Java SDK](https://github.com/anthropics/anthropic-sdk-java)를 베타에서 GA로 이동했습니다.
- [Go SDK](https://github.com/anthropics/anthropic-sdk-go)를 알파에서 베타로 이동했습니다.

### 2025년 2월 27일
- Messages API에서 이미지 및 PDF에 대한 URL 소스 블록을 추가했습니다. 이제 이미지 및 PDF를 base64로 인코딩할 필요 없이 URL을 통해 직접 참조할 수 있습니다. [비전 문서](/docs/ko/build-with-claude/vision) 및 [PDF 지원 문서](/docs/ko/build-with-claude/pdf-support)에서 자세히 알아보세요.
- Messages API의 `tool_choice` 매개변수에 `none` 옵션에 대한 지원을 추가했습니다. Claude가 도구를 호출하지 않도록 방지합니다. 또한 `tool_use` 및 `tool_result` 블록을 포함할 때 더 이상 `tools`를 제공할 필요가 없습니다.
- OpenAI 호환 API 엔드포인트를 출시했습니다. 기존 OpenAI 통합에서 API 키, 기본 URL 및 모델 이름만 변경하여 Claude 모델을 테스트할 수 있습니다. 이 호환성 계층은 핵심 채팅 완료 기능을 지원합니다. [OpenAI SDK 호환성 문서](/docs/ko/api/openai-sdk)에서 자세히 알아보세요.

### 2025년 2월 24일
- [Claude Sonnet 3.7](http://www.anthropic.com/news/claude-3-7-sonnet)을 출시했습니다. 지금까지 가장 지능형 모델입니다. Claude Sonnet 3.7은 거의 즉각적인 응답을 생성하거나 확장된 사고를 단계별로 표시할 수 있습니다. 하나의 모델, 두 가지 사고 방식입니다. [모델 및 가격 책정 문서](/docs/ko/about-claude/models)에서 모든 Claude 모델에 대해 자세히 알아보세요.
- Claude Haiku 3.5에 비전 지원을 추가했습니다. 모델이 이미지를 분석하고 이해할 수 있습니다.
- 토큰 효율적인 도구 사용 구현을 출시했습니다. Claude로 도구를 사용할 때 전체 성능을 개선합니다. [도구 사용 문서](/docs/ko/agents-and-tools/tool-use/overview)에서 자세히 알아보세요.
- [콘솔](https://console.anthropic.com/workbench)의 새 프롬프트에 대한 기본 온도를 0에서 1로 변경했습니다. API의 기본 온도와 일치합니다. 기존 저장된 프롬프트는 변경되지 않습니다.
- 컴퓨터 사용 시스템 프롬프트에서 텍스트 편집 및 bash 도구를 분리하는 업데이트된 도구 버전을 출시했습니다:
  - `bash_20250124`: 이전 버전과 동일한 기능이지만 컴퓨터 사용과 독립적입니다. 베타 헤더가 필요하지 않습니다.
  - `text_editor_20250124`: 이전 버전과 동일한 기능이지만 컴퓨터 사용과 독립적입니다. 베타 헤더가 필요하지 않습니다.
  - `computer_20250124`: "hold_key", "left_mouse_down", "left_mouse_up", "scroll", "triple_click" 및 "wait"를 포함한 새로운 명령 옵션이 있는 업데이트된 컴퓨터 사용 도구입니다. 이 도구는 "computer-use-2025-01-24" anthropic-beta 헤더가 필요합니다.
  [도구 사용 문서](/docs/ko/agents-and-tools/tool-use/overview)에서 자세히 알아보세요.

### 2025년 2월 10일
- 모든 API 응답에 `anthropic-organization-id` 응답 헤더를 추가했습니다. 이 헤더는 요청에 사용된 API 키와 관련된 조직 ID를 제공합니다.

### 2025년 1월 31일

- [Java SDK](https://github.com/anthropics/anthropic-sdk-java)를 알파에서 베타로 이동했습니다.

### 2025년 1월 23일

- API에서 인용 기능을 출시했습니다. Claude가 정보에 대한 출처 속성을 제공할 수 있습니다. [인용 문서](/docs/ko/build-with-claude/citations)에서 자세히 알아보세요.
- Messages API에서 일반 텍스트 문서 및 사용자 정의 콘텐츠 문서에 대한 지원을 추가했습니다.

### 2025년 1월 21일

- Claude 2, Claude 2.1 및 Claude Sonnet 3 모델의 지원 중단을 발표했습니다. [문서](/docs/ko/about-claude/model-deprecations)에서 자세히 알아보세요.

### 2025년 1월 15일

- [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)을 더 쉽게 사용할 수 있도록 업데이트했습니다. 이제 캐시 중단점을 설정하면 가장 긴 이전에 캐시된 접두사에서 자동으로 읽습니다.
- 도구를 사용할 때 Claude의 입에 단어를 넣을 수 있습니다.

### 2025년 1월 10일

- [Message Batches API의 프롬프트 캐싱](/docs/ko/build-with-claude/batch-processing#using-prompt-caching-with-message-batches)에 대한 지원을 최적화했습니다. 캐시 히트율을 개선합니다.

### 2024년 12월 19일

- Message Batches API에 [삭제 엔드포인트](/docs/ko/api/deleting-message-batches)에 대한 지원을 추가했습니다.

### 2024년 12월 17일
다음 기능은 이제 Claude API에서 일반적으로 사용 가능합니다:

- [모델 API](/docs/ko/api/models-list): 사용 가능한 모델을 쿼리하고, 모델 ID를 검증하고, [모델 별칭](/docs/ko/about-claude/models#model-names)을 정규 모델 ID로 확인합니다.
- [Message Batches API](/docs/ko/build-with-claude/batch-processing): 표준 API 비용의 50%로 대량의 메시지를 비동기적으로 처리합니다.
- [토큰 계산 API](/docs/ko/build-with-claude/token-counting): Claude로 보내기 전에 메시지의 토큰 수를 계산합니다.
- [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching): 프롬프트 콘텐츠를 캐싱하고 재사용하여 비용을 최대 90%, 지연 시간을 최대 80% 줄입니다.
- [PDF 지원](/docs/ko/build-with-claude/pdf-support): PDF를 처리하여 문서 내의 텍스트 및 시각적 콘텐츠를 분석합니다.

또한 새로운 공식 SDK를 출시했습니다:
- [Java SDK](https://github.com/anthropics/anthropic-sdk-java) (알파)
- [Go SDK](https://github.com/anthropics/anthropic-sdk-go) (알파)

### 2024년 12월 4일

- [사용량](https://console.anthropic.com/settings/usage) 및 [비용](https://console.anthropic.com/settings/cost) 페이지에 API 키별로 그룹화하는 기능을 추가했습니다. [개발자 콘솔](https://console.anthropic.com)
- [개발자 콘솔](https://console.anthropic.com)의 [API 키](https://console.anthropic.com/settings/keys) 페이지에 두 개의 새로운 **마지막 사용 시간** 및 **비용** 열과 모든 열로 정렬하는 기능을 추가했습니다.

### 2024년 11월 21일

- [Admin API](/docs/ko/build-with-claude/administration-api)를 출시했습니다. 사용자가 조직의 리소스를 프로그래밍 방식으로 관리할 수 있습니다.

### 2024년 11월 20일

- Messages API의 속도 제한을 업데이트했습니다. 분당 토큰 속도 제한을 분당 입력 및 출력 토큰 속도 제한으로 대체했습니다. [문서](/docs/ko/api/rate-limits)에서 자세히 알아보세요.
- [Workbench](https://console.anthropic.com/workbench)에 [도구 사용](/docs/ko/agents-and-tools/tool-use/overview)에 대한 지원을 추가했습니다.

### 2024년 11월 13일

- 모든 Claude Sonnet 3.5 모델에 PDF 지원을 추가했습니다. [문서](/docs/ko/build-with-claude/pdf-support)에서 자세히 알아보세요.

### 2024년 11월 6일

- Claude 1 및 Instant 모델을 중단했습니다. [문서](/docs/ko/about-claude/model-deprecations)에서 자세히 알아보세요.

### 2024년 11월 4일

- [Claude Haiku 3.5](https://www.anthropic.com/claude/haiku)는 이제 Claude API에서 텍스트 전용 모델로 사용 가능합니다.

### 2024년 11월 1일

- 새로운 Claude Sonnet 3.5와 함께 사용하기 위해 PDF 지원을 추가했습니다. [문서](/docs/ko/build-with-claude/pdf-support)에서 자세히 알아보세요.
- 또한 토큰 계산을 추가했습니다. 이를 통해 Claude로 보내기 전에 메시지의 총 토큰 수를 결정할 수 있습니다. [문서](/docs/ko/build-with-claude/token-counting)에서 자세히 알아보세요.

### 2024년 10월 22일

- 새로운 Claude Sonnet 3.5와 함께 사용하기 위해 Anthropic 정의 컴퓨터 사용 도구를 API에 추가했습니다. [문서](/docs/ko/agents-and-tools/tool-use/computer-use-tool)에서 자세히 알아보세요.
- Claude Sonnet 3.5, 지금까지 가장 지능형 모델이 업그레이드되었으며 이제 Claude API에서 사용 가능합니다. [여기](https://www.anthropic.com/claude/sonnet)에서 자세히 알아보세요.

### 2024년 10월 8일

- Message Batches API는 이제 베타로 사용 가능합니다. Claude API에서 대량의 쿼리를 비동기적으로 처리하여 50% 비용 절감을 합니다. [문서](/docs/ko/build-with-claude/batch-processing)에서 자세히 알아보세요.
- Messages API에서 `user`/`assistant` 턴의 순서 제한을 완화했습니다. 연속된 `user`/`assistant` 메시지는 오류 대신 단일 메시지로 결합되며, 더 이상 첫 번째 입력 메시지가 `user` 메시지여야 합니다.
- Build 및 Scale 계획을 표준 기능 세트(이전에 Build라고 함)로 대체하고 판매를 통해 사용 가능한 추가 기능으로 지원 중단했습니다. [여기](https://claude.com/platform/api)에서 자세히 알아보세요.

### 2024년 10월 3일

- API에서 병렬 도구 사용을 비활성화하는 기능을 추가했습니다. `tool_choice` 필드에서 `disable_parallel_tool_use: true`를 설정하여 Claude가 최대 하나의 도구를 사용하도록 합니다. [문서](/docs/ko/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use)에서 자세히 알아보세요.

### 2024년 9월 10일

- [개발자 콘솔](https://console.anthropic.com)에 Workspaces를 추가했습니다. Workspaces를 통해 사용자 정의 지출 또는 속도 제한을 설정하고, API 키를 그룹화하고, 프로젝트별로 사용량을 추적하고, 사용자 역할로 액세스를 제어할 수 있습니다. [블로그 게시물](https://www.anthropic.com/news/workspaces)에서 자세히 알아보세요.

### 2024년 9월 4일

- Claude 1 모델의 지원 중단을 발표했습니다. [문서](/docs/ko/about-claude/model-deprecations)에서 자세히 알아보세요.

### 2024년 8월 22일

- API 응답에서 CORS 헤더를 반환하여 브라우저에서 SDK를 사용할 수 있도록 지원을 추가했습니다. SDK 인스턴스화에서 `dangerouslyAllowBrowser: true`를 설정하여 이 기능을 활성화합니다.

### 2024년 8월 19일

- Claude Sonnet 3.5에 대해 8,192 토큰 출력을 베타에서 일반 가용성으로 이동했습니다.

### 2024년 8월 14일

- [프롬프트 캐싱](/docs/ko/build-with-claude/prompt-caching)은 이제 Claude API에서 베타 기능으로 사용 가능합니다. 프롬프트를 캐싱하고 재사용하여 지연 시간을 최대 80%, 비용을 최대 90% 줄입니다.

### 2024년 7월 15일

- 새로운 `anthropic-beta: max-tokens-3-5-sonnet-2024-07-15` 헤더를 사용하여 Claude Sonnet 3.5에서 최대 8,192 토큰 길이의 출력을 생성합니다.

### 2024년 7월 9일

- [개발자 콘솔](https://console.anthropic.com)에서 Claude를 사용하여 프롬프트에 대한 테스트 케이스를 자동으로 생성합니다.
- [개발자 콘솔](https://console.anthropic.com)의 새로운 출력 비교 모드에서 다양한 프롬프트의 출력을 나란히 비교합니다.

### 2024년 6월 27일

- [개발자 콘솔](https://console.anthropic.com)의 새로운 [사용량](https://console.anthropic.com/settings/usage) 및 [비용](https://console.anthropic.com/settings/cost) 탭에서 달러 금액, 토큰 수 및 API 키별로 분류된 API 사용량 및 청구를 봅니다.
- [개발자 콘솔](https://console.anthropic.com)의 새로운 [속도 제한](https://console.anthropic.com/settings/limits) 탭에서 현재 API 속도 제한을 봅니다.

### 2024년 6월 20일

- [Claude Sonnet 3.5](http://anthropic.com/news/claude-3-5-sonnet), 지금까지 가장 지능형 모델이 이제 Claude API, Amazon Bedrock 및 Google Vertex AI 전체에서 일반적으로 사용 가능합니다.

### 2024년 5월 30일

- [도구 사용](/docs/ko/agents-and-tools/tool-use/overview)은 이제 Claude API, Amazon Bedrock 및 Google Vertex AI 전체에서 일반적으로 사용 가능합니다.

### 2024년 5월 10일

- 프롬프트 생성기 도구는 이제 [개발자 콘솔](https://console.anthropic.com)에서 사용 가능합니다. 프롬프트 생성기를 통해 특정 작업에 맞춘 고품질 프롬프트를 생성하도록 Claude를 쉽게 안내할 수 있습니다. [블로그 게시물](https://www.anthropic.com/news/prompt-generator)에서 자세히 알아보세요.