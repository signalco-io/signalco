import Link from 'next/link';
import { Chip, Card, ColorPaletteProp, Typography, JoyLink } from '@signalco/ui';
import { Box, Stack } from '@mui/system';
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
            <Chip size="sm" variant="solid" color={props.color}>{props.label}</Chip>
        </Box>
    );
}

export default function ChannelGalleryItem(props: ChannelGalleryItemProps) {
    const { id, label, planned, hrefFunc } = props;

    return (
        <Card variant="soft" sx={{
            width: 164,
            height: 164,
            '&:hover': { boxShadow: 'md', backgroundColor: 'neutral.softHoverBg' },
        }}>
            <Link
                href={hrefFunc ? hrefFunc(id) : `/channels/${id}`}
                passHref
                style={{ height: '100%', width: '100%' }}
                legacyBehavior>
                <JoyLink overlay sx={{ height: '100%', width: '100%' }}>
                    {planned && <ChannelGalleryItemChip label="Soon" color="neutral" />}
                    {!planned && <ChannelGalleryItemChip label="New" color="info" />}
                    <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', width: '100%' }} spacing={2}>
                        <ChannelLogo channelName={id} label={label} />
                        <Typography textAlign="center">{label}</Typography>
                    </Stack>
                </JoyLink>
            </Link>
        </Card>
    );
}
