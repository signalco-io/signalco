'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { SelectItems } from '@signalco/ui-primitives/SelectItems';
import { Modal } from '@signalco/ui-primitives/Modal';
import { cx } from '@signalco/ui-primitives/cx';
import { Button } from '@signalco/ui-primitives/Button';
import { Globe } from '@signalco/ui-icons';
import { CopyToClipboardInput } from '@signalco/ui/CopyToClipboardInput';
import { ShareableEntity } from '../../src/types/ShareableEntity';

type ShareModalProps = {
    header: string;
    shareableEntity: ShareableEntity;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onShareChange: (shareableEntity: ShareableEntity) => void;
    hideTrigger?: boolean;
    src: string;
    tertiary?: boolean;
};

export function ShareModal({ header, shareableEntity, open, hideTrigger, src, onOpenChange, onShareChange, tertiary = true }: ShareModalProps) {
    const linkAccess = shareableEntity.sharedWithUsers.includes('public') ? 'public' : 'private';

    const handleLinkAccessChange = (value: string) => {
        onShareChange({
            sharedWithUsers: value === 'public'
                ? [...shareableEntity.sharedWithUsers, 'public']
                : [...shareableEntity.sharedWithUsers.filter((user) => user !== 'public')]
        });
    };

    return (
        <Modal
            title="Share"
            open={open}
            onOpenChange={onOpenChange}
            trigger={(
                <Button
                    variant="plain"
                    size={tertiary ? 'sm' : 'md'}
                    startDecorator={<Globe size={tertiary ? 16 : 20} />}
                    className={cx(tertiary ? 'gap-1' : 'gap-2', hideTrigger && 'hidden', tertiary && 'text-secondary-foreground text-sm font-normal')}
                    onClick={() => onOpenChange(true)}>
                    Public
                </Button>
            )}>
            <Stack spacing={2}>
                <Typography level="h5">{header}</Typography>
                <Stack spacing={1}>
                    <Typography level="body2" tertiary>Link access</Typography>
                    <div className="grid grid-cols-[auto_1fr] gap-1">
                        <SelectItems
                            value={linkAccess}
                            onValueChange={handleLinkAccessChange}
                            items={[
                                { value: 'public', label: 'Public' },
                                { value: 'private', label: 'Private' }
                            ]} />
                        <CopyToClipboardInput fullWidth defaultValue={src} />
                    </div>
                </Stack>
            </Stack>
        </Modal>
    );
}
