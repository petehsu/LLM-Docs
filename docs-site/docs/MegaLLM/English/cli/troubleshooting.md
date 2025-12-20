# Troubleshooting

> Solutions to common issues when using the MegaLLM CLI.

## Installation Issues

<AccordionGroup>
  <Accordion title="npm: command not found">
    Node.js and npm are not installed.

    **Solution:**

    <Tabs>
      <Tab title="macOS">
        ```bash  theme={null}
        # Using Homebrew
        brew install node

        # Or download from nodejs.org
        ```
      </Tab>

      <Tab title="Linux">
        ```bash  theme={null}
        # Ubuntu/Debian
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs

        # Fedora
        sudo dnf install nodejs
        ```
      </Tab>

      <Tab title="Windows">
        Download and install from [nodejs.org](https://nodejs.org/)
      </Tab>
    </Tabs>

    Verify installation:

    ```bash  theme={null}
    node --version
    npm --version
    ```
  </Accordion>

  <Accordion title="EACCES permission denied errors">
    You don't have permission to install global packages.

    **Solution 1: Configure npm to use a different directory (Recommended)**

    ```bash  theme={null}
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'

    # Add to ~/.bashrc or ~/.zshrc
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

    **Solution 2: Fix npm permissions**

    ```bash  theme={null}
    sudo chown -R $USER /usr/local/lib/node_modules
    sudo chown -R $USER /usr/local/bin
    ```

    **Solution 3: Use npx (no installation needed)**

    ```bash  theme={null}
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="Old version being used">
    npm cache has an outdated version.

    **Solution:**

    ```bash  theme={null}
    # Clear npm cache
    npm cache clean --force

    # Run latest version
    npx megallm@latest

    # Or update global installation
    npm update -g megallm

    # Verify version
    npx megallm@latest --version
    ```
  </Accordion>
</AccordionGroup>

## Configuration Issues

<AccordionGroup>
  <Accordion title="Configuration not loading">
    Configuration files aren't being read.

    **Diagnosis:**

    ```bash  theme={null}
    # Check if files exist
    ls -la ~/.claude/settings.json
    ls -la ~/.codex/config.toml
    ls -la ~/.config/opencode/opencode.json

    # Check project-level configs
    ls -la .claude/settings.json
    ls -la opencode.json
    ```

    **Solutions:**

    **1. Verify file locations:**

    ```bash  theme={null}
    # Claude Code
    ~/.claude/settings.json          # System
    ./.claude/settings.json          # Project

    # Codex
    ~/.codex/config.toml             # System only

    # OpenCode
    ~/.config/opencode/opencode.json # System
    ./opencode.json                  # Project
    ```

    **2. Check file permissions:**

    ```bash  theme={null}
    chmod 644 ~/.claude/settings.json
    chmod 644 ~/.codex/config.toml
    chmod 644 ~/.config/opencode/opencode.json
    ```

    **3. Validate syntax:**

    ```bash  theme={null}
    # JSON files
    jq . ~/.claude/settings.json

    # TOML files
    cat ~/.codex/config.toml
    # (install toml-cli for validation)
    ```

    **4. Check working directory:**

    ```bash  theme={null}
    pwd
    # For project-level configs, you must be in the project directory
    ```
  </Accordion>

  <Accordion title="API key not recognized">
    API key isn't being read from config or environment.

    **Diagnosis:**

    ```bash  theme={null}
    # Check environment variables
    echo $ANTHROPIC_API_KEY
    echo $MEGALLM_API_KEY

    # Check config files
    jq '.env.ANTHROPIC_API_KEY' ~/.claude/settings.json
    cat ~/.codex/config.toml | grep MEGALLM_API_KEY
    jq '.provider.anthropic.options.apiKey' ~/.config/opencode/opencode.json
    ```

    **Solutions:**

    **1. Reload shell configuration:**

    ```bash  theme={null}
    source ~/.bashrc  # or ~/.zshrc
    # Or restart your terminal
    ```

    **2. Verify API key format:**

    * Must start with `sk-mega-`
    * At least 20 characters long
    * No spaces or quotes around the key

    **3. Set environment variable manually:**

    ```bash  theme={null}
    # Claude Code
    export ANTHROPIC_API_KEY="sk-mega-your-key"

    # Codex/Windsurf and OpenCode
    export MEGALLM_API_KEY="sk-mega-your-key"
    ```

    **4. Test API key directly:**

    ```bash  theme={null}
    curl -H "Authorization: Bearer sk-mega-your-key" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="Wrong base URL being used">
    Tool is connecting to the wrong API endpoint.

    **Diagnosis:**

    ```bash  theme={null}
    # Check environment variables
    echo $ANTHROPIC_BASE_URL

    # Check config files
    jq '.env.ANTHROPIC_BASE_URL' ~/.claude/settings.json
    cat ~/.codex/config.toml | grep base_url
    jq '.provider.anthropic.options.baseURL' ~/.config/opencode/opencode.json
    ```

    **Solution:**

    Ensure base URL is exactly:

    ```
    https://ai.megallm.io
    ```

    **Common mistakes:**

    ```bash  theme={null}
    # <Icon icon="xmark" /> Wrong
    https://ai.megallm.io/      # Trailing slash
    https://ai.megallm.io/v1/   # Extra /v1/ (Codex/OpenCode only)
    http://ai.megallm.io        # HTTP instead of HTTPS

    # <Icon icon="check" /> Correct for Claude Code
    https://ai.megallm.io

    # <Icon icon="check" /> Correct for Codex/OpenCode
    https://ai.megallm.io/v1
    ```

    **Fix:**

    ```bash  theme={null}
    # Claude Code
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"

    # Update config files with correct URL
    ```
  </Accordion>

  <Accordion title="Configuration priority issues">
    Wrong configuration is being used.

    **Understanding Priority:**

    <Steps>
      <Step title="Environment Variables (Highest)">
        Variables set in shell always take precedence
      </Step>

      <Step title="Project-Level Config">
        Config in current directory (`.claude/`, `opencode.json`)
      </Step>

      <Step title="System-Level Config (Lowest)">
        Global config in home directory (`~/.claude/`, `~/.codex/`, `~/.config/opencode/`)
      </Step>
    </Steps>

    **Diagnosis:**

    ```bash  theme={null}
    # Check what's set where
    echo "ENV VAR: $ANTHROPIC_API_KEY"
    echo "PROJECT: $(jq -r '.env.ANTHROPIC_API_KEY' .claude/settings.json 2>/dev/null)"
    echo "SYSTEM: $(jq -r '.env.ANTHROPIC_API_KEY' ~/.claude/settings.json 2>/dev/null)"
    ```

    **Solution:**

    Remove conflicting configurations or use the right priority level:

    ```bash  theme={null}
    # To force project-level, unset environment variable
    unset ANTHROPIC_API_KEY

    # To force environment variable, set it
    export ANTHROPIC_API_KEY="sk-mega-your-key"
    ```
  </Accordion>
</AccordionGroup>

## CLI Execution Issues

<AccordionGroup>
  <Accordion title="CLI hangs or freezes">
    CLI is stuck during execution.

    **Solutions:**

    **1. Cancel and retry:**

    ```bash  theme={null}
    # Press Ctrl+C to cancel
    # Then run again
    npx megallm@latest
    ```

    **2. Check for prompts:**
    The CLI may be waiting for input. Look for questions like:

    * "Enter your API key:"
    * "Continue? (y/n)"

    **3. Run with debug mode:**

    ```bash  theme={null}
    DEBUG=* npx megallm@latest
    # Shows detailed logs of what's happening
    ```

    **4. Check for background processes:**

    ```bash  theme={null}
    # Check if another instance is running
    ps aux | grep megallm
    ```
  </Accordion>

  <Accordion title="Tool not detected">
    CLI says a tool isn't installed but it is.

    **Diagnosis:**

    ```bash  theme={null}
    # Check if tool is globally installed
    npm list -g --depth=0 | grep claude
    npm list -g --depth=0 | grep codex
    npm list -g --depth=0 | grep opencode

    # Check if command is available
    which claude-code
    which codex
    which windsurf
    which opencode
    ```

    **Solutions:**

    **1. Ensure global installation:**

    ```bash  theme={null}
    npm install -g @anthropic-ai/claude-code
    npm install -g @codeium/windsurf
    npm install -g opencode
    ```

    **2. Restart terminal:**

    ```bash  theme={null}
    # Close and reopen terminal
    # Or reload shell config
    source ~/.bashrc
    ```

    **3. Check PATH:**

    ```bash  theme={null}
    echo $PATH
    # Should include npm global bin directory
    ```

    **4. Manual configuration:**
    If detection fails, configure manually without the CLI.
  </Accordion>

  <Accordion title="Permission denied when creating config files">
    CLI can't write to configuration directories.

    **Solution:**

    **macOS/Linux:**

    ```bash  theme={null}
    # Fix ownership
    sudo chown -R $USER ~/.claude ~/.codex ~/.config/opencode

    # Fix permissions
    chmod -R 755 ~/.claude ~/.codex ~/.config/opencode

    # For project configs
    chmod -R 755 .claude
    ```

    **Windows:**
    Run terminal as Administrator or fix folder permissions in File Explorer.
  </Accordion>
</AccordionGroup>

## API Connection Issues

<AccordionGroup>
  <Accordion title="API connection failed">
    Can't connect to MegaLLM API.

    **Diagnosis:**

    ```bash  theme={null}
    # Test API connection
    curl -v https://ai.megallm.io/v1/models \
      -H "Authorization: Bearer sk-mega-your-key"
    ```

    **Solutions:**

    **1. Check internet connection:**

    ```bash  theme={null}
    ping -c 3 ai.megallm.io
    ```

    **2. Check firewall/proxy:**

    ```bash  theme={null}
    # If behind a proxy, set npm proxy
    npm config set proxy http://proxy.company.com:8080
    npm config set https-proxy http://proxy.company.com:8080
    ```

    **3. Verify API key:**

    * Go to [megallm.io/dashboard](https://megallm.io/dashboard)
    * Generate a new API key
    * Update your configuration

    **4. Check API status:**
    Visit [megallm.io/status](https://megallm.io/status) for service status
  </Accordion>

  <Accordion title="401 Unauthorized error">
    API key is invalid or expired.

    **Solution:**

    **1. Generate new API key:**

    * Go to [megallm.io/dashboard](https://megallm.io/dashboard)
    * Create new API key
    * Update configuration

    **2. Update config:**

    ```bash  theme={null}
    # Run CLI again to reconfigure
    npx megallm@latest

    # Or update manually
    jq '.env.ANTHROPIC_API_KEY = "new-key"' ~/.claude/settings.json > tmp.json && mv tmp.json ~/.claude/settings.json
    ```

    **3. Clear and reset:**

    ```bash  theme={null}
    # Remove old config
    rm ~/.claude/settings.json ~/.claude.json
    rm ~/.codex/config.toml
    rm ~/.config/opencode/opencode.json

    # Run CLI fresh
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="Rate limit exceeded">
    Too many API requests in a short time.

    **Solution:**

    **1. Wait and retry:**
    Rate limits reset after a period (usually 1 minute).

    **2. Check your usage:**

    * Go to [megallm.io/dashboard](https://megallm.io/dashboard)
    * View API usage statistics

    **3. Upgrade plan:**
    If you consistently hit rate limits, consider upgrading your plan.

    **4. Implement retry logic:**

    ```python  theme={null}
    # In your application code
    import time
    import openai

    for i in range(3):
        try:
            response = client.chat.completions.create(...)
            break
        except openai.RateLimitError:
            if i < 2:
                time.sleep(2 ** i)  # Exponential backoff
            else:
                raise
    ```
  </Accordion>
</AccordionGroup>

## Shell and Environment Issues

<AccordionGroup>
  <Accordion title="Environment variables not persisting">
    Variables are lost after closing terminal.

    **Solution:**

    Environment variables must be added to shell config files:

    ```bash  theme={null}
    # Determine your shell
    echo $SHELL

    # bash: ~/.bashrc or ~/.bash_profile
    echo 'export ANTHROPIC_API_KEY="sk-mega-..."' >> ~/.bashrc
    source ~/.bashrc

    # zsh: ~/.zshrc
    echo 'export ANTHROPIC_API_KEY="sk-mega-..."' >> ~/.zshrc
    source ~/.zshrc

    # fish: ~/.config/fish/config.fish
    echo 'set -x ANTHROPIC_API_KEY "sk-mega-..."' >> ~/.config/fish/config.fish
    source ~/.config/fish/config.fish
    ```

    **Verify:**

    ```bash  theme={null}
    # Close terminal
    # Open new terminal
    echo $ANTHROPIC_API_KEY
    # Should show your key
    ```
  </Accordion>

  <Accordion title="Shell config not reloading">
    Changes to shell config aren't taking effect.

    **Solutions:**

    **1. Reload shell config:**

    ```bash  theme={null}
    # bash
    source ~/.bashrc

    # zsh
    source ~/.zshrc

    # fish
    source ~/.config/fish/config.fish
    ```

    **2. Restart terminal:**
    Close and reopen your terminal application.

    **3. Check for syntax errors:**

    ```bash  theme={null}
    # bash/zsh
    bash -n ~/.bashrc  # Check syntax
    bash -n ~/.zshrc

    # fish
    fish -n ~/.config/fish/config.fish
    ```

    **4. Check file was actually modified:**

    ```bash  theme={null}
    tail -20 ~/.bashrc
    # Should show your recent additions
    ```
  </Accordion>
</AccordionGroup>

## Platform-Specific Issues

<AccordionGroup>
  <Accordion title="macOS: Command not found after installation">
    PATH isn't updated for npm global packages.

    **Solution:**

    ```bash  theme={null}
    # Add npm global bin to PATH
    echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.zshrc
    source ~/.zshrc

    # Or for bash
    echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Accordion>

  <Accordion title="Windows: PowerShell execution policy">
    Scripts are blocked by PowerShell execution policy.

    **Solution:**

    ```powershell  theme={null}
    # Run PowerShell as Administrator
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

    # Then run CLI
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="Linux: /usr/local/lib permission issues">
    Can't install global packages due to permissions.

    **Solution:**

    ```bash  theme={null}
    # Option 1: Use nvm (recommended)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install 18
    nvm use 18

    # Option 2: Change npm prefix
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Accordion>
</AccordionGroup>

## Advanced Troubleshooting

### Enable Debug Mode

Get detailed logs to diagnose issues:

```bash  theme={null}
# Run with debug output
DEBUG=* npx megallm@latest

# Or set environment variable
export DEBUG=*
npx megallm@latest
```

### Complete Reset

If all else fails, completely reset configuration:

```bash  theme={null}
# 1. Backup existing configs
mkdir ~/megallm-backup
cp -r ~/.claude ~/megallm-backup/
cp -r ~/.codex ~/megallm-backup/
cp -r ~/.config/opencode ~/megallm-backup/

# 2. Remove all configs
rm -rf ~/.claude
rm -rf ~/.codex
rm -rf ~/.config/opencode
rm -rf .claude
rm -f opencode.json

# 3. Remove environment variables
# Edit ~/.bashrc or ~/.zshrc and remove lines with:
# - ANTHROPIC_BASE_URL
# - ANTHROPIC_API_KEY
# - MEGALLM_API_KEY

# 4. Reload shell
source ~/.bashrc

# 5. Run CLI fresh
npx megallm@latest
```

### Collect Diagnostic Information

For support requests, collect this information:

```bash  theme={null}
# System info
uname -a
node --version
npm --version

# Check configs
ls -la ~/.claude/ ~/.codex/ ~/.config/opencode/
cat ~/.claude/settings.json
cat ~/.codex/config.toml
cat ~/.config/opencode/opencode.json

# Check environment
env | grep -E "ANTHROPIC|MEGALLM"

# Run with debug
DEBUG=* npx megallm@latest 2>&1 | tee megallm-debug.log
```

## Still Need Help?

If you're still experiencing issues:

<CardGroup cols={2}>
  <Card title="Check FAQ" icon="circle-question" href="/en/cli/faq">
    Common questions and answers
  </Card>

  <Card title="Email Support" icon="envelope" href="mailto:support@megallm.io">
    Get help from our team
  </Card>

  <Card title="GitHub Issues" icon="github" href="https://github.com/Megallm/megallm-npm/issues">
    Report bugs or search existing issues
  </Card>

  <Card title="Discord Community" icon="discord" href="https://discord.gg/devsindia">
    Ask the community
  </Card>
</CardGroup>

## Prevention Tips

<CardGroup cols={2}>
  <Card title="Keep Tools Updated" icon="rotate">
    Regularly update Node.js, npm, and AI tools
  </Card>

  <Card title="Backup Configs" icon="floppy-disk">
    Keep backups of working configurations
  </Card>

  <Card title="Test After Changes" icon="flask">
    Verify configuration after manual edits
  </Card>

  <Card title="Use Version Control" icon="code-branch">
    Commit working configs (without API keys)
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt