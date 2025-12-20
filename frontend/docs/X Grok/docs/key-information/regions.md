#### Key Information

# Regional Endpoints

By default, you can access our API at `https://api.x.ai`. This is the most suitable endpoint for most customers,
as the request will be automatically routed by us to be processed in the region with lowest latency for your request.

For example, if you are based in US East Coast and send your request to `https://api.x.ai`, your request will be forwarded
to our `us-east-1` region and we will try to process it there first. If there is not enough computing resource in `us-east-1`,
we will send your request to other regions that are geographically closest to you and can handle the request.

## Using a regional endpoint

If you have specific data privacy requirements that would require the request to be processed within a specified region,
you can leverage our regional endpoint.

You can send your request to `https://<region-name>.api.x.ai`. For the same example, to send request from US East Coast to `us-east-1`,
you will now send the request to `https://us-east-1.api.x.ai`. If for some reason, we cannot handle your request in `us-east-1`, the request will fail.

## Example of using regional endpoints

If you want to use a regional endpoint, you need to specify the endpoint url when making request with SDK. In xAI SDK, this is specified through the `api_host` parameter.

For example, to send request to `us-east-1`:

```pythonWithoutSDK
import os

from xai_sdk import Client
from xai_sdk.chat import user

client = Client(
api_key=os.getenv("XAI_API_KEY"),
api_host="us-east-1.api.x.ai" # Without the https://
)

chat = client.chat.create(model="grok-4")
chat.append(user("What is the meaning of life?"))

completion = chat.sample()
```

```pythonOpenAISDK
from openai import OpenAI

client = OpenAI(
api_key=XAI_API_KEY,
base_url="https://us-east-1.api.x.ai/v1",
)

completion = client.chat.completions.create(
model="grok-4",
messages=[
{"role": "user", "content": "What is the meaning of life?"}
]
)
```

```javascriptOpenAISDK
import OpenAI from "openai";

const client = new OpenAI({
apiKey: XAI_API_KEY,
baseURL: "https://us-east-1.api.x.ai/v1",
});

const completion = await client.chat.completions.create({
model: "grok-4",
messages: [
{ role: "user", content: "What is the meaning of life?" }
]
});
```

```bash
curl https://us-east-1.api.x.ai/v1/chat/completions \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer $XAI_API_KEY" \\
-d '{
"messages": [
{
"role": "user",
"content": "What is the meaning of life, the universe, and everything?"
}
],
"model": "grok-4",
"stream": false
}'
```

## Model availability across regions

While we strive to make every model available across all regions, there could be occasions where some models are not
available in some regions.

By using the global `https://api.x.ai` endpoint, you would have access to all models available to your team, since we
route your request automatically. If you're using a regional endpoint, please refer to [xAI Console](https://console.x.ai)
for the available models to your team in each region, or [Models and Pricing](../models) for the publicly available models.


