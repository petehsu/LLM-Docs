#### Resources

# Community Integrations

Grok is also accessible via your favorite community integrations, enabling you to connect Grok to other parts of your system easily.

## Third-party SDK/frameworks

### LiteLLM

LiteLLM provides a simple SDK or proxy server for calling different LLM providers. If you're using LiteLLM, integrating xAI as your provider is straightforward—just swap out the model name and API key to xAI's Grok model in your configuration.

For latest information and more examples, visit [LiteLLM xAI Provider Documentation](https://docs.litellm.ai/docs/providers/xai).

As a quick start, you can use LiteLLM in the following fashion:

```pythonWithoutSDK
from litellm import completion
import os

os.environ['XAI_API_KEY'] = ""
response = completion(
model="xai/grok-4",
messages=[
{
"role": "user",
"content": "What's the weather like in Boston today in Fahrenheit?",
}
],
max_tokens=10,
response_format={ "type": "json_object" },
seed=123,
stop=["\n\n"],
temperature=0.2,
top_p=0.9,
tool_choice="auto",
tools=[],
user="user",
)
print(response)
```

### Vercel AI SDK

[Vercel's AI SDK](https://sdk.vercel.ai/) supports a [xAI Grok Provider](https://sdk.vercel.ai/providers/ai-sdk-providers/xai) for integrating with xAI API.

By default it uses your xAI API key in `XAI_API_KEY` variable.

To generate text use the `generateText` function:

```javascriptAISDK
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';

const { text } = await generateText({
model: xai('grok-4'),
prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

You can also customize the setup like the following:

```javascriptAISDK
import { createXai } from '@ai-sdk/xai';

const xai = createXai({
apiKey: 'your-api-key',
});
```

You can also generate images with the `generateImage` function:

```javascriptAISDK
import { xai } from '@ai-sdk/xai';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
model: xai.image('grok-2-image'),
prompt: 'A cat in a tree',
});
```

## Coding assistants

### Continue

You can use Continue extension in VSCode or JetBrains with xAI's models.

To start using xAI models with Continue, you can add the following in Continue's config file `~/.continue/config.json`(MacOS and Linux)/`%USERPROFILE%\.continue\config.json`(Windows).

```json
 "models": [
   {
     "title": "grok-4",
     "provider": "xAI",
     "model": "grok-4",
     "apiKey": "[XAI_API_KEY]"
   }
 ]
```

Visit [Continue's Documentation](https://docs.continue.dev/chat/model-setup#grok-2-from-xai) for more details.


