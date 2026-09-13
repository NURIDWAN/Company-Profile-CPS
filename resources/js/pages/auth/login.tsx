import { Head, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, LoaderCircle, LockKeyhole } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SharedData } from '@/types';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { props } = usePage<SharedData>();
    const siteName = props.siteSettings?.site_name ?? 'PT. Citra Protecta Semesta';
    const logoUrl = props.siteSettings?.logo_url;
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (event) => {
        event.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="bg-ink flex min-h-svh items-center justify-center overflow-hidden px-6 py-12 text-[#F5F7FA]">
            <Head title="Admin Login" />
            <div className="relative w-full max-w-md">
                <div className="grid-bg pointer-events-none absolute -inset-20 opacity-20" />
                <div className="bg-night relative overflow-hidden border border-white/10 shadow-2xl shadow-black/30">
                    <div className="border-cyan/50 border-b-2 px-8 py-7 sm:px-10">
                        <div className="flex items-center gap-4">
                            <div className="border-cyan bg-cyan text-ink-foreground flex h-12 w-12 items-center justify-center overflow-hidden border text-lg font-bold tracking-[-.08em]">
                                {logoUrl ? (
                                    <img src={logoUrl} alt={siteName} width="48" height="48" className="h-full w-full object-contain" />
                                ) : (
                                    'CPS'
                                )}
                            </div>
                            <div>
                                <p className="text-cyan font-mono text-[10px] tracking-[.2em] uppercase">Secure access</p>
                                <p className="mt-1 text-sm font-semibold tracking-[.12em] text-white uppercase">{siteName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-8 sm:px-10">
                        <div className="mb-8">
                            <div className="text-cyan mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[.18em] uppercase">
                                <LockKeyhole className="h-3.5 w-3.5" /> Admin portal
                            </div>
                            <h1 className="text-3xl font-semibold tracking-[-.04em] text-white">Welcome back.</h1>
                            <p className="text-soft mt-3 text-sm leading-6">
                                Sign in to manage your company profile, CRM messages, and website content.
                            </p>
                        </div>

                        {status && <div className="mb-5 border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm text-green-300">{status}</div>}

                        <form className="space-y-5" onSubmit={submit}>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-soft text-xs tracking-[.12em] uppercase">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(event) => setData('email', event.target.value)}
                                    placeholder="admin@company.com"
                                    disabled={processing}
                                    className="bg-ink focus-visible:border-cyan focus-visible:ring-cyan/30 h-12 rounded-none border-white/15 text-white placeholder:text-white/30"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-soft text-xs tracking-[.12em] uppercase">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="text-cyan text-xs hover:text-white">
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                    placeholder="Enter your password"
                                    disabled={processing}
                                    className="bg-ink focus-visible:border-cyan focus-visible:ring-cyan/30 h-12 rounded-none border-white/15 text-white placeholder:text-white/30"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked === true)}
                                    disabled={processing}
                                    className="data-[state=checked]:border-cyan data-[state=checked]:bg-cyan data-[state=checked]:text-ink-foreground border-white/30"
                                />
                                <Label htmlFor="remember" className="text-soft text-sm">
                                    Keep me signed in
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-cyan text-ink-foreground mt-3 h-12 w-full rounded-none font-bold tracking-[.14em] uppercase hover:bg-white"
                            >
                                {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                                {processing ? 'Signing in...' : 'Sign in to admin'}
                            </Button>
                        </form>

                        <div className="text-dim mt-8 border-t border-white/10 pt-5 text-center text-xs">
                            Need public website access?{' '}
                            <TextLink href={route('home')} className="text-cyan hover:text-white">
                                Visit {siteName}
                            </TextLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
