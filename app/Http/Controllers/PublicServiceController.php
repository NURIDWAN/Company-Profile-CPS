<?php

namespace App\Http\Controllers;

use App\Models\Division;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class PublicServiceController extends Controller
{
    public function show(Division $division): Response
    {
        $settings = SiteSetting::query()->first();
        $canonical = url('/services/'.$division->slug);
        $imageUrl = $division->image_url ?? $settings?->og_image_url ?? $settings?->logo_url;

        $serviceSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'Service',
            'name' => $division->name,
            'description' => strip_tags((string) $division->description),
            'url' => $canonical,
            'image' => $division->image_url,
            'provider' => [
                '@type' => 'Organization',
                'name' => $settings?->site_name ?? 'PT. Citra Protecta Semesta',
                'url' => url('/'),
            ],
        ];

        $breadcrumbSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                ['@type' => 'ListItem', 'position' => 1, 'name' => __('Beranda'), 'item' => url('/')],
                ['@type' => 'ListItem', 'position' => 2, 'name' => __('Layanan'), 'item' => url('/services')],
                ['@type' => 'ListItem', 'position' => 3, 'name' => $division->name, 'item' => $canonical],
            ],
        ];

        $related = Division::query()
            ->where('id', '!=', $division->id)
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Division $item) => [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'description' => $item->description,
                'image_url' => $item->image_url,
            ])
            ->values();

        return Inertia::render('services/show', [
            'service' => [
                'id' => $division->id,
                'name' => $division->name,
                'slug' => $division->slug,
                'description' => $division->description,
                'points' => $division->points ?? [],
                'image_url' => $division->image_url,
            ],
            'related' => $related,
            'schemas' => [$serviceSchema, $breadcrumbSchema],
            'seo' => [
                'title' => $division->name,
                'description' => strip_tags((string) $division->description),
                'canonical' => $canonical,
                'ogImage' => $imageUrl,
                'ogType' => 'website',
            ],
        ]);
    }
}
