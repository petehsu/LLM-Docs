# AI Coding Agents Overview

> Configure AI coding agents to use MegaLLM - CLI tools and GUI extensions

MegaLLM supports all major AI coding agents. This unified guide covers configuration for Claude Code, Codex/Windsurf, OpenCode, Kilocode, RooCode, and Cline.

## Available Agents

<CardGroup cols={3}>
  <Card title="Claude Code" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" href="/en/agents/claude" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    CLI + Editor integration with JSON config
  </Card>

  <Card title="Codex/Windsurf" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" href="/en/agents/codex" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    CLI + Editor with TOML config
  </Card>

  <Card title="OpenCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" href="/en/agents/opencode" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    CLI + Editor with auto-model fetching
  </Card>

  <Card title="Kilocode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" href="/en/agents/kilocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    VSCode extension with inline chat (CLI coming soon)
  </Card>

  <Card title="RooCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" href="/en/agents/roocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    Standalone app with visual interface
  </Card>

  <Card title="Cline" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" href="/en/agents/cline" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    VSCode extension with autonomous tasks (CLI coming soon)
  </Card>
</CardGroup>

## Quick Comparison

| Agent              | Interfaces        | Config Format   | Config Level     | Best For                               |
| ------------------ | ----------------- | --------------- | ---------------- | -------------------------------------- |
| **Claude Code**    | CLI + VSCode      | JSON            | System + Project | Terminal workflows, VSCode integration |
| **Codex/Windsurf** | CLI + Editor      | TOML            | System only      | Advanced users, Cascade AI             |
| **OpenCode**       | CLI + Editor      | JSON            | System + Project | Multi-model switching, flexibility     |
| **Kilocode**       | VSCode (CLI soon) | VSCode settings | User + Workspace | Inline chat, code completion           |
| **RooCode**        | Standalone app    | JSON            | App-level        | Visual UI, standalone workflow         |
| **Cline**          | VSCode (CLI soon) | VSCode settings | User + Workspace | Autonomous tasks, terminal ops         |

## Agent Types

### CLI-First Agents (with Editor Support)

<CardGroup cols={3}>
  <Card title="Claude Code" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    * CLI-first design
    * VSCode extension available
    * JSON configuration
    * System & project-level
    * Statusline support
  </Card>

  <Card title="Codex/Windsurf" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    * CLI-first design
    * Editor integrations
    * TOML configuration
    * Cascade AI (Windsurf)
    * Supercomplete features
  </Card>

  <Card title="OpenCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    * CLI-first design
    * Editor plugins available
    * JSON configuration
    * Auto-fetch models
    * Multi-provider support
  </Card>
</CardGroup>

**When to use CLI-first agents:**

* Terminal-based workflows
* CI/CD integration
* Server environments
* Scripting and automation
* Also work great in editors with extensions

### Editor-Only Agents (CLI Coming Soon)

<CardGroup cols={3}>
  <Card title="Kilocode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    * VSCode extension (primary)
    * CLI under maintenance
    * Inline chat interface
    * Code completion
    * File tree integration
  </Card>

  <Card title="RooCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    * Standalone app
    * Visual interface
    * Multi-project support
    * Code review features
  </Card>

  <Card title="Cline" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    * VSCode extension (primary)
    * CLI under maintenance
    * Autonomous task execution
    * Terminal integration
    * Git workflow support
  </Card>
</CardGroup>

<Info>
  **CLI Support for Kilocode & Cline:** CLI versions are currently under maintenance and will be available soon. Use the VSCode extensions in the meantime.
</Info>

**When to use editor-focused agents:**

* Pure visual editing workflows
* Inline suggestions and completions
* Multi-file refactoring
* Code review workflows
* IDE-native experience

## Getting Started

<Steps>
  <Step title="Choose Your Agent">
    Select a CLI agent for terminal workflows or a GUI agent for visual editing
  </Step>

  <Step title="Get Your API Key">
    Sign up at [MegaLLM Dashboard](https://megallm.io/dashboard) and get your API key starting with `sk-mega-`
  </Step>

  <Step title="Configure Your Agent">
    Follow the specific configuration guide for your chosen agent (linked below)
  </Step>

  <Step title="Start Coding">
    Launch your agent and start using AI-powered coding assistance
  </Step>
</Steps>

## Configuration Guides

### CLI-First Agents (also work in editors)

<AccordionGroup>
  <Accordion title="Claude Code - CLI + VSCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    **Works as:** CLI tool + VSCode extension

    **Configuration files:**

    * System: `~/.claude/settings.json`
    * Project: `./.claude/settings.json`
    * Local: `./.claude/settings.local.json`

    **Quick setup:**

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
        "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
      }
    }
    ```

    [Full Claude Code Configuration Guide →](/agents/claude)
  </Accordion>

  <Accordion title="Codex/Windsurf - CLI + Editor" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    **Works as:** CLI tool + Editor integrations (Windsurf is enhanced variant)

    **Configuration file:**

    * System: `~/.codex/config.toml` (only)

    **Quick setup:**

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

    [Full Codex/Windsurf Configuration Guide →](/agents/codex)
  </Accordion>

  <Accordion title="OpenCode - CLI + Editor Plugins" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    **Works as:** CLI tool + Editor plugins (VSCode, Vim, etc.)

    **Configuration files:**

    * System: `~/.config/opencode/opencode.json`
    * Project: `./.opencode/opencode.json`

    **Quick setup:**

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

    [Full OpenCode Configuration Guide →](/agents/opencode)
  </Accordion>
</AccordionGroup>

### Editor-Only Agents

<AccordionGroup>
  <Accordion title="Kilocode - VSCode Extension" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    **Configuration location:**

    * User Settings (global): VSCode Settings UI or `settings.json`
    * Workspace Settings (project): `.vscode/settings.json`

    **Quick setup (settings.json):**

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

    **Environment variable:**

    ```bash  theme={null}
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"
    ```

    [Full Kilocode Configuration Guide →](/agents/kilocode)
  </Accordion>

  <Accordion title="RooCode - Standalone App" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    **Configuration location:**

    * Windows: `%APPDATA%\RooCode\config.json`
    * macOS: `~/Library/Application Support/RooCode/config.json`
    * Linux: `~/.config/roocode/config.json`

    **Quick setup:**

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

    [Full RooCode Configuration Guide →](/agents/roocode)
  </Accordion>

  <Accordion title="Cline - VSCode Extension with Autonomy" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    **Configuration location:**

    * User Settings (global): VSCode Settings UI or `settings.json`
    * Workspace Settings (project): `.vscode/settings.json`

    **Quick setup for GPT models (OpenAI format):**

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

    **Quick setup for Claude models (Anthropic format):**

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

    **Environment variable:**

    ```bash  theme={null}
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"
    ```

    [Full Cline Configuration Guide →](/agents/cline)
  </Accordion>
</AccordionGroup>

## Model Selection

All agents support the same models through MegaLLM:

### GPT Models

* `gpt-5` - Latest GPT model (recommended)
* `gpt-4` - GPT-4
* `gpt-4o` - GPT-4 Optimized
* `gpt-4o-mini` - Fast, cost-effective

### Claude Models

* `claude-opus-4-1-20250805` - Most capable
* `claude-sonnet-4` - Balanced (recommended)
* `claude-haiku-4` - Fast, efficient

### Gemini Models

* `gemini-2.5-pro` - Latest Gemini
* `gemini-2.0-flash` - Fast responses

[See Full Model Catalog →](/home/models)

## Environment Variables

Most agents support environment variables for API keys:

```bash  theme={null}
# For CLI agents and some GUI agents
export MEGALLM_API_KEY="sk-mega-your-api-key-here"

# For Claude Code specifically
export ANTHROPIC_BASE_URL="https://ai.megallm.io"
export ANTHROPIC_API_KEY="sk-mega-your-api-key-here"
```

Add to your shell configuration:

* Bash: `~/.bashrc`
* Zsh: `~/.zshrc`
* Fish: `~/.config/fish/config.fish`

## Common Configuration Patterns

### Pattern 1: System-Level for Personal Use

**Best for**: Personal projects, single user

<Tabs>
  <Tab title="Claude Code">
    ```bash  theme={null}
    # System configuration
    ~/.claude/settings.json

    # Environment variables
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"
    export ANTHROPIC_API_KEY="sk-mega-your-key"
    ```
  </Tab>

  <Tab title="Kilocode">
    ```bash  theme={null}
    # VSCode User Settings
    # File > Preferences > Settings > Search "kilocode"

    # Environment variable
    export MEGALLM_API_KEY="sk-mega-your-key"
    ```
  </Tab>

  <Tab title="RooCode">
    ```bash  theme={null}
    # App configuration
    ~/.config/roocode/config.json

    # Store API key in config or use env var
    ```
  </Tab>
</Tabs>

### Pattern 2: Project-Level for Teams

**Best for**: Team projects, shared configuration

<Tabs>
  <Tab title="Claude Code">
    ```bash  theme={null}
    # Shared config (committed)
    .claude/settings.json
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
      }
    }

    # Personal key (not committed)
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
    # Workspace settings (committed)
    .vscode/settings.json
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "${env:MEGALLM_API_KEY}"
      }
    }

    # Team members set their own env var
    export MEGALLM_API_KEY="personal-key"
    ```
  </Tab>

  <Tab title="OpenCode">
    ```bash  theme={null}
    # Project config (committed)
    .opencode/opencode.json
    {
      "providers": [{
        "baseURL": "https://ai.megallm.io/v1"
      }]
    }

    # Personal key via env var
    export MEGALLM_API_KEY="personal-key"
    ```
  </Tab>
</Tabs>

### Pattern 3: Multi-Model Configuration

**Best for**: Using different models for different tasks

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

## Troubleshooting

<AccordionGroup>
  <Accordion title="API Key Not Working">
    **Verify your API key:**

    ```bash  theme={null}
    # Check it starts with sk-mega-
    echo $MEGALLM_API_KEY

    # Test the API directly
    curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
         https://ai.megallm.io/v1/models
    ```

    **Common issues:**

    * Missing `sk-mega-` prefix
    * Extra spaces or quotes
    * Wrong environment variable name
    * Shell config not reloaded (run `source ~/.bashrc`)
  </Accordion>

  <Accordion title="Wrong API Endpoint">
    **Check your base URL:**

    For **OpenAI-compatible format** (GPT, Gemini):

    ```
    https://ai.megallm.io/v1  <Icon icon="check" /> (with /v1)
    ```

    For **Anthropic format** (Claude):

    ```
    https://ai.megallm.io  <Icon icon="check" /> (no /v1)
    ```

    **Agent-specific endpoints:**

    * Claude Code: `https://ai.megallm.io` (no /v1)
    * Codex/Windsurf: `https://ai.megallm.io/v1`
    * OpenCode: `https://ai.megallm.io/v1`
    * Kilocode: `https://ai.megallm.io/v1`
    * RooCode: `https://ai.megallm.io/v1`
    * Cline: `https://ai.megallm.io` (Anthropic) or `https://ai.megallm.io/v1` (OpenAI)
  </Accordion>

  <Accordion title="Model Not Found">
    **Verify model name spelling:**

    Check [Models Catalog](/home/models) for exact model names:

    ```bash  theme={null}
    # Common mistakes:
    "gpt5"           <Icon icon="xmark" />  # Missing dash
    "gpt-5"          <Icon icon="check" />

    "claude-sonnet"  <Icon icon="xmark" />  # Missing version
    "claude-sonnet-4" <Icon icon="check" />

    "gemini-pro"     <Icon icon="xmark" />  # Wrong version
    "gemini-2.5-pro" <Icon icon="check" />
    ```
  </Accordion>

  <Accordion title="Configuration Not Loading">
    **Check file locations:**

    ```bash  theme={null}
    # CLI agents
    ls -la ~/.claude/settings.json      # Claude Code
    ls -la ~/.codex/config.toml         # Codex
    ls -la ~/.config/opencode/           # OpenCode

    # Project configs
    ls -la .claude/settings.json         # Claude Code
    ls -la .opencode/opencode.json       # OpenCode
    ls -la .vscode/settings.json         # VSCode extensions

    # Validate JSON/TOML syntax
    jq . ~/.claude/settings.json         # Test JSON
    cat ~/.codex/config.toml | grep -    # Test TOML
    ```

    **Check permissions:**

    ```bash  theme={null}
    chmod 644 ~/.claude/settings.json
    chmod 644 ~/.codex/config.toml
    ```
  </Accordion>

  <Accordion title="Environment Variables Not Set">
    **Reload your shell config:**

    ```bash  theme={null}
    # Bash
    source ~/.bashrc

    # Zsh
    source ~/.zshrc

    # Fish
    source ~/.config/fish/config.fish

    # Verify
    echo $MEGALLM_API_KEY
    echo $ANTHROPIC_BASE_URL
    ```

    **Check where it's defined:**

    ```bash  theme={null}
    # Search all shell configs
    grep -r "MEGALLM_API_KEY" ~/.*rc ~/.config/
    ```
  </Accordion>
</AccordionGroup>

## Feature Comparison

### Interfaces & Usage

| Agent          | CLI Available                       | Editor/GUI                         | Chat Interface                   | Multi-file Edit       |
| -------------- | ----------------------------------- | ---------------------------------- | -------------------------------- | --------------------- |
| Claude Code    | <Icon icon="check" />  Primary      | <Icon icon="check" />  VSCode ext  | <Icon icon="check" />  CLI + GUI | <Icon icon="check" /> |
| Codex/Windsurf | <Icon icon="check" />  Primary      | <Icon icon="check" />  Editor      | <Icon icon="check" />  CLI + GUI | <Icon icon="check" /> |
| OpenCode       | <Icon icon="check" />  Primary      | <Icon icon="check" />  Plugins     | <Icon icon="check" />  CLI + GUI | <Icon icon="check" /> |
| Kilocode       | <Icon icon="wrench" />  Coming soon | <Icon icon="check" />  VSCode only | <Icon icon="check" />  GUI       | <Icon icon="check" /> |
| RooCode        | <Icon icon="xmark" />               | <Icon icon="check" />  Standalone  | <Icon icon="check" />  GUI       | <Icon icon="check" /> |
| Cline          | <Icon icon="wrench" />  Coming soon | <Icon icon="check" />  VSCode only | <Icon icon="check" />  GUI       | <Icon icon="check" /> |

### Integrations

| Agent          | Terminal Access                                  | Git Integration                 | File Tree             | Code Review                      |
| -------------- | ------------------------------------------------ | ------------------------------- | --------------------- | -------------------------------- |
| Claude Code    | <Icon icon="check" />  Native CLI                | <Icon icon="check" />  Native   | <Icon icon="check" /> | <Icon icon="check" />  In editor |
| Codex/Windsurf | <Icon icon="check" />  Native CLI                | <Icon icon="check" />  Native   | <Icon icon="check" /> | <Icon icon="check" />  In editor |
| OpenCode       | <Icon icon="check" />  Native CLI                | <Icon icon="check" />  Native   | <Icon icon="check" /> | <Icon icon="check" />  In editor |
| Kilocode       | <Icon icon="triangle-exclamation" />  Via VSCode | <Icon icon="check" />  VSCode   | <Icon icon="check" /> | <Icon icon="check" />            |
| RooCode        | <Icon icon="check" />  Built-in                  | <Icon icon="check" />  Built-in | <Icon icon="check" /> | <Icon icon="check" />            |
| Cline          | <Icon icon="check" />  VSCode term               | <Icon icon="check" />  VSCode   | <Icon icon="check" /> | <Icon icon="check" />            |

### Configuration Flexibility

| Agent          | System Config         | Project Config                               | Env Vars                                      | Team Sharing                                  |
| -------------- | --------------------- | -------------------------------------------- | --------------------------------------------- | --------------------------------------------- |
| Claude Code    | <Icon icon="check" /> | <Icon icon="check" />                        | <Icon icon="check" />                         | <Icon icon="check" />                         |
| Codex/Windsurf | <Icon icon="check" /> | <Icon icon="xmark" />                        | <Icon icon="check" />                         | <Icon icon="triangle-exclamation" />  Limited |
| OpenCode       | <Icon icon="check" /> | <Icon icon="check" />                        | <Icon icon="check" />                         | <Icon icon="check" />                         |
| Kilocode       | <Icon icon="check" /> | <Icon icon="check" />                        | <Icon icon="check" />                         | <Icon icon="check" />                         |
| RooCode        | <Icon icon="check" /> | <Icon icon="triangle-exclamation" />  Import | <Icon icon="triangle-exclamation" />  Limited | <Icon icon="triangle-exclamation" />  Export  |
| Cline          | <Icon icon="check" /> | <Icon icon="check" />                        | <Icon icon="check" />                         | <Icon icon="check" />                         |

## Best Practices

<CardGroup cols={2}>
  <Card title="Use Environment Variables" icon="key">
    Store API keys in environment variables, never commit them to version control
  </Card>

  <Card title="Project-Level for Teams" icon="users">
    Use project-level config for shared settings, local files for personal keys
  </Card>

  <Card title="Choose Right Agent" icon="compass">
    CLI for automation/CI/CD, GUI for interactive coding and visual workflows
  </Card>

  <Card title="Test Configuration" icon="flask">
    Verify API connection with curl before configuring agents
  </Card>

  <Card title="Keep Keys Secure" icon="lock">
    Add sensitive files to .gitignore, use different keys for dev/prod
  </Card>

  <Card title="Regular Updates" icon="rotate">
    Keep agents updated for latest features, security patches, and bug fixes
  </Card>
</CardGroup>

## Next Steps

<CardGroup cols={3}>
  <Card title="Claude Code" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" href="/en/agents/claude" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    CLI with JSON config
  </Card>

  <Card title="Codex/Windsurf" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" href="/en/agents/codex" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    CLI with TOML config
  </Card>

  <Card title="OpenCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" href="/en/agents/opencode" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    CLI with auto-fetch
  </Card>

  <Card title="Kilocode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" href="/en/agents/kilocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    VSCode extension
  </Card>

  <Card title="RooCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" href="/en/agents/roocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    Standalone app
  </Card>

  <Card title="Cline" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" href="/en/agents/cline" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    VSCode + autonomy
  </Card>
</CardGroup>

<CardGroup cols={2}>
  <Card title="Models Catalog" icon="layer-group" href="/en/home/models">
    Browse all available models
  </Card>

  <Card title="API Reference" icon="book" href="/en/api-reference/introduction">
    Direct API integration
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt