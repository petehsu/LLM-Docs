[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Fagent%2Fvidu_template_agent)

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

# Popular Special Effects Videos

Popular special effects videos are intelligent templates launched based on trending features from pan-entertainment platforms, designed to precisely adapt to short video creative production needs. Currently, three effect templates are available: `French Kiss`, `Body Shake Dance`, and `Sexy Me`. After selecting a template, users only need to upload an image and enter corresponding prompts to generate a special effects video.

---

# Interface Request

| Property | Value |
| --- | --- |
| Protocol | HTTPS |
| Endpoint | `https://open.bigmodel.cn/api/v1/agents` |
| Invocation | Asynchronous; results require querying |
| Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| HTTP Method | POST |

## Request Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `agent_id` | String | Yes | Fixed value: `vidu_template_agent` |
| `request_id` | String | No | User-defined unique ID; used to distinguish requests. Auto-generated if omitted. |
| `messages` | List<Object> | Yes | Session message body |
| `role` | String | Yes | User input role: `user` |
| `content` | List<Object> | Yes | Content list |
| `type` | String | Yes | Supported types: `"text"`, `"image_url"` |
| `text` | String | Yes | User text input |
| `image_url` | String | Yes | Image URL (when `type="image_url"`) |
| `custom_variables` | Object | No | Agent extension parameters |
| `template` | String | Yes | Effect template: `"french_kiss"`, `"bodyshake"`, or `"sexy_me"`. |

## Response Parameters

| Field | Type | Description |
| --- | --- | --- |
| `status` | String | Status: `pending` (task created), `failed` (task creation failed) |
| `async_id` | String | Asynchronous task ID |
| `agent_id` | String | Fixed value: `vidu_template_agent` |
| `error` | Object | Error details (if failed) |
| `code` | String | Error code |
| `message` | String | Error message |

## Example Usage

### Request Example

```
from zhipuai import ZhipuAI
# Initialize client
api_key = "Your API key"  # Replace with actual key
url = "https://open.bigmodel.cn/api/v1/agents"
client = ZhipuAI(api_key=api_key, base_url=url)

response = client.agents.invoke(
    {
        "agent_id": "vidu_template_agent",
        "custom_variables": {
            "template": "french_kiss"
        },
        "messages": [{
            "role": "user",
            "content": [{
                "type": "text",
                "text": "The two figures in the painting gradually approach, then kiss passionately, alternating between deep and firm intensity."
            }, {
                "type": "image_url",
                "image_url": "https://example.com/path/to/your/image.jpg"
            }]
        }]
    }
)
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

### Success Response Example

```
{
    "status": "pending",
    "agent_id": "vidu_template_agent",
    "async_id": "834645448353398784"
}
```

1  
2  
3  
4  
5

### Failure Response Example

```
{
    "status": "failed",
    "agent_id": "vidu_template_agent",
    "error": {
        "code": "500",
        "message": "create task failed"
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

---

# Result Query

| Type | Description |
| --- | --- |
| Transmission Method | https |
| Request Address | <https://open.bigmodel.cn/api/v1/agents/async-result> |
| Calling Method | Synchronous call, query task execution status |
| Character Encoding | UTF-8 |
| Interface Request Format | JSON |
| Response Format | JSON |
| Interface Request Type | POST |

## Request Parameters

| Field | Type | Description |
| --- | --- | --- |
| `agent_id` | String | Fixed value: `vidu_template_agent` |
| `async_id` | String | Task ID from async response |

## Response Parameters

| Field | Type | Description |
| --- | --- | --- |
| `status` | String | `pending` (processing), `success` (completed), `failed` (failed) |
| `agent_id` | String | Fixed value: `vidu_template_agent` |
| `choices` | List<Object> | Agent output |
| `messages` | List<Object> | Content details |
| `role` | String | Role: fixed as `assistant` |
| `content` | Object | Video file metadata |
| `type` | String | Fixed value: `video_url` |
| `video_url` | String | MP4 video URL |

## Example Usage

### Query Example

```
from zhipuai import ZhipuAI

# Initialize client
api_key = "Your API key"  # Replace with actual key
url = "https://open.bigmodel.cn/api/v1/agents"
client = ZhipuAI(api_key=api_key, base_url=url)

# Query result
response = client.agents.async_result(
    {
        "agent_id": "vidu_template_agent",
        "async_id": "834645448353398784"
    }
)
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

### Success Response Example

```
{
    "async_id": "834645448353398784",
    "status": "success",
    "agent_id": "vidu_template_agent",
    "choices": [
        {
            "messages": [
                {
                    "role": "assistant",
                    "content": {
                        "type": "video_url",
                        "video_url": "https://prod-ss-vidu.s3.cn-northwest-1.amazonaws.com.cn/infer/tasks/25/0623/08/834645448353398784/creation-01/video.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARRHG6JR7EMNHVUWT%2F20250623%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-Date=20250623T081805Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&response-cache-control=max-age%3D86400&response-content-disposition=attachment%3Bfilename%3Dimg2video20_720p_4s_french_kiss--4-2025-06-23T08%253A15%253A27Z.mp4&x-id=GetObject&X-Amz-Signature=5722794adbb789d1a55dc5c67a9792830432755c45c6c8937982c5308dc964c9"
                    }
                }
            ]
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

### Failure Response Example

```
{
    "status": "failed",
    "agent_id": "vidu_template_agent",
    "error": {
        "code": "500",
        "message": "create task failed"
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

Table of contents

Request Parameters

Response Parameters

Example Usage

Request Example

Success Response Example

Failure Response Example

Request Parameters

Response Parameters

Example Usage

Query Example

Success Response Example

Failure Response Example