<?php

namespace App\Support;

use Illuminate\Support\Str;

final class Seo
{
    private const STOPWORDS = [
        'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'pada', 'adalah', 'ini', 'itu', 'atau', 'juga', 'akan', 'dalam',
        'the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'were', 'has', 'have', 'had', 'not', 'but', 'our',
        'your', 'their', 'its', 'can', 'will', 'into', 'onto', 'per', 'via', 'about', 'more', 'than', 'then', 'them', 'they',
    ];

    public static function slugFrom(string $title, ?int $ignoreId = null, ?\Illuminate\Database\Eloquent\Builder $query = null): string
    {
        $base = Str::slug($title) ?: 'article';
        $slug = $base;
        $suffix = 2;

        $lookup = $query ?? \App\Models\Article::query();
        $pattern = Str::of($base)->replace('-', '%');
        $existing = $lookup
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->whereRaw('slug LIKE ?', ['%'.$pattern.'%'])
            ->pluck('slug');

        while ($existing->contains($slug)) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    public static function metaTitle(string $title): string
    {
        return Str::limit(trim($title), 60);
    }

    public static function metaDescription(?string $excerpt, ?string $htmlContent = null): string
    {
        $source = trim((string) $excerpt);

        if ($source === '' && $htmlContent) {
            $source = trim(preg_replace('/\s+/', ' ', strip_tags($htmlContent)) ?? '');
        }

        return Str::limit($source, 160);
    }

    public static function keywords(string $title, ?string $excerpt = null): string
    {
        $text = strtolower($title.' '.(string) $excerpt);
        preg_match_all('/[a-z0-9]{3,}/', $text, $matches);

        $counts = collect($matches[0] ?? [])
            ->reject(fn (string $word) => in_array($word, self::STOPWORDS, true) || is_numeric($word))
            ->countBy()
            ->sortDesc()
            ->take(6)
            ->keys();

        return $counts->implode(', ');
    }

    /** @return array{slug: string, seo_title: string, seo_description: string, seo_keywords: string} */
    public static function generateFor(string $title, ?string $excerpt, ?string $htmlContent, ?int $ignoreId = null): array
    {
        return [
            'slug' => self::slugFrom($title, $ignoreId),
            'seo_title' => self::metaTitle($title),
            'seo_description' => self::metaDescription($excerpt, $htmlContent),
            'seo_keywords' => self::keywords($title, $excerpt),
        ];
    }
}
