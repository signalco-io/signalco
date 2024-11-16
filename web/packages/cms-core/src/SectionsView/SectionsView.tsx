import { ExoticComponent } from 'react';
import { SectionData } from '../SectionData';

export type CmsComponentRegistry = {
    [key: string]: ExoticComponent<SectionData>;
};

export type CmsSectionsViewProps = {
    sectionsData: SectionData[];
    componentsRegistry: CmsComponentRegistry;
    debug?: boolean;
};

export function SectionsView({ sectionsData, componentsRegistry, debug }: CmsSectionsViewProps) {
    return (
        <div>
            {sectionsData.map((sectionData, index) => {
                const Section = sectionData.component ? componentsRegistry[sectionData.component] : null;
                if (!Section) {
                    return debug ? (
                        <div className="rounded-lg border border-red-400 bg-red-100 p-4 text-red-700" role="alert">
                            <span className="text-base font-semibold">Component <code>{sectionData.component}</code> not found</span>
                            <pre>{JSON.stringify(sectionData, null, 2)}</pre>
                        </div>
                    ) : null;
                }

                return (
                    <Section key={index} {...sectionData} />
                );
            })}
        </div>
    );
}


