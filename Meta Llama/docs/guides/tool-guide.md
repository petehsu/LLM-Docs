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

# Tool calling with Llama API

## Introduction

You can use tool calling to interface Llama API with external tools that you provide. Tool calling enables you to expand the capabilities of a Llama model in order to gather new information that is not readily available to the model, or to take actions such as sending emails or calling other APIs.When you enable tool calling via the API, the model automatically decides if it needs one or more of the available tools to respond to your prompt, and if so will tell you which tools it would like to use and how. You will then execute the tool and send back the results as part of a chat completion, so that the model can incorporate the information into its next response.

## When to use tool calling

Tool calling can be used for a number of different purposes, which can broadly be grouped as finding information and performing actions.

## Finding information

Tool calling enables access to knowledge not included in the model’s training data. Below are some cases where tool calling could help retrieve external information.

* •Fetching real-time data: Your request may require access to frequently updated information, such as sports scores or news headlines, weather data when planning a beach trip, or the latest stock values for financial analysis.
* •Performing calculations: While language models excel at reasoning, they typically don't perform well with raw arithmetic or complex calculations. Like a human, an AI model can use a basic calculator for math involving large numbers. For specialized calculations such as tax accounting or internal projections, create a custom tool for Llama.
* •Search the web: Use a search engine to collect additional information. This provides a general solution for fetching real-time data when you don't want to create a specific tool for each information source.
* •Access databases: Access your own private databases to help answer questions about your business or customers. Include up-to-date pricing information or availability.

## Performing actions

Beyond finding information, you can use tools to take actions on your behalf. Multi-turn actions enable Llama to become a true AI agent, taking actions and reasoning about results to determine next steps and potentially the next tool.While the use-cases for tools are endless, here are some common scenarios:

* •Sending messages: Enable Llama to send emails or chat messages proactively
* •Triggering jobs: Start long-running jobs or workflows to run in the background
* •Calling other APIs: Make API calls to external services outside of the model

## How to use tool calling

## Prerequisites

Before you begin, ensure you have:

* •A valid Llama API key
* •Python 3.7 or higher

## Setting up your environment

To use tool calling with Llama API, you'll need to set up authentication using your Llama API key, which you’ll store in an environment variable for now.Here's how to set up your Python environment for making API calls:

Python

1

2

3

4

import json

import os

os.environ["LLAMA\_API\_KEY"] = 'your\_api\_key\_here'

Enter to Rename, Shift+Enter to Preview

## Creating a tool definition

The `tool` (singular) role is a special role that indicates to the model that the results come from an external tool. When the model uses a tool, it includes a `tools` (plural) field in the response. After you execute the tool call, return the results to the model using the `tool` role.To instruct a Llama model on how to use a tool, create a tool definition that includes:

* •The tool’s name
* •A description of what the tool does
* •The parameters that the tool accepts

The chat completion API accepts a `tools` parameter, which is an array of tool definitions. This is separate from the `messages` parameter, which contains the conversation history. It is not necessary to include tool information in the system prompt, or even request that the model use tools at all. If tools are included, the model will by default use them if it decides they are necessary.

Python (Llama API client)

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

from llama\_api\_client import LlamaAPIClient

get\_weather\_tool = {

"type": "function",

"function": {

"name": "get\_weather",

"description": "Retrieve the current temperature for a specified location",

"parameters": {

"properties": {

"location": {

"type": "string",

"description": "The city, state, or country for which to fetch the temperature"

}

},

"required": ["location"]

}

}

}

client = LlamaAPIClient()

tool\_call\_completion = client.chat.completions.create(

model="Llama-4-Maverick-17B-128E-Instruct-FP8",

messages=[

{

"role": "user",

"content": "What is the weather in Menlo Park?",

}

],

tools=[get\_weather\_tool],

)

print(tool\_call\_completion.completion\_message.to\_json())

Enter to Rename, Shift+Enter to Preview

The model will use the provided tool definition to infer whether a tool should be invoked, then respond with a message indicating which tool it wants to use.

Completion message (JSON)

{

"role": "assistant",

"stop\_reason": "tool\_calls",

"tool\_calls": [

{

"id": "85870f14-0c26-46e4-9b68-a783ee865bbd",

"function": {

"arguments": "{\"location\":\"Menlo Park\"}",

"name": "get\_weather"

}

}

]

}

Enter to Rename, Shift+Enter to Preview

## Invoking your tool

Llama API does not have access to any execution environment, and in many cases will not have access to the tool you have defined. Hence your application must execute the tool call generated by the model and return the results.Return the results to the model using the `tool` role, as shown below.

Python (Llama API client)

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

get\_weather\_tool\_call = {

"id": tool\_call\_completion.completion\_message.tool\_calls[0].id,

"function": {

"name": tool\_call\_completion.completion\_message.tool\_calls[0].function.name,

"arguments": tool\_call\_completion.completion\_message.tool\_calls[0].function.arguments,

}

}

get\_weather\_tool\_call\_result = {

"Menlo Park": "47f"

}

tool\_call\_result\_completion = client.chat.completions.create(

model="Llama-4-Maverick-17B-128E-Instruct-FP8",

messages=[

{

"role": "user",

"content": "What is the weather in Menlo Park?",

},

{

"role": "assistant",

"stop\_reason": "tool\_calls",

"tool\_calls": [ get\_weather\_tool\_call ]

},

{

"role": "tool",

"tool\_call\_id": get\_weather\_tool\_call["id"],

"content": json.dumps(get\_weather\_tool\_call\_result)

}

],

tools=[get\_weather\_tool],

)

print(tool\_call\_result\_completion.completion\_message.to\_json())

Enter to Rename, Shift+Enter to Preview

Consider using [llama-stack-apps](https://github.com/meta-llama/llama-stack-apps) or another similar application to execute the tool call and retrieve the results.

Finally, the model uses the results to return an answer to the original user question.

Completion message (JSON)

{

"role": "assistant",

"content": {

"text": "The current temperature in Menlo Park is 47°F.",

"type": "text"

},

"stop\_reason": "stop"

}

Enter to Rename, Shift+Enter to Preview

## Testing & debugging

Because tool calls are executed outside of the model, you need to test and debug them separately. However, since there is no requirement to actually call the function, for testing purposes you can return a mock response with the output you expect from your tool. This means you can easily experiment with different tools before they are actually built, allowing you to iterate on your tool definitions and optimize your prompts prior to committing to development.Sometimes, the model may not call the tool even if it is available. This is because the model may not believe that the tool is the best option for the user's request.To help the model call the right tool, you can try the following:

* •Provide some examples of how the tool should be used in the system prompt
* •Modify the tool definition to include more specific instructions or examples
* •If you know the tool should be used, you can directly ask the model to use the tool in the prompt

## Example tools

Tool definitions are entirely up to you, and can be as specific or broad as you would like. Tools often correspond to a specific web API or service, but could also be used to call a library function or perform a calculation. Here are some examples of tools you might use with Llama.

## Search the web

JSON

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

{

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

}

Enter to Rename, Shift+Enter to Preview

## Use Wolfram Alpha as a calculator

JSON

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

{

"type": "function",

"function": {

"name": "calculate",

"description": "Complete mathematical calculations using Wolfram Alpha",

"properties": {

"expression": {

"type": "string",

"description": "The mathematical expression to evaluate"

}

},

"required": ["expression"]

}

}

Enter to Rename, Shift+Enter to Preview

Was this page helpful?

[Introduction](#introduction)

[When to use tool calling](#when-to-use-tool-calling)

[How to use tool calling](#how-to-use-tool-calling)

[Testing & debugging](#testing-&-debugging)

[Example tools](#example-tools)