import { ConfirmDelete, TextField } from '@/components/admin/form-fields';
import { ImageUploadPreview } from '@/components/admin/image-upload-preview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type GalleryItem, type SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Galeri', href: '/admin/gallery' },
];

interface CategoryOption {
    id: number;
    name: string;
}

export default function Gallery({ items, categories }: { items: GalleryItem[]; categories: CategoryOption[] }) {
    const { flash } = usePage<SharedData>().props;
    const [editing, setEditing] = useState<GalleryItem | null>(null);
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, transform } = useForm<{
        caption: string;
        project: string;
        image: File | null;
        product_category_id: string;
    }>({ caption: '', project: '', image: null, product_category_id: '' });

    const openCreate = () => {
        setEditing(null);
        reset();
        setOpen(true);
    };

    const openEdit = (item: GalleryItem) => {
        setEditing(item);
        setData({
            caption: item.caption,
            project: item.project ?? '',
            image: null,
            product_category_id: item.product_category_id ? String(item.product_category_id) : '',
        });
        setOpen(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        transform((formData) => ({
            ...formData,
            ...(editing ? { _method: 'put' } : {}),
        }));

        post(editing ? route('admin.gallery.update', editing.id) : route('admin.gallery.store'), {
            forceFormData: true,
            onSuccess: () => setOpen(false),
        });
    };

    const destroy = (item: GalleryItem) => router.delete(route('admin.gallery.destroy', item.id));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Galeri" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Galeri</h2>
                        <p className="text-muted-foreground text-sm">Kelola item galeri proyek ({items.length}).</p>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreate}>Tambah Item</Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editing ? 'Edit Item Galeri' : 'Tambah Item Galeri'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="space-y-4">
                                <TextField
                                    id="caption"
                                    label="Keterangan"
                                    value={data.caption}
                                    onChange={(v) => setData('caption', v)}
                                    error={errors.caption}
                                    required
                                />
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Kategori</label>
                                    <Select value={data.product_category_id} onValueChange={(v) => setData('product_category_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={String(category.id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.product_category_id && <p className="text-sm text-red-600">{errors.product_category_id}</p>}
                                </div>
                                <TextField
                                    id="project"
                                    label="Proyek"
                                    value={data.project}
                                    onChange={(v) => setData('project', v)}
                                    error={errors.project}
                                />
                                <div className="grid gap-2">
                                    <label htmlFor="image" className="text-sm font-medium">
                                        Gambar <span className="text-destructive">{editing ? '(opsional)' : '*'}</span>
                                    </label>
                                    <input
                                        id="image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        required={!editing}
                                        onChange={(event) => setData('image', event.target.files?.[0] ?? null)}
                                        className="border-input bg-background file:bg-muted w-full rounded-md border text-sm file:mr-4 file:border-0 file:px-4 file:py-2"
                                    />
                                    <ImageUploadPreview
                                        file={data.image}
                                        currentUrl={editing?.image_url}
                                        alt={editing?.caption ?? data.caption}
                                        className="h-[clamp(8rem,20vh,14rem)] w-full rounded-md border object-contain"
                                    />
                                    {data.image && <p className="text-muted-foreground text-xs">Dipilih: {data.image.name}</p>}
                                    <p className="text-muted-foreground text-xs">JPG, PNG, atau WebP. Maksimal 5 MB.</p>
                                    {errors.image && <p className="text-destructive text-sm">{errors.image}</p>}
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
                                        {editing ? 'Perbarui' : 'Buat'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">{flash.success}</div>
                )}

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground text-left text-xs tracking-wide uppercase">
                            <tr>
                                <th className="px-4 py-3">Gambar</th>
                                <th className="px-4 py-3">Urutan</th>
                                <th className="px-4 py-3">Caption</th>
                                <th className="px-4 py-3">Kategori</th>
                                <th className="px-4 py-3">Proyek</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-3">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.caption} className="h-14 w-20 rounded-md object-cover" />
                                        ) : (
                                            <span className="text-muted-foreground text-xs">Tidak ada gambar</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">{item.sort_order}</td>
                                    <td className="px-4 py-3 font-medium">{item.caption}</td>
                                    <td className="px-4 py-3">
                                        {item.category ? (
                                            <Badge variant="secondary">{item.category.name}</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </td>
                                    <td className="text-muted-foreground max-w-xs truncate px-4 py-3">{item.project}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Button variant="outline" size="sm" className="mr-2" onClick={() => openEdit(item)}>
                                            Edit
                                        </Button>
                                        <ConfirmDelete
                                            title="Hapus item galeri?"
                                            description={`"${item.caption}" akan dihapus secara permanen.`}
                                            onDelete={() => destroy(item)}
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
            </div>
        </AppLayout>
    );
}
