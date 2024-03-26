'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { orderBy } from '@signalco/js';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { marketplaceWorkers } from '../../../../../../src/data/markerplaceWorkers';
import { WorkerModal } from './WorkerModal';
import { WorkerCard } from './WorkerCard';
import { markeplaceCategoriesFlat } from './markeplaceCategoriesFlat';

export default function MarketplaceCategoryPage({ params }: { params: { categoryId: string } }) {
    const { categoryId } = params;
    const selectedCategory = markeplaceCategoriesFlat.find((category) => category.id === categoryId);
    const filteredWorkers = orderBy(categoryId === 'explore'
        ? marketplaceWorkers
        : marketplaceWorkers.filter((worker) => worker.categories.includes(categoryId)),
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
            <Stack className="h-screen overflow-hidden">
                <Row spacing={3} className="h-[58px] min-h-[58px] border-b px-4">
                    <Typography level="h2" className="text-2xl">{selectedCategory?.name}</Typography>
                </Row>
                <div className="grid grid-cols-1 gap-4 gap-x-24 overflow-y-auto p-4 lg:grid-cols-2 xl:grid-cols-3">
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