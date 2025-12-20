#### Guides

# Managing Files

The Files API provides a complete set of operations for managing your files. Before using files in chat conversations, you need to upload them using one of the methods described below.

**xAI Python SDK Users**: Version 1.4.0 of the xai-sdk package is required to use the Files API.

## Uploading Files

You can upload files in several ways: from a file path, raw bytes, BytesIO object, or an open file handle.

### Upload from File Path

```pythonXAI
import os
from xai_sdk import Client

client = Client(api_key=os.getenv("XAI_API_KEY"))

# Upload a file from disk
file = client.files.upload("/path/to/your/document.pdf")

print(f"File ID: {file.id}")
print(f"Filename: {file.filename}")
print(f"Size: {file.size} bytes")
print(f"Created at: {file.created_at}")
```

```pythonOpenAISDK
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
)

# Upload a file
with open("/path/to/your/document.pdf", "rb") as f:
    file = client.files.create(
        file=f,
        purpose="assistants"
    )

print(f"File ID: {file.id}")
print(f"Filename: {file.filename}")
```

```pythonRequests
import os
import requests

url = "https://api.x.ai/v1/files"
headers = {
    "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"
}

with open("/path/to/your/document.pdf", "rb") as f:
    files = {"file": f}
    data = {"purpose": "assistants"}
    response = requests.post(url, headers=headers, files=files, data=data)

file_data = response.json()
print(f"File ID: {file_data['id']}")
print(f"Filename: {file_data['filename']}")
```

```bash
curl https://api.x.ai/v1/files \\
  -H "Authorization: Bearer $XAI_API_KEY" \\
  -F file=@/path/to/your/document.pdf \\
  -F purpose=assistants
```

### Upload from Bytes

```pythonXAI
import os
from xai_sdk import Client

client = Client(api_key=os.getenv("XAI_API_KEY"))

# Upload file content directly from bytes
content = b"This is my document content.\\nIt can span multiple lines."
file = client.files.upload(content, filename="document.txt")

print(f"File ID: {file.id}")
print(f"Filename: {file.filename}")
```

### Upload from file object

```pythonXAI
import os
from xai_sdk import Client

client = Client(api_key=os.getenv("XAI_API_KEY"))

# Upload a file directly from disk
file = client.files.upload(open("document.pdf", "rb"), filename="document.pdf")

print(f"File ID: {file.id}")
print(f"Filename: {file.filename}")
```

## Upload with Progress Tracking

Track upload progress for large files using callbacks or progress bars.

### Custom Progress Callback

```pythonXAI
import os
from xai_sdk import Client

client = Client(api_key=os.getenv("XAI_API_KEY"))

# Define a custom progress callback
def progress_callback(bytes_uploaded: int, total_bytes: int):
    percentage = (bytes_uploaded / total_bytes) * 100 if total_bytes else 0
    mb_uploaded = bytes_uploaded / (1024 * 1024)
    mb_total = total_bytes / (1024 * 1024)
    print(f"Progress: {mb_uploaded:.2f}/{mb_total:.2f} MB ({percentage:.1f}%)")

# Upload with progress tracking
file = client.files.upload(
    "/path/to/large-file.pdf",
    on_progress=progress_callback
)

print(f"Successfully uploaded: {file.filename}")
```

### Progress Bar with tqdm

```pythonXAI
import os
from xai_sdk import Client
from tqdm import tqdm

client = Client(api_key=os.getenv("XAI_API_KEY"))

file_path = "/path/to/large-file.pdf"
total_bytes = os.path.getsize(file_path)

# Upload with tqdm progress bar
with tqdm(total=total_bytes, unit="B", unit_scale=True, desc="Uploading") as pbar:
    file = client.files.upload(
        file_path,
        on_progress=pbar.update
    )

print(f"Successfully uploaded: {file.filename}")
```

## Listing Files

Retrieve a list of your uploaded files with pagination and sorting options.

### Available Options

* **`limit`**: Maximum number of files to return. If not specified, uses server default of 100.
* **`order`**: Sort order for the files. Either `"asc"` (ascending) or `"desc"` (descending).
* **`sort_by`**: Field to sort by. Options: `"created_at"`, `"filename"`, or `"size"`.
* **`pagination_token`**: Token for fetching the next page of results.

```pythonXAI
import os
from xai_sdk import Client

client = Client(api_key=os.getenv("XAI_API_KEY"))

# List files with pagination and sorting
response = client.files.list(
    limit=10,
    order="desc",
    sort_by="created_at"
)

for file in response.data:
    print(f"File: {file.filename} (ID: {file.id}, Size: {file.size} bytes)")
```

```pythonOpenAISDK
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
)

# List files
files = client.files.list()

for file in files.data:
    print(f"File: {file.filename} (ID: {file.id})")
```

```pythonRequests
import os
import requests

url = "https://api.x.ai/v1/files"
headers = {
    "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"
}

response = requests.get(url, headers=headers)
files = response.json()

for file in files.get("data", []):
    print(f"File: {file['filename']} (ID: {file['id']})")
```

```bash
curl https://api.x.ai/v1/files \\
  -H "Authorization: Bearer $XAI_API_KEY"
```

## Getting File Metadata

Retrieve detailed information about a specific file.

```pythonXAI
import os
from xai_sdk import Client

client = Client(api_key=os.getenv("XAI_API_KEY"))

# Get file metadata by ID
file = client.files.get("file-abc123")

print(f"Filename: {file.filename}")
print(f"Size: {file.size} bytes")
print(f"Created: {file.created_at}")
print(f"Team ID: {file.team_id}")
```

```pythonOpenAISDK
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
)

# Get file metadata
file = client.files.retrieve("file-abc123")

print(f"Filename: {file.filename}")
print(f"Size: {file.bytes} bytes")
```

```pythonRequests
import os
import requests

file_id = "file-abc123"
url = f"https://api.x.ai/v1/files/{file_id}"
headers = {
    "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"
}

response = requests.get(url, headers=headers)
file = response.json()

print(f"Filename: {file['filename']}")
print(f"Size: {file['bytes']} bytes")
```

```bash
curl https://api.x.ai/v1/files/file-abc123 \\
  -H "Authorization: Bearer $XAI_API_KEY"
```

## Getting File Content

Download the actual content of a file.

```pythonXAI
import os
from xai_sdk import Client

client = Client(api_key=os.getenv("XAI_API_KEY"))

# Get file content
content = client.files.content("file-abc123")

# Content is returned as bytes
print(f"Content length: {len(content)} bytes")
print(f"Content preview: {content[:100]}")
```

```pythonOpenAISDK
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
)

# Get file content
content = client.files.content("file-abc123")

print(f"Content: {content.text}")
```

```pythonRequests
import os
import requests

file_id = "file-abc123"
url = f"https://api.x.ai/v1/files/{file_id}/content"
headers = {
    "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"
}

response = requests.get(url, headers=headers)
content = response.content

print(f"Content length: {len(content)} bytes")
```

```bash
curl https://api.x.ai/v1/files/file-abc123/content \\
  -H "Authorization: Bearer $XAI_API_KEY"
```

## Deleting Files

Remove files when they're no longer needed.

```pythonXAI
import os
from xai_sdk import Client

client = Client(api_key=os.getenv("XAI_API_KEY"))

# Delete a file
delete_response = client.files.delete("file-abc123")

print(f"Deleted: {delete_response.deleted}")
print(f"File ID: {delete_response.id}")
```

```pythonOpenAISDK
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
)

# Delete a file
delete_response = client.files.delete("file-abc123")

print(f"Deleted: {delete_response.deleted}")
print(f"File ID: {delete_response.id}")
```

```pythonRequests
import os
import requests

file_id = "file-abc123"
url = f"https://api.x.ai/v1/files/{file_id}"
headers = {
    "Authorization": f"Bearer {os.getenv('XAI_API_KEY')}"
}

response = requests.delete(url, headers=headers)
result = response.json()

print(f"Deleted: {result['deleted']}")
print(f"File ID: {result['id']}")
```

```bash
curl -X DELETE https://api.x.ai/v1/files/file-abc123 \\
  -H "Authorization: Bearer $XAI_API_KEY"
```

## Limitations and Considerations

### File Size Limits

* **Maximum file size**: 48 MB per file
* **Processing time**: Larger files may take longer to process

### File Retention

* **Cleanup**: Delete files when no longer needed to manage storage
* **Access**: Files are scoped to your team/organization

### Supported Formats

While many text-based formats are supported, the system works best with:

* Structured documents (with clear sections, headings)
* Plain text and markdown
* Documents with clear information hierarchy

Supported file types include:

* Plain text files (.txt)
* Markdown files (.md)
* Code files (.py, .js, .java, etc.)
* CSV files (.csv)
* JSON files (.json)
* PDF documents (.pdf)
* And many other text-based formats

## Next Steps

Now that you know how to manage files, learn how to use them in chat conversations:


