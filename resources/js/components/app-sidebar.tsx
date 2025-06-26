'use client';

// resources/js/Layouts/AppSidebar.tsx

// 1. Imports de React e Inertia.js
import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

// 2. Componentes de UI del Sidebar
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

// 3. Componentes personalizados
import { NavUser } from '@/components/nav-user';
import AppLogo from './app-logo';

// 4. Tipos
import type { NavItem } from '@/types';

// 5. Iconos
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CategoryIcon from '@mui/icons-material/Category';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/Groups';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PersonIcon from '@mui/icons-material/Person';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import RateReviewIcon from '@mui/icons-material/RateReview';
import WorkIcon from '@mui/icons-material/Work';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // Para "Pagos del ANUALES"
import LinkIcon from '@mui/icons-material/Link'; // Para "+ Link de Compañias"
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // Para "Pagos del MES"
import StoreIcon from '@mui/icons-material/Store'; // Para "Companies"

import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Para "Semana Influencer"
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'; // Para "Personal"
import TableChartIcon from '@mui/icons-material/TableChart'; // Para "Semana"

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // Para "Asignar Tareas"
import PermIdentityIcon from '@mui/icons-material/PermIdentity'; // Para "Mi perfil"
import TodayIcon from '@mui/icons-material/Today';

// 6. Props que trae Inertia
type PageProps = {
    auth: {
        user: {
            roles: Array<{ id: number; name: string }>;
        } | null;
    };
};

// 7. Definición de una sección de menú
type MenuSection = {
    title: string;
    icon: React.ComponentType<any>;
    items: NavItem[];
    isCollapsible?: boolean;
};

// 8. NavMain: mantiene sección activa abierta y aplica degradado azul-celeste con texto negro
function NavMain({ sections, currentPath }: { sections: MenuSection[]; currentPath: string }) {
    const activeSectionKey =
        sections
            .find((sec) => sec.items.some((item) => item.href === currentPath))
            ?.title.toLowerCase()
            .replace(/\s+/g, '') ?? '';

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        [activeSectionKey]: true,
    });

    useEffect(() => {
        setExpandedSections({ [activeSectionKey]: true });
    }, [activeSectionKey]);

    const toggleSection = (key: string) => {
        setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            {sections.map((section) => {
                const key = section.title.toLowerCase().replace(/\s+/g, '');
                const isExpanded = !!expandedSections[key];
                const isActiveSection = key === activeSectionKey;

                return (
                    <SidebarGroup key={key}>
                        <SidebarGroupLabel
                            onClick={section.isCollapsible ? () => toggleSection(key) : undefined}
                            className={
                                `flex cursor-pointer items-center justify-between rounded-md px-3 py-2 transition-colors duration-200 ` +
                                `${section.isCollapsible ? 'hover:bg-blue-100' : ''} ` +
                                `${isActiveSection ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-black' : 'bg-transparent text-black'}`
                            }
                        >
                            <div className="flex items-center gap-2">
                                <section.icon className="h-5 w-5 text-black" />
                                <span className="font-medium">{section.title}</span>
                            </div>
                            {section.isCollapsible &&
                                (isExpanded ? <ExpandLessIcon className="h-5 w-5 text-black" /> : <ExpandMoreIcon className="h-5 w-5 text-black" />)}
                        </SidebarGroupLabel>

                        {(!section.isCollapsible || isExpanded) && (
                            <SidebarGroupContent className="transition-all duration-200">
                                <SidebarMenu>
                                    {section.items.map((item) => {
                                        const isActiveItem = item.href === currentPath;
                                        return (
                                            <SidebarMenuItem key={item.href}>
                                                <SidebarMenuButton asChild>
                                                    <Link
                                                        href={item.href}
                                                        prefetch
                                                        className={
                                                            `flex items-center gap-2 rounded-md px-4 py-2 transition-colors duration-150 ` +
                                                            `${isActiveItem ? 'bg-gradient-to-r from-blue-200 to-cyan-200 text-black' : 'text-black hover:bg-blue-50'}`
                                                        }
                                                    >
                                                        <item.icon className="h-4 w-4 text-black" />
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        )}
                    </SidebarGroup>
                );
            })}
        </>
    );
}

// 9. Componente principal AppSidebar
export function AppSidebar() {
    const page = usePage<PageProps>();
    const { auth } = page.props;
    const currentPath = page.url;

    const roles = auth?.user?.roles.map((r) => r.name) || [];
    const isAdmin = roles.includes('admin');
    const isInfluencer = roles.includes('influencer');
    const isPasante = roles.includes('pasante');
    const isEmpresa = roles.includes('empresa');

    useEffect(() => {
        console.log('🔍 auth.user.roles =', roles);
    }, [roles]);

    // Construir secciones sin Dashboard
    const menuSections: MenuSection[] = [];

    if (isAdmin) {
        menuSections.push(
            {
                title: 'Gestion de Personal',
                icon: PeopleIcon,
                items: [
                    { title: 'Usuarios', href: '/users', icon: PersonIcon },
                    { title: 'Roles', href: '/roles', icon: AdminPanelSettingsIcon },
                    { title: 'Gestion de tipos', href: '/tipos', icon: SettingsSuggestIcon }, // CAMBIADO
                ],
                isCollapsible: true,
            },
            {
                title: 'Gestion de Empresas',
                icon: BusinessIcon,
                items: [
                    { title: 'Empresas', href: '/companies', icon: StoreIcon }, // CAMBIADO
                    { title: 'Categorias', href: '/categories', icon: CategoryIcon },
                    { title: 'Link de Empresas', href: '/company-links', icon: LinkIcon }, // CAMBIADO
                    { title: 'Pagos del MES', href: '/pagos-del-mes', icon: MonetizationOnIcon }, // CAMBIADO
                    { title: 'Pagos del ANUALES', href: '/reportes/pagos-por-anio', icon: CalendarMonthIcon },
                    { title: 'Videos Empresas', href: '/videos', icon: BusinessIcon },
                    { title: 'Videos MES Empresas', href: '/videosmes', icon: BusinessIcon },
                ],
                isCollapsible: true,
            },
            {
                title: 'Gestion de Influencers',
                icon: EmojiPeopleIcon,
                items: [
                    { title: 'Semana Influencer', href: '/semanainfluencer', icon: AccessTimeIcon },
                    { title: 'Administrar Influencers', href: '/infuencersdatos', icon: EmojiPeopleIcon },
                    { title: 'Influencers', href: '/influencers', icon: GroupIcon },
                    { title: 'Historial de Semanas', href: '/weeks', icon: CalendarViewWeekIcon },
                    { title: 'Ver Calendario', href: '/bookings', icon: EventNoteIcon },
                ],
                isCollapsible: true,
            },
            {
                title: 'Gestion de Pasantes',
                icon: WorkIcon,
                items: [
                    { title: 'Asignar Tareas', href: '/tareas', icon: AssignmentTurnedInIcon },
                    { title: 'Tareas de Hoy', href: '/tareas/hoy', icon: TodayIcon }, // CAMBIADO
                    { title: 'Mis Tareas', href: '/tareas-personales', icon: TodayIcon }, 
                    { title: 'Tareas en revicion', href: '/tareas/revicion', icon: PendingActionsIcon },
                    { title: 'Semana Tareas', href: '/semana', icon: TableChartIcon }, // CAMBIADO
                ],
                isCollapsible: true,
            },
        );
    } else {
        if (isInfluencer) {
            menuSections.push({
                title: 'Influencer',
                icon: EmojiPeopleIcon,
                items: [
                    { title: 'Influencers', href: '/influencers', icon: GroupIcon },
                    { title: 'Ver Calendario', href: '/bookings', icon: EventNoteIcon },
                   // { title: 'Mi perfil', href: '/tiposinfluencers', icon: PermIdentityIcon },
                ],
                isCollapsible: false,
            });
        }
        if (isPasante) {
            menuSections.push({
                title: 'Pasante',
                icon: WorkIcon,
                items: [
                    { title: 'Todas mis tareas', href: '/pasante/mistareas/todos', icon: ListAltIcon },
                    { title: 'Mis Tareas', href: '/tareas-personales', icon: TodayIcon }, 
                    { title: 'Tareas Pendiente', href: '/pasante/mistareas/pendientes', icon: PendingActionsIcon },
                    { title: 'Tareas En Revisión', href: '/pasante/mistareas/enrevicion', icon: RateReviewIcon },
                    { title: 'Tareas Publicadas', href: '/pasante/mistareas/publicadas', icon: PublishedWithChangesIcon },
                ],
                isCollapsible: false,
            });
        }
        if (isEmpresa) {
            menuSections.push({
                title: 'Empresa',
                icon: BusinessIcon,
                items: [
                    { title: 'Videos Empresas', href: '/videos', icon: BusinessIcon },
                    { title: 'Videos MES Empresas', href: '/videosmes', icon: BusinessIcon },
                ],
                isCollapsible: false,
            });
        }
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            {/* Header */}
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

            {/* Contenido */}
            <SidebarContent>
                {/* Panel Principal sin carpeta */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link
                                href="/dashboard"
                                prefetch
                                className={
                                    `flex items-center gap-2 rounded-md px-4 py-2 transition-colors duration-150 ` +
                                    `${currentPath === '/dashboard' ? 'bg-gradient-to-r from-blue-200 to-cyan-200 text-black' : 'text-black hover:bg-blue-50'}`
                                }
                            >
                                <DashboardIcon className="h-5 w-5 text-black" />
                                <span className="font-medium">Panel Principal</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                {/* Otras secciones */}
                <NavMain sections={menuSections} currentPath={currentPath} />
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
