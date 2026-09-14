<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $translations = [
            'Engineering & Power System' => 'Rekayasa & Sistem Tenaga',
            'Reliable Engineering For Critical Infrastructure' => 'Rekayasa Andal untuk Infrastruktur Kritis',
            'Explore Services' => 'Jelajahi Layanan',
            'View Projects' => 'Lihat Proyek',
            'Company / 01' => 'Perusahaan / 01',
            'Built around engineering expertise.' => 'Dibangun atas keahlian rekayasa.',
            'Capabilities / 02' => 'Kapabilitas / 02',
            'Engineering in action.' => 'Rekayasa dalam aksi.',
            'Contact / 07' => 'Kontak / 07',
            'Have an engineering project in mind?' => 'Memiliki kebutuhan proyek rekayasa?',
            "Let's discuss your technical requirements." => 'Mari diskusikan kebutuhan teknis Anda.',
            'Our Services' => 'Layanan Kami',
            'Comprehensive Engineering Solutions Across Three Core Divisions' => 'Solusi Rekayasa Menyeluruh melalui Tiga Divisi Inti',
            'How We Deliver' => 'Cara Kami Melaksanakan Proyek',
            'Why Choose CPS Services?' => 'Mengapa Memilih Layanan CPS?',
            'Ready to Get Started?' => 'Siap Memulai?',
            'Project Reference / 05' => 'Referensi Proyek / 05',
            'Selected Projects.' => 'Proyek Pilihan.',
            'Portfolio of engineering solutions delivered to leading companies.' => 'Portofolio solusi rekayasa yang telah dikerjakan untuk perusahaan terkemuka.',
            'Engineering references.' => 'Referensi rekayasa.',
            'Ready to work on your next project?' => 'Siap mengerjakan proyek berikutnya?',
            'Contact / 01' => 'Kontak / 01',
            "Let's discuss your engineering project." => 'Mari diskusikan proyek rekayasa Anda.',
            'Have a technical requirement? Connect with our team.' => 'Memiliki kebutuhan teknis? Hubungi tim kami.',
            'Send us a message' => 'Kirim pesan kepada kami',
            'Office location' => 'Lokasi kantor',
            'Visit us at our Tangerang office.' => 'Kunjungi kantor kami di Tangerang.',
            'Contact / 08' => 'Konsultasi / 08',
            'Request a consultation.' => 'Ajukan konsultasi.',
            "Let's discuss your engineering project requirements." => 'Mari diskusikan kebutuhan proyek rekayasa Anda.',
            'Help us understand the scope.' => 'Bantu kami memahami ruang lingkup proyek.',
            "We've received your request. Our team will contact you within 24 hours." => 'Permintaan Anda telah kami terima. Tim kami akan menghubungi Anda dalam 24 jam.',
        ];

        foreach ($translations as $source => $translation) {
            DB::table('page_contents')->where('value', $source)->update(['value' => $translation]);
        }
    }

    public function down(): void
    {
        // Content may have been edited after migration and must not be overwritten on rollback.
    }
};
