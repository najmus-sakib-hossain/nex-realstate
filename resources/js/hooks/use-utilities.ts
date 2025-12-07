import * as React from 'react';

/**
 * Hook to debounce a value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook to debounce a callback function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebouncedCallback<T extends (...args: any[]) => any>(
    callback: T,
    delay: number = 500,
): (...args: Parameters<T>) => void {
    const callbackRef = React.useRef(callback);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return React.useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay],
    );
}

/**
 * Hook to track window scroll position
 */
export function useScrollPosition() {
    const [scrollPosition, setScrollPosition] = React.useState({
        x: 0,
        y: 0,
    });

    React.useEffect(() => {
        const handleScroll = () => {
            setScrollPosition({
                x: window.scrollX,
                y: window.scrollY,
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return scrollPosition;
}

/**
 * Hook to detect if scrolled past a threshold
 */
export function useScrolled(threshold: number = 10) {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > threshold);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold]);

    return scrolled;
}

/**
 * Hook to track window dimensions
 */
export function useWindowSize() {
    const [windowSize, setWindowSize] = React.useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    React.useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowSize;
}

/**
 * Hook to detect media query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = React.useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    React.useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        setMatches(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [query]);

    return matches;
}

/**
 * Common breakpoint hooks
 */
export function useIsMobile() {
    return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet() {
    return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop() {
    return useMediaQuery('(min-width: 1024px)');
}

/**
 * Hook for local storage with SSR support
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = React.useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
        (value) => {
            try {
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;
                setStoredValue(valueToStore);
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        },
        [key, storedValue],
    );

    return [storedValue, setValue];
}

/**
 * Hook to detect clicks outside an element
 */
export function useClickOutside<T extends HTMLElement>(
    handler: () => void,
): React.RefObject<T | null> {
    const ref = React.useRef<T>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handler]);

    return ref;
}

/**
 * Hook to lock body scroll
 */
export function useLockBodyScroll(lock: boolean = true) {
    React.useEffect(() => {
        if (!lock) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [lock]);
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    options: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean } = {},
) {
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key.toLowerCase() === key.toLowerCase() &&
                (options.ctrl === undefined || event.ctrlKey === options.ctrl) &&
                (options.alt === undefined || event.altKey === options.alt) &&
                (options.shift === undefined || event.shiftKey === options.shift) &&
                (options.meta === undefined || event.metaKey === options.meta)
            ) {
                event.preventDefault();
                callback();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [key, callback, options.ctrl, options.alt, options.shift, options.meta]);
}

/**
 * Hook for copy to clipboard
 */
export function useCopyToClipboard(): [
    string | null,
    (text: string) => Promise<boolean>,
] {
    const [copiedText, setCopiedText] = React.useState<string | null>(null);

    const copy = React.useCallback(async (text: string): Promise<boolean> => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported');
            return false;
        }

        try {
            await navigator.clipboard.writeText(text);
            setCopiedText(text);
            return true;
        } catch {
            console.error('Copy failed');
            setCopiedText(null);
            return false;
        }
    }, []);

    return [copiedText, copy];
}

/**
 * Hook for countdown timer
 */
export function useCountdown(
    targetDate: Date,
): { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean } {
    const calculateTimeLeft = () => {
        const difference = targetDate.getTime() - new Date().getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            isExpired: false,
        };
    };

    const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return timeLeft;
}

/**
 * Hook for async operations with loading and error states
 */
export function useAsync<T, E = Error>(
    asyncFunction: () => Promise<T>,
    immediate: boolean = true,
): {
    execute: () => Promise<void>;
    status: 'idle' | 'pending' | 'success' | 'error';
    value: T | null;
    error: E | null;
} {
    const [status, setStatus] = React.useState<
        'idle' | 'pending' | 'success' | 'error'
    >('idle');
    const [value, setValue] = React.useState<T | null>(null);
    const [error, setError] = React.useState<E | null>(null);

    const execute = React.useCallback(async () => {
        setStatus('pending');
        setValue(null);
        setError(null);

        try {
            const response = await asyncFunction();
            setValue(response);
            setStatus('success');
        } catch (err) {
            setError(err as E);
            setStatus('error');
        }
    }, [asyncFunction]);

    React.useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, status, value, error };
}
