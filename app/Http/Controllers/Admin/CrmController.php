<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class CrmController extends Controller
{
    public function updateStatus(Request $request, ContactMessage $message): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read,replied',
        ]);

        $status = $validated['status'];
        $message->update([
            'status' => $status,
            'read_at' => in_array($status, ['read', 'replied'], true) ? ($message->read_at ?? Carbon::now()) : null,
            'replied_at' => $status === 'replied' ? ($message->replied_at ?? Carbon::now()) : null,
        ]);

        return back()->with('success', 'Message status updated.');
    }

    public function index(Request $request): Response
    {
        $status = $request->string('status', 'all')->toString();
        $allowedStatuses = ['all', 'new', 'read', 'replied'];
        $selectedStatus = in_array($status, $allowedStatuses, true) ? $status : 'all';

        return Inertia::render('admin/crm', [
            'status' => $selectedStatus,
            'messages' => ContactMessage::query()
                ->when($selectedStatus !== 'all', fn ($query) => $query->where('status', $selectedStatus))
                ->latest()
                ->paginate(25)
                ->withQueryString(),
        ]);
    }
}
