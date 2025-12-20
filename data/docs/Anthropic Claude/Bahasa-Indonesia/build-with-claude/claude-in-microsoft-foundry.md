# Claude di Microsoft Foundry

Akses model Claude melalui Microsoft Foundry dengan endpoint asli Azure dan autentikasi.

---

Panduan ini akan memandu Anda melalui proses pengaturan dan pembuatan panggilan API ke Claude di Foundry dalam Python, TypeScript, atau menggunakan permintaan HTTP langsung. Ketika Anda dapat mengakses Claude di Foundry, Anda akan ditagih untuk penggunaan Claude di Microsoft Marketplace dengan langganan Azure Anda, memungkinkan Anda mengakses kemampuan terbaru Claude sambil mengelola biaya melalui langganan Azure Anda.

Ketersediaan regional: Saat peluncuran, Claude tersedia sebagai jenis penerapan Global Standard dalam sumber daya Foundry dengan US DataZone akan segera hadir. Harga Claude di Microsoft Marketplace menggunakan harga API standar Anthropic. Kunjungi [halaman harga](https://claude.com/pricing#api) kami untuk detail.

## Pratinjau

Dalam integrasi platform pratinjau ini, model Claude berjalan di infrastruktur Anthropic. Ini adalah integrasi komersial untuk penagihan dan akses melalui Azure. Sebagai pemroses independen untuk Microsoft, pelanggan yang menggunakan Claude melalui Microsoft Foundry tunduk pada persyaratan penggunaan data Anthropic. Anthropic terus memberikan komitmen keamanan dan data terdepan di industri, termasuk ketersediaan retensi data nol.

## Prasyarat

Sebelum Anda memulai, pastikan Anda memiliki:

- Langganan Azure yang aktif
- Akses ke [Foundry](https://ai.azure.com/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) terinstal (opsional, untuk manajemen sumber daya)

## Instal SDK

[SDK klien](/docs/id/api/client-sdks) Anthropic mendukung Foundry melalui paket khusus platform.

```bash
# Python
pip install -U "anthropic"

# Typescript
npm install @anthropic-ai/foundry-sdk
```

## Penyediaan

Foundry menggunakan hierarki dua tingkat: **sumber daya** berisi konfigurasi keamanan dan penagihan Anda, sementara **penerapan** adalah instans model yang Anda panggil melalui API. Anda akan terlebih dahulu membuat sumber daya Foundry, kemudian membuat satu atau lebih penerapan Claude di dalamnya.

### Penyediaan sumber daya Foundry

Buat sumber daya Foundry, yang diperlukan untuk menggunakan dan mengelola layanan di Azure. Anda dapat mengikuti instruksi ini untuk membuat [sumber daya Foundry](https://learn.microsoft.com/en-us/azure/ai-services/multi-service-resource?pivots=azportal#create-a-new-azure-ai-foundry-resource). Alternatifnya, Anda dapat memulai dengan membuat [proyek Foundry](https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/create-projects?tabs=ai-foundry), yang melibatkan pembuatan sumber daya Foundry.

Untuk menyediakan sumber daya Anda:

1. Navigasikan ke [portal Foundry](https://ai.azure.com/)
2. Buat sumber daya Foundry baru atau pilih yang sudah ada
3. Konfigurasikan manajemen akses menggunakan kunci API yang dikeluarkan Azure atau Entra ID untuk kontrol akses berbasis peran
4. Secara opsional konfigurasikan sumber daya untuk menjadi bagian dari jaringan pribadi (Azure Virtual Network) untuk keamanan yang ditingkatkan
5. Catat nama sumber daya Anda—Anda akan menggunakannya sebagai `{resource}` dalam titik akhir API (misalnya, `https://{resource}.services.ai.azure.com/anthropic/v1/*`)

### Membuat penerapan Foundry

Setelah membuat sumber daya Anda, terapkan model Claude untuk membuatnya tersedia untuk panggilan API:

1. Di portal Foundry, navigasikan ke sumber daya Anda
2. Buka **Models + endpoints** dan pilih **+ Deploy model** > **Deploy base model**
3. Cari dan pilih model Claude (misalnya, `claude-sonnet-4-5`)
4. Konfigurasikan pengaturan penerapan:
   - **Deployment name**: Secara default ke ID model, tetapi Anda dapat menyesuaikannya (misalnya, `my-claude-deployment`). Nama penerapan tidak dapat diubah setelah dibuat.
   - **Deployment type**: Pilih Global Standard (direkomendasikan untuk Claude)
5. Pilih **Deploy** dan tunggu penyediaan selesai
6. Setelah diterapkan, Anda dapat menemukan URL titik akhir dan kunci Anda di bawah **Keys and Endpoint**

<Note>
  Nama penerapan yang Anda pilih menjadi nilai yang Anda teruskan dalam parameter `model` dari permintaan API Anda. Anda dapat membuat beberapa penerapan model yang sama dengan nama berbeda untuk mengelola konfigurasi terpisah atau batas laju.
</Note>

## Autentikasi

Claude di Foundry mendukung dua metode autentikasi: kunci API dan token Entra ID. Kedua metode menggunakan titik akhir yang dihosting Azure dalam format `https://{resource}.services.ai.azure.com/anthropic/v1/*`.

### Autentikasi kunci API

Setelah menyediakan sumber daya Claude Foundry Anda, Anda dapat memperoleh kunci API dari portal Foundry:

1. Navigasikan ke sumber daya Anda di portal Foundry
2. Buka bagian **Keys and Endpoint**
3. Salin salah satu kunci API yang disediakan
4. Gunakan header `api-key` atau `x-api-key` dalam permintaan Anda, atau berikan ke SDK

SDK Python dan TypeScript memerlukan kunci API dan nama sumber daya atau URL dasar. SDK akan secara otomatis membaca ini dari variabel lingkungan berikut jika ditentukan:

- `ANTHROPIC_FOUNDRY_API_KEY` - Kunci API Anda
- `ANTHROPIC_FOUNDRY_RESOURCE` - Nama sumber daya Anda (misalnya, `example-resource`)
- `ANTHROPIC_FOUNDRY_BASE_URL` - Alternatif untuk nama sumber daya; URL dasar lengkap (misalnya, `https://example-resource.services.ai.azure.com/anthropic/`)

<Note>
Parameter `resource` dan `base_url` saling eksklusif. Berikan nama sumber daya (yang digunakan SDK untuk membuat URL sebagai `https://{resource}.services.ai.azure.com/anthropic/`) atau URL dasar lengkap secara langsung.
</Note>

**Contoh menggunakan kunci API:**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry

client = AnthropicFoundry(
    api_key=os.environ.get("ANTHROPIC_FOUNDRY_API_KEY"),
    resource='example-resource', # your resource name
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";

const client = new AnthropicFoundry({
  apiKey: process.env.ANTHROPIC_FOUNDRY_API_KEY,
  resource: 'example-resource', // your resource name
});

const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "api-key: YOUR_AZURE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Warning>
Jaga keamanan kunci API Anda. Jangan pernah komitkan ke kontrol versi atau bagikan secara publik. Siapa pun yang memiliki akses ke kunci API Anda dapat membuat permintaan ke Claude melalui sumber daya Foundry Anda.
</Warning>

## Autentikasi Microsoft Entra

Untuk keamanan yang ditingkatkan dan manajemen akses terpusat, Anda dapat menggunakan token Entra ID (sebelumnya Azure Active Directory):

1. Aktifkan autentikasi Entra untuk sumber daya Foundry Anda
2. Dapatkan token akses dari Entra ID
3. Gunakan token dalam header `Authorization: Bearer {TOKEN}`

**Contoh menggunakan Entra ID:**

<CodeGroup>
```python Python
import os
from anthropic import AnthropicFoundry
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

# Get Azure Entra ID token using token provider pattern
token_provider = get_bearer_token_provider(
    DefaultAzureCredential(),
    "https://cognitiveservices.azure.com/.default"
)

# Create client with Entra ID authentication
client = AnthropicFoundry(
    resource='example-resource', # your resource name
    azure_ad_token_provider=token_provider  # Use token provider for Entra ID auth
)

# Make request
message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
print(message.content)
```

```typescript TypeScript
import AnthropicFoundry from "@anthropic-ai/foundry-sdk";
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from "@azure/identity";

// Get Entra ID token using token provider pattern
const credential = new DefaultAzureCredential();
const tokenProvider = getBearerTokenProvider(
  credential,
  "https://cognitiveservices.azure.com/.default"
);

// Create client with Entra ID authentication
const client = new AnthropicFoundry({
  resource: 'example-resource', // your resource name
  azureADTokenProvider: tokenProvider, // Use token provider for Entra ID auth
});

// Make request
const message = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
```

```bash Shell
# Get Azure Entra ID token
ACCESS_TOKEN=$(az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv)

# Make request with token. Replace {resource} with your resource name
curl https://{resource}.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```
</CodeGroup>

<Note>
Autentikasi Azure Entra ID memungkinkan Anda mengelola akses menggunakan Azure RBAC, mengintegrasikan dengan manajemen identitas organisasi Anda, dan menghindari pengelolaan kunci API secara manual.
</Note>

## ID permintaan korelasi

Foundry menyertakan pengenal permintaan dalam header respons HTTP untuk debugging dan pelacakan. Saat menghubungi dukungan, berikan nilai `request-id` dan `apim-request-id` untuk membantu tim dengan cepat menemukan dan menyelidiki permintaan Anda di seluruh sistem Anthropic dan Azure.

## Fitur yang didukung

Claude di Foundry mendukung sebagian besar fitur Claude yang kuat. Anda dapat menemukan semua fitur yang saat ini didukung [di sini](/docs/id/build-with-claude/overview).

### Fitur yang tidak didukung

- Admin API (titik akhir `/v1/organizations/*`)
- Models API (`/v1/models`)
- Message Batch API (`/v1/messages/batches`)

## Respons API

Respons API dari Claude di Foundry mengikuti [format respons API Anthropic](/docs/id/api/messages) standar. Ini termasuk objek `usage` dalam badan respons, yang memberikan informasi konsumsi token terperinci untuk permintaan Anda. Objek `usage` konsisten di semua platform (API pihak pertama, Foundry, Amazon Bedrock, dan Google Vertex AI).

Untuk detail tentang header respons khusus Foundry, lihat [bagian ID permintaan korelasi](#correlation-request-ids).

## ID model API dan penerapan

Model Claude berikut tersedia melalui Foundry. Model generasi terbaru (Sonnet 4.5, Opus 4.1, dan Haiku 4.5) menawarkan kemampuan paling canggih:

| Model             | Default Deployment Name     |
| :---------------- | :-------------------------- |
| Claude Opus 4.5   | `claude-opus-4-5`  |
| Claude Sonnet 4.5 | `claude-sonnet-4-5`         |
| Claude Opus 4.1   | `claude-opus-4-1`           |
| Claude Haiku 4.5  | `claude-haiku-4-5`          |

Secara default, nama penerapan cocok dengan ID model yang ditunjukkan di atas. Namun, Anda dapat membuat penerapan khusus dengan nama berbeda di portal Foundry untuk mengelola konfigurasi, versi, atau batas laju yang berbeda. Gunakan nama penerapan (tidak harus ID model) dalam permintaan API Anda.

## Pemantauan dan logging

Azure menyediakan kemampuan pemantauan dan logging komprehensif untuk penggunaan Claude Anda melalui pola Azure standar:

- **Azure Monitor**: Lacak penggunaan API, latensi, dan tingkat kesalahan
- **Azure Log Analytics**: Kueri dan analisis log permintaan/respons
- **Cost Management**: Pantau dan perkirakan biaya yang terkait dengan penggunaan Claude

Anthropic merekomendasikan logging aktivitas Anda setidaknya pada dasar rolling 30 hari untuk memahami pola penggunaan dan menyelidiki masalah potensial apa pun.

<Note>
Layanan logging Azure dikonfigurasi dalam langganan Azure Anda. Mengaktifkan logging tidak memberikan Microsoft atau Anthropic akses ke konten Anda di luar apa yang diperlukan untuk penagihan dan operasi layanan.
</Note>

## Pemecahan masalah

### Kesalahan autentikasi

**Kesalahan**: `401 Unauthorized` atau `Invalid API key`

- **Solusi**: Verifikasi kunci API Anda benar. Anda dapat memperoleh kunci API baru dari portal Azure di bawah **Keys and Endpoint** untuk sumber daya Claude Anda.
- **Solusi**: Jika menggunakan Azure Entra ID, pastikan token akses Anda valid dan belum kedaluwarsa. Token biasanya kedaluwarsa setelah 1 jam.

**Kesalahan**: `403 Forbidden`

- **Solusi**: Akun Azure Anda mungkin kekurangan izin yang diperlukan. Pastikan Anda memiliki peran Azure RBAC yang sesuai ditugaskan (misalnya, "Cognitive Services OpenAI User").

### Pembatasan laju

**Kesalahan**: `429 Too Many Requests`

- **Solusi**: Anda telah melampaui batas laju Anda. Implementasikan logika backoff eksponensial dan coba lagi dalam aplikasi Anda.
- **Solusi**: Pertimbangkan untuk meminta peningkatan batas laju melalui portal Azure atau dukungan Azure.

#### Header batas laju

Foundry tidak menyertakan header batas laju standar Anthropic (`anthropic-ratelimit-tokens-limit`, `anthropic-ratelimit-tokens-remaining`, `anthropic-ratelimit-tokens-reset`, `anthropic-ratelimit-input-tokens-limit`, `anthropic-ratelimit-input-tokens-remaining`, `anthropic-ratelimit-input-tokens-reset`, `anthropic-ratelimit-output-tokens-limit`, `anthropic-ratelimit-output-tokens-remaining`, dan `anthropic-ratelimit-output-tokens-reset`) dalam respons. Kelola pembatasan laju melalui alat pemantauan Azure sebagai gantinya.

### Kesalahan model dan penerapan

**Kesalahan**: `Model not found` atau `Deployment not found`

- **Solusi**: Verifikasi Anda menggunakan nama penerapan yang benar. Jika Anda belum membuat penerapan khusus, gunakan ID model default (misalnya, `claude-sonnet-4-5`).
- **Solusi**: Pastikan model/penerapan tersedia di wilayah Azure Anda.

**Kesalahan**: `Invalid model parameter`

- **Solusi**: Parameter model harus berisi nama penerapan Anda, yang dapat disesuaikan di portal Foundry. Verifikasi penerapan ada dan dikonfigurasi dengan benar.

## Sumber daya tambahan

- **Dokumentasi Foundry**: [ai.azure.com/catalog](https://ai.azure.com/catalog/publishers/anthropic)
- **Harga Azure**: [azure.microsoft.com/en-us/pricing](https://azure.microsoft.com/en-us/pricing/)
- **Detail harga Anthropic**: [Dokumentasi Harga](/docs/id/about-claude/pricing#third-party-platform-pricing)
- **Panduan autentikasi**: Lihat [bagian autentikasi](#authentication) di atas
- **Portal Azure**: [portal.azure.com](https://portal.azure.com/)