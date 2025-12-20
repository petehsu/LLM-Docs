# RooCode 配置

> 配置 RooCode 独立应用程序以使用 MegaLLM

RooCode 是一个功能强大的独立 AI 编程助手应用程序,具有交互式聊天界面、代码审查功能和多文件编辑能力。配置它以使用 MegaLLM 来访问多个 AI 模型。

## 快速配置

<Tabs>
  <Tab title="通过应用程序设置">
    ### 分步设置

    <Steps>
      <Step title="打开 RooCode 设置">
        * 启动 RooCode 应用程序
        * 点击齿轮图标 ⚙️(左下角)
        * 导航至:`设置 → API 配置`
      </Step>

      <Step title="选择提供商类型">
        * **提供商类型**:选择 `OpenAI Compatible`
        * 这将启用自定义基础 URL 配置
        * 允许 MegaLLM 集成
      </Step>

      <Step title="配置 API 端点">
        * **基础 URL**:`https://ai.megallm.io/v1`
        * **API 密钥**:`sk-mega-your-api-key-here`
        * **组织**:留空(非必需)
        * 点击 **保存**
      </Step>

      <Step title="选择默认模型">
        * **默认模型**:`gpt-5`
        * **备用模型**:`gpt-4o`(可选)
        * **温度**:`0.7`(平衡创造力)
        * **最大令牌数**:`4096`
      </Step>

      <Step title="启用功能">
        * <Icon icon="check" /> **代码补全**
        * <Icon icon="check" /> **聊天界面**
        * <Icon icon="check" /> **代码审查**
        * <Icon icon="check" /> **重构助手**
        * <Icon icon="check" /> **多文件编辑**
      </Step>
    </Steps>
  </Tab>

  <Tab title="通过配置文件">
    ### 直接编辑文件

    **配置文件位置:**

    <CodeGroup>
      ```bash Windows theme={null}
      %APPDATA%\RooCode\config.json
      # 完整路径: C:\Users\YourName\AppData\Roaming\RooCode\config.json
      ```

      ```bash macOS theme={null}
      ~/Library/Application Support/RooCode/config.json
      ```

      ```bash Linux theme={null}
      ~/.config/RooCode/config.json
      ```
    </CodeGroup>

    **配置内容:**

    ```json  theme={null}
    {
      "provider": "openai-compatible",
      "api": {
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-api-key-here",
        "organization": "",
        "model": "gpt-5",
        "temperature": 0.7,
        "maxTokens": 4096
      },
      "features": {
        "codeCompletion": true,
        "chatInterface": true,
        "codeReview": true,
        "refactoring": true,
        "multiFileEdit": true
      },
      "ui": {
        "theme": "dark",
        "showInlineHints": true,
        "autoSaveChats": true,
        "fontSize": 14
      }
    }
    ```

    <Warning>
      编辑配置文件后,请重启 RooCode 以使更改生效。
    </Warning>
  </Tab>

  <Tab title="导入配置">
    ### 导入预制配置

    **步骤 1**:创建 `roocode-megallm-config.json`

    ```json  theme={null}
    {
      "provider": "openai-compatible",
      "api": {
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "REPLACE_WITH_YOUR_KEY",
        "model": "gpt-5"
      },
      "features": {
        "codeCompletion": true,
        "chatInterface": true,
        "codeReview": true,
        "refactoring": true
      }
    }
    ```

    **步骤 2**:在 RooCode 中导入

    1. 打开 RooCode
    2. 转到:`文件 → 导入配置`
    3. 选择您的 `roocode-megallm-config.json`
    4. 将 `REPLACE_WITH_YOUR_KEY` 替换为实际的 API 密钥
    5. 点击 **应用**
    6. 重启 RooCode

    <Icon icon="check" /> 配置导入成功!
  </Tab>
</Tabs>

## 场景示例

### 场景 1:首次安装

从下载到首次使用的完整设置:

<Steps>
  <Step title="下载并安装 RooCode">
    1. 访问 [RooCode.io](https://roocode.io)(示例 URL)
    2. 为您的操作系统下载(Windows/macOS/Linux)
    3. 安装应用程序
    4. 启动 RooCode
  </Step>

  <Step title="获取 MegaLLM API 密钥">
    1. 访问 [MegaLLM 控制台](https://megallm.io/dashboard)
    2. 注册或登录
    3. 导航至 **API 密钥** 部分
    4. 点击 **创建新密钥**
    5. 复制密钥(以 `sk-mega-` 开头)
  </Step>

  <Step title="配置 API 提供商">
    在 RooCode 中:

    1. 点击 ⚙️ 设置图标
    2. 转到 **API 配置**
    3. 选择 **提供商**:`OpenAI Compatible`
    4. 输入 **基础 URL**:`https://ai.megallm.io/v1`
    5. 粘贴 **API 密钥**:`sk-mega-your-key`
    6. 点击 **测试连接**(应显示 ✓ 成功)
    7. 点击 **保存**
  </Step>

  <Step title="选择您的第一个模型">
    1. 在设置 → **模型选择**
    2. 选择:`gpt-5`(推荐用于一般用途)
    3. 或浏览可用模型
    4. 设置 **温度**:`0.7`(平衡)
    5. 保存设置
  </Step>

  <Step title="测试配置">
    1. 在 RooCode 中打开新聊天
    2. 输入:`你好!你在使用什么模型?`
    3. 应该会响应模型信息
    4. 尝试:`编写一个 Python 的 hello world 函数`

    **预期响应:**

    ```python  theme={null}
    def hello_world():
        print("Hello, World!")

    if __name__ == "__main__":
        hello_world()
    ```
  </Step>
</Steps>

***

### 场景 2:团队共享配置设置

为整个开发团队设置 RooCode:

\*\*场景:\*\*10 人开发团队需要一致的 RooCode 配置

**步骤 1:团队负责人创建基础配置**

`team-roocode-config.json`:

```json  theme={null}
{
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "TEAM_MEMBER_REPLACES_THIS",
    "model": "gpt-5",
    "temperature": 0.7,
    "maxTokens": 4096
  },
  "features": {
    "codeCompletion": true,
    "chatInterface": true,
    "codeReview": true,
    "refactoring": true,
    "multiFileEdit": true
  },
  "projectSettings": {
    "language": "typescript",
    "framework": "react",
    "codingStyle": "airbnb",
    "testFramework": "jest"
  },
  "customPrompts": {
    "review": "Review this code following our team's Airbnb style guide and best practices",
    "test": "Generate Jest unit tests with at least 80% coverage",
    "doc": "Generate JSDoc comments for this function",
    "refactor": "Refactor this code for better maintainability and TypeScript strict mode"
  },
  "ui": {
    "theme": "dark",
    "showInlineHints": true,
    "autoSaveChats": true,
    "fontSize": 14
  }
}
```

**步骤 2:创建设置说明**

`ROOCODE_SETUP.md`:

```markdown  theme={null}
# RooCode 团队设置指南

## 前提条件
- 已安装 RooCode 应用程序([下载](https://roocode.io))
- MegaLLM API 密钥([获取您的密钥](https://megallm.io/dashboard))

## 设置步骤

### 1. 获取您的个人 API 密钥
1. 访问 https://megallm.io/dashboard
2. 导航至 **API 密钥**
3. 点击 **创建新密钥**
4. 复制您的密钥(以 `sk-mega-` 开头)

### 2. 导入团队配置
1. 从此仓库下载 `team-roocode-config.json`
2. 打开 RooCode
3. 转到:`文件 → 导入配置`
4. 选择 `team-roocode-config.json`

### 3. 添加您的个人 API 密钥
1. 导入后,转到:`设置 → API 配置`
2. 将 `TEAM_MEMBER_REPLACES_THIS` 替换为您的实际密钥
3. 点击 **测试连接**(应显示 ✓ 成功)
4. 点击 **保存**

### 4. 重启 RooCode
关闭并重新打开 RooCode 以应用所有设置。

## 验证
1. 打开新聊天
2. 输入:`生成一个登录表单的 React 组件`
3. 应生成遵循 Airbnb 风格的 TypeScript 代码

## 故障排除
- **连接失败**:检查 API 密钥是否正确
- **代码风格错误**:验证配置是否正确导入
- **模型错误**:确保使用 `gpt-5` 或其他支持的模型

## 支持
联系团队负责人或查看 [MegaLLM 文档](https://docs.megallm.io)
```

**步骤 3:分发给团队**

```bash  theme={null}
# 团队负责人提交到仓库
git add team-roocode-config.json ROOCODE_SETUP.md
git commit -m "添加 RooCode 团队配置"
git push

# 团队成员克隆并设置
git pull
# 遵循 ROOCODE_SETUP.md 中的说明
```

\*\*结果:\*\*整个团队使用一致的:

* <Icon icon="check" /> 相同的 AI 模型(gpt-5)
* <Icon icon="check" /> 相同的温度和设置
* <Icon icon="check" /> 相同的自定义提示
* <Icon icon="check" /> 相同的编码标准
* <Icon icon="check" /> 个人 API 密钥(不共享)

***

### 场景 3:项目特定配置

为不同项目类型使用不同的 RooCode 配置:

**Python 数据科学项目:**

`roocode-datascience.json`:

```json  theme={null}
{
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}",
    "model": "claude-opus-4-1-20250805",
    "temperature": 0.5
  },
  "projectSettings": {
    "language": "python",
    "libraries": ["numpy", "pandas", "scikit-learn", "matplotlib"],
    "codingStyle": "pep8"
  },
  "customPrompts": {
    "analyze": "Analyze this data processing code for efficiency and correctness",
    "optimize": "Optimize this pandas operation for large datasets",
    "visualize": "Suggest matplotlib visualization for this data",
    "doc": "Generate numpy-style docstring"
  }
}
```

**React Web 应用程序:**

`roocode-webapp.json`:

```json  theme={null}
{
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}",
    "model": "gpt-5",
    "temperature": 0.7
  },
  "projectSettings": {
    "language": "typescript",
    "framework": "react",
    "stateManagement": "zustand",
    "styling": "tailwind"
  },
  "customPrompts": {
    "component": "Generate a React functional component with TypeScript and Tailwind",
    "test": "Write React Testing Library tests for this component",
    "hook": "Create a custom React hook for this functionality",
    "api": "Generate API integration with tanstack-query"
  }
}
```

**系统编程(Rust):**

`roocode-systems.json`:

```json  theme={null}
{
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}",
    "model": "gemini-2.5-pro",
    "temperature": 0.3
  },
  "projectSettings": {
    "language": "rust",
    "codingStyle": "rust-fmt"
  },
  "customPrompts": {
    "review": "Review this Rust code for memory safety and performance",
    "optimize": "Suggest optimizations for this performance-critical code",
    "test": "Generate comprehensive Rust tests",
    "unsafe": "Analyze this unsafe block for correctness"
  }
}
```

**项目间切换:**

<CodeGroup>
  ```bash macOS/Linux theme={null}
  # 在 ~/.bashrc 或 ~/.zshrc 中创建别名
  alias roocode-ds='cp ~/configs/roocode-datascience.json ~/.config/RooCode/config.json && roocode'
  alias roocode-web='cp ~/configs/roocode-webapp.json ~/.config/RooCode/config.json && roocode'
  alias roocode-sys='cp ~/configs/roocode-systems.json ~/.config/RooCode/config.json && roocode'
  ```

  ```powershell Windows theme={null}
  # 在 PowerShell 配置文件中创建函数
  function RooCode-DataScience {
      Copy-Item "$HOME\configs\roocode-datascience.json" "$env:APPDATA\RooCode\config.json"
      Start-Process "roocode"
  }

  function RooCode-Web {
      Copy-Item "$HOME\configs\roocode-webapp.json" "$env:APPDATA\RooCode\config.json"
      Start-Process "roocode"
  }
  ```
</CodeGroup>

***

### 场景 4:从 Cursor/其他 AI 工具迁移

从另一个 AI 编码工具切换到 RooCode 与 MegaLLM:

**当前设置:使用 Cursor 与 OpenAI**

**为什么切换到 RooCode + MegaLLM:**

* <Icon icon="check" /> 使用一个密钥访问多个模型(GPT、Claude、Gemini)
* <Icon icon="check" /> 独立应用程序(不依赖特定编辑器)
* <Icon icon="check" /> 更好的定价且无席位限制
* <Icon icon="check" /> 更多自定义选项

**迁移步骤:**

<Steps>
  <Step title="导出当前偏好设置">
    从 Cursor(如果可能):

    * 记录您偏好的模型
    * 保存任何自定义提示
    * 记录您使用的键盘快捷键
  </Step>

  <Step title="安装 RooCode">
    为您的操作系统下载并安装 RooCode
  </Step>

  <Step title="配置 MegaLLM">
    ```json  theme={null}
    {
      "provider": "openai-compatible",
      "api": {
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-megallm-key",
        "model": "gpt-5"
      }
    }
    ```
  </Step>

  <Step title="重建自定义提示">
    添加您常用的提示:

    ```json  theme={null}
    {
      "customPrompts": {
        "explain": "详细解释此代码",
        "fix": "查找并修复此代码中的错误",
        "improve": "为此代码提出改进建议"
      }
    }
    ```
  </Step>

  <Step title="测试功能">
    并排比较:

    1. 在两个工具中打开相同的代码
    2. 提出相同的问题
    3. 比较代码生成质量
    4. 评估响应速度
  </Step>
</Steps>

**对比表:**

| 功能         | Cursor        | RooCode + MegaLLM   |
| ---------- | ------------- | ------------------- |
| **编辑器集成**  | VS Code 分支    | 独立 + 任何编辑器          |
| **可用模型**   | GPT-4、GPT-3.5 | GPT、Claude、Gemini 等 |
| **API 密钥** | 仅 OpenAI      | 一个密钥适用所有模型          |
| **定价**     | 按席位订阅         | 按使用付费               |
| **自定义**    | 有限            | 广泛                  |
| **离线模式**   | 否             | 否                   |

***

### 场景 5:多模型工作流

为不同类型的任务使用不同的模型:

**带模型配置文件的配置:**

```json  theme={null}
{
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "sk-mega-your-api-key-here",
    "model": "gpt-5"
  },
  "modelProfiles": {
    "fast": {
      "model": "gpt-4o-mini",
      "temperature": 0.5,
      "maxTokens": 1000,
      "description": "简单任务的快速补全"
    },
    "balanced": {
      "model": "gpt-5",
      "temperature": 0.7,
      "maxTokens": 4096,
      "description": "平衡的质量和速度"
    },
    "quality": {
      "model": "claude-opus-4-1-20250805",
      "temperature": 0.3,
      "maxTokens": 8192,
      "description": "复杂任务的最高质量"
    },
    "creative": {
      "model": "gpt-5",
      "temperature": 0.9,
      "maxTokens": 4096,
      "description": "创意文档和命名"
    },
    "analysis": {
      "model": "claude-sonnet-4",
      "temperature": 0.4,
      "maxTokens": 6000,
      "description": "代码审查和分析"
    }
  }
}
```

**工作流示例:**

```plaintext  theme={null}
上午:快速原型开发
→ 切换到 "fast" 配置文件(gpt-4o-mini)
→ 快速代码生成
→ 快速迭代

下午:生产代码
→ 切换到 "quality" 配置文件(claude-opus-4)
→ 生成生产就绪代码
→ 全面的错误处理

代码审查时间
→ 切换到 "analysis" 配置文件(claude-sonnet-4)
→ 详细的代码审查
→ 安全分析

文档编写
→ 切换到 "creative" 配置文件(gpt-5,高温度)
→ 生成吸引人的文档
→ 创意命名建议
```

**在 RooCode 中切换配置文件:**

1. 点击模型下拉菜单(顶部栏)
2. 选择配置文件:Fast / Balanced / Quality / Creative / Analysis
3. 配置文件应用于当前会话

***

### 场景 6:CI/CD 集成

在 CI/CD 中使用 RooCode API 进行自动化代码审查:

**GitHub Actions 示例:**

`.github/workflows/roocode-review.yml`:

```yaml  theme={null}
name: AI Code Review with RooCode

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup RooCode CLI
        run: |
          curl -O https://roocode.io/cli/install.sh
          bash install.sh

      - name: Configure MegaLLM
        env:
          MEGALLM_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
        run: |
          mkdir -p ~/.config/RooCode
          cat > ~/.config/RooCode/config.json << EOF
          {
            "provider": "openai-compatible",
            "api": {
              "baseURL": "https://ai.megallm.io/v1",
              "apiKey": "$MEGALLM_API_KEY",
              "model": "claude-sonnet-4"
            }
          }
          EOF

      - name: Run AI Code Review
        run: |
          roocode review \
            --files "$(git diff --name-only origin/main...HEAD)" \
            --output review.md

      - name: Post Review Comment
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## AI Code Review\n\n${review}`
            });
```

## 配置选项

### 完整参考

```json  theme={null}
{
  // API Configuration
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "sk-mega-your-api-key-here",
    "organization": "",
    "model": "gpt-5",
    "temperature": 0.7,
    "maxTokens": 4096,
    "topP": 0.9,
    "frequencyPenalty": 0.0,
    "presencePenalty": 0.0,
    "timeout": 30000
  },

  // Feature Toggles
  "features": {
    "codeCompletion": true,
    "chatInterface": true,
    "codeReview": true,
    "refactoring": true,
    "multiFileEdit": true,
    "contextAwareness": true,
    "autoSave": true
  },

  // Project Settings
  "projectSettings": {
    "language": "typescript",
    "framework": "react",
    "codingStyle": "airbnb",
    "testFramework": "jest",
    "linter": "eslint"
  },

  // Custom Prompts
  "customPrompts": {
    "review": "Review code for bugs and best practices",
    "test": "Generate comprehensive unit tests",
    "doc": "Generate detailed documentation",
    "refactor": "Refactor for better maintainability",
    "optimize": "Optimize for performance",
    "secure": "Analyze for security vulnerabilities"
  },

  // UI Preferences
  "ui": {
    "theme": "dark",
    "fontSize": 14,
    "fontFamily": "Fira Code",
    "showInlineHints": true,
    "showLineNumbers": true,
    "autoSaveChats": true,
    "chatPosition": "right",
    "enableAnimations": true
  },

  // Keyboard Shortcuts
  "shortcuts": {
    "newChat": "Cmd+N",
    "sendMessage": "Cmd+Enter",
    "clearChat": "Cmd+K",
    "switchModel": "Cmd+M",
    "openSettings": "Cmd+,"
  },

  // Advanced
  "advanced": {
    "logLevel": "info",
    "cacheResponses": true,
    "maxChatHistory": 100,
    "contextWindowSize": 8000,
    "streamResponses": true
  }
}
```

### 模型选择指南

| 任务         | 推荐模型                       | 原因              |
| ---------- | -------------------------- | --------------- |
| **快速补全**   | `gpt-4o-mini`              | 最快、经济实惠         |
| **代码审查**   | `claude-sonnet-4`          | 出色的分析能力         |
| **复杂逻辑**   | `claude-opus-4-1-20250805` | 卓越的推理能力         |
| **Web 开发** | `gpt-5`                    | 最适合 JS/TS/React |
| **文档编写**   | `gpt-5`                    | 清晰、引人入胜的写作      |
| **数据科学**   | `claude-sonnet-4`          | 擅长 pandas/numpy |
| **系统代码**   | `gemini-2.5-pro`           | 精确、数学化          |

## 验证

### 测试 1:聊天功能

1. 打开 RooCode
2. 点击 **新建聊天**
3. 输入:`编写一个函数,按属性对对象数组进行排序`
4. 应该收到可工作的代码

**预期响应:**

```javascript  theme={null}
function sortByProperty(array, property) {
  return array.sort((a, b) => {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return 0;
  });
}
```

### 测试 2:代码审查

1. 粘贴此代码:

```python  theme={null}
def divide(a, b):
    return a / b
```

2. 点击 **审查代码** 按钮
3. 应识别出:缺少零除检查

### 测试 3:多文件编辑

1. 打开多文件视图
2. 请求:"为所有 API 调用添加错误处理"
3. 应显示多个文件的更改
4. 审查并应用更改

### 测试 4:连接状态

检查状态指示器(右上角):

* 🟢 绿色 = 已连接到 MegaLLM
* 🟡 黄色 = 连接中...
* 🔴 红色 = 连接失败

点击状态查看:

* 模型:`gpt-5`
* 端点:`https://ai.megallm.io/v1`
* 令牌使用情况:当前会话统计

## 故障排除

<AccordionGroup>
  <Accordion title="连接超时错误">
    **症状:**

    * "无法连接到 API"
    * 请求在 30 秒后超时
    * 聊天消息无法发送

    **解决方案:**

    1. **验证基础 URL 是否正确:**
       ```
       https://ai.megallm.io/v1  <Icon icon="check" /> 正确
       https://ai.megallm.io     <Icon icon="xmark" /> 缺少 /v1
       https://api.openai.com/v1 <Icon icon="xmark" /> 错误的端点
       ```

    2. **测试连接:**
       ```bash  theme={null}
       # 测试连接
       curl -I https://ai.megallm.io/v1/models

       # 应返回: HTTP/2 200
       ```

    3. **检查防火墙:**
       * 允许 RooCode 通过防火墙
       * 检查企业代理设置
       * 验证没有 VPN 阻止

    4. **增加超时时间:**
       ```json  theme={null}
       {
         "api": {
           "timeout": 60000  // 增加到 60 秒
         }
       }
       ```

    5. **手动测试 API 密钥:**
       ```bash  theme={null}
       curl -X POST https://ai.megallm.io/v1/chat/completions \
         -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'
       ```
  </Accordion>

  <Accordion title="API 密钥无法识别">
    **症状:**

    * "无效的 API 密钥" 错误
    * 401 未授权
    * 身份验证失败

    **解决方案:**

    1. **验证密钥格式:**
       * 必须以 `sk-mega-` 开头
       * 应为 60+ 个字符
       * 没有额外的空格或换行符
       * 配置文件中实际密钥周围没有引号

    2. **检查密钥是否激活:**
       * 登录到 [控制台](https://megallm.io/dashboard)
       * 转到 **API 密钥**
       * 验证密钥显示为"活动"
       * 检查它未被撤销或过期

    3. **重新输入密钥:**
       * 从控制台复制密钥
       * 从 RooCode 设置中删除旧密钥
       * 粘贴新密钥
       * 保存并重启 RooCode

    4. **直接测试密钥:**
       ```bash  theme={null}
       curl -H "Authorization: Bearer sk-mega-your-actual-key" \
            https://ai.megallm.io/v1/models

       # 应返回模型的 JSON 列表
       ```
  </Accordion>

  <Accordion title="响应质量差">
    **症状:**

    * 不相关的代码建议
    * 错误的编程语言
    * 不完整的响应

    **解决方案:**

    1. **提供更好的上下文:**
       * 在设置中设置项目语言
       * 添加框架信息
       * 使用自定义提示

    2. **调整温度:**
       ```json  theme={null}
       {
         "api": {
           "temperature": 0.3  // 降低 = 更专注(代码用 0.2-0.4)
         }
       }
       ```

    3. **尝试不同的模型:**
       ```json  theme={null}
       {
         "api": {
           "model": "claude-sonnet-4"  // 更好的分析
         }
       }
       ```

    4. **增加最大令牌数:**
       ```json  theme={null}
       {
         "api": {
           "maxTokens": 8192  // 更长、更完整的响应
         }
       }
       ```

    5. **使用具体的提示:**
       ```json  theme={null}
       {
         "customPrompts": {
           "generate": "生成遵循最佳实践的生产就绪 TypeScript 代码"
         }
       }
       ```
  </Accordion>

  <Accordion title="配置未加载">
    **症状:**

    * 重启后设置恢复
    * 更改不生效
    * 使用默认配置

    **解决方案:**

    1. **检查配置文件位置:**

       <CodeGroup>
         ```bash Windows theme={null}
         # 应该是:
         C:\Users\YourName\AppData\Roaming\RooCode\config.json

         # 不是:
         C:\Program Files\RooCode\config.json  # 错误!
         ```

         ```bash macOS theme={null}
         # 应该是:
         ~/Library/Application Support/RooCode/config.json

         # 不是:
         /Applications/RooCode.app/config.json  # 错误!
         ```

         ```bash Linux theme={null}
         # 应该是:
         ~/.config/RooCode/config.json

         # 不是:
         /etc/roocode/config.json  # 错误!
         ```
       </CodeGroup>

    2. **验证 JSON 语法:**
       ```bash  theme={null}
       # 检查错误
       cat config.json | python3 -m json.tool

       # 应显示格式化的 JSON 或错误
       ```

    3. **检查文件权限:**
       ```bash  theme={null}
       # Linux/macOS
       chmod 644 ~/.config/RooCode/config.json

       # Windows: 确保用户具有读/写访问权限
       ```

    4. **重置为默认值:**
       * 备份当前配置
       * 删除 config.json
       * 重启 RooCode (创建新配置)
       * 通过 UI 重新应用设置
  </Accordion>

  <Accordion title="应用程序崩溃或冻结">
    **症状:**

    * RooCode 启动时崩溃
    * 长响应期间冻结
    * UI 无响应

    **解决方案:**

    1. **检查系统资源:**
       * 关闭其他应用程序
       * 确保有 4GB+ RAM 可用
       * 检查 CPU 使用率

    2. **减少最大令牌数:**
       ```json  theme={null}
       {
         "api": {
           "maxTokens": 2048  // 从 8192 减少
         }
       }
       ```

    3. **禁用流式传输:**
       ```json  theme={null}
       {
         "advanced": {
           "streamResponses": false
         }
       }
       ```

    4. **清除缓存:**
       ```bash  theme={null}
       # Windows
       rmdir /s "%APPDATA%\RooCode\cache"

       # macOS/Linux
       rm -rf ~/Library/Application\ Support/RooCode/cache
       rm -rf ~/.config/RooCode/cache
       ```

    5. **重新安装 RooCode:**
       * 备份 config.json
       * 卸载 RooCode
       * 下载最新版本
       * 安装并恢复配置
  </Accordion>
</AccordionGroup>

## 最佳实践

<CardGroup cols={2}>
  <Card title="项目配置" icon="folder">
    为不同项目类型创建单独的配置
  </Card>

  <Card title="模型配置文件" icon="layer-group">
    为不同任务设置配置文件:fast、quality、creative
  </Card>

  <Card title="自定义提示" icon="message">
    为常见任务定义可重用的提示
  </Card>

  <Card title="监控使用情况" icon="chart-line">
    定期检查 [控制台](https://megallm.io/dashboard) 的令牌使用情况
  </Card>

  <Card title="备份配置" icon="floppy-disk">
    保留工作配置的备份
  </Card>

  <Card title="安全性" icon="lock">
    在共享配置中使用环境变量存储 API 密钥
  </Card>
</CardGroup>

## 高级技巧

### 环境变量

RooCode 支持环境变量替换:

```json  theme={null}
{
  "api": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "${env:MEGALLM_BASE_URL}"
  }
}
```

设置变量:

```bash  theme={null}
export MEGALLM_API_KEY="sk-mega-your-key"
export MEGALLM_BASE_URL="https://ai.megallm.io/v1"
```

### 上下文管理

通过更好的上下文改进响应:

```json  theme={null}
{
  "advanced": {
    "contextWindowSize": 16000,
    "includeProjectStructure": true,
    "includeOpenFiles": true,
    "maxRelevantFiles": 10
  }
}
```

### 响应缓存

通过智能缓存节省 API 成本:

```json  theme={null}
{
  "advanced": {
    "cacheResponses": true,
    "cacheExpiry": 3600,  // seconds
    "maxCacheSize": 100   // MB
  }
}
```

## 下一步

<CardGroup cols={3}>
  <Card title="Kilocode 设置" icon="code" href="/cn/agents/kilocode">
    配置 Kilocode VSCode 扩展
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