# 接入 Monkey Code

> 在 VS Code 中使用 Monkey Code 插件接入智谱 GLM 模型的完整指南

MonkeyCode 是一款专为研发管理而设计的开源企业级 AI 编程助手，支持私有化离线部署，兼容第三方及本地化大模型，具备企业级管理面板，具备代码安全功能。

Github地址：[https://github.com/chaitin/MonkeyCode](https://github.com/chaitin/MonkeyCode)

<Warning>
  注意：使用 [GLM 编码套餐](/cn/coding-plan/overview) 时，需要配置专属的 \
  Coding 端点 - [https://open.bigmodel.cn/api/coding/paas/v4](https://open.bigmodel.cn/api/coding/paas/v4) \
  而非通用端点 - [https://open.bigmodel.cn/api/paas/v4/](https://open.bigmodel.cn/api/paas/v4/) \
  注意：Coding API 端点仅限 Coding 场景，并不适用通用 API 场景，请区分使用。
</Warning>

## 一、安装 Monkey Code 插件

你需要一台支持 Docker 20.x 以上版本的 Linux 系统来安装 MonkeyCode。
使用 root 权限登录你的服务器，然后执行以下命令。

```Shell  theme={null}
bash -c "$(curl -fsSLk https://release.baizhi.cloud/monkeycode/manager.sh)"
```

根据命令提示的选项进行安装，命令执行过程将会持续几分钟，请耐心等待。

![Description](https://cdn.bigmodel.cn/markdown/1756795771149monkeycode-1.png?attname=monkeycode-1.png)

## 二、配置大模型

作为 一款 AI Coding 工具，MonkeyCode 需要接入 AI 大模型后才能使用，这里选择智谱模型。
![Description](https://cdn.bigmodel.cn/markdown/1756795858019monkeycode-3.png?attname=monkeycode-3.png)

## 三、下载插件并使用

![Description](https://cdn.bigmodel.cn/markdown/1756795822206monkeycode-2.png?attname=monkeycode-2.png)

1. 打开 VS Code
2. 点击左侧插件市场图标
3. 安装从Monkey Code管理端下载的插件
4. 在输入框中输入需求，让模型帮助您完成各种任务，例如：

* 总结当前项目结构
* 分析重点模块和功能
* 代码重构和优化
* 生成文档和注释
* 问题诊断和修复建议


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt