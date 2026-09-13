import { ContactInfoCards } from '@/components/public/contact-info-cards';
import { RichText } from '@/components/public/rich-text';
import PublicLayout from '@/layouts/public-layout';
import { usePublicContent } from '@/lib/public-content';
import { usePublicSiteData } from '@/lib/public-data';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';

const SERVICES = [
    {
        code: '01 / SERVICE',
        title: (
            <>
                Service &amp;
                <br />
                Maintenance
            </>
        ),
        items: ['Energy monitoring', 'UPS & battery monitoring', 'Charger, inverter & rectifier'],
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=85',
        alt: 'Electrical maintenance equipment',
    },
    {
        code: '02 / DESIGN',
        title: (
            <>
                Design &amp;
                <br />
                Manufacture
            </>
        ),
        items: ['Electrical panel', 'Battery monitoring', 'Inverter, rectifier & cathodic protection'],
        image: 'https://images.unsplash.com/photo-1581092786450-7e3a1b4aa9b4?auto=format&fit=crop&w=1000&q=85',
        alt: 'Industrial engineering design and manufacture',
    },
    {
        code: '03 / DELIVERY',
        title: (
            <>
                Trading &amp;
                <br />
                Construction
            </>
        ),
        items: ['Electrical, mechanical & instrumentation', 'Equipment supply', 'Installation'],
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=85',
        alt: 'Industrial construction and equipment installation',
    },
];

export default function Home() {
    const { company, divisions, gallery } = usePublicSiteData();
    const { content, media } = usePublicContent('home');
    const galleryImages = gallery.filter((item) => item.image_url).map((item) => item.image_url as string);
    const heroImage =
        media('hero.background')?.image_url ??
        galleryImages[0] ??
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2200&q=85';
    const serviceImages = SERVICES.map((service, index) => galleryImages[index] ?? service.image);

    return (
        <PublicLayout preloadImage={heroImage}>
            <>
                {/* Hero Section */}
                <section className="grain relative flex min-h-[100dvh] items-end overflow-hidden border-b border-white/10">
                    <img
                        width="2200"
                        height="1200"
                        fetchPriority="high"
                        decoding="async"
                        className="hero-image absolute inset-0 h-full w-full object-cover opacity-70"
                        src={heroImage}
                        alt="Engineer inspecting industrial electrical equipment"
                    />
                    <div className="hero-overlay absolute inset-0" />
                    <div className="grid-bg absolute inset-0 opacity-30" />
                    <div className="border-cyan/30 absolute top-[35%] right-[12%] hidden h-36 w-36 border lg:block">
                        <span className="bg-cyan absolute -top-2 -left-2 h-3 w-3" />
                        <span className="border-cyan bg-ink absolute -right-2 -bottom-2 h-3 w-3 border" />
                    </div>

                    <div className="relative mx-auto w-full max-w-7xl px-6 pt-40 pb-24 lg:px-8 lg:pb-32">
                        <div className="max-w-4xl">
                            <p className="reveal text-cyan flex items-center gap-3 font-mono text-[11px] tracking-[.22em] uppercase">
                                <span className="bg-cyan h-px w-10" /> {content('hero.eyebrow', 'Engineering & Power System')}
                            </p>
                            <h1 className="reveal mt-7 max-w-4xl text-5xl delay-1 sm:text-6xl lg:text-7xl">
                                {content('hero.title', 'Reliable Engineering For Critical Infrastructure')}
                            </h1>
                            <p className="reveal text-soft mt-8 max-w-xl text-base leading-7 delay-2">
                                {content(
                                    'hero.description',
                                    'Solusi engineering andal untuk infrastruktur kritikal — didukung 80+ proyek untuk klien seperti Pertamina, PLN, dan Telkomsel.',
                                )}
                            </p>
                            <div className="reveal mt-10 flex flex-col gap-3 delay-3 sm:flex-row">
                                <Link
                                    href="/services"
                                    className="bg-cyan text-ink-foreground inline-flex h-14 items-center justify-center gap-3 px-6 text-xs font-bold tracking-[.15em] uppercase transition hover:bg-white"
                                >
                                    Explore Services <Icon icon="lucide:arrow-down-right" className="text-base" />
                                </Link>
                                <Link
                                    href="/projects"
                                    className="hover:border-cyan hover:text-cyan inline-flex h-14 items-center justify-center gap-3 border border-white/20 px-6 text-xs font-bold tracking-[.15em] text-white uppercase transition"
                                >
                                    View Projects <Icon icon="lucide:arrow-up-right" className="text-base" />
                                </Link>
                            </div>
                        </div>
                        <div className="text-dim mt-20 flex items-center gap-8 font-mono text-[10px] tracking-[.18em] uppercase">
                            <span>PT. CITRA PROTECTA SEMESTA</span>
                            <span className="bg-cyan/50 hidden h-px w-16 sm:block" />
                            <span className="hidden sm:block">Electrical &amp; Electronic Engineering</span>
                        </div>
                    </div>
                </section>

                {/* Company Section */}
                <section id="company" className="bg-night relative py-24 lg:py-36">
                    <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-24 lg:px-8">
                        <div className="relative min-h-[500px] overflow-hidden border border-white/10">
                            <img
                                className="h-full min-h-[500px] w-full object-cover grayscale-[.35] transition duration-700 hover:scale-105"
                                src={
                                    media('company.image')?.image_url ??
                                    'https://images.unsplash.com/photo-1581092919535-7146ff1a590b?auto=format&fit=crop&w=1400&q=85'
                                }
                                alt="Industrial electrical control room"
                                loading="lazy"
                            />
                            <div className="from-ink/75 to-cyan/10 absolute inset-0 bg-gradient-to-tr via-transparent" />
                            <div className="border-cyan absolute bottom-6 left-6 border-l pl-4 font-mono text-[10px] tracking-[.16em] text-white uppercase">
                                Engineering division
                                <br />
                                <span className="text-cyan">01 / CPS</span>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">{content('company.eyebrow', 'Company / 01')}</p>
                            <h2 className="mt-6 max-w-xl text-4xl leading-[1.03] font-semibold tracking-[-.05em] text-white sm:text-6xl">
                                {content('company.title', 'Built around engineering expertise.')}
                            </h2>
                            <RichText
                                value={content(
                                    'company.description',
                                    'PT. Citra Protecta Semesta adalah perusahaan Electrical & Electronic Engineering yang berfokus pada solusi teknis, sistem kustom, dan dukungan proyek untuk infrastruktur kritikal.',
                                )}
                                className="text-soft mt-8 max-w-xl text-[15px] leading-8"
                            />
                            <p className="text-soft mt-5 max-w-xl text-[15px] leading-8">
                                Kapabilitas kami tersusun dalam tiga divisi inti: Service &amp; Maintenance, Design &amp; Manufacture, dan Trading
                                &amp; Construction.
                            </p>
                            <div className="mt-10 border-t border-white/10">
                                {divisions.map((division, index) => (
                                    <Link
                                        key={division.id}
                                        href="/services"
                                        className="hover:text-cyan flex items-center justify-between border-b border-white/10 py-5 transition"
                                    >
                                        <span className="text-cyan font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
                                        <span className="text-sm text-white">{division.name.replace(/ Division$/, '')}</span>
                                        <Icon icon="lucide:arrow-up-right" className="text-dim" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Preview Section */}
                <section id="services" className="bg-ink relative py-24 lg:py-36">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Capabilities / 02</p>
                                <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Engineering in action.</h2>
                            </div>
                            <Link
                                href="/services"
                                className="text-cyan inline-flex items-center gap-2 text-sm font-semibold tracking-[.14em] uppercase hover:underline"
                            >
                                View All Services Details <Icon icon="lucide:arrow-right" className="text-base" />
                            </Link>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-3">
                            {SERVICES.map((service, index) => (
                                <Link
                                    key={service.code}
                                    href="/services"
                                    className="service-card group bg-panel hover:border-cyan/70 relative overflow-hidden border border-white/10 transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(0,217,255,.08)]"
                                >
                                    <div className="h-56 overflow-hidden">
                                        <img
                                            className="h-full w-full object-cover transition duration-700"
                                            src={serviceImages[index]}
                                            alt={service.alt}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-7">
                                        <div className="flex items-start justify-between">
                                            <span className="text-cyan font-mono text-xs">{service.code}</span>
                                            <Icon icon="lucide:arrow-up-right" className="arrow text-cyan text-xl transition-transform" />
                                        </div>
                                        <h3 className="mt-8 text-2xl font-semibold tracking-[-.04em]">{service.title}</h3>
                                        <ul className="text-soft mt-7 space-y-3 border-t border-white/10 pt-6 text-sm">
                                            {service.items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact CTA Section */}
                <section id="contact" className="bg-night relative border-t border-white/10 py-24 lg:py-36">
                    <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
                        <div>
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Contact / 07</p>
                            <h2 className="mt-6 max-w-2xl text-5xl leading-[.95] font-semibold tracking-[-.06em] sm:text-7xl">
                                Have an engineering
                                <br />
                                <span className="text-cyan">project in mind?</span>
                            </h2>
                            <p className="text-soft mt-8 text-lg">Let's discuss your technical requirements.</p>
                            <Link
                                href="/contact"
                                className="bg-cyan text-ink-foreground mt-10 inline-flex h-14 items-center gap-3 px-7 text-xs font-bold tracking-[.16em] uppercase transition hover:bg-white"
                            >
                                Contact CPS <Icon icon="lucide:arrow-up-right" className="text-base" />
                            </Link>
                        </div>
                        <div>
                            <ContactInfoCards company={company} />
                        </div>
                    </div>
                </section>
            </>
        </PublicLayout>
    );
}
