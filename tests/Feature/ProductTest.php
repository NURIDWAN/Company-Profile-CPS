<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Testing\File;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    private function createProduct(array $attributes = []): Product
    {
        return Product::create(array_merge([
            'product_category_id' => $this->createCategory()->id,
            'name' => 'Sacrificial Anode',
            'spec' => 'Zn-Al-Cd alloy',
            'description' => '<p>Protects hulls from galvanic corrosion.</p>',
        ], $attributes));
    }

    private function createCategory(): ProductCategory
    {
        return ProductCategory::create([
            'slug' => 'anodes',
            'name' => 'Anodes',
            'sort_order' => (int) ProductCategory::max('sort_order') + 1,
        ]);
    }

    public function test_guests_can_view_public_products_index(): void
    {
        $product = $this->createProduct();

        $this->get('/products')->assertInertia(fn ($page) => $page
            ->component('products/index')
            ->has('categories', 1)
            ->where('categories.0.products.0.id', $product->id)
            ->where('categories.0.products.0.slug', 'sacrificial-anode')
        );
    }

    public function test_guests_can_view_product_detail_by_slug(): void
    {
        $product = $this->createProduct();

        $this->get('/products/sacrificial-anode')->assertInertia(fn ($page) => $page
            ->component('products/show')
            ->where('product.slug', 'sacrificial-anode')
            ->where('product.name', 'Sacrificial Anode')
            ->where('seo.ogType', 'product')
            ->has('schemas', 2)
            ->has('related', 0)
        );
    }

    public function test_product_show_includes_related_products_from_same_category(): void
    {
        $product = $this->createProduct();
        Product::create([
            'product_category_id' => $product->product_category_id,
            'name' => 'Aluminum Anode',
        ]);
        Product::create(['product_category_id' => $product->product_category_id, 'name' => 'Zinc Pencil']);
        Product::create(['product_category_id' => $product->product_category_id, 'name' => 'Hull Cooler Anode']);

        $this->get('/products/sacrificial-anode')->assertInertia(fn ($page) => $page
            ->component('products/show')
            ->has('related', 3)
        );
    }

    public function test_product_binding_accepts_id_and_slug(): void
    {
        $product = $this->createProduct(['name' => 'Cupro Nickel Pipe']);

        $this->get('/products/cupro-nickel-pipe')->assertOk();
        $this->get('/products/'.$product->id)->assertOk();
        $this->get('/products/not-a-real-slug')->assertNotFound();
    }

    public function test_products_appear_in_sitemap(): void
    {
        $product = $this->createProduct();

        $response = $this->get('/sitemap.xml');
        $response->assertOk();
        $this->assertStringContainsString(url('/products/'.$product->slug), $response->getContent());
        $this->assertStringContainsString(url('/products'), $response->getContent());
    }

    public function test_guests_are_redirected_from_admin_category_products(): void
    {
        $category = $this->createCategory();

        $this->post("/admin/categories/{$category->id}/products", ['name' => 'X'])->assertRedirect('/login');
        $this->post(route('admin.products.upload-image'))->assertRedirect('/login');
    }

    public function test_authenticated_users_can_create_product_with_description(): void
    {
        $this->actingAs(User::factory()->create());
        $category = $this->createCategory();

        $this->post("/admin/categories/{$category->id}/products", [
            'name' => 'Impressed Current Anode',
            'spec' => 'MMO/Ti ribbon',
            'description' => '<p>Long-life <strong>ICCP</strong> anode.</p><script>alert(1)</script>',
        ])->assertRedirect();

        $product = Product::query()->where('name', 'Impressed Current Anode')->sole();
        $this->assertSame('impressed-current-anode', $product->slug, 'Slug must be auto-generated from name on create.');
        $this->assertStringContainsString('<strong>ICCP</strong>', (string) $product->description);
        $this->assertStringNotContainsString('script', (string) $product->description);
    }

    public function test_product_creation_requires_name(): void
    {
        $this->actingAs(User::factory()->create());
        $category = $this->createCategory();

        $this->post("/admin/categories/{$category->id}/products", ['name' => ''])->assertSessionHasErrors(['name']);
    }

    public function test_product_slug_conflict_gets_unique_suffix(): void
    {
        $this->actingAs(User::factory()->create());
        $category = $this->createCategory();

        $this->post("/admin/categories/{$category->id}/products", ['name' => 'Anode Kit'])->assertRedirect();
        $this->post("/admin/categories/{$category->id}/products", ['name' => 'Anode Kit'])->assertRedirect();

        $slugs = Product::query()->orderBy('id')->pluck('slug')->values();
        $this->assertSame('anode-kit', $slugs[0]);
        $this->assertSame('anode-kit-2', $slugs[1]);
    }

    public function test_authenticated_users_can_update_product_description(): void
    {
        $this->actingAs(User::factory()->create());
        $product = $this->createProduct();

        $this->put("/admin/products/{$product->id}", [
            'name' => $product->name,
            'spec' => $product->spec,
            'description' => '<p>Updated description with <em>emphasis</em>.</p>',
        ])->assertRedirect();

        $product->refresh();
        $this->assertStringContainsString('<em>emphasis</em>', (string) $product->description);
        $this->assertSame('sacrificial-anode', $product->slug, 'Slug must stay stable on update.');
    }

    public function test_authenticated_users_can_upload_product_image(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create());

        $response = $this->post(route('admin.products.upload-image'), [
            'image' => File::image('anode.jpg', 400, 300),
        ]);

        $response->assertOk()->assertJsonStructure(['url']);
        $url = $response->json('url');
        $this->assertMatchesRegularExpression('#/storage/products/content/.+\.jpg$#', $url);
        Storage::disk('public')->assertExists('products/content/'.basename($url));
    }

    public function test_upload_image_requires_image_file(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post(route('admin.products.upload-image'), ['image' => 'not-a-file'])
            ->assertSessionHasErrors(['image']);
    }

    public function test_destroying_product_deletes_banner_file(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create());

        $file = File::image('banner.jpg', 800, 400);
        $path = $file->store('products', 'public');
        $product = $this->createProduct(['image_path' => $path]);

        $this->delete("/admin/products/{$product->id}")->assertRedirect();

        Storage::disk('public')->assertMissing($path);
        $this->assertSame(0, Product::count());
    }
}
