# 迁移到 Claude 4.5

了解如何从 Claude Sonnet 3.7 和 Claude Haiku 3.5 迁移到 Claude 4.5 模型，包括分步说明和重大变更。

---

本指南涵盖了迁移到 Claude 4.5 模型的两个关键迁移路径：

- **Claude Sonnet 3.7 → Claude Sonnet 4.5**：我们最智能的模型，具有同类最佳的推理、编码和长期运行代理功能
- **Claude Haiku 3.5 → Claude Haiku 4.5**：我们最快且最智能的 Haiku 模型，为实时应用和大容量智能处理提供接近前沿的性能

两种迁移都涉及需要更新实现的重大变更。本指南将通过分步说明和清晰标记的重大变更来指导您完成每个迁移路径。

在开始迁移之前，我们建议您查看 [Claude 4.5 的新增功能](/docs/zh-CN/about-claude/models/whats-new-claude-4-5)，以了解这些模型中可用的新功能和能力，包括扩展思考、上下文感知和行为改进。

## 从 Claude Sonnet 3.7 迁移到 Claude Sonnet 4.5

Claude Sonnet 4.5 是我们最智能的模型，为推理、编码和长期运行的自主代理提供同类最佳的性能。此迁移包括几个需要更新实现的重大变更。

### 迁移步骤

1. **更新您的模型名称：**
   ```python
   # 之前 (Claude Sonnet 3.7)
   model="claude-3-7-sonnet-20250219"

   # 之后 (Claude Sonnet 4.5)
   model="claude-sonnet-4-5-20250929"
   ```

2. **更新采样参数**

   <Warning>
   这是从 Claude Sonnet 3.7 的重大变更。
   </Warning>

   仅使用 `temperature` 或 `top_p`，不能同时使用两者：

   ```python
   # 之前 (Claude Sonnet 3.7) - 这将在 Sonnet 4.5 中出错
   response = client.messages.create(
       model="claude-3-7-sonnet-20250219",
       temperature=0.7,
       top_p=0.9,  # 不能同时使用
       ...
   )

   # 之后 (Claude Sonnet 4.5)
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       temperature=0.7,  # 使用 temperature 或 top_p，不能同时使用
       ...
   )
   ```

3. **处理新的 `refusal` 停止原因**

   更新您的应用程序以 [处理 `refusal` 停止原因](/docs/zh-CN/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)：

   ```python
   response = client.messages.create(...)

   if response.stop_reason == "refusal":
       # 适当处理拒绝
       pass
   ```

4. **更新文本编辑器工具（如果适用）**

   <Warning>
   这是从 Claude Sonnet 3.7 的重大变更。
   </Warning>

   更新到 `text_editor_20250728`（类型）和 `str_replace_based_edit_tool`（名称）。删除任何使用 `undo_edit` 命令的代码。
   
   ```python
   # 之前 (Claude Sonnet 3.7)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # 之后 (Claude Sonnet 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   有关详细信息，请参阅 [文本编辑器工具文档](/docs/zh-CN/agents-and-tools/tool-use/text-editor-tool)。

5. **更新代码执行工具（如果适用）**

   升级到 `code_execution_20250825`。旧版本 `code_execution_20250522` 仍然有效，但不推荐使用。有关迁移说明，请参阅 [代码执行工具文档](/docs/zh-CN/agents-and-tools/tool-use/code-execution-tool#upgrade-to-latest-tool-version)。

6. **删除令牌高效工具使用 beta 标头**

   令牌高效工具使用是仅适用于 Claude 3.7 Sonnet 的 beta 功能。所有 Claude 4 模型都内置了令牌高效工具使用，因此您不应再包含 beta 标头。

   从您的请求中删除 `token-efficient-tools-2025-02-19` [beta 标头](/docs/zh-CN/api/beta-headers)：

   ```python
   # 之前 (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["token-efficient-tools-2025-02-19"],  # 删除此项
       ...
   )

   # 之后 (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # 没有令牌高效工具 beta 标头
       ...
   )
   ```

7. **删除扩展输出 beta 标头**

   用于扩展输出的 `output-128k-2025-02-19` [beta 标头](/docs/zh-CN/api/beta-headers) 仅在 Claude Sonnet 3.7 中可用。

   从您的请求中删除此标头：

   ```python
   # 之前 (Claude Sonnet 3.7)
   client.messages.create(
       model="claude-3-7-sonnet-20250219",
       betas=["output-128k-2025-02-19"],  # 删除此项
       ...
   )

   # 之后 (Claude Sonnet 4.5)
   client.messages.create(
       model="claude-sonnet-4-5-20250929",
       # 没有 output-128k beta 标头
       ...
   )
   ```

8. **更新您的提示以适应行为变化**

   Claude Sonnet 4.5 具有更简洁、直接的通信风格，需要明确的指导。查看 [Claude 4 提示工程最佳实践](/docs/zh-CN/build-with-claude/prompt-engineering/claude-4-best-practices) 以获取优化指导。

9. **考虑为复杂任务启用扩展思考**

   为编码和推理任务启用 [扩展思考](/docs/zh-CN/build-with-claude/extended-thinking) 以获得显著的性能改进（默认禁用）：

   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5-20250929",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 10000},
       messages=[...]
   )
   ```

   <Note>
   扩展思考会影响 [提示缓存](/docs/zh-CN/build-with-claude/prompt-caching#caching-with-thinking-blocks) 效率。
   </Note>

10. **测试您的实现**

   在部署到生产环境之前，在开发环境中进行测试，以确保所有重大变更都得到正确处理。

### Sonnet 3.7 → 4.5 迁移清单

- [ ] 将模型 ID 更新为 `claude-sonnet-4-5-20250929`
- [ ] **重大变更**：更新采样参数以仅使用 `temperature` 或 `top_p`，不能同时使用
- [ ] 在您的应用程序中处理新的 `refusal` 停止原因
- [ ] **重大变更**：将文本编辑器工具更新为 `text_editor_20250728` 和 `str_replace_based_edit_tool`（如果适用）
- [ ] **重大变更**：删除任何使用 `undo_edit` 命令的代码（如果适用）
- [ ] 将代码执行工具更新为 `code_execution_20250825`（如果适用）
- [ ] 删除 `token-efficient-tools-2025-02-19` beta 标头（如果适用）
- [ ] 删除 `output-128k-2025-02-19` beta 标头（如果适用）
- [ ] 按照 [Claude 4 最佳实践](/docs/zh-CN/build-with-claude/prompt-engineering/claude-4-best-practices) 审查和更新提示
- [ ] 考虑为复杂推理任务启用扩展思考
- [ ] 处理 `model_context_window_exceeded` 停止原因（Sonnet 4.5 特定）
- [ ] 考虑为长期运行的代理启用内存工具（beta）
- [ ] 考虑使用自动工具调用清除进行上下文编辑（beta）
- [ ] 在生产部署前在开发环境中进行测试

### 从 Claude Sonnet 3.7 中删除的功能

- **令牌高效工具使用**：`token-efficient-tools-2025-02-19` beta 标头仅适用于 Claude 3.7 Sonnet，在 Claude 4 模型中不受支持（参见步骤 6）
- **扩展输出**：`output-128k-2025-02-19` beta 标头不受支持（参见步骤 7）

两个标头都可以包含在 Claude 4 请求中，但不会产生任何效果。

## 从 Claude Haiku 3.5 迁移到 Claude Haiku 4.5

Claude Haiku 4.5 是我们最快且最智能的 Haiku 模型，具有接近前沿的性能，为交互式应用和大容量智能处理提供高级模型质量和实时性能。此迁移包括几个需要更新实现的重大变更。

有关新功能的完整概述，请参阅 [Claude 4.5 的新增功能](/docs/zh-CN/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5)。

<Note>
Haiku 4.5 定价为每百万输入令牌 $1，每百万输出令牌 $5。有关详细信息，请参阅 [Claude 定价](/docs/zh-CN/about-claude/pricing)。
</Note>

### 迁移步骤

1. **更新您的模型名称：**
   ```python
   # 之前 (Haiku 3.5)
   model="claude-3-5-haiku-20241022"

   # 之后 (Haiku 4.5)
   model="claude-haiku-4-5-20251001"
   ```

2. **更新工具版本（如果适用）**

   <Warning>
   这是从 Claude Haiku 3.5 的重大变更。
   </Warning>

   Haiku 4.5 仅支持最新的工具版本：

   ```python
   # 之前 (Haiku 3.5)
   tools=[{"type": "text_editor_20250124", "name": "str_replace_editor"}]

   # 之后 (Haiku 4.5)
   tools=[{"type": "text_editor_20250728", "name": "str_replace_based_edit_tool"}]
   ```

   - **文本编辑器**：使用 `text_editor_20250728` 和 `str_replace_based_edit_tool`
   - **代码执行**：使用 `code_execution_20250825`
   - 删除任何使用 `undo_edit` 命令的代码

3. **更新采样参数**

   <Warning>
   这是从 Claude Haiku 3.5 的重大变更。
   </Warning>

   仅使用 `temperature` 或 `top_p`，不能同时使用两者：

   ```python
   # 之前 (Haiku 3.5) - 这将在 Haiku 4.5 中出错
   response = client.messages.create(
       model="claude-3-5-haiku-20241022",
       temperature=0.7,
       top_p=0.9,  # 不能同时使用
       ...
   )

   # 之后 (Haiku 4.5)
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       temperature=0.7,  # 使用 temperature 或 top_p，不能同时使用
       ...
   )
   ```

4. **审查新的速率限制**

   Haiku 4.5 与 Haiku 3.5 有不同的速率限制。有关详细信息，请参阅 [速率限制文档](/docs/zh-CN/api/rate-limits)。

5. **处理新的 `refusal` 停止原因**

   更新您的应用程序以 [处理拒绝停止原因](/docs/zh-CN/test-and-evaluate/strengthen-guardrails/handle-streaming-refusals)。

6. **考虑为复杂任务启用扩展思考**

   为编码和推理任务启用 [扩展思考](/docs/zh-CN/build-with-claude/extended-thinking) 以获得显著的性能改进（默认禁用）：

   ```python
   response = client.messages.create(
       model="claude-haiku-4-5-20251001",
       max_tokens=16000,
       thinking={"type": "enabled", "budget_tokens": 5000},
       messages=[...]
   )
   ```
   <Note>
   扩展思考会影响 [提示缓存](/docs/zh-CN/build-with-claude/prompt-caching#caching-with-thinking-blocks) 效率。
   </Note>

7. **探索新功能**

   有关上下文感知、增加的输出容量（64K 令牌）、更高的智能和改进的速度的详细信息，请参阅 [Claude 4.5 的新增功能](/docs/zh-CN/about-claude/models/whats-new-claude-4-5#key-improvements-in-haiku-4-5-over-haiku-3-5)。

8. **测试您的实现**

   在部署到生产环境之前，在开发环境中进行测试，以确保所有重大变更都得到正确处理。

### Haiku 3.5 → 4.5 迁移清单

- [ ] 将模型 ID 更新为 `claude-haiku-4-5-20251001`
- [ ] **重大变更**：将工具版本更新为最新版本（例如 `text_editor_20250728`、`code_execution_20250825`）- 不支持旧版本
- [ ] **重大变更**：删除任何使用 `undo_edit` 命令的代码（如果适用）
- [ ] **重大变更**：更新采样参数以仅使用 `temperature` 或 `top_p`，不能同时使用
- [ ] 审查并调整新的速率限制（与 Haiku 3.5 分开）
- [ ] 在您的应用程序中处理新的 `refusal` 停止原因
- [ ] 考虑为复杂推理任务启用扩展思考（新功能）
- [ ] 利用上下文感知在长期会话中更好地管理令牌
- [ ] 为更大的响应做准备（最大输出从 8K 增加到 64K 令牌）
- [ ] 按照 [Claude 4 最佳实践](/docs/zh-CN/build-with-claude/prompt-engineering/claude-4-best-practices) 审查和更新提示
- [ ] 在生产部署前在开发环境中进行测试

## 在 Sonnet 4.5 和 Haiku 4.5 之间选择

Claude Sonnet 4.5 和 Claude Haiku 4.5 都是强大的 Claude 4 模型，具有不同的优势：

### 为以下情况选择 Claude Sonnet 4.5（最智能）：

- **复杂推理和分析**：用于复杂任务的同类最佳智能
- **长期运行的自主代理**：为独立工作较长时间的代理提供卓越性能
- **高级编码任务**：我们最强大的编码模型，具有高级规划和安全工程
- **大型上下文工作流**：通过内存工具和上下文编辑功能增强上下文管理
- **需要最大能力的任务**：当智能和准确性是首要优先事项时

### 为以下情况选择 Claude Haiku 4.5（最快且最智能的 Haiku）：

- **实时应用**：为具有接近前沿性能的交互式用户体验提供快速响应时间
- **大容量智能处理**：以改进的速度大规模提供具有成本效益的智能
- **成本敏感的部署**：以较低价格点提供接近前沿的性能
- **子代理架构**：用于多代理系统的快速、智能代理
- **大规模计算机使用**：具有成本效益的自主桌面和浏览器自动化
- **需要速度的任务**：当低延迟至关重要，同时保持接近前沿的智能时

### 扩展思考建议

Claude 4 模型，特别是 Sonnet 和 Haiku 4.5，在使用 [扩展思考](/docs/zh-CN/build-with-claude/extended-thinking) 进行编码和复杂推理任务时显示出显著的性能改进。扩展思考**默认禁用**，但我们建议为要求苛刻的工作启用它。

**重要**：扩展思考会影响 [提示缓存](/docs/zh-CN/build-with-claude/prompt-caching#caching-with-thinking-blocks) 效率。当非工具结果内容添加到对话时，思考块会从缓存中删除，这可能会增加多轮对话中的成本。我们建议在性能优势超过缓存权衡时启用思考。

## 其他迁移场景

上面涵盖的主要迁移路径（Sonnet 3.7 → 4.5 和 Haiku 3.5 → 4.5）代表最常见的升级。但是，您可能正在从其他 Claude 模型迁移到 Claude 4.5。本部分涵盖这些场景。

### 从 Claude Sonnet 4 → Sonnet 4.5 迁移

**重大变更**：不能在同一请求中同时指定 `temperature` 和 `top_p`。

所有其他 API 调用将无需修改即可工作。更新您的模型 ID 并根据需要调整采样参数：

```python
# 之前 (Claude Sonnet 4)
model="claude-sonnet-4-20250514"

# 之后 (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

### 从 Claude Opus 4.1 → Sonnet 4.5 迁移

**无重大变更。** 所有 API 调用将无需修改即可工作。

只需更新您的模型 ID：

```python
# 之前 (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# 之后 (Claude Sonnet 4.5)
model="claude-sonnet-4-5-20250929"
```

Claude Sonnet 4.5 是我们最智能的模型，具有同类最佳的推理、编码和长期运行代理功能。对于大多数用例，它相比 Opus 4.1 提供卓越的性能。

### 从 Claude Opus 4.1 → Opus 4.5 迁移

**无重大变更。** 所有 API 调用将无需修改即可工作。

只需更新您的模型 ID：

```python
# 之前 (Claude Opus 4.1)
model="claude-opus-4-1-20250805"

# 之后 (Claude Opus 4.5)
model="claude-opus-4-5-20251101"
```

Claude Opus 4.5 是我们最智能的模型，结合了最大能力和实际性能。它在视觉、编码和计算机使用方面具有阶跃式改进，价格点比 Opus 4.1 更易于接受。非常适合复杂的专业任务和专业软件工程。

<Note>
对于具有许多模型引用的代码库，可以使用 [Claude Code 插件](https://github.com/anthropics/claude-code/tree/main/plugins/claude-opus-4-5-migration) 来自动化迁移到 Opus 4.5。
</Note>

### 在 Claude 4.5 模型之间迁移

**无重大变更。** 所有 API 调用将无需修改即可工作。

只需更新您的模型 ID。

## 需要帮助？

- 查看我们的 [API 文档](/docs/zh-CN/api/overview) 以获取详细规范
- 查看 [模型功能](/docs/zh-CN/about-claude/models/overview) 以进行性能比较
- 查看 [API 发布说明](/docs/zh-CN/release-notes/api) 以了解 API 更新
- 如果在迁移过程中遇到任何问题，请联系支持