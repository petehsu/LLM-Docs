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

# Models

Llama API is currently available as a preview release, with ongoing changes to API endpoints, parameters and models.

The models endpoint provides information about the Llama models supported by the API, including their capabilities and specifications. Use this endpoint to retrieve a list of these models or get details about a specific model.See the [models list](/docs/models) for details on each available model.

---

Base URL `https://api.llama.com/v1`

## GET /models

Lists the currently available models, and provides basic information about each one.

## Response

`HTTP 200`OK

## Content Type: application/json

---

object

string

optional

---

data

array

required

---

## Request example

curl

1

2

3

4

curl "https://api.llama.com/v1/models" \

-X GET \

-H "Content-Type: application/json" \

-H "Authorization: Bearer $LLAMA\_API\_KEY"

Enter to Rename, Shift+Enter to Preview

## Response example

JSON

{

"object": "list",

"data": [

{

"id": "Llama-3.3-70B-Instruct",

"created": 1735718400,

"object": "model",

"owned\_by": "Meta"

},

{

"id": "Llama-3.3-8B-Instruct",

"created": 1735718400,

"object": "model",

"owned\_by": "Meta"

},

{

"id": "Llama-4-Scout-17B-16E-Instruct-FP8",

"created": 1735718400,

"object": "model",

"owned\_by": "Meta"

},

{

"id": "Llama-4-Maverick-17B-128E-Instruct-FP8",

"created": 1735718400,

"object": "model",

"owned\_by": "Meta"

}

]

}

Enter to Rename, Shift+Enter to Preview

---

Base URL `https://api.llama.com/v1`

# 

## GET /models/{model}

## Parameters

| Name | Description | Required |
| --- | --- | --- |
| `model` | The ID of the model to use for this request. | required |

## Response

`HTTP 200`OK

## Content Type: application/json

---

id

string

required

The unique model identifier, which can be referenced in the API.

---

owned\_by

string

required

The owner of the model.

---

object

string

required

The object type, which is always "model"

---

created

integer

required

The creation time of the model.

---

## Request example

curl

1

2

3

4

curl "https://api.llama.com/v1/models/Llama-4-Scout-17B-16E-Instruct-FP8" \

-X GET \

-H "Content-Type: application/json" \

-H "Authorization: Bearer $LLAMA\_API\_KEY"

Enter to Rename, Shift+Enter to Preview

## Response example

JSON

{

"id": "Llama-4-Scout-17B-16E-Instruct-FP8",

"created": 1735718400,

"object": "model",

"owned\_by": "Meta"

}

Enter to Rename, Shift+Enter to Preview