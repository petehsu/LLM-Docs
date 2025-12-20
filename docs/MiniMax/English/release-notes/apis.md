# APIs

> Track the latest MiniMax API updates to help developers build smarter, more seamless applications.

## Oct. 28, 2025

* **Video Generation API**: Added two new models — **MiniMax-Hailuo-2.3** and **MiniMax-Hailuo-2.3-Fast**
* **MiniMax-Hailuo-2.3** supports both Text-to-Video (T2V) and Image-to-Video (I2V) generation modes
* **MiniMax-Hailuo-2.3-Fast** supports Image-to-Video (I2V) generation mode
* Both models support 768P (6s, 10s) and 1080P (6s) resolutions

## Sept. 23, 2025

* T2A v2 API Update: Constant Bitrate Control A new sub-parameter `force_cbr`( boolean ) has been added under the `audio_setting` parameter.

  Set `force_cbr` to `true` to enable CBR audio encoding.

## Aug. 2, 2025

* Enabled image-to-video generation for the MiniMax-Hailuo-02 model, supporting 512p resolution with selectable durations of 6 or 10 seconds.
* Added the `fast_pretreatment` ( boolean ) parameter to control the prompt expansion model, which can shorten processing latency when enabled.

## Jul. 19, 2025

* Added the `voice_modify` parameter to both Synchronous ( T2A ) ( HTTP & WebSocket ) and Asynchronous speech synthesis ( T2A Async ) allowing for adjustment of voice effects like pitch and volume.

## Jul. 15, 2025

* **New Feature:** Introduced the **Video Agent API** for template-based video creation, starting with **11** regularly updated templates.

## Jun. 20, 2025

* **New Feature:** Introduced the **Voice Design** a new capability allowing for the generation of custom voice timbres via text prompts.
* **Deprecation Notice:** The previous text-to-voice API is now considered legacy. Service for this endpoint will continue uninterrupted, but it will not receive future updates and has been relocated to the historical API directory.

## Apr. 25, 2025

* **New Feature:** Added width and height parameters to the image-01 model, enabling users to generate images with custom dimensions.


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt