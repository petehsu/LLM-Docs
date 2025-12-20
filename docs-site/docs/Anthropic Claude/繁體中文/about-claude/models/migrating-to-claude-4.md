# 遷移至 Claude 4.5

了解如何從 Claude Sonnet 3.7 和 Claude Haiku 3.5 遷移至 Claude 4.5 模型的完整指南

---

本指南涵蓋兩個關鍵的遷移路徑至 Claude 4.5 模型：

- **Claude Sonnet 3.7 → Claude Sonnet 4.5**：我們最智能的模型，具有同類最佳的推理、編碼和長期運行代理功能
- **Claude Haiku 3.5 → Claude Haiku 4.5**：我們最快且最智能的 Haiku 模型，為實時應用和大量智能處理提供接近前沿的性能

兩個遷移都涉及需要更新實現的破壞性變更。本指南將逐步引導您完成每個遷移路徑，並清楚標記破壞性變更。

在開始遷移之前，我們建議查看 [Claude 4.5 的新功能](/docs/zh-TW/about-claude/models/whats-new-claude-4-5)，以了解這些模型中可用的新功能和能力，包括擴展思考、上下文感知和行為改進。

## 從 Claude Sonnet 3.7 遷移至 Claude Sonnet 4.5

Claude Sonnet 4.5 是我們最智能的模型，為推理、編碼和長期運行的自主代理提供同類最佳的性能。此遷移包括多個破壞性變更，需要更新您的實現。

### 遷移步驟

1. **更新您的模型名稱：**
   ```python
   # 之前 (Claude Sonnet 3.7)
   model="claude-3-7-sonnet-20250219"

   # 之後 (Claude Sonnet 4.5)
   model="claude-sonnet-4-5-20250929"
   ```

2. **更新採樣參數**

   <Warning>
   這是從 Claude Sonnet 3.7 的破壞性變更。
   </Warning>

   僅使用 `temperature` 或 `top_p`，不能同時使用：

   ```python
   # 之前 (Claude Sonnet 3.7) - 這將在 Sonnet 4.5 中出錯
   response = client.messages.create(
       model="claude-3-7-sonnet-20250219",
       temperature=0.7,
       top_p=0.9,  # 不能同時使用
       ...
   )

   # 之後 (Claude Sonnet 4.5)
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       temperature=0.7,  # 使用 temperature 或 top_p，不能同時使用
       ...
   )
   ```

3. **處理新的 `refusal` 停止原因**

   更新您的應用程式以 [處理 `refusal` 停止原因](/docs/zh-TW/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)：

   ```python
   response = client.messages.create(...)

   if response.stop_reason == "refusal":
       # 適當處理拒絕
       pass
   ```

4. **更新文字編輯器工具（如適用）**

   <Warning>
   這是從 Claude Sonnet 3.7 的破壞性變更。
   </Warning>

   更新至 `text_editor_20250728`（類型）和 `str_replace_based_edit_tool`（名稱）。移除任何使用 `undo_edit` 命令的程式碼。
   
   ```python
   # 之前 (Claude Sonnet 3.7)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # 之後 (Claude Sonnet 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   詳見 [文字編輯器工具文件](/docs/zh-TW/agents-and-tools/tool-use/text-editor-tool)。

5. **更新程式碼執行工具（如適用）**

   升級至 `code_execution_20250825`。舊版本 `code_execution_20250522` 仍然可用但不推薦。詳見 [程式碼執行工具文件](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version) 以了解遷移說明。

6. **移除令牌高效工具使用測試版標頭**

   令牌高效工具使用是僅適用於 Claude 3.7 Sonnet 的測試版功能。所有 Claude 4 模型都內置了令牌高效工具使用，因此您不應再包含測試版標頭。

   從您的請求中移除 `token-efficient-tools-2025-02-19` [測試版標頭](/docs/zh-TW/api/beta-headers)：

   ```python
   # 之前 (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["token-efficient-tools-2025-02-19"],  # 移除此項
       ...
   )

   # 之後 (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # 無令牌高效工具測試版標頭
       ...
   )
   ```

7. **移除擴展輸出測試版標頭**

   用於擴展輸出的 `output-128k-2025-02-19` [測試版標頭](/docs/zh-TW/api/beta-headers) 僅在 Claude Sonnet 3.7 中可用。

   從您的請求中移除此標頭：

   ```python
   # 之前 (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["output-128k-2025-02-19"],  # 移除此項
       ...
   )

   # 之後 (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # 無輸出 128k 測試版標頭
       ...
   )
   ```

8. **為行為變更更新您的提示**

   Claude Sonnet 4.5 具有更簡潔、直接的通訊風格，需要明確的指導。查看 [Claude 4 提示工程最佳實踐](/docs/zh-TW/build-with-claude/prompt-engineering/claude-4-best-practices) 以獲得優化指導。

9. **考慮為複雜任務啟用擴展思考**

   為編碼和推理任務啟用 [擴展思考](/docs/zh-TW/build-with-claude/extended-thinking) 以獲得顯著的性能改進（預設禁用）：

   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 10000},
       messages=[...]
   )
   ```

   <Note>
   擴展思考會影響 [提示快取](/docs/zh-TW/build-with-claude/prompt-caching#caching-with-thinking-blocks) 效率。
   </Note>

10. **測試您的實現**

   在部署到生產環境之前在開發環境中測試，以確保所有破壞性變更都得到適當處理。

### Sonnet 3.7 → 4.5 遷移檢查清單

- [ ] 將模型 ID 更新至 `claude-sonnet-4-5-20250929`
- [ ] **破壞性變更**：更新採樣參數以僅使用 `temperature` 或 `top_p`，不能同時使用
- [ ] 在您的應用程式中處理新的 `refusal` 停止原因
- [ ] **破壞性變更**：將文字編輯器工具更新至 `text_editor_20250728` 和 `str_replace_based_edit_tool`（如適用）
- [ ] **破壞性變更**：移除任何使用 `undo_edit` 命令的程式碼（如適用）
- [ ] 將程式碼執行工具更新至 `code_execution_20250825`（如適用）
- [ ] 移除 `token-efficient-tools-2025-02-19` 測試版標頭（如適用）
- [ ] 移除 `output-128k-2025-02-19` 測試版標頭（如適用）
- [ ] 按照 [Claude 4 最佳實踐](/docs/zh-TW/build-with-claude/prompt-engineering/claude-4-best-practices) 審查和更新提示
- [ ] 考慮為複雜推理任務啟用擴展思考
- [ ] 處理 `model_context_window_exceeded` 停止原因（Sonnet 4.5 特定）
- [ ] 考慮為長期運行的代理啟用記憶體工具（測試版）
- [ ] 考慮使用自動工具呼叫清除進行上下文編輯（測試版）
- [ ] 在生產部署前在開發環境中測試

### 從 Claude Sonnet 3.7 移除的功能

- **令牌高效工具使用**：`token-efficient-tools-2025-02-19` 測試版標頭僅適用於 Claude 3.7 Sonnet，Claude 4 模型不支援（見步驟 6）
- **擴展輸出**：`output-128k-2025-02-19` 測試版標頭不支援（見步驟 7）

兩個標頭都可以包含在 Claude 4 請求中，但不會產生任何效果。

## 從 Claude Haiku 3.5 遷移至 Claude Haiku 4.5

Claude Haiku 4.5 是我們最快且最智能的 Haiku 模型，具有接近前沿的性能，為互動應用和大量智能處理提供高級模型品質和實時性能。此遷移包括多個破壞性變更，需要更新您的實現。

有關新功能的完整概述，請參閱 [Claude 4.5 的新功能](/docs/zh-TW/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5)。

<Note>
Haiku 4.5 定價為每百萬輸入令牌 $1，每百萬輸出令牌 $5。詳見 [Claude 定價](/docs/zh-TW/about-claude/pricing)。
</Note>

### 遷移步驟

1. **更新您的模型名稱：**
   ```python
   # 之前 (Haiku 3.5)
   model="claude-3-5-haiku-20241022"

   # 之後 (Haiku 4.5)
   model="claude-haiku-4-5-20251001"
   ```

2. **更新工具版本（如適用）**

   <Warning>
   這是從 Claude Haiku 3.5 的破壞性變更。
   </Warning>

   Haiku 4.5 僅支援最新的工具版本：

   ```python
   # 之前 (Haiku 3.5)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # 之後 (Haiku 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   - **文字編輯器**：使用 `text_editor_20250728` 和 `str_replace_based_edit_tool`
   - **程式碼執行**：使用 `code_execution_20250825`
   - 移除任何使用 `undo_edit` 命令的程式碼

3. **更新採樣參數**

   <Warning>
   這是從 Claude Haiku 3.5 的破壞性變更。
   </Warning>

   僅使用 `temperature` 或 `top_p`，不能同時使用：

   ```python
   # 之前 (Haiku 3.5) - 這將在 Haiku 4.5 中出錯
   response = client.messages.create(
       model="claude-3-5-haiku-20241022",
       temperature=0.7,
       top_p=0.9,  # 不能同時使用
       ...
   )

   # 之後 (Haiku 4.5)
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       temperature=0.7,  # 使用 temperature 或 top_p，不能同時使用
       ...
   )
   ```

4. **審查新的速率限制**

   Haiku 4.5 與 Haiku 3.5 有不同的速率限制。詳見 [速率限制文件](/docs/zh-TW/api/rate-limits)。

5. **處理新的 `refusal` 停止原因**

   更新您的應用程式以 [處理拒絕停止原因](/docs/zh-TW/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)。

6. **考慮為複雜任務啟用擴展思考**

   為編碼和推理任務啟用 [擴展思考](/docs/zh-TW/build-with-claude/extended-thinking) 以獲得顯著的性能改進（預設禁用）：

   ```python
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 5000},
       messages=[...]
   )
   ```
   <Note>
   擴展思考會影響 [提示快取](/docs/zh-TW/build-with-claude/prompt-caching#caching-with-thinking-blocks) 效率。
   </Note>

7. **探索新功能**

   詳見 [Claude 4.5 的新功能](/docs/zh-TW/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5) 以了解上下文感知、增加的輸出容量（64K 令牌）、更高的智能和改進的速度。

8. **測試您的實現**

   在部署到生產環境之前在開發環境中測試，以確保所有破壞性變更都得到適當處理。

### Haiku 3.5 → 4.5 遷移檢查清單

- [ ] 將模型 ID 更新至 `claude-haiku-4-5-20251001`
- [ ] **破壞性變更**：將工具版本更新至最新版本（例如 `text_editor_20250728`、`code_execution_20250825`）- 不支援舊版本
- [ ] **破壞性變更**：移除任何使用 `undo_edit` 命令的程式碼（如適用）
- [ ] **破壞性變更**：更新採樣參數以僅使用 `temperature` 或 `top_p`，不能同時使用
- [ ] 審查並調整新的速率限制（與 Haiku 3.5 分開）
- [ ] 在您的應用程式中處理新的 `refusal` 停止原因
- [ ] 考慮為複雜推理任務啟用擴展思考（新功能）
- [ ] 利用上下文感知在長期會話中更好地管理令牌
- [ ] 為更大的回應做準備（最大輸出從 8K 增加至 64K 令牌）
- [ ] 按照 [Claude 4 最佳實踐](/docs/zh-TW/build-with-claude/prompt-engineering/claude-4-best-practices) 審查和更新提示
- [ ] 在生產部署前在開發環境中測試

## 在 Sonnet 4.5 和 Haiku 4.5 之間選擇

Claude Sonnet 4.5 和 Claude Haiku 4.5 都是強大的 Claude 4 模型，具有不同的優勢：

### 選擇 Claude Sonnet 4.5（最智能）用於：

- **複雜推理和分析**：用於複雜任務的同類最佳智能
- **長期運行的自主代理**：用於獨立工作長期的代理的卓越性能
- **高級編碼任務**：我們最強大的編碼模型，具有高級規劃和安全工程
- **大型上下文工作流**：使用記憶體工具和上下文編輯功能增強上下文管理
- **需要最大功能的任務**：當智能和準確性是首要優先事項時

### 選擇 Claude Haiku 4.5（最快且最智能的 Haiku）用於：

- **實時應用**：為互動使用者體驗提供快速回應時間，具有接近前沿的性能
- **大量智能處理**：以改進的速度進行成本有效的大規模智能
- **成本敏感的部署**：以較低價格點提供接近前沿的性能
- **子代理架構**：用於多代理系統的快速、智能代理
- **大規模電腦使用**：成本有效的自主桌面和瀏覽器自動化
- **需要速度的任務**：當低延遲至關重要同時保持接近前沿的智能時

### 擴展思考建議

Claude 4 模型，特別是 Sonnet 和 Haiku 4.5，在使用 [擴展思考](/docs/zh-TW/build-with-claude/extended-thinking) 進行編碼和複雜推理任務時顯示顯著的性能改進。擴展思考**預設禁用**，但我們建議為要求苛刻的工作啟用它。

**重要**：擴展思考會影響 [提示快取](/docs/zh-TW/build-with-claude/prompt-caching#caching-with-thinking-blocks) 效率。當非工具結果內容添加到對話時，思考塊會從快取中移除，這可能會增加多輪對話的成本。我們建議在性能優勢超過快取權衡時啟用思考。

## 其他遷移場景

上面涵蓋的主要遷移路徑（Sonnet 3.7 → 4.5 和 Haiku 3.5 → 4.5）代表最常見的升級。但是，您可能正在從其他 Claude 模型遷移至 Claude 4.5。本節涵蓋這些場景。

### 從 Claude Sonnet 4 → Sonnet 4.5 遷移

**破壞性變更**：不能在同一請求中同時指定 `temperature` 和 `top_p`。

所有其他 API 呼叫將無需修改即可工作。更新您的模型 ID 並根據需要調整採樣參數：

```python
# 之前 (Claude Sonnet 4)
model="claude-sonnet-4-20250514"

# 之後 (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

### 從 Claude Opus 4.1 → Sonnet 4.5 遷移

**無破壞性變更。** 所有 API 呼叫將無需修改即可工作。

只需更新您的模型 ID：

```python
# 之前 (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# 之後 (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

Claude Sonnet 4.5 是我們最智能的模型，具有同類最佳的推理、編碼和長期運行代理功能。對於大多數使用案例，它提供了比 Opus 4.1 更優越的性能。

### 從 Claude Opus 4.1 → Opus 4.5 遷移

**無破壞性變更。** 所有 API 呼叫將無需修改即可工作。

只需更新您的模型 ID：

```python
# 之前 (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# 之後 (Claude Opus 4.5)
model="claude-opus-4-5-20251101"
```

Claude Opus 4.5 是我們最智能的模型，結合了最大功能和實際性能。它在視覺、編碼和電腦使用方面具有階躍式改進，價格點比 Opus 4.1 更易於接受。適合複雜的專業任務和專業軟體工程。

<Note>
對於具有許多模型參考的程式碼庫，可以使用 [Claude Code 外掛程式](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration) 自動遷移至 Opus 4.5。
</Note>

### 在 Claude 4.5 模型之間遷移

**無破壞性變更。** 所有 API 呼叫將無需修改即可工作。

只需更新您的模型 ID。

## 需要幫助？

- 查看我們的 [API 文件](/docs/zh-TW/api/overview) 以了解詳細規格
- 查看 [模型功能](/docs/zh-TW/about-claude/models/overview) 以進行性能比較
- 查看 [API 發行說明](/docs/zh-TW/release-notes/api) 以了解 API 更新
- 如果在遷移期間遇到任何問題，請聯絡支援