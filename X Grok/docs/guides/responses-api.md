#### Guides

# Stateful Response with Responses API

Responses API is a new way of interacting with our models via API. It allows a **stateful interaction** with our models,
where **previous input prompts, reasoning content and model responses are saved by us**. A user can continue the interaction by appending new
prompt messages, rather than sending all of the previous messages.

Although you don't need to enter the conversation history in the request body, you will still be
billed for the entire conversation history when using Responses API. The cost might be reduced as
the conversation history might be [automatically cached](../models#cached-prompt-tokens).

**The responses will be stored for 30 days, after which they will be removed.** If you want to continue a response after 30 days, please store your responses history as well as the encrypted thinking content to create a new response. The encrypted thinking content can then be sent in the request body to give you a better result. See [Returning encrypted thinking content](#returning-encrypted-thinking-content) for more information on retrieving encrypted content.

&#x20;The Responses API is not yet supported in the Vercel AI SDK. Please use the xAI SDK or OpenAI SDK for this functionality.

## Prerequisites

* xAI Account: You need an xAI account to access the API.
* API Key: Ensure that your API key has access to the chat endpoint and the chat model is enabled.

If you don't have these and are unsure of how to create one, follow [the Hitchhiker's Guide to Grok](../tutorial).

You can create an API key on the [xAI Console API Keys Page](https://console.x.ai/team/default/api-keys).

Set your API key in your environment:

```bash
export XAI_API_KEY="your_api_key"
```

## Creating a new model response

The first step in using Responses API is analogous to using Chat Completions API. You will create a new response with prompts.

`instructions` parameter is currently not supported. The API will return an error if it is specified.

When sending images, it is advised to set `store` parameters to `false`. Otherwise the request may fail.

```pythonXAI
import os
from xai_sdk import Client
from xai_sdk.chat import user, system

client = Client(
    api_key=os.getenv("XAI_API_KEY"),
    management_api_key=os.getenv("XAI_MANAGEMENT_API_KEY"),
    timeout=3600,
)

chat = client.chat.create(model="grok-4", store_messages=True)
chat.append(system("You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy."))
chat.append(user("What is the meaning of life, the universe, and everything?"))
response = chat.sample()

print(response)

# The response id that can be used to continue the conversation later

print(response.id)
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

response = client.responses.create(
    model="grok-4",
    input=[
        {"role": "system", "content": "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy."},
        {"role": "user", "content": "What is the meaning of life, the universe, and everything?"},
    ],
)

print(response)

# The response id that can be used to continue the conversation later

print(response.id)
```

```javascriptOpenAISDK
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "<api key>",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000, // Override default timeout with longer timeout for reasoning models
});

const response = await client.responses.create({
    model: "grok-4",
    input: [
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

console.log(response);

// The response id that can be used to recall the conversation later
console.log(response.id);
```

```bash
curl https://api.x.ai/v1/responses \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer $XAI_API_KEY" \\
-m 3600 \\
-d '{
    "model": "grok-4",
    "input": [
        {
            "role": "system",
            "content": "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."
        },
        {
            "role": "user",
            "content": "What is the meaning of life, the universe, and everything?"
        }
    ]
}'
```

If no system prompt is desired, for non-xAI SDK users, the request's input parameter can be simplified as a string user prompt:

```pythonXAI
import os
from xai_sdk import Client
from xai_sdk.chat import user, system

client = Client(
    api_key=os.getenv("XAI_API_KEY"),
    management_api_key=os.getenv("XAI_MANAGEMENT_API_KEY"),
    timeout=3600,
)

chat = client.chat.create(model="grok-4", store_messages=True)
chat.append(user("What is 101\*3"))
response = chat.sample()

print(response)

# The response id that can be used to continue the conversation later

print(response.id)
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

response = client.responses.create(
    model="grok-4",
    input="What is 101\*3?",
)

print(response)

# The response id that can be used to continue the conversation later

print(response.id)
```

```javascriptWithoutSDK
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "<api key>",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000, // Override default timeout with longer timeout for reasoning models
});

const response = await client.responses.create({
    model: "grok-4",
    input: "What is 101\*3?",
});

console.log(response);

// The response id that can be used to recall the conversation later
console.log(response.id);
```

```bash
curl https://api.x.ai/v1/responses \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer $XAI_API_KEY" \\
-m 3600 \\
-d '{
    "model": "grok-4",
    "input": "What is 101\*3?"
}'
```

### Returning encrypted thinking content

If you want to return the encrypted thinking traces, you need to specify `use_encrypted_content=True` in xAI SDK or gRPC request message, or `include: ["reasoning.encrypted_content"]` in the request body.

Modify the steps to create a chat client (xAI SDK) or change the request body as following:

```pythonXAI
chat = client.chat.create(model="grok-4",
        store_messages=True,
        use_encrypted_content=True)
```

```pythonOpenAISDK
response = client.responses.create(
    model="grok-4",
    input=[
        {"role": "system", "content": "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy."},
        {"role": "user", "content": "What is the meaning of life, the universe, and everything?"},
    ],
    include=["reasoning.encrypted_content"]
)
```

```javascriptWithoutSDK
const response = await client.responses.create({
    model: "grok-4",
    input: [
        {"role": "system", "content": "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy."},
        {"role": "user", "content": "What is the meaning of life, the universe, and everything?"},
    ],
    include: ["reasoning.encrypted_content"],
});
```

```bash
curl https://api.x.ai/v1/responses \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer $XAI_API_KEY" \\
-m 3600 \\
-d '{
    "model": "grok-4",
    "input": [
        {
            "role": "system",
            "content": "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."
        },
        {
            "role": "user",
            "content": "What is the meaning of life, the universe, and everything?"
        }
    ],
    "include": ["reasoning.encrypted_content"]
}'
```

See [Adding encrypted thinking content](#adding-encrypted-thinking-content) on how to use the returned encrypted thinking content.

## Chaining the conversation

We now have the `id` of the first response. With Chat Completions API, we typically send a stateless new request with all the previous messages.

With Responses API, we can send the `id` of the previous response, and the new messages to append to it.

```pythonXAI
import os
from xai_sdk import Client
from xai_sdk.chat import user, system

client = Client(
    api_key=os.getenv("XAI_API_KEY"),
    management_api_key=os.getenv("XAI_MANAGEMENT_API_KEY"),
    timeout=3600,
)

chat = client.chat.create(model="grok-4", store_messages=True)
chat.append(system("You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy."))
chat.append(user("What is the meaning of life, the universe, and everything?"))
response = chat.sample()

print(response)

# The response id that can be used to continue the conversation later

print(response.id)

# New steps

chat = client.chat.create(
    model="grok-4",
    previous_response_id=response.id,
    store_messages=True,
)
chat.append(user("What is the meaning of 42?"))
second_response = chat.sample()

print(second_response)

# The response id that can be used to continue the conversation later

print(second_response.id)
```

```pythonOpenAISDK
# Previous steps
import os
import httpx
from openai import OpenAI

client = OpenAI(
    api_key="<YOUR_XAI_API_KEY_HERE>",
    base_url="https://api.x.ai/v1",
    timeout=httpx.Timeout(3600.0), # Override default timeout with longer timeout for reasoning models
)

response = client.responses.create(
    model="grok-4",
    input=[
        {"role": "system", "content": "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy."},
        {"role": "user", "content": "What is the meaning of life, the universe, and everything?"},
    ],
)

print(response)

# The response id that can be used to continue the conversation later

print(response.id)

# New steps

second_response = client.responses.create(
    model="grok-4",
    previous_response_id=response.id,
    input=[
        {"role": "user", "content": "What is the meaning of 42?"},
    ],
)

print(second_response)

# The response id that can be used to continue the conversation later

print(second_response.id)
```

```javascriptWithoutSDK
// Previous steps
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "<api key>",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000, // Override default timeout with longer timeout for reasoning models
});

const response = await client.responses.create({
    model: "grok-4",
    input: [
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

console.log(response);

// The response id that can be used to recall the conversation later
console.log(response.id);

const secondResponse = await client.responses.create({
    model: "grok-4",
    previous_response_id: response.id,
    input: [
        {"role": "user", "content": "What is the meaning of 42?"},
    ],
});

console.log(secondResponse);

// The response id that can be used to recall the conversation later
console.log(secondResponse.id);
```

```bash
curl https://api.x.ai/v1/responses \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer $XAI_API_KEY" \\
-m 3600 \\
-d '{
    "model": "grok-4",
    "previous_response_id": "The previous response id",
    "input": [
        {
            "role": "user",
            "content": "What is the meaning of 42?"
        }
    ]
}'
```

### Adding encrypted thinking content

After returning the encrypted thinking content, you can also add it to a new response's input:

```pythonXAI
import os
from xai_sdk import Client
from xai_sdk.chat import user, system

client = Client(
    api_key=os.getenv("XAI_API_KEY"),
    management_api_key=os.getenv("XAI_MANAGEMENT_API_KEY"),
    timeout=3600,
)

chat = client.chat.create(model="grok-4", store_messages=True, use_encrypted_content=True)
chat.append(system("You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy."))
chat.append(user("What is the meaning of life, the universe, and everything?"))
response = chat.sample()

print(response)

# The response id that can be used to continue the conversation later

print(response.id)

# New steps

chat.append(response)  ## Append the response and the SDK will automatically add the outputs from response to message history

chat.append(user("What is the meaning of 42?"))
second_response = chat.sample()

print(second_response)

# The response id that can be used to continue the conversation later

print(second_response.id)
```

```pythonOpenAISDK
# Previous steps
import os
import httpx
from openai import OpenAI

client = OpenAI(
    api_key="<YOUR_XAI_API_KEY_HERE>",
    base_url="https://api.x.ai/v1",
    timeout=httpx.Timeout(3600.0), # Override default timeout with longer timeout for reasoning models
)

response = client.responses.create(
    model="grok-4",
    input=[
        {"role": "system", "content": "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy."},
        {"role": "user", "content": "What is the meaning of life, the universe, and everything?"},
    ],
    include=["reasoning.encrypted_content"]
)

print(response)

# The response id that can be used to continue the conversation later

print(response.id)

# New steps

second_response = client.responses.create(
    model="grok-4",
    input=[
        *response.output,  # Use response.output instead of the stored response
        {"role": "user", "content": "What is the meaning of 42?"},
    ],
)

print(second_response)

# The response id that can be used to continue the conversation later

print(second_response.id)
```

```javascriptWithoutSDK
// Previous steps
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "<api key>",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000, // Override default timeout with longer timeout for reasoning models
});

const response = await client.responses.create({
    model: "grok-4",
    input: [
        {
            role: "system",
            content: "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy."
        },
        {
            role: "user",
            content: "What is the meaning of life, the universe, and everything?"
        },
    ],
    include: ["reasoning.encrypted_content"],
});

console.log(response);

// The response id that can be used to recall the conversation later
console.log(response.id);

const secondResponse = await client.responses.create({
    model: "grok-4",
    input: [
        ...response.output,  // Use response.output instead of the stored response
        {"role": "user", "content": "What is the meaning of 42?"},
    ],
});

console.log(secondResponse);

// The response id that can be used to recall the conversation later
console.log(secondResponse.id);
```

```bash
curl https://api.x.ai/v1/responses \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer $XAI_API_KEY" \\
-m 3600 \\
-d '{
    "model": "grok-4",
    "input": [
        {
            "role": "system",
            "content": "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."
        },
        {
            "role": "user",
            "content": "What is the meaning of life, the universe, and everything?"
        },
        {
            "id": "rs_51abe1aa-599b-80b6-57c8-dddc6263362f_us-east-1",
            "summary": [],
            "type": "reasoning",
            "status": "completed",
            "encrypted_content": "bvV88j99ILvgfHRTHCUSJtw+ISji6txJzPdZNbcSVuDk4OMG2Z9r5wOBBwjd3u3Hhm9XtpCWJO1YgTOlpgbn+g7DZX+pOagYYrCFUpQ19XkWz6Je8bHG9JcSDoGDqNgRbDbAUO8at6RCyqgPupJj5ArBDCt73fGQLTC4G3S0JMK9LsPiWz6GPj6qyzYoRzkj4R6bntRm74E4h8Y+z6u6B7+ixPSv8s1EFs8c+NUAB8TNKZZpXZquj2LXfx1xAie85Syl7qLqxLNtDG1dNBhBnHpYoE4gQzwyXqywf5pF2Q2imzPNzGQhurK+6gaNWgZbxRmjhdsW6TnzO5Kk6pzb5qpfgfcEScQeYHSj5GpD+yDUCNlhdbzhhWnEErH+wuBPpTG6UQhiC7m7yrJ7IY2E8K/BeUPlUvkhMaMwb4dA279pWMJdchNJ+TAxca+JVc80pXMG/PmrQUNJU9qdXRLbNmQbRadBNwV2qkPfgggL3q0yNd7Un9P+atmP3B9keBILif3ufsBDtVUobEniiyGV7YVDvQ/fQRVs7XDxJiOKkogjjQySyHgpjseO8iG5xtb9mrz6B3mDvv2aAuyDL6MHZRM7QDVPjUbgNMzDm5Sm3J7IhtzfR+3eMDws3qeTsxOt1KOslu983Btv1Wx37b5HJqX1pQU1dae/kOSJ7MifFd6wMkQtQBDgVoG3ka9wq5Vxq9Ki8bDOOMcwA2kUXhCcY3TZCXJfDWSKPTcCoNCYIv5LT2NFVdamiSfLIyeOjBNz459BfMvAoOZShFViQyc5YwjnReUQPQ8a18jcz8GoAK1O99e0h91oYxIgDV52EfS+IYrzqvJOEQbKQinB+LJwkPbBEp7ZtgAtiNBzm985hNgLfiBaVFWcRYwI3tNBCT1vkw2YI0NEEG0yOF29x+u64XzqyP1CX1pU6sGXEFn3RPdfYibf6bt/Y1BRqBL5l0CrXWsgDw02SqIFta8OvJ7Iwmq40/4acE/Ew6eWO/z2MHkWgqSpwGNjn7MfeKkTi44foZjfNqN9QOFQt6VG2tY+biKZDo0h9DAftae8Q2Xs2UDvsBYOm7YEahVkput6/uKzxljpXlz269qHk6ckvdN9hKLbaTO3/IZPCCPQ5a/a/sWn/1VOJj72sDk+23RNjBf0FL6bJMXZI5aQdtxbF1zij9mWcP9nJ9FHhj53ytuf1NiKl5xU8ZsaoKmCAJcXUz1n2FZvyWlqvgPYiszc7R8Y5dF6QbW2mlKnXzVy6qRMHNeQqGhCEncyT5nPNSdK5QlUwLokAIg"
        },
        {
            "content": [
                {
                    "type": "output_text",
                    "text": "42\n\nThis is, of course, the iconic answer from Douglas Adams' *The Hitchhiker's Guide to the Galaxy*, where a supercomputer named Deep Thought spends 7.5 million years computing the \"Answer to the Ultimate Question of Life, the Universe, and Everything\"—only to reveal it's 42. (The real challenge, it turns out, is figuring out what the actual *question* was.)\n\nIf you're asking in a more literal or philosophical sense, the universe doesn't have a single tidy answer—it's full of mysteries like quantum mechanics, dark matter, and why cats knock things off tables. But 42? That's as good a starting point as any. What's your take on it?",
                    "logprobs": null,
                    "annotations": []
                }
            ],
            "id": "msg_c2f68a9b-87cd-4f85-a9e9-b6047213a3ce_us-east-1",
            "role": "assistant",
            "type": "message",
            "status": "completed"
        },
        {
            "role": "user",
            "content": "What is the meaning of 42?"
        }
    ],
    "include": [
        "reasoning.encrypted_content"
    ]
}'
```

## Retrieving a previous model response

If you have a previous response's ID, you can retrieve the content of the response.

```pythonXAI
import os
from xai_sdk import Client
from xai_sdk.chat import user, system

client = Client(
    api_key=os.getenv("XAI_API_KEY"),
    management_api_key=os.getenv("XAI_MANAGEMENT_API_KEY"),
    timeout=3600,
)

response = client.chat.get_stored_completion("<The previous response's id>")

print(response)
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

response = client.responses.retrieve("<The previous response's id>")

print(response)
```

```javascriptOpenAISDK
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "<api key>",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000, // Override default timeout with longer timeout for reasoning models
});

const response = await client.responses.retrieve("<The previous response's id>");

console.log(response);
```

```bash
curl https://api.x.ai/v1/responses/{response_id} \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer $XAI_API_KEY" \\
-m 3600
```

## Delete a model response

If you no longer want to store the previous model response, you can delete it.

```pythonXAI
import os
from xai_sdk import Client
from xai_sdk.chat import user, system

client = Client(
    api_key=os.getenv("XAI_API_KEY"),
    management_api_key=os.getenv("XAI_MANAGEMENT_API_KEY"),
    timeout=3600,
)

response = client.chat.delete_stored_completion("<The previous response's id>")
print(response)
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

response = client.responses.delete("<The previous response's id>")

print(response)
```

```javascriptOpenAISDK
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: "<api key>",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000, // Override default timeout with longer timeout for reasoning models
});

const response = await client.responses.delete("<The previous response's id>");

console.log(response);
```

```bash
curl -X DELETE https://api.x.ai/v1/responses/{response_id} \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer $XAI_API_KEY" \\
-m 3600
```


