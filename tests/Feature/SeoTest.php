<?php

namespace Tests\Feature;

use App\Models\Division;
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

    public function test_industries_redirects_to_the_combined_projects_page(): void
    {
        $this->get('/industries')->assertRedirect('/projects#industries')->assertStatus(301);
    }

    public function test_service_detail_page_uses_division_slug_and_related_services(): void
    {
        $division = Division::create([
            'slug' => 'service-maintenance',
            'name' => 'Divisi Servis dan Pemeliharaan',
            'description' => '<p>Layanan pemeliharaan peralatan industri.</p>',
            'points' => ['Pemantauan energi', 'Sistem UPS'],
            'sort_order' => 1,
        ]);
        Division::create([
            'slug' => 'design-manufacture',
            'name' => 'Divisi Desain dan Manufaktur',
            'description' => '<p>Solusi desain dan manufaktur.</p>',
            'points' => ['Panel kelistrikan'],
            'sort_order' => 2,
        ]);

        $this->get('/services/service-maintenance')->assertInertia(fn ($page) => $page
            ->component('services/show')
            ->where('service.slug', $division->slug)
            ->where('service.name', $division->name)
            ->where('service.points.0', 'Pemantauan energi')
            ->where('seo.canonical', url('/services/service-maintenance'))
            ->has('schemas', 2)
            ->has('related', 1)
        );

        $this->get('/services/not-found')->assertNotFound();
    }

    public function test_sitemap_contains_public_pages_only(): void
    {
        $division = Division::create([
            'slug' => 'service-maintenance',
            'name' => 'Divisi Servis dan Pemeliharaan',
            'description' => 'Layanan pemeliharaan.',
            'sort_order' => 1,
        ]);

        $this->artisan('seo:generate-sitemap')->assertSuccessful();

        $sitemap = file_get_contents(public_path('sitemap.xml'));

        $this->assertStringContainsString(url('/contact'), $sitemap);
        $this->assertStringContainsString(url('/services'), $sitemap);
        $this->assertStringContainsString(url('/services/'.$division->slug), $sitemap);
        $this->assertStringContainsString(url('/projects'), $sitemap);
        $this->assertStringNotContainsString('/industries', $sitemap);
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
