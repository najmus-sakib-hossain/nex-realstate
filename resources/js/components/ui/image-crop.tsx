'use client';

import * as React from 'react';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type Crop,
    type PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ImageCropProps {
    image: string;
    onCropComplete: (croppedImageBlob: Blob, croppedImageUrl: string) => void;
    onCancel?: () => void;
    aspectRatio?: number;
    circularCrop?: boolean;
    minWidth?: number;
    minHeight?: number;
    className?: string;
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

async function getCroppedImage(
    image: HTMLImageElement,
    crop: PixelCrop,
    fileName: string = 'cropped-image.jpg',
): Promise<{ blob: Blob; url: string }> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('No 2d context');
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const url = URL.createObjectURL(blob);
                resolve({ blob, url });
            },
            'image/jpeg',
            0.95,
        );
    });
}

export function ImageCropper({
    image,
    onCropComplete,
    onCancel,
    aspectRatio = 1,
    circularCrop = false,
    minWidth = 100,
    minHeight = 100,
    className,
}: ImageCropProps) {
    const [crop, setCrop] = React.useState<Crop>();
    const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
    const imgRef = React.useRef<HTMLImageElement>(null);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspectRatio));
    }

    async function handleCropComplete() {
        if (!imgRef.current || !completedCrop) return;

        try {
            const { blob, url } = await getCroppedImage(
                imgRef.current,
                completedCrop,
            );
            onCropComplete(blob, url);
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    }

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className="flex items-center justify-center overflow-hidden rounded-lg border bg-muted">
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspectRatio}
                    circularCrop={circularCrop}
                    minWidth={minWidth}
                    minHeight={minHeight}
                    className="max-h-[60vh]"
                >
                    <img
                        ref={imgRef}
                        src={image}
                        alt="Crop preview"
                        onLoad={onImageLoad}
                        className="max-h-[60vh] object-contain"
                    />
                </ReactCrop>
            </div>
            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button onClick={handleCropComplete} disabled={!completedCrop}>
                    Apply Crop
                </Button>
            </div>
        </div>
    );
}

interface ImageCropDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    image: string | null;
    onCropComplete: (croppedImageBlob: Blob, croppedImageUrl: string) => void;
    aspectRatio?: number;
    circularCrop?: boolean;
    title?: string;
}

export function ImageCropDialog({
    open,
    onOpenChange,
    image,
    onCropComplete,
    aspectRatio = 1,
    circularCrop = false,
    title = 'Crop Image',
}: ImageCropDialogProps) {
    const handleCropComplete = (blob: Blob, url: string) => {
        onCropComplete(blob, url);
        onOpenChange(false);
    };

    if (!image) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <ImageCropper
                    image={image}
                    onCropComplete={handleCropComplete}
                    onCancel={() => onOpenChange(false)}
                    aspectRatio={aspectRatio}
                    circularCrop={circularCrop}
                />
            </DialogContent>
        </Dialog>
    );
}

interface ImageUploadWithCropProps {
    onImageCropped: (blob: Blob, url: string) => void;
    aspectRatio?: number;
    circularCrop?: boolean;
    currentImage?: string;
    className?: string;
    children?: React.ReactNode;
}

export function ImageUploadWithCrop({
    onImageCropped,
    aspectRatio = 1,
    circularCrop = false,
    currentImage,
    className,
    children,
}: ImageUploadWithCropProps) {
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [isCropDialogOpen, setIsCropDialogOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setIsCropDialogOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (blob: Blob, url: string) => {
        onImageCropped(blob, url);
        setSelectedImage(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="crop-image-input"
            />
            <label htmlFor="crop-image-input" className="cursor-pointer">
                {children || (
                    <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50">
                        {currentImage ? (
                            <img
                                src={currentImage}
                                alt="Current"
                                className={cn(
                                    'h-full w-full object-cover',
                                    circularCrop && 'rounded-full',
                                    !circularCrop && 'rounded-lg',
                                )}
                            />
                        ) : (
                            <span className="text-sm text-muted-foreground">
                                Click to upload
                            </span>
                        )}
                    </div>
                )}
            </label>
            <ImageCropDialog
                open={isCropDialogOpen}
                onOpenChange={setIsCropDialogOpen}
                image={selectedImage}
                onCropComplete={handleCropComplete}
                aspectRatio={aspectRatio}
                circularCrop={circularCrop}
            />
        </div>
    );
}

export { ReactCrop, type Crop, type PixelCrop };
