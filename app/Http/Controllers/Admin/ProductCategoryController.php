<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Support\RichText;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/categories', [
            'categories' => ProductCategory::with('products')->orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        ProductCategory::create([
            'slug' => Str::slug($validated['name']),
            'name' => $validated['name'],
            'description' => RichText::sanitize($validated['description'] ?? null),
            'sort_order' => (int) ProductCategory::max('sort_order') + 1,
        ]);

        return back()->with('success', __('Category created.'));
    }

    public function update(Request $request, ProductCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update([
            'name' => $validated['name'],
            'description' => RichText::sanitize($validated['description'] ?? null),
        ]);

        return back()->with('success', __('Category updated.'));
    }

    public function destroy(ProductCategory $category): RedirectResponse
    {
        $category->delete();

        return back()->with('success', __('Category deleted.'));
    }

    public function storeProduct(Request $request, ProductCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'spec' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:200000'],
        ]);

        Product::create([
            'product_category_id' => $category->id,
            'name' => $validated['name'],
            'spec' => $validated['spec'] ?? null,
            'description' => $validated['description'] ?? null,
            'sort_order' => (int) $category->products()->max('sort_order') + 1,
        ]);

        return back()->with('success', __('Product created.'));
    }

    public function updateProduct(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'spec' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:200000'],
        ]);

        $product->update([
            'name' => $validated['name'],
            'spec' => $validated['spec'] ?? null,
            'description' => $validated['description'] ?? null,
        ]);

        return back()->with('success', __('Product updated.'));
    }

    public function destroyProduct(Product $product): RedirectResponse
    {
        if ($product->image_path) {
            Storage::disk('public')->delete($product->image_path);
        }

        $product->delete();

        return back()->with('success', __('Product deleted.'));
    }

    public function uploadImage(Request $request): array
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $path = $request->file('image')->store('products/content', 'public');

        return ['url' => '/storage/'.ltrim($path, '/')];
    }
}
