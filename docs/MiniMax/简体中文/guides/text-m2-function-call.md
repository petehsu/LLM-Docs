# M2 工具使用 & Interleaved Thinking

> MiniMax-M2 是一款 Agentic Model，具备优秀的工具使用 (Tool Use) 能力。

M2 原生支持 Interleaved Thinking。它能够在每轮 Tool Use 前，根据环境或工具的返回 (Output) 进行思考，并决策下一步行动。

<img src="https://filecdn.minimax.chat/public/4f4b43c1-f0a5-416a-8770-1a4f80feeb1e.png" />

这种能力使其在长程、复杂任务中表现出色，并在 SWE、BrowseCamp、xBench 等 Code & Agent Benchmark 上达到了 SOTA 水平。

下面我们通过具体的案例，说明M2在Tool Use和Interleaved Thinking上的最佳实践，它的核心是：回传每一次模型Response的全部信息，尤其是其中的思考字段(thinking/reasoning\_details)。

## 参数说明

### 请求参数说明

* `tools`: 定义可调用的函数列表，包含函数名、描述和参数规范

### 响应参数说明

工具使用响应中的关键字段：

* `thinking/reasoning_details`: 模型的思考（thinking）
* `text/content`: 模型输出的文本
* `tool_calls`: 模型决定调用工具
* `function.name`: 被调用的工具名称
* `function.arguments`: 工具调用参数（JSON 格式字符串）
* `id`: 工具调用的唯一标识符

## 特别注意

在多轮 Function Call 对话中，必须将完整的模型返回（即 assistant 消息）添加到对话历史，以保持思维链的连续性：

**OpenAI SDK:**

* 将完整的 `response_message` 对象（包含 `tool_calls` 字段）添加到消息历史
  * 原生的OpenAI API 的 MiniMax-M2 模型 `content` 字段会包含 `<think>` 标签内容，需要完整保留
  * 在 Interleaved Thinking 友好格式中，通过启用额外的参数(`reasoning_split=True`)，模型思考内容通过 `reasoning_details` 字段单独提供，同样需要完整保留

**Anthropic SDK:**

* 将完整的 `response.content`（包含 thinking/text/tool\_use 等所有块）添加到消息历史
* `response.content` 是一个列表，包含多种类型的内容块，必须完整回传

## 请求示例

### Anthropic SDK

#### 配置环境变量

国内用户使用 `https://api.minimaxi.com/anthropic`，国际用户使用 `https://api.minimax.io/anthropic`

```bash  theme={null}
export ANTHROPIC_BASE_URL=https://api.minimaxi.com/anthropic
export ANTHROPIC_API_KEY=${YOUR_API_KEY}
```

#### 示例代码

```python  theme={null}
import anthropic
import json

# 初始化客户端
client = anthropic.Anthropic()

# 定义工具：天气查询
tools = [
    {
        "name": "get_weather",
        "description": "Get weather of a location, the user should supply a location first.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "The city and state, e.g. San Francisco, US",
                }
            },
            "required": ["location"]
        }
    }
]

def send_messages(messages):
    params = {
        "model": "MiniMax-M2",
        "max_tokens": 4096,
        "messages": messages,
        "tools": tools,
    }

    response = client.messages.create(**params)
    return response

def process_response(response):
    thinking_blocks = []
    text_blocks = []
    tool_use_blocks = []

    # 遍历所有内容块
    for block in response.content:
        if block.type == "thinking":
            thinking_blocks.append(block)
            print(f"💭 Thinking>\n{block.thinking}\n")
        elif block.type == "text":
            text_blocks.append(block)
            print(f"💬 Model>\t{block.text}")
        elif block.type == "tool_use":
            tool_use_blocks.append(block)
            print(f"🔧 Tool>\t{block.name}({json.dumps(block.input, ensure_ascii=False)})")

    return thinking_blocks, text_blocks, tool_use_blocks

# 1. 用户提问
messages = [{"role": "user", "content": "How's the weather in San Francisco?"}]
print(f"\n👤 User>\t {messages[0]['content']}")

# 2. 模型返回第一轮响应（可能包含工具调用）
response = send_messages(messages)
thinking_blocks, text_blocks, tool_use_blocks = process_response(response)

# 3. 如果有工具调用，执行工具并继续对话
if tool_use_blocks:
    # ⚠️ 关键：将助手的完整响应回传到消息历史
    # response.content 包含所有块的列表：[thinking块, text块, tool_use块]
    # 必须完整回传，否则后续对话会丢失上下文信息
    messages.append({
        "role": "assistant",
        "content": response.content
    })

    # 执行工具并返回结果（这里模拟天气API调用）
    print(f"\n🔨 执行工具: {tool_use_blocks[0].name}")
    tool_result = "24℃, sunny"
    print(f"📊 工具返回: {tool_result}")

    # 添加工具执行结果
    messages.append({
        "role": "user",
        "content": [
            {
                "type": "tool_result",
                "tool_use_id": tool_use_blocks[0].id,
                "content": tool_result
            }
        ]
    })

    # 4. 获取最终回复
    final_response = send_messages(messages)
    process_response(final_response)
```

**代码输出结果如下：**

```nushell  theme={null}
👤 User>         How's the weather in San Francisco?
💭 Thinking>
Okay, so the user is asking about the weather in San Francisco. This is a straightforward request that requires me to get current weather information for a specific location.

Looking at my available tools, I see I have a `get_weather` function that can provide weather information for a location. This is exactly what I need to answer the user's question. The function requires a "location" parameter, which should be a string containing the city and potentially the state/country.

In this case, the user has clearly specified San Francisco as the location. San Francisco is a major city in US, so I don't need to include the country code - just "San Francisco" should be sufficient for the weather service to identify the correct location.

The required parameters for the get_weather tool are:
- location: "San Francisco"

I should call this tool to retrieve the current weather information for San Francisco before I can provide a meaningful answer to the user. Once I get the weather data back from the tool, I'll be able to share details like temperature, conditions (sunny, cloudy, rainy, etc.), and possibly other relevant information like humidity or wind speed.

So I'll make a tool call to get_weather with the location parameter set to "San Francisco". After I receive the response from this tool call, I'll be able to provide the user with the current weather information they requested.

🔧 Tool>        get_weather({"location": "San Francisco"})

🔨 执行工具: get_weather
📊 工具返回: 24℃, sunny
💭 Thinking>
I've just called the get_weather tool to check the current conditions in San Francisco as the user requested. Let me analyze what information I received back.

The tool returned a simple response: "24℃, sunny". This is quite straightforward - it tells me the current temperature is 24 degrees Celsius and the weather conditions are sunny. This is exactly the basic weather information the user was asking about.

The temperature is given in Celsius (24℃), which is appropriate since US uses the metric system. I could convert this to Fahrenheit for users who might be more familiar with that scale, but since the user didn't specify a preference, I'll stick with the metric measurement as provided by the tool.

For the weather condition, I received "sunny" which indicates clear skies and good visibility. This is useful information that tells the user they can expect good weather if they're planning to be outside.

I don't have additional details like humidity, wind speed, or UV index from the tool response. If the user wants more detailed information, they could ask a follow-up question, and I might need to provide general advice about sunny weather conditions or suggest checking a more detailed weather service.

Now I need to formulate a clear, concise response to the user that directly answers their question about the weather in San Francisco. I'll keep it simple and factual, stating the temperature and conditions clearly. I should also add a friendly closing to invite further questions if needed.

The most straightforward way to present this information is to state the temperature first, followed by the conditions, and then add a friendly note inviting the user to ask for more information if they want it.

💬 Model>       The current weather in San Francisco is 24℃ and sunny.
```

**返回结果**

```json  theme={null}
{
    "id": "05566b8d51ded3a3016d6cc100685cad",
    "choices": [
        {
            "finish_reason": "tool_calls",
            "index": 0,
            "message": {
                "content": "\n",
                "role": "assistant",
                "name": "MiniMax AI",
                "tool_calls": [
                    {
                        "id": "call_function_2831178524_1",
                        "type": "function",
                        "function": {
                            "name": "get_weather",
                            "arguments": "{\"location\": \"San Francisco, US\"}"
                        },
                        "index": 0
                    }
                ],
                "audio_content": "",
                "reasoning_details": [
                    {
                        "type": "reasoning.text",
                        "id": "reasoning-text-1",
                        "format": "MiniMax-response-v1",
                        "index": 0,
                        "text": "Let me think about this request. The user is asking about the weather in San Francisco. This is a straightforward request where they want to know current weather conditions in a specific location.\n\nLooking at the tools available to me, I have access to a \"get_weather\" tool that can retrieve weather information for a location. The tool requires a location parameter in the format of \"city, state\" or \"city, country\". In this case, the user has specified \"San Francisco\" which is a city in the United States.\n\nTo properly use the tool, I need to format the location parameter correctly. The tool description mentions examples like \"San Francisco, US\" which follows the format of city, country code. However, since the user just mentioned \"San Francisco\" without specifying the state, and San Francisco is a well-known city that is specifically in California, I could use \"San Francisco, CA\" as the parameter value instead.\n\nActually, \"San Francisco, US\" would also work since the user is asking about the famous San Francisco in the United States, and there aren't other well-known cities with the same name that would cause confusion. The US country code is explicit and clear.\n\nBoth \"San Francisco, CA\" and \"San Francisco, US\" would be valid inputs for the tool. I'll go with \"San Francisco, US\" since it follows the exact format shown in the tool description example and is unambiguous.\n\nSo I'll need to call the get_weather tool with the location parameter set to \"San Francisco, US\". This will retrieve the current weather information for San Francisco, which I can then present to the user."
                    }
                ]
            }
        }
    ],
    "created": 1762080909,
    "model": "MiniMax-M2",
    "object": "chat.completion",
    "usage": {
        "total_tokens": 560,
        "total_characters": 0,
        "prompt_tokens": 203,
        "completion_tokens": 357
    },
    "input_sensitive": false,
    "output_sensitive": false,
    "input_sensitive_type": 0,
    "output_sensitive_type": 0,
    "output_sensitive_int": 0,
    "base_resp": {
        "status_code": 0,
        "status_msg": ""
    }
}
```

### OpenAI SDK

#### 配置环境变量

国内用户使用 `https://api.minimaxi.com/v1`，国际用户使用 `https://api.minimax.io/v1`

```bash  theme={null}
export OPENAI_BASE_URL=https://api.minimaxi.com/v1
export OPENAI_API_KEY=${YOUR_API_KEY}
```

#### Interleaved Thinking 友好格式

通过OpenAI SDK调用 MiniMax-M2 时，传递额外的参数(`reasoning_split=True`)，可获得更友好的输出格式，thinking内容将单独输出到`reasoning_details`字段中，开发者可以直接用于展示，无需手动从content字段中解析。

<Note>
  重要提醒：为了保证Interleaved Thinking的生效、模型思维链不被打断，包含`reasoning_details`在内完整`response_message`必须被保留在Message History中，在下一轮调用中，回传给模型。如此才能发挥模型的最佳性能！
</Note>

请注意请求并解析API返回的函数`send_messages`的实现，和追加历史消息`messages.append(response_message)`操作：

```python  theme={null}
import json

from openai import OpenAI

client = OpenAI()

# 定义工具：天气查询
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather of a location, the user should supply a location first.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, US",
                    }
                },
                "required": ["location"],
            },
        },
    },
]


def send_messages(messages):
    """发送消息并返回响应"""
    response = client.chat.completions.create(
        model="MiniMax-M2",
        messages=messages,
        tools=tools,
        # 设置 reasoning_split=True 将思考内容分离到 reasoning_details 字段
        extra_body={"reasoning_split": True},
    )
    return response.choices[0].message


# 1. 用户提问
messages = [{"role": "user", "content": "How's the weather in San Francisco?"}]
print(f"👤 User>\t {messages[0]['content']}")

# 2. 模型返回工具调用
response_message = send_messages(messages)

if response_message.tool_calls:
    tool_call = response_message.tool_calls[0]
    function_args = json.loads(tool_call.function.arguments)
    print(f"💭 Thinking>\t {response_message.reasoning_details[0]['text']}")
    print(f"💬 Model>\t {response_message.content}")
    print(f"🔧 Tool>\t {tool_call.function.name}({function_args['location']})")

    # 3. 执行工具并返回结果
    messages.append(response_message)
    messages.append(
        {
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": "24℃, sunny",  # 实际应用中这里应该调用真实的天气API
        }
    )

    # 4. 获取最终回复
    final_message = send_messages(messages)
    print(
        f"💭 Thinking>\t {final_message.model_dump()['reasoning_details'][0]['text']}"
    )
    print(f"💬 Model>\t {final_message.content}")
else:
    print(f"💬 Model>\t {response_message.content}")
```

**代码输出结果如下：**

```
👤 User>         How's the weather in San Francisco?
💭 Thinking>     Alright, the user is asking about the weather in San Francisco. This is a straightforward question that requires real-time information about current weather conditions.

Looking at the available tools, I see I have access to a "get_weather" tool that's specifically designed for this purpose. The tool requires a "location" parameter, which should be in the format of city and state, like "San Francisco, CA".

The user has clearly specified they want weather information for "San Francisco" in their question. However, they didn't include the state (California), which is recommended for the tool parameter. While "San Francisco" alone might be sufficient since it's a well-known city, for accuracy and to follow the parameter format, I should include the state as well.

Since I need to use the tool to get the current weather information, I'll need to call the "get_weather" tool with "San Francisco, CA" as the location parameter. This will provide the user with the most accurate and up-to-date weather information for their query.

I'll format my response using the required tool_calls XML tags and include the tool name and arguments in the specified JSON format.
💬 Model>        

🔧 Tool>         get_weather(San Francisco, US)
💭 Thinking>     Okay, I've received the user's question about the weather in San Francisco, and I've used the get_weather tool to retrieve the current conditions.

The tool has returned a simple response: "24℃, sunny". This gives me two pieces of information - the temperature is 24 degrees Celsius, and the weather condition is sunny. That's quite straightforward and matches what I would expect for San Francisco on a nice day.

Now I need to present this information to the user in a clear, concise way. Since the response from the tool was quite brief, I'll keep my answer similarly concise. I'll directly state the temperature and weather condition that the tool provided.

I should make sure to mention that this information is current, so the user understands they're getting up-to-date conditions. I don't need to provide additional details like humidity, wind speed, or forecast since the user only asked about the current weather.

The temperature is given in Celsius (24℃), which is the standard metric unit, so I'll leave it as is rather than converting to Fahrenheit, though I could mention the conversion if the user seems to be more familiar with Fahrenheit.

Since this is a simple informational query, I don't need to ask follow-up questions or suggest activities based on the weather. I'll just provide the requested information clearly and directly.

My response will be a single sentence stating the current temperature and weather conditions in San Francisco, which directly answers the user's question.
💬 Model>        The weather in San Francisco is currently sunny with a temperature of 24℃.
```

**返回结果**

```json  theme={null}
{
    "id": "05566b8d51ded3a3016d6cc100685cad",
    "choices": [
        {
            "finish_reason": "tool_calls",
            "index": 0,
            "message": {
                "content": "\n",
                "role": "assistant",
                "name": "MiniMax AI",
                "tool_calls": [
                    {
                        "id": "call_function_2831178524_1",
                        "type": "function",
                        "function": {
                            "name": "get_weather",
                            "arguments": "{\"location\": \"San Francisco, US\"}"
                        },
                        "index": 0
                    }
                ],
                "audio_content": "",
                "reasoning_details": [
                    {
                        "type": "reasoning.text",
                        "id": "reasoning-text-1",
                        "format": "MiniMax-response-v1",
                        "index": 0,
                        "text": "Let me think about this request. The user is asking about the weather in San Francisco. This is a straightforward request where they want to know current weather conditions in a specific location.\n\nLooking at the tools available to me, I have access to a \"get_weather\" tool that can retrieve weather information for a location. The tool requires a location parameter in the format of \"city, state\" or \"city, country\". In this case, the user has specified \"San Francisco\" which is a city in the United States.\n\nTo properly use the tool, I need to format the location parameter correctly. The tool description mentions examples like \"San Francisco, US\" which follows the format of city, country code. However, since the user just mentioned \"San Francisco\" without specifying the state, and San Francisco is a well-known city that is specifically in California, I could use \"San Francisco, CA\" as the parameter value instead.\n\nActually, \"San Francisco, US\" would also work since the user is asking about the famous San Francisco in the United States, and there aren't other well-known cities with the same name that would cause confusion. The US country code is explicit and clear.\n\nBoth \"San Francisco, CA\" and \"San Francisco, US\" would be valid inputs for the tool. I'll go with \"San Francisco, US\" since it follows the exact format shown in the tool description example and is unambiguous.\n\nSo I'll need to call the get_weather tool with the location parameter set to \"San Francisco, US\". This will retrieve the current weather information for San Francisco, which I can then present to the user."
                    }
                ]
            }
        }
    ],
    "created": 1762080909,
    "model": "MiniMax-M2",
    "object": "chat.completion",
    "usage": {
        "total_tokens": 560,
        "total_characters": 0,
        "prompt_tokens": 203,
        "completion_tokens": 357
    },
    "input_sensitive": false,
    "output_sensitive": false,
    "input_sensitive_type": 0,
    "output_sensitive_type": 0,
    "output_sensitive_int": 0,
    "base_resp": {
        "status_code": 0,
        "status_msg": ""
    }
}
```

#### 原生格式

由于OpenAI ChatCompletion API原生格式并不支持thinking返回与回传，因此模型的thinking以`<think>reasoning_content</think>`的形式注入到`content`字段中。开发者可以手动将其解析出来，用于展示。但我们强烈建议开发者使用Interleaved thinking友好格式。

`extra_body={"reasoning_split": False}` 的作用：

* 思考内容嵌入 content：模型的推理内容以 `<think>` 标签包裹在 `content` 字段中
* 需要手动解析：如果想单独展示推理内容，需要手动解析 `<think>` 标签

<Note>
  重要提醒：如果选用原生格式，请注意，在历史消息中，切勿修改`content`的内容，务必完整保留模型思考内容，即`<think>reasoning_content</think>`, 这样才能保证Interleaved Thinking生效，发挥模型的最佳性能！
</Note>

```python  theme={null}
from openai import OpenAI
import json

# 初始化客户端
client = OpenAI(
    api_key="<api-key>",
    base_url="https://api.minimaxi.com/v1",
)

# 定义工具：天气查询
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather of a location, the user should supply a location first.",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "The city and state, e.g. San Francisco, US",
                    }
                },
                "required": ["location"]
            },
        }
    },
]

def send_messages(messages):
    """发送消息并返回响应"""
    response = client.chat.completions.create(
        model="MiniMax-M2",
        messages=messages,
        tools=tools,
        # 设置 reasoning_split=False 将思考内容以 <think> 标签形式保留在 content 字段中
        extra_body={"reasoning_split": False},
    )
    return response.choices[0].message

# 1. 用户提问
messages = [{"role": "user", "content": "How's the weather in San Francisco?"}]
print(f"👤 User>\t {messages[0]['content']}")

# 2. 模型返回工具调用
response_message = send_messages(messages)

if response_message.tool_calls:
    tool_call = response_message.tool_calls[0]
    function_args = json.loads(tool_call.function.arguments)
    print(f"💬 Model>\t {response_message.content}")
    print(f"🔧 Tool>\t {tool_call.function.name}({function_args['location']})")

    # 3. 执行工具并返回结果
    messages.append(response_message)
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": "24℃, sunny"  # 实际应用中这里应该调用真实的天气API
    })

    # 4. 获取最终回复
    final_message = send_messages(messages)
    print(f"💬 Model>\t {final_message.content}")
else:
    print(f"💬 Model>\t {response_message.content}")
```

**代码输出结果如下：**

```nushell  theme={null}
👤 User>         How's the weather in San Francisco?
💬 Model>        <think>
Alright, the user is asking about the weather in San Francisco. This is a straightforward request that I can handle using the tools provided to me.

I see that I have access to a tool called "get_weather" which can provide weather information for a location. Looking at the parameters, it requires a "location" parameter which should be a string in the format of "city and state, e.g. San Francisco, US".

In this case, the user has already specified the location as "San Francisco", which is a major city in California, US. I need to format this properly for the tool call. Following the example format in the tool description, I should format it as "San Francisco, US".

The user didn't specify any other parameters or requirements, so a simple weather query should be sufficient. I don't need to ask for clarification since they've provided a clear location.

Let me prepare the tool call to get the weather information for San Francisco. I'll use the "get_weather" tool with the location parameter set to "San Francisco, US". This should return the current weather conditions for San Francisco, which is what the user is asking about.

Once I get the weather information back from the tool, I'll be able to provide the user with details about the current weather in San Francisco, such as temperature, conditions (sunny, cloudy, rainy, etc.), and possibly other relevant information like humidity or wind speed if that data is available.

So I'll proceed with making the tool call to get_weather with the location parameter.
</think>



🔧 Tool>         get_weather(San Francisco, US)
💬 Model>        <think>
Let me analyze what's happening in this conversation. The user asked about the weather in San Francisco, and I needed to provide them with this information.

Looking at the tools available to me, I have access to a "get_weather" tool that can retrieve weather information for a specific location. I used this tool and called it with the argument "location": "San Francisco, US" as specified in the tool's parameters.

The tool has now returned a response with the weather information for San Francisco. The response is quite concise - it simply states "24℃, sunny". This gives me two pieces of information:
1. The temperature is 24 degrees Celsius
2. The weather condition is sunny

This is exactly what the user wanted to know - how's the weather in San Francisco. The information is clear and straightforward.

Now I need to format this information in a clear, natural way for the user. Since the tool returned the temperature in Celsius, I'll use that unit rather than converting to Fahrenheit (though 24°C is about 75°F if the user happens to think in those terms).

I should keep my response concise since the weather information itself is simple. I don't need to add any caveats or additional explanations since the weather report is straightforward. I won't include any details about wind, humidity, or other meteorological data since the tool didn't provide that information.

So my response will simply state the current temperature and that it's sunny in San Francisco, which directly answers the user's question.
</think>

The weather in San Francisco is currently sunny with a temperature of 24℃.
```

**返回结果**

```json  theme={null}
{
	"id": "055b7928a143b2d21ad6b2bab2c8f8b2",
	"choices": [{
		"finish_reason": "tool_calls",
		"index": 0,
		"message": {
			"content": "<think>\nAlright, the user is asking about the weather in San Francisco. This is a straightforward request that I can handle using the tools provided to me.\n\nI see that I have access to a tool called \"get_weather\" which can provide weather information for a location. Looking at the parameters, it requires a \"location\" parameter which should be a string in the format of \"city and state, e.g. San Francisco, US\".\n\nIn this case, the user has already specified the location as \"San Francisco\", which is a major city in California, US. I need to format this properly for the tool call. Following the example format in the tool description, I should format it as \"San Francisco, US\".\n\nThe user didn't specify any other parameters or requirements, so a simple weather query should be sufficient. I don't need to ask for clarification since they've provided a clear location.\n\nLet me prepare the tool call to get the weather information for San Francisco. I'll use the \"get_weather\" tool with the location parameter set to \"San Francisco, US\". This should return the current weather conditions for San Francisco, which is what the user is asking about.\n\nOnce I get the weather information back from the tool, I'll be able to provide the user with details about the current weather in San Francisco, such as temperature, conditions (sunny, cloudy, rainy, etc.), and possibly other relevant information like humidity or wind speed if that data is available.\n\nSo I'll proceed with making the tool call to get_weather with the location parameter.\n</think>\n\n\n",
			"role": "assistant",
			"name": "MiniMax AI",
			"tool_calls": [{
				"id": "call_function_1202729600_1",
				"type": "function",
				"function": {
					"name": "get_weather",
					"arguments": "{\"location\": \"San Francisco, US\"}"
				},
				"index": 0
			}],
			"audio_content": ""
		}
	}],
	"created": 1762412072,
	"model": "MiniMax-M2",
	"object": "chat.completion",
	"usage": {
		"total_tokens": 560,
		"total_characters": 0,
		"prompt_tokens": 222,
		"completion_tokens": 338
	},
	"input_sensitive": false,
	"output_sensitive": false,
	"input_sensitive_type": 0,
	"output_sensitive_type": 0,
	"output_sensitive_int": 0,
	"base_resp": {
		"status_code": 0,
		"status_msg": ""
	}
}
```

## 注意事项

如果在使用MiniMax模型过程中遇到任何问题：

* 通过邮箱 [Model@minimaxi.com](mailto:Model@minimaxi.com) 等官方渠道联系我们的技术支持团队
* 在我们的 [Github](https://github.com/MiniMax-AI/MiniMax-M2/issues) 仓库提交Issue

## 推荐阅读

<Columns cols={2}>
  <Card title="在 AI 编程工具里使用 MiniMax-M2" icon="book-open" href="/guides/text-ai-coding-tools" arrow="true" cta="点击查看">
    具备代码理解能力，适用于代码助手等场景。
  </Card>

  <Card title="文本生成指南" icon="book-open" href="/guides/text-generation" cta="点击查看">
    支持通过 Anthropic 和 OpenAI 兼容接口进行文本生成调用
  </Card>

  <Card title="Anthropic API 兼容（推荐）" icon="book-open" href="/api-reference/text-anthropic-api" arrow="true" cta="点击查看">
    通过 Anthropic SDK 调用 MiniMax 模型
  </Card>

  <Card title="OpenAI API 兼容" icon="book-open" href="/api-reference/text-openai-api" arrow="true" cta="点击查看">
    通过 OpenAI SDK 调用 MiniMax 模型
  </Card>
</Columns>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt