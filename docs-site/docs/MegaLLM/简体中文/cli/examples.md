# 使用示例

> 展示如何在不同场景下使用 MegaLLM CLI 的实用示例。

## 快速开始示例

最简单的开始方式:

```bash  theme={null}
# 运行交互式设置
npx megallm@latest

# 输出:
#   __  __                _    _     __  __
#  |  \/  | ___  __ _  __ _| |   | |   |  \/  |
#  | |\/| |/ _ \/ _` |/ _` | |   | |   | |\/| |
#  | |  | |  __/ (_| | (_| | |___| |___| |  | |
#  |_|  |_|\___|\__, |\__,_|_____|_____|_|  |_|
#               |___/
#
# 🚀 MegaLLM CLI 设置工具
# 支持: Claude Code, Codex/Windsurf, OpenCode
#
# ✓ 检测到系统: Linux (bash)
# ✓ 检测到工具: Claude Code ✓
#
# ? 您想配置哪个工具? Claude Code
# ? 设置级别? 系统级 (全局)
# ? 您有 MegaLLM API 密钥吗? 是
# ? 输入您的 MegaLLM API 密钥: sk-mega-***
#
# 配置摘要:
# - 工具: Claude Code
# - 级别: 系统级
# - API 密钥: sk-mega-***86b9 (最后 4 个字符)
#
# ? 应用此配置? 是
#
# ✓ 配置成功应用!
# ✓ Shell 已重新加载
#
# 🎉 设置完成! 您现在可以使用 Claude Code 与 MegaLLM。
```

## 基于场景的示例

### 示例 1: 首次设置 Claude Code

在新机器上首次设置 Claude Code:

```bash  theme={null}
# 第 1 步: 运行 CLI
npx megallm@latest

# 第 2 步: 按照提示操作
# 系统已检测 ✓
# Claude Code 已检测 ✓
#
# ? 您想配置哪个工具?
#   › Claude Code
#     Codex/Windsurf
#     OpenCode
#     配置全部

# 第 3 步: 选择设置级别
# ? 设置级别?
#   › 系统级 (全局) - 应用于所有项目
#     项目级 (本地) - 仅当前目录

# 第 4 步: API 密钥
# ? 您有 MegaLLM API 密钥吗?
#   › 是
#     否 - 告诉我如何获取

# ? 输入您的 MegaLLM API 密钥:
# sk-mega-****************************************************************

# 第 5 步: 确认并应用
# 配置摘要:
# 工具: Claude Code
# 级别: 系统级
# 文件: ~/.claude/settings.json, ~/.claude.json
# 环境变量: ANTHROPIC_BASE_URL, ANTHROPIC_API_KEY
#
# ? 应用此配置? 是
#
# ✓ 已创建 ~/.claude/settings.json
# ✓ 已创建 ~/.claude.json
# ✓ 已将环境变量添加到 ~/.bashrc
# ✓ 配置成功应用!
```

### 示例 2: 项目特定设置

为特定项目设置 MegaLLM:

```bash  theme={null}
# 导航到您的项目
cd ~/projects/my-app

# 运行 CLI
npx megallm@latest

# 选择项目级设置
# ? 设置级别?
#   系统级 (全局)
#   › 项目级 (本地) - 仅当前目录

# 配置后:
ls -la .claude/
# .claude/
#   settings.json
#   settings.local.json

# 添加到 .gitignore
echo ".claude/settings.local.json" >> .gitignore

# 提交项目设置 (不包含 API 密钥)
cat .claude/settings.json
# {
#   "env": {
#     "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
#   }
# }

git add .claude/settings.json .gitignore
git commit -m "Add MegaLLM configuration"
```

### 示例 3: 配置多个工具

同时设置 Claude Code 和 Codex:

```bash  theme={null}
# 运行 CLI
npx megallm@latest

# 选择多个工具
# ? 您想配置哪个工具?
#   Claude Code
#   Codex/Windsurf
#   OpenCode
#   › 配置全部

# CLI 将依次配置每个工具
# 1. 正在配置 Claude Code...
#    ✓ Claude Code 已配置
#
# 2. 正在配置 Codex...
#    ✓ Codex 已配置
#
# 3. 正在配置 OpenCode...
#    ✓ OpenCode 已配置
#
# ✓ 所有工具配置成功!
```

### 示例 4: 更新现有配置

使用新的 API 密钥更新您的配置:

```bash  theme={null}
# 再次运行 CLI
npx megallm@latest

# 检测到现有配置
# 发现 MegaLLM 配置:
# - ~/.claude/settings.json
# - ~/.codex/config.toml
#
# ? 您想做什么?
#   › 覆盖 (删除旧配置,应用新配置)
#     跳过 (保留现有配置)
#     取消

# 选择覆盖
# ? 您想重新配置哪个工具?
#   › Claude Code
#     Codex/Windsurf
#     两者

# 输入新的 API 密钥
# ? 输入您的新 MegaLLM API 密钥: sk-mega-new-key-here

# ✓ 已备份旧配置
# ✓ 已应用新配置
```

### 示例 5: 团队设置与共享配置

为团队项目设置 MegaLLM,使用版本控制的配置:

```bash  theme={null}
# 项目维护者: 创建基础配置
cd ~/projects/team-project
npx megallm@latest

# 选择项目级
# 设置级别: 项目级

# 创建 .claude/settings.json (不包含 API 密钥)
cat > .claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
  }
}
EOF

# 记录 API 密钥要求
cat > .claude/README.md << 'EOF'
# MegaLLM 设置

要在此项目中使用 MegaLLM:

1. 从 https://megallm.io/dashboard 获取您的 API 密钥
2. 创建 `.claude/settings.local.json`:
   {
     "env": {
       "ANTHROPIC_API_KEY": "your-api-key-here"
     }
   }
3. 或设置环境变量:
   export ANTHROPIC_API_KEY="your-api-key-here"
EOF

# 提交共享配置
git add .claude/settings.json .claude/README.md
git commit -m "Add MegaLLM team configuration"

# 团队成员: 克隆并添加自己的 API 密钥
git clone repo
cd repo
echo '{ "env": { "ANTHROPIC_API_KEY": "my-key" } }' > .claude/settings.local.json
```

### 示例 6: 调试模式进行故障排除

使用调试模式诊断问题:

```bash  theme={null}
# 使用调试输出运行
DEBUG=* npx megallm@latest

# 详细输出显示:
# DEBUG: 正在检测操作系统...
# DEBUG: 操作系统: Linux
# DEBUG: Shell: bash
# DEBUG: Shell 配置: /home/user/.bashrc
# DEBUG: 正在检查 Claude Code...
# DEBUG: 找到 Claude Code: /usr/local/bin/claude
# DEBUG: 正在检查现有配置...
# DEBUG: 找到: /home/user/.claude/settings.json
# DEBUG: 正在解析配置文件...
# DEBUG: 配置有效: true
# ... 更多详细日志 ...
```

### 示例 7: 自动化 CI/CD 设置

在 CI/CD 流水线中使用 CLI:

<CodeGroup>
  ```yaml GitHub Actions theme={null}
  name: Setup MegaLLM
  on: [push]

  jobs:
    setup:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3

        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '18'

        - name: Configure MegaLLM
          env:
            ANTHROPIC_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
            ANTHROPIC_BASE_URL: https://ai.megallm.io
          run: |
            mkdir -p .claude
            cat > .claude/settings.json << EOF
            {
              "env": {
                "ANTHROPIC_BASE_URL": "$ANTHROPIC_BASE_URL",
                "ANTHROPIC_API_KEY": "$ANTHROPIC_API_KEY"
              }
            }
            EOF

        - name: Run tests with Claude Code
          run: npm test
  ```

  ```yaml GitLab CI theme={null}
  setup_megallm:
    stage: setup
    image: node:18
    script:
      - mkdir -p .claude
      - |
        cat > .claude/settings.json << EOF
        {
          "env": {
            "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
            "ANTHROPIC_API_KEY": "${MEGALLM_API_KEY}"
          }
        }
        EOF
    variables:
      ANTHROPIC_BASE_URL: "https://ai.megallm.io"
    artifacts:
      paths:
        - .claude/
  ```
</CodeGroup>

### 示例 8: Windsurf 特定设置

配置 Windsurf (Codex 变体):

```bash  theme={null}
# 运行 CLI
npx megallm@latest

# 选择 Codex
# ? 您想配置哪个工具?
#   Claude Code
#   › Codex/Windsurf
#     OpenCode

# 注意: Windsurf 会自动检测
# ✓ 检测到 Windsurf 变体

# 正常进行配置
# 创建 ~/.codex/config.toml
# 设置 MEGALLM_API_KEY 环境变量

# 验证配置
cat ~/.codex/config.toml
# model_provider = "megallm"
# model = "gpt-5"
#
# [model_providers.megallm]
# name = "OpenAI using Chat Completions"
# base_url = "https://ai.megallm.io/v1"
# env_key = "MEGALLM_API_KEY"
```

## 高级场景

### 在不同 API 之间切换

为不同项目使用不同配置:

```bash  theme={null}
# 项目 A: 使用 MegaLLM
cd ~/projects/project-a
npx megallm@latest
# 使用 MegaLLM API 密钥配置

# 项目 B: 使用不同的 API
cd ~/projects/project-b
# 创建自定义配置
cat > .claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://other-api.com",
    "ANTHROPIC_API_KEY": "other-key"
  }
}
EOF
```

### 环境特定配置

为开发、预发布、生产环境使用不同配置:

```bash  theme={null}
# 开发环境
export ANTHROPIC_API_KEY="sk-mega-dev-key"

# 预发布环境
export ANTHROPIC_API_KEY="sk-mega-staging-key"

# 生产环境
export ANTHROPIC_API_KEY="sk-mega-prod-key"

# 或使用不同的配置文件
cp .claude/settings.dev.json .claude/settings.json  # 用于开发
cp .claude/settings.prod.json .claude/settings.json  # 用于生产
```

### Docker 容器设置

在 Docker 容器中使用 MegaLLM:

```dockerfile  theme={null}
FROM node:18

# 全局安装 MegaLLM CLI
RUN npm install -g megallm

# 设置环境变量
ENV ANTHROPIC_BASE_URL=https://ai.megallm.io
ENV ANTHROPIC_API_KEY=your-key-here

# 创建配置目录
RUN mkdir -p /root/.claude

# 复制配置文件
COPY .claude/settings.json /root/.claude/settings.json

# 您的应用设置
WORKDIR /app
COPY . .
RUN npm install

CMD ["npm", "start"]
```

## 常见工作流程

### 工作流程 1: 新开发者入职

```bash  theme={null}
# 1. 新开发者克隆仓库
git clone https://github.com/company/project.git
cd project

# 2. 查看 README 中的 MegaLLM 设置说明
cat README.md
# "从 https://megallm.io/dashboard 获取您的 API 密钥"

# 3. 从仪表板获取 API 密钥
# 在浏览器中打开 https://megallm.io/dashboard

# 4. 运行设置 (使用 NO_BANNER 获得更清晰的输出)
NO_BANNER=1 npx megallm@latest

# 5. 在提示时输入 API 密钥
# 配置会自动与项目设置合并

# 6. 开始开发
npm run dev
```

### 工作流程 2: 从 OpenAI 迁移

```bash  theme={null}
# 1. 当前直接使用 OpenAI
# .env 文件包含: MEGALLM_API_KEY=sk-mega-...

# 2. 切换到 MegaLLM
npx megallm@latest

# 3. CLI 检测 Claude Code/Codex 并配置
# 设置 ANTHROPIC_BASE_URL=https://ai.megallm.io

# 4. 更新应用程序代码 (如需要)
# 更改: base_url 从 api.openai.com 到 ai.megallm.io
# 或者: 让环境变量自动处理

# 5. 测试迁移
npm test

# 6. 使用新配置部署
```

### 工作流程 3: 多工具开发

```bash  theme={null}
# 同时使用 Claude Code 和 Codex 的开发者
npx megallm@latest

# 一次配置所有工具
# ? 哪个工具? 配置全部

# 结果:
# - Claude Code 使用 ANTHROPIC_* 环境变量
# - Codex 使用 MEGALLM_API_KEY 环境变量
# - 两者都指向 ai.megallm.io

# 可以无缝切换工具
claude-code  # 使用 ANTHROPIC_API_KEY
codex        # 使用 MEGALLM_API_KEY
```

## 故障排除示例

### 示例: 权限被拒绝

```bash  theme={null}
# 设置过程中出错
npx megallm@latest
# 错误: EACCES: permission denied, mkdir '/home/user/.claude'

# 修复权限
sudo chown -R $USER ~/.claude ~/.codex
chmod -R 755 ~/.claude ~/.codex

# 重试
npx megallm@latest
```

### 示例: 配置未加载

```bash  theme={null}
# 检查环境变量是否设置
env | grep -E "ANTHROPIC|MEGALLM"
# (无输出 = 未设置)

# 重新加载 shell 配置
source ~/.bashrc  # 或 ~/.zshrc

# 或重启终端
exit
# 打开新终端并再次检查
env | grep -E "ANTHROPIC|MEGALLM"
# ANTHROPIC_BASE_URL=https://ai.megallm.io
# ANTHROPIC_API_KEY=sk-mega-...
```

### 示例: API 密钥验证失败

```bash  theme={null}
npx megallm@latest

# ? 输入您的 MegaLLM API 密钥: sk-mega-abc
# ✗ API 密钥长度必须至少为 20 个字符

# 修复: 输入完整的 API 密钥
# ? 输入您的 MegaLLM API 密钥: sk-mega-****************************************************************
# ✓ API 密钥已验证
```

## 下一步

* 查看 [配置详情](/cn/cli/configuration)
* 阅读 [常见问题](/cn/cli/faq)
* 查看常见问题的 [故障排除指南](/cn/cli/troubleshooting)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt