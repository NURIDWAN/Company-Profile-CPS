<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/users', [
            'users' => User::query()
                ->latest()
                ->get(['id', 'name', 'email', 'email_verified_at', 'created_at']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'lowercase', 'max:255', Rule::unique(User::class, 'email')],
            'password' => ['required', 'confirmed', 'string', 'min:8'],
        ]);

        $user = User::create($validated);
        $user->forceFill(['email_verified_at' => Carbon::now()])->save();

        return back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'lowercase', 'max:255', Rule::unique(User::class, 'email')->ignore($user)],
            'password' => ['nullable', 'confirmed', 'string', 'min:8'],
        ]);

        if ($validated['password'] === null) {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($request->user()->is($user), 422, 'You cannot delete your own account.');

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
