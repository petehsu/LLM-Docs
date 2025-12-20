# Query Speech Generation Task Status

> Use this API to query the status of an asynchronous Text-to-Speech task.

**Note: This API allows a maximum of 10 queries per second.**


## OpenAPI

````yaml api-reference/speech/t2a-async/api/openapi.json get /v1/query/t2a_async_query_v2
openapi: 3.1.0
info:
  title: MiniMax T2A Async API
  description: >-
    MiniMax Text-to-Audio Async API with support for long text processing and
    task querying
  license:
    name: MIT
  version: 1.0.0
servers:
  - url: https://api.minimax.io
security:
  - bearerAuth: []
paths:
  /v1/query/t2a_async_query_v2:
    get:
      tags:
        - Text to Audio
      summary: Query T2A Async V2 Task Status
      operationId: t2aAsyncV2Query
      parameters:
        - name: task_id
          in: query
          required: true
          description: The task ID returned when the task was submitted.
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/T2AAsyncV2QueryResp'
components:
  schemas:
    T2AAsyncV2QueryResp:
      type: object
      properties:
        task_id:
          type: integer
          format: int64
          description: The task ID.
        status:
          type: string
          description: |-
            The current status of the task.

            - **Processing**: The task is still being processed
            - **Success**: The task has completed successfully
            - **Failed**: The task failed
            - **Expired**: The task has expired
          enum:
            - success
            - failed
            - expired
            - processing
        file_id:
          type: integer
          format: int64
          description: >-
            The ID of the audio file generated when the task was created. Once
            the task is complete, you can use the `file_id` to download the file
            via the [File(Retrieve)
            API](https://www.minimax.io/docs/api-reference/file-management-retrieve).


            This field will not be returned if the request encounters an error.


            Note: The returned download URL is valid for **9 hours (32,400
            seconds)** from the time it is generated.
        base_resp:
          $ref: '#/components/schemas/BaseResp'
      example:
        task_id: 95157322514444
        status: Processing
        file_id: 95157322514496
        base_resp:
          status_code: 0
          status_msg: success
    BaseResp:
      type: object
      description: Status code and details.
      required:
        - status_code
        - status_msg
      properties:
        status_code:
          type: integer
          format: int64
          description: >-
            The status code.


            - `0`: Request succeeded

            - `1000`: Unknown error

            - `1001`: Timeout

            - `1002`: Rate limit exceeded

            - `1004`: Authentication failed

            - `1042`: More than 10% invalid characters

            - `2013`: Invalid input format


            For more details, see [Error Code
            Reference](/api-reference/errorcode).
        status_msg:
          type: string
          description: Detailed status message.
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