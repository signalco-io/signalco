'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { SearchInput } from '@signalco/ui/SearchInput';
import { orderBy } from '@signalco/js';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { marketplaceWorkers } from '../../../../../../src/data/markerplaceWorkers';
import { markeplaceCategoriesFlat } from '../../../../../../src/data/markeplaceCategoriesFlat';
import { WorkerModal } from './WorkerModal';
import { WorkerCard } from './WorkerCard';

// TODO: Make server-side page

export default function MarketplaceCategoryPage() {
    const params = useParams<{ categoryId: string }>();
    const { categoryId } = params;
    const selectedCategory = markeplaceCategoriesFlat.find((category) => category.id === categoryId);
    const filteredWorkers = useMemo(() => orderBy(categoryId === 'explore'
        ? marketplaceWorkers
        : marketplaceWorkers.filter((worker) => worker.categories.includes(categoryId)),
        (wa, wb) => wa.name.localeCompare(wb.name)),
        [categoryId]);
    const [searchFilteredItems, setSearchFilteredItems] = useState(filteredWorkers);

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
                <Row spacing={3} justifyContent="space-between" className="h-[58px] min-h-[58px] border-b px-4">
                    <Typography level="h2" className="text-2xl">{selectedCategory?.name}</Typography>
                    <SearchInput items={filteredWorkers} onFilteredItems={setSearchFilteredItems} />
                </Row>
                <div className="grid grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-2 xl:grid-cols-3">
                    {searchFilteredItems.map((worker) => (
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