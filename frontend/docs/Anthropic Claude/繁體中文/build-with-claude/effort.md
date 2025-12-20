# 努力程度

使用努力程度參數控制 Claude 在回應時使用多少個 token，在回應完整性和 token 效率之間進行權衡。

---

努力程度參數允許您控制 Claude 在回應請求時花費 token 的積極程度。這使您能夠在回應完整性和 token 效率之間進行權衡，所有這些都可以使用單一模型完成。

<Note>
  努力程度參數目前處於測試版，僅由 Claude Opus 4.5 支援。

  使用此功能時，您必須包含[測試版標頭](/docs/zh-TW/api/beta-headers) `effort-2025-11-24`。
</Note>

## 努力程度如何運作

預設情況下，Claude 使用最大努力程度—花費盡可能多的 token 以獲得最佳結果。通過降低努力程度，您可以指示 Claude 在 token 使用上更加保守，優化速度和成本，同時接受某些功能的降低。

<Tip>
將 `effort` 設定為 `"high"` 會產生與完全省略 `effort` 參數完全相同的行為。
</Tip>

努力程度參數影響回應中的**所有 token**，包括：

- 文字回應和解釋
- 工具呼叫和函數參數
- 擴展思考（啟用時）

這種方法有兩個主要優點：

1. 它不需要啟用思考就能使用。
2. 它可以影響所有 token 支出，包括工具呼叫。例如，較低的努力程度意味著 Claude 進行的工具呼叫較少。這提供了對效率的更大控制程度。

### 努力程度

| 級別     | 描述                                                                                                                      | 典型使用案例                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `high`   | 最大功能。Claude 使用盡可能多的 token 以獲得最佳結果。等同於不設定參數。  | 複雜推理、困難的編碼問題、代理任務                           |
| `medium` | 平衡方法，具有適度的 token 節省。 | 需要速度、成本和效能平衡的代理任務                                                         |
| `low`    | 最高效率。顯著節省 token，但功能有所降低。 | 需要最佳速度和最低成本的簡單任務，例如子代理                     |

## 基本用法

<CodeGroup>
```python Python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": "Analyze the trade-offs between microservices and monolithic architectures"
    }],
    output_config={
        "effort": "medium"
    }
)

print(response.content[0].text)
```

```typescript TypeScript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-opus-4-5-20251101",
  betas: ["effort-2025-11-24"],
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Analyze the trade-offs between microservices and monolithic architectures"
  }],
  output_config: {
    effort: "medium"
  }
});

console.log(response.content[0].text);
```

```bash Shell
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: effort-2025-11-24" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-opus-4-5-20251101",
        "max_tokens": 4096,
        "messages": [{
            "role": "user",
            "content": "Analyze the trade-offs between microservices and monolithic architectures"
        }],
        "output_config": {
            "effort": "medium"
        }
    }'
```

</CodeGroup>

## 何時應調整努力程度參數？

- 當您需要 Claude 的最佳工作時，使用**高努力程度**（預設值）—複雜推理、細緻分析、困難的編碼問題，或任何品質是首要優先事項的任務。
- 當您想要穩定的效能而不需要高努力程度的完整 token 支出時，使用**中等努力程度**作為平衡選項。
- 當您優化速度（因為 Claude 使用較少的 token 回答）或成本時，使用**低努力程度**—例如簡單的分類任務、快速查詢，或邊際品質改進不足以證明額外延遲或支出的大量使用案例。

## 努力程度與工具使用

使用工具時，努力程度參數會影響工具呼叫周圍的解釋和工具呼叫本身。較低的努力程度傾向於：

- 將多個操作合併為較少的工具呼叫
- 進行較少的工具呼叫
- 直接進行操作而不需要前言
- 完成後使用簡潔的確認訊息

較高的努力程度可能會：

- 進行更多工具呼叫
- 在採取行動前解釋計畫
- 提供詳細的變更摘要
- 包含更全面的程式碼註解

## 努力程度與擴展思考

當啟用擴展思考時，努力程度參數與思考 token 預算一起運作。這兩個控制項服務於不同的目的：

- **努力程度參數**：控制 Claude 如何花費所有 token—包括思考 token、文字回應和工具呼叫
- **思考 token 預算**：設定思考 token 的最大限制

努力程度參數可以在啟用或不啟用擴展思考的情況下使用。當兩者都配置時：

1. 首先確定適合您的任務的努力程度
2. 然後根據任務複雜性設定思考 token 預算

為了在複雜推理任務上獲得最佳效能，使用高努力程度（預設值）和高思考 token 預算。這允許 Claude 充分思考並提供全面的回應。

## 最佳實踐

1. **從高開始**：使用較低的努力程度來權衡效能以換取 token 效率。
2. **對速度敏感或簡單任務使用低努力程度**：當延遲很重要或任務很簡單時，低努力程度可以顯著減少回應時間和成本。
3. **測試您的使用案例**：努力程度的影響因任務類型而異。在部署前評估您特定使用案例的效能。
4. **考慮動態努力程度**：根據任務複雜性調整努力程度。簡單查詢可能需要低努力程度，而代理編碼和複雜推理受益於高努力程度。