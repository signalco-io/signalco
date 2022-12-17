import useIsClient from '@signalco/ui/src/hooks/useIsClient';
import { Share } from '@signalco/ui-icons';
import { IconButtonCopyToClipboard } from '@signalco/ui';

export default function ShareSocial() {
    const isClient = useIsClient();
    if (!isClient)
        return null;

    const value = window.location.href;
    return (
        <IconButtonCopyToClipboard
            title="Copy link to clipboard"
            value={value}
            successMessage={'Copied'}
            errorMessage={'Failed to copy'}>
            <Share />
        </IconButtonCopyToClipboard>
    );
}
