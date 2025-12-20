# 技能編寫最佳實踐

學習如何編寫有效的技能，使 Claude 能夠發現並成功使用。

---

優秀的技能簡潔、結構良好且經過真實使用測試。本指南提供實用的編寫決策，幫助您編寫 Claude 能夠發現並有效使用的技能。

有關技能如何運作的概念背景，請參閱[技能概述](/docs/zh-TW/agents-and-tools/agent-skills/overview)。

## 核心原則

### 簡潔是關鍵

[上下文窗口](/docs/zh-TW/build-with-claude/context-windows)是一項公共資源。您的技能與 Claude 需要了解的所有其他內容共享上下文窗口，包括：
- 系統提示
- 對話歷史
- 其他技能的元數據
- 您的實際請求

您的技能中並非每個令牌都有直接成本。在啟動時，只有所有技能的元數據（名稱和描述）被預加載。Claude 只在技能變得相關時才讀取 SKILL.md，並根據需要讀取其他文件。但是，在 SKILL.md 中保持簡潔仍然很重要：一旦 Claude 加載它，每個令牌都會與對話歷史和其他上下文競爭。

**默認假設**：Claude 已經非常聰明

只添加 Claude 還沒有的上下文。質疑每一條信息：
- "Claude 真的需要這個解釋嗎？"
- "我可以假設 Claude 知道這個嗎？"
- "這段落是否值得其令牌成本？"

**好例子：簡潔**（大約 50 個令牌）：
````markdown
## 提取 PDF 文本

使用 pdfplumber 進行文本提取：

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
````

**壞例子：過於冗長**（大約 150 個令牌）：
```markdown
## 提取 PDF 文本

PDF（便攜式文檔格式）文件是一種常見的文件格式，包含
文本、圖像和其他內容。要從 PDF 中提取文本，您需要
使用一個庫。有許多可用於 PDF 處理的庫，但我們
推薦 pdfplumber，因為它易於使用並能處理大多數情況。
首先，您需要使用 pip 安裝它。然後您可以使用下面的代碼...
```

簡潔版本假設 Claude 知道什麼是 PDF 以及庫如何工作。

### 設置適當的自由度

將特異性級別與任務的脆弱性和可變性相匹配。

**高自由度**（基於文本的說明）：

使用時機：
- 多種方法都有效
- 決策取決於上下文
- 啟發式方法指導方法

例子：
```markdown
## 代碼審查流程

1. 分析代碼結構和組織
2. 檢查潛在的錯誤或邊界情況
3. 建議改進可讀性和可維護性
4. 驗證是否遵守項目約定
```

**中等自由度**（偽代碼或帶參數的腳本）：

使用時機：
- 存在首選模式
- 某些變化是可接受的
- 配置影響行為

例子：
````markdown
## 生成報告

使用此模板並根據需要自定義：

```python
def generate_report(data, format="markdown", include_charts=True):
    # 處理數據
    # 以指定格式生成輸出
    # 可選地包括可視化
```
````

**低自由度**（特定腳本，很少或沒有參數）：

使用時機：
- 操作脆弱且容易出錯
- 一致性至關重要
- 必須遵循特定序列

例子：
````markdown
## 數據庫遷移

運行完全相同的腳本：

```bash
python scripts/migrate.py --verify --backup
```

不要修改命令或添加其他標誌。
````

**類比**：將 Claude 視為探索路徑的機器人：
- **兩側都有懸崖的狹窄橋樑**：只有一條安全的前進方式。提供具體的護欄和精確的說明（低自由度）。例子：必須按確切順序運行的數據庫遷移。
- **沒有危險的開闊地帶**：許多路徑都能成功。給出一般方向並相信 Claude 會找到最佳路線（高自由度）。例子：上下文決定最佳方法的代碼審查。

### 使用您計劃使用的所有模型進行測試

技能作為模型的附加功能，因此有效性取決於底層模型。使用您計劃使用的所有模型測試您的技能。

**按模型的測試考慮因素**：
- **Claude Haiku**（快速、經濟）：技能是否提供足夠的指導？
- **Claude Sonnet**（平衡）：技能是否清晰高效？
- **Claude Opus**（強大的推理）：技能是否避免過度解釋？

對 Opus 完美有效的內容可能需要為 Haiku 提供更多細節。如果您計劃在多個模型中使用您的技能，請目標設定適用於所有模型的說明。

## 技能結構

<Note>
**YAML 前置事項**：SKILL.md 前置事項需要兩個字段：

`name`：
- 最多 64 個字符
- 只能包含小寫字母、數字和連字符
- 不能包含 XML 標籤
- 不能包含保留字："anthropic"、"claude"

`description`：
- 必須非空
- 最多 1024 個字符
- 不能包含 XML 標籤
- 應描述技能的功能和使用時機

有關完整的技能結構詳情，請參閱[技能概述](/docs/zh-TW/agents-and-tools/agent-skills/overview#skill-structure)。
</Note>

### 命名約定

使用一致的命名模式使技能更容易參考和討論。我們建議對技能名稱使用**動名詞形式**（動詞 + -ing），因為這清楚地描述了技能提供的活動或能力。

請記住，`name` 字段只能使用小寫字母、數字和連字符。

**好的命名例子（動名詞形式）**：
- `processing-pdfs`
- `analyzing-spreadsheets`
- `managing-databases`
- `testing-code`
- `writing-documentation`

**可接受的替代方案**：
- 名詞短語：`pdf-processing`、`spreadsheet-analysis`
- 面向行動：`process-pdfs`、`analyze-spreadsheets`

**避免**：
- 模糊的名稱：`helper`、`utils`、`tools`
- 過於通用：`documents`、`data`、`files`
- 保留字：`anthropic-helper`、`claude-tools`
- 技能集合中的不一致模式

一致的命名使得以下操作更容易：
- 在文檔和對話中參考技能
- 一目了然地理解技能的功能
- 組織和搜索多個技能
- 維護專業、統一的技能庫

### 編寫有效的描述

`description` 字段啟用技能發現，應包括技能的功能和使用時機。

<Warning>
**始終以第三人稱編寫**。描述被注入到系統提示中，不一致的視角可能會導致發現問題。

- **好的**："處理 Excel 文件並生成報告"
- **避免**："我可以幫助您處理 Excel 文件"
- **避免**："您可以使用此功能處理 Excel 文件"
</Warning>

**具體並包括關鍵術語**。包括技能的功能和使用時機的具體觸發器/上下文。

每個技能恰好有一個描述字段。描述對於技能選擇至關重要：Claude 使用它從可能 100+ 個可用技能中選擇正確的技能。您的描述必須提供足夠的細節，以便 Claude 知道何時選擇此技能，而 SKILL.md 的其餘部分提供實現細節。

有效的例子：

**PDF 處理技能**：
```yaml
description: 從 PDF 文件中提取文本和表格、填充表單、合併文檔。在處理 PDF 文件或用戶提及 PDF、表單或文檔提取時使用。
```

**Excel 分析技能**：
```yaml
description: 分析 Excel 電子表格、創建數據透視表、生成圖表。在分析 Excel 文件、電子表格、表格數據或 .xlsx 文件時使用。
```

**Git 提交助手技能**：
```yaml
description: 通過分析 git diff 生成描述性提交消息。當用戶要求幫助編寫提交消息或審查暫存更改時使用。
```

避免模糊的描述，如：

```yaml
description: 幫助處理文檔
```
```yaml
description: 處理數據
```
```yaml
description: 對文件進行各種操作
```

### 漸進式披露模式

SKILL.md 作為概述，根據需要指向詳細材料，就像入職指南中的目錄一樣。有關漸進式披露如何工作的解釋，請參閱概述中的[技能如何工作](/docs/zh-TW/agents-and-tools/agent-skills/overview#how-skills-work)。

**實用指導**：
- 保持 SKILL.md 正文在 500 行以下以獲得最佳性能
- 接近此限制時將內容分成單獨的文件
- 使用下面的模式有效地組織說明、代碼和資源

#### 視覺概述：從簡單到複雜

基本技能只包含一個 SKILL.md 文件，其中包含元數據和說明：

![顯示 YAML 前置事項和 markdown 正文的簡單 SKILL.md 文件](/docs/images/agent-skills-simple-file.png)

隨著您的技能增長，您可以捆綁 Claude 根據需要加載的其他內容：

![捆綁其他參考文件，如 reference.md 和 forms.md。](/docs/images/agent-skills-bundling-content.png)

完整的技能目錄結構可能如下所示：

```
pdf/
├── SKILL.md              # 主要說明（觸發時加載）
├── FORMS.md              # 表單填充指南（根據需要加載）
├── reference.md          # API 參考（根據需要加載）
├── examples.md           # 使用示例（根據需要加載）
└── scripts/
    ├── analyze_form.py   # 實用腳本（執行，不加載）
    ├── fill_form.py      # 表單填充腳本
    └── validate.py       # 驗證腳本
```

#### 模式 1：高級指南與參考

````markdown
---
name: pdf-processing
description: 從 PDF 文件中提取文本和表格、填充表單、合併文檔。在處理 PDF 文件或用戶提及 PDF、表單或文檔提取時使用。
---

# PDF 處理

## 快速開始

使用 pdfplumber 提取文本：
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## 高級功能

**表單填充**：查看 [FORMS.md](FORMS.md) 了解完整指南
**API 參考**：查看 [REFERENCE.md](REFERENCE.md) 了解所有方法
**示例**：查看 [EXAMPLES.md](EXAMPLES.md) 了解常見模式
````

Claude 只在需要時加載 FORMS.md、REFERENCE.md 或 EXAMPLES.md。

#### 模式 2：特定領域組織

對於具有多個領域的技能，按領域組織內容以避免加載無關的上下文。當用戶詢問銷售指標時，Claude 只需要讀取銷售相關的架構，而不是財務或營銷數據。這保持令牌使用低且上下文集中。

```
bigquery-skill/
├── SKILL.md (概述和導航)
└── reference/
    ├── finance.md (收入、計費指標)
    ├── sales.md (機會、管道)
    ├── product.md (API 使用、功能)
    └── marketing.md (活動、歸因)
```

````markdown SKILL.md
# BigQuery 數據分析

## 可用數據集

**財務**：收入、ARR、計費 → 查看 [reference/finance.md](reference/finance.md)
**銷售**：機會、管道、帳戶 → 查看 [reference/sales.md](reference/sales.md)
**產品**：API 使用、功能、採用 → 查看 [reference/product.md](reference/product.md)
**營銷**：活動、歸因、電子郵件 → 查看 [reference/marketing.md](reference/marketing.md)

## 快速搜索

使用 grep 查找特定指標：

```bash
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md
```
````

#### 模式 3：條件詳情

顯示基本內容，鏈接到高級內容：

```markdown
# DOCX 處理

## 創建文檔

使用 docx-js 創建新文檔。查看 [DOCX-JS.md](DOCX-JS.md)。

## 編輯文檔

對於簡單編輯，直接修改 XML。

**對於跟蹤更改**：查看 [REDLINING.md](REDLINING.md)
**對於 OOXML 詳情**：查看 [OOXML.md](OOXML.md)
```

Claude 只在用戶需要這些功能時讀取 REDLINING.md 或 OOXML.md。

### 避免深層嵌套參考

當從其他參考文件引用文件時，Claude 可能會部分讀取文件。遇到嵌套參考時，Claude 可能會使用 `head -100` 等命令預覽內容，而不是讀取整個文件，導致信息不完整。

**保持參考距離 SKILL.md 一級**。所有參考文件應直接從 SKILL.md 鏈接，以確保 Claude 在需要時讀取完整文件。

**壞例子：太深**：
```markdown
# SKILL.md
查看 [advanced.md](advanced.md)...

# advanced.md
查看 [details.md](details.md)...

# details.md
這是實際信息...
```

**好例子：一級深**：
```markdown
# SKILL.md

**基本使用**：[SKILL.md 中的說明]
**高級功能**：查看 [advanced.md](advanced.md)
**API 參考**：查看 [reference.md](reference.md)
**示例**：查看 [examples.md](examples.md)
```

### 使用目錄結構化較長的參考文件

對於超過 100 行的參考文件，在頂部包含目錄。這確保 Claude 即使在部分讀取時也能看到可用信息的完整範圍。

**例子**：
```markdown
# API 參考

## 內容
- 身份驗證和設置
- 核心方法（創建、讀取、更新、刪除）
- 高級功能（批量操作、webhook）
- 錯誤處理模式
- 代碼示例

## 身份驗證和設置
...

## 核心方法
...
```

Claude 可以根據需要讀取完整文件或跳轉到特定部分。

有關此基於文件系統的架構如何啟用漸進式披露的詳情，請參閱下面高級部分中的[運行時環境](#runtime-environment)部分。

## 工作流和反饋循環

### 對複雜任務使用工作流

將複雜操作分解為清晰的順序步驟。對於特別複雜的工作流，提供一個清單，Claude 可以複製到其響應中並在進行時檢查。

**例子 1：研究綜合工作流**（對於沒有代碼的技能）：

````markdown
## 研究綜合工作流

複製此清單並跟蹤您的進度：

```
研究進度：
- [ ] 步驟 1：讀取所有源文檔
- [ ] 步驟 2：識別關鍵主題
- [ ] 步驟 3：交叉參考聲明
- [ ] 步驟 4：創建結構化摘要
- [ ] 步驟 5：驗證引用
```

**步驟 1：讀取所有源文檔**

查看 `sources/` 目錄中的每個文檔。記下主要論點和支持證據。

**步驟 2：識別關鍵主題**

尋找跨源的模式。什麼主題重複出現？源在哪裡達成一致或不同意？

**步驟 3：交叉參考聲明**

對於每個主要聲明，驗證它出現在源材料中。記下哪個源支持每個點。

**步驟 4：創建結構化摘要**

按主題組織發現。包括：
- 主要聲明
- 來自源的支持證據
- 衝突的觀點（如果有）

**步驟 5：驗證引用**

檢查每個聲明是否引用了正確的源文檔。如果引用不完整，返回步驟 3。
````

此例子展示了工作流如何應用於不需要代碼的分析任務。清單模式適用於任何複雜的多步驟流程。

**例子 2：PDF 表單填充工作流**（對於帶代碼的技能）：

````markdown
## PDF 表單填充工作流

複製此清單並在完成項目時檢查：

```
任務進度：
- [ ] 步驟 1：分析表單（運行 analyze_form.py）
- [ ] 步驟 2：創建字段映射（編輯 fields.json）
- [ ] 步驟 3：驗證映射（運行 validate_fields.py）
- [ ] 步驟 4：填充表單（運行 fill_form.py）
- [ ] 步驟 5：驗證輸出（運行 verify_output.py）
```

**步驟 1：分析表單**

運行：`python scripts/analyze_form.py input.pdf`

這提取表單字段及其位置，保存到 `fields.json`。

**步驟 2：創建字段映射**

編輯 `fields.json` 為每個字段添加值。

**步驟 3：驗證映射**

運行：`python scripts/validate_fields.py fields.json`

在繼續之前修復任何驗證錯誤。

**步驟 4：填充表單**

運行：`python scripts/fill_form.py input.pdf fields.json output.pdf`

**步驟 5：驗證輸出**

運行：`python scripts/verify_output.py output.pdf`

如果驗證失敗，返回步驟 2。
````

清晰的步驟防止 Claude 跳過關鍵驗證。清單幫助 Claude 和您跟蹤多步驟工作流的進度。

### 實現反饋循環

**常見模式**：運行驗證器 → 修復錯誤 → 重複

此模式大大改進輸出質量。

**例子 1：風格指南合規性**（對於沒有代碼的技能）：

```markdown
## 內容審查流程

1. 按照 STYLE_GUIDE.md 中的指南起草您的內容
2. 根據清單審查：
   - 檢查術語一致性
   - 驗證示例遵循標準格式
   - 確認所有必需部分都存在
3. 如果發現問題：
   - 記下每個問題及其具體部分參考
   - 修訂內容
   - 再次審查清單
4. 只有在滿足所有要求時才繼續
5. 最終確定並保存文檔
```

這展示了使用參考文檔而不是腳本的驗證循環模式。"驗證器"是 STYLE_GUIDE.md，Claude 通過讀取和比較來執行檢查。

**例子 2：文檔編輯流程**（對於帶代碼的技能）：

```markdown
## 文檔編輯流程

1. 對 `word/document.xml` 進行編輯
2. **立即驗證**：`python ooxml/scripts/validate.py unpacked_dir/`
3. 如果驗證失敗：
   - 仔細查看錯誤消息
   - 修復 XML 中的問題
   - 再次運行驗證
4. **只有在驗證通過時才繼續**
5. 重建：`python ooxml/scripts/pack.py unpacked_dir/ output.docx`
6. 測試輸出文檔
```

驗證循環及早捕獲錯誤。

## 內容指南

### 避免時間敏感信息

不要包含會過時的信息：

**壞例子：時間敏感**（會變成錯誤）：
```markdown
如果您在 2025 年 8 月之前執行此操作，請使用舊 API。
2025 年 8 月之後，使用新 API。
```

**好例子**（使用"舊模式"部分）：
```markdown
## 當前方法

使用 v2 API 端點：`api.example.com/v2/messages`

## 舊模式

<details>
<summary>舊版 v1 API（已於 2025-08 棄用）</summary>

v1 API 使用：`api.example.com/v1/messages`

此端點不再受支持。
</details>
```

舊模式部分提供歷史背景，而不會使主要內容混亂。

### 使用一致的術語

選擇一個術語並在整個技能中使用它：

**好的 - 一致**：
- 始終"API 端點"
- 始終"字段"
- 始終"提取"

**壞的 - 不一致**：
- 混合"API 端點"、"URL"、"API 路由"、"路徑"
- 混合"字段"、"框"、"元素"、"控件"
- 混合"提取"、"拉取"、"獲取"、"檢索"

一致性幫助 Claude 理解和遵循說明。

## 常見模式

### 模板模式

提供輸出格式的模板。將嚴格程度與您的需求相匹配。

**對於嚴格要求**（如 API 響應或數據格式）：

````markdown
## 報告結構

始終使用此確切的模板結構：

```markdown
# [分析標題]

## 執行摘要
[關鍵發現的一段概述]

## 關鍵發現
- 帶支持數據的發現 1
- 帶支持數據的發現 2
- 帶支持數據的發現 3

## 建議
1. 具體可行的建議
2. 具體可行的建議
```
````

**對於靈活指導**（當適應有用時）：

````markdown
## 報告結構

這是一個合理的默認格式，但根據分析使用您的最佳判斷：

```markdown
# [分析標題]

## 執行摘要
[概述]

## 關鍵發現
[根據您發現的內容調整部分]

## 建議
[根據具體上下文調整]
```

根據特定分析類型調整部分。
````

### 示例模式

對於輸出質量取決於查看示例的技能，提供輸入/輸出對，就像在常規提示中一樣：

````markdown
## 提交消息格式

按照這些示例生成提交消息：

**示例 1：**
輸入：使用 JWT 令牌添加用戶身份驗證
輸出：
```
feat(auth): 實現基於 JWT 的身份驗證

添加登錄端點和令牌驗證中間件
```

**示例 2：**
輸入：修復日期在報告中顯示不正確的錯誤
輸出：
```
fix(reports): 修正時區轉換中的日期格式

在報告生成中一致使用 UTC 時間戳
```

**示例 3：**
輸入：更新依賴項並重構錯誤處理
輸出：
```
chore: 更新依賴項並重構錯誤處理

- 將 lodash 升級到 4.17.21
- 標準化端點間的錯誤響應格式
```

遵循此風格：type(scope): 簡短描述，然後詳細說明。
````

示例幫助 Claude 比單獨的描述更清楚地理解所需的風格和細節級別。

### 條件工作流模式

通過決策點指導 Claude：

```markdown
## 文檔修改工作流

1. 確定修改類型：

   **創建新內容？** → 遵循下面的"創建工作流"
   **編輯現有內容？** → 遵循下面的"編輯工作流"

2. 創建工作流：
   - 使用 docx-js 庫
   - 從頭開始構建文檔
   - 導出為 .docx 格式

3. 編輯工作流：
   - 解包現有文檔
   - 直接修改 XML
   - 每次更改後驗證
   - 完成時重新打包
```

<Tip>
如果工作流變得很大或複雜，有許多步驟，考慮將其推送到單獨的文件中，並告訴 Claude 根據任務讀取適當的文件。
</Tip>

## 評估和迭代

### 首先構建評估

**在編寫大量文檔之前創建評估。** 這確保您的技能解決實際問題，而不是記錄想象的問題。

**評估驅動開發**：
1. **識別差距**：在沒有技能的情況下在代表性任務上運行 Claude。記錄具體的失敗或缺失的上下文
2. **創建評估**：構建三個測試這些差距的場景
3. **建立基線**：測量 Claude 在沒有技能的情況下的性能
4. **編寫最少說明**：創建足夠的內容來解決差距並通過評估
5. **迭代**：執行評估、與基線比較並改進

此方法確保您解決實際問題，而不是預期可能永遠不會出現的要求。

**評估結構**：
```json
{
  "skills": ["pdf-processing"],
  "query": "從此 PDF 文件中提取所有文本並將其保存到 output.txt",
  "files": ["test-files/document.pdf"],
  "expected_behavior": [
    "使用適當的 PDF 處理庫或命令行工具成功讀取 PDF 文件",
    "從文檔中的所有頁面提取文本內容，不遺漏任何頁面",
    "以清晰、可讀的格式將提取的文本保存到名為 output.txt 的文件"
  ]
}
```

<Note>
此示例演示了一個簡單測試標準的數據驅動評估。我們目前不提供運行這些評估的內置方式。用戶可以創建自己的評估系統。評估是衡量技能有效性的真實來源。
</Note>

### 與 Claude 一起迭代開發技能

最有效的技能開發流程涉及 Claude 本身。與一個 Claude 實例（"Claude A"）合作創建將由其他實例（"Claude B"）使用的技能。Claude A 幫助您設計和改進說明，而 Claude B 在實際任務中測試它們。這有效是因為 Claude 模型理解如何編寫有效的代理說明以及代理需要什麼信息。

**創建新技能**：

1. **不使用技能完成任務**：與 Claude A 一起使用常規提示完成問題。在您工作時，您自然會提供上下文、解釋偏好並分享程序知識。注意您重複提供的信息。

2. **識別可重用模式**：完成任務後，識別您提供的對類似未來任務有用的上下文。

   **例子**：如果您完成了 BigQuery 分析，您可能提供了表名、字段定義、過濾規則（如"始終排除測試帳戶"）和常見查詢模式。

3. **要求 Claude A 創建技能**："創建一個捕獲我們剛剛使用的 BigQuery 分析模式的技能。包括表架構、命名約定和關於過濾測試帳戶的規則。"

   <Tip>
   Claude 模型本身理解技能格式和結構。您不需要特殊的系統提示或"編寫技能"技能來讓 Claude 幫助創建技能。只需要求 Claude 創建技能，它就會生成具有適當前置事項和正文內容的正確結構化 SKILL.md。
   </Tip>

4. **審查簡潔性**：檢查 Claude A 是否添加了不必要的解釋。問："刪除關於勝率含義的解釋 - Claude 已經知道這個。"

5. **改進信息架構**：要求 Claude A 更有效地組織內容。例如："組織這個，使表架構在單獨的參考文件中。我們稍後可能會添加更多表。"

6. **在類似任務上測試**：使用加載了技能的 Claude B（新實例）在相關用例上使用技能。觀察 Claude B 是否找到正確的信息、正確應用規則並成功處理任務。

7. **根據觀察迭代**：如果 Claude B 遇到困難或遺漏了什麼，帶著具體信息返回 Claude A："當 Claude 使用此技能時，它忘記了按 Q4 日期過濾。我們應該添加關於日期過濾模式的部分嗎？"

**迭代現有技能**：

相同的分層模式在改進技能時繼續。您在以下之間交替：
- **與 Claude A 合作**（幫助改進技能的專家）
- **使用 Claude B 測試**（使用技能執行實際工作的代理）
- **觀察 Claude B 的行為**並將見解帶回 Claude A

1. **在實際工作流中使用技能**：給 Claude B（加載了技能）實際任務，而不是測試場景

2. **觀察 Claude B 的行為**：注意它在哪裡遇到困難、成功或做出意外選擇

   **示例觀察**："當我要求 Claude B 提供區域銷售報告時，它編寫了查詢但忘記了過濾測試帳戶，即使技能提到了此規則。"

3. **返回 Claude A 進行改進**：分享當前的 SKILL.md 並描述您觀察到的內容。問："我注意到 Claude B 在要求區域報告時忘記了過濾測試帳戶。技能提到了過濾，但也許還不夠突出？"

4. **審查 Claude A 的建議**：Claude A 可能建議重組以使規則更突出、使用更強的語言如"必須過濾"而不是"始終過濾"，或重構工作流部分。

5. **應用並測試更改**：使用 Claude A 的改進更新技能，然後在類似請求上再次使用 Claude B 測試

6. **根據使用情況重複**：隨著您遇到新場景，繼續此觀察-改進-測試循環。每次迭代根據實際代理行為而不是假設改進技能。

**收集團隊反饋**：

1. 與隊友分享技能並觀察他們的使用
2. 問：技能在預期時激活嗎？說明清楚嗎？缺少什麼？
3. 納入反饋以解決您自己使用模式中的盲點

**為什麼此方法有效**：Claude A 理解代理需求，您提供領域專業知識，Claude B 通過實際使用揭示差距，迭代改進根據觀察到的行為而不是假設改進技能。

### 觀察 Claude 如何導航技能

在迭代技能時，注意 Claude 實際上如何在實踐中使用它們。注意：

- **意外的探索路徑**：Claude 是否以您未預期的順序讀取文件？這可能表明您的結構不如您認為的那樣直觀
- **錯過的連接**：Claude 是否未能遵循重要文件的參考？您的鏈接可能需要更明確或突出
- **對某些部分的過度依賴**：如果 Claude 重複讀取同一文件，考慮該內容是否應該在主 SKILL.md 中
- **忽略的內容**：如果 Claude 從不訪問捆綁文件，它可能是不必要的或在主說明中信號不良

根據這些觀察而不是假設進行迭代。您技能元數據中的"name"和"description"特別關鍵。Claude 在決定是否響應當前任務觸發技能時使用這些。確保它們清楚地描述技能的功能和使用時機。

## 要避免的反模式

### 避免 Windows 風格的路徑

始終使用正斜杠在文件路徑中，即使在 Windows 上：

- ✓ **好的**：`scripts/helper.py`、`reference/guide.md`
- ✗ **避免**：`scripts\helper.py`、`reference\guide.md`

Unix 風格的路徑在所有平台上都有效，而 Windows 風格的路徑在 Unix 系統上會導致錯誤。

### 避免提供太多選項

除非必要，否則不要呈現多種方法：

````markdown
**壞例子：太多選擇**（令人困惑）：
"您可以使用 pypdf、或 pdfplumber、或 PyMuPDF、或 pdf2image、或..."

**好例子：提供默認值**（帶逃生艙口）：
"使用 pdfplumber 進行文本提取：
```python
import pdfplumber
```

對於需要 OCR 的掃描 PDF，改用 pdf2image 和 pytesseract。"
````

## 高級：帶可執行代碼的技能

下面的部分重點關注包含可執行腳本的技能。如果您的技能只使用 markdown 說明，請跳到[有效技能清單](#checklist-for-effective-skills)。

### 解決，不要推卸

編寫技能腳本時，處理錯誤條件而不是推卸給 Claude。

**好例子：明確處理錯誤**：
```python
def process_file(path):
    """處理文件，如果不存在則創建它。"""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        # 創建具有默認內容而不是失敗的文件
        print(f"文件 {path} 未找到，創建默認值")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        # 提供替代方案而不是失敗
        print(f"無法訪問 {path}，使用默認值")
        return ''
```

**壞例子：推卸給 Claude**：
```python
def process_file(path):
    # 只是失敗並讓 Claude 解決
    return open(path).read()
```

配置參數也應該被證明和記錄以避免"巫毒常數"（Ousterhout 定律）。如果您不知道正確的值，Claude 如何確定它？

**好例子：自文檔化**：
```python
# HTTP 請求通常在 30 秒內完成
# 更長的超時考慮慢速連接
REQUEST_TIMEOUT = 30

# 三次重試平衡可靠性和速度
# 大多數間歇性故障在第二次重試時解決
MAX_RETRIES = 3
```

**壞例子：魔法數字**：
```python
TIMEOUT = 47  # 為什麼是 47？
RETRIES = 5   # 為什麼是 5？
```

### 提供實用腳本

即使 Claude 可以編寫腳本，預製腳本也有優勢：

**實用腳本的優勢**：
- 比生成的代碼更可靠
- 節省令牌（無需在上下文中包含代碼）
- 節省時間（無需代碼生成）
- 確保跨使用的一致性

![將可執行腳本與指令文件捆綁在一起](/docs/images/agent-skills-executable-scripts.png)

上面的圖表展示了可執行腳本如何與指令文件一起工作。指令文件（forms.md）引用腳本，Claude 可以執行它而無需將其內容加載到上下文中。

**重要區別**：在您的說明中明確說明 Claude 應該：
- **執行腳本**（最常見）："運行 `analyze_form.py` 提取字段"
- **作為參考讀取**（對於複雜邏輯）："查看 `analyze_form.py` 了解字段提取算法"

對於大多數實用腳本，執行是首選，因為它更可靠和高效。有關腳本執行如何工作的詳情，請參閱下面的[運行時環境](#runtime-environment)部分。

**例子**：
````markdown
## 實用腳本

**analyze_form.py**：從 PDF 中提取所有表單字段

```bash
python scripts/analyze_form.py input.pdf > fields.json
```

輸出格式：
```json
{
  "field_name": {"type": "text", "x": 100, "y": 200},
  "signature": {"type": "sig", "x": 150, "y": 500}
}
```

**validate_boxes.py**：檢查重疊的邊界框

```bash
python scripts/validate_boxes.py fields.json
# 返回："OK"或列出衝突
```

**fill_form.py**：將字段值應用於 PDF

```bash
python scripts/fill_form.py input.pdf fields.json output.pdf
```
````

### 使用視覺分析

當輸入可以呈現為圖像時，讓 Claude 分析它們：

````markdown
## 表單佈局分析

1. 將 PDF 轉換為圖像：
   ```bash
   python scripts/pdf_to_images.py form.pdf
   ```

2. 分析每個頁面圖像以識別表單字段
3. Claude 可以在視覺上看到字段位置和類型
````

<Note>
在此示例中，您需要編寫 `pdf_to_images.py` 腳本。
</Note>

Claude 的視覺能力幫助理解佈局和結構。

### 創建可驗證的中間輸出

當 Claude 執行複雜的開放式任務時，它可能會犯錯誤。"計劃-驗證-執行"模式通過讓 Claude 首先以結構化格式創建計劃，然後在執行前使用腳本驗證該計劃來及早捕獲錯誤。

**例子**：想象要求 Claude 根據電子表格更新 PDF 中的 50 個表單字段。沒有驗證，Claude 可能會引用不存在的字段、創建衝突值、遺漏必需字段或不正確應用更新。

**解決方案**：使用上面顯示的工作流模式（PDF 表單填充），但添加一個中間 `changes.json` 文件，在應用更改前進行驗證。工作流變成：分析 → **創建計劃文件** → **驗證計劃** → 執行 → 驗證。

**為什麼此模式有效**：
- **及早捕獲錯誤**：驗證在更改應用前發現問題
- **機器可驗證**：腳本提供客觀驗證
- **可逆計劃**：Claude 可以迭代計劃而無需觸及原件
- **清晰調試**：錯誤消息指向特定問題

**何時使用**：批量操作、破壞性更改、複雜驗證規則、高風險操作。

**實現提示**：使用詳細的特定錯誤消息製作驗證腳本，如"字段'signature_date'未找到。可用字段：customer_name、order_total、signature_date_signed"以幫助 Claude 修復問題。

### 打包依賴項

技能在代碼執行環境中運行，具有特定於平台的限制：

- **claude.ai**：可以從 npm 和 PyPI 安裝包並從 GitHub 存儲庫拉取
- **Anthropic API**：沒有網絡訪問且沒有運行時包安裝

在您的 SKILL.md 中列出所需的包並驗證它們在[代碼執行工具文檔](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool)中可用。

### 運行時環境

技能在具有文件系統訪問、bash 命令和代碼執行能力的代碼執行環境中運行。有關此架構的概念解釋，請參閱概述中的[技能架構](/docs/zh-TW/agents-and-tools/agent-skills/overview#the-skills-architecture)。

**這如何影響您的編寫**：

**Claude 如何訪問技能**：

1. **元數據預加載**：在啟動時，所有技能 YAML 前置事項中的名稱和描述被加載到系統提示中
2. **按需讀取文件**：Claude 在需要時使用 bash 讀取工具從文件系統訪問 SKILL.md 和其他文件
3. **高效執行腳本**：實用腳本可以通過 bash 執行而無需將其完整內容加載到上下文中。只有腳本的輸出消耗令牌
4. **大文件無上下文懲罰**：參考文件、數據或文檔在實際讀取前不消耗上下文令牌

- **文件路徑很重要**：Claude 像文件系統一樣導航您的技能目錄。使用正斜杠（`reference/guide.md`），而不是反斜杠
- **描述性命名文件**：使用指示內容的名稱：`form_validation_rules.md`，而不是 `doc2.md`
- **按發現組織**：按領域或功能結構目錄
  - 好的：`reference/finance.md`、`reference/sales.md`
  - 壞的：`docs/file1.md`、`docs/file2.md`
- **捆綁全面資源**：包括完整的 API 文檔、廣泛的示例、大型數據集；在訪問前沒有上下文懲罰
- **對確定性操作優先使用腳本**：編寫 `validate_form.py` 而不是要求 Claude 生成驗證代碼
- **明確執行意圖**：
  - "運行 `analyze_form.py` 提取字段"（執行）
  - "查看 `analyze_form.py` 了解提取算法"（作為參考讀取）
- **測試文件訪問模式**：通過使用實際請求測試驗證 Claude 可以導航您的目錄結構

**例子**：

```
bigquery-skill/
├── SKILL.md (概述，指向參考文件)
└── reference/
    ├── finance.md (收入指標)
    ├── sales.md (管道數據)
    └── product.md (使用分析)
```

當用戶詢問收入時，Claude 讀取 SKILL.md，看到對 `reference/finance.md` 的參考，並調用 bash 只讀取該文件。sales.md 和 product.md 文件保留在文件系統上，在需要前消耗零上下文令牌。這個基於文件系統的模型是啟用漸進式披露的原因。Claude 可以導航並選擇性地加載每個任務所需的確切內容。

有關技術架構的完整詳情，請參閱技能概述中的[技能如何工作](/docs/zh-TW/agents-and-tools/agent-skills/overview#how-skills-work)。

### MCP 工具參考

如果您的技能使用 MCP（模型上下文協議）工具，始終使用完全限定的工具名稱以避免"找不到工具"錯誤。

**格式**：`ServerName:tool_name`

**例子**：
```markdown
使用 BigQuery:bigquery_schema 工具檢索表架構。
使用 GitHub:create_issue 工具創建問題。
```

其中：
- `BigQuery` 和 `GitHub` 是 MCP 服務器名稱
- `bigquery_schema` 和 `create_issue` 是這些服務器中的工具名稱

沒有服務器前綴，Claude 可能無法定位工具，特別是當多個 MCP 服務器可用時。

### 避免假設工具已安裝

不要假設包可用：

````markdown
**壞例子：假設安裝**：
"使用 pdf 庫處理文件。"

**好例子：明確關於依賴項**：
"安裝所需包：`pip install pypdf`

然後使用它：
```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```"
````

## 技術說明

### YAML 前置事項要求

SKILL.md 前置事項需要 `name` 和 `description` 字段，具有特定的驗證規則：
- `name`：最多 64 個字符，只能使用小寫字母/數字/連字符，無 XML 標籤，無保留字
- `description`：最多 1024 個字符，非空，無 XML 標籤

有關完整結構詳情，請參閱[技能概述](/docs/zh-TW/agents-and-tools/agent-skills/overview#skill-structure)。

### 令牌預算

保持 SKILL.md 正文在 500 行以下以獲得最佳性能。如果您的內容超過此限制，使用前面描述的漸進式披露模式將其分成單獨的文件。有關架構詳情，請參閱[技能概述](/docs/zh-TW/agents-and-tools/agent-skills/overview#how-skills-work)。

## 有效技能清單

在分享技能前，驗證：

### 核心質量
- [ ] 描述具體並包括關鍵術語
- [ ] 描述包括技能的功能和使用時機
- [ ] SKILL.md 正文在 500 行以下
- [ ] 其他詳情在單獨文件中（如果需要）
- [ ] 沒有時間敏感信息（或在"舊模式"部分）
- [ ] 整個技能中術語一致
- [ ] 示例具體，不抽象
- [ ] 文件參考一級深
- [ ] 適當使用漸進式披露
- [ ] 工作流有清晰的步驟

### 代碼和腳本
- [ ] 腳本解決問題而不是推卸給 Claude
- [ ] 錯誤處理明確且有幫助
- [ ] 沒有"巫毒常數"（所有值都有理由）
- [ ] 所需包在說明中列出並驗證為可用
- [ ] 腳本有清晰的文檔
- [ ] 沒有 Windows 風格的路徑（所有正斜杠）
- [ ] 關鍵操作的驗證/驗證步驟
- [ ] 包括質量關鍵任務的反饋循環

### 測試
- [ ] 至少創建三個評估
- [ ] 使用 Haiku、Sonnet 和 Opus 測試
- [ ] 使用真實使用場景測試
- [ ] 納入團隊反饋（如果適用）

## 後續步驟

<CardGroup cols={2}>
  <Card
    title="開始使用代理技能"
    icon="rocket"
    href="/docs/zh-TW/agents-and-tools/agent-skills/quickstart"
  >
    創建您的第一個技能
  </Card>
  <Card
    title="在 Claude Code 中使用技能"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    在 Claude Code 中創建和管理技能
  </Card>
  <Card
    title="在代理 SDK 中使用技能"
    icon="cube"
    href="/docs/zh-TW/agent-sdk/skills"
  >
    在 TypeScript 和 Python 中以編程方式使用技能
  </Card>
  <Card
    title="使用 API 使用技能"
    icon="code"
    href="/docs/zh-TW/build-with-claude/skills-guide"
  >
    以編程方式上傳和使用技能
  </Card>
</CardGroup>