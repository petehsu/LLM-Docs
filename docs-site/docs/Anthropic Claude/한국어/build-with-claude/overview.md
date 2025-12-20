# 기능 개요

Claude의 고급 기능 및 역량을 살펴보세요.

---

## 핵심 기능

이러한 기능들은 다양한 형식과 사용 사례에 걸쳐 콘텐츠를 처리, 분석 및 생성하기 위한 Claude의 기본 능력을 향상시킵니다.

| Feature | Description | Availability |
|---------|-------------|--------------|
| [1M token context window](/docs/ko/build-with-claude/context-windows#1m-token-context-window) | 훨씬 더 큰 문서를 처리하고, 더 긴 대화를 유지하며, 더 광범위한 코드베이스로 작업할 수 있게 해주는 확장된 컨텍스트 윈도우입니다. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Agent Skills](/docs/ko/agents-and-tools/agent-skills/overview) | Skills로 Claude의 기능을 확장하세요. 사전 구축된 Skills(PowerPoint, Excel, Word, PDF)를 사용하거나 지침 및 스크립트를 포함한 사용자 정의 Skills를 만드세요. Skills는 점진적 공개를 사용하여 컨텍스트를 효율적으로 관리합니다. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Batch processing](/docs/ko/build-with-claude/batch-processing) | 비용 절감을 위해 대량의 요청을 비동기적으로 처리하세요. 배치당 많은 수의 쿼리를 포함한 배치를 전송하세요. Batch API 호출 비용은 표준 API 호출보다 50% 저렴합니다. | <PlatformAvailability claudeApi bedrock vertexAi /> |
| [Citations](/docs/ko/build-with-claude/citations) | Claude의 응답을 소스 문서에 기반하게 하세요. Citations를 사용하면 Claude는 응답을 생성하기 위해 사용하는 정확한 문장과 구절에 대한 자세한 참조를 제공할 수 있어 더욱 검증 가능하고 신뢰할 수 있는 출력을 생성합니다. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Context editing](/docs/ko/build-with-claude/context-editing) | 구성 가능한 전략으로 대화 컨텍스트를 자동으로 관리하세요. 토큰 한계에 접근할 때 도구 결과 삭제 및 확장 사고 대화에서 사고 블록 관리를 지원합니다. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Effort](/docs/ko/build-with-claude/effort) | effort 매개변수를 사용하여 Claude가 응답할 때 사용하는 토큰 수를 제어하고, 응답 완전성과 토큰 효율성 간의 균형을 맞추세요. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Extended thinking](/docs/ko/build-with-claude/extended-thinking) | 복잡한 작업을 위한 향상된 추론 기능으로, 최종 답변을 제공하기 전에 Claude의 단계별 사고 과정에 대한 투명성을 제공합니다. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Files API](/docs/ko/build-with-claude/files) | Claude와 함께 사용할 파일을 업로드하고 관리하여 각 요청마다 콘텐츠를 다시 업로드할 필요가 없습니다. PDF, 이미지 및 텍스트 파일을 지원합니다. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [PDF support](/docs/ko/build-with-claude/pdf-support) | PDF 문서에서 텍스트 및 시각적 콘텐츠를 처리하고 분석하세요. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Prompt caching (5m)](/docs/ko/build-with-claude/prompt-caching) | Claude에 더 많은 배경 지식과 예제 출력을 제공하여 비용과 지연 시간을 줄이세요. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Prompt caching (1hr)](/docs/ko/build-with-claude/prompt-caching#1-hour-cache-duration) | 덜 자주 액세스되지만 중요한 컨텍스트를 위한 확장된 1시간 캐시 지속 시간으로, 표준 5분 캐시를 보완합니다. | <PlatformAvailability claudeApi azureAi /> |
| [Search results](/docs/ko/build-with-claude/search-results) | 적절한 소스 속성을 포함한 검색 결과를 제공하여 RAG 애플리케이션에 대한 자연스러운 인용을 활성화하세요. 사용자 정의 지식 기반 및 도구에 대해 웹 검색 품질의 인용을 달성하세요. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Structured outputs](/docs/ko/build-with-claude/structured-outputs) | 두 가지 접근 방식으로 스키마 준수를 보장하세요: 구조화된 데이터 응답을 위한 JSON 출력 및 검증된 도구 입력을 위한 엄격한 도구 사용. Sonnet 4.5, Opus 4.1, Opus 4.5 및 Haiku 4.5에서 사용 가능합니다. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Token counting](/docs/ko/api/messages-count-tokens) | 토큰 계산을 통해 Claude에 메시지를 보내기 전에 메시지의 토큰 수를 결정할 수 있으므로 프롬프트 및 사용량에 대해 정보에 입각한 결정을 내릴 수 있습니다. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Tool use](/docs/ko/agents-and-tools/tool-use/overview) | Claude가 외부 도구 및 API와 상호 작용하여 더 다양한 작업을 수행할 수 있게 하세요. 지원되는 도구 목록은 [도구 표](#tools)를 참조하세요. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |

## 도구

이러한 기능들은 Claude가 외부 시스템과 상호 작용하고, 코드를 실행하며, 다양한 도구 인터페이스를 통해 자동화된 작업을 수행할 수 있게 합니다.

| Feature | Description | Availability |
|---------|-------------|--------------|
| [Bash](/docs/ko/agents-and-tools/tool-use/bash-tool) | bash 명령 및 스크립트를 실행하여 시스템 셸과 상호 작용하고 명령줄 작업을 수행하세요. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Code execution](/docs/ko/agents-and-tools/tool-use/code-execution-tool) | 고급 데이터 분석을 위해 샌드박스 환경에서 Python 코드를 실행하세요. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Programmatic tool calling](/docs/ko/agents-and-tools/tool-use/programmatic-tool-calling) | Claude가 코드 실행 컨테이너 내에서 프로그래밍 방식으로 도구를 호출할 수 있게 하여 다중 도구 워크플로우의 지연 시간과 토큰 소비를 줄이세요. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Computer use](/docs/ko/agents-and-tools/tool-use/computer-use-tool) | 스크린샷을 찍고 마우스 및 키보드 명령을 실행하여 컴퓨터 인터페이스를 제어하세요. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Fine-grained tool streaming](/docs/ko/agents-and-tools/tool-use/fine-grained-tool-streaming) | 버퍼링/JSON 검증 없이 도구 사용 매개변수를 스트리밍하여 큰 매개변수를 수신하는 지연 시간을 줄이세요. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [MCP connector](/docs/ko/agents-and-tools/mcp-connector) | 별도의 MCP 클라이언트 없이 Messages API에서 직접 원격 [MCP](/docs/ko/mcp) 서버에 연결하세요. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Memory](/docs/ko/agents-and-tools/tool-use/memory-tool) | Claude가 대화 간에 정보를 저장하고 검색할 수 있게 하세요. 시간이 지남에 따라 지식 기반을 구축하고, 프로젝트 컨텍스트를 유지하며, 과거 상호 작용에서 학습하세요. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Text editor](/docs/ko/agents-and-tools/tool-use/text-editor-tool) | 파일 조작 작업을 위해 기본 제공 텍스트 편집기 인터페이스를 사용하여 텍스트 파일을 만들고 편집하세요. | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Tool search](/docs/ko/agents-and-tools/tool-use/tool-search-tool) | 정규식 기반 검색을 사용하여 동적으로 도구를 발견하고 필요에 따라 로드하여 수천 개의 도구로 확장하고, 컨텍스트 사용을 최적화하며, 도구 선택 정확도를 개선하세요. | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Web fetch](/docs/ko/agents-and-tools/tool-use/web-fetch-tool) | 심층 분석을 위해 지정된 웹 페이지 및 PDF 문서에서 전체 콘텐츠를 검색하세요. | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Web search](/docs/ko/agents-and-tools/tool-use/web-search-tool) | Claude의 포괄적인 지식을 웹 전체의 현재 실제 데이터로 보강하세요. | <PlatformAvailability claudeApi vertexAi azureAi /> |