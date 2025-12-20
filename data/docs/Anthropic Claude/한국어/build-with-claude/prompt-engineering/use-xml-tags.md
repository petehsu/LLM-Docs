# XML 태그를 사용하여 프롬프트 구조화하기

XML 태그를 사용하여 프롬프트를 구조화하고 Claude의 응답 품질을 향상시키는 방법을 알아봅니다.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

프롬프트에 컨텍스트, 지시사항, 예제와 같은 여러 구성 요소가 포함되어 있을 때 XML 태그는 게임 체인저가 될 수 있습니다. XML 태그는 Claude가 프롬프트를 더 정확하게 파싱하도록 도와주어 더 높은 품질의 출력을 생성합니다.

<Tip>**XML 팁**: `<instructions>`, `<example>`, `<formatting>`과 같은 태그를 사용하여 프롬프트의 다양한 부분을 명확하게 분리하세요. 이렇게 하면 Claude가 지시사항을 예제나 컨텍스트와 혼동하지 않습니다.</Tip>

## XML 태그를 사용하는 이유는 무엇인가요?

- **명확성:** 프롬프트의 다양한 부분을 명확하게 분리하고 프롬프트가 잘 구조화되어 있는지 확인합니다.
- **정확성:** Claude가 프롬프트의 일부를 잘못 해석하여 발생하는 오류를 줄입니다.
- **유연성:** 전체를 다시 작성하지 않고도 프롬프트의 일부를 쉽게 찾고, 추가하고, 제거하거나 수정할 수 있습니다.
- **파싱 가능성:** Claude가 출력에서 XML 태그를 사용하면 후처리를 통해 응답의 특정 부분을 더 쉽게 추출할 수 있습니다.

<Note>Claude가 특별히 학습한 정규적인 "최고의" XML 태그는 없지만, 태그 이름이 주변 정보와 의미 있게 연결되도록 하는 것을 권장합니다.</Note>

***

## 태그 지정 모범 사례

1. **일관성 유지**: 프롬프트 전체에서 동일한 태그 이름을 사용하고, 콘텐츠에 대해 이야기할 때 해당 태그 이름을 참조하세요(예: `<contract> 태그의 계약을 사용하여...`).
2. **태그 중첩**: 계층적 콘텐츠의 경우 `<outer><inner></inner></outer>`와 같이 태그를 중첩해야 합니다.

<Tip>**파워 유저 팁**: XML 태그를 멀티샷 프롬팅(`<examples>`) 또는 사고의 연쇄(`<thinking>`, `<answer>`)와 같은 다른 기법과 결합하세요. 이렇게 하면 매우 구조화되고 고성능의 프롬프트가 만들어집니다.</Tip>

### 예제

  <section title="예제: 재무 보고서 생성">

    XML 태그가 없으면 Claude가 작업을 잘못 이해하고 필요한 구조나 톤과 맞지 않는 보고서를 생성합니다. 대체 후에도 Claude가 한 섹션(예: Q1 보고서 예제)이 끝나고 다른 섹션이 시작되는 위치를 잘못 이해할 가능성이 있습니다.

    | 역할 | XML 태그 없음 | XML 태그 포함 |
    | ---- | ----------- | ------------- |
    | 사용자 | You're a financial analyst at AcmeCorp. Generate a Q2 financial report for our investors. Include sections on Revenue Growth, Profit Margins, and Cash Flow, like with this example from last year: \{\{Q1_REPORT\}\}. Use data points from this spreadsheet: \{\{SPREADSHEET_DATA\}\}. The report should be extremely concise, to the point, professional, and in list format. It should and highlight both strengths and areas for improvement. | You're a financial analyst at AcmeCorp. Generate a Q2 financial report for our investors.<br/><br/>AcmeCorp is a B2B SaaS company. Our investors value transparency and actionable insights.<br/><br/>Use this data for your report:\<data>\{\{SPREADSHEET_DATA\}\}\</data><br/><br/>\<instructions><br/>1. Include sections: Revenue Growth, Profit Margins, Cash Flow.<br/>2. Highlight strengths and areas for improvement.<br/>\</instructions><br/><br/>Make your tone concise and professional. Follow this structure:<br/>\<formatting_example>\{\{Q1_REPORT\}\}\</formatting_example> |
    | 어시스턴트 | Q2 Financial Report for AcmeCorp Investors<br/><br/>Dear Valued Investors,<br/><br/>I am pleased to present our Q2 financial report, showcasing AcmeCorp's continued growth and resilience in the B2B SaaS market.<br/><br/>1. Revenue Growth:<br/>Our Q2 revenue reached \$15.2M, a 22% YoY increase. This growth is primarily driven by a 30% expansion in our enterprise client base. However, our SMB segment saw a slight decline of 5%, which we aim to address through targeted marketing initiatives in Q3.<br/><br/>2. Profit Margins:<br/>Gross margin improved to 72% (up 3% from Q1) due to infrastructure optimizations. EBITDA margin, however, dipped to 18% (down 2%) as we invested heavily in R&D for our upcoming AI-driven features.<br/><br/>3. Cash Flow:<br/>Operating cash flow remains strong at \$4.1M. Our cash reserves stand at \$28M, providing a 15-month runway at current burn rate. We did see a 20% increase in customer acquisition costs, which we're addressing through more efficient sales strategies.<br/><br/>In summary, AcmeCorp's core financials remain robust. We're balancing growth investments with prudent cash management. Our focus for Q3 will be revitalizing SMB growth and optimizing sales efficiency.<br/><br/>Thank you for your continued trust.<br/><br/>Sincerely,<br/>CFO, AcmeCorp | Q2 Financial Report for AcmeCorp Investors\</output><br/><br/>Revenue Growth:<br/>- Q2 revenue: \$15.2M (22% YoY ↑)<br/>- Enterprise clients: 30% ↑<br/>- SMB segment: 5% ↓<br/>  Action: Targeted Q3 marketing<br/><br/>Profit Margins:<br/>- Gross margin: 72% (3% ↑ from Q1)<br/>  Reason: Infrastructure optimizations<br/>- EBITDA margin: 18% (2% ↓)<br/>  Reason: R&D investment in AI features<br/><br/>Cash Flow:<br/>- Operating cash flow: \$4.1M (strong)<br/>- Cash reserves: \$28M (15-month runway)<br/>- Customer acquisition cost: 20% ↑<br/>  Action: Optimize sales strategies<br/><br/>Outlook:<br/>- Core financials: Robust<br/>- Q3 focus: Revitalize SMB, optimize sales<br/><br/>Management remains committed to balancing growth investments with financial discipline. |
  
</section>
  <section title="예제: 법적 계약 분석">

    XML 태그가 없으면 Claude의 분석이 체계적이지 않고 핵심 사항을 놓칩니다. 태그를 사용하면 법무팀이 조치를 취할 수 있는 구조화되고 철저한 분석을 제공합니다.

    | 역할 | XML 태그 없음 | XML 태그 포함 |
    | ---- | ----------- | ------------- |
    | 사용자 | Analyze this software licensing agreement for potential risks and liabilities: \{\{CONTRACT\}\}. Focus on indemnification, limitation of liability, and IP ownership clauses. Also, note any unusual or concerning terms. Here's our standard contract for reference: \{\{STANDARD_CONTRACT\}\}. Give a summary of findings and recommendations for our legal team. | Analyze this software licensing agreement for legal risks and liabilities.<br/><br/>We're a multinational enterprise considering this agreement for our core data infrastructure.<br/><br/>\<agreement><br/>\{\{CONTRACT\}\}\</agreement><br/><br/>This is our standard contract for reference:<br/>\<standard_contract>\{\{STANDARD_CONTRACT\}\}\</standard_contract><br/><br/>\<instructions><br/>1. Analyze these clauses:<br/>   - Indemnification<br/>   - Limitation of liability<br/>   - IP ownership<br/><br/>2. Note unusual or concerning terms.<br/><br/>3. Compare to our standard contract.<br/><br/>4. Summarize findings in \<findings> tags.<br/><br/>5. List actionable recommendations in \<recommendations> tags.\</instructions> |
    | 어시스턴트 | The provided software licensing agreement presents several concerning aspects. The indemnification clause is overly broad, potentially exposing us to significant liabilities. The limitation of liability section caps damages at a mere \$500, which is inadequate for our enterprise-level usage. Regarding IP, the agreement grants the vendor joint ownership of any modifications or integrations we create.<br/><br/>In summary, this agreement is not in our best interest. It exposes us to undue risk, limits our recourse in case of failures, and compromises our intellectual property rights. I recommend renegotiating these terms or seeking alternative vendors. | \<findings><br/>1. Indemnification (Clause 8):<br/>   - Issue: Overly broad. We indemnify vendor against "any and all claims" arising from our use.<br/>   - Risk: Could hold us liable even for vendor's negligence or product defects.<br/>   - Deviation: Our standard limits indemnity to claims arising from our violation of agreement.<br/><br/>2. Limitation of Liability (Clause 9):<br/>   - Issue: Caps all damages at \$500, including direct damages.<br/>   - Risk: Grossly inadequate for enterprise use. A critical failure could cost millions.<br/>   - Deviation: Our standard allows for direct damages up to 12 months of fees paid.<br/><br/>3. IP Ownership (Clause 12):<br/>   - Issue: Grants vendor joint ownership of our modifications/integrations.<br/>   - Risk: Vendor could use or sell our proprietary algorithms or data insights.<br/>   - Deviation: Our standard retains full ownership of our work.<br/><br/>4. Unusual Terms:<br/>   - Clause 5.3: Vendor can use our usage data for "any purpose."<br/>   - Clause 7.2: Vendor can terminate for "convenience" with only 7 days' notice.<br/>   - Clause 11: No warranties of any kind, even for basic merchantability.<br/>\</findings><br/><br/>\<recommendations><br/>1. Reject this agreement. Risks far outweigh benefits for an enterprise.<br/>2. Counter-propose:<br/>   - Indemnification: Limit to claims arising from our violation of agreement.<br/>   - Liability: Cap at 12 months' fees for direct damages; negotiate for indirect.<br/>   - IP: Full ownership of our modifications/integrations.<br/>   - Data Use: Restrict to service improvement only.<br/>   - Termination: Minimum 90 days' notice; only for cause.<br/>   - Warranties: Demand basic merchantability and fitness for purpose.<br/>3. If vendor refuses, explore alternative providers or in-house solutions.<br/>4. Engage legal counsel for contract negotiation given high stakes.<br/>\</recommendations> |
  
</section>

***

<CardGroup cols={3}>
  <Card title="프롬프트 라이브러리" icon="link" href="/docs/ko/resources/prompt-library/library">
    다양한 작업 및 사용 사례에 대한 엄선된 프롬프트 선택으로 영감을 얻으세요.
  </Card>
  <Card title="GitHub 프롬팅 튜토리얼" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    당사 문서에서 찾을 수 있는 프롬프트 엔지니어링 개념을 다루는 예제가 풍부한 튜토리얼입니다.
  </Card>
  <Card title="Google Sheets 프롬팅 튜토리얼" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    대화형 스프레드시트를 통한 프롬프트 엔지니어링 튜토리얼의 더 가벼운 버전입니다.
  </Card>
</CardGroup>