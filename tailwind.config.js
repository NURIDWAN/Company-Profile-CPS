/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    theme: {
        extend: {
            colors: {
                neutral: {
                    100: 'var(--neutral-100)',
                    200: 'var(--neutral-200)',
                    300: 'var(--neutral-300)',
                    400: 'var(--neutral-400)',
                },
                'dark-neutral': {
                    100: 'var(--dark-neutral-100)',
                    200: 'var(--dark-neutral-200)',
                    300: 'var(--dark-neutral-300)',
                    400: 'var(--dark-neutral-400)',
                },
                'surface-primary': 'var(--surface-primary)',
                'surface-secondary': 'var(--surface-secondary)',
                'surface-tertiary': 'var(--surface-tertiary)',
                subtle: 'var(--border-subtle)',
                strong: 'var(--border-strong)',
                'content-primary': 'var(--content-primary)',
                'content-secondary': 'var(--content-secondary)',
                'content-muted': 'var(--content-muted)',
                'accent-primary': 'var(--accent-primary)',
                'accent-foreground': 'var(--accent-foreground)',
            },
        },
    },
};
