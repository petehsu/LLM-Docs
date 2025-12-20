# Claude Code 配置

> 配置 Claude Code 以使用 MegaLLM

Claude Code 使用 JSON 配置文件进行设置和 API 密钥批准。配置可以在系统级(全局)或项目级(本地)进行。

## 配置文件

### 系统级配置

**设置文件**: `~/.claude/settings.json`

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
  }
}
```

**API 密钥批准**: `~/.claude.json`

```json  theme={null}
{
  "customApiKeyResponses": {
    "approved": ["last-20-chars-of-key"],
    "rejected": []
  }
}
```

<Info>
  API 密钥批准文件存储您的 API 密钥的最后 20 个字符,以便在 Claude Code 提示您时记住您的批准决定。
</Info>

### 项目级配置

**设置文件**: `./.claude/settings.json`

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
  }
}
```

**本地设置(不提交到 Git)**: `./.claude/settings.local.json`

```json  theme={null}
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-your-personal-key"
  }
}
```

<Tip>
  使用 `settings.local.json` 将您的个人 API 密钥排除在版本控制之外,同时与团队共享基本配置。
</Tip>

## 环境变量

CLI 在您的 Shell 配置中设置这些环境变量:

```bash  theme={null}
export ANTHROPIC_BASE_URL="https://ai.megallm.io"
export ANTHROPIC_API_KEY="sk-mega-your-api-key-here"
```

这些变量会添加到:

* `~/.bashrc` (bash)
* `~/.zshrc` (zsh)
* `~/.config/fish/config.fish` (fish)
* PowerShell 配置文件 (Windows)

### 验证环境变量

```bash  theme={null}
echo $ANTHROPIC_BASE_URL
# 输出: https://ai.megallm.io

echo $ANTHROPIC_API_KEY
# 输出: sk-mega-your-api-key-here
```

## 配置优先级

Claude Code 按以下顺序加载配置(从高到低):

<Steps>
  <Step title="环境变量">
    您的 Shell 中的 `ANTHROPIC_BASE_URL` 和 `ANTHROPIC_API_KEY`
  </Step>

  <Step title="项目级本地设置">
    当前目录中的 `./.claude/settings.local.json`
  </Step>

  <Step title="项目级设置">
    当前目录中的 `./.claude/settings.json`
  </Step>

  <Step title="系统级设置">
    主目录中的 `~/.claude/settings.json`
  </Step>
</Steps>

## 状态栏配置(可选)

Claude Code 支持增强的状态栏以改善终端界面:

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
  },
  "statusline": {
    "enabled": true,
    "components": {
      "directory": true,
      "gitBranch": true,
      "model": true,
      "contextUsage": true,
      "cost": true,
      "sessionTimer": true,
      "tokenAnalytics": true
    }
  }
}
```

CLI 会在配置过程中提示您设置此项。

## 手动设置

如果您不想使用 CLI:

### 系统级手动设置

```bash  theme={null}
# 1. 创建目录
mkdir -p ~/.claude

# 2. 创建设置文件
cat > ~/.claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "your-api-key"
  }
}
EOF

# 3. 创建 API 密钥批准文件
cat > ~/.claude.json << 'EOF'
{
  "customApiKeyResponses": {
    "approved": ["last-20-chars-of-your-key"],
    "rejected": []
  }
}
EOF

# 4. 将环境变量添加到 shell 配置
echo 'export ANTHROPIC_BASE_URL="https://ai.megallm.io"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="your-api-key"' >> ~/.bashrc

# 5. 重新加载 shell
source ~/.bashrc
```

### 项目级手动设置

```bash  theme={null}
# 1. 导航到您的项目
cd ~/projects/my-project

# 2. 创建目录
mkdir -p .claude

# 3. 创建设置文件(不包含 API 密钥用于版本控制)
cat > .claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
  }
}
EOF

# 4. 创建本地设置文件(包含 API 密钥,不提交)
cat > .claude/settings.local.json << 'EOF'
{
  "env": {
    "ANTHROPIC_API_KEY": "your-api-key"
  }
}
EOF

# 5. 添加到 .gitignore
echo ".claude/settings.local.json" >> .gitignore
echo ".claude.json" >> .gitignore

# 6. 提交共享配置
git add .claude/settings.json .gitignore
git commit -m "Add MegaLLM configuration for Claude Code"
```

## 团队配置

对于团队项目,将共享配置与个人 API 密钥分开:

**共享配置** (`.claude/settings.json` - 提交到 git):

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
  },
  "model": "gpt-5",
  "temperature": 0.7,
  "maxTokens": 4096
}
```

**个人配置** (`.claude/settings.local.json` - 不提交):

```json  theme={null}
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-personal-key-here"
  }
}
```

**团队设置说明** (`.claude/README.md`):

````markdown  theme={null}
# MegaLLM Claude Code 设置

## 前提条件
1. 从 https://megallm.io/dashboard 获取您的 MegaLLM API 密钥
2. 安装 Claude Code: `npm install -g @anthropic-ai/claude-code`

## 设置
1. 创建 `.claude/settings.local.json`:
   ```json
   {
     "env": {
       "ANTHROPIC_API_KEY": "your-key-here"
     }
   }
````

2. 或设置环境变量:
   ```bash  theme={null}
   export ANTHROPIC_API_KEY="your-key-here"
   ```

````

## 配置选项

### 可用设置

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "sk-mega-...",
    "ANTHROPIC_MODEL": "gpt-5"
  },
  "model": "gpt-5",
  "temperature": 0.7,
  "maxTokens": 4096,
  "streaming": true,
  "contextWindow": 8192,
  "autoSave": true,
  "fileWatcher": true,
  "gitIntegration": true
}
````

### 模型选择

更改默认模型:

```json  theme={null}
{
  "env": {
    "ANTHROPIC_MODEL": "claude-opus-4-1-20250805"
  }
}
```

或在环境变量中指定:

```bash  theme={null}
export ANTHROPIC_MODEL="gpt-5"
```

查看 [模型目录](/cn/home/models) 以获取可用模型。

## 验证

### 检查配置文件

```bash  theme={null}
# 查看设置
cat ~/.claude/settings.json | jq .

# 查看 API 密钥批准
cat ~/.claude.json | jq .

# 检查项目配置
cat .claude/settings.json | jq .
cat .claude/settings.local.json | jq .
```

### 测试 API 连接

```bash  theme={null}
# 使用您的凭据测试 API
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     $ANTHROPIC_BASE_URL/v1/models

# 应返回可用模型列表
```

### 测试 Claude Code

```bash  theme={null}
# 运行 Claude Code
claude-code

# 或使用简单提示进行测试
echo "What is 2+2?" | claude-code
```

## 故障排除

<AccordionGroup>
  <Accordion title="配置未加载">
    **检查文件位置:**

    ```bash  theme={null}
    ls -la ~/.claude/
    ls -la .claude/
    ```

    **验证 JSON 语法:**

    ```bash  theme={null}
    jq . ~/.claude/settings.json
    # 应显示格式化的 JSON,或在无效时显示错误
    ```

    **检查权限:**

    ```bash  theme={null}
    ls -la ~/.claude/settings.json
    # 应可读: -rw-r--r--
    ```
  </Accordion>

  <Accordion title="API 密钥未被识别">
    **验证环境变量:**

    ```bash  theme={null}
    echo $ANTHROPIC_API_KEY
    ```

    如果为空,重新加载 shell:

    ```bash  theme={null}
    source ~/.bashrc  # 或 ~/.zshrc
    ```

    **检查配置中的 API 密钥:**

    ```bash  theme={null}
    jq .env.ANTHROPIC_API_KEY ~/.claude/settings.json
    ```

    **验证 API 密钥格式:**

    * 必须以 `sk-mega-` 开头
    * 至少 20 个字符长
    * 没有额外的空格或引号
  </Accordion>

  <Accordion title="使用错误的 base URL">
    **检查环境变量:**

    ```bash  theme={null}
    echo $ANTHROPIC_BASE_URL
    # 应为: https://ai.megallm.io
    ```

    **在配置中验证:**

    ```bash  theme={null}
    jq .env.ANTHROPIC_BASE_URL ~/.claude/settings.json
    ```

    **常见错误 - 尾部斜杠:**

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io"  // ✅ 正确
        // "ANTHROPIC_BASE_URL": "https://ai.megallm.io/"  // ❌ 错误
      }
    }
    ```
  </Accordion>

  <Accordion title="项目配置未覆盖系统配置">
    **检查您是否在正确的目录中:**

    ```bash  theme={null}
    pwd
    ls -la .claude/
    ```

    **验证配置优先级:**

    ```bash  theme={null}
    # 项目配置应覆盖系统配置
    cat .claude/settings.json
    cat ~/.claude/settings.json
    ```

    **检查 settings.local.json:**

    ```bash  theme={null}
    cat .claude/settings.local.json
    # 这具有最高优先级
    ```
  </Accordion>
</AccordionGroup>

## 高级配置

### 多个配置文件

为不同的使用场景使用不同的配置:

```bash  theme={null}
# 开发配置文件
cat > ~/.claude/settings.dev.json << 'EOF'
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-dev-key"
  },
  "model": "gpt-4o-mini",
  "temperature": 0.9
}
EOF

# 生产配置文件
cat > ~/.claude/settings.prod.json << 'EOF'
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-prod-key"
  },
  "model": "gpt-5",
  "temperature": 0.5
}
EOF

# 切换配置文件
cp ~/.claude/settings.dev.json ~/.claude/settings.json
```

### 环境特定配置

```bash  theme={null}
# 根据环境设置不同的配置
if [ "$NODE_ENV" = "production" ]; then
  export ANTHROPIC_API_KEY="$PROD_API_KEY"
else
  export ANTHROPIC_API_KEY="$DEV_API_KEY"
fi
```

## 最佳实践

<CardGroup cols={2}>
  <Card title="分离 API 密钥" icon="key">
    对 `settings.local.json` 使用 `.gitignore` 以保持 API 密钥私密
  </Card>

  <Card title="团队使用项目级配置" icon="users">
    为具有共享设置的团队项目使用项目级配置
  </Card>

  <Card title="环境变量" icon="terminal">
    在 CI/CD 环境中优先使用环境变量
  </Card>

  <Card title="定期更新" icon="rotate">
    保持 Claude Code 更新以获取最新功能和修复
  </Card>
</CardGroup>

## 下一步

<CardGroup cols={2}>
  <Card title="Codex 配置" icon="code" href="/cn/cli/codex-config">
    配置 Codex/Windsurf
  </Card>

  <Card title="OpenCode 配置" icon="brackets-curly" href="/cn/cli/opencode-config">
    配置 OpenCode
  </Card>

  <Card title="示例" icon="code-branch" href="/cn/cli/examples">
    查看实用示例
  </Card>

  <Card title="所有代理配置" icon="window" href="/cn/agents/overview">
    配置所有 CLI 和 GUI 代理
  </Card>

  <Card title="故障排除" icon="circle-exclamation" href="/cn/cli/troubleshooting">
    常见问题和解决方案
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt