import { SeoHead } from '@/components/SeoHead';
import { RichText } from '@/components/public/rich-text';
import PublicLayout from '@/layouts/public-layout';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';

export interface PublicServiceDetail {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    points: string[];
    image_url: string | null;
}

interface RelatedService {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
}

interface ShowProps {
    service: PublicServiceDetail;
    related: RelatedService[];
    schemas?: Record<string, unknown>[];
    [key: string]: unknown;
}

export default function ServiceShow({ service, related, schemas }: ShowProps) {
    return (
        <PublicLayout preloadImage={service.image_url ?? undefined}>
            <SeoHead
                title={service.name}
                description={service.description ?? 'Detail layanan CPS'}
                ogType="website"
                schema={schemas}
                preloadImage={service.image_url}
            />
            <article className="bg-ink pt-32 pb-20 lg:pt-40 lg:pb-28">
                <section className="relative overflow-hidden border-b border-white/10">
                    {service.image_url && (
                        <img
                            src={service.image_url}
                            alt={service.name}
                            className="absolute inset-0 h-full w-full object-cover opacity-30"
                            loading="eager"
                            fetchPriority="high"
                        />
                    )}
                    <div className="hero-overlay absolute inset-0" />
                    <div className="grid-bg absolute inset-0 opacity-30" />
                    <div className="relative mx-auto max-w-4xl px-6 pb-20 lg:px-8 lg:pb-28">
                        <Link
                            href="/services"
                            className="text-cyan inline-flex items-center gap-2 text-xs font-semibold tracking-[.14em] uppercase hover:underline"
                        >
                            <Icon icon="lucide:arrow-left" className="text-sm" /> Semua layanan
                        </Link>
                        <p className="text-cyan mt-10 font-mono text-[11px] tracking-[.18em] uppercase">Layanan CPS / detail</p>
                        <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-[-.05em] text-white sm:text-5xl lg:text-6xl">
                            {service.name}
                        </h1>
                        {service.description && <RichText value={service.description} className="text-soft mt-7 max-w-2xl text-lg leading-8" />}
                    </div>
                </section>

                <div className="mx-auto mt-14 grid max-w-4xl gap-12 px-6 lg:grid-cols-[1fr_18rem] lg:px-8">
                    <div>
                        <h2 className="text-cyan font-mono text-[11px] tracking-[.2em] uppercase">Ruang lingkup layanan</h2>
                        {service.points.length > 0 ? (
                            <ul className="mt-6 space-y-4 border-t border-white/10 pt-6">
                                {service.points.map((point) => (
                                    <li key={point} className="text-soft flex gap-4 text-base leading-7">
                                        <span className="text-cyan shrink-0">—</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-soft mt-6 text-sm leading-7">Hubungi kami untuk mendapatkan informasi lengkap mengenai layanan ini.</p>
                        )}
                    </div>

                    <aside className="bg-panel h-fit border border-white/10 p-6">
                        <p className="text-dim font-mono text-[10px] tracking-[.18em] uppercase">Butuh solusi teknis?</p>
                        <h2 className="mt-4 text-xl leading-tight font-semibold">Mari diskusikan kebutuhan proyek Anda.</h2>
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
                        <h2 className="text-xl font-semibold tracking-[-.03em] text-white">Layanan lainnya</h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/services/${item.slug}`}
                                    className="service-card group bg-panel hover:border-cyan/70 flex flex-col overflow-hidden border border-white/10 transition duration-500 hover:-translate-y-1"
                                >
                                    <div className="flex h-40 items-center justify-center overflow-hidden bg-white/5">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                                        ) : (
                                            <span className="text-cyan/40 font-mono text-2xl">CPS</span>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="group-hover:text-cyan text-lg font-semibold text-white transition">{item.name}</h3>
                                        {item.description && (
                                            <RichText value={item.description} className="text-soft mt-3 line-clamp-3 text-sm leading-6" />
                                        )}
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
