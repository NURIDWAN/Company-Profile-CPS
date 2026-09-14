<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class PublicProductController extends Controller
{
    public function index(): Response
    {
        $settings = SiteSetting::query()->first();

        $categories = ProductCategory::query()
            ->with(['products' => fn ($query) => $query->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get()
            ->map(fn (ProductCategory $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'products' => $category->products->map(fn (Product $product) => $this->summary($product)),
            ]);

        return Inertia::render('products/index', [
            'categories' => $categories,
            'seo' => [
                'title' => __('Our Products'),
                'description' => __('Explore CPS engineering products across cathodic protection, electrical, and electronic systems.'),
                'canonical' => url('/products'),
                'ogImage' => $settings?->og_image_url ?? $settings?->logo_url,
                'ogType' => 'website',
            ],
        ]);
    }

    public function show(Product $product): Response
    {
        $settings = SiteSetting::query()->first();
        $canonical = url('/products/'.$product->slug);
        $imageUrl = $product->image_url ?? $settings?->og_image_url ?? $settings?->logo_url;

        $productSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $product->name,
            'description' => $product->spec ?? strip_tags((string) $product->description) ?: null,
            'image' => $product->image_url,
            'sku' => (string) $product->id,
            'brand' => [
                '@type' => 'Brand',
                'name' => $settings?->site_name ?? 'PT. Citra Protecta Semesta',
            ],
        ];

        $breadcrumbSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                ['@type' => 'ListItem', 'position' => 1, 'name' => __('Home'), 'item' => url('/')],
                ['@type' => 'ListItem', 'position' => 2, 'name' => __('Products'), 'item' => url('/products')],
                ['@type' => 'ListItem', 'position' => 3, 'name' => $product->name, 'item' => $canonical],
            ],
        ];

        return Inertia::render('products/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'spec' => $product->spec,
                'description' => $product->description,
                'image_url' => $product->image_url,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug,
                ] : null,
            ],
            'related' => $product->category
                ? $product->category->products
                    ->where('id', '!=', $product->id)
                    ->take(4)
                    ->map(fn (Product $related) => $this->summary($related))
                    ->values()
                : [],
            'schemas' => [$productSchema, $breadcrumbSchema],
            'seo' => [
                'title' => $product->name,
                'description' => $product->spec ?? __('Learn more about :name from PT. Citra Protecta Semesta.', ['name' => $product->name]),
                'canonical' => $canonical,
                'ogImage' => $imageUrl,
                'ogType' => 'product',
            ],
        ]);
    }

    private function summary(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'spec' => $product->spec,
            'image_url' => $product->image_url,
        ];
    }
}
