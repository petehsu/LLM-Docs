# 长上下文提示技巧

学习如何有效利用Claude的扩展上下文窗口处理复杂的数据密集型任务。

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Claude的扩展上下文窗口（Claude 3模型支持200K令牌）使得处理复杂的数据密集型任务成为可能。本指南将帮助您有效地利用这一强大功能。

## 长上下文提示的基本技巧

- **将长格式数据放在顶部**：将您的长文档和输入（~20K+令牌）放在提示的顶部，在您的查询、指令和示例之上。这可以显著提高Claude在所有模型上的性能。

    <Note>根据测试，将查询放在末尾可以将响应质量提高多达30%，特别是对于复杂的多文档输入。</Note>

- **使用XML标签结构化文档内容和元数据**：使用多个文档时，用`<document>`标签包装每个文档，并使用`<document_content>`和`<source>`（以及其他元数据）子标签以保持清晰。

    <section title="多文档结构示例">

    ```xml
    <documents>
      <document index="1">
        <source>annual_report_2023.pdf</source>
        <document_content>
          {{ANNUAL_REPORT}}
        </document_content>
      </document>
      <document index="2">
        <source>competitor_analysis_q2.xlsx</source>
        <document_content>
          {{COMPETITOR_ANALYSIS}}
        </document_content>
      </document>
    </documents>

    分析年度报告和竞争对手分析。识别战略优势并推荐第三季度的重点领域。
    ```
    
</section>

- **在引用中基础化响应**：对于长文档任务，要求Claude先引用文档的相关部分，然后再执行其任务。这有助于Claude穿过文档其余内容的"噪音"。

    <section title="引用提取示例">

    ```xml
    您是一名AI医生助手。您的任务是帮助医生诊断可能的患者疾病。

    <documents>
      <document index="1">
        <source>patient_symptoms.txt</source>
        <document_content>
          {{PATIENT_SYMPTOMS}}
        </document_content>
      </document>
      <document index="2">
        <source>patient_records.txt</source>
        <document_content>
          {{PATIENT_RECORDS}}
        </document_content>
      </document>
      <document index="3">
        <source>patient01_appt_history.txt</source>
        <document_content>
          {{PATIENT01_APPOINTMENT_HISTORY}}
        </document_content>
      </document>
    </documents>

    从患者记录和预约历史中查找与诊断患者报告的症状相关的引用。将这些放在<quotes>标签中。然后，根据这些引用，列出所有有助于医生诊断患者症状的信息。将您的诊断信息放在<info>标签中。
    ```
    
</section>

***

<CardGroup cols={3}>
  <Card title="提示库" icon="link" href="/docs/zh-CN/resources/prompt-library/library">
    获得精选的提示灵感，涵盖各种任务和用例。
  </Card>
  <Card title="GitHub提示教程" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    一个充满示例的教程，涵盖我们文档中的提示工程概念。
  </Card>
  <Card title="Google Sheets提示教程" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    通过交互式电子表格提供的我们提示工程教程的轻量级版本。
  </Card>
</CardGroup>