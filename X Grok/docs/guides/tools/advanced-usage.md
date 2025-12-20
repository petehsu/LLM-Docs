#### Guides

# Advanced Usage

In this section, we explore advanced usage patterns for agentic tool calling, including:

* **[Use Client-side Tools](#mixing-server-side-and-client-side-tools)** - Combine server-side agentic tools with your own client-side tools for specialized functionality that requires local execution.
* **[Multi-turn Conversations](#multi-turn-conversations-with-preservation-of-agentic-state)** - Maintain context across multiple turns in agentic tool-enabled conversations, allowing the model to build upon previous research and tool results for more complex, iterative problem-solving
* **[Requests with Multiple Active Tools](#tool-combinations)** - Send requests with multiple server-side tools active simultaneously, enabling comprehensive analysis with web search, X search, and code execution tools working together
* **[Image Integration](#using-images-in-the-context)** - Include images in your tool-enabled conversations for visual analysis and context-aware searches

**xAI Python SDK Users**: Version **1.4.0** of the xai-sdk package is required to use some advanced capabilities in the agentic tool calling API, for example, the client-side tools.

&#x20;Advanced tool usage patterns are not yet supported in the Vercel AI SDK. Please use the xAI SDK or OpenAI SDK for this functionality.

## Mixing Server-Side and Client-Side Tools

You can combine server-side agentic tools (like web search and code execution) with custom client-side tools to create powerful hybrid workflows. This approach lets you leverage the model's reasoning capabilities with server-side tools while adding specialized functionality that runs locally in your application.

### How It Works

The key difference when mixing server-side and client-side tools is that **server-side tools are executed automatically by xAI**, while **client-side tools require developer intervention**:

1. Define your client-side tools using [standard function calling patterns](/docs/guides/function-calling)
2. Include both server-side and client-side tools in your request
3. **xAI automatically executes any server-side tools** the model decides to use (web search, code execution, etc.)
4. **When the model calls client-side tools, execution pauses** - xAI returns the tool calls to you instead of executing them
5. **Detect and execute client-side tool calls yourself**, then append the results back to continue the conversation
6. **Repeat this process** until the model generates a final response with no additional client-side tool calls

### Practical Example

Given a local client-side function `get_weather` to get the weather of a specified city, the model can use this client-side tool and the web-search tool to determine the weather in the base city of the 2025 NBA champion.

### Using the xAI SDK

You can determine whether a tool call is a client-side tool call by using `xai_sdk.tools.get_tool_call_type` against a tool call from the `response.tool_calls` list.
For more details, check [this](/docs/guides/tools/overview#server-side-tool-call-and-client-side-tool-call) out.

1. Import the dependencies, and define the client-side tool.

   ```pythonXAI
   import os
   import json

   from xai_sdk import Client
   from xai_sdk.chat import user, tool, tool_result
   from xai_sdk.tools import web_search, get_tool_call_type

   client = Client(api_key=os.getenv("XAI_API_KEY"))

   # Define client-side tool
   def get_weather(city: str) -> str:
       """Get the weather for a given city."""
       # In a real app, this would query your database
       return f"The weather in {city} is sunny."

   # Tools array with both server-side and client-side tools
   tools = [
       web_search(),
       tool(
           name="get_weather",
           description="Get the weather for a given city.",
           parameters={
               "type": "object",
               "properties": {
                   "city": {
                       "type": "string",
                       "description": "The name of the city",
                   }
               },
               "required": ["city"]
           },
       ),
   ]

   model = "grok-4-1-fast"
   ```

2. Perform the tool loop with conversation continuation:
   * You can either use `previous_response_id` to continue the conversation from the last response.

     ```pythonXAI
     # Create chat with both server-side and client-side tools
     chat = client.chat.create(
         model=model,
         tools=tools,
         store_messages=True,
     )
     chat.append(
         user(
             "What is the weather in the base city of the team that won the "
             "2025 NBA championship?"
         )
     )

     while True:
         client_side_tool_calls = []
         for response, chunk in chat.stream():
             for tool_call in chunk.tool_calls:
                 if get_tool_call_type(tool_call) == "client_side_tool":
                     client_side_tool_calls.append(tool_call)
                 else:
                     print(
                         f"Server-side tool call: {tool_call.function.name} "
                         f"with arguments: {tool_call.function.arguments}"
                     )

         if not client_side_tool_calls:
             break

         chat = client.chat.create(
             model=model,
             tools=tools,
             store_messages=True,
             previous_response_id=response.id,
         )

         for tool_call in client_side_tool_calls:
             print(
                 f"Client-side tool call: {tool_call.function.name} "
                 f"with arguments: {tool_call.function.arguments}"
             )
             args = json.loads(tool_call.function.arguments)
             result = get_weather(args["city"])
             chat.append(tool_result(result))

     print(f"Final response: {response.content}")
     ```

   * Alternatively, you can use the encrypted content to continue the conversation.

     ```pythonXAI
     # Create chat with both server-side and client-side tools
     chat = client.chat.create(
         model=model,
         tools=tools,
         use_encrypted_content=True,
     )
     chat.append(
         user(
             "What is the weather in the base city of the team that won the "
             "2025 NBA championship?"
         )
     )

     while True:
         client_side_tool_calls = []
         for response, chunk in chat.stream():
             for tool_call in chunk.tool_calls:
                 if get_tool_call_type(tool_call) == "client_side_tool":
                     client_side_tool_calls.append(tool_call)
                 else:
                     print(
                         f"Server-side tool call: {tool_call.function.name} "
                         f"with arguments: {tool_call.function.arguments}"
                     )

         chat.append(response)

         if not client_side_tool_calls:
             break

         for tool_call in client_side_tool_calls:
             print(
                 f"Client-side tool call: {tool_call.function.name} "
                 f"with arguments: {tool_call.function.arguments}"
             )
             args = json.loads(tool_call.function.arguments)
             result = get_weather(args["city"])
             chat.append(tool_result(result))

     print(f"Final response: {response.content}")
     ```

You will see an output similar to the following:

```
Server-side tool call: web_search with arguments: {"query":"Who won the 2025 NBA championship?","num_results":5}
Client-side tool call: get_weather with arguments: {"city":"Oklahoma City"}
Final response: The Oklahoma City Thunder won the 2025 NBA championship. The current weather in Oklahoma City is sunny.
```

### Using the OpenAI SDK

You can determine whether a tool call is a client-side tool call by checking the `type` field of an output entry from the `response.output` list.
For more details, please check [this](/docs/guides/tools/overview#identifying-the-client-side-tool-call) out.

1. Import the dependencies, and define the client-side tool.

   ```pythonOpenAISDK
   import os
   import json

   from openai import OpenAI

   client = OpenAI(
       api_key=os.getenv("XAI_API_KEY"),
       base_url="https://api.x.ai/v1",
   )

   # Define client-side tool
   def get_weather(city: str) -> str:
       """Get the weather for a given city."""
       # In a real app, this would query your database
       return f"The weather in {city} is sunny."

   model = "grok-4-1-fast"
   tools = [
       {
           "type": "function",
           "name": "get_weather",
           "description": "Get the weather for a given city.",
           "parameters": {
               "type": "object",
               "properties": {
                   "city": {
                       "type": "string",
                       "description": "The name of the city",
                   },
               },
               "required": ["city"],
           },
       },
       {
           "type": "web_search",
       },
   ]
   ```

2. Perform the tool loop:

   * You can either use `previous_response_id`.

     ```pythonOpenAISDK
     response = client.responses.create(
         model=model,
         input=(
             "What is the weather in the base city of the team that won the "
             "2025 NBA championship?"
         ),
         tools=tools,
     )

     while True:
         tool_outputs = []
         for item in response.output:
             if item.type == "function_call":
                 print(f"Client-side tool call: {item.name} with arguments: {item.arguments}")
                 args = json.loads(item.arguments)
                 weather = get_weather(args["city"])
                 tool_outputs.append(
                     {
                         "type": "function_call_output",
                         "call_id": item.call_id,
                         "output": weather,
                     }
                 )
             elif item.type in (
                 "web_search_call",
                 "x_search_call", 
                 "code_interpreter_call",
                 "file_search_call",
                 "mcp_call"
             ):
                 print(
                     f"Server-side tool call: {item.name} with arguments: {item.arguments}"
                 )

         if not tool_outputs:
             break

         response = client.responses.create(
             model=model,
             tools=tools,
             input=tool_outputs,
             previous_response_id=response.id,
         )

     print("Final response:", response.output[-1].content[0].text)
     ```

   * or using the encrypted content

     ```pythonOpenAISDK
     input_list = [
         {
             "role": "user",
             "content": (
                 "What is the weather in the base city of the team that won the "
                 "2025 NBA championship?"
             ),
         }
     ]

     response = client.responses.create(
         model=model,
         input=input_list,
         tools=tools,
         include=["reasoning.encrypted_content"],
     )

     while True:
         input_list.extend(response.output)
         tool_outputs = []
         for item in response.output:
             if item.type == "function_call":
                 print(f"Client-side tool call: {item.name} with arguments: {item.arguments}")
                 args = json.loads(item.arguments)
                 weather = get_weather(args["city"])
                 tool_outputs.append(
                     {
                         "type": "function_call_output",
                         "call_id": item.call_id,
                         "output": weather,
                     }
                 )
             elif item.type in (
                 "web_search_call",
                 "x_search_call", 
                 "code_interpreter_call",
                 "file_search_call",
                 "mcp_call"
             ):
                 print(
                     f"Server-side tool call: {item.name} with arguments: {item.arguments}"
                 )

         if not tool_outputs:
             break

         input_list.extend(tool_outputs)
         response = client.responses.create(
             model=model,
             input=input_list,
             tools=tools,
             include=["reasoning.encrypted_content"],
         )

     print("Final response:", response.output[-1].content[0].text)
     ```

## Multi-turn Conversations with Preservation of Agentic State

When using agentic tools, you may want to have multi-turn conversations where follow-up prompts maintain all agentic state, including the full history of reasoning, tool calls, and tool responses. This is possible using the stateful API, which provides seamless integration for preserving conversation context across multiple interactions. There are two options to achieve this outlined below.

### Store the Conversation History Remotely

You can choose to store the conversation history remotely on the xAI server, and every time you want to continue the conversation, you can pick up from the last response where you want to resume from.

There are only 2 extra steps:

1. Add the parameter `store_messages=True` when making the first agentic request. This tells the service to store the entire conversation history on xAI servers, including the model's reasoning, server-side tool calls, and corresponding responses.
2. Pass `previous_response_id=response.id` when creating the follow-up conversation, where `response` is the response returned by `chat.sample()` or `chat.stream()` from the conversation that you wish to continue.

Note that the follow-up conversation does not need to use the same tools, model parameters, or any other configuration as the initial conversation—it will still be fully hydrated with the complete agentic state from the previous interaction.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import web_search, x_search
client = Client(api_key=os.getenv("XAI_API_KEY"))
# First turn.
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[web_search(), x_search()],
    store_messages=True,
)
chat.append(user("What is xAI?"))
print("\\n\\n##### First turn #####\\n")
for response, chunk in chat.stream():
    print(chunk.content, end="", flush=True)
print("\\n\\nUsage for first turn:", response.server_side_tool_usage)

# Second turn.
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[web_search(), x_search()],
    # pass the response id of the first turn to continue the conversation
    previous_response_id=response.id,
)

chat.append(user("What is its latest mission?"))
print("\\n\\n##### Second turn #####\\n")
for response, chunk in chat.stream():
    print(chunk.content, end="", flush=True)
print("\\n\\nUsage for second turn:", response.server_side_tool_usage)
```

### Append the Encrypted Agentic Tool Calling States

There is another option for the ZDR (Zero Data Retention) users, or the users who don't want to use the above option, that is to let the xAI server also return
the encrypted reasoning and the encrypted tool output besides the final content to the client side, and those encrypted contents can be included as a part of the context
in the next turn conversation.

Here are the extra steps you need to take for this option:

1. Add the parameter `use_encrypted_content=True` when making the first agentic request. This tells the service to return the entire conversation history to the client side, including the model's reasoning (encrypted), server-side tool calls, and corresponding responses (encrypted).
2. Append the response to the conversation you wish to continue before making the call to `chat.sample()` or `chat.stream()`.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import web_search, x_search
client = Client(api_key=os.getenv("XAI_API_KEY"))
# First turn.
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[web_search(), x_search()],
    use_encrypted_content=True,
)
chat.append(user("What is xAI?"))
print("\\n\\n##### First turn #####\\n")
for response, chunk in chat.stream():
    print(chunk.content, end="", flush=True)
print("\\n\\nUsage for first turn:", response.server_side_tool_usage)

chat.append(response)

print("\\n\\n##### Second turn #####\\n")
chat.append(user("What is its latest mission?"))
# Second turn.
for response, chunk in chat.stream():
    print(chunk.content, end="", flush=True)
print("\\n\\nUsage for second turn:", response.server_side_tool_usage)
```

For more details about stateful responses, please check out [this guide](/docs/guides/responses-api).

## Tool Combinations

Equipping your requests with multiple tools is straightforward—simply include the tools you want to activate in the `tools` array of your request. The model will intelligently orchestrate between them based on the task at hand.

### Suggested Tool Combinations

Here are some common patterns for combining tools, depending on your use case:

| If you're trying to... | Consider activating... | Because... |
|------------------------|----------------------|------------|
| **Research & analyze data** | Web Search + Code Execution | Web search gathers information, code execution analyzes and visualizes it |
| **Aggregate news & social media** | Web Search + X Search | Get comprehensive coverage from both traditional web and social platforms |
| **Extract insights from multiple sources** | Web Search + X Search + Code Execution | Collect data from various sources then compute correlations and trends |
| **Monitor real-time discussions** | X Search + Web Search | Track social sentiment alongside authoritative information |

```pythonXAI
from xai_sdk.tools import web_search, x_search, code_execution

# Example tool combinations for different scenarios
research_setup = [web_search(), code_execution()]
news_setup = [web_search(), x_search()]
comprehensive_setup = [web_search(), x_search(), code_execution()]
```

```pythonWithoutSDK
research_setup = {
  "tools": [
    {"type": "web_search"},
    {"type": "code_interpreter"}
  ]
}

news_setup = {
  "tools": [
    {"type": "web_search"},
    {"type": "x_search"}
  ]
}

comprehensive_setup = {
  "tools": [
    {"type": "web_search"},
    {"type": "x_search"},
    {"type": "code_interpreter"}
  ]
}
```

### Using Tool Combinations in Different Scenarios

1. When you want to search for news on the Internet, you can activate all search tools:
   * Web search tool
   * X search tool

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import web_search, x_search

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[
        web_search(),
        x_search(),
    ],
)

chat.append(user("what is the latest update from xAI?"))

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
            "content": "what is the latest update from xAI?"
        }
    ],
    "tools": [
        {
            "type": "web_search",
        },
        {
            "type": "x_search",
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
      "content": "What is the latest update from xAI?"
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

2. When you want to collect up-to-date data from the Internet and perform calculations based on the Internet data, you can choose to activate:
   * Web search tool
   * Code execution tool

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user
from xai_sdk.tools import web_search, code_execution

client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    # research_tools
    tools=[
        web_search(),
        code_execution(),
    ],
)

chat.append(user("What is the average market cap of the companies with the top 5 market cap in the US stock market today?"))

# sample or stream the response...
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
            "content": "What is the average market cap of the companies with the top 5 market cap in the US stock market today?",
        },
    ],
    # research_tools
    tools=[
        {
            "type": "web_search",
        },
        {
            "type": "code_interpreter",
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
            "content": "What is the average market cap of the companies with the top 5 market cap in the US stock market today?"
        }
    ],
    # research_tools
    "tools": [
        {
            "type": "web_search",
        },
        {
            "type": "code_interpreter",
        },
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
      "content": "What is the average market cap of the companies with the top 5 market cap in the US stock market today?"
    }
  ],
  "tools": [
    {
      "type": "web_search"
    },
    {
      "type": "code_interpreter"
    }
  ]
}'
```

## Using Images in the Context

You can bootstrap your requests with an initial conversation context that includes images.

In the code sample below, we pass an image into the context of the conversation before initiating an agentic request.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import image, user
from xai_sdk.tools import web_search, x_search

# Create the client and define the server-side tools to use
client = Client(api_key=os.getenv("XAI_API_KEY"))
chat = client.chat.create(
    model="grok-4-1-fast",  # reasoning model
    tools=[web_search(), x_search()],
)

# Add an image to the conversation
chat.append(
    user(
        "Search the internet and tell me what kind of dog is in the image below.",
        "And what is the typical lifespan of this dog breed?",
        image(
            "https://pbs.twimg.com/media/G3B7SweXsAAgv5N?format=jpg&name=900x900"
        ),
    )
)

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


