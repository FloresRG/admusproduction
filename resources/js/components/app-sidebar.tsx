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
    const items: NavItem[] = [{ title: 'Dashboard', href: '/dashboard', icon: LayoutGrid }];

    // Solo admin ve Usuarios, Roles, Companies y Categories
    if (isAdmin) {
        items.push(
            { title: 'Usuarios', href: '/users', icon: LayoutGrid },
            { title: 'Roles', href: '/roles', icon: LayoutGrid },
            { title: 'Companies', href: '/companies', icon: LayoutGrid },
            { title: 'Categories', href: '/categories', icon: LayoutGrid },
            { title: 'Influencers Datos', href: '/infuencersdatos', icon: LayoutGrid },
              { title: 'Semanas', href: '/weeks', icon: LayoutGrid },
        );
    }

    // Admin e influencer ven la sección de Influencers
    if (isAdmin || isInfluencer) {
        items.push({ title: 'Influencers', href: '/influencers', icon: LayoutGrid });
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
