# 使用量和成本 API

透過使用量和成本管理 API 以程式方式存取您組織的 API 使用量和成本資料。

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

使用量和成本管理 API 提供對您組織的歷史 API 使用量和成本資料的程式化和細粒度存取。此資料類似於 Claude 控制台的[使用量](/usage)和[成本](/cost)頁面中提供的資訊。

此 API 使您能夠更好地監控、分析和最佳化您的 Claude 實作：

* **準確的使用量追蹤：** 獲得精確的代幣計數和使用模式，而不是僅依賴回應代幣計數
* **成本對帳：** 將內部記錄與 Anthropic 帳單相符，供財務和會計團隊使用
* **產品效能和改進：** 監控產品效能，同時測量對系統的更改是否改進了它，或設定警報
* **[速率限制](/docs/zh-TW/api/rate-limits)和[優先級層級](/docs/zh-TW/api/service-tiers#get-started-with-priority-tier)最佳化：** 最佳化功能，例如[提示快取](/docs/zh-TW/build-with-claude/prompt-caching)或特定提示，以充分利用已分配的容量，或購買專用容量。
* **進階分析：** 執行比控制台中可用的更深入的資料分析

<Check>
  **需要管理 API 金鑰**
  
  此 API 是[管理 API](/docs/zh-TW/build-with-claude/administration-api)的一部分。這些端點需要管理 API 金鑰（以 `sk-ant-admin...` 開頭），與標準 API 金鑰不同。只有具有管理員角色的組織成員才能透過 [Claude 控制台](/settings/admin-keys)佈建管理 API 金鑰。
</Check>

## 合作夥伴解決方案

領先的可觀測性平台提供現成的整合，用於監控您的 Claude API 使用量和成本，無需編寫自訂程式碼。這些整合提供儀表板、警報和分析，幫助您有效管理 API 使用量。

<CardGroup cols={3}>
  <Card title="CloudZero" icon="chart" href="https://docs.cloudzero.com/docs/connections-anthropic">
    用於追蹤和預測成本的雲端智慧平台
  </Card>
  <Card title="Datadog" icon="chart" href="https://docs.datadoghq.com/integrations/anthropic/">
    具有自動追蹤和監控的 LLM 可觀測性
  </Card>
  <Card title="Grafana Cloud" icon="chart" href="https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-anthropic/">
    無代理整合，可輕鬆進行 LLM 可觀測性，具有開箱即用的儀表板和警報
  </Card>
  <Card title="Honeycomb" icon="polygon" href="https://docs.honeycomb.io/integrations/anthropic-usage-monitoring/">
    透過 OpenTelemetry 進行進階查詢和視覺化
  </Card>
  <Card title="Vantage" icon="chart" href="https://docs.vantage.sh/connecting_anthropic">
    用於 LLM 成本和使用量可觀測性的 FinOps 平台
  </Card>
</CardGroup>

## 快速開始

取得您組織過去 7 天的每日使用量：

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-08T00:00:00Z&\
ending_at=2025-01-15T00:00:00Z&\
bucket_width=1d" \
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

## 使用量 API

使用 `/v1/organizations/usage_report/messages` 端點追蹤整個組織的代幣消耗，並按模型、工作區和服務層級進行詳細分解。

### 關鍵概念

- **時間桶：** 在固定間隔（`1m`、`1h` 或 `1d`）中聚合使用量資料
- **代幣追蹤：** 測量未快取的輸入、快取的輸入、快取建立和輸出代幣
- **篩選和分組：** 按 API 金鑰、工作區、模型、服務層級或上下文視窗進行篩選，並按這些維度分組結果
- **伺服器工具使用量：** 追蹤伺服器端工具（如網路搜尋）的使用量

如需完整的參數詳細資訊和回應結構描述，請參閱[使用量 API 參考](/docs/zh-TW/api/admin-api/usage-cost/get-messages-usage-report)。

### 基本範例

#### 按模型的每日使用量

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
group_by[]=model&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### 具有篩選的每小時使用量

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-15T00:00:00Z&\
ending_at=2025-01-15T23:59:59Z&\
models[]=claude-sonnet-4-5-20250929&\
service_tiers[]=batch&\
context_window[]=0-200k&\
bucket_width=1h" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

#### 按 API 金鑰和工作區篩選使用量

```bash
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-08T00:00:00Z&\
api_key_ids[]=apikey_01Rj2N8SVvo6BePZj99NhmiT&\
api_key_ids[]=apikey_01ABC123DEF456GHI789JKL&\
workspace_ids[]=wrkspc_01JwQvzr7rXLA5AGx3HKfFUJ&\
workspace_ids[]=wrkspc_01XYZ789ABC123DEF456MNO&\
bucket_width=1d" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

<Tip>
若要擷取您組織的 API 金鑰 ID，請使用[列出 API 金鑰](/docs/zh-TW/api/admin-api/apikeys/list-api-keys)端點。

若要擷取您組織的工作區 ID，請使用[列出工作區](/docs/zh-TW/api/admin-api/workspaces/list-workspaces)端點，或在 Anthropic 控制台中找到您組織的工作區 ID。
</Tip>

### 時間粒度限制

| 粒度 | 預設限制 | 最大限制 | 使用案例 |
|-------------|---------------|---------------|----------|
| `1m` | 60 個桶 | 1440 個桶 | 即時監控 |
| `1h` | 24 個桶 | 168 個桶 | 每日模式 |
| `1d` | 7 個桶 | 31 個桶 | 每週/每月報告 |

## 成本 API

使用 `/v1/organizations/cost_report` 端點擷取以美元計的服務級別成本分解。

### 關鍵概念

- **貨幣：** 所有成本以美元計，報告為最低單位（美分）的十進位字串
- **成本類型：** 追蹤代幣使用量、網路搜尋和程式碼執行成本
- **分組：** 按工作區或描述分組成本，以進行詳細分解
- **時間桶：** 僅限每日粒度（`1d`）

如需完整的參數詳細資訊和回應結構描述，請參閱[成本 API 參考](/docs/zh-TW/api/admin-api/usage-cost/get-cost-report)。

<Warning>
  優先級層級成本使用不同的計費模型，不包含在成本端點中。改為透過使用量端點追蹤優先級層級使用量。
</Warning>

### 基本範例

```bash
curl "https://api.anthropic.com/v1/organizations/cost_report?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
group_by[]=workspace_id&\
group_by[]=description" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## 分頁

兩個端點都支援大型資料集的分頁：

1. 進行初始請求
2. 如果 `has_more` 是 `true`，請在下一個請求中使用 `next_page` 值
3. 繼續直到 `has_more` 是 `false`

```bash
# 第一個請求
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"

# 回應包括："has_more": true, "next_page": "page_xyz..."

# 具有分頁的下一個請求
curl "https://api.anthropic.com/v1/organizations/usage_report/messages?\
starting_at=2025-01-01T00:00:00Z&\
ending_at=2025-01-31T00:00:00Z&\
limit=7&\
page=page_xyz..." \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

## 常見使用案例

在 [anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) 中探索詳細的實作：

- **每日使用量報告：** 追蹤代幣消耗趨勢
- **成本歸屬：** 按工作區分配費用以進行退款
- **快取效率：** 測量和最佳化提示快取
- **預算監控：** 為支出閾值設定警報
- **CSV 匯出：** 為財務團隊產生報告

## 常見問題

### 資料有多新鮮？
使用量和成本資料通常在 API 請求完成後 5 分鐘內出現，儘管延遲有時可能更長。

### 建議的輪詢頻率是多少？
該 API 支援持續使用時每分鐘輪詢一次。對於短時間突發（例如下載分頁資料），更頻繁的輪詢是可以接受的。為需要頻繁更新的儀表板快取結果。

### 我如何追蹤程式碼執行使用量？
程式碼執行成本出現在成本端點中，在描述欄位中分組為 `Code Execution Usage`。程式碼執行不包含在使用量端點中。

### 我如何追蹤優先級層級使用量？
在使用量端點中按 `service_tier` 篩選或分組，並尋找 `priority` 值。優先級層級成本在成本端點中不可用。

### Workbench 使用量會發生什麼？
來自 Workbench 的 API 使用量不與 API 金鑰相關聯，因此即使按該維度分組，`api_key_id` 也將是 `null`。

### 預設工作區如何表示？
歸屬於預設工作區的使用量和成本的 `workspace_id` 值為 `null`。

### 我如何取得 Claude Code 的每個使用者成本分解？

使用 [Claude Code 分析 API](/docs/zh-TW/build-with-claude/claude-code-analytics-api)，它提供每個使用者的估計成本和生產力指標，而不受按許多 API 金鑰分解成本的效能限制。對於具有許多金鑰的一般 API 使用量，請使用[使用量 API](#usage-api) 來追蹤代幣消耗作為成本代理。

## 另請參閱
使用量和成本 API 可用於幫助您為使用者提供更好的體驗、幫助您管理成本並保護您的速率限制。深入了解其他一些功能：

- [管理 API 概述](/docs/zh-TW/build-with-claude/administration-api)
- [管理 API 參考](/docs/zh-TW/api/admin)
- [定價](/docs/zh-TW/about-claude/pricing)
- [提示快取](/docs/zh-TW/build-with-claude/prompt-caching) - 使用快取最佳化成本
- [批次處理](/docs/zh-TW/build-with-claude/batch-processing) - 批次請求享受 50% 折扣
- [速率限制](/docs/zh-TW/api/rate-limits) - 了解使用層級