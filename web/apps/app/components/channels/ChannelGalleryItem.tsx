import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Chip } from '@signalco/ui-primitives/Chip';
import { Card } from '@signalco/ui-primitives/Card';
import type { ColorPaletteProp } from '@signalco/ui/theme';
import ChannelLogo from './ChannelLogo';

type ChannelGalleryItemProps = {
    id: string;
    label: string;
    planned?: boolean;
    hrefFunc?: (id: string) => string
}

function ChannelGalleryItemChip(props: { label: string, color: ColorPaletteProp }) {
    return (
        <div className="absolute right-2 top-2">
            <Chip size="sm" variant="solid" color={props.color}>{props.label}</Chip>
        </div>
    );
}

export default function ChannelGalleryItem(props: ChannelGalleryItemProps) {
    const { id, label, planned, hrefFunc } = props;

    return (
        <Card
            className="relative size-40"
            href={hrefFunc ? hrefFunc(id) : `/channels/${id}`}
        >
            {planned && <ChannelGalleryItemChip label="Soon" color="neutral" />}
            {/* {!planned && <ChannelGalleryItemChip label="New" color="info" />} */}
            <Stack alignItems="center" justifyContent="center" style={{ height: '100%', width: '100%' }} spacing={2}>
                <ChannelLogo channelName={id} label={label} />
                <Typography center>{label}</Typography>
            </Stack>
        </Card>
    );
}
