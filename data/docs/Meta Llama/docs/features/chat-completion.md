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

# Chat completion with Llama API

Chat completion lets developers create text based on a given prompt or conversation history. This feature uses a Llama model to predict the next word or sequence of words in a conversation, allowing developers to create AI models that can respond to user input in a natural and intuitive way.

## How it works

Chat completion enables models to process a sequence of messages with different roles and generate appropriate responses. Llama API supports three distinct roles in conversations:

* •System messages: Define overall behavior instructions for the model.
* •User messages: Represent inputs from your application's users.
* •Assistant messages: Contain previous responses from the model.

Structuring a conversation into these roles allows developers to provide the model with context across multiple interactions, ensuring coherent, contextually relevant responses.

## Use cases

Use chat completion to build sophisticated conversational experiences, such as:

* •Customer Support: Create intelligent assistants that can handle inquiries and resolve issues.
* •Content Creation: Generate ideas, outlines, and drafts through interactive dialogue.
* •Education: Build tutoring systems that adapt explanations based on student questions.
* •Information Retrieval: Develop question-answering systems that provide concise, relevant information.

## Getting started: A simple example

You can create a basic conversation with Llama API using a standard HTTP request.Here's how to implement a simple chat using cURL:

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

curl "https://api.llama.com/v1/chat/completions" \

-H "Authorization: Bearer $LLAMA\_API\_KEY" \

-H "Content-Type: application/json" \

-d '{

"model": "Llama-4-Maverick-17B-128E-Instruct-FP8",

"messages": [

{

"role": "system",

"content": "You are a helpful assistant that provides concise answers."

},

{

"role": "user",

"content": "What is the capital of France?"

}

],

"max\_tokens": 256

}'

Enter to Rename, Shift+Enter to Preview

## Next steps

Explore the full capabilities of Llama API with these resources:

* •Extended Guide: See the [Chat and conversation guide](/docs/guides/chat-guide) for examples of multi-turn conversations, memory management, and streaming.
* •API Reference: Read the [chat completion API reference](/docs/api/chat) for specific parameters and endpoint details.

Was this page helpful?

[How it works](#how-it-works)

[Use cases](#use-cases)

[Getting started: A simple example](#)

[Next steps](#next-steps)