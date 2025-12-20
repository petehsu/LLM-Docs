# 上下文編輯

隨著對話增長自動管理對話上下文，使用上下文編輯功能。

---

## 概述

上下文編輯允許您隨著對話增長自動管理對話上下文，幫助您優化成本並保持在上下文窗口限制內。您可以使用伺服器端 API 策略、客戶端 SDK 功能，或兩者結合使用。

| 方法 | 運行位置 | 策略 | 工作原理 |
|----------|---------------|------------|--------------|
| **伺服器端** | API | 工具結果清除 (`clear_tool_uses_20250919`)<br/>思考區塊清除 (`clear_thinking_20251015`) | 在提示到達 Claude 之前應用。從對話歷史記錄中清除特定內容。每個策略可以獨立配置。 |
| **客戶端** | SDK | 壓縮 | 在使用 [`tool_runner`](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta) 時，可在 [Python 和 TypeScript SDK](/docs/zh-TW/api/client-sdks) 中使用。生成摘要並替換完整對話歷史記錄。請參閱下方的 [壓縮](#client-side-compaction-sdk)。 |

## 伺服器端策略

<Note>
上下文編輯目前處於測試版，支持工具結果清除和思考區塊清除。要啟用它，請在您的 API 請求中使用測試版標頭 `context-management-2025-06-27`。

請通過我們的 [反饋表單](https://forms.gle/YXC2EKGMhjN1c4L88) 分享您對此功能的反饋。
</Note>

### 工具結果清除

`clear_tool_uses_20250919` 策略在對話上下文增長超過您配置的閾值時清除工具結果。激活後，API 會按時間順序自動清除最舊的工具結果，用佔位符文本替換它們，讓 Claude 知道工具結果已被移除。默認情況下，只清除工具結果。您可以通過將 `clear_tool_inputs` 設置為 true，選擇清除工具結果和工具調用（工具使用參數）。

### 思考區塊清除

`clear_thinking_20251015` 策略在啟用擴展思考時管理對話中的 `thinking` 區塊。此策略自動清除來自先前回合的較舊思考區塊。

<Tip>
**默認行為**：啟用擴展思考而不配置 `clear_thinking_20251015` 策略時，API 會自動僅保留最後一個助手回合的思考區塊（等同於 `keep: {type: "thinking_turns", value: 1}`）。

要最大化快取命中，通過設置 `keep: "all"` 保留所有思考區塊。
</Tip>

<Note>
助手對話回合可能包括多個內容區塊（例如使用工具時）和多個思考區塊（例如使用 [交錯思考](/docs/zh-TW/build-with-claude/extended-thinking#interleaved-thinking)）。
</Note>

<Tip>
**上下文編輯在伺服器端進行**

上下文編輯在提示到達 Claude 之前在 **伺服器端** 應用。您的客戶端應用程式保持完整的、未修改的對話歷史記錄——您無需將客戶端狀態與編輯版本同步。繼續像往常一樣在本地管理您的完整對話歷史記錄。
</Tip>

<Tip>
**上下文編輯和提示快取**

上下文編輯與 [提示快取](/docs/zh-TW/build-with-claude/prompt-caching) 的交互因策略而異：

- **工具結果清除**：清除內容時使快取的提示前綴失效。為了解決這個問題，我們建議清除足夠的令牌以使快取失效值得。使用 `clear_at_least` 參數確保每次清除最少數量的令牌。每次清除內容時您會產生快取寫入成本，但後續請求可以重用新快取的前綴。

- **思考區塊清除**：當思考區塊在上下文中被 **保留**（未清除）時，提示快取被保留，啟用快取命中並降低輸入令牌成本。當思考區塊被 **清除** 時，快取在清除發生的位置失效。根據您是否想優先考慮快取性能或上下文窗口可用性來配置 `keep` 參數。
</Tip>

## 支持的模型

上下文編輯可用於：

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## 工具結果清除用法

啟用工具結果清除的最簡單方法是僅指定策略類型，因為所有其他 [配置選項](#configuration-options-for-tool-result-clearing) 將使用其默認值：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### 進階配置

您可以使用其他參數自訂工具結果清除行為：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## 概述

上下文編輯允許您在對話增長時自動管理對話上下文，幫助您優化成本並保持在上下文窗口限制內。您可以使用伺服器端 API 策略、客戶端 SDK 功能，或兩者結合使用。

| 方法 | 運行位置 | 策略 | 工作原理 |
|----------|---------------|------------|--------------|
| **伺服器端** | API | 工具結果清除 (`clear_tool_uses_20250919`)<br/>思考區塊清除 (`clear_thinking_20251015`) | 在提示到達 Claude 之前應用。從對話歷史中清除特定內容。每個策略可以獨立配置。 |
| **客戶端** | SDK | 壓縮 | 在使用 [`tool_runner`](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta) 時，可在 [Python 和 TypeScript SDK](/docs/zh-TW/api/client-sdks) 中使用。生成摘要並替換完整對話歷史。請參閱下面的 [壓縮](#client-side-compaction-sdk)。 |

## 伺服器端策略

<Note>
上下文編輯目前處於測試版，支持工具結果清除和思考區塊清除。要啟用它，請在您的 API 請求中使用測試版標頭 `context-management-2025-06-27`。

請通過我們的 [反饋表單](https://forms.gle/YXC2EKGMhjN1c4L88) 分享您對此功能的反饋。
</Note>

### 工具結果清除

`clear_tool_uses_20250919` 策略在對話上下文增長超過您配置的閾值時清除工具結果。激活後，API 會按時間順序自動清除最舊的工具結果，用佔位符文本替換它們，讓 Claude 知道工具結果已被移除。默認情況下，只清除工具結果。您可以通過將 `clear_tool_inputs` 設置為 true，選擇清除工具結果和工具調用（工具使用參數）。

### 思考區塊清除

`clear_thinking_20251015` 策略在啟用擴展思考時管理對話中的 `thinking` 區塊。此策略自動清除來自先前輪次的較舊思考區塊。

<Tip>
**默認行為**：啟用擴展思考而不配置 `clear_thinking_20251015` 策略時，API 自動僅保留最後一個助手輪次的思考區塊（等同於 `keep: {type: "thinking_turns", value: 1}`）。

要最大化緩存命中，通過設置 `keep: "all"` 保留所有思考區塊。
</Tip>

<Note>
助手對話輪次可能包括多個內容區塊（例如使用工具時）和多個思考區塊（例如使用 [交錯思考](/docs/zh-TW/build-with-claude/extended-thinking#interleaved-thinking)）。
</Note>

<Tip>
**上下文編輯在伺服器端進行**

上下文編輯在提示到達 Claude 之前在**伺服器端**應用。您的客戶端應用程序保持完整的、未修改的對話歷史——您無需將客戶端狀態與編輯版本同步。繼續像往常一樣在本地管理您的完整對話歷史。
</Tip>

<Tip>
**上下文編輯和提示緩存**

上下文編輯與 [提示緩存](/docs/zh-TW/build-with-claude/prompt-caching) 的交互因策略而異：

- **工具結果清除**：清除內容時使緩存的提示前綴失效。為了解決這個問題，我們建議清除足夠的令牌以使緩存失效值得。使用 `clear_at_least` 參數確保每次清除時至少清除最少數量的令牌。每次清除內容時您都會產生緩存寫入成本，但後續請求可以重用新緩存的前綴。

- **思考區塊清除**：當思考區塊**保留**在上下文中（未清除）時，提示緩存被保留，啟用緩存命中並減少輸入令牌成本。當思考區塊**被清除**時，緩存在清除發生的位置失效。根據您是否想優先考慮緩存性能或上下文窗口可用性來配置 `keep` 參數。
</Tip>

## 支持的模型

上下文編輯可在以下模型上使用：

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## 工具結果清除用法

啟用工具結果清除的最簡單方法是僅指定策略類型，因為所有其他 [配置選項](#configuration-options-for-tool-result-clearing) 將使用其默認值：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Search for recent developments in AI"
            }
        ],
        "tools": [
            {
                "type": "web_search_20250305",
                "name": "web_search"
            }
        ],
        "context_management": {
            "edits": [
                {"type": "clear_tool_uses_20250919"}
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Search for recent developments in AI"
        }
    ],
    tools=[
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Search for recent developments in AI"
    }
  ],
  tools: [
    {
      type: "web_search_20250305",
      name: "web_search"
    }
  ],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  },
  betas: ["context-management-2025-06-27"]
});
```

</CodeGroup>

### 進階配置

您可以使用其他參數自定義工具結果清除行為：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "max_tokens": 4096,
        "messages": [
            {
                "role": "user",
                "content": "Create a simple command line calculator app using Python"
            }
        ],
        "tools": [
            {
                "type": "text_editor_20250728",
                "name": "str_replace_based_edit_tool",
                "max_characters": 10000
            },
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 3
            }
        ],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 3
                    },
                    "clear_at_least": {
                        "type": "input_tokens",
                        "value": 5000
                    },
                    "exclude_tools": ["web_search"]
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "Create a simple command line calculator app using Python"
        }
    ],
    tools=[
        {
            "type": "text_editor_20250728",
            "name": "str_replace_based_edit_tool",
            "max_characters": 10000
        },
        {
            "type": "web_search_20250305",
            "name": "web_search",
            "max_uses": 3
        }
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                # Trigger clearing when threshold is exceeded
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # Number of tool uses to keep after clearing
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # Optional: Clear at least this many tokens
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # Exclude these tools from being cleared
                "exclude_tools": ["web_search"]
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: "Create a simple command line calculator app using Python"
    }
  ],
  tools: [
    {
      type: "text_editor_20250728",
      name: "str_replace_based_edit_tool",
      max_characters: 10000
    },
    {
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3
    }
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        // Trigger clearing when threshold is exceeded
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // Number of tool uses to keep after clearing
        keep: {
          type: "tool_uses",
          value: 3
        },
        // Optional: Clear at least this many tokens
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // Exclude these tools from being cleared
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## 思考區塊清除用法

啟用思考區塊清除以在啟用擴展思考時有效管理上下文和提示緩存：

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5-20250929",
        "max_tokens": 1024,
        "messages": [...],
        "thinking": {
            "type": "enabled",
            "budget_tokens": 10000
        },
        "context_management": {
            "edits": [
                {
                    "type": "clear_thinking_20251015",
                    "keep": {
                        "type": "thinking_turns",
                        "value": 2
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            }
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      }
    ]
  }
});
```

</CodeGroup>

### 思考區塊清除的配置選項

`clear_thinking_20251015` 策略支持以下配置：

| 配置選項 | 默認值 | 描述 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 定義要保留多少個最近的帶有思考區塊的助手輪次。使用 `{type: "thinking_turns", value: N}`，其中 N 必須 > 0 以保留最後 N 個輪次，或使用 `"all"` 保留所有思考區塊。 |

**配置示例：**

```json
// 保留最後 3 個助手輪次的思考區塊
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 保留所有思考區塊（最大化緩存命中）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 思考區塊清除的配置選項

`clear_thinking_20251015` 策略支持以下配置：

| 配置選項 | 默認值 | 描述 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 定義要保留多少個最近的帶有思考區塊的助手輪次。使用 `{type: "thinking_turns", value: N}`，其中 N 必須 > 0 以保留最後 N 個輪次，或使用 `"all"` 保留所有思考區塊。 |

**配置示例：**

```json
// 保留最後 3 個助手輪次的思考區塊
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 保留所有思考區塊（最大化緩存命中）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 組合策略

您可以同時使用思考區塊清除和工具結果清除：

<Note>
使用多個策略時，`clear_thinking_20251015` 策略必須在 `edits` 陣列中首先列出。
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

### 思考區塊清除的配置選項

`clear_thinking_20251015` 策略支持以下配置：

| 配置選項 | 默認值 | 描述 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 定義要保留多少個最近的帶有思考區塊的助手輪次。使用 `{type: "thinking_turns", value: N}`，其中 N 必須 > 0 以保留最後 N 個輪次，或使用 `"all"` 保留所有思考區塊。 |

**配置示例：**

```json
// 保留最後 3 個助手輪次的思考區塊
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 保留所有思考區塊（最大化緩存命中）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 組合策略

您可以同時使用思考區塊清除和工具結果清除：

<Note>
使用多個策略時，`clear_thinking_20251015` 策略必須在 `edits` 陣列中首先列出。
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## 工具結果清除的配置選項

| 配置選項 | 默認值 | 描述 |
|---------------------|---------|-------------|
| `trigger` | 100,000 輸入令牌 | 定義上下文編輯策略何時激活。一旦提示超過此閾值，清除將開始。您可以在 `input_tokens` 或 `tool_uses` 中指定此值。 |
| `keep` | 3 個工具使用 | 定義清除發生後要保留多少個最近的工具使用/結果對。API 首先移除最舊的工具交互，保留最新的。 |
| `clear_at_least` | 無 | 確保每次策略激活時至少清除最少數量的令牌。如果 API 無法清除至少指定的數量，該策略將不被應用。這有助於確定上下文清除是否值得破壞您的提示緩存。 |
| `exclude_tools` | 無 | 工具名稱列表，其工具使用和結果永遠不應被清除。對於保留重要上下文很有用。 |
| `clear_tool_inputs` | `false` | 控制是否將工具調用參數與工具結果一起清除。默認情況下，只清除工具結果，同時保持 Claude 的原始工具調用可見。 |

### 思考區塊清除的配置選項

`clear_thinking_20251015` 策略支持以下配置：

| 配置選項 | 默認值 | 描述 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 定義要保留多少個最近的帶有思考區塊的助手輪次。使用 `{type: "thinking_turns", value: N}`，其中 N 必須 > 0 以保留最後 N 個輪次，或使用 `"all"` 保留所有思考區塊。 |

**配置示例：**

```json
// 保留最後 3 個助手輪次的思考區塊
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 保留所有思考區塊（最大化緩存命中）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 組合策略

您可以同時使用思考區塊清除和工具結果清除：

<Note>
使用多個策略時，`clear_thinking_20251015` 策略必須在 `edits` 陣列中首先列出。
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## 工具結果清除的配置選項

| 配置選項 | 默認值 | 描述 |
|---------------------|---------|-------------|
| `trigger` | 100,000 輸入令牌 | 定義上下文編輯策略何時激活。一旦提示超過此閾值，清除將開始。您可以在 `input_tokens` 或 `tool_uses` 中指定此值。 |
| `keep` | 3 個工具使用 | 定義清除發生後要保留多少個最近的工具使用/結果對。API 首先移除最舊的工具交互，保留最新的。 |
| `clear_at_least` | 無 | 確保每次策略激活時至少清除最少數量的令牌。如果 API 無法清除至少指定的數量，該策略將不被應用。這有助於確定上下文清除是否值得破壞您的提示緩存。 |
| `exclude_tools` | 無 | 工具名稱列表，其工具使用和結果永遠不應被清除。對於保留重要上下文很有用。 |
| `clear_tool_inputs` | `false` | 控制是否將工具調用參數與工具結果一起清除。默認情況下，只清除工具結果，同時保持 Claude 的原始工具調用可見。 |

## 上下文編輯回應

您可以使用 `context_management` 回應欄位查看哪些上下文編輯已應用於您的請求，以及有關清除的內容和輸入令牌的有用統計信息。

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // When using `clear_thinking_20251015`
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // When using `clear_tool_uses_20250919`
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

對於流式回應，上下文編輯將包含在最終 `message_delta` 事件中：

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

### 思考區塊清除的配置選項

`clear_thinking_20251015` 策略支援以下配置：

| 配置選項 | 預設值 | 描述 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 定義要保留多少個最近的助手回合（包含思考區塊）。使用 `{type: "thinking_turns", value: N}`，其中 N 必須 > 0 以保留最後 N 個回合，或使用 `"all"` 以保留所有思考區塊。 |

**配置範例：**

```json
// 保留最後 3 個助手回合的思考區塊
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 保留所有思考區塊（最大化快取命中）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 結合策略

您可以同時使用思考區塊清除和工具結果清除：

<Note>
使用多個策略時，`clear_thinking_20251015` 策略必須在 `edits` 陣列中首先列出。
</Note>

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[...],
    thinking={
        "type": "enabled",
        "budget_tokens": 10000
    },
    tools=[...],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_thinking_20251015",
                "keep": {
                    "type": "thinking_turns",
                    "value": 2
                }
            },
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 50000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)
```

```typescript TypeScript
const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5-20250929",
  max_tokens: 1024,
  messages: [...],
  thinking: {
    type: "enabled",
    budget_tokens: 10000
  },
  tools: [...],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_thinking_20251015",
        keep: {
          type: "thinking_turns",
          value: 2
        }
      },
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 50000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});
```

</CodeGroup>

## 工具結果清除的配置選項

| 配置選項 | 預設值 | 描述 |
|---------------------|---------|-------------|
| `trigger` | 100,000 個輸入 token | 定義上下文編輯策略何時啟動。一旦提示超過此閾值，清除就會開始。您可以在 `input_tokens` 或 `tool_uses` 中指定此值。 |
| `keep` | 3 個工具使用 | 定義清除後要保留多少個最近的工具使用/結果對。API 會首先移除最舊的工具互動，保留最新的互動。 |
| `clear_at_least` | 無 | 確保每次策略啟動時至少清除指定數量的 token。如果 API 無法至少清除指定的數量，該策略將不會被應用。這有助於判斷上下文清除是否值得破壞您的提示快取。 |
| `exclude_tools` | 無 | 工具名稱列表，其工具使用和結果永遠不應被清除。適用於保留重要上下文。 |
| `clear_tool_inputs` | `false` | 控制工具呼叫參數是否與工具結果一起被清除。預設情況下，只清除工具結果，同時保留 Claude 的原始工具呼叫可見。 |

## 上下文編輯回應

您可以使用 `context_management` 回應欄位查看哪些上下文編輯已應用於您的請求，以及有關清除的內容和輸入 token 的有用統計資訊。

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // 使用 `clear_thinking_20251015` 時
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // 使用 `clear_tool_uses_20250919` 時
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

對於串流回應，上下文編輯將包含在最終的 `message_delta` 事件中：

```json Streaming Response
{
    "type": "message_delta",
    "delta": {
        "stop_reason": "end_turn",
        "stop_sequence": null
    },
    "usage": {
        "output_tokens": 1024
    },
    "context_management": {
        "applied_edits": [...]
    }
}
```

## Token 計數

[token 計數](/docs/zh-TW/build-with-claude/token-counting) 端點支援上下文管理，允許您預覽在應用上下文編輯後您的提示將使用多少 token。

<CodeGroup>

```bash cURL
curl https://api.anthropic.com/v1/messages/count_tokens \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "content-type: application/json" \
    --header "anthropic-beta: context-management-2025-06-27" \
    --data '{
        "model": "claude-sonnet-4-5",
        "messages": [
            {
                "role": "user",
                "content": "Continue our conversation..."
            }
        ],
        "tools": [...],
        "context_management": {
            "edits": [
                {
                    "type": "clear_tool_uses_20250919",
                    "trigger": {
                        "type": "input_tokens",
                        "value": 30000
                    },
                    "keep": {
                        "type": "tool_uses",
                        "value": 5
                    }
                }
            ]
        }
    }'
```

```python Python
response = client.beta.messages.count_tokens(
    model="claude-sonnet-4-5",
    messages=[
        {
            "role": "user",
            "content": "Continue our conversation..."
        }
    ],
    tools=[...],  # Your tool definitions
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                "keep": {
                    "type": "tool_uses",
                    "value": 5
                }
            }
        ]
    }
)

print(f"Original tokens: {response.context_management['original_input_tokens']}")
print(f"After clearing: {response.input_tokens}")
print(f"Savings: {response.context_management['original_input_tokens'] - response.input_tokens} tokens")
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.countTokens({
  model: "claude-sonnet-4-5",
  messages: [
    {
      role: "user",
      content: "Continue our conversation..."
    }
  ],
  tools: [...],  // Your tool definitions
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      {
        type: "clear_tool_uses_20250919",
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        keep: {
          type: "tool_uses",
          value: 5
        }
      }
    ]
  }
});

console.log(`Original tokens: ${response.context_management?.original_input_tokens}`);
console.log(`After clearing: ${response.input_tokens}`);
console.log(`Savings: ${(response.context_management?.original_input_tokens || 0) - response.input_tokens} tokens`);
```
</CodeGroup>

```json Response
{
    "input_tokens": 25000,
    "context_management": {
        "original_input_tokens": 70000
    }
}
```

回應顯示應用上下文管理後的最終 token 計數（`input_tokens`）和任何清除發生前的原始 token 計數（`original_input_tokens`）。

## 與記憶工具搭配使用

上下文編輯可以與[記憶工具](/docs/zh-TW/agents-and-tools/tool-use/memory-tool)結合。當您的對話上下文接近配置的清除閾值時，Claude 會收到自動警告以保留重要資訊。這使 Claude 能夠在工具結果從對話歷史中被清除之前，將其保存到記憶檔案中。

此組合允許您：

- **保留重要上下文**：Claude 可以在工具結果被清除之前，將工具結果中的重要資訊寫入記憶檔案
- **維持長期執行的工作流程**：通過將資訊卸載到持久儲存，啟用否則會超過上下文限制的代理工作流程
- **按需存取資訊**：Claude 可以從記憶檔案中查詢先前清除的資訊，而不是將所有內容保留在活躍的上下文視窗中

例如，在 Claude 執行許多操作的檔案編輯工作流程中，Claude 可以在上下文增長時將已完成的變更摘要保存到記憶檔案。當工具結果被清除時，Claude 通過其記憶系統保留對該資訊的存取權，並可以繼續有效地工作。

要同時使用這兩個功能，請在您的 API 請求中啟用它們：

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## 用戶端壓縮 (SDK)

<Note>
壓縮在使用 [`tool_runner` 方法](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta) 時，可在 [Python 和 TypeScript SDK](/docs/zh-TW/api/client-sdks) 中使用。
</Note>

壓縮是一項 SDK 功能，當 token 使用量增長過大時，通過生成摘要來自動管理對話上下文。與清除內容的伺服器端上下文編輯策略不同，壓縮指示 Claude 摘要對話歷史，然後用該摘要替換完整歷史。這允許 Claude 繼續處理長期執行的任務，否則會超過[上下文視窗](/docs/zh-TW/build-with-claude/context-windows)。

### 壓縮如何運作

啟用壓縮時，SDK 在每個模型回應後監控 token 使用量：

1. **閾值檢查**：SDK 將總 token 計算為 `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **摘要生成**：當超過閾值時，摘要提示被注入為使用者回合，Claude 生成包裝在 `<summary></summary>` 標籤中的結構化摘要
3. **上下文替換**：SDK 提取摘要並用其替換整個訊息歷史
4. **繼續**：對話從摘要恢復，Claude 從中斷的地方繼續

### 使用壓縮

將 `compaction_control` 新增到您的 `tool_runner` 呼叫：

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### 壓縮期間發生的情況

隨著對話增長，訊息歷史累積：

**壓縮前（接近 100k token）：**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

當 token 超過閾值時，SDK 注入摘要請求，Claude 生成摘要。整個歷史隨後被替換：

**壓縮後（回到約 2-3k token）：**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude 從此摘要繼續工作，就像它是原始對話歷史一樣。

### 配置選項

| 參數 | 類型 | 必需 | 預設值 | 描述 |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | 是 | - | 是否啟用自動壓縮 |
| `context_token_threshold` | number | 否 | 100,000 | 觸發壓縮的 token 計數 |
| `model` | string | 否 | 與主模型相同 | 用於生成摘要的模型 |
| `summary_prompt` | string | 否 | 見下文 | 摘要生成的自訂提示 |

#### 選擇 token 閾值

閾值決定何時發生壓縮。較低的閾值意味著更頻繁的壓縮，上下文視窗較小。較高的閾值允許更多上下文，但有觸及限制的風險。

<CodeGroup>

```python Python
# 在記憶受限的情況下更頻繁地壓縮
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# 當您需要更多上下文時壓縮頻率較低
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// 在記憶受限的情況下更頻繁地壓縮
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// 當您需要更多上下文時壓縮頻率較低
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### 為摘要使用不同的模型

您可以使用更快或更便宜的模型來生成摘要：

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### 自訂摘要提示

您可以為特定領域的需求提供自訂提示。您的提示應指示 Claude 將其摘要包裝在 `<summary></summary>` 標籤中。

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

## 與記憶工具搭配使用

上下文編輯可以與[記憶工具](/docs/zh-TW/agents-and-tools/tool-use/memory-tool)結合使用。當您的對話上下文接近配置的清除閾值時，Claude 會收到自動警告以保留重要資訊。這使 Claude 能夠在工具結果從對話歷史中清除之前，將工具結果或上下文保存到其記憶檔案中。

此組合允許您：

- **保留重要上下文**：Claude 可以在工具結果被清除之前，將工具結果中的重要資訊寫入記憶檔案
- **維持長期運行的工作流程**：通過將資訊卸載到持久存儲，啟用否則會超過上下文限制的代理工作流程
- **按需存取資訊**：Claude 可以在需要時從記憶檔案中查找先前清除的資訊，而不是將所有內容保留在活動上下文視窗中

例如，在 Claude 執行許多操作的檔案編輯工作流程中，Claude 可以在上下文增長時將已完成的變更摘要保存到記憶檔案。當工具結果被清除時，Claude 通過其記憶系統保留對該資訊的存取權限，並可以繼續有效地工作。

要同時使用這兩個功能，請在您的 API 請求中啟用它們：

<CodeGroup>

```python Python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[...],
    tools=[
        {
            "type": "memory_20250818",
            "name": "memory"
        },
        # Your other tools
    ],
    betas=["context-management-2025-06-27"],
    context_management={
        "edits": [
            {"type": "clear_tool_uses_20250919"}
        ]
    }
)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const response = await anthropic.beta.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [...],
  tools: [
    {
      type: "memory_20250818",
      name: "memory"
    },
    // Your other tools
  ],
  betas: ["context-management-2025-06-27"],
  context_management: {
    edits: [
      { type: "clear_tool_uses_20250919" }
    ]
  }
});
```

</CodeGroup>

## 用戶端壓縮 (SDK)

<Note>
壓縮在使用 [`tool_runner` 方法](/docs/zh-TW/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)時，可在 [Python 和 TypeScript SDK](/docs/zh-TW/api/client-sdks) 中使用。
</Note>

壓縮是一項 SDK 功能，當令牌使用量增長過大時，通過生成摘要來自動管理對話上下文。與清除內容的伺服器端上下文編輯策略不同，壓縮指示 Claude 摘要對話歷史，然後用該摘要替換完整歷史。這允許 Claude 繼續處理否則會超過[上下文視窗](/docs/zh-TW/build-with-claude/context-windows)的長期運行任務。

### 壓縮的工作原理

啟用壓縮後，SDK 在每個模型回應後監控令牌使用量：

1. **閾值檢查**：SDK 將總令牌計算為 `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **摘要生成**：當超過閾值時，摘要提示被注入為使用者回合，Claude 生成包裝在 `<summary></summary>` 標籤中的結構化摘要
3. **上下文替換**：SDK 提取摘要並用它替換整個訊息歷史
4. **繼續**：對話從摘要恢復，Claude 從中斷的地方繼續

### 使用壓縮

將 `compaction_control` 添加到您的 `tool_runner` 呼叫中：

<CodeGroup>

```python Python
import anthropic

client = anthropic.Anthropic()

runner = client.beta.messages.tool_runner(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    tools=[...],
    messages=[
        {
            "role": "user",
            "content": "Analyze all the files in this directory and write a summary report."
        }
    ],
    compaction_control={
        "enabled": True,
        "context_token_threshold": 100000
    }
)

for message in runner:
    print(f"Tokens used: {message.usage.input_tokens}")

final = runner.until_done()
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const runner = client.beta.messages.toolRunner({
    model: 'claude-sonnet-4-5',
    max_tokens: 4096,
    tools: [...],
    messages: [
        {
            role: 'user',
            content: 'Analyze all the files in this directory and write a summary report.'
        }
    ],
    compactionControl: {
        enabled: true,
        contextTokenThreshold: 100000
    }
});

for await (const message of runner) {
    console.log('Tokens used:', message.usage.input_tokens);
}

const finalMessage = await runner.runUntilDone();
```

</CodeGroup>

#### 壓縮期間發生的情況

隨著對話增長，訊息歷史會累積：

**壓縮前（接近 100k 令牌）：**
```json
[
  { "role": "user", "content": "Analyze all files and write a report..." },
  { "role": "assistant", "content": "I'll help. Let me start by reading..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "Based on file1.txt, I see..." },
  { "role": "user", "content": [{ "type": "tool_result", "tool_use_id": "...", "content": "..." }] },
  { "role": "assistant", "content": "After analyzing file2.txt..." },
  // ... 50 more exchanges like this ...
]
```

當令牌超過閾值時，SDK 注入摘要請求，Claude 生成摘要。整個歷史隨後被替換：

**壓縮後（回到約 2-3k 令牌）：**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude 從此摘要繼續工作，就像它是原始對話歷史一樣。

### 配置選項

| 參數 | 類型 | 必需 | 預設值 | 描述 |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | 是 | - | 是否啟用自動壓縮 |
| `context_token_threshold` | number | 否 | 100,000 | 觸發壓縮的令牌計數 |
| `model` | string | 否 | 與主模型相同 | 用於生成摘要的模型 |
| `summary_prompt` | string | 否 | 見下文 | 摘要生成的自訂提示 |

#### 選擇令牌閾值

閾值決定何時發生壓縮。較低的閾值意味著更頻繁的壓縮，上下文視窗更小。較高的閾值允許更多上下文，但有達到限制的風險。

<CodeGroup>

```python Python
# More frequent compaction for memory-constrained scenarios
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# Less frequent compaction when you need more context
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// More frequent compaction for memory-constrained scenarios
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// Less frequent compaction when you need more context
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### 使用不同的模型生成摘要

您可以使用更快或更便宜的模型來生成摘要：

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "model": "claude-haiku-4-5"
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'
}
```

</CodeGroup>

#### 自訂摘要提示

您可以為特定領域的需求提供自訂提示。您的提示應指示 Claude 將其摘要包裝在 `<summary></summary>` 標籤中。

<CodeGroup>

```python Python
compaction_control={
    "enabled": True,
    "context_token_threshold": 100000,
    "summary_prompt": """Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags."""
}
```

```typescript TypeScript
compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    summaryPrompt: `Summarize the research conducted so far, including:
- Sources consulted and key findings
- Questions answered and remaining unknowns
- Recommended next steps

Wrap your summary in <summary></summary> tags.`
}
```

</CodeGroup>

### 預設摘要提示

內建摘要提示指示 Claude 建立包括以下內容的結構化延續摘要：

1. **任務概述**：使用者的核心請求、成功標準和限制
2. **目前狀態**：已完成的內容、修改的檔案和生成的成品
3. **重要發現**：技術限制、做出的決定、解決的錯誤和失敗的方法
4. **後續步驟**：需要的具體行動、阻礙因素和優先順序
5. **要保留的上下文**：使用者偏好、特定領域的詳細資訊和做出的承諾

此結構使 Claude 能夠有效地恢復工作，而不會丟失重要上下文或重複犯錯。

<section title="查看完整預設提示">

```
You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:

1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified

2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced

3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)

