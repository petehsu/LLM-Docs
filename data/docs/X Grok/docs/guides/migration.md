#### Guides

# Migration from Other Providers

Some of Grok users might have migrated from other LLM providers. xAI API is designed to be compatible with both OpenAI and Anthropic SDKs, except certain capabilities not offered by respective SDK.
If you can use either SDKs, we recommend using OpenAI SDK for better stability.

In two steps:

1. At API client object construction, you need to set the "base url" to `https://api.x.ai/v1` and "API key" to your xAI API key (obtained from [xAI Console](https://console.x.ai)).
2. When sending message for inference, set "model" to be one of the Grok [model](../models) names.

If you use third-party tools such as LangChain ([JavaScript](https://js.langchain.com/docs/integrations/chat/xai/)/[Python](https://python.langchain.com/docs/integrations/providers/xai/)) and [Continue](https://docs.continue.dev/customize/model-providers/xai),
they usually have a common base class for LLM providers. You only need to change the provider and API keys. You can refer to their documentations for case-by-case instrcutions.

Examples using OpenAI and Anthropic SDKs:

**OpenAI SDK**

```pythonOpenAISDK
from openai import OpenAI

client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1",
)

# ...

completion = client.chat.completions.create(
    model="grok-4",
# ...
)
```

```javascriptOpenAISDK
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: $XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
});

// ...

const completion = await openai.chat.completions.create({
    model: "grok-4",
    // ...
```

**Anthropic SDK**

```pythonAnthropicSDK
from anthropic import Anthropic

client = Anthropic(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai",
)

# ...

message = client.messages.create(
    model="grok-4",
# ...
)
```

```javascriptAnthropicSDK
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: $XAI_API_KEY,
    baseURL: "https://api.x.ai/",
});

// ...

const msg = await anthropic.messages.create({
    model: "grok-4",
// ...
```


