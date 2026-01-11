# DOKUMENTASI SISTEM SIKAP PP POLRI

## Sistem Informasi Kasus dan Advokasi Profesional POLRI

---

## DAFTAR ISI

1. [Pendahuluan](#1-pendahuluan)
2. [System Flow (Alur Sistem)](#2-system-flow-alur-sistem)
3. [Flowchart Proses Inti](#3-flowchart-proses-inti)
4. [Sitemap Aplikasi](#4-sitemap-aplikasi)
5. [Use Case Diagram](#5-use-case-diagram)
6. [Ringkasan](#6-ringkasan)

---

## 1. PENDAHULUAN

### 1.1 Tentang SIKAP PP POLRI

SIKAP PP POLRI (Sistem Informasi Kasus dan Advokasi Profesional POLRI) adalah aplikasi dashboard internal yang dirancang khusus untuk petugas POLRI dalam mengelola kasus hukum, dokumentasi, klien, tim internal, laporan, dan aktivitas operasional secara terpadu dan terstruktur.

### 1.2 Tujuan Sistem

- Mengelola data kasus hukum secara terstruktur dan terorganisir
- Mempermudah kolaborasi tim internal POLRI
- Menyediakan dokumentasi dan arsip digital yang aman
- Memberikan analisis statistik dan laporan berkala
- Meningkatkan efisiensi operasional penanganan kasus

### 1.3 Pengguna Sistem (Internal POLRI)

Sistem ini hanya diperuntukkan bagi pengguna internal POLRI dengan tiga peran utama:

1. **Admin** - Memiliki akses penuh ke semua modul dan fitur administrasi
2. **Supervisor** - Memiliki akses pengawasan dan persetujuan
3. **Staf** - Memiliki akses operasional untuk pengelolaan data harian

---

## 2. SYSTEM FLOW (ALUR SISTEM)

### 2.1 Alur Kerja Umum Pengguna Internal

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALUR KERJA PENGGUNA SIKAP PP POLRI            │
└─────────────────────────────────────────────────────────────────┘

TAHAP 1: AUTENTIKASI
├── A. Akses Aplikasi
│   └── Pengguna membuka aplikasi SIKAP PP POLRI
│
├── B. Pilihan Autentikasi
│   ├── LOGIN (Pengguna Terdaftar)
│   │   ├── Input Email
│   │   ├── Input Password
│   │   ├── Validasi Kredensial
│   │   └── Akses Diterima → Dashboard
│   │
│   ├── REGISTER (Pengguna Baru Internal)
│   │   ├── Input Data Pribadi (Nama, Email, Telepon)
│   │   ├── Pilih Peran (Admin/Staf/Supervisor)
│   │   ├── Set Password (min. 8 karakter)
│   │   ├── Validasi Data
│   │   └── Akun Dibuat → Kembali ke Login
│   │
│   └── LUPA PASSWORD
│       ├── Input Email Terdaftar
│       ├── Sistem Kirim Link Reset
│       └── User Reset Password → Kembali ke Login

TAHAP 2: NAVIGASI DASHBOARD
├── A. Dashboard Utama
│   ├── Overview Statistik Kasus
│   │   ├── Total Kasus (Card)
│   │   ├── Kasus Aktif (Card)
│   │   ├── Kasus Selesai (Card)
│   │   └── Klien Terdaftar (Card)
│   ├── Grafik & Visualisasi
│   │   ├── Bar Chart: Tren Kasus Bulanan (6 bulan)
│   │   ├── Pie Chart: Distribusi Status Kasus
│   │   ├── Line Chart: Grafik Penyelesaian Kasus
│   │   └── Area Chart: Aktivitas Mingguan
│   ├── Daftar Tugas Aktif (Table)
│   │   ├── Judul Tugas
│   │   ├── Penanggung Jawab
│   │   ├── Status & Progress Bar
│   │   └── Action: Edit, Delete
│   ├── Kasus Terbaru (Table)
│   │   ├── Nomor Kasus
│   │   ├── Klien & Jenis
│   │   ├── Status & Waktu
│   │   └── Action: Lihat Detail
│   └── Timeline Aktivitas (Feed)
│       ├── User & Timestamp
│       ├── Aksi yang Dilakukan
│       └── Detail Perubahan
│
├── B. Sidebar Menu Utama (Fixed Left - 288px)
│   ├── Logo & User Profile
│   │   ├── Shield Icon + "SIKAP PP POLRI"
│   │   ├── Avatar User
│   │   ├── Nama Lengkap
│   │   └── Role Badge
│   ├── Navigation Menu
│   │   ├── 1. Dashboard
│   │   ├── 2. Manajemen Kasus (Expandable)
│   │   │   ├── Daftar Kasus
│   │   │   └── Tambah Kasus Baru
│   │   ├── 3. Klien & Tim (Expandable)
│   │   │   ├── Data Klien
│   │   │   └── Tim Internal
│   │   ├── 4. Dokumen & Arsip
│   │   ├── 5. Tugas & Aktivitas
│   │   ├── 6. Kalender & Jadwal
│   │   ├── 7. Statistik & Laporan
│   │   ├── 8. Pengaturan Sistem
│   │   ├── 9. Audit & Keamanan Data
│   │   └── 10. Bantuan & Pusat Informasi
│   └── Logout Button (Bottom)

TAHAP 3: OPERASIONAL MODUL
├── A. Manajemen Kasus (Proses Inti)
│   ├── 1. Daftar Kasus
│   │   ├── Tabel dengan Kolom:
│   │   │   ├── Nomor Kasus
│   │   │   ├── Nama Klien
│   │   │   ├── Jenis Kasus
│   │   │   ├── Status (Aktif/Selesai/Pending/Ditolak)
│   │   │   ├── Status Progres (Badge dengan 7 tahap):
│   │   │   │   ├── 1. Baru Masuk (Gray)
│   │   │   │   ├── 2. Verifikasi (Blue)
│   │   │   │   ├── 3. Penyelidikan (Yellow)
│   │   │   │   ├── 4. Pendampingan (Orange)
│   │   │   │   ├── 5. Persidangan (Purple)
│   │   │   │   ├── 6. Putusan (Indigo)
│   │   │   │   └── 7. Selesai (Green)
│   │   │   ├── Progress Bar (%)
│   │   │   ├── Penanggung Jawab
│   │   │   └── Tanggal Update
│   │   ├── Fitur Interaksi:
│   │   │   ├── Search (Nomor Kasus, Nama Klien)
│   │   │   ├── Filter by Status
│   │   │   ├── Filter by Status Progres
│   │   │   ├── Sort by Column
│   │   │   └── Export (PDF, Excel)
│   │   └── Action Buttons per Row:
│   │       ├── Lihat Detail → Detail Kasus
│   │       ├── Edit (Dialog Modal)
│   │       └── Hapus (Alert Confirmation)
│   │
│   ├── 2. Tambah Kasus Baru
│   │   ├── Form Input dengan Field:
│   │   │   ├── Nomor Kasus
│   │   │   ├── Judul Kasus
│   │   │   ├── Jenis Kasus (Dropdown)
│   │   │   ├── Deskripsi (Textarea)
│   │   │   ├── Pilih Klien (Select dari DB)
│   │   │   ├── Tim Penanganan (Multi-select)
│   │   │   ├── Prioritas (Rendah/Sedang/Tinggi)
│   │   │   ├── Status Awal (Default: Baru Masuk)
│   │   │   ├── Lokasi
│   │   │   └── Tenggat Waktu (Date Picker)
│   │   ├── Upload Dokumen (Optional)
│   │   └── Button: Simpan → Redirect ke Daftar Kasus
│   │
│   └── 3. Detail Kasus
│       ├── Header Section:
│       │   ├── Nomor Kasus
│       │   ├── Status Dropdown (Editable)
│       │   ├── Progress Bar (Editable)
│       │   └── Action: Kembali, Edit, Hapus
│       ├── Tab Navigation (6 Tabs):
│       │   ├── TAB 1: Informasi Umum
│       │   │   ├── Nomor Kasus
│       │   │   ├── Jenis Kasus
│       │   │   ├── Nama Klien
│       │   │   ├── Penanggung Jawab
│       │   │   ├── Deskripsi Lengkap
│       │   │   ├── Lokasi
│       │   │   ├── Tenggat Waktu
│       │   │   └── Button: Edit Data (Dialog)
│       │   │
│       │   ├── TAB 2: Timeline & Progress
│       │   │   ├── Visual Timeline (Vertical)
│       │   │   ├── 7 Stages dengan Indikator:
│       │   │   │   ├── Completed (Check Icon Green)
│       │   │   │   ├── Active (Circle Blue)
│       │   │   │   └── Pending (Circle Gray)
│       │   │   ├── Setiap Stage menampilkan:
│       │   │   │   ├── Nama Tahap
│       │   │   │   ├── Tanggal (jika sudah)
│       │   │   │   ├── Officer/PIC
│       │   │   │   └── Catatan
│       │   │   └── Button: Edit Stage (Dialog)
│       │   │
│       │   ├── TAB 3: Dokumen Kasus
│       │   │   ├── Upload Dokumen Baru
│       │   │   ├── Daftar Dokumen (Table):
│       │   │   │   ├── Nama File
│       │   │   │   ├── Tipe (Icon: PDF/Image/Doc)
│       │   │   │   ├── Ukuran
│       │   │   │   ├── Tanggal Upload
│       │   │   │   ├── Uploader
│       │   │   │   └── Action: Download, Preview, Hapus
│       │   │   └── Filter by Tipe Dokumen
│       │   │
│       │   ├── TAB 4: Tim Penanganan
│       │   │   ├── Daftar Anggota Tim (Cards)
│       │   │   ├── Setiap Card:
│       │   │   │   ├── Avatar & Nama
│       │   │   │   ├── Jabatan
│       │   │   │   ├── Kontak
│       │   │   │   └── Badge Role
│       │   │   └── Button: Tambah Anggota Tim
│       │   │
│       │   ├── TAB 5: Tugas Terkait
│       │   │   ├── Daftar Tugas (Table)
│       │   │   ├── Filter by Status
│       │   │   └── Button: Buat Tugas Baru
│       │   │
│       │   └── TAB 6: Log & Catatan
│       │       ├── Timeline Perubahan:
│       │       │   ├── Timestamp
│       │       │   ├── User
│       │       │   ├── Aksi (Update/Create/Delete)
│       │       │   └── Detail Perubahan
│       │       ├── Form Tambah Catatan Baru
│       │       └── List Catatan Lama
│
├── B. Klien & Tim
│   ├── Data Klien
│   │   ├── Tabel Klien dengan Kolom:
│   │   │   ├── Avatar
│   │   │   ├── Nama (Perorangan/Perusahaan)
│   │   │   ├── NIK/NPWP
│   │   │   ├── Alamat
│   │   │   ├── Kasus Aktif (Counter)
│   │   │   ├── Status Pendampingan (Aktif/Selesai)
│   │   │   ├── Kontak & Email
│   │   │   └── Action: Detail, Edit, Hapus
│   │   ├── Fitur:
│   │   │   ├── Search & Filter
│   │   │   ├── Tambah Klien Baru (Dialog)
│   │   │   └── Export Data
│   │   └── Detail Klien (Dialog):
│   │       ├── Profil Lengkap
│   │       ├── Histori Kasus
│   │       └── Dokumen Terkait
│   │
│   └── Tim Internal
│       ├── Tabel Anggota dengan Kolom:
│       │   ├── Avatar & Nama
│       │   ├── NIP
│       │   ├── Jabatan
│       │   ├── Divisi
│       │   ├── Kontak & Email
│       │   ├── Kasus Ditangani (Counter)
│       │   └── Action: Detail, Edit, Hapus
│       ├── Fitur:
│       │   ├── Search & Filter
│       │   ├── Tambah Anggota (Dialog)
│       │   └── Export Data
│       └── Detail Anggota (Dialog):
│           ├── Profil Lengkap
│           ├── Kasus Ditangani (List)
│           ├── Tugas Aktif (List)
│           └── Statistik Kinerja
│
├── C. Dokumen & Arsip
│   ├── Layout:
│   │   ├── Header dengan Search & Filter
│   │   ├── Upload Button
│   │   └── View Toggle: Grid/List
│   ├── Tabs by Kategori:
│   │   ├── Semua Dokumen
│   │   ├── Dokumen Kasus
│   │   ├── Dokumen Klien
│   │   └── Template Surat
│   ├── Grid View:
│   │   ├── Card per Dokumen:
│   │   │   ├── Icon by Type (PDF/Image/Doc)
│   │   │   ├── Nama File
│   │   │   ├── Kategori Badge
│   │   │   ├── Ukuran & Tanggal
│   │   │   ├── Uploader
│   │   │   └── Action: Preview, Download, Hapus
│   │   └── Pagination
│   ├── List View:
│   │   └── Table dengan Kolom Lengkap
│   └── Upload Dialog:
│       ├── Drag & Drop Area
│       ├── Pilih Kategori
│       ├── Link ke Kasus (Optional)
│       └── Simpan
│
├── D. Tugas & Aktivitas
│   ├── Layout: Table View (BUKAN Kanban)
│   ├── Filter Bar:
│   │   ├── Search Tugas
│   │   └── Filter by Status
│   ├── Tabel Tugas dengan Kolom:
│   │   ├── Judul Tugas
│   │   ├── Penanggung Jawab
│   │   ├── Status Badge:
│   │   │   ├── Selesai (Green)
│   │   │   ├── In Progress (Blue)
│   │   │   └── Pending (Orange)
│   │   ├── Prioritas Badge:
│   │   │   ├── Tinggi (Red)
│   │   │   ├── Sedang (Orange)
│   │   │   └── Rendah (Green)
│   │   ├── Tenggat Waktu
│   │   ├── Progress Bar (%)
│   │   └── Action: Detail, Edit, Hapus
│   ├── Button: Tambah Tugas Baru (Dialog)
│   ├── Dialog Tambah/Edit Tugas:
│   │   ├── Judul Tugas
│   │   ├── Penanggung Jawab (Select)
│   │   ├── Status (Select)
│   │   ├── Prioritas (Select)
│   │   ├── Tenggat Waktu (Date Picker)
│   │   └── Deskripsi (Textarea)
│   └── Dialog Detail Tugas:
│       ├── Info Lengkap
│       ├── Update Progress (Slider)
│       └── Log Aktivitas
│
├── E. Kalender & Jadwal
│   ├── Calendar View:
│   │   ├── Month View (Default)
│   │   ├── Navigation: Prev/Next Month
│   │   └── Event Indicators pada Tanggal
│   ├── Jenis Event (Color-coded):
│   │   ├── Rapat Internal (Green)
│   │   ├── Sidang / Pendampingan (Blue)
│   │   └── Tenggat Kasus (Red)
│   ├── Daftar Event (Table):
│   │   ├── Judul Event
│   │   ├── Tanggal & Waktu
│   │   ├── Lokasi
│   │   ├── Jenis (Badge)
│   │   └── Action: Edit, Hapus
│   ├── Button: Tambah Event (Dialog)
│   └── Dialog Tambah Event:
│       ├── Judul
│       ├── Tanggal & Waktu
│       ├── Lokasi
│       ├── Jenis Event (Select)
│       └── Deskripsi
│
├── F. Statistik & Laporan
│   ├── Header:
│   │   ├── Judul
│   │   └── Action Buttons:
│   │       ├── Unduh PDF
│   │       ├── Unduh Excel
│   │       └── Kirim Email
│   ├── Filter Card:
│   │   ├── Jenis Kasus
│   │   ├── Periode (6 bulan/1 tahun/custom)
│   │   ├── Penanggung Jawab
│   │   └── Wilayah
│   ├── KPI Cards (4 cards):
│   │   ├── Total Kasus
│   │   ├── Kasus Selesai
│   │   ├── Kasus Aktif
│   │   └── Tingkat Penyelesaian (%)
│   ├── Visualisasi Data:
│   │   ├── Bar Chart: Tren Kasus Bulanan
│   │   ├── Pie Chart: Distribusi Jenis Kasus
│   │   ├── Bar Chart: Kinerja Tim (Horizontal)
│   │   └── Line Chart: Kasus by Wilayah
│   └── Export Options:
│       ├── Generate Report (PDF/Excel)
│       └── Email Report

TAHAP 4: KONFIGURASI & AUDIT
├── A. Pengaturan Sistem
│   ├── Tab Navigation (4 Tabs):
│   │   ├── TAB 1: Profil Saya
│   │   │   ├── Avatar Upload
│   │   │   ├── Nama Lengkap
│   │   │   ├── NIP
│   │   │   ├── Email
│   │   │   ├── Nomor Telepon
│   │   │   ├── Jabatan
│   │   │   ├── Divisi
│   │   │   └── Button: Simpan Perubahan
│   │   │
│   │   ├── TAB 2: Keamanan
│   │   │   ├── Ubah Password:
│   │   │   │   ├── Password Lama
│   │   │   │   ├── Password Baru
│   │   │   │   └── Konfirmasi Password Baru
│   │   │   ├── Verifikasi 2 Faktor (Toggle)
│   │   │   ├── Sesi Aktif (Table)
│   │   │   └── Riwayat Login (Table)
│   │   │
│   │   ├── TAB 3: Notifikasi
│   │   │   ├── Email Notifikasi (Toggle)
│   │   │   ├── Push Notifikasi (Toggle)
│   │   │   ├── Laporan Berkala (Toggle)
│   │   │   └── Notifikasi Kasus Baru (Toggle)
│   │   │
│   │   └── TAB 4: Umum
│   │       ├── Dark Mode (Toggle)
│   │       ├── Bahasa (Select)
│   │       ├── Zona Waktu (Select)
│   │       └── Format Tanggal (Select)
│   │
└── B. Audit & Keamanan
    ├── Dashboard Audit (Summary Cards)
    ├── Tabel Log Aktivitas:
    │   ├── Kolom:
    │   │   ├── Waktu (Timestamp)
    │   │   ├── Pengguna
    │   │   ├── Aksi (CREATE/UPDATE/DELETE/LOGIN)
    │   │   ├── Data yang Diubah
    │   │   ├── Hasil (Sukses/Gagal/Warning) with Icon
    │   │   └── IP Address
    │   ├── Filter:
    │   │   ├── by User
    │   │   ├── by Aksi
    │   │   └── by Hasil
    │   └── Search & Export
    ├── Riwayat Perubahan Data
    │   ├── Filter by Modul
    │   └── Show Before/After Values
    └── Security Settings:
        ├── Session Timeout
        ├── Password Policy
        └── Backup Schedule

TAHAP 5: BANTUAN & INFORMASI
├── Tab Navigation:
│   ├── TAB 1: Panduan Penggunaan
│   │   ├── Search Artikel
│   │   ├── Daftar Artikel by Kategori
│   │   └── Button: Tambah Artikel (Admin Only)
│   │
│   ├── TAB 2: FAQ (Accordion)
│   │   ├── Pertanyaan Umum dengan Accordion
│   │   └── 6 FAQ Items:
│   │       ├── Reset Password
│   │       ├── Hapus Kasus
│   │       ├── Akses Data
│   │       ├── Upload Dokumen
│   │       ├── Ubah Status
│   │       └── Role & Hak Akses
│   │
│   ├── TAB 3: Support
│   │   ├── Hubungi Admin (Email/Phone)
│   │   ├── Submit Ticket (Form)
│   │   └── Live Chat (jika ada)
│   │
│   └── TAB 4: Tentang
│       ├── Versi Aplikasi
│       ├── Release Notes
│       └── Credits

TAHAP 6: LOGOUT
└── User Klik Logout → Kembali ke Halaman Login
```

### 2.2 Alur Penanganan Kasus (Detail)

```
PROSES PENANGANAN KASUS LENGKAP
═══════════════════════════════════════════════════════════════

1. PENERIMAAN KASUS BARU
   ├── Admin/Staf: Akses Menu "Tambah Kasus Baru"
   ├── Input Data:
   │   ├── Nomor Kasus (Auto-generate/Manual)
   │   ├── Judul Kasus
   │   ├── Jenis Kasus (Korupsi/Narkotika/Pencurian/dll)
   │   ├── Deskripsi Singkat
   │   ├── Prioritas (Rendah/Sedang/Tinggi)
   │   ├── Status Awal (Default: Baru Masuk)
   │   ├── Lokasi
   │   └── Tanggal Tenggat
   ├── Pilih Klien (dari database atau tambah baru)
   ├── Assign Tim Penanganan (Multi-select)
   ├── Upload Dokumen Awal (Optional)
   └── SIMPAN → Kasus Masuk Sistem dengan Status "Baru Masuk"

2. VERIFIKASI (Status Progres: Baru Masuk → Verifikasi)
   ├── Tim: Akses Detail Kasus
   ├── Review data kasus di Tab "Informasi Umum"
   ├── Klik Edit Progress → Update ke "Verifikasi"
   ├── Update Timeline di Tab "Timeline & Progress":
   │   ├── Klik Edit pada Stage "Diverifikasi"
   │   ├── Isi Tanggal, Officer, Catatan
   │   └── Simpan
   ├── Upload Dokumen Tambahan di Tab "Dokumen Kasus"
   └── Catat Progress di Tab "Log & Catatan"

3. PENYELIDIKAN (Status Progres: Verifikasi → Penyelidikan)
   ├── Update Status Progres menjadi "Penyelidikan"
   ├── Buat Tugas Penyelidikan:
   │   ├── Akses modul "Tugas & Aktivitas"
   │   ├── Klik "Tambah Tugas Baru"
   │   ├── Link ke Kasus ini
   │   ├── Set Prioritas & Deadline
   │   └── Assign ke Tim
   ├── Upload Bukti & Dokumen Investigasi
   └── Update Timeline Stage "Dalam Penyelidikan"

4. PENDAMPINGAN (Status Progres: Penyelidikan → Pendampingan)
   ├── Update Status Progres menjadi "Pendampingan"
   ├── Set Jadwal Meeting dengan Klien:
   │   ├── Akses modul "Kalender & Jadwal"
   │   ├── Tambah Event "Sidang / Pendampingan"
   │   ├── Set Tanggal, Waktu, Lokasi
   │   └── Link ke Kasus
   ├── Upload Notulen/Dokumentasi Pertemuan
   └── Update Timeline Stage "Pendampingan Klien"

5. PERSIDANGAN (Status Progres: Pendampingan → Persidangan)
   ├── Update Status Progres menjadi "Persidangan"
   ├── Tandai Jadwal Sidang di Kalender
   ├── Upload Berita Acara Sidang di Tab Dokumen
   ├── Tracking Pertemuan Sidang (Sidang 1, 2, 3, dst)
   │   └── Catat di Tab "Log & Catatan"
   ├── Update Timeline Stage "Masuk ke Pengadilan"
   └── Monitor Progress (Update Progress Bar)

6. PUTUSAN (Status Progres: Persidangan → Putusan)
   ├── Update Status Progres menjadi "Putusan"
   ├── Upload Salinan Putusan Pengadilan
   ├── Update Timeline Stage "Putusan Dijatuhkan"
   └── Dokumentasi Hasil Putusan

7. PENYELESAIAN (Status Progres: Putusan → Selesai)
   ├── Update Status menjadi "Selesai"
   ├── Update Status Progres menjadi "Selesai"
   ├── Upload Dokumen Final & Putusan Inkracht
   ├── Tandai Semua Tugas Terkait sebagai "Selesai"
   ├── Update Timeline Stage "Selesai/Dieksekusi"
   ├── Update Progress Bar menjadi 100%
   └── Arsipkan Semua Dokumen

8. MONITORING & EVALUASI
   ├── Admin/Supervisor: Review di Dashboard
   ├── Analisis Statistik di "Statistik & Laporan"
   ├── Evaluasi Kinerja Tim
   ├── Review Audit Log di "Audit & Keamanan"
   └── Export Laporan Berkala
```

---

## 3. FLOWCHART PROSES INTI

### 3.1 Flowchart Autentikasi & Akses Sistem

```
                     ┌──────────────┐
                     │  START: Akses│
                     │  Aplikasi    │
                     └──────┬───────┘
                            │
                     ┌──────▼───────┐
                     │ Halaman Login│
                     └──────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
       ┌──────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
       │ LOGIN       │ │REGISTER│ │LUPA PASSWORD│
       └──────┬──────┘ └───┬────┘ └─────┬──────┘
              │            │             │
       ┌──────▼──────┐     │             │
       │Input Email  │     │             │
       │& Password   │     │             │
       └──────┬──────┘     │             │
              │            │             │
       ┌──────▼──────┐     │             │
       │ Validasi    │◄────┘             │
       │ Kredensial  │                   │
       └──────┬──────┘                   │
              │                          │
         ┌────┴────┐                     │
         │         │                     │
    ┌────▼───┐ ┌──▼────┐                │
    │Valid?  │ │Invalid│                │
    │  YES   │ │  NO   │                │
    └────┬───┘ └───┬───┘                │
         │         │                     │
         │    ┌────▼─────┐               │
         │    │Error Msg │               │
         │    │Retry     │               │
         │    └────┬─────┘               │
         │         │                     │
         │         └────────┬────────────┘
         │                  │
    ┌────▼──────────┐       │
    │Load Dashboard │       │
    │& User Profile │       │
    └────┬──────────┘       │
         │                  │
    ┌────▼──────────┐       │
    │Sistem Aktif   │       │
    │(Logged In)    │       │
    └────┬──────────┘       │
         │                  │
    ┌────▼──────────┐       │
    │User Berinteraksi      │
    │dengan Modul   │       │
    └────┬──────────┘       │
         │                  │
    ┌────▼──────────┐       │
    │Logout?        │       │
    └────┬──────────┘       │
         │                  │
    ┌────▼──────────┐       │
    │Clear Session  │       │
    └────┬──────────┘       │
         │                  │
         └──────────────────┘
                  │
            ┌─────▼─────┐
            │    END    │
            └───────────┘
```

### 3.2 Flowchart Proses CRUD Kasus

```
┌─────────────────────────────────────────────────────────────┐
│              FLOWCHART MANAJEMEN KASUS (CRUD)               │
└─────────────────────────────────────────────────────────────┘

           ┌──────────────┐
           │    START     │
           │Akses Menu    │
           │Manajemen Kasus│
           └──────┬───────┘
                  │
           ┌──────▼───────┐
           │ Pilih Aksi   │
           └──────┬───────┘
                  │
    ┌─────────────┼─────────────┬─────────────┐
    │             │             │             │
┌───▼────┐  ┌────▼─────┐  ┌───▼────┐  ┌─────▼──────┐
│CREATE  │  │  READ    │  │UPDATE  │  │  DELETE    │
│(Tambah)│  │ (Lihat)  │  │ (Edit) │  │  (Hapus)   │
└───┬────┘  └────┬─────┘  └───┬────┘  └─────┬──────┘
    │            │            │             │
    │       ┌────▼─────┐      │             │
    │       │View Tabel│      │             │
    │       │Daftar    │      │             │
    │       │Kasus     │      │             │
    │       └────┬─────┘      │             │
    │            │            │             │
    │       ┌────▼─────┐      │             │
    │       │Filter &  │      │             │
    │       │Search    │      │             │
    │       └────┬─────┘      │             │
    │            │            │             │
    │       ┌────▼─────┐      │             │
    │       │Pilih Kasus      │             │
    │       │untuk Detail     │             │
    │       └────┬─────┘      │             │
    │            │            │             │
┌───▼────────────▼────────────▼─────────────▼──────┐
│         Form Input/Edit Kasus                    │
│  ┌─────────────────────────────────────────┐     │
│  │ • Nomor Kasus                           │     │
│  │ • Judul Kasus                           │     │
│  │ • Jenis (Korupsi/Narkotika/dll)         │     │
│  │ • Prioritas (Rendah/Sedang/Tinggi)      │     │
│  │ • Status (Aktif/Selesai/Pending/Ditolak)│     │
│  │ • Status Progres (7 tahap):             │     │
│  │   - Baru Masuk                          │     │
│  │   - Verifikasi                          │     │
│  │   - Penyelidikan                        │     │
│  │   - Pendampingan                        │     │
│  │   - Persidangan                         │     │
│  │   - Putusan                             │     │
│  │   - Selesai                             │     │
│  │ • Klien (Pilih dari DB)                 │     │
│  │ • Tim Penanganan                        │     │
│  │ • Lokasi                                │     │
│  │ • Tanggal Tenggat                       │     │
│  │ • Deskripsi                             │     │
│  │ • Upload Dokumen                        │     │
│  └─────────────────────────────────────────┘     │
└──────────────────┬───────────────────────────────┘
                   │
            ┌──────▼──────┐
            │  Validasi   │
            │  Input Data │
            └──────┬──────┘
                   │
              ┌────┴────┐
              │         │
         ┌────▼───┐ ┌──▼────┐
         │Valid?  │ │Invalid│
         │  YES   │ │  NO   │
         └────┬───┘ └───┬───┘
              │         │
              │    ┌────▼─────┐
              │    │Tampilkan │
              │    │Error Msg │
              │    └────┬─────┘
              │         │
              │         └────┐
              │              │
         ┌────▼──────────────▼──┐
         │  Simpan ke Database  │
         │  (CREATE/UPDATE)     │
         │  atau DELETE         │
         └────┬─────────────────┘
              │
         ┌────▼─────┐
         │Update UI │
         │Refresh   │
         │Data      │
         └────┬─────┘
              │
         ┌────▼─────┐
         │Log Audit │
         │Trail     │
         └────┬─────┘
              │
         ┌────▼─────┐
         │Tampilkan │
         │Notifikasi│
         │Sukses    │
         └────┬─────┘
              │
         ┌────▼─────┐
         │   END    │
         └──────────┘
```

### 3.3 Flowchart Proses Tugas & Aktivitas

```
           ┌──────────────┐
           │    START     │
           │Modul Tugas   │
           └──────┬───────┘
                  │
           ┌──────▼───────┐
           │View Tabel    │
           │Semua Tugas   │
           └──────┬───────┘
                  │
           ┌──────▼───────┐
           │Filter & Search│
           │by Status     │
           └──────┬───────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼────┐  ┌────▼─────┐  ┌───▼────┐
│Tambah  │  │ Edit     │  │ Hapus  │
│Tugas   │  │ Tugas    │  │ Tugas  │
└───┬────┘  └────┬─────┘  └───┬────┘
    │            │            │
┌───▼────────────▼────────────▼───┐
│  Form Tugas (Dialog):           │
│  • Judul Tugas                  │
│  • Deskripsi                    │
│  • Assign ke: (Select User)     │
│  • Terkait Kasus: (Optional)    │
│  • Prioritas:                   │
│    - Rendah (Green)             │
│    - Sedang (Orange)            │
│    - Tinggi (Red)               │
│  • Status:                      │
│    - Selesai (Green)            │
│    - In Progress (Blue)         │
│    - Pending (Orange)           │
│  • Deadline (Date Picker)       │
│  • Progress (0-100%)            │
└────────────┬────────────────────┘
             │
      ┌──────▼──────┐
      │  Validasi   │
      └──────┬──────┘
             │
      ┌──────▼──────┐
      │   Simpan    │
      └──────┬──────┘
             │
      ┌──────▼──────┐
      │  Refresh    │
      │  Table View │
      └──────┬──────┘
             │
      ┌──────▼──────┐
      │  Notifikasi │
      │  Sukses     │
      └──────┬──────┘
             │
      ┌──────▼──────┐
      │     END     │
      └─────────────┘
```

### 3.4 Flowchart Upload & Manajemen Dokumen

```
         ┌──────────────┐
         │    START     │
         │Modul Dokumen │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │Pilih Tab     │
         │Kategori      │
         └──────┬───────┘
                │
    ┌───────────┼───────────┐
    │           │           │
┌───▼────┐ ┌───▼────┐ ┌───▼────┐
│Upload  │ │Search  │ │Download│
│Dokumen │ │Filter  │ │/Preview│
└───┬────┘ └───┬────┘ └───┬────┘
    │          │          │
    │          │          │
┌───▼──────────▼──────────▼───┐
│  Upload Form (Dialog):      │
│  • Drag & Drop / Browse     │
│  • Pilih File (PDF/Word/    │
│    Excel/Image)             │
│  • Nama Dokumen             │
│  • Kategori (Select):       │
│    - Dokumen Kasus          │
│    - Dokumen Klien          │
│    - Template Surat         │
│  • Terkait Kasus (Optional) │
│  • Tag/Label                │
│  • Deskripsi                │
└────────┬────────────────────┘
         │
  ┌──────▼──────┐
  │Validasi File│
  │ • Type OK?  │
  │ • Size OK?  │
  │   (Max 10MB)│
  └──────┬──────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│Valid  │ │Invalid│
│ YES   │ │  NO   │
└───┬───┘ └───┬───┘
    │         │
    │    ┌────▼─────┐
    │    │Error Msg │
    │    │(Toast)   │
    │    └────┬─────┘
    │         │
    │         └────┐
    │              │
┌───▼──────────────▼──┐
│  Upload ke Storage  │
│  (Mock/Real)        │
└───┬─────────────────┘
    │
┌───▼──────────┐
│Save Metadata │
│to Array/DB   │
└───┬──────────┘
    │
┌───▼──────────┐
│Update UI     │
│Grid/List View│
└───┬──────────┘
    │
┌───▼──────────┐
│Toast Success │
│Notifikasi    │
└───┬──────────┘
    │
┌───▼──────────┐
│     END      │
└──────────────┘
```

### 3.5 Flowchart Update Status & Timeline Kasus

```
         ┌──────────────┐
         │    START     │
         │Detail Kasus  │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │Pilih Tab     │
         │Timeline &    │
         │Progress      │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │View Timeline │
         │7 Stages      │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │Klik Edit pada│
         │Stage Tertentu│
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │Dialog Edit   │
         │Stage:        │
         │• Tanggal     │
         │• Officer/PIC │
         │• Catatan     │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │Simpan Update │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │Update Status │
         │Progres       │
         │(Dropdown)    │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │Update Progress│
         │Bar (%)       │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │Log ke Audit  │
         │Trail         │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │Refresh UI    │
         │Timeline View │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │Toast Success │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │     END      │
         └──────────────┘
```

---

## 4. SITEMAP APLIKASI

### 4.1 Struktur Hierarki Halaman

```
SIKAP PP POLRI - SITEMAP APLIKASI
═══════════════════════════════════════════════════════════════

ROOT
│
├── AUTH (Tidak Login)
│   ├── Login
│   ├── Register (Internal Only - 3 Role)
│   │   ├── Admin
│   │   ├── Supervisor
│   │   └── Staf
│   └── Lupa Password
│
└── APLIKASI (Setelah Login)
    │
    ├── 1. DASHBOARD
    │   ├── Statistik Cards (4 KPI)
    │   ├── Grafik & Visualisasi (4 Charts)
    │   ├── Daftar Tugas Aktif (Table)
    │   ├── Kasus Terbaru (Table + Quick Actions)
    │   └── Timeline Aktivitas (Feed)
    │
    ├── 2. MANAJEMEN KASUS
    │   ├── 2.1 Daftar Kasus
    │   │   ├── Tabel Semua Kasus
    │   │   ├── Kolom:
    │   │   │   ├── Nomor Kasus
    │   │   │   ├── Nama Klien
    │   │   │   ├── Jenis Kasus
    │   │   │   ├── Status (Aktif/Selesai/Pending/Ditolak)
    │   │   │   ├── Status Progres (7 Tahap):
    │   │   │   │   ├── Baru Masuk (Gray)
    │   │   │   │   ├── Verifikasi (Blue)
    │   │   │   │   ├── Penyelidikan (Yellow)
    │   │   │   │   ├── Pendampingan (Orange)
    │   │   │   │   ├── Persidangan (Purple)
    │   │   │   │   ├── Putusan (Indigo)
    │   │   │   │   └── Selesai (Green)
    │   │   │   ├── Progress Bar (%)
    │   │   │   ├── Penanggung Jawab
    │   │   │   └── Tanggal Update
    │   │   ├── Filter:
    │   │   │   ├── By Status (all/Aktif/Selesai/Pending/Ditolak)
    │   │   │   └── By Status Progres (all/7 options)
    │   │   ├── Search (Nomor/Nama Klien/Penanggung Jawab)
    │   │   ├── Sort by Column
    │   │   ├── Export (PDF/Excel)
    │   │   └── Actions per Row:
    │   │       ├── Lihat Detail → [2.3 Detail Kasus]
    │   │       ├── Edit (Dialog Modal)
    │   │       └── Hapus (Alert Confirmation)
    │   │
    │   ├── 2.2 Tambah Kasus Baru
    │   │   ├── Form Input:
    │   │   │   ├── Nomor Kasus
    │   │   │   ├── Judul Kasus
    │   │   │   ├── Jenis Kasus (Select)
    │   │   │   ├── Deskripsi (Textarea)
    │   │   │   ├── Pilih Klien (Select dari DB)
    │   │   │   ├── Tim Penanganan (Multi-select)
    │   │   │   ├── Prioritas (Select)
    │   │   │   ├── Status (Default: Aktif)
    │   │   │   ├── Status Progres (Default: Baru Masuk)
    │   │   │   ├── Lokasi
    │   │   │   └── Tenggat Waktu (Date Picker)
    │   │   ├── Upload Dokumen (Optional)
    │   │   └── Button: Simpan → Redirect [2.1 Daftar Kasus]
    │   │
    │   └── 2.3 Detail Kasus
    │       ├── Header Section:
    │       │   ├── Nomor Kasus (Display)
    │       │   ├── Status Dropdown (Editable)
    │       │   ├── Progress Bar (Editable via dialog)
    │       │   └── Action Buttons:
    │       │       ├── Kembali → [2.1 Daftar Kasus]
    │       │       ├── Edit Data
    │       │       └── Hapus Kasus
    │       │
    │       └── Tab Navigation (6 Tabs):
    │           ├── TAB 1: Informasi Umum
    │           │   ├── Display Fields:
    │           │   │   ├── Nomor Kasus
    │           │   │   ├── Jenis Kasus
    │           │   │   ├── Nama Klien
    │           │   │   ├── Penanggung Jawab
    │           │   │   ├── Deskripsi Lengkap
    │           │   │   ├── Lokasi
    │           │   │   └── Tenggat Waktu
    │           │   └── Button: Edit Data (Dialog)
    │           │
    │           ├── TAB 2: Timeline & Progress
    │           │   ├── Visual Timeline (Vertical Flow)
    │           │   ├── 7 Stages dengan Indikator:
    │           │   │   ├── Stage 1: Kasus Diterima
    │           │   │   ├── Stage 2: Diverifikasi
    │           │   │   ├── Stage 3: Dalam Penyelidikan
    │           │   │   ├── Stage 4: Pendampingan Klien
    │           │   │   ├── Stage 5: Masuk ke Pengadilan
    │           │   │   ├── Stage 6: Putusan Dijatuhkan
    │           │   │   └── Stage 7: Selesai/Dieksekusi
    │           │   ├── Status Icon per Stage:
    │           │   │   ├── Completed (CheckCircle Green)
    │           │   │   ├── Active (Circle Blue)
    │           │   │   └── Pending (Circle Gray)
    │           │   ├── Info per Stage:
    │           │   │   ├── Tanggal (jika sudah)
    │           │   │   ├── Officer/PIC
    │           │   │   └── Catatan
    │           │   └── Button: Edit Stage (Dialog)
    │           │
    │           ├── TAB 3: Dokumen Kasus
    │           │   ├── Upload Button
    │           │   ├── Tabel Dokumen:
    │           │   │   ├── Icon by Type (PDF/Image/Doc)
    │           │   │   ├── Nama File
    │           │   │   ├── Ukuran
    │           │   │   ├── Tanggal Upload
    │           │   │   ├── Uploader
    │           │   │   └── Actions:
    │           │   │       ├── Download
    │           │   │       ├── Preview (jika supported)
    │           │   │       └── Hapus
    │           │   └── Filter by Type
    │           │
    │           ├── TAB 4: Tim Penanganan
    │           │   ├── Grid Cards Anggota Tim
    │           │   ├── Per Card:
    │           │   │   ├── Avatar & Nama
    │           │   │   ├── Jabatan
    │           │   │   ├── Kontak (Phone/Email)
    │           │   │   └── Role Badge
    │           │   └── Button: Tambah Anggota Tim
    │           │
    │           ├── TAB 5: Tugas Terkait
    │           │   ├── Tabel Tugas
    │           │   ├── Filter by Status
    │           │   └── Button: Buat Tugas Baru
    │           │       └── Auto-link ke Kasus ini
    │           │
    │           └── TAB 6: Log & Catatan
    │               ├── Timeline Perubahan (Audit Trail):
    │               │   ├── Timestamp
    │               │   ├── User
    │               │   ├── Aksi (Update/Create/Delete)
    │               │   └── Detail Perubahan
    │               ├── Form Tambah Catatan Baru (Textarea)
    │               └── List Catatan Sebelumnya
    │
    ├── 3. KLIEN & TIM
    │   ├── 3.1 Data Klien
    │   │   ├── Tabel Daftar Klien
    │   │   ├── Kolom:
    │   │   │   ├── Avatar
    │   │   │   ├── Nama (Perorangan/Perusahaan)
    │   │   │   ├── NIK/NPWP
    │   │   │   ├── Alamat
    │   │   │   ├── Kasus Aktif (Counter)
    │   │   │   ├── Status Pendampingan (Aktif/Selesai)
    │   │   │   ├── Kontak
    │   │   │   ├── Email
    │   │   │   └── Actions: Detail, Edit, Hapus
    │   │   ├── Fitur:
    │   │   │   ├── Search & Filter
    │   │   │   ├── Tambah Klien Baru (Dialog)
    │   │   │   └── Export Data
    │   │   └── Detail Klien (Dialog):
    │   │       ├── Profil Lengkap
    │   │       ├── Histori Kasus (Table)
    │   │       └── Dokumen Terkait
    │   │
    │   └── 3.2 Tim Internal
    │       ├── Tabel Anggota Tim
    │       ├── Kolom:
    │       │   ├── Avatar & Nama
    │       │   ├── NIP
    │       │   ├── Jabatan
    │       │   ├── Divisi
    │       │   ├── Kontak
    │       │   ├── Email
    │       │   ├── Kasus Ditangani (Counter)
    │       │   └── Actions: Detail, Edit, Hapus
    │       ├── Fitur:
    │       │   ├── Search & Filter
    │       │   ├── Tambah Anggota (Dialog)
    │       │   └── Export Data
    │       └── Detail Anggota (Dialog):
    │           ├── Profil Lengkap
    │           ├── Kasus Ditangani (List)
    │           ├── Tugas Aktif (List)
    │           └── Statistik Kinerja
    │
    ├── 4. DOKUMEN & ARSIP
    │   ├── Header:
    │   │   ├── Search Bar
    │   │   ├── Upload Button
    │   │   └── View Toggle: Grid/List
    │   ├── Tabs by Kategori:
    │   │   ├── Semua Dokumen
    │   │   ├── Dokumen Kasus
    │   │   ├── Dokumen Klien
    │   │   └── Template Surat
    │   ├── Grid View (Default):
    │   │   ├── Card per Dokumen:
    │   │   │   ├── Icon by Type (FileText/Image/File)
    │   │   │   ├── Nama File
    │   │   │   ├── Kategori Badge
    │   │   │   ├── Ukuran & Tanggal
    │   │   │   ├── Uploader
    │   │   │   └── Action Buttons:
    │   │   │       ├── Preview (Modal)
    │   │   │       ├── Download
    │   │   │       └── Hapus
    │   │   └── Pagination
    │   ├── List View (Toggle):
    │   │   └── Table dengan Kolom Lengkap
    │   ├── Upload Dialog:
    │   │   ├── Drag & Drop Area
    │   │   ├── Browse File
    │   │   ├── Pilih Kategori (Select)
    │   │   ├── Link ke Kasus (Optional)
    │   │   ├── Tag/Label
    │   │   └── Simpan
    │   └── Filter:
    │       ├── By Kategori
    │       ├── By Type (PDF/Image/Doc)
    │       └── By Date Range
    │
    ├── 5. TUGAS & AKTIVITAS
    │   ├── Layout: TABLE VIEW (Bukan Kanban)
    │   ├── Header:
    │   │   ├── Search Bar
    │   │   ├── Filter by Status (all/Selesai/In Progress/Pending)
    │   │   └── Button: Tambah Tugas Baru
    │   ├── Tabel Tugas dengan Kolom:
    │   │   ├── Judul Tugas
    │   │   ├── Penanggung Jawab
    │   │   ├── Status Badge:
    │   │   │   ├── Selesai (Green)
    │   │   │   ├── In Progress (Blue)
    │   │   │   └── Pending (Orange)
    │   │   ├── Prioritas Badge:
    │   │   │   ├── Tinggi (Red)
    │   │   │   ├── Sedang (Orange)
    │   │   │   └── Rendah (Green)
    │   │   ├── Tenggat Waktu
    │   │   ├── Progress Bar (%)
    │   │   └── Actions:
    │   │       ├── Detail (Dialog)
    │   │       ├── Edit (Dialog)
    │   │       └── Hapus (Alert)
    │   ├── Dialog Tambah/Edit Tugas:
    │   │   ├── Judul Tugas
    │   │   ├── Penanggung Jawab (Select)
    │   │   ├── Status (Select)
    │   │   ├── Prioritas (Select)
    │   │   ├── Tenggat Waktu (Date Picker)
    │   │   ├── Progress (Slider 0-100%)
    │   │   └── Deskripsi (Textarea)
    │   └── Dialog Detail Tugas:
    │       ├── Info Lengkap (Read-only)
    │       ├── Update Progress (Editable)
    │       └── Log Aktivitas
    │
    ├── 6. KALENDER & JADWAL
    │   ├── Calendar View:
    │   │   ├── Month View (Default)
    │   │   ├── Navigation: Prev/Next Month
    │   │   ├── Date Grid dengan Event Indicators
    │   │   └── Color-coded Dots by Jenis Event
    │   ├── Jenis Event (3 Tipe):
    │   │   ├── Rapat Internal (Green)
    │   │   ├── Sidang / Pendampingan (Blue)
    │   │   └── Tenggat Kasus (Red)
    │   ├── Daftar Event (Table dibawah Kalender):
    │   │   ├── Kolom:
    │   │   │   ├── Judul Event
    │   │   │   ├── Tanggal
    │   │   │   ├── Waktu
    │   │   │   ├── Lokasi
    │   │   │   ├── Jenis (Badge)
    │   │   │   └── Actions: Edit, Hapus
    │   │   └── Filter by Jenis
    │   ├── Button: Tambah Event (Dialog)
    │   └── Dialog Tambah/Edit Event:
    │       ├── Judul
    │       ├── Tanggal (Date Picker)
    │       ├── Waktu (Time Picker)
    │       ├── Lokasi
    │       ├── Jenis Event (Select)
    │       ├── Deskripsi (Textarea)
    │       └── Simpan
    │
    ├── 7. STATISTIK & LAPORAN
    │   ├── Header:
    │   │   ├── Judul
    │   │   └── Action Buttons:
    │   │       ├── Unduh PDF
    │   │       ├── Unduh Excel
    │   │       └── Kirim Email
    │   ├── Filter Card:
    │   │   ├── Jenis Kasus (Select)
    │   │   ├── Periode (Select):
    │   │   │   ├── 6 Bulan Terakhir
    │   │   │   ├── 1 Tahun Terakhir
    │   │   │   └── Custom Range
    │   │   ├── Penanggung Jawab (Select)
    │   │   └── Wilayah (Select)
    │   ├── KPI Cards (4 Cards):
    │   │   ├── Total Kasus
    │   │   ├── Kasus Selesai
    │   │   ├── Kasus Aktif
    │   │   └── Tingkat Penyelesaian (%)
    │   ├── Visualisasi Data (4 Grafik):
    │   │   ├── 1. Bar Chart: Tren Kasus & Penyelesaian Bulanan
    │   │   ├── 2. Pie Chart: Distribusi Jenis Kasus
    │   │   ├── 3. Horizontal Bar: Kinerja Tim (Top 5)
    │   │   └── 4. Line Chart: Kasus by Wilayah
    │   └── Export Options:
    │       ├── Generate Report (PDF/Excel)
    │       └── Email Report
    │
    ├── 8. PENGATURAN SISTEM
    │   ├── Tab Navigation (4 Tabs):
    │   │   ├── TAB 1: Profil Saya
    │   │   │   ├── Avatar Upload Area
    │   │   │   ├── Nama Lengkap & Role
    │   │   │   ├── Form Fields:
    │   │   │   │   ├── Nama Lengkap
    │   │   │   │   ├── NIP
    │   │   │   │   ├── Email
    │   │   │   │   ├── Nomor Telepon
    │   │   │   │   ├── Jabatan
    │   │   │   │   └── Divisi
    │   │   │   └── Button: Simpan Perubahan
    │   │   │
    │   │   ├── TAB 2: Keamanan
    │   │   │   ├── Section: Ubah Password
    │   │   │   │   ├── Password Lama
    │   │   │   │   ├── Password Baru
    │   │   │   │   ├── Konfirmasi Password Baru
    │   │   │   │   └── Button: Update Password
    │   │   │   ├── Section: Verifikasi 2 Faktor
    │   │   │   │   └── Toggle Enable/Disable
    │   │   │   ├── Section: Sesi Aktif (Table)
    │   │   │   └── Section: Riwayat Login (Table)
    │   │   │
    │   │   ├── TAB 3: Notifikasi
    │   │   │   ├── Email Notifikasi (Toggle)
    │   │   │   ├── Push Notifikasi (Toggle)
    │   │   │   ├── Laporan Mingguan (Toggle)
    │   │   │   ├── Notifikasi Kasus Baru (Toggle)
    │   │   │   └── Button: Simpan Preferensi
    │   │   │
    │   │   └── TAB 4: Umum
    │   │       ├── Dark Mode (Toggle)
    │   │       ├── Bahasa (Select)
    │   │       ├── Zona Waktu (Select)
    │   │       ├── Format Tanggal (Select)
    │   │       └── Button: Simpan Pengaturan
    │   │
    │   └── Button: Simpan Semua Perubahan
    │
    ├── 9. AUDIT & KEAMANAN DATA
    │   ├── Dashboard Audit (Summary Cards):
    │   │   ├── Total Aktivitas
    │   │   ├── Login Sukses
    │   │   ├── Operasi Gagal
    │   │   └── Warning Count
    │   ├── Tabel Log Aktivitas:
    │   │   ├── Kolom:
    │   │   │   ├── Waktu (Timestamp)
    │   │   │   ├── Pengguna
    │   │   │   ├── Aksi (CREATE/UPDATE/DELETE/LOGIN/BACKUP)
    │   │   │   ├── Data yang Diubah
    │   │   │   ├── Hasil dengan Icon:
    │   │   │   │   ├── Sukses (CheckCircle Green)
    │   │   │   │   ├── Gagal (XCircle Red)
    │   │   │   │   └── Warning (AlertTriangle Yellow)
    │   │   │   └── IP Address
    │   │   ├── Filter:
    │   │   │   ├── By User (Select)
    │   │   │   ├── By Aksi (Select)
    │   │   │   ├── By Hasil (Select)
    │   │   │   └── By Date Range
    │   │   ├── Search
    │   │   └── Export (PDF/Excel)
    │   ├── Riwayat Perubahan Data:
    │   │   ├── Filter by Modul
    │   │   └── Show Before/After Values
    │   ├── Manajemen Hak Akses (Admin Only):
    │   │   ├── Role Management
    │   │   ├── Permission Settings
    │   │   └── User Access Control
    │   └── Backup & Restore (Admin Only):
    │       ├── Schedule Backup (Cron)
    │       ├── Manual Backup Now
    │       ├── Restore Data
    │       └── Backup History (Table)
    │
    └── 10. BANTUAN & PUSAT INFORMASI
        ├── Tab Navigation (4 Tabs):
        │   ├── TAB 1: Panduan Penggunaan
        │   │   ├── Search Bar Artikel
        │   │   ├── Daftar Artikel (Cards)
        │   │   ├── Filter by Kategori
        │   │   └── Button: Tambah Artikel (Admin Only)
        │   │
        │   ├── TAB 2: FAQ (Accordion)
        │   │   ├── Accordion Items (6 FAQ):
        │   │   │   ├── Bagaimana cara reset password?
        │   │   │   ├── Bagaimana cara menghapus kasus?
        │   │   │   ├── Siapa yang bisa mengakses data?
        │   │   │   ├── Bagaimana cara upload dokumen?
        │   │   │   ├── Bagaimana cara ubah status kasus?
        │   │   │   └── Apa itu role dan hak akses?
        │   │   └── Search FAQ
        │   │
        │   ├── TAB 3: Support
        │   │   ├── Contact Info Card:
        │   │   │   ├── Email Support
        │   │   │   ├── Phone Support
        │   │   │   └── Jam Operasional
        │   │   ├── Submit Ticket Form:
        │   │   │   ├── Kategori Masalah
        │   │   │   ├── Judul
        │   │   │   ├── Deskripsi
        │   │   │   ├── Upload Screenshot
        │   │   │   └── Submit
        │   │   └── Ticket History (Table)
        │   │
        │   └── TAB 4: Tentang
        │       ├── Informasi Aplikasi:
        │       │   ├── Nama: SIKAP PP POLRI
        │       │   ├── Versi: 1.0.0
        │       │   ├── Build Date
        │       │   └── Copyright
        │       ├── Release Notes (Changelog)
        │       └── Credits & Lisensi
        │
        └── Logout → Kembali ke [Login]
```

### 4.2 Navigasi & Routing Structure

```
ROUTING STRUCTURE
═══════════════════════════════════════════════════════════════

PUBLIC ROUTES (Tanpa Autentikasi)
├── /login                   → Halaman Login
├── /register                → Halaman Registrasi Internal
└── /forgot-password         → Lupa Password

PROTECTED ROUTES (Memerlukan Autentikasi)
├── /dashboard               → Dashboard Utama
│
├── /kasus
│   ├── /kasus/daftar        → Daftar Semua Kasus
│   │   ├── ?status=aktif/selesai/pending/ditolak
│   │   ├── ?progres=baru-masuk/verifikasi/penyelidikan/
│   │   │            pendampingan/persidangan/putusan/selesai
│   │   └── ?search=...
│   ├── /kasus/tambah        → Tambah Kasus Baru
│   └── /kasus/:id           → Detail Kasus
│       ├── ?tab=informasi   (Default)
│       ├── ?tab=timeline
│       ├── ?tab=dokumen
│       ├── ?tab=tim
│       ├── ?tab=tugas
│       └── ?tab=log
│
├── /klien-tim
│   ├── /klien-tim/klien     → Data Klien
│   │   ├── ?action=tambah
│   │   ├── ?search=...
│   │   └── /:id             → Detail Klien
│   │
│   └── /klien-tim/tim       → Tim Internal
│       ├── ?action=tambah
│       ├── ?search=...
│       └── /:id             → Detail Anggota
│
├── /dokumen                 → Dokumen & Arsip
│   ├── ?tab=semua           (Default)
│   ├── ?tab=dokumen-kasus
│   ├── ?tab=dokumen-klien
│   ├── ?tab=template-surat
│   ├── ?view=grid           (Default)
│   ├── ?view=list
│   ├── ?kategori=...
│   └── /:id                 → Detail/Preview Dokumen
│
├── /tugas                   → Tugas & Aktivitas
│   ├── ?status=all/selesai/in-progress/pending
│   ├── ?search=...
│   └── /:id                 → Detail Tugas
│
├── /kalender                → Kalender & Jadwal
│   ├── ?month=...
│   ├── ?jenis=rapat-internal/sidang/tenggat
│   └── /event/:id           → Detail Event
│
├── /laporan                 → Statistik & Laporan
│   ├── ?jenis-kasus=all/...
│   ├── ?periode=6bulan/1tahun/custom
│   ├── ?penanggung-jawab=all/...
│   └── ?wilayah=all/...
│
├── /pengaturan              → Pengaturan Sistem
│   ├── ?tab=profil          (Default)
│   ├── ?tab=keamanan
│   ├── ?tab=notifikasi
│   └── ?tab=umum
│
├── /audit                   → Audit & Keamanan
│   ├── ?user=all/...
│   ├── ?aksi=all/create/update/delete/login
│   ├── ?hasil=all/sukses/gagal/warning
│   └── ?date-range=...
│
└── /bantuan                 → Bantuan & Informasi
    ├── ?tab=panduan         (Default)
    ├── ?tab=faq
    ├── ?tab=support
    └── ?tab=tentang
```

---

## 5. USE CASE DIAGRAM

### 5.1 Aktor & Peran dalam Sistem

```
AKTOR SISTEM SIKAP PP POLRI
═══════════════════════════════════════════════════════════════

1. ADMIN (Super User)
   • Hak Akses: FULL ACCESS ke semua modul
   • Tanggung Jawab:
     - Mengelola seluruh sistem
     - Manajemen user & hak akses
     - Konfigurasi sistem
     - Backup & restore data
     - Audit & monitoring keamanan

2. SUPERVISOR (Pengawas)
   • Hak Akses: READ & APPROVE
   • Tanggung Jawab:
     - Monitoring kasus & tim
     - Approve/reject tugas kritis
     - Review laporan
     - Evaluasi kinerja

3. STAF (Operator)
   • Hak Akses: CRUD pada modul operasional
   • Tanggung Jawab:
     - Input & update data kasus
     - Manajemen klien & dokumen
     - Eksekusi tugas harian
     - Upload dokumen & laporan
```

### 5.2 Use Case per Aktor

```
┌──────────────────────────────────────────────────────────────┐
│                   USE CASE DIAGRAM SIKAP PP POLRI            │
└──────────────────────────────────────────────────────────────┘

                        ┌─────────────┐
                        │   SISTEM    │
                        │  SIKAP PP   │
                        │   POLRI     │
                        └─────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │  ADMIN  │          │SUPERVISOR│         │  STAF   │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                    │                     │
        │                    │                     │
┌───────┴────────┐     ┌─────┴──────┐       ┌─────┴──────┐
│                │     │            │       │            │
│ USE CASE ADMIN │     │USE CASE    │       │USE CASE    │
│                │     │SUPERVISOR  │       │STAF        │
│                │     │            │       │            │
└────────────────┘     └────────────┘       └────────────┘
```

#### 5.2.1 Use Case ADMIN (Full Access)

```
ADMIN
│
├── AUTENTIKASI & PROFIL
│   ├── Login ke Sistem
│   ├── Logout dari Sistem
│   ├── Ubah Profil
│   └── Ubah Password
│
├── MANAJEMEN KASUS (FULL CRUD)
│   ├── Lihat Daftar Kasus (Table)
│   ├── Tambah Kasus Baru
│   ├── Edit Data Kasus
│   ├── Hapus Kasus
│   ├── Lihat Detail Kasus (6 Tabs)
│   ├── Update Status & Status Progres
│   ├── Edit Timeline Stage
│   ├── Upload Dokumen Kasus
│   ├── Assign Tim ke Kasus
│   ├── Filter & Search Kasus
│   └── Export Data Kasus (PDF/Excel)
│
├── MANAJEMEN KLIEN & TIM (FULL CRUD)
│   ├── Kelola Data Klien
│   │   ├── Tambah Klien
│   │   ├── Edit Klien
│   │   ├── Hapus Klien
│   │   ├── Lihat Detail Klien
│   │   ├── Lihat Histori Kasus per Klien
│   │   └── Export Data Klien
│   │
│   └── Kelola Tim Internal
│       ├── Tambah Anggota Tim
│       ├── Edit Data Anggota
│       ├── Hapus Anggota
│       ├── Set Role & Permission
│       ├── Lihat Detail Anggota
│       ├── Lihat Kinerja Tim
│       └── Export Data Tim
│
├── DOKUMEN & ARSIP (FULL ACCESS)
│   ├── Upload Dokumen (Tabs: Semua/Kasus/Klien/Template)
│   ├── Download/Preview Dokumen
│   ├── Edit Metadata Dokumen
│   ├── Hapus Dokumen
│   ├── Kategorisasi Dokumen
│   ├── Link Dokumen ke Kasus
│   ├── Search & Filter Dokumen
│   └── Toggle Grid/List View
│
├── TUGAS & AKTIVITAS (FULL CRUD)
│   ├── Lihat Tabel Semua Tugas
│   ├── Buat Tugas Baru
│   ├── Assign Tugas ke User
│   ├── Edit Tugas
│   ├── Hapus Tugas
│   ├── Update Status & Progress Tugas
│   ├── Monitor Progress Tugas
│   ├── Filter by Status
│   └── Lihat Detail Tugas
│
├── KALENDER & JADWAL (FULL CRUD)
│   ├── View Kalender (Month View)
│   ├── Tambah Event/Jadwal (3 Jenis)
│   ├── Edit Event
│   ├── Hapus Event
│   ├── Filter by Jenis Event
│   └── View Daftar Event (Table)
│
├── STATISTIK & LAPORAN (FULL ACCESS)
│   ├── Lihat Dashboard Analitik
│   ├── View 4 Grafik Visualisasi
│   ├── Apply Filter (Jenis/Periode/PJ/Wilayah)
│   ├── Generate Laporan Custom
│   ├── Export Laporan (PDF/Excel)
│   ├── Kirim Email Report
│   └── View KPI Cards
│
├── PENGATURAN SISTEM (FULL ACCESS)
│   ├── Tab: Profil Saya
│   │   ├── Upload Avatar
│   │   └── Edit Informasi Personal
│   ├── Tab: Keamanan
│   │   ├── Ubah Password
│   │   ├── Toggle 2FA
│   │   ├── View Sesi Aktif
│   │   └── View Riwayat Login
│   ├── Tab: Notifikasi
│   │   └── Set Preferensi Notifikasi
│   └── Tab: Umum
│       ├── Toggle Dark Mode
│       ├── Pilih Bahasa
│       └── Set Format Tanggal
│
├── AUDIT & KEAMANAN (ADMIN ONLY)
│   ├── Lihat Log Aktivitas Semua User (Table)
│   ├── Filter Log (User/Aksi/Hasil/Date)
│   ├── Monitor Riwayat Perubahan Data
│   ├── Kelola Hak Akses User
│   ├── Backup Data Manual
│   ├── Schedule Auto Backup
│   ├── Restore Data
│   ├── View Backup History
│   ├── Set Security Policy
│   └── Export Audit Log
│
└── BANTUAN & INFORMASI (FULL ACCESS)
    ├── Tab: Panduan
    │   ├── Search Artikel
    │   ├── View Artikel
    │   ├── Tambah Artikel (Admin Only)
    │   └── Edit/Hapus Artikel (Admin Only)
    ├── Tab: FAQ
    │   ├── View 6 FAQ Items (Accordion)
    │   └── Manage FAQ (Admin Only)
    ├── Tab: Support
    │   ├── View Contact Info
    │   ├── Submit Ticket
    │   ├── Manage Tickets (Admin Only)
    │   └── View Ticket History
    └── Tab: Tentang
        ├── View App Info
        └── View Release Notes
```

#### 5.2.2 Use Case SUPERVISOR (Approval & Monitoring)

```
SUPERVISOR
│
├── AUTENTIKASI & PROFIL
│   ├── Login ke Sistem
│   ├── Logout dari Sistem
│   ├── Ubah Profil
│   └── Ubah Password
│
├── MANAJEMEN KASUS (READ & APPROVE)
│   ├── Lihat Daftar Kasus (Table)
│   ├── Lihat Detail Kasus (6 Tabs - Read Only)
│   ├── Filter & Search Kasus
│   ├── Export Data Kasus
│   ├── Review Status Progres
│   ├── Approve Update Kasus (Opsional)
│   ├── Monitor Progress Timeline
│   └── View Dokumen Kasus
│
├── MANAJEMEN KLIEN & TIM (READ ONLY)
│   ├── Lihat Data Klien
│   ├── Lihat Detail Klien
│   ├── Lihat Histori Kasus per Klien
│   ├── Lihat Daftar Tim Internal
│   ├── Lihat Detail Anggota Tim
│   ├── Monitor Kasus Ditangani per Anggota
│   └── Monitor Beban Kerja Tim
│
├── DOKUMEN & ARSIP (READ & DOWNLOAD)
│   ├── Lihat Daftar Dokumen (All Tabs)
│   ├── Search & Filter Dokumen
│   ├── Preview Dokumen
│   ├── Download Dokumen
│   └── View by Grid/List
│
├── TUGAS & AKTIVITAS (READ & APPROVE)
│   ├── Lihat Tabel Semua Tugas
│   ├── Lihat Detail Tugas
│   ├── Monitor Progress Tugas
│   ├── Approve/Reject Tugas Kritis (Opsional)
│   ├── Filter by Status
│   └── Export Data Tugas
│
├── KALENDER & JADWAL (READ & LIMITED WRITE)
│   ├── View Kalender & Event
│   ├── Tambah Event Personal (Terbatas)
│   ├── Filter by Jenis Event
│   └── View Daftar Event
│
├── STATISTIK & LAPORAN (READ & GENERATE)
│   ├── Lihat Dashboard Analitik
│   ├── View 4 Grafik Visualisasi
│   ├── Apply Filter
│   ├── Generate Laporan Kinerja Tim
│   ├── Generate Laporan Kasus
│   ├── Export Laporan (PDF/Excel)
│   ├── Kirim Email Report
│   └── View KPI Cards
│
├── PENGATURAN SISTEM (LIMITED)
│   ├── Tab: Profil Saya
│   │   └── Edit Informasi Personal
│   ├── Tab: Keamanan
│   │   ├── Ubah Password
│   │   └── View Riwayat Login Sendiri
│   ├── Tab: Notifikasi
│   │   └── Set Preferensi Notifikasi
│   └── Tab: Umum
│       ├── Toggle Dark Mode
│       └── Pilih Bahasa
│
├── AUDIT & KEAMANAN (READ ONLY)
│   ├── Lihat Log Aktivitas Tim Sendiri
│   ├── View Riwayat Perubahan Data
│   └── View Statistik Keamanan
│
└── BANTUAN & INFORMASI (READ)
    ├── Tab: Panduan (View Only)
    ├── Tab: FAQ (View Only)
    ├── Tab: Support
    │   ├── View Contact Info
    │   ├── Submit Ticket
    │   └── View Ticket History
    └── Tab: Tentang (View Only)
```

#### 5.2.3 Use Case STAF (Operational CRUD)

```
STAF
│
├── AUTENTIKASI & PROFIL
│   ├── Login ke Sistem
│   ├── Logout dari Sistem
│   ├── Ubah Profil
│   └── Ubah Password
│
├── MANAJEMEN KASUS (CRUD - LIMITED)
│   ├── Lihat Daftar Kasus (Assigned & Public)
│   ├── Tambah Kasus Baru
│   ├── Edit Kasus (Own & Assigned Only)
│   ├── Lihat Detail Kasus (6 Tabs)
│   ├── Update Status & Progres (Own Cases)
│   ├── Edit Timeline Stage (Own Cases)
│   ├── Upload Dokumen Kasus
│   ├── Tambah Catatan pada Kasus
│   ├── Filter & Search Kasus
│   └── Export Data Kasus
│
├── MANAJEMEN KLIEN & TIM (CRUD KLIEN, READ TIM)
│   ├── Data Klien (FULL CRUD):
│   │   ├── Lihat Daftar Klien
│   │   ├── Tambah Klien Baru
│   │   ├── Edit Data Klien
│   │   ├── Hapus Klien (Own Data)
│   │   ├── Lihat Detail & Histori Klien
│   │   ├── Search & Filter Klien
│   │   └── Export Data Klien
│   │
│   └── Tim Internal (READ ONLY):
│       ├── Lihat Daftar Tim
│       └── Lihat Profil Anggota Tim
│
├── DOKUMEN & ARSIP (FULL CRUD - OWN FILES)
│   ├── Upload Dokumen Baru
│   ├── Download/Preview Dokumen
│   ├── Edit Metadata Dokumen (Own Files)
│   ├── Hapus Dokumen (Own Files)
│   ├── Kategorisasi Dokumen
│   ├── Link Dokumen ke Kasus
│   ├── Search & Filter Dokumen
│   └── Toggle Grid/List View
│
├── TUGAS & AKTIVITAS (CRUD - OWN TASKS)
│   ├── Lihat Tugas Assigned ke Diri Sendiri
│   ├── Buat Tugas Baru (Terbatas)
│   ├── Edit Tugas (Own Tasks)
│   ├── Hapus Tugas (Own Tasks)
│   ├── Update Status & Progress (Own Tasks)
│   ├── Tandai Tugas Selesai
│   ├── Filter by Status
│   └── Lihat Detail Tugas
│
├── KALENDER & JADWAL (READ & LIMITED WRITE)
│   ├── View Kalender & Event
│   ├── Tambah Event Personal
│   ├── Edit/Hapus Event Sendiri
│   ├── Filter by Jenis Event
│   └── View Jadwal Tim (Read Only)
│
├── STATISTIK & LAPORAN (READ & BASIC EXPORT)
│   ├── Lihat Dashboard Pribadi
│   ├── View Statistik Kasus Sendiri
│   ├── Generate Laporan Sederhana
│   ├── Export Laporan (PDF/Excel)
│   └── View Grafik Kinerja Pribadi
│
├── PENGATURAN SISTEM (PERSONAL ONLY)
│   ├── Tab: Profil Saya
│   │   └── Edit Informasi Personal
│   ├── Tab: Keamanan
│   │   ├── Ubah Password
│   │   └── View Riwayat Login Sendiri
│   ├── Tab: Notifikasi
│   │   └── Set Preferensi Notifikasi
│   └── Tab: Umum
│       ├── Toggle Dark Mode
│       └── Pilih Bahasa
│
├── AUDIT & KEAMANAN (READ OWN)
│   ├── Lihat Log Aktivitas Sendiri
│   └── Lihat Riwayat Login Sendiri
│
└── BANTUAN & INFORMASI (READ)
    ├── Tab: Panduan (View Only)
    ├── Tab: FAQ (View Only)
    ├── Tab: Support
    │   ├── View Contact Info
    │   ├── Submit Ticket
    │   └── View Ticket History
    └── Tab: Tentang (View Only)
```

### 5.3 Matriks Hak Akses

```
┌──────────────────────────────────────────────────────────────────┐
│         MATRIKS HAK AKSES SIKAP PP POLRI                         │
└──────────────────────────────────────────────────────────────────┘

Legend: ✓ = Full Access | R = Read Only | L = Limited | ✗ = No Access

┌────────────────────────┬───────┬───────────┬───────┐
│       MODUL/FITUR      │ ADMIN │SUPERVISOR │ STAF  │
├────────────────────────┼───────┼───────────┼───────┤
│ LOGIN/LOGOUT           │   ✓   │     ✓     │   ✓   │
│ UBAH PROFIL            │   ✓   │     ✓     │   ✓   │
│ UBAH PASSWORD          │   ✓   │     ✓     │   ✓   │
├────────────────────────┼───────┼───────────┼───────┤
│ DASHBOARD UTAMA        │   ✓   │     ✓     │   ✓   │
│ VIEW SEMUA STATISTIK   │   ✓   │     ✓     │   R   │
│ VIEW GRAFIK            │   ✓   │     ✓     │   R   │
├────────────────────────┼───────┼───────────┼───────┤
│ MANAJEMEN KASUS        │       │           │       │
│  • Lihat Semua Kasus   │   ✓   │     ✓     │   L   │
│  • Tambah Kasus        │   ✓   │     L     │   ✓   │
│  • Edit Kasus          │   ✓   │     L     │   L   │
│  • Hapus Kasus         │   ✓   │     ✗     │   ✗   │
│  • View Detail (6 Tabs)│   ✓   │     ✓     │   ✓   │
│  • Update Status       │   ✓   │     L     │   L   │
│  • Edit Timeline       │   ✓   │     ✗     │   L   │
│  • Upload Dokumen      │   ✓   │     ✗     │   ✓   │
│  • Export Data         │   ✓   │     ✓     │   ✓   │
├────────────────────────┼───────┼───────────┼───────┤
│ KLIEN & TIM            │       │           │       │
│  • CRUD Klien          │   ✓   │     R     │   ✓   │
│  • CRUD Tim Internal   │   ✓   │     R     │   R   │
│  • Set Role/Permission │   ✓   │     ✗     │   ✗   │
│  • View Kinerja        │   ✓   │     ✓     │   R   │
│  • Export Data         │   ✓   │     ✓     │   ✓   │
├────────────────────────┼───────┼───────────┼───────┤
│ DOKUMEN & ARSIP        │       │           │       │
│  • Upload Dokumen      │   ✓   │     L     │   ✓   │
│  • Download/Preview    │   ✓   │     ✓     │   ✓   │
│  • Edit Metadata       │   ✓   │     ✗     │   L   │
│  • Hapus Dokumen       │   ✓   │     ✗     │   L   │
│  • View Tabs (4 Tabs)  │   ✓   │     ✓     │   ✓   │
│  • Toggle Grid/List    │   ✓   │     ✓     │   ✓   │
├────────────────────────┼───────┼───────────┼───────┤
│ TUGAS & AKTIVITAS      │       │           │       │
│  • View Tabel Tugas    │   ✓   │     ✓     │   L   │
│  • Buat Tugas          │   ✓   │     L     │   L   │
│  • Edit Tugas          │   ✓   │     L     │   L   │
│  • Hapus Tugas         │   ✓   │     L     │   L   │
│  • Update Progress     │   ✓   │     ✗     │   L   │
│  • Filter & Search     │   ✓   │     ✓     │   ✓   │
├────────────────────────┼───────┼───────────┼───────┤
│ KALENDER & JADWAL      │       │           │       │
│  • View Kalender       │   ✓   │     ✓     │   ✓   │
│  • Tambah Event        │   ✓   │     L     │   L   │
│  • Edit/Hapus Event    │   ✓   │     L     │   L   │
│  • Filter by Jenis     │   ✓   │     ✓     │   ✓   │
├────────────────────────┼───────┼───────────┼───────┤
│ STATISTIK & LAPORAN    │       │           │       │
│  • Dashboard Analitik  │   ✓   │     ✓     │   R   │
│  • View 4 Grafik       │   ✓   │     ✓     │   R   │
│  • Apply Filter        │   ✓   │     ✓     │   L   │
│  • Generate Laporan    │   ✓   │     ✓     │   L   │
│  • Export (PDF/Excel)  │   ✓   │     ✓     │   L   │
│  • Kirim Email         │   ✓   │     ✓     │   ✗   │
├────────────────────────┼───────┼───────────┼───────┤
│ PENGATURAN SISTEM      │       │           │       │
│  • Profil Saya         │   ✓   │     ✓     │   ✓   │
│  • Keamanan            │   ✓   │     ✓     │   ✓   │
│  • Notifikasi          │   ✓   │     ✓     │   ✓   │
│  • Umum                │   ✓   │     ✓     │   ✓   │
├────────────────────────┼───────┼───────────┼───────┤
│ AUDIT & KEAMANAN       │       │           │       │
│  • Log Semua User      │   ✓   │     R     │   ✗   │
│  • Log Pribadi         │   ✓   │     ✓     │   ✓   │
│  • Manajemen Akses     │   ✓   │     ✗     │   ✗   │
│  • Backup/Restore      │   ✓   │     ✗     │   ✗   │
│  • Export Audit Log    │   ✓   │     R     │   ✗   │
├────────────────────────┼───────┼───────────┼───────┤
│ BANTUAN & INFO         │       │           │       │
│  • Panduan             │   ✓   │     ✓     │   ✓   │
│  • FAQ                 │   ✓   │     ✓     │   ✓   │
│  • Support             │   ✓   │     ✓     │   ✓   │
│  • Manage Content      │   ✓   │     ✗     │   ✗   │
└────────────────────────┴───────┴───────────┴───────┘

CATATAN:
• L (Limited) = Hanya untuk data yang assigned/own
• R (Read Only) = Hanya bisa melihat, tidak bisa edit
• Admin memiliki override access ke semua data
• Supervisor fokus pada monitoring & approval
• Staf fokus pada operasional harian
```

### 5.4 Skenario Use Case Utama

```
SKENARIO USE CASE: PENANGANAN KASUS BARU
═══════════════════════════════════════════════════════════════

UC-001: REGISTRASI KASUS BARU
─────────────────────────────────────────────────────────────
Aktor Utama    : Staf / Admin
Aktor Sekunder : Supervisor (untuk approval/review)
Tujuan         : Mendaftarkan kasus hukum baru ke sistem

Precondition:
• User sudah login sebagai Staf atau Admin
• Data klien sudah tersedia (atau akan ditambahkan)

Flow Normal:
1. Staf login ke sistem
2. Dari Dashboard, klik Sidebar > "Manajemen Kasus"
3. Klik submenu "Tambah Kasus Baru"
4. Sistem menampilkan form input kasus
5. Staf mengisi data:
   - Nomor Kasus (Auto-generate/Manual)
   - Judul Kasus
   - Jenis Kasus (Dropdown: Korupsi/Narkotika/Pencurian/
     Penipuan/Penggelapan/Lainnya)
   - Deskripsi (Textarea)
   - Prioritas (Dropdown: Rendah/Sedang/Tinggi)
   - Status (Default: Aktif - tidak bisa diubah)
   - Status Progres (Default: Baru Masuk - tidak bisa diubah)
   - Lokasi
   - Tanggal Tenggat (Date Picker)
6. Staf memilih Klien:
   - Klik dropdown "Pilih Klien"
   - Pilih dari database klien existing, ATAU
   - Klik "Tambah Klien Baru" (buka dialog form klien)
7. Staf assign Tim Penanganan (Multi-select user)
8. Staf upload dokumen awal (optional):
   - Klik area upload
   - Pilih file (PDF/Word/Image)
   - File ter-attach ke form
9. Staf klik "Simpan Kasus"
10. Sistem validasi input:
    - Nomor Kasus: wajib, unique
    - Judul Kasus: wajib, min 5 karakter
    - Jenis Kasus: wajib
    - Klien: wajib
11. Sistem simpan data ke array/database
12. Sistem auto-create Timeline dengan Stage 1:
    - Stage: "Kasus Diterima"
    - Status: Active
    - Date: Today
    - Officer: User yang create
13. Sistem kirim notifikasi (Toast):
    - "Kasus berhasil ditambahkan"
14. Sistem redirect ke halaman "Daftar Kasus"
15. Kasus baru muncul di tabel dengan Status "Aktif"
    dan Status Progres "Baru Masuk"

Postcondition:
• Kasus baru terdaftar dalam sistem
• Timeline stage 1 ter-create otomatis
• Kasus muncul di dashboard "Kasus Terbaru"
• Data tersimpan di state/database
• Audit log tercatat

Alternative Flow:
A1. Validasi Gagal (Step 10)
    - Sistem tampilkan toast error message
    - Highlight field yang bermasalah dengan border merah
    - User perbaiki data
    - Retry submit

A2. Klien Belum Ada (Step 6)
    - User klik "Tambah Klien Baru"
    - Sistem buka dialog form klien
    - User input data klien (Nama, NIK, Alamat, Kontak, Email)
    - User klik "Simpan"
    - Sistem validasi data klien
    - Sistem simpan klien ke database
    - Sistem close dialog
    - Klien baru otomatis ter-select di dropdown
    - Kembali ke form kasus

A3. Upload Dokumen Gagal (Step 8)
    - File size > 10MB
    - Sistem tampilkan error: "File terlalu besar"
    - User pilih file lain atau compress file
    - Retry upload

Exception Flow:
E1. Session Timeout
    - Sistem redirect ke halaman login
    - User login ulang
    - Data form yang sudah diisi hilang (tidak tersimpan)

─────────────────────────────────────────────────────────────

UC-002: UPDATE STATUS & TIMELINE KASUS
─────────────────────────────────────────────────────────────
Aktor Utama    : Staf / Admin / Supervisor
Tujuan         : Memperbarui perkembangan penanganan kasus

Precondition:
• User sudah login
• Kasus sudah terdaftar dalam sistem
• User memiliki akses ke kasus tersebut

Flow Normal:
1. User login ke sistem
2. Akses "Manajemen Kasus" > "Daftar Kasus"
3. User cari kasus yang akan diupdate:
   - Gunakan Search: ketik nomor/nama klien, ATAU
   - Gunakan Filter: pilih status/progres
4. User klik "Lihat Detail" pada row kasus
5. Sistem redirect ke halaman "Detail Kasus"
6. Sistem tampilkan 6 tabs (default: Tab "Informasi Umum")
7. User klik Tab "Timeline & Progress"
8. Sistem tampilkan:
   - Visual Timeline (7 Stages)
   - Progress Bar di atas
9. User update Progress Bar:
   - Klik dropdown "Status Progres"
   - Pilih progres baru (misal: Verifikasi → Penyelidikan)
   - Progress Bar auto-update sesuai stage
10. User klik "Edit Stage" pada stage yang aktif
11. Sistem buka dialog "Edit Stage":
    - Nama Stage (Read-only)
    - Tanggal (Date Picker)
    - Officer/PIC (Input text)
    - Catatan (Textarea)
12. User isi data:
    - Tanggal: pilih tanggal update
    - Officer: nama petugas yang handle
    - Catatan: detail perkembangan
13. User klik "Simpan"
14. Sistem validasi input
15. Sistem update data stage
16. Sistem log ke Audit Trail:
    - Timestamp: Now
    - User: Current user
    - Aksi: UPDATE
    - Detail: "Status progres diubah dari [old] ke [new]"
17. Sistem update Tab "Log & Catatan":
    - Tambah entry baru dengan detail perubahan
18. Sistem tampilkan toast: "Timeline berhasil diperbarui"
19. Sistem refresh UI:
    - Timeline visual update icon (Completed/Active/Pending)
    - Progress bar update percentage
    - Badge Status Progres update warna

Postcondition:
• Status Progres kasus terupdate
• Timeline stage ter-record dengan detail
• Audit log tersimpan
• UI ter-refresh dengan data terbaru

Alternative Flow:
A1. User Update tanpa Edit Stage (Step 10)
    - User hanya update dropdown Status Progres
    - Skip step 10-13
    - Sistem tetap update Progress Bar
    - Sistem tetap log ke Audit Trail
    - Stage tidak punya detail (tanggal, officer, catatan)

A2. Validasi Gagal (Step 14)
    - Tanggal kosong atau invalid
    - Sistem tampilkan error message
    - User perbaiki data
    - Retry submit

─────────────────────────────────────────────────────────────

UC-003: GENERATE LAPORAN KASUS
─────────────────────────────────────────────────────────────
Aktor Utama    : Admin / Supervisor / Staf
Tujuan         : Membuat laporan kasus untuk periode tertentu

Precondition:
• User sudah login
• Data kasus tersedia (minimal 1 kasus)

Flow Normal:
1. User login ke sistem
2. Klik Sidebar > "Statistik & Laporan"
3. Sistem tampilkan halaman Statistik:
   - Header dengan action buttons (Unduh PDF/Excel, Email)
   - Filter Card (Jenis/Periode/PJ/Wilayah)
   - 4 KPI Cards
   - 4 Grafik Visualisasi
4. User apply filter (optional):
   - Jenis Kasus: pilih "Korupsi" (atau "all")
   - Periode: pilih "6 Bulan Terakhir" (atau custom)
   - Penanggung Jawab: pilih "Kompol Ahmad" (atau "all")
   - Wilayah: pilih "Jakarta" (atau "all")
5. Sistem filter data dan update visualisasi:
   - KPI Cards recalculate
   - Grafik re-render dengan data filtered
6. User review hasil visualisasi:
   - Bar Chart: Tren Kasus Bulanan
   - Pie Chart: Distribusi Jenis Kasus
   - Horizontal Bar: Kinerja Tim
   - Line Chart: Kasus by Wilayah
7. User klik "Unduh PDF" (atau "Unduh Excel")
8. Sistem proses data sesuai filter
9. Sistem generate laporan:
   - Header: Logo POLRI + Judul
   - Metadata: Periode, Generated by, Date
   - Summary: KPI Cards data
   - Visualisasi: Export grafik as image
   - Table: Detail data kasus
   - Footer: Copyright & page number
10. Sistem trigger download file:
    - Filename: "Laporan_Kasus_YYYY-MM-DD.pdf" (atau .xlsx)
11. Browser download file
12. Sistem tampilkan toast: "Laporan berhasil diunduh"
13. (Optional) User klik "Kirim Email":
    - Sistem buka dialog konfirmasi
    - User input email tujuan (default: supervisor@polri.go.id)
    - User klik "Kirim"
    - Sistem send email with attachment
    - Toast: "Laporan berhasil dikirim ke email"

Postcondition:
• Laporan ter-generate dalam format PDF/Excel
• File ter-download ke device user
• (Optional) Email terkirim dengan attachment
• Histori laporan tercatat di audit log

Alternative Flow:
A1. Tidak Ada Data (Step 5)
    - Hasil filter = empty
    - Sistem tampilkan message:
      "Tidak ada data untuk filter yang dipilih"
    - KPI Cards show "0"
    - Grafik show "No Data Available"
    - Buttons "Unduh" disabled
    - User ubah filter atau reset

A2. Export Gagal (Step 9)
    - Error saat generate PDF/Excel
    - Sistem tampilkan toast error:
      "Gagal menghasilkan laporan. Coba lagi."
    - User retry atau hubungi admin

A3. Email Gagal (Step 13)
    - SMTP error atau network issue
    - Sistem tampilkan toast error:
      "Gagal mengirim email. Periksa koneksi."
    - User retry atau download manual

Exception Flow:
E1. Data Terlalu Besar
    - Filter menghasilkan > 10,000 rows
    - Sistem warning: "Data terlalu besar. Batasi periode."
    - Sarankan user narrow down filter
    - Atau export in batches
```

---

## 6. RINGKASAN

### 6.1 Kesimpulan System Flow

SIKAP PP POLRI mengimplementasikan alur kerja yang terstruktur dan komprehensif untuk pengelolaan kasus hukum internal POLRI. Sistem ini dirancang dengan:

1. **Autentikasi Terpusat**: Login/Register untuk 3 role internal (Admin, Supervisor, Staf)

2. **Modul Terintegrasi**: 10 modul utama yang saling terhubung untuk mendukung seluruh siklus penanganan kasus

3. **Hierarki Akses**: Role-based access control yang jelas untuk menjaga keamanan dan integritas data

4. **Tracking & Audit**: Setiap aktivitas ter-log untuk transparansi dan akuntabilitas

5. **Kolaborasi Tim**: Fitur assignment, notifikasi, dan sharing data untuk kerja tim yang efektif

6. **Visualisasi Data**: Dashboard interaktif dengan 4 jenis grafik untuk analisis cepat

7. **Timeline Tracking**: 7 tahap status progres untuk monitoring detail perkembangan kasus

### 6.2 Key Features Summary

```
┌──────────────────────────────────────────────────────────┐
│              FITUR UTAMA SIKAP PP POLRI                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ✓ Dashboard Interaktif dengan Real-time Statistics     │
│  ✓ Manajemen Kasus Lengkap (Full CRUD)                  │
│  ✓ Detail Kasus dengan 6 Tabs Terorganisir              │
│  ✓ Timeline 7 Tahap Status Progres (Editable)           │
│  ✓ Data Klien & Tim Terpadu                             │
│  ✓ Dokumentasi & Arsip Digital (4 Kategori Tabs)        │
│  ✓ Task Management dengan Table View + Filter           │
│  ✓ Kalender & Scheduling (3 Jenis Event)                │
│  ✓ Statistik & Laporan Komprehensif (4 Grafik)          │
│  ✓ Pengaturan Personal & Sistem (4 Tabs)                │
│  ✓ Audit Trail & Security Management                    │
│  ✓ Help Center dengan FAQ Accordion                     │
│  ✓ Multi-role Support (Admin/Supervisor/Staf)           │
│  ✓ Responsive Design (Desktop-first, min 1440px)        │
│  ✓ Indonesian Language Interface                        │
│  ✓ Export Data (PDF/Excel)                              │
│  ✓ Search & Filter Advanced                             │
│  ✓ Dialog-based Forms (Modal Interactions)              │
│  ✓ Toast Notifications (Sonner)                         │
│  ✓ Color-coded Status Badges                            │
│  ✓ Progress Bars & Visual Indicators                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.3 Teknologi & Desain

```
┌──────────────────────────────────────────────────────────┐
│                  STACK TEKNOLOGI                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend Framework  : React + TypeScript                │
│  Styling            : Tailwind CSS v4.0                  │
│  UI Components      : Shadcn/ui                          │
│  Charts & Graphs    : Recharts                           │
│  Icons              : Lucide React                       │
│  Notifications      : Sonner                             │
│  State Management   : React Hooks (useState)             │
│  Navigation         : Component-based (props)            │
│                                                          │
│  COLOR SCHEME:                                           │
│  • Primary Navy     : #0A2342 (POLRI Official)           │
│  • Secondary Blue   : #007BFF (Accent & Active)          │
│  • Success Green    : #1DB954                            │
│  • Warning Orange   : #FFA726                            │
│  • Danger Red       : #E53935                            │
│  • Gold Accent      : #FFD700                            │
│                                                          │
│  STATUS PROGRES COLORS (7 Tahap):                        │
│  • Baru Masuk       : Gray (#6B7280)                     │
│  • Verifikasi       : Blue (#3B82F6)                     │
│  • Penyelidikan     : Yellow (#EAB308)                   │
│  • Pendampingan     : Orange (#F97316)                   │
│  • Persidangan      : Purple (#A855F7)                   │
│  • Putusan          : Indigo (#6366F1)                   │
│  • Selesai          : Green (#22C55E)                    │
│                                                          │
│  LAYOUT:                                                 │
│  • Sidebar: 288px (w-72) - Fixed Left                    │
│  • TopBar: Full width - User info & breadcrumbs          │
│  • Main Content: Responsive with min-width 1440px        │
│  • Modals: Dialog components for forms                   │
│  • Tables: Shadcn Table component                        │
│  • Cards: Shadcn Card with shadow-lg                     │
│                                                          │
│  UI PATTERNS:                                            │
│  • Tabs: Shadcn Tabs (Detail Kasus, Pengaturan, etc)    │
│  • Dialogs: Modal forms for CRUD operations              │
│  • Alert Dialogs: Confirmation for delete actions        │
│  • Toasts: Success/Error notifications (top-right)       │
│  • Badges: Status & priority indicators                  │
│  • Progress: Linear progress bars                        │
│  • Accordion: FAQ section                                │
│  • Select: Dropdown with search                          │
│  • Date Picker: Calendar component                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 6.4 Detail Implementasi UI/UX

```
DETAIL IMPLEMENTASI BERDASARKAN KODE AKTUAL
═══════════════════════════════════════════════════════════

DASHBOARD:
• 4 KPI Cards dengan icon & tren indicator
• 4 Grafik: Bar (monthly), Pie (status), Line (completion), Area (activity)
• Tabel Tugas Aktif dengan progress bar per row
• Tabel Kasus Terbaru dengan badge status
• Timeline Aktivitas dengan icon per tipe aksi

DAFTAR KASUS:
• Table view dengan 8 kolom
• Status Progres badge dengan 7 warna berbeda
• Progress bar dalam table cell
• Filter: Status (4 options) + Progres (7 options)
• Search real-time
• Actions: Eye (detail), Edit (dialog), Trash (alert)
• Export buttons

DETAIL KASUS:
• 6 Tabs: Informasi, Timeline, Dokumen, Tim, Tugas, Log
• Tab Timeline: Visual flow dengan 7 stages
  - Icon: CheckCircle2 (completed), Circle (active/pending)
  - Warna: Green (done), Blue (active), Gray (pending)
  - Edit button per stage
• Tab Dokumen: Upload area + table dengan icon by type
• Tab Tim: Grid cards dengan avatar
• Tab Log: Timeline feed dengan timestamp

KLIEN:
• Table dengan avatar column
• Dialog detail dengan histori kasus
• Form add/edit dalam dialog

TIM INTERNAL:
• Table dengan NIP, Jabatan, Divisi
• Counter kasus ditangani
• Detail dialog dengan statistik

DOKUMEN:
• 4 Tabs: Semua, Kasus, Klien, Template
• Grid view (default) dengan cards
• List view toggle
• Icon by file type: FileText (PDF), Image (JPG), File (DOC)
• Upload dialog dengan drag & drop area

TUGAS:
• TABLE VIEW (bukan Kanban!)
• Filter by status: all/Selesai/In Progress/Pending
• Status badge: Green/Blue/Orange
• Prioritas badge: Red/Orange/Green
• Progress bar column
• Dialog form add/edit

KALENDER:
• Month view kalender
• 3 Jenis event dengan color:
  - Rapat Internal: Green (border-l-green-500)
  - Sidang: Blue (border-l-blue-500)
  - Tenggat: Red (border-l-red-500)
• Table daftar event dibawah kalender
• Dialog form add event

STATISTIK:
• 4 Cards KPI di atas
• Filter card dengan 4 select dropdowns
• 4 Grafik besar:
  1. Bar Chart: monthlyData (6 months)
  2. Pie Chart: caseTypeData (6 types)
  3. Horizontal Bar: performanceData (5 users)
  4. Line Chart: regionalData (6 regions)
• Action buttons: PDF, Excel, Email

AUDIT:
• Summary cards dengan icon
• Table log dengan 6 kolom
• Hasil column dengan icon:
  - CheckCircle (Sukses - Green)
  - XCircle (Gagal - Red)
  - AlertTriangle (Warning - Yellow)
• Filter: User, Aksi, Hasil
• Search & export

BANTUAN:
• 4 Tabs: Panduan, FAQ, Support, Tentang
• FAQ: Accordion dengan 6 items
• Support: Form submit ticket
• Panduan: Search + daftar artikel
```

### 6.5 Future Enhancements (Rekomendasi)

```
PENGEMBANGAN LANJUTAN YANG DISARANKAN:
═══════════════════════════════════════════════════════════

1. INTEGRASI DATABASE REAL
   • Implementasi Supabase/PostgreSQL
   • Real-time sync data
   • Cloud storage untuk dokumen (AWS S3/Supabase Storage)
   • Database migration & seeding

2. AUTHENTICATION & AUTHORIZATION
   • JWT Token-based auth
   • OAuth2.0 untuk SSO POLRI
   • Multi-factor Authentication (MFA/2FA)
   • Session management & timeout
   • Password policy enforcement
   • Role-based middleware

3. NOTIFICATION SYSTEM
   • Email notifications (SMTP/SendGrid)
   • Push notifications (FCM/WebPush)
   • In-app notification center
   • Reminder automation (Cron jobs)
   • WebSocket for real-time updates

4. ADVANCED FEATURES
   • AI-powered case analysis
   • Document OCR & auto-indexing (Tesseract)
   • Predictive analytics (ML models)
   • Mobile app (React Native)
   • Real-time chat/collaboration (WebSocket)
   • Video conferencing integration (Zoom API)
   • E-signature untuk dokumen

5. UI/UX ENHANCEMENTS
   • Kanban view option untuk Tugas (drag & drop)
   • Advanced filtering (multi-criteria)
   • Bulk actions (multi-select + actions)
   • Keyboard shortcuts
   • Print-friendly layouts
   • Dark mode full implementation
   • Accessibility (WCAG 2.1 AA)

6. PERFORMANCE OPTIMIZATION
   • Lazy loading components
   • Virtual scrolling untuk large tables
   • Data pagination (server-side)
   • Caching strategy (React Query)
   • CDN untuk assets
   • Image optimization (Next.js Image)

7. COMPLIANCE & SECURITY
   • Data encryption (at rest & in transit)
   • Regular security audits
   • GDPR/Privacy law compliance
   • Automated backup (daily/weekly)
   • Disaster recovery plan
   • Penetration testing
   • IP whitelisting
   • Rate limiting

8. INTEGRATION
   • API untuk sistem eksternal POLRI
   • Integration dengan sistem perpustakaan hukum
   • Integration dengan sistem e-court
   • Integration dengan sistem PNBP
   • Webhook untuk external triggers

9. REPORTING & ANALYTICS
   • Advanced BI dashboard (Metabase/Superset)
   • Custom report builder (drag & drop)
   • Scheduled reports (email automation)
   • Data export automation
   • Dashboard embedding (iframe)
   • Interactive charts (drill-down)

10. DEPLOYMENT & DEVOPS
    • CI/CD pipeline (GitHub Actions)
    • Containerization (Docker)
    • Orchestration (Kubernetes)
    • Monitoring (Sentry/Datadog)
    • Logging (ELK Stack)
    • Load balancing
    • Auto-scaling
```

---

## PENUTUP

Dokumentasi ini memberikan gambaran lengkap mengenai **alur sistem, flowchart proses, sitemap aplikasi, dan use case diagram** untuk **SIKAP PP POLRI (Sistem Informasi Kasus dan Advokasi Profesional POLRI)**.

### Kesesuaian dengan UI/UX yang Diimplementasikan:

✅ **100% Sesuai dengan kode aplikasi yang sudah dibuat**

- Struktur 10 modul sesuai dengan routing App.tsx
- Detail fitur sesuai dengan komponen React yang ada
- Status Progres 7 tahap sesuai DaftarKasus.tsx
- Tab structure sesuai DetailKasus.tsx
- Table view Tugas sesuai TugasAktivitas.tsx
- 4 Tabs Dokumen sesuai DokumenArsip.tsx
- 3 Jenis Event Kalender sesuai KalenderJadwal.tsx
- 4 Grafik Statistik sesuai StatistikLaporan.tsx
- Audit log columns sesuai AuditKeamanan.tsx
- FAQ Accordion sesuai BantuanInfo.tsx

Sistem ini dirancang untuk:

- Meningkatkan efisiensi pengelolaan kasus hukum di lingkungan POLRI
- Memberikan transparansi dan akuntabilitas melalui audit trail
- Memfasilitasi kolaborasi tim internal
- Menyediakan data & analitik untuk pengambilan keputusan

Dengan arsitektur modular dan role-based access control, sistem ini dapat dikembangkan lebih lanjut sesuai kebutuhan operasional POLRI.

---

**Versi Dokumentasi**: 2.0 (Updated & Verified)  
**Tanggal**: 18 Desember 2025  
**Status**: Final - Verified with Actual Implementation  
**Disusun untuk**: Internal POLRI - Divisi Penegakan Hukum

═══════════════════════════════════════════════════════════════
© 2025 SIKAP PP POLRI - All Rights Reserved
═══════════════════════════════════════════════════════════════