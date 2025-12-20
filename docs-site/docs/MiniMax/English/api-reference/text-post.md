# Text Generation

> Use this API to create chat completions.



## OpenAPI

````yaml api-reference/text/api/openapi.json post /v1/text/chatcompletion_v2
openapi: 3.1.0
info:
  title: MiniMax Text API
  description: >-
    MiniMax text generation API with support for chat completion and streaming
    output
  license:
    name: MIT
  version: 1.0.0
servers:
  - url: https://api.minimax.io
security:
  - bearerAuth: []
paths:
  /v1/text/chatcompletion_v2:
    post:
      tags:
        - Text Generation
      summary: Text Generation V2
      operationId: chatCompletionV2
      parameters:
        - name: Content-Type
          in: header
          required: true
          description: >-
            The media type of the request body. Must be set to
            `application/json` to ensure the data is sent in JSON format.
          schema:
            type: string
            enum:
              - application/json
            default: application/json
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatCompletionReq'
            examples:
              Request:
                value:
                  model: MiniMax-M1
                  messages:
                    - role: system
                      name: MiniMax AI
                    - role: user
                      name: user
                      content: hello
              Stream:
                value:
                  model: MiniMax-M1
                  messages:
                    - role: system
                      name: MiniMax AI
                    - role: user
                      name: user
                      content: hello
                  stream: true
              Image:
                value:
                  model: MiniMax-Text-01
                  messages:
                    - role: system
                      name: MiniMax AI
                      content: >-
                        MM Smart Assistant is a large language model
                        independently developed by MiniMax, without relying on
                        other products' APIs. MiniMax is a Chinese technology
                        company dedicated to research in large-scale models.
                    - role: user
                      name: User
                      content:
                        - type: text
                          text: What does this picture represent?
                        - type: image_url
                          image_url:
                            url: >-
                              https://cdn.hailuoai.com/prod/2024-09-18-16/user/multi_chat_file/9c0b5c14-ee88-4a5b-b503-4f626f018639.jpeg
        required: true
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatCompletionResp'
              examples:
                Request:
                  value:
                    id: 04ecb5d9b1921ae0fb0e8da9017a5474
                    choices:
                      - finish_reason: stop
                        index: 0
                        message:
                          content: Hello! How can I assist you?
                          role: assistant
                          name: MiniMax AI
                          audio_content: ''
                          reasoning_content: ...omitted
                    created: 1755153113
                    model: MiniMax-M1
                    object: chat.completion
                    usage:
                      total_tokens: 249
                      total_characters: 0
                      prompt_tokens: 26
                      completion_tokens: 223
                      completion_tokens_details:
                        reasoning_tokens: 214
                    input_sensitive: false
                    output_sensitive: false
                    input_sensitive_type: 0
                    output_sensitive_type: 0
                    output_sensitive_int: 0
                    base_resp:
                      status_code: 0
                      status_msg: ''
                Stream:
                  value:
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - index: 0
                          delta:
                            content: Okay
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion.chunk
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - finish_reason: stop
                          index: 0
                          delta:
                            content: Hello! How can I assist you today?
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion.chunk
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - finish_reason: stop
                          index: 0
                          message:
                            content: Hello! How can I assist you today?
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion
                      usage:
                        total_tokens: 73
                      input_sensitive: false
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                      base_resp:
                        status_code: 0
                        status_msg: ''
                Image:
                  value:
                    content: >-
                      This picture represents a cute and whimsical scene where a
                      hamster is depicted as if it is having a cup of tea. The
                      hamster is placed on a small wooden table with a miniature
                      teacup and saucer, creating a charming and playful
                      atmosphere. The setting includes small potted plants and a
                      clock in the background, adding to the cozy and homely
                      feel of the image.
                    role: assistant
                    name: MiniMax AI
                    audio_content: ''
            text/event-stream:
              schema:
                $ref: '#/components/schemas/ChatCompletionResp'
              examples:
                Stream:
                  value:
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - index: 0
                          delta:
                            content: Okay
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion.chunk
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - finish_reason: stop
                          index: 0
                          delta:
                            content: Hello! How can I assist you today?
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion.chunk
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                    - id: 02ff7eb7fe6fb505b9d5cb6945a1a98b
                      choices:
                        - finish_reason: stop
                          index: 0
                          message:
                            content: Hello! How can I assist you today?
                            role: assistant
                      created: 1722829751
                      model: MiniMax-M1
                      object: chat.completion
                      usage:
                        total_tokens: 73
                      input_sensitive: false
                      output_sensitive: false
                      input_sensitive_type: 0
                      output_sensitive_type: 0
                      base_resp:
                        status_code: 0
                        status_msg: ''
components:
  schemas:
    ChatCompletionReq:
      type: object
      required:
        - model
        - messages
      properties:
        model:
          type: string
          description: >-
            Model ID. Options: `MiniMax-M2`, `MiniMax-M1`, `MiniMax-Text-01`.
            `MiniMax-M2` and `MiniMax-M1` are reasoning models, recommended with
            streaming output for best performance.
          enum:
            - MiniMax-M2
            - MiniMax-M1
            - MiniMax-Text-01
        stream:
          type: boolean
          description: >-
            Whether to enable streaming. Defaults to `false`. If `true`, the
            response will be returned in multiple chunks.
          default: false
        max_tokens:
          type: integer
          format: int64
          description: >-
            Deprecated in favor of `max_completion_tokens`.


            Maximum number of tokens allowed in the generated output. Content
            beyond this limit will be truncated. If the generation is cut off
            due to length limits, consider increasing this value.


            Default:

            - `MiniMax-M2`: 10240

            - `MiniMax-M1`: 8192

            - `MiniMax-Text-01`: 2048
          minimum: 1
          deprecated: true
        max_completion_tokens:
          type: integer
          format: int64
          description: >-
            Maximum number of tokens allowed in the generated output. Content
            beyond this limit will be truncated. If the generation is cut off
            due to length limits, consider increasing this value.


            Default:

            - `MiniMax-M2`: 10240

            - `MiniMax-M1`: 8192

            - `MiniMax-Text-01`: 2048
          minimum: 1
        temperature:
          type: number
          format: double
          description: >-
            Controls randomness of the output. Range: (0, 1]. Higher values will
            make the output more random, while lower values will make it more
            focused and deterministic.


            Default values:

            - `MiniMax-M2`: recommended 1.0

            -`MiniMax-M1`: 1.0 (recommended range [0.8, 1.0])

            - `MiniMax-Text-01`: 0.1 (can be raised to 0.7–1.0 for creative
            tasks).
          minimum: 0
          exclusiveMinimum: 0
          maximum: 1
        top_p:
          type: number
          format: double
          description: |-
            Sampling strategy that affects output diversity. Range: (0, 1]
            - `MiniMax-M2` recommended 0.95
          minimum: 0
          exclusiveMinimum: 0
          maximum: 1
          default: 0.95
        messages:
          type: array
          description: List of messages containing conversation history
          items:
            $ref: '#/components/schemas/Message'
        tool_choice:
          type: string
          description: |-
            Controls how the model uses tools:
            - `none`: never call tools
            - `auto`: decide automatically (default)
          enum:
            - none
            - auto
          default: auto
        tools:
          type: array
          description: >-
            List of tools available for the model to call. For more details, see
            [M2 Tool Use & Interleaved Thinking](/guides/text-m2-function-call)
          items:
            type: object
            required:
              - type
              - function
            properties:
              type:
                type: string
                description: Tool type. Currently only `function` is supported.
                enum:
                  - function
              function:
                type: object
                required:
                  - name
                  - description
                  - parameters
                description: Function definition.
                properties:
                  name:
                    type: string
                    description: Function name.
                  description:
                    type: string
                    description: >-
                      Description of the function's purpose, behavior, and
                      parameters.
                  parameters:
                    type: object
                    description: Function parameters.
        response_format:
          type: object
          description: |-
            Specifies the output format (only supported by `MiniMax-Text-01`).
            Example: `{ "type": "json_schema", "json_schema": {...} }`
          required:
            - type
            - json_schema
          properties:
            type:
              type: string
              description: Format type. Only `json_schema` is supported.
              enum:
                - json_schema
            json_schema:
              type: object
              description: Schema definition for structured output.
              required:
                - name
                - schema
              properties:
                name:
                  type: string
                  description: 'Schema name. Max length: 64. Must match regex: `\w`.'
                  maxLength: 64
                  pattern: ^\w+$
                description:
                  type: string
                  description: >-
                    Description of the schema, helps model understand output
                    format.
                schema:
                  type: object
                  description: JSON Schema definition.
                  required:
                    - type
                    - properties
                  properties:
                    type:
                      type: string
                      description: Must be `object`.
                      enum:
                        - object
                    properties:
                      type: object
                      description: >-
                        Define each field in the output object. Supports types:
                        String, Array, Enum, Number, Integer, Object, Boolean.


                        **Example:**


                        ```json

                        "json_schema": {
                          "name": "user_analysis",
                          "description": "User behavior analysis result",
                          "schema": {
                            "type": "object",
                            "properties": {
                              "analysis": {
                                "type": "string",
                                "description": "Content analysis based on rules"
                              },
                              "summary_words": {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                },
                                "description": "Content keywords summary, limited to three words"
                              },
                              "content_result": {
                                "type": "string",
                                "enum": [
                                  "Pornography/Obscenity Violation",
                                  "Advertising/Spam Violation",
                                  "Illegal Content Violation",
                                  "Political Content Violation",
                                  "Self-harm/Suicide Violation",
                                  "Underage Violation",
                                  "Abuse/Insult Violation",
                                  "Other Violations",
                                  "Normal"
                                ],
                                "description": "Content classification result"
                              },
                              "risk_words": {
                                "type": "array",
                                "items": {
                                  "type": "string"
                                },
                                "description": "Keywords indicating violations, emojis converted to text"
                              },
                              "correct_rate": {
                                "type": "number",
                                "description": "Credibility score, from 0.00 to 1.00"
                              },
                              "content_risk_level": {
                                "type": "string",
                                "enum": ["high", "medium", "low"],
                                "description": "Risk concentration level in content"
                              }
                            },
                            "required": [
                              "analysis",
                              "summary_words",
                              "content_result",
                              "risk_words",
                              "correct_rate",
                              "content_risk_level"
                            ]
                          }
                        }

                        ```
        stream_options:
          type: object
          description: Options for streaming mode.
          properties:
            include_usage:
              type: boolean
              description: >-
                Defaults to `false`. If `true`, the final chunk will include
                complete `usage` statistics.
              default: false
        mask_sensitive_info:
          type: boolean
          description: >-
            Mask (replace with ***) content in the output that involves private
            information, including but not limited to email, domain, link, ID
            number, home address, etc.


            Defaults `false`.
          default: false
      example:
        model: MiniMax-M1
        messages:
          - role: system
            name: MiniMax AI
          - role: user
            name: user
            content: hello
    ChatCompletionResp:
      type: object
      properties:
        id:
          type: string
          description: Unique ID of this response.
        choices:
          type: array
          description: List of response choices.
          items:
            type: object
            properties:
              finish_reason:
                type: string
                description: |-
                  Reason the generation stopped:
                  - `stop`: completed naturally
                  - `length`: reached max_tokens limit
                  - `tool_calls`: tool call triggered
                enum:
                  - stop
                  - length
                  - tool_calls
              index:
                type: integer
                description: Index of the choice (starting at 0).
              message:
                type: object
                description: The complete reply generated by the model.
                required:
                  - content
                  - role
                properties:
                  content:
                    type: string
                    description: Text reply content.
                  role:
                    type: string
                    description: 'Role of the message. Fixed value: `assistant`.'
                    enum:
                      - assistant
                  tool_calls:
                    type: array
                    description: List of tools requested by the model.
                    items:
                      type: object
                      required:
                        - id
                        - type
                        - function
                      properties:
                        id:
                          type: string
                          description: Unique tool call ID.
                        type:
                          type: string
                          description: Always `function`.
                          enum:
                            - function
                        function:
                          type: object
                          description: Function calling information.
                          required:
                            - name
                            - arguments
                          properties:
                            name:
                              type: string
                              description: name of function.
                            arguments:
                              type: string
                              description: JSON string of arguments.
        created:
          type: integer
          format: int64
          description: Unix timestamp (seconds) when the response was created.
        model:
          type: string
          description: Model ID used for this request.
        object:
          type: string
          description: |-
            Object type:
            - `chat.completion`: non-streaming
            - `chat.completion.chunk`: streaming
          enum:
            - chat.completion
            - chat.completion.chunk
        usage:
          $ref: '#/components/schemas/Usage'
        input_sensitive:
          type: boolean
          description: >-
            Whether the input contained sensitive content. See
            `input_sensitive_type` for details on the type of sensitive content.
        input_sensitive_type:
          type: integer
          format: int64
          description: |-
            Type of sensitive content in input. Possible values:

            `1`: severe violation
            `2`: pornography
            `3`: advertising
            `4`: prohibited
            `5`: abusive
            `6`: terrorism/violence
            `7`: other
        output_sensitive:
          type: boolean
          description: Whether the output contained sensitive content.
        output_sensitive_type:
          type: integer
          format: int64
          description: Type of sensitive content in output.
        base_resp:
          type: object
          description: Error status codes and details.
          properties:
            status_code:
              type: integer
              format: int64
              description: >-
                Error code. Examples:


                `1000`: Unknown error

                `1001`: Request timeout

                `1002`: Rate limited

                `1004`: Authentication failed

                `1008`: Insufficient balance

                `1013`: Internal server error

                `1027`: Invalid output content

                `1039`: Token limit exceeded

                `2013`: Invalid parameters


                For more information, please refer to the [Error Code
                Reference](/api-reference/errorcode).
            status_msg:
              type: string
              description: Error details.
      example:
        id: 04ecb5d9b1921ae0fb0e8da9017a5474
        choices:
          - finish_reason: stop
            index: 0
            message:
              content: Hello! How can I assist you?
              role: assistant
              name: MiniMax AI
              audio_content: ''
              reasoning_content: ...omitted
        created: 1755153113
        model: MiniMax-M1
        object: chat.completion
        usage:
          total_tokens: 249
          total_characters: 0
          prompt_tokens: 26
          completion_tokens: 223
          completion_tokens_details:
            reasoning_tokens: 214
        input_sensitive: false
        output_sensitive: false
        input_sensitive_type: 0
        output_sensitive_type: 0
        output_sensitive_int: 0
        base_resp:
          status_code: 0
          status_msg: ''
    Message:
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
          description: |-
            The role of the message sender:
            - `system`: set the model's role and behavior
            - `user`: user input
            - `assistant`: model responses, may include tool calls
            - `tool`: returned result from a tool call
        name:
          type: string
          description: >-
            Name of the sender. Optional parameter. Required if multiple senders
            share the same role.
        content:
          description: 'Message content. Supports two types: `string` and `object[]`'
          oneOf:
            - type: string
              description: Plain `string` message content
            - type: array
              description: Multimodal message content (`array`)
              items:
                type: object
                required:
                  - type
                properties:
                  type:
                    type: string
                    enum:
                      - text
                      - image_url
                    description: 'Content type. Options: `text`, `image_url`.'
                  text:
                    type: string
                    description: Text content.
                  image_url:
                    type: object
                    required:
                      - url
                    properties:
                      url:
                        type: string
                        description: Public image URL or Base64-encoded Data.
                    description: Image input.
        tool_calls:
          type: array
          description: >-
            List of tools the model decides to invoke (appears when
            `role=assistant`).
          items:
            type: object
            required:
              - id
              - type
              - function
            properties:
              id:
                type: string
                description: Unique ID of the tool call.
              type:
                type: string
                description: 'Tool type. Fixed value: `function`.'
                enum:
                  - function
              function:
                type: object
                required:
                  - name
                  - arguments
                description: Details of the function call.
                properties:
                  name:
                    type: string
                    description: Name of the function to be called.
                  arguments:
                    type: string
                    description: JSON string containing the function call arguments.
    Usage:
      type: object
      description: Token usage statistics for this request.
      properties:
        total_tokens:
          type: integer
          description: Total number of tokens consumed.
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: >-
        `HTTP: Bearer Auth`

        - Security Scheme Type: http

        - HTTP Authorization Scheme: `Bearer API_key`, can be found in [Account
        Management>API
        Keys](https://platform.minimax.io/user-center/basic-information/interface-key).

````

---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt