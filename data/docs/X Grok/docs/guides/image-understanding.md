#### Guides

# Image Understanding

The vision model can receive both text and image inputs. You can pass images into the model in one of two ways: base64 encoded strings or web URLs.

Under the hood, image understanding shares the same API route and the same message body schema consisted of `system`/`user`/`assistant` messages. The difference is having image in the message content body instead of text.

As the knowledge in this guide is built upon understanding of the chat capability. It is suggested that you familiarize yourself with the [chat](chat) capability before following this guide.

## Prerequisites

* xAI Account: You need an xAI account to access the API.
* API Key: Ensure that your API key has access to the vision endpoint and a model supporting image input is enabled.

If you don't have these and are unsure of how to create one, follow [the Hitchhiker's Guide to Grok](../tutorial).

Set your API key in your environment:

```bash
export XAI_API_KEY="your_api_key"
```

## Reminder on image understanding model general limitations

It might be easier to run into model limit with these models than chat models:

* Maximum image size: `20MiB`
* Maximum number of images: No limit
* Supported image file types: `jpg/jpeg` or `png`.
* Any image/text input order is accepted (e.g. text prompt can precede image prompt)

## Constructing the Message Body - Difference from Chat

The request message to image understanding is similar to chat. The main difference is that instead of text input:

```json
[
  {
    "role": "user",
    "content": "What is in this image ?"
  }
]
```

We send in `content` as a list of objects:

```json
[
  {
    "role": "user",
    "content": [
      {
        "type": "image_url",
        "image_url": {
          "url": "data:image/jpeg;base64,<base64_image_string>",
          "detail": "high"
        }
      },
      {
        "type": "text",
        "text": "What is in this image?"
      }
    ]
  }
]
```

The `image_url.url` can also be the image's url on the Internet.

You can use the text prompt to ask questions about the image(s), or discuss topics with the image as context to the discussion, etc.

## Image Detail Levels

The `"detail"` field controls the level of pre-processing applied to the image that will be provided to the model. It is optional and determines the resolution at which the image is processed. The possible values for `"detail"` are:

* **`"auto"`**: The system will automatically determine the image resolution to use. This is the default setting, balancing speed and detail based on the model's assessment.
* **`"low"`**: The system will process a low-resolution version of the image. This option is faster and consumes fewer tokens, making it more cost-effective, though it may miss finer details.
* **`"high"`**: The system will process a high-resolution version of the image. This option is slower and more expensive in terms of token usage, but it allows the model to attend to more nuanced details in the image.

## Web URL input

The model supports web URL as inputs for images. The API will fetch the image from the public URL and handle it as part of the chat. Integrating with URLs is as simple as:

```pythonXAI
import os

from xai_sdk import Client
from xai_sdk.chat import user, image

client = Client(api_key=os.getenv('XAI_API_KEY'))

image_url = "https://science.nasa.gov/wp-content/uploads/2023/09/web-first-images-release.png"

chat = client.chat.create(model="grok-4")
chat.append(
    user(
        "What's in this image?",
        image(image_url=image_url, detail="high"),
    )
)

response = chat.sample()
print(response.content)
```

```pythonOpenAISDK
import os
from openai import OpenAI

XAI_API_KEY = os.getenv("XAI_API_KEY")
image_url = (
"https://science.nasa.gov/wp-content/uploads/2023/09/web-first-images-release.png"
)

client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1",
)

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": image_url,
                    "detail": "high",
                },
            },
            {
                "type": "text",
                "text": "What's in this image?",
            },
        ],
    },
]

completion = client.chat.completions.create(
    model="grok-4",
    messages=messages,
)

print(completion.choices[0].message.content)
```

```javascriptOpenAISDK
import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
});
const image_url =
"https://science.nasa.gov/wp-content/uploads/2023/09/web-first-images-release.png";

const completion = await openai.chat.completions.create({
    model: "grok-4",
    messages: [
        {
            role: "user",
            content: [
                {
                    type: "image_url",
                    image_url: {
                        url: image_url,
                        detail: "high",
                    },
                },
                {
                    type: "text",
                    text: "What's in this image?",
                },
            ],
        },
    ],
});

console.log(completion.choices[0].message.content);
```

```javascriptAISDK
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';

const result = await generateText({
  model: "grok-4",
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          image: new URL(
            'https://science.nasa.gov/wp-content/uploads/2023/09/web-first-images-release.png',
          ),
        },
        {
          type: 'text',
          text: "What's in this image?",
        },
      ],
    },
  ],
});

console.log(result.text);
```

## Base64 string input

You will need to pass in base64 encoded image directly in the request, in the user messages.

Here is an example of how you can load a local image, encode it in Base64 and use it as part of your conversation:

```pythonXAI
import os
import base64

from xai_sdk import Client
from xai_sdk.chat import user, image

client = Client(api_key=os.getenv('XAI_API_KEY'))
image_path = "..."

chat = client.chat.create(model="grok-4")

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    return encoded_string

# Getting the base64 string

base64_image = encode_image(image_path)

# assumes jpeg image, update image format in the url accordingly

chat.append(
    user(
        "What's in this image?",
        image(image_url=f"data:image/jpeg;base64,{base64_image}", detail="high"),
    )
)

response = chat.sample()
print(response.content)
```

```pythonOpenAISDK
import os
from openai import OpenAI
import base64

XAI_API_KEY = os.getenv("XAI_API_KEY")
image_path = "..."

client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1",
)

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode("utf-8")
    return encoded_string

# Getting the base64 string

base64_image = encode_image(image_path)

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image}",
                    "detail": "high",
                },
            },
            {
                "type": "text",
                "text": "What's in this image?",
            },
        ],
    },
]

completion = client.chat.completions.create(
    model="grok-4",
    messages=messages,
)

print(completion.choices[0].message.content)
```

```javascriptOpenAISDK
import { promises as fs } from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: "https://api.x.ai/v1",
});
const image_path =
"...";

async function getBase64(filePath) {
try {
        const buffer = await fs.readFile(filePath);
        let base64 = buffer.toString("base64");
        while (base64.length % 4 > 0) {
            base64 += "=";
        }
        return base64;
    } catch (error) {
        throw error;
    }
}

const base64_image = await getBase64(image_path);

const completion = await openai.chat.completions.create({
    model: "grok-4",
    messages: [
        {
            role: "user",
            content: [
                {
                    type: "image_url",
                    image_url: {
                        url: \`data:image/jpeg;base64,$\{base64_image\}\`,
                        detail: "high",
                    },
                },
                {
                    type: "text",
                    text: "What's in this image?",
                },
            ],
        },
    ],
});

console.log(completion.choices[0].message.content);
```

```javascriptAISDK
import { xai } from '@ai-sdk/xai';
import { generateText } from 'ai';
import fs from 'fs';

const result = await generateText({
  model: xai('grok-4'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        { type: 'image', image: fs.readFileSync('./data/comic-cat.png') },
      ],
    },
  ],
});

console.log(result.text);
```

## Multiple images input

You can send multiple images in the prompt, for example:

```pythonXAI
chat.append(
    user(
        "What are in these images?",
        image(image_url=f"data:image/jpeg;base64,{base64_image1}", detail="high"),
        image(image_url=f"data:image/jpeg;base64,{base64_image2}", detail="high")
    )
)
```

```pythonOpenAISDK
messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image1}",
                    "detail": "high"
                }
            },
            {
                "type": "text",
                "text": "What are in these images?"
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image2}",
                    "detail": "high",
                }
            }
        ],
    },
]
```

```javascriptOpenAISDK
messages: [
        {
            role: "user",
            content: [
                {
                    type: "image_url",
                    image_url: {
                        url: \`data:image/jpeg;base64,$\{base64_image1\}\`,
                        detail: "high",
                    },
                },
                {
                    type: "text",
                    text: "What are in these images?",
                },
                {
                    type: "image_url",
                    image_url: {
                        url: \`data:image/jpeg;base64,$\{base64_image2\}\`,
                        detail: "high",
                    },
                },
            ]
        }
    ],
```

```javascriptAISDK
messages: [
  {
    role: 'user',
    content: [
      {
        type: 'image',
        image: \`data:image/jpeg;base64,$\{base64Image1\}\`,
      },
      {
        type: 'text',
        text: 'What are in these images?',
      },
      {
        type: 'image',
        image: \`data:image/jpeg;base64,$\{base64Image2\}\`,
      },
    ],
  },
],
```

The image prompts can interleave with text prompts in any order.

## Image token usage

The prompt image token usage is provided in the API response. Each image will be automatically broken down into tiles of 448x448 pixels, and each tile will consume 256 tokens. The final generation will include an extra tile, so each image would consume `(# of tiles + 1) * 256` tokens. There is a maximum limit of 6 tiles, so your input would consume less than 1,792 tokens per image.

```pythonXAI
print(response.usage.prompt_image_tokens)
```

```pythonOpenAISDK
# Stream response
print(next(stream).usage.prompt_tokens_details.image_tokens)

# Non-stream response

print(response.usage.prompt_tokens_details.image_tokens)
```


