# Claude 4.5 中的新功能

了解 Claude 4.5 中引入的三个新模型及其关键改进、新 API 功能和定价信息。

---

Claude 4.5 引入了三个为不同用例设计的模型：

- **Claude Opus 4.5**：我们最智能的模型，结合了最大能力和实际性能。与之前的 Opus 模型相比，价格更易接受。提供 200k 令牌上下文窗口。
- **Claude Sonnet 4.5**：我们最适合复杂代理和编码的模型，在大多数任务中具有最高的智能。提供 200k 和 1M（测试版）令牌上下文窗口。
- **Claude Haiku 4.5**：我们最快且最智能的 Haiku 模型，具有接近前沿的性能。提供 200k 令牌上下文窗口。

## Opus 4.5 相比 Opus 4.1 的关键改进

### 最大智能

Claude Opus 4.5 代表了我们最智能的模型，结合了最大能力和实际性能。它在推理、编码和复杂问题解决任务中提供了阶跃式改进，同时保持了 Opus 系列所期望的高质量输出。

### 努力参数

Claude Opus 4.5 是唯一支持[努力参数](/docs/zh-CN/build-with-claude/effort)的模型，允许您控制 Claude 在响应时使用多少令牌。这使您能够在响应的彻底性和令牌效率之间进行权衡，只需使用一个模型。

努力参数影响响应中的所有令牌，包括文本响应、工具调用和扩展思考。您可以选择：
- **高努力**：用于复杂分析和详细解释的最大彻底性
- **中等努力**：适用于大多数生产用例的平衡方法
- **低努力**：用于高容量自动化的最令牌高效的响应

### 计算机使用卓越性

Claude Opus 4.5 引入了[增强的计算机使用功能](/docs/zh-CN/agents-and-tools/tool-use/computer-use-tool)，具有新的缩放操作，可以以全分辨率详细检查特定屏幕区域。这使 Claude 能够检查细粒度的 UI 元素、小文本和详细的视觉信息，这些信息在标准屏幕截图中可能不清楚。

缩放功能特别适用于：
- 检查小型 UI 元素和控件
- 阅读小字体或详细文本
- 分析具有密集信息的复杂界面
- 在采取行动前验证精确的视觉细节

### 实际性能

Claude Opus 4.5 以[更易接受的价格点](/docs/zh-CN/about-claude/pricing)提供旗舰级智能，相比之前的 Opus 模型，使先进的 AI 能力可用于更广泛的应用和用例。

### 思考块保留

Claude Opus 4.5 [自动保留整个对话中的所有先前思考块](/docs/zh-CN/build-with-claude/extended-thinking#thinking-block-preservation-in-claude-opus-4-5)，在扩展的多轮交互和工具使用会话中保持推理连续性。这确保 Claude 在处理复杂的长期运行任务时能够有效地利用其完整的推理历史。

## Sonnet 4.5 相比 Sonnet 4 的关键改进

### 编码卓越性

Claude Sonnet 4.5 是我们迄今为止最好的编码模型，在整个开发生命周期中有显著改进：

- **SWE-bench 验证性能**：编码基准上的先进最先进技术
- **增强的规划和系统设计**：更好的架构决策和代码组织
- **改进的安全工程**：更强大的安全实践和漏洞检测
- **更好的指令遵循**：更精确地遵循编码规范和要求

<Note>
当[扩展思考](/docs/zh-CN/build-with-claude/extended-thinking)启用时，Claude Sonnet 4.5 在编码任务上的表现明显更好。扩展思考默认禁用，但我们建议为复杂编码工作启用它。请注意，扩展思考会影响[提示缓存效率](/docs/zh-CN/build-with-claude/prompt-caching#caching-with-thinking-blocks)。有关配置详情，请参阅[迁移指南](/docs/zh-CN/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations)。
</Note>

### 代理功能

Claude Sonnet 4.5 在代理功能中引入了重大进展：

- **扩展自主操作**：Sonnet 4.5 可以独立工作数小时，同时保持对增量进展的清晰关注。该模型在几个任务上稳步取得进展，而不是试图一次完成所有任务。它提供基于事实的进度更新，准确反映已完成的工作。
- **上下文感知**：Claude 现在在整个对话中跟踪其令牌使用情况，在每次工具调用后接收更新。这种感知有助于防止过早任务放弃，并在长期运行任务上实现更有效的执行。有关技术详情，请参阅[上下文感知](/docs/zh-CN/build-with-claude/context-windows#context-awareness-in-claude-sonnet-4-5)，以及[提示指导](/docs/zh-CN/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows)。
- **增强的工具使用**：该模型更有效地使用并行工具调用，在研究期间同时启动多个推测性搜索，并一次读取多个文件以更快地构建上下文。跨多个工具和信息源的改进协调使模型能够在代理搜索和编码工作流中有效地利用广泛的功能。
- **高级上下文管理**：Sonnet 4.5 在外部文件中保持异常的状态跟踪，在会话中保持目标导向。结合更有效的上下文窗口使用和我们新的上下文管理 API 功能，该模型最优地处理扩展会话中的信息，以保持长期的连贯性。

<Note>上下文感知在 Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1 和 Opus 4.5 中可用。</Note>

### 通信和交互风格

Claude Sonnet 4.5 具有精炼的通信方法，简洁、直接且自然。它提供基于事实的进度更新，可能在工具调用后跳过冗长的摘要以保持工作流动力（尽管这可以通过提示调整）。

有关使用此通信风格的详细指导，请参阅 [Claude 4 最佳实践](/docs/zh-CN/build-with-claude/prompt-engineering/claude-4-best-practices)。

### 创意内容生成

Claude Sonnet 4.5 在创意内容任务中表现出色：

- **演示文稿和动画**：在创建幻灯片和视觉内容方面与 Claude Opus 4.1 和 Opus 4.5 相匹配或超越
- **创意风格**：生成具有强大指令遵循的精美、专业输出
- **首次质量**：在初始尝试中生成可用的、设计精良的内容

## Haiku 4.5 相比 Haiku 3.5 的关键改进

Claude Haiku 4.5 代表了 Haiku 模型系列的变革性飞跃，为我们最快的模型类别带来了前沿功能：

### 接近前沿的智能与闪电般的速度

Claude Haiku 4.5 以显著更低的成本和更快的速度提供与 Sonnet 4 相匹配的接近前沿的性能：

- **接近前沿的智能**：在推理、编码和复杂任务中与 Sonnet 4 性能相匹配
- **增强的速度**：比 Sonnet 4 快两倍多，针对输出令牌每秒（OTPS）进行了优化
- **最优成本性能**：以三分之一的成本实现接近前沿的智能，非常适合大容量部署

### 扩展思考功能

Claude Haiku 4.5 是**第一个支持扩展思考的 Haiku 模型**，为 Haiku 系列带来了高级推理功能：

- **速度推理**：访问 Claude 的内部推理过程以解决复杂问题
- **思考总结**：为生产就绪部署总结思考输出
- **交错思考**：在工具调用之间思考，以实现更复杂的多步工作流
- **预算控制**：配置思考令牌预算以平衡推理深度和速度

扩展思考必须通过向 API 请求添加 `thinking` 参数来显式启用。有关实现详情，请参阅[扩展思考文档](/docs/zh-CN/build-with-claude/extended-thinking)。

<Note>
当[扩展思考](/docs/zh-CN/build-with-claude/extended-thinking)启用时，Claude Haiku 4.5 在编码和推理任务上的表现明显更好。扩展思考默认禁用，但我们建议为复杂问题解决、编码工作和多步推理启用它。请注意，扩展思考会影响[提示缓存效率](/docs/zh-CN/build-with-claude/prompt-caching#caching-with-thinking-blocks)。有关配置详情，请参阅[迁移指南](/docs/zh-CN/about-claude/models/migrating-to-claude-4#extended-thinking-recommendations)。
</Note>

<Note>在 Claude Sonnet 3.7、Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1 和 Opus 4.5 中可用。</Note>

### 上下文感知

Claude Haiku 4.5 具有**上下文感知**功能，使模型能够在整个对话中跟踪其剩余上下文窗口：

- **令牌预算跟踪**：Claude 在每次工具调用后接收关于剩余上下文容量的实时更新
- **更好的任务持久性**：该模型可以通过理解可用的工作空间来更有效地执行任务
- **多上下文窗口工作流**：改进了跨扩展会话的状态转换处理

这是第一个具有原生上下文感知功能的 Haiku 模型。有关提示指导，请参阅 [Claude 4 最佳实践](/docs/zh-CN/build-with-claude/prompt-engineering/claude-4-best-practices#context-awareness-and-multi-window-workflows)。

<Note>在 Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1 和 Opus 4.5 中可用。</Note>

### 强大的编码和工具使用

Claude Haiku 4.5 提供了现代 Claude 模型所期望的强大编码功能：

- **编码能力**：在代码生成、调试和重构任务中的强大性能
- **完整工具支持**：与所有 Claude 4 工具兼容，包括 bash、代码执行、文本编辑器、网络搜索和计算机使用
- **增强的计算机使用**：针对自主桌面交互和浏览器自动化工作流进行了优化
- **并行工具执行**：跨多个工具的高效协调以实现复杂工作流

Haiku 4.5 为需要智能和效率的用例而设计：

- **实时应用**：为交互式用户体验提供快速响应时间
- **高容量处理**：用于大规模部署的成本有效的智能
- **免费层实现**：以易接近的价格提供高级模型质量
- **子代理架构**：用于多代理系统的快速、智能代理
- **大规模计算机使用**：成本有效的自主桌面和浏览器自动化

## 新 API 功能

### 程序化工具调用（测试版）

[程序化工具调用](/docs/zh-CN/agents-and-tools/tool-use/programmatic-tool-calling)允许 Claude 在代码执行容器中以编程方式编写调用您的工具的代码，而不是为每个工具调用都需要通过模型的往返。这显著降低了多工具工作流的延迟，并通过允许 Claude 在数据到达模型的上下文窗口之前过滤或处理数据来减少令牌消耗。

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute a SQL query against the sales database. Returns a list of rows as JSON objects.",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

关键优势：
- **降低延迟**：消除工具调用之间的模型往返
- **令牌效率**：在返回给 Claude 之前以编程方式处理和过滤工具结果
- **复杂工作流**：支持循环、条件逻辑和批处理

<Note>在 Claude Opus 4.5 和 Claude Sonnet 4.5 中可用。需要[测试版标头](/docs/zh-CN/api/beta-headers)：`advanced-tool-use-2025-11-20`</Note>

### 工具搜索工具（测试版）

[工具搜索工具](/docs/zh-CN/agents-and-tools/tool-use/tool-search-tool)使 Claude 能够通过动态发现和按需加载工具来处理数百或数千个工具。Claude 搜索您的工具目录并仅加载它需要的工具，而不是将所有工具定义预先加载到上下文窗口中。

有两种搜索变体可用：
- **正则表达式** (`tool_search_tool_regex_20251119`)：Claude 构造正则表达式模式来搜索工具名称、描述和参数
- **BM25** (`tool_search_tool_bm25_20251119`)：Claude 使用自然语言查询来搜索工具

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get the weather at a specific location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand via search
    }
]
```

这种方法解决了两个关键挑战：
- **上下文效率**：通过不预先加载所有工具定义来节省 10-20K 令牌
- **工具选择准确性**：即使有 100+ 个可用工具，也能保持高准确性

<Note>在 Claude Opus 4.5 和 Claude Sonnet 4.5 中可用。需要[测试版标头](/docs/zh-CN/api/beta-headers)：`advanced-tool-use-2025-11-20`</Note>

### 努力参数（测试版）

[努力参数](/docs/zh-CN/build-with-claude/effort)允许您控制 Claude 在响应时使用多少令牌，在响应的彻底性和令牌效率之间进行权衡：

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

努力参数影响响应中的所有令牌，包括文本响应、工具调用和扩展思考。较低的努力级别会产生更简洁的响应，最少的解释，而较高的努力提供详细的推理和全面的答案。

<Note>仅在 Claude Opus 4.5 中可用。需要[测试版标头](/docs/zh-CN/api/beta-headers)：`effort-2025-11-24`</Note>

### 工具使用示例（测试版）

[工具使用示例](/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use#providing-tool-use-examples)允许您提供有效工具输入的具体示例，以帮助 Claude 更有效地理解如何使用您的工具。这对于具有嵌套对象、可选参数或格式敏感输入的复杂工具特别有用。

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "input_schema": {...},
        "input_examples": [
            {
                "location": "San Francisco, CA",
                "unit": "fahrenheit"
            },
            {
                "location": "Tokyo, Japan",
                "unit": "celsius"
            },
            {
                "location": "New York, NY"  # Demonstrates optional 'unit' parameter
            }
        ]
    }
]
```

示例包含在提示中，与您的工具架构一起，向 Claude 展示格式良好的工具调用的具体模式。每个示例必须根据工具的 `input_schema` 有效。

<Note>在 Claude Sonnet 4.5、Haiku 4.5、Opus 4.5、Opus 4.1 和 Opus 4 中可用。需要[测试版标头](/docs/zh-CN/api/beta-headers)：`advanced-tool-use-2025-11-20`。</Note>

### 内存工具（测试版）

新的[内存工具](/docs/zh-CN/agents-and-tools/tool-use/memory-tool)使 Claude 能够在上下文窗口外存储和检索信息：

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

这允许：
- 随时间构建知识库
- 跨会话维护项目状态
- 通过基于文件的存储保留有效的无限上下文

<Note>在 Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1 和 Opus 4.5 中可用。需要[测试版标头](/docs/zh-CN/api/beta-headers)：`context-management-2025-06-27`</Note>

### 上下文编辑

使用[上下文编辑](/docs/zh-CN/build-with-claude/context-editing)通过自动工具调用清除进行智能上下文管理：

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",  # or claude-haiku-4-5
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

此功能在接近令牌限制时自动删除较旧的工具调用和结果，帮助在长期运行的代理会话中管理上下文。

<Note>在 Claude Sonnet 4、Sonnet 4.5、Haiku 4.5、Opus 4、Opus 4.1 和 Opus 4.5 中可用。需要[测试版标头](/docs/zh-CN/api/beta-headers)：`context-management-2025-06-27`</Note>

### 增强的停止原因

Claude 4.5 模型引入了新的 `model_context_window_exceeded` 停止原因，明确指示生成何时因达到上下文窗口限制而停止，而不是请求的 `max_tokens` 限制。这使得在应用程序逻辑中更容易处理上下文窗口限制。

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

### 改进的工具参数处理

Claude 4.5 模型包含一个错误修复，保留了工具调用字符串参数中的有意格式。以前，字符串参数中的尾随换行符有时会被错误地剥离。此修复确保需要精确格式的工具（如文本编辑器）接收完全按预期的参数。

<Note>
这是一个幕后改进，不需要 API 更改。但是，具有字符串参数的工具现在可能会接收以前被剥离的尾随换行符的值。
</Note>

**示例：**

```json
// 之前：最后的换行符意外被剥离
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit"
  }
}

// 之后：尾随换行符按预期保留
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "edit_todo",
  "input": {
    "file": "todo.txt",
    "contents": "1. Chop onions.\n2. ???\n3. Profit\n"
  }
}
```

### 令牌计数优化

Claude 4.5 模型包含自动优化以改进模型性能。这些优化可能会向请求添加少量令牌，但**您不会为这些系统添加的令牌付费**。

## Claude 4 中引入的功能

以下功能在 Claude 4 中引入，在所有 Claude 4 模型中可用，包括 Claude Sonnet 4.5 和 Claude Haiku 4.5。

### 新的拒绝停止原因

Claude 4 模型为模型因安全原因拒绝生成的内容引入了新的 `refusal` 停止原因：

```json
{
  "id": "msg_014XEDjypDjFzgKVWdFUXxZP",
  "type": "message",
  "role": "assistant",
  "model": "claude-sonnet-4-5",
  "content": [{"type": "text", "text": "I would be happy to assist you. You can "}],
  "stop_reason": "refusal",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 564,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 22
  }
}
```

使用 Claude 4 模型时，您应该更新应用程序以[处理 `refusal` 停止原因](/docs/zh-CN/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)。

### 总结思考

启用扩展思考后，Claude 4 模型的消息 API 返回 Claude 完整思考过程的摘要。总结思考提供了扩展思考的全部智能优势，同时防止了滥用。

虽然 API 在 Claude 3.7 和 4 模型中是一致的，但扩展思考的流式响应可能以"分块"交付模式返回，流式事件之间可能有延迟。

<Note>
总结由与您在请求中针对的模型不同的模型处理。思考模型看不到总结的输出。
</Note>

有关更多信息，请参阅[扩展思考文档](/docs/zh-CN/build-with-claude/extended-thinking#summarized-thinking)。

### 交错思考

Claude 4 模型支持将工具使用与扩展思考交错，允许更自然的对话，其中工具使用和响应可以与常规消息混合。

<Note>
交错思考处于测试版。要启用交错思考，请将[测试版标头](/docs/zh-CN/api/beta-headers) `interleaved-thinking-2025-05-14` 添加到您的 API 请求。
</Note>

有关更多信息，请参阅[扩展思考文档](/docs/zh-CN/build-with-claude/extended-thinking#interleaved-thinking)。

### 行为差异

Claude 4 模型有可能影响您如何构建提示的显著行为变化：

#### 通信风格变化

- **更简洁和直接**：Claude 4 模型通信更高效，解释不那么冗长
- **更自然的语气**：响应略微更具对话性，不那么像机器
- **效率导向**：可能在完成操作后跳过详细摘要以保持工作流动力（如果需要，您可以提示获取更多详情）

#### 指令遵循

Claude 4 模型针对精确指令遵循进行了训练，需要更明确的方向：

- **明确关于操作**：如果您想让 Claude 采取行动，请使用"进行这些更改"或"实现此功能"之类的直接语言，而不是"您能建议更改吗"
- **清楚地说明所需的行为**：Claude 将精确遵循指令，因此具体说明您想要的内容有助于获得更好的结果

有关使用这些模型的全面指导，请参阅 [Claude 4 提示工程最佳实践](/docs/zh-CN/build-with-claude/prompt-engineering/claude-4-best-practices)。

### 更新的文本编辑器工具

文本编辑器工具已针对 Claude 4 模型进行了更新，具有以下更改：

- **工具类型**：`text_editor_20250728`
- **工具名称**：`str_replace_based_edit_tool`
- 不再支持 `undo_edit` 命令

<Note>
对于 Claude Sonnet 3.7，`str_replace_editor` 文本编辑器工具保持不变。
</Note>

如果您从 Claude Sonnet 3.7 迁移并使用文本编辑器工具：

```python
# Claude Sonnet 3.7
tools=[
    {
        "type": "text_editor_20250124",
        "name": "str_replace_editor"
    }
]

# Claude 4 models
tools=[
    {
        "type": "text_editor_20250728",
        "name": "str_replace_based_edit_tool"
    }
]
```

有关更多信息，请参阅[文本编辑器工具文档](/docs/zh-CN/agents-and-tools/tool-use/text-editor-tool)。

### 更新的代码执行工具

如果您使用代码执行工具，请确保您使用最新版本 `code_execution_20250825`，它添加了 Bash 命令和文件操作功能。

旧版本 `code_execution_20250522`（仅 Python）仍然可用，但不建议用于新实现。

有关迁移说明，请参阅[代码执行工具文档](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version)。

## 定价和可用性

### 定价

Claude 4.5 模型保持竞争性定价：

| 模型 | 输入 | 输出 |
|-------|-------|--------|
| Claude Opus 4.5 | 每百万令牌 $5 | 每百万令牌 $25 |
| Claude Sonnet 4.5 | 每百万令牌 $3 | 每百万令牌 $15 |
| Claude Haiku 4.5 | 每百万令牌 $1 | 每百万令牌 $5 |

有关更多详情，请参阅[定价文档](/docs/zh-CN/about-claude/pricing)。

### 第三方平台定价

从 Claude 4.5 模型（Opus 4.5、Sonnet 4.5 和 Haiku 4.5）开始，AWS Bedrock 和 Google Vertex AI 提供两种端点类型：

- **全局端点**：用于最大可用性的动态路由
- **区域端点**：通过特定地理区域保证数据路由，具有**10% 的定价溢价**

**此区域定价适用于所有 Claude 4.5 模型：Opus 4.5、Sonnet 4.5 和 Haiku 4.5。**

**Claude API（1P）默认是全局的，不受此更改影响。** Claude API 是全局唯一的（相当于其他提供商的全局端点提供和定价）。

有关实现详情和迁移指导：
- [AWS Bedrock 全局与区域端点](/docs/zh-CN/build-with-claude/claude-on-amazon-bedrock#global-vs-regional-endpoints)
- [Google Vertex AI 全局与区域端点](/docs/zh-CN/build-with-claude/claude-on-vertex-ai#global-vs-regional-endpoints)

### 可用性

Claude 4.5 模型在以下平台上可用：

| 模型 | Claude API | Amazon Bedrock | Google Cloud Vertex AI |
|-------|-----------|----------------|------------------------|
| Claude Opus 4.5 | `claude-opus-4-5-20251101` | `anthropic.claude-opus-4-5-20251101-v1:0` | `claude-opus-4-5@20251101` |
| Claude Sonnet 4.5 | `claude-sonnet-4-5-20250929` | `anthropic.claude-sonnet-4-5-20250929-v1:0` | `claude-sonnet-4-5@20250929` |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | `anthropic.claude-haiku-4-5-20251001-v1:0` | `claude-haiku-4-5@20251001` |

也可通过 Claude.ai 和 Claude Code 平台获得。

## 迁移指南

破坏性更改和迁移要求因您升级的模型而异。有关详细的迁移说明，包括分步指南、破坏性更改和迁移清单，请参阅[迁移到 Claude 4.5](/docs/zh-CN/about-claude/models/migrating-to-claude-4)。

迁移指南涵盖以下场景：
- **Claude Sonnet 3.7 → Sonnet 4.5**：具有破坏性更改的完整迁移路径
- **Claude Haiku 3.5 → Haiku 4.5**：具有破坏性更改的完整迁移路径
- **Claude Sonnet 4 → Sonnet 4.5**：最少更改的快速升级
- **Claude Opus 4.1 → Sonnet 4.5**：无破坏性更改的无缝升级
- **Claude Opus 4.1 → Opus 4.5**：无破坏性更改的无缝升级
- **Claude Opus 4.5 → Sonnet 4.5**：无破坏性更改的无缝降级

## 后续步骤

<CardGroup cols={3}>
  <Card title="最佳实践" icon="lightbulb" href="/docs/zh-CN/build-with-claude/prompt-engineering/claude-4-best-practices">
    学习 Claude 4.5 模型的提示工程技术
  </Card>
  <Card title="模型概览" icon="table" href="/docs/zh-CN/about-claude/models/overview">
    将 Claude 4.5 模型与其他 Claude 模型进行比较
  </Card>
  <Card title="迁移指南" icon="arrow-right-arrow-left" href="/docs/zh-CN/about-claude/models/migrating-to-claude-4">
    从以前的模型升级
  </Card>
</CardGroup>