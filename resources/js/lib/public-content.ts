import type { PageMedia, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function usePublicContent(pageKey: string) {
    const { props } = usePage<SharedData>();
    const contentMap = props.publicContent ?? {};
    const mediaMap = props.publicMedia ?? {};

    const content = (key: string, fallback: string): string => contentMap[`${pageKey}.${key}`] || fallback;
    const media = (key: string): PageMedia | null => mediaMap[`${pageKey}.${key}`] ?? null;

    return { content, media };
}
