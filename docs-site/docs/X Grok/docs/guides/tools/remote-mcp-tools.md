#### Guides

# Remote MCP Tools

Remote MCP Tools allow Grok to connect to external MCP (Model Context Protocol) servers, extending its capabilities with custom tools from third parties or your own implementations. Simply specify a server URL and optional configuration - xAI manages the MCP server connection and interaction on your behalf.

**xAI Python SDK Users**: Version 1.4.0 of the xai-sdk package is required to use Remote MCP Tools.

## SDK Support

Remote MCP tools are supported in the xAI native SDK and the OpenAI compatible Responses API.

The `require_approval` and `connector_id` parameters in the OpenAI Responses API are not currently supported.

## Configuration

To use remote MCP tools, you need to configure the connection to your MCP server in the tools array of your request.

| Parameter | Required | Description |
|-----------|-------------------|-------------|
| `server_url` | Yes | The URL of the MCP server to connect to. Only Streaming HTTP and SSE transports are supported. |
| `server_label` | No | A label to identify the server (used for tool call prefixing) |
| `server_description` | No | A description of what the server provides |
| `allowed_tool_names` | No | List of specific tool names to allow (empty allows all) |
| `authorization` | No | A token that will be set in the Authorization header on requests to the MCP server |
| `extra_headers` | No | Additional headers to include in requests |

### Basic MCP Tool Usage

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import mcp

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",
    tools=[
        mcp(server_url="https://mcp.deepwiki.com/mcp"),
    ],
)

chat.append(user("What can you do with https://github.com/xai-org/xai-sdk-python?"))

is_thinking = True
for response, chunk in chat.stream():
    # View the server-side tool calls as they are being made in real-time
    for tool_call in chunk.tool_calls:
        print(f"\\nCalling tool: {tool_call.function.name} with arguments: {tool_call.function.arguments}")
    if response.usage.reasoning_tokens and is_thinking:
        print(f"\\rThinking... ({response.usage.reasoning_tokens} tokens)", end="", flush=True)
    if chunk.content and is_thinking:
        print("\\n\\nFinal Response:")
        is_thinking = False
    if chunk.content and not is_thinking:
        print(chunk.content, end="", flush=True)

print("\\n\\nUsage:")
print(response.usage)
print(response.server_side_tool_usage)
print("\\n\\nServer Side Tool Calls:")
print(response.tool_calls)
```

```pythonOpenAISDK
import os
from openai import OpenAI

api_key = os.getenv("XAI_API_KEY")
client = OpenAI(
    api_key=api_key,
    base_url="https://api.x.ai/v1",
)

response = client.responses.create(
    model="grok-4-1-fast",
    input=[
        {
            "role": "user",
            "content": "What can you do with https://github.com/xai-org/xai-sdk-python?",
        },
    ],
    tools=[
        {
            "type": "mcp",
            "server_url": "https://mcp.deepwiki.com/mcp",
            "server_label": "deepwiki",
        }
    ],
)

print(response)
```

```pythonRequests
import os
import requests

url = "https://api.x.ai/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"
}
payload = {
    "model": "grok-4-1-fast",
    "input": [
        {
            "role": "user",
            "content": "What can you do with https://github.com/xai-org/xai-sdk-python?"
        }
    ],
    "tools": [
        {
            "type": "mcp",
            "server_url": "https://mcp.deepwiki.com/mcp",
            "server_label": "deepwiki",
        }
    ]
}
response = requests.post(url, headers=headers, json=payload)
print(response.json())
```

```bash
curl https://api.x.ai/v1/responses \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $XAI_API_KEY" \\
  -d '{
  "model": "grok-4-1-fast",
  "input": [
    {
      "role": "user",
      "content": "What can you do with https://github.com/xai-org/xai-sdk-python?"
    }
  ],
  "tools": [
    {
        "type": "mcp",
        "server_url": "https://mcp.deepwiki.com/mcp",
        "server_label": "deepwiki"
    }
  ]
}'
```

## Tool Enablement and Access Control

When you configure a Remote MCP Tool without specifying `allowed_tool_names`, all tool definitions exposed by the MCP server are automatically injected into the model's context. This means the model gains access to every tool that the MCP server provides, allowing it to use any of them during the conversation.

For example, if an MCP server exposes 10 different tools and you don't specify `allowed_tool_names`, all 10 tool definitions will be available to the model. The model can then choose to call any of these tools based on the user's request and the tool descriptions.

Use the `allowed_tool_names` parameter to selectively enable only specific tools from an MCP server. This can give you several key benefits:

* **Better Performance**: Reduce context overhead by limiting tool definitions the model needs to consider
* **Reduced Risk**: For example, restrict access to tools that only perform read-only operations to prevent the model from modifying data

```pythonXAI
# Enable only specific tools from a server with many available tools
mcp(
    server_url="https://comprehensive-tools.example.com/mcp",
    allowed_tool_names=["search_database", "format_data"]
)
```

Instead of giving the model access to every tool the server offers, this approach keeps Grok focused and efficient while ensuring it has exactly the capabilities it needs.

## Multi-Server Support

Enable multiple MCP servers simultaneously to create a rich ecosystem of specialized tools:

```pythonXAI
chat = client.chat.create(
    model="grok-4-1-fast",
    tools=[
        mcp(server_url="https://mcp.deepwiki.com/mcp", server_label="deepwiki"),
        mcp(server_url="https://your-custom-tools.com/mcp", server_label="custom"),
        mcp(server_url="https://api.example.com/tools", server_label="api-tools"),
    ],
)
```

Each server can provide different capabilities - documentation tools, API integrations, custom business logic, or specialized data processing - all accessible within a single conversation.

## Best Practices

* **Provide clear server metadata**: Use descriptive `server_label` and `server_description` when configuring multiple MCP servers to help the model understand each server's purpose and select the right tools
* **Filter tools appropriately**: Use `allowed_tool_names` to restrict access to only necessary tools, especially when servers have many tools since the model must keep all available tool definitions in context
* **Use secure connections**: Always use HTTPS URLs and implement proper authentication mechanisms on your MCP server
* **Provide Examples**: While the model can generally figure out what tools to use based on the tool descriptions and the user request it may help to provide examples in the prompt


