// resources/js/Layouts/AppSidebar.tsx

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import { useEffect } from 'react';
import AppLogo from './app-logo';
// Importa los iconos al inicio del archivo
// Importa los iconos al inicio del archivo
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // para roles
import ApartmentIcon from '@mui/icons-material/Apartment'; // para empresas
import AssignmentIcon from '@mui/icons-material/Assignment'; // para tareas asignadas
import BusinessIcon from '@mui/icons-material/Business';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek'; // para semanas
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FormatIndentIncreaseIcon from '@mui/icons-material/Dashboard';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'; // para influencers
import EventNoteIcon from '@mui/icons-material/EventNote'; // para ver calendario
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/Groups'; // mejor para representar usuarios en grupo

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
    const roles = rawRoles.map((r) => r.name);

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
            { title: 'Roles', href: '/roles', icon: AdminPanelSettingsIcon },
            { title: 'Empresas', href: '/companies', icon: ApartmentIcon },
            { title: 'Categorías', href: '/categories', icon: CategoryIcon },
            { title: 'Datos de Influencers', href: '/infuencersdatos', icon: EmojiPeopleIcon },
            { title: 'Semanas', href: '/weeks', icon: CalendarViewWeekIcon },
            { title: 'Ver Calendario', href: '/bookings', icon: EventNoteIcon },
            { title: 'Tareas Asignadas', href: '/asignaciones/fechas', icon: AssignmentIcon },
            { title: 'Companies', href: '/companies', icon: BusinessIcon },
            { title: 'Personal', href: '/tipos', icon: FormatIndentIncreaseIcon },
            { title: 'Pasante', href: '/pasante', icon: FormatIndentIncreaseIcon },
            { title: 'ver tareas', href: '/vertareas', icon: DateRangeIcon },
            { title: 'tareas', href: '/tareas', icon: DateRangeIcon },
            { title: 'Mis tareas', href: '/mis-asignaciones/fechas', icon: DateRangeIcon },
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
            title: 'ver tareas',
            href: '/vertareas',
            icon: LayoutGrid,
        },
        {
            title: 'tareas',
            href: '/tareas',
            icon: LayoutGrid,
        },
        {
            title: 'Influencers Datos',
            href: '/infuencersdatos',
            icon: LayoutGrid,
        },
    ];
    if (isInfluencer) {
        items.push({ title: 'Ver Calendario', href: '/bookings', icon: EventNoteIcon });
    }

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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
