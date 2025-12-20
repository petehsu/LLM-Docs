# Create Speech Generation Task

> Use this API to create an asynchronous Text-to-Speech task.

### Returned File Information

The return result for a single file input is shown below.\
If the input is a compressed package containing multiple files, a corresponding folder will be generated for each file. The contents inside each folder are the same as those for a single file input.

### Input File Type: txt File

* Output Files:
  * Audio File: Format follows the request body settings.
  * Subtitle File: Sentence-level subtitle information.
  * Extra JSON File: Additional information related to the audio file.

### Input File Type: json File

* `title` Field Output Files (if this field is empty, no files will be generated)
  * Audio File: Format follows the request body settings
  * Subtitle File: Sentence-level subtitle information
  * Extra JSON File: Additional information related to the audio file
* `content` Field Output Files (if this field is empty, no files will be generated)
  * Audio File: Format follows the request body settings
  * Subtitle File: Sentence-level subtitle information
  * Extra JSON File: Additional information related to the audio file
* `extra` Field Output Files (if this field is empty, no files will be generated)
  * Audio File: Format follows the request body settings
  * Subtitle File: Sentence-level subtitle information
  * Extra JSON File: Additional information related to the audio file


## OpenAPI

````yaml api-reference/speech/t2a-async/api/openapi.json post /v1/t2a_async_v2
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
  /v1/t2a_async_v2:
    post:
      tags:
        - Text to Audio
      summary: Text to Audio Async V2
      operationId: t2aAsyncV2
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
              $ref: '#/components/schemas/T2AAsyncV2Req'
            examples:
              Text Input:
                value:
                  model: speech-2.6-hd
                  text: >-
                    Omg, the real danger is not that computers start thinking
                    like people, but that people start thinking like computers.
                    Computers can only help us with simple tasks.
                  language_boost: auto
                  voice_setting:
                    voice_id: English_expressive_narrator
                    speed: 1
                    vol: 1
                    pitch: 1
                  pronunciation_dict:
                    tone:
                      - Omg/Oh my god
                  audio_setting:
                    audio_sample_rate: 32000
                    bitrate: 128000
                    format: mp3
                    channel: 2
                  voice_modify:
                    pitch: 0
                    intensity: 0
                    timbre: 0
                    sound_effects: spacious_echo
              File Input:
                value:
                  model: speech-2.6-hd
                  text_file_id: text_file_id
                  language_boost: auto
                  voice_setting:
                    voice_id: English_expressive_narrator
                    speed: 1
                    vol: 10
                    pitch: 1
                  pronunciation_dict:
                    tone:
                      - Omg/Oh my god
                  audio_setting:
                    audio_sample_rate: 32000
                    bitrate: 128000
                    format: mp3
                    channel: 2
                  voice_modify:
                    pitch: 0
                    intensity: 0
                    timbre: 0
                    sound_effects: spacious_echo
        required: true
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/T2AAsyncV2Resp'
              examples:
                Text Input:
                  value:
                    task_id: 95157322514444
                    task_token: eyJhbGciOiJSUz
                    file_id: 95157322514444
                    usage_characters: 101
                    base_resp:
                      status_code: 0
                      status_msg: success
                File Input:
                  value:
                    task_id: 95157322514444
                    task_token: eyJhbGciOiJSUz
                    file_id: 95157322514444
                    usage_characters: 101
                    base_resp:
                      status_code: 0
                      status_msg: success
components:
  schemas:
    T2AAsyncV2Req:
      type: object
      required:
        - model
        - text
        - text_file_id
        - voice_setting
      properties:
        model:
          type: string
          description: Model version to call. Supported
          enum:
            - speech-2.6-hd
            - speech-2.6-turbo
            - speech-02-hd
            - speech-02-turbo
            - speech-01-hd
            - speech-01-turbo
        text:
          type: string
          description: >-
            Text content to convert to audio, max length **50,000 characters**.
            Mutually exclusive with `text_file_id`  (one is required).
        text_file_id:
          type: integer
          format: int64
          description: >-
            ID of the text file to synthesize. Max **100,000 characters**.
            Supported formats: **txt, zip**. Mutually exclusive with `text` (one
            is required).


            - **txt file**: Supports customizing speech pauses by adding markers
            in the form `<#x#>`, where `x` is the pause duration in seconds.
            Valid range: `[0.01, 99.99]`, up to two decimal places. Pause
            markers must be placed between speakable text segments and cannot be
            used consecutively.


            - **zip file**: Must contain files of the same type (txt or json).

              - **json format** supports [`"title"`, `"content"`, `"extra"`] fields. Each non-empty field generates an audio file, subtitles, and metadata and would be stored in a folder.
        voice_setting:
          $ref: '#/components/schemas/T2AAsyncV2VoiceSetting'
        audio_setting:
          $ref: '#/components/schemas/T2AAsyncV2AudioSetting'
        pronunciation_dict:
          $ref: '#/components/schemas/T2AAsyncV2PronunciationDict'
        language_boost:
          type: string
          description: >-
            Controls whether recognition for specific minority languages and
            dialects is enhanced. Default is `null`. If the language type is
            unknown, set to `"auto"` and the model will automatically detect it.
          enum:
            - Chinese
            - Chinese,Yue
            - English
            - Arabic
            - Russian
            - Spanish
            - French
            - Portuguese
            - German
            - Turkish
            - Dutch
            - Ukrainian
            - Vietnamese
            - Indonesian
            - Japanese
            - Italian
            - Korean
            - Thai
            - Polish
            - Romanian
            - Greek
            - Czech
            - Finnish
            - Hindi
            - Bulgarian
            - Danish
            - Hebrew
            - Malay
            - Persian
            - Slovak
            - Swedish
            - Croatian
            - Filipino
            - Hungarian
            - Norwegian
            - Slovenian
            - Catalan
            - Nynorsk
            - Tamil
            - Afrikaans
            - auto
          default: null
        voice_modify:
          $ref: '#/components/schemas/VoiceModify'
    T2AAsyncV2Resp:
      type: object
      properties:
        task_id:
          type: string
          description: Task ID
        file_id:
          type: integer
          format: int64
          description: >-
            The corresponding audio file ID is returned once the task is
            successfully created.


            When the task is complete, you can use the `file_id` to call the
            [File (Retrieve) API](/api-reference/file-management-retrieve) to
            download the file.


            If the request fails, this field will not be returned.


            Note: The download URL is valid for **9 hours (32,400 seconds)**
            from the time it is generated. After expiration, the file will no
            longer be available and the generated data will be lost, so please
            ensure you download it within the validity period.
        task_token:
          type: string
          description: Token for completing the task
        usage_characters:
          type: integer
          description: Number of billed characters
        base_resp:
          $ref: '#/components/schemas/BaseResp'
    T2AAsyncV2VoiceSetting:
      type: object
      required:
        - voice_id
      properties:
        voice_id:
          type: string
          description: "The ID of the target voice.  \r\n- To apply mixed voices, configure the `timber_weights` parameter and leave this value empty.  \r\n- Supports system voices, cloned voices, and AI-generated voices. Below is a selection of the latest system voices (IDs). The full list of available voices can be viewed on the [System Voice ID List](/faq/system-voice-id) or retrieved programmatically using the [Get Voice API](/api-reference/voice-management-get).  \r\n  - Chinese:\r\n    - moss_audio_ce44fc67-7ce3-11f0-8de5-96e35d26fb85\r\n    - moss_audio_aaa1346a-7ce7-11f0-8e61-2e6e3c7ee85d\r\n    - Chinese (Mandarin)_Lyrical_Voice\r\n    - Chinese (Mandarin)_HK_Flight_Attendant\r\n\r\n  - English:\r\n    - English_Graceful_Lady\r\n    - English_Insightful_Speaker\r\n    - English_radiant_girl\r\n    - English_Persuasive_Man\r\n    - moss_audio_6dc281eb-713c-11f0-a447-9613c873494c\r\n    - moss_audio_570551b1-735c-11f0-b236-0adeeecad052\r\n    - moss_audio_ad5baf92-735f-11f0-8263-fe5a2fe98ec8\r\n    - English_Lucky_Robot\r\n\r\n  - Japanese:\r\n    - Japanese_Whisper_Belle\r\n    - moss_audio_24875c4a-7be4-11f0-9359-4e72c55db738\r\n    - moss_audio_7f4ee608-78ea-11f0-bb73-1e2a4cfcd245\r\n    - moss_audio_c1a6a3ac-7be6-11f0-8e8e-36b92fbb4f95"
        speed:
          type: number
          format: float
          description: |-
            Speech speed. Higher values result in faster speech.
            Range: `[0.5, 2]` (default: `1.0`).
          minimum: 0.5
          maximum: 2
          default: 1
        vol:
          type: number
          format: float
          description: |-
            Speech volume. Higher values increase loudness.
            Range: `(0, 10]` (default: `1.0`).
          exclusiveMinimum: 0
          maximum: 10
          default: 1
        pitch:
          type: integer
          description: |-
            Speech pitch adjustment.
            Range: `[-12, 12]` (default: `0`, original pitch).
          minimum: -12
          maximum: 12
          default: 0
        emotion:
          type: string
          description: "Emotion control for synthesized speech. Supported values:  `[\"happy\", \"sad\", \"angry\", \"fearful\", \"disgusted\", \"surprised\", \"calm\", \"fluent\", \"whisper\"]`.  \r\n- By default, the model automatically selects the most natural emotion based on text.  Manual specification is only recommended when explicitly needed.  \r\n- Available for models: `speech-2.6-hd`, `speech-2.6-turbo`, `speech-02-hd`, `speech-02-turbo`, `speech-01-hd`, `speech-01-turbo`.  \r\n- Option `fluent`, `whisper` is only available for models: `speech-2.6-turbo`, `speech-2.6-hd`."
          enum:
            - happy
            - sad
            - angry
            - fearful
            - disgusted
            - surprised
            - calm
            - fluent
            - whisper
        english_normalization:
          type: boolean
          description: >-
            Enable text normalization for English. Improves performance in
            digit-reading scenarios at the cost of slightly higher latency.
            Default: false.
          default: false
        latex_read:
          type: boolean
          description: >-
            Enable LaTeX formula reading.


            - Formulas must be wrapped with `$$`.

            - If the request contains a formula with `"\"`, it must be escaped
            as `"\\"`.


            Example: The quadratic formula

            ![The quadratic
            formula](https://filecdn.minimax.chat/public/d6f62e9a-cd3f-4f55-a237-257eef531683.png)


            should be written as `$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$`
          default: false
    T2AAsyncV2AudioSetting:
      type: object
      properties:
        audio_sample_rate:
          type: integer
          format: int64
          default: 32000
          description: >-
            Specifies the sampling rate of the generated audio. Supported
            values: [`8000`, `16000`, `22050`, `24000`, `32000`, `44100`].
        bitrate:
          type: integer
          format: int64
          default: 128000
          description: >-
            Specifies the bitrate of the generated audio. Supported values:
            [`32000`, `64000`, `128000`, `256000`]. 

            Note: This parameter only applies to audio in `mp3` format.
        format:
          type: string
          description: >-
            Specifies the format of the generated audio. Supported values:
            [`mp3`, `pcm`, `flac`] .

            Note: `wav` is only supported in non-streaming mode.
          enum:
            - mp3
            - pcm
            - flac
          default: mp3
        channel:
          type: integer
          format: int64
          default: 2
          description: >-
            Specifies the number of audio channels. Supported values: [`1`,
            `2`].

            `1` = mono

            `2` = stereo

            Default is `1`.
    T2AAsyncV2PronunciationDict:
      type: object
      properties:
        tone:
          type: array
          description: >-
            Defines pronunciation rules for specific characters or symbols.


            For Chinese text, tones are represented numerically: 1 = first tone,
            2 = second tone, 3 = third tone, 4 = fourth tone, 5 = neutral tone.


            Example: `["omg/oh my god"]`
          items:
            type: string
    VoiceModify:
      type: object
      description: 'Voice effect settings. Supported formats: mp3, flac.'
      properties:
        pitch:
          type: integer
          description: >-
            Corresponds to the "Deepen/Brighten" slider on the official page.
            Range: `[-100, 100]`. Values closer to -100 produce a deeper voice,
            while values closer to 100 result in a brighter tone.


            ![pitch
            adjustment](https://filecdn.minimax.chat/public/75af719d-e126-4297-b3cb-416f382e04ec.png)
          minimum: -100
          maximum: 100
        intensity:
          type: integer
          description: >-
            Corresponds to the "Stronger/Softer" slider on the official page.
            Range: `[-100, 100]`. Values closer to -100 create a stronger, more
            forceful sound, while values closer to 100 yield a softer tone.


            ![intensity
            adjustment](https://filecdn.minimax.chat/public/14015a81-d9c4-459b-9536-15c511aac6c0.png)
          minimum: -100
          maximum: 100
        timbre:
          type: integer
          description: >-
            Corresponds to the "Nasal/Crisp" slider on the official page. Range:
            `[-100, 100]`. Values closer to -100 produce a fuller, richer sound,
            while values closer to 100 generate a crisper tone.


            ![timbre
            adjustment](https://filecdn.minimax.chat/public/86ab8ff8-896c-4254-b181-017d9d14000e.png)
          minimum: -100
          maximum: 100
        sound_effects:
          type: string
          description: >-
            Sound effects. Only one can be applied at a time. Options:
            `spacious_echo`, `auditorium_echo`, `lofi_telephone`, `robotic`
          enum:
            - spacious_echo
            - auditorium_echo
            - lofi_telephone
            - robotic
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