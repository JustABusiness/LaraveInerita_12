import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, User2, Settings } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'QL Thành Viên',
        href: '/user',
        icon: User2,
        items: [
            {
                title: 'Nhóm Thành Viên',
                url: '/user_catalogue ',
            },
            {
                title: 'Quyền',
                url: '/permission',
            },
            {
                title: 'Thành Viên',
                url: '/user',
            },
        ],
    },
    {
        title: 'QL Cấu hình chung',
        href: '#',
        icon: Settings,
        items: [
            {
                title: 'QL Ngôn ngữ',
                url: '/language',
            },
        ],
    },
    {
        title: 'QL Bài Viết',
        href: '#',
        icon: BookOpen,
        items: [
            {
                title: 'Nhóm Bài Viết',
                url: '/post_catalogue',
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Tài liệu IELTS',
        href: '/ielts/documents',
        icon: BookOpen,
    },
    {
        title: 'Đề thi mẫu (Mock)',
        href: '/ielts/mock-tests',
        icon: Folder,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
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
