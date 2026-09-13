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
    { title: 'Articles', href: '/admin/articles' },
];

export interface AdminArticle {
    id: number;
    title: string;
    slug: string;
    status: string;
    published_at: string | null;
    created_at: string;
    cover_url: string | null;
    has_seo: boolean;
    reading_time: number;
}

function formatDate(value: string | null): string {
    if (!value) return '—';
    return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(value));
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
    const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm({ ...emptyForm });

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
            status: article.status,
            published_at: article.published_at ? article.published_at.slice(0, 10) : '',
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
                setError('seo_title', 'Failed to generate SEO. Please try again.');
            })
            .finally(() => setGenerating(false));
    };

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        clearErrors();
        setData('slug', slugify(data.slug));

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
            <Head title="Articles" />
            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">Content</p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Articles</h2>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Write articles with automatic SEO generation. Published articles appear in /articles and the sitemap.
                        </p>
                        {flash?.success && <p className="text-success mt-2 text-sm">{flash.success}</p>}
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreate}>Add article</Button>
                        </DialogTrigger>
                        <DialogContent className="h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] overflow-hidden sm:max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>{editing ? 'Edit article' : 'Add article'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={submit} className="flex min-h-0 flex-col">
                                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-2">
                                    <TextField
                                        id="title"
                                        label="Title"
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
                                                Generate from title
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
                                            URL: /articles/{data.slug ? slugify(data.slug) : '…'} — leave empty to auto-generate from the title.
                                        </p>
                                        <InputError message={errors.slug} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="excerpt">Excerpt</Label>
                                        <Input
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) => setData('excerpt', e.target.value)}
                                            placeholder="Short summary used for SEO description"
                                            maxLength={500}
                                        />
                                        <InputError message={errors.excerpt} />
                                    </div>

                                    <RichTextEditor
                                        id="content"
                                        label="Content"
                                        value={data.content}
                                        onChange={(value) => setData('content', value)}
                                        error={errors.content}
                                        rows={12}
                                        hint="Use H2/H3 headings to structure the article for SEO."
                                        uploadUrl={route('admin.articles.upload-image')}
                                    />

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="cover">Cover image</Label>
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
                                            label="Cover alt text"
                                            value={data.cover_alt}
                                            onChange={(value) => setData('cover_alt', value)}
                                            error={errors.cover_alt}
                                            placeholder="Describe the cover image"
                                        />
                                    </div>
                                    {data.cover && <ImageUploadPreview file={data.cover} currentUrl={null} alt="Cover preview" />}

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="status">Status</Label>
                                            <select
                                                id="status"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                            </select>
                                            <InputError message={errors.status} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="published_at">Publish date</Label>
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
                                                    Auto-generated from the content. Leave empty to generate on save.
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                onClick={generateSeo}
                                                disabled={generating || !data.title}
                                            >
                                                {generating ? 'Generating...' : 'Generate SEO'}
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="seo_title">Meta title</Label>
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
                                                    <Label htmlFor="seo_description">Meta description</Label>
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
                                                <Label htmlFor="seo_keywords">Keywords</Label>
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
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : editing ? 'Update article' : 'Create article'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <section className="min-w-0 overflow-hidden rounded-xl border">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div>
                            <h3 className="font-semibold">All articles</h3>
                            <p className="text-muted-foreground mt-1 text-sm">{articles.length} article(s)</p>
                        </div>
                    </div>
                    {articles.length === 0 ? (
                        <div className="text-muted-foreground px-5 py-12 text-center text-sm">No articles yet. Click "Add article" to write one.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-sm">
                                <thead className="bg-muted/40 text-muted-foreground text-left">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">Title</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                        <th className="px-5 py-3 font-medium">SEO</th>
                                        <th className="px-5 py-3 font-medium">Published</th>
                                        <th className="px-5 py-3 font-medium">Read</th>
                                        <th className="px-5 py-3 text-right font-medium">Actions</th>
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
                                                    {article.status === 'published' ? 'Published' : 'Draft'}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-4">{article.has_seo ? '✓' : '—'}</td>
                                            <td className="px-5 py-4">{formatDate(article.published_at)}</td>
                                            <td className="px-5 py-4">{article.reading_time} min</td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {article.status === 'published' && (
                                                        <a
                                                            href={`/articles/${article.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-muted-foreground hover:text-foreground px-2 py-1 text-xs underline"
                                                        >
                                                            View
                                                        </a>
                                                    )}
                                                    <Button variant="outline" size="sm" onClick={() => openEdit(article)}>
                                                        Edit
                                                    </Button>
                                                    <ConfirmDelete
                                                        title={`Delete article "${article.title}"?`}
                                                        description="This will remove the article permanently."
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
