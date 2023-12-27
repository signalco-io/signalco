import { Row } from '@signalco/ui-primitives/Row';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { type SectionData } from '@signalco/cms-core/SectionData';

export function Ctas2({ ctas }: { ctas: SectionData['ctas']; }) {
    if (!ctas?.length) {
        return null;
    }

    return (
        <Row>
            {ctas.map(cta => (
                <IconButton
                    key={cta.label}
                    aria-label={cta.label}
                    variant="plain"
                    href={cta.href}>
                    {cta.icon}
                </IconButton>
            ))}
        </Row>
    );
}
