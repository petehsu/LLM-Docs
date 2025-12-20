# 提高輸出一致性

學習如何使 Claude 的回應更加一致，包括指定輸出格式、預填充回應、使用範例和檢索等技術。

---

<Tip>
**為了保證 JSON 架構符合性**

如果您需要 Claude 始終輸出符合特定架構的有效 JSON，請使用 [Structured Outputs](/docs/zh-TW/build-with-claude/structured-outputs) 而不是下面的提示工程技術。Structured Outputs 提供保證的架構符合性，專門為此用例設計。

下面的技術對於一般輸出一致性或當您需要超越嚴格 JSON 架構的靈活性時很有用。
</Tip>

以下是如何使 Claude 的回應更加一致的方法：

## 指定所需的輸出格式
使用 JSON、XML 或自訂範本精確定義您所需的輸出格式，以便 Claude 理解您需要的每個輸出格式化元素。

<section title="範例：標準化客戶反饋">

    | 角色 | 內容 |
    | ---- | ------- |
    | 用戶 | 您是客戶洞察 AI。分析此反饋並以 JSON 格式輸出，包含以下鍵："sentiment"（正面/負面/中立）、"key_issues"（列表）和 "action_items"（包含 "team" 和 "task" 的字典列表）。<br/><br/>"我已經是忠實用戶 3 年了，但最近的 UI 更新是一場災難。現在尋找基本功能就像尋寶遊戲。而且，新的「高級」定價太離譜了。除非立即修復，否則我正在考慮轉換。" |
    | 助手 | \{<br/>  "sentiment": "negative",<br/>  "key_issues": [<br/>    "Poor UI/UX in recent update",<br/>    "Difficulty finding basic features",<br/>    "Perceived high pricing (new 'premium' tier)"<br/>  ],<br/>  "action_items": [<br/>    \{<br/>      "team": "Product",<br/>      "task": "Conduct usability testing and iterate on UI based on findings"<br/>    \},<br/>    \{<br/>      "team": "UX",<br/>      "task": "Create a feature discovery guide or onboarding flow"<br/>    \},<br/>    \{<br/>      "team": "Marketing",<br/>      "task": "Review pricing strategy and communicate value proposition"<br/>    \},<br/>    \{<br/>      "team": "Customer Success",<br/>      "task": "Reach out to user, offer concessions to prevent churn"<br/>    \}<br/>  ]<br/>\} |

</section>

## 預填充 Claude 的回應
使用您所需的格式預填充 `Assistant` 回合。此技巧繞過 Claude 的友善前言並強制執行您的結構。

<section title="範例：每日銷售報告">

    | 角色 | 內容 |
    | ---- | ------- |
    | 用戶 | 您是一個有洞察力的銷售智能 AI。生成今天的銷售報告。<br/><br/>按照以下方式構建報告：<br/><br/>\<report><br/>    \<summary><br/>        \<metric name="total_revenue">\$0.00\</metric><br/>        \<metric name="units_sold">0\</metric><br/>        \<metric name="avg_order_value">\$0.00\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>Product Name\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<units>0\</units><br/>        \</product><br/>        ...<br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>Region Name\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<growth>0.0%\</growth><br/>        \</region><br/>        ...<br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>Action item.\</item><br/>        ...<br/>    \</action_items><br/>\</report> |
    | 助手（預填充） | \<report><br/>    \<summary><br/>        \<metric name= |
    | 助手 | "total_revenue">\$842,567.00\</metric><br/>        \<metric name="units_sold">15,238\</metric><br/>        \<metric name="avg_order_value">\$55.29\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>AcmeGuard Pro\</name><br/>            \<revenue>\$325,890.00\</revenue><br/>            \<units>3,621\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeVault Enterprise\</name><br/>            \<revenue>\$254,400.00\</revenue><br/>            \<units>1,272\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeBoost XL\</name><br/>            \<revenue>\$147,690.00\</revenue><br/>            \<units>4,923\</units><br/>        \</product><br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>APAC\</name><br/>            \<revenue>\$258,960.00\</revenue><br/>            \<growth>12.8%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>EMEA\</name><br/>            \<revenue>\$325,478.00\</revenue><br/>            \<growth>3.2%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>Americas\</name><br/>            \<revenue>\$258,129.00\</revenue><br/>            \<growth>-2.1%\</growth><br/>        \</region><br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>Investigate Americas revenue drop; schedule regional sales team meeting.\</item><br/>        \<item>Accelerate CloudGuard Pro rollout in APAC to capitalize on growth.\</item><br/>        \<item>Review NetBoost XL pricing; high volume but lower revenue.\</item><br/>    \</action_items><br/>\</report> |

</section>

## 使用範例進行約束
提供您所需輸出的範例。這比抽象指令更好地訓練 Claude 的理解。

<section title="範例：生成一致的市場情報">

    | 角色 | 內容 |
    | ---- | ------- |
    | 用戶 | 作為市場情報 AI，您的任務是分析有關我們競爭對手的數據。以下是我們的競爭對手數據：<br/>\<data><br/>\{\{DATA}}<br/>\</data><br/><br/>按照以下範例格式輸出：<br/><br/>\<competitor><br/>  \<name>Rival Inc\</name><br/>  \<overview>50 字的摘要。\</overview><br/>  \<swot><br/>    \<strengths>- 項目符號\</strengths><br/>    \<weaknesses>- 項目符號\</weaknesses><br/>    \<opportunities>- 項目符號\</opportunities><br/>    \<threats>- 項目符號\</threats><br/>  \</swot><br/>  \<strategy>30 字的戰略回應。\</strategy><br/>\</competitor><br/><br/>現在，使用此格式分析 AcmeGiant 和 AcmeDataCo。 |
    | 助手 | \<competitor><br/>  \<name>AcmeGiant\</name><br/>  \<overview>全球科技領導者，擁有龐大的消費者和企業產品生態系統。以創新、強大品牌和通過集成硬件、軟件和服務的深度客戶鎖定而聞名。\</overview><br/>  \<swot><br/>    \<strengths><br/>      - 龐大的研發預算推動持續創新<br/>      - 忠實的客戶基礎和強大的品牌認知度<br/>      - 協同產品生態系統增加轉換成本<br/>    \</strengths><br/>    \<weaknesses><br/>      - 高價格可能會阻止對成本敏感的客戶<br/>      - 在解決企業特定定制需求方面反應緩慢<br/>      - 隱私問題和多個市場的監管審查<br/>    \</weaknesses><br/>    \<opportunities><br/>      - 對 AI 和 ML 功能的需求不斷增長<br/>      - 擴展到新興市場<br/>      - 通過收購填補產品或人才空缺<br/>    \</opportunities><br/>    \<threats><br/>      - 雲原生競爭對手的快速崛起<br/>      - 反壟斷訴訟和監管行動<br/>      - 初創公司和競爭對手的人才挖角<br/>    \</threats><br/>  \</swot><br/>  \<strategy>專注於我們的敏捷性和定制化。在我們的營銷中針對 TechGiant 的緩慢企業回應和隱私問題。\</strategy><br/>\</competitor><br/><br/>\<competitor><br/>  \<name>AcmeDataCo\</name><br/>  \<overview>數據分析和可視化領域的新興明星。提供直觀的自助式 BI 工具，採用免費增值模式，吸引初創公司和企業團隊。\</overview><br/>  \<swot><br/>    \<strengths><br/>      - 用戶友善的界面減少了對專業培訓的需求<br/>      - 免費增值模式降低進入門檻，推動病毒式增長<br/>      - 與數據驅動決策的興起相比，產品市場契合度強<br/>    \</strengths><br/>    \<weaknesses><br/>      - 與已建立的 BI 工具相比，高級分析功能有限<br/>      - 報告的大型數據集擴展問題<br/>      - 依賴第三方雲基礎設施 (AWS)<br/>    \</weaknesses><br/>    \<opportunities><br/>      - 擴展到預測分析和 AI 驅動的洞察<br/>      - 與互補技術供應商建立戰略聯盟<br/>      - 針對行業特定解決方案的可定制儀表板<br/>    \</opportunities><br/>    \<threats><br/>      - 市場飽和；自助式 BI 中有許多新進入者<br/>      - 企業 BI 巨頭開發更用戶友善的工具<br/>      - 數據隱私法規增加合規複雜性<br/>    \</threats><br/>  \</swot><br/>  \<strategy>突出我們強大的企業功能和數據治理。針對在 DataCo 的規模限制中苦苦掙扎的帳戶。\</strategy><br/>\</competitor> |

</section>

## 使用檢索實現上下文一致性
對於需要一致上下文的任務（例如聊天機器人、知識庫），使用檢索將 Claude 的回應基於固定信息集。

<section title="範例：增強 IT 支持一致性">

    | 角色 | 內容 |
    | ---- | ------- |
    | 用戶 | 您是我們的 IT 支持 AI，利用知識庫數據。以下是您的知識庫中的條目：<br/><br/>\<kb><br/>  \<entry><br/>    \<id>1\</id><br/>    \<title>重置 Active Directory 密碼\</title><br/>    \<content>1. 前往 password.ourcompany.com<br/>2. 輸入您的用戶名<br/>3. 點擊「忘記密碼」<br/>4. 按照電子郵件說明操作\</content><br/>  \</entry><br/>  \<entry><br/>    \<id>2\</id><br/>    \<title>連接到 VPN\</title><br/>    \<content>1. 從軟件中心安裝 GlobalProtect<br/>2. 打開 GlobalProtect，輸入「vpn.ourcompany.com」<br/>3. 使用 AD 憑據登錄\</content><br/>  \</entry><br/>\</kb><br/><br/>在幫助用戶時，始終先檢查知識庫。按照以下格式回應：<br/><br/>\<response><br/>  \<kb_entry>使用的知識庫條目\</kb_entry><br/>  \<answer>您的回應\</answer><br/>\</response> 為自己寫一些測試問題並使用知識庫回答它們，只是為了確保您理解如何正確使用知識庫。 |
    | 助手 | 已理解。我將使用知識庫進行一致的回應。讓我們用幾個場景進行測試。<br/><br/>用戶：嘿，我無法登錄我的電子郵件。我認為我忘記了密碼。<br/><br/>\<response><br/>  \<kb_entry>1：重置 Active Directory 密碼\</kb_entry><br/>  \<answer>我理解您因忘記密碼而無法登錄電子郵件。別擔心，這是一個常見問題。要重置用於電子郵件訪問的 Active Directory 密碼，請按照以下步驟操作：<br/><br/>1. 前往 password.ourcompany.com<br/>2. 輸入您的用戶名（與您的電子郵件地址相同）<br/>3. 點擊「忘記密碼」鏈接<br/>4. 您將收到一封包含說明的電子郵件。按照說明重置您的密碼。<br/><br/>重置後，您應該能夠登錄您的電子郵件。如果您需要進一步的幫助，請告訴我。\</answer><br/>\</response><br/><br/>用戶：我今天在家工作。我如何訪問內部資源？<br/><br/>\<response><br/>  \<kb_entry>2：連接到 VPN\</kb_entry><br/>  \<answer>很好的問題！要在家工作時訪問內部資源，您需要連接到我們公司的 VPN（虛擬專用網絡）。以下是設置方法：<br/><br/>1. 首先，安裝 GlobalProtect VPN 客戶端。您可以在我們的軟件中心找到它。<br/>2. 安裝後，打開 GlobalProtect 應用程序。<br/>3. 在服務器字段中，輸入「vpn.ourcompany.com」。<br/>4. 使用您的 Active Directory (AD) 憑據登錄 - 與您用於電子郵件的用戶名和密碼相同。<br/><br/>連接後，您將能夠安全地訪問所有內部資源，就像您在辦公室一樣。如果您在設置過程中遇到任何問題，請告訴我。\</answer><br/>\</response> |

</section>

## 為複雜任務鏈接提示
將複雜任務分解為較小的、一致的子任務。每個子任務都能獲得 Claude 的全部注意力，減少跨縮放工作流程中的不一致錯誤。