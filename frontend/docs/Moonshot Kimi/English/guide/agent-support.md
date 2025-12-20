文档

入门指南

在编程工具中使用 Kimi K2 模型

# 在编程工具中使用 Kimi K2 模型

kimi-k2 是一款具备超强代码和 Agent 能力的 MoE 架构基础模型，我们以 Claude Code， VS Code & Cline/RooCode 为示例，说明如何使用 kimi-k2 系列模型。

**11月6日最新发布 `kimi-k2-thinking` 和 `kimi-k2-thinking-turbo` 模型，支持 256k 上下文，支持多步工具调用与思考，擅长解决更复杂的问题。**
**9月5日最新发布 `kimi-k2-0905-preview` 模型，上下文窗口扩展至 256K，代码能力更强。如果您需要更快的响应速度，可以使用 `kimi-k2-turbo-preview` 模型，它始终对标最新版本的 kimi-k2 并保持功能一致，但输出速度已提升到 60tokens/s，最高可达 100 tokens/s。**

## 

在使用大模型进行代码生成时，由于模型的随机性和复杂性，可能需要多次尝试才能生成符合预期的代码。编程工具会自动进行多轮重试和调用，这可能导致 token 用量快速增长。为了更好地控制成本和使用体验，我们建议您注意以下几点：

* **预算控制**

  + **设置日消费上限**：在使用前，请前往[Kimi 开放平台项目设置 (opens in a new tab)](https://platform.moonshot.cn/console/projects/settings)配置「项目日消费预算」。一旦达到预算上限，系统将自动拒绝该项目下所有 API 请求（注：由于计费延迟，限制生效可能有约 10 分钟延迟）。设置方式请见[组织管理最佳实践](/docs/guide/org-best-practice)
  + **余额预警提醒**：建议开启账户余额提醒功能。当账户余额低于预设金额（默认 ¥20）时，系统会通过短信通知您及时充值。
* **使用建议**

  + **持续监控**：建议在编程软件运行期间保持监控，及时处理异常情况，避免因无限循环或过度重试造成不必要的资源消耗。
  + **模型选择**：如果对响应速度要求不高，可以选择使用 `kimi-k2-0905-preview` 或 `kimi-k2-0711-preview` 模型，它的 token 消耗相对较慢，更适合长时间运行的场景。

## 

K2 模型始终专注于 agentic loop，工具调用的可靠性至关重要。为此，我们推出了 [K2 Vendor Verifier (K2VV) (opens in a new tab)](https://github.com/MoonshotAI/K2-Vendor-Verifier) 来评测不同供应商的 K2 API 工具调用质量，帮助您直观对比各供应商的准确性差异。

**最新更新**：K2VV 已扩展至 12 家供应商，开源了更多测试数据。欢迎在[此处 (opens in a new tab)](https://github.com/MoonshotAI/K2-Vendor-Verifier/issues/9)反馈您关心的测试指标。

## 

* 访问开放平台 [https://platform.moonshot.cn/console/api-keys (opens in a new tab)](https://platform.moonshot.cn/console/api-keys) 创建获取 API Key，选择 default 默认项目。

![key](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fkey-zh.f5838c98.png&w=3840&q=75)

## 

### 

若您已安装好 Claude Code ，可以跳过这一步

#### 

```shell
# MacOS 和 Linux 上安装 nodejs
curl-fsSLhttps://fnm.vercel.app/install|bash

# 新开一个terminal，让 fnm 生效
fnminstall24.3.0
fnmdefault24.3.0
fnmuse24.3.0

# 安装 claude-code
npminstall-g@anthropic-ai/claude-code--registry=https://registry.npmmirror.com

# 初始化配置
node--eval"
    const homeDir = os.homedir(); 
    const filePath = path.join(homeDir, '.claude.json');
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        fs.writeFileSync(filePath,JSON.stringify({ ...content, hasCompletedOnboarding: true }, 2), 'utf-8');
    } else {
        fs.writeFileSync(filePath,JSON.stringify({ hasCompletedOnboarding: true }), null, 'utf-8');
    }"
```

#### 

```powershell
# 打开 windows 终端中的 powershell 终端
# windows 上安装 nodejs
# 右键按 Windows 按钮，点击「终端」

# 然后依次执行下面的
winget install OpenJS.NodeJS
Set-ExecutionPolicy-Scope CurrentUser RemoteSigned

# 然后关闭终端窗口，新开一个终端窗口

# 安装 claude-code
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com

# 初始化配置
node --eval "
    const homeDir = os.homedir(); 
    const filePath = path.join(homeDir, '.claude.json');
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        fs.writeFileSync(filePath,JSON.stringify({ ...content, hasCompletedOnboarding: true }, 2), 'utf-8');
    } else {
        fs.writeFileSync(filePath,JSON.stringify({ hasCompletedOnboarding: true }), null, 'utf-8');
    }"
```

### 

完成 Claude Code 安装后，请按照以下方式设置环境变量使用 `kimi-k2-thinking-turbo` 模型，并启动 Claude。

注：如果仍然需选择 kimi-k2 慢速版模型，可以将下方模型替换为 `kimi-k2-thinking` 来使用。

#### 

```shell
# Linux/macOS 启动高速版 kimi-k2-thinking-turbo 模型
export ANTHROPIC_BASE_URL=https://api.moonshot.cn/anthropic
export ANTHROPIC_AUTH_TOKEN=${YOUR_MOONSHOT_API_KEY}
export ANTHROPIC_MODEL=kimi-k2-thinking-turbo
export ANTHROPIC_DEFAULT_OPUS_MODEL=kimi-k2-thinking-turbo
export ANTHROPIC_DEFAULT_SONNET_MODEL=kimi-k2-thinking-turbo
export ANTHROPIC_DEFAULT_HAIKU_MODEL=kimi-k2-thinking-turbo
export CLAUDE_CODE_SUBAGENT_MODEL=kimi-k2-thinking-turbo
claude
```

#### 

```powershell
# Windows Powershell 启动高速版 kimi-k2-thinking-turbo 模型
$env:ANTHROPIC_BASE_URL="https://api.moonshot.cn/anthropic";
$env:ANTHROPIC_AUTH_TOKEN="YOUR_MOONSHOT_API_KEY"
$env:ANTHROPIC_MODEL="kimi-k2-thinking-turbo"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="kimi-k2-thinking-turbo"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="kimi-k2-thinking-turbo"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="kimi-k2-thinking-turbo"
$env:CLAUDE_CODE_SUBAGENT_MODEL="kimi-k2-thinking-turbo"
claude
```

#### 

在Claude Code中输入`/status`确认模型状态：

![status](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fstatus.120f46ef.png&w=3840&q=75)

* 如何在 Claude Code 中体验 `kimi-k2-thinking-turbo` 思考能力
  + 请在配置 turbo 模型后，进入 Claude Code 页面后点击 `Tab` 按钮切换，切换成功可看到 "Thinking on" 的标识。

![status](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fthinking-on.42c551de.png&w=3840&q=75)

接下来就可以正常使用 Claude Code 进行开发了！

## 

### 

若您已安装好 Claude Code ，可以跳过这一步

#### 

```shell
# MacOS 和 Linux 上安装 nodejs
curl-fsSLhttps://fnm.vercel.app/install|bash

# 新开一个terminal，让 fnm 生效
fnminstall24.3.0
fnmdefault24.3.0
fnmuse24.3.0

# 安装 claude-code
npminstall-g@anthropic-ai/claude-code--registry=https://registry.npmmirror.com

# 初始化配置
node--eval"
    const homeDir = os.homedir(); 
    const filePath = path.join(homeDir, '.claude.json');
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        fs.writeFileSync(filePath,JSON.stringify({ ...content, hasCompletedOnboarding: true }, 2), 'utf-8');
    } else {
        fs.writeFileSync(filePath,JSON.stringify({ hasCompletedOnboarding: true }), null, 'utf-8');
    }"
```

#### 

```powershell
# 打开 windows 终端中的 powershell 终端
# windows 上安装 nodejs
# 右键按 Windows 按钮，点击「终端」

# 然后依次执行下面的
winget install OpenJS.NodeJS
Set-ExecutionPolicy-Scope CurrentUser RemoteSigned

# 然后关闭终端窗口，新开一个终端窗口

# 安装 claude-code
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com

# 初始化配置
node --eval "
    const homeDir = os.homedir(); 
    const filePath = path.join(homeDir, '.claude.json');
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        fs.writeFileSync(filePath,JSON.stringify({ ...content, hasCompletedOnboarding: true }, 2), 'utf-8');
    } else {
        fs.writeFileSync(filePath,JSON.stringify({ hasCompletedOnboarding: true }), null, 'utf-8');
    }"
```

### 

完成 Claude Code 安装后，请按照以下方式设置环境变量使用 `kimi-k2-turbo-preview` 模型，并启动 Claude。

注：如果仍然需选择 kimi-k2 慢速版模型，可以将下方模型替换为 `kimi-k2-0905-preview` 或 `kimi-k2-0711-preview` 来使用。

#### 

```shell
# Linux/macOS 启动高速版 kimi-k2-turbo-preview 模型
export ANTHROPIC_BASE_URL=https://api.moonshot.cn/anthropic
export ANTHROPIC_AUTH_TOKEN=${YOUR_MOONSHOT_API_KEY}
export ANTHROPIC_MODEL=kimi-k2-turbo-preview
export ANTHROPIC_DEFAULT_OPUS_MODEL=kimi-k2-turbo-preview
export ANTHROPIC_DEFAULT_SONNET_MODEL=kimi-k2-turbo-preview
export ANTHROPIC_DEFAULT_HAIKU_MODEL=kimi-k2-turbo-preview
export CLAUDE_CODE_SUBAGENT_MODEL=kimi-k2-turbo-preview
claude
```

#### 

```powershell
# Windows Powershell 启动高速版 kimi-k2-turbo-preview 模型
$env:ANTHROPIC_BASE_URL="https://api.moonshot.cn/anthropic";
$env:ANTHROPIC_AUTH_TOKEN="YOUR_MOONSHOT_API_KEY"
$env:ANTHROPIC_MODEL="kimi-k2-turbo-preview"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="kimi-k2-turbo-preview"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="kimi-k2-turbo-preview"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="kimi-k2-turbo-preview"
$env:CLAUDE_CODE_SUBAGENT_MODEL="kimi-k2-turbo-preview"
claude
```

## 

### 

1. 打开 VS Code
2. 点击左侧活动栏中的扩展图标（或使用快捷键 `Ctrl+Shift+X` / `Cmd+Shift+X`）
3. 在搜索框中输入 `cline`
4. 找到 `Cline` 扩展（通常由 Cline Team 发布）
5. 点击 `Install` 按钮进行安装
6. 安装完成后，可能需要重启 VS Code

![cline](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsearch_cline.ea802998.jpeg&w=3840&q=75)

### 

安装完成后，您可以：

1. 在 VS Code 左侧活动栏中看到 Cline 图标
2. 或者通过命令面板（`Ctrl+Shift+P` / `Cmd+Shift+P`）搜索 "Cline" 相关命令来验证安装成功

### 

* API Provider 选择 'Moonshot'
* Moonshot Entrypoint 选择 'api.moonshot.cn'
* Moonshot API Key 配置从 Kimi 开放平台获取的 Key
* Model 选择 'kimi-k2-0905-preview'
* Browser 勾选 'Disable browser tool usage'
* 点击'Done'，保存配置

![moonshot_cline](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmoonshot_cline.1adceef8.png&w=3840&q=75)

### 

* 同上方配置 'kimi-k2-0905-preview' 模型的步骤一致，只需要将 Model 选择替换为 'kimi-k2-turbo-preview' 即可
* 点击'Done'，保存配置
* 说明：'kimi-k2-turbo-preview' 模型上下文长度为 256k，这里的显示有误，请以官方平台的模型说明为准

![turbo_config](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcline_turbo.00814feb.png&w=3840&q=75)

![turbo_browser](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcline_browser_setting.64726cfc.png&w=3840&q=75)

### 

* 我们让 kimi-k2-0711-preview 模型写一个贪吃蛇游戏

[

您的浏览器不支持视频播放。

](/docs/guide/cline/cline-run.mp4)

* 游戏的效果

[

您的浏览器不支持视频播放。

](/docs/guide/cline/snake.mp4)

## 

### 

1. 打开 VS Code
2. 点击左侧活动栏中的扩展图标（或使用快捷键 `Ctrl+Shift+X` / `Cmd+Shift+X`）
3. 在搜索框中输入 `roo code`
4. 找到 `Roo Code` 扩展（通常由 RooCode Team 发布）
5. 点击 `安装` 按钮进行安装
6. 安装完成后，可能需要重启 VS Code

![cline](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsearch_roocode.4346965c.png&w=3840&q=75)

### 

安装完成后，您可以：

1. 在 VS Code 左侧活动栏中看到 RooCode 图标
2. 或者通过命令面板（`Ctrl+Shift+P` / `Cmd+Shift+P`）搜索 "RooCode" 相关命令来验证安装成功

### 

* API Provider 选择 'Moonshot'
* Moonshot Entrypoint 选择 'api.moonshot.cn'
* Moonshot API Key 配置从 Kimi 开放平台获取的 Key
* Model 选择 'kimi-k2-0905-preview'
* Browser 勾选 'Disable browser tool usage'

![roocode](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmoonshot_roocode.bfbcd1c3.png&w=3840&q=75)

### 

* 同上方配置 'kimi-k2-0905-preview' 模型的步骤一致，只需要将 Model 选择替换为 'kimi-k2-turbo-preview' 即可
* 点击'Done'，保存配置

![config](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Froocode_api_config1.8b14f61d.png&w=3840&q=75)

## 

```python
from openai import OpenAI

client =OpenAI(
    api_key ="$MOONSHOT_API_KEY",
    base_url ="https://api.moonshot.cn/v1",
)

completion = client.chat.completions.create(
    model ="kimi-k2-0905-preview",
    messages = [
        {"role": "system", "content": "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
        {"role": "user", "content": "你好，我叫李雷，1+1等于多少？"}
    ],
    temperature =0.6,
)

print(completion.choices[0].message.content)
```

其中 $MOONSHOT\_API\_KEY 需要替换为您在平台上创建的 API Key。kimi-k2 模型 temperature 建议设置为 0.6，`kimi-k2-0905-preview` 256k 上下文模型，建议 max\_tokens 设置为 32768。

如需使用 `kimi-k2-turbo-preview` 模型，请将模型名称替换为 `kimi-k2-turbo-preview` 即可。

使用 OpenAI SDK 时运行文档中的代码时，需要保证 Python 版本至少为 3.7.1，Node.js 版本至少为 18，OpenAI SDK 版本不低于 1.0.0。

Last updated on 2025年11月20日

[开发工作台调试模型指南](/docs/guide/use-playground-to-debug-the-model "开发工作台调试模型指南")[ModelScope MCP 服务器配置指南](/docs/guide/configure-the-modelscope-mcp-server "ModelScope MCP 服务器配置指南")