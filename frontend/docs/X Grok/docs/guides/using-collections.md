#### Guides

# Using Collections

In this guide, we will walk through the basics of:

* Creating a `collection`
* Adding a `document` to the `collection`
* Searching for relevant `documents` within the `collection`
* Deleting `documents` and `collections`

For an overview of what Collections is, please see [Collections](../key-information/collections).

You can upload a maximum of 100,000 files per collection.

## Creating a new collection

You can create a `collection` in the [xAI Console](https://console.x.ai) and navigate to the **Collections** tab. Make sure you are in the correct team.

Click on "Create new collection" to create a new `collection`.

You can choose to enable generate embeddings on document upload or not. We recommend leaving the generate embeddings setting to on.

Alternatively, you can create the collection with code:

```pythonXAI
import os
from xai_sdk import Client
client = Client(
    api_key=os.getenv("XAI_API_KEY"),
    management_api_key=os.getenv("XAI_MANAGEMENT_API_KEY"),
    timeout=3600, # Override default timeout with longer timeout for reasoning models
)

collection = client.collections.create(
    name="SEC Filings", # You can optionally add in model_name and/or chunk_configuration
)

print(collection)
```

```bash
curl https://management-api.x.ai/v1/collections \\
  -X POST \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $XAI_MANAGEMENT_API_KEY" \\
  -d '{"collection_name": "SEC Filings"}'
```

## List available Collections

After adding a new collection, we can either see it in xAI Console, or list it via an API request. This example lists all collections available in the team.

```pythonXAI
# ... Create client
collections = client.collections.list()
print(collections)
```

```bash
curl https://management-api.x.ai/v1/collections \\
  -H "Authorization: Bearer $XAI_MANAGEMENT_API_KEY"
```

## View and update the configuration of a Collection

You can view and edit the Collection's configuration by clicking on Edit Collection.

This opens up the following modal where you can view the configuration and make changes.

To view the collection's configuration with code:

```pythonXAI
# ... Create client
collection = client.collections.get("collection_dbc087b1-6c99-493d-86c6-b401fee34a9d")

print(collection)
```

```bash
curl https://management-api.x.ai/v1/collections/collection_dbc087b1-6c99-493d-86c6-b401fee34a9d \\
  -H "Authorization: Bearer $XAI_MANAGEMENT_API_KEY"
```

To update the collection's configuration:

```pythonXAI
# ... Create client
collection = client.collections.update(
    "collection_dbc087b1-6c99-493d-86c6-b401fee34a9d",
    name="SEC Filings (New)"
)

print(collection)
```

```bash
curl https://management-api.x.ai/v1/collections/collection_dbc087b1-6c99-493d-86c6-b401fee34a9d \\
  -X PUT \\
  -H "Authorization: Bearer $XAI_MANAGEMENT_API_KEY" \\
  -d '{"collection_name": "SEC Filings (New)"}'
```

## Adding a document to the collection in xAI Console

Once you have created the new `collection`. You can click on it in the collections table to view the `documents` included in the `collection`.

Click on "Upload document" to upload a new `document`.

Once the upload has completed, each document is given a File ID. You can view the File ID, Collection ID and hash of the
`document` by clicking on the `document` in the documents table.

You can also upload documents via code:

```pythonXAI
# ... Create client
with open("tesla-20241231.html", "rb") as file:
    file_data = file.read()

document = client.collections.upload_document(
    collection_id="collection_dbc087b1-6c99-493d-86c6-b401fee34a9d", # The collection ID of the collection we want to upload to
    name="tesla-20241231.html", # The name that you want to use
    data=file_data, # The data payload
    content_type="text/html",
)
print(document)
```

## Searching for relevant documents within the collection

To search for relevant `documents` within one or multiple `collections`, obtain the Collection ID(s) of the collections that you want to search within first. Then, you can follow this example:

```pythonXAI
# ... Create client
response = client.collections.search(
    query="What were the key revenue drivers based on the SEC filings?",
    collection_ids=["collection_dbc087b1-6c99-493d-86c6-b401fee34a9d"],
)
print(response)
```

```bash
curl https://api.x.ai/v1/documents/search \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $XAI_API_KEY" \\
  -d '{
      "query": "What were the key revenue drivers based on the SEC filings?",
      "source": {
          "collection_ids": [
              "collection_dbc087b1-6c99-493d-86c6-b401fee34a9d"
          ]
      }
}'
```

There are three search methods available:

* **Keyword search**
* **Semantic search**
* **Hybrid search** (combines both keyword and semantic methods)

By default, the system uses **hybrid search**, which generally delivers the best and most comprehensive results.

### Comparison of search modes

| Mode      | Description                                                                 | Best for                                      | Drawbacks                  |
|-----------|-----------------------------------------------------------------------------|-----------------------------------------------|----------------------------|
| **Keyword**   | Searches for exact matches of specified words, phrases, or numbers         | Precise terms (e.g., account numbers, dates, specific financial figures) | May miss contextually relevant content |
| **Semantic**  | Understands meaning and context to find conceptually related content       | Discovering general ideas, topics, or intent even when exact words differ | Less precise for specific terms |
| **Hybrid**    | Combines keyword and semantic search for broader and more accurate results | Most real-world use cases                     | Slightly higher latency    |

The hybrid approach balances precision and recall, making it the recommended default for the majority of queries.

An example to set hybrid mode:

```bash
curl https://api.x.ai/v1/documents/search \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $XAI_API_KEY" \\
  -d '{
      "query": "What were the key revenue drivers based on the SEC filings?",
      "source": {
          "collection_ids": [
              "collection_dbc087b1-6c99-493d-86c6-b401fee34a9d"
          ]
      },
      "retrieval_mode": {"type": "hybrid"}
}'
```

You can set `"retrieval_mode": {"type": "keyword"}` for keyword search and `"retrieval_mode": {"type": "semantic"}` for semantic search.

## Deleting documents and collections

You can delete the `documents` and `collections` on [xAI Console](https://console.x.ai) by clicking on the more button
on the right side of the collections or documents table.

To remove a document via code:

```pythonXAI
# ... Create client

client.collections.remove_document(
    collection_id="collection_dbc087b1-6c99-493d-86c6-b401fee34a9d",
    file_id="file_55a709d4-8edc-4f83-84d9-9f04fe49f832",
)
```

```bash
curl https://management-api.x.ai/v1/collections/collection_dbc087b1-6c99-493d-86c6-b401fee34a9d/documents/file_55a709d4-8edc-4f83-84d9-9f04fe49f832 \\
  -X DELETE \\
  -H "Authorization: Bearer $XAI_MANAGEMENT_API_KEY"
```

To remove the collection:

```pythonXAI
# ... Create client

client.collections.delete(collection_id="collection_dbc087b1-6c99-493d-86c6-b401fee34a9d")
```

```bash
curl https://management-api.x.ai/v1/collections/collection_dbc087b1-6c99-493d-86c6-b401fee34a9d \\
  -X DELETE \\
  -H "Authorization: Bearer $XAI_MANAGEMENT_API_KEY"
```


