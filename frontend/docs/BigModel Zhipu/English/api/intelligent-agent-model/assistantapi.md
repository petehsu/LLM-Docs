[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Fintelligent-agent-model%2Fassistantapi)

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

# Assistant API

> Thank you for your continued support and trust! To ensure we can maintain stable and high-quality service, GLM-4-Assistant will transition from free service to a standard rate of 5 RMB/M Tokens starting from 00:00 on June 1, 2025. For any inquiries, please contact our official customer service.

## Introduction

Model Code: GLM-4-Assistant  
The Assistant API offers ready-to-use applications for assistants. Developers just need to connect to the API and specify the assistant id to apply the assistant to various business scenarios without the need to manually construct the assistant.

* Capable of achieving equivalent capabilities to the **Qingyan** assistant, supporting multi-modal conversations including documents and images
* Supports a variety of tools, including online search, document parsing, code execution, and external function calls
* Able to maintain sessions, developers only need to engage in dialogue without the need to manage context
* Provides starting topics and recommended questions for the assistant, making the user experience smoother

| Assistant | Description | assistant id |
| --- | --- | --- |
| [Data Analysis (Official)](https://chatglm.cn/main/gdetail/65a265419d72d299a9230616) | Analyzes data uploaded by users or data descriptions to assist users in data analysis and provides charting. It can also complete file processing tasks through simple coding. | 65a265419d72d299a9230616 |
| [Complex Flowchart (Official)](https://chatglm.cn/main/gdetail/664dd7bd5bb3a13ba0f81668) | A flowchart tool that anyone can master, create a flowchart in five seconds to impress your colleagues. | 664dd7bd5bb3a13ba0f81668 |
| [Mind Map (Official)](https://chatglm.cn/main/gdetail/664e0cade018d633146de0d2) | Say goodbye to organizational headaches, turn any complex concept into a mind map in seconds. | 664e0cade018d633146de0d2 |
| [Prompt Engineer (Official)](https://chatglm.cn/main/gdetail/6654898292788e88ce9e7f4c) | Everyone is a prompt engineer, a powerful structured prompt expert, rewrite prompts with a single click. | 6654898292788e88ce9e7f4c |
| [AI Drawing (Official)](https://chatglm.cn/main/gdetail/66437ef3d920bdc5c60f338e) | Let your imagination soar, your dedicated painting companion, you won’t be able to stop painting. | 66437ef3d920bdc5c60f338e |
| [AI Search (Official)](https://chatglm.cn/main/gdetail/659e54b1b8006379b4b2abd6) | Connects to content across the entire network, searches accurately, analyzes quickly, and summarizes intelligently. | 659e54b1b8006379b4b2abd6 |
| [PPT Assistant (Official)](https://chatglm.cn/main/gdetail/65d2f07bb2c10188f885bd89) | An ultra-practical PPT generator that supports manually editing outlines and automatically filling in chapter content. | 65d2f07bb2c10188f885bd89 |
| [arXiv Paper Speed Reading (Official)](https://chatglm.cn/main/gdetail/663058948bb259b7e8a22730) | In-depth analysis of arXiv papers for quickly grasping research trends and saving valuable time. | 663058948bb259b7e8a22730 |
| [Programmer Assistant Sam (Official)](https://chatglm.cn/main/gdetail/65a393b3619c6f13586246cd) | A “programming and development knowledge search engine” that helps programmers solve daily problems. | 65a393b3619c6f13586246cd |
| [Online Literature Writer (Official)](https://chatglm.cn/main/gdetail/65b356af6924a59d52832e54) | Secret to masterful writing: keep repeating a single template. | 65b356af6924a59d52832e54 |
| [English Grammar Assistant (Official)](https://chatglm.cn/main/gdetail/668fdd45405f2e3c9f71f832) | Enter a word for query; enter a sentence for grammar checking and explanations. | 668fdd45405f2e3c9f71f832 |

## Assistant Conversation

**Interface Request**

| Type | Description |
| --- | --- |
| Transfer Method | HTTPS |
| Request Address | https://open.bigmodel.cn/api/paas/v4/assistant |
| Invocation Method | Only supports SSE calls |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON or Standard Stream Event |
| Interface Request Type | POST |
| Development Language | Any development language capable of initiating HTTP requests |

### Request Parameters

| Parameter Name | Type | Required | Parameter Description |
| --- | --- | --- | --- |
| assistant\_id | String | Yes | Assistant ID |
| conversation\_id | String | No | Conversation ID, defaults to creating a new conversation if not provided. When continuing a previous conversation, pass the `conversation_id` value from the streaming output. |
| model | String | Yes | The default model is glm-4-assistant |
| stream | Boolean | Yes | Only supports streaming SSE, True needs to be passed in. |
| messages | List<Object> | Yes | Conversation message body |
| role | String | Yes | User input `role = user` |
| content | List<Object> | Yes | Conversation message body |
| type | String | Yes | Currently supports type=text |
| text | String | Yes | Text content entered by the user |
| attachments | List<Object> | No | Files specified for the conversation |
| file\_id | String | No | File id, returned by the file upload interface |
| metadata | Object | No | Metadata, expansion field |

**Request Example**

```
from zhipuai import ZhipuAI
api_key = "YOUR API KEY"
url = "https://open.bigmodel.cn/api/paas/v4"
client = ZhipuAI(api_key= api_key, base_url=url)
generate = client.assistant.conversation(
    assistant_id="65a265419d72d299a9230616",
    conversation_id=None,
    model="glm-4-assistant",
    messages=[
        {
            "role": "user",
            "content": [{
                "type": "text",
                "text": "Show the temperature for the next seven days in Beijing as a line chart"
            }]
        }
    ],
    stream=True,
    attachments=None,
    metadata=None
)
for resp in generate:
    print(resp)
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

### Streaming Response Parameters

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| id | String | Request id |
| conversation\_id | String | Conversation id |
| assistant\_id | String | Assistant id |
| created | Integer | Request creation time, in Unix timestamp seconds |
| status | String | Return status, including: `completed` for generation end, `in_progress` for generation in progress, `failed` for generation exception |
| last\_error | Object | Exception information, formatted as: `{"code": error code, "message": error message}` |
| choices | List | Incrementally returned information |
| index | Integer | Result index |
| finish\_reason | String | `stop` indicates the natural end of inference or trigger of a stop word `sensitive` indicates the model’s inference content was intercepted by the safety audit interface. Please note, for such content, the user should judge and decide whether to withdraw the content that has been made public. `network_error` indicates an exception in the model’s inference service. |
| delta | Object | Current conversation output message body Message |
| metadata | Object | Metadata, expansion field |
| usage | Object | Token count statistics for this call |
| prompt\_tokens | Integer | Number of input tokens |
| completion\_tokens | Integer | Number of output tokens |
| total\_tokens | Integer | Total number of tokens |

**Response Example**

```
data: {"id":"2024080616285251e6b5e332a0467d","created":1722932937490,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"web_browser","web_browser":{"input":"search(\\"\xe5\x8c\x97\xe4\xba\xac\xe6\x9c\xaa\xe6\x9d\xa5\xe4\xb8\x83\xe5\xa4\xa9\xe6\xb0\x94\xe6\xb8\xa9\xe9\xa2\x84\xe6\x8a\xa5\\", recency_days=1)"}}],"metadata":{}}}],"status":"in_process","assistant_id":"65a265419d72d299a9230616","conversation_id":"66b1dec43858e2cffd41c92d"}'

data: {"id":"2024080616285251e6b5e332a0467d","created":1722932938880,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"web_browser","web_browser":{"outputs":[{"title":"\xe5\x8c\x97\xe4\xba\xac \xe5\xa4\xa9\xe6\xb0\x94","link":"http://weather.com.cn/weather/101010100.shtml","content":"\xe5\x8c\x97\xe4\xba\xac\xe5\xbd\x93\xe5\x89\x8d(2024\xe5\xb9\xb408\xe6\x9c\x8806\xe6\x97\xa5)\xe5\xa4\xa9\xe6\xb0\x94: \xe9\x98\xb4 33.7\xe6\x91\x84\xe6\xb0\x8f\xe5\xba\xa6, \xe8\xa5\xbf\xe5\x8d\x97\xe9\xa3\x8e2\xe7\xba\xa7, \xe6\xb9\xbf\xe5\xba\xa6: 54%, \xe7\xa9\xba\xe6\xb0\x94"}]}}],"metadata":{}}}],"status":"in_process","assistant_id":"65a265419d72d299a9230616","conversation_id":"66b1dec43858e2cffd41c92d"}

data: {"id":"2024080616285251e6b5e332a0467d","created":1722932968453,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"code_interpreter","code_interpreter":{"input":"import matplotlib.pyplot as plt\\nimport matplotlib.dates as mdates\\nfrom datetime import datetime\\n\\n# \xe6\x95\xb0\xe6\x8d\xae\\ndates = [\\"2024-08-06\\", \\"2024-08-07\\", \\"2024-08-08\\", \\"2024-08-09\\", \\"2024-08-10\\", \\"2024-08-11\\", \\"2024-08-12\\"]\\nhigh_temps = [34, 32, 34, 31, 32, 33, 33]\\nlow_temps = [25, 24, 25, 24, 22, 22, 22]\\n\\n# \xe8\xbd\xac\xe6\x8d\xa2\xe6\x97\xa5\xe6\x9c\x9f\xe6\xa0\xbc\xe5\xbc\x8f\\ndates = [datetime.strptime(date, \\"%Y-%m-%d\\") for date in dates]\\n\\n# \xe7\xbb\x98\xe5\x9b\xbe\\nplt.figure(figsize=(10, 5))\\nplt.plot(dates, high_temps, label=\\"\xe6\x9c\x80\xe9\xab\x98\xe6\xb0\x94\xe6\xb8\xa9\\", marker=\'o\')\\nplt.plot(dates, low_temps, label=\\"\xe6\x9c\x80\xe4\xbd\x8e\xe6\xb0\x94\xe6\xb8\xa9\\", marker=\'o\')\\nplt.gca().xaxis.set_major_formatter(mdates.DateFormatter(\'%m-%d\'))\\nplt.gca().xaxis.set_major_locator(mdates.DayLocator())\\nplt.gcf().autofmt_xdate() # \xe8\x87\xaa\xe5\x8a\xa8\xe6\x97\x8b\xe8\xbd\xac\xe6\x97\xa5\xe6\x9c\x9f\xe6\xa0\x87\xe8\xae\xb0\\nplt.title(\\"\xe5\x8c\x97\xe4\xba\xac\xe6\x9c\xaa\xe6\x9d\xa5\xe4\xb8\x83\xe5\xa4\xa9\xe6\xb0\x94\xe6\xb8\xa9\xe9\xa2\x84\xe6\x8a\xa5\\")\\nplt.xlabel(\\"\xe6\x97\xa5\xe6\x9c\x9f\\")\\nplt.ylabel(\\"\xe6\xb0\x94\xe6\xb8\xa9 (\xc2\xb0C)\\")\\nplt.legend()\\nplt.grid(True)\\nplt.show()"}}],"metadata":{}}}],"status":"in_process","assistant_id":"65a265419d72d299a9230616","conversation_id":"66b1dec43858e2cffd41c92d"}

data: {"id":"2024080616285251e6b5e332a0467d","created":1722932971802,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"code_interpreter","code_interpreter":{"outputs":[{"type":"logs","logs":"https://sfile.chatglm.cn/img2text/00776b9d-e7ea-4034-b624-2b2d57e32ada.jpg"}]}}],"metadata":{}}}],"status":"in_process","assistant_id":"65a265419d72d299a9230616","conversation_id":"66b1dec43858e2cffd41c92d"}

data: {"id":"2024080616285251e6b5e332a0467d","created":1722932976902,"choices":[{"index":0,"finish_reason":"stop","delta":{"role":"assistant","metadata":{}}}],"usage":{"prompt_tokens":3574,"completion_tokens":51,"total_tokens":3625},"status":"completed","assistant_id":"65a265419d72d299a9230616","conversation_id":"66b1dec43858e2cffd41c92d"}
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

### Session Message Body

#### Text Output Message

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| role | String | The current dialogue role, divided into assistant (model), tool (tool)  When `Role = assistant`, the model outputs text content to content |
| content | String | The text content output by the model |

**Message Example**

```
data: {"id":"20240806165512f413615fbdc94ce6","created":1722934523829,"choices":[{"index":0,"delta":{"role":"assistant","content":"\xe6\x80\xbb\xe7\xbb\x93","metadata":{}}}],"status":"in_process","assistant_id":"65a265419d72d299a9230616","conversation_id":"66b1e4f00cf253c4f141c967"}
data: {"id":"20240806165512f413615fbdc94ce6","created":1722934523896,"choices":[{"index":0,"delta":{"role":"assistant","content":"\xe3\x80\x82","metadata":{}}}],"status":"in_process","assistant_id":"65a265419d72d299a9230616","conversation_id":"66b1e4f00cf253c4f141c967"}
```

1  
2

#### Drawing Tool Message

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| role | String | The current dialogue role, divided into assistant (model), tool (tool)  When `Role = tool`, the tool inputs and outputs content to tool\_calls |
| tool\_calls | List<Object> | Tool message body |
| type | String | The type of tool being called, currently supports function, code\_interpreter, drawing\_tool, web\_browser, retrieval.  `type = drawing_tool` indicates a drawing tool |
| drawing\_tool | Object | Returned when type is drawing\_tool |
| input | String | The input prompt for generating the image |
| outputs | List<Object> | The results of generating the image |
| image | String | The URL address of the generated image |

**Message Example**

```
data: {"id":"20240806183256277dcc4fc4ec4587","created":1722940386355,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"drawing_tool","drawing_tool":{"input":"A cyberpunk-themed flying pig, viewed from a satellite perspective. The image should capture the essence of a futuristic, high-tech world with neon lights and advanced technology, all seen from high above the Earth. The pig is depicted as if it's soaring through the sky, with a dynamic and whimsical appearance, embodying the freedom and imagination of the cyberpunk genre."}}],"metadata":{}}}],"status":"in_process","assistant_id":"66437ef3d920bdc5c60f338e","conversation_id":"66b1fbd82967d5c77d41ca1c"}
data: {"id":"20240806183256277dcc4fc4ec4587","created":1722940392231,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"drawing_tool","drawing_tool":{"outputs":[{"image":"https://sfile.chatglm.cn/testpath/1e9a8dd9-04be-5849-8c92-1b6d2ed86540_0.png"}]}}],"metadata":{}}}],"status":"in_process","assistant_id":"66437ef3d920bdc5c60f338e","conversation_id":"66b1fbd82967d5c77d41ca1c"}
```

1  
2

#### Code Execution Message

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| role | String | The current dialogue role, divided into assistant (model), tool (tool)  When `Role = tool`, the tool inputs and outputs content to tool\_calls |
| tool\_calls | List<Object> | Tool message body |
| type | String | The type of tool being called, currently supports function, code\_interpreter, drawing\_tool, web\_browser, retrieval.  `type = code_interpreter` indicates a code tool |
| code\_interpreter | Object | Returned when type is code\_interpreter |
| input | String | The generated code snippet, input to the code sandbox |
| outputs | List<Object> | The output results of code execution |
| type | String | logs=code execution logs, currently only logs |
| logs | String | The log results of code execution |
| error\_msg | String | Error message |

**Message Example**

```
data: {"id":"2024080616285251e6b5e332a0467d","created":1722932968453,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"code_interpreter","code_interpreter":{"input":"import matplotlib.pyplot as plt\\nimport matplotlib.dates as mdates\\nfrom datetime import datetime\\n\\n# \xe6\x95\xb0\xe6\x8d\xae\\ndates = [\\"2024-08-06\\", \\"2024-08-07\\", \\"2024-08-08\\", \\"2024-08-09\\", \\"2024-08-10\\", \\"2024-08-11\\", \\"2024-08-12\\"]\\nhigh_temps = [34, 32, 34, 31, 32, 33, 33]\\nlow_temps = [25, 24, 25, 24, 22, 22, 22]\\n\\n# \xe8\xbd\xac\xe6\x8d\xa2\xe6\x97\xa5\xe6\x9c\x9f\xe6\xa0\xbc\xe5\xbc\x8f\\ndates = [datetime.strptime(date, \\"%Y-%m-%d\\") for date in dates]\\n\\n# \xe7\xbb\x98\xe5\x9b\xbe\\nplt.figure(figsize=(10, 5))\\nplt.plot(dates, high_temps, label=\\"\xe6\x9c\x80\xe9\xab\x98\xe6\xb0\x94\xe6\xb8\xa9\\", marker=\'o\')\\nplt.plot(dates, low_temps, label=\\"\xe6\x9c\x80\xe4\xbd\x8e\xe6\xb0\x94\xe6\xb8\xa9\\", marker=\'o\')\\nplt.gca().xaxis.set_major_formatter(mdates.DateFormatter(\'%m-%d\'))\\nplt.gca().xaxis.set_major_locator(mdates.DayLocator())\\nplt.gcf().autofmt_xdate() # \xe8\x87\xaa\xe5\x8a\xa8\xe6\x97\x8b\xe8\xbd\xac\xe6\x97\xa5\xe6\x9c\x9f\xe6\xa0\x87\xe8\xae\xb0\\nplt.title(\\"\xe5\x8c\x97\xe4\xba\xac\xe6\x9c\xaa\xe6\x9d\xa5\xe4\xb8\x83\xe5\xa4\xa9\xe6\xb0\x94\xe6\xb8\xa9\xe9\xa2\x84\xe6\x8a\xa5\\")\\nplt.xlabel(\\"\xe6\x97\xa5\xe6\x9c\x9f\\")\\nplt.ylabel(\\"\xe6\xb0\x94\xe6\xb8\xa9 (\xc2\xb0C)\\")\\nplt.legend()\\nplt.grid(True)\\nplt.show()"}}],"metadata":{}}}],"status":"in_process","assistant_id":"65a265419d72d299a9230616","conversation_id":"66b1dec43858e2cffd41c92d"}

data: {"id":"2024080616285251e6b5e332a0467d","created":1722932971802,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"code_interpreter","code_interpreter":{"outputs":[{"type":"logs","logs":"https://sfile.chatglm.cn/img2text/00776b9d-e7ea-4034-b624-2b2d57e32ada.jpg"}]}}],"metadata":{}}}],"status":"in_process","assistant_id":"65a265419d72d299a9230616","conversation_id":"66b1dec43858e2cffd41c92d"}
```

1  
2  
3

#### Network Search Message

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| role | String | Current conversation role, divided into assistant (model), tool (tool)   When `Role = tool`, the tool inputs and outputs content to tool\_calls |
| tool\_calls | List<Object> | Tool message body |
| type | String | Type of tool being called, currently supports function, code\_interpreter, drawing\_tool, web\_browser, retrieval.  `type = web_browser` indicates network search |
| web\_browser | Object | Returned when type is web\_browser |
| input | String | Input for networked search |
| outputs | List<Object> | Search results |
| title | String | Title of search result |
| link | String | Webpage link of search result |
| content | String | Text content of search result |
| error\_msg | String | Error message |

**Message Example**

