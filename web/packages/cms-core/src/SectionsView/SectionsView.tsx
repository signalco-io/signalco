import { ExoticComponent } from 'react';
import { SectionData } from '../SectionData';

export type CmsComponentRegistry = {
    [key: string]: ExoticComponent<SectionData>;
};

export type CmsSectionsViewProps = {
    sectionsData: SectionData[];
    componentsRegistry: CmsComponentRegistry;
};

export function SectionsView({ sectionsData, componentsRegistry }: CmsSectionsViewProps) {
    return (
        <div>
            {sectionsData.map((sectionData, index) => {
                const Section = sectionData.component ? componentsRegistry[sectionData.component] : null;
                if (!Section) {
                    return null;
                }

                return (
                    <Section key={index} {...sectionData} />
                );
            })}
        </div>
    );
}


