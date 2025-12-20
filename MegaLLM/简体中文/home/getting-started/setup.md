# 设置指南

> 为您的开发环境设置 MegaLLM 的完整指南。

## 环境设置

### 1. 安全存储您的 API 密钥

<Tabs>
  <Tab title="Linux/macOS">
    添加到您的 shell 配置文件:

    ```bash  theme={null}
    # ~/.bashrc 或 ~/.zshrc
    export MEGALLM_API_KEY="your-api-key-here"
    ```

    然后重新加载:

    ```bash  theme={null}
    source ~/.bashrc
    # 或
    source ~/.zshrc
    ```

    或使用 `.env` 文件:

    ```bash  theme={null}
    echo "MEGALLM_API_KEY=your-api-key-here" >> .env
    ```
  </Tab>

  <Tab title="Windows">
    **PowerShell:**

    ```powershell  theme={null}
    [System.Environment]::SetEnvironmentVariable("MEGALLM_API_KEY", "your-api-key-here", "User")
    ```

    **命令提示符:**

    ```cmd  theme={null}
    setx MEGALLM_API_KEY "your-api-key-here"
    ```
  </Tab>

  <Tab title=".env 文件">
    在项目根目录创建 `.env` 文件:

    ```bash  theme={null}
    MEGALLM_API_KEY=your-api-key-here
    ```

    **Python:**

    ```python  theme={null}
    from dotenv import load_dotenv
    load_dotenv()
    ```

    **JavaScript:**

    ```javascript  theme={null}
    require('dotenv').config();
    ```

    <Warning>
      将 `.env` 添加到您的 `.gitignore` 以避免提交密钥!
    </Warning>
  </Tab>
</Tabs>

### 2. 安装 SDK

<Tabs>
  <Tab title="Python">
    ```bash  theme={null}
    # OpenAI SDK (推荐)
    pip install openai

    # 或 Anthropic SDK
    pip install anthropic

    # 用于环境变量
    pip install python-dotenv
    ```
  </Tab>

  <Tab title="JavaScript/TypeScript">
    ```bash  theme={null}
    # OpenAI SDK (推荐)
    npm install openai

    # 或 Anthropic SDK
    npm install @anthropic-ai/sdk

    # 用于环境变量
    npm install dotenv
    ```
  </Tab>

  <Tab title="Go">
    ```bash  theme={null}
    go get github.com/sashabaranov/go-openai
    ```
  </Tab>

  <Tab title="其他语言">
    MegaLLM 适用于任何 HTTP 客户端。详情请参阅 [API 参考](/cn/api-reference/introduction)。
  </Tab>
</Tabs>

### 3. 配置您的客户端

<Tabs>
  <Tab title="Python - OpenAI 格式">
    ```python  theme={null}
    import os
    from openai import OpenAI

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # 测试连接
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": "你好!"}]
    )
    print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="Python - Anthropic 格式">
    ```python  theme={null}
    import os
    from anthropic import Anthropic

    client = Anthropic(
        base_url="https://ai.megallm.io",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # 测试连接
    message = client.messages.create(
        model="claude-3.5-sonnet",
        max_tokens=100,
        messages=[{"role": "user", "content": "你好!"}]
    )
    print(message.content[0].text)
    ```
  </Tab>

  <Tab title="JavaScript - OpenAI 格式">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // 测试连接
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: '你好!' }]
    });
    console.log(response.choices[0].message.content);
    ```
  </Tab>

  <Tab title="JavaScript - Anthropic 格式">
    ```javascript  theme={null}
    import Anthropic from '@anthropic-ai/sdk';

    const client = new Anthropic({
      baseURL: 'https://ai.megallm.io',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // 测试连接
    const message = await client.messages.create({
      model: 'claude-3.5-sonnet',
      max_tokens: 100,
      messages: [{ role: 'user', content: '你好!' }]
    });
    console.log(message.content[0].text);
    ```
  </Tab>
</Tabs>

## 项目设置

### 新项目

1. **创建项目目录:**
   ```bash  theme={null}
   mkdir my-ai-project
   cd my-ai-project
   ```

2. **初始化项目:**
   ```bash  theme={null}
   # Python
   python -m venv venv
   source venv/bin/activate
   pip install openai python-dotenv

   # JavaScript
   npm init -y
   npm install openai dotenv
   ```

3. **创建 .env 文件:**
   ```bash  theme={null}
   echo "MEGALLM_API_KEY=your-key-here" > .env
   echo ".env" >> .gitignore
   ```

4. **创建第一个脚本:**
   参阅[第一个请求指南](/cn/home/getting-started/first-request)

### 现有项目

如果您已经在使用 OpenAI 或 Anthropic:

1. **更新基础 URL:**
   ```python  theme={null}
   # 之前
   client = OpenAI(api_key="sk-...")

   # 之后
   client = OpenAI(
       base_url="https://ai.megallm.io/v1",
       api_key="your-megallm-key"
   )
   ```

2. **就是这样!** 您所有现有的代码都可以正常工作。

## IDE 设置

### VS Code

安装推荐的扩展:

* Python 扩展 (用于 Python)
* ESLint (用于 JavaScript)
* REST Client (用于测试 API)

### PyCharm / IntelliJ

在运行配置中配置环境变量。

### AI 编程助手

MegaLLM 提供 CLI 来配置 AI 编码工具:

```bash  theme={null}
npx megallm@latest
```

这将设置:

* Claude Code
* Codex/Windsurf
* OpenCode

详情请参阅 [CLI 文档](/cn/cli/overview)。

## 验证设置

测试您的配置:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import os
    from openai import OpenAI

    # 检查 API 密钥
    api_key = os.getenv("MEGALLM_API_KEY")
    if not api_key:
        print("❌ API 密钥未设置!")
        exit(1)
    print("✅ 找到 API 密钥")

    # 测试连接
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=api_key
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "说 '设置成功!'"}],
            max_tokens=10
        )
        print("✅ 连接成功!")
        print(f"响应: {response.choices[0].message.content}")
    except Exception as e:
        print(f"❌ 错误: {e}")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    // 检查 API 密钥
    const apiKey = process.env.MEGALLM_API_KEY;
    if (!apiKey) {
      console.log('❌ API 密钥未设置!');
      process.exit(1);
    }
    console.log('✅ 找到 API 密钥');

    // 测试连接
    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: apiKey
    });

    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: "说 '设置成功!'" }],
        max_tokens: 10
      });
      console.log('✅ 连接成功!');
      console.log(`响应: ${response.choices[0].message.content}`);
    } catch (error) {
      console.log(`❌ 错误: ${error.message}`);
    }
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer $MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "说设置成功!"}],
        "max_tokens": 10
      }'
    ```
  </Tab>
</Tabs>

## 故障排除

<AccordionGroup>
  <Accordion title="找不到 API 密钥">
    **问题:** 环境变量未设置

    **解决方案:**

    * 检查变量名: `MEGALLM_API_KEY`
    * 重新加载 shell: `source ~/.bashrc`
    * 验证: `echo $MEGALLM_API_KEY`
  </Accordion>

  <Accordion title="身份验证失败 (401)">
    **问题:** API 密钥无效

    **解决方案:**

    * 验证密钥以 `sk-mega-` 开头
    * 检查是否有额外的空格
    * 在[仪表板](https://megallm.io/dashboard/overview)生成新密钥
  </Accordion>

  <Accordion title="连接超时">
    **问题:** 网络或防火墙问题

    **解决方案:**

    * 检查互联网连接
    * 验证防火墙设置
    * 尝试不使用 VPN
  </Accordion>

  <Accordion title="找不到模块">
    **问题:** SDK 未安装

    **解决方案:**

    ```bash  theme={null}
    pip install openai  # Python
    npm install openai  # JavaScript
    ```
  </Accordion>
</AccordionGroup>

## 下一步

<CardGroup cols={2}>
  <Card title="第一个请求" icon="code" href="/cn/home/getting-started/first-request">
    构建您的第一个 AI 应用程序
  </Card>

  <Card title="浏览模型" icon="layer-group" href="/cn/home/models">
    探索 70+ 个可用模型
  </Card>

  <Card title="API 参考" icon="file-code" href="/cn/api-reference/introduction">
    完整的 API 文档
  </Card>

  <Card title="最佳实践" icon="star" href="/cn/home/faq">
    提示和常见问题
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt