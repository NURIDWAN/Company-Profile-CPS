<?php

use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('name');
            $table->text('description')->nullable()->after('spec');
            $table->string('image_path')->nullable()->after('description');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->unique('slug');
        });

        Product::query()->orderBy('id')->get()->each(function (Product $product) {
            $product->forceFill(['slug' => Str::slug($product->name)])->save();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn(['slug', 'description', 'image_path']);
        });
    }
};
