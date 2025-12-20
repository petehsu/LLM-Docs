[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Flibraries)

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

# Library

## Python SDK

After installation via PyPI, it can be accessed through the official SDK.

```
pip install zhipuai
```

1

**Usage example**

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") 
response = client.chat.completions.create(
    model="glm-4",
    messages=[
        {"role": "user", "content": "Hello"},
    ],
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

## Java SDK

Maven reference

```
        <dependency>
            <groupId>cn.bigmodel.openapi</groupId>
            <artifactId>oapi-java-sdk</artifactId>
            <version>release-V4-2.1.0</version>
        </dependency>
```

1  
2  
3  
4  
5

**Usage example**

```
import com.zhipu.oapi.ClientV4;

import java.util.ArrayList;
import java.util.List; 
import com.zhipu.oapi.Constants;
import com.zhipu.oapi.service.v4.model.ChatCompletionRequest;
import com.zhipu.oapi.service.v4.model.ChatMessage;
import com.zhipu.oapi.service.v4.model.ChatMessageRole;
import com.zhipu.oapi.service.v4.model.ModelApiResponse;

public class Test {

    private static final String API_KEY = "your api";
    private static final ClientV4 client = new ClientV4.Builder(API_KEY) 
            .build();

    // Please customize your own business ID.
    private static final String requestIdTemplate = "mycompany-%d";
    public static void main(String[] args) {

        List<ChatMessage> messages = new ArrayList<>();
        ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), "What's your name?");
        messages.add(chatMessage);
        String requestId = String.format(requestIdTemplate, System.currentTimeMillis());
        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                .model(Constants.ModelChatGLM4)
                .stream(Boolean.FALSE)
                .invokeMethod(Constants.invokeMethod)
                .messages(messages)
                .requestId(requestId)
                .build();
        ModelApiResponse invokeModelApiResp = client.invokeModelApi(chatCompletionRequest);

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
30  
31  
32  
33  
34  
35  
36  
37

## Node SDK

The coordinates for the Node.js package are as follows, and it is currently not compatible with web-runtime

```
npm install zhipuai-sdk-nodejs-v4
# or
yarn add zhipuai-sdk-nodejs-v4
```

1  
2  
3

**Usage example**

```
import { ZhipuAI } from 'zhipuai-sdk-nodejs-v4';

const dialogue = async () => {
    const ai = new ZhipuAI()
    const data = await ai.createCompletions({
        model: "glm-4",
        messages: [
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "I am an AI assistant"},
            {"role": "user", "content": "What's your name?"},
            {"role": "assistant", "content": "My name is chatGLM"},
            {"role": "user", "content": "What can you do?"}
        ],
        stream: false, 
    })
    console.log(data, "message")
}

dialogue()
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

## .Net SDK

Create your project.

```
mkdir dotnot-test & cd dotnet-test
git clone https://github.com/MetaGLM/zhipuai-sdk-csharp-v4.git
dotnet new console -o HelloWorldApp
```

1  
2  
3

Reference SDK

```
cd HelloWorldApp
dotnet add reference ../zhipuai-sdk-csharp-v4/ZhipuApi.csproj
dotnet add package System.Text.Json
```

1  
2  
3

**Usage example**

vim Program.cs

```
using System; 
using ZhipuApi;
using System.Text.Json;
using ZhipuApi.Models.RequestModels;

class Program
{
    static void Main(string[] args)
    { 
        var clientV4 = new ClientV4("API_KEY");
        var response = clientV4.chat.Completion(
        new TextRequestBase()
            .SetModel("glm-4")
            .SetMessages(new[] { new MessageItem("user", "What's your name?") })
            .SetTemperature(0.7)
            .SetTopP(0.7)
        );

        // Define the default serializer options
        JsonSerializerOptions DEFAULT_SERIALIZER_OPTION = new JsonSerializerOptions
            {
                WriteIndented = true
                // Add other options as necessary
            };
        Console.WriteLine(JsonSerializer.Serialize(response, DEFAULT_SERIALIZER_OPTION));
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

Run

```
dotnet build
dotnet run
```

1  
2

## Community SDK

The following library is built and maintained by the developer community.

Note: Please evaluate the compatibility and security of the following code on your own. ZhiPu does not guarantee this, and related risks must be borne by you.

### GO SDK

Go SDK installation address.：https://github.com/yankeguo/zhipu

Table of contents

Python SDK

Java SDK

Node SDK

.Net SDK

Community SDK

GO SDK