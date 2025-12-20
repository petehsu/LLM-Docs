# Create message

> Create conversational messages using the Anthropic-compatible Messages API



## OpenAPI

````yaml cn/api-reference/openapi.json post /messages
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
  /messages:
    post:
      tags:
        - Messages
      summary: Create message
      description: >-
        Create conversational messages using the Anthropic-compatible Messages
        API
      operationId: createMessage
      parameters:
        - name: anthropic-version
          in: header
          required: true
          schema:
            type: string
            example: '2023-06-01'
          description: >-
            The version of the Anthropic API you want to use. Use '2023-06-01'
            for the current stable version.
        - name: anthropic-beta
          in: header
          required: false
          schema:
            type: string
            example: max-tokens-3-5-sonnet-2022-07-15
          description: >-
            Optional header for accessing beta features. Format: comma-separated
            list of beta feature names.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MessageRequest'
            examples:
              basic:
                summary: Basic message
                value:
                  model: claude-3.5-sonnet
                  max_tokens: 100
                  messages:
                    - role: user
                      content: What are the primary colors?
              with_system:
                summary: Message with system prompt
                value:
                  model: claude-3.5-sonnet
                  max_tokens: 200
                  system: You are a helpful coding assistant.
                  messages:
                    - role: user
                      content: Explain list comprehensions
              with_thinking:
                summary: Extended thinking enabled
                value:
                  model: claude-3.5-sonnet
                  max_tokens: 1000
                  thinking:
                    type: enabled
                    budget_tokens: 500
                  messages:
                    - role: user
                      content: 'Solve this complex problem: A train leaves station A...'
              with_tools:
                summary: Tool use (function calling)
                value:
                  model: claude-3.5-sonnet
                  max_tokens: 500
                  tools:
                    - name: get_weather
                      description: Get the current weather in a given location
                      input_schema:
                        type: object
                        properties:
                          location:
                            type: string
                            description: The city and state, e.g. San Francisco, CA
                        required:
                          - location
                  messages:
                    - role: user
                      content: What's the weather like in London?
              multimodal:
                summary: Image understanding
                value:
                  model: claude-3.5-sonnet
                  max_tokens: 300
                  messages:
                    - role: user
                      content:
                        - type: image
                          source:
                            type: base64
                            media_type: image/jpeg
                            data: >-
                              iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==
                        - type: text
                          text: What's in this image?
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MessageResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '429':
          $ref: '#/components/responses/RateLimit'
        '500':
          $ref: '#/components/responses/ServerError'
      security:
        - apiKeyAuth: []
components:
  schemas:
    MessageRequest:
      type: object
      required:
        - model
        - messages
        - max_tokens
      properties:
        model:
          type: string
          description: >-
            The model that will complete your prompt. See the list of Claude
            models at https://docs.claude.com/en/docs/about-claude/models
          example: claude-3.5-sonnet
        messages:
          type: array
          description: >-
            Input messages. Alternating user and assistant conversational turns.
            The first message must use the user role. Text content is the only
            format supported for the first user message.
          items:
            $ref: '#/components/schemas/AnthropicMessage'
          minItems: 1
        max_tokens:
          type: integer
          description: >-
            The maximum number of tokens to generate before stopping. Note that
            Claude may stop before reaching this maximum. This parameter only
            specifies the absolute maximum number of tokens to generate.
          minimum: 1
        system:
          oneOf:
            - type: string
              description: System prompt as plain text
            - type: array
              description: Array of system content blocks
              items:
                type: object
                properties:
                  type:
                    type: string
                    enum:
                      - text
                  text:
                    type: string
                  cache_control:
                    type: object
                    properties:
                      type:
                        type: string
                        enum:
                          - ephemeral
                required:
                  - type
                  - text
          description: >-
            System prompt. A system prompt is a way of providing context and
            instructions to Claude, such as specifying a particular goal or
            role.
        temperature:
          type: number
          minimum: 0
          maximum: 1
          default: 1
          description: >-
            Amount of randomness injected into the response. Defaults to 1.0.
            Ranges from 0.0 to 1.0. Use temperature closer to 0.0 for analytical
            / multiple choice, and closer to 1.0 for creative and generative
            tasks.
        top_p:
          type: number
          minimum: 0
          maximum: 1
          description: >-
            Use nucleus sampling. In nucleus sampling, Claude computes the
            cumulative distribution over all the options for each subsequent
            token in decreasing probability order and cuts it off once it
            reaches a particular probability specified by top_p.
        top_k:
          type: integer
          minimum: 0
          description: >-
            Only sample from the top K options for each subsequent token. Used
            to remove "long tail" low probability responses. Recommended for
            advanced use cases only. You usually only need to use temperature.
        stream:
          type: boolean
          default: false
          description: >-
            Whether to incrementally stream the response using server-sent
            events. See streaming documentation for details.
        stop_sequences:
          type: array
          items:
            type: string
          description: >-
            Custom text sequences that will cause the model to stop generating.
            Claude will stop when it encounters any of these strings.
        tools:
          type: array
          description: >-
            Definitions of tools that the model may use. If you include tools in
            your API request, the model may return tool_use content blocks that
            represent the model's use of those tools.
          items:
            $ref: '#/components/schemas/AnthropicTool'
        tool_choice:
          oneOf:
            - type: object
              properties:
                type:
                  type: string
                  enum:
                    - auto
              required:
                - type
              description: >-
                allows Claude to decide whether to call any provided tools or
                not
            - type: object
              properties:
                type:
                  type: string
                  enum:
                    - any
              required:
                - type
              description: tells Claude that it must use one of the provided tools
            - type: object
              properties:
                type:
                  type: string
                  enum:
                    - tool
                name:
                  type: string
              required:
                - type
                - name
              description: allows Claude to use only the specified tool
          description: >-
            How the model should use the provided tools. The model can use a
            specific tool, any available tool, or decide by itself.
        thinking:
          type: object
          properties:
            type:
              type: string
              enum:
                - enabled
            budget_tokens:
              type: integer
              description: Maximum number of tokens to spend on thinking
          description: >-
            Enable extended thinking by Claude. When enabled, Claude will think
            through the problem before responding.
        service_tier:
          type: string
          enum:
            - auto
            - standard_only
          description: >-
            The service tier to use for the request. 'auto' lets us choose the
            tier, 'standard_only' restricts to standard tier.
        metadata:
          type: object
          properties:
            user_id:
              type: string
              description: >-
                An external identifier for the user who is associated with the
                request
          description: An object describing metadata about the request
    MessageResponse:
      type: object
      required:
        - id
        - type
        - role
        - content
        - model
        - stop_reason
        - usage
      properties:
        id:
          type: string
          description: >-
            Unique object identifier. The format and length of IDs may change
            over time.
          example: msg_abc123
        type:
          type: string
          enum:
            - message
          description: Object type. For Messages, this is always 'message'.
        role:
          type: string
          enum:
            - assistant
          description: >-
            Conversational role of the generated message. This is always
            'assistant'.
        content:
          type: array
          description: >-
            Content generated by the model. This is an array of content blocks,
            each of which has a type that determines its shape.
          items:
            $ref: '#/components/schemas/AnthropicResponseContentBlock'
        model:
          type: string
          description: The model that handled the request.
          example: claude-3.5-sonnet
        stop_reason:
          type: string
          enum:
            - end_turn
            - max_tokens
            - stop_sequence
            - tool_use
          description: >-
            The reason that we stopped. This may be one of the following values:
            end_turn (the model reached a natural stopping point), max_tokens
            (we exceeded the requested max_tokens or the model's maximum),
            stop_sequence (one of your provided custom stop_sequences was
            generated), or tool_use (the model invoked one or more tools).
        stop_sequence:
          type: string
          description: >-
            Which custom stop sequence was generated, if any. This value will be
            a non-null string if one of your custom stop sequences was
            generated.
          nullable: true
        usage:
          type: object
          description: >-
            Billing and rate-limit usage. Anthropic's API bills and rate-limits
            by token counts, as tokens represent the underlying cost to our
            systems.
          required:
            - input_tokens
            - output_tokens
          properties:
            input_tokens:
              type: integer
              description: The number of input tokens which were used.
            output_tokens:
              type: integer
              description: The number of output tokens which were used.
            cache_creation_input_tokens:
              type: integer
              description: The number of input tokens used to create the cache entry.
            cache_read_input_tokens:
              type: integer
              description: The number of input tokens read from the cache.
    AnthropicMessage:
      type: object
      required:
        - role
        - content
      properties:
        role:
          type: string
          enum:
            - user
            - assistant
          description: The role of the messages author
        content:
          oneOf:
            - type: string
              description: Plain text content
            - type: array
              description: Array of content blocks (text, image, tool_use, tool_result)
              items:
                $ref: '#/components/schemas/AnthropicContentBlock'
    AnthropicTool:
      type: object
      required:
        - name
        - input_schema
      properties:
        name:
          type: string
          description: >-
            The name of the tool. Must be a-z, A-Z, 0-9, or contain underscores
            and dashes, with a maximum length of 64.
        description:
          type: string
          description: >-
            Description of what this tool does. Tool descriptions should be as
            detailed as possible.
        input_schema:
          type: object
          description: >-
            JSON schema for the tool input shape that the model will produce in
            tool_use output content blocks.
          properties:
            type:
              type: string
              enum:
                - object
            properties:
              type: object
            required:
              type: array
              items:
                type: string
          required:
            - type
            - properties
        cache_control:
          type: object
          properties:
            type:
              type: string
              enum:
                - ephemeral
    AnthropicResponseContentBlock:
      oneOf:
        - type: object
          description: Text content block in response
          required:
            - type
            - text
          properties:
            type:
              type: string
              enum:
                - text
            text:
              type: string
              description: The text content
        - type: object
          description: Thinking content block showing Claude's reasoning process
          required:
            - type
            - thinking
          properties:
            type:
              type: string
              enum:
                - thinking
            thinking:
              type: string
              description: Claude's internal thinking process
        - type: object
          description: Tool use content block
          required:
            - type
            - id
            - name
            - input
          properties:
            type:
              type: string
              enum:
                - tool_use
            id:
              type: string
              description: A unique identifier for this particular tool use block
            name:
              type: string
              description: The name of the tool being used
            input:
              type: object
              description: An object containing the input being passed to the tool
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
    AnthropicContentBlock:
      oneOf:
        - type: object
          description: Text content block
          required:
            - type
            - text
          properties:
            type:
              type: string
              enum:
                - text
            text:
              type: string
            cache_control:
              type: object
              properties:
                type:
                  type: string
                  enum:
                    - ephemeral
        - type: object
          description: Image content block
          required:
            - type
            - source
          properties:
            type:
              type: string
              enum:
                - image
            source:
              type: object
              required:
                - type
                - media_type
                - data
              properties:
                type:
                  type: string
                  enum:
                    - base64
                media_type:
                  type: string
                  enum:
                    - image/jpeg
                    - image/png
                    - image/gif
                    - image/webp
                data:
                  type: string
                  description: Base64-encoded image data
            cache_control:
              type: object
              properties:
                type:
                  type: string
                  enum:
                    - ephemeral
        - type: object
          description: Tool use content block
          required:
            - type
            - id
            - name
            - input
          properties:
            type:
              type: string
              enum:
                - tool_use
            id:
              type: string
              description: A unique identifier for this particular tool use block
            name:
              type: string
              description: The name of the tool being used
            input:
              type: object
              description: An object containing the input being passed to the tool
        - type: object
          description: Tool result content block
          required:
            - type
            - tool_use_id
            - content
          properties:
            type:
              type: string
              enum:
                - tool_result
            tool_use_id:
              type: string
              description: The id of the tool use request this is a result for
            content:
              oneOf:
                - type: string
                - type: array
                  items:
                    type: object
              description: The result of the tool use
            is_error:
              type: boolean
              description: Set to true if the tool execution resulted in an error
            cache_control:
              type: object
              properties:
                type:
                  type: string
                  enum:
                    - ephemeral
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