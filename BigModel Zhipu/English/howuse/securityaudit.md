[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fhowuse%2Fsecurityaudit)

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

# Content Safety

ZhipuAI is committed to ensuring the safety, controllability, auditability, oversight, traceability, and trustworthiness of artificial intelligence. To this end, we have built-in a security review mechanism aimed at reducing the occurrence of illegal and harmful information in model applications (including but not limited to violations of laws and regulations, endangering national security, malicious marketing, pornography, abuse, prohibited violent content, and other harmful content). When our built-in security review mechanism identifies illegal and harmful information, it will provide corresponding prompt information or take interception measures, such as input blocking, output restriction, and termination of content generation.

## Model Synchronous Response

When the API detects that the model input or output contains illegal and harmful information, the system will return an error code (1301), the input (role = user) or output (role = assistant), and the severity level (level 0-3, level 0 being the most severe, level 3 being minor), and will no longer synchronously generate results. It is recommended that developers take measures to positively guide users to ensure the compliance and appropriateness of the content. An example return is as follows:

```
"contentFilter":[{"level":1,"role":"user"}],"error":{"code":"1301","message":"The system has detected that the input or generated content may contain unsafe or sensitive content. Please avoid inputting prompts that are likely to produce sensitive content. Thank you for your cooperation."}
```

1

## Model Streaming Response

During the process of streaming content generation by the model, we will batch-check the generated content. When illegal and harmful information is detected, the API returns error code (1301), and the API (V4) returns the stop word “finish\_reason”:“sensitive”. Upon recognizing this information, developers should promptly take measures such as termination of generation, withdrawal, modification, clearing the screen, restarting, etc., to delete the generated content and ensure that content containing illegal and harmful information is not passed to the model for continued generation, to avoid negative impacts. An example return is as follows:

```
id='202408121950062bfd5bf951d24169', choices=[Choice(delta=ChoiceDelta(content='', role='user', tool_calls=None), finish_reason='sensitive', index=0)], created=1723463407, model='glm-4-0520', usage=None, extra_json=None, content_filter=[{'role': 'user', 'level': 1}]
```

1

## End-User Management

Sending the end-user ID in the request can assist the platform in intervening in the end-user’s violations, generating illegal and harmful information, or other abuse behaviors. When we detect that your end-user has violations, generates illegal and harmful information, or engages in other abuse behaviors, the platform will block the end-user’s requests to prevent your enterprise account from being affected by the end-user’s violations or abuse behaviors.

The ID is a unique string that identifies the end-user, with a length of at least 6 characters but not exceeding 128 characters. You can upload the end-user ID in the API request as follows:

```
{
    "model": "glm-3-turbo",
    "messages": [
     {"role": "user", "content": "As a marketing expert, please create an attractive slogan for the Zhipu Open Platform"},
     {"role": "assistant", "content": "Of course, to create an attractive slogan, please tell me some information about your product"},
     {"role": "user", "content": "ZhipuAI Open Platform"},
    ],
    "stream": "true",
    "user_id": "user_123456",
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

## Security Testing Application

If you need to conduct security-related tests, please contact your business manager or call (400-6883-991) to make a request, to avoid any violations or misuse of your corporate account.

## Feedback on Illegal and Harmful Content

ZhipuAI places great emphasis on the safety of generative artificial intelligence services. If you encounter any security issues with the API during development, please contact our corporate WeChat customer service or call (400-6883-991) to inform us. We greatly appreciate your contributions and support.

Table of contents

Model Synchronous Response

Model Streaming Response

End-User Management

Security Testing Application

Feedback on Illegal and Harmful Content