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

# API Keys

## About API keys

Llama API uses API keys for authentication, created in the API Dashboard. Users can have individual keys or share them with their team.With an API key, you can make API calls by including the key in your requests. All Llama API endpoints require key-based authentication.

All API keys for a team share the same rate limits and request quotas. See [Rate Limits and Quotas](/docs/rate-limits) for more information.

## Get an API key

API keys are generated in the API Dashboard at [llama.developer.meta.com](https://llama.developer.meta.com). Get a key for yourself or your team by following these steps:

1. Log into API Dashboard and click on the API keys tab.
2. Click Create API key and give your key a memorable name. Click Create.
3. Your new key will be shown, and you can copy it somewhere safe.

API keys are formatted as follows:

LLM|607358788850350|nx9.....LJY

Enter to Rename, Shift+Enter to Preview

## Using API keys

With an API key, you can start to make API calls. The API key is sent in the request using the `Authorization` header. Llama API keys are bearer keys, so send them using the `Bearer` authorization scheme.The following example demonstrates how to use API keys with request headers using `curl`:

curl https://api.llama.com/v1/models \

-H "Authorization: Bearer LLM|607358788850350|nx9.....LJY"

Enter to Rename, Shift+Enter to Preview

Keys should be stored safely in production environments, and added automatically to the request header for each request. Store keys in environment variables to avoid storing them directly in code, as the [Quickstart](/docs/quickstart) example shows.

## Revoking API keys

Revoke an API key by deleting it from the API Dashboard using the Delete button. Deleting a key does not affect other team keys.

## API key safety

API keys are powerful and require careful handling to prevent misuse.
If your API key is exposed to someone outside your team, they could access uploaded files, misuse the API or exceed your team’s rate limits and request quotas.Follow these best practices when using API keys:

1. Use unique API keys for different applications or developers within your team. This allows you to revoke keys for a developer or an application without affecting other developers or applications.
2. Keep API keys out of client code. Keys in mobile and web applications can easily be exposed by malicious end users and used to abuse your API rate limits. Your client applications should always route queries through a light webserver under your control, where your API key can be safely held away from client code.
3. Never commit keys to a public repository. Accidental repository commits are one of the most common causes of key leakage. Keep keys in environment variables or configuration files that are excluded from version control.
4. Avoid putting keys directly into code. Consider storing keys in environment variables or somewhere secure outside of code.
5. Use a key management service. While you can retrieve keys from the API dashboard, it is useful to keep them somewhere secure so they can be shared safely with people on your team who need them.
6. Keep an eye on your API rate limits. Unexpected spikes in API usage may indicate that a key has been leaked. Revoke keys quickly if you see unexpected API usage.

Was this page helpful?

[About API keys](#about-api-keys)

[Get an API key](#get-an-api-key)

[Using API keys](#using-api-keys)

[Revoking API keys](#revoking-api-keys)

[API key safety](#api-key-safety)