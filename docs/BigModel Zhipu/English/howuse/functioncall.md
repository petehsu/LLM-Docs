[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fhowuse%2Ffunctioncall)

GLM Model Fully Upgraded

Invite friends & Get rewards

Get up to 200M Tokens

![大模型](https://cdn.bigmodel.cn/static/platform/images/logo/white_logo.png)

Try Zhipu’s New Flagship

GLM-4.6!

### Sign Up to Unlock AI capabilities

* Expert at coding, agents, reasoning, and more
* Get 20 millionfree Tokens on registration

Scan code

![智谱AI](https://cdn.bigmodel.cn/static/platform/images/activity/university/pop_right_bottom_new.png)

绑定手机号

确 定

[Welcome](/dev/welcome)  [Guide](/dev/howuse)  [API Documentation](/dev/api)  [Guidelines](/dev/guidelines)  [ReleaseNotes](/dev/releasenotes)  [FAQs](/dev/faq)  [Model Benefit](/dev/activities) 

`⌘``K`

GET STARTED

[* Overview](/dev/howuse/introduction)

[* Models](/dev/howuse/model)

[* Scenario Examples](/dev/howuse/openpower)

LEARN ABOUT MODELS

* Language Model

  [+ GLM-4-Plus](/dev/howuse/llm/glm-4-plus)

  [+ GLM-4-Air-250414](/dev/howuse/llm/GLM-4-Air-250414)

  [+ GLM-4-AirX](/dev/howuse/llm/GLM-4-AirX)

  [+ GLM-4-Long](/dev/howuse/llm/GLM-4-Long)

  [+ GLM-4-FlashX-250414](/dev/howuse/llm/GLM-4-FlashX-250414)

* Reasoning Model

  [+ GLM-Z1-Air](/dev/howuse/reasoning_models/GLM-Z1-Air)

  [+ GLM-Z1-AirX](/dev/howuse/reasoning_models/GLM-Z1-AirX)

  [+ GLM-Z1-FlashX](/dev/howuse/reasoning_models/GLM-Z1-FlashX)

* Visual Language Model

  [+ GLM-4V-Plus-0111](/dev/howuse/vlm/GLM-4V-Plus-0111)

* GLM-4.1V-Thinking

  [+ GLM-4.1V-Thinking](/dev/howuse/visual-reasoning-model/glm-4.1v-thinking)

* Image Generation Model

  [+ CogView-4](/dev/howuse/image-generation-model/cogview-4)

* Video Generation Model

  [+ CogVideoX-3](/dev/howuse/video-generation-model/CogVideoX-3)

  [+ CogVideoX-2](/dev/howuse/video-generation-model/CogVideoX-2)

  [+ Vidu Q1](/dev/howuse/video-generation-model/ViduQ1)

  [+ Vidu 2](/dev/howuse/video-generation-model/Vidu2)

* Audio and Video Model

  [+ GLM-Realtime](/dev/howuse/audio-and-video-model/GLM-Realtime)

  [+ GLM-4-Voice](/dev/howuse/audio-and-video-model/GLM-4-Voice)

  [+ GLM-ASR](/dev/howuse/audio-and-video-model/GLM-ASR)

CAPABILITIES

[* Web Search](/dev/howuse/websearch)

[* Function Call](/dev/howuse/functioncall)

[* Retrieval](/dev/howuse/retrieval)

[* Fine-tuning](/dev/howuse/finetuning)

[* FileQA](/dev/howuse/fileqa)

[* evaluator](/dev/howuse/model_evaluator)

[* Batch](/dev/howuse/batchapi)

[* Sandbox](/dev/howuse/glm4-toolkit)

[* JSON Format](/dev/howuse/jsonformat)

Agent Development Platform

[* help\_document](/dev/howuse/help_document)

GUIDES

[* Prompt Engineering](/dev/howuse/prompt)

[* Content security](/dev/howuse/securityaudit)

[* Model Migrate](/dev/howuse/model-migration)

[* User Benefits](/dev/howuse/equity-explain)

[* Model Filing](/dev/howuse/Filing)

POLICIES

[* User Agreement](/dev/howuse/useragreement)

[* Privacy Policy](/dev/howuse/privacypolicy)

[* Platform Agreement](/dev/howuse/serviceagreement)

[* Recharge Agreement](/dev/howuse/rechargeagreement)

[* Termination Agreement](/dev/howuse/termination-agreement)

[* Account Change](/dev/howuse/subjectchanage)

[* University X Plan - Application Instructions](/dev/howuse/application-agreement)

[* AI Principle](/dev/howuse/principle)

[* Security & Risk](/dev/howuse/safetytips)

[FAQ](//docs.bigmodel.cn/cn/faq) 

Customer Service

[Work Order](/ticket-submit) 

Consultation

[400-6883-991](tel:4006883991)

Weekdays 9:30-18:00

Help Center 

![ZHIPU·AI](https://cdn.bigmodel.cn/static/platform/images/qr-code/technical_community.png)

##### Scan via Wechat

User Group

# Function Call with ChatGLM

The function call feature of ChatGLM can enhance model inference or perform other external operations, including information retrieval, database operations, knowledge graph search and reasoning, operating systems, triggering external operations, and other tool call scenarios.

This tutorial will introduce how to use the function call feature of ChatGLM to connect the model with external function libraries.

The `tools` parameter is an optional parameter in the content generation API, used to provide function definitions to the model. Through this parameter, the model can generate function parameters that conform to the specifications provided by the user. Note that the API will not actually execute any function calls; it only returns the parameters needed for function calls. Developers can use the parameters output by the model to execute function calls in their applications.

This tutorial includes the following three parts:

1. How to use the Chat Completion interface to describe external functions to the model.
2. How to interact with the model to trigger function calls.
3. How to use the results generated by the model to call external functions.

## Describing External Functions

Suppose we want to create a chatbot with flight query functionality. We define the following two external functions for the model to choose from:

1. Function to query flight numbers between two locations on a specific date: `get_flight_number(departure: str, destination: str, date: str)`
2. Function to query ticket prices for a specific flight on a specific date: `get_ticket_price(flight_number: str, date: str)`

### Describing Function Capabilities

To describe the external function library to the model, you need to pass a list of callable functions to the `tools` field. The parameters are as follows:

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| type | String | Yes | Set to “function” |
| function | Object | Yes |  |
| name | String | Yes | Function name |
| description | String | Yes | Describes the function’s capabilities. The model uses this description to determine how to call the function. |
| parameters | Object | Yes | The `parameters` field requires a JSON Schema object to accurately define the parameters accepted by the function. |

Example:

```
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_flight_number",
            "description": "Query the flight number based on the departure, destination, and date",
            "parameters": {
                ......
            },
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_ticket_price",
            "description": "Query the ticket price for a specific flight on a specific date",
            "parameters": {
                ......
            },
        }
    },
]
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22

The `parameters` parameter is omitted here, and we will introduce how to describe the function parameters in the next section.

### Writing the JSON Description of Function Parameters

To accurately define the function’s parameter list, it is recommended to include at least the following fields when writing the JSON Schema for the parameter list:

* `description`: Describes the function’s purpose.
* `type`: Defines the data type constraints for the JSON data.
* `properties`: An object where each property represents a key in the JSON data to be defined.
* `required`: Specifies which properties must be included in the data.
* `enum`: If a property is of an enumerated type, this field should be set to an array of enumerated values.

The complete `tools` field setup is as follows:

```
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_flight_number",
            "description": "Query the flight number based on the departure, destination, and date",
            "parameters": {
                "type": "object",
                "properties": {
                    "departure": {
                        "description": "Departure location",
                        "type": "string"
                    },
                    "destination": {
                        "description": "Destination location",
                        "type": "string"
                    },
                    "date": {
                        "description": "Date",
                        "type": "string",
                    }
                },
                "required": [ "departure", "destination", "date" ]
            },
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_ticket_price",
            "description": "Query the ticket price for a specific flight on a specific date",
            "parameters": {
                "type": "object",
                "properties": {
                    "flight_number": {
                        "description": "Flight number",
                        "type": "string"
                    },
                    "date": {
                        "description": "Date",
                        "type": "string",
                    }
                },
                "required": [ "flight_number", "date"]
            },
        }
    },
]
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22  
23  
24  
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47  
48

### Function Call Selection

If the `functions` parameter is filled in the `tools` parameter, the model will decide when it is appropriate to use one of the functions by default. To control how the model selects function calls, you need to set the `tool_choice` parameter. The default value is `auto`, in which case the model selects whether to return a function call based on context information. Setting it to `{"name": "your_function_name"}` can force the API to return a call to a specific function. You can also force the API not to return any function calls by setting the `tool_choice` parameter to `"none"`. Currently, function calls only support the `auto` mode.

## Function Call Process Practice

This section will use the previously defined flight query chatbot as an example to introduce how to interact with the model to complete function calls.

Initialize the function definitions and client:

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="")
messages = []
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_flight_number",
            "description": "Query the flight number based on the departure, destination, and date",
            "parameters": {
                "type": "object",
                "properties": {
                    "departure": {
                        "description": "Departure location",
                        "type": "string"
                    },
                    "destination": {
                        "description": "Destination location",
                        "type": "string"
                    },
                    "date": {
                        "description": "Date",
                        "type": "string",
                    }
                },
                "required": [ "departure", "destination", "date" ]
            },
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_ticket_price",
            "description": "Query the ticket price for a specific flight on a specific date",
            "parameters": {
                "type": "object",
                "properties": {
                    "flight_number": {
                        "description": "Flight number",
                        "type": "string"
                    },
                    "date": {
                        "description": "Date",
                        "type": "string",
                    }
                },
                "required": [ "flight_number", "date"]
            },
        }
    },
]
messages = []
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22  
23  
24  
25  
26  
27  
28  
29  
30  
31  
32  
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47  
48  
49  
50  
51  
52

We want to query the flights from Beijing to Shanghai on January 20, 2024. We provide this information to the model:

```
messages = []
messages.append({"role": "user", "content": "Help me query the flights from Beijing to Shanghai on January 20, 2024"})
response = client.chat.completions.create(
    model="glm-4",  # Fill in the name of the model to be called
    messages=messages,
    tools=tools,
)
print(response.choices[0].message)
messages.append(response.choices[0].message.model_dump())
```

1  
2  
3  
4  
5  
6  
7  
8  
9

At this point, the model successfully triggers a call to the `get_flight_number` function with the parameters: `date="2024-01-20"`, `departure="北京"`, `destination="上海"`

```
content=None role='assistant' tool_calls=[CompletionMessageToolCall(id='call_8252663420321749719', function=Function(arguments='{"date":"2024-01-20","departure":"北京","destination":"上海"}', name='get_flight_number'), type='function')]
```

1

Now, clear the message history. We try to provide information to trigger a call to the `get_ticket_price` function.

```
messages = []
messages.append({"role": "system", "content": "Do not assume or guess the values of parameters passed to functions. If the user's description is unclear, ask the user for necessary information"})
messages.append({"role": "user", "content": "Help me query the ticket price for flight 1234 on January 20, 2024"})
response = client.chat.completions.create(
    model="glm-4",  # Fill in the name of the model to be called
    messages=messages,
    tools=tools,
)
print(response.choices[0].message)
messages.append(response.choices[0].message.model_dump())
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10

At this point, the model successfully triggers a call to the `get_ticket_price` function with the parameters: `date="2024-01-20"`, `flight_number="1234"`

```
content=None role='assistant' tool_calls=[CompletionMessageToolCall(id='call_8252648611274312180', function=Function(arguments='{"date":"2024-01-20","flight_number":"1234"}', name='get_ticket_price'), type='function')]
```

1

We can also force the model to use a specific function, for example, by setting `tool_choice` to `{"type": "function", "function": {"name": "get_ticket_price"}}` to force the model to generate parameters for calling `get_ticket_price`.

```
messages = []
messages.append({"role": "system", "content": "Do not assume or guess the values of parameters passed to functions. If the user's description is unclear, ask the user for necessary information"})
messages.append({"role": "user", "content": "Help me query the ticket price for flight 1234"})
response = client.chat.completions.create(
    model="glm-4",  # Fill in the name of the model to be called
    messages=messages,
    tools=tools,
    tool_choice={"type": "function", "function": {"name": "get_ticket_price"}},
)
print(response.choices[0].message)
messages.append(response.choices[0].message.model_dump())
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11

At this point, the model is forced to trigger a call to the `get_ticket_price` function with the parameters: `date="2022-01-01"`, `flight_number="1234"`. Note that the model assumes a `date`.

```
content=None role='assistant' tool_calls=[CompletionMessageToolCall(id='call_8252663214163297577', function=Function(arguments='{"date":"2022-01-01","flight_number":"1234"}', name='get_ticket_price'), type='function')]
```

1

We can also force the model not to call any functions by setting `tool_choice` to `none`.

## Using Parameters Generated by the Model to Call Functions

Implement the required functions:

```
def get_flight_number(date: str, departure: str, destination: str):
    flight_number = {
        "北京": {
            "上海": "1234",
            "广州": "8321",
        },
        "上海": {
            "北京": "1233",
            "广州": "8123",
        }
    }
    return {"flight_number": flight_number[departure][destination]}

def get_ticket_price(date: str, flight_number: str):
    return {"ticket_price": "1000"}
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15

Define the function to handle Function Call:

```
def parse_function_call(model_response, messages):
    # Process the function call result, call the corresponding function based on the parameters returned by the model.
    # After the function returns the result, construct a tool message and call the model again, inputting the function result into the model.
    # The model will return the function call result in natural language format to the user.
    if model_response.choices[0].message.tool_calls:
        tool_call = model_response.choices[0].message.tool_calls[0]
        args = tool_call.function.arguments
        function_result = {}
        if tool_call.function.name == "get_flight_number":
            function_result = get_flight_number(**json.loads(args))
        if tool_call.function.name == "get_ticket_price":
            function_result = get_ticket_price(**json.loads(args))
        messages.append({
            "role": "tool",
            "content": f"{json.dumps(function_result)}",
            "tool_call_id": tool_call.id
        })
        response = client.chat.completions.create(
            model="glm-4",  # Fill in the name of the model to be called
            messages=messages,
            tools=tools,
        )
        print(response.choices[0].message)
        messages.append(response.choices[0].message.model_dump())
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22  
23  
24

Query the flight from Beijing to Guangzhou:

```
# Clear the conversation
messages = []

messages.append({"role": "system", "content": "Do not assume or guess the values of parameters passed to functions. If the user's description is unclear, ask the user for necessary information"})
messages.append({"role": "user", "content": "Help me query the flight from Beijing to Guangzhou on January 23"})

response = client.chat.completions.create(
    model="glm-4",  # Fill in the name of the model to be called
    messages=messages,
    tools=tools,
)
print(response.choices[0].message)
messages.append(response.choices[0].message.model_dump())

parse_function_call(response, messages)
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15

Return:

```
content=None role='assistant' tool_calls=[CompletionMessageToolCall(id='call_8282666790542042140', function=Function(arguments='{"date":"2023-01-23","departure":"北京","destination":"广州"}', name='get_flight_number'), type='function')]
content='According to your request, I have successfully queried the flight number for January 23 from Beijing to Guangzhou, which is 8321.' role='assistant' tool_calls=None
```

1  
2

Query the ticket price for flight 1234:

```
messages.append({"role": "user", "content": "What is the price of this flight?"})
response = client.chat.completions.create(
    model="glm-4",  # Fill in the name of the model to be called
    messages=messages,
    tools=tools,
)
print(response.choices[0].message)
messages.append(response.choices[0].message.model_dump())

parse_function_call(response, messages)
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10

Return:

```
content=None role='assistant' tool_calls=[CompletionMessageToolCall(id='call_8282666893621289712', function=Function(arguments='{"date":"2023-01-23","flight_number":"8321"}', name='get_ticket_price'), type='function')]
content='The ticket price for this flight is 1000 yuan.' role='assistant' tool_calls=None
```

1  
2

Table of contents

Describing External Functions

Describing Function Capabilities

Writing the JSON Description of Function Parameters

Function Call Selection

Function Call Process Practice

Using Parameters Generated by the Model to Call Functions