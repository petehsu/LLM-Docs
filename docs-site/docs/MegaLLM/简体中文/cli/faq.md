# 常见问题

> 关于 MegaLLM NPM 包和 CLI 工具的常见问题和答案。

## 一般问题

<AccordionGroup>
  <Accordion title="什么是 MegaLLM CLI?">
    MegaLLM CLI 是一个交互式设置工具,用于配置 AI 编码助手(Claude Code、Codex/Windsurf 和 OpenCode)以使用 MegaLLM AI 服务。它自动化配置过程,安全管理 API 密钥,并在不同平台上提供无缝的设置体验。
  </Accordion>

  <Accordion title="支持哪些 AI 工具?">
    CLI 目前支持:

    * **Claude Code** - 系统级和项目级配置
    * **Codex/Windsurf** - 仅系统级配置
    * **OpenCode** - 系统级和项目级配置

    未来版本可能会添加更多工具。
  </Accordion>

  <Accordion title="我需要安装 CLI 吗?">
    不需要!您可以使用 npx 直接运行它:

    ```bash  theme={null}
    npx megallm@latest
    ```

    但是,如果您愿意,也可以全局安装它:

    ```bash  theme={null}
    npm install -g megallm
    ```
  </Accordion>

  <Accordion title="系统要求是什么?">
    * **Node.js**: 18.0.0 或更高版本
    * **操作系统**: macOS、Linux 或 Windows
    * **Shell**: bash、zsh、fish 或 PowerShell

    使用以下命令检查您的 Node.js 版本: `node --version`
  </Accordion>
</AccordionGroup>

## 安装和设置

<AccordionGroup>
  <Accordion title="如何获取 MegaLLM API 密钥?">
    1. 访问 [megallm.io/dashboard](https://megallm.io/dashboard)
    2. 注册或登录您的账户
    3. 导航到 API 密钥部分
    4. 点击"创建新 API 密钥"
    5. 复制您的 API 密钥(以 `sk-mega-` 开头)
    6. 安全保存 - 您将无法再次看到它

    CLI 可以在设置过程中自动为您打开此页面。
  </Accordion>

  <Accordion title="系统级和项目级配置有什么区别?">
    **系统级(全局)**:

    * 应用于您机器上的所有项目
    * 存储在您的主目录中(`~/.claude/`、`~/.codex/` 等)
    * 最适合个人开发环境
    * 对单个开发者来说更容易管理

    **项目级(本地)**:

    * 仅应用于当前项目目录
    * 存储在项目文件夹中(`./.claude/`、`./opencode.json` 等)
    * 最适合具有共享配置的团队项目
    * 允许每个项目使用不同的 API 密钥
    * 可以进行版本控制(不暴露 API 密钥)

    <Note>
      **重要**: Codex/Windsurf 仅支持系统级配置。
    </Note>
  </Accordion>

  <Accordion title="如何配置多个工具?">
    运行 CLI 时,系统会询问您要配置哪个工具:

    ```
    ? 您想配置哪个工具?
      Claude Code
      Codex/Windsurf
      OpenCode
      配置全部  ← 选择此选项
    ```

    选择"配置全部"将依次设置所有检测到的工具。

    或者,多次运行 CLI 并每次选择一个工具。
  </Accordion>

  <Accordion title="如果工具缺失,CLI 会安装它们吗?">
    是的!如果 CLI 检测到工具未安装,它将提供安装:

    ```
    ? Claude Code 未安装。您想安装它吗? (Y/n)
    ```

    CLI 通过 NPM 将工具安装为全局包。
  </Accordion>
</AccordionGroup>

## 配置

<AccordionGroup>
  <Accordion title="配置文件存储在哪里?">
    **Claude Code**:

    * 系统: `~/.claude/settings.json`, `~/.claude.json`
    * 项目: `./.claude/settings.json` 或 `./.claude/settings.local.json`

    **Codex/Windsurf**:

    * 系统: `~/.codex/config.toml`

    **OpenCode**:

    * 系统: `~/.config/opencode/opencode.json`
    * 项目: `./opencode.json`

    **环境变量**:

    * bash: `~/.bashrc`
    * zsh: `~/.zshrc`
    * fish: `~/.config/fish/config.fish`
    * PowerShell: PowerShell 配置文件
  </Accordion>

  <Accordion title="如果我已经配置了 MegaLLM 怎么办?">
    CLI 将检测现有配置并询问您想做什么:

    ```
    发现现有 MegaLLM 配置:
    - ~/.claude/settings.json
    - ~/.codex/config.toml

    ? 您想做什么?
      覆盖(删除旧配置,应用新配置)
      跳过(保留现有配置)
      取消
    ```

    选择"覆盖"将:

    1. 创建备份文件(`.backup` 后缀)
    2. 删除旧配置
    3. 应用新配置

    选择"跳过"将保留您的现有设置并退出。
  </Accordion>

  <Accordion title="如何更新我的 API 密钥?">
    只需再次运行 CLI 并在提示现有配置时选择"覆盖":

    ```bash  theme={null}
    npx megallm@latest

    # 选择: 覆盖(删除旧配置,应用新配置)
    # 输入您的新 API 密钥
    ```

    CLI 将在应用新配置之前备份您的旧配置。
  </Accordion>

  <Accordion title="我可以为不同项目使用不同的 API 密钥吗?">
    可以!使用项目级配置:

    ```bash  theme={null}
    # 项目 A
    cd ~/projects/project-a
    npx megallm@latest
    # 选择: 项目级
    # 输入项目 A 的 API 密钥

    # 项目 B
    cd ~/projects/project-b
    npx megallm@latest
    # 选择: 项目级
    # 输入项目 B 的 API 密钥
    ```

    每个项目将有自己的 `.claude/settings.json` 和自己的 API 密钥。
  </Accordion>
</AccordionGroup>

## 故障排除

<AccordionGroup>
  <Accordion title="CLI 说工具已安装但我找不到它">
    CLI 使用以下方法检查工具:

    1. NPM 全局包列表
    2. PATH 中的命令可用性
    3. 已知的安装目录

    如果检测失败:

    1. 确保工具已全局安装: `npm list -g --depth=0`
    2. 检查命令是否可用: `which claude-code` 或 `which codex`
    3. 重启您的终端
    4. 尝试手动安装: `npm install -g @anthropic-ai/claude-code`
  </Accordion>

  <Accordion title="我收到'权限被拒绝'错误">
    这通常意味着您没有对配置目录的写入访问权限。

    **macOS/Linux 修复**:

    ```bash  theme={null}
    # 修复配置目录的所有权
    sudo chown -R $USER ~/.claude ~/.codex ~/.config/opencode

    # 修复权限
    chmod -R 755 ~/.claude ~/.codex ~/.config/opencode
    ```

    **Windows 修复**:

    * 以管理员身份运行您的终端
    * 或者: 在文件资源管理器中修复权限 → 属性 → 安全
  </Accordion>

  <Accordion title="我的配置未被使用">
    **检查 1: 环境变量**

    ```bash  theme={null}
    # Claude Code
    echo $ANTHROPIC_BASE_URL
    echo $ANTHROPIC_API_KEY

    # Codex
    echo $MEGALLM_API_KEY
    ```

    如果为空,重新加载您的 shell:

    ```bash  theme={null}
    source ~/.bashrc  # 或 ~/.zshrc
    # 或重启您的终端
    ```

    **检查 2: 配置文件**

    ```bash  theme={null}
    # Claude Code
    cat ~/.claude/settings.json

    # Codex
    cat ~/.codex/config.toml
    ```

    验证文件存在并包含您的 API 密钥。

    **检查 3: 文件权限**

    ```bash  theme={null}
    ls -la ~/.claude/settings.json
    ls -la ~/.codex/config.toml
    ```

    文件应该对您的用户可读。
  </Accordion>

  <Accordion title="我收到'无效的 API 密钥'错误">
    1. **验证密钥格式**: 应该以 `sk-mega-` 开头
    2. **检查拼写错误**: 直接从仪表板复制粘贴密钥
    3. **修剪空白**: 删除密钥前后的所有空格
    4. **密钥长度**: 必须至少 20 个字符
    5. **重新生成**: 在 [megallm.io/dashboard](https://megallm.io/dashboard) 创建新的 API 密钥

    测试您的 API 密钥:

    ```bash  theme={null}
    curl -H "Authorization: Bearer YOUR_API_KEY" \
         https://ai.megallm.io/v1/models
    ```
  </Accordion>

  <Accordion title="如何完全删除 MegaLLM 配置?">
    **删除配置文件**:

    ```bash  theme={null}
    # Claude Code
    rm -rf ~/.claude/settings.json ~/.claude.json

    # Codex
    rm -rf ~/.codex/config.toml

    # OpenCode
    rm -rf ~/.config/opencode/opencode.json

    # 项目级
    rm -rf ./.claude ./opencode.json
    ```

    **删除环境变量**:
    编辑您的 shell 配置文件(`~/.bashrc`、`~/.zshrc` 等)并删除这些行:

    ```bash  theme={null}
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"
    export ANTHROPIC_API_KEY="sk-mega-..."
    export MEGALLM_API_KEY="sk-mega-..."
    ```

    然后重新加载: `source ~/.bashrc` 或重启终端。
  </Accordion>

  <Accordion title="我可以详细查看 CLI 正在做什么吗?">
    可以!在调试模式下运行:

    ```bash  theme={null}
    DEBUG=* npx megallm@latest
    ```

    这将显示以下详细日志:

    * 系统检测
    * 工具检测
    * 文件操作
    * 配置更改
    * 错误堆栈跟踪
  </Accordion>
</AccordionGroup>

## 高级用法

<AccordionGroup>
  <Accordion title="我可以在 CI/CD 流水线中使用 CLI 吗?">
    可以,但在 CI/CD 环境中最好手动配置:

    ```yaml  theme={null}
    # GitHub Actions 示例
    - name: Configure MegaLLM
      env:
        ANTHROPIC_API_KEY: ${{ secrets.MEGALLM_API_KEY }}
      run: |
        mkdir -p .claude
        echo '{"env":{"ANTHROPIC_BASE_URL":"https://ai.megallm.io","ANTHROPIC_API_KEY":"'$ANTHROPIC_API_KEY'"}}' > .claude/settings.json
    ```

    这避免了交互式提示,在自动化环境中更可靠。
  </Accordion>

  <Accordion title="如何在 Docker 容器中配置 MegaLLM?">
    在 Docker 构建期间添加配置:

    ```dockerfile  theme={null}
    FROM node:18

    # 设置环境变量
    ENV ANTHROPIC_BASE_URL=https://ai.megallm.io
    ENV ANTHROPIC_API_KEY=your-key-here

    # 或复制配置文件
    COPY .claude/settings.json /root/.claude/settings.json

    WORKDIR /app
    COPY . .
    RUN npm install
    CMD ["npm", "start"]
    ```

    或在运行时传递 API 密钥:

    ```bash  theme={null}
    docker run -e ANTHROPIC_API_KEY=sk-mega-... myimage
    ```
  </Accordion>

  <Accordion title="我可以对配置进行版本控制吗?">
    **可以,但要小心**:

    **应该提交**:

    * 不包含 API 密钥的项目级配置
    * 仅包含 `ANTHROPIC_BASE_URL` 的 `.claude/settings.json`
    * 团队成员的文档

    **不应该提交**:

    * API 密钥
    * `.claude/settings.local.json`
    * 个人环境变量

    **用于版本控制的 `.claude/settings.json` 示例**:

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
      }
    }
    ```

    **添加到 `.gitignore`**:

    ```
    .claude/settings.local.json
    .claude.json
    ```

    **团队成员添加自己的 API 密钥**:

    ```json  theme={null}
    # .claude/settings.local.json (未提交)
    {
      "env": {
        "ANTHROPIC_API_KEY": "sk-mega-personal-key"
      }
    }
    ```
  </Accordion>

  <Accordion title="我可以为每个工具使用不同的模型吗?">
    可以!每个工具的配置文件允许您指定模型。

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
    model = "gpt-5"  # 更改为任何支持的模型
    ```

    **OpenCode** (`~/.config/opencode/opencode.json`):

    ```json  theme={null}
    {
      "model": "gemini-2.5-pro"
    }
    ```

    查看 [模型目录](/cn/home/models) 了解可用模型。
  </Accordion>

  <Accordion title="我的备份会发生什么?">
    CLI 在修改配置之前会创建备份文件:

    ```
    ~/.claude/settings.json.backup
    ~/.codex/config.toml.backup
    ~/.config/opencode/opencode.json.backup
    ```

    备份使用 `.backup` 后缀创建,包含您之前的配置。

    从备份恢复:

    ```bash  theme={null}
    mv ~/.claude/settings.json.backup ~/.claude/settings.json
    ```

    如果不需要,您可以手动删除备份:

    ```bash  theme={null}
    rm ~/.claude/*.backup ~/.codex/*.backup
    ```
  </Accordion>
