import { ImageUploadPreview } from '@/components/admin/image-upload-preview';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageContent as PageContentItem, PageMedia, SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useMemo } from 'react';

function SectionMediaUpload({
    section,
    media,
    data,
    setData,
    errors,
}: {
    section: string;
    media: PageMedia[];
    data: ContentFormData;
    setData: <K extends keyof ContentFormData>(key: K, value: ContentFormData[K]) => void;
    errors: Record<string, string | undefined>;
}) {
    const mediaSlot = media.filter((item) => item.section_key === section)[0];
    const mediaKey = `media.${section}`;
    const mediaData = data.media[section] ?? { media_key: mediaSlot?.media_key ?? 'image', alt_text: mediaSlot?.alt_text ?? '', image: null };

    return (
        <div className="mt-6 border-t pt-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold">Gambar bagian</p>
                    <p className="text-muted-foreground mt-1 text-xs">Gambar akan disimpan bersama teks saat Anda menekan tombol Simpan konten.</p>
                </div>
                {mediaSlot && <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs">Gambar saat ini</span>}
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
                <div>
                    {mediaSlot?.image_url ? (
                        <img
                            src={mediaSlot.image_url}
                            alt={mediaSlot.alt_text ?? `${section} image`}
                            className="h-28 w-full rounded-md border object-cover"
                        />
                    ) : (
                        <div className="bg-muted/50 text-muted-foreground flex h-28 items-center justify-center rounded-md border border-dashed text-xs">
                            Belum ada gambar yang diunggah
                        </div>
                    )}
                </div>
                <div className="space-y-3">
                    <div>
                        <Label htmlFor={`media-alt-${section}`} className="mb-2 block text-xs">
                            Teks alt
                        </Label>
                        <Input
                            id={`media-alt-${section}`}
                            placeholder={`Jelaskan gambar ${formatLabel(section, sectionLabels).toLowerCase()}`}
                            value={mediaData.alt_text}
                            onChange={(event) => setData('media', { ...data.media, [section]: { ...mediaData, alt_text: event.target.value } })}
                        />
                        {errors[`${mediaKey}.alt_text`] && <p className="text-destructive mt-1 text-xs">{errors[`${mediaKey}.alt_text`]}</p>}
                    </div>
                    <div>
                        <Label htmlFor={`media-file-${section}`} className="mb-2 block text-xs">
                            Pilih gambar
                        </Label>
                        <Input
                            id={`media-file-${section}`}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(event) =>
                                setData('media', { ...data.media, [section]: { ...mediaData, image: event.target.files?.[0] ?? null } })
                            }
                            className="file:bg-muted file:text-foreground file:mr-4 file:border-0 file:px-3 file:py-1.5"
                        />
                        <ImageUploadPreview
                            file={mediaData.image}
                            currentUrl={mediaSlot?.image_url}
                            alt={mediaData.alt_text || `${section} image`}
                            className="mt-3 h-28 w-full rounded-md border object-cover"
                        />
                        <p className="text-muted-foreground mt-1 text-xs">JPG, PNG, atau WebP. Maksimal 5 MB.</p>
                        {errors[`${mediaKey}.image`] && <p className="text-destructive mt-1 text-xs">{errors[`${mediaKey}.image`]}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Konten Situs Web', href: '/admin/content' },
];

const pageLabels: Record<string, string> = {
    home: 'Beranda',
    about: 'Tentang',
    services: 'Layanan',
    projects: 'Proyek',
    contact: 'Kontak',
    consultation: 'Konsultasi',
};

type ContentMediaForm = {
    media_key: string;
    alt_text: string;
    image: File | null;
};

type ContentFormData = {
    page_key: string;
    contents: Record<string, string>;
    media: Record<string, ContentMediaForm>;
};

const sectionLabels: Record<string, string> = {
    hero: 'Bagian hero',
    company: 'Bagian perusahaan',
    services: 'Bagian layanan',
    delivery: 'Bagian pelaksanaan',
    standards: 'Bagian standar',
    portfolio: 'Bagian portofolio',
    scope: 'Bagian cakupan',
    sectors: 'Bagian sektor',
    capabilities: 'Bagian kapabilitas',
    contact_cta: 'Ajakan bertindak kontak',
    cta: 'Ajakan bertindak',
    mission: 'Bagian misi',
    team: 'Bagian tim',
    references: 'Bagian referensi',
    form: 'Bagian formulir',
    location: 'Bagian lokasi',
};

const fieldLabels: Record<string, string> = {
    eyebrow: 'Label pengantar',
    title: 'Judul',
    subtitle: 'Subjudul',
    description: 'Deskripsi',
    primary_cta: 'Label tombol utama',
    secondary_cta: 'Label tombol sekunder',
    success_message: 'Pesan sukses',
};

const formatLabel = (value: string, labels: Record<string, string>) =>
    labels[value] ?? value.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());

export default function Content({
    page,
    pages,
    contents,
    media,
}: {
    page: string;
    pages: string[];
    contents: PageContentItem[];
    media: PageMedia[];
}) {
    const { flash } = usePage<SharedData>().props;
    const contentForm = useForm<ContentFormData>({
        page_key: page,
        contents: Object.fromEntries(contents.map((item) => [`${item.section_key}.${item.field_key}`, item.value ?? ''])),
        media: Object.fromEntries(media.map((item) => [item.section_key, { media_key: item.media_key, alt_text: item.alt_text ?? '', image: null }])),
    });
    const groupedContents = useMemo(() => {
        return contents.reduce<Record<string, PageContentItem[]>>((groups, item) => {
            groups[item.section_key] ??= [];
            groups[item.section_key].push(item);
            return groups;
        }, {});
    }, [contents]);

    const selectPage = (value: string) => router.get(route('admin.content.index'), { page: value });
    const saveContent: FormEventHandler = (event) => {
        event.preventDefault();
        contentForm.transform((formData) => {
            const media = Object.fromEntries(
                Object.entries(formData.media).map(([section, item]) => [
                    section,
                    { media_key: item.media_key, alt_text: item.alt_text, image: item.image },
                ]),
            );

            return { ...formData, media, _method: 'put' };
        });
        contentForm.post(route('admin.content.update'), { forceFormData: true, preserveScroll: true });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Konten Situs Web" />
            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                <header className="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">CMS Situs Web</p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Konten Situs Web</h2>
                        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
                            Kelola teks dan media halaman publik tanpa mengubah kode aplikasi.
                        </p>
                    </div>
                    <div className="min-w-52">
                        <Label htmlFor="page-selector" className="mb-2 block text-xs font-medium">
                            Halaman yang diedit
                        </Label>
                        <select
                            id="page-selector"
                            value={page}
                            onChange={(event) => selectPage(event.target.value)}
                            className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-2"
                        >
                            {pages.map((item) => (
                                <option key={item} value={item}>
                                    {pageLabels[item] ?? item}
                                </option>
                            ))}
                        </select>
                    </div>
                </header>

                {flash?.success && (
                    <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] xl:items-start">
                    <div className="min-w-0 space-y-5">
                        <form onSubmit={saveContent} className="space-y-5">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">Editor teks</p>
                                    <h3 className="mt-1 text-lg font-semibold">{pageLabels[page] ?? page} konten halaman</h3>
                                </div>
                                <span className="text-muted-foreground text-xs">{contents.length} bidang yang dapat diedit</span>
                            </div>

                            {Object.entries(groupedContents).map(([section, items]) => (
                                <section key={section} className="bg-card rounded-xl border p-5 shadow-sm sm:p-6">
                                    <div className="mb-5 flex items-start justify-between gap-4 border-b pb-4">
                                        <div>
                                            <h4 className="font-semibold">{formatLabel(section, sectionLabels)}</h4>
                                            <p className="text-muted-foreground mt-1 text-xs">Edit teks yang ditampilkan di bagian ini.</p>
                                        </div>
                                        <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium">
                                            {items.length} {items.length === 1 ? 'bidang' : 'bidang'}
                                        </span>
                                    </div>
                                    <div className="grid gap-5 md:grid-cols-2">
                                        {items.map((item) => {
                                            const key = `${item.section_key}.${item.field_key}`;
                                            const value = contentForm.data.contents[key] ?? '';
                                            const isLongText =
                                                item.field_key === 'description' || item.field_key === 'success_message' || value.length > 120;
                                            const error = (contentForm.errors as Record<string, string | undefined>)[`contents.${key}`];

                                            return (
                                                <div key={key} className={isLongText ? 'md:col-span-2' : ''}>
                                                    {isLongText ? (
                                                        <RichTextEditor
                                                            id={key}
                                                            label={formatLabel(item.field_key, fieldLabels)}
                                                            value={value}
                                                            onChange={(nextValue) =>
                                                                contentForm.setData('contents', {
                                                                    ...contentForm.data.contents,
                                                                    [key]: nextValue,
                                                                })
                                                            }
                                                            error={error}
                                                            rows={5}
                                                            hint={`Key: ${key}`}
                                                        />
                                                    ) : (
                                                        <>
                                                            <Label htmlFor={key} className="mb-2 block">
                                                                {formatLabel(item.field_key, fieldLabels)}
                                                            </Label>
                                                            <Input
                                                                id={key}
                                                                value={value}
                                                                onChange={(event) =>
                                                                    contentForm.setData('contents', {
                                                                        ...contentForm.data.contents,
                                                                        [key]: event.target.value,
                                                                    })
                                                                }
                                                                maxLength={5000}
                                                            />
                                                            <div className="mt-1 flex items-start justify-between gap-3">
                                                                <p className="text-muted-foreground text-xs">Key: {key}</p>
                                                                <p className="text-muted-foreground shrink-0 text-xs">{value.length}/5000</p>
                                                            </div>
                                                            {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <SectionMediaUpload
                                        section={section}
                                        media={media}
                                        data={contentForm.data}
                                        setData={contentForm.setData}
                                        errors={contentForm.errors as Record<string, string | undefined>}
                                    />
                                </section>
                            ))}

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-muted-foreground text-xs">Perubahan hanya diterapkan pada halaman yang dipilih.</p>
                                <Button type="submit" disabled={contentForm.processing} className="sm:min-w-32">
                                    {contentForm.processing ? 'Menyimpan…' : 'Simpan konten'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    <aside className="space-y-5">
                        <section className="bg-card rounded-xl border p-5 shadow-sm sm:p-6">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">Aset visual</p>
                                    <h3 className="mt-1 font-semibold">Media halaman</h3>
                                    <p className="text-muted-foreground mt-1 text-xs">Unggah gambar langsung di dalam bagian terkait.</p>
                                </div>
                                <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium">{media.length}</span>
                            </div>
                            {media.length > 0 ? (
                                <div className="space-y-3">
                                    {media.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.alt_text ?? item.media_key}
                                                    className="h-12 w-16 rounded border object-cover"
                                                />
                                            ) : (
                                                <div className="bg-muted text-muted-foreground flex h-12 w-16 items-center justify-center rounded border text-[10px]">
                                                    Tidak ada pratinjau
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">{formatLabel(item.section_key, sectionLabels)}</p>
                                                <p className="text-muted-foreground mt-1 truncate text-xs">Slot: {item.media_key}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-muted/50 text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
                                    Belum ada media yang diunggah untuk halaman ini.
                                </div>
                            )}
                        </section>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
