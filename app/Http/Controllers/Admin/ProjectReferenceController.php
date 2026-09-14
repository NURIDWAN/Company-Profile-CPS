<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectReference;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProjectReferenceController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->string('category', 'cme')->toString();

        return Inertia::render('admin/projects', [
            'category' => in_array($category, ['cme', 'cathodic_protection']) ? $category : 'cme',
            'references' => fn () => ProjectReference::query()
                ->when(in_array($category, ['cme', 'cathodic_protection']), fn ($q) => $q->where('category', $category))
                ->orderBy('category')
                ->orderBy('no')
                ->orderBy('id')
                ->paginate(50)
                ->withQueryString(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:cme,cathodic_protection',
            'no' => 'required|integer|min:1',
            'client' => 'required|string|max:255',
            'user' => 'required|string|max:255',
            'year' => 'nullable|integer|min:1970|max:2100',
            'project' => 'required|string|max:500',
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        ProjectReference::create($this->attributes($request, $validated));

        return back()->with('success', __('Project reference created.'));
    }

    public function update(Request $request, ProjectReference $reference): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:cme,cathodic_protection',
            'no' => 'required|integer|min:1',
            'client' => 'required|string|max:255',
            'user' => 'required|string|max:255',
            'year' => 'nullable|integer|min:1970|max:2100',
            'project' => 'required|string|max:500',
            'image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
        ]);

        $reference->update($this->attributes($request, $validated, $reference));

        return back()->with('success', __('Project reference updated.'));
    }

    public function destroy(ProjectReference $reference): RedirectResponse
    {
        if ($reference->image_path) {
            Storage::disk('public')->delete($reference->image_path);
        }

        $reference->delete();

        return back()->with('success', __('Project reference deleted.'));
    }

    private function attributes(Request $request, array $validated, ?ProjectReference $existing = null): array
    {
        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('projects', 'public')
            : $existing?->image_path;

        if ($request->hasFile('image') && $existing?->image_path) {
            Storage::disk('public')->delete($existing->image_path);
        }

        return [
            'category' => $validated['category'],
            'no' => $validated['no'],
            'client' => $validated['client'],
            'user' => $validated['user'],
            'year' => $validated['year'] ?? null,
            'project' => $validated['project'],
            'image_path' => $imagePath,
        ];
    }

    public function stats(): Response
    {
        return Inertia::render('admin/stats', [
            'totals' => [
                'cme' => ProjectReference::where('category', 'cme')->count(),
                'cathodic_protection' => ProjectReference::where('category', 'cathodic_protection')->count(),
                'all' => ProjectReference::count(),
            ],
            'byClient' => fn () => DB::table('project_references')
                ->select('user', DB::raw('count(*) as total'))
                ->groupBy('user')
                ->orderByDesc('total')
                ->limit(10)
                ->get(),
        ]);
    }
}
