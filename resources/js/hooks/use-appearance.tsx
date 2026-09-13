import { useCallback, useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

export type ResolvedAppearance = 'light' | 'dark';

const APPEARANCE_KEY = 'appearance';

const prefersDark = () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

const applyTheme = (appearance: Appearance): ResolvedAppearance => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark);
    }

    return isDark ? 'dark' : 'light';
};

const readStoredAppearance = (): Appearance => {
    if (typeof window === 'undefined') return 'light';

    const stored = localStorage.getItem(APPEARANCE_KEY);

    return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'light';
};

const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;

const handleSystemThemeChange = () => {
    applyTheme(readStoredAppearance());
};

export function initializeTheme() {
    applyTheme(readStoredAppearance());

    // Add the event listener for system theme changes...
    mediaQuery?.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');
    const [resolvedAppearance, setResolvedAppearance] = useState<ResolvedAppearance>('light');

    const updateAppearance = useCallback((mode: Appearance) => {
        setAppearance(mode);
        setResolvedAppearance(applyTheme(mode));

        if (typeof window !== 'undefined') {
            localStorage.setItem(APPEARANCE_KEY, mode);
        }
    }, []);

    useEffect(() => {
        const stored = readStoredAppearance();
        setAppearance(stored);
        setResolvedAppearance(applyTheme(stored));

        return () => mediaQuery?.removeEventListener('change', handleSystemThemeChange);
    }, []);

    return { appearance, resolvedAppearance, updateAppearance };
}
