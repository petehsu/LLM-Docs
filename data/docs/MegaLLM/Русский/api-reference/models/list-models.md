# List models

> List all available AI models with their capabilities and pricing



## OpenAPI

````yaml cn/api-reference/openapi.json get /models
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
  /models:
    get:
      tags:
        - Models
      summary: List models
      description: List all available AI models with their capabilities and pricing
      operationId: listModels
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ModelsResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '500':
          $ref: '#/components/responses/ServerError'
      security:
        - bearerAuth: []
components:
  schemas:
    ModelsResponse:
      type: object
      properties:
        object:
          type: string
          enum:
            - list
        data:
          type: array
          items:
            $ref: '#/components/schemas/Model'
    Model:
      type: object
      properties:
        id:
          type: string
          example: gpt-4
        object:
          type: string
          enum:
            - model
        type:
          type: string
          enum:
            - chat
            - embedding
        created_at:
          type: string
          format: date-time
        owned_by:
          type: string
          example: openai
        display_name:
          type: string
          example: GPT-4
        capabilities:
          type: object
          properties:
            supports_function_calling:
              type: boolean
            supports_vision:
              type: boolean
            supports_streaming:
              type: boolean
            supports_structured_output:
              type: boolean
        pricing:
          type: object
          properties:
            input_tokens_cost_per_million:
              type: number
            output_tokens_cost_per_million:
              type: number
            currency:
              type: string
              example: USD
        context_length:
          type: integer
        max_output_tokens:
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
  responses:
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