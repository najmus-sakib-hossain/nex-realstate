import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/admin-layout';
import { useCMSStore } from '@/stores/cms-store';
import type { ImageAsset } from '@/types/cms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head } from '@inertiajs/react';
import { Copy, Image, Plus, Trash2, Video } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface VideoAsset {
    id: string;
    url: string;
    thumbnail?: string;
    title?: string;
}

interface MediaLibrary {
    images: ImageAsset[];
    videos: VideoAsset[];
}

const imageSchema = z.object({
    url: z.string().url('Must be a valid URL'),
    alt: z.string().min(1, 'Alt text is required'),
});

const videoSchema = z.object({
    url: z.string().url('Must be a valid URL'),
    thumbnail: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    title: z.string().optional(),
});

type ImageFormData = z.infer<typeof imageSchema>;
type VideoFormData = z.infer<typeof videoSchema>;

// Initial dummy data for the media library
const initialMediaLibrary: MediaLibrary = {
    images: [
        {
            id: 'img-1',
            url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
            alt: 'Modern apartment building',
        },
        {
            id: 'img-2',
            url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
            alt: 'Commercial office tower',
        },
        {
            id: 'img-3',
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
            alt: 'Luxury villa exterior',
        },
    ],
    videos: [
        {
            id: 'vid-1',
            url: 'https://example.com/video1.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
            title: 'Property Tour - Sunrise Heights',
        },
    ],
};

export default function AdminMediaLibraryPage() {
    const { addActivity } = useCMSStore();
    const [mediaLibrary, setMediaLibrary] = useState<MediaLibrary>(initialMediaLibrary);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

    const imageForm = useForm<ImageFormData>({
        resolver: zodResolver(imageSchema),
        defaultValues: { url: '', alt: '' },
    });

    const videoForm = useForm<VideoFormData>({
        resolver: zodResolver(videoSchema),
        defaultValues: { url: '', thumbnail: '', title: '' },
    });

    const handleAddImage = (data: ImageFormData) => {
        const newImage: ImageAsset = {
            id: `img-${Date.now()}`,
            url: data.url,
            alt: data.alt,
        };
        setMediaLibrary((prev) => ({
            ...prev,
            images: [...prev.images, newImage],
        }));
        addActivity({
            type: 'create',
            entity: 'media',
            entityId: newImage.id,
            entityName: data.alt,
            description: `Added new image: ${data.alt}`,
        });
        toast.success('Image added to library');
        setIsImageDialogOpen(false);
        imageForm.reset();
    };

    const handleAddVideo = (data: VideoFormData) => {
        const newVideo: VideoAsset = {
            id: `vid-${Date.now()}`,
            url: data.url,
            thumbnail: data.thumbnail || undefined,
            title: data.title || undefined,
        };
        setMediaLibrary((prev) => ({
            ...prev,
            videos: [...prev.videos, newVideo],
        }));
        addActivity({
            type: 'create',
            entity: 'media',
            entityId: newVideo.id,
            entityName: data.title || 'Video',
            description: `Added new video: ${data.title || 'Untitled'}`,
        });
        toast.success('Video added to library');
        setIsVideoDialogOpen(false);
        videoForm.reset();
    };

    const handleDeleteImage = (id: string) => {
        const image = mediaLibrary.images.find((i) => i.id === id);
        setMediaLibrary((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img.id !== id),
        }));
        addActivity({
            type: 'delete',
            entity: 'media',
            entityId: id,
            entityName: image?.alt || 'Image',
            description: `Deleted image: ${image?.alt}`,
        });
        toast.success('Image deleted');
    };

    const handleDeleteVideo = (id: string) => {
        const video = mediaLibrary.videos.find((v) => v.id === id);
        setMediaLibrary((prev) => ({
            ...prev,
            videos: prev.videos.filter((vid) => vid.id !== id),
        }));
        addActivity({
            type: 'delete',
            entity: 'media',
            entityId: id,
            entityName: video?.title || 'Video',
            description: `Deleted video: ${video?.title || 'Untitled'}`,
        });
        toast.success('Video deleted');
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard');
    };

    return (
        <AdminLayout>
            <Head title="Media Library" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
                        <p className="text-muted-foreground">
                            Manage your images and videos
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="rounded-full bg-primary/10 p-3">
                                <Image className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{mediaLibrary.images.length}</div>
                                <p className="text-sm text-muted-foreground">Images</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <div className="rounded-full bg-chart-5/10 p-3">
                                <Video className="h-6 w-6 text-chart-5" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{mediaLibrary.videos.length}</div>
                                <p className="text-sm text-muted-foreground">Videos</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Media Tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Media</CardTitle>
                        <CardDescription>
                            Click on media items to copy URL or delete
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="images">
                            <div className="flex items-center justify-between mb-4">
                                <TabsList>
                                    <TabsTrigger value="images">
                                        Images ({mediaLibrary.images.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="videos">
                                        Videos ({mediaLibrary.videos.length})
                                    </TabsTrigger>
                                </TabsList>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => setIsImageDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Image
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setIsVideoDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Video
                                    </Button>
                                </div>
                            </div>

                            <TabsContent value="images">
                                {mediaLibrary.images.length > 0 ? (
                                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {mediaLibrary.images.map((image) => (
                                            <div
                                                key={image.id}
                                                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={image.alt}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        onClick={() => copyToClipboard(image.url)}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteImage(image.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                                    <p className="text-xs text-white truncate">{image.alt}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        No images yet. Add your first one!
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="videos">
                                {mediaLibrary.videos.length > 0 ? (
                                    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {mediaLibrary.videos.map((video) => (
                                            <div
                                                key={video.id}
                                                className="group relative aspect-video overflow-hidden rounded-lg border bg-muted"
                                            >
                                                {video.thumbnail ? (
                                                    <img
                                                        src={video.thumbnail}
                                                        alt={video.title || 'Video thumbnail'}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Video className="h-12 w-12 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        onClick={() => copyToClipboard(video.url)}
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteVideo(video.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                                    <p className="text-xs text-white truncate">
                                                        {video.title || 'Untitled'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        No videos yet. Add your first one!
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Add Image Dialog */}
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Image</DialogTitle>
                        <DialogDescription>
                            Add an image to your media library
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...imageForm}>
                        <form onSubmit={imageForm.handleSubmit(handleAddImage)} className="space-y-4">
                            <FormField
                                control={imageForm.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={imageForm.control}
                                name="alt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alt Text</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Describe the image" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Add Image</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Add Video Dialog */}
            <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Video</DialogTitle>
                        <DialogDescription>
                            Add a video to your media library
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...videoForm}>
                        <form onSubmit={videoForm.handleSubmit(handleAddVideo)} className="space-y-4">
                            <FormField
                                control={videoForm.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={videoForm.control}
                                name="thumbnail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail URL (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={videoForm.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title (optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Video title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsVideoDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Add Video</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
