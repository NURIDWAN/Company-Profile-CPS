<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Support\RichText;
use App\Support\Seo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
                    'excerpt' => $article->excerpt,
                    'content' => $article->content,
                    'cover_url' => $article->cover_url,
                    'cover_alt' => $article->cover_alt,
                    'seo_title' => $article->seo_title,
                    'seo_description' => $article->seo_description,
                    'seo_keywords' => $article->seo_keywords,
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

        return back()->with('success', __('Article created. Slug: :slug', ['slug' => $article->slug]));
    }

    public function update(Request $request, Article $article): RedirectResponse
    {
        $validated = $this->validatePayload($request);

        $article->update($this->attributes($request, $validated, $article));

        return back()->with('success', __('Article updated.'));
    }

    public function destroy(Article $article): RedirectResponse
    {
        if ($article->cover_image_path) {
            Storage::disk('public')->delete($article->cover_image_path);
        }

        $article->delete();

        return back()->with('success', __('Article deleted.'));
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

        return ['url' => '/storage/'.ltrim($path, '/')];
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
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

        $slug = isset($validated['slug']) && $validated['slug'] !== ''
            ? Str::slug($validated['slug']) ?: null
            : null;

        if ($slug && $slug !== $existing?->slug) {
            $conflict = Article::query()
                ->when($existing, fn ($query) => $query->where('id', '!=', $existing->id))
                ->where('slug', $slug)
                ->exists();
            if ($conflict) {
                $slug = Seo::slugFrom($slug, $existing?->id);
            }
        }

        $attributes = [
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

        if ($slug !== null) {
            $attributes['slug'] = $slug;
        }

        return $attributes;
    }
}
