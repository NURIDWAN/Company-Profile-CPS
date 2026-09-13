import { RichText } from '@/components/public/rich-text';
import PublicLayout from '@/layouts/public-layout';
import { usePublicContent } from '@/lib/public-content';
import { usePublicSiteData } from '@/lib/public-data';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';

const DIVISION_IMAGES = [
    'https://images.unsplash.com/photo-1581092919535-7146ff1a590b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1581092786450-7e3a1b4aa9b4?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=85',
];

const DIVISION_TAGLINES = [
    'Keep Your Systems Running at Peak Performance',
    'Custom Solutions Built to Your Specifications',
    'Equipment Supply and Professional Installation Services',
];

const DELIVERY_STEPS = [
    { icon: 'lucide:search-check', title: 'Assessment', description: 'Comprehensive analysis of your technical requirements and system needs.' },
    { icon: 'lucide:route', title: 'Planning', description: 'Detailed engineering planning and customized solution design.' },
    { icon: 'lucide:settings-2', title: 'Execution', description: 'Professional implementation with quality assurance and testing.' },
    { icon: 'lucide:headphones', title: 'Support', description: 'Ongoing maintenance, monitoring, and technical support.' },
];

const STANDARDS = [
    {
        icon: 'lucide:cpu',
        title: 'Technical Precision',
        description: 'Engineering solutions designed with meticulous attention to technical detail.',
    },
    { icon: 'lucide:zap', title: 'Fast Turnaround', description: 'Quick response and efficient project execution without compromising quality.' },
    { icon: 'lucide:check-circle-2', title: 'Quality Assurance', description: 'Rigorous testing and quality control at every stage of delivery.' },
];

export default function Services() {
    const { divisions, gallery } = usePublicSiteData();
    const { content, media } = usePublicContent('services');
    const galleryImages = gallery.filter((item) => item.image_url).map((item) => item.image_url as string);
    const divisionCards = divisions.map((division, index) => ({
        code: `${String(index + 1).padStart(2, '0')} / ${division.name.replace(/ Division$/, '')}`,
        title: division.name.replace(/ Division$/, ''),
        tagline: DIVISION_TAGLINES[index] ?? 'Technical engineering support for critical systems',
        description: division.description ?? '',
        items: division.points ?? [],
        image: division.image_url ?? galleryImages[index] ?? DIVISION_IMAGES[index],
        alt: `${division.name} at CPS`,
    }));

    return (
        <PublicLayout>
            <>
                {/* Hero Section */}
                <section className="grain relative flex min-h-[600px] items-end overflow-hidden border-b border-white/10 lg:min-h-[700px]">
                    <img
                        className="hero-image absolute inset-0 h-full w-full object-cover opacity-65"
                        src={
                            media('hero.background')?.image_url ??
                            galleryImages[0] ??
                            'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=2200&q=85'
                        }
                        alt="Engineer inspecting industrial electrical equipment"
                    />
                    <div className="hero-overlay absolute inset-0" />
                    <div className="grid-bg absolute inset-0 opacity-30" />

                    <div className="border-cyan/30 absolute top-[34%] right-[12%] hidden h-36 w-36 border lg:block">
                        <span className="bg-cyan absolute -top-2 -left-2 h-3 w-3" />
                        <span className="border-cyan bg-ink absolute -right-2 -bottom-2 h-3 w-3 border" />
                    </div>

                    <div className="relative mx-auto w-full max-w-7xl px-6 pt-36 pb-20 lg:px-8 lg:pb-28">
                        <div className="max-w-3xl">
                            <p className="reveal text-cyan flex items-center gap-3 font-mono text-[11px] tracking-[.22em] uppercase">
                                <span className="bg-cyan h-px w-10" />
                                {content('hero.eyebrow', 'Services / 01')}
                            </p>
                            <h1 className="reveal mt-7 text-5xl leading-[.98] font-semibold tracking-[-.06em] text-white delay-1 sm:text-6xl lg:text-7xl">
                                {content('hero.title', 'Our Services')}
                            </h1>
                            <p className="reveal mt-7 max-w-2xl text-xl leading-8 font-medium text-white delay-2 sm:text-2xl">
                                {content('hero.subtitle', 'Comprehensive Engineering Solutions Across Three Core Divisions')}
                            </p>
                            <p className="reveal text-soft mt-6 max-w-2xl text-base leading-7 delay-3">
                                {content(
                                    'hero.description',
                                    'From maintenance and optimization to design and manufacturing, CPS delivers end-to-end engineering solutions built for reliability and precision.',
                                )}
                            </p>
                        </div>

                        <div className="text-dim mt-16 flex items-center gap-8 font-mono text-[10px] tracking-[.18em] uppercase">
                            <span>Electrical &amp; Electronic Engineering</span>
                            <span className="bg-cyan/50 hidden h-px w-16 sm:block" />
                            <span className="hidden sm:block">Technical capability / CPS</span>
                        </div>
                    </div>
                </section>

                {/* Core Divisions Section */}
                <section className="bg-ink py-24 lg:py-36">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-14 max-w-2xl">
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Core divisions / 02</p>
                            <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
                                {content('divisions.title', 'Engineering in action.')}
                            </h2>
                            <p className="text-soft mt-6 text-base leading-7">
                                Three divisions built to support electrical and electronic engineering requirements from design through execution.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                            {divisionCards.map((division) => (
                                <article
                                    key={division.code}
                                    className="service-card group bg-panel hover:border-cyan/70 overflow-hidden border border-white/10 transition duration-500 hover:-translate-y-1"
                                >
                                    <div className="h-80 overflow-hidden">
                                        <img
                                            className="h-full w-full object-cover grayscale-[.35] transition duration-700"
                                            src={division.image}
                                            alt={division.alt}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-8 lg:p-10">
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="text-cyan font-mono text-[10px] tracking-[.16em] uppercase">{division.code}</span>
                                            <Icon icon="lucide:arrow-up-right" className="arrow text-cyan text-xl transition-transform" />
                                        </div>
                                        <h3 className="mt-8 text-3xl leading-tight font-semibold tracking-[-.05em]">{division.title}</h3>
                                        <p className="mt-4 text-sm leading-6 font-medium text-white">{division.tagline}</p>
                                        <RichText value={division.description} className="text-soft mt-6 text-sm leading-7" />
                                        <ul className="text-soft mt-7 space-y-3 border-t border-white/10 pt-6 text-sm">
                                            {division.items.map((item) => (
                                                <li key={item} className="flex gap-3">
                                                    <span className="text-cyan">—</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href="/contact"
                                            className="hover:border-cyan hover:text-cyan mt-8 inline-flex items-center gap-3 border border-white/15 px-5 py-3 text-[10px] font-bold tracking-[.16em] text-white uppercase transition"
                                        >
                                            Learn More
                                            <Icon icon="lucide:arrow-up-right" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Delivery Method Section */}
                <section className="grid-bg bg-steel border-y border-white/10 py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Delivery method / 03</p>
                            <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
                                {content('delivery.title', 'How We Deliver')}
                            </h2>
                            <p className="text-soft mt-6 text-base leading-7">Our Proven Engineering Process</p>
                        </div>

                        <div className="mt-16 grid grid-cols-2 border-t border-l border-white/10 lg:grid-cols-4">
                            {DELIVERY_STEPS.map((step, index) => (
                                <article key={step.title} className="border-r border-b border-white/10 p-6 lg:p-8">
                                    <div className="flex items-center justify-between">
                                        <span className="text-cyan font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
                                        <Icon icon={step.icon} className="text-cyan text-2xl" />
                                    </div>
                                    <h3 className="mt-12 text-lg font-semibold">{step.title}</h3>
                                    <p className="text-soft mt-4 text-sm leading-6">{step.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Service Standard Section */}
                <section className="bg-night py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Service standard / 04</p>
                                <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
                                    {content('standards.title', 'Why Choose CPS Services?')}
                                </h2>
                            </div>
                            <p className="text-soft max-w-sm text-sm leading-7">
                                Technical focus, responsive delivery, and quality-minded execution across every service division.
                            </p>
                        </div>

                        <div className="mt-14 grid gap-5 md:grid-cols-3">
                            {STANDARDS.map((standard) => (
                                <article
                                    key={standard.title}
                                    className="bg-panel hover:border-cyan/70 border border-white/10 p-8 transition duration-500 hover:-translate-y-1"
                                >
                                    <Icon icon={standard.icon} className="text-cyan text-3xl" />
                                    <h3 className="mt-10 text-lg font-semibold tracking-[.04em] uppercase">{standard.title}</h3>
                                    <p className="text-soft mt-5 text-sm leading-7">{standard.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-night relative overflow-hidden border-t border-white/10 py-24 lg:py-32">
                    <div className="bg-cyan/[.025] absolute top-0 right-0 h-full w-1/2" />
                    <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-10 px-6 lg:flex-row lg:items-end lg:px-8">
                        <div>
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Next step / 05</p>
                            <h2 className="mt-6 max-w-3xl text-5xl leading-[.95] font-semibold tracking-[-.06em] sm:text-7xl">
                                {content('cta.title', 'Ready to Get Started?')}
                            </h2>
                            <p className="text-soft mt-7 text-lg">Let's discuss your service requirements.</p>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Link
                                href="/consultation"
                                className="bg-cyan text-ink-foreground inline-flex h-14 items-center justify-center gap-3 px-6 text-xs font-bold tracking-[.15em] uppercase transition hover:bg-white"
                            >
                                Request Consultation
                                <Icon icon="lucide:arrow-up-right" className="text-base" />
                            </Link>
                            <Link
                                href="/projects"
                                className="hover:border-cyan hover:text-cyan inline-flex h-14 items-center justify-center gap-3 border border-white/20 px-6 text-xs font-bold tracking-[.15em] text-white uppercase transition"
                            >
                                View Projects
                                <Icon icon="lucide:arrow-up-right" className="text-base" />
                            </Link>
                        </div>
                    </div>
                </section>
            </>
        </PublicLayout>
    );
}
