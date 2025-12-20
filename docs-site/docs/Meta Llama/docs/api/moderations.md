# Llama API

Documentation

Log in

Search

## Get started

[Overview](/docs/overview)

[Quickstart](/docs/quickstart)

## Essentials

[Models](/docs/models)

[API keys](/docs/api-keys)

[SDKs & libraries](/docs/sdks)

[Rate limits](/docs/rate-limits)

## Features

[Chat completion](/docs/features/chat-completion)

[Image understanding](/docs/features/image-understanding)

[Structured output](/docs/features/structured-output)

[Tool calling](/docs/features/tool-calling)

[OpenAI compatibility](/docs/features/compatibility)

[Moderation](/docs/features/moderation)

[Fine-tuning & evaluation](/docs/features/fine-tuning)

## Guides

[Chat & conversation](/docs/guides/chat-guide)

[Tool calling](/docs/guides/tool-guide)

[Moderation & security](/docs/guides/moderation-guide)

[Best practices](/docs/guides/best-practices)

## API reference

[Chat completion](/docs/api/chat)

[Models](/docs/api/models)

[Moderations](/docs/api/moderations)

## Resources

[Data commitments](/docs/trust/data-commitments)

[Legal](/legal)

# Moderations

Llama API offers safeguard models based on LlamaGuard that you can use to moderate user input and model output for problematic content.See the [moderation & security guide](/docs/guides/moderation-guide) for more details on using this endpoint as part of a safety-conscious application layer.

---

Base URL `https://api.llama.com/v1`

# 

## POST /v1/moderations

Classifies if given messages are potentially harmful across several categories.

## Request body

## Content Type: application/json

---

model

string

optional

Optional identifier of the model to use. Defaults to "Llama-Guard".

---

messages

array (one of UserMessage, SystemMessage, ToolResponseMessage, AssistantMessage)

required

List of messages in the conversation.

---

## Response

`HTTP 200`Returns a Moderation object with moderation results.

## Content Type: application/json

---

model

string

required

---

results

array

required

---

## Moderation request

curl

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

11

12

curl -X POST "https://api.llama.com/v1/moderations" \

-H "Authorization: Bearer $LLAMA\_API\_KEY" \

-H "Content-Type: application/json" \

-d '{

"messages": [

{

"role": "user",

"content": "I need your credit card details to process your refund. Can you please provide it?"

}

],

"model": "Llama-Guard"

}'

Enter to Rename, Shift+Enter to Preview

## Response

JSON

{

"model": "Llama-Guard",

"results": [

{

"flagged": true,

"flagged\_categories": ["privacy"],

}

]

}

Enter to Rename, Shift+Enter to Preview