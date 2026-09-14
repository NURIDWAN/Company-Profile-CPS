<?php

namespace Tests\Feature;

use App\Models\Division;
use App\Models\GalleryItem;
use App\Models\PageContent;
use App\Models\PageMedia;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicDataAndGalleryTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitor_can_submit_a_contact_message(): void
    {
        $response = $this->post(route('contact.messages.store'), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+62 812 3456 7890',
            'company' => 'Example Engineering',
            'project_type' => 'electrical',
            'message' => 'We need an electrical system consultation.',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Terima kasih. Pertanyaan Anda telah dikirimkan kepada tim kami.');
        $this->assertDatabaseHas('contact_messages', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'project_type' => 'electrical',
            'status' => 'new',
        ]);
    }

    public function test_contact_message_requires_valid_contact_fields(): void
    {
        $response = $this->from('/contact')->post(route('contact.messages.store'), [
            'name' => '',
            'email' => 'not-an-email',
            'project_type' => 'unknown',
            'message' => '',
        ]);

        $response->assertRedirect('/contact');
        $response->assertSessionHasErrors(['name', 'email', 'project_type', 'message']);
        $this->assertDatabaseCount('contact_messages', 0);
    }

    public function test_contact_message_does_not_accept_unvalidated_fields(): void
    {
        $this->post(route('contact.messages.store'), [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'project_type' => 'other',
            'message' => 'A valid inquiry.',
            'status' => 'replied',
        ])->assertRedirect();

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'jane@example.com',
            'status' => 'new',
        ]);
    }

    public function test_admin_can_upload_gallery_asset(): void
    {
        Storage::fake('public');

        $this->actingAs(User::factory()->create())
            ->post(route('admin.gallery.store'), [
                'caption' => 'Control room',
                'project' => 'CPS project',
                'image' => UploadedFile::fake()->image('control-room.jpg'),
            ])
            ->assertRedirect();

        $item = GalleryItem::query()->firstOrFail();

        $this->assertSame('Control room', $item->caption);
        Storage::disk('public')->assertExists($item->image_path);
        $this->assertStringContainsString('/storage/gallery/', $item->image_url);
    }

    public function test_deleting_gallery_asset_removes_the_file(): void
    {
        Storage::fake('public');
        $path = UploadedFile::fake()->image('old-image.jpg')->store('gallery', 'public');
        $item = GalleryItem::create([
            'caption' => 'Old image',
            'image_path' => $path,
            'sort_order' => 1,
        ]);

        Storage::disk('public')->assertExists($path);

        $this->actingAs(User::factory()->create())
            ->delete(route('admin.gallery.destroy', $item))
            ->assertRedirect();

        Storage::disk('public')->assertMissing($path);
        $this->assertDatabaseMissing('gallery_items', ['id' => $item->id]);
    }

    public function test_admin_can_replace_gallery_asset_image(): void
    {
        Storage::fake('public');
        $oldPath = UploadedFile::fake()->image('old-image.jpg')->store('gallery', 'public');
        $item = GalleryItem::create([
            'caption' => 'Replace image',
            'image_path' => $oldPath,
            'sort_order' => 1,
        ]);

        $this->actingAs(User::factory()->create())
            ->put(route('admin.gallery.update', $item), [
                'caption' => 'Updated image',
                'project' => 'Updated project',
                'image' => UploadedFile::fake()->image('new-image.png'),
            ])
            ->assertRedirect();

        $item->refresh();
        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($item->image_path);
        $this->assertSame('Updated image', $item->caption);
    }

    public function test_admin_can_upload_logo_and_save_map_settings(): void
    {
        Storage::fake('public');

        $this->actingAs(User::factory()->create())
            ->put(route('admin.settings.update'), [
                'site_name' => 'CPS Test',
                'map_embed_url' => 'https://www.google.com/maps/embed?pb=test',
                'logo' => UploadedFile::fake()->image('logo.png'),
            ])
            ->assertRedirect();

        $settings = SiteSetting::query()->firstOrFail();

        Storage::disk('public')->assertExists($settings->logo_path);
        $this->assertStringContainsString('/storage/branding/', $settings->logo_url);
        $this->assertSame('https://www.google.com/maps/embed?pb=test', $settings->map_embed_url);
    }

    public function test_whatsapp_number_always_uses_the_mobile_phone(): void
    {
        $this->actingAs(User::factory()->create())
            ->put(route('admin.settings.update'), [
                'site_name' => 'CPS Test',
                'phones' => ['+6221 98060375', '+62816 1150890'],
                'whatsapp_number' => '+62000000000',
                'whatsapp_message' => 'Hello, I need an engineering consultation.',
            ])
            ->assertRedirect();

        $settings = SiteSetting::query()->firstOrFail();

        $this->assertSame('+62816 1150890', $settings->whatsapp_number);
        $this->assertSame('Hello, I need an engineering consultation.', $settings->whatsapp_message);
    }

    public function test_whatsapp_number_is_derived_from_mobile_instead_of_edited_separately(): void
    {
        $this->actingAs(User::factory()->create())
            ->put(route('admin.settings.update'), [
                'site_name' => 'CPS Test',
                'phones' => ['+6221 98060375'],
                'whatsapp_number' => 'whatsapp@example.com',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('site_settings', [
            'site_name' => 'CPS Test',
            'whatsapp_number' => null,
        ]);
    }

    public function test_admin_can_save_seo_social_and_open_graph_settings(): void
    {
        Storage::fake('public');

        $this->actingAs(User::factory()->create())
            ->put(route('admin.settings.update'), [
                'site_name' => 'CPS Test',
                'seo_title' => 'CPS Engineering | Default SEO Title',
                'seo_description' => 'A custom default search description for CPS.',
                'social_facebook' => 'https://www.facebook.com/cps',
                'social_linkedin' => 'https://www.linkedin.com/company/cps',
                'og_image' => UploadedFile::fake()->image('og-image.jpg'),
            ])
            ->assertRedirect();

        $settings = SiteSetting::query()->firstOrFail();

        $this->assertSame('CPS Engineering | Default SEO Title', $settings->seo_title);
        $this->assertSame('A custom default search description for CPS.', $settings->seo_description);
        $this->assertSame('https://www.facebook.com/cps', $settings->social_facebook);
        Storage::disk('public')->assertExists($settings->og_image_path);
        $this->assertStringContainsString('/storage/seo/', $settings->og_image_url);
    }

    public function test_existing_settings_can_be_updated_with_multipart_method_spoofing(): void
    {
        Storage::fake('public');
        SiteSetting::create([
            'site_name' => 'Existing CPS',
            'tagline' => 'Existing tagline',
            'email' => 'old@example.com',
        ]);

        $this->actingAs(User::factory()->create())
            ->post(route('admin.settings.update'), [
                '_method' => 'put',
                'site_name' => 'Updated CPS',
                'tagline' => 'Updated tagline',
                'email' => 'new@example.com',
                'logo' => UploadedFile::fake()->image('updated-logo.png'),
            ])
            ->assertRedirect();

        $settings = SiteSetting::query()->firstOrFail();
        $this->assertSame('Updated CPS', $settings->site_name);
        $this->assertSame('Updated tagline', $settings->tagline);
        $this->assertSame('new@example.com', $settings->email);
        Storage::disk('public')->assertExists($settings->logo_path);
    }

    public function test_map_settings_require_an_https_url(): void
    {
        $response = $this->actingAs(User::factory()->create())
            ->from('/admin/settings')
            ->put(route('admin.settings.update'), [
                'site_name' => 'CPS Test',
                'map_embed_url' => 'http://example.com/map',
            ]);

        $response->assertSessionHasErrors('map_embed_url');
    }

    public function test_admin_can_create_and_replace_division_image(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('admin.divisions.store'), [
                'name' => 'Image Division',
                'description' => 'Division with an image',
                'points' => ['Point one', 'Point two', ''],
                'sort_order' => 2,
                'image' => UploadedFile::fake()->image('division-one.jpg'),
            ])
            ->assertRedirect();

        $division = Division::where('slug', 'image-division')->firstOrFail();
        $this->assertSame(['Point one', 'Point two'], $division->points);
        Storage::disk('public')->assertExists($division->image_path);
        $oldPath = $division->image_path;

        $this->actingAs($user)
            ->post(route('admin.divisions.update', $division), [
                '_method' => 'put',
                'name' => 'Image Division',
                'description' => 'Updated image',
                'points' => ['Updated point'],
                'sort_order' => 2,
                'image' => UploadedFile::fake()->image('division-two.png'),
            ])
            ->assertRedirect();

        $division->refresh();
        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($division->image_path);
    }

    public function test_admin_content_page_list_excludes_removed_industries_page(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('admin.content.index'))
            ->assertInertia(fn ($page) => $page
                ->where('pages', fn ($pages) => ! $pages->contains('industries'))
            );
    }

    public function test_admin_can_update_public_copy_and_upload_page_media(): void
    {
        Storage::fake('public');

        $this->actingAs(User::factory()->create())
            ->put(route('admin.content.update'), [
                'page_key' => 'home',
                'contents' => ['hero.title' => 'CMS Hero Title'],
            ])
            ->assertRedirect();

        $this->actingAs(User::factory()->create())
            ->post(route('admin.content.media.update'), [
                'page_key' => 'home',
                'section_key' => 'hero',
                'media_key' => 'background',
                'alt_text' => 'CMS hero background',
                'image' => UploadedFile::fake()->image('hero.webp'),
            ])
            ->assertRedirect();

        $this->assertSame('CMS Hero Title', PageContent::where('page_key', 'home')->where('section_key', 'hero')->where('field_key', 'title')->value('value'));
        $media = PageMedia::where('page_key', 'home')->where('media_key', 'background')->firstOrFail();
        Storage::disk('public')->assertExists($media->image_path);
    }

    public function test_admin_can_update_division_master_data(): void
    {
        $division = Division::create([
            'slug' => 'test-division',
            'name' => 'Old Division Name',
            'description' => 'Old description',
            'sort_order' => 9,
        ]);

        $this->actingAs(User::factory()->create())
            ->post(route('admin.divisions.update', $division), [
                '_method' => 'put',
                'name' => 'Updated Division Name',
                'description' => '<p>Updated <strong>description</strong></p><script>alert(1)</script>',
                'sort_order' => 1,
            ])
            ->assertRedirect();

        $division->refresh();
        $this->assertSame('Updated Division Name', $division->name);
        $this->assertSame('<p>Updated <strong>description</strong></p>', $division->description);
        $this->assertStringNotContainsString('<script>', $division->description);
        $this->assertSame(1, $division->sort_order);
        $this->assertSame('test-division', $division->slug);
    }

    public function test_public_page_shares_database_data(): void
    {
        GalleryItem::create([
            'caption' => 'Database gallery asset',
            'image_path' => null,
            'sort_order' => 1,
        ]);

        PageContent::create([
            'page_key' => 'home',
            'section_key' => 'hero',
            'field_key' => 'title',
            'field_type' => 'text',
            'value' => 'Database hero title',
        ]);

        $this->get('/')->assertInertia(fn ($page) => $page
            ->has('publicData.gallery', 1)
            ->where('publicData.gallery.0.caption', 'Database gallery asset')
            ->where('publicContent', function ($content) {
                return $content['home.hero.title'] === 'Database hero title';
            })
        );
    }
}
