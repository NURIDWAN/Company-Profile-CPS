<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Support\RichText;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

        return back()->with('success', 'Category created.');
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

        return back()->with('success', 'Category updated.');
    }

    public function destroy(ProductCategory $category): RedirectResponse
    {
        $category->delete();

        return back()->with('success', 'Category deleted.');
    }

    public function storeProduct(Request $request, ProductCategory $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'spec' => 'nullable|string|max:255',
        ]);

        Product::create([
            'product_category_id' => $category->id,
            'name' => $validated['name'],
            'spec' => $validated['spec'] ?? null,
            'sort_order' => (int) $category->products()->max('sort_order') + 1,
        ]);

        return back()->with('success', 'Product created.');
    }

    public function updateProduct(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'spec' => 'nullable|string|max:255',
        ]);

        $product->update([
            'name' => $validated['name'],
            'spec' => $validated['spec'] ?? null,
        ]);

        return back()->with('success', 'Product updated.');
    }

    public function destroyProduct(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Product deleted.');
    }
}
