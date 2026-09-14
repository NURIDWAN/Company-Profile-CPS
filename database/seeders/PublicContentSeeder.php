<?php

namespace Database\Seeders;

use App\Models\PageContent;
use Illuminate\Database\Seeder;

class PublicContentSeeder extends Seeder
{
    public function run(): void
    {
        $contents = [
            ['home', 'hero', 'eyebrow', 'Rekayasa & Sistem Tenaga'],
            ['home', 'hero', 'title', 'Rekayasa Andal untuk Infrastruktur Kritis'],
            ['home', 'hero', 'description', 'Solusi rekayasa andal untuk infrastruktur kritis — didukung 80+ proyek untuk klien seperti Pertamina, PLN, dan Telkomsel.'],
            ['home', 'hero', 'primary_cta', 'Jelajahi Layanan'],
            ['home', 'hero', 'secondary_cta', 'Lihat Proyek'],
            ['home', 'company', 'eyebrow', 'Perusahaan / 01'],
            ['home', 'company', 'title', 'Dibangun atas keahlian rekayasa.'],
            ['home', 'company', 'description', 'PT. Citra Protecta Semesta adalah perusahaan Rekayasa Kelistrikan & Elektronik yang berfokus pada solusi teknis, sistem kustom, dan dukungan proyek untuk infrastruktur kritis.'],
            ['home', 'services', 'eyebrow', 'Kapabilitas / 02'],
            ['home', 'services', 'title', 'Rekayasa dalam aksi.'],
            ['home', 'contact_cta', 'eyebrow', 'Kontak / 07'],
            ['home', 'contact_cta', 'title', 'Memiliki kebutuhan proyek rekayasa?'],
            ['home', 'contact_cta', 'description', 'Mari diskusikan kebutuhan teknis Anda.'],

            ['about', 'hero', 'eyebrow', 'Perusahaan / 01'],
            ['about', 'hero', 'title', 'Tentang CPS.'],
            ['about', 'hero', 'subtitle', 'Keunggulan rekayasa kelistrikan untuk proyek-proyek menantang.'],
            ['about', 'hero', 'description', 'PT. Citra Protecta Semesta adalah perusahaan rekayasa kelistrikan dan elektronik yang berfokus pada solusi teknis, sistem yang disesuaikan, dan dukungan proyek.'],
            ['about', 'foundation', 'eyebrow', 'Fondasi kami / 02'],
            ['about', 'foundation', 'title', 'Rekayasa dengan tujuan dan presisi.'],
            ['about', 'mission', 'title', 'Misi & visi.'],
            ['about', 'team', 'title', 'Tim di balik presisi.'],
            ['about', 'references', 'title', 'Dipercaya oleh berbagai industri.'],
            ['about', 'cta', 'title', 'Siap bermitra dengan CPS?'],

            ['services', 'hero', 'eyebrow', 'Layanan / 01'],
            ['services', 'hero', 'title', 'Layanan Kami'],
            ['services', 'hero', 'subtitle', 'Solusi Rekayasa Menyeluruh melalui Tiga Divisi Inti'],
            ['services', 'hero', 'description', 'Mulai dari pemeliharaan dan optimalisasi hingga desain dan manufaktur, CPS menghadirkan solusi rekayasa menyeluruh yang andal dan presisi.'],
            ['services', 'divisions', 'title', 'Rekayasa dalam aksi.'],
            ['services', 'delivery', 'title', 'Cara Kami Melaksanakan Proyek'],
            ['services', 'standards', 'title', 'Mengapa Memilih Layanan CPS?'],
            ['services', 'cta', 'title', 'Siap Memulai?'],

            ['projects', 'hero', 'eyebrow', 'Referensi Proyek / 05'],
            ['projects', 'hero', 'title', 'Proyek Pilihan.'],
            ['projects', 'hero', 'description', 'Portofolio solusi rekayasa yang telah dikerjakan untuk perusahaan terkemuka.'],
            ['projects', 'portfolio', 'title', 'Referensi rekayasa.'],
            ['projects', 'scope', 'description', 'Portofolio yang mencakup sistem kelistrikan, proteksi katodik, infrastruktur telekomunikasi, dan pengujian load bank.'],
            ['projects', 'cta', 'title', 'Siap mengerjakan proyek berikutnya?'],
            ['projects', 'industries', 'title', 'Kedalaman teknis untuk lingkungan kritis.'],
            ['projects', 'industries', 'description', 'Kapabilitas rekayasa diterapkan pada industri yang bergantung pada sistem, peralatan, dan infrastruktur yang andal.'],
            ['projects', 'capabilities', 'title', 'Kapabilitas lintas industri.'],
            ['projects', 'capabilities', 'description', 'Keahlian teknis kami mencakup berbagai area layanan dan penerapan industri.'],

            ['contact', 'hero', 'eyebrow', 'Kontak / 01'],
            ['contact', 'hero', 'title', 'Mari diskusikan proyek rekayasa Anda.'],
            ['contact', 'hero', 'description', 'Memiliki kebutuhan teknis? Hubungi tim kami.'],
            ['contact', 'form', 'title', 'Kirim pesan kepada kami'],
            ['contact', 'location', 'title', 'Lokasi kantor'],
            ['contact', 'location', 'description', 'Kunjungi kantor kami di Tangerang.'],

            ['consultation', 'hero', 'eyebrow', 'Konsultasi / 08'],
            ['consultation', 'hero', 'title', 'Ajukan konsultasi.'],
            ['consultation', 'hero', 'description', 'Mari diskusikan kebutuhan proyek rekayasa Anda.'],
            ['consultation', 'form', 'title', 'Bantu kami memahami ruang lingkup proyek.'],
            ['consultation', 'form', 'success_message', 'Permintaan Anda telah kami terima. Tim kami akan menghubungi Anda dalam 24 jam.'],
        ];

        foreach ($contents as $index => [$page, $section, $field, $value]) {
            PageContent::updateOrCreate(
                ['page_key' => $page, 'section_key' => $section, 'field_key' => $field],
                ['field_type' => 'textarea', 'value' => $value, 'sort_order' => $index],
            );
        }
    }
}
