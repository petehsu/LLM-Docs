# ChatGPT Developer mode

Full MCP client access for connectors and tools.

Copy page

## What is ChatGPT developer mode

ChatGPT developer mode is a beta feature that provides full Model Context Protocol (MCP) client support for all tools, both read and write. It's powerful but dangerous, and is intended for developers who understand how to safely configure and test connectors. When using developer mode, watch for [prompt injections and other risks](https://platform.openai.com/docs/mcp), model mistakes on write actions that could destroy data, and malicious MCPs that attempt to steal information.

## How to use

* **Eligibility:** Available in beta to Pro, Plus, Business, Enterprise and Education accounts on the web.
* **Enable developer mode:** Go to [**Settings → Connectors**](https://chatgpt.com/#settings/Connectors) → **Advanced → Developer mode**.
* **Import MCPs:**

  + Open [ChatGPT settings](https://chatgpt.com/#settings).
  + In the **Connectors** tab, add your remote MCP server. It will appear in the composer's "Developer Mode" tool later during conversations.
  + Supported connector protocols: SSE and streaming HTTP.
  + Authentication supported: OAuth or no authentication.
* **Manage tools:** In connector details, toggle tools on or off and refresh connectors to pull new tool lists and descriptions from the MCP server.
* **Use connectors in conversations:** Choose **Developer mode** from the Plus menu and select connectors. You may need to explore different prompting techniques to call the correct tools. For example:

  + Be explicit: "Use the "Acme CRM" connector's "update\_record" tool to …". When needed, include the server label and tool name.
  + Disallow alternatives to avoid ambiguity: "Do not use built-in browsing or other tools; only use the Acme CRM connector."
  + Disambiguate similar tools: "Prefer `Calendar.create_event` for meetings; do not use `Reminders.create_task` for scheduling."
  + Specify input shape and sequencing: "First call `Repo.read_file` with `{ path: "…" }`. Then call `Repo.write_file` with the modified content. Do not call other tools."
  + If multiple connectors overlap, state preferences up front (e.g., "Use `CompanyDB` for authoritative data; use other sources only if `CompanyDB` returns no results").
  + Developer mode does not require `search`/`fetch` tools. Any tools your connector exposes (including write actions) are available, subject to confirmation settings.
  + See more guidance in [Using tools](/docs/guides/tools) and [Prompting](/docs/guides/prompting).
  + Improve tool selection with better tool descriptions: In your MCP server, write action-oriented tool names and descriptions that include "Use this when…" guidance, note disallowed/edge cases, and add parameter descriptions (and enums) to help the model choose the right tool among similar ones and avoid built-in tools when inappropriate.

  Examples:

  ```
  1
  2
  3
  Schedule a 30‑minute meeting tomorrow at 3pm PT with
  alice@example.com and bob@example.com using "Calendar.create_event".
  Do not use any other scheduling tools.
  ```

  ```
  1
  2
  3
  Create a pull request using "GitHub.open_pull_request" from branch
  "feat-retry" into "main" with title "Add retry logic" and body "…".
  Do not push directly to main.
  ```
* **Reviewing and confirming tool calls:**

  + Inspect JSON tool payloads verify correctness and debug problems. For each tool call, you can use the carat to expand and collapse the tool call details. Full JSON contents of the tool input and output are available.
  + Write actions by default require confirmation. Carefully review the tool input which will be sent to a write action to ensure the behavior is as desired. Incorrect write actions can inadvertently destroy, alter, or share data!
  + Read-only detection: We respect the `readOnlyHint` tool annotation (see [MCP tool annotations](https://modelcontextprotocol.io/legacy/concepts/tools#available-tool-annotations)). Tools without this hint are treated as write actions.
  + You can choose to remember the approve or deny choice for a given tool for a conversation, which means it will apply that choice for the rest of that conversation. Because of this, you should only allow a tool to remember the approve choice if you know and trust the underlying application to make further write actions without your approval. New conversations will prompt for confirmation again. Refreshing the same conversation will also prompt for confirmation again on subsequent turns.