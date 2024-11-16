'use client';
export function NoWorkerBackground() {
    return (
        <svg className="pointer-events-none absolute inset-0 -z-50 size-full">
            <pattern id="pattern-heroundefined" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse" patternTransform="translate(-0.5,-0.5)"><circle cx="0.5" cy="0.5" r="0.5" fill="hsl(var(--muted-foreground))" /></pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-heroundefined)" />
        </svg>
    );
}
