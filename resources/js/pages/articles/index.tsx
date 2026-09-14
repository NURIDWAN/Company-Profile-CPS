import { SeoHead } from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { type PaginatedResponse } from '@/types';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';

export interface PublicArticleSummary {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    cover_url: string | null;
    cover_alt: string | null;
    published_at: string | null;
    reading_time: number;
}

function formatDate(value: string | null): string {
    if (!value) return '';
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value));
}

export default function ArticlesIndex({ articles }: { articles: PaginatedResponse<PublicArticleSummary> }) {
    return (
        <PublicLayout>
            <SeoHead
                title="Artikel & Wawasan Rekayasa"
                description="Baca artikel rekayasa, panduan teknis, dan wawasan industri dari PT. Citra Protecta Semesta."
                ogType="website"
            />
            <section className="grid-bg bg-night border-b border-white/10 pt-40 pb-20 lg:pb-24">
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <p className="reveal text-cyan flex items-center gap-3 font-mono text-[11px] tracking-[.22em] uppercase">
                        <span className="bg-cyan h-px w-10" /> Artikel / Wawasan
                    </p>
                    <h1 className="reveal mt-7 max-w-4xl text-5xl leading-[1.02] font-semibold tracking-[-.055em] text-white delay-1 sm:text-6xl">
                        Wawasan rekayasa &amp; panduan teknis.
                    </h1>
                    <p className="reveal text-soft mt-8 max-w-xl text-base leading-7 delay-2">
                        Pengetahuan dari lapangan — sistem tenaga, proteksi katodik, dan praktik rekayasa industri.
                    </p>
                </div>
            </section>

            <section className="bg-ink py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {articles.data.length === 0 ? (
                        <p className="text-soft py-16 text-center text-sm">Belum ada artikel yang diterbitkan. Silakan kunjungi kembali nanti.</p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {articles.data.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/articles/${article.slug}`}
                                    className="service-card group bg-panel hover:border-cyan/70 relative flex flex-col overflow-hidden border border-white/10 transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(0,217,255,.08)]"
                                >
                                    {article.cover_url && (
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={article.cover_url}
                                                alt={article.cover_alt ?? article.title}
                                                className="h-full w-full object-cover transition duration-700"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-1 flex-col p-6">
                                        <p className="text-dim font-mono text-[10px] tracking-[.16em] uppercase">
                                            {formatDate(article.published_at)} · waktu baca {article.reading_time} menit
                                        </p>
                                        <h2 className="mt-4 text-xl leading-snug font-semibold tracking-[-.02em]">{article.title}</h2>
                                        <p className="text-soft mt-3 line-clamp-3 flex-1 text-sm leading-6">{article.excerpt}</p>
                                        <span className="text-cyan mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[.14em] uppercase">
                                            Baca artikel{' '}
                                            <Icon icon="lucide:arrow-right" className="text-sm transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {articles.last_page > 1 && (
                        <nav className="mt-12 flex justify-center gap-2" aria-label="Paginasi artikel">
                            {articles.links?.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    preserveScroll
                                    className={`border-public-border flex h-10 min-w-10 items-center justify-center border px-3 text-sm transition ${
                                        link.active ? 'bg-cyan text-ink-foreground border-cyan' : 'hover:border-cyan hover:text-cyan'
                                    } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
