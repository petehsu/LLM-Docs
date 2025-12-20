#### Guides

# Overview

The xAI API supports **agentic server-side tool calling** which enables the model to autonomously explore, search, and execute code to solve complex queries. Unlike traditional tool-calling where clients must handle each tool invocation themselves, xAI's agentic API manages the entire reasoning and tool-execution loop on the server side.

**xAI Python SDK Users**: Version 1.3.1 of the xai-sdk package is required to use the agentic tool calling API.

## Tools Pricing

Agentic requests are priced based on two components: **token usage** and **tool invocations**. Since the agent autonomously decides how many tools to call, costs scale with query complexity.

For more details on Tools pricing, please check out [the pricing page](/docs/models#tools-pricing).

## Agentic Tool Calling

When you provide server-side tools to a request, the xAI server orchestrates an autonomous reasoning loop rather than returning tool calls for you to execute. This creates a seamless experience where the model acts as an intelligent agent that researches, analyzes, and responds automatically.

Behind the scenes, the model follows an iterative reasoning process:

1. **Analyzes the query** and current context to determine what information is needed
2. **Decides what to do next**: Either make a tool call to gather more information or provide a final answer
3. **If making a tool call**: Selects the appropriate tool and parameters based on the reasoning
4. **Executes the tool** in real-time on the server and receives the results
5. **Processes the tool response** and integrates it with previous context and reasoning
6. **Repeats the loop**: Uses the new information to decide whether more research is needed or if a final answer can be provided
7. **Returns the final response** once the agent determines it has sufficient information to answer comprehensively

This autonomous orchestration enables complex multi-step research and analysis to happen automatically, with clients seeing the final result as well as optional real-time progress indicators like tool call notifications during streaming.

## Core Capabilities

* **[Web Search](/docs/guides/tools/search-tools)**: Real-time search across the internet with the ability to both search the web and browse web pages.
* **[X Search](/docs/guides/tools/search-tools)**: Semantic and keyword search across X posts, users, and threads.
* **[Code Execution](/docs/guides/tools/code-execution-tool)**: The model can write and execute Python code for calculations, data analysis, and complex computations.
* **[Image/Video Understanding](/docs/guides/tools/search-tools#parameter-enable_image_understanding-supported-by-web-search-and-x-search)**: Optional visual content understanding and analysis for search results encountered (video understanding is only available for X posts).
* **[Collections Search](/docs/guides/tools/collections-search-tool)**: The model can search through your uploaded knowledge bases and collections to retrieve relevant information.
* **[Remote MCP Tools](/docs/guides/tools/remote-mcp-tools)**: Connect to external MCP servers to access custom tools.
* **[Document Search](/docs/guides/files)**: Upload files and chat with them using intelligent document search. This tool is automatically enabled when you attach files to a chat message.

## Quick Start

We strongly recommend using the xAI Python SDK in streaming mode when using agentic tool calling. Doing so grants you the full feature set of the API, including the ability to get real-time observability and immediate feedback during potentially long-running requests.

Here is a quick start example of using the agentic tool calling API.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import web_search, x_search, code_execution

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    # All server-side tools active
    tools=[
        web_search(),
        x_search(),
        code_execution(),
    ],
)

# Feel free to change the query here to a question of your liking
chat.append(user("What are the latest updates from xAI?"))

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

You will be able to see output like:

```output
Thinking... (270 tokens)
Calling tool: x_user_search with arguments: {"query":"xAI official","count":1}
Thinking... (348 tokens)
Calling tool: x_user_search with arguments: {"query":"xAI","count":5}
Thinking... (410 tokens)
Calling tool: x_keyword_search with arguments: {"query":"from:xai","limit":10,"mode":"Latest"}
Thinking... (667 tokens)
Calling tool: web_search with arguments: {"query":"xAI latest updates site:x.ai","num_results":5}
Thinking... (850 tokens)
Calling tool: browse_page with arguments: {"url": "https://x.ai/news"}
Thinking... (1215 tokens)

Final Response:
### Latest Updates from xAI (as of October 12, 2025)

xAI primarily shares real-time updates via their official X (Twitter) account (@xai), with more formal announcements on their website (x.ai). Below is a summary of the most recent developments...

... full response omitted for brevity

Citations:
[
'https://x.com/i/user/1912644073896206336',
'https://x.com/i/user/1019237602585645057',
'https://x.com/i/status/1975607901571199086',
'https://x.com/i/status/1975608122845896765',
'https://x.com/i/status/1975608070245175592',
'https://x.com/i/user/1603826710016819209',
'https://x.com/i/status/1975608007250829383',
'https://status.x.ai/',
'https://x.com/i/user/150543432',
'https://x.com/i/status/1975608184711880816',
'https://x.com/i/status/1971245659660718431',
'https://x.com/i/status/1975608132530544900',
'https://x.com/i/user/1661523610111193088',
'https://x.com/i/status/1977121515587223679',
'https://x.ai/news/grok-4-fast',
'https://x.com/i/status/1975608017396867282',
'https://x.ai/',
'https://x.com/i/status/1975607953391755740',
'https://x.com/i/user/1875560944044273665',
'https://x.ai/news',
'https://docs.x.ai/docs/release-notes'
]


Usage:
completion_tokens: 1216
prompt_tokens: 29137
total_tokens: 31568
prompt_text_tokens: 29137
reasoning_tokens: 1215
cached_prompt_text_tokens: 22565
server_side_tools_used: SERVER_SIDE_TOOL_X_SEARCH
server_side_tools_used: SERVER_SIDE_TOOL_X_SEARCH
server_side_tools_used: SERVER_SIDE_TOOL_X_SEARCH
server_side_tools_used: SERVER_SIDE_TOOL_WEB_SEARCH
server_side_tools_used: SERVER_SIDE_TOOL_WEB_SEARCH

{'SERVER_SIDE_TOOL_X_SEARCH': 3, 'SERVER_SIDE_TOOL_WEB_SEARCH': 2}


Server Side Tool Calls:
[id: "call_51132959"
function {
  name: "x_user_search"
  arguments: "{\"query\":\"xAI official\",\"count\":1}"
}
, id: "call_00956753"
function {
  name: "x_user_search"
  arguments: "{\"query\":\"xAI\",\"count\":5}"
}
, id: "call_07881908"
function {
  name: "x_keyword_search"
  arguments: "{\"query\":\"from:xai\",\"limit\":10,\"mode\":\"Latest\"}"
}
, id: "call_43296276"
function {
  name: "web_search"
  arguments: "{\"query\":\"xAI latest updates site:x.ai\",\"num_results\":5}"
}
, id: "call_70310550"
function {
  name: "browse_page"
  arguments: "{\"url\": \"https://x.ai/news\"}"
}
]
```

## Understanding the Agentic Tool Calling Response

The agentic tool calling API provides rich observability into the autonomous research process. This section dives deep into the original code snippet above, covering key ways to effectively use the API and understand both real-time streaming responses and final results:

### Real-time server-side tool calls

When executing agentic requests using streaming, you can observe **every tool call decision** the model makes in real-time via the `tool_calls` attribute on the `chunk` object. This shows the exact parameters the agent chose for each tool invocation, giving you visibility into its search strategy. Occasionally the model may decide to invoke multiple tools in parallel during a single turn, in which case each entry in the list of `tool_calls` would represent one of those parallel tool calls; otherwise, only a single entry would be present in `tool_calls`.

**Note**: Only the tool call invocations themselves are shown - **server-side tool call outputs are not returned** in the API response. The agent uses these outputs internally to formulate its final response, but they are not exposed to the user.

When using the xAI Python SDK in streaming mode, it will automatically accumulate the `tool_calls` into the `response` object for you, letting you access a final list of all the server-side tool calls made during the agentic loop. This is demonstrated in the [section below](#server-side-tool-calls-vs-tool-usage).

```pythonWithoutSDK
for tool_call in chunk.tool_calls:
    print(f"\nCalling tool: {tool_call.function.name} with arguments: {tool_call.function.arguments}")
```

```output
Calling tool: x_user_search with arguments: {"query":"xAI official","count":1}
Calling tool: x_user_search with arguments: {"query":"xAI","count":5}
Calling tool: x_keyword_search with arguments: {"query":"from:xai","limit":10,"mode":"Latest"}
Calling tool: web_search with arguments: {"query":"xAI latest updates site:x.ai","num_results":5}
Calling tool: browse_page with arguments: {"url": "https://x.ai/news"}
```

### Citations

The `citations` attribute on the `response` object provides a comprehensive list of URLs for all sources the agent encountered during its search process. They are **only returned when the agentic request completes** and are **not available in real-time** during streaming. Citations are automatically collected from successful tool executions and provide full traceability of the agent's information sources.

Note that not every URL here will necessarily be relevant to the final answer, as the agent may examine a particular source and determine it is not sufficiently relevant to the user's original query.

```pythonWithoutSDK
response.citations
```

```output
[
'https://x.com/i/user/1912644073896206336',
'https://x.com/i/status/1975607901571199086',
'https://x.ai/news',
'https://docs.x.ai/docs/release-notes',
...
]
```

### Server-side Tool Calls vs Tool Usage

The API provides two related but distinct metrics for server-side tool executions:

`tool_calls` - All Attempted Calls

```pythonWithoutSDK
response.tool_calls
```

Returns a list of all **attempted** tool calls made during the agentic process. Each entry is a [ToolCall](https://github.com/xai-org/xai-proto/blob/736b835b0c0dd93698664732daad49f87a2fbc6f/proto/xai/api/v1/chat.proto#L474) object containing:

* `id`: Unique identifier for the tool call
* `function.name`: The name of the specific server-side tool called
* `function.arguments`: The parameters passed to the server-side tool

This includes **every tool call attempt**, even if some fail.

```output
[id: "call_51132959"
function {
  name: "x_user_search"
  arguments: "{\"query\":\"xAI official\",\"count\":1}"
}
, id: "call_07881908"
function {
  name: "x_keyword_search"
  arguments: "{\"query\":\"from:xai\",\"limit\":10,\"mode\":\"Latest\"}"
}
, id: "call_43296276"
function {
  name: "web_search"
  arguments: "{\"query\":\"xAI latest updates site:x.ai\",\"num_results\":5}"
}
]
```

`server_side_tool_usage` - Successful Calls (Billable)

```pythonWithoutSDK
response.server_side_tool_usage
```

Returns a map of successfully executed tools and their invocation counts. This represents only the tool calls that returned meaningful responses and is what determines your billing.

```output
{'SERVER_SIDE_TOOL_X_SEARCH': 3, 'SERVER_SIDE_TOOL_WEB_SEARCH': 2}
```

### Tool Call Function Names vs Usage Categories

The function names in `tool_calls` represent the precise/exact name of the tool invoked by the model, while the entries in `server_side_tool_usage` provide a more high-level categorization that aligns with the original tool passed in the `tools` array of the request.

**Function Name to Usage Category Mapping:**

| Usage Category | Function Name(s) |
|----------------|------------------|
| `SERVER_SIDE_TOOL_WEB_SEARCH` | `web_search`, `web_search_with_snippets`, `browse_page` |
| `SERVER_SIDE_TOOL_X_SEARCH` | `x_user_search`, `x_keyword_search`, `x_semantic_search`, `x_thread_fetch` |
| `SERVER_SIDE_TOOL_CODE_EXECUTION` | `code_execution` |
| `SERVER_SIDE_TOOL_VIEW_X_VIDEO` | `view_x_video` |
| `SERVER_SIDE_TOOL_VIEW_IMAGE` | `view_image` |
| `SERVER_SIDE_TOOL_COLLECTIONS_SEARCH` | `collections_search` |
| `SERVER_SIDE_TOOL_MCP` | `{server_label}.{tool_name}` if `server_label` provided, otherwise `{tool_name}` |

### When Tool Calls and Usage Differ

In most cases, `tool_calls` and `server_side_tool_usage` will show the same tools. However, they can differ when:

* **Failed tool executions**: The model attempts to browse a non-existent webpage, fetch a deleted X post, or encounters other execution errors
* **Invalid parameters**: Tool calls with malformed arguments that can't be processed
* **Network or service issues**: Temporary failures in the tool execution pipeline

The agentic system is robust enough to handle these failures gracefully, updating its trajectory and continuing with alternative approaches when needed.

**Billing Note**: Only successful tool executions (`server_side_tool_usage`) are billed. Failed attempts are not charged.

### Server-side Tool Call and Client-side Tool Call

Agentic tool calling supports mixing server-side tools and client-side tools, which enables more use cases when some private tools and data are needed during the agentic tool calling process.

To determine whether the received tool calls need to be executed by the client side, you can simply check the type of the tool call.

For xAI Python SDK users, you can use the provided `get_tool_call_type` function to get the type of the tool calls.

For a full guide into requests that mix server-side and client-side tools, please check out the [advanced usage](/docs/guides/tools/advanced-usage) page.

**xAI Python SDK Users**: Version 1.4.0 of the xai-sdk package is the minimum requirement to use the `get_tool_call_type` function.

```pythonXAI
# ...
response = chat.sample()

from xai_sdk.tools import get_tool_call_type

for tool_call in response.tool_calls:
    print(get_tool_call_type(tool_call))
```

The available tool call types are listed below:

| Tool call types | Description |
|---------------|-------------|
| `"client_side_tool"` | Indicates this tool call is a **client-side tool** call, and an invocation to this function on the client side is required and the tool output needs to be appended to the chat |
| `"web_search_tool"` | Indicates this tool call is a **web-search tool** call, which is performed by xAI server, **NO** action needed from the client side |
| `"x_search_tool"` | Indicates this tool call is an **x-search tool** call, which is performed by xAI server, **NO** action needed from the client side |
| `"code_execution_tool"` | Indicates this tool call is a **code-execution tool** call, which is performed by xAI server, **NO** action needed from the client side |
| `"collections_search_tool"` | Indicates this tool call is a **collections-search tool** call, which is performed by xAI server, **NO** action needed from the client side |
| `"mcp_tool"` | Indicates this tool call is an **MCP tool** call, which is performed by xAI server, **NO** action needed from the client side |

### Understanding Token Usage

Agentic requests have unique token usage patterns compared to standard chat completions. Here's how each token field in the usage object is calculated:

#### `completion_tokens`

Represents **only the final text output** of the model - the comprehensive answer returned to the user. This is typically much smaller than you might expect for such rich, research-driven responses, as the agent performs all its intermediate reasoning and tool orchestration internally.

#### `prompt_tokens`

Represents the **cumulative input tokens** across all inference requests made during the agentic process. Since agentic workflows involve multiple reasoning steps with tool calls, the model makes several inference requests throughout the research process. Each request includes the full conversation history up to that point, which grows as the agent progresses through its research.

While this can result in higher `prompt_tokens` counts, agentic requests benefit significantly from **prompt caching**. The majority of the prompt (the conversation prefix) remains unchanged between inference steps, allowing for efficient caching of the shared context. This means that while the total `prompt_tokens` may appear high, much of the computation is optimized through intelligent caching of the stable conversation history, leading to better cost efficiency overall.

#### `reasoning_tokens`

Represents the tokens used for the model's internal reasoning process during agentic workflows. This includes the computational work the agent performs to plan tool calls, analyze results, and formulate responses, but excludes the final output tokens.

#### `cached_prompt_text_tokens`

Indicates how many prompt tokens were served from cache rather than recomputed. This shows the efficiency gains from prompt caching - higher values indicate better cache utilization and lower costs.

#### `prompt_image_tokens`

Represents the tokens derived from visual content that the agent processes during the request. These tokens are produced when visual understanding is enabled and the agent views images (e.g., via web browsing) or analyzes video frames on X. They are counted separately from text tokens and reflect the cost of ingesting visual features alongside the textual context. If no images or videos are processed, this value will be zero.

#### `prompt_text_tokens` and `total_tokens`

`prompt_text_tokens` reflects the actual text tokens in prompts (excluding any special tokens), while `total_tokens` is the sum of all token types used in the request.

## Synchronous Agentic Requests (Non-streaming)

Although not typically recommended, for simpler use cases or when you want to wait for the complete agentic workflow to finish before processing the response, you can use synchronous requests:

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import code_execution, web_search, x_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[
        web_search(),
        x_search(),
        code_execution(),
    ],
)

chat.append(user("What is the latest update from xAI?"))

# Get the final response in one go once it's ready
response = chat.sample()

print("\\n\\nFinal Response:")
print(response.content)

# Access the citations of the final response
print("\\n\\nCitations:")
print(response.citations)

# Access the usage details from the entire search process
print("\\n\\nUsage:")
print(response.usage)
print(response.server_side_tool_usage)

# Access the server side tool calls of the final response
print("\\n\\nServer Side Tool Calls:")
print(response.tool_calls)
```

Synchronous requests will wait for the entire agentic process to complete before returning the response. This is simpler for basic use cases but provides less visibility into the intermediate steps compared to streaming.

## Using Tools with OpenAI Responses API

We also support using the OpenAI Responses API in both streaming and non-streaming modes.

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
            "content": "what is the latest update from xAI?",
        },
    ],
    tools=[
        {
            "type": "web_search",
        },
        {
            "type": "x_search",
        },
    ],
)

print(response)
```

```pythonWithoutSDK
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
            "content": "what is the latest update from xAI?"
        }
    ],
    "tools": [
        {
            "type": "web_search"
        },
        {
            "type": "x_search"
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
      "content": "what is the latest update from xAI?"
    }
  ],
  "tools": [
    {
      "type": "web_search"
    },
    {
      "type": "x_search"
    }
  ]
}'
```

### Identifying the Client-side Tool Call

A critical step in mixing server-side tools and client-side tools is to identify whether a returned tool call is a client-side tool that needs to be executed locally on the client side.

Similar to the way in xAI Python SDK, you can identify the client-side tool call by checking the `type` of the output entries (`response.output[].type`) in the response of OpenAI Responses API.

| Types | Description |
|---------------|-------------|
| `"function_call"` | Indicates this tool call is a **client-side tool** call, and an invocation to this function on the client side is required and the tool output needs to be appended to the chat |
| `"web_search_call"` | Indicates this tool call is a **web-search tool** call, which is performed by xAI server, **NO** action needed from the client side |
| `"x_search_call"` | Indicates this tool call is an **x-search tool** call, which is performed by xAI server, **NO** action needed from the client side |
| `"code_interpreter_call"` | Indicates this tool call is a **code-execution tool** call, which is performed by xAI server, **NO** action needed from the client side |
| `"file_search_call"` | Indicates this tool call is a **collections-search tool** call, which is performed by xAI server, **NO** action needed from the client side |
| `"mcp_call"` | Indicates this tool call is an **MCP tool** call, which is performed by xAI server, **NO** action needed from the client side |

## Agentic Tool Calling Requirements and Limitations

### Model Compatibility

* **Supported Models**: `grok-4`, `grok-4-fast`, `grok-4-fast-non-reasoning`, `grok-4-1-fast`, `grok-4-1-fast-non-reasoning`
* **Strongly Recommended**: `grok-4-1-fast` - specifically trained to excel at agentic tool calling

### Request Constraints

* **No batch requests**: `n > 1` not supported
* **No response format**: Structured output not yet available with agentic tool calling
* **Limited sampling params**: Only `temperature` and `top_p` are respected

**Note**: These constraints may be relaxed in future releases based on user feedback.

## FAQ and Troubleshooting

### I'm seeing empty or incorrect content when using agentic tool calling with the xAI Python SDK

Please make sure to upgrade to the latest version of the xAI SDK. Agentic tool calling requires version `1.3.1` or above.


