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
use Illuminate\Support\Str;

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
                        'name' => $division['name'],
                        'description' => $division['description'],
                        'points' => $division['points'] ?? match ($division['id']) {
                            'service-maintenance' => [
                                'Energy Monitoring & Analysis',
                                'UPS Systems',
                                'Battery Monitoring & Management',
                                'Charger Systems',
                                'Inverter Solutions',
                                'Rectifier Systems',
                            ],
                            'design-manufacture' => [
                                'Electrical Panel',
                                'Battery Monitoring',
                                'Inverter & Rectifier',
                                'Cathodic Protection',
                            ],
                            'trading-construction' => [
                                'Electrical Equipment Supply',
                                'Mechanical Equipment Trading',
                                'Instrumentation Systems',
                                'Equipment Procurement',
                                'Professional Installation',
                                'Site Support & Commissioning',
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
                        'name' => $category['name'],
                        'description' => $category['description'],
                        'sort_order' => $index,
                    ],
                );

                foreach ($category['products'] as $productIndex => $product) {
                    Product::updateOrCreate(
                        ['product_category_id' => $categoryModel->id, 'name' => $product['name']],
                        [
                            'spec' => $product['spec'] ?? null,
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
                            'project' => $reference['project'],
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
                    ['caption' => $item['caption']],
                    [
                        'product_category_id' => $category?->id,
                        'project' => $item['project'] ?? null,
                        'sort_order' => $index,
                    ],
                );
            }

            $company = $data['company'];

            SiteSetting::updateOrCreate(
                ['id' => 1],
                [
                    'site_name' => $company['name'],
                    'tagline' => $company['tagline'],
                    'about' => $company['about'],
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
}
