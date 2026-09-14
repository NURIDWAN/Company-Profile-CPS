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
    [key: string]: string | boolean;
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
        <div className="bg-background text-foreground flex min-h-svh items-center justify-center overflow-hidden px-6 py-12">
            <Head title="Masuk Admin" />
            <div className="relative w-full max-w-md">
                <div className="grid-bg pointer-events-none absolute -inset-20 opacity-20" />
                <div className="bg-card border-border dark:bg-night relative overflow-hidden border shadow-2xl shadow-black/10 dark:border-white/10 dark:shadow-black/30">
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
                                <p className="text-cyan font-mono text-[10px] tracking-[.2em] uppercase">Akses aman</p>
                                <p className="text-foreground mt-1 text-sm font-semibold tracking-[.12em] uppercase dark:text-white">{siteName}</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-8 sm:px-10">
                        <div className="mb-8">
                            <div className="text-cyan mb-4 flex items-center gap-2 font-mono text-[10px] tracking-[.18em] uppercase">
                                <LockKeyhole className="h-3.5 w-3.5" /> Portal admin
                            </div>
                            <h1 className="text-foreground text-3xl font-semibold tracking-[-.04em] dark:text-white">Selamat datang kembali.</h1>
                            <p className="text-muted-foreground mt-3 text-sm leading-6">
                                Masuk untuk mengelola profil perusahaan, pesan CRM, dan konten situs web Anda.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-5 border border-green-600/30 bg-green-100 px-4 py-3 text-sm text-green-800 dark:border-green-400/30 dark:bg-green-400/10 dark:text-green-300">
                                {status}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={submit}>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-muted-foreground text-xs tracking-[.12em] uppercase">
                                    Alamat email
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
                                    className="bg-background text-foreground focus-visible:border-cyan focus-visible:ring-cyan/30 border-border placeholder:text-muted-foreground dark:bg-ink h-12 rounded-none dark:border-white/15 dark:text-white dark:placeholder:text-white/30"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-muted-foreground text-xs tracking-[.12em] uppercase">
                                        Kata sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={route('password.request')}
                                            className="text-cyan hover:text-foreground text-xs dark:hover:text-white"
                                        >
                                            Lupa kata sandi?
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
                                    placeholder="Masukkan kata sandi Anda"
                                    disabled={processing}
                                    className="bg-background text-foreground focus-visible:border-cyan focus-visible:ring-cyan/30 border-border placeholder:text-muted-foreground dark:bg-ink h-12 rounded-none dark:border-white/15 dark:text-white dark:placeholder:text-white/30"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked === true)}
                                    disabled={processing}
                                    className="data-[state=checked]:border-cyan data-[state=checked]:bg-cyan data-[state=checked]:text-ink-foreground border-border dark:border-white/30"
                                />
                                <Label htmlFor="remember" className="text-muted-foreground text-sm">
                                    Ingat saya
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-cyan text-ink-foreground mt-3 h-12 w-full rounded-none font-bold tracking-[.14em] uppercase hover:bg-white"
                            >
                                {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                                {processing ? 'Sedang masuk...' : 'Masuk ke admin'}
                            </Button>
                        </form>

                        <div className="text-muted-foreground border-border mt-8 border-t pt-5 text-center text-xs dark:border-white/10">
                            Ingin mengakses situs publik?{' '}
                            <TextLink href={route('home')} className="text-cyan hover:text-foreground dark:hover:text-white">
                                Kunjungi {siteName}
                            </TextLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
