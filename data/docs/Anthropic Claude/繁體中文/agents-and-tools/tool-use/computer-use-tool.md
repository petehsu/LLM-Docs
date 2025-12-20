# 電腦使用工具

Claude 可以通過電腦使用工具與電腦環境互動，該工具提供螢幕截圖功能和滑鼠/鍵盤控制，用於自主桌面互動。

---

Claude 可以通過電腦使用工具與電腦環境互動，該工具提供螢幕截圖功能和滑鼠/鍵盤控制，用於自主桌面互動。

<Note>
電腦使用目前處於測試版，需要 [測試版標頭](/docs/zh-TW/api/beta-headers)：
- Claude Opus 4.5 使用 `"computer-use-2025-11-24"`
- Claude Sonnet 4.5、Haiku 4.5、Opus 4.1、Sonnet 4、Opus 4 和 Sonnet 3.7 使用 `"computer-use-2025-01-24"` ([已棄用](/docs/zh-TW/about-claude/model-deprecations))
</Note>

## 概述

電腦使用是一項測試版功能，使 Claude 能夠與桌面環境互動。此工具提供：

- **螢幕截圖**：查看目前在螢幕上顯示的內容
- **滑鼠控制**：點擊、拖動和移動游標
- **鍵盤輸入**：輸入文字和使用鍵盤快捷鍵
- **桌面自動化**：與任何應用程式或介面互動

雖然電腦使用可以與其他工具（如 bash 和文字編輯器）結合，以實現更全面的自動化工作流程，但電腦使用特別指的是電腦使用工具查看和控制桌面環境的能力。

## 模型相容性

電腦使用適用於以下 Claude 模型：

| 模型 | 工具版本 | 測試版標誌 |
|-------|--------------|-----------|
| Claude Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| 所有其他支援的模型 | `computer_20250124` | `computer-use-2025-01-24` |

<Note>
Claude Opus 4.5 引入了 `computer_20251124` 工具版本，具有新功能，包括用於詳細螢幕區域檢查的縮放操作。所有其他模型（Sonnet 4.5、Haiku 4.5、Sonnet 4、Opus 4、Opus 4.1 和 Sonnet 3.7）使用 `computer_20250124` 工具版本。
</Note>

<Warning>
舊工具版本不保證與較新模型向後相容。始終使用與您的模型版本相對應的工具版本。
</Warning>

## 安全考慮

<Warning>
電腦使用是一項測試版功能，具有與標準 API 功能不同的獨特風險。與網際網路互動時，這些風險會增加。為了最小化風險，請考慮採取以下預防措施：

1. 使用具有最小權限的專用虛擬機器或容器，以防止直接系統攻擊或意外。
2. 避免讓模型存取敏感資料（如帳戶登入資訊），以防止資訊竊取。
3. 將網際網路存取限制在允許清單的網域，以減少暴露於惡意內容的風險。
4. 要求人類確認可能導致有意義的現實世界後果的決定，以及任何需要肯定同意的任務，例如接受 Cookie、執行金融交易或同意服務條款。

在某些情況下，Claude 會遵循內容中找到的命令，即使這與使用者的指示相衝突。例如，網頁或圖像中包含的 Claude 指示可能會覆蓋指示或導致 Claude 犯錯。我們建議採取預防措施，將 Claude 與敏感資料和操作隔離，以避免與提示注入相關的風險。

我們已訓練模型抵抗這些提示注入，並添加了額外的防禦層。如果您使用我們的電腦使用工具，我們將自動在您的提示上執行分類器，以標記潛在的提示注入實例。當這些分類器在螢幕截圖中識別出潛在的提示注入時，它們將自動引導模型在繼續下一個操作之前要求使用者確認。我們認識到這種額外的保護不適合每個使用案例（例如，沒有人類參與的使用案例），因此如果您想選擇退出並關閉它，請 [聯絡我們](https://support.claude.com/en/)。

我們仍然建議採取預防措施，將 Claude 與敏感資料和操作隔離，以避免與提示注入相關的風險。

最後，請在您自己的產品中啟用電腦使用之前，告知終端使用者相關風險並獲得他們的同意。

</Warning>

<Card
  title="電腦使用參考實現"
  icon="computer"
  href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
>

使用我們的電腦使用參考實現快速入門，其中包括網頁介面、Docker 容器、範例工具實現和代理迴圈。

**注意：** 該實現已更新，包括 Claude 4 模型和 Claude Sonnet 3.7 的新工具。請確保拉取最新版本的儲存庫以存取這些新功能。

</Card>

<Tip>
  請使用 [此表單](https://forms.gle/BT1hpBrqDPDUrCqo7) 提供有關模型回應品質、API 本身或文件品質的反饋 - 我們迫不及待地想聽到您的意見！
</Tip>

## 快速入門

以下是如何開始使用電腦使用的方法：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",  # 或其他相容模型
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        }
    ],
    messages=[{"role": "user", "content": "Save a picture of a cat to my desktop."}],
    betas=["computer-use-2025-01-24"]
)
print(response)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: computer-use-2025-01-24" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "computer_20250124",
        "name": "computer",
        "display_width_px": 1024,
        "display_height_px": 768,
        "display_number": 1
      },
      {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
      },
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Save a picture of a cat to my desktop."
      }
    ]
  }'
```
</CodeGroup>

<Note>
測試版標頭僅對電腦使用工具是必需的。

上面的範例顯示了所有三個工具一起使用，這需要測試版標頭，因為它包括電腦使用工具。
</Note>

---

## 電腦使用的工作原理

<Steps>
  <Step
    title="1. 為 Claude 提供電腦使用工具和使用者提示"
    icon="tool"
  >
    - 將電腦使用工具（以及可選的其他工具）新增到您的 API 請求中。
    - 包括需要桌面互動的使用者提示，例如「將貓的圖片儲存到我的桌面」。
  </Step>
  <Step title="2. Claude 決定使用電腦使用工具" icon="wrench">
    - Claude 評估電腦使用工具是否可以幫助使用者的查詢。
    - 如果是，Claude 會構造一個格式正確的工具使用請求。
    - API 回應的 `stop_reason` 為 `tool_use`，表示 Claude 的意圖。
  </Step>
  <Step
    title="3. 提取工具輸入、在電腦上評估工具並返回結果"
    icon="computer"
  >
    - 在您的端，從 Claude 的請求中提取工具名稱和輸入。
    - 在容器或虛擬機器上使用該工具。
    - 使用包含 `tool_result` 內容區塊的新 `user` 訊息繼續對話。
  </Step>
  <Step
    title="4. Claude 繼續呼叫電腦使用工具，直到完成任務"
    icon="arrows-clockwise"
  >
    - Claude 分析工具結果，以確定是否需要更多工具使用或任務已完成。
    - 如果 Claude 決定需要另一個工具，它會以另一個 `tool_use` `stop_reason` 回應，您應該返回步驟 3。
    - 否則，它會為使用者製作文字回應。
  </Step>
</Steps>

我們將步驟 3 和 4 在沒有使用者輸入的情況下重複稱為「代理迴圈」- 即 Claude 以工具使用請求回應，您的應用程式以評估該請求的結果回應 Claude。

### 運算環境

電腦使用需要一個沙箱運算環境，Claude 可以在其中安全地與應用程式和網頁互動。此環境包括：

1. **虛擬顯示**：虛擬 X11 顯示伺服器（使用 Xvfb），呈現 Claude 將通過螢幕截圖看到並通過滑鼠/鍵盤操作控制的桌面介面。

2. **桌面環境**：在 Linux 上執行的輕量級 UI，具有視窗管理器 (Mutter) 和面板 (Tint2)，為 Claude 提供一致的圖形介面以與之互動。

3. **應用程式**：預先安裝的 Linux 應用程式，如 Firefox、LibreOffice、文字編輯器和檔案管理器，Claude 可以使用它們來完成任務。

4. **工具實現**：整合程式碼，將 Claude 的抽象工具請求（如「移動滑鼠」或「截圖」）轉換為虛擬環境中的實際操作。

5. **代理迴圈**：處理 Claude 和環境之間通訊的程式，將 Claude 的操作發送到環境，並將結果（螢幕截圖、命令輸出）返回給 Claude。

當您使用電腦使用時，Claude 不會直接連接到此環境。相反，您的應用程式：

1. 接收 Claude 的工具使用請求
2. 將它們轉換為您的運算環境中的操作
3. 捕獲結果（螢幕截圖、命令輸出等）
4. 將這些結果返回給 Claude

為了安全和隔離，參考實現在 Docker 容器內執行所有這些操作，具有適當的連接埠對應，用於檢視和與環境互動。

---

## 如何實現電腦使用

### 從我們的參考實現開始

我們已建立了一個 [參考實現](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)，其中包含快速開始使用電腦使用所需的一切：

- 一個 [容器化環境](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile)，適合與 Claude 一起使用電腦使用
- [電腦使用工具](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools) 的實現
- 一個 [代理迴圈](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py)，與 Claude API 互動並執行電腦使用工具
- 一個網頁介面，用於與容器、代理迴圈和工具互動。

### 理解多代理迴圈

電腦使用的核心是「代理迴圈」- 一個循環，其中 Claude 請求工具操作，您的應用程式執行它們，並將結果返回給 Claude。以下是一個簡化的範例：

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # 新增迭代限制以防止無限迴圈
):
    """
    Claude 電腦使用互動的簡單代理迴圈。

    此函數處理以下之間的來回：
    1. 將使用者訊息發送給 Claude
    2. Claude 請求使用工具
    3. 您的應用程式執行這些工具
    4. 將工具結果發送回 Claude
    """
    # 設定工具和 API 參數
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # 配置工具 - 您應該已在其他地方初始化這些工具
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # 主代理迴圈（具有迭代限制以防止失控的 API 成本）
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # 設定可選的思考參數（適用於 Claude Sonnet 3.7）
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # 呼叫 Claude API
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # 將 Claude 的回應新增到對話歷史記錄
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # 檢查 Claude 是否使用了任何工具
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # 在實際應用程式中，您會在此執行工具
                # 例如：result = run_tool(block.name, block.input)
                result = {"result": "Tool executed successfully"}

                # 為 Claude 格式化結果
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # 如果未使用任何工具，Claude 已完成 - 返回最終訊息
        if not tool_results:
            return messages

        # 將工具結果新增到訊息中，以供下一次 Claude 迭代使用
        messages.append({"role": "user", "content": tool_results})
```

迴圈繼續，直到 Claude 回應時不請求任何工具（任務完成）或達到最大迭代限制。此保障措施可防止可能導致意外 API 成本的潛在無限迴圈。

我們建議在閱讀本文件的其餘部分之前嘗試參考實現。

### 使用提示優化模型效能

以下是一些有關如何獲得最佳品質輸出的提示：

1. 指定簡單、明確定義的任務，並為每個步驟提供明確的指示。
2. Claude 有時會假設其操作的結果，而不明確檢查它們。為了防止這種情況，您可以使用以下提示提示 Claude：`After each step, take a screenshot and carefully evaluate if you have achieved the right outcome. Explicitly show your thinking: "I have evaluated step X..." If not correct, try again. Only when you confirm a step was executed correctly should you move on to the next one.`
3. 某些 UI 元素（如下拉式清單和捲軸）可能對 Claude 使用滑鼠移動進行操作很困難。如果您遇到這種情況，請嘗試提示模型使用鍵盤快捷鍵。
4. 對於可重複的任務或 UI 互動，在您的提示中包括成功結果的範例螢幕截圖和工具呼叫。
5. 如果您需要模型登入，請在您的提示中使用 xml 標籤（如 `<robot_credentials>`）為其提供使用者名稱和密碼。在需要登入的應用程式中使用電腦使用會增加由於提示注入而導致不良結果的風險。在為模型提供登入認證之前，請查看我們的 [關於緩解提示注入的指南](/docs/zh-TW/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)。

<Tip>
  如果您反覆遇到一組明確的問題，或提前知道 Claude 需要完成的任務，請使用系統提示為 Claude 提供明確的提示或有關如何成功完成任務的指示。
</Tip>

### 系統提示

當通過 Claude API 請求 Anthropic 定義的工具之一時，會生成電腦使用特定的系統提示。它類似於 [工具使用系統提示](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt)，但開始於：

> You have access to a set of functions you can use to answer the user's question. This includes access to a sandboxed computing environment. You do NOT currently have the ability to inspect files or interact with external resources, except by invoking the below functions.

與常規工具使用一樣，使用者提供的 `system_prompt` 欄位仍然受到尊重，並用於構造組合系統提示。

### 可用操作

電腦使用工具支援這些操作：

**基本操作（所有版本）**
- **screenshot** - 捕獲目前顯示
- **left_click** - 在座標 `[x, y]` 處點擊
- **type** - 輸入文字字串
- **key** - 按下鍵或鍵組合（例如「ctrl+s」）
- **mouse_move** - 將游標移動到座標

**增強操作（`computer_20250124`）**
在 Claude 4 模型和 Claude Sonnet 3.7 中可用：
- **scroll** - 以任何方向捲動，具有數量控制
- **left_click_drag** - 在座標之間點擊並拖動
- **right_click**、**middle_click** - 其他滑鼠按鈕
- **double_click**、**triple_click** - 多次點擊
- **left_mouse_down**、**left_mouse_up** - 細粒度點擊控制
- **hold_key** - 在執行其他操作時按住鍵
- **wait** - 在操作之間暫停

**增強操作（`computer_20251124`）**
在 Claude Opus 4.5 中可用：
- `computer_20250124` 中的所有操作
- **zoom** - 以完整解析度檢視螢幕的特定區域。需要在工具定義中設定 `enable_zoom: true`。採用 `region` 參數，其座標為 `[x1, y1, x2, y2]`，定義要檢查的區域的左上角和右下角。

<section title="範例操作">

```json
// 截圖
{
  "action": "screenshot"
}

// 在位置點擊
{
  "action": "left_click",
  "coordinate": [500, 300]
}

// 輸入文字
{
  "action": "type",
  "text": "Hello, world!"
}

// 向下捲動 (Claude 4/3.7)
{
  "action": "scroll",
  "coordinate": [500, 400],
  "scroll_direction": "down",
  "scroll_amount": 3
}

// 縮放以詳細檢視區域 (Opus 4.5)
{
  "action": "zoom",
  "region": [100, 200, 400, 350]
}
```

</section>

### 工具參數

| 參數 | 必需 | 說明 |
|-----------|----------|-------------|
| `type` | 是 | 工具版本（`computer_20251124`、`computer_20250124` 或 `computer_20241022`） |
| `name` | 是 | 必須為「computer」 |
| `display_width_px` | 是 | 顯示寬度（以像素為單位） |
| `display_height_px` | 是 | 顯示高度（以像素為單位） |
| `display_number` | 否 | X11 環境的顯示編號 |
| `enable_zoom` | 否 | 啟用縮放操作（僅限 `computer_20251124`）。設定為 `true` 以允許 Claude 縮放到特定螢幕區域。預設值：`false` |

<Note>
**重要**：電腦使用工具必須由您的應用程式明確執行 - Claude 無法直接執行它。您負責根據 Claude 的請求實現螢幕截圖捕獲、滑鼠移動、鍵盤輸入和其他操作。
</Note>

### 在 Claude 4 模型和 Claude Sonnet 3.7 中啟用思考功能

Claude Sonnet 3.7 引入了新的「思考」功能，允許您在模型處理複雜任務時看到其推理過程。此功能可幫助您了解 Claude 如何處理問題，對於除錯或教育目的特別有價值。

要啟用思考，請將 `thinking` 參數新增到您的 API 請求中：

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

`budget_tokens` 參數指定 Claude 可以用於思考的令牌數。這從您的整體 `max_tokens` 預算中扣除。

啟用思考後，Claude 將返回其推理過程作為回應的一部分，這可以幫助您：

1. 了解模型的決策過程
2. 識別潛在問題或誤解
3. 從 Claude 的問題解決方法中學習
4. 獲得對複雜多步驟操作的更多可見性

以下是思考輸出可能看起來像的範例：

```
[Thinking]
I need to save a picture of a cat to the desktop. Let me break this down into steps:

1. First, I'll take a screenshot to see what's on the desktop
2. Then I'll look for a web browser to search for cat images
3. After finding a suitable image, I'll need to save it to the desktop

Let me start by taking a screenshot to see what's available...
```

### 使用其他工具增強電腦使用

電腦使用工具可以與其他工具結合，以建立更強大的自動化工作流程。當您需要以下情況時，這特別有用：
- 執行系統命令（[bash 工具](/docs/zh-TW/agents-and-tools/tool-use/bash-tool)）
- 編輯設定檔案或指令碼（[文字編輯器工具](/docs/zh-TW/agents-and-tools/tool-use/text-editor-tool)）
- 與自訂 API 或服務整合（自訂工具）

<CodeGroup>
  ```bash Shell
  curl https://api.anthropic.com/v1/messages \
    -H "content-type: application/json" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: computer-use-2025-01-24" \
    -d '{
      "model": "claude-sonnet-4-5",
      "max_tokens": 2000,
      "tools": [
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        }
      ],
      "messages": [
        {
          "role": "user",
          "content": "Find flights from San Francisco to a place with warmer weather."
        }
      ],
      "thinking": {
        "type": "enabled",
        "budget_tokens": 1024
      }
    }'
  ```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
          "type": "computer_20250124",
          "name": "computer",
          "display_width_px": 1024,
          "display_height_px": 768,
          "display_number": 1,
        },
        {
          "type": "text_editor_20250728",
          "name": "str_replace_based_edit_tool"
        },
        {
          "type": "bash_20250124",
          "name": "bash"
        },
        {
          "name": "get_weather",
          "description": "Get the current weather in a given location",
          "input_schema": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city and state, e.g. San Francisco, CA"
              },
              "unit": {
                "type": "string",
                "enum": ["celsius", "fahrenheit"],
                "description": "The unit of temperature, either 'celsius' or 'fahrenheit'"
              }
            },
            "required": ["location"]
          }
        },
    ],
    messages=[{"role": "user", "content": "Find flights from San Francisco to a place with warmer weather."}],
    betas=["computer-use-2025-01-24"],
    thinking={"type": "enabled", "budget_tokens": 1024},
)
print(response)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const message = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  tools: [
      {
        type: "computer_20250124",
        name: "computer",
        display_width_px: 1024,
        display_height_px: 768,
        display_number: 1,
      },
      {
        type: "text_editor_20250728",
        name: "str_replace_based_edit_tool"
      },
      {
        type: "bash_20250124",
        name: "bash"
      },
      {
        name: "get_weather",
        description: "Get the current weather in a given location",
        input_schema: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "The city and state, e.g. San Francisco, CA"
            },
            unit: {
              type: "string",
              enum: ["celsius", "fahrenheit"],
              description: "The unit of temperature, either 'celsius' or 'fahrenheit'"
            }
          },
          required: ["location"]
        }
      },
  ],
  messages: [{ role: "user", content: "Find flights from San Francisco to a place with warmer weather." }],
  betas: ["computer-use-2025-01-24"],
  thinking: { type: "enabled", budget_tokens: 1024 },
});
console.log(message);
```
```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.beta.messages.BetaMessage;
import com.anthropic.models.beta.messages.MessageCreateParams;
import com.anthropic.models.beta.messages.BetaToolBash20250124;
import com.anthropic.models.beta.messages.BetaToolComputerUse20250124;
import com.anthropic.models.beta.messages.BetaToolTextEditor20250124;
import com.anthropic.models.beta.messages.BetaThinkingConfigEnabled;
import com.anthropic.models.beta.messages.BetaThinkingConfigParam;
import com.anthropic.models.beta.messages.BetaTool;

public class MultipleToolsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model("claude-sonnet-4-5")
                .maxTokens(1024)
                .addTool(BetaToolComputerUse20250124.builder()
                        .displayWidthPx(1024)
                        .displayHeightPx(768)
                        .displayNumber(1)
                        .build())
                .addTool(BetaToolTextEditor20250124.builder()
                        .build())
                .addTool(BetaToolBash20250124.builder()
                        .build())
                .addTool(BetaTool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(BetaTool.InputSchema.builder()
                                .properties(
                                        JsonValue.from(
                                                Map.of(
                                                        "location", Map.of(
                                                                "type", "string",
                                                                "description", "The city and state, e.g. San Francisco, CA"
                                                        ),
                                                        "unit", Map.of(
                                                                "type", "string",
                                                                "enum", List.of("celsius", "fahrenheit"),
                                                                "description", "The unit of temperature, either 'celsius' or 'fahrenheit'"
                                                        )
                                                )
                                        ))
                                .build()
                        )
                        .build())
                .thinking(BetaThinkingConfigParam.ofEnabled(
                        BetaThinkingConfigEnabled.builder()
                                .budgetTokens(1024)
                                .build()
                ))
                .addUserMessage("Find flights from San Francisco to a place with warmer weather.")
                .addBeta("computer-use-2025-01-24")
                .build();

        BetaMessage message = client.beta().messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

### 建立自訂電腦使用環境

[參考實現](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)旨在幫助您開始使用電腦使用功能。它包含了讓 Claude 使用電腦所需的所有元件。不過，您可以建立自己的電腦使用環境來滿足您的需求。您需要：

- 適合與 Claude 進行電腦使用的虛擬化或容器化環境
- 至少實現一個 Anthropic 定義的電腦使用工具
- 與 Claude API 互動並使用您的工具實現執行 `tool_use` 結果的代理迴圈
- 允許使用者輸入以啟動代理迴圈的 API 或 UI

#### 實現電腦使用工具

電腦使用工具實現為無架構工具。使用此工具時，您不需要像其他工具那樣提供輸入架構；架構內建於 Claude 的模型中，無法修改。

<Steps>
  <Step title="設定您的運算環境">
    建立虛擬顯示器或連接到 Claude 將與之互動的現有顯示器。這通常涉及設定 Xvfb（X 虛擬幀緩衝區）或類似技術。
  </Step>
  <Step title="實現動作處理程式">
    建立函數以處理 Claude 可能要求的每種動作類型：
    ```python
    def handle_computer_action(action_type, params):
        if action_type == "screenshot":
            return capture_screenshot()
        elif action_type == "left_click":
            x, y = params["coordinate"]
            return click_at(x, y)
        elif action_type == "type":
            return type_text(params["text"])
        # ... handle other actions
    ```
  </Step>
  <Step title="處理 Claude 的工具呼叫">
    從 Claude 的回應中提取並執行工具呼叫：
    ```python
    for content in response.content:
        if content.type == "tool_use":
            action = content.input["action"]
            result = handle_computer_action(action, content.input)
            
            # Return result to Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="實現代理迴圈">
    建立一個持續迴圈，直到 Claude 完成任務：
    ```python
    while True:
        response = client.beta.messages.create(...)
        
        # Check if Claude used any tools
        tool_results = process_tool_calls(response)
        
        if not tool_results:
            # No more tool use, task complete
            break
            
        # Continue conversation with tool results
        messages.append({"role": "user", "content": tool_results})
    ```
  </Step>
</Steps>

#### 處理錯誤

實現電腦使用工具時，可能會發生各種錯誤。以下是如何處理它們：

<section title="螢幕擷取失敗">

如果螢幕擷取失敗，請返回適當的錯誤訊息：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to capture screenshot. Display may be locked or unavailable.",
      "is_error": true
    }
  ]
}
```

</section>

<section title="無效座標">

如果 Claude 提供的座標超出顯示邊界：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Coordinates (1200, 900) are outside display bounds (1024x768).",
      "is_error": true
    }
  ]
}
```

</section>

<section title="動作執行失敗">

如果動作執行失敗：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Failed to perform click action. The application may be unresponsive.",
      "is_error": true
    }
  ]
}
```

</section>

#### 處理更高解析度的座標縮放

API 將影像限制為最長邊最多 1568 像素，總計約 1.15 百萬像素（詳見[影像調整大小](/docs/zh-TW/build-with-claude/vision#evaluate-image-size)）。例如，1512x982 螢幕會縮小採樣至約 1330x864。Claude 分析這個較小的影像並在該空間中返回座標，但您的工具在原始螢幕空間中執行點擊。

除非您處理座標轉換，否則這可能會導致 Claude 的點擊座標未能擊中目標。

若要修正此問題，請自行調整螢幕擷取大小並將 Claude 的座標放大回去：

<CodeGroup>
```python Python
import math

def get_scale_factor(width, height):
    """Calculate scale factor to meet API constraints."""
    long_edge = max(width, height)
    total_pixels = width * height

    long_edge_scale = 1568 / long_edge
    total_pixels_scale = math.sqrt(1_150_000 / total_pixels)

    return min(1.0, long_edge_scale, total_pixels_scale)

# When capturing screenshot
scale = get_scale_factor(screen_width, screen_height)
scaled_width = int(screen_width * scale)
scaled_height = int(screen_height * scale)

# Resize image to scaled dimensions before sending to Claude
screenshot = capture_and_resize(scaled_width, scaled_height)

# When handling Claude's coordinates, scale them back up
def execute_click(x, y):
    screen_x = x / scale
    screen_y = y / scale
    perform_click(screen_x, screen_y)
```

```typescript TypeScript
const MAX_LONG_EDGE = 1568;
const MAX_PIXELS = 1_150_000;

function getScaleFactor(width: number, height: number): number {
  const longEdge = Math.max(width, height);
  const totalPixels = width * height;

  const longEdgeScale = MAX_LONG_EDGE / longEdge;
  const totalPixelsScale = Math.sqrt(MAX_PIXELS / totalPixels);

  return Math.min(1.0, longEdgeScale, totalPixelsScale);
}

// When capturing screenshot
const scale = getScaleFactor(screenWidth, screenHeight);
const scaledWidth = Math.floor(screenWidth * scale);
const scaledHeight = Math.floor(screenHeight * scale);

// Resize image to scaled dimensions before sending to Claude
const screenshot = captureAndResize(scaledWidth, scaledHeight);

// When handling Claude's coordinates, scale them back up
function executeClick(x: number, y: number): void {
  const screenX = x / scale;
  const screenY = y / scale;
  performClick(screenX, screenY);
}
```
</CodeGroup>

#### 遵循實現最佳實踐

<section title="使用適當的顯示解析度">

設定符合您的使用案例的顯示尺寸，同時保持在建議的限制內：
- 對於一般桌面任務：1024x768 或 1280x720
- 對於網路應用程式：1280x800 或 1366x768
- 避免超過 1920x1080 的解析度以防止效能問題

</section>

<section title="實現適當的螢幕擷取處理">

將螢幕擷取返回給 Claude 時：
- 將螢幕擷取編碼為 base64 PNG 或 JPEG
- 考慮壓縮大型螢幕擷取以改善效能
- 包含相關的中繼資料，如時間戳記或顯示狀態
- 如果使用更高的解析度，請確保座標準確縮放

</section>

<section title="新增動作延遲">

某些應用程式需要時間來回應動作：
```python
def click_and_wait(x, y, wait_time=0.5):
    click_at(x, y)
    time.sleep(wait_time)  # Allow UI to update
```

</section>

<section title="在執行前驗證動作">

檢查要求的動作是否安全且有效：
```python
def validate_action(action_type, params):
    if action_type == "left_click":
        x, y = params.get("coordinate", (0, 0))
        if not (0 <= x < display_width and 0 <= y < display_height):
            return False, "Coordinates out of bounds"
    return True, None
```

</section>

<section title="記錄動作以進行除錯">

保留所有動作的日誌以進行故障排除：
```python
import logging

def log_action(action_type, params, result):
    logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
```

</section>

---

## 了解電腦使用限制

電腦使用功能處於測試版。雖然 Claude 的功能是最先進的，但開發人員應該了解其限制：

1. **延遲**：目前人工智慧互動的電腦使用延遲可能相比於常規人工導向的電腦動作太慢。我們建議在受信任的環境中專注於速度不是關鍵的使用案例（例如背景資訊蒐集、自動化軟體測試）。
2. **電腦視覺準確性和可靠性**：Claude 在輸出特定座標同時生成動作時可能會犯錯或產生幻覺。Claude Sonnet 3.7 引入了思考功能，可以幫助您了解模型的推理並識別潛在問題。
3. **工具選擇準確性和可靠性**：Claude 在選擇工具同時生成動作時可能會犯錯或產生幻覺，或採取意外動作來解決問題。此外，與利基應用程式或多個應用程式同時互動時，可靠性可能較低。我們建議使用者在要求複雜任務時仔細提示模型。
4. **捲動可靠性**：Claude Sonnet 3.7 引入了具有方向控制的專用捲動動作，提高了可靠性。模型現在可以明確地按指定數量向任何方向（上/下/左/右）捲動。
5. **試算表互動**：Claude Sonnet 3.7 中的試算表互動已改進，增加了更精確的滑鼠控制動作，如 `left_mouse_down`、`left_mouse_up` 和新的修飾鍵支援。透過使用這些細粒度控制和將修飾鍵與點擊結合，儲存格選擇可以更可靠。
6. **社交和通訊平台上的帳戶建立和內容生成**：雖然 Claude 會造訪網站，但我們限制其在社交媒體網站和平台上建立帳戶或生成和分享內容或以其他方式進行人類模擬的能力。我們可能在未來更新此功能。
7. **漏洞**：越獄或提示注入等漏洞可能會在包括測試版電腦使用 API 在內的前沿 AI 系統中持續存在。在某些情況下，Claude 會遵循在內容中找到的命令，有時甚至與使用者的指示相衝突。例如，網頁上或影像中包含的 Claude 指示可能會覆蓋指示或導致 Claude 犯錯。我們建議：
   a. 將電腦使用限制在受信任的環境中，例如具有最小權限的虛擬機器或容器
   b. 避免在沒有嚴格監督的情況下向電腦使用存取敏感帳戶或資料
   c. 在您的應用程式中啟用或要求電腦使用功能所需的權限之前，通知終端使用者相關風險並獲得其同意
8. **不當或非法動作**：根據 Anthropic 的服務條款，您不得使用電腦使用來違反任何法律或我們的可接受使用政策。

始終仔細檢查並驗證 Claude 的電腦使用動作和日誌。不要在沒有人工監督的情況下將 Claude 用於需要完美精度或敏感使用者資訊的任務。

---

## 定價

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

## 後續步驟

<CardGroup cols={2}>
  <Card
    title="參考實現"
    icon="github-logo"
    href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
  >
    透過我們完整的 Docker 實現快速開始
  </Card>
  <Card
    title="工具文件"
    icon="tool"
    href="/docs/zh-TW/agents-and-tools/tool-use/overview"
  >
    深入了解工具使用和建立自訂工具
  </Card>
</CardGroup>