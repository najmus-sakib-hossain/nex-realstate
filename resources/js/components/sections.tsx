import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, type ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
}

export function Section({ children, className, id }: SectionProps) {
    return (
        <section id={id} className={cn('py-16 md:py-24', className)}>
            <div className="container mx-auto px-4">{children}</div>
        </section>
    );
}

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    align?: 'left' | 'center' | 'right';
    className?: string;
}

export function SectionHeader({
    title,
    subtitle,
    align = 'center',
    className,
}: SectionHeaderProps) {
    const alignClasses = {
        left: 'text-left',
        center: 'text-center mx-auto',
        right: 'text-right ml-auto',
    };

    return (
        <div className={cn('mb-12 max-w-3xl', alignClasses[align], className)}>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
            )}
        </div>
    );
}

interface HeroSectionProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    overlay?: boolean;
    height?: 'full' | 'large' | 'medium' | 'small';
    children?: ReactNode;
}

export function HeroSection({
    title,
    subtitle,
    backgroundImage,
    overlay = true,
    height = 'large',
    children,
}: HeroSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

    const heightClasses = {
        full: 'min-h-screen',
        large: 'min-h-[70vh]',
        medium: 'min-h-[50vh]',
        small: 'min-h-[40vh]',
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative flex items-center justify-center overflow-hidden',
                heightClasses[height],
            )}
            style={{ position: 'relative' }}
        >
            {/* Parallax Background Image */}
            {backgroundImage && (
                <motion.div
                    className="absolute inset-0 w-full"
                    style={{ 
                        y,
                        height: '130%',
                        top: '-15%',
                    }}
                >
                    <img
                        src={backgroundImage}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </motion.div>
            )}
            {/* Dark Overlay */}
            {overlay && (
                <div className="absolute inset-0 z-[1] bg-black/50" />
            )}
            {/* Content */}
            <div className="container relative z-10 mx-auto px-4 text-center text-white">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 md:text-xl">
                        {subtitle}
                    </p>
                )}
                {children && <div className="mt-8">{children}</div>}
            </div>
        </div>
    );
}

interface PageHeroProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function PageHero({
    title,
    subtitle,
    backgroundImage,
    breadcrumbs,
}: PageHeroProps) {
    return (
        <section
            className="relative flex min-h-[40vh] items-center justify-center"
            style={
                backgroundImage
                    ? {
                          backgroundImage: `url(${backgroundImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                      }
                    : { backgroundColor: '#1e3a5f' }
            }
        >
            <div className="absolute inset-0 bg-black/50" />
            <div className="container relative z-10 mx-auto px-4 py-20 text-center text-white">
                {breadcrumbs && (
                    <nav className="mb-4 text-sm text-white/70">
                        {breadcrumbs.map((item, index) => (
                            <span key={index}>
                                {index > 0 && ' / '}
                                {item.href ? (
                                    <a href={item.href} className="hover:text-white">
                                        {item.label}
                                    </a>
                                ) : (
                                    <span className="text-white">{item.label}</span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    {title}
                </h1>
                {subtitle && (
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
