import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, Image, Trash2, Upload, X } from 'lucide-react';
import * as React from 'react';
import { useDropzone, type Accept, type FileRejection } from 'react-dropzone';

// ================================
// FILE PREVIEW
// ================================

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
}

function FilePreview({ file, onRemove }: FilePreviewProps) {
    const isImage = file.type.startsWith('image/');
    const [preview, setPreview] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isImage) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file, isImage]);

    return (
        <div className="group relative flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
            {isImage && preview ? (
                <img
                    src={preview}
                    alt={file.name}
                    className="h-12 w-12 rounded object-cover"
                />
            ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
            )}
            <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

// ================================
// FILE UPLOAD
// ================================

interface FileUploadProps {
    value?: File[];
    onChange?: (files: File[]) => void;
    onError?: (errors: string[]) => void;
    accept?: Accept;
    maxFiles?: number;
    maxSize?: number; // in bytes
    multiple?: boolean;
    disabled?: boolean;
    className?: string;
    label?: string;
    description?: string;
}

function FileUpload({
    value = [],
    onChange,
    onError,
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles = 5,
    maxSize = 5 * 1024 * 1024, // 5MB
    multiple = true,
    disabled = false,
    className,
    label = 'Upload files',
    description = 'Drag & drop files here, or click to select',
}: FileUploadProps) {
    const onDrop = React.useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (rejectedFiles.length > 0) {
                const errors = rejectedFiles.map((rejection) => {
                    const errorMessages = rejection.errors.map((e) => e.message).join(', ');
                    return `${rejection.file.name}: ${errorMessages}`;
                });
                onError?.(errors);
            }

            if (acceptedFiles.length > 0) {
                const newFiles = multiple
                    ? [...value, ...acceptedFiles].slice(0, maxFiles)
                    : acceptedFiles.slice(0, 1);
                onChange?.(newFiles);
            }
        },
        [value, onChange, onError, multiple, maxFiles],
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        maxFiles: multiple ? maxFiles - value.length : 1,
        maxSize,
        multiple,
        disabled: disabled || value.length >= maxFiles,
    });

    const removeFile = (index: number) => {
        const newFiles = value.filter((_, i) => i !== index);
        onChange?.(newFiles);
    };

    const isImagesOnly = accept['image/*'] !== undefined;

    return (
        <div className={cn('space-y-4', className)}>
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={cn(
                    'relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                    isDragActive && 'border-primary bg-primary/5',
                    isDragReject && 'border-destructive bg-destructive/5',
                    disabled && 'cursor-not-allowed opacity-50',
                    value.length >= maxFiles && 'cursor-not-allowed opacity-50',
                    !isDragActive && !isDragReject && 'hover:border-primary/50',
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    {isImagesOnly ? (
                        <Image className="h-10 w-10 text-muted-foreground" />
                    ) : (
                        <Upload className="h-10 w-10 text-muted-foreground" />
                    )}
                    <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Max {maxFiles} files, up to {(maxSize / 1024 / 1024).toFixed(0)}MB each
                    </p>
                </div>
            </div>

            {/* File previews */}
            {value.length > 0 && (
                <div className="space-y-2">
                    {value.map((file, index) => (
                        <FilePreview
                            key={`${file.name}-${index}`}
                            file={file}
                            onRemove={() => removeFile(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ================================
// IMAGE UPLOAD WITH PREVIEW
// ================================

interface ImageUploadProps {
    value?: string;
    onChange?: (url: string | null) => void;
    onFileChange?: (file: File | null) => void;
    disabled?: boolean;
    className?: string;
    aspectRatio?: 'square' | 'video' | 'banner';
}

function ImageUpload({
    value,
    onChange,
    onFileChange,
    disabled = false,
    className,
    aspectRatio = 'video',
}: ImageUploadProps) {
    const [preview, setPreview] = React.useState<string | null>(value || null);

    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) {
                const url = URL.createObjectURL(file);
                setPreview(url);
                onChange?.(url);
                onFileChange?.(file);
            }
        },
        [onChange, onFileChange],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024,
        disabled,
    });

    const removeImage = () => {
        if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
        }
        setPreview(null);
        onChange?.(null);
        onFileChange?.(null);
    };

    React.useEffect(() => {
        if (value && value !== preview) {
            setPreview(value);
        }
    }, [value]);

    const aspectClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        banner: 'aspect-[3/1]',
    };

    return (
        <div className={cn('relative', className)}>
            {preview ? (
                <div className={cn('relative overflow-hidden rounded-lg', aspectClasses[aspectRatio])}>
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={removeImage}
                        className="absolute right-2 top-2 h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={cn(
                        'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                        aspectClasses[aspectRatio],
                        isDragActive && 'border-primary bg-primary/5',
                        disabled && 'cursor-not-allowed opacity-50',
                        !isDragActive && 'hover:border-primary/50',
                    )}
                >
                    <input {...getInputProps()} />
                    <Image className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium">Upload Image</p>
                    <p className="text-xs text-muted-foreground">
                        Drag & drop or click to select
                    </p>
                </div>
            )}
        </div>
    );
}

export { FileUpload, ImageUpload };
