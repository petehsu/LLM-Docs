[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fhowuse%2Fsafetytips)

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

# Safety and Risk Overview

The platform’s API supports a wide range of applications, such as question answering, writing, and dialogue. While using our API can create convenience for end users, it may also generate safety issues. This document aims to help customers understand the potential safety issues when using the API.

This document first introduces how to integrate the API as part of a product or service and make secure calls, then lists several specific issues to consider, provides general guidance on risks, and offers further guidance on robustness and fairness.

## Safety Challenges of Open Machine Learning Systems

We define the safety of the API as follows:

The condition of being free from harm to people, whether physical, psychological, or social, including but not limited to death, injury, illness, pain, misinformation, extreme behavior, property damage, or environmental destruction.

Our safety tips and guidance for the API are based on special considerations for systems with machine learning (ML) components that can interact with humans in high-bandwidth, open-ended ways (such as through natural language).

* **ML components have limited robustness.**  
  Only when given inputs similar to the training data can one expect the ML components to provide reasonable outputs. Even if an ML system is considered safe when operating under conditions similar to its training data, unexpected inputs from users can put the system into an unsafe state, and users often do not know which inputs will or will not lead to unsafe behavior. Open-ended ML systems interacting with individuals (e.g., in applications that answer questions) are also susceptible to adversarial inputs from malicious users who intentionally try to put the system into an unintended state. Therefore, as a mitigation measure, developers using this platform should manually evaluate the model outputs for each use case considered, which are produced from a range of representative inputs and some adversarial inputs.
* **ML components are biased.**  
  ML components reflect the values and biases present in the training data, as well as those of their developers. Systems using ML components (especially those interacting in open-ended ways) may perpetuate or amplify these values. When the values embedded in ML systems are harmful to individuals, groups, or significant institutions, safety issues arise. For ML components like the API trained on large amounts of valuable training data collected from public sources, the scale and complex social factors of the training data make it impossible to completely eliminate harmful values.
* **Open systems pose significant risk隐患.**  
  Systems with high-speed interactions with end users, such as natural language dialogues or answering questions, can almost be used for any purpose. This makes it impossible for us to exhaustively list and mitigate all potential safety risks in advance. Instead, we recommend an approach that focuses on broad categories and contexts of potential harm, continuously detects and responds to harm events, and continuously integrates new mitigation measures when demand is evident.
* **Safety is a factor that needs continuous consideration in the development of ML systems.**  
  The safety characteristics of ML systems change with each update to the ML components, such as retraining them with new data, or training new components from scratch with new architectures. Since ML is an active research area, and new performance levels are frequently updated as research progresses, ML system designers should anticipate frequent updates to ML components and plan to perform continuous safety analysis.

## Hazards to Consider in Risk Analysis

We will illustrate potential hazards (or hazard pathways) that may occur in systems involving the API. This list is not exhaustive, and not every category applies to different application scenarios, with varying degrees of openness and risk level of use cases. When determining potential hazards, developers should consider the system to be developed based on the usage scenario, including those who use the system and those affected by it, and identify sources of representative hazards.

* **Providing false information.**  
  The system may provide users with false information about safety or health issues, such as giving incorrect answers to users asking whether they are experiencing a medical emergency and should seek care. It is strictly prohibited to intentionally create and disseminate misleading information through the API.
* **Discrimination.**  
  The system may persuade users to believe harmful things about certain groups, such as using racist, sexist, or ableist language.
* **Individual harm.**  
  The system may create results that could harm individual humans, such as encouraging self-destructive behaviors (such as gambling, substance abuse, or self-harm) or damaging their self-esteem.
* **Inciting violence.**  
  The system may persuade users to take violent actions against any other individuals or groups.
* **Physical harm, property damage, or environmental destruction.**  
  In certain use cases, for example, if the system using the API is connected to physical actuators that can cause harm, the system is at the core of safety issues, and unexpected behavior in the API could lead to failures causing physical harm.

## Importance of Robustness

“Robustness” refers to a system’s ability to work reliably as intended and scheduled in a specific environment. Developers using this platform should ensure that their applications have the robustness required for safe use and should ensure that this robustness is maintained in the long term.

* **Robustness is a challenge.**  
  Language models included in the API are useful for a range of purposes, but may fail in unexpected ways due to limited world knowledge, etc. These failures may be visible, such as generating irrelevant or obviously incorrect text, or invisible results, such as failing to find relevant results when using API-driven searches. The risks associated with using the API vary greatly across different use cases, although some general categories of robustness failures to consider include: generating text unrelated to the context (providing more context can make this less likely to happen); generating inaccurate text due to gaps in the API’s current knowledge; continuing to provide offensive context, etc.
* **Context is very important.**  
  Developers should keep in mind that the output of the API largely depends on the context provided to the model. Providing additional context to the model (such as giving some high-quality examples of desired behavior before new inputs) can make the model’s output easier to guide in the desired direction.
* **Human supervision.**  
  Even with a lot of effort to improve robustness, some failures may still occur. Therefore, API customers should encourage end users to carefully review the API’s output results (e.g., disseminating these output results) before taking any actions.
* **Continuous testing.**  
  Although initial performance may be good, the API may not achieve the expected results, one way being if the input distribution changes over time. Additionally, the large model open platform may provide improved versions of the model over time, and developers should ensure that these versions continue to perform well in specific environments.

## Importance of Fairness

Here, “fairness” refers to ensuring that the API does not degrade performance due to user group statistics, nor generate text biased against certain groups. API users should take reasonable steps to identify and reduce foreseeable harm related to demographic biases in the API.

* **Fairness in ML systems is extremely challenging.**  
  Since the API is trained on human data, our models exhibit various biases, including but not limited to those related to gender, race, and religion. For example: The API is primarily trained on Chinese text and is best suited for classification, search, summarization, or generation of such text. By default, the API performs poorly on inputs that differ from the data distribution it was trained on, including non-Chinese languages and specific Chinese dialects that are underrepresented in our training data. The large model open platform provides information on some biases we have found, although this analysis is not comprehensive; developers should consider fairness issues that may be particularly prominent in their usage scenarios, even if these issues are not discussed in our basic analysis. Note that context is very important here: Providing context to the API that is insufficient to guide its generation, or providing context related to sensitive topics, is more likely to produce offensive outputs.
* **Identify characteristics of fairness risks before deployment.**  
  Users should consider their customer base and the range of inputs they will use the API for, and should evaluate the performance of the API on various potential inputs to determine situations where the API’s performance may decline.
* **Filtering tools can provide some help, but are not a panacea.**  
  The platform has enabled automatic filtering tools to flag potentially sensitive outputs and is working with customers to test and improve this tool. The purpose of the filtering tools is to help developers mitigate the risk of offensive outputs, but not all applications are suitable for them. Developers should consider whether their use case requires the use of this technology, and if so, how to modify these technologies to best suit their use case. It should be noted that these tools are not a panacea for eliminating all potential offensive outputs—offensive outputs may still be produced using other “safe” words.

Table of contents

Safety Challenges of Open Machine Learning Systems

Hazards to Consider in Risk Analysis

Importance of Robustness

Importance of Fairness