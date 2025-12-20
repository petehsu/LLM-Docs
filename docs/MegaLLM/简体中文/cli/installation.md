# 安装

> 了解如何在您的系统上安装和运行 MegaLLM CLI。

## 快速安装

最快的入门方式 - 无需安装:

```bash  theme={null}
npx megallm@latest
```

这将直接运行最新版本,无需永久安装任何内容。

## 安装方法

### 方法 1: NPX(推荐)

无需安装即可直接运行:

```bash  theme={null}
npx megallm@latest
```

**优势:**

* 无需安装
* 始终使用最新版本
* 不占用磁盘空间
* 适合一次性或偶尔使用

**用法:**

```bash  theme={null}
# 运行最新版本
npx megallm@latest

# 运行特定版本
npx megallm@2.5.9

# 使用环境变量
NO_BANNER=1 npx megallm@latest
```

### 方法 2: 全局安装

安装一次,随时使用:

```bash  theme={null}
npm install -g megallm
```

然后使用以下命令运行:

```bash  theme={null}
megallm
```

**优势:**

* 启动更快(已安装)
* 可离线工作(初次安装后)
* 命令更短
* 适合频繁使用

**更新:**

```bash  theme={null}
npm update -g megallm
```

**卸载:**

```bash  theme={null}
npm uninstall -g megallm
```

### 方法 3: 本地项目安装

作为项目依赖安装:

```bash  theme={null}
npm install --save-dev megallm
```

添加到 `package.json` 脚本:

```json  theme={null}
{
  "scripts": {
    "setup-megallm": "megallm"
  }
}
```

运行:

```bash  theme={null}
npm run setup-megallm
```

**最适合:**

* 具有标准化配置的团队项目
* 版本锁定安装
* CI/CD 流水线

## 系统要求

### 必需

<Info>
  运行 MegaLLM CLI 需要 **Node.js 18.0.0 或更高版本**
</Info>

检查您的 Node.js 版本:

```bash  theme={null}
node --version
```

如果需要安装或更新 Node.js:

<Tabs>
  <Tab title="macOS">
    **使用 Homebrew:**

    ```bash  theme={null}
    brew install node
    ```

    **使用 nvm(推荐):**

    ```bash  theme={null}
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install 18
    nvm use 18
    ```

    **官方安装程序:**
    从 [nodejs.org](https://nodejs.org/) 下载
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

    **使用 nvm(推荐):**

    ```bash  theme={null}
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install 18
    nvm use 18
    ```
  </Tab>

  <Tab title="Windows">
    **官方安装程序:**
    从 [nodejs.org](https://nodejs.org/) 下载

    **使用 Chocolatey:**

    ```powershell  theme={null}
    choco install nodejs
    ```

    **使用 nvm-windows:**

    ```powershell  theme={null}
    nvm install 18
    nvm use 18
    ```
  </Tab>
</Tabs>

### 支持的平台

| 平台          | 状态                         | 备注                    |
| ----------- | -------------------------- | --------------------- |
| **macOS**   | <Icon icon="check" /> 完全支持 | Intel 和 Apple Silicon |
| **Linux**   | <Icon icon="check" /> 完全支持 | 所有主流发行版               |
| **Windows** | <Icon icon="check" /> 完全支持 | 原生和 WSL               |

### 支持的 Shell

| Shell          | 状态                         | 平台           |
| -------------- | -------------------------- | ------------ |
| **bash**       | <Icon icon="check" /> 完全支持 | 所有平台         |
| **zsh**        | <Icon icon="check" /> 完全支持 | macOS, Linux |
| **fish**       | <Icon icon="check" /> 完全支持 | macOS, Linux |
| **PowerShell** | <Icon icon="check" /> 完全支持 | Windows      |

## 验证

安装后,验证一切正常:

```bash  theme={null}
# 检查 Node.js 版本
node --version
# 应显示: v18.0.0 或更高

# 检查 npm 版本
npm --version
# 应显示: 9.0.0 或更高

# 运行 CLI
npx megallm@latest --version
# 或如果全局安装:
megallm --version
```

## 权限

### macOS/Linux

CLI 需要对以下目录的写权限:

* `~/.claude/` - Claude Code 配置
* `~/.codex/` - Codex 配置
* `~/.config/opencode/` - OpenCode 配置
* `~/.bashrc`, `~/.zshrc` 等 - Shell 配置文件

如果遇到权限错误:

```bash  theme={null}
# 修复所有权
sudo chown -R $USER ~/.claude ~/.codex ~/.config/opencode

# 修复权限
chmod -R 755 ~/.claude ~/.codex ~/.config/opencode
```

### Windows

如果遇到权限问题,请以管理员身份运行终端。

## AI 工具安装

如果缺少 AI 编程工具,CLI 可以自动安装。需要的权限:

```bash  theme={null}
# NPM 全局安装权限
npm install -g @anthropic-ai/claude-code
npm install -g @codeium/windsurf
npm install -g opencode
```

如果没有全局安装权限:

**选项 1: 使用 npx**

```bash  theme={null}
# 不全局安装,使用 npx
npx @anthropic-ai/claude-code
```

**选项 2: 修复 npm 权限**

```bash  theme={null}
# macOS/Linux
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## 安装故障排除

<AccordionGroup>
  <Accordion title="npm: 命令未找到">
    Node.js 未安装或不在您的 PATH 中。

    **解决方案:**

    1. 从 [nodejs.org](https://nodejs.org/) 安装 Node.js
    2. 重启终端
    3. 验证: `node --version`
  </Accordion>

  <Accordion title="npx: 命令未找到">
    npm 未安装或版本过旧。

    **解决方案:**

    ```bash  theme={null}
    # 更新 npm
    npm install -g npm@latest

    # 或重新安装 Node.js
    ```
  </Accordion>

  <Accordion title="EACCES 权限错误">
    您没有安装全局包的权限。

    **解决方案:**

    ```bash  theme={null}
    # macOS/Linux - 配置 npm 使用不同目录
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
    source ~/.profile
    ```

    或使用 `sudo`(不推荐):

    ```bash  theme={null}
    sudo npm install -g megallm
    ```
  </Accordion>

  <Accordion title="版本不匹配错误">
    您运行的是旧版本。

    **解决方案:**

    ```bash  theme={null}
    # 清除 npm 缓存
    npm cache clean --force

    # 更新到最新版本
    npm update -g megallm

    # 或使用 npx 运行最新版
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="网络或代理错误">
    npm 无法连接到注册表。

    **解决方案:**

    ```bash  theme={null}
    # 检查 npm 注册表
    npm config get registry

    # 设置注册表
    npm config set registry https://registry.npmjs.org/

    # 如果在代理后面
    npm config set proxy http://proxy.company.com:8080
    npm config set https-proxy http://proxy.company.com:8080
    ```
  </Accordion>
</AccordionGroup>

## 高级安装

### 离线安装

对于无互联网访问的环境:

1. **在联网机器上下载:**
   ```bash  theme={null}
   npm pack megallm
   # 创建: megallm-2.5.9.tgz
   ```

2. **将文件传输到离线机器**

3. **从 tarball 安装:**
   ```bash  theme={null}
   npm install -g ./megallm-2.5.9.tgz
   ```

### CI/CD 安装

对于自动化环境:

<CodeGroup>
  ```yaml GitHub Actions theme={null}
  - name: 设置 Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '18'

  - name: 运行 MegaLLM CLI
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

### Docker 安装

在 Dockerfile 中包含:

```dockerfile  theme={null}
FROM node:18

# 全局安装 megallm
RUN npm install -g megallm

# 或使用 npx
RUN npx megallm@latest --version

# 运行时配置
CMD ["megallm"]
```

## 版本管理

### 检查当前版本

```bash  theme={null}
# 如果全局安装
megallm --version

# 使用 npx
npx megallm@latest --version
```

### 安装特定版本

```bash  theme={null}
# 全局安装特定版本
npm install -g megallm@2.5.9

# 使用 npx 运行特定版本
npx megallm@2.5.9
```

### 版本历史

查看所有可用版本:

```bash  theme={null}
npm view megallm versions
```

查看最新版本:

```bash  theme={null}
npm view megallm version
```

## 卸载

### 删除全局安装

```bash  theme={null}
npm uninstall -g megallm
```

### 删除配置文件

CLI 创建的配置文件在卸载后仍会保留:

```bash  theme={null}
# 删除所有 MegaLLM 配置
rm -rf ~/.claude/settings.json ~/.claude.json
rm -rf ~/.codex/config.toml
rm -rf ~/.config/opencode/opencode.json

# 删除环境变量
# 编辑您的 shell 配置 (~/.bashrc, ~/.zshrc 等)
# 并删除包含以下内容的行:
# ANTHROPIC_BASE_URL
# ANTHROPIC_API_KEY
# MEGALLM_API_KEY
```

### 完全清理

要完全删除所有痕迹:

```bash  theme={null}
# 卸载 CLI
npm uninstall -g megallm

# 删除配置文件
rm -rf ~/.claude ~/.codex ~/.config/opencode

# 删除项目级配置
rm -rf ./.claude ./opencode.json

# 清除 npm 缓存
npm cache clean --force
```

## 下一步

<CardGroup cols={2}>
  <Card title="配置" icon="gear" href="/cn/cli/configuration">
    完整的配置工作流程
  </Card>

  <Card title="配置详情" icon="gear" href="/cn/cli/configuration">
    配置详情
  </Card>

  <Card title="示例" icon="code" href="/cn/cli/examples">
    使用示例
  </Card>

  <Card title="故障排除" icon="circle-exclamation" href="/cn/cli/troubleshooting">
    常见问题
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt