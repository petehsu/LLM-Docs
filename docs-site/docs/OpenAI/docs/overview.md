# OpenAI Platform

## Developer quickstart

Make your first API request in minutes. Learn the basics of the OpenAI platform.

[Get started](/docs/quickstart)

javascript

```
1
2
3
4
5
6
7
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.2",
    "input": "Write a short bedtime story about a unicorn."
  }'
```

```
1
2
3
4
5
6
7
8
9
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.2",
  input: "Write a short bedtime story about a unicorn.",
});

console.log(response.output_text);
```

```
1
2
3
4
5
6
7
8
9
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5.2",
    input="Write a short bedtime story about a unicorn."
)

print(response.output_text)
```

```
1
2
3
4
5
6
7
8
9
10
using OpenAI.Responses;

string apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
var client = new OpenAIResponseClient(model: "gpt-5.2", apiKey: apiKey);

OpenAIResponse response = client.CreateResponse(
    "Write a short bedtime story about a unicorn."
);

Console.WriteLine(response.GetOutputText());
```

Models

[View all](/docs/models)

[GPT-5.2

New

The best model for coding and agentic tasks across industries](/docs/models/gpt-5.2)[GPT-5 mini

A faster, cost-efficient version of GPT-5 for well-defined tasks](/docs/models/gpt-5-mini)[GPT-5 nano

Fastest, most cost-efficient version of GPT-5](/docs/models/gpt-5-nano)

## Start building

[Read and generate text

Use the API to prompt a model and generate text](/docs/guides/text)[Use a model's vision capabilities

Allow models to see and analyze images in your application](/docs/guides/images)[Generate images as output

Create images with GPT Image 1](/docs/guides/image-generation)[Build apps with audio

Analyze, transcribe, and generate audio with API endpoints](/docs/guides/audio)[Build agentic applications

Use the API to build agents that use tools and computers](/docs/guides/agents)[Achieve complex tasks with reasoning

Use reasoning models to carry out complex tasks](/docs/guides/reasoning)[Get structured data from models

Use Structured Outputs to get model responses that adhere to a JSON schema](/docs/guides/structured-outputs)[Tailor to your use case

Adjust our models to perform specifically for your use case with fine-tuning, evals, and distillation](/docs/guides/fine-tuning)

[Help center

Frequently asked account and billing questions](https://help.openai.com)[Developer forum

Discuss topics with other developers](https://community.openai.com/)[Cookbook

Open-source collection of examples and guides](https://cookbook.openai.com/)[Status

Check the status of OpenAI services](https://status.openai.com)