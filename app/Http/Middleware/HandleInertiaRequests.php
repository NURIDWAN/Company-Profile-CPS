<?php

namespace App\Http\Middleware;

use App\Models\Division;
use App\Models\GalleryItem;
use App\Models\PageContent;
use App\Models\PageMedia;
use App\Models\ProductCategory;
use App\Models\ProjectReference;
use App\Models\SiteSetting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
            'siteSettings' => fn () => SiteSetting::select([
                'site_name', 'tagline', 'about',
'address_line1', 'city', 'province', 'postal_code', 'country',
                 'phones', 'fax', 'email', 'website', 'whatsapp_number', 'whatsapp_message',
                 'logo_path', 'logo_url', 'map_embed_url',
                 'seo_title', 'seo_description', 'social_facebook', 'social_instagram',
                 'social_linkedin', 'social_youtube', 'og_image_path', 'og_image_url',
            ])->first(),
            'publicContent' => fn () => PageContent::query()
                ->orderBy('sort_order')
                ->get()
                ->mapWithKeys(fn (PageContent $content) => [
                    "{$content->page_key}.{$content->section_key}.{$content->field_key}" => $content->value,
                ]),
            'publicMedia' => fn () => PageMedia::query()
                ->orderBy('sort_order')
                ->get()
                ->mapWithKeys(fn (PageMedia $media) => [
                    "{$media->page_key}.{$media->section_key}.{$media->media_key}" => $media,
                ]),
            'publicData' => fn () => [
                'divisions' => Division::query()->orderBy('sort_order')->get(),
                'productCategories' => ProductCategory::query()
                    ->with(['products' => fn ($query) => $query->orderBy('sort_order')])
                    ->orderBy('sort_order')
                    ->get(),
                'projectReferences' => [
                    'cme' => ProjectReference::query()->where('category', 'cme')->orderBy('no')->get(),
                    'cathodicProtection' => ProjectReference::query()
                        ->where('category', 'cathodic_protection')
                        ->orderBy('no')
                        ->get(),
                ],
                'gallery' => GalleryItem::query()->with('category')->orderBy('sort_order')->get(),
            ],
        ]);
    }
}
