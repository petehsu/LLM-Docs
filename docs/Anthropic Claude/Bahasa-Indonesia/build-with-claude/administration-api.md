# Ikhtisar Admin API

Kelola sumber daya organisasi Anda secara terprogram dengan Admin API, termasuk anggota organisasi, ruang kerja, dan kunci API.

---

<Tip>
**The Admin API is unavailable for individual accounts.** To collaborate with teammates and add members, set up your organization in **Console → Settings → Organization**.
</Tip>

[Admin API](/docs/id/api/admin) memungkinkan Anda mengelola sumber daya organisasi Anda secara terprogram, termasuk anggota organisasi, ruang kerja, dan kunci API. Ini memberikan kontrol terprogram atas tugas administratif yang sebaliknya memerlukan konfigurasi manual di [Claude Console](/).

<Check>
  **Admin API memerlukan akses khusus**

  Admin API memerlukan kunci Admin API khusus (dimulai dengan `sk-ant-admin...`) yang berbeda dari kunci API standar. Hanya anggota organisasi dengan peran admin yang dapat menyediakan kunci Admin API melalui Claude Console.
</Check>

## Cara kerja Admin API

Saat Anda menggunakan Admin API:

1. Anda membuat permintaan menggunakan kunci Admin API Anda di header `x-api-key`
2. API memungkinkan Anda mengelola:
   - Anggota organisasi dan peran mereka
   - Undangan anggota organisasi
   - Ruang kerja dan anggotanya
   - Kunci API

Ini berguna untuk:
- Mengotomatisasi onboarding/offboarding pengguna
- Mengelola akses ruang kerja secara terprogram
- Memantau dan mengelola penggunaan kunci API

## Peran dan izin organisasi

Ada lima peran tingkat organisasi. Lihat detail selengkapnya [di sini](https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions).

| Peran | Izin |
|------|-------------|
| user | Dapat menggunakan Workbench |
| claude_code_user | Dapat menggunakan Workbench dan [Claude Code](https://code.claude.com/docs/en/overview) |
| developer | Dapat menggunakan Workbench dan mengelola kunci API |
| billing | Dapat menggunakan Workbench dan mengelola detail penagihan |
| admin | Dapat melakukan semua hal di atas, plus mengelola pengguna |

## Konsep kunci

### Anggota Organisasi

Anda dapat membuat daftar [anggota organisasi](/docs/id/api/admin-api/users/get-user), memperbarui peran anggota, dan menghapus anggota.

<CodeGroup>
```bash Shell
# List organization members
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update member role
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'

# Remove member
curl --request DELETE "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Undangan Organisasi

Anda dapat mengundang pengguna ke organisasi dan mengelola [undangan](/docs/id/api/admin-api/invites/get-invite) tersebut.

<CodeGroup>

```bash Shell
# Create invite
curl --request POST "https://api.anthropic.com/v1/organizations/invites" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "email": "newuser@domain.com",
    "role": "developer"
  }'

# List invites
curl "https://api.anthropic.com/v1/organizations/invites?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Delete invite
curl --request DELETE "https://api.anthropic.com/v1/organizations/invites/{invite_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Ruang Kerja

Buat dan kelola [ruang kerja](/docs/id/api/admin-api/workspaces/get-workspace) ([konsol](/settings/workspaces)) untuk mengorganisir sumber daya Anda:

<CodeGroup>

```bash Shell
# Create workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"name": "Production"}'

# List workspaces
curl "https://api.anthropic.com/v1/organizations/workspaces?limit=10&include_archived=false" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Archive workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/archive" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Anggota Ruang Kerja

Kelola [akses pengguna ke ruang kerja tertentu](/docs/id/api/admin-api/workspace_members/get-workspace-member):

<CodeGroup>

```bash Shell
# Add member to workspace
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "user_id": "user_xxx",
    "workspace_role": "workspace_developer"
  }'

# List workspace members
curl "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update member role
curl --request POST "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "workspace_role": "workspace_admin"
  }'

# Remove member from workspace
curl --request DELETE "https://api.anthropic.com/v1/organizations/workspaces/{workspace_id}/members/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

</CodeGroup>

### Kunci API

Pantau dan kelola [kunci API](/docs/id/api/admin-api/apikeys/get-api-key):

<CodeGroup>

```bash Shell
# List API keys
curl "https://api.anthropic.com/v1/organizations/api_keys?limit=10&status=active&workspace_id=wrkspc_xxx" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Update API key
curl --request POST "https://api.anthropic.com/v1/organizations/api_keys/{api_key_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{
    "status": "inactive",
    "name": "New Key Name"
  }'
```

</CodeGroup>

## Mengakses informasi organisasi

Dapatkan informasi tentang organisasi Anda secara terprogram dengan endpoint `/v1/organizations/me`.

Sebagai contoh:

```bash
curl "https://api.anthropic.com/v1/organizations/me" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ADMIN_API_KEY"
```

```json
{
  "id": "12345678-1234-5678-1234-567812345678",
  "type": "organization",
  "name": "Organization Name"
}
```

Endpoint ini berguna untuk menentukan secara terprogram organisasi mana yang dimiliki kunci Admin API.

Untuk detail parameter lengkap dan skema respons, lihat [referensi Organization Info API](/docs/id/api/admin-api/organization/get-me).

## Mengakses laporan penggunaan dan biaya

Untuk mengakses laporan penggunaan dan biaya untuk organisasi Anda, gunakan endpoint Usage and Cost API:

- [**Endpoint Penggunaan**](/docs/id/build-with-claude/usage-cost-api#usage-api) (`/v1/organizations/usage_report/messages`) menyediakan data penggunaan terperinci, termasuk jumlah token dan metrik permintaan, dikelompokkan menurut berbagai dimensi seperti ruang kerja, pengguna, dan model.
- [**Endpoint Biaya**](/docs/id/build-with-claude/usage-cost-api#cost-api) (`/v1/organizations/cost_report`) menyediakan data biaya yang terkait dengan penggunaan organisasi Anda, memungkinkan Anda melacak pengeluaran dan mengalokasikan biaya berdasarkan ruang kerja atau deskripsi.

Endpoint ini memberikan wawasan terperinci tentang penggunaan organisasi Anda dan biaya terkait.

## Mengakses analitik Claude Code

Untuk organisasi yang menggunakan Claude Code, [**Claude Code Analytics API**](/docs/id/build-with-claude/claude-code-analytics-api) menyediakan metrik produktivitas terperinci dan wawasan penggunaan:

- [**Endpoint Claude Code Analytics**](/docs/id/build-with-claude/claude-code-analytics-api) (`/v1/organizations/usage_report/claude_code`) menyediakan metrik agregat harian untuk penggunaan Claude Code, termasuk sesi, baris kode, komit, permintaan tarik, statistik penggunaan alat, dan data biaya yang dipecah menurut pengguna dan model.

API ini memungkinkan Anda melacak produktivitas pengembang, menganalisis adopsi Claude Code, dan membangun dasbor khusus untuk organisasi Anda.

## Praktik terbaik

Untuk menggunakan Admin API secara efektif:

- Gunakan nama dan deskripsi yang bermakna untuk ruang kerja dan kunci API
- Terapkan penanganan kesalahan yang tepat untuk operasi yang gagal
- Audit secara teratur peran dan izin anggota
- Bersihkan ruang kerja yang tidak digunakan dan undangan yang kedaluwarsa
- Pantau penggunaan kunci API dan putar kunci secara berkala

## FAQ

<section title="Izin apa yang diperlukan untuk menggunakan Admin API?">

Hanya anggota organisasi dengan peran admin yang dapat menggunakan Admin API. Mereka juga harus memiliki kunci Admin API khusus (dimulai dengan `sk-ant-admin`).

</section>

<section title="Bisakah saya membuat kunci API baru melalui Admin API?">

Tidak, kunci API baru hanya dapat dibuat melalui Claude Console untuk alasan keamanan. Admin API hanya dapat mengelola kunci API yang sudah ada.

</section>

<section title="Apa yang terjadi pada kunci API saat menghapus pengguna?">

Kunci API tetap dalam keadaan saat ini karena mereka dibatasi pada Organisasi, bukan pada pengguna individual.

</section>

<section title="Bisakah admin organisasi dihapus melalui API?">

Tidak, anggota organisasi dengan peran admin tidak dapat dihapus melalui API untuk alasan keamanan.

</section>

<section title="Berapa lama undangan organisasi berlangsung?">

Undangan organisasi kedaluwarsa setelah 21 hari. Saat ini tidak ada cara untuk mengubah periode kedaluwarsa ini.

</section>

<section title="Apakah ada batasan pada ruang kerja?">

Ya, Anda dapat memiliki maksimal 100 ruang kerja per Organisasi. Ruang kerja yang diarsipkan tidak dihitung menuju batas ini.

</section>

<section title="Apa itu Ruang Kerja Default?">

Setiap Organisasi memiliki "Ruang Kerja Default" yang tidak dapat diedit atau dihapus, dan tidak memiliki ID. Ruang Kerja ini tidak muncul di endpoint daftar ruang kerja.

</section>

<section title="Bagaimana peran organisasi mempengaruhi akses Ruang Kerja?">

Admin organisasi secara otomatis mendapatkan peran `workspace_admin` ke semua ruang kerja. Anggota penagihan organisasi secara otomatis mendapatkan peran `workspace_billing`. Pengguna dan pengembang organisasi harus ditambahkan secara manual ke setiap ruang kerja.

</section>

<section title="Peran mana yang dapat ditetapkan di ruang kerja?">

Pengguna dan pengembang organisasi dapat ditetapkan peran `workspace_admin`, `workspace_developer`, atau `workspace_user`. Peran `workspace_billing` tidak dapat ditetapkan secara manual - peran ini diwarisi dari memiliki peran organisasi `billing`.

</section>

<section title="Bisakah peran ruang kerja admin atau anggota penagihan organisasi diubah?">

Hanya anggota penagihan organisasi yang dapat memiliki peran ruang kerja mereka ditingkatkan ke peran admin. Sebaliknya, admin organisasi dan anggota penagihan tidak dapat memiliki peran ruang kerja mereka diubah atau dihapus dari ruang kerja saat mereka memegang peran organisasi tersebut. Akses ruang kerja mereka harus diubah dengan mengubah peran organisasi mereka terlebih dahulu.

</section>

<section title="Apa yang terjadi pada akses ruang kerja saat peran organisasi berubah?">

Jika admin organisasi atau anggota penagihan diturunkan menjadi pengguna atau pengembang, mereka kehilangan akses ke semua ruang kerja kecuali yang mereka tetapkan peran secara manual. Ketika pengguna dipromosikan ke peran admin atau penagihan, mereka mendapatkan akses otomatis ke semua ruang kerja.

</section>