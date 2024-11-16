export function SpacesEditingBackground() {
    return (
        <svg className="pointer-events-none fixed inset-0 -z-50 size-full">
            <pattern id="pattern-heroundefined" x="0" y="0" width="43" height="43" patternUnits="userSpaceOnUse" patternTransform="translate(-0.5,-0.5)"><circle cx="0.5" cy="0.5" r="0.5" fill="#91919a" /></pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-heroundefined)" />
        </svg>
    );
}
