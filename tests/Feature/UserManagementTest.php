<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_user_management(): void
    {
        $this->get('/admin/users')->assertRedirect('/login');
    }

    public function test_authenticated_user_can_create_update_and_delete_another_user(): void
    {
        $admin = User::factory()->create();
        $this->actingAs($admin);

        $this->post('/admin/users', [
            'name' => 'Managed User',
            'email' => 'managed@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertRedirect();

        $managedUser = User::where('email', 'managed@example.com')->firstOrFail();
        $this->assertNotNull($managedUser->email_verified_at);
        $this->assertTrue(Hash::check('password123', $managedUser->password));

        $this->put("/admin/users/{$managedUser->id}", [
            'name' => 'Updated User',
            'email' => 'updated@example.com',
            'password' => '',
            'password_confirmation' => '',
        ])->assertRedirect();

        $managedUser->refresh();
        $this->assertSame('Updated User', $managedUser->name);
        $this->assertSame('updated@example.com', $managedUser->email);
        $this->assertTrue(Hash::check('password123', $managedUser->password));

        $this->delete("/admin/users/{$managedUser->id}")->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $managedUser->id]);
    }

    public function test_user_cannot_delete_their_own_account(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->delete("/admin/users/{$admin->id}")
            ->assertStatus(422);

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }
}
