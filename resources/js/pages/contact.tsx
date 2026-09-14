import { SeoHead } from '@/components/SeoHead';
import { ContactInfoCards } from '@/components/public/contact-info-cards';
import PublicLayout from '@/layouts/public-layout';
import { usePublicContent } from '@/lib/public-content';
import { usePublicSiteData } from '@/lib/public-data';
import type { SharedData } from '@/types';
import { Icon } from '@iconify/react';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const PROJECT_TYPES = [
    { value: 'electrical', label: 'Kelistrikan' },
    { value: 'cathodic-protection', label: 'Proteksi Katodik' },
    { value: 'mechanical', label: 'Mekanikal' },
    { value: 'cme', label: 'CME' },
    { value: 'load-bank', label: 'Load Bank' },
    { value: 'other', label: 'Lainnya' },
];

const inputClass =
    'h-14 w-full border border-white/10 bg-panel px-4 text-sm text-white outline-none transition placeholder:text-dim/60 focus:border-cyan focus:shadow-[0_0_20px_rgba(0,217,255,.08)]';

export default function Contact() {
    const { company } = usePublicSiteData();
    const { content, media } = usePublicContent('contact');
    const { props } = usePage<SharedData>();
    const [sent, setSent] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        project_type: '',
        message: '',
    });
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: company.name,
        url: props.seo?.canonical,
        telephone: company.contact.phones[0] ?? undefined,
        email: company.contact.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: company.address.line1,
            addressLocality: company.address.city,
            addressRegion: company.address.province,
            postalCode: company.address.postalCode,
            addressCountry: company.address.country,
        },
    };
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Beranda', item: props.seo?.canonical ? new URL('/', props.seo.canonical).toString() : '/' },
            { '@type': 'ListItem', position: 2, name: 'Kontak', item: props.seo?.canonical ?? '/contact' },
        ],
    };

    return (
        <PublicLayout>
            <>
                <SeoHead
                    title={props.seo?.title ?? 'Hubungi PT. Citra Protecta Semesta'}
                    description={props.seo?.description ?? 'Hubungi CPS untuk layanan rekayasa dan konsultasi teknis.'}
                    canonicalUrl={props.seo?.canonical}
                    ogImage={props.seo?.ogImage}
                    schema={[localBusinessSchema, breadcrumbSchema]}
                />
                {/* Hero Section */}
                <section
                    className="grain grid-bg relative overflow-hidden border-b border-white/10 bg-cover bg-center pt-40"
                    style={
                        media('hero.background')?.image_url
                            ? { backgroundImage: `linear-gradient(rgba(7,9,12,.8), rgba(7,9,12,.9)), url(${media('hero.background')?.image_url})` }
                            : undefined
                    }
                >
                    <div className="border-cyan/30 absolute top-36 right-[12%] hidden h-36 w-36 border lg:block">
                        <span className="bg-cyan absolute -top-2 -left-2 h-3 w-3" />
                        <span className="border-cyan bg-ink absolute -right-2 -bottom-2 h-3 w-3 border" />
                    </div>

                    <div className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-8 lg:pb-28">
                        <div className="max-w-4xl">
                            <p className="reveal text-cyan flex items-center gap-3 font-mono text-[11px] tracking-[.22em] uppercase">
                                <span className="bg-cyan h-px w-10" />
                                {content('hero.eyebrow', 'Kontak / 01')}
                            </p>
                            <h1 className="reveal mt-7 max-w-4xl text-5xl leading-[1.02] font-semibold tracking-[-.055em] text-white delay-1 sm:text-6xl lg:text-7xl">
                                {content('hero.title', 'Mari diskusikan proyek rekayasa Anda.')}
                            </h1>
                            <p className="reveal text-soft mt-8 max-w-xl text-base leading-7 delay-2">
                                {content('hero.description', 'Memiliki kebutuhan teknis? Hubungi tim kami.')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Inquiry Form Section */}
                <section className="bg-night py-20 lg:py-28">
                    <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-24 lg:px-8">
                        <div>
                            <div className="mb-10">
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Formulir pertanyaan / 02</p>
                                <h2 className="mt-5 text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">
                                    {content('form.title', 'Kirim pesan kepada kami')}
                                </h2>
                                <p className="text-soft mt-4 max-w-lg text-sm leading-7">
                                    Sampaikan kebutuhan Anda agar tim kami dapat memahami cara mendukung proyek Anda.
                                </p>
                            </div>

                            <form
                                className="space-y-6"
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    setSent(false);
                                    post(route('contact.messages.store'), {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            setSent(true);
                                            reset();
                                        },
                                    });
                                }}
                            >
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className="text-cyan mb-3 block font-mono text-[11px] tracking-[.16em] uppercase">
                                            Nama
                                        </label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            value={data.name}
                                            onChange={(event) => setData('name', event.target.value)}
                                            placeholder="Nama lengkap Anda"
                                            className={inputClass}
                                        />
                                        {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="text-cyan mb-3 block font-mono text-[11px] tracking-[.16em] uppercase">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            placeholder="you@company.com"
                                            className={inputClass}
                                        />
                                        {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="phone" className="text-cyan mb-3 block font-mono text-[11px] tracking-[.16em] uppercase">
                                            Telepon
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            value={data.phone}
                                            onChange={(event) => setData('phone', event.target.value)}
                                            placeholder="+62"
                                            className={inputClass}
                                        />
                                        {errors.phone && <p className="mt-2 text-sm text-red-400">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="company" className="text-cyan mb-3 block font-mono text-[11px] tracking-[.16em] uppercase">
                                            Perusahaan
                                        </label>
                                        <input
                                            id="company"
                                            name="company"
                                            type="text"
                                            autoComplete="organization"
                                            value={data.company}
                                            onChange={(event) => setData('company', event.target.value)}
                                            placeholder="Nama perusahaan"
                                            className={inputClass}
                                        />
                                        {errors.company && <p className="mt-2 text-sm text-red-400">{errors.company}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="project-type" className="text-cyan mb-3 block font-mono text-[11px] tracking-[.16em] uppercase">
                                        Jenis Proyek
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="project-type"
                                            name="project_type"
                                            required
                                            value={data.project_type}
                                            onChange={(event) => setData('project_type', event.target.value)}
                                            className={`${inputClass} appearance-none pr-12`}
                                        >
                                            <option value="">Pilih jenis proyek</option>
                                            {PROJECT_TYPES.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        <Icon
                                            icon="lucide:chevron-down"
                                            className="text-dim pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg"
                                        />
                                    </div>
                                    {errors.project_type && <p className="mt-2 text-sm text-red-400">{errors.project_type}</p>}
                                </div>

                                <div>
                                    <label htmlFor="message" className="text-cyan mb-3 block font-mono text-[11px] tracking-[.16em] uppercase">
                                        Pesan
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={7}
                                        required
                                        value={data.message}
                                        onChange={(event) => setData('message', event.target.value)}
                                        placeholder="Ceritakan kebutuhan teknis Anda..."
                                        className="bg-panel placeholder:text-dim/60 focus:border-cyan w-full resize-y border border-white/10 px-4 py-4 text-sm leading-7 text-white transition outline-none focus:shadow-[0_0_20px_rgba(0,217,255,.08)]"
                                    />
                                    {errors.message && <p className="mt-2 text-sm text-red-400">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`inline-flex h-14 w-full items-center justify-center gap-3 px-7 text-xs font-bold tracking-[.16em] uppercase transition sm:w-auto ${
                                        sent ? 'text-ink-foreground bg-white' : 'bg-cyan text-ink-foreground hover:bg-white'
                                    }`}
                                >
                                    {processing ? (
                                        'Mengirim...'
                                    ) : sent ? (
                                        <>
                                            <Icon icon="lucide:check" className="text-base" /> Pertanyaan Terkirim
                                        </>
                                    ) : (
                                        <>
                                            Kirim Pertanyaan <Icon icon="lucide:arrow-up-right" className="text-base" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        <aside aria-label="Informasi kontak CPS">
                            <ContactInfoCards company={company} />
                        </aside>
                    </div>
                </section>

                {/* Location Section */}
                <section className="grid-bg bg-steel border-y border-white/10 py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-10">
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Location / 03</p>
                            <h2 className="mt-5 text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">
                                {content('location.title', 'Lokasi kantor')}
                            </h2>
                            <p className="text-soft mt-4 text-sm leading-7">
                                {content('location.description', 'Kunjungi kantor kami di Tangerang.')}
                            </p>
                        </div>

                        <div className="border-cyan/40 bg-night relative min-h-[360px] overflow-hidden border">
                            {props.siteSettings?.map_embed_url ? (
                                <iframe
                                    src={props.siteSettings.map_embed_url}
                                    title={`Map of ${company.name}`}
                                    className="h-[360px] w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    allowFullScreen
                                />
                            ) : (
                                <>
                                    <div
                                        className="absolute inset-0 opacity-60"
                                        style={{
                                            backgroundImage:
                                                'linear-gradient(rgba(0,217,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,.08) 1px, transparent 1px)',
                                            backgroundSize: '48px 48px',
                                        }}
                                    />
                                    <div className="bg-cyan/30 absolute top-[28%] left-[20%] h-px w-[60%] rotate-[18deg]" />
                                    <div className="bg-cyan/30 absolute top-[55%] left-[27%] h-px w-[48%] -rotate-[24deg]" />
                                    <div className="relative flex min-h-[360px] flex-col items-center justify-center text-center">
                                        <span className="border-cyan bg-night text-cyan flex h-16 w-16 items-center justify-center border shadow-[0_0_30px_rgba(0,217,255,.14)]">
                                            <Icon icon="lucide:map-pin" className="text-2xl" />
                                        </span>
                                        <p className="text-cyan mt-6 font-mono text-xs tracking-[.18em] uppercase">Tangerang, Indonesia</p>
                                        <p className="text-soft mt-3 max-w-sm text-sm leading-7">{company.address.full}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </>
        </PublicLayout>
    );
}
