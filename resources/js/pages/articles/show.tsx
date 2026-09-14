import { SeoHead } from '@/components/SeoHead';
import { RichText } from '@/components/public/rich-text';
import PublicLayout from '@/layouts/public-layout';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';

export interface PublicArticleDetail {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_url: string | null;
    cover_alt: string | null;
    published_at: string | null;
    reading_time: number;
    seo_keywords: string | null;
}

interface ShowProps {
    article: PublicArticleDetail;
    schemas?: Record<string, unknown>[];
    [key: string]: unknown;
}

function formatDate(value: string | null): string {
    if (!value) return '';
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(value));
}

export default function ArticleShow({ article, schemas }: ShowProps) {
    return (
        <PublicLayout preloadImage={article.cover_url ?? undefined}>
            <SeoHead title={article.title} description={article.excerpt} ogType="article" schema={schemas} preloadImage={article.cover_url} />
            <article className="bg-ink pb-20 lg:pb-28">
                <section
                    className="relative isolate overflow-hidden bg-cover bg-center pt-32 pb-20 lg:pt-40 lg:pb-28"
                    style={article.cover_url ? { backgroundImage: `url(${article.cover_url})` } : undefined}
                >
                    <div className="from-night/95 via-night/85 to-night/65 absolute inset-0 -z-10 bg-gradient-to-br" />
                    <div className="bg-cyan/10 absolute inset-0 -z-10" />
                    <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
                        <Link
                            href="/articles"
                            className="text-cyan inline-flex items-center gap-2 text-xs font-semibold tracking-[.14em] uppercase hover:underline"
                        >
                            <Icon icon="lucide:arrow-left" className="text-sm" /> Semua artikel
                        </Link>
                        <p className="text-soft mt-8 font-mono text-[11px] tracking-[.18em] uppercase">
                            {formatDate(article.published_at)} · waktu baca {article.reading_time} menit
                        </p>
                        <h1 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-[-.04em] text-white sm:text-5xl">{article.title}</h1>
                        {article.excerpt && <p className="text-soft mt-6 max-w-2xl text-lg leading-8">{article.excerpt}</p>}
                    </div>
                </section>

                <div className="mx-auto mt-12 max-w-3xl px-6 lg:px-8">
                    <RichText
                        value={article.content}
                        className="text-soft [&_blockquote]:border-cyan text-[15px] leading-8 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_img]:my-8 [&_img]:h-auto [&_img]:w-full [&_img]:border [&_img]:border-white/10"
                    />

                    {article.seo_keywords && (
                        <div className="mt-12 border-t border-white/10 pt-8">
                            <p className="text-dim font-mono text-[10px] tracking-[.18em] uppercase">Kata kunci</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {article.seo_keywords.split(',').map((keyword) => (
                                    <span key={keyword} className="border-public-border text-soft border px-3 py-1 text-xs">
                                        {keyword.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </PublicLayout>
    );
}
