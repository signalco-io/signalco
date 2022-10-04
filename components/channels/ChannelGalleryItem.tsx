import Link from 'next/link';
import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import ChannelLogo from './ChannelLogo';

interface ChannelGalleryItemProps {
    id: string;
    label: string;
    planned?: boolean;
    hrefFunc?: (id: string) => string
}

export default function ChannelGalleryItem(props: ChannelGalleryItemProps) {
    const { id, label, planned, hrefFunc } = props;

    return (
        <Card sx={{ width: 164, height: 164, bgcolor: 'divider' }}>
            <Link href={hrefFunc ? hrefFunc(id) : `/channels/${id}`} passHref>
                <CardActionArea sx={{ height: '100%' }} >
                    <CardContent sx={{ height: '100%' }}>
                        {planned && <Chip label="Soon" size="small" color="default" sx={{ position: 'absolute', right: 8, top: 8 }} />}
                        {!planned && <Chip label="New" size="small" color="info" sx={{ position: 'absolute', right: 8, top: 8 }} />}
                        <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }} spacing={2}>
                            <ChannelLogo channelName={id} label={label} />
                            <Typography textAlign="center" variant="h5">{label}</Typography>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
}
