import { RichText } from '@/components/public/rich-text';
import PublicLayout from '@/layouts/public-layout';
import { usePublicContent } from '@/lib/public-content';
import { usePublicSiteData } from '@/lib/public-data';
import { Icon } from '@iconify/react';

const INDUSTRIES = [
    {
        icon: 'lucide:droplets',
        title: 'Oil & Gas',
        description:
            'Specialized engineering for upstream, midstream, and downstream operations. Electrical systems, cathodic protection, and power infrastructure for challenging environments.',
    },
    {
        icon: 'lucide:zap',
        title: 'Power Generation',
        description:
            'Electrical distribution systems, load banks, UPS solutions, and generator controls for reliable power generation and backup systems.',
    },
    {
        icon: 'lucide:radio-tower',
        title: 'Telecommunications',
        description: 'Infrastructure engineering, power systems, and network equipment support for mobile networks and telecom facilities.',
    },
    {
        icon: 'lucide:factory',
        title: 'Manufacturing',
        description: 'Industrial electrical panels, process control systems, and automation solutions for manufacturing operations.',
    },
    {
        icon: 'lucide:building-2',
        title: 'Infrastructure',
        description: 'Critical infrastructure engineering including electrical systems, HVAC support, and building automation.',
    },
    {
        icon: 'lucide:network',
        title: 'Energy & Utilities',
        description: 'Distribution networks, substation design, and utility-scale electrical solutions.',
    },
    {
        icon: 'lucide:pickaxe',
        title: 'Mining & Extraction',
        description: 'Rugged electrical systems designed for harsh mining environments with reliability and safety.',
    },
    {
        icon: 'lucide:truck',
        title: 'Transportation & Logistics',
        description: 'Power systems for transportation hubs, logistics facilities, and infrastructure support.',
    },
];

const CAPABILITIES = [
    {
        icon: 'lucide:network',
        title: 'Electrical System Design & Installation',
        description: 'Electrical systems and installation support for demanding project environments.',
    },
    {
        icon: 'lucide:shield-check',
        title: 'Cathodic Protection Systems',
        description: 'Protection systems including transformer rectifiers, junction boxes, test points, and CIPS.',
    },
    {
        icon: 'lucide:battery-charging',
        title: 'Power Management & UPS Solutions',
        description: 'UPS, battery monitoring, charger, inverter, and rectifier capabilities.',
    },
    {
        icon: 'lucide:activity',
        title: 'Load Bank Testing & Analysis',
        description: 'DC load bank, AC load bank, battery testing, and genset testing.',
    },
    {
        icon: 'lucide:monitor-check',
        title: 'Battery Monitoring Systems',
        description: 'Monitoring solutions supporting critical power and operational continuity.',
    },
    {
        icon: 'lucide:panel-top',
        title: 'Control Panel Manufacturing',
        description: 'Electrical panels, instrument panels, ATS/MF panels, and explosion proof panels.',
    },
];

const SECTOR_KEYWORDS: Record<string, string[]> = {
    'Oil & Gas': ['pertamina', 'conoco', 'petrochina', 'total e&p', 'vico', 'calm', 'medco', 'star energy'],
    Telecommunications: ['telkomsel', 'indosat', 'excelcom', 'bakrie telecom', 'mobile 8', 'protelindo', 'cbn'],
    Power: ['pln', 'pltu', 'pltgu', 'pjb', 'indonesia power', 'geothermal'],
    Manufacturing: ['paragon', 'krakatau', 'chandra asih'],
    Mining: ['adaro', 'sebuku', 'kaltim'],
    'Additional references': [],
};

export default function Industries() {
    const { company, projectReferences, gallery } = usePublicSiteData();
    const { content, media } = usePublicContent('industries');
    const galleryImages = gallery.filter((item) => item.image_url).map((item) => item.image_url as string);
    const allReferences = [...projectReferences.cme, ...projectReferences.cathodicProtection];
    const references = Object.entries(SECTOR_KEYWORDS).map(([sector, keywords]) => {
        const companies = Array.from(
            new Set(
                allReferences
                    .map((reference) => reference.user)
                    .filter((user) => keywords.some((keyword) => user.toLowerCase().includes(keyword)))
                    .map((user) => user.trim()),
            ),
        ).slice(0, 4);
        return { sector, companies: companies.length > 0 ? companies : ['See project references'], muted: companies.length === 0 };
    });

    return (
        <PublicLayout>
            <>
                {/* Hero Section */}
                <section className="grain relative flex min-h-[650px] items-end overflow-hidden border-b border-white/10 lg:min-h-[760px]">
                    <img
                        className="hero-image absolute inset-0 h-full w-full object-cover opacity-65"
                        src={
                            media('hero.background')?.image_url ??
                            galleryImages[0] ??
                            'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2200&q=85'
                        }
                        alt="Industrial power infrastructure and electrical equipment"
                    />
                    <div className="hero-overlay absolute inset-0" />
                    <div className="grid-bg absolute inset-0 opacity-30" />

                    <div className="border-cyan/30 absolute top-[34%] right-[13%] hidden h-36 w-36 border lg:block">
                        <span className="bg-cyan absolute -top-2 -left-2 h-3 w-3" />
                        <span className="border-cyan bg-ink absolute -right-2 -bottom-2 h-3 w-3 border" />
                    </div>

                    <div className="relative mx-auto w-full max-w-7xl px-6 pt-36 pb-24 lg:px-8 lg:pb-28">
                        <div className="max-w-4xl">
                            <p className="reveal text-cyan flex items-center gap-3 font-mono text-[11px] tracking-[.22em] uppercase">
                                <span className="bg-cyan h-px w-10" />
                                {content('hero.eyebrow', 'Industries / 01')}
                            </p>

                            <h1 className="reveal mt-7 max-w-4xl text-5xl leading-[.98] font-semibold tracking-[-.06em] delay-1 sm:text-6xl lg:text-7xl">
                                {content('hero.title', 'Engineered Solutions for Demanding Industries')}
                            </h1>

                            <p className="reveal text-soft mt-8 max-w-2xl text-base leading-7 delay-2 sm:text-lg">
                                {content(
                                    'hero.description',
                                    'CPS delivers specialized electrical and electronic engineering across critical sectors.',
                                )}
                            </p>
                        </div>

                        <div className="reveal text-dim mt-20 flex items-center gap-8 font-mono text-[10px] tracking-[.18em] uppercase delay-3">
                            <span>Sector expertise</span>
                            <span className="bg-cyan/50 hidden h-px w-16 sm:block" />
                            <span className="hidden sm:block">Electrical &amp; Electronic Engineering</span>
                        </div>
                    </div>
                </section>

                {/* Industries Section */}
                <section id="industries" className="bg-night py-24 lg:py-36">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Sector focus / 02</p>
                                <h2 className="mt-5 max-w-3xl text-4xl leading-[1] font-semibold tracking-[-.05em] sm:text-6xl">
                                    {content('sectors.title', 'Technical depth across critical environments.')}
                                </h2>
                            </div>

                            <p className="text-soft max-w-sm text-sm leading-7">
                                Engineering capabilities applied across industries that depend on reliable systems, equipment, and infrastructure.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {INDUSTRIES.map((industry, index) => (
                                <article
                                    key={industry.title}
                                    className="group bg-panel hover:border-cyan/70 border border-white/10 p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(0,217,255,.08)]"
                                >
                                    <div className="flex items-start justify-between">
                                        <Icon icon={industry.icon} className="text-soft group-hover:text-cyan text-3xl transition duration-300" />
                                        <span className="text-dim group-hover:text-cyan font-mono text-xs transition">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <h3 className="mt-10 text-lg font-semibold tracking-[.04em] uppercase">{industry.title}</h3>
                                    <RichText value={industry.description} className="text-soft mt-5 text-sm leading-7" />
                                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                                        <span className="text-dim font-mono text-[10px] tracking-[.16em] uppercase">Sector application</span>
                                        <Icon
                                            icon="lucide:arrow-up-right"
                                            className="text-cyan text-lg transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cross-Industry Capabilities Section */}
                <section id="services" className="grid-bg bg-steel border-y border-white/10 py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="max-w-3xl">
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Cross-industry capabilities / 03</p>
                            <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
                                Capabilities across
                                <br />
                                <span className="text-cyan">industries.</span>
                            </h2>
                            <p className="text-soft mt-7 max-w-xl text-base leading-8">
                                Our technical expertise spans across multiple service areas and industry applications.
                            </p>
                        </div>

                        <div className="mt-14 grid border-t border-l border-white/10 sm:grid-cols-2 lg:grid-cols-3">
                            {CAPABILITIES.map((capability) => (
                                <div key={capability.title} className="hover:bg-panel border-r border-b border-white/10 p-7 transition lg:p-9">
                                    <Icon icon={capability.icon} className="text-cyan text-2xl" />
                                    <h3 className="mt-7 text-sm font-semibold tracking-[.06em] uppercase">{capability.title}</h3>
                                    <RichText value={capability.description} className="text-soft mt-4 text-sm leading-7" />
                                </div>
                            ))}

                            <div className="hover:bg-panel border-r border-b border-white/10 p-7 transition lg:col-span-3 lg:p-9">
                                <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
                                    <div>
                                        <Icon icon="lucide:wrench" className="text-cyan text-2xl" />
                                        <h3 className="mt-7 text-sm font-semibold tracking-[.06em] uppercase">Maintenance &amp; Support Services</h3>
                                    </div>
                                    <p className="text-soft max-w-2xl text-sm leading-7">
                                        Service and maintenance support across energy monitoring, UPS, battery monitoring, charger, inverter,
                                        rectifier, and related engineering systems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Project References Section */}
                <section id="projects" className="bg-ink py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Project references / 04</p>
                                <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
                                    Projects across
                                    <br />
                                    <span className="text-cyan">industries.</span>
                                </h2>
                            </div>

                            <p className="text-soft max-w-sm text-sm leading-7">
                                Selected company and project references identified in the CPS profile.
                            </p>
                        </div>

                        <div className="mt-14 grid border-t border-l border-white/10 sm:grid-cols-2 lg:grid-cols-3">
                            {references.map((reference) => (
                                <div key={reference.sector} className="bg-panel border-r border-b border-white/10 p-7">
                                    <span className="text-cyan font-mono text-[10px] tracking-[.16em] uppercase">{reference.sector}</span>
                                    <div className="mt-7 space-y-4">
                                        {reference.companies.map((company) => (
                                            <p key={company} className={`text-lg font-medium ${reference.muted ? 'text-soft' : 'text-white'}`}>
                                                {company}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Consultation CTA Section */}
                <section id="consultation" className="bg-night relative overflow-hidden border-t border-white/10 py-24 lg:py-32">
                    <div className="bg-cyan/[.025] absolute top-0 right-0 h-full w-1/2" />
                    <div className="grid-bg absolute inset-0 opacity-20" />

                    <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-12 px-6 lg:flex-row lg:items-end lg:px-8">
                        <div className="max-w-3xl">
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Start a conversation / 05</p>
                            <h2 className="mt-6 text-5xl leading-[.95] font-semibold tracking-[-.06em] sm:text-7xl">
                                Need engineering
                                <br />
                                <span className="text-cyan">solutions for your industry?</span>
                            </h2>
                            <p className="text-soft mt-8 max-w-xl text-lg leading-8">Let's discuss your specific technical requirements.</p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <a
                                href="mailto:cps@cpsindo.com?subject=Engineering%20Consultation%20Request"
                                className="bg-cyan text-ink inline-flex h-14 items-center justify-center gap-3 px-7 text-xs font-bold tracking-[.15em] uppercase transition hover:bg-white"
                            >
                                Request Consultation
                                <Icon icon="lucide:arrow-up-right" className="text-base" />
                            </a>

                            <a
                                href="#projects"
                                className="hover:border-cyan hover:text-cyan inline-flex h-14 items-center justify-center gap-3 border border-white/20 px-7 text-xs font-bold tracking-[.15em] text-white uppercase transition"
                            >
                                View Our Projects
                                <Icon icon="lucide:arrow-down-right" className="text-base" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="bg-night border-t border-white/10 py-20">
                    <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
                        <div>
                            <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Contact / 06</p>
                            <h2 className="mt-5 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{company.name}</h2>
                            <p className="text-soft mt-5 max-w-xl text-sm leading-7">{company.address.full}</p>
                        </div>

                        <div className="text-soft text-sm leading-8 lg:text-right">
                            {company.contact.phones.slice(0, 2).map((phone) => (
                                <p key={phone}>{phone}</p>
                            ))}
                            <a href={`mailto:${company.contact.email}`} className="text-cyan block transition hover:text-white">
                                {company.contact.email}
                            </a>
                        </div>
                    </div>
                </section>
            </>
        </PublicLayout>
    );
}
