<?php

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
use App\Http\Controllers\PublicPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('robots.txt', function () {
    $robots = str_replace('Sitemap: /sitemap.xml', 'Sitemap: '.url('/sitemap.xml'), file_get_contents(public_path('robots.txt')));

    return response($robots, 200, ['Content-Type' => 'text/plain']);
});

Route::get('sitemap.xml', function () {
    abort_unless(file_exists(public_path('sitemap.xml')), 404);

    return response()->file(public_path('sitemap.xml'), ['Content-Type' => 'application/xml']);
});

// Public company profile pages
$publicPages = [
    '/' => ['page' => 'home', 'name' => 'home'],
    '/about' => ['page' => 'about', 'name' => 'about'],
    '/services' => ['page' => 'services', 'name' => 'services'],
    '/industries' => ['page' => 'industries', 'name' => 'industries'],
    '/projects' => ['page' => 'projects', 'name' => 'projects'],
    '/consultation' => ['page' => 'consultation', 'name' => 'consultation'],
    '/contact' => ['page' => 'contact', 'name' => 'contact'],
];

foreach ($publicPages as $uri => $definition) {
    Route::get($uri, [PublicPageController::class, 'show'])
        ->defaults('page', $definition['page'])
        ->name($definition['name']);
}

Route::post('contact/messages', [ContactMessageController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.messages.store');

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

        Route::get('projects', [ProjectReferenceController::class, 'index'])->name('projects.index');
        Route::post('projects', [ProjectReferenceController::class, 'store'])->name('projects.store');
        Route::put('projects/{reference}', [ProjectReferenceController::class, 'update'])->name('projects.update');
        Route::delete('projects/{reference}', [ProjectReferenceController::class, 'destroy'])->name('projects.destroy');

        Route::resource('gallery', GalleryItemController::class)->except('show')->parameters(['gallery' => 'item']);
        Route::get('content', [PageContentController::class, 'index'])->name('content.index');
        Route::put('content', [PageContentController::class, 'updateContent'])->name('content.update');
        Route::post('content/media', [PageContentController::class, 'updateMedia'])->name('content.media.update');

        Route::get('settings', [SiteSettingController::class, 'edit'])->name('settings.edit');
        Route::put('settings', [SiteSettingController::class, 'update'])->name('settings.update');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
