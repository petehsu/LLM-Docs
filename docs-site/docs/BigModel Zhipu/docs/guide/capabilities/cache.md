# 上下文缓存

<Tip>
  上下文缓存功能通过缓存重复的上下文内容来显著降低 Token 消耗和响应延迟。当您在对话中重复使用相同的系统提示词或历史对话时，缓存机制会自动识别并复用这些内容，从而提升性能并降低成本。
</Tip>

## 功能特性

* **自动缓存识别**：隐式缓存，智能识别重复的上下文内容，无需手动配置
* **显著降低成本**：缓存命中的 Token 按更低价格计费，大幅节省成本
* **提升响应速度**：减少重复内容的处理时间，加快模型响应
* **透明化计费**：详细显示缓存命中的 Token 数量，响应字段 `usage.prompt_tokens_details.cached_tokens`
* **广泛兼容性**：支持所有主流模型，包括 GLM-4.6、GLM-4.5 系列等

> 上下文缓存通过对输入的消息内容进行计算并识别出与之前请求中相同或高度相似的内容。当检测到重复内容时，系统会复用之前的计算结果，从而避免重复计算这些内容所需的 Token。

这种机制特别适用于以下场景：

* 系统提示词复用：在多轮对话中，系统提示词通常保持不变，缓存可以显著降低这部分的 Token 消耗。
* 重复任务：对于一致的指令进行多次处理相似内容的任务，缓存可以提高效率。
* 多轮对话历史：在复杂的对话中，历史消息往往包含大量重复信息，缓存可以有效降低这部分的 Token 使用。

## 代码示例