</AccordionGroup>

## 获取帮助

<AccordionGroup>
  <Accordion title="我可以在哪里获得支持?">
    **文档**:

    * 主文档: [docs.megallm.io](https://docs.megallm.io)
    * API 参考: [docs.megallm.io/api](https://docs.megallm.io/api)

    **支持渠道**:

    * 电子邮件: [support@megallm.io](mailto:support@megallm.io)
    * GitHub Issues: [github.com/Megallm/megallm-npm/issues](https://github.com/Megallm/megallm-npm/issues)
    * Discord: [discord.gg/devsindia](https://discord.gg/devsindia)

    **社区**:

    * Twitter/X: [@megallmio](https://x.com/megallmio)
    * YouTube: [youtube.com/@Megallmio](https://youtube.com/@Megallmio)
  </Accordion>

  <Accordion title="如何报告错误?">
    1. 检查现有问题: [github.com/Megallm/megallm-npm/issues](https://github.com/Megallm/megallm-npm/issues)
    2. 如果未找到,创建一个新问题,包含:
       * CLI 版本: `npx megallm@latest --version`
       * Node.js 版本: `node --version`
       * 操作系统
       * Shell 类型
       * 错误消息/日志(使用 `DEBUG=*` 运行)
       * 重现步骤
  </Accordion>

  <Accordion title="如何请求功能?">
    在 GitHub 上打开功能请求:
    [github.com/Megallm/megallm-npm/issues/new](https://github.com/Megallm/megallm-npm/issues/new)

    包括:

    * 功能描述
    * 用例/为什么需要它
    * 任何相关的示例或模型
  </Accordion>
</AccordionGroup>

## 还有问题?

找不到您的答案?我们随时为您提供帮助!

<CardGroup cols={2}>
  <Card title="电子邮件支持" icon="envelope" href="mailto:support@megallm.io">
    从我们的支持团队获得帮助
  </Card>

  <Card title="GitHub Issues" icon="github" href="https://github.com/Megallm/megallm-npm/issues">
    报告错误或请求功能
  </Card>

  <Card title="Discord 社区" icon="discord" href="https://discord.gg/devsindia">
    与社区聊天
  </Card>

  <Card title="文档" icon="book-open" href="/cn/home/introduction">
    浏览完整文档
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt