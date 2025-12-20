# 使用提示模板和變數

---

當使用 Claude 部署基於 LLM 的應用程式時，您的 API 呼叫通常會包含兩種類型的內容：
- **固定內容：** 在多次互動中保持不變的靜態指令或上下文
- **變數內容：** 隨每次請求或對話而變化的動態元素，例如：
    - 使用者輸入
    - 檢索增強生成 (RAG) 的檢索內容
    - 對話上下文，如使用者帳戶歷史記錄
    - 系統生成的資料，如從其他獨立的 Claude 呼叫中輸入的工具使用結果

**提示模板**結合了這些固定和變數部分，使用佔位符來表示動態內容。在 [Claude Console](/) 中，這些佔位符用**\{\{雙括號\}\}**表示，使它們易於識別並允許快速測試不同的值。

---

# 何時使用提示模板和變數
當您期望提示的任何部分會在另一次對 Claude 的呼叫中重複使用時，您應該始終使用提示模板和變數（僅透過 API 或 [Claude Console](/)。[claude.ai](https://claude.ai/) 目前不支援提示模板或變數）。

提示模板提供了幾個好處：
- **一致性：** 確保在多次互動中提示結構的一致性
- **效率：** 輕鬆替換變數內容而無需重寫整個提示
- **可測試性：** 透過僅更改變數部分來快速測試不同的輸入和邊緣情況
- **可擴展性：** 隨著應用程式複雜性的增長，簡化提示管理
- **版本控制：** 透過僅關注提示的核心部分（與動態輸入分離），輕鬆追蹤提示結構隨時間的變化

[Claude Console](/) 大量使用提示模板和變數，以支援上述所有功能和工具，例如：
- **[提示生成器](/docs/zh-TW/build-with-claude/prompt-engineering/prompt-generator)：** 決定您的提示需要哪些變數，並將它們包含在輸出的模板中
- **[提示改進器](/docs/zh-TW/build-with-claude/prompt-engineering/prompt-improver)：** 接受您現有的模板，包括所有變數，並在輸出的改進模板中維護它們
- **[評估工具](/docs/zh-TW/test-and-evaluate/eval-tool)：** 透過分離提示模板的變數和固定部分，讓您輕鬆測試、擴展和追蹤提示的版本

---

# 提示模板範例

讓我們考慮一個將英文文本翻譯成西班牙文的簡單應用程式。翻譯的文本會是變數，因為您期望這個文本在使用者之間或對 Claude 的呼叫之間會發生變化。這個翻譯文本可以從資料庫或使用者的輸入中動態檢索。

因此，對於您的翻譯應用程式，您可能會使用這個簡單的提示模板：
```
將此文本從英文翻譯成西班牙文：{{text}}
```

---

## 下一步

<CardGroup cols={2}>
  <Card title="生成提示" icon="link" href="/docs/zh-TW/build-with-claude/prompt-engineering/prompt-generator">
    了解 Claude Console 中的提示生成器，並嘗試讓 Claude 為您生成提示。
  </Card>
  <Card title="應用 XML 標籤" icon="link" href="/docs/zh-TW/build-with-claude/prompt-engineering/use-xml-tags">
    如果您想提升提示變數的技巧，請將它們包裝在 XML 標籤中。
  </Card>
  <Card title="Claude Console" icon="link" href="/">
    查看 Claude Console 中提供的眾多提示開發工具。
  </Card>
</CardGroup>