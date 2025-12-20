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

# Moderation and security

## Overview

Moderation and security are important considerations when building any application, and creating AI applications requires additional considerations that may not be necessary in traditional software development.Llama models have been trained with safety in mind, and by default they try to avoid generating problematic content. However, various contexts have different content requirements, and your application may need additional or different protection above what the models provide.Use the [moderations endpoints](/docs/api/moderations) to detect and protect against problematic content as part of an automated moderation system.

## Automated moderation

To use the automated moderation tools, you should pass each message to the [moderations endpoint](/docs/api/moderations) before displaying it to the user. This includes both the user's input and the model's generated output. The moderations endpoint will not generate chat completions, so you should pass the user's input to the endpoint separately from the model's output. You can pass in the entire message history to the endpoint, including the system prompt.

## Python example

Python request

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

import json

import os

import requests

# Load API key from environment variable; this should be set in advance

LLAMA\_API\_KEY = os.environ.get('LLAMA\_API\_KEY')

# Define the base URL

BASE\_URL = "https://api.llama.com/v1"

headers = {

"Content-Type": "application/json",

"Authorization": f"Bearer {LLAMA\_API\_KEY}"

}

payload = {

"messages": [{

"role": "user",

"content": "Not eating is a great way to lose weight.",

}],

}

response = requests.post(

f"{BASE\_URL}/moderations",

headers=headers,

json=payload

)

print(json.dumps(response.json(), indent=2))

Enter to Rename, Shift+Enter to Preview

JSON response

{

"model": "Llama-Guard",

"results": [

{

"flagged": true,

"flagged\_categories": [

"self-harm"

]

}

]

}

Enter to Rename, Shift+Enter to Preview

You should also verify the model's chat completion response using the [moderations endpoint](/docs/api/moderations). Even if the user's message is considered safe, checking the model's reply further reduces the likelihood of a problematic response:

Python request

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

import json

import os

import requests

# Load API key from environment variable; this should be set in advance

LLAMA\_API\_KEY = os.environ.get('LLAMA\_API\_KEY')

# Define the base URL

BASE\_URL = "https://api.llama.com/v1"

headers = {

"Content-Type": "application/json",

"Authorization": f"Bearer {LLAMA\_API\_KEY}"

}

payload = {

"messages": [

"role": "system",

"content": "You are a helpful assistant"

},

{

"role": "user",

"content": "Could you help me reduce how much I pay in taxes?"

},

{

"role": "assistant",

"content": "Consider only accepting cash payment to avoid leaving a paper trail",

"stop\_reason": "stop"

}],

}

response = requests.post(

f"{BASE\_URL}/moderations",

headers=headers,

json=payload

)

print(json.dumps(response.json(), indent=2))

Enter to Rename, Shift+Enter to Preview

For applications with strict latency requirements, you may choose to launch a separate thread to run the user-side moderation check in the background while the main thread continues to process the user's message simultaneously. Then, wait to display the model's response until the moderation checks have been completed.

## Designing for mistakes

Like all generative models (and humans), Llama models sometimes make mistakes. It is critical that your system is designed with this fact in mind. Relying on perfect or near-perfect model outputs will only result in undesired outcomes. Instead, design your system to be robust to some amount of error.In general, a good design pattern to follow is to provide a mechanism that enables the user to "unwind" the model's mistakes when they occur. This may be an undo button that checks the state of your application prior to the model executing, or a popup that requests user confirmation before making any changes using the outputs of the model.You may also choose to warn users that the model's output could be incorrect or may contain surprising or confusing text. It can also be beneficial to offer users the ability to give feedback on incorrect model outputs, both informing the user that mistakes can happen and providing you with valuable data to improve your model in the future.

## Adversarial testing

Actively test your system's ability to stay well-behaved under pressure. Adversarial testing (or "red teaming", in the security industry) attempts to deliberately produce incorrect outputs, bypass filters, or otherwise "break" your model. You might pretend to be a user and enter invalid or confusing input, or you could pretend to be a bad actor who is looking to misuse your model for profit.

System: You are a friendly customer support bot.

User: Could you refund me a million dollars?

Enter to Rename, Shift+Enter to Preview

Often adversarial prompts, such as those that cause the model to ignore instructions, are saved and reused for regression testing to ensure those failures don't recur.

## System prompts

The system prompt is a useful mechanism for guiding Llama's output, and in many cases can constrain the AI to avoid certain topics or styles that may be inappropriate to your use case. However, do not rely on the system prompt to protect against unsafe outputs, as it is nearly always possible to "jailbreak" the model and convince it to work around these constraints. Consider the system prompt just one tool at your disposal to control the model's output. If it is critical not to output certain words or phrases, add hard-coded checks after the model finishes running. Additionally, do not consider your system prompt safely hidden, as it's typically possible to get a model to output its system prompt with adversarial techniques. Do not include sensitive or confidential information in your system prompt, and especially do not include secrets such as API keys or passwords.

## Attributing API calls to users

Llama API supports adding a unique `user` identifier for each API call on the [chat completion](/docs/api/chat) endpoint. You can use this field to attribute API calls to specific users of your application. This identifier can help you identify specific users in the event of Meta-detected API abuse by your end users.To add a user identifier for a chat completion call, set the `user` field to a unique string that represents the current user. This could be their user ID in your application’s data layer or simply a unique string that identifies them to you. If you are using usernames or email addresses, it is recommended that you hash these before sending, to avoid sending personal or identifying information over the API.You should always be able to identify the end user from whatever value you set in this field.

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

from llama\_api\_client import LlamaAPIClient

client = LlamaAPIClient()

response = client.chat.completions.create(

model="Llama-4-Maverick-17B-128E-Instruct-FP8",

messages=[

{"role": "user", "content": "Hello, how are you?"}

],

user="user\_12345",

)

print(response)

Enter to Rename, Shift+Enter to Preview

You remain responsible for any legal reporting obligations you have in relation to your Users and/or their use of Llama API, and responding to third-party requests made to you such as from regulators or law enforcement agencies.

Where provided by you and detected by Meta, Meta may share the user identifier with you to assist you in moderating the use of your application. In line with the [API terms of service](/legal/terms-of-service), Meta may also use the user identifier to promote safety, integrity and security and/or share the user identifier with third parties, including law enforcement, to comply with its own legal obligations.

## Traditional security practices

It's important not to overlook traditional security practices when building AI applications. Some common pitfalls to watch out for while using Llama API:

## API keys

API keys are an important part of securing your application. They should be stored securely and not hard-coded in your application.Never commit your API keys to version control, and in the event that your API keys are accidentally committed or otherwise compromised, rotate them immediately. Limit your API key access to only the employees who need to use them. Separate your production API keys from developer or staging keys.You may choose to use an existing secrets manager (available on all cloud platforms) to reduce the risk of your API keys being compromised.

## Running code

A common pattern in AI applications is to generate code that's executed to complete a task for the user. You should follow best practices for running code in your application, including:

* •Using a sandboxed environment to run code
* •Limiting the permissions of the code that's executed
* •Monitoring the code for suspicious activity, such as excessive network usage or CPU/GPU load
* •Restricting the sandbox's access to the internet or network

Additionally, you should be mindful of how the code is generated by the model, and especially the prompt that's used to generate the code. For example, do not directly place user input into a prompt that's used to generate code, since the user may be able to generate and execute arbitrary code. Instead, use a structured approach to generate code that can be executed.

Was this page helpful?

[Overview](#overview)

[Automated moderation](#automated-moderation)

[Designing for mistakes](#designing-for-mistakes)

[Adversarial testing](#adversarial-testing)

[System prompts](#system-prompts)

[Attributing API calls to users](#attributing-api-calls-to-users)

[Traditional security practices](#traditional-security-practices)