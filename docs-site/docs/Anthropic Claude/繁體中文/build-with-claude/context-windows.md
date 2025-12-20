# 上下文窗口

了解語言模型的上下文窗口如何工作，包括標準窗口、擴展思考和工具使用的行為。

---

## 理解上下文窗口

「上下文窗口」是指語言模型在生成新文本時可以回顧和參考的全部文本量，加上它生成的新文本。這與語言模型訓練所用的大型數據語料庫不同，而是代表模型的「工作記憶」。較大的上下文窗口允許模型理解和回應更複雜和冗長的提示，而較小的上下文窗口可能會限制模型處理較長提示或在延長對話中保持連貫性的能力。

下圖說明了 API 請求的標準上下文窗口行為<sup>1</sup>：

![上下文窗口圖表](/docs/images/context-window.svg)

_<sup>1</sup>對於聊天介面，例如 [claude.ai](https://claude.ai/)，上下文窗口也可以設置為滾動「先進先出」系統。_

* **漸進式令牌累積：** 隨著對話在各個回合中進行，每個用戶消息和助手回應都會在上下文窗口內累積。先前的回合完全保留。
* **線性增長模式：** 上下文使用量隨著每個回合線性增長，先前的回合完全保留。
* **200K 令牌容量：** 總可用上下文窗口（200,000 個令牌）代表用於存儲對話歷史和從 Claude 生成新輸出的最大容量。
* **輸入-輸出流：** 每個回合包括：
  - **輸入階段：** 包含所有先前的對話歷史加上當前用戶消息
  - **輸出階段：** 生成成為未來輸入一部分的文本回應

## 擴展思考的上下文窗口

使用[擴展思考](/docs/zh-TW/build-with-claude/extended-thinking)時，所有輸入和輸出令牌，包括用於思考的令牌，都計入上下文窗口限制，在多回合情況下有一些細微差別。

思考預算令牌是您 `max_tokens` 參數的子集，作為輸出令牌計費，並計入速率限制。

但是，先前的思考塊由 Claude API 自動從上下文窗口計算中剝離，不是模型在後續回合中「看到」的對話歷史的一部分，為實際對話內容保留令牌容量。

下圖演示了啟用擴展思考時的專門令牌管理：

![擴展思考的上下文窗口圖表](/docs/images/context-window-thinking.svg)

* **剝離擴展思考：** 擴展思考塊（以深灰色顯示）在每個回合的輸出階段生成，**但不作為後續回合的輸入令牌進行轉發**。您不需要自己剝離思考塊。Claude API 會在您將其傳回時自動執行此操作。
* **技術實現細節：**
  - 當您將思考塊作為對話歷史的一部分傳回時，API 會自動排除先前回合的思考塊。
  - 擴展思考令牌僅在生成期間作為輸出令牌計費一次。
  - 有效的上下文窗口計算變為：`context_window = (input_tokens - previous_thinking_tokens) + current_turn_tokens`。
  - 思考令牌包括 `thinking` 塊和 `redacted_thinking` 塊。

此架構具有令牌效率，允許進行廣泛的推理而不浪費令牌，因為思考塊的長度可能很大。

<Note>
您可以在我們的[擴展思考指南](/docs/zh-TW/build-with-claude/extended-thinking)中閱讀有關上下文窗口和擴展思考的更多信息。
</Note>

## 擴展思考和工具使用的上下文窗口

下圖說明了結合擴展思考和工具使用時的上下文窗口令牌管理：

![擴展思考和工具使用的上下文窗口圖表](/docs/images/context-window-thinking-tools.svg)

<Steps>
  <Step title="第一個回合架構">
    - **輸入組件：** 工具配置和用戶消息
    - **輸出組件：** 擴展思考 + 文本回應 + 工具使用請求
    - **令牌計算：** 所有輸入和輸出組件都計入上下文窗口，所有輸出組件都作為輸出令牌計費。
  </Step>
  <Step title="工具結果處理（回合 2）">
    - **輸入組件：** 第一個回合中的每個塊以及 `tool_result`。擴展思考塊**必須**與相應的工具結果一起返回。這是您**必須**返回思考塊的唯一情況。
    - **輸出組件：** 工具結果傳回給 Claude 後，Claude 將僅以文本回應（在下一個 `user` 消息之前沒有額外的擴展思考）。
    - **令牌計算：** 所有輸入和輸出組件都計入上下文窗口，所有輸出組件都作為輸出令牌計費。
  </Step>
  <Step title="第三步">
    - **輸入組件：** 所有輸入和前一個回合的輸出都會進行轉發，除了思考塊，現在可以丟棄，因為 Claude 已完成整個工具使用週期。如果您將其傳回，API 將自動為您剝離思考塊，或者您可以在此階段自由地自己剝離它。這也是您添加下一個 `User` 回合的地方。
    - **輸出組件：** 由於在工具使用週期外有新的 `User` 回合，Claude 將生成新的擴展思考塊並從那裡繼續。
    - **令牌計算：** 先前的思考令牌會自動從上下文窗口計算中剝離。所有其他先前的塊仍然計為令牌窗口的一部分，當前 `Assistant` 回合中的思考塊計為上下文窗口的一部分。
  </Step>
</Steps>

* **工具使用與擴展思考的考慮事項：**
  - 發佈工具結果時，必須包含伴隨該特定工具請求的整個未修改的思考塊（包括簽名/編輯部分）。
  - 擴展思考與工具使用的有效上下文窗口計算變為：`context_window = input_tokens + current_turn_tokens`。
  - 系統使用密碼簽名來驗證思考塊的真實性。在工具使用期間未能保留思考塊可能會破壞 Claude 的推理連續性。因此，如果您修改思考塊，API 將返回錯誤。

<Note>
Claude 4 模型支持[交錯思考](/docs/zh-TW/build-with-claude/extended-thinking#interleaved-thinking)，這使 Claude 能夠在工具調用之間進行思考，並在接收工具結果後進行更複雜的推理。

Claude Sonnet 3.7 不支持交錯思考，因此在沒有非 `tool_result` 用戶回合的情況下，擴展思考和工具調用之間沒有交錯。

有關使用工具與擴展思考的更多信息，請參閱我們的[擴展思考指南](/docs/zh-TW/build-with-claude/extended-thinking#extended-thinking-with-tool-use)。
</Note>

## 1M 令牌上下文窗口

Claude Sonnet 4 和 4.5 支持 100 萬令牌的上下文窗口。此擴展上下文窗口允許您處理更大的文檔、維護更長的對話，並使用更廣泛的代碼庫。

<Note>
1M 令牌上下文窗口目前在[使用層級](/docs/zh-TW/api/rate-limits) 4 的組織和具有自定義速率限制的組織中處於測試版。1M 令牌上下文窗口僅適用於 Claude Sonnet 4 和 Sonnet 4.5。
</Note>

要使用 1M 令牌上下文窗口，請在您的 API 請求中包含 `context-1m-2025-08-07` [測試版標頭](/docs/zh-TW/api/beta-headers)：

<CodeGroup>

```python Python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Process this large document..."}
    ],
    betas=["context-1m-2025-08-07"]
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const msg = await anthropic.beta.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Process this large document...' }
  ],
  betas: ['context-1m-2025-08-07']
});
```

```bash cURL
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: context-1m-2025-08-07" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Process this large document..."}
    ]
  }'
```

</CodeGroup>

**重要考慮事項：**
- **測試版狀態**：這是一個可能會改變的測試版功能。功能和定價可能會在未來版本中修改或移除。
- **使用層級要求**：1M 令牌上下文窗口適用於[使用層級](/docs/zh-TW/api/rate-limits) 4 的組織和具有自定義速率限制的組織。較低層級的組織必須升級到使用層級 4 才能訪問此功能。
- **可用性**：1M 令牌上下文窗口目前在 Claude API、[Microsoft Foundry](/docs/zh-TW/build-with-claude/claude-in-microsoft-foundry)、[Amazon Bedrock](/docs/zh-TW/build-with-claude/claude-on-amazon-bedrock) 和 [Google Cloud 的 Vertex AI](/docs/zh-TW/build-with-claude/claude-on-vertex-ai) 上可用。
- **定價**：超過 200K 令牌的請求會自動按高級費率計費（2 倍輸入、1.5 倍輸出定價）。有關詳細信息，請參閱[定價文檔](/docs/zh-TW/about-claude/pricing#long-context-pricing)。
- **速率限制**：長上下文請求具有專用的速率限制。有關詳細信息，請參閱[速率限制文檔](/docs/zh-TW/api/rate-limits#long-context-rate-limits)。
- **多模態考慮事項**：處理大量圖像或 PDF 時，請注意文件的令牌使用情況可能會有所不同。將大型提示與大量圖像配對時，您可能會達到[請求大小限制](/docs/zh-TW/api/overview#request-size-limits)。

## Claude Sonnet 4.5 和 Haiku 4.5 中的上下文感知

Claude Sonnet 4.5 和 Claude Haiku 4.5 具有**上下文感知**功能，使這些模型能夠在整個對話中跟蹤其剩餘的上下文窗口（即「令牌預算」）。這使 Claude 能夠通過理解它有多少空間來工作，更有效地執行任務和管理上下文。Claude 本身經過訓練，可以精確使用此上下文來堅持任務直到最後，而不是猜測還有多少令牌剩餘。對於模型來說，缺乏上下文感知就像在沒有時鐘的烹飪節目中競爭。Claude 4.5 模型通過明確告知模型其剩餘上下文來改變這一點，以便它可以最大限度地利用可用令牌。

**工作原理：**

在對話開始時，Claude 會收到有關其總上下文窗口的信息：

```
<budget:token_budget>200000</budget:token_budget>
```

預算設置為 200K 令牌（標準）、500K 令牌（Claude.ai 企業版）或 100 萬令牌（測試版，適用於符合條件的組織）。

在每次工具調用後，Claude 會收到剩餘容量的更新：

```
<system_warning>Token usage: 35000/200000; 165000 remaining</system_warning>
```

此感知幫助 Claude 確定還有多少容量可用於工作，並在長時間運行的任務上實現更有效的執行。圖像令牌包含在這些預算中。

**優勢：**

上下文感知對以下方面特別有價值：
- 需要持續關注的長時間運行的代理會話
- 狀態轉換很重要的多上下文窗口工作流
- 需要仔細令牌管理的複雜任務

有關利用上下文感知的提示指導，請參閱我們的 [Claude 4 最佳實踐指南](/docs/zh-TW/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows)。

## 使用較新 Claude 模型的上下文窗口管理

在較新的 Claude 模型中（從 Claude Sonnet 3.7 開始），如果提示令牌和輸出令牌的總和超過模型的上下文窗口，系統將返回驗證錯誤，而不是無聲地截斷上下文。此更改提供了更可預測的行為，但需要更仔細的令牌管理。

要規劃您的令牌使用情況並確保您保持在上下文窗口限制內，您可以使用[令牌計數 API](/docs/zh-TW/build-with-claude/token-counting) 來估計您的消息在發送給 Claude 之前將使用多少令牌。

有關按模型的上下文窗口大小列表，請參閱我們的[模型比較](/docs/zh-TW/about-claude/models/overview#model-comparison-table)表。

# 後續步驟
<CardGroup cols={2}>
  <Card title="模型比較表" icon="scales" href="/docs/zh-TW/about-claude/models/overview#model-comparison-table">
    查看我們的模型比較表，了解按模型的上下文窗口大小和輸入/輸出令牌定價列表。
  </Card>
  <Card title="擴展思考概述" icon="settings" href="/docs/zh-TW/build-with-claude/extended-thinking">
    了解有關擴展思考如何工作的更多信息，以及如何將其與工具使用和提示緩存等其他功能一起實現。
  </Card>
</CardGroup>