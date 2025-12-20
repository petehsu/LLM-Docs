# 模型部署

## 概述

<Info>
  私有实例部署（Private Instance Deployment）是指将大模型在专属的计算资源上进行独立部署，以满足企业对数据安全、性能隔离、个性化定制和资源可控性的需求。
</Info>

### 什么是私有模型部署？

与共享公共模型服务不同，私有实例部署为客户提供了专属的运行环境和服务能力，确保模型调用不会受到其他用户的干扰，同时支持更灵活的配置与扩展。

<CardGroup cols={2}>
  <Card title="独享算力" icon={<svg style={{maskImage: "url(/resource/icon/cubes.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    专属 GPU/CPU 资源，避免多租户带来的性能抖动
  </Card>

  <Card title="可控访问" icon={<svg style={{maskImage: "url(/resource/icon/shield.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    结合 VPC、内网、白名单等安全策略，保障数据传输安全
  </Card>

  <Card title="可定制化" icon={<svg style={{maskImage: "url(/resource/icon/function.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    支持模型参数、微调版本、推理配置等定制化需求
  </Card>

  <Card title="高可用与扩展性" icon={<svg style={{maskImage: "url(/resource/icon/gauge-high.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    支持水平扩展、负载均衡及容灾部署，保障高并发与稳定性
  </Card>
</CardGroup>

### 何时使用私有实例部署？

模型私有实例部署通常适用于以下场景：

* **高安全性要求的业务场景：** 例如金融、医疗、政企等对数据合规与隐私保护要求严格的行业
* **大规模并发调用：** 当业务需要大规模、高频次调用时，私有实例能提供更稳定的吞吐能力
* **性能隔离需求：** 确保关键业务调用不受其他用户的影响，保障 SLA
* **个性化模型定制：** 如需要长期运行经过专属数据微调的模型，并保证其仅对特定应用服务
* **成本可控与长期使用：** 适合有长期稳定需求的客户，相比公有实例调用可优化成本结构

### 哪些模型可以私有实例部署？

当前支持部署的模型包括：

* **智谱官方模型：** GLM-4.5-Air、GLM-4-Plus、GLM-4-0520、GLM-4-Air、GLM-4-Flash 等
* **微调后的模型：** 基于客户数据完成微调后的专属模型

## 如何进行部署

### 1. 模型部署入口

在[私有实例](https://open.bigmodel.cn/console/modelcenter/deploy)页面点击"创建部署任务"按钮，选择要部署的基础模型/微调模型。

![image1](https://cdn.bigmodel.cn/markdown/1757387836297image.png?attname=image.png)

![image2](https://cdn.bigmodel.cn/markdown/1757387874461image.png?attname=image.png)

<Tip>
  你可以根据实际使用场景的并发需求选择部署实例的数量。实例部署需要一定时间（通常为10-30分钟，具体取决于模型大小）。我们会在部署完成后通过短信通知你。
</Tip>

新部署的模型的模型编码、状态及实例信息可在[私有实例](https://open.bigmodel.cn/console/modelcenter/deploy)页面或[模型广场](https://open.bigmodel.cn/console/modelcenter/square)的模型详情页部署信息查看，并支持前往体验中心体验。

![image3](https://cdn.bigmodel.cn/markdown/1757387940882image.png?attname=image.png)

![image4](https://cdn.bigmodel.cn/markdown/1757387949398image.png?attname=image.png)

### 2. 模型实例变更与取消部署

#### 操作实例变更与模型部署取消

您可以在[模型广场](https://open.bigmodel.cn/console/modelcenter/square)的模型详情页或在[私有实例](https://open.bigmodel.cn/console/modelcenter/deploy)页面选择已经部署的模型进行实例数量变更或者取消部署。

<Warning>
  取消部署动作将在操作后立即生效，取消后该部署模型无法再进行调用。
</Warning>

![Description](https://cdn.bigmodel.cn/markdown/1757387974408image.png?attname=image.png)

![Description](https://cdn.bigmodel.cn/markdown/1757387980796image.png?attname=image.png)

### 3. 模型推理

#### 模型编码获取

您可以在[私有实例](https://open.bigmodel.cn/console/modelcenter/deploy)页面直接复制模型编码。

![Description](https://cdn.bigmodel.cn/markdown/1757388009536image.png?attname=image.png)

#### 模型调用

你可以通过体验中心或 API 使用模型。在进行 API 请求时，你可以将你命名的新的模型代码作为 `model` 参数的值传递。

## 调用示例

### 安装 SDK

```bash  theme={null}
# 安装最新版本
pip install zai-sdk

# 或指定版本
pip install zai-sdk==0.1.0
```

### 验证安装

```python  theme={null}
import zai
print(zai.__version__)
```

### 使用示例

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

## 部署计费说明

<CardGroup cols={1}>
  <Card title="计费规则" icon={<svg style={{maskImage: "url(/resource/icon/coins.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"}/>}>
    * **首次部署：** 实时扣减算力单元额度，后续每日凌晨扣减当日所需消耗算力单元<br />
    * **示例：** A模型部署1个实例，单实例算力单元2。今日下午16:30部署一个实例成功，则部署成功后扣减2个算力单元。次日起，每日凌晨扣减2个算力单元<br />
    * **取消部署：** 选择取消/减少实例时，次日起不再扣减对应实例的算力单元
  </Card>
</CardGroup>

## 常见问题

**Q：我应该在哪里查看资源包余额？**

A：【[资源包管理](https://bigmodel.cn/finance-center/resource-package/package-mgmt)】-【我的资源包】中查看我的资源包余额。

**Q：我应该去哪查询账单？**

A：在【[财务总览](https://bigmodel.cn/finance-center/finance/overview)】中查看全部账单记录。

**Q：部署已完成，在哪里添加 API Key？**

A：您可前往【[API KEY](https://bigmodel.cn/usercenter/proj-mgmt/apikeys)】页面可创建并管理您的 API Key。

**Q：我是云私用户，已经购买了套餐，订单应该在哪里查看？**

A：【[订单明细](https://bigmodel.cn/finance-center/bill/order/list)】-【云私订单明细】中查看已购套餐订单。


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt