# 快速开始

> 只需 2 分钟即可开始使用 MegaLLM。本指南将帮助您完成第一个 API 调用。

## 1. 获取您的 API 密钥

<Steps>
  <Step title="注册">
    访问 [megallm.io/auth/signup](https://megallm.io/auth/signup) 并创建账户
  </Step>

  <Step title="进入控制台">
    前往 [megallm.io/dashboard](https://megallm.io/dashboard/overview)
  </Step>

  <Step title="生成 API 密钥">
    在 API 密钥部分点击"创建新 API 密钥"
  </Step>

  <Step title="复制密钥">
    复制您的密钥（以 `sk-mega-` 开头）并安全保存
  </Step>
</Steps>

<Warning>
  请保密您的 API 密钥！切勿将其提交到版本控制系统或公开分享。
</Warning>

## 2. 发出您的第一个请求

选择您喜欢的方式：

<Tabs>
  <Tab title="Python">
    ```bash  theme={null}
    # 安装 OpenAI SDK
    pip install openai
    ```

    ```python  theme={null}
    from openai import OpenAI

    # 初始化客户端
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-megallm-api-key"  # 替换为您的密钥
    )

    # 发出请求
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "打个招呼！"}
        ]
    )

    print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="JavaScript">
    ```bash  theme={null}
    # 安装 OpenAI SDK
    npm install openai
    ```

    ```javascript  theme={null}
    import OpenAI from 'openai';

    // 初始化客户端
    const client = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: 'your-megallm-api-key' // 替换为您的密钥
    });

    // 发出请求
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: '打个招呼！' }
      ]
    });

    console.log(response.choices[0].message.content);
    ```
  </Tab>

  <Tab title="cURL">
    ```bash  theme={null}
    curl https://ai.megallm.io/v1/chat/completions \
      -H "Authorization: Bearer YOUR_MEGALLM_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "model": "gpt-4",
        "messages": [
          {"role": "user", "content": "打个招呼！"}
        ]
      }'
    ```
  </Tab>

  <Tab title="CLI">
    ```bash  theme={null}
    # 安装 MegaLLM CLI
    npx megallm@latest

    # 按照交互式设置进行操作
    ```

    详情请参见 [CLI 文档](/cli/overview)。
  </Tab>
</Tabs>

## 3. 尝试不同的模型

MegaLLM 的超能力之一是即时模型切换。只需更改 `model` 参数：

```python  theme={null}
# 尝试 GPT-4
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "解释量子计算"}]
)

# 切换到 Claude
response = client.chat.completions.create(
    model="claude-opus-4-1-20250805",
    messages=[{"role": "user", "content": "解释量子计算"}]
)

# 尝试 Gemini
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[{"role": "user", "content": "解释量子计算"}]
)
```

<Info>
  在[模型目录](/home/models)浏览所有可用模型
</Info>

## 下一步？

<CardGroup cols={2}>
  <Card title="完整设置" icon="screwdriver-wrench" href="/home/getting-started/setup">
    环境变量和配置
  </Card>

  <Card title="首次请求教程" icon="brackets-curly" href="/home/getting-started/first-request">
    带示例的详细演示
  </Card>

  <Card title="浏览模型" icon="grid-2-plus" href="/home/models">
    探索所有 70 多个可用模型
  </Card>

  <Card title="API 参考" icon="book-atlas" href="/api-reference/introduction">
    完整的 API 文档
  </Card>
</CardGroup>

## 常见问题

<AccordionGroup>
  <Accordion title="我应该使用哪个模型？">
    一般用途使用 `gpt-4`，长上下文使用 `claude-3.5-sonnet`，速度和成本效率使用 `gpt-3.5-turbo`。

    详细比较请参见[模型目录](/home/models)。
  </Accordion>

  <Accordion title="费用是多少？">
    您只为使用的部分付费。不同模型有不同的定价。大多数测试可以在 1 美元以内完成。

    在您的[控制台](https://megallm.io/dashboard/overview)查看当前定价。
  </Accordion>

  <Accordion title="我可以使用现有的 OpenAI/Anthropic 代码吗？">
    可以！只需更改 base URL。您所有现有代码无需修改即可工作。
  </Accordion>

  <Accordion title="如果模型宕机了怎么办？">
    MegaLLM 具有自动故障转移功能。如果模型不可用，您可以快速切换到替代方案。
  </Accordion>
</AccordionGroup>

## 需要帮助？

* **完整教程**：[首次请求指南](/home/getting-started/first-request)
* **文档**：[开发者文档](/dev-docs/overview)
* **常见问题**：[常见问题](/home/faq)
* **支持**：[support@megallm.io](mailto:support@megallm.io)
* **Discord**：[加入社区](https://discord.gg/devsindia)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt