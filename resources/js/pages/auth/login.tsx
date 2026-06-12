import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Head } from '@inertiajs/react';
import { AtSign, KeyRound } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

import api from '@/lib/api';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            // Attempt login (posting to standard Fortify route)
            // Axios will automatically handle the CSRF token if configured correctly
            await api.post('/login', formData, { baseURL: '' });

            // If success, redirect to dashboard
            router.visit('/dashboard');
        } catch (error: any) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const formattedErrors: Record<string, string> = {};
                Object.keys(validationErrors).forEach((key) => {
                    formattedErrors[key] = validationErrors[key][0];
                });
                setErrors(formattedErrors);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout
            title="Log in"
            description="Welcome back! Please enter your details."
        >
            <Head title="Log in" />

            <form onSubmit={handleSubmit} className="space-y-6">
                <>
                    <div className="space-y-5">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="email"
                                className="font-medium text-zinc-300"
                            >
                                Email Address
                            </Label>
                            <div className="group relative">
                                <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 blur transition-opacity group-focus-within:opacity-100" />
                                <div className="relative">
                                    <AtSign className="absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="h-12 border-white/10 bg-white/[0.03] pl-11 text-white placeholder:text-zinc-600 focus-visible:ring-primary/30"
                                    />
                                </div>
                            </div>
                            <InputError
                                message={errors.email}
                                className="mt-1 text-xs text-pink-500/90"
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    title="Password"
                                    className="font-medium text-zinc-300"
                                >
                                    Password
                                </Label>
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="text-xs font-semibold text-primary hover:text-primary/80"
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>
                            <div className="group relative">
                                <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 blur transition-opacity group-focus-within:opacity-100" />
                                <div className="relative">
                                    <KeyRound className="absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-primary" />
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="h-12 border-white/10 bg-white/[0.03] pl-11 text-white placeholder:text-zinc-600 focus-visible:ring-primary/30"
                                    />
                                </div>
                            </div>
                            <InputError
                                message={errors.password}
                                className="mt-1 text-xs text-pink-500/90"
                            />
                        </div>

                        <div className="flex items-center space-x-2 py-1">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={formData.remember}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        remember: !!checked,
                                    }))
                                }
                                tabIndex={3}
                                className="border-white/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                            />
                            <Label
                                htmlFor="remember"
                                className="cursor-pointer text-sm font-medium text-zinc-400 transition-colors select-none hover:text-zinc-300"
                            >
                                Keep me logged in
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="h-12 w-full border-none bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white shadow-xl shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing ? (
                                <Spinner className="mr-2 text-white" />
                            ) : null}
                            Sign In
                        </Button>
                    </div>

                    {canRegister && (
                        <div className="pt-2 text-center text-sm text-zinc-500">
                            Don't have an account?{' '}
                            <TextLink
                                href={register()}
                                tabIndex={5}
                                className="font-bold text-white transition-colors hover:text-primary"
                            >
                                Join for free
                            </TextLink>
                        </div>
                    )}
                </>
            </form>

            {status && (
                <div className="mt-6 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-xs font-bold text-emerald-400">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
