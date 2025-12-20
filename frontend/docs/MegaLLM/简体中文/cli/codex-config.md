# Codex/Windsurf 配置

> 配置 Codex 和 Windsurf 以使用 MegaLLM

Codex 和 Windsurf 使用 TOML 配置格式,仅支持系统级(全局)配置。CLI 会自动检测您安装的是哪个变体。

<Note>
  Windsurf 是 Codex 的增强功能变体。两者的配置完全相同。
</Note>

## 配置文件

**位置**: `~/.codex/config.toml`

```toml  theme={null}
model_provider = "megallm"
model = "gpt-5"

[model_providers.megallm]
name = "OpenAI using Chat Completions"
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY"
query_params = {}

[tools]
web_search = true
file_browser = true
```

<Warning>
  **Codex/Windsurf 仅支持系统级配置。** 项目级配置不可用。
</Warning>

## 环境变量

配置引用 API 密钥的环境变量:

```bash  theme={null}
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
```

这会添加到您的 shell 配置文件:

* `~/.bashrc` (bash)
* `~/.zshrc` (zsh)
* `~/.config/fish/config.fish` (fish)
* PowerShell 配置文件 (Windows)

### 验证环境变量

```bash  theme={null}
echo $MEGALLM_API_KEY
# 输出: sk-mega-your-api-key-here
```

## 手动设置

如果您不想使用 CLI:

```bash  theme={null}
# 1. 创建目录
mkdir -p ~/.codex

# 2. 创建配置文件
cat > ~/.codex/config.toml << 'EOF'
model_provider = "megallm"
model = "gpt-5"

[model_providers.megallm]
name = "OpenAI using Chat Completions"
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY"
query_params = {}

[tools]
web_search = true
file_browser = true
EOF

# 3. 将环境变量添加到 shell 配置
echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc

# 4. 重新加载 shell
source ~/.bashrc
```

## 配置选项

### 模型选择

在配置中更改默认模型:

```toml  theme={null}
model = "claude-opus-4-1-20250805"  # 或任何支持的模型
```

**可用模型:**

* `gpt-5` - 最新的 GPT 模型
* `gpt-4` - GPT-4
* `gpt-4o` - GPT-4 优化版
* `claude-opus-4-1-20250805` - Claude Opus
* `claude-sonnet-4` - Claude Sonnet
* `gemini-2.5-pro` - Gemini Pro
* 查看 [模型目录](/cn/home/models) 获取完整列表

### 工具设置

启用或禁用集成工具:

```toml  theme={null}
[tools]
web_search = true      # 启用网页搜索功能
file_browser = true    # 启用文件浏览器
terminal = true        # 启用终端访问
code_execution = true  # 启用代码执行
```

### 高级配置

```toml  theme={null}
model_provider = "megallm"
model = "gpt-5"
temperature = 0.7
max_tokens = 4096
top_p = 0.9

[model_providers.megallm]
name = "OpenAI using Chat Completions"
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY"
query_params = {}

[tools]
web_search = true
file_browser = true
terminal = true

[ui]
theme = "dark"
font_size = 14
show_line_numbers = true
```

## 多个 API 密钥

如果您需要用于不同目的的不同 API 密钥:

### 使用环境变量

```bash  theme={null}
# 开发密钥
export MEGALLM_API_KEY="sk-mega-dev-key"

# 生产密钥
export MEGALLM_API_KEY_PROD="sk-mega-prod-key"
```

### 切换配置

```bash  theme={null}
# 创建当前配置的备份
cp ~/.codex/config.toml ~/.codex/config.toml.backup

# 开发配置
cat > ~/.codex/config.toml.dev << 'EOF'
model_provider = "megallm"
model = "gpt-4o-mini"

[model_providers.megallm]
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY_DEV"
EOF

# 生产配置
cat > ~/.codex/config.toml.prod << 'EOF'
model_provider = "megallm"
model = "gpt-5"

[model_providers.megallm]
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY_PROD"
EOF

# 切换到开发环境
cp ~/.codex/config.toml.dev ~/.codex/config.toml

# 切换到生产环境
cp ~/.codex/config.toml.prod ~/.codex/config.toml
```

## Windsurf 特定功能

Windsurf 包含额外的配置选项:

```toml  theme={null}
model_provider = "megallm"
model = "gpt-5"

[model_providers.megallm]
name = "OpenAI using Chat Completions"
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY"
query_params = {}

[windsurf]
cascade_mode = true           # 启用 Cascade AI 功能
multi_file_edit = true        # 允许编辑多个文件
context_awareness = "enhanced" # enhanced, standard, minimal

[tools]
web_search = true
file_browser = true
terminal = true
supercomplete = true          # Windsurf 自动完成功能
```

## 验证

### 检查配置文件

```bash  theme={null}
# 查看配置
cat ~/.codex/config.toml

# 验证 TOML 语法(如果安装了 toml-cli)
toml-check ~/.codex/config.toml

# 检查文件权限
ls -la ~/.codex/config.toml
```

### 测试 API 连接

```bash  theme={null}
# 使用您的凭据测试 API
curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
     -H "Content-Type: application/json" \
     https://ai.megallm.io/v1/models

# 应返回可用模型列表
```

### 测试 Codex/Windsurf

```bash  theme={null}
# 运行 Codex/Windsurf
codex  # 或 'windsurf'

# 检查版本
codex --version  # 或 'windsurf --version'
```

## 故障排除

<AccordionGroup>
  <Accordion title="找不到配置文件">
    **检查目录是否存在:**

    ```bash  theme={null}
    ls -la ~/.codex/
    ```

    **如果缺失则创建:**

    ```bash  theme={null}
    mkdir -p ~/.codex
    # 然后创建 config.toml
    ```

    **验证文件路径:**

    ```bash  theme={null}
    # 应该正是:
    ~/.codex/config.toml
    # 而不是:
    ~/.config/codex/config.toml  # <Icon icon="xmark" /> 错误位置
    ```
  </Accordion>

  <Accordion title="API 密钥不起作用">
    **检查是否设置了环境变量:**

    ```bash  theme={null}
    echo $MEGALLM_API_KEY
    ```

    如果为空:

    ```bash  theme={null}
    # 添加到 shell 配置
    echo 'export MEGALLM_API_KEY="your-key"' >> ~/.bashrc
    source ~/.bashrc
    ```

    **验证密钥格式:**

    * 必须以 `sk-mega-` 开头
    * 至少 20 个字符
    * 没有额外的空格或引号

    **测试密钥:**

    ```bash  theme={null}
    curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="使用错误的模型提供商">
    **检查配置文件:**

    ```bash  theme={null}
    cat ~/.codex/config.toml | grep model_provider
    # 应显示: model_provider = "megallm"
    ```

    **验证 base\_url:**

    ```bash  theme={null}
    cat ~/.codex/config.toml | grep base_url
    # 应显示: base_url = "https://ai.megallm.io/v1"
    ```

    **确保没有拼写错误:**

    ```toml  theme={null}
    model_provider = "megallm"  # <Icon icon="check" /> 正确
    # model_provider = "megalm"  # <Icon icon="xmark" /> 错误(拼写错误)
    # model_provider = "openai"  # <Icon icon="xmark" /> 错误(不同的提供商)
    ```
  </Accordion>

  <Accordion title="TOML 语法错误">
    **验证语法:**

    ```bash  theme={null}
    # 如果安装了 toml-cli
    toml-check ~/.codex/config.toml

    # 或使用 Python
    python3 -c "import tomli; tomli.load(open('~/.codex/config.toml', 'rb'))"
    ```

    **常见 TOML 错误:**

    ```toml  theme={null}
    # <Icon icon="xmark" /> 错误 - 缺少引号
    model_provider = megallm

    # <Icon icon="check" /> 正确
    model_provider = "megallm"

    # <Icon icon="xmark" /> 错误 - 不正确的节语法
    model_providers.megallm
    base_url = "..."

    # <Icon icon="check" /> 正确
    [model_providers.megallm]
    base_url = "..."
    ```
  </Accordion>

  <Accordion title="Codex/Windsurf 未检测到配置">
    **重启 Codex/Windsurf:**

    ```bash  theme={null}
    # 关闭所有实例
    pkill codex  # 或 'pkill windsurf'

    # 重新启动
    codex  # 或 'windsurf'
    ```

    **检查是否有多个配置文件:**

    ```bash  theme={null}
    find ~ -name "config.toml" -path "*/.codex/*"
    # 应该只显示一个文件
    ```

    **验证权限:**

    ```bash  theme={null}
    chmod 644 ~/.codex/config.toml
    ```
  </Accordion>
</AccordionGroup>

## 为什么仅支持系统级?

Codex 和 Windsurf 不支持项目级配置,因为:

1. **单实例** - Codex/Windsurf 在所有项目中作为单个实例运行
2. **全局设置** - 工具偏好设置适用于整个系统
3. **简化管理** - 只需管理一个配置

**项目特定密钥的解决方法:**

在项目中使用环境变量:

```bash  theme={null}
# 在项目目录中
cat > .env << 'EOF'
MEGALLM_API_KEY=project-specific-key
EOF

# 在运行 Codex 之前加载
source .env && codex
```

或创建 shell 别名:

```bash  theme={null}
# 在 ~/.bashrc 或 ~/.zshrc 中
alias codex-project-a='MEGALLM_API_KEY="key-for-project-a" codex'
alias codex-project-b='MEGALLM_API_KEY="key-for-project-b" codex'
```

## 最佳实践

<CardGroup cols={2}>
  <Card title="备份配置" icon="floppy-disk">
    在进行更改之前保留 `config.toml` 的备份
  </Card>

  <Card title="使用环境变量" icon="key">
    将 API 密钥存储在环境变量中,而不是配置文件中
  </Card>

  <Card title="版本控制" icon="code-branch">
    如果使用 env\_key,您可以提交 `config.toml`(无硬编码密钥)
  </Card>

  <Card title="定期更新" icon="rotate">
    保持 Codex/Windsurf 更新以获取最新功能
  </Card>
</CardGroup>

## 对比: Codex vs Windsurf

| 功能            | Codex                 | Windsurf              |
| ------------- | --------------------- | --------------------- |
| 基本配置          | <Icon icon="check" /> | <Icon icon="check" /> |
| MegaLLM 支持    | <Icon icon="check" /> | <Icon icon="check" /> |
| 配置位置          | `~/.codex/`           | `~/.codex/`           |
| Cascade AI    | <Icon icon="xmark" /> | <Icon icon="check" /> |
| Supercomplete | <Icon icon="xmark" /> | <Icon icon="check" /> |
| 多文件编辑         | 基础                    | 增强                    |

<Info>
  Codex 和 Windsurf 使用相同的配置文件位置和格式。
</Info>

## 下一步

<CardGroup cols={2}>
  <Card title="Claude Code 配置" icon="robot" href="/cn/cli/claude-config">
    配置 Claude Code
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

  <Card title="模型目录" icon="layer-group" href="/cn/home/models">
    浏览可用模型
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt