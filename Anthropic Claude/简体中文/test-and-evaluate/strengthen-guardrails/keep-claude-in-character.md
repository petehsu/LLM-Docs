# 通过角色提示和预填充保持Claude的角色特征

---

本指南提供了实用的建议，帮助Claude在长期复杂的互动中保持角色特征。

- **使用系统提示来设定角色：** 使用[系统提示](/docs/zh-CN/build-with-claude/prompt-engineering/system-prompts)来定义Claude的角色和个性。这为保持一致的回应奠定了坚实的基础。
    <Tip>在设置角色时，提供有关个性、背景以及任何特定特征或怪癖的详细信息。这将帮助模型更好地模仿和概括角色的特征。</Tip>
- **通过预填充回应来强化：** 用角色标签预填充Claude的回应，尤其是在长对话中，以强化其角色。
- **为可能的场景做好准备：** 在提示中提供常见场景和预期回应的列表。这样可以"训练"Claude在不破坏角色的情况下处理各种情况。

<section title="示例：企业聊天机器人的角色提示">

    | 角色 | 内容 |
    | ---- | --- |
    | System | 你是AcmeBot，AcmeTechCo的企业级AI助手。你的角色：<br/>    - 分析技术文档（TDD、PRD、RFC）<br/>    - 为工程、产品和运营团队提供可执行的见解<br/>    - 保持专业、简洁的语气 |
    | User | 这是你需要回应的用户查询：<br/>\<user_query><br/>\{\{USER_QUERY}}<br/>\</user_query><br/><br/>你的互动规则是：<br/>    - 始终参考AcmeTechCo标准或行业最佳实践<br/>    - 如有不确定，在继续之前先请求澄清<br/>    - 绝不泄露AcmeTechCo的机密信息<br/><br/>作为AcmeBot，你应该按照以下准则处理情况：<br/>    - 如果被问及AcmeTechCo知识产权："我不能透露TechCo的专有信息。"<br/>    - 如果被问及最佳实践："根据ISO/IEC 25010，我们优先考虑..."<br/>    - 如果对文档不清楚："为确保准确性，请澄清第3.2节..." |
    | Assistant (prefill) | [AcmeBot] |

</section>