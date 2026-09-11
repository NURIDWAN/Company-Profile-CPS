import { ConfirmDelete, TextField } from '@/components/admin/form-fields';
import { ImageUploadPreview } from '@/components/admin/image-upload-preview';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Division, type SharedData } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Divisions', href: '/admin/divisions' },
];

export default function Divisions({ divisions }: { divisions: Division[] }) {
    const { flash } = usePage<SharedData>().props;
    const [editing, setEditing] = useState<Division | null>(null);
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset, transform } = useForm<{
        name: string;
        description: string;
        points: string[];
        sort_order: number;
        image: File | null;
    }>({
        name: '',
        description: '',
        points: [''],
        sort_order: 0,
        image: null,
    });

    const openCreate = () => {
        setEditing(null);
        reset();
        setData('sort_order', divisions.length);
        setOpen(true);
    };

    const openEdit = (division: Division) => {
        setEditing(division);
        setData({
            name: division.name,
            description: division.description ?? '',
            points: division.points?.length ? [...division.points] : [''],
            sort_order: division.sort_order,
            image: null,
        });
        setOpen(true);
    };

    const updatePoint = (index: number, value: string) => {
        setData(
            'points',
            data.points.map((point, pointIndex) => (pointIndex === index ? value : point)),
        );
    };

    const addPoint = () => setData('points', [...data.points, '']);

    const removePoint = (index: number) => {
        const nextPoints = data.points.filter((_, pointIndex) => pointIndex !== index);
        setData('points', nextPoints.length ? nextPoints : ['']);
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        transform((formData) => ({ ...formData, _method: editing ? 'put' : undefined }));

        if (editing) {
            post(route('admin.divisions.update', editing.id), { forceFormData: true, onSuccess: () => setOpen(false) });
        } else {
            post(route('admin.divisions.store'), { forceFormData: true, onSuccess: () => setOpen(false) });
        }
    };

    const destroy = (division: Division) => {
        router.delete(route('admin.divisions.destroy', division.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Divisions" />
            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">Master data</p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Divisions</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Kelola nama, deskripsi, urutan, dan image untuk setiap divisi CPS.</p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreate}>Add division</Button>
                        </DialogTrigger>
                        <DialogContent className="h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] overflow-hidden sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>{editing ? 'Edit division' : 'Add division'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="flex min-h-0 flex-col">
                                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
                                    <TextField
                                        id="name"
                                        label="Division name"
                                        value={data.name}
                                        onChange={(value) => setData('name', value)}
                                        error={errors.name}
                                        required
                                    />
                                    <RichTextEditor
                                        id="description"
                                        label="Description"
                                        value={data.description}
                                        onChange={(value) => setData('description', value)}
                                        error={errors.description}
                                        rows={6}
                                        hint="Use formatting to structure the division description."
                                    />
                                    <div className="rounded-lg border p-4">
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            <div>
                                                <label className="text-sm font-medium">Card points</label>
                                                <p className="text-muted-foreground mt-1 text-xs">Bullet points displayed in the division card.</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={addPoint}
                                                disabled={data.points.length >= 12}
                                            >
                                                Add point
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {data.points.map((point, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <input
                                                        value={point}
                                                        onChange={(event) => updatePoint(index, event.target.value)}
                                                        placeholder={`Point ${index + 1}`}
                                                        maxLength={255}
                                                        className="border-input bg-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => removePoint(index)}
                                                        disabled={data.points.length === 1}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.points && <p className="text-destructive mt-2 text-sm">{errors.points}</p>}
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
                                        <TextField
                                            id="sort_order"
                                            label="Display order"
                                            type="number"
                                            value={String(data.sort_order)}
                                            onChange={(value) => setData('sort_order', Number(value) || 0)}
                                            error={errors.sort_order}
                                            required
                                        />
                                        <div>
                                            <label htmlFor="image" className="mb-2 block text-sm font-medium">
                                                Division image
                                            </label>
                                            <ImageUploadPreview
                                                file={data.image}
                                                currentUrl={editing?.image_url}
                                                alt={editing?.name ?? data.name ?? 'Division image'}
                                                className="mb-2 h-24 w-full rounded-md border object-cover"
                                            />
                                            <input
                                                id="image"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(event) => setData('image', event.target.files?.[0] ?? null)}
                                                className="border-input bg-background file:bg-muted w-full rounded-md border text-sm file:mr-4 file:border-0 file:px-3 file:py-2"
                                            />
                                            <p className="text-muted-foreground mt-1 text-xs">JPG, PNG, or WebP. Maximum 5 MB.</p>
                                            {errors.image && <p className="text-destructive mt-1 text-sm">{errors.image}</p>}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="bg-background sticky bottom-0 mt-4 border-t pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving…' : editing ? 'Update division' : 'Create division'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{flash.success}</div>
                )}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {divisions.map((division) => (
                        <article key={division.id} className="bg-card overflow-hidden rounded-xl border shadow-sm">
                            {division.image_url ? (
                                <img src={division.image_url} alt={division.name} className="h-44 w-full object-cover" />
                            ) : (
                                <div className="bg-muted text-muted-foreground flex h-44 items-center justify-center text-sm">No image uploaded</div>
                            )}
                            <div className="space-y-3 p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-muted-foreground font-mono text-xs">Order {division.sort_order}</p>
                                        <h3 className="mt-1 font-semibold">{division.name}</h3>
                                    </div>
                                    <Badge variant="secondary">{division.slug}</Badge>
                                </div>
                                <p className="text-muted-foreground line-clamp-4 text-sm leading-6">
                                    {division.description || 'No description provided.'}
                                </p>
                                <div className="flex justify-end gap-2 border-t pt-3">
                                    <Button variant="outline" size="sm" onClick={() => openEdit(division)}>
                                        Edit
                                    </Button>
                                    <ConfirmDelete
                                        title="Delete division?"
                                        description={`This will permanently delete "${division.name}" and its image.`}
                                        onDelete={() => destroy(division)}
                                        trigger={
                                            <Button variant="destructive" size="sm">
                                                Delete
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="text-muted-foreground text-xs">
                    <Link href="/dashboard" className="hover:underline">
                        ← Back to dashboard
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
