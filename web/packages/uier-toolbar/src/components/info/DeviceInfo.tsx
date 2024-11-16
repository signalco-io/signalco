'use client';

import { useContext, useState } from 'react';
import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Popper } from '@signalco/ui-primitives/Popper';
import { Desktop, Mobile, Tablet } from '@signalco/ui-icons';
import { camelToSentenceCase } from '@signalco/js';
import { CommentsBootstrapperContext } from '../CommentsBootstrapperContext';
import { type CommentItem } from '../@types/Comments';

export function DeviceInfo({ device }: { device?: CommentItem['device'] }) {
    const { rootElement } = useContext(CommentsBootstrapperContext);
    const [open, setOpen] = useState(false);
    const deviceSize = device?.size;
    const DeviceSizeIcon = deviceSize === 'desktop'
        ? Desktop
        : (deviceSize === 'tablet'
            ? Tablet
            : (deviceSize === 'mobile'
                ? Mobile
                : null));

    if (!DeviceSizeIcon) return null;

    return (
        <Popper
            open={open}
            // onMouseLeave={() => setOpen(false)}
            container={rootElement}
            anchor={(
                <DeviceSizeIcon size={14} className="text-secondary-foreground" onMouseEnter={() => setOpen(true)} />
            )}>
            <Stack spacing={0.5} className="rounded-md px-2 py-1 text-background">
                {device?.browser && <Typography level="body2" title={device.userAgent}>{device.browser}</Typography>}
                {device?.os && <Typography level="body2">{device.os}</Typography>}
                {deviceSize && <Typography level="body2">{camelToSentenceCase(deviceSize)}</Typography>}
                {device?.windowSize && <Typography level="body2">{device.windowSize[0]}x{device.windowSize[1]}</Typography>}
                {device?.pixelRatio && <Typography level="body2">(x{device.pixelRatio})</Typography>}
            </Stack>
        </Popper>
    );
}