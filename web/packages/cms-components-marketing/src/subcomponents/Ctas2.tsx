import { Row } from '@signalco/ui-primitives/Row';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { type SectionData } from '@signalco/cms-core/SectionData';

export function Ctas2({ ctas }: { ctas: SectionData['ctas']; }) {
    if (!ctas?.length) {
        return null;
    }

    return (
        <Row spacing={1}>
            {ctas.map(cta => (
                <a key={cta.label} href={cta.href}>
                    <IconButton
                        aria-label={cta.label}
                        variant="link">
                        {cta.icon}
                    </IconButton>
                </a>
            ))}
        </Row>
    );
}
