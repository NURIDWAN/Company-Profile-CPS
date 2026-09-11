import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ContactMessage, type PaginatedResponse } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'CRM Messages', href: '/admin/crm' },
];

const statusFilters = [
    { value: 'all', label: 'All Messages' },
    { value: 'new', label: 'New' },
    { value: 'read', label: 'Read' },
    { value: 'replied', label: 'Replied' },
];

const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'read', label: 'Read' },
    { value: 'replied', label: 'Replied' },
];

const projectTypeLabels: Record<string, string> = {
    electrical: 'Electrical',
    'cathodic-protection': 'Cathodic Protection',
    mechanical: 'Mechanical',
    cme: 'CME',
    'load-bank': 'Load Bank',
    other: 'Other',
};

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function statusVariant(status: ContactMessage['status']): 'default' | 'secondary' | 'outline' {
    if (status === 'new') return 'default';
    if (status === 'replied') return 'secondary';

    return 'outline';
}

export default function Crm({ messages, status }: { messages: PaginatedResponse<ContactMessage>; status: string }) {
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const updateStatus = (messageId: number, nextStatus: string) => {
        setUpdatingId(messageId);
        router.patch(
            route('admin.crm.status.update', messageId),
            { status: nextStatus },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setUpdatingId(null),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CRM Messages" />
            <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-1 flex-col gap-6 p-4">
                <div className="flex min-w-0 flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">CRM Messages</h2>
                        <p className="text-muted-foreground text-sm">Manage inquiries received from the website contact form.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {statusFilters.map((filter) => (
                            <Link key={filter.value} href={`/admin/crm?status=${filter.value}`} preserveState preserveScroll>
                                <Button variant={status === filter.value ? 'default' : 'outline'} size="sm">
                                    {filter.label}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>

                <section className="min-w-0 overflow-hidden rounded-xl border">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div>
                            <h3 className="font-semibold">Contact Messages</h3>
                            <p className="text-muted-foreground mt-1 text-sm">{messages.total} total message(s)</p>
                        </div>
                    </div>
                    {messages.data.length === 0 ? (
                        <div className="text-muted-foreground px-5 py-12 text-center text-sm">No messages found for this filter.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-sm">
                                <thead className="bg-muted/40 text-muted-foreground text-left">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">Sender</th>
                                        <th className="px-5 py-3 font-medium">Contact</th>
                                        <th className="px-5 py-3 font-medium">Project</th>
                                        <th className="px-5 py-3 font-medium">Message</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                        <th className="px-5 py-3 font-medium">Received</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {messages.data.map((message) => (
                                        <tr key={message.id} className="align-top">
                                            <td className="px-5 py-4">
                                                <p className="font-medium">{message.name}</p>
                                                <p className="text-muted-foreground text-xs">{message.company || 'No company provided'}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                                                    {message.email}
                                                </a>
                                            </td>
                                            <td className="px-5 py-4">{projectTypeLabels[message.project_type] ?? message.project_type}</td>
                                            <td className="max-w-md px-5 py-4">
                                                <p className="line-clamp-3" title={message.message}>
                                                    {message.message}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col gap-2">
                                                    <Badge variant={statusVariant(message.status)}>{message.status}</Badge>
                                                    <select
                                                        value={message.status}
                                                        onChange={(event) => updateStatus(message.id, event.target.value)}
                                                        disabled={updatingId === message.id}
                                                        aria-label={`Update status for message from ${message.name}`}
                                                        className="border-input bg-background h-8 rounded-md border px-2 text-xs"
                                                    >
                                                        {statusOptions.map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="text-muted-foreground px-5 py-4 whitespace-nowrap">{formatDate(message.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {messages.links && messages.last_page > 1 && (
                        <div className="flex flex-wrap gap-2 border-t px-5 py-4">
                            {messages.links.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.url ?? '#'}
                                    preserveState
                                    preserveScroll
                                    className={`rounded-md border px-3 py-1.5 text-sm ${
                                        link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                                    } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
