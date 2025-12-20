[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fhowuse%2Fglm4-toolkit)

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

# Code Sandbox

GLM-4-AllTools model provides a Code Interpreter tool that can accurately understand programming requirements described in natural language and automatically generate code snippets to solve practical problems. It also supports a secure code sandbox, Sandbox, which can simulate code execution results in a real environment.

## Enabling Code Sandbox

When using the model, if the Code Interpreter tool is selected, the sandbox environment will be invoked by default, corresponding to the parameter `sandbox = auto`.

#### Example Call

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Please fill in your own APIKey
response = client.chat.completions.create(
    model="glm-4-alltools",  # Fill in the name of the model to be called
    messages=[
        {
            "role": "user",
            "content":[
                {
                    "type":"text",
                    "text":"The national tourism travel data during the May Day holiday over the years is [100, 200, 300, 400, 500]. Create a bar chart to show the data trend."
                }
            ]
        }
    ],
    stream=True,
    tools=[
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

#### Response Example

After enabling the code sandbox, the model automatically generates and executes the code, further reasoning based on the output.

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

## Disabling Code Sandbox

If you only need the model to generate code without using the code sandbox to run it, set the parameter `sandbox = none`. After code generation, the status `status = requires_action` will be returned, requiring the user to submit the code execution result.

#### Example Call

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Please fill in your own APIKey
response = client.chat.completions.create(
    model="glm-4-alltools",  # Fill in the name of the model to be called
    messages=[
        {
            "role": "user",
            "content":[
                {
                    "type":"text",
                    "text":"The national tourism travel data during the May Day holiday over the years is [100, 200, 300, 400, 500]. Create a bar chart to show the data trend."
                }
            ]
        }
    ],
    stream=True,
    tools=[
      {
        "type": "code_interpreter",
        "code_interpreter":{
            "sandbox":"none"
        }
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

#### Response Example

After disabling the sandbox, the model generates code and returns `status = requires_action`.

```
ChatCompletionChunk(id='60955153-fcff-4c7b-b610-166cab49a92b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_Oiwh-QgVVajIUhafnJsFG', function=None, type='code_interpreter', code_interpreter={'input': '\n'})]), finish_reason=None, index=0)], created=1719802220, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='60955153-fcff-4c7b-b610-166cab49a92b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_Oiwh-QgVVajIUhafnJsFG', function=None, type='code_interpreter', code_interpreter={'input': 'plt'})]), finish_reason=None, index=0)], created=1719802220, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='60955153-fcff-4c7b-b610-166cab49a92b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_Oiwh-QgVVajIUhafnJsFG', function=None, type='code_interpreter', code_interpreter={'input': '.'})]), finish_reason=None, index=0)], created=1719802220, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='60955153-fcff-4c7b-b610-166cab49a92b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_Oiwh-QgVVajIUhafnJsFG', function=None, type='code_interpreter', code_interpreter={'input': 'show'})]), finish_reason=None, index=0)], created=1719802220, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='60955153-fcff-4c7b-b610-166cab49a92b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_Oiwh-QgVVajIUhafnJsFG', function=None, type='code_interpreter', code_interpreter={'input': '()'})]), finish_reason=None, index=0)], created=1719802220, model='glm-4-alltools', usage=None, extra_json=None)
ChatCompletionChunk(id='60955153-fcff-4c7b-b610-166cab49a92b', choices=[Choice(delta=ChoiceDelta(content=None, role='assistant', tool_calls=[ChoiceDeltaToolCall(index=None, id='call_Oiwh-QgVVajIUhafnJsFG', function=None, type='code_interpreter', code_interpreter={'input': ''})]), finish_reason='tool_calls', index=0)], created=1719802220, model='glm-4-alltools', usage=CompletionUsage(prompt_tokens=510, completion_tokens=226, total_tokens=736), extra_json=None, status='requires_action')
```

1  
2  
3  
4  
5  
6

## Submitting Sandbox Results

Next, the user needs to submit the execution results of the code sandbox, Tool Message, and the code generated by the model, Assistant Message. After submission, the model will continue to reason.

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Please fill in your own APIKey
response = client.chat.completions.create(
    model="glm-4-alltools",  # Fill in the name of the model to be called
    messages=[
        {
            "role": "user",
            "content":[
                {
                    "type":"text",
                    "text":"The national tourism travel data during the May Day holiday over the years is [100, 200, 300, 400, 500]. Create a bar chart to show the data trend."
                }
            ]
        },
        {
            "role": "assistant",
            "content":"""
                import matplotlib.pyplot as plt
                
                # Data received from the API
                years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"]
                tourist_data = [100, 100, 200, 200, 300, 400, 500]  # Assuming the data for 2023 and 2024 based on the trend
                
                # Creating a bar chart
                plt.figure(figsize=(10, 6))
                plt.bar(years, tourist_data, color='skyblue')
                plt.xlabel('Year')
                plt.ylabel('Tourist Count')
                plt.title('National Tourism Travel Data Trend During May Day Holiday from 2018 to 2024')
                plt.grid(axis='y')
                
                # Show the chart
                plt.show()
            """
        },
        {
            "role": "tool",
            "content":"http://all-tool-interpreter.cn-wlcb.ufileos.com/e01459c3-ddd6-4963-adf7-163513184f0c_fig.png"
        }
    ],
    stream=True,
    tools=[
      {
        "type": "code_interpreter",
        "code_interpreter":{
            "sandbox":"none"
        }
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

Table of contents

Enabling Code Sandbox

Disabling Code Sandbox

Submitting Sandbox Results