<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'total' => ContactMessage::query()->count(),
                'new' => ContactMessage::query()->where('status', 'new')->count(),
                'read' => ContactMessage::query()->where('status', 'read')->count(),
                'replied' => ContactMessage::query()->where('status', 'replied')->count(),
            ],
            'recentMessages' => ContactMessage::query()
                ->latest()
                ->limit(5)
                ->get([
                    'id',
                    'name',
                    'email',
                    'company',
                    'project_type',
                    'message',
                    'status',
                    'created_at',
                ]),
        ]);
    }
}
