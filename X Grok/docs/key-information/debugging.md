#### Getting Started

# Debugging Errors

When you send a request, you would normally get a `200 OK` response from the server with the expected response body.
If there has been an error with your request, or error with our service, the API endpoint will typically return an error code with error message.

If there is an ongoing service disruption, you can visit
[https://status.x.ai](https://status.x.ai) for the latest updates. The status is also available
via RSS at [https://status.x.ai/feed.xml](https://status.x.ai/feed.xml).

The service status is also indicated in the navigation bar of this site.

Most of the errors will be accompanied by an error message that is self-explanatory. For typical status codes of each endpoint, visit [API Reference](api-reference) or view our [OpenAPI Document](https://docs.x.ai/openapi.json).

## Status Codes

Here is a list of potential errors and statuses arranged by status codes.

### 4XX Status Codes

| Status Code                    | Endpoints                              | Cause                                                                                                                                                                       | Solution                                                                                                                                         |
| ------------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 400Bad Request            | All Endpoints                          | - A `POST` method request body specified an invalid argument, or a `GET` method with dynamic route has an invalid param in the URL.- An incorrect API key is supplied. | - Please check your request body or request URL.                                                                                                 |
| 401Unauthorized           | All Endpoints                          | - No authorization header or an invalid authorization token is provided.                                                                                                    | - Supply an `Authorization: Bearer Token <XAI_API_KEY>` in the request header. You can get a new API key on [xAI Console](https://console.x.ai). |
| 403Forbidden              | All Endpoints                          | - Your API key/team doesn't have permission to perform the action.- Your API key/team is blocked.                                                                     | - Ask your team admin for permission.                                                                                                            |
| 404Not Found              | All Endpoints                          | - A model specified in a `POST` method request body is not found.- Trying to reach an invalid endpoint URL. (Misspelled URL)                                           | - Check your request body and endpoint URL with our [API Reference](api-reference).                                                              |
| 405Method Not Allowed     | All Endpoints                          | - The request method is not allowed. For example, sending a `POST` request to an endpoint supporting only `GET`.                                                            | - Check your request method with our [API Reference](api-reference).                                                                             |
| 415Unsupported Media Type | All Endpoints Supporting `POST` Method | - An empty request body in `POST` requests.- Not specifying `Content-Type: application/json` header.                                                                  | - Add a valid request body. - Ensure `Content-Type: application/json` header is present in the request header.                             |
| 422Unprocessable Entity   | All Endpoints Supporting `POST` Method | - An invalid format for a field in the `POST` request body.                                                                                                                 | - Check your request body is valid. You can find more information from [API Reference](api-reference).                                           |
| 429Too Many Requests      | All Inference Endpoints                | - You are sending requests too frequently and reaching rate limit                                                                                                           | - Reduce your request rate or increase your rate limit. You can find your current rate limit on [xAI Console](https://console.x.ai).             |

### 2XX Error Codes

| Status Code      | Endpoints                                   | Cause                                                                                                    | Solution                       |
| ---------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------ |
| 202Accepted | `/v1/chat/deferred-completion/{request_id}` | - Your deferred chat completion request is queued for processing, but the response is not available yet. | - Wait for request processing. |

## Bug Report

If you believe you have encountered a bug and would like to contribute to our development process, [email API Bug Report](mailto:support@x.ai?subject=API%20Bug%20Report) to support@x.ai with your API request and response and relevant logs.

You can also chat in the `#help` channel of our [xAI API Developer Discord](https://discord.gg/x-ai).


