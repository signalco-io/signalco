import { ExoticComponent } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { MoreHorizontal } from '@signalco/ui-icons';
import { SectionData } from '../SectionData';

export function SectionsEditor({ sectionsData, componentsRegistry }: { sectionsData: SectionData[]; componentsRegistry: { [key: string]: ExoticComponent<SectionData>; }; }) {
    const handleSectionEdit = (sectionData: SectionData) => {
        console.log('Edit', sectionData);
    };

    return (
        <div>
            {sectionsData.map((sectionData, index) => {
                const Section = sectionData.component ? componentsRegistry[sectionData.component] : null;
                if (!Section) {
                    return null;
                }

                return (
                    <div className="group relative" key={index}>
                        <div className="pointer-events-none absolute inset-0 rounded-md border opacity-0 transition-opacity group-hover:opacity-100" />
                        <IconButton
                            onClick={() => handleSectionEdit(sectionData)}
                            variant="soft"
                            className="absolute left-0 top-0 rounded-r-none rounded-bl-none opacity-0 transition-opacity group-hover:opacity-100">
                            <MoreHorizontal />
                        </IconButton>
                        <Typography level="body2" className="absolute left-12 top-2 text-center opacity-0 transition-opacity group-hover:opacity-100">
                            {sectionData.component}
                        </Typography>
                        <Section {...sectionData} />
                    </div>
                );
            })}
        </div>
    );
}
