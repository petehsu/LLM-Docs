# 提示詞工程概述

學習如何優化您的提示詞以獲得更好的 Claude 模型性能

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

## 提示詞工程之前

本指南假設您已經：
1. 為您的使用案例明確定義了成功標準
2. 有一些方法可以根據這些標準進行實證測試
3. 有一份您想改進的初稿提示詞

如果沒有，我們強烈建議您花時間先建立這些基礎。請查看[定義您的成功標準](/docs/zh-TW/test-and-evaluate/define-success)和[建立強大的實證評估](/docs/zh-TW/test-and-evaluate/develop-tests)以獲取提示和指導。

<Card title="提示詞生成器" icon="link" href="/dashboard">
  沒有初稿提示詞？試試 Claude 控制台中的提示詞生成器！
</Card>

***

## 何時進行提示詞工程

  本指南重點關注可通過提示詞工程控制的成功標準。
  並非每個成功標準或失敗的評估都最好通過提示詞工程來解決。例如，延遲和成本有時可以通過選擇不同的模型更容易地改進。

<section title="提示詞工程 vs. 微調">

  提示詞工程遠快於其他模型行為控制方法（如微調），通常可以在更短的時間內產生性能的飛躍。以下是考慮使用提示詞工程而不是微調的一些原因：<br/>
  - **資源效率**：微調需要高端 GPU 和大量內存，而提示詞工程只需要文本輸入，使其更加資源友好。
  - **成本效益**：對於基於雲的 AI 服務，微調會產生巨大成本。提示詞工程使用基礎模型，通常更便宜。
  - **維護模型更新**：當提供商更新模型時，微調版本可能需要重新訓練。提示詞通常可以跨版本工作而無需更改。
  - **節省時間**：微調可能需要數小時甚至數天。相比之下，提示詞工程提供近乎即時的結果，允許快速解決問題。
  - **最少數據需求**：微調需要大量特定任務的標記數據，這可能很稀缺或昂貴。提示詞工程適用於少樣本甚至零樣本學習。
  - **靈活性和快速迭代**：快速嘗試各種方法，調整提示詞，並立即看到結果。這種快速實驗對於微調來說很困難。
  - **域適應**：通過在提示詞中提供特定域的上下文，輕鬆將模型適應新域，無需重新訓練。
  - **理解力改進**：提示詞工程在幫助模型更好地理解和利用外部內容（如檢索到的文檔）方面遠比微調有效。
  - **保留通用知識**：微調存在災難性遺忘的風險，模型可能會失去通用知識。提示詞工程保持模型的廣泛能力。
  - **透明度**：提示詞是人類可讀的，顯示模型接收的確切信息。這種透明度有助於理解和調試。

</section>

***

## 如何進行提示詞工程

本部分中的提示詞工程頁面已按從最廣泛有效的技術到更專業化的技術進行組織。在排除性能問題時，我們建議您按順序嘗試這些技術，儘管每種技術的實際影響將取決於您的使用案例。
1. [提示詞生成器](/docs/zh-TW/build-with-claude/prompt-engineering/prompt-generator)
2. [清晰直接](/docs/zh-TW/build-with-claude/prompt-engineering/be-clear-and-direct)
3. [使用示例（多樣本）](/docs/zh-TW/build-with-claude/prompt-engineering/multishot-prompting)
4. [讓 Claude 思考（思維鏈）](/docs/zh-TW/build-with-claude/prompt-engineering/chain-of-thought)
5. [使用 XML 標籤](/docs/zh-TW/build-with-claude/prompt-engineering/use-xml-tags)
6. [給 Claude 一個角色（系統提示詞）](/docs/zh-TW/build-with-claude/prompt-engineering/system-prompts)
7. [預填 Claude 的回應](/docs/zh-TW/build-with-claude/prompt-engineering/prefill-claudes-response)
8. [鏈接複雜提示詞](/docs/zh-TW/build-with-claude/prompt-engineering/chain-prompts)
9. [長上下文提示](/docs/zh-TW/build-with-claude/prompt-engineering/long-context-tips)

***

## 提示詞工程教程

如果您是互動式學習者，您可以改為深入我們的互動式教程！

<CardGroup cols={2}>
  <Card title="GitHub 提示詞工程教程" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    一個充滿示例的教程，涵蓋我們文檔中的提示詞工程概念。
  </Card>
  <Card title="Google Sheets 提示詞工程教程" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    通過互動式電子表格提供的我們提示詞工程教程的輕量級版本。
  </Card>
</CardGroup>