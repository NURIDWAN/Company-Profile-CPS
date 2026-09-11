<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SiteSetting extends Model
{
    protected $fillable = [
        'site_name',
        'tagline',
        'about',
        'address_line1',
        'city',
        'province',
        'postal_code',
        'country',
        'phones',
        'fax',
        'email',
        'website',
        'whatsapp_number',
        'whatsapp_message',
        'logo_path',
        'map_embed_url',
        'seo_title',
        'seo_description',
        'social_facebook',
        'social_instagram',
        'social_linkedin',
        'social_youtube',
        'og_image_path',
    ];

    protected $appends = ['logo_url', 'og_image_url'];

    protected function casts(): array
    {
        return [
            'phones' => 'array',
        ];
    }

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? url(Storage::disk('public')->url($this->logo_path)) : null;
    }

    public function getOgImageUrlAttribute(): ?string
    {
        return $this->og_image_path ? url(Storage::disk('public')->url($this->og_image_path)) : null;
    }
}
