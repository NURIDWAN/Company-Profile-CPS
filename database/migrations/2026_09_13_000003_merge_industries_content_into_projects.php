<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('page_contents')
            ->where('page_key', 'industries')
            ->orderBy('id')
            ->each(function (object $content): void {
                $targetSection = match ($content->section_key) {
                    'sectors' => 'industries',
                    default => $content->section_key,
                };

                $exists = DB::table('page_contents')
                    ->where('page_key', 'projects')
                    ->where('section_key', $targetSection)
                    ->where('field_key', $content->field_key)
                    ->exists();

                if (! $exists) {
                    DB::table('page_contents')->insert([
                        'page_key' => 'projects',
                        'section_key' => $targetSection,
                        'field_key' => $content->field_key,
                        'field_type' => $content->field_type,
                        'value' => $content->value,
                        'sort_order' => $content->sort_order,
                        'created_at' => $content->created_at,
                        'updated_at' => $content->updated_at,
                    ]);
                }
            });

        DB::table('page_media')
            ->where('page_key', 'industries')
            ->orderBy('id')
            ->each(function (object $media): void {
                $exists = DB::table('page_media')
                    ->where('page_key', 'projects')
                    ->where('section_key', $media->section_key)
                    ->where('media_key', $media->media_key)
                    ->exists();

                if (! $exists) {
                    DB::table('page_media')->insert([
                        'page_key' => 'projects',
                        'section_key' => $media->section_key,
                        'media_key' => $media->media_key,
                        'image_path' => $media->image_path,
                        'alt_text' => $media->alt_text,
                        'sort_order' => $media->sort_order,
                        'created_at' => $media->created_at,
                        'updated_at' => $media->updated_at,
                    ]);
                }
            });
    }

    public function down(): void
    {
        // The copied records may have been edited after deployment, so keep them on rollback.
    }
};
