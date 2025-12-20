# Claude 開發者平台

Claude 開發者平台的更新，包括 Claude API、客戶端 SDK 和 Claude 控制台。

---

<Tip>
有關 Claude Apps 的發行說明，請參閱 [Claude 幫助中心中的 Claude Apps 發行說明](https://support.claude.com/en/articles/12138966-release-notes)。

有關 Claude Code 的更新，請參閱 `claude-code` 存儲庫中的 [完整 CHANGELOG.md](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)。
</Tip>

### 2025 年 12 月 4 日
- [結構化輸出](/docs/zh-TW/build-with-claude/structured-outputs)現在支持 Claude Haiku 4.5。

### 2025 年 11 月 24 日
- 我們推出了 [Claude Opus 4.5](https://www.anthropic.com/news/claude-opus-4-5)，這是我們最聰慧的模型，結合了最大的能力和實用的性能。非常適合複雜的專業任務、專業軟件工程和高級代理。在視覺、編碼和計算機使用方面具有階躍式改進，價格比以前的 Opus 模型更易於接受。在我們的 [模型和定價文檔](/docs/zh-TW/about-claude/models)中了解更多信息。
- 我們推出了 [程序化工具調用](/docs/zh-TW/agents-and-tools/tool-use/programmatic-tool-calling)的公開測試版，允許 Claude 從代碼執行中調用工具，以減少多工具工作流中的延遲和令牌使用。
- 我們推出了 [工具搜索工具](/docs/zh-TW/agents-and-tools/tool-use/tool-search-tool)的公開測試版，使 Claude 能夠從大型工具目錄中動態發現和按需加載工具。
- 我們為 Claude Opus 4.5 推出了 [effort 參數](/docs/zh-TW/build-with-claude/effort)的公開測試版，允許您通過在響應詳盡程度和效率之間進行權衡來控制令牌使用。
- 我們在 Python 和 TypeScript SDK 中添加了 [客戶端壓縮](/docs/zh-TW/build-with-claude/context-editing#client-side-compaction-sdk)，在使用 `tool_runner` 時通過摘要自動管理對話上下文。

### 2025 年 11 月 21 日
- 搜索結果內容塊現在在 Amazon Bedrock 上普遍可用。在我們的 [搜索結果文檔](/docs/zh-TW/build-with-claude/search-results)中了解更多信息。

### 2025 年 11 月 19 日
- 我們在 [platform.claude.com/docs](https://platform.claude.com/docs) 推出了**新的文檔平台**。我們的文檔現在與 Claude 控制台並排存在，提供統一的開發者體驗。之前位於 docs.claude.com 的文檔網站將重定向到新位置。

### 2025 年 11 月 18 日
- 我們推出了 **Claude in Microsoft Foundry**，將 Claude 模型帶給 Azure 客戶，提供 Azure 計費和 OAuth 身份驗證。訪問完整的 Messages API，包括擴展思考、提示緩存（5 分鐘和 1 小時）、PDF 支持、Files API、Agent Skills 和工具使用。在我們的 [Microsoft Foundry 文檔](/docs/zh-TW/build-with-claude/claude-in-microsoft-foundry)中了解更多信息。

### 2025 年 11 月 14 日
- 我們推出了 [結構化輸出](/docs/zh-TW/build-with-claude/structured-outputs)的公開測試版，為 Claude 的響應提供有保證的模式一致性。使用 JSON 輸出進行結構化數據響應或嚴格工具使用進行驗證的工具輸入。適用於 Claude Sonnet 4.5 和 Claude Opus 4.1。要啟用，請使用測試版標頭 `structured-outputs-2025-11-13`。

### 2025 年 10 月 28 日
- 我們宣布了 Claude Sonnet 3.7 模型的棄用。在 [我們的文檔](/docs/zh-TW/about-claude/model-deprecations)中了解更多信息。
- 我們已停用 Claude Sonnet 3.5 模型。對這些模型的所有請求現在都將返回錯誤。
- 我們擴展了上下文編輯，添加了思考塊清除（`clear_thinking_20251015`），實現了思考塊的自動管理。在我們的 [上下文編輯文檔](/docs/zh-TW/build-with-claude/context-editing)中了解更多信息。

### 2025 年 10 月 16 日
- 我們推出了 [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)（`skills-2025-10-02` 測試版），這是擴展 Claude 功能的新方式。Skills 是指令、腳本和資源的組織文件夾，Claude 動態加載這些文件夾以執行專業任務。初始版本包括：
  - **Anthropic 管理的 Skills**：用於處理 PowerPoint (.pptx)、Excel (.xlsx)、Word (.docx) 和 PDF 文件的預構建 Skills
  - **自定義 Skills**：通過 Skills API（`/v1/skills` 端點）上傳您自己的 Skills，以打包領域專業知識和組織工作流
  - Skills 需要啟用 [代碼執行工具](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool)
  - 在我們的 [Agent Skills 文檔](/docs/zh-TW/agents-and-tools/agent-skills/overview)和 [API 參考](/docs/zh-TW/api/skills/create-skill)中了解更多信息

### 2025 年 10 月 15 日
- 我們推出了 [Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5)，這是我們最快、最聰慧的 Haiku 模型，具有接近前沿的性能。非常適合實時應用、高容量處理和需要強大推理的成本敏感部署。在我們的 [模型和定價文檔](/docs/zh-TW/about-claude/models)中了解更多信息。

### 2025 年 9 月 29 日
- 我們推出了 [Claude Sonnet 4.5](https://www.anthropic.com/news/claude-sonnet-4-5)，這是我們最適合複雜代理和編碼的模型，在大多數任務中具有最高的智能。在 [Claude 4.5 的新功能](/docs/zh-TW/about-claude/models/whats-new-claude-4-5)中了解更多信息。
- 我們為 AWS Bedrock 和 Google Vertex AI 引入了 [全球端點定價](/docs/zh-TW/about-claude/pricing#third-party-platform-pricing)。Claude API (1P) 定價不受影響。
- 我們引入了新的停止原因 `model_context_window_exceeded`，允許您請求最大可能的令牌，而無需計算輸入大小。在我們的 [處理停止原因文檔](/docs/zh-TW/build-with-claude/handling-stop-reasons)中了解更多信息。
- 我們推出了測試版中的記憶工具，使 Claude 能夠在對話中存儲和查詢信息。在我們的 [記憶工具文檔](/docs/zh-TW/agents-and-tools/tool-use/memory-tool)中了解更多信息。
- 我們推出了測試版中的上下文編輯，提供自動管理對話上下文的策略。初始版本支持在接近令牌限制時清除較舊的工具結果和調用。在我們的 [上下文編輯文檔](/docs/zh-TW/build-with-claude/context-editing)中了解更多信息。

### 2025 年 9 月 17 日
- 我們為 Python 和 TypeScript SDK 推出了測試版中的工具助手，通過類型安全的輸入驗證和用於對話中自動化工具處理的工具運行器簡化了工具創建和執行。有關詳細信息，請參閱 [Python SDK 的文檔](https://github.com/anthropics/anthropic-sdk-python/blob/main/tools.md)和 [TypeScript SDK 的文檔](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/helpers.md#tool-helpers)。

### 2025 年 9 月 16 日
- 我們在 Claude 品牌下統一了我們的開發者產品。您應該在我們的平台和文檔中看到更新的命名和 URL，但**我們的開發者界面將保持不變**。以下是一些值得注意的更改：
  - Anthropic 控制台 ([console.anthropic.com](https://console.anthropic.com)) → Claude 控制台 ([platform.claude.com](https://platform.claude.com))。控制台將在兩個 URL 上可用，直到 2025 年 12 月 16 日。在該日期之後，[console.anthropic.com](https://console.anthropic.com) 將自動重定向到 [platform.claude.com](https://platform.claude.com)。
  - Anthropic 文檔 ([docs.claude.com](https://docs.claude.com)) → Claude 文檔 ([docs.claude.com](https://docs.claude.com))
  - Anthropic 幫助中心 ([support.claude.com](https://support.claude.com)) → Claude 幫助中心 ([support.claude.com](https://support.claude.com))
  - API 端點、標頭、環境變量和 SDK 保持不變。您現有的集成將繼續工作，無需任何更改。

### 2025 年 9 月 10 日
- 我們推出了測試版中的網絡獲取工具，允許 Claude 從指定的網頁和 PDF 文檔中檢索完整內容。在我們的 [網絡獲取工具文檔](/docs/zh-TW/agents-and-tools/tool-use/web-fetch-tool)中了解更多信息。
- 我們推出了 [Claude Code 分析 API](/docs/zh-TW/build-with-claude/claude-code-analytics-api)，使組織能夠以編程方式訪問 Claude Code 的每日聚合使用指標，包括生產力指標、工具使用統計和成本數據。

### 2025 年 9 月 8 日
- 我們推出了 [C# SDK](https://github.com/anthropics/anthropic-sdk-csharp) 的測試版。

### 2025 年 9 月 5 日
- 我們在控制台 [使用情況](https://console.anthropic.com/settings/usage)頁面推出了 [速率限制圖表](/docs/zh-TW/api/rate-limits#monitoring-your-rate-limits-in-the-console)，允許您監控 API 速率限制使用和緩存速率隨時間的變化。

### 2025 年 9 月 3 日
- 我們推出了對客戶端工具結果中可引用文檔的支持。在我們的 [工具使用文檔](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use)中了解更多信息。

### 2025 年 9 月 2 日
- 我們推出了 [代碼執行工具](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool)的 v2 版本的公開測試版，用 Bash 命令執行和直接文件操作功能（包括用其他語言編寫代碼）替換了原始的僅 Python 工具。

### 2025 年 8 月 27 日
- 我們推出了 [PHP SDK](https://github.com/anthropics/anthropic-sdk-php) 的測試版。

### 2025 年 8 月 26 日
- 我們增加了 Claude API 上 Claude Sonnet 4 的 [1M 令牌上下文窗口](/docs/zh-TW/build-with-claude/context-windows#1m-token-context-window)的速率限制。有關更多信息，請參閱 [長上下文速率限制](/docs/zh-TW/api/rate-limits#long-context-rate-limits)。
- 1m 令牌上下文窗口現在在 Google Cloud 的 Vertex AI 上可用。有關更多信息，請參閱 [Claude on Vertex AI](/docs/zh-TW/build-with-claude/claude-on-vertex-ai)。

### 2025 年 8 月 19 日
- 請求 ID 現在直接包含在錯誤響應正文中，以及現有的 `request-id` 標頭。在我們的 [錯誤文檔](/docs/zh-TW/api/errors#error-shapes)中了解更多信息。

### 2025 年 8 月 18 日
- 我們發布了 [使用情況和成本 API](/docs/zh-TW/build-with-claude/usage-cost-api)，允許管理員以編程方式監控其組織的使用情況和成本數據。
- 我們向 Admin API 添加了新端點以檢索組織信息。有關詳細信息，請參閱 [組織信息 Admin API 參考](/docs/zh-TW/api/admin-api/organization/get-me)。

### 2025 年 8 月 13 日
- 我們宣布了 Claude Sonnet 3.5 模型（`claude-3-5-sonnet-20240620` 和 `claude-3-5-sonnet-20241022`）的棄用。這些模型將在 2025 年 10 月 28 日停用。我們建議遷移到 Claude Sonnet 4.5（`claude-sonnet-4-5-20250929`）以獲得改進的性能和功能。在 [模型棄用文檔](/docs/zh-TW/about-claude/model-deprecations)中了解更多信息。
- 提示緩存的 1 小時緩存持續時間現在普遍可用。您現在可以使用擴展的緩存 TTL，無需測試版標頭。在我們的 [提示緩存文檔](/docs/zh-TW/build-with-claude/prompt-caching#1-hour-cache-duration)中了解更多信息。

### 2025 年 8 月 12 日
- 我們在 Claude API 和 Amazon Bedrock 上的 Claude Sonnet 4 中推出了 [1M 令牌上下文窗口](/docs/zh-TW/build-with-claude/context-windows#1m-token-context-window)的測試版支持。

### 2025 年 8 月 11 日
- 由於 API 使用量急劇增加導致 API 加速限制，某些客戶可能會遇到 429（`rate_limit_error`）[錯誤](/docs/zh-TW/api/errors)。以前，在類似情況下會發生 529（`overloaded_error`）錯誤。

### 2025 年 8 月 8 日
- 搜索結果內容塊現在在 Claude API 和 Google Cloud 的 Vertex AI 上普遍可用。此功能為 RAG 應用程序啟用自然引用，具有適當的來源歸屬。不再需要測試版標頭 `search-results-2025-06-09`。在我們的 [搜索結果文檔](/docs/zh-TW/build-with-claude/search-results)中了解更多信息。

### 2025 年 8 月 5 日
- 我們推出了 [Claude Opus 4.1](https://www.anthropic.com/news/claude-opus-4-1)，這是 Claude Opus 4 的增量更新，具有增強的功能和性能改進。<sup>*</sup> 在我們的 [模型和定價文檔](/docs/zh-TW/about-claude/models)中了解更多信息。

_<sup>* - Opus 4.1 不允許同時指定 `temperature` 和 `top_p` 參數。請只使用其中一個。</sup>_

### 2025 年 7 月 28 日
- 我們發布了 `text_editor_20250728`，這是一個更新的文本編輯器工具，修復了以前版本的一些問題，並添加了一個可選的 `max_characters` 參數，允許您在查看大型文件時控制截斷長度。

### 2025 年 7 月 24 日
- 我們增加了 Claude API 上 Claude Opus 4 的 [速率限制](/docs/zh-TW/api/rate-limits)，為您提供更多容量來構建和擴展 Claude。對於具有 [使用層 1-4 速率限制](/docs/zh-TW/api/rate-limits#rate-limits)的客戶，這些更改立即應用於您的帳戶 - 無需採取任何行動。

### 2025 年 7 月 21 日
- 我們已停用 Claude 2.0、Claude 2.1 和 Claude Sonnet 3 模型。對這些模型的所有請求現在都將返回錯誤。在 [我們的文檔](/docs/zh-TW/about-claude/model-deprecations)中了解更多信息。

### 2025 年 7 月 17 日
- 我們增加了 Claude API 上 Claude Sonnet 4 的 [速率限制](/docs/zh-TW/api/rate-limits)，為您提供更多容量來構建和擴展 Claude。對於具有 [使用層 1-4 速率限制](/docs/zh-TW/api/rate-limits#rate-limits)的客戶，這些更改立即應用於您的帳戶 - 無需採取任何行動。

### 2025 年 7 月 3 日
- 我們推出了測試版中的搜索結果內容塊，為 RAG 應用程序啟用自然引用。工具現在可以返回具有適當來源歸屬的搜索結果，Claude 將自動在其響應中引用這些來源 - 與網絡搜索的引用質量相匹配。這消除了在自定義知識庫應用程序中使用文檔變通方法的需要。在我們的 [搜索結果文檔](/docs/zh-TW/build-with-claude/search-results)中了解更多信息。要啟用此功能，請使用測試版標頭 `search-results-2025-06-09`。

### 2025 年 6 月 30 日
- 我們宣布了 Claude Opus 3 模型的棄用。在 [我們的文檔](/docs/zh-TW/about-claude/model-deprecations)中了解更多信息。

### 2025 年 6 月 23 日
- 具有開發者角色的控制台用戶現在可以訪問 [成本](https://console.anthropic.com/settings/cost)頁面。以前，開發者角色允許訪問 [使用情況](https://console.anthropic.com/settings/usage)頁面，但不允許訪問成本頁面。

### 2025 年 6 月 11 日
- 我們推出了 [細粒度工具流](/docs/zh-TW/agents-and-tools/tool-use/fine-grained-tool-streaming)的公開測試版，這是一項使 Claude 能夠流式傳輸工具使用參數而無需緩衝 / JSON 驗證的功能。要啟用細粒度工具流，請使用 [測試版標頭](/docs/zh-TW/api/beta-headers) `fine-grained-tool-streaming-2025-05-14`。

### 2025 年 5 月 22 日
- 我們推出了 [Claude Opus 4 和 Claude Sonnet 4](http://www.anthropic.com/news/claude-4)，我們具有擴展思考功能的最新模型。在我們的 [模型和定價文檔](/docs/zh-TW/about-claude/models)中了解更多信息。
- [Claude 4 模型中的擴展思考](/docs/zh-TW/build-with-claude/extended-thinking)的默認行為返回 Claude 完整思考過程的摘要，完整思考被加密並在 `thinking` 塊輸出的 `signature` 字段中返回。
- 我們推出了 [交錯思考](/docs/zh-TW/build-with-claude/extended-thinking#interleaved-thinking)的公開測試版，這是一項使 Claude 能夠在工具調用之間進行思考的功能。要啟用交錯思考，請使用 [測試版標頭](/docs/zh-TW/api/beta-headers) `interleaved-thinking-2025-05-14`。
- 我們推出了 [Files API](/docs/zh-TW/build-with-claude/files)的公開測試版，使您能夠上傳文件並在 Messages API 和代碼執行工具中引用它們。
- 我們推出了 [代碼執行工具](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool)的公開測試版，這是一個使 Claude 能夠在安全的沙箱環境中執行 Python 代碼的工具。
- 我們推出了 [MCP 連接器](/docs/zh-TW/agents-and-tools/mcp-connector)的公開測試版，這是一項允許您直接從 Messages API 連接到遠程 MCP 服務器的功能。
- 為了提高答案質量並減少工具錯誤，我們將 Messages API 中 `top_p` [核採樣](https://en.wikipedia.org/wiki/Top-p_sampling)參數的默認值從 0.999 更改為 0.99，適用於所有模型。要恢復此更改，請將 `top_p` 設置為 0.999。
    此外，啟用擴展思考後，您現在可以將 `top_p` 設置為 0.95 到 1 之間的值。
- 我們將 [Go SDK](https://github.com/anthropics/anthropic-sdk-go) 從測試版移至 GA。
- 我們在控制台的 [使用情況](https://console.anthropic.com/settings/usage)頁面中添加了分鐘和小時級別的粒度，以及使用情況頁面上的 429 錯誤率。

### 2025 年 5 月 21 日
- 我們將 [Ruby SDK](https://github.com/anthropics/anthropic-sdk-ruby) 從測試版移至 GA。

### 2025 年 5 月 7 日
- 我們在 API 中推出了網絡搜索工具，允許 Claude 訪問來自網絡的最新信息。在我們的 [網絡搜索工具文檔](/docs/zh-TW/agents-and-tools/tool-use/web-search-tool)中了解更多信息。

### 2025 年 5 月 1 日
- 現在必須直接在 `tool_result` 和 `document.source` 的父 `content` 塊中指定緩存控制。為了向後兼容，如果在 `tool_result.content` 或 `document.source.content` 中的最後一個塊上檢測到緩存控制，它將自動應用於父塊。`tool_result.content` 和 `document.source.content` 中任何其他塊上的緩存控制將導致驗證錯誤。

### 2025 年 4 月 9 日
- 我們推出了 [Ruby SDK](https://github.com/anthropics/anthropic-sdk-ruby) 的測試版

### 2025 年 3 月 31 日
- 我們將 [Java SDK](https://github.com/anthropics/anthropic-sdk-java) 從測試版移至 GA。
- 我們將 [Go SDK](https://github.com/anthropics/anthropic-sdk-go) 從 alpha 移至測試版。

### 2025 年 2 月 27 日
- 我們在 Messages API 中為圖像和 PDF 添加了 URL 源塊。您現在可以直接通過 URL 引用圖像和 PDF，而不必對其進行 base64 編碼。在我們的 [視覺文檔](/docs/zh-TW/build-with-claude/vision)和 [PDF 支持文檔](/docs/zh-TW/build-with-claude/pdf-support)中了解更多信息。
- 我們為 Messages API 中的 `tool_choice` 參數添加了對 `none` 選項的支持，該選項防止 Claude 調用任何工具。此外，在包含 `tool_use` 和 `tool_result` 塊時，您不再需要提供任何 `tools`。
- 我們推出了 OpenAI 兼容的 API 端點，允許您通過在現有 OpenAI 集成中更改 API 密鑰、基本 URL 和模型名稱來測試 Claude 模型。此兼容性層支持核心聊天完成功能。在我們的 [OpenAI SDK 兼容性文檔](/docs/zh-TW/api/openai-sdk)中了解更多信息。

### 2025 年 2 月 24 日
- 我們推出了 [Claude Sonnet 3.7](http://www.anthropic.com/news/claude-3-7-sonnet)，這是我們迄今為止最聰慧的模型。Claude Sonnet 3.7 可以產生近乎即時的響應或逐步展示其擴展思考。一個模型，兩種思考方式。在我們的 [模型和定價文檔](/docs/zh-TW/about-claude/models)中了解有關所有 Claude 模型的更多信息。
- 我們為 Claude Haiku 3.5 添加了視覺支持，使模型能夠分析和理解圖像。
- 我們發布了令牌高效的工具使用實現，改進了使用 Claude 工具時的整體性能。在我們的 [工具使用文檔](/docs/zh-TW/agents-and-tools/tool-use/overview)中了解更多信息。
- 我們將 [控制台](https://console.anthropic.com/workbench)中新提示的默認溫度從 0 更改為 1，以與 API 中的默認溫度保持一致。現有保存的提示保持不變。
- 我們發布了更新版本的工具，將文本編輯和 bash 工具與計算機使用系統提示分離：
  - `bash_20250124`：與以前版本相同的功能，但獨立於計算機使用。不需要測試版標頭。
  - `text_editor_20250124`：與以前版本相同的功能，但獨立於計算機使用。不需要測試版標頭。
  - `computer_20250124`：更新的計算機使用工具，具有新的命令選項，包括"hold_key"、"left_mouse_down"、"left_mouse_up"、"scroll"、"triple_click"和"wait"。此工具需要"computer-use-2025-01-24"anthropic-beta 標頭。
  在我們的 [工具使用文檔](/docs/zh-TW/agents-and-tools/tool-use/overview)中了解更多信息。

### 2025 年 2 月 10 日
- 我們在所有 API 響應中添加了 `anthropic-organization-id` 響應標頭。此標頭提供與請求中使用的 API 密鑰關聯的組織 ID。

### 2025 年 1 月 31 日

- 我們將 [Java SDK](https://github.com/anthropics/anthropic-sdk-java) 從 alpha 移至測試版。

### 2025 年 1 月 23 日

- 我們在 API 中推出了引用功能，允許 Claude 為信息提供來源歸屬。在我們的 [引用文檔](/docs/zh-TW/build-with-claude/citations)中了解更多信息。
- 我們在 Messages API 中添加了對純文本文檔和自定義內容文檔的支持。

### 2025 年 1 月 21 日

- 我們宣布了 Claude 2、Claude 2.1 和 Claude Sonnet 3 模型的棄用。在 [我們的文檔](/docs/zh-TW/about-claude/model-deprecations)中了解更多信息。

### 2025 年 1 月 15 日

- 我們更新了 [提示緩存](/docs/zh-TW/build-with-claude/prompt-caching)以使其更易於使用。現在，當您設置緩存斷點時，我們將自動從您最長的先前緩存前綴中讀取。
- 使用工具時，您現在可以將言語放在 Claude 的嘴裡。

### 2025 年 1 月 10 日

- 我們優化了 [Message Batches API 中的提示緩存](/docs/zh-TW/build-with-claude/batch-processing#using-prompt-caching-with-message-batches)支持，以改進緩存命中率。

### 2024 年 12 月 19 日

- 我們在 Message Batches API 中添加了對 [刪除端點](/docs/zh-TW/api/deleting-message-batches)的支持

### 2024 年 12 月 17 日
以下功能現在在 Claude API 中普遍可用：

- [模型 API](/docs/zh-TW/api/models-list)：查詢可用模型、驗證模型 ID 並將 [模型別名](/docs/zh-TW/about-claude/models#model-names)解析為其規範模型 ID。
- [Message Batches API](/docs/zh-TW/build-with-claude/batch-processing)：以標準 API 成本的 50% 異步處理大批量消息。
- [令牌計數 API](/docs/zh-TW/build-with-claude/token-counting)：在將消息發送給 Claude 之前計算消息的令牌計數。
- [提示緩存](/docs/zh-TW/build-with-claude/prompt-caching)：通過緩存和重新使用提示內容，將成本降低高達 90%，延遲降低高達 80%。
- [PDF 支持](/docs/zh-TW/build-with-claude/pdf-support)：處理 PDF 以分析文檔中的文本和視覺內容。

我們還發布了新的官方 SDK：
- [Java SDK](https://github.com/anthropics/anthropic-sdk-java)（alpha）
- [Go SDK](https://github.com/anthropics/anthropic-sdk-go)（alpha）

### 2024 年 12 月 4 日

- 我們添加了按 API 密鑰分組的功能到 [開發者控制台](https://console.anthropic.com)的 [使用情況](https://console.anthropic.com/settings/usage)和 [成本](https://console.anthropic.com/settings/cost)頁面
- 我們在 [開發者控制台](https://console.anthropic.com)的 [API 密鑰](https://console.anthropic.com/settings/keys)頁面中添加了兩個新的**最後使用時間**和**成本**列，以及按任何列排序的功能

### 2024 年 11 月 21 日

- 我們發布了 [Admin API](/docs/zh-TW/build-with-claude/administration-api)，允許用戶以編程方式管理其組織的資源。

### 2024 年 11 月 20 日

- 我們更新了 Messages API 的速率限制。我們用新的輸入和輸出令牌每分鐘速率限制替換了每分鐘令牌速率限制。在我們的 [文檔](/docs/zh-TW/api/rate-limits)中了解更多信息。
- 我們在 [Workbench](https://console.anthropic.com/workbench) 中添加了對 [工具使用](/docs/zh-TW/agents-and-tools/tool-use/overview)的支持。

### 2024 年 11 月 13 日

- 我們為所有 Claude Sonnet 3.5 模型添加了 PDF 支持。在我們的 [文檔](/docs/zh-TW/build-with-claude/pdf-support)中了解更多信息。

### 2024 年 11 月 6 日

- 我們已停用 Claude 1 和 Instant 模型。在 [我們的文檔](/docs/zh-TW/about-claude/model-deprecations)中了解更多信息。

### 2024 年 11 月 4 日

- [Claude Haiku 3.5](https://www.anthropic.com/claude/haiku) 現在在 Claude API 上作為純文本模型可用。

### 2024 年 11 月 1 日

- 我們為新的 Claude Sonnet 3.5 添加了 PDF 支持。在我們的 [文檔](/docs/zh-TW/build-with-claude/pdf-support)中了解更多信息。
- 我們還添加了令牌計數，允許您在將消息發送給 Claude 之前確定消息中的總令牌數。在我們的 [文檔](/docs/zh-TW/build-with-claude/token-counting)中了解更多信息。

### 2024 年 10 月 22 日

- 我們為 API 添加了 Anthropic 定義的計算機使用工具，用於新的 Claude Sonnet 3.5。在我們的 [文檔](/docs/zh-TW/agents-and-tools/tool-use/computer-use-tool)中了解更多信息。
- Claude Sonnet 3.5，我們迄今為止最聰慧的模型，剛剛進行了升級，現在在 Claude API 上可用。在 [此處](https://www.anthropic.com/claude/sonnet)了解更多信息。

### 2024 年 10 月 8 日

- Message Batches API 現在以測試版形式提供。在 Claude API 中異步處理大批量查詢，成本降低 50%。在我們的 [文檔](/docs/zh-TW/build-with-claude/batch-processing)中了解更多信息。
- 我們放寬了對 Messages API 中 `user`/`assistant` 轉換順序的限制。連續的 `user`/`assistant` 消息將合併為單個消息，而不是出錯，我們不再要求第一個輸入消息是 `user` 消息。
- 我們棄用了 Build 和 Scale 計劃，轉而採用標準功能套件（以前稱為 Build），以及通過銷售提供的其他功能。在 [此處](https://claude.com/platform/api)了解更多信息。

### 2024 年 10 月 3 日

- 我們添加了在 API 中禁用並行工具使用的功能。在 `tool_choice` 字段中設置 `disable_parallel_tool_use: true` 以確保 Claude 最多使用一個工具。在我們的 [文檔](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#parallel-tool-use)中了解更多信息。

### 2024 年 9 月 10 日

- 我們在 [開發者控制台](https://console.anthropic.com)中添加了工作區。工作區允許您設置自定義支出或速率限制、分組 API 密鑰、按項目跟踪使用情況並使用用戶角色控制訪問。在我們的 [博客文章](https://www.anthropic.com/news/workspaces)中了解更多信息。

### 2024 年 9 月 4 日

- 我們宣布了 Claude 1 模型的棄用。在 [我們的文檔](/docs/zh-TW/about-claude/model-deprecations)中了解更多信息。

### 2024 年 8 月 22 日

- 我們通過在 API 響應中返回 CORS 標頭添加了對 SDK 在瀏覽器中使用的支持。在 SDK 實例化中設置 `dangerouslyAllowBrowser: true` 以啟用此功能。

### 2024 年 8 月 19 日

- 我們將 Claude Sonnet 3.5 的 8,192 令牌輸出從測試版移至普遍可用。

### 2024 年 8 月 14 日

- [提示緩存](/docs/zh-TW/build-with-claude/prompt-caching)現在在 Claude API 中作為測試版功能提供。緩存和重新使用提示，將延遲降低高達 80%，成本降低高達 90%。

### 2024 年 7 月 15 日

- 使用新的 `anthropic-beta: max-tokens-3-5-sonnet-2024-07-15` 標頭從 Claude Sonnet 3.5 生成長度高達 8,192 令牌的輸出。

### 2024 年 7 月 9 日

- 在 [開發者控制台](https://console.anthropic.com)中使用 Claude 自動為您的提示生成測試用例。
- 在 [開發者控制台](https://console.anthropic.com)中的新輸出比較模式中並排比較不同提示的輸出。

### 2024 年 6 月 27 日

- 在 [開發者控制台](https://console.anthropic.com)的新 [使用情況](https://console.anthropic.com/settings/usage)和 [成本](https://console.anthropic.com/settings/cost)選項卡中查看按美元金額、令牌計數和 API 密鑰細分的 API 使用情況和計費。
- 在 [開發者控制台](https://console.anthropic.com)的新 [速率限制](https://console.anthropic.com/settings/limits)選項卡中查看您當前的 API 速率限制。

### 2024 年 6 月 20 日

- [Claude Sonnet 3.5](http://anthropic.com/news/claude-3-5-sonnet)，我們迄今為止最聰慧的模型，現在在 Claude API、Amazon Bedrock 和 Google Vertex AI 上普遍可用。

### 2024 年 5 月 30 日

- [工具使用](/docs/zh-TW/agents-and-tools/tool-use/overview)現在在 Claude API、Amazon Bedrock 和 Google Vertex AI 上普遍可用。

### 2024 年 5 月 10 日

- 我們的提示生成器工具現在在 [開發者控制台](https://console.anthropic.com)中可用。提示生成器使您可以輕鬆引導 Claude 生成針對您的特定任務量身定制的高質量提示。在我們的 [博客文章](https://www.anthropic.com/news/prompt-generator)中了解更多信息。