import { InertiaLinkProps } from '@inertiajs/react';
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
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavSubItem[];
}

export interface NavSubItem {
    title: string;
    url: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
    flash?: {
        success?: string;
        error?: string;
        info?: string;
        warming?: string;
    };
}

export interface User extends IDateTime {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    [key: string]: unknown; // This allows for additional properties...
}

export interface IDateTime {
    created_at: string;
    updated_at: string;
}

export interface PageConfig {
    module: string;
    heading: string;
    cardHeading?: string;
    cardDescription?: string;
}
