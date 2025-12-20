# 提高输出一致性

学习如何使Claude的响应更加一致，包括指定输出格式、预填充响应、使用示例约束和检索上下文等技术。

---

<Tip>
**对于保证JSON模式符合性**

如果您需要Claude始终输出符合特定模式的有效JSON，请使用[结构化输出](/docs/zh-CN/build-with-claude/structured-outputs)，而不是下面的提示工程技术。结构化输出提供保证的模式符合性，专门为此用例设计。

下面的技术对于一般输出一致性或当您需要超越严格JSON模式的灵活性时很有用。
</Tip>

以下是如何使Claude的响应更加一致的方法：

## 指定所需的输出格式
使用JSON、XML或自定义模板精确定义您所需的输出格式，以便Claude理解您需要的每个输出格式元素。

<section title="示例：标准化客户反馈">

    | 角色 | 内容 |
    | ---- | ------- |
    | 用户 | 你是一个客户洞察AI。分析这个反馈并以JSON格式输出，包含以下键："sentiment"（正面/负面/中立）、"key_issues"（列表）和"action_items"（包含"team"和"task"的字典列表）。<br/><br/>"我已经是忠实用户3年了，但最近的UI更新是一场灾难。现在找到基本功能就像寻宝游戏。而且，新的'高级'定价太离谱了。除非立即修复，否则我正在考虑转换。" |
    | 助手 | \{<br/>  "sentiment": "negative",<br/>  "key_issues": [<br/>    "最近更新中的UI/UX不佳",<br/>    "难以找到基本功能",<br/>    "认为定价高（新的'高级'层级）"<br/>  ],<br/>  "action_items": [<br/>    \{<br/>      "team": "Product",<br/>      "task": "进行可用性测试并根据发现迭代UI"<br/>    \},<br/>    \{<br/>      "team": "UX",<br/>      "task": "创建功能发现指南或入职流程"<br/>    \},<br/>    \{<br/>      "team": "Marketing",<br/>      "task": "审查定价策略并传达价值主张"<br/>    \},<br/>    \{<br/>      "team": "Customer Success",<br/>      "task": "联系用户，提供优惠以防止流失"<br/>    \}<br/>  ]<br/>\} |

</section>

## 预填充Claude的响应
使用您所需的格式预填充`Assistant`轮次。这个技巧绕过Claude的友好前言并强制执行您的结构。

<section title="示例：每日销售报告">

    | 角色 | 内容 |
    | ---- | ------- |
    | 用户 | 你是一个富有洞察力的销售智能AI。生成今天的销售报告。<br/><br/>按照这样的方式构建报告：<br/><br/>\<report><br/>    \<summary><br/>        \<metric name="total_revenue">\$0.00\</metric><br/>        \<metric name="units_sold">0\</metric><br/>        \<metric name="avg_order_value">\$0.00\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>产品名称\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<units>0\</units><br/>        \</product><br/>        ...<br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>地区名称\</name><br/>            \<revenue>\$0.00\</revenue><br/>            \<growth>0.0%\</growth><br/>        \</region><br/>        ...<br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>行动项。\</item><br/>        ...<br/>    \</action_items><br/>\</report> |
    | 助手（预填充） | \<report><br/>    \<summary><br/>        \<metric name= |
    | 助手 | "total_revenue">\$842,567.00\</metric><br/>        \<metric name="units_sold">15,238\</metric><br/>        \<metric name="avg_order_value">\$55.29\</metric><br/>    \</summary><br/>    \<top_products><br/>        \<br/>            \<name>AcmeGuard Pro\</name><br/>            \<revenue>\$325,890.00\</revenue><br/>            \<units>3,621\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeVault Enterprise\</name><br/>            \<revenue>\$254,400.00\</revenue><br/>            \<units>1,272\</units><br/>        \</product><br/>        \<br/>            \<name>AcmeBoost XL\</name><br/>            \<revenue>\$147,690.00\</revenue><br/>            \<units>4,923\</units><br/>        \</product><br/>    \</top_products><br/>    \<regional_performance><br/>        \<region><br/>            \<name>APAC\</name><br/>            \<revenue>\$258,960.00\</revenue><br/>            \<growth>12.8%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>EMEA\</name><br/>            \<revenue>\$325,478.00\</revenue><br/>            \<growth>3.2%\</growth><br/>        \</region><br/>        \<region><br/>            \<name>Americas\</name><br/>            \<revenue>\$258,129.00\</revenue><br/>            \<growth>-2.1%\</growth><br/>        \</region><br/>    \</regional_performance><br/>    \<action_items><br/>        \<item>调查Americas收入下降；安排地区销售团队会议。\</item><br/>        \<item>加快CloudGuard Pro在APAC的推出以利用增长。\</item><br/>        \<item>审查NetBoost XL定价；销量高但收入较低。\</item><br/>    \</action_items><br/>\</report> |

</section>

## 使用示例进行约束
提供您所需输出的示例。这比抽象指令更好地训练Claude的理解。

<section title="示例：生成一致的市场情报">

    | 角色 | 内容 |
    | ---- | ------- |
    | 用户 | 作为市场情报AI，您的任务是分析有关我们竞争对手的数据。以下是我们的竞争对手数据：<br/>\<data><br/>\{\{DATA}}<br/>\</data><br/><br/>按照以下示例格式输出：<br/><br/>\<competitor><br/>  \<name>Rival Inc\</name><br/>  \<overview>50字摘要。\</overview><br/>  \<swot><br/>    \<strengths>- 要点\</strengths><br/>    \<weaknesses>- 要点\</weaknesses><br/>    \<opportunities>- 要点\</opportunities><br/>    \<threats>- 要点\</threats><br/>  \</swot><br/>  \<strategy>30字战略回应。\</strategy><br/>\</competitor><br/><br/>现在，使用此格式分析AcmeGiant和AcmeDataCo。 |
    | 助手 | \<competitor><br/>  \<name>AcmeGiant\</name><br/>  \<overview>全球科技领导者，拥有庞大的消费者和企业产品生态系统。以创新、强大品牌和通过集成硬件、软件和服务的深度客户锁定而闻名。\</overview><br/>  \<swot><br/>    \<strengths><br/>      - 庞大的研发预算推动持续创新<br/>      - 忠实的客户基础和强大的品牌认可度<br/>      - 协同产品生态系统增加转换成本<br/>    \</strengths><br/>    \<weaknesses><br/>      - 高价格可能会阻止成本敏感的客户<br/>      - 缓慢应对企业特定的定制需求<br/>      - 隐私问题和多个市场的监管审查<br/>    \</weaknesses><br/>    \<opportunities><br/>      - 对AI和ML功能的需求不断增长<br/>      - 扩展到新兴市场<br/>      - 通过收购填补产品或人才空缺<br/>    \</opportunities><br/>    \<threats><br/>      - 云原生竞争对手的快速崛起<br/>      - 反垄断诉讼和监管行动<br/>      - 初创公司和竞争对手的人才挖角<br/>    \</threats><br/>  \</swot><br/>  \<strategy>专注于我们的敏捷性和定制化。在营销中针对TechGiant的缓慢企业响应和隐私问题。\</strategy><br/>\</competitor><br/><br/>\<competitor><br/>  \<name>AcmeDataCo\</name><br/>  \<overview>数据分析和可视化领域的新星。提供直观的自助式BI工具，采用免费增值模式，吸引初创公司和企业团队。\</overview><br/>  \<swot><br/>    \<strengths><br/>      - 用户友好的界面减少了专业培训的需求<br/>      - 免费增值模式降低进入壁垒，推动病毒式增长<br/>      - 与数据驱动决策的兴起有强大的产品市场契合度<br/>    \</strengths><br/>    \<weaknesses><br/>      - 与成熟的BI工具相比，高级分析功能有限<br/>      - 报告的大型数据集扩展问题<br/>      - 依赖第三方云基础设施（AWS）<br/>    \</weaknesses><br/>    \<opportunities><br/>      - 扩展到预测分析和AI驱动的洞察<br/>      - 与互补技术供应商建立战略联盟<br/>      - 针对行业特定解决方案的可定制仪表板<br/>    \</opportunities><br/>    \<threats><br/>      - 市场饱和；自助式BI中有许多新进入者<br/>      - 企业BI巨头开发更用户友好的工具<br/>      - 数据隐私法规增加合规复杂性<br/>    \</threats><br/>  \</swot><br/>  \<strategy>突出我们强大的企业功能和数据治理。针对与DataCo的规模限制作斗争的账户。\</strategy><br/>\</competitor> |

</section>

## 使用检索实现上下文一致性
对于需要一致上下文的任务（例如聊天机器人、知识库），使用检索将Claude的响应基于固定信息集。

<section title="示例：增强IT支持一致性">

    | 角色 | 内容 |
    | ---- | ------- |
    | 用户 | 你是我们的IT支持AI，利用知识库数据。以下是来自您知识库的条目：<br/><br/>\<kb><br/>  \<entry><br/>    \<id>1\</id><br/>    \<title>重置Active Directory密码\</title><br/>    \<content>1. 转到password.ourcompany.com<br/>2. 输入您的用户名<br/>3. 点击"忘记密码"<br/>4. 按照电子邮件说明操作\</content><br/>  \</entry><br/>  \<entry><br/>    \<id>2\</id><br/>    \<title>连接到VPN\</title><br/>    \<content>1. 从软件中心安装GlobalProtect<br/>2. 打开GlobalProtect，输入"vpn.ourcompany.com"<br/>3. 使用AD凭证登录\</content><br/>  \</entry><br/>\</kb><br/><br/>在帮助用户时，始终先检查知识库。按照以下格式响应：<br/><br/>\<response><br/>  \<kb_entry>使用的知识库条目\</kb_entry><br/>  \<answer>您的响应\</answer><br/>\</response> 为自己写一些测试问题并使用知识库回答它们，以确保您理解如何正确使用知识库。 |
    | 助手 | 明白了。我将使用知识库进行一致的响应。让我们用几个场景进行测试。<br/><br/>用户：嘿，我无法登录我的电子邮件。我认为我忘记了密码。<br/><br/>\<response><br/>  \<kb_entry>1：重置Active Directory密码\</kb_entry><br/>  \<answer>我理解您由于忘记密码而无法登录电子邮件。没关系，这是一个常见问题。要重置用于电子邮件访问的Active Directory密码，请按照以下步骤操作：<br/><br/>1. 转到password.ourcompany.com<br/>2. 输入您的用户名（与您的电子邮件地址相同）<br/>3. 点击"忘记密码"链接<br/>4. 您将收到一封包含说明的电子邮件。按照说明重置您的密码。<br/><br/>重置后，您应该能够登录您的电子邮件。如果您需要进一步的帮助，请告诉我。\</answer><br/>\</response><br/><br/>用户：我今天在家工作。我如何访问内部资源？<br/><br/>\<response><br/>  \<kb_entry>2：连接到VPN\</kb_entry><br/>  \<answer>很好的问题！要在家工作时访问内部资源，您需要连接到我们公司的VPN（虚拟专用网络）。以下是设置方法：<br/><br/>1. 首先，安装GlobalProtect VPN客户端。您可以在我们的软件中心找到它。<br/>2. 安装后，打开GlobalProtect应用程序。<br/>3. 在服务器字段中，输入"vpn.ourcompany.com"。<br/>4. 使用您的Active Directory（AD）凭证登录 - 与您用于电子邮件的用户名和密码相同。<br/><br/>连接后，您将能够安全地访问所有内部资源，就像您在办公室一样。如果您在设置过程中遇到任何问题，请告诉我。\</answer><br/>\</response> |

</section>

## 为复杂任务链接提示
将复杂任务分解为较小的、一致的子任务。每个子任务都获得Claude的全部关注，减少跨扩展工作流的不一致错误。