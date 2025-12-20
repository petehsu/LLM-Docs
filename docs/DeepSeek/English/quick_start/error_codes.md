# Error Codes

When calling DeepSeek API, you may encounter errors. Here list the causes and solutions.

CODE | DESCRIPTION  
---|---  
400 - Invalid Format| **Cause** : Invalid request body format.   
**Solution** : Please modify your request body according to the hints in the error message. For more API format details, please refer to [DeepSeek API Docs.](<https://api-docs.deepseek.com>)  
401 - Authentication Fails| **Cause** : Authentication fails due to the wrong API key.   
**Solution** : Please check your API key. If you don't have one, please [create an API key](<https://platform.deepseek.com/api_keys>) first.  
402 - Insufficient Balance| **Cause** : You have run out of balance.   
**Solution** : Please check your account's balance, and go to the [Top up](<https://platform.deepseek.com/top_up>) page to add funds.  
422 - Invalid Parameters| **Cause** : Your request contains invalid parameters.   
**Solution** : Please modify your request parameters according to the hints in the error message. For more API format details, please refer to [DeepSeek API Docs.](<https://api-docs.deepseek.com>)  
429 - Rate Limit Reached| **Cause** : You are sending requests too quickly.   
**Solution** : Please pace your requests reasonably. We also advise users to temporarily switch to the APIs of alternative LLM service providers, like OpenAI.  
500 - Server Error| **Cause** : Our server encounters an issue.   
**Solution** : Please retry your request after a brief wait and contact us if the issue persists.  
503 - Server Overloaded| **Cause** : The server is overloaded due to high traffic.   
**Solution** : Please retry your request after a brief wait.