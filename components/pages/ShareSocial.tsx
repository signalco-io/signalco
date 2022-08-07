import ShareIcon from '@mui/icons-material/Share';
import { useId } from 'react';
import IconButtonCopyToClipboard from 'components/shared/form/IconButtonCopyToClipboard';
import useIsClient from 'src/hooks/useIsClient';

export default function ShareSocial() {
    const id = useId();
    const isClient = useIsClient();
    if (!isClient)
        return null;

    const value = window.location.href;
    return (
        <IconButtonCopyToClipboard edge id={id} title="Copy link to clipboard" value={value}>
            <ShareIcon />
        </IconButtonCopyToClipboard>
    );
}
