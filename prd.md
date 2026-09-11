# PRD — Website Company Profile PT. Citra Protecta Semesta (CPS)

**Versi:** 2.0
**Tanggal:** 10 September 2026
**Status:** Draft untuk review internal
**Sumber data:** `Company_Profile_CPS.pdf`

---

## 1. Ringkasan Eksekutif

PT. Citra Protecta Semesta (CPS) adalah perusahaan Electrical & Electronic Engineering asal Indonesia yang bergerak di tiga lini bisnis: Service & Maintenance, Design & Manufacture, serta Trading & Construction. Perusahaan telah menangani lebih dari 80 proyek untuk klien-klien besar seperti Pertamina, PLN, Telkomsel, Indosat, Conoco Phillips, Total E&P, VICO Indonesia, dan berbagai PLTU/PLTGU di Indonesia.

Dokumen ini mendefinisikan kebutuhan produk untuk membangun **website company profile CPS** yang berfungsi sebagai etalase digital perusahaan — menampilkan kapabilitas, produk, dan rekam jejak proyek, sekaligus menjadi kanal akuisisi lead B2B.

---

## 2. Latar Belakang & Masalah yang Diselesaikan

**Kondisi saat ini:** Materi company profile CPS masih dalam bentuk PDF statis yang dikirim manual ke calon klien (biasa dipakai untuk keperluan tender/prakualifikasi vendor).

**Masalah:**
- PDF tidak dapat ditemukan lewat pencarian online (Google) sehingga calon klien baru sulit menemukan CPS secara organik.
- Sulit diperbarui — setiap ada proyek baru, seluruh file company profile harus diedit ulang secara manual.
- Tidak ada kanal digital untuk klien menghubungi CPS secara langsung (form, WhatsApp, dsb.).
- Presentasi visual (galeri foto proyek) terbatas oleh format slide/PDF, sehingga foto tidak bisa diperbesar, difilter, atau dicari per kategori.

**Solusi:** Website resmi (www.cpsindo.com) yang mereplikasi & memperluas isi PDF ke format web yang SEO-friendly, mobile-friendly, mudah diperbarui, dan dilengkapi kanal kontak digital.

---

## 3. Tujuan Produk (Goals)

| Tujuan | Indikator Keberhasilan |
|---|---|
| Meningkatkan kredibilitas & kehadiran digital CPS | Website terindeks Google, muncul di pencarian "cathodic protection Indonesia" dsb. |
| Mempermudah calon klien memahami kapabilitas CPS | Bounce rate < 50% pada halaman Products |
| Menghasilkan leads baru (RFQ/tender) | Minimal 5 form submission/bulan dalam 6 bulan pertama |
| Menyederhanakan proses update konten proyek | Tim non-teknis bisa menambah proyek baru < 10 menit tanpa developer |
| Menyajikan portofolio yang meyakinkan | Waktu rata-rata di halaman Project References > 1 menit |

### Non-Goals (di luar cakupan versi 1)
- E-commerce / transaksi online
- Portal klien (login, tracking order)
- Blog/berita berkala (dapat dipertimbangkan di fase 2)

---

## 4. Target Pengguna & Persona

### Persona 1 — "Procurement Officer" (Budi, 35)
Bekerja di divisi pengadaan perusahaan migas/PLN. Mencari vendor tersertifikasi untuk kebutuhan panel listrik atau cathodic protection. Prioritas: legalitas perusahaan, rekam jejak proyek sejenis, kecepatan respons.

### Persona 2 — "Site/Project Engineer" (Sarah, 29)
Butuh spesifikasi teknis produk (mis. kapasitas Load Bank, tipe Transformer Rectifier) untuk memastikan kecocokan dengan kebutuhan proyek EPC.

### Persona 3 — "EPC Contractor / Sub-kontraktor Manager" (Andi, 42)
Mencari sub-kontraktor kelistrikan untuk proyek besar (PLTU, jetty, dermaga). Ingin bukti pengalaman di proyek serupa (marine, oil & gas).

---

## 5. User Stories & Kriteria Penerimaan

| ID | Sebagai... | Saya ingin... | Agar... | Kriteria Penerimaan |
|----|------------|----------------|---------|----------------------|
| US-01 | Pengunjung baru | melihat ringkasan bisnis CPS di halaman utama | cepat paham layanan yang ditawarkan | Hero section tampil < 2 detik, memuat 3 divisi bisnis |
| US-02 | Procurement Officer | mencari proyek referensi berdasarkan klien/industri | menilai relevansi pengalaman CPS | Search & filter berfungsi di halaman Project References |
| US-03 | Site Engineer | melihat detail & foto produk per kategori | memverifikasi kesesuaian teknis | Setiap kategori produk punya galeri & deskripsi |
| US-04 | Calon klien | mengirim pertanyaan/RFQ lewat form | mendapat respons cepat dari sales CPS | Form terkirim ke email sales, ada auto-reply konfirmasi |
| US-05 | Admin CPS | menambah proyek baru ke daftar referensi | portofolio selalu up-to-date | CMS punya form input proyek (klien, user, deskripsi, tahun, kategori) |
| US-06 | Pengunjung mobile | mengakses seluruh halaman dari HP | pengalaman tetap nyaman | Semua halaman lulus uji responsif di viewport 360–1440px |

---

## 6. Sitemap / Struktur Situs

```
Home
├── About Us
│   ├── Profil Perusahaan
│   ├── Visi & Misi
│   └── 3 Divisi Bisnis
├── Products & Services
│   ├── Electrical
│   ├── Mechanical
│   ├── Cathodic Protection System
│   └── Load Bank / Dummy Load
├── Project References
│   ├── CME Project References
│   └── Cathodic Protection Project References
├── Gallery
├── Contact Us
└── (Opsional Fase 2) News/Blog
```

---

## 7. Spesifikasi Halaman

### 7.1 Home
- **Hero**: tagline utama *"Quick Response and Good Quality are our commitment to serve"*, foto latar (panel listrik, tower, instalasi laut — sesuai foto pada PDF halaman sampul)
- **Ringkasan 3 Divisi** (card layout, ikon + 1-2 kalimat):
  1. Service and Maintenance Division — servis & maintenance UPS, Battery Monitoring, Charger, Inverter, Rectifier
  2. Design and Manufacture Division — Electrical Panel, Battery Monitoring, Inverter & Rectifier, Cathodic Protection custom
  3. Trading and Construction Division — pengadaan peralatan Electrical, Mechanical & Instrument standar ANSI/NEMA/IEC
- **Strip Klien/Logo** (opsional bila logo tersedia): Pertamina, PLN, Telkomsel, Indosat, Total E&P, VICO Indonesia, dsb.
- **Angka pencapaian** (stat counter): jumlah proyek (80+), tahun berdiri, jumlah klien
- **CTA**: tombol "Hubungi Kami" & "Lihat Produk"

### 7.2 About Us
- Teks profil (adaptasi dari isi PDF bagian PROFILE)
- Visi & Misi *(baru — lihat Bagian 9)*
- Penjelasan detail 3 divisi bisnis
- Alamat kantor pusat & peta lokasi

### 7.3 Products & Services
Layout: tab/kategori di atas, di bawahnya grid produk dengan foto + label (sesuai isi PDF).

**Electrical**
- Low Voltage Main Distribution Panel (LVMDP)
- Main Distribution Panel (MDP)
- Motor Control Center (MCC)
- Genset Synchronizing Panel
- ATS/AMF Panel
- PLC Instrument Panel
- Explosion Proof Panel
- Switchgear, UPS, Power Cable & Tray/Ladder

**Mechanical**
- Fire Fighting System (Sprinkler System, Fire Alarm System, CO2 System)
- Underground HDPE Pipe

**Cathodic Protection System**
- Transformer Rectifier (termasuk Explosion Proof) — produk CPS sendiri
- Junction Box, Test Point
- Instalasi/Perbaikan Cathodic Protection System
- Closed Interval Potential Survey (CIPS)
- Instalasi Anode di Dermaga & Kapal (MMO Anode, Anode MGPS)

**Load Bank / Dummy Load**
- Load Bank DC — uji beban baterai 10–1000 Ampere
- Load Bank AC — uji beban genset 10–2500 MW (tipe indoor & mobile)

Setiap kategori: deskripsi singkat, minimal 4–6 foto, contoh proyek terkait (link ke Project References).

### 7.4 Project References
Dua dataset ditampilkan sebagai tabel interaktif:

**A. CME Project References** (39 entri) — kolom: No, Client, User, Project
**B. Cathodic Protection Project References** (41 entri) — kolom: No, Client, User, Project, Tahun

Fitur:
- Search box (cari berdasarkan nama klien/proyek)
- Filter: kategori (CME / Cathodic Protection), tahun, industri (migas, kelistrikan, telekomunikasi, marine)
- Pagination (10–20 baris/halaman)
- Klik baris → detail proyek (jika ada foto pendukung, tampilkan)

*(Lihat Bagian 10 untuk skema data lengkap & contoh isi.)*

### 7.5 Gallery
- Grid foto masonry, dikelompokkan per kategori (Electrical, Mechanical, Cathodic Protection, Load Bank)
- Lightbox saat foto diklik
- Caption sesuai keterangan asli di PDF (mis. "SWITCHGEAR", "LVMDP – DATA CENTER CYBER 2", "INSTALL ANODE DI DERMAGA PLTU SOMA KARIMUN")

### 7.6 Contact Us
- **Alamat**: Kavling DPR Blok C No. 234, Neroktog, Pinang, Tangerang, Banten, Indonesia 15145
- **Telepon**: +62-21-55746808, 90572001, 90572002, 90572003
- **Fax**: +62-21-68469494
- **Email**: cps@cpsindo.com
- **Website**: www.cpsindo.com
- Form kontak: Nama, Perusahaan, Email, No. Telepon, Subjek, Pesan
- Google Maps embed lokasi kantor
- (Opsional) tombol klik-to-chat WhatsApp

---

## 8. Fitur Fungsional & Prioritas (MoSCoW)

| # | Fitur | Prioritas | Catatan |
|---|-------|-----------|---------|
| 1 | Landing page responsif (desktop, tablet, mobile) | Must | — |
| 2 | Halaman produk per kategori dengan galeri | Must | 4 kategori sesuai PDF |
| 3 | Tabel referensi proyek dengan search & filter | Must | ±80 baris data awal |
| 4 | Form kontak terintegrasi email | Must | Validasi + anti-spam |
| 5 | Galeri foto dengan lightbox | Should | |
| 6 | CMS/admin panel untuk kelola proyek & produk | Should | Rekomendasi headless CMS |
| 7 | SEO on-page (meta title/description, sitemap.xml, robots.txt) | Should | |
| 8 | Multi-bahasa (ID/EN) | Should | Sumber PDF sudah dalam Bahasa Inggris |
| 9 | Google Analytics / GA4 | Could | |
| 10 | Integrasi WhatsApp Business widget | Could | |
| 11 | Halaman Sertifikasi/Legalitas | Could | Menunggu dokumen dari CPS |
| 12 | Blog/News | Won't (fase 1) | Dipertimbangkan fase 2 |

---

## 9. Konten Baru yang Dilengkapi (Gap dari PDF)

Materi PDF sumber tidak memuat visi/misi, sertifikasi, atau testimoni. Berikut draft yang disusun berdasarkan nada & isi profil perusahaan yang ada — **perlu direview dan disetujui oleh manajemen CPS sebelum publish**:

**Visi (draft):**
> Menjadi perusahaan Electrical & Electronic Engineering terkemuka dari Indonesia yang diakui secara luas atas kualitas, inovasi, dan keandalan layanan di tingkat nasional maupun internasional.

**Misi (draft):**
1. Memberikan solusi Service & Maintenance yang cepat dan tepat untuk meminimalkan downtime produksi klien.
2. Merancang dan memproduksi peralatan power electronics sesuai kebutuhan spesifik pelanggan.
3. Menyediakan peralatan Electrical, Mechanical & Instrument bersertifikasi standar ANSI/NEMA/IEC dengan harga kompetitif dan pengiriman tepat waktu.
4. Menjaga komitmen "Quick Response and Good Quality" di setiap proyek.

**Item lain yang masih perlu dilengkapi oleh CPS (belum tersedia di sumber):**
- Sertifikasi & legalitas perusahaan (ISO, SIUP, TDP/NIB, sertifikat K3, dsb.)
- Tahun pendirian perusahaan
- Struktur organisasi / tim manajemen kunci
- Jumlah karyawan/tenaga ahli
- Foto kantor pusat & workshop
- Logo klien (untuk ditampilkan di Home, perlu izin penggunaan logo)
- Testimoni tertulis dari klien
- Dokumen/sertifikat produk (mis. sertifikasi Transformer Rectifier)

---

## 10. Model Data (untuk CMS)

### 10.1 Entitas `Project`
| Field | Tipe | Contoh |
|---|---|---|
| id | string | proj-001 |
| category | enum | `CME` \| `Cathodic Protection` |
| client | string | PT. Inti Karya Persada Tehnik |
| user | string | Pertamina Sumbagsel |
| project_title | string | Sub Distribution Panel, COS Panel |
| year | number (nullable) | 2011 |
| industry_tag | enum[] | Oil & Gas, Power Plant, Telecom, Marine, Government |
| photos | image[] | (opsional) |
| description | text (opsional) | |

### 10.2 Entitas `Product`
| Field | Tipe | Contoh |
|---|---|---|
| id | string | prod-electrical-lvmdp |
| category | enum | Electrical \| Mechanical \| Cathodic Protection \| Load Bank |
| name | string | LVMDP |
| short_description | text | |
| specifications | key-value[] | |
| photos | image[] | |
| related_projects | reference[] → Project | |

### 10.3 Entitas `ContactSubmission`
| Field | Tipe |
|---|---|
| id | string |
| name, company, email, phone | string |
| subject | string |
| message | text |
| submitted_at | datetime |
| status | enum: New / Contacted / Closed |

---

## 11. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|---|---|
| **Performa** | LCP < 2.5s, ukuran gambar dioptimasi (WebP), lazy loading galeri |
| **Responsif** | Mobile-first, breakpoint 360px / 768px / 1024px / 1440px |
| **SEO** | Meta tag unik per halaman, sitemap.xml, structured data (Organization schema) |
| **Keamanan** | HTTPS wajib, validasi & sanitasi input form, proteksi spam (reCAPTCHA/honeypot), rate limiting |
| **Aksesibilitas** | Kontras warna WCAG AA, alt text semua gambar, navigasi keyboard |
| **Skalabilitas konten** | CMS mendukung >200 entri proyek tanpa penurunan performa (pagination/lazy load pada tabel) |
| **Ketersediaan** | Uptime target 99.5% |
| **Kompatibilitas browser** | Chrome, Safari, Edge, Firefox versi 2 tahun terakhir |
| **Bahasa** | Bahasa Indonesia (default) & Inggris (toggle), fase 1 minimal Inggris (sesuai sumber PDF) |

---

## 12. Rekomendasi Arsitektur & Tech Stack

- **Frontend**: Next.js (React) + Tailwind CSS — mendukung SSR/SSG untuk SEO optimal
- **CMS**: Headless CMS (Sanity, Strapi, atau Payload) agar tim non-teknis dapat mengelola Products & Project References
- **Hosting**: Vercel/Netlify (frontend) + database terkelola bila diperlukan
- **Form handling**: SMTP internal atau layanan pihak ketiga (Formspree/Resend) dengan notifikasi ke email sales CPS
- **Analytics**: Google Analytics 4 + Google Search Console
- **Image hosting/CDN**: Cloudinary atau storage bawaan CMS dengan optimasi otomatis

---

## 13. Rencana SEO Awal

**Target kata kunci (contoh, perlu riset lanjutan):**
- "cathodic protection system Indonesia"
- "transformer rectifier supplier Indonesia"
- "LVMDP MDP MCC panel manufacturer Tangerang"
- "load bank rental / supplier Indonesia"
- "electrical panel contractor Pertamina PLN"

**Taktik on-page:**
- Setiap halaman produk memiliki H1 unik + deskripsi 150–300 kata
- Alt text deskriptif pada seluruh foto proyek
- Internal linking antara Products ↔ Project References
- Schema markup `Organization` dengan alamat, telepon, email dari data resmi

---

## 14. Analitik & Metrik Keberhasilan

| Metrik | Target Bulan 1–3 | Target Bulan 4–6 |
|---|---|---|
| Pengunjung unik/bulan | 200 | 800 |
| Form submission/bulan | 2 | 5+ |
| Bounce rate halaman Home | < 60% | < 50% |
| Rata-rata durasi sesi | > 1 menit | > 2 menit |
| Halaman terindeks Google | 80% halaman | 100% halaman |

---

## 15. Risiko & Asumsi

| Risiko/Asumsi | Dampak | Mitigasi |
|---|---|---|
| Foto pada PDF beresolusi rendah untuk web | Kualitas visual kurang optimal | Minta ulang foto beresolusi tinggi dari CPS atau lakukan pemotretan ulang |
| Data proyek (80+ entri) perlu divalidasi ulang (typo, klien duplikat) | Kredibilitas data | QA data sebelum go-live, sinkronisasi dengan tim internal CPS |
| Penggunaan logo klien tanpa izin | Risiko hukum/etika | Konfirmasi izin ke masing-masing klien atau tampilkan tanpa logo (teks saja) |
| Konten visi/misi masih draft internal | Tidak merepresentasikan perusahaan secara akurat | Wajib direview & disetujui manajemen sebelum publish |
| Ketersediaan tim untuk mengisi CMS pasca-launch | Konten jadi usang | Sesi training CMS untuk tim admin CPS |

---

## 16. Open Questions (untuk klarifikasi ke CPS)

1. Apakah tersedia logo/identitas visual resmi (brand guideline, warna korporat)?
2. Apakah ada sertifikasi resmi (ISO 9001, dsb.) yang ingin ditampilkan?
3. Siapa kontak person yang akan menerima notifikasi form kontak?
4. Apakah domain www.cpsindo.com masih aktif dan bisa digunakan, atau perlu domain baru?
5. Apakah foto-foto proyek pada PDF boleh digunakan ulang di web, atau perlu foto baru?
6. Apakah dibutuhkan versi Bahasa Indonesia penuh, atau cukup Bahasa Inggris (sesuai isi PDF asli)?

---

## 17. Timeline & Milestone (Estimasi)

| Fase | Durasi | Output |
|---|---|---|
| 1. Discovery & Content Gathering | 1 minggu | Jawaban open questions, aset foto resolusi tinggi, teks final |
| 2. Desain UI/UX (wireframe → mockup) | 1–2 minggu | Prototipe Figma seluruh halaman |
| 3. Setup CMS & Data Migration | 3–5 hari | ±80 entri proyek & produk masuk ke CMS |
| 4. Development Frontend | 2–3 minggu | Website fungsional di staging |
| 5. QA, SEO, Aksesibilitas Testing | 3–5 hari | Bug fix, lint SEO, uji cross-browser |
| 6. UAT (User Acceptance Test) oleh CPS | 3–5 hari | Sign-off dari stakeholder CPS |
| 7. Launch & Monitoring | 1 hari + 2 minggu monitoring | Go-live, setup GA4/Search Console |

---

## 18. Design System

### 18.1 Konteks & Referensi
Situs eksisting **www.cpsindo.com** saat ini dibangun di atas WordPress (theme dasar dari "cekasweb"), dengan karakteristik:
- Tagline: *"Protection is our care"*
- Palet warna biru-teal (sesuai foto sampul PDF: gradasi biru laut)
- Layout sederhana: hero image tunggal, 3 blok divisi bisnis (teks + foto kecil di kiri), info kontak & Google Maps di footer
- Menu: Home, Panel Listrik, Pemantauan Baterai, UPS & Load Bank, Perlindungan Katodik, Contact Us
- Tidak responsif optimal, tipografi standar browser, tidak ada komponen interaktif (tab, filter, galeri lightbox)

Design system ini mengambil **identitas warna & pesan merek** dari situs eksisting (biru-teal korporat, tone "protection/reliability"), namun **dimodernisasi**: grid layout, tipografi custom, komponen berbasis UI library, micro-interaction, dan mendukung seluruh struktur halaman baru pada PRD ini (Products per kategori, Project References dengan tabel interaktif, Gallery dengan lightbox).

### 18.2 Prinsip Desain
1. **Trustworthy & Industrial** — kesan kokoh, presisi, dan profesional (industri berat/energi), bukan playful.
2. **Clarity over decoration** — banyak data teknis (spesifikasi, tabel proyek); desain harus memprioritaskan keterbacaan.
3. **Konsisten dengan warisan brand** — tetap memakai biru-teal sebagai warna identitas, tapi dengan kontras & hierarki yang lebih tajam dibanding situs lama.
4. **Mobile-first & cepat** — mengingat pengguna sering membuka dari lapangan/site proyek dengan koneksi terbatas.

### 18.3 UI Library & Rekomendasi Teknis
| Kebutuhan | Rekomendasi |
|---|---|
| Component library | **shadcn/ui** (berbasis Radix UI + Tailwind CSS) — komponen accessible, mudah dikustom sesuai brand, cocok dipakai di Next.js |
| Utility CSS | **Tailwind CSS** |
| Icon set | **lucide-react** (ikon garis tipis, konsisten dengan kesan teknis/industrial) |
| Tabel data (Project References) | shadcn/ui `DataTable` (dibangun di atas **TanStack Table**) — mendukung sort, filter, pagination, search |
| Galeri & Lightbox | `yet-another-react-lightbox` atau komponen custom di atas shadcn `Dialog` |
| Grafik/statistik (opsional, Home) | `recharts` untuk stat counter/angka pencapaian bila diperlukan |
| Form | shadcn/ui `Form` (React Hook Form + Zod validation) |
| Animasi ringan | `Framer Motion` (fade-in on scroll, hover transitions) — dipakai secukupnya, hindari berlebihan |

> Alasan memilih shadcn/ui: komponen tidak datang sebagai npm package tertutup, melainkan kode yang di-generate ke dalam project — sehingga mudah dikustomisasi warna/style sesuai identitas CPS tanpa "melawan" default styling library, serta seluruh komponen accessible (ARIA-compliant) secara default.

### 18.4 Palet Warna
Diturunkan dari gradasi biru laut pada materi visual CPS (cover PDF & tema situs eksisting), dengan penambahan warna aksen agar lebih modern dan kontras cukup untuk aksesibilitas (WCAG AA).

| Token | Hex (contoh) | Penggunaan |
|---|---|---|
| `--color-primary-900` | #0B2A4A | Teks judul besar, footer background |
| `--color-primary-700` | #0F4C81 | Primary button, link aktif |
| `--color-primary-500` | #1A73B0 | Hover state, ikon aktif |
| `--color-secondary-500` | #12A594 (teal) | Aksen sekunder (badge kategori, ikon) |
| `--color-accent` | #F5A623 (amber, opsional) | CTA penting / highlight angka pencapaian |
| `--color-neutral-900` | #101418 | Teks body utama |
| `--color-neutral-600` | #5B6470 | Teks sekunder/caption |
| `--color-neutral-100` | #F4F6F8 | Background section alternatif |
| `--color-white` | #FFFFFF | Background utama, card |
| `--color-success` | #22C55E | Status form berhasil |
| `--color-error` | #EF4444 | Validasi error form |

*(Nilai hex di atas adalah titik awal desain — perlu difinalisasi oleh desainer bersama brand guideline resmi CPS jika tersedia; lihat Open Questions #1.)*

### 18.5 Tipografi
| Elemen | Font | Ukuran (desktop) | Ukuran (mobile) | Weight |
|---|---|---|---|---|
| Font utama | **Inter** (sans-serif, netral & sangat legible untuk data teknis) | — | — | 400/500/600/700 |
| Font judul/hero (opsional) | **Sora** atau **Space Grotesk** (kesan teknikal-modern) | — | — | 600/700 |
| H1 (Hero) | Sora/Space Grotesk | 48–56px | 32–36px | 700 |
| H2 (Section title) | Sora/Space Grotesk | 32–36px | 24–28px | 600 |
| H3 (Card/subsection) | Inter | 20–22px | 18px | 600 |
| Body | Inter | 16px | 15px | 400 |
| Caption/label tabel | Inter | 13–14px | 13px | 500 |

Skala menggunakan rasio ~1.25 (Major Third) agar hierarki tetap terasa presisi/teknis, bukan editorial.

### 18.6 Grid & Spacing
- **Container max-width**: 1280px, padding horizontal 24px (mobile: 16px)
- **Grid**: 12-kolom (desktop), 4-kolom (mobile), gutter 24px
- **Spacing scale** (Tailwind default, kelipatan 4px): 4, 8, 12, 16, 24, 32, 48, 64, 96
- **Border radius**: 8px (card/button kecil), 12–16px (card produk/gambar besar) — cukup lembut untuk kesan modern tanpa menghilangkan kesan industrial
- **Elevation/shadow**: shadow tipis (`shadow-sm`/`shadow-md` Tailwind) untuk card, hindari shadow tebal/skeuomorphic

### 18.7 Komponen Kunci (mapping ke shadcn/ui)

| Komponen | Base shadcn/ui | Kustomisasi Brand |
|---|---|---|
| Navbar | `NavigationMenu` | Sticky on scroll, background transparan → solid biru-900 saat scroll, logo CPS |
| Hero Section | Custom + `Button` | Overlay gradient biru-900 → transparan di atas foto industrial (switchgear/offshore) agar teks tetap terbaca |
| Card Divisi Bisnis | `Card` | Ikon lucide-react (Wrench, Cpu, Truck) + border-top aksen teal saat hover |
| Tab Kategori Produk | `Tabs` | Warna aktif primary-700, underline animasi |
| Grid Produk | `Card` + `AspectRatio` (gambar konsisten 4:3) | |
| Tabel Project References | `DataTable` (TanStack) + `Input` (search) + `Select` (filter kategori/tahun) | Badge kategori (CME = biru, Cathodic Protection = teal) |
| Galeri | `Dialog`/Lightbox custom | Grid masonry, hover zoom subtle |
| Form Kontak | `Form`, `Input`, `Textarea`, `Button` | Validasi Zod, toast sukses (`Sonner`/shadcn `Toast`) |
| Stat Counter (Home) | Custom + Framer Motion `useInView` | Animasi count-up angka proyek/tahun berdiri |
| Footer | Custom | 3 kolom: Kontak, Sitemap singkat, Peta lokasi (Google Maps embed) |
| Badge kategori industri | `Badge` | Oil & Gas, Power Plant, Telecom, Marine, Government — warna berbeda per tag |

### 18.8 Ikonografi & Imagery
- Ikon: **lucide-react**, garis tipis (`stroke-width: 1.5–2`), konsisten dengan kesan presisi teknis
- Fotografi: prioritaskan foto asli proyek CPS (panel, instalasi anode, dsb. — dari materi PDF, idealnya resolusi lebih tinggi); hindari stok foto generik agar kredibilitas terjaga
- Treatment foto: sedikit overlay gradient biru pada hero agar konsisten dengan palet, foto produk lain ditampilkan natural (tanpa filter berat)

### 18.9 Motion & Interaksi
- Transisi hover: 150–200ms, ease-out
- Scroll reveal: fade-up halus (opacity 0→1, translateY 16px→0) menggunakan Framer Motion, dipicu sekali per section (`whileInView`)
- Hindari animasi berlebihan pada tabel data (Project References) — prioritas kecepatan & keterbacaan saat filtering/sorting

### 18.10 Aksesibilitas & Dark Mode
- Kontras teks minimum 4.5:1 (WCAG AA) — divalidasi khusus pada teks putih di atas primary-700
- Seluruh komponen interaktif (tab, dialog, dropdown filter) memakai shadcn/ui yang berbasis Radix UI → accessible secara default (keyboard navigation, ARIA roles)
- Dark mode: **opsional, tidak prioritas** untuk versi 1 mengingat sifat situs B2B/industrial; struktur token warna di atas tetap disiapkan agar mudah ditambahkan di fase berikutnya bila dibutuhkan

### 18.11 Perbandingan Ringkas: Situs Lama vs. Design System Baru

| Aspek | Situs Lama (cpsindo.com) | Design System Baru |
|---|---|---|
| Platform | WordPress theme generik | Next.js + Tailwind + shadcn/ui |
| Layout | Statis, 1 kolom teks+gambar kecil | Grid modular, card-based, responsif penuh |
| Warna | Biru gradasi tanpa sistem token | Palet token terstruktur (primary/secondary/neutral/accent) |
| Tipografi | Font default browser | Inter + Sora/Space Grotesk dengan skala tipe jelas |
| Data proyek | Tidak ditampilkan di web (hanya di PDF) | Tabel interaktif (search, filter, sort, pagination) |
| Galeri | Tidak ada | Grid + lightbox |
| Komponen interaktif | Minim (menu statis) | Tabs, Dialog, DataTable, Toast, animasi scroll |
| Aksesibilitas | Tidak terukur | Radix UI-based, target WCAG AA |

---

## 19. Lampiran

- Sumber data utama: `Company_Profile_CPS.pdf`
  - Bagian 1: Cover & Kontak Perusahaan
  - Bagian 2: Profil (Product & Activity intro)
  - Bagian 3: Electrical (foto produk)
  - Bagian 4: Mechanical (Fire Fighting System)
  - Bagian 5: Cathodic Protection System (foto & proses instalasi)
  - Bagian 6: Load Bank / Dummy Load
  - Bagian 7: Project References List (CME — 39 entri)
  - Bagian 8: Cathodic Protection Project References List (41 entri)
