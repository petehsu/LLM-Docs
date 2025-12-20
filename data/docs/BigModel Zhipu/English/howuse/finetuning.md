[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fhowuse%2Ffinetuning)

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

# Model Fine-tuning

## GLM-4-Flash Limited-Time Free Fine-tuning Event

提示

**Act Now!** Act now! Get 5 million tokens for fine-tuning your Flash model for only ¥1 . Limited to the first 2,000 users.Don’t miss this rare opportunity to make your model more accurate and efficient. [click here](https://open.bigmodel.cn/tokenspropay?productIds=product-029)

## Overview

### What is Model Fine-tuning?

Model fine-tuning involves adjusting the platform’s base model with unique scenario data using fine-tuning tools. It helps you quickly customize a large model that better fits your business needs. The advantage lies in making minor adjustments to the base model to meet specific requirements, which is efficient and cost-effective compared to training a new model.

### When is Fine-tuning Applicable?

You can first try adjusting prompts or using tools like function calls and retrieval functions to improve results. If you still find that the base model and related tools cannot provide satisfactory answers or handle complex reasoning tasks, fine-tuning can be used to achieve better results.

Typical scenarios where fine-tuning can improve results:

* Need for specific styles or tones
* Need to handle complex tasks
* Need to improve output reliability
* New tasks that are difficult to explain through prompts

### What Fine-tuning Methods are Available?

#### LoRA Fine-tuning

* **Meaning:** Adjusting the model by adding low-rank matrices to the existing weight matrices, which can effectively adjust the model with a small increase in computational burden.
* **Advantages:**
  + Only a small number of parameters are added, high parameter efficiency;
  + Less resource utilization and shorter training cycles

#### Full-Parameter Fine-tuning

* **Meaning:** Adjusting all parameters of the pre-trained model to obtain a new model.
* **Advantages:**
  + Allows comprehensive adjustments to the model to better adapt to new tasks;
  + More likely to achieve optimal performance with sufficient data and computational resources.

### Which Models Can Be Fine-tuned?

* `glm-4-0520`（LoRA fine-tuning, full-parameter fine-tuning, available to annual plan users of Cloud Private Deployment ）
* `glm-4-air`（LoRA fine-tuning, full-parameter fine-tuning, available to all users)
* `glm-4-flash` (LoRA fine-tuning, full-parameter fine-tuning, available to all users)
* `glm-4-9b` (LoRA fine-tuning, full-parameter fine-tuning, available to all users)
* `chatglm3-6b` (LoRA fine-tuning, available to all users)
* `cogview-3`（full-parameter fine-tuning, available to all users）
* `glm-4v`（LoRA fine-tuning, available to all users）

LoRA fine-tuning training and inference for `glm-4-flash` can be experienced by purchasing [Developer Pro Benefits](https://open.bigmodel.cn/tokenspropay?productIds=product-001) .

## Fine-tuning Steps

Typically, completing model fine-tuning involves the following steps:

1. Prepare and upload training data
2. Train the new fine-tuned model
3. Deploy and use the fine-tuned model (LoRA fine-tuning supports public pool inference, deployment is not required)
4. Evaluate the results, and if necessary, return to step 1

### 1. Preparing Training Data

Fine-tuning training data typically consists of a batch of data containing inputs and expected outputs, with each training data consisting of a single input (Prompt) and its corresponding expected output. Currently, only JSON format files are supported for uploading training data.

#### Dataset Requirements:

Generally, providing more high-quality training data results in better fine-tuning. Conversely, if there are issues or flaws in the training data, it will negatively impact the fine-tuning results.

**More High-Quality Data:** To better fine-tune the model, you need to provide at least several hundred high-quality training data; it is best to have the data rigorously reviewed by humans to ensure data quality and fine-tuning results. Increasing high-quality training data is the best and most reliable way to improve fine-tuning results.

**Adjusting Data Distribution According to Training Objectives:** When constructing training data, you need to pay attention to constructing and adjusting the distribution of training data for various细分 task scenarios according to the real business scenario training objectives, and try to cover all possible data samples in the business scenario. If your training goal is to simultaneously enhance the effects of text classification, information extraction, and text generation, you need to provide sufficient training data for these types of tasks in the training data.

**Avoiding Harmful Data:** To ensure your data privacy, the platform will not review your data. Please ensure that your data does not contain harmful information, including but not limited to pornography, terrorism, political sensitivity, vulgar abuse, privacy information, etc. Using harmful data for fine-tuning may cause the fine-tuned model to easily generate harmful content, reducing the pass rate of sensitive information verification in model inference results. Even worse, a severely harmful model may not pass the content compliance requirements of the platform or relevant authorities and will be forcibly removed from the platform.

#### Dataset Format

##### Large Language Model

1.Training data format for large language models (chat)

Prepare the dataset in the format shown in the example, in JSON format, one per line, store in a file and upload the file using the file management interface:

```
{"messages": [{"role": "system", "content": "You are a helpful and knowledgeable AI assistant."},{"role": "user", "content": "Please explain the basic principles of AlphaGo."}, {"role": "assistant", "content": "AlphaGo combines deep neural networks with tree search algorithms, training through game data to gradually improve its game level, able to judge the Go situation and choose the best move."}]}
{"messages": [{"role": "system", "content": "You are a helpful and knowledgeable AI assistant."},{"role": "user", "content": "List some important principles of healthy eating."}, {"role": "assistant", "content": "Important principles of healthy eating include: a balanced diet, reasonable intake of various nutrients;多吃新鲜蔬果,适量饮水;少吃糖、油、盐,忌吃过量快餐;养成规律生活作息习惯,适量运动."}]}
{"messages": [{"role": "system", "content": "You are a helpful and knowledgeable AI assistant."},{"role": "user", "content": "Give some suggestions for improving sleep quality."}, {"role": "assistant", "content": "Suggestions for improving sleep quality include: ensuring sleep time, avoiding sleep deprivation; relaxing before bed, avoiding刺激;养成规律作息时间,不要频繁熬夜;适量运动,但不要运动过度;睡前可以喝一杯热牛奶等温和饮料."}]}
```

1  
2  
3

If you do not need to upload the system prompt, simply delete the system promt paragraph, as shown below:

```
{"messages": [{"role": "user", "content": "Please explain the basic principles of AlphaGo."}, {"role": "assistant", "content": "AlphaGo combines deep neural networks with tree search algorithms, training through game data to gradually improve its game level, able to judge the Go situation and choose the best move."}]}
```

1

2. Training data format for large language models (function capabilities).  
   Currently, only the `glm-4-air`, `glm-4-flash`, and `glm-4-9b` models support this format for full parameter fine-tuning. If you wish to fine-tune function calling capabilities, you can use the following training format. Note that examples should be clearly structured as shown below, with data uploaded in JSON format, one entry per line, stored in a file, and uploaded via the file management interface:

```
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
54  
55  
56  
57

##### Multimodal Model

1.Text Generation to Image Model  
Currently, the Cogview-3 model fine-tuning is supported. You can choose to upload images using either an HTTP URL or Base64 format. When using Base64 format, the URL prefix must include data:image/jpeg;base64,.

Please note that the example should be clearly structured and displayed as follows. When uploading data, it must be in JSON format with one entry per line, stored in a file and uploaded through the file management interface.

* Http URL

```
{
  "messages": [{
    "role": "system",
    "content": "You are the image generation assistant Cogview of Zhipu AI Company."},
  {
    "role": "user",
    "content": "A black French Bulldog is captured mid-flight against a backdrop of New York City's skyscrapers, embodying the role of Superman with its blue suit and red cape. Its joyful expression and open mouth convey a sense of exhilaration and playfulness. The scene is rendered with striking realism, using lighting to accentuate the dog's features and create a vivid atmosphere that suggests motion and heroism."
  },
  {
    "role": "assistant",
    "content": [{
      "type": "image_url",
      "image_url": {
        "url": "https://www.xx.cn/xxx.jpeg"
      }
    }]
  }]
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

* Base 64

```
```json
{
  "messages": [{
    "role": "system",
    "content": "You are Cogview, the AI assistant of Zhipu AI"},
  {
    "role": "user",
    "content": "A black French Bulldog is captured mid-flight against a backdrop of New York City's skyscrapers, embodying the role of Superman with its blue suit and red cape. Its joyful expression and open mouth convey a sense of exhilaration and playfulness. The scene is rendered with striking realism, using lighting to accentuate the dog's features and create a vivid atmosphere that suggests motion and heroism."
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

2.Image-to-Text Model  
Currently, the GLM-4V model fine-tuning is supported. You can choose to upload images using either an HTTP URL or Base64 format. When using Base64 format, the URL prefix must include data:image/jpeg;base64,.

Please note that the example should be clearly structured and displayed as follows. When uploading data, it must be in JSON format with one entry per line, stored in a file and uploaded through the file management interface.

* Http URL

```
{
  "messages": [{
    "role": "system",
    "content": "You are GLM-4V, the AI assistant of Zhipu AI."
  },
  {
    "role": "user",
    "content": "What is in the picture?"
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
    "content": "This picture shows a notice posted on a wall."
  },
  {
    "role": "user",
    "content":"Relating to recent news"
  },
  {
    "role": "assistant",
    "content": "The Nanjing Public Security Bureau just reported that starting from July this year, the city has investigated 100 cases of electric vehicle violations."
  }]
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

* Base 64

```
{
  "messages": [{
    "role": "system",
    "content": "You are GLM-4V, the AI assistant of Zhipu AI."
  },
  {
    "role": "user",
    "content": "What is in the picture?"
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
    "content": "This picture shows a notice posted on a wall."
  },
  {
    "role": "user",
    "content":"Relating to recent news"
  },
  {
    "role": "assistant",
    "content": "The Nanjing Public Security Bureau just reported that starting from July this year, the city has investigated 100 cases of electric vehicle violations."
  }]
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

### 2. Creating a Fine-tuning Task

If you have prepared high-quality training data as described above, you can now create a fine-tuning task to train the model.

You can create a fine-tuning task through the page operation, with the following entry points:

Fine-tuning task entry 1: [Model Square](https://open.bigmodel.cn/console/modelcenter/square)  access the model details page click the fine-tuning button inside the model card

![Description](https://cdn.bigmodel.cn/markdown/1736763273387image.png?attname=image.png)

Fine-tuning task entry 2: [Fine-tuning Tasks](https://open.bigmodel.cn/console/modelft/finetuning)  Click the “Create Fine-tuning Task” button  
![Description](https://cdn.bigmodel.cn/markdown/1732861379106img_v3_02h3_5b321e5c-186b-4a52-8b03-14e8ed3635fg.jpg?attname=img_v3_02h3_5b321e5c-186b-4a52-8b03-14e8ed3635fg.jpg)

When creating a fine-tuning task, you can name the new model as needed and specify the suffix of the model code. For other parameter settings, please refer to the fine-tuning API interface documentation. It takes a few minutes to a few hours to complete the training after creating the fine-tuning task, depending on the model size and dataset size. We will notify you via SMS once the training is complete.

### 3. Deploying the Fine-tuned Model

After the model training is complete, it can be deployed with the following entry points:

#### Model deployment entry

Entry 1: [Model Square](https://open.bigmodel.cn/console/modelcenter/square)  access the model details page click the deployment button inside the model card

![Description](https://cdn.bigmodel.cn/markdown/1736763273387image.png?attname=image.png)

Entry 2: [Private Instances](https://open.bigmodel.cn/console/modelcenter/deploy)  Click the “Create Deployment Task” button

![Zhipu Open Platform](https://cdn.bigmodel.cn/static/platform/images/modelcenter/doc/deploy-list.png)

You can choose the number of instances to deploy based on the concurrent demands of your actual usage scenario. Instance deployment takes some time (usually 10-30 minutes depending on the model size). We will notify you via SMS once the deployment is complete.

#### Model instance modification and deployment cancellation

1.Model instance modification and deployment cancellation

You can modify the number of instances or cancel the deployment of an already deployed model on the Model Marketplace - Model Details page or the Private Instances page.  
Note: The cancellation action will take effect immediately after execution. Once canceled, the deployed model will no longer be callable.

![Description](https://cdn.bigmodel.cn/markdown/1736763543381image.png?attname=image.png)  
2.Model Card Deletion

When you click the “Delete” button on the model card, both the fine-tuned model and its deployed model will be deleted.

![Description](https://cdn.bigmodel.cn/markdown/1736763795958image.png?attname=image.png)

### 4. Using the Fine-tuned Model

After the model fine-tuning training is complete, you can use the model through the experience center or API. When making an API request, you can pass the new model code you named as the value of the `model` parameter.

#### Call Example

```
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="")
response = client.chat.completions.create(
    model="chatglm3-6b-1001",  # Fill in the name of the model you need to call
    messages=[
        {"role": "system", "content": "You are an AI assistant named chatGLM."},
        {"role": "user", "content": "Hello! What is your name?"},
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

### 5.Fine-tuning Training Billing Explanation

#### Model Classification

Large Language Model: Training Cost = Number of tokens in a single round of training dataset \* Number of epochs \* Training Price (xx yuan per thousand tokens)  
Text-to-Image Model: Training Cost = Number of images in a single round of training dataset \* 1024 tokens \* Number of epochs \* Training Price (xx yuan per thousand tokens)  
Each image will be converted to 1024 tokens.”

#### Pricing Details

[Pricing Page](http://open.bigmodel.cn/pricing)

Table of contents

GLM-4-Flash Limited-Time Free Fine-tuning Event

Overview

What is Model Fine-tuning?

When is Fine-tuning Applicable?

What Fine-tuning Methods are Available?

Which Models Can Be Fine-tuned?

Fine-tuning Steps

1. Preparing Training Data

2. Creating a Fine-tuning Task

3. Deploying the Fine-tuned Model

4. Using the Fine-tuned Model

5.Fine-tuning Training Billing Explanation