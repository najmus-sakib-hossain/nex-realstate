import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ImageIcon, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    onAltChange?: (value: string) => void;
    alt?: string;
    className?: string;
    previewClassName?: string;
    label?: string;
    placeholder?: string;
}

export function ImageUpload({
    value,
    onChange,
    onAltChange,
    alt = '',
    className,
    previewClassName,
    label = 'Image',
    placeholder = 'Enter image URL or upload',
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUrlMode, setIsUrlMode] = useState(true);
    const [localAlt, setLocalAlt] = useState(alt);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // For now, create a local URL preview
            // In production, this would upload to server/cloud storage
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlChange = (url: string) => {
        onChange(url);
    };

    const handleAltChange = (newAlt: string) => {
        setLocalAlt(newAlt);
        onAltChange?.(newAlt);
    };

    const handleClear = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={cn('space-y-3', className)}>
            {label && <Label>{label}</Label>}
            
            {/* Preview */}
            <div className="relative">
                {value ? (
                    <div className="relative group">
                        <img
                            src={value}
                            alt={localAlt || 'Preview'}
                            className={cn(
                                'w-full h-48 object-cover rounded-lg border',
                                previewClassName
                            )}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop';
                            }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="h-4 w-4 mr-1" />
                                Replace
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={handleClear}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload an image</p>
                        <p className="text-xs text-muted-foreground">or paste a URL below</p>
                    </div>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* URL Input */}
            <div className="space-y-2">
                <Input
                    value={value || ''}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder={placeholder}
                    className="text-sm"
                />
                {onAltChange && (
                    <Input
                        value={localAlt}
                        onChange={(e) => handleAltChange(e.target.value)}
                        placeholder="Alt text (for accessibility)"
                        className="text-sm"
                    />
                )}
            </div>
        </div>
    );
}

// Compact version for use in forms with FormField
interface ImageUploadFieldProps {
    value?: string;
    onChange: (value: string) => void;
    className?: string;
}

export function ImageUploadField({ value, onChange, className }: ImageUploadFieldProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={cn('space-y-2', className)}>
            {/* Preview */}
            {value && (
                <div className="relative group">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-md border"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop';
                        }}
                    />
                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="h-3 w-3 mr-1" />
                        Change
                    </Button>
                </div>
            )}
            
            {!value && (
                <div
                    className="w-full h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Click to upload</p>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Or enter image URL"
                className="text-sm"
            />
        </div>
    );
}
