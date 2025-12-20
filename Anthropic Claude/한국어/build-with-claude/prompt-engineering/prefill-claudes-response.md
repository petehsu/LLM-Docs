# Claude의 응답을 미리 채워 더 나은 출력 제어

Claude의 응답을 미리 채우는 방법을 배우고 출력 형식을 제어하며 역할극 시나리오에서 캐릭터 일관성을 유지하세요.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

<Note>
미리 채우기는 확장 사고 모드가 아닌 경우에만 사용 가능합니다. 현재 확장 사고와는 지원되지 않습니다.
</Note>

Claude를 사용할 때, `Assistant` 메시지를 미리 채워 응답을 안내할 수 있는 고유한 능력이 있습니다. 이 강력한 기법을 통해 Claude의 동작을 지시하고, 서문을 건너뛰고, JSON이나 XML과 같은 특정 형식을 강제하며, 역할극 시나리오에서 캐릭터 일관성을 유지하도록 도울 수 있습니다.

Claude가 예상대로 작동하지 않는 경우가 있을 때, 몇 가지 미리 채워진 문장이 Claude의 성능을 크게 향상시킬 수 있습니다. 약간의 미리 채우기가 큰 효과를 발휘합니다!

## Claude의 응답을 미리 채우는 방법

미리 채우려면 원하는 초기 텍스트를 `Assistant` 메시지에 포함시키세요 (Claude의 응답은 `Assistant` 메시지가 끝나는 지점부터 계속됩니다):

```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is your favorite color?"},
        {"role": "assistant", "content": "As an AI assistant, I don't have a favorite color, But if I had to pick, it would be green because"}  # Prefill here
    ]
)
```

<Warning>
  미리 채우기 콘텐츠는 후행 공백으로 끝날 수 없습니다. `"As an AI assistant, I "` (끝에 공백이 있는)와 같은 미리 채우기는 오류를 발생시킵니다.
</Warning>

### 예제

#### 예제 1: 출력 형식 제어 및 서문 건너뛰기

<Tip>**고급 사용자 팁**: `{`를 미리 채우면 Claude가 서문을 건너뛰고 JSON 객체를 직접 출력하도록 강제합니다. 이는 더 깔끔하고 간결하며 프로그램이 추가 처리 없이 구문 분석하기 쉽습니다.
특정 스키마를 준수하는 보장된 JSON 출력의 경우, 미리 채우기 대신 [Structured Outputs](/docs/ko/build-with-claude/structured-outputs)를 사용하는 것을 고려하세요. Structured Outputs는 Claude의 응답이 항상 정의된 JSON 스키마와 일치하도록 보장하므로 엄격한 형식 준수가 필요한 프로덕션 애플리케이션에 이상적입니다.</Tip>

    <section title="예제: 미리 채우기 없이 구조화된 데이터 추출">

    | 역할 | 콘텐츠 |
    | ---- | ------- |
    | 사용자 | 이 제품 설명에서 이름, 크기, 가격 및 색상을 JSON 객체로 추출하세요:<br/><br/>\<description><br/>SmartHome Mini는 검은색 또는 흰색으로 제공되는 컴팩트한 스마트 홈 어시스턴트로 단 \$49.99입니다. 너비가 5인치에 불과하므로 음성이나 앱을 통해 조명, 온도 조절기 및 기타 연결된 장치를 제어할 수 있습니다. 이 저렴한 작은 허브는 스마트 장치에 편리한 핸즈프리 제어를 제공합니다.<br/>\</description> |
    | Assistant | 다음은 JSON 형식의 추출된 정보입니다:<br/><br/>\`\`\`json<br/>\{<br/>  "name": "SmartHome Mini",<br/>  "size": "5 inches wide",<br/>  "price": "\$49.99",<br/>  "colors": ["black", "white"]<br/>\}<br/>\`\`\`<br/><br/>제품 설명에서 다음 세부 정보를 추출했습니다:<br/>- **이름**: SmartHome Mini<br/>- **크기**: 너비 5인치<br/>- **가격**: \$49.99<br/>- **색상**: 검은색 및 흰색으로 제공<br/><br/>JSON 객체는 프로그램이 구문 분석하고 사용하기 쉬운 구조화된 형식을 제공합니다. 수정이 필요하거나 다른 질문이 있으면 알려주세요! |
    
</section>

    <section title="예제: 미리 채우기를 사용한 구조화된 데이터 추출">

    | 역할 | 콘텐츠 |
    | ---- | ------- |
    | 사용자 | 이 제품 설명에서 이름, 크기, 가격 및 색상을 JSON 객체로 추출하세요:<br/><br/>\<description><br/>SmartHome Mini는 검은색 또는 흰색으로 제공되는 컴팩트한 스마트 홈 어시스턴트로 단 \$49.99입니다. 너비가 5인치에 불과하므로 음성이나 앱을 통해 조명, 온도 조절기 및 기타 연결된 장치를 제어할 수 있습니다. 이 저렴한 작은 허브는 스마트 장치에 편리한 핸즈프리 제어를 제공합니다.<br/>\</description> |
    | Assistant (미리 채우기) | \{ |
    | Assistant (Claude의 응답) | "name": "SmartHome Mini",<br/>"size": "5 inches wide",<br/>"price": "\$49.99",<br/>"colors": [<br/>  "black",<br/>  "white"<br/>]<br/>\} |
    
</section>

#### 예제 2: 역할극 시나리오에서 캐릭터 유지

<Tip>**역할극 팁**: 대괄호로 묶인 `[ROLE_NAME]`을 미리 채우면 더 길고 복잡한 대화에서도 Claude가 캐릭터를 유지하도록 상기시킬 수 있습니다. 이는 `system` 매개변수의 역할 프롬프팅과 결합할 때 특히 강력합니다.</Tip>

    <section title="예제: 역할 프롬프팅 없이 캐릭터 유지">

    | 역할 | 콘텐츠 |
    | ---- | ------- |
    | 사용자 ("Sherlock Holmes" Claude와 50번의 대화 턴 진행 중) | 이 신발의 소유자에 대해 무엇을 추론하시겠습니까? \<image>muddy_shoe.jpg\</image> |
    | Assistant | AI 어시스턴트로서, 제공하신 신발의 진흙 이미지를 분석하는 것을 기꺼이 도와드리겠습니다. 제 추론은 다음과 같습니다... |
    
</section>

    <section title="예제: 역할 프롬프팅을 사용한 캐릭터 유지">

    | 역할 | 콘텐츠 |
    | ---- | ------- |
    | 사용자 ("Sherlock Holmes" Claude와 50번의 대화 턴 진행 중) | 이 신발의 소유자에 대해 무엇을 추론하시겠습니까? <br/>\<image>muddy_shoe.jpg\</image> |
    | Assistant (미리 채우기) | [Sherlock Holmes] |
    | Assistant (Claude의 응답) | 아, 이게 뭔가요? 정말 흥미로운 표본이군요, Watson! 이 신발을 예리한 눈으로 살펴봅시다. 이 진흙은 일반적인 런던 점토가 아니라 Hampstead Heath 주변에서만 발견되는 철분이 풍부한 토양의 독특한 적색입니다. 그런데 밑창의 마모는 Heath의 완만한 경사보다는 Whitechapel의 자갈길에 더 적합한 보행 방식을 시사합니다.<br/><br/>이제 끈을 관찰하세요! 의료 전문가들이 선호하는 특정 매듭으로 묶여 있습니다. 의심할 여지없이 수술 가운을 묶는 데 익숙해진 습관입니다. 하지만 발가락 상자의 흠집은 다른 이야기를 말해줍니다. 격투기, 특히 Baritsu에서 사용할 수 있는 발차기 동작과 일치합니다.<br/><br/>따라서 우리는 부재중인 신발 소유자가 Whitechapel에 거주하지만 Hampstead Heath를 자주 방문하는 의사, 아마도 외과의라고 결론지을 수 있습니다. 아마도 호기심 많은 눈을 피하기 위해 비밀 Baritsu 연습을 하기 위해서일 것입니다. 정말 흥미로운 사건이군요, Watson! 서둘러야 합니다. 게임이 시작되었습니다! |
    
</section>

---

<CardGroup cols={3}>
  <Card title="메시지 작업" icon="messages" href="/docs/ko/build-with-claude/working-with-messages">
    미리 채우기 및 기타 Messages API 패턴의 더 많은 예제를 확인하세요.
  </Card>
  <Card title="프롬프트 라이브러리" icon="link" href="/docs/ko/resources/prompt-library/library">
    다양한 작업 및 사용 사례를 위한 엄선된 프롬프트 선택으로 영감을 얻으세요.
  </Card>
  <Card title="GitHub 프롬프팅 튜토리얼" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    문서에서 찾을 수 있는 프롬프트 엔지니어링 개념을 다루는 예제로 가득한 튜토리얼입니다.
  </Card>
  <Card title="Google Sheets 프롬프팅 튜토리얼" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    대화형 스프레드시트를 통한 프롬프트 엔지니어링 튜토리얼의 더 가벼운 버전입니다.
  </Card>
</CardGroup>