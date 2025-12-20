[Dashboard](/console/overview)  [Marketplace](/marketplace/index/agent)  [TrialCenter](/trialcenter/modeltrial/text)  [Documentation](//docs.bigmodel.cn/cn/guide/start/model-overview)  [Special Offer Zone 🔥](/special_area)

* Chinese
* English

 [API Login](/login?redirect=%2Fdev%2Fapi%2Fsearch-tool%2Fweb-search)

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

API REFERENCE

* SDK Calling

  [+ Installation](/dev/api/devguide/sdk-install)

  [+ Authentication](/dev/api/devguide/sdk-auth)

  [+ sdk\_example](/dev/api/devguide/sdk_example)

* HTTP Request

  [+ API Request](/dev/api/http-call/http-para)

  [+ Authentication](/dev/api/http-call/http-auth)

* More Frameworks

  [+ OpenAI SDK](/dev/api/thirdparty-frame/openai-sdk)

  [+ Langchain SDK](/dev/api/thirdparty-frame/langchain-sdk)

APIs

* Language models

  [+ GLM-4 Models](/dev/api/normal-model/glm-4)

  [+ GLM-4V Models](/dev/api/normal-model/glm-4v)

* Reasoning models

  [+ GLM-Z1](/dev/api/Reasoning-models/glm-z1)

* Video Generation

  [+ CogVideoX](/dev/api/videomodel/cogvideox)

  [+ CogVideoX-3](/dev/api/videomodel/cogvideox-3)

  [+ Vidu Models](/dev/api/videomodel/vidu)

* Audio-Video

  [+ GLM-4-Voice](/dev/api/rtav/GLM-4-Voice)

  [+ GLM-Realtime](/dev/api/rtav/GLM-Realtime)

  [+ GLM-ASR](/dev/api/rtav/glm-asr)

* Reasoning models

  [+ GLM-4.1V-Thinking](/dev/api/visual-reasoning-model/GLM-4.1V-Thinking)

* Agent

  [+ TranslationAgent](/dev/api/agent/general_translation)

  [+ Professional Document Translation](/dev/api/agent/doc_translation_agent)

  [+ Social Science and Literary Translation](/dev/api/agent/social_literature_translation_agent)

  [+ Subtitle Translation for Film and Television](/dev/api/agent/subtitle_translation_agent)

  [+ Social Media Translation](/dev/api/agent/social_translation_agent)

  [+ AI Drawing](/dev/api/agent/ai_drawing_agent)

  [+ AI Comics](/dev/api/agent/cartoon_generator_agent)

  [+ Popular Special Effects Videos](/dev/api/agent/vidu_template_agent)

  [+ Resume and Job Matching Assistant](/dev/api/agent/job_matching_agent)

  [+ Customer Service Script Quality Inspection](/dev/api/agent/service_check_agent)

  [+ Sales Quality Inspection](/dev/api/agent/sales_check_agent)

  [+ Bill Recognition](/dev/api/agent/receipt_recognition_agent)

  [+ Clothes Recognition](/dev/api/agent/clothes_recognition_agent)

  [+ Contract Analysis](/dev/api/agent/contract_parser_agent)

  [+ Tendering Analysis Agent](/dev/api/agent/bidding_parser_agent)

  [+ Winning Bid Analysis Agent](/dev/api/agent/bidwin_parser_agent)

  [+ Intelligent Problem Solving](/dev/api/agent/intelligent_education_solve_agent)

  [+ Homework Grading](/dev/api/agent/intelligent_education_correction_agent)

* search-tool

  [+ Web Search API](/dev/api/search-tool/web-search)

  [+ Web Search in Chat](/dev/api/search-tool/websearch-in-chat)

  [+ Search Agent](/dev/api/search-tool/agent-search)

* Image Generation

  [+ CogView-4](/dev/api/image-model/cogview)

* Agent Model

  [+ GLM-4-AllTools](/dev/api/intelligent-agent-model/glm-4-alltools)

  [+ GLM-4-Assistant](/dev/api/intelligent-agent-model/assistantapi)

* Code Programming

  [+ CodeGeeX-4](/dev/api/code-model/codegeex-4)

* Embedding

  [+ Embedding](/dev/api/vector/embedding)

* Moderations

  [+ moderations](/dev/api/moderations/moderations)

* Role-playing

  [+ CharGLM-4](/dev/api/super-humanoid/charglm-4)

  [+ Emohaa](/dev/api/super-humanoid/emohaa)

* Agent Development Platform

  [+ 【New】qingliuagent](/dev/api/Agent_Platform/newagent)

  [+ agent](/dev/api/Agent_Platform/agent)

  [+ qingliuSDK](/dev/api/Agent_Platform/agentsdk)

  [+ Knowledge](/dev/api/Agent_Platform/knowledge)

  [+ FinAgent](/dev/api/Agent_Platform/FinAgent)

* Batch

  [+ Batch](/dev/api/batch-api/batch)

* Data Management

  [+ File Management](/dev/api/knowlage-manage/queryfile)

  [+ File content extraction](/dev/api/knowlage-manage/queryextract)

  [+ Rerank](/dev/api/knowlage-manage/rerank)

* Error Codes

  [+ HTTP Status Codes](/dev/api/error-code/error-code-v4)

  [+ Model Error Codes](/dev/api/error-code/service-error)

More

[* Libraries](/dev/api/libraries)

[* API Pricing](/dev/api/product-billing)

[* Tokenizer](/dev/api/tokenizer)

[* Parameter Description](/dev/api/parameter-description)

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

# Web Search API

提示

Search-Std (ZhiPu Self-developed Basic Search Version) will be offered for free until May 31, 2025. Starting from 0:00 on June 1, 2025, the price will be adjusted to 0.01 yuan per search.

The Web Search API is a specialized search engine for large language models. Building upon traditional search engine capabilities like web crawling and ranking, it enhances intent recognition to return results better suited for LLM processing (including webpage titles, URLs, summaries, site names, favicons, etc.).

1.Intent-enhanced retrieval: Intelligently identifies user query intent and automatically determines whether web search is needed  
2.Structured output: Returns data formatted for LLM processing (with titles/URLs/summaries/site names/icons)  
3.Multi-engine support: Integrates Zhipu’s proprietary engine with mainstream search engines (Sogou/Quark)

* [Produce use guidance](https://www.bigmodel.cn/dev/howuse/websearch)
* [Product Price](https://www.bigmodel.cn/pricing)
* [Rate Limitation](https://www.bigmodel.cn/usercenter/corporateequity)
* [API Key](https://www.bigmodel.cn/usercenter/proj-mgmt/apikeys)

## API Request

| Transmission Method | https |
| --- | --- |
| Request URL | `https://open.bigmodel.cn/api/paas/v4/web_search` |
| Call Method | Synchronous call, waits for system execution and returns final results |
| Character Encoding | UTF-8 |
| Request Format | JSON |
| Response Format | JSON |
| Request Type | POST |
| Development Language | Any language capable of making HTTP requests |

### Request Parameters

| Parameter Name | Type | Required | Description |
| --- | --- | --- | --- |
| **search\_query** | String | Yes | The content to be searched. |
| **search\_engine** | String | Yes | The search engine code to call. Currently supported: `search_std`: Zhipu Basic Search Engine `search_pro`: Zhipu Advanced Search Engine，Existing users [check previous invocation methods](https://www.bigmodel.cn/dev/api/search-tool/web-search-pro)  `search_pro_sogou`: Sogou `search_pro_quark`: Quark Search |
| **count** | Int | No | The number of results to return Fillable range: `1-50`, maximum `50` results per single search Default is `10` Supported search engines: `search_pro`、`search_std`、`search_pro_sogou`  Sogou: Optional enumerated values are 10, 20, 30, 40, 50. |
| **search\_domain\_filter** | String | No | Used to limit the scope of search results and only return content from specified whitelist domains. Whitelist: Directly enter the domain name (e.g., `www.example.com`) Supported search engines: 、`search_std`、`search_pro`、`search_pro_sogou` |
| **search\_recency\_filter** | String | No | Search for webpages within a specified time range. Default is `noLimit` Fillable values: `oneDay`, within one day `oneWeek`, within one week `oneMonth`, within one month `oneYea`r, within one year `noLimit`, no limit (default) Supported search engines: `search_std`, `search_pro`、`search_pro_sogou`、`search_pro_quark`、 |
| **content\_size** | String | No | Controls the word count of webpage summaries; the default value is medium `medium`: Balanced mode, suitable for most queries. 400-600 words `high`: Maximizes context to provide more comprehensive responses but with higher costs, 2500 words. |
| **request\_id** | String | No | User-provided unique identifier for distinguishing requests. If not provided, the platform will generate one. |
| **user\_id** | String | No | Unique ID of the end user, helping the platform intervene in illegal activities, inappropriate content generation, or other abuses. ID length: 6 to 128 characters. |

### Response Parameters

| Parameter Name | Type | Description |
| --- | --- | --- |
| **id** | String | Task ID |
| **created** | Long | Request creation time, Unix timestamp in seconds. |
| **search\_intent** | List<Object> | Search intent results |
| query | String | Original search query |
| intent | String | Recognized intent type SEARCH\_ALL = Search the entire web SEARCH\_NONE = No search intent |
| keywords | String | Rewritten search keywords |
| **search\_result** | List<Object> | Search results |
| title | String | Title |
| content | String | Content summary |
| link | String | Result URL |
| media | String | Website name |
| icon | String | Website icon |
| refer | String | Index number |
| publish\_date | String | Website publication date |

### Request Example

```
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="")  # Fill in your own APIKey

response = client.web_search.web_search(
   search_engine="search-pro",
   search_query="search economic events",
   count=15, # The number of results to return, ranging from 1-50, default 10
   search_domain_filter="www.sohu.com", # Only access content from specified domain names.
   search_recency_filter="noLimit", # Search for content within specified date ranges
   content_size="high" # Control the word count of webpage summaries, default medium
)
print(response)
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

### Response Example

```
WebSearchResp(
{
    "created": 1748261757,
    "id": "20250526201557dda85ca6801b467b",
    "request_id": "20250526201557dda85ca6801b467b",
    "search_intent": [
        {
            "intent": "SEARCH_ALL",
            "keywords": "April 2025 financial news",
            "query": "Search for financial news in April 2025"
        }
    ],
    "search_result": [
        {
            "content": "1. From January to April, China's outbound direct investment reached USD 57.54 billion, a year-on-year increase of 7.5%. The effects of the trade-in policy continued to show, and the retail sales of household appliances maintained double-digit growth for eight consecutive months.\n2. China has taken multiple measures to accelerate the construction of a sci-tech finance system. The CSRC will support tech enterprises that break through key core technologies to access the “green channel”; the central bank stated that nearly 100 institutions have issued over RMB 250 billion in sci-tech innovation bonds.\n3. In May, China's narrow-sense passenger car retail sales were about 1.85 million units, a year-on-year increase of 8.5% and a month-on-month increase of 5.4%. Among them, new energy vehicle retail sales are expected to reach 980,000 units, with a penetration rate of about 52.9%.\n4. Led by the Beijing Humanoid Robot Innovation Center, the world's first “Humanoid Robot Intelligence Classification” standard was released, establishing a four-dimensional, five-level evaluation framework, including perception & cognition, decision-making & learning, execution performance, and collaborative interaction.\n5. Fed Governor Waller said that if tariffs under a Trump administration stabilize around 10%, the Fed might cut interest rates in the second half of 2025.\n6. In May, the U.S. manufacturing PMI rose to a three-month high of 52.3. The services PMI preliminary reading also hit a two-month high of 52.3. New orders grew at the fastest pace in over a year, while price indicators rose to their highest in nearly three years.\n7. In the eurozone, the May manufacturing PMI preliminary reading slightly improved to 49.2, but the services PMI unexpectedly dropped sharply to 48.9, the worst performance in 16 months, dragging the composite PMI from April’s 50.4 down to 49.5. Return to Sohu for more",
            "icon": "https://sfile.chatglm.cn/searchImage/sohu_icon_new.jpg",
            "link": "https://www.sohu.com/a/897879632_121123890",
            "media": "Sohu",
            "publish_date": "2025-05-23",
            "refer": "ref_1",
            "title": "Morning Financial News on May 23, 2025"
        },
        ...
        {
            "content": "1. The CSRC and seven other departments issued 'Several Measures to Support Financing for Small and Micro Enterprises,' proposing 23 specific measures from eight aspects, including increasing financing supply, lowering comprehensive financing costs, improving financing efficiency and precision, implementing regulatory policies, strengthening risk management, improving policy guarantees, and ensuring implementation.\nCommentary: Support for small and micro enterprise financing has been strengthened; the 23 measures aim to directly support the real economy and alleviate financing difficulties.\n2. Ministry of Commerce: From January to April 2025, China's outbound direct investment across all industries reached USD 57.54 billion, a year-on-year increase of 7.5%.\nCommentary: China's outbound investment grows steadily; Belt and Road cooperation may be a key driver.\nIndustry Observation\n3. Ministry of Commerce: From September 2024 to April 2025, retail sales of household appliances maintained double-digit growth for eight consecutive months. In April, retail sales of household appliances and audio-visual equipment above designated size increased by 38.8% year-on-year, ranking first among the 16 major categories of consumer goods.\nCommentary: Appliance consumption remains strong, driven by policy stimulus and consumption upgrades.\n4. National Energy Administration: As of the end of April, total installed power generation capacity nationwide reached 3.49 billion kilowatts, up 15.9% year-on-year. From January to April, major power enterprises completed RMB 193.3 billion in power source project investment, up 1.6% year-on-year; power grid project investment reached RMB 140.8 billion, up 14.6% year-on-year.\nCommentary: Energy infrastructure accelerates; grid investment outpaces power source investment.\nGlobal Perspective\n5. The U.S. House Rules Committee approved Trump’s comprehensive tax cut bill, paving the way for a full House vote.\nCommentary: Trump’s tax plan progresses. If passed, it could stimulate U.S. consumption but increase fiscal deficit pressure.\nFinancial Markets\n6. Most domestic commodity futures closed lower. Energy varieties underperformed, chemical futures were mostly under pressure, the ferrous metal sector weakened across the board, and among agricultural products, apple futures saw significant declines.\nCommentary: Broad decline in the commodity market reflects weak demand expectations.\n7. On Thursday, the onshore RMB closed at 7.2040 against the USD at 16:30, up 25 basis points from the previous trading day. The central parity rate rose by 34 basis points to 7.1903. Most government bond futures closed flat; the 30-year main contract fell 0.04%, while the 10-year main contract rose 0.01%.\nCommentary: RMB exchange rate stabilizes; the rise in the central parity rate suggests policy stabilization intent.\n8. On May 22, the three major indexes closed lower. Military stocks led the gains, innovative pharma stocks were active, bank stocks bucked the trend and strengthened, while pet economy stocks led the declines. Beauty and personal care stocks fell sharply, and solid-state battery stocks retreated.\nCommentary: Structural divergence in A-shares, rising risk aversion sentiment in the market; beware of the resonance risk of U.S. debt maturity in June and global market corrections. Return to Sohu for more",
            "icon": "https://sfile.chatglm.cn/searchImage/sohu_icon_new.jpg",
            "link": "https://www.sohu.com/a/897874861_121123901",
            "media": "Sohu",
            "publish_date": "2025-05-23",
            "refer": "ref_2",
            "title": "Morning Financial Briefing on May 23"
        },
        {
            "content": "According to Zhitong Finance APP, in April 2025, Macau’s Composite Consumer Price Index (CPI) rose by 0.23% year-on-year and rebounded by 0.16% month-on-month. This data was released by the Statistics and Census Service of Macau on May 23, reflecting subtle changes in Macau’s consumer market.\n1. Changes in Macau’s CPI\nData from the Statistics and Census Service of Macau showed that the average Composite CPI for the twelve months ending in April 2025 rose by 0.42% compared to the same period a year earlier (May 2023 to April 2024). Among the major categories of goods and services, the price index for Recreation, Sports, and Culture rose by 2.47% year-on-year, while the Miscellaneous Goods and Services index also increased by 1.82%. These trends signal signs of economic recovery in Macau.\n2. Effects of food and rent\nIn the Food and Non-Alcoholic Beverages category, the cost of dining out and food delivery increased, pushing up prices by 0.48% year-on-year. Rent hikes also led to a 0.21% rise in the Housing and Fuel category. As tourism recovers, demand for dining out has increased, further raising service costs.\nHowever, it's noteworthy that the indices for Information & Communication (-3.01%), Clothing & Footwear (-2.35%), and Transport (-1.67%) declined, adding complexity to the overall CPI movement.\n3. Month-on-month changes\nCompared to March 2025, Macau’s CPI in April rose by 0.16%. The month-on-month rise in hotel prices led to a significant increase in the Recreation, Sports, and Culture category by 2.6%. The launch of summer apparel and the rebound in airfare prices also contributed to price increases in Clothing & Footwear (+0.78%) and Transport (+0.42%).\nNevertheless, prices in the Food and Non-Alcoholic Beverages category saw a slight month-on-month drop (-0.04%) as the price hikes in dining out and delivery were not enough to offset declines in prices of fresh fish, seafood, vegetables, and fruits.\n4. Classification of CPI\nThe Statistics and Census Service of Macau compiled three CPI series to reflect the price changes for households in different spending groups. Type A CPI covers about 50% of households, Type B covers about 30%, corresponding to monthly average household spending of MOP 11,000–35,999 and MOP 36,000–71,999, respectively.\nHousing & Fuel, Food & Non-Alcoholic Beverages, and Transport account for a significant portion of household expenditures, with weights of 34.47%, 29.47%, and 8.33%, respectively. This classification helps more accurately reflect the consumption changes across income groups.\n5. Future outlook\nLooking ahead, Macau’s consumer market will continue to be influenced by multiple factors. Although prices in some categories declined, the overall mild increase in prices indicates recovery potential. As tourism rebounds and demand picks up, the CPI is expected to continue a slight upward trend in the coming months.\nOverall, the changes in Macau’s CPI in April 2025 reflect market dynamics and pose new challenges to living costs. Against this backdrop, the government and relevant institutions should monitor the impact of price changes on people’s livelihoods and formulate more effective economic policies to ensure stable living standards. Return to Sohu for more",
            "icon": "https://sfile.chatglm.cn/searchImage/sohu_icon_new.jpg",
            "link": "https://www.sohu.com/a/898091955_121956424",
            "media": "Sohu",
            "publish_date": "2025-05-23",
            "refer": "ref_3",
            "title": "Macau’s CPI Slightly Rose in April 2025 — Analysis Behind the Data"
        },
        {
            "content": "According to Zhitong Finance APP, on May 23, the Asset Management Association of China released the April monthly report on the registration and filing of private fund managers and products. In April 2025, a total of 1,606 new private funds were registered nationwide, with a new registration scale of RMB 64.372 billion. Among them, there were 1,189 private securities investment funds (RMB 36.695 billion), 143 private equity funds (RMB 16.101 billion), and 274 venture capital funds (RMB 11.576 billion).\n1. Overall situation of private fund manager registration\n(1) Monthly registration status\nIn April 2025, 16 institutions completed registration via the AMBERS system of the Asset Management Association of China, including 4 private securities investment fund managers and 12 private equity/venture capital fund managers. Also, 76 fund managers were deregistered.\n(2) Current number of private fund managers\nAs of the end of April 2025, there were 19,891 active private fund managers managing 141,579 funds totaling RMB 20.22 trillion. These include 7,827 private securities investment fund managers, 11,867 private equity/venture capital fund managers, 6 private asset allocation fund managers, and 191 other private fund managers.\n(3) Regional distribution\nAs of April 2025, private fund managers were primarily located in Shanghai, Beijing, Shenzhen, Guangdong (excluding Shenzhen), Zhejiang (excluding Ningbo), and Jiangsu, accounting for 72.20%, slightly down from 72.22% in March. Shanghai had 3,714, Beijing 3,244, Shenzhen 3,012, Guangdong (excluding Shenzhen) 1,594, Zhejiang (excluding Ningbo) 1,590, and Jiangsu 1,207 — accounting for 18.67%, 16.31%, 15.14%, 8.01%, 7.99%, and 6.07% respectively.\nIn terms of fund scale, the top six regions were Shanghai, Beijing, Shenzhen, Guangdong (excluding Shenzhen), Jiangsu, and Zhejiang (excluding Ningbo), accounting for 75.02%, up from 74.96% in March. The respective scales were RMB 5.0797 trillion, 4.6771 trillion, 1.9703 trillion, 1.3007 trillion, 1.1767 trillion, and 967.2 billion — accounting for 25.12%, 23.13%, 9.74%, 6.43%, 5.82%, and 4.78% respectively.\n2. Overall private fund filing\n(1) Monthly filing status\nIn April 2025, 1,606 new private funds were filed, totaling RMB 64.372 billion. This includes 1,189 private securities investment funds (RMB 36.695 billion), 143 private equity funds (RMB 16.101 billion), and 274 venture capital funds (RMB 11.576 billion).\n(2) Private funds in operation\nAs of end-April 2025, there were 141,579 active private funds with a total scale of RMB 20.22 trillion. Of these, 84,673 were private securities investment funds (RMB 5.51 trillion), 30,205 private equity funds (RMB 10.96 trillion), and 25,830 venture capital funds (RMB 3.41 trillion).",
            "icon": "https://sfile.chatglm.cn/searchImage/sohu_icon_new.jpg",
            "link": "https://www.sohu.com/a/898137965_323087",
            "media": "Sohu",
            "publish_date": "2025-05-23",
            "refer": "ref_4",
            "title": "AMAC: 1,606 New Private Funds Registered in April with RMB 64.372 Billion Scale"
        }
    ]
}
)
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
33  
34  
35  
36  
37  
38  
39  
40  
41  
42  
43  
44  
45  
46  
47  
48  
49  
50  
51  
52  
53  
54

## MCP Server

Visit the [official MCP documentation](https://modelcontextprotocol.io/introduction) to learn more about the protocol.

### Installation Guide

* Supports clients that run the MCP protocol, such as Cursor, Cherry Studio, etc.
* Obtain your [API Key from the Zhipu BigModel Open Platform](https://www.bigmodel.cn/login?redirect=%2Fusercenter%2Fproj-mgmt%2Fapikeys).

### Using in Cursor

Version 0.45.6 of Cursor provides MCP functionality. Cursor acts as an MCP client to use MCP services. You can easily configure it within Cursor to connect to MCP.  
Navigation path: Cursor Settings -> [Features] -> [MCP Servers]

#### Configure MCP Server

```
{
  "mcpServers": {
    "zhipu-web-search-sse": {
      "url": "https://open.bigmodel.cn/api/mcp/web_search/sse?Authorization=YOUR API Key"
    }
  }
}
```

#### Using Cursor MCP

Cursor MCP must be used in Composer's agent mode.

![Cursor MCP Usage Screenshot](https://cdn.bigmodel.cn/markdown/1745735330194cursor02.png?attname=cursor02.png)

Table of contents

API Request

Request Parameters

Response Parameters

Request Example

Response Example

MCP Server

Installation Guide

Using in Cursor