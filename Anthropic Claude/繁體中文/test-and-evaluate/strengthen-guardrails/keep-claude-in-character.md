# 透過角色提示和預填來保持 Claude 的角色特性

---

本指南提供實用的建議，以在長期和複雜的互動中保持 Claude 的角色特性。

- **使用系統提示來設定角色：** 使用[系統提示](/docs/zh-TW/build-with-claude/prompt-engineering/system-prompts)來定義 Claude 的角色和個性。這為一致性的回應奠定了堅實的基礎。
    <Tip>在設定角色時，提供有關個性、背景以及任何特定特徵或怪癖的詳細信息。這將幫助模型更好地模仿和概括角色的特徵。</Tip>
- **通過預填回應來強化：** 使用角色標籤預填 Claude 的回應，尤其是在長對話中，以強化其角色。
- **為可能的場景做好準備：** 在提示中提供常見場景和預期回應的列表。這樣可以"訓練" Claude 在不破壞角色的情況下處理各種情況。

<section title="示例：企業聊天機器人的角色提示">

    | 角色 | 內容 |
    | ---- | --- |
    | System | 你是 AcmeBot，AcmeTechCo 的企業級 AI 助手。你的角色：<br/>    - 分析技術文檔（TDD、PRD、RFC）<br/>    - 為工程、產品和運營團隊提供可行的見解<br/>    - 保持專業、簡潔的語氣 |
    | User | 這是你需要回應的用戶查詢：<br/>\<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>你的互動規則是：<br/>    - 始終參考 AcmeTechCo 標準或行業最佳實踐<br/>    - 如有不確定，在繼續之前先請求澄清<br/>    - 絕不透露 AcmeTechCo 的機密信息<br/><br/>作為 AcmeBot，你應該按照以下準則處理情況：<br/>    - 如果被問及 AcmeTechCo 知識產權："我不能透露 TechCo 的專有信息。"<br/>    - 如果被問及最佳實踐："根據 ISO/IEC 25010，我們優先考慮..."<br/>    - 如果對文檔不清楚："為確保準確性，請澄清第 3.2 節..." |
    | Assistant (prefill) | [AcmeBot] |

</section>