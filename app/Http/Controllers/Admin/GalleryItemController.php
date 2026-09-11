<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryItemController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/gallery', [
            'items' => GalleryItem::with('category')->orderBy('sort_order')->get(),
            'categories' => ProductCategory::orderBy('sort_order')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_category_id' => 'nullable|exists:product_categories,id',
            'caption' => 'required|string|max:255',
            'project' => 'nullable|string|max:255',
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $imagePath = $request->file('image')->store('gallery', 'public');

        GalleryItem::create([
            'product_category_id' => $validated['product_category_id'] ?? null,
            'caption' => $validated['caption'],
            'project' => $validated['project'] ?? null,
            'image_path' => $imagePath,
            'sort_order' => (int) GalleryItem::max('sort_order') + 1,
        ]);

        return back()->with('success', 'Gallery item created.');
    }

    public function update(Request $request, GalleryItem $item): RedirectResponse
    {
        $validated = $request->validate([
            'product_category_id' => 'nullable|exists:product_categories,id',
            'caption' => 'required|string|max:255',
            'project' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $oldImagePath = $item->image_path;
        $newImagePath = $request->hasFile('image')
            ? $request->file('image')->store('gallery', 'public')
            : null;

        $item->update([
            'product_category_id' => $validated['product_category_id'] ?? null,
            'caption' => $validated['caption'],
            'project' => $validated['project'] ?? null,
            ...($newImagePath ? ['image_path' => $newImagePath] : []),
        ]);

        if ($newImagePath && $oldImagePath) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return back()->with('success', 'Gallery item updated.');
    }

    public function destroy(GalleryItem $item): RedirectResponse
    {
        if ($item->image_path) {
            Storage::disk('public')->delete($item->image_path);
        }

        $item->delete();

        return back()->with('success', 'Gallery item deleted.');
    }
}