4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain

5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user

Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.

Wrap your summary in <summary></summary> tags.
```

</section>

### 限制

#### 伺服器端工具

<Warning>
壓縮在使用伺服器端工具（例如[網路搜尋](/docs/zh-TW/agents-and-tools/tool-use/web-search-tool)或[網路擷取](/docs/zh-TW/agents-and-tools/tool-use/web-fetch-tool)）時需要特別考慮。
</Warning>

使用伺服器端工具時，SDK 可能會錯誤地計算令牌使用量，導致壓縮在錯誤的時間觸發。

例如，在網路搜尋操作後，API 回應可能顯示：

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK 將總使用量計算為 63,000 + 270,000 = 333,000 令牌。但是，`cache_read_input_tokens` 值包括伺服器端工具進行的多個內部 API 呼叫的累積讀取，而不是您的實際對話上下文。您的實際上下文長度可能只有 63,000 個 `input_tokens`，但 SDK 看到 333k 並過早觸發壓縮。

**解決方案：**

- 使用[令牌計數](/docs/zh-TW/build-with-claude/token-counting)端點獲取準確的上下文長度
- 在廣泛使用伺服器端工具時避免壓縮

#### 工具使用邊界情況

當壓縮在工具使用回應待處理時觸發時，SDK 在生成摘要之前從訊息歷史中移除工具使用區塊。如果仍需要，Claude 在從摘要恢復後會重新發出工具呼叫。

### 限制

#### 伺服器端工具

<Warning>
壓縮在使用伺服器端工具（例如[網路搜尋](/docs/zh-TW/agents-and-tools/tool-use/web-search-tool)或[網路擷取](/docs/zh-TW/agents-and-tools/tool-use/web-fetch-tool)）時需要特別考慮。
</Warning>

使用伺服器端工具時，SDK 可能會錯誤地計算令牌使用量，導致壓縮在錯誤的時間觸發。

例如，在網路搜尋操作後，API 回應可能顯示：

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK 將總使用量計算為 63,000 + 270,000 = 333,000 令牌。但是，`cache_read_input_tokens` 值包括伺服器端工具進行的多個內部 API 呼叫的累積讀取，而不是您的實際對話上下文。您的實際上下文長度可能只有 63,000 個 `input_tokens`，但 SDK 看到 333k 並過早觸發壓縮。

**解決方案：**

- 使用[令牌計數](/docs/zh-TW/build-with-claude/token-counting)端點獲取準確的上下文長度
- 在廣泛使用伺服器端工具時避免壓縮

#### 工具使用邊界情況

當壓縮在工具使用回應待處理時觸發時，SDK 在生成摘要之前從訊息歷史中移除工具使用區塊。如果仍需要，Claude 在從摘要恢復後會重新發出工具呼叫。

### 監控壓縮

啟用日誌記錄以追蹤壓縮何時發生：

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### 限制

#### 伺服器端工具

<Warning>
壓縮在使用伺服器端工具（例如[網路搜尋](/docs/zh-TW/agents-and-tools/tool-use/web-search-tool)或[網路擷取](/docs/zh-TW/agents-and-tools/tool-use/web-fetch-tool)）時需要特別考慮。
</Warning>

使用伺服器端工具時，SDK 可能會錯誤地計算令牌使用量，導致壓縮在錯誤的時間觸發。

例如，在網路搜尋操作後，API 回應可能顯示：

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK 將總使用量計算為 63,000 + 270,000 = 333,000 令牌。但是，`cache_read_input_tokens` 值包括伺服器端工具進行的多個內部 API 呼叫的累積讀取，而不是您的實際對話上下文。您的實際上下文長度可能只有 63,000 個 `input_tokens`，但 SDK 看到 333k 並過早觸發壓縮。

**解決方案：**

- 使用[令牌計數](/docs/zh-TW/build-with-claude/token-counting)端點獲取準確的上下文長度
- 在廣泛使用伺服器端工具時避免壓縮

#### 工具使用邊界情況

當壓縮在工具使用回應待處理時觸發時，SDK 在生成摘要之前從訊息歷史中移除工具使用區塊。如果仍需要，Claude 在從摘要恢復後會重新發出工具呼叫。

### 監控壓縮

啟用日誌記錄以追蹤壓縮何時發生：

<CodeGroup>

```python Python
import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("anthropic.lib.tools").setLevel(logging.INFO)

# Logs will show:
# INFO: Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
# INFO: Compaction complete. New token usage: 2500
```

```typescript TypeScript
// The SDK logs compaction events to the console
// You'll see messages like:
// Token usage 105000 has exceeded the threshold of 100000. Performing compaction.
// Compaction complete. New token usage: 2500
```

</CodeGroup>

### 何時使用壓縮

**良好的使用案例：**

- 處理許多檔案或資料來源的長期運行代理任務
- 累積大量資訊的研究工作流程
- 具有明確、可測量進度的多步驟任務
- 生成在對話外部持久存在的成品（檔案、報告）的任務

**不太理想的使用案例：**

- 需要精確回憶早期對話詳細資訊的任務
- 廣泛使用伺服器端工具的工作流程
- 需要在許多變數中維持確切狀態的任務