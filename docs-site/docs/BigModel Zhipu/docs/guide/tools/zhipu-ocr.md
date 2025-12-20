# OCR 服务

## 产品简介

<Tip>
  本文档旨在帮助开发者、高级用户及系统集成方快速了解并高效使用 OCR 文件解析工具，实现对图片中文字内容的自动识别与结构化输出。
</Tip>

## 产品简介

OCR 文件解析工具支持对各类图像中的文本内容进行识别。可处理印刷体、手写体，并支持中、英、日、韩、法等 20+ 种语言类型。工具能够输出高精度文本识别结果及候选字置信度信息，适用于手写稿件解析、文档数字化、图片文字抽取等多种业务场景。

## 使用说明

* 需要低延迟、即时拿到解析结果的在线处理链路（如用户上传后立刻问答、预览）。
* 单次文件不大、结构复杂度适中，或对纯文本抽取需求为主。

**支持的文件格式与大小**

|   服务项目  | 说明               |
| :-----: | :--------------- |
| 支持的文件类型 | image（图片文件）      |
|  支持的格式  | PNG、JPG、JPEG、BMP |
|  最大文件大小 | **8M**           |

**请求参数说明**

| 参数名称           | 字段类型    | 是否必填 | 说明                                                                                                                                                                   |
| :------------- | :------ | :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| file           | File    | 是    | 图片文件（支持 PNG/JPG/JPEG/BMP），8M 内                                                                                                                                       |
| tool\_type     | String  | 是    | 固定为 `hand_write`，表示执行手写体识别                                                                                                                                           |
| language\_type | String  | 否    | 根据所识别文件可指定识别语言，默认为 `CHN_ENG`，自动检测语言：`AUTO`，可选值包括：`ENG, JAP, KOR, FRE, SPA, POR, GER, ITA, RUS, DAN, DUT, MAL, SWE, IND, POL, ROM, TUR, GRE, HUN, THA, VIE, ARA, HIN` |
| probability    | Boolean | 否    | 是否返回识别结果中每一行的置信度，默认为false，不返回置信度                                                                                                                                     |

**输出参数说明**

| 参数名称               | 字段类型    | 说明                                                                                                                                   |
| :----------------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------- |
| task\_id           | String  | 任务 ID                                                                                                                                |
| message            | String  | 提示信息，例如成功或错误描述                                                                                                                       |
| status             | String  | 状态标识                                                                                                                                 |
| words\_result\_num | Integer | 识别结果数，表示words\_result的元素个数                                                                                                           |
| words\_result      | object  | 文本识别结果对象                                                                                                                             |
| ├── location       | object  | 每行的坐标，包含：<br /> - left： 表示定位位置的长方形左上顶点的水平坐标<br /> - top：表示定位位置的长方形左上顶点的垂直坐标<br /> - width：表示定位位置的长方形的宽度<br /> - height：表示定位位置的长方形的高度 |
| ├── words          | String  | 每一行的识别结果                                                                                                                             |
| └── probability    | object  | 当 probability=true 时返回该字段，表示识别结果中每一行的置信度值，包含：<br /> - average： 行置信度平均值<br /> - variance：行置信度方差<br /> - min：行置信度最小值                   |

## 计费方式

<table>
  <tr>
    <td><strong>计费规则</strong></td>
    <td>OCR 解析工具根据识别过程中调用量中的页数收取费用，当前支持单次单页识别。</td>
  </tr>

  <tr>
    <td><strong>单价</strong></td>
    <td>0.01 元 / 次(页)</td>
  </tr>

  <tr>
    <td><strong>计费计算方式</strong></td>
    <td>请求次数(页数) × 单价 = 费用</td>
  </tr>
</table>

## 使用流程说明

1. 准备图片文件（确保格式与大小符合要求）
2. 根据需要设置可选识别参数（如 tool\_type、language\_type、probability），当已知文件语言时，建议设置对应的 language\_type 以提高识别准确率
3. 调用 OCR 解析接口
4. 获取返回的 JSON 结果
5. 从 words\_result 中读取识别内容
6. 根据需要展示、存储或进一步处理文本

## 最佳实践与建议

* 上传图像尽量保持 清晰、无遮挡、无遮挡反光，提升识别准确率。
* 手写体建议使用 黑色或深色墨迹，背景尽量为浅色。
* 建议对返回结果中的置信度进行业务层过滤，以提升整体系统可信度。

## 调用示例

<Tabs>
  <Tab title="cURL">
    ```bash  theme={null}
    curl --location --request POST 'https://open.bigmodel.cn/api/paas/v4/files/ocr' \
    --header  'Authorization: Bearer your_api_token' \
    --form 'file=@example-file' \
    --form 'tool_type="hand_write"' \
    --form 'language_type="CHN_ENG"' \
    --form 'probability="true"'
    ```
  </Tab>

  <Tab title="Python">
    ```bash  theme={null}
    # 安装最新版本
    pip install zai-sdk

    # 或指定版本
    pip install zai-sdk==0.1.0
    ```

    ```python  theme={null}
    from zai import ZhipuAiClient

    client = ZhipuAiClient(api_key="your api key")

    def handwriting_ocr_example():
        """
        完整示例：提交图片进行识别并等待结果返回。
        """
        # 请修改为本地图片路径
        file_path = 'Your image path'
        with open(file_path, 'rb') as f:
            print("正在提交手写识别任务 ...")
            response = client.ocr.handwriting_ocr(
                file=f,
                tool_type="hand_write",
                probability=True
            )
            print("任务创建成功，返回结果如下：")
            print(response)

        print("手写识别示例结束。")


    if __name__ == "__main__":
        print("=== 手写识别快速演示 ===\n")
        handwriting_ocr_example()
    ```
  </Tab>

  <Tab title="Java">
    **安装 SDK**

    **Maven**

    ```xml  theme={null}
    <dependency>
        <groupId>ai.z.openapi</groupId>
        <artifactId>zai-sdk</artifactId>
        <version>0.1.3</version>
    </dependency>
    ```

    ```java  theme={null}
    public class HandwritingOcrExample {

    public static void main(String[] args) {
      ZhipuAiClient client = ZhipuAiClient.builder()
              .apiKey("your-real-api-key")
              .build();

      try {
          System.out.println("=== 手写识别示例 ===");

          String filePath = ""; // 请修改为你自己的图片路径
          HandwritingOcrResponse response = syncHandwritingOcrExample(client, filePath, "hand_write", "CHN_ENG", true);
          if (response != null && response.getData() != null) {
              System.out.println(response.getData());
          } else {
              System.out.println("识别失败。");
          }
      } catch (Exception e) {
          System.err.println("出现异常: " + e.getMessage());
          e.printStackTrace();
      }
    }

    /**
    * 示例：上传图片并进行手写 OCR 识别
    * @param client ZhipuAiClient 实例
    * @param filePath 图片文件路径
    * @param toolType 识别工具类型
    * @param languageType 语言类型（可选）
    * @return OCR响应对象
    */
    private static HandwritingOcrResponse syncHandwritingOcrExample(ZhipuAiClient client, String filePath, String toolType,
                                                                  String languageType, Boolean probability) {
      if (filePath == null || filePath.trim().isEmpty()) {
          System.err.println("文件路径无效。");
          return null;
      }
      try {
          HandwritingOcrUploadReq uploadReq = new HandwritingOcrUploadReq();
          uploadReq.setFilePath(filePath);
          uploadReq.setToolType(toolType); // 必须为 "hand_write"
          uploadReq.setLanguageType(languageType); // 可以为 "CHN_ENG"、"ENG" 等
          uploadReq.setProbability(probability);
          System.out.println(uploadReq.toString());
          System.out.println("正在上传图片并进行手写识别...调用 API 中");
          return client.handwriting().recognize(uploadReq);
      }
      catch (Exception e) {
          System.err.println("手写识别任务出错: " + e.getMessage());
      }
      // 返回 null 表示失败
      return null;
    }
    }
    ```
  </Tab>

  <Tab title="响应示例">
    ```
    // 成功响应示例
    {
        "task_id": "658c5c5e9d4f4f8c8c8c8c8c",
        "message": "success",
        "status": "succeeded",
        "words_result_num": 11,
        "words_result": [
            {
                "location": {
                    "left": 125,
                    "top": 76,
                    "width": 756,
                    "height": 127
                },
                "words": "book ruler pencil schoolbag"
            },
            ...
        ]
    }
    // 失败响应示例
    {
        "task_id": null,
        "message": "上传的图片格式错误（仅支持PNG、JPG、JPEG、BMP）",
        "status": null,
        "words_result_num": 0
    }
    ```
  </Tab>
</Tabs>


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.bigmodel.cn/llms.txt