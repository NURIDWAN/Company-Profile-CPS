<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $this->actingAs($user = User::factory()->create());

        $this->get('/dashboard')->assertOk();
    }

    public function test_dashboard_shares_recent_contact_messages(): void
    {
        $this->actingAs(User::factory()->create());
        $oldMessage = ContactMessage::create([
            'name' => 'Old Sender',
            'email' => 'old@example.com',
            'project_type' => 'other',
            'message' => 'Old message',
        ]);
        $newMessage = ContactMessage::create([
            'name' => 'New Sender',
            'email' => 'new@example.com',
            'project_type' => 'electrical',
            'message' => 'New message',
        ]);

        $oldMessage->created_at = now()->subDay();
        $oldMessage->saveQuietly();
        $newMessage->created_at = now();
        $newMessage->saveQuietly();

        $this->get('/dashboard')->assertInertia(fn ($page) => $page
            ->where('stats.total', 2)
            ->where('stats.new', 2)
            ->has('recentMessages', 2)
            ->where('recentMessages.0.id', $newMessage->id)
            ->where('recentMessages.0.name', 'New Sender')
            ->where('recentMessages.0.message', 'New message')
        );
    }
}
