'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Card, CardContent, CardTitle } from '@signalco/ui-primitives/Card';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { initials, orderBy } from '@signalco/js';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { marketplaceWorkers } from '../../../../../src/data/markerplaceWorkers';
import { WorkerModal } from './WorkerModal';
import { markeplaceCategoriesFlat, marketplaceCategories } from './layout';

function WorkerCard({ worker }: { worker: typeof marketplaceWorkers[0] }) {
    const { name, description, categories } = worker;
    const [_, setSelectedWorkerId] = useSearchParam('worker');

    const handleShowWorkerDetails = () => {
        setSelectedWorkerId(worker.id);
    }

    return (
        <Card className="border-none bg-transparent" onClick={handleShowWorkerDetails}>
            <div className="grid grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_auto] gap-x-2">
                <Avatar className="bg-foreground text-background">{initials(name)}</Avatar>
                <CardTitle className="self-center">{name}</CardTitle>
                <CardContent className="p-0 [grid-column:2] [grid-row:2]">
                    <Stack spacing={1}>
                        <Typography level="body1" secondary>{description}</Typography>
                        <Row spacing={1}>
                            {categories.map((category, categoryIndex) => (
                                <>
                                    {categoryIndex > 0 && <span className="text-sm opacity-30">•</span>}
                                    <Typography
                                        key={category}
                                        level="body2"
                                        tertiary
                                        semiBold>{markeplaceCategoriesFlat.find(c => c.id === category)?.name}</Typography>
                                </>
                            ))}
                        </Row>
                    </Stack>
                </CardContent>
            </div>
        </Card>
    );
}

export default function MarkerplacePage() {
    const [selectedCategoryId] = useSearchParam('category', marketplaceCategories[0]?.id);
    const selectedCategory = markeplaceCategoriesFlat.find((category) => category.id === selectedCategoryId);
    const filteredWorkers = orderBy(selectedCategoryId === 'explore'
        ? marketplaceWorkers
        : marketplaceWorkers.filter((worker) => worker.categories.includes(selectedCategoryId)),
        (wa, wb) => wa.name.localeCompare(wb.name));

    const [selectedWorkerId, setSelectedWorkerId] = useSearchParam('worker');
    const selectedWorker = marketplaceWorkers.find((worker) => worker.id === selectedWorkerId);

    const handleWorkerModalOpenChange = (open: boolean) => {
        if (!open) {
            setSelectedWorkerId(undefined);
        }
    }

    return (
        <>
            <Stack>
                <Row spacing={3} className="p-4">
                    <Typography level="h2" className="text-2xl">{selectedCategory?.name}</Typography>
                </Row>
                <div className="grid grid-cols-3 gap-4 gap-x-24 p-4">
                    {filteredWorkers.map((worker) => (
                        <WorkerCard key={worker.id} worker={worker} />
                    ))}
                </div>
            </Stack>
            {selectedWorker && (
                <WorkerModal
                    open={true}
                    onOpenChange={handleWorkerModalOpenChange}
                    worker={selectedWorker} />
            )}
        </>
    )
}
