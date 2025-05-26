// resources/js/Layouts/AppSidebar.tsx

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import { useEffect } from 'react';
import AppLogo from './app-logo';
// Importa los iconos al inicio del archivo
// Importa los iconos al inicio del archivo
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import BusinessIcon from '@mui/icons-material/Business';
import CategoryIcon from '@mui/icons-material/Category';
import InsightsIcon from '@mui/icons-material/Insights';
import DateRangeIcon from '@mui/icons-material/DateRange';

type PageProps = {
    auth: {
        user: {
            roles: string[];
        } | null;
    };
};

export function AppSidebar() {
    const { auth } = usePage<PageProps>().props;
    // rawRoles es [{id,name,…},…]
    const rawRoles = auth?.user?.roles || [];
    // ahora sí: ['admin', 'influencer', …]
    const roles = rawRoles.map(r => r.name);

    // DEBUG: imprime roles en consola
    useEffect(() => {
        console.log('🔍 auth.user.roles =', roles);
    }, [roles]);

    const isAdmin = roles.includes('admin');
    const isInfluencer = roles.includes('influencer');

    // Siempre disponible
    const items: NavItem[] = [{ title: 'Dashboard', href: '/dashboard', icon: DashboardIcon }];

    // Solo admin ve Usuarios, Roles, Companies y Categories
    if (isAdmin) {
        items.push(
            { title: 'Usuarios', href: '/users', icon: PeopleIcon },
            { title: 'Roles', href: '/roles', icon: SecurityIcon },
            { title: 'Companies', href: '/companies', icon: BusinessIcon },
            { title: 'Categories', href: '/categories', icon: CategoryIcon },
            { title: 'Influencers Datos', href: '/infuencersdatos', icon: InsightsIcon },
            { title: 'Semanas', href: '/weeks', icon: DateRangeIcon },
            { title: 'ver calendario', href: '/bookings', icon: DateRangeIcon },
            { title: 'tareas', href: '/tareas', icon: DateRangeIcon },
            { title: 'ver tareas', href: '/vertareas', icon: DateRangeIcon },
        );
    }

    // Admin e influencer ven la sección de Influencers
    if (isAdmin || isInfluencer) {
        items.push({ title: 'Influencers', href: '/influencers', icon: GroupIcon });
    }
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Usuarios',
            href: '/users',
            icon: LayoutGrid,
        },
        {
            title: 'Roles',
            href: '/roles',
            icon: LayoutGrid,
        },
        {
            title: 'Influencers',
            href: '/influencers',
            icon: LayoutGrid,
        },
        {
            title: 'company',
            href: '/companies',
            icon: LayoutGrid,
        },
        {
            title: 'categories',
            href: '/categories',
            icon: LayoutGrid,
        },
        {
            title: 'tareas',
            href: '/tareas',
            icon: LayoutGrid,
        },
         {
            title: 'ver tareas',
            href: '/vertareas',
            icon: LayoutGrid,
        },
        {
            title: 'Influencers Datos',
            href: '/infuencersdatos',
            icon: LayoutGrid,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

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
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
