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

# Image understanding

Llama models offer native support for understanding and interpreting of visual content alongside text. This multimodal capability opens up new possibilities for interacting with images, extracting information, and automating visual tasks.

## How it works

Image understanding allows Llama API to process model requests that include both text prompts and images. The model can analyze image content and perform tasks such as:

* •Describing scenes: Generate detailed descriptions of what's happening in an image.
* •Answering questions: Respond to specific queries about the objects, people, or actions within an image.
* •Extracting information: Pull text, data, or key elements from images like charts, diagrams, or documents.
* •Analyzing content: Identify objects, understand relationships, and categorize visual information.

## Benefits and use cases

Integrating image understanding enables you to build richer, more intuitive applications:

* •Enhance Accessibility: Automatically generate descriptions for images, making visual content accessible to users with visual impairments.
* •Automate Content Moderation: Identify potentially sensitive or inappropriate content in uploaded images.
* •Improve E-commerce: Analyze product photos, categorize items, or enable visual search.
* •Streamline Data Analysis: Interpret charts, graphs, and infographics presented as images.
* •Process Documents: Extract key information from scanned documents, receipts, or forms.

## How to use

You can send an image and a text prompt to the Llama API using the [chat completions endpoint](/docs/api/chat) This endpoint supports both public URLs and base64-encoded images.

Image understanding from public URL

Image understanding with base64 encoding

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

## Considerations

## Supported image formats

See below for supported formats and size limits when using images with Llama API.

* •Max file size per image: 25MB
* •Max number of images per request: 9
* •Supported MIME types:`image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/x-icon`

## Estimating image token count

Images contribute to the total context window. Estimating the token count for an image or set of images can be done using the calculations described below.

This calculation method is useful for estimating a coarse token count, but the final token count for a prompt may be slightly higher than this estimate.

Before sending image data to Llama models, images are divided into tiles of 336x336 pixels. Each tile uses 145 tokens, plus 2 extra tokens to demarcate the image tile.

* •For single images smaller than 336x336 pixels, this means the image will be represented in 147 tokens.
* •For images larger than 336x336 pixels, the token count will be 145 tokens per 336x336 pixel tile, plus 2 tokens to demarcate the image, plus an additional 147 tokens for a scaled-down version of the image.
* •Image tiles will be padded with blank image data to fill 336x336 pixels.

For example, the token count for a 900x900 pixel image can be estimated as follows:

* •900 % 336 rounds up to 3, resulting in 9 total image tiles, plus 1 for the scaled down image
* •(9 x 145) + 2 + (1 x 145) + 2 = 1454 tokens

## Next steps

Explore the full capabilities of Llama API with these resources:

* •API Reference: Read the [chat completion API Reference](/docs/api/chat) documentation for specific parameters and endpoint details.

Was this page helpful?

[How it works](#how-it-works)

[Benefits and use cases](#benefits-and-use-cases)

[How to use](#how-to-use)

[Considerations](#considerations)

[Next steps](#next-steps)