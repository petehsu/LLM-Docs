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

# Llama API quickstart

Llama API makes it easy to integrate Llama models in your application. This quickstart guide teaches you the basics of the API and helps you to make your first API request in just a couple of minutes.

## What you need

Before you begin, make sure you have a Llama API developer account. Sign up at [llama.developer.meta.com](https://llama.developer.meta.com) if you don’t have an account.You will also need a way to make API calls from your computer. The examples below use `curl`, but you can use a tool like [Postman](https://www.postman.com/) or [Bruno](https://www.usebruno.com/) if you prefer.

## Create an API key

To use Llama API you need an API key. The API key represents your permission to access the API on behalf of your team, and is needed for all API calls.In the [API platform dashboard](https://llama.developer.meta.com/), navigate to the API keys tab and click Create API key. Give your key a memorable name, click Create, then copy the key when it is shown. In production code, you should store the key somewhere secure, but for now keep it on your clipboard; you will use it soon.

Learn more about API keys in the [API keys guide](/docs/api-keys).

## Try Llama in the Playground

With your API key created, you can now try Llama models in the API playground.On the API platform dashboard, go to the Chat completion tab under Playground and select your key. Here you can configure system instructions and some model settings, but we can start with a simple question.In the Ask Llama… box, type a question like *“What is a Llama?”* and press Enter. The model will quickly respond to your request, showing your question as “User” and the response as the name of the Llama model that’s being used to make the response.The playground lets you test different user and system prompts and verify the model’s responses. The playground uses Llama API with the API key you created above, so you can move on to making API calls directly.

## Your first API call

Now that you have tried using Llama models in the playground, you can start making API calls directly. You can use an SDK for languages like Python or JavaScript to call the API endpoints, but this simple example uses `curl`.

## Set your API key

Store the API key you created earlier as an environment variable, using the correct method for your operating system.

macOS or Linux

1

export LLAMA\_API\_KEY='your\_api\_key\_here'

Enter to Rename, Shift+Enter to Preview

Windows

1

set LLAMA\_API\_KEY='your\_api\_key\_here'

Enter to Rename, Shift+Enter to Preview

## Call the API

Use curl to make a simple request to Llama API, asking it to respond to a "Hello, world!" prompt.Open your terminal and run the following command:

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

curl -X POST "https://api.llama.com/v1/chat/completions" \

-H "Authorization: Bearer $LLAMA\_API\_KEY" \

-H "Content-Type: application/json" \

-d '{

"model": "Llama-4-Maverick-17B-128E-Instruct-FP8",

"messages": [

{

"role": "system",

"content": "You are a friendly assistant."

},

{

"role": "user",

"content": "Hello, world!"

}

]

}'

Enter to Rename, Shift+Enter to Preview

Windows users should use `%LLAMA_API_KEY%` instead of `$LLAMA_API_KEY` in the command above.

If everything is set up correctly, you should see a JSON response similar to:

JSON response

{

"completion\_message": {

"content": {

"type": "text",

"text": "Hello! It's nice to meet you. Is there something I can help you with, or would you like to chat?"

},

"role": "assistant",

"stop\_reason": "stop",

"tool\_calls": []

},

"metrics": [

{

"metric": "num\_completion\_tokens",

"value": 25,

"unit": "tokens"

},

{

"metric": "num\_prompt\_tokens",

"value": 25,

"unit": "tokens"

},

{

"metric": "num\_total\_tokens",

"value": 50,

"unit": "tokens"

}

]

}

Enter to Rename, Shift+Enter to Preview

## Understanding the command

Let’s look more closely at this API call:

* •Firstly, notice the URL: `https://api.llama.com/v1/chat/completions`. This is the [Chat completion endpoint](/docs/api/chat), which generates text based on a set of prompt messages.
* •Next, you will notice that you declared the content type as `application/json` via the `Content-Type header`. The API expects to receive a JSON payload as part of the call.
* •For authentication, you passed the API key you created and added to the `LLAMA_API_KEY` environment variable as a bearer token using the `Authorization` header.
* •Finally you passed a JSON payload comprising a `model` and an array containing messages of type `system` and `user` using the `-d` flag, which adds it to the body of the `POST` request.

The API has responded with a JSON object containing the assistant's response in the `completion_message.content.text` field, and a stop reason of `”stop”`, which indicates that it has finished replying to your message.

## Next Steps

Now that you have made your first API call, here are some resources to explore in more detail:

* •Discover and install [SDKs for Llama API](/docs/sdks).
* •Visit the [Chat and conversation](/docs/guides/chat-guide) guide for end-to-end implementation tutorials.
* •Refer to the [Chat completion API reference docs](/docs/api/chat) for detailed information on endpoints, parameters, and advanced configurations.
* •Check out the [Llama Cookbook GitHub repo](https://github.com/meta-llama/llama-cookbook) for sample projects and use cases.

Was this page helpful?

[What you need](#what-you-need)

[Create an API key](#create-an-api-key)

[Try Llama in the Playground](#try-llama-in-the-playground)

[Your first API call](#your-first-api-call)

[Set your API key](#set-your-api-key)

[Call the API](#call-the-api)

[Understanding the command](#understanding-the-command)

[Next Steps](#next-steps)