# 故障排除

> 使用 MegaLLM CLI 时常见问题的解决方案。

## 安装问题

<AccordionGroup>
  <Accordion title="npm: 未找到命令">
    Node.js 和 npm 未安装。

    **解决方案:**

    <Tabs>
      <Tab title="macOS">
        ```bash  theme={null}
        # 使用 Homebrew
        brew install node

        # 或从 nodejs.org 下载
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
        从 [nodejs.org](https://nodejs.org/) 下载并安装
      </Tab>
    </Tabs>

    验证安装:

    ```bash  theme={null}
    node --version
    npm --version
    ```
  </Accordion>

  <Accordion title="EACCES 权限被拒绝错误">
    您没有安装全局包的权限。

    **解决方案 1: 配置 npm 使用不同的目录 (推荐)**

    ```bash  theme={null}
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'

    # 添加到 ~/.bashrc 或 ~/.zshrc
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```

    **解决方案 2: 修复 npm 权限**

    ```bash  theme={null}
    sudo chown -R $USER /usr/local/lib/node_modules
    sudo chown -R $USER /usr/local/bin
    ```

    **解决方案 3: 使用 npx (无需安装)**

    ```bash  theme={null}
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="使用了旧版本">
    npm 缓存中有过时的版本。

    **解决方案:**

    ```bash  theme={null}
    # 清除 npm 缓存
    npm cache clean --force

    # 运行最新版本
    npx megallm@latest

    # 或更新全局安装
    npm update -g megallm

    # 验证版本
    npx megallm@latest --version
    ```
  </Accordion>
</AccordionGroup>

## 配置问题

<AccordionGroup>
  <Accordion title="配置未加载">
    配置文件未被读取。

    **诊断:**

    ```bash  theme={null}
    # 检查文件是否存在
    ls -la ~/.claude/settings.json
    ls -la ~/.codex/config.toml
    ls -la ~/.config/opencode/opencode.json

    # 检查项目级配置
    ls -la .claude/settings.json
    ls -la opencode.json
    ```

    **解决方案:**

    **1. 验证文件位置:**

    ```bash  theme={null}
    # Claude Code
    ~/.claude/settings.json          # 系统级
    ./.claude/settings.json          # 项目级

    # Codex
    ~/.codex/config.toml             # 仅系统级

    # OpenCode
    ~/.config/opencode/opencode.json # 系统级
    ./opencode.json                  # 项目级
    ```

    **2. 检查文件权限:**

    ```bash  theme={null}
    chmod 644 ~/.claude/settings.json
    chmod 644 ~/.codex/config.toml
    chmod 644 ~/.config/opencode/opencode.json
    ```

    **3. 验证语法:**

    ```bash  theme={null}
    # JSON 文件
    jq . ~/.claude/settings.json

    # TOML 文件
    cat ~/.codex/config.toml
    # (安装 toml-cli 进行验证)
    ```

    **4. 检查工作目录:**

    ```bash  theme={null}
    pwd
    # 对于项目级配置,您必须在项目目录中
    ```
  </Accordion>

  <Accordion title="API 密钥未被识别">
    API 密钥未从配置或环境中读取。

    **诊断:**

    ```bash  theme={null}
    # 检查环境变量
    echo $ANTHROPIC_API_KEY
    echo $MEGALLM_API_KEY

    # 检查配置文件
    jq '.env.ANTHROPIC_API_KEY' ~/.claude/settings.json
    cat ~/.codex/config.toml | grep MEGALLM_API_KEY
    jq '.provider.anthropic.options.apiKey' ~/.config/opencode/opencode.json
    ```

    **解决方案:**

    **1. 重新加载 shell 配置:**

    ```bash  theme={null}
    source ~/.bashrc  # 或 ~/.zshrc
    # 或重启您的终端
    ```

    **2. 验证 API 密钥格式:**

    * 必须以 `sk-mega-` 开头
    * 至少 20 个字符长
    * 密钥周围没有空格或引号

    **3. 手动设置环境变量:**

    ```bash  theme={null}
    # Claude Code
    export ANTHROPIC_API_KEY="sk-mega-your-key"

    # Codex/Windsurf 和 OpenCode
    export MEGALLM_API_KEY="sk-mega-your-key"
    ```

    **4. 直接测试 API 密钥:**

    ```bash  theme={null}
    curl -H "Authorization: Bearer sk-mega-your-key" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="使用了错误的基础 URL">
    工具连接到了错误的 API 端点。

    **诊断:**

    ```bash  theme={null}
    # 检查环境变量
    echo $ANTHROPIC_BASE_URL

    # 检查配置文件
    jq '.env.ANTHROPIC_BASE_URL' ~/.claude/settings.json
    cat ~/.codex/config.toml | grep base_url
    jq '.provider.anthropic.options.baseURL' ~/.config/opencode/opencode.json
    ```

    **解决方案:**

    确保基础 URL 完全正确:

    ```
    https://ai.megallm.io
    ```

    **常见错误:**

    ```bash  theme={null}
    # <Icon icon="xmark" /> 错误
    https://ai.megallm.io/      # 尾部斜杠
    https://ai.megallm.io/v1/   # 额外的 /v1/ (仅 Codex/OpenCode)
    http://ai.megallm.io        # HTTP 而不是 HTTPS

    # <Icon icon="check" /> Claude Code 的正确格式
    https://ai.megallm.io

    # <Icon icon="check" /> Codex/OpenCode 的正确格式
    https://ai.megallm.io/v1
    ```

    **修复:**

    ```bash  theme={null}
    # Claude Code
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"

    # 使用正确的 URL 更新配置文件
    ```
  </Accordion>

  <Accordion title="配置优先级问题">
    使用了错误的配置。

    **理解优先级:**

    <Steps>
      <Step title="环境变量 (最高)">
        在 shell 中设置的变量始终优先
      </Step>

      <Step title="项目级配置">
        当前目录中的配置 (`.claude/`, `opencode.json`)
      </Step>

      <Step title="系统级配置 (最低)">
        主目录中的全局配置 (`~/.claude/`, `~/.codex/`, `~/.config/opencode/`)
      </Step>
    </Steps>

    **诊断:**

    ```bash  theme={null}
    # 检查在哪里设置了什么
    echo "环境变量: $ANTHROPIC_API_KEY"
    echo "项目: $(jq -r '.env.ANTHROPIC_API_KEY' .claude/settings.json 2>/dev/null)"
    echo "系统: $(jq -r '.env.ANTHROPIC_API_KEY' ~/.claude/settings.json 2>/dev/null)"
    ```

    **解决方案:**

    删除冲突的配置或使用正确的优先级:

    ```bash  theme={null}
    # 要强制使用项目级,取消设置环境变量
    unset ANTHROPIC_API_KEY

    # 要强制使用环境变量,设置它
    export ANTHROPIC_API_KEY="sk-mega-your-key"
    ```
  </Accordion>
</AccordionGroup>

## CLI 执行问题

<AccordionGroup>
  <Accordion title="CLI 挂起或冻结">
    CLI 在执行过程中卡住。

    **解决方案:**

    **1. 取消并重试:**

    ```bash  theme={null}
    # 按 Ctrl+C 取消
    # 然后再次运行
    npx megallm@latest
    ```

    **2. 检查提示:**
    CLI 可能正在等待输入。查找以下问题:

    * "输入您的 API 密钥:"
    * "继续? (y/n)"

    **3. 使用调试模式运行:**

    ```bash  theme={null}
    DEBUG=* npx megallm@latest
    # 显示正在发生的详细日志
    ```

    **4. 检查后台进程:**

    ```bash  theme={null}
    # 检查是否有另一个实例正在运行
    ps aux | grep megallm
    ```
  </Accordion>

  <Accordion title="工具未检测到">
    CLI 说工具未安装但它确实安装了。

    **诊断:**

    ```bash  theme={null}
    # 检查工具是否全局安装
    npm list -g --depth=0 | grep claude
    npm list -g --depth=0 | grep codex
    npm list -g --depth=0 | grep opencode

    # 检查命令是否可用
    which claude-code
    which codex
    which windsurf
    which opencode
    ```

    **解决方案:**

    **1. 确保全局安装:**

    ```bash  theme={null}
    npm install -g @anthropic-ai/claude-code
    npm install -g @codeium/windsurf
    npm install -g opencode
    ```

    **2. 重启终端:**

    ```bash  theme={null}
    # 关闭并重新打开终端
    # 或重新加载 shell 配置
    source ~/.bashrc
    ```

    **3. 检查 PATH:**

    ```bash  theme={null}
    echo $PATH
    # 应该包含 npm 全局 bin 目录
    ```

    **4. 手动配置:**
    如果检测失败,在不使用 CLI 的情况下手动配置。
  </Accordion>

  <Accordion title="创建配置文件时权限被拒绝">
    CLI 无法写入配置目录。

    **解决方案:**

    **macOS/Linux:**

    ```bash  theme={null}
    # 修复所有权
    sudo chown -R $USER ~/.claude ~/.codex ~/.config/opencode

    # 修复权限
    chmod -R 755 ~/.claude ~/.codex ~/.config/opencode

    # 对于项目配置
    chmod -R 755 .claude
    ```

    **Windows:**
    以管理员身份运行终端或在文件资源管理器中修复文件夹权限。
  </Accordion>
</AccordionGroup>

## API 连接问题

<AccordionGroup>
  <Accordion title="API 连接失败">
    无法连接到 MegaLLM API。

    **诊断:**

    ```bash  theme={null}
    # 测试 API 连接
    curl -v https://ai.megallm.io/v1/models \
      -H "Authorization: Bearer sk-mega-your-key"
    ```

    **解决方案:**

    **1. 检查互联网连接:**

    ```bash  theme={null}
    ping -c 3 ai.megallm.io
    ```

    **2. 检查防火墙/代理:**

    ```bash  theme={null}
    # 如果在代理后面,设置 npm 代理
    npm config set proxy http://proxy.company.com:8080
    npm config set https-proxy http://proxy.company.com:8080
    ```

    **3. 验证 API 密钥:**

    * 访问 [megallm.io/dashboard](https://megallm.io/dashboard)
    * 生成新的 API 密钥
    * 更新您的配置

    **4. 检查 API 状态:**
    访问 [megallm.io/status](https://megallm.io/status) 查看服务状态
  </Accordion>

  <Accordion title="401 未授权错误">
    API 密钥无效或已过期。

    **解决方案:**

    **1. 生成新的 API 密钥:**

    * 访问 [megallm.io/dashboard](https://megallm.io/dashboard)
    * 创建新的 API 密钥
    * 更新配置

    **2. 更新配置:**

    ```bash  theme={null}
    # 再次运行 CLI 进行重新配置
    npx megallm@latest

    # 或手动更新
    jq '.env.ANTHROPIC_API_KEY = "new-key"' ~/.claude/settings.json > tmp.json && mv tmp.json ~/.claude/settings.json
    ```

    **3. 清除并重置:**

    ```bash  theme={null}
    # 删除旧配置
    rm ~/.claude/settings.json ~/.claude.json
    rm ~/.codex/config.toml
    rm ~/.config/opencode/opencode.json

    # 重新运行 CLI
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="超出速率限制">
    在短时间内发送了太多 API 请求。

    **解决方案:**

    **1. 等待并重试:**
    速率限制通常在一段时间后重置(通常 1 分钟)。

    **2. 检查您的使用情况:**

    * 访问 [megallm.io/dashboard](https://megallm.io/dashboard)
    * 查看 API 使用统计信息

    **3. 升级计划:**
    如果您经常遇到速率限制,请考虑升级您的计划。

    **4. 实施重试逻辑:**

    ```python  theme={null}
    # 在您的应用程序代码中
    import time
    import openai

    for i in range(3):
        try:
            response = client.chat.completions.create(...)
            break
        except openai.RateLimitError:
            if i < 2:
                time.sleep(2 ** i)  # 指数退避
            else:
                raise
    ```
  </Accordion>
</AccordionGroup>

## Shell 和环境问题

<AccordionGroup>
  <Accordion title="环境变量未持久化">
    关闭终端后变量丢失。

    **解决方案:**

    环境变量必须添加到 shell 配置文件:

    ```bash  theme={null}
    # 确定您的 shell
    echo $SHELL

    # bash: ~/.bashrc 或 ~/.bash_profile
    echo 'export ANTHROPIC_API_KEY="sk-mega-..."' >> ~/.bashrc
    source ~/.bashrc

    # zsh: ~/.zshrc
    echo 'export ANTHROPIC_API_KEY="sk-mega-..."' >> ~/.zshrc
    source ~/.zshrc

    # fish: ~/.config/fish/config.fish
    echo 'set -x ANTHROPIC_API_KEY "sk-mega-..."' >> ~/.config/fish/config.fish
    source ~/.config/fish/config.fish
    ```

    **验证:**

    ```bash  theme={null}
    # 关闭终端
    # 打开新终端
    echo $ANTHROPIC_API_KEY
    # 应该显示您的密钥
    ```
  </Accordion>

  <Accordion title="Shell 配置未重新加载">
    对 shell 配置的更改未生效。

    **解决方案:**

    **1. 重新加载 shell 配置:**

    ```bash  theme={null}
    # bash
    source ~/.bashrc

    # zsh
    source ~/.zshrc

    # fish
    source ~/.config/fish/config.fish
    ```

    **2. 重启终端:**
    关闭并重新打开您的终端应用程序。

    **3. 检查语法错误:**

    ```bash  theme={null}
    # bash/zsh
    bash -n ~/.bashrc  # 检查语法
    bash -n ~/.zshrc

    # fish
    fish -n ~/.config/fish/config.fish
    ```

    **4. 检查文件是否实际修改:**

    ```bash  theme={null}
    tail -20 ~/.bashrc
    # 应该显示您最近的添加
    ```
  </Accordion>
</AccordionGroup>

## 平台特定问题

<AccordionGroup>
  <Accordion title="macOS: 安装后找不到命令">
    npm 全局包的 PATH 未更新。

    **解决方案:**

    ```bash  theme={null}
    # 将 npm 全局 bin 添加到 PATH
    echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.zshrc
    source ~/.zshrc

    # 或对于 bash
    echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Accordion>

  <Accordion title="Windows: PowerShell 执行策略">
    脚本被 PowerShell 执行策略阻止。

    **解决方案:**

    ```powershell  theme={null}
    # 以管理员身份运行 PowerShell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

    # 然后运行 CLI
    npx megallm@latest
    ```
  </Accordion>

  <Accordion title="Linux: /usr/local/lib 权限问题">
    由于权限问题无法安装全局包。

    **解决方案:**

    ```bash  theme={null}
    # 选项 1: 使用 nvm (推荐)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    nvm install 18
    nvm use 18

    # 选项 2: 更改 npm 前缀
    mkdir ~/.npm-global
    npm config set prefix '~/.npm-global'
    echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
    source ~/.bashrc
    ```
  </Accordion>
</AccordionGroup>

## 高级故障排除

### 启用调试模式

获取详细日志以诊断问题:

```bash  theme={null}
# 使用调试输出运行
DEBUG=* npx megallm@latest

# 或设置环境变量
export DEBUG=*
npx megallm@latest
```

### 完全重置

如果所有其他方法都失败,完全重置配置:

```bash  theme={null}
# 1. 备份现有配置
mkdir ~/megallm-backup
cp -r ~/.claude ~/megallm-backup/
cp -r ~/.codex ~/megallm-backup/
cp -r ~/.config/opencode ~/megallm-backup/

# 2. 删除所有配置
rm -rf ~/.claude
rm -rf ~/.codex
rm -rf ~/.config/opencode
rm -rf .claude
rm -f opencode.json

# 3. 删除环境变量
# 编辑 ~/.bashrc 或 ~/.zshrc 并删除包含以下内容的行:
# - ANTHROPIC_BASE_URL
# - ANTHROPIC_API_KEY
# - MEGALLM_API_KEY

# 4. 重新加载 shell
source ~/.bashrc

# 5. 重新运行 CLI
npx megallm@latest
```

### 收集诊断信息

对于支持请求,收集此信息:

```bash  theme={null}
# 系统信息
uname -a
node --version
npm --version

# 检查配置
ls -la ~/.claude/ ~/.codex/ ~/.config/opencode/
cat ~/.claude/settings.json
cat ~/.codex/config.toml
cat ~/.config/opencode/opencode.json

# 检查环境
env | grep -E "ANTHROPIC|MEGALLM"

# 使用调试运行
DEBUG=* npx megallm@latest 2>&1 | tee megallm-debug.log
```

## 仍需要帮助?

如果您仍然遇到问题:

<CardGroup cols={2}>
  <Card title="查看常见问题" icon="circle-question" href="/cn/cli/faq">
    常见问题和答案
  </Card>

  <Card title="电子邮件支持" icon="envelope" href="mailto:support@megallm.io">
    从我们的团队获得帮助
  </Card>

  <Card title="GitHub Issues" icon="github" href="https://github.com/Megallm/megallm-npm/issues">
    报告错误或搜索现有问题
  </Card>

  <Card title="Discord 社区" icon="discord" href="https://discord.gg/devsindia">
    向社区提问
  </Card>
</CardGroup>

## 预防提示

<CardGroup cols={2}>
  <Card title="保持工具更新" icon="rotate">
    定期更新 Node.js、npm 和 AI 工具
  </Card>

  <Card title="备份配置" icon="floppy-disk">
    保留工作配置的备份
  </Card>

  <Card title="更改后测试" icon="flask">
    手动编辑后验证配置
  </Card>

  <Card title="使用版本控制" icon="code-branch">
    提交工作配置(不包含 API 密钥)
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt