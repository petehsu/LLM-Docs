# Codex/Windsurf Configuration

> Configure Codex and Windsurf to use MegaLLM

Codex and Windsurf use TOML configuration format and only support system-level (global) configuration. The CLI automatically detects which variant you have installed.

<Note>
  Windsurf is a variant of Codex with enhanced features. The configuration is identical for both.
</Note>

## Configuration File

**Location**: `~/.codex/config.toml`

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
  **Codex/Windsurf only supports system-level configuration.** Project-level configuration is not available.
</Warning>

## Environment Variable

The configuration references an environment variable for the API key:

```bash  theme={null}
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
```

This is added to your shell configuration file:

* `~/.bashrc` (bash)
* `~/.zshrc` (zsh)
* `~/.config/fish/config.fish` (fish)
* PowerShell profile (Windows)

### Verify Environment Variable

```bash  theme={null}
echo $MEGALLM_API_KEY
# Output: sk-mega-your-api-key-here
```

## Manual Setup

If you prefer not to use the CLI:

```bash  theme={null}
# 1. Create directory
mkdir -p ~/.codex

# 2. Create config file
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

# 3. Add environment variable to shell config
echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc

# 4. Reload shell
source ~/.bashrc
```

## Configuration Options

### Model Selection

Change the default model in the configuration:

```toml  theme={null}
model = "claude-opus-4-1-20250805"  # or any supported model
```

**Available models:**

* `gpt-5` - Latest GPT model
* `gpt-4` - GPT-4
* `gpt-4o` - GPT-4 Optimized
* `claude-opus-4-1-20250805` - Claude Opus
* `claude-sonnet-4` - Claude Sonnet
* `gemini-2.5-pro` - Gemini Pro
* See [Models Catalog](/home/models) for full list

### Tool Settings

Enable or disable integrated tools:

```toml  theme={null}
[tools]
web_search = true      # Enable web search capability
file_browser = true    # Enable file browser
terminal = true        # Enable terminal access
code_execution = true  # Enable code execution
```

### Advanced Configuration

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

## Multiple API Keys

If you need different API keys for different purposes:

### Using Environment Variables

```bash  theme={null}
# Development key
export MEGALLM_API_KEY="sk-mega-dev-key"

# Production key
export MEGALLM_API_KEY_PROD="sk-mega-prod-key"
```

### Switching Configurations

```bash  theme={null}
# Create backup of current config
cp ~/.codex/config.toml ~/.codex/config.toml.backup

# Development config
cat > ~/.codex/config.toml.dev << 'EOF'
model_provider = "megallm"
model = "gpt-4o-mini"

[model_providers.megallm]
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY_DEV"
EOF

# Production config
cat > ~/.codex/config.toml.prod << 'EOF'
model_provider = "megallm"
model = "gpt-5"

[model_providers.megallm]
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY_PROD"
EOF

# Switch to dev
cp ~/.codex/config.toml.dev ~/.codex/config.toml

# Switch to prod
cp ~/.codex/config.toml.prod ~/.codex/config.toml
```

## Windsurf-Specific Features

Windsurf includes additional configuration options:

```toml  theme={null}
model_provider = "megallm"
model = "gpt-5"

[model_providers.megallm]
name = "OpenAI using Chat Completions"
base_url = "https://ai.megallm.io/v1"
env_key = "MEGALLM_API_KEY"
query_params = {}

[windsurf]
cascade_mode = true           # Enable Cascade AI feature
multi_file_edit = true        # Allow editing multiple files
context_awareness = "enhanced" # enhanced, standard, minimal

[tools]
web_search = true
file_browser = true
terminal = true
supercomplete = true          # Windsurf autocomplete feature
```

## Verification

### Check Configuration File

```bash  theme={null}
# View configuration
cat ~/.codex/config.toml

# Validate TOML syntax (if toml-cli installed)
toml-check ~/.codex/config.toml

# Check file permissions
ls -la ~/.codex/config.toml
```

### Test API Connection

```bash  theme={null}
# Test API with your credentials
curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
     -H "Content-Type: application/json" \
     https://ai.megallm.io/v1/models

# Should return list of available models
```

### Test Codex/Windsurf

```bash  theme={null}
# Run Codex/Windsurf
codex  # or 'windsurf'

# Check version
codex --version  # or 'windsurf --version'
```

## Troubleshooting

<AccordionGroup>
  <Accordion title="Configuration file not found">
    **Check if directory exists:**

    ```bash  theme={null}
    ls -la ~/.codex/
    ```

    **Create if missing:**

    ```bash  theme={null}
    mkdir -p ~/.codex
    # Then create config.toml
    ```

    **Verify file path:**

    ```bash  theme={null}
    # Should be exactly:
    ~/.codex/config.toml
    # Not:
    ~/.config/codex/config.toml  # <Icon icon="xmark" /> Wrong location
    ```
  </Accordion>

  <Accordion title="API key not working">
    **Check environment variable is set:**

    ```bash  theme={null}
    echo $MEGALLM_API_KEY
    ```

    If empty:

    ```bash  theme={null}
    # Add to shell config
    echo 'export MEGALLM_API_KEY="your-key"' >> ~/.bashrc
    source ~/.bashrc
    ```

    **Verify key format:**

    * Must start with `sk-mega-`
    * At least 20 characters
    * No extra spaces or quotes

    **Test the key:**

    ```bash  theme={null}
    curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="Wrong model provider being used">
    **Check config file:**

    ```bash  theme={null}
    cat ~/.codex/config.toml | grep model_provider
    # Should show: model_provider = "megallm"
    ```

    **Verify base\_url:**

    ```bash  theme={null}
    cat ~/.codex/config.toml | grep base_url
    # Should show: base_url = "https://ai.megallm.io/v1"
    ```

    **Ensure no typos:**

    ```toml  theme={null}
    model_provider = "megallm"  # <Icon icon="check" /> Correct
    # model_provider = "megalm"  # <Icon icon="xmark" /> Wrong (typo)
    # model_provider = "openai"  # <Icon icon="xmark" /> Wrong (different provider)
    ```
  </Accordion>

  <Accordion title="TOML syntax errors">
    **Validate syntax:**

    ```bash  theme={null}
    # If you have toml-cli installed
    toml-check ~/.codex/config.toml

    # Or use Python
    python3 -c "import tomli; tomli.load(open('~/.codex/config.toml', 'rb'))"
    ```

    **Common TOML mistakes:**

    ```toml  theme={null}
    # <Icon icon="xmark" /> Wrong - missing quotes
    model_provider = megallm

    # <Icon icon="check" /> Correct
    model_provider = "megallm"

    # <Icon icon="xmark" /> Wrong - incorrect section syntax
    model_providers.megallm
    base_url = "..."

    # <Icon icon="check" /> Correct
    [model_providers.megallm]
    base_url = "..."
    ```
  </Accordion>

  <Accordion title="Codex/Windsurf not detecting configuration">
    **Restart Codex/Windsurf:**

    ```bash  theme={null}
    # Close all instances
    pkill codex  # or 'pkill windsurf'

    # Start fresh
    codex  # or 'windsurf'
    ```

    **Check for multiple config files:**

    ```bash  theme={null}
    find ~ -name "config.toml" -path "*/.codex/*"
    # Should only show one file
    ```

    **Verify permissions:**

    ```bash  theme={null}
    chmod 644 ~/.codex/config.toml
    ```
  </Accordion>
</AccordionGroup>

## Why System-Level Only?

Codex and Windsurf don't support project-level configuration because:

1. **Single Instance** - Codex/Windsurf runs as a single instance across all projects
2. **Global Settings** - Tool preferences apply system-wide
3. **Simplified Management** - One configuration to manage

**Workaround for Project-Specific Keys:**

Use environment variables in your project:

```bash  theme={null}
# In project directory
cat > .env << 'EOF'
MEGALLM_API_KEY=project-specific-key
EOF

# Load before running Codex
source .env && codex
```

Or create shell aliases:

```bash  theme={null}
# In ~/.bashrc or ~/.zshrc
alias codex-project-a='MEGALLM_API_KEY="key-for-project-a" codex'
alias codex-project-b='MEGALLM_API_KEY="key-for-project-b" codex'
```

## Best Practices

<CardGroup cols={2}>
  <Card title="Backup Configuration" icon="floppy-disk">
    Keep backup of `config.toml` before making changes
  </Card>

  <Card title="Use Environment Variables" icon="key">
    Store API keys in environment variables, not in config file
  </Card>

  <Card title="Version Control" icon="code-branch">
    You can commit `config.toml` if env\_key is used (no hardcoded keys)
  </Card>

  <Card title="Regular Updates" icon="rotate">
    Keep Codex/Windsurf updated for latest features
  </Card>
</CardGroup>

## Comparison: Codex vs Windsurf

| Feature            | Codex                 | Windsurf              |
| ------------------ | --------------------- | --------------------- |
| Base Configuration | <Icon icon="check" /> | <Icon icon="check" /> |
| MegaLLM Support    | <Icon icon="check" /> | <Icon icon="check" /> |
| Config Location    | `~/.codex/`           | `~/.codex/`           |
| Cascade AI         | <Icon icon="xmark" /> | <Icon icon="check" /> |
| Supercomplete      | <Icon icon="xmark" /> | <Icon icon="check" /> |
| Multi-file Edit    | Basic                 | Enhanced              |

<Info>
  Both Codex and Windsurf use the same configuration file location and format.
</Info>

## Next Steps

<CardGroup cols={2}>
  <Card title="Claude Code Config" icon="robot" href="/en/cli/claude-config">
    Configure Claude Code
  </Card>

  <Card title="OpenCode Config" icon="brackets-curly" href="/en/cli/opencode-config">
    Configure OpenCode
  </Card>

  <Card title="Examples" icon="code-branch" href="/en/cli/examples">
    See practical examples
  </Card>

  <Card title="All Agents Config" icon="window" href="/en/agents/overview">
    Configure all CLI and GUI agents
  </Card>

  <Card title="Models Catalog" icon="layer-group" href="/en/home/models">
    Browse available models
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt