# Agent Skills

Agent Skills 是模組化功能，可擴展 Claude 的功能。每個 Skill 封裝了指令、中繼資料和可選資源（指令碼、範本），Claude 在相關時會自動使用。

---

## 為什麼使用 Skills

Skills 是可重複使用的檔案系統資源，為 Claude 提供特定領域的專業知識：工作流程、背景資訊和最佳實踐，將通用代理轉變為專家。與提示不同（對話層級的一次性任務指令），Skills 按需載入，無需在多個對話中重複提供相同的指導。

**主要優勢**：
- **專門化 Claude**：為特定領域任務量身定制功能
- **減少重複**：建立一次，自動使用
- **組合功能**：結合 Skills 建立複雜工作流程

<Note>
如需深入瞭解 Agent Skills 的架構和實際應用，請閱讀我們的工程部落格：[使用 Agent Skills 為真實世界的代理做好準備](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)。
</Note>

## 使用 Skills

Anthropic 為常見文件任務（PowerPoint、Excel、Word、PDF）提供預先建立的 Agent Skills，您也可以建立自己的自訂 Skills。兩者的工作方式相同。Claude 在與您的請求相關時會自動使用它們。

**預先建立的 Agent Skills** 可供 claude.ai 上的所有使用者和透過 Claude API 使用。請參閱下方的[可用 Skills](#available-skills) 部分以取得完整清單。

**自訂 Skills** 讓您封裝特定領域的專業知識和組織知識。它們在 Claude 的所有產品中都可用：在 Claude Code 中建立它們、透過 API 上傳它們，或在 claude.ai 設定中新增它們。

<Note>
**開始使用**：
- 對於預先建立的 Agent Skills：請參閱[快速入門教學](/docs/zh-TW/agents-and-tools/agent-skills/quickstart)以開始在 API 中使用 PowerPoint、Excel、Word 和 PDF skills
- 對於自訂 Skills：請參閱 [Agent Skills Cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills) 以瞭解如何建立自己的 Skills
</Note>

## Skills 如何運作

Skills 利用 Claude 的 VM 環境提供超越提示單獨可能實現的功能。Claude 在虛擬機中運作，具有檔案系統存取權限，允許 Skills 作為包含指令、可執行程式碼和參考資料的目錄存在，組織方式類似於您為新團隊成員建立的入職指南。

這種基於檔案系統的架構支援**漸進式揭露**：Claude 根據需要分階段載入資訊，而不是預先消耗背景資訊。

### 三種 Skill 內容類型，三個載入級別

Skills 可以包含三種內容類型，每種在不同時間載入：

### 級別 1：中繼資料（始終載入）

**內容類型：指令**。Skill 的 YAML 前置資料提供發現資訊：

```yaml
---
name: pdf-processing
description: 從 PDF 檔案中提取文字和表格、填寫表單、合併文件。在處理 PDF 檔案或使用者提及 PDF、表單或文件提取時使用。
---
```

Claude 在啟動時載入此中繼資料，並將其包含在系統提示中。這種輕量級方法意味著您可以安裝許多 Skills 而不會產生背景資訊成本；Claude 只知道每個 Skill 的存在及其使用時機。

### 級別 2：指令（觸發時載入）

**內容類型：指令**。SKILL.md 的主體包含程序知識：工作流程、最佳實踐和指導：

````markdown
# PDF 處理

## 快速入門

使用 pdfplumber 從 PDF 中提取文字：

```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

如需進階表單填寫，請參閱 [FORMS.md](FORMS.md)。
````

當您請求與 Skill 描述相符的內容時，Claude 透過 bash 從檔案系統讀取 SKILL.md。只有到那時，此內容才會進入背景資訊視窗。

### 級別 3：資源和程式碼（根據需要載入）

**內容類型：指令、程式碼和資源**。Skills 可以捆綁其他資料：

```
pdf-skill/
├── SKILL.md (主要指令)
├── FORMS.md (表單填寫指南)
├── REFERENCE.md (詳細 API 參考)
└── scripts/
    └── fill_form.py (公用程式指令碼)
```

**指令**：包含專業指導和工作流程的其他 markdown 檔案（FORMS.md、REFERENCE.md）

**程式碼**：Claude 透過 bash 執行的可執行指令碼（fill_form.py、validate.py）；指令碼提供確定性操作，無需消耗背景資訊

**資源**：參考資料，如資料庫結構、API 文件、範本或範例

Claude 只在參考時存取這些檔案。檔案系統模型意味著每種內容類型都有不同的優勢：指令用於靈活指導，程式碼用於可靠性，資源用於事實查詢。

| 級別 | 何時載入 | 代幣成本 | 內容 |
|---|---|---|---|
| **級別 1：中繼資料** | 始終（在啟動時） | 每個 Skill 約 100 個代幣 | YAML 前置資料中的 `name` 和 `description` |
| **級別 2：指令** | 觸發 Skill 時 | 少於 5k 個代幣 | 包含指令和指導的 SKILL.md 主體 |
| **級別 3+：資源** | 根據需要 | 實際上無限制 | 透過 bash 執行的捆綁檔案，無需將內容載入背景資訊 |

漸進式揭露確保任何給定時間只有相關內容佔據背景資訊視窗。

### Skills 架構

Skills 在程式碼執行環境中執行，其中 Claude 具有檔案系統存取權限、bash 命令和程式碼執行功能。可以這樣想：Skills 作為虛擬機上的目錄存在，Claude 使用與您在電腦上導航檔案相同的 bash 命令與它們互動。

![Agent Skills 架構 - 顯示 Skills 如何與代理的配置和虛擬機整合](/docs/images/agent-skills-architecture.png)

**Claude 如何存取 Skill 內容**：

觸發 Skill 時，Claude 使用 bash 從檔案系統讀取 SKILL.md，將其指令帶入背景資訊視窗。如果這些指令參考其他檔案（如 FORMS.md 或資料庫結構），Claude 也會使用其他 bash 命令讀取這些檔案。當指令提及可執行指令碼時，Claude 透過 bash 執行它們，只接收輸出（指令碼程式碼本身永遠不會進入背景資訊）。

**此架構支援的功能**：

**按需檔案存取**：Claude 只讀取每個特定任務所需的檔案。Skill 可以包含數十個參考檔案，但如果您的任務只需要銷售結構，Claude 只載入該一個檔案。其餘檔案保留在檔案系統上，消耗零個代幣。

**高效的指令碼執行**：當 Claude 執行 `validate_form.py` 時，指令碼的程式碼永遠不會載入背景資訊視窗。只有指令碼的輸出（如「驗證通過」或特定錯誤訊息）消耗代幣。這使指令碼遠比讓 Claude 即時生成等效程式碼更高效。

**捆綁內容沒有實際限制**：因為檔案在存取前不消耗背景資訊，Skills 可以包含全面的 API 文件、大型資料集、廣泛的範例或任何您需要的參考資料。捆綁內容未使用時沒有背景資訊成本。

這種基於檔案系統的模型是漸進式揭露的運作方式。Claude 導航您的 Skill，就像您參考入職指南的特定部分一樣，存取每個任務所需的確切內容。

### 範例：載入 PDF 處理 Skill

以下是 Claude 如何載入和使用 PDF 處理 Skill 的方式：

1. **啟動**：系統提示包括：`PDF 處理 - 從 PDF 檔案中提取文字和表格、填寫表單、合併文件`
2. **使用者請求**：「從此 PDF 中提取文字並進行摘要」
3. **Claude 呼叫**：`bash: read pdf-skill/SKILL.md` → 指令載入背景資訊
4. **Claude 判斷**：不需要表單填寫，因此不讀取 FORMS.md
5. **Claude 執行**：使用 SKILL.md 中的指令完成任務

![Skills 載入背景資訊視窗 - 顯示 Skill 中繼資料和內容的漸進式載入](/docs/images/agent-skills-context-window.png)

圖表顯示：
1. 預設狀態，系統提示和 Skill 中繼資料預先載入
2. Claude 透過 bash 讀取 SKILL.md 觸發 Skill
3. Claude 根據需要選擇性地讀取其他捆綁檔案，如 FORMS.md
4. Claude 繼續執行任務

此動態載入確保只有相關 Skill 內容佔據背景資訊視窗。

## Skills 在何處運作

Skills 在 Claude 的代理產品中可用：

### Claude API

Claude API 支援預先建立的 Agent Skills 和自訂 Skills。兩者的工作方式相同：在 `container` 參數中指定相關的 `skill_id` 以及程式碼執行工具。

**先決條件**：透過 API 使用 Skills 需要三個測試版標頭：
- `code-execution-2025-08-25` - Skills 在程式碼執行容器中執行
- `skills-2025-10-02` - 啟用 Skills 功能
- `files-api-2025-04-14` - 上傳/下載檔案到/從容器所需

透過參考其 `skill_id`（例如 `pptx`、`xlsx`）使用預先建立的 Agent Skills，或透過 Skills API（`/v1/skills` 端點）建立並上傳您自己的。自訂 Skills 在整個組織中共享。

若要瞭解更多資訊，請參閱[在 Claude API 中使用 Skills](/docs/zh-TW/build-with-claude/skills-guide)。

### Claude Code

[Claude Code](https://code.claude.com/docs/overview) 僅支援自訂 Skills。

**自訂 Skills**：建立包含 SKILL.md 檔案的目錄形式的 Skills。Claude 自動發現並使用它們。

Claude Code 中的自訂 Skills 基於檔案系統，不需要 API 上傳。

若要瞭解更多資訊，請參閱[在 Claude Code 中使用 Skills](https://code.claude.com/docs/skills)。

### Claude Agent SDK

[Claude Agent SDK](/docs/zh-TW/agent-sdk/overview) 透過基於檔案系統的配置支援自訂 Skills。

**自訂 Skills**：在 `.claude/skills/` 中建立包含 SKILL.md 檔案的目錄形式的 Skills。透過在 `allowed_tools` 配置中包含 `"Skill"` 來啟用 Skills。

SDK 執行時，Skills 會自動發現。

若要瞭解更多資訊，請參閱 [SDK 中的 Agent Skills](/docs/zh-TW/agent-sdk/skills)。

### Claude.ai

[Claude.ai](https://claude.ai) 支援預先建立的 Agent Skills 和自訂 Skills。

**預先建立的 Agent Skills**：這些 Skills 在您建立文件時已在幕後運作。Claude 使用它們而無需任何設定。

**自訂 Skills**：透過設定 > 功能將您自己的 Skills 作為 zip 檔案上傳。在啟用程式碼執行的 Pro、Max、Team 和 Enterprise 方案上可用。自訂 Skills 對每個使用者是個人的；它們不在整個組織中共享，管理員無法集中管理。

若要瞭解更多關於在 Claude.ai 中使用 Skills 的資訊，請參閱 Claude 說明中心中的以下資源：
- [什麼是 Skills？](https://support.claude.com/en/articles/12512176-what-are-skills)
- [在 Claude 中使用 Skills](https://support.claude.com/en/articles/12512180-using-skills-in-claude)
- [如何建立自訂 Skills](https://support.claude.com/en/articles/12512198-creating-custom-skills)
- [使用 Skills 教導 Claude 您的工作方式](https://support.claude.com/en/articles/12580051-teach-claude-your-way-of-working-using-skills)

## Skill 結構

每個 Skill 都需要一個包含 YAML 前置資料的 `SKILL.md` 檔案：

```yaml
---
name: your-skill-name
description: 簡要描述此 Skill 的功能及其使用時機
---

# 您的 Skill 名稱

## 指令
[Claude 應遵循的清晰、逐步指導]

## 範例
[使用此 Skill 的具體範例]
```

**必需欄位**：`name` 和 `description`

**欄位要求**：

`name`：
- 最多 64 個字元
- 只能包含小寫字母、數字和連字號
- 不能包含 XML 標籤
- 不能包含保留字：「anthropic」、「claude」

`description`：
- 必須非空
- 最多 1024 個字元
- 不能包含 XML 標籤

`description` 應包括 Skill 的功能和 Claude 應何時使用它。如需完整的編寫指導，請參閱[最佳實踐指南](/docs/zh-TW/agents-and-tools/agent-skills/best-practices)。

## 安全考量

我們強烈建議僅使用來自受信任來源的 Skills：您自己建立的或從 Anthropic 獲得的。Skills 透過指令和程式碼為 Claude 提供新功能，雖然這使它們功能強大，但也意味著惡意 Skill 可以指導 Claude 以不符合 Skill 陳述目的的方式呼叫工具或執行程式碼。

<Warning>
如果您必須使用來自不受信任或未知來源的 Skill，請格外謹慎，並在使用前徹底審計。根據 Claude 執行 Skill 時的存取權限，惡意 Skills 可能導致資料外洩、未授權系統存取或其他安全風險。
</Warning>

**主要安全考量**：
- **徹底審計**：檢查 Skill 中捆綁的所有檔案：SKILL.md、指令碼、影像和其他資源。尋找異常模式，如意外的網路呼叫、檔案存取模式或與 Skill 陳述目的不符的操作
- **外部來源有風險**：從外部 URL 提取資料的 Skills 風險特別大，因為提取的內容可能包含惡意指令。即使是可信的 Skills，如果其外部依賴項隨時間變化，也可能被洩露
- **工具濫用**：惡意 Skills 可以以有害方式呼叫工具（檔案操作、bash 命令、程式碼執行）
- **資料洩露**：具有敏感資料存取權限的 Skills 可能被設計為將資訊洩露到外部系統
- **像安裝軟體一樣對待**：僅使用來自受信任來源的 Skills。在將 Skills 整合到具有敏感資料或關鍵操作存取權限的生產系統時要特別小心

## 可用 Skills

### 預先建立的 Agent Skills

以下預先建立的 Agent Skills 可立即使用：

- **PowerPoint (pptx)**：建立簡報、編輯投影片、分析簡報內容
- **Excel (xlsx)**：建立試算表、分析資料、使用圖表生成報告
- **Word (docx)**：建立文件、編輯內容、格式化文字
- **PDF (pdf)**：生成格式化的 PDF 文件和報告

這些 Skills 在 Claude API 和 claude.ai 上可用。請參閱[快速入門教學](/docs/zh-TW/agents-and-tools/agent-skills/quickstart)以開始在 API 中使用它們。

### 自訂 Skills 範例

如需自訂 Skills 的完整範例，請參閱 [Skills cookbook](https://github.com/anthropics/claude-cookbooks/tree/main/skills)。

## 限制和約束

瞭解這些限制有助於您有效規劃 Skills 部署。

### 跨平台可用性

**自訂 Skills 不會跨平台同步**。上傳到一個平台的 Skills 不會自動在其他平台上可用：

- 上傳到 Claude.ai 的 Skills 必須單獨上傳到 API
- 透過 API 上傳的 Skills 在 Claude.ai 上不可用
- Claude Code Skills 基於檔案系統，與 Claude.ai 和 API 分開

您需要為要使用 Skills 的每個平台分別管理和上傳 Skills。

### 共享範圍

Skills 根據使用位置具有不同的共享模型：
- **Claude.ai**：僅限個人使用者；每個團隊成員必須單獨上傳
- **Claude API**：工作區範圍；所有工作區成員可以存取上傳的 Skills
- **Claude Code**：個人（`~/.claude/skills/`）或基於專案（`.claude/skills/`）

Claude.ai 目前不支援集中式管理員管理或組織範圍內的自訂 Skills 分發。

### 執行時環境約束

Skills 在程式碼執行容器中執行，具有以下限制：

- **無網路存取**：Skills 無法進行外部 API 呼叫或存取網際網路
- **無執行時套件安裝**：只有預先安裝的套件可用。您無法在執行期間安裝新套件。
- **僅預先配置的依賴項**：檢查[程式碼執行工具文件](/docs/zh-TW/agents-and-tools/tool-use/code-execution-tool)以取得可用套件清單

規劃您的 Skills 在這些約束內運作。

## 後續步驟

<CardGroup cols={2}>
  <Card
    title="開始使用 Agent Skills"
    icon="graduation-cap"
    href="/docs/zh-TW/agents-and-tools/agent-skills/quickstart"
  >
    建立您的第一個 Skill
  </Card>
  <Card
    title="API 指南"
    icon="code"
    href="/docs/zh-TW/build-with-claude/skills-guide"
  >
    在 Claude API 中使用 Skills
  </Card>
  <Card
    title="在 Claude Code 中使用 Skills"
    icon="terminal"
    href="https://code.claude.com/docs/skills"
  >
    在 Claude Code 中建立和管理自訂 Skills
  </Card>
  <Card
    title="在 Agent SDK 中使用 Skills"
    icon="cube"
    href="/docs/zh-TW/agent-sdk/skills"
  >
    在 TypeScript 和 Python 中以程式設計方式使用 Skills
  </Card>
  <Card
    title="編寫最佳實踐"
    icon="lightbulb"
    href="/docs/zh-TW/agents-and-tools/agent-skills/best-practices"
  >
    編寫 Claude 可以有效使用的 Skills
  </Card>
</CardGroup>