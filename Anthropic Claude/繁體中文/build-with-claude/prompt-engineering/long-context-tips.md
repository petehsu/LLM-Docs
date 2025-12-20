# 長文本提示詞技巧

有效利用 Claude 的擴展上下文窗口來處理複雜、資料豐富的任務的提示和最佳實踐。

---

<Note>
While these tips apply broadly to all Claude models, you can find prompting tips specific to extended thinking models [here](/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips).
</Note>

Claude 的擴展上下文窗口（Claude 3 模型支持 200K 個 token）能夠處理複雜、資料豐富的任務。本指南將幫助您有效地利用這一強大功能。

## 長文本提示詞的基本技巧

- **將長篇資料放在頂部**：將您的長文檔和輸入（約 20K+ 個 token）放在提示詞的頂部，位於您的查詢、指令和示例之上。這可以顯著提高 Claude 在所有模型上的性能。

    <Note>根據測試，將查詢放在末尾可以將響應品質提高多達 30%，特別是在處理複雜的多文檔輸入時。</Note>

- **使用 XML 標籤結構化文檔內容和元數據**：使用多個文檔時，將每個文檔包裝在 `<document>` 標籤中，並使用 `<document_content>` 和 `<source>`（以及其他元數據）子標籤以提高清晰度。

    <section title="多文檔結構示例">

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

    分析年度報告和競爭對手分析。識別戰略優勢並推薦第三季度的重點領域。
    ```
    
</section>

- **在引用中基礎響應**：對於長文檔任務，要求 Claude 先引用文檔的相關部分，然後再執行其任務。這有助於 Claude 穿過文檔其餘內容的「噪音」。

    <section title="引用提取示例">

    ```xml
    您是一名人工智能醫生助手。您的任務是幫助醫生診斷可能的患者疾病。

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

    從患者記錄和預約歷史中查找與診斷患者報告的症狀相關的引用。將這些放在 <quotes> 標籤中。然後，根據這些引用，列出所有有助於醫生診斷患者症狀的信息。將您的診斷信息放在 <info> 標籤中。
    ```
    
</section>

***

<CardGroup cols={3}>
  <Card title="提示詞庫" icon="link" href="/docs/zh-TW/resources/prompt-library/library">
    從精選的各種任務和用例提示詞中獲得靈感。
  </Card>
  <Card title="GitHub 提示詞教程" icon="link" href="https://github.com/anthropics/prompt-eng-interactive-tutorial">
    一個充滿示例的教程，涵蓋我們文檔中的提示詞工程概念。
  </Card>
  <Card title="Google Sheets 提示詞教程" icon="link" href="https://docs.google.com/spreadsheets/d/19jzLgRruG9kjUQNKtCg1ZjdD6l6weA6qRXG5zLIAhC8">
    通過互動電子表格提供的更輕量級版本的提示詞工程教程。
  </Card>
</CardGroup>