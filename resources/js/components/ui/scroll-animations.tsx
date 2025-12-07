import { cn } from '@/lib/utils';
import { motion, type Variant } from 'motion/react';
import * as React from 'react';
import { useInView } from 'react-intersection-observer';

// ================================
// ANIMATION VARIANTS
// ================================

type AnimationVariant = 'fadeIn' | 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'blur';

const variants: Record<AnimationVariant, { hidden: Variant; visible: Variant }> = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    fadeUp: {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
    },
    fadeDown: {
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0 },
    },
    fadeLeft: {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0 },
    },
    fadeRight: {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0 },
    },
    scale: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
    },
    blur: {
        hidden: { opacity: 0, filter: 'blur(10px)' },
        visible: { opacity: 1, filter: 'blur(0px)' },
    },
};

// ================================
// SCROLL REVEAL
// ================================

interface ScrollRevealProps {
    children: React.ReactNode;
    variant?: AnimationVariant;
    delay?: number;
    duration?: number;
    threshold?: number;
    triggerOnce?: boolean;
    className?: string;
    as?: React.ElementType;
}

function ScrollReveal({
    children,
    variant = 'fadeUp',
    delay = 0,
    duration = 0.5,
    threshold = 0.1,
    triggerOnce = true,
    className,
    as = 'div',
}: ScrollRevealProps) {
    const { ref, inView } = useInView({
        threshold,
        triggerOnce,
    });

    const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div;

    return (
        <MotionComponent
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={variants[variant]}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </MotionComponent>
    );
}

// ================================
// STAGGER CONTAINER
// ================================

interface StaggerContainerProps {
    children: React.ReactNode;
    staggerDelay?: number;
    threshold?: number;
    triggerOnce?: boolean;
    className?: string;
}

function StaggerContainer({
    children,
    staggerDelay = 0.1,
    threshold = 0.1,
    triggerOnce = true,
    className,
}: StaggerContainerProps) {
    const { ref, inView } = useInView({
        threshold,
        triggerOnce,
    });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ================================
// STAGGER ITEM
// ================================

interface StaggerItemProps {
    children: React.ReactNode;
    variant?: AnimationVariant;
    duration?: number;
    className?: string;
}

function StaggerItem({
    children,
    variant = 'fadeUp',
    duration = 0.5,
    className,
}: StaggerItemProps) {
    return (
        <motion.div
            variants={variants[variant]}
            transition={{
                duration,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ================================
// PARALLAX
// ================================

interface ParallaxProps {
    children: React.ReactNode;
    speed?: number;
    className?: string;
}

function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
        if (!inView) return;

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [inView]);

    return (
        <motion.div
            ref={ref}
            style={{
                y: scrollY * speed,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ================================
// COUNT UP
// ================================

interface CountUpProps {
    end: number;
    start?: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    threshold?: number;
    className?: string;
}

function CountUp({
    end,
    start = 0,
    duration = 2,
    suffix = '',
    prefix = '',
    threshold = 0.5,
    className,
}: CountUpProps) {
    const { ref, inView } = useInView({
        threshold,
        triggerOnce: true,
    });

    const [count, setCount] = React.useState(start);

    React.useEffect(() => {
        if (!inView) return;

        const startTime = Date.now();
        const diff = end - start;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            setCount(Math.round(start + diff * easeProgress));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [inView, start, end, duration]);

    return (
        <span ref={ref} className={className}>
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
}

// ================================
// REVEAL TEXT
// ================================

interface RevealTextProps {
    text: string;
    delay?: number;
    threshold?: number;
    className?: string;
}

function RevealText({ text, delay = 0, threshold = 0.5, className }: RevealTextProps) {
    const { ref, inView } = useInView({
        threshold,
        triggerOnce: true,
    });

    const words = text.split(' ');

    return (
        <span ref={ref} className={cn('inline-flex flex-wrap', className)}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.05,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="mr-1"
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}

// ================================
// USE SCROLL PROGRESS
// ================================

function useScrollProgress() {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = scrollTop / docHeight;
            setProgress(Math.min(Math.max(scrollProgress, 0), 1));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return progress;
}

export {
    CountUp,
    Parallax,
    RevealText,
    ScrollReveal,
    StaggerContainer,
    StaggerItem,
    useScrollProgress,
    type AnimationVariant,
};
