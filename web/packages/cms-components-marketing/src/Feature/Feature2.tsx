import { type SectionData } from '@signalco/cms-core/SectionData';
import { Ctas1 } from '../subcomponents/Ctas1';
import { Description1 } from '../Description/Description1';
import { Section1 } from '../containers/Section1';


export function Feature2({ tagline, header, description, ctas, asset }: SectionData) {
    return (
        <Section1>
            <Description1 tagline={tagline} header={header} description={description} />
            <Ctas1 ctas={ctas} />
            <div>
                {asset}
            </div>
        </Section1>
    );
}
