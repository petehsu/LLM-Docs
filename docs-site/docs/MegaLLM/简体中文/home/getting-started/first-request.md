# 第一个请求

> 让我们逐步构建一个简单的 AI 应用程序。您将学习如何发起请求、处理响应以及使用不同的模型。

## 前提条件

* MegaLLM API 密钥 ([在此获取](https://megallm.io/dashboard/overview))
* 安装 Python 3.7+ 或 Node.js 14+
* 基本编程知识

## 步骤 1: 创建项目

<Tabs>
  <Tab title="Python">
    ```bash  theme={null}
    # 创建目录
    mkdir my-first-ai-app
    cd my-first-ai-app

    # 创建虚拟环境
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate

    # 安装依赖
    pip install openai python-dotenv
    ```
  </Tab>

  <Tab title="JavaScript">
    ```bash  theme={null}
    # 创建目录
    mkdir my-first-ai-app
    cd my-first-ai-app

    # 初始化项目
    npm init -y

    # 安装依赖
    npm install openai dotenv
    ```
  </Tab>
</Tabs>

## 步骤 2: 存储 API 密钥

创建 `.env` 文件:

```bash  theme={null}
MEGALLM_API_KEY=your-api-key-here
```

<Warning>
  将 `.env` 添加到 `.gitignore` 以避免提交您的 API 密钥!
</Warning>

## 步骤 3: 基本请求

<Tabs>
  <Tab title="Python">
    创建 `app.py`:

    ```python  theme={null}
    import os
    from dotenv import load_dotenv
    from openai import OpenAI

    # 加载环境变量
    load_dotenv()

    # 初始化客户端
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # 发起请求
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "什么是 MegaLLM?"}
        ]
    )

    # 打印响应
    print(response.choices[0].message.content)
    ```

    运行:

    ```bash  theme={null}
    python app.py
    ```
  </Tab>

  <Tab title="JavaScript">
    创建 `app.js`:

    ```javascript  theme={null}
    import OpenAI from 'openai';
    import dotenv from 'dotenv';

    // 加载环境变量
    dotenv.config();

    // 初始化客户端
    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // 发起请求
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: '什么是 MegaLLM?' }
      ]
    });

    // 打印响应
    console.log(response.choices[0].message.content);
    ```

    更新 `package.json`:

    ```json  theme={null}
    {
      "type": "module"
    }
    ```

    运行:

    ```bash  theme={null}
    node app.js
    ```
  </Tab>
</Tabs>

## 步骤 4: 添加对话上下文

让我们使其具有对话性:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import os
    from dotenv import load_dotenv
    from openai import OpenAI

    load_dotenv()

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    # 对话历史
    messages = [
        {"role": "system", "content": "你是一个有帮助的助手。"},
        {"role": "user", "content": "什么是 Python?"}
    ]

    # 第一个响应
    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )

    # 添加到历史
    assistant_message = response.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_message})
    print(f"助手: {assistant_message}\n")

    # 后续问题
    messages.append({"role": "user", "content": "它的主要特性是什么?"})

    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )

    print(f"助手: {response.choices[0].message.content}")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';
    import dotenv from 'dotenv';

    dotenv.config();

    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    // 对话历史
    const messages = [
      { role: 'system', content: '你是一个有帮助的助手。' },
      { role: 'user', content: '什么是 JavaScript?' }
    ];

    // 第一个响应
    let response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: messages
    });

    // 添加到历史
    const assistantMessage = response.choices[0].message.content;
    messages.push({ role: 'assistant', content: assistantMessage });
    console.log(`助手: ${assistantMessage}\n`);

    // 后续问题
    messages.push({ role: 'user', content: '它的主要特性是什么?' });

    response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: messages
    });

    console.log(`助手: ${response.choices[0].message.content}`);
    ```
  </Tab>
</Tabs>

## 步骤 5: 尝试不同的模型

通过更改 `model` 参数来切换模型:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    models = ["gpt-4", "claude-3.5-sonnet", "gemini-2.5-pro"]

    for model in models:
        print(f"\n--- 使用 {model} ---")
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": "用一句话解释量子计算。"}
            ]
        )
        print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    const models = ['gpt-4', 'claude-3.5-sonnet', 'gemini-2.5-pro'];

    for (const model of models) {
      console.log(`\n--- 使用 ${model} ---`);
      const response = await client.chat.completions.create({
        model: model,
        messages: [
          { role: 'user', content: '用一句话解释量子计算。' }
        ]
      });
      console.log(response.choices[0].message.content);
    }
    ```
  </Tab>
</Tabs>

## 步骤 6: 添加参数

使用参数自定义响应:

```python  theme={null}
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "写一首关于 AI 的短诗"}
    ],
    temperature=0.9,      # 更高 = 更有创意
    max_tokens=100,       # 限制响应长度
    top_p=0.95,          # 核采样
    frequency_penalty=0.5 # 减少重复
)
```

## 步骤 7: 错误处理

添加适当的错误处理:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI, AuthenticationError, RateLimitError

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "你好!"}]
        )
        print(response.choices[0].message.content)

    except AuthenticationError:
        print("❌ API 密钥无效")
    except RateLimitError:
        print("❌ 超过速率限制")
    except Exception as e:
        print(f"❌ 错误: {e}")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: '你好!' }]
      });
      console.log(response.choices[0].message.content);

    } catch (error) {
      if (error.status === 401) {
        console.log('❌ API 密钥无效');
      } else if (error.status === 429) {
        console.log('❌ 超过速率限制');
      } else {
        console.log(`❌ 错误: ${error.message}`);
      }
    }
    ```
  </Tab>
</Tabs>

## 步骤 8: 交互式聊天

构建一个简单的聊天机器人:

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import os
    from dotenv import load_dotenv
    from openai import OpenAI

    load_dotenv()

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key=os.getenv("MEGALLM_API_KEY")
    )

    messages = [
        {"role": "system", "content": "你是一个有帮助的助手。"}
    ]

    print("与 AI 聊天 (输入 'quit' 退出)\n")

    while True:
        user_input = input("你: ")

        if user_input.lower() == 'quit':
            break

        messages.append({"role": "user", "content": user_input})

        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages
        )

        assistant_message = response.choices[0].message.content
        messages.append({"role": "assistant", "content": assistant_message})

        print(f"AI: {assistant_message}\n")
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';
    import dotenv from 'dotenv';
    import readline from 'readline';

    dotenv.config();

    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY
    });

    const messages = [
      { role: 'system', content: '你是一个有帮助的助手。' }
    ];

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("与 AI 聊天 (输入 'quit' 退出)\n");

    function chat() {
      rl.question('你: ', async (userInput) => {
        if (userInput.toLowerCase() === 'quit') {
          rl.close();
          return;
        }

        messages.push({ role: 'user', content: userInput });

        const response = await client.chat.completions.create({
          model: 'gpt-4',
          messages: messages
        });

        const assistantMessage = response.choices[0].message.content;
        messages.push({ role: 'assistant', content: assistantMessage });

        console.log(`AI: ${assistantMessage}\n`);
        chat();
      });
    }

    chat();
    ```
  </Tab>
</Tabs>

## 理解响应

API 返回一个丰富的响应对象:

```json  theme={null}
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好!我今天可以如何帮助你?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```

## 下一步

<CardGroup cols={2}>
  <Card title="流式传输" icon="stream" href="/cn/api-reference/endpoint/streaming">
    实时流式响应
  </Card>

  <Card title="函数调用" icon="function" href="/cn/api-reference/endpoint/function-calling">
    让 AI 使用外部工具
  </Card>

  <Card title="浏览模型" icon="layer-group" href="/cn/home/models">
    探索所有可用模型
  </Card>

  <Card title="最佳实践" icon="star" href="/cn/home/getting-started/next-steps">
    生产应用的提示
  </Card>
</CardGroup>

## 故障排除

<AccordionGroup>
  <Accordion title="导入错误">
    确保您已安装 SDK:

    ```bash  theme={null}
    pip install openai  # Python
    npm install openai  # JavaScript
    ```
  </Accordion>

  <Accordion title="401 身份验证错误">
    * 检查您的 API 密钥是否正确
    * 验证 `.env` 文件是否在同一目录中
    * 确保您调用了 `load_dotenv()` (Python) 或 `dotenv.config()` (JS)
  </Accordion>

  <Accordion title="速率限制错误">
    * 您发起了太多请求
    * 在请求之间添加延迟
    * 考虑升级您的计划
  </Accordion>

  <Accordion title="响应缓慢">
    * 尝试更快的模型,如 `gpt-3.5-turbo`
    * 减少 `max_tokens`
    * 使用流式传输以获得更好的用户体验
  </Accordion>
</AccordionGroup>

## 需要帮助?

* **常见问题**: [常见问题](/cn/home/faq)
* **API 参考**: [完整文档](/cn/api-reference/introduction)
* **支持**: [support@megallm.io](mailto:support@megallm.io)
* **Discord**: [加入社区](https://discord.gg/devsindia)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt