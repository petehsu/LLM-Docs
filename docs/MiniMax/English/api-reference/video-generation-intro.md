# Video Generation

> This API supports generating videos based on user-provided text, images (including first frame, last frame, or reference images).

## Supported Models

| Model                   | Description                                                                                                             |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| MiniMax-Hailuo-2.3      | New video generation model, breakthroughs in body movement, facial expressions, physical realism, and prompt adherence. |
| MiniMax-Hailuo-2.3-Fast | New Image-to-video model, for value and efficiency.                                                                     |
| MiniMax-Hailuo-02       | Video generation model supporting higher resolution (1080P), longer duration (10s), and stronger adherence to prompts.  |

## API Usage Guide

Video generation is asynchronous and consists of three APIs: **Create Video Generation Task**, **Query Video Generation Task Status**, and **File Management**. Steps are as follows:

1. Use the **Create Video Generation Task API**: ([Text to Video](/api-reference/video-generation-t2v), [Image to Video](/api-reference/video-generation-i2v), [Start / End to Video](/api-reference/video-generation-fl2v), [Subject Reference to Video](/api-reference/video-generation-s2v)) to start a task. On success, it will return a `task_id`.
2. Use the [Query Video Generation Task Status API](/api-reference/video-generation-query) with the `task_id` to check progress. When the status is `success`, a file ID (`file_id`) will be returned.
3. Use the [Download the Video File API](/api-reference/video-generation-download) with the `file_id` from step 2 to view and download the generated video.

## Official MCP

Visit the official MCP for more capabilities: [https://github.com/MiniMax-AI/MiniMax-MCP](https://github.com/MiniMax-AI/MiniMax-MCP)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt