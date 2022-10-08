import Link from 'next/link';
import { Box, Card, CardActionArea, CardContent, Stack } from '@mui/material';
import { ColorPaletteProp, Typography } from '@mui/joy';
import Chip from 'components/shared/indicators/Chip';
import ChannelLogo from './ChannelLogo';

interface ChannelGalleryItemProps {
    id: string;
    label: string;
    planned?: boolean;
    hrefFunc?: (id: string) => string
}

function ChannelGalleryItemChip(props: { label: string, color: ColorPaletteProp }) {
    return (
        <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Chip size="sm" color={props.color}>{props.label}</Chip>
        </Box>
    );
}

export default function ChannelGalleryItem(props: ChannelGalleryItemProps) {
    const { id, label, planned, hrefFunc } = props;

    return (
        <Card sx={{ width: 164, height: 164 }}>
            <Link href={hrefFunc ? hrefFunc(id) : `/channels/${id}`} passHref>
                <CardActionArea sx={{ height: '100%' }} >
                    <CardContent sx={{ height: '100%' }}>
                        {planned && <ChannelGalleryItemChip label="Soon" color="neutral" />}
                        {!planned && <ChannelGalleryItemChip label="New" color="info" />}
                        <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }} spacing={2}>
                            <ChannelLogo channelName={id} label={label} />
                            <Typography textAlign="center">{label}</Typography>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
}
