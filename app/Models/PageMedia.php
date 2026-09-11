<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PageMedia extends Model
{
    protected $fillable = [
        'page_key',
        'section_key',
        'media_key',
        'image_path',
        'alt_text',
        'sort_order',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }
}
