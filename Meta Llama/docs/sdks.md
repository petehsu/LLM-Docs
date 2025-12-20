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

# SDKs and libraries

Llama API is designed to be familiar to developers who already use AI in their applications and intuitive for new developers to get started with AI.Because the API offers endpoints in a REST-like interface, it is easy to make API calls directly from most programming languages. If you prefer to incorporate a library to make calls to Llama API, several options are available, including official libraries from Meta and supported libraries from other providers.

## Official libraries

Meta maintains client SDKs for Llama API in multiple languages, making it easy to access the API endpoints from application code in common programming languages, and from both client-side and server-side environments.Llama API clients are also available as libraries via popular package managers like [pypi](https://pypi.org/) and [npm](https://www.npmjs.com/).Find an SDK that matches your needs in the table below:

| Language | GitHub | Package Manager |
| --- | --- | --- |
| Python | [llama-api-python](https://github.com/meta-llama/llama-api-python) | [pypi](https://pypi.org/project/llama-api-client) |
| TypeScript | [llama-api-typescript](https://github.com/meta-llama/llama-api-typescript) | [npm](https://www.npmjs.com/package/llama-api-client) |

## Example

Python (Llama API SDK)

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

import os

from llama\_api\_client import LlamaAPIClient

# Note: LLAMA\_API\_KEY is the defauly environment variable used by the Llama API client, and can be omitted if already set

client = LlamaAPIClient(

api\_key=os.environ.get("LLAMA\_API\_KEY"),

)

completion = client.chat.completions.create(

messages=[

{

"role": "user",

"content": "What is the moon made of?",

}

],

model="Llama-4-Maverick-17B-128E-Instruct-FP8",

)

print(completion.completion\_message.content.text)

Enter to Rename, Shift+Enter to Preview

## Other supported libraries

Llama API also offers compatibility with popular libraries, such as the [OpenAI libraries](https://platform.openai.com/docs/libraries). Compatibility with OpenAI-based libraries is offered via a dedicated endpoint base URL:

https://api.llama.com/compat/v1/

Enter to Rename, Shift+Enter to Preview

Some of the features of Llama API are not supported via third-party libraries. See the [OpenAI compatibility guide](/docs/features/compatibility) for full details.

## Example

Python (OpenAI client)

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

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ.get("LLAMA\_API\_KEY"),

base\_url="https://api.llama.com/compat/v1/",

)

completion = client.chat.completions.create(

messages=[

{

"role": "user",

"content": "Which planet do humans live on?"

}

],

model="Llama-4-Maverick-17B-128E-Instruct-FP8",

)

print(completion.choices[0].message.content)

Enter to Rename, Shift+Enter to Preview

Was this page helpful?

[Official libraries](#official-libraries)

[Other supported libraries](#other-supported-libraries)