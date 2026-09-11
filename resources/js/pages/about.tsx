import { RichText } from '@/components/public/rich-text';
import PublicLayout from '@/layouts/public-layout';
import { usePublicContent } from '@/lib/public-content';
import { usePublicSiteData } from '@/lib/public-data';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';

const VALUES = [
    { icon: 'lucide:cpu', title: 'Technical Excellence', description: 'Engineering expertise and attention to technical detail.' },
    { icon: 'lucide:shield-check', title: 'Reliability', description: 'Consistent project support and dependable execution.' },
    { icon: 'lucide:lightbulb', title: 'Innovation', description: 'Continuous improvement and practical technical advancement.' },
    { icon: 'lucide:users', title: 'Customer Focus', description: 'Understanding project requirements and developing suitable solutions.' },
];

export default function About() {
    const { company, divisions, productCategories, projectReferences, gallery } = usePublicSiteData();
    const { content, media } = usePublicContent('about');
    const totalReferences = projectReferences.cme.length + projectReferences.cathodicProtection.length;
    const galleryImages = gallery.filter((item) => item.image_url).map((item) => item.image_url as string);
    const capabilities = productCategories.map((category, index) => ({
        number: String(index + 1).padStart(2, '0'),
        title: category.name,
        items: category.products?.map((product) => product.name) ?? [],
    }));
    const reasons = [
        {
            title: `${totalReferences}+ Project References`,
            description: 'A project track record spanning electrical and electronic engineering work.',
        },
        { title: 'Quick Response & Good Quality', description: `“${company.tagline}”` },
        { title: 'Technical Expertise', description: 'Engineering capability organized around specialized systems and project needs.' },
        { title: 'Customized Solutions', description: 'Solutions shaped around specific technical requirements.' },
    ];
    const references = Array.from(
        new Set(
            [...projectReferences.cme, ...projectReferences.cathodicProtection]
                .map((reference) => reference.user)
                .filter((user) =>
                    ['pertamina', 'pln', 'telkomsel', 'indosat', 'petrochina', 'pltu', 'pltgu', 'vico', 'total'].some((keyword) =>
                        user.toLowerCase().includes(keyword),
                    ),
                )
                .map((user) => {
                    const lower = user.toLowerCase();
                    if (lower.includes('total')) return 'Total E&P';
                    if (lower.includes('vico')) return 'VICO Indonesia';
                    if (lower.includes('pltu') || lower.includes('pltgu')) return user.toUpperCase().startsWith('PLTU') ? 'PLTU' : 'PLTGU';
                    return user;
                }),
        ),
    ).slice(0, 10);
    const divisionCards = divisions.map((division, index) => ({
        code: `${String(index + 1).padStart(2, '0')} / DIVISION`,
        title: division.name.replace(/ Division$/, ''),
        tagline:
            ['Keeping critical systems running', 'From concept to delivery', 'System integration and installation'][index] ??
            'Technical engineering support',
        description: division.description ?? '',
        items: division.points ?? [],
        image:
            division.image_url ??
            galleryImages[index] ??
            [
                'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1581092786450-7e3a1b4aa9b4?auto=format&fit=crop&w=1000&q=85',
                'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=85',
            ][index],
        alt: `${division.name} at CPS`,
        href: '/services',
    }));

    return (
        <PublicLayout>
            <>
                {/* Hero Section */}
                <section className="grain relative flex min-h-[680px] items-end overflow-hidden border-b border-white/10 lg:min-h-[760px]">
                    <img
                        src={
                            media('hero.background')?.image_url ??
                            galleryImages[0] ??
                            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2200&q=85'
                        }
                        alt="Engineer inspecting industrial electrical equipment"
                        className="hero-image absolute inset-0 h-full w-full object-cover opacity-65"
                    />
                    <div className="hero-overlay absolute inset-0" />
                    <div className="grid-bg absolute inset-0 opacity-30" />

                    <div className="relative mx-auto w-full max-w-7xl px-6 pt-40 pb-24 lg:px-8 lg:pb-28">
                        <div className="max-w-4xl">
                            <p className="reveal text-cyan flex items-center gap-3 font-mono text-[11px] tracking-[.22em] uppercase">
                                <span className="bg-cyan h-px w-10" /> {content('hero.eyebrow', 'Company / 01')}
                            </p>
                            <h1 className="reveal mt-7 max-w-3xl text-5xl leading-[.98] font-semibold tracking-[-.05em] delay-1 sm:text-6xl lg:text-8xl">
                                {content('hero.title', 'About CPS.')}
                            </h1>
                            <p className="reveal mt-7 max-w-2xl text-xl leading-8 text-white delay-2 sm:text-2xl">
                                {content('hero.subtitle', 'Electrical engineering excellence built around demanding projects.')}
                            </p>
                            <p className="reveal text-soft mt-6 max-w-xl text-base leading-7 delay-3">
                                {content(
                                    'hero.description',
                                    'PT. Citra Protecta Semesta is an electrical and electronic engineering company focused on technical solutions, customized systems, and project support.',
                                )}
                            </p>
                        </div>

                        <div className="text-dim mt-20 flex items-center gap-6 font-mono text-[10px] tracking-[.18em] uppercase">
                            <span>PT. CITRA PROTECTA SEMESTA</span>
                            <span className="bg-cyan/50 hidden h-px w-16 sm:block" />
                            <span className="hidden sm:block">Electrical &amp; Electronic Engineering</span>
                        </div>
                    </div>
                </section>

                {/* Foundation Section */}
                <section className="bg-night py-24 lg:py-36">
                    <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-24 lg:px-8">
                        <div className="relative min-h-[520px] overflow-hidden border border-white/10">
                            <img
                                src={
                                    galleryImages[1] ??
                                    'https://images.unsplash.com/photo-1581092919535-7146ff1a590b?auto=format&fit=crop&w=1400&q=85'
                                }
                                alt="Industrial electrical control room"
                                className="h-full min-h-[520px] w-full object-cover grayscale-[.3] transition duration-700 hover:scale-105"
                                loading="lazy"
                            />
                            <div className="from-ink/75 to-cyan/10 absolute inset-0 bg-gradient-to-tr via-transparent" />
                            <div className="border-cyan absolute bottom-7 left-7 border-l pl-4 font-mono text-[10px] tracking-[.16em] text-white uppercase">
                                Company profile
                                <br />
                                <span className="text-cyan">CPS / FOUNDATION</span>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Our foundation / 02</p>
                            <h2 className="mt-6 max-w-xl text-4xl leading-[1.02] font-semibold tracking-[-.05em] sm:text-6xl">
                                Engineering with
                                <br />
                                <span className="text-cyan">purpose and precision.</span>
                            </h2>
                            <p className="text-soft mt-8 max-w-xl text-[15px] leading-8">
                                PT. Citra Protecta Semesta is positioned around electrical and electronic engineering. The company supports demanding
                                project requirements through technical expertise, customized solutions, and project assistance.
                            </p>
                            <p className="text-soft mt-5 max-w-xl text-[15px] leading-8">
                                Its capabilities are organized across three core divisions: Service &amp; Maintenance, Design &amp; Manufacture, and
                                Trading &amp; Construction.
                            </p>

                            <div className="mt-10 border-t border-white/10">
                                {divisions.map((division, index) => (
                                    <div key={division.id} className="flex items-center justify-between border-b border-white/10 py-5">
                                        <span className="text-cyan font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
                                        <span className="text-sm text-white">{division.name.replace(/ Division$/, '')}</span>
                                        <Icon icon="lucide:arrow-up-right" className="text-dim" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section className="bg-steel border-y border-white/10 py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid gap-16 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Direction / 03</p>
                                <h2 className="mt-6 text-5xl leading-[.94] font-semibold tracking-[-.06em] sm:text-7xl">
                                    Mission
                                    <br />
                                    <span className="text-cyan">&amp; vision.</span>
                                </h2>
                            </div>

                            <div className="space-y-12">
                                <blockquote className="border-cyan border-l-2 pl-7">
                                    <p className="text-dim font-mono text-[10px] tracking-[.2em] uppercase">Mission</p>
                                    <p className="mt-5 max-w-3xl text-2xl leading-[1.25] font-medium tracking-[-.03em] text-white sm:text-4xl">
                                        Menjadi mitra engineering yang andal dan terpercaya dalam mendukung pembangunan infrastruktur energi dan
                                        industri di Indonesia.
                                    </p>
                                </blockquote>

                                <blockquote className="border-l border-white/20 pl-7">
                                    <p className="text-cyan font-mono text-[10px] tracking-[.2em] uppercase">Vision</p>
                                    <p className="text-soft mt-5 max-w-2xl text-xl leading-8 sm:text-3xl">
                                        Memberikan solusi Electrical &amp; Electronic Engineering yang andal, inovatif, dan berkualitas untuk
                                        mendukung kemajuan infrastruktur kritikal.
                                    </p>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="bg-ink py-24 lg:py-36">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Principles / 04</p>
                                <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">What guides our work.</h2>
                            </div>
                            <p className="text-soft max-w-sm text-sm leading-7">
                                A technical approach shaped by precision, dependability, improvement, and understanding.
                            </p>
                        </div>

                        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {VALUES.map((value, index) => (
                                <article
                                    key={value.title}
                                    className="bg-panel hover:border-cyan/60 border border-white/10 p-7 transition duration-500 hover:shadow-[0_0_35px_rgba(0,217,255,.07)]"
                                >
                                    <Icon icon={value.icon} className="text-cyan text-2xl" />
                                    <p className="text-cyan mt-8 font-mono text-[10px] tracking-[.18em] uppercase">
                                        {String(index + 1).padStart(2, '0')} / Value
                                    </p>
                                    <h3 className="mt-4 text-xl font-semibold">{value.title}</h3>
                                    <RichText value={value.description} className="text-soft mt-5 text-sm leading-7" />
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Core Divisions Section */}
                <section className="bg-night py-24 lg:py-36">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Core divisions / 05</p>
                            <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
                                Three ways to support
                                <br />
                                <span className="text-cyan">critical systems.</span>
                            </h2>
                        </div>

                        <div className="mt-14 grid gap-5 lg:grid-cols-3">
                            {divisionCards.map((division) => (
                                <article
                                    key={division.code}
                                    className="group bg-panel hover:border-cyan/70 overflow-hidden border border-white/10 transition duration-500 hover:-translate-y-1"
                                >
                                    <div className="h-56 overflow-hidden">
                                        <img
                                            src={division.image}
                                            alt={division.alt}
                                            className="h-full w-full object-cover transition duration-700"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-7">
                                        <p className="text-cyan font-mono text-xs">{division.code}</p>
                                        <h3 className="mt-6 text-2xl font-semibold tracking-[-.04em]">{division.title}</h3>
                                        <p className="text-cyan mt-3 text-sm">{division.tagline}</p>
                                        <RichText value={division.description} className="text-soft mt-6 text-sm leading-7" />
                                        <ul className="text-soft mt-6 space-y-3 border-t border-white/10 pt-6 font-mono text-[11px] leading-5">
                                            {division.items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                        <Link
                                            href={division.href}
                                            className="text-cyan mt-7 inline-flex items-center gap-3 text-xs font-bold tracking-[.15em] uppercase transition hover:text-white"
                                        >
                                            Learn More <Icon icon="lucide:arrow-up-right" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Technical Capabilities Section */}
                <section className="grid-bg bg-steel border-y border-white/10 py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Engineering expertise / 06</p>
                                <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Technical capabilities.</h2>
                            </div>
                            <p className="text-soft max-w-sm text-sm leading-7">Technical scopes identified across CPS engineering capabilities.</p>
                        </div>

                        <div className="mt-14 grid border-t border-l border-white/10 md:grid-cols-3">
                            {capabilities.map((capability) => (
                                <div key={capability.number} className="border-r border-b border-white/10 p-7 lg:p-9">
                                    <span className="text-cyan font-mono text-xs">{capability.number}</span>
                                    <h3 className="mt-7 text-lg font-semibold">{capability.title}</h3>
                                    <div className="text-soft mt-7 space-y-3 font-mono text-xs leading-6">
                                        {capability.items.map((item) => (
                                            <p key={item}>{item}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why CPS Section */}
                <section className="bg-ink py-24 lg:py-36">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Why CPS / 07</p>
                                <h2 className="mt-6 text-5xl leading-[.95] font-semibold tracking-[-.06em] sm:text-7xl">
                                    A serious partner
                                    <br />
                                    <span className="text-cyan">for complex work.</span>
                                </h2>
                            </div>
                            <div className="border-t border-white/10">
                                {reasons.map((reason, index) => (
                                    <div key={reason.title} className="flex gap-5 border-b border-white/10 py-7">
                                        <span className="text-cyan font-mono text-sm">{String(index + 1).padStart(2, '0')}</span>
                                        <div>
                                            <h3 className="text-lg font-semibold">{reason.title}</h3>
                                            <p className="text-soft mt-2 text-sm leading-7">{reason.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="bg-night py-24 lg:py-36">
                    <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
                        <div className="relative h-[460px] overflow-hidden border border-white/10">
                            <img
                                src={
                                    galleryImages[2] ??
                                    'https://images.unsplash.com/photo-1581091215367-59ab6c4b9a58?auto=format&fit=crop&w=1400&q=85'
                                }
                                alt="Engineers collaborating in an industrial environment"
                                className="h-full w-full object-cover grayscale-[.4] transition duration-700"
                                loading="lazy"
                            />
                            <div className="from-ink/75 to-cyan/10 absolute inset-0 bg-gradient-to-tr via-transparent" />
                            <div className="text-cyan absolute bottom-7 left-7 font-mono text-[10px] tracking-[.18em] uppercase">
                                People / Technical environment
                            </div>
                        </div>
                        <div>
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Our team / 08</p>
                            <h2 className="mt-6 text-5xl leading-[.95] font-semibold tracking-[-.06em] sm:text-7xl">
                                People behind
                                <br />
                                <span className="text-cyan">the precision.</span>
                            </h2>
                            <p className="text-soft mt-8 max-w-xl text-[15px] leading-8">
                                CPS is built around engineering focus, practical technical knowledge, and commitment to project requirements.
                            </p>
                            <p className="text-soft mt-5 max-w-xl text-[15px] leading-8">
                                Across maintenance, design, manufacturing, trading, and construction, the work is supported by a culture of teamwork
                                and attention to detail.
                            </p>
                            <div className="text-cyan mt-9 flex flex-wrap gap-3 font-mono text-[10px] tracking-[.16em] uppercase">
                                {['Expertise', 'Teamwork', 'Commitment'].map((tag) => (
                                    <span key={tag} className="border-cyan/40 border px-4 py-3">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* References Section */}
                <section className="bg-steel border-y border-white/10 py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Project experience / 09</p>
                                <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Trusted by industry references.</h2>
                            </div>
                            <div className="text-dim font-mono text-xs tracking-[.15em] uppercase">
                                <span className="text-cyan text-4xl">{totalReferences}+</span>
                                <br />
                                Project references
                            </div>
                        </div>

                        <div className="mt-14 grid grid-cols-2 border-t border-l border-white/10 sm:grid-cols-3 lg:grid-cols-5">
                            {references.map((reference) => (
                                <div
                                    key={reference}
                                    className="flex min-h-28 items-center border-r border-b border-white/10 p-6 font-semibold text-white"
                                >
                                    {reference}
                                </div>
                            ))}
                            <div className="text-dim flex min-h-28 items-center border-r border-b border-white/10 p-6 font-mono text-xs tracking-[.15em] uppercase">
                                And others
                            </div>
                            <div className="text-cyan flex min-h-28 items-center border-r border-b border-white/10 p-6 font-mono text-xs tracking-[.15em] uppercase">
                                Project references
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-cyan text-ink relative overflow-hidden py-24 lg:py-32">
                    <div className="absolute top-0 right-0 h-full w-1/3 opacity-20">
                        <div className="grid-bg h-full" />
                    </div>
                    <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-10 px-6 lg:flex-row lg:items-end lg:px-8">
                        <div>
                            <p className="text-ink/60 font-mono text-[11px] tracking-[.2em] uppercase">Next step / 10</p>
                            <h2 className="mt-5 max-w-3xl text-5xl leading-[.95] font-semibold tracking-[-.06em] sm:text-7xl">
                                Ready to partner
                                <br />
                                with CPS?
                            </h2>
                            <p className="text-ink/70 mt-7 text-lg">Let's discuss your engineering challenges.</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/contact"
                                className="bg-ink hover:text-ink inline-flex h-14 items-center justify-center gap-3 px-6 text-xs font-bold tracking-[.15em] text-white uppercase transition hover:bg-white"
                            >
                                Start a Project <Icon icon="lucide:arrow-up-right" />
                            </Link>
                            <Link
                                href="/consultation"
                                className="border-ink/40 text-ink hover:bg-ink inline-flex h-14 items-center justify-center gap-3 border px-6 text-xs font-bold tracking-[.15em] uppercase transition hover:text-white"
                            >
                                Request Consultation <Icon icon="lucide:arrow-up-right" />
                            </Link>
                        </div>
                    </div>
                </section>
            </>
        </PublicLayout>
    );
}
