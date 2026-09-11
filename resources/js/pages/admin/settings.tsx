import { TextField } from '@/components/admin/form-fields';
import { ImageUploadPreview } from '@/components/admin/image-upload-preview';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, type SiteSetting } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Website Settings', href: '/admin/settings' },
];

export default function Settings({ siteSetting }: { siteSetting: SiteSetting }) {
    const { flash } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, transform } = useForm<{
        site_name: string;
        tagline: string;
        about: string;
        address_line1: string;
        city: string;
        province: string;
        postal_code: string;
        country: string;
        phones: string[];
        fax: string;
        email: string;
        website: string;
        whatsapp_number: string;
        whatsapp_message: string;
        logo: File | null;
        map_embed_url: string;
        seo_title: string;
        seo_description: string;
        social_facebook: string;
        social_instagram: string;
        social_linkedin: string;
        social_youtube: string;
        og_image: File | null;
    }>({
        site_name: siteSetting.site_name ?? '',
        tagline: siteSetting.tagline ?? '',
        about: siteSetting.about ?? '',
        address_line1: siteSetting.address_line1 ?? '',
        city: siteSetting.city ?? '',
        province: siteSetting.province ?? '',
        postal_code: siteSetting.postal_code ?? '',
        country: siteSetting.country ?? '',
        phones: siteSetting.phones ?? [],
        fax: siteSetting.fax ?? '',
        email: siteSetting.email ?? '',
        website: siteSetting.website ?? '',
        whatsapp_number: siteSetting.whatsapp_number ?? '',
        whatsapp_message: siteSetting.whatsapp_message ?? '',
        logo: null,
        map_embed_url: siteSetting.map_embed_url ?? '',
        seo_title: siteSetting.seo_title ?? '',
        seo_description: siteSetting.seo_description ?? '',
        social_facebook: siteSetting.social_facebook ?? '',
        social_instagram: siteSetting.social_instagram ?? '',
        social_linkedin: siteSetting.social_linkedin ?? '',
        social_youtube: siteSetting.social_youtube ?? '',
        og_image: null,
    });

    const setPhone = (index: number, value: string) => {
        setData(
            'phones',
            data.phones.map((phone, i) => (i === index ? value : phone)),
        );
    };

    const addPhone = () => setData('phones', [...data.phones, '']);

    const removePhone = (index: number) =>
        setData(
            'phones',
            data.phones.filter((_, i) => i !== index),
        );

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        transform((formData) => ({
            ...formData,
            _method: 'put',
        }));
        post(route('admin.settings.update'), { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Website Settings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <h2 className="text-xl font-semibold">Website Settings</h2>
                    <p className="text-muted-foreground text-sm">Company profile information used across the site.</p>
                </div>

                {flash?.success && (
                    <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">{flash.success}</div>
                )}

                <form onSubmit={submit} className="max-w-2xl space-y-6">
                    <div className="rounded-lg border p-6">
                        <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">General</h3>
                        <div className="space-y-4">
                            <TextField
                                id="site_name"
                                label="Site Name"
                                value={data.site_name}
                                onChange={(v) => setData('site_name', v)}
                                error={errors.site_name}
                                required
                            />
                            <TextField
                                id="tagline"
                                label="Tagline"
                                value={data.tagline}
                                onChange={(v) => setData('tagline', v)}
                                error={errors.tagline}
                            />
                            <RichTextEditor
                                id="about"
                                label="About"
                                value={data.about}
                                onChange={(value) => setData('about', value)}
                                error={errors.about}
                                rows={6}
                                hint="This content is rendered on public company sections."
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border p-6">
                        <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">Address</h3>
                        <div className="space-y-4">
                            <TextField
                                id="address_line1"
                                label="Address Line"
                                value={data.address_line1}
                                onChange={(v) => setData('address_line1', v)}
                                error={errors.address_line1}
                            />
                            <div className="grid gap-4 sm:grid-cols-3">
                                <TextField id="city" label="City" value={data.city} onChange={(v) => setData('city', v)} error={errors.city} />
                                <TextField
                                    id="province"
                                    label="Province"
                                    value={data.province}
                                    onChange={(v) => setData('province', v)}
                                    error={errors.province}
                                />
                                <TextField
                                    id="postal_code"
                                    label="Postal Code"
                                    value={data.postal_code}
                                    onChange={(v) => setData('postal_code', v)}
                                    error={errors.postal_code}
                                />
                            </div>
                            <TextField
                                id="country"
                                label="Country"
                                value={data.country}
                                onChange={(v) => setData('country', v)}
                                error={errors.country}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border p-6">
                        <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">Contact</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium">Phone Numbers</label>
                                <div className="space-y-2">
                                    {data.phones.map((phone, index) => (
                                        <div key={index} className="grid gap-2">
                                            <label className="text-muted-foreground text-xs">
                                                {index === 0 ? 'Phone' : index === 1 ? 'Mobile (WhatsApp)' : `Additional Phone ${index - 1}`}
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={phone}
                                                    onChange={(e) => setPhone(index, e.target.value)}
                                                    className="border-input bg-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                                                />
                                                <Button type="button" variant="outline" size="sm" onClick={() => removePhone(index)}>
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={addPhone}>
                                    Add Phone
                                </Button>
                                {errors.phones && <p className="mt-2 text-sm text-red-600">{errors.phones}</p>}
                            </div>
                            <TextField id="fax" label="Fax" value={data.fax} onChange={(v) => setData('fax', v)} error={errors.fax} />
                            <TextField
                                id="email"
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(v) => setData('email', v)}
                                error={errors.email}
                            />
                            <TextField
                                id="website"
                                label="Website"
                                value={data.website}
                                onChange={(v) => setData('website', v)}
                                error={errors.website}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border p-6">
                        <h3 className="text-muted-foreground mb-1 text-sm font-semibold tracking-wide uppercase">WhatsApp Popup</h3>
                        <p className="text-muted-foreground mb-4 text-sm">Configure the floating WhatsApp button shown on public pages.</p>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label htmlFor="whatsapp_number" className="text-sm font-medium">
                                    WhatsApp Number
                                </label>
                                <input
                                    id="whatsapp_number"
                                    value={data.phones[1] ?? ''}
                                    readOnly
                                    className="border-input bg-muted/50 text-muted-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm"
                                />
                                <p className="text-muted-foreground text-xs">Automatically uses the Mobile number above.</p>
                            </div>
                            <TextField
                                id="whatsapp_message"
                                label="WhatsApp Opening Message"
                                value={data.whatsapp_message}
                                onChange={(v) => setData('whatsapp_message', v)}
                                error={errors.whatsapp_message}
                                placeholder="Hello, I would like to ask about your services."
                                hint="This message is prefilled when a visitor starts a WhatsApp chat."
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border p-6">
                        <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">SEO &amp; Social</h3>
                        <div className="space-y-4">
                            <TextField
                                id="seo_title"
                                label="Default SEO Title"
                                value={data.seo_title}
                                onChange={(v) => setData('seo_title', v)}
                                error={errors.seo_title}
                                hint="Used as the default title when a page does not define its own title."
                            />
                            <div>
                                <label htmlFor="seo_description" className="mb-1 block text-sm font-medium">
                                    Default SEO Description
                                </label>
                                <textarea
                                    id="seo_description"
                                    value={data.seo_description}
                                    onChange={(event) => setData('seo_description', event.target.value)}
                                    maxLength={320}
                                    rows={4}
                                    className="border-input bg-background focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                                />
                                <p className="text-muted-foreground mt-1 text-xs">
                                    Recommended: 120–160 characters. {data.seo_description.length}/320
                                </p>
                                {errors.seo_description && <p className="text-destructive text-sm">{errors.seo_description}</p>}
                            </div>
                            <TextField
                                id="social_facebook"
                                label="Facebook URL"
                                value={data.social_facebook}
                                onChange={(v) => setData('social_facebook', v)}
                                error={errors.social_facebook}
                            />
                            <TextField
                                id="social_instagram"
                                label="Instagram URL"
                                value={data.social_instagram}
                                onChange={(v) => setData('social_instagram', v)}
                                error={errors.social_instagram}
                            />
                            <TextField
                                id="social_linkedin"
                                label="LinkedIn URL"
                                value={data.social_linkedin}
                                onChange={(v) => setData('social_linkedin', v)}
                                error={errors.social_linkedin}
                            />
                            <TextField
                                id="social_youtube"
                                label="YouTube URL"
                                value={data.social_youtube}
                                onChange={(v) => setData('social_youtube', v)}
                                error={errors.social_youtube}
                            />
                            <div className="grid gap-2">
                                <label htmlFor="og_image" className="text-sm font-medium">
                                    Open Graph Image
                                </label>
                                <ImageUploadPreview
                                    file={data.og_image}
                                    currentUrl={siteSetting.og_image_url}
                                    alt="Open Graph preview"
                                    className="h-32 w-full rounded border object-cover"
                                />
                                <input
                                    id="og_image"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(event) => setData('og_image', event.target.files?.[0] ?? null)}
                                    className="border-input bg-background file:bg-muted w-full rounded-md border text-sm file:mr-4 file:border-0 file:px-4 file:py-2"
                                />
                                <p className="text-muted-foreground text-xs">JPG, PNG, atau WebP. Recommended 1200×630 px. Maksimal 4 MB.</p>
                                {errors.og_image && <p className="text-destructive text-sm">{errors.og_image}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border p-6">
                        <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wide uppercase">Branding &amp; Map</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label htmlFor="logo" className="text-sm font-medium">
                                    Website Logo
                                </label>
                                <ImageUploadPreview
                                    file={data.logo}
                                    currentUrl={siteSetting.logo_url}
                                    alt="Website logo"
                                    className="h-16 w-fit max-w-64 rounded border object-contain p-2"
                                />
                                <input
                                    id="logo"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                                    onChange={(event) => setData('logo', event.target.files?.[0] ?? null)}
                                    className="border-input bg-background file:bg-muted w-full rounded-md border text-sm file:mr-4 file:border-0 file:px-4 file:py-2"
                                />
                                <p className="text-muted-foreground text-xs">JPG, PNG, WebP, atau SVG. Maksimal 2 MB.</p>
                                {errors.logo && <p className="text-destructive text-sm">{errors.logo}</p>}
                            </div>
                            <TextField
                                id="map_embed_url"
                                label="Google Maps Embed URL"
                                value={data.map_embed_url}
                                onChange={(v) => setData('map_embed_url', v)}
                                error={errors.map_embed_url}
                                placeholder="https://www.google.com/maps/embed?pb=..."
                            />
                            <p className="text-muted-foreground text-xs">Gunakan URL embed HTTPS dari Google Maps, bukan URL halaman biasa.</p>
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        Save Settings
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
