<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProjectReference;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        ]);

        ProjectReference::create($validated);

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
        ]);

        $reference->update($validated);

        return back()->with('success', __('Project reference updated.'));
    }

    public function destroy(ProjectReference $reference): RedirectResponse
    {
        $reference->delete();

        return back()->with('success', __('Project reference deleted.'));
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
