# Kilocode Configuration

> Configure Kilocode VSCode extension to use MegaLLM

Kilocode is a powerful VSCode extension that provides AI-powered code completion, inline chat, and code actions. Configure it to use MegaLLM for access to multiple AI models.

## Quick Configuration

<Tabs>
  <Tab title="Via Settings UI">
    ### Step-by-Step Setup

    <Steps>
      <Step title="Open VSCode Settings">
        * Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
        * Type: `Preferences: Open Settings (UI)`
        * Search for: `Kilocode`
      </Step>

      <Step title="Configure API Provider">
        * **API Provider**: Select `Custom`
        * **Provider Name**: `MegaLLM`
        * **Base URL**: `https://ai.megallm.io/v1`
        * **API Key**: `sk-mega-your-api-key-here`
      </Step>

      <Step title="Select Default Model">
        * **Default Model**: `gpt-5` (or any [supported model](/home/models))
        * **Temperature**: `0.3` (lower = more deterministic)
        * **Max Tokens**: `500` (for completions)
      </Step>

      <Step title="Enable Features">
        * <Icon icon="check" /> **Enable AutoComplete**
        * <Icon icon="check" /> **Enable Inline Chat**
        * <Icon icon="check" /> **Enable Code Actions**
        * <Icon icon="check" /> **Enable Suggestions**
      </Step>
    </Steps>
  </Tab>

  <Tab title="Via settings.json">
    ### Configuration File

    **Location**: `.vscode/settings.json` or `~/.config/Code/User/settings.json`

    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-api-key-here"
      },
      "kilocode.defaultModel": "gpt-5",
      "kilocode.enableAutoComplete": true,
      "kilocode.enableInlineChat": true,
      "kilocode.enableCodeActions": true,
      "kilocode.modelSettings": {
        "temperature": 0.3,
        "maxTokens": 500,
        "topP": 0.9
      }
    }
    ```

    <Tip>
      You can use environment variables: `"apiKey": "${env:MEGALLM_API_KEY}"`
    </Tip>
  </Tab>

  <Tab title="Using Environment Variables">
    ### Secure Configuration

    **Step 1**: Set environment variables

    ```bash  theme={null}
    # Add to ~/.bashrc, ~/.zshrc, or ~/.config/fish/config.fish
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"
    export MEGALLM_BASE_URL="https://ai.megallm.io/v1"
    ```

    **Step 2**: Reload shell

    ```bash  theme={null}
    source ~/.bashrc  # or ~/.zshrc
    ```

    **Step 3**: Reference in settings.json

    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "${env:MEGALLM_BASE_URL}",
        "apiKey": "${env:MEGALLM_API_KEY}"
      },
      "kilocode.defaultModel": "gpt-5"
    }
    ```

    <Icon icon="check" /> API key stays secure and out of version control
  </Tab>
</Tabs>

## Scenario Examples

### Scenario 1: First-Time Installation

Complete setup from scratch:

<Steps>
  <Step title="Install Kilocode Extension">
    1. Open VSCode
    2. Go to Extensions: `Ctrl+Shift+X` / `Cmd+Shift+X`
    3. Search: `Kilocode`
    4. Click **Install**
    5. Reload VSCode window
  </Step>

  <Step title="Get MegaLLM API Key">
    1. Visit [MegaLLM Dashboard](https://megallm.io/dashboard)
    2. Navigate to **API Keys** section
    3. Click **Create New Key**
    4. Copy the key (starts with `sk-mega-`)
    5. Store it securely
  </Step>

  <Step title="Configure Extension">
    Open settings (`Ctrl+,` / `Cmd+,`) and add:

    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-actual-key-here"
      },
      "kilocode.defaultModel": "gpt-5"
    }
    ```
  </Step>

  <Step title="Test Configuration">
    1. Create a new file: `test.js`
    2. Type a comment: `// function to calculate fibonacci`
    3. Press `Tab` to trigger completion
    4. Should see AI-generated code

    **Expected Result:**

    ```javascript  theme={null}
    // function to calculate fibonacci
    function fibonacci(n) {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
    ```
  </Step>
</Steps>

***

### Scenario 2: Team Project Configuration

Set up Kilocode for entire development team:

**Project Structure:**

```
my-project/
├── .vscode/
│   ├── settings.json          # Shared config (committed)
│   └── settings.local.json    # Personal keys (gitignored)
├── .gitignore
└── README.md
```

**Step 1: Create Shared Config**

`.vscode/settings.json` (committed to git):

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gpt-5",
  "kilocode.modelSettings": {
    "temperature": 0.7,
    "maxTokens": 1000
  },
  "kilocode.enableAutoComplete": true,
  "kilocode.enableInlineChat": true
}
```

**Step 2: Setup .gitignore**

```bash  theme={null}
# .gitignore
.vscode/settings.local.json
.env
```

**Step 3: Create Setup Instructions**

`README.md`:

````markdown  theme={null}
## Kilocode Setup

### Prerequisites
1. VSCode with Kilocode extension installed
2. MegaLLM API key ([Get one](https://megallm.io/dashboard))

### Configuration

1. **Set environment variable:**
   ```bash
   export MEGALLM_API_KEY="your-key-here"
````

Add to your shell config (\~/.bashrc or \~/.zshrc) to persist.

2. **Or create local settings** (not committed):

   `.vscode/settings.local.json`:

   ```json  theme={null}
   {
     "kilocode.customProvider": {
       "apiKey": "your-key-here"
     }
   }
   ```

3. **Reload VSCode** and start coding!

### Verification

Type `// hello world function` and press Tab.
Should see AI-generated code.

````

**Step 4: Team Members Clone and Setup**

```bash
# Team member workflow
git clone https://github.com/company/my-project.git
cd my-project

# Add personal API key
export MEGALLM_API_KEY="their-personal-key"

# Or create .vscode/settings.local.json with their key

# Open in VSCode
code .
````

***

### Scenario 3: Project-Specific Model Selection

Use different models for different projects:

**Python Data Science Project:**

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "claude-opus-4-1-20250805",
  "kilocode.customPrompts": {
    "analyze": "Analyze this data processing code for efficiency",
    "doc": "Generate numpy-style docstring for this function"
  }
}
```

**JavaScript/React Project:**

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gpt-5",
  "kilocode.customPrompts": {
    "component": "Generate a React functional component",
    "test": "Write Jest tests for this component"
  }
}
```

**Systems Programming (Rust/Go):**

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gemini-2.5-pro",
  "kilocode.modelSettings": {
    "temperature": 0.2  // Lower for more precise systems code
  }
}
```

***

### Scenario 4: Multi-Model Workflow

Switch models dynamically based on task:

**Configuration:**

```json  theme={null}
{
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },
  "kilocode.defaultModel": "gpt-5",
  "kilocode.modelProfiles": {
    "fast": {
      "model": "gpt-4o-mini",
      "temperature": 0.5,
      "maxTokens": 300
    },
    "quality": {
      "model": "claude-opus-4-1-20250805",
      "temperature": 0.3,
      "maxTokens": 1000
    },
    "creative": {
      "model": "gpt-5",
      "temperature": 0.9,
      "maxTokens": 800
    }
  }
}
```

**Usage:**

* **Morning (rapid prototyping)**: Use `fast` profile with GPT-4o-mini
* **Afternoon (quality code)**: Use `quality` profile with Claude Opus
* **Documentation**: Use `creative` profile with higher temperature

**Switch profiles via Command Palette:**

1. `Ctrl+Shift+P` / `Cmd+Shift+P`
2. `Kilocode: Switch Model Profile`
3. Select: `fast`, `quality`, or `creative`

***

### Scenario 5: Migration from GitHub Copilot

Switching from Copilot to Kilocode with MegaLLM:

**Current Setup (Copilot):**

```json  theme={null}
{
  "github.copilot.enable": true
}
```

**New Setup (Kilocode + MegaLLM):**

<Steps>
  <Step title="Disable Copilot">
    ```json  theme={null}
    {
      "github.copilot.enable": false
    }
    ```
  </Step>

  <Step title="Install Kilocode">
    VSCode Extensions → Search "Kilocode" → Install
  </Step>

  <Step title="Configure MegaLLM">
    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "${env:MEGALLM_API_KEY}"
      },
      "kilocode.defaultModel": "gpt-5"
    }
    ```
  </Step>

  <Step title="Compare Experience">
    **Benefits over Copilot:**

    * <Icon icon="check" /> Access to multiple models (GPT, Claude, Gemini)
    * <Icon icon="check" /> Better pricing and no seat limits
    * <Icon icon="check" /> Inline chat for explanations
    * <Icon icon="check" /> Custom model selection per project
    * <Icon icon="check" /> Code actions beyond completion
  </Step>
</Steps>

## Configuration Options

### Complete Reference

```json  theme={null}
{
  // Provider Configuration
  "kilocode.apiProvider": "custom",
  "kilocode.customProvider": {
    "name": "MegaLLM",
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}"
  },

  // Model Settings
  "kilocode.defaultModel": "gpt-5",
  "kilocode.modelSettings": {
    "temperature": 0.3,        // 0.0-2.0: Lower = more focused
    "maxTokens": 500,          // Max completion length
    "topP": 0.9,               // Nucleus sampling
    "frequencyPenalty": 0.0,   // Reduce repetition
    "presencePenalty": 0.0     // Encourage diversity
  },

  // Feature Toggles
  "kilocode.enableAutoComplete": true,
  "kilocode.enableInlineChat": true,
  "kilocode.enableCodeActions": true,
  "kilocode.enableSuggestions": true,
  "kilocode.enableHover": true,

  // Behavior
  "kilocode.autoTrigger": true,
  "kilocode.debounceDelay": 300,     // ms before triggering
  "kilocode.maxSuggestions": 3,
  "kilocode.showInlineHints": true,

  // Custom Prompts
  "kilocode.customPrompts": {
    "doc": "Generate comprehensive documentation",
    "test": "Write unit tests with high coverage",
    "refactor": "Refactor for better maintainability",
    "optimize": "Optimize for performance",
    "secure": "Review for security vulnerabilities"
  },

  // Keyboard Shortcuts
  "kilocode.shortcuts": {
    "acceptSuggestion": "Tab",
    "nextSuggestion": "Alt+]",
    "prevSuggestion": "Alt+[",
    "dismissSuggestion": "Esc",
    "triggerInlineChat": "Ctrl+K"
  },

  // UI Preferences
  "kilocode.ui": {
    "showStatusBar": true,
    "showInlineButtons": true,
    "theme": "auto",               // auto, light, dark
    "position": "right"            // left, right
  }
}
```

### Model Selection Guide

| Task                | Recommended Model          | Reason                 |
| ------------------- | -------------------------- | ---------------------- |
| **Code Completion** | `gpt-4o-mini`              | Fast, cost-effective   |
| **Complex Logic**   | `claude-opus-4-1-20250805` | Superior reasoning     |
| **Web Development** | `gpt-5`                    | Excellent JS/TS/React  |
| **Data Science**    | `claude-sonnet-4`          | Strong analysis        |
| **Documentation**   | `gpt-5`                    | Clear explanations     |
| **Algorithms**      | `gemini-2.5-pro`           | Mathematical precision |

See [full model catalog](/home/models) for all options.

## Verification

### Test 1: Basic Completion

```javascript  theme={null}
// Type this comment and press Tab:
// function to check if string is palindrome

// Expected output:
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}
```

### Test 2: Inline Chat

1. Select a function
2. Press `Ctrl+K` (or `Cmd+K` on Mac)
3. Type: `Explain this function`
4. Should see explanation in chat panel

### Test 3: Code Actions

1. Right-click on code
2. Should see "Kilocode Actions" in context menu
3. Options: Explain, Improve, Generate Tests, etc.

### Test 4: Status Bar

Check bottom-right of VSCode:

* Should show: `Kilocode: Connected`
* Model name: `gpt-5` (or your selected model)
* Click to see connection details

## Troubleshooting

<AccordionGroup>
  <Accordion title="Completions not appearing">
    **Symptoms:**

    * No suggestions when typing
    * Status bar shows "Disconnected"

    **Solutions:**

    1. **Check API key:**
       ```bash  theme={null}
       echo $MEGALLM_API_KEY
       # Should output: sk-mega-...
       ```

    2. **Verify configuration:**
       ```json  theme={null}
       {
         "kilocode.apiProvider": "custom",  // Must be "custom"
         "kilocode.customProvider": {
           "baseURL": "https://ai.megallm.io/v1"  // No trailing slash
         }
       }
       ```

    3. **Reload VSCode:**
       * `Ctrl+Shift+P` / `Cmd+Shift+P`
       * Run: `Developer: Reload Window`

    4. **Check extension is enabled:**
       * Extensions panel
       * Search: Kilocode
       * Should show "Enabled"

    5. **Test API manually:**
       ```bash  theme={null}
       curl -X POST https://ai.megallm.io/v1/chat/completions \
         -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'
       ```
  </Accordion>

  <Accordion title="Wrong or poor quality completions">
    **Symptoms:**

    * Completions are incorrect
    * Suggestions don't match code style
    * Irrelevant responses

    **Solutions:**

    1. **Adjust temperature:**
       ```json  theme={null}
       {
         "kilocode.modelSettings": {
           "temperature": 0.2  // Lower = more focused (0.0-1.0)
         }
       }
       ```

    2. **Try different model:**
       ```json  theme={null}
       {
         "kilocode.defaultModel": "claude-sonnet-4"  // Better for analysis
       }
       ```

    3. **Increase context:**
       ```json  theme={null}
       {
         "kilocode.modelSettings": {
           "maxTokens": 1000  // More detailed completions
         }
       }
       ```

    4. **Add project-specific prompt:**
       ```json  theme={null}
       {
         "kilocode.systemPrompt": "You are an expert in TypeScript and React. Follow Airbnb style guide."
       }
       ```
  </Accordion>

  <Accordion title="High latency / slow completions">
    **Symptoms:**

    * Long wait for suggestions
    * Timeout errors

    **Solutions:**

    1. **Use faster model:**
       ```json  theme={null}
       {
         "kilocode.defaultModel": "gpt-4o-mini"  // Fastest
       }
       ```

    2. **Reduce max tokens:**
       ```json  theme={null}
       {
         "kilocode.modelSettings": {
           "maxTokens": 300  // Faster completions
         }
       }
       ```

    3. **Increase debounce delay:**
       ```json  theme={null}
       {
         "kilocode.debounceDelay": 500  // Wait longer before triggering
       }
       ```

    4. **Check network:**
       ```bash  theme={null}
       ping ai.megallm.io
       curl -w "@-" -o /dev/null -s https://ai.megallm.io/v1/models <<'EOF'
       time_total: %{time_total}s
       EOF
       ```
  </Accordion>

  <Accordion title="API key not recognized">
    **Symptoms:**

    * "Invalid API key" error
    * 401 Unauthorized

    **Solutions:**

    1. **Verify key format:**
       * Must start with `sk-mega-`
       * At least 60 characters
       * No spaces or quotes

    2. **Check key is active:**
       * Login to [Dashboard](https://megallm.io/dashboard)
       * Go to API Keys
       * Verify key is not revoked/expired

    3. **Test key directly:**
       ```bash  theme={null}
       curl -H "Authorization: Bearer sk-mega-your-key" \
            https://ai.megallm.io/v1/models
       ```

    4. **Regenerate if needed:**
       * Dashboard → API Keys → Create New
       * Update configuration with new key
  </Accordion>

  <Accordion title="Conflicts with other extensions">
    **Symptoms:**

    * Kilocode completions conflict with other AI tools
    * Multiple suggestions appearing

    **Solutions:**

    1. **Disable conflicting extensions:**
       ```json  theme={null}
       {
         "github.copilot.enable": false,
         "tabnine.disable": true,
         "aws.codeWhisperer.enabled": false
       }
       ```

    2. **Adjust trigger keys:**
       ```json  theme={null}
       {
         "kilocode.shortcuts": {
           "acceptSuggestion": "Alt+Enter"  // Different from Tab
         }
       }
       ```

    3. **Set priority:**
       ```json  theme={null}
       {
         "editor.suggest.snippetsPreventQuickSuggestions": false,
         "editor.quickSuggestions": {
           "other": "on",
           "comments": "off",
           "strings": "on"
         }
       }
       ```
  </Accordion>
</AccordionGroup>

## Best Practices

<CardGroup cols={2}>
  <Card title="Use Environment Variables" icon="key">
    Keep API keys in env vars, reference with `${env:MEGALLM_API_KEY}`
  </Card>

  <Card title="Project-Specific Models" icon="folder">
    Configure different models in `.vscode/settings.json` per project
  </Card>

  <Card title="Lower Temperature for Code" icon="temperature-low">
    Use 0.2-0.4 for code generation, 0.7-0.9 for documentation
  </Card>

  <Card title="Monitor Token Usage" icon="chart-line">
    Check [Dashboard](https://megallm.io/dashboard) to optimize costs
  </Card>
</CardGroup>

## Advanced Tips

### Custom Keyboard Shortcuts

Add to `keybindings.json`:

```json  theme={null}
[
  {
    "key": "ctrl+alt+k",
    "command": "kilocode.triggerSuggestion",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+alt+e",
    "command": "kilocode.explainCode",
    "when": "editorHasSelection"
  },
  {
    "key": "ctrl+alt+t",
    "command": "kilocode.generateTests",
    "when": "editorTextFocus"
  }
]
```

### Workspace-Specific Prompts

`.vscode/settings.json`:

```json  theme={null}
{
  "kilocode.customPrompts": {
    "api": "Generate RESTful API endpoint following our conventions",
    "schema": "Create Prisma schema model",
    "hook": "Generate React custom hook",
    "component": "Create styled-component with TypeScript"
  }
}
```

### Context-Aware Completions

```json  theme={null}
{
  "kilocode.contextSettings": {
    "includeOpenFiles": true,
    "includeImports": true,
    "includeTypes": true,
    "maxContextFiles": 5
  }
}
```

## Next Steps

<CardGroup cols={3}>
  <Card title="RooCode Setup" icon="robot" href="/en/agents/roocode">
    Configure RooCode application
  </Card>

  <Card title="Cline Setup" icon="terminal" href="/en/agents/cline">
    Configure Cline VSCode extension
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