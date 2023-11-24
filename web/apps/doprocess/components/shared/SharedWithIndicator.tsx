import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Globe } from '@signalco/ui-icons';
import { ShareableEntity } from '../../src/types/ShareableEntity';

export function SharedWithIndicator({ shareableEntity }: { shareableEntity: ShareableEntity; }) {
    const isPublic = shareableEntity.sharedWithUsers.includes('public');

    if (!isPublic) {
        return null;
    }

    return (
        <Row spacing={0.5} className="opacity-70">
            <Globe size={16} />
            <Typography level="body3">Public</Typography>
        </Row>
    );
}
