<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Division extends Model
{
    protected $fillable = ['slug', 'name', 'description', 'points', 'image_path', 'sort_order'];

    protected $casts = [
        'points' => 'array',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }
}
