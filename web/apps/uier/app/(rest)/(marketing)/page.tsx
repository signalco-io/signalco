import { KnownPages } from '../../../src/knownPages';

function Cover({ header }: { header?: string }) {
    return (
        <div>{header}</div>
    )
}

export default function LandingPage() {
    const data = [
        {
            header: 'uier',
            ctas: [
                { label: 'Get Started', href: KnownPages.App },
            ]
        }
    ];

    const sections = [
        Cover
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
