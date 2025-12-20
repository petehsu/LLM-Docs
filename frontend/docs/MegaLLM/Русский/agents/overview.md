# Обзор AI-агентов для кодирования

> Настройка AI-агентов для использования MegaLLM - CLI инструменты и GUI расширения

MegaLLM поддерживает все основные AI-агенты для кодирования. Это единое руководство охватывает настройку Claude Code, Codex/Windsurf, OpenCode, Kilocode, RooCode и Cline.

## Доступные агенты

<CardGroup cols={3}>
  <Card title="Claude Code" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" href="/ru/agents/claude" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    CLI + интеграция с редактором через JSON конфигурацию
  </Card>

  <Card title="Codex/Windsurf" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" href="/ru/agents/codex" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    CLI + редактор с TOML конфигурацией
  </Card>

  <Card title="OpenCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" href="/ru/agents/opencode" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    CLI + редактор с автоматической загрузкой моделей
  </Card>

  <Card title="Kilocode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" href="/ru/agents/kilocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    Расширение VSCode с встроенным чатом (CLI скоро)
  </Card>

  <Card title="RooCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" href="/ru/agents/roocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    Отдельное приложение с визуальным интерфейсом
  </Card>

  <Card title="Cline" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" href="/ru/agents/cline" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    Расширение VSCode с автономными задачами (CLI скоро)
  </Card>
</CardGroup>

## Быстрое сравнение

| Агент              | Интерфейсы           | Формат конфигурации | Уровень конфигурации                | Лучше для                                 |
| ------------------ | -------------------- | ------------------- | ----------------------------------- | ----------------------------------------- |
| **Claude Code**    | CLI + VSCode         | JSON                | Система + Проект                    | Терминальные процессы, интеграция VSCode  |
| **Codex/Windsurf** | CLI + Редактор       | TOML                | Только система                      | Опытные пользователи, Cascade AI          |
| **OpenCode**       | CLI + Редактор       | JSON                | Система + Проект                    | Переключение моделей, гибкость            |
| **Kilocode**       | VSCode (CLI скоро)   | Настройки VSCode    | Пользователь + Рабочее пространство | Встроенный чат, автодополнение кода       |
| **RooCode**        | Отдельное приложение | JSON                | Уровень приложения                  | Визуальный UI, автономный рабочий процесс |
| **Cline**          | VSCode (CLI скоро)   | Настройки VSCode    | Пользователь + Рабочее пространство | Автономные задачи, операции терминала     |

## Типы агентов

### CLI-первые агенты (с поддержкой редактора)

<CardGroup cols={3}>
  <Card title="Claude Code" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    * CLI-первый дизайн
    * Доступно расширение VSCode
    * JSON конфигурация
    * Системный и проектный уровень
    * Поддержка строки состояния
  </Card>

  <Card title="Codex/Windsurf" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    * CLI-первый дизайн
    * Интеграции с редактором
    * TOML конфигурация
    * Cascade AI (Windsurf)
    * Функции Supercomplete
  </Card>

  <Card title="OpenCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    * CLI-первый дизайн
    * Доступны плагины для редактора
    * JSON конфигурация
    * Автозагрузка моделей
    * Поддержка нескольких провайдеров
  </Card>
</CardGroup>

**Когда использовать CLI-первые агенты:**

* Терминальные рабочие процессы
* Интеграция CI/CD
* Серверные среды
* Скриптинг и автоматизация
* Также отлично работают в редакторах с расширениями

### Агенты только для редактора (CLI скоро)

<CardGroup cols={3}>
  <Card title="Kilocode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    * Расширение VSCode (основное)
    * CLI на обслуживании
    * Интерфейс встроенного чата
    * Автодополнение кода
    * Интеграция с деревом файлов
  </Card>

  <Card title="RooCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    * Отдельное приложение
    * Визуальный интерфейс
    * Поддержка нескольких проектов
    * Функции проверки кода
  </Card>

  <Card title="Cline" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    * Расширение VSCode (основное)
    * CLI на обслуживании
    * Автономное выполнение задач
    * Интеграция с терминалом
    * Поддержка Git-процессов
  </Card>
</CardGroup>

<Info>
  **Поддержка CLI для Kilocode и Cline:** CLI версии в настоящее время на обслуживании и будут доступны в ближайшее время. Используйте расширения VSCode пока что.
</Info>

**Когда использовать агенты, ориентированные на редактор:**

* Чисто визуальные рабочие процессы редактирования
* Встроенные предложения и автодополнения
* Рефакторинг нескольких файлов
* Процессы проверки кода
* Нативный опыт IDE

## Начало работы

<Steps>
  <Step title="Выберите своего агента">
    Выберите CLI-агента для терминальных процессов или GUI-агента для визуального редактирования
  </Step>

  <Step title="Получите API-ключ">
    Зарегистрируйтесь на [панели MegaLLM](https://megallm.io/dashboard) и получите свой API-ключ, начинающийся с `sk-mega-`
  </Step>

  <Step title="Настройте своего агента">
    Следуйте конкретному руководству по настройке для выбранного агента (ссылки ниже)
  </Step>

  <Step title="Начните кодировать">
    Запустите своего агента и начните использовать помощь в кодировании с ИИ
  </Step>
</Steps>

## Руководства по настройке

### CLI-первые агенты (также работают в редакторах)

<AccordionGroup>
  <Accordion title="Claude Code - CLI + VSCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    **Работает как:** CLI инструмент + расширение VSCode

    **Файлы конфигурации:**

    * Система: `~/.claude/settings.json`
    * Проект: `./.claude/settings.json`
    * Локальный: `./.claude/settings.local.json`

    **Быстрая настройка:**

    ```json  theme={null}
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io",
        "ANTHROPIC_API_KEY": "sk-mega-your-api-key-here"
      }
    }
    ```

    [Полное руководство по настройке Claude Code →](/ru/agents/claude)
  </Accordion>

  <Accordion title="Codex/Windsurf - CLI + Редактор" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    **Работает как:** CLI инструмент + интеграции с редактором (Windsurf - улучшенный вариант)

    **Файл конфигурации:**

    * Система: `~/.codex/config.toml` (только)

    **Быстрая настройка:**

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

    [Полное руководство по настройке Codex/Windsurf →](/ru/agents/codex)
  </Accordion>

  <Accordion title="OpenCode - CLI + Плагины для редактора" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    **Работает как:** CLI инструмент + плагины для редактора (VSCode, Vim и т.д.)

    **Файлы конфигурации:**

    * Система: `~/.config/opencode/opencode.json`
    * Проект: `./.opencode/opencode.json`

    **Быстрая настройка:**

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

    [Полное руководство по настройке OpenCode →](/ru/agents/opencode)
  </Accordion>
</AccordionGroup>

### Агенты только для редактора

<AccordionGroup>
  <Accordion title="Kilocode - Расширение VSCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    **Расположение конфигурации:**

    * Настройки пользователя (глобальные): UI настроек VSCode или `settings.json`
    * Настройки рабочего пространства (проект): `.vscode/settings.json`

    **Быстрая настройка (settings.json):**

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

    **Переменная окружения:**

    ```bash  theme={null}
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"
    ```

    [Полное руководство по настройке Kilocode →](/ru/agents/kilocode)
  </Accordion>

  <Accordion title="RooCode - Отдельное приложение" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    **Расположение конфигурации:**

    * Windows: `%APPDATA%\RooCode\config.json`
    * macOS: `~/Library/Application Support/RooCode/config.json`
    * Linux: `~/.config/roocode/config.json`

    **Быстрая настройка:**

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

    [Полное руководство по настройке RooCode →](/ru/agents/roocode)
  </Accordion>

  <Accordion title="Cline - Расширение VSCode с автономией" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    **Расположение конфигурации:**

    * Настройки пользователя (глобальные): UI настроек VSCode или `settings.json`
    * Настройки рабочего пространства (проект): `.vscode/settings.json`

    **Быстрая настройка для моделей GPT (формат OpenAI):**

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

    **Быстрая настройка для моделей Claude (формат Anthropic):**

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

    **Переменная окружения:**

    ```bash  theme={null}
    export MEGALLM_API_KEY="sk-mega-your-api-key-here"
    ```

    [Полное руководство по настройке Cline →](/ru/agents/cline)
  </Accordion>
</AccordionGroup>

## Выбор модели

Все агенты поддерживают одинаковые модели через MegaLLM:

### Модели GPT

* `gpt-5` - Последняя модель GPT (рекомендуется)
* `gpt-4` - GPT-4
* `gpt-4o` - GPT-4 Оптимизированный
* `gpt-4o-mini` - Быстрый, экономичный

### Модели Claude

* `claude-opus-4-1-20250805` - Самая мощная
* `claude-sonnet-4` - Сбалансированная (рекомендуется)
* `claude-haiku-4` - Быстрая, эффективная

### Модели Gemini

* `gemini-2.5-pro` - Последний Gemini
* `gemini-2.0-flash` - Быстрые ответы

[Смотреть полный каталог моделей →](/ru/home/models)

## Переменные окружения

Большинство агентов поддерживают переменные окружения для API-ключей:

```bash  theme={null}
# Для CLI-агентов и некоторых GUI-агентов
export MEGALLM_API_KEY="sk-mega-your-api-key-here"

# Специально для Claude Code
export ANTHROPIC_BASE_URL="https://ai.megallm.io"
export ANTHROPIC_API_KEY="sk-mega-your-api-key-here"
```

Добавьте в конфигурацию вашей оболочки:

* Bash: `~/.bashrc`
* Zsh: `~/.zshrc`
* Fish: `~/.config/fish/config.fish`

## Общие шаблоны конфигурации

### Шаблон 1: Системный уровень для личного использования

**Лучше для**: Личные проекты, один пользователь

<Tabs>
  <Tab title="Claude Code">
    ```bash  theme={null}
    # Системная конфигурация
    ~/.claude/settings.json

    # Переменные окружения
    export ANTHROPIC_BASE_URL="https://ai.megallm.io"
    export ANTHROPIC_API_KEY="sk-mega-your-key"
    ```
  </Tab>

  <Tab title="Kilocode">
    ```bash  theme={null}
    # Пользовательские настройки VSCode
    # Файл > Настройки > Параметры > Поиск "kilocode"

    # Переменная окружения
    export MEGALLM_API_KEY="sk-mega-your-key"
    ```
  </Tab>

  <Tab title="RooCode">
    ```bash  theme={null}
    # Конфигурация приложения
    ~/.config/roocode/config.json

    # Сохраните API-ключ в конфиге или используйте переменную окружения
    ```
  </Tab>
</Tabs>

### Шаблон 2: Уровень проекта для команд

**Лучше для**: Командные проекты, общая конфигурация

<Tabs>
  <Tab title="Claude Code">
    ```bash  theme={null}
    # Общая конфигурация (в репозитории)
    .claude/settings.json
    {
      "env": {
        "ANTHROPIC_BASE_URL": "https://ai.megallm.io"
      }
    }

    # Личный ключ (не в репозитории)
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
    # Настройки рабочего пространства (в репозитории)
    .vscode/settings.json
    {
      "kilocode.apiProvider": "custom",
      "kilocode.customProvider": {
        "name": "MegaLLM",
        "baseURL": "https://ai.megallm.io/v1",
        "apiKey": "${env:MEGALLM_API_KEY}"
      }
    }

    # Члены команды устанавливают свою переменную окружения
    export MEGALLM_API_KEY="personal-key"
    ```
  </Tab>

  <Tab title="OpenCode">
    ```bash  theme={null}
    # Конфигурация проекта (в репозитории)
    .opencode/opencode.json
    {
      "providers": [{
        "baseURL": "https://ai.megallm.io/v1"
      }]
    }

    # Личный ключ через переменную окружения
    export MEGALLM_API_KEY="personal-key"
    ```
  </Tab>
</Tabs>

### Шаблон 3: Конфигурация с несколькими моделями

**Лучше для**: Использование разных моделей для разных задач

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
          "name": "GPT для чата",
          "model": "gpt-5",
          "useFor": ["chat", "completion"]
        },
        {
          "name": "Claude для проверки",
          "model": "claude-sonnet-4",
          "useFor": ["review", "analysis"]
        }
      ]
    }
    ```
  </Tab>
</Tabs>

## Устранение неполадок

<AccordionGroup>
  <Accordion title="API-ключ не работает">
    **Проверьте ваш API-ключ:**

    ```bash  theme={null}
    # Проверьте, начинается ли он с sk-mega-
    echo $MEGALLM_API_KEY

    # Протестируйте API напрямую
    curl -H "Authorization: Bearer $MEGALLM_API_KEY" \
         https://ai.megallm.io/v1/models
    ```

    **Распространенные проблемы:**

    * Отсутствует префикс `sk-mega-`
    * Лишние пробелы или кавычки
    * Неправильное имя переменной окружения
    * Конфигурация оболочки не перезагружена (выполните `source ~/.bashrc`)
  </Accordion>

  <Accordion title="Неправильная конечная точка API">
    **Проверьте ваш базовый URL:**

    Для **формата совместимого с OpenAI** (GPT, Gemini):

    ```
    https://ai.megallm.io/v1  <Icon icon="check" /> (с /v1)
    ```

    Для **формата Anthropic** (Claude):

    ```
    https://ai.megallm.io  <Icon icon="check" /> (без /v1)
    ```

    **Конечные точки для конкретных агентов:**

    * Claude Code: `https://ai.megallm.io` (без /v1)
    * Codex/Windsurf: `https://ai.megallm.io/v1`
    * OpenCode: `https://ai.megallm.io/v1`
    * Kilocode: `https://ai.megallm.io/v1`
    * RooCode: `https://ai.megallm.io/v1`
    * Cline: `https://ai.megallm.io` (Anthropic) или `https://ai.megallm.io/v1` (OpenAI)
  </Accordion>

  <Accordion title="Модель не найдена">
    **Проверьте написание имени модели:**

    Проверьте [каталог моделей](/ru/home/models) для точных имен моделей:

    ```bash  theme={null}
    # Распространенные ошибки:
    "gpt5"           <Icon icon="xmark" />  # Отсутствует дефис
    "gpt-5"          <Icon icon="check" />

    "claude-sonnet"  <Icon icon="xmark" />  # Отсутствует версия
    "claude-sonnet-4" <Icon icon="check" />

    "gemini-pro"     <Icon icon="xmark" />  # Неправильная версия
    "gemini-2.5-pro" <Icon icon="check" />
    ```
  </Accordion>

  <Accordion title="Конфигурация не загружается">
    **Проверьте расположение файлов:**

    ```bash  theme={null}
    # CLI-агенты
    ls -la ~/.claude/settings.json      # Claude Code
    ls -la ~/.codex/config.toml         # Codex
    ls -la ~/.config/opencode/           # OpenCode

    # Конфигурации проектов
    ls -la .claude/settings.json         # Claude Code
    ls -la .opencode/opencode.json       # OpenCode
    ls -la .vscode/settings.json         # Расширения VSCode

    # Проверка синтаксиса JSON/TOML
    jq . ~/.claude/settings.json         # Тест JSON
    cat ~/.codex/config.toml | grep -    # Тест TOML
    ```

    **Проверьте права доступа:**

    ```bash  theme={null}
    chmod 644 ~/.claude/settings.json
    chmod 644 ~/.codex/config.toml
    ```
  </Accordion>

  <Accordion title="Переменные окружения не установлены">
    **Перезагрузите конфигурацию оболочки:**

    ```bash  theme={null}
    # Bash
    source ~/.bashrc

    # Zsh
    source ~/.zshrc

    # Fish
    source ~/.config/fish/config.fish

    # Проверка
    echo $MEGALLM_API_KEY
    echo $ANTHROPIC_BASE_URL
    ```

    **Проверьте, где она определена:**

    ```bash  theme={null}
    # Поиск во всех конфигурациях оболочки
    grep -r "MEGALLM_API_KEY" ~/.*rc ~/.config/
    ```
  </Accordion>
</AccordionGroup>

## Сравнение функций

### Интерфейсы и использование

| Агент          | CLI доступен                    | Редактор/GUI                             | Интерфейс чата                   | Редактирование нескольких файлов |
| -------------- | ------------------------------- | ---------------------------------------- | -------------------------------- | -------------------------------- |
| Claude Code    | <Icon icon="check" />  Основной | <Icon icon="check" />  Расширение VSCode | <Icon icon="check" />  CLI + GUI | <Icon icon="check" />            |
| Codex/Windsurf | <Icon icon="check" />  Основной | <Icon icon="check" />  Редактор          | <Icon icon="check" />  CLI + GUI | <Icon icon="check" />            |
| OpenCode       | <Icon icon="check" />  Основной | <Icon icon="check" />  Плагины           | <Icon icon="check" />  CLI + GUI | <Icon icon="check" />            |
| Kilocode       | <Icon icon="wrench" />  Скоро   | <Icon icon="check" />  Только VSCode     | <Icon icon="check" />  GUI       | <Icon icon="check" />            |
| RooCode        | <Icon icon="xmark" />           | <Icon icon="check" />  Отдельное         | <Icon icon="check" />  GUI       | <Icon icon="check" />            |
| Cline          | <Icon icon="wrench" />  Скоро   | <Icon icon="check" />  Только VSCode     | <Icon icon="check" />  GUI       | <Icon icon="check" />            |

### Интеграции

| Агент          | Доступ к терминалу                                 | Интеграция Git                    | Дерево файлов         | Проверка кода                      |
| -------------- | -------------------------------------------------- | --------------------------------- | --------------------- | ---------------------------------- |
| Claude Code    | <Icon icon="check" />  Нативный CLI                | <Icon icon="check" />  Нативный   | <Icon icon="check" /> | <Icon icon="check" />  В редакторе |
| Codex/Windsurf | <Icon icon="check" />  Нативный CLI                | <Icon icon="check" />  Нативный   | <Icon icon="check" /> | <Icon icon="check" />  В редакторе |
| OpenCode       | <Icon icon="check" />  Нативный CLI                | <Icon icon="check" />  Нативный   | <Icon icon="check" /> | <Icon icon="check" />  В редакторе |
| Kilocode       | <Icon icon="triangle-exclamation" />  Через VSCode | <Icon icon="check" />  VSCode     | <Icon icon="check" /> | <Icon icon="check" />              |
| RooCode        | <Icon icon="check" />  Встроенный                  | <Icon icon="check" />  Встроенный | <Icon icon="check" /> | <Icon icon="check" />              |
| Cline          | <Icon icon="check" />  Терминал VSCode             | <Icon icon="check" />  VSCode     | <Icon icon="check" /> | <Icon icon="check" />              |

### Гибкость конфигурации

| Агент          | Системная конфигурация | Конфигурация проекта                         | Переменные окружения                             | Совместное использование в команде               |
| -------------- | ---------------------- | -------------------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| Claude Code    | <Icon icon="check" />  | <Icon icon="check" />                        | <Icon icon="check" />                            | <Icon icon="check" />                            |
| Codex/Windsurf | <Icon icon="check" />  | <Icon icon="xmark" />                        | <Icon icon="check" />                            | <Icon icon="triangle-exclamation" />  Ограничено |
| OpenCode       | <Icon icon="check" />  | <Icon icon="check" />                        | <Icon icon="check" />                            | <Icon icon="check" />                            |
| Kilocode       | <Icon icon="check" />  | <Icon icon="check" />                        | <Icon icon="check" />                            | <Icon icon="check" />                            |
| RooCode        | <Icon icon="check" />  | <Icon icon="triangle-exclamation" />  Импорт | <Icon icon="triangle-exclamation" />  Ограничено | <Icon icon="triangle-exclamation" />  Экспорт    |
| Cline          | <Icon icon="check" />  | <Icon icon="check" />                        | <Icon icon="check" />                            | <Icon icon="check" />                            |

## Лучшие практики

<CardGroup cols={2}>
  <Card title="Используйте переменные окружения" icon="key">
    Храните API-ключи в переменных окружения, никогда не коммитьте их в систему контроля версий
  </Card>

  <Card title="Уровень проекта для команд" icon="users">
    Используйте конфигурацию уровня проекта для общих настроек, локальные файлы для личных ключей
  </Card>

  <Card title="Выберите правильного агента" icon="compass">
    CLI для автоматизации/CI/CD, GUI для интерактивного кодирования и визуальных процессов
  </Card>

  <Card title="Тестируйте конфигурацию" icon="flask">
    Проверьте API-соединение с curl перед настройкой агентов
  </Card>

  <Card title="Храните ключи в безопасности" icon="lock">
    Добавляйте конфиденциальные файлы в .gitignore, используйте разные ключи для разработки/продакшена
  </Card>

  <Card title="Регулярные обновления" icon="rotate">
    Обновляйте агенты для получения последних функций, исправлений безопасности и багов
  </Card>
</CardGroup>

## Следующие шаги

<CardGroup cols={3}>
  <Card title="Claude Code" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26979b4ab3c813d61504095afb8bb1a1" href="/ru/agents/claude" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/claude.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=558e245be93909f46fea68e1b628aee7 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0e4273b0a20dd686bc99407dd6720d81 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=94072d9e48f89984caae1c78c6b455e6 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=45b15f055ad48fe0616adabae3f2a603 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=2371c2502bf5be66c2ae24e526f01ee5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/claude.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=00e44f271ff71c089a94458ccd0618ef 2500w">
    CLI с JSON конфигурацией
  </Card>

  <Card title="Codex/Windsurf" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=5bbd1c4feca6af0fbfac0ad765b1696b" href="/ru/agents/codex" data-og-width="512" width="512" data-og-height="512" height="512" data-path="logo/codex.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=280&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=d85519862a146a5018228befa4d8adfa 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=560&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=13cc719cbce0071a62a22aa1154d69a7 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=840&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=8557cfda7ef723426eb4ea763fafbff1 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1100&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=16205461b0c039163b88d473261ef2f0 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=1650&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=c14a85a8a56abbbf9ea728a4703feba5 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/F9nt7LOHihlPvM1P/logo/codex.svg?w=2500&fit=max&auto=format&n=F9nt7LOHihlPvM1P&q=85&s=15c29f3f3d701ba128680e21f9c5c030 2500w">
    CLI с TOML конфигурацией
  </Card>

  <Card title="OpenCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=790702f153dab69c5961a9cf9e9db7af" href="/ru/agents/opencode" data-og-width="400" width="400" data-og-height="400" height="400" data-path="logo/opencode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f05e9ed66701fe69dd41d83d89ae218a 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=be0fb61f0526b242e3fa97eb28225708 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=fcb5be9068d71c43b5d7f85d3305ed22 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=27aae3a36b903da654ad0c610bf79278 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=26f559531271a43b5adf2108903cb343 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/opencode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8c1987ad64b34b55f20394eb12da0ca7 2500w">
    CLI с автозагрузкой
  </Card>

  <Card title="Kilocode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=99525076c0546a882a8c731ec28759ac" href="/ru/agents/kilocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/kilocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4be4eaa57b18ac9bf4f3ab66770fb5b3 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=8fde2dbe91d1246b161dbb36da1b4104 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=3e83c0149ca6cf99832a7a28cc1cc1c2 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=42a02ba9bbb410db0734f4af01ea0cd3 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=e81a8c398f62cd7c654d90e6bb61875d 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/kilocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=36d9caad2f048d74e4ccfeef0184bb82 2500w">
    Расширение VSCode
  </Card>

  <Card title="RooCode" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1517c9f8fa0cb55b8b3409f52e8c172f" href="/ru/agents/roocode" data-og-width="32" width="32" data-og-height="32" height="32" data-path="logo/roocode.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=434c79e374a8c579095475ef8ed6402f 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=82440d8e5b2f4fce142c17a4ba9e4fbd 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=eaa0d1ff941f389ee797855eed2e9f3b 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4a96ec710cb78af1a0df140874d05143 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=0cc02a2c167042c3b25c19f1b41c7fd6 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/roocode.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=ff0940180a45a294bbb03e7438bd887a 2500w">
    Отдельное приложение
  </Card>

  <Card title="Cline" icon="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=1f96191dea05c752380d70e31187bf72" href="/ru/agents/cline" data-og-width="16" width="16" data-og-height="16" height="16" data-path="logo/cline.svg" data-optimize="true" data-opv="3" srcset="https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=280&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=5cee4dd15d475ef2333531bb06113540 280w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=560&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=b504f1471943022ac69a1016dd6ff065 560w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=840&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=9f2b2cd0f8d2a0cfa62c08e1ede5ac4a 840w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1100&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=f6c59ac95af193afd95dfa7527615a61 1100w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=1650&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=366441f6bcf3f996f5ff5be453198dca 1650w, https://mintcdn.com/ghostlyticspaymentspvtltd/I3Glsm29CAoCIpN0/logo/cline.svg?w=2500&fit=max&auto=format&n=I3Glsm29CAoCIpN0&q=85&s=4414dba96783b1fd1c77c93be6e2e36b 2500w">
    VSCode + автономия
  </Card>
</CardGroup>

<CardGroup cols={2}>
  <Card title="Каталог моделей" icon="layer-group" href="/ru/home/models">
    Просмотреть все доступные модели
  </Card>

  <Card title="Справочник API" icon="book" href="/ru/api-reference/introduction">
    Прямая интеграция API
  </Card>
</CardGroup>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt