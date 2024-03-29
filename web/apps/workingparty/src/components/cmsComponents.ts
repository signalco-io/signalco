import { ExoticComponent, memo } from 'react';
import { type SectionData } from '@signalco/cms-core/SectionData';
import { Pricing1 } from '@signalco/cms-components-marketing/Pricing';
import { Heading1 } from '@signalco/cms-components-marketing/Heading';
import { Footer1 } from '@signalco/cms-components-marketing/Footer';
import { Feature1, Feature2 } from '@signalco/cms-components-marketing/Feature';
import { Faq1 } from '@signalco/cms-components-marketing/Faq';

export const cmsComponents: { [key: string]: ExoticComponent<SectionData> } = {
    'Heading1': memo(Heading1),
    'Feature1': memo(Feature1),
    'Feature2': memo(Feature2),
    'Pricing1': memo(Pricing1),
    'Faq1': memo(Faq1),
    'Footer1': memo(Footer1)
};