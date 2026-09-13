import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type ContactMessage } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

const projectTypeLabels: Record<string, string> = {
    electrical: 'Electrical',
    'cathodic-protection': 'Cathodic Protection',
    mechanical: 'Mechanical',
    cme: 'CME',
    'load-bank': 'Load Bank',
    other: 'Other',
};

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(new Date(value));
}

function statusVariant(status: ContactMessage['status']): 'default' | 'secondary' | 'outline' {
    if (status === 'new') return 'default';
    if (status === 'replied') return 'secondary';

    return 'outline';
}

export default function Dashboard({
    stats,
    recentMessages,
}: {
    stats: { total: number; new: number; read: number; replied: number };
    recentMessages: ContactMessage[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Good morning</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Here is what is happening across your company website.</p>
                    </div>
                    <Link href="/admin/crm">
                        <Button>Open CRM</Button>
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border p-5">
                        <p className="text-muted-foreground text-sm">Total Messages</p>
                        <p className="mt-3 text-3xl font-semibold">{stats.total}</p>
                        <p className="text-muted-foreground mt-1 text-xs">All contact inquiries</p>
                    </div>
                    <div className="rounded-xl border p-5">
                        <p className="text-muted-foreground text-sm">New</p>
                        <p className="mt-3 text-3xl font-semibold">{stats.new}</p>
                        <p className="text-muted-foreground mt-1 text-xs">Need your attention</p>
                    </div>
                    <div className="rounded-xl border p-5">
                        <p className="text-muted-foreground text-sm">Read</p>
                        <p className="mt-3 text-3xl font-semibold">{stats.read}</p>
                        <p className="text-muted-foreground mt-1 text-xs">Currently in review</p>
                    </div>
                    <div className="rounded-xl border p-5">
                        <p className="text-muted-foreground text-sm">Replied</p>
                        <p className="mt-3 text-3xl font-semibold">{stats.replied}</p>
                        <p className="text-muted-foreground mt-1 text-xs">Completed conversations</p>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
                    <section className="overflow-hidden rounded-xl border">
                        <div className="flex items-center justify-between border-b px-5 py-4">
                            <div>
                                <h3 className="font-semibold">Recent Activity</h3>
                                <p className="text-muted-foreground mt-1 text-sm">The latest inquiries from your website.</p>
                            </div>
                            <Link href="/admin/crm" className="text-primary text-sm hover:underline">
                                View all
                            </Link>
                        </div>
                        {recentMessages.length === 0 ? (
                            <div className="text-muted-foreground px-5 py-12 text-center text-sm">No activity yet.</div>
                        ) : (
                            <div className="divide-y">
                                {recentMessages.map((message) => (
                                    <div key={message.id} className="flex flex-wrap items-start justify-between gap-4 px-5 py-4">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-medium">{message.name}</p>
                                                <Badge variant={statusVariant(message.status)}>{message.status}</Badge>
                                            </div>
                                            <p className="text-muted-foreground mt-1 text-sm">
                                                {projectTypeLabels[message.project_type] ?? message.project_type}
                                                {message.company ? ` · ${message.company}` : ''}
                                            </p>
                                            <p className="text-muted-foreground mt-2 line-clamp-1 text-sm">{message.message}</p>
                                        </div>
                                        <time className="text-muted-foreground shrink-0 text-xs">{formatDate(message.created_at)}</time>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <aside className="rounded-xl border p-5">
                        <h3 className="font-semibold">Quick Actions</h3>
                        <p className="text-muted-foreground mt-1 text-sm">Manage your website content.</p>
                        <div className="mt-5 space-y-2">
                            <Link href="/admin/crm" className="hover:bg-muted block rounded-lg border px-4 py-3 text-sm transition">
                                Review CRM messages
                            </Link>
                            <Link href="/admin/content" className="hover:bg-muted block rounded-lg border px-4 py-3 text-sm transition">
                                Edit website content
                            </Link>
                            <Link href="/admin/settings" className="hover:bg-muted block rounded-lg border px-4 py-3 text-sm transition">
                                Update website settings
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
