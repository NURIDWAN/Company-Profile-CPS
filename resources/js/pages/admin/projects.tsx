import { ConfirmDelete, TextField } from '@/components/admin/form-fields';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedResponse, type ProjectReference, type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Referensi Proyek', href: '/admin/projects' },
];

const CATEGORY_LABELS: Record<string, string> = {
    cme: 'CME',
    cathodic_protection: 'Cathodic Protection',
};

export default function Projects({ references, category }: { references: PaginatedResponse<ProjectReference>; category: string }) {
    const { flash } = usePage<SharedData>().props;
    const [editing, setEditing] = useState<ProjectReference | null>(null);
    const [open, setOpen] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm<{
        category: string;
        no: string;
        client: string;
        user: string;
        year: string;
        project: string;
    }>({ category, no: '', client: '', user: '', year: '', project: '' });

    const openCreate = () => {
        setEditing(null);
        reset();
        setData('category', category);
        setOpen(true);
    };

    const openEdit = (reference: ProjectReference) => {
        setEditing(reference);
        setData({
            category: reference.category,
            no: String(reference.no),
            client: reference.client,
            user: reference.user,
            year: reference.year ? String(reference.year) : '',
            project: reference.project,
        });
        setOpen(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('admin.projects.update', editing.id), { onSuccess: () => setOpen(false) });
        } else {
            post(route('admin.projects.store'), { onSuccess: () => setOpen(false) });
        }
    };

    const destroy = (reference: ProjectReference) => router.delete(route('admin.projects.destroy', reference.id));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Referensi Proyek" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Referensi Proyek</h2>
                        <p className="text-muted-foreground text-sm">{references.total} references in this category.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex rounded-md border">
                            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                <Link
                                    key={value}
                                    href={`/admin/projects?category=${value}`}
                                    className={`px-4 py-2 text-sm transition ${
                                        category === value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={openCreate}>Tambah Referensi</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>{editing ? 'Edit Referensi Proyek' : 'Tambah Referensi Proyek'}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={submit} className="space-y-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Kategori</label>
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="border-input bg-background flex h-9 rounded-md border px-3 py-1 text-sm"
                                        >
                                            <option value="cme">CME</option>
                                            <option value="cathodic_protection">Proteksi Katodik</option>
                                        </select>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <TextField
                                            id="no"
                                            label="No"
                                            type="number"
                                            value={data.no}
                                            onChange={(v) => setData('no', v)}
                                            error={errors.no}
                                            required
                                        />
                                        <TextField
                                            id="year"
                                            label="Tahun"
                                            type="number"
                                            value={data.year}
                                            onChange={(v) => setData('year', v)}
                                            error={errors.year}
                                        />
                                    </div>
                                    <TextField
                                        id="client"
                                        label="Klien"
                                        value={data.client}
                                        onChange={(v) => setData('client', v)}
                                        error={errors.client}
                                        required
                                    />
                                    <TextField
                                        id="user"
                                        label="Pengguna"
                                        value={data.user}
                                        onChange={(v) => setData('user', v)}
                                        error={errors.user}
                                        required
                                    />
                                    <TextField
                                        id="project"
                                        label="Proyek"
                                        value={data.project}
                                        onChange={(v) => setData('project', v)}
                                        error={errors.project}
                                        required
                                    />
                                    <DialogFooter>
                                        <Button type="submit" disabled={processing}>
                                            {editing ? 'Perbarui' : 'Buat'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">{flash.success}</div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground text-left text-xs tracking-wide uppercase">
                            <tr>
                                <th className="px-4 py-3">No</th>
                                <th className="px-4 py-3">Klien</th>
                                <th className="px-4 py-3">Pengguna</th>
                                <th className="px-4 py-3">Tahun</th>
                                <th className="px-4 py-3">Proyek</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {references.data.map((reference) => (
                                <tr key={reference.id} className="border-t">
                                    <td className="px-4 py-3 font-mono text-xs">{reference.no}</td>
                                    <td className="px-4 py-3 font-medium">{reference.client}</td>
                                    <td className="text-muted-foreground px-4 py-3">{reference.user}</td>
                                    <td className="px-4 py-3">
                                        {reference.year ? (
                                            <Badge variant="secondary">{reference.year}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </td>
                                    <td className="text-muted-foreground max-w-sm truncate px-4 py-3">{reference.project}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="outline" size="sm" className="mr-2" onClick={() => openEdit(reference)}>
                                            Edit
                                        </Button>
                                        <ConfirmDelete
                                            title="Hapus referensi?"
                                            description={`Referensi #${reference.no} — ${reference.project} akan dihapus secara permanen.`}
                                            onDelete={() => destroy(reference)}
                                            trigger={
                                                <Button variant="destructive" size="sm">
                                                    Hapus
                                                </Button>
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        Page {references.current_page} of {references.last_page}
                    </span>
                    <div className="flex gap-2">
                        {references.current_page > 1 && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/projects?category=${category}&page=${references.current_page - 1}`}>Sebelumnya</Link>
                            </Button>
                        )}
                        {references.current_page < references.last_page && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/projects?category=${category}&page=${references.current_page + 1}`}>Berikutnya</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
