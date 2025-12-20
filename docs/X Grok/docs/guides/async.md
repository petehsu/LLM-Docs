#### Guides

# Asynchronous Requests

When working with the xAI API, you may need to process hundreds or even thousands of requests. Sending these requests sequentially can be extremely time-consuming.

To improve efficiency, you can use `AsyncClient` from `xai_sdk` or `AsyncOpenAI` from `openai`, which allows you to send multiple requests concurrently. The example below is a Python script demonstrating how to use `AsyncClient` to batch and process requests asynchronously, significantly reducing the overall execution time:

The xAI API does not currently offer a batch API.

## Rate Limits

Adjust the `max_concurrent` param to control the maximum number of parallel requests.

You are unable to concurrently run your requests beyond the rate limits shown in the API console.

```pythonXAI
import asyncio

from xai_sdk import AsyncClient
from xai_sdk.chat import Response, user

async def main():
    client = AsyncClient(
        api_key=os.getenv("XAI_API_KEY"),
        timeout=3600, # Override default timeout with longer timeout for reasoning models
    )

    model = "grok-4"
    requests = [
        "Tell me a joke",
        "Write a funny haiku",
        "Generate a funny X post",
        "Say something unhinged",
    ]


    # Define a semaphore to limit concurrent requests (e.g., max 2 concurrent requests at a time)
    max_in_flight_requests = 2
    semaphore = asyncio.Semaphore(max_in_flight_requests)

    async def process_request(request) -> Response:
        async with semaphore:
            print(f"Processing request: {request}")
            chat = client.chat.create(model=model, max_tokens=100)
            chat.append(user(request))
            return await chat.sample()

    tasks = []
    for request in requests:
        tasks.append(process_request(request))

    responses = await asyncio.gather(*tasks)
    for i, response in enumerate(responses):
        print(f"Total tokens used for response {i}: {response.usage.total_tokens}")

if **name** == "**main**":
asyncio.run(main())
```

```pythonOpenAISDK
import asyncio
import os
import httpx
from asyncio import Semaphore
from typing import List

from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key=os.getenv("XAI_API_KEY"),
    base_url="https://api.x.ai/v1",
    timeout=httpx.Timeout(3600.0) # Override default timeout with longer timeout for reasoning models
)

async def send_request(sem: Semaphore, request: str) -> dict:
"""Send a single request to xAI with semaphore control."""
# The 'async with sem' ensures only a limited number of requests run at once
    async with sem:
        return await client.chat.completions.create(
            model="grok-4",
            messages=[{"role": "user", "content": request}]
        )

async def process_requests(requests: List[str], max_concurrent: int = 2) -> List[dict]:
"""Process multiple requests with controlled concurrency."""
    # Create a semaphore that limits how many requests can run at the same time # Think of it like having only 2 "passes" to make requests simultaneously
    sem = Semaphore(max_concurrent)

    # Create a list of tasks (requests) that will run using the semaphore
    tasks = [send_request(sem, request) for request in requests]

    # asyncio.gather runs all tasks in parallel but respects the semaphore limit
    # It waits for all tasks to complete and returns their results
    return await asyncio.gather(*tasks)

async def main() -> None:
"""Main function to handle requests and display responses."""
    requests = [
        "Tell me a joke",
        "Write a funny haiku",
        "Generate a funny X post",
        "Say something unhinged"
    ]

    # This starts processing all asynchronously, but only 2 at a time
    # Instead of waiting for each request to finish before starting the next,
    # we can have 2 requests running at once, making it faster overall
    responses = await process_requests(requests)

    # Print each response in order
    for i, response in enumerate(responses):
        print(f"# Response {i}:")
        print(response.choices[0].message.content)

if **name** == "**main**":
asyncio.run(main())
```


