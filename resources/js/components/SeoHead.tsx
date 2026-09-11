import type { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface SeoHeadProps {
    title: string;
    description: string;
    ogImage?: string | null;
    ogType?: 'website' | 'article';
    canonicalUrl?: string;
    schema?: Record<string, unknown> | Record<string, unknown>[];
    preloadImage?: string;
}

function absoluteUrl(value?: string | null): string | undefined {
    if (!value) return undefined;
    if (/^https?:\/\//i.test(value)) return value;
    if (typeof window !== 'undefined') return new URL(value, window.location.origin).toString();
    return value;
}

export function SeoHead({ title, description, ogImage, ogType = 'website', canonicalUrl, schema, preloadImage }: SeoHeadProps) {
    const { props } = usePage<SharedData>();
    const seo = props.seo;
    const finalTitle = title || seo?.title || props.siteSettings?.site_name || 'Citra Protecta Semesta';
    const finalDescription = description || seo?.description || props.siteSettings?.tagline || '';
    const finalCanonical = absoluteUrl(canonicalUrl || seo?.canonical);
    const finalImage = absoluteUrl(ogImage || seo?.ogImage || props.siteSettings?.logo_url);
    const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

    return (
        <Head title={finalTitle}>
            <meta name="description" content={finalDescription} />
            {preloadImage && <link rel="preload" as="image" href={absoluteUrl(preloadImage)} fetchPriority="high" />}
            <meta name="robots" content="index,follow,max-image-preview:large" />
            {finalCanonical && <link rel="canonical" href={finalCanonical} />}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            {finalCanonical && <meta property="og:url" content={finalCanonical} />}
            {finalImage && <meta property="og:image" content={finalImage} />}
            <meta name="twitter:card" content={finalImage ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            {finalImage && <meta name="twitter:image" content={finalImage} />}
            {schemas.map((item, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(item)}
                </script>
            ))}
        </Head>
    );
}

export type { SeoHeadProps };
