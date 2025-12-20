# 知识库问题

> 知识库问题解答

#### 调用模型API接口时，如何让模型根据自己的知识库回答问题?

您可以参考文档：[知识库检索](/cn/guide/tools/retrieval)

#### 调用模型API接口时，可以让模型访问自己本地的知识库吗？

不可以，需要您将本地知识内容上传到[官网线上知识库](https://www.bigmodel.cn/console/appcenter_v1/knowledge)，然后调用模型API接口时，传参知识库id即可，具体可参考：[知识库检索](/cn/guide/tools/retrieval)

#### 调用对话API接口时，使用了知识库工具，但模型返回结果为啥还是不符合预期？

原因可能是：

* 传参的知识库id检查是否正确，不要传文档id；
* prompt\_template参数中的\{\{knowledge}}、\{\{question}}不能去除；
* 上传的知识库内容与用户问题不匹配，或模型识别效果不好，建议参考帮助文档进行下文档切片调优：[【帮助文档】智谱清流-知识库](https://zhipu-ai.feishu.cn/wiki/Yinnw0d9Yi7EMukiyZlcziv1n05)
* 如还未解决可联系人工客服

#### 有没有知识库功能的接口文档？

有的，知识库功能的接口文档请参考：[知识库接口文档](/api-reference/%E7%9F%A5%E8%AF%86%E5%BA%93-api/%E8%8E%B7%E5%8F%96%E4%B8%AA%E4%BA%BA%E7%9F%A5%E8%AF%86%E5%BA%93%E5%88%97%E8%A1%A8)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt