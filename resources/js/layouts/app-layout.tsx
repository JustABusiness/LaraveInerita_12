import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage<SharedData>().props;
    useEffect(() => {
        if (flash?.success) {
            toast.success('Thông báo từ hệ thống', {
                description: flash.success,
            });
        }

        if (flash?.error) {
            toast.error('Thông báo từ hệ thống', {
                description: flash.error,
            });
        }

        if (flash?.info) {
            toast.info('Thông báo từ hệ thống', {
                description: flash.info,
            });
        }

        if (flash?.warming) {
            toast.warning(' thông báo từ hệ thống', {
                description: flash.warming,
            });
        }
    }, [flash]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster richColors position="top-right" />
        </AppLayoutTemplate>
    );
};
