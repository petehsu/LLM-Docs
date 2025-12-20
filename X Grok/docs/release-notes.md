#### What's New?

# Release Notes

Stay up to date with the latest changes to the xAI API.

# November 2025

### Grok 4.1 Fast is available in Enterprise API

You can now use Grok 4.1 Fast in the [xAI Enterprise API](https://x.ai/api). For more details, check out [our blogpost](https://x.ai/news/grok-4-1-fast).

### Agent tools adapt to Grok 4.1 Fast models and tool prices dropped

* You can now use Grok 4.1 Fast models with the agent tools, check out the [documentation of agent tools](/docs/guides/tools/overview) to get started.
* The price of agent tools drops by up to 50% to no more than $5 per 1000 successful calls, see the new prices at [the pricing page](/docs/models#tools-pricing).

### Files API is generally available

You can now upload files and use them in chat conversations with the Files API. For more details, check out [our guide on Files](/docs/guides/files).

### New Tools Available

* **Collections Search Tool**: You can now search through uploaded knowledge bases (collections) in chat conversations via the API. For more details, check out the [docs](/docs/guides/tools/collections-search-tool).
* **Remote MCP Tools**: You can now use tools from remote MCP servers in chat conversations via the API. For more details, check out the [docs](/docs/guides/tools/remote-mcp-tools).
* **Mixing client-side and server-side tools**: You can now mix client-side and server-side tools in the same chat conversation. For more details, check out the [docs](/docs/guides/tools/advanced-usage#mixing-server-side-and-client-side-tools).

# October 2025

### Tools are now generally available

New agentic server-side tools including `web_search`, `x_search` and `code_execution` are available. For more details, check out [our guide on using Tools](/docs/guides/tools/overview).

# September 2025

### Responses API is generally available

You can now use our stateful Responses API to process requests.

# August 2025

### Grok Code Fast 1 is released

We have released our first Code Model to be used with code editors.

### Collections API is released

You can upload files, create embeddings, and use them for inference with our Collections API.

# July 2025

### Grok 4 is released

You can now use Grok 4 via our API or on https://grok.com.

# June 2025

### Management API is released

You can manage your API keys via Management API at
`https://management-api.x.ai`.

# May 2025

### Cached prompt is now available

You can now use cached prompt to save on repeated prompts. For
more info, see [models](models).

### Live Search is available on API

Live search is now available on API. Users can generate
completions with queries on supported data sources.

# April 2025

### Grok 3 models launch on API

Our latest flagship `Grok 3` models are now generally available via
the API. For more info, see [models](models).

# March 2025

### Image Generation Model available on API

The image generation model is available on API. Visit
[Image Generations](/docs/guides/image-generations) for more details on using the model.

# February 2025

### Audit Logs

Team admins can now view audit logs on [console.x.ai](https://console.x.ai).

# January 2025

### Docs Dark Mode Released dark mode support on docs.x.ai

### Status Page Check service statuses across all xAI products at

[status.x.ai](https://status.x.ai/).

# December 2024

### Replit & xAI

Replit Agents can now integrate with xAI! Start empowering your agents with Grok.
Check out the [announcement](https://x.com/Replit/status/1874211039258333643) for more information.

### Tokenizer Playground Understanding tokens can be hard. Check out

[console.x.ai](https://console.x.ai) to get a better understanding of what counts as a token.

### Structured Outputs We're excited to announce that Grok now supports structured outputs. Grok can

now format responses in a predefined, organized format rather than free-form text. 1. Specify the
desired schema

```
{
    "name": "movie_response",
    "schema": {
        "type": "object",
        "properties": {
            "title": { "type": "string" },
            "rating": { "type": "number" },
        },
        "required": [ "title", "rating" ],
        "additionalProperties": false
    },
    "strict": true
}
```

2. Get the desired data

```
{
  "title": "Star Wars",
  "rating": 8.6
}
```

Start building more reliable applications. Check out the [docs](guides/structured-outputs#structured-outputs) for more information.

### Released the new grok-2-1212 and grok-2-vision-1212 models A month ago, we launched the public

beta of our enterprise API with grok-beta and grok-vision-beta. We’re adding [grok-2-1212 and
grok-2-vision-1212](https://docs.x.ai/docs/models), offering better accuracy, instruction-following,
and multilingual capabilities.

# November 2024

### LangChain & xAI Our API is now available through LangChain! - Python Docs:

http://python.langchain.com/docs/integrations/providers/xai/ - Javascript Docs:
http://js.langchain.com/docs/integrations/chat/xai/

What are you going to build?

### API Public Beta Released We are happy to announce the immediate availability of our API, which

gives developers programmatic access to our Grok series of foundation models. To get started, head
to [console.x.ai](https://console.x.ai/) and sign up to create an account. We are excited to see
what developers build using Grok.


