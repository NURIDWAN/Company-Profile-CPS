import { SeoHead } from '@/components/SeoHead';
import { WhatsappPopup } from '@/components/whatsapp-popup';
import type { SharedData } from '@/types';
import { Icon } from '@iconify/react';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Industries', href: '/industries' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' },
];

export default function PublicLayout({ children, preloadImage }: { children: React.ReactNode; preloadImage?: string }) {
    const { props } = usePage<SharedData>();
    const { siteSettings, seo } = props;
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteSettings?.site_name ?? 'PT. Citra Protecta Semesta',
        url: seo?.canonical ?? siteSettings?.website ?? undefined,
        logo: siteSettings?.logo_url ?? undefined,
        image: siteSettings?.og_image_url ?? siteSettings?.logo_url ?? undefined,
        description: siteSettings?.about ?? siteSettings?.tagline ?? undefined,
        email: siteSettings?.email ?? undefined,
        telephone: siteSettings?.phones?.[0] ?? undefined,
        address: siteSettings?.address_line1
            ? {
                  '@type': 'PostalAddress',
                  streetAddress: siteSettings.address_line1,
                  addressLocality: siteSettings.city ?? undefined,
                  addressRegion: siteSettings.province ?? undefined,
                  postalCode: siteSettings.postal_code ?? undefined,
                  addressCountry: siteSettings.country ?? 'ID',
              }
            : undefined,
        sameAs: [siteSettings?.social_facebook, siteSettings?.social_instagram, siteSettings?.social_linkedin, siteSettings?.social_youtube].filter(
            (value): value is string => Boolean(value),
        ),
    };
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <SeoHead
                title={seo?.title ?? siteSettings?.site_name ?? 'Citra Protecta Semesta'}
                description={seo?.description ?? siteSettings?.tagline ?? ''}
                ogImage={seo?.ogImage ?? siteSettings?.logo_url}
                ogType={seo?.ogType ?? 'website'}
                canonicalUrl={seo?.canonical}
                schema={organizationSchema}
                preloadImage={preloadImage}
            />
            <div className="bg-ink min-h-screen overflow-hidden font-sans text-[#F5F7FA]">
                <header
                    className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
                        scrolled ? 'bg-night/95 border-white/10 backdrop-blur-md' : 'border-transparent'
                    }`}
                >
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                        <Link href="/" className="public-brand flex items-center gap-3" aria-label="CPS home">
                            {siteSettings?.logo_url ? (
                                <img
                                    src={siteSettings.logo_url}
                                    alt={siteSettings.site_name}
                                    width="40"
                                    height="40"
                                    className="h-10 w-auto max-w-40 object-contain"
                                />
                            ) : (
                                <span className="border-cyan/60 text-cyan flex h-10 w-10 items-center justify-center border text-lg font-bold tracking-[-.08em]">
                                    CPS
                                </span>
                            )}
                            <span className="hidden text-[11px] font-semibold tracking-[.24em] text-white uppercase sm:block">
                                {siteSettings?.site_name ?? 'Citra Protecta'}
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="public-nav-link text-soft hover:text-cyan text-xs tracking-[.16em] uppercase transition"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/contact"
                                className="public-cta border-cyan bg-cyan text-ink hover:text-cyan hidden items-center gap-3 border px-4 py-3 text-[10px] font-bold tracking-[.14em] uppercase transition hover:bg-transparent sm:flex"
                            >
                                Request a Consultation
                                <Icon icon="lucide:arrow-up-right" className="text-base" />
                            </Link>
                            <button
                                type="button"
                                onClick={() => setMenuOpen((open) => !open)}
                                className="public-menu-button flex h-11 w-11 items-center justify-center border border-white/10 text-white lg:hidden"
                                aria-label="Toggle navigation menu"
                                aria-expanded={menuOpen}
                            >
                                <Icon icon={menuOpen ? 'lucide:x' : 'lucide:menu'} className="text-xl" />
                            </button>
                        </div>
                    </div>

                    {menuOpen && (
                        <div className="public-mobile-menu bg-night border-t border-white/10 px-6 py-5 lg:hidden">
                            <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
                                {NAV_ITEMS.map((item) => (
                                    <Link key={item.label} href={item.href} className="public-nav-link text-soft text-xs tracking-[.16em] uppercase">
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    )}
                </header>

                <main className="public-main">{children}</main>

                <footer className="public-footer bg-ink border-t border-white/10">
                    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
                            <div className="flex items-center gap-4">
                                {siteSettings?.logo_url ? (
                                    <img
                                        src={siteSettings.logo_url}
                                        alt={siteSettings.site_name}
                                        width="40"
                                        height="40"
                                        className="h-10 w-auto max-w-40 object-contain"
                                    />
                                ) : (
                                    <span className="border-cyan text-cyan flex h-10 w-10 items-center justify-center border text-lg font-bold tracking-[-.08em]">
                                        CPS
                                    </span>
                                )}
                                <div>
                                    <p className="text-xs font-semibold tracking-[.18em] text-white uppercase">
                                        {siteSettings?.site_name ?? 'Citra Protecta Semesta'}
                                    </p>
                                    <p className="text-dim mt-1 text-xs">Electrical &amp; Electronic Engineering</p>
                                </div>
                            </div>
                            <nav className="flex flex-wrap gap-x-7 gap-y-3" aria-label="Footer navigation">
                                {NAV_ITEMS.map((item) => (
                                    <Link key={item.label} href={item.href} className="public-nav-link text-dim hover:text-cyan text-xs transition">
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="text-dim mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[10px] tracking-[.16em] uppercase sm:flex-row">
                            <span>© PT. Citra Protecta Semesta</span>
                            <span>All Rights Reserved.</span>
                        </div>
                    </div>
                </footer>
                <WhatsappPopup settings={siteSettings} />
            </div>
        </>
    );
}
