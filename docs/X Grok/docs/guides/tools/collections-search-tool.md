#### Guides

# Collections Search Tool

The collections search tool enables Grok to search through your uploaded knowledge bases (collections), allowing it to retrieve relevant information from your documents to provide more accurate and contextually relevant responses. This tool is particularly powerful for analyzing complex documents like financial reports, legal contracts, or technical documentation, where Grok can autonomously search through multiple documents and synthesize information to answer sophisticated analytical questions.

For an introduction to Collections, please check out the [Collections documentation](/docs/key-information/collections).

**xAI Python SDK Users**: Version 1.4.0 of the xai-sdk package is required to use this collections-search tool in the agentic tool calling API.

## Key Capabilities

* **Document Retrieval**: Search across uploaded files and collections to find relevant information
* **Semantic Search**: Find documents based on meaning and context, not just keywords
* **Knowledge Base Integration**: Seamlessly integrate your proprietary data with Grok's reasoning
* **RAG Applications**: Power retrieval-augmented generation workflows
* **Multi-format Support**: Search across PDFs, text files, CSVs, and other supported formats

## When to Use Collections Search

The collections search tool is particularly valuable for:

* **Enterprise Knowledge Bases**: When you need Grok to reference internal documents and policies
* **Financial Analysis**: Analyzing SEC filings, earnings reports, and financial statements across multiple documents
* **Customer Support**: Building chatbots that can answer questions based on your product documentation
* **Research & Due Diligence**: Synthesizing information from academic papers, technical reports, or industry analyses
* **Compliance & Legal**: Ensuring responses are grounded in your official guidelines and regulations
* **Personal Knowledge Management**: Organizing and querying your personal document collections

## SDK Support

The collections search tool is available across multiple SDKs and APIs with different naming conventions:

| SDK/API | Tool Name | Description |
|---------|-----------|-------------|
| xAI SDK | `collections_search` | Native xAI SDK implementation |
| OpenAI Responses API | `file_search` | Compatible with OpenAI's API format |

## Implementation Example

### End-to-End Financial Analysis Example

This comprehensive example demonstrates analyzing Tesla's SEC filings using the collections search tool. It covers:

1. Creating a collection for document storage
2. Uploading multiple financial documents concurrently (10-Q and 10-K filings)
3. Using Grok with collections search to analyze and synthesize information across documents in an agentic manner
4. Enabling code execution to allow the model to perform calculations and mathematical analysis effectively should it be needed.
5. Receiving cited responses and tool usage information

This pattern is applicable to any document analysis workflow where you need to search through and reason over multiple documents.

```pythonXAI
import asyncio
import os

import httpx

from xai_sdk import AsyncClient
from xai_sdk.chat import user
from xai_sdk.proto import collections_pb2
from xai_sdk.tools import code_execution, collections_search

TESLA_10_Q_PDF_URL = "https://ir.tesla.com/_flysystem/s3/sec/000162828025045968/tsla-20250930-gen.pdf"
TESLA_10_K_PDF_URL = "https://ir.tesla.com/_flysystem/s3/sec/000162828025003063/tsla-20241231-gen.pdf"


async def main():
    client = AsyncClient(api_key=os.getenv("XAI_API_KEY"))

    # Step 1: Create a collection for Tesla SEC filings
    response = await client.collections.create("tesla-sec-filings")
    print(f"Created collection: {response.collection_id}")

    # Step 2: Upload documents to the collection concurrently
    async def upload_document(
        url: str, name: str, collection_id: str, http_client: httpx.AsyncClient
    ) -> None:
        pdf_response = await http_client.get(url, timeout=30.0)
        pdf_content = pdf_response.content

        print(f"Uploading {name} document to collection")
        response = await client.collections.upload_document(
            collection_id=collection_id,
            name=name,
            data=pdf_content,
            content_type="application/pdf",
        )

        # Poll until document is processed and ready for search
        response = await client.collections.get_document(response.file_metadata.file_id, collection_id)
        print(f"Waiting for document {name} to be processed")
        while response.status != collections_pb2.DOCUMENT_STATUS_PROCESSED:
            await asyncio.sleep(3)
            response = await client.collections.get_document(response.file_metadata.file_id, collection_id)

        print(f"Document {name} processed")

    # Upload both documents concurrently
    async with httpx.AsyncClient() as http_client:
        await asyncio.gather(
            upload_document(TESLA_10_Q_PDF_URL, "tesla-10-Q-2024.pdf", response.collection_id, http_client),
            upload_document(TESLA_10_K_PDF_URL, "tesla-10-K-2024.pdf", response.collection_id, http_client),
        )

    # Step 3: Create a chat with collections search enabled
    chat = client.chat.create(
        model="grok-4-1-fast",  # Use a reasoning model for better analysis
        tools=[
            collections_search(
                collection_ids=[response.collection_id],
            ),
            code_execution(),
        ],
    )

    # Step 4: Ask a complex analytical question that requires searching multiple documents
    chat.append(
        user(
            "How many consumer vehicles did Tesla produce in total in 2024 and 2025? "
            "Show your working and cite your sources."
        )
    )

    # Step 5: Stream the response and display reasoning progress
    is_thinking = True
    async for response, chunk in chat.stream():
        # View server-side tool calls as they happen
        for tool_call in chunk.tool_calls:
            print(f"\\nCalling tool: {tool_call.function.name} with arguments: {tool_call.function.arguments}")
        if response.usage.reasoning_tokens and is_thinking:
            print(f"\\rThinking... ({response.usage.reasoning_tokens} tokens)", end="", flush=True)
        if chunk.content and is_thinking:
            print("\\n\\nFinal Response:")
            is_thinking = False
        if chunk.content and not is_thinking:
            print(chunk.content, end="", flush=True)
        latest_response = response

    # Step 6: Review citations and tool usage
    print("\\n\\nCitations:")
    print(latest_response.citations)
    print("\\n\\nUsage:")
    print(latest_response.usage)
    print(latest_response.server_side_tool_usage)
    print("\\n\\nTool Calls:")
    print(latest_response.tool_calls)


if __name__ == "__main__":
    asyncio.run(main())
```

```pythonOpenAISDK
import os
from openai import OpenAI

# Using OpenAI SDK with xAI API (requires pre-created collection)
api_key = os.getenv("XAI_API_KEY")
client = OpenAI(
    api_key=api_key,
    base_url="https://api.x.ai/v1",
)

# Note: You must create the collection and upload documents first using either the xAI console (console.x.ai) or the xAI SDK
# The collection_id below should be replaced with your actual collection ID
response = client.responses.create(
    model="grok-4-1-fast",
    input=[
        {
            "role": "user",
            "content": "How many consumer vehicles did Tesla produce in total in 2024 and 2025? Show your working and cite your sources.",
        },
    ],
    tools=[
        {
            "type": "file_search",
            "vector_store_ids": ["your_collection_id_here"],  # Replace with actual collection ID
            "max_num_results": 10
        },
        {"type": "code_interpreter"},  # Enable code execution for calculations
    ],
)

print(response)
```

```pythonRequests
import os
import requests

# Using raw requests (requires pre-created collection)
url = "https://api.x.ai/v1/responses"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"
}
payload = {
    "model": "grok-4-1-fast",
    "input": [
        {
            "role": "user",
            "content": "How many consumer vehicles did Tesla produce in total in 2024 and 2025? Show your working and cite your sources."
        }
    ],
    "tools": [
        {
            "type": "file_search",
            "vector_store_ids": ["your_collection_id_here"],  # Replace with actual collection ID
            "max_num_results": 10,
        },
        {"type": "code_interpreter"}  # Enable code execution for calculations
    ]
}
response = requests.post(url, headers=headers, json=payload)
print(response.json())
```

```bash
# Using curl (requires pre-created collection)
curl https://api.x.ai/v1/responses \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $XAI_API_KEY" \\
  -d '{
  "model": "grok-4-1-fast",
  "input": [
    {
      "role": "user",
      "content": "How many consumer vehicles did Tesla produce in total in 2024 and 2025? Show your working and cite your sources."
    }
  ],
  "tools": [
    {
      "type": "file_search",
      "vector_store_ids": ["your_collection_id_here"],
      "max_num_results": 10
    },
    {
      "type": "code_interpreter"
    }
  ]
}'
```

## Example Output

When you run the Python xAI SDK example above, you'll see output like this showing the complete workflow from collection creation to the final analyzed response:

```output
Created collection: collection_3be0eec8-ee8e-4a18-a9d4-fb70a3150d64
Uploading tesla-10-K-2024.pdf document to collection
Uploading tesla-10-Q-2024.pdf document to collection
Waiting for document tesla-10-K-2024.pdf to be processed
Waiting for document tesla-10-Q-2024.pdf to be processed
Document tesla-10-Q-2024.pdf processed
Document tesla-10-K-2024.pdf processed

Thinking... (199 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla total vehicle production 2024","limit":10}
Thinking... (370 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla total vehicles produced 2024","limit":5}
Thinking... (370 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla vehicles produced 2025 Q1 Q2 Q3","limit":5}
Thinking... (477 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla production and deliveries 2024 all quarters","limit":10}
Thinking... (477 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla production and deliveries 2025 Q1 Q2 Q3","limit":10}
Thinking... (569 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla total production 2024 full year consumer vehicles","limit":5}
Thinking... (776 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla annual vehicle production 2024 total","limit":5}
Thinking... (1148 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla Q4 2024 production and deliveries","limit":5}
Thinking... (1240 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla Q1 2024 vehicle production","limit":3}
Thinking... (1240 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla Q2 2024 vehicle production","limit":3}
Thinking... (1240 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla Q3 2024 vehicle production","limit":3}
Thinking... (1240 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla Q4 2024 vehicle production","limit":3}
Thinking... (2804 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla vehicle production nine months 2024","limit":5}
Thinking... (3352 tokens)

Final Response:
### Working

To answer this question, I used the collections_search tool to query Tesla's official 
financial filings (10-K and 10-Q reports) for production numbers. Tesla reports vehicle 
production and deliveries quarterly, and consumer vehicles refer to passenger vehicles 
like Model 3, Model Y, Model S, Model X, and Cybertruck (excluding Tesla Semi or other 
non-consumer products).

#### Step 1: 2024 Production
Based on Tesla's official quarterly production and delivery reports (aggregated from SEC 
filings and press releases referenced in the collections), Tesla produced **1,773,443 
consumer vehicles in 2024**.
  - Q1 2024: 433,371 produced
  - Q2 2024: 410,831 produced
  - Q3 2024: 469,796 produced
  - Q4 2024: 459,445 produced

#### Step 2: 2025 Production
The Q3 2025 10-Q filing explicitly states: "In 2025, we produced approximately 1,220,000 
consumer vehicles [...] through the third quarter."
  - This is the sum of Q1, Q2, and Q3 2025 production
  - Q4 2025 data is not available as of November 13, 2025

#### Step 3: Total for 2024 and 2025
- 2024 full year: 1,773,443
- 2025 (through Q3): 1,220,000
- **Total: 2,993,443 consumer vehicles**

Citations:
['collections://collection_3be0eec8-ee8e-4a18-a9d4-fb70a3150d64/files/file_d4d1a968-9037-4caa-8eca-47a1563f28ab', 
 'collections://collection_3be0eec8-ee8e-4a18-a9d4-fb70a3150d64/files/file_ff41a42e-6cdc-4ca1-918a-160644d52704']

Usage:
completion_tokens: 1306
prompt_tokens: 383265
total_tokens: 387923
prompt_text_tokens: 383265
reasoning_tokens: 3352
cached_prompt_text_tokens: 177518

{'SERVER_SIDE_TOOL_COLLECTIONS_SEARCH': 13}


Tool Calls:
... (omitted for brevity)
```

### Understanding Collections Citations

When using the collections search tool, citations follow a special URI format that uniquely identifies the source documents:

```
collections://collection_id/files/file_id
```

For example:

```
collections://collection_3be0eec8-ee8e-4a18-a9d4-fb70a3150d64/files/file_d4d1a968-9037-4caa-8eca-47a1563f28ab
```

**Format Breakdown:**

* **`collections://`**: Protocol identifier indicating this is a collection-based citation
* **`collection_id`**: The unique identifier of the collection that was searched (e.g., `collection_3be0eec8-ee8e-4a18-a9d4-fb70a3150d64`)
* **`files/`**: Path segment indicating file-level reference
* **`file_id`**: The unique identifier of the specific document file that was referenced (e.g., `file_d4d1a968-9037-4caa-8eca-47a1563f28ab`)

These citations represent all the documents from your collections that Grok referenced during its search and analysis. Each citation points to a specific file within a collection, allowing you to trace back exactly which uploaded documents contributed to the final response.

### Key Observations

1. **Autonomous Search Strategy**: Grok autonomously performs 13 different searches across the documents, progressively refining queries to find specific quarterly and annual production data.

2. **Reasoning Process**: The output shows reasoning tokens accumulating (199 → 3,352 tokens), demonstrating how the model thinks through the problem before generating the final response.

3. **Cited Sources**: All information is grounded in the uploaded documents with specific file citations, ensuring transparency and verifiability.

4. **Structured Analysis**: The final response breaks down the methodology, shows calculations, and clearly states assumptions and limitations (e.g., Q4 2025 data not yet available).

5. **Token Efficiency**: Notice the high number of cached prompt tokens (177,518) - this demonstrates how the collections search tool efficiently reuses context across multiple queries.

## Combining Collections Search with Web Search/X-Search

One of the most powerful patterns is combining the collections search tool with web search/x-search to answer questions that require both your internal knowledge base and real-time external information. This enables sophisticated analysis that grounds responses in your proprietary data while incorporating current market intelligence, news, and public sentiment.

### Example: Internal Data + Market Intelligence

Building on the Tesla example above, let's analyze how market analysts view Tesla's performance based on the production numbers from our internal documents:

```pythonXAI
import asyncio

import httpx

from xai_sdk import AsyncClient
from xai_sdk.chat import user
from xai_sdk.proto import collections_pb2
from xai_sdk.tools import code_execution, collections_search, web_search, x_search

# ... (collection creation and document upload same as before)

async def hybrid_analysis(client: AsyncClient, collection_id: str, model: str) -> None:
    # Enable collections search, web search, and code execution
    chat = client.chat.create(
        model=model,
        tools=[
            collections_search(
                collection_ids=[collection_id],
            ),
            web_search(),  # Enable web search for external data
            x_search(),  # Enable x-search for external data
            code_execution(),  # Enable code execution for calculations
        ],
    )

    # Ask a question that requires both internal and external information
    chat.append(
        user(
            "Based on Tesla's actual production figures in my documents (collection), what is the "
            "current market and analyst sentiment on their 2024-2025 vehicle production performance?"
        )
    )

    is_thinking = True
    async for response, chunk in chat.stream():
        for tool_call in chunk.tool_calls:
            print(f"\\nCalling tool: {tool_call.function.name} with arguments: {tool_call.function.arguments}")
        if response.usage.reasoning_tokens and is_thinking:
            print(f"\\rThinking... ({response.usage.reasoning_tokens} tokens)", end="", flush=True)
        if chunk.content and is_thinking:
            print("\\n\\nFinal Response:")
            is_thinking = False
        if chunk.content and not is_thinking:
            print(chunk.content, end="", flush=True)
        latest_response = response

    print("\\n\\nCitations:")
    print(latest_response.citations)
    print("\\n\\nTool Usage:")
    print(latest_response.server_side_tool_usage)
```

### How It Works

When you provide both `collections_search()` and `web_search()`/`x_search()` tools, Grok autonomously determines the optimal search strategy:

1. **Internal Analysis First**: Searches your uploaded Tesla SEC filings to extract actual production numbers
2. **External Context Gathering**: Performs web/x-search searches to find analyst reports, market sentiment, and production expectations
3. **Synthesis**: Combines both data sources to provide a comprehensive analysis comparing actual performance against market expectations
4. **Cited Sources**: Returns citations from both your internal documents (using `collections://` URIs) and external web sources (using `https://` URLs)

### Example Output Pattern

```output
Thinking... (201 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla vehicle production figures 2024 2025","limit":20}
Thinking... (498 tokens)
Calling tool: collections_search with arguments: {"query":"Tesla quarterly vehicle production and deliveries 2024 2025","limit":20}
Thinking... (738 tokens)
Calling tool: web_search with arguments: {"query":"Tesla quarterly vehicle production and deliveries 2024 2025","num_results":10}
Thinking... (738 tokens)
Calling tool: web_search with arguments: {"query":"market and analyst sentiment Tesla vehicle production performance 2024 2025","num_results":10}
Thinking... (1280 tokens)

Final Response 
... (omitted for brevity)
```

### Use Cases for Hybrid Search

This pattern is valuable for:

* **Market Analysis**: Compare internal financial data with external market sentiment and competitor performance
* **Competitive Intelligence**: Analyze your product performance against industry reports and competitor announcements
* **Compliance Verification**: Cross-reference internal policies with current regulatory requirements and industry standards
* **Strategic Planning**: Ground business decisions in both proprietary data and real-time market conditions
* **Customer Research**: Combine internal customer data with external reviews, social sentiment, and market trends