```
data: {"id":"202408061840346540a5d4d60d4d47","created":1722940837217,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"web_browser","web_browser":{"input":"search(\\\"\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe5\xa5\x96\xe7\x89\x8c\xe6\x8e\x92\xe8\xa1\x8c\\\")"}}],"metadata":{}}}],"status":"in_process","assistant_id":"659e54b1b8006379b4b2abd6","conversation_id":"66b1fda2e622113b69a20639"}

data: {"id":"202408061840346540a5d4d60d4d47","created":1722940838924,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"web_browser","web_browser":{"outputs":[{"title":"\xe5\xa5\x96\xe7\x89\x8c\xe7\xbb\x9f\xe8\xae\xa1 - 2024\xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe5\xa5\x96\xe7\x89\x8c\xe6\xa6\x9c - Olympics.com","link":"https://olympics.com/zh/paris-2024/medals","content":"2024\xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xef\xbc\x887\xe6\x9c\x8826\xe6\x97\xa5\xe8\x87\xb38\xe6\x9c\x8811\xe6\x97\xa5\xef\xbc\x89\xe5\xae\x98\xe6\x96\xb9\xe5\xa5\x96\xe7\x89\x8c\xe6\xa6\x9c\xe3\x80\x82\xe4\xba\x86\xe8\xa7\xa3\xe5\x93\xaa\xe4\xba\x9b\xe8\xbf\x90\xe5\x8a\xa8\xe5\x91\x98\xe8\xb5\xa2\xe5\xbe\x97\xe5\xa5\x96\xe7\x89\x8c\xe3\x80\x81\xe6\x89\x93\xe7\xa0\xb4\xe7\xba\xaa\xe5\xbd\x95\xe3\x80\x82AIN\xe8\xbf\x90"},{"title":"\xe5\xa5\x96\xe7\x89\x8c\xe6\xa6\x9c_2024\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a_\xe4\xbd\x93\xe8\x82\xb2_\xe5\xa4\xae\xe8\xa7\x86\xe7\xbd\x91(cctv.com)","link":"https://sports.cctv.com/Paris2024/medal_list/index.shtml","content":"2024\xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe4\xba\x8e2024\xe5\xb9\xb47\xe6\x9c\x8826\xe6\x97\xa5-8\xe6\x9c\x8811\xe6\x97\xa5\xe5\x9c\xa8\xe6\xb3\x95\xe5\x9b\xbd\xe5\xb7\xb4\xe9\xbb\x8e\xe4\xb8\xbe\xe8\xa1\x8c\xef\xbc\x8c\xe5\xa4\xae\xe8\xa7\x86\xe7\xbd\x91\xe7\x9b\xb4\xe6\x92\xad\xe7\xb2\xbe\xe5\xbd\xa9\xe5\xa5\xa5\xe8\xbf\x90\xe8\xb5\x9b\xe4\xba\x8b\xe3\x80\x81\xe7\x9b\xb4\xe5\x87\xbb\xe5\xb7\xb4"},{"title":"\xe5\xa5\x96\xe7\x89\x8c\xe5\xbe\x97\xe4\xb8\xbb - 2024\xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe9\x87\x91\xe7\x89\x8c\xe3\x80\x81\xe9\x93\xb6\xe7\x89\x8c\xe3\x80\x81\xe9\x93\x9c\xe7\x89\x8c\xe5\xbe\x97\xe4\xb8\xbb ...","link":"https://olympics.com/zh/paris-2024/medals/medallists","content":"2024\xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xef\xbc\x887\xe6\x9c\x8826\xe6\x97\xa5\xe8\x87\xb38\xe6\x9c\x8811\xe6\x97\xa5\xef\xbc\x89\xe5\xa5\x96\xe7\x89\x8c\xe5\xbe\x97\xe4\xb8\xbb\xe5\x88\x97\xe8\xa1\xa8\xe3\x80\x82\xe4\xba\x86\xe8\xa7\xa3\xe5\x93\xaa\xe4\xba\x9b\xe8\xbf\x90\xe5\x8a\xa8\xe5\x91\x98\xe8\xb5\xa2\xe5\xbe\x97\xe5\xa5\x96\xe7\x89\x8c\xe3\x80\x81\xe6\x89\x93\xe7\xa0\xb4\xe7\xba\xaa\xe5\xbd\x95\xe3\x80\x82\xe5\x9c\xa8\xe4\xbb\xa5\xe4\xb8\x8b"},{"title":"2024 \xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xef\xbc\x9a\xe5\xae\x9e\xe6\x97\xb6\xe5\xa5\x96\xe7\x89\x8c\xe6\xa6\x9c - 365Scores","link":"https://www.365scores.com/zh/olympics/league/olympics-7710/medals","content":"2024 \xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xef\xbc\x9a\xe5\xa5\x96\xe7\x89\x8c \xe6\xa6\x9c \xe5\x85\xb3\xe6\xb3\xa8 268.5K \xe8\xaf\xa6\xe6\x83\x85 \xe6\xaf\x94\xe8\xb5\x9b \xe5\xa5\x96\xe7\x89\x8c News \xe8\xa7\x81\xe8\xa7\xa3 \xe6\x9c\x80\xe8\xbf\x91\xe6\xaf\x94\xe8\xb5\x9b \xe7\xbb\x93"},{"title":"\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe6\x9c\x80\xe6\x96\xb0\xe5\xa5\x96\xe7\x89\x8c\xe6\xa6\x9c\xef\xbc\x9a\xe4\xb8\xad\xe5\x9b\xbd19\xe6\x9e\x9a\xe9\x87\x91\xe7\x89\x8c\xe6\x8e\x92\xe5\x90\x8d\xe7\xac\xac\xe4\xba\x8c\xef\xbc\x8c\xe7\xbe\x8e\xe5\x9b\xbd\xe9\xa6\x96\xe6\xac\xa1\xe5\x8d\x87 ...","link":"https://news.qq.com/rain/a/20240805A03HSB00","content":"\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe8\xb5\x9b\xe7\xa8\x8b\xe5\xb7\xb2\xe7\xbb\x8f\xe8\xbf\x87\xe5\x8d\x8a\xef\xbc\x8c\xe5\x90\x84\xe5\x8f\x82\xe8\xb5\x9b\xe5\x8d\x8f\xe4\xbc\x9a\xe8\xbf\x90\xe5\x8a\xa8\xe5\x81\xa5\xe5\x84\xbf\xe9\x83\xbd\xe5\x9c\xa8\xe5\xa5\x8b\xe5\x8a\x9b\xe6\x8b\xbc\xe6\x90\x8f\xef\xbc\x8c\xe4\xba\x89\xe5\x8f\x96\xe6\x9c\x80\xe4\xbd\xb3\xe6\x88\x98\xe7\xbb\xa9\xe3\x80\x82\xe6\x88\xaa\xe8\x87\xb38\xe6\x9c\x885\xe6\x97\xa5\xef\xbc\x8c\xe6\x9c\x80\xe6\x96\xb0\xe5\xa5\x96\xe7\x89\x8c\xe6\xa6\x9c\xe5\xb7\xb2\xe7\xbb\x8f\xe5\x87\xba"},{"title":"2024\xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe5\xa5\x96\xe7\x89\x8c\xe6\xa6\x9c - \xe7\x99\xbe\xe5\xba\xa6\xe7\x99\xbe\xe7\xa7\x91","link":"https://baike.baidu.com/item/2024%E5%B9%B4%E5%B7%B4%E9%BB%8E%E5%A5%A5%E8%BF%90%E4%BC%9A%E5%A5%96%E7%89%8C%E6%A6%9C/64375363","content":"2021\xe5\xb9\xb48\xe6\x9c\x88\xef\xbc\x8c2024\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe5\xae\x98\xe6\x96\xb9\xe5\x85\xac\xe5\xb8\x83\xe4\xba\x86\xe5\xa5\x96\xe7\x89\x8c\xe7\x9a\x84\xe8\xae\xbe\xe8\xae\xa1\xef\xbc\x8c\xe6\xad\xa4\xe6\xac\xa1\xe5\xa5\x96\xe7\x89\x8c\xe7\x94\xb1\xe6\xb3\x95\xe5\x9b\xbd\xe8\x91\x97\xe5\x90\x8d\xe8\xae\xbe\xe8\xae\xa1\xe5\xb8\x88 \xe8\x8f\xb2\xe5\x88\xa9\xe6\x99\xae\xc2\xb7\xe6\x96\xaf\xe5\xa1\x94\xe5\x85\x8b \xe8\xae\xbe"},{"title":"\xe5\xa5\xa5\xe8\xbf\x90\xe5\xa5\x96\xe7\x89\x8c\xe6\xa6\x9c\xef\xbc\x9a\xe6\xbe\xb3\xe5\xa4\xa7\xe5\x88\xa9\xe4\xba\x9a\xe9\xa2\x86\xe8\xb7\x91\xef\xbc\x8c\xe4\xb8\xad\xe5\x9b\xbd2\xe9\x87\x911\xe9\x93\x9c\xe7\xac\xac2\xef\xbc\x8c\xe5\x8a\x9b\xe5\x8e\x8b\xe7\xbe\x8e\xe5\x9b\xbd\xef\xbc\x8c20 ...","link":"https://new.qq.com/rain/a/20240728A00XOC00","content":"2024\xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe7\xbb\x93\xe6\x9d\x9f\xe9\xa6\x96\xe4\xb8\xaa\xe6\xaf\x94\xe8\xb5\x9b\xe6\x97\xa5\xe4\xba\x89\xe5\xa4\xba\xef\xbc\x8c\xe6\x9c\x80\xe6\x96\xb0\xe5\xa5\x96\xe7\x89\x8c\xe6\xa6\x9c\xef\xbc\x8c\xe4\xb8\xad\xe5\x9b\xbd\xe4\xbb\xa3\xe8\xa1\xa8\xe5\x9b\xa2\xe6\x96\xa9\xe8\x8e\xb72\xe9\x87\x911\xe9\x93\x9c3\xe6\x9e\x9a\xe5\xa5\x96\xe7\x89\x8c\xe9\xab\x98\xe5\xb1\x85\xe7\xac\xac2\xef\xbc\x8c\xe4\xbb\x85\xe6\xac\xa1\xe4\xba\x8e\xe6\xa6\x9c"},{"title":"\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe6\x9c\x80\xe6\x96\xb0\xe9\x87\x91\xe7\x89\x8c\xe6\xa6\x9c\xef\xbc\x9a\xe4\xb8\xad\xe5\x9b\xbd\xe9\x98\x9f2\xe9\x87\x91\xe6\x8e\x92\xe5\x90\x8d\xe7\xac\xac\xe4\xb8\x80\xef\xbc\x8c\xe7\xbe\x8e\xe5\x9b\xbd1\xe9\x93\xb6\xe6\x8e\x92\xe5\x90\x8d\xe7\xac\xac2 ...","link":"https://new.qq.com/rain/a/20240727A06T4N00","content":"\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe4\xb9\x9f\xe6\x98\xaf\xe8\xbf\x9b\xe5\x85\xa5\xe5\x88\xb0\xe4\xba\x86\xe7\xac\xac\xe4\xb8\x80\xe4\xb8\xaa\xe9\x87\x91\xe7\x89\x8c\xe6\x97\xa5\xef\xbc\x8c\xe4\xbb\x8a\xe5\xa4\xa9\xe4\xb8\x80\xe5\x85\xb1\xe4\xba\xa7\xe7\x94\x9f13\xe6\x9e\x9a\xe9\x87\x91\xe7\x89\x8c\xef\xbc\x88\xe6\x9c\x89\xe4\xb8\x80\xe4\xb8\xaa\xe9\x87\x91\xe7\x89\x8c\xe6\x8e\xa8\xe8\xbf\x9f\xe5\x88\xb0\xe4\xba\x8629\xe5\x8f\xb7\xef\xbc\x89\xef\xbc\x8c\xe8\x80\x8c\xe4\xb8\xad\xe5\x9b\xbd\xe9\x98\x9f\xe6\x9c\x80\xe6\x9c\x89"},{"title":"2024 \xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe7\x9a\x84\xe9\xa6\x96\xe6\x9e\x9a\xe4\xb8\xaa\xe4\xba\xba\xe9\x87\x91\xe7\x89\x8c\xe8\xaf\x9e\xe7\x94\x9f\xef\xbc\x81 - Olympics.com","link":"https://olympics.com/zh/paris-2024/live-updates/6f10f244-3831-4baa-8ac3-652e214d0eb8","content":"\xe5\x9c\xa8\xe5\xb7\xb4\xe9\xbb\x8e\xe7\x9a\x84\xe9\x98\xb4\xe9\x9b\xa8\xe5\xa4\xa9\xe4\xb8\xad\xef\xbc\x8c\xe5\xa5\xb3\xe5\xad\x90\xe5\x85\xac\xe8\xb7\xaf\xe8\x87\xaa\xe8\xa1\x8c\xe8\xbd\xa6\xe4\xb8\xaa\xe4\xba\xba\xe8\xae\xa1\xe6\x97\xb6\xe8\xb5\x9b\xe5\x9c\xa8\xe6\xb9\xbf\xe6\xbb\x91\xe7\x9a\x84\xe8\xb7\xaf\xe9\x9d\xa2\xe4\xb8\x8a\xe5\xbc\x80\xe8\xb5\x9b\xef\xbc\x8c\xe8\xbf\x99\xe4\xb9\x9f\xe7\xbb\x99\xe6\xaf\x94\xe8\xb5\x9b\xe5\xb8\xa6\xe6\x9d\xa5\xe4\xba\x86\xe6\x9e\x81\xe5\xa4\xa7\xe7\x9a\x84\xe5\x8f\x98\xe6\x95\xb0\xef\xbc\x8c\xe6\xbe\xb3\xe5\xa4\xa7\xe5\x88\xa9\xe4\xba\x9a\xe9\x80\x89"}]}}],"metadata":{}}}],"status":"in_process","assistant_id":"659e54b1b8006379b4b2abd6","conversation_id":"66b1fda2e622113b69a20639"}

data: {"id":"202408061840346540a5d4d60d4d47","created":1722940839985,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"web_browser","web_browser":{"input":"click(0)"}}],"metadata":{}}}],"status":"in_process","assistant_id":"659e54b1b8006379b4b2abd6","conversation_id":"66b1fda2e622113b69a20639"}

data: {"id":"202408061840346540a5d4d60d4d47","created":1722940840960,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"web_browser","web_browser":{"outputs":[{"title":"\xe8\xb7\xb3\xe8\xbd\xac\xe8\x87\xb3\xe4\xb8\xbb\xe8\xa6\x81\xe5\x86\x85\xe5\xae\xb9","link":"","content":"\xe8\xb7\xb3\xe8\xbd\xac\xe8\x87\xb3\xe4\xb8\xbb\xe8\xa6\x81\xe5\x86\x85\xe5\xae\xb9"},{"title":"\xe8\xb7\xb3\xe8\xbd\xac\xe8\x87\xb3\xe8\xaf\xad\xe8\xa8\x80\xe9\x80\x89\xe6\x8b\xa9","link":"","content":"\xe8\xb7\xb3\xe8\xbd\xac\xe8\x87\xb3\xe8\xaf\xad\xe8\xa8\x80\xe9\x80\x89\xe6\x8b\xa9"},{"title":"\xe8\xb7\xb3\xe8\xbd\xac\xe8\x87\xb3\xe7\x99\xbb\xe5\xbd\x95/\xe4\xb8\xaa\xe4\xba\xba\xe8\xb4\xa6\xe5\x8f\xb7","link":"","content":"\xe8\xb7\xb3\xe8\xbd\xac\xe8\x87\xb3\xe7\x99\xbb\xe5\xbd\x95/\xe4\xb8\xaa\xe4\xba\xba\xe8\xb4\xa6\xe5\x8f\xb7"},{"title":"\xe8\xb7\xb3\xe8\xbd\xac\xe8\x87\xb3\xe6\x90\x9c\xe7\xb4\xa2","link":"","content":"\xe8\xb7\xb3\xe8\xbd\xac\xe8\x87\xb3\xe6\x90\x9c\xe7\xb4\xa2"},{"title":"Skip to footer","link":"","content":"Skip to footer"},{"title":"\xe8\xbf\x94\xe5\x9b\x9e","link":"","content":"\xe8\xbf\x94\xe5\x9b\x9e"},{"title":"","link":"","content":""},{"title":"\xe5\xa5\x96\xe7\x89\x8c","link":"","content":"\xe5\xa5\x96\xe7\x89\x8c"},{"title":"\xe5\xa5\x96\xe7\x89\x8c\xe5\xbe\x97\xe4\xb8\xbb","link":"","content":"\xe5\xa5\x96\xe7\x89\x8c\xe5\xbe\x97\xe4\xb8\xbb"}]}}],"metadata":{}}}],"status":"in_process","assistant_id":"659e54b1b8006379b4b2abd6","conversation_id":"66b1fda2e622113b69a20639"}

data: {"id":"202408061840346540a5d4d60d4d47","created":1722940843538,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"web_browser","web_browser":{"input":"quote_lines(65, 75)\\nquote_lines(69, 71)\\nquote_lines(73, 83)"}}],"metadata":{}}}],"status":"in_process","assistant_id":"659e54b1b8006379b4b2abd6","conversation_id":"66b1fda2e622113b69a20639"}

data: {"id":"202408061840346540a5d4d60d4d47","created":1722940843541,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"web_browser","web_browser":{"outputs":[{"title":"\xe5\xa5\x96\xe7\x89\x8c\xe7\xbb\x9f\xe8\xae\xa1 - 2024\xe5\xb9\xb4\xe5\xb7\xb4\xe9\xbb\x8e\xe5\xa5\xa5\xe8\xbf\x90\xe4\xbc\x9a\xe5\xa5\x96\xe7\x89\x8c\xe6\xa6\x9c","link":"https://olympics.com/zh/paris-2024/medals","content":"[Image 16]USA\xe7\xbe\x8e\xe5\x88\xa9\xe5\x9d\x9a\xe5\x90\x88\xe4\xbc\x97\xe5\x9b\xbd\\n\\n20292877[Image 17]"}]}}],"metadata":{}}}],"status":"in_process","assistant_id":"659e54b1b8006379b4b2abd6","conversation_id":"66b1fda2e622113b69a20639"}
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

#### Knowledge Base Retrieval Message

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| role | String | Current conversation role, divided into assistant (model), tool (tool)   When `Role = tool`, the tool inputs and outputs content to tool\_calls |
| tool\_calls | List<Object> | Tool message body |
| type | String | Type of tool being called, currently supports function, code\_interpreter, drawing\_tool, web\_browser, retrieval.  `type = retrieval` indicates knowledge base retrieval |
| retrieval | Object | Returned when type is retrieval |
| outputs | List<Object> | Retrieval slices |
| text | String | Retrieved slice |
| document | String | Name of the retrieved document, returned only when the agent is configured |

**Message Example**

```
data: {"id":"2024080616285251e6b5e332a0467d","created":1722932971802,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"retrieval","retrieval":{"outputs":[{"text":"something to retrieve","document":"doc1.pdf"},{"text":"something to retrieve","document":"doc2.pdf"},{"text":"something to retrieve","document":"doc3.pdf"}]}}],"metadata":{}}}],"status":"in_process","assistant_id":"65a265419d72d299a9230616","conversation_id":"66b1dec43858e2cffd41c92d"}
```

1

#### Function Call Message

| Parameter Name | Type | Parameter Description |
| --- | --- | --- |
| role | String | Current conversation role, divided into assistant (model), tool (tool)   When `Role = tool`, the tool inputs and outputs content to tool\_calls |
| tool\_calls | List<Object> | Tool message body |
| type | String | Type of tool being called, currently supports function, code\_interpreter, drawing\_tool, web\_browser, retrieval.  `type = function` indicates external function call |
| function | Object | Returned when type is function |
| name | String | Name of the function generated by the model for the call. |
| arguments | Object | JSON formatted function call arguments generated by the model |
| outputs | List<Object> | Return content of the requested API |
| content | String | Json string |

**Message Example**

```
data: {"id":"20240807112820a596643f968749f0","created":1723001422554,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"function","function":{"name":"GenerateMindMap","arguments":"```python\\ntool_call(markmap=\'# Llama 3\xe6\xa8\xa1\xe5\x9e\x8b\\\\n- \xe5\xbc\x95\xe8\xa8\x80\\\\n- \xe6\xa8\xa1\xe5\x9e\x8b\xe6\x9e\xb6\xe6\x9e\x84\\\\n- \xe8\xae\xad\xe7\xbb\x83\xe6\x96\xb9\xe6\xb3\x95\\\\n- \xe6\x80\xa7\xe8\x83\xbd\\\\n\\\\n# \xe5\xa4\x9a\xe6\xa8\xa1\xe6\x80\x81\xe8\x83\xbd\xe5\x8a\x9b\\\\n- \xe5\x9b\xbe\xe5\x83\x8f\xe8\xaf\x86\xe5\x88\xab\\\\n- \xe8\xa7\x86\xe9\xa2\x91\xe7\x90\x86\xe8\xa7\xa3\\\\n- \xe8\xaf\xad\xe9\x9f\xb3\xe8\xaf\x86\xe5\x88\xab\\\\n\\\\n# \xe6\x8e\xa8\xe7\x90\x86\xe8\x83\xbd\xe5\x8a\x9b\\\\n- \xe6\x95\xb0\xe5\xad\xa6\xe6\x8e\xa8\xe7\x90\x86\\\\n- \xe9\x80\xbb\xe8\xbe\x91\xe6\x8e\xa8\xe7\x90\x86\\\\n\\\\n# \xe9\x95\xbf\xe6\x9c\x9f\xe4\xb8\x8a\xe4\xb8\x8b\xe6\x96\x87\xe5\xa4\x84\xe7\x90\x86\\\\n- \xe9\x95\xbf\xe6\x96\x87\xe6\x9c\xac\xe7\x90\x86\xe8\xa7\xa3\\\\n- \xe9\x95\xbf\xe5\xaf\xb9\xe8\xaf\x9d\xe5\xa4\x84\xe7\x90\x86\\\\n\\\\n# \xe5\xb7\xa5\xe5\x85\xb7\xe4\xbd\xbf\xe7\x94\xa8\\\\n- \xe6\x90\x9c\xe7\xb4\xa2\xe5\xbc\x95\xe6\x93\x8e\\\\n- \xe7\xbc\x96\xe7\xa8\x8b\xe5\xb7\xa5\xe5\x85\xb7\\\\n- \xe8\xae\xa1\xe7\xae\x97\xe5\xbc\x95\xe6\x93\x8e\\\\n\\\\n# \xe5\xa4\x9a\xe8\xaf\xad\xe8\xa8\x80\xe6\x94\xaf\xe6\x8c\x81\\\\n- \xe8\x8b\xb1\xe8\xaf\xad\\\\n- \xe5\xbe\xb7\xe8\xaf\xad\\\\n- \xe6\xb3\x95\xe8\xaf\xad\\\\n- ...\\\\n\\\\n# \xe5\xae\x89\xe5\x85\xa8\xe6\x80\xa7\\\\n- \xe5\x86\x85\xe5\xae\xb9\xe8\xbf\x87\xe6\xbb\xa4\\\\n- \xe5\xaf\xb9\xe6\x8a\x97\xe6\x80\xa7\xe6\x94\xbb\xe5\x87\xbb\\\\n- \xe7\x94\xa8\xe6\x88\xb7\xe6\x8c\x87\xe4\xbb\xa4\xe9\x81\xb5\xe5\xbe\xaa\\\\n\')\\n```"}}],"metadata":{}}}],"status":"in_process","assistant_id":"664e0cade018d633146de0d2","conversation_id":"66b2e9d4a475eb421f34ee6c"}

data: {"id":"20240807112820a596643f968749f0","created":1723001425799,"choices":[{"index":0,"delta":{"role":"tool","tool_calls":[{"index":0,"type":"function","function":{"outputs":[{"content":"{\\\"url\\\":\\\"https://sfile.chatglm.cn/markmap/f820b149-e786-43ed-b00c-04e61108d457.png\\\"}"}]}}],"metadata":{}}}],"status":"in_process","assistant_id":"664e0cade018d633146de0d2","conversation_id":"66b2e9d4a475eb421f34ee6c"}
```

1  
2  
3

## Conversation File Upload

**Interface Request**

| Type | Description |
| --- | --- |
| Transfer Method | HTTPS |
| Request Address | https://open.bigmodel.cn/api/paas/v4/files |
| Invocation Method | Synchronous Call |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |
| Development Language | Any development language capable of initiating HTTP requests |

### Request Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| file | File | Yes | File stream. Only supports uploading a single file. |
| purpose | String | Yes | The purpose of uploading the file, supports fine-tune, retrieval, batch, and assistant  `purpose = assistant` is used to upload files for the intelligent agent conversation, with a single file size not exceeding 20MB, and a maximum of 10 files allowed per conversation.  Assistant supports file formats such as pdf, doc, xlsx, ppt, txt, jpg, png, etc. |

**Request Example**

```
from zhipuai import ZhipuAI
api_key = "YOUR API KEY"
url = "https://open.bigmodel.cn/api/paas/v4"
client = ZhipuAI(api_key=api_key, base_url=url)
resp = client.files.create(
    file=open("/user/path/modelglm.pdf","rb"),
    purpose="assistant"
)
print(resp)
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

### Response Parameters

| Field | Type | Description |
| --- | --- | --- |
| id | String | File ID |
| filename | String | File name |
| purpose | String | The purpose of this file |

**Response Example**

```
{
    "bytes":9221938,
    "created_at": 1722947374,
    "filename": "modelglm.pdf",
    "object":"file",
    "purpose":"assistant",
    "id":"7931838c-a132-4e7c-b87d-xxxxxxxxx"
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

## Query Assistant List

**Interface Request**

| Type | Description |
| --- | --- |
| Transfer Method | HTTPS |
| Request Address | https://open.bigmodel.cn/api/paas/v4/assistant/list |
| Invocation Method | Synchronous Call |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |
| Development Language | Any development language capable of initiating HTTP requests |

### Request Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| assistant\_id\_list | List<String> | Yes | Specifies the Assistant to be queried. If empty, all Assistants are queried. |

**Request Example**

```
from zhipuai import ZhipuAI
api_key = "YOUR API KEY"
url = "https://open.bigmodel.cn/api/paas/v4"
client = ZhipuAI(api_key=api_key, base_url=url)
response = client.assistant.query_support(
        assistant_id_list=[]
    )
print(response)
```

1  
2  
3  
4  
5  
6  
7  
8

### Response Parameters

| Field | Type | Description |
| --- | --- | --- |
| data | List<Object> | Returns a list of available Assistant. Refer to the Assistant structure for details. |

**Assistant Structure**

| Field | Type | Description |
| --- | --- | --- |
| assistant\_id | String | Assistant id of the intelligent agent, used for the intelligent agent conversation |
| created\_at | Integer | Creation time |
| updated\_at | Integer | Update time |
| name | String | Name of the intelligent agent |
| avatar | String | Avatar of the intelligent agent |
| description | String | Description of the intelligent agent |
| status | String | Status of the intelligent agent, currently only publish |
| tools | List<String> | Tools supported by the intelligent agent |
| starter\_prompts | List<String> | Recommended prompts for starting the intelligent agent |

**Response Example**

```
{
    "assistant_id": "664dd7bd5bb3a13ba0f81668",
    "tools": ["web_browser", "code_interpreter"],
    "name": "Complex Flowchart",
    "avatar": "https://sfile.chatglm.cn/img2text/dae0f2d3-4497-4c07-a2bf-b8b613dd4e42.jpg",
    "description": "A flowchart tool that everyone can master, make a flowchart in five seconds to impress your colleagues.",
    "status": "publish",
    "starter_prompts": ["Draw a login flowchart for an App", "Use the decision to 'whether to go swimming' as an example to draw a decision tree flowchart, with factors including: weather, water temperature, free time, pool opening, mood", "Master the entire product development process of large models with one chart," "Use a Data Flow Diagram (DFD) to show the order process of an e-commerce website," "Use a UML sequence diagram to show the payment process of an online shopping system," "Use a VSM value stream map to show the production process optimization of a blind box factory"],
    "created_at": "Wed, 22 May 2024 11:32:13 GMT",
    "updated_at": "Sun, 21 Jul 2024 11:11:16 GMT"
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

## Query Conversation List

**Interface Request**

| Type | Description |
| --- | --- |
| Transfer Method | HTTPS |
| Request Address | https://open.bigmodel.cn/api/paas/v4/assistant/conversation/list |
| Invocation Method | Synchronous Call |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |
| Development Language | Any development language capable of initiating HTTP requests |

### Request Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| assistant\_id | string | Yes | Assistant id of the intelligent agent |
| page | integer | Yes | Current page |
| page\_size | integer | Yes | Number of pages |

**Request Example**

```
from zhipuai import ZhipuAI
api_key = "YOUR API KEY"
url = "https://open.bigmodel.cn/api/paas/v4"
client = ZhipuAI(api_key=api_key, base_url=url)
response = client.assistant.query_conversation_usage(
    assistant_id="65a265419d72d299a9230616",
    page_size=10,
    page=1
)
print(response)
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

### Response Parameters

| Field | Type | Description |
| --- | --- | --- |
| assistant\_id | string | Intelligent agent id |
| has\_more | boolean | Whether there are more pages |
| conversation\_list | List<Object> | List of returned Conversations |

**Conversation Structure**

| Field | Type | Description |
| --- | --- | --- |
| id | String | Conversation id |
| assistant\_id | String | Assistant id of the intelligent agent |
| create\_time | Integer | Creation time |
| update\_time | Integer | Update time |
| usage | Object | Token count statistics in the conversation |
| prompt\_tokens | Integer | Number of tokens entered by the user |
| completion\_tokens | Integer | Number of tokens entered by the model |
| total\_tokens | Integer | Total number of tokens |

**Response Example**

```
{
    "assistant_id": "6654898292788e88ce9e7f4c",
    "conversation_list": [{
            "id": "66b2102552637228d96c3c6b",
            "assistant_id": "6654898292788e88ce9e7f4c",
            "create_time": "2024-08-06 19:59:33",
            "update_time": "2024-08-06 20:00:02",
            "usage": {
                    "prompt_tokens": 1075,
                    "completion_tokens": 389,
                    "total_tokens": 1464
            }
    }, {
            "id": "66b20fd156d1fb63686c3c65",
            "assistant_id": "6654898292788e88ce9e7f4c",
            "create_time": "2024-08-06 19:58:09",
            "update_time": "2024-08-06 19:58:15",
            "usage": {
                    "prompt_tokens": 1074,
                    "completion_tokens": 71,
                    "total_tokens": 1145
            }
    }, {
            "id": "66b1ed757fcdc3c035a2053c",
            "assistant_id": "6654898292788e88ce9e7f4c",
            "create_time": "2024-08-06 17:31:33",
            "update_time": "2024-08-06 17:31:45",
            "usage": {
                    "prompt_tokens": 1072,
                    "completion_tokens": 187,
                    "total_tokens": 1259
            }
    }],
    "has_more": false
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

## Next Step Question Suggestions

**Interface Request**

| Type | Description |
| --- | --- |
| Transfer Method | HTTPS |
| Request Address | https://open.bigmodel.cn/api/paas/v4/assistant/conversation/suggest |
| Invocation Method | Synchronous Call |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |
| Development Language | Any development language capable of initiating HTTP requests |

### Request Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| assistant\_id | string | Yes | Assistant id of the intelligent agent |
| conversation\_id | String | Yes | Conversation ID, used to create suggestions for the next step based on the last record of this conversation |

### Response Parameters

| Field | Type | Description |
| --- | --- | --- |
| suggest\_list | List<String> | List of suggestions for the next step, typically 3 suggestions |

Table of contents

Introduction

Assistant Conversation

Request Parameters

Streaming Response Parameters

Session Message Body

Conversation File Upload

Request Parameters

Response Parameters

Query Assistant List

Request Parameters

Response Parameters

Query Conversation List

Request Parameters

Response Parameters

Next Step Question Suggestions

Request Parameters

Response Parameters