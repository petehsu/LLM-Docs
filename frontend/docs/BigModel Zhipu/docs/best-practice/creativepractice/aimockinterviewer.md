# AI 模拟面试官

Credit to：小林coding 点击访问原文：[一招搞定互联网大厂面试提问！](https://mp.weixin.qq.com/s/52VYduuZKyDFA1_QBtilFg)

## 场景介绍

求职者在准备面试时，希望了解目标公司常考的知识点，以便更有针对性地复习，提高面试成功率。现有的面经库缺乏针对性，难以快速找到目标公司的面试重点。大模型可以帮助求职者快速构建专属面试题库，让求职者高效且精准地准备互联网大厂面试。

## 业务需求

在开发项目时，首先需要考虑技术选型。基于在面试场景下的实用性和求职者的开发成本考虑，大模型 GLM-4-Plus 综合性能非常适合开发 AI 模拟面试官。

首先，GLM-4-Plus 模型在多个方面都有明显提升，包括对齐、智能体和数理逻辑等。常见构建智能体的操作（文生文、文生图、文生视频、微调、知识库等），在 BigModel 开放平台的接口文档中也写得相当清楚。除此以外，对于新注册的用户，GLM-4-Plus 会提供免费额度，适合求职者构建自己的题库并使用。

## 方案

## 创建针对公司的面试题库

### 初始化client

```
private static final String API_SECRET_KEY = "此处替换为你的 API key";
private static final ClientV4 client = new ClientV4.Builder(API_SECRET_KEY)
         .networkConfig(60, 60, 60, 60, TimeUnit.SECONDS)
         .build();
```

### 创建知识库

新建一个知识库，上传各个公司的面经（可以是本地文档或者是开源的数据库）。

![Description](https://cdn.bigmodel.cn/markdown/1753256745779%E5%88%9B%E5%BB%BA%E7%9F%A5%E8%AF%86%E5%BA%93.png?attname=%E5%88%9B%E5%BB%BA%E7%9F%A5%E8%AF%86%E5%BA%93.png)

我们可以根据文章格式，配置文档类型为文章知识、问答类知识或自定义知识。

![Description](https://cdn.bigmodel.cn/markdown/1753256817861%E5%88%9B%E5%BB%BA%E7%9F%A5%E8%AF%86%E5%BA%932.png?attname=%E5%88%9B%E5%BB%BA%E7%9F%A5%E8%AF%86%E5%BA%932.png)

### 训练面试题大模型

我们设计两个角色：AI 面试官和 AI 面试者。

* AI 面试官：根据我们指定的公司，从知识库找到问题提问。（此时可以根据问题试试能否回答出来）
* AI 面试者：根据知识库的解答，总结并润色成适合面试时的回答。（此时对比看看自己刚才回答得怎么样）

1. 我们先设计好他们各自的 Prompt：

```
private static final String AI_INTERVIEWER_SYSTEM_PROMPT =
            "从知识库中找属于{{用户给出的公司名称}}的后端开发面试题，用于向面试者提问，找不到就用自身知识提问并且告诉用户该信息不是来自文档。\n" +
                    "如果用户没有给出公司名称，请从知识库中随机找面试问题。\n" +
                    "要求：（1）只需要提出问题，绝对不要回答给出的问题。（2）至少给出5个问题 （3）不要直接照搬知识库内容，请将找到的内容润色成面试问题（4）按照{序号}.{面试题}的格式输出";
    private static final String AI_APPLICANT_SYSTEM_PROMPT =
            "你是一位求职者，你要结合知识库，清晰准确地回答面试官提出的问题。\n" +
                    "要求：（1）优先搜索知识库答案 （2）找到答案后，润色成口语化表达 （3）使用第一人称进行回答，回答不超过200字。";
```

2. 第二步，我们包装一个请求函数，传入上下文、配置知识库工具等：

```
public static String invoke(String systemMessage, String userMessage) {
        // 1. 这里的作用是收集上下文，让AI根据我们给出的上下文继续推导，也可以把入参直接改为List<ChatMessage> context
        List<ChatMessage> messages = Arrays.asList(
                new ChatMessage(ChatMessageRole.SYSTEM.value(), systemMessage),
                new ChatMessage(ChatMessageRole.USER.value(), userMessage)
        );

        // 2. 配置知识库工具
        List<ChatTool> tools = Collections.singletonList(createKnowledgeChatTool());

        // 3. 构建请求
        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                .model("glm-4-long") // 使用最新的大模型
                .stream(false) // 不使用流式输出
                .invokeMethod(Constants.invokeMethod)
                .messages(messages) // 已知上下文
                .tools(tools) // 其他工具：网络搜索、知识库、自定义函数等
                .build();

        try {
            // 4. 发起请求，如果想到达到GPT那种“打字”效果，可以转换为流式输出（SSE、Websocket）
            ModelApiResponse invokeModelApiResp = client.invokeModelApi(chatCompletionRequest);
            return (String) Optional.ofNullable(invokeModelApiResp)
                    .map(ModelApiResponse::getData)
                    .map(data -> data.getChoices().get(0).getMessage().getContent())
                    .orElse("");
        } catch (Exception e) {
            System.err.println("调用AI失败: " + e.getMessage());
            return "";
        }
    }

    private static ChatTool createKnowledgeChatTool() {
        ChatTool tool = new ChatTool();
        tool.setType(ChatToolType.RETRIEVAL.value()); // 规定工具类型为搜索知识库
        Retrieval retrieval = new Retrieval();
        retrieval.setKnowledge_id(KNOWLEDGE_ID); // 指定知识库ID
        tool.setRetrieval(retrieval);
        return tool;
    }
```

3. 搭建根据 Prompt 和用户输入得到回答的机器人：

* AI 面试官：输入为面试官 Prompt+公司名，让 AI 根据知识库调出对应公司的面试题。
* AI 面试者：输入为面试者 Prompt+刚才面试官提出的问题，让 AI 根据知识库的解答，回答问题。

测试函数的代码：

```


public static void main(String[] args) {
        String company = "字节"; //选择你需要面试的公司
        String aiInterviewerReply = invoke(AI_INTERVIEWER_SYSTEM_PROMPT, company);
        if (StringUtils.isEmpty(aiInterviewerReply)) {
            return;
        }

        // 切分字符串为问题数组
        List<String> questions = Arrays.asList(aiInterviewerReply.split("\n"));

        // 按需保存问题和答案
        Map<String, String> questionAnswerMap = new LinkedHashMap<>();
        questions.forEach(question -> {
            String userPrompt = String.format("---公司名---\n%s\n---面试问题---\n%s", company, question);
            String aiApplicantReply = invoke(AI_APPLICANT_SYSTEM_PROMPT, userPrompt);
            questionAnswerMap.put(question, aiApplicantReply);
        });

        // 打印结果
        printResults(company, questionAnswerMap);
    }

    private static void printResults(String company, Map<String, String> questionAnswerMap) {
        System.out.println("****** " + company + " ******");
        questionAnswerMap.forEach((question, answer) -> {
            System.out.println("============================");
            System.out.println(question);
            System.out.println(answer);
        });
    }
```

测试结果，求职者可以对照题目和回答进行练习：

![Description](https://cdn.bigmodel.cn/markdown/1753256186994output.png?attname=output.png)

## 方案亮点

* 高度模拟真实场景
* 即时反馈与针对性提升
* 无压力练习与高频次训练
* 跨场景与多语言支持


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt