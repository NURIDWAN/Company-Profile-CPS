import { usePage } from '@inertiajs/react';
import type { ImgHTMLAttributes } from 'react';

import type { SharedData } from '@/types';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    const { props: pageProps } = usePage<SharedData>();
    const siteName = pageProps.siteSettings?.site_name ?? 'PT. Citra Protecta Semesta';
    const logoUrl = pageProps.siteSettings?.logo_url ?? '/logo.svg';

    return <img {...props} src={logoUrl} alt={props.alt ?? siteName} />;
}
