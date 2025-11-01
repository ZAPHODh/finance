import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 200 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-8 w-auto', className)}>
            {/* First D */}
            <path
                d="M10 10 L10 50 L30 50 C40 50 50 45 50 30 C50 15 40 10 30 10 Z M18 18 L30 18 C35 18 42 20 42 30 C42 40 35 42 30 42 L18 42 Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            {/* Number 2 */}
            <path
                d="M70 25 C70 18 75 15 85 15 C95 15 100 18 100 25 L92 25 C92 21 89 20 85 20 C81 20 78 21 78 25 C78 28 79 29 88 35 C97 41 100 43 100 48 C100 55 95 58 85 58 C75 58 70 55 70 48 L78 48 C78 52 81 53 85 53 C89 53 92 52 92 48 C92 45 91 44 82 38 C73 32 70 30 70 25 Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            {/* Second D */}
            <path
                d="M120 10 L120 50 L140 50 C150 50 160 45 160 30 C160 15 150 10 140 10 Z M128 18 L140 18 C145 18 152 20 152 30 C152 40 145 42 140 42 L128 42 Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="10"
                    x2="160"
                    y2="50"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop offset="0.5" stopColor="#7C7AE8" />
                    <stop offset="1" stopColor="#2BC8B7" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-8', className)}>
            {/* Circular background */}
            <circle cx="30" cy="30" r="28" fill={uniColor ? 'currentColor' : 'url(#icon-gradient)'} fillOpacity="0.08" />

            {/* Compact D2D */}
            <path
                d="M12 18 L12 42 L22 42 C27 42 32 39 32 30 C32 21 27 18 22 18 Z M16 22 L22 22 C25 22 28 23 28 30 C28 37 25 38 22 38 L16 38 Z"
                fill={uniColor ? 'currentColor' : 'url(#icon-gradient)'}
            />
            <path
                d="M36 25 C36 22 37.5 20 40 20 C42.5 20 44 22 44 25 L42 25 C42 23 41 22.5 40 22.5 C39 22.5 38 23 38 25 C38 26.5 38.5 27 41 29 C43.5 31 44 32 44 34 C44 37 42.5 38.5 40 38.5 C37.5 38.5 36 37 36 34 L38 34 C38 36 39 36.5 40 36.5 C41 36.5 42 36 42 34 C42 32.5 41.5 32 39 30 C36.5 28 36 27 36 25 Z"
                fill={uniColor ? 'currentColor' : 'url(#icon-gradient)'}
            />
            <path
                d="M48 18 L48 42 L38 42 C33 42 28 39 28 30 C28 21 33 18 38 18 Z M44 22 L38 22 C35 22 32 23 32 30 C32 37 35 38 38 38 L44 38 Z"
                fill={uniColor ? 'currentColor' : 'url(#icon-gradient)'}
                opacity="0.4"
            />
            <defs>
                <linearGradient
                    id="icon-gradient"
                    x1="12"
                    y1="18"
                    x2="48"
                    y2="42"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop offset="0.5" stopColor="#7C7AE8" />
                    <stop offset="1" stopColor="#2BC8B7" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <svg
            className={cn('h-10 w-auto', className)}
            viewBox="0 0 200 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            {/* First D - Outlined */}
            <path
                d="M10 10 L10 50 L30 50 C40 50 50 45 50 30 C50 15 40 10 30 10 Z M18 18 L30 18 C35 18 42 20 42 30 C42 40 35 42 30 42 L18 42 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            {/* Number 2 - Outlined */}
            <path
                d="M70 25 C70 18 75 15 85 15 C95 15 100 18 100 25 L92 25 C92 21 89 20 85 20 C81 20 78 21 78 25 C78 28 79 29 88 35 C97 41 100 43 100 48 C100 55 95 58 85 58 C75 58 70 55 70 48 L78 48 C78 52 81 53 85 53 C89 53 92 52 92 48 C92 45 91 44 82 38 C73 32 70 30 70 25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            {/* Second D - Outlined */}
            <path
                d="M120 10 L120 50 L140 50 C150 50 160 45 160 30 C160 15 150 10 140 10 Z M128 18 L140 18 C145 18 152 20 152 30 C152 40 145 42 140 42 L128 42 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
        </svg>
    )
}
