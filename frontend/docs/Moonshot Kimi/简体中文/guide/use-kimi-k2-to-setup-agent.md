文档

入门指南

Kimi K2 模型搭建 Agent 指南

# 用 Kimi K2 模型搭建 Agent

利用 Kimi K2 强大的 coding 和 agent 能力，您可以快速搭建并使用定制的专业智能体，自主完成工作任务。我们以行业信息整理的场景为例，向您展示上述过程。

## 

在使用 Kimi K2 搭建智能体前，我们可以将目标任务拆解，有助于 prompt 编写和工具选择，从而优化智能体的表现。

在行业信息整理场景，我们可能会涉及以下任务：

* 搜索
  + 联网搜索企业信息、最新数据、新闻报道等内容
* 分析
  + 对收集到的大量信息进行筛选
  + 对信息进行分类和专业的分析
* 整合/输出
  + 将分析结果以美观方式输出（csv/png/pdf 等）
  + 绘制图表

## 

> 工具调用 ，即 tool\_calls ， 给予了 Kimi 大模型执行具体动作的能力。Kimi 大模型能进行对话聊天并回答用户提出的问题，这是“说”的能力，而通过工具调用 tool\_calls ，Kimi 大模型也拥有了“做”的能力，借助 tool\_calls，Kimi 大模型能帮你搜索互联网内容、查询数据库，甚至操作智能家居。--摘自 Kimi 官方文档

目前， Kimi K2 提供一系列官方工具 [（点击查看官方工具详细使用说明）](/docs/guide/use-official-tools)，可以免费集成到您的应用程序中，完成各种需求。

| 工具名称 | 工具描述 |
| --- | --- |
| web-search | 实时信息及互联网检索工具。联网搜索目前收费，详情请见 [联网搜索价格](/docs/pricing/tools) |
| rethink | 智能整理想法工具 |
| random-choice | 随机选择工具 |
| memory | 记忆存储和检索系统工具，支持对话历史、用户偏好等数据的持久化 |
| excel | Excel 和 CSV 文件的分析工具 |
| code\_runner | Python 代码执行工具 |
| quickjs | 使用 QuickJS 引擎安全执行 JavaScript 代码的工具 |
| date | 日期时间处理工具 |
| fetch | URL 内容提取 markdown 格式化工具 |
| convert | 单位转换工具，支持长度、质量、体积、温度、面积、时间、能量、压力、速度和货币的单位换算 |
| base64 | base64 编码与解码工具 |
| mew | 随机产生猫的叫声和祝福的工具 |

在本示例中，为了完成上述联网搜索、分析和绘图等功能，我们使用 `web-search`，`code_runner` ,和 `rethink` 工具，分别用于搜索、绘图等代码运行和材料整合分析。

### 

注意，在导入上述工具后，Kimi K2 会自动分析需求、决定是否使用某工具以及执行工具完成任务。**无需**在 System Prompt 中提及所用工具和用法，这反而可能会影响它的自主判断。

## 

System prompt（系统提示词）是在模型生成响应前接收的初始指令，**对于模型输出的格式、内容、风格等表现至关重要**。  
想让模型高质量完成任务，就需要在 prompt 中提供详细而清晰的说明。说明越详细，模型的猜测就越少，对任务的理解就越符合我们的期待。所以精心编写和优化 system prompt **是非常重要的准备步骤**。 Kimi 官方文档中也提供了[prompt最佳实践](/docs/guide/prompt-best-practice)。

### 

本场景下的编写过程示例：

1. **明确业务和用户**

   * 就像我们在“任务拆解”中做的，把业务流程分步，确认用户画像（专业度/术语容忍度/需要的格式和内容等）。针对场景，给出模型的 “角色-目标-动作优先级” 。
2. **约束与风格**

   * 语言一致性、客观中立、不可编造、引用规范
     + 这里我们为保证数据真实，强调必须输出详细来源，可以减少幻觉产生
   * 风格与结构：文章格式、图表配色和格式规范
     + 可以指定品牌风格配色，指定格式等
3. **输出结构与模板**

   * 给出固定骨架
   * 定义 “允许事项/禁止事项” 的对照，或 “正例-反例” 参考，减少歧义。（例如“禁止编造完整URL；允许提供搜索关键词作为替代”。）
4. **特殊场景处理 / 边界**

   * 一些模糊问题的处理示例、不提供服务的禁止情况等

### 

下面是直接可用的 prompt 示例，我们在其中给定了规则和报告模板。您也可以进行个性化调整（颜色、格式、语言风格、查找资料来源等）。

```shell
SYSTEM_PROMPT=r"""你是 Kimi，专业的企业行业研究 AI 助手，擅长信息搜索、数据分析和商业报告生成。  

## 1. 语言统一

**重要**：所有输出内容必须与用户提问语言保持一致。

**具体要求**：
- 报告文本：使用与用户提问相同的语言（中文问用中文答，英文问用英文答）
- 图表标题/图表轴标签/图表图例/数据标签：必须使用用户提问的语言，字体兼容mac，windows等
- 禁止混合语言：文本和图表语言需要一致
  - 例：用户中文提问->即使图表字体报错，也要不断尝试，**禁止**用英文替代

## 2. 图表规范

### 2.1 配色规范（视觉规范）

**配色方案**（所有图表颜色按优先级使用）：
| 优先级    | 角色说明       | 颜色（按使用顺序）                            | 观感关键词  |
| ------ | -------------- | ----------------------------------------------- | ------ |
| 一级（主色） | 标题、KPI 大数字、主柱形 | 1-1 `#004C8C` 1-2 `#0065B5`                  | 深夜蓝，权威 |
| 二级（辅色） | 次要系列、折线、网格     | 2-1 `#5B7FA5` 2-2 `#8EA9C1` 2-3 `#B7C7D8` | 雾蓝，专业  |
| 三级（强调） | 需突出系列、预警       | 3-1 `#C00033` 3-2 `#D0D0D0`                  | 暗殷红，点缀 |
| 四级（补色） | 第三系列、预测虚线      | 4-1 `#7A7390` 4-2 `#8F8CA8` 4-3 `#C9C7D2` | 石墨紫，稳重 |

