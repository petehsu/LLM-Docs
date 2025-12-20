# 提示詞快取

提示詞快取是一項強大的功能，可透過允許從提示詞中的特定前綴繼續來最佳化您的 API 使用。這種方法可大幅減少重複任務或具有一致元素的提示詞的處理時間和成本。

---

提示詞快取是一項強大的功能，可透過允許從提示詞中的特定前綴繼續來最佳化您的 API 使用。這種方法可大幅減少重複任務或具有一致元素的提示詞的處理時間和成本。

以下是如何使用 `cache_control` 區塊透過 Messages API 實現提示詞快取的範例：

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n"
      },
      {
        "type": "text",
        "text": "<the entire contents of Pride and Prejudice>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "Analyze the major themes in Pride and Prejudice."
      }
    ]
  }'

# Call the model again with the same inputs up to the cache checkpoint
curl https://api.anthropic.com/v1/messages # rest of input
```

```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
      {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
      },
      {
        "type": "text",
        "text": "<the entire contents of 'Pride and Prejudice'>",
        "cache_control": {"type": "ephemeral"}
      }
    ],
    messages=[{"role": "user", "content": "Analyze the major themes in 'Pride and Prejudice'."}],
)
print(response.usage.model_dump_json())

# Call the model again with the same inputs up to the cache checkpoint
response = client.messages.create(.....)
print(response.usage.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n",
    },
    {
      type: "text",
      text: "<the entire contents of 'Pride and Prejudice'>",
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [
    {
      role: "user",
      content: "Analyze the major themes in 'Pride and Prejudice'."
    }
  ]
});
console.log(response.usage);

// Call the model again with the same inputs up to the cache checkpoint
const new_response = await client.messages.create(...)
console.log(new_response.usage);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class PromptCachingExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing literary works. Your goal is to provide insightful commentary on themes, characters, and writing style.\n")
                                .build(),
                        TextBlockParam.builder()
                                .text("<the entire contents of 'Pride and Prejudice'>")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("Analyze the major themes in 'Pride and Prejudice'.")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message.usage());
    }
}
```
</CodeGroup>

```json JSON
{"cache_creation_input_tokens":188086,"cache_read_input_tokens":0,"input_tokens":21,"output_tokens":393}
{"cache_creation_input_tokens":0,"cache_read_input_tokens":188086,"input_tokens":21,"output_tokens":393}
```

在此範例中，《傲慢與偏見》的整個文本使用 `cache_control` 參數進行快取。這使得可以在多個 API 呼叫中重複使用此大型文本，而無需每次都重新處理。只更改使用者訊息可讓您提出有關該書的各種問題，同時利用快取的內容，從而實現更快的回應和改進的效率。

---

## 提示詞快取的運作方式

當您發送啟用提示詞快取的請求時：

1. 系統檢查提示詞前綴（直到指定的快取中斷點）是否已從最近的查詢中快取。
2. 如果找到，它會使用快取版本，減少處理時間和成本。
3. 否則，它會處理完整提示詞，並在回應開始後快取前綴。

這對以下情況特別有用：
- 包含許多範例的提示詞
- 大量上下文或背景資訊
- 具有一致指令的重複任務
- 長多輪對話

預設情況下，快取的生命週期為 5 分鐘。每次使用快取的內容時，快取都會以無額外成本的方式刷新。

<Note>
如果您發現 5 分鐘太短，Anthropic 也提供 1 小時快取期限[需額外付費](#pricing)。

如需更多資訊，請參閱 [1 小時快取期限](#1-hour-cache-duration)。
</Note>

<Tip>
  **提示詞快取快取完整前綴**

提示詞快取參考整個提示詞 - `tools`、`system` 和 `messages`（按該順序）直到並包括使用 `cache_control` 指定的區塊。

</Tip>

---
## 定價

提示詞快取引入了新的定價結構。下表顯示了每個支援模型每百萬個 token 的價格：

| Model             | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens |
|-------------------|-------------------|-----------------|-----------------|----------------------|---------------|
| Claude Opus 4.5   | $5 / MTok         | $6.25 / MTok    | $10 / MTok      | $0.50 / MTok | $25 / MTok    |
| Claude Opus 4.1   | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Opus 4     | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Sonnet 4.5   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 4   | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Sonnet 3.7 ([deprecated](/docs/en/about-claude/model-deprecations)) | $3 / MTok         | $3.75 / MTok    | $6 / MTok       | $0.30 / MTok | $15 / MTok    |
| Claude Haiku 4.5  | $1 / MTok         | $1.25 / MTok    | $2 / MTok       | $0.10 / MTok | $5 / MTok     |
| Claude Haiku 3.5  | $0.80 / MTok      | $1 / MTok       | $1.6 / MTok     | $0.08 / MTok | $4 / MTok     |
| Claude Opus 3 ([deprecated](/docs/en/about-claude/model-deprecations))    | $15 / MTok        | $18.75 / MTok   | $30 / MTok      | $1.50 / MTok | $75 / MTok    |
| Claude Haiku 3    | $0.25 / MTok      | $0.30 / MTok    | $0.50 / MTok    | $0.03 / MTok | $1.25 / MTok  |

<Note>
上表反映了提示詞快取的以下定價倍數：
- 5 分鐘快取寫入 token 是基礎輸入 token 價格的 1.25 倍
- 1 小時快取寫入 token 是基礎輸入 token 價格的 2 倍
- 快取讀取 token 是基礎輸入 token 價格的 0.1 倍
</Note>

---
## 如何實現提示詞快取

### 支援的模型

提示詞快取目前支援：
- Claude Opus 4.5
- Claude Opus 4.1
- Claude Opus 4
- Claude Sonnet 4.5
- Claude Sonnet 4
- Claude Sonnet 3.7 ([已棄用](/docs/zh-TW/about-claude/model-deprecations))
- Claude Haiku 4.5
- Claude Haiku 3.5
- Claude Haiku 3
- Claude Opus 3 ([已棄用](/docs/zh-TW/about-claude/model-deprecations))

### 結構化您的提示詞

將靜態內容（工具定義、系統指令、上下文、範例）放在提示詞的開頭。使用 `cache_control` 參數標記可重複使用內容的結尾以進行快取。

快取前綴按以下順序建立：`tools`、`system`，然後 `messages`。此順序形成一個層級結構，其中每個級別都建立在前一個級別之上。

#### 自動前綴檢查的運作方式

您可以在靜態內容的末尾使用單一快取中斷點，系統將自動找到最長的匹配快取區塊序列。了解這如何運作有助於您最佳化快取策略。

**三個核心原則：**

1. **快取金鑰是累積的**：當您使用 `cache_control` 明確快取一個區塊時，快取雜湊金鑰是透過按順序雜湊對話中所有先前的區塊來生成的。這意味著每個區塊的快取取決於其之前的所有內容。

2. **向後順序檢查**：系統透過從您的明確中斷點向後工作，按相反順序檢查每個先前的區塊來檢查快取命中。這確保您獲得最長的可能快取命中。

3. **20 區塊回溯視窗**：系統只檢查每個明確 `cache_control` 中斷點之前最多 20 個區塊。檢查 20 個區塊後仍未找到匹配項，它會停止檢查並移至下一個明確中斷點（如果有）。

**範例：了解回溯視窗**

考慮一個有 30 個內容區塊的對話，其中您只在區塊 30 上設定 `cache_control`：

- **如果您發送區塊 31 且未更改先前的區塊**：系統檢查區塊 30（匹配！）。您在區塊 30 獲得快取命中，只需要處理區塊 31。

- **如果您修改區塊 25 並發送區塊 31**：系統從區塊 30 向後檢查 → 29 → 28... → 25（無匹配）→ 24（匹配！）。由於區塊 24 未更改，您在區塊 24 獲得快取命中，只需要重新處理區塊 25-30。

- **如果您修改區塊 5 並發送區塊 31**：系統從區塊 30 向後檢查 → 29 → 28... → 11（檢查 #20）。檢查 20 次後仍未找到匹配項，它會停止查看。由於區塊 5 超出 20 區塊視窗，不會發生快取命中，所有區塊都需要重新處理。但是，如果您在區塊 5 上設定了明確的 `cache_control` 中斷點，系統會繼續從該中斷點檢查：區塊 5（無匹配）→ 區塊 4（匹配！）。這允許在區塊 4 獲得快取命中，說明為什麼您應該在可編輯內容之前放置中斷點。

**關鍵要點**：始終在對話末尾設定明確的快取中斷點以最大化快取命中的機會。此外，在可能可編輯的內容區塊之前設定中斷點，以確保這些部分可以獨立快取。

#### 何時使用多個中斷點

如果您想要以下情況，可以定義最多 4 個快取中斷點：
- 快取以不同頻率變化的不同部分（例如，工具很少變化，但上下文每天更新）
- 對快取內容有更多控制
- 確保快取最後一個中斷點之前超過 20 個內容區塊的內容
- 在可編輯內容之前放置中斷點，以保證即使在 20 區塊視窗之外發生變化時也能獲得快取命中

<Note>
**重要限制**：如果您的提示詞在快取中斷點之前有超過 20 個內容區塊，並且您修改了這 20 個區塊之前的內容，除非您在更接近該內容的位置添加額外的明確中斷點，否則您不會獲得快取命中。
</Note>

### 快取限制
最小可快取提示詞長度為：
- Claude Opus 4.5 為 4096 個 token
- Claude Opus 4.1、Claude Opus 4、Claude Sonnet 4.5、Claude Sonnet 4、Claude Sonnet 3.7 ([已棄用](/docs/zh-TW/about-claude/model-deprecations)) 和 Claude Opus 3 ([已棄用](/docs/zh-TW/about-claude/model-deprecations)) 為 1024 個 token
- Claude Haiku 4.5 為 4096 個 token
- Claude Haiku 3.5 和 Claude Haiku 3 為 2048 個 token

較短的提示詞無法快取，即使標記有 `cache_control`。任何快取少於此數量 token 的請求都將在不快取的情況下處理。要查看提示詞是否已快取，請參閱回應使用情況[欄位](/docs/zh-TW/build-with-claude/prompt-caching#tracking-cache-performance)。

對於並行請求，請注意快取項目只有在第一個回應開始後才可用。如果您需要並行請求的快取命中，請在發送後續請求之前等待第一個回應。

目前，「ephemeral」是唯一支援的快取類型，預設生命週期為 5 分鐘。

### 了解快取中斷點成本

**快取中斷點本身不會增加任何成本。** 您只需支付：
- **快取寫入**：當新內容寫入快取時（比基礎輸入 token 多 25%，用於 5 分鐘 TTL）
- **快取讀取**：當使用快取內容時（基礎輸入 token 價格的 10%）
- **常規輸入 token**：對於任何未快取的內容

添加更多 `cache_control` 中斷點不會增加您的成本 - 您仍然根據實際快取和讀取的內容支付相同的金額。中斷點只是讓您控制哪些部分可以獨立快取。

### 可以快取的內容
請求中的大多數區塊都可以使用 `cache_control` 指定進行快取。這包括：

- 工具：`tools` 陣列中的工具定義
- 系統訊息：`system` 陣列中的內容區塊
- 文字訊息：`messages.content` 陣列中的內容區塊，用於使用者和助手輪次
- 影像和文件：`messages.content` 陣列中的內容區塊，在使用者輪次中
- 工具使用和工具結果：`messages.content` 陣列中的內容區塊，在使用者和助手輪次中

這些元素中的每一個都可以標記有 `cache_control` 以啟用該部分請求的快取。

### 無法快取的內容
雖然大多數請求區塊都可以快取，但有一些例外：

- 思考區塊無法直接使用 `cache_control` 快取。但是，當思考區塊出現在先前的助手輪次中時，它們可以與其他內容一起快取。以這種方式快取時，它們在從快取讀取時確實計為輸入 token。
- 子內容區塊（如[引用](/docs/zh-TW/build-with-claude/citations)）本身無法直接快取。相反，快取頂級區塊。

    在引用的情況下，作為引用源材料的頂級文件內容區塊可以快取。這允許您透過快取引用將參考的文件來有效地使用帶有引用的提示詞快取。
- 空文字區塊無法快取。

### 什麼會使快取失效

對快取內容的修改可能會使部分或全部快取失效。

如[結構化您的提示詞](#structuring-your-prompt)中所述，快取遵循層級結構：`tools` → `system` → `messages`。每個級別的變化都會使該級別及所有後續級別失效。

下表顯示了不同類型的變化會使快取的哪些部分失效。✘ 表示快取已失效，而 ✓ 表示快取保持有效。

| 變化內容 | 工具快取 | 系統快取 | 訊息快取 | 影響 |
|------------|------------------|---------------|----------------|-------------|
| **工具定義** | ✘ | ✘ | ✘ | 修改工具定義（名稱、描述、參數）會使整個快取失效 |
| **網路搜尋切換** | ✓ | ✘ | ✘ | 啟用/停用網路搜尋會修改系統提示詞 |
| **引用切換** | ✓ | ✘ | ✘ | 啟用/停用引用會修改系統提示詞 |
| **工具選擇** | ✓ | ✓ | ✘ | 對 `tool_choice` 參數的變化只影響訊息區塊 |
| **影像** | ✓ | ✓ | ✘ | 在提示詞中任何位置添加/移除影像會影響訊息區塊 |
| **思考參數** | ✓ | ✓ | ✘ | 對擴展思考設定（啟用/停用、預算）的變化會影響訊息區塊 |
| **傳遞給擴展思考請求的非工具結果** | ✓ | ✓ | ✘ | 當在啟用擴展思考的請求中傳遞非工具結果時，所有先前快取的思考區塊都會從上下文中移除，並且上下文中跟隨這些思考區塊的任何訊息都會從快取中移除。如需更多詳細資訊，請參閱[使用思考區塊進行快取](#caching-with-thinking-blocks)。 |

### 追蹤快取效能

使用這些 API 回應欄位監控快取效能，位於回應中的 `usage` 內（或如果[串流](/docs/zh-TW/build-with-claude/streaming)則為 `message_start` 事件）：

- `cache_creation_input_tokens`：建立新項目時寫入快取的 token 數。
- `cache_read_input_tokens`：為此請求從快取檢索的 token 數。
- `input_tokens`：未從快取讀取或用於建立快取的輸入 token 數（即最後一個快取中斷點之後的 token）。

<Note>
**了解 token 分解**

`input_tokens` 欄位僅代表您的請求中最後一個快取中斷點**之後**的 token - 而不是您發送的所有輸入 token。

要計算總輸入 token：
```
total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
```

**空間解釋：**
- `cache_read_input_tokens` = 中斷點之前已快取的 token（讀取）
- `cache_creation_input_tokens` = 中斷點之前現在正在快取的 token（寫入）
- `input_tokens` = 最後一個快取中斷點之後的 token（不符合快取資格）

**範例：** 如果您有一個請求，其中包含 100,000 個已快取內容的 token（從快取讀取）、0 個正在快取的新內容 token，以及使用者訊息中的 50 個 token（在快取中斷點之後）：
- `cache_read_input_tokens`：100,000
- `cache_creation_input_tokens`：0
- `input_tokens`：50
- **處理的總輸入 token**：100,050 個 token

這對於了解成本和速率限制都很重要，因為在有效使用快取時，`input_tokens` 通常會遠小於您的總輸入。
</Note>

### 有效快取的最佳實踐

要最佳化提示詞快取效能：

- 快取穩定、可重複使用的內容，如系統指令、背景資訊、大型上下文或頻繁的工具定義。
- 將快取內容放在提示詞的開頭以獲得最佳效能。
- 策略性地使用快取中斷點來分隔不同的可快取前綴部分。
- 在對話末尾和可編輯內容之前設定快取中斷點，以最大化快取命中率，特別是在使用具有超過 20 個內容區塊的提示詞時。
- 定期分析快取命中率並根據需要調整您的策略。

### 針對不同使用案例進行最佳化

根據您的情況調整提示詞快取策略：

- 對話代理：降低擴展對話的成本和延遲，特別是那些具有長指令或上傳文件的對話。
- 編碼助手：透過在提示詞中保留相關部分或程式碼庫的摘要版本來改進自動完成和程式碼庫問答。
- 大型文件處理：在提示詞中納入完整的長篇材料（包括影像），而不增加回應延遲。
- 詳細指令集：共享廣泛的指令、程序和範例清單，以微調 Claude 的回應。開發人員通常在提示詞中包含一個或兩個範例，但透過提示詞快取，您可以透過包含 20 多個高品質答案的多樣化範例來獲得更好的效能。
- 代理工具使用：增強涉及多個工具呼叫和迭代程式碼變化的情況的效能，其中每個步驟通常需要新的 API 呼叫。
- 與書籍、論文、文件、播客文字記錄和其他長篇內容交談：透過將整個文件嵌入提示詞中並讓使用者向其提出問題，使任何知識庫活躍起來。

### 疑難排解常見問題

如果遇到意外行為：

- 確保快取部分相同，並在所有呼叫中的相同位置標記有 cache_control
- 檢查呼叫是否在快取生命週期內進行（預設為 5 分鐘）
- 驗證 `tool_choice` 和影像使用在呼叫之間保持一致
- 驗證您快取的 token 數至少達到最小數量
- 系統會自動在先前的內容區塊邊界處檢查快取命中（在您的中斷點之前約 20 個區塊）。對於具有超過 20 個內容區塊的提示詞，您可能需要在提示詞早期添加額外的 `cache_control` 參數，以確保所有內容都可以快取
- 驗證 `tool_use` 內容區塊中的金鑰具有穩定的順序，因為某些語言（例如 Swift、Go）在 JSON 轉換期間隨機化金鑰順序，破壞快取

<Note>
對 `tool_choice` 的變化或提示詞中任何位置影像的存在/不存在將使快取失效，需要建立新的快取項目。如需有關快取失效的更多詳細資訊，請參閱[什麼會使快取失效](#what-invalidates-the-cache)。
</Note>

### 使用思考區塊進行快取

當使用[擴展思考](/docs/zh-TW/build-with-claude/extended-thinking)與提示詞快取時，思考區塊有特殊行為：

**與其他內容自動快取**：雖然思考區塊無法使用 `cache_control` 明確標記，但當您使用工具結果進行後續 API 呼叫時，它們會作為請求內容的一部分進行快取。這通常發生在工具使用期間，當您傳遞思考區塊以繼續對話時。

**輸入 token 計數**：當思考區塊從快取讀取時，它們在您的使用情況指標中計為輸入 token。這對於成本計算和 token 預算編制很重要。

**快取失效模式**：
- 當僅提供工具結果作為使用者訊息時，快取保持有效
- 當添加非工具結果使用者內容時，快取會失效，導致所有先前的思考區塊被移除
- 即使沒有明確的 `cache_control` 標記，也會發生此快取行為

如需有關快取失效的更多詳細資訊，請參閱[什麼會使快取失效](#what-invalidates-the-cache)。

**工具使用範例**：
```
Request 1: User: "What's the weather in Paris?"
Response: [thinking_block_1] + [tool_use block 1]

Request 2:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True]
Response: [thinking_block_2] + [text block 2]
# Request 2 caches its request content (not the response)
# The cache includes: user message, thinking_block_1, tool_use block 1, and tool_result_1

Request 3:
User: ["What's the weather in Paris?"],
Assistant: [thinking_block_1] + [tool_use block 1],
User: [tool_result_1, cache=True],
Assistant: [thinking_block_2] + [text block 2],
User: [Text response, cache=True]
# Non-tool-result user block causes all thinking blocks to be ignored
# This request is processed as if thinking blocks were never present
```

當包含非工具結果使用者區塊時，它指定一個新的助手迴圈，所有先前的思考區塊都會從上下文中移除。

如需更詳細的資訊，請參閱[擴展思考文件](/docs/zh-TW/build-with-claude/extended-thinking#understanding-thinking-block-caching-behavior)。

---
## 快取儲存和共享

- **組織隔離**：快取在組織之間隔離。不同的組織永遠不會共享快取，即使他們使用相同的提示詞。

- **精確匹配**：快取命中需要 100% 相同的提示詞段，包括直到並包括標記有快取控制的區塊的所有文字和影像。

- **輸出 Token 生成**：提示詞快取對輸出 token 生成沒有影響。您收到的回應將與未使用提示詞快取時收到的回應相同。

---
## 1 小時快取期限

如果您發現 5 分鐘太短，Anthropic 也提供 1 小時快取期限[需額外付費](#pricing)。

要使用擴展快取，請在 `cache_control` 定義中包含 `ttl`，如下所示：
```json
"cache_control": {
    "type": "ephemeral",
    "ttl": "5m" | "1h"
}
```

回應將包含詳細的快取資訊，如下所示：
```json
{
    "usage": {
        "input_tokens": ...,
        "cache_read_input_tokens": ...,
        "cache_creation_input_tokens": ...,
        "output_tokens": ...,

        "cache_creation": {
            "ephemeral_5m_input_tokens": 456,
            "ephemeral_1h_input_tokens": 100,
        }
    }
}
```

請注意，目前的 `cache_creation_input_tokens` 欄位等於 `cache_creation` 物件中的值之和。

### 何時使用 1 小時快取

如果您有定期使用的提示詞（即每 5 分鐘以上使用一次的系統提示詞），請繼續使用 5 分鐘快取，因為這將繼續以無額外成本的方式刷新。

1 小時快取最適合用於以下情況：
- 當您有可能使用頻率少於 5 分鐘但多於每小時的提示詞時。例如，當代理端代理將花費超過 5 分鐘時，或者當儲存與使用者的長聊天對話時，您通常預期該使用者在接下來的 5 分鐘內可能不會回應。
- 當延遲很重要且您的後續提示詞可能在 5 分鐘後發送時。
- 當您想改進速率限制利用率時，因為快取命中不會從您的速率限制中扣除。

<Note>
5 分鐘和 1 小時快取在延遲方面的行為相同。對於長文件，您通常會看到改進的首個 token 時間。
</Note>

### 混合不同的 TTL

您可以在同一請求中使用 1 小時和 5 分鐘快取控制，但有一個重要限制：較長 TTL 的快取項目必須出現在較短 TTL 之前（即 1 小時快取項目必須出現在任何 5 分鐘快取項目之前）。

混合 TTL 時，我們在您的提示詞中確定三個計費位置：
1. 位置 `A`：最高快取命中處的 token 計數（如果沒有命中則為 0）。
2. 位置 `B`：`A` 之後最高 1 小時 `cache_control` 區塊處的 token 計數（如果不存在則等於 `A`）。
3. 位置 `C`：最後一個 `cache_control` 區塊處的 token 計數。

<Note>
如果 `B` 和/或 `C` 大於 `A`，它們必然是快取未命中，因為 `A` 是最高快取命中。
</Note>

您將被收費：
1. 位置 `A` 的快取讀取 token。
2. 位置 `(B - A)` 的 1 小時快取寫入 token。
3. 位置 `(C - B)` 的 5 分鐘快取寫入 token。

以下是 3 個範例。這描繪了 3 個請求的輸入 token，每個請求都有不同的快取命中和快取未命中。每個都有不同的計算定價，如彩色框所示。
![混合 TTL 圖表](/docs/images/prompt-cache-mixed-ttl.svg)

---

## 提示詞快取範例

為了幫助您開始使用提示詞快取，我們準備了一份[提示詞快取食譜](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb)，其中包含詳細的範例和最佳實踐。

以下是我們提供的幾個程式碼片段，展示了各種提示詞快取模式。這些範例演示了如何在不同場景中實現快取，幫助您理解此功能的實際應用：

<section title="大型上下文快取範例">

<CodeGroup>
```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant tasked with analyzing legal documents."
        },
        {
            "type": "text",
            "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What are the key terms and conditions in this agreement?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  system: [
    {
        "type": "text",
        "text": "You are an AI assistant tasked with analyzing legal documents."
    },
    {
        "type": "text",
        "text": "Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]",
        "cache_control": {"type": "ephemeral"}
    }
  ],
  messages: [
    {
        "role": "user",
        "content": "What are the key terms and conditions in this agreement?"
    }
  ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class LegalDocumentAnalysisExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are an AI assistant tasked with analyzing legal documents.")
                                .build(),
                        TextBlockParam.builder()
                                .text("Here is the full text of a complex legal agreement: [Insert full text of a 50-page legal agreement here]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                .addUserMessage("What are the key terms and conditions in this agreement?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>
此範例演示了基本的提示詞快取用法，將法律協議的完整文本作為前綴進行快取，同時保持使用者指令未快取。

對於第一個請求：
- `input_tokens`：僅使用者訊息中的權杖數量
- `cache_creation_input_tokens`：整個系統訊息中的權杖數量，包括法律文件
- `cache_read_input_tokens`：0（第一個請求時沒有快取命中）

對於快取生命週期內的後續請求：
- `input_tokens`：僅使用者訊息中的權杖數量
- `cache_creation_input_tokens`：0（無新的快取建立）
- `cache_read_input_tokens`：整個快取系統訊息中的權杖數量

</section>
<section title="快取工具定義">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
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
                        "description": "The unit of temperature, either celsius or fahrenheit"
                    }
                },
                "required": ["location"]
            }
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "What is the weather and time in New York?"
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
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
            },
        },
        # many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools=[
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
            },
        },
        // many more tools
        {
            "name": "get_time",
            "description": "Get the current time in a given time zone",
            "input_schema": {
                "type": "object",
                "properties": {
                    "timezone": {
                        "type": "string",
                        "description": "The IANA time zone name, e.g. America/Los_Angeles"
                    }
                },
                "required": ["timezone"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages: [
        {
            "role": "user",
            "content": "What's the weather and time in New York?"
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;

public class ToolsWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Weather tool schema
        InputSchema weatherSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "location", Map.of(
                                "type", "string",
                                "description", "The city and state, e.g. San Francisco, CA"
                        ),
                        "unit", Map.of(
                                "type", "string",
                                "enum", List.of("celsius", "fahrenheit"),
                                "description", "The unit of temperature, either celsius or fahrenheit"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("location")))
                .build();

        // Time tool schema
        InputSchema timeSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "timezone", Map.of(
                                "type", "string",
                                "description", "The IANA time zone name, e.g. America/Los_Angeles"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("timezone")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .addTool(Tool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a given location")
                        .inputSchema(weatherSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_time")
                        .description("Get the current time in a given time zone")
                        .inputSchema(timeSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                .addUserMessage("What is the weather and time in New York?")
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

在此範例中，我們演示了快取工具定義。

`cache_control` 參數放在最後一個工具（`get_time`）上，以將所有工具指定為靜態前綴的一部分。

這意味著所有工具定義，包括 `get_weather` 和在 `get_time` 之前定義的任何其他工具，都將作為單個前綴進行快取。

當您有一組一致的工具想要在多個請求中重複使用而不需要每次都重新處理時，此方法很有用。

對於第一個請求：
- `input_tokens`：使用者訊息中的權杖數量
- `cache_creation_input_tokens`：所有工具定義和系統提示中的權杖數量
- `cache_read_input_tokens`：0（第一個請求時沒有快取命中）

對於快取生命週期內的後續請求：
- `input_tokens`：使用者訊息中的權杖數量
- `cache_creation_input_tokens`：0（無新的快取建立）
- `cache_read_input_tokens`：所有快取工具定義和系統提示中的權杖數量

</section>

<section title="繼續多輪對話">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "system": [
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        # ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system=[
        {
            "type": "text",
            "text": "...long system prompt",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        // ...long conversation so far
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello, can you tell me more about the solar system?",
                }
            ]
        },
        {
            "role": "assistant",
            "content": "Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you'd like to know more about?"
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Good to know."
                },
                {
                    "type": "text",
                    "text": "Tell me more about Mars.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;

public class ConversationWithCacheControlExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Create ephemeral system prompt
        TextBlockParam systemPrompt = TextBlockParam.builder()
                .text("...long system prompt")
                .cacheControl(CacheControlEphemeral.builder().build())
                .build();

        // Create message params
        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                .systemOfTextBlockParams(List.of(systemPrompt))
                // First user message (without cache control)
                .addUserMessage("Hello, can you tell me more about the solar system?")
                // Assistant response
                .addAssistantMessage("Certainly! The solar system is the collection of celestial bodies that orbit our Sun. It consists of eight planets, numerous moons, asteroids, comets, and other objects. The planets, in order from closest to farthest from the Sun, are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet has its own unique characteristics and features. Is there a specific aspect of the solar system you would like to know more about?")
                // Second user message (with cache control)
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Good to know.")
                                .build()),
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Tell me more about Mars.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

在此範例中，我們演示了如何在多輪對話中使用提示詞快取。

在每個回合中，我們使用 `cache_control` 標記最後一個訊息的最後一個區塊，以便對話可以逐步進行快取。系統將自動查找並使用最長的先前快取區塊序列以進行後續訊息。也就是說，先前標記有 `cache_control` 區塊的區塊稍後未標記此項，但如果在 5 分鐘內命中，它們仍將被視為快取命中（也是快取刷新！）。

此外，請注意 `cache_control` 參數放在系統訊息上。這是為了確保如果它從快取中被逐出（在 5 分鐘以上未使用後），它將在下一個請求時被添加回快取。

此方法對於在進行中的對話中維護上下文而不需要重複處理相同信息很有用。

正確設定後，您應該在每個請求的使用回應中看到以下內容：
- `input_tokens`：新使用者訊息中的權杖數量（將最少）
- `cache_creation_input_tokens`：新助手和使用者回合中的權杖數量
- `cache_read_input_tokens`：上一個回合之前的對話中的權杖數量

</section>

<section title="綜合應用：多個快取斷點">

<CodeGroup>

```bash Shell
curl https://api.anthropic.com/v1/messages \
     --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "system": [
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    "messages": [
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
}'
```

```python Python
import anthropic
client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "name": "search_documents",
            "description": "Search through the knowledge base",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search query"
                    }
                },
                "required": ["query"]
            }
        },
        {
            "name": "get_document",
            "description": "Retrieve a specific document by ID",
            "input_schema": {
                "type": "object",
                "properties": {
                    "doc_id": {
                        "type": "string",
                        "description": "Document ID"
                    }
                },
                "required": ["doc_id"]
            },
            "cache_control": {"type": "ephemeral"}
        }
    ],
    system=[
        {
            "type": "text",
            "text": "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            "cache_control": {"type": "ephemeral"}
        },
        {
            "type": "text",
            "text": "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Can you search for information about Mars rovers?"
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "tool_use",
                    "id": "tool_1",
                    "name": "search_documents",
                    "input": {"query": "Mars rovers"}
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "tool_result",
                    "tool_use_id": "tool_1",
                    "content": "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            "role": "assistant",
            "content": [
                {
                    "type": "text",
                    "text": "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Yes, please tell me about the Perseverance rover specifically.",
                    "cache_control": {"type": "ephemeral"}
                }
            ]
        }
    ]
)
print(response.model_dump_json())
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    tools: [
        {
            name: "search_documents",
            description: "Search through the knowledge base",
            input_schema: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search query"
                    }
                },
                required: ["query"]
            }
        },
        {
            name: "get_document",
            description: "Retrieve a specific document by ID",
            input_schema: {
                type: "object",
                properties: {
                    doc_id: {
                        type: "string",
                        description: "Document ID"
                    }
                },
                required: ["doc_id"]
            },
            cache_control: { type: "ephemeral" }
        }
    ],
    system: [
        {
            type: "text",
            text: "You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base",
            cache_control: { type: "ephemeral" }
        },
        {
            type: "text",
            text: "# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]",
            cache_control: { type: "ephemeral" }
        }
    ],
    messages: [
        {
            role: "user",
            content: "Can you search for information about Mars rovers?"
        },
        {
            role: "assistant",
            content: [
                {
                    type: "tool_use",
                    id: "tool_1",
                    name: "search_documents",
                    input: { query: "Mars rovers" }
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "tool_result",
                    tool_use_id: "tool_1",
                    content: "Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)"
                }
            ]
        },
        {
            role: "assistant",
            content: [
                {
                    type: "text",
                    text: "I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document."
                }
            ]
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Yes, please tell me about the Perseverance rover specifically.",
                    cache_control: { type: "ephemeral" }
                }
            ]
        }
    ]
});
console.log(response);
```

```java Java
import java.util.List;
import java.util.Map;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.core.JsonValue;
import com.anthropic.models.messages.CacheControlEphemeral;
import com.anthropic.models.messages.ContentBlockParam;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.Model;
import com.anthropic.models.messages.TextBlockParam;
import com.anthropic.models.messages.Tool;
import com.anthropic.models.messages.Tool.InputSchema;
import com.anthropic.models.messages.ToolResultBlockParam;
import com.anthropic.models.messages.ToolUseBlockParam;

public class MultipleCacheBreakpointsExample {

    public static void main(String[] args) {
        AnthropicClient client = AnthropicOkHttpClient.fromEnv();

        // Search tool schema
        InputSchema searchSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "query", Map.of(
                                "type", "string",
                                "description", "Search query"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("query")))
                .build();

        // Get document tool schema
        InputSchema getDocSchema = InputSchema.builder()
                .properties(JsonValue.from(Map.of(
                        "doc_id", Map.of(
                                "type", "string",
                                "description", "Document ID"
                        )
                )))
                .putAdditionalProperty("required", JsonValue.from(List.of("doc_id")))
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(Model.CLAUDE_OPUS_4_20250514)
                .maxTokens(1024)
                // Tools with cache control on the last one
                .addTool(Tool.builder()
                        .name("search_documents")
                        .description("Search through the knowledge base")
                        .inputSchema(searchSchema)
                        .build())
                .addTool(Tool.builder()
                        .name("get_document")
                        .description("Retrieve a specific document by ID")
                        .inputSchema(getDocSchema)
                        .cacheControl(CacheControlEphemeral.builder().build())
                        .build())
                // System prompts with cache control on instructions and context separately
                .systemOfTextBlockParams(List.of(
                        TextBlockParam.builder()
                                .text("You are a helpful research assistant with access to a document knowledge base.\n\n# Instructions\n- Always search for relevant documents before answering\n- Provide citations for your sources\n- Be objective and accurate in your responses\n- If multiple documents contain relevant information, synthesize them\n- Acknowledge when information is not available in the knowledge base")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build(),
                        TextBlockParam.builder()
                                .text("# Knowledge Base Context\n\nHere are the relevant documents for this conversation:\n\n## Document 1: Solar System Overview\nThe solar system consists of the Sun and all objects that orbit it...\n\n## Document 2: Planetary Characteristics\nEach planet has unique features. Mercury is the smallest planet...\n\n## Document 3: Mars Exploration\nMars has been a target of exploration for decades...\n\n[Additional documents...]")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build()
                ))
                // Conversation history
                .addUserMessage("Can you search for information about Mars rovers?")
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolUse(ToolUseBlockParam.builder()
                                .id("tool_1")
                                .name("search_documents")
                                .input(JsonValue.from(Map.of("query", "Mars rovers")))
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofToolResult(ToolResultBlockParam.builder()
                                .toolUseId("tool_1")
                                .content("Found 3 relevant documents: Document 3 (Mars Exploration), Document 7 (Rover Technology), Document 9 (Mission History)")
                                .build())
                ))
                .addAssistantMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("I found 3 relevant documents about Mars rovers. Let me get more details from the Mars Exploration document.")
                                .build())
                ))
                .addUserMessageOfBlockParams(List.of(
                        ContentBlockParam.ofText(TextBlockParam.builder()
                                .text("Yes, please tell me about the Perseverance rover specifically.")
                                .cacheControl(CacheControlEphemeral.builder().build())
                                .build())
                ))
                .build();

        Message message = client.messages().create(params);
        System.out.println(message);
    }
}
```
</CodeGroup>

此綜合範例演示了如何使用所有 4 個可用的快取斷點來優化提示詞的不同部分：

1. **工具快取**（快取斷點 1）：最後一個工具定義上的 `cache_control` 參數快取所有工具定義。

2. **可重複使用的指令快取**（快取斷點 2）：系統提示中的靜態指令被單獨快取。這些指令在請求之間很少改變。

3. **RAG 上下文快取**（快取斷點 3）：知識庫文件被獨立快取，允許您更新 RAG 文件而不會使工具或指令快取失效。

4. **對話歷史快取**（快取斷點 4）：助手的回應標記有 `cache_control` 以在對話進行時啟用增量快取。

此方法提供了最大的靈活性：
- 如果您只更新最後的使用者訊息，所有四個快取段都會被重複使用
- 如果您更新 RAG 文件但保持相同的工具和指令，前兩個快取段會被重複使用
- 如果您更改對話但保持相同的工具、指令和文件，前三個段會被重複使用
- 每個快取斷點可以根據應用程式中的變化獨立失效

對於第一個請求：
- `input_tokens`：最後一個使用者訊息中的權杖
- `cache_creation_input_tokens`：所有快取段中的權杖（工具 + 指令 + RAG 文件 + 對話歷史）
- `cache_read_input_tokens`：0（無快取命中）

對於後續請求（僅有新的使用者訊息）：
- `input_tokens`：僅新使用者訊息中的權杖
- `cache_creation_input_tokens`：添加到對話歷史的任何新權杖
- `cache_read_input_tokens`：所有先前快取的權杖（工具 + 指令 + RAG 文件 + 先前對話）

此模式對以下情況特別強大：
- 具有大型文件上下文的 RAG 應用程式
- 使用多個工具的代理系統
- 需要維護上下文的長期運行對話
- 需要獨立優化提示詞不同部分的應用程式

</section>

---
## 常見問題

  <section title="我需要多個快取斷點還是在末尾放一個就足夠了？">

    **在大多數情況下，在靜態內容末尾放置單個快取斷點就足夠了。** 系統會自動檢查所有先前內容區塊邊界（快取斷點前最多 20 個區塊）的快取命中，並使用最長的匹配快取區塊序列。

    您只需要多個斷點，如果：
    - 您在所需快取點之前有超過 20 個內容區塊
    - 您想要獨立快取以不同頻率更新的部分
    - 您需要明確控制為成本優化而快取的內容

    範例：如果您有系統指令（很少改變）和 RAG 上下文（每天改變），您可能會使用兩個斷點來分別快取它們。
  
</section>

  <section title="快取斷點會增加額外成本嗎？">

    不，快取斷點本身是免費的。您只需支付：
    - 將內容寫入快取（比基本輸入權杖多 25%，用於 5 分鐘 TTL）
    - 從快取讀取（基本輸入權杖價格的 10%）
    - 未快取內容的常規輸入權杖

    斷點的數量不影響定價 - 只有快取和讀取的內容量重要。
  
</section>

  <section title="我如何從使用欄位計算總輸入權杖？">

    使用回應包括三個單獨的輸入權杖欄位，它們一起代表您的總輸入：

    ```
    total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens
    ```

    - `cache_read_input_tokens`：從快取檢索的權杖（快取斷點之前被快取的所有內容）
    - `cache_creation_input_tokens`：被寫入快取的新權杖（在快取斷點處）
    - `input_tokens`：最後一個快取斷點之後未被快取的權杖

    **重要：** `input_tokens` 不代表所有輸入權杖 - 只代表最後一個快取斷點之後的部分。如果您有快取內容，`input_tokens` 通常會比您的總輸入小得多。

    **範例：** 使用 200K 權杖文件快取和 50 權杖使用者問題：
    - `cache_read_input_tokens`：200,000
    - `cache_creation_input_tokens`：0
    - `input_tokens`：50
    - **總計**：200,050 權杖

    此分解對於理解您的成本和速率限制使用至關重要。有關更多詳細信息，請參閱[追蹤快取效能](#tracking-cache-performance)。
  
</section>

  <section title="快取生命週期是多少？">

    快取的預設最小生命週期（TTL）是 5 分鐘。每次使用快取內容時，此生命週期都會刷新。

    如果您發現 5 分鐘太短，Anthropic 也提供[1 小時快取 TTL](#1-hour-cache-duration)。
  
</section>

  <section title="我可以使用多少個快取斷點？">

    您最多可以在提示詞中定義 4 個快取斷點（使用 `cache_control` 參數）。
  
</section>

  <section title="所有模型都可以使用提示詞快取嗎？">

    不，提示詞快取目前僅適用於 Claude Opus 4.5、Claude Opus 4.1、Claude Opus 4、Claude Sonnet 4.5、Claude Sonnet 4、Claude Sonnet 3.7（[已棄用](/docs/zh-TW/about-claude/model-deprecations)）、Claude Haiku 4.5、Claude Haiku 3.5、Claude Haiku 3 和 Claude Opus 3（[已棄用](/docs/zh-TW/about-claude/model-deprecations)）。
  
</section>

  <section title="提示詞快取如何與擴展思考配合使用？">

    當思考參數改變時，快取的系統提示和工具將被重複使用。但是，思考改變（啟用/禁用或預算改變）將使先前快取的提示詞前綴與訊息內容失效。

    有關快取失效的更多詳細信息，請參閱[什麼使快取失效](#what-invalidates-the-cache)。

    有關擴展思考的更多信息，包括其與工具使用和提示詞快取的交互，請參閱[擴展思考文件](/docs/zh-TW/build-with-claude/extended-thinking#extended-thinking-and-prompt-caching)。
  
</section>

  <section title="我如何啟用提示詞快取？">

    要啟用提示詞快取，請在 API 請求中包含至少一個 `cache_control` 斷點。
  
</section>

  <section title="我可以將提示詞快取與其他 API 功能一起使用嗎？">

    是的，提示詞快取可以與其他 API 功能（如工具使用和視覺功能）一起使用。但是，改變提示詞中是否有圖像或修改工具使用設定將破壞快取。

    有關快取失效的更多詳細信息，請參閱[什麼使快取失效](#what-invalidates-the-cache)。
  
</section>

  <section title="提示詞快取如何影響定價？">

    提示詞快取引入了新的定價結構，其中快取寫入的成本比基本輸入權杖多 25%，而快取命中的成本僅為基本輸入權杖價格的 10%。
  
</section>

  <section title="我可以手動清除快取嗎？">

    目前，沒有辦法手動清除快取。快取前綴在最少 5 分鐘不活動後自動過期。
  
</section>

  <section title="我如何追蹤快取策略的有效性？">

    您可以使用 API 回應中的 `cache_creation_input_tokens` 和 `cache_read_input_tokens` 欄位來監控快取效能。
  
</section>

  <section title="什麼會破壞快取？">

    有關快取失效的更多詳細信息，請參閱[什麼使快取失效](#what-invalidates-the-cache)，其中包括需要建立新快取項目的改變列表。
  
</section>

  <section title="提示詞快取如何處理隱私和數據分離？">

提示詞快取設計有強大的隱私和數據分離措施：

1. 快取鍵是使用快取控制點之前的提示詞的加密雜湊生成的。這意味著只有具有相同提示詞的請求才能訪問特定快取。

2. 快取是特定於組織的。同一組織內的使用者如果使用相同的提示詞，可以訪問相同的快取，但快取不會跨不同組織共享，即使提示詞相同。

3. 快取機制設計用於維護每個唯一對話或上下文的完整性和隱私。

4. 在提示詞中的任何地方使用 `cache_control` 是安全的。為了成本效率，最好將高度可變的部分（例如，使用者的任意輸入）排除在快取之外。

這些措施確保提示詞快取在提供效能優勢的同時維護數據隱私和安全。
  
</section>
  <section title="我可以將提示詞快取與批次 API 一起使用嗎？">

    是的，可以將提示詞快取與您的[批次 API](/docs/zh-TW/build-with-claude/batch-processing) 請求一起使用。但是，因為非同步批次請求可以並發處理並以任何順序處理，快取命中是盡力而為的基礎。

    [1 小時快取](#1-hour-cache-duration)可以幫助改進您的快取命中。最具成本效益的使用方式如下：
    - 收集一組具有共享前綴的訊息請求。
    - 發送一個批次請求，其中只有一個具有此共享前綴和 1 小時快取區塊的請求。這將被寫入 1 小時快取。
    - 完成後立即提交其餘請求。您必須監控該工作以了解何時完成。

    這通常比使用 5 分鐘快取更好，因為批次請求通常需要 5 分鐘到 1 小時才能完成。我們正在考慮改進這些快取命中率並使此過程更加直接的方法。
  
</section>
  <section title="為什麼我在 Python 中看到錯誤 `AttributeError: 'Beta' object has no attribute 'prompt_caching'`？">

  此錯誤通常在您升級 SDK 或使用過時程式碼範例時出現。提示詞快取現在已正式推出，因此您不再需要 beta 前綴。而不是：
    <CodeGroup>
      ```python Python
      python client.beta.prompt_caching.messages.create(...)
      ```
    </CodeGroup>
    只需使用：
    <CodeGroup>
      ```python Python
      python client.messages.create(...)
      ```
    </CodeGroup>
  
</section>
  <section title="為什麼我看到 'TypeError: Cannot read properties of undefined (reading 'messages')'？">

  此錯誤通常在您升級 SDK 或使用過時程式碼範例時出現。提示詞快取現在已正式推出，因此您不再需要 beta 前綴。而不是：

      ```typescript TypeScript
      client.beta.promptCaching.messages.create(...)
      ```

      只需使用：

      ```typescript
      client.messages.create(...)
      ```
  
</section>