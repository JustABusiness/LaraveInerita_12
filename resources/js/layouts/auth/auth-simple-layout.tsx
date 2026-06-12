import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-zinc-950 p-6 md:p-10">
            {/* Fabulous Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] animate-[spin_20s_linear_infinite] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-[120px]" />
                <div className="absolute right-[-10%] bottom-[-10%] h-[60%] w-[60%] animate-[spin_15s_linear_infinite_reverse] rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-emerald-500/20 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/10 blur-[100px]" />
            </div>

            {/* Grain Texture Overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />

            <div className="relative z-10 w-full max-w-md">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="group relative flex flex-col items-center gap-3 transition-all hover:scale-105"
                        >
                            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white/10 p-0.5 shadow-2xl ring-1 ring-white/20 backdrop-blur-xl transition-all group-hover:ring-white/40">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-purple-500/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                <AppLogoIcon className="relative z-10 size-10 fill-white drop-shadow-sm" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1.5 text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-white">
                                {title}
                            </h1>
                            <p className="text-sm font-medium text-balance text-zinc-400">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-2xl md:p-10">
                        {/* Inner glow effect */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent" />

                        <div className="relative z-10">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