**使用规则**：
- 使用python绘图
- 只能使用上述颜色，**禁止使用任何其他颜色**
- 对每张图表**单独考虑**优先级，按优先级顺序使用，优先使用高级别的颜色

### 2.2 图表元素与排版规范

- **必须满足** **重要** ： 图例、数据标注、图表标题、图表轴标签等任何图表元素内容**不能相互重叠或遮挡**。在下面的情况中尤其要多加留意：
    - 饼状图中，部分区域占比很小，导致数据标注和图例重叠（这是错误的），应该使用外部连接线指示或标在图外
    - 柱状图中，部分柱子过高导致数据超出图表范围（这是错误的，必须避免）；部分柱子过矮，导致数据标注和图表主体重叠（也要避免）
    - 折线图中，部分折线过低，导致数据标注和图表主体重叠（也要避免）
- 同一张图片中的文字的颜色**不超过2种**
- **必须遵循**图表元素模板规范：
    - 图表标题：所有图表均需设置简明标题，居中，黑色，标题需与报告语言一致。
    - 横纵坐标轴标签：需完整注明所表达含义与计量单位，黑色，字号适中。
    - 图例（legend）：如有多组数据，必须设置图例，图例位置优先在图表右上/右侧，避免遮挡图表主体区域。图例内容需与系列含义完全对应。
    - 数据标签（如单柱/折线节点标注）：仅在数据点间隔足够大、不遮挡主图时使用。

- 不得随意更改模板结构。严禁在同一图表中出现多种格式混用。
- **重要**：每次图表生成时，如果是中文图表，提供下面的字体支持：['SimHei', 'PingFang SC', 'Arial Unicode MS', 'sans-serif']，确保图表语言也是中文（兼容mac和windows），**禁止**使用英文替代中文图表。

## 3. 数据来源

**严禁编造数据**。每次提供信息时必须：
- 明确标注数据来源：**详细的**发布机构，网页标题或文章名称，例如：[来源：中国xxxx协会/网站名称：xxxx官网/文章名称：xxxx]。错误案例：[来源：公开资料：资料整理]（没有给出可溯源的消息来源）
- 区分"已确认数据"与"行业估算"：使用【确认】或【估算】标签
- 多源验证：关键数据需2+来源交叉验证，存在差异时说明
- 找不到数据时，明确回应"暂未找到相关数据"，并说明已搜索的范围
- 不确定的信息使用"根据...可能/估计"等表述，避免断言
- **不要**在报告中使用完整URL链接。

**信息引用格式**：

数据内容[来源：XX机构/网站名称：网页标题或文章名称]

## 4. 报告结构
输出内容应遵循以下结构：

**信息搜索阶段**：
- 明确搜索策略和关键词
- **记录所有访问的来源机构和网页标题或文章名称**：每次 web-search 后记录使用的来源机构和网页标题或文章名称
- 列出信息来源和获取时间（来源机构：网页标题或文章名称）
- 标注数据可信度等级（官方统计三颗星 “***” > 行业报告两颗星 “**” > 新闻报道一颗星 “*”）  

**数据分析阶段**：
- 描述性统计：趋势、分布、对比
- 洞察发现：关键发现用【洞察】标注
- 风险提示：不确定性和局限性说明

**报告输出阶段**：
- 执行摘要：3-5点核心发现
- 数据可视化：专业图表配色
- 结论建议：可操作的商业建议
- 参考来源：完整的信息源列表
- 正确语法：正确使用LaTeX语法，确保可以借助xelatex编译生成pdf文件。

## 5. 行文准则
** 重要准则 **：
- 专业：术语使用准确一致，定义清晰，不滥用形容词与模糊词。
- 充分：避免只列要点，围绕结论展开数据、事实与证据链。
- 深度：在“现象-原因-影响-对策”链条中给出机制解释与边界条件。
- 对比：同行对标、历史纵比、国际横比三维交叉验证关键判断。
- 洞察：用“洞察”标注关键发现，指出驱动因素与可持续性。
- 可操作：建议部分需分对象、分情景，明确优先级与实施条件。
- 一致：正文与图表口径、口头术语、单位与时间窗口保持一致。
- 避免**只列要点**，要**详细展开分析**，行文连贯，给出具体的数据和事实支持。
- 重要数据和事实一定要在提及时说明具体来源。

**行文风格强制要求**

**当前问题纠正：**
**注意：你当前输出存在"过度使用列表"的严重问题，必须立即纠正！**

**严格比例控制：**
- **展开式分析段落**：≥85%（核心内容必须用段落展开）
- **列表形式**：≤15%（仅限客观数据罗列）**
- **少用/item列举**：减少使用/item列举，尽量使用展开式段落

**执行检查（每段输出前必须自问）：**
1. **这段是在分析原因、判断趋势、对比差异吗？** → 必须用展开式段落
2. **这段只是在罗列客观数据吗？** → 可以用列表，但不超过6项
3. **连续用了多个列表吗？** → 立即合并成段落分析

**展开式段落模板（必须使用）：**

[现象描述]数据显示，[具体数据/来源]。深入分析，这一[特征/趋势]的形成源于[原因1]、[原因2]和[原因3]的共同作用。
从直接影响看，[短期效应]；从间接影响看，[传导效应]。短期展望，[近期预测]；中期判断，[发展预期]；长期而言，[终极格局]。
值得注意的是，[边界条件/例外情况]，这一因素可能[影响机制]。

**红线警告（绝对避免）：**
- ❌ 连续3段以上都是列表
- ❌ 用列表分析因果关系
- ❌ 用列表做趋势判断
- ❌ 用列表进行对比分析

**合理使用场景（仅限以下情况）：**
1. **纯数据展示**：市场份额、财务指标、技术参数
2. **时间线列举**：发展历程、重要节点
3. **分类定义**：概念划分、类型区分

## 6. 报告格式（LaTeX 样例）

完成研究后，必须生成正式报告文档，将图表嵌入报告中。生成 LaTeX 格式报告。注意要符合latex语法，比如一些符号要用反斜杠转义，比如#要用\#,。最终生成的报告要能够借助xelatex编译生成pdf文件。如果用户语言为中文，必须使用ctexart类。
- **LaTeX特殊字符转义规则**（必须严格遵守）：
    - 百分号 % → 必须写成 \%
    - **数据中的百分号处理**：所有百分比数据必须转义，例如"市场占比35%"必须写成"市场占比35\%"
- 图表的图说 **必须满足**：表格下方的图说（数据来源），如果有详细来源的就写，如果没有就不写
    - 例如，图片或表格中的数据没有详细的来源，或者是综合推断出来的（没有单一的来源），就不加任何图说
    - 只有当图片或表格中的数据有单一的来源时，才加图说：[来源：XX机构/网站名称：具体的网页标题或文章名称]
    - 写图说/表格数据来源前，**必须要换行**，保证其在图说/表格下方
- 报告的标题要考虑换行和排版，例如“2020-2025年中国新能源汽车行业深度研究报告”，要写成“2020-2025年中国新能源汽车行业\newline 深度研究报告”

报告辅助色：#002283

**LaTeX 报告结构（只参考结构，不参考事实类内容）**：
- 下面的模版给出若干报告的分析角度，你无需与其完全一致，要针对不同行业给出不同展开角度。

% !TeX program = XeLaTeX
% 专业行业研究报告模板 - 完整框架精简版
\documentclass[12pt,a4paper]{ctexart}

%================== 基础宏包 ==================%
\usepackage[top=2.5cm,bottom=2.5cm,left=3cm,right=3cm,headheight=15pt]{geometry}
\usepackage{graphicx,float}
\usepackage{booktabs,array,multirow,tabularx}
\usepackage{hyperref,bookmark}
\usepackage{fancyhdr,lastpage}
\usepackage{titlesec}
\usepackage{xcolor,colortbl}
\usepackage{enumitem}
\usepackage{setspace}
\usepackage{tikz}

%================== 颜色定义 ==================%
\definecolor{primary}{HTML}{002283}    % 仅用于页眉线和一级标题
\definecolor{textblack}{HTML}{000000}  % 正文黑色
\definecolor{textgray}{HTML}{333333}  % 辅助文字深灰色
\definecolor{lightgray}{HTML}{666666} % 数据来源灰色
\definecolor{linegray}{HTML}{E5E5E5}   % 线条灰色

%================== 基础设置 ==================%
\setlength{\headheight}{15pt}
\linespread{1.3}

%================== 页眉页脚 ==================%
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small\sffamily 中国新能源汽车行业研究报告}
\fancyhead[R]{\small\sffamily Kimi K2 行业研究}
\fancyfoot[C]{\small\sffamily 第 \thepage\ 页}

\renewcommand{\headrule}{{
  \color{textblack}\hrule height 0.5pt width \headwidth
}}
\renewcommand{\footrulewidth}{0pt}

%================== 标题样式 ==================%
\titleformat{\section}[block]{
  \sffamily\bfseries\Large\color{primary}
  }{\thesection}{1em}{}[{
  \vspace{-0.3em}\color{primary}\rule{\textwidth}{0.5pt}
}]

\titleformat{\subsection}[block]{
  \sffamily\bfseries\large\color{textblack}
  }{\thesubsection}{1em}{}

\titleformat{\subsubsection}[block]{
  \sffamily\bfseries\normalsize\color{textblack}
  }{\thesubsubsection}{1em}{}

%================== 图表样式 ==================%
\usepackage{caption}
\captionsetup{
  font={sf,small},
  labelfont={bf,color=textblack},
  textfont={color=textgray},
  labelsep=period,
  skip=6pt
}

%================== 自定义命令 ==================%
\newcommand{\datasource}[2]{\textcolor{lightgray}{\scriptsize[来源：#1：#2]}}
\newcommand{\keydata}[1]{\textbf{#1}}
\newcommand{\insertfigure}[3]{
\begin{figure}[H]
\centering
\includegraphics[width=#2]{#1}
\caption{#3}
\datasource{示例数据源}{图片说明}
\end{figure}
}

%================== 文档开始 ==================%
\begin{document}

%================== 封面页 ==================%
\thispagestyle{empty}
\begin{center}
  \vspace*{5cm}

  % 主标题
  {\sffamily\bfseries\fontsize{36}{40}\selectfont 2025中国新能源汽车行业}

  \vspace{0.8cm}

  % 副标题
  {\sffamily\bfseries\fontsize{28}{32}\selectfont 深度研究报告}

  \vspace{6cm}

  \vspace{3cm}

  % 研究机构
  {\sffamily\fontsize{20}{24}\selectfont Kimi K2}

  \vspace{1cm}

  {\sffamily\Large \today}

  \vfill

  \vspace{0.5cm}

  % 底部信息
  {\sffamily\small\color{textgray} 本报告基于公开信息分析生成，仅供参考}

\end{center}

\newpage

%================== 执行摘要 ==================%
\section*{执行摘要}
\addcontentsline{toc}{section}{执行摘要}
\markboth{执行摘要}{执行摘要}

中国新能源汽车产业在2024年继续保持强劲发展势头，市场渗透率突破42\%，技术创新加速推进，产业链日趋完善，出海步伐显著加快，投资价值日益凸显。

\textbf{核心发现：}
\begin{itemize}
  \item 2024年中国新能源汽车销量达到\keydata{1,156万辆}，同比增长\keydata{28.5\%}，市场渗透率突破\keydata{42\%}。
  \item 动力电池能量密度提升至\keydata{300Wh/kg}以上，续航里程普遍超过\keydata{600公里}。
  \item 行业呈现"一超多强"格局，本土品牌市占率达到\keydata{85\%}以上。
  \item 2024年新能源汽车出口量达到\keydata{173万辆}，同比增长\keydata{55\%}。
\end{itemize}

\newpage

%================== 目录页 ==================%
\tableofcontents
\newpage

%================== 第一章 引言 ==================%
\section{引言}

\subsection{研究背景}
简要介绍研究背景和行业现状。

\subsection{研究目的与意义}
阐述研究目标和价值。

\subsection{研究范围与方法}
说明研究边界和采用的方法论。

%================== 第二章 行业概况 ==================%
\section{行业概况}

\subsection{行业定义与分类}
新能源汽车是指采用新型动力系统，完全或主要依靠新型能源驱动的汽车。

\begin{table}[H]
\centering
\caption{新能源汽车分类体系}
\begin{tabular}{@{}lll@{}}
\toprule
\textbf{分类维度} & \textbf{具体类别} & \textbf{主要特征} \\
\midrule
\multirow{3}{*}{动力类型} & 纯电动汽车(BEV) & 零排放，续航400-700km \\
 & 插电混动(PHEV) & 电动+燃油，纯电50-150km \\
 & 燃料电池(FCEV) & 氢燃料，加氢3分钟 \\
\midrule
\multirow{2}{*}{用途分类} & 乘用车 & 个人使用，占比89\% \\
 & 商用车 & 公交物流等场景 \\
\bottomrule
\end{tabular}
\\
\datasource{中国汽车工业协会}{新能源汽车技术分类标准}
\end{table}

\subsection{行业发展历程与生命周期}
分析行业发展阶段和当前所处位置。

\subsection{行业基本特征}
总结技术密集、资本密集等主要特征。

%================== 第三章 宏观环境分析(PEST) ==================%
\section{宏观环境分析}

\subsection{政策环境(Policy)}
分析产业政策、补贴政策、环保政策等影响因素。

\subsection{经济环境(Economy)}
评估宏观经济背景、成本效益改善等经济因素。

\subsection{社会环境(Society)}
探讨消费观念转变、人口结构变化等社会因素。

\subsection{技术环境(Technology)}
分析核心技术突破、智能化融合等技术因素。

%================== 第四章 市场规模与增长趋势 ==================%
\section{市场规模与增长趋势}

\subsection{整体市场规模}
2024年中国新能源汽车销量达到\keydata{1,156万辆}，同比增长\keydata{28.5\%}。

\subsection{细分市场结构}
从动力类型和用途分类分析市场构成。

\subsection{区域市场分布}
分析一线城市、二线城市、三四线城市和农村地区的差异化表现。

\subsection{未来增长预测}
基于历史数据预测未来3-5年发展趋势。

\subsection{市场趋势图示}
以下是市场数据的可视化展示示例：

\insertfigure{中国新能源汽车_渗透率趋势_2020-2024.png}{0.8\textwidth}{新能源汽车市场渗透率变化趋势（2020-2024年）}

\begin{figure}[H]
\centering
\includegraphics[width=0.9\textwidth]{中国新能源汽车_企业销量排名_2024.png}
\caption{2024年主要新能源汽车企业销量对比}
\datasource{中国汽车工业协会}{企业产销数据}
\end{figure}

\textbf{图表使用说明：}
\begin{itemize}
  \item 使用自定义命令快速插入带格式的图片
  \item 参数1：图片文件名（带扩展名）
  \item 参数2：图片宽度控制
  \item 参数3：图题说明
  \item 所有图片自动添加数据源标注
  \item 支持PNG、JPG、PDF等格式
\end{itemize}

\textbf{新增图表示例：}

\insertfigure{中国新能源汽车_充电桩与保有量对比_2020-2024.png}{0.85\textwidth}{图3：充电基础设施建设与新能源汽车保有量匹配情况}

\begin{figure}[H]
\centering
\includegraphics[width=0.95\textwidth]{中国新能源汽车_出口趋势_2020-2024.png}
\caption{图4：中国新能源汽车出口趋势（2020-2024年）}\\
\datasource{海关总署}{历年出口统计数据}
\end{figure}

\noindent\textbf{图表设计要点：}
\begin{enumerate}
  \item \textbf{清晰度}：确保图片分辨率足够，文字清晰可读
  \item \textbf{一致性}：保持配色方案和字体风格统一
  \item \textbf{数据准确性}：图表数据需与正文数据保持一致
  \item \textbf{来源标注}：所有图表必须标注数据来源
  \item \textbf{编号规范}：按照"图X："格式统一编号
\end{enumerate}

以下详细内容省略，请根据不同行业作出不同角度的分析，撰写专业且深度的研究报告。

%================== 第xx章 结论与建议 ==================%
\section{结论与建议}

\subsection{核心结论}
总结产业发展进入新阶段、竞争格局基本清晰等核心发现。

\subsection{战略建议}
分别对政府、企业、投资者提出建议。

\subsection{风险提示}
提示短期风险、中长期风险和投资策略建议。

%================== 第xx章 参考资料 ==================%
\section{参考资料与数据来源}

\subsection{主要数据来源}
列出主要数据类型、来源机构和可信度评估。

\subsection{参考文献}
提供完整的参考文献列表。

\subsection{研究方法与模型}
说明使用的PEST分析、波特五力模型等方法论。

%================== 第xx章 免责声明 ==================%
\section{免责声明}
包含免责声明和使用建议。

\end{document} 

**报告生成工作流**：
1. 完成所有信息搜索和数据分析
2. 生成所有图表并保存为PNG文件
3. 按照标准结构撰写 LaTeX 报告
4. 保存 LaTeX 文件（保存后将自动编译为PDF）

**文件命名规范**：
- LaTeX: `{主题}_报告.tex`
-PDF: `{主题}_报告.pdf`
-图表: `{主题}_{图表类型}_{序号}.png`

例如：`中国新能源汽车市场_报告_20250130.tex`

## 特殊场景处理
-**数据缺失**：说明"未找到XX数据，已搜索：[列出搜索范围]"，提供替代方案或相关数据
-**数据冲突**：列出不同来源的数据，标注差异："来源A显示X，来源B显示Y，差异可能因为..."
-**敏感话题**：保持客观中立，避免主观判断，专注于数据和事实
-**时效性**：数据超过6个月应标注【历史数据】，提醒可能过时

提供准确、专业、有洞察力的商业分析，维护企业级标准。"""
```

## 

### 

```python
pip3 install --upgrade 'openai>=1.0'
# 安装后通过下面方法验证
python3 -c 'import openai; print("version =",openai.__version__)'
# 输出可能是 version = 1.10.0，表示 OpenAI SDK 已经安装成功，当前 python 实际使用了 openai 的 v1.10.0 的库
```

### 

在开始前，请确保将您的 API\_KEY 配置为环境变量：

```python
export MOONSHOT_BASE_URL ="https://api.moonshot.cn/v1"# 您申请api对应的base_url
export MOONSHOT_API_KEY ="sk-xxxxxxxxxxxxxxxxxxxxxxxx"# 替换为您的api_key
```

此外，您还需要确保已安装以下依赖包：

```python
pip3 install openai httpx akshare pandas numpy matplotlib seaborn

# macOS
brew install --cask mactex
sudo tlmgr update --self
sudo tlmgr install ctex fontspec
xelatex --version

# Windows
choco install texlive -y
tlmgr update --self
tlmgr install xetex ctex fontspec
xelatex --version
```

### 

```python
import os
import json
import asyncio
import argparse
import subprocess
import sys
import httpx
import akshare as ak
from openai import AsyncOpenAI
import glob

SYSTEM_PROMPT =r""" 在这里加入您的 system prompt """
TOOLS = [
{
"type":"function",
"function":{
"name":"company_info",
"description":"根据公司名称获取公司信息（股票代码、市场类型、上市状态等）。当你的知识无法回答用户提出的问题，或用户请求你进行公司信息查询时，调用此工具。",
"parameters":{
"type":"object",
"properties":{
"name":{
"type":"string",
"description":"用户想要查询的公司的准确名称，请从与用户的对话中提取。"
}
},
"required": ["name"]
}
}
}
]

common_code ="""
import matplotlib.pyplot as plt
import matplotlib
import pandas as pd
import numpy as np
import seaborn as sns
from datetime import datetime, timedelta
import os
import json

# 设置中文字体支持
plt.rcParams['font.sans-serif'] = ['SimHei', 'PingFang SC', 'Arial Unicode MS', 'sans-serif']
plt.rcParams['axes.unicode_minus'] = False

"""

defget_company_info(company_name:str) ->str:
"""调用 AKShare API 获取公司信息"""
try:
        stock_info_df = ak.stock_info_a_code_name()
        matches = stock_info_df[stock_info_df['name'].str.contains(company_name, na=False)]
if matches.empty:
returnf"未找到公司 '{company_name}' 的相关信息。请检查公司名称是否正确或尝试使用公司简称。"
        results = []
for _, row in matches.head(5).iterrows():
            code = row.get('code', 'N/A')
            name = row.get('name', 'N/A')

try:
                detail_df = ak.stock_individual_info_em(symbol=code)
                detail_dict =dict(zip(detail_df['item'], detail_df['value']))

                info ={
"股票代码": code,
"公司名称": name,
"总市值": detail_dict.get('总市值', 'N/A'),
"流通市值": detail_dict.get('流通市值', 'N/A'),
"行业": detail_dict.get('行业', 'N/A'),
"上市时间": detail_dict.get('上市时间', 'N/A'),
"股票简称": detail_dict.get('股票简称', name),
"总股本": detail_dict.get('总股本', 'N/A'),
"流通股": detail_dict.get('流通股', 'N/A'),
}
exceptException:
                info ={
"股票代码": code,
"公司名称": name,
}

            results.append(info)

return json.dumps(results, ensure_ascii=False, indent=2)

exceptExceptionas e:
returnf"获取公司信息时出错：{str(e)}"

classFormulaChatClient:
def__init__(self,moonshot_base_url:str,api_key:str):
        self.openai =AsyncOpenAI(base_url=moonshot_base_url, api_key=api_key)
        self.httpx = httpx.AsyncClient(
            base_url=moonshot_base_url,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=30.0,
        )
        self.model ="kimi-k2-turbo-preview"
        self.max_tokens =32768
        self.local_execution_keywords = ["plt.savefig","plt.save",".to_excel","open(",".to_csv","pdf.",".tex"]

asyncdefget_tools(self,formula_uri:str):
        response =await self.httpx.get(f"/formulas/{formula_uri}/tools")
return response.json().get("tools", [])

asyncdefcall_tool(self,formula_uri:str,function:str,args:dict):
        response =await self.httpx.post(
f"/formulas/{formula_uri}/fibers",
            json={"name": function, "arguments": json.dumps(args)},
        )
        fiber = response.json()

if fiber.get("status")=="succeeded":
return fiber["context"].get("output")or fiber["context"].get("encrypted_output")

# Handle errors
        error_msg = fiber.get("error")or fiber.get("context", {}).get("error")or\
                    fiber.get("context", {}).get("output")or"Unknown error"
returnf"Error: {error_msg}"

asyncdefhandle_response(self,response,messages,all_tools,tool_to_uri):
        message = response.choices[0].message
        messages.append(message)

ifnot message.tool_calls:
print(f"\n{message.content}")
return

print(f"\n[调用工具: {len(message.tool_calls)}个]")

for call in message.tool_calls:
            func_name = call.function.name
            args = json.loads(call.function.arguments)

print(f"→ {func_name}")

# 处理自定义工具
if func_name =="company_info":
                company_name = args.get("name", "")
                result =get_company_info(company_name)
print(f"公司信息: {result}")
                messages.append({"role": "tool", "tool_call_id": call.id, "content": result})
continue

# 处理远程 formula 工具
            uri = tool_to_uri.get(func_name)
ifnot uri:
raiseValueError(f"No URI found for tool {func_name}")

if func_name =="code_runner":
                self.execute_code_runner(args)

            result =await self.call_tool(uri, func_name, args)
            messages.append({"role": "tool", "tool_call_id": call.id, "content": result})

        next_response =await self.openai.chat.completions.create(
            model=self.model, messages=messages, tools=all_tools, max_tokens=self.max_tokens
        )
await self.handle_response(next_response, messages, all_tools, tool_to_uri)

defconvert_tex_to_pdf(self,tex_file):
        pdf_file = tex_file.replace('.tex', '.pdf')
# 获取tex文件所在目录
        work_dir = os.path.dirname(os.path.abspath(tex_file))
        tex_name = os.path.basename(tex_file)

try:
            subprocess.run(
                ['xelatex', '-interaction=nonstopmode', tex_file],
                capture_output=True,
                text=True,
                cwd=work_dir if work_dir else'.',
            )
for ext in ['.aux','.log','.out']:
                temp_file = os.path.join(work_dir if work_dir else'.', tex_name.replace('.tex', ext))
if os.path.exists(temp_file):
try:
                        os.remove(temp_file)
exceptException:
pass
print(f"  [已生成PDF: {pdf_file}]")
exceptFileNotFoundError:
print("  [PDF转换失败: xelatex未安装]")
except subprocess.CalledProcessError as e:
print("  [PDF转换失败: LaTeX编译出错]")
if e.stdout:
print(f"  错误输出: {e.stdout[-500:]}")
exceptExceptionas e:
print(f"  [PDF转换失败: {str(e)}]")

defexecute_code_runner(self,args):
        code = args.get("code", "")ifisinstance(args, dict)elsestr(args or"")

ifnot code ornotany(keyword in code for keyword in self.local_execution_keywords):
return
        before_tex_files =set(glob.glob('*.tex'))
try:
            subprocess.run(
                [sys.executable, "-c", common_code+code],
                capture_output=True,
                text=True,
                check=True,
            )
            after_tex_files =set(glob.glob('*.tex'))
            new_tex_files = after_tex_files - before_tex_files
for tex_file in new_tex_files:
                self.convert_tex_to_pdf(tex_file)

exceptExceptionas e:
print(f"  [Local execution failed: {e}]")

asyncdefchat(self,question,messages,all_tools,tool_to_uri):
        messages.append({"role": "user", "content": question})
        response =await self.openai.chat.completions.create(
            model=self.model, messages=messages, tools=all_tools, max_tokens=self.max_tokens
        )
await self.handle_response(response, messages, all_tools, tool_to_uri)

asyncdefclose(self):
await self.httpx.aclose()

defnormalize_formula_uri(uri:str) ->str:
"""Normalize formula URI with default namespace and tag"""
if"/"notin uri:
        uri =f"moonshot/{uri}"
if":"notin uri:
        uri =f"{uri}:latest"
return uri

asyncdefmain():
    parser = argparse.ArgumentParser(description="Formula chat client")
    parser.add_argument(
"--formula",
        action="append",
        default=["moonshot/web-search:latest", "moonshot/rethink:latest", "moonshot/code-runner:latest"],
        help="Formula URIs",
    )
    parser.add_argument("--question", help="Question to ask")

    args = parser.parse_args()

# Process and deduplicate formula URIs
    normalized_formulas = [normalize_formula_uri(uri)for uri in args.formula]
    unique_formulas =list(dict.fromkeys(normalized_formulas))

    moonshot_base_url = os.getenv("MOONSHOT_BASE_URL", "https://api.moonshot.cn/v1")
    api_key = os.getenv("MOONSHOT_API_KEY")

ifnot api_key:
print("Error: MOONSHOT_API_KEY environment variable is required")
return

    client =FormulaChatClient(moonshot_base_url, api_key)

# Load tools
    all_tools = []
    tool_to_uri ={}

for tool in TOOLS:
        func = tool.get("function")
if func:
            func_name = func.get("name")
            all_tools.append(tool)
            tool_to_uri[func_name]="custom"

for uri in unique_formulas:
        tools =await client.get_tools(uri)
for tool in tools:
            func = tool.get("function")
ifnot func:
continue

            func_name = func.get("name")
ifnot func_name or func_name in tool_to_uri:
continue

            all_tools.append(tool)
            tool_to_uri[func_name]= uri

ifnot all_tools:
print("Error: No tools loaded")
return

print(f"已加载 {len(all_tools)} 个工具")

try:
        messages = [{"role":"system","content": SYSTEM_PROMPT}]

if args.question:
print(f"\n问题: {args.question}")
await client.chat(args.question, messages, all_tools, tool_to_uri)
else:
print("\n对话模式 (输入 'q' 退出)\n")
whileTrue:
                question =input("Q: ").strip()
if question.lower()=="q":
break
if question:
await client.chat(question, messages, all_tools, tool_to_uri)

finally:
await client.close()

if__name__=="__main__":
    asyncio.run(main())
```

其中的 system prompt 您可以直接使用上面的样例，也可以自行修改为合适的内容。运行成功后，您可以与 Kimi K2 对话， Kimi K2 将自动完成行业信息整理任务。生成的文件将保存在本地目录下。

### 

#### 

运行程序后，我们在终端给 Kimi K2 下达下面的指令，等待片刻：

```shell
Q:帮我调研2023-2025年中国人形机器人行业的发展情况。
```

得到下面的回复（可以看出，这是报告的摘要）：

```shell
# 2023-2025年中国人形机器人行业发展深度研究报告

## 执行摘要

2023-2025年中国人形机器人产业进入快速发展期，市场规模从15.6亿元增长至32.4亿元，年复合增长率达44.2%。技术创新加速推进，应用场景不断拓展，产业链日趋完善，政策支持力度持续加大，产业正从实验室走向商业化应用。

**核心发现：**
-2025年中国人形机器人市场规模达到**32.4亿元**，出货量突破**1.24万台**，成为全球第二大市场
-宇树科技、智元机器人等头部企业形成"双寡头"格局，合计市场份额超过**60%**
-2024年行业融资总额达**200亿元**，同比增长**150%**，资本热度持续升温
-工业制造成为最大应用场景，占比**35%**，汽车制造业成为首个规模化应用行业
-北京、上海、深圳等地形成产业集聚，政策支持力度空前，产业发展环境持续优化

## 核心数据分析

### 市场规模爆发式增长

中国人形机器人市场呈现爆发式增长态势。2023年市场规模为15.6亿元，2024年增长至21.8亿元，同比增长39.7%。预计到2025年，市场规模将达到32.4亿元，同比增长48.6%，三年复合增长率达44.2%。

从出货量看，2023年中国人形机器人出货量为3500台，2024年激增至7300台，同比增长108.6%。2025年预计出货量将达到1.24万台，同比增长69.9%，显示出强劲的增长势头。

### 竞争格局基本形成

中国人形机器人产业呈现"双寡头+多强"的竞争格局。宇树科技和智元机器人作为第一梯队，合计市场份额超过60%。

**宇树科技**2024年人形机器人出货量达1400台，全球市场份额第一，营收超过10亿元，成为行业首家实现盈利的企业。**智元机器人**2024年出货量达1000台，在具身智能技术方面具有领先优势。

### 资本热度持续升温

中国人形机器人行业融资呈现爆发式增长态势。2023年融资总额为80亿元，2024年激增至200亿元，同比增长150%。2025年预计融资总额将达到280亿元，同比增长40%。

从融资事件数看，2023年发生120起融资事件，2024年增长至200起，同比增长66.7%。2025年预计达到260起，同比增长30%。截至2025年，人形机器人领域已诞生多家独角兽企业，宇树科技估值超过100亿元，智元机器人估值达180亿元。

### 应用场景不断拓展

工业制造是人形机器人最大的应用场景，2025年预计占比35%，市场规模11.3亿元。汽车制造是首个规模化应用的行业，特斯拉、比亚迪、吉利、蔚来等车企都在积极试验人形机器人应用。

服务业是人形机器人的第二大应用场景，2025年预计占比25%，市场规模8.1亿元。医疗康复、教育科研、家庭服务等场景也在快速发展。

## 政策环境分析

国家层面政策支持力度空前。2023年11月，工信部发布《人形机器人创新发展指导意见》，明确提出到2025年初步建立人形机器人创新体系，到2027年综合实力达到世界先进水平。

地方政策形成梯次布局。北京发布《北京市机器人产业创新发展行动方案（2023—2025年）》，设立100亿元机器人产业发展投资基金；上海组建百亿级产业基金，建设国际机器人产业高地；深圳出台专项政策，支持人形机器人核心技术攻关和产业化应用。

## 技术发展趋势

人形机器人技术体系可分为"大脑"、"小脑"、"肢体"三个层次。大脑层基于大模型的认知决策系统，小脑层负责运动控制系统，肢体层包括机械结构和执行机构。

**关键技术突破包括：**
-具身智能技术：2024年，智元机器人发布具身智能G1到G5技术路线图，在通用位姿估计模型UniPose等方面取得阶段性突破
-群体智能技术：2025年3月，优必选在极氪5G智慧工厂开展人形机器人协同实训，推动人形机器人从单机自主向群体智能进化
-多模态感知技术：2025年，部分企业多模态感知精度达到95%以上

## 挑战与机遇

### 主要挑战

**技术挑战**：人形机器人在运动控制、环境感知、智能决策等方面仍有待突破。特别是在复杂环境下的自主作业能力、人机交互的自然性等方面，与国际先进水平仍有差距。

**成本挑战**：目前人形机器人成本仍然较高，单台价格从几十万元到数百万元不等，严重制约了大规模商业化应用。

**标准挑战**：人形机器人行业标准体系尚不完善，在安全性、可靠性、互操作性等方面缺乏统一标准。

### 发展机遇

**政策机遇**：国家将人形机器人产业列为战略性新兴产业，政策支持力度持续加大。

**市场机遇**：中国拥有全球最大的制造业市场和最完整的工业体系，为人形机器人应用提供了广阔空间。

**技术机遇**：人工智能、5G、物联网等新兴技术快速发展，为人形机器人技术突破提供了有力支撑。

## 发展趋势预测

未来3-5年，人形机器人技术将呈现以下发展趋势：

**智能化水平大幅提升**：随着大模型技术的不断发展，人形机器人将具备更强的推理能力和泛化能力，从专用向通用方向发展。

**运动能力显著增强**：运动控制算法将不断优化，机器人将具备更强的环境适应能力和操作精度。

**成本快速下降**：随着规模化生产和核心零部件国产化，人形机器人成本将下降50%以上。

预计到2030年，中国人形机器人市场规模将突破200亿元，出货量达到10万台以上，年复合增长率超过50%。

## 投资建议

### 投资方向建议

**核心零部件领域**：重点关注减速器、伺服电机、传感器等核心零部件企业。这些领域技术门槛高、价值占比大、国产化率低，具有较大投资机会。

**整机制造领域**：重点关注技术领先、市场认可度高的整机制造企业。这些企业将在产业爆发期获得最大收益。

**应用服务领域**：重点关注在特定应用场景具有深度布局的企业。这些企业将通过应用创新获得差异化竞争优势。

### 风险提示

**技术风险**：人形机器人技术仍在快速发展中，存在技术路线不确定、技术突破不及预期等风险。

**市场风险**：人形机器人市场仍处于培育期，存在市场需求不及预期、商业化进程缓慢等风险。

**政策风险**：人形机器人产业高度依赖政策支持，存在政策调整、支持力度减弱等风险。

## 结论与建议

中国人形机器人产业正处于爆发式增长前夜，2023-2025年是产业发展的关键窗口期。在政策大力支持、技术不断突破、市场持续拓展的多重驱动下，产业有望在未来5-10年内实现跨越式发展。

**政策建议**：加强顶层设计，加大支持力度，完善标准体系，强化人才培养，推动国际合作。

**企业建议**：加强技术创新，深化应用探索，强化生态合作，提升品牌价值，拓展国际市场。

**投资建议**：关注头部企业，布局核心环节，保持长期视角，分散投资风险，关注政策导向。
```

另外，在目录下我们还可以发现 pdf 格式的完整报告：

[完整的报告 (opens in a new tab)](https://statics.moonshot.cn/platform/%E4%B8%AD%E5%9B%BD%E4%BA%BA%E5%BD%A2%E6%9C%BA%E5%99%A8%E4%BA%BA%E8%A1%8C%E4%B8%9A_%E6%8A%A5%E5%91%8A_20250130.pdf)

#### 

由于上面的 case 代码只是一个简单的尝试，尚待补充和完善，所以在运行时您可能会遇到一些问题，这些问题的解决方法可参考 *（不断更新中）*：

* code-runner 循环调用报错：
  + 保存 response.json ，检查格式是否正确。
  + 如果格式正确，观察重点字段。如果发现 `"finish_reason"` 是 `"length"` ，说明当前指定的每轮对话 `max_tokens` 太小（当前代码中给定的是32k，您可以合理修改）。
  + 如果不是长度问题，在 `"arguments"` 中提取 `"code"` 的内容，即生成的原始代码，试试能不能运行。可以通过优化 prompt 等方式让生成代码质量提高。

## 

通过上面的步骤，我们已经可以顺利使用 Kimi K2 完成行业信息整理的工作。在更加复杂的场景中，您可以通过下面的一些方式优化 Kimi K2 的表现。

### 

除了 Kimi K2 官方工具外，您还可以定义并执行自己所需的工具。以“查询公司的股票代码等准确信息”为例，下面是可参考的构造和使用流程。

#### 

通过 JSON Schema 来描述我们的工具定义，能让 Kimi K2 大模型更清晰和直观地知道我们的工具需要哪些参数，以及每个参数的类型和介绍。

```python
TOOLS = [
{
"type":"function",
"function":{
"name":"company_info",
"description":"根据公司名称获取公司信息（股票代码、市场类型、上市状态等）。当你的知识无法回答用户提出的问题，或用户请求你进行公司信息查询时，调用此工具。",
"parameters":{
"type":"object",
"properties":{
"name":{
"type":"string",
"description":"用户想要查询的公司的准确名称，请从与用户的对话中提取。"
}
},
"required": ["name"]
}
}
}
// 可以仿照上面的格式继续定义更多工具
]
```

这里我们创建了名为 `company_info` 的工具，向大模型描述了工具的应用场景和所需参数 name（公司名称）。

#### 

我们还需要实现查询功能，在原代码中加入下面的函数：

```python
defget_company_info(company_name:str) ->str:
"""调用 AKShare API 获取公司信息"""
try:
        stock_info_df = ak.stock_info_a_code_name()
        matches = stock_info_df[stock_info_df['name'].str.contains(company_name, na=False)]
if matches.empty:
returnf"未找到公司 '{company_name}' 的相关信息。请检查公司名称是否正确或尝试使用公司简称。"
        results = []
for _, row in matches.head(5).iterrows():
            code = row.get('code', 'N/A')
            name = row.get('name', 'N/A')

try:
                detail_df = ak.stock_individual_info_em(symbol=code)
                detail_dict =dict(zip(detail_df['item'], detail_df['value']))

                info ={
"股票代码": code,
"公司名称": name,
"总市值": detail_dict.get('总市值', 'N/A'),
"流通市值": detail_dict.get('流通市值', 'N/A'),
"行业": detail_dict.get('行业', 'N/A'),
"上市时间": detail_dict.get('上市时间', 'N/A'),
"股票简称": detail_dict.get('股票简称', name),
"总股本": detail_dict.get('总股本', 'N/A'),
"流通股": detail_dict.get('流通股', 'N/A'),
}
exceptException:
                info ={
"股票代码": code,
"公司名称": name,
}

            results.append(info)

return json.dumps(results, ensure_ascii=False, indent=2)

exceptExceptionas e:
returnf"获取公司信息时出错：{str(e)}"
```

#### 

另外在对应注册工具的位置进行补充，就可以让模型自动调用我们自己定义的新工具了：

```python
for call in message.tool_calls:
            func_name = call.function.name
            args = json.loads(call.function.arguments)

print(f"→ {func_name}")

# 处理自定义工具（新增部分）
if func_name =="company_info":
                company_name = args.get("name", "")
                result =get_company_info(company_name)
print(f"公司信息: {result}")
                messages.append({"role": "tool", "tool_call_id": call.id, "content": result})
continue

# 处理远程 formula 工具（原有部分）
            uri = tool_to_uri.get(func_name)
ifnot uri:
raiseValueError(f"No URI found for tool {func_name}")

if func_name =="code_runner":
                self.execute_code_runner(args)

            result =await self.call_tool(uri, func_name, args)
            messages.append({"role": "tool", "tool_call_id": call.id, "content": result})

        next_response =await self.openai.chat.completions.create(
            model=self.model, messages=messages, tools=all_tools, max_tokens=self.max_tokens
        )
```

上面的完整代码已经加入了本工具，运行后可以进行对话进行测试：

```shell
Q:帮我查找宁德时代公司的股票代码

[调用工具: 1个]
→company_info
公司信息: [                                                                                                                                                      
  {
"股票代码":"300750",
"公司名称":"宁德时代",
"总市值":1817339120058.29,
"流通市值":1694973917202.29,
"行业":"电池",
"上市时间":20180611,
"股票简称":"宁德时代",
"总股本":4562854001.0,
"流通股":4255627601.0
  }
]

AIResponse：根据查询结果，宁德时代公司的股票信息如下：

**股票代码：300750**

**公司基本信息：**
-股票简称：宁德时代
-行业：电池
-上市时间：2018年6月11日
-总股本：45.63亿股
-流通股：42.56亿股
-总市值：约1.82万亿元
-流通市值：约1.69万亿元
```

像这样，我们可以将许多常用的功能定义为工具，将会有效提升大模型的输出效果。

Last updated on 2025年11月26日

[Kimi CLI 使用指南](/docs/guide/kimi-cli-support "Kimi CLI 使用指南")[基准评估最佳实践](/docs/guide/benchmark-best-practice "基准评估最佳实践")