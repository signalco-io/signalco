'use client';
import { Typography } from '@signalco/ui/Typography';
import { Stack } from '@signalco/ui/Stack';
import { Modal } from '@signalco/ui/Modal';
import { Button } from '@signalco/ui/Button';

export function EmbedModal({
    header, subHeader, src, open, onOpenChange
}: {
    header: React.ReactNode;
    subHeader: React.ReactNode;
    src: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const code = `<iframe src="${src}" width="100%" height="100%" frameborder="0" title="doprocess.app"></iframe>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        // TODO: Show notification
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <Stack className="p-2" spacing={2}>
                <Typography level="h3">{header}</Typography>
                <Typography>{subHeader}</Typography>
                <div className="rounded bg-muted p-4">
                    <code className="break-all">
                        {code}
                    </code>
                </div>
                <Button className="self-end" onClick={handleCopy}>Copy</Button>
            </Stack>
        </Modal>
    );
}
