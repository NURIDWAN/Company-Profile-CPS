import { ConfirmDelete, TextField } from '@/components/admin/form-fields';
import { ImageUploadPreview } from '@/components/admin/image-upload-preview';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Artikel', href: '/admin/articles' },
];

export interface AdminArticle {
    id: number;
    title: string;
    slug: string;
    status: string;
    published_at: string | null;
    created_at: string;
    excerpt: string | null;
    content: string;
    cover_url: string | null;
    cover_alt: string | null;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string | null;
    has_seo: boolean;
    reading_time: number;
}

function formatDate(value: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value));
}

function CharCounter({ value, max }: { value: string; max: number }) {
    const length = value.length;
    return (
        <span className={length > max ? 'text-destructive text-xs font-medium' : 'text-muted-foreground text-xs'}>
            {length}/{max}
        </span>
    );
}

const emptyForm = {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover: null as File | null,
    cover_alt: '',
    status: 'draft',
    published_at: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
};

const slugify = (value: string): string =>
    value
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 100);

export default function Articles({ articles }: { articles: AdminArticle[] }) {
    const { flash } = usePage<SharedData>().props;
    const [editing, setEditing] = useState<AdminArticle | null>(null);
    const [open, setOpen] = useState(false);
    const [generating, setGenerating] = useState(false);
    const { data, setData, post, processing, errors, reset, clearErrors, setError, transform } = useForm({ ...emptyForm });

    const openCreate = () => {
        setEditing(null);
        reset();
        setOpen(true);
    };

    const openEdit = (article: AdminArticle) => {
        setEditing(article);
        setData({
            ...emptyForm,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt ?? '',
            content: article.content,
            cover_alt: article.cover_alt ?? '',
            status: article.status,
            published_at: article.published_at ? article.published_at.slice(0, 10) : '',
            seo_title: article.seo_title ?? '',
            seo_description: article.seo_description ?? '',
            seo_keywords: article.seo_keywords ?? '',
        });
        setOpen(true);
    };

    const generateSeo = () => {
        setGenerating(true);
        fetch(route('admin.articles.seo-preview'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
            },
            body: JSON.stringify({ title: data.title, excerpt: data.excerpt, content: data.content }),
        })
            .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
            .then((generated: { seo_title: string; seo_description: string; seo_keywords: string; slug: string }) => {
                setData((current) => ({
                    ...current,
                    seo_title: current.seo_title || generated.seo_title,
                    seo_description: current.seo_description || generated.seo_description,
                    seo_keywords: current.seo_keywords || generated.seo_keywords,
                }));
            })
            .catch(() => {
                setError('seo_title', 'Gagal membuat SEO. Silakan coba lagi.');
            })
            .finally(() => setGenerating(false));
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        clearErrors();
        setData('slug', slugify(data.slug));

        transform((formData) => ({
            ...formData,
            _method: editing ? 'put' : undefined,
        }));

        if (editing) {
            post(route('admin.articles.update', editing.id), { forceFormData: true, onSuccess: () => setOpen(false) });
        } else {
            post(route('admin.articles.store'), { forceFormData: true, onSuccess: () => setOpen(false) });
        }
    };

    const destroy = (article: AdminArticle) => {
        router.delete(route('admin.articles.destroy', article.id), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Artikel" />
            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">Konten</p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Artikel</h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Tulis artikel dengan pembuatan SEO otomatis. Artikel yang diterbitkan muncul di /articles dan sitemap.
                        </p>
                        {flash?.success && <p className="text-success mt-2 text-sm">{flash.success}</p>}
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreate}>Tambah artikel</Button>
                        </DialogTrigger>
                        <DialogContent className="h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] overflow-hidden sm:max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>{editing ? 'Edit artikel' : 'Tambah artikel'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="flex min-h-0 flex-col">
                                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-2">
                                    <TextField
                                        id="title"
                                        label="Judul"
                                        value={data.title}
                                        onChange={(value) => setData('title', value)}
                                        error={errors.title}
                                        required
                                    />

                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="slug">Slug (URL)</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-7 px-2 text-xs"
                                                onClick={() => setData('slug', slugify(data.title))}
                                                disabled={!data.title}
                                            >
                                                Buat dari judul
                                            </Button>
                                        </div>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            placeholder="auto-generated-from-title"
                                            maxLength={255}
                                        />
                                        <p className="text-muted-foreground text-xs">
                                            URL: /articles/{data.slug ? slugify(data.slug) : '…'} — kosongkan untuk membuat otomatis dari judul.
                                        </p>
                                        <InputError message={errors.slug} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="excerpt">Ringkasan</Label>
                                        <Input
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) => setData('excerpt', e.target.value)}
                                            placeholder="Ringkasan singkat untuk deskripsi SEO"
                                            maxLength={500}
                                        />
                                        <InputError message={errors.excerpt} />
                                    </div>

                                    <RichTextEditor
                                        id="content"
                                        label="Konten"
                                        value={data.content}
                                        onChange={(value) => setData('content', value)}
                                        error={errors.content}
                                        rows={12}
                                        hint="Gunakan judul H2/H3 untuk menyusun artikel demi SEO."
                                        uploadUrl={route('admin.articles.upload-image')}
                                    />

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="cover">Gambar sampul</Label>
                                            <Input
                                                id="cover"
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={(e) => setData('cover', e.target.files?.[0] ?? null)}
                                            />
                                            <InputError message={errors.cover} />
                                        </div>
                                        <TextField
                                            id="cover_alt"
                                            label="Teks alt sampul"
                                            value={data.cover_alt}
                                            onChange={(value) => setData('cover_alt', value)}
                                            error={errors.cover_alt}
                                            placeholder="Jelaskan gambar sampul"
                                        />
                                    </div>
                                    {(data.cover || (editing?.cover_url && !data.cover)) && (
                                        <ImageUploadPreview file={data.cover} currentUrl={editing?.cover_url} alt="Pratinjau sampul" />
                                    )}

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="status">Status</Label>
                                            <select
                                                id="status"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                                            >
                                                <option value="draft">Draf</option>
                                                <option value="published">Diterbitkan</option>
                                            </select>
                                            <InputError message={errors.status} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="published_at">Tanggal terbit</Label>
                                            <Input
                                                id="published_at"
                                                type="date"
                                                value={data.published_at}
                                                onChange={(e) => setData('published_at', e.target.value)}
                                            />
                                            <InputError message={errors.published_at} />
                                        </div>
                                    </div>

                                    <div className="rounded-lg border p-4">
                                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <Label>SEO</Label>
                                                <p className="text-muted-foreground mt-1 text-xs">
                                                    Dibuat otomatis dari konten. Kosongkan untuk membuat saat disimpan.
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={generateSeo}
                                                disabled={generating || !data.title}
                                            >
                                                {generating ? 'Membuat...' : 'Buat SEO'}
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="seo_title">Judul meta</Label>
                                                    <CharCounter value={data.seo_title} max={60} />
                                                </div>
                                                <Input
                                                    id="seo_title"
                                                    value={data.seo_title}
                                                    onChange={(e) => setData('seo_title', e.target.value)}
                                                    maxLength={255}
                                                />
                                                <InputError message={errors.seo_title} />
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="seo_description">Deskripsi meta</Label>
                                                    <CharCounter value={data.seo_description} max={160} />
                                                </div>
                                                <textarea
                                                    id="seo_description"
                                                    value={data.seo_description}
                                                    onChange={(e) => setData('seo_description', e.target.value)}
                                                    rows={3}
                                                    maxLength={500}
                                                    className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                                                />
                                                <InputError message={errors.seo_description} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="seo_keywords">Kata kunci</Label>
                                                <Input
                                                    id="seo_keywords"
                                                    value={data.seo_keywords}
                                                    onChange={(e) => setData('seo_keywords', e.target.value)}
                                                />
                                                <InputError message={errors.seo_keywords} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="bg-background sticky bottom-0 mt-4 border-t pt-4">
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Menyimpan...' : editing ? 'Perbarui artikel' : 'Buat artikel'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="min-w-0 overflow-hidden rounded-xl border">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div>
                            <h3 className="font-semibold">Semua artikel</h3>
                            <p className="text-muted-foreground mt-1 text-sm">{articles.length} article(s)</p>
                        </div>
                    </div>
                    {articles.length === 0 ? (
                        <div className="text-muted-foreground px-5 py-12 text-center text-sm">
                            Belum ada artikel. Klik "Tambah artikel" untuk menulisnya.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-sm">
                                <thead className="bg-muted/40 text-muted-foreground text-left">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">Judul</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                        <th className="px-5 py-3 font-medium">SEO</th>
                                        <th className="px-5 py-3 font-medium">Diterbitkan</th>
                                        <th className="px-5 py-3 font-medium">Dibaca</th>
                                        <th className="px-5 py-3 text-right font-medium">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {articles.map((article) => (
                                        <tr key={article.id}>
                                            <td className="px-5 py-4">
                                                <p className="font-medium">{article.title}</p>
                                                <p className="text-muted-foreground text-xs">/articles/{article.slug}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <Badge variant={article.status === 'published' ? 'default' : 'outline'}>
                                                    {article.status === 'published' ? 'Diterbitkan' : 'Draf'}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-4">{article.has_seo ? '✓' : '—'}</td>
                                            <td className="px-5 py-4">{formatDate(article.published_at)}</td>
                                            <td className="px-5 py-4">{article.reading_time} menit</td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {article.status === 'published' && (
                                                        <a
                                                            href={`/articles/${article.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-muted-foreground hover:text-foreground px-2 py-1 text-xs underline"
                                                        >
                                                            Lihat
                                                        </a>
                                                    )}
                                                    <Button variant="outline" size="sm" onClick={() => openEdit(article)}>
                                                        Edit
                                                    </Button>
                                                    <ConfirmDelete
                                                        title={`Hapus artikel "${article.title}"?`}
                                                        description="Artikel ini akan dihapus secara permanen."
                                                        onDelete={() => destroy(article)}
                                                        trigger={
                                                            <Button variant="destructive" size="sm">
                                                                Delete
                                                            </Button>
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
