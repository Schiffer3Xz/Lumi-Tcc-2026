import type { SVGProps } from 'react';

export default function FireflyIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" {...props}>
            <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 8 11 4M18 8l3-4" />
                <path d="M14 15C10 7 3 8 5 14c1 3 5 5 9 5M18 15c4-8 11-7 9-1-1 3-5 5-9 5" fill="currentColor" fillOpacity="0.18" />
                <path d="m12 20-3 2m11-2 3 2M7 27l-2 1m20-1 2 1M16 29v2" />
                <circle cx="16" cy="10" r="3" fill="currentColor" />
                <path d="M12.5 17a3.5 3.5 0 0 1 7 0v5a3.5 3.5 0 0 1-7 0Z" />
                <path d="M12.5 20h7v2a3.5 3.5 0 0 1-7 0Z" fill="currentColor" />
            </g>
        </svg>
    );
}
