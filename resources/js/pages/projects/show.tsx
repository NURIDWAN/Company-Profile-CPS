import { SeoHead } from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';

interface ProjectDetail {
    id: number;
    category: 'cme' | 'cathodic_protection';
    no: number;
    client: string;
    user: string;
    year: number | null;
    project: string;
    image_url: string | null;
}

interface ShowProps {
    project: ProjectDetail;
    related: ProjectDetail[];
    schemas?: Record<string, unknown>[];
    [key: string]: unknown;
}

const categoryLabel: Record<ProjectDetail['category'], string> = {
    cme: 'CME',
    cathodic_protection: 'Proteksi Katodik',
};

export default function ProjectShow({ project, related, schemas }: ShowProps) {
    return (
        <PublicLayout preloadImage={project.image_url ?? undefined}>
            <SeoHead
                title={project.project}
                description={`Referensi proyek ${project.project} untuk ${project.client}.`}
                ogType="website"
                schema={schemas}
                preloadImage={project.image_url}
            />
            <article className="bg-ink pt-32 pb-20 lg:pt-40 lg:pb-28">
                <section className="relative overflow-hidden border-b border-white/10">
                    {project.image_url && (
                        <img
                            src={project.image_url}
                            alt={project.project}
                            className="absolute inset-0 h-full w-full object-cover opacity-30"
                            loading="eager"
                            fetchPriority="high"
                        />
                    )}
                    <div className="hero-overlay absolute inset-0" />
                    <div className="grid-bg absolute inset-0 opacity-30" />
                    <div className="relative mx-auto max-w-4xl px-6 pb-20 lg:px-8 lg:pb-28">
                        <Link
                            href="/projects"
                            className="text-cyan inline-flex items-center gap-2 text-xs font-semibold tracking-[.14em] uppercase hover:underline"
                        >
                            <Icon icon="lucide:arrow-left" className="text-sm" /> Semua proyek
                        </Link>
                        <div className="mt-10 flex flex-wrap gap-3 font-mono text-[10px] tracking-[.18em] uppercase">
                            <span className="bg-cyan text-ink-foreground px-3 py-2">{categoryLabel[project.category]}</span>
                            {project.year && <span className="border-cyan/50 text-cyan border px-3 py-2">{project.year}</span>}
                        </div>
                        <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-[-.05em] text-white sm:text-5xl lg:text-6xl">
                            {project.project}
                        </h1>
                        <p className="text-soft mt-6 text-lg leading-8">Proyek untuk {project.client}</p>
                    </div>
                </section>

                <div className="mx-auto mt-14 grid max-w-4xl gap-12 px-6 lg:grid-cols-[1fr_18rem] lg:px-8">
                    <div>
                        {project.image_url && (
                            <img
                                src={project.image_url}
                                alt={project.project}
                                className="mb-10 max-h-[32rem] w-full border border-white/10 object-cover"
                            />
                        )}
                        <h2 className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Ringkasan proyek</h2>
                        <div className="mt-6 border-t border-white/10 pt-6">
                            <dl className="grid gap-5 text-sm sm:grid-cols-2">
                                <div>
                                    <dt className="text-dim font-mono text-[10px] tracking-[.16em] uppercase">Klien</dt>
                                    <dd className="mt-2 font-medium">{project.client}</dd>
                                </div>
                                <div>
                                    <dt className="text-dim font-mono text-[10px] tracking-[.16em] uppercase">Pengguna</dt>
                                    <dd className="mt-2 font-medium">{project.user}</dd>
                                </div>
                                <div>
                                    <dt className="text-dim font-mono text-[10px] tracking-[.16em] uppercase">Kategori</dt>
                                    <dd className="mt-2 font-medium">{categoryLabel[project.category]}</dd>
                                </div>
                                <div>
                                    <dt className="text-dim font-mono text-[10px] tracking-[.16em] uppercase">Nomor referensi</dt>
                                    <dd className="mt-2 font-medium">#{project.no}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <aside className="bg-panel h-fit border border-white/10 p-6">
                        <p className="text-dim font-mono text-[10px] tracking-[.18em] uppercase">Butuh solusi serupa?</p>
                        <h2 className="mt-4 text-xl leading-tight font-semibold">Diskusikan kebutuhan proyek Anda bersama CPS.</h2>
                        <Link
                            href="/consultation"
                            className="bg-cyan text-ink-foreground mt-6 inline-flex w-full items-center justify-center gap-3 px-5 py-3 text-[10px] font-bold tracking-[.16em] uppercase transition hover:bg-white"
                        >
                            Ajukan konsultasi <Icon icon="lucide:arrow-up-right" />
                        </Link>
                        <Link
                            href="/contact"
                            className="hover:border-cyan hover:text-cyan mt-3 inline-flex w-full items-center justify-center gap-3 border border-white/15 px-5 py-3 text-[10px] font-bold tracking-[.16em] text-white uppercase transition"
                        >
                            Hubungi kami <Icon icon="lucide:arrow-up-right" />
                        </Link>
                    </aside>
                </div>
            </article>

            {related.length > 0 && (
                <section className="bg-panel/40 border-t border-white/10 py-16 lg:py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <h2 className="text-xl font-semibold tracking-[-.03em] text-white">Proyek terkait</h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/projects/${item.id}`}
                                    className="service-card group bg-panel hover:border-cyan/70 flex flex-col overflow-hidden border border-white/10 transition duration-500 hover:-translate-y-1"
                                >
                                    <div className="flex h-32 items-center justify-center overflow-hidden bg-white/5">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.project} className="h-full w-full object-cover" loading="lazy" />
                                        ) : (
                                            <span className="text-cyan/40 font-mono text-2xl">CPS</span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="group-hover:text-cyan text-sm font-semibold text-white transition">{item.project}</h3>
                                        <p className="text-soft mt-1 line-clamp-2 text-xs leading-5">{item.client}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
