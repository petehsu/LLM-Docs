# MCP & 智能体技巧

> Vibe Coding 进阶：怎样把 GLM 的 Agentic 能力发挥到最大

## 1. MCP是什么？为什么它改变游戏规则？

MCP（Model Context Protocol）就像是给 GLM-4.6 装上了"传感器"：它让AI不再局限于文本交互，而是能够真正"感知"和"操作"外部世界。

![Description](https://cdn.bigmodel.cn/markdown/1765359585067image.png?attname=image.png)

## 2. 智能体的层次化设计

从社区实践来看，最有效的智能体系统往往采用 **分层架构**：

![Description](https://cdn.bigmodel.cn/markdown/1765359999211image.png?attname=image.png)

## 3. 实战技巧

### 技巧1：构建专业化智能体

**创建前端专家智能体：**

```markdown  theme={null}
你是一个专注于React/TypeScript开发的前端专家智能体。

你的专业领域：
- React组件设计和优化
- TypeScript类型系统
- CSS-in-JS和Tailwind CSS
- 前端性能优化
- 用户体验设计

工作原则：
1. 始终考虑组件的可复用性
2. 遵循React最佳实践
3. 确保类型安全
4. 优先考虑用户体验
5. 代码要易于测试

当接到任务时，你会：
1. 分析需求的UI/UX影响
2. 设计组件架构
3. 实现功能代码
4. 提供使用示例
5. 建议测试策略
```

**创建后端专家智能体：**

```markdown  theme={null}
你是一个专注于Node.js/Python后端开发的专家智能体。

你的职责范围：
- RESTful API设计
- 数据库设计和优化
- 安全性和认证
- 性能监控和优化
- 微服务架构

核心原则：
1. API设计要符合RESTful规范
2. 数据安全是第一优先级
3. 代码要有充分的错误处理
4. 性能优化从设计开始
5. 可扩展性要考虑在内

工作流程：
1. 理解业务需求
2. 设计数据模型
3. 定义API接口
4. 实现核心逻辑
5. 添加监控和日志
```

### 技巧2：MCP服务器的实用配置

参考仓库中的配置模式，一个高效的MCP配置应该包括：

**开发环境MCP配置：**

```json  theme={null}
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["./src", "./docs", "./tests"]
    },
    "git": {
      "command": "mcp-server-git",
      "args": ["--repo-path", "."]
    },
    "database": {
      "command": "mcp-server-postgres",
      "args": ["--connection", "postgresql://localhost:5432/mydb"]
    },
    "api-testing": {
      "command": "mcp-server-http",
      "args": ["--base-url", "http://localhost:3000/api"]
    }
  }
}
```

**对应的使用技巧：**

```markdown  theme={null}
请通过MCP检查当前项目的文件结构，然后：
1. 分析现有的API路由
2. 检查数据库表结构
3. 查看最近的Git提交记录
4. 基于这些信息为新功能制定实施计划
```

## \*更多教程与案例

<Tip>
  更多GLM 编程的 #入门指南、#实战教程 与 #创新应用案例，请访问 [GLM Coding 开发者社区](https://zhipu-ai.feishu.cn/wiki/TrlMwahsfihLrKkZsy0cpuTenCz)
</Tip>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt