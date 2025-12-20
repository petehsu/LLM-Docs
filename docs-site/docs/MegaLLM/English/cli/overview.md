# CLI Overview

> The MegaLLM CLI is an interactive setup tool that configures AI coding assistants to use the MegaLLM AI service. It automates configuration, manages API keys securely, and provides seamless setup across multiple platforms.

## Quick Start

Get started in seconds:

```bash  theme={null}
npx megallm@latest
```

That's it! The interactive wizard guides you through the entire setup process.

<Tip>
  No installation required - just run `npx megallm@latest` and follow the prompts
</Tip>

## What It Does

The CLI automatically:

* **Detects** installed AI tools and your system configuration
* **Installs** missing tools if needed (with your permission)
* **Configures** AI assistants with your MegaLLM API key
* **Backs up** existing configurations before making changes
* **Validates** settings to ensure everything works correctly

## Supported Tools

<CardGroup cols={3}>
  <Card title="Claude Code" icon="robot">
    System & project-level configuration
  </Card>

  <Card title="Codex/Windsurf" icon="code">
    System-level configuration
  </Card>

  <Card title="OpenCode" icon="brackets-curly">
    System & project-level configuration
  </Card>
</CardGroup>

## Key Features

<CardGroup cols={2}>
  <Card title="Smart Detection" icon="magnifying-glass">
    Auto-detects OS, shell, installed tools, and existing configurations
  </Card>

  <Card title="Automated Setup" icon="wand-magic-sparkles">
    Interactive wizard with step-by-step guidance
  </Card>

  <Card title="Secure Storage" icon="shield-halved">
    Automatic backups and secure API key management
  </Card>

  <Card title="Cross-Platform" icon="globe">
    Works on macOS, Linux, Windows with all major shells
  </Card>
</CardGroup>

## How It Works

<Steps>
  <Step title="Run the CLI">
    Execute `npx megallm@latest` in your terminal
  </Step>

  <Step title="System Detection">
    CLI detects your OS, shell, and installed AI tools
  </Step>

  <Step title="Choose Configuration">
    Select which tool(s) to configure and at what level (system/project)
  </Step>

  <Step title="Enter API Key">
    Provide your MegaLLM API key (or get guided to create one)
  </Step>

  <Step title="Review & Confirm">
    Review configuration summary and confirm
  </Step>

  <Step title="Apply Settings">
    CLI configures files, sets environment variables, and reloads shell
  </Step>
</Steps>

## Setup Levels

Choose between two configuration levels:

### System-Level (Global)

Applies to **all projects** on your machine.

**Best for:**

* Personal development environments
* Single developer setups
* Quick testing and prototyping

**Storage:**

* `~/.claude/` - Claude Code
* `~/.codex/` - Codex/Windsurf
* `~/.config/opencode/` - OpenCode

### Project-Level (Local)

Applies **only to the current project** directory.

**Best for:**

* Team projects with shared configurations
* Different API keys per project
* Version-controlled settings

**Storage:**

* `./.claude/` - Claude Code
* `./opencode.json` - OpenCode

<Note>
  **Codex/Windsurf only supports system-level configuration**
</Note>

## Requirements

<Info>
  **Node.js 18.0.0+** is required. Check your version: `node --version`
</Info>

**Supported Platforms:**

* macOS (Intel & Apple Silicon)
* Linux (all major distributions)
* Windows (10/11 with WSL or native)

**Supported Shells:**

* bash
* zsh
* fish
* PowerShell

## Installation Options

### NPX (Recommended)

No installation needed:

```bash  theme={null}
npx megallm@latest
```

### Global Installation

Install once, use anytime:

```bash  theme={null}
npm install -g megallm
megallm
```

### Specific Version

Run a specific version:

```bash  theme={null}
npx megallm@2.5.9
```

## First-Time Setup Example

```bash  theme={null}
# Run the CLI
npx megallm@latest

# Interactive prompts:
# ✓ System detected: Linux (bash)
# ✓ Tools detected: Claude Code ✓, Codex ✗
#
# ? Which tool? › Claude Code
# ? Setup level? › System-level (global)
# ? Enter API key: sk-mega-***
#
# ✓ Configuration applied successfully!
# 🎉 Ready to use Claude Code with MegaLLM
```

## Getting Your API Key

<Steps>
  <Step title="Visit Dashboard">
    Go to [megallm.io/dashboard](https://megallm.io/dashboard)
  </Step>

  <Step title="Sign Up or Log In">
    Create an account or log in to existing one
  </Step>

  <Step title="Generate API Key">
    Navigate to API Keys section and click "Create New API Key"
  </Step>

  <Step title="Copy Key">
    Copy your key (starts with `sk-mega-`) - you won't see it again
  </Step>

  <Step title="Use in CLI">
    Paste the key when prompted during setup
  </Step>
</Steps>

<Tip>
  The CLI can automatically open the dashboard for you during setup
</Tip>

## What's Next?

<CardGroup cols={2}>
  <Card title="Installation Guide" icon="download" href="/en/cli/installation">
    Detailed installation and requirements
  </Card>

  <Card title="Configuration" icon="gear" href="/en/cli/configuration">
    Complete setup workflow and configuration
  </Card>

  <Card title="Configuration" icon="gear" href="/en/cli/configuration">
    Configuration details for each tool
  </Card>

  <Card title="Examples" icon="code" href="/en/cli/examples">
    Practical usage examples
  </Card>

  <Card title="Troubleshooting" icon="circle-exclamation" href="/en/cli/troubleshooting">
    Common issues and solutions
  </Card>

  <Card title="FAQ" icon="circle-question" href="/en/cli/faq">
    Frequently asked questions
  </Card>
</CardGroup>

## Quick Links

* [Claude Code Configuration](/cli/claude-config)
* [Codex/Windsurf Configuration](/cli/codex-config)
* [OpenCode Configuration](/cli/opencode-config)
* [GitHub Repository](https://github.com/Megallm/megallm-npm)
* [NPM Package](https://www.npmjs.com/package/megallm)

## Support

Need help? We're here for you:

* **Email**: [support@megallm.io](mailto:support@megallm.io)
* **Discord**: [Join our community](https://discord.gg/devsindia)
* **GitHub Issues**: [Report bugs or request features](https://github.com/Megallm/megallm-npm/issues)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt