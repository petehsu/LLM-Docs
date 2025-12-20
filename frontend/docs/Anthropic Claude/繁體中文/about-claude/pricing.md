# 定價

了解 Anthropic 的模型和功能定價結構

---

本頁面提供 Anthropic 模型和功能的詳細定價資訊。所有價格均以美元計價。

如需最新的定價資訊，請訪問 [claude.com/pricing](https://claude.com/pricing)。

## 模型定價

下表顯示所有 Claude 模型在不同使用層級的定價：

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
MTok = 百萬個令牌。「基礎輸入令牌」欄位顯示標準輸入定價，「快取寫入」和「快取命中」特定於[提示快取](/docs/zh-TW/build-with-claude/prompt-caching)，「輸出令牌」顯示輸出定價。提示快取提供 5 分鐘（預設）和 1 小時快取持續時間，以針對不同使用案例優化成本。

上表反映了提示快取的以下定價倍數：
- 5 分鐘快取寫入令牌是基礎輸入令牌價格的 1.25 倍
- 1 小時快取寫入令牌是基礎輸入令牌價格的 2 倍
- 快取讀取令牌是基礎輸入令牌價格的 0.1 倍
</Note>

## 第三方平台定價

Claude 模型可在 [AWS Bedrock](/docs/zh-TW/build-with-claude/claude-on-amazon-bedrock)、[Google Vertex AI](/docs/zh-TW/build-with-claude/claude-on-vertex-ai) 和 [Microsoft Foundry](/docs/zh-TW/build-with-claude/claude-in-microsoft-foundry) 上使用。如需官方定價，請訪問：
- [AWS Bedrock 定價](https://aws.amazon.com/bedrock/pricing/)
- [Google Vertex AI 定價](https://cloud.google.com/vertex-ai/generative-ai/pricing)
- [Microsoft Foundry 定價](https://azure.microsoft.com/en-us/pricing/details/ai-foundry/#pricing)

<Note>
**Claude 4.5 模型及更新版本的區域端點定價**

從 Claude Sonnet 4.5 和 Haiku 4.5 開始，AWS Bedrock 和 Google Vertex AI 提供兩種端點類型：
- **全球端點**：跨區域動態路由以實現最大可用性
- **區域端點**：資料路由保證在特定地理區域內

區域端點包含相對於全球端點的 10% 溢價。**Claude API (1P) 預設為全球性的，不受此變更影響。** Claude API 是全球性的（相當於其他提供商的全球端點提供和定價）。

**範圍**：此定價結構適用於 Claude Sonnet 4.5、Haiku 4.5 和所有未來模型。較早的模型（Claude Sonnet 4、Opus 4 及更早版本）保留其現有定價。

如需實施詳情和程式碼範例：
- [AWS Bedrock 全球與區域端點](/docs/zh-TW/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AI 全球與區域端點](/docs/zh-TW/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)
</Note>

## 功能特定定價

### 批次處理

Batch API 允許非同步處理大量請求，輸入和輸出令牌均享受 50% 折扣。

| Model             | Batch input      | Batch output    |
|-------------------|------------------|-----------------|
| Claude Opus 4.5     | $2.50 / MTok     | $12.50 / MTok   |
| Claude Opus 4.1     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Opus 4     | $7.50 / MTok     | $37.50 / MTok   |
| Claude Sonnet 4.5   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 4   | $1.50 / MTok     | $7.50 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $1.50 / MTok     | $7.50 / MTok    |
| Claude Haiku 4.5  | $0.50 / MTok     | $2.50 / MTok    |
| Claude Haiku 3.5  | $0.40 / MTok     | $2 / MTok       |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))  | $7.50 / MTok     | $37.50 / MTok   |
| Claude Haiku 3    | $0.125 / MTok    | $0.625 / MTok   |

如需有關批次處理的更多資訊，請參閱我們的[批次處理文件](/docs/zh-TW/build-with-claude/batch-processing)。

### 長上下文定價

使用 Claude Sonnet 4 或 Sonnet 4.5 並[啟用 1M 令牌上下文視窗](/docs/zh-TW/build-with-claude/context-windows#1m-token-context-window)時，超過 200K 輸入令牌的請求會自動按高級長上下文費率計費：

<Note>
1M 令牌上下文視窗目前在[使用層級](/docs/zh-TW/api/rate-limits) 4 的組織和具有自訂速率限制的組織中處於測試版。1M 令牌上下文視窗僅適用於 Claude Sonnet 4 和 Sonnet 4.5。
</Note>

| ≤ 200K 輸入令牌 | > 200K 輸入令牌 |
|-----------------------------------|-------------------------------------|
| 輸入：$3 / MTok | 輸入：$6 / MTok |
| 輸出：$15 / MTok | 輸出：$22.50 / MTok |

長上下文定價與其他定價修飾符堆疊：
- [Batch API 50% 折扣](#batch-processing)適用於長上下文定價
- [提示快取倍數](#model-pricing)適用於長上下文定價之上

<Note>
即使啟用了測試版標誌，輸入令牌少於 200K 的請求也會按標準費率計費。如果您的請求超過 200K 輸入令牌，所有令牌都會產生高級定價。

200K 閾值僅基於輸入令牌（包括快取讀取/寫入）。輸出令牌計數不影響定價層級選擇，但當輸入閾值超過時，輸出令牌按較高費率計費。
</Note>

若要檢查您的 API 請求是否按 1M 上下文視窗費率計費，請檢查 API 回應中的 `usage` 物件：

```json
{
  "usage": {
    "input_tokens": 250000,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 500
  }
}
```

透過求和計算總輸入令牌：
- `input_tokens`
- `cache_creation_input_tokens`（如果使用提示快取）
- `cache_read_input_tokens`（如果使用提示快取）

如果總計超過 200,000 個令牌，整個請求將按 1M 上下文費率計費。

如需有關 `usage` 物件的更多資訊，請參閱 [API 回應文件](/docs/zh-TW/api/messages#response-usage)。

### 工具使用定價

Tool use requests are priced based on:
1. The total number of input tokens sent to the model (including in the `tools` parameter)
2. The number of output tokens generated
3. For server-side tools, additional usage-based pricing (e.g., web search charges per search performed)

Client-side tools are priced the same as any other Claude API request, while server-side tools may incur additional charges based on their specific usage.

The additional tokens from tool use come from:

- The `tools` parameter in API requests (tool names, descriptions, and schemas)
- `tool_use` content blocks in API requests and responses
- `tool_result` content blocks in API requests

When you use `tools`, we also automatically include a special system prompt for the model which enables tool use. The number of tool use tokens required for each model are listed below (excluding the additional tokens listed above). Note that the table assumes at least 1 tool is provided. If no `tools` are provided, then a tool choice of `none` uses 0 additional system prompt tokens.

| Model                    | Tool choice                                          | Tool use system prompt token count          |
|--------------------------|------------------------------------------------------|---------------------------------------------|
| Claude Opus 4.5            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4.1            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Opus 4            | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4.5          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 4          | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))        | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 4.5         | `auto`, `none`<hr />`any`, `tool`   | 346 tokens<hr />313 tokens |
| Claude Haiku 3.5         | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))            | `auto`, `none`<hr />`any`, `tool`   | 530 tokens<hr />281 tokens |
| Claude Sonnet 3          | `auto`, `none`<hr />`any`, `tool`   | 159 tokens<hr />235 tokens |
| Claude Haiku 3           | `auto`, `none`<hr />`any`, `tool`   | 264 tokens<hr />340 tokens |

These token counts are added to your normal input and output tokens to calculate the total cost of a request.

如需目前的每個模型價格，請參閱上面的[模型定價](#model-pricing)部分。

如需有關工具使用實施和最佳實踐的更多資訊，請參閱我們的[工具使用文件](/docs/zh-TW/agents-and-tools/tool-use/overview)。

### 特定工具定價

#### Bash 工具

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

請參閱[工具使用定價](#tool-use-pricing)以了解完整定價詳情。

#### 程式碼執行工具

Code execution tool usage is tracked separately from token usage. Execution time has a minimum of 5 minutes.
If files are included in the request, execution time is billed even if the tool is not used due to files being preloaded onto the container.

Each organization receives 50 free hours of usage with the code execution tool per day. Additional usage beyond the first 50 hours is billed at $0.05 per hour, per container.

#### 文字編輯器工具

The text editor tool uses the same pricing structure as other tools used with Claude. It follows the standard input and output token pricing based on the Claude model you're using.

In addition to the base tokens, the following additional input tokens are needed for the text editor tool:

| Tool | Additional input tokens |
| ----------------------------------------- | --------------------------------------- |
| `text_editor_20250429` (Claude 4.x) | 700 tokens |
| `text_editor_20250124` (Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations))) | 700 tokens |

請參閱[工具使用定價](#tool-use-pricing)以了解完整定價詳情。

#### 網路搜尋工具

Web search usage is charged in addition to token usage:

```json
"usage": {
  "input_tokens": 105,
  "output_tokens": 6039,
  "cache_read_input_tokens": 7123,
  "cache_creation_input_tokens": 7345,
  "server_tool_use": {
    "web_search_requests": 1
  }
}
```

Web search is available on the Claude API for **$10 per 1,000 searches**, plus standard token costs for search-generated content. Web search results retrieved throughout a conversation are counted as input tokens, in search iterations executed during a single turn and in subsequent conversation turns.

Each web search counts as one use, regardless of the number of results returned. If an error occurs during web search, the web search will not be billed.

#### 網路擷取工具

Web fetch usage has **no additional charges** beyond standard token costs:

```json
"usage": {
  "input_tokens": 25039,
  "output_tokens": 931,
  "cache_read_input_tokens": 0,
  "cache_creation_input_tokens": 0,
  "server_tool_use": {
    "web_fetch_requests": 1
  }
}
```

The web fetch tool is available on the Claude API at **no additional cost**. You only pay standard token costs for the fetched content that becomes part of your conversation context.

To protect against inadvertently fetching large content that would consume excessive tokens, use the `max_content_tokens` parameter to set appropriate limits based on your use case and budget considerations.

Example token usage for typical content:
- Average web page (10KB): ~2,500 tokens
- Large documentation page (100KB): ~25,000 tokens  
- Research paper PDF (500KB): ~125,000 tokens

#### 電腦使用工具

Computer use follows the standard [tool use pricing](/docs/en/agents-and-tools/tool-use/overview#pricing). When using the computer use tool:

**System prompt overhead**: The computer use beta adds 466-499 tokens to the system prompt

**Computer use tool token usage**:
| Model | Input tokens per tool definition |
| ----- | -------------------------------- |
| Claude 4.x models | 735 tokens |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | 735 tokens |

**Additional token consumption**:
- Screenshot images (see [Vision pricing](/docs/en/build-with-claude/vision))
- Tool execution results returned to Claude

<Note>
If you're also using bash or text editor tools alongside computer use, those tools have their own token costs as documented in their respective pages.
</Note>

## 代理使用案例定價範例

在使用 Claude 構建時，了解代理應用程式的定價至關重要。這些真實世界的範例可以幫助您估計不同代理模式的成本。

### 客戶支援代理範例

構建客戶支援代理時，成本可能會如下分解：

<Note>
  處理 10,000 個支援票證的範例計算：
  - 每次對話平均約 3,700 個令牌
  - 使用 Claude Sonnet 4.5，輸入 $3/MTok，輸出 $15/MTok
  - 總成本：每 10,000 個票證約 $22.20
</Note>

如需此計算的詳細逐步說明，請參閱我們的[客戶支援代理指南](/docs/zh-TW/about-claude/use-case-guides/customer-support-chat)。

### 一般代理工作流程定價

對於具有多個步驟的更複雜代理架構：

1. **初始請求處理**
   - 典型輸入：500-1,000 個令牌
   - 處理成本：每個請求約 $0.003

2. **記憶體和上下文檢索**
   - 檢索的上下文：2,000-5,000 個令牌
   - 每次檢索的成本：每個操作約 $0.015

3. **動作規劃和執行**
   - 規劃令牌：1,000-2,000
   - 執行反饋：500-1,000
   - 組合成本：每個動作約 $0.045

如需有關代理定價模式的綜合指南，請參閱我們的[代理使用案例指南](/docs/zh-TW/about-claude/use-case-guides)。

### 成本優化策略

使用 Claude 構建代理時：

1. **使用適當的模型**：為簡單任務選擇 Haiku，為複雜推理選擇 Sonnet
2. **實施提示快取**：減少重複上下文的成本
3. **批次操作**：對非時間敏感的任務使用 Batch API
4. **監控使用模式**：追蹤令牌消耗以識別優化機會

<Tip>
  對於大容量代理應用程式，請考慮聯絡我們的[企業銷售團隊](https://claude.com/contact-sales)以獲取自訂定價安排。
</Tip>

## 其他定價考慮事項

### 速率限制

速率限制因使用層級而異，並影響您可以發出的請求數量：

- **層級 1**：具有基本限制的入門級使用
- **層級 2**：為成長中的應用程式增加限制
- **層級 3**：為已建立的應用程式提高限制
- **層級 4**：最大標準限制
- **企業**：可用自訂限制

如需詳細的速率限制資訊，請參閱我們的[速率限制文件](/docs/zh-TW/api/rate-limits)。

如需更高的速率限制或自訂定價安排，請[聯絡我們的銷售團隊](https://claude.com/contact-sales)。

### 批量折扣

大容量使用者可能可以獲得批量折扣。這些折扣按個案協商。

- 標準層級使用上面顯示的定價
- 企業客戶可以[聯絡銷售](mailto:sales@anthropic.com)以獲取自訂定價
- 可能提供學術和研究折扣

### 企業定價

對於具有特定需求的企業客戶：

- 自訂速率限制
- 批量折扣
- 專業支援
- 自訂條款

透過 [sales@anthropic.com](mailto:sales@anthropic.com) 或 [Claude Console](/settings/limits) 聯絡我們的銷售團隊，以討論企業定價選項。

## 計費和付款

- 計費按月根據實際使用情況計算
- 付款以美元處理
- 信用卡和發票選項可用
- 使用追蹤可在 [Claude Console](/) 中使用

## 常見問題

**令牌使用如何計算？**

令牌是模型處理的文字片段。粗略估計，1 個令牌在英文中約為 4 個字元或 0.75 個單詞。確切計數因語言和內容類型而異。

**是否有免費層級或試用？**

新使用者會收到少量免費額度來測試 API。[聯絡銷售](mailto:sales@anthropic.com)以了解有關企業評估的延期試用資訊。

**折扣如何堆疊？**

Batch API 和提示快取折扣可以組合。例如，同時使用兩個功能相比標準 API 呼叫可提供顯著的成本節省。

**接受哪些付款方式？**

我們為標準帳戶接受主要信用卡。企業客戶可以安排發票和其他付款方式。

如有關於定價的其他問題，請聯絡 [support@anthropic.com](mailto:support@anthropic.com)。