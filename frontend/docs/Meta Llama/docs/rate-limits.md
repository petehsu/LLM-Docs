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

# Rate limits

Llama API is currently available as a preview release, and rate limits are still being defined.

Llama API provides access to significant compute resources, and Meta limits the number of requests and tokens used by each developer account to ensure the stability of Llama API services for all developers.Rate limits apply to the number of requests per minute (RPM) and the number of tokens per minute (TPM).Rate limits are applied per team, not per API key. For teams using multiple API keys, rate limits are aggregated across all requests and tokens for that team.

## Rate limits per model

See the table below for rate limits for each model.

| Model | Requests per minute | Tokens per minute |
| --- | --- | --- |
| Llama-4-Maverick-17B-128E-Instruct-FP8 | 10 | 250,000 |
| Llama-4-Scout-17B-16E-Instruct-FP8 | 10 | 250,000 |
| Llama-3.3-70B-Instruct | 10 | 250,000 |
| Llama-3.3-8B-Instruct | 10 | 250,000 |

## API behaviour under rate limits

When your team’s rate limits have been exceeded, API calls will fail with an `HTTP 429` error, and an error message indicating that too many requests have been made. This means that you have exceeded your team’s rate limit, and cannot make more API requests until your usage falls below the limits for your team.The API will stop responding with errors once the RPM or TPM rates are no longer being exceeded.

## Rate limit headers

In addition to showing rate limits in the dashboard, Llama API exposes rate limits in the response headers for all API requests using the [Chat completion endpoint](/docs/api/chat).The following rate limit headers are returned with chat completion responses:

| Header | Description |
| --- | --- |
| `x-ratelimit-limit-tokens` | The total number of tokens for the token limit |
| `x-ratelimit-remaining-tokens` | The remaining number of tokens you can use before hitting the token limit |
| `x-ratelimit-limit-requests` | The total number of requests for the requests limit |
| `x-ratelimit-remaining-requests` | The remaining number of requests you can make before hitting the requests limit |

Was this page helpful?

[Rate limits per model](#rate-limits-per-model)

[API behaviour under rate limits](#api-behaviour-under-rate-limits)

[Rate limit headers](#rate-limit-headers)