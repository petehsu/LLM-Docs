# 常见问题

> 查找关于 MegaLLM 的常见问题解答 - 连接 70+ 模型的通用 AI 平台。

## 常规问题

<AccordionGroup>
  <Accordion title="什么是 MegaLLM?">
    MegaLLM 是一个通用 AI 平台,通过单一 API 连接来自 OpenAI、Anthropic 和 Google 等领先提供商的 70+ 大语言模型。可以将其视为您的 AI "超级 API" - 无需分别与多个提供商集成,您可以通过一个统一接口访问所有模型。
  </Accordion>

  <Accordion title="MegaLLM 支持多少个模型?">
    我们目前支持 70+ 个模型,包括:

    * **OpenAI**: gpt-5, gpt-4.1, gpt-4o, gpt-3.5-turbo
    * **Anthropic**: claude-opus-4-1-20250805, claude-sonnet-4, claude-3.5-sonnet, claude-3.7-sonnet
    * **Google**: gemini-2.5-pro, gemini-2.0-flash-001
    * **嵌入模型**: 各种文本嵌入选项

    新模型会随着它们的发布定期添加。
  </Accordion>

  <Accordion title="我可以即时切换模型吗?">
    可以!切换模型就像在 API 调用中更改一个参数一样简单。您还可以在模型之间设置自动故障转移。

    ```python  theme={null}
    # 即时切换模型
    response = client.chat.completions.create(
        model="gpt-5",  # 将此更改为任何支持的模型 ID
        messages=[{"role": "user", "content": "你好!"}]
    )
    ```
  </Accordion>

  <Accordion title="我需要为每个 AI 提供商单独设置账户吗?">
    不需要!这就是 MegaLLM 的优势所在。您只需要一个 MegaLLM 账户即可访问所有 70+ 个模型。我们处理管理多个提供商关系的复杂性,因此您不必这样做。
  </Accordion>
</AccordionGroup>

## 平台功能

<AccordionGroup>
  <Accordion title="MegaLLM 与直接使用提供商有什么不同?">
    MegaLLM 提供了几个独特的优势:

    1. **一个 API 访问所有**: 通过单一、一致的接口访问 70+ 个模型
    2. **自动故障转移**: 如果一个模型失败,自动切换到另一个
    3. **统一计费**: 所有 AI 使用的单一账单
    4. **性能优化**: 智能路由和负载均衡
    5. **成本管理**: 优化不同模型的支出
  </Accordion>

  <Accordion title="自动故障转移是如何工作的?">
    当您配置故障转移模型时,如果主模型遇到以下问题,MegaLLM 会自动将您的请求路由到备用模型:

    * 速率限制
    * 临时故障
    * 超时错误
    * 容量限制

    这确保您的应用程序不会因单个模型故障而停机。

    ```python  theme={null}
    response = client.chat.completions.create(
        model="gpt-5",
        messages=messages,
        fallback_models=["claude-opus-4-1-20250805", "gemini-2.5-pro"]
    )
    ```
  </Accordion>
</AccordionGroup>

## 定价和计费

<AccordionGroup>
  <Accordion title="定价是如何运作的?">
    您根据实际的令牌使用量付费,就像使用单个提供商一样。但是,MegaLLM 提供了几个优势:

    * **统一计费**: 所有模型的单一账单
    * **批量折扣**: 高使用量获得更优惠的费率
    * **成本优化**: 最小化支出的工具
    * **透明定价**: 按模型清晰的成本明细

    查看我们的[模型页面](/cn/home/models)了解详细的定价信息。
  </Accordion>

  <Accordion title="MegaLLM 比直接使用提供商更贵吗?">
    对于大多数用户来说,MegaLLM 提供更好的价值,因为:

    1. **批量定价**: 我们将批量折扣传递给客户
    2. **降低开发成本**: 无需与多个 API 集成
    3. **运营节省**: 更少的监控,更少的速率限制问题
    4. **故障转移优势**: 更高的正常运行时间意味着更少的收入损失

    此外,您还节省了大量的工程时间,因为不必管理多个提供商集成。
  </Accordion>

  <Accordion title="我可以设置支出限制吗?">
    可以!MegaLLM 提供全面的成本控制:

    * 每日/每月支出限制
    * 按模型预算分配
    * 使用警报和通知
    * 成本优化建议
    * 达到限制时自动故障转移到更便宜的模型
  </Accordion>
</AccordionGroup>

## 技术集成

<AccordionGroup>
  <Accordion title="MegaLLM 与现有的 OpenAI 代码兼容吗?">
    是的!MegaLLM 与 OpenAI 的 API 格式完全兼容。迁移通常只需更改基础 URL:

    ```python  theme={null}
    # 之前 (OpenAI)
    client = OpenAI(api_key="sk-...")

    # 之后 (MegaLLM)
    client = OpenAI(
        base_url="https://ai.megallm.io/v1",
        api_key="your-megallm-key"
    )
    ```

    您所有现有的代码都可以继续运行,无需更改。
  </Accordion>

  <Accordion title="Anthropic 兼容性如何?">
    我们也完美支持 Anthropic 的 API 格式:

    ```python  theme={null}
    # Anthropic 格式也可以使用
    client = Anthropic(
        base_url="https://ai.megallm.io",
        api_key="your-megallm-key"
    )
    ```

    您甚至可以混合搭配 - 使用 OpenAI 格式访问 Claude 模型,反之亦然。
  </Accordion>

  <Accordion title="我如何处理不同的模型能力?">
    不同的模型有不同的优势。MegaLLM 让您可以轻松地将请求路由到最适合每个任务的模型:

    ```python  theme={null}
    # 代码生成
    code_response = client.chat.completions.create(
        model="gpt-5",  # 擅长代码
        messages=[{"role": "user", "content": "编写一个 Python 函数..."}]
    )

    # 创意写作
    creative_response = client.chat.completions.create(
        model="claude-opus-4-1-20250805",  # 擅长创意任务
        messages=[{"role": "user", "content": "写一个故事..."}]
    )

    # 快速响应
    quick_response = client.chat.completions.create(
        model="gpt-4o-mini",  # 快速高效
        messages=[{"role": "user", "content": "快速问题..."}]
    )
    ```
  </Accordion>

  <Accordion title="速率限制如何处理?">
    MegaLLM 显著减少了速率限制问题:

    1. **分布式负载**: 请求分布在多个提供商之间
    2. **自动故障转移**: 当达到限制时切换到可用的模型
    3. **智能路由**: 将请求路由到有可用容量的模型
    4. **速率限制预测**: 通过预测性路由避免达到限制

    您将体验到比任何单个提供商都高得多的有效速率限制。
  </Accordion>
</AccordionGroup>

## 使用场景

<AccordionGroup>
  <Accordion title="谁最能从 MegaLLM 中受益?">
    MegaLLM 非常适合:

    **开发者**:

    * 无需重写代码即可试验不同的模型
    * 减少集成复杂性
    * 更快的上市时间

    **企业**:

    * 通过故障转移确保高可用性
    * 优化跨提供商的成本
    * 使 AI 投资面向未来

    **研究人员**:

    * 在发布时访问尖端模型
    * 运行全面的评估
    * 测试不同任务的模型性能
  </Accordion>

  <Accordion title="我可以在生产应用中使用 MegaLLM 吗?">
    绝对可以!MegaLLM 专为生产使用而设计:

    * 99.9% 正常运行时间 SLA
    * 企业安全和合规性
    * 24/7 监控和支持
    * 自动扩展和负载均衡
    * 全面的日志记录和分析

    许多公司使用 MegaLLM 来支持其生产 AI 功能。
  </Accordion>

  <Accordion title="我如何为我的用例选择合适的模型?">
    查看我们的[模型页面](/cn/home/models)获取详细指导。一般来说:

    * **快速响应**: gpt-4o-mini, gemini-2.0-flash-001
    * **复杂推理**: gpt-5, claude-opus-4-1-20250805
    * **代码生成**: gpt-5, claude-3.7-sonnet
    * **创意写作**: claude-opus-4-1-20250805, gpt-5
    * **成本效益**: gpt-4o-mini, gemini-2.0-flash-001

    您还可以使用特定提示词测试不同的模型,以找到最合适的。
  </Accordion>
</AccordionGroup>

## 支持和入门

<AccordionGroup>
  <Accordion title="我如何开始?">
    入门很简单:

    1. **注册** MegaLLM 账户
    2. **从仪表板获取您的 API 密钥**
    3. **选择您的集成方法**(OpenAI 或 Anthropic 格式)
    4. **进行您的第一次 API 调用**

    查看我们的[快速入门指南](/cn/dev-docs/getting-started/quick-start)了解详细说明。
  </Accordion>

  <Accordion title="你们提供支持吗?">
    是的!我们提供:

    * **文档**: 全面的指南和教程
    * **社区支持**: Discord 社区和论坛
    * **电子邮件支持**: 为所有用户提供技术协助
    * **企业支持**: 为企业客户提供专门支持
    * **专业服务**: 定制集成协助

    如有任何问题,请通过 [support@megallm.io](mailto:support@megallm.io) 联系我们。
  </Accordion>

  <Accordion title="我可以从当前的提供商迁移吗?">
    迁移通常非常简单,因为我们保持 API 兼容性。我们还提供:

    * 流行提供商的**迁移指南**
    * 为企业客户提供**免费迁移协助**
    * **渐进式迁移工具**,在完全切换之前进行测试
    * **成本比较工具**,以优化您的设置

    大多数客户可以在一小时内完成迁移。
  </Accordion>
</AccordionGroup>

<Info>
  **还有问题?** 查看我们的[文档](/cn/home/introduction)或通过 [support@megallm.io](mailto:support@megallm.io) 联系我们的团队
</Info>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt