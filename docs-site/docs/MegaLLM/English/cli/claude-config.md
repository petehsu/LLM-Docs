# Claude Code Configuration

> Configure Claude Code to use MegaLLM

Claude Code uses JSON configuration files for settings and API key approvals. Configuration can be at the system level (global) or project level (local).

## Configuration Files

### System-Level Configuration

**Settings File**: `~/.claude/settings.json`

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
  }
}
```

**API Key Approvals**: `~/.claude.json`

```json  theme={null}
{
  "customApiKeyResponses": {
    "approved": ["last-20-chars-of-key"],
    "rejected": []
  }
}
```

<Info>
  The API key approval file stores the last 20 characters of your API key to remember your approval decision when Claude Code prompts you.
</Info>

### Project-Level Configuration

**Settings File**: `./.claude/settings.json`

```json  theme={null}
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
  }
}
```

**Local Settings (Gitignored)**: `./.claude/settings.local.json`

```json  theme={null}
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-your-personal-key"
  }
}
```

<Tip>
  Use `settings.local.json` to keep your personal API key out of version control while sharing base configuration with your team.
</Tip>

## Environment Variables

The CLI sets these environment variables in your shell configuration:

```bash  theme={null}
export ANTHROPIC_BASE_URL="https://ai.megallm.io"
export ANTHROPIC_API_KEY="sk-mega-your-api-key-here"
```

These are added to:

* `~/.bashrc` (bash)
* `~/.zshrc` (zsh)
* `~/.config/fish/config.fish` (fish)
* PowerShell profile (Windows)

### Verify Environment Variables

```bash  theme={null}
echo $ANTHROPIC_BASE_URL
# Output: https://ai.megallm.io

echo $ANTHROPIC_API_KEY
# Output: sk-mega-your-api-key-here
```

## Configuration Priority

Claude Code loads configuration in this order (highest to lowest priority):

<Steps>
  <Step title="Environment Variables">
    `ANTHROPIC_BASE_URL` and `ANTHROPIC_API_KEY` from your shell
  </Step>

  <Step title="Project-Level Local Settings">
    `./.claude/settings.local.json` in current directory
  </Step>

  <Step title="Project-Level Settings">
    `./.claude/settings.json` in current directory
  </Step>

  <Step title="System-Level Settings">
    `~/.claude/settings.json` in home directory
  </Step>
</Steps>

## Statusline Configuration (Optional)

Claude Code supports an enhanced statusline for better terminal UI:

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

The CLI will prompt you to set this up during configuration.

## Manual Setup

If you prefer not to use the CLI:

### System-Level Manual Setup

```bash  theme={null}
# 1. Create directory
mkdir -p ~/.claude

# 2. Create settings file
cat > ~/.claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
    "ANTHROPIC_API_KEY": "your-api-key"
  }
}
EOF

# 3. Create API key approval file
cat > ~/.claude.json << 'EOF'
{
  "customApiKeyResponses": {
    "approved": ["last-20-chars-of-your-key"],
    "rejected": []
  }
}
EOF

# 4. Add environment variables to shell config
echo 'export ANTHROPIC_BASE_URL="https://ai.megallm.io"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="your-api-key"' >> ~/.bashrc

# 5. Reload shell
source ~/.bashrc
```

### Project-Level Manual Setup

```bash  theme={null}
# 1. Navigate to your project
cd ~/projects/my-project

# 2. Create directory
mkdir -p .claude

# 3. Create settings file (without API key for version control)
cat > .claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
  }
}
EOF

# 4. Create local settings file (with API key, not committed)
cat > .claude/settings.local.json << 'EOF'
{
  "env": {
    "ANTHROPIC_API_KEY": "your-api-key"
  }
}
EOF

# 5. Add to .gitignore
echo ".claude/settings.local.json" >> .gitignore
echo ".claude.json" >> .gitignore

# 6. Commit shared config
git add .claude/settings.json .gitignore
git commit -m "Add MegaLLM configuration for Claude Code"
```

## Team Configuration

For team projects, separate shared config from personal API keys:

**Shared Configuration** (`.claude/settings.json` - committed to git):

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

**Personal Configuration** (`.claude/settings.local.json` - not committed):

```json  theme={null}
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-personal-key-here"
  }
}
```

**Setup Instructions for Team** (`.claude/README.md`):

````markdown  theme={null}
# MegaLLM Claude Code Setup

## Prerequisites
1. Get your MegaLLM API key from https://megallm.io/dashboard
2. Install Claude Code: `npm install -g @anthropic-ai/claude-code`

## Setup
1. Create `.claude/settings.local.json`:
   ```json
   {
     "env": {
       "ANTHROPIC_API_KEY": "your-key-here"
     }
   }
````

2. Or set environment variable:
   ```bash  theme={null}
   export ANTHROPIC_API_KEY="your-key-here"
   ```

````

## Configuration Options

### Available Settings

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

### Model Selection

Change the default model:

```json  theme={null}
{
  "env": {
    "ANTHROPIC_MODEL": "claude-opus-4-1-20250805"
  }
}
```

Or specify in environment variable:

```bash  theme={null}
export ANTHROPIC_MODEL="gpt-5"
```

See [Models Catalog](/home/models) for available models.

## Verification

### Check Configuration Files

```bash  theme={null}
# View settings
cat ~/.claude/settings.json | jq .

# View API key approval
cat ~/.claude.json | jq .

# Check project config
cat .claude/settings.json | jq .
cat .claude/settings.local.json | jq .
```

### Test API Connection

```bash  theme={null}
# Test API with your credentials
curl -H "Authorization: Bearer $ANTHROPIC_API_KEY" \
     -H "Content-Type: application/json" \
     $ANTHROPIC_BASE_URL/v1/models

# Should return list of available models
```

### Test Claude Code

```bash  theme={null}
# Run Claude Code
claude-code

# Or test with a simple prompt
echo "What is 2+2?" | claude-code
```

## Troubleshooting

<AccordionGroup>
  <Accordion title="Configuration not loading">
    **Check file locations:**

    ```bash  theme={null}
    ls -la ~/.claude/
    ls -la .claude/
    ```

    **Verify JSON syntax:**

    ```bash  theme={null}
    jq . ~/.claude/settings.json
    # Should show formatted JSON, or error if invalid
    ```

    **Check permissions:**

    ```bash  theme={null}
    ls -la ~/.claude/settings.json
    # Should be readable: -rw-r--r--
    ```
  </Accordion>

  <Accordion title="API key not recognized">
    **Verify environment variable:**

    ```bash  theme={null}
    echo $ANTHROPIC_API_KEY
    ```

    If empty, reload shell:

    ```bash  theme={null}
    source ~/.bashrc  # or ~/.zshrc
    ```

    **Check API key in config:**

    ```bash  theme={null}
    jq .env.ANTHROPIC_API_KEY ~/.claude/settings.json
    ```

    **Verify API key format:**

    * Must start with `sk-mega-`
    * At least 20 characters long
    * No extra spaces or quotes
  </Accordion>

  <Accordion title="Wrong base URL being used">
    **Check environment variable:**

    ```bash  theme={null}
    echo $ANTHROPIC_BASE_URL
    # Should be: https://ai.megallm.io
    ```

    **Verify in config:**

    ```bash  theme={null}
    jq .env.ANTHROPIC_BASE_URL ~/.claude/settings.json
    ```

    **Common mistake - trailing slash:**

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io"  // ✅ Correct
        // "ANTHROPIC_BASE_URL": "https://ai.megallm.io/"  // ❌ Wrong
      }
    }
    ```
  </Accordion>

  <Accordion title="Project config not overriding system config">
    **Check you're in the right directory:**

    ```bash  theme={null}
    pwd
    ls -la .claude/
    ```

    **Verify config priority:**

    ```bash  theme={null}
    # Project config should override system
    cat .claude/settings.json
    cat ~/.claude/settings.json
    ```

    **Check for settings.local.json:**

    ```bash  theme={null}
    cat .claude/settings.local.json
    # This has highest priority
    ```
  </Accordion>
</AccordionGroup>

## Advanced Configuration

### Multiple Profiles

Use different configurations for different use cases:

```bash  theme={null}
# Development profile
cat > ~/.claude/settings.dev.json << 'EOF'
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-dev-key"
  },
  "model": "gpt-4o-mini",
  "temperature": 0.9
}
EOF

# Production profile
cat > ~/.claude/settings.prod.json << 'EOF'
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-mega-prod-key"
  },
  "model": "gpt-5",
  "temperature": 0.5
}
EOF

# Switch profiles
cp ~/.claude/settings.dev.json ~/.claude/settings.json
```

### Environment-Specific Configuration

```bash  theme={null}
# Set different configs based on environment
if [ "$NODE_ENV" = "production" ]; then
  export ANTHROPIC_API_KEY="$PROD_API_KEY"
else
  export ANTHROPIC_API_KEY="$DEV_API_KEY"
fi
```

## Best Practices

<CardGroup cols={2}>
  <Card title="Separate API Keys" icon="key">
    Use `.gitignore` for `settings.local.json` to keep API keys private
  </Card>

  <Card title="Project-Level for Teams" icon="users">
    Use project-level config for team projects with shared settings
  </Card>

  <Card title="Environment Variables" icon="terminal">
    Prefer environment variables in CI/CD environments
  </Card>

  <Card title="Regular Updates" icon="rotate">
    Keep Claude Code updated for latest features and fixes
  </Card>
</CardGroup>

## Next Steps

<CardGroup cols={2}>
  <Card title="Codex Configuration" icon="code" href="/en/cli/codex-config">
    Configure Codex/Windsurf
  </Card>

  <Card title="OpenCode Configuration" icon="brackets-curly" href="/en/cli/opencode-config">
    Configure OpenCode
  </Card>

  <Card title="Examples" icon="code-branch" href="/en/cli/examples">
    See practical examples
  </Card>

  <Card title="All Agents Config" icon="window" href="/en/agents/overview">
    Configure all CLI and GUI agents
  </Card>

  <Card title="Troubleshooting" icon="circle-exclamation" href="/en/cli/troubleshooting">
    Common issues and solutions
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt