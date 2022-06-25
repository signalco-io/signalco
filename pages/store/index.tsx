import { Box, Button, Card, CardActionArea, CardContent, Checkbox, Chip, Grid, List, Paper, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { ArrowDownward as ArrowDownwardIcon, Cancel as CancelIcon, CheckCircle } from '@mui/icons-material';
import Image from 'next/image';
import { amber, green, grey } from '@mui/material/colors';
import LaunchIcon from '@mui/icons-material/Launch';
import SelectItems from '../../components/shared/form/SelectItems';
import { useState } from 'react';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import contentData from './content.json';
import { PageLayout } from '../../components/layouts/PageLayout';
import SignalcoLogo from '../../components/icons/SignalcoLogo';
import useLocale from '../../src/hooks/useLocale';

const FilterList = (props: { header: string, items: { id: string, label: string }[], truncate: number }) => {
    const {
        header,
        items,
        truncate
    } = props;

    const [checked, setChecked] = React.useState<string[]>([]);
    const [isShowMore, setIsShowMore] = React.useState<boolean>(false);
    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    const handleToggleShowMore = () => setIsShowMore(true);

    return (
        <Stack>
            <List subheader={
                <Stack direction="row" spacing={1}>
                    <Typography>{header}</Typography>
                    {(!isShowMore && items.length > truncate) && <Typography color="textSecondary">({items.length - truncate} more)</Typography>}
                </Stack>}>
                {items.slice(0, isShowMore ? items.length : truncate).map(item => (
                    <ListItemButton key={item.id} role={undefined} onClick={handleToggle(item.id)} sx={{ py: 0 }}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={checked.indexOf(item.id) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': item.id }}
                            />
                        </ListItemIcon>
                        <ListItemText id={item.id} primary={item.label} primaryTypographyProps={{ noWrap: true }} />
                    </ListItemButton>
                ))}
            </List>
            {(!isShowMore && items.length > truncate) && (
                <Box>
                    <Button startIcon={<ArrowDownwardIcon />} onClick={handleToggleShowMore}>Show all</Button>
                </Box>
            )}
        </Stack>
    );
};

const StoreStockStatusBadge = (props: { status: number | undefined }) => {
    let Icon = CancelIcon;
    let opacity = 0.6;
    let text = 'Out of stock';
    let color: string = grey[400];
    switch (props.status) {
        default:
        case 0:
            break;
        case 1:
            Icon = CheckCircle;
            opacity = 1;
            text = 'In stock';
            color = green[400];
            break;
        case 2:
            Icon = LaunchIcon;
            opacity = 1;
            text = 'Sold elsewhere';
            color = grey[400];
            break;
        case 3:
            Icon = WatchLaterIcon;
            opacity = 1;
            text = 'On backorder';
            color = amber[400];
            break;
    }

    return (
        <Stack direction="row" justifyItems="center" alignItems="center" sx={{ opacity: opacity }}>
            <Icon sx={{ fontSize: '1.3rem', color: color }} />
            &nbsp;
            <Typography fontSize="0.8rem" sx={{ color: color }}>{text}</Typography>
        </Stack>
    );
}

const StoreItemThumb = (props: { id: string, name: string, features?: string[], imageSrc?: string, price?: number, stockStatus?: number }) => {
    const { id, name, features, imageSrc, price, stockStatus } = props;

    return (
        <Card variant="elevation">
            <CardActionArea>
                <CardContent>
                    <Stack spacing={2}>
                        {imageSrc
                            ? <Image src={imageSrc} alt={`${name} image`} width={180} height={180} objectFit="contain" />
                            : (
                                <Stack alignItems="center" justifyContent="center" textAlign="center" spacing={2} sx={{ width: 180, height: 180 }}>
                                    <SignalcoLogo height={40} />
                                    <Typography variant="caption" color="textSecondary">Image unavailable</Typography>
                                </Stack>
                            )}
                        <Stack spacing={1}>
                            <Typography fontWeight="bold" sx={{ opacity: 0.9 }}>{name}</Typography>
                            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                                <Typography fontSize="1.2rem" fontWeight="bold">€&nbsp;{price ?? '-'}</Typography>
                                <StoreStockStatusBadge status={stockStatus} />
                            </Stack>
                            {features && (
                                <Grid container>
                                    {features.map(f => <Grid item key={f}><Chip label={f} size="small" /></Grid>)}
                                </Grid>
                            )}
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export async function getStaticProps() {
    return {
        props: {
            categories: Array.from(new Set(contentData.items.flatMap(i => i.categories))).filter(i => i),
            brands: Array.from(new Set(contentData.items.map(i => i.manufacturer ?? null))).filter(i => i),
            communication: Array.from(new Set(contentData.items.flatMap(i => i.communication ?? null))).filter(i => i)
        }
    };
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

const StoreIndex = (props: { categories: string[], brands: string[], communication: string[] }) => {
    const { t: tCategories } = useLocale('Store', 'Categories');
    const { t: tCommunication } = useLocale('Store', 'Communication');
    const categories = props.categories.map(c => ({ id: c, label: tCategories(c) }));
    const brands = props.brands.map(b => ({ id: b, label: b }));
    const communication = props.communication.map(b => ({ id: b, label: tCommunication(b) }));

    const items = contentData.items.map(i => ({
        id: i.id,
        name: i.name,
        features: [...i.categories, ...(i.communication ?? [])],
        imageSrc: i.imagesCount ? `/store/${i.id}_cover.png` : undefined,
        stockStatus: stockStatus(i.id)
    }));

    const [selectedOrderByItems, setSelectedOrderByItems] = useState<string[]>(['0']);
    const handleOrderByItemsChange = (values: string[]) => setSelectedOrderByItems(values);

    return (
        <Stack spacing={8}>
            <Box sx={{ zIndex: -1 }}>
                <Typography variant="h1">Discover your new smart home</Typography>
            </Box>
            <Stack direction="row" spacing={4}>
                <Box sx={{ padding: 2, width: '100%', maxWidth: 360, height: 'fit-content' }}>
                    <Stack spacing={4}>
                        <FilterList header="Categories" items={categories} truncate={6} />
                        <FilterList header="Brands" items={brands} truncate={6} />
                        <FilterList header="Communication" items={communication} truncate={6} />
                    </Stack>
                </Box>
                <Stack spacing={4}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography gutterBottom variant="h1">Found {items.length} products</Typography>
                        <SelectItems label="Sort" value={selectedOrderByItems} items={orderByItems} onChange={handleOrderByItemsChange} />
                    </Stack>
                    <div>
                        <Grid container spacing={3} alignContent="flex-start">
                            {items.map(item => (
                                <Grid item key={item.id} sx={{ width: '252px' }}>
                                    <StoreItemThumb {...item} />
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </Stack>
            </Stack>
        </Stack>
    );
};

StoreIndex.layout = PageLayout;

export default StoreIndex;
