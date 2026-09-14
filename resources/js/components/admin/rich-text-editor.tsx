import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    rows?: number;
    hint?: string;
    uploadUrl?: string;
}

const toolbar: { command: string; label: string; title: string; block?: string }[] = [
    { command: 'bold', label: 'B', title: 'Tebal' },
    { command: 'italic', label: 'I', title: 'Miring' },
    { command: 'underline', label: 'U', title: 'Garis bawah' },
    { command: 'insertUnorderedList', label: '• List', title: 'Daftar berpoin' },
    { command: 'insertOrderedList', label: '1. List', title: 'Daftar bernomor' },
    { command: 'formatBlock', label: 'H2', title: 'Judul 2', block: 'h2' },
    { command: 'formatBlock', label: 'H3', title: 'Judul 3', block: 'h3' },
    { command: 'formatBlock', label: 'Quote', title: 'Kutipan', block: 'blockquote' },
    { command: 'formatBlock', label: '¶', title: 'Paragraf', block: 'p' },
    { command: 'removeFormat', label: 'Bersihkan', title: 'Bersihkan format' },
];

export function RichTextEditor({ id, label, value, onChange, error, rows = 5, hint, uploadUrl }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectionRef = useRef<Range | null>(null);
    const lastValueRef = useRef(value);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
        lastValueRef.current = value;
    }, [value]);

    const execute = (command: string, block?: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false, block);
        const html = editorRef.current?.innerHTML ?? '';
        lastValueRef.current = html;
        onChange(html);
    };

    const handleInput = () => {
        const html = editorRef.current?.innerHTML ?? '';
        lastValueRef.current = html;
        onChange(html);
    };

    const captureSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
            selectionRef.current = selection.getRangeAt(0).cloneRange();
        }
    };

    const handleImageButton = () => {
        captureSelection();
        fileInputRef.current?.click();
    };

    const insertUploadedImage = (url: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.focus();
        const selection = window.getSelection();
        const range = selectionRef.current && editor.contains(selectionRef.current.startContainer) ? selectionRef.current : document.createRange();

        if (!selectionRef.current || !editor.contains(selectionRef.current.startContainer)) {
            range.selectNodeContents(editor);
            range.collapse(false);
        }

        range.deleteContents();
        const image = document.createElement('img');
        image.src = url;
        image.alt = 'Gambar artikel';
        image.className = 'my-3 h-auto max-w-full rounded-md';
        range.insertNode(image);

        range.setStartAfter(image);
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
        selectionRef.current = range.cloneRange();

        const html = editor.innerHTML;
        lastValueRef.current = html;
        onChange(html);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file || !uploadUrl) return;

        setUploading(true);
        setUploadError(null);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('_token', document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '');

        fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
            .then(async (response) => {
                const payload = (await response.json().catch(() => null)) as {
                    url?: string;
                    message?: string;
                    errors?: Record<string, string[]>;
                } | null;
                if (!response.ok) {
                    throw new Error(payload?.errors?.image?.[0] ?? payload?.message ?? `Upload gagal (${response.status})`);
                }
                if (!payload) {
                    throw new Error('Respons upload tidak valid.');
                }
                return payload;
            })
            .then((payload: { url?: string }) => {
                if (!payload.url) throw new Error('Respons upload tidak berisi URL gambar.');
                insertUploadedImage(payload.url);
            })
            .catch((error: unknown) => {
                setUploadError(error instanceof Error ? error.message : 'Gagal mengunggah gambar. Silakan coba lagi.');
            })
            .finally(() => setUploading(false));
    };

    return (
        <div>
            <Label htmlFor={id} className="mb-2 block">
                {label}
            </Label>
            <div className="border-input bg-background focus-within:ring-ring overflow-hidden rounded-md border focus-within:ring-2">
                <div className="bg-muted/40 flex flex-wrap gap-1 border-b p-1.5">
                    {toolbar.map((item) => (
                        <Button
                            key={item.label}
                            type="button"
                            variant="ghost"
                            size="sm"
                            title={item.title}
                            className="h-8 px-2 text-xs"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => execute(item.command, item.block)}
                        >
                            {item.label}
                        </Button>
                    ))}
                    {uploadUrl && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            title="Sisipkan gambar"
                            disabled={uploading}
                            className="h-8 px-2 text-xs"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={handleImageButton}
                        >
                            {uploading ? 'Mengunggah…' : 'Gambar'}
                        </Button>
                    )}
                </div>
                <div
                    id={id}
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    role="textbox"
                    aria-multiline="true"
                    aria-invalid={Boolean(error)}
                    onInput={handleInput}
                    className="prose prose-sm dark:prose-invert max-h-[min(50vh,32rem)] min-h-32 max-w-none overflow-y-auto overscroll-contain px-3 py-2 text-sm outline-none [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md"
                    style={{ minHeight: `${rows * 1.5}rem` }}
                />
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
            </div>
            <div className="mt-1 flex justify-between gap-3">
                <p className="text-muted-foreground text-xs">{hint ?? 'Format dasar didukung.'}</p>
                {(error || uploadError) && <p className="text-destructive text-xs">{error ?? uploadError}</p>}
            </div>
        </div>
    );
}
