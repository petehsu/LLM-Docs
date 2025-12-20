# 智能硬件对话方案

> 本项目基于开源项目xiaozhi-esp32-server 进行定制和优化，实现了生产级的多用户 SaaS 架构与 MiniMax AI 平台的无缝集成，为开发者和企业提供快速部署、即刻体验的智能对话完整解决方案。

### 超拟人音色，打造个性化对话体验

得益于 MiniMax 平台的专业 TTS 技术和丰富的音色库，本项目提供了高度灵活的音色定制能力. MiniMax TTS 平台提供了上百种专业音色，覆盖不同年龄、性别、风格

音色克隆，定制专属声音

* MiniMax 音色复刻能力: 通过少量音频样本，即可克隆特定说话人的声音
* 自定义音色上传: 在 MiniMax 平台训练自己的音色，轻松接入本项目
* 灵活切换: 在管理后台一键切换不同音色，无需修改代码

### 兼容小智 ESP32 硬件开发板

本项目是小智 ESP32 智能硬件的"大脑"，通过完善的软硬件协同机制，实现真正的智能陪伴体验：

硬件支持：

* ESP32-S3-BOX-3：官方推荐的开发板
* 可定制ESP32 设备：支持自定义硬件适配
* 多设备管理：一个账号可管理多个 ESP32 设备

软硬件通信：

* WebSocket 实时通信：毫秒级的指令下发和状态同步
* MQTT 消息推送：支持设备状态监控、远程控制
* UDP 协议支持：满足低延迟场景需求
* MCP 协议集成：实现设备能力的标准化调用

### 陪伴对话硬件开发的最佳实践

本项目为开发者提供了完整的陪伴对话硬件开发框架：

角色定制化开发

* 多角色管理：一个设备可配置多个对话角色（学习助手、生活伴侣、儿童教育等）
* 个性化设定：为每个角色定制独特的人格、对话风格、知识领域
* 音色匹配：根据角色特点选择适配的语音音色

语音交互优化

* VAD 语音端点检测：精准识别用户说话的开始和结束
* 多音色选择：MiniMax 提供上千种音色，满足不同场景需求

记忆管理

* 长期记忆支持：设备可记住用户偏好和历史对话
* 向量数据库集成：支持大规模知识库检索
* 可选记忆模式：灵活开启/关闭记忆功能

Web 测试页面

* 无需实体硬件即可测试完整对话流程
* 实时查看 WebSocket 通信日志
* 快速验证 AI 模型配置效果

***

### 立即体验：[点击进入](https://solution.minimaxi.com/xiaozhi#/)

<img src="https://mintcdn.com/minimax-zh/mpbAzi3Ta2SsXGMZ/images/screen_xiaozhi.png?fit=max&auto=format&n=mpbAzi3Ta2SsXGMZ&q=85&s=e1a445c10468c1a1510cdeecd4517a5f" alt="Screen Xiaozhi Pn" data-og-width="1891" width="1891" data-og-height="813" height="813" data-path="images/screen_xiaozhi.png" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/minimax-zh/mpbAzi3Ta2SsXGMZ/images/screen_xiaozhi.png?w=280&fit=max&auto=format&n=mpbAzi3Ta2SsXGMZ&q=85&s=a6061d43ceda3a4ea0cb22901c9208a4 280w, https://mintcdn.com/minimax-zh/mpbAzi3Ta2SsXGMZ/images/screen_xiaozhi.png?w=560&fit=max&auto=format&n=mpbAzi3Ta2SsXGMZ&q=85&s=ce1fe4918199b8d4a1f0021a74a6991e 560w, https://mintcdn.com/minimax-zh/mpbAzi3Ta2SsXGMZ/images/screen_xiaozhi.png?w=840&fit=max&auto=format&n=mpbAzi3Ta2SsXGMZ&q=85&s=00e374125d2672120526096640dc67b2 840w, https://mintcdn.com/minimax-zh/mpbAzi3Ta2SsXGMZ/images/screen_xiaozhi.png?w=1100&fit=max&auto=format&n=mpbAzi3Ta2SsXGMZ&q=85&s=e609cc25814b2f2c54a85c01c6010d47 1100w, https://mintcdn.com/minimax-zh/mpbAzi3Ta2SsXGMZ/images/screen_xiaozhi.png?w=1650&fit=max&auto=format&n=mpbAzi3Ta2SsXGMZ&q=85&s=fac5a009c1b2c77ccbaaec05ffbd64d8 1650w, https://mintcdn.com/minimax-zh/mpbAzi3Ta2SsXGMZ/images/screen_xiaozhi.png?w=2500&fit=max&auto=format&n=mpbAzi3Ta2SsXGMZ&q=85&s=ec03205a4ccce9f7d7466a5910f5d1e7 2500w" />

### **项目源码**

[https://github.com/MiniMax-OpenPlatform/xiaozhi-minimax-esp32-server](https://github.com/MiniMax-OpenPlatform/xiaozhi-minimax-esp32-server)

**更多功能持续迭代，欢迎交流和提PR**


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimaxi.com/docs/llms.txt