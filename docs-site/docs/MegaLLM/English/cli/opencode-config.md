# OpenCode Configuration

> Configure OpenCode to use MegaLLM

OpenCode uses JSON configuration format and supports both system-level (global) and project-level (local) configuration.

## Configuration Files

### System-Level Configuration

**Location**: `~/.config/opencode/opencode.json`

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
  The CLI fetches available models from MegaLLM and adds them to the `provider.anthropic.models` section automatically.
</Info>

### Project-Level Configuration

**Location**: `./opencode.json` (in project root)

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
  Use project-level configuration to customize settings per project while keeping a global default. The `{env:MEGALLM_API_KEY}` syntax references the environment variable.
</Tip>

## Manual Setup

### System-Level Manual Setup

```bash  theme={null}
# 1. Create directory
mkdir -p ~/.config/opencode

# 2. Create config file
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

# 3. Set environment variable
echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
source ~/.bashrc

# 4. Verify
cat ~/.config/opencode/opencode.json | jq .
```

### Project-Level Manual Setup

```bash  theme={null}
# 1. Navigate to project
cd ~/projects/my-project

# 2. Create config file
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

# 3. Set environment variable (if not already set)
echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
source ~/.bashrc

# 4. Add to .gitignore
echo "opencode.json" >> .gitignore
```

## Configuration Priority

OpenCode loads configuration in this order (highest to lowest priority):

<Steps>
  <Step title="Environment Variables">
    `MEGALLM_API_KEY` environment variable (referenced via `{env:MEGALLM_API_KEY}` in config)
  </Step>

  <Step title="Project-Level Config">
    `./opencode.json` in current directory
  </Step>

  <Step title="System-Level Config">
    `~/.config/opencode/opencode.json` in home directory
  </Step>
</Steps>

## Configuration Options

### Provider Settings

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "models": {
        "gpt-5": {
          "id": "gpt-5",
          "name": "GPT-5 (Via MegaLLM)"
        },
        "claude-sonnet-4": {
          "id": "claude-sonnet-4",
          "name": "Claude Sonnet 4 (Via MegaLLM)"
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
  The CLI automatically fetches and populates the `models` object from the MegaLLM API. You can also manually add or override specific models.
</Info>

### Tool Settings

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

**Available models:**

* `gpt-5` - Latest GPT model
* `gpt-4` - GPT-4
* `claude-opus-4-1-20250805` - Claude Opus
* `claude-sonnet-4` - Claude Sonnet
* `gemini-2.5-pro` - Gemini Pro
* See [Models Catalog](/home/models) for full list

### Complete Example

```json  theme={null}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "models": {
        "gpt-5": {
          "id": "gpt-5",
          "name": "GPT-5 (Via MegaLLM)"
        },
        "gpt-4": {
          "id": "gpt-4",
          "name": "GPT-4 (Via MegaLLM)"
        },
        "claude-sonnet-4": {
          "id": "claude-sonnet-4",
          "name": "Claude Sonnet 4 (Via MegaLLM)"
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

## Team Configuration

For team projects, use environment variables to keep API keys out of version control:

**Shared Configuration** (`opencode.json` - committed to git):

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

**Add to `.gitignore`**:

```
opencode.json
```

**Setup Instructions for Team** (`README.md`):

````markdown  theme={null}
# OpenCode Setup

## Prerequisites
1. Get MegaLLM API key from https://megallm.io/dashboard
2. Install OpenCode: `npm install -g opencode-ai`

## Setup
Set the MEGALLM_API_KEY environment variable:
```bash
export MEGALLM_API_KEY="your-api-key-here"
````

Add to your shell config (\~/.bashrc or \~/.zshrc) to make it permanent.

````

## Environment Variables

The MegaLLM CLI sets the `MEGALLM_API_KEY` environment variable for OpenCode:

```bash
# Set by the CLI automatically
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
````

This environment variable is referenced in the OpenCode configuration using `{env:MEGALLM_API_KEY}`.

Add to your shell configuration:

```bash  theme={null}
# ~/.bashrc or ~/.zshrc
export MEGALLM_API_KEY="sk-mega-your-api-key-here"
```

### Verify Environment Variables

```bash  theme={null}
echo $MEGALLM_API_KEY
# Output: sk-mega-your-api-key-here
```

## Verification

### Check Configuration Files

```bash  theme={null}
# System config
cat ~/.config/opencode/opencode.json | jq .

# Project config
cat opencode.json | jq .
cat opencode.local.json | jq .

# Check file permissions
ls -la ~/.config/opencode/opencode.json
ls -la opencode.json
```

### Validate JSON Syntax

```bash  theme={null}
# Validate JSON
jq . ~/.config/opencode/opencode.json

# Should show formatted JSON or error if invalid
```

### Test API Connection

```bash  theme={null}
# Test with MEGALLM_API_KEY
curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
     -H "Content-Type: application/json" \
     https://ai.megallm.io/v1/models

# Should return list of available models
```

### Test OpenCode

```bash  theme={null}
# Run OpenCode
opencode

# Check version
opencode --version

# Test with a file
echo "console.log('test')" > test.js
opencode test.js
```

## Troubleshooting

<AccordionGroup>
  <Accordion title="Configuration not loading">
    **Check file locations:**

    ```bash  theme={null}
    # System config
    ls -la ~/.config/opencode/opencode.json

    # Project config
    ls -la opencode.json
    ```

    **Validate JSON syntax:**

    ```bash  theme={null}
    jq . ~/.config/opencode/opencode.json
    # Should show formatted JSON
    ```

    **Check you're in the right directory:**

    ```bash  theme={null}
    pwd
    # Should be your project directory for project-level config
    ```
  </Accordion>

  <Accordion title="API key not recognized">
    **Check environment variable:**

    ```bash  theme={null}
    echo $MEGALLM_API_KEY
    ```

    If empty, set it:

    ```bash  theme={null}
    export MEGALLM_API_KEY="your-api-key"
    echo 'export MEGALLM_API_KEY="your-api-key"' >> ~/.bashrc
    source ~/.bashrc
    ```

    **Verify key format:**

    * Must start with `sk-mega-`
    * At least 20 characters
    * No extra spaces or quotes

    **Test the key:**

    ```bash  theme={null}
    curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="Wrong base URL">
    **Check config:**

    ```bash  theme={null}
    jq '.provider.anthropic.options.baseURL' ~/.config/opencode/opencode.json
    # Should show: "https://ai.megallm.io/v1"
    ```

    **Common mistakes:**

    ```json  theme={null}
    {
      "provider": {
        "anthropic": {
          "options": {
            "baseURL": "https://ai.megallm.io/v1"  // <Icon icon="check" /> Correct
            // "baseURL": "https://ai.megallm.io/v1/"  // <Icon icon="xmark" /> Wrong (trailing slash)
            // "baseURL": "https://ai.megallm.io"  // <Icon icon="xmark" /> Wrong (missing /v1)
          }
        }
      }
    }
    ```
  </Accordion>

  <Accordion title="Project config not overriding system config">
    **Verify you have project config:**

    ```bash  theme={null}
    ls -la opencode.json
    ```

    **Ensure proper JSON structure:**
    Project config should use the same structure as system config with `provider.anthropic.options`.
  </Accordion>

  <Accordion title="JSON syntax errors">
    **Common JSON mistakes:**

    ```json  theme={null}
    // <Icon icon="xmark" /> Wrong - trailing comma
    {
      "provider": {
        "anthropic": {
          "options": {
            "apiKey": "{env:MEGALLM_API_KEY}",
          }
        }
      }
    }

    // <Icon icon="check" /> Correct
    {
      "provider": {
        "anthropic": {
          "options": {
            "apiKey": "{env:MEGALLM_API_KEY}"
          }
        }
      }
    }

    // <Icon icon="xmark" /> Wrong - single quotes
    {
      'provider': {
        'anthropic': {
          'options': {
            'apiKey': '{env:MEGALLM_API_KEY}'
          }
        }
      }
    }

    // <Icon icon="check" /> Correct - double quotes
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

    **Validate:**

    ```bash  theme={null}
    jq . ~/.config/opencode/opencode.json
    # Will show error if invalid
    ```
  </Accordion>
</AccordionGroup>

## Best Practices

<CardGroup cols={2}>
  <Card title="Use Local Config for API Keys" icon="key">
    Keep API keys in `opencode.local.json` and add to `.gitignore`
  </Card>

  <Card title="Share Base Config" icon="users">
    Commit `opencode.json` without API keys for team consistency
  </Card>

  <Card title="Project-Specific Settings" icon="folder">
    Use project-level config for project-specific context and settings
  </Card>

  <Card title="Validate JSON" icon="check">
    Always validate JSON syntax after manual edits
  </Card>
</CardGroup>

## Advanced Usage

### Multiple Profiles

```bash  theme={null}
# Create different profiles
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

# Set environment variables
export MEGALLM_API_KEY_DEV="sk-mega-dev-key"
export MEGALLM_API_KEY_PROD="sk-mega-prod-key"

# Switch profiles
alias opencode-dev='cp ~/.config/opencode/opencode.dev.json ~/.config/opencode/opencode.json && opencode'
alias opencode-prod='cp ~/.config/opencode/opencode.prod.json ~/.config/opencode/opencode.json && opencode'
```

### CI/CD Configuration

```yaml  theme={null}
# GitHub Actions example
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

## Next Steps

<CardGroup cols={2}>
  <Card title="Claude Code Config" icon="robot" href="/en/cli/claude-config">
    Configure Claude Code
  </Card>

  <Card title="Codex Config" icon="code" href="/en/cli/codex-config">
    Configure Codex/Windsurf
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