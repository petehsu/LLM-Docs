#### Key Information

# Migrating to New Models

As we release newer, more advanced models, we are focusing resources on supporting customers with these models and will
be phasing out older versions.

You will see `deprecated` tag by the deprecated model names on [xAI Console](https://console.x.ai) models page. You
should consider moving to a newer model when the model of your choice is being deprecated.

We may transition a `deprecated` model to `obsolete` and discontinue serving the model across our services.
An `obsolete` model will be removed from our [Models and Pricing](../models) page as well as from [xAI Console](https://console.x.ai).

## Moving from an older generation model

When you move from an older model generation to a newer one, you usually won't need to make significant changes to
how you use the API. In your request body, you can switch the `"model"` field from the deprecating model to a current
model on [xAI Console](https://console.x.ai) models page.

The newer models are more performant, but you might want to check if your prompts and other parameters can work with the
new model and modify if necessary.

## Moving to the latest endpoints

When you are setting up to use new models, it might also be a good idea to ensure you're using the latest endpoints. The
latest endpoints have more stable supports for the model functionalities. Endpoints that are marked with `legacy`
might not receive any updates that support newer functionalities.

In general, the following endpoints are recommended: - Text and image input and text output: [Chat Completions](../api-reference#chat-completions) - `/v1/chat/completions` - Text input and image output: [Image Generations](../api-reference#image-generations) - `/v1/image/generations` - Tokenization: [Tokenize Text](../api-reference#tokenize-text) - `/v1/tokenize-text`


