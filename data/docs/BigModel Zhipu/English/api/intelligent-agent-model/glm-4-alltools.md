[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Fintelligent-agent-model%2Fglm-4-alltools)

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

API REFERENCE

* SDK Calling

  [+ Installation](/dev/api/devguide/sdk-install)

  [+ Authentication](/dev/api/devguide/sdk-auth)

  [+ sdk\_example](/dev/api/devguide/sdk_example)

* HTTP Request

  [+ API Request](/dev/api/http-call/http-para)

  [+ Authentication](/dev/api/http-call/http-auth)

* More Frameworks

  [+ OpenAI SDK](/dev/api/thirdparty-frame/openai-sdk)

  [+ Langchain SDK](/dev/api/thirdparty-frame/langchain-sdk)

APIs

* Language models

  [+ GLM-4 Models](/dev/api/normal-model/glm-4)

  [+ GLM-4V Models](/dev/api/normal-model/glm-4v)

* Reasoning models

  [+ GLM-Z1](/dev/api/Reasoning-models/glm-z1)

* Video Generation

  [+ CogVideoX](/dev/api/videomodel/cogvideox)

  [+ CogVideoX-3](/dev/api/videomodel/cogvideox-3)

  [+ Vidu Models](/dev/api/videomodel/vidu)

* Audio-Video

  [+ GLM-4-Voice](/dev/api/rtav/GLM-4-Voice)

  [+ GLM-Realtime](/dev/api/rtav/GLM-Realtime)

  [+ GLM-ASR](/dev/api/rtav/glm-asr)

* Reasoning models

  [+ GLM-4.1V-Thinking](/dev/api/visual-reasoning-model/GLM-4.1V-Thinking)

* Agent

  [+ TranslationAgent](/dev/api/agent/general_translation)

  [+ Professional Document Translation](/dev/api/agent/doc_translation_agent)

  [+ Social Science and Literary Translation](/dev/api/agent/social_literature_translation_agent)

  [+ Subtitle Translation for Film and Television](/dev/api/agent/subtitle_translation_agent)

  [+ Social Media Translation](/dev/api/agent/social_translation_agent)

  [+ AI Drawing](/dev/api/agent/ai_drawing_agent)

  [+ AI Comics](/dev/api/agent/cartoon_generator_agent)

  [+ Popular Special Effects Videos](/dev/api/agent/vidu_template_agent)

  [+ Resume and Job Matching Assistant](/dev/api/agent/job_matching_agent)

  [+ Customer Service Script Quality Inspection](/dev/api/agent/service_check_agent)

  [+ Sales Quality Inspection](/dev/api/agent/sales_check_agent)

  [+ Bill Recognition](/dev/api/agent/receipt_recognition_agent)

  [+ Clothes Recognition](/dev/api/agent/clothes_recognition_agent)

  [+ Contract Analysis](/dev/api/agent/contract_parser_agent)

  [+ Tendering Analysis Agent](/dev/api/agent/bidding_parser_agent)

  [+ Winning Bid Analysis Agent](/dev/api/agent/bidwin_parser_agent)

  [+ Intelligent Problem Solving](/dev/api/agent/intelligent_education_solve_agent)

  [+ Homework Grading](/dev/api/agent/intelligent_education_correction_agent)

* search-tool

  [+ Web Search API](/dev/api/search-tool/web-search)

  [+ Web Search in Chat](/dev/api/search-tool/websearch-in-chat)

  [+ Search Agent](/dev/api/search-tool/agent-search)

* Image Generation

  [+ CogView-4](/dev/api/image-model/cogview)

* Agent Model

  [+ GLM-4-AllTools](/dev/api/intelligent-agent-model/glm-4-alltools)

  [+ GLM-4-Assistant](/dev/api/intelligent-agent-model/assistantapi)

* Code Programming

  [+ CodeGeeX-4](/dev/api/code-model/codegeex-4)

* Embedding

  [+ Embedding](/dev/api/vector/embedding)

* Moderations

  [+ moderations](/dev/api/moderations/moderations)

* Role-playing

  [+ CharGLM-4](/dev/api/super-humanoid/charglm-4)

  [+ Emohaa](/dev/api/super-humanoid/emohaa)

* Agent Development Platform

  [+ 【New】qingliuagent](/dev/api/Agent_Platform/newagent)

  [+ agent](/dev/api/Agent_Platform/agent)

  [+ qingliuSDK](/dev/api/Agent_Platform/agentsdk)

  [+ Knowledge](/dev/api/Agent_Platform/knowledge)

  [+ FinAgent](/dev/api/Agent_Platform/FinAgent)

* Batch

  [+ Batch](/dev/api/batch-api/batch)

* Data Management

  [+ File Management](/dev/api/knowlage-manage/queryfile)

  [+ File content extraction](/dev/api/knowlage-manage/queryextract)

  [+ Rerank](/dev/api/knowlage-manage/rerank)

* Error Codes

  [+ HTTP Status Codes](/dev/api/error-code/error-code-v4)

  [+ Model Error Codes](/dev/api/error-code/service-error)

More

[* Libraries](/dev/api/libraries)

[* API Pricing](/dev/api/product-billing)

[* Tokenizer](/dev/api/tokenizer)

[* Parameter Description](/dev/api/parameter-description)

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

# GLM-4-AllTools

Model Encoding: glm-4-alltools

Description: The AllTools model plans by analyzing user questions, selects the appropriate tools, and step by step analyzes and takes the next action to ultimately complete a complex task. The AllTools API provides developers with a powerful set of tools, including code interpreter, drawing tools, and search tools, enabling the construction of highly specialized AI assistants within applications.

## Streaming call

### API request

| Transmission Method | Details |
| --- | --- |
| Transmission Method | https |
| Request Address | https://open.bigmodel.cn/api/paas/v4/chat/completions |
| Calling Method | Only supports SSE calling |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON or Standard Stream Event |
| Interface Request Type | POST |
| Development Language | Any development language that can initiate HTTP requests |

### Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| model | String | Yes | The model code to be invoked. |
| messages | List<Object> | Yes | When invoking the language model, the current conversation message list is provided as a prompt input to the model in the form of a JSON array. Possible message types include System message, User message, Assistant message, and Tool message.When the status returned by the previous round of dialogue is `requires_action` , it indicates that the user needs to operate the tool and submit a Tool Message. It is advisable to avoid defining tools or tool names in system instructions, as this may conflict with existing tool names and affect the effectiveness of the tool’s use. |
| role | String | Yes | Role of the message. could be one of system,user,assistant or tool. |
| content | List<Object> | Yes | `messages=[ { "role": "user", "content": [ { "type": "text", "text": "Calculate the mean and variance of [5,10,20,700,99,310,978,100]. " } ] } ]` |
| type | String | Yes | Type of the message content. can be ‘text’ for textual input. |
| text | String | Yes | Text content for ‘text’ type messages. |
| request\_id | String | No | Passed by the user end, it needs to be unique; used to distinguish the unique identifier of each request. If not provided by the user end, the platform will generate it by default. |
| do\_sample | Boolean | No | When do\_sample is true, the sampling strategy is enabled; when do\_sample is false, the sampling strategy parameters such as temperature and top\_p will not be effective. The default value is true. |
| stream | Boolean | Yes | Only support SSE invocation, set to True. The model will return the generated content piece by piece through the standard Event Stream. When the Event Stream ends, data: [DONE] message will be returned. Note: During the process of the model’s stream output, we will detect the generated content in batches. If illegal or inappropriate content is detected, the API will return an error code (1301). Developers should take measures (such as clearing the screen, restarting the conversation) promptly to delete the generated content and ensure that content containing illegal or inappropriate information is not passed to the model for further generations, to avoid negative impacts. |
| temperature | Float | No | Sampling temperature, controlling the randomness of the output, must be a positive number The value range is `(0.0, 1.0)`, it can’t be 0, the default value is 0.95. A higher value makes the output more random and creative; a lower value makes the output more stable or deterministic. It is recommended to adjust the `top_p` or `temperature` parameter according to the application scenario, but do not adjust both parameters simultaneously. |
| top\_p | Float | No | Another method of temperature sampling, known as nucleus sampling. The value range is `(0.0, 1.0)` open interval, it can’t be 0 or 1, the default value is 0.7. The model considers the results of tokens with the `top_p` probability quality. For example: 0.1 means that the model’s decoder only considers tokens from the top 10% of the candidate set. It is recommended to adjust the `top_p` or `temperature` parameter according to the application scenario, but do not adjust both parameters simultaneously. |
| max\_tokens | Integer | No | Maximum tokens output by the model, maximum output is 20,480 tokens。 |
| tools | List<Object> | No | Tools that can be called by the model. |
| type | String | Yes | Tools that can be called by the model. Could be one of `function`,`code_interpreter`,`drawing_tool`,`web_browser` |
| function | Object | No | Only when the tool type is `function`, this supplement necessary.When the tool is a function call, a return status of `requires_action` indicates that the user needs to submit the result of the function execution. |
| name | String | Yes | Function name. can only contain a-z, A-Z, 0-9, underscore, and hyphen. The maximum length limit is 64. |
| description | String | Yes | Used to describe the function’s capabilities. The model will determine the method of function invocation based on this description. |
| parameters | Object | Yes | The parameters field must pass a Json Schema object to accurately define the parameters accepted by the function. If no parameters are needed when calling the function, this parameter can be omitted. Example:`"parameters": { "type": "object", "properties": { "location": { "type": "string", "description": "City, such as: Beijing", }, "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}, }, "required": ["location"], }` |
| code\_interpreter | Object | No | Only when the tool type is `code_interpreter`, this supplement necessary. |
| sandbox | String | No | Specify the code sandbox environment, with the default being auto, which means the sandbox environment is automatically invoked to execute the code. After setting sandbox to be none, disabling the sandbox environment, the code returns a status of `requires_action`, indicating that the user needs to submit the result of code execution. |
| file\_ids | List | No | List of accessible file IDs for tools |
| drawing\_tool | Object | No | Only when the tool type is `drawing_tool`, this supplement necessary. |
| web\_browser | Object | No | Only when the tool type is `web_browser` , this supplement necessary. |
| browser | String | No | By default, browser = auto will automatically browse the web for links in search results and URLs entered.If only the summary information of the search is needed and the browsing tool is not required, it can be turned off with browser = none. |
| user\_id | String | No | Unique ID of the end user, helping the platform to intervene in the end user’s illegal activities, generation of illegal and inappropriate information, or other abusive behavior. ID length requirement: at least 6 characters, maximum of 128 characters. |

### Message Format

System Message Format

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| role | String | Yes | Role information of the message, should be `system` at this time. |
| content | String | Yes | Message content. |

User Message Format

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| role | String | Yes | Role information of the message, should be `user` at this time. |
| content | List<Object> | Yes | Message content. |
| type | String | Yes | Type of the message content. can be ‘text’ for textual input. |
| text | String | Yes | Text content for ‘text’ type messages. |

Assistant Message Format

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| role | String | Yes | Role information of the message, should be `assistant` at this time. |
| content | String | Yes | Message content. |

Tool Message Format

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| role | String | Yes | Role information of the message, should be `tool` at this time. |
| content | String | Yes | Content of the `tool message`, the result returned after a tool has been called. |

### Streaming Response

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | String | Task id generated by Zhìpǔ AI open platform, please use this id when calling the request result interface |
| created | Long | Request creation time, which is a Unix timestamp in seconds |
| status | String | Return status, could be one of `requires_action`, `failed`, `completed`. `completed` indicates that the task has been fully finished. `requires_action` means that the user needs to submit the result of the tool execution. `failed` indicates that there was an error during the task. |
| choices | List<Object> | Model output content for the current dialogue. |
| index | Integer | Result index |
| finish\_reason | String | Reason for model inference termination. `stop` for natural end or triggering stop words.`tool_calls` for model hitting a function.`length` for reaching the token length limit.`sensitive` for content intercepted by the content filter. Users should judge and decide whether to withdraw content. `network_error` for abnormal model inference. |
| delta | Object | Text information returned incrementally by the model. |
| role | String | Current dialogue role, could be one of `assistant` or `tool` |
| content | List | Current dialogue content. |
| tool\_calls | List | Tools that the model calls. |
| id | String | Unique identifier for the tool. |
| type | String | The type of tool the model calls, could be one of `function`,`code_interpreter`,`drawing_tool`,`web_browser` |
| function | Object | Only when the tool type is `function`, this supplement necessary. |
| name | String | Name of the function that the model generated. |
| arguments | Object | JSON format of the function call parameters generated by the model. Verify parameters before calling the function. |
| code\_interpreter | Object | Only when the tool type is `code_interpreter`, this supplement necessary. |
| input | String | The generated code snippet needs to be input into the code sandbox. |
| outputs | List<Object> | The output result after code execution. |
| type | String | `logs` indicate the code execution logs, and `file` indicates the generated code file. |
| logs | String | The code execution logs |
| file | String | The generated code file |
| drawing\_tool | Object | Only when the tool type is `drawing_tool`, this supplement necessary. |
| input | String | The input for generating an image. |
| outputs | List<Object> | The result of generating an image. |
| image | String | The URL of the image generated by the tool. |
| web\_browser | Object | Only when the tool type is `web_browser`, this supplement necessary. |
| input | String | The input for web searching. |
| outputs | List<Object> | The result of web searching. |
| title | String | The title of the search results. |
| link | String | The link to the search results. |
| content | String | The text content in the search result. |
| usage | Object | Returns the number of tokens used at the end of the model call. |
| prompt\_tokens | Integer | Number of users and tools input tokens |
| completion\_tokens | Integer | Number of tokens produced by the model |
| total\_tokens | Integer | Total number of tokens involved in the process |

### Call Example

To use these new features, you need to upgrade to the latest version of the Python SDK. If you have an older version of the SDK installed, please update to the latest version.

```
pip install --upgrade zhipuai
```

1

#### Request Example

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Enter your own APIKey
response = client.chat.completions.create(
    model="glm-4-alltools",  # Enter the model name you want to call
    messages=[
        {
            "role": "user",
            "content":[
                {
                    "type":"text",
                    "text":"Please help me query the national travel data for the Labor Day holiday from 2018 to 2024, and present the data trend in a bar chart."
                }
            ]
        }
    ],
    stream=True,
    tools=[
    {
        "type": "function",
        "function": {
            "name": "get_tourist_data_by_year",
            "description": " Used to query the national travel data for each year, input the year range (from_year, to_year), and return the corresponding travel data, including the total number of trips, the number of trips by different modes of transportation, etc.",
            "parameters": {
                "type": "object",
                "properties": {
                    "type": {
                        "description": "Mode of transportation, default is by_all, train = by_train, plane = by_plane, self-driving = by_car.",
                        "type": "string"
                    },
                    "from_year": {
                        "description": "Start year, formatted as yyyy.",
                        "type": "string"
                    },
                    "to_year": {
                        "description": "End year, formatted as yyyy.",
                        "type": "string"
                    }
                },
                "required": ["from_year","to_year"]
            }
        }
      },
      {
        "type": "code_interpreter"
      }
    ]
)

for chunk in response:
   print(chunk)
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

#### Response Example

Example of enabling the sandbox for the Code Interpreter tool.

```
ChatCompletionChunk(id='8760198606258174996', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87601986062581749962', function=None, type='code_interpreter', code_interpreter={'input': ' the'})]), finish_reason=None, index=0)], created=1718687730, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8760198606258174996', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87601986062581749962', function=None, type='code_interpreter', code_interpreter={'input': ' chart'})]), finish_reason=None, index=0)], created=1718687730, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8760198606258174996', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87601986062581749962', function=None, type='code_interpreter', code_interpreter={'input': '\n'})]), finish_reason=None, index=0)], created=1718687730, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8760198606258174996', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87601986062581749962', function=None, type='code_interpreter', code_interpreter={'input': 'plt'})]), finish_reason=None, index=0)], created=1718687730, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8760198606258174996', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87601986062581749962', function=None, type='code_interpreter', code_interpreter={'input': '.'})]), finish_reason=None, index=0)], created=1718687730, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8760198606258174996', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87601986062581749962', function=None, type='code_interpreter', code_interpreter={'input': 'show'})]), finish_reason=None, index=0)], created=1718687730, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8760198606258174996', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87601986062581749962', function=None, type='code_interpreter', code_interpreter={'input': '()'})]), finish_reason=None, index=0)], created=1718687730, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8760198606258174996', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=None), finish_reason='tool_calls', index=0)], created=1718687730, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8760198606258174996', choices=[Choice(delta=ChoiceDelta(content=None, role='tool', tool_calls=[ChoiceDeltaToolCall(index=None, id=None, function=None, type='code_interpreter', code_interpreter={'outputs': [{'type': 'file', 'file': 'http://all-tool-interpreter.cn-wlcb.ufileos.com/10571a86-9194-43f7-ab2c-274ba29b9835_fig.png'}]})]), finish_reason=None, index=0)], created=1718687735, model='glm-4-alltools', usage=None, extra_json=None)
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

Example of the Drawing Tool.

```
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095661', function=None, type='drawing_tool', drawing_tool={'input': ' of'})]), finish_reason=None, index=0)], created=1718682666, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095661', function=None, type='drawing_tool', drawing_tool={'input': ' a'})]), finish_reason=None, index=0)], created=1718682666, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095661', function=None, type='drawing_tool', drawing_tool={'input': ' rainy'})]), finish_reason=None, index=0)], created=1718682666, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095661', function=None, type='drawing_tool', drawing_tool={'input': ' day'})]), finish_reason=None, index=0)], created=1718682666, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095661', function=None, type='drawing_tool', drawing_tool={'input': ' in'})]), finish_reason=None, index=0)], created=1718682666, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095661', function=None, type='drawing_tool', drawing_tool={'input': ' Shanghai'})]), finish_reason=None, index=0)], created=1718682666, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095661', function=None, type='drawing_tool', drawing_tool={'input': '.'})]), finish_reason=None, index=0)], created=1718682666, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=None), finish_reason='tool_calls', index=0)], created=1718682666, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='tool', tool_calls=[ChoiceDeltaToolCall(index=None, id=None, function=None, type='drawing_tool', drawing_tool={'outputs': [{'image': 'https://sfile.chatglm.cn/testpath/88bf4a5a-25f2-5309-977e-369f6f696d14_0.png'}]})]), finish_reason=None, index=0)], created=1718682671, model='glm-4-alltools', usage=None, extra_json=None)
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

Example of the Web Browser tool.

```
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095660', function=None, type='web_browser', web_browser={'input': 'search'})]), finish_reason=None, index=0)], created=1718682657, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095660', function=None, type='web_browser', web_browser={'input': '("'})]), finish_reason=None, index=0)], created=1718682657, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095660', function=None, type='web_browser', web_browser={'input': 'City'})]), finish_reason=None, index=0)], created=1718682657, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095660', function=None, type='web_browser', web_browser={'input': 'Week'})]), finish_reason=None, index=0)], created=1718682657, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095660', function=None, type='web_browser', web_browser={'input': 'end'})]), finish_reason=None, index=0)], created=1718682657, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095660', function=None, type='web_browser', web_browser={'input': 'forecast'})]), finish_reason=None, index=0)], created=1718682657, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_87619536673345095660', function=None, type='web_browser', web_browser={'input': '")'})]), finish_reason=None, index=0)], created=1718682657, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=None), finish_reason='tool_calls', index=0)], created=1718682657, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='tool', tool_calls=[ChoiceDeltaToolCall(index=None, id=None, function=None, type='web_browser', web_browser={'outputs': [{'title': 'Shanghai weather forecast for one week, 7 days, 15 days.', 'link': 'https://baidu.weather.com.cn/mweather/101020100.shtml?t=1487737308', 'content': '...'}, {'title': 'The Weather Channel | Weather.com', 'link': 'https://weather.com/zh-CN/weather/weekend', 'content': '...'}, {'title': 'City weather', 'link': 'http://sh.weather.com.cn/', 'content': '...'}, {'title': 'China Meteorological Administration - Weather Forecast.', 'link': 'https://weather.cma.cn/', 'content': '...'}]})]), finish_reason=None, index=0)], created=1718682658, model='glm-4-alltools', usage=None, extra_json=None)
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

Example of a model inference response.

```
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content='This', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718682674, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content='is', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718682674, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content='city', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718682674, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content='weather', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718682674, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content='forecast', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718682674, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content='.', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718682674, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8761953667334509566', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=None), finish_reason='stop', index=0)], created=1718682674, model='glm-4-alltools', usage=CompletionUsage(prompt_tokens=8936, completion_tokens=251, total_tokens=9187), extra_json=None, status='completed')
```

1  
2  
3  
4  
5  
6  
7

## Function Call

#### Response Example

If a function call is needed, the model will return `status='requires_action'`

```
ChatCompletionChunk(id='cdaad83d-8970-4866-951f-3849de03f85b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_X2__H_xN3LmUMaxb79gxV', function=ChoiceDeltaToolCallFunction(arguments='', name='get_tourist_data_by_year'), type='function')]), finish_reason=None, index=0)], created=1719801738, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='cdaad83d-8970-4866-951f-3849de03f85b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_X2__H_xN3LmUMaxb79gxV', function=ChoiceDeltaToolCallFunction(arguments='', name='get_tourist_data_by_year'), type='function')]), finish_reason=None, index=0)], created=1719801738, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='cdaad83d-8970-4866-951f-3849de03f85b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_X2__H_xN3LmUMaxb79gxV', function=ChoiceDeltaToolCallFunction(arguments='', name='get_tourist_data_by_year'), type='function')]), finish_reason=None, index=0)], created=1719801738, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='cdaad83d-8970-4866-951f-3849de03f85b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_X2__H_xN3LmUMaxb79gxV', function=ChoiceDeltaToolCallFunction(arguments='', name='get_tourist_data_by_year'), type='function')]), finish_reason=None, index=0)], created=1719801738, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='cdaad83d-8970-4866-951f-3849de03f85b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_X2__H_xN3LmUMaxb79gxV', function=ChoiceDeltaToolCallFunction(arguments='', name='get_tourist_data_by_year'), type='function')]), finish_reason=None, index=0)], created=1719801738, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='cdaad83d-8970-4866-951f-3849de03f85b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_X2__H_xN3LmUMaxb79gxV', function=ChoiceDeltaToolCallFunction(arguments='{"from_year":"2018"," to_year":"2024"," type":"by_all"}', name='get_tourist_data_by_year'), type='function')]), finish_reason='tool_calls', index=0)], created=1719801738, model='glm-4-alltools', usage=CompletionUsage(prompt_tokens=438, completion_tokens=48, total_tokens=486), extra_json=None, status='requires_action')
```

1  
2  
3  
4  
5  
6

#### Request Example

When using a function call, the user needs to submit the execution result of the function call (Tool Message), as well as the function parameters generated by the model (Assistant Message).

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Enter your own APIKey
response = client.chat.completions.create(
    model="glm-4-alltools",  # Enter the model name you want to call
    messages=[
        {
            "role": "user",
            "content":[
                {
                    "type":"text",
                    "text":"Please help me query the national travel data for the Labor Day holiday from 2018 to 2024, and present the data trend in a bar chart."
                }
            ]
        },
        {
             "role": "assistant",
             "content":"arguments='{\"from_year\":\"2018\",\" to_year\":\"2024\",\" type\":\"by_all\"}', name='get_tourist_data_by_year'"

        },
        {
             "role": "tool",
             "content": "[100,100,200,200,300,400]"
         }
    ],
    stream=True,
    tools=[
    {
        "type": "function",
        "function": {
            "name": "get_tourist_data_by_year",
            "description": " Used to query the national travel data for each year, input the year range (from_year, to_year), and return the corresponding travel data, including the total number of trips, the number of trips by different modes of transportation, etc.",
            "parameters": {
                "type": "object",
                "properties": {
                    "type": {
                        "description": "Mode of transportation, default is by_all, train = by_train, plane = by_plane, self-driving = by_car.",
                        "type": "string"
                    },
                    "from_year": {
                        "description": "Start year, formatted as yyyy.",
                        "type": "string"
                    },
                    "to_year": {
                        "description": "End year, formatted as yyyy.",
                        "type": "string"
                    }
                },
                "required": ["from_year","to_year"]
            }
        }
      },
      {
        "type": "code_interpreter"
      }
    ]
)

for chunk in response:
   print(chunk)
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
53  
54  
55  
56  
57  
58  
59

## Multi-turn Dialogue Example

The following case shows the interactive manner of a multi-turn dialogue between the user and the system, demonstrating how to use the AllTools model to generate tool commands and incorporate the results of executing tools as historical dialogue context, which is then provided to the model again.

### Historical Dialogue Context

In the previous round of dialogue, the parameters of the function call and the execution results were:

```
       {
            "role": "assistant",
            "content": "arguments='{\"from_year\":\"2018\",\" to_year\":\"2024\",\" type\":\"by_all\"}', name='get_tourist_data_by_year'"
       },
       {
            "role": "tool",
            "content": "[100,100,200,200,300,400]"
        }
```

1  
2  
3  
4  
5  
6  
7  
8

Input and execution results in the code sandbox:

```
        {
            "role":"assistant",
            "content":"""
                import matplotlib.pyplot as plt
                
                # Data received from the API
                years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"]
                tourist_data = [100, 100, 200, 200, 300, 400, 500]  # Assuming the data for 2023 and 2024 based on the trend
                
                # Creating a bar chart
                plt.figure(figsize=(10, 6))
                plt.bar(years, tourist_data, color='skyblue')
                plt.xlabel('Year')
                plt.ylabel('Number of Tourists')
                plt.title('Trend of National Tourist Travel Data During May Day Holiday from 2018 to 2024')
                plt.grid(axis='y')
                
                # Show the chart
                plt.show()
             """
        },
        {
            "role":"tool",
            "content":"{\"type\": \"file\", \"file\": \"http://all-tool-interpreter.cn-wlcb.ufileos.com/355b3445-51e4-4890-952d-69a29f0439af_fig.png?UCloudPublicKey=TOKEN_69f58d9b-ddb3-4bd0-9b29-5a4fe422c720&Expires=1718770606&Signature=m/+LVTw8ae61IcIjogss0Lq48nY=\"}"
        },
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

And the model’s reasoning summary:

```
        {
            "role":"assistant",
            "content": """
                Below is the bar chart of the national tourist travel data during the May Day holiday from 2018 to 2024, showing the trend of the number of tourists each year. You can click the following link to view the chart:
                [View Bar Chart](http://all-tool-interpreter.cn-wlcb.ufileos.com/e01459c3-ddd6-4963-adf7-163513184f0c_fig.png?UCloudPublicKey=TOKEN_69f58d9b-ddb3-4bd0-9b29-5a4fe422c720&Expires=1718771167&Signature=Pb9t2LbPDiMB1bBUZWT+3u6qacI=)
             """
        }
```

1  
2  
3  
4  
5  
6  
7

### User Asks Again

Request example:

```
{
    "model": "glm-4-alltools",
    "messages": [
        {
            "role": "user",
            "content":[
                {
                    "type":"text",
                    "text":"Please help me query the national tourist travel data during the May Day holiday from 2018 to 2024, and present it as a bar chart to show the data trend."
                }
            ]
        },
       {
            "role": "assistant",
            "content": "arguments='{\"from_year\":\"2018\",\" to_year\":\"2024\",\" type\":\"by_all\"}', name='get_tourist_data_by_year'"
       },
       {
            "role": "tool",
            "content": "[100,100,200,200,300,400]"
        },
        {
            "role":"assistant",
            "content":"""
                import matplotlib.pyplot as plt
                
                # Data received from the API
                years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"]
                tourist_data = [100, 100, 200, 200, 300, 400, 500]  # Assuming the data for 2023 and 2024 based on the trend
                
                # Creating a bar chart
                plt.figure(figsize=(10, 6))
                plt.bar(years, tourist_data, color='skyblue')
                plt.xlabel('Year')
                plt.ylabel('Number of Tourists')
                plt.title('Trend of National Tourist Travel Data During May Day Holiday from 2018 to 2024')
                plt.grid(axis='y')
                
                # Show the chart
                plt.show()
             """
        },
        {
            "role":"tool",
            "content":"{\"type\": \"file\", \"file\": \"http://all-tool-interpreter.cn-wlcb.ufileos.com/355b3445-51e4-4890-952d-69a29f0439af_fig.png?UCloudPublicKey=TOKEN_69f58d9b-ddb3-4bd0-9b29-5a4fe422c720&Expires=1718770606&Signature=m/+LVTw8ae61IcIjogss0Lq48nY=\"}"
        },
        {
            "role":"assistant",
            "content": """
                Below is the bar chart of the national tourist travel data during the May Day holiday from 2018 to 2024, showing the trend of the number of tourists each year. You can click the following link to view the chart:
                [View Bar Chart](http://all-tool-interpreter.cn-wlcb.ufileos.com/e01459c3-ddd6-4963-adf7-163513184f0c_fig.png?UCloudPublicKey=TOKEN_69f58d9b-ddb3-4bd0-9b29-5a4fe422c720&Expires=1718771167&Signature=Pb9t2LbPDiMB1bBUZWT+3u6qacI=)
             """
        },
        {
            "role":"user",
            "content":"Also, add a line graph showing the year-on-year growth rate for each year on the trend chart."
        }
    ],
    "max_tokens": 40000,
    "stream": true,
    "tools": [
    {
        "type": "function",
        "function": {
            "name": "get_tourist_data_by_year",
            "description": "Used to query the national travel data for each year. Input the year range (from_year, to_year), and it returns the corresponding travel data, including the total number of trips and the number of trips by different modes of transportation.",
            "parameters": {
                "type": "object",
                "properties": {
                    "type": {
                        "description": "Mode of transportation, defaults to by_all, train=by_train, plane=by_plane, car=by_car",
                        "type": "string"
                    },
                    "from_year": {
                        "description": "Start year, format yyyy",
                        "type": "string"
                    },
                    "to_year": {
                        "description": "End year, format yyyy",
                        "type": "string"
                    }
                },
                "required": ["from_year","to_year"]
            }
        }
      },
      {
        "type": "code_interpreter"
      }
    ]
}
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
53  
54  
55  
56  
57  
58  
59  
60  
61  
62  
63  
64  
65  
66  
67  
68  
69  
70  
71  
72  
73  
74  
75  
76  
77  
78  
79  
80  
81  
82  
83  
84  
85  
86  
87  
88  
89  
90

### Generate code and inference

Code response example:

```
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_i6Hx0y7zU6eeUgBBMyR69', function=None, type='code_interpreter', code_interpreter={'input': ' the'})]), finish_reason=None, index=0)], created=1718769528, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_i6Hx0y7zU6eeUgBBMyR69', function=None, type='code_interpreter', code_interpreter={'input': ' chart'})]), finish_reason=None, index=0)], created=1718769528, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_i6Hx0y7zU6eeUgBBMyR69', function=None, type='code_interpreter', code_interpreter={'input': '\n'})]), finish_reason=None, index=0)], created=1718769528, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_i6Hx0y7zU6eeUgBBMyR69', function=None, type='code_interpreter', code_interpreter={'input': 'plt'})]), finish_reason=None, index=0)], created=1718769528, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_i6Hx0y7zU6eeUgBBMyR69', function=None, type='code_interpreter', code_interpreter={'input': '.'})]), finish_reason=None, index=0)], created=1718769528, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_i6Hx0y7zU6eeUgBBMyR69', function=None, type='code_interpreter', code_interpreter={'input': 'show'})]), finish_reason=None, index=0)], created=1718769528, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_i6Hx0y7zU6eeUgBBMyR69', function=None, type='code_interpreter', code_interpreter={'input': '()'})]), finish_reason=None, index=0)], created=1718769529, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_i6Hx0y7zU6eeUgBBMyR69', function=None, type='code_interpreter', code_interpreter={'input': ''})]), finish_reason='tool_calls', index=0)], created=1718769529, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=None, role='tool', tool_calls=[ChoiceDeltaToolCall(index=None, id=None, function=None, type='code_interpreter', code_interpreter={'outputs': [{'type': 'file', 'file': 'http://all-tool-interpreter.cn-wlcb.ufileos.com/6de793c5-3184-4410-a280-caeff9fd1fea_fig.png?UCloudPublicKey=TOKEN_69f58d9b-ddb3-4bd0-9b29-5a4fe422c720&Expires=1718776731&Signature=PZ3Z8DjzvAsqxLwt8aHgduBPdLw='}]})]), finish_reason=None, index=0)], created=1718769531, model='glm-4-alltools', usage=None, extra_json=None)
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

Inference response example:

```
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content='g', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718769537, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content='du', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718769537, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content='BP', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718769537, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content='d', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718769537, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content='L', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718769537, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content='w', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718769537, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content='=', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718769537, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=')', role='assistant', tool_calls=None), finish_reason=None, index=0)], created=1718769537, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='8762840354743711363', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=None), finish_reason='stop', index=0)], created=1718769537, model='glm-4-alltools', usage=CompletionUsage(prompt_tokens=2686, completion_tokens=529, total_tokens=3215), extra_json=None, status='completed')
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

Table of contents

Streaming call

API request

Request Parameters

Message Format

Streaming Response

Call Example

Function Call

Multi-turn Dialogue Example

Historical Dialogue Context

User Asks Again

Generate code and inference