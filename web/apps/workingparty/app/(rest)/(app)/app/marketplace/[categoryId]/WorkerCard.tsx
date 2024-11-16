'use client';

import { Fragment } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Card, CardContent, CardHeader, CardTitle } from '@signalco/ui-primitives/Card';
import { Avatar } from '@signalco/ui-primitives/Avatar';
import { initials } from '@signalco/js';
import { useSearchParam } from '@signalco/hooks/useSearchParam';
import { marketplaceWorkers } from '../../../../../../src/data/markerplaceWorkers';
import { markeplaceCategoriesFlat } from '../../../../../../src/data/markeplaceCategoriesFlat';

export function WorkerCard({ worker }: { worker: (typeof marketplaceWorkers)[0]; }) {
    const { name, description, categories } = worker;
    const [, setSelectedWorkerId] = useSearchParam('worker');

    const handleShowWorkerDetails = () => {
        setSelectedWorkerId(worker.id);
    };

    return (
        <Card onClick={handleShowWorkerDetails}>
            <CardHeader>
                <Row spacing={2}>
                    <Avatar className="">{initials(name)}</Avatar>
                    <CardTitle className="self-center">{name}</CardTitle>
                </Row>
            </CardHeader>
            <CardContent className="[grid-column:2] [grid-row:2]">
                <Stack spacing={1}>
                    <Typography level="body1">{description}</Typography>
                    <Row spacing={1}>
                        {categories.map((category, categoryIndex) => (
                            <Fragment key={category}>
                                {categoryIndex > 0 && <span className="text-sm opacity-30">•</span>}
                                <Typography
                                    level="body3"
                                    noWrap
                                    semiBold>{markeplaceCategoriesFlat.find(c => c.id === category)?.name}</Typography>
                            </Fragment>
                        ))}
                    </Row>
                </Stack>
            </CardContent>
        </Card>
    );
}
