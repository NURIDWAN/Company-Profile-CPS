<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->first();
        $coverPath = 'articles/memahami-sistem-proteksi-katodik-hero.svg';

        Storage::disk('public')->put($coverPath, <<<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">Sistem Proteksi Katodik</title>
  <desc id="desc">Ilustrasi abstrak sistem proteksi katodik dengan jaringan pipa dan aliran energi.</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#071521"/>
      <stop offset="0.55" stop-color="#0b2631"/>
      <stop offset="1" stop-color="#123f46"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#4de1d2" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#4de1d2" stop-opacity="0.8"/>
      <stop offset="1" stop-color="#4de1d2" stop-opacity="0"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1600" height="900" fill="url(#background)"/>
  <circle cx="1320" cy="170" r="210" fill="#4de1d2" opacity="0.16" filter="url(#blur)"/>
  <circle cx="270" cy="760" r="230" fill="#2b93a0" opacity="0.16" filter="url(#blur)"/>
  <g fill="none" stroke="#4de1d2" stroke-linecap="round">
    <path d="M-80 620 C220 430 410 790 700 580 S1160 300 1680 490" stroke-width="18" opacity="0.32"/>
    <path d="M-80 620 C220 430 410 790 700 580 S1160 300 1680 490" stroke-width="3" opacity="0.95"/>
    <path d="M-100 710 C180 520 430 850 740 650 S1190 390 1700 560" stroke-width="2" opacity="0.55"/>
    <path d="M180 80 L180 820 M420 160 L420 700 M1180 100 L1180 600 M1400 60 L1400 760" stroke-width="1" opacity="0.22"/>
  </g>
  <g fill="#d7fff7">
    <circle cx="700" cy="580" r="9"/><circle cx="1160" cy="340" r="9"/><circle cx="420" cy="690" r="7"/>
  </g>
  <rect y="760" width="1600" height="3" fill="url(#glow)"/>
</svg>
SVG);

        Article::updateOrCreate(
            ['slug' => 'memahami-sistem-proteksi-katodik'],
            [
                'user_id' => $user?->id,
                'title' => 'Memahami Sistem Proteksi Katodik',
                'excerpt' => 'Panduan singkat mengenai cara kerja proteksi katodik untuk membantu menjaga jaringan pipa dan aset industri dari korosi.',
                'content' => <<<'HTML'
<h2>Mengapa proteksi katodik penting?</h2>
<p>Proteksi katodik membantu mengurangi risiko korosi pada jaringan pipa, tangki, dan aset logam lain yang beroperasi di lingkungan industri.</p>
<h2>Bagaimana sistem bekerja?</h2>
<p>Sistem ini mengendalikan reaksi elektrokimia pada permukaan logam dengan menggunakan transformer rectifier, anoda, junction box, serta titik uji yang sesuai dengan kebutuhan lapangan.</p>
<p>Perencanaan, pemasangan, pengukuran, dan pemeliharaan yang tepat membantu menjaga keandalan aset dalam jangka panjang.</p>
HTML,
                'cover_image_path' => $coverPath,
                'cover_alt' => 'Ilustrasi sistem proteksi katodik di fasilitas industri',
                'status' => 'published',
                'published_at' => now(),
                'seo_title' => 'Memahami Sistem Proteksi Katodik | CPS',
                'seo_description' => 'Pelajari dasar sistem proteksi katodik dan manfaatnya untuk menjaga aset industri dari risiko korosi.',
                'seo_keywords' => 'proteksi katodik, transformer rectifier, korosi, infrastruktur industri',
            ],
        );
    }
}
