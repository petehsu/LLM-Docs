# 内容安全

> 了解智谱AI的内容安全审核机制，确保AI应用的安全可控和合规使用

<Info>
  智谱AI 致力于做到人工智能的安全可控、可审计、可监督、可追溯和可信赖。为此，我们内置了安全审核机制，旨在减少模型应用中违法及不良信息的出现。
</Info>

## 安全审核机制

当我们的内置安全审核机制识别到违法及不良信息时，将提供相应的提示信息或进行拦截处置，例如通过输入拦截、输出限制和终止内容生成。

<Warning>
  违法及不良信息包括但不限于：违反法律法规、危害国家安全、恶意营销、涉黄、谩骂、暴恐违禁以及其它不良内容。
</Warning>

## 模型同步响应

当 API 检测到模型输入或输出内容中含有违法及不良信息时，系统会向开发者返回错误码（1301）、输入（role = user）或输出（role = assistant）、严重程度（level 0-3，level 0 表示最严重，3 表示轻微），不再同步生成结果。

<Note>
  建议开发者采取措施，对用户进行正面引导，以确保内容的合规性和适当性。
</Note>

### 返回示例

<CodeGroup>
  ```json 错误响应示例 theme={null}
  {
    "contentFilter": [
      {
        "level": 1,
        "role": "user"
      }
    ],
    "error": {
      "code": "1301",
      "message": "系统检测到输入或生成内容可能包含不安全或敏感内容，请您避免输入易产生敏感内容的提示语，感谢您的配合。"
    }
  }
  ```
</CodeGroup>

## 模型流式响应

在模型流式输出生成内容的过程中，我们会分批对模型生成内容进行检测，当检测到违法及不良信息时：

* API 返回错误码（1301）
* API（V4）返回停止词 `"finish_reason":"sensitive"`

<Warning>
  开发者识别到相关信息，应及时采取终止生成、撤回、修改、清屏、重启等措施删除生成内容，并确保不将含有违法及不良信息的内容传递给模型继续生成，避免其造成负面影响。
</Warning>

### 返回示例

<CodeGroup>
  ```python 流式响应示例 theme={null}
  id='202408121950062bfd5bf951d24169', 
  choices=[
    Choice(
      delta=ChoiceDelta(
        content='', 
        role='user', 
        tool_calls=None
      ), 
      finish_reason='sensitive', 
      index=0
    )
  ], 
  created=1723463407, 
  model='glm-4-0520', 
  usage=None, 
  extra_json=None, 
  content_filter=[
    {
      'role': 'user', 
      'level': 1
    }
  ]
  ```
</CodeGroup>

## 终端用户管理

<Tip>
  在请求中发送终端用户ID可以协助平台对终端用户的违规行为、生成违法及不良信息或其他滥用行为进行干预。
</Tip>

当我们检测到您的终端用户存在违规、生成违法及不良信息或其他滥用行为时，平台将会对终端用户请求进行封禁处理，避免您的企业账号因终端用户的违规或滥用行为受到影响。

### 用户ID规范

* ID 是唯一标识终端用户的字符串
* 用户 ID 长度至少为 6 个字符，但不超过 128 个字符
* 您可以通过在 API 请求中上传终端用户 ID

### 请求示例

<CodeGroup>
  ```json API请求示例 theme={null}
  {
    "model": "glm-3-turbo",
    "messages": [
      {
        "role": "user", 
        "content": "作为一名营销专家，请为智谱开放平台创作一个吸引人的slogan"
      },
      {
        "role": "assistant", 
        "content": "当然，为了创作一个吸引人的slogan，请告诉我一些关于您产品的信息"
      },
      {
        "role": "user", 
        "content": "智谱AI 开放平台"
      }
    ],
    "stream": "true",
    "user_id": "user_123456"
  }
  ```
</CodeGroup>

## 安全测试申请

<Warning>
  如果您需要进行安全相关的测试，请联系商务经理、致电（400-6883-991）进行申请，避免您的企业账号出现违规或滥用等问题。
</Warning>

## 违法及不良内容反馈

<Info>
  智谱AI 高度重视生成式人工智能服务的安全性。如果您在开发过程中发现 API 存在任何安全问题，请联系企业微信客服或者致电（400-6883-991）告知我们。我们非常感谢您的贡献和支持。
</Info>

### 联系方式

<CardGroup cols={2}>
  <Card title="企业微信客服" icon={<svg style={{maskImage: "url(/resource/icon/link.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    通过企业微信联系我们的客服团队
  </Card>

  <Card title="客服热线" icon={<svg style={{maskImage: "url(/resource/icon/headset.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    400-6883-991
  </Card>
</CardGroup>

## 模型计费

|  模态 | 计费单位 |      单价     |
| :-: | :--: | :---------: |
|  图片 |   次  |  0.0004 元/次 |
|  文本 |   次  | 0.00012 元/次 |
|  视频 |   秒  |  0.0002 元/秒 |
|  音频 |   秒  | 0.00005 元/秒 |


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt