<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_pages_share_unique_seo_metadata(): void
    {
        $this->get('/')->assertInertia(fn ($page) => $page
            ->where('seo.title', 'Electrical & Electronic Engineering Solutions')
            ->where('seo.description', 'PT. Citra Protecta Semesta delivers reliable electrical and electronic engineering solutions for critical infrastructure.')
            ->where('seo.canonical', url('/'))
        );

        $this->get('/contact')->assertInertia(fn ($page) => $page
            ->where('seo.title', 'Contact PT. Citra Protecta Semesta')
            ->where('seo.canonical', url('/contact'))
        );
    }

    public function test_home_uses_seo_settings_while_inner_pages_keep_unique_metadata(): void
    {
        SiteSetting::create([
            'site_name' => 'CPS',
            'seo_title' => 'Custom CPS SEO Title',
            'seo_description' => 'Custom CPS SEO description.',
            'social_facebook' => 'https://www.facebook.com/cps',
        ]);

        $this->get('/')->assertInertia(fn ($page) => $page
            ->where('seo.title', 'Custom CPS SEO Title')
            ->where('seo.description', 'Custom CPS SEO description.')
            ->where('siteSettings.social_facebook', 'https://www.facebook.com/cps')
        );

        $this->get('/contact')->assertInertia(fn ($page) => $page
            ->where('seo.title', 'Contact PT. Citra Protecta Semesta')
            ->where('seo.description', 'Contact CPS for electrical and electronic engineering services, project support, and technical consultation.')
        );
    }

    public function test_sitemap_contains_public_pages_only(): void
    {
        $this->artisan('seo:generate-sitemap')->assertSuccessful();

        $sitemap = file_get_contents(public_path('sitemap.xml'));

        $this->assertStringContainsString(url('/contact'), $sitemap);
        $this->assertStringContainsString(url('/services'), $sitemap);
        $this->assertStringNotContainsString('/admin', $sitemap);
        $this->assertStringNotContainsString('/login', $sitemap);
    }

    public function test_robots_file_blocks_private_paths(): void
    {
        $response = $this->get('/robots.txt');

        $response->assertOk();
        $response->assertSee('Disallow: /admin/');
        $response->assertSee('Disallow: /settings/');
        $response->assertSee('Sitemap: '.url('/sitemap.xml'));
    }
}
