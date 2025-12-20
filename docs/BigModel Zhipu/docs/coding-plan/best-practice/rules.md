# Rules 技巧

> Vibe Coding 进阶：怎样把 GLM-4.6 的 Agentic 能力发挥到最大

## 1. Rules的哲学：约束即自由

Rules不是限制AI的枷锁，而是给AI创造力提供**明确的边界和方向**。就像诗歌的韵律，约束反而激发了更高级的创作。

![Description](https://cdn.bigmodel.cn/markdown/1765360071801image.png?attname=image.png)

## 2. 层次化规则设计

根据最佳实践，规则应该分为多个层次：

![Description](https://cdn.bigmodel.cn/markdown/1765360095422image.png?attname=image.png)

## 3. 实战技巧

### 技巧1：制定有效的编码规则

**TypeScript项目的规则模板：**

```markdown  theme={null}
# TypeScript开发规则

## 类型定义规则
1. 所有公共接口必须有明确的类型定义
2. 避免使用 `any` 类型，必要时使用 `unknown`
3. 使用严格的TSConfig配置
4. 自定义类型放在 `types/` 目录下

## 组件设计规则
1. React组件使用函数式写法
2. Props接口命名为 `{ComponentName}Props`
3. 使用 `forwardRef` 处理ref传递
4. 组件文件结构：导入 → 类型 → 组件 → 导出

## 状态管理规则
1. 本地状态优先使用 `useState`
2. 复杂状态使用 `useReducer`
3. 全局状态通过Context或状态管理库
4. 状态更新必须是不可变的

请在编写代码时严格遵循这些规则。
```

**后端API规则模板：**

```markdown  theme={null}
# API开发规则

## 接口设计规则
1. 遵循RESTful设计原则
2. 使用HTTP状态码表示结果
3. 响应格式统一为JSON
4. 支持分页的接口必须包含元数据

## 错误处理规则
1. 统一的错误响应格式
2. 错误信息要对用户友好
3. 记录详细的错误日志
4. 敏感信息不能暴露给客户端

## 安全规则
1. 所有接口都要有认证检查
2. 使用HTTPS传输敏感数据
3. 输入数据必须验证和清理
4. 实施适当的限流策略

在实现API时，请确保每个接口都符合这些规则。
```

### 技巧2：动态规则适配

不同阶段的项目需要不同的规则重点：

![Description](https://cdn.bigmodel.cn/markdown/1765360156982image.png?attname=image.png)

**阶段性规则配置：**

```markdown  theme={null}
当前项目处于开发阶段，请遵循以下规则优先级：

高优先级（必须遵循）：
- 代码必须通过TypeScript编译
- 新功能必须包含单元测试
- API接口必须有参数验证
- 提交信息必须符合Conventional Commits

中优先级（建议遵循）：
- 组件应该有使用示例
- 复杂逻辑应该有注释说明
- 性能敏感的代码需要基准测试

低优先级（时间充裕时）：
- 完善的JSDoc文档
- 详细的错误处理
- 国际化支持
```

### 技巧3：规则的自动化执行

![Description](https://cdn.bigmodel.cn/markdown/1765360184162image.png?attname=image.png)

**自动化规则配置示例：**

```markdown  theme={null}
请帮我设置项目的自动化规则检查：

1. Pre-commit hooks:
   - 运行 ESLint 和 Prettier
   - TypeScript 类型检查
   - 单元测试（仅修改的文件）
   - 提交信息格式检查

2. CI/CD 规则:
   - 全量测试套件
   - 代码覆盖率检查（最低80%）
   - 安全漏洞扫描
   - 依赖版本检查

3. 代码审查规则:
   - 至少一个审查者批准
   - 所有讨论必须解决
   - CI检查必须通过
   - 无合并冲突

请生成相应的配置文件。
```

### 技巧4：规则的渐进式优化

![Description](https://cdn.bigmodel.cn/markdown/1765360203406image.png?attname=image.png)

**规则优化的提示词模板：**

```markdown  theme={null}
基于最近一个月的开发经验，请帮我分析现有规则的效果：

当前规则：
[粘贴现有规则]

遇到的问题：
1. [具体问题描述]
2. [具体问题描述]

团队反馈：
- [团队成员的意见]

请建议：
1. 哪些规则需要放宽？
2. 哪些规则需要加强？
3. 是否需要新增规则？
4. 如何让规则更容易执行？
```


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt