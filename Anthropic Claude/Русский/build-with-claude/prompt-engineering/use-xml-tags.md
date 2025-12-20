# Используйте XML-теги для структурирования ваших подсказок

Узнайте, как использовать XML-теги для структурирования подсказок и повышения качества результатов Claude.

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Когда ваши подсказки содержат несколько компонентов, таких как контекст, инструкции и примеры, XML-теги могут стать настоящим спасением. Они помогают Claude более точно анализировать ваши подсказки, что приводит к результатам более высокого качества.

<Tip>**Совет по XML**: Используйте теги вроде `<instructions>`, `<example>` и `<formatting>` для четкого разделения различных частей вашей подсказки. Это предотвращает смешивание инструкций с примерами или контекстом.</Tip>

## Зачем использовать XML-теги?

- **Ясность:** Четко разделяйте различные части вашей подсказки и убедитесь, что ваша подсказка хорошо структурирована.
- **Точность:** Снижайте ошибки, вызванные неправильным толкованием Claude частей вашей подсказки.
- **Гибкость:** Легко находите, добавляйте, удаляйте или изменяйте части вашей подсказки без переписывания всего.
- **Парсируемость:** Использование Claude XML-тегов в своем выводе облегчает извлечение конкретных частей его ответа путем постобработки.

<Note>Нет канонических "лучших" XML-тегов, на которых Claude был бы специально обучен, хотя мы рекомендуем, чтобы названия ваших тегов имели смысл в отношении информации, которую они окружают.</Note>

***

## Лучшие практики использования тегов

1. **Будьте последовательны**: Используйте одни и те же названия тегов во всех ваших подсказках и ссылайтесь на эти названия тегов при обсуждении содержимого (например, `Using the contract in <contract> tags...`).
2. **Вложенные теги**: Вы должны вкладывать теги `<outer><inner></inner></outer>` для иерархического содержимого.

<Tip>**Совет для опытных пользователей**: Комбинируйте XML-теги с другими методами, такими как многошаговое промптирование (`<examples>`) или цепочка рассуждений (`<thinking>`, `<answer>`). Это создает супер-структурированные, высокопроизводительные подсказки.</Tip>

### Примеры

  <section title="Пример: Создание финансовых отчетов">

    Без XML-тегов Claude неправильно понимает задачу и создает отчет, который не соответствует требуемой структуре или тону. После подстановки также существует вероятность того, что Claude неправильно поймет, где заканчивается один раздел (например, пример отчета Q1) и начинается другой.

    | Роль | Без XML-тегов | С XML-тегами |
    | ---- | ----------- | ------------- |
    | Пользователь | You're a financial analyst at AcmeCorp. Generate a Q2 financial report for our investors. Include sections on Revenue Growth, Profit Margins, and Cash Flow, like with this example from last year: \{\{Q1_REPORT\}\}. Use data points from this spreadsheet: \{\{SPREADSHEET_DATA\}\}. The report should be extremely concise, to the point, professional, and in list format. It should and highlight both strengths and areas for improvement. | You're a financial analyst at AcmeCorp. Generate a Q2 financial report for our investors.<br/><br/>AcmeCorp is a B2B SaaS company. Our investors value transparency and actionable insights.<br/><br/>Use this data for your report:\<data>\{\{SPREADSHEET_DATA\}\}\</data><br/><br/>\<instructions><br/>1. Include sections: Revenue Growth, Profit Margins, Cash Flow.<br/>2. Highlight strengths and areas for improvement.<br/>\</instructions><br/><br/>Make your tone concise and professional. Follow this structure:<br/>\<formatting_example>\{\{Q1_REPORT\}\}\</formatting_example> |
    | Ассистент | Q2 Financial Report for AcmeCorp Investors<br/><br/>Dear Valued Investors,<br/><br/>I am pleased to present our Q2 financial report, showcasing AcmeCorp's continued growth and resilience in the B2B SaaS market.<br/><br/>1. Revenue Growth:<br/>Our Q2 revenue reached \$15.2M, a 22% YoY increase. This growth is primarily driven by a 30% expansion in our enterprise client base. However, our SMB segment saw a slight decline of 5%, which we aim to address through targeted marketing initiatives in Q3.<br/><br/>2. Profit Margins:<br/>Gross margin improved to 72% (up 3% from Q1) due to infrastructure optimizations. EBITDA margin, however, dipped to 18% (down 2%) as we invested heavily in R&D for our upcoming AI-driven features.<br/><br/>3. Cash Flow:<br/>Operating cash flow remains strong at \$4.1M. Our cash reserves stand at \$28M, providing a 15-month runway at current burn rate. We did see a 20% increase in customer acquisition costs, which we're addressing through more efficient sales strategies.<br/><br/>In summary, AcmeCorp's core financials remain robust. We're balancing growth investments with prudent cash management. Our focus for Q3 will be revitalizing SMB growth and optimizing sales efficiency.<br/><br/>Thank you for your continued trust.<br/><br/>Sincerely,<br/>CFO, AcmeCorp | Q2 Financial Report for AcmeCorp Investors\</output><br/><br/>Revenue Growth:<br/>- Q2 revenue: \$15.2M (22% YoY ↑)<br/>- Enterprise clients: 30% ↑<br/>- SMB segment: 5% ↓<br/>  Action: Targeted Q3 marketing<br/><br/>Profit Margins:<br/>- Gross margin: 72% (3% ↑ from Q1)<br/>  Reason: Infrastructure optimizations<br/>- EBITDA margin: 18% (2% ↓)<br/>  Reason: R&D investment in AI features<br/><br/>Cash Flow:<br/>- Operating cash flow: \$4.1M (strong)<br/>- Cash reserves: \$28M (15-month runway)<br/>- Customer acquisition cost: 20% ↑<br/>  Action: Optimize sales strategies<br/><br/>Outlook:<br/>- Core financials: Robust<br/>- Q3 focus: Revitalize SMB, optimize sales<br/><br/>Management remains committed to balancing growth investments with financial discipline. |
  
</section>
  <section title="Пример: Анализ юридического контракта">

    Без XML-тегов анализ Claude неорганизован и упускает ключевые моменты. С тегами он предоставляет структурированный, тщательный анализ, на основе которого может действовать юридическая команда.

    | Роль | Без XML-тегов | С XML-тегами |
    | ---- | ----------- | ------------- |
    | Пользователь | Analyze this software licensing agreement for potential risks and liabilities: \{\{CONTRACT\}\}. Focus on indemnification, limitation of liability, and IP ownership clauses. Also, note any unusual or concerning terms. Here's our standard contract for reference: \{\{STANDARD_CONTRACT\}\}. Give a summary of findings and recommendations for our legal team. | Analyze this software licensing agreement for legal risks and liabilities.<br/><br/>We're a multinational enterprise considering this agreement for our core data infrastructure.<br/><br/>\<agreement><br/>\{\{CONTRACT\}\}\</agreement><br/><br/>This is our standard contract for reference:<br/>\<standard_contract>\{\{STANDARD_CONTRACT\}\}\</standard_contract><br/><br/>\<instructions><br/>1. Analyze these clauses:<br/>   - Indemnification<br/>   - Limitation of liability<br/>   - IP ownership<br/><br/>2. Note unusual or concerning terms.<br/><br/>3. Compare to our standard contract.<br/><br/>4. Summarize findings in \<findings> tags.<br/><br/>5. List actionable recommendations in \<recommendations> tags.\</instructions> |
    | Ассистент | The provided software licensing agreement presents several concerning aspects. The indemnification clause is overly broad, potentially exposing us to significant liabilities. The limitation of liability section caps damages at a mere \$500, which is inadequate for our enterprise-level usage. Regarding IP, the agreement grants the vendor joint ownership of any modifications or integrations we create.<br/><br/>In summary, this agreement is not in our best interest. It exposes us to undue risk, limits our recourse in case of failures, and compromises our intellectual property rights. I recommend renegotiating these terms or seeking alternative vendors. | \<findings><br/>1. Indemnification (Clause 8):<br/>   - Issue: Overly broad. We indemnify vendor against "any and all claims" arising from our use.<br/>   - Risk: Could hold us liable even for vendor's negligence or product defects.<br/>   - Deviation: Our standard limits indemnity to claims arising from our violation of agreement.<br/><br/>2. Limitation of Liability (Clause 9):<br/>   - Issue: Caps all damages at \$500, including direct damages.<br/>   - Risk: Grossly inadequate for enterprise use. A critical failure could cost millions.<br/>   - Deviation: Our standard allows for direct damages up to 12 months of fees paid.<br/><br/>3. IP Ownership (Clause 12):<br/>   - Issue: Grants vendor joint ownership of our modifications/integrations.<br/>   - Risk: Vendor could use or sell our proprietary algorithms or data insights.<br/>   - Deviation: Our standard retains full ownership of our work.<br/><br/>4. Unusual Terms:<br/>   - Clause 5.3: Vendor can use our usage data for "any purpose."<br/>   - Clause 7.2: Vendor can terminate for "convenience" with only 7 days' notice.<br/>   - Clause 11: No warranties of any kind, even for basic merchantability.<br/>\</findings><br/><br/>\<recommendations><br/>1. Reject this agreement. Risks far outweigh benefits for an enterprise.<br/>2. Counter-propose:<br/>   - Indemnification: Limit to claims arising from our violation of agreement.<br/>   - Liability: Cap at 12 months' fees for direct damages; negotiate for indirect.<br/>   - IP: Full ownership of our modifications/integrations.<br/>   - Data Use: Restrict to service improvement only.<br/>   - Termination: Minimum 90 days' notice; only for cause.<br/>   - Warranties: Demand basic merchantability and fitness for purpose.<br/>3. If vendor refuses, explore alternative providers or in-house solutions.<br/>4. Engage legal counsel for contract negotiation given high stakes.<br/>\</recommendations> |
  
</section>

***

<CardGroup cols={3}>
  <Card title="Библиотека подсказок" icon="link" href="/docs/ru/resources/prompt-library/library">
    Вдохновитесь тщательно отобранной коллекцией подсказок для различных задач и вариантов использования.
  </Card>
  <Card title="Учебное пособие GitHub по промптингу" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    Полное примерами учебное пособие, охватывающее концепции инженерии подсказок, найденные в нашей документации.
  </Card>
  <Card title="Учебное пособие Google Sheets по промптингу" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    Более легкая версия нашего учебного пособия по инженерии подсказок через интерактивную электронную таблицу.
  </Card>
</CardGroup>