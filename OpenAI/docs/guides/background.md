# Background mode

Run long running tasks asynchronously in the background.

Copy page

Agents like [Codex](https://openai.com/index/introducing-codex/) and [Deep Research](https://openai.com/index/introducing-deep-research/) show that reasoning models can take several minutes to solve complex problems. Background mode enables you to execute long-running tasks on models like GPT-5.2 and GPT-5.2 pro reliably, without having to worry about timeouts or other connectivity issues.

Background mode kicks off these tasks asynchronously, and developers can poll response objects to check status over time. To start response generation in the background, make an API request with `background` set to `true`:

Because background mode stores response data for roughly 10 minutes to enable polling, it is not Zero Data Retention (ZDR) compatible. Requests from ZDR projects are still accepted with `background=true` for legacy reasons, but using it breaks ZDR guarantees. Modified Abuse Monitoring (MAM) projects can safely rely on background mode.

Generate a response in the background

python

```
1
2
3
4
5
6
7
8
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
  "model": "gpt-5.2",
  "input": "Write a very long novel about otters in space.",
  "background": true
}'
```

```
1
2
3
4
5
6
7
8
9
10
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-5.2",
  input: "Write a very long novel about otters in space.",
  background: true,
});

console.log(resp.status);
```

```
1
2
3
4
5
6
7
8
9
10
11
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
  model="gpt-5.2",
  input="Write a very long novel about otters in space.",
  background=True,
)

print(resp.status)
```

## Polling background responses

To check the status of background requests, use the GET endpoint for Responses. Keep polling while the request is in the queued or in\_progress state. When it leaves these states, it has reached a final (terminal) state.

Retrieve a response executing in the background

python

```
1
2
3
curl https://api.openai.com/v1/responses/resp_123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
import OpenAI from "openai";
const client = new OpenAI();

let resp = await client.responses.create({
model: "gpt-5.2",
input: "Write a very long novel about otters in space.",
background: true,
});

while (resp.status === "queued" || resp.status === "in_progress") {
console.log("Current status: " + resp.status);
await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds
resp = await client.responses.retrieve(resp.id);
}

console.log("Final status: " + resp.status + "\nOutput:\n" + resp.output_text);
```

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
from openai import OpenAI
from time import sleep

client = OpenAI()

resp = client.responses.create(
  model="gpt-5.2",
  input="Write a very long novel about otters in space.",
  background=True,
)

while resp.status in {"queued", "in_progress"}:
  print(f"Current status: {resp.status}")
  sleep(2)
  resp = client.responses.retrieve(resp.id)

print(f"Final status: {resp.status}\nOutput:\n{resp.output_text}")
```

## Cancelling a background response

You can also cancel an in-flight response like this:

Cancel an ongoing response

python

```
1
2
3
curl -X POST https://api.openai.com/v1/responses/resp_123/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```
1
2
3
4
5
6
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.cancel("resp_123");

console.log(resp.status);
```

```
1
2
3
4
5
6
from openai import OpenAI
client = OpenAI()

resp = client.responses.cancel("resp_123")

print(resp.status)
```

Cancelling twice is idempotent - subsequent calls simply return the final `Response` object.

## Streaming a background response

You can create a background Response and start streaming events from it right away. This may be helpful if you expect the client to drop the stream and want the option of picking it back up later. To do this, create a Response with both `background` and `stream` set to `true`. You will want to keep track of a "cursor" corresponding to the `sequence_number` you receive in each streaming event.

Currently, the time to first token you receive from a background response is higher than what you receive from a synchronous one. We are working to reduce this latency gap in the coming weeks.

Generate and stream a background response

python

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
  "model": "gpt-5.2",
  "input": "Write a very long novel about otters in space.",
  "background": true,
  "stream": true
}'

// To resume:
curl "https://api.openai.com/v1/responses/resp_123?stream=true&starting_after=42" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY"
```

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
import OpenAI from "openai";
const client = new OpenAI();

const stream = await client.responses.create({
  model: "gpt-5.2",
  input: "Write a very long novel about otters in space.",
  background: true,
  stream: true,
});

let cursor = null;
for await (const event of stream) {
  console.log(event);
  cursor = event.sequence_number;
}

// If the connection drops, you can resume streaming from the last cursor (SDK support coming soon):
// const resumedStream = await client.responses.stream(resp.id, { starting_after: cursor });
// for await (const event of resumedStream) { ... }
```

```
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
from openai import OpenAI

client = OpenAI()

# Fire off an async response but also start streaming immediately
stream = client.responses.create(
  model="gpt-5.2",
  input="Write a very long novel about otters in space.",
  background=True,
  stream=True,
)

cursor = None
for event in stream:
  print(event)
  cursor = event.sequence_number

# If your connection drops, the response continues running and you can reconnect:
# SDK support for resuming the stream is coming soon.
# for event in client.responses.stream(resp.id, starting_after=cursor):
#     print(event)
```

## Limits

1. Background sampling requires `store=true`; stateless requests are rejected.
2. To cancel a synchronous response, terminate the connection
3. You can only start a new stream from a background response if you created it with `stream=true`.