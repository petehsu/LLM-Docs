#### Guides

# Search Tools

Agentic search represents one of the most compelling applications of agentic tool calling, with `grok-4-1-fast` specifically trained to excel in this domain. Leveraging its speed and reasoning capabilities, the model iteratively calls search tools—analyzing responses and making follow-up queries as needed—to seamlessly navigate web pages and X posts, uncovering difficult-to-find information or insights that would otherwise require extensive human analysis.

**xAI Python SDK Users**: Version 1.3.1 of the xai-sdk package is required to use the agentic tool calling API.

## Available Search Tools

You can use the following server-side search tools in your request:

* **Web Search** - allows the agent to search the web and browse pages
* **X Search** - allows the agent to perform keyword search, semantic search, user search, and thread fetch on X

You can customize which tools are enabled in a given request by listing the needed tools in the `tools` parameter in the request.

| Tool | xAI SDK | OpenAI Responses API |
|------|---------|----------------------|
| Web Search | `web_search` | `web_search` |
| X Search | `x_search` | `x_search` |

## Retrieving Citations

Citations provide traceability for sources used during agentic search. Access them from the response object:

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import web_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[web_search()],
)

chat.append(user("What is xAI?"))

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

print("\\n\\nCitations:")
print(response.citations)
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
            "content": "What is xAI?",
        },
    ],
    tools=[
        {
            "type": "web_search",
        },
    ],
)

# Access the response
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
            "content": "What is xAI?"
        }
    ],
    "tools": [
        {
            "type": "web_search",
        }
    ]
}
response = requests.post(url, headers=headers, json=payload)

# Access the citations of the final response
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
      "content": "What is xAI?"
    }
  ],
  "tools": [
    {
      "type": "web_search"
    }
  ]
}'
```

As mentioned in the [overview page](/docs/guides/tools/overview#citations), the citations array contains the URLs of all sources the agent encountered during its search process, meaning that not every URL here will necessarily be relevant to the final answer, as the agent may examine a particular source and determine it is not sufficiently relevant to the user's original query.

For complete details on citations, including when they're available and usage notes, see the [overview page](/docs/guides/tools/overview#citations).

## Applying Search Filters to Control Agentic Search

Each search tool supports a set of optional search parameters to help you narrow down the search space and limit the sources/information the agent is exposed to during its search process.

| Tool | Supported Filter Parameters |
|------|-----------------------------|
| Web Search | `allowed_domains`, `excluded_domains`, `enable_image_understanding` |
| X Search | `allowed_x_handles`, `excluded_x_handles`, `from_date`, `to_date`, `enable_image_understanding`, `enable_video_understanding`|

### Web Search Parameters

##### Only Search in Specific Domains

Use `allowed_domains` to make the web search **only** perform the search and web browsing on web pages that fall within the specified domains.

`allowed_domains` can include a maximum of five domains.

`allowed_domains` cannot be set together with `excluded_domains` in the same request.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import web_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[
        web_search(allowed_domains=["wikipedia.org"]),
    ],
)

chat.append(user("What is xAI?"))

# stream or sample the response...
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
            "content": "What is xAI?",
        },
    ],
    tools=[
        {
            "type": "web_search",
            "filters": {"allowed_domains": ["wikipedia.org"]},
        },
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
            "content": "What is xAI?"
        }
    ],
    "tools": [
        {
            "type": "web_search",
            "filters": {"allowed_domains": ["wikipedia.org"]},
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
      "content": "What is xAI?"
    }
  ],
  "tools": [
    {
      "type": "web_search",
      "filters": {"allowed_domains": ["wikipedia.org"]}
    }
  ]
}'
```

##### Exclude Specific Domains

Use `excluded_domains` to prevent the model from including the specified domains in any web search tool invocations and from browsing any pages on those domains.

`excluded_domains` can include a maximum of five domains.

`excluded_domains` cannot be set together with `allowed_domains` in the same request.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import web_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[
        web_search(excluded_domains=["wikipedia.org"]),
    ],
)

chat.append(user("What is xAI?"))

# stream or sample the response...
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
            "content": "What is xAI?",
        },
    ],
    tools=[
        {
            "type": "web_search",
            "filters": {"excluded_domains": ["wikipedia.org"]},
        },
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
            "content": "What is xAI?"
        }
    ],
    "tools": [
        {
            "type": "web_search",
            "filters": {"excluded_domains": ["wikipedia.org"]},
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
      "content": "What is xAI?"
    }
  ],
  "tools": [
    {
      "type": "web_search",
      "filters": {"excluded_domains": ["wikipedia.org"]}
    }
  ]
}'
```

##### Enable Image Understanding

Setting `enable_image_understanding` to true equips the agent with access to the `view_image` tool, allowing it to invoke this tool on any image URLs encountered during the search process. The model can then interpret and analyze image contents, incorporating this visual information into its context to potentially influence the trajectory of follow-up tool calls.

When the model invokes this tool, you will see it as an entry in `chunk.tool_calls` and `response.tool_calls` with the `image_url` as a parameter. Additionally, `SERVER_SIDE_TOOL_VIEW_IMAGE` will appear in `response.server_side_tool_usage` along with the number of times it was called when using the xAI Python SDK.

Note that enabling this feature increases token usage, as images are processed and represented as image tokens in the model's context.

Enabling this parameter for Web Search will also enable the image understanding for X Search tool if it's also included in the request.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import web_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[
        web_search(enable_image_understanding=True),
    ],
)

chat.append(user("What is included in the image in xAI's official website?"))

# stream or sample the response...
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
            "content": "What is included in the image in xAI's official website?",
        },
    ],
    tools=[
        {
            "type": "web_search",
            "enable_image_understanding": True,
        },
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
            "content": "What is included in the image in xAI's official website?"
        }
    ],
    "tools": [
        {
            "type": "web_search",
            "enable_image_understanding": True,
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
      "content": "What is included in the image in xAI's official website?"
    }
  ],
  "tools": [
    {
      "type": "web_search",
      "enable_image_understanding": true
    }
  ]
}'
```

### X Search Parameters

##### Only Consider X Posts from Specific Handles

Use `allowed_x_handles` to consider X posts only from a given list of X handles. The maximum number of handles you can include is 10.

`allowed_x_handles` cannot be set together with `excluded_x_handles` in the same request.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import x_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[
        x_search(allowed_x_handles=["elonmusk"]),
    ],
)

chat.append(user("What is the current status of xAI?"))

# stream or sample the response...
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
            "content": "What is the current status of xAI?",
        },
    ],
    tools=[
        {
            "type": "x_search",
            "allowed_x_handles": ["elonmusk"],
        },
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
            "content": "What is the current status of xAI?"
        }
    ],
    "tools": [
        {
            "type": "x_search",
            "allowed_x_handles": ["elonmusk"],
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
      "content": "What is the current status of xAI?"
    }
  ],
  "tools": [
    {
      "type": "x_search",
      "allowed_x_handles": ["elonmusk"]
    }
  ]
}'
```

##### Exclude X Posts from Specific Handles

Use `excluded_x_handles` to prevent the model from including X posts from the specified handles in any X search tool invocations. The maximum number of handles you can exclude is 10.

`excluded_x_handles` cannot be set together with `allowed_x_handles` in the same request.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import x_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[
        x_search(excluded_x_handles=["elonmusk"]),
    ],
)

chat.append(user("What is the current status of xAI?"))

# stream or sample the response...
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
            "content": "What is the current status of xAI?",
        },
    ],
    tools=[
        {
            "type": "x_search",
            "excluded_x_handles": ["elonmusk"],
        },
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
            "content": "What is the current status of xAI?"
        }
    ],
    "tools": [
        {
            "type": "x_search",
            "excluded_x_handles": ["elonmusk"],
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
      "content": "What is the current status of xAI?"
    }
  ],
  "tools": [
    {
      "type": "x_search",
      "excluded_x_handles": ["elonmusk"]
    }
  ]
}'
```

##### Date Range

You can restrict the date range of search data used by specifying `from_date` and `to_date`. This limits the data to the period from
`from_date` to `to_date`, including both dates.

Both fields need to be in ISO8601 format, e.g., "YYYY-MM-DD". If you're using the xAI Python SDK, the
`from_date` and `to_date` fields can be passed as `datetime.datetime` objects.

The fields can also be used independently. With only `from_date` specified, the data used will be from the
`from_date` to today, and with only `to_date` specified, the data used will be all data until the `to_date`.

```pythonXAI
import os
from datetime import datetime

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import x_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[
        x_search(
            from_date=datetime(2025, 10, 1),
            to_date=datetime(2025, 10, 10),
        ),
    ],
)

chat.append(user("What is the current status of xAI?"))

# stream or sample the response...
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
            "content": "What is the current status of xAI?",
        },
    ],
    tools=[
        {
            "type": "x_search",
            "from_date": "2025-10-01",
            "to_date": "2025-10-10",
        },
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
            "content": "What is the current status of xAI?"
        }
    ],
    "tools": [
        {
            "type": "x_search",
            "from_date": "2025-10-01",
            "to_date": "2025-10-10",
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
      "content": "What is the current status of xAI?"
    }
  ],
  "tools": [
    {
      "type": "x_search",
      "from_date": "2025-10-01",
      "to_date": "2025-10-10"
    }
  ]
}'
```

##### Enable Image Understanding

Setting `enable_image_understanding` to true equips the agent with access to the `view_image` tool, allowing it to invoke this tool on any image URLs encountered during the search process. The model can then interpret and analyze image contents, incorporating this visual information into its context to potentially influence the trajectory of follow-up tool calls.

When the model invokes this tool, you will see it as an entry in `chunk.tool_calls` and `response.tool_calls` with the `image_url` as a parameter. Additionally, `SERVER_SIDE_TOOL_VIEW_IMAGE` will appear in `response.server_side_tool_usage` along with the number of times it was called when using the xAI Python SDK.

Note that enabling this feature increases token usage, as images are processed and represented as image tokens in the model's context.

Enabling this parameter for X Search will also enable the image understanding for Web Search tool if it's also included in the request.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import x_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[
        x_search(enable_image_understanding=True),
    ],
)

chat.append(user("What images are being shared in recent xAI posts?"))

# stream or sample the response...
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
            "content": "What images are being shared in recent xAI posts?",
        },
    ],
    tools=[
        {
            "type": "x_search",
            "enable_image_understanding": True,
        },
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
            "content": "What images are being shared in recent xAI posts?"
        }
    ],
    "tools": [
        {
            "type": "x_search",
            "enable_image_understanding": True,
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
      "content": "What images are being shared in recent xAI posts?"
    }
  ],
  "tools": [
    {
      "type": "x_search",
      "enable_image_understanding": true
    }
  ]
}'
```

##### Enable Video Understanding

Setting `enable_video_understanding` to true equips the agent with access to the `view_x_video` tool, allowing it to invoke this tool on any video URLs encountered in X posts during the search process. The model can then analyze video content, incorporating this information into its context to potentially influence the trajectory of follow-up tool calls.

When the model invokes this tool, you will see it as an entry in `chunk.tool_calls` and `response.tool_calls` with the `video_url` as a parameter. Additionally, `SERVER_SIDE_TOOL_VIEW_X_VIDEO` will appear in `response.server_side_tool_usage` along with the number of times it was called when using the xAI Python SDK.

Note that enabling this feature increases token usage, as video content is processed and represented as tokens in the model's context.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import x_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[
        x_search(enable_video_understanding=True),
    ],
)

chat.append(user("What is the latest video talking about from the xAI official X account?"))

# stream or sample the response...
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
            "content": "What is the latest video talking about from the xAI official X account?",
        },
    ],
    tools=[
        {
            "type": "x_search",
            "enable_video_understanding": True,
        },
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
            "content": "What is the latest video talking about from the xAI official X account?"
        }
    ],
    "tools": [
        {
            "type": "x_search",
            "enable_video_understanding": True,
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
      "content": "What is the latest video talking about from the xAI official X account?"
    }
  ],
  "tools": [
    {
      "type": "x_search",
      "enable_video_understanding": true
    }
  ]
}'
```


