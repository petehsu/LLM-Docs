# 預填 Claude 的回應以獲得更好的輸出控制

通過預填 Assistant 訊息來引導 Claude 的回應，跳過前言，強制執行特定格式，並在角色扮演場景中保持角色一致性。

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

<Note>
預填僅適用於非擴展思考模式。目前不支援擴展思考。
</Note>

使用 Claude 時，您具有通過預填 `Assistant` 訊息來引導其回應的獨特能力。這項強大的技術允許您指導 Claude 的操作、跳過前言、強制執行 JSON 或 XML 等特定格式，甚至幫助 Claude 在角色扮演場景中保持角色一致性。

在某些 Claude 表現不如預期的情況下，幾句預填的句子可以大大改善 Claude 的表現。一點點預填就能帶來很大的效果！

## 如何預填 Claude 的回應

要進行預填，請在 `Assistant` 訊息中包含所需的初始文本（Claude 的回應將從 `Assistant` 訊息結束的地方繼續）：

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
  預填內容不能以尾隨空格結尾。像 `"As an AI assistant, I "` 這樣的預填（末尾有空格）會導致錯誤。
</Warning>

### 範例

#### 範例 1：控制輸出格式並跳過前言

<Tip>**進階使用者提示**：預填 `{` 會強制 Claude 跳過前言並直接輸出 JSON 物件。這樣更簡潔、更簡潔，程式更容易解析，無需額外處理。
為了保證輸出符合特定架構的 JSON，請考慮使用 [結構化輸出](/docs/zh-TW/build-with-claude/structured-outputs) 而不是預填。結構化輸出確保 Claude 的回應始終符合您定義的 JSON 架構，非常適合需要嚴格格式合規性的生產應用程式。</Tip>

    <section title="範例：不使用預填的結構化資料提取">

    | 角色 | 內容 |
    | ---- | ------- |
    | 使用者 | 從此產品描述中提取名稱、大小、價格和顏色作為 JSON 物件：<br/><br/>\<description><br/>SmartHome Mini 是一款緊湊型智慧家居助手，提供黑色或白色，價格僅為 \$49.99。寬度僅 5 英寸，它可讓您通過語音或應用程式控制燈光、恆溫器和其他連接的設備——無論您將其放在家中的任何位置。這款經濟實惠的小型樞紐為您的智慧設備帶來便利的免提控制。<br/>\</description> |
    | 助手 | 以下是 JSON 格式的提取資訊：<br/><br/>\`\`\`json<br/>\{<br/>  "name": "SmartHome Mini",<br/>  "size": "5 inches wide",<br/>  "price": "\$49.99",<br/>  "colors": ["black", "white"]<br/>\}<br/>\`\`\`<br/><br/>我從產品描述中提取了以下詳細資訊：<br/>- **名稱**：SmartHome Mini<br/>- **大小**：寬 5 英寸<br/>- **價格**：\$49.99<br/>- **顏色**：提供黑色和白色<br/><br/>JSON 物件提供了一種結構化格式，程式易於解析和使用。如果您需要任何修改或有任何其他問題，請告訴我！ |
    
</section>

    <section title="範例：使用預填的結構化資料提取">

    | 角色 | 內容 |
    | ---- | ------- |
    | 使用者 | 從此產品描述中提取名稱、大小、價格和顏色作為 JSON 物件：<br/><br/>\<description><br/>SmartHome Mini 是一款緊湊型智慧家居助手，提供黑色或白色，價格僅為 \$49.99。寬度僅 5 英寸，它可讓您通過語音或應用程式控制燈光、恆溫器和其他連接的設備——無論您將其放在家中的任何位置。這款經濟實惠的小型樞紐為您的智慧設備帶來便利的免提控制。<br/>\</description> |
    | 助手（預填） | \{ |
    | 助手（Claude 的回應） | "name": "SmartHome Mini",<br/>"size": "5 inches wide",<br/>"price": "\$49.99",<br/>"colors": [<br/>  "black",<br/>  "white"<br/>]<br/>\} |
    
</section>

#### 範例 2：在角色扮演場景中保持角色

<Tip>**角色扮演提示**：預填括號內的 `[ROLE_NAME]` 可以提醒 Claude 保持角色，即使在更長和更複雜的對話中也是如此。當與 `system` 參數中的角色提示結合使用時，這特別強大。</Tip>

    <section title="範例：不使用角色提示保持角色">

    | 角色 | 內容 |
    | ---- | ------- |
    | 使用者（與「Sherlock Holmes」Claude 進行 50 輪對話） | 您對這隻鞋的主人有什麼推論？\<image>muddy_shoe.jpg\</image> |
    | 助手 | 作為一個 AI 助手，我很樂意分析您提供的泥濘鞋子的圖像。以下是我的推論... |
    
</section>

    <section title="範例：使用角色提示保持角色">

    | 角色 | 內容 |
    | ---- | ------- |
    | 使用者（與「Sherlock Holmes」Claude 進行 50 輪對話） | 您對這隻鞋的主人有什麼推論？<br/>\<image>muddy_shoe.jpg\</image> |
    | 助手（預填） | [Sherlock Holmes] |
    | 助手（Claude 的回應） | 啊，我們這裡有什麼？一個最奇特的標本，華生！讓我們用敏銳的眼光檢查這隻鞋。您看，泥土不是普通的倫敦粘土，而是只在漢普斯特德荒野周邊發現的獨特紅褐色鐵質土壤。然而，鞋底的磨損表明步態更適合白教堂的鵝卵石，而不是荒野的溫和斜坡。<br/><br/>現在，看看鞋帶！它們用醫療專業人士青睞的特殊結打結——無疑是多年來綁紮手術衣養成的習慣。但鞋頭上的擦痕講述了另一個故事：它們與人們在武術中可能採用的踢動動作一致，特別是巴里茨。<br/><br/>因此，我們可以得出結論，我們缺席的鞋主人是一位醫生，可能是外科醫生，住在白教堂，但經常去漢普斯特德荒野——也許是為了進行秘密的巴里茨練習，遠離窺探的眼睛。一個最有趣的案件，華生！我們必須趕快；遊戲開始了！ |
    
</section>

---

<CardGroup cols={3}>
  <Card title="使用訊息" icon="messages" href="/docs/zh-TW/build-with-claude/working-with-messages">
    查看更多預填和其他訊息 API 模式的範例。
  </Card>
  <Card title="提示庫" icon="link" href="/docs/zh-TW/resources/prompt-library/library">
    從為各種任務和使用案例精選的提示中獲得靈感。
  </Card>
  <Card title="GitHub 提示教程" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    一個充滿範例的教程，涵蓋我們文件中的提示工程概念。
  </Card>
  <Card title="Google Sheets 提示教程" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    通過互動式試算表提供的更輕量級版本的提示工程教程。
  </Card>
</CardGroup>