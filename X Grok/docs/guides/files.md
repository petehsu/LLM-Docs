#### Guides

# Files

The Files API enables you to upload documents and use them in chat conversations with Grok. When you attach files to a chat message, the system automatically activates the `document_search` tool, transforming your request into an agentic workflow where Grok can intelligently search through and reason over your documents to answer questions.

You can view more information at [Files API Reference](/docs/files-api).

**xAI Python SDK Users**: Version 1.4.0 of the xai-sdk package is required to use the Files API.

## How Files Work with Chat

Behind the scenes, when you attach files to a chat message, the xAI API implicitly adds the `document_search` server-side tool to your request. This means:

1. **Automatic Agentic Behavior**: Your chat request becomes an agentic request, where Grok autonomously searches through your documents
2. **Intelligent Document Analysis**: The model can reason over document content, extract relevant information, and synthesize answers
3. **Multi-Document Support**: You can attach multiple files, and Grok will search across all of them

This seamless integration allows you to simply attach files and ask questions—the complexity of document search and retrieval is handled automatically by the agentic workflow.

## Understanding Document Search

When you attach files to a chat message, the xAI API automatically activates the `document_search` [server-side tool](/docs/guides/tools/overview). This transforms your request into an [agentic workflow](/docs/guides/tools/overview#agentic-tool-calling) where Grok:

1. **Analyzes your query** to understand what information you're seeking
2. **Searches the documents** intelligently, finding relevant sections across all attached files
3. **Extracts and synthesizes information** from multiple sources if needed
4. **Provides a comprehensive answer** with the context from your documents

### Agentic Workflow

Just like other agentic tools (web search, X search, code execution), document search operates autonomously:

* **Multiple searches**: The model may search documents multiple times with different queries to find comprehensive information
* **Reasoning**: The model uses its reasoning capabilities to decide what to search for and how to interpret the results
* **Streaming visibility**: In streaming mode, you can see when the model is searching your documents via tool call notifications

### Token Usage with Files

File-based chats follow similar token patterns to other agentic requests:

* **Prompt tokens**: Include the conversation history and internal processing. Document content is processed efficiently
* **Reasoning tokens**: Used for planning searches and analyzing document content
* **Completion tokens**: The final answer text
* **Cached tokens**: Repeated document content benefits from prompt caching for efficiency

The actual document content is processed by the server-side tool and doesn't directly appear in the message history, keeping token usage optimized.

### Pricing

Document search is billed at **$10 per 1,000 tool invocations**, in addition to standard token costs. Each time the model searches your documents, it counts as one tool invocation. For complete pricing details, see the [Models and Pricing](/docs/models#tools-pricing) page.

## Getting Started

To use files with Grok, you'll need to:

1. **[Upload and manage files](/docs/guides/files/managing-files)** - Learn how to upload, list, retrieve, and delete files using the Files API
2. **[Chat with files](/docs/guides/files/chat-with-files)** - Discover how to attach files to chat messages and ask questions about your documents

## Quick Example

Here's a quick example of the complete workflow:

```pythonXAI
import os
from xai_sdk import Client
from xai_sdk.chat import user, file

client = Client(api_key=os.getenv("XAI_API_KEY"))

# 1. Upload a document
document_content = b"""Quarterly Sales Report - Q4 2024
Total Revenue: $5.2M
Growth: +18% YoY
"""

uploaded_file = client.files.upload(document_content, filename="sales.txt")

# 2. Chat with the file
chat = client.chat.create(model="grok-4-fast")
chat.append(user("What was the total revenue?", file(uploaded_file.id)))

# 3. Get the answer
response = chat.sample()
print(response.content)  # "The total revenue was $5.2M"

# 4. Clean up
client.files.delete(uploaded_file.id)
```

## Key Features

### Multiple File Support

Attach [multiple documents](/docs/guides/files/chat-with-files#multiple-file-attachments) to a single query and Grok will search across all of them to find relevant information.

### Multi-Turn Conversations

File context persists across [conversation turns](/docs/guides/files/chat-with-files#multi-turn-conversations-with-files), allowing you to ask follow-up questions without re-attaching files.

### Code Execution Integration

Combine files with the [code execution tool](/docs/guides/files/chat-with-files#combining-files-with-code-execution) to perform advanced data analysis, statistical computations, and transformations on your uploaded data. The model can write and execute Python code that processes your files directly.

## Limitations

* **File size**: Maximum 48 MB per file
* **No batch requests**: File attachments with document search are agentic requests and do not support batch mode (`n > 1`)
* **Agentic models only**: Requires models that support agentic tool calling (e.g., `grok-4-fast`, `grok-4`)
* **Supported file formats**:
  * Plain text files (.txt)
  * Markdown files (.md)
  * Code files (.py, .js, .java, etc.)
  * CSV files (.csv)
  * JSON files (.json)
  * PDF documents (.pdf)
  * And many other text-based formats

## Next Steps


