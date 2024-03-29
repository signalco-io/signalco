import { ReactNode } from 'react';

export type SectionData = {
    component?: string;
    tagline?: string;
    header?: string;
    description?: ReactNode;
    asset?: ReactNode;
    features?: SectionData[];
    ctas?: { label: string; href: string; icon?: ReactNode; secondary?: boolean }[];
};
