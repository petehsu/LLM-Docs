# 身份验证

> MegaLLM 使用 API 密钥进行身份验证。本指南涵盖所有身份验证方法和最佳实践。

## 身份验证方法

### Bearer 令牌

最常见的身份验证方法是在 Authorization 标头中使用 Bearer 令牌:

```http  theme={null}
Authorization: Bearer YOUR_API_KEY
```

### API 密钥标头 (Anthropic 格式)

对于与 Anthropic 兼容的端点,您也可以使用 `x-api-key` 标头:

```http  theme={null}
x-api-key: YOUR_API_KEY
```

## 获取您的 API 密钥

<Steps>
  <Step title="仪表板方法">
    获取 API 密钥的推荐方法是通过 MegaLLM 仪表板:

    1. 访问 [megallm.io/dashboard](https://megallm.io/dashboard/overview)
    2. 导航到 API 密钥部分
    3. 点击"创建新的 API 密钥"
    4. 复制密钥(以 `sk-mega-` 开头)并安全存储
  </Step>

  <Step title="CLI 工具">
    如果您已安装 MegaLLM CLI:

    ```bash  theme={null}
    npx megallm@latest
    ```

    按照交互式提示设置您的 API 密钥。
  </Step>
</Steps>

## 安全最佳实践

<Warning>
  **永远不要暴露您的令牌**: 始终将令牌存储在环境变量或安全保管库中,永远不要存储在代码中。
</Warning>

### 环境变量

<Tabs>
  <Tab title="Linux/Mac">
    ```bash  theme={null}
    # 添加到 ~/.bashrc 或 ~/.zshrc
    export MEGALLM_API_KEY="your_api_key_here"

    # 或使用 .env 文件
    echo "MEGALLM_API_KEY=your_api_key_here" >> .env
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell  theme={null}
    # 设置环境变量
    [System.Environment]::SetEnvironmentVariable("MEGALLM_API_KEY", "your_api_key_here", "User")

    # 或使用命令提示符
    setx MEGALLM_API_KEY "your_api_key_here"
    ```
  </Tab>

  <Tab title="Docker">
    ```dockerfile  theme={null}
    # 在 Dockerfile 中
    ENV MEGALLM_API_KEY=${MEGALLM_API_KEY}

    # 或在 docker-compose.yml 中
    environment:
      - MEGALLM_API_KEY=${MEGALLM_API_KEY}
    ```
  </Tab>
</Tabs>

## 使用 SDK

### OpenAI SDK

```python  theme={null}
from openai import OpenAI

client = OpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key=os.getenv("MEGALLM_API_KEY")
)

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Anthropic SDK

```python  theme={null}
from anthropic import Anthropic

client = Anthropic(
    base_url="https://ai.megallm.io",
    api_key=os.getenv("MEGALLM_API_KEY")
)

message = client.messages.create(
    model="claude-3.5-sonnet",
    max_tokens=100,
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### LangChain 集成

```python  theme={null}
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key=os.getenv("MEGALLM_API_KEY"),
    model="gpt-4"
)

response = llm.invoke("Hello!")
```

## 故障排除

### 常见身份验证错误

| 错误代码 | 消息           | 解决方案                 |
| ---- | ------------ | -------------------- |
| 401  | Unauthorized | 检查您的 API 密钥是否有效且未过期  |
| 403  | Forbidden    | 验证 API 密钥是否具有所需的访问权限 |
| 429  | Rate Limited | 等待并重试或联系支持           |

### 调试身份验证

启用调试模式以查看详细的身份验证信息:

```bash  theme={null}
curl https://ai.megallm.io/v1/chat/completions \
  -H "Authorization: Bearer $MEGALLM_API_KEY" \
  -H "X-Debug-Auth: true" \
  -d '{"model": "gpt-4", "messages": [...]}'
```

<Info>
  **需要帮助?** 如果您遇到身份验证问题,请查看我们的[常见问题](/cn/home/faq#authentication)或联系支持。
</Info>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt