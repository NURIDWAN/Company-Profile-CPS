<?php

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CrmController;
use App\Http\Controllers\Admin\DivisionController;
use App\Http\Controllers\Admin\GalleryItemController;
use App\Http\Controllers\Admin\PageContentController;
use App\Http\Controllers\Admin\ProductCategoryController;
use App\Http\Controllers\Admin\ProjectReferenceController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicArticleController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\PublicProductController;
use App\Http\Controllers\PublicServiceController;
use App\Models\Article;
use App\Models\Division;
use App\Models\Product;
use Illuminate\Support\Facades\Route;

Route::get('robots.txt', function () {
    $robots = str_replace('Sitemap: /sitemap.xml', 'Sitemap: '.url('/sitemap.xml'), file_get_contents(public_path('robots.txt')));

    return response($robots, 200, ['Content-Type' => 'text/plain']);
});

Route::get('sitemap.xml', function () {
    $pages = ['/', '/about', '/services', '/projects', '/consultation', '/contact', '/articles', '/products'];
    $articleUrls = Article::query()
        ->published()
        ->orderByDesc('published_at')
        ->get()
        ->map(fn (Article $article) => [
            'loc' => url('/articles/'.$article->slug),
            'lastmod' => $article->updated_at->toAtomString(),
        ]);
    $productUrls = Product::query()
        ->orderBy('id')
        ->get()
        ->map(fn (Product $product) => [
            'loc' => url('/products/'.$product->slug),
            'lastmod' => $product->updated_at->toAtomString(),
        ]);
    $serviceUrls = Division::query()
        ->orderBy('sort_order')
        ->get()
        ->map(fn (Division $division) => [
            'loc' => url('/services/'.$division->slug),
            'lastmod' => $division->updated_at->toAtomString(),
        ]);

    $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
    foreach ($pages as $page) {
        $xml .= '    <url><loc>'.url($page).'</loc></url>'."\n";
    }
    foreach ([...$articleUrls, ...$productUrls, ...$serviceUrls] as $entry) {
        $xml .= '    <url><loc>'.$entry['loc'].'</loc><lastmod>'.$entry['lastmod'].'</lastmod></url>'."\n";
    }
    $xml .= '</urlset>'."\n";

    return response($xml, 200, ['Content-Type' => 'application/xml']);
});

// Public company profile pages
$publicPages = [
    '/' => ['page' => 'home', 'name' => 'home'],
    '/about' => ['page' => 'about', 'name' => 'about'],
    '/services' => ['page' => 'services', 'name' => 'services'],
    '/projects' => ['page' => 'projects', 'name' => 'projects'],
    '/consultation' => ['page' => 'consultation', 'name' => 'consultation'],
    '/contact' => ['page' => 'contact', 'name' => 'contact'],
];

foreach ($publicPages as $uri => $definition) {
    Route::get($uri, [PublicPageController::class, 'show'])
        ->defaults('page', $definition['page'])
        ->name($definition['name']);
}

Route::redirect('/industries', '/projects#industries', 301)->name('industries');

Route::post('contact/messages', [ContactMessageController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.messages.store');

// Public articles
Route::get('articles', [PublicArticleController::class, 'index'])->name('articles.index');
Route::get('articles/{article:slug}', [PublicArticleController::class, 'show'])->name('articles.show');

// Public products
Route::get('products', [PublicProductController::class, 'index'])->name('products.index');
Route::get('products/{product}', [PublicProductController::class, 'show'])->name('products.show');

// Public service details
Route::get('services/{division:slug}', [PublicServiceController::class, 'show'])->name('services.show');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::patch('crm/{message}/status', [CrmController::class, 'updateStatus'])->name('crm.status.update');
        Route::get('crm', [CrmController::class, 'index'])->name('crm.index');
        Route::resource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::get('projects/stats', [ProjectReferenceController::class, 'stats'])->name('projects.stats');

        Route::resource('divisions', DivisionController::class)->except('show');
        Route::resource('categories', ProductCategoryController::class)->except('show');
        Route::post('categories/{category}/products', [ProductCategoryController::class, 'storeProduct'])
            ->name('categories.products.store');
        Route::put('products/{product}', [ProductCategoryController::class, 'updateProduct'])->name('products.update');
        Route::delete('products/{product}', [ProductCategoryController::class, 'destroyProduct'])->name('products.destroy');
        Route::post('products/upload-image', [ProductCategoryController::class, 'uploadImage'])->name('products.upload-image');

        Route::get('projects', [ProjectReferenceController::class, 'index'])->name('projects.index');
        Route::post('projects', [ProjectReferenceController::class, 'store'])->name('projects.store');
        Route::put('projects/{reference}', [ProjectReferenceController::class, 'update'])->name('projects.update');
        Route::delete('projects/{reference}', [ProjectReferenceController::class, 'destroy'])->name('projects.destroy');

        Route::resource('gallery', GalleryItemController::class)->except('show')->parameters(['gallery' => 'item']);

        Route::post('articles/seo-preview', [ArticleController::class, 'seoPreview'])->name('articles.seo-preview');
        Route::post('articles/upload-image', [ArticleController::class, 'uploadImage'])->name('articles.upload-image');
        Route::resource('articles', ArticleController::class)->except('show');

        Route::get('content', [PageContentController::class, 'index'])->name('content.index');
        Route::put('content', [PageContentController::class, 'updateContent'])->name('content.update');
        Route::post('content/media', [PageContentController::class, 'updateMedia'])->name('content.media.update');

        Route::get('settings', [SiteSettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [SiteSettingController::class, 'update'])->name('settings.update');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
