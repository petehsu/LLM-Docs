# 配置概述

> MegaLLM CLI 通过创建配置文件和设置环境变量来配置 AI 编码助手。每个工具都有自己的配置格式和存储位置。

## 配置位置

<CardGroup cols={3}>
  <Card title="Claude Code" icon="robot" href="/cn/cli/claude-config">
    JSON 文件位于 `~/.claude/` 或 `./.claude/`
  </Card>

  <Card title="Codex/Windsurf" icon="code" href="/cn/cli/codex-config">
    TOML 文件位于 `~/.codex/`
  </Card>

  <Card title="OpenCode" icon="brackets-curly" href="/cn/cli/opencode-config">
    JSON 文件位于 `~/.config/opencode/` 或 `./`
  </Card>
</CardGroup>

## 配置级别

### 系统级(全局)

应用于您计算机上的所有项目。

| 工具             | 位置                                              |
| -------------- | ----------------------------------------------- |
| Claude Code    | `~/.claude/settings.json`<br />`~/.claude.json` |
| Codex/Windsurf | `~/.codex/config.toml`                          |
| OpenCode       | `~/.config/opencode/opencode.json`              |

### 项目级(本地)

仅应用于当前项目目录。

| 工具             | 位置                                                             |
| -------------- | -------------------------------------------------------------- |
| Claude Code    | `./.claude/settings.json`<br />`./.claude/settings.local.json` |
| Codex/Windsurf | <Icon icon="xmark" /> 不支持                                      |
| OpenCode       | `./opencode.json`                                              |

<Warning>
  **Codex/Windsurf 仅支持系统级配置**
</Warning>

## 环境变量

CLI 会自动在您的 Shell 配置文件中设置这些环境变量。

### Claude Code

```bash  theme={null}
export ANTHROPIC_BASE_URL="https://ai.megallm.io"
export ANTHROPIC_API_KEY="sk-mega-your-api-key-here"
```

### Codex/Windsurf

```bash  theme={null}
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
```

### OpenCode

```bash  theme={null}
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
```

<Info>
  **注意**: Codex/Windsurf 和 OpenCode 共享相同的 `MEGALLM_API_KEY` 环境变量。
</Info>

### 验证环境变量

```bash  theme={null}
# Claude Code
echo $ANTHROPIC_BASE_URL
# 输出: https://ai.megallm.io

echo $ANTHROPIC_API_KEY
# 输出: sk-mega-your-api-key-here

# Codex/Windsurf & OpenCode
echo $MEGALLM_API_KEY
# 输出: sk-mega-your-api-key-here
```

## 配置优先级

当存在多个配置时,它们按以下顺序应用(从高到低):

<Steps>
  <Step title="环境变量">
    最高优先级 - 覆盖所有基于文件的配置
  </Step>

  <Step title="项目级配置">
    第二优先级 - 仅应用于当前项目
  </Step>

  <Step title="系统级配置">
    默认 - 全局应用于所有项目
  </Step>
</Steps>

## 备份文件

CLI 在修改配置之前会自动创建备份文件:

```
~/.claude/settings.json.backup
~/.codex/config.toml.backup
~/.config/opencode/opencode.json.backup
```

从备份恢复:

```bash  theme={null}
mv ~/.claude/settings.json.backup ~/.claude/settings.json
```

## 工具特定配置

选择您的 AI 工具以获取详细的配置信息:

<CardGroup cols={2}>
  <Card title="Claude Code 配置" icon="robot" href="/cn/cli/claude-config">
    JSON 配置、环境变量和状态栏设置
  </Card>

  <Card title="Codex/Windsurf 配置" icon="code" href="/cn/cli/codex-config">
    TOML 配置和模型提供商设置
  </Card>

  <Card title="OpenCode 配置" icon="brackets-curly" href="/cn/cli/opencode-config">
    JSON 配置和 API 设置
  </Card>
</CardGroup>

## 快速配置检查

### 验证所有配置

```bash  theme={null}
# 检查 Claude Code
ls -la ~/.claude/
cat ~/.claude/settings.json

# 检查 Codex
ls -la ~/.codex/
cat ~/.codex/config.toml

# 检查 OpenCode
ls -la ~/.config/opencode/
cat ~/.config/opencode/opencode.json

# 检查环境变量
env | grep -E "ANTHROPIC|MEGALLM"
```

### 测试 API 连接

```bash  theme={null}
# 使用 Claude Code 凭据测试
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     $ANTHROPIC_BASE_URL/v1/models

# 使用 Codex/OpenCode 凭据测试
curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
     -H "Content-Type: application/json" \
     https://ai.megallm.io/v1/models
```

## 手动配置

如果您不想使用 CLI,可以手动配置:

<Tabs>
  <Tab title="Claude Code">
    ```bash  theme={null}
    # 创建目录
    mkdir -p ~/.claude

    # 创建设置文件
    cat > ~/.claude/settings.json << 'EOF'
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
        "ANTHROPIC_API_KEY": "your-api-key"
      }
    }
    EOF

    # 添加到 shell 配置
    echo 'export ANTHROPIC_BASE_URL="https://ai.megallm.io"' >> ~/.bashrc
    echo 'export ANTHROPIC_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Tab>

  <Tab title="Codex/Windsurf">
    ```bash  theme={null}
    # 创建目录
    mkdir -p ~/.codex

    # 创建配置文件
    cat > ~/.codex/config.toml << 'EOF'
    model_provider = "megallm"
    model = "gpt-5"

    [model_providers.megallm]
    name = "OpenAI using Chat Completions"
    base_url = "https://ai.megallm.io/v1"
    env_key = "MEGALLM_API_KEY"
    query_params = {}
    EOF

    # 添加到 shell 配置
    echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Tab>

  <Tab title="OpenCode">
    ```bash  theme={null}
    # 创建目录
    mkdir -p ~/.config/opencode

    # 创建配置文件
    cat > ~/.config/opencode/opencode.json << 'EOF'
    {
      "$schema": "https://opencode.ai/config.json",
      "provider": {
        "anthropic": {
          "options": {
            "apiKey": "{env:MEGALLM_API_KEY}",
            "baseURL": "https://ai.megallm.io/v1"
          }
        }
      }
    }
    EOF

    # 添加到 shell 配置
    echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Tab>
</Tabs>

## 配置最佳实践

<CardGroup cols={2}>
  <Card title="团队使用项目级配置" icon="users">
    将项目特定配置保存在版本控制中(不包含 API 密钥)
  </Card>

  <Card title="保护 API 密钥" icon="lock">
    永远不要提交 API 密钥。使用 `.gitignore` 和环境变量
  </Card>

  <Card title="定期备份" icon="floppy-disk">
    CLI 会创建自动备份,但请保留重要配置的副本
  </Card>

  <Card title="更改后测试" icon="flask">
    手动修改后始终验证配置是否有效
  </Card>
</CardGroup>

## 下一步

<CardGroup cols={2}>
  <Card title="Claude Code 配置" icon="robot" href="/cn/cli/claude-config">
    详细的 Claude Code 配置
  </Card>

  <Card title="Codex 配置" icon="code" href="/cn/cli/codex-config">
    详细的 Codex/Windsurf 配置
  </Card>

  <Card title="OpenCode 配置" icon="brackets-curly" href="/cn/cli/opencode-config">
    详细的 OpenCode 配置
  </Card>

  <Card title="示例" icon="code-branch" href="/cn/cli/examples">
    实用的配置示例
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt