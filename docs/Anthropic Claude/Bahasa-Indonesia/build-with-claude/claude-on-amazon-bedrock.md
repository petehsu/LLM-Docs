# Claude on Amazon Bedrock

Model Claude dari Anthropic kini tersedia secara umum melalui Amazon Bedrock.

---

Memanggil Claude melalui Bedrock sedikit berbeda dari cara Anda memanggil Claude saat menggunakan SDK klien Anthropic. Panduan ini akan memandu Anda melalui proses menyelesaikan panggilan API ke Claude on Bedrock dalam Python atau TypeScript.

Perhatikan bahwa panduan ini mengasumsikan Anda telah mendaftar untuk [akun AWS](https://portal.aws.amazon.com/billing/signup) dan mengonfigurasi akses pemrograman.

## Instal dan konfigurasikan AWS CLI

1. [Instal versi AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) pada versi `2.13.23` atau lebih baru
2. Konfigurasikan kredensial AWS Anda menggunakan perintah AWS configure (lihat [Konfigurasikan AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)) atau temukan kredensial Anda dengan menavigasi ke "Command line or programmatic access" dalam dasbor AWS Anda dan mengikuti petunjuk dalam modal popup.
3. Verifikasi bahwa kredensial Anda berfungsi:

```bash Shell
aws sts get-caller-identity
```

## Instal SDK untuk mengakses Bedrock

[SDK klien](/docs/id/api/client-sdks) Anthropic mendukung Bedrock. Anda juga dapat menggunakan AWS SDK seperti `boto3` secara langsung.

<CodeGroup>
  ```python Python
  pip install -U "anthropic[bedrock]"
  ```

  ```typescript TypeScript
  npm install @anthropic-ai/bedrock-sdk
  ```

  ```python Boto3 (Python)
  pip install boto3>=1.28.59
  ```
</CodeGroup>

## Mengakses Bedrock

### Berlangganan model Anthropic

Buka [AWS Console > Bedrock > Model Access](https://console.aws.amazon.com/bedrock/home?region=us-west-2#/modelaccess) dan minta akses ke model Anthropic. Perhatikan bahwa ketersediaan model Anthropic bervariasi menurut wilayah. Lihat [dokumentasi AWS](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html) untuk informasi terbaru.

#### ID model API

| Model | ID model Bedrock dasar | `global` | `us` | `eu` | `jp` | `apac` |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Claude Sonnet 4.5 | anthropic.claude-sonnet-4-5-20250929-v1:0 | Ya | Ya | Ya | Ya | Tidak |
| Claude Sonnet 4 | anthropic.claude-sonnet-4-20250514-v1:0 | Ya | Ya | Ya | Tidak | Ya |
| Claude Sonnet 3.7 <Tooltip tooltipContent="Tidak direkomendasikan sejak 28 Oktober 2025.">⚠️</Tooltip> | anthropic.claude-3-7-sonnet-20250219-v1:0 | Tidak | Ya | Ya | Tidak | Ya |
| Claude Opus 4.5 | anthropic.claude-opus-4-5-20251101-v1:0 | Ya | Ya | Ya | Tidak | Tidak |
| Claude Opus 4.1 | anthropic.claude-opus-4-1-20250805-v1:0 | Tidak | Ya | Tidak | Tidak | Tidak |
| Claude Opus 4 | anthropic.claude-opus-4-20250514-v1:0 | Tidak | Ya | Tidak | Tidak | Tidak |
| Claude Opus 3 <Tooltip tooltipContent="Tidak direkomendasikan sejak 30 Juni 2025.">⚠️</Tooltip> | anthropic.claude-3-opus-20240229-v1:0 | Tidak | Ya | Tidak | Tidak | Tidak |
| Claude Haiku 4.5 | anthropic.claude-haiku-4-5-20251001-v1:0 | Ya | Ya | Ya | Tidak | Tidak |
| Claude Haiku 3.5 | anthropic.claude-3-5-haiku-20241022-v1:0 | Tidak | Ya | Tidak | Tidak | Tidak |
| Claude Haiku 3 | anthropic.claude-3-haiku-20240307-v1:0 | Tidak | Ya | Ya | Tidak | Ya |

Untuk informasi lebih lanjut tentang ID model regional vs global, lihat bagian [Global vs regional endpoints](#global-vs-regional-endpoints) di bawah.

### Daftar model yang tersedia

Contoh berikut menunjukkan cara mencetak daftar semua model Claude yang tersedia melalui Bedrock:

<CodeGroup>
  ```bash AWS CLI
  aws bedrock list-foundation-models --region=us-west-2 --by-provider anthropic --query "modelSummaries[*].modelId"
  ```

  ```python Boto3 (Python)
  import boto3

  bedrock = boto3.client(service_name="bedrock")
  response = bedrock.list_foundation_models(byProvider="anthropic")

  for summary in response["modelSummaries"]:
      print(summary["modelId"])
  ```
</CodeGroup>

### Membuat permintaan

Contoh berikut menunjukkan cara menghasilkan teks dari Claude on Bedrock:

<CodeGroup>
  ```python Python
  from anthropic import AnthropicBedrock

  client = AnthropicBedrock(
      # Autentikasi dengan memberikan kunci di bawah atau gunakan penyedia kredensial AWS default, seperti
      # menggunakan ~/.aws/credentials atau variabel lingkungan "AWS_SECRET_ACCESS_KEY" dan "AWS_ACCESS_KEY_ID".
      aws_access_key="<access key>",
      aws_secret_key="<secret key>",
      # Kredensial sementara dapat digunakan dengan aws_session_token.
      # Baca lebih lanjut di https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
      aws_session_token="<session_token>",
      # aws_region mengubah wilayah aws tempat permintaan dibuat. Secara default, kami membaca AWS_REGION,
      # dan jika itu tidak ada, kami default ke us-east-1. Perhatikan bahwa kami tidak membaca ~/.aws/config untuk wilayah.
      aws_region="us-west-2",
  )

  message = client.messages.create(
      model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
      max_tokens=256,
      messages=[{"role": "user", "content": "Hello, world"}]
  )
  print(message.content)
  ```

  ```typescript TypeScript
  import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

  const client = new AnthropicBedrock({
    // Autentikasi dengan memberikan kunci di bawah atau gunakan penyedia kredensial AWS default, seperti
    // menggunakan ~/.aws/credentials atau variabel lingkungan "AWS_SECRET_ACCESS_KEY" dan "AWS_ACCESS_KEY_ID".
    awsAccessKey: '<access key>',
    awsSecretKey: '<secret key>',

    // Kredensial sementara dapat digunakan dengan awsSessionToken.
    // Baca lebih lanjut di https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html.
    awsSessionToken: '<session_token>',

    // awsRegion mengubah wilayah aws tempat permintaan dibuat. Secara default, kami membaca AWS_REGION,
    // dan jika itu tidak ada, kami default ke us-east-1. Perhatikan bahwa kami tidak membaca ~/.aws/config untuk wilayah.
    awsRegion: 'us-west-2',
  });

  async function main() {
    const message = await client.messages.create({
      model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
      max_tokens: 256,
      messages: [{"role": "user", "content": "Hello, world"}]
    });
    console.log(message);
  }
  main().catch(console.error);
  ```

  ```python Boto3 (Python)
  import boto3
  import json

  bedrock = boto3.client(service_name="bedrock-runtime")
  body = json.dumps({
    "max_tokens": 256,
    "messages": [{"role": "user", "content": "Hello, world"}],
    "anthropic_version": "bedrock-2023-05-31"
  })

  response = bedrock.invoke_model(body=body, modelId="global.anthropic.claude-sonnet-4-5-20250929-v1:0")

  response_body = json.loads(response.get("body").read())
  print(response_body.get("content"))
  ```
</CodeGroup>

Lihat [SDK klien](/docs/id/api/client-sdks) kami untuk detail lebih lanjut, dan dokumentasi Bedrock resmi [di sini](https://docs.aws.amazon.com/bedrock/).

## Pencatatan aktivitas

Bedrock menyediakan [layanan pencatatan invokasi](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html) yang memungkinkan pelanggan untuk mencatat prompt dan penyelesaian yang terkait dengan penggunaan Anda.

Anthropic merekomendasikan agar Anda mencatat aktivitas Anda setidaknya pada dasar rolling 30 hari untuk memahami aktivitas Anda dan menyelidiki potensi penyalahgunaan.

<Note>
Mengaktifkan layanan ini tidak memberikan AWS atau Anthropic akses apa pun ke konten Anda.
</Note>

## Dukungan fitur
Anda dapat menemukan semua fitur yang saat ini didukung di Bedrock [di sini](/docs/id/api/overview).

### Dukungan PDF di Bedrock

Dukungan PDF tersedia di Amazon Bedrock melalui API Converse dan API InvokeModel. Untuk informasi terperinci tentang kemampuan dan keterbatasan pemrosesan PDF, lihat [dokumentasi dukungan PDF](/docs/id/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

**Pertimbangan penting untuk pengguna API Converse:**
- Analisis PDF visual (bagan, gambar, tata letak) memerlukan kutipan untuk diaktifkan
- Tanpa kutipan, hanya ekstraksi teks dasar yang tersedia
- Untuk kontrol penuh tanpa kutipan paksa, gunakan API InvokeModel

Untuk detail lebih lanjut tentang dua mode pemrosesan dokumen dan keterbatasannya, lihat [panduan dukungan PDF](/docs/id/build-with-claude/pdf-support#amazon-bedrock-pdf-support).

### Jendela konteks token 1M

Claude Sonnet 4 dan 4.5 mendukung [jendela konteks token 1M](/docs/id/build-with-claude/context-windows#1m-token-context-window) di Amazon Bedrock.

<Note>
Jendela konteks token 1M saat ini dalam beta. Untuk menggunakan jendela konteks yang diperluas, sertakan header beta `context-1m-2025-08-07` dalam [permintaan API Bedrock Anda](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages-request-response.html).
</Note>

## Global vs regional endpoints

Mulai dengan **Claude Sonnet 4.5 dan semua model di masa depan**, Amazon Bedrock menawarkan dua jenis endpoint:

- **Global endpoints**: Perutean dinamis untuk ketersediaan maksimal
- **Regional endpoints**: Perutean data terjamin melalui wilayah geografis tertentu

Regional endpoints mencakup premium harga 10% dibandingkan global endpoints.

<Note>
Ini berlaku untuk Claude Sonnet 4.5 dan model di masa depan saja. Model yang lebih lama (Claude Sonnet 4, Opus 4, dan sebelumnya) mempertahankan struktur harga yang ada.
</Note>

### Kapan menggunakan setiap opsi

**Global endpoints (direkomendasikan):**
- Memberikan ketersediaan dan uptime maksimal
- Secara dinamis merutingkan permintaan ke wilayah dengan kapasitas yang tersedia
- Tidak ada premium harga
- Terbaik untuk aplikasi di mana residensi data fleksibel

**Regional endpoints (CRIS):**
- Merutingkan lalu lintas melalui wilayah geografis tertentu
- Diperlukan untuk persyaratan residensi data dan kepatuhan
- Tersedia untuk US, EU, Jepang, dan Australia
- Premium harga 10% mencerminkan biaya infrastruktur untuk kapasitas regional yang didedikasikan

### Implementasi

**Menggunakan global endpoints (default untuk Sonnet 4.5 dan 4):**

ID model untuk Claude Sonnet 4.5 dan 4 sudah mencakup awalan `global.`:

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

message = client.messages.create(
    model="global.anthropic.claude-sonnet-4-5-20250929-v1:0",
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

const message = await client.messages.create({
  model: 'global.anthropic.claude-sonnet-4-5-20250929-v1:0',
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

**Menggunakan regional endpoints (CRIS):**

Untuk menggunakan regional endpoints, hapus awalan `global.` dari ID model:

<CodeGroup>
```python Python
from anthropic import AnthropicBedrock

client = AnthropicBedrock(aws_region="us-west-2")

# Menggunakan endpoint regional US (CRIS)
message = client.messages.create(
    model="anthropic.claude-sonnet-4-5-20250929-v1:0",  # Tidak ada awalan global.
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, world"}]
)
```

```typescript TypeScript
import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';

const client = new AnthropicBedrock({
  awsRegion: 'us-west-2',
});

// Menggunakan endpoint regional US (CRIS)
const message = await client.messages.create({
  model: 'anthropic.claude-sonnet-4-5-20250929-v1:0',  // Tidak ada awalan global.
  max_tokens: 256,
  messages: [{role: "user", content: "Hello, world"}]
});
```
</CodeGroup>

### Sumber daya tambahan

- **Harga AWS Bedrock:** [aws.amazon.com/bedrock/pricing](https://aws.amazon.com/bedrock/pricing/)
- **Dokumentasi harga AWS:** [Panduan harga Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html)
- **Posting blog AWS:** [Memperkenalkan Claude Sonnet 4.5 di Amazon Bedrock](https://aws.amazon.com/blogs/aws/introducing-claude-sonnet-4-5-in-amazon-bedrock-anthropics-most-intelligent-model-best-for-coding-and-complex-agents/)
- **Detail harga Anthropic:** [Dokumentasi harga](/docs/id/about-claude/pricing#third-party-platform-pricing)