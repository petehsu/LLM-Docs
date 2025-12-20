# Bash 工具

Bash 工具使 Claude 能够在持久的 bash 会话中执行 shell 命令，允许系统操作、脚本执行和命令行自动化。

---

Bash 工具使 Claude 能够在持久的 bash 会话中执行 shell 命令，允许系统操作、脚本执行和命令行自动化。

## 概述

Bash 工具为 Claude 提供：
- 维持状态的持久 bash 会话
- 运行任何 shell 命令的能力
- 访问环境变量和工作目录
- 命令链接和脚本编写功能

## 模型兼容性

| 模型 | 工具版本 |
|-------|--------------|
| Claude 4 模型和 Sonnet 3.7 ([已弃用](/docs/zh-CN/about-claude/model-deprecations)) | `bash_20250124` |

<Warning>
较旧的工具版本不保证与较新的模型向后兼容。始终使用与您的模型版本相对应的工具版本。
</Warning>

## 用例

- **开发工作流**：运行构建命令、测试和开发工具
- **系统自动化**：执行脚本、管理文件、自动化任务
- **数据处理**：处理文件、运行分析脚本、管理数据集
- **环境设置**：安装包、配置环境

## 快速开始

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=[
        {
            "type": "bash_20250124",
            "name": "bash"
        }
    ],
    messages=[
        {"role": "user", "content": "List all Python files in the current directory."}
    ]
)
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "tools": [
      {
        "type": "bash_20250124",
        "name": "bash"
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "List all Python files in the current directory."
      }
    ]
  }'
```
</CodeGroup>

## 工作原理

Bash 工具维持一个持久会话：

1. Claude 确定要运行的命令
2. 您在 bash shell 中执行命令
3. 将输出（stdout 和 stderr）返回给 Claude
4. 会话状态在命令之间保持（环境变量、工作目录）

## 参数

| 参数 | 必需 | 描述 |
|-----------|----------|-------------|
| `command` | 是* | 要运行的 bash 命令 |
| `restart` | 否 | 设置为 `true` 以重启 bash 会话 |

*除非使用 `restart`，否则为必需

<section title="示例用法">

```json
// 运行命令
{
  "command": "ls -la *.py"
}

// 重启会话
{
  "restart": true
}
```

</section>

## 示例：多步骤自动化

Claude 可以链接命令以完成复杂任务：

```python
# 用户请求
"Install the requests library and create a simple Python script that fetches a joke from an API, then run it."

# Claude 的工具使用：
# 1. 安装包
{"command": "pip install requests"}

# 2. 创建脚本
{"command": "cat > fetch_joke.py << 'EOF'\nimport requests\nresponse = requests.get('https://official-joke-api.appspot.com/random_joke')\njoke = response.json()\nprint(f\"Setup: {joke['setup']}\")\nprint(f\"Punchline: {joke['punchline']}\")\nEOF"}

# 3. 运行脚本
{"command": "python fetch_joke.py"}
```

会话在命令之间维持状态，因此在步骤 2 中创建的文件在步骤 3 中可用。

***

## 实现 bash 工具

Bash 工具实现为无模式工具。使用此工具时，您不需要像其他工具那样提供输入模式；该模式内置于 Claude 的模型中，无法修改。

<Steps>
  <Step title="设置 bash 环境">
    创建一个 Claude 可以交互的持久 bash 会话：
    ```python
    import subprocess
    import threading
    import queue
    
    class BashSession:
        def __init__(self):
            self.process = subprocess.Popen(
                ['/bin/bash'],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                bufsize=0
            )
            self.output_queue = queue.Queue()
            self.error_queue = queue.Queue()
            self._start_readers()
    ```
  </Step>
  <Step title="处理命令执行">
    创建一个函数来执行命令并捕获输出：
    ```python
    def execute_command(self, command):
        # 向 bash 发送命令
        self.process.stdin.write(command + '\n')
        self.process.stdin.flush()
        
        # 使用超时捕获输出
        output = self._read_output(timeout=10)
        return output
    ```
  </Step>
  <Step title="处理 Claude 的工具调用">
    从 Claude 的响应中提取并执行命令：
    ```python
    for content in response.content:
        if content.type == "tool_use" and content.name == "bash":
            if content.input.get("restart"):
                bash_session.restart()
                result = "Bash session restarted"
            else:
                command = content.input.get("command")
                result = bash_session.execute_command(command)
            
            # 将结果返回给 Claude
            tool_result = {
                "type": "tool_result",
                "tool_use_id": content.id,
                "content": result
            }
    ```
  </Step>
  <Step title="实现安全措施">
    添加验证和限制：
    ```python
    def validate_command(command):
        # 阻止危险命令
        dangerous_patterns = ['rm -rf /', 'format', ':(){:|:&};:']
        for pattern in dangerous_patterns:
            if pattern in command:
                return False, f"Command contains dangerous pattern: {pattern}"
        
        # 根据需要添加更多验证
        return True, None
    ```
  </Step>
</Steps>

### 处理错误

实现 bash 工具时，处理各种错误场景：

<section title="命令执行超时">

如果命令执行时间过长：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "Error: Command timed out after 30 seconds",
      "is_error": true
    }
  ]
}
```

</section>

<section title="命令未找到">

如果命令不存在：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: nonexistentcommand: command not found",
      "is_error": true
    }
  ]
}
```

</section>

<section title="权限被拒绝">

如果存在权限问题：

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
      "content": "bash: /root/sensitive-file: Permission denied",
      "is_error": true
    }
  ]
}
```

</section>

### 遵循实现最佳实践

<section title="使用命令超时">

实现超时以防止命令挂起：
```python
def execute_with_timeout(command, timeout=30):
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=timeout
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return f"Command timed out after {timeout} seconds"
```

</section>

<section title="维持会话状态">

保持 bash 会话持久以维持环境变量和工作目录：
```python
# 在同一会话中运行的命令维持状态
commands = [
    "cd /tmp",
    "echo 'Hello' > test.txt",
    "cat test.txt"  # 这有效，因为我们仍在 /tmp 中
]
```

</section>

<section title="处理大型输出">

截断非常大的输出以防止令牌限制问题：
```python
def truncate_output(output, max_lines=100):
    lines = output.split('\n')
    if len(lines) > max_lines:
        truncated = '\n'.join(lines[:max_lines])
        return f"{truncated}\n\n... Output truncated ({len(lines)} total lines) ..."
    return output
```

</section>

<section title="记录所有命令">

保持执行命令的审计跟踪：
```python
import logging

def log_command(command, output, user_id):
    logging.info(f"User {user_id} executed: {command}")
    logging.info(f"Output: {output[:200]}...")  # 记录前 200 个字符
```

</section>

<section title="清理输出">

从命令输出中删除敏感信息：
```python
def sanitize_output(output):
    # 删除潜在的秘密或凭证
    import re
    # 示例：删除 AWS 凭证
    output = re.sub(r'aws_access_key_id\s*=\s*\S+', 'aws_access_key_id=***', output)
    output = re.sub(r'aws_secret_access_key\s*=\s*\S+', 'aws_secret_access_key=***', output)
    return output
```

</section>

## 安全性

<Warning>
Bash 工具提供直接的系统访问。实现这些基本安全措施：
- 在隔离环境中运行（Docker/VM）
- 实现命令过滤和允许列表
- 设置资源限制（CPU、内存、磁盘）
- 记录所有执行的命令
</Warning>

### 关键建议
- 使用 `ulimit` 设置资源约束
- 过滤危险命令（`sudo`、`rm -rf` 等）
- 以最小用户权限运行
- 监控和记录所有命令执行

## 定价

The bash tool adds **245 input tokens** to your API calls.

Additional tokens are consumed by:
- Command outputs (stdout/stderr)
- Error messages
- Large file contents

有关完整定价详情，请参阅[工具使用定价](/docs/zh-CN/agents-and-tools/tool-use/overview#pricing)。

## 常见模式

### 开发工作流
- 运行测试：`pytest && coverage report`
- 构建项目：`npm install && npm run build`
- Git 操作：`git status && git add . && git commit -m "message"`

### 文件操作
- 处理数据：`wc -l *.csv && ls -lh *.csv`
- 搜索文件：`find . -name "*.py" | xargs grep "pattern"`
- 创建备份：`tar -czf backup.tar.gz ./data`

### 系统任务
- 检查资源：`df -h && free -m`
- 进程管理：`ps aux | grep python`
- 环境设置：`export PATH=$PATH:/new/path && echo $PATH`

## 限制

- **无交互式命令**：无法处理 `vim`、`less` 或密码提示
- **无 GUI 应用程序**：仅限命令行
- **会话范围**：在对话中持久化，在 API 调用之间丢失
- **输出限制**：大型输出可能被截断
- **无流式传输**：完成后返回结果

## 与其他工具结合

Bash 工具与[文本编辑器](/docs/zh-CN/agents-and-tools/tool-use/text-editor-tool)和其他工具结合时最强大。

## 后续步骤

<CardGroup cols={2}>
  <Card
    title="工具使用概述"
    icon="tool"
    href="/docs/zh-CN/agents-and-tools/tool-use/overview"
  >
    了解 Claude 的工具使用
  </Card>

  <Card
    title="文本编辑器工具"
    icon="file"
    href="/docs/zh-CN/agents-and-tools/tool-use/text-editor-tool"
  >
    使用 Claude 查看和编辑文本文件
  </Card>
</CardGroup>