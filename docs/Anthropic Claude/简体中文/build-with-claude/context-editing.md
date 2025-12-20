# 上下文编辑

在对话增长时自动管理对话上下文，使用上下文编辑功能。

---

## 概述

上下文编辑允许您在对话增长时自动管理对话上下文，帮助您优化成本并保持在上下文窗口限制内。您可以使用服务器端 API 策略、客户端 SDK 功能，或两者结合使用。

| 方法 | 运行位置 | 策略 | 工作原理 |
|----------|---------------|------------|--------------|
| **服务器端** | API | 工具结果清除 (`clear_tool_uses_20250919`)<br/>思考块清除 (`clear_thinking_20251015`) | 在提示到达 Claude 之前应用。从对话历史中清除特定内容。每个策略可以独立配置。 |
| **客户端** | SDK | 压缩 | 在使用 [`tool_runner`](/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta) 时，可在 [Python 和 TypeScript SDK](/docs/zh-CN/api/client-sdks) 中使用。生成摘要并替换完整对话历史。请参阅下面的 [压缩](#client-side-compaction-sdk)。 |

## 服务器端策略

<Note>
上下文编辑目前处于测试阶段，支持工具结果清除和思考块清除。要启用它，请在 API 请求中使用测试版标头 `context-management-2025-06-27`。

请通过我们的 [反馈表单](https://forms.gle/YXC2EKGMhjN1c4L88) 分享您对此功能的反馈。
</Note>

### 工具结果清除

`clear_tool_uses_20250919` 策略在对话上下文增长超过您配置的阈值时清除工具结果。激活后，API 会按时间顺序自动清除最旧的工具结果，用占位符文本替换它们，让 Claude 知道工具结果已被移除。默认情况下，仅清除工具结果。您可以通过将 `clear_tool_inputs` 设置为 true，选择清除工具结果和工具调用（工具使用参数）。

### 思考块清除

`clear_thinking_20251015` 策略在启用扩展思考时管理对话中的 `thinking` 块。此策略自动清除来自先前轮次的较旧思考块。

<Tip>
**默认行为**：启用扩展思考但未配置 `clear_thinking_20251015` 策略时，API 会自动仅保留最后一个助手轮次的思考块（等同于 `keep: {type: "thinking_turns", value: 1}`）。

要最大化缓存命中，通过设置 `keep: "all"` 来保留所有思考块。
</Tip>

<Note>
助手对话轮次可能包括多个内容块（例如使用工具时）和多个思考块（例如使用 [交错思考](/docs/zh-CN/build-with-claude/extended-thinking#interleaved-thinking)）。
</Note>

<Tip>
**上下文编辑在服务器端进行**

上下文编辑在提示到达 Claude 之前在 **服务器端** 应用。您的客户端应用程序维护完整的、未修改的对话历史——您无需将客户端状态与编辑后的版本同步。继续像往常一样在本地管理您的完整对话历史。
</Tip>

<Tip>
**上下文编辑和提示缓存**

上下文编辑与 [提示缓存](/docs/zh-CN/build-with-claude/prompt-caching) 的交互因策略而异：

- **工具结果清除**：清除内容时使缓存的提示前缀失效。为了解决这个问题，我们建议清除足够的令牌以使缓存失效值得。使用 `clear_at_least` 参数确保每次清除时至少清除最少数量的令牌。每次清除内容时您都会产生缓存写入成本，但后续请求可以重用新缓存的前缀。

- **思考块清除**：当思考块在上下文中被 **保留**（未清除）时，提示缓存被保留，启用缓存命中并减少输入令牌成本。当思考块被 **清除** 时，缓存在清除发生的位置失效。根据您是否想优先考虑缓存性能或上下文窗口可用性来配置 `keep` 参数。
</Tip>

## 支持的模型

上下文编辑可用于：

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## 工具结果清除使用

启用工具结果清除的最简单方法是仅指定策略类型，因为所有其他 [配置选项](#configuration-options-for-tool-result-clearing) 将使用其默认值：

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

### 高级配置

您可以使用其他参数自定义工具结果清除行为：

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
                # 当超过阈值时触发清除
                "trigger": {
                    "type": "input_tokens",
                    "value": 30000
                },
                # 清除后要保留的工具使用次数
                "keep": {
                    "type": "tool_uses",
                    "value": 3
                },
                # 可选：至少清除这么多令牌
                "clear_at_least": {
                    "type": "input_tokens",
                    "value": 5000
                },
                # 排除这些工具不被清除
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
        // 当超过阈值时触发清除
        trigger: {
          type: "input_tokens",
          value: 30000
        },
        // 清除后要保留的工具使用次数
        keep: {
          type: "tool_uses",
          value: 3
        },
        // 可选：至少清除这么多令牌
        clear_at_least: {
          type: "input_tokens",
          value: 5000
        },
        // 排除这些工具不被清除
        exclude_tools: ["web_search"]
      }
    ]
  }
});
```

</CodeGroup>

## 概述

上下文编辑允许您在对话增长时自动管理对话上下文，帮助您优化成本并保持在上下文窗口限制内。您可以使用服务器端 API 策略、客户端 SDK 功能，或两者结合使用。

| 方法 | 运行位置 | 策略 | 工作原理 |
|----------|---------------|------------|--------------|
| **服务器端** | API | 工具结果清除 (`clear_tool_uses_20250919`)<br/>思考块清除 (`clear_thinking_20251015`) | 在提示到达 Claude 之前应用。从对话历史中清除特定内容。每个策略可以独立配置。 |
| **客户端** | SDK | 压缩 | 在使用 [`tool_runner`](/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta) 时，在 [Python 和 TypeScript SDK](/docs/zh-CN/api/client-sdks) 中可用。生成摘要并替换完整的对话历史。请参阅下面的 [压缩](#client-side-compaction-sdk)。 |

## 服务器端策略

<Note>
上下文编辑目前处于测试阶段，支持工具结果清除和思考块清除。要启用它，请在 API 请求中使用测试版标头 `context-management-2025-06-27`。

请通过我们的 [反馈表单](https://forms.gle/YXC2EKGMhjN1c4L88) 分享您对此功能的反馈。
</Note>

### 工具结果清除

`clear_tool_uses_20250919` 策略在对话上下文增长超过您配置的阈值时清除工具结果。激活后，API 会按时间顺序自动清除最旧的工具结果，用占位符文本替换它们，以让 Claude 知道工具结果已被移除。默认情况下，仅清除工具结果。您可以通过将 `clear_tool_inputs` 设置为 true，选择同时清除工具结果和工具调用（工具使用参数）。

### 思考块清除

`clear_thinking_20251015` 策略在启用扩展思考时管理对话中的 `thinking` 块。此策略自动清除来自先前轮次的较旧思考块。

<Tip>
**默认行为**：启用扩展思考而不配置 `clear_thinking_20251015` 策略时，API 会自动仅保留最后一个助手轮次的思考块（等同于 `keep: {type: "thinking_turns", value: 1}`）。

要最大化缓存命中，通过设置 `keep: "all"` 保留所有思考块。
</Tip>

<Note>
助手对话轮次可能包括多个内容块（例如使用工具时）和多个思考块（例如使用 [交错思考](/docs/zh-CN/build-with-claude/extended-thinking#interleaved-thinking)）。
</Note>

<Tip>
**上下文编辑发生在服务器端**

上下文编辑在提示到达 Claude 之前应用于**服务器端**。您的客户端应用程序维护完整的、未修改的对话历史——您无需将客户端状态与编辑后的版本同步。继续像往常一样在本地管理您的完整对话历史。
</Tip>

<Tip>
**上下文编辑和提示缓存**

上下文编辑与 [提示缓存](/docs/zh-CN/build-with-claude/prompt-caching) 的交互因策略而异：

- **工具结果清除**：清除内容时使缓存的提示前缀失效。为了解决这个问题，我们建议清除足够的令牌以使缓存失效值得。使用 `clear_at_least` 参数确保每次清除时至少清除最少数量的令牌。每次清除内容时，您都会产生缓存写入成本，但后续请求可以重用新缓存的前缀。

- **思考块清除**：当思考块**保留**在上下文中（未清除）时，提示缓存被保留，启用缓存命中并减少输入令牌成本。当思考块**被清除**时，缓存在清除发生的位置失效。根据您是否想优先考虑缓存性能或上下文窗口可用性来配置 `keep` 参数。
</Tip>

## 支持的模型

上下文编辑可用于：

- Claude Opus 4.5 (`claude-opus-4-5-20251101`)
- Claude Opus 4.1 (`claude-opus-4-1-20250805`)
- Claude Opus 4 (`claude-opus-4-20250514`)
- Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)

## 工具结果清除用法

启用工具结果清除的最简单方法是仅指定策略类型，因为所有其他 [配置选项](#configuration-options-for-tool-result-clearing) 将使用其默认值：

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

### 高级配置

您可以使用其他参数自定义工具结果清除行为：

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

## 思考块清除用法

启用思考块清除以在启用扩展思考时有效管理上下文和提示缓存：

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

### 思考块清除的配置选项

`clear_thinking_20251015` 策略支持以下配置：

| 配置选项 | 默认值 | 描述 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 定义要保留的最近助手轮次（包含思考块）的数量。使用 `{type: "thinking_turns", value: N}`，其中 N 必须 > 0 以保留最后 N 个轮次，或使用 `"all"` 保留所有思考块。 |

**示例配置：**

```json
// 保留最后 3 个助手轮次的思考块
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 保留所有思考块（最大化缓存命中）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 组合策略

