import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEffect, useRef } from 'react';

interface RichTextEditorProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    rows?: number;
    hint?: string;
}

const toolbar = [
    { command: 'bold', label: 'B', title: 'Bold' },
    { command: 'italic', label: 'I', title: 'Italic' },
    { command: 'underline', label: 'U', title: 'Underline' },
    { command: 'insertUnorderedList', label: '• List', title: 'Bulleted list' },
    { command: 'insertOrderedList', label: '1. List', title: 'Numbered list' },
];

export function RichTextEditor({ id, label, value, onChange, error, rows = 5, hint }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const lastValueRef = useRef(value);

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
        lastValueRef.current = value;
    }, [value]);

    const execute = (command: string) => {
        editorRef.current?.focus();
        document.execCommand(command, false);
        const html = editorRef.current?.innerHTML ?? '';
        lastValueRef.current = html;
        onChange(html);
    };

    const handleInput = () => {
        const html = editorRef.current?.innerHTML ?? '';
        lastValueRef.current = html;
        onChange(html);
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
                            key={item.command}
                            type="button"
                            variant="ghost"
                            size="sm"
                            title={item.title}
                            className="h-8 px-2 text-xs"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => execute(item.command)}
                        >
                            {item.label}
                        </Button>
                    ))}
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
                    className="prose prose-sm dark:prose-invert min-h-32 max-w-none px-3 py-2 text-sm outline-none"
                    style={{ minHeight: `${rows * 1.5}rem` }}
                />
            </div>
            <div className="mt-1 flex justify-between gap-3">
                <p className="text-muted-foreground text-xs">{hint ?? 'Basic formatting is supported.'}</p>
                {error && <p className="text-destructive text-xs">{error}</p>}
            </div>
        </div>
    );
}
