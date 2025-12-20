# Cline 配置

> 配置 Cline VSCode 扩展以使用 MegaLLM

Cline 是一个功能强大的 VSCode 扩展,结合了 AI 辅助、终端集成、自主任务执行和高级上下文感知。配置它以使用 MegaLLM 来访问多个 AI 模型。

## 快速配置

<Tabs>
  <Tab title="Anthropic 格式 (Claude)">
    ### 配置 Claude 模型

    <Steps>
      <Step title="打开 Cline 设置">
        * 按 `Ctrl+Shift+P` / `Cmd+Shift+P`
        * 输入:`Cline: Open Settings`
        * 或:`设置 → 扩展 → Cline`
      </Step>

      <Step title="选择 API 提供商">
        * **API 提供商**:选择 `Anthropic`
        * **基础 URL**:`https://ai.megallm.io`
        * **API 密钥**:`sk-mega-your-api-key-here`
      </Step>

      <Step title="选择 Claude 模型">
        * **默认模型**:`claude-sonnet-4`
        * **上下文窗口**:`200000` 令牌
        * **温度**:`0.5`
      </Step>

      <Step title="启用功能">
        * <Icon icon="check" /> **自动上下文检测**
        * <Icon icon="check" /> **文件监视器**
        * <Icon icon="check" /> **终端集成**
        * <Icon icon="check" /> **Git 集成**
      </Step>
    </Steps>

    **settings.json 中的配置:**

    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "sk-mega-your-api-key-here",
        "baseURL": "https://ai.megallm.io"
      },
      "cline.defaultModel": "claude-sonnet-4",
      "cline.contextWindow": 200000,
      "cline.features": {
        "autoContext": true,
        "fileWatcher": true,
        "terminalIntegration": true,
        "gitIntegration": true
      }
    }
    ```

    <Info>
      \*\*注意:\*\*对于 Anthropic 格式,baseURL 应为 `https://ai.megallm.io`(不带 `/v1`)
    </Info>
  </Tab>

  <Tab title="OpenAI 格式 (GPT)">
    ### 配置 GPT 模型

    <Steps>
      <Step title="打开 Cline 设置">
        * 按 `Ctrl+Shift+P` / `Cmd+Shift+P`
        * 输入:`Cline: Open Settings`
      </Step>

      <Step title="选择 OpenAI 提供商">
        * **API 提供商**:选择 `OpenAI`
        * **基础 URL**:`https://ai.megallm.io/v1`
        * **API 密钥**:`sk-mega-your-api-key-here`
      </Step>

      <Step title="选择 GPT 模型">
        * **默认模型**:`gpt-5`
        * **上下文窗口**:`128000` 令牌
        * **温度**:`0.7`
      </Step>

      <Step title="启用功能">
        * <Icon icon="check" /> **自动上下文检测**
        * <Icon icon="check" /> **文件监视器**
        * <Icon icon="check" /> **终端集成**
      </Step>
    </Steps>

    **settings.json 中的配置:**

    ```json  theme={null}
    {
      "cline.apiProvider": "openai",
      "cline.openai": {
        "apiKey": "sk-mega-your-api-key-here",
        "baseURL": "https://ai.megallm.io/v1"
      },
      "cline.defaultModel": "gpt-5",
      "cline.contextWindow": 128000,
      "cline.features": {
        "autoContext": true,
        "fileWatcher": true,
        "terminalIntegration": true
      }
    }
    ```

    <Info>
      \*\*注意:\*\*对于 OpenAI 格式,baseURL 应包含 `/v1`:`https://ai.megallm.io/v1`
    </Info>
  </Tab>

  <Tab title="环境变量">
    ### 安全配置

    **步骤 1**:设置环境变量

    ```bash  theme={null}
    # 添加到 ~/.bashrc、~/.zshrc 或 ~/.config/fish/config.fish
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"

    # 对于 Claude 模型
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"

    # 对于 GPT 模型
    export OPENAI_BASE_URL="https://ai.megallm.io/v1"
    ```

    **步骤 2**:重新加载 shell

    ```bash  theme={null}
    source ~/.bashrc  # 或 ~/.zshrc
    ```

    **步骤 3**:在 settings.json 中引用

    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "${env:MEGALLM_API_KEY}",
        "baseURL": "${env:ANTHROPIC_BASE_URL}"
      },
      "cline.defaultModel": "claude-sonnet-4"
    }
    ```

    <Icon icon="check" /> API 密钥保持安全且不在版本控制中
  </Tab>
</Tabs>

## 场景示例

### 场景 1:首次安装

从零开始完成设置:

<Steps>
  <Step title="安装 Cline 扩展">
    1. 打开 VSCode
    2. 转到扩展:`Ctrl+Shift+X` / `Cmd+Shift+X`
    3. 搜索:`Cline`
    4. 点击 **安装**
    5. 如果提示则重新加载 VSCode
  </Step>

  <Step title="获取 MegaLLM API 密钥">
    1. 访问 [MegaLLM 控制台](https://megallm.io/dashboard)
    2. 导航至 **API 密钥** 部分
    3. 点击 **创建新密钥**
    4. 复制密钥(以 `sk-mega-` 开头)
  </Step>

  <Step title="配置 Cline">
    打开命令面板并运行:`Cline: Open Settings`

    选择您偏好的格式:

    **对于 Claude 模型:**

    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "sk-mega-your-actual-key",
        "baseURL": "https://ai.megallm.io"
      },
      "cline.defaultModel": "claude-sonnet-4"
    }
    ```

    **对于 GPT 模型:**

    ```json  theme={null}
    {
      "cline.apiProvider": "openai",
      "cline.openai": {
        "apiKey": "sk-mega-your-actual-key",
        "baseURL": "https://ai.megallm.io/v1"
      },
      "cline.defaultModel": "gpt-5"
    }
    ```
  </Step>

  <Step title="打开 Cline 面板">
    1. 点击左侧边栏中的 Cline 图标
    2. 或:`Ctrl+Shift+P` → `Cline: Open`
    3. 应该看到连接状态:✓ 已连接
  </Step>

  <Step title="测试配置">
    在 Cline 聊天中输入:

    ```
    你在使用什么模型?编写一个 Python 的 hello world 函数。
    ```

    **预期响应:**

    ```
    我通过 MegaLLM 使用 claude-sonnet-4。

    def hello_world():
        print("Hello, World!")

    if __name__ == "__main__":
        hello_world()
    ```
  </Step>
</Steps>

***

### 场景 2:自主任务执行

使用 Cline 处理复杂的多步骤任务:

**场景:**"将身份验证模块重构为使用 JWT 令牌"

<Steps>
  <Step title="配置自主模式">
    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "${env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io"
      },
      "cline.defaultModel": "claude-opus-4-1-20250805",
      "cline.autonomousMode": {
        "enabled": true,
        "requireApproval": "perFile",
        "maxIterations": 10
      },
      "cline.features": {
        "terminalIntegration": true,
        "gitIntegration": true,
        "fileWatcher": true
      }
    }
    ```
  </Step>

  <Step title="向 Cline 分配任务">
    打开 Cline 面板并提供详细说明:

    ```
    任务:将身份验证重构为使用 JWT

    要求:
    1. 安装 jsonwebtoken 包
    2. 更新登录端点以生成 JWT
    3. 创建中间件来验证 JWT
    4. 更新受保护的路由
    5. 为新的认证流程编写测试
    6. 更新文档

    当前认证在:src/auth/
    ```
  </Step>

  <Step title="Cline 自主执行">
    Cline 将:

    1. 分析当前认证代码
    2. 运行:`npm install jsonwebtoken`
    3. 创建新的 JWT 工具
    4. 更新登录控制器
    5. 创建中间件
    6. 更新路由
    7. 生成测试
    8. 更新文档

    **您在每个文件更改写入之前进行批准**
  </Step>

  <Step title="审查并提交">
    ```bash  theme={null}
    # Cline 可以执行 git 命令
    git add .
    git commit -m "重构:实现 JWT 身份验证"
    ```
  </Step>
</Steps>

\*\*结果:\*\*完整的身份验证重构,手动工作量最小!

***

### 场景 3:项目特定的 Cline 配置

不同的项目需要不同的 Cline 设置:

**Python 数据分析项目:**

`.vscode/settings.json`:

```json  theme={null}
{
  "cline.apiProvider": "anthropic",
  "cline.anthropic": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io"
  },
  "cline.defaultModel": "claude-opus-4-1-20250805",
  "cline.context": {
    "language": "python",
    "frameworks": ["pandas", "numpy", "matplotlib"],
    "codeStyle": "pep8"
  },
  "cline.customPrompts": {
    "analyze": "Analyze this data processing code for efficiency",
    "visualize": "Suggest matplotlib visualization",
    "optimize": "Optimize pandas operations for large datasets"
  }
}
```

**React/TypeScript Web 应用:**

`.vscode/settings.json`:

```json  theme={null}
{
  "cline.apiProvider": "openai",
  "cline.openai": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io/v1"
  },
  "cline.defaultModel": "gpt-5",
  "cline.context": {
    "language": "typescript",
    "frameworks": ["react", "next.js", "tailwind"],
    "codeStyle": "airbnb"
  },
  "cline.customPrompts": {
    "component": "Create React component with TypeScript",
    "api": "Generate API route with error handling",
    "test": "Write React Testing Library tests"
  }
}
```

**Rust 系统项目:**

`.vscode/settings.json`:

```json  theme={null}
{
  "cline.apiProvider": "openai",
  "cline.openai": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io/v1"
  },
  "cline.defaultModel": "gemini-2.5-pro",
  "cline.context": {
    "language": "rust",
    "codeStyle": "rustfmt"
  },
  "cline.customPrompts": {
    "review": "Review for memory safety and performance",
    "unsafe": "Analyze unsafe block for correctness",
    "optimize": "Suggest performance optimizations"
  }
}
```

***

### 场景 4：终端集成工作流

使用 Cline 的终端功能处理 DevOps 任务:

**配置:**

```json  theme={null}
{
  "cline.apiProvider": "anthropic",
  "cline.anthropic": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io"
  },
  "cline.defaultModel": "claude-sonnet-4",
  "cline.features": {
    "terminalIntegration": true,
    "gitIntegration": true,
    "fileWatcher": true
  },
  "cline.terminal": {
    "autoExecute": false,
    "requireApproval": true,
    "allowedCommands": ["npm", "git", "docker", "kubectl"]
  }
}
```

**示例工作流:**

```plaintext  theme={null}
您: "为这个 Node.js 应用设置 Docker 开发环境"

Cline: "我会帮您设置 Docker。我需要:
1. 创建 Dockerfile
2. 创建 docker-compose.yml
3. 添加 .dockerignore
4. 测试构建

我可以继续吗?"

您: "可以"

Cline 执行:
1. 创建包含 Node.js 18 的 Dockerfile
2. 创建包含应用 + postgres 的 docker-compose.yml
3. 添加 .dockerignore
4. 运行: docker-compose build
5. 运行: docker-compose up -d
6. 运行: docker-compose ps (验证)

结果: <Icon icon="check" /> Docker 环境运行中
```

***

### 场景 5：从 GitHub Copilot Chat 迁移

从 Copilot Chat 切换到 Cline 配合 MegaLLM:

**为什么迁移:**

* <Icon icon="check" /> 可访问 Claude (更好的推理能力) 和 GPT
* <Icon icon="check" /> 终端集成 (Copilot Chat 没有)
* <Icon icon="check" /> 自主执行多步骤任务
* <Icon icon="check" /> 更好的定价 (按使用付费 vs 按席位付费)
* <Icon icon="check" /> 更强的上下文感知

**迁移步骤:**

<Steps>
  <Step title="记录当前使用情况">
    记录您最常用的 Copilot Chat 功能:

    * 解释代码
    * 生成函数
    * 编写测试
    * 调试帮助
  </Step>

  <Step title="禁用 Copilot Chat">
    ```json  theme={null}
    {
      "github.copilot.enable": false
    }
    ```
  </Step>

  <Step title="安装 Cline">
    VSCode 扩展 → 搜索 "Cline" → 安装
  </Step>

  <Step title="使用 MegaLLM 配置">
    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "${env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io"
      },
      "cline.defaultModel": "claude-sonnet-4"
    }
    ```
  </Step>

  <Step title="学习 Cline 命令">
    * `/explain` - 解释选中的代码
    * `/test` - 生成测试
    * `/fix` - 调试和修复问题
    * `/refactor` - 重构代码
    * `/task` - 执行多步骤任务
  </Step>

  <Step title="比较体验">
    **相比 Copilot Chat 的优势:**

    * 可以执行终端命令
    * 更擅长多文件修改
    * 使用 Claude Opus 处理复杂推理
    * 可以运行测试并验证更改
    * 内置 Git 集成
  </Step>
</Steps>

**功能对比:**

| 功能         | Copilot Chat                            | Cline + MegaLLM                    |
| ---------- | --------------------------------------- | ---------------------------------- |
| **聊天界面**   | <Icon icon="check" />                   | <Icon icon="check" />              |
| **代码解释**   | <Icon icon="check" />                   | <Icon icon="check" /> 使用 Claude 更好 |
| **代码生成**   | <Icon icon="check" />                   | <Icon icon="check" />              |
| **终端执行**   | <Icon icon="xmark" />                   | <Icon icon="check" />              |
| **多文件编辑**  | <Icon icon="triangle-exclamation" /> 有限 | <Icon icon="check" /> 广泛           |
| **模型选择**   | 仅 GPT-4                                 | GPT、Claude、Gemini                  |
| **自主任务**   | <Icon icon="xmark" />                   | <Icon icon="check" />              |
| **Git 集成** | <Icon icon="triangle-exclamation" /> 基础 | <Icon icon="check" /> 高级           |
| **定价**     | \$10-20/月                               | 按使用付费                              |

***

### 场景 6：多模型策略

根据任务复杂度切换模型:

**配置:**

```json  theme={null}
{
  "cline.apiProvider": "anthropic",
  "cline.anthropic": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io"
  },
  "cline.defaultModel": "claude-sonnet-4",
  "cline.modelProfiles": {
    "fast": {
      "provider": "openai",
      "model": "gpt-4o-mini",
      "description": "Quick tasks, simple completions"
    },
    "balanced": {
      "provider": "anthropic",
      "model": "claude-sonnet-4",
      "description": "Most tasks, good balance"
    },
    "powerful": {
      "provider": "anthropic",
      "model": "claude-opus-4-1-20250805",
      "description": "Complex reasoning, refactoring"
    },
    "creative": {
      "provider": "openai",
      "model": "gpt-5",
      "description": "Documentation, naming"
    }
  }
}
```

**使用模式:**

```plaintext  theme={null}
上午: 快速修复 bug
→ 使用 "fast" 配置文件 (gpt-4o-mini)
→ 快速响应简单问题

中午: 功能开发
→ 使用 "balanced" 配置文件 (claude-sonnet-4)
→ 良好质量，合理速度

下午: 复杂重构
→ 使用 "powerful" 配置文件 (claude-opus-4)
→ 最佳架构推理能力

晚上: 编写文档
→ 使用 "creative" 配置文件 (gpt-5)
→ 引人入胜的文档和注释
```

**切换配置文件:**

1. 在 Cline 面板中，点击模型名称
2. 从下拉菜单选择配置文件
3. 或使用命令: `/model powerful`

***

### 场景 7：CI/CD 集成

在自动化工作流中使用 Cline:

**GitHub Actions 示例:**

`.github/workflows/cline-review.yml`:

```yaml  theme={null}
name: Cline AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Cline CLI
        run: npm install -g @cline/cli

      - name: Configure Cline
        env:
          MEGALLM_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
        run: |
          mkdir -p ~/.vscode
          cat > ~/.vscode/settings.json << EOF
          {
            "cline.apiProvider": "anthropic",
            "cline.anthropic": {
              "apiKey": "$MEGALLM_API_KEY",
              "baseURL": "https://ai.megallm.io"
            },
            "cline.defaultModel": "claude-sonnet-4"
          }
          EOF

      - name: Run AI Review
        run: |
          cline review \
            --files "$(git diff --name-only origin/main...HEAD)" \
            --output review.md \
            --model claude-sonnet-4

      - name: Run Security Check
        run: |
          cline security-scan \
            --files "$(git diff --name-only origin/main...HEAD)" \
            --output security.md

      - name: Post Review Comments
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            const security = fs.readFileSync('security.md', 'utf8');

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Cline AI Review\n\n${review}\n\n## Security Analysis\n\n${security}`
            });
```

## 配置选项

### 完整参考

```json  theme={null}
{
  // API 提供商配置
  "cline.apiProvider": "anthropic",  // 或 "openai"

  // Anthropic (Claude) 配置
  "cline.anthropic": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io"  // Anthropic 不需要 /v1
  },

  // OpenAI (GPT) 配置
  "cline.openai": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io/v1"  // OpenAI 需要包含 /v1
  },

  // 模型设置
  "cline.defaultModel": "claude-sonnet-4",
  "cline.contextWindow": 200000,
  "cline.temperature": 0.5,
  "cline.maxTokens": 4096,

  // 功能
  "cline.features": {
    "autoContext": true,
    "fileWatcher": true,
    "terminalIntegration": true,
    "gitIntegration": true,
    "multiFileEdit": true
  },

  // 自主模式
  "cline.autonomousMode": {
    "enabled": true,
    "requireApproval": "perFile",  // "perFile", "perAction", "never"
    "maxIterations": 10
  },

  // 终端设置
  "cline.terminal": {
    "autoExecute": false,
    "requireApproval": true,
    "allowedCommands": ["npm", "git", "docker"],
    "blockedCommands": ["rm -rf", "sudo"]
  },

  // 上下文设置
  "cline.context": {
    "language": "typescript",
    "frameworks": ["react", "next.js"],
    "codeStyle": "airbnb",
    "maxContextFiles": 20,
    "includeGitInfo": true
  },

  // 自定义提示
  "cline.customPrompts": {
    "explain": "详细解释此代码",
    "test": "生成全面的测试",
    "review": "审查错误和改进",
    "refactor": "重构以提高可维护性",
    "doc": "生成详细文档"
  },

  // UI 设置
  "cline.ui": {
    "theme": "auto",
    "position": "sidebar",  // "sidebar", "panel", "editor"
    "showStatusBar": true,
    "showInlineHints": true
  }
}
```

### 模型选择指南

| 任务         | 推荐模型                       | API 提供商   | 原因          |
| ---------- | -------------------------- | --------- | ----------- |
| **代码审查**   | `claude-sonnet-4`          | Anthropic | 出色的分析能力     |
| **重构**     | `claude-opus-4-1-20250805` | Anthropic | 最佳推理能力      |
| **快速任务**   | `gpt-4o-mini`              | OpenAI    | 最快          |
| **Web 开发** | `gpt-5`                    | OpenAI    | 适合 JS/React |
| **文档编写**   | `gpt-5`                    | OpenAI    | 清晰的写作       |
| **系统代码**   | `gemini-2.5-pro`           | OpenAI    | 精确的逻辑       |
| **自主任务**   | `claude-opus-4-1-20250805` | Anthropic | 复杂推理        |

## 验证

### 测试 1：基本聊天

1. 在 VSCode 中打开 Cline 面板
2. 开始新会话
3. 输入:`你在使用什么模型?`
4. 应响应模型名称和 MegaLLM 确认

### 测试 2：代码解释

1. 在代码中选择一个函数
2. 在 Cline 中:`/explain`
3. 应提供详细解释

### 测试 3：终端集成

1. 在 Cline 中:`列出当前目录中的所有文件`
2. Cline 应建议:`ls -la`
3. 批准执行
4. 应看到文件列表

### 测试 4：多文件任务

1. 请求:`为所有 API 路由添加错误处理`
2. Cline 分析多个文件
3. 显示每个文件的建议更改
4. 批准并应用

### 测试 5：状态检查

运行命令:`/status`

应显示:

```
✓ 已连接到 MegaLLM
✓ 模型: claude-sonnet-4
✓ 上下文: 可用 200k 令牌
✓ 终端: 已启用
✓ Git: 已启用
```

## 故障排除

<AccordionGroup>
  <Accordion title="模型无响应">
    **症状:**

    * 已发送消息但无响应
    * "模型初始化失败" 错误
    * 连接超时

    **解决方案:**

    1. **检查 API 提供商配置:**
       ```json  theme={null}
       // 对于 Claude 模型
       {
         "cline.apiProvider": "anthropic",
         "cline.anthropic": {
           "baseURL": "https://ai.megallm.io"  // 不需要 /v1
         }
       }

       // 对于 GPT 模型
       {
         "cline.apiProvider": "openai",
         "cline.openai": {
           "baseURL": "https://ai.megallm.io/v1"  // 需要包含 /v1
         }
       }
       ```

    2. **验证模型是否可用:**
       ```bash  theme={null}
       curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
            https://ai.megallm.io/v1/models | jq '.data[].id'
       ```

    3. **检查模型名称是否正确:**
       * `claude-sonnet-4` <Icon icon="check" />
       * `claude-sonnet-3` <Icon icon="xmark" /> (旧版本)
       * `gpt-5` <Icon icon="check" />
       * `gpt-5.0` <Icon icon="xmark" /> (错误格式)

    4. **重置 Cline:**
       * 命令面板:`Cline: Reset Configuration`
       * 重启 VSCode
       * 从头重新配置
  </Accordion>

  <Accordion title="终端命令未执行">
    **症状:**

    * Cline 建议命令但不执行
    * "终端集成已禁用" 消息

    **解决方案:**

    1. **启用终端集成:**
       ```json  theme={null}
       {
         "cline.features": {
           "terminalIntegration": true
         }
       }
       ```

    2. **检查终端权限:**
       * VSCode 设置 → 搜索 "terminal allow"
       * 启用:`Terminal > Integrated: Allow Workspace Configuration`

    3. **验证允许的命令:**
       ```json  theme={null}
       {
         "cline.terminal": {
           "autoExecute": false,
           "requireApproval": true,
           "allowedCommands": ["npm", "git", "docker"]
         }
       }
       ```

    4. **手动测试:**
       * 打开 VSCode 终端
       * 尝试直接运行命令
       * 确保终端在使用 Cline 之前正常工作
  </Accordion>

  <Accordion title="超出上下文窗口">
    **症状:**

    * "上下文过大" 错误
    * Cline 无法包含所有文件

    **解决方案:**

    1. **减少上下文窗口:**
       ```json  theme={null}
       {
         "cline.contextWindow": 100000  // 从 200000 减少
       }
       ```

    2. **限制包含的文件:**
       ```json  theme={null}
       {
         "cline.context": {
           "maxContextFiles": 10  // 从 20 减少
         }
       }
       ```

    3. **更具体:**
       而不是:"审查整个项目"
       改为:"仅审查认证模块"

    4. **使用较小的模型:**
       ```json  theme={null}
       {
         "cline.defaultModel": "gpt-4o-mini"  // 较小的上下文
       }
       ```
  </Accordion>

  <Accordion title="自主模式卡住">
    **症状:**

    * Cline 不断迭代但无进展
    * 任务从不完成
    * 相同错误重复出现

    **解决方案:**

    1. **限制最大迭代次数:**
       ```json  theme={null}
       {
         "cline.autonomousMode": {
           "maxIterations": 5  // 从 10 减少
         }
       }
       ```

    2. **需要更多批准:**
       ```json  theme={null}
       {
         "cline.autonomousMode": {
           "requireApproval": "perAction"  // 而不是 "perFile"
         }
       }
       ```

    3. **停止并重启:**
       * 点击 Cline 面板中的"停止"按钮
       * 审查 Cline 尝试的内容
       * 提供更具体的说明

    4. **分解任务:**
       而不是:"重构整个身份验证系统"
       尝试:"首先,只更新登录端点以使用 JWT"
  </Accordion>

  <Accordion title="API 密钥无法识别">
    **症状:**

    * "无效的 API 密钥" 错误
    * 401 未授权
    * 连接被拒绝

    **解决方案:**

    1. **验证环境中的密钥:**
       ```bash  theme={null}
       echo $MEGALLM_API_KEY
       # 应输出: sk-mega-...
       ```

    2. **重新加载 VSCode:**
       * 关闭所有 VSCode 窗口
       * 重新加载 shell:`source ~/.bashrc`
       * 重新打开 VSCode

    3. **直接设置密钥(测试用):**
       ```json  theme={null}
       {
         "cline.anthropic": {
           "apiKey": "sk-mega-your-actual-key"  // 暂时用于测试
         }
       }
       ```

    4. **手动测试密钥:**
       ```bash  theme={null}
       curl -X POST https://ai.megallm.io/v1/chat/completions \
         -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"hi"}]}'
       ```

    5. **检查密钥是否激活:**
       * 登录到 [控制台](https://megallm.io/dashboard)
       * 验证密钥未被撤销/过期
  </Accordion>

  <Accordion title="与其他扩展冲突">
    **症状:**

    * 出现多个 AI 建议
    * 键盘快捷键不工作
    * 性能问题

    **解决方案:**

    1. **禁用冲突的扩展:**
       ```json  theme={null}
       {
         "github.copilot.enable": false,
         "tabnine.disable": true,
         "aws.codeWhisperer.enabled": false,
         "kilocode.enable": false
       }
       ```

    2. **检查键绑定冲突:**
       * 文件 → 首选项 → 键盘快捷键
       * 搜索 Cline 命令
       * 解决任何冲突

    3. **一次尝试一个扩展:**
       * 禁用所有 AI 扩展
       * 仅启用 Cline
       * 测试功能
       * 逐个重新启用其他扩展
  </Accordion>
</AccordionGroup>

## 最佳实践

<CardGroup cols={2}>
  <Card title="使用环境变量" icon="key">
    将 API 密钥保存在环境变量中:`${env:MEGALLM_API_KEY}`
  </Card>

  <Card title="项目特定配置" icon="folder">
    在 `.vscode/settings.json` 中为每个项目使用不同的模型
  </Card>

  <Card title="终端批准" icon="shield">
    始终需要批准终端命令
  </Card>

  <Card title="从小处开始" icon="seedling">
    首先在小任务上测试自主模式
  </Card>

  <Card title="监控上下文" icon="chart-line">
    观察上下文使用情况以避免达到限制
  </Card>

  <Card title="Git 集成" icon="code-branch">
    让 Cline 为您处理 git 操作
  </Card>
</CardGroup>

## 高级技巧

### 自定义斜杠命令

为常见任务创建快捷方式:

```json  theme={null}
{
  "cline.customCommands": {
    "/deploy": "构建应用、运行测试并部署到暂存环境",
    "/review-pr": "审查此 PR 中所有更改的文件以查找错误和改进",
    "/setup-test": "设置测试文件结构并编写初始测试",
    "/doc-api": "从代码注释生成 API 文档"
  }
}
```

用法:在 Cline 聊天中输入 `/deploy`

### 上下文感知

改进 Cline 的理解:

```json  theme={null}
{
  "cline.context": {
    "projectType": "microservices",
    "architecture": "event-driven",
    "databases": ["postgresql", "redis"],
    "testingFramework": "jest",
    "cicd": "github-actions"
  }
}
```

### Git 集成

让 Cline 管理 git 工作流:

```json  theme={null}
{
  "cline.git": {
    "autoCommit": false,
    "commitMessageStyle": "conventional",
    "autoCreateBranches": true,
    "branchPrefix": "cline/"
  }
}
```

## 下一步

<CardGroup cols={3}>
  <Card title="Kilocode 设置" icon="code" href="/cn/agents/kilocode">
    配置 Kilocode 进行代码补全
  </Card>

  <Card title="RooCode 设置" icon="robot" href="/cn/agents/roocode">
    配置 RooCode 独立应用
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