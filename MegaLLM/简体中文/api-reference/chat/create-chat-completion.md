# Create chat completion

> Generate conversational AI responses using the OpenAI-compatible chat completions API



## OpenAPI

````yaml cn/api-reference/openapi.json post /chat/completions
openapi: 3.1.0
info:
  title: MegaLLM API
  description: >-
    Unified API for accessing 70+ AI models through OpenAI-compatible and
    Anthropic-compatible endpoints
  version: 1.0.0
  contact:
    name: MegaLLM Support
    email: hi@megallm.io
    url: https://megallm.io
  license:
    name: Proprietary
    url: https://megallm.io/terms-of-service
servers:
  - url: https://ai.megallm.io/v1
    description: Production API Server
security:
  - bearerAuth: []
  - apiKeyAuth: []
tags:
  - name: Chat
    description: OpenAI-compatible chat completions API
  - name: Messages
    description: Anthropic-compatible messages API
  - name: Models
    description: List available AI models
  - name: Authentication
    description: API authentication endpoints
paths:
  /chat/completions:
    post:
      tags:
        - Chat
      summary: Create chat completion
      description: >-
        Generate conversational AI responses using the OpenAI-compatible chat
        completions API
      operationId: createChatCompletion
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatCompletionRequest'
            examples:
              basic:
                summary: Basic chat completion
                value:
                  model: gpt-4
                  messages:
                    - role: system
                      content: You are a helpful assistant.
                    - role: user
                      content: What is the capital of France?
              streaming:
                summary: Streaming chat completion
                value:
                  model: gpt-4
                  messages:
                    - role: user
                      content: Tell me a story
                  stream: true
              function_calling:
                summary: Function calling
                value:
                  model: gpt-4
                  messages:
                    - role: user
                      content: What's the weather in London?
                  tools:
                    - type: function
                      function:
                        name: get_weather
                        description: Get current weather
                        parameters:
                          type: object
                          properties:
                            location:
                              type: string
                          required:
                            - location
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatCompletionResponse'
            text/event-stream:
              schema:
                type: string
                description: Server-sent events stream (when stream=true)
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/RateLimit'
        '500':
          $ref: '#/components/responses/ServerError'
      security:
        - bearerAuth: []
components:
  schemas:
    ChatCompletionRequest:
      type: object
      required:
        - model
        - messages
      properties:
        model:
          type: string
          description: Model ID (e.g., gpt-4, claude-3.5-sonnet)
          example: gpt-4
        messages:
          type: array
          description: Array of message objects
          items:
            $ref: '#/components/schemas/ChatMessage'
        temperature:
          type: number
          minimum: 0
          maximum: 2
          default: 0.7
          description: Sampling temperature (0.0 - 2.0)
        max_tokens:
          type: integer
          description: Maximum tokens to generate
        stream:
          type: boolean
          default: false
          description: Enable streaming responses
        tools:
          type: array
          description: Available functions/tools
          items:
            $ref: '#/components/schemas/Tool'
        tool_choice:
          oneOf:
            - type: string
              enum:
                - auto
                - required
                - none
            - type: object
          description: Controls tool calling behavior
        top_p:
          type: number
          minimum: 0
          maximum: 1
          description: Nucleus sampling parameter
        frequency_penalty:
          type: number
          minimum: -2
          maximum: 2
          default: 0
          description: Penalize frequent tokens
        presence_penalty:
          type: number
          minimum: -2
          maximum: 2
          default: 0
          description: Penalize repeated tokens
        'n':
          type: integer
          default: 1
          description: Number of completions to generate
        stop:
          oneOf:
            - type: string
            - type: array
              items:
                type: string
          description: Stop sequences
        user:
          type: string
          description: Unique user identifier
    ChatCompletionResponse:
      type: object
      properties:
        id:
          type: string
          example: chatcmpl-abc123
        object:
          type: string
          enum:
            - chat.completion
        created:
          type: integer
          description: Unix timestamp
        model:
          type: string
          example: gpt-4
        choices:
          type: array
          items:
            type: object
            properties:
              index:
                type: integer
              message:
                $ref: '#/components/schemas/ChatMessage'
              finish_reason:
                type: string
                enum:
                  - stop
                  - length
                  - tool_calls
                  - content_filter
        usage:
          $ref: '#/components/schemas/Usage'
    ChatMessage:
      type: object
      required:
        - role
        - content
      properties:
        role:
          type: string
          enum:
            - system
            - user
            - assistant
            - tool
          description: Message role
        content:
          oneOf:
            - type: string
            - type: array
              items:
                type: object
          description: Message content (text or multi-part)
        name:
          type: string
          description: Participant name
        tool_calls:
          type: array
          description: Tool calls made by assistant
          items:
            $ref: '#/components/schemas/ToolCall'
        tool_call_id:
          type: string
          description: ID of tool call (for tool role)
    Tool:
      type: object
      required:
        - type
        - function
      properties:
        type:
          type: string
          enum:
            - function
          description: Tool type
        function:
          type: object
          required:
            - name
            - parameters
          properties:
            name:
              type: string
              description: Function name
            description:
              type: string
              description: Function description
            parameters:
              type: object
              description: JSON Schema for parameters
    Usage:
      type: object
      properties:
        prompt_tokens:
          type: integer
        completion_tokens:
          type: integer
        total_tokens:
          type: integer
    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            message:
              type: string
            type:
              type: string
            code:
              type: string
    ToolCall:
      type: object
      properties:
        id:
          type: string
          description: Tool call ID
        type:
          type: string
          enum:
            - function
        function:
          type: object
          properties:
            name:
              type: string
            arguments:
              type: string
              description: JSON string of arguments
  responses:
    BadRequest:
      description: Bad request - Invalid parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              message: Invalid request parameters
              type: invalid_request_error
              code: invalid_parameters
    Unauthorized:
      description: Unauthorized - Invalid or missing API key
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              message: Invalid authentication credentials
              type: invalid_request_error
              code: invalid_api_key
    RateLimit:
      description: Rate limit exceeded
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              message: Rate limit exceeded. Please retry after some time.
              type: rate_limit_error
              code: rate_limit_exceeded
    ServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              message: Internal server error
              type: api_error
              code: internal_error
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: API Key
      description: Bearer token authentication (OpenAI-compatible)
    apiKeyAuth:
      type: apiKey
      in: header
      name: x-api-key
      description: API key authentication (Anthropic-compatible)

````

---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.megallm.io/llms.txt