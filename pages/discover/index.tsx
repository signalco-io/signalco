import { Box, Button, Checkbox, Container, Grid, List, MenuItem, Paper, Select, Typography } from "@material-ui/core";
import Stack from "@material-ui/core/Stack";
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@material-ui/core/ListItemButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React from "react";
import { ArrowDownward as ArrowDownwardIcon, Cancel as CancelIcon, Check, CheckCircle } from "@material-ui/icons";
import Image from 'next/image';
import { amber, green, grey } from "@material-ui/core/colors";
import LaunchIcon from '@material-ui/icons/Launch';
import SelectItems from "../../components/shared/form/SelectItems";
import { useState } from "react";

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
            <List subheader={header}>
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
                        <ListItemText id={item.id} primary={item.label} />
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

const StoreStockStatusBadge = (props: { status: number }) => {
    let Icon = CancelIcon;
    let opacity = 0.6;
    let text = "Out of stock";
    let color: string = grey[400];
    switch (props.status) {
        default:
        case 0:
            break;
        case 1:
            Icon = CheckCircle;
            opacity = 1;
            text = "In stock";
            color = green[400];
            break;
        case 2:
            Icon = LaunchIcon;
            opacity = 1;
            text = "Sold elsewhere";
            color = grey[400];
            break;
        case 3:
            Icon = CheckCircle;
            opacity = 1;
            text = "On backorder";
            color = amber[400];
            break;
    }

    return (
        <Stack direction="row" justifyItems="center" alignItems="center" sx={{ opacity: opacity }}>
            <Icon sx={{ fontSize: '1.3em', color: color }} />
            &nbsp;
            <Typography variant="subtitle2" sx={{ color: color }}>{text}</Typography>
        </Stack>
    );
}

const StoreItemThumb = (props: { id: string, name: string, imageSrc: string, price: number, stockStatus: number }) => {
    return (
        <Paper variant="elevation" elevation={6} sx={{ p: 3 }}>
            <Stack spacing={4}>
                <Image src={props.imageSrc} alt={`${props.name} image`} width={180} height={180} />
                <Stack spacing={1}>
                    <Typography>{props.name}</Typography>
                    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                        <Typography fontSize="1.2em" fontWeight="bold">€&nbsp;{props.price}</Typography>
                        <StoreStockStatusBadge status={props.stockStatus} />
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
};

const StoreIndex = () => {
    const categories = [
        { id: 'lights', label: "Lights" }
    ];
    const brands = [
        { id: 'philips', label: "Philips" },
        { id: 'philips', label: "Philips" },
        { id: 'philips', label: "Philips" },
        { id: 'philips', label: "Philips" },
        { id: 'philips', label: "Philips" },
        { id: 'philips', label: "Philips" },
        { id: 'philips', label: "Philips" },
        { id: 'philips', label: "Philips" },
        { id: 'philips', label: "Philips" }
    ];
    const communication = [
        { id: 'zigbee', label: "Zigbee" },
        { id: 'bluetooth', label: "Bluetooth" },
        { id: 'wifi', label: "Wi-Fi" },
        { id: 'radio', label: "Radio (433/868 MHz)" },
        { id: 'ir', label: "Infrared" }
    ];

    const items = [
        { id: 'item1', name: 'Item 1', imageSrc: '/images/icon-light-512x512.png', price: 100, stockStatus: 0 },
        { id: 'item2', name: 'Item 2', imageSrc: '/images/icon-light-512x512.png', price: 29, stockStatus: 1 },
        { id: 'item3', name: 'Item 3', imageSrc: '/images/icon-light-512x512.png', price: 29, stockStatus: 2 },
        { id: 'item4', name: 'Item 4', imageSrc: '/images/icon-light-512x512.png', price: 1945, stockStatus: 3 }
    ];

    const [selectedOrderByItems, setSelectedOrderByItems] = useState<string[]>(["0"]);
    const handleOrderByItemsChange = (values: string[]) => setSelectedOrderByItems(values);
    const orderByItems = [
        { value: "0", label: "Popularity" },
        { value: "1", label: "Price low > high" },
        { value: "2", label: "Price high > low" }
    ];

    return (<>
        <Stack>
            <Box sx={{ zIndex: -1 }}>
                <Box sx={{ display: 'block', height: '30vh' }}></Box>
                <Box sx={{
                    background: 'url(/store/a8180d61445001.5a6f32ba4b7a4.jpg)',
                    backgroundSize: 'cover',
                    backgroundPositionY: '90%',
                    backgroundPositionX: '50%',
                    height: "30vh",
                    width: '100%',
                    display: 'block',
                    position: 'fixed',
                    top: 0
                }}></Box>
                <Box sx={{
                    backdropFilter: 'blur(2px)',
                    background: 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 90%, rgba(0,0,0,0) 100%);',
                    height: '75%',
                    width: '100%',
                    position: 'absolute',
                    bottom: 0
                }}></Box>
            </Box>
            <Container sx={{ py: 8 }}>
                <Stack direction="row" spacing={4}>
                    <Paper variant="elevation" elevation={6} sx={{ padding: 4, width: '100%', maxWidth: 360 }}>
                        <Stack spacing={4}>
                            <FilterList header="Categories" items={categories} truncate={6} />
                            <FilterList header="Brands" items={brands} truncate={6} />
                            <FilterList header="Communication" items={communication} truncate={999} />
                        </Stack>
                    </Paper>
                    <Stack spacing={4}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography gutterBottom variant="h1">Found {items.length} products</Typography>
                            <SelectItems value={selectedOrderByItems} items={orderByItems} onChange={handleOrderByItemsChange} />
                        </Stack>
                        <div>
                            <Grid container spacing={4} alignContent="flex-start">
                                {items.map(item => (
                                    <Grid item key={item.id}>
                                        <StoreItemThumb {...item} />
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    </Stack>
                </Stack>
            </Container>
        </Stack>
    </>
    );
};

export default StoreIndex;