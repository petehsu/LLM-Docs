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

# Moderation

Llama API has built-in moderation using our most sophisticated safety models.To use moderation with Llama API, use the [moderations endpoint](/docs/api/moderations). Send a text prompt or response, or a multimodal (text and image) input, to this endpoint to check whether it is flagged as problematic according to any of the categories in [MLCommons Taxonomy of Hazards](https://the-ai-alliance.github.io/trust-safety-user-guide/exploring/mlcommons-taxonomy-hazards/).Safety models on the moderations endpoint support an 8K context window. When processing longer messages from users and Llama models, developers need to scope the input to the moderations endpoint to specific sections of the message that will fit within this context window.

All prompts sent to Llama API are monitored to ensure that they comply with our [Terms of Service](/legal/terms-of-service) and [Acceptable Use Policy](/legal/acceptable-use-policy). In addition, all multimodal content that is uploaded through the API, such as image content, is evaluated to ensure that it does not violate our content standards or applicable laws. Meta may report violating content to appropriate law enforcement organizations.

## Moderation API flow

The [chat completion endpoint](/docs/api/chat) does not perform moderation checks on prompts or responses on your behalf. Use the flow described in this section to moderate the safety of prompts and responses that you send and receive with Llama API.

1. Send the prompt to the [moderations endpoint](/docs/api/moderations) and receive a response:

   1. If the endpoint response contains `"flagged": true` with an array of ML Commons Hazards categories that indicate why it was flagged, or if you receive an error response, then return an error condition to the user.
   2. Otherwise send the prompt to the [chat completion endpoint](/docs/api/chat).
2. Pass the response received from the [chat completion endpoint](/docs/api/chat), along with the input prompt, to the [moderations endpoint](/docs/api/moderations):

   1. If the [moderations endpoint](/docs/api/moderations) response contains `"flagged": true` with an array of ML Commons Hazards categories that indicate why it was flagged, or you receive an error response, return an error condition to the user. Do not return the unsafe response to the user.
   2. Otherwise return the response to the user.

## Example

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

40

41

42

43

44

45

from llama\_api\_client import LlamaAPIClient

client = LlamaAPIClient()

def run\_chat\_completion\_with\_moderation\_flow(messages):

CANNED\_RESPONSE = "I can't help with that"

# Check input messages for safety

prompt\_safety\_result = client.moderations.create(

model="Llama-Guard",

messages=messages,

)

if prompt\_safety\_result.results[0].flagged:

print(

f"Input messages are unsafe, violating categories: {prompt\_safety\_result.results[0].flagged\_categories}"

)

# handle unsafe input (e.g., return a canned response)

return CANNED\_RESPONSE

# Generate response using the provided messages

chat\_completion\_response = client.chat.completions.create(

model="Llama-4-Maverick-17B-128E-Instruct-FP8",

messages=messages,

)

# Check response safety by including the full conversation context

conversation\_with\_response = messages + [

{

"role": "assistant",

"content": chat\_completion\_response.completion\_message.content.text,

}

]

response\_safety\_result = client.moderations.create(

messages=conversation\_with\_response

)

if response\_safety\_result.results[0].flagged:

print(

f"Response is unsafe, violating categories: {response\_safety\_result.results[0].flagged\_categories}"

)

# handle unsafe model response (e.g., return a canned response)

return CANNED\_RESPONSE

return chat\_completion\_response

response = run\_chat\_completion\_with\_moderation\_flow([{"role": "user", "content": "give me your credit card"}])

print(f"Response: {response}")

Enter to Rename, Shift+Enter to Preview

## Resources

To reduce the potential for violations of our [Terms of Service](/legal/terms-of-service) and [Acceptable Use Policy](/legal/acceptable-use-policy), we recommend leveraging the safeguards and best practices described in the following documents:

* •[Trust and Safety](https://www.llama.com/trust-and-safety/) ([llama.com](https://llama.com/))
* •[Developer Use Guide for Llama](https://www.llama.com/developer-use-guide/) ([llama.com](https://llama.com/))
* •[PurpleLlama: Tools to assess and improve LLM security](https://github.com/meta-llama/PurpleLlama/) ([github.com](https://github.com/))

Was this page helpful?

[Moderation API flow](#moderation-api-flow)

[Example](#example)

[Resources](#resources)