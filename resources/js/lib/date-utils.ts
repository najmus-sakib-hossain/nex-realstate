import {
    format,
    formatDistance,
    formatDistanceToNow,
    formatRelative,
    isAfter,
    isBefore,
    isToday,
    isYesterday,
    parseISO,
} from 'date-fns';

// ================================
// DATE PARSING
// ================================

/**
 * Parse a date string to Date object
 */
export function parseDate(date: string | Date): Date {
    if (date instanceof Date) return date;
    return parseISO(date);
}

// ================================
// DATE FORMATTING
// ================================

/**
 * Format date to readable string
 * @example formatDate('2024-01-15') => 'January 15, 2024'
 */
export function formatDate(date: string | Date, formatStr = 'MMMM d, yyyy'): string {
    return format(parseDate(date), formatStr);
}

/**
 * Format date with time
 * @example formatDateTime('2024-01-15T10:30:00') => 'January 15, 2024 at 10:30 AM'
 */
export function formatDateTime(date: string | Date): string {
    return format(parseDate(date), "MMMM d, yyyy 'at' h:mm a");
}

/**
 * Format short date
 * @example formatShortDate('2024-01-15') => 'Jan 15, 2024'
 */
export function formatShortDate(date: string | Date): string {
    return format(parseDate(date), 'MMM d, yyyy');
}

/**
 * Format compact date
 * @example formatCompactDate('2024-01-15') => '01/15/24'
 */
export function formatCompactDate(date: string | Date): string {
    return format(parseDate(date), 'MM/dd/yy');
}

/**
 * Format time only
 * @example formatTime('2024-01-15T10:30:00') => '10:30 AM'
 */
export function formatTime(date: string | Date): string {
    return format(parseDate(date), 'h:mm a');
}

/**
 * Format month and year
 * @example formatMonthYear('2024-01-15') => 'January 2024'
 */
export function formatMonthYear(date: string | Date): string {
    return format(parseDate(date), 'MMMM yyyy');
}

/**
 * Format day and month
 * @example formatDayMonth('2024-01-15') => '15 Jan'
 */
export function formatDayMonth(date: string | Date): string {
    return format(parseDate(date), 'd MMM');
}

// ================================
// RELATIVE TIME
// ================================

/**
 * Get relative time from now
 * @example timeAgo('2024-01-10') => '5 days ago'
 */
export function timeAgo(date: string | Date): string {
    return formatDistanceToNow(parseDate(date), { addSuffix: true });
}

/**
 * Get distance between two dates
 * @example timeBetween('2024-01-01', '2024-01-15') => '14 days'
 */
export function timeBetween(startDate: string | Date, endDate: string | Date): string {
    return formatDistance(parseDate(startDate), parseDate(endDate));
}

/**
 * Get relative date format
 * @example relativeDate('2024-01-15') => 'next Monday at 10:30 AM'
 */
export function relativeDate(date: string | Date, baseDate: Date = new Date()): string {
    return formatRelative(parseDate(date), baseDate);
}

/**
 * Smart date format - shows relative for recent, full for older
 */
export function smartDate(date: string | Date): string {
    const d = parseDate(date);
    
    if (isToday(d)) {
        return `Today at ${formatTime(d)}`;
    }
    
    if (isYesterday(d)) {
        return `Yesterday at ${formatTime(d)}`;
    }
    
    // Within last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (isAfter(d, weekAgo)) {
        return formatRelative(d, new Date());
    }
    
    // Older dates
    return formatShortDate(d);
}

// ================================
// DATE CHECKS
// ================================

/**
 * Check if date is in the past
 */
export function isPast(date: string | Date): boolean {
    return isBefore(parseDate(date), new Date());
}

/**
 * Check if date is in the future
 */
export function isFuture(date: string | Date): boolean {
    return isAfter(parseDate(date), new Date());
}

/**
 * Check if date is today
 */
export function isDateToday(date: string | Date): boolean {
    return isToday(parseDate(date));
}

/**
 * Check if date is yesterday
 */
export function isDateYesterday(date: string | Date): boolean {
    return isYesterday(parseDate(date));
}

// ================================
// DATE RANGES
// ================================

/**
 * Format date range
 * @example formatDateRange('2024-01-15', '2024-01-20') => 'Jan 15 - 20, 2024'
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    
    // Same month and year
    if (format(start, 'MM yyyy') === format(end, 'MM yyyy')) {
        return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
    }
    
    // Same year
    if (format(start, 'yyyy') === format(end, 'yyyy')) {
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    
    // Different years
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
}

// ================================
// DURATION FORMATTING
// ================================

/**
 * Format duration in human readable format
 * @example formatDuration(3600000) => '1 hour'
 */
export function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
    if (hours > 0) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
}

/**
 * Format reading time
 * @example formatReadingTime(1500) => '8 min read'
 */
export function formatReadingTime(wordCount: number, wordsPerMinute = 200): string {
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
}

// ================================
// EXPORTS FOR CONVENIENCE
// ================================

export {
    format,
    formatDistance,
    formatDistanceToNow,
    formatRelative,
    isAfter,
    isBefore,
    isToday,
    isYesterday,
    parseISO,
};
