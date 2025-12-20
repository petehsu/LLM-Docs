# 计算机使用工具

Claude 可以通过计算机使用工具与计算机环境交互，该工具提供截图功能和鼠标/键盘控制，用于自主桌面交互。

---

Claude 可以通过计算机使用工具与计算机环境交互，该工具提供截图功能和鼠标/键盘控制，用于自主桌面交互。

<Note>
计算机使用目前处于测试版阶段，需要一个[测试版标头](/docs/zh-CN/api/beta-headers)：
- `"computer-use-2025-11-24"` 用于 Claude Opus 4.5
- `"computer-use-2025-01-24"` 用于 Claude Sonnet 4.5、Haiku 4.5、Opus 4.1、Sonnet 4、Opus 4 和 Sonnet 3.7（[已弃用](/docs/zh-CN/about-claude/model-deprecations)）
</Note>

## 概述

计算机使用是一项测试版功能，使 Claude 能够与桌面环境交互。此工具提供：

- **截图捕获**：查看当前屏幕上显示的内容
- **鼠标控制**：点击、拖动和移动光标
- **键盘输入**：输入文本和使用键盘快捷键
- **桌面自动化**：与任何应用程序或界面交互

虽然计算机使用可以与 bash 和文本编辑器等其他工具结合使用，以实现更全面的自动化工作流，但计算机使用特别指的是计算机使用工具查看和控制桌面环境的能力。

## 模型兼容性

计算机使用适用于以下 Claude 模型：

| 模型 | 工具版本 | 测试版标志 |
|-------|--------------|-----------|
| Claude Opus 4.5 | `computer_20251124` | `computer-use-2025-11-24` |
| 所有其他支持的模型 | `computer_20250124` | `computer-use-2025-01-24` |

<Note>
Claude Opus 4.5 引入了 `computer_20251124` 工具版本，具有新功能，包括用于详细屏幕区域检查的缩放操作。所有其他模型（Sonnet 4.5、Haiku 4.5、Sonnet 4、Opus 4、Opus 4.1 和 Sonnet 3.7）使用 `computer_20250124` 工具版本。
</Note>

<Warning>
较旧的工具版本不保证与较新的模型向后兼容。始终使用与您的模型版本相对应的工具版本。
</Warning>

## 安全考虑

<Warning>
计算机使用是一项测试版功能，具有与标准 API 功能不同的独特风险。与互联网交互时，这些风险会增加。为了最小化风险，请考虑采取以下预防措施：

1. 使用具有最小权限的专用虚拟机或容器，以防止直接系统攻击或意外。
2. 避免让模型访问敏感数据，例如账户登录信息，以防止信息盗窃。
3. 将互联网访问限制在域名白名单中，以减少暴露于恶意内容的风险。
4. 要求人类确认可能导致有意义的现实世界后果的决定，以及任何需要肯定同意的任务，例如接受 cookie、执行财务交易或同意服务条款。

在某些情况下，Claude 会遵循内容中找到的命令，即使这与用户的指示相冲突。例如，网页上或图像中包含的 Claude 指示可能会覆盖指示或导致 Claude 犯错。我们建议采取预防措施将 Claude 与敏感数据和操作隔离，以避免与提示注入相关的风险。

我们已经训练了该模型以抵抗这些提示注入，并添加了额外的防御层。如果您使用我们的计算机使用工具，我们将自动在您的提示上运行分类器，以标记潜在的提示注入实例。当这些分类器在屏幕截图中识别出潜在的提示注入时，它们将自动引导模型在继续下一个操作之前要求用户确认。我们认识到这种额外的保护不会适合每个用例（例如，没有人在循环中的用例），所以如果您想选择退出并关闭它，请[联系我们](https://support.claude.com/en/)。

我们仍然建议采取预防措施将 Claude 与敏感数据和操作隔离，以避免与提示注入相关的风险。

最后，请在您自己的产品中启用计算机使用之前，向最终用户告知相关风险并获得他们的同意。

</Warning>

<Card
  title="计算机使用参考实现"
  icon="computer"
  href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
>

通过我们的计算机使用参考实现快速入门，其中包括 Web 界面、Docker 容器、示例工具实现和代理循环。

**注意：** 该实现已更新，包括 Claude 4 模型和 Claude Sonnet 3.7 的新工具。请确保拉取最新版本的仓库以访问这些新功能。

</Card>

<Tip>
  请使用[此表单](https://forms.gle/BT1hpBrqDPDUrCqo7)提供关于模型响应质量、API 本身或文档质量的反馈 - 我们迫不及待地想听到您的意见！
</Tip>

## 快速开始

以下是如何开始使用计算机使用工具的方法：

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",  # 或另一个兼容的模型
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
仅计算机使用工具需要测试版标头。

上面的示例显示了所有三个工具一起使用，这需要测试版标头，因为它包括计算机使用工具。
</Note>

---

## 计算机使用如何工作

<Steps>
  <Step
    title="1. 为 Claude 提供计算机使用工具和用户提示"
    icon="tool"
  >
    - 将计算机使用工具（以及可选的其他工具）添加到您的 API 请求中。
    - 包括需要桌面交互的用户提示，例如"将猫的图片保存到我的桌面"。
  </Step>
  <Step title="2. Claude 决定使用计算机使用工具" icon="wrench">
    - Claude 评估计算机使用工具是否可以帮助用户的查询。
    - 如果是，Claude 构造一个格式正确的工具使用请求。
    - API 响应的 `stop_reason` 为 `tool_use`，表示 Claude 的意图。
  </Step>
  <Step
    title="3. 提取工具输入，在计算机上评估工具，并返回结果"
    icon="computer"
  >
    - 在您的一端，从 Claude 的请求中提取工具名称和输入。
    - 在容器或虚拟机上使用该工具。
    - 继续对话，使用包含 `tool_result` 内容块的新 `user` 消息。
  </Step>
  <Step
    title="4. Claude 继续调用计算机使用工具，直到完成任务"
    icon="arrows-clockwise"
  >
    - Claude 分析工具结果，以确定是否需要更多工具使用或任务已完成。
    - 如果 Claude 决定需要另一个工具，它会以另一个 `tool_use` `stop_reason` 响应，您应该返回第 3 步。
    - 否则，它会为用户制作文本响应。
  </Step>
</Steps>

我们将第 3 步和第 4 步在没有用户输入的情况下的重复称为"代理循环" - 即 Claude 响应工具使用请求，您的应用程序用评估该请求的结果响应 Claude。

### 计算环境

计算机使用需要一个沙箱计算环境，Claude 可以在其中安全地与应用程序和网络交互。此环境包括：

1. **虚拟显示**：一个虚拟 X11 显示服务器（使用 Xvfb），它呈现 Claude 将通过屏幕截图看到的桌面界面，并使用鼠标/键盘操作进行控制。

2. **桌面环境**：在 Linux 上运行的轻量级 UI，具有窗口管理器（Mutter）和面板（Tint2），为 Claude 提供一致的图形界面来交互。

3. **应用程序**：预安装的 Linux 应用程序，如 Firefox、LibreOffice、文本编辑器和文件管理器，Claude 可以使用这些应用程序来完成任务。

4. **工具实现**：集成代码，将 Claude 的抽象工具请求（如"移动鼠标"或"截图"）转换为虚拟环境中的实际操作。

5. **代理循环**：一个程序，处理 Claude 和环境之间的通信，将 Claude 的操作发送到环境，并将结果（屏幕截图、命令输出）返回给 Claude。

当您使用计算机使用时，Claude 不会直接连接到此环境。相反，您的应用程序：

1. 接收 Claude 的工具使用请求
2. 将它们转换为计算环境中的操作
3. 捕获结果（屏幕截图、命令输出等）
4. 将这些结果返回给 Claude

为了安全和隔离，参考实现在 Docker 容器内运行所有这些，具有适当的端口映射，用于查看和与环境交互。

---

## 如何实现计算机使用

### 从我们的参考实现开始

我们已经构建了一个[参考实现](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)，其中包含快速开始计算机使用所需的一切：

- 一个[容器化环境](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/Dockerfile)，适合与 Claude 一起使用计算机使用
- [计算机使用工具](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo/computer_use_demo/tools)的实现
- 一个[代理循环](https://github.com/anthropics/anthropic-quickstarts/blob/main/computer-use-demo/computer_use_demo/loop.py)，与 Claude API 交互并执行计算机使用工具
- 一个 Web 界面，用于与容器、代理循环和工具交互。

### 理解多代理循环

计算机使用的核心是"代理循环" - 一个循环，其中 Claude 请求工具操作，您的应用程序执行它们，并将结果返回给 Claude。这是一个简化的示例：

```python
async def sampling_loop(
    *,
    model: str,
    messages: list[dict],
    api_key: str,
    max_tokens: int = 4096,
    tool_version: str,
    thinking_budget: int | None = None,
    max_iterations: int = 10,  # 添加迭代限制以防止无限循环
):
    """
    Claude 计算机使用交互的简单代理循环。

    此函数处理以下之间的来回：
    1. 向 Claude 发送用户消息
    2. Claude 请求使用工具
    3. 您的应用程序执行这些工具
    4. 将工具结果发送回 Claude
    """
    # 设置工具和 API 参数
    client = Anthropic(api_key=api_key)
    beta_flag = "computer-use-2025-01-24" if "20250124" in tool_version else "computer-use-2024-10-22"

    # 配置工具 - 您应该已经在其他地方初始化了这些工具
    tools = [
        {"type": f"computer_{tool_version}", "name": "computer", "display_width_px": 1024, "display_height_px": 768},
        {"type": f"text_editor_{tool_version}", "name": "str_replace_editor"},
        {"type": f"bash_{tool_version}", "name": "bash"}
    ]

    # 主代理循环（具有迭代限制以防止失控的 API 成本）
    iterations = 0
    while True and iterations < max_iterations:
        iterations += 1
        # 设置可选的思考参数（用于 Claude Sonnet 3.7）
        thinking = None
        if thinking_budget:
            thinking = {"type": "enabled", "budget_tokens": thinking_budget}

        # 调用 Claude API
        response = client.beta.messages.create(
            model=model,
            max_tokens=max_tokens,
            messages=messages,
            tools=tools,
            betas=[beta_flag],
            thinking=thinking
        )

        # 将 Claude 的响应添加到对话历史记录
        response_content = response.content
        messages.append({"role": "assistant", "content": response_content})

        # 检查 Claude 是否使用了任何工具
        tool_results = []
        for block in response_content:
            if block.type == "tool_use":
                # 在真实应用程序中，您将在此处执行工具
                # 例如：result = run_tool(block.name, block.input)
                result = {"result": "Tool executed successfully"}

                # 为 Claude 格式化结果
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # 如果没有使用工具，Claude 已完成 - 返回最终消息
        if not tool_results:
            return messages

        # 将工具结果添加到消息中，以供下一次 Claude 迭代使用
        messages.append({"role": "user", "content": tool_results})
```

循环继续，直到 Claude 响应而不请求任何工具（任务完成）或达到最大迭代限制。此保护措施防止可能导致意外 API 成本的潜在无限循环。

我们建议在阅读本文档的其余部分之前尝试参考实现。

### 通过提示优化模型性能

以下是一些关于如何获得最佳质量输出的提示：

1. 指定简单、明确定义的任务，并为每个步骤提供明确的指示。
2. Claude 有时会假设其操作的结果而不显式检查它们。为了防止这种情况，您可以使用以下提示提示 Claude：`在每个步骤之后，截图并仔细评估您是否已实现正确的结果。明确显示您的思考："我已评估步骤 X..."。如果不正确，请重试。只有当您确认步骤已正确执行时，才应继续下一步。`
3. 某些 UI 元素（如下拉菜单和滚动条）可能很难让 Claude 使用鼠标移动来操纵。如果您遇到这种情况，请尝试提示模型使用键盘快捷键。
4. 对于可重复的任务或 UI 交互，在您的提示中包括成功结果的示例屏幕截图和工具调用。
5. 如果您需要模型登录，请在您的提示中使用 xml 标签（如 `<robot_credentials>`）为其提供用户名和密码。在需要登录的应用程序中使用计算机使用会增加由于提示注入而导致不良结果的风险。请在向模型提供登录凭据之前查看我们的[关于缓解提示注入的指南](/docs/zh-CN/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks)。

<Tip>
  如果您反复遇到一组明确的问题，或者提前知道 Claude 需要完成的任务，请使用系统提示为 Claude 提供明确的提示或说明，说明如何成功完成任务。
</Tip>

### 系统提示

当通过 Claude API 请求 Anthropic 定义的工具之一时，会生成计算机使用特定的系统提示。它类似于[工具使用系统提示](/docs/zh-CN/agents-and-tools/tool-use/implement-tool-use#tool-use-system-prompt)，但以以下内容开头：

> 您可以访问一组函数来回答用户的问题。这包括访问沙箱计算环境。您目前没有能力检查文件或与外部资源交互，除非通过调用以下函数。

与常规工具使用一样，用户提供的 `system_prompt` 字段仍然受到尊重并用于构造组合系统提示。

### 可用操作

计算机使用工具支持这些操作：

**基本操作（所有版本）**
- **screenshot** - 捕获当前显示
- **left_click** - 在坐标 `[x, y]` 处点击
- **type** - 输入文本字符串
- **key** - 按键或键组合（例如"ctrl+s"）
- **mouse_move** - 将光标移动到坐标

**增强操作（`computer_20250124`）**
在 Claude 4 模型和 Claude Sonnet 3.7 中可用：
- **scroll** - 在任何方向滚动，具有数量控制
- **left_click_drag** - 在坐标之间点击并拖动
- **right_click**、**middle_click** - 其他鼠标按钮
- **double_click**、**triple_click** - 多次点击
- **left_mouse_down**、**left_mouse_up** - 细粒度点击控制
- **hold_key** - 在执行其他操作时按住键
- **wait** - 在操作之间暂停

**增强操作（`computer_20251124`）**
在 Claude Opus 4.5 中可用：
- `computer_20250124` 中的所有操作
- **zoom** - 以全分辨率查看屏幕的特定区域。需要在工具定义中设置 `enable_zoom: true`。采用 `region` 参数，其中坐标 `[x1, y1, x2, y2]` 定义要检查的区域的左上角和右下角。

<section title="示例操作">

```json
// 截图
{
  "action": "screenshot"
}

// 在位置点击
{
  "action": "left_click",
  "coordinate": [500, 300]
}

// 输入文本
{
  "action": "type",
  "text": "Hello, world!"
}

// 向下滚动（Claude 4/3.7）
{
  "action": "scroll",
  "coordinate": [500, 400],
  "scroll_direction": "down",
  "scroll_amount": 3
}

// 缩放以详细查看区域（Opus 4.5）
{
  "action": "zoom",
  "region": [100, 200, 400, 350]
}
```

</section>

### 工具参数

| 参数 | 必需 | 描述 |
|-----------|----------|-------------|
| `type` | 是 | 工具版本（`computer_20251124`、`computer_20250124` 或 `computer_20241022`） |
| `name` | 是 | 必须是"computer" |
| `display_width_px` | 是 | 显示宽度（像素） |
| `display_height_px` | 是 | 显示高度（像素） |
| `display_number` | 否 | X11 环境的显示编号 |
| `enable_zoom` | 否 | 启用缩放操作（仅 `computer_20251124`）。设置为 `true` 以允许 Claude 缩放到特定屏幕区域。默认值：`false` |

<Note>
**重要**：计算机使用工具必须由您的应用程序显式执行 - Claude 无法直接执行它。您负责根据 Claude 的请求实现屏幕截图捕获、鼠标移动、键盘输入和其他操作。
</Note>

### 在 Claude 4 模型和 Claude Sonnet 3.7 中启用思考能力

Claude Sonnet 3.7 引入了一项新的"思考"能力，允许您在模型处理复杂任务时看到其推理过程。此功能可帮助您了解 Claude 如何处理问题，对于调试或教育目的特别有价值。

要启用思考，请将 `thinking` 参数添加到您的 API 请求中：

```json
"thinking": {
  "type": "enabled",
  "budget_tokens": 1024
}
```

`budget_tokens` 参数指定 Claude 可以用于思考的令牌数。这从您的总体 `max_tokens` 预算中扣除。

启用思考后，Claude 将返回其推理过程作为响应的一部分，这可以帮助您：

1. 了解模型的决策过程
2. 识别潜在的问题或误解
3. 从 Claude 的问题解决方法中学习
4. 获得对复杂多步骤操作的更多可见性

以下是思考输出可能看起来像什么的示例：

```
[思考]
我需要将猫的图片保存到桌面。让我将其分解为步骤：

1. 首先，我将截图以查看桌面上的内容
2. 然后我将寻找网络浏览器来搜索猫的图像
3. 找到合适的图像后，我需要将其保存到桌面

让我首先截图以查看可用的内容...
```

### 使用其他工具增强计算机使用

计算机使用工具可以与其他工具结合，以创建更强大的自动化工作流。当您需要以下情况时，这特别有用：
- 执行系统命令（[bash 工具](/docs/zh-CN/agents-and-tools/tool-use/bash-tool)）
- 编辑配置文件或脚本（[文本编辑器工具](/docs/zh-CN/agents-and-tools/tool-use/text-editor-tool)）
- 与自定义 API 或服务集成（自定义工具）

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

### 构建自定义计算机使用环境

[参考实现](https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo)旨在帮助您开始使用计算机使用功能。它包含了让 Claude 使用计算机所需的所有组件。但是，您可以构建自己的计算机使用环境来满足您的需求。您需要：

- 适合与 Claude 进行计算机使用的虚拟化或容器化环境
- 至少实现一个 Anthropic 定义的计算机使用工具
- 与 Claude API 交互并使用您的工具实现执行 `tool_use` 结果的代理循环
- 允许用户输入以启动代理循环的 API 或 UI

#### 实现计算机使用工具

计算机使用工具实现为无模式工具。使用此工具时，您不需要像其他工具那样提供输入模式；该模式内置于 Claude 的模型中，无法修改。

<Steps>
  <Step title="设置您的计算环境">
    创建虚拟显示或连接到 Claude 将与之交互的现有显示。这通常涉及设置 Xvfb（X 虚拟帧缓冲）或类似技术。
  </Step>
  <Step title="实现操作处理程序">
    创建函数来处理 Claude 可能请求的每种操作类型：
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
  <Step title="处理 Claude 的工具调用">
    从 Claude 的响应中提取并执行工具调用：
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
  <Step title="实现代理循环">
    创建一个循环，直到 Claude 完成任务：
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

#### 处理错误

实现计算机使用工具时，可能会发生各种错误。以下是处理方法：

<section title="屏幕截图捕获失败">

如果屏幕截图捕获失败，返回适当的错误消息：

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

<section title="无效坐标">

如果 Claude 提供的坐标超出显示边界：

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

<section title="操作执行失败">

如果操作执行失败：

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

#### 处理更高分辨率的坐标缩放

API 将图像限制为最长边最多 1568 像素，总共约 1.15 兆像素（有关详细信息，请参阅[图像调整大小](/docs/zh-CN/build-with-claude/vision#evaluate-image-size)）。例如，1512x982 屏幕被下采样到约 1330x864。Claude 分析这个较小的图像并返回该空间中的坐标，但您的工具在原始屏幕空间中执行点击。

除非您处理坐标转换，否则这可能导致 Claude 的点击坐标错过其目标。

要解决此问题，请自己调整屏幕截图大小并将 Claude 的坐标缩放回来：

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

#### 遵循实现最佳实践

<section title="使用适当的显示分辨率">

设置与您的用例相匹配的显示尺寸，同时保持在推荐限制内：
- 对于一般桌面任务：1024x768 或 1280x720
- 对于网络应用程序：1280x800 或 1366x768
- 避免使用高于 1920x1080 的分辨率以防止性能问题

</section>

<section title="实现适当的屏幕截图处理">

将屏幕截图返回给 Claude 时：
- 将屏幕截图编码为 base64 PNG 或 JPEG
- 考虑压缩大型屏幕截图以提高性能
- 包含相关元数据，如时间戳或显示状态
- 如果使用更高的分辨率，请确保坐标准确缩放

</section>

<section title="添加操作延迟">

某些应用程序需要时间来响应操作：
```python
def click_and_wait(x, y, wait_time=0.5):
    click_at(x, y)
    time.sleep(wait_time)  # Allow UI to update
```

</section>

<section title="在执行前验证操作">

检查请求的操作是否安全且有效：
```python
def validate_action(action_type, params):
    if action_type == "left_click":
        x, y = params.get("coordinate", (0, 0))
        if not (0 <= x < display_width and 0 <= y < display_height):
            return False, "Coordinates out of bounds"
    return True, None
```

</section>

<section title="记录操作以进行调试">

保留所有操作的日志以进行故障排除：
```python
import logging

def log_action(action_type, params, result):
    logging.info(f"Action: {action_type}, Params: {params}, Result: {result}")
```

</section>

---

## 了解计算机使用限制

计算机使用功能处于测试阶段。虽然 Claude 的功能处于最前沿，但开发人员应该了解其限制：

1. **延迟**：当前人工智能交互的计算机使用延迟可能与常规人工指导的计算机操作相比太慢。我们建议在受信任的环境中专注于速度不是关键的用例（例如，后台信息收集、自动化软件测试）。
2. **计算机视觉准确性和可靠性**：Claude 在生成操作时输出特定坐标时可能会犯错或产生幻觉。Claude Sonnet 3.7 引入了思考能力，可以帮助您理解模型的推理并识别潜在问题。
3. **工具选择准确性和可靠性**：Claude 在生成操作时选择工具时可能会犯错或产生幻觉，或采取意外操作来解决问题。此外，在与利基应用程序或多个应用程序同时交互时，可靠性可能较低。我们建议用户在请求复杂任务时仔细提示模型。
4. **滚动可靠性**：Claude Sonnet 3.7 引入了具有方向控制的专用滚动操作，提高了可靠性。该模型现在可以显式地按指定数量向任何方向（上/下/左/右）滚动。
5. **电子表格交互**：Claude Sonnet 3.7 通过添加更精确的鼠标控制操作（如 `left_mouse_down`、`left_mouse_up` 和新的修饰键支持）改进了电子表格交互的鼠标点击。通过使用这些细粒度控制并将修饰键与点击结合，单元格选择可以更可靠。
6. **社交和通信平台上的账户创建和内容生成**：虽然 Claude 会访问网站，但我们限制其在社交媒体网站和平台上创建账户或生成和共享内容或以其他方式进行人类模拟的能力。我们可能在未来更新此功能。
7. **漏洞**：越狱或提示注入等漏洞可能在包括测试版计算机使用 API 在内的前沿 AI 系统中持续存在。在某些情况下，Claude 会遵循在内容中找到的命令，有时甚至与用户的指示相冲突。例如，网页上或图像中包含的 Claude 指示可能会覆盖指示或导致 Claude 犯错。我们建议：
   a. 将计算机使用限制在受信任的环境中，例如具有最小权限的虚拟机或容器
   b. 避免在没有严格监督的情况下向计算机使用访问敏感账户或数据
   c. 在您的应用程序中启用或请求计算机使用功能所需的权限之前，告知最终用户相关风险并获得他们的同意
8. **不当或非法操作**：根据 Anthropic 的服务条款，您不得使用计算机使用来违反任何法律或我们的可接受使用政策。

始终仔细审查和验证 Claude 的计算机使用操作和日志。不要在没有人工监督的情况下将 Claude 用于需要完美精度或敏感用户信息的任务。

---

## 定价

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

## 后续步骤

<CardGroup cols={2}>
  <Card
    title="参考实现"
    icon="github-logo"
    href="https://github.com/anthropics/anthropic-quickstarts/tree/main/computer-use-demo"
  >
    使用我们完整的基于 Docker 的实现快速入门
  </Card>
  <Card
    title="工具文档"
    icon="tool"
    href="/docs/zh-CN/agents-and-tools/tool-use/overview"
  >
    了解有关工具使用和创建自定义工具的更多信息
  </Card>
</CardGroup>