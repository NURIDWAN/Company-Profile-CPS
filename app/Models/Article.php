<?php

namespace App\Models;

use App\Support\Seo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Article extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image_path',
        'cover_alt',
        'status',
        'published_at',
        'seo_title',
        'seo_description',
        'seo_keywords',
    ];

    protected $appends = ['cover_url', 'reading_time'];

    protected static function booted(): void
    {
        static::creating(function (self $article) {
            $article->slug ??= Seo::slugFrom($article->title);
            $article->seo_title ??= Seo::metaTitle($article->title);
            $article->seo_description ??= Seo::metaDescription($article->excerpt, $article->content);
            $article->seo_keywords ??= Seo::keywords($article->title, $article->excerpt);
            if ($article->status === 'published' && $article->published_at === null) {
                $article->published_at = now();
            }
        });

        static::updating(function (self $article) {
            $article->seo_title ??= Seo::metaTitle($article->title);
            $article->seo_description ??= Seo::metaDescription($article->excerpt, $article->content);
            $article->seo_keywords ??= Seo::keywords($article->title, $article->excerpt);
            if ($article->status === 'published' && $article->published_at === null) {
                $article->published_at = now();
            }
        });
    }

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getRouteKey(): string
    {
        return $this->slug;
    }

    public function resolveRouteBinding($value, $field = null): ?Model
    {
        $field ??= $this->getRouteKeyName();

        if ($field === 'slug' && ctype_digit((string) $value)) {
            $field = 'id';
        }

        return $this->where($field, $value)->first();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getCoverUrlAttribute(): ?string
    {
        return $this->cover_image_path ? url(Storage::disk('public')->url($this->cover_image_path)) : null;
    }

    public function getReadingTimeAttribute(): int
    {
        return max(1, (int) ceil(str_word_count(strip_tags((string) $this->content)) / 200));
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')->where('published_at', '<=', now());
    }

    public function excerptOrGenerated(): string
    {
        if ($this->excerpt) {
            return $this->excerpt;
        }

        return Str::limit(trim(preg_replace('/\s+/', ' ', strip_tags((string) $this->content)) ?? ''), 160);
    }
}
