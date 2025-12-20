# 学术数据处理

> 论文总结翻译润色

## 场景介绍

大模型技术正全面革新学术研究的传统方式。面对海量论文资料，研究者亟需高效工具来减轻工作量。以智谱 GLM 系列模型为代表的语言模型，凭借强大的语义理解能力，能够快速总结论文内容、或者进行精准翻译。这不仅节省了研究者阅读和整理文献的时间，还能帮助他们聚焦于核心问题。

模型的通用性使其能够适应不同学科和复杂文本，从中提炼出清晰的核心观点，为研究工作提速。无论是学者梳理文献、设计研究方案，还是学生快速掌握课程重点，大模型都能显著降低知识获取的难度，减少学科背景的限制。

大语言模型通过减轻文献处理的负担，让研究者将更多精力投入到创新和实践中，是提升学术效率与质量的得力工具。

## 业务需求

论文处理全景图：

<img src="https://cdn.bigmodel.cn/markdown/17316612998021280X1280.PNG?attname=1280X1280.PNG" width="500" />

## 解决方案

### 文献预处理

海量文献通常以 PDF、Word 或 Excel 等格式存储，在使用大模型处理前，需要将其转换为可供模型解析的文本格式，您可以借助平台工具高效完成[文件内容的提取](/cn/guide/tools/file-extract)。

代码示例：

```
from pathlib import Path
from zhipuai import ZhipuAI

client = ZhipuAI(
    api_key="您的API Key",
    base_url="https://open.bigmodel.cn/api/paas/v4"
)

# 用于上传文件
# 格式限制：.PDF .DOCX .DOC .XLS .XLSX .PPT .PPTX .PNG .JPG .JPEG .CSV .PY .TXT .MD .BMP .GIF
# 文件大小不超过 50M，图片大小不超过 5M、总数限制为 100 个文件
file_object = client.files.create(file=Path("本地文件地址"), purpose="file-extract")

# 文件内容抽取
file_content = client.files.content(file_id=file_object.id).content.decode()
print(file_content)
```

### LLM内容处理

将文件内容自动化提取并结合大语言模型进行批量分析或任务处理，适用于文档总结、信息提取等场景。

代码示例：

```
from pathlib import Path
import json
import os
from concurrent.futures import ThreadPoolExecutor

def process_file(file_path):
    try:
        # 创建文件对象
        file_object = client.files.create(file=Path(file_path), purpose="file-extract")

        # 获取文本内容
        file_content = json.loads(client.files.content(file_id=file_object.id).content)["content"]
        
        message_content = (
            #更换提示词
            "在这里更换对应任务的提示词"
            f"{file_content}"

        )
        response = client.chat.completions.create(
            model="glm-4-plus",
            messages=[
                {"role": "user", "content": message_content}
            ],
        )
        print("file_path :" + file_path + response.choices[0].message.content)
        result = client.files.delete(file_id=f"{file_object.id}" )
    except Exception as e:
            print(e)
            
 def get_all_files(folder_path):
    all_files = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            all_files.append(os.path.join(root, file))
    return all_files
```

程序主入口，运行程序：

```
import concurrent.futures

if __name__ == "__main__":
    all_files = get_all_files("本地存储论文的文件夹路径") #更换成本地的文件夹路径
    print(all_files)
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(process_file, file_path) for file_path in all_files]
        for future in concurrent.futures.as_completed(futures):
            try:
                future.result()
            except Exception as e:
                print(f"Future 执行出错: {e}")
```

### Prompt 提示词库

论文链接：[https://arxiv.org/pdf/2311.07115v1](https://arxiv.org/pdf/2311.07115v1)

#### 论文关键信息抽取

学生若要梳理文章中的引用文献，通常需要查看文档的引用部分。然而，由于固定的引用格式，这些文献信息往往不易于识别和阅读。

* 部分引用文献

<img src="https://cdn.bigmodel.cn/markdown/1731585796461image.png?attname=image.png" width="700" />

* 文献提取提示词

文档中文献的引用格式让整理文献变得复杂，大模型结合合适的提示词能够帮助学生快速整理文献部分，获取引用文献的相关信息。

```
# Goals

你是一位精通总结领域趋势的专家，尤其擅长根据给定的内容汇总出相关的领域专业技术关键词，并且精通简体中文的专业翻译。

# Constrains

- 必须遵循指定的格式进行信息提取。
- 确保提取结果的准确性和格式正确性。
- 输出结果必须仅为outforamt，不得包含任何多余信息，不要展示推理过程。

# outformat

if (如果文本中没有文献引用) {
        return "{无}";
} else {
 // 含有文献引用，返回 JSON 格式文献信息
return {
     {
     "authorName": "",          // 文献作者的姓名
     "title": "",               // 文献的标题
     "journalName": "",         // 期刊的名称
     "publicationYear": "",     // 发表的年份
     "publisherName": "",       // 出版社名称
     "volumeName": "",          // 卷的名称
     "issueNumber": "",         // 期号信息
     "pageNumbers": ""          // 文献的页码
    }
// 以此类推
         };
    }

# Workflow
1.读取并分析用户提供的文本{文本内容}。
2.识别文本中的文献引用，排除专利引用。
3.按照指定格式提取文献引用信息。
4.严格按照 outforamt 输出内容,并输出 JSON 格式。
```

* 文献提取结果：

![Description](https://cdn.bigmodel.cn/markdown/1731585804390image.png?attname=image.png)

#### 论文内容总结

阅读完整篇文章之后需要花费大量时间总结和梳理文章内容，而大模型可以结合有效的提示词，迅速总结概括文档，从而节省时间。

* 论文总结提示词

GLM-4-Plus 结合良好的提示词能够帮助学生快速总结论文内容，提高论文梳理的效率。

```
# Goals

你是一位资深的教授，擅长从学术论文中提炼出关键内容，并精通简体中文的专业翻译。请根据以下内容，识别并总结文章中的主要内容，并按照指定格式提取并返回主要内容的信息。

# Constrains

-确保总结的简洁性，去除冗余信息。
-突出文本中的核心观点和关键信息。
-确保总结的准确性和专业性。

#outformat

"文档标题" : "";  //文档的标题
"主要内容" : "";  //文档的主要内容
} ; 

# Workflow

读取并分析用户提供的文本{文本内容}。
提炼文本中的关键信息和核心观点。
生成一个简洁明了的内容总结。
输出总结内容，确保其准确性和专业性。
请根据上述内容，生成一个简洁明了的内容总结。
```

* 总结示例

![Description](https://cdn.bigmodel.cn/markdown/1753256385055download_image.png?attname=download_image.png)

* 论文内容总结结果示例：

```
{
  "文档标题": GEN-Z: GENERATIVE ZERO-SHOT TEXT CLASSIFICATION WITH CONTEXTUALIZED LABEL DESCRIPTIONS,
  "主要内容": GEN-Z 是一个生成式提示框架，用于零样本文本分类。它通过自然语言描述的标签来衡量语言模型生成输入文本的可能性。该框架是多变量的，因为标签描述允许我们将关于标签的附加上下文信息无缝集成到任务中，以提高任务性能。在多个标准分类基准测试中，使用六个开源语言模型家族，我们发现对评估集数据源的简单上下文化始终优于零样本和少样本基线，同时提高了对提示变化的鲁棒性。此外，我们的方法通过在标签描述中包含作者、主题或读者信息，以零样本方式实现了分类的个性化。
}
```

#### 论文内容翻译

学生在阅读文献时，由于语言差异，常常需要依赖翻译工具。然而，而且现在市面上的翻译软件由于字数限制不能直接对整篇文章进行处理，大模型可以弥补这一不足，帮你更快更好地理解原文，让你高效掌握论文核心内容。

* 论文内容翻译提示词

GLM 结合良好的提示词能够帮助学生快速翻译论文内容，提高论文阅读效率。

```
# Goal

你是一位精通翻译的专业人士，擅长将学术论文从一种语言翻译成另一种语言，同时保留原文的专业性和技术细节。请根据以下内容，识别并翻译论文中的内容，并按照指定格式提取并返回翻译后的内容。

#Constrains

-确保翻译的准确性，保留原文的语义和风格。
-确保翻译的专业性，避免歧义和误解。

#outformat

"文档原文":"";  
"翻译结果":"";  

#Workflow

读取并分析用户提供的文本{文本内容}。
将文本翻译成指定的目标语言。
输出翻译后的文本内容。
输出结果必须仅为outformat，不得包含任何多余信息，不要展示推理过程。
```

* 翻译示例

翻译结果示例：

```
"文档原文":"Language models, trained only on raw text, have been shown to perform new tasks simply by conditioning on a handful of demonstrations (Brown et al., 2020). However, how language models acquire this ability, known as in-context learning (ICL), is a subject of debate (Xie et al., 2022; Ahuja et al., 2023; Hahn & Goyal, 2023; Zhang et al., 2023; von Oswald et al., 2023; Wang et al., 2023) with several studies suggesting that it merely serves as a way to prime the model with the domain, concepts, or topics and the format of the target task (Min et al., 2022b; Wang et al., 2023). Furthermore, ICL has been shown to be very sensitive to the choice of training examples, their order and format in the prompt (Lu et al., 2022; Sorensen et al., 2022) requiring major human effort to achieve optimal performance. In this work, we ask, “If the right demonstrations are challenging to find and only serve to implicitly prime the model, can we achieve the same performance zero-shot if we prime the language model explicitly in a robust way?” We introduce GEN-Z, a robust zero-shot generative prompting framework for text classification (Figure 1) which achieves results on par with in-context learning with much better stability in performance. ";

"翻译结果":"仅接受原始文本训练的语言模型已被证明可以通过简单地根据少量演示进行条件化来执行新任务（Brown等人，2020年）。然而，语言模型如何获得这种被称为上下文学习（ICL）的能力，这是一个有争议的话题（Xie等人，2022年；Ahuja等人，2023年；Hahn和Goyal，2023年；Zhang等人，2023年；von Oswald等人，2023年；Wang等人，2023年），一些研究表明，它仅仅作为一种用领域、概念或主题以及目标任务的格式来启动模型的方式（Min等人，2022b；Wang等人，2023年）。此外，ICL已被证明对训练示例的选择、它们在提示中的顺序和格式非常敏感（Lu等人，2022年；Sorensen等人，2022年），需要大量的人工工作才能达到最佳性能。在这项工作中，我们问道：“如果难以找到正确的演示，而它们仅仅用来隐含地启动模型，那么我们能否通过以稳健的方式显式启动语言模型来实现相同的零样本性能？”我们介绍了GEN-Z，这是一个用于文本分类的稳健的零样本生成提示框架（图1），它实现了与上下文学习相当的结果，同时具有更好的性能稳定性。我们的方法包括两个关键思想。";
```

#### 论文内容扩写润色

我们可以继续将论文内容转化为社交媒体的科普内容，将复杂学术知识普及化。这不仅仅是简单的翻译，而是需要将那些充满术语和专业词汇的学术语言，转换成普通大众能够轻松理解、并且感兴趣的表达方式。

* 论文总结内容润色提示词

精心设计的润色提示词可以根据特定场景进行调整，以便生成与特定平台风格相匹配的多样化润色结果。这里是针对小红书的使用场景，调整提示词以匹配其特有的口语化、轻松愉快的氛围，从而将论文中的结论部分润色成适合在小红书上分享的生活化内容。

```
#Goal

作为一位小红书科普账号的编辑，你的目标是准确地对学术论文的总结部分进行润色，确保润色后的内容更加简洁、连贯和准确，同时增强趣味性，以吸引更多读者并提升科普内容的可读性。

#Constraints

-识别并突出文章中的关键信息，确保内容简洁明了。
-使用生动的比喻和形象的例子，使复杂的概念更容易理解。
-引入有趣的事实和趣闻，增加读者的兴趣。
-确保语言表达生动有趣，同时保持专业性和准确度。
-适当使用标题和emoji等元素，以吸引读者的注意力。

#outformat

// 增强语言的正式性和专业性，同时保持小红书特有的口语化和亲民风格。
“summary”: “”, // 总结部分的润色内容，并翻译成中文，增加趣味性元素，如比喻、故事化描述等，以吸引读者并提高内容的吸引力。
 } };

#Workflow

读取并分析用户提供的文本{文本内容}。 对文本进行语言优化和润色，以提高表达的清晰度和专业性，同时适应小红书的平台风格和目标受众。 增加趣味性元素，如比喻、故事化描述等，以吸引读者并提高内容的吸引力。 输出润色后的文本内容。
```

#### 润色示例

通过精心设计的润色提示词，我们能够确定不同的润色风格，从而生成多样化的润色结果。在这里，我们将论文中的结论部分稍加润色，使之更易于在社媒上分享，转化为贴近生活的帖子，让复杂的学术知识以通俗易懂的方式呈现，吸引更多普通大众的关注和兴趣。

论文中结果部分：

<img src="https://cdn.bigmodel.cn/markdown/1731586043966image.png?attname=image.png" width="700" />

润色后结果展示：

```
**社媒科普风格总结**

标题 ： 你有没有想过，人工智能也能像人类一样进行阅读理解？

🌟 GEN-Z 就是这样一款神奇的 AI 框架，它能够理解文本内容并进行分类，就像一个聪明的阅读理解助手！📚

GEN-Z 的厉害之处在于，它不需要像传统 AI 那样进行大量训练，只需要给它一些标签描述，它就能自动理解并分类文本。🤯

而且，GEN-Z 还能够根据不同的情境进行个性化分类，比如根据作者的性别、年龄或者读者的文化背景来进行判断。🎯

这项技术未来可以应用在许多领域，比如情感分析、主题分类、垃圾邮件过滤等等。🚀

让我们一起期待，GEN-Z 带来的更多惊喜吧！🎉

#人工智能 #深度学习 #计算机
```

## 方案亮点

* 高效处理文献：降低信息筛选成本，聚焦核心研究
* 优化成果表达：提升学术文本的专业性与可读性
* 助力学术传播：提升成果的认可度与影响力


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt