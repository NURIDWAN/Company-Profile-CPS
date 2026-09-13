<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Support\RichText;
use App\Support\Seo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/articles', [
            'articles' => Article::query()->orderByDesc('created_at')->get()->map(function (Article $article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'slug' => $article->slug,
                    'status' => $article->status,
                    'published_at' => $article->published_at?->toISOString(),
                    'created_at' => $article->created_at->toISOString(),
                    'cover_url' => $article->cover_url,
                    'has_seo' => (bool) ($article->seo_title && $article->seo_description),
                    'reading_time' => $article->reading_time,
                ];
            }),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePayload($request);

        $article = Article::create([
            ...$this->attributes($request, $validated),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', "Article created. Slug: {$article->slug}");
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $validated = $this->validatePayload($request);

        $attributes = $this->attributes($request, $validated, $article);
        if ($request->boolean('regenerate_slug')) {
            $attributes['slug'] = Seo::slugFrom($validated['title'], $article->id);
        }

        $article->update($attributes);

        return back()->with('success', 'Article updated.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        if ($article->cover_image_path) {
            Storage::disk('public')->delete($article->cover_image_path);
        }

        $article->delete();

        return back()->with('success', 'Article deleted.');
    }

    public function seoPreview(Request $request): array
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['nullable', 'string', 'max:200000'],
        ]);

        return Seo::generateFor(
            $validated['title'],
            $validated['excerpt'] ?? null,
            $validated['content'] ?? null,
        );
    }

    public function uploadImage(Request $request): array
    {
        $validated = $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $path = $request->file('image')->store('articles/content', 'public');

        return ['url' => url(Storage::disk('public')->url($path))];
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'string', 'max:200000'],
            'cover' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'cover_alt' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:draft,published'],
            'published_at' => ['nullable', 'date'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_description' => ['nullable', 'string', 'max:500'],
            'seo_keywords' => ['nullable', 'string', 'max:500'],
        ]);
    }

    private function attributes(Request $request, array $validated, ?Article $existing = null): array
    {
        $newCoverPath = $request->hasFile('cover')
            ? $request->file('cover')->store('articles', 'public')
            : null;

        if ($newCoverPath && $existing?->cover_image_path) {
            Storage::disk('public')->delete($existing->cover_image_path);
        }

        return [
            'title' => $validated['title'],
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => RichText::sanitize($validated['content']) ?? '',
            'cover_image_path' => $newCoverPath ?? $existing?->cover_image_path,
            'cover_alt' => $validated['cover_alt'] ?? null,
            'status' => $validated['status'],
            'published_at' => $validated['published_at'] ?? null,
            'seo_title' => $validated['seo_title'] ?? null,
            'seo_description' => $validated['seo_description'] ?? null,
            'seo_keywords' => $validated['seo_keywords'] ?? null,
        ];
    }
}
