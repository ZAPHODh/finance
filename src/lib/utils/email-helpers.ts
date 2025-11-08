export function formatCurrency(amount: number, currency: string): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formatter.format(amount);
}

export function formatDateInUserTimezone(date: Date, timezone?: string): string {
    const userTimezone = timezone || 'America/Sao_Paulo';

    const formatter = new Intl.DateTimeFormat('pt-BR', {
        timeZone: userTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    return formatter.format(date);
}

export function getWeekRange(): { weekStart: string; weekEnd: string } {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
        weekStart: formatDateInUserTimezone(monday),
        weekEnd: formatDateInUserTimezone(sunday),
    };
}

export function getCurrentMonthName(locale: string = 'pt'): string {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en-US', {
        month: 'long',
    });

    return formatter.format(now);
}

export function getCurrentYear(): string {
    return new Date().getFullYear().toString();
}
