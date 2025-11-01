import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 120 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('text-foreground h-8 w-auto', className)}>

            <path
                d="M8 8 L8 32 L18 32 C22 32 26 30 26 20 C26 10 22 8 18 8 Z M12 12 L18 12 C20 12 22 13 22 20 C22 27 20 28 18 28 L12 28 Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />

            <path
                d="M38 18 C38 14 40 12 44 12 C48 12 50 14 50 18 L46 18 C46 16 45 15 44 15 C43 15 42 16 42 18 C42 19.5 42.5 20 46 23 C49.5 26 50 27 50 30 C50 34 48 36 44 36 C40 36 38 34 38 30 L42 30 C42 32 43 33 44 33 C45 33 46 32 46 30 C46 28.5 45.5 28 42 25 C38.5 22 38 21 38 18 Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />

            <path
                d="M60 8 L60 32 L70 32 C74 32 78 30 78 20 C78 10 74 8 70 8 Z M64 12 L70 12 C72 12 74 13 74 20 C74 27 72 28 70 28 L64 28 Z"
                fill={uniColor ? 'currentColor' : 'url(#logo-gradient)'}
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="0"
                    y1="0"
                    x2="80"
                    y2="40"
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
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-8', className)}>

            <circle cx="20" cy="20" r="18" fill={uniColor ? 'currentColor' : 'url(#icon-gradient)'} fillOpacity="0.1" />

            <path
                d="M10 12 L10 28 L16 28 C18.5 28 21 26.5 21 20 C21 13.5 18.5 12 16 12 Z M12.5 14.5 L16 14.5 C17.2 14.5 18.5 15 18.5 20 C18.5 25 17.2 25.5 16 25.5 L12.5 25.5 Z"
                fill={uniColor ? 'currentColor' : 'url(#icon-gradient)'}
            />

            <path
                d="M23 17 C23 15 24 14 25.5 14 C27 14 28 15 28 17 L26.5 17 C26.5 15.8 26 15.5 25.5 15.5 C25 15.5 24.5 15.8 24.5 17 C24.5 17.8 24.8 18 26.5 19.5 C28.2 21 28.5 21.5 28.5 23 C28.5 25 27.5 26 25.5 26 C23.5 26 23 25 23 23 L24.5 23 C24.5 24.2 25 24.5 25.5 24.5 C26 24.5 27 24.2 27 23 C27 22.2 26.7 22 25 20.5 C23.3 19 23 18.5 23 17 Z"
                fill={uniColor ? 'currentColor' : 'url(#icon-gradient)'}
            />
            <path
                d="M30 12 L30 28 L24 28 C21.5 28 19 26.5 19 20 C19 13.5 21.5 12 24 12 Z M27.5 14.5 L24 14.5 C22.8 14.5 21.5 15 21.5 20 C21.5 25 22.8 25.5 24 25.5 L27.5 25.5 Z"
                fill={uniColor ? 'currentColor' : 'url(#icon-gradient)'}
                opacity="0.6"
            />
            <defs>
                <linearGradient
                    id="icon-gradient"
                    x1="5"
                    y1="5"
                    x2="35"
                    y2="35"
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
            viewBox="0 0 120 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8 8 L8 32 L18 32 C22 32 26 30 26 20 C26 10 22 8 18 8 Z M12 12 L18 12 C20 12 22 13 22 20 C22 27 20 28 18 28 L12 28 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M38 18 C38 14 40 12 44 12 C48 12 50 14 50 18 L46 18 C46 16 45 15 44 15 C43 15 42 16 42 18 C42 19.5 42.5 20 46 23 C49.5 26 50 27 50 30 C50 34 48 36 44 36 C40 36 38 34 38 30 L42 30 C42 32 43 33 44 33 C45 33 46 32 46 30 C46 28.5 45.5 28 42 25 C38.5 22 38 21 38 18 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M60 8 L60 32 L70 32 C74 32 78 30 78 20 C78 10 74 8 70 8 Z M64 12 L70 12 C72 12 74 13 74 20 C74 27 72 28 70 28 L64 28 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    )
}
