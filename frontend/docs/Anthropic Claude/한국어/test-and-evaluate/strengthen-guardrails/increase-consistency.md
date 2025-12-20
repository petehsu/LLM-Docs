# 출력 일관성 증가

Claude의 응답을 더 일관성 있게 만드는 방법

---

<Tip>
**보장된 JSON 스키마 준수를 위해**

Claude가 항상 특정 스키마를 준수하는 유효한 JSON을 출력하도록 해야 하는 경우, 아래의 프롬프트 엔지니어링 기법 대신 [Structured Outputs](/docs/ko/build-with-claude/structured-outputs)를 사용하세요. Structured outputs는 보장된 스키마 준수를 제공하며 이 사용 사례를 위해 특별히 설계되었습니다.

아래의 기법들은 일반적인 출력 일관성이나 엄격한 JSON 스키마를 넘어서는 유연성이 필요할 때 유용합니다.
</Tip>

Claude의 응답을 더 일관성 있게 만드는 방법은 다음과 같습니다:

## 원하는 출력 형식 지정
JSON, XML 또는 사용자 정의 템플릿을 사용하여 원하는 출력 형식을 정확하게 정의하여 Claude가 필요한 모든 출력 형식 요소를 이해하도록 합니다.

<section title="예시: 고객 피드백 표준화">

    | Role | Content |
    | ---- | ------- |
    | User | 당신은 고객 인사이트 AI입니다. 이 피드백을 분석하고 JSON 형식으로 출력하세요. 키는 "sentiment" (positive/negative/neutral), "key_issues" (목록), "action_items" (dict 목록, "team"과 "task" 포함)입니다.<br/><br/>"저는 3년간 충성스러운 사용자였지만, 최근 UI 업데이트는 재앙입니다. 기본 기능을 찾는 것이 이제 보물찾기가 되었습니다. 게다가 새로운 '프리미엄' 가격은 터무니없습니다. 이것이 빨리 해결되지 않으면 다른 서비스로 전환할 생각입니다." |
    | Assistant | \{<br/>  "sentiment": "negative",<br/>  "key_issues": [<br/>    "최근 업데이트의 나쁜 UI/UX",<br/>    "기본 기능을 찾기 어려움",<br/>    "인지된 높은 가격 (새로운 '프리미엄' 티어)"<br/>  ],<br/>  "action_items": [<br/>    \{<br/>      "team": "Product",<br/>      "task": "사용성 테스트를 수행하고 결과에 따라 UI를 반복 개선"<br/>    \},<br/>    \{<br/>      "team": "UX",<br/>      "task": "기능 발견 가이드 또는 온보딩 플로우 생성"<br/>    \},<br/>    \{<br/>      "team": "Marketing",<br/>      "task": "가격 전략을 검토하고 가치 제안 전달"<br/>    \},<br/>    \{<br/>      "team": "Customer Success",<br/>      "task": "사용자에게 연락하여 이탈 방지를 위한 양보 제안"<br/>    \}<br/>  ]<br/>\} |

</section>

## Claude의 응답 미리 채우기
`Assistant` 턴을 원하는 형식으로 미리 채웁니다. 이 트릭은 Claude의 친절한 서문을 우회하고 당신의 구조를 강제합니다.

<section title="예시: 일일 판매 보고서">

    | Role | Content |
    | ---- | ------- |
    | User | 당신은 통찰력 있는 판매 인텔리전스 AI입니다. 오늘의 판매 보고서를 생성하세요.<br/><br/>보고서를 다음과 같이 구조화하세요:<br/><br/>\<report><br/>    \<summary><br/>        \<metric name="total_revenue">\$0.00\</metric><br/>        \<metric name="units_sold">0\</metric><br/>        \<metric name="avg_order_value">\$0.00\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>Product Name\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<units>0\</units><br/>        \</product><br/>        ...<br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>Region Name\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<growth>0.0%\</growth><br/>        \</region><br/>        ...<br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>Action item.\</item><br/>        ...<br/>    \</action_items><br/>\</report> |
    | Assistant (prefill) | \<report><br/>    \<summary><br/>        \<metric name= |
    | Assistant | "total_revenue">\$842,567.00\</metric><br/>        \<metric name="units_sold">15,238\</metric><br/>        \<metric name="avg_order_value">\$55.29\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>AcmeGuard Pro\</name><br/>            \<revenue>\$325,890.00\</revenue><br/>            \<units>3,621\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeVault Enterprise\</name><br/>            \<revenue>\$254,400.00\</revenue><br/>            \<units>1,272\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeBoost XL\</name><br/>            \<revenue>\$147,690.00\</revenue><br/>            \<units>4,923\</units><br/>        \</product><br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>APAC\</name><br/>            \<revenue>\$258,960.00\</revenue><br/>            \<growth>12.8%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>EMEA\</name><br/>            \<revenue>\$325,478.00\</revenue><br/>            \<growth>3.2%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>Americas\</name><br/>            \<revenue>\$258,129.00\</revenue><br/>            \<growth>-2.1%\</growth><br/>        \</region><br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>Americas 수익 감소를 조사하고 지역 판매팀 회의를 예약하세요.\</item><br/>        \<item>APAC에서 CloudGuard Pro 출시를 가속화하여 성장을 활용하세요.\</item><br/>        \<item>NetBoost XL 가격을 검토하세요. 높은 볼륨이지만 낮은 수익입니다.\</item><br/>    \</action_items><br/>\</report> |

