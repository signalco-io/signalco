export const devices = {
    desktop: { label: 'Desktop', width: 1440, height: 1000 },
    tablet: { label: 'Tablet', width: 820, height: 1180 },
    mobile: { label: 'Mobile', width: 390, height: 844 },
} as const;
export type Device = keyof typeof devices;
export type StyleSample = {
    tag: string; text: string; color: string; background: string;
    family: string; size: string; weight: string; lineHeight: string; spacing: string; count: number;
};
export type Inspection = {
    styles: StyleSample[];
    checks: { label: string; count: number; examples: string[] }[];
    title: string; language: string; headings: { level: number; text: string }[];
    sampled: number; total: number;
};
export type Capture = { data: string; width: number; height: number; inspection?: Inspection; reachedBottom?: boolean };
