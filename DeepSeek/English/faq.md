# FAQ

On this page

# FAQ

## Account​

### Cannot sign in to my account​

Your recent account activity may have triggered our automated risk control strategy, resulting in the temporary suspension of your access to the account. If you wish to appeal, please fill out this [form](<https://trtgsjkv6r.feishu.cn/share/base/form/shrcnDOeld9kcILX57EdfRT8iDg>), and we will process it as soon as possible.

### Cannot register with my email​

If you encounter an error message saying "Login failed. Your email domain is currently not supported for registration." during registration, it is because your email is not supported by DeepSeek. Please switch to a different email service provider. If the issue persists, please contact [service@deepseek.com](<mailto:service@deepseek.com>).

* * *

## Billing​

### Is there any expiration date for my balance?​

Your topped-up balance will not expire. You can check the expiration date of the granted balance on the [billing page](<https://platform.deepseek.com/transactions>).

### Topped-up balance incorrect?​

Please double-check that the account you recharged is the same as the one you're currently logged into.

If you have a Google account, try logging into the platform using the Google login option to check whether your previous top-up was made under that account.

If your account was originally registered with a phone number and you deleted and re-registered it, the new account is completely separate from the original one. Any balance from the original account cannot be used. Please [contact us](<https://trtgsjkv6r.feishu.cn/share/base/form/shrcn1lIYKRCKQJrqFjuZCQCdch>) for assistance if this applies to you.

* * *

## API Call​

### Are there any rate limits when calling your API? Can I increase the limits for my account?​

The rate limit exposed on each account is adjusted dynamically according to our real-time traffic pressure and each account's short-term historical usage.

We temporarily do not support increasing the dynamic rate limit exposed on any individual account, thanks for your understanding.

### Why do I feel that your API's speed is slower than the web service?​

The web service uses streaming output, i.e., every time the model outputs a token, it will be displayed incrementally on the web page.

The API uses non-streaming output (stream=false) by default, i.e., the model's output will not be returned to the user until the generation is done completely. You can use streaming output in your API call to optimize interactivity.

### Why are empty lines continuously returned when calling the API?​

To prevent the TCP connection from being interrupted due to timeout, we continuously return empty lines (for non-streaming requests) or SSE keep-alive comments (` : keep-alive`，for streaming requests) while waiting for the request to be scheduled. If you are parsing the HTTP response yourself, please make sure to handle these empty lines or comments appropriately.

### Does your API support LangChain?​

Yes. You can refer to the demo code below, which demonstrates how to use LangChain with DeepSeek API. Replace the API key in the code as necessary.

[deepseek_langchain.py](<https://cdn.deepseek.com/api-docs/deepseek_langchain.py>)

### How to calculate token usage offline?​

Please refer to [Token & Token Usage](</quick_start/token_usage>)