<Tabs>
  <Tab title="cURL">
    **基础缓存示例**

    ```bash  theme={null}
    # 第一次请求 - 建立缓存
    curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \
    --header 'Authorization: Bearer YOUR_API_KEY' \
    --header 'Content-Type: application/json' \
    --data '{
        "model": "glm-4.6",
        "messages": [
            {
                "role": "system",
                "content": "你是一个专业的数据分析师，擅长解释数据趋势和提供业务洞察。"
            },
            {
                "role": "user",
                "content": "如何分析用户留存率？"
            }
        ]
    }'
    ```

    **复用缓存示例**

    ```bash  theme={null}
    # 第二次请求 - 复用系统提示词缓存
    curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \
    --header 'Authorization: Bearer YOUR_API_KEY' \
    --header 'Content-Type: application/json' \
    --data '{
        "model": "glm-4.6",
        "messages": [
            {
                "role": "system",
                "content": "你是一个专业的数据分析师，擅长解释数据趋势和提供业务洞察。"
            },
            {
                "role": "user",
                "content": "什么是漏斗分析？"
            }
        ]
    }'
    ```
  </Tab>

  <Tab title="Python SDK">
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

    **基础对话示例**

    ```python  theme={null}
    from zai import ZhipuAiClient

    # 初始化客户端
    client = ZhipuAiClient(api_key='您的apikey')

    # 第一次请求 - 建立缓存
    response1 = client.chat.completions.create(
        model="glm-4.6",
        messages=[
            {
                "role": "system",
                "content": "你是一个专业的技术文档助手，擅长解释复杂的技术概念。请用简洁明了的语言回答用户问题，并提供实用的代码示例。"
            },
            {
                "role": "user",
                "content": "什么是 RESTful API？"
            }
        ]
    )

    print("第一次请求结果:")
    print(f"回复: {response1.choices[0].message.content}")
    print(f"总 Token: {response1.usage.total_tokens}")
    print(f"缓存 Token: {response1.usage.prompt_tokens_details.cached_tokens if hasattr(response1.usage, 'prompt_tokens_details') else 0}")

    # 第二次请求 - 复用系统提示词缓存
    response2 = client.chat.completions.create(
        model="glm-4.6",
        messages=[
            {
                "role": "system",
                "content": "你是一个专业的技术文档助手，擅长解释复杂的技术概念。请用简洁明了的语言回答用户问题，并提供实用的代码示例。"  # 相同的系统提示词
            },
            {
                "role": "user",
                "content": "GraphQL 和 RESTful API 有什么区别？"
            }
        ]
    )

    print("\n第二次请求结果:")
    print(f"回复: {response2.choices[0].message.content}")
    print(f"总 Token: {response2.usage.total_tokens}")
    print(f"缓存 Token: {response2.usage.prompt_tokens_details.cached_tokens if hasattr(response2.usage, 'prompt_tokens_details') else 0}")
    ```

    **长文档分析示例**

    ```python  theme={null}
    from zai import ZhipuAiClient

    # 初始化客户端
    client = ZhipuAiClient(api_key='您的apikey')

    # 长文档内容（模拟）
    long_document = """
    这是一份详细的技术规范文档，包含了系统架构、API 设计、数据库结构等多个方面的内容。
    文档内容非常长，包含了大量的技术细节和实现说明...
    [此处省略大量文档内容]
    """

    # 第一次分析 - 建立文档缓存
    response1 = client.chat.completions.create(
        model="glm-4.6",
        messages=[
            {
                "role": "system",
                "content": f"请基于以下技术文档回答用户问题：\n\n{long_document}"
            },
            {
                "role": "user",
                "content": "这个系统的主要架构是什么？"
            }
        ]
    )

    print("第一次分析:")
    print(f"总 Token: {response1.usage.total_tokens}")
    print(f"缓存 Token: {response1.usage.prompt_tokens_details.cached_tokens if hasattr(response1.usage, 'prompt_tokens_details') else 0}")

    # 第二次分析 - 复用文档缓存
    response2 = client.chat.completions.create(
        model="glm-4.6",
        messages=[
            {
                "role": "system",
                "content": f"请基于以下技术文档回答用户问题：\n\n{long_document}"  # 相同的文档内容
            },
            {
                "role": "user",
                "content": "API 设计有哪些特点？"
            }
        ]
    )

    print("\n第二次分析:")
    print(f"总 Token: {response2.usage.total_tokens}")
    print(f"缓存 Token: {response2.usage.prompt_tokens_details.cached_tokens if hasattr(response2.usage, 'prompt_tokens_details') else 0}")
    print(f"缓存节省: {response2.usage.prompt_tokens_details.cached_tokens / response2.usage.total_tokens * 100:.1f}%")
    ```

    **多轮对话缓存示例**

    ```python  theme={null}
    from zai import ZhipuAiClient

    # 初始化客户端
    client = ZhipuAiClient(api_key='您的apikey')

    # 构建对话历史
    conversation_history = [
        {"role": "system", "content": "你是一个 Python 编程助手，帮助用户解决编程问题。"},
        {"role": "user", "content": "如何创建一个简单的 Flask 应用？"},
        {"role": "assistant", "content": "创建 Flask 应用很简单，首先安装 Flask..."},
        {"role": "user", "content": "如何添加路由？"},
        {"role": "assistant", "content": "在 Flask 中添加路由使用 @app.route 装饰器..."},
    ]

    # 继续对话 - 复用历史对话缓存
    response = client.chat.completions.create(
        model="glm-4.6",
        messages=conversation_history + [
            {"role": "user", "content": "如何处理 POST 请求？"}
        ]
    )

    print("对话回复:")
    print(f"内容: {response.choices[0].message.content}")
    print(f"总 Token: {response.usage.total_tokens}")
    print(f"缓存 Token: {response.usage.prompt_tokens_details.cached_tokens if hasattr(response.usage, 'prompt_tokens_details') else 0}")

    # 计算缓存效率
    if hasattr(response.usage, 'prompt_tokens_details') and response.usage.prompt_tokens_details.cached_tokens:
        cache_ratio = response.usage.prompt_tokens_details.cached_tokens / response.usage.prompt_tokens * 100
        print(f"缓存命中率: {cache_ratio:.1f}%")
    ```

    **批量处理优化示例**

    ````python  theme={null}
    from zai import ZhipuAiClient
    import time

    # 初始化客户端
    client = ZhipuAiClient(api_key='您的apikey')

    # 共同的系统提示词
    system_prompt = """
    你是一个专业的代码审查助手。请分析提供的代码，从以下几个方面给出评价：
    1. 代码质量和可读性
    2. 性能优化建议
    3. 安全性考虑
    4. 最佳实践建议
    请提供具体的改进建议。
    """

    # 要审查的代码片段列表
    code_snippets = [
        "def calculate_sum(numbers): return sum(numbers)",
        "class User: def __init__(self, name): self.name = name",
        "for i in range(len(items)): print(items[i])",
        "if user_input == 'yes' or user_input == 'y': return True"
    ]

    results = []
    total_cached_tokens = 0

    for i, code in enumerate(code_snippets):
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="glm-4.6",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"请审查以下代码：\n```python\n{code}\n```"}
            ]
        )
        
        end_time = time.time()
        
        # 统计缓存效果
        cached_tokens = 0
        if hasattr(response.usage, 'prompt_tokens_details') and response.usage.prompt_tokens_details.cached_tokens:
            cached_tokens = response.usage.prompt_tokens_details.cached_tokens
            total_cached_tokens += cached_tokens
        
        results.append({
            'code': code,
            'review': response.choices[0].message.content,
            'total_tokens': response.usage.total_tokens,
            'cached_tokens': cached_tokens,
            'response_time': end_time - start_time
        })
        
        print(f"代码片段 {i+1} 审查完成:")
        print(f"  响应时间: {end_time - start_time:.2f}s")
        print(f"  缓存 Token: {cached_tokens}")
        print(f"  总 Token: {response.usage.total_tokens}")
        print()

    print(f"批量处理完成，总缓存 Token: {total_cached_tokens}")
    ````
  </Tab>
</Tabs>

响应包含上下文缓存的 Token 使用信息：

```json  theme={null}
{
  "usage": {
    "prompt_tokens": 1200,
    "completion_tokens": 300,
    "total_tokens": 1500,
    "prompt_tokens_details": {
      "cached_tokens": 800
    }
  }
}
```

## 最佳实践

<Tabs>
  <Tab title="系统提示词优化">
    使用稳定的系统提示词

    ```python  theme={null}
    # 推荐：使用稳定的系统提示词
    system_prompt = """
    你是一个专业的技术顾问，具有以下特点：
    - 深厚的技术背景和丰富的项目经验
    - 能够提供准确、实用的技术建议
    - 善于用简洁明了的语言解释复杂概念
    请根据用户问题提供专业的技术指导。
    """
    ```
  </Tab>

  <Tab title="文档内容复用">
    将长文档作为系统消息

    ```python  theme={null}
    # 推荐：将长文档作为系统消息
    def create_document_based_chat(document_content, user_question):
        return client.chat.completions.create(
            model="glm-4.6",
            messages=[
                {
                    "role": "system",
                    "content": f"请基于以下文档内容回答用户问题：\n\n{document_content}"
                },
                {
                    "role": "user",
                    "content": user_question
                }
            ]
        )

    # 多次调用相同文档，系统提示词会被缓存
    questions = ["文档的主要内容是什么？", "有哪些关键要点？", "如何实施这些建议？"]
    for question in questions:
        response = create_document_based_chat(document_content, question)
        # 第二次及以后的调用会命中缓存
    ```
  </Tab>

  <Tab title="对话历史管理">
    管理对话历史以提高缓存效率

    ```python  theme={null}
    class ConversationManager:
        def __init__(self, client, system_prompt):
            self.client = client
            self.system_prompt = system_prompt
            self.history = [{"role": "system", "content": system_prompt}]
        
        def add_message(self, role, content):
            self.history.append({"role": role, "content": content})
        
        def get_response(self, user_message):
            # 添加用户消息
            self.add_message("user", user_message)
            
            # 获取回复（历史对话会被缓存）
            response = self.client.chat.completions.create(
                model="glm-4.6",
                messages=self.history
            )
            
            # 添加助手回复到历史
            assistant_message = response.choices[0].message.content
            self.add_message("assistant", assistant_message)
            
            return response
        
        def get_cache_stats(self, response):
            """获取缓存统计"""
            if hasattr(response.usage, 'prompt_tokens_details'):
                cached = response.usage.prompt_tokens_details.cached_tokens or 0
                total = response.usage.prompt_tokens
                return f"缓存命中: {cached}/{total} ({cached/total*100:.1f}%)"
            return "无缓存信息"

    # 使用示例
    manager = ConversationManager(client, "你是一个编程助手...")
    response1 = manager.get_response("如何学习 Python？")
    response2 = manager.get_response("推荐一些学习资源")  # 会复用之前的对话缓存
    ```
  </Tab>
</Tabs>

## 应用场景

<CardGroup cols={2}>
  <Card title="多轮对话" icon={<svg style={{maskImage: "url(/resource/icon/headset.svg)", WebkitMaskImage: "url(/resource/icon/headset.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 智能客服系统
    * 个人助理服务
  </Card>

  <Card title="批量处理" icon={<svg style={{maskImage: "url(/resource/icon/cubes.svg)", WebkitMaskImage: "url(/resource/icon/cubes.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 代码审查批处理
    * 内容批量分析
  </Card>

  <Card title="模板化应用" icon={<svg style={{maskImage: "url(/resource/icon/rectangle-list.svg)", WebkitMaskImage: "url(/resource/icon/rectangle-list.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 报告生成模板
    * 标准化流程处理
  </Card>

  <Card title="教育培训" icon={<svg style={{maskImage: "url(/resource/icon/glasses.svg)", WebkitMaskImage: "url(/resource/icon/glasses.svg)", maskRepeat: "no-repeat", maskPosition: "center center",}} className={"h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"} />}>
    * 作业批改辅助
    * 学习资料解析
  </Card>
</CardGroup>

## 注意事项

<Tabs>
  <Tab title="缓存机制理解">
    * 缓存基于内容相似度自动触发，无需手动配置
    * 完全相同的内容缓存命中率最高
    * 轻微的格式差异可能影响缓存效果
    * 缓存有合理的时效性，过期后会重新计算
  </Tab>

  <Tab title="成本优化建议">
    * 缓存命中的 Token 按更低价格计费
    * 长文档和重复内容的缓存效果最显著
    * 合理设计系统提示词，提高复用率
    * 监控缓存命中率，优化使用模式
  </Tab>

  <Tab title="性能考虑">
    * 缓存可以显著提升响应速度
    * 首次请求建立缓存可能稍慢
    * 合理管理对话历史长度
    * 避免过于频繁的内容变化
  </Tab>

  <Tab title="最佳实践">
    * 使用稳定的系统提示词模板
    * 将长文档作为系统消息处理
    * 合理组织对话历史结构
    * 定期分析缓存效果并优化
  </Tab>
</Tabs>

## 计费说明

上下文缓存采用差异化计费策略：

* 新内容 Token：按标准价格计费
* 缓存命中 Token：按优惠价格计费（通常为标准价格的 50%）
* 输出 Token：按标准价格计费

计费示例：

```
假设标准价格为 0.01 元/1K Token：

请求详情：
- 总输入 Token：2000
- 缓存命中 Token：1200
- 新内容 Token：800
- 输出 Token：500

计费计算：
- 新内容费用：800 × 0.01/1000 = 0.008 元
- 缓存费用：1200 × 0.005/1000 = 0.006 元
- 输出费用：500 × 0.01/1000 = 0.005 元
- 总费用：0.019 元

相比无缓存（2500 × 0.01/1000 = 0.025 元），节省 24%
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt