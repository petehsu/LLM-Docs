# 降低延遲

降低延遲

---

延遲是指模型處理提示並生成輸出所需的時間。延遲可能受到各種因素的影響，例如模型的大小、提示的複雜性，以及支持模型和交互點的底層基礎設施。

<Note>
最好先設計一個在沒有模型或提示約束的情況下運作良好的提示，然後再嘗試延遲降低策略。過早嘗試降低延遲可能會阻止您發現最佳性能的樣子。
</Note>

---

## 如何測量延遲

在討論延遲時，您可能會遇到幾個術語和測量方法：

- **基準延遲**：這是模型處理提示並生成回應所需的時間，不考慮每秒輸入和輸出令牌數。它提供了模型速度的一般概念。
- **首個令牌時間 (TTFT)**：此指標測量模型從發送提示開始生成回應的第一個令牌所需的時間。當您使用串流（稍後會詳細介紹）並希望為用戶提供響應式體驗時，這特別相關。

要更深入了解這些術語，請查看我們的[詞彙表](/docs/zh-TW/about-claude/glossary)。

---

## 如何降低延遲

### 1. 選擇正確的模型

降低延遲最直接的方法之一是為您的用例選擇適當的模型。Anthropic 提供了一系列具有不同能力和性能特徵的[模型](/docs/zh-TW/about-claude/models/overview)。考慮您的具體需求，選擇在速度和輸出品質方面最適合您需求的模型。

對於速度關鍵的應用程式，**Claude Haiku 4.5** 在保持高智能的同時提供最快的回應時間：

```python
import anthropic

client = anthropic.Anthropic()

# 對於時間敏感的應用程式，使用 Claude Haiku 4.5
message = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=100,
    messages=[{
        "role": "user",
        "content": "Summarize this customer feedback in 2 sentences: [feedback text]"
    }]
)
```

有關模型指標的更多詳細信息，請參閱我們的[模型概述](/docs/zh-TW/about-claude/models/overview)頁面。

### 2. 優化提示和輸出長度

在保持高性能的同時，最小化輸入提示和預期輸出中的令牌數量。模型需要處理和生成的令牌越少，回應就越快。

以下是一些幫助您優化提示和輸出的技巧：

- **清晰但簡潔**：在提示中清晰簡潔地傳達您的意圖。避免不必要的細節或冗餘信息，同時記住 [claude 缺乏上下文](/docs/zh-TW/build-with-claude/prompt-engineering/be-clear-and-direct)，如果指令不清楚，可能不會做出預期的邏輯跳躍。
- **要求更短的回應**：直接要求 Claude 簡潔。Claude 3 系列模型相比之前的世代具有改進的可操控性。如果 Claude 輸出不必要的長度，請要求 Claude [抑制其健談性](/docs/zh-TW/build-with-claude/prompt-engineering/be-clear-and-direct)。
  <Tip> 由於 LLM 計算[令牌](/docs/zh-TW/about-claude/glossary#tokens)而不是單詞，要求確切的單詞計數或單詞計數限制不如要求段落或句子計數限制有效。</Tip>
- **設置適當的輸出限制**：使用 `max_tokens` 參數設置生成回應最大長度的硬限制。這可以防止 Claude 生成過長的輸出。
  > **注意**：當回應達到 `max_tokens` 令牌時，回應將被截斷，可能在句子中間或單詞中間，因此這是一種可能需要後處理的粗糙技術，通常最適合多選或短答案回應，其中答案就在開頭。
- **實驗溫度參數**：`temperature` [參數](/docs/zh-TW/api/messages)控制輸出的隨機性。較低的值（例如 0.2）有時可以導致更集中和更短的回應，而較高的值（例如 0.8）可能導致更多樣化但可能更長的輸出。

在提示清晰度、輸出品質和令牌計數之間找到正確的平衡可能需要一些實驗。

### 3. 利用串流

串流是一個功能，允許模型在完整輸出完成之前開始發送回應。這可以顯著改善應用程式的感知響應性，因為用戶可以實時看到模型的輸出。

啟用串流後，您可以在模型輸出到達時處理它，更新用戶界面或並行執行其他任務。這可以大大增強用戶體驗，使您的應用程式感覺更具互動性和響應性。

訪問[串流 Messages](/docs/zh-TW/build-with-claude/streaming) 了解如何為您的用例實現串流。