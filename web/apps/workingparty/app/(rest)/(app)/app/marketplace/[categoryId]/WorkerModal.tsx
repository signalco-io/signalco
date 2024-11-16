'use client';

import { ComponentProps, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Modal } from '@signalco/ui-primitives/Modal';
import { Divider } from '@signalco/ui-primitives/Divider';
import { CardTitle } from '@signalco/ui-primitives/Card';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { initials } from '@signalco/js';
import { KnownPages } from '../../../../../../src/knownPages';
import { useWorkerCreateFromMarketplace } from '../../../../../../src/hooks/data/workers/useWorkerCreateFromMarketplace';
import { marketplaceWorkers } from '../../../../../../src/data/markerplaceWorkers';
import { markeplaceCategoriesFlat } from '../../../../../../src/data/markeplaceCategoriesFlat';

export function WorkerModal({
    open, onOpenChange, worker
}: { open: boolean; onOpenChange: ComponentProps<typeof Modal>['onOpenChange']; worker: (typeof marketplaceWorkers)[0]; }) {
    const { id, name, description, categories } = worker;
    const router = useRouter();
    const workerCreateFromMarketplace = useWorkerCreateFromMarketplace(id);

    const handleHireWorker = async () => {
        const result = await workerCreateFromMarketplace.mutateAsync();
        router.push(KnownPages.AppWorker(result.id));
    }

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <Stack spacing={2}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_auto] gap-x-2">
                    <Avatar className="bg-foreground text-background">{initials(name)}</Avatar>
                    <CardTitle className="self-center">{name}</CardTitle>
                    <div className="p-0 [grid-column:2] [grid-row:2]">
                        <Stack spacing={2}>
                            <Typography level="body1" secondary>{description}</Typography>
                            <div>
                                <NavigatingButton
                                    size="sm"
                                    onClick={handleHireWorker}
                                    loading={workerCreateFromMarketplace.isPending}>
                                    Hire now
                                </NavigatingButton>
                            </div>
                        </Stack>
                    </div>
                </div>
                <Divider />
                <Stack spacing={1}>
                    <Typography level="body3" uppercase bold>Categories</Typography>
                    <Row spacing={1}>
                        {categories.map((category, categoryIndex) => (
                            <Fragment key={category}>
                                {categoryIndex > 0 && <span className="text-sm opacity-30">•</span>}
                                <Link href={`${KnownPages.AppMarketplace}?category=${category}`}>
                                    <Typography
                                        key={category}
                                        level="body1"
                                        semiBold>{markeplaceCategoriesFlat.find(c => c.id === category)?.name}</Typography>
                                </Link>
                            </Fragment>
                        ))}
                    </Row>
                </Stack>
            </Stack>
        </Modal>
    );

}
