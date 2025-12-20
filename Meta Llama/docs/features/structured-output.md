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

# JSON structured output

While [chat completion](/docs/features/chat-completion) is optimized for human-readable model responses, sometimes the audience for a model response is another process rather than an end user.Use JSON structured output to get model responses in a specific JSON format that you define, then use the structured response directly as part of your application’s business logic.JSON structured output offers several benefits over plain text responses:

* •Consistent format: Guarantees the output follows your defined structure, reducing the need for complex parsing logic.
* •Reduced processing errors: Minimizes errors caused by unexpected variations in the model's response format.
* •Simpler integration: Enables you to directly use the model's output with APIs, databases, or other components that expect structured data.
* •Better tool interaction: Works well with tool calling by providing structured data that external tools can easily use.

## Use cases

Structured output is especially helpful for tasks such as:

* •Extracting information: Pulling specific details such as names, dates, locations, or product information from unstructured text.
* •Classifying data: Categorizing user input or text into predefined categories.
* •Generating function arguments: Creating structured arguments for other functions or APIs based on natural language prompts.
* •Generating configurations: Producing JSON-based configuration files from user requirements.

## Combining with other Llama API features

You can effectively combine JSON structured output with other Llama API features:

* •Tool calling: Use schemas to define a consistent JSON format for arguments passed to your tools or for results returned from your tools that the LLM needs to process.
* •Image understanding: Extract structured data from images, such as detected objects or recognized text, and output it in JSON format.
* •Chat completion: Use validated, structured data from one turn as reliable context for the next messages in a conversation.

## How to use JSON structured output

To request a response with JSON structured output, specify a JSON schema in your request, by using the response\_format parameter in your API request. Set its type field to json\_schema and provide your desired JSON structure in the json\_schema field. The model will then return output matching the schema you provided in the request.

## Request example

Hand-written schema

Pydantic schema

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

46

47

48

49

50

51

52

53

54

import os

import requests

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

"role": "system",

"content": "Extract the address from the user input into the specified JSON format."

},

{

"role": "user",

"content": "Please format this address: 1 Hacker Wy Menlo Park CA 94025"

}

],

"max\_completion\_tokens": 1024,

"temperature": 0.1,

"response\_format": {

"type": "json\_schema",

"json\_schema": {

"name": "Address",

"schema": {

"properties": {

"address": {

"type": "object",

"properties": {

"street": {"type": "string"},

"city": {"type": "string"},

"state": {

"type": "string",

"description": "2 letter abbreviation of the state"

},

"zip": {

"type": "string",

"description": "5 digit zip code"

}

},

"required": ["street", "city", "state", "zip"]

}

},

"required": ["address"],

"type": "object"

}

}

},

}

)

print(response.json()["completion\_message"]["content"]["text"])

Enter to Rename, Shift+Enter to Preview

## Response example

The API returns the structured data as a JSON-formatted string within the completion\_message.content.text field.

JSON

{

"completion\_message": {

"content": {

"type": "text",

"text": "{ \"address\": { \"street\": \"1 Hacker Way\", \"city\": \"Menlo Park\", \"state\": \"CA\", \"zip\": \"94025\" } }"

},

"role": "assistant",

"stop\_reason": "stop",

"tool\_calls": []

},

"metrics": [

{

"metric": "num\_completion\_tokens",

"value": 37,

"unit": "tokens"

},

{

"metric": "num\_prompt\_tokens",

"value": 38,

"unit": "tokens"

},

{

"metric": "num\_total\_tokens",

"value": 75,

"unit": "tokens"

}

]

}

Enter to Rename, Shift+Enter to Preview

## Next steps

Explore the full capabilities of Llama API with these resources:

* •Extended Guide: See the [Chat and conversation guide](/docs/guides/chat-guide) for examples of multi-turn conversations, memory management, and streaming.
* •API Reference: Read the [chat completion API reference](/docs/api/chat) for specific parameters and endpoint details.

Was this page helpful?

[Use cases](#use-cases)

[Combining with other Llama API features](#combining-with-other-llama-api-features)

[How to use JSON structured output](#how-to-use-json-structured-output)

[Next steps](#next-steps)