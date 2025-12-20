# FAQ

> Common questions and answers about the MegaLLM NPM package and CLI tool.

## General Questions

<AccordionGroup>
  <Accordion title="What is the MegaLLM CLI?">
    The MegaLLM CLI is an interactive setup tool that configures AI coding assistants (Claude Code, Codex/Windsurf, and OpenCode) to use the MegaLLM AI service. It automates the configuration process, manages API keys securely, and provides a seamless setup experience across different platforms.
  </Accordion>

  <Accordion title="Which AI tools are supported?">
    The CLI currently supports:

    * **Claude Code** - System-level and project-level configuration
    * **Codex/Windsurf** - System-level configuration only
    * **OpenCode** - System-level and project-level configuration

    More tools may be added in future releases.
  </Accordion>

  <Accordion title="Do I need to install the CLI?">
    No! You can run it directly using npx:

    ```bash  theme={null}
    npx megallm@latest
    ```

    However, you can also install it globally if you prefer:

    ```bash  theme={null}
    npm install -g megallm
    ```
  </Accordion>

  <Accordion title="What are the system requirements?">
    * **Node.js**: Version 18.0.0 or higher
    * **Operating System**: macOS, Linux, or Windows
    * **Shell**: bash, zsh, fish, or PowerShell

    Check your Node.js version with: `node --version`
  </Accordion>
</AccordionGroup>

## Installation & Setup

<AccordionGroup>
  <Accordion title="How do I get a MegaLLM API key?">
    1. Visit [megallm.io/dashboard](https://megallm.io/dashboard)
    2. Sign up or log in to your account
    3. Navigate to the API Keys section
    4. Click "Create New API Key"
    5. Copy your API key (starts with `sk-mega-`)
    6. Save it securely - you won't be able to see it again

    The CLI can open this page for you automatically during setup.
  </Accordion>

  <Accordion title="What's the difference between system-level and project-level configuration?">
    **System-Level (Global)**:

    * Applies to all projects on your machine
    * Stored in your home directory (`~/.claude/`, `~/.codex/`, etc.)
    * Best for personal development environments
    * Easier to manage for single developers

    **Project-Level (Local)**:

    * Applies only to the current project directory
    * Stored in the project folder (`./.claude/`, `./opencode.json`, etc.)
    * Best for team projects with shared configurations
    * Allows different API keys per project
    * Can be version-controlled (without exposing API keys)

    <Note>
      **Important**: Codex/Windsurf only supports system-level configuration.
    </Note>
  </Accordion>

  <Accordion title="How do I configure multiple tools?">
    When running the CLI, you'll be asked which tool to configure:

    ```
    ? Which tool would you like to configure?
      Claude Code
      Codex/Windsurf
      OpenCode
      Configure All  ← Select this option
    ```

    Selecting "Configure All" will set up all detected tools in sequence.

    Alternatively, run the CLI multiple times and select one tool each time.
  </Accordion>

  <Accordion title="Will the CLI install AI tools if they're missing?">
    Yes! If the CLI detects that a tool is not installed, it will offer to install it:

    ```
    ? Claude Code is not installed. Would you like to install it? (Y/n)
    ```

    The CLI installs tools via NPM as global packages.
  </Accordion>
</AccordionGroup>

## Configuration

<AccordionGroup>
  <Accordion title="Where are configuration files stored?">
    **Claude Code**:

    * System: `~/.claude/settings.json`, `~/.claude.json`
    * Project: `./.claude/settings.json` or `./.claude/settings.local.json`

    **Codex/Windsurf**:

    * System: `~/.codex/config.toml`

    **OpenCode**:

    * System: `~/.config/opencode/opencode.json`
    * Project: `./opencode.json`

    **Environment Variables**:

    * bash: `~/.bashrc`
    * zsh: `~/.zshrc`
    * fish: `~/.config/fish/config.fish`
    * PowerShell: PowerShell profile
  </Accordion>

  <Accordion title="What if I already have MegaLLM configured?">
    The CLI will detect existing configurations and ask what you'd like to do:

    ```
    Found existing MegaLLM configuration:
    - ~/.claude/settings.json
    - ~/.codex/config.toml

    ? What would you like to do?
      Override (remove old, apply new)
      Skip (keep existing)
      Cancel
    ```

    Selecting "Override" will:

    1. Create backup files (`.backup` suffix)
    2. Remove old configuration
    3. Apply new configuration

    Selecting "Skip" will keep your existing setup and exit.
  </Accordion>

  <Accordion title="How do I update my API key?">
    Simply run the CLI again and choose "Override" when prompted about existing configuration:

    ```bash  theme={null}
    npx megallm@latest

    # Choose: Override (remove old, apply new)
    # Enter your new API key
    ```

    The CLI will backup your old configuration before applying the new one.
  </Accordion>

  <Accordion title="Can I use different API keys for different projects?">
    Yes! Use project-level configuration:

    ```bash  theme={null}
    # Project A
    cd ~/projects/project-a
    npx megallm@latest
    # Choose: Project-level
    # Enter API key for Project A

    # Project B
    cd ~/projects/project-b
    npx megallm@latest
    # Choose: Project-level
    # Enter API key for Project B
    ```

    Each project will have its own `.claude/settings.json` with its own API key.
  </Accordion>
</AccordionGroup>

## Troubleshooting

<AccordionGroup>
  <Accordion title="The CLI says a tool is installed but I can't find it">
    The CLI checks for tools using these methods:

    1. NPM global package list
    2. Command availability in PATH
    3. Known installation directories

    If detection fails:

    1. Ensure the tool is installed globally: `npm list -g --depth=0`
    2. Check if the command is available: `which claude-code` or `which codex`
    3. Restart your terminal
    4. Try installing manually: `npm install -g @anthropic-ai/claude-code`
  </Accordion>

  <Accordion title="I get 'permission denied' errors">
    This usually means you don't have write access to the configuration directories.

    **macOS/Linux Fix**:

    ```bash  theme={null}
    # Fix ownership of config directories
    sudo chown -R $USER ~/.claude ~/.codex ~/.config/opencode

    # Fix permissions
    chmod -R 755 ~/.claude ~/.codex ~/.config/opencode
    ```

    **Windows Fix**:

    * Run your terminal as Administrator
    * Or: Fix permissions in File Explorer → Properties → Security
  </Accordion>

  <Accordion title="My configuration isn't being used">
    **Check 1: Environment Variables**

    ```bash  theme={null}
    # Claude Code
    echo $ANTHROPIC_BASE_URL
    echo $ANTHROPIC_API_KEY

    # Codex
    echo $MEGALLM_API_KEY
    ```

    If empty, reload your shell:

    ```bash  theme={null}
    source ~/.bashrc  # or ~/.zshrc
    # Or restart your terminal
    ```

    **Check 2: Configuration Files**

    ```bash  theme={null}
    # Claude Code
    cat ~/.claude/settings.json

    # Codex
    cat ~/.codex/config.toml
    ```

    Verify the files exist and contain your API key.

    **Check 3: File Permissions**

    ```bash  theme={null}
    ls -la ~/.claude/settings.json
    ls -la ~/.codex/config.toml
    ```

    Files should be readable by your user.
  </Accordion>

  <Accordion title="I get 'Invalid API key' errors">
    1. **Verify key format**: Should start with `sk-mega-`
    2. **Check for typos**: Copy-paste the key directly from the dashboard
    3. **Trim whitespace**: Remove any spaces before/after the key
    4. **Key length**: Must be at least 20 characters
    5. **Regenerate**: Create a new API key at [megallm.io/dashboard](https://megallm.io/dashboard)

    Test your API key:

    ```bash  theme={null}
    curl -H "Authorization: Bearer YOUR_API_KEY" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="How do I completely remove MegaLLM configuration?">
    **Remove Configuration Files**:

    ```bash  theme={null}
    # Claude Code
    rm -rf ~/.claude/settings.json ~/.claude.json

    # Codex
    rm -rf ~/.codex/config.toml

    # OpenCode
    rm -rf ~/.config/opencode/opencode.json

    # Project-level
    rm -rf ./.claude ./opencode.json
    ```

    **Remove Environment Variables**:
    Edit your shell config file (`~/.bashrc`, `~/.zshrc`, etc.) and remove these lines:

    ```bash  theme={null}
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"
    export ANTHROPIC_API_KEY="sk-mega-..."
    export MEGALLM_API_KEY="sk-mega-..."
    ```

    Then reload: `source ~/.bashrc` or restart terminal.
  </Accordion>

  <Accordion title="Can I see what the CLI is doing in detail?">
    Yes! Run in debug mode:

    ```bash  theme={null}
    DEBUG=* npx megallm@latest
    ```

    This will show detailed logs of:

    * System detection
    * Tool detection
    * File operations
    * Configuration changes
    * Error stack traces
  </Accordion>
</AccordionGroup>

## Advanced Usage

<AccordionGroup>
  <Accordion title="Can I use the CLI in CI/CD pipelines?">
    Yes, but it's better to configure manually in CI/CD environments:

    ```yaml  theme={null}
    # GitHub Actions example
    - name: Configure MegaLLM
      env:
        ANTHROPIC_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
      run: |
        mkdir -p .claude
        echo '{"env":{"ANTHROPIC_BASE_URL":"https://ai.megallm.io","ANTHROPIC_API_KEY":"'$ANTHROPIC_API_KEY'"}}' > .claude/settings.json
    ```

    This avoids interactive prompts and is more reliable in automated environments.
  </Accordion>

  <Accordion title="How do I configure MegaLLM in a Docker container?">
    Add configuration during Docker build:

    ```dockerfile  theme={null}
    FROM node:18

    # Set environment variables
    ENV ANTHROPIC_BASE_URL=https://ai.megallm.io
    ENV ANTHROPIC_API_KEY=your-key-here

    # Or copy configuration files
    COPY .claude/settings.json /root/.claude/settings.json

    WORKDIR /app
    COPY . .
    RUN npm install
    CMD ["npm", "start"]
    ```

    Or pass API key at runtime:

    ```bash  theme={null}
    docker run -e ANTHROPIC_API_KEY=sk-mega-... myimage
    ```
  </Accordion>

  <Accordion title="Can I version control my configuration?">
    **Yes, but carefully**:

    **DO commit**:

    * Project-level configuration WITHOUT API keys
    * `.claude/settings.json` with only `ANTHROPIC_BASE_URL`
    * Documentation for team members

    **DON'T commit**:

    * API keys
    * `.claude/settings.local.json`
    * Personal environment variables

    **Example `.claude/settings.json` for version control**:

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
      }
    }
    ```

    **Add to `.gitignore`**:

    ```
    .claude/settings.local.json
    .claude.json
    ```

    **Team members add their own API key**:

    ```json  theme={null}
    # .claude/settings.local.json (not committed)
    {
      "env": {
        "ANTHROPIC_API_KEY": "sk-mega-personal-key"
      }
    }
    ```
  </Accordion>

  <Accordion title="Can I use different models with each tool?">
    Yes! Each tool's configuration file allows you to specify the model.

    **Claude Code** (`~/.claude/settings.json`):

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
        "ANTHROPIC_API_KEY": "sk-mega-...",
        "ANTHROPIC_MODEL": "claude-opus-4-1-20250805"
      }
    }
    ```

    **Codex** (`~/.codex/config.toml`):

    ```toml  theme={null}
    model = "gpt-5"  # Change to any supported model
    ```

    **OpenCode** (`~/.config/opencode/opencode.json`):

    ```json  theme={null}
    {
      "model": "gemini-2.5-pro"
    }
    ```

    See [Models Catalog](/home/models) for available models.
  </Accordion>

  <Accordion title="What happens to my backups?">
    The CLI creates backup files before modifying configurations:

    ```
    ~/.claude/settings.json.backup
    ~/.codex/config.toml.backup
    ~/.config/opencode/opencode.json.backup
    ```

    Backups are created with the `.backup` suffix and contain your previous configuration.

    To restore from backup:

    ```bash  theme={null}
    mv ~/.claude/settings.json.backup ~/.claude/settings.json
    ```

    You can delete backups manually if you don't need them:

    ```bash  theme={null}
    rm ~/.claude/*.backup ~/.codex/*.backup
    ```
  </Accordion>
</AccordionGroup>

## Getting Help

<AccordionGroup>
  <Accordion title="Where can I get support?">
    **Documentation**:

    * Main Docs: [docs.megallm.io](https://docs.megallm.io)
    * API Reference: [docs.megallm.io/api](https://docs.megallm.io/api)

    **Support Channels**:

    * Email: [support@megallm.io](mailto:support@megallm.io)
    * GitHub Issues: [github.com/Megallm/megallm-npm/issues](https://github.com/Megallm/megallm-npm/issues)
    * Discord: [discord.gg/devsindia](https://discord.gg/devsindia)

    **Community**:

    * Twitter/X: [@megallmio](https://x.com/megallmio)
    * YouTube: [youtube.com/@Megallmio](https://youtube.com/@Megallmio)
  </Accordion>

  <Accordion title="How do I report a bug?">
    1. Check existing issues: [github.com/Megallm/megallm-npm/issues](https://github.com/Megallm/megallm-npm/issues)
    2. If not found, create a new issue with:
       * CLI version: `npx megallm@latest --version`
       * Node.js version: `node --version`
       * Operating system
       * Shell type
       * Error message/logs (run with `DEBUG=*`)
       * Steps to reproduce
  </Accordion>

  <Accordion title="How do I request a feature?">
    Open a feature request on GitHub:
    [github.com/Megallm/megallm-npm/issues/new](https://github.com/Megallm/megallm-npm/issues/new)

    Include:

    * Description of the feature
    * Use case / why it's needed
    * Any relevant examples or mockups
  </Accordion>
</AccordionGroup>

## Still Have Questions?

Can't find your answer? We're here to help!

<CardGroup cols={2}>
  <Card title="Email Support" icon="envelope" href="mailto:support@megallm.io">
    Get help from our support team
  </Card>

  <Card title="GitHub Issues" icon="github" href="https://github.com/Megallm/megallm-npm/issues">
    Report bugs or request features
  </Card>

  <Card title="Discord Community" icon="discord" href="https://discord.gg/devsindia">
    Chat with the community
  </Card>

  <Card title="Documentation" icon="book-open" href="/en/home/introduction">
    Browse complete documentation
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt