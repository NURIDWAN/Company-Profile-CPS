<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $settings = SiteSetting::query()->first();

        $articles = Article::query()
            ->published()
            ->orderByDesc('published_at')
            ->paginate(9)
            ->withQueryString()
            ->through(fn (Article $article) => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerptOrGenerated(),
                'cover_url' => $article->cover_url,
                'cover_alt' => $article->cover_alt,
                'published_at' => $article->published_at?->toISOString(),
                'reading_time' => $article->reading_time,
            ]);

        return Inertia::render('articles/index', [
            'articles' => $articles,
            'seo' => [
                'title' => __('Articles & Engineering Insights'),
                'description' => __('Read engineering articles, technical guides, and industry insights from PT. Citra Protecta Semesta.'),
                'canonical' => url('/articles'),
                'ogImage' => $settings?->og_image_url ?? $settings?->logo_url,
                'ogType' => 'website',
            ],
        ]);
    }

    public function show(Article $article): Response
    {
        abort_unless($article->status === 'published' && $article->published_at !== null && $article->published_at->lte(now()), 404);

        $settings = SiteSetting::query()->first();
        $canonical = url('/articles/'.$article->slug);
        $coverUrl = $article->cover_url ?? $settings?->og_image_url ?? $settings?->logo_url;

        $articleSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $article->seo_title ?? $article->title,
            'description' => $article->seo_description ?? $article->excerptOrGenerated(),
            'datePublished' => $article->published_at?->toIso8601String(),
            'dateModified' => $article->updated_at->toIso8601String(),
            'image' => $coverUrl,
            'mainEntityOfPage' => $canonical,
            'author' => [
                '@type' => 'Organization',
                'name' => $settings?->site_name ?? 'PT. Citra Protecta Semesta',
            ],
            'publisher' => [
                '@type' => 'Organization',
                'name' => $settings?->site_name ?? 'PT. Citra Protecta Semesta',
                'logo' => ['@type' => 'ImageObject', 'url' => $settings?->logo_url],
            ],
            'keywords' => $article->seo_keywords,
        ];

        $breadcrumbSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                ['@type' => 'ListItem', 'position' => 1, 'name' => __('Home'), 'item' => url('/')],
                ['@type' => 'ListItem', 'position' => 2, 'name' => __('Articles'), 'item' => url('/articles')],
                ['@type' => 'ListItem', 'position' => 3, 'name' => $article->title, 'item' => $canonical],
            ],
        ];

        return Inertia::render('articles/show', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerptOrGenerated(),
                'content' => $article->content,
                'cover_url' => $article->cover_url,
                'cover_alt' => $article->cover_alt,
                'published_at' => $article->published_at?->toISOString(),
                'reading_time' => $article->reading_time,
                'seo_keywords' => $article->seo_keywords,
            ],
            'seo' => [
                'title' => $article->seo_title ?? $article->title,
                'description' => $article->seo_description ?? $article->excerptOrGenerated(),
                'canonical' => $canonical,
                'ogImage' => $coverUrl,
                'ogType' => 'article',
            ],
            'schemas' => [$articleSchema, $breadcrumbSchema],
        ]);
    }
}
