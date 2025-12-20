# 功能概覽

探索 Claude 的進階功能和能力。

---

## 核心功能

這些功能增強了 Claude 在各種格式和使用案例中處理、分析和生成內容的基本能力。

| 功能 | 說明 | 可用性 |
|---------|-------------|--------------|
| [1M 代幣上下文視窗](/docs/zh-TW/build-with-claude/context-windows#1m-token-context-window) | 擴展的上下文視窗，允許您處理更大的文件、維持更長的對話，並使用更廣泛的程式碼庫。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Agent Skills](/docs/zh-TW/agents-and-tools/agent-skills/overview) | 使用 Skills 擴展 Claude 的功能。使用預先構建的 Skills（PowerPoint、Excel、Word、PDF）或使用說明和指令碼建立自訂 Skills。Skills 使用漸進式揭露來有效管理上下文。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [批次處理](/docs/zh-TW/build-with-claude/batch-processing) | 非同步處理大量請求以節省成本。發送包含大量查詢的批次。批次 API 呼叫的成本比標準 API 呼叫低 50%。 | <PlatformAvailability claudeApi bedrock vertexAi /> |
| [引文](/docs/zh-TW/build-with-claude/citations) | 在來源文件中建立 Claude 的回應。使用引文，Claude 可以提供對其用於生成回應的確切句子和段落的詳細參考，從而產生更可驗證、更值得信賴的輸出。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [上下文編輯](/docs/zh-TW/build-with-claude/context-editing) | 使用可配置的策略自動管理對話上下文。支援在接近代幣限制時清除工具結果，以及在擴展思考對話中管理思考塊。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Effort](/docs/zh-TW/build-with-claude/effort) | 使用 effort 參數控制 Claude 在回應時使用多少代幣，在回應完整性和代幣效率之間進行權衡。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [擴展思考](/docs/zh-TW/build-with-claude/extended-thinking) | 針對複雜任務的增強推理功能，在提供最終答案之前提供對 Claude 逐步思考過程的透明度。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [Files API](/docs/zh-TW/build-with-claude/files) | 上傳和管理檔案以與 Claude 搭配使用，無需在每個請求中重新上傳內容。支援 PDF、影像和文字檔案。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [PDF 支援](/docs/zh-TW/build-with-claude/pdf-support) | 處理和分析 PDF 文件中的文字和視覺內容。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [提示快取 (5m)](/docs/zh-TW/build-with-claude/prompt-caching) | 為 Claude 提供更多背景知識和範例輸出，以降低成本和延遲。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [提示快取 (1hr)](/docs/zh-TW/build-with-claude/prompt-caching#1-hour-cache-duration) | 擴展的 1 小時快取持續時間，適用於不經常存取但重要的上下文，補充標準 5 分鐘快取。 | <PlatformAvailability claudeApi azureAi /> |
| [搜尋結果](/docs/zh-TW/build-with-claude/search-results) | 透過提供具有適當來源歸屬的搜尋結果，為 RAG 應用程式啟用自然引文。為自訂知識庫和工具實現網路搜尋品質的引文。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [結構化輸出](/docs/zh-TW/build-with-claude/structured-outputs) | 使用兩種方法保證結構描述一致性：用於結構化資料回應的 JSON 輸出，以及用於驗證工具輸入的嚴格工具使用。可在 Sonnet 4.5、Opus 4.1、Opus 4.5 和 Haiku 4.5 上使用。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [代幣計數](/docs/zh-TW/api/messages-count-tokens) | 代幣計數使您能夠在將訊息發送給 Claude 之前確定訊息中的代幣數量，幫助您對提示和使用做出明智的決定。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [工具使用](/docs/zh-TW/agents-and-tools/tool-use/overview) | 使 Claude 能夠與外部工具和 API 互動，以執行更廣泛的任務。如需支援的工具清單，請參閱[工具表](#tools)。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |

## 工具

這些功能使 Claude 能夠透過各種工具介面與外部系統互動、執行程式碼和執行自動化任務。

| 功能 | 說明 | 可用性 |
|---------|-------------|--------------|
| [Bash](/docs/zh-TW/agents-and-tools/tool-use/bash-tool) | 執行 bash 命令和指令碼以與系統 shell 互動並執行命令列操作。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [程式碼執行](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool) | 在沙箱環境中執行 Python 程式碼以進行進階資料分析。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [程式設計工具呼叫](/docs/zh-TW/agents-and-tools/tool-use/programmatic-tool-calling) | 使 Claude 能夠從程式碼執行容器內以程式設計方式呼叫您的工具，減少多工具工作流程的延遲和代幣消耗。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [電腦使用](/docs/zh-TW/agents-and-tools/tool-use/computer-use-tool) | 透過截圖和發出滑鼠和鍵盤命令來控制電腦介面。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [細粒度工具串流](/docs/zh-TW/agents-and-tools/tool-use/fine-grained-tool-streaming) | 串流工具使用參數，無需緩衝/JSON 驗證，減少接收大型參數的延遲。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [MCP 連接器](/docs/zh-TW/agents-and-tools/mcp-connector) | 直接從 Messages API 連接到遠端 [MCP](/docs/zh-TW/mcp) 伺服器，無需單獨的 MCP 用戶端。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [記憶](/docs/zh-TW/agents-and-tools/tool-use/memory-tool) | 使 Claude 能夠在對話中儲存和檢索資訊。隨著時間推移建立知識庫、維持專案上下文，並從過去的互動中學習。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [文字編輯器](/docs/zh-TW/agents-and-tools/tool-use/text-editor-tool) | 使用內建文字編輯器介面建立和編輯文字檔案，以進行檔案操作任務。 | <PlatformAvailability claudeApi bedrock vertexAi azureAi /> |
| [工具搜尋](/docs/zh-TW/agents-and-tools/tool-use/tool-search-tool) | 透過使用基於正規表達式的搜尋動態發現和按需載入工具，擴展到數千個工具，優化上下文使用並改進工具選擇準確性。 | <PlatformAvailability claudeApiBeta bedrockBeta vertexAiBeta azureAiBeta /> |
| [Web 擷取](/docs/zh-TW/agents-and-tools/tool-use/web-fetch-tool) | 從指定的網頁和 PDF 文件檢索完整內容以進行深入分析。 | <PlatformAvailability claudeApiBeta azureAiBeta /> |
| [Web 搜尋](/docs/zh-TW/agents-and-tools/tool-use/web-search-tool) | 使用來自網路各地的當前、真實世界資料增強 Claude 的全面知識。 | <PlatformAvailability claudeApi vertexAi azureAi /> |