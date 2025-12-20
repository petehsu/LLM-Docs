[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Fcode-model%2Fcodegeex-4)

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

# CodeGeeX-4

Model Code：codegeex-4

CodeGeeX is a powerful AI programming assistant that offers intelligent Q&A and code completion features. It supports multiple programming languages, helping developers enhance their coding efficiency.

## Chat（SSE Call）

#### API Request

| Transmission Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/chat/completions |
| Calling Method | Synchronous call, wait for the model to execute and return the final result or SSE call |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON or Standard Stream Event |
| Request Type | POST |
| Development Language | Any development language capable of making HTTP requests |

#### **API Request Parameters**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| model | String | Yes | The model code to be called. |
| messages | List<Object> | Yes | When calling the language model, input the current conversation information list as prompts to the model in the form of a JSON array like `{"role": "user", "content": "Hello"}`. Possible message types include User message and Assistant message. |
| request\_id | String | No | A unique identifier for each request, provided by the client side to distinguish each request. If not provided, the platform will generate it by default. |
| do\_sample | Boolean | No | When `do_sample` is true, the sampling strategy is enabled; when `do_sample` is false, the sampling strategy parameters such as `temperature`, `top_p` will not take effect. |
| stream | Boolean | No | Should be set to False or omitted for synchronous calls. If set to True, the model returns content in chunks through a standard Event Stream. The Event Stream ends with a `data: [DONE]` message. |
| temperature | Float | No | Sampling temperature, controlling the randomness of output. Must be a positive number. Valid range: (0.0, 1.0）, cannot be 0. A higher value increases randomness and creativity; a lower value makes output more stable or predictable. Adjust according to application scenario. |
| top\_p | Float | No | Another method of sampling, called nucleus sampling. Valid range: (0.0, 1.0) open interval, cannot be 0 or 1, default is 0.7. The model considers results within the top\_p probability mass of tokens. For example, 0.1 means the decoder considers tokens from the top 10% of candidates. Adjust according to application scenario. |
| max\_tokens | Interger | No | The maximum number of tokens the model can output. |
| stop | List | No | The model will stop generating when encountering the characters specified by stop. It is recommended to use `["< |
| user\_id | String | No | Unique ID of the end user, helping the platform to intervene in the end user’s illegal activities, generation of illegal and inappropriate information, or other abusive behavior. ID length requirement: at least 6 characters, maximum of 128 characters. [Learn more](https://open.bigmodel.cn/dev/howuse/securityaudit) . |

**messages 字段说明**

The model can accept two types of messages: User message and Assistant message. Each message type has a distinct format, as detailed below:

System message ：

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| role | String | Yes | The role of the message, should be “system” in this case. |
| content | String | Yes | The content of the message. |

User message ：

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| role | String | Yes | The role of the message, should be “user” in this case. |
| content | String | Yes | The content of the message. |

Assistant message ：

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| role | String | Yes | The role of the message, should be “assistant” in this case. |
| content | String | Yes | The content of the message. |

#### Synchronous Call Response Content

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | String | Task ID |
| created | Long | Request creation time, in Unix timestamp seconds. |
| model | String | Model name |
| choices | List | Outputs of the current dialogue model |
| index | Integer | Result index |
| finish\_reason | String | Reason for model inference termination. “stop” for natural end or stop word triggered, “length” for reaching token length limit. |
| message | Object | Text message returned by the model |
| role | String | Role in the current dialogue, currently default to “assistant” (model) |
| content | String | Content of the current dialogue |
| usage | Object | Token count statistics at the end of model call |
| prompt\_tokens | Integer | Number of tokens from user input |
| completion\_tokens | Integer | Number of tokens output by the model |
| total\_tokens | Integer | Total number of tokens |

#### Stream Response Content Block

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | String | Task order number generated by Zhipu AI Open Platform, use this number when querying request results. |
| created | Long | Request creation time, in Unix timestamp seconds. |
| choices | List | Outputs of the current dialogue model |
| index | Integer | Result index |
| finish\_reason | String | Reason for model inference termination. “stop” for natural end or stop word triggered, “length” for reaching token length limit. |
| delta | Object | Incremental text returned by the model |
| role | String | Role in the current dialogue, currently default to “assistant” (model) |
| content | String | Content of the current dialogue |
| usage | Object | Token count statistics at the end of model call |
| prompt\_tokens | Integer | Number of tokens from user input |
| completion\_tokens | Integer | Number of tokens output by the model |
| total\_tokens | Integer | Total number of tokens |

### Python Call Example

#### Synchronous Call

**Request Example**

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="")  
response = client.chat.completions.create(
    model="codegeex-4",  
    messages=[
        {
            "role": "system",
            "content": "You are an intelligent programming assistant named CodeGeeX. You will answer any questions related to programming, code, and computers, providing well-formatted, executable, accurate, and safe code, and detailed explanations when necessary. Task: Please provide well-formatted comments for the input code, including both multi-line and single-line comments. Please ensure not to modify the original code, only add comments. Please respond in Chinese."
        },
        {
            "role": "user",
            "content": "Write a quicksort function"
        }
    ],
    top_p=0.7,
    temperature=0.9,
    max_tokens=1024,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)
print(response.choices[0].message)
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

**Response Example**

```
{
    "created": 1719929866,
    "id": "8804608774531416088",
    "model": "codegeex-4",
    "request_id": "8804608774531416088",
    "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "# Quicksort functiondef quick_sort(arr):# If the array length is less than or equal to 1, return it directlyif len(arr) <= 1:return arr# Choose the first element in the array as the pivot pivot = arr[0]# Place elements less than the pivot in the left array, and elements greater than the pivot in the right array
left = [x for x in arr[1:] if x <= pivot] right = [x for x in arr[1:] if x > pivot] # Recursively call the quick_sort function on the left and right arrays, and concatenate the results with the pivotreturn quick_sort(left) + [pivot] + quick_sort(right) 4o",
                "role": "assistant"
            }
        }
    ],
    "usage": {
        "completion_tokens": 157,
        "prompt_tokens": 92,
        "total_tokens": 249
    }
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

#### Streaming Call

**Request Example**

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="")  
response = client.chat.completions.create(
    model="codegeex-4",  
    messages=[
        {
            "role": "system",
            "content": "You are an intelligent programming assistant named CodeGeeX. You will answer any questions related to programming, code, and computers, providing well-formatted, executable, accurate, and safe code, and detailed explanations when necessary. Task: Please provide well-formatted comments for the input code, including both multi-line and single-line comments. Please ensure not to modify the original code, only add comments. Please respond in Chinese."
        },
        {
            "role": "user",
            "content": "Write a quicksort function"
        }
    ],
    top_p=0.7,
    temperature=0.9,
    max_tokens=1024,
    stream=True,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)
for chunk in response:
    print(chunk.choices[0].delta)
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

**Response Example**

```
{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":"```"}}]}
{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":"python"}}]}
{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":"\n#"}}]}
{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":" Quicksort "}}]}
{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":"def"}}]}
{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":"quick_sort"}}]}

... ...

{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":" quick"}}]}
{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":"_sort"}}]}
{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":"(right"}}]}
{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":")\n```"}}]}
{"id":"8804608774531416093","created":1719930157,"model":"codegeex-4","choices":[{"index":0,"finish_reason":"stop","delta":{"role":"assistant","content":""}}],"usage":{"prompt_tokens":92,"completion_tokens":158,"total_tokens":250}}
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

### Code Q&A (Asynchronous API)

#### **API Request**

| Transmission Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/async/chat/completions |
| Calling Method | Asynchronous, results must be fetched using a query interface |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| HTTP Method | POST |
| Development Language | Any capable of making HTTP requests |

#### API Request Parameters

The request parameters are the same as those for synchronous API calls.

#### Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| request\_id | String | The task number submitted by the client or generated by the platform during the request initiation. |
| id | String | Task order number generated by Zhishang AI Open Platform, used when querying results. |
| model | String | The name of the model called during the API request. |
| task\_status | string | Processing status of the request: `PROCESSING` (in progress), `SUCCESS` (successful), `FAIL` (failed). This status must be queried to determine the outcome. |

### Python Call Example

**Request Example**

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") 
response = client.chat.asyncCompletions.create(
    model="codegeex-4",  
    messages=[
        {
            "role": "system",
            "content": "You are an intelligent programming assistant named CodeGeeX. You will answer any questions related to programming, code, and computers, providing well-formatted, executable, accurate, and safe code, and detailed explanations when necessary. Task: Please provide well-formatted comments for the input code, including both multi-line and single-line comments. Please ensure not to modify the original code, only add comments. Please respond in Chinese."
        },
        {
            "role": "user",
            "content": "Write a quicksort function"
        }
    ],
    top_p=0.7,
    temperature=0.9,
    max_tokens=2000,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
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

**Response Example**

```
id='850817101390499798804608774531416095' request_id='8804608774531416094' model='codegeex-4' task_status='PROCESSING'
```

1

#### Task Result Query

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/async-result/{id} |
| Calling Method | Synchronous invocation, wait for the model to execute completely and return the final result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| HTTP Method | GET |
| Development Language | Any development language capable of initiating an HTTP request |

#### Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| id | String | Yes | Task id |

#### Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| model | String | Model name |
| choices | List | Current dialogue model output content, currently only returns one |
| index | Integer | Result index |
| finish\_reason | String | Reason for model inference termination. “stop” for natural end or triggering stop words, “length” for reaching token length limit. |
| message | Object | Model returned text message |
| role | String | Role in the current dialogue, currently defaults to assistant (model) |
| content | String | Content of the current dialogue |
| task\_status | String | Processing status: PROCESSING (in process), SUCCESS (successful), FAIL (failed) |
| request\_id | String | Task number submitted by the user during client request or generated by the platform |
| id | String | Task order number generated by Zhipu AI Open Platform, use this order number when calling the request result interface |
| usage | Object | Token count statistics for this model invocation |
| prompt\_tokens | int | Number of tokens input by the user |
| completion\_tokens | int | Number of tokens output by the model |
| total\_tokens | int | Total number of tokens |

### Python Call Example

Request Example:

```
import time
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="") 
response = client.chat.asyncCompletions.create(
    model="codegeex-4",  
    messages=[
        {
            "role": "system",
            "content": "You are an intelligent programming assistant named CodeGeeX. You will answer any questions related to programming, code, and computers, providing well-formatted, executable, accurate, and safe code, and detailed explanations when necessary. Task: Please provide well-formatted comments for the input code, including both multi-line and single-line comments. Please ensure not to modify the original code, only add comments. Please respond in Chinese."
        },
        {
            "role": "user",
            "content": "Write a quicksort function"
        }
    ],
    top_p=0.7,
    temperature=0.9,
    max_tokens=2000,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)
task_id = response.id
task_status = ''
get_cnt = 0
while task_status != 'SUCCESS' and task_status != 'FAILED' and get_cnt <= 40:
    result_response = client.chat.asyncCompletions.retrieve_completion_result(id=task_id)
    print(result_response)
    task_status = result_response.task_status

    time.sleep(2)
    get_cnt += 1
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

**Response Example:**

```
{"id":"850817101390499798804608774531416097","request_id":"8804608774531416096","model":null,"task_status":"PROCESSING"}
{"id":"850817101390499798804608774531416097","request_id":"8804608774531416096","model":null,"task_status":"PROCESSING"}

... ...

{"id":"850817101390499798804608774531416097","request_id":"8804608774531416096","model":null,"task_status":"PROCESSING"}
{
   
    "created": 1719930768,
    "id": "850817101390499798804608774531416097",
    "model": "codegeex-4",
    "request_id": "8804608774531416096",
    "task_status": "SUCCESS",
     "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "# Quicksort functiondef quick_sort(arr):     # If the array length is less than or equal to 1, return the array directlyif len(arr) <= 1:         return arr     # Choose the pivot, here we choose the first element     pivot = arr[0]     # Define the left and right subarrays     left = []     right = []     # Iterate through the array, placing elements less than the pivot into the left subarray, and elements greater than the pivot into the right subarrayfor i in range(1, len(arr)):         if arr[i] < pivot:             left.append(arr[i])         else:             right.append(arr[i])     # Recursively call the quicksort function to sort the left and right subarraysreturn quick_sort(left) + [pivot] + quick_sort(right)",
                "role": "assistant"
            }
        }
    ],
    "usage": {
        "completion_tokens": 173,
        "prompt_tokens": 92,
        "total_tokens": 265
    }
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

### Code Completion(SSE Invocation)

**API Request**

| Transmission Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/chat/completions |
| Calling Method | Synchronous call, wait for the model to execute and return the final result or SSE call |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON or Standard Stream Event |
| Request Type | POST |
| Development Language | Any development language capable of making HTTP requests |

#### **API Request Parameters**

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| model | String | Yes | The model code to be called. |
| request\_id | String | No | A unique identifier for each request, provided by the client side to distinguish each request. If not provided, the platform will generate it by default. |
| do\_sample | Boolean | No | When `do_sample` is true, the sampling strategy is enabled; when `do_sample` is false, the sampling strategy parameters such as `temperature`, `top_p` will not take effect. |
| stream | Boolean | No | Should be set to False or omitted for synchronous calls. If set to True, the model returns content in chunks through a standard Event Stream. The Event Stream ends with a `data: [DONE]` message. |
| temperature | Float | No | Sampling temperature, controlling the randomness of output. Must be a positive number. Valid range: (0.0, 1.0], cannot be 0. A higher value increases randomness and creativity; a lower value makes output more stable or predictable. Adjust according to application scenario. |
| top\_p | Float | No | Another method of sampling, called nucleus sampling. Valid range: (0.0, 1.0) open interval, cannot be 0 or 1, default is 0.7. The model considers results within the top\_p probability mass of tokens. For example, 0.1 means the decoder considers tokens from the top 10% of candidates. Adjust according to application scenario. |
| max\_tokens | Interger | No | The maximum number of tokens the model can output. |
| stop | List | No | The model will stop generating when encountering the characters specified by stop. It is recommended to use`["< |
| extra | Object | No | Parameters related to code completion |
| target | Object | No | Parameters for the content to be completed |
| path | string | No | File path |
| language | string | No | Type of programming language, supports Python, Java, C, C++, and over 100 other languages |
| code\_prefix | string | No | Content preceding the completion position |
| code\_suffix | string | No | Content following the completion position |
| contexts | List<Object> | No | Additional code file contexts, where one context represents an additional file |
| path | string | No | ath to the additional code file |
| code | string | No | Content of the additional code |
| user\_id | String | No | Unique ID of the end user, helping the platform to intervene in the end user’s illegal activities, generation of illegal and inappropriate information, or other abusive behavior. ID length requirement: at least 6 characters, maximum of 128 characters. Learn more |

### Response parameters

#### Synchronous Call Response Content

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | String | Task ID |
| created | Long | Request creation time, in Unix timestamp seconds. |
| model | String | Model name |
| choices | List | Outputs of the current dialogue model |
| index | Integer | Result index |
| finish\_reason | String | Reason for model inference termination. “stop” for natural end or stop word triggered, “length” for reaching token length limit. |
| message | Object | Text message returned by the model |
| role | String | Role in the current dialogue, currently default to “assistant” (model) |
| content | String | Content of the current dialogue |
| usage | Object | Token count statistics at the end of model call |
| prompt\_tokens | Integer | Number of tokens from user input |
| completion\_tokens | Integer | Number of tokens output by the model |
| total\_tokens | Integer | Total number of tokens |

#### Stream Response Content Block

| Parameter Name | Type | Description |
| --- | --- | --- |
| id | String | Task order number generated by Zhishang AI Open Platform, use this number when querying request results. |
| created | Long | Request creation time, in Unix timestamp seconds. |
| choices | List | Outputs of the current dialogue model |
| index | Integer | Result index |
| finish\_reason | String | Reason for model inference termination. “stop” for natural end or stop word triggered, “length” for reaching token length limit. |
| delta | Object | Incremental text returned by the model |
| role | String | Role in the current dialogue, currently default to “assistant” (model) |
| content | String | Content of the current dialogue |
| usage | Object | Token count statistics at the end of model call |
| prompt\_tokens | Integer | Number of tokens from user input |
| completion\_tokens | Integer | Number of tokens output by the model |
| total\_tokens | Integer | Total number of tokens |

### Python Call Example

#### Synchronous Call

**Request Example**

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") 
response = client.chat.completions.create(
    model="codegeex-4", 
    messages=[],
    extra={
        "target": {
            "path": "quick_sort.py",
            "language": "Python",
            "code_prefix": "def quick_sort(arr):\n    ",
            "code_suffix": ""
        },
        "contexts": []
    },
    top_p=0.7,
    temperature=0.9,
    max_tokens=1024,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)
print(response.choices[0].message)
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

**Response Example**

```
{
    "created": 1720008093,
    "id": "8807577524653187075",
    "model": "codegeex-4",
    "request_id": "8807577524653187075",
    "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "    # If the list is empty or contains only one element, it is already sorted\n    if len(arr) <= 1:\n        return arr\n",
                "role": "assistant"
            }
        }
    ],
    "usage": {
        "completion_tokens": 32,
        "prompt_tokens": 28,
        "total_tokens": 60
    }
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

#### Streaming Call

Request Example

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") 
response = client.chat.completions.create(
    model="codegeex-4", 
    messages=[],
    extra={
        "target": {
            "path": "quick_sort.py",
            "language": "Python",
            "code_prefix": "def quick_sort(arr):\n    ",
            "code_suffix": ""
        },
        "contexts": []
    },
    top_p=0.7,
    temperature=0.9,
    stream=True,
    max_tokens=1024,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)
for chunk in response:
    print(chunk.choices[0].delta)
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

**Response Example**

```
{"id":"8807577524653187084","created":1720008235,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":"  "}}]}
{"id":"8807577524653187084","created":1720008235,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":" #"}}]}
{"id":"8807577524653187084","created":1720008235,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":" quick"}}]}
{"id":"8807577524653187084","created":1720008235,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":" sort"}}]}
... ...

{"id":"8807577524653187084","created":1720008235,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":" list"}}]}
{"id":"8807577524653187084","created":1720008235,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":"\n   "}}]}
{"id":"8807577524653187084","created":1720008235,"model":"codegeex-4","choices":[{"index":0,"delta":{"role":"assistant","content":" pass"}}]}
{"id":"8807577524653187084","created":1720008235,"model":"codegeex-4","choices":[{"index":0,"finish_reason":"stop","delta":{"role":"assistant","content":""}}],"usage":{"prompt_tokens":28,"completion_tokens":13,"total_tokens":41}}
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

### Code completion (Asynchronous call)

**API Request**

| Transmission Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/async/chat/completions |
| Calling Method | Asynchronous, results must be fetched using a query interface |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| HTTP Method | POST |
| Development Language | Any capable of making HTTP requests |

#### API Request Parameters

The request parameters are the same as those for synchronous API calls.

#### Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| request\_id | String | The task number submitted by the client or generated by the platform during the request initiation. |
| id | String | Task order number generated by Zhishang AI Open Platform, used when querying results. |
| model | String | The name of the model called during the API request. |
| task\_status | string | Processing status of the request: `PROCESSING` (in progress), `SUCCESS` (successful), `FAIL` (failed). This status must be queried to determine the outcome. |

### Python Call Example

**Request Example**

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") 
response = client.chat.asyncCompletions.create(
    model="codegeex-4", 
    messages=[],
    extra={
        "target": {
            "path": "quick_sort.py",
            "language": "Python",
            "code_prefix": "def quick_sort(arr):\n    ",
            "code_suffix": ""
        },
        "contexts": []
    },
    top_p=0.7,
    temperature=0.9,
    stream=True,
    max_tokens=1024,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
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

**Response Example**

```
id='850817101390499798804608774531416095' request_id='8804608774531416094' model='codegeex-4' task_status='PROCESSING'
```

1

#### Task Result Query

#### Interface Request

| Transmission Method | https |
| --- | --- |
| Request URL | https://open.bigmodel.cn/api/paas/v4/async-result/{id} |
| Calling Method | Synchronous invocation, wait for the model to execute completely and return the final result |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| HTTP Method | GET |
| Development Language | Any development language capable of initiating an HTTP request |

#### Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| id | String | Yes | Task id |

#### Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| model | String | Model name |
| choices | List | Current dialogue model output content, currently only returns one |
| index | Integer | Result index |
| finish\_reason | String | Reason for model inference termination. “stop” for natural end or triggering stop words, “length” for reaching token length limit. |
| message | Object | Model returned text message |
| role | String | Role in the current dialogue, currently defaults to assistant (model) |
| content | String | Content of the current dialogue |
| task\_status | String | Processing status: PROCESSING (in process), SUCCESS (successful), FAIL (failed) |
| request\_id | String | Task number submitted by the user during client request or generated by the platform |
| id | String | Task order number generated by Zhipu AI Open Platform, use this order number when calling the request result interface |
| usage | Object | Token count statistics for this model invocation |
| prompt\_tokens | int | Number of tokens input by the user |
| completion\_tokens | int | Number of tokens output by the model |
| total\_tokens | int | Total number of tokens |

### Python Call Example

Request Example:

```
import time
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") 
response = client.chat.asyncCompletions.create(
    model="codegeex-4", 
    messages=[],
    extra={
        "target": {
            "path": "quick_sort.py",
            "language": "Python",
            "code_prefix": "def quick_sort(arr):\n    ",
            "code_suffix": ""
        },
        "contexts": []
    },
    top_p=0.7,
    temperature=0.9,
    stream=True,
    max_tokens=1024,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)
task_id = response.id
task_status = ''
get_cnt = 0
while task_status != 'SUCCESS' and task_status != 'FAILED' and get_cnt <= 40:
    result_response = client.chat.asyncCompletions.retrieve_completion_result(id=task_id)
    print(result_response)
    task_status = result_response.task_status

    time.sleep(2)
    get_cnt += 1
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

**Response Example:**

```
{"id":"850817101390499798807577524653187104","request_id":"8807577524653187103","model":null,"task_status":"PROCESSING"}
{"id":"850817101390499798807577524653187104","request_id":"8807577524653187103","model":null,"task_status":"PROCESSING"}
... ...
{"id":"850817101390499798807577524653187104","request_id":"8807577524653187103","model":null,"task_status":"PROCESSING"}
{
    "created": 1720008757,
    "id": "850817101390499798807577524653187104",
    "model": "codegeex-4",
    "request_id": "8807577524653187103",
    "task_status": "SUCCESS",
    "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "   if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)",
                "role": "assistant"
            }
        }
    ]
    "usage": {
        "completion_tokens": 80,
        "prompt_tokens": 28,
        "total_tokens": 108
    }
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

Table of contents

Chat（SSE Call）

Python Call Example

Code Q&A (Asynchronous API)

Python Call Example

Python Call Example

Code Completion(SSE Invocation)

Response parameters

Python Call Example

Code completion (Asynchronous call)

Python Call Example

Python Call Example