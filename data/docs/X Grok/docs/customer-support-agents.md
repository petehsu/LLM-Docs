# Customer Support Agents API Guide

## Overview

The Customer Support Agents API provides a specialized chat service for handling customer inquiries, leveraging RAG for knowledge bases and tools for actions like replies or escalations. This is an optimized replacement for `/v1/chat/completions`, with support-specific parameters.

The API is currently stateless, so you need to provide the full conversation history on each request.
Provisioning (API keys, agents) is handled in the console UI, while this doc focuses on integration.

For API keys, visit [https://console.x.ai/team/default/support-agents/api-keys](https://console.x.ai/team/default/support-agents/api-keys).

To view and create Support Agents, visit [https://console.x.ai/team/default/support-agents/agents](https://console.x.ai/team/default/support-agents/agents).

Key endpoints:

* `/v1/support-agent/chat`: Non-streaming responses.
* `/v1/support-agent/chat-stream`: Streaming responses.

## Quick Setup

1. **Create API Key**: Visit the [console](https://console.x.ai/team/default/support-agents/api-keys) to create a new Support Agent API Key and save it securely.

2. **Find Agent ID**: Go to the [agents page](https://console.x.ai/team/default/support-agents/agents) to view or create your Support Agent, and note the `support_agent_id`.

3. **Send Request**: Use the following curl example to make a real API call. You can generate any `conversation_id` value on your end and reference it later if conversation grows longer.

```bash
curl --location 'https://api.x.ai/v1/support-agent/chat' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer API_KEY_HERE' \
--data '{
  "support_agent_id": "support_agent_d5cdd745-0dc9-479c-9ff1-f14bee21e7ce",  # Found in the agents console
  "deployment_id": "LATEST",
  "conversation_id": "conv-uuid-67890",  # Generate a unique identifier for each conversation
  "messages": [ 
    {
      "content": [
        {
          "text": "Where is my order?"
        }
      ],
      "role": "ROLE_USER"
    }
  ],
  "environment": "ENVIRONMENT_PROD"  # Or "ENVIRONMENT_STAGING" for testing
}'
```

This will return a response from the agent. For subsequent messages, append to the `messages` array and reuse `conversation_id`.

## Using Collections as a Knowledge Base

To enhance your Support Agent using knowledge-based Retrieval-Augmented Generation (RAG)—which allows the agent to retrieve and use relevant information from your documents—we recommend our Collections API.

You can create a Collection directly [in the console](https://console.x.ai/team/default/collections) and upload your documents, such as FAQs and policies.

Once your Collection is created, you'll need to attach it to your agent in the console.

* Full docs: [Collections API Reference](https://docs.x.ai/docs/guides/function-calling).
* Limit: One Collection per agent currently.

Once configured, the agent uses RAG to retrieve and include only relevant document chunks from the Collection in its context for each response.
This adds relevant chunks to the agent's context before responding.

&#x20;Updates to documents in the Collection (e.g., adding new pages) propagate after a short delay **without reconfiguring the agent**.

## Tools Integration

To give your Support Agent access to external actions, you can define Tools (also known as function calling) when deploying it in the console. Function calling lets the agent decide when to invoke specific functions based on the conversation.

Then, when handling queries, your Support Agent will suggest function names it thinks it should call. Your implementation can then loop to execute these functions locally and feed the results back to the agent for further processing.

For official documentation on Function Calling, visit our [Function Calling Reference](https://docs.x.ai/docs/guides/function-calling).

To ensure conversations are handled effectively and reach proper end states (e.g., resolving the issue or escalating), define tools like CLOSE (to end the conversation) and ESCALATE (to hand off to human support). These tools let the agent suggest actions that your implementation can then execute in your messaging system, such as closing a ticket in Intercom or Slack.

### Defining Tools

* Define `tools` when configuring your agent:
  ```json
  "tools": [
    {
      "function": {
        "name": "USER_INFO_LOOKUP",
        "description": "Lookup user information by calling your internal service",
        "parameters": {
          "type": "object",
          "properties": {
            "user_id": {"type": "string", "description": "The unique ID of the user to look up in your system"}
          },
          "required": ["user_id"]
        }
      }
    },
    {
      "function": {
        "name": "ESCALATE",
        "description": "Escalate the conversation to human support by creating a ticket or notifying a team.",
        "parameters": {
          "type": "object",
          "properties": {
            "reason": {"type": "string", "description": "Brief reason for escalation"},
            "priority": {"type": "string", "enum": ["low", "medium", "high"], "description": "Escalation priority"}
          },
          "required": ["reason"]
        }
      }
    },
    {
      "function": {
        "name": "CLOSE",
        "description": "Close the conversation, marking it as resolved.",
        "parameters": {
          "type": "object",
          "properties": {
            "resolution_summary": {"type": "string", "description": "Summary of how the issue was resolved"}
          },
          "required": ["resolution_summary"]
        }
      }
    }
  ]
  ```

### Handling Tool Calls

After the agent suggests a tool (via function calling), implement a loop to process it:

1. **Check for tool calls**: Look for messages with `role: "ROLE_TOOL"` (with `tool_calls` array) or legacy `role: "ROLE_FUNCTION"` (with single `function`). Extract `name` and `arguments` (e.g., `{"user_id": "user123"}` for `USER_INFO_LOOKUP`).

2. **Execute the tool**: Call your internal services with the arguments. For `USER_INFO_LOOKUP({"user_id": "user123"})`, fetch from your database (e.g., return `{"name": "John Doe", "account_status": "active"}`).

3. **Append results and re-query**: Add a `role: "ROLE_TOOL"` message with the JSON result in `content` (e.g., `[{"text": "{\"name\": \"John Doe\", \"account_status\": \"active\"}"}]`) and `tool_call_id`. Send the updated history back to the API.

**Example Tool Result Message**:

```json
{
  "role": "ROLE_TOOL",
  "content": [{"text": "{\"name\": \"John Doe\", \"account_status\": \"active\"}"}],
  "tool_call_id": "id"
}
```

Repeat the loop until an end-state tool (like CLOSE) is called or no more tools are suggested—then reply to the user with the latest agent response.

### End-State Tools

Example CLOSE and ESCALATE logic to resolve conversations:

* **CLOSE**: Extract the `resolution_summary` from the agent's tool call arguments, use it to update your system (e.g., mark ticket resolved), and end the interaction.

* **ESCALATE**: Extract `reason` and `priority` from the agent's tool call arguments, then flag in your CRM (e.g., Intercom: add 'escalate' tag, create admin note with the reason and priority, assign to human agent).

&#x20;Always loop until resolution—re-query after each tool to let the agent build context and conclude naturally.

## Guardrails (Optional)

Guardrails filter inputs before the agent processes them. You can define them in the console when deploying an agent.

* **What is a guardrail?**: A pre-check to block inappropriate queries (e.g., threats, PII). If triggered, returns custom text (e.g., "Escalating to human support") instead of processing.
* Example:
  ```json
  "guardrails": [
    {
      "guardrail_id": "guard-123",
      "type": "GUARDRAIL_TYPE_INPUT",
      "instructions": "Block if query contains threats or inappropriate info.",
      "triggered_text": "This query is blocked. Contact support.",
      "model_name": "grok-3",
      "enabled": true
    }
  ]
  ```

## Chat Endpoint

POST to `/v1/support-agent/chat` for responses.

### Request

Required fields:

* `support_agent_id`: ID of your Support Agent. You can find your ID here [https://console.x.ai/team/default/support-agents/agents](https://console.x.ai/team/default/support-agents/agents).
* `conversation_id`: Choose a unique ID for your conversation. The Chat API is currently stateless.
* `messages`: Array of history (full each time). Roles: `ROLE_USER`, `ROLE_ASSISTANT`, `ROLE_SYSTEM`, `ROLE_FUNCTION`, `ROLE_TOOL`. Content: `[{"text": "query"}]` or image URLs.
* `environment`: `"ENVIRONMENT_PROD"` or `"ENVIRONMENT_STAGING"`.

Schema:

```json
{
  "support_agent_id": "support_agent_d5cdd745-0dc9-479c-9ff1-f14bee21e7ce",
  "conversation_id": "conv-uuid-67890",
  "deployment_id": "LATEST",
  "messages": [
    {
      "content": [{"text": "Where is my order?"}],
      "role": "ROLE_USER"
    }
  ],
  "environment": "ENVIRONMENT_PROD"
}
```

### Response

```json
{
  "id": "string",
  "message": { "role": "ROLE_ASSISTANT", "content": [{"text": "response"}] },
  "system_fingerprint": "string",
  "usage": { "prompt_tokens": int, "completion_tokens": int, "total_tokens": int },
  "created": "timestamp",
  "rag_results": [ { "text": "chunk", "score": float, "collection_id": "string" } ]
}
```

### Curl Example

```bash
curl --location 'https://api.x.ai/v1/support-agent/chat' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_API_KEY' \
--data '{
    "support_agent_id": "support_agent_d5cdd745-0dc9-479c-9ff1-f14bee21e7ce",
    "conversation_id": "conv-uuid-67890",
    "deployment_id": "LATEST",
    "messages": [
        {
            "content": [{"text": "Where is my order?"}],
            "role": "ROLE_USER"
        }
    ],
    "environment": "ENVIRONMENT_PROD"
}'
```

## End-to-End Python Example

This example demonstrates a batch script integrating the xAI Support Agents API with Intercom. It polls open conversations from Intercom, processes each (via API calls and tool handling), and handles resolutions or escalations. Suitable for testing.

### Prerequisites

* **Install**: `pip install aiohttp intercom-python`.
* **Support Agent credentials**: API key from [console](https://console.x.ai/team/default/support-agents/api-keys), agent ID from [agents](https://console.x.ai/team/default/support-agents/agents).
* **Intercom setup**: App ID and API key from [Intercom dashboard](https://developers.intercom.com/installing-intercom/docs/intercom-api-keys).

### Configuration

Define your credentials and limits.

```pythonWithoutSDK
import asyncio
import json
import logging
from typing import List, Dict, Any

import aiohttp
from intercom.client import Client as IntercomClient  # pip install intercom-python

# Configuration (EDIT THESE with your values)
XAI_API_URL = "https://api.x.ai/v1/support-agent/chat"
XAI_API_KEY = "YOUR_XAI_API_KEY"
SUPPORT_AGENT_ID = "YOUR_SUPPORT_AGENT_ID"
DEPLOYMENT_ID = "LATEST"
ENVIRONMENT = "ENVIRONMENT_PROD"

INTERCOM_APP_ID = "YOUR_INTERCOM_APP_ID"
INTERCOM_API_KEY = "YOUR_INTERCOM_API_KEY"
MAX_TOOL_LOOPS = 5
MAX_CONVERSATIONS = 5  # Limit for batch processing

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

### Helper Functions

Implement message conversion, Intercom polling, and tool execution.

**Convert messages to Support Agent API format**:

```pythonWithoutSDK
def convert_to_agent_format(messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Convert to correct format."""
    output = []
    for msg in messages:
        role = msg.get("role", "").upper()
        content = msg.get("content", "")
        if isinstance(content, str):
            content = [{"text": content}]
        output.append({"role": f"ROLE_{role}", "content": content})
    return output
```

**Poll open conversations from Intercom**:

```pythonWithoutSDK
async def fetch_intercom_conversations(intercom: IntercomClient) -> List[Dict]:
    """Poll open conversations from Intercom."""
    try:
        conversations = intercom.conversations.list(open=True, per_page=10)
        return [conv.to_dict() for conv in conversations]
    except Exception as e:
        logger.error(f"Intercom fetch error: {e}")
        return []
```

**Define a tool handler** (customize based on your needs, e.g., USER\_INFO\_LOOKUP, CLOSE, ESCALATE):

```pythonWithoutSDK
async def execute_tool(function_name: str, arguments: Dict, intercom: IntercomClient, conversation_id: str, session: aiohttp.ClientSession) -> str:
    """Execute tool actions (customize as needed)."""
    if function_name == "USER_INFO_LOOKUP":
        # Placeholder: Replace with real DB query
        user_id = arguments.get("user_id", "")
        return json.dumps({"name": "John Doe", "status": "active", "user_id": user_id})
    elif function_name == "CLOSE":
        summary = arguments.get("resolution_summary", "")
        try:
            intercom.conversations.update(id=conversation_id, open=False)
            return f"Closed: {summary}"
        except Exception as e:
            return f"Failed to close: {e}"
    elif function_name == "ESCALATE":
        reason = arguments.get("reason", "[No reason provided]")
        priority = arguments.get("priority", "general")
        try:
            # Flag for human review
            intercom.conversations.update(
                id=conversation_id,
                tags={"add": [{"name": "escalate"}]}
            )
            # Add admin note
            intercom.admin_notes.create(
                conversation_id=conversation_id,
                body=f"AI Escalation: {reason} (priority: {priority}). Human review needed."
            )
            # Assign to human admin (EDIT: Set YOUR_DEFAULT_HUMAN_ADMIN_ID)
            intercom.conversations.update(
                id=conversation_id,
                admin_assignee_id="YOUR_DEFAULT_HUMAN_ADMIN_ID"
            )
            logger.info(f"ESCALATE {conversation_id}: {reason}")
            return f"Flagged for human review: {reason} (priority: {priority})"
        except Exception as e:
            logger.error(f"Escalation failed: {e}")
            return f"Escalation failed: {e}"
    return f"Unknown tool: {function_name}"
```

### Support Agent Message Loop

Process a single conversation: Call the Support Agent API, check for tool calls, execute tools, append results, and loop until resolution or max loops. If no tools, reply with the agent response.

```pythonWithoutSDK
async def process_message(session: aiohttp.ClientSession, intercom: IntercomClient, messages: List[Dict[str, Any]], conversation_id: str) -> Dict[str, Any]:
    """Process conversation: Call xAI API and handle tools."""
    xai_messages = convert_to_agent_format(messages)

    loop_count = 0
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {XAI_API_KEY}"}
    timeout = aiohttp.ClientTimeout(total=300)
    last_action = None

    while loop_count < MAX_TOOL_LOOPS:
        payload = {
            "support_agent_id": SUPPORT_AGENT_ID,
            "deployment_id": DEPLOYMENT_ID,
            "conversation_id": conversation_id,
            "messages": xai_messages,
            "environment": ENVIRONMENT
        }

        try:
            async with session.post(XAI_API_URL, json=payload, headers=headers, timeout=timeout) as resp:
                if resp.status != 200:
                    error = await resp.json()
                    return {"error": f"API failed: {error}"}
                response = await resp.json()
        except Exception as e:
            return {"error": str(e)}

        # Parse response
        agent_msg = response.get("message", {})
        content = agent_msg.get("content")
        response_text = content if isinstance(content, str) else (content[0].get("text", "") if content else "")
        tool_calls = agent_msg.get("tool_calls", [])

        should_close = False
        if not tool_calls and response_text:
            should_close = True
        elif last_action == "CLOSE":
            should_close = True

        if not tool_calls:
            logger.info(f"{conversation_id} complete: {response_text}")
            return {"final_response": response_text, "conversation_id": conversation_id, "full_response": response, "should_close": should_close}

        # Handle tools sequentially
        for tool_call in tool_calls:
            func_name = tool_call.get("function", {}).get("name", "")
            args = json.loads(tool_call.get("function", {}).get("arguments", "{}"))
            tool_result = await execute_tool(func_name, args, intercom, conversation_id, session)

            last_action = func_name

            # Append tool result
            xai_messages.append({
                "role": "ROLE_TOOL",
                "content": [{"text": tool_result}],
                "tool_call_id": tool_call.get("id")
            })

            # Break for end-state tools
            if func_name in ["CLOSE", "ESCALATE"]:
                break

        loop_count += 1

    should_close = (last_action == "CLOSE") or (not last_action and response_text)
    if loop_count >= MAX_TOOL_LOOPS:
        logger.warning(f"{conversation_id} max loops exceeded")
    return {"error": "Max tool loops" if loop_count >= MAX_TOOL_LOOPS else None, "conversation_id": conversation_id, "should_close": should_close}
```

### Main Processing Example

Try fetching conversations from Intercom, process each, and update Intercom (close and tag tickets).

```pythonWithoutSDK
async def main():
    """Batch process recent conversations."""
    intercom = IntercomClient(app_id=INTERCOM_APP_ID, api_key=INTERCOM_API_KEY)

    logger.info("Starting batch Support Agent processing...")
    async with aiohttp.ClientSession() as session:
        convos = await fetch_intercom_conversations(intercom)
        processed = 0
        for convo in convos[:MAX_CONVERSATIONS]:
            convo_id = convo.get("id")
            parts = convo.get('parts', [])
            messages = []
            for part in parts[-10:]:
                author_type = part.get('author', {}).get('type', 'unknown')
                body = part.get('body', '') or part.get('plain', {}).get('body', {}).get('text', '')
                if body:
                    role = 'user' if author_type == 'user' else 'assistant'
                    messages.append({"role": role, "content": body})

            if not messages:
                continue

            result = await process_message(session, intercom, messages, str(convo_id))
            logger.info(f"Processed {convo_id}: {result.get('final_response', result.get('error'))}")

            # Update Intercom based on outcome
            try:
                if result.get("should_close", False):
                    intercom.conversations.update(id=convo_id, open=False)
                    logger.info(f"Closed {convo_id} after resolution")
                else:
                    intercom.conversations.update(
                        id=convo_id,
                        tags={"add": [{"name": "ai_processed"}]}
                    )
                    logger.info(f"Flagged {convo_id} as AI-processed (kept open)")
            except Exception as e:
                logger.error(f"Failed to update {convo_id}: {e}")

            processed += 1

        logger.info(f"Batch complete: Processed {processed} conversations")

if __name__ == "__main__":
    asyncio.run(main())
```

**Customization Notes**:

* **Tools**: Expand `execute_tool` (e.g., real user lookup, custom escalations).
* **Batch Size**: Adjust `MAX_CONVERSATIONS` for more/fewer items per run.

## Chat Streaming

Same request as non-streaming, but POST to `/v1/support-agent/chat-stream`. Response streams deltas (like `/v1/chat/completions` streaming).

&#x20;Streaming is ideal for real-time chat UIs.


