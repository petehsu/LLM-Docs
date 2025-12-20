# 函数调用

> 让您的 AI 助手能够与外部工具、API 和函数进行交互。非常适合构建可以执行操作、检索实时数据并与现有系统集成的代理。

<Info>
  **并行函数调用**: MegaLLM 支持并行函数执行以提高性能。
</Info>

## 工作原理

<Steps>
  <Step title="定义可用工具">
    使用 JSON Schema 描述指定 AI 可以使用的函数。
  </Step>

  <Step title="AI 决定何时调用">
    模型根据上下文决定何时以及如何使用工具。
  </Step>

  <Step title="执行并返回结果">
    您的应用程序执行函数并将结果返回给 AI。
  </Step>

  <Step title="AI 处理结果">
    AI 将函数结果纳入其最终响应中。
  </Step>
</Steps>

## 基本示例

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    from openai import OpenAI
    import json

    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-api-key"
    )

    # 定义您的函数
    def get_weather(location: str, unit: str = "celsius"):
        """获取某个位置的当前天气"""
        # 模拟 API 调用
        return {
            "location": location,
            "temperature": 22,
            "unit": unit,
            "condition": "sunny"
        }

    # 为 AI 定义工具
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "获取给定位置的当前天气",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "城市和州,例如 San Francisco, CA"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"],
                            "description": "温度单位"
                        }
                    },
                    "required": ["location"]
                }
            }
        }
    ]

    # 发送带有工具的消息
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "What's the weather in London?"}
        ],
        tools=tools,
        tool_choice="auto"  # 让模型决定
    )

    # 检查模型是否想要调用函数
    message = response.choices[0].message

    if message.tool_calls:
        # 执行函数
        for tool_call in message.tool_calls:
            function_name = tool_call.function.name
            function_args = json.loads(tool_call.function.arguments)

            if function_name == "get_weather":
                result = get_weather(**function_args)

                # 将结果发送回模型
                follow_up = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "user", "content": "What's the weather in London?"},
                        message,  # 包含助手的工具调用
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

    // 定义您的函数
    function getWeather(location, unit = 'celsius') {
      // 模拟 API 调用
      return {
        location,
        temperature: 22,
        unit,
        condition: 'sunny'
      };
    }

    // 定义工具
    const tools = [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: '获取给定位置的当前天气',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: '城市和州,例如 San Francisco, CA'
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description: '温度单位'
              }
            },
            required: ['location']
          }
        }
      }
    ];

    // 发送带有工具的消息
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

    // 类型安全的函数实现
    async function getWeather({ location, unit = 'celsius' }: WeatherParams): Promise<WeatherResult> {
      // 真实实现会调用 API
      return {
        location,
        temperature: 22,
        unit,
        condition: 'sunny'
      };
    }

    // 函数注册表
    const functionRegistry = {
      get_weather: getWeather
    } as const;

    // 带有适当类型的工具定义
    const tools: OpenAI.Chat.ChatCompletionTool[] = [
      {
        type: 'function',
        function: {
          name: 'get_weather',
          description: '获取给定位置的当前天气',
          parameters: {
            type: 'object',
            properties: {
              location: {
                type: 'string',
                description: '城市和州,例如 San Francisco, CA'
              },
              unit: {
                type: 'string',
                enum: ['celsius', 'fahrenheit'],
                description: '温度单位'
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

    // 使用示例
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

## 并行函数调用

MegaLLM 支持同时调用多个函数以提高性能:

```python  theme={null}
# AI 可以一次调用多个函数
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Compare the weather in London, Paris, and Tokyo"}
    ],
    tools=tools
)

# 并行处理多个工具调用
if response.choices[0].message.tool_calls:
    import asyncio

    async def execute_tool(tool_call):
        function_name = tool_call.function.name
        function_args = json.loads(tool_call.function.arguments)

        # 异步执行函数
        result = await async_function_registry[function_name](**function_args)

        return {
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result)
        }

    # 并行执行所有函数
    tool_results = await asyncio.gather(
        *[execute_tool(tc) for tc in response.choices[0].message.tool_calls]
    )
```

## 高级模式

### 函数链

通过链接函数调用构建复杂的工作流:

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "search_products",
            "description": "搜索产品",
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
            "description": "检查产品库存",
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
            "description": "下订单购买产品",
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

# AI 将链接这些函数以完成复杂任务
messages = [
    {"role": "user", "content": "Find and order 2 blue t-shirts if they're in stock"}
]

# AI 可能会:
# 1. 调用 search_products(query="blue t-shirt")
# 2. 调用 check_inventory(product_id="...")
# 3. 调用 place_order(product_id="...", quantity=2)
```

### 工具选择控制

控制 AI 何时以及如何使用工具:

```python  theme={null}
# 强制使用特定函数
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice={
        "type": "function",
        "function": {"name": "get_weather"}
    }
)

# 让 AI 决定(默认)
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

# 阻止函数调用
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="none"
)

# 强制调用某个函数(任意)
response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="required"
)
```

### 错误处理

正确处理函数执行错误:

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

# 在您的工具响应中
for tool_call in message.tool_calls:
    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments)

    result = safe_function_call(function_name, function_args)

    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": json.dumps(result)
    })

# AI 将优雅地处理错误
```

## 实际应用示例

### 数据库查询助手

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "execute_sql",
            "description": "在数据库上执行 SQL 查询",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "要执行的 SQL 查询"
                    },
                    "database": {
                        "type": "string",
                        "enum": ["users", "products", "orders"],
                        "description": "目标数据库"
                    }
                },
                "required": ["query", "database"]
            }
        }
    }
]

# 用户: "上个月下了多少订单?"
# AI 生成: execute_sql(
#   query="SELECT COUNT(*) FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)",
#   database="orders"
# )
```

### API 集成代理

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "call_api",
            "description": "进行 HTTP API 调用",
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

# AI 现在可以与任何 API 进行交互
```

### 文件系统操作

```python  theme={null}
tools = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "读取文件内容",
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
            "description": "将内容写入文件",
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

## 最佳实践

<Tip>
  **验证**: 始终在执行之前验证函数参数以防止错误。
</Tip>

### 1. 清晰的函数描述

```python  theme={null}
# 好的示例
"description": "获取包括温度、湿度和特定位置的天气状况的当前天气数据"

# 不好的示例
"description": "天气函数"
```

### 2. 类型安全

```typescript  theme={null}
// 为所有函数参数定义类型
interface FunctionParams {
  [key: string]: unknown;
}

// 在执行之前验证
function validateParams<T extends FunctionParams>(
  params: unknown,
  schema: JSONSchema
): params is T {
  // 实现 JSON Schema 验证
  return ajv.validate(schema, params);
}
```

### 3. 速率限制

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
    # 您的 API 调用
    pass
```

## 带函数的流式传输

将流式传输与函数调用相结合:

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

    # 在流中检查工具调用
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

    # 当函数调用完成时
    if function_call and chunk.choices[0].finish_reason == "tool_calls":
        # 执行函数
        result = execute_function(function_call)
        # 使用结果继续对话
```

## 下一步

* 实现[结构化输出](/cn/openai/structured-output)以获得验证的响应
* 探索[嵌入](/cn/openai/embeddings)以进行语义搜索
* 了解可用于不同用例的[模型](/cn/openai/models)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt