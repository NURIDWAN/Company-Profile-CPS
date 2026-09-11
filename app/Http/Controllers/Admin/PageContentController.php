<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use App\Models\PageMedia;
use App\Support\RichText;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PageContentController extends Controller
{
    private const PAGES = ['home', 'about', 'services', 'projects', 'industries', 'contact', 'consultation'];

    public function index(Request $request): Response
    {
        $page = in_array($request->string('page')->toString(), self::PAGES, true)
            ? $request->string('page')->toString()
            : 'home';

        return Inertia::render('admin/content', [
            'page' => $page,
            'pages' => self::PAGES,
            'contents' => PageContent::where('page_key', $page)->orderBy('sort_order')->get(),
            'media' => PageMedia::where('page_key', $page)->orderBy('sort_order')->get(),
        ]);
    }

    public function updateContent(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'page_key' => ['required', 'in:'.implode(',', self::PAGES)],
            'contents' => ['required', 'array'],
            'contents.*' => ['nullable', 'string', 'max:5000'],
        ]);

        foreach ($validated['contents'] as $key => $value) {
            [$section, $field] = array_pad(explode('.', (string) $key, 2), 2, null);
            if (! $section || ! $field) continue;

            PageContent::updateOrCreate(
                ['page_key' => $validated['page_key'], 'section_key' => $section, 'field_key' => $field],
                [
                    'value' => in_array($field, ['description', 'success_message'], true) ? RichText::sanitize($value) : $value,
                    'field_type' => in_array($field, ['description', 'success_message'], true) ? 'richtext' : 'text',
                ],
            );
        }

        return back()->with('success', 'Website content saved.');
    }

    public function updateMedia(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'page_key' => ['required', 'in:'.implode(',', self::PAGES)],
            'section_key' => ['required', 'string', 'max:80'],
            'media_key' => ['required', 'string', 'max:80'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $media = PageMedia::firstOrNew([
            'page_key' => $validated['page_key'],
            'section_key' => $validated['section_key'],
            'media_key' => $validated['media_key'],
        ]);
        $oldPath = $media->image_path;
        $newPath = $request->hasFile('image') ? $request->file('image')->store('page-media', 'public') : null;

        $media->fill([
            'alt_text' => $validated['alt_text'] ?? null,
            'image_path' => $newPath ?? $media->image_path,
        ])->save();

        if ($newPath && $oldPath) Storage::disk('public')->delete($oldPath);

        return back()->with('success', 'Page media saved.');
    }
}
