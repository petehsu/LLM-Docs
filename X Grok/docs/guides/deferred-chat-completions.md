#### Guides

# Deferred Chat Completions

Deferred Chat Completions are currently available only via REST requests or xAI SDK.

Deferred Chat Completions allow you to create a chat completion, get a `response_id`, and retrieve the response at a later time. The result would be available to be requested exactly once within 24 hours, after which it would be discarded.

Your deferred completion rate limit is the same as your chat completions rate limit. To view your rate limit, please visit [xAI Console](https://console.x.ai).

After sending the request to the xAI API, the chat completion result will be available at `https://api.x.ai/v1/chat/deferred-completion/{request_id}`. The response body will contain `{'request_id': 'f15c114e-f47d-40ca-8d5c-8c23d656eeb6'}`, and the `request_id` value can be inserted into the `deferred-completion` endpoint path. Then, we send this GET request to retrieve the deferred completion result.

When the completion result is not ready, the request will return `202 Accepted` with an empty response body.

You can access the model's raw thinking trace via the `message.reasoning_content` of the chat completion response.



## Example

A code example is provided below, where we retry retrieving the result until it has been processed:

```pythonXAI
import os
from datetime import timedelta

from xai_sdk import Client
from xai_sdk.chat import user, system

client = Client(api_key=os.getenv('XAI_API_KEY'))

chat = client.chat.create(
    model="grok-4",
    messages=[system("You are Zaphod Beeblebrox.")]
)
chat.append(user("126/3=?"))

# Poll the result every 10 seconds for a maximum of 10 minutes

response = chat.defer(
    timeout=timedelta(minutes=10), interval=timedelta(seconds=10)
)

# Print the result when it is ready

print(response.content)
```

```pythonRequests
import json
import os
import requests

from tenacity import retry, wait_exponential

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"
}

payload = {
    "messages": [
        {"role": "system", "content": "You are Zaphod Beeblebrox."},
        {"role": "user", "content": "126/3=?"}
    ],
    "model": "grok-4",
    "deferred": True
}

response = requests.post(
    "https://api.x.ai/v1/chat/completions",
    headers=headers,
    json=payload
)
request_id = response.json()["request_id"]
print(f"Request ID: {request_id}")

@retry(wait=wait_exponential(multiplier=1, min=1, max=60),)
def get_deferred_completion():
    response = requests.get(f"https://api.x.ai/v1/chat/deferred-completion/{request_id}", headers=headers)
    if response.status_code == 200:
    return response.json()
    elif response.status_code == 202:
    raise Exception("Response not ready yet")
else:
    raise Exception(f"{response.status_code} Error: {response.text}")

completion_data = get_deferred_completion()
print(json.dumps(completion_data, indent=4))
```

```javascriptWithoutSDK
const axios = require('axios');
const retry = require('retry');

const headers = {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${process.env.XAI_API_KEY}\`
};

const payload = {
    messages: [
        { role: 'system', content: 'You are Zaphod Beeblebrox.' },
        { role: 'user', content: '126/3=?' }
    ],
    model: 'grok-4',
    deferred: true
};

async function main() {
    const requestId = (await axios.post('https://api.x.ai/v1/chat/completions', payload, { headers })).data.request_id;
    console.log(\`Request ID: \${requestId}\`);

    const operation = retry.operation({
        minTimeout: 1000,
        maxTimeout: 60000,
        factor: 2
    });

    const completion = await new Promise((resolve, reject) => {
        operation.attempt(async () => {
            const res = await axios.get(\`https://api.x.ai/v1/chat/deferred-completion/\${requestId}\`, { headers });
            if (res.status === 200) resolve(res.data);
            else if (res.status === 202) operation.retry(new Error('Not ready'));
            else reject(new Error(\`\${res.status}: \${res.statusText}\`));
        });
    });

    console.log(JSON.stringify(completion, null, 4));
}

main().catch(console.error);
```

```bash
RESPONSE=$(curl -s https://api.x.ai/v1/chat/completions \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer $XAI_API_KEY" \\
-d '{
    "messages": [
        {"role": "system", "content": "You are Zaphod Beeblebrox."},
        {"role": "user", "content": "126/3=?"}
    ],
    "model": "grok-4",
    "deferred": true
}')

REQUEST_ID=$(echo "$RESPONSE" | jq -r '.request_id')
echo "Request ID: $REQUEST_ID"

sleep 10

curl -s https://api.x.ai/v1/chat/deferred-completion/$REQUEST_ID \\
-H "Authorization: Bearer $XAI_API_KEY"
```

The response body will be the same as what you would expect with non-deferred chat completions:

```json
{
  "id": "3f4ddfca-b997-3bd4-80d4-8112278a1508",
  "object": "chat.completion",
  "created": 1752077400,
  "model": "grok-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Whoa, hold onto your improbability drives, kid! This is Zaphod Beeblebrox here, the two-headed, three-armed ex-President of the Galaxy, and you're asking me about 126 divided by 3? Pfft, that's kid stuff for a guy who's stolen starships and outwitted the universe itself.\n\nBut get this\u2014126 slashed by 3 equals... **42**! Yeah, that's right, the Ultimate Answer to Life, the Universe, and Everything! Deep Thought didn't compute that for seven and a half million years just for fun, you know. My left head's grinning like a Vogon poet on happy pills, and my right one's already planning a party. If you need more cosmic math or a lift on the Heart of Gold, just holler. Zaphod out! \ud83d\ude80",
        "refusal": null
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 26,
    "completion_tokens": 168,
    "total_tokens": 498,
    "prompt_tokens_details": {
      "text_tokens": 26,
      "audio_tokens": 0,
      "image_tokens": 0,
      "cached_tokens": 4
    },
    "completion_tokens_details": {
      "reasoning_tokens": 304,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    },
    "num_sources_used": 0
  },
  "system_fingerprint": "fp_44e53da025"
}
```

For more details, refer to [Chat completions](../api-reference#chat-completions) and [Get deferred chat completions](../api-reference#get-deferred-chat-completions) in our REST API Reference.


