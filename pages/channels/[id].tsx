import { Button, List, ListItem, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import ChannelLogo from 'components/channels/ChannelLogo';
import { useRouter } from 'next/router';
import { PageLayout } from '../../components/layouts/PageLayout';
import channels from './channelsData.json';
import categories from './channelCategoriesData.json';
import ShareSocial from 'components/pages/ShareSocial';
import { PageWithMetadata } from 'pages/_app';

const ChannelPage: PageWithMetadata = () => {
    const router = useRouter();
    const id = router.query.id as string;
    const channel = channels.find(c => c.id === id);
    const channelCategories = channel?.categories.map(cc => categories.find(category => category.id === cc)).filter(cc => cc);

    return (
        <Stack spacing={8}>
            <Stack spacing={4}>
                <ChannelLogo id={id} label={channel?.label} />
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h1">{channel?.label} channel</Typography>
                    <ShareSocial />
                </Stack>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="space-between">
                <Stack spacing={2}>
                    {channel?.description && <Typography>{channel?.description}</Typography>}
                    <Typography>Connect {channel?.label} channel with any of your favorite apps and devices in just a few clicks.</Typography>
                </Stack>
                <Paper sx={{ px: 2, pt: 2 }}>
                    <Typography variant="h5">Categories</Typography>
                    <List>
                        {channelCategories?.map(category => {
                            return (
                                <ListItem key={category?.id} disableGutters>
                                    <ListItemButton href={`/channels?category=${category?.id}`}>
                                        <ListItemText>{category?.label}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button href={`/app/channels/${id}`} disabled={channel?.planned} variant="contained" color="primary">Use this channel</Button>
                {channel?.planned && <Typography>Available soon</Typography>}
            </Stack>
        </Stack>
    );
};

ChannelPage.layout = PageLayout;
const isClient = typeof window !== 'undefined';
const clientWindow = isClient ? window : undefined;
const pathNameSplit = clientWindow?.location.pathname.split('/') ?? [];
const channelName = channels.find(c => c.id === (pathNameSplit.length ? pathNameSplit[pathNameSplit.length - 1] : undefined))?.label;
ChannelPage.title = channelName ? channelName : 'Channel';

export default ChannelPage;
