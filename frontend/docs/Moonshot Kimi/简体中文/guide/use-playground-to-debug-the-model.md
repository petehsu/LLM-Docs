文档

入门指南

开发工作台调试模型指南

# 使用 Playground 调试模型

[Playground 开发工作台](/playground)是一个强大的模型调试和测试平台，提供了直观的界面来与 AI 模型进行交互和测试。通过这个工作台，您可以：

1. 调整观察模型在不同参数下的表现和输出效果
2. 通过使用 Kimi 开放平台内置的工具，体验模型的 tool calling 能力
3. 对比不同模型在相同参数下的效果
4. 监控 tokens 使用情况来优化成本

## 

**提示信息设置**

* 在最上方可以设置系统提示词（System Prompt），定义模型的行为规范指导模型输出
* 支持定义 system/user/assistant 三种角色的提示词

**模型配置**

* **模型选择**: 可选择不同的模型（如 moonshot-v1 系列/kimi latest/kimi-k2 系列等）
* **参数配置**：支持的参数和字段说明详见[请求参数说明](/docs/api/chat#%E5%AD%97%E6%AE%B5%E8%AF%B4%E6%98%8E)

**模型对话**

* 下方输入框可以进行聊天内容发送
* **Tool 调用显示**: 显示工具调用过程，包括调用 ID/工具参数/返回结果
* **查看代码**:可以查看当前会话的 API 调用代码并提供复制功能
* 底部统计信息：显示本次对话的输入/输出/总计的 tokens 消耗数量，包括上下文历史消息和 prompt 提示词信息

![prompt](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprompt.e5456f37.png&w=3840&q=75)

## 

### 

* Kimi 开放平台提供了官方免费执行的工具，您可以在 playground 选择工具，模型会自动判断是否需要调用工具来完成您的指令，如果需要进行工具调用，模型会按照工具的要求生成参数调用工具，整合成最终的答案返回给您。
* **额度与限速**：Kimi 开放平台提供的工具是一个预构建的函数，可以在需要时快速在线执行无需您本地准备工具的执行环境，目前 Kimi 开放平台的工具执行限时免费，当工具负载达到容量上限时，可能会采取临时的限流措施。
* 目前支持的工具：日期时间工具/Excel 文件分析工具/联网搜索工具/随机数生成工具等
* 目前已支持通过 Kimi API 来调用工具，详见文档[如何在 Kimi API 中使用 Formula 工具](/docs/guide/use-formula-tool-in-chatapi)
* 暂时不支持自定义工具上传执行。

### 

* 在 Kimi Playground 中，您可以配置 ModelScope MCP 服务器，使用 ModelScope 提供的工具。
  + 配置步骤请见[在 Playground 中配置 ModelScope MCP 服务器](/docs/guide/configure-the-modelscope-mcp-server)
* 您也可以配置其他 MCP 服务器，通过添加 MCP 服务器功能，输入或选择 MCP 服务器的 URL /传输协议/认证方式，点击添加即可。

![mcp](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fadd-mcp-server-cn.3f164631.png&w=3840&q=75)

### 

* 场景说明：运用工具能力，请求模型搜索今日的新闻信息，并整理成 html 网页报告
* 工具选择：date 日期时间工具，web\_search 工具，rethink 想法整理工具
* 说明：web\_search 工具会调用 kimi 开放平台的联网搜索服务，单次联网搜索会进行计费，具体计费标准请见[计费](/docs/pricing/tools#%E8%81%94%E7%BD%91%E6%90%9C%E7%B4%A2%E8%AE%A1%E8%B4%B9%E9%80%BB%E8%BE%91)
* 点击页面 showcase 按钮，即可快速体验工具效果

![date](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fshowcase-cn.47931207.png&w=3840&q=75)

![date](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fnews-cn.41f3ef97.png&w=3840&q=75)

### 

* 工具选择：excel 分析工具

![excel](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexcel-cn.4a03d1e9.png&w=3840&q=75)

## 

* 可以通过添加对话功能，创建新的对话，最多支持3个模型同时调用

![模型对比](/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmodel-compare.7c1d4288.png&w=3840&q=75)

## 

* **导出**: 导出当前对话内容，会将当前对话的全部配置和上下文导出 .json 格式文件。
* **导入**: 导入分享的或者历史导出的 .json 对话内容，playground 会将会话渲染到页面中。
* 注意：rerun 后的数据会重新生成覆盖之前的聊天内容。若导入的 case 包括上传过的文件，导入后的会话不能 rerun

[

您的浏览器不支持视频播放。

](/docs/guide/playground/upload.mp4)

Last updated on 2025年11月11日

[文件问答指南](/docs/guide/use-kimi-api-for-file-based-qa "文件问答指南")[在编程工具中使用 Kimi K2 模型](/docs/guide/agent-support "在编程工具中使用 Kimi K2 模型")