</section>

## 예시로 제약하기
원하는 출력의 예시를 제공합니다. 이는 추상적인 지시보다 Claude의 이해를 더 잘 훈련시킵니다.

<section title="예시: 일관된 시장 인텔리전스 생성">

    | Role | Content |
    | ---- | ------- |
    | User | 시장 인텔리전스 AI로서 당신의 작업은 경쟁사에 대한 데이터를 분석하는 것입니다. 다음은 경쟁사 데이터입니다:<br/>\<data><br/>\{\{DATA}}<br/>\</data><br/><br/>다음 예시 형식을 따라 출력하세요:<br/><br/>\<competitor><br/>  \<name>Rival Inc\</name><br/>  \<overview>50단어 요약.\</overview><br/>  \<swot><br/>    \<strengths>- 글머리 기호\</strengths><br/>    \<weaknesses>- 글머리 기호\</weaknesses><br/>    \<opportunities>- 글머리 기호\</opportunities><br/>    \<threats>- 글머리 기호\</threats><br/>  \</swot><br/>  \<strategy>30단어 전략적 대응.\</strategy><br/>\</competitor><br/><br/>이제 이 형식을 사용하여 AcmeGiant와 AcmeDataCo를 분석하세요. |
    | Assistant | \<competitor><br/>  \<name>AcmeGiant\</name><br/>  \<overview>소비자 및 엔터프라이즈 제품의 광범위한 생태계를 가진 글로벌 기술 리더입니다. 혁신, 강력한 브랜드, 통합된 하드웨어, 소프트웨어 및 서비스를 통한 깊은 고객 종속성으로 알려져 있습니다.\</overview><br/>  \<swot><br/>    \<strengths><br/>      - 막대한 R\&D 예산이 지속적인 혁신을 추진<br/>      - 충성스러운 고객 기반과 강력한 브랜드 인지도<br/>      - 시너지 있는 제품 생태계가 전환 비용 증가<br/>    \</strengths><br/>    \<weaknesses><br/>      - 높은 가격이 비용에 민감한 고객을 저지할 수 있음<br/>      - 엔터프라이즈 특정 커스터마이제이션 요구에 대응이 느림<br/>      - 여러 시장에서의 개인정보 보호 우려 및 규제 조사<br/>    \</weaknesses><br/>    \<opportunities><br/>      - AI 및 ML 기능에 대한 증가하는 수요<br/>      - 신흥 시장으로의 확장<br/>      - 제품 또는 인재 격차를 메우기 위한 인수<br/>    \</opportunities><br/>    \<threats><br/>      - 클라우드 네이티브 경쟁사의 급속한 성장<br/>      - 독점금지 소송 및 규제 조치<br/>      - 스타트업 및 경쟁사에 의한 인재 영입<br/>    \</threats><br/>  \</swot><br/>  \<strategy>우리의 민첩성과 커스터마이제이션에 집중하세요. 마케팅에서 TechGiant의 느린 엔터프라이즈 대응과 개인정보 보호 문제를 목표로 하세요.\</strategy><br/>\</competitor><br/><br/>\<competitor><br/>  \<name>AcmeDataCo\</name><br/>  \<overview>데이터 분석 및 시각화 분야의 떠오르는 별입니다. 스타트업과 엔터프라이즈 팀 모두에게 어필하는 직관적인 셀프서비스 BI 도구를 프리미엄 모델로 제공합니다.\</overview><br/>  \<swot><br/>    \<strengths><br/>      - 사용자 친화적 인터페이스가 전문 교육의 필요성을 감소<br/>      - 프리미엄 모델이 진입 장벽을 낮추고 바이럴 성장 유도<br/>      - 데이터 기반 의사결정 증가와의 강한 제품-시장 적합성<br/>    \</strengths><br/>    \<weaknesses><br/>      - 기존 BI 도구에 비해 제한된 고급 분석<br/>      - 매우 큰 데이터셋으로 확장 문제 보고됨<br/>      - 제3자 클라우드 인프라(AWS)에 의존<br/>    \</weaknesses><br/>    \<opportunities><br/>      - 예측 분석 및 AI 기반 인사이트로 확장<br/>      - 보완적 기술 공급업체와의 전략적 제휴 형성<br/>      - 산업별 솔루션을 위한 커스터마이즈 가능한 대시보드<br/>    \</opportunities><br/>    \<threats><br/>      - 시장 포화; 셀프서비스 BI의 많은 신규 진입자<br/>      - 엔터프라이즈 BI 거대 기업들의 더 사용자 친화적 도구 개발<br/>      - 데이터 개인정보 보호 규정이 준수 복잡성 증가<br/>    \</threats><br/>  \</swot><br/>  \<strategy>우리의 강력한 엔터프라이즈 기능과 데이터 거버넌스를 강조하세요. DataCo의 확장 제한으로 어려움을 겪는 계정을 목표로 하세요.\</strategy><br/>\</competitor> |

</section>

## 일관성 있는 컨텍스트를 위해 검색 사용
일관된 컨텍스트가 필요한 작업(예: 챗봇, 지식 기반)의 경우 검색을 사용하여 Claude의 응답을 고정된 정보 집합에 기반하게 합니다.

<section title="예시: IT 지원 일관성 향상">

    | Role | Content |
    | ---- | ------- |
    | User | 당신은 지식 기반 데이터를 활용하는 IT 지원 AI입니다. 다음은 지식 기반의 항목들입니다:<br/><br/>\<kb><br/>  \<entry><br/>    \<id>1\</id><br/>    \<title>Active Directory 비밀번호 재설정\</title><br/>    \<content>1. password.ourcompany.com으로 이동<br/>2. 사용자명 입력<br/>3. "비밀번호 잊음" 클릭<br/>4. 이메일 지시사항 따르기\</content><br/>  \</entry><br/>  \<entry><br/>    \<id>2\</id><br/>    \<title>VPN에 연결\</title><br/>    \<content>1. 소프트웨어 센터에서 GlobalProtect 설치<br/>2. GlobalProtect를 열고 "vpn.ourcompany.com" 입력<br/>3. AD 자격증명으로 로그인\</content><br/>  \</entry><br/>\</kb><br/><br/>사용자를 도울 때 항상 먼저 지식 기반을 확인하세요. 다음 형식으로 응답하세요:<br/><br/>\<response><br/>  \<kb_entry>사용된 지식 기반 항목\</kb_entry><br/>  \<answer>당신의 응답\</answer><br/>\</response> 자신을 위해 몇 가지 테스트 질문을 작성하고 지식 기반을 사용하여 답변하세요. 지식 기반을 올바르게 사용하는 방법을 이해하고 있는지 확인하기 위해서입니다. |
    | Assistant | 이해했습니다. 일관된 응답을 위해 지식 기반을 사용하겠습니다. 몇 가지 시나리오로 테스트해보겠습니다.<br/><br/>사용자: 안녕하세요, 이메일에 로그인할 수 없습니다. 비밀번호를 잊어버린 것 같습니다.<br/><br/>\<response><br/>  \<kb_entry>1: Active Directory 비밀번호 재설정\</kb_entry><br/>  \<answer>이메일 로그인에 문제가 있으신 것 같네요. 비밀번호를 잊으셨다니요. 걱정하지 마세요. 이것은 흔한 문제입니다. 이메일 액세스에 사용되는 Active Directory 비밀번호를 재설정하려면 다음 단계를 따르세요:<br/><br/>1. password.ourcompany.com으로 이동<br/>2. 사용자명 입력 (이메일 주소와 동일)<br/>3. "비밀번호 잊음" 링크 클릭<br/>4. 지시사항이 포함된 이메일을 받게 됩니다. 지시사항을 따라 비밀번호를 재설정하세요.<br/><br/>재설정 후 이메일에 로그인할 수 있어야 합니다. 추가 지원이 필요하면 알려주세요.\</answer><br/>\</response><br/><br/>사용자: 오늘 재택근무 중입니다. 내부 리소스에 어떻게 액세스하나요?<br/><br/>\<response><br/>  \<kb_entry>2: VPN에 연결\</kb_entry><br/>  \<answer>좋은 질문입니다! 재택근무 중 내부 리소스에 액세스하려면 회사 VPN(가상 사설 네트워크)에 연결해야 합니다. 설정 방법은 다음과 같습니다:<br/><br/>1. 먼저 GlobalProtect VPN 클라이언트를 설치하세요. 소프트웨어 센터에서 찾을 수 있습니다.<br/>2. 설치 후 GlobalProtect 애플리케이션을 열으세요.<br/>3. 서버 필드에 "vpn.ourcompany.com"을 입력하세요.<br/>4. Active Directory (AD) 자격증명으로 로그인하세요 - 이메일에 사용하는 것과 동일한 사용자명과 비밀번호입니다.<br/><br/>연결되면 사무실에 있는 것처럼 모든 내부 리소스에 안전하게 액세스할 수 있습니다. 설정 중 문제가 발생하면 알려주세요.\</answer><br/>\</response> |

</section>

## 복잡한 작업을 위해 프롬프트 연결하기
복잡한 작업을 더 작은 일관된 하위 작업으로 분해합니다. 각 하위 작업이 Claude의 전적인 주의를 받으므로 확장된 워크플로우 전체에서 일관성 오류를 줄입니다.