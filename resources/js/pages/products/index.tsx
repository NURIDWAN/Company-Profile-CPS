import { SeoHead } from '@/components/SeoHead';
import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';

export interface ProductSummary {
    id: number;
    name: string;
    slug: string;
    spec: string | null;
    image_url: string | null;
}

export interface ProductCategoryGroup {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    products: ProductSummary[];
}

export default function ProductsIndex({ categories }: { categories: ProductCategoryGroup[] }) {
    const total = categories.reduce((count, category) => count + category.products.length, 0);

    return (
        <PublicLayout>
            <SeoHead
                title="Produk Kami"
                description="Jelajahi produk rekayasa CPS untuk sistem proteksi katodik, kelistrikan, dan elektronik."
                ogType="website"
            />
            <section className="grid-bg bg-night border-b border-white/10 pt-40 pb-20 lg:pb-24">
                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <p className="reveal text-cyan flex items-center gap-3 font-mono text-[11px] tracking-[.22em] uppercase">
                        <span className="bg-cyan h-px w-10" /> Produk / Portofolio
                    </p>
                    <h1 className="reveal mt-7 max-w-4xl text-5xl leading-[1.02] font-semibold tracking-[-.055em] text-white delay-1 sm:text-6xl">
                        Produk rekayasa untuk sistem kritis.
                    </h1>
                    <p className="reveal text-soft mt-6 max-w-2xl text-base leading-7 delay-2">
                        {total > 0
                            ? `${total} produk dalam ${categories.length} kategori — proteksi katodik, sistem kelistrikan, dan elektronik.`
                            : 'Sistem proteksi katodik, kelistrikan, dan elektronik yang direkayasa untuk lingkungan kerja yang menantang.'}
                    </p>
                </div>
            </section>

            <section className="bg-ink py-20 lg:py-28">
                <div className="mx-auto max-w-7xl space-y-16 px-6 lg:px-8">
                    {total === 0 && (
                        <p className="text-soft py-16 text-center text-sm">Belum ada produk yang tersedia. Silakan kunjungi kembali nanti.</p>
                    )}
                    {categories.map(
                        (category) =>
                            category.products.length > 0 && (
                                <div key={category.id}>
                                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                                        <h2 className="text-2xl font-semibold tracking-[-.03em] text-white">{category.name}</h2>
                                        <span className="text-dim font-mono text-[11px] tracking-[.18em] uppercase">
                                            {category.products.length} produk
                                        </span>
                                    </div>
                                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {category.products.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.slug}`}
                                                className="service-card group bg-panel hover:border-cyan/70 relative flex flex-col overflow-hidden border border-white/10 transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(0,217,255,.08)]"
                                            >
                                                <div className="flex h-44 items-center justify-center overflow-hidden bg-white/5">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <span className="text-cyan/40 font-mono text-3xl">CPS</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-1 flex-col gap-2 p-5">
                                                    <h3 className="group-hover:text-cyan text-base font-semibold text-white transition">
                                                        {product.name}
                                                    </h3>
                                                    {product.spec && <p className="text-soft line-clamp-2 text-sm leading-6">{product.spec}</p>}
                                                    <span className="text-cyan mt-auto inline-flex items-center gap-1.5 pt-2 text-xs font-semibold tracking-[.12em] uppercase">
                                                        Lihat detail
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ),
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
