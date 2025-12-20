# Agent Skills

Agent Skills는 Claude의 기능을 확장하는 모듈식 기능입니다. 각 Skill은 지침, 메타데이터 및 선택적 리소스(스크립트, 템플릿)를 패키징하며, Claude는 관련이 있을 때 자동으로 이를 사용합니다.

---

## Skills를 사용하는 이유

Skills는 Claude에 도메인 특화 전문성을 제공하는 재사용 가능한 파일시스템 기반 리소스입니다: 워크플로우, 컨텍스트 및 모범 사례는 범용 에이전트를 전문가로 변환합니다. 프롬프트(일회성 작업을 위한 대화 수준의 지침)와 달리, Skills는 필요에 따라 로드되며 여러 대화에서 동일한 지침을 반복적으로 제공할 필요가 없습니다.

**주요 이점**:
- **Claude 전문화**: 도메인 특화 작업을 위한 기능 맞춤화
- **반복 감소**: 한 번 생성하고 자동으로 사용
- **기능 구성**: Skills를 결합하여 복잡한 워크플로우 구축

<Note>
Agent Skills의 아키텍처 및 실제 응용 프로그램에 대한 심층 분석을 위해 엔지니어링 블로그를 읽으세요: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

## Skills 사용

Anthropic은 일반적인 문서 작업(PowerPoint, Excel, Word, PDF)을 위한 사전 구축된 Agent Skills를 제공하며, 사용자 정의 Skills를 만들 수 있습니다. 둘 다 동일한 방식으로 작동합니다. Claude는 요청과 관련이 있을 때 자동으로 이를 사용합니다.

**사전 구축된 Agent Skills**는 claude.ai의 모든 사용자와 Claude API를 통해 사용할 수 있습니다. 전체 목록은 아래의 [사용 가능한 Skills](#available-skills) 섹션을 참조하세요.

**사용자 정의 Skills**를 사용하면 도메인 전문성과 조직 지식을 패키징할 수 있습니다. Claude의 모든 제품에서 사용 가능합니다: Claude Code에서 생성하거나, API를 통해 업로드하거나, claude.ai 설정에서 추가할 수 있습니다.

<Note>
**시작하기:**
- 사전 구축된 Agent Skills의 경우: [빠른 시작 튜토리얼](/docs/ko/agents-and-tools/agent-skills/quickstart)을 참조하여 API에서 PowerPoint, Excel, Word 및 PDF Skills 사용을 시작하세요
- 사용자 정의 Skills의 경우: [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)을 참조하여 자신의 Skills를 만드는 방법을 알아보세요
</Note>

## Skills 작동 방식

Skills는 Claude의 VM 환경을 활용하여 프롬프트만으로는 불가능한 기능을 제공합니다. Claude는 파일시스템 액세스가 있는 가상 머신에서 작동하므로, Skills는 지침, 실행 가능한 코드 및 참고 자료를 포함하는 디렉토리로 존재하며, 새로운 팀 멤버를 위해 만드는 온보딩 가이드처럼 구성됩니다.

이 파일시스템 기반 아키텍처는 **점진적 공개**를 가능하게 합니다: Claude는 컨텍스트를 미리 소비하기보다는 필요에 따라 단계적으로 정보를 로드합니다.

### 세 가지 유형의 Skill 콘텐츠, 세 가지 로딩 수준

Skills는 세 가지 유형의 콘텐츠를 포함할 수 있으며, 각각 다른 시간에 로드됩니다:

### 수준 1: 메타데이터 (항상 로드됨)

**콘텐츠 유형: 지침**. Skill의 YAML 프론트매터는 검색 정보를 제공합니다:

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
---
```

Claude는 시작 시 이 메타데이터를 로드하고 시스템 프롬프트에 포함합니다. 이 경량 접근 방식은 많은 Skills를 설치해도 컨텍스트 페널티가 없음을 의미합니다. Claude는 각 Skill이 존재하고 언제 사용할지만 알면 됩니다.

### 수준 2: 지침 (트리거될 때 로드됨)

**콘텐츠 유형: 지침**. SKILL.md의 본문에는 절차적 지식이 포함됩니다: 워크플로우, 모범 사례 및 지침:

````markdown
# PDF Processing

## Quick start

Use pdfplumber to extract text from PDFs:

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For advanced form filling, see [FORMS.md](FORMS.md).
````

Skill의 설명과 일치하는 항목을 요청하면 Claude는 bash를 통해 파일시스템에서 SKILL.md를 읽습니다. 그제야 이 콘텐츠가 컨텍스트 윈도우에 들어갑니다.

### 수준 3: 리소스 및 코드 (필요에 따라 로드됨)

**콘텐츠 유형: 지침, 코드 및 리소스**. Skills는 추가 자료를 번들로 제공할 수 있습니다:

```
pdf-skill/
├── SKILL.md (main instructions)
├── FORMS.md (form-filling guide)
├── REFERENCE.md (detailed API reference)
└── scripts/
    └── fill_form.py (utility script)
```

**지침**: 특화된 지침과 워크플로우를 포함하는 추가 마크다운 파일(FORMS.md, REFERENCE.md)

**코드**: Claude가 bash를 통해 실행하는 실행 가능한 스크립트(fill_form.py, validate.py); 스크립트는 컨텍스트를 소비하지 않고 결정론적 작업을 제공합니다

**리소스**: 데이터베이스 스키마, API 문서, 템플릿 또는 예제와 같은 참고 자료

Claude는 참조될 때만 이러한 파일에 액세스합니다. 파일시스템 모델은 각 콘텐츠 유형이 다른 강점을 가짐을 의미합니다: 유연한 지침을 위한 지침, 신뢰성을 위한 코드, 사실 조회를 위한 리소스.

| 수준 | 로드 시기 | 토큰 비용 | 콘텐츠 |
|---|---|---|---|
| **수준 1: 메타데이터** | 항상 (시작 시) | Skill당 약 100 토큰 | YAML 프론트매터의 `name` 및 `description` |
| **수준 2: 지침** | Skill이 트리거될 때 | 5k 토큰 미만 | 지침 및 지침이 포함된 SKILL.md 본문 |
| **수준 3+: 리소스** | 필요에 따라 | 사실상 무제한 | bash를 통해 실행되는 번들 파일로 컨텍스트에 로드되지 않음 |

점진적 공개는 주어진 시간에 관련 콘텐츠만 컨텍스트 윈도우를 차지하도록 보장합니다.

### Skills 아키텍처

Skills는 Claude가 파일시스템 액세스, bash 명령 및 코드 실행 기능을 가진 코드 실행 환경에서 실행됩니다. 이렇게 생각해보세요: Skills는 가상 머신의 디렉토리로 존재하며, Claude는 컴퓨터의 파일을 탐색하는 데 사용하는 것과 동일한 bash 명령을 사용하여 이들과 상호 작용합니다.

![Agent Skills 아키텍처 - Skills가 에이전트의 구성 및 가상 머신과 어떻게 통합되는지 보여줍니다](/docs/images/agent-skills-architecture.png)

**Claude가 Skill 콘텐츠에 액세스하는 방법:**

Skill이 트리거되면 Claude는 bash를 사용하여 파일시스템에서 SKILL.md를 읽고 해당 지침을 컨텍스트 윈도우로 가져옵니다. 이러한 지침이 다른 파일(예: FORMS.md 또는 데이터베이스 스키마)을 참조하면 Claude는 추가 bash 명령을 사용하여 해당 파일도 읽습니다. 지침이 실행 가능한 스크립트를 언급하면 Claude는 bash를 통해 이를 실행하고 출력만 받습니다(스크립트 코드 자체는 컨텍스트에 들어가지 않음).

**이 아키텍처가 가능하게 하는 것:**

**온디맨드 파일 액세스**: Claude는 각 특정 작업에 필요한 파일만 읽습니다. Skill에는 수십 개의 참고 파일이 포함될 수 있지만, 작업에 판매 스키마만 필요하면 Claude는 해당 파일만 로드합니다. 나머지는 파일시스템에 남아 0 토큰을 소비합니다.

**효율적인 스크립트 실행**: Claude가 `validate_form.py`를 실행할 때 스크립트의 코드는 컨텍스트 윈도우에 로드되지 않습니다. 스크립트의 출력만(예: "검증 통과" 또는 특정 오류 메시지) 토큰을 소비합니다. 이는 Claude가 즉석에서 동등한 코드를 생성하는 것보다 스크립트를 훨씬 더 효율적으로 만듭니다.

**번들된 콘텐츠에 대한 실질적 제한 없음**: 파일이 액세스될 때까지 컨텍스트를 소비하지 않으므로 Skills는 포괄적인 API 문서, 대규모 데이터 세트, 광범위한 예제 또는 필요한 모든 참고 자료를 포함할 수 있습니다. 사용되지 않는 번들된 콘텐츠에 대한 컨텍스트 페널티가 없습니다.

이 파일시스템 기반 모델은 점진적 공개가 작동하는 이유입니다. Claude는 온보딩 가이드의 특정 섹션을 참조하는 것처럼 Skill을 탐색하여 각 작업에 필요한 것을 정확히 액세스합니다.

### 예제: PDF 처리 Skill 로드

Claude가 PDF 처리 Skill을 로드하고 사용하는 방법은 다음과 같습니다:

1. **시작**: 시스템 프롬프트에 포함: `PDF Processing - Extract text and tables from PDF files, fill forms, merge documents`
2. **사용자 요청**: "이 PDF에서 텍스트를 추출하고 요약해주세요"
3. **Claude 호출**: `bash: read pdf-skill/SKILL.md` → 지침이 컨텍스트에 로드됨
4. **Claude 결정**: 양식 채우기가 필요하지 않으므로 FORMS.md는 읽지 않음
5. **Claude 실행**: SKILL.md의 지침을 사용하여 작업 완료

![Skills가 컨텍스트 윈도우에 로드됨 - Skill 메타데이터 및 콘텐츠의 점진적 로드를 보여줍니다](/docs/images/agent-skills-context-window.png)

다이어그램은 다음을 보여줍니다:
1. 시스템 프롬프트 및 Skill 메타데이터가 미리 로드된 기본 상태
2. Claude가 bash를 통해 SKILL.md를 읽어 Skill을 트리거
3. Claude가 필요에 따라 FORMS.md와 같은 추가 번들 파일을 선택적으로 읽음
4. Claude가 작업을 진행

이 동적 로딩은 관련 Skill 콘텐츠만 컨텍스트 윈도우를 차지하도록 보장합니다.

## Skills가 작동하는 위치

Skills는 Claude의 에이전트 제품 전체에서 사용 가능합니다:

### Claude API

Claude API는 사전 구축된 Agent Skills와 사용자 정의 Skills를 모두 지원합니다. 둘 다 동일하게 작동합니다: `container` 매개변수에서 관련 `skill_id`를 코드 실행 도구와 함께 지정합니다.

**필수 조건**: API를 통해 Skills를 사용하려면 세 가지 베타 헤더가 필요합니다:
- `code-execution-2025-08-25` - Skills가 코드 실행 컨테이너에서 실행됨
- `skills-2025-10-02` - Skills 기능 활성화
- `files-api-2025-04-14` - 컨테이너에서 파일 업로드/다운로드에 필요

`skill_id`(예: `pptx`, `xlsx`)를 참조하여 사전 구축된 Agent Skills를 사용하거나, Skills API(`/v1/skills` 엔드포인트)를 통해 자신의 것을 만들고 업로드하세요. 사용자 정의 Skills는 조직 전체에서 공유됩니다.

자세히 알아보려면 [Claude API와 함께 Skills 사용](/docs/ko/build-with-claude/skills-guide)을 참조하세요.

### Claude Code

[Claude Code](https://code.claude.com/docs/overview)는 사용자 정의 Skills만 지원합니다.

**사용자 정의 Skills**: SKILL.md 파일이 있는 디렉토리로 Skills를 만듭니다. Claude는 이를 자동으로 발견하고 사용합니다.

Claude Code의 사용자 정의 Skills는 파일시스템 기반이며 API 업로드가 필요하지 않습니다.

자세히 알아보려면 [Claude Code에서 Skills 사용](https://code.claude.com/docs/skills)을 참조하세요.

### Claude Agent SDK

[Claude Agent SDK](/docs/ko/agent-sdk/overview)는 파일시스템 기반 구성을 통해 사용자 정의 Skills를 지원합니다.

**사용자 정의 Skills**: `.claude/skills/`에 SKILL.md 파일이 있는 디렉토리로 Skills를 만듭니다. `allowed_tools` 구성에 `"Skill"`을 포함하여 Skills를 활성화합니다.

SDK의 Skills는 SDK가 실행될 때 자동으로 발견됩니다.

자세히 알아보려면 [SDK의 Agent Skills](/docs/ko/agent-sdk/skills)를 참조하세요.

### Claude.ai

[Claude.ai](https://claude.ai)는 사전 구축된 Agent Skills와 사용자 정의 Skills를 모두 지원합니다.

**사전 구축된 Agent Skills**: 이러한 Skills는 문서를 만들 때 이미 백그라운드에서 작동합니다. Claude는 설정이 필요 없이 이를 사용합니다.

**사용자 정의 Skills**: 설정 > 기능을 통해 zip 파일로 자신의 Skills를 업로드합니다. 코드 실행이 활성화된 Pro, Max, Team 및 Enterprise 플랜에서 사용 가능합니다. 사용자 정의 Skills는 각 사용자에게 개별적이며, 조직 전체에서 공유되지 않으며 관리자가 중앙에서 관리할 수 없습니다.

Claude.ai에서 Skills 사용에 대해 자세히 알아보려면 Claude 도움말 센터의 다음 리소스를 참조하세요:
- [Skills란 무엇입니까?](https://support.claude.com/en/articles/12512176-what-are-skills)
- [Claude에서 Skills 사용](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [사용자 정의 Skills를 만드는 방법](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [Skills를 사용하여 Claude를 자신의 작업 방식으로 가르치기](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills)

## Skill 구조

모든 Skill에는 YAML 프론트매터가 있는 `SKILL.md` 파일이 필요합니다:

```yaml
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
[Clear, step-by-step guidance for Claude to follow]

## Examples
[Concrete examples of using this Skill]
```

**필수 필드**: `name` 및 `description`

**필드 요구 사항**:

`name`:
- 최대 64자
- 소문자, 숫자 및 하이픈만 포함해야 함
- XML 태그를 포함할 수 없음
- 예약어를 포함할 수 없음: "anthropic", "claude"

`description`:
- 비어 있지 않아야 함
- 최대 1024자
- XML 태그를 포함할 수 없음

`description`은 Skill이 수행하는 작업과 Claude가 언제 사용해야 하는지를 모두 포함해야 합니다. 완전한 작성 지침은 [모범 사례 가이드](/docs/ko/agents-and-tools/agent-skills/best-practices)를 참조하세요.

## 보안 고려 사항

Skills는 신뢰할 수 있는 출처(자신이 만들었거나 Anthropic에서 얻은 것)에서만 사용할 것을 강력히 권장합니다. Skills는 지침과 코드를 통해 Claude에 새로운 기능을 제공하며, 이는 이를 강력하게 만들지만, 악의적인 Skill이 Claude를 Skill의 명시된 목적과 일치하지 않는 방식으로 도구를 호출하거나 코드를 실행하도록 지시할 수 있음을 의미합니다.

<Warning>
신뢰할 수 없거나 알 수 없는 출처의 Skill을 사용해야 하는 경우 극도의 주의를 기울이고 사용하기 전에 철저히 감사하세요. Claude가 Skill을 실행할 때 어떤 액세스 권한을 가지는지에 따라 악의적인 Skills는 데이터 유출, 무단 시스템 액세스 또는 기타 보안 위험으로 이어질 수 있습니다.
</Warning>

**주요 보안 고려 사항**:
- **철저히 감사**: Skill에 번들된 모든 파일을 검토하세요: SKILL.md, 스크립트, 이미지 및 기타 리소스. 예상치 못한 네트워크 호출, 파일 액세스 패턴 또는 Skill의 명시된 목적과 일치하지 않는 작업과 같은 비정상적인 패턴을 찾으세요
- **외부 출처는 위험함**: 외부 URL에서 데이터를 가져오는 Skills는 특히 위험합니다. 가져온 콘텐츠에 악의적인 지침이 포함될 수 있기 때문입니다. 신뢰할 수 있는 Skills도 외부 종속성이 시간이 지남에 따라 변경되면 손상될 수 있습니다
- **도구 오용**: 악의적인 Skills는 도구(파일 작업, bash 명령, 코드 실행)를 해로운 방식으로 호출할 수 있습니다
- **데이터 노출**: 민감한 데이터에 액세스할 수 있는 Skills는 정보를 외부 시스템으로 유출하도록 설계될 수 있습니다
- **소프트웨어 설치처럼 취급**: 신뢰할 수 있는 출처의 Skills만 사용하세요. 민감한 데이터나 중요한 작업에 액세스할 수 있는 프로덕션 시스템에 Skills를 통합할 때 특히 주의하세요

## 사용 가능한 Skills

### 사전 구축된 Agent Skills

다음 사전 구축된 Agent Skills를 즉시 사용할 수 있습니다:

- **PowerPoint (pptx)**: 프레젠테이션 만들기, 슬라이드 편집, 프레젠테이션 콘텐츠 분석
- **Excel (xlsx)**: 스프레드시트 만들기, 데이터 분석, 차트가 있는 보고서 생성
- **Word (docx)**: 문서 만들기, 콘텐츠 편집, 텍스트 서식 지정
- **PDF (pdf)**: 형식이 지정된 PDF 문서 및 보고서 생성

이러한 Skills는 Claude API 및 claude.ai에서 사용할 수 있습니다. [빠른 시작 튜토리얼](/docs/ko/agents-and-tools/agent-skills/quickstart)을 참조하여 API에서 이를 사용하기 시작하세요.

### 사용자 정의 Skills 예제

사용자 정의 Skills의 완전한 예제는 [Skills cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)을 참조하세요.

## 제한 사항 및 제약

이러한 제한 사항을 이해하면 Skills 배포를 효과적으로 계획할 수 있습니다.

### 교차 표면 가용성

**사용자 정의 Skills는 표면 간에 동기화되지 않습니다**. 한 표면에 업로드된 Skills는 다른 표면에서 자동으로 사용할 수 없습니다:

- Claude.ai에 업로드된 Skills는 API에 별도로 업로드해야 함
- API를 통해 업로드된 Skills는 Claude.ai에서 사용할 수 없음
- Claude Code Skills는 파일시스템 기반이며 Claude.ai 및 API와 별개

Skills를 사용하려는 각 표면에 대해 별도로 관리하고 업로드해야 합니다.

### 공유 범위

Skills는 사용 위치에 따라 다른 공유 모델을 가집니다:
- **Claude.ai**: 개별 사용자만; 각 팀 멤버가 별도로 업로드해야 함
- **Claude API**: 작업 공간 전체; 모든 작업 공간 멤버가 업로드된 Skills에 액세스할 수 있음
- **Claude Code**: 개인(`~/.claude/skills/`) 또는 프로젝트 기반(`.claude/skills/`)

Claude.ai는 현재 사용자 정의 Skills의 중앙 집중식 관리자 관리 또는 조직 전체 배포를 지원하지 않습니다.

### 런타임 환경 제약

Skills는 다음 제한 사항이 있는 코드 실행 컨테이너에서 실행됩니다:

- **네트워크 액세스 없음**: Skills는 외부 API 호출을 하거나 인터넷에 액세스할 수 없습니다
- **런타임 패키지 설치 없음**: 미리 설치된 패키지만 사용 가능합니다. 실행 중에 새 패키지를 설치할 수 없습니다.
- **사전 구성된 종속성만**: 사용 가능한 패키지 목록은 [코드 실행 도구 문서](/docs/ko/agents-and-tools/tool-use/code-execution-tool)를 확인하세요

이러한 제약 내에서 작동하도록 Skills를 계획하세요.

## 다음 단계

<CardGroup cols={2}>
  <Card
    title="Agent Skills 시작하기"
    icon="graduation-cap"
    href="/docs/ko/agents-and-tools/agent-skills/quickstart"
  >
    첫 번째 Skill 만들기
  </Card>
  <Card
    title="API 가이드"
    icon="code"
    href="/docs/ko/build-with-claude/skills-guide"
  >
    Claude API와 함께 Skills 사용
  </Card>
  <Card
    title="Claude Code에서 Skills 사용"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    Claude Code에서 사용자 정의 Skills 만들기 및 관리
  </Card>
  <Card
    title="Agent SDK에서 Skills 사용"
    icon="cube"
    href="/docs/ko/agent-sdk/skills"
  >
    TypeScript 및 Python에서 프로그래밍 방식으로 Skills 사용
  </Card>
  <Card
    title="작성 모범 사례"
    icon="lightbulb"
    href="/docs/ko/agents-and-tools/agent-skills/best-practices"
  >
    Claude가 효과적으로 사용할 수 있는 Skills 작성
  </Card>
</CardGroup>