#### Key Information

# Collections

Collections offers xAI API users a robust set of tools and methods to seamlessly integrate their enterprise requirements and internal knowledge bases with the xAI API. This feature enables efficient management, retrieval, and utilization of documents to enhance AI-driven workflows and applications.

There are two entities that users can create within the Collections service:

* `file`
  * A `file` is a single entity of a user-uploaded file.
* `collection`
  * A `collection` is a group of `files` linked together, with an embedding index for efficient retrieval of each `file`.
  * When you create a `collection` you have the option to automatically generate embeddings for any files uploaded to that `collection`. You can then perform semantic search across files in multiple `collections`.
  * A single `file` can belong to multiple `collections` but must be part of at least one `collection`.

## File storage and retrieval

Visit the **Collections** tab on the [xAI Console](https://console.x.ai) to create a new `collection`. Once created, you can add `files` to the `collection`. You can also add
`files` without adding them to a `collection` using our [Files API](/docs/guides/files/managing-files).

All your `collections` and their associated `files` can be viewed in the **Collections** tab.

Your `files` and their embedding index are securely encrypted and stored on our servers. The index enables efficient retrieval of `files` during a relevance search.

## Usage limits

Users can upload a maximum of 100,000 files per collection. We do not place any limits on the file size, etc.

## Data Privacy

We do not use user data stored on Collections for model training purposes by default, unless the user has given consent.


