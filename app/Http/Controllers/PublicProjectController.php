<?php

namespace App\Http\Controllers;

use App\Models\ProjectReference;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class PublicProjectController extends Controller
{
    public function show(ProjectReference $reference): Response
    {
        $settings = SiteSetting::query()->first();
        $canonical = url('/projects/'.$reference->id);
        $imageUrl = $reference->image_url ?? $settings?->og_image_url ?? $settings?->logo_url;

        $projectSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'CreativeWork',
            'name' => $reference->project,
            'description' => $reference->project,
            'url' => $canonical,
            'image' => $reference->image_url,
            'creator' => [
                '@type' => 'Organization',
                'name' => $settings?->site_name ?? 'PT. Citra Protecta Semesta',
                'url' => url('/'),
            ],
            'dateCreated' => $reference->year ? sprintf('%04d-01-01', $reference->year) : null,
        ];

        $breadcrumbSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                ['@type' => 'ListItem', 'position' => 1, 'name' => __('Beranda'), 'item' => url('/')],
                ['@type' => 'ListItem', 'position' => 2, 'name' => __('Proyek'), 'item' => url('/projects')],
                ['@type' => 'ListItem', 'position' => 3, 'name' => $reference->project, 'item' => $canonical],
            ],
        ];

        $related = ProjectReference::query()
            ->where('category', $reference->category)
            ->where('id', '!=', $reference->id)
            ->orderByDesc('year')
            ->orderBy('no')
            ->orderBy('id')
            ->limit(4)
            ->get()
            ->map(fn (ProjectReference $item) => $this->summary($item))
            ->values();

        return Inertia::render('projects/show', [
            'project' => $this->summary($reference),
            'related' => $related,
            'schemas' => [$projectSchema, $breadcrumbSchema],
            'seo' => [
                'title' => $reference->project,
                'description' => __('Referensi proyek :project untuk :client.', [
                    'project' => $reference->project,
                    'client' => $reference->client,
                ]),
                'canonical' => $canonical,
                'ogImage' => $imageUrl,
                'ogType' => 'website',
            ],
        ]);
    }

    private function summary(ProjectReference $reference): array
    {
        return [
            'id' => $reference->id,
            'category' => $reference->category,
            'no' => $reference->no,
            'client' => $reference->client,
            'user' => $reference->user,
            'year' => $reference->year,
            'project' => $reference->project,
            'image_url' => $reference->image_url,
        ];
    }
}
