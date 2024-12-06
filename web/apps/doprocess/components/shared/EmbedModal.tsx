'use client';

import { Typography } from '@signalco/ui-primitives/Typography';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Modal } from '@signalco/ui-primitives/Modal';
import { Divider } from '@signalco/ui-primitives/Divider';
import { Button } from '@signalco/ui-primitives/Button';
import { showNotification } from '@signalco/ui-notifications';

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
        showNotification('Code copied to clipboard', 'info');
    };

    const iframeSize = { width: 294, height: 300 };
    const customCode = `<iframe src="${src}" width="${iframeSize.width}" height="${iframeSize.height}" frameborder="0" title="doprocess.app"></iframe>`;

    return (
        <Modal title={'Embed'} open={open} onOpenChange={onOpenChange} className="max-w-2xl p-0">
            <div className="grid md:grid-cols-[1fr_auto_1fr]">
                <Stack className="p-6 md:pr-4" spacing={2}>
                    <Typography level="h5">{header}</Typography>
                    <Typography level="body2">{subHeader}</Typography>
                    <div className="rounded bg-muted p-4">
                        <code className="break-all">
                            {code}
                        </code>
                    </div>
                    <Button className="self-end" onClick={handleCopy}>Copy</Button>
                </Stack>
                <Divider orientation="vertical" />
                <Stack className="hidden p-6 pl-4 md:flex" spacing={2}>
                    <Typography level="h5">Preview</Typography>
                    <div
                        className="w-fit overflow-hidden rounded-lg border"
                        dangerouslySetInnerHTML={{ __html: customCode }}></div>
                </Stack>
            </div>
        </Modal>
    );
}
