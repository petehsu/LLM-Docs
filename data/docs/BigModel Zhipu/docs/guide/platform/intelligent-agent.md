# 智能体开发平台

## 更新记录

| 更新时间       | 更新内容         | 对应版本   |
| ---------- | ------------ | ------ |
| 2024.10.09 | V 1.2.5 系统升级 | V1.2.5 |
| 2024.10.15 | 插件中心升级及使用说明  | V1.2.5 |
| 2024.10.16 | 记忆-变量，初始变量介绍 | V1.2.5 |

## 1. 产品介绍

### 1.1 简介

智能体开发平台：零代码、开箱即用、多元化集成、\
真正落地级效果保证，极速助力企业智能化转型，让 AI 应用不再停留在想象。

新一代智能体开发平台，本平台集成了常用的节点和工具，用户可以在画布上进行拖拉拽的操作，构建自己的任务流，完成大模型的智能体搭建。配合批量调试能力，可以快速、低成本的预览智能体的效果。最终可通过页面嵌入、api 调用等形式来将搭建好的智能体融入用户的业务流程当中。

### 1.2 适用人群

* **非技术类**：一线业务/产品/运营，借助平台提供的模板、插件服务，只需要会提要求即可搭建属于自己的智能体，无需任何开发；
* **技术类**：借助代码节点、自建插件的形式，实现更加复杂的智能体，适配更多场景；

## 2. 快速开始

### 2.1 快速体验

![Description](https://cdn.bigmodel.cn/markdown/1753097322066screenshot-20250721-192821.png?attname=screenshot-20250721-192821.png)

#### 2.1.1 对话型-智能体

对话型一般用于角色扮演、智能客服、业务助理等场景，以对话形式与用户进行交互。

体验链接：[https://appcenter.bigmodel.cn/appcenter\_v2/chat?share\_code=mSBrkrJBKdyKPeeyLHLFi](https://appcenter.bigmodel.cn/appcenter_v2/chat?share_code=mSBrkrJBKdyKPeeyLHLFi)

#### 2.1.2 文本型-智能体

文本型一般用于文本写作、信息抽取、文案生成等场景，以单轮、多字段的输入形式进行交互。

体验链接：[https://appcenter.bigmodel.cn/console/appcenter\_v2/chat?share\_code=zOro1s77lj-W4zqop8vMS](https://appcenter.bigmodel.cn/console/appcenter_v2/chat?share_code=zOro1s77lj-W4zqop8vMS)

#### 2.1.3 知识问答型-智能体

知识问答型一般用于 FAQ 自动应答、产品咨询、文档问答、技术支持等场景，可集成结构化知识库或外部数据源，以对话形式与用户进行交互。

### 2.2 教学案例

#### 2.2.1 案例1: 智能客服问答

![Description](https://cdn.bigmodel.cn/markdown/1730972102606image.png?attname=image.png)

1. 点击"创建智能体"，选择"对话型"，输入智能体的名字、输入或一键生成智能体介绍、上传或生成智能体 logo，点击"创建"，进入画布编辑页面；
2. 点击页面下方"添加节点"按钮，添加两个"Agent 节点"，将"开始"节点与任意一个"Agent 节点"连接；
3. 点击"Agent 节点"的工具，添加对应的知识库；
4. 编写 Prompt；
5. 评测智能体效果；
6. 点击"发布管理"-->"新建版本"，输入版本号，点击"发布"；
7. 发布成功，弹出版本详情页面

#### 2.2.2 案例2: 市场报告助手

![Description](https://cdn.bigmodel.cn/markdown/1730972118818image.png?attname=image.png)

1. 点击"创建智能体"，选择"文本型"，输入智能体的名字、输入或一键生成智能体介绍、上传或生成智能体 logo，点击"创建"，进入画布编辑页面；
2. 点击"页面设置"，配置输入项，添加单一输入项，根据需求配置输入项的类型、字段名称和提示；
3. 点击页面下方"添加节点"按钮，添加所需要的"节点"，将"开始"节点与第一个"节点"连接；
4. 编写 Prompt；
5. 评测智能体；
6. 点击"发布管理"-->"新建版本"，输入版本号，点击"发布"；
7. 发布成功，弹出版本详情页面。

## 3. 智能体广场

### 3.1 简介

智能体广场是为客户精心准备的模版库，其中汇集了智谱精选出的智能体模版。这些智能体模版涉及场景广、通用性强、复用性高，您可以在智能体中心寻找与您场景类似的智能体，体验它的效果、查看它的画布与 Prompt、一键复制您满意的智能体到您的账户内，减少您大量的开发时间。

![Description](https://cdn.bigmodel.cn/markdown/1730972133900image.png?attname=image.png)

### 3.2 进入方式

* 您可以通过访问链接：[https://open.bigmodel.cn/console/appcenter\_v2/intelligent/center](https://open.bigmodel.cn/console/appcenter_v2/intelligent/center) 直接访问
* 您还可以通过访问智谱开放平台，点击"控制台"，在页面右侧菜单栏点击"智能体中心"-->"智能体广场"进行访问。

### 3.3 建议使用流程

1. 根据您的场景，在智能体中心中寻找与之类似的智能体，如智能客服、陪练、图生文等(此处以"教师助手"为例)；
2. 点击"查看详情"，进入智能体画布；

![Description](https://cdn.bigmodel.cn/markdown/1730972150370image.png?attname=image.png)

3. 查看画布节点与 Prompt，确认模版是否可以复用于自己的场景，并在右侧"预览调试"中体验模版效果；

![Description](https://cdn.bigmodel.cn/markdown/1730972161914image.png?attname=image.png)

4. "返回智能体中心"，点击"复制模版"，您将跳转入可编辑的画布界面，此时这个模版已经复制到了您的账号内，如果您此时前往"我的智能体"，将会看到它成为您排序在第一位的智能体。

![Description](https://cdn.bigmodel.cn/markdown/1730972175229image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730972187043image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730972195682image.png?attname=image.png)

### 3.4 注意事项

* 为确保用户隐私，您无法复制模版中的私有知识库和插件配置
* 当您体验模版时，您将消耗您自身账户的 token，若您欠费或没有对应模型的权限，系统将提示您欠费。

## 4. 功能和节点介绍

### 4.1 开场白&推荐文-自动配置

**功能介绍**：

通过 AIGC 为您自动配置对话页面的开场白与推荐问题

**效果如下**：

![Description](https://cdn.bigmodel.cn/markdown/1730972209119image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730972218127image.png?attname=image.png)

**配置方式**：

1. 点击创建智能体

![Description](https://cdn.bigmodel.cn/markdown/1730972300335image.png?attname=image.png)

2. 在"从空白创建"中，选择合适的智能体类型，鼠标悬浮后，点击按钮"创建智能体"

![Description](https://cdn.bigmodel.cn/markdown/1730972314041image.png?attname=image.png)

3. 在弹出框中，右上角"自动配置"处可以选择打开或关闭，默认状态为打开

![Description](https://cdn.bigmodel.cn/markdown/1730972323673image.png?attname=image.png)

### 4.2 基础变量

您创建的智能体通常会有 4 个初始变量，分别是`{{对话记录}}、{{用户-对话}}、{{LLM/Agent}}、{{当前时间}}`

![Description](https://cdn.bigmodel.cn/markdown/1732005216139image.png?attname=image.png)

* `{{对话记录}}`: 该变量引用了您与智能体之间发生的历史对话记录。
* `{{用户-对话}}`: 该变量引用了用户当前轮次的输入。
* `{{LLM}}/{{Agent}}`: 该变量引用了您所添加的 LLM 节点或 Agent 节点的输出。
* `{{当前时间}}`: 由系统自动获取的当前北京时间，用于告知大模型目前的时间。

### 4.3 开始节点

点击「开始」节点旁边按钮进入对话设置，如图所示：

![Description](https://cdn.bigmodel.cn/markdown/1730972345485image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730972353292image.png?attname=image.png)

* **起始节点为开始节点**：用户每次输入内容，都从流程画布的开始节点执行。
* **起始节点为上次对话节点**：用户每次输入内容，从上次对话中的节点（仅限 Agent 节点）继续与用户进行对话。
* **对话历史策略（携带上下文轮数）**：控制了变量对话记录、LLM 节点的"历史对话拼接"功能、Agent 节点"历史对话"的轮次。

### 4.4 Agent 节点

![Description](https://cdn.bigmodel.cn/markdown/1730972363360image.png?attname=image.png)

**功能介绍**：您可以使用 Agent 节点丰富自己的智能体功能：

* Agent 节点拥有自主规划能力，可以自行规划任务路径，使用工具或画布内的其他节点完成任务；在没有画布连线的情况下，Agent 节点也可以实现全局范围内的自动跳转。
* Agent 节点具备 function call 能力，支持调用插件。
* Agent 节点天然支持与用户进行多轮对话，具体对话轮次可在开始节点设置。

**Prompt 输入框**：编辑 Prompt 的区域，默认为 system prompt。全屏后的高级模式支持分别输入 System Prompt 和 User Prompt。点击 Prompt 输入框右下角进入全屏模式后，在左上角进入高级模式。

![Description](https://cdn.bigmodel.cn/markdown/1730972382280image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730972391496image.png?attname=image.png)

* **System Prompt**：在大模型中，System Prompt 通常是指由模型开发者或使用者设计的、用来指导模型行为的指令或上下文。这些提示可以是固定的格式，也可以是针对特定任务定制的。System Prompt 是为模型提供任务的目标，比如定义模型应该采取的整体人设、风格、任务说明或遵循的规则。
* **User Prompt**：User Prompt 是指用户输入的文本，它是用户请求模型生成响应的直接输入。User Prompt 表达了用户的直接需求或问题，模型会根据这些提示来生成回答或执行任务。

**Prompt 优化**：当您初步编写您的 Prompt 后，您可以点击高级右侧的星型符号，使用 Prompt 优化功能对您的 Prompt 进行优化，以节省 Prompt 编写的时间，达到更优效果。

![Description](https://cdn.bigmodel.cn/markdown/1730972401904image.png?attname=image.png)

**模型设置**：

模型设置页面支持更换单一组节点的大模型，您可以通过配置不同参数的大模型，调试您业务场景中成本和效果的最优解。

模型设置页面支持调整 temperature、top\_p、max\_token 三个参数。

* **Temperature**：Temperature 参数主要控制模型生成文本的随机性。当 Temperature 值较高时，模型倾向于生成更加多样化和创新的文本，但这也可能引入语法错误或不相关的内容。相反，当 Temperature 值较低时，模型生成的文本会更加保守和稳定，但可能缺乏多样性和创造性。
* **Top\_P**：Top-p（核采样）参数与 Temperature 参数不同，它通过限制生成文本的候选词汇范围来影响多样性。Top-p 参数表示在生成每个词时，仅考虑概率最高的 p% 的候选词汇。因此，当 p 值较高时，模型生成的文本会更加多样化和创新，但也可能包含一些不相关的词汇。而当 p 值较低时，生成的文本会更加集中和连贯，但可能缺乏新颖性。
* **Max\_token**：控制模型最大输出 token，范围是 1-8192。

![Description](https://cdn.bigmodel.cn/markdown/1730972570523image.png?attname=image.png)

支持 glm-4-alltools 模型，现在 glm-4-alltools 模型使用可本地生成并运行代码(code interpreter)

![Description](https://cdn.bigmodel.cn/markdown/1730972585629image.png?attname=image.png)

**工具**：Agent 节点独特的功能，帮助您的智能体创造更丰富的功能。

* **插件**：通过 function 调用的方式，使得 Agent 节点可以完成与其他系统的交互，支持调用外部接口。

![Description](https://cdn.bigmodel.cn/markdown/1730972624887image.png?attname=image.png)

使用插件：您可以通过点击"工具-添加插件"添加智能体中心内置的插件。
创建插件：您可以通过"工具-添加插件-自建插件"配置您自己的插件。

![Description](https://cdn.bigmodel.cn/markdown/1730972615049image.png?attname=image.png)

1. 配置您的鉴权（如有）；
2. 按照所给示例，配置 schema（需要输入对应 api 符合 openapi3.0 规范的 schema），同步支持 yama 和 json 格式；
3. 核实右侧解析结果是否正确；
4. 保存插件。

![Description](https://cdn.bigmodel.cn/markdown/1730972671675image.png?attname=image.png)

**插件-变量/Memory**

![Description](https://cdn.bigmodel.cn/markdown/1730972680685image.png?attname=image.png)

**功能介绍**：辅助大模型实现长期记忆的工具。该工具的功能是以 Key-value 的格式记录数据，并将其转为变量，可用于全局引用。以此形式，被记录的数据以变量的形式被固定的保存下来，直到被覆盖。记忆工具采用"写入-覆盖"逻辑，目前支持最大 30 个变量。

当使用 Agent 节点添加此功能时，该功能是以函数调用（function call）的形式被调用。"动作名称"是函数（function）的名字字段（name）；"触发条件"是函数的描述字段（description）；"字段配置-变量名称"是对函数入参（parameter）的名字，"字段配置-变量描述"是对函数入参的描述。**因此，以上字段需要用户认真填写，尝试优化，以达到最优效果。**

![Description](https://cdn.bigmodel.cn/markdown/1730972697905image.png?attname=image.png)

**使用方式**：

Agent 节点使用方式：同其他插件工具，由 Agent 自行调用。调试优化步骤，除 Prompt 外，可关注插件函数自身的字段描述（详情参见"工具-变量/Memory-功能介绍"）。

**使用窍门**：

若需要实现读取变量：

需要在 Prompt 中拼入该变量。

```plaintext  theme={null}
已有变量：
城市：北京

需求：
大模型读取现在已有城市

示例指令：
当前已有城市：{城市}}
```

若需要实现变量内储存多个值

* 首先在指令内引入该变量，使得大模型看到目前变量内已有值；
* 然后调整指令使得大模型写入时，除了新添加的值，还会包括已有值。

```plaintext  theme={null}
已有变量：
城市：北京

需求：
增加上海

示例指令：
除了当前已有的城市，我还想去上海
当前已有城市：{城市}}，多个值之间采用逗号隔开

结果：
城市：北京，上海
```

**知识库**：Agent 节点可以使用 function 调用的方式接入您在开发平台的知识库，且具备自行识别用户意图的能力，agent 能够自主的"改写用户输入"，使用更符合用户意图的问题在知识库中寻找对应的答案。

1. 由于 Agent 节点是通过 function call 的方式调用知识库，因此知识库的名字和描述会作为 function 的名字(name)和描述（description）输入给模型，影响大模型调用函数的最终效果，**请您慎重配置名字和描述；**
2. 您可以通过点击"工具-添加知识库"添加您在开放平台的知识库；
3. 添加知识库后，您会发现添加按钮旁出现了一个设置按钮，点击后您可对知识库功能进行高级设置，在手动设置中，您可以对知识库的召回策略进行调整。
   a. 目前支持向量化召回、关键词召回和混合召回三种方式；
   b. 支持 Rerank 模型通过对结果重新排序，提高检索结果的相关性和准确性；
   c. 支持召回切片的手动设置；
   d. 支持手动设置知识的搜索词。

![Description](https://cdn.bigmodel.cn/markdown/1730972719805image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730972731510image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730972738607image.png?attname=image.png)

**辅助能力-联网搜索**：Agent 节点支持联网搜索能力，且支持配置搜索词，本功能并非通过 function 调用的方式实现。

1. 联网设置：在开启联网搜索的情况下，您可以通过点击"联网搜索开关"右侧的设置按钮，打开联网设置框，进行搜索词的配置。
2. 当搜索词不为空时，Agent 节点会在每轮对话中强制进行搜索。

![Description](https://cdn.bigmodel.cn/markdown/1730972748194image.png?attname=image.png)

**跳入条件**：agent 节点具备自动识别用户的意图进行节点跳转的能力，您可以在"跳入条件"填入该 agent 适用的场景或任务。

1. 您可以详细描述该 agent 负责回答的问题类型，或执行的任务，或仅仅是您希望它应用到的场景。
2. 跳入条件的影响范围是全局，意味着 agent 可以在整个画布中自由跳转。

**跳出条件**：控制 agent 节点在符合条件时，跳转至下一个节点，目前有以下两种判断条件：

1. 模型自主判断：模型基于对话的意图，主观判断当前节点是否可以跳入下一个节点。
2. 规则判断：基于对话轮数、时间等客观条件来判断是否跳入下一个节点。一般用户培训、对话练习等场景。

### 4.5 LLM 节点

![Description](https://cdn.bigmodel.cn/markdown/1730972760476image.png?attname=image.png)

**功能介绍**：LLM 节点用于执行特定的用户任务，执行次序完全按照画布连线来进行执行。智能体中心支持并行多个 LLM 节点。

**Prompt 输入框**：编辑 Prompt 的区域，默认为 user prompt。全屏后的高级模式支持分别输入 System Prompt 和 User Prompt。点击 Prompt 输入框右下角进入全屏模式后，在左上角进入高级模式。（进入方式与 Agent 节点一致，详情参见 Agent 节点）。

**Prompt 优化**：当您初步编写您的 Prompt 后，您可以点击高级右侧的星型符号，使用 Prompt 优化功能对您的 Prompt 进行优化，以节省 Prompt 编写的时间，达到更优效果。

**模型设置**：

模型设置页面支持更换单一组节点的大模型，您可以通过配置不同参数的大模型，调试您业务场景中成本和效果的最优解。

模型设置页面支持调整 temperature、top\_p、max\_token 三个参数：

* **Temperature**：Temperature 参数主要控制模型生成文本的随机性。当 Temperature 值较高时，模型倾向于生成更加多样化和创新的文本。相反，当 Temperature 值较低时，模型生成的文本会更加保守和稳定。
* **Top\_P**：Top-p（核采样）参数与 Temperature 参数不同，它通过限制生成文本的候选词汇范围来影响多样性。Top-p 参数表示在生成每个词时，仅考虑概率最高的 p% 的候选词汇。因此，当 p 值较高时，模型生成的文本会更加多样化和创新，但也可能包含一些不相关的词汇。而当 p 值较低时，生成的文本会更加集中和连贯，但可能缺乏新颖性。
* **Max\_token**：控制模型最大输出token，范围是1-8192。

支持"历史对话拼接"功能，开启后LLM节点将拼接历史对话内容，具体对话轮次可在开始节点设置。

![Description](https://cdn.bigmodel.cn/markdown/1730972785065image.png?attname=image.png)

支持glm-4-alltools模型，现在glm-4-alltools模型使用可本地生成并运行代码(code interpreter)

![Description](https://cdn.bigmodel.cn/markdown/1730972826927image.png?attname=image.png)

**工具**：LLM节点可以使用知识库和联网搜索两种通用能力，与Agent节点不同的是，LLM节点的知识库并非通过function调用的方式实现。（PS：目前文本型智能体的LLM节点不支持知识库）。

* **知识库**：LLM节点支持接入您在开发平台的知识库，当您配置了知识库工具时，LLM节点执行时，一定会调用知识库工具。
  * 您可以通过点击"工具-添加知识库"添加您在开放平台的知识库。
  * 添加知识库后，您会发现添加按钮旁出现了一个设置按钮，点击后您可对知识库功能进行高级设置，在手动设置中，您可以对知识库的召回策略进行调整。目前支持索引召回、原文召回和混合召回两种方式。
* **辅助能力-联网搜索**：LLM节点支持联网搜索能力，且支持配置搜索词，本功能并非通过function调用的方式实现。

1. 联网设置：在开启联网搜索的情况下，您可以通过点击"联网搜索开关"右侧的设置按钮，打开联网设置框，进行搜索词的配置。
2. 当搜索词不为空时，LLM节点会在每轮对话中强制进行搜索。

**跳入条件**：Agent可以根据意图跳入对应的LLM节点。

#### 4.5.1 【重要】多模态模型

**功能介绍**：目前LLM节点支持接入多模态大模型GLM-4V(图生文)、GLM-4V-Plus(图或视频生文)、CogVideoX(图生视频)支持输入图片(或视频)与提示词，进行文本或视频的生成。

![Description](https://cdn.bigmodel.cn/markdown/1730972846231image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730972856773image.png?attname=image.png)

**使用方式**：

* **对话型智能体**：

1. 在模型列表选择GLM-4V、GLM-4V-Plus、CogVideoX，界面将自动转为兼容多模态的界面，在节点处可看到图片变量的位置、预览调试的输入框中可看到上传图片的icon；

![Description](https://cdn.bigmodel.cn/markdown/1730972871120image.png?attname=image.png)

2. 点击"选择图片变量"的输入框，勾选用户-图片(或用户-视频)；

![Description](https://cdn.bigmodel.cn/markdown/1730972882750image.png?attname=image.png)

3. 上传图片(或视频)，并输入问题或提示词，即可运行。

**文本型智能体**：

1. 在模型列表选择GLM-4V、GLM-4V-Plus、CogVideoX，界面将自动转为兼容多模态的界面；
2. 点击输入项配置，类型中，选择图片上传(视频上传)；

![Description](https://cdn.bigmodel.cn/markdown/1730972898752image.png?attname=image.png)

3. 输入定义好的字段名称，点击完成，随后可以在LLM节点的"输入图片"下拉框中选择对应的字段，一次性输入多个图片(或视频)可通过配置多个输入项实现。

![Description](https://cdn.bigmodel.cn/markdown/1730972908944image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730972917186image.png?attname=image.png)

### 4.6 分支判断节点

"**或"条件判断功能**：

分支判断节点可以根据前序节点输出的内容、变量值判断分支走向。您可以通过右上角的"+"增加判断的分支。目前支持六种分支判断逻辑："等于"、"不等于"、"字数大于"、"字数小于"、"为空"、"不为空"、"包含"、"不包含"、"大于"、"小于"，条件内容可以选择引用变量或固定值。

"**且"条件判断功能**：

当用户需要通过多个条件判断一个分支走向(即有"且"条件需求的场景)，可以点击条件内的"+新增"，即可在同一个条件下新增判断条件。

![Description](https://cdn.bigmodel.cn/markdown/1730972928978image.png?attname=image.png)

当画布中有多个分支需要走向同一个"分支判断节点"，可以通过连接多个前序节点至"分支判断节点"即可。

![Description](https://cdn.bigmodel.cn/markdown/1730972937842image.png?attname=image.png)

"**否则"功能**：分支判断节点的"否则"功能可以帮助您处理场景中遇到的非常规情况，例如前序节点的输出不稳定。

![Description](https://cdn.bigmodel.cn/markdown/1730972948777image.png?attname=image.png)

**并行执行功能**：分支判断节点支持同时执行多个分支，在此功能下，若判断结果同时满足多个分支条件，则允许同时执行多个后续分支

![Description](https://cdn.bigmodel.cn/markdown/1730972958586image.png?attname=image.png)

### 4.7 数据提取节点

**功能介绍**：数据提取节点支持将您的前序节点输出转化为变量，以供您在之后的节点中引用。暂不支持作为流程的最后一个节点。

* 目前仅支持转化json或key:value结构的输出内容。

  **Key-value**：

```plaintext  theme={null}
字段名:字段值
例如：城市:北京
```

支持一次提取多个字段，当您在输入框内填写内容后，该节点将自动增加输入框。

![Description](https://cdn.bigmodel.cn/markdown/1730972970157image.png?attname=image.png)

### 4.8 数据合并节点

**功能介绍**：数据合并节点支持您对前序节点输出的数据进行合并，在数据合并的输入框中，您可以自由编辑文本、引用变量，并按照您的预期结构进行编排。常用于长文档生成场景，您可以采取分步生成文章的不同部分，最后使用本节点将输出按照您预期的结构合并。

![Description](https://cdn.bigmodel.cn/markdown/1730972981627image.png?attname=image.png)

### 4.9 代码节点

**功能介绍**：支持在该节点内输入代码，使得用户可以更灵活的实现需求，例如结构化的数据处理、数学运算、数据拼接等场景。目前支持Python和JavaScript语言。代码节点的内容在本地沙箱环境运行，无法与外部系统交互，如需要链接外部系统，请使用"自建插件"功能。

![Description](https://cdn.bigmodel.cn/markdown/1730972990824image.png?attname=image.png)

**输入框**：点击右上角的加号，添加参数，参数可以输入固定值、可以引用大模型生成的变量。

**调试方法**：点击IDE编辑，输入写好的代码，点击右上角测试代码，点击运行。运行成功后点击同步输出结果即可正常运行。注意，这里的输入参数需要返回画布，在组件的输入中点击"+"号生成

![Description](https://cdn.bigmodel.cn/markdown/1730973038037image.png?attname=image.png)

### 4.10 工具节点

![Description](https://cdn.bigmodel.cn/markdown/1730973047643image.png?attname=image.png)

**功能介绍**：通过工程稳定调用三方接口的节点。现在通过组合工具节点，LLM节点也可以调用工具。目前仅支持平台提供的三方工具。工具节点无法单独作为智能体的最后一个节点，需要在工具后添加LLM节点接收工具返回的数据，并按照用户的预期进行输出。

**使用方法**：

选择添加工具节点；

![Description](https://cdn.bigmodel.cn/markdown/1730973062188image.png?attname=image.png)

选择需要的工具，添加对应的动作并保存，详见Agent节点-工具-插件；

![Description](https://cdn.bigmodel.cn/markdown/1730973071528image.png?attname=image.png)

添加后，可以看到具体的工具节点，展开"输入"可以看到工具的必要入参，**可以选择填入固定值或引用画布中的变量；**

![Description](https://cdn.bigmodel.cn/markdown/1730973079111image.png?attname=image.png)

点击右上角运行icon，可唤出工具调试界面，此处可对工具进行单节点调试；

![Description](https://cdn.bigmodel.cn/markdown/1730973087508image.png?attname=image.png)

展开"输出"，可看到该工具节点的输出范式，不同工具的输出范式不同。

![Description](https://cdn.bigmodel.cn/markdown/1730973095665image.png?attname=image.png)

**插件-变量/Memory**

![Description](https://cdn.bigmodel.cn/markdown/1730973110290image.png?attname=image.png)

**功能介绍**：辅助大模型实现长期记忆的工具。详情参见"Agent节点-工具-插件-插件-变量/Memory"。

**使用方式**：当使用工具节点添加此功能时，该功能是以工程的形式被调用。"输入-Body"是预先设置好的变量名称，可以选择固定值或引用智能体中的变量。"输出"是该工具的输出范式。通过点击"输入"右方区域的"变量管理"，可唤出变量界面，对变量进行增加、减少、描述等管理。

由于"工具-变量"节点要求输入是结构化的数据结构，因此需要对前序LLM节点输出格式做出要求。

若前序LLM节点有多个字段需要分别储存入多个变量内，需要"数据提取"先将LLM节点中的多个字段提取出，然后在"工具-变量"中的"输入-Body"中依次引用。

由于"工具-变量"节点本质依然是工具，因此若**作为智能体的最后一个节点，将输出工具的执行结果(一段Json格式的数据)，需要在工具后添加LLM节点接收工具返回的数据，并按照用户的预期进行输出。**

![Description](https://cdn.bigmodel.cn/markdown/1730973123939image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730973138291image.png?attname=image.png)

**注意：若前序LLM节点有多个字段，且需要分别储存入多个变量内。需要"数据提取"先将LLM节点中的多个字段提取出，然后在"工具-变量"中的"输入-Body"中依次引用，如下图：**

![Description](https://cdn.bigmodel.cn/markdown/1730973149311image.png?attname=image.png)

## 5. 测试与批量调试

### 5.1 单节点测试

#### 5.1.1 单节点单次评测

**适用场景**：为了方便您调试Prompt，优化智能体的效果，LLM节点和Agent节点支持单个节点的Prompt评测。

**评测入口**：在LLM节点和Agent节点的Prompt输入框中，点击右下角，进入全屏模式，您可以在左侧栏调整您的Prompt，右侧栏中测试并预览单节点的效果。

![Description](https://cdn.bigmodel.cn/markdown/1730973165931image.png?attname=image.png)

#### 5.1.2 单节点批量调试

**适用场景**：批量调试可以基于您准备的数据集，自动的执行智能体/节点，快速获取测试结果，提高评估效率。若您在搭建智能体中，需要评测单一节点Prompt的稳定性或整体效果是否达到上线标准，您可以使用单节点的批量调试功能，目前LLM节点和Agent节点均支持一键批量评测。

**评测入口**：在LLM节点和Agent节点的Prompt输入框中，点击右下角，进入全屏模式。点击右上角"批量调试"。(详见"测试与批量调试------全节点批量调试")

![Description](https://cdn.bigmodel.cn/markdown/1730973176007image.png?attname=image.png)

### 5.2 全节点测试

#### 5.2.1 全节点单次测试

**快速评测**：当您完成了整个智能体的搭建后，您可以在右侧对话栏内对智能体进行评测，核实智能体输出的效果。

**详细评测**：您可以通过点击"预览调试"右上角中间的图标，唤起日志页面，查看每个节点的输入和输出，对整个智能体的输出进行更详细的评测和问题定位。

![Description](https://cdn.bigmodel.cn/markdown/1730973188326image.png?attname=image.png)

#### 5.2.2 全节点批量调试

**适用场景**：当您希望通过评估智能体的整体效果时，您可以使用批量调试功能。批量调试可以基于您准备的数据集，自动的执行智能体/节点，快速获取测试结果，提高您的评估效率，方便您定位优化方向。

**进入方式**：您可以通过右上角全屏按钮，进入全屏模式，点击右上角的批量调试。进入批量调试的界面。

![Description](https://cdn.bigmodel.cn/markdown/1730973197972image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1730973205182image.png?attname=image.png)

**调试方法**：点击新建调试，随后上传或选择您的数据集\*\*（目前仅支持Excel格式）\*\*，随后选择您评测问题所在的列作为"用户"字段，点击"执行评测"，您的任务就会自动开始评测。

![Description](https://cdn.bigmodel.cn/markdown/1730973214102image.png?attname=image.png)

额外事项：

当您同时有多个输入时，您需要将正确的字段名称都配置在对应输入的表头。

知识库批量调试：按通用方式执行评测后，点击下载，涉及知识库的智能体将额外得到一个sheet展示召回的切片内容。如果智能体中有多个节点配置知识库，则展示每一个节点的召回切片内容。

多模态大模型的批量调试时，可将对应的图片放入Excel中的一列，将其与图片-用户字段（或其他智能体中"对应输入的图片"的变量）正确匹配，其他操作与文本大模型的批量调试相同。

## 6. 保存和发布管理

### 6.1 版本保存

**自动保存**：每当您编辑画布后，智能体会在鼠标失焦后自动为您保存最新的编辑内容。

**保存版本（手动保存）**：您可以通过点击右上角中间的图标，或使用快捷键ctrl+s（Mac系统使用cmd+s）对智能体进行保存；

![Description](https://cdn.bigmodel.cn/markdown/1730973230050image.png?attname=image.png)

点击之后，您会看到一个保存版本的弹出框，在弹出框内可以输入版本名称和版本说明，点击"保存"即可保存该智能体，您可以在版本号下方小字中看到最新历史版本的名称，方便您进行版本管理；

![Description](https://cdn.bigmodel.cn/markdown/1730973237538image.png?attname=image.png)

点击确定后，您将回到画布，并看到画布正上方出现"保存成功"的提示。

![Description](https://cdn.bigmodel.cn/markdown/1730973246863image.png?attname=image.png)

### 6.2 发布管理

您可以点击右上角最右侧"发布管理"按钮，对编辑好的智能体进行发布；

![Description](https://cdn.bigmodel.cn/markdown/1730973258182image.png?attname=image.png)

点击"发布管理"，您将看到一个版本记录的界面，其中记录了您所有的历史版本的相关信息，您可以选择任意版本进行"发布"或"回溯"动作，也可以选择下线目前已经发布的版本。

![Description](https://cdn.bigmodel.cn/markdown/1730973279773image.png?attname=image.png)

点击右上角"新建版本"，输入版本名称后，点击"发布"即可发布智能体；

![Description](https://cdn.bigmodel.cn/markdown/1730973289880image.png?attname=image.png)

发布成功后您将看到页面顶部显示"发布成功"，且自动跳出"版本详情"页面，该页面详细说明了您当前智能体的版本信息、访问链接、集成信息和集成文档链接，供您后期集成或分享使用；

![Description](https://cdn.bigmodel.cn/markdown/1730973301965image.png?attname=image.png)

您可以通过智能体下方的状态，查看智能体的发布状态；

当状态显示"未发布"，代表您有编辑后未发布的内容，体验效果可能与您预览测试的效果不同。

当状态显示"已发布"时，代表您所有编辑的内容均已发布，体验效果与您预览测试的效果相同。

![Description](https://cdn.bigmodel.cn/markdown/1730973315271image.png?attname=image.png)

您也可以在画布页面检查是否有编辑内容未发布，您可以在画布左上角，智能体名称右侧的一栏小字中找到提示。

![Description](https://cdn.bigmodel.cn/markdown/1730973328233image.png?attname=image.png)

## 7. 插件中心

### 7.1 功能简介

插件是智能体落地的重要组成部分，他们充当了大模型的手、脚，延伸了大模型的能力。丰富的插件是智能体落地的必要条件。为此推出了插件中心。

### 7.2 插件广场

插件广场展示了由智谱官方精心挑选的公开插件工具和其他用户上架的私有插件，这些插件涉及各类功能，如网页搜索、工具效率等，使用插件，供您在搭建智能体时使用。

![Description](https://cdn.bigmodel.cn/markdown/1730973348488image.png?attname=image.png)

### 7.3 我的插件

"我的插件"中，展示了您自建的私有插件。同时您也可以在"我的插件"中进行自建插件供您的智能体使用，同时您可以选择将您自建的插件上架至插件广场，公开给所有用户使用

![Description](https://cdn.bigmodel.cn/markdown/1730973357625image.png?attname=image.png)

自建插件步骤：类似智能体内创建自建插件

![Description](https://cdn.bigmodel.cn/markdown/1730973368442image.png?attname=image.png)

第一步点击自建插件，看到如上界面弹出

第二步：输入您的插件名称、选择类别、描述、图标、配置您的鉴权（如有）；

第三步：按照所给规范和示例，配置schema（需要输入对应api符合openapi3.0规范的schema），同步支持yama和json格式；

第四步：等待schema加载完毕后，在下方"方法调试"点击"调试"；在右侧新拉出的页面进行试运行；

![Description](https://cdn.bigmodel.cn/markdown/1730973378170image.png?attname=image.png)

第五步：运行成功后点击保存，您的插件就自建完成了。

## 8. 案例库

### 8.1 Prompt 编写提示

提⽰词的编写是配置应⽤的重要⼀步，提⽰词编写得越清晰明确，应⽤的回复也会越符合预期。您可以根据应⽤的实际表现迭代提⽰词，以优化大模型的表现。

为了让应⽤达到更好的体验，建议在编写提⽰中包含和注意如下内容：

1. 设定⼈物：描述应⽤所扮演的⻆⾊或职责、回复⻛格等。
2. 描述功能和⼯作流程：描述应⽤的功能和⼯作流程，约定应⽤在不同的场景下如何回答⽤⼾的问题。通过⾃然语⾔强调在何种场景下，调⽤哪个⼯具来提升对应⽤的约束⼒，选择更符合预期的⼯具以保证回复的准确性。
3. 指⽰应⽤在指定范围内回答，如果您想限制回复范围，请直接告诉应⽤什么应该回答，什么不应该回答。例如：拒绝回答与健康⽣活⽆关的话题，如果并没有搜索到相关⻝材的营养成分，请告诉⽤⼾没有查到，⽽不应该编造内容。
4. 对于功能相对复杂的应⽤，推荐使⽤结构化格式来编写提⽰，结构化提⽰使⽤ Markdown 语法，可读性更强，对应⽤的约束更强。您可以使⽤提⽰词优化功能，该功能可以将提⽰⾃动优化为结构化的内容，你可以直接使⽤优化的内容，或者基于优化内容进⾏修改。

#### 8.1.1 信息抽取：从冗杂的自然语言或数据中提取想要的信息

```python  theme={null}
你是文字提取器，你需要帮用户结构化提取信息。
用户会输入口语化的内容，你需从用户输入的内容中结构化的提取信息，按照模版生成内容。
输出完毕后结束，不要生成新的用户输入，不要新增内容
模版如下：
\"\"\"
{
\"xx\":\"\"
}
\"\"\"
若未查找到，请回复"null"，不要解释其他内容。

示例：
{
用户描述：我今天生病了帮我提交请假表单我的个人信息如下，我的姓名是xx，我的部门是xxx，明天请个假，从上午11点到下午6点，我的上级领导是xxx，我的电子邮箱是xxx，我的岗位名称是xxxx。
请假人：xx
请假人部门：xxx
开始日期：明天
开始时间：上午11点
结束日期：明天
结束时间：下午6点
请假类型：病假
事由：生病
请假天数：1
总请假天数：1
上级领导：xxx
相应工资是否调整：否
批复：null
}
{用户query}
请根据以上文本，按照模版输出内容。
```

#### 8.1.2 意图识别：使用大模型对用户输入的语义进行识别，分类。

```python  theme={null}
从以下信息原文：
\"\"\"
{QA}
\"\"\"
中做用户的意图识别

意图种类：
\"\"\"
xxxxx:xxxx
xxxxx:xxxx

\"\"\"

从意图种类中选择用户的意图,按照示例格式直接使用json输出
必须且只能给一个意图种类

示例格式：
{\"用户意图种类\": \"\....\"}
-------------------------------
原文：\"\"\"
{input2}
\"\"\"
根据原文信息进行xxx意图种类的判断

注意：
1. xxxx
2. xxxx

\"\"\"
示例格式：
xxx
\"\"\"
```

#### 8.1.3 query改写：当用户的输入可能不完整或有歧义，使用大模型将用户的输入改写成完整或正确的

```python  theme={null}
\"\"\"
用户有如下输入：
{用户}
\"\"\"
请参考上下文，在语义和前提完整的情况下，将用户的输入补全或更正。
请一定注意，用户的输入可能会有以下问题：
1.代词或指代，需要联系上文补全代指的信息。
2.省略句，需要联系上文补全代指的信息。
3.错别字，需要联系上文更正代指的信息。
4.需要联系上文补全定语和状语信息。

请按照如下格式输出：
{\"修改后的用户输入\":\"\"}
\"\"\"
你有如下上下文内容作为补充：
{对话内容}
\"\"\"
```

#### 8.1.4 知识库问答：用于接入知识库的问答场景

**大模型调用知识库**：

```plaintext  theme={null}
角色：你是一名专业的软件公司客服。你正在为用户进行售后服务。你的回答语气需要根据用户的情绪做调整。

背景：公司的业务是一个无代码开发平台。

任务：你需要根据知识回答用户的问题。当知识中有答案时，使用知识原文回答；当知识无法回答用户的问题，回复"我不知道"。
\"\"\"
用户的问题如下：
{{用户}}
\"\"\"
\"\"\"
你有如下知识：
{{知识}}
\"\"\"
```

**Agent调用知识库**：

```plaintext  theme={null}
system prompt
角色：你是一名专业的软件公司客服。你正在为用户进行售后服务。你的回答语气需要根据用户的情绪做调整。

背景：公司的业务是一个无代码开发平台。

任务：你需要使用知识库工具\"{文档名称}\"回答用户的问题。

要求：
1. 你必须使用知识库工具\"\"{文档名称}\"\"
2. 当知识中有答案时，使用知识原文回答；当知识无法回答用户的问题，回复"我不知道"。
\"\"\"
你有一个知识库工具可以使用\"{文档名称}\"，\"{文档描述}\"
\"\"\"

user prompt
{{用户}}
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt