import { Row } from '@signalco/ui-primitives/Row';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { type SectionData } from '@signalco/cms-core/SectionData';

export function Ctas2({ ctas }: { ctas: SectionData['ctas']; }) {
    if (!ctas?.length) {
        return null;
    }

    return (
        <Row>
            {ctas.map((cta, index) => (
                <IconButton
                    key={cta.label}
                    aria-label={cta.label}
                    variant={index === 0 ? 'solid' : 'outlined'}
                    href={cta.href}
                    className="w-full">
                    {cta.icon}
                </IconButton>
            ))}
        </Row>
    );
}
