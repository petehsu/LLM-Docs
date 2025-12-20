# Kilocode 配置

> 配置 Kilocode VSCode 扩展以使用 MegaLLM

Kilocode 是一个功能强大的 VSCode 扩展，提供 AI 驱动的代码补全、内联聊天和代码操作。配置它以使用 MegaLLM 访问多个 AI 模型。

## 快速配置

<Tabs>
  <Tab title="通过设置 UI">
    ### 分步设置

    <Steps>
      <Step title="打开 VSCode 设置">
        * 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
        * 输入：`Preferences: Open Settings (UI)`
        * 搜索：`Kilocode`
      </Step>

      <Step title="配置 API 提供商">
        * **API Provider**：选择 `Custom`
        * **Provider Name**：`MegaLLM`
        * **Base URL**：`https://ai.megallm.io/v1`
        * **API Key**：`sk-mega-your-api-key-here`
      </Step>

      <Step title="选择默认模型">
        * **Default Model**：`gpt-5`（或任何[支持的模型](/cn/home/models)）
        * **Temperature**：`0.3`（较低 = 更确定性）
        * **Max Tokens**：`500`（用于补全）
      </Step>

      <Step title="启用功能">
        * <Icon icon="check" /> **启用自动补全**
        * <Icon icon="check" /> **启用内联聊天**
        * <Icon icon="check" /> **启用代码操作**
        * <Icon icon="check" /> **启用建议**
      </Step>
    </Steps>
  </Tab>

  <Tab title="通过 settings.json">
    ### 配置文件

    **位置**：`.vscode/settings.json` 或 `~/.config/Code/User/settings.json`

    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-api-key-here"
      },
      "kilocode.defaultModel": "gpt-5",
      "kilocode.enableAutoComplete": true,
      "kilocode.enableInlineChat": true,
      "kilocode.enableCodeActions": true,
      "kilocode.modelSettings": {
        "temperature": 0.3,
        "maxTokens": 500,
        "topP": 0.9
      }
    }
    ```

    <Tip>
      您可以使用环境变量：`"apiKey": "${env:MEGALLM_API_KEY}"`
    </Tip>
  </Tab>

  <Tab title="使用环境变量">
    ### 安全配置

    **步骤 1**：设置环境变量

    ```bash  theme={null}
    # Add to ~/.bashrc, ~/.zshrc, or ~/.config/fish/config.fish
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"
    export MEGALLM_BASE_URL="https://ai.megallm.io/v1"
    ```

    **步骤 2**：重新加载 shell

    ```bash  theme={null}
    source ~/.bashrc  # 或 ~/.zshrc
    ```

    **步骤 3**：在 settings.json 中引用

    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "${env:MEGALLM_BASE_URL}",
        "apiKey": "${env:MEGALLM_API_KEY}"
      },
      "kilocode.defaultModel": "gpt-5"
    }
    ```

    <Icon icon="check" /> API 密钥保持安全且不在版本控制中
  </Tab>
</Tabs>

## 场景示例

### 场景 1：首次安装

从头开始完整设置：

<Steps>
  <Step title="安装 Kilocode 扩展">
    1. 打开 VSCode
    2. 转到扩展：`Ctrl+Shift+X` / `Cmd+Shift+X`
    3. 搜索：`Kilocode`
    4. 点击**安装**
    5. 重新加载 VSCode 窗口
  </Step>

  <Step title="获取 MegaLLM API 密钥">
    1. 访问 [MegaLLM 仪表板](https://megallm.io/dashboard)
    2. 导航到 **API Keys** 部分
    3. 点击**创建新密钥**
    4. 复制密钥（以 `sk-mega-` 开头）
    5. 安全存储
  </Step>

  <Step title="配置扩展">
    打开设置（`Ctrl+,` / `Cmd+,`）并添加：

    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-actual-key-here"
      },
      "kilocode.defaultModel": "gpt-5"
    }
    ```
  </Step>

  <Step title="测试配置">
    1. 创建新文件：`test.js`
    2. 输入注释：`// function to calculate fibonacci`
    3. 按 `Tab` 触发补全
    4. 应该看到 AI 生成的代码

    **预期结果：**

    ```javascript  theme={null}
    // function to calculate fibonacci
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
    ```
  </Step>
</Steps>

***

### 场景 2：团队项目配置

为整个开发团队设置 Kilocode：

**项目结构：**

```
my-project/
├── .vscode/
│   ├── settings.json          # 共享配置（提交）
│   └── settings.local.json    # 个人密钥（gitignored）
├── .gitignore
└── README.md
```

**步骤 1：创建共享配置**

`.vscode/settings.json`（提交到 git）：

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gpt-5",
  "kilocode.modelSettings": {
    "temperature": 0.7,
    "maxTokens": 1000
  },
  "kilocode.enableAutoComplete": true,
  "kilocode.enableInlineChat": true
}
```

**步骤 2：设置 .gitignore**

```bash  theme={null}
# .gitignore
.vscode/settings.local.json
.env
```

**步骤 3：创建设置说明**

`README.md`:

````markdown  theme={null}
## Kilocode 设置

### 前提条件
1. 安装了 Kilocode 扩展的 VSCode
2. MegaLLM API 密钥（[获取密钥](https://megallm.io/dashboard)）

### 配置

1. **设置环境变量：**
   ```bash
   export MEGALLM_API_KEY="your-key-here"
````

添加到您的 shell 配置（\~/.bashrc 或 \~/.zshrc）以持久化。

2. **或创建本地设置**（不提交）：

   `.vscode/settings.local.json`:

   ```json  theme={null}
   {
     "kilocode.customProvider": {
       "apiKey": "your-key-here"
     }
   }
   ```

3. **重新加载 VSCode** 并开始编码！

### 验证

输入 `// hello world function` 并按 Tab。
应该看到 AI 生成的代码。

````

**步骤 4：团队成员克隆和设置**

```bash
# 团队成员工作流
git clone https://github.com/company/my-project.git
cd my-project

# 添加个人 API 密钥
export MEGALLM_API_KEY="their-personal-key"

# 或使用他们的密钥创建 .vscode/settings.local.json

# 在 VSCode 中打开
code .
````

***

### 场景 3：项目特定模型选择

为不同项目使用不同模型：

**Python 数据科学项目：**

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "claude-opus-4-1-20250805",
  "kilocode.customPrompts": {
    "analyze": "分析此数据处理代码的效率",
    "doc": "为此函数生成 numpy 风格的文档字符串"
  }
}
```

**JavaScript/React 项目：**

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gpt-5",
  "kilocode.customPrompts": {
    "component": "生成 React 函数组件",
    "test": "为此组件编写 Jest 测试"
  }
}
```

**系统编程（Rust/Go）：**

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gemini-2.5-pro",
  "kilocode.modelSettings": {
    "temperature": 0.2  // 较低以获得更精确的系统代码
  }
}
```

***

### 场景 4：多模型工作流

根据任务动态切换模型：

**配置：**

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gpt-5",
  "kilocode.modelProfiles": {
    "fast": {
      "model": "gpt-4o-mini",
      "temperature": 0.5,
      "maxTokens": 300
    },
    "quality": {
      "model": "claude-opus-4-1-20250805",
      "temperature": 0.3,
      "maxTokens": 1000
    },
    "creative": {
      "model": "gpt-5",
      "temperature": 0.9,
      "maxTokens": 800
    }
  }
}
```

**用法：**

* **上午（快速原型）**：使用 `fast` 配置文件和 GPT-4o-mini
* **下午（高质量代码）**：使用 `quality` 配置文件和 Claude Opus
* **文档**：使用 `creative` 配置文件，温度较高

**通过命令面板切换配置文件：**

1. `Ctrl+Shift+P` / `Cmd+Shift+P`
2. `Kilocode: Switch Model Profile`
3. 选择：`fast`、`quality` 或 `creative`

***

### 场景 5：从 GitHub Copilot 迁移

从 Copilot 切换到 Kilocode 与 MegaLLM：

**当前设置（Copilot）：**

```json  theme={null}
{
  "github.copilot.enable": true
}
```

**新设置（Kilocode + MegaLLM）：**

<Steps>
  <Step title="禁用 Copilot">
    ```json  theme={null}
    {
      "github.copilot.enable": false
    }
    ```
  </Step>

  <Step title="安装 Kilocode">
    VSCode 扩展 → 搜索 "Kilocode" → 安装
  </Step>

  <Step title="配置 MegaLLM">
    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "${env:MEGALLM_API_KEY}"
      },
      "kilocode.defaultModel": "gpt-5"
    }
    ```
  </Step>

  <Step title="比较体验">
    **相比 Copilot 的优势：**

    * <Icon icon="check" /> 访问多个模型（GPT、Claude、Gemini）
    * <Icon icon="check" /> 更好的定价，无座位限制
    * <Icon icon="check" /> 用于解释的内联聊天
    * <Icon icon="check" /> 每个项目的自定义模型选择
    * <Icon icon="check" /> 超出补全的代码操作
  </Step>
</Steps>

## 配置选项

### 完整参考

```json  theme={null}
{
  // 提供商配置
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },

  // 模型设置
  "kilocode.defaultModel": "gpt-5",
  "kilocode.modelSettings": {
    "temperature": 0.3,        // 0.0-2.0：较低 = 更专注
    "maxTokens": 500,          // 最大补全长度
    "topP": 0.9,               // 核采样
    "frequencyPenalty": 0.0,   // 减少重复
    "presencePenalty": 0.0     // 鼓励多样性
  },

  // 功能切换
  "kilocode.enableAutoComplete": true,
  "kilocode.enableInlineChat": true,
  "kilocode.enableCodeActions": true,
  "kilocode.enableSuggestions": true,
  "kilocode.enableHover": true,

  // 行为
  "kilocode.autoTrigger": true,
  "kilocode.debounceDelay": 300,     // 触发前的毫秒数
  "kilocode.maxSuggestions": 3,
  "kilocode.showInlineHints": true,

  // 自定义提示
  "kilocode.customPrompts": {
    "doc": "生成全面的文档",
    "test": "编写高覆盖率的单元测试",
    "refactor": "重构以提高可维护性",
    "optimize": "优化性能",
    "secure": "审查安全漏洞"
  },

  // 键盘快捷键
  "kilocode.shortcuts": {
    "acceptSuggestion": "Tab",
    "nextSuggestion": "Alt+]",
    "prevSuggestion": "Alt+[",
    "dismissSuggestion": "Esc",
    "triggerInlineChat": "Ctrl+K"
  },

  // UI 首选项
  "kilocode.ui": {
    "showStatusBar": true,
    "showInlineButtons": true,
    "theme": "auto",               // auto, light, dark
    "position": "right"            // left, right
  }
}
```

### 模型选择指南

| 任务         | 推荐模型                       | 原因              |
| ---------- | -------------------------- | --------------- |
| **代码补全**   | `gpt-4o-mini`              | 快速、经济高效         |
| **复杂逻辑**   | `claude-opus-4-1-20250805` | 卓越推理            |
| **Web 开发** | `gpt-5`                    | 出色的 JS/TS/React |
| **数据科学**   | `claude-sonnet-4`          | 强大分析            |
| **文档**     | `gpt-5`                    | 清晰解释            |
| **算法**     | `gemini-2.5-pro`           | 数学精确性           |

查看[完整模型目录](/cn/home/models)了解所有选项。

## 验证

### 测试 1：基本补全

```javascript  theme={null}
// 输入此注释并按 Tab：
// function to check if string is palindrome

// 预期输出：
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}
```

### 测试 2：内联聊天

1. 选择一个函数
2. 按 `Ctrl+K`（或 Mac 上的 `Cmd+K`）
3. 输入：`解释此函数`
4. 应该在聊天面板中看到解释

### 测试 3：代码操作

1. 右键单击代码
2. 应在上下文菜单中看到 "Kilocode Actions"
3. 选项：解释、改进、生成测试等

### 测试 4：状态栏

检查 VSCode 右下角：

* 应显示：`Kilocode: Connected`
* 模型名称：`gpt-5`（或您选择的模型）
* 点击查看连接详情

## 故障排除

<AccordionGroup>
  <Accordion title="补全未出现">
    **症状：**

    * 输入时没有建议
    * 状态栏显示 "Disconnected"

    **解决方案：**

    1. **检查 API 密钥：**
       ```bash  theme={null}
       echo $MEGALLM_API_KEY
       # 应输出：sk-mega-...
       ```

    2. **验证配置：**
       ```json  theme={null}
       {
         "kilocode.apiProvider": "custom",  // 必须是 "custom"
         "kilocode.customProvider": {
           "baseURL": "https://ai.megallm.io/v1"  // 无尾部斜杠
         }
       }
       ```

    3. **重新加载 VSCode：**
       * `Ctrl+Shift+P` / `Cmd+Shift+P`
       * 运行：`Developer: Reload Window`

    4. **检查扩展是否启用：**
       * 扩展面板
       * 搜索：Kilocode
       * 应显示 "Enabled"

    5. **手动测试 API：**
       ```bash  theme={null}
       curl -X POST https://ai.megallm.io/v1/chat/completions \
         -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'
       ```
  </Accordion>

  <Accordion title="错误或低质量补全">
    **症状：**

    * 补全不正确
    * 建议不匹配代码风格
    * 不相关的响应

    **解决方案：**

    1. **调整温度：**
       ```json  theme={null}
       {
         "kilocode.modelSettings": {
           "temperature": 0.2  // 较低 = 更专注（0.0-1.0）
         }
       }
       ```

    2. **尝试不同模型：**
       ```json  theme={null}
       {
         "kilocode.defaultModel": "claude-sonnet-4"  // 更适合分析
       }
       ```

    3. **增加上下文：**
       ```json  theme={null}
       {
         "kilocode.modelSettings": {
           "maxTokens": 1000  // 更详细的补全
         }
       }
       ```

    4. **添加项目特定提示：**
       ```json  theme={null}
       {
         "kilocode.systemPrompt": "您是 TypeScript 和 React 专家。遵循 Airbnb 风格指南。"
       }
       ```
  </Accordion>

  <Accordion title="高延迟 / 慢速补全">
    **症状：**

    * 等待建议时间长
    * 超时错误

    **解决方案：**

    1. **使用更快的模型：**
       ```json  theme={null}
       {
         "kilocode.defaultModel": "gpt-4o-mini"  // 最快
       }
       ```

    2. **减少最大令牌数：**
       ```json  theme={null}
       {
         "kilocode.modelSettings": {
           "maxTokens": 300  // 更快的补全
         }
       }
       ```

    3. **增加防抖延迟：**
       ```json  theme={null}
       {
         "kilocode.debounceDelay": 500  // 触发前等待更长时间
       }
       ```

    4. **检查网络：**
       ```bash  theme={null}
       ping ai.megallm.io
       curl -w "@-" -o /dev/null -s https://ai.megallm.io/v1/models <<'EOF'
       time_total: %{time_total}s
       EOF
       ```
  </Accordion>

  <Accordion title="API 密钥未识别">
    **症状：**

    * "Invalid API key" 错误
    * 401 未授权

    **解决方案：**

    1. **验证密钥格式：**
       * 必须以 `sk-mega-` 开头
       * 至少 60 个字符
       * 无空格或引号

    2. **检查密钥是否活动：**
       * 登录[仪表板](https://megallm.io/dashboard)
       * 转到 API Keys
       * 验证密钥未被撤销/过期

    3. **直接测试密钥：**
       ```bash  theme={null}
       curl -H "Authorization: Bearer sk-mega-your-key" \
            https://ai.megallm.io/v1/models
       ```

    4. **如需要则重新生成：**
       * 仪表板 → API Keys → 创建新密钥
       * 使用新密钥更新配置
  </Accordion>

  <Accordion title="与其他扩展冲突">
    **症状：**

    * Kilocode 补全与其他 AI 工具冲突
    * 出现多个建议

    **解决方案：**

    1. **禁用冲突扩展：**
       ```json  theme={null}
       {
         "github.copilot.enable": false,
         "tabnine.disable": true,
         "aws.codeWhisperer.enabled": false
       }
       ```

    2. **调整触发键：**
       ```json  theme={null}
       {
         "kilocode.shortcuts": {
           "acceptSuggestion": "Alt+Enter"  // 不同于 Tab
         }
       }
       ```

    3. **设置优先级：**
       ```json  theme={null}
       {
         "editor.suggest.snippetsPreventQuickSuggestions": false,
         "editor.quickSuggestions": {
           "other": "on",
           "comments": "off",
           "strings": "on"
         }
       }
       ```
  </Accordion>
</AccordionGroup>

## 最佳实践

<CardGroup cols={2}>
  <Card title="使用环境变量" icon="key">
    将 API 密钥保存在环境变量中，使用 `${env:MEGALLM_API_KEY}` 引用
  </Card>

  <Card title="项目特定模型" icon="folder">
    在每个项目的 `.vscode/settings.json` 中配置不同模型
  </Card>

  <Card title="代码使用较低温度" icon="temperature-low">
    代码生成使用 0.2-0.4，文档使用 0.7-0.9
  </Card>

  <Card title="监控令牌使用" icon="chart-line">
    检查[仪表板](https://megallm.io/dashboard)以优化成本
  </Card>
</CardGroup>

## 高级技巧

### 自定义键盘快捷键

添加到 `keybindings.json`：

```json  theme={null}
[
  {
    "key": "ctrl+alt+k",
    "command": "kilocode.triggerSuggestion",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+alt+e",
    "command": "kilocode.explainCode",
    "when": "editorHasSelection"
  },
  {
    "key": "ctrl+alt+t",
    "command": "kilocode.generateTests",
    "when": "editorTextFocus"
  }
]
```

### 工作区特定提示

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.customPrompts": {
    "api": "按照我们的约定生成 RESTful API 端点",
    "schema": "创建 Prisma 架构模型",
    "hook": "生成 React 自定义钩子",
    "component": "使用 TypeScript 创建 styled-component"
  }
}
```

### 上下文感知补全

```json  theme={null}
{
  "kilocode.contextSettings": {
    "includeOpenFiles": true,
    "includeImports": true,
    "includeTypes": true,
    "maxContextFiles": 5
  }
}
```

## 下一步

<CardGroup cols={3}>
  <Card title="RooCode 设置" icon="robot" href="/cn/agents/roocode">
    配置 RooCode 应用程序
  </Card>

  <Card title="Cline 设置" icon="terminal" href="/cn/agents/cline">
    配置 Cline VSCode 扩展
  </Card>

  <Card title="模型目录" icon="layer-group" href="/cn/home/models">
    浏览所有可用模型
  </Card>

  <Card title="其他代理" icon="window" href="/cn/agents/overview">
    查看所有 CLI 和 GUI 代理
  </Card>

  <Card title="API 参考" icon="book" href="/cn/api-reference/introduction">
    探索 API 文档
  </Card>

  <Card title="Discord 社区" icon="discord" href="https://discord.gg/devsindia">
    加入获取支持
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt