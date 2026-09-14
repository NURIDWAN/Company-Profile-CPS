<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Support\RichText;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DivisionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/divisions', [
            'divisions' => Division::orderBy('sort_order')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'points' => ['nullable', 'array', 'max:12'],
            'points.*' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        Division::create([
            'slug' => Str::slug($validated['name']),
            'name' => $validated['name'],
            'description' => RichText::sanitize($validated['description'] ?? null),
            'points' => array_values(array_filter($validated['points'] ?? [], fn (?string $point): bool => $point !== null && trim($point) !== '')),
            'image_path' => $request->hasFile('image') ? $request->file('image')->store('divisions', 'public') : null,
            'sort_order' => $validated['sort_order'] ?? (int) Division::max('sort_order') + 1,
        ]);

        return back()->with('success', __('Division created.'));
    }

    public function update(Request $request, Division $division): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'points' => ['nullable', 'array', 'max:12'],
            'points.*' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $newImagePath = $request->hasFile('image') ? $request->file('image')->store('divisions', 'public') : null;
        $oldImagePath = $division->image_path;

        $division->update([
            'name' => $validated['name'],
            'description' => RichText::sanitize($validated['description'] ?? null),
            'points' => array_values(array_filter($validated['points'] ?? [], fn (?string $point): bool => $point !== null && trim($point) !== '')),
            'sort_order' => $validated['sort_order'] ?? $division->sort_order,
            'image_path' => $newImagePath ?? $division->image_path,
        ]);

        if ($newImagePath && $oldImagePath) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return back()->with('success', __('Division updated.'));
    }

    public function uploadImage(Request $request): array
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $path = $request->file('image')->store('divisions/content', 'public');

        return ['url' => '/storage/'.ltrim($path, '/')];
    }

    public function destroy(Division $division): RedirectResponse
    {
        if ($division->image_path) {
            Storage::disk('public')->delete($division->image_path);
        }

        $division->delete();

        return back()->with('success', __('Division deleted.'));
    }
}
