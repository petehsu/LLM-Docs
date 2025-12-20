# 接入 Gemini CLI

> 使用定制版 Gemini CLI 接入智谱 GLM 模型的完整指南

Gemini CLI 是一个命令行界面工具，通过使用定制分支，我们可以让它与智谱 GLM 模型兼容。

<Warning>
  注意：使用 [GLM 编码套餐](/cn/coding-plan/overview) 时，需要配置专属的 \
  Coding 端点 - [https://open.bigmodel.cn/api/coding/paas/v4](https://open.bigmodel.cn/api/coding/paas/v4) \
  而非通用端点 - [https://open.bigmodel.cn/api/paas/v4/](https://open.bigmodel.cn/api/paas/v4/) \
  注意：Coding API 端点仅限 Coding 场景，并不适用通用 API 场景，请区分使用。
</Warning>

## 一、获取定制版本

### 1. 克隆定制仓库

由于 Gemini CLI 官方仓库仅支持 Google 的 Gemini 模型，我们需要使用支持 OpenRouter 兼容的定制分支：

```bash  theme={null}
git clone https://github.com/heartyguy/gemini-cli
cd gemini-cli
```

### 2. 切换到兼容分支

```bash  theme={null}
git checkout feature/openrouter-support
```

## 二、环境配置

### 1. 设置环境变量

![Description](https://cdn.bigmodel.cn/markdown/1753631661971gemini-1.png?attname=gemini-1.png)

配置 API 基础 URL：

```bash  theme={null}
export OPENROUTER_BASE_URL="https://open.bigmodel.cn/api/coding/paas/v4"
```

配置 API Key：

```bash  theme={null}
export OPENROUTER_API_KEY="your_bigmodel_api_key"
```

## 三、安装和启动

### 1. 系统要求

确保您的 Node.js 版本 >= 18

### 2. 安装依赖

```bash  theme={null}
npm install
```

### 3. 启动流程

![Description](https://cdn.bigmodel.cn/markdown/1753631666323gemini-2.png?attname=gemini-2.png)

启动后需要完成以下步骤：

1. 选择背景颜色主题
2. 用户登录（推荐使用 Google 账户登录，会跳转到网页进行认证）

## 四、使用效果

![Description](https://cdn.bigmodel.cn/markdown/1753631670672gemini-3.png?attname=gemini-3.png)

配置完成后，您就可以在命令行中使用智谱 GLM 模型进行对话和代码生成了。


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt