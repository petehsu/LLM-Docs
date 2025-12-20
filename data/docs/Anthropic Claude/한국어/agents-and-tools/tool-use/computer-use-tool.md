# 컴퓨터 사용 도구

Claude가 컴퓨터 환경과 상호작용할 수 있는 컴퓨터 사용 도구에 대해 알아보세요. 스크린샷 캡처 및 마우스/키보드 제어를 통한 자동 데스크톱 상호작용을 제공합니다.

---

Claude는 컴퓨터 사용 도구를 통해 컴퓨터 환경과 상호작용할 수 있으며, 이 도구는 자동 데스크톱 상호작용을 위한 스크린샷 기능과 마우스/키보드 제어를 제공합니다.

<Note>
컴퓨터 사용은 현재 베타 버전이며 [베타 헤더](/docs/ko/api/beta-headers)가 필요합니다:
- Claude Opus 4.5의 경우 `"computer-use-2025-11-24"`
- Claude Sonnet 4.5, Haiku 4.5, Opus 4.1, Sonnet 4, Opus 4, Sonnet 3.7의 경우 `"computer-use-2025-01-24"` ([지원 중단됨](/docs/ko/about-claude/model-deprecations))
</Note>

## 개요

컴퓨터 사용은 Claude가 데스크톱 환경과 상호작용할 수 있게 해주는 베타 기능입니다. 이 도구는 다음을 제공합니다:

- **스크린샷 캡처**: 현재 화면에 표시되는 내용 확인
- **마우스 제어**: 클릭, 드래그, 커서 이동
- **키보드 입력**: 텍스트 입력 및 키보드 단축키 사용
- **데스크톱 자동화**: 모든 애플리케이션 또는 인터페이스와 상호작용

컴퓨터 사용은 더 포괄적인 자동화 워크플로우를 위해 bash 및 텍스트 편집기와 같은 다른 도구로 보강될 수 있지만, 컴퓨터 사용은 특히 컴퓨터 사용 도구의 데스크톱 환경을 보고 제어하는 기능을 의미합니다.

## 모델 호환성

컴퓨터 사용은 다음 Claude 모델에서 사용 가능합니다:

| 모델 | 도구 버전 | 베타 플래그 |
|-------|--------------|-----------|
| Claude Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| 기타 모든 지원 모델 | `computer_20250124` | `computer-use-2025-01-24` |

<Note>
Claude Opus 4.5는 상세한 화면 영역 검사를 위한 줌 작업을 포함한 새로운 기능이 있는 `computer_20251124` 도구 버전을 도입합니다. 기타 모든 모델(Sonnet 4.5, Haiku 4.5, Sonnet 4, Opus 4, Opus 4.1, Sonnet 3.7)은 `computer_20250124` 도구 버전을 사용합니다.
</Note>

<Warning>
이전 도구 버전은 최신 모델과의 하위 호환성이 보장되지 않습니다. 항상 모델 버전에 해당하는 도구 버전을 사용하세요.
</Warning>

## 보안 고려사항

<Warning>
컴퓨터 사용은 표준 API 기능과 구별되는 고유한 위험이 있는 베타 기능입니다. 이러한 위험은 인터넷과 상호작용할 때 더욱 높아집니다. 위험을 최소화하려면 다음과 같은 예방 조치를 고려하세요:

1. 직접 시스템 공격이나 사고를 방지하기 위해 최소 권한이 있는 전용 가상 머신 또는 컨테이너를 사용하세요.
2. 정보 도용을 방지하기 위해 계정 로그인 정보와 같은 민감한 데이터에 대한 모델 액세스를 피하세요.
3. 악성 콘텐츠 노출을 줄이기 위해 인터넷 액세스를 도메인 허용 목록으로 제한하세요.
4. 의미 있는 실제 결과를 초래할 수 있는 결정과 쿠키 수락, 금융 거래 실행, 서비스 약관 동의와 같이 명시적 동의가 필요한 작업에 대해 사람이 확인하도록 요청하세요.

일부 상황에서 Claude는 사용자의 지시와 충돌하더라도 콘텐츠에서 발견된 명령을 따를 수 있습니다. 예를 들어, 웹페이지 또는 이미지에 포함된 Claude 지시사항이 지시사항을 무시하거나 Claude가 실수하도록 할 수 있습니다. Claude를 민감한 데이터 및 작업으로부터 격리하기 위한 예방 조치를 취할 것을 권장합니다.

우리는 이러한 프롬프트 주입에 저항하도록 모델을 훈련했으며 추가 방어 계층을 추가했습니다. 컴퓨터 사용 도구를 사용하면 프롬프트 주입의 잠재적 인스턴스를 플래그하기 위해 프롬프트에 대해 자동으로 분류기를 실행합니다. 이러한 분류기가 스크린샷에서 잠재적 프롬프트 주입을 식별하면 다음 작업을 진행하기 전에 사용자 확인을 요청하도록 모델을 자동으로 조정합니다. 이 추가 보호가 모든 사용 사례에 이상적이지 않을 수 있음을 인식합니다(예: 인간이 개입하지 않는 사용 사례). 옵트아웃하고 이를 끄고 싶으시면 [문의하세요](https://support.claude.com/en/).

민감한 데이터 및 작업과 관련된 프롬프트 주입 위험을 피하기 위해 Claude를 격리하기 위한 예방 조치를 취할 것을 권장합니다.

마지막으로 자신의 제품에서 컴퓨터 사용을 활성화하기 전에 최종 사용자에게 관련 위험을 알리고 동의를 얻으세요.

</Warning>

<Card
  title="컴퓨터 사용 참조 구현"
  icon="computer"
  href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
>

웹 인터페이스, Docker 컨테이너, 예제 도구 구현 및 에이전트 루프를 포함한 컴퓨터 사용 참조 구현으로 빠르게 시작하세요.

**참고:** 구현이 Claude 4 모델과 Claude Sonnet 3.7 모두를 위한 새로운 도구를 포함하도록 업데이트되었습니다. 이러한 새로운 기능에 액세스하려면 저장소의 최신 버전을 가져와야 합니다.

</Card>

<Tip>
  모델 응답의 품질, API 자체 또는 문서의 품질에 대한 피드백을 제공하려면 [이 양식](https://forms.gle/BT1hpBrqDPDUrCqo7)을 사용하세요. 여러분의 의견을 기대하고 있습니다!
</Tip>

## 빠른 시작

컴퓨터 사용을 시작하는 방법은 다음과 같습니다:

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",  # 또는 다른 호환 모델
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        }
    ],
    messages=[{"role": "user", "content": "Save a picture of a cat to my desktop."}],
    betas=["computer-use-2025-01-24"]
)
print(response)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: computer-use-2025-01-24" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": 1024,
        "display_height_px": 768,
        "display_number": 1
      },
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      },
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Save a picture of a cat to my desktop."
      }
    ]
  }'
```
</CodeGroup>

<Note>
베타 헤더는 컴퓨터 사용 도구에만 필요합니다.

위의 예제는 세 가지 도구가 함께 사용되는 것을 보여주며, 컴퓨터 사용 도구를 포함하기 때문에 베타 헤더가 필요합니다.
</Note>

---

## 컴퓨터 사용 작동 방식

<Steps>
  <Step
    title="1. Claude에 컴퓨터 사용 도구 및 사용자 프롬프트 제공"
    icon="tool"
  >
    - API 요청에 컴퓨터 사용 도구(및 선택적으로 다른 도구)를 추가하세요.
    - 데스크톱 상호작용이 필요한 사용자 프롬프트를 포함하세요. 예: "고양이 사진을 내 데스크톱에 저장하세요."
  </Step>
  <Step title="2. Claude가 컴퓨터 사용 도구를 사용하기로 결정" icon="wrench">
    - Claude는 컴퓨터 사용 도구가 사용자의 쿼리에 도움이 될 수 있는지 평가합니다.
    - 그렇다면 Claude는 올바르게 형식화된 도구 사용 요청을 구성합니다.
    - API 응답은 `tool_use`의 `stop_reason`을 가지며, Claude의 의도를 나타냅니다.
  </Step>
  <Step
    title="3. 도구 입력을 추출하고, 컴퓨터에서 도구를 평가하고, 결과를 반환"
    icon="computer"
  >
    - 사용자 측에서 Claude의 요청에서 도구 이름과 입력을 추출하세요.
    - 컨테이너 또는 가상 머신에서 도구를 사용하세요.
    - `tool_result` 콘텐츠 블록을 포함하는 새로운 `user` 메시지로 대화를 계속하세요.
  </Step>
  <Step
    title="4. Claude는 작업이 완료될 때까지 컴퓨터 사용 도구를 계속 호출"
    icon="arrows-clockwise"
  >
    - Claude는 도구 결과를 분석하여 더 많은 도구 사용이 필요한지 또는 작업이 완료되었는지 결정합니다.
    - Claude가 다른 도구가 필요하다고 결정하면 다른 `tool_use` `stop_reason`으로 응답하고 3단계로 돌아가야 합니다.
    - 그렇지 않으면 사용자에게 텍스트 응답을 작성합니다.
  </Step>
</Steps>

사용자 입력 없이 3단계와 4단계의 반복을 "에이전트 루프"라고 합니다. 즉, Claude가 도구 사용 요청으로 응답하고 애플리케이션이 해당 요청을 평가한 결과로 Claude에 응답합니다.

### 컴퓨팅 환경

컴퓨터 사용을 위해서는 Claude가 애플리케이션 및 웹과 안전하게 상호작용할 수 있는 샌드박스 컴퓨팅 환경이 필요합니다. 이 환경에는 다음이 포함됩니다:

1. **가상 디스플레이**: Claude가 스크린샷을 통해 볼 수 있고 마우스/키보드 작업으로 제어할 데스크톱 인터페이스를 렌더링하는 가상 X11 디스플레이 서버(Xvfb 사용).

2. **데스크톱 환경**: Linux에서 실행되는 창 관리자(Mutter)와 패널(Tint2)이 있는 경량 UI로, Claude가 상호작용할 일관된 그래픽 인터페이스를 제공합니다.

3. **애플리케이션**: Claude가 작업을 완료하는 데 사용할 수 있는 Firefox, LibreOffice, 텍스트 편집기, 파일 관리자와 같은 사전 설치된 Linux 애플리케이션.

4. **도구 구현**: Claude의 추상 도구 요청(예: "마우스 이동" 또는 "스크린샷 촬영")을 가상 환경의 실제 작업으로 변환하는 통합 코드.

5. **에이전트 루프**: Claude와 환경 간의 통신을 처리하고, Claude의 작업을 환경으로 보내고, 결과(스크린샷, 명령 출력)를 Claude로 반환하는 프로그램.

컴퓨터 사용을 사용할 때 Claude는 이 환경에 직접 연결되지 않습니다. 대신 애플리케이션이:

1. Claude의 도구 사용 요청을 수신합니다.
2. 이를 컴퓨팅 환경의 작업으로 변환합니다.
3. 결과(스크린샷, 명령 출력 등)를 캡처합니다.
4. 이러한 결과를 Claude로 반환합니다.

보안 및 격리를 위해 참조 구현은 환경을 보고 상호작용하기 위한 적절한 포트 매핑이 있는 Docker 컨테이너 내에서 모든 것을 실행합니다.

---

## 컴퓨터 사용을 구현하는 방법

### 참조 구현으로 시작하세요

컴퓨터 사용을 빠르게 시작하는 데 필요한 모든 것을 포함하는 [참조 구현](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)을 구축했습니다:

- Claude와 함께 컴퓨터 사용에 적합한 [컨테이너화된 환경](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile)
- [컴퓨터 사용 도구의 구현](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)
- Claude API와 상호작용하고 컴퓨터 사용 도구를 실행하는 [에이전트 루프](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py)
- 컨테이너, 에이전트 루프 및 도구와 상호작용할 웹 인터페이스.

### 다중 에이전트 루프 이해하기

컴퓨터 사용의 핵심은 "에이전트 루프"입니다. Claude가 도구 작업을 요청하고, 애플리케이션이 이를 실행하고, 결과를 Claude로 반환하는 주기입니다. 다음은 간단한 예제입니다:

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # 무한 루프를 방지하기 위해 반복 제한 추가
):
    """
    Claude 컴퓨터 사용 상호작용을 위한 간단한 에이전트 루프입니다.

    이 함수는 다음 간의 왕복을 처리합니다:
    1. Claude에 사용자 메시지 전송
    2. Claude가 도구 사용 요청
    3. 애플리케이션이 해당 도구 실행
    4. Claude로 도구 결과 전송
    """
    # 도구 및 API 매개변수 설정
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # 도구 구성 - 이미 다른 곳에서 초기화되어 있어야 합니다
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # 주 에이전트 루프 (실행 비용 증가를 방지하기 위해 반복 제한)
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # 선택적 thinking 매개변수 설정 (Claude Sonnet 3.7용)
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # Claude API 호출
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # Claude의 응답을 대화 기록에 추가
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # Claude가 도구를 사용했는지 확인
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # 실제 앱에서는 여기서 도구를 실행합니다
                # 예: result = run_tool(block.name, block.input)
                result = {"result": "Tool executed successfully"}

                # Claude를 위해 결과 형식화
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # 도구가 사용되지 않으면 Claude가 완료됨 - 최종 메시지 반환
        if not tool_results:
            return messages

        # 다음 Claude 반복을 위해 메시지에 도구 결과 추가
        messages.append({"role": "user", "content": tool_results})
```

루프는 Claude가 도구를 요청하지 않고 응답할 때까지(작업 완료) 또는 최대 반복 제한에 도달할 때까지 계속됩니다. 이 보호 장치는 예상치 못한 API 비용을 초래할 수 있는 무한 루프를 방지합니다.

참조 구현을 시도한 후 이 문서의 나머지 부분을 읽을 것을 권장합니다.

### 프롬프팅으로 모델 성능 최적화

최고 품질의 출력을 얻기 위한 몇 가지 팁은 다음과 같습니다:

1. 간단하고 명확하게 정의된 작업을 지정하고 각 단계에 대한 명시적 지시사항을 제공하세요.
2. Claude는 때때로 결과를 명시적으로 확인하지 않고 작업의 결과를 가정합니다. 이를 방지하려면 Claude에 `각 단계 후에 스크린샷을 촬영하고 올바른 결과를 달성했는지 신중하게 평가하세요. 명시적으로 생각을 보여주세요: "나는 X 단계를 평가했습니다..." 올바르지 않으면 다시 시도하세요. 단계가 올바르게 실행되었음을 확인한 후에만 다음 단계로 이동하세요.`로 프롬프트하세요.
3. 일부 UI 요소(드롭다운 및 스크롤바 등)는 Claude가 마우스 이동을 사용하여 조작하기 어려울 수 있습니다. 이 문제가 발생하면 모델에 키보드 단축키를 사용하도록 프롬프트해 보세요.
4. 반복 가능한 작업이나 UI 상호작용의 경우 프롬프트에 성공한 결과의 예제 스크린샷 및 도구 호출을 포함하세요.
5. 모델이 로그인해야 하는 경우 프롬프트에서 `<robot_credentials>` xml 태그 내에 사용자 이름과 암호를 제공하세요. 로그인이 필요한 애플리케이션 내에서 컴퓨터 사용을 사용하면 프롬프트 주입으로 인한 나쁜 결과의 위험이 증가합니다. 모델에 로그인 자격증명을 제공하기 전에 [프롬프트 주입 완화 가이드](/docs/ko/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)를 검토하세요.

<Tip>
  명확한 문제 집합을 반복적으로 만나거나 Claude가 완료해야 할 작업을 미리 알고 있다면, 시스템 프롬프트를 사용하여 Claude에 작업을 성공적으로 수행하는 방법에 대한 명시적 팁이나 지시사항을 제공하세요.
</Tip>

### 시스템 프롬프트

Anthropic에서 정의한 도구 중 하나가 Claude API를 통해 요청될 때 컴퓨터 사용 관련 시스템 프롬프트가 생성됩니다. 이는 [도구 사용 시스템 프롬프트](/docs/ko/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt)와 유사하지만 다음으로 시작합니다:

> 사용자의 질문에 답변하기 위해 사용할 수 있는 함수 집합에 액세스할 수 있습니다. 여기에는 샌드박스 컴퓨팅 환경에 대한 액세스가 포함됩니다. 현재 아래 함수를 호출하는 것을 제외하고는 파일을 검사하거나 외부 리소스와 상호작용할 수 없습니다.

일반 도구 사용과 마찬가지로 사용자 제공 `system_prompt` 필드는 여전히 존중되며 결합된 시스템 프롬프트 구성에 사용됩니다.

### 사용 가능한 작업

컴퓨터 사용 도구는 다음 작업을 지원합니다:

**기본 작업 (모든 버전)**
- **screenshot** - 현재 디스플레이 캡처
- **left_click** - 좌표 `[x, y]`에서 클릭
- **type** - 텍스트 문자열 입력
- **key** - 키 또는 키 조합 누르기 (예: "ctrl+s")
- **mouse_move** - 커서를 좌표로 이동

**향상된 작업 (`computer_20250124`)**
Claude 4 모델 및 Claude Sonnet 3.7에서 사용 가능:
- **scroll** - 방향 및 양 제어로 스크롤
- **left_click_drag** - 좌표 간 클릭 및 드래그
- **right_click**, **middle_click** - 추가 마우스 버튼
- **double_click**, **triple_click** - 여러 클릭
- **left_mouse_down**, **left_mouse_up** - 세밀한 클릭 제어
- **hold_key** - 다른 작업을 수행하는 동안 키 누르기
- **wait** - 작업 간 일시 중지

**향상된 작업 (`computer_20251124`)**
Claude Opus 4.5에서 사용 가능:
- `computer_20250124`의 모든 작업
- **zoom** - 화면의 특정 영역을 전체 해상도로 봅니다. 도구 정의에서 `enable_zoom: true`가 필요합니다. 검사할 영역의 왼쪽 위 및 오른쪽 아래 모서리를 정의하는 좌표 `[x1, y1, x2, y2]`가 있는 `region` 매개변수를 사용합니다.

<section title="예제 작업">

```json
// 스크린샷 촬영
{
  "action": "screenshot"
}

// 위치에서 클릭
{
  "action": "left_click",
  "coordinate": [500, 300]
}

// 텍스트 입력
{
  "action": "type",
  "text": "Hello, world!"
}

// 아래로 스크롤 (Claude 4/3.7)
{
  "action": "scroll",
  "coordinate": [500, 400],
  "scroll_direction": "down",
  "scroll_amount": 3
}

// 영역을 상세히 보기 위해 줌 (Opus 4.5)
{
  "action": "zoom",
  "region": [100, 200, 400, 350]
}
```

</section>

### 도구 매개변수

| 매개변수 | 필수 | 설명 |
|-----------|----------|-------------|
| `type` | 예 | 도구 버전 (`computer_20251124`, `computer_20250124`, 또는 `computer_20241022`) |
| `name` | 예 | "computer"여야 함 |
| `display_width_px` | 예 | 픽셀 단위 디스플레이 너비 |
| `display_height_px` | 예 | 픽셀 단위 디스플레이 높이 |
| `display_number` | 아니오 | X11 환경의 디스플레이 번호 |
| `enable_zoom` | 아니오 | 줌 작업 활성화 (`computer_20251124`만 해당). Claude가 특정 화면 영역으로 줌할 수 있도록 하려면 `true`로 설정하세요. 기본값: `false` |

<Note>
**중요**: 컴퓨터 사용 도구는 애플리케이션에서 명시적으로 실행해야 합니다. Claude는 직접 실행할 수 없습니다. 스크린샷 캡처, 마우스 이동, 키보드 입력 및 기타 작업을 Claude의 요청에 따라 구현할 책임이 있습니다.
</Note>

### Claude 4 모델 및 Claude Sonnet 3.7에서 thinking 기능 활성화

Claude Sonnet 3.7은 모델의 추론 프로세스를 볼 수 있게 해주는 새로운 "thinking" 기능을 도입했습니다. 이 기능은 Claude가 복잡한 작업을 어떻게 접근하는지 이해하는 데 도움이 되며 디버깅이나 교육 목적으로 특히 유용할 수 있습니다.

thinking을 활성화하려면 API 요청에 `thinking` 매개변수를 추가하세요:

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

`budget_tokens` 매개변수는 Claude가 thinking에 사용할 수 있는 토큰 수를 지정합니다. 이는 전체 `max_tokens` 예산에서 차감됩니다.

thinking이 활성화되면 Claude는 응답의 일부로 추론 프로세스를 반환하며, 이는 다음을 도와줍니다:

1. 모델의 의사 결정 프로세스 이해
2. 잠재적 문제 또는 오해 식별
3. Claude의 문제 해결 접근 방식 학습
4. 복잡한 다단계 작업에 대한 더 많은 가시성 확보

thinking 출력이 어떻게 보일 수 있는지의 예는 다음과 같습니다:

```
[Thinking]
나는 고양이 사진을 데스크톱에 저장해야 합니다. 이를 단계로 나누어 봅시다:

1. 먼저 스크린샷을 촬영하여 데스크톱에 무엇이 있는지 확인합니다
2. 그런 다음 고양이 이미지를 검색할 웹 브라우저를 찾습니다
3. 적절한 이미지를 찾은 후 데스크톱에 저장해야 합니다

스크린샷을 촬영하여 사용 가능한 것을 확인하는 것으로 시작하겠습니다...
```

### 다른 도구로 컴퓨터 사용 보강

컴퓨터 사용 도구는 다른 도구와 결합하여 더 강력한 자동화 워크플로우를 만들 수 있습니다. 이는 다음이 필요할 때 특히 유용합니다:
- 시스템 명령 실행 ([bash 도구](/docs/ko/agents-and-tools/tool-use/bash-tool))
- 구성 파일 또는 스크립트 편집 ([텍스트 편집기 도구](/docs/ko/agents-and-tools/tool-use/text-editor-tool))
- 사용자 정의 API 또는 서비스와 통합 (사용자 정의 도구)

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: computer-use-2025-01-24" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 2000,
      "tools": [
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
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
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Find flights from San Francisco to a place with warmer weather."
        }
      ],
      "thinking": {
        "type": "enabled",
        "budget_tokens": 1024
      }
    }'
  ```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
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
          }
        },
    ],
    messages=[{"role": "user", "content": "Find flights from San Francisco to a place with warmer weather."}],
    betas=["computer-use-2025-01-24"],
    thinking={"type": "enabled", "budget_tokens": 1024},
)
print(response)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
      {
        type: "computer_20250124",
        name: "computer",
        display_width_px: 1024,
        display_height_px: 768,
        display_number: 1,
      },
      {
        type: "text_editor_20250728",
        name: "str_replace_based_edit_tool"
      },
      {
        type: "bash_20250124",
        name: "bash"
      },
      {
        name: "get_weather",
        description: "Get the current weather in a given location",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA"
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "The unit of temperature, either 'celsius' or 'fahrenheit'"
            }
          },
          required: ["location"]
        }
      },
  ],
  messages: [{ role: "user", content: "Find flights from San Francisco to a place with warmer weather." }],
  betas: ["computer-use-2025-01-24"],
  thinking: { type: "enabled", budget_tokens: 1024 },
});
console.log(message);
```
```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaToolBash20250124;
import com.anthropic.models.beta.messages.BetaToolComputerUse20250124;
import com.anthropic.models.beta.messages.BetaToolTextEditor20250124;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaThinkingConfigParam;
import com.anthropic.models.beta.messages.BetaTool;

public class MultipleToolsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model("claude-sonnet-4-5")
                .maxTokens(1024)
                .addTool(BetaToolComputerUse20250124.builder()
                        .displayWidthPx(1024)
                        .displayHeightPx(768)
                        .displayNumber(1)
                        .build())
                .addTool(BetaToolTextEditor20250124.builder()
                        .build())
                .addTool(BetaToolBash20250124.builder()
                        .build())
                .addTool(BetaTool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(BetaTool.InputSchema.builder()
                                .properties(
                                        JsonValue.from(
                                                Map.of(
                                                        "location", Map.of(
                                                                "type", "string",
                                                                "description", "The city and state, e.g. San Francisco, CA"
                                                        ),
                                                        "unit", Map.of(
                                                                "type", "string",
                                                                "enum", List.of("celsius", "fahrenheit"),
                                                                "description", "The unit of temperature, either 'celsius' or 'fahrenheit'"
                                                        )
                                                )
                                        ))
                                .build()
                        )
                        .build())
                .thinking(BetaThinkingConfigParam.ofEnabled(
                        BetaThinkingConfigEnabled.builder()
                                .budgetTokens(1024)
                                .build()
                ))
                .addUserMessage("Find flights from San Francisco to a place with warmer weather.")
                .addBeta("computer-use-2025-01-24")
                .build();

        BetaMessage message = client.beta().messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

### 사용자 정의 컴퓨터 사용 환경 구축

[참조 구현](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)은 컴퓨터 사용을 시작하는 데 도움이 되도록 설계되었습니다. Claude가 컴퓨터를 사용하는 데 필요한 모든 구성 요소를 포함합니다. 그러나 필요에 맞게 컴퓨터 사용을 위한 자신만의 환경을 구축할 수 있습니다. 다음이 필요합니다:

- Claude와 함께 컴퓨터 사용에 적합한 가상화 또는 컨테이너화된 환경
- Anthropic에서 정의한 컴퓨터 사용 도구 중 최소 하나의 구현
- Claude API와 상호 작용하고 도구 구현을 사용하여 `tool_use` 결과를 실행하는 에이전트 루프
- 에이전트 루프를 시작하기 위해 사용자 입력을 허용하는 API 또는 UI

#### 컴퓨터 사용 도구 구현

컴퓨터 사용 도구는 스키마 없는 도구로 구현됩니다. 이 도구를 사용할 때 다른 도구처럼 입력 스키마를 제공할 필요가 없습니다. 스키마는 Claude의 모델에 내장되어 있으며 수정할 수 없습니다.

<Steps>
  <Step title="컴퓨팅 환경 설정">
    Claude가 상호 작용할 가상 디스플레이를 만들거나 기존 디스플레이에 연결합니다. 이는 일반적으로 Xvfb(X Virtual Framebuffer) 또는 유사한 기술을 설정하는 것을 포함합니다.
  </Step>
  <Step title="작업 핸들러 구현">
    Claude가 요청할 수 있는 각 작업 유형을 처리하는 함수를 만듭니다:
    ```python
    def handle_computer_action(action_type, params):
        if action_type == "screenshot":
            return capture_screenshot()
        elif action_type == "left_click":
            x, y = params["coordinate"]
            return click_at(x, y)
        elif action_type == "type":
            return type_text(params["text"])
        # ... handle other actions
    ```
  </Step>
  <Step title="Claude의 도구 호출 처리">
    Claude의 응답에서 도구 호출을 추출하고 실행합니다:
    ```python
    for content in response.content:
        if content.type == "tool_use":
            action = content.input["action"]
            result = handle_computer_action(action, content.input)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="에이전트 루프 구현">
    Claude가 작업을 완료할 때까지 계속되는 루프를 만듭니다:
    ```python
    while True:
        response = client.beta.messages.create(...)
        
        # Check if Claude used any tools
        tool_results = process_tool_calls(response)
        
        if not tool_results:
            # No more tool use, task complete
            break
            
        # Continue conversation with tool results
        messages.append({"role": "user", "content": tool_results})
    ```
  </Step>
</Steps>

#### 오류 처리

컴퓨터 사용 도구를 구현할 때 다양한 오류가 발생할 수 있습니다. 이를 처리하는 방법은 다음과 같습니다:

<section title="스크린샷 캡처 실패">

스크린샷 캡처가 실패하면 적절한 오류 메시지를 반환합니다:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to capture screenshot. Display may be locked or unavailable.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="잘못된 좌표">

Claude가 디스플레이 범위를 벗어난 좌표를 제공하는 경우:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Coordinates (1200, 900) are outside display bounds (1024x768).",
      "is_error": true
    }
  ]
}
```

</section>

<section title="작업 실행 실패">

작업 실행이 실패하는 경우:

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to perform click action. The application may be unresponsive.",
      "is_error": true
    }
  ]
}
```

</section>

#### 높은 해상도에 대한 좌표 스케일링 처리

API는 이미지를 가장 긴 가장자리에서 최대 1568픽셀로 제한하고 총 약 1.15메가픽셀로 제한합니다([이미지 크기 조정](/docs/ko/build-with-claude/vision#evaluate-image-size) 참조). 예를 들어, 1512x982 화면은 약 1330x864로 다운샘플링됩니다. Claude는 이 더 작은 이미지를 분석하고 해당 공간에서 좌표를 반환하지만, 도구는 원본 화면 공간에서 클릭을 실행합니다.

좌표 변환을 처리하지 않으면 Claude의 클릭 좌표가 대상을 놓칠 수 있습니다.

이를 해결하려면 스크린샷을 직접 크기 조정하고 Claude의 좌표를 다시 확대합니다:

<CodeGroup>
```python Python
import math

def get_scale_factor(width, height):
    """Calculate scale factor to meet API constraints."""
    long_edge = max(width, height)
    total_pixels = width * height

    long_edge_scale = 1568 / long_edge
    total_pixels_scale = math.sqrt(1_150_000 / total_pixels)

    return min(1.0, long_edge_scale, total_pixels_scale)

# When capturing screenshot
scale = get_scale_factor(screen_width, screen_height)
scaled_width = int(screen_width * scale)
scaled_height = int(screen_height * scale)

# Resize image to scaled dimensions before sending to Claude
screenshot = capture_and_resize(scaled_width, scaled_height)

# When handling Claude's coordinates, scale them back up
def execute_click(x, y):
    screen_x = x / scale
    screen_y = y / scale
    perform_click(screen_x, screen_y)
```

```typescript TypeScript
const MAX_LONG_EDGE = 1568;
const MAX_PIXELS = 1_150_000;

function getScaleFactor(width: number, height: number): number {
  const longEdge = Math.max(width, height);
  const totalPixels = width * height;

  const longEdgeScale = MAX_LONG_EDGE / longEdge;
  const totalPixelsScale = Math.sqrt(MAX_PIXELS / totalPixels);

  return Math.min(1.0, longEdgeScale, totalPixelsScale);
}

// When capturing screenshot
const scale = getScaleFactor(screenWidth, screenHeight);
const scaledWidth = Math.floor(screenWidth * scale);
const scaledHeight = Math.floor(screenHeight * scale);

// Resize image to scaled dimensions before sending to Claude
const screenshot = captureAndResize(scaledWidth, scaledHeight);

// When handling Claude's coordinates, scale them back up
function executeClick(x: number, y: number): void {
  const screenX = x / scale;
  const screenY = y / scale;
  performClick(screenX, screenY);
}
```
</CodeGroup>

#### 구현 모범 사례 따르기

<section title="적절한 디스플레이 해상도 사용">

사용 사례와 일치하면서 권장 제한 내에 있는 디스플레이 치수를 설정합니다:
- 일반 데스크톱 작업의 경우: 1024x768 또는 1280x720
- 웹 애플리케이션의 경우: 1280x800 또는 1366x768
- 성능 문제를 방지하기 위해 1920x1080 이상의 해상도를 피합니다

</section>

<section title="적절한 스크린샷 처리 구현">

Claude에 스크린샷을 반환할 때:
- 스크린샷을 base64 PNG 또는 JPEG로 인코딩합니다
- 성능 향상을 위해 큰 스크린샷 압축을 고려합니다
- 타임스탬프 또는 디스플레이 상태와 같은 관련 메타데이터를 포함합니다
- 더 높은 해상도를 사용하는 경우 좌표가 정확하게 스케일링되는지 확인합니다

</section>

<section title="작업 지연 추가">

일부 애플리케이션은 작업에 응답하는 데 시간이 필요합니다:
```python
def click_and_wait(x, y, wait_time=0.5):
    click_at(x, y)
    time.sleep(wait_time)  # Allow UI to update
```

</section>

<section title="실행 전 작업 검증">

요청된 작업이 안전하고 유효한지 확인합니다:
```python
def validate_action(action_type, params):
    if action_type == "left_click":
        x, y = params.get("coordinate", (0, 0))
        if not (0 <= x < display_width and 0 <= y < display_height):
            return False, "Coordinates out of bounds"
    return True, None
```

</section>

<section title="디버깅을 위한 작업 로깅">

문제 해결을 위해 모든 작업의 로그를 유지합니다:
```python
import logging

def log_action(action_type, params, result):
    logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
```

</section>

---

## 컴퓨터 사용 제한 사항 이해

컴퓨터 사용 기능은 베타 버전입니다. Claude의 기능은 최첨단이지만 개발자는 다음과 같은 제한 사항을 알아야 합니다:

1. **지연**: 현재 인간-AI 상호 작용을 위한 컴퓨터 사용 지연은 일반적인 인간 지향 컴퓨터 작업과 비교하여 너무 느릴 수 있습니다. 속도가 중요하지 않은 사용 사례(예: 배경 정보 수집, 자동화된 소프트웨어 테스트)에 신뢰할 수 있는 환경에서 집중할 것을 권장합니다.
2. **컴퓨터 비전 정확도 및 신뢰성**: Claude는 작업을 생성하면서 특정 좌표를 출력할 때 실수하거나 환각할 수 있습니다. Claude Sonnet 3.7은 모델의 추론을 이해하고 잠재적 문제를 식별하는 데 도움이 될 수 있는 사고 기능을 도입합니다.
3. **도구 선택 정확도 및 신뢰성**: Claude는 작업을 생성하면서 도구를 선택할 때 실수하거나 환각할 수 있으며 문제를 해결하기 위해 예상치 못한 작업을 수행할 수 있습니다. 또한 틈새 애플리케이션이나 여러 애플리케이션과 상호 작용할 때 신뢰성이 낮을 수 있습니다. 복잡한 작업을 요청할 때 모델에 신중하게 프롬프트를 제시할 것을 권장합니다.
4. **스크롤 신뢰성**: Claude Sonnet 3.7은 방향 제어를 통해 신뢰성을 향상시키는 전용 스크롤 작업을 도입했습니다. 모델은 이제 지정된 양만큼 모든 방향(위/아래/왼쪽/오른쪽)으로 명시적으로 스크롤할 수 있습니다.
5. **스프레드시트 상호 작용**: Claude Sonnet 3.7에서 `left_mouse_down`, `left_mouse_up`과 같은 더 정확한 마우스 제어 작업 및 새로운 수정자 키 지원의 추가로 스프레드시트 상호 작용을 위한 마우스 클릭이 개선되었습니다. 이러한 세분화된 제어를 사용하고 수정자 키를 클릭과 결합하여 셀 선택을 더 안정적으로 할 수 있습니다.
6. **소셜 및 통신 플랫폼에서의 계정 생성 및 콘텐츠 생성**: Claude는 웹사이트를 방문하지만 소셜 미디어 웹사이트 및 플랫폼 전반에서 계정을 생성하거나 콘텐츠를 생성 및 공유하거나 인간 사칭에 참여하는 능력을 제한하고 있습니다. 향후 이 기능을 업데이트할 수 있습니다.
7. **취약점**: 탈옥 또는 프롬프트 주입과 같은 취약점은 베타 컴퓨터 사용 API를 포함한 최첨단 AI 시스템 전반에 걸쳐 지속될 수 있습니다. 어떤 경우에는 Claude가 콘텐츠에서 발견된 명령을 따르며, 때로는 사용자의 지시와 충돌하기도 합니다. 예를 들어, 웹페이지의 Claude 지시 또는 이미지에 포함된 지시가 지시를 무시하거나 Claude가 실수하도록 할 수 있습니다. 다음을 권장합니다:
   a. 컴퓨터 사용을 최소 권한이 있는 가상 머신 또는 컨테이너와 같은 신뢰할 수 있는 환경으로 제한합니다
   b. 엄격한 감시 없이 민감한 계정이나 데이터에 대한 컴퓨터 사용 액세스를 제공하지 않습니다
   c. 애플리케이션에서 컴퓨터 사용 기능을 활성화하거나 필요한 권한을 요청하기 전에 최종 사용자에게 관련 위험을 알리고 동의를 얻습니다
8. **부적절하거나 불법적인 작업**: Anthropic의 서비스 약관에 따라 컴퓨터 사용을 사용하여 법률을 위반하거나 허용 가능한 사용 정책을 위반해서는 안 됩니다.

항상 Claude의 컴퓨터 사용 작업 및 로그를 신중하게 검토하고 확인합니다. 완벽한 정확도가 필요하거나 인간의 감시 없이 민감한 사용자 정보가 필요한 작업에는 Claude를 사용하지 마십시오.

---

## 가격 책정

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## 다음 단계

<CardGroup cols={2}>
  <Card
    title="참조 구현"
    icon="github-logo"
    href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
  >
    완전한 Docker 기반 구현으로 빠르게 시작하세요
  </Card>
  <Card
    title="도구 문서"
    icon="tool"
    href="/docs/ko/agents-and-tools/tool-use/overview"
  >
    도구 사용 및 사용자 정의 도구 만들기에 대해 자세히 알아보세요
  </Card>
</CardGroup>