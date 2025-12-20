# Function Calling

> Enable your AI assistant to interact with external tools, APIs, and functions. Perfect for building agents that can perform actions, retrieve real-time data, and integrate with your existing systems.

<Info>
  **Parallel Function Calling**: MegaLLM supports parallel function execution for improved performance.
</Info>

## How It Works

<Steps>
  <Step title="Define Available Tools">
    Specify functions the AI can use with JSON Schema descriptions.
  </Step>

  <Step title="AI Decides When to Call">
    The model determines when and how to use tools based on context.
  </Step>

  <Step title="Execute and Return Results">
    Your application executes the function and returns results to the AI.
  </Step>

  <Step title="AI Processes Results">
    The AI incorporates function results into its final response.
  </Step>
</Steps>

## Basic Example

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI
    import json

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    # Define your functions
    def get_weather(location: str, unit: str = "celsius"):
        """Get the current weather for a location"""
        # Simulate API call
        return {
            "location": location,
            "temperature": 22,
            "unit": unit,
            "condition": "sunny"
        }

    # Define tools for the AI
    tools = [
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
                            "description": "The city and state, e.g. San Francisco, CA"
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
    ]

    # Send message with tools
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "What's the weather in London?"}
        ],
        tools=tools,
        tool_choice="auto"  # Let the model decide
    )

    # Check if the model wants to call a function
    message = response.choices[0].message

    if message.tool_calls:
        # Execute the function
        for tool_call in message.tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)

            if function_name == "get_weather":
                result = get_weather(**function_args)

                # Send the result back to the model
                follow_up = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "user", "content": "What's the weather in London?"},
                        message,  # Include the assistant's tool call
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
      apiKey: process.env.GITHUB_TOKEN,
    });

    // Define your function
    function getWeather(location, unit = 'celsius') {
      // Simulate API call
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
          description: 'Get the current weather in a given location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA'
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description: 'Temperature unit'
              }
            },
            required: ['location']
          }
        }
      }
    ];

    // Send message with tools
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
      apiKey: process.env.GITHUB_TOKEN!,
    });

    // Type-safe function implementation
    async function getWeather({ location, unit = 'celsius' }: WeatherParams): Promise<WeatherResult> {
      // Real implementation would call an API
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

    // Tool definitions with proper typing
    const tools: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: 'Get the current weather in a given location',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: 'The city and state, e.g. San Francisco, CA'
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description: 'Temperature unit'
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
    async function askAboutWeather() {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: "What's the weather in London and Paris?" }],
        tools,
        tool_choice: 'auto'
      });

      const toolResults = await handleToolCalls(response.choices[0].message);

      if (toolResults) {
        const followUp = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'user', content: "What's the weather in London and Paris?" },
            response.choices[0].message,
            ...toolResults
          ]
        });

        return followUp.choices[0].message.content;
      }

      return response.choices[0].message.content;
    }
    ```
  </Tab>
</Tabs>

## Parallel Function Calling

MegaLLM supports calling multiple functions in parallel for better performance:

```python  theme={null}
# The AI can call multiple functions at once
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Compare the weather in London, Paris, and Tokyo"}
    ],
    tools=tools
)

# Process multiple tool calls in parallel
if response.choices[0].message.tool_calls:
    import asyncio

    async def execute_tool(tool_call):
        function_name = tool_call.function.name
        function_args = json.loads(tool_call.function.arguments)

        # Execute function asynchronously
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

Build complex workflows by chaining function calls:

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
                    "query": {"type": "string"},
                    "category": {"type": "string"}
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
            "description": "Place an order for a product",
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

# The AI will chain these functions to complete complex tasks
messages = [
    {"role": "user", "content": "Find and order 2 blue t-shirts if they're in stock"}
]

# The AI might:
# 1. Call search_products(query="blue t-shirt")
# 2. Call check_inventory(product_id="...")
# 3. Call place_order(product_id="...", quantity=2)
```

### Tool Choice Control

Control when and how the AI uses tools:

```python  theme={null}
# Force a specific function
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice={
        "type": "function",
        "function": {"name": "get_weather"}
    }
)

# Let the AI decide (default)
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

# Prevent function calling
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="none"
)

# Force some function call (any)
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="required"
)
```

### Error Handling

Properly handle function execution errors:

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

# In your tool response
for tool_call in message.tool_calls:
    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments)

    result = safe_function_call(function_name, function_args)

    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result)
    })

# The AI will handle the error gracefully
```

## Real-World Examples

### Database Query Assistant

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "execute_sql",
            "description": "Execute a SQL query on the database",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "SQL query to execute"
                    },
                    "database": {
                        "type": "string",
                        "enum": ["users", "products", "orders"],
                        "description": "Target database"
                    }
                },
                "required": ["query", "database"]
            }
        }
    }
]

# User: "How many orders were placed last month?"
# AI generates: execute_sql(
#   query="SELECT COUNT(*) FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)",
#   database="orders"
# )
```

### API Integration Agent

```python  theme={null}
tools = [
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
]

# The AI can now interact with any API
```

### File System Operations

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read contents of a file",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string"}
                },
                "required": ["path"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "Write content to a file",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string"},
                    "content": {"type": "string"},
                    "append": {"type": "boolean", "default": false}
                },
                "required": ["path", "content"]
            }
        }
    }
]
```

## Best Practices

<Tip>
  **Validation**: Always validate function arguments before execution to prevent errors.
</Tip>

### 1. Clear Function Descriptions

```python  theme={null}
# Good
"description": "Get current weather data including temperature, humidity, and conditions for a specific location"

# Bad
"description": "Weather function"
```

### 2. Type Safety

```typescript  theme={null}
// Define types for all function parameters
interface FunctionParams {
  [key: string]: unknown;
}

// Validate before execution
function validateParams<T extends FunctionParams>(
  params: unknown,
  schema: JSONSchema
): params is T {
  // Implement JSON Schema validation
  return ajv.validate(schema, params);
}
```

### 3. Rate Limiting

```python  theme={null}
from functools import wraps
import time

def rate_limit(calls_per_second=1):
    min_interval = 1.0 / calls_per_second
    last_called = [0.0]

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            left_to_wait = min_interval - elapsed
            if left_to_wait > 0:
                time.sleep(left_to_wait)
            ret = func(*args, **kwargs)
            last_called[0] = time.time()
            return ret
        return wrapper
    return decorator

@rate_limit(calls_per_second=10)
def call_external_api():
    # Your API call
    pass
```

## Streaming with Functions

Combine streaming with function calling:

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

    # Check for tool calls in stream
    if delta.tool_calls:
        if function_call is None:
            function_call = {
                "id": "",
                "name": "",
                "arguments": ""
            }

        tool_call = delta.tool_calls[0]
        if tool_call.id:
            function_call["id"] = tool_call.id
        if tool_call.function.name:
            function_call["name"] = tool_call.function.name
        if tool_call.function.arguments:
            function_call["arguments"] += tool_call.function.arguments

    # When function call is complete
    if function_call and chunk.choices[0].finish_reason == "tool_calls":
        # Execute function
        result = execute_function(function_call)
        # Continue conversation with result
```

## Next Steps

* Implement [Structured Output](/openai/structured-output) for validated responses
* Explore [Embeddings](/openai/embeddings) for semantic search
* Learn about [Models](/openai/models) available for different use cases


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt