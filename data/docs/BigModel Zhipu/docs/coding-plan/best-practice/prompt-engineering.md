# 提示词编写指南

> Vibe Coding 基础：优化提示词让 GLM 和 编程助手高效协作

## 一、提示词技巧：如何与AI建立默契

### 1. 从模糊到精确：

<Tip>
  看出区别了吗？第二个提示词不仅描述了 **要什么**，还说明了 **为什么要** 和 **怎么要**。
</Tip>

**❌ 错误示范：**

```markdown  theme={null}
帮我写个登录功能
```

**✅ 正确示范：**

```markdown  theme={null}
我需要为一个React应用创建用户登录功能。要求：
- 使用TypeScript
- 包含邮箱和密码验证
- 支持记住登录状态
- 错误处理要友好
- 遵循项目现有的组件结构

请先分析现有的认证相关代码，然后提供完整的实现方案。
```

### 2. SMART原则

借鉴项目管理中的SMART原则，一个好的提示词应该是：

![Description](https://cdn.bigmodel.cn/markdown/1765358759995image.png?attname=image.png)

### 3. 渐进式对话：从简单到复杂

不要试图在一次对话中解决所有问题。把复杂任务分解成多个步骤：

**第一步：探索和理解**

```markdown  theme={null}
请帮我分析一下当前项目的架构，特别是用户认证部分的设计模式
```

**第二步：设计和规划**

```markdown  theme={null}
基于刚才的分析，如果我要添加第三方登录（Google、GitHub），应该如何设计架构？
```

**第三步：实现和测试**

```markdown  theme={null}
请实现Google登录功能，包括前端组件和后端API接口
```

**第四步：优化和完善**

```markdown  theme={null}
请为刚才的登录功能添加错误处理和用户体验优化
```

## 二、编程助手使用指南

### 1. GLM-4.6 的项目感知能力

GLM-4.6 不是在真空中工作的——它能够理解你的整个项目结构。这意味着：

![Description](https://cdn.bigmodel.cn/markdown/1765358789993image.png?attname=image.png)

**实用技巧：**

* 提示 AI 先"看看"你的项目：`请分析一下这个项目的结构和主要技术栈`
* 利用现有代码作为样本：`请参考components/Button.tsx的写法，创建一个新的Card组件`

### 2. 斜杠命令：你的效率倍增器

很多 AI 助手都包含了一些“**预制提示词**”，可以通过敲“/”来唤起斜杠命令，以 Claude Code 为例：

**文件操作类：**

* `/create-component ComponentName` - 创建新组件
* `/refactor-function functionName` - 重构指定函数
* `/add-tests fileName` - 为文件添加测试

**项目管理类：**

* `/commit` - 智能生成提交信息
* `/pr-review` - 代码评审
* `/fix-issue #123` - 修复GitHub issue

**代码质量类：**

* `/optimize` - 性能优化建议
* `/clean` - 代码清理和格式化
* `/security-check` - 安全检查

### 3. 上下文管理：让AI记住重要的事

<Tip>
  对 GLM-4.6 而言，上下文管理最为重要，利用好上下文效果会有质的飞跃
</Tip>

![Description](https://cdn.bigmodel.cn/markdown/1765358830259image.png?attname=image.png)

**建立项目上下文的模板：**

```markdown  theme={null}
这是一个[项目类型]项目，使用[技术栈]。
主要功能是[核心功能描述]。
我们的编码规范包括：
- [规范1]
- [规范2]
- [规范3]

当前我需要[具体需求]，请基于以上背景提供解决方案。
```

## 三、进阶技巧：成为AI协作的高手

### 1. 错误驱动的学习循环

<Tip>
  当 GLM-4.6 给出的代码不符合预期时，不要急着重新提问，而是建立一个**反馈循环**
</Tip>

![Description](https://cdn.bigmodel.cn/markdown/1765358914189image.png?attname=image.png)

**给反馈的正确方式：**

```markdown  theme={null}
刚才生成的代码有个问题：当用户输入为空时，应该显示友好的提示信息，而不是抛出异常。
现在的行为是：[描述当前行为]
期望的行为是：[描述期望行为]
请修改相关的验证逻辑。
```

### 2. 渐进式复杂度管理

不要一开始就扔给AI一个超级复杂的任务。遵循"分而治之"的原则：

![Description](https://cdn.bigmodel.cn/markdown/1765358937266image.png?attname=image.png)

## 四、实战演练：从零到一构建功能

<Tip>
  让我们通过一个具体例子，看看如何优雅地在编程助手里使用 `GLM-4.6`
</Tip>

### 场景：为博客系统添加评论功能

**第一步：建立上下文**

```markdown  theme={null}
我正在开发一个基于Next.js和TypeScript的博客系统。
目前已有：
- 文章展示功能
- 用户认证系统
- 基于Tailwind CSS的UI组件库

我想添加评论功能，包括：
- 用户可以对文章发表评论
- 支持评论回复
- 实时更新评论列表
- 评论内容支持基础的Markdown格式

请先帮我分析一下实现方案。
```

**第二步：架构设计**

```markdown  theme={null}
基于刚才的分析，请设计评论系统的数据库模型和API接口
```

**第三步：逐步实现**

```markdown  theme={null}
请先实现评论的数据模型和基础的CRUD API
```

**第四步：前端组件**

```markdown  theme={null}
基于我们的设计，请创建评论展示组件，要符合项目现有的组件风格
```

**第五步：优化完善**

```markdown  theme={null}
请为评论系统添加以下功能：
- 评论的点赞/取消点赞
- 评论的举报功能
- 评论内容的敏感词过滤
```

## 五、常见陷阱与解决方案

GLM-4.6 不是魔法棒，它需要你的引导和协作。就像学习任何一门技艺一样，掌握与AI协作的技巧需要时间和练习。但一旦你找到了节奏，你会发现编程变得前所未有的高效和有趣。现在看看这些常见陷阱，评估一下自己有没有遇到过吧：

<Tabs>
  <Tab title="陷阱1：提示词过于简单">
    **问题：** 帮我写个函数

    **解决：** 明确输入、输出、边界条件和使用场景
  </Tab>

  <Tab title="陷阱2：忽略项目上下文">
    **问题：** 直接要求生成代码，不考虑现有架构

    **解决：** 总是让 GLM-4.6 先理解项目结构
  </Tab>

  <Tab title="陷阱3：一次性要求太多">
    **问题：** 想要一个完整的系统

    **解决：** 分步骤，逐个击破
  </Tab>

  <Tab title="陷阱4：缺乏反馈循环">
    **问题：** 代码不对就重新开始

    **解决：** 提供具体的错误信息和期望结果
  </Tab>
</Tabs>

<Check>
  记住：**好的提示词是成功的一半，好的反馈循环是成功的另一半。**
</Check>

现在，打开你熟悉的 AI 编程助手，开始这段奇妙的AI编程之旅吧。毕竟，未来的编程不是人与机器的竞争，而是人与AI的完美协作。

## \*更多教程与案例

<Tip>
  更多GLM 编程的 #入门指南、#实战教程 与 #创新应用案例，请访问 [GLM Coding 开发者社区](https://zhipu-ai.feishu.cn/wiki/TrlMwahsfihLrKkZsy0cpuTenCz)
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt