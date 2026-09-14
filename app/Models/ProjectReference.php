<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProjectReference extends Model
{
    protected $fillable = ['category', 'no', 'client', 'user', 'year', 'project', 'image_path'];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
        ];
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::disk('public')->url($this->image_path) : null;
    }
}
