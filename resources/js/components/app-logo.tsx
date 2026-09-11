import { usePage } from '@inertiajs/react';

import type { SharedData } from '@/types';
export default function AppLogo() {
    const { props } = usePage<SharedData>();
    const siteName = props.siteSettings?.site_name ?? 'PT. Citra Protecta Semesta';
    const logoUrl = props.siteSettings?.logo_url ?? '/logo.svg';

    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md">
                <img src={logoUrl} alt={siteName} width="32" height="32" className="h-full w-full object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">{siteName}</span>
            </div>
        </>
    );
}
