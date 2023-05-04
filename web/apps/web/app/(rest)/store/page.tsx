'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, Close, ExternalLink, Hourglass } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { SelectItems } from '@signalco/ui/dist/SelectItems';
import { Row } from '@signalco/ui/dist/Row';
import { Gallery } from '@signalco/ui/dist/Gallery';
import { FilterList } from '@signalco/ui/dist/FilterList';
import { Chip } from '@signalco/ui/dist/Chip';
import { ColorVariants  } from '@signalco/ui';
import { Card } from "@signalco/ui/dist/Card";
import PageCenterHeader from '../../../components/pages/PageCenterHeader';
import SignalcoLogo from '../../../components/icons/SignalcoLogo';
import contentData from './content.json';

function StoreStockStatusBadge(props: { status: number | undefined }) {
    let Icon = Close;
    let opacity = 0.6;
    let text = 'Out of stock';
    let color: ColorVariants = 'neutral';
    switch (props.status) {
    default:
    case 0:
        break;
    case 1:
        Icon = Check;
        opacity = 1;
        text = 'In stock';
        color = 'success';
        break;
    case 2:
        Icon = ExternalLink;
        opacity = 1;
        text = 'Sold elsewhere';
        color = 'neutral';
        break;
    case 3:
        Icon = Hourglass;
        opacity = 1;
        text = 'On backorder';
        color = 'warning';
        break;
    }

    return (
        <Row justifyItems="center" style={{ opacity: opacity }}>
            <Icon color={color} />
            &nbsp;
            <Typography level="body2" color={color}>{text}</Typography>
        </Row>
    );
}

function StoreItemThumb(props: { id: string, name: string, features?: string[], imageSrc?: string, price?: number, stockStatus?: number }) {
    const { name, features, imageSrc, price, stockStatus } = props;

    return (
        <Card sx={{ width: '222px' }}>
            <Stack spacing={2}>
                {imageSrc
                    ? <Image src={imageSrc} alt={`${name} image`} width={180} height={180} />
                    : (
                        <Stack alignItems="center" justifyContent="center" spacing={2} style={{ width: 180, height: 180, textAlign: 'center' }}>
                            <SignalcoLogo height={40} />
                            <Typography level="body2">Image unavailable</Typography>
                        </Stack>
                    )}
                <Stack spacing={2}>
                    <Typography bold opacity={0.9}>{name}</Typography>
                    <Row spacing={2} justifyContent="space-between" alignItems="center">
                        <Typography level="h5" bold>€&nbsp;{price ?? '-'}</Typography>
                        <StoreStockStatusBadge status={stockStatus} />
                    </Row>
                    {features && (
                        <Row spacing={1}>
                            {features.map(f => <Chip size="sm" key={f}>{f}</Chip>)}
                        </Row>
                    )}
                </Stack>
            </Stack>
        </Card>
    );
}

const orderByItems = [
    { value: '0', label: 'Popularity' },
    { value: '1', label: 'Price low > high' },
    { value: '2', label: 'Price high > low' }
];

function stockStatus(id: string) {
    if ((contentData.stock as any)[id]?.inStock > 0) return 1;
    return 0;
}

export default function StorePage() {
    const props = {
        categories: Array.from(new Set(contentData.items.flatMap(i => i.categories))).filter(i => i),
        brands: Array.from(new Set(contentData.items.map(i => i.manufacturer ?? null))).filter(i => i),
        communication: Array.from(new Set(contentData.items.flatMap(i => i.communication ?? null))).filter(i => i)
    };

    // TODO: Localize
    // const { t: tCategories } = useLocale('Store', 'Categories');
    // const { t: tCommunication } = useLocale('Store', 'Communication');
    const tCategories = (key: string) => key;
    const tCommunication = (key: string) => key;
    const categories = props.categories.filter(b => typeof b !== 'undefined').map(c => ({ id: c!, label: tCategories(c!) }));
    const brands = props.brands.filter(b => typeof b !== 'undefined').map(b => ({ id: b!, label: b! }));
    const communication = props.communication.filter(b => typeof b !== 'undefined').map(b => ({ id: b!, label: tCommunication(b!) }));

    const items = contentData.items.map(i => ({
        id: i.id,
        name: i.name,
        label: i.name,
        features: [...i.categories, ...(i.communication ?? [])],
        imageSrc: i.imagesCount ? `/store/${i.id}_cover.png` : undefined,
        stockStatus: stockStatus(i.id)
    }));

    const [selectedOrderByItems, setSelectedOrderByItems] = useState<string[]>(['0']);
    const handleOrderByItemsChange = (values: string[]) => setSelectedOrderByItems(values);

    return (
        <Stack spacing={8}>
            <PageCenterHeader header="Store" subHeader="Discover your new smart home" />
            <Gallery
                items={items}
                itemComponent={StoreItemThumb}
                filters={() => (
                    <>
                        <FilterList header="Categories" items={categories} truncate={6} multiple />
                        <FilterList header="Brands" items={brands} truncate={6} multiple />
                        <FilterList header="Communication" items={communication} truncate={6} multiple />
                    </>
                )}
                gridHeader={`Found ${items.length} products`}
                gridFilters={(<SelectItems label="Sort" value={selectedOrderByItems} items={orderByItems} onChange={handleOrderByItemsChange} />)} />
        </Stack>
    );
}
