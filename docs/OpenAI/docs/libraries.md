# Libraries

Set up your development environment to use the OpenAI API with an SDK in your preferred language.

Copy page

This page covers setting up your local development environment to use the [OpenAI API](/docs/api-reference). You can use one of our officially supported SDKs, a community library, or your own preferred HTTP client.

## Create and export an API key

Before you begin, [create an API key in the dashboard](/api-keys), which you'll use to securely [access the API](/docs/api-reference/authentication). Store the key in a safe location, like a [`.zshrc` file](https://www.freecodecamp.org/news/how-do-zsh-configuration-files-work/) or another text file on your computer. Once you've generated an API key, export it as an [environment variable](https://en.wikipedia.org/wiki/Environment_variable) in your terminal.

macOS / LinuxWindows

macOS / Linux

Export an environment variable on macOS or Linux systems

```
1
export OPENAI_API_KEY="your_api_key_here"
```

Windows

Export an environment variable in PowerShell

```
1
setx OPENAI_API_KEY "your_api_key_here"
```

OpenAI SDKs are configured to automatically read your API key from the system environment.

## Install an official SDK

JavaScriptPython.NETJavaGo

JavaScript

To use the OpenAI API in server-side JavaScript environments like Node.js, Deno, or Bun, you can use the official [OpenAI SDK for TypeScript and JavaScript](https://github.com/openai/openai-node). Get started by installing the SDK using [npm](https://www.npmjs.com/) or your preferred package manager:

Install the OpenAI SDK with npm

```
1
npm install openai
```

With the OpenAI SDK installed, create a file called `example.mjs` and copy the example code into it:

Test a basic API request

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
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
    model: "gpt-5-nano",
    input: "Write a one-sentence bedtime story about a unicorn."
});

console.log(response.output_text);
```

Execute the code with `node example.mjs` (or the equivalent command for Deno or Bun). In a few moments, you should see the output of your API request.

[Learn more on GitHub

Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-node)

Python

To use the OpenAI API in Python, you can use the official [OpenAI SDK for Python](https://github.com/openai/openai-python). Get started by installing the SDK using [pip](https://pypi.org/project/pip/):

Install the OpenAI SDK with pip

```
1
pip install openai
```

With the OpenAI SDK installed, create a file called `example.py` and copy the example code into it:

Test a basic API request

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
from openai import OpenAI
client = OpenAI()

response = client.responses.create(
    model="gpt-5-nano",
    input="Write a one-sentence bedtime story about a unicorn."
)

print(response.output_text)
```

Execute the code with `python example.py`. In a few moments, you should see the output of your API request.

[Learn more on GitHub

Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-python)

.NET

In collaboration with Microsoft, OpenAI provides an officially supported API client for C#. You can install it with the .NET CLI from [NuGet](https://www.nuget.org/).

```
dotnet add package OpenAI
```

A simple API request to the [Responses API](/docs/api-reference/responses) would look like this:

Test a basic API request

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
using System;
using System.Threading.Tasks;
using OpenAI;

class Program
{
    static async Task Main()
    {
        var client = new OpenAIClient(
            Environment.GetEnvironmentVariable("OPENAI_API_KEY")
        );

        var response = await client.Responses.CreateAsync(new ResponseCreateRequest
        {
            Model = "gpt-5-nano",
            Input = "Say 'this is a test.'"
        });

        Console.WriteLine($"[ASSISTANT]: {response.OutputText()}");
    }
}
```

To learn more about using the OpenAI API in .NET, check out the GitHub repo linked below!

[Learn more on GitHub

Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-dotnet)

Java

OpenAI provides an API helper for the Java programming language, currently in beta. You can include the Maven dependency using the following configuration:

```
1
2
3
4
5
<dependency>
  <groupId>com.openai</groupId>
  <artifactId>openai-java</artifactId>
  <version>4.0.0</version>
</dependency>
```

A simple API request to [Responses API](/docs/api-reference/responses) would look like this:

Test a basic API request

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
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

public class Main {
    public static void main(String[] args) {
        OpenAIClient client = OpenAIOkHttpClient.fromEnv();

        ResponseCreateParams params = ResponseCreateParams.builder()
                .input("Say this is a test")
                .model("gpt-5-nano")
                .build();

        Response response = client.responses().create(params);
        System.out.println(response.outputText());
    }
}
```

To learn more about using the OpenAI API in Java, check out the GitHub repo linked below!

[Learn more on GitHub

Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-java)

Go

OpenAI provides an API helper for the Go programming language, currently in beta. You can import the library using the code below:

```
1
2
3
import (
  "github.com/openai/openai-go" // imported as openai
)
```

A simple API request to the [Responses API](/docs/api-reference/responses) would look like this:

Test a basic API request

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
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient(
		option.WithAPIKey("My API Key"), // or set OPENAI_API_KEY in your env
	)

	resp, err := client.Responses.New(context.TODO(), openai.ResponseNewParams{
		Model: "gpt-5-nano",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Say this is a test")},
	})
	if err != nil {
		panic(err.Error())
	}

	fmt.Println(resp.OutputText())
}
```

To learn more about using the OpenAI API in Go, check out the GitHub repo linked below!

[Learn more on GitHub

Discover more SDK capabilities and options on the library's GitHub README.](https://github.com/openai/openai-go)

## Azure OpenAI libraries

Microsoft's Azure team maintains libraries that are compatible with both the OpenAI API and Azure OpenAI services. Read the library documentation below to learn how you can use them with the OpenAI API.

* [Azure OpenAI client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI)
* [Azure OpenAI client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai)
* [Azure OpenAI client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai)
* [Azure OpenAI client library for Go](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/ai/azopenai)

---

## Community libraries

The libraries below are built and maintained by the broader developer community. You can also [watch our OpenAPI specification](https://github.com/openai/openai-openapi) repository on GitHub to get timely updates on when we make changes to our API.

Please note that OpenAI does not verify the correctness or security of these projects. **Use them at your own risk!**

### C# / .NET

* [Betalgo.OpenAI](https://github.com/betalgo/openai) by [Betalgo](https://github.com/betalgo)
* [OpenAI-API-dotnet](https://github.com/OkGoDoIt/OpenAI-API-dotnet) by [OkGoDoIt](https://github.com/OkGoDoIt)
* [OpenAI-DotNet](https://github.com/RageAgainstThePixel/OpenAI-DotNet) by [RageAgainstThePixel](https://github.com/RageAgainstThePixel)

### C++

* [liboai](https://github.com/D7EAD/liboai) by [D7EAD](https://github.com/D7EAD)

### Clojure

* [openai-clojure](https://github.com/wkok/openai-clojure) by [wkok](https://github.com/wkok)

### Crystal

* [openai-crystal](https://github.com/sferik/openai-crystal) by [sferik](https://github.com/sferik)

### Dart/Flutter

* [openai](https://github.com/anasfik/openai) by [anasfik](https://github.com/anasfik)

### Delphi

* [DelphiOpenAI](https://github.com/HemulGM/DelphiOpenAI) by [HemulGM](https://github.com/HemulGM)

### Elixir

* [openai.ex](https://github.com/mgallo/openai.ex) by [mgallo](https://github.com/mgallo)

### Go

* [go-gpt3](https://github.com/sashabaranov/go-gpt3) by [sashabaranov](https://github.com/sashabaranov)

### Java

* [simple-openai](https://github.com/sashirestela/simple-openai) by [Sashir Estela](https://github.com/sashirestela)
* [Spring AI](https://spring.io/projects/spring-ai)

### Julia

* [OpenAI.jl](https://github.com/rory-linehan/OpenAI.jl) by [rory-linehan](https://github.com/rory-linehan)

### Kotlin

* [openai-kotlin](https://github.com/Aallam/openai-kotlin) by [Mouaad Aallam](https://github.com/Aallam)

### Node.js

* [openai-api](https://www.npmjs.com/package/openai-api) by [Njerschow](https://github.com/Njerschow)
* [openai-api-node](https://www.npmjs.com/package/openai-api-node) by [erlapso](https://github.com/erlapso)
* [gpt-x](https://www.npmjs.com/package/gpt-x) by [ceifa](https://github.com/ceifa)
* [gpt3](https://www.npmjs.com/package/gpt3) by [poteat](https://github.com/poteat)
* [gpts](https://www.npmjs.com/package/gpts) by [thencc](https://github.com/thencc)
* [@dalenguyen/openai](https://www.npmjs.com/package/@dalenguyen/openai) by [dalenguyen](https://github.com/dalenguyen)
* [tectalic/openai](https://github.com/tectalichq/public-openai-client-js) by [tectalic](https://tectalic.com/)

### PHP

* [orhanerday/open-ai](https://packagist.org/packages/orhanerday/open-ai) by [orhanerday](https://github.com/orhanerday)
* [tectalic/openai](https://github.com/tectalichq/public-openai-client-php) by [tectalic](https://tectalic.com/)
* [openai-php client](https://github.com/openai-php/client) by [openai-php](https://github.com/openai-php)

### Python

* [chronology](https://github.com/OthersideAI/chronology) by [OthersideAI](https://www.othersideai.com/)

### R

* [rgpt3](https://github.com/ben-aaron188/rgpt3) by [ben-aaron188](https://github.com/ben-aaron188)

### Ruby

* [openai](https://github.com/nileshtrivedi/openai/) by [nileshtrivedi](https://github.com/nileshtrivedi)
* [ruby-openai](https://github.com/alexrudall/ruby-openai) by [alexrudall](https://github.com/alexrudall)

### Rust

* [async-openai](https://github.com/64bit/async-openai) by [64bit](https://github.com/64bit)
* [fieri](https://github.com/lbkolev/fieri) by [lbkolev](https://github.com/lbkolev)

### Scala

* [openai-scala-client](https://github.com/cequence-io/openai-scala-client) by [cequence-io](https://github.com/cequence-io)

### Swift

* [AIProxySwift](https://github.com/lzell/AIProxySwift) by [Lou Zell](https://github.com/lzell)
* [OpenAIKit](https://github.com/dylanshine/openai-kit) by [dylanshine](https://github.com/dylanshine)
* [OpenAI](https://github.com/MacPaw/OpenAI/) by [MacPaw](https://github.com/MacPaw)

### Unity

* [OpenAi-Api-Unity](https://github.com/hexthedev/OpenAi-Api-Unity) by [hexthedev](https://github.com/hexthedev)
* [com.openai.unity](https://github.com/RageAgainstThePixel/com.openai.unity) by [RageAgainstThePixel](https://github.com/RageAgainstThePixel)

### Unreal Engine

* [OpenAI-Api-Unreal](https://github.com/KellanM/OpenAI-Api-Unreal) by [KellanM](https://github.com/KellanM)

## Other OpenAI repositories

* [tiktoken](https://github.com/openai/tiktoken) - counting tokens
* [simple-evals](https://github.com/openai/simple-evals) - simple evaluation library
* [mle-bench](https://github.com/openai/mle-bench) - library to evaluate machine learning engineer agents
* [gym](https://github.com/openai/gym) - reinforcement learning library
* [swarm](https://github.com/openai/swarm) - educational orchestration repository