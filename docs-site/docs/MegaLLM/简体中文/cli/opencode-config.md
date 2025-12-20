# OpenCode 配置

> 配置 OpenCode 以使用 MegaLLM

OpenCode 使用 JSON 配置格式,支持系统级(全局)和项目级(本地)配置。

## 配置文件

### 系统级配置

**位置**: `~/.config/opencode/opencode.json`

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  },
  "autoupdate": true,
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
```

<Info>
  CLI 会从 MegaLLM 获取可用模型并自动添加到 `provider.anthropic.models` 部分。
</Info>

### 项目级配置

**位置**: `./opencode.json` (项目根目录)

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  },
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
```

<Tip>
  使用项目级配置可以为每个项目自定义设置,同时保留全局默认值。`{env:MEGALLM_API_KEY}` 语法引用环境变量。
</Tip>

## 手动设置

### 系统级手动设置

```bash  theme={null}
# 1. 创建目录
mkdir -p ~/.config/opencode

# 2. 创建配置文件
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
  },
  "autoupdate": true,
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
EOF

# 3. 设置环境变量
echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
source ~/.bashrc

# 4. 验证
cat ~/.config/opencode/opencode.json | jq .
```

### 项目级手动设置

```bash  theme={null}
# 1. 导航到项目
cd ~/projects/my-project

# 2. 创建配置文件
cat > opencode.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  },
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
EOF

# 3. 设置环境变量(如果尚未设置)
echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
source ~/.bashrc

# 4. 添加到 .gitignore
echo "opencode.json" >> .gitignore
```

## 配置优先级

OpenCode 按以下顺序加载配置(优先级从高到低):

<Steps>
  <Step title="环境变量">
    `MEGALLM_API_KEY` 环境变量(通过配置中的 `{env:MEGALLM_API_KEY}` 引用)
  </Step>

  <Step title="项目级配置">
    当前目录中的 `./opencode.json`
  </Step>

  <Step title="系统级配置">
    主目录中的 `~/.config/opencode/opencode.json`
  </Step>
</Steps>

## 配置选项

### 提供商设置

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "models": {
        "gpt-5": {
          "id": "gpt-5",
          "name": "GPT-5 (通过 MegaLLM)"
        },
        "claude-sonnet-4": {
          "id": "claude-sonnet-4",
          "name": "Claude Sonnet 4 (通过 MegaLLM)"
        }
      },
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  }
}
```

<Info>
  CLI 会自动从 MegaLLM API 获取并填充 `models` 对象。您也可以手动添加或覆盖特定模型。
</Info>

### 工具设置

```json  theme={null}
{
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  },
  "autoupdate": true
}
```

**可用模型:**

* `gpt-5` - 最新 GPT 模型
* `gpt-4` - GPT-4
* `claude-opus-4-1-20250805` - Claude Opus
* `claude-sonnet-4` - Claude Sonnet
* `gemini-2.5-pro` - Gemini Pro
* 查看[模型目录](/cn/home/models)获取完整列表

### 完整示例

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "models": {
        "gpt-5": {
          "id": "gpt-5",
          "name": "GPT-5 (通过 MegaLLM)"
        },
        "gpt-4": {
          "id": "gpt-4",
          "name": "GPT-4 (通过 MegaLLM)"
        },
        "claude-sonnet-4": {
          "id": "claude-sonnet-4",
          "name": "Claude Sonnet 4 (通过 MegaLLM)"
        }
      },
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  },
  "autoupdate": true,
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
```

## 团队配置

对于团队项目,使用环境变量将 API 密钥排除在版本控制之外:

**共享配置** (`opencode.json` - 提交到 git):

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  },
  "autoupdate": true,
  "tools": {
    "bash": true,
    "edit": true,
    "write": true,
    "read": true
  }
}
```

**添加到 `.gitignore`**:

```
opencode.json
```

**团队设置说明** (`README.md`):

````markdown  theme={null}
# OpenCode 设置

## 先决条件
1. 从 https://megallm.io/dashboard 获取 MegaLLM API 密钥
2. 安装 OpenCode: `npm install -g opencode-ai`

## 设置
设置 MEGALLM_API_KEY 环境变量:
```bash
export MEGALLM_API_KEY="your-api-key-here"
````

添加到您的 shell 配置文件 (\~/.bashrc 或 \~/.zshrc) 以使其永久生效。

````

## 环境变量

MegaLLM CLI 为 OpenCode 设置 `MEGALLM_API_KEY` 环境变量:

```bash
# CLI 自动设置
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
````

此环境变量在 OpenCode 配置中使用 `{env:MEGALLM_API_KEY}` 引用。

添加到您的 shell 配置:

```bash  theme={null}
# ~/.bashrc 或 ~/.zshrc
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
```

### 验证环境变量

```bash  theme={null}
echo $MEGALLM_API_KEY
# 输出: sk-mega-your-api-key-here
```

## 验证

### 检查配置文件

```bash  theme={null}
# 系统配置
cat ~/.config/opencode/opencode.json | jq .

# 项目配置
cat opencode.json | jq .
cat opencode.local.json | jq .

# 检查文件权限
ls -la ~/.config/opencode/opencode.json
ls -la opencode.json
```

### 验证 JSON 语法

```bash  theme={null}
# 验证 JSON
jq . ~/.config/opencode/opencode.json

# 应显示格式化的 JSON 或错误(如果无效)
```

### 测试 API 连接

```bash  theme={null}
# 使用 MEGALLM_API_KEY 测试
curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
     -H "Content-Type: application/json" \
     https://ai.megallm.io/v1/models

# 应返回可用模型列表
```

### 测试 OpenCode

```bash  theme={null}
# 运行 OpenCode
opencode

# 检查版本
opencode --version

# 使用文件测试
echo "console.log('test')" > test.js
opencode test.js
```

## 故障排除

<AccordionGroup>
  <Accordion title="配置未加载">
    **检查文件位置:**

    ```bash  theme={null}
    # 系统配置
    ls -la ~/.config/opencode/opencode.json

    # 项目配置
    ls -la opencode.json
    ```

    **验证 JSON 语法:**

    ```bash  theme={null}
    jq . ~/.config/opencode/opencode.json
    # 应显示格式化的 JSON
    ```

    **检查您是否在正确的目录:**

    ```bash  theme={null}
    pwd
    # 对于项目级配置,应该是您的项目目录
    ```
  </Accordion>

  <Accordion title="API 密钥未识别">
    **检查环境变量:**

    ```bash  theme={null}
    echo $MEGALLM_API_KEY
    ```

    如果为空,设置它:

    ```bash  theme={null}
    export MEGALLM_API_KEY="your-api-key"
    echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```

    **验证密钥格式:**

    * 必须以 `sk-mega-` 开头
    * 至少 20 个字符
    * 没有额外的空格或引号

    **测试密钥:**

    ```bash  theme={null}
    curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="错误的基础 URL">
    **检查配置:**

    ```bash  theme={null}
    jq '.provider.anthropic.options.baseURL' ~/.config/opencode/opencode.json
    # 应显示: "https://ai.megallm.io/v1"
    ```

    **常见错误:**

    ```json  theme={null}
    {
      "provider": {
        "anthropic": {
          "options": {
            "baseURL": "https://ai.megallm.io/v1"  // <Icon icon="check" /> 正确
            // "baseURL": "https://ai.megallm.io/v1/"  // <Icon icon="xmark" /> 错误(尾部斜杠)
            // "baseURL": "https://ai.megallm.io"  // <Icon icon="xmark" /> 错误(缺少 /v1)
          }
        }
      }
    }
    ```
  </Accordion>

  <Accordion title="项目配置未覆盖系统配置">
    **验证您有项目配置:**

    ```bash  theme={null}
    ls -la opencode.json
    ```

    **确保正确的 JSON 结构:**
    项目配置应使用与系统配置相同的结构,包含 `provider.anthropic.options`。
  </Accordion>

  <Accordion title="JSON 语法错误">
    **常见 JSON 错误:**

    ```json  theme={null}
    // <Icon icon="xmark" /> 错误 - 尾随逗号
    {
      "provider": {
        "anthropic": {
          "options": {
            "apiKey": "{env:MEGALLM_API_KEY}",
          }
        }
      }
    }

    // <Icon icon="check" /> 正确
    {
      "provider": {
        "anthropic": {
          "options": {
            "apiKey": "{env:MEGALLM_API_KEY}"
          }
        }
      }
    }

    // <Icon icon="xmark" /> 错误 - 单引号
    {
      'provider': {
        'anthropic': {
          'options': {
            'apiKey': '{env:MEGALLM_API_KEY}'
          }
        }
      }
    }

    // <Icon icon="check" /> 正确 - 双引号
    {
      "provider": {
        "anthropic": {
          "options": {
            "apiKey": "{env:MEGALLM_API_KEY}"
          }
        }
      }
    }
    ```

    **验证:**

    ```bash  theme={null}
    jq . ~/.config/opencode/opencode.json
    # 如果无效将显示错误
    ```
  </Accordion>
</AccordionGroup>

## 最佳实践

<CardGroup cols={2}>
  <Card title="使用本地配置存储 API 密钥" icon="key">
    将 API 密钥保存在 `opencode.local.json` 中并添加到 `.gitignore`
  </Card>

  <Card title="共享基础配置" icon="users">
    提交不含 API 密钥的 `opencode.json` 以保持团队一致性
  </Card>

  <Card title="项目特定设置" icon="folder">
    使用项目级配置进行项目特定的上下文和设置
  </Card>

  <Card title="验证 JSON" icon="check">
    手动编辑后始终验证 JSON 语法
  </Card>
</CardGroup>

## 高级用法

### 多配置文件

```bash  theme={null}
# 创建不同的配置文件
cat > ~/.config/opencode/opencode.dev.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY_DEV}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  }
}
EOF

cat > ~/.config/opencode/opencode.prod.json << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "apiKey": "{env:MEGALLM_API_KEY_PROD}",
        "baseURL": "https://ai.megallm.io/v1"
      }
    }
  }
}
EOF

# 设置环境变量
export MEGALLM_API_KEY_DEV="sk-mega-dev-key"
export MEGALLM_API_KEY_PROD="sk-mega-prod-key"

# 切换配置文件
alias opencode-dev='cp ~/.config/opencode/opencode.dev.json ~/.config/opencode/opencode.json && opencode'
alias opencode-prod='cp ~/.config/opencode/opencode.prod.json ~/.config/opencode/opencode.json && opencode'
```

### CI/CD 配置

```yaml  theme={null}
# GitHub Actions 示例
- name: Configure OpenCode
  env:
    MEGALLM_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
  run: |
    mkdir -p ~/.config/opencode
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
```

## 下一步

<CardGroup cols={2}>
  <Card title="Claude Code 配置" icon="robot" href="/cn/cli/claude-config">
    配置 Claude Code
  </Card>

  <Card title="Codex 配置" icon="code" href="/cn/cli/codex-config">
    配置 Codex/Windsurf
  </Card>

  <Card title="示例" icon="code-branch" href="/cn/cli/examples">
    查看实际示例
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