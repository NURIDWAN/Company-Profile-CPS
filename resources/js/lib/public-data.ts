import {
    company as fallbackCompany,
    divisions as fallbackDivisions,
    productCategories as fallbackProductCategories,
    projectReferences as fallbackProjectReferences,
} from '@/data/site-data';
import type { Division, GalleryItem, ProductCategory, ProjectReference, SharedData, SiteSetting } from '@/types';
import { usePage } from '@inertiajs/react';

export interface PublicCompany {
    name: string;
    tagline: string;
    about: string;
    address: {
        line1: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
        full: string;
    };
    contact: {
        phones: string[];
        fax: string;
        email: string;
        website: string;
    };
}

export interface PublicSiteData {
    company: PublicCompany;
    divisions: Division[];
    productCategories: ProductCategory[];
    projectReferences: {
        cme: ProjectReference[];
        cathodicProtection: ProjectReference[];
    };
    gallery: GalleryItem[];
}

function mapCompany(settings: SiteSetting | null | undefined): PublicCompany {
    if (!settings) return fallbackCompany;

    const address = [settings.address_line1, settings.city, settings.province, settings.country, settings.postal_code].filter(Boolean).join(', ');

    return {
        name: settings.site_name,
        tagline: settings.tagline ?? fallbackCompany.tagline,
        about: settings.about ?? fallbackCompany.about,
        address: {
            line1: settings.address_line1 ?? fallbackCompany.address.line1,
            city: settings.city ?? fallbackCompany.address.city,
            province: settings.province ?? fallbackCompany.address.province,
            postalCode: settings.postal_code ?? fallbackCompany.address.postalCode,
            country: settings.country ?? fallbackCompany.address.country,
            full: address || fallbackCompany.address.full,
        },
        contact: {
            phones: settings.phones?.filter(Boolean) ?? fallbackCompany.contact.phones,
            fax: settings.fax ?? fallbackCompany.contact.fax,
            email: settings.email ?? fallbackCompany.contact.email,
            website: settings.website ?? fallbackCompany.contact.website,
        },
    };
}

export function usePublicSiteData(): PublicSiteData {
    const { props } = usePage<SharedData>();
    const publicData = props.publicData;

    return {
        company: mapCompany(props.siteSettings),
        divisions: publicData?.divisions?.length ? publicData.divisions : (fallbackDivisions as unknown as Division[]),
        productCategories: publicData?.productCategories?.length
            ? publicData.productCategories
            : (fallbackProductCategories as unknown as ProductCategory[]),
        projectReferences: publicData?.projectReferences ?? (fallbackProjectReferences as unknown as PublicSiteData['projectReferences']),
        gallery: publicData?.gallery ?? [],
    };
}
