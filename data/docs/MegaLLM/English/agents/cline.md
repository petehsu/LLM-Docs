# Cline Configuration

> Configure Cline VSCode extension to use MegaLLM

Cline is a powerful VSCode extension that combines AI assistance with terminal integration, autonomous task execution, and advanced context awareness. Configure it to use MegaLLM for access to multiple AI models.

## Quick Configuration

<Tabs>
  <Tab title="Anthropic Format (Claude)">
    ### Configure for Claude Models

    <Steps>
      <Step title="Open Cline Settings">
        * Press `Ctrl+Shift+P` / `Cmd+Shift+P`
        * Type: `Cline: Open Settings`
        * Or: `Settings → Extensions → Cline`
      </Step>

      <Step title="Select API Provider">
        * **API Provider**: Select `Anthropic`
        * **Base URL**: `https://ai.megallm.io`
        * **API Key**: `sk-mega-your-api-key-here`
      </Step>

      <Step title="Choose Claude Model">
        * **Default Model**: `claude-sonnet-4`
        * **Context Window**: `200000` tokens
        * **Temperature**: `0.5`
      </Step>

      <Step title="Enable Features">
        * <Icon icon="check" /> **Auto Context Detection**
        * <Icon icon="check" /> **File Watcher**
        * <Icon icon="check" /> **Terminal Integration**
        * <Icon icon="check" /> **Git Integration**
      </Step>
    </Steps>

    **Configuration in settings.json:**

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
      **Note:** For Anthropic format, baseURL should be `https://ai.megallm.io` (without `/v1`)
    </Info>
  </Tab>

  <Tab title="OpenAI Format (GPT)">
    ### Configure for GPT Models

    <Steps>
      <Step title="Open Cline Settings">
        * Press `Ctrl+Shift+P` / `Cmd+Shift+P`
        * Type: `Cline: Open Settings`
      </Step>

      <Step title="Select OpenAI Provider">
        * **API Provider**: Select `OpenAI`
        * **Base URL**: `https://ai.megallm.io/v1`
        * **API Key**: `sk-mega-your-api-key-here`
      </Step>

      <Step title="Choose GPT Model">
        * **Default Model**: `gpt-5`
        * **Context Window**: `128000` tokens
        * **Temperature**: `0.7`
      </Step>

      <Step title="Enable Features">
        * <Icon icon="check" /> **Auto Context Detection**
        * <Icon icon="check" /> **File Watcher**
        * <Icon icon="check" /> **Terminal Integration**
      </Step>
    </Steps>

    **Configuration in settings.json:**

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
      **Note:** For OpenAI format, baseURL should include `/v1`: `https://ai.megallm.io/v1`
    </Info>
  </Tab>

  <Tab title="Environment Variables">
    ### Secure Configuration

    **Step 1**: Set environment variables

    ```bash  theme={null}
    # Add to ~/.bashrc, ~/.zshrc, or ~/.config/fish/config.fish
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"

    # For Claude models
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"

    # For GPT models
    export OPENAI_BASE_URL="https://ai.megallm.io/v1"
    ```

    **Step 2**: Reload shell

    ```bash  theme={null}
    source ~/.bashrc  # or ~/.zshrc
    ```

    **Step 3**: Reference in settings.json

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

    <Icon icon="check" /> API key stays secure and out of version control
  </Tab>
</Tabs>

## Scenario Examples

### Scenario 1: First-Time Installation

Complete setup from scratch:

<Steps>
  <Step title="Install Cline Extension">
    1. Open VSCode
    2. Go to Extensions: `Ctrl+Shift+X` / `Cmd+Shift+X`
    3. Search: `Cline`
    4. Click **Install**
    5. Reload VSCode if prompted
  </Step>

  <Step title="Get MegaLLM API Key">
    1. Visit [MegaLLM Dashboard](https://megallm.io/dashboard)
    2. Navigate to **API Keys** section
    3. Click **Create New Key**
    4. Copy the key (starts with `sk-mega-`)
  </Step>

  <Step title="Configure Cline">
    Open Command Palette and run: `Cline: Open Settings`

    Choose your preferred format:

    **For Claude Models:**

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

    **For GPT Models:**

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

  <Step title="Open Cline Panel">
    1. Click Cline icon in left sidebar
    2. Or: `Ctrl+Shift+P` → `Cline: Open`
    3. Should see connection status: ✓ Connected
  </Step>

  <Step title="Test Configuration">
    In Cline chat, type:

    ```
    What model are you using? Write a hello world function in Python.
    ```

    **Expected Response:**

    ```
    I'm using claude-sonnet-4 via MegaLLM.

    def hello_world():
        print("Hello, World!")

    if __name__ == "__main__":
        hello_world()
    ```
  </Step>
</Steps>

***

### Scenario 2: Autonomous Task Execution

Use Cline for complex, multi-step tasks:

**Scenario:** "Refactor the authentication module to use JWT tokens"

<Steps>
  <Step title="Configure for Autonomous Mode">
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

  <Step title="Give Task to Cline">
    Open Cline panel and provide detailed instructions:

    ```
    Task: Refactor authentication to use JWT

    Requirements:
    1. Install jsonwebtoken package
    2. Update login endpoint to generate JWT
    3. Create middleware to verify JWT
    4. Update protected routes
    5. Write tests for new auth flow
    6. Update documentation

    Current auth is in: src/auth/
    ```
  </Step>

  <Step title="Cline Executes Autonomously">
    Cline will:

    1. Analyze current auth code
    2. Run: `npm install jsonwebtoken`
    3. Create new JWT utilities
    4. Update login controller
    5. Create middleware
    6. Update routes
    7. Generate tests
    8. Update docs

    **You approve each file change before it's written**
  </Step>

  <Step title="Review and Commit">
    ```bash  theme={null}
    # Cline can execute git commands
    git add .
    git commit -m "Refactor: Implement JWT authentication"
    ```
  </Step>
</Steps>

**Result:** Complete authentication refactor with minimal manual work!

***

### Scenario 3: Project-Specific Cline Configuration

Different projects need different Cline setups:

**Python Data Analysis Project:**

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

**React/TypeScript Web App:**

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

**Rust Systems Project:**

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

### Scenario 4: Terminal Integration Workflow

Use Cline's terminal powers for DevOps tasks:

**Configuration:**

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

**Example Workflow:**

```plaintext  theme={null}
You: "Setup Docker development environment for this Node.js app"

Cline: "I'll help set up Docker. I'll need to:
1. Create Dockerfile
2. Create docker-compose.yml
3. Add .dockerignore
4. Test the build

Shall I proceed?"

You: "Yes"

Cline executes:
1. Creates Dockerfile with Node.js 18
2. Creates docker-compose.yml with app + postgres
3. Adds .dockerignore
4. Runs: docker-compose build
5. Runs: docker-compose up -d
6. Runs: docker-compose ps (to verify)

Result: <Icon icon="check" /> Docker environment running
```

***

### Scenario 5: Migration from GitHub Copilot Chat

Switch from Copilot Chat to Cline with MegaLLM:

**Why Migrate:**

* <Icon icon="check" /> Access to Claude (better reasoning) AND GPT
* <Icon icon="check" /> Terminal integration (Copilot Chat doesn't have)
* <Icon icon="check" /> Autonomous multi-step tasks
* <Icon icon="check" /> Better pricing (pay-per-use vs seat-based)
* <Icon icon="check" /> More context awareness

**Migration Steps:**

<Steps>
  <Step title="Document Current Usage">
    Note your favorite Copilot Chat features:

    * Explaining code
    * Generating functions
    * Writing tests
    * Debugging help
  </Step>

  <Step title="Disable Copilot Chat">
    ```json  theme={null}
    {
      "github.copilot.enable": false
    }
    ```
  </Step>

  <Step title="Install Cline">
    VSCode Extensions → Search "Cline" → Install
  </Step>

  <Step title="Configure with MegaLLM">
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

  <Step title="Learn Cline Commands">
    * `/explain` - Explain selected code
    * `/test` - Generate tests
    * `/fix` - Debug and fix issues
    * `/refactor` - Refactor code
    * `/task` - Execute multi-step task
  </Step>

  <Step title="Compare Experience">
    **Advantages over Copilot Chat:**

    * Can execute terminal commands
    * Better at multi-file changes
    * Claude Opus for complex reasoning
    * Can run tests and verify changes
    * Git integration built-in
  </Step>
</Steps>

**Feature Comparison:**

| Feature                | Copilot Chat                                 | Cline + MegaLLM                          |
| ---------------------- | -------------------------------------------- | ---------------------------------------- |
| **Chat Interface**     | <Icon icon="check" />                        | <Icon icon="check" />                    |
| **Code Explanation**   | <Icon icon="check" />                        | <Icon icon="check" /> Better with Claude |
| **Code Generation**    | <Icon icon="check" />                        | <Icon icon="check" />                    |
| **Terminal Execution** | <Icon icon="xmark" />                        | <Icon icon="check" />                    |
| **Multi-File Edit**    | <Icon icon="triangle-exclamation" /> Limited | <Icon icon="check" /> Extensive          |
| **Model Choice**       | GPT-4 only                                   | GPT, Claude, Gemini                      |
| **Autonomous Tasks**   | <Icon icon="xmark" />                        | <Icon icon="check" />                    |
| **Git Integration**    | <Icon icon="triangle-exclamation" /> Basic   | <Icon icon="check" /> Advanced           |
| **Pricing**            | \$10-20/month                                | Pay-per-use                              |

***

### Scenario 6: Multi-Model Strategy

Switch models based on task complexity:

**Configuration:**

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

**Usage Pattern:**

```plaintext  theme={null}
Morning: Quick bug fixes
→ Use "fast" profile (gpt-4o-mini)
→ Fast responses for simple issues

Midday: Feature development
→ Use "balanced" profile (claude-sonnet-4)
→ Good quality, reasonable speed

Afternoon: Complex refactoring
→ Use "powerful" profile (claude-opus-4)
→ Best reasoning for architecture

Evening: Documentation
→ Use "creative" profile (gpt-5)
→ Engaging docs and comments
```

**Switch profiles:**

1. In Cline panel, click model name
2. Select profile from dropdown
3. Or use command: `/model powerful`

***

### Scenario 7: CI/CD Integration

Use Cline in automated workflows:

**GitHub Actions Example:**

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

## Configuration Options

### Complete Reference

```json  theme={null}
{
  // API Provider Configuration
  "cline.apiProvider": "anthropic",  // or "openai"

  // Anthropic (Claude) Configuration
  "cline.anthropic": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io"  // No /v1 for Anthropic
  },

  // OpenAI (GPT) Configuration
  "cline.openai": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "https://ai.megallm.io/v1"  // Include /v1 for OpenAI
  },

  // Model Settings
  "cline.defaultModel": "claude-sonnet-4",
  "cline.contextWindow": 200000,
  "cline.temperature": 0.5,
  "cline.maxTokens": 4096,

  // Features
  "cline.features": {
    "autoContext": true,
    "fileWatcher": true,
    "terminalIntegration": true,
    "gitIntegration": true,
    "multiFileEdit": true
  },

  // Autonomous Mode
  "cline.autonomousMode": {
    "enabled": true,
    "requireApproval": "perFile",  // "perFile", "perAction", "never"
    "maxIterations": 10
  },

  // Terminal Settings
  "cline.terminal": {
    "autoExecute": false,
    "requireApproval": true,
    "allowedCommands": ["npm", "git", "docker"],
    "blockedCommands": ["rm -rf", "sudo"]
  },

  // Context Settings
  "cline.context": {
    "language": "typescript",
    "frameworks": ["react", "next.js"],
    "codeStyle": "airbnb",
    "maxContextFiles": 20,
    "includeGitInfo": true
  },

  // Custom Prompts
  "cline.customPrompts": {
    "explain": "Explain this code in detail",
    "test": "Generate comprehensive tests",
    "review": "Review for bugs and improvements",
    "refactor": "Refactor for better maintainability",
    "doc": "Generate detailed documentation"
  },

  // UI Settings
  "cline.ui": {
    "theme": "auto",
    "position": "sidebar",  // "sidebar", "panel", "editor"
    "showStatusBar": true,
    "showInlineHints": true
  }
}
```

### Model Selection Guide

| Task                 | Recommended Model          | API Provider | Why                |
| -------------------- | -------------------------- | ------------ | ------------------ |
| **Code Review**      | `claude-sonnet-4`          | Anthropic    | Excellent analysis |
| **Refactoring**      | `claude-opus-4-1-20250805` | Anthropic    | Best reasoning     |
| **Quick Tasks**      | `gpt-4o-mini`              | OpenAI       | Fastest            |
| **Web Development**  | `gpt-5`                    | OpenAI       | Great for JS/React |
| **Documentation**    | `gpt-5`                    | OpenAI       | Clear writing      |
| **Systems Code**     | `gemini-2.5-pro`           | OpenAI       | Precise logic      |
| **Autonomous Tasks** | `claude-opus-4-1-20250805` | Anthropic    | Complex reasoning  |

## Verification

### Test 1: Basic Chat

1. Open Cline panel in VSCode
2. Start new session
3. Type: `What model are you using?`
4. Should respond with model name and MegaLLM confirmation

### Test 2: Code Explanation

1. Select a function in your code
2. In Cline: `/explain`
3. Should provide detailed explanation

### Test 3: Terminal Integration

1. In Cline: `List all files in current directory`
2. Cline should suggest: `ls -la`
3. Approve execution
4. Should see file listing

### Test 4: Multi-File Task

1. Request: `Add error handling to all API routes`
2. Cline analyzes multiple files
3. Shows proposed changes for each
4. Approve and apply

### Test 5: Status Check

Run command: `/status`

Should show:

```
✓ Connected to MegaLLM
✓ Model: claude-sonnet-4
✓ Context: 200k tokens available
✓ Terminal: Enabled
✓ Git: Enabled
```

## Troubleshooting

<AccordionGroup>
  <Accordion title="Model not responding">
    **Symptoms:**

    * Messages sent but no response
    * "Model initialization failed" error
    * Connection timeout

    **Solutions:**

    1. **Check API provider configuration:**
       ```json  theme={null}
       // For Claude models
       {
         "cline.apiProvider": "anthropic",
         "cline.anthropic": {
           "baseURL": "https://ai.megallm.io"  // No /v1
         }
       }

       // For GPT models
       {
         "cline.apiProvider": "openai",
         "cline.openai": {
           "baseURL": "https://ai.megallm.io/v1"  // Include /v1
         }
       }
       ```

    2. **Verify model is available:**
       ```bash  theme={null}
       curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
            https://ai.megallm.io/v1/models | jq '.data[].id'
       ```

    3. **Check model name is correct:**
       * `claude-sonnet-4` <Icon icon="check" />
       * `claude-sonnet-3` <Icon icon="xmark" /> (old version)
       * `gpt-5` <Icon icon="check" />
       * `gpt-5.0` <Icon icon="xmark" /> (wrong format)

    4. **Reset Cline:**
       * Command Palette: `Cline: Reset Configuration`
       * Restart VSCode
       * Reconfigure from scratch
  </Accordion>

  <Accordion title="Terminal commands not executing">
    **Symptoms:**

    * Cline suggests commands but doesn't execute
    * "Terminal integration disabled" message

    **Solutions:**

    1. **Enable terminal integration:**
       ```json  theme={null}
       {
         "cline.features": {
           "terminalIntegration": true
         }
       }
       ```

    2. **Check terminal permissions:**
       * VSCode Settings → search "terminal allow"
       * Enable: `Terminal > Integrated: Allow Workspace Configuration`

    3. **Verify allowed commands:**
       ```json  theme={null}
       {
         "cline.terminal": {
           "autoExecute": false,
           "requireApproval": true,
           "allowedCommands": ["npm", "git", "docker"]
         }
       }
       ```

    4. **Test manually:**
       * Open VSCode terminal
       * Try running commands directly
       * Ensure terminal works before using Cline
  </Accordion>

  <Accordion title="Context window exceeded">
    **Symptoms:**

    * "Context too large" error
    * Cline can't include all files

    **Solutions:**

    1. **Reduce context window:**
       ```json  theme={null}
       {
         "cline.contextWindow": 100000  // Reduce from 200000
       }
       ```

    2. **Limit files included:**
       ```json  theme={null}
       {
         "cline.context": {
           "maxContextFiles": 10  // Reduce from 20
         }
       }
       ```

    3. **Be more specific:**
       Instead of: "Review the entire project"
       Say: "Review only the auth module"

    4. **Use smaller model:**
       ```json  theme={null}
       {
         "cline.defaultModel": "gpt-4o-mini"  // Smaller context
       }
       ```
  </Accordion>

  <Accordion title="Autonomous mode stuck">
    **Symptoms:**

    * Cline keeps iterating without progress
    * Task never completes
    * Same errors repeating

    **Solutions:**

    1. **Limit max iterations:**
       ```json  theme={null}
       {
         "cline.autonomousMode": {
           "maxIterations": 5  // Reduce from 10
         }
       }
       ```

    2. **Require more approvals:**
       ```json  theme={null}
       {
         "cline.autonomousMode": {
           "requireApproval": "perAction"  // Instead of "perFile"
         }
       }
       ```

    3. **Stop and restart:**
       * Click "Stop" button in Cline panel
       * Review what Cline attempted
       * Provide more specific instructions

    4. **Break down task:**
       Instead of: "Refactor entire authentication system"
       Try: "First, just update the login endpoint to use JWT"
  </Accordion>

  <Accordion title="API key not recognized">
    **Symptoms:**

    * "Invalid API key" error
    * 401 Unauthorized
    * Connection refused

    **Solutions:**

    1. **Verify key in environment:**
       ```bash  theme={null}
       echo $MEGALLM_API_KEY
       # Should output: sk-mega-...
       ```

    2. **Reload VSCode:**
       * Close all VSCode windows
       * Reload shell: `source ~/.bashrc`
       * Reopen VSCode

    3. **Set key directly (testing):**
       ```json  theme={null}
       {
         "cline.anthropic": {
           "apiKey": "sk-mega-your-actual-key"  // Temporarily for testing
         }
       }
       ```

    4. **Test key manually:**
       ```bash  theme={null}
       curl -X POST https://ai.megallm.io/v1/chat/completions \
         -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"hi"}]}'
       ```

    5. **Check key is active:**
       * Login to [Dashboard](https://megallm.io/dashboard)
       * Verify key not revoked/expired
  </Accordion>

  <Accordion title="Conflicts with other extensions">
    **Symptoms:**

    * Multiple AI suggestions appearing
    * Keyboard shortcuts not working
    * Performance issues

    **Solutions:**

    1. **Disable conflicting extensions:**
       ```json  theme={null}
       {
         "github.copilot.enable": false,
         "tabnine.disable": true,
         "aws.codeWhisperer.enabled": false,
         "kilocode.enable": false
       }
       ```

    2. **Check for keybinding conflicts:**
       * File → Preferences → Keyboard Shortcuts
       * Search for Cline commands
       * Resolve any conflicts

    3. **Try one extension at a time:**
       * Disable all AI extensions
       * Enable only Cline
       * Test functionality
       * Re-enable others one by one
  </Accordion>
</AccordionGroup>

## Best Practices

<CardGroup cols={2}>
  <Card title="Use Environment Variables" icon="key">
    Keep API keys in env vars: `${env:MEGALLM_API_KEY}`
  </Card>

  <Card title="Project-Specific Config" icon="folder">
    Different models per project in `.vscode/settings.json`
  </Card>

  <Card title="Approval for Terminal" icon="shield">
    Always require approval for terminal commands
  </Card>

  <Card title="Start Small" icon="seedling">
    Test autonomous mode on small tasks first
  </Card>

  <Card title="Monitor Context" icon="chart-line">
    Watch context usage to avoid hitting limits
  </Card>

  <Card title="Git Integration" icon="code-branch">
    Let Cline handle git operations for you
  </Card>
</CardGroup>

## Advanced Tips

### Custom Slash Commands

Create shortcuts for common tasks:

```json  theme={null}
{
  "cline.customCommands": {
    "/deploy": "Build the app, run tests, and deploy to staging",
    "/review-pr": "Review all changed files in this PR for bugs and improvements",
    "/setup-test": "Set up test file structure and write initial tests",
    "/doc-api": "Generate API documentation from code comments"
  }
}
```

Usage: Type `/deploy` in Cline chat

### Context Awareness

Improve Cline's understanding:

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

### Git Integration

Let Cline manage git workflows:

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

## Next Steps

<CardGroup cols={3}>
  <Card title="Kilocode Setup" icon="code" href="/en/agents/kilocode">
    Configure Kilocode for code completion
  </Card>

  <Card title="RooCode Setup" icon="robot" href="/en/agents/roocode">
    Configure RooCode standalone app
  </Card>

  <Card title="Models Catalog" icon="layer-group" href="/en/home/models">
    Browse all available models
  </Card>

  <Card title="Other Agents" icon="window" href="/en/agents/overview">
    View all CLI and GUI agents
  </Card>

  <Card title="API Reference" icon="book" href="/en/api-reference/introduction">
    Explore the API docs
  </Card>

  <Card title="Discord Community" icon="discord" href="https://discord.gg/devsindia">
    Join for support
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt