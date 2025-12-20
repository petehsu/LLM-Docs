# Thinking Mode

On this page

# Thinking Mode

The DeepSeek model supports the thinking mode: before outputting the final answer, the model will first output a chain-of-thought reasoning to improve the accuracy of the final response. You can enable thinking mode using any of the following methods:

  1. Set the `model` parameter: `"model": "deepseek-reasoner"`

  2. Set the `thinking` parameter: `"thinking": {"type": "enabled"}`

If you are using the OpenAI SDK, when setting `thinking` parameter, you need to pass the `thinking` parameter within `extra_body`:
    
    
    response = client.chat.completions.create(  
      model="deepseek-chat",  
      # ...  
      extra_body={"thinking": {"type": "enabled"}}  
    )  
    

## API Parameters​

  * **Input** ：

    * `max_tokens`：The maximum output length (including the COT part). Default to 32K, maximum to 64K.
  * **Output** ：

    * `reasoning_content`：The content of the CoT，which is at the same level as `content` in the output structure. See API Example for details.
    * `content`: The content of the final answer.
    * `tool_calls`: The tool calls.
  * **Supported Features** ：[Json Output](</guides/json_mode>)、[Tool Calls](</guides/tool_calls>)、[Chat Completion](</api/create-chat-completion>)、[Chat Prefix Completion (Beta)](</guides/chat_prefix_completion>)

  * **Not Supported Features** ：FIM (Beta)

  * **Not Supported Parameters** ：`temperature`、`top_p`、`presence_penalty`、`frequency_penalty`、`logprobs`、`top_logprobs`. Please note that to ensure compatibility with existing software, setting `temperature`、`top_p`、`presence_penalty`、`frequency_penalty` will not trigger an error but will also have no effect. Setting `logprobs`、`top_logprobs` will trigger an error.

## Multi-turn Conversation​

In each turn of the conversation, the model outputs the CoT (`reasoning_content`) and the final answer (`content`). In the next turn of the conversation, the CoT from previous turns is not concatenated into the context, as illustrated in the following diagram:

![](/img/deepseek_r1_multiround_example_en.jpeg)

## API Example​

The following code, using Python as an example, demonstrates how to access the CoT and the final answer, as well as how to conduct multi-turn conversations. Note that in the code for the new turn of conversation, only the `content` from the previous turn's output is passed, while the `reasoning_content` is ignored.

  * NoStreaming
  * Streaming

    
    
    from openai import OpenAI  
    client = OpenAI(api_key="<DeepSeek API Key>", base_url="https://api.deepseek.com")  
      
    # Turn 1  
    messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]  
    response = client.chat.completions.create(  
        model="deepseek-reasoner",  
        messages=messages  
    )  
      
    reasoning_content = response.choices[0].message.reasoning_content  
    content = response.choices[0].message.content  
      
    # Turn 2  
    messages.append({'role': 'assistant', 'content': content})  
    messages.append({'role': 'user', 'content': "How many Rs are there in the word 'strawberry'?"})  
    response = client.chat.completions.create(  
        model="deepseek-reasoner",  
        messages=messages  
    )  
    # ...  
    
    
    
    from openai import OpenAI  
    client = OpenAI(api_key="<DeepSeek API Key>", base_url="https://api.deepseek.com")  
      
    # Turn 1  
    messages = [{"role": "user", "content": "9.11 and 9.8, which is greater?"}]  
    response = client.chat.completions.create(  
        model="deepseek-reasoner",  
        messages=messages,  
        stream=True  
    )  
      
    reasoning_content = ""  
    content = ""  
      
    for chunk in response:  
        if chunk.choices[0].delta.reasoning_content:  
            reasoning_content += chunk.choices[0].delta.reasoning_content  
        else:  
            content += chunk.choices[0].delta.content  
      
    # Turn 2  
    messages.append({"role": "assistant", "content": content})  
    messages.append({'role': 'user', 'content': "How many Rs are there in the word 'strawberry'?"})  
    response = client.chat.completions.create(  
        model="deepseek-reasoner",  
        messages=messages,  
        stream=True  
    )  
    # ...  
    

## Tool Calls​

DeepSeek model's thinking mode now supports tool calls. Before outputting the final answer, the model can engage in multiple turns of reasoning and tool calls to improve the quality of the response. The calling pattern is illustrated below:

![](/img/v3.2_thinking_with_tools_en.jpeg)

  * During the process of answering question 1 (Turn 1.1 - 1.3), the model performed multiple turns of thinking + tool calls before providing the answer. During this process, the user needs to send the reasoning content (`reasoning_content`) back to the API to allow the model to continue reasoning.

  * When the next user question begins (Turn 2.1), the previous `reasoning_content` should be removed, while keeping other elements to send to the API. If `reasoning_content` is retained and sent to the API, the API will ignore it.

### Compatibility Notice​

Since the tool invocation process in thinking mode requires users to pass back `reasoning_content` to the API, if your code does not correctly pass back `reasoning_content`, the API will return a 400 error. Please refer to the sample code below for the correct way.

### Sample Code​

Below is a simple sample code for tool calls in thinking mode:
    
    
    import os  
    import json  
    from openai import OpenAI  
      
    # The definition of the tools  
    tools = [  
        {  
            "type": "function",  
            "function": {  
                "name": "get_date",  
                "description": "Get the current date",  
                "parameters": { "type": "object", "properties": {} },  
            }  
        },  
        {  
            "type": "function",  
            "function": {  
                "name": "get_weather",  
                "description": "Get weather of a location, the user should supply the location and date.",  
                "parameters": {  
                    "type": "object",  
                    "properties": {  
                        "location": { "type": "string", "description": "The city name" },  
                        "date": { "type": "string", "description": "The date in format YYYY-mm-dd" },  
                    },  
                    "required": ["location", "date"]  
                },  
            }  
        },  
    ]  
      
    # The mocked version of the tool calls  
    def get_date_mock():  
        return "2025-12-01"  
      
    def get_weather_mock(location, date):  
        return "Cloudy 7~13°C"  
      
    TOOL_CALL_MAP = {  
        "get_date": get_date_mock,  
        "get_weather": get_weather_mock  
    }  
      
    def clear_reasoning_content(messages):  
        for message in messages:  
            if hasattr(message, 'reasoning_content'):  
                message.reasoning_content = None  
      
    def run_turn(turn, messages):  
        sub_turn = 1  
        while True:  
            response = client.chat.completions.create(  
                model='deepseek-chat',  
                messages=messages,  
                tools=tools,  
                extra_body={ "thinking": { "type": "enabled" } }  
            )  
            messages.append(response.choices[0].message)  
            reasoning_content = response.choices[0].message.reasoning_content  
            content = response.choices[0].message.content  
            tool_calls = response.choices[0].message.tool_calls  
            print(f"Turn {turn}.{sub_turn}\n{reasoning_content=}\n{content=}\n{tool_calls=}")  
            # If there is no tool calls, then the model should get a final answer and we need to stop the loop  
            if tool_calls is None:  
                break  
            for tool in tool_calls:  
                tool_function = TOOL_CALL_MAP[tool.function.name]  
                tool_result = tool_function(**json.loads(tool.function.arguments))  
                print(f"tool result for {tool.function.name}: {tool_result}\n")  
                messages.append({  
                    "role": "tool",  
                    "tool_call_id": tool.id,  
                    "content": tool_result,  
                })  
            sub_turn += 1  
      
    client = OpenAI(  
        api_key=os.environ.get('DEEPSEEK_API_KEY'),  
        base_url=os.environ.get('DEEPSEEK_BASE_URL'),  
    )  
      
    # The user starts a question  
    turn = 1  
    messages = [{  
        "role": "user",  
        "content": "How's the weather in Hangzhou Tomorrow"  
    }]  
    run_turn(turn, messages)  
      
    # The user starts a new question  
    turn = 2  
    messages.append({  
        "role": "user",  
        "content": "How's the weather in Hangzhou Tomorrow"  
    })  
    # We recommended to clear the reasoning_content in history messages so as to save network bandwidth  
    clear_reasoning_content(messages)  
    run_turn(turn, messages)  
    

In each sub-request of Turn 1, the `reasoning_content` generated during that turn is sent to the API, allowing the model to continue its previous reasoning. `response.choices[0].message` contains all necessary fields for the `assistant` message, including `content`, `reasoning_content`, and `tool_calls`. For simplicity, you can directly append the message to the end of the messages list using the following code:
    
    
    messages.append(response.choices[0].message)  
    

This line of code is equivalent to:
    
    
    messages.append({  
        'role': 'assistant',  
        'content': response.choices[0].message.content,  
        'reasoning_content': response.choices[0].message.reasoning_content,  
        'tool_calls': response.choices[0].message.tool_calls,  
    })  
    

At the beginning of Turn 2, we recommend discarding the `reasoning_content` from previous turns to save network bandwidth:
    
    
    clear_reasoning_content(messages)  
    

The sample output of this code is as follows:
    
    
    Turn 1.1  
    reasoning_content="The user is asking about the weather in Hangzhou tomorrow. I need to get the current date first, then calculate tomorrow's date, and then call the weather API. Let me start by getting the current date."  
    content=''  
    tool_calls=[ChatCompletionMessageToolCall(id='call_00_Tcek83ZQ4fFb1RfPQnsPEE5w', function=Function(arguments='{}', name='get_date'), type='function', index=0)]  
    tool_result(get_date): 2025-12-01  
      
    Turn 1.2  
    reasoning_content='Today is December 1, 2025. Tomorrow is December 2, 2025. I need to format the date as YYYY-mm-dd: "2025-12-02". Now I can call get_weather with location Hangzhou and date 2025-12-02.'  
    content=''  
    tool_calls=[ChatCompletionMessageToolCall(id='call_00_V0Uwt4i63m5QnWRS1q1AO1tP', function=Function(arguments='{"location": "Hangzhou", "date": "2025-12-02"}', name='get_weather'), type='function', index=0)]  
    tool_result(get_weather): Cloudy 7~13°C  
      
    Turn 1.3  
    reasoning_content="I have the weather information: Cloudy with temperatures between 7 and 13°C. I should respond in a friendly, helpful manner. I'll mention that it's for tomorrow (December 2, 2025) and give the details. I can also ask if they need any other information. Let's craft the response."  
    content="Tomorrow (Tuesday, December 2, 2025) in Hangzhou will be **cloudy** with temperatures ranging from **7°C to 13°C**.  \n\nIt might be a good idea to bring a light jacket if you're heading out. Is there anything else you'd like to know about the weather?"  
    tool_calls=None  
      
    Turn 2.1  
    reasoning_content="The user wants clothing advice for tomorrow based on the weather in Hangzhou. I know tomorrow's weather: cloudy, 7-13°C. That's cool but not freezing. I should suggest layered clothing, maybe a jacket, long pants, etc. I can also mention that since it's cloudy, an umbrella might not be needed unless there's rain chance, but the forecast didn't mention rain. I should be helpful and give specific suggestions. I can also ask if they have any specific activities planned to tailor the advice. Let me respond."  
    content="Based on tomorrow's forecast of **cloudy weather with temperatures between 7°C and 13°C** in Hangzhou, here are some clothing suggestions:\n\n**Recommended outfit:**\n- **Upper body:** A long-sleeve shirt or sweater, plus a light to medium jacket (like a fleece, windbreaker, or light coat)\n- **Lower body:** Long pants or jeans\n- **Footwear:** Closed-toe shoes or sneakers\n- **Optional:** A scarf or light hat for extra warmth, especially in the morning and evening\n\n**Why this works:**\n- The temperature range is cool but not freezing, so layering is key\n- Since it's cloudy but no rain mentioned, you likely won't need an umbrella\n- The jacket will help with the morning chill (7°C) and can be removed if you warm up during the day\n\n**If you have specific plans:**\n- For outdoor activities: Consider adding an extra layer\n- For indoor/office settings: The layered approach allows you to adjust comfortably\n\nWould you like more specific advice based on your planned activities?"  
    tool_calls=None