# AI 代码助手概览

> 配置 AI 代码助手以使用 MegaLLM - CLI 工具和 GUI 扩展

MegaLLM 支持所有主流 AI 代码助手。本统一指南涵盖了 Claude Code、Codex/Windsurf、OpenCode、Kilocode、RooCode 和 Cline 的配置。

## 可用助手

<CardGroup cols={3}>
  <Card title="Claude Code" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" href="/cn/agents/claude" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    CLI + 编辑器集成与 JSON 配置
  </Card>

  <Card title="Codex/Windsurf" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" href="/cn/agents/codex" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    CLI + 编辑器与 TOML 配置
  </Card>

  <Card title="OpenCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" href="/cn/agents/opencode" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    CLI + 编辑器与自动模型获取
  </Card>

  <Card title="Kilocode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" href="/cn/agents/kilocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    VSCode 扩展与内联聊天(CLI 即将推出)
  </Card>

  <Card title="RooCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" href="/cn/agents/roocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    独立应用程序与可视化界面
  </Card>

  <Card title="Cline" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" href="/cn/agents/cline" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    VSCode 扩展与自主任务(CLI 即将推出)
  </Card>
</CardGroup>

## 快速比较

| 助手                 | 接口               | 配置格式      | 配置级别     | 最适合             |
| ------------------ | ---------------- | --------- | -------- | --------------- |
| **Claude Code**    | CLI + VSCode     | JSON      | 系统 + 项目  | 终端工作流、VSCode 集成 |
| **Codex/Windsurf** | CLI + 编辑器        | TOML      | 仅系统      | 高级用户、Cascade AI |
| **OpenCode**       | CLI + 编辑器        | JSON      | 系统 + 项目  | 多模型切换、灵活性       |
| **Kilocode**       | VSCode(CLI 即将推出) | VSCode 设置 | 用户 + 工作区 | 内联聊天、代码补全       |
| **RooCode**        | 独立应用             | JSON      | 应用级别     | 可视化 UI、独立工作流    |
| **Cline**          | VSCode(CLI 即将推出) | VSCode 设置 | 用户 + 工作区 | 自主任务、终端操作       |

## 助手类型

### CLI 优先助手(支持编辑器)

<CardGroup cols={3}>
  <Card title="Claude Code" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    * CLI 优先设计
    * VSCode 扩展可用
    * JSON 配置
    * 系统和项目级别
    * 状态栏支持
  </Card>

  <Card title="Codex/Windsurf" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    * CLI 优先设计
    * 编辑器集成
    * TOML 配置
    * Cascade AI (Windsurf)
    * Supercomplete 功能
  </Card>

  <Card title="OpenCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    * CLI 优先设计
    * 编辑器插件可用
    * JSON 配置
    * 自动获取模型
    * 多提供商支持
  </Card>
</CardGroup>

**何时使用 CLI 优先助手:**

* 基于终端的工作流
* CI/CD 集成
* 服务器环境
* 脚本和自动化
* 在编辑器中与扩展一起使用也很好

### 仅编辑器助手(CLI 即将推出)

<CardGroup cols={3}>
  <Card title="Kilocode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    * VSCode 扩展(主要)
    * CLI 正在维护中
    * 内联聊天界面
    * 代码补全
    * 文件树集成
  </Card>

  <Card title="RooCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    * 独立应用
    * 可视化界面
    * 多项目支持
    * 代码审查功能
  </Card>

  <Card title="Cline" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    * VSCode 扩展(主要)
    * CLI 正在维护中
    * 自主任务执行
    * 终端集成
    * Git 工作流支持
  </Card>
</CardGroup>

<Info>
  **Kilocode 和 Cline 的 CLI 支持:** CLI 版本目前正在维护中,即将推出。请暂时使用 VSCode 扩展。
</Info>

**何时使用编辑器优先助手:**

* 纯可视化编辑工作流
* 内联建议和补全
* 多文件重构
* 代码审查工作流
* IDE 原生体验

## 开始使用

<Steps>
  <Step title="选择你的助手">
    为终端工作流选择 CLI 助手,或为可视化编辑选择 GUI 助手
  </Step>

  <Step title="获取你的 API 密钥">
    在 [MegaLLM 仪表板](https://megallm.io/dashboard) 注册并获取以 `sk-mega-` 开头的 API 密钥
  </Step>

  <Step title="配置你的助手">
    遵循你所选助手的具体配置指南(下面的链接)
  </Step>

  <Step title="开始编码">
    启动你的助手并开始使用 AI 驱动的编码辅助
  </Step>
</Steps>

## 配置指南

### CLI 优先助手(也适用于编辑器)

<AccordionGroup>
  <Accordion title="Claude Code - CLI + VSCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    **用途:** CLI 工具 + VSCode 扩展

    **配置文件:**

    * 系统: `~/.claude/settings.json`
    * 项目: `./.claude/settings.json`
    * 本地: `./.claude/settings.local.json`

    **快速设置:**

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
        "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
      }
    }
    ```

    [完整 Claude Code 配置指南 →](/cn/agents/claude)
  </Accordion>

  <Accordion title="Codex/Windsurf - CLI + 编辑器" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    **用途:** CLI 工具 + 编辑器集成(Windsurf 是增强版本)

    **配置文件:**

    * 系统: `~/.codex/config.toml` (仅)

    **快速设置:**

    ```toml  theme={null}
    model_provider = "megallm"
    model = "gpt-5"

    [model_providers.megallm]
    name = "OpenAI using Chat Completions"
    base_url = "https://ai.megallm.io/v1"
    env_key = "MEGALLM_API_KEY"

    [tools]
    web_search = true
    file_browser = true
    ```

    [完整 Codex/Windsurf 配置指南 →](/cn/agents/codex)
  </Accordion>

  <Accordion title="OpenCode - CLI + 编辑器插件" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    **用途:** CLI 工具 + 编辑器插件(VSCode、Vim 等)

    **配置文件:**

    * 系统: `~/.config/opencode/opencode.json`
    * 项目: `./.opencode/opencode.json`

    **快速设置:**

    ```json  theme={null}
    {
      "providers": [
        {
          "id": "megallm",
          "name": "MegaLLM",
          "type": "openai",
          "baseURL": "https://ai.megallm.io/v1",
          "apiKey": "sk-mega-your-api-key-here"
        }
      ],
      "defaultProvider": "megallm"
    }
    ```

    [完整 OpenCode 配置指南 →](/cn/agents/opencode)
  </Accordion>
</AccordionGroup>

### 仅编辑器助手

<AccordionGroup>
  <Accordion title="Kilocode - VSCode 扩展" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    **配置位置:**

    * 用户设置(全局): VSCode 设置 UI 或 `settings.json`
    * 工作区设置(项目): `.vscode/settings.json`

    **快速设置(settings.json):**

    ```json  theme={null}
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "${env:MEGALLM_API_KEY}"
      },
      "kilocode.defaultModel": "gpt-5"
    }
    ```

    **环境变量:**

    ```bash  theme={null}
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"
    ```

    [完整 Kilocode 配置指南 →](/cn/agents/kilocode)
  </Accordion>

  <Accordion title="RooCode - 独立应用" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    **配置位置:**

    * Windows: `%APPDATA%\RooCode\config.json`
    * macOS: `~/Library/Application Support/RooCode/config.json`
    * Linux: `~/.config/roocode/config.json`

    **快速设置:**

    ```json  theme={null}
    {
      "provider": "openai-compatible",
      "api": {
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "sk-mega-your-api-key-here",
        "model": "gpt-5"
      },
      "features": {
        "codeCompletion": true,
        "chatInterface": true,
        "codeReview": true,
        "terminalIntegration": false
      }
    }
    ```

    [完整 RooCode 配置指南 →](/cn/agents/roocode)
  </Accordion>

  <Accordion title="Cline - VSCode 扩展与自主功能" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    **配置位置:**

    * 用户设置(全局): VSCode 设置 UI 或 `settings.json`
    * 工作区设置(项目): `.vscode/settings.json`

    **GPT 模型快速设置(OpenAI 格式):**

    ```json  theme={null}
    {
      "cline.apiProvider": "openai",
      "cline.openai": {
        "apiKey": "${env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io/v1"
      },
      "cline.defaultModel": "gpt-5"
    }
    ```

    **Claude 模型快速设置(Anthropic 格式):**

    ```json  theme={null}
    {
      "cline.apiProvider": "anthropic",
      "cline.anthropic": {
        "apiKey": "${env:MEGALLM_API_KEY}",
        "baseURL": "https://ai.megallm.io"
      },
      "cline.defaultModel": "claude-sonnet-4"
    }
    ```

    **环境变量:**

    ```bash  theme={null}
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"
    ```

    [完整 Cline 配置指南 →](/cn/agents/cline)
  </Accordion>
</AccordionGroup>

## 模型选择

所有助手通过 MegaLLM 支持相同的模型:

### GPT 模型

* `gpt-5` - 最新 GPT 模型(推荐)
* `gpt-4` - GPT-4
* `gpt-4o` - GPT-4 优化版
* `gpt-4o-mini` - 快速、经济实惠

### Claude 模型

* `claude-opus-4-1-20250805` - 最强大
* `claude-sonnet-4` - 平衡(推荐)
* `claude-haiku-4` - 快速、高效

### Gemini 模型

* `gemini-2.5-pro` - 最新 Gemini
* `gemini-2.0-flash` - 快速响应

[查看完整模型目录 →](/cn/home/models)

## 环境变量

大多数助手支持使用环境变量设置 API 密钥:

```bash  theme={null}
# 适用于 CLI 助手和一些 GUI 助手
export MEGALLM_API_KEY="sk-mega-your-api-key-here"

# Claude Code 专用
export ANTHROPIC_BASE_URL="https://ai.megallm.io"
export ANTHROPIC_API_KEY="sk-mega-your-api-key-here"
```

添加到你的 shell 配置:

* Bash: `~/.bashrc`
* Zsh: `~/.zshrc`
* Fish: `~/.config/fish/config.fish`

## 常见配置模式

### 模式 1: 个人使用的系统级配置

**最适合**: 个人项目、单用户

<Tabs>
  <Tab title="Claude Code">
    ```bash  theme={null}
    # 系统配置
    ~/.claude/settings.json

    # 环境变量
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"
    export ANTHROPIC_API_KEY="sk-mega-your-key"
    ```
  </Tab>

  <Tab title="Kilocode">
    ```bash  theme={null}
    # VSCode 用户设置
    # 文件 > 首选项 > 设置 > 搜索 "kilocode"

    # 环境变量
    export MEGALLM_API_KEY="sk-mega-your-key"
    ```
  </Tab>

  <Tab title="RooCode">
    ```bash  theme={null}
    # 应用配置
    ~/.config/roocode/config.json

    # 在配置中存储 API 密钥或使用环境变量
    ```
  </Tab>
</Tabs>

### 模式 2: 团队项目的项目级配置

**最适合**: 团队项目、共享配置

<Tabs>
  <Tab title="Claude Code">
    ```bash  theme={null}
    # 共享配置(已提交)
    .claude/settings.json
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
      }
    }

    # 个人密钥(未提交)
    .claude/settings.local.json
    {
      "env": {
        "ANTHROPIC_API_KEY": "your-personal-key"
      }
    }

    # .gitignore
    .claude/settings.local.json
    ```
  </Tab>

  <Tab title="Kilocode">
    ```bash  theme={null}
    # 工作区设置(已提交)
    .vscode/settings.json
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "${env:MEGALLM_API_KEY}"
      }
    }

    # 团队成员设置自己的环境变量
    export MEGALLM_API_KEY="personal-key"
    ```
  </Tab>

  <Tab title="OpenCode">
    ```bash  theme={null}
    # 项目配置(已提交)
    .opencode/opencode.json
    {
      "providers": [{
        "baseURL": "https://ai.megallm.io/v1"
      }]
    }

    # 通过环境变量设置个人密钥
    export MEGALLM_API_KEY="personal-key"
    ```
  </Tab>
</Tabs>

### 模式 3: 多模型配置

**最适合**: 不同任务使用不同模型

<Tabs>
  <Tab title="OpenCode">
    ```json  theme={null}
    {
      "providers": [
        {
          "id": "megallm-gpt",
          "type": "openai",
          "baseURL": "https://ai.megallm.io/v1",
          "models": ["gpt-5", "gpt-4o"]
        },
        {
          "id": "megallm-claude",
          "type": "anthropic",
          "baseURL": "https://ai.megallm.io",
          "models": ["claude-sonnet-4", "claude-opus-4"]
        }
      ]
    }
    ```
  </Tab>

  <Tab title="RooCode">
    ```json  theme={null}
    {
      "providers": [
        {
          "name": "GPT for Chat",
          "model": "gpt-5",
          "useFor": ["chat", "completion"]
        },
        {
          "name": "Claude for Review",
          "model": "claude-sonnet-4",
          "useFor": ["review", "analysis"]
        }
      ]
    }
    ```
  </Tab>
</Tabs>

## 故障排除

<AccordionGroup>
  <Accordion title="API 密钥不工作">
    **验证你的 API 密钥:**

    ```bash  theme={null}
    # 检查是否以 sk-mega- 开头
    echo $MEGALLM_API_KEY

    # 直接测试 API
    curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
         https://ai.megallm.io/v1/models
    ```

    **常见问题:**

    * 缺少 `sk-mega-` 前缀
    * 多余的空格或引号
    * 环境变量名称错误
    * Shell 配置未重新加载(运行 `source ~/.bashrc`)
  </Accordion>

  <Accordion title="API 端点错误">
    **检查你的基础 URL:**

    对于 **OpenAI 兼容格式**(GPT、Gemini):

    ```
    https://ai.megallm.io/v1  <Icon icon="check" /> (带 /v1)
    ```

    对于 **Anthropic 格式**(Claude):

    ```
    https://ai.megallm.io  <Icon icon="check" /> (不带 /v1)
    ```

    **助手特定端点:**

    * Claude Code: `https://ai.megallm.io` (不带 /v1)
    * Codex/Windsurf: `https://ai.megallm.io/v1`
    * OpenCode: `https://ai.megallm.io/v1`
    * Kilocode: `https://ai.megallm.io/v1`
    * RooCode: `https://ai.megallm.io/v1`
    * Cline: `https://ai.megallm.io` (Anthropic) 或 `https://ai.megallm.io/v1` (OpenAI)
  </Accordion>

  <Accordion title="找不到模型">
    **验证模型名称拼写:**

    查看[模型目录](/cn/home/models)获取确切的模型名称:

    ```bash  theme={null}
    # 常见错误:
    "gpt5"           <Icon icon="xmark" />  # 缺少连字符
    "gpt-5"          <Icon icon="check" />

    "claude-sonnet"  <Icon icon="xmark" />  # 缺少版本
    "claude-sonnet-4" <Icon icon="check" />

    "gemini-pro"     <Icon icon="xmark" />  # 版本错误
    "gemini-2.5-pro" <Icon icon="check" />
    ```
  </Accordion>

  <Accordion title="配置未加载">
    **检查文件位置:**

    ```bash  theme={null}
    # CLI 助手
    ls -la ~/.claude/settings.json      # Claude Code
    ls -la ~/.codex/config.toml         # Codex
    ls -la ~/.config/opencode/           # OpenCode

    # 项目配置
    ls -la .claude/settings.json         # Claude Code
    ls -la .opencode/opencode.json       # OpenCode
    ls -la .vscode/settings.json         # VSCode 扩展

    # 验证 JSON/TOML 语法
    jq . ~/.claude/settings.json         # 测试 JSON
    cat ~/.codex/config.toml | grep -    # 测试 TOML
    ```

    **检查权限:**

    ```bash  theme={null}
    chmod 644 ~/.claude/settings.json
    chmod 644 ~/.codex/config.toml
    ```
  </Accordion>

  <Accordion title="环境变量未设置">
    **重新加载你的 shell 配置:**

    ```bash  theme={null}
    # Bash
    source ~/.bashrc

    # Zsh
    source ~/.zshrc

    # Fish
    source ~/.config/fish/config.fish

    # 验证
    echo $MEGALLM_API_KEY
    echo $ANTHROPIC_BASE_URL
    ```

    **检查定义位置:**

    ```bash  theme={null}
    # 搜索所有 shell 配置
    grep -r "MEGALLM_API_KEY" ~/.*rc ~/.config/
    ```
  </Accordion>
</AccordionGroup>

## 功能比较

### 接口和使用

| 助手             | CLI 可用                       | 编辑器/GUI                          | 聊天界面                             | 多文件编辑                 |
| -------------- | ---------------------------- | -------------------------------- | -------------------------------- | --------------------- |
| Claude Code    | <Icon icon="check" />  主要    | <Icon icon="check" />  VSCode 扩展 | <Icon icon="check" />  CLI + GUI | <Icon icon="check" /> |
| Codex/Windsurf | <Icon icon="check" />  主要    | <Icon icon="check" />  编辑器       | <Icon icon="check" />  CLI + GUI | <Icon icon="check" /> |
| OpenCode       | <Icon icon="check" />  主要    | <Icon icon="check" />  插件        | <Icon icon="check" />  CLI + GUI | <Icon icon="check" /> |
| Kilocode       | <Icon icon="wrench" />  即将推出 | <Icon icon="check" />  仅 VSCode  | <Icon icon="check" />  GUI       | <Icon icon="check" /> |
| RooCode        | <Icon icon="xmark" />        | <Icon icon="check" />  独立        | <Icon icon="check" />  GUI       | <Icon icon="check" /> |
| Cline          | <Icon icon="wrench" />  即将推出 | <Icon icon="check" />  仅 VSCode  | <Icon icon="check" />  GUI       | <Icon icon="check" /> |

### 集成

| 助手             | 终端访问                                            | Git 集成                        | 文件树                   | 代码审查                         |
| -------------- | ----------------------------------------------- | ----------------------------- | --------------------- | ---------------------------- |
| Claude Code    | <Icon icon="check" />  原生 CLI                   | <Icon icon="check" />  原生     | <Icon icon="check" /> | <Icon icon="check" />  在编辑器中 |
| Codex/Windsurf | <Icon icon="check" />  原生 CLI                   | <Icon icon="check" />  原生     | <Icon icon="check" /> | <Icon icon="check" />  在编辑器中 |
| OpenCode       | <Icon icon="check" />  原生 CLI                   | <Icon icon="check" />  原生     | <Icon icon="check" /> | <Icon icon="check" />  在编辑器中 |
| Kilocode       | <Icon icon="triangle-exclamation" />  通过 VSCode | <Icon icon="check" />  VSCode | <Icon icon="check" /> | <Icon icon="check" />        |
| RooCode        | <Icon icon="check" />  内置                       | <Icon icon="check" />  内置     | <Icon icon="check" /> | <Icon icon="check" />        |
| Cline          | <Icon icon="check" />  VSCode 终端                | <Icon icon="check" />  VSCode | <Icon icon="check" /> | <Icon icon="check" />        |

### 配置灵活性

| 助手             | 系统配置                  | 项目配置                                     | 环境变量                                     | 团队共享                                     |
| -------------- | --------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Claude Code    | <Icon icon="check" /> | <Icon icon="check" />                    | <Icon icon="check" />                    | <Icon icon="check" />                    |
| Codex/Windsurf | <Icon icon="check" /> | <Icon icon="xmark" />                    | <Icon icon="check" />                    | <Icon icon="triangle-exclamation" />  有限 |
| OpenCode       | <Icon icon="check" /> | <Icon icon="check" />                    | <Icon icon="check" />                    | <Icon icon="check" />                    |
| Kilocode       | <Icon icon="check" /> | <Icon icon="check" />                    | <Icon icon="check" />                    | <Icon icon="check" />                    |
| RooCode        | <Icon icon="check" /> | <Icon icon="triangle-exclamation" />  导入 | <Icon icon="triangle-exclamation" />  有限 | <Icon icon="triangle-exclamation" />  导出 |
| Cline          | <Icon icon="check" /> | <Icon icon="check" />                    | <Icon icon="check" />                    | <Icon icon="check" />                    |

## 最佳实践

<CardGroup cols={2}>
  <Card title="使用环境变量" icon="key">
    将 API 密钥存储在环境变量中,切勿提交到版本控制
  </Card>

  <Card title="团队使用项目级配置" icon="users">
    使用项目级配置共享设置,本地文件存储个人密钥
  </Card>

  <Card title="选择正确的助手" icon="compass">
    自动化/CI/CD 使用 CLI,交互式编码和可视化工作流使用 GUI
  </Card>

  <Card title="测试配置" icon="flask">
    在配置助手之前使用 curl 验证 API 连接
  </Card>

  <Card title="保持密钥安全" icon="lock">
    将敏感文件添加到 .gitignore,开发/生产使用不同的密钥
  </Card>

  <Card title="定期更新" icon="rotate">
    保持助手更新以获得最新功能、安全补丁和错误修复
  </Card>
</CardGroup>

## 后续步骤

<CardGroup cols={3}>
  <Card title="Claude Code" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" href="/cn/agents/claude" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    CLI 与 JSON 配置
  </Card>

  <Card title="Codex/Windsurf" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" href="/cn/agents/codex" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    CLI 与 TOML 配置
  </Card>

  <Card title="OpenCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" href="/cn/agents/opencode" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    CLI 与自动获取
  </Card>

  <Card title="Kilocode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" href="/cn/agents/kilocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    VSCode 扩展
  </Card>

  <Card title="RooCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" href="/cn/agents/roocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    独立应用
  </Card>

  <Card title="Cline" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" href="/cn/agents/cline" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    VSCode + 自主功能
  </Card>
</CardGroup>

<CardGroup cols={2}>
  <Card title="模型目录" icon="layer-group" href="/cn/home/models">
    浏览所有可用模型
  </Card>

  <Card title="API 参考" icon="book" href="/cn/api-reference/introduction">
    直接 API 集成
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt