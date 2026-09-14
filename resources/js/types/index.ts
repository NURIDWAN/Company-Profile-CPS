import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SeoData {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string | null;
    ogType?: 'website' | 'article';
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    flash: { success?: string };
    seo?: SeoData;
    siteSettings?: SiteSetting | null;
    publicData?: PublicData;
    publicContent?: Record<string, string | null>;
    publicMedia?: Record<string, PageMedia>;
    [key: string]: unknown;
}

export interface ManagedUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
}

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    company: string | null;
    project_type: string;
    message: string;
    status: 'new' | 'read' | 'replied' | string;
    created_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface SiteSetting {
    id: number;
    site_name: string;
    tagline: string | null;
    about: string | null;
    address_line1: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
    country: string | null;
    phones: string[] | null;
    fax: string | null;
    email: string | null;
    website: string | null;
    whatsapp_number: string | null;
    whatsapp_message: string | null;
    logo_path: string | null;
    logo_url: string | null;
    map_embed_url: string | null;
    seo_title: string | null;
    seo_description: string | null;
    social_facebook: string | null;
    social_instagram: string | null;
    social_linkedin: string | null;
    social_youtube: string | null;
    og_image_path: string | null;
    og_image_url: string | null;
}

export interface Division {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    points: string[] | null;
    image_path: string | null;
    image_url: string | null;
    sort_order: number;
}

export interface Product {
    id: number;
    product_category_id: number;
    slug: string | null;
    name: string;
    spec: string | null;
    description: string | null;
    image_path: string | null;
    image_url?: string;
    sort_order: number;
}

export interface ProductCategory {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    sort_order: number;
    products?: Product[];
}

export interface ProjectReference {
    id: number;
    category: 'cme' | 'cathodic_protection';
    no: number;
    client: string;
    user: string;
    year: number | null;
    project: string;
    image_path: string | null;
    image_url: string | null;
}

export interface GalleryItem {
    id: number;
    product_category_id: number | null;
    caption: string;
    project: string | null;
    image_path: string | null;
    image_url: string | null;
    sort_order: number;
    category?: ProductCategory | null;
}

export interface PageContent {
    id: number;
    page_key: string;
    section_key: string;
    field_key: string;
    field_type: string;
    value: string | null;
    sort_order: number;
}

export interface PageMedia {
    id: number;
    page_key: string;
    section_key: string;
    media_key: string;
    image_path: string | null;
    image_url: string | null;
    alt_text: string | null;
    sort_order: number;
}

export interface PublicData {
    divisions: Division[];
    productCategories: ProductCategory[];
    projectReferences: {
        cme: ProjectReference[];
        cathodicProtection: ProjectReference[];
    };
    gallery: GalleryItem[];
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links?: Array<{ url: string | null; label: string; active: boolean }>;
}
