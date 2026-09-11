<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Support\RichText;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SiteSettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/settings', [
            'siteSetting' => SiteSetting::firstOrNew(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'about' => 'nullable|string',
            'address_line1' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:255',
            'phones' => 'nullable|array',
            'phones.*' => 'nullable|string|max:255',
            'fax' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'whatsapp_number' => 'nullable|string|max:30',
            'whatsapp_message' => 'nullable|string|max:255',
            'map_embed_url' => 'nullable|url|starts_with:https://|max:2000',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string|max:320',
            'social_facebook' => 'nullable|url|max:255',
            'social_instagram' => 'nullable|url|max:255',
            'social_linkedin' => 'nullable|url|max:255',
            'social_youtube' => 'nullable|url|max:255',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,webp,svg|max:2048',
            'og_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:4096',
        ]);

        $settings = SiteSetting::firstOrNew(['id' => 1]);
        $oldLogoPath = $settings->logo_path;
        $oldOgImagePath = $settings->og_image_path;
        $newLogoPath = $request->hasFile('logo')
            ? $request->file('logo')->store('branding', 'public')
            : null;
        $newOgImagePath = $request->hasFile('og_image')
            ? $request->file('og_image')->store('seo', 'public')
            : null;

        $mobileNumber = collect($validated['phones'] ?? [])->filter()->values()->get(1);

        $settings->fill([
            ...collect($validated)->except(['logo', 'og_image', 'about', 'whatsapp_number'])->all(),
            'whatsapp_number' => $mobileNumber,
            'about' => RichText::sanitize($validated['about'] ?? null),
            'logo_path' => $newLogoPath ?? $settings->logo_path,
            'og_image_path' => $newOgImagePath ?? $settings->og_image_path,
        ]);
        $settings->save();

        if ($newLogoPath && $oldLogoPath) {
            Storage::disk('public')->delete($oldLogoPath);
        }

        if ($newOgImagePath && $oldOgImagePath) {
            Storage::disk('public')->delete($oldOgImagePath);
        }

        return back()->with('success', 'Website settings saved.');
    }
}
