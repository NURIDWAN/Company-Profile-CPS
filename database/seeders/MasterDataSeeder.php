<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\GalleryItem;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProjectReference;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('data.json')), true, 512, JSON_THROW_ON_ERROR);

        DB::transaction(function () use ($data) {
            foreach ($data['divisions'] as $index => $division) {
                Division::updateOrCreate(
                    ['slug' => $division['id']],
                    [
                        'name' => $this->translate($division['name']),
                        'description' => $this->translate($division['description']),
                        'points' => $division['points'] ?? match ($division['id']) {
                            'service-maintenance' => [
                                'Pemantauan & Analisis Energi',
                                'Sistem UPS',
                                'Pemantauan & Manajemen Baterai',
                                'Sistem Charger',
                                'Solusi Inverter',
                                'Sistem Rectifier',
                            ],
                            'design-manufacture' => [
                                'Panel Kelistrikan',
                                'Pemantauan Baterai',
                                'Inverter & Rectifier',
                                'Proteksi Katodik',
                            ],
                            'trading-construction' => [
                                'Pengadaan Peralatan Kelistrikan',
                                'Perdagangan Peralatan Mekanikal',
                                'Sistem Instrumentasi',
                                'Pengadaan Peralatan',
                                'Instalasi Profesional',
                                'Dukungan Lapangan & Komisioning',
                            ],
                            default => [],
                        },
                        'sort_order' => $index,
                    ],
                );
            }

            foreach ($data['productCategories'] as $index => $category) {
                $categoryModel = ProductCategory::updateOrCreate(
                    ['slug' => $category['id']],
                    [
                        'name' => $this->translate($category['name']),
                        'description' => $this->translate($category['description']),
                        'sort_order' => $index,
                    ],
                );

                foreach ($category['products'] as $productIndex => $product) {
                    Product::updateOrCreate(
                        ['product_category_id' => $categoryModel->id, 'name' => $this->translate($product['name'])],
                        [
                            'spec' => isset($product['spec']) ? $this->translate($product['spec']) : null,
                            'sort_order' => $productIndex,
                        ],
                    );
                }
            }

            foreach ($data['projectReferences'] as $category => $references) {
                foreach ($references as $reference) {
                    ProjectReference::updateOrCreate(
                        [
                            'category' => $category === 'cme' ? 'cme' : 'cathodic_protection',
                            'no' => $reference['no'],
                            'client' => $reference['client'],
                            'user' => $reference['user'],
                            'project' => $this->translate($reference['project']),
                        ],
                        [
                            'year' => $reference['year'] ?? null,
                        ],
                    );
                }
            }

            foreach ($data['gallery'] as $index => $item) {
                $category = ProductCategory::where('slug', $item['category'])->first();

                GalleryItem::updateOrCreate(
                    ['caption' => $this->translate($item['caption'])],
                    [
                        'product_category_id' => $category?->id,
                        'project' => isset($item['project']) ? $this->translate($item['project']) : null,
                        'sort_order' => $index,
                    ],
                );
            }

            $company = $data['company'];

            SiteSetting::updateOrCreate(
                ['id' => 1],
                [
                    'site_name' => $company['name'],
                    'tagline' => 'Respons Cepat dan Kualitas Baik adalah komitmen kami dalam melayani',
                    'about' => 'PT. Citra Protecta Semesta adalah perusahaan yang berfokus pada Rekayasa Kelistrikan & Elektronik. Dengan semangat kewirausahaan Indonesia, kami berkomitmen membangun perusahaan dan manufaktur berkelas dunia melalui kreasi serta inovasi dalam sistem kelistrikan dan elektronika daya.',
                    'address_line1' => $company['address']['line1'],
                    'city' => $company['address']['city'],
                    'province' => $company['address']['province'],
                    'postal_code' => $company['address']['postalCode'],
                    'country' => $company['address']['country'],
                    'phones' => $company['contact']['phones'],
                    'fax' => $company['contact']['fax'],
                    'email' => $company['contact']['email'],
                    'website' => $company['contact']['website'],
                    'whatsapp_number' => $company['contact']['phones'][1] ?? null,
                ],
            );
        });
    }

    private function translate(string $value): string
    {
        $phrases = [
            'Quick Response and Good Quality are our commitment to serve' => 'Respons Cepat dan Kualitas Baik adalah komitmen kami dalam melayani',
            'Service and Maintenance Division' => 'Divisi Servis dan Pemeliharaan',
            'Design and Manufacture Division' => 'Divisi Desain dan Manufaktur',
            'Trading and Construction Division' => 'Divisi Perdagangan dan Konstruksi',
            'Cathodic Protection System' => 'Sistem Proteksi Katodik',
            'Load Bank / Dummy Load' => 'Load Bank / Beban Dummy',
            'Supply & Installation' => 'Pengadaan & Instalasi',
            'Supply & Install' => 'Pengadaan & Instalasi',
            'Electrical & Instrument Work' => 'Pekerjaan Kelistrikan & Instrumentasi',
            'Electrical Panel System' => 'Sistem Panel Kelistrikan',
            'Electrical Work' => 'Pekerjaan Kelistrikan',
            'Electrical Panel' => 'Panel Kelistrikan',
            'Distribution Panel' => 'Panel Distribusi',
            'Main Distribution Panel' => 'Panel Distribusi Utama',
            'Sub Distribution Panel' => 'Panel Subdistribusi',
            'Motor Control Center' => 'Pusat Kendali Motor',
            'Genset Synchronizing Panel' => 'Panel Sinkronisasi Genset',
            'Explosion Proof Transformer Rectifier' => 'Transformer Rectifier Tahan Ledakan',
            'Explosion Proof Panel' => 'Panel Tahan Ledakan',
            'Transformer Rectifier' => 'Transformer Rectifier',
            'Power Electronic' => 'Elektronika Daya',
            'Power Plant' => 'Pembangkit Listrik',
            'Power Cable' => 'Kabel Daya',
            'Fire Fighting System' => 'Sistem Pemadam Kebakaran',
            'Fire Fighting Erection' => 'Pemasangan Sistem Pemadam Kebakaran',
            'Fire Alarm System' => 'Sistem Alarm Kebakaran',
            'Underground HDPE Pipe' => 'Pipa HDPE Bawah Tanah',
            'Closed Interval Potential Survey' => 'Survei Potensial Interval Tertutup',
            'Cathodic Protection' => 'Proteksi Katodik',
            'Junction Box' => 'Kotak Sambungan',
            'Test Point' => 'Titik Uji',
            'DC/DC Converter' => 'Konverter DC/DC',
            'Anode Installation' => 'Instalasi Anoda',
            'Anode Testing' => 'Pengujian Anoda',
            'Installation' => 'Instalasi',
            'Maintenance & repair' => 'Pemeliharaan & perbaikan',
            'Maintenance' => 'Pemeliharaan',
            'Repaired' => 'Perbaikan',
            'Repair' => 'Perbaikan',
            'Modification' => 'Modifikasi',
            'Upgrading' => 'Peningkatan',
            'Supply' => 'Pengadaan',
            'Install' => 'Instalasi',
            'Assembling' => 'Perakitan',
            'Synchronizing' => 'Sinkronisasi',
            'Syncronizing genset' => 'Sinkronisasi genset',
            'Syncronizing' => 'Sinkronisasi',
            'Anode Diving Installation' => 'Instalasi Penyelaman Anoda',
            'Check Anode' => 'Pemeriksaan Anoda',
            'Test Anode' => 'Uji Anoda',
            'Check' => 'Pemeriksaan',
            'Test ' => 'Uji ',
            'CME Work' => 'Pekerjaan CME',
            'Civil Work' => 'Pekerjaan Sipil',
            'HDPE Work' => 'Pekerjaan HDPE',
            'Solar Cell Panel' => 'Panel Sel Surya',
            'Electrical' => 'Kelistrikan',
            'Mechanical' => 'Mekanikal',
            'Instrument' => 'Instrumentasi',
            'System' => 'Sistem',
            'Panel' => 'Panel',
            'Switchboard' => 'Papan Hubung',
            'Switchgear' => 'Switchgear',
            'Sprinkler System' => 'Sistem Sprinkler',
            'CO2 System' => 'Sistem CO2',
            'Load Bank' => 'Load Bank',
            'Dummy Load' => 'Beban Dummy',
            'Battery Load Test' => 'Uji Beban Baterai',
            'Genset Load Test' => 'Uji Beban Genset',
            'Indoor Type' => 'Tipe Dalam Ruangan',
            'Mobile Type' => 'Tipe Bergerak',
            'Mobile / Fixed' => 'Bergerak / Tetap',
            'for Battery' => 'untuk Baterai',
            'for Genset' => 'untuk Genset',
            'for Ship Pipe' => 'untuk Pipa Kapal',
            'on Ship Hull' => 'pada Lambung Kapal',
            'at Jetty' => 'di Dermaga',
            'Power Supply' => 'Catu Daya',
            'Control' => 'Kendali',
            'Grounding' => 'Pentanahan',
            'Lightning Protection System' => 'Sistem Proteksi Petir',
            'Protection System' => 'Sistem Proteksi',
            'Office' => 'Kantor',
            'Floor' => 'Lantai',
            'Basement' => 'Ruang Bawah Tanah',
            'Area' => 'Area',
            'National Area' => 'Area Nasional',
            'Work' => 'Pekerjaan',
            'Set' => 'Set',
            'unit' => 'unit',
            'and ' => 'dan ',
            ' of ' => ' dari ',
            ' from ' => ' dari ',
            ' for ' => ' untuk ',
            ' at ' => ' di ',
            ' on ' => ' pada ',
            ' (alternate view)' => ' (tampilan alternatif)',
            ' (Indoor Type)' => ' (Tipe Dalam Ruangan)',
            ' (Mobile Type)' => ' (Tipe Bergerak)',
            ' - ' => ' - ',
        ];

        return strtr($value, $phrases);
    }
}
