<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page_key', 80);
            $table->string('section_key', 80);
            $table->string('field_key', 80);
            $table->string('field_type', 30)->default('text');
            $table->text('value')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['page_key', 'section_key', 'field_key']);
            $table->index(['page_key', 'section_key']);
        });

        Schema::create('page_media', function (Blueprint $table) {
            $table->id();
            $table->string('page_key', 80);
            $table->string('section_key', 80);
            $table->string('media_key', 80);
            $table->string('image_path')->nullable();
            $table->string('alt_text')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['page_key', 'section_key', 'media_key']);
            $table->index(['page_key', 'section_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_media');
        Schema::dropIfExists('page_contents');
    }
};
