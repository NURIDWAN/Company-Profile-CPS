import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Briefcase, FileText, Folder, Image, LayoutGrid, Mail, Newspaper, Package, Settings, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'CRM Messages',
        url: '/admin/crm',
        icon: Mail,
    },
    {
        title: 'Manage Users',
        url: '/admin/users',
        icon: Users,
    },
    {
        title: 'Divisions',
        url: '/admin/divisions',
        icon: Folder,
    },
    {
        title: 'Categories & Products',
        url: '/admin/categories',
        icon: Package,
    },
    {
        title: 'Project References',
        url: '/admin/projects',
        icon: Briefcase,
    },
    {
        title: 'Gallery',
        url: '/admin/gallery',
        icon: Image,
    },
    {
        title: 'Articles',
        url: '/admin/articles',
        icon: Newspaper,
    },
    {
        title: 'Website Content',
        url: '/admin/content',
        icon: FileText,
    },
    {
        title: 'Website Settings',
        url: '/admin/settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
