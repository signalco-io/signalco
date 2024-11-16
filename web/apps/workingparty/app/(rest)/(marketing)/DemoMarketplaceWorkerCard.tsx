import { Typography } from '@signalco/ui-primitives/Typography';
import { Row } from '@signalco/ui-primitives/Row';
import { Card } from '@signalco/ui-primitives/Card';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { initials } from '@signalco/js';
import { KnownPages } from '../../../src/knownPages';
import { marketplaceWorkers } from '../../../src/data/markerplaceWorkers';

export function DemoMarketplaceWorkerCard({ worker }: { worker: (typeof marketplaceWorkers)[0]; }) {
    return (
        <Card className="mt-4 p-4">
            <Row spacing={2} justifyContent="space-between">
                <Row spacing={2}>
                    <Avatar className="bg-foreground text-background">{initials(worker.name)}</Avatar>
                    <Typography>{worker.name}</Typography>
                </Row>
                <NavigatingButton
                    href={KnownPages.AppMerketplaceExploreWorker(worker.id)}
                    variant="outlined"
                    className="bg-background">
                    Hire
                </NavigatingButton>
            </Row>
        </Card>
    );
}
