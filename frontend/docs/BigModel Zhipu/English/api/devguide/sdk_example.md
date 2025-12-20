[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Fdevguide%2Fsdk_example)

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

# SDK Code Examples

The platform provides three calling methods: synchronous, asynchronous, and SSE (Server-Sent Events). The method of calling depends on the specific model’s support.

## Synchronous Call

After calling, you can get the final result at once. Here are Python and Java code examples:

#### Python Code Example

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Fill in your own APIKey
response = client.chat.completions.create(
    model="glm-4-0520",  # Fill in the model code you need to call
    messages=[
        {"role": "user", "content": "As a marketing expert, please create an attractive slogan for my product"},
        {"role": "assistant", "content": "Of course, to create an attractive slogan, please tell me some information about your product"},
        {"role": "user", "content": "ZhipuAI Open Platform"},
        {"role": "assistant", "content": "Intelligence Unleashed, Infinite Drawn - ZhipuAI, making innovation within reach!"},
        {"role": "user", "content": "Create a more precise and attractive slogan"}
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
11  
12  
13

#### Java Code Example

```
/**
* Synchronous Call
*/
private static void testInvoke() {
   List<ChatMessage> messages = new ArrayList<>();
   ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), "As a marketing expert, please create an attractive slogan for the Zhipu Open Platform");
   messages.add(chatMessage);
   String requestId = String.format("YourRequestId-d%", System.currentTimeMillis());
   
   ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
           .model(Constants.ModelChatGLM4)
           .stream(Boolean.FALSE)
           .invokeMethod(Constants.invokeMethod)
           .messages(messages)
           .requestId(requestId)
           .build();
   ModelApiResponse invokeModelApiResp = client.invokeModelApi(chatCompletionRequest);
   try {
       System.out.println("model output:" + mapper.writeValueAsString(invokeModelApiResp));
   } catch (JsonProcessingException e) {
       e.printStackTrace();
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

## Asynchronous Call

After calling, you will immediately get a task ID, and then use the task ID to query the call result (usually it takes 10-30 seconds to get the final result depending on the model and parameters). Here are Python and Java code examples:

#### Python Code Example

```
from zhipuai import ZhipuAI
 
client = ZhipuAI(api_key="") # Please fill in your own APIKey
response = client.chat.asyncCompletions.create(
    model="glm-4-0520",  # Fill in the model code you need to call
    messages=[
        {
            "role": "user",
            "content": "Please write a short fairy tale as a master of fairy tales. The theme of the story is to always keep a kind heart, to stimulate children's learning interest and imagination, and also to help children better understand and accept the truths and values contained in the story."
        }
    ],
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

#### Java Code Example

```
/**
* Asynchronous Call
*/
private static String testAsyncInvoke() {
   List<ChatMessage> messages = new ArrayList<>();
   ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), "As a marketing expert, please create an attractive slogan for the Zhipu Open Platform");
   messages.add(chatMessage);
   String requestId = String.format("YourRequestId-d%", System.currentTimeMillis());
   
   ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
           .model(Constants.ModelChatGLM4)
           .stream(Boolean.FALSE)
           .invokeMethod(Constants.invokeMethodAsync)
           .messages(messages)
           .requestId(requestId)
           .build();
   ModelApiResponse invokeModelApiResp = client.invokeModelApi(chatCompletionRequest);
   System.out.println("model output:" + JSON.toJSONString(invokeModelApiResp));
   return invokeModelApiResp.getData().getTaskId();
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

## SSE Call

After calling, you can get the results in real-time until it ends. Here are Python and Java code examples:

#### Python Code Example

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # Please fill in your own APIKey
response = client.chat.completions.create(
    model="glm-4-0520",  # Fill in the model code you need to call
    messages=[
        {"role": "system", "content": "You are an assistant who loves to answer various questions, your task is to provide professional, accurate, and insightful advice to users."},
        {"role": "user", "content": "I am very interested in the planets of the solar system, especially Saturn. Please provide basic information about Saturn, including its size, composition, ring system, and any unique astronomical phenomena."},
    ],
    stream=True,
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

#### Java Code Example

```
/**
* SSE Call
*/
private static void testSseInvoke() {
   List<ChatMessage> messages = new ArrayList<>();
   ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), "As a marketing expert, please create an attractive slogan for the Zhipu Open Platform");
   messages.add(chatMessage);
   String requestId = String.format("YourRequestId-d%", System.currentTimeMillis());
 
   ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
           .model(Constants.ModelChatGLM4)
           .stream(Boolean.TRUE)
           .messages(messages)
           .requestId(requestId)
           .build();
   ModelApiResponse sseModelApiResp = client.invokeModelApi(chatCompletionRequest);
   if (sseModelApiResp.isSuccess()) {
       AtomicBoolean isFirst = new AtomicBoolean(true);
       ChatMessageAccumulator chatMessageAccumulator = mapStreamToAccumulator(sseModelApiResp.getFlowable())
               .doOnNext(accumulator -> {
                   {
                       if (isFirst.getAndSet(false)) {
                           System.out.print("Response: ");
                       }
                       if (accumulator.getDelta() != null && accumulator.getDelta().getTool_calls() != null) {
                           String jsonString = mapper.writeValueAsString(accumulator.getDelta().getTool_calls());
                           System.out.println("tool_calls: " + jsonString);
                       }
                       if (accumulator.getDelta() != null && accumulator.getDelta().getContent() != null) {
                           System.out.print(accumulator.getDelta().getContent());
                       }
                   }
               })
               .doOnComplete(System.out::println)
               .lastElement()
               .blockingGet();
 
       Choice choice = new Choice(chatMessageAccumulator.getChoice().getFinishReason(), 0L, chatMessageAccumulator.getDelta());
       List<Choice> choices = new ArrayList<>();
       choices.add(choice);
       ModelData data = new ModelData();
       data.setChoices(choices);
       data.setUsage(chatMessageAccumulator.getUsage());
       data.setId(chatMessageAccumulator.getId());
       data.setCreated(chatMessageAccumulator.getCreated());
       data.setRequestId(chatCompletionRequest.getRequestId());
       sseModelApiResp.setFlowable(null);
       sseModelApiResp.setData(data);
   }
   System.out.println("model output:" + JSON.toJSONString(sseModelApiResp));
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

Table of contents

Synchronous Call

Asynchronous Call

SSE Call