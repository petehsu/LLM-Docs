# Authentication

> MegaLLM uses API keys for authentication. This guide covers all authentication methods and best practices.

## Authentication Methods

### Bearer Token

The most common authentication method is using a Bearer token in the Authorization header:

```http  theme={null}
Authorization: Bearer YOUR_API_KEY
```

### API Key Header (Anthropic Format)

For Anthropic-compatible endpoints, you can also use the `x-api-key` header:

```http  theme={null}
x-api-key: YOUR_API_KEY
```

## Getting Your API Key

<Steps>
  <Step title="Dashboard Method">
    The recommended method for obtaining an API key is through the MegaLLM dashboard:

    1. Visit [megallm.io/dashboard](https://megallm.io/dashboard/overview)
    2. Navigate to API Keys section
    3. Click "Create New API Key"
    4. Copy the key (starts with `sk-mega-`) and store it securely
  </Step>

  <Step title="CLI Tool">
    If you have the MegaLLM CLI installed:

    ```bash  theme={null}
    npx megallm@latest
    ```

    Follow the interactive prompts to set up your API key.
  </Step>
</Steps>

## Security Best Practices

<Warning>
  **Never expose your tokens**: Always store tokens in environment variables or secure vaults, never in code.
</Warning>

### Environment Variables

<Tabs>
  <Tab title="Linux/Mac">
    ```bash  theme={null}
    # Add to ~/.bashrc or ~/.zshrc
    export MEGALLM_API_KEY="your_api_key_here"

    # Or use a .env file
    echo "MEGALLM_API_KEY=your_api_key_here" >> .env
    ```
  </Tab>

  <Tab title="Windows">
    ```powershell  theme={null}
    # Set environment variable
    [System.Environment]::SetEnvironmentVariable("MEGALLM_API_KEY", "your_api_key_here", "User")

    # Or use command prompt
    setx MEGALLM_API_KEY "your_api_key_here"
    ```
  </Tab>

  <Tab title="Docker">
    ```dockerfile  theme={null}
    # In Dockerfile
    ENV MEGALLM_API_KEY=${MEGALLM_API_KEY}

    # Or in docker-compose.yml
    environment:
      - MEGALLM_API_KEY=${MEGALLM_API_KEY}
    ```
  </Tab>
</Tabs>

## Using SDKs

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

### LangChain Integration

```python  theme={null}
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="https://ai.megallm.io/v1",
    api_key=os.getenv("MEGALLM_API_KEY"),
    model="gpt-4"
)

response = llm.invoke("Hello!")
```

## Troubleshooting

### Common Authentication Errors

| Error Code | Message      | Solution                                       |
| ---------- | ------------ | ---------------------------------------------- |
| 401        | Unauthorized | Check if your API key is valid and not expired |
| 403        | Forbidden    | Verify API key has required access             |
| 429        | Rate Limited | Wait and retry or contact support              |

### Debugging Authentication

Enable debug mode to see detailed authentication information:

```bash  theme={null}
curl https://ai.megallm.io/v1/chat/completions \
  -H "Authorization: Bearer $MEGALLM_API_KEY" \
  -H "X-Debug-Auth: true" \
  -d '{"model": "gpt-4", "messages": [...]}'
```

<Info>
  **Need Help?** Check our [FAQ](/faq#authentication) or contact support if you're experiencing authentication issues.
</Info>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt