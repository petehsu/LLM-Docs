# Rate Limits

> Rate limits are restrictions that our API imposes on the number of times a user or client can access our services within a specified period of time.

## Rate limits

The rate limits applied to your account depend on the model and interface you use.

**The specific rate limits are shown in the tables below :**

### Text

| API                   | Model                 | RPM                     | TPM                                   |
| :-------------------- | :-------------------- | :---------------------- | :------------------------------------ |
| Text API              | MiniMax-M2            | 20                      | 1,000,000                             |
| Text API              | MiniMax-M2-Stable     | • 20<br /> • 500 (Paid) | • 1,000,000<br /> • 20,000,000 (Paid) |

[**Recharge Now**](https://platform.minimax.io/user-center/payment/balance), to get more RPM & TPM.

<br />

### Speech

| API                   | Model                                       | RPM         | TPM               |
| :-------------------- | :------------------------------------------ | :---------- | :---------------- |
| T2A                   | speech-2.6-turbo/hd<br />speech-02-turbo/hd | 60          | 20,000            |
| Voice Cloning         | ——                                          | 60          | ——                |
| Voice Design          | ——                                          | 20          | ——                |

### Video

| API              | Model                                                                                            | RPM             |
| :--------------- | :----------------------------------------------------------------------------------------------- | :-------------- |
| Video Generation | **2.3 Series**: MiniMax-Hailuo-2.3、MiniMax-Hailuo-2.3-Fast<br />**02 Series**: MiniMax-Hailuo-02 | 5               |

### Image

| API                   | Model                 | RPM         | TPM               |
| :-------------------- | :-------------------- | :---------- | :---------------- |
| Image Generation      | image-01              | 10          | 60                |

### Music

| API                   | Model                 | RPM         | CONN               |
| :-------------------- | :-------------------- | :---------- | :----------------- |
| Music Generation      | Music-2.0             | 120         | 20                 |

## FAQs

### 1. What are rate limits

Rate limits are restrictions that our API imposes on the number of times a user or client can access our services within a specified period of time.

The rate limits for MiniMax's API are divided into two types: RPM and TPM.

* **RPM (Requests Per Minute)**: The maximum number of requests that can be sent per minute
* **TPM (Tokens Per Minute)**: The maximum number of tokens (input + output) that can be processed per minute

For example: If your account has a limit of 120 RPM, it means your account can send up to 120 requests per minute.

### 2. Why do we have rate limits

Rate limits are a common practice for APIs and are implemented for several reasons:

* **Preventing abuse and misuse**: Rate limits help protect the API from malicious or excessive usage. For example, they prevent users from overloading the API with excessive calls in an attempt to cause an overload or service disruption. By setting rate limits, such malicious activities can be avoided.
* **Ensuring fair access**: Rate limits ensure that everyone can access the API fairly. They prevent scenarios where one person or organization makes an excessive number of requests, potentially leading to unequal resource allocation for other users. By limiting the number of requests a single user can make, it ensures that the majority of users have the opportunity to access the API without experiencing performance slowdowns.
* **Maintaining a consistent experience**: By enforcing rate limits, MiniMax helps ensure a smooth and consistent experience for all users.

If the current rate limits do not meet your needs, you can contact our business team via email：[api@minimax.io](mailto:api@minimax.io)


---

> To find navigation and other pages in this documentation, fetch the llms.txt file at: https://platform.minimax.io/docs/llms.txt