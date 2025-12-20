# Data controls in the OpenAI platform

Understand how OpenAI uses your data, and how you can control it.

Copy page

Understand how OpenAI uses your data, and how you can control it.

Your data is your data. As of March 1, 2023, data sent to the OpenAI API is not used to train or improve OpenAI models (unless you explicitly opt in to share data with us).

## Types of data stored with the OpenAI API

When using the OpenAI API, data may be stored as:

* **Abuse monitoring logs:** Logs generated from your use of the platform, necessary for OpenAI to enforce our [API data usage policies](https://openai.com/policies/api-data-usage-policies) and mitigate harmful uses of AI.
* **Application state:** Data persisted from some API features in order to fulfill the task or request.

## Data retention controls for abuse monitoring

Abuse monitoring logs may contain certain customer content, such as prompts and responses, as well as metadata derived from that customer content, such as classifier outputs. By default, abuse monitoring logs are generated for all API feature usage and retained for up to 30 days, unless we are legally required to retain the logs for longer.

Eligible customers may have their customer content excluded from these abuse monitoring logs by getting approved for the [Zero Data Retention](/docs/guides/your-data#zero-data-retention) or [Modified Abuse Monitoring](/docs/guides/your-data#modified-abuse-monitoring) controls. Currently, these controls are subject to prior approval by OpenAI and acceptance of additional requirements. Approved customers may select between Modified Abuse Monitoring or Zero Data Retention for their API Organization or project.

Customers who enable Modified Abuse Monitoring or Zero Data Retention are responsible for ensuring their users abide by OpenAI's policies for safe and responsible use of AI and complying with any moderation and reporting requirements under applicable law.

Get in touch with our [sales team](https://openai.com/contact-sales) to learn more about these offerings and inquire about eligibility.

### Modified Abuse Monitoring

Modified Abuse Monitoring excludes customer content (other than image and file inputs in rare cases, as described [below](/docs/guides/your-data#image-and-file-inputs)) from abuse monitoring logs across all API endpoints, while still allowing the customer to take advantage of the full capabilities of the OpenAI platform.

### Zero Data Retention

Zero Data Retention excludes customer content from abuse monitoring logs, in the same way as Modified Abuse Monitoring.

Additionally, Zero Data Retention changes some endpoint behavior: the `store` parameter for `/v1/responses` and `v1/chat/completions` will always be treated as `false`, even if the request attempts to set the value to `true`.

Besides those specific behavior changes, the endpoints and capabilities listed as No for Zero Data Retention Eligible in the table below may still store application state, even if Zero Data Retention is enabled.

### Configuring data retention controls

Once your organization has been approved for data retention controls, you'll see a **Data Retention** tab within [Settings → Organization → Data controls](https://platform.openai.com/settings/organization/data-controls/data-retention). From that tab, you can configure data retention controls at both the organization and project level.

* **Organization-level controls:** Choose between Zero Data Retention or Modified Abuse Monitoring for your entire organization.
* **Project-level controls:** For each project, select `default` to inherit the organization-level setting, explicitly pick Zero Data Retention or Modified Abuse Monitoring, or select **None** to disable these controls for that project.

### Storage requirements and retention controls per endpoint

The table below indicates when application state is stored for each endpoint. Zero Data Retention eligible endpoints will not store any data. Zero Data Retention ineligible endpoints or capabilities may store application state when used, even if you have Zero Data Retention enabled.

| Endpoint | Data used for training | Abuse monitoring retention | Application state retention | Zero Data Retention eligible |
| --- | --- | --- | --- | --- |
| `/v1/chat/completions` | No | 30 days | None, see below for exceptions | Yes, see below for limitations |
| `/v1/responses` | No | 30 days | None, see below for exceptions | Yes, see below for limitations |
| `/v1/conversations` | No | Until deleted | Until deleted | No |
| `/v1/conversations/items` | No | Until deleted | Until deleted | No |
| `/v1/assistants` | No | 30 days | Until deleted | No |
| `/v1/threads` | No | 30 days | Until deleted | No |
| `/v1/threads/messages` | No | 30 days | Until deleted | No |
| `/v1/threads/runs` | No | 30 days | Until deleted | No |
| `/v1/threads/runs/steps` | No | 30 days | Until deleted | No |
| `/v1/vector_stores` | No | 30 days | Until deleted | No |
| `/v1/images/generations` | No | 30 days | None | Yes, see below for limitations |
| `/v1/images/edits` | No | 30 days | None | Yes, see below for limitations |
| `/v1/images/variations` | No | 30 days | None | Yes, see below for limitations |
| `/v1/embeddings` | No | 30 days | None | Yes |
| `/v1/audio/transcriptions` | No | None | None | Yes |
| `/v1/audio/translations` | No | None | None | Yes |
| `/v1/audio/speech` | No | 30 days | None | Yes |
| `/v1/files` | No | 30 days | Until deleted\* | No |
| `/v1/fine_tuning/jobs` | No | 30 days | Until deleted | No |
| `/v1/evals` | No | 30 days | Until deleted | No |
| `/v1/batches` | No | 30 days | Until deleted | No |
| `/v1/moderations` | No | None | None | Yes |
| `/v1/completions` | No | 30 days | None | Yes |
| `/v1/realtime` | No | 30 days | None | Yes |
| `/v1/videos` | No | 30 days | None | No |

#### `/v1/chat/completions`

* Audio outputs application state is stored for 1 hour to enable [multi-turn conversations](/docs/guides/your-data).
* When Zero Data Retention is enabled for an organization, the `store` parameter will always be treated as `false`, even if the request attempts to set the value to `true`.
* See [image and file inputs](/docs/guides/your-data#image-and-file-inputs).
* Extended prompt caching requires storing key/value tensors to GPU-local storage as application state. This storage requirement means that requests leveraging extended prompt caching are not Zero Data Retention eligible. To learn more, see the [prompt caching guide](/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/responses`

* The Responses API has a 30 day Application State retention period by default, or when the `store` parameter is set to `true`. Response data will be stored for at least 30 days.
* When Zero Data Retention is enabled for an organization, the `store` parameter will always be treated as `false`, even if the request attempts to set the value to `true`.
* Background mode stores response data for roughly 10 minutes to enable polling, so it is not compatible with Zero Data Retention even though `background=true` is still accepted for legacy ZDR keys. Modified Abuse Monitoring (MAM) projects can continue to use background mode.
* Audio outputs application state is stored for 1 hour to enable [multi-turn conversations](/docs/guides/your-data).
* See [image and file inputs](/docs/guides/your-data#image-and-file-inputs).
* MCP servers (used with the [remote MCP server tool](/docs/guides/tools-remote-mcp)) are third-party services, and data sent to an MCP server is subject to their data retention policies.
* The [Code Interpreter](/docs/guides/tools-code-interpreter) tool cannot be used when Zero Data Retention is enabled. Code Interpreter can be used with [Modified Abuse Monitoring](/docs/guides/your-data#modified-abuse-monitoring) instead.
* Extended prompt caching requires storing key/value tensors to GPU-local storage as application state. This storage requirement means that requests leveraging extended prompt caching are not Zero Data Retention eligible. To learn more, see the [prompt caching guide](/docs/guides/prompt-caching#prompt-cache-retention).

#### `/v1/assistants`, `/v1/threads`, and `/v1/vector_stores`

* Objects related to the Assistants API are deleted from our servers 30 days after you delete them via the API or the dashboard. Objects that are not deleted via the API or dashboard are retained indefinitely.

#### `/v1/images`

* Image generation is Zero Data Retention compatible when using `gpt-image-1`, `gpt-image-1.5`, and `gpt-image-1-mini`, not when using `dall-e-3` or `dall-e-2`.

#### `/v1/files`

* Files can be manually deleted via the API or the dashboard, or can be automatically deleted by setting the `expires_after` parameter. See [here](/docs/api-reference/files/create#files_create-expires_after) for more information.

#### `/v1/videos`

* The `v1/videos` is not compatible with data retention controls. If your organization has data retention controls enabled, configure a project with its retention setting set to **None** as described in [Configuring data retention controls](/docs/guides/your-data#configuring-data-retention-controls) to use `/v1/videos` with that project.

#### Image and file inputs

Images and files may be uploaded as inputs to `/v1/responses` (including when using the Computer Use tool), `/v1/chat/completions`, and `/v1/images`. Image and file inputs are scanned for CSAM content upon submission. If the classifier detects potential CSAM content, the image will be retained for manual review, even if Zero Data Retention or Modified Abuse Monitoring is enabled.

#### Web Search

Web Search is ZDR eligible, but Web Search is not HIPAA eligible and is not covered by a BAA.

## Data residency controls

Data residency controls are a project configuration option that allow you to configure the location of infrastructure OpenAI uses to provide services.

Contact our [sales team](https://openai.com/contact-sales) to see if you're eligible for using data residency controls.

### How does data residency work?

When data residency is enabled on your account, you can set a region for new projects you create in your account from the available regions listed below. If you use the supported endpoints, models, and snapshots listed below, your customer content (as defined in your services agreement) for that project will be stored at rest in the selected region to the extent the endpoint requires data persistence to function (such as /v1/batches).

If you select a region that supports regional processing, as specifically identified below, the services will perform inference for your Customer Content in the selected region as well.

Data residency does not apply to system data, which may be processed and stored outside the selected region. System data means account data, metadata, and usage data that do not contain Customer Content, which are collected by the services and used to manage and operate the services, such as account information or profiles of end users that directly access the services (e.g., your personnel), analytics, usage statistics, billing information, support requests, and structured output schema.

### Limitations

Data residency does not apply to: (a) any transmission or storage of Customer Content outside of the selected region caused by the location of an End User or Customer's infrastructure when accessing the services; (b) products, services, or content offered by parties other than OpenAI through the Services; or (c) any data other than Customer Content, such as system data.

If your selected Region does not support regional processing, as identified below, OpenAI may also process and temporarily store Customer Content outside of the Region to deliver the services.

### Additional requirements for non-US regions

To use data residency with any region other than the United States, you must be approved for abuse monitoring controls, and execute a Zero Data Retention amendment.

Selecting the United Arab Emirates region requires additional approval. Contact [sales](https://openai.com/contact-sales) for assistance.

### How to use data residency

Data residency is configured per-project within your API Organization.

To configure data residency for regional storage, select the appropriate region from the dropdown when creating a new project.

For requests to projects with data residency configured, add the domain prefix as defined in the table below to each request. For regions where the prefix is marked as optional, including the prefix may help improve response latency for your requests.

### Which models and features are eligible for data residency?

The following models and API services are eligible for data residency today for the regions specified below.

**Table 1: Regional data residency capabilities**

| Region | Regional storage | Regional processing | Requires modified abuse monitoring or ZDR | Default modes of entry | Domain prefix |
| --- | --- | --- | --- | --- | --- |
| US | ✅ | ✅ | ❌ | Text, Audio, Voice, Image | us.api.openai.com (required) |
| Europe (EEA + Switzerland) | ✅ | ✅ | ✅ | Text, Audio, Voice, Image\* | eu.api.openai.com (required) |
| Australia | ✅ | ❌ | ✅ | Text, Audio, Voice, Image\* | au.api.openai.com (optional) |
| Canada | ✅ | ❌ | ✅ | Text, Audio, Voice, Image\* | ca.api.openai.com (optional) |
| Japan | ✅ | ❌ | ✅ | Text, Audio, Voice, Image\* | jp.api.openai.com (optional) |
| India | ✅ | ❌ | ✅ | Text, Audio, Voice, Image\* | in.api.openai.com (optional) |
| Singapore | ✅ | ❌ | ✅ | Text, Audio, Voice, Image\* | sg.api.openai.com (optional) |
| South Korea | ✅ | ❌ | ✅ | Text, Audio, Voice, Image\* | kr.api.openai.com (optional) |
| United Kingdom | ✅ | ❌ | ✅ | Text, Audio, Voice, Image\* | gb.api.openai.com (required) |
| United Arab Emirates | ✅ | ❌ | ✅ | Text, Audio, Voice, Image\* | ae.api.openai.com (required) |

\* Image support in these regions requires approval for enhanced Zero Data Retention or enhanced Modified Abuse Monitoring.

**Table 2: API endpoint and tool support**

| Supported services | Supported model snapshots | Supported region |
| --- | --- | --- |
| /v1/audio/transcriptions /v1/audio/translations /v1/audio/speech | tts-1 whisper-1 gpt-4o-tts gpt-4o-transcribe gpt-4o-mini-transcribe | All |
| /v1/batches | gpt-5.2-pro-2025-12-11 gpt-5-pro-2025-10-06 gpt-5-2025-08-07 gpt-5.2-2025-12-11 gpt-5.1-2025-11-13 gpt-5-mini-2025-08-07 gpt-5-nano-2025-08-07 gpt-5.2-chat-latest gpt-5-chat-latest-2025-08-07 gpt-4.1-2025-04-14 gpt-4.1-mini-2025-04-14 gpt-4.1-nano-2025-04-14 o3-2025-04-16 o4-mini-2025-04-16 o1-pro o1-pro-2025-03-19 o3-mini-2025-01-31 o1-2024-12-17 o1-mini-2024-09-12 o1-preview gpt-4o-2024-11-20 gpt-4o-2024-08-06 gpt-4o-mini-2024-07-18 gpt-4-turbo-2024-04-09 gpt-4-0613 gpt-3.5-turbo-0125 | All |
| /v1/chat/completions | gpt-5-2025-08-07 gpt-5.2-2025-12-11 gpt-5.1-2025-11-13 gpt-5-mini-2025-08-07 gpt-5-nano-2025-08-07 gpt-5.2-chat-latest gpt-5-chat-latest-2025-08-07 gpt-4.1-2025-04-14 gpt-4.1-mini-2025-04-14 gpt-4.1-nano-2025-04-14 o3-mini-2025-01-31 o3-2025-04-16 o4-mini-2025-04-16 o1-2024-12-17 o1-mini-2024-09-12 o1-preview gpt-4o-2024-11-20 gpt-4o-2024-08-06 gpt-4o-mini-2024-07-18 gpt-4-turbo-2024-04-09 gpt-4-0613 gpt-3.5-turbo-0125 | All (gpt-5.2 not currently supported in EU) |
| /v1/embeddings | text-embedding-3-small text-embedding-3-large text-embedding-ada-002 | All |
| /v1/evals |  | US and EU |
| /v1/files |  | All |
| /v1/fine\_tuning/jobs | gpt-4o-2024-08-06 gpt-4o-mini-2024-07-18 gpt-4.1-2025-04-14 gpt-4.1-mini-2025-04-14 | All |
| /v1/images/edits | gpt-image-1 gpt-image-1.5 gpt-image-1-mini | All |
| /v1/images/generations | dall-e-3 gpt-image-1 gpt-image-1.5 gpt-image-1-mini | All |
| /v1/moderations | text-moderation-latest\* omni-moderation-latest | All |
| /v1/realtime | gpt-4o-realtime-preview-2025-06-03 gpt-realtime gpt-realtime-mini | US and EU |
| /v1/realtime | gpt-4o-realtime-preview-2024-12-17 gpt-4o-realtime-preview-2024-10-01 gpt-4o-mini-realtime-preview-2024-12-17 | US only |
| /v1/responses | gpt-5.2-pro-2025-12-11 gpt-5-pro-2025-10-06 gpt-5-2025-08-07 gpt-5.2-2025-12-11 gpt-5.1-2025-11-13 gpt-5-mini-2025-08-07 gpt-5-nano-2025-08-07 gpt-5.2-chat-latest gpt-5-chat-latest-2025-08-07 gpt-4.1-2025-04-14 gpt-4.1-mini-2025-04-14 gpt-4.1-nano-2025-04-14 o3-2025-04-16 o4-mini-2025-04-16 o1-pro o1-pro-2025-03-19 computer-use-preview\* o3-mini-2025-01-31 o1-2024-12-17 o1-mini-2024-09-12 o1-preview gpt-4o-2024-11-20 gpt-4o-2024-08-06 gpt-4o-mini-2024-07-18 gpt-4-turbo-2024-04-09 gpt-4-0613 gpt-3.5-turbo-0125 | All (gpt-5.2 not currently supported in EU) |
| /v1/responses File Search |  | All |
| /v1/responses Web Search |  | All |
| /v1/vector\_stores |  | All |
| Code Interpreter tool |  | All |
| File Search |  | All |
| File Uploads |  | All, when used with base64 file uploads |
| Remote MCP server tool |  | All, but MCP servers are third-party services, and data sent to an MCP server is subject to their data residency policies. |
| Scale Tier |  | All |
| Structured Outputs (excluding schema) |  | All |
| Supported Input Modalities |  | Text Image Audio/Voice |

### Endpoint limitations

#### /v1/chat/completions

* Cannot set store=true in non-US regions.
* [Extended prompt caching](/docs/guides/prompt-caching#prompt-cache-retention) is only available in regions that support Regional processing.

#### /v1/responses

* computer-use-preview snapshots are only supported for US/EU.
* Cannot set background=True in EU region.
* [Extended prompt caching](/docs/guides/prompt-caching#prompt-cache-retention) is only available in regions that support Regional processing.

#### /v1/realtime

Tracing is not currently EU data residency compliant for `/v1/realtime`.

#### /v1/moderations

text-moderation-latest is only supported for US/EU.

## Enterprise Key Management (EKM)

Enterprise Key Management (EKM) allows you to encrypt your customer content at OpenAI using keys managed by your own external Key Management System (KMS).

Once configured, EKM applies to any [application state](/docs/guides/your-data#types-of-data-stored-with-openai-api) created during your use of the platform. See the [EKM help center article](https://help.openai.com/en/articles/20000943-openai-enterprise-key-management-ekm-overview) for more information about how EKM works, and how to integrate with your KMS provider.

### EKM limitations

OpenAI supports Bring Your Own Key (BYOK) encryption with external accounts in AWS KMS, Google Cloud (GCP), and Azure Key Vault. If your organization leverages a different key management services, those keys need to be synced to one of the supported Cloud KMSs for use with OpenAI.

EKM does not support the following products. An attempt to use these endpoints in a project with EKM enabled will return an error.

* Assistants (/v1/assistants)
* Vision fine tuning