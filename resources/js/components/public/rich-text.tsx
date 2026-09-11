import { useMemo } from 'react';

function escapeHtml(value: string): string {
    return value.replace(
        /[&<>'"]/g,
        (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[character] ?? character,
    );
}

export function richTextHtml(value: string | null | undefined): string {
    if (!value) return '';
    if (/<(p|br|strong|b|em|i|u|ul|ol|li|a)(\s|>)/i.test(value)) return value;
    return value
        .split(/\r?\n\r?\n/)
        .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\r?\n/g, '<br />')}</p>`)
        .join('');
}

export function RichText({ value, className = '' }: { value: string | null | undefined; className?: string }) {
    const html = useMemo(() => richTextHtml(value), [value]);
    if (!html) return null;

    return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
