# 模型概覽

Claude 是由 Anthropic 開發的最先進大型語言模型系列。本指南介紹我們的模型並比較其性能。

---

## 選擇模型

如果您不確定要使用哪個模型，我們建議從 **Claude Sonnet 4.5** 開始。它為大多數用例提供了最佳的智能、速度和成本平衡，在編碼和代理任務中表現出色。

所有當前 Claude 模型都支持文本和圖像輸入、文本輸出、多語言功能和視覺能力。模型可通過 Anthropic API、AWS Bedrock 和 Google Vertex AI 獲得。

選擇模型後，[了解如何進行第一次 API 調用](/docs/zh-TW/get-started)。

### 最新模型比較

| 功能 | Claude Sonnet 4.5 | Claude Haiku 4.5 | Claude Opus 4.5 |
|:--------|:------------------|:-----------------|:----------------|
| **描述** | 我們用於複雜代理和編碼的智能模型 | 我們具有接近前沿智能的最快模型 | 結合最大智能與實用性能的高級模型 |
| **Claude API ID** | claude-sonnet-4-5-20250929 | claude-haiku-4-5-20251001 | claude-opus-4-5-20251101 |
| **Claude API 別名**<sup>1</sup> | claude-sonnet-4-5 | claude-haiku-4-5 | claude-opus-4-5 |
| **AWS Bedrock ID** | anthropic.claude-sonnet-4-5-20250929-v1:0 | anthropic.claude-haiku-4-5-20251001-v1:0 | anthropic.claude-opus-4-5-20251101-v1:0 |
| **GCP Vertex AI ID** | claude-sonnet-4-5@20250929 | claude-haiku-4-5@20251001 | claude-opus-4-5@20251101 |
| **定價**<sup>2</sup> | \$3 / 輸入 MTok<br/>\$15 / 輸出 MTok | \$1 / 輸入 MTok<br/>\$5 / 輸出 MTok | \$5 / 輸入 MTok<br/>\$25 / 輸出 MTok |
| **[擴展思考](/docs/zh-TW/build-with-claude/extended-thinking)** | 是 | 是 | 是 |
| **[優先級層級](/docs/zh-TW/api/service-tiers)** | 是 | 是 | 是 |
| **相對延遲** | 快速 | 最快 | 中等 |
| **上下文窗口** | <Tooltip tooltipContent="~150K 字 \ ~680K unicode 字符">200K tokens</Tooltip> / <br/> <Tooltip tooltipContent="~750K 字 \ ~3.4M unicode 字符">1M tokens</Tooltip> (測試版)<sup>3</sup> | <Tooltip tooltipContent="~150K 字 \ ~680K unicode 字符">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K 字 \ ~680K unicode 字符">200K tokens</Tooltip> |
| **最大輸出** | 64K tokens | 64K tokens | 64K tokens |
| **可靠知識截止日期** | 2025 年 1 月<sup>4</sup> | 2025 年 2 月 | 2025 年 5 月<sup>4</sup> |
| **訓練數據截止日期** | 2025 年 7 月 | 2025 年 7 月 | 2025 年 8 月 |

_<sup>1 - 別名自動指向最新的模型快照。當我們發布新的模型快照時，我們會在新版本發布後的一週內將別名遷移到指向最新版本的模型。雖然別名對於實驗很有用，但我們建議在生產應用中使用特定的模型版本（例如 `claude-sonnet-4-5-20250929`）以確保一致的行為。</sup>_

_<sup>2 - 請參閱我們的[定價頁面](/docs/zh-TW/about-claude/pricing)以獲取完整的定價信息，包括批量 API 折扣、提示緩存費率、擴展思考成本和視覺處理費用。</sup>_

_<sup>3 - Claude Sonnet 4.5 在使用 `context-1m-2025-08-07` 測試版標頭時支持 [1M token 上下文窗口](/docs/zh-TW/build-with-claude/context-windows#1m-token-context-window)。[長上下文定價](/docs/zh-TW/about-claude/pricing#long-context-pricing)適用於超過 200K tokens 的請求。</sup>_

_<sup>4 - **可靠知識截止日期**表示模型知識最廣泛和最可靠的日期。**訓練數據截止日期**是使用的訓練數據的更廣泛日期範圍。例如，Claude Sonnet 4.5 在 2025 年 7 月之前的公開可用信息上進行了訓練，但其知識在 2025 年 1 月之前最廣泛和最可靠。有關更多信息，請參閱 [Anthropic 的透明度中心](https://www.anthropic.com/transparency)。</sup>_

<Note>具有相同快照日期的模型（例如 20240620）在所有平台上都是相同的，不會改變。模型名稱中的快照日期確保了一致性，並允許開發人員在不同環境中依賴穩定的性能。</Note>

<Note>從 **Claude Sonnet 4.5 和所有未來模型**開始，AWS Bedrock 和 Google Vertex AI 提供兩種端點類型：**全球端點**（用於最大可用性的動態路由）和**區域端點**（通過特定地理區域的保證數據路由）。有關更多信息，請參閱[第三方平台定價部分](/docs/zh-TW/about-claude/pricing#third-party-platform-pricing)。</Note>

<section title="舊版模型">

以下模型仍然可用，但我們建議遷移到當前模型以獲得改進的性能：

| 功能 | Claude Opus 4.1 | Claude Sonnet 4 | Claude Sonnet 3.7 | Claude Opus 4 | Claude Haiku 3.5 | Claude Haiku 3 |
|:--------|:----------------|:----------------|:------------------|:--------------|:-----------------|:---------------|
| **Claude API ID** | claude-opus-4-1-20250805 | claude-sonnet-4-20250514 | claude-3-7-sonnet-20250219 | claude-opus-4-20250514 | claude-3-5-haiku-20241022 | claude-3-haiku-20240307 |
| **Claude API 別名** | claude-opus-4-1 | claude-sonnet-4-0 | claude-3-7-sonnet-latest | claude-opus-4-0 | claude-3-5-haiku-latest | — |
| **AWS Bedrock ID** | anthropic.claude-opus-4-1-20250805-v1:0 | anthropic.claude-sonnet-4-20250514-v1:0 | anthropic.claude-3-7-sonnet-20250219-v1:0 | anthropic.claude-opus-4-20250514-v1:0 | anthropic.claude-3-5-haiku-20241022-v1:0 | anthropic.claude-3-haiku-20240307-v1:0 |
| **GCP Vertex AI ID** | claude-opus-4-1@20250805 | claude-sonnet-4@20250514 | claude-3-7-sonnet@20250219 | claude-opus-4@20250514 | claude-3-5-haiku@20241022 | claude-3-haiku@20240307 |
| **定價** | \$15 / 輸入 MTok<br/>\$75 / 輸出 MTok | \$3 / 輸入 MTok<br/>\$15 / 輸出 MTok | \$3 / 輸入 MTok<br/>\$15 / 輸出 MTok | \$15 / 輸入 MTok<br/>\$75 / 輸出 MTok | \$0.80 / 輸入 MTok<br/>\$4 / 輸出 MTok | \$0.25 / 輸入 MTok<br/>\$1.25 / 輸出 MTok |
| **[擴展思考](/docs/zh-TW/build-with-claude/extended-thinking)** | 是 | 是 | 是 | 是 | 否 | 否 |
| **[優先級層級](/docs/zh-TW/api/service-tiers)** | 是 | 是 | 是 | 是 | 是 | 否 |
| **相對延遲** | 中等 | 快速 | 快速 | 中等 | 最快 | 快速 |
| **上下文窗口** | <Tooltip tooltipContent="~150K 字 \ ~680K unicode 字符">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K 字 \ ~680K unicode 字符">200K tokens</Tooltip> / <br/> <Tooltip tooltipContent="~750K 字 \ ~3.4M unicode 字符">1M tokens</Tooltip> (測試版)<sup>1</sup> | <Tooltip tooltipContent="~150K 字 \ ~680K unicode 字符">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K 字 \ ~680K unicode 字符">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K 字 \ ~215K unicode 字符">200K tokens</Tooltip> | <Tooltip tooltipContent="~150K 字 \ ~680K unicode 字符">200K tokens</Tooltip> |
| **最大輸出** | 32K tokens | 64K tokens | 64K tokens / 128K tokens (測試版)<sup>4</sup> | 32K tokens | 8K tokens | 4K tokens |
| **可靠知識截止日期** | 2025 年 1 月<sup>2</sup> | 2025 年 1 月<sup>2</sup> | 2024 年 10 月<sup>2</sup> | 2025 年 1 月<sup>2</sup> | <sup>3</sup> | <sup>3</sup> |
| **訓練數據截止日期** | 2025 年 3 月 | 2025 年 3 月 | 2024 年 11 月 | 2025 年 3 月 | 2024 年 7 月 | 2023 年 8 月 |

_<sup>1 - Claude Sonnet 4 在使用 `context-1m-2025-08-07` 測試版標頭時支持 [1M token 上下文窗口](/docs/zh-TW/build-with-claude/context-windows#1m-token-context-window)。[長上下文定價](/docs/zh-TW/about-claude/pricing#long-context-pricing)適用於超過 200K tokens 的請求。</sup>_

_<sup>2 - **可靠知識截止日期**表示模型知識最廣泛和最可靠的日期。**訓練數據截止日期**是使用的訓練數據的更廣泛日期範圍。</sup>_

_<sup>3 - 某些 Haiku 模型有單一的訓練數據截止日期。</sup>_

_<sup>4 - 在您的 API 請求中包含測試版標頭 `output-128k-2025-02-19` 以將 Claude Sonnet 3.7 的最大輸出 token 長度增加到 128K tokens。我們強烈建議在生成較長輸出時使用我們的[流式 Messages API](/docs/zh-TW/build-with-claude/streaming) 以避免超時。有關更多詳情，請參閱我們的[長請求](/docs/zh-TW/api/errors#long-requests)指南。</sup>_

</section>

## 提示和輸出性能

Claude 4 模型在以下方面表現出色：
- **性能**：在推理、編碼、多語言任務、長上下文處理、誠實性和圖像處理方面取得頂級結果。有關更多信息，請參閱 [Claude 4 博客文章](http://www.anthropic.com/news/claude-4)。
- **引人入勝的回應**：Claude 模型非常適合需要豐富、類似人類互動的應用。

    - 如果您更喜歡更簡潔的回應，您可以調整提示以引導模型達到所需的輸出長度。有關詳情，請參閱我們的[提示工程指南](/docs/zh-TW/build-with-claude/prompt-engineering)。
    - 有關特定的 Claude 4 提示最佳實踐，請參閱我們的 [Claude 4 最佳實踐指南](/docs/zh-TW/build-with-claude/prompt-engineering/claude-4-best-practices)。
- **輸出質量**：從之前的模型代次遷移到 Claude 4 時，您可能會注意到整體性能有更大的改進。

## 遷移到 Claude 4.5

如果您目前正在使用 Claude 3 模型，我們建議遷移到 Claude 4.5 以利用改進的智能和增強的功能。有關詳細的遷移說明，請參閱[遷移到 Claude 4.5](/docs/zh-TW/about-claude/models/migrating-to-claude-4)。

## 開始使用 Claude

如果您已準備好開始探索 Claude 可以為您做什麼，讓我們深入了解！無論您是想將 Claude 集成到應用中的開發人員，還是想親身體驗 AI 力量的用戶，我們都能為您提供幫助。

<Note>想與 Claude 聊天？訪問 [claude.ai](http://www.claude.ai)！</Note>

<CardGroup cols={3}>
  <Card title="Claude 簡介" icon="check" href="/docs/zh-TW/intro">
    探索 Claude 的功能和開發流程。
  </Card>
  <Card title="快速入門" icon="lightning" href="/docs/zh-TW/get-started">
    了解如何在幾分鐘內進行第一次 API 調用。
  </Card>
  <Card title="Claude 控制台" icon="code" href="/">
    直接在瀏覽器中製作和測試強大的提示。
  </Card>
</CardGroup>

如果您有任何問題或需要幫助，請隨時聯繫我們的[支持團隊](https://support.claude.com/)或查閱 [Discord 社區](https://www.anthropic.com/discord)。