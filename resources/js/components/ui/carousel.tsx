'use client';

import * as React from 'react';
import useEmblaCarousel, {
    type UseEmblaCarouselType,
} from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: 'horizontal' | 'vertical';
    setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
    selectedIndex: number;
    scrollSnaps: number[];
    scrollTo: (index: number) => void;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);

    if (!context) {
        throw new Error('useCarousel must be used within a <Carousel />');
    }

    return context;
}

const Carousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
            orientation = 'horizontal',
            opts,
            setApi,
            plugins,
            className,
            children,
            ...props
        },
        ref,
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            {
                ...opts,
                axis: orientation === 'horizontal' ? 'x' : 'y',
            },
            plugins,
        );
        const [canScrollPrev, setCanScrollPrev] = React.useState(false);
        const [canScrollNext, setCanScrollNext] = React.useState(false);
        const [selectedIndex, setSelectedIndex] = React.useState(0);
        const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

        const onSelect = React.useCallback((api: CarouselApi) => {
            if (!api) return;

            setSelectedIndex(api.selectedScrollSnap());
            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        }, []);

        const scrollPrev = React.useCallback(() => {
            api?.scrollPrev();
        }, [api]);

        const scrollNext = React.useCallback(() => {
            api?.scrollNext();
        }, [api]);

        const scrollTo = React.useCallback(
            (index: number) => {
                api?.scrollTo(index);
            },
            [api],
        );

        const handleKeyDown = React.useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    scrollPrev();
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    scrollNext();
                }
            },
            [scrollPrev, scrollNext],
        );

        React.useEffect(() => {
            if (!api || !setApi) return;

            setApi(api);
        }, [api, setApi]);

        React.useEffect(() => {
            if (!api) return;

            setScrollSnaps(api.scrollSnapList());
            onSelect(api);
            api.on('reInit', onSelect);
            api.on('select', onSelect);

            return () => {
                api?.off('select', onSelect);
            };
        }, [api, onSelect]);

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api: api,
                    opts,
                    orientation:
                        orientation ||
                        (opts?.axis === 'y' ? 'vertical' : 'horizontal'),
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                    selectedIndex,
                    scrollSnaps,
                    scrollTo,
                }}
            >
                <div
                    ref={ref}
                    onKeyDownCapture={handleKeyDown}
                    className={cn('relative', className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        );
    },
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div
                ref={ref}
                className={cn(
                    'flex',
                    orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
                    className,
                )}
                {...props}
            />
        </div>
    );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cn(
                'min-w-0 shrink-0 grow-0 basis-full',
                orientation === 'horizontal' ? 'pl-4' : 'pt-4',
                className,
            )}
            {...props}
        />
    );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                'absolute h-8 w-8 rounded-full',
                orientation === 'horizontal'
                    ? '-left-12 top-1/2 -translate-y-1/2'
                    : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
                className,
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            {...props}
        >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
        </Button>
    );
});
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button>
>(({ className, variant = 'outline', size = 'icon', ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
                'absolute h-8 w-8 rounded-full',
                orientation === 'horizontal'
                    ? '-right-12 top-1/2 -translate-y-1/2'
                    : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
                className,
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
            {...props}
        >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
        </Button>
    );
});
CarouselNext.displayName = 'CarouselNext';

const CarouselDots = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const { scrollSnaps, selectedIndex, scrollTo } = useCarousel();

    return (
        <div
            ref={ref}
            className={cn('flex justify-center gap-2 pt-4', className)}
            {...props}
        >
            {scrollSnaps.map((_, index) => (
                <button
                    key={index}
                    className={cn(
                        'h-2 w-2 rounded-full transition-all',
                        index === selectedIndex
                            ? 'w-6 bg-primary'
                            : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
                    )}
                    onClick={() => scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                />
            ))}
        </div>
    );
});
CarouselDots.displayName = 'CarouselDots';

// =============================================================================
// Specialized Carousels
// =============================================================================

interface ImageCarouselProps {
    images: { src: string; alt: string }[];
    className?: string;
    showDots?: boolean;
    showArrows?: boolean;
    autoplay?: boolean;
    autoplayInterval?: number;
}

export function ImageCarousel({
    images,
    className,
    showDots = true,
    showArrows = true,
    autoplay = false,
    autoplayInterval = 5000,
}: ImageCarouselProps) {
    const [api, setApi] = React.useState<CarouselApi>();

    React.useEffect(() => {
        if (!autoplay || !api) return;

        const intervalId = setInterval(() => {
            if (api.canScrollNext()) {
                api.scrollNext();
            } else {
                api.scrollTo(0);
            }
        }, autoplayInterval);

        return () => clearInterval(intervalId);
    }, [api, autoplay, autoplayInterval]);

    return (
        <Carousel setApi={setApi} className={cn('w-full', className)}>
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="relative aspect-video overflow-hidden rounded-lg">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {showArrows && images.length > 1 && (
                <>
                    <CarouselPrevious />
                    <CarouselNext />
                </>
            )}
            {showDots && images.length > 1 && <CarouselDots />}
        </Carousel>
    );
}

interface TestimonialCarouselProps {
    testimonials: {
        content: string;
        author: string;
        role: string;
        avatar?: string;
    }[];
    className?: string;
}

export function TestimonialCarousel({
    testimonials,
    className,
}: TestimonialCarouselProps) {
    return (
        <Carousel
            className={cn('w-full max-w-3xl mx-auto', className)}
            opts={{ loop: true }}
        >
            <CarouselContent>
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index}>
                        <div className="p-6 text-center">
                            <blockquote className="text-lg italic text-muted-foreground mb-6">
                                "{testimonial.content}"
                            </blockquote>
                            <div className="flex items-center justify-center gap-3">
                                {testimonial.avatar && (
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.author}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                )}
                                <div className="text-left">
                                    <p className="font-semibold">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
            <CarouselDots />
        </Carousel>
    );
}

interface PropertyCardCarouselProps {
    properties: {
        id: string;
        image: string;
        title: string;
        price: string;
        location: string;
        beds?: number;
        baths?: number;
        sqft?: number;
    }[];
    className?: string;
}

export function PropertyCardCarousel({
    properties,
    className,
}: PropertyCardCarouselProps) {
    return (
        <Carousel
            className={cn('w-full', className)}
            opts={{
                align: 'start',
                loop: true,
            }}
        >
            <CarouselContent className="-ml-2 md:-ml-4">
                {properties.map((property) => (
                    <CarouselItem
                        key={property.id}
                        className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                        <div className="group overflow-hidden rounded-lg border bg-card">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={property.image}
                                    alt={property.title}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="p-4">
                                <p className="text-lg font-bold text-primary">
                                    {property.price}
                                </p>
                                <h3 className="font-semibold line-clamp-1">
                                    {property.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {property.location}
                                </p>
                                {(property.beds ||
                                    property.baths ||
                                    property.sqft) && (
                                    <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                                        {property.beds && (
                                            <span>{property.beds} beds</span>
                                        )}
                                        {property.baths && (
                                            <span>{property.baths} baths</span>
                                        )}
                                        {property.sqft && (
                                            <span>
                                                {property.sqft.toLocaleString()}{' '}
                                                sqft
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
        </Carousel>
    );
}

export {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselDots,
    useCarousel,
};
