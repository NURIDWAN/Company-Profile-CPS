import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import { Briefcase, FileText, Folder, Image, LayoutGrid, Mail, Newspaper, Package, Settings, Users } from 'lucide-react';
import AppLogo from './app-logo';

const navGroups: NavGroup[] = [
    {
        title: 'Navigasi',
        items: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Pesan CRM',
                url: '/admin/crm',
                icon: Mail,
            },
            {
                title: 'Kelola Pengguna',
                url: '/admin/users',
                icon: Users,
            },
        ],
    },
    {
        title: 'Data Master',
        items: [
            {
                title: 'Divisi',
                url: '/admin/divisions',
                icon: Folder,
            },
            {
                title: 'Kategori & Produk',
                url: '/admin/categories',
                icon: Package,
            },
            {
                title: 'Referensi Proyek',
                url: '/admin/projects',
                icon: Briefcase,
            },
            {
                title: 'Galeri',
                url: '/admin/gallery',
                icon: Image,
            },
        ],
    },
    {
        title: 'Artikel',
        items: [
            {
                title: 'Kelola Artikel',
                url: '/admin/articles',
                icon: Newspaper,
            },
        ],
    },
    {
        title: 'Pengaturan Situs',
        items: [
            {
                title: 'Konten Situs Web',
                url: '/admin/content',
                icon: FileText,
            },
            {
                title: 'Pengaturan Situs Web',
                url: '/admin/settings',
                icon: Settings,
            },
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
