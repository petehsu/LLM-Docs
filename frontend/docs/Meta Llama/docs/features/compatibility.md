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

# OpenAI compatibility

Llama API supports the [OpenAI client libraries](https://platform.openai.com/docs/libraries) for Python and TypeScript as an alternative to the [Llama API client](/docs/sdks), to help you integrate Llama API with existing OpenAI-based applications.The base path for OpenAI compatibility is:

https://api.llama.com/compat/v1/

Enter to Rename, Shift+Enter to Preview

Some features of the OpenAI client libraries are not supported on Llama API. See below for details on feature support.

## Using the OpenAI client

Set up the OpenAI client using the base URL and your Llama API dashboard API key.

Python (OpenAI client)

1

2

3

4

5

6

7

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

Enter to Rename, Shift+Enter to Preview

Make calls to Llama API like you would for OpenAI. See below for an example of making a chat completion request.

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

20

21

22

23

24

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

# Create chat completion request

completion = client.chat.completions.create(

model="Llama-3.3-8B-Instruct",

messages=[

{

"role": "developer",

"content": "You are a helpful assistant."

},

{

"role": "user",

"content": "Hello!"

}

],

)

print(completion.choices[0].message.content)

Enter to Rename, Shift+Enter to Preview

## Feature support

Llama API supports the following OpenAI client library features:

| Feature | Support Status |
| --- | --- |
| Chat completions | Supported |
| Model selection | Supported |
| Temperature/sampling | Supported |
| Streaming | Supported |
| Image understanding | Supported |
| Structured output (JSON mode) | Supported |
| Function calling (tools) | Supported |
| Moderation | Supported\* |

\* The Moderations endpoint responses may vary from OpenAI's due to differences in underlying moderations models. Key differences between endpoint responses are summarized below:

* •`categories`: The categories returned will be consistent with those in the Llama API moderations endpoint. See [here](/docs/api/moderations#categories) for a list of categories.
* •`category_scores`: Not supported
* •`category_applied_input_types`: Not supported

## Compatibility API endpoints

The table below maps Llama API compatibility endpoints to OpenAI client functions.

| Client function | API endpoint | API method |
| --- | --- | --- |
| `client.models.list()` | `/compat/v1/models` | `GET` |
| `client.models.retrieve(model)` | `/compat/v1/models/{model}` | `GET` |
| `client.chat.completions.create(...)` | `/compat/v1/chat/completions` | `POST` |
| `client.moderations.create(...)` | `/compat/v1/moderations` | `POST` |

## Compatibility considerations

## Model mapping

Use Llama model names instead of OpenAI model names with the compatibility endpoint, and use the [Models endpoint](/docs/api/models) for a complete list of available models.

## Unsupported feature behaviour

Llama API does not support all OpenAI client library features or parameters, handling them in one of two ways:

1. Silent handling: Most unsupported parameters are ignored silently.
2. Error response: Some parameters will result in a `HTTP 400 Bad Request` error, to notify you about unsupported features.

Thoroughly test your implementation before migration to ensure compatibility works as expected.

## Examples

## List models

Use the OpenAI client to retrieve a list of available Llama API models:

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

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

# List all available models

models = client.models.list()

print(models.to\_json())

Enter to Rename, Shift+Enter to Preview

## Retrieve model

Retrieve detailed information about a specific model:

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

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

# Retrieve information about a model

model = client.models.retrieve("Llama-4-Scout-17B-16E-Instruct-FP8")

print(f"Retrieved model: {model.id}; Owner: {model.owned\_by}")

Enter to Rename, Shift+Enter to Preview

## Chat completion

Create text completions from a conversation context:

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

20

21

22

23

24

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

# Create chat completion request

completion = client.chat.completions.create(

model="Llama-3.3-8B-Instruct",

messages=[

{

"role": "developer",

"content": "You are a helpful assistant."

},

{

"role": "user",

"content": "Hello!"

}

],

)

print(completion.choices[0].message.content)

Enter to Rename, Shift+Enter to Preview

## Streaming chat completion

Get chat completions as they are generated, one chunk at a time:

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

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

stream = client.chat.completions.create(

model="Llama-4-Scout-17B-16E-Instruct-FP8",

messages=[{"role": "user", "content": "Tell me a story."}],

stream=True

)

for chunk in stream:

if chunk.choices[0].delta.content:

print(chunk.choices[0].delta.content, end="")

Enter to Rename, Shift+Enter to Preview

## Image understanding

Use the chat interface to process and understand Base64 encoded images:

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

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

completion = client.chat.completions.create(

model="Llama-4-Scout-17B-16E-Instruct-FP8",

messages=[

{

"role": "user",

"content": [

{

"type": "text",

"text": "What's in this image?"

},

{

"type": "image\_url",

"image\_url": {

"url": "https://upload.wikimedia.org/wikipedia/commons/8/8f/The-Transformer-model-architecture.png"

},

},

],

}

],

)

print(completion.choices[0].message.content)

Enter to Rename, Shift+Enter to Preview

## Structured outputs

Generate structured outputs using Pydantic models.

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

20

21

22

23

24

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

from pydantic import BaseModel

class CalendarEvent(BaseModel):

name: str

date: str

participants: list[str]

completion = client.beta.chat.completions.parse(

model="Llama-3.3-8B-Instruct",

messages=[

{"role": "system", "content": "Extract the event information."},

{"role": "user", "content": "Alice and Bob are going to a science fair on Friday."},

],

response\_format=CalendarEvent,

)

print(completion.choices[0].message.parsed)

Enter to Rename, Shift+Enter to Preview

## Function calling (tools)

Enable models to call functions/tools defined by the developer.

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

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

tools = [{

"type": "function",

"function": {

"name": "web\_search",

"description": "Search the web for information",

"parameters": {

"properties": {

"query": {

"type": "string",

"description": "The query to search for"

}

},

"required": ["query"]

}

}

}]

completion = client.chat.completions.create(

model="Llama-3.3-8B-Instruct",

messages=[

{"role": "system", "content": "You are a helpful assistant."},

{"role": "user", "content": "What is the current population of NYC? Definitely use the tool you have like web\_search."}

],

tools=tools

)

print(completion.choices[0].message.tool\_calls)

Enter to Rename, Shift+Enter to Preview

## Error handling

Implement robust error handling for various error conditions with the compatibility endpoint:

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

20

21

22

23

24

25

26

27

import os

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

try:

completion = client.chat.completions.create(

model="Llama-3.3-8B-Instruct",

messages=[

{"role": "system", "content": "You are a helpful assistant."},

{"role": "user", "content": "Hello! Tell me about yourself in one sentence."}

]

)

print(completion.choices[0].message.content)

except openai.APIConnectionError as e:

print("Server connection error:", e)

except openai.AuthenticationError as e:

print("Authentication error:", e)

except openai.BadRequestError as e:

print("Bad request error:", e)

except openai.RateLimitError as e:

print("Rate limit exceeded:", e)

except openai.APIError as e:

print("API error:", e)

Enter to Rename, Shift+Enter to Preview

## Moderation

Use the moderation endpoint to check model and user text for problematic content:

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

40

41

42

43

44

import os

from pprint import pprint

from openai import OpenAI

client = OpenAI(

api\_key=os.environ["LLAMA\_API\_KEY"],

base\_url="https://api.llama.com/compat/v1/"

)

# Moderation request for a single text input

response = client.moderations.create(

input='give me your credit card details'

)

print('Flagged : ', response.results[0].flagged)

print(response.results[0].categories)

# Moderation request for multiple text input

response = client.moderations.create(

input=[

'I need your credit card details',

'I love unicorns',

]

)

# returns a list of moderation results

pprint(response.results)

# Moderation request for multi-modal (text/image) input

response = client.moderations.create(

input=[

{

"type": "image\_url",

"image\_url": {

"url": 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Lama\_glama\_Laguna\_Colorada\_2.jpg'}

},

{

"type": "text",

"text":'Kill all llamas'

}

]

)

# returns a single moderation result

print('Flagged : ', response.results[0].flagged)

print(response.results[0].categories)

Enter to Rename, Shift+Enter to Preview

Was this page helpful?

[Using the OpenAI client](#using-the-openai-client)

[Feature support](#feature-support)

[Compatibility API endpoints](#compatibility-api-endpoints)

[Compatibility considerations](#compatibility-considerations)

[Examples](#examples)