<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleTest extends TestCase
{
    use RefreshDatabase;

    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'title' => 'Understanding Cathodic Protection Systems',
            'content' => '<p>Cathodic protection keeps pipelines safe from corrosion.</p><h2>Why it matters</h2><p>It extends asset life.</p>',
            'status' => 'published',
        ], $overrides);
    }

    public function test_guests_are_redirected_from_admin_articles(): void
    {
        $this->get('/admin/articles')->assertRedirect('/login');
    }

    public function test_authenticated_users_can_create_article(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/admin/articles', $this->validPayload())->assertRedirect();

        $article = Article::query()->sole();
        $this->assertSame('understanding-cathodic-protection-systems', $article->slug);
        $this->assertSame('published', $article->status);
        $this->assertNotNull($article->published_at);
    }

    public function test_article_creation_requires_title_and_content(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/admin/articles', ['title' => '', 'content' => ''])->assertSessionHasErrors(['title', 'content']);
        $this->assertSame(0, Article::count());
    }

    public function test_content_images_are_sanitized(): void
    {
        $this->actingAs(User::factory()->create());

        $content = '<p>Intro</p><img src="https://example.com/photo.jpg" alt="Photo" onerror="alert(1)"><script>alert(2)</script><img src="javascript:alert(3)">';

        $this->post('/admin/articles', $this->validPayload(['content' => $content]))->assertRedirect();

        $article = Article::query()->sole();
        $this->assertStringContainsString('src="https://example.com/photo.jpg"', $article->content);
        $this->assertStringContainsString('alt="Photo"', $article->content);
        $this->assertStringNotContainsString('onerror', $article->content);
        $this->assertStringNotContainsString('script', $article->content);
        $this->assertStringNotContainsString('javascript:', $article->content);
    }

    public function test_authenticated_users_can_upload_content_image(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->post(
            route('admin.articles.upload-image'),
            ['image' => \Illuminate\Http\Testing\File::image('banner.jpg', 400, 300)],
        );

        $response->assertOk()->assertJsonStructure(['url']);
        $url = $response->json('url');
        $this->assertMatchesRegularExpression('#/storage/articles/content/.+\.jpg$#', $url);
        \Illuminate\Support\Facades\Storage::disk('public')->assertExists('articles/content/'.basename($url));
    }

    public function test_upload_image_requires_image_file(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post(route('admin.articles.upload-image'), ['image' => 'not-a-file'])
            ->assertSessionHasErrors(['image']);
    }

    public function test_guests_cannot_upload_content_image(): void
    {
        $this->post(route('admin.articles.upload-image'), [])->assertRedirect('/login');
    }

    public function test_seo_preview_returns_generated_seo_via_post(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post(route('admin.articles.seo-preview'), [
            'title' => 'Understanding Cathodic Protection Systems',
            'excerpt' => 'A practical guide to protecting pipelines.',
            'content' => '<p>Cathodic protection keeps pipelines safe from corrosion.</p>',
        ])->assertOk()->assertJsonStructure(['seo_title', 'seo_description', 'seo_keywords', 'slug']);
    }

    public function test_seo_preview_requires_title(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post(route('admin.articles.seo-preview'), ['title' => ''])->assertSessionHasErrors(['title']);
    }

    public function test_guests_cannot_use_seo_preview(): void
    {
        $this->post(route('admin.articles.seo-preview'), ['title' => 'x'])->assertRedirect('/login');
    }

    public function test_slug_is_generated_with_unique_suffix(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/admin/articles', $this->validPayload());
        $this->post('/admin/articles', $this->validPayload());

        $slugs = Article::query()->pluck('slug')->sort()->values();
        $this->assertSame(['understanding-cathodic-protection-systems', 'understanding-cathodic-protection-systems-2'], $slugs->all());
    }

    public function test_custom_slug_is_sanitized_and_saved(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/admin/articles', $this->validPayload(['slug' => 'My Custom Slug!']))->assertRedirect();

        $article = Article::query()->sole();
        $this->assertSame('my-custom-slug', $article->slug);
    }

    public function test_custom_slug_conflict_gets_unique_suffix(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/admin/articles', $this->validPayload(['slug' => 'pipeline-guide']));
        $this->post('/admin/articles', $this->validPayload(['slug' => 'Pipeline Guide']));

        $slugs = Article::query()->orderBy('id')->pluck('slug')->values();
        $this->assertSame('pipeline-guide', $slugs[0]);
        $this->assertSame('pipeline-guide-2', $slugs[1]);
    }

    public function test_messy_slug_is_sanitized_not_rejected(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/admin/articles', $this->validPayload(['slug' => 'Not Valid!']))->assertRedirect();

        $this->assertSame('not-valid', Article::query()->sole()->slug);
    }

    public function test_symbol_only_slug_falls_back_to_title_slug(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/admin/articles', $this->validPayload(['slug' => '!!!']))->assertRedirect();

        $article = Article::query()->sole();
        $this->assertSame('understanding-cathodic-protection-systems', $article->slug);
    }

    public function test_custom_slug_can_be_changed_on_update(): void
    {
        $this->actingAs(User::factory()->create());
        $article = Article::create($this->validPayload());

        $this->put("/admin/articles/{$article->id}", $this->validPayload(['slug' => 'revised-url']))
            ->assertRedirect();

        $article->refresh();
        $this->assertSame('revised-url', $article->slug);
    }

    public function test_seo_fields_are_generated_when_left_empty(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/admin/articles', $this->validPayload([
            'excerpt' => 'Cathodic protection keeps critical assets safe from corrosion damage.',
        ]))->assertRedirect();

        $article = Article::query()->sole();
        $this->assertSame('Understanding Cathodic Protection Systems', $article->seo_title);
        $this->assertSame('Cathodic protection keeps critical assets safe from corrosion damage.', $article->seo_description);
        $this->assertNotSame('', $article->seo_keywords);
        $this->assertStringContainsString('cathodic', $article->seo_keywords);
    }

    public function test_authenticated_users_can_update_article(): void
    {
        $this->actingAs(User::factory()->create());
        $article = Article::create($this->validPayload());

        $this->put("/admin/articles/{$article->id}", $this->validPayload(['title' => 'Updated title']))->assertRedirect();

        $article->refresh();
        $this->assertSame('Updated title', $article->title);
        $this->assertSame('understanding-cathodic-protection-systems', $article->slug, 'Slug must stay stable unless regenerated.');
    }

    public function test_articles_can_be_deleted(): void
    {
        $this->actingAs(User::factory()->create());
        $article = Article::create($this->validPayload());

        $this->delete("/admin/articles/{$article->id}")->assertRedirect();

        $this->assertSame(0, Article::count());
    }

    public function test_articles_index_shows_published_articles_to_guests(): void
    {
        $published = Article::create($this->validPayload());

        $this->get('/articles')->assertInertia(fn ($page) => $page
            ->component('articles/index')
            ->where('articles.data.0.id', $published->id)
            ->where('articles.data.0.slug', $published->slug)
        );
    }

    public function test_draft_articles_are_hidden_from_public_index_and_show(): void
    {
        Article::create($this->validPayload(['status' => 'draft']));

        $this->get('/articles')->assertInertia(fn ($page) => $page->where('articles.total', 0));
        $this->get('/articles/understanding-cathodic-protection-systems')->assertNotFound();
    }

    public function test_article_show_renders_article_seo_and_schema(): void
    {
        $article = Article::create($this->validPayload([
            'seo_title' => 'Custom SEO Title',
            'seo_description' => 'Custom SEO description.',
        ]));

        $this->get("/articles/{$article->slug}")->assertInertia(fn ($page) => $page
            ->component('articles/show')
            ->where('article.slug', $article->slug)
            ->where('article.title', 'Understanding Cathodic Protection Systems')
            ->where('seo.title', 'Custom SEO Title')
            ->where('seo.ogType', 'article')
            ->has('schemas', 2)
        );
    }

    public function test_sitemap_contains_published_articles_only(): void
    {
        $published = Article::create($this->validPayload());
        Article::create($this->validPayload(['status' => 'draft']));

        $response = $this->get('/sitemap.xml');
        $response->assertOk();
        $this->assertStringContainsString(url('/articles/'.$published->slug), $response->getContent());
        $this->assertStringContainsString(url('/articles'), $response->getContent());
    }
}
