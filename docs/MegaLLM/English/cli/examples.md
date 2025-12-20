# Usage Examples

> Practical examples showing how to use the MegaLLM CLI in different scenarios.

## Quick Start Example

The simplest way to get started:

```bash  theme={null}
# Run the interactive setup
npx megallm@latest

# Output:
#   __  __                _    _     __  __
#  |  \/  | ___  __ _  __ _| |   | |   |  \/  |
#  | |\/| |/ _ \/ _` |/ _` | |   | |   | |\/| |
#  | |  | |  __/ (_| | (_| | |___| |___| |  | |
#  |_|  |_|\___|\__, |\__,_|_____|_____|_|  |_|
#               |___/
#
# 🚀 MegaLLM CLI Setup Tool
# Supported: Claude Code, Codex/Windsurf, OpenCode
#
# ✓ System detected: Linux (bash)
# ✓ Tools detected: Claude Code ✓
#
# ? Which tool would you like to configure? Claude Code
# ? Setup level? System-level (global)
# ? Do you have a MegaLLM API key? Yes
# ? Enter your MegaLLM API key: sk-mega-***
#
# Configuration Summary:
# - Tool: Claude Code
# - Level: System-level
# - API Key: sk-mega-***86b9 (last 4 chars)
#
# ? Apply this configuration? Yes
#
# ✓ Configuration applied successfully!
# ✓ Shell reloaded
#
# 🎉 Setup complete! You can now use Claude Code with MegaLLM.
```

## Scenario-Based Examples

### Example 1: First-Time Setup for Claude Code

Setting up Claude Code for the first time on a new machine:

```bash  theme={null}
# Step 1: Run the CLI
npx megallm@latest

# Step 2: Follow the prompts
# System detected ✓
# Claude Code detected ✓
#
# ? Which tool would you like to configure?
#   › Claude Code
#     Codex/Windsurf
#     OpenCode
#     Configure All

# Step 3: Choose setup level
# ? Setup level?
#   › System-level (global) - Applies to all projects
#     Project-level (local) - Current directory only

# Step 4: API Key
# ? Do you have a MegaLLM API key?
#   › Yes
#     No - Show me how to get one

# ? Enter your MegaLLM API key:
# sk-mega-****************************************************************
  
# Step 5: Confirm and apply
# Configuration Summary:
# Tool: Claude Code
# Level: System-level
# Files: ~/.claude/settings.json, ~/.claude.json
# Env vars: ANTHROPIC_BASE_URL, ANTHROPIC_API_KEY
#
# ? Apply this configuration? Yes
#
# ✓ Created ~/.claude/settings.json
# ✓ Created ~/.claude.json
# ✓ Added environment variables to ~/.bashrc
# ✓ Configuration applied successfully!
```

### Example 2: Project-Specific Setup

Setting up MegaLLM for a specific project:

```bash  theme={null}
# Navigate to your project
cd ~/projects/my-app

# Run the CLI
npx megallm@latest

# Choose project-level setup
# ? Setup level?
#   System-level (global)
#   › Project-level (local) - Current directory only

# After configuration:
ls -la .claude/
# .claude/
#   settings.json
#   settings.local.json

# Add to .gitignore
echo ".claude/settings.local.json" >> .gitignore

# Commit project settings (without API key)
cat .claude/settings.json
# {
#   "env": {
#     "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
#   }
# }

git add .claude/settings.json .gitignore
git commit -m "Add MegaLLM configuration"
```

### Example 3: Configuring Multiple Tools

Set up both Claude Code and Codex:

```bash  theme={null}
# Run the CLI
npx megallm@latest

# Select multiple tools
# ? Which tool would you like to configure?
#   Claude Code
#   Codex/Windsurf
#   OpenCode
#   › Configure All

# CLI will configure each tool in sequence
# 1. Configuring Claude Code...
#    ✓ Claude Code configured
#
# 2. Configuring Codex...
#    ✓ Codex configured
#
# 3. Configuring OpenCode...
#    ✓ OpenCode configured
#
# ✓ All tools configured successfully!
```

### Example 4: Updating Existing Configuration

Update your configuration with a new API key:

```bash  theme={null}
# Run the CLI again
npx megallm@latest

# Existing configuration detected
# Found MegaLLM configuration:
# - ~/.claude/settings.json
# - ~/.codex/config.toml
#
# ? What would you like to do?
#   › Override (remove old, apply new)
#     Skip (keep existing)
#     Cancel

# Choose Override
# ? Which tool would you like to reconfigure?
#   › Claude Code
#     Codex/Windsurf
#     Both

# Enter new API key
# ? Enter your new MegaLLM API key: sk-mega-new-key-here

# ✓ Backed up old configuration
# ✓ Applied new configuration
```

### Example 5: Team Setup with Shared Config

Set up MegaLLM for a team project with version-controlled configuration:

```bash  theme={null}
# Project maintainer: Create base configuration
cd ~/projects/team-project
npx megallm@latest

# Choose project-level
# Setup level: Project-level

# Create .claude/settings.json (without API key)
cat > .claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
  }
}
EOF

# Document API key requirement
cat > .claude/README.md << 'EOF'
# MegaLLM Setup

To use this project with MegaLLM:

1. Get your API key from https://megallm.io/dashboard
2. Create `.claude/settings.local.json`:
   {
     "env": {
       "ANTHROPIC_API_KEY": "your-api-key-here"
     }
   }
3. Or set environment variable:
   export ANTHROPIC_API_KEY="your-api-key-here"
EOF

# Commit shared configuration
git add .claude/settings.json .claude/README.md
git commit -m "Add MegaLLM team configuration"

# Team members: Clone and add their own API key
git clone repo
cd repo
echo '{ "env": { "ANTHROPIC_API_KEY": "my-key" } }' > .claude/settings.local.json
```

### Example 6: Debug Mode for Troubleshooting

Use debug mode to diagnose issues:

```bash  theme={null}
# Run with debug output
DEBUG=* npx megallm@latest

# Detailed output shows:
# DEBUG: Detecting OS...
# DEBUG: OS: Linux
# DEBUG: Shell: bash
# DEBUG: Shell config: /home/user/.bashrc
# DEBUG: Checking for Claude Code...
# DEBUG: Claude Code found: /usr/local/bin/claude
# DEBUG: Checking for existing config...
# DEBUG: Found: /home/user/.claude/settings.json
# DEBUG: Parsing config file...
# DEBUG: Config valid: true
# ... more detailed logs ...
```

### Example 7: Automated CI/CD Setup

Use the CLI in CI/CD pipelines:

<CodeGroup>
  ```yaml GitHub Actions theme={null}
  name: Setup MegaLLM
  on: [push]

  jobs:
    setup:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3

        - name: Setup Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '18'

        - name: Configure MegaLLM
          env:
            ANTHROPIC_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
            ANTHROPIC_BASE_URL: https://ai.megallm.io
          run: |
            mkdir -p .claude
            cat > .claude/settings.json << EOF
            {
              "env": {
                "ANTHROPIC_BASE_URL": "$ANTHROPIC_BASE_URL",
                "ANTHROPIC_API_KEY": "$ANTHROPIC_API_KEY"
              }
            }
            EOF

        - name: Run tests with Claude Code
          run: npm test
  ```

  ```yaml GitLab CI theme={null}
  setup_megallm:
    stage: setup
    image: node:18
    script:
      - mkdir -p .claude
      - |
        cat > .claude/settings.json << EOF
        {
          "env": {
            "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
            "ANTHROPIC_API_KEY": "${MEGALLM_API_KEY}"
          }
        }
        EOF
    variables:
      ANTHROPIC_BASE_URL: "https://ai.megallm.io"
    artifacts:
      paths:
        - .claude/
  ```
</CodeGroup>

### Example 8: Windsurf-Specific Setup

Configure Windsurf (Codex variant):

```bash  theme={null}
# Run the CLI
npx megallm@latest

# Select Codex
# ? Which tool would you like to configure?
#   Claude Code
#   › Codex/Windsurf
#     OpenCode

# Note: Windsurf is automatically detected
# ✓ Windsurf variant detected

# Configuration proceeds normally
# Creates ~/.codex/config.toml
# Sets MEGALLM_API_KEY environment variable

# Verify configuration
cat ~/.codex/config.toml
# model_provider = "megallm"
# model = "gpt-5"
#
# [model_providers.megallm]
# name = "OpenAI using Chat Completions"
# base_url = "https://ai.megallm.io/v1"
# env_key = "MEGALLM_API_KEY"
```

## Advanced Scenarios

### Switching Between Different APIs

Use different configurations for different projects:

```bash  theme={null}
# Project A: Use MegaLLM
cd ~/projects/project-a
npx megallm@latest
# Configure with MegaLLM API key

# Project B: Use different API
cd ~/projects/project-b
# Create custom configuration
cat > .claude/settings.json << 'EOF'
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://other-api.com",
    "ANTHROPIC_API_KEY": "other-key"
  }
}
EOF
```

### Environment-Specific Configurations

Different configurations for development, staging, production:

```bash  theme={null}
# Development
export ANTHROPIC_API_KEY="sk-mega-dev-key"

# Staging
export ANTHROPIC_API_KEY="sk-mega-staging-key"

# Production
export ANTHROPIC_API_KEY="sk-mega-prod-key"

# Or use different config files
cp .claude/settings.dev.json .claude/settings.json  # for dev
cp .claude/settings.prod.json .claude/settings.json  # for prod
```

### Docker Container Setup

Use MegaLLM in Docker containers:

```dockerfile  theme={null}
FROM node:18

# Install MegaLLM CLI globally
RUN npm install -g megallm

# Set environment variables
ENV ANTHROPIC_BASE_URL=https://ai.megallm.io
ENV ANTHROPIC_API_KEY=your-key-here

# Create configuration directory
RUN mkdir -p /root/.claude

# Copy configuration file
COPY .claude/settings.json /root/.claude/settings.json

# Your app setup
WORKDIR /app
COPY . .
RUN npm install

CMD ["npm", "start"]
```

## Common Workflows

### Workflow 1: New Developer Onboarding

```bash  theme={null}
# 1. New developer clones the repository
git clone https://github.com/company/project.git
cd project

# 2. Sees MegaLLM setup instructions in README
cat README.md
# "Get your API key from https://megallm.io/dashboard"

# 3. Gets API key from dashboard
# Opens https://megallm.io/dashboard in browser

# 4. Runs setup (with NO_BANNER for cleaner output)
NO_BANNER=1 npx megallm@latest

# 5. Enters API key when prompted
# Configuration automatically merges with project settings

# 6. Starts developing
npm run dev
```

### Workflow 2: Migration from OpenAI

```bash  theme={null}
# 1. Currently using OpenAI directly
# .env file has: MEGALLM_API_KEY=sk-mega-...

# 2. Switch to MegaLLM
npx megallm@latest

# 3. CLI detects Claude Code/Codex and configures
# Sets ANTHROPIC_BASE_URL=https://ai.megallm.io

# 4. Update application code (if needed)
# Change: base_url from api.openai.com to ai.megallm.io
# Or: Let environment variables handle it automatically

# 5. Test the migration
npm test

# 6. Deploy with new configuration
```

### Workflow 3: Multi-Tool Development

```bash  theme={null}
# Developer using both Claude Code and Codex
npx megallm@latest

# Configure all tools at once
# ? Which tool? Configure All

# Result:
# - Claude Code uses ANTHROPIC_* env vars
# - Codex uses MEGALLM_API_KEY env var
# - Both point to ai.megallm.io

# Can switch between tools seamlessly
claude-code  # Uses ANTHROPIC_API_KEY
codex        # Uses MEGALLM_API_KEY
```

## Troubleshooting Examples

### Example: Permission Denied

```bash  theme={null}
# Error during setup
npx megallm@latest
# Error: EACCES: permission denied, mkdir '/home/user/.claude'

# Fix permissions
sudo chown -R $USER ~/.claude ~/.codex
chmod -R 755 ~/.claude ~/.codex

# Retry
npx megallm@latest
```

### Example: Configuration Not Loading

```bash  theme={null}
# Check if environment variables are set
env | grep -E "ANTHROPIC|MEGALLM"
# (no output = not set)

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc

# Or restart terminal
exit
# Open new terminal and check again
env | grep -E "ANTHROPIC|MEGALLM"
# ANTHROPIC_BASE_URL=https://ai.megallm.io
# ANTHROPIC_API_KEY=sk-mega-...
```

### Example: API Key Validation Failed

```bash  theme={null}
npx megallm@latest

# ? Enter your MegaLLM API key: sk-mega-abc
# ✗ API key must be at least 20 characters long

# Fix: Enter complete API key
# ? Enter your MegaLLM API key: sk-mega-****************************************************************
# ✓ API key validated
```

## Next Steps

* Review [Configuration Details](/cli/configuration)
* Read the [FAQ](/cli/faq)
* Check [Troubleshooting Guide](/cli/troubleshooting) for common issues


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt