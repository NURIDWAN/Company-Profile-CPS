import type { SiteSetting } from '@/types';
import { useState } from 'react';

function WhatsAppIcon({ className = 'h-6 w-6' }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
            <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.48 0 .13 5.35.13 11.92c0 2.1.55 4.15 1.6 5.96L.03 24l6.25-1.64a11.9 11.9 0 0 0 5.77 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.46-8.43Zm-8.47 18.3h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.23-.37a9.89 9.89 0 1 1 8.36 4.61Zm5.42-7.41c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 6 12 12M18 6 6 18" />
        </svg>
    );
}

function MessageIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.6 9.6 0 0 1-4-.9L3 21l1.9-4.2A8.4 8.4 0 1 1 21 11.5Z" />
            <path d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
    );
}

function whatsappUrl(settings: SiteSetting): string | null {
    const number = settings.whatsapp_number?.replace(/\D/g, '');
    if (!number) return null;

    const message = settings.whatsapp_message?.trim();
    return `https://wa.me/${number}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

export function WhatsappPopup({ settings }: { settings?: SiteSetting | null }) {
    const [open, setOpen] = useState(false);
    const url = settings ? whatsappUrl(settings) : null;

    if (!url) return null;

    return (
        <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3 sm:right-8 sm:bottom-8">
            {open && (
                <div className="border-public-border bg-public-panel text-public-foreground w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border shadow-2xl shadow-black/30 dark:border-white/10 dark:bg-[#111c1b] dark:text-white">
                    <div className="flex items-center justify-between bg-[#128c7e] px-4 py-3">
                        <div className="flex items-center gap-3">
                            <WhatsAppIcon className="h-5 w-5" />
                            <div>
                                <p className="text-sm font-semibold">Hubungi kami</p>
                                <p className="text-xs text-white/75">Kami biasanya membalas dengan cepat</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-full p-1 text-white/80 hover:bg-white/15 hover:text-white"
                            aria-label="Tutup jendela WhatsApp"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="p-4">
                        <p className="text-public-foreground/75 text-sm leading-6 dark:text-white/75">
                            Punya pertanyaan tentang layanan rekayasa kami? Kirim pesan melalui WhatsApp.
                        </p>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 flex h-11 items-center justify-center gap-2 rounded-lg bg-[#25d366] px-4 text-sm font-semibold text-[#062e25] transition hover:bg-[#4be27f]"
                        >
                            <MessageIcon />
                            Mulai chat WhatsApp
                        </a>
                    </div>
                </div>
            )}
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-[#062e25] shadow-lg shadow-black/25 transition hover:scale-105 hover:bg-[#4be27f]"
                aria-label={open ? 'Tutup jendela WhatsApp' : 'Buka jendela WhatsApp'}
                aria-expanded={open}
            >
                {open ? <CloseIcon /> : <WhatsAppIcon className="h-7 w-7" />}
            </button>
        </div>
    );
}
