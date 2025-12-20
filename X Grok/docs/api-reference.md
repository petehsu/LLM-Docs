# REST API Reference

The xAI Enterprise API is a robust, high-performance RESTful interface designed for seamless integration into existing systems.
It offers advanced AI capabilities with full compatibility with the OpenAI REST API.

The base for all routes is at `https://api.x.ai`. For all routes, you have to authenticate with the header `Authorization: Bearer <your xAI API key>`.

***

## POST /v1/chat/completions

API endpoint for POST requests to /v1/chat/completions.

```
Method: POST
Path: /v1/chat/completions
```

***

## POST /v1/responses

API endpoint for POST requests to /v1/responses.

```
Method: POST
Path: /v1/responses
```

***

## GET /v1/responses/\{response\_id}

API endpoint for GET requests to /v1/responses/\{response\_id}.

```
Method: GET
Path: /v1/responses/{response_id}
```

***

## DELETE /v1/responses/\{response\_id}

API endpoint for DELETE requests to /v1/responses/\{response\_id}.

```
Method: DELETE
Path: /v1/responses/{response_id}
```

***

## POST /v1/messages

API endpoint for POST requests to /v1/messages.

```
Method: POST
Path: /v1/messages
```

***

## POST /v1/images/generations

API endpoint for POST requests to /v1/images/generations.

```
Method: POST
Path: /v1/images/generations
```

***

## GET /v1/api-key

API endpoint for GET requests to /v1/api-key.

```
Method: GET
Path: /v1/api-key
```

***

## GET /v1/models

API endpoint for GET requests to /v1/models.

```
Method: GET
Path: /v1/models
```

***

## GET /v1/models/\{model\_id}

API endpoint for GET requests to /v1/models/\{model\_id}.

```
Method: GET
Path: /v1/models/{model_id}
```

***

## GET /v1/language-models

API endpoint for GET requests to /v1/language-models.

```
Method: GET
Path: /v1/language-models
```

***

## GET /v1/language-models/\{model\_id}

API endpoint for GET requests to /v1/language-models/\{model\_id}.

```
Method: GET
Path: /v1/language-models/{model_id}
```

***

## GET /v1/image-generation-models

API endpoint for GET requests to /v1/image-generation-models.

```
Method: GET
Path: /v1/image-generation-models
```

***

## GET /v1/image-generation-models/\{model\_id}

API endpoint for GET requests to /v1/image-generation-models/\{model\_id}.

```
Method: GET
Path: /v1/image-generation-models/{model_id}
```

***

## POST /v1/tokenize-text

API endpoint for POST requests to /v1/tokenize-text.

```
Method: POST
Path: /v1/tokenize-text
```

***

## GET /v1/chat/deferred-completion/\{request\_id}

API endpoint for GET requests to /v1/chat/deferred-completion/\{request\_id}.

```
Method: GET
Path: /v1/chat/deferred-completion/{request_id}
```

***

## POST /v1/completions

API endpoint for POST requests to /v1/completions.

```
Method: POST
Path: /v1/completions
```

***

## POST /v1/complete

API endpoint for POST requests to /v1/complete.

```
Method: POST
Path: /v1/complete
```


