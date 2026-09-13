import { SeoHead } from '@/components/SeoHead';
import { RichText } from '@/components/public/rich-text';
import PublicLayout from '@/layouts/public-layout';
import { Icon } from '@iconify/react';
import { Link } from '@inertiajs/react';

export interface PublicProductDetail {
    id: number;
    name: string;
    slug: string;
    spec: string | null;
    description: string | null;
    image_url: string | null;
    category: { id: number; name: string; slug: string } | null;
}

interface ShowProps {
    product: PublicProductDetail;
    related: { id: number; name: string; slug: string; spec: string | null; image_url: string | null }[];
    schemas?: Record<string, unknown>[];
    [key: string]: unknown;
}

export default function ProductShow({ product, related, schemas }: ShowProps) {
    return (
        <PublicLayout preloadImage={product.image_url ?? undefined}>
            <SeoHead
                title={product.name}
                description={product.spec ?? 'Product detail'}
                ogType="product"
                schema={schemas}
                preloadImage={product.image_url}
            />
            <article className="bg-ink pt-32 pb-20 lg:pt-40 lg:pb-28">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <Link
                        href="/products"
                        className="text-cyan inline-flex items-center gap-2 text-xs font-semibold tracking-[.14em] uppercase hover:underline"
                    >
                        <Icon icon="lucide:arrow-left" className="text-sm" /> All products
                    </Link>

                    {product.category && <p className="text-dim mt-8 font-mono text-[11px] tracking-[.18em] uppercase">{product.category.name}</p>}
                    <h1 className="mt-4 text-4xl leading-[1.05] font-semibold tracking-[-.04em] text-white sm:text-5xl">{product.name}</h1>
                    {product.spec && <p className="text-soft mt-4 max-w-2xl text-base leading-7">{product.spec}</p>}

                    {product.image_url && (
                        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="max-h-[28rem] w-full object-cover"
                                loading="eager"
                                fetchPriority="high"
                            />
                        </div>
                    )}

                    {product.description ? (
                        <div className="mt-10">
                            <h2 className="text-ink-foreground/60 text-xs font-semibold tracking-[.2em] uppercase">Description</h2>
                            <RichText value={product.description} className="mt-5 [&_img]:rounded-xl [&_img]:border [&_img]:border-white/10" />
                        </div>
                    ) : (
                        <p className="text-soft mt-10 text-sm">
                            Detailed description coming soon. Contact us for more information about this product.
                        </p>
                    )}
                </div>
            </article>

            {related.length > 0 && (
                <section className="bg-panel/40 border-t border-white/10 py-16 lg:py-20">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <h2 className="text-xl font-semibold tracking-[-.03em] text-white">Related products</h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.slug}`}
                                    className="service-card group bg-panel hover:border-cyan/70 flex flex-col overflow-hidden border border-white/10 transition duration-500 hover:-translate-y-1"
                                >
                                    <div className="flex h-32 items-center justify-center overflow-hidden bg-white/5">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                                        ) : (
                                            <span className="text-cyan/40 font-mono text-2xl">CPS</span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="group-hover:text-cyan text-sm font-semibold text-white transition">{item.name}</h3>
                                        {item.spec && <p className="text-soft mt-1 line-clamp-2 text-xs leading-5">{item.spec}</p>}
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
