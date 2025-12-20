# Rate Limit

DeepSeek API does **NOT** constrain user's rate limit. We will try out best to serve every request.

However, please note that when our servers are under high traffic pressure, your requests may take some time to receive a response from the server. During this period, your HTTP request will remain connected, and you may continuously receive contents in the following formats:

  * Non-streaming requests: Continuously return empty lines
  * Streaming requests: Continuously return SSE keep-alive comments (`: keep-alive`)

These contents do not affect the parsing of the JSON body by the OpenAI SDK. If you are parsing the HTTP responses yourself, please ensure to handle these empty lines or comments appropriately.

If the request has not started inference after 10 minutes, the server will close the connection.