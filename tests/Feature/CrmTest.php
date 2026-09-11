<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrmTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_from_crm(): void
    {
        $this->get('/admin/crm')->assertRedirect('/login');
    }

    public function test_authenticated_users_can_filter_crm_messages_by_status(): void
    {
        $this->actingAs(User::factory()->create());
        $newMessage = ContactMessage::create([
            'name' => 'New Sender',
            'email' => 'new@example.com',
            'project_type' => 'electrical',
            'message' => 'New inquiry',
            'status' => 'new',
        ]);
        ContactMessage::create([
            'name' => 'Replied Sender',
            'email' => 'replied@example.com',
            'project_type' => 'other',
            'message' => 'Replied inquiry',
            'status' => 'replied',
        ]);

        $this->get('/admin/crm?status=new')->assertInertia(fn ($page) => $page
            ->where('status', 'new')
            ->where('messages.total', 1)
            ->where('messages.data.0.id', $newMessage->id)
        );
    }

    public function test_authenticated_users_can_update_message_status(): void
    {
        $this->actingAs(User::factory()->create());
        $message = ContactMessage::create([
            'name' => 'Sender',
            'email' => 'sender@example.com',
            'project_type' => 'other',
            'message' => 'Inquiry',
            'status' => 'new',
        ]);

        $this->patch("/admin/crm/{$message->id}/status", ['status' => 'replied'])
            ->assertRedirect();

        $message->refresh();
        $this->assertSame('replied', $message->status);
        $this->assertNotNull($message->read_at);
        $this->assertNotNull($message->replied_at);
    }

    public function test_crm_rejects_unknown_message_status(): void
    {
        $this->actingAs(User::factory()->create());
        $message = ContactMessage::create([
            'name' => 'Sender',
            'email' => 'sender@example.com',
            'project_type' => 'other',
            'message' => 'Inquiry',
        ]);

        $this->from('/admin/crm')
            ->patch("/admin/crm/{$message->id}/status", ['status' => 'invalid'])
            ->assertSessionHasErrors('status');
    }

    public function test_crm_defaults_to_all_for_unknown_status(): void
    {
        $this->actingAs(User::factory()->create());
        ContactMessage::create([
            'name' => 'Sender',
            'email' => 'sender@example.com',
            'project_type' => 'other',
            'message' => 'Inquiry',
            'status' => 'read',
        ]);

        $this->get('/admin/crm?status=unknown')->assertInertia(fn ($page) => $page
            ->where('status', 'all')
            ->where('messages.total', 1)
        );
    }
}
