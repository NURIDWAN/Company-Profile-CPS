import { RichText } from '@/components/public/rich-text';
import PublicLayout from '@/layouts/public-layout';
import { usePublicContent } from '@/lib/public-content';
import { usePublicSiteData } from '@/lib/public-data';
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';

const CATEGORY_FILTERS = [
    { value: 'All', label: 'Semua' },
    { value: 'Electrical', label: 'Kelistrikan' },
    { value: 'Cathodic Protection', label: 'Proteksi Katodik' },
    { value: 'Mechanical', label: 'Mekanikal' },
    { value: 'CME', label: 'CME' },
    { value: 'Load Bank', label: 'Load Bank' },
];
const INDUSTRY_FILTERS = [
    { value: 'All', label: 'Semua' },
    { value: 'Minyak & Gas', label: 'Migas' },
    { value: 'Power', label: 'Ketenagalistrikan' },
    { value: 'Telekomunikasi', label: 'Telekomunikasi' },
    { value: 'Manufaktur', label: 'Manufaktur' },
    { value: 'Mining', label: 'Pertambangan' },
    { value: 'Referensi lainnya', label: 'Referensi lainnya' },
];

const INDUSTRIES = [
    [
        'lucide:droplets',
        'Minyak & Gas',
        'Solusi rekayasa khusus untuk operasi hulu, tengah, dan hilir. Sistem kelistrikan, proteksi katodik, dan infrastruktur tenaga untuk lingkungan yang menantang.',
    ],
    [
        'lucide:zap',
        'Pembangkit Listrik',
        'Sistem distribusi listrik, load bank, solusi UPS, dan kendali generator untuk pembangkitan serta sistem cadangan yang andal.',
    ],
    [
        'lucide:radio-tower',
        'Telekomunikasi',
        'Rekayasa infrastruktur, sistem tenaga, dan dukungan peralatan jaringan untuk jaringan seluler serta fasilitas telekomunikasi.',
    ],
    ['lucide:factory', 'Manufaktur', 'Panel listrik industri, sistem kendali proses, dan solusi otomasi untuk kegiatan manufaktur.'],
    ['lucide:building-2', 'Infrastruktur', 'Rekayasa infrastruktur kritis yang mencakup sistem kelistrikan, dukungan HVAC, dan otomasi gedung.'],
    ['lucide:network', 'Energi & Utilitas', 'Jaringan distribusi, desain gardu induk, dan solusi kelistrikan skala utilitas.'],
    [
        'lucide:pickaxe',
        'Pertambangan & Ekstraksi',
        'Sistem kelistrikan tangguh yang dirancang untuk lingkungan pertambangan dengan keandalan dan keselamatan.',
    ],
    ['lucide:truck', 'Transportasi & Logistik', 'Sistem tenaga untuk pusat transportasi, fasilitas logistik, dan dukungan infrastruktur.'],
] as const;

const CAPABILITIES = [
    ['lucide:network', 'Desain & Instalasi Sistem Kelistrikan', 'Sistem kelistrikan dan dukungan instalasi untuk lingkungan proyek yang menantang.'],
    ['lucide:shield-check', 'Sistem Proteksi Katodik', 'Sistem proteksi yang mencakup transformer rectifier, junction box, test point, dan CIPS.'],
    ['lucide:battery-charging', 'Manajemen Daya & Solusi UPS', 'Kapabilitas UPS, pemantauan baterai, charger, inverter, dan rectifier.'],
    ['lucide:activity', 'Pengujian & Analisis Load Bank', 'Load bank DC, load bank AC, pengujian baterai, dan pengujian genset.'],
    ['lucide:monitor-check', 'Sistem Pemantauan Baterai', 'Solusi pemantauan untuk mendukung daya kritis dan keberlangsungan operasional.'],
    ['lucide:panel-top', 'Manufaktur Panel Kendali', 'Panel listrik, panel instrumen, panel ATS/MF, dan panel tahan ledakan.'],
] as const;

const SECTOR_KEYWORDS: Record<string, string[]> = {
    'Minyak & Gas': ['pertamina', 'conoco', 'petrochina', 'total e&p', 'vico', 'calm', 'medco', 'star energy'],
    Power: ['pln', 'pltu', 'pltgu', 'pjb', 'indonesia power', 'geothermal'],
    Telecommunications: ['telkomsel', 'indosat', 'excelcom', 'bakrie telecom', 'mobile 8', 'protelindo', 'cbn'],
    Manufacturing: ['paragon', 'krakatau', 'chandra asih'],
    Mining: ['adaro', 'sebuku', 'kaltim'],
    'Referensi lainnya': [],
};

const PROJECTS = [
    {
        category: 'Electrical',
        client: 'Pertamina',
        description: 'Electrical system engineering and installation for power distribution infrastructure.',
        image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1200&q=85',
    },
    {
        category: 'Cathodic Protection',
        client: 'ConocoPhillips',
        description: 'Cathodic protection system design and installation for offshore infrastructure.',
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1200&q=85',
    },
    {
        category: 'CME',
        client: 'Telkomsel',
        description: 'Telecommunications infrastructure and power system engineering.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
    },
    {
        category: 'CME',
        client: 'Indosat',
        description: 'Electrical and communication infrastructure project.',
        image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1200&q=85',
    },
    {
        category: 'Load Bank',
        client: 'PLN',
        description: 'Load bank testing and power system validation services.',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=85',
    },
    {
        category: 'Electrical',
        client: 'Adaro',
        description: 'Mining facility electrical systems and power distribution.',
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=85',
    },
] as const;

function industryForProject(client: string, user: string): string {
    const value = `${client} ${user}`.toLowerCase();
    return Object.entries(SECTOR_KEYWORDS).find(([, keywords]) => keywords.some((keyword) => value.includes(keyword)))?.[0] ?? 'Referensi lainnya';
}

export default function Projects() {
    const { company, projectReferences, gallery } = usePublicSiteData();
    const { content, media } = usePublicContent('projects');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeIndustry, setActiveIndustry] = useState('All');
    const [search, setSearch] = useState('');
    const galleryImages = gallery.filter((item) => item.image_url).map((item) => item.image_url as string);
    const totalReferences = projectReferences.cme.length + projectReferences.cathodicProtection.length;
    const databaseProjects = [...projectReferences.cme, ...projectReferences.cathodicProtection].map((reference, index) => ({
        category: reference.category === 'cathodic_protection' ? 'Cathodic Protection' : 'Electrical',
        client: reference.client,
        user: reference.user,
        description: reference.project,
        image: galleryImages[index] ?? PROJECTS[index % PROJECTS.length].image,
        alt: `${reference.client} project reference`,
    }));
    const projects = databaseProjects.length
        ? databaseProjects
        : PROJECTS.map((project) => ({ ...project, user: '', alt: `${project.client} project reference` }));
    const visibleProjects = useMemo(() => {
        const query = search.trim().toLowerCase();
        return projects.filter((project) => {
            const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
            const matchesIndustry = activeIndustry === 'All' || industryForProject(project.client, project.user) === activeIndustry;
            const matchesSearch = !query || `${project.client} ${project.user} ${project.description}`.toLowerCase().includes(query);
            return matchesCategory && matchesIndustry && matchesSearch;
        });
    }, [activeCategory, activeIndustry, projects, search]);
    const stats = [
        { value: `${totalReferences}+`, label: 'Referensi proyek' },
        { value: '03', label: 'Divisi inti' },
        { value: '06', label: 'Kategori proyek' },
    ];

    return (
        <PublicLayout>
            <>
                <section className="grain relative flex min-h-[680px] items-end overflow-hidden border-b border-white/10 lg:min-h-[760px]">
                    <img
                        className="hero-image absolute inset-0 h-full w-full object-cover opacity-65"
                        src={
                            media('hero.background')?.image_url ??
                            media('industries.background')?.image_url ??
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
                            {content('hero.eyebrow', 'Proyek & Industri / 01')}
                        </p>
                        <h1 className="reveal mt-7 max-w-4xl text-5xl leading-[.98] font-semibold tracking-[-.055em] delay-1 sm:text-6xl lg:text-7xl">
                            {content('hero.title', 'Solusi Rekayasa untuk Berbagai Industri')}
                        </h1>
                        <p className="reveal text-soft mt-8 max-w-2xl text-base leading-7 delay-2 sm:text-lg">
                            {content(
                                'hero.description',
                                'CPS menghadirkan solusi rekayasa kelistrikan dan elektronik untuk berbagai sektor kritis dan proyek yang menantang.',
                            )}
                        </p>
                        <p className="reveal text-dim mt-4 max-w-2xl text-sm leading-7 delay-2">
                            {totalReferences}+ referensi proyek yang menunjukkan keahlian kami di berbagai industri.
                        </p>
                        <div className="text-dim mt-16 flex items-center gap-8 font-mono text-[10px] tracking-[.18em] uppercase">
                            <span>PT. CITRA PROTECTA SEMESTA</span>
                            <span className="bg-cyan/50 hidden h-px w-16 sm:block" />
                            <span className="hidden sm:block">Rekayasa Kelistrikan &amp; Elektronik</span>
                        </div>
                    </div>
                </section>

                <section id="industries" className="bg-night py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Fokus industri / 02</p>
                        <h2 className="mt-5 max-w-3xl text-4xl leading-[1] font-semibold tracking-[-.05em] sm:text-6xl">
                            {content('industries.title', 'Kedalaman teknis untuk lingkungan kritis.')}
                        </h2>
                        <p className="text-soft mt-7 max-w-xl text-base leading-8">
                            {content(
                                'industries.description',
                                'Kapabilitas rekayasa diterapkan pada industri yang bergantung pada sistem, peralatan, dan infrastruktur yang andal.',
                            )}
                        </p>
                        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {INDUSTRIES.map(([icon, title, description], index) => (
                                <article
                                    key={title}
                                    className="group bg-panel hover:border-cyan/70 border border-white/10 p-7 transition duration-500 hover:-translate-y-1"
                                >
                                    <div className="flex items-start justify-between">
                                        <Icon icon={icon} className="text-soft group-hover:text-cyan text-3xl transition" />
                                        <span className="text-dim group-hover:text-cyan font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
                                    </div>
                                    <h3 className="mt-10 text-lg font-semibold tracking-[.04em] uppercase">{title}</h3>
                                    <RichText value={description} className="text-soft mt-5 text-sm leading-7" />
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="capabilities" className="grid-bg bg-steel border-y border-white/10 py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Kapabilitas lintas industri / 03</p>
                        <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">
                            {content('capabilities.title', 'Kapabilitas lintas industri.')}
                        </h2>
                        <p className="text-soft mt-7 max-w-xl text-base leading-8">
                            {content('capabilities.description', 'Keahlian teknis kami mencakup berbagai area layanan dan penerapan industri.')}
                        </p>
                        <div className="mt-14 grid border-t border-l border-white/10 sm:grid-cols-2 lg:grid-cols-3">
                            {CAPABILITIES.map(([icon, title, description]) => (
                                <div key={title} className="hover:bg-panel border-r border-b border-white/10 p-7 transition lg:p-9">
                                    <Icon icon={icon} className="text-cyan text-2xl" />
                                    <h3 className="mt-7 text-sm font-semibold tracking-[.06em] uppercase">{title}</h3>
                                    <RichText value={description} className="text-soft mt-4 text-sm leading-7" />
                                </div>
                            ))}
                            <div className="hover:bg-panel border-r border-b border-white/10 p-7 transition lg:col-span-3 lg:p-9">
                                <h3 className="text-sm font-semibold tracking-[.06em] uppercase">Layanan Pemeliharaan &amp; Dukungan</h3>
                                <p className="text-soft mt-4 max-w-2xl text-sm leading-7">
                                    Dukungan servis dan pemeliharaan untuk pemantauan energi, UPS, baterai, charger, inverter, rectifier, dan sistem
                                    rekayasa terkait.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="projects" className="bg-ink py-20 lg:py-28">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                            <div>
                                <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Referensi proyek / 04</p>
                                <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
                                    {content('portfolio.title', 'Referensi rekayasa.')}
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORY_FILTERS.map((filter) => (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        onClick={() => setActiveCategory(filter.value)}
                                        aria-pressed={activeCategory === filter.value}
                                        className={`border px-4 py-2 font-mono text-[10px] tracking-[.12em] uppercase transition ${activeCategory === filter.value ? 'border-cyan bg-cyan text-ink-foreground' : 'text-dim hover:border-cyan hover:text-cyan border-white/10'}`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-5 flex flex-col gap-3 md:flex-row">
                            <label className="sr-only" htmlFor="project-search">
                                Cari proyek
                            </label>
                            <input
                                id="project-search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari klien, pengguna, atau proyek"
                                className="bg-panel placeholder:text-dim focus:border-cyan min-h-11 flex-1 border border-white/10 px-4 text-sm text-white outline-none"
                            />
                            <div className="flex flex-wrap gap-2">
                                {INDUSTRY_FILTERS.map((filter) => (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        onClick={() => setActiveIndustry(filter.value)}
                                        aria-pressed={activeIndustry === filter.value}
                                        className={`border px-3 py-2 font-mono text-[10px] tracking-[.1em] uppercase transition ${activeIndustry === filter.value ? 'border-cyan bg-cyan text-ink-foreground' : 'text-dim hover:border-cyan hover:text-cyan border-white/10'}`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {visibleProjects.length > 0 ? (
                            <div className="mt-14 grid gap-8 md:grid-cols-2">
                                {visibleProjects.map((project) => (
                                    <article
                                        key={`${project.client}-${project.description}`}
                                        className="project-card group bg-panel hover:border-cyan/70 overflow-hidden border border-white/10 transition duration-500 hover:-translate-y-1"
                                    >
                                        <div className="relative h-72 overflow-hidden">
                                            <img
                                                className="h-full w-full object-cover grayscale-[.35] transition duration-700"
                                                src={project.image}
                                                alt={project.alt}
                                                loading="lazy"
                                            />
                                            <span className="bg-cyan text-ink-foreground absolute top-5 left-5 px-3 py-2 font-mono text-[10px] uppercase">
                                                {project.category}
                                            </span>
                                        </div>
                                        <div className="p-7">
                                            <div className="flex items-start justify-between gap-5">
                                                <div>
                                                    <h3 className="text-2xl font-semibold tracking-[-.04em]">{project.client}</h3>
                                                    {project.user && (
                                                        <p className="text-dim mt-1 text-xs uppercase">
                                                            {industryForProject(project.client, project.user)}
                                                        </p>
                                                    )}
                                                    <RichText value={project.description} className="text-soft mt-3 text-sm leading-7" />
                                                </div>
                                                <span className="text-dim shrink-0 font-mono text-[10px] tracking-[.12em] uppercase">Referensi</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-10 border border-dashed border-white/10 px-6 py-16 text-center">
                                <Icon icon="lucide:search-x" className="text-dim text-3xl" />
                                <p className="text-dim mt-4 font-mono text-xs tracking-[.16em] uppercase">
                                    Tidak ada referensi proyek yang sesuai dengan filter Anda
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <section id="project-scope" className="bg-steel border-y border-white/10 py-20 lg:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Cakupan portofolio / 05</p>
                        <h2 className="mt-5 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">{totalReferences}+ referensi proyek.</h2>
                        <p className="text-soft mt-6 max-w-md text-sm leading-7">
                            {content(
                                'scope.description',
                                'Portofolio yang mencakup sistem kelistrikan, proteksi katodik, infrastruktur telekomunikasi, dan pengujian load bank.',
                            )}
                        </p>
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

                <section id="contact" className="bg-night py-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="bg-panel relative overflow-hidden border border-white/10 px-7 py-12 sm:px-12 lg:px-16 lg:py-16">
                            <div className="grid-bg absolute inset-0 opacity-20" />
                            <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
                                <div>
                                    <p className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">
                                        {content('cta.eyebrow', 'Proyek berikutnya / 06')}
                                    </p>
                                    <h2 className="mt-6 max-w-3xl text-4xl leading-[.98] font-semibold tracking-[-.055em] sm:text-6xl">
                                        {content('cta.title', 'Siap mengerjakan proyek berikutnya?')}
                                    </h2>
                                    <p className="text-soft mt-7 max-w-xl text-base leading-7">
                                        {content('cta.description', 'Mari diskusikan kebutuhan teknis dan tantangan rekayasa Anda.')}
                                    </p>
                                </div>
                                <a
                                    href={`mailto:${company.contact.email}?subject=Request%20a%20Consultation`}
                                    className="bg-cyan text-ink-foreground inline-flex h-14 items-center justify-center gap-3 px-7 text-xs font-bold tracking-[.15em] uppercase transition hover:bg-white"
                                >
                                    Ajukan Konsultasi <Icon icon="lucide:arrow-up-right" className="text-base" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        </PublicLayout>
    );
}
