#### Guides

# Chat

Text in, text out. Chat is the most popular feature on the xAI API, and can be used for anything from summarizing articles, generating creative writing, answering questions, providing customer support, to assisting with coding tasks.

## Prerequisites

* xAI Account: You need an xAI account to access the API.
* API Key: Ensure that your API key has access to the chat endpoint and the chat model is enabled.

If you don't have these and are unsure of how to create one, follow [the Hitchhiker's Guide to Grok](../tutorial).

You can create an API key on the [xAI Console API Keys Page](https://console.x.ai/team/default/api-keys).

Set your API key in your environment:

```bash
export XAI_API_KEY="your_api_key"
```

## A Basic Chat Completions Example

You can also stream the response, which is covered in [Streaming Response](streaming-response).

The user sends a request to the xAI API endpoint. The API processes this and returns a complete response.

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user, system

client = Client(
    api_key=os.getenv("XAI_API_KEY"),
    timeout=3600, # Override default timeout with longer timeout for reasoning models
)

chat = client.chat.create(model="grok-4")
chat.append(system("You are a PhD-level mathematician."))
chat.append(user("What is 2 + 2?"))

response = chat.sample()
print(response.content)
```

```pythonOpenAISDK
import os
import httpx
from openai import OpenAI

client = OpenAI(
    api_key="<YOUR_XAI_API_KEY_HERE>",
    base_url="https://api.x.ai/v1",
    timeout=httpx.Timeout(3600.0), # Override default timeout with longer timeout for reasoning models
)

completion = client.chat.completions.create(
    model="grok-4",
    messages=[
        {"role": "system", "content": "You are a PhD-level mathematician."},
        {"role": "user", "content": "What is 2 + 2?"},
    ],
)

print(completion.choices[0].message)
```

```javascriptOpenAISDK
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "<api key>",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000, // Override default timeout with longer timeout for reasoning models
});

const completion = await client.chat.completions.create({
    model: "grok-4",
    messages: [
        {
            role: "system",
            content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy."
        },
        {
            role: "user",
            content: "What is the meaning of life, the universe, and everything?"
        },
    ],
});
console.log(completion.choices[0].message);
```

```javascriptAISDK
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';

const result = await generateText({
  model: xai('grok-4'),
  system:
    "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy.",
  prompt: 'What is the meaning of life, the universe, and everything?',
});

console.log(result.text);
```

```bash
curl https://api.x.ai/v1/chat/completions \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer $XAI_API_KEY" \\
-m 3600 \\
-d '{
    "messages": [
        {
            "role": "system",
            "content": "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."
        },
        {
            "role": "user",
            "content": "What is the meaning of life, the universe, and everything?"
        }
    ],
    "model": "grok-4",
    "stream": false
}'
```

Response:

```pythonXAI
'2 + 2 equals 4.'
```

```pythonOpenAISDK
ChatCompletionMessage(
  content='2 + 2 equals 4.',
  refusal=None,
  role='assistant',
  audio=None,
  function_call=None,
  tool_calls=None
)
```

```javascriptOpenAISDK
{
  role: 'assistant',
  content: \`Ah, the ultimate question! According to Douglas Adams' "The Hitchhiker's Guide to the Galaxy," the answer to the ultimate question of life, the universe, and everything is **42**. However, the guide also notes that the actual question to which this is the answer is still unknown. Isn't that delightfully perplexing? Now, if you'll excuse me, I'll just go ponder the intricacies of existence.\`
  refusal: null
}
```

```javascriptAISDK
// result object structure
{
  text: "Ah, the ultimate question! As someone...",
  finishReason: "stop",
  usage: {
    inputTokens: 716,
    outputTokens: 126,
    totalTokens: 1009,
    reasoningTokens: 167
  },
  totalUsage: { /* same as usage */ }
}
```

```bash
{
  "id": "0daf962f-a275-4a3c-839a-047854645532",
  "object": "chat.completion",
  "created": 1739301120,
  "model": "grok-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The meaning of life, the universe, and everything is a question that has puzzled philosophers, scientists, and hitchhikers alike. According to the Hitchhiker's Guide to the Galaxy, the answer to this ultimate question is simply \"42\". However, the exact nature of the question itself remains unknown. So, while we may have the answer, the true meaning behind it is still up for debate. In the meantime, perhaps we should all just enjoy the journey and have a good laugh along the way!",
        "refusal": null
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 41,
    "completion_tokens": 104,
    "total_tokens": 145,
    "prompt_tokens_details": {
      "text_tokens": 41,
      "audio_tokens": 0,
      "image_tokens": 0,
      "cached_tokens": 0
    }
  },
  "system_fingerprint": "fp_84ff176447"
}
```

## Conversations

The xAI API is stateless and does not process new request with the context of your previous request history.

However, you can provide previous chat generation prompts and results to a new chat generation request to let the model process your new request with the context in mind.

An example message:

```json
{
  "role": "system",
  "content": [{ "type": "text", "text": "You are a helpful and funny assistant."}]
}
{
  "role": "user",
  "content": [{ "type": "text", "text": "Why don't eggs tell jokes?" }]
},
{
  "role": "assistant",
  "content": [{ "type": "text", "text": "They'd crack up!" }]
},
{
  "role": "user",
  "content": [{"type": "text", "text": "Can you explain the joke?"}],
}
```

By specifying roles, you can change how the model ingests the content.
The `system` role content should define, in an instructive tone, the way the model should respond to user request.
The `user` role content is usually used for user requests or data sent to the model.
The `assistant` role content is usually either in the model's response, or when sent within the prompt, indicates the model's response as part of conversation history.

## Message role order flexibility

Unlike some models from other providers, one of the unique aspects of xAI API is its flexibility with message role ordering:

* No Order Limitation: You can mix `system`, `user`, or `assistant` roles in any order for your conversation context.

**Example 1 - Multiple System Messages:**

```json
[
  { "role": "system", "content": "..." },
  { "role": "system", "content": "..." },
  { "role": "user", "content": "..." },
  { "role": "user", "content": "..." }
]
```

**Example 2 - User Messages First:**

```json
[
  { "role": "user", "content": "..." },
  { "role": "user", "content": "..." },
  { "role": "system", "content": "..." }
]
```


