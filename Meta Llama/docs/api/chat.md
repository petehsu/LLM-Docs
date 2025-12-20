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

# Chat completion

Llama API is currently available as a preview release, with ongoing changes to API endpoints, parameters and models.

The chat completion endpoint generates chat completions for conversation threads using Llama models. This endpoint supports both standard completion requests and integrated tool workflows with optional server-sent event (SSE) streaming for streaming responses.
See [chat completion](/docs/features/chat-completion), [image understanding](/docs/features/image-understanding), [structured output](/docs/features/structured-output) and [tool calling](/docs/features/tool-calling) for more details on chat completion features, and learn techniques for using chat completion in production in the [chat and conversation guide](/docs/guides/chat-guide).

---

Base URL `https://api.llama.com/v1`

## POST /chat/completions

Generate a chat completion for the given messages using the specified model.

## Request body

## Content Type: application/json

---

model

string

required

The identifier of the model to use.

---

messages

array (one of UserMessage, SystemMessage, ToolResponseMessage, AssistantMessage)

required

List of messages in the conversation.

---

tools

array

optional

List of tool definitions available to the model

---

tool\_choice

one of string, object

optional

Controls which (if any) tool is called by the model.`none` means the model will not call any tool and instead generates a message.`auto` means the model can pick between generating a message or calling one or more tools.`required` means the model must call one or more tools.Specifying a particular tool via `{"type": "function", "function": {"name": "my\_function"}}` forces the model to call that tool.`none` is the default when no tools are present. `auto` is the default if tools are present.

---

response\_format

one of JSON Schema Response Format, TextResponseFormat

optional

An object specifying the format that the model must output.Setting to `{ "type": "json\_schema", "json\_schema": {...} }` enables Structured Outputs which ensures the model will match your supplied JSON schema.If not specified, the default is {"type": "text"}, and model will return a free-form text response.

---

stream

boolean

optional

If True, generate an SSE event stream of the response. Defaults to False.

---

repetition\_penalty

number

optional

Controls the likelyhood and generating repetitive responses. (minimum: 1, maximum: 2, default: 1)

---

temperature

number

optional

Controls randomness of the response by setting a temperature. Higher value leads to more creative responses. Lower values will make the response more focused and deterministic. (maximum: 1, default: 0.6)

---

top\_p

number

optional

Controls diversity of the response by setting a probability threshold when choosing the next token. (maximum: 1, default: 0.9)

---

top\_k

integer

optional

Only sample from the top K options for each subsequent token.

---

max\_completion\_tokens

integer

optional

The maximum number of tokens to generate. (minimum: 1, default: 4096)

---

user

string

optional

A unique identifier representing your application end-user for monitoring abuse.

---

## Response

`HTTP 200`If stream=False, returns a CreateChatCompletionResponse with the full completion. If stream=True, returns an SSE event stream of CreateChatCompletionResponseStreamChunk

## Content Type: application/json

Response from a chat completion request.

---

id

string

optional

The unique identifier of the chat completion request.

---

metrics

array

optional

---

completion\_message

object

required

A message containing the model's (assistant) response in a chat conversation.

---

## Content Type: text/event-stream

A chunk of a streamed chat completion response.

---

id

string

optional

The unique identifier of the chat completion request.

---

event

object

required

An event during chat completion generation.

---

## Text chat completion

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

13

14

curl -X POST https://api.llama.com/v1/chat/completions \

-H "Content-Type: application/json" \

-H "Authorization: Bearer $LLAMA\_API\_KEY" \

-d '{

"model": "Llama-4-Maverick-17B-128E-Instruct-FP8",

"messages": [

{

"role": "user",

"content": "Hello, how are you?"

}

],

"max\_completion\_tokens": 1024,

"temperature": 0.7

}'

Enter to Rename, Shift+Enter to Preview

## Image understanding from public URL

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

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

curl -X POST https://api.llama.com/v1/chat/completions \

-H "Content-Type: application/json" \

-H "Authorization: Bearer $LLAMA\_API\_KEY" \

-d '{

"model": "Llama-4-Maverick-17B-128E-Instruct-FP8",

"messages": [

{

"role": "user",

"content": [

{

"type": "text",

"text": "What do these two images have in common?"

},

{

"type": "image\_url",

"image\_url": {

"url": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Lama\_glama\_Laguna\_Colorada\_2.jpg"

}

},

{

"type": "image\_url",

"image\_url": {

"url": "https://upload.wikimedia.org/wikipedia/commons/1/12/Llamas%2C\_Laguna\_Milluni\_y\_Nevado\_Huayna\_Potos%C3%AD\_%28La\_Paz\_-\_Bolivia%29.jpg"

}

}

]

}

]

}'

Enter to Rename, Shift+Enter to Preview

## Image understanding with base64 encoding

Python

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

13

14

15

16

17

18

19

20

21

22

23

24

25

26

27

28

29

30

31

32

33

34

35

36

37

38

39

import base64

import os

import requests

def image\_to\_base64(image\_path):

with open(image\_path, "rb") as img:

return base64.b64encode(img.read()).decode('utf-8')

# Read an image from the directory where this script is running

base64\_image = image\_to\_base64("your\_image.jpg")

response = requests.post(

url="https://api.llama.com/v1/chat/completions",

headers={

"Content-Type": "application/json",

"Authorization": f"Bearer {os.environ.get('LLAMA\_API\_KEY')}"

},

json={

"model": "Llama-4-Maverick-17B-128E-Instruct-FP8",

"messages": [

{

"role": "user",

"content": [

{

"type": "text",

"text": "What does this image contain?",

},

{

"type": "image\_url",

"image\_url": {

"url": f"data:image/jpeg;base64,{base64\_image}"

},

},

],

},

]

}

)

print(response.json())

Enter to Rename, Shift+Enter to Preview