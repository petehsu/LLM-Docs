# 延伸思考技巧

---

本指南提供進階策略和技巧，幫助您充分利用 Claude 的延伸思考功能。延伸思考允許 Claude 逐步處理複雜問題，提升困難任務的表現。

請參閱[延伸思考模型](/docs/zh-TW/about-claude/models/extended-thinking-models)以獲得何時使用延伸思考的指導。

## 開始之前

本指南假設您已經決定使用延伸思考模式，並已經查看了我們關於[如何開始使用延伸思考](/docs/zh-TW/about-claude/models/extended-thinking-models#getting-started-with-extended-thinking-models)的基本步驟，以及我們的[延伸思考實作指南](/docs/zh-TW/build-with-claude/extended-thinking)。

### 延伸思考的技術考量

- 思考代幣的最小預算為 1024 個代幣。我們建議您從最小思考預算開始，然後根據您的需求和任務複雜度逐步增加調整。
- 對於最佳思考預算超過 32K 的工作負載，我們建議您使用[批次處理](/docs/zh-TW/build-with-claude/batch-processing)以避免網路問題。推動模型思考超過 32K 代幣的請求會導致長時間運行的請求，可能會遇到系統超時和開放連接限制。
- 延伸思考在英語中表現最佳，儘管最終輸出可以是[Claude 支援的任何語言](/docs/zh-TW/build-with-claude/multilingual-support)。
- 如果您需要低於最小預算的思考，我們建議使用標準模式，關閉思考功能，並使用傳統的思維鏈提示與 XML 標籤（如 `<thinking>`）。請參閱[思維鏈提示](/docs/zh-TW/build-with-claude/prompt-engineering/chain-of-thought)。

## 延伸思考的提示技巧

### 先使用一般指令，然後用更詳細的逐步指令進行故障排除

Claude 通常在高層次指令下表現更好，只需深入思考任務，而不是逐步的規範性指導。模型在解決問題方面的創造力可能超過人類規定最佳思考過程的能力。

例如，不要這樣：

<CodeGroup>
```text User
逐步思考這個數學問題：
1. 首先，識別變數
2. 然後，建立方程式
3. 接下來，求解 x
...
```
</CodeGroup>

考慮這樣：

<CodeGroup>
```text User
請徹底且詳細地思考這個數學問題。
考慮多種方法並展示您的完整推理。
如果您的第一種方法不起作用，請嘗試不同的方法。
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `請徹底且詳細地思考這個數學問題。
考慮多種方法並展示您的完整推理。
如果您的第一種方法不起作用，請嘗試不同的方法。`
  }
  thinkingBudgetTokens={16000}
>
  在控制台中試用
</TryInConsoleButton>

話雖如此，Claude 在需要時仍然可以有效地遵循複雜的結構化執行步驟。該模型可以處理比以前版本更長的列表和更複雜的指令。我們建議您從更一般化的指令開始，然後閱讀 Claude 的思考輸出，並從那裡迭代提供更具體的指令來引導其思考。

### 延伸思考的多次提示

[多次提示](/docs/zh-TW/build-with-claude/prompt-engineering/multishot-prompting)與延伸思考配合良好。當您為 Claude 提供如何思考問題的範例時，它會在其延伸思考區塊中遵循類似的推理模式。

您可以在延伸思考場景中通過使用 XML 標籤（如 `<thinking>` 或 `<scratchpad>`）來指示這些範例中延伸思考的典型模式，在您的提示中包含少量範例。

Claude 會將模式推廣到正式的延伸思考過程。然而，給 Claude 自由思考的空間，讓它以認為最佳的方式思考，可能會獲得更好的結果。

範例：

<CodeGroup>
```text User
我將向您展示如何解決數學問題，然後我希望您解決一個類似的問題。

問題 1：80 的 15% 是多少？

<thinking>
要找到 80 的 15%：
1. 將 15% 轉換為小數：15% = 0.15
2. 相乘：0.15 × 80 = 12
</thinking>

答案是 12。

現在解決這個問題：
問題 2：240 的 35% 是多少？
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `我將向您展示如何解決數學問題，然後我希望您解決一個類似的問題。

問題 1：80 的 15% 是多少？

<thinking>
要找到 80 的 15%：
1. 將 15% 轉換為小數：15% = 0.15
2. 相乘：0.15 × 80 = 12
</thinking>

答案是 12。

現在解決這個問題：
問題 2：240 的 35% 是多少？`
  }
  thinkingBudgetTokens={16000} 
>
  在控制台中試用
</TryInConsoleButton>

### 使用延伸思考最大化指令遵循
當啟用延伸思考時，Claude 顯示出顯著改善的指令遵循能力。模型通常：
1. 在延伸思考區塊內對指令進行推理
2. 在回應中執行這些指令

要最大化指令遵循：
- 對您想要的內容要清晰和具體
- 對於複雜的指令，考慮將它們分解為 Claude 應該有條不紊地執行的編號步驟
- 允許 Claude 有足夠的預算在其延伸思考中充分處理指令

### 使用延伸思考來調試和引導 Claude 的行為
您可以使用 Claude 的思考輸出來調試 Claude 的邏輯，儘管這種方法並不總是完全可靠。

為了最好地利用這種方法，我們建議以下技巧：
- 我們不建議將 Claude 的延伸思考傳回用戶文本區塊中，因為這不會改善性能，實際上可能會降低結果。
- 明確不允許預填延伸思考，手動更改模型在其思考區塊之後的輸出文本可能會由於模型混亂而降低結果。

當延伸思考關閉時，標準的 `assistant` 回應文本[預填](/docs/zh-TW/build-with-claude/prompt-engineering/prefill-claudes-response)仍然是允許的。

<Note>
有時 Claude 可能會在助手輸出文本中重複其延伸思考。如果您想要乾淨的回應，請指示 Claude 不要重複其延伸思考，只輸出答案。
</Note>

### 充分利用長輸出和長篇思考

對於資料集生成用例，嘗試諸如「請創建一個極其詳細的...表格」之類的提示來生成綜合資料集。

對於詳細內容生成等用例，您可能希望生成更長的延伸思考區塊和更詳細的回應，請嘗試這些技巧：
- 增加最大延伸思考長度並明確要求更長的輸出
- 對於非常長的輸出（20,000+ 字），請求一個詳細的大綱，包含到段落級別的字數統計。然後要求 Claude 將其段落索引到大綱並保持指定的字數

<Warning>
我們不建議您為了輸出代幣而推動 Claude 輸出更多代幣。相反，我們鼓勵您從小的思考預算開始，根據需要增加以找到您用例的最佳設置。
</Warning>

以下是 Claude 由於更長的延伸思考而表現出色的範例用例：

  <section title="複雜的 STEM 問題">

    複雜的 STEM 問題需要 Claude 建立心理模型、應用專業知識並通過順序邏輯步驟工作——這些過程受益於更長的推理時間。
    
    <Tabs>
      <Tab title="標準提示">
        <CodeGroup>
        ```text User
        為正方形內的彈跳黃球編寫 python 腳本，
        確保正確處理碰撞檢測。
        讓正方形緩慢旋轉。
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `為正方形內的彈跳黃球編寫 python 腳本，
確保正確處理碰撞檢測。
讓正方形緩慢旋轉。`
          }
          thinkingBudgetTokens={16000}
        >
          在控制台中試用
        </TryInConsoleButton>
        <Note>
        這個較簡單的任務通常只需要大約幾秒鐘的思考時間。
        </Note>
      </Tab>
      <Tab title="增強提示">
        <CodeGroup>
        ```text User
        為超立方體內的彈跳黃球編寫 Python 腳本，
        確保正確處理碰撞檢測。
        讓超立方體緩慢旋轉。
        確保球保持在超立方體內。
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `為超立方體內的彈跳黃球編寫 Python 腳本，
確保正確處理碰撞檢測。
讓超立方體緩慢旋轉。
確保球保持在超立方體內。`
          }
          thinkingBudgetTokens={16000}
        >
          在控制台中試用
        </TryInConsoleButton>
        <Note>
        這個複雜的 4D 視覺化挑戰最能利用長延伸思考時間，因為 Claude 需要處理數學和程式設計的複雜性。
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="約束優化問題">

    約束優化挑戰 Claude 同時滿足多個競爭需求，當允許長延伸思考時間時最能完成，這樣模型可以有條不紊地處理每個約束。
    
    <Tabs>
      <Tab title="標準提示">
        <CodeGroup>
        ```text User
        規劃一週的日本假期。
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt="規劃一週的日本假期。"
          thinkingBudgetTokens={16000}
        >
          在控制台中試用
        </TryInConsoleButton>
        <Note>
        這個開放式請求通常只需要大約幾秒鐘的思考時間。
        </Note>
      </Tab>
      <Tab title="增強提示">
        <CodeGroup>
        ```text User
        規劃一個 7 天的日本旅行，具有以下約束：
        - 預算 $2,500
        - 必須包括東京和京都
        - 需要適應素食飲食
        - 偏好文化體驗而非購物
        - 必須包括一天的徒步旅行
        - 每天地點間的旅行時間不超過 2 小時
        - 每天下午需要有空閒時間回家打電話
        - 必須盡可能避免人群
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `規劃一個 7 天的日本旅行，具有以下約束：
- 預算 $2,500
- 必須包括東京和京都
- 需要適應素食飲食
- 偏好文化體驗而非購物
- 必須包括一天的徒步旅行
- 每天地點間的旅行時間不超過 2 小時
- 每天下午需要有空閒時間回家打電話
- 必須盡可能避免人群`
          }
          thinkingBudgetTokens={16000}
        >
          在控制台中試用
        </TryInConsoleButton>
        <Note>
        有多個約束需要平衡時，Claude 在有更多思考空間來考慮如何最佳地滿足所有要求時自然會表現最佳。
        </Note>
      </Tab>
    </Tabs>
  
</section>
  
  <section title="思考框架">

    結構化思考框架為 Claude 提供了明確的方法論，當 Claude 有長延伸思考空間來遵循每個步驟時可能效果最佳。
    
    <Tabs>
      <Tab title="標準提示">
        <CodeGroup>
        ```text User
        為 Microsoft 在 2027 年前進入個人化醫療市場
        制定綜合策略。
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `為 Microsoft 在 2027 年前進入個人化醫療市場
制定綜合策略。`
          }
          thinkingBudgetTokens={16000}
        >
          在控制台中試用
        </TryInConsoleButton>
        <Note>
        這個廣泛的戰略問題通常只需要大約幾秒鐘的思考時間。
        </Note>
      </Tab>
      <Tab title="增強提示">
        <CodeGroup>
        ```text User
        為 Microsoft 在 2027 年前進入個人化醫療市場
        制定綜合策略。
        
        開始於：
        1. 藍海策略畫布
        2. 應用波特五力分析識別競爭壓力
        
        接下來，基於監管和技術變數進行情境規劃練習，
        包含四個不同的未來。
        
        對於每個情境：
        - 使用安索夫矩陣制定戰略回應
        
        最後，應用三地平線框架：
        - 映射轉型路徑
        - 識別每個階段的潛在顛覆性創新
        ```
        />
        </CodeGroup>
        
        <TryInConsoleButton
          userPrompt={
            `為 Microsoft 在 2027 年前進入個人化醫療市場
制定綜合策略。

開始於：
1. 藍海策略畫布
2. 應用波特五力分析識別競爭壓力

接下來，基於監管和技術變數進行情境規劃練習，
包含四個不同的未來。

對於每個情境：
- 使用安索夫矩陣制定戰略回應

最後，應用三地平線框架：
- 映射轉型路徑
- 識別每個階段的潛在顛覆性創新`
          }
          thinkingBudgetTokens={16000}
        >
          在控制台中試用
        </TryInConsoleButton>
        <Note>
        通過指定必須順序應用的多個分析框架，思考時間自然增加，因為 Claude 有條不紊地處理每個框架。
        </Note>
      </Tab>
    </Tabs>
  
</section>

### 讓 Claude 反思並檢查其工作以改善一致性和錯誤處理
您可以使用簡單的自然語言提示來改善一致性並減少錯誤：
1. 要求 Claude 在宣布任務完成之前用簡單的測試驗證其工作
2. 指示模型分析其前一步是否達到了預期結果
3. 對於編碼任務，要求 Claude 在其延伸思考中運行測試案例

範例：

<CodeGroup>
```text User
編寫一個計算數字階乘的函數。
在您完成之前，請用以下測試案例驗證您的解決方案：
- n=0
- n=1
- n=5
- n=10
並修復您發現的任何問題。
```
/>
</CodeGroup>

<TryInConsoleButton
  userPrompt={
    `編寫一個計算數字階乘的函數。
在您完成之前，請用以下測試案例驗證您的解決方案：
- n=0
- n=1
- n=5
- n=10
並修復您發現的任何問題。`
  }
  thinkingBudgetTokens={16000}
>
  在控制台中試用
</TryInConsoleButton>

## 下一步

<CardGroup>
  <Card title="延伸思考食譜" icon="book" href="https://github.com/anthropics/anthropic-cookbook/tree/main/extended_thinking">
    在我們的食譜中探索延伸思考的實際範例。
  </Card>
  <Card title="延伸思考指南" icon="code" href="/docs/zh-TW/build-with-claude/extended-thinking">
    查看實作延伸思考的完整技術文件。
  </Card>
</CardGroup>