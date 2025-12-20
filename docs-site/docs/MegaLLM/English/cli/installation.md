# Installation

> Learn how to install and run the MegaLLM CLI on your system.

## Quick Install

The fastest way to get started - no installation required:

```bash  theme={null}
npx megallm@latest
```

This runs the latest version directly without installing anything permanently.

## Installation Methods

### Method 1: NPX (Recommended)

Run directly without installation:

```bash  theme={null}
npx megallm@latest
```

**Advantages:**

* No installation required
* Always uses the latest version
* No disk space used
* Perfect for one-time or occasional use

**Usage:**

```bash  theme={null}
# Run latest version
npx megallm@latest

# Run specific version
npx megallm@2.5.9

# With environment variables
NO_BANNER=1 npx megallm@latest
```

### Method 2: Global Installation

Install once, use anytime:

```bash  theme={null}
npm install -g megallm
```

Then run with:

```bash  theme={null}
megallm
```

**Advantages:**

* Faster startup (already installed)
* Works offline (after initial install)
* Shorter command
* Good for frequent use

**Update:**

```bash  theme={null}
npm update -g megallm
```

**Uninstall:**

```bash  theme={null}
npm uninstall -g megallm
```

### Method 3: Local Project Installation

Install as a project dependency:

```bash  theme={null}
npm install --save-dev megallm
```

Add to `package.json` scripts:

```json  theme={null}
{
  "scripts": {
    "setup-megallm": "megallm"
  }
}
```

Run with:

```bash  theme={null}
npm run setup-megallm
```

**Best for:**

* Team projects with standardized setup
* Version-locked installations
* CI/CD pipelines

## System Requirements

### Required

<Info>
  **Node.js 18.0.0 or higher** is required to run the MegaLLM CLI
</Info>

Check your Node.js version:

```bash  theme={null}
node --version
```

If you need to install or update Node.js:

<Tabs>
  <Tab title="macOS">
    **Using Homebrew:**

    ```bash  theme={null}
    brew install node
    ```

    **Using nvm (recommended):**

    ```bash  theme={null}
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install 18
    nvm use 18
    ```

    **Official Installer:**
    Download from [nodejs.org](https://nodejs.org/)
  </Tab>

  <Tab title="Linux">
    **Ubuntu/Debian:**

    ```bash  theme={null}
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

    **Fedora:**

    ```bash  theme={null}
    sudo dnf install nodejs
    ```

    **Using nvm (recommended):**

    ```bash  theme={null}
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install 18
    nvm use 18
    ```
  </Tab>

  <Tab title="Windows">
    **Official Installer:**
    Download from [nodejs.org](https://nodejs.org/)

    **Using Chocolatey:**

    ```powershell  theme={null}
    choco install nodejs
    ```

    **Using nvm-windows:**

    ```powershell  theme={null}
    nvm install 18
    nvm use 18
    ```
  </Tab>
</Tabs>

### Supported Platforms

| Platform    | Status                                | Notes                   |
| ----------- | ------------------------------------- | ----------------------- |
| **macOS**   | <Icon icon="check" /> Fully Supported | Intel & Apple Silicon   |
| **Linux**   | <Icon icon="check" /> Fully Supported | All major distributions |
| **Windows** | <Icon icon="check" /> Fully Supported | Native & WSL            |

### Supported Shells

| Shell          | Status                                | Platform      |
| -------------- | ------------------------------------- | ------------- |
| **bash**       | <Icon icon="check" /> Fully Supported | All platforms |
| **zsh**        | <Icon icon="check" /> Fully Supported | macOS, Linux  |
| **fish**       | <Icon icon="check" /> Fully Supported | macOS, Linux  |
| **PowerShell** | <Icon icon="check" /> Fully Supported | Windows       |

## Verification

After installation, verify everything works:

```bash  theme={null}
# Check Node.js version
node --version
# Should show: v18.0.0 or higher

# Check npm version
npm --version
# Should show: 9.0.0 or higher

# Run the CLI
npx megallm@latest --version
# or if installed globally:
megallm --version
```

## Permissions

### macOS/Linux

The CLI needs write permissions to:

* `~/.claude/` - Claude Code configuration
* `~/.codex/` - Codex configuration
* `~/.config/opencode/` - OpenCode configuration
* `~/.bashrc`, `~/.zshrc`, etc. - Shell configuration files

If you encounter permission errors:

```bash  theme={null}
# Fix ownership
sudo chown -R $USER ~/.claude ~/.codex ~/.config/opencode

# Fix permissions
chmod -R 755 ~/.claude ~/.codex ~/.config/opencode
```

### Windows

Run your terminal as Administrator if you encounter permission issues.

## AI Tool Installation

The CLI can automatically install AI coding tools if they're missing. Required permissions:

```bash  theme={null}
# NPM global install permission
npm install -g @anthropic-ai/claude-code
npm install -g @codeium/windsurf
npm install -g opencode
```

If you don't have permission for global installs:

**Option 1: Use npx**

```bash  theme={null}
# Instead of installing globally, use npx
npx @anthropic-ai/claude-code
```

**Option 2: Fix npm permissions**

```bash  theme={null}
# macOS/Linux
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Troubleshooting Installation

<AccordionGroup>
  <Accordion title="npm command not found">
    Node.js isn't installed or not in your PATH.

    **Fix:**

    1. Install Node.js from [nodejs.org](https://nodejs.org/)
    2. Restart your terminal
    3. Verify: `node --version`
  </Accordion>

  <Accordion title="npx: command not found">
    npm isn't installed or is an old version.

    **Fix:**

    ```bash  theme={null}
    # Update npm
    npm install -g npm@latest

    # Or reinstall Node.js
    ```
  </Accordion>

  <Accordion title="EACCES permission errors">
    You don't have permission to install global packages.

    **Fix:**

    ```bash  theme={null}
    # macOS/Linux - Configure npm to use a different directory
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
    source ~/.profile
    ```

    Or use `sudo` (not recommended):

    ```bash  theme={null}
    sudo npm install -g megallm
    ```
  </Accordion>

  <Accordion title="Version mismatch errors">
    You're running an old version.

    **Fix:**

    ```bash  theme={null}
    # Clear npm cache
    npm cache clean --force

    # Update to latest
    npm update -g megallm

    # Or run latest with npx
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="Network or proxy errors">
    npm can't connect to the registry.

    **Fix:**

    ```bash  theme={null}
    # Check npm registry
    npm config get registry

    # Set registry
    npm config set registry https://registry.npmjs.org/

    # If behind a proxy
    npm config set proxy http://proxy.company.com:8080
    npm config set https-proxy http://proxy.company.com:8080
    ```
  </Accordion>
</AccordionGroup>

## Advanced Installation

### Offline Installation

For environments without internet access:

1. **Download on internet-connected machine:**
   ```bash  theme={null}
   npm pack megallm
   # Creates: megallm-2.5.9.tgz
   ```

2. **Transfer file to offline machine**

3. **Install from tarball:**
   ```bash  theme={null}
   npm install -g ./megallm-2.5.9.tgz
   ```

### CI/CD Installation

For automated environments:

<CodeGroup>
  ```yaml GitHub Actions theme={null}
  - name: Setup Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '18'

  - name: Run MegaLLM CLI
    run: npx megallm@latest
    env:
      NO_BANNER: '1'
  ```

  ```yaml GitLab CI theme={null}
  setup_cli:
    image: node:18
    script:
      - npm install -g megallm@latest
      - megallm --version
  ```

  ```groovy Jenkins theme={null}
  pipeline {
    agent {
      docker {
        image 'node:18'
      }
    }
    stages {
      stage('Setup') {
        steps {
          sh 'npx megallm@latest'
        }
      }
    }
  }
  ```
</CodeGroup>

### Docker Installation

Include in your Dockerfile:

```dockerfile  theme={null}
FROM node:18

# Install megallm globally
RUN npm install -g megallm

# Or use npx
RUN npx megallm@latest --version

# Configure at runtime
CMD ["megallm"]
```

## Version Management

### Check Current Version

```bash  theme={null}
# If installed globally
megallm --version

# Using npx
npx megallm@latest --version
```

### Install Specific Version

```bash  theme={null}
# Install specific version globally
npm install -g megallm@2.5.9

# Run specific version with npx
npx megallm@2.5.9
```

### Version History

View all available versions:

```bash  theme={null}
npm view megallm versions
```

View latest version:

```bash  theme={null}
npm view megallm version
```

## Uninstallation

### Remove Global Installation

```bash  theme={null}
npm uninstall -g megallm
```

### Remove Configuration Files

The CLI creates configuration files that persist after uninstallation:

```bash  theme={null}
# Remove all MegaLLM configurations
rm -rf ~/.claude/settings.json ~/.claude.json
rm -rf ~/.codex/config.toml
rm -rf ~/.config/opencode/opencode.json

# Remove environment variables
# Edit your shell config (~/.bashrc, ~/.zshrc, etc.)
# and remove lines containing:
# ANTHROPIC_BASE_URL
# ANTHROPIC_API_KEY
# MEGALLM_API_KEY
```

### Complete Cleanup

To completely remove all traces:

```bash  theme={null}
# Uninstall CLI
npm uninstall -g megallm

# Remove config files
rm -rf ~/.claude ~/.codex ~/.config/opencode

# Remove project-level configs
rm -rf ./.claude ./opencode.json

# Clear npm cache
npm cache clean --force
```

## Next Steps

<CardGroup cols={2}>
  <Card title="Configuration" icon="gear" href="/en/cli/configuration">
    Complete setup workflow
  </Card>

  <Card title="Configuration" icon="gear" href="/en/cli/configuration">
    Configuration details
  </Card>

  <Card title="Examples" icon="code" href="/en/cli/examples">
    Usage examples
  </Card>

  <Card title="Troubleshooting" icon="circle-exclamation" href="/en/cli/troubleshooting">
    Common issues
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt