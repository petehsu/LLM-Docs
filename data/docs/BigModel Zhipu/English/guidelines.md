[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fguidelines%2FLanguageModels)

GLM Model Fully Upgraded

Invite friends & Get rewards

Get up to 200M Tokens

![大模型](https://cdn.bigmodel.cn/static/platform/images/logo/white_logo.png)

Try Zhipu’s New Flagship

GLM-4.6!

### Sign Up to Unlock AI capabilities

* Expert at coding, agents, reasoning, and more
* Get 20 millionfree Tokens on registration

Scan code

![智谱AI](https://cdn.bigmodel.cn/static/platform/images/activity/university/pop_right_bottom_new.png)

绑定手机号

确 定

[Welcome](/dev/welcome)  [Guide](/dev/howuse)  [API Documentation](/dev/api)  [Guidelines](/dev/guidelines)  [ReleaseNotes](/dev/releasenotes)  [FAQs](/dev/faq)  [Model Benefit](/dev/activities) 

`⌘``K`

Prompt

[* Language Models](/dev/guidelines/LanguageModels)

[* VideoGeneration](/dev/guidelines/VideoGeneration)

[* BatchAPI](/dev/guidelines/BatchAPI)

[* Json Format](/dev/guidelines/JsonFormat)

[* Model Evaluation](/dev/guidelines/model_evaluation)

Case study

[* Intelligent Translation](/dev/guidelines/translation)

[* Social Media Translation](/dev/guidelines/social_media_translation)

[* HR Recruit](/dev/guidelines/hr_recruit)

[* Paper Analysis](/dev/guidelines/paper_analysis)

[* Multi-Agent AI Search Engine](/dev/guidelines/aisearchagent)

[* AI Essay Scoring](/dev/guidelines/AI_essay_scoring)

[* Data Extraction](/dev/guidelines/dataextraction)

[* Data Analysis](/dev/guidelines/dataanalysis)

[* Spreadsheet Plugin](/dev/guidelines/sheetplugin)

[* FinAgent](/dev/guidelines/FinAgent)

Creative Practice

[* AI News](/dev/guidelines/ainews)

[* Podcast Generate](/dev/guidelines/podcast_generate)

[* GraphRAG](/dev/guidelines/graphrag)

[* Mock Interview](/dev/guidelines/mock_interview)

[* Neologism](/dev/guidelines/neologism)

[* Modify Video](/dev/guidelines/modifyvideo)

[FAQ](//docs.bigmodel.cn/cn/faq) 

Customer Service

[Work Order](/ticket-submit) 

Consultation

[400-6883-991](tel:4006883991)

Weekdays 9:30-18:00

Help Center 

![ZHIPU·AI](https://cdn.bigmodel.cn/static/platform/images/qr-code/technical_community.png)

##### Scan via Wechat

User Group

# Prompt Engineering Guide

This guide shares strategies for obtaining better generation results with the GLM language model and the CogView image generation model. Combining prompt techniques can enhance generation effectiveness.

## Language Model Prompt Engineering

### Strategy: Write Clear and Specific Instructions

To achieve the best responses, users need to provide GLM with clear and specific instructions. The more GLM understands your needs, the higher the quality of the responses.

* **Technique: Define System Prompt**

  + A tool to set the behavior pattern of the AI assistant, including role setting, language style, task mode, and specific behavioral guidance for certain issues.
  + ```
    You excel at extracting key information from text, precise and data-driven, focusing on highlighting critical information. Based on user-provided text snippets, extract key data and facts and present the extracted information in a clear JSON format.
    ```

    1
* **Technique: Provide Specific Detail Requirements**

  + Add details and background information about the content you want the model to output in the prompt.
  + ```
    I am very interested in the planets of the solar system, especially Saturn. Please provide basic information about Saturn, including its size, composition, ring system, and any unique astronomical phenomena.
    ```

    1
* **Technique: Have GLM Role-Play**

  + Having GLM play a role can more accurately mimic the behavior and dialogue style of that role.
  + ```
    As a quantum physicist, explain the basic principles of quantum physics and briefly introduce its applications in modern technology.
    ```

    1
* **Technique: Use Delimiters to Mark Different Input Parts**

  + ```
    Please summarize the core points and outline based on the following content:
    """Article content to be summarized"""
    ```

    1  
    2
* **Technique: Chain of Thought Prompting**

  + Require the model to solve problems step by step and display each step of its reasoning process. This method can reduce the likelihood of inaccurate results and make it easier for users to evaluate the model’s responses.
  + ```
    As an AI assistant, your task is to help users solve complex math problems. For each problem, you need to solve it independently first, then compare and evaluate the user's answer, and finally provide feedback. During this process, please show each step of your reasoning. I have a math problem for help: """The problem is: A farm has a total of 35 chickens and cows, with 94 feet in total. How many chickens and cows are there? My answer is 23 chickens and 12 cows."""
    ```

    1
* **Technique: Few-Shot Learning**

  + Can serve as examples for few-shot learning. These samples can guide the model to mimic specific behaviors and language styles.
  + ```
    Mimic this style
    '''1. Three cups of chicken dancing in the pot, the bonfire of years, the romance of the melody.
    2. The taste of stewed ribs, the quilt of winter, the echo of the homeland.
    3. The fragrance of braised diligent fish, the secret whisper of the ocean, the love letter of the sea.'''
    Generate a new sentence.
    ```

    1  
    2  
    3  
    4  
    5
* **Specify Output Length Example**

  + Specify the output content according to a specific length, but it is difficult for the model to precisely generate a specific number of words.
  + ```
    Please summarize this article in no more than 100 words.
    ```

    1

### Strategy: Provide Reference Materials

Citing external materials can effectively improve the accuracy of model responses. This practice is particularly useful for document-based question-answering systems, as it helps reduce errors or the generation of fictitious information, while ensuring the timeliness and accuracy of responses. When the model is limited by the context length and cannot cite long texts, semantic slices from documents can be obtained through Retrieval tools.

* ```
  As an AI assistant, your task is to help users find and understand specific company regulations. In this scenario, you will use search results to answer user queries about company leave policies. Please provide accurate and detailed information based on the search results:
  """Specific search results"""
  ```

  1  
  2

### Strategy: Decompose Complex Tasks into Simple Subtasks

When dealing with complex tasks, the error rate is generally higher. To improve efficiency and accuracy, it is best to restructure these complex tasks into a series of simple, coherent subtasks. In this method, the completion of each subtask sequentially becomes the starting point for the next task, forming an efficient workflow. This task flow simplification helps improve the overall processing quality and reliability of the model, especially when facing complex issues that require comprehensive data and in-depth analysis. By decomposing complex tasks, the model’s powerful processing capabilities can be more effectively utilized.

* **Technique: Intent Understanding and Entity Extraction**

  + Require the large model to output content directly for backend service interface use, so the large model must output in a fixed format to facilitate interface parsing of model output content and prevent errors.
  + ```
    When you understand the user's intent to book a meeting room, extract the relevant entities and output in JSON format.
    ```

    1
* **Technique: Summarize Key Information from Previous Text**

  + In long conversations, to ensure the coherence and effectiveness of the dialogue, refining and summarizing previous communication content can maintain the focus of the dialogue, reduce repetition and confusion, and speed up model processing.
* **Technique: Segment Long Documents and Build a Complete Summary Step by Step**

  + Due to the limited context length of the model in processing text, it cannot summarize text that exceeds a certain length at once. For example, when summarizing a long book, we can adopt a step-by-step approach, summarizing each chapter one by one. Summaries of each chapter can be combined and further summarized to form a more refined overall summary. This process can be repeated until the entire book’s content is fully summarized. If the understanding of subsequent chapters depends on the information from previous chapters, then attaching a coherent summary of previous content in the current part’s summary can significantly improve the model’s generation quality.

### Strategy: Give the Model Thinking Time

* **Technique: Guide the Model to Self-Explore and Reason Before Giving the Final Conclusion**

  + Before explicitly guiding the model to reason and judge, have it generate a result as a benchmark. For example, if we need the model to evaluate the quality of code, we can first have the model generate an answer, and then judge its correctness. This not only encourages the model to understand the task more deeply but also improves the accuracy and reliability of the final result.
  + ```
    Analyze and evaluate the quality and functionality of the following Python code snippet "code snippet". Before generating your answer, please first generate recommended example code, then rate the structure, clarity, and functionality of the code.
    ```

    1
* **Technique: Hide the Reasoning Process, Only Output the Result**

  + Before answering the question, the model sometimes needs to perform in-depth reasoning and output the reasoning process together. You can guide the model to only output the result or structured information for easy parsing.
  + ```
    Please calculate the integral of the function f(x) = x^2 over the interval [0, 1]. Provide only the final integral result, no need to show the reasoning process.
    ```

    1

### Strategy: Use External Tools to Enhance Model Capabilities

By allowing the model to access information through tools to compensate for the model’s shortcomings and expand its functions, such as accessing external information and performing operations through Function Call, and using Retrieval tools to access document information from a knowledge base.

* **Technique: Access External APIs via Function Call**

  + Allow the model to access external information and perform operations, such as real-time weather forecasts, stock market dynamics, providing instant and accurate data, and performing operations such as playing music, controlling smart home devices, etc.
  + ```
    Use the external API to query weather information. Please call the corresponding weather service API based on the user's request, obtain and display the latest weather information, including temperature, humidity, weather conditions (such as sunny, rainy, etc.), wind speed, and wind direction. For example, when a user asks 'What is the weather like in Beijing today?', the API should be called to obtain the current weather data for Beijing and display the results in a user-friendly manner.
    ```

    1
* **Technique: Access the Knowledge Base of the Zhipu AI Open Platform via Retrieval**

  + By using the Retrieval method to access the knowledge base of the Zhipu Open Platform, users can upload relevant knowledge to the knowledge base. The model will extract relevant semantic slices based on the user’s query and provide more accurate and detailed information.
  + ```
    As an AI assistant, your task is to help users find and understand specific company regulations. Users inquire about relevant company policies. You will search the company's internal knowledge base or related documents to find the latest regulations. Based on the search content, provide detailed information about the relevant policies. Please ensure the accuracy and applicability of the information provided to help users fully understand the company's policies.
    ```

    1

## Image Generation Model Prompt Engineering

### Strategy: Use Structured Prompts

When using image generation tools, precise and specific visual descriptions rather than abstract concepts should be used. Clear and structured prompts can help CogView create higher quality images.

* **Subject**: Person, animal, building, object, etc.
* **Medium**: Photo, painting, illustration, sculpture, graffiti, etc.
* **Environment**: Bamboo forest, lotus pond, desert, on the moon, underwater, etc.
* **Light**: Natural light, volumetric light, neon lights, studio lights, etc.
* **Color**: Monochrome, polychrome, rainbow color, soft color, etc.
* **Emotion**: Happy, angry, sad, surprised, etc.
* **Composition/Angle**: Portrait, close-up, profile, aerial view, etc.

| Prompt | Generated Result |
| --- | --- |
| A lively Border Collie running joyfully on a green lawn under the morning sun, captured in vivid color photography, conveying a cheerful atmosphere and bright colors. | img |
| An ancient stone bridge surrounded by weeping willows on a calm river, depicted in a black and white ink painting, showing its tranquility and classical beauty under the sun, with sharp contrasts of light and shadow in the picture. | img |
| An open ancient book resting on an old wooden table, softly illuminated by the light of a desk lamp, in a dimly lit library environment. This scene is captured through a high-definition photo, showcasing the serene beauty of knowledge and history. | img |
| A solitary cactus standing out in the dry desert environment under the sunset glow. This oil painting captures the cactus’s resilient life force and the magnificent scenery of the desert, with rich colors and strong expressive power. | img |
| A rustic wooden cabin deeply hidden in a dense forest, illuminated by warm lights at night. This oil painting captures the tranquility and harmony of the natural environment around the cabin, using soft tones and delicate light and shadow processing, creating a mysterious and warm atmosphere. The painting highlights the cabin as a secluded refuge, along with the natural beauty of the surrounding trees and shrubs. | img |

## Batch API Prompt Engineering

Batch API is suitable for scenarios that do not require immediate feedback but need to process a large number of requests. Below are some typical tasks and best practice prompts to help you better use the Batch API. Can’t find a prompt suitable for your task? Try our [Prompt Optimization Expert](https://chatglm.cn/share/FW4o9) .

### Task One: Text Classification

Classify large amounts of text data into predefined categories, such as news classification and spam detection.

```
# Role: News Classifier

## Goals
- Classify given news and output the corresponding category.

## Constraints
- News must belong to one of the following categories: Military, Finance, People's Livelihood, Culture, Other, To Be Classified.
- The output result must be the category name only, without any other redundant information.

## Skills
- Enhanced news classification ability
- Understanding and parsing news content
- Determining the news category

## Output
- Output format: Category name

## Workflow
1. Read and understand the given news: "Please insert news here".
2. Determine the category based on the news content.
3. Output the determined category name.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21

### Task Two: Sentiment Analysis

Identify and analyze the sentiment tendency in text, such as positive, negative, or neutral sentiment.

```
# Role: Sentiment Analysis Expert

## Goals
- Perform sentiment analysis on the given text and output the corresponding category.

## Constraints
- Text must belong to one of the following categories: Positive, Negative, Neutral.
- The output result must be the category name only, without any other redundant information.

## Skills
- Professional knowledge of sentiment analysis
- Understanding and parsing text content
- Determining the sentiment tendency of the text

## Output
- Output format: Category name

## Workflow
1. Read and understand the given text content "Please insert text to be analyzed here".
2. Determine the sentiment tendency based on the text content.
3. Output the determined category name.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21

### Task Three: Document Processing

Process and analyze large amounts of documents, such as document summarization, key information extraction, etc.

```
# Role: Academic Summary Expert

## Goals
- Generate a summary of the given paper, concisely summarizing the main content and conclusions of the paper.

## Constraints
- The summary must be concise and to the point.
- The summary length should be controlled within 150 words.
- The output result must be the summary content only, without any other redundant information.

## Skills
- Professional knowledge of academic paper analysis and summary
- Efficiently extracting the main content and conclusions of the paper
- Generating clear and concise summaries

## Output
- Output format: Summary content

## Workflow
1. Read and understand the given paper content "Please insert paper to be summarized here".
2. Extract the main content and conclusions of the paper.
3. Generate a concise summary and output the summary content.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22

### Task Four: Information Extraction

Extract structured information from large amounts of text, such as Named Entity Recognition (NER), relation extraction, event extraction, etc.

```
# Role: Named Entity Recognition Expert

## Goals
- Perform named entity recognition on the given text.

## Constraints
- Must recognize entities of the following categories: Person names, locations, organizations.
- The output result must be the entity information only, without any other redundant information.

## Workflow
1. Read and understand the given text content "Please insert text to be analyzed here".
2. Output the recognized person names, locations, and organizations.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12

### Task Five: Machine Translation

Large-scale text translation tasks, translating text from one language to another.

```
# Role: Translation Expert

## Goals
- Focus on the field of multilingual translation, providing accurate and fluent translation services.

## Constraints
- The translation must be accurate, retaining the meaning and tone of the original text.
- The translation result must be fluent and natural, conforming to the expression habits of the target language.

## Skills
- Professional knowledge of multilingual translation
- Understanding and accurately translating text content
- Ensuring the fluency and accuracy of the translation result

## Output
- Output format: Fluent and accurate text in the target language

## Workflow
1. Read and understand the given text content: "Please insert text to be translated here".
2. Translate the text from [source language] to [target language].
3. Ensure the translation result is fluent, accurate, and conforms to the expression habits of the target language.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21

### Task Six: Generation Tasks

Utilize the language model to generate large amounts of text content, such as writing SEO articles, novel creation, etc.

```
# Role: SEO Content Expert

## Goals
- Write an SEO article to ensure the content includes specific keywords to improve search engine rankings.

## Constraints
- Must include specified keywords and naturally integrate them into the article.
- The article content should be valuable, providing unique insights, and maintain a natural and smooth reading experience.
- Conform to the specified word count range.

## Skills
- Professional SEO optimization knowledge
- Efficient content creation ability
- Understanding and naturally integrating keywords

## Workflow
1. Determine the theme of the article: "Please specify the theme or title of the article"
2. List the keywords to be optimized: "Please list the keywords to be optimized here"
3. Write the article, focusing on the keywords, providing valuable and unique content.
4. Ensure the article is natural and smooth, conforming to SEO best practices.
5. Output the article text within the specified word count range.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21

### Task Seven: Text Correction

Automatically detect and correct spelling errors, grammatical errors, etc., in large amounts of text.

```
# Role: Grammar and Spelling Correction Expert

## Goals
- Detect and correct grammatical errors, spelling errors, and other common writing errors in the given text.

## Constraints
- Must detect and correct all obvious grammatical and spelling errors.
- Maintain the original meaning of the text, improving the accuracy and readability of the text.

## Skills
- Professional grammar and spelling correction ability
- Understanding and parsing text content
- Ensuring the corrected text is fluent and accurate

## Output
- Output format: Corrected text

## Workflow
1. Read and understand the given text content: "Please insert text to be corrected here"
2. Detect grammatical errors, spelling errors, and other writing errors in the text.
3. Correct all detected errors, ensuring the text is accurate and readable### Task Eight: Image Classification

Classify large amounts of images, such as identifying objects in images, scene classification, etc.

```python
## Goals
- Classify images into one of the predefined categories

## Workflow
1. Read and understand the given image content.
2. Based on the image content, select a category from the predefined category list "Predefined Categories"
3. Output the image category.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22  
23  
24  
25  
26  
27  
28  
29  
30  
31  
32

### Task Nine: Image Annotation

Provide accurate annotations for images, such as marking coordinates in the image content.

```
# Role: Coordinate Annotation Expert

## Goals
- Mark specified coordinate points in the image and provide accurate coordinate annotation services.

## Constraints
- Must accurately annotate all specified coordinate points in the image.
- Provide detailed annotations for each coordinate point.

## Skills
- Professional image analysis and coordinate annotation ability
- Understanding and parsing image content
- Providing accurate coordinate annotations and notes

## Example
Coordinate Points: [
  {"x": 100, "y": 150, "Annotation": "Example Coordinate 1"},
  {"x": 200, "y": 250, "Annotation": "Example Coordinate 2"}
]

## Workflow
1. Read and understand the given image content.
2. Mark the specified coordinate points in the image.
3. Provide detailed annotations for each coordinate point.
4. Output the annotated image.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22  
23  
24  
25

### Task Ten: Text Extraction

Extract text information from images, such as processing scanned documents, receipts, etc.

```
# Role: Text Extraction Expert

## Goals
- Extract all text information from the following invoice image and provide the extracted fields and their contents.

## Constraints
- Must extract all visible text information from the invoice image.
- Provide each field and its corresponding content.
- Ensure the extracted information is accurate and easily identifiable.

## Skills
- Professional image text extraction ability
- Understanding and parsing invoice content
- Providing accurate field and content extraction

## Example
{
  "Invoice Number": "12345678",
  "Date": "2023-06-01",
  "Amount": "$100.00",
  "Buyer": "Zhang San",
  "Seller": "Li Si",
  "Item Details": [
    {"Name": "Item 1", "Quantity": "2", "Unit Price": "$50.00"}
  ]
}

## Workflow
1. Read and understand the given invoice image content.
2. Extract all visible text information from the invoice image.
3. Determine each field and its corresponding content.
4. Output the extracted fields and their contents.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20  
21  
22  
23  
24  
25  
26  
27  
28  
29  
30  
31  
32

### Task Eleven: Image Content Analysis

Perform in-depth analysis of image content, such as sentiment analysis, medical image recognition, etc.

```
# Role: Image Sentiment Recognition Expert

## Goals
- Analyze the following image and identify the emotions of the people in it.

## Constraints
- Must accurately identify the emotions in the image.
- Only output the emotion category, without any other redundant information.

## Skills
- Professional image sentiment analysis ability
- Understanding and parsing image content
- Providing accurate emotion recognition results

## Workflow
1. Read and understand the given image content.
2. Analyze the emotions in the image and provide the emotion analysis results.
3. Output the emotion analysis results.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18

### Task Twelve: Image to Text Generation

Generate corresponding text descriptions based on image content, such as news reporting, social media content generation, etc.

```
# Role: Xiaohongshu Copywriting Expert

## Goals
- Generate Xiaohongshu-style copy based on the following image.

## Constraints
- The copy must be concise and vivid, conforming to Xiaohongshu's creative style.
- Highlight key elements in the image, emphasizing highlights and attractiveness.
- The content should be interactive, encouraging users to like, comment, and share.

## Skills
- Professional image analysis and copywriting creation ability
- Understanding and parsing image content
- Providing attractive and detailed copy

## Workflow
1. Read and understand the given image content.
2. Analyze key elements and overall context in the image.
3. Generate Xiaohongshu-style copy, concise and vivid, with attractiveness.
4. Output the Xiaohongshu-style copy.
```

1  
2  
3  
4  
5  
6  
7  
8  
9  
10  
11  
12  
13  
14  
15  
16  
17  
18  
19  
20

Table of contents

Language Model Prompt Engineering

Strategy: Write Clear and Specific Instructions

Strategy: Provide Reference Materials

Strategy: Decompose Complex Tasks into Simple Subtasks

Strategy: Give the Model Thinking Time

Strategy: Use External Tools to Enhance Model Capabilities

Image Generation Model Prompt Engineering

Strategy: Use Structured Prompts

Batch API Prompt Engineering

Task One: Text Classification

Task Two: Sentiment Analysis

Task Three: Document Processing

Task Four: Information Extraction

Task Five: Machine Translation

Task Six: Generation Tasks

Task Seven: Text Correction

Task Nine: Image Annotation

Task Ten: Text Extraction

Task Eleven: Image Content Analysis

Task Twelve: Image to Text Generation