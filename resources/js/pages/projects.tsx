import { RichText } from '@/components/public/rich-text';
import PublicLayout from '@/layouts/public-layout';
import { usePublicContent } from '@/lib/public-content';
import { usePublicSiteData } from '@/lib/public-data';
import { Icon } from '@iconify/react';
import { useState } from 'react';

const FILTERS = ['All', 'Electrical', 'Cathodic Protection', 'Mechanical', 'CME', 'Load Bank'];

const PROJECTS = [
    {
        category: 'Electrical',
        client: 'Pertamina',
        description: 'Electrical system engineering and installation for power distribution infrastructure.',
        image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=85',
        alt: 'Industrial power facility associated with Pertamina project reference',
    },
    {
        category: 'Cathodic Protection',
        client: 'ConocoPhillips',
        description: 'Cathodic protection system design and installation for offshore infrastructure.',
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1200&q=85',
        alt: 'Industrial pipeline associated with ConocoPhillips project reference',
    },
    {
        category: 'CME',
        client: 'Telkomsel',
        description: 'Telecommunications infrastructure and power system engineering.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
        alt: 'Telecommunications infrastructure associated with Telkomsel project reference',
    },
    {
        category: 'CME',
        client: 'Indosat',
        description: 'Electrical and communication infrastructure project.',
        image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1200&q=85',
        alt: 'Industrial installation associated with Indosat project reference',
    },
    {
        category: 'Load Bank',
        client: 'PLN',
        description: 'Load bank testing and power system validation services.',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=85',
        alt: 'Power testing infrastructure associated with PLN project reference',
    },
    {
        category: 'Electrical',
        client: 'Adaro',
        description: 'Mining facility electrical systems and power distribution.',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=85',
        alt: 'Mining facility associated with Adaro project reference',
    },
    {
        category: 'Electrical',
        client: 'IKEA',
        description: 'Commercial facility electrical engineering and systems installation.',
        image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=85',
        alt: 'Commercial warehouse associated with IKEA project reference',
    },
    {
        category: 'Cathodic Protection',
        client: 'Petrochina',
        description: 'Oil and gas infrastructure protection systems.',
        image: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?auto=format&fit=crop&w=1200&q=85',
        alt: 'Oil and gas facility associated with Petrochina project reference',
    },
];

export default function Projects() {
    const { company, projectReferences, gallery } = usePublicSiteData();
    const { content, media } = usePublicContent('projects');
    const [activeFilter, setActiveFilter] = useState('All');
    const totalReferences = projectReferences.cme.length + projectReferences.cathodicProtection.length;
    const galleryImages = gallery.filter((item) => item.image_url).map((item) => item.image_url as string);
    const databaseProjects = [...projectReferences.cme, ...projectReferences.cathodicProtection].map((reference, index) => ({
        category: reference.category === 'cathodic_protection' ? 'Cathodic Protection' : 'Electrical',
        client: reference.client,
        description: reference.project,
        image: galleryImages[index] ?? PROJECTS[index % PROJECTS.length].image,
        alt: `${reference.client} project reference`,
    }));
    const projects = databaseProjects.length ? databaseProjects : PROJECTS;
    const stats = [
        { value: `${totalReferences}+`, label: 'Project references' },
        { value: '03', label: 'Core divisions' },
        { value: '06', label: 'Project categories' },
    ];
    const visibleProjects = activeFilter === 'All' ? projects : projects.filter((project) => project.category === activeFilter);

    return (
        <PublicLayout>
            <>
                {/* Hero Section */}
                <section className="grain relative flex min-h-[680px] items-end overflow-hidden border-b border-white/10 lg:min-h-[760px]">
                    <img
                        className="hero-image absolute inset-0 h-full w-full object-cover opacity-65"
                        src={
                            media('hero.background')?.image_url ??
                            galleryImages[0] ??
                            'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2200&q=85'
                        }
                        alt="Industrial power infrastructure at dusk"
                    />
                    <div className="hero-overlay absolute inset-0" />
                    <div className="grid-bg absolute inset-0 opacity-25" />

                    <div className="border-cyan/30 absolute top-[38%] right-[12%] hidden h-36 w-36 border lg:block">
                        <span className="bg-cyan absolute -top-2 -left-2 h-3 w-3" />
                        <span className="border-cyan bg-ink absolute -right-2 -bottom-2 h-3 w-3 border" />
                    </div>

                    <div className="relative mx-auto w-full max-w-7xl px-6 pt-36 pb-24 lg:px-8 lg:pb-28">
                        <p className="reveal text-cyan flex items-center gap-3 font-mono text-[11px] tracking-[.22em] uppercase">
                            <span className="bg-cyan h-px w-10" />
                            {content('hero.eyebrow', 'Project Reference / 05')}
                        </p>

                        <h1 className="reveal mt-7 max-w-4xl text-5xl leading-[.98] font-semibold tracking-[-.055em] delay-1 sm:text-6xl lg:text-7xl">
                            {content('hero.title', 'Selected Projects.')}
                        </h1>

                        <p className="reveal text-soft mt-8 max-w-xl text-base leading-7 delay-2 sm:text-lg">
                            {content('hero.description', 'Portfolio of engineering solutions delivered to leading companies.')}
                        </p>

                        <p className="reveal text-dim mt-4 max-w-2xl text-sm leading-7 delay-2">
                            {totalReferences}+ project references showcasing our expertise in electrical and electronic engineering across multiple
                            industries.
                        </p>

                        <div className="text-dim mt-16 flex items-center gap-8 font-mono text-[10px] tracking-[.18em] uppercase">
                            <span>PT. CITRA PROTECTA SEMESTA</span>
                            <span className="bg-cyan/50 hidden h-px w-16 sm:block" />
                            <span className="hidden sm:block">Electrical &amp; Electronic Engineering</span>
                        </div>
                    </div>
                </section>

                {/* Projects Grid Section */}
                <section id="projects" className="bg-ink py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Portfolio index / 01</p>
                                <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
                                    {content('portfolio.title', 'Engineering references.')}
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2" role="group" aria-label="Project filters">
                                {FILTERS.map((filter) => (
                                    <button
                                        key={filter}
                                        type="button"
                                        onClick={() => setActiveFilter(filter)}
                                        aria-pressed={activeFilter === filter}
                                        className={`border px-4 py-2 font-mono text-[10px] tracking-[.12em] uppercase transition ${
                                            activeFilter === filter
                                                ? 'border-cyan bg-cyan text-ink hover:bg-white'
                                                : 'text-dim hover:border-cyan hover:text-cyan border-white/10'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {visibleProjects.length > 0 ? (
                            <div className="mt-14 grid gap-8 md:grid-cols-2">
                                {visibleProjects.map((project) => (
                                    <article
                                        key={project.client}
                                        className="project-card group bg-panel hover:border-cyan/70 overflow-hidden border border-white/10 transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(0,217,255,.08)]"
                                    >
                                        <div className="relative h-72 overflow-hidden">
                                            <img
                                                className="h-full w-full object-cover grayscale-[.35] transition duration-700"
                                                src={project.image}
                                                alt={project.alt}
                                                loading="lazy"
                                            />
                                            <span className="bg-cyan text-ink absolute top-5 left-5 px-3 py-2 font-mono text-[10px] uppercase">
                                                {project.category}
                                            </span>
                                        </div>
                                        <div className="p-7">
                                            <div className="flex items-start justify-between gap-5">
                                                <div>
                                                    <h3 className="text-2xl font-semibold tracking-[-.04em]">{project.client}</h3>
                                                    <RichText value={project.description} className="text-soft mt-3 text-sm leading-7" />
                                                </div>
                                                <span className="text-dim shrink-0 font-mono text-[10px] tracking-[.12em] uppercase">Reference</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-10 border border-dashed border-white/10 px-6 py-16 text-center">
                                <Icon icon="lucide:search-x" className="text-dim text-3xl" />
                                <p className="text-dim mt-4 font-mono text-xs tracking-[.16em] uppercase">No project references in this category</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Portfolio Scope Section */}
                <section id="industries" className="bg-steel border-y border-white/10 py-20 lg:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Portfolio scope / 02</p>
                                <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">{totalReferences}+ project references.</h2>
                            </div>
                            <p className="text-soft max-w-md text-sm leading-7">
                                A portfolio spanning electrical systems, cathodic protection, telecommunications infrastructure, and load bank
                                testing.
                            </p>
                        </div>

                        <div className="mt-12 grid border-t border-l border-white/10 sm:grid-cols-3">
                            {stats.map((stat) => (
                                <div key={stat.label} className="border-r border-b border-white/10 p-7 lg:p-9">
                                    <span className="text-cyan font-mono text-4xl">{stat.value}</span>
                                    <p className="text-dim mt-4 text-xs tracking-[.16em] uppercase">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact CTA Section */}
                <section id="contact" className="bg-night py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="bg-panel relative overflow-hidden border border-white/10 px-7 py-12 sm:px-12 lg:px-16 lg:py-16">
                            <div className="grid-bg absolute inset-0 opacity-20" />
                            <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
                                <div>
                                    <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Next project / 03</p>
                                    <h2 className="mt-6 max-w-3xl text-4xl leading-[.98] font-semibold tracking-[-.055em] sm:text-6xl">
                                        Ready to work on
                                        <br />
                                        <span className="text-cyan">your next project?</span>
                                    </h2>
                                    <p className="text-soft mt-7 max-w-xl text-base leading-7">
                                        Let's discuss your technical requirements and engineering challenges.
                                    </p>
                                </div>

                                <div className="shrink-0">
                                    <a
                                        href={`mailto:${company.contact.email}?subject=Request%20a%20Consultation`}
                                        className="bg-cyan text-ink inline-flex h-14 items-center justify-center gap-3 px-7 text-xs font-bold tracking-[.15em] uppercase transition hover:bg-white"
                                    >
                                        Request a Consultation
                                        <Icon icon="lucide:arrow-up-right" className="text-base" />
                                    </a>
                                    <p className="text-dim mt-5 text-right text-xs">
                                        Or contact us directly at{' '}
                                        <a href={`mailto:${company.contact.email}`} className="text-cyan transition hover:text-white">
                                            {company.contact.email}
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        </PublicLayout>
    );
}
