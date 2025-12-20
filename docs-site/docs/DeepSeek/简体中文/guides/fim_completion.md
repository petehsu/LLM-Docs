# FIM 补全（Beta）

本页总览

# FIM 补全（Beta）

在 [FIM (Fill In the Middle) 补全](</zh-cn/api/create-completion>)中，用户可以提供前缀和后缀（可选），模型来补全中间的内容。FIM 常用于内容续写、代码补全等场景。

## 注意事项​

  1. 模型的最大补全长度为 4K。
  2. 用户需要设置 `base_url="https://api.deepseek.com/beta"` 来开启 Beta 功能。

## 样例代码​

下面给出了 FIM 补全的完整 Python 代码样例。在这个例子中，我们给出了计算斐波那契数列函数的开头和结尾，来让模型补全中间的内容。
    
    
    from openai import OpenAI  
      
    client = OpenAI(  
        api_key="<your api key>",  
        base_url="https://api.deepseek.com/beta",  
    )  
      
    response = client.completions.create(  
        model="deepseek-chat",  
        prompt="def fib(a):",  
        suffix="    return fib(a-1) + fib(a-2)",  
        max_tokens=128  
    )  
    print(response.choices[0].text)  
    

## 配置 Continue 代码补全插件​

[Continue](<https://continue.dev>) 是一款支持代码补全的 VSCode 插件，您可以参考[这篇文档](<https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/docs/continue/README_cn.md>)来配置 Continue 以使用代码补全功能。