您可以同时使用思考块清除和工具结果清除：

<Note>
使用多个策略时，`clear_thinking_20251015` 策略必须在 `edits` 数组中首先列出。
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

## 工具结果清除的配置选项

| 配置选项 | 默认值 | 描述 |
|---------------------|---------|-------------|
| `trigger` | 100,000 输入令牌 | 定义上下文编辑策略何时激活。一旦提示超过此阈值，清除将开始。您可以在 `input_tokens` 或 `tool_uses` 中指定此值。 |
| `keep` | 3 个工具使用 | 定义清除发生后要保留的最近工具使用/结果对的数量。API 首先移除最旧的工具交互，保留最新的工具交互。 |
| `clear_at_least` | 无 | 确保每次策略激活时至少清除最少数量的令牌。如果 API 无法清除至少指定的数量，则不会应用该策略。这有助于确定上下文清除是否值得破坏您的提示缓存。 |
| `exclude_tools` | 无 | 工具名称列表，其工具使用和结果永远不应被清除。用于保留重要上下文。 |
| `clear_tool_inputs` | `false` | 控制是否将工具调用参数与工具结果一起清除。默认情况下，仅清除工具结果，同时保持 Claude 的原始工具调用可见。 |

## 上下文编辑响应

您可以使用 `context_management` 响应字段查看哪些上下文编辑已应用于您的请求，以及有关清除的内容和输入令牌的有用统计信息。

```json 响应
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // 使用 `clear_thinking_20251015` 时
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // 使用 `clear_tool_uses_20250919` 时
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

对于流式响应，上下文编辑将包含在最终的 `message_delta` 事件中：

```json 流式响应
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

### 思考块清除的配置选项

`clear_thinking_20251015` 策略支持以下配置：

| 配置选项 | 默认值 | 描述 |
|---------------------|---------|-------------|
| `keep` | `{type: "thinking_turns", value: 1}` | 定义要保留多少个最近的带有思考块的助手轮次。使用 `{type: "thinking_turns", value: N}`，其中 N 必须 > 0 以保留最后 N 个轮次，或使用 `"all"` 保留所有思考块。 |

**配置示例：**

```json
// 保留最后 3 个助手轮次的思考块
{
  "type": "clear_thinking_20251015",
  "keep": {
    "type": "thinking_turns",
    "value": 3
  }
}

// 保留所有思考块（最大化缓存命中）
{
  "type": "clear_thinking_20251015",
  "keep": "all"
}
```

### 组合策略

您可以同时使用思考块清除和工具结果清除：

<Note>
使用多个策略时，`clear_thinking_20251015` 策略必须在 `edits` 数组中首先列出。
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

## 工具结果清除的配置选项

| 配置选项 | 默认值 | 描述 |
|---------------------|---------|-------------|
| `trigger` | 100,000 输入令牌 | 定义上下文编辑策略何时激活。一旦提示超过此阈值，清除将开始。您可以在 `input_tokens` 或 `tool_uses` 中指定此值。 |
| `keep` | 3 个工具使用 | 定义清除发生后要保留多少个最近的工具使用/结果对。API 首先删除最旧的工具交互，保留最新的交互。 |
| `clear_at_least` | 无 | 确保每次策略激活时至少清除一定数量的令牌。如果 API 无法清除至少指定的数量，则不会应用该策略。这有助于确定上下文清除是否值得破坏您的提示缓存。 |
| `exclude_tools` | 无 | 工具名称列表，其工具使用和结果永远不应被清除。对于保留重要上下文很有用。 |
| `clear_tool_inputs` | `false` | 控制是否将工具调用参数与工具结果一起清除。默认情况下，仅清除工具结果，同时保持 Claude 的原始工具调用可见。 |

## 上下文编辑响应

您可以使用 `context_management` 响应字段查看哪些上下文编辑已应用于您的请求，以及有关已清除内容和输入令牌的有用统计信息。

```json Response
{
    "id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
    "type": "message",
    "role": "assistant",
    "content": [...],
    "usage": {...},
    "context_management": {
        "applied_edits": [
            // 使用 `clear_thinking_20251015` 时
            {
                "type": "clear_thinking_20251015",
                "cleared_thinking_turns": 3,
                "cleared_input_tokens": 15000
            },
            // 使用 `clear_tool_uses_20250919` 时
            {
                "type": "clear_tool_uses_20250919",
                "cleared_tool_uses": 8,
                "cleared_input_tokens": 50000
            }
        ]
    }
}
```

对于流式响应，上下文编辑将包含在最终的 `message_delta` 事件中：

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

## 令牌计数

[令牌计数](/docs/zh-CN/build-with-claude/token-counting)端点支持上下文管理，允许您预览应用上下文编辑后提示将使用多少令牌。

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

响应显示应用上下文管理后的最终令牌计数（`input_tokens`）和任何清除发生前的原始令牌计数（`original_input_tokens`）。

## 与内存工具一起使用

上下文编辑可以与[内存工具](/docs/zh-CN/agents-and-tools/tool-use/memory-tool)结合使用。当您的对话上下文接近配置的清除阈值时，Claude 会收到自动警告以保留重要信息。这使 Claude 能够在工具结果从对话历史中清除之前将其保存到内存文件中。

这种组合允许您：

- **保留重要上下文**：Claude 可以在清除工具结果之前将工具结果中的重要信息写入内存文件
- **维护长期运行的工作流**：通过将信息卸载到持久存储来启用否则会超过上下文限制的代理工作流
- **按需访问信息**：Claude 可以从内存文件中查找之前清除的信息，而不是将所有内容保留在活动上下文窗口中

例如，在 Claude 执行许多操作的文件编辑工作流中，Claude 可以在上下文增长时将已完成的更改总结到内存文件中。当工具结果被清除时，Claude 通过其内存系统保留对该信息的访问权限，并可以继续有效地工作。

要同时使用这两个功能，请在您的 API 请求中启用它们：

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

## 客户端压缩 (SDK)

<Note>
压缩在[Python 和 TypeScript SDK](/docs/zh-CN/api/client-sdks)中可用，当使用[`tool_runner` 方法](/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)时。
</Note>

压缩是一个 SDK 功能，当令牌使用量增长过大时，通过生成摘要来自动管理对话上下文。与清除内容的服务器端上下文编辑策略不同，压缩指示 Claude 总结对话历史，然后用该摘要替换完整历史。这允许 Claude 继续处理否则会超过[上下文窗口](/docs/zh-CN/build-with-claude/context-windows)的长期运行任务。

### 压缩如何工作

启用压缩时，SDK 在每个模型响应后监控令牌使用情况：

1. **阈值检查**：SDK 计算总令牌数为 `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **摘要生成**：当超过阈值时，摘要提示被注入为用户轮次，Claude 生成包装在 `<summary></summary>` 标签中的结构化摘要
3. **上下文替换**：SDK 提取摘要并用其替换整个消息历史
4. **继续**：对话从摘要恢复，Claude 从中断处继续

### 使用压缩

将 `compaction_control` 添加到您的 `tool_runner` 调用中：

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

#### 压缩期间发生的情况

随着对话的增长，消息历史积累：

**压缩前（接近 100k 令牌）：**
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

当令牌超过阈值时，SDK 注入摘要请求，Claude 生成摘要。然后整个历史被替换：

**压缩后（回到约 2-3k 令牌）：**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude 从这个摘要继续工作，就像它是原始对话历史一样。

### 配置选项

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | 是 | - | 是否启用自动压缩 |
| `context_token_threshold` | number | 否 | 100,000 | 触发压缩的令牌计数 |
| `model` | string | 否 | 与主模型相同 | 用于生成摘要的模型 |
| `summary_prompt` | string | 否 | 见下文 | 摘要生成的自定义提示 |

#### 选择令牌阈值

阈值确定何时发生压缩。较低的阈值意味着更频繁的压缩，上下文窗口更小。较高的阈值允许更多上下文，但存在达到限制的风险。

<CodeGroup>

```python Python
# 对于内存受限的场景进行更频繁的压缩
compaction_control={
    "enabled": True,
    "context_token_threshold": 50000
}

# 当您需要更多上下文时进行较少频繁的压缩
compaction_control={
    "enabled": True,
    "context_token_threshold": 150000
}
```

```typescript TypeScript
// 对于内存受限的场景进行更频繁的压缩
compactionControl: {
    enabled: true,
    contextTokenThreshold: 50000
}

// 当您需要更多上下文时进行较少频繁的压缩
compactionControl: {
    enabled: true,
    contextTokenThreshold: 150000
}
```

</CodeGroup>

#### 为摘要使用不同的模型

您可以使用更快或更便宜的模型来生成摘要：

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

#### 自定义摘要提示

您可以为特定领域的需求提供自定义提示。您的提示应指示 Claude 将其摘要包装在 `<summary></summary>` 标签中。

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

## 与内存工具一起使用

上下文编辑可以与[内存工具](/docs/zh-CN/agents-and-tools/tool-use/memory-tool)结合使用。当您的对话上下文接近配置的清除阈值时，Claude 会收到自动警告以保留重要信息。这使 Claude 能够在工具结果或上下文从对话历史中清除之前将其保存到内存文件中。

这种组合允许您：

- **保留重要上下文**：Claude 可以在工具结果被清除之前将其中的基本信息写入内存文件
- **维护长期运行的工作流**：通过将信息卸载到持久存储，启用可能会超过上下文限制的代理工作流
- **按需访问信息**：Claude 可以从内存文件中查找之前清除的信息，而不是将所有内容保留在活跃上下文窗口中

例如，在 Claude 执行许多操作的文件编辑工作流中，Claude 可以在上下文增长时将已完成的更改总结到内存文件中。当工具结果被清除时，Claude 通过其内存系统保留对该信息的访问权限，并可以继续有效地工作。

要同时使用这两个功能，请在您的 API 请求中启用它们：

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

## 客户端压缩 (SDK)

<Note>
压缩功能在使用 [`tool_runner` 方法](/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use#tool-runner-beta)时可在 [Python 和 TypeScript SDK](/docs/zh-CN/api/client-sdks) 中使用。
</Note>

压缩是一个 SDK 功能，当令牌使用量增长过大时，它通过生成摘要来自动管理对话上下文。与清除内容的服务器端上下文编辑策略不同，压缩指示 Claude 总结对话历史，然后用该摘要替换完整历史。这允许 Claude 继续处理长期运行的任务，否则会超过[上下文窗口](/docs/zh-CN/build-with-claude/context-windows)。

### 压缩如何工作

启用压缩后，SDK 在每个模型响应后监控令牌使用情况：

1. **阈值检查**：SDK 将总令牌计算为 `input_tokens + cache_creation_input_tokens + cache_read_input_tokens + output_tokens`
2. **摘要生成**：当超过阈值时，摘要提示被注入为用户回合，Claude 生成包装在 `<summary></summary>` 标签中的结构化摘要
3. **上下文替换**：SDK 提取摘要并用它替换整个消息历史
4. **继续**：对话从摘要恢复，Claude 从中断处继续

### 使用压缩

将 `compaction_control` 添加到您的 `tool_runner` 调用中：

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

#### 压缩期间发生的情况

随着对话的增长，消息历史会累积：

**压缩前（接近 100k 令牌）：**
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

当令牌超过阈值时，SDK 注入摘要请求，Claude 生成摘要。然后整个历史被替换：

**压缩后（回到约 2-3k 令牌）：**
```json
[
  {
    "role": "assistant",
    "content": "# Task Overview\nThe user requested analysis of directory files to produce a summary report...\n\n# Current State\nAnalyzed 52 files across 3 subdirectories. Key findings documented in report.md...\n\n# Important Discoveries\n- Configuration files use YAML format\n- Found 3 deprecated dependencies\n- Test coverage at 67%\n\n# Next Steps\n1. Analyze remaining files in /src/legacy\n2. Complete final report sections...\n\n# Context to Preserve\nUser prefers markdown format with executive summary first..."
  }
]
```

Claude 从这个摘要继续工作，就像它是原始对话历史一样。

### 配置选项

| 参数 | 类型 | 必需 | 默认值 | 描述 |
|-----------|------|----------|---------|-------------|
| `enabled` | boolean | 是 | - | 是否启用自动压缩 |
| `context_token_threshold` | number | 否 | 100,000 | 触发压缩的令牌计数 |
| `model` | string | 否 | 与主模型相同 | 用于生成摘要的模型 |
| `summary_prompt` | string | 否 | 见下文 | 摘要生成的自定义提示 |

#### 选择令牌阈值

阈值决定了压缩何时发生。较低的阈值意味着更频繁的压缩，上下文窗口更小。较高的阈值允许更多上下文，但有触及限制的风险。

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

您可以使用更快或更便宜的模型来生成摘要：

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

#### 自定义摘要提示

您可以为特定领域的需求提供自定义提示。您的提示应指示 Claude 将其摘要包装在 `<summary></summary>` 标签中。

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

### 默认摘要提示

内置摘要提示指示 Claude 创建包含以下内容的结构化继续摘要：

1. **任务概述**：用户的核心请求、成功标准和约束
2. **当前状态**：已完成的内容、修改的文件和生成的工件
3. **重要发现**：技术约束、做出的决定、解决的错误和失败的方法
4. **后续步骤**：需要的具体行动、阻碍因素和优先顺序
5. **保留的上下文**：用户偏好、特定领域的详细信息和做出的承诺

这种结构使 Claude 能够高效地恢复工作，而不会丢失重要上下文或重复错误。

<section title="查看完整默认提示">

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

#### 服务器端工具

<Warning>
使用服务器端工具（如[网络搜索](/docs/zh-CN/agents-and-tools/tool-use/web-search-tool)或[网络获取](/docs/zh-CN/agents-and-tools/tool-use/web-fetch-tool)）时，压缩需要特殊考虑。
</Warning>

使用服务器端工具时，SDK 可能会错误地计算令牌使用情况，导致压缩在错误的时间触发。

例如，在网络搜索操作后，API 响应可能显示：

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK 将总使用情况计算为 63,000 + 270,000 = 333,000 令牌。但是，`cache_read_input_tokens` 值包括服务器端工具进行的多个内部 API 调用的累积读取，而不是您的实际对话上下文。您的真实上下文长度可能只有 63,000 个 `input_tokens`，但 SDK 看到 333k 并过早触发压缩。

**解决方案：**

- 使用[令牌计数](/docs/zh-CN/build-with-claude/token-counting)端点获取准确的上下文长度
- 在广泛使用服务器端工具时避免压缩

#### 工具使用边界情况

当在工具使用响应待处理时触发压缩时，SDK 在生成摘要之前从消息历史中删除工具使用块。如果仍需要，Claude 将在从摘要恢复后重新发出工具调用。

### 限制

#### 服务器端工具

<Warning>
使用服务器端工具（如[网络搜索](/docs/zh-CN/agents-and-tools/tool-use/web-search-tool)或[网络获取](/docs/zh-CN/agents-and-tools/tool-use/web-fetch-tool)）时，压缩需要特殊考虑。
</Warning>

使用服务器端工具时，SDK 可能会错误地计算令牌使用情况，导致压缩在错误的时间触发。

例如，在网络搜索操作后，API 响应可能显示：

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK 将总使用情况计算为 63,000 + 270,000 = 333,000 令牌。但是，`cache_read_input_tokens` 值包括服务器端工具进行的多个内部 API 调用的累积读取，而不是您的实际对话上下文。您的真实上下文长度可能只有 63,000 个 `input_tokens`，但 SDK 看到 333k 并过早触发压缩。

**解决方案：**

- 使用[令牌计数](/docs/zh-CN/build-with-claude/token-counting)端点获取准确的上下文长度
- 在广泛使用服务器端工具时避免压缩

#### 工具使用边界情况

当在工具使用响应待处理时触发压缩时，SDK 在生成摘要之前从消息历史中删除工具使用块。如果仍需要，Claude 将在从摘要恢复后重新发出工具调用。

### 监控压缩

启用日志记录以跟踪压缩何时发生：

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

#### 服务器端工具

<Warning>
使用服务器端工具（如[网络搜索](/docs/zh-CN/agents-and-tools/tool-use/web-search-tool)或[网络获取](/docs/zh-CN/agents-and-tools/tool-use/web-fetch-tool)）时，压缩需要特殊考虑。
</Warning>

使用服务器端工具时，SDK 可能会错误地计算令牌使用情况，导致压缩在错误的时间触发。

例如，在网络搜索操作后，API 响应可能显示：

```json
{
  "usage": {
    "input_tokens": 63000,
    "cache_read_input_tokens": 270000,
    "output_tokens": 1400
  }
}
```

SDK 将总使用情况计算为 63,000 + 270,000 = 333,000 令牌。但是，`cache_read_input_tokens` 值包括服务器端工具进行的多个内部 API 调用的累积读取，而不是您的实际对话上下文。您的真实上下文长度可能只有 63,000 个 `input_tokens`，但 SDK 看到 333k 并过早触发压缩。

**解决方案：**

- 使用[令牌计数](/docs/zh-CN/build-with-claude/token-counting)端点获取准确的上下文长度
- 在广泛使用服务器端工具时避免压缩

#### 工具使用边界情况

当在工具使用响应待处理时触发压缩时，SDK 在生成摘要之前从消息历史中删除工具使用块。如果仍需要，Claude 将在从摘要恢复后重新发出工具调用。

### 监控压缩

启用日志记录以跟踪压缩何时发生：

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

### 何时使用压缩

**良好的用例：**

- 处理许多文件或数据源的长期运行代理任务
- 积累大量信息的研究工作流
- 具有明确、可测量进度的多步骤任务
- 生成在对话外持久存在的工件（文件、报告）的任务

**不太理想的用例：**

- 需要精确回忆早期对话细节的任务
- 广泛使用服务器端工具的工作流
- 需要在许多变量中维护精确状态的任务