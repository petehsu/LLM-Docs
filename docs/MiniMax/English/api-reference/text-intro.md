# Text Generation

> The text generation API uses **MiniMax M2** to generate conversational content and trigger tool calls based on the provided context.

It can be accessed via **HTTP requests**, the **Anthropic SDK** (Recommended), or the **OpenAI SDK**.

## Supported Models

| Model Name             | Context Window <br />(total input + output per request)        |
| :--------------------- | :------------------------------------------------------------- |
| MiniMax-M2             | 204,800                                                        |
| MiniMax-M2-Stable      | 204,800                                                        |

Please note: The maximum token count refers to the total number of input and output tokens.

## Recommended Reading

<Columns cols={2}>
  <Card title="Compatible Anthropic API (Recommended)" icon="book-open" href="/api-reference/text-anthropic-api" arrow="true" cta="Click here">
    Use Anthropic SDK with MiniMax models
  </Card>

  <Card title="Compatible OpenAI API" icon="book-open" href="/api-reference/text-openai-api" arrow="true" cta="Click here">
    Use OpenAI SDK with MiniMax models
  </Card>

  <Card title="M2 for AI Coding Tools" icon="book-open" href="/guides/text-ai-coding-tools" arrow="true" cta="Click here">
    MiniMax-M2 excels at code understanding, dialogue, and reasoning.
  </Card>

  <Card title="M2 Tool Use & Interleaved Thinking" icon="book-open" href="/guides/text-m2-function-call" arrow="true" cta="Click here">
    AI models can call external functions to extend their capabilities.
  </Card>
</Columns>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt