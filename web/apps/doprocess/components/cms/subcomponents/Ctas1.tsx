import { Button } from '@signalco/ui-primitives/Button';
import { type SectionData } from '@signalco/cms-core/SectionData';

export function Ctas1({ ctas }: { ctas: SectionData['ctas']; }) {
    if (!ctas?.length) {
        return null;
    }

    return (
        <div>
            {ctas.map((cta, index) => (
                <Button
                    key={cta.label}
                    variant={index === 0 ? 'solid' : 'outlined'}
                    href={cta.href}
                    className="w-full">
                    {cta.label}
                </Button>
            ))}
        </div>
    );
}
