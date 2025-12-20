# Claude 4.5 的新功能

了解 Claude 4.5 中的新功能，包括三個新模型、改進的功能和 API 增強。

---

Claude 4.5 推出了三個為不同用例設計的模型：

- **Claude Opus 4.5**：我們最智能的模型，結合了最大功能與實用性能。相比之前的 Opus 模型，價格更加親民。提供 200k token 上下文窗口。
- **Claude Sonnet 4.5**：我們最適合複雜代理和編碼的模型，在大多數任務中具有最高的智能。提供 200k 和 1M（測試版）token 上下文窗口。
- **Claude Haiku 4.5**：我們最快且最智能的 Haiku 模型，具有接近前沿的性能。提供 200k token 上下文窗口。

## Opus 4.5 相比 Opus 4.1 的主要改進

### 最大智能

Claude Opus 4.5 代表了我們最智能的模型，結合了最大功能與實用性能。它在推理、編碼和複雜問題解決任務中提供了階躍式改進，同時保持了 Opus 系列所期望的高質量輸出。

### 努力參數

Claude Opus 4.5 是唯一支持[努力參數](/docs/zh-TW/build-with-claude/effort)的模型，允許您控制 Claude 在響應時使用多少 token。這使您能夠在單個模型中權衡響應的詳盡程度和 token 效率。

努力參數影響響應中的所有 token，包括文本響應、工具調用和擴展思考。您可以選擇：
- **高努力**：用於複雜分析和詳細解釋的最大詳盡程度
- **中等努力**：適合大多數生產用例的平衡方法
- **低努力**：用於高容量自動化的最高 token 效率響應

### 計算機使用卓越性

Claude Opus 4.5 引入了[增強的計算機使用功能](/docs/zh-TW/agents-and-tools/tool-use/computer-use-tool)，配備新的縮放操作，可以以全分辨率詳細檢查特定屏幕區域。這使 Claude 能夠檢查細粒度的 UI 元素、小文本和詳細的視覺信息，這些信息在標準屏幕截圖中可能不清楚。

縮放功能特別適用於：
- 檢查小型 UI 元素和控件
- 閱讀細則或詳細文本
- 分析具有密集信息的複雜界面
- 在採取行動前驗證精確的視覺細節

### 實用性能

Claude Opus 4.5 以[更親民的價格點](/docs/zh-TW/about-claude/pricing)提供旗艦級智能，相比之前的 Opus 模型，使先進的 AI 功能可用於更廣泛的應用和用例。

### 思考塊保留

Claude Opus 4.5 [自動保留整個對話中的所有先前思考塊](/docs/zh-TW/build-with-claude/extended-thinking#thinking-block-preservation-in-claude-opus-4-5)，在擴展的多輪交互和工具使用會話中保持推理連續性。這確保 Claude 在處理複雜的長期運行任務時能夠有效地利用其完整的推理歷史。

## Sonnet 4.5 相比 Sonnet 4 的主要改進

### 編碼卓越性

Claude Sonnet 4.5 是我們迄今為止最好的編碼模型，在整個開發生命週期中有顯著改進：

- **SWE-bench 驗證性能**：編碼基準上的先進最先進技術
- **增強的規劃和系統設計**：更好的架構決策和代碼組織
- **改進的安全工程**：更強大的安全實踐和漏洞檢測
- **更好的指令遵循**：更精確地遵循編碼規範和要求

<Note>
當[擴展思考](/docs/zh-TW/build-with-claude/extended-thinking)啟用時，Claude Sonnet 4.5 在編碼任務上的表現明顯更好。擴展思考默認禁用，但我們建議為複雜編碼工作啟用它。請注意，擴展思考會影響[提示緩存效率](/docs/zh-TW/build-with-claude/prompt-caching#caching-with-thinking-blocks)。有關配置詳情，請參閱[遷移指南](/docs/zh-TW/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations)。
</Note>

### 代理功能

Claude Sonnet 4.5 在代理功能中引入了重大進展：

- **擴展自主操作**：Sonnet 4.5 可以獨立工作數小時，同時保持對增量進度的清晰關注。該模型一次在幾個任務上取得穩定進展，而不是試圖一次完成所有事情。它提供基於事實的進度更新，準確反映已完成的工作。
- **上下文感知**：Claude 現在在整個對話中跟蹤其 token 使用情況，在每次工具調用後接收更新。這種感知有助於防止過早放棄任務，並在長期運行的任務上實現更有效的執行。有關技術詳情，請參閱[上下文感知](/docs/zh-TW/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5)，以及[提示指導](/docs/zh-TW/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows)。
- **增強的工具使用**：該模型更有效地使用並行工具調用，在研究期間同時發起多個推測搜索，並一次讀取多個文件以更快地構建上下文。跨多個工具和信息源的改進協調使該模型能夠在代理搜索和編碼工作流中有效地利用廣泛的功能。
- **高級上下文管理**：Sonnet 4.5 在外部文件中保持異常的狀態跟蹤，在會話中保持目標導向。結合更有效的上下文窗口使用和我們新的上下文管理 API 功能，該模型最優地處理擴展會話中的信息，以保持長期的連貫性。

<Note>上下文感知在 Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1 和 Opus 4.5 中可用。</Note>

### 通信和交互風格

Claude Sonnet 4.5 具有精煉的通信方式，簡潔、直接且自然。它提供基於事實的進度更新，並可能在工具調用後跳過冗長的摘要以保持工作流動力（儘管這可以通過提示調整）。

有關使用此通信風格的詳細指導，請參閱 [Claude 4 最佳實踐](/docs/zh-TW/build-with-claude/prompt-engineering/claude-4-best-practices)。

### 創意內容生成

Claude Sonnet 4.5 在創意內容任務中表現出色：

- **演示文稿和動畫**：在創建幻燈片和視覺內容方面與 Claude Opus 4.1 和 Opus 4.5 相匹配或超越
- **創意風格**：以強大的指令遵循能力生成精美、專業的輸出
- **首次質量**：在初始嘗試中生成可用、設計精良的內容

## Haiku 4.5 相比 Haiku 3.5 的主要改進

Claude Haiku 4.5 代表了 Haiku 模型系列的變革性飛躍，為我們最快的模型類別帶來了前沿功能：

### 接近前沿的智能與閃電般的速度

Claude Haiku 4.5 以顯著更低的成本和更快的速度提供與 Sonnet 4 相匹配的接近前沿的性能：

- **接近前沿的智能**：在推理、編碼和複雜任務中與 Sonnet 4 性能相匹配
- **增強的速度**：比 Sonnet 4 快兩倍多，針對每秒輸出 token 數 (OTPS) 進行了優化
- **最優成本性能**：以三分之一的成本實現接近前沿的智能，非常適合大容量部署

### 擴展思考功能

Claude Haiku 4.5 是**第一個支持擴展思考的 Haiku 模型**，為 Haiku 系列帶來了先進的推理功能：

- **速度推理**：訪問 Claude 的內部推理過程以進行複雜問題解決
- **思考總結**：為生產就緒部署總結思考輸出
- **交錯思考**：在工具調用之間思考，以實現更複雜的多步工作流
- **預算控制**：配置思考 token 預算以平衡推理深度和速度

必須通過向 API 請求添加 `thinking` 參數來顯式啟用擴展思考。有關實現詳情，請參閱[擴展思考文檔](/docs/zh-TW/build-with-claude/extended-thinking)。

<Note>
當[擴展思考](/docs/zh-TW/build-with-claude/extended-thinking)啟用時，Claude Haiku 4.5 在編碼和推理任務上的表現明顯更好。擴展思考默認禁用，但我們建議為複雜問題解決、編碼工作和多步推理啟用它。請注意，擴展思考會影響[提示緩存效率](/docs/zh-TW/build-with-claude/prompt-caching#caching-with-thinking-blocks)。有關配置詳情，請參閱[遷移指南](/docs/zh-TW/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations)。
</Note>

<Note>在 Claude Sonnet 3.7、Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1 和 Opus 4.5 中可用。</Note>

### 上下文感知

Claude Haiku 4.5 具有**上下文感知**功能，使模型能夠在整個對話中跟蹤其剩餘上下文窗口：

- **Token 預算跟蹤**：Claude 在每次工具調用後接收有關剩餘上下文容量的實時更新
- **更好的任務持久性**：該模型可以通過理解可用的工作空間更有效地執行任務
- **多上下文窗口工作流**：改進了跨擴展會話的狀態轉換處理

這是第一個具有原生上下文感知功能的 Haiku 模型。有關提示指導，請參閱 [Claude 4 最佳實踐](/docs/zh-TW/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows)。

<Note>在 Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1 和 Opus 4.5 中可用。</Note>

### 強大的編碼和工具使用

Claude Haiku 4.5 提供了現代 Claude 模型所期望的強大編碼功能：

- **編碼能力**：在代碼生成、調試和重構任務中的強大性能
- **完整工具支持**：與所有 Claude 4 工具兼容，包括 bash、代碼執行、文本編輯器、網絡搜索和計算機使用
- **增強的計算機使用**：針對自主桌面交互和瀏覽器自動化工作流進行了優化
- **並行工具執行**：跨多個工具的高效協調，用於複雜工作流

Haiku 4.5 設計用於需要智能和效率的用例：

- **實時應用**：為交互式用戶體驗提供快速響應時間
- **高容量處理**：用於大規模部署的經濟高效的智能
- **免費層實現**：以親民的價格提供高級模型質量
- **子代理架構**：用於多代理系統的快速、智能代理
- **大規模計算機使用**：經濟高效的自主桌面和瀏覽器自動化

## 新 API 功能

### 程序化工具調用（測試版）

[程序化工具調用](/docs/zh-TW/agents-and-tools/tool-use/programmatic-tool-calling)允許 Claude 在代碼執行容器中以程序方式編寫調用您的工具的代碼，而不是需要為每次工具調用往返模型。這大大降低了多工具工作流的延遲，並通過允許 Claude 在數據到達模型的上下文窗口之前過濾或處理數據來減少 token 消耗。

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

主要優點：
- **降低延遲**：消除工具調用之間的模型往返
- **Token 效率**：在返回到 Claude 之前以程序方式處理和過濾工具結果
- **複雜工作流**：支持循環、條件邏輯和批處理

<Note>在 Claude Opus 4.5 和 Claude Sonnet 4.5 中可用。需要[測試版標頭](/docs/zh-TW/api/beta-headers)：`advanced-tool-use-2025-11-20`</Note>

### 工具搜索工具（測試版）

[工具搜索工具](/docs/zh-TW/agents-and-tools/tool-use/tool-search-tool)使 Claude 能夠通過動態發現和按需加載工具來處理數百或數千個工具。Claude 搜索您的工具目錄並僅加載它需要的工具，而不是將所有工具定義預先加載到上下文窗口中。

有兩種搜索變體可用：
- **正則表達式** (`tool_search_tool_regex_20251119`)：Claude 構造正則表達式模式來搜索工具名稱、描述和參數
- **BM25** (`tool_search_tool_bm25_20251119`)：Claude 使用自然語言查詢來搜索工具

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get the weather at a specific location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

此方法解決了兩個關鍵挑戰：
- **上下文效率**：通過不預先加載所有工具定義來節省 10-20K token
- **工具選擇準確性**：即使有 100+ 個可用工具，也能保持高準確性

<Note>在 Claude Opus 4.5 和 Claude Sonnet 4.5 中可用。需要[測試版標頭](/docs/zh-TW/api/beta-headers)：`advanced-tool-use-2025-11-20`</Note>

### 努力參數（測試版）

[努力參數](/docs/zh-TW/build-with-claude/effort)允許您控制 Claude 在響應時使用多少 token，在響應詳盡程度和 token 效率之間進行權衡：

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

努力參數影響響應中的所有 token，包括文本響應、工具調用和擴展思考。較低的努力級別會產生更簡潔的響應，最少的解釋，而較高的努力提供詳細的推理和全面的答案。

<Note>僅在 Claude Opus 4.5 中可用。需要[測試版標頭](/docs/zh-TW/api/beta-headers)：`effort-2025-11-24`</Note>

### 工具使用示例（測試版）

[工具使用示例](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples)允許您提供有效工具輸入的具體示例，以幫助 Claude 更有效地理解如何使用您的工具。這對於具有嵌套對象、可選參數或格式敏感輸入的複雜工具特別有用。

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {...},
        "input_examples": [
            {
                "location": "San Francisco, CA",
                "unit": "fahrenheit"
            },
            {
                "location": "Tokyo, Japan",
                "unit": "celsius"
            },
            {
                "location": "New York, NY"  # Demonstrates optional 'unit' parameter
            }
        ]
    }
]
```

示例包含在提示中，與您的工具架構一起，向 Claude 展示格式良好的工具調用的具體模式。每個示例必須根據工具的 `input_schema` 有效。

<Note>在 Claude Sonnet 4.5、Haiku 4.5、Opus 4.5、Opus 4.1 和 Opus 4 中可用。需要[測試版標頭](/docs/zh-TW/api/beta-headers)：`advanced-tool-use-2025-11-20`。</Note>

### 記憶工具（測試版）

新的[記憶工具](/docs/zh-TW/agents-and-tools/tool-use/memory-tool)使 Claude 能夠在上下文窗口外存儲和檢索信息：

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

這允許：
- 隨著時間推移構建知識庫
- 跨會話維護項目狀態
- 通過基於文件的存儲保留有效無限的上下文

<Note>在 Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1 和 Opus 4.5 中可用。需要[測試版標頭](/docs/zh-TW/api/beta-headers)：`context-management-2025-06-27`</Note>

### 上下文編輯

使用[上下文編輯](/docs/zh-TW/build-with-claude/context-editing)通過自動工具調用清除進行智能上下文管理：

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",  # or claude-haiku-4-5
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

此功能在接近 token 限制時自動移除較舊的工具調用和結果，幫助在長期運行的代理會話中管理上下文。

<Note>在 Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1 和 Opus 4.5 中可用。需要[測試版標頭](/docs/zh-TW/api/beta-headers)：`context-management-2025-06-27`</Note>

### 增強的停止原因

Claude 4.5 模型引入了新的 `model_context_window_exceeded` 停止原因，明確指示生成何時因達到上下文窗口限制而停止，而不是請求的 `max_tokens` 限制。這使在應用邏輯中更容易處理上下文窗口限制。

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

### 改進的工具參數處理

Claude 4.5 模型包含一個錯誤修復，可保留工具調用字符串參數中的有意格式。以前，字符串參數中的尾隨換行符有時會被錯誤地剝離。此修復確保需要精確格式的工具（如文本編輯器）接收完全按預期的參數。

<Note>
這是一個幕後改進，不需要 API 更改。但是，具有字符串參數的工具現在可能會接收以前被剝離的尾隨換行符的值。
</Note>

**示例：**

```json
// 之前：最後的換行符被意外剝離
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit"
  }
}

// 之後：尾隨換行符按預期保留
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit\n"
  }
}
```

### Token 計數優化

Claude 4.5 模型包含自動優化以改進模型性能。這些優化可能會向請求添加少量 token，但**您不會為這些系統添加的 token 計費**。

## Claude 4 中引入的功能

以下功能在 Claude 4 中引入，在所有 Claude 4 模型中可用，包括 Claude Sonnet 4.5 和 Claude Haiku 4.5。

### 新的拒絕停止原因

Claude 4 模型為模型因安全原因拒絕生成的內容引入了新的 `refusal` 停止原因：

```json
{
  "id": "msg_014XEDjypDjFzgKVWdFUXxZP",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5",
  "content": [{"type": "text", "text": "I would be happy to assist you. You can "}],
  "stop_reason": "refusal",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 564,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 22
  }
}
```

使用 Claude 4 模型時，您應該更新應用程序以[處理 `refusal` 停止原因](/docs/zh-TW/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)。

### 總結思考

啟用擴展思考後，Claude 4 模型的 Messages API 返回 Claude 完整思考過程的摘要。總結思考提供了擴展思考的全部智能優勢，同時防止了濫用。

雖然 API 在 Claude 3.7 和 4 模型中是一致的，但擴展思考的流式響應可能會以"分塊"傳遞模式返回，流式事件之間可能存在延遲。

<Note>
總結由與您在請求中指定的模型不同的模型處理。思考模型看不到總結的輸出。
</Note>

有關更多信息，請參閱[擴展思考文檔](/docs/zh-TW/build-with-claude/extended-thinking#summarized-thinking)。

### 交錯思考

Claude 4 模型支持將工具使用與擴展思考交錯，允許更自然的對話，其中工具使用和響應可以與常規消息混合。

<Note>
交錯思考處於測試版。要啟用交錯思考，請向 API 請求添加[測試版標頭](/docs/zh-TW/api/beta-headers) `interleaved-thinking-2025-05-14`。
</Note>

有關更多信息，請參閱[擴展思考文檔](/docs/zh-TW/build-with-claude/extended-thinking#interleaved-thinking)。

### 行為差異

Claude 4 模型具有可能影響您如何構造提示的顯著行為變化：

#### 通信風格變化

- **更簡潔和直接**：Claude 4 模型通信更高效，解釋不那麼冗長
- **更自然的語氣**：響應略微更具對話性，不那麼像機器
- **效率導向**：可能在完成操作後跳過詳細摘要以保持工作流動力（如果需要，您可以提示更多詳情）

#### 指令遵循

Claude 4 模型經過訓練以進行精確的指令遵循，需要更明確的方向：

- **明確關於操作**：如果您想讓 Claude 採取行動，請使用"進行這些更改"或"實現此功能"之類的直接語言，而不是"您能建議更改嗎"
- **清楚地陳述所需的行為**：Claude 將精確遵循指令，因此具體說明您想要的內容有助於取得更好的結果

有關使用這些模型的全面指導，請參閱 [Claude 4 提示工程最佳實踐](/docs/zh-TW/build-with-claude/prompt-engineering/claude-4-best-practices)。

### 更新的文本編輯器工具

文本編輯器工具已針對 Claude 4 模型進行了更新，進行了以下更改：

- **工具類型**：`text_editor_20250728`
- **工具名稱**：`str_replace_based_edit_tool`
- 不再支持 `undo_edit` 命令

<Note>
對於 Claude Sonnet 3.7，`str_replace_editor` 文本編輯器工具保持不變。
</Note>

如果您從 Claude Sonnet 3.7 遷移並使用文本編輯器工具：

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Claude 4 models
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

有關更多信息，請參閱[文本編輯器工具文檔](/docs/zh-TW/agents-and-tools/tool-use/text-editor-tool)。

### 更新的代碼執行工具

如果您使用代碼執行工具，請確保您使用最新版本 `code_execution_20250825`，它添加了 Bash 命令和文件操作功能。

舊版本 `code_execution_20250522`（僅 Python）仍然可用，但不建議用於新實現。

有關遷移說明，請參閱[代碼執行工具文檔](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version)。

## 定價和可用性

### 定價

Claude 4.5 模型保持競爭性定價：

| 模型 | 輸入 | 輸出 |
|-------|-------|--------|
| Claude Opus 4.5 | 每百萬 token 5 美元 | 每百萬 token 25 美元 |
| Claude Sonnet 4.5 | 每百萬 token 3 美元 | 每百萬 token 15 美元 |
| Claude Haiku 4.5 | 每百萬 token 1 美元 | 每百萬 token 5 美元 |

有關更多詳情，請參閱[定價文檔](/docs/zh-TW/about-claude/pricing)。

### 第三方平台定價

從 Claude 4.5 模型（Opus 4.5、Sonnet 4.5 和 Haiku 4.5）開始，AWS Bedrock 和 Google Vertex AI 提供兩種端點類型：

- **全球端點**：用於最大可用性的動態路由
- **區域端點**：通過特定地理區域保證數據路由，具有 **10% 定價溢價**

**此區域定價適用於所有 Claude 4.5 模型：Opus 4.5、Sonnet 4.5 和 Haiku 4.5。**

**Claude API (1P) 默認是全球性的，不受此更改影響。** Claude API 是全球唯一的（相當於其他提供商的全球端點提供和定價）。

有關實現詳情和遷移指導：
- [AWS Bedrock 全球與區域端點](/docs/zh-TW/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AI 全球與區域端點](/docs/zh-TW/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)

### 可用性

Claude 4.5 模型在以下平台上可用：

| 模型 | Claude API | Amazon Bedrock | Google Cloud Vertex AI |
|-------|-----------|----------------|------------------------|
| Claude Opus 4.5 | `claude-opus-4-5-20251101` | `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5@20251101` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | `anthropic.claude-haiku-4-5-20251001-v1:0` | `claude-haiku-4-5@20251001` |

也可通過 Claude.ai 和 Claude Code 平台獲得。

## 遷移指南

破壞性變化和遷移要求因您升級的模型而異。有關詳細的遷移說明，包括分步指南、破壞性變化和遷移檢查清單，請參閱[遷移到 Claude 4.5](/docs/zh-TW/about-claude/models/migrating-to-claude-4)。

遷移指南涵蓋以下場景：
- **Claude Sonnet 3.7 → Sonnet 4.5**：完整遷移路徑，包含破壞性變化
- **Claude Haiku 3.5 → Haiku 4.5**：完整遷移路徑，包含破壞性變化
- **Claude Sonnet 4 → Sonnet 4.5**：快速升級，最少更改
- **Claude Opus 4.1 → Sonnet 4.5**：無縫升級，無破壞性變化
- **Claude Opus 4.1 → Opus 4.5**：無縫升級，無破壞性變化
- **Claude Opus 4.5 → Sonnet 4.5**：無縫降級，無破壞性變化

## 後續步驟

<CardGroup cols={3}>
  <Card title="最佳實踐" icon="lightbulb" href="/docs/zh-TW/build-with-claude/prompt-engineering/claude-4-best-practices">
    學習 Claude 4.5 模型的提示工程技術
  </Card>
  <Card title="模型概述" icon="table" href="/docs/zh-TW/about-claude/models/overview">
    將 Claude 4.5 模型與其他 Claude 模型進行比較
  </Card>
  <Card title="遷移指南" icon="arrow-right-arrow-left" href="/docs/zh-TW/about-claude/models/migrating-to-claude-4">
    從之前的模型升級
  </Card>
</CardGroup>