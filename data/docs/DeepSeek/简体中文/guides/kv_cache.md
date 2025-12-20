# 上下文硬盘缓存

本页总览

# 上下文硬盘缓存

DeepSeek API [上下文硬盘缓存技术](</zh-cn/news/news0802>)对所有用户默认开启，用户无需修改代码即可享用。

用户的每一个请求都会触发硬盘缓存的构建。若后续请求与之前的请求在前缀上存在重复，则重复部分只需要从缓存中拉取，计入“缓存命中”。

注意：两个请求间，只有重复的**前缀** 部分才能触发“缓存命中”，详间下面的例子。

* * *

### 例一：长文本问答​

**第一次请求**
    
    
    messages: [  
        {"role": "system", "content": "你是一位资深的财报分析师..."}  
        {"role": "user", "content": "<财报内容>\n\n请总结一下这份财报的关键信息。"}  
    ]  
    

**第二次请求**
    
    
    messages: [  
        {"role": "system", "content": "你是一位资深的财报分析师..."}  
        {"role": "user", "content": "<财报内容>\n\n请分析一下这份财报的盈利情况。"}  
    ]  
    

在上例中，两次请求都有相同的**前缀** ，即 `system` 消息 + `user` 消息中的 `<财报内容>`。在第二次请求时，这部分前缀会计入“缓存命中”。

* * *

### 例二：多轮对话​

**第一次请求**
    
    
    messages: [  
        {"role": "system", "content": "你是一位乐于助人的助手"},  
        {"role": "user", "content": "中国的首都是哪里？"}  
    ]  
    

**第二次请求**
    
    
    messages: [  
        {"role": "system", "content": "你是一位乐于助人的助手"},  
        {"role": "user", "content": "中国的首都是哪里？"},  
        {"role": "assistant", "content": "中国的首都是北京。"},  
        {"role": "user", "content": "美国的首都是哪里？"}  
    ]  
    

在上例中，第二次请求可以复用第一次请求**开头** 的 `system` 消息和 `user` 消息，这部分会计入“缓存命中”。

* * *

### 例三：使用 Few-shot 学习​

在实际应用中，用户可以通过 Few-shot 学习的方式，来提升模型的输出效果。所谓 Few-shot 学习，是指在请求中提供一些示例，让模型学习到特定的模式。由于 Few-shot 一般提供相同的上下文前缀，在硬盘缓存的加持下，Few-shot 的费用显著降低。

**第一次请求**
    
    
    messages: [      
            {"role": "system", "content": "你是一位历史学专家，用户将提供一系列问题，你的回答应当简明扼要，并以`Answer:`开头"},  
            {"role": "user", "content": "请问秦始皇统一六国是在哪一年？"},  
            {"role": "assistant", "content": "Answer:公元前221年"},  
            {"role": "user", "content": "请问汉朝的建立者是谁？"},  
            {"role": "assistant", "content": "Answer:刘邦"},  
            {"role": "user", "content": "请问唐朝最后一任皇帝是谁"},  
            {"role": "assistant", "content": "Answer:李柷"},  
            {"role": "user", "content": "请问明朝的开国皇帝是谁？"},  
            {"role": "assistant", "content": "Answer:朱元璋"},  
            {"role": "user", "content": "请问清朝的开国皇帝是谁？"}  
    ]  
    

**第二次请求**
    
    
    messages: [      
            {"role": "system", "content": "你是一位历史学专家，用户将提供一系列问题，你的回答应当简明扼要，并以`Answer:`开头"},  
            {"role": "user", "content": "请问秦始皇统一六国是在哪一年？"},  
            {"role": "assistant", "content": "Answer:公元前221年"},  
            {"role": "user", "content": "请问汉朝的建立者是谁？"},  
            {"role": "assistant", "content": "Answer:刘邦"},  
            {"role": "user", "content": "请问唐朝最后一任皇帝是谁"},  
            {"role": "assistant", "content": "Answer:李柷"},  
            {"role": "user", "content": "请问明朝的开国皇帝是谁？"},  
            {"role": "assistant", "content": "Answer:朱元璋"},  
            {"role": "user", "content": "请问商朝是什么时候灭亡的"},          
    ]  
    

在上例中，使用了 4-shots。两次请求只有最后一个问题不一样，第二次请求可以复用第一次请求中前 4 轮对话的内容，这部分会计入“缓存命中”。

* * *

## 查看缓存命中情况​

在 DeepSeek API 的返回中，我们在 `usage` 字段中增加了两个字段，来反映请求的缓存命中情况：

  1. `prompt_cache_hit_tokens`：本次请求的输入中，缓存命中的 tokens 数（0.1 元 / 百万 tokens）

  2. `prompt_cache_miss_tokens`：本次请求的输入中，缓存未命中的 tokens 数（1 元 / 百万 tokens）

## 硬盘缓存与输出随机性​

硬盘缓存只匹配到用户输入的前缀部分，输出仍然是通过计算推理得到的，仍然受到 temperature 等参数的影响，从而引入随机性。其输出效果与不使用硬盘缓存相同。

## 其它说明​

  1. 缓存系统以 64 tokens 为一个存储单元，不足 64 tokens 的内容不会被缓存

  2. 缓存系统是“尽力而为”，不保证 100% 缓存命中

  3. 缓存构建耗时为秒级。缓存不再使用后会自动被清空，时间一般为几个小时到几天