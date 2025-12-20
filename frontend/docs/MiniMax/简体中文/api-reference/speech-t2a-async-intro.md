# 异步长文本语音生成（T2A Async）

> 该 API 支持基于文本到语音的异步生成，单次文本生成传输最大支持 100 万字符，生成的完整音频结果支持异步的方式进行检索。

该接口支持以下功能：

1. 支持 100+系统音色、复刻音色自主选择；
2. 支持语调、语速、音量、比特率、采样率、输出格式自主调整；
3. 支持音频时长、音频大小等返回参数；
4. 支持时间戳（字幕）返回，精确到句；
5. 支持直接传入字符串与上传文本文件 file\_id 两种方式进行待合成文本的输入；
6. 支持非法字符检测：非法字符不超过 10%（包含 10%），音频会正常生成并返回非法字符占比；非法字符超过 10%，接口不返回结果（返回报错码），请检测后再次进行请求【非法字符定义：ascii 码中的控制符（不含制表符和换行符）】。

提交长文本语音合成请求后，会生成 file\_id，生成任务完成后，可通过 file\_id 使用文件检索接口进行下载。

⚠️ 注意：返回的 url 的有效期为：自 url 返回开始的**9 个小时**（即 32400 秒），超过有效期后 url 便会失效，生成的信息便会丢失，请注意下载信息的时间。

**适用场景：整本书籍等长文本的语音生成。**

## 支持模型

以下为 MiniMax 提供的语音模型及其特性说明。

| 模型               | 特性                                 |
| :--------------- | :--------------------------------- |
| speech-2.6-hd    | 最新的 HD 模型，韵律表现出色，极致音质与韵律表现，生成更快更自然 |
| speech-2.6-turbo | 最新的 Turbo 模型，音质优异，超低时延，响应更灵敏       |
| speech-02-hd     | 拥有出色的韵律、稳定性和复刻相似度，音质表现突出           |
| speech-02-turbo  | 拥有出色的韵律和稳定性，小语种能力加强，性能表现出色         |

## 接口说明

整体包含 2 个 API：创建**语音生成任务**、**查询语音生成任务状态**。使用步骤如下：

1. 创建语音生成任务得到 task\_id（如果选择以 file\_id 的形式传入待合成文本，需要前置使用 File(Upload)接口进行文件上传）；
2. 基于 taskid 查询语音生成任务状态；
3. 如果发现任务生成成功，那么可以使用本接口返回的 file\_id 通过 File API 进行结果查看和下载。

## 支持语言

MiniMax 的语音合成模型具备卓越的跨语言能力，全面支持 40 种全球广泛使用的语言。我们致力于打破语言壁垒，构建真正意义上的全球通用人工智能模型。

目前支持的语言包含：

| 支持语种                |                      |                       |
| :------------------ | :------------------- | :-------------------- |
| 1. 中文（Chinese）      | 15. 土耳其语（Turkish）    | 28. 马来语（Malay）        |
| 2. 粤语（Cantonese）    | 16. 荷兰语（Dutch）       | 29. 波斯语（Persian）      |
| 3. 英语（English）      | 17. 乌克兰语（Ukrainian）  | 30. 斯洛伐克语（Slovak）     |
| 4. 西班牙语（Spanish）    | 18. 泰语（Thai）         | 31. 瑞典语（Swedish）      |
| 5. 法语（French）       | 19. 波兰语（Polish）      | 32. 克罗地亚语（Croatian）   |
| 6. 俄语（Russian）      | 20. 罗马尼亚语（Romanian）  | 33. 菲律宾语（Filipino）    |
| 7. 德语（German）       | 21. 希腊语（Greek）       | 34. 匈牙利语（Hungarian）   |
| 8. 葡萄牙语（Portuguese） | 22. 捷克语（Czech）       | 35. 挪威语（Norwegian）    |
| 9. 阿拉伯语（Arabic）     | 23. 芬兰语（Finnish）     | 36. 斯洛文尼亚语（Slovenian） |
| 10. 意大利语（Italian）   | 24. 印地语（Hindi）       | 37. 加泰罗尼亚语（Catalan）   |
| 11. 日语（Japanese）    | 25. 保加利亚语（Bulgarian） | 38. 尼诺斯克语（Nynorsk）    |
| 12. 韩语（Korean）      | 26. 丹麦语（Danish）      | 39. 泰米尔语（Tamil）       |
| 13. 印尼语（Indonesian） | 27. 希伯来语（Hebrew）     | 40. 阿非利卡语（Afrikaans）  |
| 14. 越南语（Vietnamese） |                      |                       |

## 官方 MCP

MiniMax 提供官方的 [Python 版本](https://github.com/MiniMax-AI/MiniMax-MCP) 和 [JavaScript 版本](https://github.com/MiniMax-AI/MiniMax-MCP-JS) 模型上下文协议（MCP）服务器实现代码，支持语音合成功能，详细说明请参考 [MiniMax MCP 使用指南](/guides/mcp-guide)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt