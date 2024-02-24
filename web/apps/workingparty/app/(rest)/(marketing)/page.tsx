import { ExoticComponent, memo } from 'react';
import { SectionsView } from '@signalco/cms-core/SectionsView';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { Heading1 } from '@signalco/cms-components-marketing/Heading';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import { KnownPages } from '../../../src/knownPages';

const data: SectionData[] = [
    {
        component: 'Heading1',
        header: 'Working Party',
        ctas: [
            { label: 'Get Started', href: KnownPages.App },
        ]
    }
];

const sectionComponents: { [key: string]: ExoticComponent<SectionData> } = {
    'Heading1': memo(Heading1),
    'Footer1': memo(Footer1)
};

export default function LandingPage() {
    return (
        <main>
            <SectionsView
                sectionsData={data}
                componentsRegistry={sectionComponents} />
        </main>
    );
}
