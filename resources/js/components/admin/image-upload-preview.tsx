import { useEffect, useState } from 'react';

export function ImageUploadPreview({
    file,
    currentUrl,
    alt,
    className = 'h-32 w-full rounded-md object-cover',
}: {
    file: File | null;
    currentUrl?: string | null;
    alt: string;
    className?: string;
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl ?? null);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(currentUrl ?? null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file, currentUrl]);

    if (!previewUrl) return null;
    return <img src={previewUrl} alt={alt} className={className} />;
}
