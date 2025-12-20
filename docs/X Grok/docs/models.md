#### Key Information

# Models and Pricing

An overview of our models' capabilities and their associated pricing.

## Model Pricing


When moving from `grok-3`/`grok-3-mini` to `grok-4`, please note the following differences:

## Tools Pricing

Requests which make use of xAI provided [server-side tools](guides/tools/overview) are priced based on two components: **token usage** and **server-side tool invocations**. Since the agent autonomously decides how many tools to call, costs scale with query complexity.

### Token Costs

All standard token types are billed at the [rate](/docs/models#model-pricing) for the model used in the request:

* **Input tokens**: Your query and conversation history
* **Reasoning tokens**: Agent's internal thinking and planning
* **Completion tokens**: The final response
* **Image tokens**: Visual content analysis (when applicable)
* **Cached prompt tokens**: Prompt tokens that were served from cache rather than recomputed

### Tool Invocation Costs

| Tool | Cost per 1,000 calls | Description |
|------|---------------------|-------------|
| **[Web Search](/docs/guides/tools/search-tools)** | $5 | Internet search and page browsing |
| **[X Search](/docs/guides/tools/search-tools)** | $5 | X posts, users, and threads |
| **[Code Execution](/docs/guides/tools/code-execution-tool)** | $5 | Python code execution environment |
| **[Document Search](/docs/guides/files)** | $5 | Search through uploaded files and documents |
| **[View Image](/docs/guides/tools/search-tools#parameter-enable_image_understanding-supported-by-web-search-and-x-search)** | Token-based only | Image analysis within search results |
| **[View X Video](/docs/guides/tools/search-tools#parameter-enable_video_understanding-supported-by-x-search)** | Token-based only | Video analysis within X posts |
| **[Collections Search](/docs/guides/tools/collections-search-tool)** | $2.50 | Knowledge base search using xAI Collections |
| **[Remote MCP Tools](/docs/guides/tools/remote-mcp-tools)** | Token-based only | Custom MCP tools |

For the view image and view x video tools, you will not be charged for the tool invocation itself but will be charged for the image tokens used to process the image or video.

For Remote MCP tools, you will not be charged for the tool invocation but will be charged for any tokens used.

For more information on using Tools, please visit [our guide on Tools](guides/tools/overview).

## Live Search Pricing

The advanced agentic search capabilities powering grok.com are generally available in the new [**agentic tool calling API**](/docs/guides/tools/overview), and the Live Search API but will be deprecated by December 15, 2025.

Live Search costs $25 per 1,000 sources requested, each source used (Web, X, News, RSS) in a request counts toward the usage. That means a search using 4 sources costs $0.10 while a search using 1 source is $0.025. A source (e.g. Web) may return multiple citations, but you will be charged for only one source.

The number of sources used can be found in the `response` object, which contains a field called `response.usage.num_sources_used`.

For more information on using Live Search, visit our [guide on Live Search](guides/live-search) or look for `search_parameters` parameter on [API Reference - Chat Completions](api-reference#chat-completions).

## Documents Search Pricing

For users using our Collections API and Documents Search, the following pricing applies:

## Usage Guidelines Violation Fee

A rare occurrence for most users, when your request is deemed to be in violation of our usage guideline by our system, we will charge a $0.05 per request usage guidelines violation fee.

## Additional Information Regarding Models

* **No access to realtime events without Live Search enabled**
  * Grok has no knowledge of current events or data beyond what was present in its training data.
  * To incorporate realtime data with your request, please use [Live Search](guides/live-search) function, or pass any realtime data as context in your system prompt.
* **Chat models**
  * No role order limitation: You can mix `system`, `user`, or `assistant` roles in any sequence for your conversation context.
* **Image input models**
  * Maximum image size: `20MiB`
  * Maximum number of images: No limit
  * Supported image file types: `jpg/jpeg` or `png`.
  * Any image/text input order is accepted (e.g. text prompt can precede image prompt)

The knowledge cut-off date of Grok 3 and Grok 4 is November, 2024.

## Model Aliases

Some models have aliases to help users automatically migrate to the next version of the same model. In general:

* `<modelname>` is aliased to the latest stable version.
* `<modelname>-latest` is aliased to the latest version. This is suitable for users who want to access the latest features.
* `<modelname>-<date>` refers directly to a specific model release. This will not be updated and is for workflows that demand consistency.

For most users, the aliased `<modelname>` or `<modelname>-latest` are recommended, as you would receive the latest features automatically.

## Billing and Availability

Your model access might vary depending on various factors such as geographical location, account limitations, etc.

For how the **bills are charged**, visit [Manage Billing](key-information/billing) for more information.

For the most up-to-date information on **your team's model availability**, visit [Models Page](https://console.x.ai/team/default/models) on xAI Console.

## Model Input and Output

Each model can have one or multiple input and output capabilities.
The input capabilities refer to which type(s) of prompt can the model accept in the request message body.
The output capabilities refer to which type(s) of completion will the model generate in the response message body.

This is a prompt example for models with `text` input capability:

```json
[
  {
    "role": "system",
    "content": "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."
  },
  {
    "role": "user",
    "content": "What is the meaning of life, the universe, and everything?"
  }
]
```

This is a prompt example for models with `text` and `image` input capabilities:

```json
[
  {
    "role": "user",
    "content": [
      {
        "type": "image_url",
        "image_url": {
          "url": "data:image/jpeg;base64,<base64_image_string>",
          "detail": "high"
        }
      },
      {
        "type": "text",
        "text": "Describe what's in this image."
      }
    ]
  }
]
```

This is a prompt example for models with `text` input and `image` output capabilities:

```json
// The entire request body
{
  "model": "grok-4",
  "prompt": "A cat in a tree",
  "n": 4
}
```

## Context Window

The context window determines the maximum amount of tokens accepted by the model in the prompt.

For more information on how token is counted, visit [Consumption and Rate Limits](key-information/consumption-and-rate-limits).

If you are sending the entire conversation history in the prompt for use cases like chat assistant, the sum of all the prompts in your conversation history must be no greater than the context window.

## Cached prompt tokens

Trying to run the same prompt multiple times? You can now use cached prompt tokens to incur less cost on repeated prompts. By reusing stored prompt data, you save on processing expenses for identical requests. Enable caching in your settings and start saving today!

The caching is automatically enabled for all requests without user input. You can view the cached prompt token consumption in [the `"usage"` object](key-information/consumption-and-rate-limits#checking-token-consumption).

For details on the pricing, please refer to the pricing table above, or on [xAI Console](https://console.x.ai).


