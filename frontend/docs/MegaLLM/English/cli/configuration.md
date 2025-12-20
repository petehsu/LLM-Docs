# Configuration Overview

> The MegaLLM CLI configures AI coding assistants by creating configuration files and setting environment variables. Each tool has its own configuration format and storage location.

## Configuration Locations

<CardGroup cols={3}>
  <Card title="Claude Code" icon="robot" href="/en/cli/claude-config">
    JSON files in `~/.claude/` or `./.claude/`
  </Card>

  <Card title="Codex/Windsurf" icon="code" href="/en/cli/codex-config">
    TOML file in `~/.codex/`
  </Card>

  <Card title="OpenCode" icon="brackets-curly" href="/en/cli/opencode-config">
    JSON file in `~/.config/opencode/` or `./`
  </Card>
</CardGroup>

## Configuration Levels

### System-Level (Global)

Applies to all projects on your machine.

| Tool           | Location                                        |
| -------------- | ----------------------------------------------- |
| Claude Code    | `~/.claude/settings.json`<br />`~/.claude.json` |
| Codex/Windsurf | `~/.codex/config.toml`                          |
| OpenCode       | `~/.config/opencode/opencode.json`              |

### Project-Level (Local)

Applies only to the current project directory.

| Tool           | Location                                                       |
| -------------- | -------------------------------------------------------------- |
| Claude Code    | `./.claude/settings.json`<br />`./.claude/settings.local.json` |
| Codex/Windsurf | <Icon icon="xmark" /> Not supported                            |
| OpenCode       | `./opencode.json`                                              |

<Warning>
  **Codex/Windsurf only supports system-level configuration**
</Warning>

## Environment Variables

The CLI automatically sets these environment variables in your shell configuration file.

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
  **Note**: Codex/Windsurf and OpenCode share the same `MEGALLM_API_KEY` environment variable.
</Info>

### Verify Environment Variables

```bash  theme={null}
# Claude Code
echo $ANTHROPIC_BASE_URL
# Output: https://ai.megallm.io

echo $ANTHROPIC_API_KEY
# Output: sk-mega-your-api-key-here

# Codex/Windsurf & OpenCode
echo $MEGALLM_API_KEY
# Output: sk-mega-your-api-key-here
```

## Configuration Priority

When multiple configurations exist, they're applied in this order (highest to lowest):

<Steps>
  <Step title="Environment Variables">
    Highest priority - overrides all file-based configurations
  </Step>

  <Step title="Project-Level Config">
    Second priority - applies only to current project
  </Step>

  <Step title="System-Level Config">
    Default - applies globally across all projects
  </Step>
</Steps>

## Backup Files

The CLI automatically creates backup files before modifying configurations:

```
~/.claude/settings.json.backup
~/.codex/config.toml.backup
~/.config/opencode/opencode.json.backup
```

To restore from backup:

```bash  theme={null}
mv ~/.claude/settings.json.backup ~/.claude/settings.json
```

## Tool-Specific Configuration

Select your AI tool for detailed configuration information:

<CardGroup cols={2}>
  <Card title="Claude Code Configuration" icon="robot" href="/en/cli/claude-config">
    JSON configuration, environment variables, and statusline setup
  </Card>

  <Card title="Codex/Windsurf Configuration" icon="code" href="/en/cli/codex-config">
    TOML configuration and model provider setup
  </Card>

  <Card title="OpenCode Configuration" icon="brackets-curly" href="/en/cli/opencode-config">
    JSON configuration and API settings
  </Card>
</CardGroup>

## Quick Configuration Checks

### Verify All Configurations

```bash  theme={null}
# Check Claude Code
ls -la ~/.claude/
cat ~/.claude/settings.json

# Check Codex
ls -la ~/.codex/
cat ~/.codex/config.toml

# Check OpenCode
ls -la ~/.config/opencode/
cat ~/.config/opencode/opencode.json

# Check environment variables
env | grep -E "ANTHROPIC|MEGALLM"
```

### Test API Connection

```bash  theme={null}
# Test with Claude Code credentials
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     $ANTHROPIC_BASE_URL/v1/models

# Test with Codex/OpenCode credentials
curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
     -H "Content-Type: application/json" \
     https://ai.megallm.io/v1/models
```

## Manual Configuration

If you prefer not to use the CLI, you can configure manually:

<Tabs>
  <Tab title="Claude Code">
    ```bash  theme={null}
    # Create directory
    mkdir -p ~/.claude

    # Create settings file
    cat > ~/.claude/settings.json << 'EOF'
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
        "ANTHROPIC_API_KEY": "your-api-key"
      }
    }
    EOF

    # Add to shell config
    echo 'export ANTHROPIC_BASE_URL="https://ai.megallm.io"' >> ~/.bashrc
    echo 'export ANTHROPIC_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Tab>

  <Tab title="Codex/Windsurf">
    ```bash  theme={null}
    # Create directory
    mkdir -p ~/.codex

    # Create config file
    cat > ~/.codex/config.toml << 'EOF'
    model_provider = "megallm"
    model = "gpt-5"

    [model_providers.megallm]
    name = "OpenAI using Chat Completions"
    base_url = "https://ai.megallm.io/v1"
    env_key = "MEGALLM_API_KEY"
    query_params = {}
    EOF

    # Add to shell config
    echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Tab>

  <Tab title="OpenCode">
    ```bash  theme={null}
    # Create directory
    mkdir -p ~/.config/opencode

    # Create config file
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

    # Add to shell config
    echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Tab>
</Tabs>

## Configuration Best Practices

<CardGroup cols={2}>
  <Card title="Use Project-Level for Teams" icon="users">
    Keep project-specific configurations in version control (without API keys)
  </Card>

  <Card title="Secure API Keys" icon="lock">
    Never commit API keys. Use `.gitignore` and environment variables
  </Card>

  <Card title="Regular Backups" icon="floppy-disk">
    CLI creates automatic backups, but keep your own copies of important configs
  </Card>

  <Card title="Test After Changes" icon="flask">
    Always verify configuration works after manual modifications
  </Card>
</CardGroup>

## Next Steps

<CardGroup cols={2}>
  <Card title="Claude Code Config" icon="robot" href="/en/cli/claude-config">
    Detailed Claude Code configuration
  </Card>

  <Card title="Codex Config" icon="code" href="/en/cli/codex-config">
    Detailed Codex/Windsurf configuration
  </Card>

  <Card title="OpenCode Config" icon="brackets-curly" href="/en/cli/opencode-config">
    Detailed OpenCode configuration
  </Card>

  <Card title="Examples" icon="code-branch" href="/en/cli/examples">
    Practical configuration examples
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt