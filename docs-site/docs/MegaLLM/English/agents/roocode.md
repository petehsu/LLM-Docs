# RooCode Configuration

> Configure RooCode standalone application to use MegaLLM

RooCode is a powerful standalone AI coding assistant application with an interactive chat interface, code review capabilities, and multi-file editing. Configure it to use MegaLLM for access to multiple AI models.

## Quick Configuration

<Tabs>
  <Tab title="Via Application Settings">
    ### Step-by-Step Setup

    <Steps>
      <Step title="Open RooCode Settings">
        * Launch RooCode application
        * Click the gear icon ⚙️ (bottom-left corner)
        * Navigate to: `Settings → API Configuration`
      </Step>

      <Step title="Select Provider Type">
        * **Provider Type**: Select `OpenAI Compatible`
        * This enables custom base URL configuration
        * Allows MegaLLM integration
      </Step>

      <Step title="Configure API Endpoint">
        * **Base URL**: `https://ai.megallm.io/v1`
        * **API Key**: `sk-mega-your-api-key-here`
        * **Organization**: Leave empty (not required)
        * Click **Save**
      </Step>

      <Step title="Choose Default Model">
        * **Default Model**: `gpt-5`
        * **Fallback Model**: `gpt-4o` (optional)
        * **Temperature**: `0.7` (balanced creativity)
        * **Max Tokens**: `4096`
      </Step>

      <Step title="Enable Features">
        * <Icon icon="check" /> **Code Completion**
        * <Icon icon="check" /> **Chat Interface**
        * <Icon icon="check" /> **Code Review**
        * <Icon icon="check" /> **Refactoring Assistant**
        * <Icon icon="check" /> **Multi-File Edit**
      </Step>
    </Steps>
  </Tab>

  <Tab title="Via Configuration File">
    ### Direct File Edit

    **Configuration File Locations:**

    <CodeGroup>
      ```bash Windows theme={null}
      %APPDATA%\RooCode\config.json
      # Full path: C:\Users\YourName\AppData\Roaming\RooCode\config.json
      ```

      ```bash macOS theme={null}
      ~/Library/Application Support/RooCode/config.json
      ```

      ```bash Linux theme={null}
      ~/.config/RooCode/config.json
      ```
    </CodeGroup>

    **Configuration Content:**

    ```json  theme={null}
    {
      "provider": "openai-compatible",
      "api": {
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-api-key-here",
        "organization": "",
        "model": "gpt-5",
        "temperature": 0.7,
        "maxTokens": 4096
      },
      "features": {
        "codeCompletion": true,
        "chatInterface": true,
        "codeReview": true,
        "refactoring": true,
        "multiFileEdit": true
      },
      "ui": {
        "theme": "dark",
        "showInlineHints": true,
        "autoSaveChats": true,
        "fontSize": 14
      }
    }
    ```

    <Warning>
      After editing the config file, restart RooCode for changes to take effect.
    </Warning>
  </Tab>

  <Tab title="Import Configuration">
    ### Import Pre-Made Config

    **Step 1**: Create `roocode-megallm-config.json`

    ```json  theme={null}
    {
      "provider": "openai-compatible",
      "api": {
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "REPLACE_WITH_YOUR_KEY",
        "model": "gpt-5"
      },
      "features": {
        "codeCompletion": true,
        "chatInterface": true,
        "codeReview": true,
        "refactoring": true
      }
    }
    ```

    **Step 2**: Import in RooCode

    1. Open RooCode
    2. Go to: `File → Import Configuration`
    3. Select your `roocode-megallm-config.json`
    4. Replace `REPLACE_WITH_YOUR_KEY` with actual API key
    5. Click **Apply**
    6. Restart RooCode

    <Icon icon="check" /> Configuration imported successfully!
  </Tab>
</Tabs>

## Scenario Examples

### Scenario 1: First-Time Installation

Complete setup from downloading to first use:

<Steps>
  <Step title="Download and Install RooCode">
    1. Visit [RooCode.io](https://roocode.io) (example URL)
    2. Download for your OS (Windows/macOS/Linux)
    3. Install the application
    4. Launch RooCode
  </Step>

  <Step title="Get MegaLLM API Key">
    1. Visit [MegaLLM Dashboard](https://megallm.io/dashboard)
    2. Sign up or log in
    3. Navigate to **API Keys** section
    4. Click **Create New Key**
    5. Copy the key (starts with `sk-mega-`)
  </Step>

  <Step title="Configure API Provider">
    In RooCode:

    1. Click ⚙️ Settings icon
    2. Go to **API Configuration**
    3. Select **Provider**: `OpenAI Compatible`
    4. Enter **Base URL**: `https://ai.megallm.io/v1`
    5. Paste **API Key**: `sk-mega-your-key`
    6. Click **Test Connection** (should show ✓ Success)
    7. Click **Save**
  </Step>

  <Step title="Choose Your First Model">
    1. In Settings → **Model Selection**
    2. Select: `gpt-5` (recommended for general use)
    3. Or browse available models
    4. Set **Temperature**: `0.7` (balanced)
    5. Save settings
  </Step>

  <Step title="Test Configuration">
    1. Open a new chat in RooCode
    2. Type: `Hello! What model are you using?`
    3. Should respond with model information
    4. Try: `Write a hello world function in Python`

    **Expected Response:**

    ```python  theme={null}
    def hello_world():
        print("Hello, World!")

    if __name__ == "__main__":
        hello_world()
    ```
  </Step>
</Steps>

***

### Scenario 2: Team Setup with Shared Configuration

Set up RooCode for an entire development team:

**Scenario:** Development team of 10 people need consistent RooCode configuration

**Step 1: Team Lead Creates Base Config**

`team-roocode-config.json`:

```json  theme={null}
{
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "TEAM_MEMBER_REPLACES_THIS",
    "model": "gpt-5",
    "temperature": 0.7,
    "maxTokens": 4096
  },
  "features": {
    "codeCompletion": true,
    "chatInterface": true,
    "codeReview": true,
    "refactoring": true,
    "multiFileEdit": true
  },
  "projectSettings": {
    "language": "typescript",
    "framework": "react",
    "codingStyle": "airbnb",
    "testFramework": "jest"
  },
  "customPrompts": {
    "review": "Review this code following our team's Airbnb style guide and best practices",
    "test": "Generate Jest unit tests with at least 80% coverage",
    "doc": "Generate JSDoc comments for this function",
    "refactor": "Refactor this code for better maintainability and TypeScript strict mode"
  },
  "ui": {
    "theme": "dark",
    "showInlineHints": true,
    "autoSaveChats": true,
    "fontSize": 14
  }
}
```

**Step 2: Create Setup Instructions**

`ROOCODE_SETUP.md`:

```markdown  theme={null}
# RooCode Team Setup Guide

## Prerequisites
- RooCode application installed ([Download](https://roocode.io))
- MegaLLM API key ([Get yours](https://megallm.io/dashboard))

## Setup Steps

### 1. Get Your Personal API Key
1. Go to https://megallm.io/dashboard
2. Navigate to **API Keys**
3. Click **Create New Key**
4. Copy your key (starts with `sk-mega-`)

### 2. Import Team Configuration
1. Download `team-roocode-config.json` from this repo
2. Open RooCode
3. Go to: `File → Import Configuration`
4. Select `team-roocode-config.json`

### 3. Add Your Personal API Key
1. After import, go to: `Settings → API Configuration`
2. Replace `TEAM_MEMBER_REPLACES_THIS` with your actual key
3. Click **Test Connection** (should show ✓ Success)
4. Click **Save**

### 4. Restart RooCode
Close and reopen RooCode to apply all settings.

## Verification
1. Open a new chat
2. Type: `Generate a React component for a login form`
3. Should generate TypeScript code following Airbnb style

## Troubleshooting
- **Connection failed**: Check API key is correct
- **Wrong code style**: Verify configuration imported correctly
- **Model errors**: Ensure using `gpt-5` or other supported models

## Support
Contact team lead or check [MegaLLM Docs](https://docs.megallm.io)
```

**Step 3: Distribute to Team**

```bash  theme={null}
# Team lead commits to repo
git add team-roocode-config.json ROOCODE_SETUP.md
git commit -m "Add RooCode team configuration"
git push

# Team members clone and setup
git pull
# Follow instructions in ROOCODE_SETUP.md
```

**Result:** Entire team uses consistent:

* <Icon icon="check" /> Same AI model (gpt-5)
* <Icon icon="check" /> Same temperature and settings
* <Icon icon="check" /> Same custom prompts
* <Icon icon="check" /> Same coding standards
* <Icon icon="check" /> Personal API keys (not shared)

***

### Scenario 3: Project-Specific Configurations

Use different RooCode configurations for different project types:

**Python Data Science Project:**

`roocode-datascience.json`:

```json  theme={null}
{
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}",
    "model": "claude-opus-4-1-20250805",
    "temperature": 0.5
  },
  "projectSettings": {
    "language": "python",
    "libraries": ["numpy", "pandas", "scikit-learn", "matplotlib"],
    "codingStyle": "pep8"
  },
  "customPrompts": {
    "analyze": "Analyze this data processing code for efficiency and correctness",
    "optimize": "Optimize this pandas operation for large datasets",
    "visualize": "Suggest matplotlib visualization for this data",
    "doc": "Generate numpy-style docstring"
  }
}
```

**React Web Application:**

`roocode-webapp.json`:

```json  theme={null}
{
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}",
    "model": "gpt-5",
    "temperature": 0.7
  },
  "projectSettings": {
    "language": "typescript",
    "framework": "react",
    "stateManagement": "zustand",
    "styling": "tailwind"
  },
  "customPrompts": {
    "component": "Generate a React functional component with TypeScript and Tailwind",
    "test": "Write React Testing Library tests for this component",
    "hook": "Create a custom React hook for this functionality",
    "api": "Generate API integration with tanstack-query"
  }
}
```

**Systems Programming (Rust):**

`roocode-systems.json`:

```json  theme={null}
{
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "${env:MEGALLM_API_KEY}",
    "model": "gemini-2.5-pro",
    "temperature": 0.3
  },
  "projectSettings": {
    "language": "rust",
    "codingStyle": "rust-fmt"
  },
  "customPrompts": {
    "review": "Review this Rust code for memory safety and performance",
    "optimize": "Suggest optimizations for this performance-critical code",
    "test": "Generate comprehensive Rust tests",
    "unsafe": "Analyze this unsafe block for correctness"
  }
}
```

**Switching Between Projects:**

<CodeGroup>
  ```bash macOS/Linux theme={null}
  # Create aliases in ~/.bashrc or ~/.zshrc
  alias roocode-ds='cp ~/configs/roocode-datascience.json ~/.config/RooCode/config.json && roocode'
  alias roocode-web='cp ~/configs/roocode-webapp.json ~/.config/RooCode/config.json && roocode'
  alias roocode-sys='cp ~/configs/roocode-systems.json ~/.config/RooCode/config.json && roocode'
  ```

  ```powershell Windows theme={null}
  # Create functions in PowerShell profile
  function RooCode-DataScience {
      Copy-Item "$HOME\configs\roocode-datascience.json" "$env:APPDATA\RooCode\config.json"
      Start-Process "roocode"
  }

  function RooCode-Web {
      Copy-Item "$HOME\configs\roocode-webapp.json" "$env:APPDATA\RooCode\config.json"
      Start-Process "roocode"
  }
  ```
</CodeGroup>

***

### Scenario 4: Migration from Cursor/Other AI Tools

Switching from another AI coding tool to RooCode with MegaLLM:

**Current Setup: Using Cursor with OpenAI**

**Why Switch to RooCode + MegaLLM:**

* <Icon icon="check" /> Access to multiple models (GPT, Claude, Gemini) with one key
* <Icon icon="check" /> Standalone app (not tied to specific editor)
* <Icon icon="check" /> Better pricing and no seat limits
* <Icon icon="check" /> More customization options

**Migration Steps:**

<Steps>
  <Step title="Export Current Preferences">
    From Cursor (if possible):

    * Note your preferred models
    * Save any custom prompts
    * Document keyboard shortcuts you use
  </Step>

  <Step title="Install RooCode">
    Download and install RooCode for your OS
  </Step>

  <Step title="Configure MegaLLM">
    ```json  theme={null}
    {
      "provider": "openai-compatible",
      "api": {
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-megallm-key",
        "model": "gpt-5"
      }
    }
    ```
  </Step>

  <Step title="Recreate Custom Prompts">
    Add your frequently used prompts:

    ```json  theme={null}
    {
      "customPrompts": {
        "explain": "Explain this code in detail",
        "fix": "Find and fix bugs in this code",
        "improve": "Suggest improvements for this code"
      }
    }
    ```
  </Step>

  <Step title="Test Functionality">
    Compare side-by-side:

    1. Open same code in both tools
    2. Ask same questions
    3. Compare code generation quality
    4. Evaluate response speed
  </Step>
</Steps>

**Comparison Table:**

| Feature                | Cursor                | RooCode + MegaLLM             |
| ---------------------- | --------------------- | ----------------------------- |
| **Editor Integration** | VS Code fork          | Standalone + Any Editor       |
| **Models Available**   | GPT-4, GPT-3.5        | GPT, Claude, Gemini, and more |
| **API Key**            | OpenAI only           | One key for all models        |
| **Pricing**            | Per-seat subscription | Pay-per-use                   |
| **Customization**      | Limited               | Extensive                     |
| **Offline Mode**       | No                    | No                            |

***

### Scenario 5: Multi-Model Workflow

Use different models for different types of tasks:

**Configuration with Model Profiles:**

```json  theme={null}
{
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "sk-mega-your-api-key-here",
    "model": "gpt-5"
  },
  "modelProfiles": {
    "fast": {
      "model": "gpt-4o-mini",
      "temperature": 0.5,
      "maxTokens": 1000,
      "description": "Fast completions for simple tasks"
    },
    "balanced": {
      "model": "gpt-5",
      "temperature": 0.7,
      "maxTokens": 4096,
      "description": "Balanced quality and speed"
    },
    "quality": {
      "model": "claude-opus-4-1-20250805",
      "temperature": 0.3,
      "maxTokens": 8192,
      "description": "Highest quality for complex tasks"
    },
    "creative": {
      "model": "gpt-5",
      "temperature": 0.9,
      "maxTokens": 4096,
      "description": "Creative documentation and naming"
    },
    "analysis": {
      "model": "claude-sonnet-4",
      "temperature": 0.4,
      "maxTokens": 6000,
      "description": "Code review and analysis"
    }
  }
}
```

**Workflow Example:**

```plaintext  theme={null}
Morning: Rapid Prototyping
→ Switch to "fast" profile (gpt-4o-mini)
→ Quick code generation
→ Fast iterations

Afternoon: Production Code
→ Switch to "quality" profile (claude-opus-4)
→ Generate production-ready code
→ Comprehensive error handling

Code Review Time
→ Switch to "analysis" profile (claude-sonnet-4)
→ Detailed code reviews
→ Security analysis

Documentation
→ Switch to "creative" profile (gpt-5, high temp)
→ Generate engaging docs
→ Creative naming suggestions
```

**Switching Profiles in RooCode:**

1. Click model dropdown (top bar)
2. Select profile: Fast / Balanced / Quality / Creative / Analysis
3. Profile applied to current session

***

### Scenario 6: CI/CD Integration

Use RooCode API for automated code reviews in CI/CD:

**GitHub Actions Example:**

`.github/workflows/roocode-review.yml`:

```yaml  theme={null}
name: AI Code Review with RooCode

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup RooCode CLI
        run: |
          curl -O https://roocode.io/cli/install.sh
          bash install.sh

      - name: Configure MegaLLM
        env:
          MEGALLM_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
        run: |
          mkdir -p ~/.config/RooCode
          cat > ~/.config/RooCode/config.json << EOF
          {
            "provider": "openai-compatible",
            "api": {
              "baseURL": "https://ai.megallm.io/v1",
              "apiKey": "$MEGALLM_API_KEY",
              "model": "claude-sonnet-4"
            }
          }
          EOF

      - name: Run AI Code Review
        run: |
          roocode review \
            --files "$(git diff --name-only origin/main...HEAD)" \
            --output review.md

      - name: Post Review Comment
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## AI Code Review\n\n${review}`
            });
```

## Configuration Options

### Complete Reference

```json  theme={null}
{
  // API Configuration
  "provider": "openai-compatible",
  "api": {
    "baseURL": "https://ai.megallm.io/v1",
    "apiKey": "sk-mega-your-api-key-here",
    "organization": "",
    "model": "gpt-5",
    "temperature": 0.7,
    "maxTokens": 4096,
    "topP": 0.9,
    "frequencyPenalty": 0.0,
    "presencePenalty": 0.0,
    "timeout": 30000
  },

  // Feature Toggles
  "features": {
    "codeCompletion": true,
    "chatInterface": true,
    "codeReview": true,
    "refactoring": true,
    "multiFileEdit": true,
    "contextAwareness": true,
    "autoSave": true
  },

  // Project Settings
  "projectSettings": {
    "language": "typescript",
    "framework": "react",
    "codingStyle": "airbnb",
    "testFramework": "jest",
    "linter": "eslint"
  },

  // Custom Prompts
  "customPrompts": {
    "review": "Review code for bugs and best practices",
    "test": "Generate comprehensive unit tests",
    "doc": "Generate detailed documentation",
    "refactor": "Refactor for better maintainability",
    "optimize": "Optimize for performance",
    "secure": "Analyze for security vulnerabilities"
  },

  // UI Preferences
  "ui": {
    "theme": "dark",
    "fontSize": 14,
    "fontFamily": "Fira Code",
    "showInlineHints": true,
    "showLineNumbers": true,
    "autoSaveChats": true,
    "chatPosition": "right",
    "enableAnimations": true
  },

  // Keyboard Shortcuts
  "shortcuts": {
    "newChat": "Cmd+N",
    "sendMessage": "Cmd+Enter",
    "clearChat": "Cmd+K",
    "switchModel": "Cmd+M",
    "openSettings": "Cmd+,"
  },

  // Advanced
  "advanced": {
    "logLevel": "info",
    "cacheResponses": true,
    "maxChatHistory": 100,
    "contextWindowSize": 8000,
    "streamResponses": true
  }
}
```

### Model Selection Guide

| Task                  | Recommended Model          | Why                      |
| --------------------- | -------------------------- | ------------------------ |
| **Quick Completions** | `gpt-4o-mini`              | Fastest, cost-effective  |
| **Code Review**       | `claude-sonnet-4`          | Excellent analysis       |
| **Complex Logic**     | `claude-opus-4-1-20250805` | Superior reasoning       |
| **Web Development**   | `gpt-5`                    | Best for JS/TS/React     |
| **Documentation**     | `gpt-5`                    | Clear, engaging writing  |
| **Data Science**      | `claude-sonnet-4`          | Strong with pandas/numpy |
| **Systems Code**      | `gemini-2.5-pro`           | Precise, mathematical    |

## Verification

### Test 1: Chat Functionality

1. Open RooCode
2. Click **New Chat**
3. Type: `Write a function to sort an array of objects by a property`
4. Should receive working code

**Expected Response:**

```javascript  theme={null}
function sortByProperty(array, property) {
  return array.sort((a, b) => {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return 0;
  });
}
```

### Test 2: Code Review

1. Paste this code:

```python  theme={null}
def divide(a, b):
    return a / b
```

2. Click **Review Code** button
3. Should identify: Missing zero division check

### Test 3: Multi-File Edit

1. Open multi-file view
2. Request: "Add error handling to all API calls"
3. Should show changes across multiple files
4. Review and apply changes

### Test 4: Connection Status

Check status indicator (top-right):

* 🟢 Green = Connected to MegaLLM
* 🟡 Yellow = Connecting...
* 🔴 Red = Connection failed

Click status to see:

* Model: `gpt-5`
* Endpoint: `https://ai.megallm.io/v1`
* Token usage: Current session stats

## Troubleshooting

<AccordionGroup>
  <Accordion title="Connection timeout errors">
    **Symptoms:**

    * "Failed to connect to API"
    * Requests timeout after 30s
    * Chat messages don't send

    **Solutions:**

    1. **Verify base URL is correct:**
       ```
       https://ai.megallm.io/v1  <Icon icon="check" /> Correct
       https://ai.megallm.io     <Icon icon="xmark" /> Missing /v1
       https://api.openai.com/v1 <Icon icon="xmark" /> Wrong endpoint
       ```

    2. **Test connectivity:**
       ```bash  theme={null}
       # Test connection
       curl -I https://ai.megallm.io/v1/models

       # Should return: HTTP/2 200
       ```

    3. **Check firewall:**
       * Allow RooCode through firewall
       * Check corporate proxy settings
       * Verify no VPN blocking

    4. **Increase timeout:**
       ```json  theme={null}
       {
         "api": {
           "timeout": 60000  // Increase to 60 seconds
         }
       }
       ```

    5. **Test API key manually:**
       ```bash  theme={null}
       curl -X POST https://ai.megallm.io/v1/chat/completions \
         -H "Authorization: Bearer $MEGALLM_API_KEY" \
         -H "Content-Type: application/json" \
         -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"test"}]}'
       ```
  </Accordion>

  <Accordion title="API key not recognized">
    **Symptoms:**

    * "Invalid API key" error
    * 401 Unauthorized
    * Authentication failed

    **Solutions:**

    1. **Verify key format:**
       * Must start with `sk-mega-`
       * Should be 60+ characters
       * No extra spaces or line breaks
       * No quotes in config file around the actual key

    2. **Check key is active:**
       * Login to [Dashboard](https://megallm.io/dashboard)
       * Go to **API Keys**
       * Verify key shows as "Active"
       * Check it's not revoked or expired

    3. **Re-enter the key:**
       * Copy key from dashboard
       * Delete old key from RooCode settings
       * Paste new key
       * Save and restart RooCode

    4. **Test key directly:**
       ```bash  theme={null}
       curl -H "Authorization: Bearer sk-mega-your-actual-key" \
            https://ai.megallm.io/v1/models

       # Should return JSON list of models
       ```
  </Accordion>

  <Accordion title="Poor quality responses">
    **Symptoms:**

    * Irrelevant code suggestions
    * Wrong programming language
    * Incomplete responses

    **Solutions:**

    1. **Provide better context:**
       * Set project language in settings
       * Add framework information
       * Use custom prompts

    2. **Adjust temperature:**
       ```json  theme={null}
       {
         "api": {
           "temperature": 0.3  // Lower = more focused (0.2-0.4 for code)
         }
       }
       ```

    3. **Try different model:**
       ```json  theme={null}
       {
         "api": {
           "model": "claude-sonnet-4"  // Better for analysis
         }
       }
       ```

    4. **Increase max tokens:**
       ```json  theme={null}
       {
         "api": {
           "maxTokens": 8192  // Longer, more complete responses
         }
       }
       ```

    5. **Use specific prompts:**
       ```json  theme={null}
       {
         "customPrompts": {
           "generate": "Generate production-ready TypeScript code following best practices"
         }
       }
       ```
  </Accordion>

  <Accordion title="Configuration not loading">
    **Symptoms:**

    * Settings revert after restart
    * Changes don't apply
    * Using default configuration

    **Solutions:**

    1. **Check config file location:**

       <CodeGroup>
         ```bash Windows theme={null}
         # Should be:
         C:\Users\YourName\AppData\Roaming\RooCode\config.json

         # Not:
         C:\Program Files\RooCode\config.json  # Wrong!
         ```

         ```bash macOS theme={null}
         # Should be:
         ~/Library/Application Support/RooCode/config.json

         # Not:
         /Applications/RooCode.app/config.json  # Wrong!
         ```

         ```bash Linux theme={null}
         # Should be:
         ~/.config/RooCode/config.json

         # Not:
         /etc/roocode/config.json  # Wrong!
         ```
       </CodeGroup>

    2. **Validate JSON syntax:**
       ```bash  theme={null}
       # Check for errors
       cat config.json | python3 -m json.tool

       # Should show formatted JSON or error
       ```

    3. **Check file permissions:**
       ```bash  theme={null}
       # Linux/macOS
       chmod 644 ~/.config/RooCode/config.json

       # Windows: Ensure user has read/write access
       ```

    4. **Reset to defaults:**
       * Backup current config
       * Delete config.json
       * Restart RooCode (creates new config)
       * Reapply settings via UI
  </Accordion>

  <Accordion title="Application crashes or freezes">
    **Symptoms:**

    * RooCode crashes on startup
    * Freezes during long responses
    * Unresponsive UI

    **Solutions:**

    1. **Check system resources:**
       * Close other applications
       * Ensure 4GB+ RAM available
       * Check CPU usage

    2. **Reduce max tokens:**
       ```json  theme={null}
       {
         "api": {
           "maxTokens": 2048  // Reduce from 8192
         }
       }
       ```

    3. **Disable streaming:**
       ```json  theme={null}
       {
         "advanced": {
           "streamResponses": false
         }
       }
       ```

    4. **Clear cache:**
       ```bash  theme={null}
       # Windows
       rmdir /s "%APPDATA%\RooCode\cache"

       # macOS/Linux
       rm -rf ~/Library/Application\ Support/RooCode/cache
       rm -rf ~/.config/RooCode/cache
       ```

    5. **Reinstall RooCode:**
       * Backup config.json
       * Uninstall RooCode
       * Download latest version
       * Install and restore config
  </Accordion>
</AccordionGroup>

## Best Practices

<CardGroup cols={2}>
  <Card title="Project Configurations" icon="folder">
    Create separate configs for different project types
  </Card>

  <Card title="Model Profiles" icon="layer-group">
    Set up profiles for different tasks: fast, quality, creative
  </Card>

  <Card title="Custom Prompts" icon="message">
    Define reusable prompts for common tasks
  </Card>

  <Card title="Monitor Usage" icon="chart-line">
    Check [Dashboard](https://megallm.io/dashboard) regularly for token usage
  </Card>

  <Card title="Backup Configs" icon="floppy-disk">
    Keep backups of working configurations
  </Card>

  <Card title="Security" icon="lock">
    Use environment variables for API keys in shared configs
  </Card>
</CardGroup>

## Advanced Tips

### Environment Variables

RooCode supports environment variable substitution:

```json  theme={null}
{
  "api": {
    "apiKey": "${env:MEGALLM_API_KEY}",
    "baseURL": "${env:MEGALLM_BASE_URL}"
  }
}
```

Set variables:

```bash  theme={null}
export MEGALLM_API_KEY="sk-mega-your-key"
export MEGALLM_BASE_URL="https://ai.megallm.io/v1"
```

### Context Management

Improve responses with better context:

```json  theme={null}
{
  "advanced": {
    "contextWindowSize": 16000,
    "includeProjectStructure": true,
    "includeOpenFiles": true,
    "maxRelevantFiles": 10
  }
}
```

### Response Caching

Save API costs with intelligent caching:

```json  theme={null}
{
  "advanced": {
    "cacheResponses": true,
    "cacheExpiry": 3600,  // seconds
    "maxCacheSize": 100   // MB
  }
}
```

## Next Steps

<CardGroup cols={3}>
  <Card title="Kilocode Setup" icon="code" href="/en/agents/kilocode">
    Configure Kilocode VSCode extension
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