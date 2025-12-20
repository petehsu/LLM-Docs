# Changelog

### December, 2025

Dec 16

Feature

gpt-image-1.5

chatgpt-image-latest

Released [gpt-image-1.5](https://platform.openai.com/docs/models/gpt-image-1.5) and [chatgpt-image-latest](https://platform.openai.com/docs/models/chatgpt-image-latest), our latest and most advanced models for image generation. Read more [here](https://platform.openai.com/docs/guides/image-generation).

Dec 15

Feature

gpt-realtime-mini

gpt-audio-mini

gpt-4o-mini-transcribe

gpt-4o-mini-tts

Released four new dated audio snapshots. These updates deliver reliability, quality, and voice fidelity improvements for real-time, voice-driven applications:

* gpt-realtime-mini-2025-12-15
* gpt-audio-mini-2025-12-15
* gpt-4o-mini-transcribe-2025-12-15
* gpt-4o-mini-tts-2025-12-15

Read more [here](https://platform.openai.com/docs/guides/audio).

Dec 11

Feature

gpt-5.2

gpt-5.2-chat-latest

v1/responses

v1/chat/completions

Released [GPT-5.2](https://platform.openai.com/docs/models/gpt-5.2), the newest flagship model in the GPT-5 model family. GPT-5.2 shows improvements over the previous GPT-5.1 in:

* General intelligence
* Instruction following
* Accuracy and token efficiency
* Multimodality—especially vision
* Code generation—especially front-end UI creation
* Tool calling and context management in the API
* Spreadsheet understanding and creation.

What's new in 5.2 is a new xhigh reasoning effort level, concise reasoning summaries, and new context management using compaction.

### November, 2025

Nov 13

Feature

gpt-5.1

gpt-5.1-codex

gpt-5.1-chat-latest

gpt-5.1-codex-mini

v1/responses

v1/chat/completions

Released [GPT-5.1](/docs/models/gpt-5.1), the newest flagship model in the GPT-5 model family. GPT-5.1 is trained to be especially proficient in:

* Steerability and faster responses when less thinking's required
* Code generation and coding use cases
* Agentic workflows

Note that GPT-5.1 defaults to a new `none` reasoning setting for faster responses when less thinking's required—different from the previous `medium` default setting in GPT-5.

### October, 2025

Oct 6

Feature

gpt-5-pro

gpt-realtime-mini

gpt-audio-mini

gpt-image-1-mini

sora-2

sora-2-pro

v1/responses

v1/batch

v1/chat/completions

v1/videos

v1/realtime

v1/images/generations

Released several new features at [OpenAI DevDay](https://openai.com/devday/):

Released [gpt-5-pro](/docs/models/gpt-5-pro), a version of [GPT-5](/docs/models/gpt-5) that uses more compute to think harder and provide consistently better answers.

Released [gpt-realtime-mini](/docs/models/gpt-realtime-mini) and [gpt-audio-mini](/docs/models/gpt-audio-mini) for more cost-efficient speech to speech performance.

Released [gpt-image-1-mini](/docs/models/gpt-image-1-mini) for more cost-efficient image generation and editing.

Launched [v1/videos](/docs/guides/video-generation) for rich, detailed, and dynamic video generation and remixing with our latest [Sora 2](/docs/models/sora-2) and [Sora 2 Pro](/docs/models/sora-2-pro) models.

Launched [Agent Builder](/docs/guides/agent-builder) for visually creating custom multi-agent workflows.

Launched [ChatKit](/docs/guides/chatkit), an embeddable chat interface for deploying agents.

Released [Trace Evals, Datasets, and Prompt Optimization tools](/docs/guides/agent-evals).

[Evals](/docs/guides/evals): Released Third-Party Model Support

### September, 2025

Sep 26

Feature

v1/responses

Added support for image and file as a [tool call output](/docs/changelog) in Responses API.

Sep 23

Feature

gpt-5-codex

v1/responses

Launched special-purpose model [gpt-5-codex](/docs/models/gpt-5-codex), built and optimized for use with the [Codex CLI](https://github.com/openai/codex).

### August, 2025

Aug 28

Feature

v1/realtime

The OpenAI Realtime API is now generally available. Learn more [in our Realtime API guide](/docs/guides/realtime).

Aug 21

Feature

v1/responses

Added support for [connectors](/docs/guides/tools-connectors-mcp) to the Responses API. Connectors are OpenAI-maintained MCP wrappers for popular services like Google apps, Dropbox, and more that can be used to give model read access to data stored in those services.

Aug 20

Feature

v1/conversations

v1/responses

v1/assistants

Released the Conversations API, which allows you to create and manage long-running conversations with the Responses API. See the [migration guide](/docs/assistants/migration) to see a side-by-side comparison and learn how to migrate from an Assistants API integration to Responses and Conversations.

Aug 7

Feature

v1/chat/completions

v1/responses

Released GPT-5 family of models in the API, including [`gpt-5`](/docs/models/gpt-5), [`gpt-5-mini`](/docs/models/gpt-5-mini), and [`gpt-5-nano`](/docs/models/gpt-5-nano).

Introduced the `minimal` [reasoning effort](/docs/guides/reasoning) value to optimize for fast responses in GPT-5 models (which support reasoning).

Introduced `custom` [tool call](/docs/guides/function-calling#custom-tools) type, which allows for freeform inputs to and outputs from the model when tool calling.

### June, 2025

Jun 24

Feature

o3-deep-research

o3-deep-research-2025-06-26

o4-mini-deep-research

o4-mini-deep-research-2025-06-26

v1/responses

Released [o3-deep-research](/docs/models/o3-deep-research) and [o4-mini-deep-research](/docs/models/o4-mini-deep-research), deep research variants of our o-series reasoning models optimized for deep analysis and research tasks. Learn more in the [deep research guide](/docs/guides/deep-research).

Added support for async event handling with [webhooks](/docs/guides/webhooks). [Reduced and simplified pricing](/docs/pricing) for the web search tool. Added support for the [web search tool](/docs/guides/tools-web-search).

Jun 13

Feature

v1/responses

[New reusable prompts](/chat/edit) are now available in the dashboard and [Responses API](/docs/api-reference/responses/create). Via API, you can now reference templates created in the dashboard via the `prompt` parameter (with a prompt `id`, optional `version`) and supply dynamic `variables` that can include strings, images, or file inputs. Reusable prompts are not available in Chat Completions. [Learn more](/docs/guides/text?api-mode=responses#reusable-prompts).

Jun 10

Feature

o3-pro

v1/responses

v1/batch

Released [o3-pro](/docs/models/o3-pro), a version of the [o3](/docs/models/o3) reasoning model that uses more compute to answer hard problems with better reasoning and consistency. [Prices for the o3 model have also been reduced](/docs/pricing) for all API requests, including batch and flex processing.

Jun 4

Feature

v1/fine\_tuning

Added fine-tuning support with [direct preference optimization](/docs/guides/direct-preference-optimization) for the models `gpt-4.1-2025-04-14`, `gpt-4.1-mini-2025-04-14`, and `gpt-4.1-nano-2025-04-14`.

Jun 3

Feature

v1/chat/completions

v1/realtime

New model snapshots available for [gpt-4o-audio-preview](/docs/models/gpt-4o-audio-preview) and [gpt-4o-realtime-preview](/docs/models/gpt-4o-realtime-preview). Released [Agents SDK for TypeScript](https://openai.github.io/openai-agents-js).

### May, 2025

May 20

Feature

v1/responses

Added support for new built-in tools in the Responses API, including [remote MCP servers](/docs/guides/tools-remote-mcp) and [code interpreter](/docs/guides/tools-code-interpreter). [Learn more about tools](/docs/guides/tools).

May 20

Feature

v1/responses

v1/chat/completions

Added support for using `strict` mode for tool schemas when using parallel tool calling with non-fine-tuned models.
Added new [schema features](/docs/guides/structured-outputs?api-mode=responses#supported-schemas), including string validation for `email` and other patterns and specifying ranges for numbers and arrays.

May 15

Feature

codex-mini-latest

v1/responses

v1/chat/completions

Launched [codex-mini-latest](/docs/models/codex-mini-latest) in the API, optimized for use with the [Codex CLI](https://github.com/openai/codex).

May 7

Feature

v1/fine-tuning

v1/responses

v1/chat/completions

Launched support for [reinforcement fine-tuning](/docs/guides/reinforcement-fine-tuning). Learn about available [fine-tuning methods](/docs/guides/fine-tuning). [gpt-4.1-nano](/docs/models/gpt-4.1-nano) is now available for fine-tuning.

### April, 2025

Apr 23

Feature

v1/images/generations

v1/images/edits

Added a new image generation model, `gpt-image-1`. This model sets a new standard for image generation, with improved quality and instruction following.

Updated the Image Generation and Edit endpoints to support new parameters specific to the `gpt-image-1` model.

Apr 16

Feature

v1/chat/completions

v1/responses

Added two new o-series reasoning models, `o3` and `o4-mini`. They set a new standard for math, science, and coding, visual reasoning tasks, and technical writing.

Launched Codex, our code generation CLI tool.

Apr 14

Feature

gpt-4.1

gpt-4.1-mini

gpt-4.1-nano

v1/responses

v1/chat/completions

v1/fine\_tuning

Added [`gpt-4.1`](/docs/models/gpt-4.1), [`gpt-4.1-mini`](/docs/models/gpt-4.1-mini), and [`gpt-4.1-nano`](/docs/models/gpt-4.1-nano) models to the API. These new models feature improved instruction following, coding, and a larger context window (up to 1M tokens). `gpt-4.1` and `gpt-4.1-mini` are available for supervised fine-tuning. Announced deprecation of [`gpt-4.5-preview`](/docs/deprecations).

### March, 2025

Mar 20

Update

v1/audio

Added `gpt-4o-mini-tts`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, and `whisper-1` models to the Audio API.

Mar 19

Feature

o1-pro

v1/responses

v1/batch

Released [o1-pro](/docs/models/o1-pro), a version of the [o1](/docs/models/o1) reasoning model that uses more compute to answer hard problems with better reasoning and consistency.

Mar 11

Feature

gpt-4o-search-preview

gpt-4o-mini-search-preview

computer-use-preview

v1/chat/completions

v1/assistants

v1/responses

Released several new models and tools and a new API for agentic workflows:

* Released the [Responses API](/docs/guides/responses-vs-chat-completions), a new API for creating and using agents and tools.
* Released a set of built-in tools for the Responses API: [web search](/docs/guides/tools-web-search), [file search](/docs/guides/tools-file-search), and [computer use](/docs/guides/tools-computer-use).
* Released the [Agents SDK](/docs/guides/agents), an orchestration framework for designing, building, and deploying agents.
* Announced new models: `gpt-4o-search-preview`, `gpt-4o-mini-search-preview`, `computer-use-preview`.
* Announced plans to bring all [Assistants API](/docs/assistants) features to the easier to use [Responses API](/docs/guides/responses-vs-chat-completions), with an anticipated sunset date for Assistants in 2026 (after achieving full feature parity).

Mar 3

Feature

v1/fine\_tuning/jobs

Added `metadata` field support to fine-tuning jobs.

### February, 2025

Feb 27

Feature

GPT-4.5

v1/chat/completions

v1/assistants

v1/batch

Released a research preview of [GPT-4.5](/docs/models/gpt-4-5)—our largest and most capable chat model yet. GPT-4.5's high "EQ" and understanding of user intent make it better at creative tasks and agentic planning.

### January, 2025

Jan 31

Feature

o3-mini

o3-mini-2025-01-31

v1/chat/completions

Launched [o3-mini](/docs/models/o3-mini), a new small reasoning model that is optimized for science, math, and coding tasks.

### December, 2024

Dec 18

Feature

Launched [Admin API Key Rotations](/docs/api-reference/admin-api-keys), enabling customers to programmatically rotate their admin api keys.

Updated [Admin API Invites](/docs/api-reference/invite), enabling customers to programmatically invite users to projects at the same time they are invited to organizations.

Dec 17

Feature

o1

gpt-4o

gpt-4o-mini

v1/fine\_tuning

v1/chat/completions

v1/realtime

Added new models for [o1](/docs/models/o1), [gpt-4o-realtime](/docs/models/gpt-4o-realtime-preview), [gpt-4o-audio](/docs/models/gpt-4o-audio-preview) and [more](/docs/models).

Added WebRTC connection method for the [Realtime API](/docs/guides/realtime).

Added [`reasoning_effort` parameter](/docs/api-reference/chat/create#chat-create-reasoning_effort) for o1 models.

Added [`developer` message role](/docs/api-reference/chat/create#chat-create-messages) for o1 model. Note that o1-preview and o1-mini do not support system or developer messages.

Launched Preference Fine-tuning using [Direct Preference Optimization (DPO)](/docs/guides/fine-tuning#preference).

Launched beta SDKs for Go and Java. [Learn more](/docs/libraries).

Added [Realtime API](/docs/guides/realtime) support in the [Python SDK](https://github.com/openai/openai-python).

Dec 4

Feature

Launched [Usage API](/docs/api-reference/usage), enabling customers to programmatically query activities and spending across OpenAI APIs.

### November, 2024

Nov 20

Update

v1/chat/completions

Released [gpt-4o-2024-11-20](/docs/models/gpt-4o), our newest model in the gpt-4o series.

Nov 4

Feature

v1/chat/completions

Released [Predicted Outputs](/docs/guides/predicted-outputs), which greatly reduces latency for model responses where much of the response is known ahead of time. This is most common when regenerating the content of documents and code files with only minor changes.

### October, 2024

Oct 30

Feature

gpt-4o-realtime-preview

gpt-4o-audio-preview

v1/chat/completions

Added five new voice types in the [Realtime API](/docs/guides/realtime) and [Chat Completions API](/docs/guides/audio).

Oct 17

Feature

gpt-4o-audio-preview

v1/chat/completions

Released [new `gpt-4o-audio-preview` model](/docs/guides/audio) for chat completions, which supports both audio inputs and outputs. Uses the same underlying model as the [Realtime API](/docs/guides/realtime).

Oct 1

Feature

v1/realtime

v1/chat/completions

v1/fine\_tuning

Released several new features at [OpenAI DevDay in San Francisco](https://openai.com/devday/):

[Realtime API](/docs/guides/realtime): Build fast speech-to-speech experiences into your applications using a WebSockets interface.

[Model distillation](/docs/guides/distillation): Platform for fine-tuning cost-efficient models with your outputs from a large frontier model.

[Image fine-tuning](/docs/guides/fine-tuning#vision): Fine-tune GPT-4o with images and text to improve vision capabilities.

[Evals](/docs/guides/evals): Create and run custom evaluations to measure model performance on specific tasks.

[Prompt caching](/docs/guides/prompt-caching): Discounts and faster processing times on recently seen input tokens.

[Generate in playground](/chat/edit): Easily generate prompts, function definitions, and structured output schemas in the playground using the Generate button.

### September, 2024

Sep 26

Feature

omni-moderation-latest

v1/moderations

Released [new `omni-moderation-latest` moderation model](/docs/guides/moderation), which supports both images and text (for some categories), supports two new text-only harm categories, and has more accurate scores.

Sep 12

Feature

o1-preview

o1-mini

v1/chat/completions

Released [o1-preview and o1-mini](/docs/guides/reasoning), new large language models trained with reinforcement learning to perform complex reasoning tasks.

### August, 2024

Aug 29

Feature

v1/assistants

Assistants API now supports [including file search results used by the file search tool, and customizing ranking behavior](/docs/assistants/tools/file-search#improve-file-search-result-relevance-with-chunk-ranking).

Aug 20

Feature

gpt-4o

v1/fine\_tuning

GA release for [`gpt-4o-2024-08-06` fine-tuning](/docs/guides/fine-tuning)—all API users can now fine-tune the latest GPT-4o model.

Aug 15

Update

gpt-4o

v1/chat/completions

Released [dynamic model for `chatgpt-4o-latest`](/docs/models/chatgpt-4o-latest)—this model will point to the latest GPT-4o model used by ChatGPT.

Aug 6

Update

Launched [Structured Outputs](/docs/guides/structured-outputs)—model outputs now reliably adhere to developer supplied JSON Schemas.

Released [gpt-4o-2024-08-06](/docs/models/gpt-4o), our newest model in the gpt-4o series.

Aug 1

Update

Launched [Admin and Audit Log APIs](/docs/api-reference/administration), allowing customers to programmatically administer their organization and monitor changes using the audit logs. Audit logging must be enabled within [settings](/docs/changelog).

### July, 2024

Jul 24

Update

Launched [self-serve SSO configuration](https://help.openai.com/en/articles/9641482-api-platform-single-sign-on-sso-integration-for-existing-enterprise-customers), allowing Enterprise customers on custom and unlimited billing to set up authentication against their desired IDP.

Jul 23

Update

Launched [fine-tuning for GPT-4o mini](/docs/guides/fine-tuning), enabling even higher performance for specific use cases.

Jul 18

Update

Released [GPT-4o mini](/docs/models/gpt-4o-mini), our affordable an intelligent small model for fast, lightweight tasks.

Jul 17

Update

Released [Uploads](/docs/api-reference/uploads) to upload large files in multiple parts.

### June, 2024

Jun 6

Update

[Parallel function calling](/docs/guides/function-calling#configure-parallel-function-calling) can be disabled in Chat Completions and the Assistants API by passing `parallel_tool_calls=false`.

[.NET SDK](/docs/libraries#dotnet-library) launched in Beta.

Jun 3

Update

Added support for [file search customizations](/docs/assistants/tools/file-search#customizing-file-search-settings).

### May, 2024

May 15

Update

Added support for [archiving projects](/projects) . Only organization owners can access this functionality.

Added support for [setting cost limits](/settings/organization/general) on a per-project basis for pay as you go customers.

May 13

Update

Released [GPT-4o](/docs/models/gpt-4o) in the API. GPT-4o is our fastest and most affordable flagship model.

May 9

Update

Added support for [image inputs to the Assistants API.](/docs/assistants/overview)

May 7

Update

Added support for [fine-tuned models to the Batch API](/docs/guides/batch#model-availability) .

May 6

Update

Added [`stream_options: {"include_usage": true}`](/docs/api-reference/chat/create#chat-create-stream_options) parameter to the Chat Completions and Completions APIs. Setting this gives developers access to usage stats when using streaming.

May 2

Update

Added [a new endpoint](/docs/api-reference/messages/deleteMessage) to delete a message from a thread in the Assistants API.

### April, 2024

Apr 29

Update

Added a new [function calling option `tool_choice: "required"`](/docs/guides/function-calling#function-calling-behavior) to the Chat Completions and Assistants APIs.

Added a [guide for the Batch API](/docs/guides/batch) and Batch API support for [embeddings models](/docs/guides/batch#model-availability)

Apr 17

Update

Introduced a [series of updates to the Assistants API](/docs/assistants/whats-new) , including a new file search tool allowing up to 10,000 files per assistant, new token controls, and support for tool choice.

Apr 16

Update

Introduced [project based hierarchy](/docs/changelog) for organizing work by projects, including the ability to create [API keys](/docs/api-reference/authentication) and manage rate and cost limits on a per-project basis (cost limits available only for Enterprise customers).

Apr 15

Update

Released [Batch API](/docs/guides/batch)

Apr 9

Update

Released [GPT-4 Turbo with Vision](/docs/models/gpt-4-turbo) in general availability in the API

Apr 4

Update

Added support for [seed](/docs/api-reference/fine-tuning/create) in the fine-tuning API

Added support for [checkpoints](/docs/api-reference/fine-tuning/list-checkpoints) in the fine-tuning API

Added support for [adding Messages when creating a Run](/docs/api-reference/runs/createRun#runs-createrun-additional_messages) in the Assistants API

Apr 1

Update

Added support for [filtering Messages by run\_id](/docs/api-reference/messages/listMessages#messages-listmessages-run_id) in the Assistants API

### March, 2024

Mar 29

Update

Added support for [temperature](/docs/api-reference/runs/createRun#runs-createrun-temperature) and [assistant message creation](/docs/api-reference/messages/createMessage#messages-createmessage-role) in the Assistants API

Mar 14

Update

Added support for [streaming](/docs/assistants/overview) in the Assistants API

### February, 2024

Feb 9

Update

Added [`timestamp_granularities` parameter](/docs/guides/speech-to-text#timestamps) to the Audio API

Feb 1

Update

Released [gpt-3.5-turbo-0125, an updated GPT-3.5 Turbo model](/docs/models/gpt-3-5-turbo)

### January, 2024

Jan 25

Update

Released embedding V3 models and an updated GPT-4 Turbo preview

Added [`dimensions` parameter](/docs/api-reference/embeddings/create#embeddings-create-dimensions) to the Embeddings API

### December, 2023

Dec 20

Update

Added [`additional_instructions` parameter](/docs/api-reference/runs/createRun#runs-createrun-additional_instructions) to run creation in the Assistants API

Dec 15

Update

Added [`logprobs` and `top_logprobs` parameters](/docs/api-reference/chat/create#chat-create-logprobs) to the Chat Completions API

Dec 14

Update

Changed [function parameters](/docs/api-reference/chat/create#chat-create-tools) argument on a tool call to be optional

### November, 2023

Nov 30

Update

Released [OpenAI Deno SDK](https://deno.land/x/openai)

Nov 6

Update

Released [GPT-4 Turbo Preview](/docs/models/gpt-4-turbo), [updated GPT-3.5 Turbo](/docs/models/gpt-3-5-turbo), [GPT-4 Turbo with Vision](/docs/guides/vision), [Assistants API](/docs/assistants/overview), [DALL·E 3 in the API](/docs/models/dall-e-3), and [text-to-speech API](/docs/guides/text-to-speech)

Deprecated the Chat Completions `functions` parameter [in favor of `tools`](/docs/api-reference/chat/create#chat-create-tools)

Released [OpenAI Python SDK V1.0](/docs/libraries#python-library)

### October, 2023

Oct 16

Update

Added [`encoding_format` parameter](/docs/api-reference/embeddings/create#embeddings-create-encoding_format) to the Embeddings API

Added `max_tokens` to the [Moderation models](/docs/models/text-moderation-latest)

Oct 6

Update

Added [function calling support](/docs/guides/fine-tuning#fine-tuning-examples) to the Fine-tuning API