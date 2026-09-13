<?php

namespace App\Models;

use App\Support\RichText;
use App\Support\Seo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = ['product_category_id', 'name', 'slug', 'spec', 'description', 'image_path', 'sort_order'];

    protected $appends = ['image_url'];

    protected static function booted(): void
    {
        static::creating(function (self $product) {
            $product->slug ??= Seo::slugFrom(
                $product->name,
                null,
                Product::query()->select('id', 'slug'),
            );
        });

        static::saving(function (self $product) {
            $product->description = RichText::sanitize($product->description);
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function resolveRouteBinding($value, $field = null): ?Model
    {
        if ($field !== null) {
            return $this->where($field, $value)->first();
        }

        return $this->where('slug', $value)->orWhere($this->getKeyName(), $value)->first();
    }
}
