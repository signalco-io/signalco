import { Heading1 } from '@signalco/cms-feature-marketing/Heading';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { KnownPages } from '../../../src/knownPages';

export default function LandingPage() {
    const data: SectionData[] = [
        {
            header: 'uier',
            ctas: [
                { label: 'Get Started', href: KnownPages.App },
            ]
        },
        {}
    ];

    const sections = [
        Heading1,
        // Footer1
    ];

    return (
        <main>
            {sections.map((Section, index) => {
                const sectionData = data[index];
                return (
                    <Section key={index} {...sectionData} />
                );
            })}
        </main>
    );
}
