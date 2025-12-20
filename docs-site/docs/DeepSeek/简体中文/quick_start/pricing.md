# 模型 & 价格

本页总览  
  
# 模型 & 价格

下表所列模型价格以“百万 tokens”为单位。Token 是模型用来表示自然语言文本的的最小单位，可以是一个词、一个数字或一个标点符号等。我们将根据模型输入和输出的总 token 数进行计量计费。

* * *

## 模型细节​

**模型|  deepseek-chat| deepseek-reasoner  
---|---|---  
BASE URL| <https://api.deepseek.com>  
模型版本| DeepSeek-V3.2  
（非思考模式）| DeepSeek-V3.2  
（思考模式）  
上下文长度| 128K  
输出长度| 默认 4K，最大 8K| 默认 32K，最大 64K  
功能| [Json Output](</zh-cn/guides/json_mode>)| 支持| 支持  
[Tool Calls](</zh-cn/guides/tool_calls>)| 支持| 支持  
[对话前缀续写（Beta）](</zh-cn/guides/chat_prefix_completion>)| 支持| 支持  
[FIM 补全（Beta）](</zh-cn/guides/fim_completion>)| 支持| 不支持  
价格| 百万tokens输入（缓存命中）| 0.2元  
百万tokens输入（缓存未命中）| 2元  
百万tokens输出| 3元  
**

* * *

## 扣费规则​

扣减费用 = token 消耗量 × 模型单价，对应的费用将直接从充值余额或赠送余额中进行扣减。 当充值余额与赠送余额同时存在时，优先扣减赠送余额。

产品价格可能发生变动，DeepSeek 保留修改价格的权利。请您依据实际用量按需充值，定期查看此页面以获知最新价格信息。