<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    private const PAGES = [
        'home' => [
            'title' => 'Electrical & Electronic Engineering Solutions',
            'description' => 'PT. Citra Protecta Semesta delivers reliable electrical and electronic engineering solutions for critical infrastructure.',
            'path' => '/',
        ],
        'about' => [
            'title' => 'About PT. Citra Protecta Semesta',
            'description' => 'Learn about CPS engineering expertise, mission, values, and experience supporting critical infrastructure projects.',
            'path' => '/about',
        ],
        'services' => [
            'title' => 'Electrical Engineering Services',
            'description' => 'Explore CPS service, maintenance, design, manufacturing, trading, and construction engineering capabilities.',
            'path' => '/services',
        ],
        'projects' => [
            'title' => 'Engineering Projects Across Critical Industries',
            'description' => 'Review CPS project references, industry expertise, and electrical, electronic, cathodic protection, telecommunications, and infrastructure solutions.',
            'path' => '/projects',
        ],
        'consultation' => [
            'title' => 'Request an Engineering Consultation',
            'description' => 'Share your project requirements with CPS and request a consultation from our engineering team.',
            'path' => '/consultation',
        ],
        'contact' => [
            'title' => 'Contact PT. Citra Protecta Semesta',
            'description' => 'Contact CPS for electrical and electronic engineering services, project support, and technical consultation.',
            'path' => '/contact',
        ],
    ];

    public function show(Request $request, string $page): Response
    {
        abort_unless(isset(self::PAGES[$page]), 404);

        $definition = self::PAGES[$page];
        $settings = SiteSetting::query()->first();
        $canonical = url($definition['path']);
        $ogImage = $settings?->og_image_url ?? $settings?->logo_url;

        return Inertia::render($page, [
            'seo' => [
                'title' => $page === 'home' && $settings?->seo_title ? $settings->seo_title : __($definition['title']),
                'description' => $page === 'home' && $settings?->seo_description ? $settings->seo_description : __($definition['description']),
                'canonical' => $canonical,
                'ogImage' => $ogImage,
                'ogType' => 'website',
            ],
        ]);
    }
}
