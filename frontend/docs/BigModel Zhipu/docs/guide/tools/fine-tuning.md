# 模型微调

## 概述

### 什么是模型微调？

模型微调是通过微调工具，使用独特的场景数据对平台的基础模型进行调整，帮助你快速定制一个更符合业务需求的大型模型。其优势在于对基础模型进行小幅调整以满足特定需求，相比于训练一个新模型，这种方法更为高效且成本更低。

### 何时适用微调？

你可以首先尝试调整提示或使用函数调用和检索功能等工具来改善结果。如果你发现基础模型及相关工具仍无法提供满意的答案或处理复杂的推理任务，则可以使用微调来获得更好的结果。

微调可以改善结果的典型场景包括：

* 需要特定的风格或语气
* 需要处理复杂任务
* 需要提高输出可靠性
* 新任务难以通过提示解释

### 有哪些微调方式？

SFT：训练后提升模型的指令遵循能力。
DPO：训练后模型输出内容更符合用户偏好。

### 有哪些训练方式？

#### LoRA微调

* **含义：** 通过在现有权重矩阵中添加低秩矩阵来调整模型，可以在增加少量计算负担的情况下有效调整模型。
* **优势：**
  仅增加少量参数，参数效率高；
  资源利用少，训练周期短

#### 全参数微调

* **含义：** 调整预训练模型的所有参数以获得新模型。
* **优势：**
  允许对模型进行全面调整，更好地适应新任务；
  在有足够数据和计算资源的情况下，更有可能达到最佳性能。

### 哪些模型可以进行微调？

* `glm-4.5`（32k上下文版本，支持 LoRA 微调，所有用户可用）
* `glm-4.5`（16k上下文版本，支持全参数微调，所有用户可用）
* `glm-4.5-Air`（支持全参数微调，所有用户可用）
* `glm-4-0520`（支持 LoRA 微调、全参数微调，云端私有化年套餐用户可用）
* `glm-4-air-250414`（支持全参数微调，所有用户可用）
* `glm-4-flash`（支持 LoRA 微调、全参数微调，所有用户可用）
* `glm-4-9b`（支持 LoRA 微调、全参数微调，所有用户可用）
* `chatglm3-6b`（支持 LoRA 微调，所有用户可用）
* `cogview-3`（支持全参微调，所有用户可用）
* `glm-4v`（支持 LoRA 微调，所有用户可用）

购买 [开发者 Pro 权益](https://bigmodel.cn/tokenspropay?productIds=product-001) 可体验 `glm-4-flash` 的 LoRA 微调训练和推理。

## 微调步骤

通常，完成模型微调包括以下步骤：

1. 准备并上传训练数据
2. 训练新的微调模型
3. 部署并使用微调模型（仅文生文模型 LoRA 微调后支持公有池推理，其他情况均需部署后推理使用。）
4. 评估结果，如有必要，返回步骤1

### 1. 准备训练数据

微调训练数据通常由一批包含输入和预期输出的数据组成，每条训练数据包含一个输入（Prompt）及其对应的预期输出。目前仅支持 JSON 格式文件上传训练数据。

#### 数据集要求

一般来说，提供更多高质量的训练数据会得到更好的微调效果。反之，如果训练数据存在问题或缺陷，将会对微调结果产生负面影响。

**更多高质量数据：** 为了更好地微调模型，你需要提供至少数百条高质量的训练数据；最好由人工严格审核数据，以确保数据质量和微调结果。增加高质量的训练数据是改善微调结果的最佳且最可靠的方法。

**根据训练目标调整数据分布：** 在构建训练数据时，你需要根据实际业务场景的训练目标，注意构建和调整各类细分任务场景的训练数据分布，并尽量覆盖业务场景中所有可能的数据样本。如果你的训练目标是同时提升文本分类、信息抽取和文本生成的效果，你需要在训练数据中为这些类型的任务提供足够的训练数据。

**避免有害数据：** 为了确保你的数据隐私，平台不会审核你的数据。请确保你的数据不包含有害信息，包括但不限于色情、恐怖主义、政治敏感、低俗辱骂、隐私信息等。使用有害数据进行微调可能会导致微调后的模型容易生成有害内容，降低模型推理结果中敏感信息验证的通过率。更糟糕的是，一个严重有害的模型可能无法通过平台或相关监管机构的内容合规要求，并会被强制从平台移除。

#### 数据集格式

**大语言模型-SFT训练**

1. 数据集分类-文本生成

准备数据集格式如下所示，以 JSON 格式每行一条，存储在文件中并通过文件管理接口上传文件：

```json  theme={null}
{"messages": [{"role": "system", "content": "你是一个乐于助人且知识渊博的AI助手。"},{"role": "user", "content": "请解释AlphaGo的基本原理。"}, {"role": "assistant", "content": "AlphaGo结合深度神经网络与树搜索算法，通过棋局数据进行训练，逐步提升棋力，能够判断围棋局势并选择最佳着法。"}]}
{"messages": [{"role": "system", "content": "你是一个乐于助人且知识渊博的AI助手。"},{"role": "user", "content": "列举一些健康饮食的重要原则。"}, {"role": "assistant", "content": "健康饮食的重要原则包括：均衡饮食，合理摄入各类营养素；多吃新鲜蔬果，适量饮水；少吃糖、油、盐，忌吃过量快餐；养成规律生活作息习惯，适量运动。"}]}
{"messages": [{"role": "system", "content": "你是一个乐于助人且知识渊博的AI助手。"},{"role": "user", "content": "给出一些改善睡眠质量的建议。"}, {"role": "assistant", "content": "改善睡眠质量的建议包括：保证睡眠时间，避免睡眠不足；睡前放松，避免刺激；养成规律作息时间，不要频繁熬夜；适量运动，但不要运动过度；睡前可以喝一杯热牛奶等温和饮料。"}]}
```

如果你不需要上传 system prompt，只需删除该段落，如下所示：

```json  theme={null}
{"messages": [{"role": "user", "content": "请解释AlphaGo的基本原理。"}, {"role": "assistant", "content": "AlphaGo结合深度神经网络与树搜索算法，通过棋局数据进行训练，逐步提升棋力，能够判断围棋局势并选择最佳着法。"}]}
```

2. 数据集分类-文本生成（函数调用）

目前仅 `glm-4.5-air`、`glm-4-air`、`glm-4-flash`、`glm-4-9b` 模型全参微调支持该格式训练。 \
若您希望微调函数调用能力，可用以下版本训练格式。注意，示例为结构清晰按如下展示，数据上传时需以 JSON 格式每行一条，存储在文件中并通过文件管理接口上传文件：

```json  theme={null}
{
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant with access to the following functions to help the user. You can use the functions if needed.",
        },
        {
            "role": "user",
            "content": "Can you help me generate anagrams of the words 'listen' and 'race'?",
        },
        {
            "role": "assistant",
            "tool_calls": [
                {
                    "id": "TX92Jm8Zi",
                    "type": "function",
                    "function": {
                        "name": "generate_anagram",
                        "arguments": "{\"word\": \"listen\"}"
                    }
                }
            ]
        },
        {
            "role": "tool",
            "content": "{\"anagram\": \"silent\"}",
            "tool_call_id": "TX92Jm8Zi"
        }
        {
            "role": "assistant",
            "content": "The anagrams of the words 'listen' is 'silent'."
        },
        {
            "role": "user",
            "content": "That's amazing! You are so powerful."
        }
    ],
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "generate_anagram",
                "description": "Generate an anagram of a given word",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "word": {
                            "type": "string",
                            "description": "The word to generate an anagram of"
                        }
                    },
                    "required": ["word"]
                }
            }
        }
    ]
}
```

3. 数据集分类-文本生成（深度思考）

目前仅`glm-4.5-air`模型全参微调支持该格式训练，若您希望微调函数调用能力，可用以下版本训练格式。注意，示例为结构清晰按如下展示，数据上传时需以 JSON 格式每行一条，存储在文件中并通过文件管理接口上传文件：

```json  theme={null}
{
    "messages": [
        {
            "content": "沿着一个周长是800米的鱼塘的一周，每隔20米栽一棵柳树，一共栽多少棵柳树．",
            "role": "user"
        },
        {
            "content": "\n沿着一个周长为800米的鱼塘一周，每隔20米栽一棵柳树。由于鱼塘是封闭的环形，**植树数量等于间隔数**。\n\n1. **计算间隔数**：  \n   周长 ÷ 间隔距离 = 800 ÷ 20 = **40个间隔**。\n\n2. **确定植树数量**：  \n   在封闭图形中，首尾相连，因此**间隔数 = 植树数量**。无需额外加1或减1。\n\n**答案**：一共栽 **40棵** 柳树。  \n**解析**：800 ÷ 20 = 40（棵）。  \n\n**答案**：$\\boxed{40}$",
            "role": "assistant",
            "reasoning_content": "我现在要解决的问题是：沿着一个周长是800米的鱼塘的一周，每隔20米栽一棵柳树，一共栽多少棵柳树。首先，我需要回忆一下关于封闭图形植树问题的知识。因为鱼塘是圆形的，周长是800米，所以这是一个封闭的环形，也就是首尾相连的图形。\n\n首先，我记得在封闭图形中，植树的数量和间隔数是相等的。比如说，一个圆形的跑道，周长是C，每隔d米种一棵树，那么间隔数就是C除以d，而因为是封闭的，所以树的数量就等于间隔数，不需要加1或者减1，因为在直线两端种树的时候，如果两端都种的话，数量是间隔数加1，但如果是一头种一头不种的话，数量等于间隔数，而封闭图形相当于首尾相连，所以两端其实是同一个点，所以数量等于间隔数。\n\n现在题目里说周长是800米，每隔20米栽一棵柳树，那么首先计算间隔数，就是周长除以间隔距离，也就是800米除以20米，等于40个间隔。因为是封闭的环形，所以每个间隔对应一棵树，所以树的数量应该等于间隔数，也就是40棵。\n\n不过，为了确认，我可以举个简单的例子来验证。比如，假设周长是20米，每隔20米种一棵树，那么应该种1棵，对吗？因为绕一圈20米，每隔20米种一棵，刚好在起点种一棵，然后绕一圈回来又到了起点，所以只种1棵，这时候间隔数是20/20=1，数量也是1，符合间隔数等于数量。\n\n再比如，周长40米，每隔20米种一棵，那么间隔数是2，应该种2棵，分别在0米和20米的位置，绕一圈40米，40米的位置就是0米的位置，所以不需要再种，所以是2棵，间隔数2，数量2，正确。\n\n再比如，周长60米，每隔20米种一棵，间隔数3，数量3，分别在0、20、40米，60米就是0米，所以3棵，正确。\n\n所以回到题目，800米周长，每隔20米，间隔数是800/20=40，所以数量是40棵。\n\n可能有人会想，是不是要加1，比如直线的情况，两端都种的话，数量是间隔数加1，但这里是环形，首尾相连，所以起点和终点是同一个位置，所以不需要加1，间隔数就等于数量。\n\n总结一下，封闭图形的植树问题，棵数=周长÷间隔长度，所以这里就是800÷20=40棵。"
        }
    ]
}
```

**大语言模型-DPO训练**

1. 数据集分类-文本生成（偏好对齐）

目前支持 glm-4-air、glm-4-flash、glm-4-9b 模型的 DPO 训练能力。训练数据中可标明输出偏好，让模型学习后可以在输出上进一步和用户期望的偏好进行对齐。注意，示例为结构清晰按如下展示，数据上传时需以 JSON 格式每行一条，存储在文件中并通过文件管理接口上传文件：

```json  theme={null}
{
  "input": {
    "messages": [
      {
        "role": "user",
        "content": "请问可以告诉我北京今天的天气如何吗?"
      }
    ],
    "tools": [],
    "parallel_tool_calls": false
  },
  "preferred_output": [
    {
      "role": "assistant",
      "content": "今日天气以晴天为主，白天最高气温 25℃ ，夜间最低气温 11℃ ，昼夜温差较大，需注意及时调整衣物。"
    }
  ],
  "non_preferred_output": [
    {
      "role": "assistant",
      "content": "今天北京不是特别冷。"
    }
  ]
}
```

**多模态模型**

1. 数据集分类-图像生成（单图）

目前支持 Cogview-3 模型微调，您可以选择上传图片时选择 http url 或者 base 64 格式。使用 base 64 格式时 url 前缀需包含 data:image/jpeg;base64, 注意，示例为结构清晰按如下展示，数据上传时需以 JSON 格式每行一条，存储在文件中并通过文件管理接口上传文件：

* Http URL

```json  theme={null}
{
  "messages": [{
    "role": "system",
    "content": "你是智谱AI公司的图片生成助手Cogview"},
  {
    "role": "user",
    "content": "一只黑色法式斗牛犬在纽约市摩天大楼的背景下被捕捉到飞行中的瞬间，身穿蓝色西装和红色斗篷，展现出超人的形象。它快乐的表情和张开的嘴巴传达出一种兴奋和顽皮的感觉。这个场景以惊人的真实感呈现，利用光线突出狗的特征，营造出一种生动的氛围，暗示着运动和英雄气概."
  },
  {
    "role": "assistant",
    "content": [{
      "type": "image_url",
      "image_url": {
        "url": "https://www.xxx/xx.jpeg"
      }
    }]
  }]
}
  
```

* Base 64

```json  theme={null}
{
  "messages": [{
    "role": "system",
    "content": "你是智谱AI公司的图片生成助手Cogview"},
  {
    "role": "user",
    "content": "一只黑色法式斗牛犬在纽约市摩天大楼的背景下被捕捉到飞行中的瞬间，身穿蓝色西装和红色斗篷，展现出超人的形象。它快乐的表情和张开的嘴巴传达出一种兴奋和顽皮的感觉。这个场景以惊人的真实感呈现，利用光线突出狗的特征，营造出一种生动的氛围，暗示着运动和英雄气概."
  },
  {
    "role": "assistant",
    "content": [{
      "type": "image_url",
      "image_url": {
        "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/.........."
      }
    }]
  }]
}
```

2. 数据集分类-图像理解（单图）

目前支持 GLM-4V 模型微调，您可以选择上传图片时选择 http url 或者 base 64 格式。使用 base 64 格式时 url 前缀需包含前缀：data:image/jpeg;base64,  \
注意，示例为结构清晰按如下展示，数据上传时需以 JSON 格式每行一条，存储在文件中并通过文件管理接口上传文件：

* Http URL

```json  theme={null}
{
  "messages": [{
    "role": "system",
    "content": "你是智谱AI公司的AI助手GLM-4V。"
  },
  {
    "role": "user",
    "content": "图里是什么"
  },
  {
    "role": "user",
    "content": [
    {
      "type": "image_url",
      "image_url": {
        "url": "https://www.zhipuai.cn/assets/images/aboutus/company.jpeg"
      }
    }]
  },
  {
    "role": "assistant",
    "content": "这张图片展示了一张贴在墙上的通知"
  },
  {
    "role": "user",
    "content":"结合最近的新闻"
  },
  {
    "role": "assistant",
    "content": "南京市公安局刚刚报道，今年7月开始，全市查处了100次电动车违规。"
  }]
}
```

* Base 64

```json  theme={null}
{
  "messages": [{
    "role": "system",
    "content": "你是智谱AI公司的AI助手GLM-4V。"
  },
  {
    "role": "user",
    "content": "图里是什么"
  },
  {
    "role": "user",
    "content": [
    {
      "type": "image_url",
      "image_url": {
        "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/.........."
      }
    }]
  },
  {
    "role": "assistant",
    "content": "这张图片展示了一张贴在墙上的通知"
  },
  {
    "role": "user",
    "content":"结合最近的新闻"
  },
  {
    "role": "assistant",
    "content": "南京市公安局刚刚报道，今年7月开始，全市查处了100次电动车违规。"
  }]
}
```

#### 数据集上传

入口1：[微调数据页面](https://bigmodel.cn/console/modelft/finetuning)
根据您需要微调的场景，目前可以选择数据集分类为大语言模型 (chat) 训练数据、大语言模型 (function 能力) 训练数据。

![Description](https://cdn.bigmodel.cn/markdown/1729047753596%E5%BE%AE%E8%B0%83%E6%95%B0%E6%8D%AE%E5%9B%BE%E7%89%87.png?attname=%E5%BE%AE%E8%B0%83%E6%95%B0%E6%8D%AE%E5%9B%BE%E7%89%87.png)

入口2：[微调任务创建](http://bigmodel.cn/console/modelft/finetuning/create)
您也可以直接在微调任务创建时选择上传新数据集，提交的数据集会自动更新到您的「微调数据」内

![Description](https://cdn.bigmodel.cn/markdown/17533399597281.%E5%85%A5%E5%8F%A3%E5%BE%AE%E8%B0%83%E4%BB%BB%E5%8A%A1%E5%88%9B%E5%BB%BA.jpg?attname=1.%E5%85%A5%E5%8F%A3%E5%BE%AE%E8%B0%83%E4%BB%BB%E5%8A%A1%E5%88%9B%E5%BB%BA.jpg)

### 2. 创建微调任务<span id="createFt" />

如果你已经按照上述要求准备好了高质量的训练数据，现在可以创建微调任务来训练模型了。

你可以通过页面操作创建微调任务，入口如下：

微调任务入口1：[微调任务](https://open.bigmodel.cn/console/modelft/finetuning)  点击“创建微调任务”按钮。

![Description](https://cdn.bigmodel.cn/markdown/1753340074149new2.jpg?attname=new2.jpg)

![Description](https://cdn.bigmodel.cn/markdown/1753340137980new12.jpg?attname=new12.jpg)

微调任务入口2：[模型广场](https://open.bigmodel.cn/console/modelcenter/square)  鼠标放在指定模型卡片上，会展示出「体验」、「查看详情」按键。点击模型卡片的「查看详情」按钮，进入详情页点击模型微调。

![智谱开放平台](https://cdn.bigmodel.cn/markdown/1736760813205image.png?attname=image.png)

![智谱开放平台](https://cdn.bigmodel.cn/markdown/1736760838590image.png?attname=image.png)

创建微调任务时，你可以根据需要命名新模型并指定模型代码的后缀。其他参数设置请参考微调API接口文档。创建微调任务后，训练完成需要几分钟到几小时不等，具体取决于模型大小和数据集大小。我们会在训练完成后通过短信通知你。

### 3. 部署微调模型

#### 模型部署入口：

入口1：[私有实例](https://open.bigmodel.cn/console/modelcenter/deploy)  点击“创建部署任务”按钮，选择要部署的基础模型/微调模型。

![智谱开放平台](https://cdn.bigmodel.cn/markdown/1736760990916image.png?attname=image.png)

![智谱开放平台](https://cdn.bigmodel.cn/markdown/1736761044663image.png?attname=image.png)

入口2：[模型广场](https://open.bigmodel.cn/console/modelcenter/square) 点击模型卡片的详情按钮（微调完成的模型会在模型生成一个微调模型卡片），进入「查看详情」点击「部署」按键。
成功部署后，您可以在该卡片的详情页面看到部署的信息。

![智谱开放平台](https://cdn.bigmodel.cn/markdown/1736761133013image.png?attname=image.png)

![智谱开放平台](https://cdn.bigmodel.cn/markdown/1736761171736image.png?attname=image.png)

你可以根据实际使用场景的并发需求选择部署实例的数量。实例部署需要一定时间（通常为10-30分钟，具体取决于模型大小）。我们会在部署完成后通过短信通知你。新部署的模型的模型编码、状态及实例信息可在[私有实例](https://open.bigmodel.cn/console/modelcenter/deploy) 页面或[模型广场](https://open.bigmodel.cn/console/modelcenter/square)  的模型详情页部署信息查看。

#### 模型实例变更与取消部署

1. 操作实例变更与模型部署取消 \
   您可以在[模型广场](https://open.bigmodel.cn/console/modelcenter/square)的模型详情页或在[私有实例](https://open.bigmodel.cn/console/modelcenter/deploy) 页面选择已经部署的模型进行实例数量变更或者取消部署。

* 注意：取消部署动作将在操作后立即生效，取消后该部署模型无法再进行调用。

![智谱开放平台](https://cdn.bigmodel.cn/markdown/1736761705987image.png?attname=image.png)

![智谱开放平台](https://cdn.bigmodel.cn/markdown/1736761645429image.png?attname=image.png)

2. 模型卡片删除

* 当点击模型卡片「删除」按键后，该微调模型及基于该模型部署的模型将均被删除，无法调用。

![智谱开放平台](https://cdn.bigmodel.cn/markdown/1736761730005image.png?attname=image.png)

### 4. 模型推理

1.模型编码获取
可公有池推理的模型可以直接复制模型编码，您也可以选择在测试效果后进行私有实例部署

![Description](https://cdn.bigmodel.cn/markdown/1736771921513image.png?attname=image.png)

需要私有部署后推理的模型需要在部署后进行调用。部署后的编码请在模型广场对应模型卡片详情内或私有实例页面查看

![Description](https://cdn.bigmodel.cn/markdown/1736771960265image.png?attname=image.png)

2. 模型调用
   你可以通过体验中心或 API 使用模型。在进行 API 请求时，你可以将你命名的新的模型代码作为 `model` 参数的值传递。

#### 调用示例

**安装 SDK**

```bash  theme={null}
# 安装最新版本
pip install zai-sdk

# 或指定版本
pip install zai-sdk==0.1.0
```

**验证安装**

```python  theme={null}
import zai
print(zai.__version__)
```

**使用示例**

```python  theme={null}
from zai import ZhipuAiClient

# 初始化客户端
client = ZhipuAiClient(api_key="YOUR_API_KEY")

# 创建聊天完成请求
response = client.chat.completions.create(
    model="chatglm3-6b-1001",  # 填写你需要调用的模型名称
    messages=[
        {
            "role": "system",
            "content": "你是一个名为chatGLM的AI助手。"
        },
        {
            "role": "user",
            "content": "你好，请介绍一下自己。"
        }
    ],
    temperature=0.7
)

# 获取回复
print(response.choices[0].message.content)
```

### 5. 微调训练计费说明

#### 模型分类

1. **文本模型**：

```
训练价格 = 文本 Tokens × Epoch 数 × 单价（xx 元 / 千 tokens）
```

2. **文生图模型**：

```
训练价格 =（单轮训练图片数 × 1024）× Epoch 数 × 单价（xx 元 / 千 tokens）
```

* 每张图片固定转换为 1024 Tokens

3. **视觉理解模型**：

```
训练价格 =（单轮训练单图tokens数*图片数量 + 文本 Tokens）× Epoch 数 × 单价（xx 元 / 千 tokens）
```

* glm-4v-plus / glm-4v-plus-0111：
  * 单图 Token 固定为 2304

* glm-4v / glm-4v-flash：
  * 单图 Token 固定为 1600

#### 定价详情

[模型定价页面](http://open.bigmodel.cn/pricing)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt