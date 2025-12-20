# Function Calling

> Enable AI models to interact with external tools, APIs, and functions for building intelligent agents and automation workflows.

## Overview

Function calling (also known as tool use) allows AI models to:

* **Call external APIs** - Fetch real-time data
* **Execute functions** - Perform calculations or operations
* **Access databases** - Query and retrieve information
* **Interact with systems** - Control external services
* **Chain operations** - Build complex multi-step workflows

<Info>
  **Parallel Function Calling**: MegaLLM supports executing multiple functions simultaneously for improved performance.
</Info>

## How It Works

<Steps>
  <Step title="Define Tools">
    Specify available functions with JSON Schema descriptions
  </Step>

  <Step title="AI Decides">
    Model determines when and how to use tools based on context
  </Step>

  <Step title="Execute Functions">
    Your application executes the requested functions
  </Step>

  <Step title="Return Results">
    Send function results back to the AI
  </Step>

  <Step title="AI Responds">
    Model incorporates results into final response
  </Step>
</Steps>

## Tool Definition Format

### OpenAI Format

```json  theme={null}
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Get the current weather in a given location",
    "parameters": {
      "type": "object",
      "properties": {
        "location": {
          "type": "string",
          "description": "City and state, e.g. San Francisco, CA"
        },
        "unit": {
          "type": "string",
          "enum": ["celsius", "fahrenheit"],
          "description": "Temperature unit"
        }
      },
      "required": ["location"]
    }
  }
}
```

### Anthropic Format

```json  theme={null}
{
  "name": "get_weather",
  "description": "Get the current weather in a given location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City and state, e.g. San Francisco, CA"
      }
    },
    "required": ["location"]
  }
}
```

## Request Parameters

### OpenAI Format

| Parameter     | Type          | Description                                                           |
| ------------- | ------------- | --------------------------------------------------------------------- |
| `tools`       | array         | Array of tool definitions                                             |
| `tool_choice` | string/object | Controls tool usage: `auto`, `required`, `none`, or specific function |

### Tool Choice Options

```python  theme={null}
# Let AI decide (default)
tool_choice="auto"

# Force AI to call a function
tool_choice="required"

# Prevent function calling
tool_choice="none"

# Force specific function
tool_choice={
    "type": "function",
    "function": {"name": "get_weather"}
}
```

## Examples

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI
    import json

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    # Define your function
    def get_weather(location: str, unit: str = "celsius"):
        """Get current weather (simulated)"""
        return {
            "location": location,
            "temperature": 22,
            "unit": unit,
            "condition": "sunny"
        }

    # Define tools for AI
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get current weather in a location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "City and state, e.g. San Francisco, CA"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                }
            }
        }
    ]

    # Initial request
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "What's the weather in London?"}
        ],
        tools=tools,
        tool_choice="auto"
    )

    message = response.choices[0].message

    # Check if AI wants to call a function
    if message.tool_calls:
        # Execute the function
        for tool_call in message.tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)

            if function_name == "get_weather":
                result = get_weather(**function_args)

                # Send result back to AI
                follow_up = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "user", "content": "What's the weather in London?"},
                        message,
                        {
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": json.dumps(result)
                        }
                    ]
                )

                print(follow_up.choices[0].message.content)
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    import OpenAI from 'openai';

    const openai = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY,
    });

    // Define function
    function getWeather(location, unit = 'celsius') {
      return {
        location,
        temperature: 22,
        unit,
        condition: 'sunny'
      };
    }

    // Define tools
    const tools = [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: 'Get current weather in a location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'City and state, e.g. San Francisco, CA'
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit']
              }
            },
            required: ['location']
          }
        }
      }
    ];

    // Initial request
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: "What's the weather in London?" }
      ],
      tools,
      tool_choice: 'auto'
    });

    const message = response.choices[0].message;

    if (message.tool_calls) {
      const messages = [
        { role: 'user', content: "What's the weather in London?" },
        message
      ];

      for (const toolCall of message.tool_calls) {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        if (functionName === 'get_weather') {
          const result = getWeather(functionArgs.location, functionArgs.unit);

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          });
        }
      }

      const followUp = await openai.chat.completions.create({
        model: 'gpt-4',
        messages
      });

      console.log(followUp.choices[0].message.content);
    }
    ```
  </Tab>

  <Tab title="TypeScript">
    ```typescript  theme={null}
    import OpenAI from 'openai';

    interface WeatherParams {
      location: string;
      unit?: 'celsius' | 'fahrenheit';
    }

    interface WeatherResult {
      location: string;
      temperature: number;
      unit: string;
      condition: string;
    }

    const openai = new OpenAI({
      baseURL: 'https://ai.megallm.io/v1',
      apiKey: process.env.MEGALLM_API_KEY!,
    });

    // Type-safe function
    async function getWeather({ location, unit = 'celsius' }: WeatherParams): Promise<WeatherResult> {
      return {
        location,
        temperature: 22,
        unit,
        condition: 'sunny'
      };
    }

    // Function registry
    const functionRegistry = {
      get_weather: getWeather
    } as const;

    // Tool definitions
    const tools: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: 'Get current weather in a location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'City and state, e.g. San Francisco, CA'
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit']
              }
            },
            required: ['location']
          }
        }
      }
    ];

    async function handleToolCalls(message: OpenAI.Chat.ChatCompletionMessage) {
      if (!message.tool_calls) return null;

      const toolResults = await Promise.all(
        message.tool_calls.map(async (toolCall) => {
          const fn = functionRegistry[toolCall.function.name as keyof typeof functionRegistry];
          if (!fn) throw new Error(`Unknown function: ${toolCall.function.name}`);

          const args = JSON.parse(toolCall.function.arguments);
          const result = await fn(args);

          return {
            role: 'tool' as const,
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          };
        })
      );

      return toolResults;
    }

    // Usage
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: "What's the weather in London?" }],
      tools,
      tool_choice: 'auto'
    });

    const toolResults = await handleToolCalls(response.choices[0].message);

    if (toolResults) {
      const followUp = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: "What's the weather in London?" },
          response.choices[0].message,
          ...toolResults
        ]
      });

      console.log(followUp.choices[0].message.content);
    }
    ```
  </Tab>
</Tabs>

## Parallel Function Calling

Execute multiple functions simultaneously:

```python  theme={null}
# AI can call multiple functions at once
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Compare weather in London, Paris, and Tokyo"}
    ],
    tools=tools
)

# Process multiple tool calls in parallel
if response.choices[0].message.tool_calls:
    import asyncio

    async def execute_tool(tool_call):
        function_name = tool_call.function.name
        function_args = json.loads(tool_call.function.arguments)

        result = await async_function_registry[function_name](**function_args)

        return {
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result)
        }

    # Execute all functions in parallel
    tool_results = await asyncio.gather(
        *[execute_tool(tc) for tc in response.choices[0].message.tool_calls]
    )
```

## Advanced Patterns

### Function Chaining

Build complex workflows:

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_products",
            "description": "Search for products",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                },
                "required": ["query"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "check_inventory",
            "description": "Check product inventory",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {"type": "string"}
                },
                "required": ["product_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "place_order",
            "description": "Place an order",
            "parameters": {
                "type": "object",
                "properties": {
                    "product_id": {"type": "string"},
                    "quantity": {"type": "integer"}
                },
                "required": ["product_id", "quantity"]
            }
        }
    }
]

# AI will chain functions to complete complex tasks
# Example: "Find blue t-shirts and order 2 if in stock"
# 1. search_products(query="blue t-shirt")
# 2. check_inventory(product_id="...")
# 3. place_order(product_id="...", quantity=2)
```

### Error Handling

```python  theme={null}
def safe_function_call(function_name, arguments):
    try:
        result = function_registry[function_name](**arguments)
        return {"success": True, "result": result}
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "error_type": type(e).__name__
        }

# In tool response
for tool_call in message.tool_calls:
    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments)

    result = safe_function_call(function_name, function_args)

    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result)
    })
```

### Streaming with Functions

```python  theme={null}
stream = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    stream=True
)

function_call = None

for chunk in stream:
    delta = chunk.choices[0].delta

    if delta.tool_calls:
        if function_call is None:
            function_call = {"id": "", "name": "", "arguments": ""}

        tool_call = delta.tool_calls[0]
        if tool_call.id:
            function_call["id"] = tool_call.id
        if tool_call.function.name:
            function_call["name"] = tool_call.function.name
        if tool_call.function.arguments:
            function_call["arguments"] += tool_call.function.arguments

    if chunk.choices[0].finish_reason == "tool_calls":
        # Execute function
        result = execute_function(function_call)
```

## Real-World Use Cases

### Database Query Assistant

```python  theme={null}
{
  "type": "function",
  "function": {
    "name": "execute_sql",
    "description": "Execute a SQL query",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {"type": "string"},
        "database": {
          "type": "string",
          "enum": ["users", "products", "orders"]
        }
      },
      "required": ["query", "database"]
    }
  }
}
```

### API Integration Agent

```python  theme={null}
{
  "type": "function",
  "function": {
    "name": "call_api",
    "description": "Make an HTTP API call",
    "parameters": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "enum": ["GET", "POST", "PUT", "DELETE"]
        },
        "url": {"type": "string"},
        "headers": {"type": "object"},
        "body": {"type": "object"}
      },
      "required": ["method", "url"]
    }
  }
}
```

### File System Operations

```python  theme={null}
{
  "type": "function",
  "function": {
    "name": "read_file",
    "description": "Read file contents",
    "parameters": {
      "type": "object",
      "properties": {
        "path": {"type": "string"}
      },
      "required": ["path"]
    }
  }
}
```

## Best Practices

<Tip>
  Write clear, detailed function descriptions. The AI uses these to decide when and how to call functions.
</Tip>

1. **Clear descriptions** - Be specific about what each function does
2. **Validate inputs** - Always validate function arguments before execution
3. **Handle errors gracefully** - Return error information to the AI
4. **Use type hints** - Leverage TypeScript/Python types for safety
5. **Rate limit** - Implement rate limiting for external API calls
6. **Security** - Validate and sanitize all function inputs
7. **Async execution** - Use async/await for better performance

## Response Format

### Tool Call Object (OpenAI)

```json  theme={null}
{
  "id": "call_abc123",
  "type": "function",
  "function": {
    "name": "get_weather",
    "arguments": "{\"location\": \"London\", \"unit\": \"celsius\"}"
  }
}
```

### Tool Response Format

```json  theme={null}
{
  "role": "tool",
  "tool_call_id": "call_abc123",
  "content": "{\"temperature\": 22, \"condition\": \"sunny\"}"
}
```

## Model Support

Function calling is supported by these models:

* **OpenAI**: gpt-4, gpt-4-turbo, gpt-3.5-turbo
* **Anthropic**: claude-3.5-sonnet, claude-opus-4, claude-sonnet-4
* **Others**: Check [Models page](/api-reference/get-models) for full list

## Related

* [Chat Completions API](/api-reference/post-chat-completions) - OpenAI-compatible function calling
* [Messages API](/api-reference/post-v1-messages) - Anthropic-compatible tool use
* [Streaming](/api-reference/endpoint/streaming) - Function calling with streaming
* [Models](/api-reference/get-models) - Model capabilities and features


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt