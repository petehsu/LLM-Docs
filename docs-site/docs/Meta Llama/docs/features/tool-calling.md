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

# Tool calling

You can use tool calling with Llama API to interface with external tools that you provide. Tool calling enables you to:

* •Gather new information that is not readily available to the model
* •Take actions such as sending emails or calling other APIs

## How it works

When you enable tool calling with Llama API, the model automatically decides if it needs one or more of the available tools to respond to your prompt. If so, the model will tell you which tools it would like to use and how. Then you will execute the tool and send back the results so that the model can incorporate the information into its next response.

## Use cases

Tool calling can be used for a number of different use cases such as finding information and performing actions. Tool calling expands the capabilities of Llama by allowing it to interact with outside systems.

## Finding information

Tool calling lets the model access knowledge not included in its training data. Here are some cases where tool calling could help retrieve external information:

* •Fetching real-time data: Your request may require access to frequently updated information, such as sports scores or news headlines, weather data when planning a beach trip, or the latest stock values for financial analysis.
* •Performing calculations: While language models excel at reasoning, they typically don't perform well with raw arithmetic or complex calculations. Like a human, an AI model can use a basic calculator for math involving large numbers. For specialized calculations such as tax accounting or internal projections, create a custom tool for Llama.
* •Search the web: Use a search engine to collect additional information. This provides a general solution for fetching real-time data when you don't want to create a specific tool for each information source.
* •Access databases: Access your own private databases to help answer questions about your business or customers. Include up-to-date pricing information or availability.

## Performing actions

Beyond finding information, you can use tools to take actions on your behalf. Multi-turn actions enable Llama to become a true AI agent, taking actions and reasoning about results to determine next steps and potentially the next tool. While the options for tools are endless, common use cases include:

* •Sending messages: Enable Llama to send emails or chat messages proactively
* •Triggering jobs: Start long-running jobs or workflows to run in the background
* •Calling other APIs: Make API calls to external services outside of the model

## How to use tool calling

You can provide the model tools to use by providing a list of tool definitions in a chat completion request. See below for an example.

## Request

curl request

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

curl "https://api.llama.com/v1/chat/completions" \

-H "Content-Type: application/json" \

-H "Authorization: Bearer $LLAMA\_API\_KEY" \

-d '{

"messages": [

{"role": "user", "content": "What is the weather in Menlo Park?"},

],

"model": "Llama-3.3-70B-Instruct",

"tools": [

{

"type": "function",

"function": {

"name": "get\_weather",

"description": "Retrieve the current temperature for a specified location",

"parameters": {

"type": "object",

"properties": {

"location": {

"type": "string",

"description": "The city, state, or country for which to fetch the temperature"

}

},

"required": [

"location"

],

"additionalProperties": false

},

"strict": true

}

}

]

}'

Enter to Rename, Shift+Enter to Preview

## Response

JSON response

{

"completion\_message": {

"content": {

"type": "text",

"text": ""

},

"role": "assistant",

"stop\_reason": "tool\_calls",

"tool\_calls": [

{

"id": "466d49b7-8641-43bd-844e-ecac6a818974",

"function": {

"name": "get\_weather",

"arguments": "{\"location\":\"Menlo Park\"}"

}

}

]

}

}

Enter to Rename, Shift+Enter to Preview

## Next steps

Explore the full capabilities of Llama API with these resources:

* •Tool calling guide: Learn more about how and when to use tool calling in the [tool calling guide](/docs/guides/tool-guide)
* •API reference: Read the [chat completion API reference](/docs/api/chat) for specific parameters and endpoint details.

Was this page helpful?

[How it works](#how-it-works)

[Use cases](#use-cases)

[How to use tool calling](#how-to-use-tool-calling)

[Next steps](#next-steps)