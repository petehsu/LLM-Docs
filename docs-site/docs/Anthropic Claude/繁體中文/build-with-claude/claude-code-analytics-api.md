# Claude Code 分析 API

透過 Claude Code 分析管理員 API 以程式方式存取您的組織 Claude Code 使用分析和生產力指標。

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

Claude Code 分析管理員 API 提供對 Claude Code 使用者每日彙總使用指標的程式存取，使組織能夠分析開發人員生產力並建立自訂儀表板。此 API 彌補了我們基本 [分析儀表板](/claude-code) 和複雜 OpenTelemetry 整合之間的差距。

此 API 使您能夠更好地監控、分析和最佳化您的 Claude Code 採用：

* **開發人員生產力分析：** 追蹤使用 Claude Code 的工作階段、新增/移除的程式碼行數、提交和建立的拉取請求
* **工具使用指標：** 監控不同 Claude Code 工具（Edit、Write、NotebookEdit）的接受和拒絕率
* **成本分析：** 檢視按 Claude 模型細分的估計成本和代幣使用量
* **自訂報告：** 匯出資料以建立管理團隊的執行儀表板和報告
* **使用情況正當化：** 提供指標以在內部正當化和擴展 Claude Code 採用

<Check>
  **需要管理員 API 金鑰**
  
  此 API 是 [管理員 API](/docs/zh-TW/build-with-claude/administration-api) 的一部分。這些端點需要管理員 API 金鑰（以 `sk-ant-admin...` 開頭），與標準 API 金鑰不同。只有具有管理員角色的組織成員才能透過 [Claude 控制台](/settings/admin-keys) 佈建管理員 API 金鑰。
</Check>

## 快速開始

取得您組織在特定日期的 Claude Code 分析：

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
  **為整合設定 User-Agent 標頭**
  
  如果您正在建立整合，請設定 User-Agent 標頭以幫助我們了解使用模式：
  ```
  User-Agent: YourApp/1.0.0 (https://yourapp.com)
  ```
</Tip>

## Claude Code 分析 API

使用 `/v1/organizations/usage_report/claude_code` 端點追蹤整個組織的 Claude Code 使用、生產力指標和開發人員活動。

### 關鍵概念

- **每日彙總**：傳回由 `starting_at` 參數指定的單一日期的指標
- **使用者層級資料**：每筆記錄代表一個使用者在指定日期的活動
- **生產力指標**：追蹤工作階段、程式碼行數、提交、拉取請求和工具使用
- **代幣和成本資料**：監控按 Claude 模型細分的使用和估計成本
- **基於游標的分頁**：使用不透明游標透過穩定分頁處理大型資料集
- **資料新鮮度**：指標可在完成後最多 1 小時內取得，以確保一致性

如需完整的參數詳細資訊和回應架構，請參閱 [Claude Code 分析 API 參考](/docs/zh-TW/api/admin-api/claude-code/get-claude-code-usage-report)。

### 基本範例

#### 取得特定日期的分析

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### 取得具有分頁的分析

```bash
# 第一個請求
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
limit=20" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# 使用回應中的游標的後續請求
curl "https://api.anthropic.com/v1/organizations/usage_report/claude_code?\
starting_at=2025-09-08&\
page=page_MjAyNS0wNS0xNFQwMDowMDowMFo=" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

### 請求參數

| 參數 | 類型 | 必需 | 說明 |
|-----------|------|----------|-------------|
| `starting_at` | 字串 | 是 | YYYY-MM-DD 格式的 UTC 日期。僅傳回此單一日期的指標 |
| `limit` | 整數 | 否 | 每頁的記錄數（預設值：20，最大值：1000） |
| `page` | 字串 | 否 | 來自先前回應的 `next_page` 欄位的不透明游標代幣 |

### 可用指標

每個回應記錄包含單一使用者在單一日期的以下指標：

#### 維度
- **date**：RFC 3339 格式的日期（UTC 時間戳）
- **actor**：執行 Claude Code 動作的使用者或 API 金鑰（`user_actor` 搭配 `email_address` 或 `api_actor` 搭配 `api_key_name`）
- **organization_id**：組織 UUID
- **customer_type**：客戶帳戶類型（API 客戶為 `api`，Pro/Team 客戶為 `subscription`）
- **terminal_type**：使用 Claude Code 的終端機或環境類型（例如 `vscode`、`iTerm.app`、`tmux`）

#### 核心指標
- **num_sessions**：此參與者啟動的不同 Claude Code 工作階段數
- **lines_of_code.added**：Claude Code 在所有檔案中新增的程式碼行總數
- **lines_of_code.removed**：Claude Code 在所有檔案中移除的程式碼行總數
- **commits_by_claude_code**：透過 Claude Code 的提交功能建立的 git 提交數
- **pull_requests_by_claude_code**：透過 Claude Code 的 PR 功能建立的拉取請求數

#### 工具動作指標
按工具類型細分的工具動作接受和拒絕率：
- **edit_tool.accepted/rejected**：使用者接受/拒絕的 Edit 工具提案數
- **write_tool.accepted/rejected**：使用者接受/拒絕的 Write 工具提案數
- **notebook_edit_tool.accepted/rejected**：使用者接受/拒絕的 NotebookEdit 工具提案數

#### 模型細分
對於使用的每個 Claude 模型：
- **model**：Claude 模型識別碼（例如 `claude-sonnet-4-5-20250929`）
- **tokens.input/output**：此模型的輸入和輸出代幣計數
- **tokens.cache_read/cache_creation**：此模型的快取相關代幣使用
- **estimated_cost.amount**：此模型的估計成本（以美分 USD 計）
- **estimated_cost.currency**：成本金額的貨幣代碼（目前始終為 `USD`）

### 回應結構

API 以下列格式傳回資料：

```json
{
  "data": [
    {
      "date": "2025-09-01T00:00:00Z",
      "actor": {
        "type": "user_actor",
        "email_address": "developer@company.com"
      },
      "organization_id": "dc9f6c26-b22c-4831-8d01-0446bada88f1",
      "customer_type": "api",
      "terminal_type": "vscode",
      "core_metrics": {
        "num_sessions": 5,
        "lines_of_code": {
          "added": 1543,
          "removed": 892
        },
        "commits_by_claude_code": 12,
        "pull_requests_by_claude_code": 2
      },
      "tool_actions": {
        "edit_tool": {
          "accepted": 45,
          "rejected": 5
        },
        "multi_edit_tool": {
          "accepted": 12,
          "rejected": 2
        },
        "write_tool": {
          "accepted": 8,
          "rejected": 1
        },
        "notebook_edit_tool": {
          "accepted": 3,
          "rejected": 0
        }
      },
      "model_breakdown": [
        {
          "model": "claude-sonnet-4-5-20250929",
          "tokens": {
            "input": 100000,
            "output": 35000,
            "cache_read": 10000,
            "cache_creation": 5000
          },
          "estimated_cost": {
            "currency": "USD",
            "amount": 1025
          }
        }
      ]
    }
  ],
  "has_more": false,
  "next_page": null
}
```

## 分頁

API 支援基於游標的分頁，適用於擁有大量使用者的組織：

1. 使用可選的 `limit` 參數進行初始請求
2. 如果回應中的 `has_more` 為 `true`，請在下一個請求中使用 `next_page` 值
3. 繼續直到 `has_more` 為 `false`

游標編碼最後一筆記錄的位置，並確保穩定分頁，即使新資料到達也是如此。每個分頁工作階段都維護一致的資料邊界，以確保您不會遺漏或重複記錄。

## 常見使用案例

- **執行儀表板**：建立顯示 Claude Code 對開發速度影響的高階報告
- **AI 工具比較**：匯出指標以將 Claude Code 與 Copilot 和 Cursor 等其他 AI 編碼工具進行比較
- **開發人員生產力分析**：隨著時間推移追蹤個人和團隊生產力指標
- **成本追蹤和分配**：監控支出模式並按團隊或專案分配成本
- **採用監控**：識別哪些團隊和使用者從 Claude Code 獲得最大價值
- **ROI 正當化**：提供具體指標以正當化和擴展 Claude Code 採用

## 常見問題

### 分析資料有多新鮮？
Claude Code 分析資料通常在使用者活動完成後 1 小時內出現。為了確保一致的分頁結果，回應中僅包含超過 1 小時前的資料。

### 我可以取得即時指標嗎？
否，此 API 僅提供每日彙總指標。如需即時監控，請考慮使用 [OpenTelemetry 整合](https://code.claude.com/docs/en/monitoring-usage)。

### 資料中如何識別使用者？
使用者透過 `actor` 欄位以兩種方式識別：
- **`user_actor`**：包含透過 OAuth 驗證的使用者的 `email_address`（最常見）
- **`api_actor`**：包含透過 API 金鑰驗證的使用者的 `api_key_name`

`customer_type` 欄位指示使用情況是來自 `api` 客戶（API PAYG）還是 `subscription` 客戶（Pro/Team 計畫）。

### 資料保留期是多久？
歷史 Claude Code 分析資料會保留並可透過 API 存取。此資料沒有指定的刪除期限。

### 支援哪些 Claude Code 部署？
此 API 僅追蹤 Claude API（第一方）上的 Claude Code 使用。不包括 Amazon Bedrock、Google Vertex AI 或其他第三方平台上的使用。

### 使用此 API 需要多少成本？
Claude Code 分析 API 對所有有權存取管理員 API 的組織免費使用。

### 我如何計算工具接受率？
工具接受率 = `accepted / (accepted + rejected)`（針對每個工具類型）。例如，如果編輯工具顯示 45 個接受和 5 個拒絕，接受率為 90%。

### 日期參數使用什麼時區？
所有日期均為 UTC。`starting_at` 參數應為 YYYY-MM-DD 格式，代表該日期的 UTC 午夜。

## 另請參閱

Claude Code 分析 API 可幫助您了解和最佳化團隊的開發工作流程。深入了解相關功能：

- [管理員 API 概觀](/docs/zh-TW/build-with-claude/administration-api)
- [管理員 API 參考](/docs/zh-TW/api/admin)
- [Claude Code 分析儀表板](/claude-code)
- [使用和成本 API](/docs/zh-TW/build-with-claude/usage-cost-api) - 追蹤所有 Anthropic 服務的 API 使用
- [身份和存取管理](https://code.claude.com/docs/en/iam)
- [使用 OpenTelemetry 監控使用](https://code.claude.com/docs/en/monitoring-usage)以取得自訂指標和警報