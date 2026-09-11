<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('seo_title')->nullable()->after('map_embed_url');
            $table->text('seo_description')->nullable()->after('seo_title');
            $table->string('social_facebook')->nullable()->after('seo_description');
            $table->string('social_instagram')->nullable()->after('social_facebook');
            $table->string('social_linkedin')->nullable()->after('social_instagram');
            $table->string('social_youtube')->nullable()->after('social_linkedin');
            $table->string('og_image_path')->nullable()->after('social_youtube');
        });
    }

    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn([
                'seo_title',
                'seo_description',
                'social_facebook',
                'social_instagram',
                'social_linkedin',
                'social_youtube',
                'og_image_path',
            ]);
        });
    }
};
