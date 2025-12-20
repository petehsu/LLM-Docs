# 函数调用

> 使 AI 模型能够与外部工具、API 和函数交互，用于构建智能代理和自动化工作流程。

## 概述

函数调用（也称为工具使用）允许 AI 模型：

* **调用外部 API** - 获取实时数据
* **执行函数** - 执行计算或操作
* **访问数据库** - 查询和检索信息
* **与系统交互** - 控制外部服务
* **链接操作** - 构建复杂的多步骤工作流程

<Info>
  **并行函数调用**：MegaLLM 支持同时执行多个函数以提高性能。
</Info>

## 工作原理

<Steps>
  <Step title="定义工具">
    使用 JSON Schema 描述指定可用函数
  </Step>

  <Step title="AI 决策">
    模型根据上下文确定何时以及如何使用工具
  </Step>

  <Step title="执行函数">
    您的应用程序执行请求的函数
  </Step>

  <Step title="返回结果">
    将函数结果发送回 AI
  </Step>

  <Step title="AI 响应">
    模型将结果整合到最终响应中
  </Step>
</Steps>

## 工具定义格式

### OpenAI 格式

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

### Anthropic 格式

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

## 请求参数

### OpenAI 格式

| 参数            | 类型            | 描述                                    |
| ------------- | ------------- | ------------------------------------- |
| `tools`       | array         | 工具定义数组                                |
| `tool_choice` | string/object | 控制工具使用：`auto`、`required`、`none` 或特定函数 |

### 工具选择选项

```python  theme={null}
# 让 AI 决定（默认）
tool_choice="auto"

# 强制 AI 调用函数
tool_choice="required"

# 阻止函数调用
tool_choice="none"

# 强制特定函数
tool_choice={
    "type": "function",
    "function": {"name": "get_weather"}
}
```

## 示例

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

## 并行函数调用

同时执行多个函数：

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

## 高级模式

### 函数链

构建复杂的工作流程：

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

### 错误处理

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

### 流式传输中的函数

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

## 实际应用场景

### 数据库查询助手

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

### API 集成代理

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

### 文件系统操作

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

## 最佳实践

<Tip>
  编写清晰、详细的函数描述。AI 使用这些来决定何时以及如何调用函数。
</Tip>

1. **清晰的描述** - 具体说明每个函数的功能
2. **验证输入** - 执行前始终验证函数参数
3. **优雅地处理错误** - 将错误信息返回给 AI
4. **使用类型提示** - 利用 TypeScript/Python 类型确保安全
5. **速率限制** - 为外部 API 调用实现速率限制
6. **安全性** - 验证和清理所有函数输入
7. **异步执行** - 使用 async/await 以获得更好的性能

## 响应格式

### 工具调用对象（OpenAI）

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

### 工具响应格式

```json  theme={null}
{
  "role": "tool",
  "tool_call_id": "call_abc123",
  "content": "{\"temperature\": 22, \"condition\": \"sunny\"}"
}
```

## 模型支持

这些模型支持函数调用：

* **OpenAI**: gpt-4, gpt-4-turbo, gpt-3.5-turbo
* **Anthropic**: claude-3.5-sonnet, claude-opus-4, claude-sonnet-4
* **其他**：查看[模型页面](/cn/api-reference/get-models)获取完整列表

## 相关内容

* [Chat Completions API](/cn/api-reference/post-chat-completions) - 兼容 OpenAI 的函数调用
* [Messages API](/cn/api-reference/post-v1-messages) - 兼容 Anthropic 的工具使用
* [流式传输](/cn/api-reference/endpoint/streaming) - 在流式传输中使用函数调用
* [模型](/cn/api-reference/get-models) - 模型功能和特性


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt